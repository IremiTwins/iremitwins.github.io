// ============================================================
// services/variantCompare.ts — Variant Dataset Comparator
// ============================================================
//
// Compares two arrays of Variant objects to find shared and
// unique variants between datasets A and B.
//
// HOW IT WORKS:
//   Creates a unique string key for each variant:
//     "chrom:pos:ref:alt"  (e.g. "chr1:12345:A:G")
//   Uses Set operations to classify variants as:
//     - Shared: present in both A and B
//     - Unique to A: only in dataset A
//     - Unique to B: only in dataset B
//
// SDD Reference: FR-16, FR-17
// ============================================================

import type { Variant, VariantComparison } from '../types';

/**
 * Create a unique string key for a variant.
 * Format: "chrom:pos:ref:alt" — used for set comparison.
 */
function variantKey(v: Variant): string {
  return `${v.chrom}:${v.pos}:${v.ref}:${v.alt}`;
}

/**
 * Compare two variant datasets and classify each variant.
 *
 * @param variantsA - First dataset (e.g. sample A)
 * @param variantsB - Second dataset (e.g. sample B)
 * @returns VariantComparison with shared, uniqueToA, uniqueToB arrays
 */
export function compareVariants(
  variantsA: Variant[],
  variantsB: Variant[]
): VariantComparison {
  // Build lookup sets from variant keys
  const keysA = new Set(variantsA.map(variantKey));
  const keysB = new Set(variantsB.map(variantKey));

  // Build a map from key → Variant for quick lookup
  const mapA = new Map(variantsA.map((v) => [variantKey(v), v]));
  const mapB = new Map(variantsB.map((v) => [variantKey(v), v]));

  // ── Classify variants ──────────────────────────────────────
  const shared: Variant[] = [];
  const uniqueToA: Variant[] = [];
  const uniqueToB: Variant[] = [];

  // Check each variant in A — is it also in B?
  for (const [key, variant] of mapA) {
    if (keysB.has(key)) {
      shared.push(variant);
    } else {
      uniqueToA.push(variant);
    }
  }

  // Check each variant in B — if not in A, it's unique to B
  for (const [key, variant] of mapB) {
    if (!keysA.has(key)) {
      uniqueToB.push(variant);
    }
  }

  return {
    shared,
    uniqueToA,
    uniqueToB,
    summary: {
      sharedCount: shared.length,
      uniqueToACount: uniqueToA.length,
      uniqueToBCount: uniqueToB.length,
      totalA: variantsA.length,
      totalB: variantsB.length,
    },
  };
}
