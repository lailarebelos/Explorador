import React from 'react';

interface Props {
  children: React.ReactNode;
}

/**
 * Citação de entrevistado dentro de resposta do agente.
 * Especificação: card branco, borda 1.5px verde-bandeira, radius 16px,
 * cauda chanfrada cítrica, sombra dura 4px cítrica.
 * Uso no markdown: qualquer > blockquote renderiza como QuoteBubble.
 */
const QuoteBubble: React.FC<Props> = ({ children }) => (
  <div className="quote-bubble" role="blockquote">
    {children}
  </div>
);

export default QuoteBubble;
