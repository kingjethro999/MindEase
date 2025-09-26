import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Brain, Home, Play, Smile, Zap } from 'lucide-react-native';
import React from 'react';
import { theme } from '@/theme/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <StatusBar style="dark" />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Zap size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: 'Play',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Play size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Brain size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}