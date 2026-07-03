import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { Title } from '@/types/content';
import { metaLine } from '@/utils/format';

const BLUR_HASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export const LANDSCAPE_WIDTH = 240;
const LANDSCAPE_HEIGHT = LANDSCAPE_WIDTH * (9 / 16);

interface LandscapeCardProps {
  title: Title;
  onPress: (title: Title) => void;
  showProgress?: boolean;
}

/** 16:9 card with a gradient scrim, title overlay and optional progress bar. */
export const LandscapeCard = React.memo(function LandscapeCard({
  title,
  onPress,
  showProgress = false,
}: LandscapeCardProps) {
  const { colors } = useTheme();
  const progress = title.watchProgress ?? 0;

  return (
    <Pressable
      onPress={() => onPress(title)}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.85 : 1 }]}
    >
      <View
        style={[
          styles.imageWrap,
          { backgroundColor: colors.skeletonBase, borderColor: colors.border },
        ]}
      >
        <Image
          source={{ uri: title.backdropUrl }}
          placeholder={{ blurhash: BLUR_HASH }}
          contentFit="cover"
          transition={250}
          style={styles.image}
          recyclingKey={title.id}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.88)']}
          locations={[0.35, 0.65, 1]}
          style={styles.scrim}
        />
        {showProgress ? (
          <View style={styles.playBadge}>
            <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.92)" />
          </View>
        ) : null}
        <View style={styles.overlay}>
          <Text numberOfLines={1} style={styles.name}>
            {title.name}
          </Text>
          <Text numberOfLines={1} style={styles.meta}>
            {metaLine(title)}
          </Text>
        </View>
        {showProgress && progress > 0 ? (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(progress * 100)}%`, backgroundColor: colors.accent },
              ]}
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: LANDSCAPE_WIDTH,
    marginRight: 12,
  },
  imageWrap: {
    width: LANDSCAPE_WIDTH,
    height: LANDSCAPE_HEIGHT,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: StyleSheet.hairlineWidth,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playBadge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 16,
  },
  name: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  meta: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 11,
    marginTop: 3,
    letterSpacing: 0.2,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  progressFill: {
    height: 4,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});
