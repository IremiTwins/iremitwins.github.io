// astro.config.mjs — site configuration
// Docs: https://docs.astro.build/en/reference/configuration-reference/
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// Old review URLs (/twin2/twin2-anime-reviews/<slug>, ...) → /<twin>/reviews/<slug>.
// Built from the files in src/content/reviews so new reviews never need a manual entry.
const oldPrefix = { nika: 'twin2', gio: 'twin1' };
const reviewRedirects = {};
for (const twin of ['nika', 'gio']) {
  for (const file of fs.readdirSync(`./src/content/reviews/${twin}`)) {
    const slug = file.replace(/\.mdx?$/, '');
    const text = fs.readFileSync(`./src/content/reviews/${twin}/${file}`, 'utf8');
    const draft = /^draft:\s*true/m.test(text);
    const kind = /^kind:\s*"?(anime|game)/m.exec(text)?.[1] ?? 'anime';
    // unpublished (draft) reviews send old links to the review list instead of a 404
    const to = draft ? `/${twin}/reviews` : `/${twin}/reviews/${slug}`;
    reviewRedirects[`/${oldPrefix[twin]}/${oldPrefix[twin]}-${kind}-reviews/${slug}`] = to;
  }
}

export default defineConfig({
  site: 'https://iremitwins.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react(), mdx(), sitemap()],

  // Old URLs from the first version of the site → new homes.
  // GitHub Pages has no server redirects, so Astro writes a small
  // static page at each old path that forwards the visitor.
  redirects: {
    '/twin1': '/gio',
    '/twin2': '/nika',
    '/twin2/genome-toolkit': '/nika/apps/genome-toolkit',
    ...reviewRedirects,
  },
});
