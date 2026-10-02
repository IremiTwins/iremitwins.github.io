# iremitwins.com

The Iremi twins' website: a shared hub plus a section for each brother.
Built with [Astro 7](https://astro.build), deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build into dist/
```

## Where things live

| To change… | Edit |
| --- | --- |
| Names, taglines, nav menus, email | `src/data/site.ts` |
| Nika's publications | `src/data/publications.bib` (Science page rebuilds from it) |
| Nika's career timeline | `career` array at the top of `src/pages/nika/science.astro` |
| Blog posts | add a `.md` file to `src/content/blog/` (`tag: "Nika"` or `"Gio"`) |
| Reviews | add a `.md` file to `src/content/reviews/<nika or gio>/` (`kind: anime` or `game`) |
| Maker projects | add a `.md` file to `src/content/maker/` |
| Colours, fonts, card style | `src/styles/global.css` |

Frontmatter fields for each content type are defined (and validated) in `src/content.config.ts`.
Set `draft: true` to keep something in the repo without publishing it.

## Old links

URLs from the first version (`/twin1`, `/twin2/...`) redirect to their new homes; see `redirects` in `astro.config.mjs`.
