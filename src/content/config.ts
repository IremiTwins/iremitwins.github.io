// ============================================================
// src/content/config.ts — Content Collection Schema
// ============================================================
//
// WHAT IS A CONTENT COLLECTION?
// A content collection is a folder of Markdown files (or other
// data files) that Astro treats as a typed, queryable database.
//
// This file defines the "shape" (schema) of each collection —
// i.e. what frontmatter fields each Markdown file must/can have.
//
// WHAT IS FRONTMATTER?
// Frontmatter is the block at the top of a Markdown file,
// between the triple-dash lines (---). Example:
//
//   ---
//   title: "My Post"
//   date: 2026-02-01
//   tag: "CSS"
//   ---
//
// Astro validates each .md file against this schema and gives
// you TypeScript types when you query the collection.
// ============================================================

// z is Zod — a library for defining and validating data schemas.
// Astro ships it built-in so you never need to install it yourself.
import { defineCollection, z } from 'astro:content';

// ── Blog Collection ──────────────────────────────────────────
// Every .md file inside src/content/blog/ must match this shape.
const blogCollection = defineCollection({
  type: 'content', // 'content' means Markdown/MDX files

  schema: z.object({

    // ── title (required) ─────────────────────────────────────
    // The post headline. Shown on the blog listing page,
    // the blog post page header, and the homepage preview cards.
    // Example: title: "5 CSS tricks we use every day"
    title: z.string(),

    // ── description (required) ───────────────────────────────
    // A one-sentence summary of the post. Shown as the preview
    // text on the blog listing page and homepage cards.
    // Also used as the <meta name="description"> SEO tag.
    description: z.string(),

    // ── date (required) ──────────────────────────────────────
    // Publication date. Used for sorting posts (newest first)
    // and displaying the date on listing/post pages.
    // Format: YYYY-MM-DD  →  e.g.  date: 2026-02-15
    date: z.date(),

    // ── tag (required) ───────────────────────────────────────
    // The category pill shown on listing pages and the homepage.
    // Examples: "CSS", "JavaScript", "Web Dev", "Tutorial"
    // You can write anything — it's just a display string.
    tag: z.string(),

    // ── draft (optional, defaults to false) ──────────────────
    // Set to  draft: true  to prevent the post from appearing
    // on the live site. Useful for work-in-progress posts.
    // When draft is true the post won't be built or linked.
    draft: z.boolean().optional().default(false),

    // ── prevPost / nextPost (optional) ───────────────────────
    // Slugs of the previous and next posts for the nav at
    // the bottom of each post page.
    // Example:  nextPost: "getting-started"
    // The slug is the filename without the .md extension.
    prevPost: z.string().optional(),
    nextPost: z.string().optional(),
  }),
});

// ── Review Schema (shared by anime and game reviews) ─────────
// Reusable schema for review collections. Both anime and game
// reviews share the same shape: title, cover image, star rating,
// short description, date, draft flag, and prev/next navigation.
const reviewSchema = z.object({
  // ── title (required) ───────────────────────────────────────
  // The name of the anime or game being reviewed.
  title: z.string(),

  // ── coverImage (optional) ──────────────────────────────────
  // Path to the cover image in public/, e.g. "/reviews/anime/my-anime.jpg"
  coverImage: z.string().optional(),

  // ── rating (required, 1-5) ─────────────────────────────────
  // Star rating from 1 to 5. Rendered as filled/empty stars.
  rating: z.number().min(1).max(5),

  // ── description (required) ─────────────────────────────────
  // Short review summary shown on the card and as the page lead.
  description: z.string(),

  // ── date (required) ────────────────────────────────────────
  // Date the review was written. Format: YYYY-MM-DD
  date: z.date(),

  // ── draft (optional, defaults to false) ────────────────────
  draft: z.boolean().optional().default(false),

  // ── prevPost / nextPost (optional) ─────────────────────────
  prevPost: z.string().optional(),
  nextPost: z.string().optional(),
});

// ── Twin 2 — Anime Review Collection ─────────────────────────
// Every .md file inside src/content/twin2-anime-reviews/ must match reviewSchema.
// These reviews appear on the Twin 2 page under "Anime Reviews".
// URL pattern: /twin2/twin2-anime-reviews/<slug>
const twin2AnimeReviewCollection = defineCollection({
  type: 'content',
  schema: reviewSchema,
});

// ── Twin 2 — Game Review Collection ──────────────────────────
// Every .md file inside src/content/twin2-game-reviews/ must match reviewSchema.
// These reviews appear on the Twin 2 page under "Video Game Reviews".
// URL pattern: /twin2/twin2-game-reviews/<slug>
const twin2GameReviewCollection = defineCollection({
  type: 'content',
  schema: reviewSchema,
});

// ── Twin 1 — Anime Review Collection ─────────────────────────
// Every .md file inside src/content/twin1-anime-reviews/ must match reviewSchema.
// These reviews appear on the Twin 1 page under "Anime Reviews".
// URL pattern: /twin1/twin1-anime-reviews/<slug>
const twin1AnimeReviewCollection = defineCollection({
  type: 'content',
  schema: reviewSchema,
});

// ── Twin 1 — Game Review Collection ──────────────────────────
// Every .md file inside src/content/twin1-game-reviews/ must match reviewSchema.
// These reviews appear on the Twin 1 page under "Video Game Reviews".
// URL pattern: /twin1/twin1-game-reviews/<slug>
const twin1GameReviewCollection = defineCollection({
  type: 'content',
  schema: reviewSchema,
});

// ── Export All Collections ───────────────────────────────────
// Astro discovers collections by reading this export.
// The KEY must match the folder name inside src/content/.
// If you add a new collection folder, define it above and add it here.
export const collections = {
  blog: blogCollection,
  'twin2-anime-reviews': twin2AnimeReviewCollection,
  'twin2-game-reviews': twin2GameReviewCollection,
  'twin1-anime-reviews': twin1AnimeReviewCollection,
  'twin1-game-reviews': twin1GameReviewCollection,
};
