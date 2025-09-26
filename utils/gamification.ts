import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// GAMIFICATION SYSTEM FOR MINDEASE APP
// ============================================================================

export interface Achievement {
  id: string;
  userId: string;
  badgeType: string; // 'mood_streak_7', 'calm_master', 'resilience_builder', etc.
  badgeName: string;
  badgeDescription: string;
  earnedAt: string;
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
    badgeType: 'mood_streak_7',
    badgeName: 'Weekly Warrior',
    badgeDescription: 'Log mood for 7 consecutive days',
    requirements: { type: 'streak', value: 7, activityType: 'mood_log' }
  },
  {
    badgeType: 'mood_streak_30',
    badgeName: 'Monthly Master',
    badgeDescription: 'Log mood for 30 consecutive days',
    requirements: { type: 'streak', value: 30, activityType: 'mood_log' }
  },
  
  // Breathing Exercise Achievements
  {
    badgeType: 'breathing_master',
    badgeName: 'Focused Breather',
    badgeDescription: 'Complete 10 breathing exercises',
    requirements: { type: 'count', value: 10, activityType: 'breathing_exercise' }
  },
  {
    badgeType: 'sleep_ready',
    badgeName: 'Sleep Ready',
    badgeDescription: 'Complete 4-7-8 breathing before bedtime',
    requirements: { type: 'special', value: 1, activityType: 'breathing_exercise' }
  },
  
  // Meditation Achievements
  {
    badgeType: 'meditation_explorer',
    badgeName: 'Calm Explorer',
    badgeDescription: 'Complete 5 meditation sessions',
    requirements: { type: 'count', value: 5, activityType: 'meditation' }
  },
  {
    badgeType: 'sleep_helper',
    badgeName: 'Sleep Helper',
    badgeDescription: 'Complete 3 body scan sessions',
    requirements: { type: 'count', value: 3, activityType: 'meditation' }
  },
  {
    badgeType: 'grounding_hero',
    badgeName: 'Grounded Hero',
    badgeDescription: 'Complete 3 grounding exercises',
    requirements: { type: 'count', value: 3, activityType: 'meditation' }
  },
  
  // Journaling Achievements
  {
    badgeType: 'gratitude_keeper',
    badgeName: 'Gratitude Keeper',
    badgeDescription: 'Journal gratitude for 7 days',
    requirements: { type: 'count', value: 7, activityType: 'journaling' }
  },
  {
    badgeType: 'resilience_builder',
    badgeName: 'Resilience Builder',
    badgeDescription: 'Complete 5 thought reframing exercises',
    requirements: { type: 'count', value: 5, activityType: 'journaling' }
  },
  
  // Game Achievements
  {
    badgeType: 'stress_buster',
    badgeName: 'Stress Buster',
    badgeDescription: 'Complete 10 stress-relief game sessions',
    requirements: { type: 'count', value: 10, activityType: 'game_session' }
  },
  {
    badgeType: 'bubble_master',
    badgeName: 'Bubble Master',
    badgeDescription: 'Pop 100 bubbles in Bubble Pop Calm',
    requirements: { type: 'special', value: 100, activityType: 'game_session' }
  },
  {
    badgeType: 'breathing_sync_pro',
    badgeName: 'Breathing Sync Pro',
    badgeDescription: 'Complete 5 perfect breathing cycles',
    requirements: { type: 'special', value: 5, activityType: 'game_session' }
  },
  {
    badgeType: 'puzzle_solver',
    badgeName: 'Puzzle Solver',
    badgeDescription: 'Complete all 3 puzzle levels',
    requirements: { type: 'special', value: 3, activityType: 'game_session' }
  },
  {
    badgeType: 'color_artist',
    badgeName: 'Color Artist',
    badgeDescription: 'Achieve 100% accuracy in Color Harmony',
    requirements: { type: 'special', value: 100, activityType: 'game_session' }
  },
  {
    badgeType: 'game_marathon',
    badgeName: 'Game Marathon',
    badgeDescription: 'Play games for 30 minutes in one session',
    requirements: { type: 'special', value: 30, activityType: 'game_session' }
  },
  {
    badgeType: 'tic_tac_toe_master',
    badgeName: 'Tic-Tac-Toe Master',
    badgeDescription: 'Win 10 games of Tic-Tac-Toe',
    requirements: { type: 'special', value: 10, activityType: 'game_session' }
  },
  {
    badgeType: 'robot_beater',
    badgeName: 'Robot Beater',
    badgeDescription: 'Beat the AI opponent 5 times',
    requirements: { type: 'special', value: 5, activityType: 'game_session' }
  },
  {
    badgeType: 'strategy_thinker',
    badgeName: 'Strategy Thinker',
    badgeDescription: 'Complete 20 Tic-Tac-Toe games',
    requirements: { type: 'special', value: 20, activityType: 'game_session' }
  },
  
  // Cross-Activity Achievements
  {
    badgeType: 'wellness_warrior',
    badgeName: 'Wellness Warrior',
    badgeDescription: 'Complete exercises in 3 different categories',
    requirements: { type: 'special', value: 3, activityType: 'mixed' }
  },
  {
    badgeType: 'consistency_champion',
    badgeName: 'Consistency Champion',
    badgeDescription: 'Maintain a 7-day streak across activities',
    requirements: { type: 'streak', value: 7, activityType: 'mixed' }
  },

  // Advanced Gamification Achievements
  {
    badgeType: 'early_bird',
    badgeName: 'Early Bird',
    badgeDescription: 'Log mood before 8 AM for 7 days',
    requirements: { type: 'time_pattern', value: 7, timeRange: 'morning' }
  },
  {
    badgeType: 'night_owl',
    badgeName: 'Night Owl',
    badgeDescription: 'Complete exercises after 10 PM for 5 days',
    requirements: { type: 'time_pattern', value: 5, timeRange: 'evening' }
  },
  {
    badgeType: 'weekend_warrior',
    badgeName: 'Weekend Warrior',
    badgeDescription: 'Maintain mood logging streak through weekends',
    requirements: { type: 'weekend_streak', value: 4, activityType: 'mood_log' }
  },
  {
    badgeType: 'mindfulness_maestro',
    badgeName: 'Mindfulness Maestro',
    badgeDescription: 'Complete 50 total mindfulness activities',
    requirements: { type: 'total_count', value: 50, activityTypes: ['breathing_exercise', 'meditation'] }
  },
  {
    badgeType: 'reflection_master',
    badgeName: 'Reflection Master',
    badgeDescription: 'Write 20 journal entries',
    requirements: { type: 'count', value: 20, activityType: 'journaling' }
  },
  {
    badgeType: 'gratitude_guru',
    badgeName: 'Gratitude Guru',
    badgeDescription: 'Complete 10 gratitude journal entries',
    requirements: { type: 'journal_type', value: 10, journalType: 'gratitude' }
  },
  {
    badgeType: 'thought_reframer',
    badgeName: 'Thought Reframer',
    badgeDescription: 'Complete 5 thought reframing exercises',
    requirements: { type: 'journal_type', value: 5, journalType: 'reframing' }
  },
  {
    badgeType: 'streak_survivor',
    badgeName: 'Streak Survivor',
    badgeDescription: 'Maintain any 14-day streak',
    requirements: { type: 'any_streak', value: 14, activityType: 'any' }
  },
  {
    badgeType: 'xp_collector',
    badgeName: 'XP Collector',
    badgeDescription: 'Earn 1000 total experience points',
    requirements: { type: 'total_xp', value: 1000, activityType: 'any' }
  },
  {
    badgeType: 'zen_master',
    badgeName: 'Zen Master',
    badgeDescription: 'Complete 100 total activities',
    requirements: { type: 'total_activities', value: 100, activityType: 'any' }
  },
  {
    badgeType: 'mood_analyst',
    badgeName: 'Mood Analyst',
    badgeDescription: 'Log mood for 60 days total',
    requirements: { type: 'total_count', value: 60, activityType: 'mood_log' }
  },
  {
    badgeType: 'game_legend',
    badgeName: 'Game Legend',
    badgeDescription: 'Achieve high scores in all games',
    requirements: { type: 'game_mastery_all', value: 1, gameType: 'all' }
  },
  {
    badgeType: 'balanced_life',
    badgeName: 'Balanced Life',
    badgeDescription: 'Use all app features in one week',
    requirements: { type: 'weekly_complete', value: 1, activityType: 'all' }
  },
  {
    badgeType: 'progress_tracker',
    badgeName: 'Progress Tracker',
    badgeDescription: 'View weekly reports for 4 consecutive weeks',
    requirements: { type: 'report_viewing', value: 4, activityType: 'weekly_report' }
  },
  {
    badgeType: 'dedication_demon',
    badgeName: 'Dedication Demon',
    badgeDescription: 'Use the app for 30 consecutive days',
    requirements: { type: 'app_usage', value: 30, activityType: 'any' }
  },
  {
    badgeType: 'explorer',
    badgeName: 'Explorer',
    badgeDescription: 'Try every type of exercise at least once',
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
  const existingBadgeTypes = existingAchievements.map((a: Achievement) => a.badgeType);
  
  for (const achievementDef of ACHIEVEMENT_DEFINITIONS) {
    // Check if already earned
    if (existingBadgeTypes.includes(achievementDef.badgeType)) continue;

    let earned = false;

    switch (achievementDef.requirements.type) {
      case 'count':
        const activityCompletions = completions.filter(c => c.activityType === achievementDef.requirements.activityType);
        earned = activityCompletions.length >= achievementDef.requirements.value;
        break;

      case 'streak':
        if (achievementDef.requirements.activityType === 'mood_log') {
          // Calculate mood streak from completions
          const moodCompletions = completions.filter(c => c.activityType === 'mood_log');
          earned = calculateStreak(moodCompletions) >= achievementDef.requirements.value;
        } else if (achievementDef.requirements.activityType === 'mixed') {
          // Calculate cross-activity streak
          earned = calculateCrossActivityStreak(completions) >= achievementDef.requirements.value;
        }
        break;

      case 'special':
        if (achievementDef.badgeType === 'sleep_ready') {
          // Check for 4-7-8 breathing at night
          const nightBreathing = completions.filter(c => 
            c.activityType === 'breathing_exercise' && 
            c.activityDetails?.exerciseId === '4-7-8' &&
            isNightTime(c.completedAt)
          );
          earned = nightBreathing.length >= achievementDef.requirements.value;
        } else if (achievementDef.badgeType === 'wellness_warrior') {
          // Check for exercises in 3 different categories
          const uniqueActivityTypes = new Set(completions.map(c => c.activityType));
          earned = uniqueActivityTypes.size >= achievementDef.requirements.value;
        } else if (achievementDef.badgeType === 'bubble_master') {
          // Check for bubble pop achievements
          const bubbleGames = completions.filter(c => 
            c.activityType === 'game_session' && 
            c.activityDetails?.exerciseId === 'bubble-pop'
          );
          const totalBubbles = bubbleGames.reduce((sum, game) => 
            sum + (game.activityDetails?.gameScore || 0) / 10, 0
          );
          earned = totalBubbles >= achievementDef.requirements.value;
        } else if (achievementDef.badgeType === 'breathing_sync_pro') {
          // Check for perfect breathing cycles
          const breathingGames = completions.filter(c => 
            c.activityType === 'game_session' && 
            c.activityDetails?.exerciseId === 'breathing-sync'
          );
          const perfectCycles = breathingGames.filter(game => 
            game.activityDetails?.notes?.includes('perfect') || 
            (game.activityDetails?.gameScore || 0) >= 500
          ).length;
          earned = perfectCycles >= achievementDef.requirements.value;
        } else if (achievementDef.badgeType === 'puzzle_solver') {
          // Check for completed puzzle levels
          const puzzleGames = completions.filter(c => 
            c.activityType === 'game_session' && 
            c.activityDetails?.exerciseId === 'soothing-puzzle'
          );
          const completedLevels = new Set(puzzleGames.map(game => game.activityDetails?.gameLevel)).size;
          earned = completedLevels >= achievementDef.requirements.value;
        } else if (achievementDef.badgeType === 'color_artist') {
          // Check for 100% accuracy in color harmony
          const colorGames = completions.filter(c => 
            c.activityType === 'game_session' && 
            c.activityDetails?.exerciseId === 'color-harmony'
          );
          const perfectGames = colorGames.filter(game => 
            game.activityDetails?.notes?.includes('100%') ||
            (game.activityDetails?.gameScore || 0) >= 1000
          ).length;
          earned = perfectGames >= 1; // At least one perfect game
        } else if (achievementDef.badgeType === 'game_marathon') {
          // Check for 30+ minute game sessions
          const longGames = completions.filter(c => 
            c.activityType === 'game_session' && 
            (c.activityDetails?.duration || 0) >= 30
          );
          earned = longGames.length >= 1;
        } else if (achievementDef.badgeType === 'tic_tac_toe_master') {
          // Check for Tic-Tac-Toe wins
          const ticTacToeGames = completions.filter(c => 
            c.activityType === 'game_session' && 
            c.activityDetails?.exerciseId === 'tic-tac-toe'
          );
          const wins = ticTacToeGames.filter(game => 
            game.activityDetails?.notes?.includes('Winner: X') ||
            game.activityDetails?.notes?.includes('You won!')
          ).length;
          earned = wins >= achievementDef.requirements.value;
        } else if (achievementDef.badgeType === 'robot_beater') {
          // Check for wins against robot
          const robotGames = completions.filter(c => 
            c.activityType === 'game_session' && 
            c.activityDetails?.exerciseId === 'tic-tac-toe' &&
            c.activityDetails?.notes?.includes('vs-robot')
          );
          const robotWins = robotGames.filter(game => 
            game.activityDetails?.notes?.includes('You won!')
          ).length;
          earned = robotWins >= achievementDef.requirements.value;
        } else if (achievementDef.badgeType === 'strategy_thinker') {
          // Check for total Tic-Tac-Toe games played
          const ticTacToeGames = completions.filter(c => 
            c.activityType === 'game_session' && 
            c.activityDetails?.exerciseId === 'tic-tac-toe'
          );
          earned = ticTacToeGames.length >= achievementDef.requirements.value;
        }
        break;
    }

    if (earned) {
      const newAchievement: Achievement = {
        id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        badgeType: achievementDef.badgeType,
        badgeName: achievementDef.badgeName,
        badgeDescription: achievementDef.badgeDescription,
        earnedAt: new Date().toISOString(),
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
    const date = new Date(completion.completedAt).toDateString();
    if (!dailyActivities.has(date)) {
      dailyActivities.set(date, new Set());
    }
    dailyActivities.get(date).add(completion.activityType);
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
    message: `${achievement.badgeName}: ${achievement.badgeDescription}`
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
