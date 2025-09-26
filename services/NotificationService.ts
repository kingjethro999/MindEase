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
      enabled: true,
      dailyReminder: true,
      dailyAffirmation: true,
      weeklyReport: true,
      exerciseReminders: false,
    };
  }

  async initialize(): Promise<void> {
    try {
      // Load saved settings
      await this.loadSettings();
      
      // Request permissions
      await this.requestPermissions();
      
      // Set notification handler
      this.setNotificationHandler();
      
      // Schedule default notifications if enabled
      if (this.settings.enabled) {
        await this.scheduleDefaultNotifications();
      }
      
      console.log('Notification service initialized');
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

  async scheduleDefaultNotifications(): Promise<void> {
    try {
      // Cancel any existing notifications
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

      console.log('Default notifications scheduled successfully');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  async scheduleDailyReminder(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to check in!',
        body: 'How are you feeling today? Track your mood and take a moment for yourself.',
        sound: true,
      },
      trigger: {
        hour: 18, // 6 PM
        minute: 0,
        repeats: true,
      } as any,
    });
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

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Affirmation',
        body: randomAffirmation,
        sound: true,
      },
      trigger: {
        hour: 9, // 9 AM
        minute: 0,
        repeats: true,
      } as any,
    });
  }

  async scheduleWeeklyReport(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your Weekly Wellness Report',
        body: 'Check out your mood patterns and achievements from this week!',
        sound: true,
      },
      trigger: {
        weekday: 0, // Sunday
        hour: 10,
        minute: 0,
        repeats: true,
      } as any,
    });
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
      
      // Reschedule notifications if settings changed
      if (this.settings.enabled) {
        await this.scheduleDefaultNotifications();
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
      
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
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
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService;
