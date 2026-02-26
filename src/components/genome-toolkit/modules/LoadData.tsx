// ============================================================
// modules/LoadData.tsx — File Upload & Data Loading Module
// ============================================================
//
// The entry point for users — upload FASTA or FASTQ files.
// After parsing, the data is stored in the Zustand store and
// becomes available to all other modules.
//
// FEATURES:
//   - Drag-and-drop FASTA/FASTQ upload
//   - Automatic parsing and stats computation
//   - Shows file summary after successful load
//   - Clear error messages for invalid files
//
// SDD Reference: FR-1, FR-2, FR-3
// ============================================================

import { useCallback } from 'react';
import { useGenomeStore } from '../store/useGenomeStore';
import { parseFasta } from '../services/fastaParser';
import { parseFastq } from '../services/fastqParser';
import { computeStats } from '../services/statsCalculator';
import FileUploader from '../components/FileUploader';
import { DEFAULT_SIZE_LIMITS } from '../types';

export default function LoadData() {
  const setDataset = useGenomeStore((s) => s.setDataset);
  const setError = useGenomeStore((s) => s.setError);
  const setActiveView = useGenomeStore((s) => s.setActiveView);
  const dataset = useGenomeStore((s) => s.activeDataset);

  /**
   * Handle a file being loaded from the FileUploader.
   * Determines file type by extension, parses it, computes stats,
   * and stores the result in global state.
   */
  const handleFileLoaded = useCallback(
    (text: string, fileName: string) => {
      try {
        const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
        let data;

        // Route to the correct parser based on file extension
        if (ext === 'fasta' || ext === 'fa') {
          data = parseFasta(text, fileName);
        } else if (ext === 'fastq' || ext === 'fq') {
          data = parseFastq(text, fileName);
        } else {
          throw new Error(`Unsupported file type: .${ext}. Use .fasta, .fa, .fastq, or .fq`);
        }

        // Compute statistics immediately after parsing
        data.stats = computeStats(data);

        // Store in global state (available to all modules)
        setDataset(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file.');
      }
    },
    [setDataset, setError]
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Load Sequence Data</h2>
      <p style={styles.description}>
        Upload a FASTA or FASTQ file to get started. The sequence data will be
        available to all analysis tools (Sequence Analyzer, Motif Finder, GC Visualizer).
      </p>

      {/* File upload zone */}
      <FileUploader
        accept=".fasta,.fa,.fastq,.fq"
        maxSizeMB={Math.max(DEFAULT_SIZE_LIMITS.maxFastaSizeMB, DEFAULT_SIZE_LIMITS.maxFastqSizeMB)}
        onFileLoaded={handleFileLoaded}
        label="Drop your FASTA or FASTQ file here"
      />

      {/* Supported formats info */}
      <div style={styles.formatInfo}>
        <h3 style={styles.formatTitle}>Supported Formats</h3>
        <div style={styles.formatGrid}>
          <div style={styles.formatCard}>
            <span style={styles.formatLabel}>FASTA</span>
            <code style={styles.formatExample}>
              {'>sequence_header\nATCGATCGATCG...'}
            </code>
            <span style={styles.formatExt}>.fasta, .fa</span>
          </div>
          <div style={styles.formatCard}>
            <span style={styles.formatLabel}>FASTQ</span>
            <code style={styles.formatExample}>
              {'@read_header\nATCGATCG...\n+\nIIIIIIII...'}
            </code>
            <span style={styles.formatExt}>.fastq, .fq</span>
          </div>
        </div>
      </div>

      {/* Success summary after loading */}
      {dataset && (
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>✓ Dataset Loaded</h3>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>File</span>
              <span style={styles.summaryValue}>{dataset.fileName}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Type</span>
              <span style={styles.summaryValue}>{dataset.type}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Length</span>
              <span style={styles.summaryValue}>
                {dataset.stats?.length.toLocaleString()} bp
              </span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>GC Content</span>
              <span style={styles.summaryValue}>
                {dataset.stats?.gcPercent}%
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveView('analyzer')}
            style={styles.analyzeBtn}
          >
            Analyze Sequence →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Inline Styles ──────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '720px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: 'var(--clr-text)',
  },
  description: {
    color: 'var(--clr-muted)',
    fontSize: '0.92rem',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  formatInfo: {
    marginTop: '2rem',
  },
  formatTitle: {
    fontSize: '0.88rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
  },
  formatGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  formatCard: {
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  formatLabel: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--clr-accent)',
    fontSize: '0.85rem',
  },
  formatExample: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--clr-muted)',
    whiteSpace: 'pre',
    lineHeight: 1.5,
  },
  formatExt: {
    fontSize: '0.72rem',
    color: 'var(--clr-muted)',
    fontFamily: 'var(--font-mono)',
  },
  summary: {
    marginTop: '2rem',
    background: 'rgba(74, 222, 128, 0.05)',
    border: '1px solid rgba(74, 222, 128, 0.2)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
  },
  summaryTitle: {
    color: '#4ade80',
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  summaryLabel: {
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
    textTransform: 'uppercase' as const,
  },
  summaryValue: {
    fontSize: '0.92rem',
    color: 'var(--clr-text)',
    fontWeight: 600,
  },
  analyzeBtn: {
    background: 'var(--clr-accent)',
    color: 'var(--clr-white)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '0.55rem 1.2rem',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    fontFamily: 'var(--font-sans)',
  },
};
