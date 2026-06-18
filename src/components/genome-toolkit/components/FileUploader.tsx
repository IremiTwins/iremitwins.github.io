// ============================================================
// components/FileUploader.tsx — Drag-and-Drop File Upload
// ============================================================
//
// Reusable file upload component with:
//   - Drag-and-drop zone
//   - Click-to-browse fallback
//   - File type and size validation (SDD FR-2, FR-3)
//   - Visual feedback during drag
//
// USAGE:
//   <FileUploader
//     accept=".fasta,.fa,.fq,.fastq"
//     maxSizeMB={5}
//     onFileLoaded={(text, name) => { ... }}
//     label="Drop your FASTA/FASTQ file here"
//   />
//
// The component reads the file as text and passes it to the
// parent via onFileLoaded. Parsing happens in the parent.
// ============================================================

import { useState, useRef, useCallback } from 'react';

interface FileUploaderProps {
  /** Accepted file extensions, comma-separated (e.g. ".fasta,.fa") */
  accept: string;
  /** Maximum allowed file size in megabytes */
  maxSizeMB: number;
  /** Callback with (fileText, fileName) when a valid file is loaded */
  onFileLoaded: (text: string, fileName: string) => void;
  /** Instructional label shown in the drop zone */
  label?: string;
}

export default function FileUploader({
  accept,
  maxSizeMB,
  onFileLoaded,
  label = 'Drop a file here, or click to browse',
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Validate file type against the `accept` prop.
   * Checks if the file extension matches any accepted extension.
   */
  const isValidType = useCallback(
    (fileName: string): boolean => {
      const ext = '.' + fileName.split('.').pop()?.toLowerCase();
      const accepted = accept.split(',').map((a) => a.trim().toLowerCase());
      return accepted.includes(ext);
    },
    [accept]
  );

  /**
   * Process a selected/dropped file: validate, read, and notify parent.
   */
  const processFile = useCallback(
    (file: File) => {
      setError(null);
      setLoadedFile(null);

      // Validate file type (SDD FR-2)
      if (!isValidType(file.name)) {
        setError(`Invalid file type. Accepted: ${accept}`);
        return;
      }

      // Validate file size (SDD FR-3)
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setError(`File too large (${sizeMB.toFixed(1)} MB). Maximum: ${maxSizeMB} MB.`);
        return;
      }

      // Read file as text
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setLoadedFile(file.name);
        onFileLoaded(text, file.name);
      };
      reader.onerror = () => {
        setError('Failed to read file. Please try again.');
      };
      reader.readAsText(file);
    },
    [accept, maxSizeMB, isValidType, onFileLoaded]
  );

  // ── Event handlers ───────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so re-uploading the same file triggers onChange
    e.target.value = '';
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          ...styles.dropZone,
          ...(isDragging ? styles.dropZoneDragging : {}),
          ...(loadedFile ? styles.dropZoneLoaded : {}),
        }}
      >
        {/* Hidden native file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        {loadedFile ? (
          <div style={styles.loadedInfo}>
            <span style={styles.checkmark}>✓</span>
            <span>{loadedFile}</span>
          </div>
        ) : (
          <div style={styles.placeholder}>
            <span style={styles.uploadIcon}>↑</span>
            <span>{label}</span>
            <span style={styles.hint}>Accepted: {accept} · Max {maxSizeMB} MB</span>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <p style={styles.error}>⚠️ {error}</p>}
    </div>
  );
}

// ── Inline Styles ──────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  dropZone: {
    border: '2px dashed var(--clr-border)',
    borderRadius: 'var(--radius)',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'transparent',
  },
  dropZoneDragging: {
    borderColor: 'var(--clr-accent)',
    background: 'rgba(108, 99, 255, 0.05)',
  },
  dropZoneLoaded: {
    borderColor: '#4ade80',
    borderStyle: 'solid',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--clr-muted)',
    fontSize: '0.9rem',
  },
  uploadIcon: {
    fontSize: '1.5rem',
    color: 'var(--clr-accent)',
  },
  hint: {
    fontSize: '0.75rem',
    color: 'var(--clr-muted)',
    fontFamily: 'var(--font-mono)',
  },
  loadedInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: '#4ade80',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  checkmark: {
    fontSize: '1.2rem',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.82rem',
    marginTop: '0.5rem',
    padding: '0.4rem 0.6rem',
    background: 'rgba(255, 80, 80, 0.08)',
    borderRadius: 'var(--radius-sm)',
  },
};
