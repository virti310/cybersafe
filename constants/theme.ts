/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1F2937', // Gray 800
    background: '#F3F4F6', // Cool Gray 100
    tint: '#2563EB', // Blue 600
    icon: '#6B7280', // Gray 500
    tabIconDefault: '#9CA3AF', // Gray 400
    tabIconSelected: '#2563EB', // Blue 600
    primary: '#2563EB',
    secondary: '#1E40AF',
    card: '#FFFFFF',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    shadow: '#000000',
  },
  dark: {
    text: '#F9FAFB', // Gray 50
    background: '#111827', // Gray 900
    tint: '#60A5FA', // Blue 400
    icon: '#9CA3AF', // Gray 400
    tabIconDefault: '#6B7280', // Gray 500
    tabIconSelected: '#60A5FA', // Blue 400
    primary: '#60A5FA',
    secondary: '#3B82F6',
    card: '#1F2937',
    border: '#374151',
    error: '#F87171',
    success: '#34D399',
    shadow: '#000000',
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
