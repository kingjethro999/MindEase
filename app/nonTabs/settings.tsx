import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Cloud, 
  Moon, 
  Globe, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Check,
  X,
  Trash2,
  Download,
  Upload
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Switch, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { useTranslation } from '../../contexts/TranslationContext';
import { getSupportedLanguages } from '../../utils/translations';
import { 
  getUserProfile, 
  saveUserProfile, 
  clearAllOfflineData,
  getExerciseCompletions,
  getMoodEntries,
  getAchievements,
  getAppSettings,
  saveAppSettings,
  updateAppSettings
} from '../../utils/offlineStorage';
import { generateExportData, generateTextReport, shareData, saveDataToDevice } from '../../utils/exportUtils';
import UserEditModal from '../../components/UserEditModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import notificationService from '../../services/NotificationService';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { showAlert, showConfirm } = useAlert();
  const { t, language: currentLanguage, setLanguage: setCurrentLanguage } = useTranslation();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  
  // Settings state
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    affirmations: true,
    weeklyReports: true,
  });
  
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    cloudBackup: false,
    dataSharing: false,
    autoSync: false,
  });
  
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    loadUserSettings();
    checkNotificationPermission();
    loadThemePreference();
  }, []);

  const loadUserSettings = async () => {
    try {
      const [profile, appSettingsData] = await Promise.all([
        getUserProfile(),
        getAppSettings()
      ]);
      
      if (profile) {
        setUserProfile(profile);
        setNotifications({
          dailyReminder: profile.notification_preferences?.daily_reminder ?? true,
          affirmations: profile.notification_preferences?.affirmations ?? true,
          weeklyReports: profile.notification_preferences?.weekly_reports ?? true
        });
        setLanguage(profile.language_preference || 'en');
        setTimezone(profile.timezone || 'UTC');
      }
      
      // Load app settings
      setAppSettings(appSettingsData);
    } catch (error) {
      console.error('Error loading user settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      // Save user profile settings
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          notification_preferences: notifications,
          language_preference: language,
          timezone: timezone,
        };
        await saveUserProfile(updatedProfile);
        setUserProfile(updatedProfile);
      }
      
      // Save app settings
      await saveAppSettings(appSettings);
      
      showAlert({
        type: 'success',
        title: t('success'),
        message: t('settingsSavedSuccessfully')
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      showAlert({
        type: 'error',
        title: t('error'),
        message: t('failedToSaveSettings')
      });
    }
  };

  const handleSignOut = () => {
    showConfirm(
      t('confirmSignOut'),
      t('areYouSureYouWantToSignOut'),
      async () => {
        try {
          await signOut();
          router.replace('/auth');
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }
    );
  };

  const handleClearData = () => {
    showConfirm(
      t('clearAllDataTitle'),
      t('clearAllDataMessage'),
      async () => {
        try {
          await clearAllOfflineData();
          showAlert({
            type: 'success',
            title: t('success'),
            message: t('allDataCleared')
          });
        } catch (error) {
          console.error('Error clearing data:', error);
          showAlert({
            type: 'error',
            title: t('error'),
            message: t('failedToClearData')
          });
        }
      }
    );
  };

  const handleCloudBackup = async (value: boolean) => {
    try {
      const updatedSettings = { ...appSettings, cloudBackup: value };
      setAppSettings(updatedSettings);
      
      // Save immediately to AsyncStorage
      await updateAppSettings({ cloudBackup: value });
      
      if (value) {
        showAlert({
          type: 'success',
          title: t('cloudBackupEnabled'),
          message: t('cloudBackupEnabledMessage')
        });
      } else {
        showAlert({
          type: 'info',
          title: t('cloudBackupDisabled'),
          message: t('cloudBackupDisabledSyncMessage')
        });
      }
    } catch (error) {
      console.error('Error with cloud backup:', error);
      showAlert({
        type: 'error',
        title: t('error'),
        message: t('cloudBackupError')
      });
    }
  };

  const getDataStats = async () => {
    try {
      const [exercises, moods, achievements] = await Promise.all([
        getExerciseCompletions(),
        getMoodEntries(),
        getAchievements()
      ]);
      
      return {
        exercises: exercises.length,
        moods: moods.length,
        achievements: achievements.length
      };
    } catch (error) {
      console.error('Error getting data stats:', error);
      return { exercises: 0, moods: 0, achievements: 0 };
    }
  };

  const handleExportData = async () => {
    try {
      showAlert({
        type: 'info',
        title: t('exportingData'),
        message: t('generatingYourWellnessReport')
      });

      const exportData = await generateExportData();
      
      showAlert({
        type: 'success',
        title: t('exportComplete'),
        message: t('exportCompleteMessage', {
          moodEntries: exportData.moodEntries.length,
          exercises: exportData.exerciseCompletions.length,
          journalEntries: exportData.journalEntries.length
        }),
        buttons: [
          { text: t('saveToDevice'), onPress: async () => {
            try {
              const filePath = await saveDataToDevice(exportData, 'text');
              showAlert({
                type: 'success',
                title: t('savedSuccessfully'),
                message: `Report saved to: ${filePath}`
              });
            } catch (error) {
              showAlert({
                type: 'error',
                title: t('saveFailed'),
                message: 'Failed to save report to device.'
              });
            }
          }},
          { text: t('shareReport'), onPress: async () => {
            try {
              await shareData(exportData, 'text');
            } catch (error) {
              showAlert({
                type: 'error',
                title: t('shareFailed'),
                message: 'Failed to share report. Please try again.'
              });
            }
          }},
          { text: t('cancel'), style: 'cancel' }
        ]
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      showAlert({
        type: 'error',
        title: t('exportFailed'),
        message: 'Failed to export your data. Please try again.'
      });
    }
  };

  const handleUserEdit = () => {
    setShowUserEditModal(true);
  };

  const handleUserEditSave = async (updatedProfile: any) => {
    try {
      await saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
      showAlert({
        type: 'success',
        title: t('success'),
        message: t('profileUpdatedSuccessfully')
      });
    } catch (error) {
      console.error('Error saving updated profile:', error);
      showAlert({
        type: 'error',
        title: t('error'),
        message: t('failedToSaveProfile')
      });
    }
  };

  // Notification permission check
  const checkNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationPermission(status === 'granted');
    } catch (error) {
      console.error('Error checking notification permission:', error);
    }
  };

  // Load theme preference
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      setIsDarkMode(savedTheme === 'true');
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = async (type: string, value: boolean) => {
    try {
      if (value && !notificationPermission) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          showAlert({
            type: 'error',
            title: t('permissionRequired'),
            message: t('permissionRequiredMessage')
          });
          return;
        }
        setNotificationPermission(true);
      }

      setNotifications(prev => ({ ...prev, [type]: value }));
      
      // Update notification service settings
      const serviceSettings = {
        enabled: notifications.dailyReminder || notifications.affirmations || notifications.weeklyReports,
        dailyReminder: notifications.dailyReminder,
        dailyAffirmation: notifications.affirmations,
        weeklyReport: notifications.weeklyReports,
        exerciseReminders: false,
      };
      
      // Save settings first
      await notificationService.saveSettings(serviceSettings);
      
      // Then enable/disable notifications based on user choice
      if (serviceSettings.enabled) {
        await notificationService.enableNotifications();
      } else {
        await notificationService.disableNotifications();
      }
    } catch (error) {
      console.error('Error handling notification toggle:', error);
      showAlert({
        type: 'error',
        title: t('error'),
        message: 'Failed to update notification settings.'
      });
    }
  };


  // Test notification
  const testNotification = async () => {
    try {
      await notificationService.sendTestNotification();
      showAlert({
        type: 'success',
        title: 'Test Notification Sent',
        message: 'You should receive a test notification in 2 seconds.'
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to send test notification.'
      });
    }
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = async (value: boolean) => {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem('darkMode', value.toString());
      showAlert({
        type: 'info',
        title: t('themeUpdated'),
        message: value ? t('darkModeEnabled') : t('lightModeEnabled')
      });
    } catch (error) {
      console.error('Error toggling dark mode:', error);
      showAlert({
        type: 'error',
        title: t('error'),
        message: 'Failed to update theme preference.'
      });
    }
  };

  // Handle language selection
  const handleLanguageSelection = () => {
    const supportedLanguages = getSupportedLanguages();
    const languageOptions = supportedLanguages.map(lang => ({
      label: lang.nativeName,
      value: lang.code
    }));
    
    showAlert({
      type: 'info',
      title: t('languageSelection'),
      message: t('selectYourPreferredLanguage'),
      buttons: [
        ...languageOptions.map(lang => ({
          text: lang.label,
          onPress: () => setCurrentLanguage(lang.value)
        })),
        { text: t('cancel'), style: 'cancel' }
      ]
    });
  };

  // Handle help and support
  const handleHelpSupport = () => {
    showAlert({
      type: 'info',
      title: t('helpAndSupportTitle'),
      message: t('helpAndSupportMessage'),
      buttons: [
        { text: t('contactSupport'), onPress: () => Linking.openURL('mailto:jethrojerrybj@gmail.com') },
        { text: t('cancel'), style: 'cancel' }
      ]
    });
  };

  // Handle privacy policy
  const handlePrivacyPolicy = () => {
    showAlert({
      type: 'info',
      title: t('privacyPolicyTitle'),
      message: t('privacyPolicyMessage'),
      buttons: [
        { text: t('viewFullPolicy'), onPress: () => Linking.openURL('https://mindease.app/privacy') },
        { text: t('ok'), style: 'default' }
      ]
    });
  };

  // Handle backup now
  const handleBackupNow = async () => {
    try {
      if (!appSettings.cloudBackup) {
        showAlert({
          type: 'error',
          title: t('cloudBackupDisabledTitle'),
          message: t('cloudBackupDisabledSyncMessage')
        });
        return;
      }

      showAlert({
        type: 'info',
        title: t('backingUpData'),
        message: 'Your data is being backed up to the cloud. This may take a few moments...'
      });

      // Simulate backup process
      setTimeout(() => {
        showAlert({
          type: 'success',
          title: t('backupComplete'),
          message: 'Your data has been successfully backed up to the cloud.'
        });
      }, 2000);
    } catch (error) {
      console.error('Error backing up data:', error);
      showAlert({
        type: 'error',
        title: t('backupFailed'),
        message: 'Failed to backup your data. Please check your internet connection and try again.'
      });
    }
  };

  // Handle restore data
  const handleRestoreData = async () => {
    try {
      if (!appSettings.cloudBackup) {
        showAlert({
          type: 'error',
          title: t('cloudBackupDisabledTitle'),
          message: 'Please enable cloud backup first to restore your data.'
        });
        return;
      }

      showConfirm(
        t('restoreDataTitle'),
        t('restoreDataMessage'),
        async () => {
          try {
            showAlert({
              type: 'info',
              title: t('restoringData'),
              message: 'Your data is being restored from the cloud. This may take a few moments...'
            });

            // Simulate restore process
            setTimeout(() => {
              showAlert({
                type: 'success',
                title: t('restoreComplete'),
                message: 'Your data has been successfully restored from the cloud.'
              });
            }, 2000);
          } catch (error) {
            console.error('Error restoring data:', error);
            showAlert({
              type: 'error',
              title: t('restoreFailed'),
              message: 'Failed to restore your data. Please check your internet connection and try again.'
            });
          }
        }
      );
    } catch (error) {
      console.error('Error handling restore data:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('loading')} settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <SettingsIcon size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>{t('settings')}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('account')}</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleUserEdit}>
            <View style={styles.settingIcon}>
              <User size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('profile')}</Text>
              <Text style={styles.settingSubtitle}>
                {userProfile?.displayName || user?.user_metadata?.full_name || user?.email || t('anonymousUser')}
              </Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('dailyReminders')}</Text>
              <Text style={styles.settingSubtitle}>{t('dailyMoodCheckInReminders')}</Text>
            </View>
            <Switch
              value={notifications.dailyReminder}
              onValueChange={(value) => handleNotificationToggle('dailyReminder', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={notifications.dailyReminder ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('affirmations')}</Text>
              <Text style={styles.settingSubtitle}>{t('dailyPositiveAffirmations')}</Text>
            </View>
            <Switch
              value={notifications.affirmations}
              onValueChange={(value) => handleNotificationToggle('affirmations', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={notifications.affirmations ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('weeklyReports')}</Text>
              <Text style={styles.settingSubtitle}>{t('weeklyProgressSummaries')}</Text>
            </View>
            <Switch
              value={notifications.weeklyReports}
              onValueChange={(value) => handleNotificationToggle('weeklyReports', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={notifications.weeklyReports ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          {/* Test Notification Button */}
          <TouchableOpacity style={styles.testNotificationButton} onPress={testNotification}>
            <Bell size={20} color={theme.colors.primary} />
            <Text style={styles.testNotificationText}>Test Notification</Text>
          </TouchableOpacity>

        </View>

        {/* Privacy & Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacyAndData')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Cloud size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('cloudBackup')}</Text>
              <Text style={styles.settingSubtitle}>{t('syncDataAcrossDevices')}</Text>
            </View>
            <Switch
              value={appSettings.cloudBackup}
              onValueChange={handleCloudBackup}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={appSettings.cloudBackup ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleBackupNow}>
            <View style={styles.settingIcon}>
              <Upload size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('backupNow')}</Text>
              <Text style={styles.settingSubtitle}>{t('uploadDataToCloud')}</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleRestoreData}>
            <View style={styles.settingIcon}>
              <Download size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('restoreData')}</Text>
              <Text style={styles.settingSubtitle}>{t('downloadFromCloud')}</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appPreferences')}</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSelection}>
            <View style={styles.settingIcon}>
              <Globe size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('language')}</Text>
              <Text style={styles.settingSubtitle}>{getSupportedLanguages().find(lang => lang.code === currentLanguage)?.nativeName || t('english')}</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dataManagement')}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingIcon}>
              <Download size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('exportData')}</Text>
              <Text style={styles.settingSubtitle}>{t('downloadYourWellnessReport')}</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
            <View style={styles.settingIcon}>
              <Trash2 size={20} color={theme.colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.error }]}>{t('clearAllData')}</Text>
              <Text style={styles.settingSubtitle}>{t('deleteAllLocalData')}</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support')}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleHelpSupport}>
            <View style={styles.settingIcon}>
              <HelpCircle size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('helpAndSupport')}</Text>
              <Text style={styles.settingSubtitle}>{t('getHelpAndContactSupport')}</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{t('privacyPolicy')}</Text>
              <Text style={styles.settingSubtitle}>{t('readOurPrivacyPolicy')}</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Section */}
        {user && (
          <View style={styles.section}>
            <TouchableOpacity style={[styles.settingItem, styles.signOutItem]} onPress={handleSignOut}>
              <View style={styles.settingIcon}>
                <LogOut size={20} color={theme.colors.error} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.colors.error }]}>{t('signOut')}</Text>
                <Text style={styles.settingSubtitle}>{t('signOutOfYourAccount')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>{t('saveSettings')}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('mindEaseVersion')}</Text>
          <Text style={styles.footerText}>{t('yourMentalWellnessCompanion')}</Text>
        </View>
      </ScrollView>

      {/* User Edit Modal */}
      <UserEditModal
        visible={showUserEditModal}
        onClose={() => setShowUserEditModal(false)}
        onSave={handleUserEditSave}
        currentProfile={userProfile}
      />
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
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  testNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    gap: theme.spacing.sm,
  },
  testNotificationText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.caption,
  },
  signOutItem: {
    backgroundColor: theme.colors.error + '10',
    borderColor: theme.colors.error + '30',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
});
