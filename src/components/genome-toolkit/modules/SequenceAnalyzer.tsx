// ============================================================
// modules/SequenceAnalyzer.tsx — Sequence Statistics Module
// ============================================================
//
// Displays computed statistics for the active dataset:
//   - Sequence length, GC%, N%
//   - Base composition (A, T, C, G, N counts)
//   - Mean quality score (FASTQ only)
//   - Sequence preview (first 500 bases)
//
// All stats are pre-computed during file loading (see LoadData.tsx)
// and read directly from the Zustand store.
//
// SDD Reference: FR-4, FR-5, FR-6
// ============================================================

import { useGenomeStore } from '../store/useGenomeStore';
import SequencePreview from '../components/SequencePreview';

export default function SequenceAnalyzer() {
  const dataset = useGenomeStore((s) => s.activeDataset);
  const setActiveView = useGenomeStore((s) => s.setActiveView);

  // ── No data loaded — prompt the user to upload ─────────────
  if (!dataset || !dataset.stats) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Sequence Analyzer</h2>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No sequence data loaded.</p>
          <button
            onClick={() => setActiveView('load')}
            style={styles.loadBtn}
          >
            Load Data →
          </button>
        </div>
      </div>
    );
  }

  const { stats } = dataset;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sequence Analyzer</h2>
      <p style={styles.subtitle}>
        Statistics for <strong>{dataset.fileName}</strong>
      </p>

      {/* ── Summary stats grid ──────────────────────────────── */}
      <div style={styles.statsGrid}>
        <StatCard label="Sequence Length" value={`${stats.length.toLocaleString()} bp`} />
        <StatCard label="GC Content" value={`${stats.gcPercent}%`} accent />
        <StatCard label="N Content" value={`${stats.nPercent}%`} />
        {stats.meanQuality !== undefined && (
          <StatCard label="Mean Quality (Phred)" value={`${stats.meanQuality}`} accent />
        )}
      </div>

      {/* ── Base composition breakdown ──────────────────────── */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Base Composition</h3>
        <div style={styles.baseGrid}>
          {Object.entries(stats.baseCounts).map(([base, count]) => {
            const percent = stats.length > 0 ? ((count / stats.length) * 100).toFixed(1) : '0';
            return (
              <div key={base} style={styles.baseItem}>
                <span style={styles.baseLetter}>{base}</span>
                <div style={styles.baseBar}>
                  <div
                    style={{
                      ...styles.baseBarFill,
                      width: `${percent}%`,
                      background: baseColor(base),
                    }}
                  />
                </div>
                <span style={styles.baseCount}>
                  {count.toLocaleString()} ({percent}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Header info ─────────────────────────────────────── */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Sequence Header</h3>
        <code style={styles.header}>{dataset.header}</code>
      </div>

      {/* ── Sequence preview (first 500 bp) ─────────────────── */}
      <div style={styles.section}>
        <SequencePreview sequence={dataset.sequence} maxBases={500} />
      </div>
    </div>
  );
}

// ── Helper Components ────────────────────────────────────────────

/** A single stat display card */
function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <span style={{ ...styles.statValue, ...(accent ? { color: 'var(--clr-accent)' } : {}) }}>
        {value}
      </span>
    </div>
  );
}

/** Map base letters to visual colors for the bar chart */
function baseColor(base: string): string {
  const colors: Record<string, string> = {
    A: '#4ade80',  // Green — Adenine
    T: '#f97316',  // Orange — Thymine
    C: '#3b82f6',  // Blue — Cytosine
    G: '#eab308',  // Yellow — Guanine
    N: '#6b7280',  // Gray — Unknown
  };
  return colors[base] ?? 'var(--clr-muted)';
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  statLabel: {
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--clr-text)',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-accent)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
  },
  baseGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  baseItem: {
    display: 'grid',
    gridTemplateColumns: '2rem 1fr 140px',
    alignItems: 'center',
    gap: '0.75rem',
  },
  baseLetter: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '1rem',
    color: 'var(--clr-text)',
    textAlign: 'center' as const,
  },
  baseBar: {
    height: '8px',
    background: 'var(--clr-border)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  baseBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  baseCount: {
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
    textAlign: 'right' as const,
  },
  header: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    color: 'var(--clr-muted)',
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    padding: '0.6rem 1rem',
    borderRadius: 'var(--radius-sm)',
    display: 'block',
    wordBreak: 'break-all',
  },
};
