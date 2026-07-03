import 'react-native-gesture-handler';
import './global.css';

import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  type MD3Theme,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

/**
 * Bridges our design tokens into React Native Paper so any Paper component
 * (used for form controls / dialogs) inherits the active light/dark palette.
 */
function ThemedApp() {
  const { colors, isDark } = useTheme();

  const paperTheme = useMemo<MD3Theme>(() => {
    const base = isDark ? MD3DarkTheme : MD3LightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.background,
        surface: colors.surface,
        onSurface: colors.textPrimary,
        onBackground: colors.textPrimary,
      },
    };
  }, [colors, isDark]);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
