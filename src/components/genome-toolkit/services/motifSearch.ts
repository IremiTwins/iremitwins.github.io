// ============================================================
// services/motifSearch.ts — Motif Finder Service
// ============================================================
//
// Searches a nucleotide sequence for all occurrences of a
// user-provided motif string. Returns positions (1-based)
// with surrounding context for preview.
//
// HOW IT WORKS:
//   Uses simple case-insensitive literal string matching.
//   Scans from left to right, finding all overlapping matches.
//   For each match, extracts ±10 bases of surrounding context.
//
// FUTURE: IUPAC motif support (SDD §10) would replace the
// literal match with regex-based degenerate base matching.
//
// SDD Reference: FR-7, FR-8, FR-9, FR-10
// ============================================================

import type { MotifMatch } from '../types';

/** How many bases of context to show on each side of a match */
const CONTEXT_RADIUS = 10;

/**
 * Find all occurrences of a motif in a sequence.
 *
 * @param sequence - The full nucleotide sequence (uppercase)
 * @param motif - The motif string to search for
 * @returns Array of MotifMatch objects with 1-based positions and context
 */
export function findMotif(sequence: string, motif: string): MotifMatch[] {
  // Validate inputs
  if (!sequence || !motif || motif.length === 0) {
    return [];
  }

  // Normalize both to uppercase for case-insensitive matching
  const seqUpper = sequence.toUpperCase();
  const motifUpper = motif.toUpperCase();

  const matches: MotifMatch[] = [];
  let searchFrom = 0;

  // Scan for all occurrences (including overlapping ones)
  while (searchFrom <= seqUpper.length - motifUpper.length) {
    const index = seqUpper.indexOf(motifUpper, searchFrom);

    // No more matches found
    if (index === -1) break;

    // Extract surrounding context (±CONTEXT_RADIUS bases)
    const contextStart = Math.max(0, index - CONTEXT_RADIUS);
    const contextEnd = Math.min(seqUpper.length, index + motifUpper.length + CONTEXT_RADIUS);
    const context = sequence.substring(contextStart, contextEnd);

    matches.push({
      position: index + 1, // Convert to 1-based indexing
      context,
    });

    // Move forward by 1 to allow overlapping matches
    // e.g. searching "AA" in "AAA" finds positions 1 and 2
    searchFrom = index + 1;
  }

  return matches;
}
