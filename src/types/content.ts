/**
 * Domain models for the streaming catalog.
 * These are the single source of truth for the shape of data flowing
 * from the (mock) service layer into the UI. Screens never invent their
 * own shapes — they consume these.
 */

export type MaturityRating = 'U' | 'U/A 7+' | 'U/A 13+' | 'U/A 16+' | 'A';

export type MediaKind = 'movie' | 'series' | 'live' | 'sport' | 'documentary';

export interface Genre {
  id: string;
  label: string;
}

/** A single episode inside a series. */
export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  durationMinutes: number;
  synopsis: string;
  stillUrl: string;
  /** 0..1 watched progress, used by "Continue Watching". */
  progress?: number;
}

/** The core catalog entity — a movie, series, live event, etc. */
export interface Title {
  id: string;
  name: string;
  kind: MediaKind;
  /** Portrait artwork (2:3) for carousels. */
  posterUrl: string;
  /** Landscape artwork (16:9) for hero + detail header. */
  backdropUrl: string;
  logoUrl?: string;
  year: number;
  maturityRating: MaturityRating;
  /** IMDb-style score, 0..10. */
  rating: number;
  durationMinutes?: number;
  seasons?: number;
  genres: Genre[];
  languages: string[];
  synopsis: string;
  cast: string[];
  director?: string;
  tags: string[];
  isNewRelease?: boolean;
  /** Progress for the Continue Watching rail, 0..1. */
  watchProgress?: number;
}

/** A horizontally-scrolling rail on the Home feed. */
export interface ContentRow {
  id: string;
  title: string;
  /** Controls the card component the carousel renders. */
  layout: 'poster' | 'landscape' | 'continue';
  titles: Title[];
}

/** A slide in the top hero pager. */
export interface HeroSlide {
  id: string;
  titleId: string;
  name: string;
  tagline: string;
  backdropUrl: string;
  logoUrl?: string;
  genres: string[];
  maturityRating: MaturityRating;
}

/** The full payload for the Home screen, resolved in one request. */
export interface HomeFeed {
  hero: HeroSlide[];
  rows: ContentRow[];
}

/** Profile screen payload. */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'Free' | 'Super' | 'Premium';
  memberSince: string;
  watchlistCount: number;
  downloadsCount: number;
  devices: number;
}
