import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Play, Timer } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export default function SleepToolsScreen() {
  const [selectedSound, setSelectedSound] = useState('');
  const [selectedTimer, setSelectedTimer] = useState('');

  const sounds = [
    { id: 'rain', name: 'Rain', emoji: '🌧' },
    { id: 'ocean', name: 'Ocean', emoji: '🌊' },
    { id: 'fireplace', name: 'Fireplace', emoji: '🔥' },
    { id: 'forest', name: 'Forest', emoji: '🌲' },
  ];

  const timers = ['30m', '1h', 'Until Morning'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Sleep Tools</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Sound Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relaxing Sounds</Text>
          <View style={styles.soundsContainer}>
            {sounds.map((sound) => (
              <TouchableOpacity
                key={sound.id}
                style={[
                  styles.soundButton,
                  selectedSound === sound.id && styles.soundButtonSelected
                ]}
                onPress={() => setSelectedSound(sound.id)}
              >
                <Text style={styles.soundEmoji}>{sound.emoji}</Text>
                <Text style={styles.soundName}>{sound.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Timer Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timer</Text>
          <View style={styles.timerContainer}>
            {timers.map((timer) => (
              <TouchableOpacity
                key={timer}
                style={[
                  styles.timerButton,
                  selectedTimer === timer && styles.timerButtonSelected
                ]}
                onPress={() => setSelectedTimer(timer)}
              >
                <Timer size={20} color={selectedTimer === timer ? 'white' : theme.colors.text} />
                <Text style={[
                  styles.timerText,
                  selectedTimer === timer && styles.timerTextSelected
                ]}>
                  {timer}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bedtime Meditation */}
        <TouchableOpacity 
          style={styles.meditationButton}
          onPress={() => router.push('/nonTabs/exerciseDetails')}
        >
          <Play size={20} color="white" />
          <Text style={styles.meditationButtonText}>Bedtime Meditation ▶</Text>
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
  soundsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  soundButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 80,
  },
  soundButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  soundEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  soundName: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  timerContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  timerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timerButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timerText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium as any,
    marginLeft: theme.spacing.sm,
  },
  timerTextSelected: {
    color: 'white',
  },
  meditationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  meditationButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
    marginLeft: theme.spacing.sm,
  },
});
