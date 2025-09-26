import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { X, Save, Wifi, WifiOff } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/constants/supabase';

interface UserEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (updatedProfile: any) => void;
  currentProfile: any;
}

export default function UserEditModal({ visible, onClose, onSave, currentProfile }: UserEditModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasInternet, setHasInternet] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    ageRange: '',
    primaryGoals: [] as string[],
    timezone: '',
    languagePreference: 'en'
  });

  const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'];
  const goalOptions = [
    'reduce-anxiety',
    'improve-mood',
    'better-sleep',
    'stress-management',
    'mindfulness',
    'social-support'
  ];

  useEffect(() => {
    if (visible && currentProfile) {
      setFormData({
        displayName: currentProfile.displayName || '',
        email: currentProfile.email || '',
        ageRange: currentProfile.ageRange || '',
        primaryGoals: currentProfile.primaryGoals || [],
        timezone: currentProfile.timezone || 'UTC',
        languagePreference: currentProfile.languagePreference || 'en'
      });
    }
    checkInternetConnection();
  }, [visible, currentProfile]);

  const checkInternetConnection = async () => {
    try {
      // Simple connectivity check with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setHasInternet(response.ok);
    } catch (error) {
      setHasInternet(false);
    }
  };

  const handleSave = async () => {
    if (!hasInternet) {
      Alert.alert(
        'No Internet Connection',
        'You need an internet connection to update your profile. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!formData.displayName.trim()) {
      Alert.alert('Error', 'Display name is required.');
      return;
    }

    setLoading(true);
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user?.id,
          display_name: formData.displayName.trim(),
          age_range: formData.ageRange,
          primary_goals: formData.primaryGoals,
          timezone: formData.timezone,
          language_preference: formData.languagePreference,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update email if changed
      if (formData.email !== currentProfile.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });
        if (emailError) throw emailError;
      }

      const updatedProfile = {
        ...currentProfile,
        displayName: formData.displayName.trim(),
        email: formData.email,
        ageRange: formData.ageRange,
        primaryGoals: formData.primaryGoals,
        timezone: formData.timezone,
        languagePreference: formData.languagePreference
      };

      onSave(updatedProfile);
      onClose();
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const getGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      'reduce-anxiety': 'Reduce Anxiety',
      'improve-mood': 'Improve Mood',
      'better-sleep': 'Better Sleep',
      'stress-management': 'Stress Management',
      'mindfulness': 'Mindfulness',
      'social-support': 'Social Support'
    };
    return labels[goal] || goal;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Internet Status */}
        <View style={[styles.statusBar, { backgroundColor: hasInternet ? '#4CAF50' : '#F44336' }]}>
          {hasInternet ? (
            <Wifi size={16} color="white" />
          ) : (
            <WifiOff size={16} color="white" />
          )}
          <Text style={styles.statusText}>
            {hasInternet ? 'Connected' : 'No Internet Connection'}
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Display Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.displayName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, displayName: text }))}
              placeholder="Enter your display name"
              placeholderTextColor={theme.colors.textLight}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Age Range */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age Range</Text>
            <View style={styles.ageRangeContainer}>
              {ageRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.ageRangeButton,
                    formData.ageRange === range && styles.ageRangeButtonSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, ageRange: range }))}
                >
                  <Text style={[
                    styles.ageRangeText,
                    formData.ageRange === range && styles.ageRangeTextSelected
                  ]}>
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Primary Goals */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Primary Goals</Text>
            <View style={styles.goalsContainer}>
              {goalOptions.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.goalButton,
                    formData.primaryGoals.includes(goal) && styles.goalButtonSelected
                  ]}
                  onPress={() => toggleGoal(goal)}
                >
                  <Text style={[
                    styles.goalText,
                    formData.primaryGoals.includes(goal) && styles.goalTextSelected
                  ]}>
                    {getGoalLabel(goal)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Timezone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Timezone</Text>
            <TextInput
              style={styles.input}
              value={formData.timezone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, timezone: text }))}
              placeholder="UTC"
              placeholderTextColor={theme.colors.textLight}
            />
          </View>

          {/* Language */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Language</Text>
            <TextInput
              style={styles.input}
              value={formData.languagePreference}
              onChangeText={(text) => setFormData(prev => ({ ...prev, languagePreference: text }))}
              placeholder="en"
              placeholderTextColor={theme.colors.textLight}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, !hasInternet && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading || !hasInternet}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Save size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  statusText: {
    color: 'white',
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
  },
  ageRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  ageRangeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceLight,
  },
  ageRangeButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  ageRangeText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
  },
  ageRangeTextSelected: {
    color: 'white',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  goalButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceLight,
  },
  goalButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  goalText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text,
  },
  goalTextSelected: {
    color: 'white',
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.textLight,
  },
  saveButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
});
