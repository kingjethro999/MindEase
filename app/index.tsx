import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme/theme';
import { onboardingUtils } from '@/utils/onboarding';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const isCompleted = await onboardingUtils.isOnboardingCompleted();
        
        if (!isCompleted) {
          setShouldShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to showing onboarding if there's an error
        setShouldShowOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      checkOnboardingStatus();
    }
  }, [authLoading]);

  // Show loading spinner while checking onboarding status and auth
  if (isLoading || authLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.background 
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // If user is authenticated and onboarding is complete, go to main app
  if (user && !shouldShowOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  // If user is not authenticated and onboarding is complete, go to auth
  if (!user && !shouldShowOnboarding) {
    return <Redirect href="/auth" />;
  }

  // Show onboarding for new users
  return <Redirect href="/onboarding" />;
}
