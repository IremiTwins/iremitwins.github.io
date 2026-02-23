# iremitwins.github.io

**Live site → [iremitwins.com](https://iremitwins.com)**

Our personal portfolio and blog — built with plain HTML, CSS, and JavaScript and hosted for free on GitHub Pages.

---

## Table of Contents

1. [What this site is for](#what-this-site-is-for)
2. [How the site is hosted](#how-the-site-is-hosted)
3. [File & folder structure](#file--folder-structure)
4. [File-by-file guide](#file-by-file-guide)
   - [index.html](#indexhtml)
   - [CNAME](#cname)
   - [styles/main.css](#stylesmaincsss)
   - [scripts/main.js](#scriptsmainjs)
   - [blog/index.html](#blogindexhtml)
   - [blog/css-tips.html](#blogcss-tipshtml)
   - [blog/getting-started.html](#bloggetting-startedhtml)
5. [How to add a new blog post](#how-to-add-a-new-blog-post)
6. [How to update portfolio projects](#how-to-update-portfolio-projects)
7. [How to change colours or fonts](#how-to-change-colours-or-fonts)
8. [Viewing the site locally](#viewing-the-site-locally)
9. [Deploying changes](#deploying-changes)

---

## What this site is for

This is a shared portfolio and blog for the Iremi Twins. It has five main areas:

| Section | What it does |
|---|---|
| **Hero** | The big splash screen at the top — the first thing visitors see |
| **About** | Short bios for each twin, plus key skills |
| **Portfolio** | Cards showcasing projects we've built |
| **Work / Experience** | A timeline of freelance work and milestones |
| **Blog** | Written posts — tutorials, tips, and things we've learned |
| **Contact** | Email link and GitHub link so people can reach us |

---

## How the site is hosted

The site runs on **GitHub Pages**, a free service from GitHub that turns a repository directly into a public website.

- The repository is named `iremitwins.github.io`, which is the special pattern GitHub uses to recognise a "user site" repository.
- Every time you push (upload) a commit to the `main` branch, GitHub automatically publishes those changes to the live site — usually within a minute or two.
- There is no server to manage, no monthly bill, and no deployment process beyond a regular `git push`.

The custom domain `iremitwins.com` is wired up via DNS settings at your domain registrar (wherever you bought the domain) pointing at GitHub's servers. GitHub handles HTTPS (the padlock) automatically using a free certificate from [Let's Encrypt](https://letsencrypt.org/).

---

## File & folder structure

```
iremitwins.github.io/
│
├── index.html          ← The main page of the website
├── CNAME               ← Tells GitHub Pages to use iremitwins.com
├── README.md           ← This file
│
├── styles/
│   └── main.css        ← All the visual styling (colours, fonts, layout)
│
├── scripts/
│   └── main.js         ← Interactive behaviour (menu, animations, etc.)
│
└── blog/
    ├── index.html      ← Blog listing page (shows all posts)
    ├── css-tips.html   ← Post: "5 CSS tricks we use every day"
    └── getting-started.html  ← Post: "How we set up our GitHub Pages site"
```

> **Tip:** Every page on the site (`.html` file) is like a separate document. Styling for all of them lives in one shared CSS file so you only have to update one place to change the look.

---

## File-by-file guide

### `index.html`

**What it is:** The main page — the one visitors land on when they visit `iremitwins.com`.

**What it contains:** This is one long page split into sections:

| Section in the file | What you see on screen |
|---|---|
| `<section class="hero">` | The full-screen opening with the big headline |
| `<section class="about">` | Twin One and Twin Two bio cards |
| `<section class="portfolio">` | Project showcase cards |
| `<section class="work">` | Work/experience timeline |
| `<section class="blog">` | Three blog post previews |
| `<section class="contact">` | Email button and GitHub link |

**What an HTML file is:** HTML (HyperText Markup Language) is the skeleton of a webpage. It describes the *content* and *structure* — headings, paragraphs, links, images — using tags like `<h1>`, `<p>`, `<a>`, and so on. Think of it like a Word document but written in a special syntax that browsers understand.

**How to edit text content:** Open `index.html` in any text editor (VS Code, Notepad, etc.) and find the text you want to change. For example, to change "Twin One" to your real name, search for `Twin One` and replace it.

---

### `CNAME`

**What it is:** A tiny one-line text file containing only:
```
iremitwins.com
```

**Why it exists:** GitHub Pages needs this file to know which custom domain to respond to. Without it, the site would only be reachable at `iremitwins.github.io`. You should not need to edit this file.

---

### `styles/main.css`

**What it is:** The stylesheet — it controls everything *visual* about the site: colours, fonts, sizes, spacing, layout, and animations.

**What CSS is:** CSS (Cascading Style Sheets) is a separate language that describes how HTML content should *look*. HTML says "this is a heading"; CSS says "this heading should be white, 3rem tall, and bold". Keeping them separate means you can completely redesign the site without touching a single line of HTML content.

**Key things defined at the top (the "design tokens"):**

```css
:root {
  --clr-bg:      #0d0f14;   /* page background — very dark navy */
  --clr-accent:  #6c63ff;   /* purple highlight colour */
  --clr-text:    #e2e4ec;   /* main body text colour */
  --clr-muted:   #7a7f95;   /* dimmer text used for descriptions */
  ...
}
```

These are **CSS custom properties** (also called variables). They are defined once at the top and used throughout the rest of the file. To change the accent colour from purple to something else, you only need to change `--clr-accent` in one place and every button, link, and badge updates automatically.

**Main sections of the file:**

| Section | What it styles |
|---|---|
| Reset & tokens | Clears browser default margins/padding; defines design variables |
| Utilities | Reusable helpers: `.container` (max-width wrapper), `.section`, `.card`, `.btn` |
| Header / Nav | The sticky top navigation bar |
| Hero | The full-screen opening section |
| About | The twin bio cards |
| Portfolio | The project grid cards |
| Work / Timeline | The vertical timeline |
| Blog | Blog preview cards |
| Contact | Contact section and social links |
| Footer | The bottom bar |
| Blog pages | Styles specific to individual blog post pages |
| Responsive | Rules that change the layout on smaller screens (mobile/tablet) |

---

### `scripts/main.js`

**What it is:** A JavaScript file that adds interactive behaviour to the page. Without it, the page would still look correct — it just wouldn't move or respond to user actions.

**What JavaScript is:** If HTML is the skeleton and CSS is the skin, JavaScript is the muscles. It runs in the browser and can react to things the user does (clicking, scrolling, resizing the window) and update the page in response.

**What this file does, piece by piece:**

1. **Dynamic year in footer**
   Automatically sets the copyright year in the footer to the current year. This means you'll never have to manually update "© 2026" to "© 2027" — it just happens.

2. **Sticky header**
   Watches for the user scrolling down. Once they scroll more than 20 pixels, it adds a semi-transparent frosted-glass background to the navigation bar so it stays readable against whatever section is behind it.

3. **Mobile nav toggle**
   On small screens the navigation links are hidden and replaced with a ☰ "hamburger" button. This code shows/hides the links when that button is clicked, and also closes the menu automatically when a link is tapped.

4. **Scroll-in animations**
   Uses the browser's built-in `IntersectionObserver` API to watch for elements with a `data-animate` attribute. When one of those elements scrolls into view, it fades and slides up into place. Cards within the same row stagger slightly (80 ms apart) so they animate in one-by-one rather than all at once.

5. **Active nav link highlighting**
   Watches which section of the page is currently visible and adds a highlight to the corresponding nav link. For example, when you scroll to the Blog section, the "Blog" link in the header becomes brighter.

---

### `blog/index.html`

**What it is:** The blog listing page — accessible by clicking "All posts →" on the homepage or navigating to `iremitwins.com/blog/`.

**What it contains:** A simple list of all blog posts with a title, date, tag, and short summary for each one. When a new post is written, a new entry should be added to this list.

---

### `blog/css-tips.html`

**What it is:** The first blog post: *"5 CSS tricks we use every day"*.

**What it covers:** Five practical CSS features with code examples — custom properties, `clamp()` for fluid font sizing, `aspect-ratio`, `gap`, and the `:is()`/`:where()` selectors.

**Note on the path:** Because this file is inside the `blog/` folder, it uses `../styles/main.css` to load the stylesheet (the `../` means "go up one folder level").

---

### `blog/getting-started.html`

**What it is:** The second blog post: *"How we set up our GitHub Pages site"*.

**What it covers:** A step-by-step walkthrough of creating the repository, adding the CNAME file, building with vanilla HTML/CSS/JS, and enabling HTTPS.

---

## How to add a new blog post

1. **Copy an existing post** as a starting point. For example, duplicate `blog/css-tips.html` and rename it to something like `blog/my-new-post.html`.

2. **Edit the content** inside the `<article class="post-content">` block:
   - Change the `<title>` and `<meta name="description">` at the top.
   - Update the date, tag, and heading.
   - Replace the body paragraphs, headings, and code blocks with your own content.

3. **Link to it from the blog listing page** — open `blog/index.html` and add a new `<li>` entry inside the `<ul class="blog-page__list">` list, following the same pattern as the existing ones.

4. **Optionally add a preview on the homepage** — open `index.html`, find the `<section class="blog">`, and update or add a card inside `<div class="blog__grid">`.

5. **Push your changes** — see [Deploying changes](#deploying-changes) below.

---

## How to update portfolio projects

Open `index.html` and find the `<section class="portfolio">` section. Each project is an `<article class="project-card card">` block. You can:

- **Edit the title and description** directly in the HTML.
- **Change the type label** (e.g. "Web App", "Portfolio Site") in the `<span class="project-card__type">` tag.
- **Update the links** — replace the `href="#"` placeholder values on the GitHub and live-demo icon links with real URLs.
- **Update the tech tags** — the `<div class="project-card__tech">` contains `<span>` tags for each technology used.
- **Add a new project** — copy an entire `<article class="project-card card">` block and paste it below the last one.

---

## How to change colours or fonts

All colours and fonts are defined as variables at the very top of `styles/main.css`, inside the `:root { }` block. Change a value there and it updates everywhere on the site instantly.

**To change the accent colour** (currently purple `#6c63ff`):
```css
--clr-accent: #6c63ff;   /* change this hex code */
```

**To change the background** (currently near-black `#0d0f14`):
```css
--clr-bg: #0d0f14;   /* change this hex code */
```

Hex codes are six-character colour codes — you can pick any colour from a tool like [coolors.co](https://coolors.co) or [htmlcolorcodes.com](https://htmlcolorcodes.com).

**To change the font**, update the `--font-sans` variable and the Google Fonts `<link>` in `index.html`. Google Fonts ([fonts.google.com](https://fonts.google.com)) provides thousands of free web fonts with ready-to-paste code.

---

## Viewing the site locally

You don't need to push to GitHub every time you want to see a change. You can preview the site on your own computer first.

**Option 1 — VS Code Live Server (recommended):**
1. Install [VS Code](https://code.visualstudio.com/) if you haven't already.
2. Install the **Live Server** extension (search for it in the Extensions panel).
3. Right-click `index.html` in the VS Code file explorer and choose **"Open with Live Server"**.
4. Your browser will open at `http://127.0.0.1:5500/` and will automatically refresh whenever you save a file.

**Option 2 — Python (if you have Python installed):**
1. Open a terminal and `cd` into the project folder.
2. Run `python3 -m http.server 8080`.
3. Open `http://localhost:8080` in your browser.

> **Why not just double-click the HTML file?** Opening a file directly from your file system uses the `file://` protocol, which blocks some browser features. A local server (either of the options above) uses the proper `http://` protocol and behaves like the real live site.

---

## Deploying changes

Because the site is on GitHub Pages, deploying is just committing and pushing:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

GitHub will detect the new commit and rebuild the live site automatically. Changes are usually visible within 1–2 minutes. You can check the status in the **Actions** tab of the GitHub repository.

---

> Built with ❤️ using vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, just the web platform.
