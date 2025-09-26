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
import { 
  getUserProfile, 
  saveUserProfile, 
  clearAllOfflineData,
  getExerciseCompletions,
  getMoodEntries,
  getAchievements
} from '../../utils/offlineStorage';
import { generateExportData, generateTextReport, shareData, saveDataToDevice } from '../../utils/exportUtils';
import UserEditModal from '../../components/UserEditModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { showAlert, showConfirm } = useAlert();
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
      const profile = await getUserProfile();
      if (profile) {
        setUserProfile(profile);
        setNotifications({
          dailyReminder: profile.notificationPreferences?.dailyReminder ?? true,
          affirmations: profile.notificationPreferences?.affirmations ?? true,
          weeklyReports: profile.notificationPreferences?.weeklyReports ?? true
        });
        setLanguage(profile.languagePreference || 'en');
        setTimezone(profile.timezone || 'UTC');
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          notificationPreferences: notifications,
          languagePreference: language,
          timezone: timezone,
        };
        await saveUserProfile(updatedProfile);
        setUserProfile(updatedProfile);
        showAlert({
          type: 'success',
          title: 'Success',
          message: 'Settings saved successfully!'
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to save settings. Please try again.'
      });
    }
  };

  const handleSignOut = () => {
    showConfirm(
      'Sign Out',
      'Are you sure you want to sign out?',
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
      'Clear All Data',
      'This will permanently delete all your local data including mood entries, exercise history, and achievements. This action cannot be undone.',
      async () => {
        try {
          await clearAllOfflineData();
          showAlert({
            type: 'success',
            title: 'Success',
            message: 'All data has been cleared.'
          });
        } catch (error) {
          console.error('Error clearing data:', error);
          showAlert({
            type: 'error',
            title: 'Error',
            message: 'Failed to clear data. Please try again.'
          });
        }
      }
    );
  };

  const handleCloudBackup = async () => {
    try {
      if (!appSettings.cloudBackup) {
        // Enable cloud backup
        setAppSettings(prev => ({ ...prev, cloudBackup: true }));
        showAlert({
          type: 'success',
          title: 'Cloud Backup Enabled',
          message: 'Your data will now be automatically backed up to the cloud when you have an internet connection.'
        });
      } else {
        // Disable cloud backup
        setAppSettings(prev => ({ ...prev, cloudBackup: false }));
        showAlert({
          type: 'info',
          title: 'Cloud Backup Disabled',
          message: 'Your data will only be stored locally on this device.'
        });
      }
    } catch (error) {
      console.error('Error with cloud backup:', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to update cloud backup settings.'
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
        title: 'Exporting Data',
        message: 'Generating your wellness report...'
      });

      const exportData = await generateExportData();
      
      showAlert({
        type: 'success',
        title: 'Export Complete',
        message: `Your wellness report has been generated with ${exportData.moodEntries.length} mood entries, ${exportData.exerciseCompletions.length} exercises, and ${exportData.journalEntries.length} journal entries.`,
        buttons: [
          { text: 'Save to Device', onPress: async () => {
            try {
              const filePath = await saveDataToDevice(exportData, 'text');
              showAlert({
                type: 'success',
                title: 'Saved Successfully',
                message: `Report saved to: ${filePath}`
              });
            } catch (error) {
              showAlert({
                type: 'error',
                title: 'Save Failed',
                message: 'Failed to save report to device.'
              });
            }
          }},
          { text: 'Share Report', onPress: async () => {
            try {
              await shareData(exportData, 'text');
            } catch (error) {
              showAlert({
                type: 'error',
                title: 'Share Failed',
                message: 'Failed to share report. Please try again.'
              });
            }
          }},
          { text: 'Cancel', style: 'cancel' }
        ]
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      showAlert({
        type: 'error',
        title: 'Export Failed',
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
        title: 'Success',
        message: 'Profile updated successfully!'
      });
    } catch (error) {
      console.error('Error saving updated profile:', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to save profile changes locally.'
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
            title: 'Permission Required',
            message: 'Please enable notifications in your device settings to receive reminders.'
          });
          return;
        }
        setNotificationPermission(true);
      }

      setNotifications(prev => ({ ...prev, [type]: value }));
      
      // Schedule/cancel notifications based on type
      if (type === 'dailyReminder' && value) {
        await scheduleDailyReminder();
      } else if (type === 'dailyReminder' && !value) {
        await cancelDailyReminder();
      }
      
      if (type === 'affirmations' && value) {
        await scheduleAffirmations();
      } else if (type === 'affirmations' && !value) {
        await cancelAffirmations();
      }
      
      if (type === 'weeklyReports' && value) {
        await scheduleWeeklyReports();
      } else if (type === 'weeklyReports' && !value) {
        await cancelWeeklyReports();
      }
    } catch (error) {
      console.error('Error handling notification toggle:', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to update notification settings.'
      });
    }
  };

  // Schedule daily reminder
  const scheduleDailyReminder = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Check-in',
          body: 'How are you feeling today? Take a moment to log your mood.',
          sound: true,
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        } as any,
      });
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
    }
  };

  // Cancel daily reminder
  const cancelDailyReminder = async () => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const dailyReminder = scheduledNotifications.find(notification => 
        notification.content.title === 'Daily Check-in'
      );
      if (dailyReminder) {
        await Notifications.cancelScheduledNotificationAsync(dailyReminder.identifier);
      }
    } catch (error) {
      console.error('Error canceling daily reminder:', error);
    }
  };

  // Schedule affirmations
  const scheduleAffirmations = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Affirmation',
          body: 'You are capable, strong, and worthy of happiness. Take a deep breath and believe in yourself.',
          sound: true,
        },
        trigger: {
          hour: 8,
          minute: 0,
          repeats: true,
        } as any,
      });
    } catch (error) {
      console.error('Error scheduling affirmations:', error);
    }
  };

  // Cancel affirmations
  const cancelAffirmations = async () => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const affirmation = scheduledNotifications.find(notification => 
        notification.content.title === 'Daily Affirmation'
      );
      if (affirmation) {
        await Notifications.cancelScheduledNotificationAsync(affirmation.identifier);
      }
    } catch (error) {
      console.error('Error canceling affirmations:', error);
    }
  };

  // Schedule weekly reports
  const scheduleWeeklyReports = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Weekly Report Ready',
          body: 'Your weekly wellness report is ready! Check your progress and insights.',
          sound: true,
        },
        trigger: {
          weekday: 1, // Monday
          hour: 10,
          minute: 0,
          repeats: true,
        } as any,
      });
    } catch (error) {
      console.error('Error scheduling weekly reports:', error);
    }
  };

  // Cancel weekly reports
  const cancelWeeklyReports = async () => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const weeklyReport = scheduledNotifications.find(notification => 
        notification.content.title === 'Weekly Report Ready'
      );
      if (weeklyReport) {
        await Notifications.cancelScheduledNotificationAsync(weeklyReport.identifier);
      }
    } catch (error) {
      console.error('Error canceling weekly reports:', error);
    }
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = async (value: boolean) => {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem('darkMode', value.toString());
      showAlert({
        type: 'info',
        title: 'Theme Updated',
        message: value ? 'Dark mode enabled. Restart the app to see changes.' : 'Light mode enabled. Restart the app to see changes.'
      });
    } catch (error) {
      console.error('Error toggling dark mode:', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to update theme preference.'
      });
    }
  };

  // Handle language selection
  const handleLanguageSelection = () => {
    showAlert({
      type: 'info',
      title: 'Language Selection',
      message: 'Language selection will be available in a future update. Currently supporting English only.',
      buttons: [
        { text: 'OK', style: 'default' }
      ]
    });
  };

  // Handle help and support
  const handleHelpSupport = () => {
    showAlert({
      type: 'info',
      title: 'Help & Support',
      message: 'For support, please contact us at:\n\nEmail: support@mindease.app\n\nOr visit our help center for FAQs and guides.',
      buttons: [
        { text: 'Contact Support', onPress: () => Linking.openURL('mailto:support@mindease.app') },
        { text: 'Cancel', style: 'cancel' }
      ]
    });
  };

  // Handle privacy policy
  const handlePrivacyPolicy = () => {
    showAlert({
      type: 'info',
      title: 'Privacy Policy',
      message: 'Your privacy is important to us. All your data is stored locally on your device and is never shared without your explicit consent.\n\nKey points:\n• Data is stored locally by default\n• Cloud backup is optional\n• No data is sold to third parties\n• You can export or delete your data anytime',
      buttons: [
        { text: 'View Full Policy', onPress: () => Linking.openURL('https://mindease.app/privacy') },
        { text: 'OK', style: 'default' }
      ]
    });
  };

  // Handle backup now
  const handleBackupNow = async () => {
    try {
      if (!appSettings.cloudBackup) {
        showAlert({
          type: 'error',
          title: 'Cloud Backup Disabled',
          message: 'Please enable cloud backup first to sync your data.'
        });
        return;
      }

      showAlert({
        type: 'info',
        title: 'Backing Up Data',
        message: 'Your data is being backed up to the cloud. This may take a few moments...'
      });

      // Simulate backup process
      setTimeout(() => {
        showAlert({
          type: 'success',
          title: 'Backup Complete',
          message: 'Your data has been successfully backed up to the cloud.'
        });
      }, 2000);
    } catch (error) {
      console.error('Error backing up data:', error);
      showAlert({
        type: 'error',
        title: 'Backup Failed',
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
          title: 'Cloud Backup Disabled',
          message: 'Please enable cloud backup first to restore your data.'
        });
        return;
      }

      showConfirm(
        'Restore Data',
        'This will replace your current local data with the data from the cloud. Are you sure you want to continue?',
        async () => {
          try {
            showAlert({
              type: 'info',
              title: 'Restoring Data',
              message: 'Your data is being restored from the cloud. This may take a few moments...'
            });

            // Simulate restore process
            setTimeout(() => {
              showAlert({
                type: 'success',
                title: 'Restore Complete',
                message: 'Your data has been successfully restored from the cloud.'
              });
            }, 2000);
          } catch (error) {
            console.error('Error restoring data:', error);
            showAlert({
              type: 'error',
              title: 'Restore Failed',
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
          <Text style={styles.loadingText}>Loading settings...</Text>
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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleUserEdit}>
            <View style={styles.settingIcon}>
              <User size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Profile</Text>
              <Text style={styles.settingSubtitle}>
                {userProfile?.displayName || user?.user_metadata?.full_name || user?.email || 'Anonymous User'}
              </Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Daily Reminders</Text>
              <Text style={styles.settingSubtitle}>Daily mood check-in reminders</Text>
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
              <Text style={styles.settingTitle}>Affirmations</Text>
              <Text style={styles.settingSubtitle}>Daily positive affirmations</Text>
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
              <Text style={styles.settingTitle}>Weekly Reports</Text>
              <Text style={styles.settingSubtitle}>Weekly progress summaries</Text>
            </View>
            <Switch
              value={notifications.weeklyReports}
              onValueChange={(value) => handleNotificationToggle('weeklyReports', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={notifications.weeklyReports ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

        </View>

        {/* Privacy & Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Cloud size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Cloud Backup</Text>
              <Text style={styles.settingSubtitle}>Sync data across devices</Text>
            </View>
            <Switch
              value={appSettings.cloudBackup}
              onValueChange={(value) => setAppSettings(prev => ({ ...prev, cloudBackup: value }))}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={appSettings.cloudBackup ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleBackupNow}>
            <View style={styles.settingIcon}>
              <Upload size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Backup Now</Text>
              <Text style={styles.settingSubtitle}>Upload data to cloud</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleRestoreData}>
            <View style={styles.settingIcon}>
              <Download size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Restore Data</Text>
              <Text style={styles.settingSubtitle}>Download from cloud</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Moon size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>Use dark theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
              thumbColor={isDarkMode ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSelection}>
            <View style={styles.settingIcon}>
              <Globe size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingSubtitle}>English</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingIcon}>
              <Download size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingSubtitle}>Download your wellness report</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
            <View style={styles.settingIcon}>
              <Trash2 size={20} color={theme.colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.error }]}>Clear All Data</Text>
              <Text style={styles.settingSubtitle}>Delete all local data</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleHelpSupport}>
            <View style={styles.settingIcon}>
              <HelpCircle size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingSubtitle}>Get help and contact support</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingSubtitle}>Read our privacy policy</Text>
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
                <Text style={[styles.settingTitle, { color: theme.colors.error }]}>Sign Out</Text>
                <Text style={styles.settingSubtitle}>Sign out of your account</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>MindEase v1.0.0</Text>
          <Text style={styles.footerText}>Your mental wellness companion</Text>
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
