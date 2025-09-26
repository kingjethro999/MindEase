// components/AlertExamples.tsx
// This file demonstrates how to use the CustomAlert component
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAlert } from '../contexts/AlertContext';
import { theme } from '../theme/theme';

const AlertExamples: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, showConfirm } = useAlert();

  const handleShowSuccess = () => {
    showSuccess(
      'Success!',
      'Your account has been created successfully. Welcome to MindEase!'
    );
  };

  const handleShowError = () => {
    showError(
      'Login Failed',
      'Invalid email or password. Please check your credentials and try again.'
    );
  };

  const handleShowWarning = () => {
    showWarning(
      'Incomplete Profile',
      'Please complete your profile setup to access all features.'
    );
  };

  const handleShowInfo = () => {
    showInfo(
      'Feature Coming Soon',
      'This feature is currently in development and will be available in the next update.'
    );
  };

  const handleShowConfirm = () => {
    showConfirm(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      () => {
        // Handle confirm action
        showSuccess('Account Deleted', 'Your account has been permanently deleted.');
      },
      () => {
        // Handle cancel action
        showInfo('Cancelled', 'Account deletion was cancelled.');
      },
      'Delete',
      'Cancel'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Alert Examples</Text>
      
      <TouchableOpacity style={[styles.button, styles.successButton]} onPress={handleShowSuccess}>
        <Text style={styles.buttonText}>Show Success Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={handleShowError}>
        <Text style={styles.buttonText}>Show Error Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={handleShowWarning}>
        <Text style={styles.buttonText}>Show Warning Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.infoButton]} onPress={handleShowInfo}>
        <Text style={styles.buttonText}>Show Info Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleShowConfirm}>
        <Text style={styles.buttonText}>Show Confirm Alert</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  button: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  successButton: {
    backgroundColor: theme.colors.success,
  },
  errorButton: {
    backgroundColor: theme.colors.error,
  },
  warningButton: {
    backgroundColor: theme.colors.warning,
  },
  infoButton: {
    backgroundColor: theme.colors.primary,
  },
  confirmButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
});

export default AlertExamples;
