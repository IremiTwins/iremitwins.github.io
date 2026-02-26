// ============================================================
// types/index.ts — Genome Toolkit Type Definitions
// ============================================================
//
// Central type definitions for the entire Genome Toolkit app.
// All interfaces and enums used across modules, services, and
// components are defined here for consistency and reusability.
//
// SDD Reference: Section 6 — Data Models
// ============================================================

/**
 * Which tool module is currently displayed in the main panel.
 * Matches the sidebar navigation options.
 */
export type ToolView = 'load' | 'analyzer' | 'motif' | 'gc' | 'variants';

/**
 * Supported input file types for sequence data.
 */
export type SequenceFileType = 'FASTA' | 'FASTQ';

/**
 * Base composition counts — the number of each nucleotide in a sequence.
 */
export interface BaseCounts {
  A: number;
  T: number;
  C: number;
  G: number;
  N: number; // Includes any ambiguous/unknown bases
}

/**
 * Computed statistics for a loaded sequence.
 * Calculated by statsCalculator.ts after a file is parsed.
 *
 * SDD FR-4: length, GC%, N%, base composition
 * SDD FR-5: meanQuality + perPositionQuality (FASTQ only)
 */
export interface SequenceStats {
  length: number;
  gcPercent: number;       // (G + C) / total * 100
  nPercent: number;        // N / total * 100
  baseCounts: BaseCounts;
  meanQuality?: number;            // FASTQ only — average Phred score
  perPositionQuality?: number[];   // FASTQ only — per-base average quality
}

/**
 * A parsed sequence dataset — the core data object shared
 * across the Sequence Analyzer, Motif Finder, and GC Visualizer.
 *
 * SDD Section 6: SequenceData model
 */
export interface SequenceData {
  id: string;                    // Unique identifier (generated at parse time)
  fileName: string;              // Original uploaded file name
  type: SequenceFileType;        // FASTA or FASTQ
  header: string;                // The sequence header line (e.g. ">chr1 ...")
  sequence: string;              // The raw nucleotide string (uppercase)
  qualities?: number[];          // Phred quality scores (FASTQ only)
  stats?: SequenceStats;         // Computed after parsing
}

/**
 * A single motif match result.
 * Position uses 1-based indexing per bioinformatics convention.
 *
 * SDD FR-9: match positions (1-based)
 */
export interface MotifMatch {
  position: number;     // 1-based start index in the sequence
  context: string;      // Surrounding bases for preview (±10 bases)
}

/**
 * A single GC content sliding window result.
 *
 * SDD FR-12: GC% across sliding windows
 */
export interface GCWindow {
  windowStart: number;  // 0-based start position
  windowEnd: number;    // 0-based end position (exclusive)
  gcPercent: number;    // GC% within this window
}

/**
 * A variant row from a CSV file.
 * Simplified VCF-lite format per SDD scope.
 *
 * SDD Section 6: Variant model
 * SDD FR-15: columns chrom, pos, ref, alt
 */
export interface Variant {
  chrom: string;
  pos: number;
  ref: string;
  alt: string;
}

/**
 * Result of comparing two variant datasets.
 *
 * SDD FR-16: shared, unique-to-A, unique-to-B
 * SDD FR-17: summary counts
 */
export interface VariantComparison {
  shared: Variant[];
  uniqueToA: Variant[];
  uniqueToB: Variant[];
  summary: {
    sharedCount: number;
    uniqueToACount: number;
    uniqueToBCount: number;
    totalA: number;
    totalB: number;
  };
}

/**
 * Configurable size limits for file uploads.
 * SDD FR-3: configurable size limits
 */
export interface FileSizeLimits {
  maxFastaSizeMB: number;   // Default: 5 MB
  maxFastqSizeMB: number;   // Default: 5 MB
  maxCsvSizeMB: number;     // Default: 10 MB
}

/**
 * Default file size limits used throughout the app.
 */
export const DEFAULT_SIZE_LIMITS: FileSizeLimits = {
  maxFastaSizeMB: 5,
  maxFastqSizeMB: 5,
  maxCsvSizeMB: 10,
};
