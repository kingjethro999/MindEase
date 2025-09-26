import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// OFFLINE STORAGE UTILITIES FOR MINDEASE APP
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  ageRange?: string;
  primaryGoals?: string[];
  timezone?: string;
  languagePreference?: string;
  notificationPreferences?: {
    dailyReminder: boolean;
    affirmations: boolean;
    weeklyReports: boolean;
  };
  onboardingCompleted: boolean;
  premiumStatus: boolean;
  premiumExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  primaryMood: 'happy' | 'calm' | 'bored' | 'tired' | 'irritated' | 'crying' | 'angry';
  moodIntensity: number; // 1-5
  notes?: string;
  triggers?: string[];
  energyLevel?: 'low' | 'normal' | 'high';
  sleepQuality?: 'poor' | 'fair' | 'good';
  sleepHours?: number;
  createdAt: string;
  synced: boolean; // Whether this has been synced to cloud
}

export interface ExerciseCompletion {
  id: string;
  userId: string;
  activityType: 'mood_log' | 'breathing_exercise' | 'meditation' | 'journaling' | 'game_session' | 'sleep_tools';
  activityDetails: {
    exerciseId?: string;
    exerciseTitle?: string;
    exerciseType?: string;
    duration?: number;
    intensity?: number;
    notes?: string;
    gameScore?: number;
    gameLevel?: number;
    journalWordCount?: number;
    sleepToolType?: string;
    moodIntensity?: number;
    triggers?: string[];
  };
  completedAt: string;
  streakCount: number;
  synced: boolean; // Whether this has been synced to cloud
}

export interface UserProgress {
  totalExercises: number;
  breathingExercises: number;
  meditationExercises: number;
  journalingEntries: number;
  currentStreak: number;
  longestStreak: number;
  lastExerciseDate: string | null;
  totalMoodEntries: number;
  synced: boolean;
}

export interface UserAchievement {
  id: string;
  userId: string;
  badgeType: string; // 'mood_streak_7', 'calm_master', 'resilience_builder', etc.
  badgeName: string;
  badgeDescription: string;
  earnedAt: string;
  synced: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  synced: boolean;
}

// ============================================================================
// USER PROFILE STORAGE
// ============================================================================

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
    console.log('User profile saved to offline storage');
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profileData = await AsyncStorage.getItem('user_profile');
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
  try {
    const currentProfile = await getUserProfile();
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      await saveUserProfile(updatedProfile);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// ============================================================================
// MOOD ENTRIES STORAGE
// ============================================================================

export const saveMoodEntry = async (moodEntry: Omit<MoodEntry, 'id' | 'createdAt' | 'synced'>): Promise<void> => {
  try {
    const newEntry: MoodEntry = {
      ...moodEntry,
      id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      synced: false
    };

    const existingEntries = await getMoodEntries();
    const updatedEntries = [...existingEntries, newEntry];
    
    await AsyncStorage.setItem('mood_entries', JSON.stringify(updatedEntries));
    console.log('Mood entry saved to offline storage');
  } catch (error) {
    console.error('Error saving mood entry:', error);
    throw error;
  }
};

export const getMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    const entriesData = await AsyncStorage.getItem('mood_entries');
    return entriesData ? JSON.parse(entriesData) : [];
  } catch (error) {
    console.error('Error getting mood entries:', error);
    return [];
  }
};

export const getMoodEntryByDate = async (date: string): Promise<MoodEntry | null> => {
  try {
    const entries = await getMoodEntries();
    return entries.find(entry => entry.date === date) || null;
  } catch (error) {
    console.error('Error getting mood entry by date:', error);
    return null;
  }
};

// ============================================================================
// EXERCISE COMPLETIONS STORAGE
// ============================================================================

export const saveExerciseCompletion = async (completion: Omit<ExerciseCompletion, 'id' | 'synced'>): Promise<void> => {
  try {
    const newCompletion: ExerciseCompletion = {
      ...completion,
      id: `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      synced: false
    };

    const existingCompletions = await getExerciseCompletions();
    const updatedCompletions = [...existingCompletions, newCompletion];
    
    await AsyncStorage.setItem('exercise_completions', JSON.stringify(updatedCompletions));
    console.log('Exercise completion saved to offline storage');
  } catch (error) {
    console.error('Error saving exercise completion:', error);
    throw error;
  }
};

export const getExerciseCompletions = async (): Promise<ExerciseCompletion[]> => {
  try {
    const completionsData = await AsyncStorage.getItem('exercise_completions');
    return completionsData ? JSON.parse(completionsData) : [];
  } catch (error) {
    console.error('Error getting exercise completions:', error);
    return [];
  }
};

// ============================================================================
// USER PROGRESS STORAGE
// ============================================================================

export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const progressData = await AsyncStorage.getItem('user_progress');
    return progressData ? JSON.parse(progressData) : {
      totalExercises: 0,
      breathingExercises: 0,
      meditationExercises: 0,
      journalingEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastExerciseDate: null,
      totalMoodEntries: 0,
      synced: false
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return {
      totalExercises: 0,
      breathingExercises: 0,
      meditationExercises: 0,
      journalingEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastExerciseDate: null,
      totalMoodEntries: 0,
      synced: false
    };
  }
};

export const updateUserProgress = async (updates: Partial<UserProgress>): Promise<void> => {
  try {
    const currentProgress = await getUserProgress();
    const updatedProgress = {
      ...currentProgress,
      ...updates,
      synced: false // Mark as unsynced when updated
    };
    
    await AsyncStorage.setItem('user_progress', JSON.stringify(updatedProgress));
    console.log('User progress updated in offline storage');
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// ============================================================================
// ACHIEVEMENTS STORAGE
// ============================================================================

export const saveAchievement = async (achievement: Omit<UserAchievement, 'id' | 'synced'>): Promise<void> => {
  try {
    const newAchievement: UserAchievement = {
      ...achievement,
      id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      synced: false
    };

    const existingAchievements = await getAchievements();
    const updatedAchievements = [...existingAchievements, newAchievement];
    
    await AsyncStorage.setItem('user_achievements', JSON.stringify(updatedAchievements));
    console.log('Achievement saved to offline storage');
  } catch (error) {
    console.error('Error saving achievement:', error);
    throw error;
  }
};

export const getAchievements = async (): Promise<UserAchievement[]> => {
  try {
    const achievementsData = await AsyncStorage.getItem('user_achievements');
    return achievementsData ? JSON.parse(achievementsData) : [];
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

// ============================================================================
// JOURNAL ENTRIES STORAGE
// ============================================================================

export const saveJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'synced'> | JournalEntry): Promise<void> => {
  try {
    const existingEntries = await getJournalEntries();
    
    // Check if this is an update to an existing entry
    const isUpdate = 'id' in entry;
    
    let updatedEntries: JournalEntry[];
    
    if (isUpdate) {
      // Update existing entry
      const existingEntry = entry as JournalEntry;
      updatedEntries = existingEntries.map(e => 
        e.id === existingEntry.id ? existingEntry : e
      );
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        ...entry,
        id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        synced: false
      };
      updatedEntries = [...existingEntries, newEntry];
    }
    
    await AsyncStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
    console.log('Journal entry saved to offline storage');
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }
};

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const entriesData = await AsyncStorage.getItem('journal_entries');
    return entriesData ? JSON.parse(entriesData) : [];
  } catch (error) {
    console.error('Error getting journal entries:', error);
    return [];
  }
};

// ============================================================================
// SYNC STATUS MANAGEMENT
// ============================================================================

export const markDataAsSynced = async (dataType: 'profile' | 'mood' | 'exercises' | 'progress' | 'achievements' | 'journal'): Promise<void> => {
  try {
    switch (dataType) {
      case 'profile':
        const profile = await getUserProfile();
        if (profile) {
          await saveUserProfile({ ...profile, updatedAt: new Date().toISOString() });
        }
        break;
      case 'mood':
        const moodEntries = await getMoodEntries();
        const syncedMoodEntries = moodEntries.map(entry => ({ ...entry, synced: true }));
        await AsyncStorage.setItem('mood_entries', JSON.stringify(syncedMoodEntries));
        break;
      case 'exercises':
        const exerciseCompletions = await getExerciseCompletions();
        const syncedExerciseCompletions = exerciseCompletions.map(completion => ({ ...completion, synced: true }));
        await AsyncStorage.setItem('exercise_completions', JSON.stringify(syncedExerciseCompletions));
        break;
      case 'progress':
        const progress = await getUserProgress();
        await updateUserProgress({ ...progress, synced: true });
        break;
      case 'achievements':
        const achievements = await getAchievements();
        const syncedAchievements = achievements.map(achievement => ({ ...achievement, synced: true }));
        await AsyncStorage.setItem('user_achievements', JSON.stringify(syncedAchievements));
        break;
      case 'journal':
        const journalEntries = await getJournalEntries();
        const syncedJournalEntries = journalEntries.map(entry => ({ ...entry, synced: true }));
        await AsyncStorage.setItem('journal_entries', JSON.stringify(syncedJournalEntries));
        break;
    }
    console.log(`${dataType} data marked as synced`);
  } catch (error) {
    console.error(`Error marking ${dataType} data as synced:`, error);
    throw error;
  }
};

export const getUnsyncedData = async (): Promise<{
  hasUnsyncedProfile: boolean;
  hasUnsyncedMood: boolean;
  hasUnsyncedExercises: boolean;
  hasUnsyncedProgress: boolean;
  hasUnsyncedAchievements: boolean;
  hasUnsyncedJournal: boolean;
}> => {
  try {
    const [moodEntries, exerciseCompletions, progress, achievements, journalEntries] = await Promise.all([
      getMoodEntries(),
      getExerciseCompletions(),
      getUserProgress(),
      getAchievements(),
      getJournalEntries()
    ]);

    return {
      hasUnsyncedProfile: false, // Profile sync status handled differently
      hasUnsyncedMood: moodEntries.some(entry => !entry.synced),
      hasUnsyncedExercises: exerciseCompletions.some(completion => !completion.synced),
      hasUnsyncedProgress: !progress.synced,
      hasUnsyncedAchievements: achievements.some(achievement => !achievement.synced),
      hasUnsyncedJournal: journalEntries.some(entry => !entry.synced)
    };
  } catch (error) {
    console.error('Error getting unsynced data status:', error);
    return {
      hasUnsyncedProfile: false,
      hasUnsyncedMood: false,
      hasUnsyncedExercises: false,
      hasUnsyncedProgress: false,
      hasUnsyncedAchievements: false,
      hasUnsyncedJournal: false
    };
  }
};

// ============================================================================
// CLEAR ALL DATA (for logout/reset)
// ============================================================================

export const clearAllOfflineData = async (): Promise<void> => {
  try {
    const keys = [
      'user_profile',
      'mood_entries',
      'exercise_completions',
      'user_progress',
      'user_achievements',
      'journal_entries'
    ];
    
    await AsyncStorage.multiRemove(keys);
    console.log('All offline data cleared');
  } catch (error) {
    console.error('Error clearing offline data:', error);
    throw error;
  }
};
