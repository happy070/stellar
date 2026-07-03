import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { HeroSlide } from '@/types/content';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(SCREEN_W * 1.15);
const BLUR_HASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

interface HeroCarouselProps {
  slides: HeroSlide[];
  onPressPlay: (titleId: string) => void;
  onPressInfo: (titleId: string) => void;
}

/** Full-bleed, swipeable hero pager at the top of the Home feed. */
export function HeroCarousel({ slides, onPressPlay, onPressInfo }: HeroCarouselProps) {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (next !== indexRef.current) {
      indexRef.current = next;
      setIndex(next);
    }
  }, []);

  return (
    <View style={{ height: HERO_HEIGHT }}>
      <FlatList
        data={slides}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_W, height: HERO_HEIGHT }}>
            <Image
              source={{ uri: item.backdropUrl }}
              placeholder={{ blurhash: BLUR_HASH }}
              contentFit="cover"
              transition={300}
              style={StyleSheet.absoluteFill}
            />
            {/* Top scrim keeps the status bar + brand legible over bright art */}
            <LinearGradient
              colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.12)', 'transparent']}
              locations={[0, 0.5, 1]}
              style={styles.topScrim}
            />
            {/* Multi-stop bottom scrim: eases in instead of a hard fade band */}
            <LinearGradient
              colors={[
                'transparent',
                'rgba(0,0,0,0.12)',
                'rgba(0,0,0,0.45)',
                colors.background,
              ]}
              locations={[0, 0.45, 0.72, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.content}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.tagline} numberOfLines={2}>
                {item.tagline}
              </Text>
              <View style={styles.genreRow}>
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingText}>{item.maturityRating}</Text>
                </View>
                <Text style={styles.genres}>{item.genres.join('  •  ')}</Text>
              </View>
              <View style={styles.actions}>
                <Pressable
                  style={[styles.playBtn, { backgroundColor: '#fff' }]}
                  onPress={() => onPressPlay(item.titleId)}
                >
                  <Ionicons name="play" size={18} color="#000" />
                  <Text style={styles.playText}>Play</Text>
                </Pressable>
                <Pressable
                  style={styles.infoBtn}
                  onPress={() => onPressInfo(item.titleId)}
                >
                  <Ionicons name="information-circle-outline" size={20} color="#fff" />
                  <Text style={styles.infoText}>More Info</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.dots}>
        {slides.map((s, i) => (
          <View
            key={s.id}
            style={[
              styles.dot,
              {
                backgroundColor: i === index ? colors.accent : 'rgba(255,255,255,0.4)',
                width: i === index ? 18 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  content: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.75,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  genreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  ratingPill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  ratingText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  genres: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 34,
    paddingVertical: 13,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  playText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  infoText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dots: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
