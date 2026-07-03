import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Full-bleed error view with a retry affordance. */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load this content. Check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name="cloud-offline-outline" size={34} color={colors.textSecondary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.button, { backgroundColor: colors.accent }]}
          activeOpacity={0.85}
        >
          <Ionicons name="refresh" size={16} color={colors.accentText} />
          <Text style={[styles.buttonText, { color: colors.accentText }]}>Try again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

/** Neutral empty view for zero-result lists. */
export function EmptyState({
  title = 'Nothing here yet',
  message = 'When there’s something to show, it’ll appear here.',
  icon = 'film-outline',
}: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name={icon} size={34} color={colors.textSecondary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 48,
    gap: 10,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 999,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
