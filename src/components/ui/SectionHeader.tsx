import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader = React.memo(function SectionHeader({
  title,
  onSeeAll,
}: SectionHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {onSeeAll ? (
        <TouchableOpacity onPress={onSeeAll} hitSlop={8}>
          <Text style={[styles.link, { color: colors.accent }]}>See all</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
  },
});
