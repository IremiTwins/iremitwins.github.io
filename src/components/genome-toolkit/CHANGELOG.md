# Genome Toolkit — CHANGELOG

> Feature log tracking what has been built, organized by SDD milestone.  
> Each entry lists the files created and which SDD requirements they satisfy.

---

## v0.1.0 — Initial Build (All 4 Milestones)

### Milestone 1: App Shell + FASTA Parsing + Sequence Statistics

| File | Purpose | SDD Refs |
|------|---------|----------|
| `types/index.ts` | All TypeScript interfaces and type definitions | §6 Data Models |
| `store/useGenomeStore.ts` | Zustand global state (active dataset, views, errors) | §3, §7 |
| `services/fastaParser.ts` | FASTA file parsing (header + sequence extraction) | FR-1, FR-2, FR-3 |
| `services/fastqParser.ts` | FASTQ file parsing (+ Phred quality decoding) | FR-1, FR-2, FR-3, FR-5 |
| `services/statsCalculator.ts` | Sequence statistics (length, GC%, N%, base counts, quality) | FR-4, FR-5 |
| `components/FileUploader.tsx` | Drag-and-drop file upload with validation | FR-1, FR-2, FR-3 |
| `components/TopBar.tsx` | Dataset indicator bar + error banner | §7 |
| `components/Sidebar.tsx` | Left navigation with 5 tool buttons | §7 |
| `modules/LoadData.tsx` | File upload screen with format info + success summary | FR-1, FR-2, FR-3 |
| `modules/SequenceAnalyzer.tsx` | Stats display: length, GC%, base bars, preview | FR-4, FR-5, FR-6 |
| `GenomeToolkit.tsx` | Root app shell (sidebar + topbar + module router) | §3, §7 |

### Milestone 2: Motif Finder

| File | Purpose | SDD Refs |
|------|---------|----------|
| `services/motifSearch.ts` | Case-insensitive literal motif matching with context | FR-7, FR-8, FR-9 |
| `components/SequencePreview.tsx` | Sequence display with configurable highlighting | FR-6, FR-10 |
| `modules/MotifFinder.tsx` | Motif input, result list, highlighted preview | FR-7, FR-8, FR-9, FR-10 |

### Milestone 3: GC Sliding Window Visualizer

| File | Purpose | SDD Refs |
|------|---------|----------|
| `services/gcCalculator.ts` | Sliding window GC% calculation (O(n) optimized) | FR-11, FR-12 |
| `modules/GCVisualizer.tsx` | Interactive Chart.js line chart with hover inspection | FR-11, FR-12, FR-13, FR-14 |

### Milestone 4: Variant Comparator

| File | Purpose | SDD Refs |
|------|---------|----------|
| `services/csvParser.ts` | CSV parsing with column validation | FR-15 |
| `services/variantCompare.ts` | Set-based variant comparison (shared/unique) | FR-16, FR-17 |
| `services/exportCSV.ts` | CSV export via Blob download | FR-18 |
| `modules/VariantComparator.tsx` | Dual upload, summary cards, tabbed table, export | FR-15, FR-16, FR-17, FR-18 |

### Integration

| File | Purpose |
|------|---------|
| `pages/twin2/genome-toolkit.astro` | Astro page hosting the React app at `/twin2/genome-toolkit` |
| `pages/twin2.astro` | Updated: added Genome Toolkit project card linking to the app |

---

## Architecture Decisions

- **React + TypeScript** inside Astro island (`client:only="react"`) — matches SDD tech stack
- **Zustand** over React Context — lighter, no provider wrapper, no re-render cascading
- **Chart.js + react-chartjs-2** over Recharts — smaller bundle for single chart use
- **Pure function services** — all parsing/computation is decoupled from React for testability
- **Inline styles with CSS variables** — scoped to components, automatically matches site theme
- **File size limits** — configurable via `DEFAULT_SIZE_LIMITS` in `types/index.ts`
- **Incremental GC calculation** — O(n) sliding window instead of O(n × w) naive approach

---

## File Tree

```
src/components/genome-toolkit/
├── CHANGELOG.md                 ← You are here
├── GenomeToolkit.tsx             ← Root app shell
├── types/
│   └── index.ts                 ← All TypeScript type definitions
├── store/
│   └── useGenomeStore.ts        ← Zustand global state store
├── services/
│   ├── fastaParser.ts           ← FASTA file parser
│   ├── fastqParser.ts           ← FASTQ file parser
│   ├── statsCalculator.ts       ← Sequence statistics calculator
│   ├── motifSearch.ts           ← Motif search engine
│   ├── gcCalculator.ts          ← GC sliding window calculator
│   ├── csvParser.ts             ← Variant CSV parser
│   ├── variantCompare.ts        ← Variant dataset comparator
│   └── exportCSV.ts             ← CSV export utility
├── components/
│   ├── Sidebar.tsx              ← Left navigation panel
│   ├── TopBar.tsx               ← Dataset indicator + error bar
│   ├── FileUploader.tsx         ← Drag-and-drop file upload
│   └── SequencePreview.tsx      ← Sequence display with highlighting
└── modules/
    ├── LoadData.tsx             ← File upload module
    ├── SequenceAnalyzer.tsx     ← Sequence statistics module
    ├── MotifFinder.tsx          ← Motif search module
    ├── GCVisualizer.tsx         ← GC sliding window visualizer
    └── VariantComparator.tsx    ← Variant comparison module
```
