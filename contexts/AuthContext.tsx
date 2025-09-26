import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../constants/supabase';
import { saveUserProfile, getUserProfile, UserProfile, clearAllOfflineData } from '../utils/offlineStorage';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Save user profile to offline storage if logged in
      if (session?.user) {
        await saveUserProfileToOffline(session.user);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Save user profile to offline storage if logged in
      if (session?.user) {
        await saveUserProfileToOffline(session.user);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveUserProfileToOffline = async (user: User) => {
    try {
      // First, try to fetch the complete profile from the database
      try {
        const { data: dbProfile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (dbProfile && !error) {
          // Save the complete profile from database to offline storage
          const offlineProfile: UserProfile = {
            id: dbProfile.id,
            email: dbProfile.email,
            displayName: dbProfile.display_name,
            ageRange: dbProfile.age_range,
            primaryGoals: dbProfile.primary_goals,
            timezone: dbProfile.timezone,
            languagePreference: dbProfile.language_preference,
            notificationPreferences: typeof dbProfile.notification_preferences === 'string' 
              ? JSON.parse(dbProfile.notification_preferences) 
              : dbProfile.notification_preferences,
            onboardingCompleted: dbProfile.onboarding_completed,
            premiumStatus: dbProfile.premium_status,
            premiumExpiresAt: dbProfile.premium_expires_at,
            createdAt: dbProfile.created_at,
            updatedAt: dbProfile.updated_at
          };

          await saveUserProfile(offlineProfile);
          console.log('Complete user profile saved to offline storage from database');
          return;
        }
      } catch (dbError) {
        console.log('Could not fetch profile from database, using fallback:', dbError);
      }

      // Fallback: Check if profile already exists in offline storage
      const existingProfile = await getUserProfile();
      
      if (!existingProfile || existingProfile.id !== user.id) {
        // Create new profile for offline storage with basic info
        const offlineProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          displayName: user.user_metadata?.full_name || user.user_metadata?.display_name || '',
          ageRange: existingProfile?.ageRange,
          primaryGoals: existingProfile?.primaryGoals,
          timezone: existingProfile?.timezone || 'UTC',
          languagePreference: existingProfile?.languagePreference || 'en',
          notificationPreferences: existingProfile?.notificationPreferences || {
            dailyReminder: true,
            affirmations: true,
            weeklyReports: true
          },
          onboardingCompleted: existingProfile?.onboardingCompleted || false,
          premiumStatus: existingProfile?.premiumStatus || false,
          premiumExpiresAt: existingProfile?.premiumExpiresAt,
          createdAt: user.created_at,
          updatedAt: new Date().toISOString()
        };
        
        await saveUserProfile(offlineProfile);
        console.log('Basic user profile saved to offline storage');
      }
    } catch (error) {
      console.error('Error saving user profile to offline storage:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      // Clear all offline data
      await clearAllOfflineData();
      
      // Clear additional AsyncStorage items
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.multiRemove([
        'onboarding_completed',
        'user_goals', 
        'notification_permission',
        'pending_user_profile'
      ]);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
