import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { DetailScreen } from '@/screens/DetailScreen';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors, isDark } = useTheme();

  // Feed our palette into React Navigation so container backgrounds,
  // header tints and the transition scenes all match the active theme.
  const navTheme = useMemo<Theme>(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
      },
    };
  }, [colors, isDark]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
