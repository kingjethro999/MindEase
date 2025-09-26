import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Pause, Play, RotateCcw, Palette } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import { saveExerciseCompletion } from '../../utils/offlineStorage';
import { awardExperience, checkAchievements, saveAchievement } from '../../utils/gamification';
import { NotificationBanner } from '../../components/NotificationBanner';

const { width, height } = Dimensions.get('window');

interface ColorTile {
  id: string;
  color: string;
  targetColor: string;
  isCorrect: boolean;
  scale: Animated.Value;
  opacity: Animated.Value;
}

interface ColorPattern {
  id: number;
  name: string;
  description: string;
  colors: string[];
  targetColors: string[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function ColorHarmonyGame() {
  const { user } = useAuth();
  const [currentPattern, setCurrentPattern] = useState(0);
  const [colorTiles, setColorTiles] = useState<ColorTile[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [correctTiles, setCorrectTiles] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [notification, setNotification] = useState<any>(null);
  
  const gameTimer = useRef<number | null>(null);

  const colorPatterns: ColorPattern[] = [
    {
      id: 1,
      name: "Ocean Breeze",
      description: "Create a calming ocean color palette",
      colors: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
      targetColors: ['#4ECDC4', '#45B7D1', '#96CEB4', '#85C1E9', '#AED6F1', '#D5DBDB'],
      timeLimit: 90,
      difficulty: 'easy'
    },
    {
      id: 2,
      name: "Sunset Serenity",
      description: "Match the warm colors of a peaceful sunset",
      colors: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
      targetColors: ['#FF6B9D', '#FFEAA7', '#F7DC6F', '#F8C471', '#F39C12', '#E67E22', '#D35400', '#A04000'],
      timeLimit: 120,
      difficulty: 'medium'
    },
    {
      id: 3,
      name: "Forest Harmony",
      description: "Arrange the natural greens of a tranquil forest",
      colors: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'],
      targetColors: ['#96CEB4', '#98D8C8', '#A9DFBF', '#82E0AA', '#58D68D', '#52C41A', '#7CB342', '#8BC34A', '#9CCC65', '#AED581'],
      timeLimit: 150,
      difficulty: 'hard'
    }
  ];

  useEffect(() => {
    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
      }
    };
  }, []);

  const generateColorTiles = (pattern: ColorPattern): ColorTile[] => {
    const tiles: ColorTile[] = [];
    const shuffledColors = [...pattern.colors].sort(() => Math.random() - 0.5);
    
    shuffledColors.forEach((color, index) => {
      tiles.push({
        id: `tile-${index}`,
        color: color,
        targetColor: pattern.targetColors[index],
        isCorrect: false,
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1)
      });
    });
    
    return tiles;
  };

  const startGame = () => {
    const pattern = colorPatterns[currentPattern];
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(pattern.timeLimit);
    setScore(0);
    setCorrectTiles(0);
    setColorTiles(generateColorTiles(pattern));
    
    // Start timer
    gameTimer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTilePress = (tileId: string) => {
    if (!isPlaying || isPaused) return;

    setColorTiles(prev => {
      const tile = prev.find(t => t.id === tileId);
      if (!tile || tile.isCorrect) return prev;

      // Check if color matches target
      const isCorrect = tile.color === tile.targetColor;
      
      if (isCorrect) {
        // Correct match
        tile.isCorrect = true;
        

        // Animate successful match
        Animated.sequence([
          Animated.timing(tile.scale, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(tile.scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        // Update score and correct count
        setScore(prev => prev + 50);
        setCorrectTiles(prev => prev + 1);

        // Check if all tiles are correct
        const allCorrect = prev.every(t => t.id === tileId ? true : t.isCorrect);
        if (allCorrect) {
          setTimeout(() => endGame(true), 500);
        }
      } else {
        // Wrong match - animate error
        Animated.sequence([
          Animated.timing(tile.scale, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(tile.scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        // Small penalty for wrong match
        setScore(prev => Math.max(0, prev - 10));
      }

      return [...prev];
    });
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameStarted(false);
    setIsPaused(false);
    setTimeLeft(0);
    setScore(0);
    setCorrectTiles(0);
    setColorTiles([]);
    
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
    }
  };

  const nextPattern = () => {
    if (currentPattern < colorPatterns.length - 1) {
      setCurrentPattern(prev => prev + 1);
      resetGame();
    } else {
      // All patterns completed
      endGame(true);
    }
  };

  const endGame = async (completed: boolean) => {
    setIsPlaying(false);
    setIsPaused(false);
    
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
    }

    const pattern = colorPatterns[currentPattern];
    const gameDuration = pattern.timeLimit - timeLeft;
    const finalScore = score + (completed ? 200 : 0); // Bonus for completion
    const accuracy = pattern.colors.length > 0 ? Math.round((correctTiles / pattern.colors.length) * 100) : 0;
    
    // Award experience and check achievements
    try {
      const userId = user?.id || 'anonymous_user';
      const expGained = awardExperience('game_session', gameDuration);
      
      // Save game completion
      const completionData = {
        userId,
        activityType: 'game_session' as const,
        activityDetails: {
          exerciseId: 'color-harmony',
          exerciseTitle: `Color Harmony - ${pattern.name}`,
          exerciseType: 'color_game',
          duration: gameDuration,
          gameScore: finalScore,
          gameLevel: pattern.id,
          notes: `Completed ${pattern.name} with ${accuracy}% accuracy and ${correctTiles}/${pattern.colors.length} correct matches`
        },
        completedAt: new Date().toISOString(),
        streakCount: 1
      };

      await saveExerciseCompletion(completionData);

      // Check for achievements
      const completions = await import('../../utils/offlineStorage').then(m => m.getExerciseCompletions());
      const newAchievements = await checkAchievements(userId, completions);
      
      // Save new achievements
      for (const achievement of newAchievements) {
        await saveAchievement(achievement);
      }

      // Show completion notification
      if (completed) {
        setNotification({
          visible: true,
          type: 'success',
          title: 'Pattern Complete! 🎨',
          message: `${pattern.name} mastered! Score: ${finalScore} | Accuracy: ${accuracy}%`,
          onDismiss: () => setNotification(null)
        });
      } else {
        setNotification({
          visible: true,
          type: 'milestone',
          title: 'Time\'s Up! ⏰',
          message: `Good effort! Score: ${finalScore} | Matches: ${correctTiles}/${pattern.colors.length}`,
          onDismiss: () => setNotification(null)
        });
      }

      // Show achievement notifications
      if (newAchievements.length > 0) {
        setTimeout(() => {
          newAchievements.forEach((achievement, index) => {
            setTimeout(() => {
              setNotification({
                visible: true,
                type: 'achievement',
                title: 'Achievement Unlocked! 🏆',
                message: `${achievement.badgeName}: ${achievement.badgeDescription}`,
                onDismiss: () => setNotification(null)
              });
            }, index * 2000);
          });
        }, 2000);
      }

    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const renderColorTile = (tile: ColorTile) => {
    return (
      <Animated.View
        key={tile.id}
        style={[
          styles.colorTile,
          {
            backgroundColor: tile.color,
            opacity: tile.opacity,
            transform: [{ scale: tile.scale }],
            borderWidth: tile.isCorrect ? 4 : 2,
            borderColor: tile.isCorrect ? '#4ECDC4' : 'rgba(255,255,255,0.3)',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.tileTouch}
          onPress={() => handleTilePress(tile.id)}
          activeOpacity={0.8}
        >
          {tile.isCorrect && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const currentPatternData = colorPatterns[currentPattern];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Color Harmony</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Game Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{score}</Text>
          <Text style={styles.statLabel}>Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{timeLeft}</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{correctTiles}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentPattern + 1}</Text>
          <Text style={styles.statLabel}>Pattern</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {!gameStarted ? (
          <View style={styles.startScreen}>
            <Palette size={80} color="white" style={styles.startIcon} />
            <Text style={styles.startTitle}>{currentPatternData.name}</Text>
            <Text style={styles.startDescription}>
              {currentPatternData.description}
            </Text>
            <Text style={styles.patternInfo}>
              {currentPatternData.colors.length} colors • {currentPatternData.timeLimit}s • {currentPatternData.difficulty}
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Pattern</Text>
            </TouchableOpacity>
            {currentPattern > 0 && (
              <TouchableOpacity style={styles.patternButton} onPress={() => {
                setCurrentPattern(0);
                resetGame();
              }}>
                <Text style={styles.patternButtonText}>Restart from Pattern 1</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {/* Game Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.controlButton} onPress={pauseGame}>
                {isPaused ? <Play size={24} color="white" /> : <Pause size={24} color="white" />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={resetGame}>
                <RotateCcw size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Color Grid */}
            <View style={styles.colorGrid}>
              {colorTiles.map(renderColorTile)}
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Tap colors to match them with the target pattern
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Notification Banner */}
      {notification && (
        <NotificationBanner
          visible={notification.visible}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onDismiss={notification.onDismiss}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  headerSpacer: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  statLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  startIcon: {
    marginBottom: theme.spacing.lg,
  },
  startTitle: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  startDescription: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  patternInfo: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
    marginBottom: theme.spacing.md,
  },
  startButtonText: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  patternButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  patternButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255,255,255,0.8)',
  },
  controlsContainer: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    zIndex: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  colorGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  colorTile: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tileTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  instructionsText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    textAlign: 'center',
  },
});
