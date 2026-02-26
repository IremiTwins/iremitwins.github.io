// ============================================================
// services/exportCSV.ts — CSV Export Utility
// ============================================================
//
// Converts an array of objects into a CSV file and triggers
// a browser download. Used by the Variant Comparator module
// to export comparison results.
//
// HOW IT WORKS:
//   1. Extracts column headers from the first object's keys
//   2. Maps each object to a comma-separated row
//   3. Creates a Blob (in-memory file) with the CSV content
//   4. Creates a temporary download link and clicks it
//   5. Cleans up the temporary URL
//
// SDD Reference: FR-18
// ============================================================

/**
 * Export an array of objects as a downloadable CSV file.
 *
 * @param data - Array of objects (each object = one row)
 * @param filename - Desired download filename (e.g. "shared_variants.csv")
 */
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) {
    console.warn('exportToCSV: No data to export.');
    return;
  }

  // ── Build CSV string ───────────────────────────────────────

  // Header row — keys of the first object
  const headers = Object.keys(data[0]);
  const headerLine = headers.join(',');

  // Data rows — escape values that contain commas or quotes
  const rows = data.map((row) =>
    headers
      .map((key) => {
        const value = String(row[key] ?? '');
        // Wrap in quotes if the value contains commas, quotes, or newlines
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',')
  );

  const csvContent = [headerLine, ...rows].join('\n');

  // ── Trigger browser download ───────────────────────────────

  // Create an in-memory Blob representing the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary <a> element to trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  // Append to DOM, click, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the Blob URL to free memory
  URL.revokeObjectURL(url);
}
