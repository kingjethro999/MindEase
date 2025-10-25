import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Pause, Play, RotateCcw, Puzzle } from 'lucide-react-native';
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

interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  color: string;
  isPlaced: boolean;
  scale: Animated.Value;
  opacity: Animated.Value;
}

interface PuzzleLevel {
  id: number;
  name: string;
  pieces: number;
  colors: string[];
  timeLimit: number;
  description: string;
}

export default function SoothingPuzzleGame() {
  const { user } = useAuth();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [notification, setNotification] = useState<any>(null);
  
  const gameTimer = useRef<number | null>(null);

  const puzzleLevels: PuzzleLevel[] = [
    {
      id: 1,
      name: "Gentle Waves",
      pieces: 9,
      colors: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'],
      timeLimit: 120,
      description: "Arrange the pieces to create a calming wave pattern"
    },
    {
      id: 2,
      name: "Mountain Serenity",
      pieces: 16,
      colors: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1', '#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#3498DB', '#9B59B6', '#1ABC9C', '#E67E22', '#95A5A6', '#34495E'],
      timeLimit: 180,
      description: "Create a peaceful mountain landscape"
    },
    {
      id: 3,
      name: "Zen Garden",
      pieces: 25,
      colors: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F5DEB3', '#2F4F4F', '#708090', '#A9A9A9', '#D3D3D3', '#F0F8FF', '#228B22', '#32CD32', '#90EE90', '#98FB98', '#F0FFF0', '#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFF0F5', '#FFFAF0', '#FFFFF0', '#F0FFF0', '#F5FFFA', '#F0FFFF', '#F0F8FF'],
      timeLimit: 240,
      description: "Arrange the stones in a harmonious pattern"
    }
  ];

  useEffect(() => {
    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
      }
    };
  }, []);

  const generatePuzzlePieces = (level: PuzzleLevel): PuzzlePiece[] => {
    const pieces: PuzzlePiece[] = [];
    const gridSize = Math.sqrt(level.pieces);
    const pieceSize = 60; // Fixed size for better visibility
    
    // Create correct positions in a grid
    for (let i = 0; i < level.pieces; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      pieces.push({
        id: i,
        x: Math.random() * (width - pieceSize - 40) + 20,
        y: Math.random() * (height * 0.3) + height * 0.1,
        correctX: col * pieceSize + (width - gridSize * pieceSize) / 2,
        correctY: row * pieceSize + 150,
        color: level.colors[i],
        isPlaced: false,
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1)
      });
    }
    
    return pieces;
  };

  const startGame = () => {
    const level = puzzleLevels[currentLevel];
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(level.timeLimit);
    setScore(0);
    setMoves(0);
    setPuzzlePieces(generatePuzzlePieces(level));
    
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

  const handlePiecePress = (pieceId: number) => {
    if (!isPlaying || isPaused) return;

    setPuzzlePieces(prev => {
      const piece = prev.find(p => p.id === pieceId);
      if (!piece || piece.isPlaced) return prev;

      // Animate piece selection
      Animated.sequence([
        Animated.timing(piece.scale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(piece.scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Check if piece is in correct position
      const tolerance = 40;
      const isCorrect = 
        Math.abs(piece.x - piece.correctX) < tolerance &&
        Math.abs(piece.y - piece.correctY) < tolerance;

      if (isCorrect) {
        // Place piece correctly
        piece.isPlaced = true;
        piece.x = piece.correctX;
        piece.y = piece.correctY;

        // Animate successful placement
        Animated.parallel([
          Animated.timing(piece.scale, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(piece.opacity, {
            toValue: 0.9,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.parallel([
            Animated.timing(piece.scale, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(piece.opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        });

        // Update score and moves
        setScore(prev => prev + 100);
        setMoves(prev => prev + 1);

        // Check if puzzle is complete
        const allPlaced = prev.every(p => p.id === pieceId ? true : p.isPlaced);
        if (allPlaced) {
          setTimeout(() => endGame(true), 500);
        }
      } else {
        // Wrong position - animate error
        Animated.sequence([
          Animated.timing(piece.scale, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(piece.scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        setMoves(prev => prev + 1);
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
    setMoves(0);
    setPuzzlePieces([]);
    
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
    }
  };

  const nextLevel = () => {
    if (currentLevel < puzzleLevels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      resetGame();
    } else {
      // All levels completed
      endGame(true);
    }
  };

  const endGame = async (completed: boolean) => {
    setIsPlaying(false);
    setIsPaused(false);
    
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
    }

    const level = puzzleLevels[currentLevel];
    const gameDuration = level.timeLimit - timeLeft;
    const finalScore = score + (completed ? 500 : 0); // Bonus for completion
    const accuracy = moves > 0 ? Math.round((level.pieces / moves) * 100) : 0;
    
    // Award experience and check achievements
    try {
      const userId = user?.id || 'anonymous_user';
      const expGained = awardExperience('game_session', gameDuration);
      
      // Save game completion
      const completionData = {
        user_id: userId,  
        activity_type: "game_session" as const,  
        activity_details: { 
          exerciseId: `puzzle_${level.id}`,
          exerciseTitle: `Puzzle: ${level.name}`,
          exerciseType: 'puzzle',
          duration: gameDuration,
          gameScore: finalScore,
          gameLevel: level.id,
          notes: `Completed ${level.name} with ${moves} moves and ${accuracy}% accuracy`
        },
        completed_at: new Date().toISOString(),  
        streak_count: 1 
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
          title: 'Puzzle Complete! 🧩',
          message: `${level.name} solved! Score: ${finalScore} | Moves: ${moves}`,
          onDismiss: () => setNotification(null)
        });
      } else {
        setNotification({
          visible: true,
          type: 'milestone',
          title: 'Time\'s Up! ⏰',
          message: `Good effort! Score: ${finalScore} | Progress: ${puzzlePieces.filter(p => p.isPlaced).length}/${level.pieces}`,
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
                message: `${achievement.badge_name}: ${achievement.badge_description}`,
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

  const renderPuzzlePiece = (piece: PuzzlePiece) => {
    return (
      <Animated.View
        key={piece.id}
        style={[
          styles.puzzlePiece,
          {
            left: piece.x,
            top: piece.y,
            backgroundColor: piece.color,
            opacity: piece.opacity,
            transform: [{ scale: piece.scale }],
            borderWidth: piece.isPlaced ? 3 : 1,
            borderColor: piece.isPlaced ? '#4ECDC4' : 'rgba(255,255,255,0.3)',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.pieceTouch}
          onPress={() => handlePiecePress(piece.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.pieceNumber}>{piece.id + 1}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const currentLevelData = puzzleLevels[currentLevel];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Soothing Puzzle</Text>
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
          <Text style={styles.statValue}>{moves}</Text>
          <Text style={styles.statLabel}>Moves</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentLevel + 1}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {!gameStarted ? (
          <View style={styles.startScreen}>
            <Puzzle size={80} color="white" style={styles.startIcon} />
            <Text style={styles.startTitle}>{currentLevelData.name}</Text>
            <Text style={styles.startDescription}>
              {currentLevelData.description}
            </Text>
            <Text style={styles.levelInfo}>
              {currentLevelData.pieces} pieces • {currentLevelData.timeLimit}s time limit
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Puzzle</Text>
            </TouchableOpacity>
            {currentLevel > 0 && (
              <TouchableOpacity style={styles.levelButton} onPress={() => {
                setCurrentLevel(0);
                resetGame();
              }}>
                <Text style={styles.levelButtonText}>Restart from Level 1</Text>
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

            {/* Puzzle Grid */}
            <View style={styles.puzzleGrid}>
              {/* Target area outline */}
              <View style={styles.targetArea}>
                {Array.from({ length: currentLevelData.pieces }, (_, index) => {
                  const gridSize = Math.sqrt(currentLevelData.pieces);
                  const row = Math.floor(index / gridSize);
                  const col = index % gridSize;
                  const pieceSize = 60;
                  
                  return (
                    <View
                      key={`target-${index}`}
                      style={[
                        styles.targetSlot,
                        {
                          left: col * pieceSize + (width - gridSize * pieceSize) / 2,
                          top: row * pieceSize + 150,
                          width: pieceSize,
                          height: pieceSize,
                        }
                      ]}
                    />
                  );
                })}
              </View>
              {puzzlePieces.map(renderPuzzlePiece)}
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Tap pieces to place them in the correct positions
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
    backgroundColor: '#2c3e50',
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
  levelInfo: {
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
  levelButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  levelButtonText: {
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
  puzzleGrid: {
    flex: 1,
    position: 'relative',
    margin: theme.spacing.lg,
  },
  targetArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  targetSlot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
  },
  puzzlePiece: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pieceTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  pieceNumber: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
