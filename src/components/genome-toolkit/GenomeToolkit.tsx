// ============================================================
// GenomeToolkit.tsx — Main App Shell (Root React Component)
// ============================================================
//
// This is the top-level React component that assembles the
// Genome Toolkit application. It renders:
//   - Sidebar (left navigation)
//   - TopBar (dataset indicator + error banner)
//   - Active tool module (based on store.activeView)
//
// ARCHITECTURE:
// This component is rendered inside an Astro page using the
// `client:only="react"` directive, meaning it runs entirely
// in the browser with no server-side rendering.
//
// LAYOUT:
//   ┌──────────┬─────────────────────────┐
//   │          │  TopBar                  │
//   │ Sidebar  ├─────────────────────────┤
//   │          │  Active Module           │
//   │          │  (LoadData, Analyzer,    │
//   │          │   Motif, GC, Variants)   │
//   └──────────┴─────────────────────────┘
//
// SDD Reference: Section 3 — System Overview, Section 7 — UI Design
// ============================================================

import { useGenomeStore } from './store/useGenomeStore';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Tool modules
import LoadData from './modules/LoadData';
import SequenceAnalyzer from './modules/SequenceAnalyzer';
import MotifFinder from './modules/MotifFinder';
import GCVisualizer from './modules/GCVisualizer';
import VariantComparator from './modules/VariantComparator';

/**
 * Maps the active view key to the corresponding module component.
 * Adding a new tool module? Add its entry here and in the Sidebar.
 */
const MODULE_MAP: Record<string, React.FC> = {
  load: LoadData,
  analyzer: SequenceAnalyzer,
  motif: MotifFinder,
  gc: GCVisualizer,
  variants: VariantComparator,
};

export default function GenomeToolkit() {
  const activeView = useGenomeStore((s) => s.activeView);

  // Resolve the active module component
  const ActiveModule = MODULE_MAP[activeView] ?? LoadData;

  return (
    <div style={styles.shell}>
      {/* Left sidebar navigation */}
      <Sidebar />

      {/* Right side: TopBar + module content */}
      <div style={styles.main}>
        <TopBar />
        <div style={styles.content}>
          <ActiveModule />
        </div>
      </div>
    </div>
  );
}

// ── Inline Styles ──────────────────────────────────────────────
// The app shell layout uses CSS Grid for the sidebar + main split.
// Responsive: on screens narrower than 768px, the sidebar moves
// to a horizontal bar at the top (handled via media query in the
// Astro page's <style> tag).
const styles: Record<string, React.CSSProperties> = {
  shell: {
    display: 'flex',
    minHeight: 'calc(100vh - 5rem)', // Full height minus header clearance
    background: 'var(--clr-bg)',
    color: 'var(--clr-text)',
    fontFamily: 'var(--font-sans)',
    borderTop: '1px solid var(--clr-border)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0, // Prevents flex children from overflowing
  },
  content: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
  },
};
