import React, { useState, useRef, useEffect } from 'react';
import { Research } from '../types';
import {
  LogoLocalizaCoDark,
  LcoCompactoDark,
} from '../brand/assets';
const MAX_RECENT = 5;

/* Ícone "painel lateral" — retângulo com coluna esquerda marcada */
const SidePanelIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M9 3v18" />
  </svg>
);

interface Props {
  researches: Research[];
  currentResearchId: string | null;
  activeSessionResearch: Research | null; // sessão ativa (rascunho ou commitada)
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNewResearch: () => void;
  onOpenSearch: () => void;
  onSelectResearch: (r: Research) => void;
  onFixar: (id: string, fixada: boolean) => void;
  onRenomear: (id: string, novoTitulo: string) => void;
  onExcluir: (id: string) => void;
  onClearAll: () => void;
  userName?: string;
  userEmail?: string;
}

const SidebarNav: React.FC<Props> = ({
  researches,
  currentResearchId,
  activeSessionResearch,
  collapsed,
  onToggleCollapse,
  onNewResearch,
  onOpenSearch,
  onSelectResearch,
  onFixar,
  onRenomear,
  onExcluir,
  onClearAll,
  userName = 'Usuário',
  userEmail,
}) => {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  const activeSessionResearchId = activeSessionResearch?.id ?? null;
  const [menuOpenId, setMenuOpenId]       = useState<string | null>(null);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [renamingId, setRenamingId]       = useState<string | null>(null);
  const [renameVal, setRenameVal]         = useState('');
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [clearConfirm, setClearConfirm]   = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const h = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
        setClearConfirm(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [userMenuOpen]);

  const initials = userName
    .split(' ').filter(Boolean).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('') || 'U';

  // Exclui a sessão ativa de "Recentes" e "Fixadas" — ela aparece em "Pesquisa atual"
  const fixed = [...researches.filter(r => r.fixada && r.id !== activeSessionResearchId)].sort(
    (a, b) => b.atualizadaEm.localeCompare(a.atualizadaEm)
  );
  const recent = [...researches.filter(r => !r.fixada && r.id !== activeSessionResearchId)].sort(
    (a, b) => b.atualizadaEm.localeCompare(a.atualizadaEm)
  );
  const recentVisible = showAllRecent ? recent : recent.slice(0, MAX_RECENT);
  const hiddenCount   = recent.length - MAX_RECENT;

  const closeMenu = () => setMenuOpenId(null);
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  const startRename = (r: Research, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(r.id);
    setRenameVal(r.titulo);
    setMenuOpenId(null);
  };
  const submitRename = (id: string) => {
    if (renameVal.trim()) onRenomear(id, renameVal.trim());
    setRenamingId(null);
  };
  const startDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    setMenuOpenId(null);
  };

  const ResearchItem = ({ r }: { r: Research }) => {
    const isActive   = r.id === currentResearchId;
    const isDeleting = deletingId === r.id;
    const isRenaming = renamingId === r.id;
    const isMenuOpen = menuOpenId === r.id;
    const menuRef    = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isMenuOpen) return;
      const handler = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu();
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [isMenuOpen]);

    if (isDeleting) {
      return (
        <div className="sidebar-research-item sidebar-research-item--deleting">
          <span className="sidebar-delete-label">Excluir &ldquo;{r.titulo || r.nomeArquivo}&rdquo;?</span>
          <div className="sidebar-delete-actions">
            <button type="button" className="sidebar-delete-yes"
              onClick={e => { e.stopPropagation(); onExcluir(r.id); setDeletingId(null); }}>Sim</button>
            <button type="button" className="sidebar-delete-no"
              onClick={e => { e.stopPropagation(); setDeletingId(null); }}>Não</button>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`sidebar-research-item${isActive ? ' sidebar-research-item--active' : ''}`}
        onClick={() => !isRenaming && onSelectResearch(r)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && !isRenaming && onSelectResearch(r)}
      >
        {isRenaming ? (
          <input
            className="sidebar-rename-input"
            value={renameVal}
            autoFocus
            onChange={e => setRenameVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') submitRename(r.id);
              if (e.key === 'Escape') setRenamingId(null);
            }}
            onBlur={() => submitRename(r.id)}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <>
            <div className="sidebar-research-info">
              <span className="sidebar-research-text" title={r.titulo || r.nomeArquivo}>{r.titulo || r.nomeArquivo}</span>
              <span className="sidebar-research-meta">{fmtDate(r.atualizadaEm)}</span>
            </div>
            <div className="sidebar-research-menu-wrap" ref={menuRef}>
              <button
                className="sidebar-menu-btn"
                type="button"
                aria-label="Opções da pesquisa"
                onClick={e => {
                  e.stopPropagation();
                  setMenuOpenId(prev => prev === r.id ? null : r.id);
                  setDeletingId(null);
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
              </button>
              {isMenuOpen && (
                <div className="sidebar-context-menu" role="menu">
                  <button className="sidebar-context-item" type="button" role="menuitem"
                    onClick={e => { e.stopPropagation(); onFixar(r.id, !r.fixada); setMenuOpenId(null); }}>
                    {r.fixada ? 'Desafixar' : 'Fixar'}
                  </button>
                  <button className="sidebar-context-item" type="button" role="menuitem"
                    onClick={e => startRename(r, e)}>
                    Renomear
                  </button>
                  <button className="sidebar-context-item sidebar-context-item--danger" type="button" role="menuitem"
                    onClick={e => startDelete(r.id, e)}>
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar-nav${collapsed ? ' sidebar-nav--collapsed' : ''}`}>

      {/* (a) Topo fixo: logo + toggle */}
      <div className="sidebar-header">
        {collapsed
          ? <img src={LcoCompactoDark} alt="Localiza&amp;CO" height={32} className="sidebar-logo-img" />
          : <img src={LogoLocalizaCoDark} alt="Localiza&amp;CO" height={28} className="sidebar-logo-img" />
        }
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          type="button"
        >
          <SidePanelIcon />
        </button>
      </div>

      <div className="sidebar-cta-wrap">
        <button className="btn-nova-pesquisa" onClick={onNewResearch} title="Nova pesquisa" type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {!collapsed && <span>Nova pesquisa</span>}
        </button>
        <button
          className="sidebar-search-icon-btn"
          onClick={onOpenSearch}
          aria-label="Buscar pesquisas"
          title={`Buscar pesquisas (${isMac ? '⌘K' : 'Ctrl+K'})`}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>

      {/* (b) Miolo rolável: Pesquisa atual → Recentes → Fixadas */}
      {!collapsed && (
        <nav className="sidebar-lists" aria-label="Pesquisas">

          {/* PESQUISA ATUAL — visível somente quando há sessão ativa */}
          {activeSessionResearch && (
            <>
              <div className="sidebar-list-section">
                <p className="sidebar-list-label">Pesquisa atual</p>
                <ResearchItem r={activeSessionResearch} />
              </div>
              <div className="sidebar-section-divider" />
            </>
          )}

          {/* RECENTES */}
          <div className="sidebar-list-section">
            <p className="sidebar-list-label">Recentes</p>
            {recent.length === 0
              ? <p className="sidebar-empty-placeholder">Nenhuma pesquisa ainda</p>
              : recentVisible.map(r => <ResearchItem key={r.id} r={r} />)
            }
            {hiddenCount > 0 && (
              <button
                className="sidebar-see-more-btn"
                type="button"
                onClick={() => setShowAllRecent(p => !p)}
              >
                {showAllRecent ? 'Ver menos' : `Ver mais (${hiddenCount})`}
              </button>
            )}
          </div>

          <div className="sidebar-section-divider" />

          {/* FIXADAS */}
          <div className="sidebar-list-section">
            <p className="sidebar-list-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"/>
                <path d="M9 15l-4.5 4.5"/>
                <path d="M14.5 4l5.5 5.5"/>
              </svg>
              Fixadas
            </p>
            {fixed.length === 0
              ? <p className="sidebar-empty-placeholder">Nenhuma pesquisa fixada</p>
              : fixed.map(r => <ResearchItem key={r.id} r={r} />)
            }
          </div>


        </nav>
      )}

      {/* (c) Rodapé fixo */}
      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <div className="sidebar-footer-inner" ref={userMenuRef}>
          <button
            className="sidebar-user-btn"
            onClick={() => setUserMenuOpen(p => !p)}
            aria-label="Conta"
            title="Conta"
            type="button"
          >
            <div className="sidebar-avatar" aria-hidden="true">
              <span className="sidebar-avatar-initials">{initials}</span>
            </div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{userName}</span>
                {userEmail && <span className="sidebar-user-email">{userEmail}</span>}
              </div>
            )}
          </button>

          {userMenuOpen && (
            <div className="sidebar-user-menu" role="menu">
              <button className="sidebar-user-menu-item sidebar-user-menu-item--disabled"
                type="button" disabled role="menuitem">
                Perfil <span className="sidebar-user-menu-soon">(em breve)</span>
              </button>
              <div className="sidebar-user-menu-divider" />
              {clearConfirm ? (
                <div className="sidebar-clear-confirm">
                  <span className="sidebar-clear-label">Limpar tudo?</span>
                  <div className="sidebar-clear-actions">
                    <button type="button" className="sidebar-delete-yes"
                      onClick={() => { onClearAll(); setUserMenuOpen(false); setClearConfirm(false); }}>Sim</button>
                    <button type="button" className="sidebar-delete-no"
                      onClick={() => setClearConfirm(false)}>Não</button>
                  </div>
                </div>
              ) : (
                <button className="sidebar-user-menu-item sidebar-user-menu-item--danger"
                  type="button" role="menuitem" onClick={() => setClearConfirm(true)}>
                  Limpar todas as pesquisas
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};

export default SidebarNav;
