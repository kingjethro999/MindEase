import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';
const USER_GOALS_KEY = 'user_goals';
const NOTIFICATION_PERMISSION_KEY = 'notification_permission';

export const onboardingUtils = {
  // Check if onboarding is completed
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding completion:', error);
      return false;
    }
  },

  // Mark onboarding as completed
  async markOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Error marking onboarding as completed:', error);
    }
  },

  // Reset onboarding completion (for testing/logout)
  async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      await AsyncStorage.removeItem(USER_GOALS_KEY);
      await AsyncStorage.removeItem(NOTIFICATION_PERMISSION_KEY);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },

  // Save user selected goals
  async saveUserGoals(goals: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving user goals:', error);
    }
  },

  // Get user selected goals
  async getUserGoals(): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(USER_GOALS_KEY);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting user goals:', error);
      return [];
    }
  },

  // Save notification permission preference
  async saveNotificationPermission(granted: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, granted.toString());
    } catch (error) {
      console.error('Error saving notification permission:', error);
    }
  },

  // Get notification permission preference
  async getNotificationPermission(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error getting notification permission:', error);
      return false;
    }
  },
};
