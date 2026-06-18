// ============================================================
// store/useGenomeStore.ts — Zustand Global State Store
// ============================================================
//
// Single shared state store for the Genome Toolkit app.
// Uses Zustand for lightweight, hook-based state management.
//
// WHY ZUSTAND OVER REACT CONTEXT?
// - No provider wrapper needed — just import and use the hook
// - No unnecessary re-renders — components only re-render when
//   the specific slice of state they subscribe to changes
// - Minimal boilerplate
//
// USAGE IN A COMPONENT:
//   const dataset = useGenomeStore(s => s.activeDataset);
//   const setView = useGenomeStore(s => s.setActiveView);
// ============================================================

import { create } from 'zustand';
import type { SequenceData, Variant, ToolView } from '../types';

/**
 * Shape of the global store state + actions.
 */
interface GenomeStoreState {
  // ── State ──────────────────────────────────────────────────

  /** Currently loaded sequence (FASTA/FASTQ). Null = nothing loaded. */
  activeDataset: SequenceData | null;

  /** Variant file A for the comparator module. */
  variantFileA: Variant[] | null;

  /** Variant file B for the comparator module. */
  variantFileB: Variant[] | null;

  /** Which tool module is currently shown in the main panel. */
  activeView: ToolView;

  /** Global error message. Null = no error. Displayed in TopBar. */
  error: string | null;

  // ── Actions ────────────────────────────────────────────────

  /** Load a parsed sequence into the store. Clears any previous error. */
  setDataset: (data: SequenceData) => void;

  /** Remove the active dataset and reset sequence-dependent state. */
  clearDataset: () => void;

  /** Load a variant file into slot A or B. */
  setVariantFile: (slot: 'A' | 'B', variants: Variant[]) => void;

  /** Clear variant files (both or one slot). */
  clearVariantFiles: (slot?: 'A' | 'B') => void;

  /** Switch the visible tool module. */
  setActiveView: (view: ToolView) => void;

  /** Set a global error message (shown in the TopBar). */
  setError: (message: string | null) => void;
}

/**
 * The Zustand store hook. Import this in any React component
 * to read or update global state.
 */
export const useGenomeStore = create<GenomeStoreState>((set) => ({
  // ── Initial State ──────────────────────────────────────────
  activeDataset: null,
  variantFileA: null,
  variantFileB: null,
  activeView: 'load',      // Start on the "Load Data" screen
  error: null,

  // ── Action Implementations ─────────────────────────────────

  setDataset: (data) =>
    set({ activeDataset: data, error: null }),

  clearDataset: () =>
    set({ activeDataset: null, error: null }),

  setVariantFile: (slot, variants) =>
    set(slot === 'A' ? { variantFileA: variants } : { variantFileB: variants }),

  clearVariantFiles: (slot) =>
    set(
      slot === 'A'
        ? { variantFileA: null }
        : slot === 'B'
          ? { variantFileB: null }
          : { variantFileA: null, variantFileB: null }
    ),

  setActiveView: (view) =>
    set({ activeView: view, error: null }),

  setError: (message) =>
    set({ error: message }),
}));
