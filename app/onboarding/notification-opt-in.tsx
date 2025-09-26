// app/onboarding/notification-opt-in.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowRight,
  Bell,
  Clock,
  Heart,
  Shield,
  TrendingUp,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import notificationService from '../../services/NotificationService';
import { theme } from '../../theme/theme';
import { onboardingUtils } from '../../utils/onboarding';

interface NotificationOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string[];
  enabled: boolean;
}

const NotificationOptInScreen: React.FC = () => {
  const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>([
    {
      id: 'daily-mood',
      title: 'Daily Mood Check-In',
      description: 'Gentle reminder to log your mood once a day',
      icon: Heart,
      gradient: theme.colors.gradients.relaxationGreen,
      enabled: true,
    },
    {
      id: 'affirmations',
      title: 'Daily Affirmations',
      description: 'Positive messages to brighten your day',
      icon: Clock,
      gradient: theme.colors.gradients.breathingBlue,
      enabled: true,
    },
    {
      id: 'weekly-reports',
      title: 'Weekly Progress Reports',
      description: 'Summary of your mood patterns and insights',
      icon: TrendingUp,
      gradient: theme.colors.gradients.gameOrange,
      enabled: true,
    },
  ]);

  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const toggleOption = (optionId: string) => {
    setNotificationOptions(prev =>
      prev.map(option =>
        option.id === optionId
          ? { ...option, enabled: !option.enabled }
          : option
      )
    );
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    try {
      // Use the notification service to request permissions
      const granted = await notificationService.requestPermissions();
      
      if (granted) {
        // Initialize the notification service with default settings
        await notificationService.initialize();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const handleGetStarted = async () => {
    setIsRequestingPermission(true);
    
    const hasEnabledNotifications = notificationOptions.some(option => option.enabled);
    
    if (hasEnabledNotifications) {
      const permissionGranted = await requestNotificationPermission();
      
      if (!permissionGranted) {
        Alert.alert(
          'Notification Permission',
          'Notifications were not enabled. You can still use the app and enable notifications later in Settings.',
          [
            {
              text: 'Continue',
              onPress: async () => {
                console.log('Continuing without notifications');
                await onboardingUtils.markOnboardingCompleted();
                router.replace('/auth');
              }
            }
          ]
        );
        setIsRequestingPermission(false);
        return;
      }
    }
    
    // Save notification preferences using the service
    const preferences = notificationOptions.reduce((acc, option) => ({
      ...acc,
      [option.id]: option.enabled
    }), {} as Record<string, boolean>);
    
    // Map to service settings format
    const serviceSettings = {
      enabled: hasEnabledNotifications,
      dailyReminder: preferences['daily-mood'] || false,
      dailyAffirmation: preferences['affirmations'] || false,
      weeklyReport: preferences['weekly-reports'] || false,
      exerciseReminders: preferences['exercise-reminders'] || false,
    };
    
    await notificationService.saveSettings(serviceSettings);
    console.log('Notification preferences saved:', serviceSettings);
    
    // Save notification permission and mark onboarding complete
    await onboardingUtils.saveNotificationPermission(true);
    await onboardingUtils.markOnboardingCompleted();
    
    setIsRequestingPermission(false);
    router.replace('/auth');
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Notifications?',
      'You can always enable notifications later in Settings to get reminders and track your progress.',
      [
        { text: 'Go Back', style: 'cancel' },
        { 
          text: 'Skip', 
          onPress: async () => {
            console.log('Skipped notification setup');
            await onboardingUtils.saveNotificationPermission(false);
            await onboardingUtils.markOnboardingCompleted();
            router.replace('/auth');
          }
        },
      ]
    );
  };

  const renderNotificationOption = (option: NotificationOption) => {
    const IconComponent = option.icon;
    
    return (
      <View key={option.id} style={styles.optionCard}>
        <LinearGradient
          colors={option.gradient as any}
          style={styles.optionIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconComponent size={20} color="white" />
        </LinearGradient>
        
        <View style={styles.optionContent}>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
          
          <Switch
            value={option.enabled}
            onValueChange={() => toggleOption(option.id)}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary + '40',
            }}
            thumbColor={option.enabled ? theme.colors.primary : theme.colors.textLight}
            ios_backgroundColor={theme.colors.border}
          />
        </View>
      </View>
    );
  };

  const enabledCount = notificationOptions.filter(option => option.enabled).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Bell size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Notification Preferences</Text>
          <Text style={styles.subtitle}>
            Choose which notifications you'd like to receive. You can change these anytime in Settings.
          </Text>
        </View>

        {/* Notification Options */}
        <View style={styles.optionsSection}>
          {notificationOptions.map(renderNotificationOption)}
          
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              {enabledCount} of {notificationOptions.length} notifications enabled
            </Text>
          </View>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <View style={styles.privacyHeader}>
            <Shield size={16} color={theme.colors.success} />
            <Text style={styles.privacyTitle}>Privacy Protected</Text>
          </View>
          <Text style={styles.privacyText}>
            All notifications are generated locally on your device. We never share your personal information or mood data with third parties.
          </Text>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Benefits of enabling notifications:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>•</Text>
              <Text style={styles.benefitText}>Build consistent daily habits</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>•</Text>
              <Text style={styles.benefitText}>Receive personalized insights</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>•</Text>
              <Text style={styles.benefitText}>Track your progress over time</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>•</Text>
              <Text style={styles.benefitText}>Get gentle support when you need it</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.getStartedButton} 
          onPress={handleGetStarted}
          disabled={isRequestingPermission}
        >
          <Text style={styles.getStartedButtonText}>
            {isRequestingPermission ? 'Setting up...' : 'Get Started'}
          </Text>
          {!isRequestingPermission && <ArrowRight size={18} color="white" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
          disabled={isRequestingPermission}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.md,
  },
  header: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.caption,
  },
  optionsSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  optionTitle: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  optionDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.small,
  },
  selectionSummary: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  selectionText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  privacyNote: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.success + '10',
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.success,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  privacyTitle: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  privacyText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.small,
  },
  benefitsSection: {
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
  },
  benefitsTitle: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  benefitsList: {
    marginTop: theme.spacing.xs,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  benefitBullet: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
    width: 10,
  },
  benefitText: {
    flex: 1,
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.small,
  },
  actionButtons: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginRight: theme.spacing.sm,
  },
  skipButton: {
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  skipButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.caption,
  },
});

export default NotificationOptInScreen