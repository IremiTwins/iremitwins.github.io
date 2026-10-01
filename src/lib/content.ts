// src/lib/content.ts — helpers that fetch published content, newest first.
import { getCollection } from 'astro:content';
import type { TwinId } from '../data/site';

const byDate = (a: { data: { date: Date } }, b: { data: { date: Date } }) =>
  b.data.date.getTime() - a.data.date.getTime();

export async function getPosts() {
  return (await getCollection('blog', (p) => !p.data.draft)).sort(byDate);
}

export async function getReviews(twin?: TwinId) {
  return (await getCollection('reviews', (r) => !r.data.draft && (!twin || r.data.twin === twin))).sort(byDate);
}

export async function getMaker(twin: TwinId = 'nika') {
  return (await getCollection('maker', (m) => !m.data.draft && m.data.twin === twin)).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

/** Review id "nika/frieren-beyond-journey-end" → "frieren-beyond-journey-end" */
export const reviewSlug = (id: string) => id.split('/').pop()!;

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  d.toLocaleDateString('en-US', { timeZone: 'UTC', ...opts });

/** Twin a blog post belongs to, from its tag ("Nika" / "Gio"), or null for shared posts. */
export const postTwin = (tag: string): TwinId | null =>
  tag.toLowerCase() === 'nika' ? 'nika' : tag.toLowerCase() === 'gio' ? 'gio' : null;
