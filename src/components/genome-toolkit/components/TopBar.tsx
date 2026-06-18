// ============================================================
// components/TopBar.tsx — Top Information Bar
// ============================================================
//
// Horizontal bar above the main content panel showing:
//   - Active dataset name (or "No dataset loaded")
//   - Clear Dataset button
//   - Error banner (when store.error is set)
//
// Reads state from Zustand; triggers clearDataset action.
// ============================================================

import { useGenomeStore } from '../store/useGenomeStore';

export default function TopBar() {
  const dataset = useGenomeStore((s) => s.activeDataset);
  const error = useGenomeStore((s) => s.error);
  const clearDataset = useGenomeStore((s) => s.clearDataset);
  const setError = useGenomeStore((s) => s.setError);

  return (
    <div style={styles.topBar}>
      {/* Dataset indicator */}
      <div style={styles.datasetInfo}>
        <span style={styles.label}>Dataset:</span>
        {dataset ? (
          <>
            <span style={styles.datasetName}>{dataset.fileName}</span>
            <span style={styles.datasetMeta}>
              ({dataset.type} · {dataset.stats?.length.toLocaleString() ?? '?'} bp)
            </span>
            <button onClick={clearDataset} style={styles.clearBtn}>
              ✕ Clear
            </button>
          </>
        ) : (
          <span style={styles.noData}>No dataset loaded</span>
        )}
      </div>

      {/* Error banner — only visible when store.error is set */}
      {error && (
        <div style={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={styles.errorClose}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// ── Inline Styles ──────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  topBar: {
    borderBottom: '1px solid var(--clr-border)',
    background: 'var(--clr-surface)',
  },
  datasetInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '0.85rem',
    flexWrap: 'wrap',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
    textTransform: 'uppercase' as const,
    fontSize: '0.72rem',
    letterSpacing: '0.05em',
  },
  datasetName: {
    color: 'var(--clr-accent)',
    fontWeight: 600,
  },
  datasetMeta: {
    color: 'var(--clr-muted)',
    fontSize: '0.8rem',
  },
  noData: {
    color: 'var(--clr-muted)',
    fontStyle: 'italic',
  },
  clearBtn: {
    background: 'transparent',
    border: '1px solid var(--clr-border)',
    color: 'var(--clr-muted)',
    fontSize: '0.75rem',
    padding: '0.2rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    marginLeft: '0.5rem',
    transition: 'all 0.2s ease',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.6rem 1.5rem',
    background: 'rgba(255, 80, 80, 0.1)',
    borderTop: '1px solid rgba(255, 80, 80, 0.3)',
    color: '#ff6b6b',
    fontSize: '0.85rem',
  },
  errorClose: {
    background: 'transparent',
    border: 'none',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0 0.25rem',
  },
};
