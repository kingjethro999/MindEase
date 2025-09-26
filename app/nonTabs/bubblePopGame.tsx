import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Pause, Play, RotateCcw } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  PanResponder,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import { saveExerciseCompletion } from '../../utils/offlineStorage';
import { awardExperience, checkAchievements, saveAchievement } from '../../utils/gamification';
import { NotificationBanner } from '../../components/NotificationBanner';

const { width, height } = Dimensions.get('window');

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: Animated.Value;
  scale: Animated.Value;
  floating: Animated.Value;
}

export default function BubblePopGame() {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [notification, setNotification] = useState<any>(null);
  
  const gameTimer = useRef<number | null>(null);
  const bubbleTimer = useRef<number | null>(null);

  const bubbleColors = [
    '#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  useEffect(() => {
    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
      }
      if (bubbleTimer.current) {
        clearInterval(bubbleTimer.current);
      }
    };
  }, []);

  const createBubble = (): Bubble => {
    const size = Math.random() * 40 + 20; // 20-60px
    const x = Math.random() * (width - size);
    const y = height + size;
    const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      size,
      color,
      opacity: new Animated.Value(0.8),
      scale: new Animated.Value(1),
      floating: new Animated.Value(0)
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
    
    // Start game timer
    gameTimer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start bubble generation
    bubbleTimer.current = setInterval(() => {
      if (isPlaying && !isPaused) {
        setBubbles(prev => {
          const newBubble = createBubble();
          animateBubble(newBubble);
          return [...prev, newBubble];
        });
      }
    }, 800);
  };

  const animateBubble = (bubble: Bubble) => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bubble.floating, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bubble.floating, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-remove bubble after 8 seconds
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    }, 8000);
  };

  const popBubble = (bubbleId: string) => {
    if (!isPlaying || isPaused) return;

    setBubbles(prev => {
      const bubble = prev.find(b => b.id === bubbleId);
      if (!bubble) return prev;


      // Pop animation
      Animated.parallel([
        Animated.timing(bubble.scale, {
          toValue: 1.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bubble.opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setBubbles(current => current.filter(b => b.id !== bubbleId));
      });

      // Update score
      setScore(prev => prev + 10);
      return prev.filter(b => b.id !== bubbleId);
    });
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameStarted(false);
    setIsPaused(false);
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
    
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
    }
    if (bubbleTimer.current) {
      clearInterval(bubbleTimer.current);
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    setIsPaused(false);
    
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
    }
    if (bubbleTimer.current) {
      clearInterval(bubbleTimer.current);
    }

    // Calculate game stats
    const gameDuration = 60 - timeLeft;
    const finalScore = score;
    const bubblesPopped = Math.floor(score / 10);
    
    // Award experience and check achievements
    try {
      const userId = user?.id || 'anonymous_user';
      const expGained = awardExperience('game_session', gameDuration);
      
      // Save game completion
      const completionData = {
        userId,
        activityType: 'game_session' as const,
        activityDetails: {
          exerciseId: 'bubble-pop',
          exerciseTitle: 'Bubble Pop Calm',
          exerciseType: 'stress_relief_game',
          duration: gameDuration,
          gameScore: finalScore,
          gameLevel: 1,
          notes: `Popped ${bubblesPopped} bubbles`
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
      setNotification({
        visible: true,
        type: 'success',
        title: 'Game Complete! 🎉',
        message: `Score: ${finalScore} | Bubbles Popped: ${bubblesPopped}`,
        onDismiss: () => setNotification(null)
      });

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

  const renderBubble = (bubble: Bubble) => {
    const translateY = bubble.floating.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -10],
    });

    return (
      <Animated.View
        key={bubble.id}
        style={[
          styles.bubble,
          {
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            backgroundColor: bubble.color,
            opacity: bubble.opacity,
            transform: [
              { scale: bubble.scale },
              { translateY }
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.bubbleTouch}
          onPress={() => popBubble(bubble.id)}
          activeOpacity={0.8}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Bubble Pop Calm</Text>
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
          <Text style={styles.statValue}>{Math.floor(score / 10)}</Text>
          <Text style={styles.statLabel}>Bubbles</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {!gameStarted ? (
          <View style={styles.startScreen}>
            <Text style={styles.startTitle}>Bubble Pop Calm</Text>
            <Text style={styles.startDescription}>
              Tap the floating bubbles to pop them and score points.{'\n'}
              Relax and enjoy the calming colors and sounds.
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
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

            {/* Bubbles */}
            {bubbles.map(renderBubble)}
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
    fontSize: theme.typography.fontSize.h2,
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
    marginBottom: theme.spacing.xl,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  startButtonText: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
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
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bubbleTouch: {
    flex: 1,
    borderRadius: 50,
  },
});

