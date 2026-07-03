import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { Title } from '@/types/content';

/** Low-res gray placeholder shown by expo-image while artwork decodes. */
const BLUR_HASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export const POSTER_WIDTH = 128;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

interface PosterCardProps {
  title: Title;
  onPress: (title: Title) => void;
}

/** Portrait catalog card used by poster-layout carousels. */
export const PosterCard = React.memo(function PosterCard({ title, onPress }: PosterCardProps) {
  const { colors } = useTheme();
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
          source={{ uri: title.posterUrl }}
          placeholder={{ blurhash: BLUR_HASH }}
          contentFit="cover"
          transition={250}
          style={styles.image}
          recyclingKey={title.id}
        />
        {title.isNewRelease ? (
          <View style={[styles.badge, { backgroundColor: colors.accent }]}>
            <Text style={[styles.badgeText, { color: colors.accentText }]}>NEW</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={1} style={[styles.name, { color: colors.textSecondary }]}>
        {title.name}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: POSTER_WIDTH,
    marginRight: 12,
  },
  imageWrap: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  name: {
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.1,
  },
});
