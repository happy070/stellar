import { useMemo } from 'react';
import { contentService } from '@/services/contentService';
import { useAsync } from './useAsync';

/** Home feed (hero + rows). */
export function useHomeFeed() {
  return useAsync(() => contentService.getHomeFeed(), []);
}

/** A single title's full detail. Re-fetches when `id` changes. */
export function useTitle(id: string) {
  const fetcher = useMemo(() => () => contentService.getTitleById(id), [id]);
  return useAsync(fetcher, [id]);
}

/** "More like this" recommendations for a title. */
export function useRelated(id: string) {
  const fetcher = useMemo(() => () => contentService.getRelated(id), [id]);
  return useAsync(fetcher, [id]);
}

/** Full catalog for the Search screen. */
export function useCatalog() {
  return useAsync(() => contentService.getCatalog(), []);
}

/** Current user's profile. */
export function useProfile() {
  return useAsync(() => contentService.getProfile(), []);
}
