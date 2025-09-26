import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, LogIn, UserPlus } from 'lucide-react-native';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../theme/theme';

export default function AuthIndexScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradients.primary as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Heart size={48} color="white" />
            </View>
            <Text style={styles.title}>Welcome to MindEase</Text>
            <Text style={styles.subtitle}>
              Your journey to better mental wellness starts here
            </Text>
          </View>

          {/* Auth Options */}
          <View style={styles.authOptions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/auth/login')}
            >
              <View style={styles.buttonContent}>
                <LogIn size={24} color="white" />
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/auth/signup')}
            >
              <View style={styles.buttonContent}>
                <UserPlus size={24} color={theme.colors.primary} />
                <Text style={styles.secondaryButtonText}>Create Account</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.h1 + 8,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.body,
    paddingHorizontal: theme.spacing.md,
  },
  authOptions: {
    gap: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...theme.shadows.md,
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  primaryButtonText: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  secondaryButtonText: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.caption,
  },
});
