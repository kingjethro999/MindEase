import { router } from 'expo-router';
import { ArrowLeft, Crown, Star } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export default function PremiumScreen() {
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
          <Crown size={24} color={theme.colors.warning} />
          <Text style={styles.headerTitle}>Premium</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Star size={48} color={theme.colors.warning} />
        </View>
        <Text style={styles.comingSoonText}>Premium Features Coming Soon</Text>
        <Text style={styles.descriptionText}>
          Unlock advanced features, personalized insights, and exclusive content with our premium subscription.
        </Text>
        
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>• Advanced mood analytics</Text>
          <Text style={styles.featureItem}>• Personalized recommendations</Text>
          <Text style={styles.featureItem}>• Unlimited journal entries</Text>
          <Text style={styles.featureItem}>• Priority support</Text>
          <Text style={styles.featureItem}>• Ad-free experience</Text>
        </View>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  comingSoonText: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.body,
    marginBottom: theme.spacing.xl,
  },
  featuresList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'left',
  },
});
