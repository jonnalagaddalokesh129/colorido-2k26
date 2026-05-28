import { Platform } from 'react-native';

export const Typography = {
  fontFamily: {
    sans: Platform.select({ ios: 'System', android: 'sans-serif' }),
    serif: Platform.select({ ios: 'Georgia', android: 'serif' }),
    mono: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 30,
    huge: 48,
  },
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  }
};
