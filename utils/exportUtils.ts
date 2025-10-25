import { getMoodEntries, getExerciseCompletions, getJournalEntries, getUserProfile, getUserProgress, getAchievements } from './offlineStorage';
import { MoodEntry, ExerciseCompletion, JournalEntry, UserProfile, UserProgress } from './offlineStorage';
import { Achievement } from './gamification';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface ExportData {
  userProfile: UserProfile | null;
  moodEntries: MoodEntry[];
  exerciseCompletions: ExerciseCompletion[];
  journalEntries: JournalEntry[];
  userProgress: UserProgress | null;
  achievements: Achievement[];
  exportDate: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export const generateExportData = async (): Promise<ExportData> => {
  try {
    const [userProfile, moodEntries, exerciseCompletions, journalEntries, userProgress, achievements] = await Promise.all([
      getUserProfile(),
      getMoodEntries(),
      getExerciseCompletions(),
      getJournalEntries(),
      getUserProgress(),
      getAchievements()
    ]);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      userProfile,
      moodEntries: moodEntries.filter(entry => new Date(entry.date) >= thirtyDaysAgo),
      exerciseCompletions: exerciseCompletions.filter(completion => new Date(completion.completed_at) >= thirtyDaysAgo),
      journalEntries: journalEntries.filter(entry => new Date(entry.createdAt) >= thirtyDaysAgo),
      userProgress,
      achievements,
      exportDate: now.toISOString(),
      dateRange: {
        start: thirtyDaysAgo.toISOString(),
        end: now.toISOString()
      }
    };
  } catch (error) {
    console.error('Error generating export data:', error);
    throw error;
  }
};

export const generateTextReport = (data: ExportData): string => {
  const { userProfile, moodEntries, exerciseCompletions, journalEntries, userProgress, achievements, dateRange } = data;
  
  let report = '';
  
  // Header
  report += '='.repeat(60) + '\n';
  report += 'MIND EASE - WELLNESS REPORT\n';
  report += '='.repeat(60) + '\n\n';
  
  // User Info
  if (userProfile) {
    report += `User: ${userProfile.display_name || 'Anonymous'}\n`;
    report += `Email: ${userProfile.email}\n`;
    report += `Report Period: ${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}\n`;
    report += `Generated: ${new Date(data.exportDate).toLocaleString()}\n\n`;
  }
  
  // Mood Summary
  report += 'MOOD TRACKING SUMMARY\n';
  report += '-'.repeat(30) + '\n';
  report += `Total Mood Entries: ${moodEntries.length}\n`;
  
  if (moodEntries.length > 0) {
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.primary_mood] = (acc[entry.primary_mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    report += '\nMood Distribution:\n';
    Object.entries(moodCounts).forEach(([mood, count]) => {
      const percentage = ((count / moodEntries.length) * 100).toFixed(1);
      report += `  ${mood}: ${count} (${percentage}%)\n`;
    });
    
    const avgIntensity = moodEntries.reduce((sum, entry) => sum + entry.mood_intensity, 0) / moodEntries.length;
    report += `\nAverage Mood Intensity: ${avgIntensity.toFixed(1)}/5\n`;
  }
  
  // Exercise Summary
  report += '\n\nEXERCISE & ACTIVITY SUMMARY\n';
  report += '-'.repeat(30) + '\n';
  report += `Total Activities: ${exerciseCompletions.length}\n`;
  
  if (exerciseCompletions.length > 0) {
    const activityCounts = exerciseCompletions.reduce((acc, completion) => {
      acc[completion.activity_type] = (acc[completion.activity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    report += '\nActivity Types:\n';
    Object.entries(activityCounts).forEach(([type, count]) => {
      report += `  ${type}: ${count}\n`;
    });
    
    const totalDuration = exerciseCompletions.reduce((sum, completion) => 
      sum + (completion.activity_details.duration || 0), 0);
    report += `\nTotal Activity Time: ${Math.round(totalDuration / 60)} minutes\n`;
  }
  
  // Journal Summary
  report += '\n\nJOURNAL SUMMARY\n';
  report += '-'.repeat(30) + '\n';
  report += `Total Journal Entries: ${journalEntries.length}\n`;
  
  if (journalEntries.length > 0) {
    const totalWords = journalEntries.reduce((sum, entry) => 
      sum + (entry.content.split(' ').length), 0);
    report += `Total Words Written: ${totalWords}\n`;
    report += `Average Words per Entry: ${Math.round(totalWords / journalEntries.length)}\n`;
  }
  
  // Progress Summary
  if (userProgress) {
    // Calculate total experience points from exercise completions
    const totalExperiencePoints = exerciseCompletions.reduce((sum, completion) => {
      const duration = completion.activity_details.duration || 0;
      let xp = 0;
      switch (completion.activity_type) {
        case 'breathing_exercise':
          xp = Math.max(10, Math.floor(duration / 60) * 5);
          break;
        case 'meditation':
          xp = Math.max(15, Math.floor(duration / 60) * 8);
          break;
        case 'journaling':
          xp = 20;
          break;
        case 'game_session':
          xp = Math.max(5, Math.floor(duration / 60) * 3);
          break;
        default:
          xp = 10;
      }
      return sum + xp;
    }, 0);

    // Calculate user level (every 100 XP = 1 level)
    const userLevel = Math.floor(totalExperiencePoints / 100) + 1;

    report += '\n\nPROGRESS SUMMARY\n';
    report += '-'.repeat(30) + '\n';
    report += `Current Streak: ${userProgress.currentStreak} days\n`;
    report += `Total Exercises: ${userProgress.totalExercises}\n`;
    report += `Total Experience Points: ${totalExperiencePoints}\n`;
    report += `User Level: ${userLevel}\n`;
    report += `Total Mood Entries: ${userProgress.totalMoodEntries}\n`;
    report += `Longest Streak: ${userProgress.longestStreak} days\n`;
  }
  
  // Achievements
  report += '\n\nACHIEVEMENTS\n';
  report += '-'.repeat(30) + '\n';
  report += `Total Badges Earned: ${achievements.length}\n\n`;
  
  if (achievements.length > 0) {
    achievements.forEach((achievement, index) => {
      report += `${index + 1}. ${achievement.badge_name}\n`;
      report += `   ${achievement.badge_description}\n`;
      report += `   Earned: ${new Date(achievement.earned_at).toLocaleDateString()}\n\n`;
    });
  }
  
  // Recent Mood Entries
  if (moodEntries.length > 0) {
    report += '\n\nRECENT MOOD ENTRIES\n';
    report += '-'.repeat(30) + '\n';
    
    const recentEntries = moodEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    
    recentEntries.forEach(entry => {
      report += `${new Date(entry.date).toLocaleDateString()}: ${entry.primary_mood} (${entry.mood_intensity}/5)\n`;
      if (entry.notes) {
        report += `  Notes: ${entry.notes}\n`;
      }
      if (entry.triggers && entry.triggers.length > 0) {
        report += `  Triggers: ${entry.triggers.join(', ')}\n`;
      }
      report += '\n';
    });
  }
  
  // Recent Journal Entries
  if (journalEntries.length > 0) {
    report += '\n\nRECENT JOURNAL ENTRIES\n';
    report += '-'.repeat(30) + '\n';
    
    const recentJournals = journalEntries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    recentJournals.forEach(entry => {
      report += `${new Date(entry.createdAt).toLocaleDateString()}: ${entry.title || 'Untitled'}\n`;
      const preview = entry.content.length > 100 ? entry.content.substring(0, 100) + '...' : entry.content;
      report += `  ${preview}\n\n`;
    });
  }
  
  report += '\n' + '='.repeat(60) + '\n';
  report += 'End of Report\n';
  report += '='.repeat(60) + '\n';
  
  return report;
};

export const generateCSVData = (data: ExportData): string => {
  const { moodEntries, exerciseCompletions, journalEntries } = data;
  
  let csv = '';
  
  // Mood Entries CSV
  csv += 'MOOD ENTRIES\n';
  csv += 'Date,Primary Mood,Intensity,Notes,Triggers,Energy Level,Sleep Quality,Sleep Hours\n';
  
  moodEntries.forEach(entry => {
    csv += `"${entry.date}","${entry.primary_mood}","${entry.mood_intensity}","${entry.notes || ''}","${entry.triggers?.join(';') || ''}","${entry.energy_level || ''}","${entry.sleep_quality || ''}","${entry.sleep_hours || ''}"\n`;
  });
  
  csv += '\n\nEXERCISE COMPLETIONS\n';
  csv += 'Date,Activity Type,Exercise Title,Duration,Score,Notes\n';
  
  exerciseCompletions.forEach(completion => {
    csv += `"${completion.completed_at}","${completion.activity_type}","${completion.activity_details.exerciseTitle || ''}","${completion.activity_details.duration || 0}","${completion.activity_details.gameScore || 0}","${completion.activity_details.notes || ''}"\n`;
  });
  
  csv += '\n\nJOURNAL ENTRIES\n';
  csv += 'Date,Title,Content,Mood,Tags\n';
  
  journalEntries.forEach(entry => {
    csv += `"${entry.createdAt}","${entry.title || ''}","${entry.content.replace(/"/g, '""')}","${entry.mood || ''}","${entry.tags?.join(';') || ''}"\n`;
  });
  
  return csv;
};

export const saveAndShareData = async (data: ExportData, format: 'text' | 'csv' = 'text'): Promise<string> => {
  try {
    const content = format === 'text' ? generateTextReport(data) : generateCSVData(data);
    const filename = `mind-ease-report-${new Date().toISOString().split('T')[0]}.${format === 'text' ? 'txt' : 'csv'}`;
    
    // Get the cache directory and create file
    const directory = (FileSystem as any).cacheDirectory as string | null;
    if (!directory) {
      throw new Error('Cache directory not available');
    }
    const fileUri = directory + filename;
    
    // Write content to the file
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: 'utf8',
    });
    console.log('Report saved to:', fileUri);
    console.log('Content length:', content.length);
    
    return fileUri;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

export const shareData = async (data: ExportData, format: 'text' | 'csv' = 'text'): Promise<void> => {
  try {
    const fileUri = await saveAndShareData(data, format);
    
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }
    
    // Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType: format === 'text' ? 'text/plain' : 'text/csv',
      dialogTitle: 'Share your Mind Ease wellness report',
    });
    
  } catch (error) {
    console.error('Error sharing data:', error);
    throw error;
  }
};

export const saveDataToDevice = async (data: ExportData, format: 'text' | 'csv' = 'text'): Promise<string> => {
  try {
    const fileUri = await saveAndShareData(data, format);
    
    // Return the file path for user reference
    return fileUri;
  } catch (error) {
    console.error('Error saving data to device:', error);
    throw error;
  }
};
