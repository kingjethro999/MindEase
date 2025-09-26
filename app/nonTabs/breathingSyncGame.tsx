import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Pause, Play, RotateCcw, Wind } from 'lucide-react-native';
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

interface BreathingCycle {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  duration: number;
  instruction: string;
}

export default function BreathingSyncGame() {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathingCycle['phase']>('inhale');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [notification, setNotification] = useState<any>(null);
  
  const gameTimer = useRef<number | null>(null);
  const phaseTimer = useRef<number | null>(null);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const breathingCycles: BreathingCycle[] = [
    { phase: 'inhale', duration: 4000, instruction: 'Breathe in slowly...' },
    { phase: 'hold', duration: 2000, instruction: 'Hold your breath...' },
    { phase: 'exhale', duration: 6000, instruction: 'Breathe out gently...' },
    { phase: 'pause', duration: 2000, instruction: 'Rest and relax...' }
  ];

  const phaseColors = {
    inhale: '#4ECDC4',
    hold: '#45B7D1', 
    exhale: '#96CEB4',
    pause: '#DDA0DD'
  };

  useEffect(() => {
    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
      }
      if (phaseTimer.current) {
        clearTimeout(phaseTimer.current);
      }
    };
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setScore(0);
    setStreak(0);
    
    startBreathingCycle();
  };

  const startBreathingCycle = () => {
    if (!isPlaying || isPaused) return;

    const cycle = breathingCycles[currentCycle % breathingCycles.length];
    setCurrentPhase(cycle.phase);
    
    // Animate the breathing circle
    animateBreathing(cycle);
    
    // Move to next phase after duration
    phaseTimer.current = setTimeout(() => {
      if (isPlaying && !isPaused) {
        setCurrentCycle(prev => prev + 1);
        startBreathingCycle();
      }
    }, cycle.duration);
  };

  const animateBreathing = (cycle: BreathingCycle) => {
    const { phase, duration } = cycle;
    
    // Reset animations
    scaleAnim.setValue(1);
    opacityAnim.setValue(0.8);
    
    switch (phase) {
      case 'inhale':
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(colorAnim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: false,
          }),
        ]).start();
        break;
        
      case 'hold':
        // Keep current scale and opacity
        break;
        
      case 'exhale':
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(colorAnim, {
            toValue: 2,
            duration: duration,
            useNativeDriver: false,
          }),
        ]).start();
        break;
        
      case 'pause':
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(colorAnim, {
            toValue: 3,
            duration: duration,
            useNativeDriver: false,
          }),
        ]).start();
        break;
    }
  };

  const handleTap = () => {
    if (!isPlaying || isPaused) return;

    // Check if user tapped in sync with breathing
    const cycle = breathingCycles[currentCycle % breathingCycles.length];
    const timeInPhase = Date.now() % (cycle.duration);
    
    let isInSync = false;
    switch (cycle.phase) {
      case 'inhale':
        isInSync = timeInPhase < cycle.duration * 0.8; // First 80% of inhale
        break;
      case 'hold':
        isInSync = timeInPhase < cycle.duration * 0.5; // First 50% of hold
        break;
      case 'exhale':
        isInSync = timeInPhase < cycle.duration * 0.7; // First 70% of exhale
        break;
      case 'pause':
        isInSync = timeInPhase < cycle.duration * 0.3; // First 30% of pause
        break;
    }

    if (isInSync) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      
      // Bonus points for streaks
      if (streak > 0 && streak % 5 === 0) {
        setScore(prev => prev + 25);
      }
    } else {
      setStreak(0);
    }
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      // Pause animations
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
      colorAnim.stopAnimation();
    } else {
      // Resume current phase
      const cycle = breathingCycles[currentCycle % breathingCycles.length];
      animateBreathing(cycle);
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameStarted(false);
    setIsPaused(false);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setScore(0);
    setStreak(0);
    
    // Reset animations
    scaleAnim.setValue(1);
    opacityAnim.setValue(0.8);
    colorAnim.setValue(0);
    
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
    }
    if (phaseTimer.current) {
      clearTimeout(phaseTimer.current);
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    setIsPaused(false);
    
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
    }
    if (phaseTimer.current) {
      clearTimeout(phaseTimer.current);
    }

    // Calculate game stats
    const totalCycles = Math.floor(currentCycle / breathingCycles.length);
    const gameDuration = totalCycles * 14; // 14 seconds per full cycle
    const finalScore = score;
    const maxStreak = streak;
    
    // Award experience and check achievements
    try {
      const userId = user?.id || 'anonymous_user';
      const expGained = awardExperience('game_session', gameDuration);
      
      // Save game completion
      const completionData = {
        userId,
        activityType: 'game_session' as const,
        activityDetails: {
          exerciseId: 'breathing-sync',
          exerciseTitle: 'Breathing Sync Game',
          exerciseType: 'breathing_game',
          duration: gameDuration,
          gameScore: finalScore,
          gameLevel: 1,
          notes: `Completed ${totalCycles} breathing cycles with max streak of ${maxStreak}`
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
        title: 'Breathing Session Complete! 🌬️',
        message: `Score: ${finalScore} | Cycles: ${totalCycles} | Max Streak: ${maxStreak}`,
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

  const getCurrentColor = () => {
    const cycle = breathingCycles[currentCycle % breathingCycles.length];
    return phaseColors[cycle.phase];
  };

  const getCurrentInstruction = () => {
    const cycle = breathingCycles[currentCycle % breathingCycles.length];
    return cycle.instruction;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Breathing Sync</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Game Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{score}</Text>
          <Text style={styles.statLabel}>Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.floor(currentCycle / breathingCycles.length)}</Text>
          <Text style={styles.statLabel}>Cycles</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {!gameStarted ? (
          <View style={styles.startScreen}>
            <Wind size={80} color="white" style={styles.startIcon} />
            <Text style={styles.startTitle}>Breathing Sync</Text>
            <Text style={styles.startDescription}>
              Follow the breathing rhythm by tapping in sync with the expanding circle.{'\n'}
              Stay calm and focus on your breathing pattern.
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Breathing</Text>
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

            {/* Breathing Circle */}
            <View style={styles.breathingContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    backgroundColor: getCurrentColor(),
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.circleTouch}
                  onPress={handleTap}
                  activeOpacity={0.8}
                >
                  <Text style={styles.phaseText}>{currentPhase.toUpperCase()}</Text>
                </TouchableOpacity>
              </Animated.View>
              
              <Text style={styles.instructionText}>{getCurrentInstruction()}</Text>
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
    backgroundColor: '#0f3460',
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
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  circleTouch: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instructionText: {
    fontSize: theme.typography.fontSize.h3,
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
});

