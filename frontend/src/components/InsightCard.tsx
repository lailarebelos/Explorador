import React, { useState } from 'react';
import KeywordChips from './KeywordChips';
import { IconBookmarkEstrela, IconChatDuplo } from '../brand/assets';

export interface Insight {
  id: string;
  category: string;
  type: 'oportunidade' | 'atencao';
  body: string;
  keywords: string[];
  evidenceCount: number;
  pinned: boolean;
  highlighted: boolean;
}

interface Props {
  insight: Insight;
}

const InsightCard: React.FC<Props> = ({ insight }) => {
  const [pinned, setPinned] = useState(insight.pinned);

  return (
    <div
      className={[
        'insight-card',
        `insight-card--${insight.type}`,
        insight.highlighted ? 'insight-card--highlighted' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="insight-card-main">
        <div className="insight-card-header">
          <span className="insight-card-category">{insight.category}</span>
          <button
            className={`insight-card-pin${pinned ? ' insight-card-pin--active' : ''}`}
            onClick={() => setPinned(p => !p)}
            aria-label={pinned ? 'Desafixar insight' : 'Fixar insight'}
            title={pinned ? 'Desafixar' : 'Fixar'}
            type="button"
          >
            <img src={IconBookmarkEstrela} alt="" width={16} height={16} aria-hidden="true" />
          </button>
        </div>
        <p className="insight-card-body">{insight.body}</p>
        <div className="insight-card-footer">
          <KeywordChips chips={insight.keywords} />
          <div className="insight-card-evidence">
            <img src={IconChatDuplo} alt="" width={14} height={14} aria-hidden="true" />
            <span>{insight.evidenceCount} {insight.evidenceCount === 1 ? 'entrevista' : 'entrevistas'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
