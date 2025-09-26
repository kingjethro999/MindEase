import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Award, Play, Pause, RotateCcw, Volume2, VolumeX, Trophy, Star, Zap } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme/theme';
import { NotificationBanner } from '../../components/NotificationBanner';
import { 
  saveExerciseCompletion, 
  getExerciseCompletions,
  saveAchievement,
  ExerciseCompletion 
} from '../../utils/offlineStorage';
import { 
  checkAchievements, 
  awardExperience,
  getAchievementNotification
} from '../../utils/gamification';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface ExerciseData {
  id: string;
  title: string;
  type: 'breathing' | 'meditation' | 'journaling' | 'sleep';
  instructions: string[];
  duration: number;
  steps: Array<{
    phase: 'inhale' | 'hold' | 'exhale' | 'pause' | 'instruction';
    duration: number;
    text: string;
  }>;
}

const exercises: Record<string, ExerciseData> = {
  breathing: {
    id: 'breathing',
    title: 'Box Breathing (4-4-4-4)',
    type: 'breathing',
    instructions: [
      'Find a comfortable seated position',
      'Close your eyes and relax your shoulders',
      'Follow the breathing pattern: Inhale 4, Hold 4, Exhale 4, Hold 4',
      'Repeat for the full duration'
    ],
    duration: 300, // 5 minutes
    steps: [
      { phase: 'instruction', duration: 3, text: 'Get ready to begin box breathing' },
      { phase: 'inhale', duration: 4, text: 'Breathe in slowly' },
      { phase: 'hold', duration: 4, text: 'Hold your breath' },
      { phase: 'exhale', duration: 4, text: 'Breathe out slowly' },
      { phase: 'pause', duration: 4, text: 'Rest and pause' }
    ]
  },
  meditation: {
    id: 'meditation',
    title: 'Body Scan Meditation',
    type: 'meditation',
    instructions: [
      'Lie down or sit comfortably',
      'Close your eyes and take a few deep breaths',
      'Focus on each part of your body from head to toe',
      'Notice any tension and allow it to release'
    ],
    duration: 600, // 10 minutes
    steps: [
      { phase: 'instruction', duration: 5, text: 'Begin by taking three deep breaths' },
      { phase: 'instruction', duration: 10, text: 'Focus on the top of your head' },
      { phase: 'instruction', duration: 10, text: 'Move your attention to your forehead' },
      { phase: 'instruction', duration: 10, text: 'Notice your eyes and facial muscles' },
      { phase: 'instruction', duration: 10, text: 'Feel your neck and shoulders' },
      { phase: 'instruction', duration: 10, text: 'Focus on your chest and breathing' },
      { phase: 'instruction', duration: 10, text: 'Notice your arms and hands' },
      { phase: 'instruction', duration: 10, text: 'Feel your abdomen and back' },
      { phase: 'instruction', duration: 10, text: 'Focus on your hips and pelvis' },
      { phase: 'instruction', duration: 10, text: 'Notice your legs and feet' },
      { phase: 'instruction', duration: 5, text: 'Take a moment to feel your whole body' }
    ]
  },
  '4-7-8': {
    id: '4-7-8',
    title: '4-7-8 Relaxation Breath',
    type: 'breathing',
    instructions: [
      'Sit comfortably with your back straight',
      'Place the tip of your tongue against the roof of your mouth',
      'Follow the pattern: Inhale 4, Hold 7, Exhale 8',
      'This technique promotes relaxation and reduces stress'
    ],
    duration: 240, // 4 minutes
    steps: [
      { phase: 'instruction', duration: 3, text: 'Get ready for 4-7-8 breathing' },
      { phase: 'inhale', duration: 4, text: 'Breathe in through your nose' },
      { phase: 'hold', duration: 7, text: 'Hold your breath' },
      { phase: 'exhale', duration: 8, text: 'Exhale slowly through your mouth' },
      { phase: 'pause', duration: 2, text: 'Rest and prepare for next cycle' }
    ]
  },
  grounding: {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    type: 'meditation',
    instructions: [
      'This exercise helps bring you back to the present moment',
      'Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste',
      'Take your time with each step',
      'This is especially helpful during anxiety or panic'
    ],
    duration: 300, // 5 minutes
    steps: [
      { phase: 'instruction', duration: 5, text: 'Let\'s begin the 5-4-3-2-1 grounding exercise' },
      { phase: 'instruction', duration: 30, text: 'Look around and name 5 things you can see' },
      { phase: 'instruction', duration: 30, text: 'Touch 4 things around you and notice their texture' },
      { phase: 'instruction', duration: 30, text: 'Listen carefully and identify 3 things you can hear' },
      { phase: 'instruction', duration: 30, text: 'Notice 2 things you can smell' },
      { phase: 'instruction', duration: 30, text: 'Focus on 1 thing you can taste' },
      { phase: 'instruction', duration: 10, text: 'Take a deep breath and notice how you feel now' }
    ]
  },
  diaphragmatic: {
    id: 'diaphragmatic',
    title: 'Diaphragmatic Breathing',
    type: 'breathing',
    instructions: [
      'Place one hand on your chest and one on your belly',
      'Breathe so that only your belly hand moves',
      'Your chest hand should stay still',
      'This improves oxygen intake and calms your body'
    ],
    duration: 300, // 5 minutes
    steps: [
      { phase: 'instruction', duration: 5, text: 'Place your hands and get ready for belly breathing' },
      { phase: 'inhale', duration: 6, text: 'Breathe into your belly, chest stays still' },
      { phase: 'exhale', duration: 8, text: 'Exhale slowly through pursed lips' },
      { phase: 'pause', duration: 2, text: 'Rest and prepare for next breath' }
    ]
  }
};

export default function ExerciseDetailsScreen() {
  const { exercise: exerciseId } = useLocalSearchParams<{ exercise: string }>();
  const { user } = useAuth();
  const exercise = exercises[exerciseId || 'breathing'];
  
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: 'success' | 'achievement' | 'streak' | 'milestone' | 'celebration';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'success',
    title: '',
    message: ''
  });
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Timer refs
  const timerRef = useRef<number | null>(null);
  const stepTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isStarted && !isPaused) {
      startExercise();
    } else if (isPaused) {
      stopTimers();
    }
    
    return () => {
      stopTimers();
      Speech.stop();
    };
  }, [isStarted, isPaused]);

  const stopTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
  };

  const startExercise = () => {
    setTimeRemaining(exercise.duration);
    setCurrentStep(0);
    executeStep(0);
    
    // Main timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeExercise();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const executeStep = (stepIndex: number) => {
    if (stepIndex >= exercise.steps.length) {
      // Repeat the cycle
      executeStep(0);
      return;
    }

    const step = exercise.steps[stepIndex];
    setCurrentStep(stepIndex);
    
    // Speak the instruction
    if (!isMuted) {
      Speech.speak(step.text, {
        rate: 0.8,
        pitch: 1.0,
        language: 'en'
      });
    }

    // Animate based on phase
    animatePhase(step.phase);

    // Set timer for next step
    stepTimerRef.current = setTimeout(() => {
      executeStep(stepIndex + 1);
    }, step.duration * 1000);
  };

  const animatePhase = (phase: string) => {
    // Reset animations
    pulseAnim.setValue(1);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);

    switch (phase) {
      case 'inhale':
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ]).start();
        break;
      case 'hold':
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 4000,
          useNativeDriver: true,
        }).start();
        break;
      case 'exhale':
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          })
        ]).start();
        break;
      case 'pause':
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }).start();
        break;
      default:
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
    }
  };

  const completeExercise = async () => {
    stopTimers();
    Speech.stop();
    setIsCompleted(true);
    setIsStarted(false);
    setIsPaused(false);
    
    // Save exercise completion and handle gamification
    await handleExerciseCompletion();
  };

  const handleExerciseCompletion = async () => {
    try {
      // Get user ID from auth context
      const userId = user?.id || 'anonymous_user';
      
      // Map exercise type to database activity type
      const activityTypeMap: Record<string, string> = {
        'breathing': 'breathing_exercise',
        'meditation': 'meditation',
        'journaling': 'journaling',
        'sleep': 'sleep_tools'
      };
      
      const activityType = activityTypeMap[exercise.type] || 'breathing_exercise';
      
      // Award experience
      const expGained = awardExperience(activityType, exercise.duration);
      
      // Create completion data matching database schema
      const completionData: Omit<ExerciseCompletion, 'id' | 'synced'> = {
        userId,
        activityType: activityType as any,
        activityDetails: {
          exerciseId: exercise.id,
          exerciseTitle: exercise.title,
          exerciseType: exercise.type,
          duration: exercise.duration,
          intensity: 1,
          notes: `Completed ${exercise.title}`
        },
        completedAt: new Date().toISOString(),
        streakCount: 1 // This will be calculated properly in the gamification system
      };

      // Save exercise completion
      await saveExerciseCompletion(completionData);
      
      // Get all completions for achievement checking
      const allCompletions = await getExerciseCompletions();
      
      // Check for new achievements
      const newAchievements = await checkAchievements(userId, allCompletions);
      
      // Save new achievements
      for (const achievement of newAchievements) {
        await saveAchievement(achievement);
      }
      
      // Show notifications
      await showCompletionNotifications(newAchievements, expGained);
      
    } catch (error) {
      console.error('Error handling exercise completion:', error);
    }
  };

  const showCompletionNotifications = async (newAchievements: any[], expGained: number) => {
    try {
      // Show completion notification first
      setNotification({
        visible: true,
        type: 'success',
        title: '🎉 Exercise Complete!',
        message: `Great job! You earned ${expGained} XP and completed ${exercise.title}`
      });

      // Show achievement notifications
      if (newAchievements.length > 0) {
        newAchievements.forEach((achievement, index) => {
          setTimeout(() => {
            const achievementNotification = getAchievementNotification(achievement);
            setNotification({
              visible: true,
              type: 'achievement',
              title: achievementNotification.title,
              message: achievementNotification.message
            });
          }, 2000 + (index * 3000));
        });
      }

    } catch (error) {
      console.error('Error showing completion notifications:', error);
    }
  };

  const resetExercise = () => {
    stopTimers();
    Speech.stop();
    setIsStarted(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTimeRemaining(0);
    setIsCompleted(false);
    pulseAnim.setValue(1);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      Speech.stop();
    }
  };

  const dismissNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentStepText = () => {
    if (currentStep < exercise.steps.length) {
      return exercise.steps[currentStep].text;
    }
    return 'Exercise Complete!';
  };

  const getPhaseColor = () => {
    if (currentStep < exercise.steps.length) {
      const phase = exercise.steps[currentStep].phase;
      switch (phase) {
        case 'inhale': return theme.colors.success;
        case 'hold': return theme.colors.warning;
        case 'exhale': return theme.colors.info;
        case 'pause': return theme.colors.primary;
        default: return theme.colors.text;
      }
    }
    return theme.colors.success;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Notification Banner */}
      <NotificationBanner
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onDismiss={dismissNotification}
        autoHide={true}
        duration={7000}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{exercise.title}</Text>
        <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
          {isMuted ? <VolumeX size={24} color={theme.colors.text} /> : <Volume2 size={24} color={theme.colors.text} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!isStarted && !isCompleted && (
          <>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Instructions:</Text>
              {exercise.instructions.map((instruction, index) => (
                <Text key={index} style={styles.instructionText}>
                  {index + 1}. {instruction}
                </Text>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => setIsStarted(true)}
            >
              <Play size={24} color="white" />
              <Text style={styles.startButtonText}>Start Exercise</Text>
            </TouchableOpacity>
          </>
        )}

        {isStarted && (
          <>
            {/* Breathing Circle Animation */}
            <View style={styles.animationContainer}>
              <Animated.View 
                style={[
                  styles.breathingCircle,
                  {
                    transform: [
                      { scale: pulseAnim },
                      { scale: scaleAnim }
                    ],
                    opacity: fadeAnim,
                    backgroundColor: getPhaseColor() + '20',
                    borderColor: getPhaseColor()
                  }
                ]}
              />
              <Animated.View 
                style={[
                  styles.innerCircle,
                  {
                    transform: [{ scale: pulseAnim }],
                    backgroundColor: getPhaseColor() + '40'
                  }
                ]}
              />
            </View>

            {/* Current Instruction */}
            <View style={styles.instructionContainer}>
              <Text style={[styles.currentInstruction, { color: getPhaseColor() }]}>
                {getCurrentStepText()}
              </Text>
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.timerLabel}>remaining</Text>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play size={24} color="white" /> : <Pause size={24} color="white" />}
                <Text style={styles.controlButtonText}>
                  {isPaused ? 'Resume' : 'Pause'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, styles.resetButton]}
                onPress={resetExercise}
              >
                <RotateCcw size={24} color="white" />
                <Text style={styles.controlButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {isCompleted && (
          <View style={styles.completionContainer}>
            <View style={styles.celebrationContainer}>
              <Trophy size={64} color={theme.colors.warning} />
              <Star size={32} color={theme.colors.primary} style={styles.star1} />
              <Star size={24} color={theme.colors.success} style={styles.star2} />
              <Star size={28} color={theme.colors.info} style={styles.star3} />
            </View>
            <Text style={styles.completionTitle}>🎉 Exercise Complete! 🎉</Text>
            <Text style={styles.completionSubtitle}>
              Amazing work! You've successfully completed {exercise.title}
            </Text>
            <Text style={styles.completionReward}>
              You're building healthy habits one exercise at a time! 💪
            </Text>
            
            <View style={styles.completionActions}>
              <TouchableOpacity 
                style={[styles.startButton, styles.tryAgainButton]}
                onPress={resetExercise}
              >
                <RotateCcw size={24} color="white" />
                <Text style={styles.startButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.startButton, styles.homeButton]}
                onPress={() => router.push('/(tabs)')}
              >
                <ArrowLeft size={24} color="white" />
                <Text style={styles.startButtonText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  muteButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  instructionText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.body + 2,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
    marginBottom: theme.spacing.xl,
  },
  startButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginLeft: theme.spacing.sm,
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'absolute',
  },
  instructionContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
  },
  currentInstruction: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.body + 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  timerText: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary,
  },
  timerLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  resetButton: {
    backgroundColor: theme.colors.error,
  },
  controlButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginLeft: theme.spacing.sm,
  },
  completionContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
  },
  completionTitle: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.success,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  completionSubtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.body + 2,
  },
  completionReward: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontStyle: 'italic',
  },
  celebrationContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  star1: {
    position: 'absolute',
    top: -10,
    right: 20,
  },
  star2: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  star3: {
    position: 'absolute',
    top: 20,
    left: -10,
  },
  completionActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  tryAgainButton: {
    backgroundColor: theme.colors.primary,
    flex: 0.45,
  },
  homeButton: {
    backgroundColor: theme.colors.success,
    flex: 0.45,
  },
});
