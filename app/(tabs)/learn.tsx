import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Brain, Heart, HelpCircle, Shield, Zap, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export default function LearnScreen() {
  const modules = [
    {
      id: 'anxiety',
      title: 'Understanding Anxiety',
      icon: Brain,
      color: theme.colors.primary,
      onPress: () => router.push('/nonTabs/moduleDetail?module=anxiety'),
    },
    {
      id: 'depression',
      title: 'Coping with Depression',
      icon: Heart,
      color: theme.colors.secondary,
      onPress: () => router.push('/nonTabs/moduleDetail?module=depression'),
    },
    {
      id: 'cbt',
      title: 'Thought Management (CBT)',
      icon: Shield,
      color: theme.colors.success,
      onPress: () => router.push('/nonTabs/moduleDetail?module=cbt'),
    },
    {
      id: 'resilience',
      title: 'Building Resilience',
      icon: Zap,
      color: theme.colors.warning,
      onPress: () => router.push('/nonTabs/moduleDetail?module=resilience'),
    },
    {
      id: 'help',
      title: 'When to Seek Help',
      icon: HelpCircle,
      color: theme.colors.error,
      onPress: () => router.push('/nonTabs/moduleDetail?module=help'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Learn & Support</Text>
        <Text style={styles.subtitle}>Expand your mental wellness knowledge</Text>
      </View>

      {/* Module List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={module.onPress}
            >
              <View style={[styles.iconContainer, { backgroundColor: module.color + '20' }]}>
                <IconComponent size={24} color={module.color} />
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
              </View>
              <ChevronRight size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Ad Banner Placeholder */}
      <View style={styles.adContainer}>
        <View style={styles.adBanner}>
          <Text style={styles.adText}>Ad Banner</Text>
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
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  adContainer: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  adBanner: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  adText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
});
