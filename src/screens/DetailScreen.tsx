import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContentRow } from '@/components/media/ContentRow';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DetailSkeleton } from '@/components/ui/Skeletons';
import { ErrorState } from '@/components/ui/StateViews';
import { useRelated, useTitle } from '@/hooks/useContent';
import { useTheme } from '@/theme/ThemeProvider';
import type { RootStackScreenProps } from '@/navigation/types';
import type { Title } from '@/types/content';
import { genreLine, metaLine } from '@/utils/format';

const { width: SCREEN_W } = Dimensions.get('window');
const BACKDROP_HEIGHT = Math.round(SCREEN_W * 0.68);
const BLUR_HASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export function DetailScreen({ route, navigation }: RootStackScreenProps<'Detail'>) {
  const { id, name } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: title, status, refetch } = useTitle(id);
  const { data: related } = useRelated(id);
  const [inWatchlist, setInWatchlist] = useState(false);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  // Solid header bar fades in as the backdrop scrolls away.
  const headerBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [BACKDROP_HEIGHT - 120, BACKDROP_HEIGHT - 60],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // Parallax + fade on the backdrop image.
  const backdropStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-150, 0, BACKDROP_HEIGHT],
          [-75, 0, BACKDROP_HEIGHT * 0.5],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(scrollY.value, [-150, 0], [1.25, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  const goToDetail = useCallback(
    (t: Title) => navigation.push('Detail', { id: t.id, name: t.name }),
    [navigation],
  );

  if (status === 'loading' || status === 'idle') {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <BackButton onPress={navigation.goBack} top={insets.top} />
        <DetailSkeleton />
      </View>
    );
  }

  if (status === 'error' || !title) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <BackButton onPress={navigation.goBack} top={insets.top} />
        <ErrorState
          title="Couldn’t load this title"
          message={name ? `We couldn’t reach “${name}”. Please try again.` : undefined}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
      {/* Animated sticky header */}
      <Animated.View
        style={[
          styles.headerBar,
          { paddingTop: insets.top, backgroundColor: colors.surface, borderColor: colors.border },
          headerBarStyle,
        ]}
      >
        <Text numberOfLines={1} style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {title.name}
        </Text>
      </Animated.View>
      <BackButton onPress={navigation.goBack} top={insets.top} />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Parallax backdrop */}
        <View style={styles.backdropWrap}>
          <Animated.View style={[styles.backdropInner, backdropStyle]}>
            <Image
              source={{ uri: title.backdropUrl }}
              placeholder={{ blurhash: BLUR_HASH }}
              contentFit="cover"
              transition={300}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.25)',
              'transparent',
              'rgba(0,0,0,0.2)',
              colors.background,
            ]}
            locations={[0, 0.3, 0.68, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={styles.body}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingWrap}>
              <Ionicons name="star" size={13} color="#f5c518" />
              <Text style={[styles.rating, { color: colors.textPrimary }]}>
                {title.rating.toFixed(1)}
              </Text>
            </View>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {metaLine(title)}
            </Text>
          </View>

          <Text style={[styles.genres, { color: colors.textMuted }]}>{genreLine(title)}</Text>

          {/* Primary actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.playBtn,
                { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ionicons name="play" size={18} color={colors.accentText} />
              <Text style={[styles.playText, { color: colors.accentText }]}>Play</Text>
            </Pressable>
            <ActionButton
              icon={inWatchlist ? 'checkmark' : 'add'}
              label={inWatchlist ? 'Added' : 'My List'}
              onPress={() => setInWatchlist((v) => !v)}
            />
            <ActionButton icon="download-outline" label="Download" />
            <ActionButton icon="share-social-outline" label="Share" />
          </View>

          {/* Tags */}
          {title.tags.length > 0 ? (
            <View style={styles.chipRow}>
              {title.tags.map((tag) => (
                <Chip key={tag} label={tag} tone="outline" />
              ))}
            </View>
          ) : null}

          {/* Synopsis */}
          <Text style={[styles.synopsis, { color: colors.textSecondary }]}>
            {title.synopsis}
          </Text>

          {/* Cast + crew */}
          <View style={styles.factGrid}>
            <Fact label="Starring" value={title.cast.join(', ')} />
            {title.director ? <Fact label="Director" value={title.director} /> : null}
            <Fact label="Languages" value={title.languages.join(', ')} />
          </View>
        </View>

        {/* More like this */}
        {related && related.length > 0 ? (
          <View style={{ marginTop: 28 }}>
            <SectionHeader title="More Like This" />
            <ContentRow
              row={{ id: 'related', title: '', layout: 'poster', titles: related }}
              onPressTitle={goToDetail}
            />
          </View>
        ) : null}
      </Animated.ScrollView>
    </View>
  );
}

function BackButton({ onPress, top }: { onPress: () => void; top: number }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={[styles.backBtn, { top: top + 6 }]}
    >
      <Ionicons name="chevron-back" size={24} color="#fff" />
    </Pressable>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable style={styles.actionBtn} onPress={onPress} hitSlop={6}>
      <Ionicons name={icon} size={22} color={colors.textPrimary} />
      <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.fact}>
      <Text style={[styles.factLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.factValue, { color: colors.textSecondary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    maxWidth: '70%',
  },
  backBtn: {
    position: 'absolute',
    left: 14,
    zIndex: 30,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backdropWrap: {
    height: BACKDROP_HEIGHT,
    overflow: 'hidden',
  },
  backdropInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  body: {
    paddingHorizontal: 20,
    marginTop: -8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.75,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '700',
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  genres: {
    fontSize: 13,
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 20,
  },
  playBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  playText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 5,
    minWidth: 52,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  synopsis: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 20,
  },
  factGrid: {
    marginTop: 24,
    gap: 14,
  },
  fact: {
    gap: 2,
  },
  factLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  factValue: {
    fontSize: 14,
    lineHeight: 20,
  },
});
