import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { X, Trophy, Star, Heart, Zap } from 'lucide-react-native';
import { theme } from '../theme/theme';

interface NotificationBannerProps {
  visible: boolean;
  type: 'success' | 'achievement' | 'streak' | 'milestone' | 'celebration';
  title: string;
  message: string;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  visible,
  type,
  title,
  message,
  onDismiss,
  autoHide = true,
  duration = 7000
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        })
      ]).start();

      // Auto hide
      if (autoHide) {
        const timer = setTimeout(() => {
          hideBanner();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideBanner();
    }
  }, [visible]);

  const hideBanner = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      onDismiss();
    });
  };

  const getBannerStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.colors.success + '20',
          borderColor: theme.colors.success,
          icon: <Heart size={24} color={theme.colors.success} />,
        };
      case 'achievement':
        return {
          backgroundColor: theme.colors.warning + '20',
          borderColor: theme.colors.warning,
          icon: <Trophy size={24} color={theme.colors.warning} />,
        };
      case 'streak':
        return {
          backgroundColor: theme.colors.primary + '20',
          borderColor: theme.colors.primary,
          icon: <Zap size={24} color={theme.colors.primary} />,
        };
      case 'milestone':
        return {
          backgroundColor: theme.colors.info + '20',
          borderColor: theme.colors.info,
          icon: <Star size={24} color={theme.colors.info} />,
        };
      case 'celebration':
        return {
          backgroundColor: theme.colors.error + '20',
          borderColor: theme.colors.error,
          icon: <Trophy size={24} color={theme.colors.error} />,
        };
      default:
        return {
          backgroundColor: theme.colors.primary + '20',
          borderColor: theme.colors.primary,
          icon: <Heart size={24} color={theme.colors.primary} />,
        };
    }
  };

  const bannerStyle = getBannerStyle();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
          opacity: fadeAnim,
        }
      ]}
    >
      <View style={[styles.banner, bannerStyle]}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {bannerStyle.icon}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={hideBanner}>
            <X size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: theme.spacing.md,
  },
  banner: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    ...theme.shadows.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  message: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.caption + 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});
