import type { HomeFeed, Title, UserProfile } from '@/types/content';
import { HOME_FEED, USER_PROFILE } from '@/data/mock/home';
import { TITLES, TITLES_BY_ID } from '@/data/mock/titles';
import { ApiError, request } from './client';

/**
 * The public data API consumed by hooks/screens. Screens depend ONLY on this
 * module (not on the mock data or the transport). Swap the bodies for real
 * `fetch` calls and nothing upstream changes.
 */
export const contentService = {
  getHomeFeed(): Promise<HomeFeed> {
    // Small failure chance so the Home error state is reachable in demos.
    return request(() => HOME_FEED, { delay: [700, 1400], failureRate: 0.08 });
  },

  getTitleById(id: string): Promise<Title> {
    return request(
      () => {
        const title = TITLES_BY_ID[id];
        if (!title) throw new ApiError(`Title "${id}" not found`, 404);
        return title;
      },
      { delay: [500, 1000] },
    );
  },

  /** "More like this" — same-genre recommendations excluding the current title. */
  getRelated(id: string): Promise<Title[]> {
    return request(
      () => {
        const base = TITLES_BY_ID[id];
        if (!base) return [];
        const genreIds = new Set(base.genres.map((g) => g.id));
        return TITLES.filter(
          (t) => t.id !== id && t.genres.some((g) => genreIds.has(g.id)),
        ).slice(0, 10);
      },
      { delay: [400, 900] },
    );
  },

  /** Full catalog, used by the Search screen for client-side filtering. */
  getCatalog(): Promise<Title[]> {
    return request(() => TITLES, { delay: [500, 900] });
  },

  getProfile(): Promise<UserProfile> {
    return request(() => USER_PROFILE, { delay: [400, 800] });
  },
};

export type ContentService = typeof contentService;
