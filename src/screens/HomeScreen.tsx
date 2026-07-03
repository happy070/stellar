import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  FlatList,
  type ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContentRow } from '@/components/media/ContentRow';
import { HeroCarousel } from '@/components/media/HeroCarousel';
import { HomeFeedSkeleton } from '@/components/ui/Skeletons';
import { ErrorState, EmptyState } from '@/components/ui/StateViews';
import { useHomeFeed } from '@/hooks/useContent';
import { useTheme } from '@/theme/ThemeProvider';
import type { ContentRow as ContentRowModel, Title } from '@/types/content';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { colors, isDark, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { data, isLoading, isRefreshing, status, refetch } = useHomeFeed();

  const goToDetail = useCallback(
    (titleOrId: Title | string) => {
      const id = typeof titleOrId === 'string' ? titleOrId : titleOrId.id;
      const name = typeof titleOrId === 'string' ? undefined : titleOrId.name;
      navigation.navigate('Detail', { id, name });
    },
    [navigation],
  );

  const renderRow = useCallback<ListRenderItem<ContentRowModel>>(
    ({ item }) => <ContentRow row={item} onPressTitle={goToDetail} />,
    [goToDetail],
  );

  const header = data ? (
    <View style={styles.heroWrap}>
      <HeroCarousel slides={data.hero} onPressPlay={goToDetail} onPressInfo={goToDetail} />
    </View>
  ) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Floating translucent top bar over the hero */}
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]} pointerEvents="box-none">
        <Text style={styles.brand}>
          STELLAR<Text style={{ color: colors.accent }}>+</Text>
        </Text>
        <Pressable onPress={toggle} hitSlop={10} style={styles.themeBtn}>
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={22}
            color="#fff"
          />
        </Pressable>
      </View>

      {isLoading ? (
        <HomeFeedSkeleton />
      ) : status === 'error' ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.rows.length === 0 ? (
        <EmptyState title="Your feed is empty" message="Check back soon for new titles." />
      ) : (
        <FlatList
          data={data.rows}
          renderItem={renderRow}
          keyExtractor={(row) => row.id}
          ListHeaderComponent={header}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={7}
          removeClippedSubviews
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => refetch(true)}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroWrap: {
    marginBottom: 20,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  brand: {
    color: '#fff',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 2.5,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  themeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
