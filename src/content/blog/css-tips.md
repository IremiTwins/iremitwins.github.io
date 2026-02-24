---
# ============================================================
# src/content/blog/css-tips.md — Blog Post
# ============================================================
#
# HOW TO CREATE A NEW BLOG POST:
# 1. Duplicate this file and rename it (e.g. my-new-post.md)
#    The filename becomes the URL slug:
#      css-tips.md  →  /blog/css-tips
# 2. Fill in the frontmatter fields between the --- lines.
# 3. Write your content below the closing --- in Markdown.
# 4. Save. The post automatically appears on /blog and the
#    homepage preview section — no other code changes needed!
#
# FRONTMATTER FIELDS (defined in src/content/config.ts):
#
#   title       — the post headline
#   description — one-sentence summary (shown on listing page)
#   date        — publication date (YYYY-MM-DD)
#   tag         — category pill text (e.g. "CSS", "JavaScript")
#   draft       — set to true to hide from the live site
#   prevPost    — slug of the previous post (for bottom nav)
#   nextPost    — slug of the next post (for bottom nav)
# ============================================================

title: "5 CSS tricks we use every day"
description: "A quick tour of the CSS patterns that show up in nearly every project we build."
date: 2026-02-15
tag: "CSS"
nextPost: "getting-started"
---

A quick tour of the CSS patterns that show up in nearly every project we build.

## 1. CSS Custom Properties (variables)

Custom properties are the backbone of every design system we build.
Defining tokens like colours, spacing, and type scales once in `:root`
means changing the whole theme is a single-line edit.

```css
:root {
  --clr-accent: #6c63ff;
  --space-md: 1.5rem;
}

.button {
  background: var(--clr-accent);
  padding: var(--space-md);
}
```

## 2. `clamp()` for fluid typography

Instead of writing multiple media queries for font sizes, `clamp()`
lets you set a fluid range that scales smoothly between a minimum and maximum.

```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

## 3. `aspect-ratio` for consistent proportions

Maintaining image or card aspect ratios used to require the padding-top hack.
The `aspect-ratio` property makes it a one-liner.

```css
.thumbnail {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

## 4. `gap` on flex and grid

`gap` works on both Flexbox and Grid and removes the need for margin
hacks. It only applies space *between* items, never on the outer edges.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}
```

## 5. `:is()` and `:where()` for tidy selectors

These pseudo-classes let you group selectors without repeating the full rule.
`:where()` has zero specificity, which is great for resets.

```css
:is(h1, h2, h3) {
  line-height: 1.2;
  font-weight: 700;
}

:where(ul, ol) {
  padding-left: 1.5rem;
}
```
