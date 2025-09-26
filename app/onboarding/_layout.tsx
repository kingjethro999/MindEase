import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="consent" options={{ headerShown: false }} />
      <Stack.Screen name="notification-opt-in" options={{ headerShown: false }} />
    </Stack>
  );
}
