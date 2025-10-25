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
  Sparkles,
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
  badge?: string;
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
      badge: 'Recommended',
    },
    {
      id: 'affirmations',
      title: 'Daily Affirmations',
      description: 'Positive messages to brighten your day',
      icon: Sparkles,
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
      const granted = await notificationService.requestPermissions();
      
      if (granted) {
        // Only initialize, don't schedule notifications yet
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
    
    const preferences = notificationOptions.reduce((acc, option) => ({
      ...acc,
      [option.id]: option.enabled
    }), {} as Record<string, boolean>);
    
    const serviceSettings = {
      enabled: hasEnabledNotifications,
      dailyReminder: preferences['daily-mood'] || false,
      dailyAffirmation: preferences['affirmations'] || false,
      weeklyReport: preferences['weekly-reports'] || false,
      exerciseReminders: preferences['exercise-reminders'] || false,
    };
    
    // Save settings but don't schedule notifications yet
    await notificationService.saveSettings(serviceSettings);
    console.log('Notification preferences saved:', serviceSettings);
    
    // Note: Notifications will only be scheduled when user explicitly enables them in Settings
    
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
      <TouchableOpacity 
        key={option.id} 
        style={[styles.optionCard, option.enabled && styles.optionCardActive]}
        onPress={() => toggleOption(option.id)}
        activeOpacity={0.7}
      >
        <View style={styles.optionLeft}>
          <LinearGradient
            colors={option.gradient as any}
            style={styles.optionIconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <IconComponent size={22} color="white" strokeWidth={2} />
          </LinearGradient>
          
          <View style={styles.optionTextContainer}>
            <View style={styles.optionTitleRow}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              {option.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{option.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
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
      </TouchableOpacity>
    );
  };

  const enabledCount = notificationOptions.filter(option => option.enabled).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerContent}>
          <View style={styles.iconBadge}>
            <Bell size={28} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Stay Connected</Text>
          <Text style={styles.subtitle}>
            Choose which notifications help you build healthy habits
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification Options */}
        <View style={styles.optionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            <View style={styles.selectionPill}>
              <Text style={styles.selectionText}>
                {enabledCount}/{notificationOptions.length}
              </Text>
            </View>
          </View>
          
          {notificationOptions.map(renderNotificationOption)}
        </View>

        {/* Feature Cards Grid */}
        <View style={styles.featuresGrid}>
          {/* Privacy Card */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.success + '15' }]}>
              <Shield size={20} color={theme.colors.success} strokeWidth={2} />
            </View>
            <Text style={styles.featureTitle}>Privacy Protected</Text>
            <Text style={styles.featureText}>
              All notifications are generated locally on your device
            </Text>
          </View>

          {/* Customizable Card */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.info + '15' }]}>
              <Clock size={20} color={theme.colors.info} strokeWidth={2} />
            </View>
            <Text style={styles.featureTitle}>Fully Customizable</Text>
            <Text style={styles.featureText}>
              Change timing and preferences anytime in Settings
            </Text>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Why enable notifications?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Build consistent daily habits</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Receive personalized insights</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Track your progress over time</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>Get gentle support when you need it</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={[
            styles.getStartedButton,
            isRequestingPermission && styles.getStartedButtonDisabled,
          ]}
          onPress={handleGetStarted}
          disabled={isRequestingPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>
            {isRequestingPermission ? 'Setting up...' : 'Continue'}
          </Text>
          {!isRequestingPermission && (
            <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isRequestingPermission}
          activeOpacity={0.6}
        >
          <Text style={styles.skipButtonText}>I'll set this up later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  fixedHeader: {
    backgroundColor: '#fff',
    paddingTop: theme.spacing.md,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressBar: {
    height: 3,
    backgroundColor: theme.colors.backgroundLight,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  optionsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  selectionPill: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  optionCardActive: {
    borderColor: theme.colors.primary + '30',
    backgroundColor: theme.colors.primary + '03',
  },
  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.2,
    marginRight: theme.spacing.xs,
  },
  badge: {
    backgroundColor: theme.colors.accent + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  featureText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  benefitsCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.2,
  },
  benefitsList: {
    gap: theme.spacing.xs,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomAction: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: theme.spacing.md,
    height: 56,
    marginBottom: theme.spacing.sm,
  },
  getStartedButtonDisabled: {
    opacity: 0.6,
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: theme.spacing.sm,
    letterSpacing: -0.2,
  },
  skipButton: {
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  skipButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});

export default NotificationOptInScreen;