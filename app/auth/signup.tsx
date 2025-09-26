import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from '../../components/Dropdown';
import { supabase } from '../../constants/supabase';
import { useAlert } from '../../contexts/AlertContext';
import { theme } from '../../theme/theme';

interface UserProfileData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  ageRange: string;
  languagePreference: string;
}

export default function SignupScreen() {
  const { mode, email: preFilledEmail } = useLocalSearchParams<{ mode?: string; email?: string }>();
  const isCompletionMode = mode === 'complete';
  
  const [currentStage, setCurrentStage] = useState(isCompletionMode ? 1 : 1); // Start from stage 1 for both modes
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useAlert();
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    fullName: '',
    email: preFilledEmail || '',
    password: '',
    confirmPassword: '',
    username: '',
    ageRange: '',
    languagePreference: 'en',
  });

  // Pre-fill email if in completion mode
  useEffect(() => {
    if (isCompletionMode && preFilledEmail) {
      setProfileData(prev => ({ ...prev, email: preFilledEmail }));
    }
  }, [isCompletionMode, preFilledEmail]);

  const ageRangeOptions = [
    { label: '10-17', value: '10-17' },
    { label: '18-25', value: '18-25' },
    { label: '26-35', value: '26-35' },
    { label: '36-45', value: '36-45' },
    { label: '46-55', value: '46-55' },
    { label: '55+', value: '55+' },
  ];

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Portuguese', value: 'pt' },
  ];

  const updateProfileData = (field: keyof UserProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const validateStage1 = () => {
    if (!profileData.fullName.trim()) {
      showError('Error', 'Please enter your full name');
      return false;
    }
    if (!profileData.email.trim()) {
      showError('Error', 'Please enter your email address');
      return false;
    }
    if (!profileData.username.trim()) {
      showError('Error', 'Please enter a username');
      return false;
    }
    return true;
  };

  const validateStage2 = () => {
    if (isCompletionMode) {
      // For completion mode, validate age range and language preference
      if (!profileData.ageRange) {
        showError('Error', 'Please select your age range');
        return false;
      }
      if (!profileData.languagePreference) {
        showError('Error', 'Please select your language preference');
        return false;
      }
      return true;
    }
    
    // For new signup mode, validate password
    if (profileData.password.length < 6) {
      showError('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (profileData.password !== profileData.confirmPassword) {
      showError('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStage3 = () => {
    if (!profileData.ageRange) {
      showError('Error', 'Please select your age range');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStage === 1 && validateStage1()) {
      setCurrentStage(2);
    } else if (currentStage === 2 && validateStage2()) {
      if (isCompletionMode) {
        // In completion mode, stage 2 leads to goal selection
        handleCompleteProfileToGoals();
      } else {
        setCurrentStage(3);
      }
    } else if (currentStage === 3 && validateStage3()) {
      handleFinalSignup();
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    } else {
      router.back();
    }
  };

  const handleCompleteProfileToGoals = async () => {
    setLoading(true);
    try {
      // Store profile data in AsyncStorage for goal selection to use
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem('pending_user_profile', JSON.stringify({
        username: profileData.username,
        ageRange: profileData.ageRange,
        languagePreference: profileData.languagePreference,
        displayName: profileData.fullName.trim(),
      }));

      showSuccess(
        'Profile Updated!',
        'Great! Now let\'s personalize your experience by selecting your wellness goals.'
      );
      
      // Navigate to goal selection
      setTimeout(() => {
        router.replace('/auth/goal-selection');
      }, 1500);
    } catch (error) {
      console.error('Error saving profile data:', error);
      showError('Error', 'Failed to save your profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSignup = async () => {
    setLoading(true);
    try {
      if (isCompletionMode) {
        // Profile completion mode - update existing user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          showError('Error', 'User not authenticated. Please log in again.');
          return;
        }

        // Store profile data in AsyncStorage for goal selection to use
        try {
          const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
          await AsyncStorage.setItem('pending_user_profile', JSON.stringify({
            username: profileData.username,
            ageRange: profileData.ageRange,
            languagePreference: profileData.languagePreference,
            displayName: profileData.fullName.trim(),
          }));
        } catch (storageError) {
          console.error('Error saving profile data:', storageError);
          showError('Error', 'Failed to save your profile data. Please try again.');
          return;
        }

        showSuccess(
          'Profile Updated!',
          'Great! Now let\'s personalize your experience by selecting your wellness goals.'
        );
        
        // Navigate to goal selection
        setTimeout(() => {
          router.replace('/auth/goal-selection');
        }, 1500);

      } else {
        // New signup mode - create new user
        const { error } = await supabase.auth.signUp({
          email: profileData.email.trim().toLowerCase(),
          password: profileData.password,
          options: {
            data: {
              full_name: profileData.fullName.trim(),
            },
          },
        });

        if (error) {
          showError('Signup Failed', error.message);
          return;
        }

        // Store profile data in AsyncStorage for goal selection to use
        try {
          const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
          await AsyncStorage.setItem('pending_user_profile', JSON.stringify({
            username: profileData.username,
            ageRange: profileData.ageRange,
            languagePreference: profileData.languagePreference,
            displayName: profileData.fullName.trim(),
          }));
        } catch (storageError) {
          console.error('Error saving profile data:', storageError);
          showError('Error', 'Failed to save your profile data. Please try again.');
          return;
        }

        showSuccess(
          'Account Created!',
          'Great! Now let\'s personalize your experience by selecting your wellness goals.'
        );
        
        // Navigate to goal selection
        setTimeout(() => {
          router.replace('/auth/goal-selection');
        }, 1500);
      }
    } catch (error) {
      showError('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStage1 = () => (
    <>
      <Text style={styles.stageTitle}>Basic Information</Text>
      <Text style={styles.stageSubtitle}>Tell us a bit about yourself</Text>
      
      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <User size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor={theme.colors.textSecondary}
            value={profileData.fullName}
            onChangeText={(value) => updateProfileData('fullName', value)}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, isCompletionMode && styles.readOnlyInput]}>
          <Mail size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, isCompletionMode && styles.readOnlyInputText]}
            placeholder="Email address"
            placeholderTextColor={theme.colors.textSecondary}
            value={profileData.email}
            onChangeText={(value) => updateProfileData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isCompletionMode}
          />
        </View>
        {isCompletionMode && (
          <Text style={styles.readOnlyNote}>
            Email cannot be changed during profile completion
          </Text>
        )}
      </View>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <User size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={theme.colors.textSecondary}
            value={profileData.username}
            onChangeText={(value) => updateProfileData('username', value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>
    </>
  );

  const renderStage2 = () => {
    if (isCompletionMode) {
      // Show preferences for profile completion
      return (
        <>
          <Text style={styles.stageTitle}>Personal Preferences</Text>
          <Text style={styles.stageSubtitle}>Tell us about your preferences</Text>
          
          {/* Age Range Dropdown */}
          <View style={styles.inputContainer}>
            <Dropdown
              placeholder="Select your age range"
              options={ageRangeOptions}
              selectedValue={profileData.ageRange}
              onSelect={(value) => updateProfileData('ageRange', value)}
            />
          </View>

          {/* Language Preference Dropdown */}
          <View style={styles.inputContainer}>
            <Dropdown
              placeholder="Select your preferred language"
              options={languageOptions}
              selectedValue={profileData.languagePreference}
              onSelect={(value) => updateProfileData('languagePreference', value)}
            />
          </View>
        </>
      );
    }

    return (
      <>
        <Text style={styles.stageTitle}>Security</Text>
        <Text style={styles.stageSubtitle}>Create a secure password</Text>
        
        {/* Password Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Lock size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password (min. 6 characters)"
              placeholderTextColor={theme.colors.textSecondary}
              value={profileData.password}
              onChangeText={(value) => updateProfileData('password', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? (
                <EyeOff size={20} color={theme.colors.textSecondary} />
              ) : (
                <Eye size={20} color={theme.colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Lock size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirm password"
              placeholderTextColor={theme.colors.textSecondary}
              value={profileData.confirmPassword}
              onChangeText={(value) => updateProfileData('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={theme.colors.textSecondary} />
              ) : (
                <Eye size={20} color={theme.colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const renderStage3 = () => {
    if (isCompletionMode) {
      // For completion mode, this stage is already handled in stage 2
      return null;
    }

    return (
      <>
        <Text style={styles.stageTitle}>Preferences</Text>
        <Text style={styles.stageSubtitle}>Help us personalize your experience</Text>
        
        {/* Age Range Dropdown */}
        <View style={styles.inputContainer}>
          <Dropdown
            placeholder="Select your age range"
            options={ageRangeOptions}
            selectedValue={profileData.ageRange}
            onSelect={(value) => updateProfileData('ageRange', value)}
          />
        </View>

        {/* Language Preference Dropdown */}
        <View style={styles.inputContainer}>
          <Dropdown
            placeholder="Select your preferred language"
            options={languageOptions}
            selectedValue={profileData.languagePreference}
            onSelect={(value) => updateProfileData('languagePreference', value)}
          />
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {isCompletionMode ? 'Complete Your Profile' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              Step {currentStage} of 3
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {currentStage === 1 && renderStage1()}
            {currentStage === 2 && renderStage2()}
            {currentStage === 3 && renderStage3()}

            {/* Next/Continue Button */}
            <TouchableOpacity
              style={[
                styles.nextButton,
                loading && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.nextButtonText}>
                {loading 
                  ? (isCompletionMode ? 'Saving Profile...' : 'Creating Account...') 
                  : (currentStage === 3 || (isCompletionMode && currentStage === 2))
                    ? (isCompletionMode ? 'Continue to Goals' : 'Create Account') 
                    : 'Next'
                }
              </Text>
              {currentStage < 3 && (
                <ArrowRight size={20} color="white" style={{ marginLeft: theme.spacing.sm }} />
              )}
            </TouchableOpacity>

            {/* Sign In Link - only show for new signup */}
            {!isCompletionMode && (
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.h1 + 4,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.body,
  },
  stageTitle: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  stageSubtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.lineHeight.body,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  passwordInput: {
    marginRight: theme.spacing.sm,
  },
  eyeButton: {
    padding: theme.spacing.xs,
  },
  termsContainer: {
    marginBottom: theme.spacing.xl,
  },
  termsText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.caption,
    textAlign: 'center',
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  signInText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
  },
  signInLink: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  readOnlyInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderColor: theme.colors.border,
  },
  readOnlyInputText: {
    color: theme.colors.textSecondary,
  },
  readOnlyNote: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
