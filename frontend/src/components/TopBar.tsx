import React, { useState, useRef, useEffect } from 'react';
import { FileMetadata, Message } from '../types';
import {
  THEMED_ASSETS,
  IconCompartilharCitrico,
  IconBalaoInterrogacao,
} from '../brand/assets';
import { useTheme } from '../contexts/ThemeContext';
import SharePopover from './SharePopover';
import HelpModal from './HelpModal';

interface Props {
  fileMetadata: FileMetadata;
  researchTitle?: string;  // ITEM 2: título da pesquisa (1º prompt); fallback = nome do arquivo
  isSessionActive: boolean; // ITEM 4: controla o badge de status
  insightsPanelOpen: boolean;
  isFixed: boolean;
  onToggleInsights: () => void;
  onToggleSidebar: () => void;
  onGetMessages: () => Message[];
  onToggleFixed: () => void;
}

const InsightsPanelIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="15" y1="3" x2="15" y2="21" />
    {open && <line x1="19" y1="9" x2="15" y2="9" />}
    {open && <line x1="19" y1="15" x2="15" y2="15" />}
  </svg>
);

const TopBar: React.FC<Props> = ({ fileMetadata, researchTitle, isSessionActive, insightsPanelOpen, isFixed, onToggleInsights, onToggleSidebar, onGetMessages, onToggleFixed }) => {
  // ITEM 2: usa o título derivado do 1º prompt quando disponível; senão, nome do arquivo
  const title = researchTitle || fileMetadata.fileName.replace(/\.xlsx$/i, '');
  const { theme, toggleTheme } = useTheme();
  const assets = THEMED_ASSETS[theme];
  const [shareOpen, setShareOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shareOpen) return;
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [shareOpen]);

  return (
    <header className="app-topbar">
      <button
        className="topbar-hamburger"
        onClick={onToggleSidebar}
        aria-label="Abrir menu"
        title="Menu"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="topbar-left">
        <h1 className="topbar-title" title={title}>
          {title.length > 48 ? title.slice(0, 46) + '…' : title}
        </h1>
        {/* ITEM 4: badge reflete estado real da sessão */}
        {isSessionActive
          ? <span className="topbar-badge topbar-badge--andamento">Em andamento</span>
          : <span className="topbar-badge topbar-badge--arquivada">Sessão encerrada</span>
        }
      </div>

      <div className="topbar-right">
        {/* Ordem: ações sobre a conversa (fixar → fontes → exportar) → globais (ajuda → tema) → selo */}

        <button
          className={`topbar-icon-btn${isFixed ? ' topbar-icon-btn--active' : ''}`}
          onClick={onToggleFixed}
          aria-label={isFixed ? 'Desafixar pesquisa' : 'Fixar pesquisa'}
          title={isFixed ? 'Desafixar pesquisa' : 'Fixar pesquisa'}
          type="button"
        >
          {isFixed ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4z" fill="currentColor" stroke="none"/>
              <path d="M9 15l-4.5 4.5"/>
              <path d="M14.5 4l5.5 5.5"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"/>
              <path d="M9 15l-4.5 4.5"/>
              <path d="M14.5 4l5.5 5.5"/>
            </svg>
          )}
        </button>

        <button
          className={`topbar-icon-btn${insightsPanelOpen ? ' topbar-icon-btn--active' : ''}`}
          onClick={onToggleInsights}
          aria-label={insightsPanelOpen ? 'Fechar painel de insights' : 'Abrir painel de insights'}
          title="Insights"
          type="button"
        >
          <InsightsPanelIcon open={insightsPanelOpen} />
        </button>

        <div className="topbar-share-wrap" ref={shareRef}>
          <button
            className={`topbar-icon-btn${shareOpen ? ' topbar-icon-btn--active' : ''}`}
            aria-label="Exportar"
            title="Exportar relatório"
            type="button"
            onClick={() => setShareOpen(p => !p)}
          >
            <img src={IconCompartilharCitrico} alt="" width={20} height={20} aria-hidden="true" />
          </button>
          {shareOpen && (
            <SharePopover
              title={title}
              onGetMessages={onGetMessages}
              onClose={() => setShareOpen(false)}
            />
          )}
        </div>

        <button
          className="topbar-icon-btn"
          aria-label="Ajuda"
          title="Ajuda"
          type="button"
          onClick={() => setHelpOpen(true)}
        >
          <img src={IconBalaoInterrogacao} alt="" width={22} height={22} aria-hidden="true" />
        </button>

        <button
          className="topbar-icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
          title={theme === 'light' ? 'Tema escuro' : 'Tema claro'}
          type="button"
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>

        <div className="topbar-seal" title="Localiza&CO">
          <img src={assets.logoCoCompact} alt="Localiza&CO" height={28} />
        </div>
      </div>

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </header>
  );
};

export default TopBar;
