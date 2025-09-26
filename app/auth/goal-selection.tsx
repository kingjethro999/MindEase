
// app/onboarding/goal-selection.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
    Activity,
    ArrowRight,
    Brain,
    Heart,
    Lightbulb,
    Moon,
    Target,
    Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlert } from '../../contexts/AlertContext';
import { theme } from '../../theme/theme';
import { onboardingUtils } from '../../utils/onboarding';

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  gradient: string[];
}

const GoalSelectionScreen: React.FC = () => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { showError, showSuccess } = useAlert();

  const goals: Goal[] = [
    {
      id: 'reduce-anxiety',
      title: 'Reduce Anxiety',
      description: 'Learn techniques to manage anxious thoughts and feelings',
      icon: Brain,
      color: theme.colors.info,
      gradient: ['#2196F3', '#64B5F6'],
    },
    {
      id: 'improve-mood',
      title: 'Improve Mood',
      description: 'Track and boost your daily emotional well-being',
      icon: Heart,
      color: theme.colors.secondary,
      gradient: ['#4CAF50', '#66BB6A'],
    },
    {
      id: 'better-sleep',
      title: 'Sleep Better',
      description: 'Develop healthy sleep habits and relaxation routines',
      icon: Moon,
      color: theme.colors.primary,
      gradient: ['#673AB7', '#9C27B0'],
    },
    {
      id: 'stress-management',
      title: 'Manage Stress',
      description: 'Build resilience and coping strategies for daily stress',
      icon: Activity,
      color: theme.colors.accent,
      gradient: ['#FF9800', '#FFB74D'],
    },
    {
      id: 'mindfulness',
      title: 'Practice Mindfulness',
      description: 'Develop present-moment awareness and meditation skills',
      icon: Lightbulb,
      color: theme.colors.success,
      gradient: ['#4CAF50', '#8BC34A'],
    },
    {
      id: 'social-support',
      title: 'Build Support Network',
      description: 'Learn about connecting with others and seeking help',
      icon: Users,
      color: theme.colors.info,
      gradient: ['#2196F3', '#03DAC6'],
    },
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = async () => {
    if (selectedGoals.length === 0) {
      showError(
        'Select Your Goals',
        'Please select at least one goal to personalize your experience.'
      );
      return;
    }

    // Save selected goals to AsyncStorage
    await onboardingUtils.saveUserGoals(selectedGoals);
    console.log('Selected goals saved:', selectedGoals);
    
    // Save complete profile to database since user is now authenticated
    try {
      const { supabase } = await import('../../constants/supabase');
      const { userProfileUtils } = await import('../../utils/userProfile');
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get pending profile data from AsyncStorage
        const pendingProfileData = await AsyncStorage.getItem('pending_user_profile');
        
        if (pendingProfileData) {
          const profileData = JSON.parse(pendingProfileData);
          
          // Create complete user profile with all data
          await userProfileUtils.createOrUpdateUserProfile(user.id, {
            username: profileData.username,
            display_name: profileData.displayName,
            age_range: profileData.ageRange,
            language_preference: profileData.languagePreference,
            primary_goals: selectedGoals,
            onboarding_completed: true,
          });
          
          console.log('Complete user profile saved to database for user:', user.id);
          
          // Show success message
          showSuccess(
            'Profile Complete!',
            'Your profile has been successfully updated with all your preferences and goals.'
          );
          
          // Clean up pending profile data
          await AsyncStorage.removeItem('pending_user_profile');
          
          // Navigate to main app after a short delay to show success message
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 2000);
        } else {
          // Fallback: just save goals if no pending profile data
          await userProfileUtils.updateUserGoals(user.id, selectedGoals);
          console.log('Goals saved to database for user:', user.id);
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      console.error('Error saving profile to database:', error);
      showError(
        'Error',
        'Failed to save your profile. Please try again or contact support if the problem persists.'
      );
      return; // Block the flow if database save fails
    }
  };

  const renderGoalCard = (goal: Goal) => {
    const isSelected = selectedGoals.includes(goal.id);
    const IconComponent = goal.icon;
    
    return (
      <TouchableOpacity
        key={goal.id}
        style={[
          styles.goalCard,
          isSelected && styles.goalCardSelected,
        ]}
        onPress={() => handleGoalToggle(goal.id)}
      >
        {isSelected ? (
          <LinearGradient
            colors={goal.gradient as any}
            style={styles.goalCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.goalCardContent}>
              <View style={styles.goalIconContainer}>
                <IconComponent size={32} color="white" />
              </View>
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalTitleSelected}>{goal.title}</Text>
                <Text style={styles.goalDescriptionSelected}>{goal.description}</Text>
              </View>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.goalCardContent}>
            <View style={[styles.goalIconContainer, { backgroundColor: goal.color + '20' }]}>
              <IconComponent size={32} color={goal.color} />
            </View>
            <View style={styles.goalTextContainer}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalDescription}>{goal.description}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Target size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>What are your goals?</Text>
          <Text style={styles.subtitle}>
            Select the areas you'd like to focus on. We'll personalize your experience based on your choices.
          </Text>
        </View>

        {/* Goal Selection */}
        <View style={styles.goalsSection}>
          {goals.map(renderGoalCard)}
        </View>

        {/* Selection Counter */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {selectedGoals.length} of {goals.length} goals selected
          </Text>
          <Text style={styles.counterSubtext}>
            You can change these anytime in settings
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedGoals.length > 0 ? styles.continueButtonActive : styles.continueButtonInactive,
          ]}
          onPress={handleContinue}
        >
          <Text
            style={[
              styles.continueButtonText,
              selectedGoals.length > 0 ? styles.continueButtonTextActive : styles.continueButtonTextInactive,
            ]}
          >
            Continue
          </Text>
          <ArrowRight
            size={20}
            color={selectedGoals.length > 0 ? 'white' : theme.colors.textLight}
          />
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.body,
  },
  goalsSection: {
    paddingHorizontal: theme.spacing.md,
  },
  goalCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  goalCardSelected: {
    ...theme.shadows.md,
  },
  goalCardGradient: {
    borderRadius: theme.borderRadius.md,
  },
  goalCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  goalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  goalTitleSelected: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    marginBottom: theme.spacing.xs,
  },
  goalDescription: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.body,
  },
  goalDescriptionSelected: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: theme.typography.lineHeight.body,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold' as any,
  },
  counterContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  counterText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  counterSubtext: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.md,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  continueButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  continueButtonInactive: {
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  continueButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginRight: theme.spacing.sm,
  },
  continueButtonTextActive: {
    color: 'white',
  },
  continueButtonTextInactive: {
    color: theme.colors.textLight,
  },
  spacer: {
    height: theme.spacing.xl,
  },
});

export default GoalSelectionScreen;