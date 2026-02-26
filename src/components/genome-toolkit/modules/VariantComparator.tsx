// ============================================================
// modules/VariantComparator.tsx — Variant Dataset Comparator
// ============================================================
//
// Compares two CSV variant files and displays:
//   - Summary counts (shared, unique to A, unique to B)
//   - Tabbed comparison table
//   - CSV export for each result set
//
// This module operates independently of the sequence dataset —
// it uses its own file uploads for variant CSV data.
//
// SDD Reference: FR-15, FR-16, FR-17, FR-18
// ============================================================

import { useState, useCallback } from 'react';
import { useGenomeStore } from '../store/useGenomeStore';
import { parseVariantCSV } from '../services/csvParser';
import { compareVariants } from '../services/variantCompare';
import { exportToCSV } from '../services/exportCSV';
import FileUploader from '../components/FileUploader';
import type { Variant, VariantComparison } from '../types';
import { DEFAULT_SIZE_LIMITS } from '../types';

/** Tab names for the comparison results table */
type ResultTab = 'shared' | 'uniqueA' | 'uniqueB';

export default function VariantComparator() {
  const setError = useGenomeStore((s) => s.setError);

  const [variantsA, setVariantsA] = useState<Variant[] | null>(null);
  const [variantsB, setVariantsB] = useState<Variant[] | null>(null);
  const [comparison, setComparison] = useState<VariantComparison | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>('shared');
  const [fileNameA, setFileNameA] = useState<string>('');
  const [fileNameB, setFileNameB] = useState<string>('');

  /**
   * Handle CSV file upload for slot A or B.
   * Parses the CSV and stores the variant array.
   */
  const handleFileLoaded = useCallback(
    (slot: 'A' | 'B') => (text: string, fileName: string) => {
      try {
        const variants = parseVariantCSV(text, fileName);
        if (slot === 'A') {
          setVariantsA(variants);
          setFileNameA(fileName);
        } else {
          setVariantsB(variants);
          setFileNameB(fileName);
        }
        setComparison(null); // Reset comparison when files change
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV.');
      }
    },
    [setError]
  );

  /**
   * Run the comparison when both files are loaded.
   */
  const handleCompare = () => {
    if (!variantsA || !variantsB) return;
    const result = compareVariants(variantsA, variantsB);
    setComparison(result);
    setActiveTab('shared');
  };

  /**
   * Export the currently visible result tab as CSV.
   */
  const handleExport = () => {
    if (!comparison) return;
    const dataMap: Record<ResultTab, Variant[]> = {
      shared: comparison.shared,
      uniqueA: comparison.uniqueToA,
      uniqueB: comparison.uniqueToB,
    };
    const nameMap: Record<ResultTab, string> = {
      shared: 'shared_variants.csv',
      uniqueA: `unique_to_${fileNameA.replace('.csv', '')}.csv`,
      uniqueB: `unique_to_${fileNameB.replace('.csv', '')}.csv`,
    };
    exportToCSV(dataMap[activeTab], nameMap[activeTab]);
  };

  /** Get the variant array for the active tab */
  const activeData: Variant[] = comparison
    ? activeTab === 'shared'
      ? comparison.shared
      : activeTab === 'uniqueA'
        ? comparison.uniqueToA
        : comparison.uniqueToB
    : [];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Variant Comparator</h2>
      <p style={styles.subtitle}>
        Upload two CSV variant files to compare. Each CSV must have columns:{' '}
        <code style={styles.code}>chrom, pos, ref, alt</code>
      </p>

      {/* ── File uploads side by side ─────────────────────────── */}
      <div style={styles.uploadGrid}>
        <div>
          <h3 style={styles.fileLabel}>File A</h3>
          <FileUploader
            accept=".csv"
            maxSizeMB={DEFAULT_SIZE_LIMITS.maxCsvSizeMB}
            onFileLoaded={handleFileLoaded('A')}
            label="Drop variant CSV (File A)"
          />
          {variantsA && (
            <p style={styles.fileInfo}>{variantsA.length} variants loaded</p>
          )}
        </div>
        <div>
          <h3 style={styles.fileLabel}>File B</h3>
          <FileUploader
            accept=".csv"
            maxSizeMB={DEFAULT_SIZE_LIMITS.maxCsvSizeMB}
            onFileLoaded={handleFileLoaded('B')}
            label="Drop variant CSV (File B)"
          />
          {variantsB && (
            <p style={styles.fileInfo}>{variantsB.length} variants loaded</p>
          )}
        </div>
      </div>

      {/* ── Compare button ────────────────────────────────────── */}
      <div style={styles.compareRow}>
        <button
          onClick={handleCompare}
          disabled={!variantsA || !variantsB}
          style={{
            ...styles.compareBtn,
            ...(!variantsA || !variantsB ? styles.compareBtnDisabled : {}),
          }}
        >
          Compare Variants
        </button>
      </div>

      {/* ── Results ───────────────────────────────────────────── */}
      {comparison && (
        <div style={styles.results}>
          {/* Summary cards */}
          <div style={styles.summaryGrid}>
            <SummaryCard
              label="Shared"
              count={comparison.summary.sharedCount}
              color="var(--clr-accent)"
            />
            <SummaryCard
              label={`Unique to A`}
              count={comparison.summary.uniqueToACount}
              color="#4ade80"
            />
            <SummaryCard
              label={`Unique to B`}
              count={comparison.summary.uniqueToBCount}
              color="#f97316"
            />
          </div>

          {/* Tab buttons */}
          <div style={styles.tabRow}>
            {(['shared', 'uniqueA', 'uniqueB'] as ResultTab[]).map((tab) => {
              const labels: Record<ResultTab, string> = {
                shared: 'Shared',
                uniqueA: `Unique to A`,
                uniqueB: `Unique to B`,
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab ? styles.tabActive : {}),
                  }}
                >
                  {labels[tab]}
                </button>
              );
            })}
            <button onClick={handleExport} style={styles.exportBtn}>
              Export CSV ↓
            </button>
          </div>

          {/* Data table */}
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Chrom</span>
              <span>Pos</span>
              <span>Ref</span>
              <span>Alt</span>
            </div>
            <div style={styles.tableBody}>
              {activeData.length === 0 ? (
                <div style={styles.tableEmpty}>No variants in this category.</div>
              ) : (
                activeData.map((v, idx) => (
                  <div key={idx} style={styles.tableRow}>
                    <span>{v.chrom}</span>
                    <span>{v.pos.toLocaleString()}</span>
                    <span style={styles.base}>{v.ref}</span>
                    <span style={styles.base}>{v.alt}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helper Components ────────────────────────────────────────────

function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={styles.summaryCard}>
      <span style={styles.summaryLabel}>{label}</span>
      <span style={{ ...styles.summaryCount, color }}>{count.toLocaleString()}</span>
    </div>
  );
}

// ── Inline Styles ──────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '900px',
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
  code: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    padding: '0.1rem 0.4rem',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--clr-accent-lt)',
  },
  uploadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  fileLabel: {
    fontSize: '0.85rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-accent)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  fileInfo: {
    fontSize: '0.78rem',
    color: '#4ade80',
    fontFamily: 'var(--font-mono)',
    marginTop: '0.5rem',
  },
  compareRow: {
    marginBottom: '2rem',
  },
  compareBtn: {
    background: 'var(--clr-accent)',
    color: 'var(--clr-white)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '0.65rem 2rem',
    fontSize: '0.92rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'background 0.2s ease',
  },
  compareBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  results: {
    marginTop: '0.5rem',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  summaryCard: {
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
  },
  summaryLabel: {
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  summaryCount: {
    fontSize: '1.6rem',
    fontWeight: 700,
  },
  tabRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tab: {
    background: 'transparent',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.4rem 1rem',
    fontSize: '0.82rem',
    color: 'var(--clr-muted)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    borderColor: 'var(--clr-accent)',
    color: 'var(--clr-accent)',
    background: 'rgba(108, 99, 255, 0.08)',
  },
  exportBtn: {
    marginLeft: 'auto',
    background: 'transparent',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.4rem 1rem',
    fontSize: '0.82rem',
    color: 'var(--clr-accent)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    transition: 'all 0.2s ease',
  },
  table: {
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    padding: '0.6rem 1rem',
    borderBottom: '1px solid var(--clr-border)',
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  tableBody: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    padding: '0.5rem 1rem',
    borderBottom: '1px solid var(--clr-border)',
    fontSize: '0.84rem',
    color: 'var(--clr-text)',
  },
  tableEmpty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--clr-muted)',
    fontSize: '0.88rem',
  },
  base: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
  },
};
