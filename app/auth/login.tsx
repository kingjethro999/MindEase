import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
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
import { supabase } from '../../constants/supabase';
import { useAlert } from '../../contexts/AlertContext';
import { theme } from '../../theme/theme';
import { userProfileUtils } from '../../utils/userProfile';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useAlert();

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        showError('Login Failed', error.message);
      } else {
        // Check if user profile is complete
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const profile = await userProfileUtils.getUserProfile(user.id);
            
            // Check if profile is incomplete (missing essential fields)
            const isProfileIncomplete = !profile || 
              !profile.username || 
              !profile.display_name || 
              !profile.age_range || 
              !profile.onboarding_completed ||
              !profile.primary_goals || 
              profile.primary_goals.length === 0;

            if (isProfileIncomplete) {
              // Redirect to profile completion with email pre-filled
              router.replace(`/auth/signup?mode=complete&email=${encodeURIComponent(user.email || '')}`);
              return;
            }
            
            // Profile is complete, update with any goals from AsyncStorage and proceed
            // await userProfileUtils.createOrUpdateUserProfile(user.id, {});
            console.log('User profile updated with goals');
          }
        } catch (profileError) {
          console.error('Error checking user profile:', profileError);
          showError(
            'Error',
            'Failed to load your profile. Please try again or contact support if the problem persists.'
          );
          return; // Block the flow if profile check fails
        }

        // Navigate to main app
        router.replace('/(tabs)');
      }
    } catch (error) {
      showError('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showError('Email Required', 'Please enter your email address first');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        showError('Error', error.message);
      } else {
        showSuccess(
          'Password Reset Sent',
          'Check your email for password reset instructions'
        );
      }
    } catch (error) {
      showError('Error', 'Failed to send password reset email');
    }
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
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your mental wellness journey
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
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

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: theme.spacing.xxl,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.xl,
  },
  forgotPasswordText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  signUpText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
  },
  signUpLink: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
});
