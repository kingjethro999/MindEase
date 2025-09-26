import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  illustration: any;
  gradient: string[];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Track Your Mood Daily',
    subtitle: 'Understanding starts with awareness',
    description: 'Log your emotions with simple taps and discover patterns that help you understand your mental wellness journey.',
    illustration: require('@/assets/images/image.png'),
    gradient: theme.colors.gradients.breathingBlue,
  },
  {
    id: '2',
    title: 'Practice Mindfulness',
    subtitle: 'Find peace in the present moment',
    description: 'Access guided breathing exercises, meditation sessions, and grounding techniques whenever you need to center yourself.',
    illustration: require('@/assets/images/Mindfulness-pana.png'),
    gradient: theme.colors.gradients.relaxationGreen,
  },
  {
    id: '3',
    title: 'Build Healthy Habits',
    subtitle: 'Small steps, lasting change',
    description: 'Get personalized insights, gentle reminders, and evidence-based tools to support your mental health every day.',
    illustration: require('@/assets/images/Mindfulness-bro.png'),
    gradient: theme.colors.gradients.sleepPurple,
  },
];

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      router.push('/onboarding/consent');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/consent');
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <LinearGradient
      colors={item.gradient as any}
      style={styles.slide}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.slideContent}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={item.illustration}
            style={styles.illustration as any}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {renderDots()}
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: theme.spacing.md,
    zIndex: 10,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  skipButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  slide: {
    width,
    flex: 1,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  illustrationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  illustration: {
    width: width * 0.9,
    height: height * 0.4,
  },
  textContainer: {
    flex: 0.4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
  },
  slideTitle: {
    fontSize: theme.typography.fontSize.h1 + 4,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  slideSubtitle: {
    fontSize: theme.typography.fontSize.h3,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  slideDescription: {
    fontSize: theme.typography.fontSize.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.body,
    paddingHorizontal: theme.spacing.sm,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  dot: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
    marginHorizontal: theme.spacing.xs,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
});

export default OnboardingScreen;