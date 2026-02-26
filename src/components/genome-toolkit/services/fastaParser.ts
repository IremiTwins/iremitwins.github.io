// ============================================================
// services/fastaParser.ts — FASTA File Parser
// ============================================================
//
// Parses raw FASTA text into a SequenceData object.
//
// FASTA FORMAT:
//   >header_line (description of the sequence)
//   ATCGATCGATCG...
//   ATCGATCGATCG...
//
// The header line starts with ">". All subsequent lines until
// the next ">" or EOF are the sequence, concatenated together.
//
// NOTE: This parser handles single-sequence FASTA files.
// Multi-sequence support is listed as a future enhancement (SDD §10).
//
// SDD Reference: FR-1, FR-2, FR-3
// ============================================================

import type { SequenceData } from '../types';

/**
 * Parse a FASTA-formatted string into a SequenceData object.
 *
 * @param text - Raw file content as a string
 * @param fileName - Original file name (for display purposes)
 * @returns Parsed SequenceData with type 'FASTA'
 * @throws Error if the format is invalid
 */
export function parseFasta(text: string, fileName: string): SequenceData {
  // Trim and split into lines, removing empty lines
  const lines = text.trim().split(/\r?\n/).filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error('File is empty. Please upload a valid FASTA file.');
  }

  // First line must be a header starting with ">"
  if (!lines[0].startsWith('>')) {
    throw new Error(
      'Invalid FASTA format: the first line must start with ">" followed by a header description.'
    );
  }

  // Extract the header (everything after ">")
  const header = lines[0].substring(1).trim();

  // Concatenate all non-header lines as the sequence
  // Ignore any additional headers (multi-sequence — take only the first)
  const sequenceLines: string[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].startsWith('>')) break; // Stop at the next sequence header
    sequenceLines.push(lines[i].trim());
  }

  const sequence = sequenceLines.join('').toUpperCase();

  // Validate that we actually got a sequence
  if (sequence.length === 0) {
    throw new Error('No sequence data found after the header line.');
  }

  // Validate sequence characters — allow standard IUPAC nucleotide codes
  const validBases = /^[ATCGNRYSWKMBDHV]+$/i;
  if (!validBases.test(sequence)) {
    throw new Error(
      'Sequence contains invalid characters. Expected nucleotide bases (A, T, C, G, N).'
    );
  }

  return {
    id: crypto.randomUUID(),
    fileName,
    type: 'FASTA',
    header,
    sequence,
  };
}
