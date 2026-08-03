import React from 'react';

interface Props {
  name: string;
  meta: string;
  onView?: () => void;
  onRemove?: () => void;
}

/**
 * Card de fonte de dados para o painel Fontes (InsightsPanel — Entregável 5).
 * Especificação: ícone-documento em quadrado 36px bg rgba(1,132,68,.1) radius 8px,
 * nome 14px 600, meta 12px, ações ver/remover.
 */
const SourceCard: React.FC<Props> = ({ name, meta, onView, onRemove }) => (
  <div className="source-card">
    <div className="source-card-icon-wrap">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    </div>

    <div className="source-card-body">
      <p className="source-card-name" title={name}>{name}</p>
      <p className="source-card-meta">{meta}</p>
    </div>

    <div className="source-card-actions">
      {onView && (
        <button className="source-card-btn" onClick={onView} aria-label="Visualizar" title="Visualizar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      )}
      {onRemove && (
        <button className="source-card-btn source-card-btn--remove" onClick={onRemove} aria-label="Remover" title="Remover">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

export default SourceCard;
