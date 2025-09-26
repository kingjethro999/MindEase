import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export default function JournalingEntryScreen() {
  const [entries, setEntries] = useState(['', '', '']);

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Gratitude Journal</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {entries.map((entry, index) => (
          <View key={index} style={styles.entryContainer}>
            <Text style={styles.entryNumber}>{index + 1}.</Text>
            <TextInput
              style={styles.entryInput}
              placeholder={`Today I'm grateful for...`}
              placeholderTextColor={theme.colors.textSecondary}
              value={entry}
              onChangeText={(text) => {
                const newEntries = [...entries];
                newEntries[index] = text;
                setEntries(newEntries);
              }}
              multiline
            />
          </View>
        ))}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>Save Entry</Text>
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
  entryContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  entryNumber: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  entryInput: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    textAlignVertical: 'top',
    minHeight: 80,
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
});
