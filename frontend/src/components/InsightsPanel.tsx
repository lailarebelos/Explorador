import React, { useState } from 'react';
import { FileMetadata, SavedInsight } from '../types';
import SavedInsightCard from './SavedInsightCard';
import SourceCard from './SourceCard';
import { IconMegafone } from '../brand/assets';

interface Props {
  fileMetadata: FileMetadata;
  open: boolean;
  onClose: () => void;
  insights: SavedInsight[];
  onRemoveInsight: (id: string) => void;
  onViewInChat: (messageId: string) => void;
}

const InsightsPanel: React.FC<Props> = ({
  fileMetadata,
  open,
  onClose,
  insights,
  onRemoveInsight,
  onViewInChat,
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'fontes'>('insights');

  return (
    <aside
      className={`insights-panel${open ? '' : ' insights-panel--closed'}`}
      aria-label="Painel de insights"
    >
      <div className="insights-panel-header">
        <div className="insights-tabs" role="tablist">
          <button
            className={`insights-tab${activeTab === 'insights' ? ' insights-tab--active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'insights'}
            onClick={() => setActiveTab('insights')}
            type="button"
          >
            Insights
            {insights.length > 0 && (
              <span className="insights-tab-count">{insights.length}</span>
            )}
          </button>
          <button
            className={`insights-tab${activeTab === 'fontes' ? ' insights-tab--active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'fontes'}
            onClick={() => setActiveTab('fontes')}
            type="button"
          >
            Fontes
          </button>
        </div>

        <button
          className="insights-close-btn"
          onClick={onClose}
          aria-label="Fechar painel de insights"
          title="Fechar"
          type="button"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="insights-panel-body" role="tabpanel">
        {activeTab === 'insights' && (
          insights.length === 0 ? (
            <div className="insights-empty-state">
              <img src={IconMegafone} alt="" width={72} height={72} aria-hidden="true" />
              <p className="insights-empty-title">Nenhum insight salvo</p>
              <p className="insights-empty-body">
                Passe o mouse sobre uma resposta do Explorador e clique em &ldquo;Salvar como insight&rdquo;.
              </p>
            </div>
          ) : (
            <div className="insights-list">
              {insights.map(insight => (
                <SavedInsightCard
                  key={insight.id}
                  insight={insight}
                  onRemove={onRemoveInsight}
                  onViewInChat={onViewInChat}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'fontes' && (
          <div className="insights-fontes">
            <p className="insights-fontes-label">Arquivo ativo</p>
            <SourceCard
              name={fileMetadata.fileName}
              meta={`${fileMetadata.rowCount.toLocaleString('pt-BR')} respondentes · ${fileMetadata.columnCount} colunas`}
            />
          </div>
        )}
      </div>
    </aside>
  );
};

export default InsightsPanel;
