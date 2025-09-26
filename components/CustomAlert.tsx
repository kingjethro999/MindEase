// components/CustomAlert.tsx
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    BackHandler,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttons?: AlertButton[];
  onClose?: () => void;
  showCloseButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = 'info',
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
  showCloseButton = true,
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close if enabled
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, autoClose, autoCloseDelay]);

  // Handle back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        handleClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible]);

  const handleClose = () => {
    onClose?.();
  };

  const handleButtonPress = (button: AlertButton) => {
    button.onPress?.();
    if (button.style !== 'cancel') {
      handleClose();
    }
  };

  const getIcon = () => {
    const iconProps = { size: 32, color: 'white' };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'error':
        return <AlertCircle {...iconProps} />;
      case 'warning':
        return <AlertTriangle {...iconProps} />;
      case 'info':
      default:
        return <Info {...iconProps} />;
    }
  };

  const getTypeColors = () => {
    switch (type) {
      case 'success':
        return {
          primary: theme.colors.success,
          background: theme.colors.success + '20',
          text: theme.colors.success,
        };
      case 'error':
        return {
          primary: theme.colors.error,
          background: theme.colors.error + '20',
          text: theme.colors.error,
        };
      case 'warning':
        return {
          primary: theme.colors.warning,
          background: theme.colors.warning + '20',
          text: theme.colors.warning,
        };
      case 'info':
      default:
        return {
          primary: theme.colors.primary,
          background: theme.colors.primary + '20',
          text: theme.colors.primary,
        };
    }
  };

  const colors = getTypeColors();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: fadeAnim }
        ]}
      >
        <View style={styles.blurView}>
          <Animated.View
            style={[
              styles.alertContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              }
            ]}
          >
            {/* Header with Icon */}
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              {getIcon()}
            </View>

            {/* Content */}
            <View style={styles.content}>
              {title && (
                <Text style={[styles.title, { color: colors.text }]}>
                  {title}
                </Text>
              )}
              
              <Text style={styles.message}>
                {message}
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      { backgroundColor: button.style === 'destructive' ? theme.colors.error : colors.primary },
                      button.style === 'cancel' && styles.cancelButton,
                      buttons.length === 1 && styles.singleButton,
                    ]}
                    onPress={() => handleButtonPress(button)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        button.style === 'destructive' && styles.destructiveButtonText,
                        button.style === 'cancel' && styles.cancelButtonText,
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Close Button */}
            {showCloseButton && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <X size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  alertContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.xl,
    maxWidth: width * 0.9,
    minWidth: width * 0.7,
    ...theme.shadows.lg,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.h2,
    fontWeight: theme.typography.fontWeight.bold as any,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.body,
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleButton: {
    maxWidth: 200,
    alignSelf: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: 'white',
  },
  destructiveButtonText: {
    color: 'white',
  },
  cancelButtonText: {
    color: theme.colors.text,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomAlert;
