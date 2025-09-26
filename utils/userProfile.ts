import { supabase } from '../constants/supabase';
import { onboardingUtils } from './onboarding';

export const userProfileUtils = {
  // Create or update user profile with goals
  async createOrUpdateUserProfile(userId: string, userData: {
    display_name?: string;
    username?: string;
    age_range?: string;
    language_preference?: string;
    primary_goals?: string[];
    notification_preferences?: any;
    onboarding_completed?: boolean;
  }) {
    try {
      // First, try to get existing user goals from AsyncStorage if not provided
      let goals = userData.primary_goals;
      if (!goals || goals.length === 0) {
        goals = await onboardingUtils.getUserGoals();
      }

      // Get notification preferences from AsyncStorage if not provided
      let notificationPrefs = userData.notification_preferences;
      if (!notificationPrefs) {
        const notificationPermission = await onboardingUtils.getNotificationPermission();
        notificationPrefs = {
          daily_reminder: notificationPermission,
          affirmations: notificationPermission,
          weekly_reports: notificationPermission,
        };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          display_name: userData.display_name || null,
          username: userData.username || null,
          age_range: userData.age_range || null,
          language_preference: userData.language_preference || 'en',
          primary_goals: goals || [],
          notification_preferences: notificationPrefs,
          onboarding_completed: userData.onboarding_completed ?? true,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating/updating user profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createOrUpdateUserProfile:', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error getting user profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  },

  // Update user goals
  async updateUserGoals(userId: string, goals: string[]) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          primary_goals: goals,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user goals:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateUserGoals:', error);
      throw error;
    }
  },

  // Update notification preferences
  async updateNotificationPreferences(userId: string, preferences: any) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          notification_preferences: preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating notification preferences:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateNotificationPreferences:', error);
      throw error;
    }
  },
};
