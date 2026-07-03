/**
 * Semantic color tokens. Components reference these names (e.g. `colors.textPrimary`)
 * rather than raw hex, so light/dark stays consistent and a single edit re-skins
 * the whole app. Mirrors the Tailwind tokens in tailwind.config.js.
 */
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentText: string;
  skeletonBase: string;
  skeletonHighlight: string;
  /** Overlay gradient stops used over hero/backdrop artwork. */
  scrim: string;
}

export const darkColors: ThemeColors = {
  background: '#05060f',
  surface: '#0e1122',
  surfaceElevated: '#171a33',
  border: '#242847',
  textPrimary: '#f5f6ff',
  textSecondary: '#b7bad4',
  textMuted: '#7c80a3',
  accent: '#4f7cff',
  accentText: '#ffffff',
  skeletonBase: '#171a33',
  skeletonHighlight: '#242a52',
  scrim: 'rgba(5,6,15,0.85)',
};

export const lightColors: ThemeColors = {
  background: '#f6f7fb',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  border: '#e4e7f1',
  textPrimary: '#111327',
  textSecondary: '#4a4e69',
  textMuted: '#8b8fa8',
  accent: '#2f5fe0',
  accentText: '#ffffff',
  skeletonBase: '#e7e9f2',
  skeletonHighlight: '#f2f3fa',
  scrim: 'rgba(246,247,251,0.82)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;
