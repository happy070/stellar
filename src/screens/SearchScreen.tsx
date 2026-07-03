import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  type ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState, ErrorState } from '@/components/ui/StateViews';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCatalog } from '@/hooks/useContent';
import { useTheme } from '@/theme/ThemeProvider';
import type { RootStackParamList } from '@/navigation/types';
import type { Title } from '@/types/content';
import { metaLine } from '@/utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SearchScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { data, isLoading, status, refetch } = useCatalog();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const all = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.genres.some((g) => g.label.toLowerCase().includes(q)) ||
        t.cast.some((c) => c.toLowerCase().includes(q)),
    );
  }, [data, query]);

  const goToDetail = useCallback(
    (t: Title) => navigation.navigate('Detail', { id: t.id, name: t.name }),
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<Title>>(
    ({ item }) => (
      <Pressable
        style={[styles.resultRow, { borderColor: colors.border }]}
        onPress={() => goToDetail(item)}
      >
        <Image
          source={{ uri: item.posterUrl }}
          contentFit="cover"
          transition={200}
          style={styles.thumb}
          recyclingKey={item.id}
        />
        <View style={styles.resultMeta}>
          <Text numberOfLines={1} style={[styles.resultName, { color: colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[styles.resultSub, { color: colors.textMuted }]}>{metaLine(item)}</Text>
          <Text numberOfLines={2} style={[styles.resultSyn, { color: colors.textSecondary }]}>
            {item.synopsis}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
    ),
    [colors, goToDetail],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Search</Text>
      <View style={[styles.searchBar, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Titles, genres, people"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.textPrimary }]}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {isLoading ? (
        <View style={{ paddingHorizontal: 16, gap: 12, marginTop: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
              <Skeleton width={64} height={96} radius={8} />
              <View style={{ flex: 1, gap: 8, paddingVertical: 6 }}>
                <Skeleton width="60%" height={16} />
                <Skeleton width="40%" height={12} />
                <Skeleton width="90%" height={12} />
              </View>
            </View>
          ))}
        </View>
      ) : status === 'error' ? (
        <ErrorState onRetry={() => refetch()} />
      ) : results.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title={`No results for “${query}”`}
          message="Try a different title, genre, or actor."
        />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(t) => t.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24 }}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={9}
          removeClippedSubviews
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  thumb: {
    width: 64,
    height: 96,
    borderRadius: 8,
    backgroundColor: 'rgba(120,120,140,0.2)',
  },
  resultMeta: {
    flex: 1,
    gap: 3,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '700',
  },
  resultSub: {
    fontSize: 12,
  },
  resultSyn: {
    fontSize: 12,
    lineHeight: 16,
  },
});
