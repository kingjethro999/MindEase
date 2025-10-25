import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BookOpen, Brain, Heart, Moon, Wind, ChevronRight, Activity, Clock, Target, Star, TrendingUp, Sparkles, CheckCircle } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { getExerciseCompletions } from '../../utils/offlineStorage';

const { width } = Dimensions.get('window');

export default function ExercisesScreen() {
  const [completions, setCompletions] = useState<any[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadCompletions();
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadCompletions = async () => {
    try {
      const data = await getExerciseCompletions();
      setCompletions(data);
    } catch (error) {
      console.error('Error loading completions:', error);
    }
  };

  const getExerciseCompletionCount = (exerciseId: string) => {
    return completions.filter(c => c.activity_details?.exerciseId === exerciseId).length;
  };

  const getTotalCompletions = () => {
    return completions.filter(c => ['breathing_exercise', 'meditation', 'journaling', 'sleep_tools'].includes(c.activity_type)).length;
  };

  const getExerciseStreak = () => {
    if (completions.length === 0) return 0;

    // Group completions by date
    const dailyActivities = new Map();
    completions.forEach(completion => {
      const date = new Date(completion.completed_at).toDateString();
      if (!dailyActivities.has(date)) {
        dailyActivities.set(date, new Set());
      }
      dailyActivities.get(date).add(completion.activity_type);
    });

    // Calculate consecutive days with any activity
    const sortedDates = Array.from(dailyActivities.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const daysDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
        currentDate = date;
      } else {
        break;
      }
    }

    return streak;
  };

  const exercises = [
    // Breathing Exercises (breathing_exercise)
    {
      id: 'breathing',
      title: 'Box Breathing',
      subtitle: '4-4-4-4 Method',
      description: 'Calm your nervous system with rhythmic breathing',
      icon: Wind,
      color: theme.colors.primary,
      bgColor: theme.colors.accents.breathingBlue,
      duration: '5 min',
      category: 'Breathing',
      activityType: 'breathing_exercise',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=breathing'),
    },
    {
      id: '4-7-8',
      title: '4-7-8 Breathing',
      subtitle: 'Relaxation Breath',
      description: 'Natural tranquilizer for the nervous system',
      icon: Wind,
      color: theme.colors.info,
      bgColor: theme.colors.accents.breathingBlue,
      duration: '3 min',
      category: 'Breathing',
      activityType: 'breathing_exercise',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=4-7-8'),
    },
    {
      id: 'diaphragmatic',
      title: 'Diaphragmatic',
      subtitle: 'Belly Breathing',
      description: 'Deep breathing to reduce stress and anxiety',
      icon: Wind,
      color: theme.colors.success,
      bgColor: theme.colors.accents.breathingBlue,
      duration: '4 min',
      category: 'Breathing',
      activityType: 'breathing_exercise',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=diaphragmatic'),
    },

    // Meditation Exercises (meditation)
    {
      id: 'meditation',
      title: 'Body Scan',
      subtitle: 'Progressive Relaxation',
      description: 'Mindful awareness of physical sensations',
      icon: Brain,
      color: theme.colors.warning,
      bgColor: theme.colors.accents.moodTracker,
      duration: '10 min',
      category: 'Meditation',
      activityType: 'meditation',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=meditation'),
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1',
      subtitle: 'Grounding Exercise',
      description: 'Connect with your senses to stay present',
      icon: Brain,
      color: theme.colors.error,
      bgColor: theme.colors.accents.moodTracker,
      duration: '5 min',
      category: 'Meditation',
      activityType: 'meditation',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=grounding'),
    },

    // Journaling (journaling)
    {
      id: 'journaling',
      title: 'Journaling',
      subtitle: 'Gratitude & CBT',
      description: 'Reflect and process your thoughts and feelings',
      icon: BookOpen,
      color: theme.colors.primary,
      bgColor: theme.colors.accents.relaxationGreen,
      duration: '15 min',
      category: 'Journaling',
      activityType: 'journaling',
      onPress: () => router.push('/nonTabs/journal'),
    },

    // Sleep Tools (sleep_tools)
    {
      id: 'sleep',
      title: 'Sleep Tools',
      subtitle: 'Relaxation & Sounds',
      description: 'Create the perfect environment for restful sleep',
      icon: Moon,
      color: theme.colors.info,
      bgColor: theme.colors.accents.sleepPurple,
      duration: '20 min',
      category: 'Sleep',
      activityType: 'sleep_tools',
      onPress: () => router.push('/nonTabs/sleepTools'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        {/* Enhanced Header with Progress */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Wellness Exercises</Text>
              <Text style={styles.subtitle}>Your journey to better mental health</Text>
            </View>
            <View style={styles.headerIcon}>
              <Activity size={32} color={theme.colors.primary} />
            </View>
          </View>

          {/* Progress Ring */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRing}>
              <View style={[styles.progressFill, {
                width: `${Math.min((getTotalCompletions() / 10) * 100, 100)}%`
              }]} />
            </View>
            <Text style={styles.progressText}>
              {getTotalCompletions()} of 10 completed
            </Text>
          </View>
        </View>


        {/* Exercise List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsContainer}
          >
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <TrendingUp size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{getTotalCompletions()}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Target size={20} color={theme.colors.secondary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>7</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Star size={20} color={theme.colors.warning} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{getExerciseStreak()}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </ScrollView>
          {exercises.map((exercise, index) => {
            const IconComponent = exercise.icon;
            const completionCount = getExerciseCompletionCount(exercise.id);
            const isCompleted = completionCount > 0;

            return (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.exerciseCard, { marginTop: index === 0 ? theme.spacing.sm : 0 }]}
                onPress={exercise.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.cardBackground, { backgroundColor: exercise.bgColor }]}>
                  <View style={styles.exerciseContent}>
                    <View style={[styles.iconContainer, { backgroundColor: exercise.color }]}>
                      <IconComponent size={20} color="white" />
                      {isCompleted && (
                        <View style={styles.completionBadge}>
                          <CheckCircle size={16} color="white" />
                        </View>
                      )}
                    </View>
                    <View style={styles.exerciseInfo}>
                      <View style={styles.exerciseHeader}>
                        <View style={styles.titleContainer}>
                          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                          <Text style={styles.exerciseSubtitle}>{exercise.subtitle}</Text>
                        </View>
                        <View style={styles.badgeContainer}>
                          <View style={[styles.durationBadge, { backgroundColor: exercise.color + '20' }]}>
                            <Clock size={12} color={exercise.color} />
                            <Text style={[styles.durationText, { color: exercise.color }]}>{exercise.duration}</Text>
                          </View>
                          {completionCount > 0 && (
                            <View style={[styles.completionCountBadge, { backgroundColor: exercise.color }]}>
                              <Text style={styles.completionCountText}>{completionCount}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {/* <Text style={styles.exerciseDescription}>{exercise.description}</Text> */}
                      <View style={styles.categoryContainer}>
                        {/* <Text style={styles.categoryText}>{exercise.category}</Text> */}
                        {isCompleted && (
                          <View style={styles.sparkleContainer}>
                            <Sparkles size={12} color={theme.colors.warning} />
                            <Text style={styles.completedText}>Completed</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.chevronContainer}>
                      <ChevronRight size={20} color={theme.colors.textSecondary} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Enhanced Premium Section */}
          <View style={styles.premiumContainer}>
            <TouchableOpacity
              style={styles.premiumButton}
              activeOpacity={0.8}
              onPress={() => router.push('/nonTabs/premium')}
            >
              <View style={styles.premiumContent}>
                <Star size={24} color="white" />
                <View style={styles.premiumTextContainer}>
                  <Text style={styles.premiumButtonText}>Unlock Advanced Exercises</Text>
                  <Text style={styles.premiumSubtext}>Subscribe to unlock premium content</Text>
                </View>
                <ChevronRight size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accents.relaxationGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressRing: {
    width: 80,
    height: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  statsContainer: {
    flexDirection: 'row',
    // paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    maxHeight: 100,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
    minWidth: 100,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  exerciseCard: {
    marginBottom: theme.spacing.md,
  },
  cardBackground: {
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
    position: 'relative',
  },
  completionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  exerciseTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  exerciseSubtitle: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  durationText: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginLeft: theme.spacing.xs,
  },
  completionCountBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionCountText: {
    fontSize: theme.typography.fontSize.small,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  exerciseDescription: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textLight,
    fontWeight: theme.typography.fontWeight.medium as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sparkleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginLeft: theme.spacing.xs,
  },
  chevronContainer: {
    padding: theme.spacing.sm,
  },
  crisisContainer: {
    // padding: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  crisisButton: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  crisisContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  crisisTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  crisisButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing.xs,
  },
  crisisSubtext: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  premiumContainer: {
    // padding: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  premiumButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  premiumTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  premiumButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing.xs,
  },
  premiumSubtext: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
