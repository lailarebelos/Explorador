import React, { useState, useRef, useEffect, DragEvent } from 'react';
import { uploadFile } from '../services/api';
import { computeFingerprint } from '../utils/fingerprint';
import { FileMetadata } from '../types';
import { THEMED_ASSETS } from '../brand/assets';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  onUploadSuccess: (metadata: FileMetadata, fingerprint: string, fileSize: number) => void;
  onClose: () => void;
}

const UploadModal: React.FC<Props> = ({ onUploadSuccess, onClose }) => {
  const { theme } = useTheme();
  const logo = THEMED_ASSETS[theme].logoCoHorizontal;
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Esc fecha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isLoading) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, isLoading]);

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const sel = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const els = Array.from(modal.querySelectorAll<HTMLElement>(sel));
    if (els.length) els[0].focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, []);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setError('Por favor, envie apenas arquivos .xlsx gerados pelo Normalizador.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [metadata, fingerprint] = await Promise.all([
        uploadFile(file),
        computeFingerprint(file),
      ]);
      onUploadSuccess(metadata, fingerprint, file.size);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => !isLoading && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Nova pesquisa"
    >
      <div
        className="upload-modal-card"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="upload-modal-header">
          <img src={logo} alt="Localiza&CO" height={24} />
          <button
            className="help-modal-close"
            onClick={onClose}
            aria-label="Fechar"
            type="button"
            disabled={isLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <h2 className="upload-modal-title">Nova pesquisa</h2>
        <p className="upload-modal-subtitle">
          Envie uma planilha .xlsx normalizada para iniciar uma nova conversa
        </p>

        <div
          className={`dropzone${isDragging ? ' dragging' : ''}${isLoading ? ' loading' : ''}`}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && !isLoading && fileInputRef.current?.click()}
          aria-label="Área de upload de arquivo"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            style={{ display: 'none' }}
          />
          {isLoading ? (
            <div className="dropzone-loading">
              <div className="spinner" />
              <p>Processando arquivo…</p>
            </div>
          ) : (
            <>
              <div className="dropzone-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="dropzone-text">
                <strong>Clique para selecionar</strong> ou arraste o arquivo aqui
              </p>
              <p className="dropzone-hint">Apenas arquivos .xlsx</p>
            </>
          )}
        </div>

        {error && (
          <div className="upload-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
