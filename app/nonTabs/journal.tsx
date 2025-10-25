import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, BookOpen, Plus, Search, Edit3, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/theme/theme';
import { useAlert } from '@/contexts/AlertContext';

const { width } = Dimensions.get('window');

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: keyof typeof theme.colors.mood;
  date: string;
  createdAt: number;
  updatedAt: number;
}

const JOURNAL_STORAGE_KEY = '@journal_entries';
const AUTO_SAVE_DELAY = 2000; // 2 seconds

const Journal: React.FC = () => {
  const { showAlert, showConfirm } = useAlert();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<keyof typeof theme.colors.mood | undefined>();

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  // Load entries from AsyncStorage
  const loadEntries = useCallback(async () => {
    try {
      const storedEntries = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        setEntries(parsedEntries.sort((a: JournalEntry, b: JournalEntry) => b.updatedAt - a.updatedAt));
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load journal entries'
      });
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // Save entries to AsyncStorage
  const saveEntries = useCallback(async (entriesToSave: JournalEntry[]) => {
    try {
      setSaving(true);
      await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entriesToSave));
    } catch (error) {
      console.error('Error saving journal entries:', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to save journal entries'
      });
    } finally {
      setSaving(false);
    }
  }, [showAlert]);

  // Auto-save function with debouncing
  const autoSave = useCallback((entry: JournalEntry) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      const updatedEntries = entries.map(e => e.id === entry.id ? entry : e);
      if (!entries.find(e => e.id === entry.id)) {
        updatedEntries.unshift(entry);
      }
      
      setEntries(updatedEntries);
      saveEntries(updatedEntries);
    }, AUTO_SAVE_DELAY) as unknown as NodeJS.Timeout;
  }, [entries, saveEntries]);

  // Create new entry
  const createNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: '',
      content: '',
      mood: selectedMood,
      date: new Date().toLocaleDateString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentEntry(newEntry);
    setIsEditing(true);
    setTimeout(() => titleInputRef.current?.focus(), 100);
  };

  // Select entry for viewing/editing
  const selectEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setIsEditing(false);
  };

  // Start editing current entry
  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => titleInputRef.current?.focus(), 100);
  };

  // Update current entry and trigger auto-save
  const updateCurrentEntry = (updates: Partial<JournalEntry>) => {
    if (!currentEntry) return;

    const updatedEntry = {
      ...currentEntry,
      ...updates,
      updatedAt: Date.now(),
    };

    setCurrentEntry(updatedEntry);
    autoSave(updatedEntry);
  };

  // Delete entry
  const deleteEntry = (entryId: string) => {
    showConfirm(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      () => {
        const updatedEntries = entries.filter(e => e.id !== entryId);
        setEntries(updatedEntries);
        saveEntries(updatedEntries);
        if (currentEntry?.id === entryId) {
          setCurrentEntry(null);
          setIsEditing(false);
        }
      },
      undefined,
      'Delete',
      'Cancel'
    );
  };

  // Filter entries based on search and mood
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  // Get mood emoji
  const getMoodEmoji = (mood?: keyof typeof theme.colors.mood) => {
    const moodEmojis = {
      happy: '😊',
      calm: '😌',
      neutral: '😐',
      anxious: '😰',
      sad: '😢',
      irritable: '😤',
      tired: '😴',
    };
    return mood ? moodEmojis[mood] : '';
  };

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your journal...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {!currentEntry ? (
          // Journal List View
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <BookOpen size={24} color={theme.colors.primary} />
                <Text style={styles.headerTitle}>My Journal</Text>
              </View>
              <TouchableOpacity style={styles.newEntryButton} onPress={createNewEntry}>
                <Plus size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>

              {/* Search and Filter */}
              <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <Search size={20} color={theme.colors.textLight} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={theme.colors.textLight}
                  />
                </View>
              </View>

          {/* Mood Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodFilter}>
            <TouchableOpacity
              style={[styles.moodButton, !selectedMood && styles.moodButtonActive]}
              onPress={() => setSelectedMood(undefined)}
            >
              <Text style={[styles.moodButtonText, !selectedMood && styles.moodButtonTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {Object.keys(theme.colors.mood).map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodButton,
                  { backgroundColor: theme.colors.mood[mood as keyof typeof theme.colors.mood] + '20' },
                  selectedMood === mood && styles.moodButtonActive
                ]}
                onPress={() => setSelectedMood(mood as keyof typeof theme.colors.mood)}
              >
                <Text style={styles.moodButtonEmoji}>{getMoodEmoji(mood as keyof typeof theme.colors.mood)}</Text>
                <Text style={[
                  styles.moodButtonText,
                  selectedMood === mood && styles.moodButtonTextActive
                ]}>
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Entries List */}
          <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
            {filteredEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery || selectedMood ? 'No entries found' : 'No journal entries yet'}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery || selectedMood ? 'Try adjusting your filters' : 'Start writing your first entry!'}
                </Text>
              </View>
            ) : (
              filteredEntries.map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  style={styles.entryCard}
                  onPress={() => selectEntry(entry)}
                >
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>
                      {entry.title || 'Untitled Entry'}
                    </Text>
                    {entry.mood && (
                      <View style={[styles.moodIndicator, { backgroundColor: theme.colors.mood[entry.mood] + '20' }]}>
                        <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.entryPreview} numberOfLines={2}>
                    {entry.content || 'No content'}
                  </Text>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                </TouchableOpacity>
              ))
              )}
            </ScrollView>
            </View>
          </>
        ) : (
          // Entry Detail/Edit View
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  setCurrentEntry(null);
                  setIsEditing(false);
                }}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <BookOpen size={24} color={theme.colors.primary} />
                <Text style={styles.headerTitle}>
                  {isEditing ? 'Edit Entry' : 'Journal Entry'}
                </Text>
              </View>
              <View style={styles.detailActions}>
                {saving && <ActivityIndicator size="small" color={theme.colors.primary} />}
                {!isEditing ? (
                  <>
                    <TouchableOpacity onPress={startEditing} style={styles.actionButtonContainer}>
                      <Edit3 size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteEntry(currentEntry.id)} style={styles.actionButtonContainer}>
                      <Trash2 size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.actionButtonContainer}>
                    <Text style={styles.actionButton}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.detailContainer}>

          <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <TextInput
              ref={titleInputRef}
              style={[styles.titleInput, !isEditing && styles.titleInputReadonly]}
              value={currentEntry.title}
              onChangeText={(text) => updateCurrentEntry({ title: text })}
              placeholder="Entry title..."
              editable={isEditing}
              multiline
              placeholderTextColor={theme.colors.textLight}
            />

            {/* Mood Selector */}
            {isEditing && (
              <View style={styles.moodSelector}>
                <Text style={styles.moodSelectorLabel}>How are you feeling?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {Object.keys(theme.colors.mood).map((mood) => (
                    <TouchableOpacity
                      key={mood}
                      style={[
                        styles.moodSelectorButton,
                        { backgroundColor: theme.colors.mood[mood as keyof typeof theme.colors.mood] + '20' },
                        currentEntry.mood === mood && styles.moodSelectorButtonActive
                      ]}
                      onPress={() => updateCurrentEntry({ mood: mood as keyof typeof theme.colors.mood })}
                    >
                      <Text style={styles.moodSelectorEmoji}>
                        {getMoodEmoji(mood as keyof typeof theme.colors.mood)}
                      </Text>
                      <Text style={styles.moodSelectorText}>{mood}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Content */}
            <TextInput
              ref={contentInputRef}
              style={[styles.contentInput, !isEditing && styles.contentInputReadonly]}
              value={currentEntry.content}
              onChangeText={(text) => updateCurrentEntry({ content: text })}
              placeholder="Start writing your thoughts..."
              editable={isEditing}
              multiline
              textAlignVertical="top"
              placeholderTextColor={theme.colors.textLight}
            />

            {/* Date and Mood Display (Read Mode) */}
            {!isEditing && (
              <View style={styles.entryMeta}>
                <Text style={styles.entryMetaText}>Created: {currentEntry.date}</Text>
                {currentEntry.mood && (
                  <View style={styles.entryMetaMood}>
                    <Text style={styles.moodEmoji}>{getMoodEmoji(currentEntry.mood)}</Text>
                    <Text style={styles.entryMetaText}>{currentEntry.mood}</Text>
                  </View>
                )}
              </View>
            )}
            </ScrollView>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  } as TextStyle,
  newEntryButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },

  // List View
  listContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },

  // Search
  searchContainer: {
    marginBottom: theme.spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    padding: 0,
  } as TextStyle,

  // Mood Filter
  moodFilter: {
    marginBottom: theme.spacing.lg,
    maxHeight: 50,
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    height: 40,
  },
  moodButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  moodButtonEmoji: {
    marginRight: theme.spacing.xs,
    fontSize: 16,
  },
  moodButtonText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  moodButtonTextActive: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.medium as any,
  } as TextStyle,

  // Entries List
  entriesList: {
    flex: 1,
  },
  entryCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  entryTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
  } as TextStyle,
  moodIndicator: {
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  moodEmoji: {
    fontSize: 16,
  },
  entryPreview: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.body,
    marginBottom: theme.spacing.sm,
  },
  entryDate: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textLight,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textLight,
    textAlign: 'center',
  },

  // Detail View
  detailContainer: {
    flex: 1,
  },
  detailActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actionButtonContainer: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  actionButton: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  } as TextStyle,

  detailContent: {
    flex: 1,
    padding: theme.spacing.md,
  },

  // Inputs
  titleInput: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    padding: 0,
    minHeight: 60,
  } as TextStyle,
  titleInputReadonly: {
    backgroundColor: 'transparent',
  },

  contentInput: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.body,
    minHeight: 400,
    padding: 0,
  },
  contentInputReadonly: {
    backgroundColor: 'transparent',
  },

  // Mood Selector
  moodSelector: {
    marginBottom: theme.spacing.lg,
  },
  moodSelectorLabel: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  moodSelectorButton: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
    minWidth: 70,
  },
  moodSelectorButtonActive: {
    backgroundColor: theme.colors.primary + '40',
  },
  moodSelectorEmoji: {
    fontSize: 20,
    marginBottom: theme.spacing.xs,
  },
  moodSelectorText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },

  // Entry Meta
  entryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  entryMetaText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textLight,
  },
  entryMetaMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
});

export default Journal;