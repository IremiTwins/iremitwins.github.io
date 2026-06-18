// ============================================================
// components/Sidebar.tsx — Left Navigation Panel
// ============================================================
//
// Vertical sidebar with 5 tool navigation buttons.
// The active tool is highlighted with the accent color.
// Reads/writes activeView from the Zustand store.
//
// STYLING:
// Uses inline styles referencing CSS variables from global.css
// so the sidebar automatically matches the site's theme.
// ============================================================

import { useGenomeStore } from '../store/useGenomeStore';
import type { ToolView } from '../types';

/** Sidebar navigation items — label + icon + store key */
const NAV_ITEMS: { view: ToolView; label: string; icon: string }[] = [
  { view: 'load',     label: 'Load Data',          icon: '📂' },
  { view: 'analyzer', label: 'Sequence Analyzer',   icon: '🧬' },
  { view: 'motif',    label: 'Motif Finder',        icon: '🔍' },
  { view: 'gc',       label: 'GC Visualizer',       icon: '📊' },
  { view: 'variants', label: 'Variant Comparator',  icon: '⚖️' },
];

export default function Sidebar() {
  const activeView = useGenomeStore((s) => s.activeView);
  const setActiveView = useGenomeStore((s) => s.setActiveView);

  return (
    <nav style={styles.sidebar} aria-label="Genome Toolkit navigation">
      {/* App branding */}
      <div style={styles.brand}>
        <span style={styles.brandIcon}>🧬</span>
        <span style={styles.brandText}>Genome Toolkit</span>
      </div>

      {/* Navigation buttons */}
      <ul style={styles.navList}>
        {NAV_ITEMS.map(({ view, label, icon }) => {
          const isActive = activeView === view;
          return (
            <li key={view}>
              <button
                onClick={() => setActiveView(view)}
                style={{
                  ...styles.navButton,
                  ...(isActive ? styles.navButtonActive : {}),
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <span style={styles.navIcon}>{icon}</span>
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Version label at bottom */}
      <div style={styles.version}>v0.1</div>
    </nav>
  );
}

// ── Inline Styles ──────────────────────────────────────────────
// Uses CSS variable references so the sidebar respects the global theme.
const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '240px',
    minHeight: '100%',
    background: 'var(--clr-surface)',
    borderRight: '1px solid var(--clr-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 0',
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0 1.25rem',
    marginBottom: '2rem',
  },
  brandIcon: {
    fontSize: '1.4rem',
  },
  brandText: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: 'var(--clr-text)',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
  },
  navButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 1.25rem',
    background: 'transparent',
    border: 'none',
    borderLeft: '3px solid transparent',
    color: 'var(--clr-muted)',
    fontSize: '0.88rem',
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left' as const,
  },
  navButtonActive: {
    color: 'var(--clr-text)',
    background: 'rgba(108, 99, 255, 0.08)',
    borderLeftColor: 'var(--clr-accent)',
  },
  navIcon: {
    fontSize: '1.1rem',
    width: '1.5rem',
    textAlign: 'center' as const,
  },
  version: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    color: 'var(--clr-muted)',
    padding: '0 1.25rem',
    marginTop: 'auto',
  },
};
