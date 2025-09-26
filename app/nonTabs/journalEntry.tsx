import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Save, Tag, Heart, Calendar, Lightbulb, BookOpen } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { saveJournalEntry, getJournalEntries, JournalEntry } from '../../utils/offlineStorage';

const moodOptions = [
  { id: 'happy', label: 'Happy', color: '#FF6B9D' },
  { id: 'calm', label: 'Calm', color: '#4CAF50' },
  { id: 'bored', label: 'Bored', color: '#9E9E9E' },
  { id: 'tired', label: 'Tired', color: '#4ECDC4' },
  { id: 'irritated', label: 'Irritated', color: '#FF9800' },
  { id: 'crying', label: 'Sad', color: '#9C27B0' },
  { id: 'angry', label: 'Angry', color: '#F44336' }
];

// Journaling Prompts
const journalingPrompts = {
  gratitude: [
    "What are three things you're grateful for today?",
    "Who made you smile today and why?",
    "What small moment brought you joy today?",
    "What's something positive that happened this week?",
    "What are you looking forward to tomorrow?",
    "What's a skill or quality you appreciate about yourself?",
    "What's something beautiful you noticed today?",
    "Who are you thankful to have in your life?",
    "What's a challenge that helped you grow?",
    "What made you feel proud today?"
  ],
  reflection: [
    "How are you feeling right now, and what might be causing that?",
    "What was the highlight of your day?",
    "What's been on your mind lately?",
    "What would you like to let go of today?",
    "What's something you learned about yourself recently?",
    "How have you grown or changed this month?",
    "What's a goal you're working towards?",
    "What's something you'd like to improve?",
    "What's bringing you stress right now?",
    "What's something you're excited about?"
  ],
  reframing: [
    "What's a negative thought you had today? Let's reframe it positively.",
    "What's something that didn't go as planned? What did you learn?",
    "What's a worry you have? What's the best-case scenario?",
    "What's something you're being too hard on yourself about?",
    "What's a setback that could actually be a setup for something better?",
    "What's a fear you have? How can you face it with courage?",
    "What's something you're comparing yourself to others about?",
    "What's a mistake you made? What did it teach you?",
    "What's something you can't control? What can you control instead?",
    "What's a limiting belief you have? What's the opposite truth?"
  ],
  freeform: [
    "Write about whatever is on your mind right now...",
    "Describe your day in detail...",
    "What's your current state of mind?",
    "Share your thoughts and feelings freely...",
    "What do you need to get off your chest?",
    "Write about your dreams and aspirations...",
    "What's something you want to remember about today?",
    "Express yourself without judgment...",
    "What's on your heart today?",
    "Let your thoughts flow onto the page..."
  ]
};

export default function JournalEntryScreen() {
  const { user } = useAuth();
  const { showAlert, showConfirm } = useAlert();
  const params = useLocalSearchParams();
  
  // State for entry data
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedPromptType, setSelectedPromptType] = useState<'gratitude' | 'reflection' | 'reframing' | 'freeform' | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  
  // Check if we're editing an existing entry
  const isExistingEntry = params.entryId && params.entryId !== '';
  const [showPrompts, setShowPrompts] = useState(!isExistingEntry && content === '');
  
  // Auto-save timer
  const autoSaveTimer = useRef<number | null>(null);
  const saveAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isExistingEntry) {
      loadExistingEntry();
    }
  }, [isExistingEntry]);

  useEffect(() => {
    // Set up auto-save timer
    if (hasUnsavedChanges) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      
      autoSaveTimer.current = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [title, content, selectedMood, tags, hasUnsavedChanges]);

  const loadExistingEntry = async () => {
    try {
      const entries = await getJournalEntries();
      const entry = entries.find(e => e.id === params.entryId);
      
      if (entry) {
        setTitle(entry.title);
        setContent(entry.content);
        setSelectedMood(entry.mood || '');
        setTags(entry.tags || []);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading existing entry:', error);
    }
  };

  const handlePromptSelect = (type: 'gratitude' | 'reflection' | 'reframing' | 'freeform') => {
    setSelectedPromptType(type);
    const prompts = journalingPrompts[type];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setSelectedPrompt(randomPrompt);
    setShowPrompts(false);
  };

  const handleNewPrompt = () => {
    if (selectedPromptType) {
      const prompts = journalingPrompts[selectedPromptType];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setSelectedPrompt(randomPrompt);
    }
  };

  const handleAutoSave = async () => {
    if (!title.trim() && !content.trim()) return;

    try {
      const entryData = {
        title: title.trim() || 'Untitled Entry',
        content: content.trim(),
        mood: selectedMood || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };

      if (isExistingEntry && params.entryId) {
        // Update existing entry
        const entries = await getJournalEntries();
        const existingEntry = entries.find(e => e.id === params.entryId);
        
        if (existingEntry) {
          const updatedEntry: JournalEntry = {
            ...existingEntry,
            ...entryData,
            updatedAt: new Date().toISOString(),
          };
          
          // Save updated entry
          await saveJournalEntry(updatedEntry);
        }
      } else {
        // Create new entry
        await saveJournalEntry(entryData);
      }

      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      // Show save animation
      Animated.sequence([
        Animated.timing(saveAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(saveAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (error) {
      console.error('Error auto-saving entry:', error);
    }
  };

  const handleManualSave = async () => {
    await handleAutoSave();
    
    // Show success message
    showAlert({
      type: 'success',
      title: 'Saved!',
      message: 'Your journal entry has been saved.'
    });
  };

  const handleContentChange = (text: string) => {
    setContent(text);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    setHasUnsavedChanges(true);
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(selectedMood === moodId ? '' : moodId);
    setHasUnsavedChanges(true);
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setHasUnsavedChanges(true);
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      showAlert({
        type: 'warning',
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Do you want to save before leaving?',
        buttons: [
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
          { text: 'Save', onPress: async () => {
            await handleAutoSave();
            router.back();
          }},
          { text: 'Cancel', style: 'cancel' }
        ]
      });
    } else {
      router.back();
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Saved just now';
    if (diffMins === 1) return 'Saved 1 minute ago';
    if (diffMins < 60) return `Saved ${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'Saved 1 hour ago';
    return `Saved ${diffHours} hours ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isExistingEntry ? 'Edit Entry' : 'New Entry'}
        </Text>
        <View style={styles.headerRight}>
          {!isExistingEntry && (
            <TouchableOpacity 
              style={styles.promptButton} 
              onPress={() => setShowPrompts(!showPrompts)}
            >
              <Lightbulb size={20} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.saveButton} onPress={handleManualSave}>
            <Save size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Status */}
      {lastSaved && (
        <Animated.View style={[styles.saveStatus, { opacity: saveAnimation }]}>
          <Text style={styles.saveStatusText}>{formatLastSaved()}</Text>
        </Animated.View>
      )}

      {showPrompts ? (
        // Prompt Selection Screen
        <ScrollView style={styles.promptContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.promptHeader}>
            <Lightbulb size={32} color={theme.colors.primary} />
            <Text style={styles.promptTitle}>Choose Your Writing Style</Text>
            <Text style={styles.promptSubtitle}>Select a prompt to get started, or write freely</Text>
          </View>

          <View style={styles.promptGrid}>
            <TouchableOpacity 
              style={[styles.promptCard, { backgroundColor: '#FFE5E5' }]}
              onPress={() => handlePromptSelect('gratitude')}
            >
              <Heart size={24} color="#FF6B9D" />
              <Text style={styles.promptCardTitle}>Gratitude</Text>
              <Text style={styles.promptCardDescription}>Focus on the positive and what you're thankful for</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.promptCard, { backgroundColor: '#E5F3FF' }]}
              onPress={() => handlePromptSelect('reflection')}
            >
              <BookOpen size={24} color="#4CAF50" />
              <Text style={styles.promptCardTitle}>Reflection</Text>
              <Text style={styles.promptCardDescription}>Explore your thoughts and experiences</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.promptCard, { backgroundColor: '#FFF3E5' }]}
              onPress={() => handlePromptSelect('reframing')}
            >
              <Lightbulb size={24} color="#FF9800" />
              <Text style={styles.promptCardTitle}>Reframing</Text>
              <Text style={styles.promptCardDescription}>Transform negative thoughts into positive ones</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.promptCard, { backgroundColor: '#F0E5FF' }]}
              onPress={() => handlePromptSelect('freeform')}
            >
              <BookOpen size={24} color="#9C27B0" />
              <Text style={styles.promptCardTitle}>Free Writing</Text>
              <Text style={styles.promptCardDescription}>Write about anything on your mind</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        // Writing Screen
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Entry title..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={title}
            onChangeText={handleTitleChange}
            multiline={false}
          />
        </View>

        {/* Mood Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={16} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>How are you feeling?</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodContainer}>
            {moodOptions.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodButton,
                  { backgroundColor: mood.color },
                  selectedMood === mood.id && styles.selectedMoodButton
                ]}
                onPress={() => handleMoodSelect(mood.id)}
              >
                <Text style={styles.moodText}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Tag size={16} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Tags</Text>
          </View>
          
          {/* Tag Input */}
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Tags List */}
          {tags.length > 0 && (
            <View style={styles.tagsList}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => handleRemoveTag(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Text style={styles.tagRemove}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Content Input - Full Screen */}
        <View style={styles.fullScreenContentSection}>
          {selectedPrompt && (
            <View style={styles.promptBanner}>
              <Text style={styles.promptBannerText}>{selectedPrompt}</Text>
              <TouchableOpacity onPress={handleNewPrompt} style={styles.newPromptButton}>
                <Text style={styles.newPromptText}>New Prompt</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TextInput
            style={styles.fullScreenContentInput}
            placeholder={selectedPrompt || "Write your thoughts here... This is your safe space to express yourself freely."}
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={content}
            onChangeText={handleContentChange}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        {/* Auto-save indicator */}
        {hasUnsavedChanges && (
          <View style={styles.autoSaveIndicator}>
            <Text style={styles.autoSaveText}>Auto-saving...</Text>
          </View>
        )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderRadius: theme.borderRadius.md,
  },
  saveButton: {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderRadius: theme.borderRadius.md,
  },
  saveStatus: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  saveStatusText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  titleInput: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'white',
  },
  moodContainer: {
    flexDirection: 'row',
  },
  moodButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMoodButton: {
    borderColor: 'white',
    transform: [{ scale: 1.05 }],
  },
  moodText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'white',
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: theme.typography.fontSize.body,
  },
  addTagButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: 'white',
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  tagText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.caption,
    marginRight: theme.spacing.xs,
  },
  tagRemove: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: theme.typography.fontSize.body,
    minHeight: 200,
    lineHeight: 24,
  },
  autoSaveIndicator: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  autoSaveText: {
    fontSize: theme.typography.fontSize.caption,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
  // Prompt Selection Styles
  promptContainer: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  promptHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  promptTitle: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  promptSubtitle: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  promptGrid: {
    gap: theme.spacing.lg,
  },
  promptCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  promptCardTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: '#1a1a2e',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  promptCardDescription: {
    fontSize: theme.typography.fontSize.body,
    color: '#1a1a2e',
    textAlign: 'center',
    opacity: 0.8,
  },
  // Full Screen Content Styles
  fullScreenContentSection: {
    flex: 1,
    marginBottom: theme.spacing.xl,
  },
  promptBanner: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  promptBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  promptBannerText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  newPromptButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  newPromptText: {
    fontSize: theme.typography.fontSize.caption,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  changePromptButton: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  changePromptText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  fullScreenContentInput: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 400,
    textAlignVertical: 'top',
  },
});
