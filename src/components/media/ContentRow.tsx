import React, { useCallback } from 'react';
import { FlatList, type ListRenderItem, StyleSheet, View } from 'react-native';
import type { ContentRow as ContentRowModel, Title } from '@/types/content';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PosterCard, POSTER_WIDTH } from './PosterCard';
import { LandscapeCard, LANDSCAPE_WIDTH } from './LandscapeCard';

interface ContentRowProps {
  row: ContentRowModel;
  onPressTitle: (title: Title) => void;
}

const CARD_GAP = 12;

/**
 * One horizontal rail. Chooses its card component from `row.layout` and is
 * tuned for smooth scrolling: fixed item widths feed `getItemLayout` so the
 * list never measures, and windowing props keep off-screen cards unmounted.
 */
export const ContentRow = React.memo(function ContentRow({
  row,
  onPressTitle,
}: ContentRowProps) {
  const isPoster = row.layout === 'poster';
  const isContinue = row.layout === 'continue';
  const itemWidth = (isPoster ? POSTER_WIDTH : LANDSCAPE_WIDTH) + CARD_GAP;

  const renderItem = useCallback<ListRenderItem<Title>>(
    ({ item }) => {
      if (isPoster) return <PosterCard title={item} onPress={onPressTitle} />;
      return (
        <LandscapeCard title={item} onPress={onPressTitle} showProgress={isContinue} />
      );
    },
    [isPoster, isContinue, onPressTitle],
  );

  const keyExtractor = useCallback((item: Title) => item.id, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<Title> | null | undefined, index: number) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    [itemWidth],
  );

  return (
    <View style={styles.section}>
      <SectionHeader title={row.title} />
      <FlatList
        data={row.titles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
        decelerationRate="fast"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});
