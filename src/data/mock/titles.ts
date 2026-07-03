import type { Genre, Title } from '@/types/content';

/**
 * Static catalog used by the mock service layer. In a real app this would be
 * the JSON returned by a `/catalog` endpoint. Images use deterministic
 * Picsum seeds so artwork is stable across reloads and requires no auth.
 */

const img = {
  poster: (seed: string) => `https://picsum.photos/seed/${seed}/400/600`,
  backdrop: (seed: string) => `https://picsum.photos/seed/${seed}/1280/720`,
  still: (seed: string) => `https://picsum.photos/seed/${seed}/640/360`,
};

export const GENRES: Record<string, Genre> = {
  action: { id: 'action', label: 'Action' },
  drama: { id: 'drama', label: 'Drama' },
  scifi: { id: 'scifi', label: 'Sci-Fi' },
  thriller: { id: 'thriller', label: 'Thriller' },
  comedy: { id: 'comedy', label: 'Comedy' },
  crime: { id: 'crime', label: 'Crime' },
  fantasy: { id: 'fantasy', label: 'Fantasy' },
  romance: { id: 'romance', label: 'Romance' },
  documentary: { id: 'documentary', label: 'Documentary' },
};

const CAST_POOL = [
  'Ava Sterling',
  'Marcus Vale',
  'Priya Anand',
  'Diego Marston',
  'Lena Whitfield',
  'Kenji Rao',
  'Sofia Delgado',
  'Idris Kane',
  'Mei Lin',
  'Tobias Frost',
];

function pickCast(offset: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const item = CAST_POOL[(offset + i) % CAST_POOL.length];
    return item ?? 'Unknown';
  });
}

interface Seed {
  id: string;
  name: string;
  kind: Title['kind'];
  year: number;
  rating: number;
  maturity: Title['maturityRating'];
  genres: Genre[];
  synopsis: string;
  tags: string[];
  durationMinutes?: number;
  seasons?: number;
  isNew?: boolean;
  progress?: number;
}

const SEEDS: Seed[] = [
  {
    id: 't01',
    name: 'Nightfall Protocol',
    kind: 'movie',
    year: 2025,
    rating: 8.4,
    maturity: 'U/A 16+',
    genres: [GENRES.action!, GENRES.thriller!],
    synopsis:
      'A disavowed intelligence officer races across three continents to stop a rogue AI from triggering a global blackout.',
    tags: ['Trending', 'Blockbuster'],
    durationMinutes: 128,
    isNew: true,
  },
  {
    id: 't02',
    name: 'The Glass Empire',
    kind: 'series',
    year: 2024,
    rating: 8.9,
    maturity: 'U/A 16+',
    genres: [GENRES.drama!, GENRES.crime!],
    synopsis:
      'Three generations of a media dynasty tear each other apart over control of a crumbling empire.',
    tags: ['Award Winning', 'Binge-worthy'],
    seasons: 3,
    progress: 0.35,
  },
  {
    id: 't03',
    name: 'Orbital',
    kind: 'movie',
    year: 2025,
    rating: 7.8,
    maturity: 'U/A 13+',
    genres: [GENRES.scifi!, GENRES.drama!],
    synopsis:
      'Six astronauts aboard a decaying space station confront isolation as Earth goes silent below them.',
    tags: ['Critically Acclaimed'],
    durationMinutes: 116,
    isNew: true,
  },
  {
    id: 't04',
    name: 'Crown of Ash',
    kind: 'series',
    year: 2023,
    rating: 8.6,
    maturity: 'A',
    genres: [GENRES.fantasy!, GENRES.action!],
    synopsis:
      'In a kingdom where fire is currency, a stable-hand discovers she can command the flames that rule her world.',
    tags: ['Epic', 'Fan Favorite'],
    seasons: 2,
    progress: 0.72,
  },
  {
    id: 't05',
    name: 'Paper Cranes',
    kind: 'movie',
    year: 2024,
    rating: 7.5,
    maturity: 'U/A 13+',
    genres: [GENRES.romance!, GENRES.drama!],
    synopsis:
      'Two strangers keep meeting at the same Tokyo train station, one delayed minute at a time.',
    tags: ['Feel Good'],
    durationMinutes: 104,
  },
  {
    id: 't06',
    name: 'Deadline City',
    kind: 'series',
    year: 2025,
    rating: 8.1,
    maturity: 'U/A 16+',
    genres: [GENRES.comedy!, GENRES.drama!],
    synopsis:
      'The chaotic newsroom of a failing tabloid gets one last shot at relevance — and ratings.',
    tags: ['New Season'],
    seasons: 1,
    isNew: true,
  },
  {
    id: 't07',
    name: 'The Undertow',
    kind: 'movie',
    year: 2023,
    rating: 7.9,
    maturity: 'U/A 16+',
    genres: [GENRES.thriller!, GENRES.crime!],
    synopsis:
      'A small-town detective pulls a thread that unravels a decade of buried secrets beneath the harbor.',
    tags: ['Mystery'],
    durationMinutes: 122,
    progress: 0.15,
  },
  {
    id: 't08',
    name: 'Wild Frontiers',
    kind: 'documentary',
    year: 2024,
    rating: 9.1,
    maturity: 'U',
    genres: [GENRES.documentary!],
    synopsis:
      'A breathtaking journey through the last untouched wildernesses on the planet, shot over four years.',
    tags: ['4K', 'Nature'],
    seasons: 1,
  },
  {
    id: 't09',
    name: 'Hollow Point',
    kind: 'movie',
    year: 2025,
    rating: 7.2,
    maturity: 'A',
    genres: [GENRES.action!, GENRES.crime!],
    synopsis:
      'A getaway driver with a code takes one last job that puts his own family in the crosshairs.',
    tags: ['Adrenaline'],
    durationMinutes: 109,
    isNew: true,
  },
  {
    id: 't10',
    name: 'Starlings',
    kind: 'series',
    year: 2022,
    rating: 8.3,
    maturity: 'U/A 13+',
    genres: [GENRES.drama!, GENRES.romance!],
    synopsis:
      'A coming-of-age story following five friends across a single transformative summer on the coast.',
    tags: ['Heartfelt'],
    seasons: 4,
    progress: 0.5,
  },
  {
    id: 't11',
    name: 'Quantum Break',
    kind: 'movie',
    year: 2024,
    rating: 8.0,
    maturity: 'U/A 13+',
    genres: [GENRES.scifi!, GENRES.thriller!],
    synopsis:
      'A physicist relives the same 12 minutes before a catastrophe, searching each loop for a way out.',
    tags: ['Mind-bending'],
    durationMinutes: 118,
  },
  {
    id: 't12',
    name: 'The Last Ledger',
    kind: 'series',
    year: 2025,
    rating: 8.7,
    maturity: 'U/A 16+',
    genres: [GENRES.crime!, GENRES.thriller!],
    synopsis:
      'A forensic accountant is forced to launder money for the cartel that murdered her mentor.',
    tags: ['Trending', 'New'],
    seasons: 1,
    isNew: true,
  },
  {
    id: 't13',
    name: 'Monsoon',
    kind: 'movie',
    year: 2023,
    rating: 7.6,
    maturity: 'U/A 13+',
    genres: [GENRES.drama!],
    synopsis:
      'A chef returns to the city he fled during the floods to reopen his late father’s restaurant.',
    tags: ['Slice of Life'],
    durationMinutes: 111,
  },
  {
    id: 't14',
    name: 'Ironclad',
    kind: 'series',
    year: 2024,
    rating: 8.2,
    maturity: 'A',
    genres: [GENRES.action!, GENRES.drama!],
    synopsis:
      'An elite naval unit is stranded behind enemy lines with a secret that could end the war.',
    tags: ['Intense'],
    seasons: 2,
  },
  {
    id: 't15',
    name: 'Neon Alibi',
    kind: 'movie',
    year: 2025,
    rating: 7.4,
    maturity: 'U/A 16+',
    genres: [GENRES.crime!, GENRES.comedy!],
    synopsis:
      'Two con artists posing as detectives get hired to solve the very crime they committed.',
    tags: ['Fresh'],
    durationMinutes: 99,
    isNew: true,
  },
  {
    id: 't16',
    name: 'The Cartographer',
    kind: 'movie',
    year: 2022,
    rating: 8.5,
    maturity: 'U/A 13+',
    genres: [GENRES.fantasy!, GENRES.drama!],
    synopsis:
      'A mapmaker discovers the roads she draws come to life — and someone is redrawing her city.',
    tags: ['Imaginative'],
    durationMinutes: 125,
  },
];

/** The full catalog, keyed for O(1) lookup by the service layer. */
export const TITLES: Title[] = SEEDS.map((s, index) => ({
  id: s.id,
  name: s.name,
  kind: s.kind,
  posterUrl: img.poster(s.id),
  backdropUrl: img.backdrop(s.id),
  logoUrl: undefined,
  year: s.year,
  maturityRating: s.maturity,
  rating: s.rating,
  durationMinutes: s.durationMinutes,
  seasons: s.seasons,
  genres: s.genres,
  languages: ['English', 'Hindi', 'Spanish'],
  synopsis: s.synopsis,
  cast: pickCast(index, 4),
  director: CAST_POOL[(index + 5) % CAST_POOL.length],
  tags: s.tags,
  isNewRelease: s.isNew,
  watchProgress: s.progress,
}));

export const TITLES_BY_ID: Record<string, Title> = Object.fromEntries(
  TITLES.map((t) => [t.id, t]),
);

export function stillFor(id: string): string {
  return img.still(id);
}
