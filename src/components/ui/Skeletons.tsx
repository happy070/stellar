import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';

const { width: SCREEN_W } = Dimensions.get('window');

function RowSkeleton({ poster = true }: { poster?: boolean }) {
  const w = poster ? 128 : 240;
  const h = poster ? 192 : 135;
  return (
    <View style={styles.row}>
      <Skeleton width={160} height={20} radius={6} style={{ marginLeft: 16, marginBottom: 12 }} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        scrollEnabled={false}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width={w} height={h} radius={12} style={{ marginRight: 12 }} />
        ))}
      </ScrollView>
    </View>
  );
}

/** Loading placeholder that mirrors the Home layout (hero + rails). */
export function HomeFeedSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={SCREEN_W} height={Math.round(SCREEN_W * 1.15)} radius={0} />
      <View style={{ height: 24 }} />
      <RowSkeleton poster={false} />
      <RowSkeleton />
      <RowSkeleton />
    </View>
  );
}

/** Loading placeholder for the Detail screen. */
export function DetailSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width={SCREEN_W} height={Math.round(SCREEN_W * 0.62)} radius={0} />
      <View style={{ padding: 16, gap: 12 }}>
        <Skeleton width="70%" height={28} radius={6} />
        <Skeleton width="45%" height={16} radius={6} />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <Skeleton width={140} height={48} radius={10} />
          <Skeleton width={140} height={48} radius={10} />
        </View>
        <Skeleton width="100%" height={14} radius={6} style={{ marginTop: 12 }} />
        <Skeleton width="100%" height={14} radius={6} />
        <Skeleton width="80%" height={14} radius={6} />
      </View>
      <RowSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    marginBottom: 24,
  },
});
