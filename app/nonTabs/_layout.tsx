import { Stack } from 'expo-router';
import React from 'react';

export default function NonTabsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="detailedMoodLog" 
        options={{ 
          headerShown: false,
          title: "Mood Log",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="weeklyReport" 
        options={{ 
          headerShown: false,
          title: "Weekly Report",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="exerciseDetails" 
        options={{ 
          headerShown: false,
          title: "Exercise Details",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="journal" 
        options={{ 
          headerShown: false,
          title: "My Journal",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="sleepTools" 
        options={{ 
          headerShown: false,
          title: "Sleep Tools",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="gameSession" 
        options={{ 
          headerShown: false,
          title: "Game Session",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="bubblePopGame" 
        options={{ 
          headerShown: false,
          title: "Bubble Pop Calm",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="breathingSyncGame" 
        options={{ 
          headerShown: false,
          title: "Breathing Sync",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="soothingPuzzleGame" 
        options={{ 
          headerShown: false,
          title: "Soothing Puzzle",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="colorHarmonyGame" 
        options={{ 
          headerShown: false,
          title: "Color Harmony",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="ticTacToeGame" 
        options={{ 
          headerShown: false,
          title: "Tic-Tac-Toe",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="moduleDetail" 
        options={{ 
          headerShown: false,
          title: "Module Details",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          headerShown: false,
          title: "Settings",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="premium" 
        options={{ 
          headerShown: false,
          title: "Premium",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="motivations" 
        options={{ 
          headerShown: false,
          title: "Motivations",
          presentation: "modal"
        }} 
      />
    </Stack>
  );
}
