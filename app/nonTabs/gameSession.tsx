import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export default function GameSessionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Bubble Pop Calm</Text>
        <TouchableOpacity style={styles.exitButton}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        <Text style={styles.gameInstructions}>tap bubbles!</Text>
        <View style={styles.bubblesContainer}>
          <TouchableOpacity style={styles.bubble} />
          <TouchableOpacity style={styles.bubble} />
          <TouchableOpacity style={styles.bubble} />
        </View>
      </View>

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>250</Text>
      </View>

      {/* Exit Game Button */}
      <View style={styles.exitContainer}>
        <TouchableOpacity 
          style={styles.exitGameButton}
          onPress={() => router.back()}
        >
          <Text style={styles.exitGameButtonText}>Exit Game</Text>
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
  exitButton: {
    padding: theme.spacing.sm,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  gameInstructions: {
    fontSize: theme.typography.fontSize.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  bubblesContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary + '40',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  scoreContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  scoreLabel: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  scoreValue: {
    fontSize: theme.typography.fontSize.h1,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary,
  },
  exitContainer: {
    padding: theme.spacing.lg,
  },
  exitGameButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  exitGameButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold as any,
  },
});
