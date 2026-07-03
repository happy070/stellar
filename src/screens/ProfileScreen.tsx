import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/StateViews';
import { useProfile } from '@/hooks/useContent';
import { useTheme, type ThemeMode } from '@/theme/ThemeProvider';
import type { UserProfile } from '@/types/content';

const MODES: { key: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

const SETTINGS: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string }[] = [
  { icon: 'download-outline', label: 'Downloads', value: '7 titles' },
  { icon: 'bookmark-outline', label: 'My Watchlist', value: '42 titles' },
  { icon: 'tv-outline', label: 'Manage Devices', value: '4 active' },
  { icon: 'language-outline', label: 'App Language', value: 'English' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'shield-checkmark-outline', label: 'Privacy & Security' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
];

export function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, status, refetch, isLoading } = useProfile();
  const [autoplay, setAutoplay] = React.useState(true);

  if (status === 'error') {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <ErrorState onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.fill, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Profile</Text>

      {/* Identity card */}
      {isLoading || !data ? (
        <ProfileHeaderSkeleton />
      ) : (
        <ProfileHeader profile={data} colors={colors} />
      )}

      {/* Appearance / theme engine */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>APPEARANCE</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.segment}>
          {MODES.map((m) => {
            const active = mode === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                onPress={() => setMode(m.key)}
                activeOpacity={0.8}
                style={[
                  styles.segmentItem,
                  { backgroundColor: active ? colors.accent : 'transparent' },
                ]}
              >
                <Ionicons
                  name={m.icon}
                  size={16}
                  color={active ? colors.accentText : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? colors.accentText : colors.textSecondary },
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={[styles.rowDivider, { borderColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <Ionicons name="play-forward-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Autoplay next</Text>
          </View>
          <Switch
            value={autoplay}
            onValueChange={setAutoplay}
            trackColor={{ true: colors.accent, false: colors.border }}
          />
        </View>
      </View>

      {/* Settings list */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCOUNT</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {SETTINGS.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            activeOpacity={0.7}
            style={[
              styles.settingRow,
              i < SETTINGS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
            ]}
          >
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
              <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{item.label}</Text>
            </View>
            <View style={styles.rowRight}>
              {item.value ? (
                <Text style={[styles.rowValue, { color: colors.textMuted }]}>{item.value}</Text>
              ) : null}
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.signOut, { borderColor: colors.border }]}
      >
        <Ionicons name="log-out-outline" size={20} color="#e5484d" />
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.textMuted }]}>Stellar+ · v1.0.0</Text>
    </ScrollView>
  );
}

function ProfileHeader({
  profile,
  colors,
}: {
  profile: UserProfile;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.header}>
      <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} transition={200} />
      <Text style={[styles.name, { color: colors.textPrimary }]}>{profile.name}</Text>
      <Text style={[styles.email, { color: colors.textMuted }]}>{profile.email}</Text>
      <View style={[styles.planBadge, { backgroundColor: colors.accent }]}>
        <Ionicons name="diamond-outline" size={12} color={colors.accentText} />
        <Text style={[styles.planText, { color: colors.accentText }]}>{profile.plan} member</Text>
      </View>
      <View style={styles.stats}>
        <Stat value={String(profile.watchlistCount)} label="Watchlist" colors={colors} />
        <Stat value={String(profile.downloadsCount)} label="Downloads" colors={colors} />
        <Stat value={String(profile.devices)} label="Devices" colors={colors} />
      </View>
    </View>
  );
}

function Stat({
  value,
  label,
  colors,
}: {
  value: string;
  label: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <View style={[styles.header, { gap: 10 }]}>
      <Skeleton width={88} height={88} radius={44} />
      <Skeleton width={140} height={20} />
      <Skeleton width={180} height={14} />
      <Skeleton width={130} height={24} radius={999} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(120,120,140,0.2)',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  email: {
    fontSize: 13,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 6,
  },
  planText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  segment: {
    flexDirection: 'row',
    padding: 6,
    gap: 6,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  rowDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 13,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  signOutText: {
    color: '#e5484d',
    fontSize: 15,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
  },
});
