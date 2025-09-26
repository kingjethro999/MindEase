import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Save } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { saveMoodEntry, MoodEntry } from '../../utils/offlineStorage';

export default function DetailedMoodLogScreen() {
  const { user } = useAuth();
  const { showAlert, showConfirm } = useAlert();
  const params = useLocalSearchParams();
  
  // Get passed mood data from home screen
  const selectedMood = params.selectedMood as string;
  const moodLabel = params.moodLabel as string;
  const moodColor = params.moodColor as string;
  const moodImage = params.moodImage as any;

  const [notes, setNotes] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [moodIntensity, setMoodIntensity] = useState(3); // Default to middle intensity
  const [sleepHours, setSleepHours] = useState('');

  const triggers = ['work', 'family', 'relationships', 'health', 'money', 'sleep', 'other'];
  const energyLevels = ['low', 'normal', 'high'];
  const sleepQualities = ['poor', 'fair', 'good'];
  const intensityLevels = [1, 2, 3, 4, 5];

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSave = async () => {
    try {
      if (!selectedMood) {
        showAlert({
          type: 'error',
          title: 'Error',
          message: 'Please select a mood first'
        });
        return;
      }

      const userId = user?.id || 'anonymous_user';
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Create mood entry in database format
      const moodEntry: Omit<MoodEntry, 'id' | 'createdAt' | 'synced'> = {
        date: today,
        primaryMood: selectedMood as 'happy' | 'calm' | 'bored' | 'tired' | 'irritated' | 'crying' | 'angry',
        moodIntensity: moodIntensity,
        notes: notes.trim() || undefined,
        triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined,
        energyLevel: energyLevel as 'low' | 'normal' | 'high' | undefined,
        sleepQuality: sleepQuality as 'poor' | 'fair' | 'good' | undefined,
        sleepHours: sleepHours ? parseFloat(sleepHours) : undefined
      };

      // Save to offline storage
      await saveMoodEntry(moodEntry);
      
      showAlert({
        type: 'success',
        title: 'Success',
        message: 'Mood log saved successfully!',
        buttons: [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      });
      
    } catch (error) {
      console.error('Error saving mood entry:', error);
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to save mood log. Please try again.'
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Detailed Mood Log</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selected Mood Display */}
        {selectedMood && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Mood</Text>
            <View style={[styles.moodDisplay, { backgroundColor: moodColor }]}>
              <Image source={moodImage} style={styles.moodDisplayImage} />
              <Text style={styles.moodDisplayLabel}>{moodLabel}</Text>
            </View>
          </View>
        )}

        {/* Mood Intensity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Intensity</Text>
          <View style={styles.intensityContainer}>
            {intensityLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.intensityButton,
                  moodIntensity === level && styles.intensityButtonSelected
                ]}
                onPress={() => setMoodIntensity(level)}
              >
                <Text style={[
                  styles.intensityText,
                  moodIntensity === level && styles.intensityTextSelected
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.intensityLabel}>
            {moodIntensity === 1 && 'Very Low'}
            {moodIntensity === 2 && 'Low'}
            {moodIntensity === 3 && 'Moderate'}
            {moodIntensity === 4 && 'High'}
            {moodIntensity === 5 && 'Very High'}
          </Text>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.textInput}
            placeholder="How are you feeling? What's on your mind?"
            placeholderTextColor={theme.colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Triggers Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Triggers</Text>
          <View style={styles.tagContainer}>
            {triggers.map((trigger) => (
              <TouchableOpacity
                key={trigger}
                style={[
                  styles.tag,
                  selectedTriggers.includes(trigger) && styles.tagSelected
                ]}
                onPress={() => toggleTrigger(trigger)}
              >
                <Text style={[
                  styles.tagText,
                  selectedTriggers.includes(trigger) && styles.tagTextSelected
                ]}>
                  {trigger.charAt(0).toUpperCase() + trigger.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Energy Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Energy Level</Text>
          <View style={styles.optionContainer}>
            {energyLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.optionButton,
                  energyLevel === level && styles.optionButtonSelected
                ]}
                onPress={() => setEnergyLevel(level)}
              >
                <Text style={[
                  styles.optionText,
                  energyLevel === level && styles.optionTextSelected
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sleep Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Quality</Text>
          <View style={styles.optionContainer}>
            {sleepQualities.map((quality) => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.optionButton,
                  sleepQuality === quality && styles.optionButtonSelected
                ]}
                onPress={() => setSleepQuality(quality)}
              >
                <Text style={[
                  styles.optionText,
                  sleepQuality === quality && styles.optionTextSelected
                ]}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sleep Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Hours (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 7.5"
            placeholderTextColor={theme.colors.textSecondary}
            value={sleepHours}
            onChangeText={setSleepHours}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>Save Log</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  textInput: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    textAlignVertical: 'top',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tagText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  tagTextSelected: {
    color: 'white',
  },
  optionContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  optionButton: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  optionTextSelected: {
    color: 'white',
  },
  saveContainer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  saveButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginLeft: theme.spacing.sm,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  moodDisplayImage: {
    width: 40,
    height: 40,
    marginRight: theme.spacing.md,
  },
  moodDisplayLabel: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  intensityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  intensityButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  intensityText: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
  },
  intensityTextSelected: {
    color: 'white',
  },
  intensityLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
