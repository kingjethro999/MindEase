import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Lightbulb, LogOut, Target, TrendingUp, Settings, Trophy, Heart, Moon, Brain, Activity, Users, BookOpen } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme/theme';
import { HelloWave } from '../../components/hello-wave';
import { getRandomMotivation, Motivation } from '../../data/motivations';

// Fun and witty daily tips for intellectually-minded users
const dailyTips = [
  "Tip: Your brain uses 20% of your body's energy. Give it a 2-minute break - it's earned it! 🧠",
  "Pro tip: Deep breathing is like debugging your nervous system. Sometimes you just need to restart the process. 💻",
  "Fun fact: Stress is just your body's way of saying 'Hey, I'm trying to help!' Maybe try telling it 'Thanks, but I got this.' 😅",
  "Life hack: If you're overthinking, you're probably under-breathing. Try the reverse for 2 minutes. 🔄",
  "Wisdom nugget: Your thoughts are like browser tabs - too many open and everything slows down. Close a few with meditation. 🌐",
  "Reality check: You can't control everything, but you can control your breathing. Start there. 🎯",
  "Plot twist: The most productive thing you can do right now is nothing. Just breathe. Plot twist! 📚",
  "Hot take: Your anxiety is just your brain being a really enthusiastic project manager. Tell it to take a coffee break. ☕",
  "Mind blown: You have 70,000 thoughts per day. That's like having 70,000 notifications. Time to turn on Do Not Disturb mode. 🔕",
  "Deep thought: If you can't find peace, maybe you're looking too hard. It's probably right there in your next breath. 🕳️",
  "Life lesson: Your mind is like a garden. Sometimes you need to stop planting and start weeding. 🌱",
  "Philosophy moment: You're not your thoughts, you're the observer of your thoughts. Be a good audience member. 🎭",
  "Science fact: Laughter releases endorphins. So technically, reading this tip is already making you feel better. 🧪",
  "Pro tip: If your mind is racing, it's probably training for a marathon it didn't sign up for. Time to slow down the pace. 🏃‍♂️",
  "Reality: You're not broken, you're just human. And humans need breaks. Take one now. 🛠️",
  "Wisdom: The present moment is the only moment you can actually control. Everything else is just mental time travel. ⏰",
  "Fun fact: Your brain doesn't know the difference between a real smile and a fake one. So fake it till you make it! 😊",
  "Life hack: When overwhelmed, ask yourself: 'What would I do if I wasn't afraid?' Then do that. But maybe start with breathing. 🦸‍♂️",
  "Plot twist: The secret to productivity isn't doing more, it's being more present with what you're doing. Mind = blown. 💥",
  "Hot take: Self-care isn't selfish, it's self-preservation. You can't pour from an empty cup, but you can breathe into it. ☕",
  "Deep thought: If you're feeling stuck, maybe you're not stuck - maybe you're just planted. Time to grow in a new direction. 🌻",
  "Reality check: You don't have to be perfect, you just have to be present. And breathing helps with that. ✨",
  "Philosophy: The mind is like a river - you can't stop the flow, but you can learn to float. 🚣‍♀️",
  "Science: Gratitude literally rewires your brain. So thank your brain for reading this tip. You're welcome, brain! 🧠",
  "Life lesson: Sometimes the best response to chaos is a deep breath. It's like hitting the pause button on life. ⏸️"
];

const getRandomTip = () => {
  return dailyTips[Math.floor(Math.random() * dailyTips.length)];
};

// Mood data with images
const moodOptions = [
  {
    id: 'happy',
    label: 'Happy',
    image: require('../../assets/images/emotions/happy.png'),
    color: '#FF6B9D'
  },
  {
    id: 'calm',
    label: 'Calm',
    image: require('../../assets/images/emotions/calm.png'),
    color: '#4CAF50'
  },
  {
    id: 'bored',
    label: 'Bored',
    image: require('../../assets/images/emotions/bored.png'),
    color: '#9E9E9E'
  },
  {
    id: 'tired',
    label: 'Tired',
    image: require('../../assets/images/emotions/tired.png'),
    color: '#4ECDC4'
  },
  {
    id: 'irritated',
    label: 'Irritated',
    image: require('../../assets/images/emotions/irritated.png'),
    color: '#FF9800'
  },
  {
    id: 'crying',
    label: 'Sad',
    image: require('../../assets/images/emotions/crying.png'),
    color: '#9C27B0'
  },
  {
    id: 'angry',
    label: 'Angry',
    image: require('../../assets/images/emotions/angry.png'),
    color: '#F44336'
  }
];
import { getUserProfile, getUserProgress, getMoodEntries, getAchievements, saveUserProfile, UserProfile, UserProgress } from '../../utils/offlineStorage';
import { supabase } from '../../constants/supabase';

interface UserDashboardData {
  id: string;
  display_name: string;
  primary_goals: string[];
  premium_status: boolean;
  mood_entries_count: number;
  badges_earned: number;
  last_mood_entry: string | null;
  total_exercises: number;
  current_streak: number;
}

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

export default function HomeScreen() {
  const { signOut, user } = useAuth();
  const { showConfirm } = useAlert();
  const [userData, setUserData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState<Motivation>(getRandomMotivation());
  const [currentTip, setCurrentTip] = useState<string>(getRandomTip());
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleLogout = () => {
    showConfirm(
      'Logout',
      'Are you sure you want to logout?',
      () => {
        signOut();
      }
    );
  };

  // Fetch user dashboard data from database and save to offline storage
  const fetchUserDashboard = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        console.log('No user ID available');
        return;
      }

      // First, try to get fresh data from database
      try {
        const { data: dbProfile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (dbProfile && !error) {
          // Save the fresh profile to offline storage
          const offlineProfile: UserProfile = {
            id: dbProfile.id,
            email: dbProfile.email,
            displayName: dbProfile.display_name,
            ageRange: dbProfile.age_range,
            primaryGoals: dbProfile.primary_goals,
            timezone: dbProfile.timezone,
            languagePreference: dbProfile.language_preference,
            notificationPreferences: typeof dbProfile.notification_preferences === 'string' 
              ? JSON.parse(dbProfile.notification_preferences) 
              : dbProfile.notification_preferences,
            onboardingCompleted: dbProfile.onboarding_completed,
            premiumStatus: dbProfile.premium_status,
            premiumExpiresAt: dbProfile.premium_expires_at,
            createdAt: dbProfile.created_at,
            updatedAt: dbProfile.updated_at
          };

          await saveUserProfile(offlineProfile);
          console.log('Profile saved to offline storage:', offlineProfile);
        }
      } catch (dbError) {
        console.log('Could not fetch from database, using offline data:', dbError);
      }

      // Get data from offline storage (now updated with fresh data)
      const [profile, progress, moodEntries, achievements] = await Promise.all([
        getUserProfile(),
        getUserProgress(),
        getMoodEntries(),
        getAchievements()
      ]);

      if (profile) {
        const dashboardData: UserDashboardData = {
          id: profile.id,
          display_name: profile.displayName || 'User',
          primary_goals: profile.primaryGoals || [],
          premium_status: profile.premiumStatus,
          mood_entries_count: moodEntries.length,
          badges_earned: achievements.length,
          last_mood_entry: moodEntries.length > 0 ? moodEntries[moodEntries.length - 1].date : null,
          total_exercises: progress.totalExercises,
          current_streak: progress.currentStreak
        };
        
        setUserData(dashboardData);
        console.log('Dashboard data set:', dashboardData);
      }
    } catch (error) {
      console.error('Error in fetchUserDashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserDashboard();
    }
  }, [user?.id]);

  // Timer to change motivation and tip every 1 minute (60,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMotivation(getRandomMotivation());
      setCurrentTip(getRandomTip());
    }, 1 * 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserDashboard();
    setCurrentMotivation(getRandomMotivation());
    setCurrentTip(getRandomTip());
    setRefreshing(false);
  };

  const handleMoodSelection = (moodId: string) => {
    setSelectedMood(moodId);
    console.log('Selected mood:', moodId);
  };

  const handleAddDetails = () => {
    if (selectedMood) {
      const selectedMoodData = moodOptions.find(mood => mood.id === selectedMood);
      if (selectedMoodData) {
        // Pass mood data to detailed log screen
        router.push({
          pathname: '/nonTabs/detailedMoodLog',
          params: {
            selectedMood: selectedMoodData.id,
            moodLabel: selectedMoodData.label,
            moodColor: selectedMoodData.color,
            moodImage: selectedMoodData.image
          }
        });
      }
    } else {
      // If no mood selected, go to detailed log without pre-selection
      router.push('/nonTabs/detailedMoodLog');
    }
  };

  // Get username from user data, metadata, or email
  const getUsername = () => {
    // First priority: display name from user data
    if (userData?.display_name) {
      return userData.display_name;
    }
    // Second priority: user metadata
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    // Third priority: email
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'there';
  };

  // Goal badge mapping - matches goal-selection.tsx exactly
  const getGoalBadge = (goal: string) => {
    const goalMap = {
      'reduce-anxiety': { icon: Brain, label: 'Anxiety', color: '#2196F3' },
      'improve-mood': { icon: Heart, label: 'Mood', color: '#4CAF50' },
      'better-sleep': { icon: Moon, label: 'Sleep', color: '#673AB7' },
      'stress-management': { icon: Activity, label: 'Stress', color: '#FF9800' },
      'mindfulness': { icon: Lightbulb, label: 'Mindful', color: '#4CAF50' },
      'social-support': { icon: Users, label: 'Support', color: '#2196F3' },
    };
    return goalMap[goal as keyof typeof goalMap] || { icon: Target, label: goal, color: theme.colors.primary };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* User Card Header */}
      <View style={styles.userCard}>
        {/* Top Row: Welcome + Settings */}
        <View style={styles.userCardTop}>
          <View style={styles.welcomeSection}>
            <HelloWave />
            <Text style={styles.welcomeText}>Welcome back!</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              router.push('/nonTabs/settings')
              console.log('Settings pressed');
            }}
          >
            <Settings size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >

        {/* User Dashboard Card */}
        <View style={styles.dashboardCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.dashboardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.dashboardHeader}>
              <View style={styles.userInfo}>
                {loading ? (
                  <>
                    <SkeletonLoader width={180} height={28} style={{ marginBottom: theme.spacing.sm }} />
                    <View style={styles.userStats}>
                      <View style={styles.statItem}>
                        <Trophy size={16} color="white" />
                        <SkeletonLoader width={80} height={14} />
                      </View>
                      <View style={styles.statItem}>
                        <Heart size={16} color="white" />
                        <SkeletonLoader width={90} height={14} />
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.userName}>
                      {userData?.display_name || getUsername()}
                    </Text>
                    <View style={styles.userStats}>
                      <View style={styles.statItem}>
                        <Trophy size={16} color="white" />
                        <Text style={styles.statText}>
                          {userData?.badges_earned || 0} badges
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Heart size={16} color="white" />
                        <Text style={styles.statText}>
                          {userData?.mood_entries_count || 0} entries
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Goal Badges */}
            <View style={styles.goalsSection}>
              <Text style={styles.goalsTitle}>Your Goals</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.goalsScrollContainer}
              >
                {loading ? (
                  <>
                    <SkeletonLoader width={80} height={32} style={{ borderRadius: theme.borderRadius.full, marginRight: theme.spacing.sm }} />
                    <SkeletonLoader width={90} height={32} style={{ borderRadius: theme.borderRadius.full, marginRight: theme.spacing.sm }} />
                    <SkeletonLoader width={75} height={32} style={{ borderRadius: theme.borderRadius.full }} />
                  </>
                ) : (
                  userData?.primary_goals?.map((goal, index) => {
                    const badge = getGoalBadge(goal);
                    const IconComponent = badge.icon;
                    return (
                      <View key={index} style={[styles.goalBadge, { backgroundColor: badge.color }]}>
                        <IconComponent size={16} color="white" />
                        <Text style={styles.goalBadgeText}>{badge.label}</Text>
                      </View>
                    );
                  }) || []
                )}
              </ScrollView>
            </View>
          </LinearGradient>
        </View>

        {/* Mood Log */}
        <View style={styles.moodContainer}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodOptions}
          >
            {moodOptions.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodButton,
                  { backgroundColor: mood.color },
                  selectedMood === mood.id && styles.selectedMoodButton
                ]}
                onPress={() => handleMoodSelection(mood.id)}
              >
                <Image source={mood.image} style={styles.moodImage} />
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.detailedButton}
            onPress={handleAddDetails}
          >
            <Text style={styles.detailedButtonText}>Add Details</Text>
            <ArrowRight size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Motivational Card */}
        <TouchableOpacity 
          style={styles.motivationCard}
          onPress={() => router.push('/nonTabs/motivations')}
        >
          <LinearGradient
            colors={['#FF6B35', '#4ECDC4', '#45B7D1']}
            style={styles.motivationGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.motivationHeader}>
              <Target size={20} color="white" />
              <Text style={styles.motivationLabel}>MOTIVATION</Text>
            </View>
            <Text style={styles.motivationText}>
              {currentMotivation.text}
            </Text>

            <View style={styles.motivationFooter}>
              <Text style={styles.keepGoingText}>Keep Going</Text>
              <TouchableOpacity onPress={() => router.push('/nonTabs/motivations')}>
                <Text style={styles.readMoreText}>Read more</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>


        {/* Daily Tip */}
        <View style={styles.tipContainer}>
          <Lightbulb size={20} color={theme.colors.primary} />
          <Text style={styles.tipText}>{currentTip}</Text>
        </View>

        {/* Journal Quick Access */}
        <TouchableOpacity
          style={styles.journalButton}
          onPress={() => router.push('/nonTabs/journal' as any)}
        >
          <BookOpen size={20} color={theme.colors.primary} />
          <Text style={styles.journalButtonText}>My Journal</Text>
          <ArrowRight size={16} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* Weekly Report */}
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => router.push('/nonTabs/weeklyReport')}
        >
          <TrendingUp size={20} color={theme.colors.primary} />
          <Text style={styles.reportButtonText}>Weekly Report</Text>
          <ArrowRight size={16} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* Ad Banner Placeholder */}
        <View style={styles.adContainer}>
          <Text style={styles.adText}>Ad Banner</Text>
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
  userCard: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  settingsButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md
  },
  dashboardCard: {
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  dashboardGradient: {
    padding: theme.spacing.lg,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    marginBottom: theme.spacing.sm,
  },
  userStats: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statText: {
    fontSize: theme.typography.fontSize.caption,
    color: 'white',
    opacity: 0.9,
  },
  logoutButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  goalsSection: {
    marginTop: theme.spacing.sm,
  },
  goalsTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'white',
    marginBottom: theme.spacing.sm,
    opacity: 0.9,
  },
  goalsScrollContainer: {
    gap: theme.spacing.sm,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  goalBadgeText: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'white',
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  motivationCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  motivationGradient: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
  },
  motivationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  motivationLabel: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    letterSpacing: 1,
  },
  motivationText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    lineHeight: theme.typography.lineHeight.body + 4,
    marginBottom: theme.spacing.lg,
    textAlign: 'left',
  },
  motivationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keepGoingText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'white',
  },
  readMoreText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'white',
    opacity: 0.9,
  },
  moodContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  moodOptions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  moodButton: {
    width: 100,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
  },
  selectedMoodButton: {
    transform: [{ scale: 1.05 }],
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  moodImage: {
    width: 50,
    height: 50,
    marginBottom: theme.spacing.xs,
  },
  moodLabel: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'white',
    textAlign: 'center',
  },
  detailedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: theme.spacing.xs,
  },
  detailedButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  tipText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  journalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  journalButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  reportButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  adContainer: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  adText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
});
