import { colorScheme as nwColorScheme } from 'nativewind';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, radius, spacing, type ThemeColors } from './palette';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedScheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  scheme: ResolvedScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const scheme: ResolvedScheme =
    mode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : mode;

  // Keep NativeWind's `dark:` variants in sync with our resolved scheme.
  useEffect(() => {
    nwColorScheme.set(mode);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((prev) => {
      if (prev === 'system') return systemScheme === 'dark' ? 'light' : 'dark';
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      scheme,
      colors: scheme === 'dark' ? darkColors : lightColors,
      spacing,
      radius,
      isDark: scheme === 'dark',
      setMode,
      toggle,
    }),
    [mode, scheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
