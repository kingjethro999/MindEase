import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// GAMIFICATION SYSTEM FOR MINDEASE APP
// ============================================================================

export interface Achievement {
  id: string;
  user_id: string;
  badge_type: string; // 'mood_streak_7', 'calm_master', 'resilience_builder', etc.
  badge_name: string;
  badge_description: string;
  earned_at: string;
  synced: boolean;
}

export interface UserStats {
  totalExercises: number;
  breathingExercises: number;
  meditationExercises: number;
  journalingEntries: number;
  currentStreak: number;
  longestStreak: number;
  totalExerciseTime: number; // in minutes
  moodEntries: number;
  lastExerciseDate: string | null;
  achievements: Achievement[];
  level: number;
  experience: number;
  nextLevelExp: number;
}

// Achievement definitions based on database schema
export const ACHIEVEMENT_DEFINITIONS = [
  // Mood Streak Achievements
  {
    badge_type: 'mood_streak_7',
    badge_name: 'Weekly Warrior',
    badge_description: 'Log mood for 7 consecutive days',
    requirements: { type: 'streak', value: 7, activityType: 'mood_log' }
  },
  {
    badge_type: 'mood_streak_30',
    badge_name: 'Monthly Master',
    badge_description: 'Log mood for 30 consecutive days',
    requirements: { type: 'streak', value: 30, activityType: 'mood_log' }
  },
  
  // Breathing Exercise Achievements
  {
    badge_type: 'breathing_master',
    badge_name: 'Focused Breather',
    badge_description: 'Complete 10 breathing exercises',
    requirements: { type: 'count', value: 10, activityType: 'breathing_exercise' }
  },
  {
    badge_type: 'sleep_ready',
    badge_name: 'Sleep Ready',
    badge_description: 'Complete 4-7-8 breathing before bedtime',
    requirements: { type: 'special', value: 1, activityType: 'breathing_exercise' }
  },
  
  // Meditation Achievements
  {
    badge_type: 'meditation_explorer',
    badge_name: 'Calm Explorer',
    badge_description: 'Complete 5 meditation sessions',
    requirements: { type: 'count', value: 5, activityType: 'meditation' }
  },
  {
    badge_type: 'sleep_helper',
    badge_name: 'Sleep Helper',
    badge_description: 'Complete 3 body scan sessions',
    requirements: { type: 'count', value: 3, activityType: 'meditation' }
  },
  {
    badge_type: 'grounding_hero',
    badge_name: 'Grounded Hero',
    badge_description: 'Complete 3 grounding exercises',
    requirements: { type: 'count', value: 3, activityType: 'meditation' }
  },
  
  // Journaling Achievements
  {
    badge_type: 'gratitude_keeper',
    badge_name: 'Gratitude Keeper',
    badge_description: 'Journal gratitude for 7 days',
    requirements: { type: 'count', value: 7, activityType: 'journaling' }
  },
  {
    badge_type: 'resilience_builder',
    badge_name: 'Resilience Builder',
    badge_description: 'Complete 5 thought reframing exercises',
    requirements: { type: 'count', value: 5, activityType: 'journaling' }
  },
  
  // Game Achievements
  {
    badge_type: 'stress_buster',
    badge_name: 'Stress Buster',
    badge_description: 'Complete 10 stress-relief game sessions',
    requirements: { type: 'count', value: 10, activityType: 'game_session' }
  },
  {
    badge_type: 'bubble_master',
    badge_name: 'Bubble Master',
    badge_description: 'Pop 100 bubbles in Bubble Pop Calm',
    requirements: { type: 'special', value: 100, activityType: 'game_session' }
  },
  {
    badge_type: 'breathing_sync_pro',
    badge_name: 'Breathing Sync Pro',
    badge_description: 'Complete 5 perfect breathing cycles',
    requirements: { type: 'special', value: 5, activityType: 'game_session' }
  },
  {
    badge_type: 'puzzle_solver',
    badge_name: 'Puzzle Solver',
    badge_description: 'Complete all 3 puzzle levels',
    requirements: { type: 'special', value: 3, activityType: 'game_session' }
  },
  {
    badge_type: 'color_artist',
    badge_name: 'Color Artist',
    badge_description: 'Achieve 100% accuracy in Color Harmony',
    requirements: { type: 'special', value: 100, activityType: 'game_session' }
  },
  {
    badge_type: 'game_marathon',
    badge_name: 'Game Marathon',
    badge_description: 'Play games for 30 minutes in one session',
    requirements: { type: 'special', value: 30, activityType: 'game_session' }
  },
  {
    badge_type: 'tic_tac_toe_master',
    badge_name: 'Tic-Tac-Toe Master',
    badge_description: 'Win 10 games of Tic-Tac-Toe',
    requirements: { type: 'special', value: 10, activityType: 'game_session' }
  },
  {
    badge_type: 'robot_beater',
    badge_name: 'Robot Beater',
    badge_description: 'Beat the AI opponent 5 times',
    requirements: { type: 'special', value: 5, activityType: 'game_session' }
  },
  {
    badge_type: 'strategy_thinker',
    badge_name: 'Strategy Thinker',
    badge_description: 'Complete 20 Tic-Tac-Toe games',
    requirements: { type: 'special', value: 20, activityType: 'game_session' }
  },
  
  // Cross-Activity Achievements
  {
    badge_type: 'wellness_warrior',
    badge_name: 'Wellness Warrior',
    badge_description: 'Complete exercises in 3 different categories',
    requirements: { type: 'special', value: 3, activityType: 'mixed' }
  },
  {
    badge_type: 'consistency_champion',
    badge_name: 'Consistency Champion',
    badge_description: 'Maintain a 7-day streak across activities',
    requirements: { type: 'streak', value: 7, activityType: 'mixed' }
  },

  // Advanced Gamification Achievements
  {
    badge_type: 'early_bird',
    badge_name: 'Early Bird',
    badge_description: 'Log mood before 8 AM for 7 days',
    requirements: { type: 'time_pattern', value: 7, timeRange: 'morning' }
  },
  {
    badge_type: 'night_owl',
    badge_name: 'Night Owl',
    badge_description: 'Complete exercises after 10 PM for 5 days',
    requirements: { type: 'time_pattern', value: 5, timeRange: 'evening' }
  },
  {
    badge_type: 'weekend_warrior',
    badge_name: 'Weekend Warrior',
    badge_description: 'Maintain mood logging streak through weekends',
    requirements: { type: 'weekend_streak', value: 4, activityType: 'mood_log' }
  },
  {
    badge_type: 'mindfulness_maestro',
    badge_name: 'Mindfulness Maestro',
    badge_description: 'Complete 50 total mindfulness activities',
    requirements: { type: 'total_count', value: 50, activityTypes: ['breathing_exercise', 'meditation'] }
  },
  {
    badge_type: 'reflection_master',
    badge_name: 'Reflection Master',
    badge_description: 'Write 20 journal entries',
    requirements: { type: 'count', value: 20, activityType: 'journaling' }
  },
  {
    badge_type: 'gratitude_guru',
    badge_name: 'Gratitude Guru',
    badge_description: 'Complete 10 gratitude journal entries',
    requirements: { type: 'journal_type', value: 10, journalType: 'gratitude' }
  },
  {
    badge_type: 'thought_reframer',
    badge_name: 'Thought Reframer',
    badge_description: 'Complete 5 thought reframing exercises',
    requirements: { type: 'journal_type', value: 5, journalType: 'reframing' }
  },
  {
    badge_type: 'streak_survivor',
    badge_name: 'Streak Survivor',
    badge_description: 'Maintain any 14-day streak',
    requirements: { type: 'any_streak', value: 14, activityType: 'any' }
  },
  {
    badge_type: 'xp_collector',
    badge_name: 'XP Collector',
    badge_description: 'Earn 1000 total experience points',
    requirements: { type: 'total_xp', value: 1000, activityType: 'any' }
  },
  {
    badge_type: 'zen_master',
    badge_name: 'Zen Master',
    badge_description: 'Complete 100 total activities',
    requirements: { type: 'total_activities', value: 100, activityType: 'any' }
  },
  {
    badge_type: 'mood_analyst',
    badge_name: 'Mood Analyst',
    badge_description: 'Log mood for 60 days total',
    requirements: { type: 'total_count', value: 60, activityType: 'mood_log' }
  },
  {
    badge_type: 'game_legend',
    badge_name: 'Game Legend',
    badge_description: 'Achieve high scores in all games',
    requirements: { type: 'game_mastery_all', value: 1, gameType: 'all' }
  },
  {
    badge_type: 'balanced_life',
    badge_name: 'Balanced Life',
    badge_description: 'Use all app features in one week',
    requirements: { type: 'weekly_complete', value: 1, activityType: 'all' }
  },
  {
    badge_type: 'progress_tracker',
    badge_name: 'Progress Tracker',
    badge_description: 'View weekly reports for 4 consecutive weeks',
    requirements: { type: 'report_viewing', value: 4, activityType: 'weekly_report' }
  },
  {
    badge_type: 'dedication_demon',
    badge_name: 'Dedication Demon',
    badge_description: 'Use the app for 30 consecutive days',
    requirements: { type: 'app_usage', value: 30, activityType: 'any' }
  },
  {
    badge_type: 'explorer',
    badge_name: 'Explorer',
    badge_description: 'Try every type of exercise at least once',
    requirements: { type: 'variety', value: 5, activityTypes: ['breathing_exercise', 'meditation', 'journaling', 'game_session', 'mood_log'] }
  }
];

// ============================================================================
// GAMIFICATION FUNCTIONS
// ============================================================================

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const achievementsData = await AsyncStorage.getItem('user_achievements');
    if (achievementsData) {
      return JSON.parse(achievementsData);
    }
    return [];
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

export const checkAchievements = async (userId: string, completions: any[]): Promise<Achievement[]> => {
  const newAchievements: Achievement[] = [];
  
  // Get existing achievements to avoid duplicates
  const existingAchievements = await getAchievements();
  const existingBadgeTypes = existingAchievements.map((a: Achievement) => a.badge_type);
  
  console.log('Checking achievements:', {
    userId,
    totalCompletions: completions.length,
    existingAchievements: existingAchievements.length,
    existingBadgeTypes
  });
  
  for (const achievementDef of ACHIEVEMENT_DEFINITIONS) {
    // Check if already earned
    const badge_type = achievementDef.badge_type || '';
    if (existingBadgeTypes.includes(badge_type)) continue;

    let earned = false;

    switch (achievementDef.requirements.type) {
      case 'count':
        const activityCompletions = completions.filter(c => c.activity_type === achievementDef.requirements.activityType);
        earned = activityCompletions.length >= achievementDef.requirements.value;
        break;

      case 'streak':
        if (achievementDef.requirements.activityType === 'mood_log') {
          // Calculate mood streak from completions
          const moodCompletions = completions.filter(c => c.activity_type === 'mood_log');
          earned = calculateStreak(moodCompletions) >= achievementDef.requirements.value;
        } else if (achievementDef.requirements.activityType === 'mixed') {
          // Calculate cross-activity streak
          earned = calculateCrossActivityStreak(completions) >= achievementDef.requirements.value;
        }
        break;

      case 'special':
        if (achievementDef.badge_type === 'sleep_ready') {
          // Check for 4-7-8 breathing at night
          const nightBreathing = completions.filter(c => 
            c.activity_type === 'breathing_exercise' && 
            c.activity_details?.exerciseId === '4-7-8' &&
            isNightTime(c.completed_at)
          );
          earned = nightBreathing.length >= achievementDef.requirements.value;
        } else if (achievementDef.badge_type === 'wellness_warrior') {
          // Check for exercises in 3 different categories
          const uniqueActivityTypes = new Set(completions.map(c => c.activity_type));
          earned = uniqueActivityTypes.size >= achievementDef.requirements.value;
        } else if (achievementDef.badge_type === 'bubble_master') {
          // Check for bubble pop achievements
          const bubbleGames = completions.filter(c => 
            c.activity_type === 'game_session' && 
            c.activity_details?.exerciseId === 'bubble-pop'
          );
          const totalBubbles = bubbleGames.reduce((sum, game) => 
            sum + (game.activity_details?.gameScore || 0) / 10, 0
          );
          earned = totalBubbles >= achievementDef.requirements.value;
        } else if (achievementDef.badge_type === 'breathing_sync_pro') {
          // Check for perfect breathing cycles
          const breathingGames = completions.filter(c => 
            c.activity_type === 'game_session' && 
            c.activity_details?.exerciseId === 'breathing-sync'
          );
          const perfectCycles = breathingGames.filter(game => 
            game.activity_details?.notes?.includes('perfect') || 
            (game.activity_details?.gameScore || 0) >= 500
          ).length;
          earned = perfectCycles >= achievementDef.requirements.value;
        } else if (achievementDef.badge_type === 'puzzle_solver') {
          // Check for completed puzzle levels
          const puzzleGames = completions.filter(c => 
            c.activity_type === 'game_session' && 
            c.activity_details?.exerciseId === 'soothing-puzzle'
          );
          const completedLevels = new Set(puzzleGames.map(game => game.activity_details?.gameLevel)).size;
          earned = completedLevels >= achievementDef.requirements.value;
        } else if (achievementDef.badge_type === 'color_artist') {
          // Check for 100% accuracy in color harmony
          const colorGames = completions.filter(c => 
            c.activity_type === 'game_session' && 
            c.activity_details?.exerciseId === 'color-harmony'
          );
          const perfectGames = colorGames.filter(game => 
            game.activity_details?.notes?.includes('100%') ||
            (game.activity_details?.gameScore || 0) >= 1000
          ).length;
          earned = perfectGames >= 1; // At least one perfect game
        } else if (achievementDef.badge_type === 'game_marathon') {
          // Check for 30+ minute game sessions
          const longGames = completions.filter(c => 
            c.activity_type === 'game_session' && 
            (c.activity_details?.duration || 0) >= 30
          );
          earned = longGames.length >= 1;
        } else if (achievementDef.badge_type === 'tic_tac_toe_master') {
          // Check for Tic-Tac-Toe wins
          const ticTacToeGames = completions.filter(c => 
            c.activity_type === 'game_session' && 
            c.activity_details?.exerciseId === 'tic-tac-toe'
          );
          const wins = ticTacToeGames.filter(game => 
            game.activity_details?.notes?.includes('Winner: X') ||
            game.activity_details?.notes?.includes('You won!')
          ).length;
          earned = wins >= achievementDef.requirements.value;
        } else if (achievementDef.badge_type === 'robot_beater') {
          // Check for wins against robot
          const robotGames = completions.filter(c => 
            c.activity_type === 'game_session' && 
            c.activity_details?.exerciseId === 'tic-tac-toe' &&
            c.activity_details?.notes?.includes('vs-robot')
          );
          const robotWins = robotGames.filter(game => 
            game.activity_details?.notes?.includes('You won!')
          ).length;
          earned = robotWins >= achievementDef.requirements.value;
        } else if (achievementDef.badge_type === 'strategy_thinker') {
          // Check for total Tic-Tac-Toe games played
          const ticTacToeGames = completions.filter(c => 
            c.activity_type === 'game_session' && 
            c.activity_details?.exerciseId === 'tic-tac-toe'
          );
          earned = ticTacToeGames.length >= achievementDef.requirements.value;
        }
        break;
    }

    if (earned) {
      console.log('Achievement earned:', badge_type, achievementDef.badge_name);
      const newAchievement: Achievement = {
        id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        badge_type: badge_type,
        badge_name: achievementDef.badge_name || 'Unnamed Badge',
        badge_description: achievementDef.badge_description || 'No description available',
        earned_at: new Date().toISOString(),
        synced: false
      };
      newAchievements.push(newAchievement);
    }
  }

  return newAchievements;
};

// Helper functions
const calculateStreak = (completions: any[]): number => {
  if (completions.length === 0) return 0;
  
  // Sort by date descending
  const sorted = completions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const completion of sorted) {
    const completionDate = new Date(completion.completedAt);
    const daysDiff = Math.floor((currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate = completionDate;
    } else {
      break;
    }
  }
  
  return streak;
};

const calculateCrossActivityStreak = (completions: any[]): number => {
  // Group completions by date
  const dailyActivities = new Map();
  
  completions.forEach(completion => {
    const date = new Date(completion.completed_at).toDateString();
    if (!dailyActivities.has(date)) {
      dailyActivities.set(date, new Set());
    }
    dailyActivities.get(date).add(completion.activity_type);
  });
  
  // Calculate consecutive days with any activity
  const sortedDates = Array.from(dailyActivities.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);
    const daysDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }
  
  return streak;
};

const isNightTime = (dateString: string): boolean => {
  const date = new Date(dateString);
  const hour = date.getHours();
  return hour >= 22 || hour <= 6; // 10 PM to 6 AM
};

export const calculateLevel = (experience: number): { level: number; nextLevelExp: number; progress: number } => {
  // Level calculation: each level requires more experience
  // Level 1: 0-100 XP, Level 2: 100-250 XP, Level 3: 250-450 XP, etc.
  let level = 1;
  let totalExpNeeded = 0;
  let nextLevelExp = 100;

  while (experience >= totalExpNeeded + nextLevelExp) {
    totalExpNeeded += nextLevelExp;
    level++;
    nextLevelExp = Math.floor(nextLevelExp * 1.5); // Each level requires 50% more XP
  }

  const currentLevelExp = experience - totalExpNeeded;
  const progress = (currentLevelExp / nextLevelExp) * 100;

  return { level, nextLevelExp, progress };
};

export const awardExperience = (activityType: string, duration?: number): number => {
  // Award experience based on activity type and duration
  const baseExp: Record<string, number> = {
    'breathing_exercise': 10,
    'meditation': 15,
    'journaling': 20,
    'mood_log': 5,
    'game_session': 8,
    'sleep_tools': 12
  };

  let exp = baseExp[activityType] || 5;
  
  // Bonus for duration (for exercises)
  if (duration && duration > 0) {
    exp += Math.floor(duration / 60) * 2; // 2 XP per minute
  }

  return exp;
};

export const getAchievementNotification = (achievement: Achievement) => {
  return {
    type: 'achievement' as const,
    title: `Achievement Unlocked! 🏆`,
    message: `${achievement.badge_name}: ${achievement.badge_description}`
  };
};

export const getStreakNotification = (streak: number, type: 'exercise' | 'mood') => {
  if (streak % 7 === 0 && streak > 0) {
    return {
      type: 'streak' as const,
      title: `🔥 ${streak} Day Streak!`,
      message: `Amazing! You've been ${type === 'exercise' ? 'exercising' : 'tracking your mood'} for ${streak} days straight!`
    };
  }
  return null;
};

export const getMilestoneNotification = (milestone: string, value: number) => {
  return {
    type: 'milestone' as const,
    title: `🎯 Milestone Reached!`,
    message: `${milestone}: ${value} completed!`
  };
};

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

export const saveUserStats = async (stats: UserStats): Promise<void> => {
  try {
    await AsyncStorage.setItem('user_stats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving user stats:', error);
    throw error;
  }
};

export const getUserStats = async (): Promise<UserStats> => {
  try {
    const statsData = await AsyncStorage.getItem('user_stats');
    if (statsData) {
      return JSON.parse(statsData);
    }
    
    // Return default stats
    return {
      totalExercises: 0,
      breathingExercises: 0,
      meditationExercises: 0,
      journalingEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalExerciseTime: 0,
      moodEntries: 0,
      lastExerciseDate: null,
      achievements: [],
      level: 1,
      experience: 0,
      nextLevelExp: 100
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalExercises: 0,
      breathingExercises: 0,
      meditationExercises: 0,
      journalingEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalExerciseTime: 0,
      moodEntries: 0,
      lastExerciseDate: null,
      achievements: [],
      level: 1,
      experience: 0,
      nextLevelExp: 100
    };
  }
};

export const updateUserStats = async (updates: Partial<UserStats>): Promise<UserStats> => {
  try {
    const currentStats = await getUserStats();
    const updatedStats = { ...currentStats, ...updates };
    
    // Recalculate level
    const levelData = calculateLevel(updatedStats.experience);
    updatedStats.level = levelData.level;
    updatedStats.nextLevelExp = levelData.nextLevelExp;
    
    await saveUserStats(updatedStats);
    return updatedStats;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

export const saveAchievement = async (achievement: Achievement): Promise<void> => {
  try {
    const existingAchievements = await getAchievements();
    const updatedAchievements = [...existingAchievements, achievement];
    await AsyncStorage.setItem('user_achievements', JSON.stringify(updatedAchievements));
  } catch (error) {
    console.error('Error saving achievement:', error);
    throw error;
  }
};

// ============================================================================
// STATS CALCULATION FUNCTIONS
// ============================================================================

export const calculateUserStatsFromCompletions = async (): Promise<UserStats> => {
  try {
    // Import here to avoid circular dependency
    const { getExerciseCompletions } = await import('./offlineStorage');
    const completions = await getExerciseCompletions();
    
    // Calculate stats from completions
    const totalExercises = completions.length;
    const breathingExercises = completions.filter(c => c.activity_type === 'breathing_exercise').length;
    const meditationExercises = completions.filter(c => c.activity_type === 'meditation').length;
    const journalingEntries = completions.filter(c => c.activity_type === 'journaling').length;
    const moodEntries = completions.filter(c => c.activity_type === 'mood_log').length;
    
    // Calculate total exercise time
    const totalExerciseTime = completions.reduce((sum, c) => sum + (c.activity_details?.duration || 0), 0);
    
    // Calculate total experience
    const totalExperience = completions.reduce((sum, c) => {
      const activityType = c.activity_type;
      const duration = c.activity_details?.duration;
      const exp = awardExperience(activityType, duration);
      return sum + exp;
    }, 0);
    
    // Calculate level from experience
    const levelData = calculateLevel(totalExperience);
    
    // Calculate current streak (simplified - consecutive days with any activity)
    const currentStreak = calculateCurrentStreak(completions);
    
    // Get last exercise date
    const lastExerciseDate = completions.length > 0 
      ? completions.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0].completed_at
      : null;
    
    // Get achievements
    const achievements = await getAchievements();
    
    return {
      totalExercises,
      breathingExercises,
      meditationExercises,
      journalingEntries,
      currentStreak,
      longestStreak: currentStreak, // Simplified for now
      totalExerciseTime,
      moodEntries,
      lastExerciseDate,
      achievements,
      level: levelData.level,
      experience: totalExperience,
      nextLevelExp: levelData.nextLevelExp
    };
  } catch (error) {
    console.error('Error calculating user stats from completions:', error);
    return {
      totalExercises: 0,
      breathingExercises: 0,
      meditationExercises: 0,
      journalingEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalExerciseTime: 0,
      moodEntries: 0,
      lastExerciseDate: null,
      achievements: [],
      level: 1,
      experience: 0,
      nextLevelExp: 100
    };
  }
};

export const updateUserStatsFromCompletions = async (): Promise<UserStats> => {
  try {
    const calculatedStats = await calculateUserStatsFromCompletions();
    await saveUserStats(calculatedStats);
    return calculatedStats;
  } catch (error) {
    console.error('Error updating user stats from completions:', error);
    throw error;
  }
};

const calculateCurrentStreak = (completions: any[]): number => {
  if (completions.length === 0) return 0;
  
  // Group completions by date
  const dailyActivities = new Map();
  
  completions.forEach(completion => {
    const date = new Date(completion.completed_at).toDateString();
    if (!dailyActivities.has(date)) {
      dailyActivities.set(date, new Set());
    }
    dailyActivities.get(date).add(completion.activity_type);
  });
  
  // Calculate consecutive days with any activity
  const sortedDates = Array.from(dailyActivities.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);
    const daysDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }
  
  return streak;
};
