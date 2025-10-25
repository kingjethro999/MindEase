import { router } from 'expo-router';
import { ArrowLeft, Crown, Star, Check, Sparkles, Zap, Heart, Shield, Infinity } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Crown size={48} color={theme.colors.warning} />
            <View style={styles.sparkleContainer}>
              <Sparkles size={16} color={theme.colors.warning} />
            </View>
          </View>
          <Text style={styles.comingSoonText}>Premium Features Coming Soon</Text>
          <Text style={styles.descriptionText}>
            Unlock advanced features, personalized insights, and exclusive content with our premium subscription.
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Zap size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Advanced Analytics</Text>
              <Text style={styles.featureDescription}>Deep insights into your mood patterns and progress</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Heart size={24} color={theme.colors.error} />
              </View>
              <Text style={styles.featureTitle}>Personalized Content</Text>
              <Text style={styles.featureDescription}>Customized exercises and recommendations just for you</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Infinity size={24} color={theme.colors.success} />
              </View>
              <Text style={styles.featureTitle}>Unlimited Access</Text>
              <Text style={styles.featureDescription}>No limits on journal entries, exercises, or games</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Shield size={24} color={theme.colors.warning} />
              </View>
              <Text style={styles.featureTitle}>Ad-Free Experience</Text>
              <Text style={styles.featureDescription}>Focus on your wellness without distractions</Text>
            </View>
          </View>
        </View>

        {/* Coming Soon Banner */}
        <View style={styles.comingSoonBanner}>
          <View style={styles.bannerIcon}>
            <Star size={32} color="white" />
          </View>
          <Text style={styles.bannerTitle}>Coming Soon!</Text>
          <Text style={styles.bannerText}>
            We're working hard to bring you amazing premium features. 
            Stay tuned for updates!
          </Text>
        </View>

        {/* Premium Benefits List */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Check size={20} color={theme.colors.success} />
              <Text style={styles.benefitText}>Advanced mood analytics and insights</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={20} color={theme.colors.success} />
              <Text style={styles.benefitText}>Personalized exercise recommendations</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={20} color={theme.colors.success} />
              <Text style={styles.benefitText}>Unlimited journal entries and notes</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={20} color={theme.colors.success} />
              <Text style={styles.benefitText}>Exclusive premium games and themes</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={20} color={theme.colors.success} />
              <Text style={styles.benefitText}>Priority customer support</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={20} color={theme.colors.success} />
              <Text style={styles.benefitText}>Ad-free experience across all features</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={20} color={theme.colors.success} />
              <Text style={styles.benefitText}>Cloud backup and sync</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={20} color={theme.colors.success} />
              <Text style={styles.benefitText}>Weekly progress reports</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  },
  heroSection: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  comingSoonText: {
    fontSize: theme.typography.fontSize.h1,
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
  featuresSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  comingSoonBanner: {
    backgroundColor: theme.colors.primary,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  bannerTitle: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    marginBottom: theme.spacing.sm,
  },
  bannerText: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsSection: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  benefitsList: {
    gap: theme.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  benefitText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
});
