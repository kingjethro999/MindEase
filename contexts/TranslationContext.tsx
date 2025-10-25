import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTranslation, TranslationKeys } from '../utils/translations';

interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => Promise<void>;
  t: (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');
  const [isRTL, setIsRTL] = useState<boolean>(false);

  // RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  useEffect(() => {
    setIsRTL(rtlLanguages.includes(language));
  }, [language]);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('user_language');
      if (savedLanguage) {
        setLanguageState(savedLanguage);
      } else {
        // Try to get language from user profile
        try {
          const { getUserProfile } = await import('../utils/offlineStorage');
          const profile = await getUserProfile();
          if (profile?.language_preference) {
            setLanguageState(profile.language_preference);
          }
        } catch (error) {
          console.log('Could not load language from profile:', error);
        }
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const setLanguage = async (newLanguage: string) => {
    try {
      setLanguageState(newLanguage);
      await AsyncStorage.setItem('user_language', newLanguage);
      
      // Update user profile if available
      try {
        const { getUserProfile, saveUserProfile } = await import('../utils/offlineStorage');
        const profile = await getUserProfile();
        if (profile) {
          const updatedProfile = {
            ...profile,
            language_preference: newLanguage,
          };
          await saveUserProfile(updatedProfile);
        }
      } catch (error) {
        console.log('Could not update language in profile:', error);
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key: keyof TranslationKeys, params?: Record<string, string | number>): string => {
    return getTranslation(key, language, params);
  };

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export default TranslationContext;
