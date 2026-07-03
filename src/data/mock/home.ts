import type { ContentRow, HeroSlide, HomeFeed, UserProfile } from '@/types/content';
import { TITLES, TITLES_BY_ID } from './titles';

const byId = (ids: string[]) =>
  ids.map((id) => TITLES_BY_ID[id]).filter((t): t is NonNullable<typeof t> => Boolean(t));

const HERO: HeroSlide[] = [
  {
    id: 'h1',
    titleId: 't01',
    name: 'Nightfall Protocol',
    tagline: 'The countdown to the blackout has already begun.',
    backdropUrl: TITLES_BY_ID['t01']!.backdropUrl,
    genres: ['Action', 'Thriller'],
    maturityRating: 'U/A 16+',
  },
  {
    id: 'h2',
    titleId: 't04',
    name: 'Crown of Ash',
    tagline: 'Every throne is built on something that burns.',
    backdropUrl: TITLES_BY_ID['t04']!.backdropUrl,
    genres: ['Fantasy', 'Action'],
    maturityRating: 'A',
  },
  {
    id: 'h3',
    titleId: 't12',
    name: 'The Last Ledger',
    tagline: 'The numbers never lie. The people always do.',
    backdropUrl: TITLES_BY_ID['t12']!.backdropUrl,
    genres: ['Crime', 'Thriller'],
    maturityRating: 'U/A 16+',
  },
];

const ROWS: ContentRow[] = [
  {
    id: 'r-continue',
    title: 'Continue Watching',
    layout: 'continue',
    titles: TITLES.filter((t) => typeof t.watchProgress === 'number'),
  },
  {
    id: 'r-trending',
    title: 'Trending Now',
    layout: 'landscape',
    titles: byId(['t01', 't12', 't09', 't06', 't15', 't03']),
  },
  {
    id: 'r-new',
    title: 'New Releases',
    layout: 'poster',
    titles: TITLES.filter((t) => t.isNewRelease),
  },
  {
    id: 'r-action',
    title: 'Action & Adventure',
    layout: 'poster',
    titles: TITLES.filter((t) => t.genres.some((g) => g.id === 'action')),
  },
  {
    id: 'r-acclaimed',
    title: 'Critically Acclaimed',
    layout: 'poster',
    titles: [...TITLES].sort((a, b) => b.rating - a.rating).slice(0, 8),
  },
  {
    id: 'r-drama',
    title: 'Award-Winning Drama',
    layout: 'landscape',
    titles: TITLES.filter((t) => t.genres.some((g) => g.id === 'drama')),
  },
];

export const HOME_FEED: HomeFeed = {
  hero: HERO,
  rows: ROWS.filter((r) => r.titles.length > 0),
};

export const USER_PROFILE: UserProfile = {
  id: 'u1',
  name: 'Himanshu',
  email: 'claudecode979@gmail.com',
  avatarUrl: 'https://i.pravatar.cc/300?img=12',
  plan: 'Premium',
  memberSince: 'March 2023',
  watchlistCount: 42,
  downloadsCount: 7,
  devices: 4,
};
