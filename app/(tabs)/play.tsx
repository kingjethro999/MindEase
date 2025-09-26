import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Gamepad2, Puzzle, Star, Wind, Palette, Grid3X3, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import { getExerciseCompletions } from '../../utils/offlineStorage';
import { getUserStats } from '../../utils/gamification';

export default function PlayScreen() {
  const [gameStats, setGameStats] = useState({ totalScore: 0, totalGames: 0 });
  const [userStats, setUserStats] = useState({ level: 1, experience: 0 });

  useEffect(() => {
    loadGameStats();
  }, []);

  // Reload stats when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadGameStats();
    }, [])
  );

  const loadGameStats = async () => {
    try {
      const completions = await getExerciseCompletions();
      const gameCompletions = completions.filter(c => c.activityType === 'game_session');
      
      const totalScore = gameCompletions.reduce((sum, game) => 
        sum + (game.activityDetails?.gameScore || 0), 0
      );
      
      setGameStats({ totalScore, totalGames: gameCompletions.length });
      
      const stats = await getUserStats();
      setUserStats({ level: stats.level, experience: stats.experience });
    } catch (error) {
      console.error('Error loading game stats:', error);
    }
  };

  const games = [
    {
      id: 'bubble-pop',
      title: 'Bubble Pop Calm',
      description: 'Pop floating bubbles and relax with calming colors',
      icon: Gamepad2,
      color: '#FF6B9D',
      onPress: () => router.push('/nonTabs/bubblePopGame'),
    },
    {
      id: 'breathing-sync',
      title: 'Breathing Sync',
      description: 'Follow the rhythm and sync with your breathing',
      icon: Wind,
      color: '#4ECDC4',
      onPress: () => router.push('/nonTabs/breathingSyncGame'),
    },
    {
      id: 'soothing-puzzle',
      title: 'Soothing Puzzle',
      description: 'Arrange pieces to create peaceful patterns',
      icon: Puzzle,
      color: '#96CEB4',
      onPress: () => router.push('/nonTabs/soothingPuzzleGame'),
    },
    {
      id: 'color-harmony',
      title: 'Color Harmony',
      description: 'Match colors to create beautiful palettes',
      icon: Palette,
      color: '#DDA0DD',
      onPress: () => router.push('/nonTabs/colorHarmonyGame'),
    },
    {
      id: 'tic-tac-toe',
      title: 'Tic-Tac-Toe',
      description: 'Classic strategy game - challenging yet relaxing',
      icon: Grid3X3,
      color: '#F7DC6F',
      onPress: () => router.push('/nonTabs/ticTacToeGame'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Stress-Relief Games</Text>
        <Text style={styles.subtitle}>Relax and unwind with calming games</Text>
      </View>

      {/* Game List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={game.onPress}
            >
              <View style={[styles.iconContainer, { backgroundColor: game.color + '20' }]}>
                <IconComponent size={28} color={game.color} />
              </View>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
              </View>
              <ChevronRight size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{gameStats.totalScore}</Text>
          <Text style={styles.statLabel}>Total Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{gameStats.totalGames}</Text>
          <Text style={styles.statLabel}>Games Played</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>Lv.{userStats.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {/* Premium Section */}
      <View style={styles.premiumContainer}>
        <TouchableOpacity style={styles.premiumButton}>
          <Star size={20} color="white" />
          <Text style={styles.premiumButtonText}>Unlock Themes →</Text>
        </TouchableOpacity>
        <Text style={styles.premiumSubtext}>(Rewarded Ad Flow)</Text>
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
    padding: theme.spacing.lg,
    // alignItems: 'center',
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
    // textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  gameCard: {
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
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  gameDescription: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
  },
  premiumContainer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  premiumButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginLeft: theme.spacing.sm,
  },
  premiumSubtext: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
