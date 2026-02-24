---
# ============================================================
# src/content/blog/getting-started.md — Blog Post
# ============================================================
#
# See css-tips.md for full instructions on creating new posts.
# ============================================================

title: "How we set up our GitHub Pages site"
description: "From empty repo to live site — what we did and what we learned."
date: 2026-01-20
tag: "Web Dev"
prevPost: "css-tips"
---

From empty repo to live site — what we did and what we learned.

## Why GitHub Pages?

GitHub Pages is a natural fit for a portfolio site: it's free, tied directly to
your source code, and deploying is as simple as pushing a commit. For a
front-end-only site there's no better option to start with.

## Step 1 — Create the repository

The key is naming the repository `<username>.github.io`. GitHub
automatically serves the `main` branch of that repo at
`https://<username>.github.io`.

We created **IremiTwins/iremitwins.github.io** and ticked
"Initialize with a README" to get started immediately.

## Step 2 — Add a `CNAME` file for the custom domain

To use **iremitwins.com** instead of the default
`iremitwins.github.io` URL, we added a file called `CNAME`
to the root of the repository containing just one line:

```
iremitwins.com
```

Then we updated our DNS registrar to point the domain at GitHub's servers using
the recommended `A` records (or a `CNAME` record for `www`).

## Step 3 — Build the site with vanilla HTML/CSS/JS

We deliberately kept things dependency-free. No build step means:

- Zero configuration overhead
- Instant deploys on every push
- Fast page loads — no framework JavaScript to ship
- Easy to understand and maintain

## Step 4 — Enable HTTPS

Once DNS propagated, we ticked "Enforce HTTPS" in the repository's Pages settings.
GitHub provisions a Let's Encrypt certificate automatically — nothing else to do.

## That's it!

The whole setup took less than an hour. If you want to do the same, the
[GitHub Pages documentation](https://docs.github.com/en/pages) is comprehensive
and easy to follow.
