import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Primary brand colors from PRD
    primary: '#673AB7',      // Purple - calm, soothing
    secondary: '#4CAF50',    // Green - growth, balance
    accent: '#FF9800',       // Orange - positivity
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundLight: '#F1F3F4',
    surfaceLight: '#F8F6FF',    // Very light purple
    surfaceGreen: '#F1F8E9',    // Very light green
    surfaceOrange: '#FFF8E1',   // Very light orange
    
    // Text colors
    text: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    
    // UI colors
    border: '#E0E0E0',
    shadow: '#00000020',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Mood colors for tracking
    mood: {
      happy: '#4CAF50',
      calm: '#2196F3',
      neutral: '#9E9E9E',
      anxious: '#FF9800',
      sad: '#F44336',
      irritable: '#FF5722',
      tired: '#795548',
    },
    
    // Subtle accent colors for cards (no gradients)
    accents: {
      breathingBlue: '#E3F2FD',
      sleepPurple: '#F3E5F5', 
      relaxationGreen: '#E8F5E8',
      gameOrange: '#FFF3E0',
      moodTracker: '#F8F6FF',
    },
    
    // Gradient colors for visual elements
    gradients: {
      breathingBlue: ['#2196F3', '#64B5F6'],
      sleepPurple: ['#673AB7', '#9C27B0'],
      relaxationGreen: ['#4CAF50', '#66BB6A'],
      gameOrange: ['#FF9800', '#FFB74D'],
      primary: ['#673AB7', '#9C27B0'],
    },
  },
  
  typography: {
    // Font families
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    
    // Font sizes from PRD
    fontSize: {
      h1: 24,
      h2: 20,
      h3: 18,
      body: 16,
      caption: 13,
      small: 12,
    },
    
    // Line heights
    lineHeight: {
      h1: 32,
      h2: 28,
      h3: 24,
      body: 22,
      caption: 18,
      small: 16,
    },
    
    // Font weights
    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 16,    // From PRD - rounded cards 16px radius
    lg: 24,
    full: 999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  layout: {
    container: {
      paddingHorizontal: 16,
    },
    card: {
      padding: 16,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
    },
  },
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});