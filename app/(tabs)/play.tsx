import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Gamepad2, Puzzle, Star, Wind, Palette, Grid3X3, ChevronRight, Trophy, Target, Zap, RefreshCw, Crown, Award, Sparkles, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import { getExerciseCompletions } from '../../utils/offlineStorage';
import { getUserStats, updateUserStatsFromCompletions } from '../../utils/gamification';
import { gameEventManager } from '../../utils/gameEvents';

const { width } = Dimensions.get('window');

export default function PlayScreen() {
  const [completions, setCompletions] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ level: 1, experience: 0 });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    loadGameStats();
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Reload stats when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadGameStats();
    }, [])
  );

  // Add a global event listener for game completions
  useEffect(() => {
    const handleGameCompletion = () => {
      // Small delay to ensure data is saved
      setTimeout(() => {
        loadGameStats();
      }, 500);
    };

    // Subscribe to game completion events
    const unsubscribe = gameEventManager.subscribe((event) => {
      console.log('Game completed:', event);
      handleGameCompletion();
    });

    return unsubscribe;
  }, []);

  const loadGameStats = async () => {
    try {
      // First, update user stats from all completions to ensure they're current
      await updateUserStatsFromCompletions();
      
      const completionData = await getExerciseCompletions();
      setCompletions(completionData);
      
      // Get the updated stats
      const stats = await getUserStats();
      setUserStats({ level: stats.level, experience: stats.experience });
      
      // Debug logging
      console.log('Game Stats Debug:', {
        totalCompletions: completionData.length,
        gameCompletions: completionData.filter(c => c.activity_type === 'game_session').length,
        userLevel: stats.level,
        userExperience: stats.experience,
        recentGames: completionData.filter(c => c.activity_type === 'game_session').slice(-3).map(g => ({
          game: g.activity_details?.exerciseId,
          score: g.activity_details?.gameScore,
          date: g.completed_at
        }))
      });
    } catch (error) {
      console.error('Error loading game stats:', error);
    }
  };

  const getGameCompletionCount = (gameId: string) => {
    return completions.filter(c => 
      c.activity_type === 'game_session' && 
      c.activity_details?.exerciseId === gameId
    ).length;
  };

  const getGameStats = () => {
    const gameCompletions = completions.filter(c => c.activity_type === 'game_session');
    const totalScore = gameCompletions.reduce((sum, game) => 
      sum + (game.activity_details?.gameScore || 0), 0
    );
    const totalGames = gameCompletions.length;
    const averageScore = totalGames > 0 ? Math.floor(totalScore / totalGames) : 0;
    const achievements = Math.floor(totalGames / 5); // 1 achievement per 5 games
    
    return { totalScore, totalGames, averageScore, achievements };
  };

  const games = [
    {
      id: 'bubble-pop',
      title: 'Bubble Pop Calm',
      description: 'Pop floating bubbles and relax with calming colors',
      icon: Gamepad2,
      color: '#FF6B9D',
      bgColor: '#FFF0F5',
      difficulty: 'Easy',
      completionCount: getGameCompletionCount('bubble-pop'),
      onPress: () => router.push('/nonTabs/bubblePopGame'),
    },
    {
      id: 'breathing-sync',
      title: 'Breathing Sync',
      description: 'Follow the rhythm and sync with your breathing',
      icon: Wind,
      color: '#4ECDC4',
      bgColor: '#E0F7FA',
      difficulty: 'Easy',
      completionCount: getGameCompletionCount('breathing-sync'),
      onPress: () => router.push('/nonTabs/breathingSyncGame'),
    },
    {
      id: 'soothing-puzzle',
      title: 'Soothing Puzzle',
      description: 'Arrange pieces to create peaceful patterns',
      icon: Puzzle,
      color: '#96CEB4',
      bgColor: '#F0F8F0',
      difficulty: 'Medium',
      completionCount: getGameCompletionCount('soothing-puzzle'),
      onPress: () => router.push('/nonTabs/soothingPuzzleGame'),
    },
    {
      id: 'color-harmony',
      title: 'Color Harmony',
      description: 'Match colors to create beautiful palettes',
      icon: Palette,
      color: '#DDA0DD',
      bgColor: '#F8F0FF',
      difficulty: 'Medium',
      completionCount: getGameCompletionCount('color-harmony'),
      onPress: () => router.push('/nonTabs/colorHarmonyGame'),
    },
    {
      id: 'tic-tac-toe',
      title: 'Tic-Tac-Toe',
      description: 'Classic strategy game - challenging yet relaxing',
      icon: Grid3X3,
      color: '#F7DC6F',
      bgColor: '#FFFBF0',
      difficulty: 'Easy',
      completionCount: getGameCompletionCount('tic-tac-toe'),
      onPress: () => router.push('/nonTabs/ticTacToeGame'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Enhanced Header with Level Display */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Stress-Relief Games</Text>
              <Text style={styles.subtitle}>Level up your relaxation skills</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.refreshButton} 
                onPress={loadGameStats}
                activeOpacity={0.7}
              >
                <RefreshCw size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              <View style={styles.headerIcon}>
                <Gamepad2 size={32} color={theme.colors.primary} />
              </View>
            </View>
          </View>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* Level Progress */}
          <View style={styles.levelContainer}>
            <View style={styles.levelInfo}>
              <Crown size={20} color={theme.colors.warning} />
              <Text style={styles.levelText}>Level {userStats.level}</Text>
              <Text style={styles.experienceText}>{userStats.experience} XP</Text>
            </View>
            <View style={styles.levelProgressBar}>
              <View style={[styles.levelProgressFill, { 
                width: `${(userStats.experience % 100)}%` 
              }]} />
            </View>
          </View>
        {/* Enhanced Stats Section with Achievements */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
          style={styles.statsScrollView}
        >
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Trophy size={20} color={theme.colors.warning} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{getGameStats().totalScore}</Text>
              <Text style={styles.statLabel}>Total Score</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Target size={20} color={theme.colors.success} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{getGameStats().totalGames}</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Award size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{getGameStats().achievements}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={20} color={theme.colors.info} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{getGameStats().averageScore}</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
          </View>
        </ScrollView>

        {/* Game List */}
        
          {games.map((game, index) => {
            const IconComponent = game.icon;
            const isPlayed = game.completionCount > 0;
            
            return (
              <TouchableOpacity
                key={game.id}
                style={[styles.gameCard, { marginTop: index === 0 ? theme.spacing.sm : 0 }]}
                onPress={game.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.cardBackground, { backgroundColor: game.bgColor }]}>
                  <View style={styles.gameContent}>
                    <View style={[styles.iconContainer, { backgroundColor: game.color }]}>
                      <IconComponent size={20} color="white" />
                      {isPlayed && (
                        <View style={styles.playedBadge}>
                          <Star size={12} color="white" />
                        </View>
                      )}
                    </View>
                    <View style={styles.gameInfo}>
                      <View style={styles.gameHeader}>
                        <Text style={styles.gameTitle}>{game.title}</Text>
                        <View style={styles.badgeContainer}>
                          <View style={[styles.difficultyBadge, { backgroundColor: game.color + '20' }]}>
                            <Text style={[styles.difficultyText, { color: game.color }]}>{game.difficulty}</Text>
                          </View>
                          {isPlayed && (
                            <View style={[styles.completionBadge, { backgroundColor: game.color }]}>
                              <Text style={styles.completionText}>{game.completionCount}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {/* <Text style={styles.gameDescription}>{game.description}</Text> */}
                      {isPlayed && (
                        <View style={styles.achievementContainer}>
                          <Sparkles size={12} color={theme.colors.warning} />
                          <Text style={styles.achievementText}>Recently played</Text>
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
        {/* Enhanced Premium Section */}
        <View style={styles.premiumContainer}>
          <TouchableOpacity 
            style={styles.premiumButton} 
            activeOpacity={0.8}
            onPress={() => router.push('/nonTabs/premium')}
          >
            <View style={styles.premiumContent}>
              <Crown size={24} color="white" />
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumButtonText}>Unlock Premium Games</Text>
                <Text style={styles.premiumSubtext}>Subscribe to unlock premium content</Text>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accents.gameOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelContainer: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  levelText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  experienceText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  levelProgressBar: {
    height: 6,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.warning,
    borderRadius: 3,
  },
  statsScrollView: {
    maxHeight: 100,
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
  gameCard: {
    marginBottom: theme.spacing.md,
  },
  cardBackground: {
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  gameContent: {
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
    ...theme.shadows.sm,
    position: 'relative',
  },
  playedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  gameInfo: {
    flex: 1,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  gameTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  difficultyText: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  completionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionText: {
    fontSize: theme.typography.fontSize.small,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  gameDescription: {
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
  premiumContainer: {
    paddingTop: theme.spacing.md,
  },
  premiumButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  premiumTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  premiumButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing.xs,
  },
  premiumSubtext: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
