// app/onboarding/consent.tsx
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, CheckCircle2, Shield, AlertCircle, Database, Users } from 'lucide-react-native';
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
    <TouchableOpacity 
      style={[styles.checkboxCard, checked && styles.checkboxCardChecked]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxContent}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <CheckCircle2 size={20} color="#fff" strokeWidth={2.5} />}
        </View>
        <View style={styles.checkboxTextContainer}>
          <Text style={styles.checkboxTitle}>{title}</Text>
          <Text style={styles.checkboxDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerContent}>
          <View style={styles.iconBadge}>
            <Shield size={28} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Legal Agreements</Text>
          <Text style={styles.subtitle}>
            Review and accept our terms to get started
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Critical Notice Banner */}
        <View style={styles.criticalBanner}>
          <AlertCircle size={24} color={theme.colors.error} strokeWidth={2} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Important Medical Disclaimer</Text>
            <Text style={styles.bannerText}>
              This app is for general wellness and educational purposes only
            </Text>
          </View>
        </View>

        {/* Information Cards Grid */}
        <View style={styles.cardsGrid}>
          {/* Medical Disclaimer Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: theme.colors.error + '15' }]}>
                <AlertCircle size={20} color={theme.colors.error} strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Medical Disclaimer</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>
                Not intended to diagnose, treat, cure, or prevent any medical condition. Always consult qualified healthcare professionals for medical advice.
              </Text>
              
              <View style={styles.emergencyBox}>
                <Text style={styles.emergencyTitle}>Crisis Resources</Text>
                <View style={styles.emergencyRow}>
                  <Text style={styles.emergencyLabel}>Suicide Prevention:</Text>
                  <Text style={styles.emergencyValue}>988</Text>
                </View>
                <View style={styles.emergencyRow}>
                  <Text style={styles.emergencyLabel}>Crisis Text:</Text>
                  <Text style={styles.emergencyValue}>HOME to 741741</Text>
                </View>
                <View style={styles.emergencyRow}>
                  <Text style={styles.emergencyLabel}>Emergency:</Text>
                  <Text style={styles.emergencyValue}>911</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Data Privacy Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: theme.colors.info + '15' }]}>
                <Database size={20} color={theme.colors.info} strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Data & Privacy</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>
                We collect minimal data to provide personalized features:
              </Text>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>Mood data stored locally on your device</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>Anonymized usage analytics</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>Optional cloud backup (your choice)</Text>
                </View>
              </View>
              <Text style={[styles.cardText, styles.highlightText]}>
                You maintain full control and can delete your data anytime.
              </Text>
            </View>
          </View>

          {/* Age Verification Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                <Users size={20} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Age Requirements</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>
                By continuing, you confirm that you are at least 13 years old. Users under 18 should use this app with parental guidance.
              </Text>
            </View>
          </View>
        </View>

        {/* Consent Checkboxes */}
        <View style={styles.consentSection}>
          <Text style={styles.sectionTitle}>Required Agreements</Text>
          
          {renderCheckbox(
            acknowledgedDisclaimer,
            () => setAcknowledgedDisclaimer(!acknowledgedDisclaimer),
            'Medical Disclaimer Acknowledgment',
            'I understand this app is not a substitute for professional medical care'
          )}

          {renderCheckbox(
            agreedToTerms,
            () => setAgreedToTerms(!agreedToTerms),
            'Terms of Service',
            'I have read and accept the terms and conditions of use'
          )}

          {renderCheckbox(
            agreedToPrivacy,
            () => setAgreedToPrivacy(!agreedToPrivacy),
            'Privacy Policy',
            'I understand how my data will be collected, stored, and used'
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            canProceed && styles.continueButtonActive,
          ]}
          onPress={handleContinue}
          disabled={!canProceed}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            canProceed && styles.continueButtonTextActive,
          ]}>
            Continue to Setup
          </Text>
          <ArrowRight
            size={20}
            color={canProceed ? '#fff' : theme.colors.textLight}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
        {!canProceed && (
          <Text style={styles.helperText}>
            Please accept all agreements above to continue
          </Text>
        )}
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
  criticalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error + '08',
    borderWidth: 1,
    borderColor: theme.colors.error + '30',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  bannerContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.error,
    marginBottom: 2,
  },
  bannerText: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 18,
  },
  cardsGrid: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: theme.spacing.sm,
  },
  highlightText: {
    color: theme.colors.text,
    fontWeight: '500',
    marginTop: theme.spacing.xs,
  },
  bulletList: {
    marginVertical: theme.spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  emergencyBox: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 10,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  emergencyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.error,
    marginBottom: theme.spacing.xs,
  },
  emergencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  emergencyLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  emergencyValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  consentSection: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.3,
  },
  checkboxCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  checkboxCardChecked: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '03',
  },
  checkboxContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  checkboxDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
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
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: theme.spacing.md,
    height: 56,
  },
  continueButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginRight: theme.spacing.sm,
    letterSpacing: -0.2,
  },
  continueButtonTextActive: {
    color: '#fff',
  },
  helperText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});

export default ConsentScreen;