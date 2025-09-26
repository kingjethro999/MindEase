import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BookOpen, Brain, Heart, Moon, Wind, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export default function ExercisesScreen() {
  const exercises = [
    // Breathing Exercises (breathing_exercise)
    {
      id: 'breathing',
      title: 'Box Breathing',
      subtitle: '4-4-4-4 Method',
      icon: Wind,
      color: theme.colors.primary,
      activityType: 'breathing_exercise',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=breathing'),
    },
    {
      id: '4-7-8',
      title: '4-7-8 Breathing',
      subtitle: 'Relaxation Breath',
      icon: Wind,
      color: theme.colors.info,
      activityType: 'breathing_exercise',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=4-7-8'),
    },
    {
      id: 'diaphragmatic',
      title: 'Diaphragmatic',
      subtitle: 'Belly Breathing',
      icon: Wind,
      color: theme.colors.success,
      activityType: 'breathing_exercise',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=diaphragmatic'),
    },
    
    // Meditation Exercises (meditation)
    {
      id: 'meditation',
      title: 'Body Scan',
      subtitle: 'Progressive Relaxation',
      icon: Brain,
      color: theme.colors.warning,
      activityType: 'meditation',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=meditation'),
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1',
      subtitle: 'Grounding Exercise',
      icon: Brain,
      color: theme.colors.error,
      activityType: 'meditation',
      onPress: () => router.push('/nonTabs/exerciseDetails?exercise=grounding'),
    },
    
    // Journaling (journaling)
    {
      id: 'journaling',
      title: 'Journaling',
      subtitle: 'Gratitude & CBT',
      icon: BookOpen,
      color: theme.colors.primary,
      activityType: 'journaling',
      onPress: () => router.push('/nonTabs/journalingEntry'),
    },
    
    // Sleep Tools (sleep_tools)
    {
      id: 'sleep',
      title: 'Sleep Tools',
      subtitle: 'Relaxation & Sounds',
      icon: Moon,
      color: theme.colors.info,
      activityType: 'sleep_tools',
      onPress: () => router.push('/nonTabs/sleepTools'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Exercises</Text>
        <Text style={styles.subtitle}>Choose your wellness practice</Text>
      </View>

      {/* Exercise List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {exercises.map((exercise) => {
          const IconComponent = exercise.icon;
          return (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={exercise.onPress}
            >
              <View style={[styles.iconContainer, { backgroundColor: exercise.color + '20' }]}>
                <IconComponent size={24} color={exercise.color} />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseSubtitle}>{exercise.subtitle}</Text>
              </View>
              <ChevronRight size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Crisis Support */}
      <View style={styles.crisisContainer}>
        <TouchableOpacity style={styles.crisisButton}>
          <Heart size={20} color="white" />
          <Text style={styles.crisisButtonText}>Crisis Support</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Section */}
      <View style={styles.premiumContainer}>
        <TouchableOpacity style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>Unlock Advanced →</Text>
        </TouchableOpacity>
        <Text style={styles.premiumSubtext}>(Rewarded Ad Flow)</Text>
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
    padding: theme.spacing.md,
    // alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  exerciseSubtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
  },
  crisisContainer: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  crisisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  crisisButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginLeft: theme.spacing.sm,
  },
  premiumContainer: {
    padding: theme.spacing.md,
    paddingTop: 0,
    alignItems: 'center',
  },
  premiumButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  premiumButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  premiumSubtext: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
