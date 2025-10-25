// services/NotificationService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const NOTIFICATION_SETTINGS_KEY = '@mind_ease_notification_settings';

interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  dailyAffirmation: boolean;
  weeklyReport: boolean;
  exerciseReminders: boolean;
}

class NotificationService {
  private settings: NotificationSettings;

  constructor() {
    this.settings = {
      enabled: false, // Default to disabled
      dailyReminder: false,
      dailyAffirmation: false,
      weeklyReport: false,
      exerciseReminders: false,
    };
  }

  async initialize(): Promise<void> {
    try {
      // Load saved settings
      await this.loadSettings();
      
      // Request permissions
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        console.log('Notification permissions not granted, skipping initialization');
        return;
      }
      
      // Set notification handler
      this.setNotificationHandler();
      
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }
      return true;
    } else {
      console.log('Must use physical device for notifications');
      return false;
    }
  }

  setNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  async scheduleNotifications(): Promise<void> {
    try {
      // Cancel any existing notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (this.settings.dailyReminder) {
        await this.scheduleDailyReminder();
      }

      if (this.settings.dailyAffirmation) {
        await this.scheduleDailyAffirmation();
      }

      if (this.settings.weeklyReport) {
        await this.scheduleWeeklyReport();
      }

      console.log('Notifications scheduled successfully');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  async scheduleDailyReminder(): Promise<void> {
    // Calculate next occurrence of 9 AM (morning reminder)
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(9, 0, 0, 0); // 9 AM
    
    // If it's already past 9 AM today, schedule for tomorrow
    if (now >= scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    // Ensure the scheduled time is at least 1 minute in the future
    const minTime = new Date(now.getTime() + 60000); // 1 minute from now
    if (scheduledTime < minTime) {
      scheduledTime.setTime(minTime.getTime());
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Check-in',
        body: 'How are you feeling today? Take a moment to log your mood.',
        sound: true,
      },
      trigger: {
        date: scheduledTime,
        repeats: true,
      } as any,
    });
    
    console.log('Daily reminder scheduled for:', scheduledTime);
  }

  async scheduleDailyAffirmation(): Promise<void> {
    const affirmations = [
      'You are stronger than your thoughts.',
      'Every breath you take is a step toward peace.',
      'You have the power to choose your response to any situation.',
      'Your feelings are valid, and you are capable of handling them.',
      'Today is a new opportunity to practice kindness toward yourself.',
    ];

    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    // Calculate next occurrence of 8 AM (morning affirmation)
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(8, 0, 0, 0); // 8 AM
    
    // If it's already past 8 AM today, schedule for tomorrow
    if (now >= scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Ensure the scheduled time is at least 1 minute in the future
    const minTime = new Date(now.getTime() + 60000); // 1 minute from now
    if (scheduledTime < minTime) {
      scheduledTime.setTime(minTime.getTime());
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Affirmation',
        body: randomAffirmation,
        sound: true,
      },
      trigger: {
        date: scheduledTime,
        repeats: true,
      } as any,
    });
    
    console.log('Daily affirmation scheduled for:', scheduledTime);
  }

  async scheduleWeeklyReport(): Promise<void> {
    // Calculate next Sunday at 10 AM
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(10, 0, 0, 0); // 10 AM
    
    // Find next Sunday
    const daysUntilSunday = (7 - now.getDay()) % 7;
    if (daysUntilSunday === 0 && now.getHours() >= 10) {
      // If it's Sunday and past 10 AM, schedule for next Sunday
      scheduledTime.setDate(scheduledTime.getDate() + 7);
    } else {
      scheduledTime.setDate(scheduledTime.getDate() + daysUntilSunday);
    }

    // Ensure the scheduled time is at least 1 minute in the future
    const minTime = new Date(now.getTime() + 60000); // 1 minute from now
    if (scheduledTime < minTime) {
      scheduledTime.setTime(minTime.getTime());
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your Weekly Wellness Report',
        body: 'Check out your mood patterns and achievements from this week!',
        sound: true,
      },
      trigger: {
        date: scheduledTime,
        repeats: true,
      } as any,
    });
    
    console.log('Weekly report scheduled for:', scheduledTime);
  }

  async loadSettings(): Promise<void> {
    try {
      const savedSettings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }

  async saveSettings(newSettings: Partial<NotificationSettings>): Promise<boolean> {
    try {
      this.settings = { ...this.settings, ...newSettings };
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(this.settings));
      
      // Don't automatically schedule notifications - let user control this
      console.log('Notification settings saved:', this.settings);
      
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return false;
    }
  }

  async enableNotifications(): Promise<boolean> {
    try {
      this.settings.enabled = true;
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(this.settings));
      await this.scheduleNotifications();
      return true;
    } catch (error) {
      console.error('Error enabling notifications:', error);
      return false;
    }
  }

  async disableNotifications(): Promise<boolean> {
    try {
      this.settings.enabled = false;
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(this.settings));
      await Notifications.cancelAllScheduledNotificationsAsync();
      return true;
    } catch (error) {
      console.error('Error disabling notifications:', error);
      return false;
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    return { ...this.settings };
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async sendTestNotification(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification from MindEase',
        sound: true,
      },
      trigger: {
        seconds: 2,
      } as any,
    });
  }

  async getScheduledNotifications(): Promise<any[]> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService;
