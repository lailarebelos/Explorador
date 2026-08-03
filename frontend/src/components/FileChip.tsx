import React from 'react';

interface Props {
  file: File;
  progress?: number; // 0–100; omitir = 100 (pronto)
  onRemove: () => void;
}

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'xlsx' || ext === 'xls') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    );
  }
  if (ext === 'pdf') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
};

const truncate = (name: string, max = 28) =>
  name.length > max ? name.slice(0, max - 1) + '…' : name;

const FileChip: React.FC<Props> = ({ file, progress = 100, onRemove }) => (
  <div className="file-chip">
    <div className="file-chip-inner">
      <span className="file-chip-icon">{getFileIcon(file.name)}</span>
      <span className="file-chip-name" title={file.name}>{truncate(file.name)}</span>
      <button
        className="file-chip-remove"
        onClick={onRemove}
        aria-label={`Remover ${file.name}`}
        type="button"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
    {/* Barra de progresso cítrica */}
    <div className="file-chip-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="file-chip-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  </div>
);

export default FileChip;
