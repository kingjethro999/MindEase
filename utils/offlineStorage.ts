import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// OFFLINE STORAGE UTILITIES FOR MINDEASE APP
// ============================================================================

export interface UserProfile {
  id: string;
  username?: string;
  email: string;
  display_name?: string;
  age_range?: '18-25' | '26-35' | '36-45' | '46-55' | '55+';
  primary_goals?: string[]; // ['reduce_anxiety', 'better_sleep', 'manage_depression', 'stress_relief']
  timezone?: string;
  language_preference?: string;
  notification_preferences?: {
    daily_reminder: boolean;
    affirmations: boolean;
    weekly_reports: boolean;
  };
  onboarding_completed: boolean;
  premium_status: boolean;
  premium_expires_at?: string;
  created_at: string;
  updated_at: string;
  synced: boolean;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  primary_mood: 'happy' | 'calm' | 'neutral' | 'anxious' | 'sad' | 'irritable' | 'tired';
  mood_intensity: number; // 1-5
  notes?: string;
  triggers?: string[]; // ['work', 'family', 'relationships', 'health', 'money', 'sleep', 'other']
  energy_level?: 'low' | 'normal' | 'high';
  sleep_quality?: 'poor' | 'fair' | 'good';
  sleep_hours?: number;
  created_at: string;
  synced: boolean; // Whether this has been synced to cloud
}

export interface ExerciseCompletion {
  id: string;
  user_id: string;
  activity_type: 'mood_log' | 'breathing_exercise' | 'meditation' | 'journaling' | 'game_session' | 'sleep_tools';
  activity_details: {
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
  completed_at: string;
  streak_count: number;
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
  user_id: string;
  badge_type: string; // 'mood_streak_7', 'calm_master', 'resilience_builder', etc.
  badge_name: string;
  badge_description: string;
  earned_at: string;
  synced: boolean; // Whether this has been synced to cloud
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

export interface AppSettings {
  darkMode: boolean;
  cloudBackup: boolean;
  dataSharing: boolean;
  autoSync: boolean;
}

// ============================================================================
// APP SETTINGS STORAGE
// ============================================================================

export const saveAppSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
    console.log('App settings saved to offline storage');
  } catch (error) {
    console.error('Error saving app settings:', error);
    throw error;
  }
};

export const getAppSettings = async (): Promise<AppSettings> => {
  try {
    const settingsData = await AsyncStorage.getItem('app_settings');
    if (settingsData) {
      return JSON.parse(settingsData);
    }
    // Return default settings if none exist
    return {
      darkMode: false,
      cloudBackup: false,
      dataSharing: false,
      autoSync: false,
    };
  } catch (error) {
    console.error('Error getting app settings:', error);
    // Return default settings on error
    return {
      darkMode: false,
      cloudBackup: false,
      dataSharing: false,
      autoSync: false,
    };
  }
};

export const updateAppSettings = async (updates: Partial<AppSettings>): Promise<void> => {
  try {
    const currentSettings = await getAppSettings();
    const updatedSettings = {
      ...currentSettings,
      ...updates,
    };
    await saveAppSettings(updatedSettings);
  } catch (error) {
    console.error('Error updating app settings:', error);
    throw error;
  }
};

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

export const saveMoodEntry = async (moodEntry: Omit<MoodEntry, 'id' | 'created_at' | 'synced'>): Promise<void> => {
  try {
    const newEntry: MoodEntry = {
      ...moodEntry,
      id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
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
    
    // Update user stats after saving completion
    try {
      const { updateUserStatsFromCompletions } = await import('./gamification');
      await updateUserStatsFromCompletions();
    } catch (statsError) {
      console.error('Error updating user stats after completion:', statsError);
      // Don't throw here as the completion was saved successfully
    }
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
          await saveUserProfile({ ...profile, updated_at: new Date().toISOString() });
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
      'journal_entries',
      'app_settings'
    ];
    
    await AsyncStorage.multiRemove(keys);
    console.log('All offline data cleared');
  } catch (error) {
    console.error('Error clearing offline data:', error);
    throw error;
  }
};

// ============================================================================
// DATABASE SYNC FUNCTIONS
// ============================================================================

export const syncToDatabase = async (): Promise<{
  success: boolean;
  syncedItems: {
    profiles: number;
    moodEntries: number;
    completions: number;
    achievements: number;
  };
  errors: string[];
}> => {
  const result = {
    success: true,
    syncedItems: {
      profiles: 0,
      moodEntries: 0,
      completions: 0,
      achievements: 0
    },
    errors: [] as string[]
  };

  try {
    // Import Supabase client
    const { supabase } = await import('../constants/supabase');
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Sync user profile
    try {
      const profile = await getUserProfile();
      if (profile && !profile.synced) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            username: profile.username,
            email: profile.email,
            display_name: profile.display_name,
            age_range: profile.age_range,
            primary_goals: profile.primary_goals,
            timezone: profile.timezone,
            language_preference: profile.language_preference,
            notification_preferences: profile.notification_preferences,
            onboarding_completed: profile.onboarding_completed,
            premium_status: profile.premium_status,
            premium_expires_at: profile.premium_expires_at,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        result.syncedItems.profiles = 1;
      }
    } catch (error) {
      result.errors.push(`Profile sync error: ${error}`);
    }

    // Sync mood entries
    try {
      const moodEntries = await getMoodEntries();
      const unsyncedEntries = moodEntries.filter(entry => !entry.synced);
      
      if (unsyncedEntries.length > 0) {
        const entriesToSync = unsyncedEntries.map(entry => ({
          user_id: user.id,
          date: entry.date,
          primary_mood: entry.primary_mood,
          mood_intensity: entry.mood_intensity,
          notes: entry.notes,
          triggers: entry.triggers,
          energy_level: entry.energy_level,
          sleep_quality: entry.sleep_quality,
          sleep_hours: entry.sleep_hours,
          created_at: entry.created_at
        }));

        const { error } = await supabase
          .from('mood_entries_backup')
          .upsert(entriesToSync, { onConflict: 'user_id,date' });
        
        if (error) throw error;
        result.syncedItems.moodEntries = unsyncedEntries.length;
      }
    } catch (error) {
      result.errors.push(`Mood entries sync error: ${error}`);
    }

    // Sync exercise completions
    try {
      const completions = await getExerciseCompletions();
      const unsyncedCompletions = completions.filter(completion => !completion.synced);
      
      if (unsyncedCompletions.length > 0) {
        const completionsToSync = unsyncedCompletions.map(completion => ({
          user_id: user.id,
          activity_type: completion.activity_type,
          activity_details: completion.activity_details,
          completed_at: completion.completed_at,
          streak_count: completion.streak_count
        }));

        const { error } = await supabase
          .from('user_progress_backup')
          .insert(completionsToSync);
        
        if (error) throw error;
        result.syncedItems.completions = unsyncedCompletions.length;
      }
    } catch (error) {
      result.errors.push(`Completions sync error: ${error}`);
    }

    // Sync achievements
    try {
      const achievements = await getAchievements();
      const unsyncedAchievements = achievements.filter(achievement => !achievement.synced);
      
      if (unsyncedAchievements.length > 0) {
        const achievementsToSync = unsyncedAchievements.map(achievement => ({
          user_id: user.id,
          badge_type: achievement.badge_type,
          badge_name: achievement.badge_name,
          badge_description: achievement.badge_description,
          earned_at: achievement.earned_at
        }));

        const { error } = await supabase
          .from('user_achievements')
          .upsert(achievementsToSync, { onConflict: 'user_id,badge_type' });
        
        if (error) throw error;
        result.syncedItems.achievements = unsyncedAchievements.length;
      }
    } catch (error) {
      result.errors.push(`Achievements sync error: ${error}`);
    }

    // Mark all synced items as synced
    if (result.errors.length === 0) {
      await markDataAsSynced('profile');
      await markDataAsSynced('mood');
      await markDataAsSynced('exercises');
      await markDataAsSynced('achievements');
    }

  } catch (error) {
    result.success = false;
    result.errors.push(`General sync error: ${error}`);
  }

  return result;
};

export const syncFromDatabase = async (): Promise<{
  success: boolean;
  syncedItems: {
    profiles: number;
    moodEntries: number;
    completions: number;
    achievements: number;
  };
  errors: string[];
}> => {
  const result = {
    success: true,
    syncedItems: {
      profiles: 0,
      moodEntries: 0,
      completions: 0,
      achievements: 0
    },
    errors: [] as string[]
  };

  try {
    // Import Supabase client
    const { supabase } = await import('../constants/supabase');
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Sync user profile from database
    try {
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      if (profileData) {
        const profile: UserProfile = {
          id: profileData.id,
          username: profileData.username,
          email: profileData.email,
          display_name: profileData.display_name,
          age_range: profileData.age_range,
          primary_goals: profileData.primary_goals,
          timezone: profileData.timezone,
          language_preference: profileData.language_preference,
          notification_preferences: profileData.notification_preferences,
          onboarding_completed: profileData.onboarding_completed,
          premium_status: profileData.premium_status,
          premium_expires_at: profileData.premium_expires_at,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at,
          synced: true
        };
        
        await saveUserProfile(profile);
        result.syncedItems.profiles = 1;
      }
    } catch (error) {
      result.errors.push(`Profile sync error: ${error}`);
    }

    // Sync mood entries from database
    try {
      const { data: moodData, error } = await supabase
        .from('mood_entries_backup')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (moodData && moodData.length > 0) {
        const moodEntries: MoodEntry[] = moodData.map(entry => ({
          id: entry.id,
          user_id: entry.user_id,
          date: entry.date,
          primary_mood: entry.primary_mood,
          mood_intensity: entry.mood_intensity,
          notes: entry.notes,
          triggers: entry.triggers,
          energy_level: entry.energy_level,
          sleep_quality: entry.sleep_quality,
          sleep_hours: entry.sleep_hours,
          created_at: entry.created_at,
          synced: true
        }));
        
        await AsyncStorage.setItem('mood_entries', JSON.stringify(moodEntries));
        result.syncedItems.moodEntries = moodEntries.length;
      }
    } catch (error) {
      result.errors.push(`Mood entries sync error: ${error}`);
    }

    // Sync exercise completions from database
    try {
      const { data: completionsData, error } = await supabase
        .from('user_progress_backup')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      
      if (completionsData && completionsData.length > 0) {
        const completions: ExerciseCompletion[] = completionsData.map(completion => ({
          id: completion.id,
          user_id: completion.user_id,
          activity_type: completion.activity_type,
          activity_details: completion.activity_details,
          completed_at: completion.completed_at,
          streak_count: completion.streak_count,
          synced: true
        }));
        
        await AsyncStorage.setItem('exercise_completions', JSON.stringify(completions));
        result.syncedItems.completions = completions.length;
      }
    } catch (error) {
      result.errors.push(`Completions sync error: ${error}`);
    }

    // Sync achievements from database
    try {
      const { data: achievementsData, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });
      
      if (error) throw error;
      
      if (achievementsData && achievementsData.length > 0) {
        const achievements: UserAchievement[] = achievementsData.map(achievement => ({
          id: achievement.id,
          user_id: achievement.user_id,
          badge_type: achievement.badge_type,
          badge_name: achievement.badge_name,
          badge_description: achievement.badge_description,
          earned_at: achievement.earned_at,
          synced: true
        }));
        
        await AsyncStorage.setItem('user_achievements', JSON.stringify(achievements));
        result.syncedItems.achievements = achievements.length;
      }
    } catch (error) {
      result.errors.push(`Achievements sync error: ${error}`);
    }

  } catch (error) {
    result.success = false;
    result.errors.push(`General sync error: ${error}`);
  }

  return result;
};
