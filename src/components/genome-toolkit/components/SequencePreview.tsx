// ============================================================
// components/SequencePreview.tsx — Sequence Base Preview
// ============================================================
//
// Displays the first N bases of a loaded sequence in a
// monospace font with optional motif highlighting.
//
// FEATURES:
//   - Shows first `maxBases` characters (default 500)
//   - Word-wraps the sequence for readability
//   - Accepts highlight positions to mark motif matches
//   - Highlighted bases display with accent background
//
// SDD Reference: FR-6 (preview first N bases), FR-10 (highlight)
// ============================================================

import { useMemo } from 'react';

interface SequencePreviewProps {
  /** The full nucleotide sequence string */
  sequence: string;
  /** Maximum number of bases to display (default 500) */
  maxBases?: number;
  /** Array of {start, length} ranges to highlight (0-based) */
  highlights?: { start: number; length: number }[];
}

export default function SequencePreview({
  sequence,
  maxBases = 500,
  highlights = [],
}: SequencePreviewProps) {
  // Truncate the sequence for display
  const displaySeq = sequence.substring(0, maxBases);
  const isTruncated = sequence.length > maxBases;

  /**
   * Build an array of segments — each is either normal or highlighted.
   * We merge overlapping highlights and split the sequence into
   * alternating normal/highlighted segments for rendering.
   */
  const segments = useMemo(() => {
    if (highlights.length === 0) {
      // No highlights — return the whole sequence as one segment
      return [{ text: displaySeq, highlighted: false }];
    }

    // Build a boolean mask: true = this position is highlighted
    const mask = new Array(displaySeq.length).fill(false);
    for (const { start, length } of highlights) {
      for (let i = start; i < start + length && i < displaySeq.length; i++) {
        mask[i] = true;
      }
    }

    // Convert the mask into contiguous segments
    const result: { text: string; highlighted: boolean }[] = [];
    let currentHighlighted = mask[0];
    let currentText = displaySeq[0];

    for (let i = 1; i < displaySeq.length; i++) {
      if (mask[i] === currentHighlighted) {
        currentText += displaySeq[i];
      } else {
        result.push({ text: currentText, highlighted: currentHighlighted });
        currentHighlighted = mask[i];
        currentText = displaySeq[i];
      }
    }
    // Push the final segment
    if (currentText) {
      result.push({ text: currentText, highlighted: currentHighlighted });
    }

    return result;
  }, [displaySeq, highlights]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>Sequence Preview</span>
        <span style={styles.meta}>
          Showing {displaySeq.length.toLocaleString()} of{' '}
          {sequence.length.toLocaleString()} bp
        </span>
      </div>
      <div style={styles.sequenceBox}>
        <code style={styles.sequence}>
          {segments.map((seg, idx) =>
            seg.highlighted ? (
              <mark key={idx} style={styles.highlight}>
                {seg.text}
              </mark>
            ) : (
              <span key={idx}>{seg.text}</span>
            )
          )}
          {isTruncated && <span style={styles.ellipsis}>…</span>}
        </code>
      </div>
    </div>
  );
}

// ── Inline Styles ──────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--clr-accent)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  meta: {
    fontSize: '0.75rem',
    color: 'var(--clr-muted)',
    fontFamily: 'var(--font-mono)',
  },
  sequenceBox: {
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius)',
    padding: '1rem',
    maxHeight: '240px',
    overflowY: 'auto',
  },
  sequence: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    lineHeight: 1.8,
    color: 'var(--clr-text)',
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap',
  },
  highlight: {
    background: 'rgba(108, 99, 255, 0.3)',
    color: 'var(--clr-accent-lt)',
    borderRadius: '2px',
    padding: '0 1px',
  },
  ellipsis: {
    color: 'var(--clr-muted)',
  },
};
