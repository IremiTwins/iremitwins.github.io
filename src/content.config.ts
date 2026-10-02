// src/content.config.ts — defines every content folder and its frontmatter.
// Add a Markdown file to one of these folders and it appears on the site
// at the next build. Frontmatter that doesn't match the schema fails the
// build with a clear error, so typos get caught early.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const twin = z.enum(['nika', 'gio']);

// Shared blog: /blog/<file-name>
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    date: z.coerce.date(),
    tag: z.string(),            // "Nika", "Gio", "Web Dev", ...
    draft: z.boolean().default(false),
    prevPost: z.string().optional(),
    nextPost: z.string().optional(),
  }),
});

// Reviews: /<twin>/reviews/<file-name>
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    twin,
    kind: z.enum(['anime', 'game']),
    coverImage: z.string().optional(),
    rating: z.number().min(1).max(5),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// Maker / hobby projects: /nika/maker/<file-name>
const maker = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/maker' }),
  schema: z.object({
    title: z.string(),
    twin: twin.default('nika'),
    summary: z.string(),
    status: z.enum(['active', 'exploring', 'done']).default('active'),
    tools: z.array(z.string()).default([]),
    emoji: z.string().default('🛠️'),
    size: z.enum(['wide', 'tall', 'normal']).default('normal'),  // bento card size
    order: z.number().default(50),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, reviews, maker };
