import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Brain, Heart, HelpCircle, Shield, Zap, ChevronRight, BookOpen, TrendingUp, Star, CheckCircle, Sparkles, Award } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { getExerciseCompletions } from '../../utils/offlineStorage';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
  const [completions, setCompletions] = useState<any[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    loadCompletions();
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadCompletions = async () => {
    try {
      const data = await getExerciseCompletions();
      setCompletions(data);
    } catch (error) {
      console.error('Error loading completions:', error);
    }
  };

  const getModuleCompletionCount = (moduleId: string) => {
    // Count completions related to learning modules
    // This would be more specific in a real implementation based on your module tracking
    return completions.filter(c => 
      c.activity_type === 'journaling' && 
      c.activity_details?.notes?.toLowerCase().includes(moduleId.toLowerCase())
    ).length;
  };

  const getTotalLearningProgress = () => {
    // Calculate progress based on completed learning activities
    const learningActivities = completions.filter(c => 
      ['journaling', 'meditation'].includes(c.activity_type)
    );
    const totalPossible = 20; // Adjust based on your learning content
    return Math.min(Math.floor((learningActivities.length / totalPossible) * 100), 100);
  };

  const getCompletedModules = () => {
    return modules.filter(m => m.completionCount > 0).length;
  };

  const getTotalAchievements = () => {
    // Calculate achievements based on learning activities
    const learningActivities = completions.filter(c => 
      ['journaling', 'meditation'].includes(c.activity_type)
    );
    return Math.floor(learningActivities.length / 5);
  };

  const modules = [
    {
      id: 'anxiety',
      title: 'Understanding Anxiety',
      description: 'Learn about anxiety patterns and coping strategies',
      icon: Brain,
      color: theme.colors.primary,
      bgColor: theme.colors.accents.moodTracker,
      completionCount: getModuleCompletionCount('anxiety'),
      onPress: () => router.push('/nonTabs/moduleDetail?module=anxiety'),
    },
    {
      id: 'depression',
      title: 'Coping with Depression',
      description: 'Evidence-based approaches to managing depression',
      icon: Heart,
      color: theme.colors.secondary,
      bgColor: theme.colors.accents.relaxationGreen,
      completionCount: getModuleCompletionCount('depression'),
      onPress: () => router.push('/nonTabs/moduleDetail?module=depression'),
    },
    {
      id: 'cbt',
      title: 'Thought Management (CBT)',
      description: 'Cognitive Behavioral Therapy techniques',
      icon: Shield,
      color: theme.colors.success,
      bgColor: theme.colors.accents.relaxationGreen,
      completionCount: getModuleCompletionCount('cbt'),
      onPress: () => router.push('/nonTabs/moduleDetail?module=cbt'),
    },
    {
      id: 'resilience',
      title: 'Building Resilience',
      description: 'Develop mental strength and adaptability',
      icon: Zap,
      color: theme.colors.warning,
      bgColor: theme.colors.accents.gameOrange,
      completionCount: getModuleCompletionCount('resilience'),
      onPress: () => router.push('/nonTabs/moduleDetail?module=resilience'),
    },
    {
      id: 'help',
      title: 'When to Seek Help',
      description: 'Recognize when professional support is needed',
      icon: HelpCircle,
      color: theme.colors.error,
      bgColor: '#FFEBEE',
      completionCount: getModuleCompletionCount('help'),
      onPress: () => router.push('/nonTabs/moduleDetail?module=help'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Enhanced Header with Learning Progress */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Learn & Support</Text>
              <Text style={styles.subtitle}>Your mental wellness journey</Text>
            </View>
            <View style={styles.headerIcon}>
              <BookOpen size={32} color={theme.colors.primary} />
            </View>
          </View>
          
          {/* Learning Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Award size={20} color={theme.colors.primary} />
              <Text style={styles.progressText}>Learning Progress</Text>
              <Text style={styles.progressPercent}>{getTotalLearningProgress()}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${getTotalLearningProgress()}%` 
              }]} />
            </View>
          </View>
        </View>

        {/* Enhanced Stats with Achievements */}
        

        {/* Module List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <BookOpen size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Modules</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Brain size={20} color={theme.colors.secondary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{getCompletedModules()}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Star size={20} color={theme.colors.warning} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{getTotalAchievements()}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </ScrollView>
          {modules.map((module, index) => {
            const IconComponent = module.icon;
            const isCompleted = module.completionCount > 0;
            
            return (
              <TouchableOpacity
                key={module.id}
                style={[styles.moduleCard, { marginTop: index === 0 ? theme.spacing.sm : 0 }]}
                onPress={module.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.cardBackground, { backgroundColor: module.bgColor }]}>
                  <View style={styles.moduleContent}>
                    <View style={[styles.iconContainer, { backgroundColor: module.color }]}>
                      <IconComponent size={24} color="white" />
                      {isCompleted && (
                        <View style={styles.completionBadge}>
                          <CheckCircle size={16} color="white" />
                        </View>
                      )}
                    </View>
                    <View style={styles.moduleInfo}>
                      <View style={styles.moduleHeader}>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                        {isCompleted && (
                          <View style={[styles.completionCountBadge, { backgroundColor: module.color }]}>
                            <Text style={styles.completionCountText}>{module.completionCount}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.moduleDescription}>{module.description}</Text>
                      {isCompleted && (
                        <View style={styles.achievementContainer}>
                          <Sparkles size={12} color={theme.colors.warning} />
                          <Text style={styles.achievementText}>Recently studied</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.chevronContainer}>
                      <ChevronRight size={20} color={theme.colors.textSecondary} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        {/* Enhanced Premium Banner */}
        <View style={styles.adContainer}>
          <TouchableOpacity 
            style={styles.adBanner}
            activeOpacity={0.8}
            onPress={() => router.push('/nonTabs/premium')}
          >
            <View style={styles.adContent}>
              <Star size={24} color="white" />
              <View style={styles.adTextContainer}>
                <Text style={styles.adText}>Premium Learning Modules</Text>
                <Text style={styles.adSubtext}>Subscribe to unlock advanced content</Text>
              </View>
              <ChevronRight size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accents.moodTracker,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  progressPercent: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    // paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
    minWidth: 100,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  moduleCard: {
    marginBottom: theme.spacing.md,
  },
  cardBackground: {
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  moduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    position: 'relative',
  },
  completionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  moduleTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    flex: 1,
  },
  completionCountBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionCountText: {
    fontSize: theme.typography.fontSize.small,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  moduleDescription: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginLeft: theme.spacing.xs,
  },
  chevronContainer: {
    padding: theme.spacing.sm,
  },
  adContainer: {
    // padding: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  adBanner: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  adTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  adText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing.xs,
  },
  adSubtext: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
