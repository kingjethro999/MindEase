import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Play, BookOpen, Brain, Heart, Shield, ChevronRight, Clock, Users, Target, CheckCircle, Lightbulb } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { getModuleById, EducationalModule } from '../../data/educationalModules';

const { width } = Dimensions.get('window');

export default function ModuleDetailScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const { module: moduleId } = useLocalSearchParams<{ module: string }>();
  
  const module = getModuleById(moduleId || 'anxiety');
  
  if (!module) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Module not found</Text>
      </SafeAreaView>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'symptoms', label: 'Symptoms', icon: Brain },
    { id: 'coping', label: 'Coping', icon: Heart },
    { id: 'support', label: 'Support', icon: Shield },
  ];

  const renderOverview = () => {
    const IconComponent = module.icon;
    return (
      <View style={styles.tabContent}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <IconComponent size={32} color={module.color} />
          </View>
          <Text style={styles.heroTitle}>{module.overview.heroTitle}</Text>
          <Text style={styles.heroSubtitle}>{module.overview.heroSubtitle}</Text>
        </View>

        {/* Key Stats */}
        <View style={styles.statsGrid}>
          {module.overview.stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* What is Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <BookOpen size={20} color={module.color} />
            <Text style={styles.cardTitle}>{module.overview.whatIs.title}</Text>
          </View>
          <Text style={styles.cardText}>{module.overview.whatIs.content}</Text>
        </View>

        {/* Key Facts */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Target size={20} color={module.color} />
            <Text style={styles.cardTitle}>Key Facts</Text>
          </View>
          <View style={styles.factsList}>
            {module.overview.keyFacts.map((fact, index) => (
              <View key={index} style={styles.factItem}>
                <View style={[styles.factBullet, { backgroundColor: module.color }]} />
                <Text style={styles.factText}>{fact.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Video Section */}
        <View style={styles.videoCard}>
          <View style={[styles.videoThumbnail, { backgroundColor: module.color }]}>
            <Play size={32} color="white" />
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{module.title}</Text>
            <Text style={styles.videoDuration}>3:45 min</Text>
          </View>
          <TouchableOpacity style={styles.playButton}>
            <Play size={16} color={module.color} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSymptoms = () => (
    <View style={styles.tabContent}>
      {/* Physical Symptoms */}
      {module.symptoms.physical.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Physical Symptoms</Text>
          <View style={styles.symptomList}>
            {module.symptoms.physical.map((symptom, index) => {
              const IconComponent = symptom.icon;
              return (
                <View key={index} style={styles.symptomItem}>
                  <View style={styles.symptomIcon}>
                    <IconComponent size={16} color={symptom.color} />
                  </View>
                  <View style={styles.symptomContent}>
                    <Text style={styles.symptomText}>{symptom.title}</Text>
                    <Text style={styles.symptomDesc}>{symptom.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Emotional Symptoms */}
      {module.symptoms.emotional.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Emotional Symptoms</Text>
          <View style={styles.symptomList}>
            {module.symptoms.emotional.map((symptom, index) => {
              const IconComponent = symptom.icon;
              return (
                <View key={index} style={styles.symptomItem}>
                  <View style={styles.symptomIcon}>
                    <IconComponent size={16} color={symptom.color} />
                  </View>
                  <View style={styles.symptomContent}>
                    <Text style={styles.symptomText}>{symptom.title}</Text>
                    <Text style={styles.symptomDesc}>{symptom.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Behavioral Symptoms */}
      {module.symptoms.behavioral.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Behavioral Symptoms</Text>
          <View style={styles.symptomList}>
            {module.symptoms.behavioral.map((symptom, index) => {
              const IconComponent = symptom.icon;
              return (
                <View key={index} style={styles.symptomItem}>
                  <View style={styles.symptomIcon}>
                    <IconComponent size={16} color={symptom.color} />
                  </View>
                  <View style={styles.symptomContent}>
                    <Text style={styles.symptomText}>{symptom.title}</Text>
                    <Text style={styles.symptomDesc}>{symptom.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Lightbulb size={16} color={module.color} />
          <Text style={styles.tipTitle}>When to Seek Help</Text>
        </View>
        <Text style={styles.tipText}>
          If these symptoms persist and interfere with daily life, consider speaking with a healthcare professional. Early intervention leads to better outcomes.
        </Text>
      </View>
    </View>
  );

  const renderCoping = () => (
    <View style={styles.tabContent}>
      {/* Educational Disclaimer */}
      <View style={styles.disclaimerCard}>
        <View style={styles.disclaimerHeader}>
          <Lightbulb size={16} color={theme.colors.warning} />
          <Text style={styles.disclaimerTitle}>Educational Information</Text>
        </View>
        <Text style={styles.disclaimerText}>
          The following techniques are for educational purposes. For personalized guidance, please consult with a mental health professional.
        </Text>
      </View>

      {/* Immediate Relief Techniques */}
      {module.coping.immediate.length > 0 && (
        <View style={styles.copingCard}>
          <Text style={styles.sectionTitle}>Immediate Relief Techniques</Text>
          <View style={styles.strategyList}>
            {module.coping.immediate.map((strategy, index) => {
              const IconComponent = strategy.icon;
              return (
                <View key={index} style={styles.strategyItem}>
                  <View style={styles.strategyIcon}>
                    <IconComponent size={20} color={strategy.color} />
                  </View>
                  <View style={styles.strategyContent}>
                    <Text style={styles.strategyTitle}>{strategy.title}</Text>
                    <Text style={styles.strategyDesc}>{strategy.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Long-term Strategies */}
      {module.coping.longTerm.length > 0 && (
        <View style={styles.copingCard}>
          <Text style={styles.sectionTitle}>Long-term Strategies</Text>
          <View style={styles.strategyList}>
            {module.coping.longTerm.map((strategy, index) => {
              const IconComponent = strategy.icon;
              return (
                <View key={index} style={styles.strategyItem}>
                  <View style={styles.strategyIcon}>
                    <IconComponent size={20} color={strategy.color} />
                  </View>
                  <View style={styles.strategyContent}>
                    <Text style={styles.strategyTitle}>{strategy.title}</Text>
                    <Text style={styles.strategyDesc}>{strategy.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Lifestyle Changes */}
      {module.coping.lifestyle.length > 0 && (
        <View style={styles.copingCard}>
          <Text style={styles.sectionTitle}>Lifestyle Changes</Text>
          <View style={styles.lifestyleList}>
            {module.coping.lifestyle.map((lifestyle, index) => {
              const IconComponent = lifestyle.icon;
              return (
                <View key={index} style={styles.lifestyleItem}>
                  <View style={styles.lifestyleIcon}>
                    <IconComponent size={16} color={lifestyle.color} />
                  </View>
                  <View style={styles.lifestyleContent}>
                    <Text style={styles.lifestyleTitle}>{lifestyle.title}</Text>
                    <Text style={styles.lifestyleDesc}>{lifestyle.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Lightbulb size={16} color={module.color} />
          <Text style={styles.tipTitle}>Remember</Text>
        </View>
        <Text style={styles.tipText}>
          Different techniques work for different people. Try various strategies and stick with what feels most helpful for you. Consistency is key to building resilience.
        </Text>
      </View>
    </View>
  );

  const renderSupport = () => (
    <View style={styles.tabContent}>
      {/* Professional Help */}
      {module.support.professional.length > 0 && (
        <View style={styles.supportCard}>
          <Text style={styles.sectionTitle}>Professional Help</Text>
          <View style={styles.supportOptions}>
            {module.support.professional.map((support, index) => {
              const IconComponent = support.icon;
              return (
                <TouchableOpacity key={index} style={styles.supportItem}>
                  <IconComponent size={24} color={support.color} />
                  <Text style={styles.supportTitle}>{support.title}</Text>
                  <Text style={styles.supportDesc}>{support.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Crisis Resources */}
      {module.support.crisis.length > 0 && (
        <View style={styles.crisisCard}>
          <Text style={styles.sectionTitle}>Crisis Support</Text>
          <View style={styles.crisisList}>
            {module.support.crisis.map((crisis, index) => {
              const IconComponent = crisis.icon;
              return (
                <View key={index} style={styles.crisisItem}>
                  <View style={styles.crisisIcon}>
                    <IconComponent size={20} color={crisis.color} />
                  </View>
                  <View style={styles.crisisContent}>
                    <Text style={styles.crisisTitle}>{crisis.title}</Text>
                    <Text style={styles.crisisNumber}>{crisis.number}</Text>
                    <Text style={styles.crisisDesc}>{crisis.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Self-Help Resources */}
      {module.support.resources.length > 0 && (
        <View style={styles.supportCard}>
          <Text style={styles.sectionTitle}>Self-Help Resources</Text>
          <View style={styles.resourceList}>
            {module.support.resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <View key={index} style={styles.resourceItem}>
                  <IconComponent size={20} color={resource.color} />
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceDesc}>{resource.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* When to Seek Help */}
      {module.support.warningSigns.length > 0 && (
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>When to Seek Immediate Help</Text>
          <View style={styles.warningList}>
            {module.support.warningSigns.map((warning, index) => (
              <View key={index} style={styles.warningItem}>
                <View style={[styles.warningBullet, { backgroundColor: module.color }]} />
                <Text style={styles.warningText}>{warning.text}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>Next Steps</Text>
        <View style={styles.nextStepContent}>
          <CheckCircle size={20} color={module.color} />
          <Text style={[styles.nextStepText, { color: module.color }]}>
            Practice these techniques regularly and consider seeking professional help if symptoms persist.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'symptoms': return renderSymptoms();
      case 'coping': return renderCoping();
      case 'support': return renderSupport();
      default: return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{module.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
              >
                <IconComponent 
                  size={16} 
                  color={activeTab === tab.id ? theme.colors.primary : theme.colors.textLight} 
                />
                <Text style={[
                  styles.tabText, 
                  activeTab === tab.id && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
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
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  
  // Tab Navigation
  tabContainer: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabScroll: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  activeTab: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold as any,
  },

  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  tabContent: {
    paddingBottom: theme.spacing.lg,
  },

  // Hero Section
  heroCard: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.body + 2,
    maxWidth: '90%',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium as any,
  },

  // Info Cards
  infoCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  cardText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.body + 2,
    marginTop: theme.spacing.xs,
  },

  // Video Card
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  videoThumbnail: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  videoDuration: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
  },
  playButton: {
    padding: theme.spacing.sm,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  // Symptom List
  symptomList: {
    gap: theme.spacing.sm,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  symptomIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  symptomText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  symptomContent: {
    flex: 1,
  },
  symptomDesc: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.caption + 1,
  },

  // Tip Card
  tipCard: {
    backgroundColor: theme.colors.surfaceOrange,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  tipTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  tipText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.body,
  },

  // Coping Card
  copingCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  strategyList: {
    gap: theme.spacing.sm,
  },
  strategyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  strategyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  strategyContent: {
    flex: 1,
  },
  strategyTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  strategyDesc: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.caption + 1,
    marginTop: theme.spacing.xs,
  },

  // Support Card
  supportCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  supportOptions: {
    gap: theme.spacing.sm,
  },
  supportItem: {
    // alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  supportTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  supportDesc: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.caption + 1,
    marginTop: theme.spacing.xs,
  },

  // Next Steps
  nextStepsCard: {
    backgroundColor: theme.colors.surfaceGreen,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  nextStepsTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  nextStepContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
  },
  nextStepText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.primary,
    flex: 1,
    marginLeft: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.body,
  },

  // New styles for expanded content
  anxietyTypes: {
    gap: theme.spacing.sm,
  },
  anxietyType: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
  },
  anxietyTypeTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  anxietyTypeDesc: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
  },

  factsList: {
    gap: theme.spacing.sm,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  factText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    flex: 1,
  },

  lifestyleList: {
    gap: theme.spacing.sm,
  },
  lifestyleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  lifestyleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  lifestyleContent: {
    flex: 1,
  },
  lifestyleTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  lifestyleDesc: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.caption + 1,
    marginTop: theme.spacing.xs,
  },

  crisisCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  crisisList: {
    gap: theme.spacing.md,
  },
  crisisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  crisisIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  crisisContent: {
    flex: 1,
  },
  crisisTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  crisisNumber: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.error,
    marginBottom: theme.spacing.xs,
  },
  crisisDesc: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
  },

  resourceList: {
    gap: theme.spacing.sm,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  resourceDesc: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.caption + 1,
    marginTop: theme.spacing.xs,
  },

  warningCard: {
    backgroundColor: theme.colors.surfaceOrange,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.warning,
  },
  warningTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  warningList: {
    gap: theme.spacing.sm,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.warning,
    marginRight: theme.spacing.sm,
  },
  warningText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    flex: 1,
  },

  // Disclaimer Card
  disclaimerCard: {
    backgroundColor: theme.colors.surfaceOrange,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.warning,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  disclaimerTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  disclaimerText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.body,
  },
});
