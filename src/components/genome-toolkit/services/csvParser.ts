// ============================================================
// services/csvParser.ts — Variant CSV Parser
// ============================================================
//
// Parses a CSV file containing genomic variant data into an
// array of Variant objects.
//
// EXPECTED CSV FORMAT:
//   chrom,pos,ref,alt
//   chr1,12345,A,G
//   chr2,67890,TC,T
//
// The parser is flexible about whitespace and header casing.
// It validates that required columns exist and that pos is numeric.
//
// SDD Reference: FR-15
// ============================================================

import type { Variant } from '../types';

/**
 * Parse a CSV string into an array of Variant objects.
 *
 * @param text - Raw CSV content
 * @param fileName - Original file name (for error messages)
 * @returns Parsed Variant array
 * @throws Error if columns are missing or data is malformed
 */
export function parseVariantCSV(text: string, fileName: string): Variant[] {
  const lines = text.trim().split(/\r?\n/);

  if (lines.length < 2) {
    throw new Error(
      `${fileName}: CSV must have a header row and at least one data row.`
    );
  }

  // ── Parse header row ───────────────────────────────────────
  // Normalize: lowercase, trim whitespace
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

  // Find column indices for required fields
  const chromIdx = headers.indexOf('chrom');
  const posIdx   = headers.indexOf('pos');
  const refIdx   = headers.indexOf('ref');
  const altIdx   = headers.indexOf('alt');

  // Validate that all required columns exist
  const missing: string[] = [];
  if (chromIdx === -1) missing.push('chrom');
  if (posIdx === -1)   missing.push('pos');
  if (refIdx === -1)   missing.push('ref');
  if (altIdx === -1)   missing.push('alt');

  if (missing.length > 0) {
    throw new Error(
      `${fileName}: Missing required columns: ${missing.join(', ')}. ` +
      'Expected CSV headers: chrom, pos, ref, alt'
    );
  }

  // ── Parse data rows ────────────────────────────────────────
  const variants: Variant[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) continue; // Skip empty lines

    const cols = line.split(',').map((c) => c.trim());

    // Validate row has enough columns
    const maxIdx = Math.max(chromIdx, posIdx, refIdx, altIdx);
    if (cols.length <= maxIdx) {
      throw new Error(`${fileName} line ${i + 1}: not enough columns.`);
    }

    // Validate pos is a number
    const pos = parseInt(cols[posIdx], 10);
    if (isNaN(pos)) {
      throw new Error(
        `${fileName} line ${i + 1}: "pos" value "${cols[posIdx]}" is not a valid number.`
      );
    }

    variants.push({
      chrom: cols[chromIdx],
      pos,
      ref: cols[refIdx].toUpperCase(),
      alt: cols[altIdx].toUpperCase(),
    });
  }

  if (variants.length === 0) {
    throw new Error(`${fileName}: No valid variant rows found.`);
  }

  return variants;
}
