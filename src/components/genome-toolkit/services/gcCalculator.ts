// ============================================================
// services/gcCalculator.ts — GC Sliding Window Calculator
// ============================================================
//
// Calculates GC content (%) across a sequence using a sliding
// window approach. This produces data for the GC Visualizer
// line chart.
//
// HOW IT WORKS:
//   1. Start at position 0
//   2. Count G and C bases within the window
//   3. GC% = (G+C count) / window_size * 100
//   4. Slide window forward by 1 position
//   5. Repeat until the window reaches the end of the sequence
//
// OPTIMIZATION: Uses an incremental counting approach —
// instead of recounting the entire window each step, we
// subtract the base leaving the window and add the base
// entering it. This makes it O(n) instead of O(n × w).
//
// SDD Reference: FR-11, FR-12
// ============================================================

import type { GCWindow } from '../types';

/**
 * Check if a base is G or C.
 */
function isGC(base: string): boolean {
  return base === 'G' || base === 'C';
}

/**
 * Compute GC% across sliding windows of a given size.
 *
 * @param sequence - The nucleotide sequence (uppercase)
 * @param windowSize - Number of bases per window
 * @returns Array of GCWindow objects for charting
 * @throws Error if windowSize is invalid
 */
export function computeGCWindows(sequence: string, windowSize: number): GCWindow[] {
  // ── Validate inputs ────────────────────────────────────────
  if (windowSize <= 0) {
    throw new Error('Window size must be greater than 0.');
  }
  if (windowSize > sequence.length) {
    throw new Error(
      `Window size (${windowSize}) cannot exceed sequence length (${sequence.length}).`
    );
  }

  const seq = sequence.toUpperCase();
  const windows: GCWindow[] = [];

  // ── Count GC in the first window ──────────────────────────
  let gcCount = 0;
  for (let i = 0; i < windowSize; i++) {
    if (isGC(seq[i])) gcCount++;
  }

  // Record the first window
  windows.push({
    windowStart: 0,
    windowEnd: windowSize,
    gcPercent: Math.round((gcCount / windowSize) * 10000) / 100, // 2 decimal places
  });

  // ── Slide the window ──────────────────────────────────────
  // Incremental update: subtract the outgoing base, add the incoming base
  for (let start = 1; start <= seq.length - windowSize; start++) {
    // Base leaving the window (left edge)
    if (isGC(seq[start - 1])) gcCount--;
    // Base entering the window (right edge)
    if (isGC(seq[start + windowSize - 1])) gcCount++;

    windows.push({
      windowStart: start,
      windowEnd: start + windowSize,
      gcPercent: Math.round((gcCount / windowSize) * 10000) / 100,
    });
  }

  return windows;
}
