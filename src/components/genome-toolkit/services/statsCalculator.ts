// ============================================================
// services/statsCalculator.ts — Sequence Statistics Calculator
// ============================================================
//
// Computes summary statistics for a loaded sequence dataset.
// Works for both FASTA and FASTQ data.
//
// STATS COMPUTED:
//   - Sequence length (total base count)
//   - GC content percentage
//   - N content percentage (ambiguous bases)
//   - Individual base counts (A, T, C, G, N)
//   - Mean quality score (FASTQ only)
//   - Per-position average quality (FASTQ only)
//
// SDD Reference: FR-4, FR-5
// ============================================================

import type { SequenceData, SequenceStats } from '../types';

/**
 * Compute statistics for a parsed sequence.
 *
 * @param data - A parsed SequenceData object (FASTA or FASTQ)
 * @returns SequenceStats with all computed values
 */
export function computeStats(data: SequenceData): SequenceStats {
  const seq = data.sequence;
  const len = seq.length;

  // ── Count each base ──────────────────────────────────────
  // Single pass through the sequence for efficiency
  let a = 0, t = 0, c = 0, g = 0, n = 0;

  for (let i = 0; i < len; i++) {
    switch (seq[i]) {
      case 'A': a++; break;
      case 'T': t++; break;
      case 'C': c++; break;
      case 'G': g++; break;
      default:  n++; break; // N and any other ambiguous codes
    }
  }

  // ── Calculate percentages ────────────────────────────────
  // Guard against division by zero (empty sequence)
  const gcPercent = len > 0 ? ((g + c) / len) * 100 : 0;
  const nPercent  = len > 0 ? (n / len) * 100 : 0;

  const stats: SequenceStats = {
    length: len,
    gcPercent: Math.round(gcPercent * 100) / 100,   // Round to 2 decimal places
    nPercent: Math.round(nPercent * 100) / 100,
    baseCounts: { A: a, T: t, C: c, G: g, N: n },
  };

  // ── FASTQ-specific: quality scores ───────────────────────
  if (data.type === 'FASTQ' && data.qualities && data.qualities.length > 0) {
    // Mean quality = average of all Phred scores
    const qualSum = data.qualities.reduce((sum, q) => sum + q, 0);
    stats.meanQuality = Math.round((qualSum / data.qualities.length) * 100) / 100;

    // Per-position quality — useful for quality profile charts
    // For multi-record FASTQ this is already flattened; we report as-is
    stats.perPositionQuality = data.qualities;
  }

  return stats;
}
