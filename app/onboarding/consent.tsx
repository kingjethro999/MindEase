// app/onboarding/consent.tsx
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, CheckSquare, Shield, Square } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlert } from '../../contexts/AlertContext';
import { theme } from '../../theme/theme';

const ConsentScreen: React.FC = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [acknowledgedDisclaimer, setAcknowledgedDisclaimer] = useState(false);
  const { showWarning } = useAlert();

  const canProceed = agreedToTerms && agreedToPrivacy && acknowledgedDisclaimer;

  const handleContinue = () => {
    if (!canProceed) {
      showWarning(
        'Agreement Required',
        'Please read and accept all agreements to continue.'
      );
      return;
    }
    router.push('/onboarding/notification-opt-in');
  };

  const renderCheckbox = (
    checked: boolean, 
    onPress: () => void, 
    title: string, 
    description: string
  ) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={styles.checkboxRow}>
        {checked ? (
          <CheckSquare size={20} color={theme.colors.primary} />
        ) : (
          <Square size={20} color={theme.colors.border} />
        )}
        <View style={styles.checkboxText}>
          <Text style={styles.checkboxTitle}>{title}</Text>
          <Text style={styles.checkboxDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Legal Agreements</Text>
          <Text style={styles.subtitle}>
            Please read and accept the following agreements to proceed
          </Text>
        </View>

        {/* Important Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This app provides general self-care and educational support. It is NOT a substitute for professional medical diagnosis, treatment, or therapy.
          </Text>
          <Text style={styles.disclaimerText}>
            • Not intended to diagnose, treat, cure, or prevent any medical condition
          </Text>
          <Text style={styles.disclaimerText}>
            • Always consult qualified healthcare professionals for medical advice
          </Text>
          <Text style={styles.disclaimerText}>
            • Contact emergency services immediately for mental health crises
          </Text>
          <View style={styles.crisisNumbers}>
            <Text style={styles.crisisTitle}>Crisis Resources:</Text>
            <Text style={styles.crisisText}>• National Suicide Prevention Lifeline: 988</Text>
            <Text style={styles.crisisText}>• Crisis Text Line: Text HOME to 741741</Text>
            <Text style={styles.crisisText}>• Emergency: 911</Text>
          </View>
        </View>

        {/* Data Collection Notice */}
        <View style={styles.dataCard}>
          <Text style={styles.dataTitle}>Data Collection</Text>
          <Text style={styles.dataText}>
            We collect minimal data to provide personalized features:
          </Text>
          <Text style={styles.dataText}>
            • Mood tracking data (stored locally on your device)
          </Text>
          <Text style={styles.dataText}>
            • App usage analytics (anonymized)
          </Text>
          <Text style={styles.dataText}>
            • Optional cloud backup (if you choose to enable it)
          </Text>
          <Text style={styles.dataText}>
            You maintain full control over your data and can delete it at any time.
          </Text>
        </View>

        {/* Consent Checkboxes */}
        <View style={styles.consentSection}>
          {renderCheckbox(
            acknowledgedDisclaimer,
            () => setAcknowledgedDisclaimer(!acknowledgedDisclaimer),
            'I understand the medical disclaimer',
            'I acknowledge this app is not a substitute for professional medical care'
          )}

          {renderCheckbox(
            agreedToTerms,
            () => setAgreedToTerms(!agreedToTerms),
            'I agree to the Terms of Service',
            'I have read and accept the terms and conditions of use'
          )}

          {renderCheckbox(
            agreedToPrivacy,
            () => setAgreedToPrivacy(!agreedToPrivacy),
            'I agree to the Privacy Policy',
            'I understand how my data will be collected and used'
          )}
        </View>

        {/* Age Verification */}
        <View style={styles.ageCard}>
          <Text style={styles.ageText}>
            By continuing, you confirm that you are at least 13 years old. Users under 18 should use this app with parental guidance.
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            canProceed ? styles.continueButtonActive : styles.continueButtonInactive,
          ]}
          onPress={handleContinue}
          disabled={!canProceed}
        >
          <Text
            style={[
              styles.continueButtonText,
              canProceed ? styles.continueButtonTextActive : styles.continueButtonTextInactive,
            ]}
          >
            Continue to Setup
          </Text>
          <ArrowRight
            size={18}
            color={canProceed ? 'white' : theme.colors.textLight}
          />
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  iconContainer: {
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
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.body,
  },
  disclaimerCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.error + '10',
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.error,
  },
  disclaimerTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  },
  disclaimerText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.caption,
  },
  crisisNumbers: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.error + '20',
    borderRadius: theme.borderRadius.sm,
  },
  crisisTitle: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.error,
    marginBottom: theme.spacing.xs,
  },
  crisisText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  dataCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.info + '10',
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.info,
  },
  dataTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.info,
    marginBottom: theme.spacing.sm,
  },
  dataText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.caption,
  },
  consentSection: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  checkboxContainer: {
    marginBottom: theme.spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
  },
  checkboxText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  checkboxTitle: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  checkboxDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.small,
  },
  ageCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
  },
  ageText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.small,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  continueButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  continueButtonInactive: {
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  continueButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginRight: theme.spacing.sm,
  },
  continueButtonTextActive: {
    color: 'white',
  },
  continueButtonTextInactive: {
    color: theme.colors.textLight,
  },
  spacer: {
    height: theme.spacing.md,
  },
});

export default ConsentScreen;