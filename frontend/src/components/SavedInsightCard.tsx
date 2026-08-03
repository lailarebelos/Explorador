import React from 'react';
import { SavedInsight } from '../types';

interface Props {
  insight: SavedInsight;
  onRemove: (id: string) => void;
  onViewInChat: (messageId: string) => void;
}

const MAX_BODY = 240;

const SavedInsightCard: React.FC<Props> = ({ insight, onRemove, onViewInChat }) => {
  const truncated = insight.body.length > MAX_BODY
    ? insight.body.slice(0, MAX_BODY).trimEnd() + '…'
    : insight.body;
  const date = new Date(insight.savedAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });

  return (
    <div className="saved-insight-card">
      <div className="saved-insight-bar" aria-hidden="true" />
      <div className="saved-insight-inner">
        <p className="saved-insight-category">INSIGHT SALVO</p>
        <p className="saved-insight-body">{truncated}</p>
        <div className="saved-insight-footer">
          <button
            className="saved-insight-view"
            type="button"
            onClick={() => onViewInChat(insight.messageId)}
          >
            ver no chat
          </button>
          <span className="saved-insight-date">{date}</span>
          <button
            className="saved-insight-remove"
            type="button"
            aria-label="Remover insight"
            title="Remover"
            onClick={() => onRemove(insight.id)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedInsightCard;
