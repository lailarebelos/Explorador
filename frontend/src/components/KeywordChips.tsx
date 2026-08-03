import React from 'react';

interface Props {
  chips: string[];
  className?: string;
}

/**
 * Chips de palavras-chave dentro de cards de insight ou bolhas.
 * Especificação: pill outline 1px verde-bandeira, texto 12px verde, bg branco.
 */
const KeywordChips: React.FC<Props> = ({ chips, className }) => {
  if (!chips.length) return null;
  return (
    <div className={`keyword-chips${className ? ` ${className}` : ''}`}>
      {chips.map((label, i) => (
        <span key={i} className="keyword-chip">{label}</span>
      ))}
    </div>
  );
};

export default KeywordChips;
