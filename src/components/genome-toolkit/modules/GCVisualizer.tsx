// ============================================================
// modules/GCVisualizer.tsx — GC Sliding Window Visualizer
// ============================================================
//
// Interactive chart showing GC content (%) across a sequence
// using a sliding window approach.
//
// FEATURES:
//   - User-defined window size input
//   - Chart.js line chart with hover inspection
//   - Themed to match the site's dark color scheme
//   - Smart defaults based on sequence length
//
// DEPENDENCIES:
//   - chart.js (core charting library)
//   - react-chartjs-2 (React wrapper for Chart.js)
//
// SDD Reference: FR-11, FR-12, FR-13, FR-14
// ============================================================

import { useState, useMemo } from 'react';
import { useGenomeStore } from '../store/useGenomeStore';
import { computeGCWindows } from '../services/gcCalculator';
import type { GCWindow } from '../types';

// ── Chart.js Setup ─────────────────────────────────────────────
// Chart.js is tree-shakeable — we register only the components we need
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function GCVisualizer() {
  const dataset = useGenomeStore((s) => s.activeDataset);
  const setActiveView = useGenomeStore((s) => s.setActiveView);
  const setError = useGenomeStore((s) => s.setError);

  // Default window size: ~1% of sequence length, minimum 10, max 5000
  const defaultWindow = dataset
    ? Math.min(5000, Math.max(10, Math.round(dataset.sequence.length / 100)))
    : 100;

  const [windowSize, setWindowSize] = useState(defaultWindow);
  const [windows, setWindows] = useState<GCWindow[] | null>(null);

  // ── No data loaded ─────────────────────────────────────────
  if (!dataset) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>GC Content Visualizer</h2>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No sequence data loaded.</p>
          <button onClick={() => setActiveView('load')} style={styles.loadBtn}>
            Load Data →
          </button>
        </div>
      </div>
    );
  }

  /**
   * Compute GC windows when the user clicks "Calculate".
   */
  const handleCalculate = () => {
    try {
      const result = computeGCWindows(dataset.sequence, windowSize);
      setWindows(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compute GC windows.');
      setWindows(null);
    }
  };

  // ── Chart configuration ────────────────────────────────────
  // Downsample labels if there are too many windows (keeps chart readable)
  const maxLabels = 50;
  const chartData = useMemo(() => {
    if (!windows) return null;

    const step = Math.max(1, Math.floor(windows.length / maxLabels));
    const labels = windows.map((w, i) =>
      i % step === 0 ? `${w.windowStart}` : ''
    );

    return {
      labels,
      datasets: [
        {
          label: 'GC %',
          data: windows.map((w) => w.gcPercent),
          borderColor: '#6c63ff',                     // Accent purple
          backgroundColor: 'rgba(108, 99, 255, 0.1)', // Faint fill
          fill: true,
          tension: 0.3,     // Slight curve for readability
          pointRadius: 0,   // No dots (too many points)
          borderWidth: 2,
          pointHitRadius: 10, // Hover detection area
        },
      ],
    };
  }, [windows]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        title: { display: false },
        tooltip: {
          backgroundColor: '#141720',
          borderColor: '#1e2230',
          borderWidth: 1,
          titleColor: '#e2e4ec',
          bodyColor: '#7a7f95',
          titleFont: { family: 'Fira Code', size: 12 },
          bodyFont: { family: 'Fira Code', size: 11 },
          callbacks: {
            title: (items: any[]) => {
              if (!windows || !items[0]) return '';
              const idx = items[0].dataIndex;
              const w = windows[idx];
              return `Position ${w.windowStart.toLocaleString()} – ${w.windowEnd.toLocaleString()}`;
            },
            label: (item: any) => ` GC: ${item.raw.toFixed(2)}%`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#7a7f95', font: { family: 'Fira Code', size: 10 } },
          grid: { color: 'rgba(30, 34, 48, 0.5)' },
          title: {
            display: true,
            text: 'Sequence Position',
            color: '#7a7f95',
            font: { family: 'Fira Code', size: 11 },
          },
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            color: '#7a7f95',
            font: { family: 'Fira Code', size: 10 },
            callback: (v: any) => `${v}%`,
          },
          grid: { color: 'rgba(30, 34, 48, 0.5)' },
          title: {
            display: true,
            text: 'GC Content (%)',
            color: '#7a7f95',
            font: { family: 'Fira Code', size: 11 },
          },
        },
      },
    }),
    [windows]
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>GC Content Visualizer</h2>
      <p style={styles.subtitle}>
        Visualize GC content across the sequence using a sliding window.
        Hover over the chart to inspect individual windows.
      </p>

      {/* ── Window size input ─────────────────────────────────── */}
      <div style={styles.inputRow}>
        <label style={styles.inputLabel}>
          Window Size (bp):
          <input
            type="number"
            value={windowSize}
            onChange={(e) => setWindowSize(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            max={dataset.sequence.length}
            style={styles.input}
          />
        </label>
        <button onClick={handleCalculate} style={styles.calcBtn}>
          Calculate
        </button>
      </div>

      {/* ── Chart ─────────────────────────────────────────────── */}
      {chartData && (
        <div style={styles.chartContainer}>
          <div style={styles.chartWrapper}>
            <Line data={chartData} options={chartOptions} />
          </div>
          <div style={styles.chartMeta}>
            <span>{windows?.length.toLocaleString()} windows</span>
            <span>Window size: {windowSize.toLocaleString()} bp</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Inline Styles ──────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '900px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
    color: 'var(--clr-text)',
  },
  subtitle: {
    color: 'var(--clr-muted)',
    fontSize: '0.88rem',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    background: 'var(--clr-surface)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius)',
  },
  emptyText: {
    color: 'var(--clr-muted)',
    marginBottom: '1rem',
  },
  loadBtn: {
    background: 'var(--clr-accent)',
    color: 'var(--clr-white)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '0.55rem 1.2rem',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  inputLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    fontSize: '0.82rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
  },
  input: {
    padding: '0.6rem 1rem',
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--clr-text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.88rem',
    outline: 'none',
    width: '160px',
  },
  calcBtn: {
    background: 'var(--clr-accent)',
    color: 'var(--clr-white)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '0.6rem 1.5rem',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    whiteSpace: 'nowrap',
  },
  chartContainer: {
    background: 'var(--clr-bg)',
    border: '1px solid var(--clr-border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
  },
  chartWrapper: {
    height: '350px',
    position: 'relative',
  },
  chartMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.75rem',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--clr-muted)',
  },
};
