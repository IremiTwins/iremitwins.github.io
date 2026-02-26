// ============================================================
// services/fastqParser.ts — FASTQ File Parser
// ============================================================
//
// Parses raw FASTQ text into a SequenceData object.
//
// FASTQ FORMAT (4-line records):
//   @header_line
//   ATCGATCG...          (sequence)
//   +                     (separator, sometimes repeats header)
//   IIIIIIII...           (quality scores as ASCII Phred+33)
//
// QUALITY ENCODING:
//   Each ASCII character maps to a quality score:
//   score = charCode - 33
//   e.g. 'I' = 73 - 33 = 40 (high quality)
//        '!' = 33 - 33 = 0  (lowest quality)
//
// NOTE: This parser handles single-record FASTQ for client-side
// use. File size limits keep parsing fast (SDD §8 Risk 1).
//
// SDD Reference: FR-1, FR-2, FR-3, FR-5
// ============================================================

import type { SequenceData } from '../types';

/** Phred+33 offset — subtract from ASCII code to get quality score */
const PHRED_OFFSET = 33;

/**
 * Parse a FASTQ-formatted string into a SequenceData object.
 *
 * @param text - Raw file content as a string
 * @param fileName - Original file name (for display)
 * @returns Parsed SequenceData with type 'FASTQ' and quality scores
 * @throws Error if the format is invalid
 */
export function parseFastq(text: string, fileName: string): SequenceData {
  // Split into non-empty lines
  const lines = text.trim().split(/\r?\n/).filter((line) => line.length > 0);

  if (lines.length < 4) {
    throw new Error(
      'Invalid FASTQ format: expected at least 4 lines (header, sequence, separator, quality).'
    );
  }

  // Line 1: Header (must start with "@")
  if (!lines[0].startsWith('@')) {
    throw new Error(
      'Invalid FASTQ format: the first line must start with "@" followed by a header.'
    );
  }
  const header = lines[0].substring(1).trim();

  // For multi-record FASTQ, concatenate all records into one sequence
  // This handles both single-record and multi-record files
  const allSequences: string[] = [];
  const allQualities: number[] = [];

  let i = 0;
  while (i < lines.length) {
    // Line 1: Header (@...)
    if (!lines[i].startsWith('@')) {
      throw new Error(`Invalid FASTQ format at line ${i + 1}: expected header starting with "@".`);
    }

    // Line 2: Sequence
    if (i + 1 >= lines.length) {
      throw new Error('Unexpected end of file: missing sequence line.');
    }
    const seqLine = lines[i + 1].trim().toUpperCase();
    allSequences.push(seqLine);

    // Line 3: Separator (+)
    if (i + 2 >= lines.length || !lines[i + 2].startsWith('+')) {
      throw new Error(`Invalid FASTQ format at line ${i + 3}: expected "+" separator.`);
    }

    // Line 4: Quality string
    if (i + 3 >= lines.length) {
      throw new Error('Unexpected end of file: missing quality line.');
    }
    const qualLine = lines[i + 3].trim();

    // Quality string must be same length as sequence
    if (qualLine.length !== seqLine.length) {
      throw new Error(
        `Quality string length (${qualLine.length}) does not match sequence length (${seqLine.length}).`
      );
    }

    // Convert ASCII quality characters to numeric Phred scores
    for (let j = 0; j < qualLine.length; j++) {
      allQualities.push(qualLine.charCodeAt(j) - PHRED_OFFSET);
    }

    i += 4; // Move to next record
  }

  const sequence = allSequences.join('');

  if (sequence.length === 0) {
    throw new Error('No sequence data found in the FASTQ file.');
  }

  return {
    id: crypto.randomUUID(),
    fileName,
    type: 'FASTQ',
    header,
    sequence,
    qualities: allQualities,
  };
}
