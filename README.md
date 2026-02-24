# Iremi Twins — Astro Website

A full re-build of [iremitwins.com](https://iremitwins.com) using
[Astro](https://astro.build) — a modern static site generator.

This README is written for complete beginners. Everything you need to
know to run, edit, and extend the site is here.

---

## Table of Contents

1. [What is Astro?](#what-is-astro)
2. [Project Structure](#project-structure)
3. [Getting Started (running locally)](#getting-started)
4. [How to Add a Blog Post](#how-to-add-a-blog-post)
5. [How to Add a Project Card](#how-to-add-a-project-card)
6. [How to Update Personal Info](#how-to-update-personal-info)
7. [How to Change Colours and Fonts](#how-to-change-colours-and-fonts)
8. [How to Deploy](#how-to-deploy)
9. [The public/ Folder](#the-public-folder)
10. [Glossary](#glossary)

---

## What is Astro?

**Astro** is a tool that takes your source files (components, Markdown, CSS)
and compiles them into plain HTML, CSS, and JavaScript files. Those output files
are what gets served to visitors — no server required.

This is called a **static site**. GitHub Pages hosts static sites for free.

### Why Astro over plain HTML?

With plain HTML, if you want to change the nav bar you'd have to edit every
single HTML file. With Astro:

- The nav bar is defined **once** in `Header.astro`
- All pages use it automatically
- New blog posts are just `.md` files — no HTML to write
- TypeScript gives you autocomplete and early error detection

---

## Project Structure

```
Website-Astro/
│
├── .github/
│   └── workflows/
│       └── deploy.yml         ← Automated deploy to GitHub Pages
│
├── public/
│   └── CNAME                  ← Custom domain (iremitwins.com) — DO NOT DELETE
│
├── src/
│   │
│   ├── content/
│   │   ├── config.ts          ← Blog collection schema (field definitions)
│   │   └── blog/
│   │       ├── css-tips.md            ← Blog post
│   │       └── getting-started.md     ← Blog post
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro   ← Shared HTML shell (head, header, footer, JS)
│   │   └── BlogPostLayout.astro ← Wrapper for individual blog post pages
│   │
│   ├── components/
│   │   ├── Header.astro           ← Navigation bar
│   │   ├── Footer.astro           ← Footer
│   │   ├── HeroSection.astro      ← Full-screen opening section
│   │   ├── AboutSection.astro     ← Twin profile cards
│   │   ├── PortfolioSection.astro ← Project cards grid
│   │   ├── WorkSection.astro      ← Work history timeline
│   │   ├── BlogPreviewSection.astro ← 3 latest posts on homepage
│   │   └── ContactSection.astro   ← Email + social links
│   │
│   ├── pages/
│   │   ├── index.astro        ← Homepage  →  iremitwins.com/
│   │   └── blog/
│   │       ├── index.astro    ← Blog listing  →  iremitwins.com/blog
│   │       └── [slug].astro   ← Individual posts  →  iremitwins.com/blog/css-tips
│   │
│   ├── styles/
│   │   └── global.css         ← All styles for the entire site
│   │
│   └── env.d.ts               ← TypeScript type declarations (don't edit)
│
├── astro.config.mjs           ← Astro configuration
├── package.json               ← Project metadata and scripts
├── tsconfig.json              ← TypeScript configuration (don't edit)
└── README.md                  ← This file
```

---

## Getting Started

### Prerequisites

Make sure you have **Node.js** installed (version 18 or higher).
Check with: `node --version`

Download Node.js from [nodejs.org](https://nodejs.org) if needed.

### 1. Install dependencies

Open a terminal in the `Website-Astro/` folder and run:

```bash
npm install
```

This downloads Astro and all other packages into a `node_modules/` folder.
You only need to do this once (or after adding new packages).

### 2. Start the dev server

```bash
npm run dev
```

Open your browser and go to **http://localhost:4321**.
The site reloads automatically whenever you save a file.

### 3. Build for production

```bash
npm run build
```

This generates the final HTML/CSS/JS files into the `dist/` folder.
These are the files that get deployed to GitHub Pages.

### 4. Preview the production build

```bash
npm run preview
```

Serves the `dist/` folder locally so you can check the production build
before deploying.

---

## How to Add a Blog Post

This is the most common task. Here's exactly what to do:

### Step 1 — Create the file

Create a new file in `src/content/blog/`. The filename becomes the URL slug.

**Example:** `src/content/blog/my-first-post.md`
→ URL: `iremitwins.com/blog/my-first-post`

Use lowercase letters and hyphens only in the filename (no spaces, no capitals).

### Step 2 — Add frontmatter

At the very top of the file, add the frontmatter block between `---` lines:

```markdown
---
title: "My First Post"
description: "A short one-sentence summary shown on the listing page."
date: 2026-03-01
tag: "JavaScript"
---
```

All four fields are required. Optional fields:

| Field | Purpose | Example |
|---|---|---|
| `draft: true` | Hides the post from the live site | `draft: true` |
| `prevPost` | Slug of the previous post (for nav) | `prevPost: "css-tips"` |
| `nextPost` | Slug of the next post (for nav) | `nextPost: "getting-started"` |

The **slug** is just the filename without `.md`:
`getting-started.md` → slug is `"getting-started"`

### Step 3 — Write your content

Below the closing `---`, write your post in **Markdown**. Markdown is a
simple plain-text format:

```markdown
## Section Heading

This is a normal paragraph. You can use **bold**, *italic*, and
[links](https://example.com).

## Code Example

Inline code looks like `const x = 1`.

A full code block:

```js
function greet(name) {
  return `Hello, ${name}!`;
}
```

## Lists

- Item one
- Item two
- Item three
```

### Step 4 — Save the file

That's it! Run `npm run dev` and visit
`http://localhost:4321/blog/my-first-post` to see your post.

The blog listing page (`/blog`) and the homepage preview section
update automatically — no other changes needed.

---

## How to Add a Project Card

Open `src/components/PortfolioSection.astro` and find the portfolio grid.

Copy one of the existing `<article class="project-card card">` blocks and
update:

| What to change | Where |
|---|---|
| Project type (e.g. "Web App") | `<span class="project-card__type">` |
| GitHub link | `<a href="YOUR_GITHUB_URL">` |
| Live site link | `<a href="YOUR_LIVE_URL">` |
| Project name | `<h3>` |
| Description | `<p>` |
| Tech stack badges | `<div class="project-card__tech">` spans |

If a link doesn't exist yet, remove the `<a>` tag entirely.

---

## How to Update Personal Info

| What | Where |
|---|---|
| Name / role / bio | `src/components/AboutSection.astro` |
| Avatar initials | `.card__avatar` text inside `AboutSection.astro` |
| Skill badges | `.card__skills` spans inside `AboutSection.astro` |
| Work history items | `src/components/WorkSection.astro` |
| Email address | `src/components/ContactSection.astro` (the `mailto:` link) |
| GitHub URL | `src/components/ContactSection.astro` (the `.contact__socials` link) |
| Hero headline / tagline | `src/components/HeroSection.astro` |
| Site title (browser tab) | `src/pages/index.astro` — the `title` prop on `<BaseLayout>` |
| Site description (SEO) | `src/pages/index.astro` — the `description` prop on `<BaseLayout>` |

---

## How to Change Colours and Fonts

All colours and fonts are defined as **CSS variables** (custom properties) at
the top of `src/styles/global.css` inside the `:root { }` block.

### Change the accent colour

Find this line in `:root {}`:

```css
--clr-accent: #6c63ff;
```

Replace `#6c63ff` with any hex colour code. Every button, link, dot, and
highlight on the site will update automatically.

Tools to find hex colour codes:
- [coolors.co](https://coolors.co)
- [palettte.app](https://palettte.app)

### Change the background colour

```css
--clr-bg: #0d0f14;
```

### Change the body font

1. Go to [fonts.google.com](https://fonts.google.com) and find a font you like.
2. Copy the `<link>` embed code it gives you.
3. Replace the existing Google Fonts `<link>` tag in `src/layouts/BaseLayout.astro`.
4. Update this variable in `src/styles/global.css`:

```css
--font-sans: 'Your Font Name', system-ui, sans-serif;
```

### Change the monospace / code font

Same process as above, but update:

```css
--font-mono: 'Your Mono Font', 'Courier New', monospace;
```

---

## How to Deploy

Deployment is fully automated via GitHub Actions.

### On every push to `main`

1. You make changes and commit them locally.
2. You push to GitHub: `git push origin main`
3. GitHub Actions automatically runs the deploy workflow
   (`.github/workflows/deploy.yml`).
4. The workflow installs dependencies, builds the site, and publishes the
   output to GitHub Pages.
5. Your live site at **iremitwins.com** updates within ~60–90 seconds.

### First-time GitHub Pages setup (one-time)

If you haven't done this yet:

1. Go to your GitHub repository.
2. Click **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment**, set the Source to **"GitHub Actions"**.
4. Click Save.

You only need to do this once. GitHub Actions takes over from there.

### Checking deploy status

Go to your repository → **Actions** tab. You'll see a list of workflow runs.
Each one shows a green ✓ (success), red ✗ (failure), or yellow ⟳ (in progress).
Click any run to see detailed logs for each step.

---

## The public/ Folder

Files placed in `public/` are copied as-is into the `dist/` output folder
without any processing by Astro.

**Current contents:**

| File | Purpose |
|---|---|
| `CNAME` | Tells GitHub Pages to serve this site at `iremitwins.com`. **Do not delete or rename this file** — removing it would break the custom domain. |

You can also put images, favicons, PDFs, or other static assets here.
They'll be accessible at the root URL, e.g.:
- `public/favicon.ico` → `iremitwins.com/favicon.ico`
- `public/cv.pdf` → `iremitwins.com/cv.pdf`

---

## Glossary

You'll see these terms throughout the code comments:

| Term | Meaning |
|---|---|
| **Component** | A reusable piece of UI defined in a `.astro` file. Like a LEGO brick — define it once, use it anywhere. |
| **Layout** | A special component that wraps a whole page (provides `<html>`, `<head>`, etc.). |
| **Content Collection** | A typed folder of Markdown files that Astro can query like a database. Our blog posts live here. |
| **Frontmatter** | The metadata block between `---` at the top of a Markdown file (title, date, tag, etc.). |
| **Slug** | The URL-friendly version of a post's filename. `my-post.md` → slug is `my-post`. |
| **Static Site** | A website made of pre-built HTML files. Fast, secure, and hostable anywhere for free. |
| **Build** | The process of compiling source files into the final HTML/CSS/JS output in the `dist/` folder. |
| **`getCollection()`** | Astro function that reads all entries from a content collection at build time. |
| **`getStaticPaths()`** | Required function in dynamic route pages. Tells Astro which URL slugs exist so it can pre-render them. |
| **Prop** | A value passed into a component from outside. Like a function parameter for UI components. |
| **`<slot />`** | Placeholder in a layout/component where child content gets inserted. |
| **`data-animate`** | HTML attribute on elements that should fade+slide in when they scroll into view. |
| **GitHub Actions** | GitHub's built-in automation system used here to build and deploy the site automatically. |
| **YAML** | The format used by `.github/workflows/deploy.yml`. Indent-sensitive — always use spaces, not tabs. |
