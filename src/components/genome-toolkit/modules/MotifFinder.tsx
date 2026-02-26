// ============================================================
// modules/MotifFinder.tsx — Motif Search Module
// ============================================================
//
// Lets users search for a motif (short DNA pattern) within
// the loaded sequence. Displays:
//   - Total match count
//   - List of match positions with surrounding context
//   - Highlighted motif matches in the sequence preview
//
// Uses findMotif() from motifSearch.ts for search logic.
// Highlights are passed to SequencePreview for visual feedback.
//
// SDD Reference: FR-7, FR-8, FR-9, FR-10
// ============================================================

import { useState, useMemo } from 'react';
import { useGenomeStore } from '../store/useGenomeStore';
import { findMotif } from '../services/motifSearch';
import SequencePreview from '../components/SequencePreview';
import type { MotifMatch } from '../types';

export default function MotifFinder() {
  const dataset = useGenomeStore((s) => s.activeDataset);
  const setActiveView = useGenomeStore((s) => s.setActiveView);

  const [motif, setMotif] = useState('');
  const [matches, setMatches] = useState<MotifMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // ── No data loaded ─────────────────────────────────────────
  if (!dataset) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Motif Finder</h2>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No sequence data loaded.</p>
          <button onClick={() => setActiveView('load')} style={styles.loadBtn}>
            Load Data →
          </button>
        </div>
      </div>
    );
  }

  /**
   * Run the motif search when the user clicks "Search".
   */
  const handleSearch = () => {
    if (!motif.trim()) return;
    const results = findMotif(dataset.sequence, motif.trim());
    setMatches(results);
    setHasSearched(true);
  };

  /**
   * Handle Enter key in the input field.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  /**
   * Build highlight ranges (0-based start + length) for SequencePreview.
   * Converts 1-based motif positions to 0-based.
   */
  const highlights = useMemo(
    () =>
      matches.map((m) => ({
        start: m.position - 1, // Convert 1-based → 0-based
        length: motif.length,
      })),
    [matches, motif]
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Motif Finder</h2>
      <p style={styles.subtitle}>
        Search for a DNA motif (pattern) in the loaded sequence.
        Positions use 1-based indexing.
      </p>

      {/* ── Search input ──────────────────────────────────────── */}
      <div style={styles.searchRow}>
        <input
          type="text"
          value={motif}
          onChange={(e) => setMotif(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="Enter motif (e.g. ATCG, TATA, GAATTC)"
          style={styles.input}
          aria-label="Motif search input"
        />
        <button
          onClick={handleSearch}
          disabled={!motif.trim()}
          style={{
            ...styles.searchBtn,
            ...(!motif.trim() ? styles.searchBtnDisabled : {}),
          }}
        >
          Search
        </button>
      </div>

      {/* ── Results ───────────────────────────────────────────── */}
      {hasSearched && (
        <div style={styles.results}>
          {/* Match count summary */}
          <div style={styles.resultSummary}>
            <span style={styles.resultCount}>{matches.length}</span>
            <span style={styles.resultLabel}>
              {matches.length === 1 ? 'match' : 'matches'} found for{' '}
              <strong style={{ color: 'var(--clr-accent)' }}>{motif}</strong>
            </span>
          </div>

          {/* Match list — scrollable if many results */}
          {matches.length > 0 && (
            <div style={styles.matchList}>
              <div style={styles.matchListHeader}>
                <span style={styles.matchColPos}>Position</span>
                <span style={styles.matchColCtx}>Context</span>
              </div>
              <div style={styles.matchListBody}>
                {matches.map((match, idx) => (
                  <div key={idx} style={styles.matchRow}>
                    <span style={styles.matchPos}>{match.position.toLocaleString()}</span>
                    <code style={styles.matchCtx}>{match.context}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sequence preview with highlights */}
          {matches.length > 0 && (
            <SequencePreview
              sequence={dataset.sequence}
              maxBases={500}
              highlights={highlights}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── Inline Styles ──────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '780px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
    color: 'var(--clr-text)',
  },
  subtitle: {
    color: 'var(--clr-muted)',
    fontSize: '0.88rem',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    background: 'var(--clr-surface)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius)',
  },
  emptyText: {
    color: 'var(--clr-muted)',
    marginBottom: '1rem',
  },
  loadBtn: {
    background: 'var(--clr-accent)',
    color: 'var(--clr-white)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '0.55rem 1.2rem',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  },
  searchRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 1,
    padding: '0.6rem 1rem',
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--clr-text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.88rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  searchBtn: {
    background: 'var(--clr-accent)',
    color: 'var(--clr-white)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '0.6rem 1.5rem',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'background 0.2s ease',
    whiteSpace: 'nowrap',
  },
  searchBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  results: {
    marginTop: '0.5rem',
  },
  resultSummary: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  resultCount: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: 'var(--clr-accent)',
  },
  resultLabel: {
    fontSize: '0.92rem',
    color: 'var(--clr-muted)',
  },
  matchList: {
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  matchListHeader: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr',
    gap: '1rem',
    padding: '0.6rem 1rem',
    borderBottom: '1px solid var(--clr-border)',
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  matchColPos: {},
  matchColCtx: {},
  matchListBody: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  matchRow: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr',
    gap: '1rem',
    padding: '0.5rem 1rem',
    borderBottom: '1px solid var(--clr-border)',
    fontSize: '0.84rem',
    alignItems: 'center',
  },
  matchPos: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-accent)',
    fontWeight: 600,
  },
  matchCtx: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
    fontSize: '0.8rem',
    wordBreak: 'break-all',
  },
};
