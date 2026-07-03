import type { Title } from '@/types/content';

/** 128 -> "2h 8m", 99 -> "1h 39m", 45 -> "45m". */
export function formatRuntime(minutes?: number): string | null {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Compact metadata line: "2025 · 2h 8m · U/A 16+" or "2024 · 3 Seasons · A". */
export function metaLine(title: Title): string {
  const parts: string[] = [String(title.year)];
  if (title.kind === 'series' && title.seasons) {
    parts.push(`${title.seasons} Season${title.seasons > 1 ? 's' : ''}`);
  } else {
    const rt = formatRuntime(title.durationMinutes);
    if (rt) parts.push(rt);
  }
  parts.push(title.maturityRating);
  return parts.join('  ·  ');
}

export function genreLine(title: Title): string {
  return title.genres.map((g) => g.label).join(' • ');
}
