# Rank & File — audio folder

Status (2026-10-03): 17 sampled cues and 8 ambience beds from the free Sonniss GDC 2026 bundle are
in `sfx/` and `music/` and named in `manifest.json` (3.4 MB total; see `../CREDITS.md` for sources and
`../tools/sonniss-cut.py` for how they were cut). Composed music is still open: replace the `music/`
beds with real tracks under the same keys when you have them.

Originally the game had no audio files of its own: every sound effect is synthesised in the browser,
and there is no music until files are placed here. This folder sits beside the game page
(`rank-and-file.html` locally, `/rank-and-file/` on the site) and is read once at start-up
through `audio/manifest.json`. If the manifest is missing or empty, the game stays synth-only
and silent of music. Nothing breaks. (A page opened straight from disk as `file://` cannot
read beside itself; the site build and any local web server can.)

## manifest.json

```json
{
  "sfx":   { "hit": "sfx/hit.ogg", "swing": "sfx/swing.ogg" },
  "music": { "title": "music/title.mp3", "map": "music/map.mp3", "battle": "music/battle.mp3",
             "boss": "music/boss.mp3", "camp": "music/camp.mp3",
             "victory": "music/victory.mp3", "defeat": "music/defeat.mp3" },
  "credits": [ { "what": "Music", "who": "Alexander Nakarada (CreatorChords)", "license": "CC BY 4.0", "url": "https://creatorchords.com" } ]
}
```

Only the keys you fill are used; every other cue keeps its synthesised sound. `credits`
entries are shown on the game's Credits screen — put every licensed file's author and
license there (CC BY requires it).

### Music keys

`title`, `map`, `battle`, `boss`, `camp`, `victory`, `defeat`. A key may carry an act number
for a per-act track (`map1`, `map2`, `map3`, `battle2`, `boss3`…); the plain key is the
fallback for every act. Tracks loop except `victory` and `defeat`. Crossfade is 0.9 s.
MP3 or OGG, roughly 1–3 MB per track at 128 kbps is plenty; keep the whole folder under
~25 MB so the site stays quick.

### SFX keys

Combat: `swing` (melee whoosh), `hit` (steel impact), `arrow`, `spell`, `burn`, `kill`,
`heal`, `ability`, `alert` (pack wakes), `deploy` (battle begins).
Progression: `level`, `cape` (recovered), `banner` (raised), `win`, `lose`.
Interface: `click`, `coin`.
Short OGG files (50–400 ms, under ~60 KB each). The Sonniss GDC bundles are royalty-free with
no attribution and cover every one of these; Kenney's packs are CC0.

## Licensing rules for this folder

- Never commit a whole purchased pack here or anywhere in the public site repository — only
  the files the game actually plays. GameDev Market and similar licenses forbid
  redistributing the raw assets and are personal to the purchaser.
- CC BY material needs the author and license in `credits`. CC0 needs nothing but is still
  worth listing.
- The claude.ai artifact copy of the game is self-contained and never loads this folder.
