import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface ChipProps {
  label: string;
  tone?: 'default' | 'accent' | 'outline';
}

/** Small pill used for genres, tags and maturity ratings. */
export const Chip = React.memo(function Chip({ label, tone = 'default' }: ChipProps) {
  const { colors } = useTheme();

  const bg =
    tone === 'accent'
      ? colors.accent
      : tone === 'outline'
        ? 'transparent'
        : colors.surfaceElevated;
  const fg = tone === 'accent' ? colors.accentText : colors.textSecondary;
  const borderColor = tone === 'outline' ? colors.border : 'transparent';

  return (
    <View style={[styles.chip, { backgroundColor: bg, borderColor }]}>
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
