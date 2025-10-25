import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Share, TrendingUp } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { getMoodEntries, MoodEntry } from '../../utils/offlineStorage';

// Skeleton Loader Component
const SkeletonLoader = ({ width, height, style }: { width?: number | string; height?: number; style?: any }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.7)'],
  });

  return (
    <Animated.View
      style={[
        {
          width: width || '100%',
          height: height || 20,
          backgroundColor,
          borderRadius: 4,
        },
        style,
      ]}
    />
  );
};

export default function WeeklyReportScreen() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Mood color mapping
  const moodColors = {
    'happy': '#FF6B9D',
    'calm': '#4CAF50',
    'bored': '#9E9E9E',
    'tired': '#4ECDC4',
    'irritated': '#FF9800',
    'crying': '#9C27B0',
    'angry': '#F44336'
  };

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    try {
      const entries = await getMoodEntries();
      setMoodEntries(entries);
    } catch (error) {
      console.error('Error loading mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get last 7 days of mood data
  const getWeeklyMoodData = () => {
    const last7Days = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    // Count mood occurrences
    const moodCounts: { [key: string]: number } = {};
    last7Days.forEach(entry => {
      moodCounts[entry.primary_mood] = (moodCounts[entry.primary_mood] || 0) + 1;
    });

    // Convert to percentages
    const totalEntries = last7Days.length;
    if (totalEntries === 0) return [];

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood.charAt(0).toUpperCase() + mood.slice(1),
      percentage: Math.round((count / totalEntries) * 100),
      color: moodColors[mood as keyof typeof moodColors] || theme.colors.primary
    })).sort((a, b) => b.percentage - a.percentage);
  };

  // Calculate average sleep hours
  const getAverageSleepHours = () => {
    const last7Days = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo && entry.sleep_hours;
    });

    if (last7Days.length === 0) return 0;
    
    const totalSleep = last7Days.reduce((sum, entry) => sum + (entry.sleep_hours || 0), 0);
    return Math.round((totalSleep / last7Days.length) * 10) / 10; // Round to 1 decimal
  };

  // Generate sophisticated insights based on mood patterns
  const getInsights = () => {
    const weeklyData = getWeeklyMoodData();
    if (weeklyData.length === 0) {
      return {
        text: "Start logging your moods to see personalized insights!",
        suggestion: null
      };
    }

    const topMood = weeklyData[0];
    const moodPercentage = topMood.percentage;
    const moodName = topMood.mood.toLowerCase();

    // Get mood entries for more detailed analysis
    const last7Days = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    // Calculate mood intensity average
    const avgIntensity = last7Days.length > 0 
      ? last7Days.reduce((sum, entry) => sum + entry.mood_intensity, 0) / last7Days.length 
      : 0;

    // Check for mood patterns
    const hasMultipleMoods = weeklyData.length > 1;
    const isDominantMood = moodPercentage >= 60;
    const isBalancedMood = moodPercentage < 40 && hasMultipleMoods;

    // Generate specific insights for each mood
    const getMoodSpecificInsight = () => {
      switch (moodName) {
        case 'happy':
          if (isDominantMood) {
            return {
              text: `Your happiness is radiating this week! ${moodPercentage}% of your logged moods show joy. This positive energy is contagious - consider sharing it with others or documenting what's bringing you this joy.`,
              suggestion: 'Share Your Joy'
            };
          } else {
            return {
              text: `You've had some happy moments this week (${moodPercentage}%). Notice what activities or people tend to lift your spirits - these are your happiness anchors worth nurturing.`,
              suggestion: 'Track Happy Triggers'
            };
          }

        case 'calm':
          if (isDominantMood) {
            return {
              text: `Your inner peace is remarkable this week! ${moodPercentage}% calmness suggests you've found your zen. This emotional stability is a superpower - use it to help others or tackle challenging projects.`,
              suggestion: 'Help Others Find Calm'
            };
          } else {
            return {
              text: `You've experienced ${moodPercentage}% calm moments this week. These peaceful states are precious - consider what practices help you achieve this tranquility.`,
              suggestion: 'Practice Mindfulness'
            };
          }

        case 'bored':
          if (isDominantMood) {
            return {
              text: `Boredom dominated ${moodPercentage}% of your week. This isn't failure - it's your mind asking for stimulation! Boredom often precedes creativity and new discoveries.`,
              suggestion: 'Explore New Activities'
            };
          } else {
            return {
              text: `You've felt bored ${moodPercentage}% of the time. This neutral state might indicate you need more mental stimulation or variety in your routine.`,
              suggestion: 'Try Something New'
            };
          }

        case 'tired':
          if (isDominantMood) {
            return {
              text: `Fatigue is your main companion this week (${moodPercentage}%). Your body is clearly asking for rest. This isn't laziness - it's self-care. Listen to what your body needs.`,
              suggestion: 'Prioritize Rest'
            };
          } else {
            return {
              text: `You've felt tired ${moodPercentage}% of the time. Consider your sleep patterns, stress levels, and energy management strategies.`,
              suggestion: 'Check Sleep Quality'
            };
          }

        case 'irritated':
          if (isDominantMood) {
            return {
              text: `Irritation is prominent this week (${moodPercentage}%). This suggests something in your environment or routine isn't aligned with your needs. What's really bothering you?`,
              suggestion: 'Identify Stressors'
            };
          } else {
            return {
              text: `You've felt irritated ${moodPercentage}% of the time. These moments of frustration often point to unmet needs or boundaries that need attention.`,
              suggestion: 'Set Boundaries'
            };
          }

        case 'crying':
          if (isDominantMood) {
            return {
              text: `You've been emotional this week (${moodPercentage}% crying). Tears aren't weakness - they're emotional release. Your feelings are valid and deserve acknowledgment.`,
              suggestion: 'Practice Self-Compassion'
            };
          } else {
            return {
              text: `You've had some emotional moments (${moodPercentage}%). Crying is a natural way to process feelings - it shows you're human and in touch with your emotions.`,
              suggestion: 'Embrace Your Emotions'
            };
          }

        case 'angry':
          if (isDominantMood) {
            return {
              text: `Anger is your dominant emotion this week (${moodPercentage}%). This powerful energy often signals injustice or unmet needs. Channel this energy constructively.`,
              suggestion: 'Channel Anger Productively'
            };
          } else {
            return {
              text: `You've felt angry ${moodPercentage}% of the time. Anger is information - it tells us what we value and what we won't tolerate.`,
              suggestion: 'Understand Your Anger'
            };
          }

        default:
          return {
            text: `Your mood pattern shows ${moodPercentage}% ${moodName} this week. Every emotion serves a purpose in your emotional landscape.`,
            suggestion: 'Reflect on Patterns'
          };
      }
    };

    // Add pattern-based insights
    const getPatternInsight = () => {
      if (isBalancedMood) {
        return " Your emotional range is quite balanced this week - this emotional flexibility is a strength!";
      } else if (avgIntensity > 4) {
        return " Your emotions have been quite intense - consider what's driving this heightened sensitivity.";
      } else if (avgIntensity < 2) {
        return " Your emotions have been relatively mild - this could indicate emotional regulation or perhaps emotional numbing.";
      }
      return "";
    };

    const baseInsight = getMoodSpecificInsight();
    const patternInsight = getPatternInsight();

    return {
      text: baseInsight.text + patternInsight,
      suggestion: baseInsight.suggestion
    };
  };

  const moodData = getWeeklyMoodData();
  const averageSleep = getAverageSleepHours();
  const insights = getInsights();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Weekly Insights</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mood Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Overview (Last 7 Days)</Text>
          <View style={styles.moodContainer}>
            {loading ? (
              <>
                <View style={styles.moodItem}>
                  <SkeletonLoader width={20} height={20} style={{ borderRadius: 10, marginRight: theme.spacing.md }} />
                  <SkeletonLoader width={80} height={16} style={{ flex: 1, marginRight: theme.spacing.sm }} />
                  <SkeletonLoader width={40} height={16} />
                </View>
                <View style={styles.moodItem}>
                  <SkeletonLoader width={20} height={20} style={{ borderRadius: 10, marginRight: theme.spacing.md }} />
                  <SkeletonLoader width={70} height={16} style={{ flex: 1, marginRight: theme.spacing.sm }} />
                  <SkeletonLoader width={35} height={16} />
                </View>
                <View style={styles.moodItem}>
                  <SkeletonLoader width={20} height={20} style={{ borderRadius: 10, marginRight: theme.spacing.md }} />
                  <SkeletonLoader width={90} height={16} style={{ flex: 1, marginRight: theme.spacing.sm }} />
                  <SkeletonLoader width={30} height={16} />
                </View>
              </>
            ) : moodData.length > 0 ? (
              moodData.map((item, index) => (
                <View key={index} style={styles.moodItem}>
                  <View style={[styles.moodColorBar, { backgroundColor: item.color }]} />
                  <Text style={styles.moodLabel}>{item.mood}</Text>
                  <Text style={styles.moodPercentage}>{item.percentage}%</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No mood data available. Start logging your moods to see insights!</Text>
            )}
          </View>
        </View>

        {/* Sleep Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Quality</Text>
          <View style={styles.sleepContainer}>
            {loading ? (
              <>
                <SkeletonLoader width={80} height={32} style={{ marginBottom: theme.spacing.sm }} />
                <SkeletonLoader width={200} height={16} />
              </>
            ) : (
              <>
                <Text style={styles.sleepValue}>
                  {averageSleep > 0 ? `${averageSleep} hrs` : 'No data'}
                </Text>
                <Text style={styles.sleepLabel}>Average Sleep Duration (Last 7 Days)</Text>
              </>
            )}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightContainer}>
            {loading ? (
              <>
                <SkeletonLoader width="100%" height={16} style={{ marginBottom: theme.spacing.xs }} />
                <SkeletonLoader width="90%" height={16} style={{ marginBottom: theme.spacing.xs }} />
                <SkeletonLoader width="80%" height={16} style={{ marginBottom: theme.spacing.md }} />
                <SkeletonLoader width={150} height={36} style={{ borderRadius: theme.borderRadius.md }} />
              </>
            ) : (
              <>
                <Text style={styles.insightText}>
                  "{insights.text}"
                </Text>
                {insights.suggestion && (
                  <TouchableOpacity 
                    style={styles.suggestionButton}
                    onPress={() => router.push('/nonTabs/exerciseDetails')}
                  >
                    <TrendingUp size={16} color="white" />
                    <Text style={styles.suggestionButtonText}>{insights.suggestion}</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        {/* Share Report */}
        <View style={styles.shareContainer}>
          <TouchableOpacity style={styles.shareReportButton}>
            <Share size={20} color="white" />
            <Text style={styles.shareReportButtonText}>Share Report</Text>
          </TouchableOpacity>
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
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  shareButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  moodContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  moodColorBar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: theme.spacing.md,
  },
  moodLabel: {
    flex: 1,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  moodPercentage: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  sleepContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  sleepValue: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  sleepLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
  },
  insightContainer: {
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  insightText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.body,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  suggestionButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.medium as any,
    marginLeft: theme.spacing.sm,
  },
  shareContainer: {
    paddingTop: theme.spacing.lg,
  },
  shareReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  shareReportButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginLeft: theme.spacing.sm,
  },
  noDataText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
