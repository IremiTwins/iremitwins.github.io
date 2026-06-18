// ============================================================
// astro.config.mjs — Astro Project Configuration
// ============================================================
//
// This file controls how Astro builds and serves your site.
// It is automatically read by Astro every time you run
// `npm run dev`, `npm run build`, or `npm run preview`.
//
// WHAT IS ASTRO?
// Astro is a "static site generator" (SSG). It takes your
// component/markdown source files and outputs plain HTML,
// CSS, and JS files that any web host can serve — no server
// required. GitHub Pages hosts these output files for free.
// ============================================================

import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({

  // ----------------------------------------------------------
  // site
  // Your full live URL (including https://).
  // Astro uses this to generate correct canonical links and
  // sitemaps. Update this if your domain ever changes.
  // ----------------------------------------------------------
  site: 'https://iremitwins.com',

  // ----------------------------------------------------------
  // output
  // 'static' means Astro pre-renders every page to plain HTML
  // at build time — the fastest possible delivery to visitors.
  // Other options: 'server' (SSR) or 'hybrid'. You don't need
  // to change this unless you add server-side features later.
  // ----------------------------------------------------------
  output: 'static',

  // ----------------------------------------------------------
  // integrations
  // Plug-ins you can add to extend Astro. Examples:
  //   import react from '@astrojs/react'  → use React components
  //   import tailwind from '@astrojs/tailwind' → use Tailwind CSS
  //   import sitemap from '@astrojs/sitemap' → auto sitemap.xml
  //
  // Add them here as an array, e.g. integrations: [react()]
  // ----------------------------------------------------------
  integrations: [react()],
});