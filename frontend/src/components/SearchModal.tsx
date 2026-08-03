import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Research } from '../types';

interface Props {
  researches: Research[];
  onSelect: (r: Research) => void;
  onClose: () => void;
}

interface SearchResult {
  research: Research;
  matchType: 'title' | 'message';
  snippet?: string;
}

/* Normaliza para comparação accent-insensitive e case-insensitive.
   Como NFD decompõe diacríticos em combining marks e os removemos,
   o comprimento resultante é igual ao do original em NFC — as posições
   de índice são intercambiáveis entre normText e text. */
function norm(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/* Escapa caracteres especiais de regex para uso seguro em new RegExp(). */
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* Testa se alguma palavra em normText COMEÇA com normQ.
   \b garante que o match ocorre apenas em início de palavra — "oi" casa
   "oitavo" mas não "foi" nem "heroico". */
function matchesWordPrefix(normText: string, normQ: string): boolean {
  if (!normQ) return false;
  return new RegExp(`\\b${escapeRe(normQ)}`).test(normText);
}

function extractSnippet(text: string, normQ: string, len = 120): string {
  const nt = norm(text);
  const m  = new RegExp(`\\b${escapeRe(normQ)}`).exec(nt);
  const i  = m ? m.index : -1;
  if (i === -1) return text.slice(0, len);
  const half  = Math.floor((len - normQ.length) / 2);
  const start = Math.max(0, i - half);
  const end   = Math.min(text.length, start + len);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

function highlight(text: string, query: string): React.ReactNode {
  const normQ = norm(query.trim());
  if (!normQ) return text;
  const normText = norm(text);
  const re = new RegExp(`\\b${escapeRe(normQ)}`, 'g');
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(normText)) !== null) {
    const idx = match.index;
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(
      <mark key={idx} className="search-highlight">
        {text.slice(idx, idx + normQ.length)}
      </mark>
    );
    cursor = idx + normQ.length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

const MAX_RESULTS = 20;

const SearchModal: React.FC<Props> = ({ researches, onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [dq, setDq]       = useState(''); // debounced
  const [sel, setSel]     = useState(0);
  const inputRef  = useRef<HTMLInputElement>(null);
  const listRef   = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Autofocus
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Debounce 120 ms
  useEffect(() => {
    const t = setTimeout(() => { setDq(query); setSel(0); }, 120);
    return () => clearTimeout(t);
  }, [query]);

  // Esc fecha
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const h = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const nodes = Array.from(
        el.querySelectorAll<HTMLElement>('input,button,[tabindex]:not([tabindex="-1"])')
      );
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
    };
    el.addEventListener('keydown', h);
    return () => el.removeEventListener('keydown', h);
  }, []);

  // Índice memoizado — recalcula só quando researches muda
  const index = useMemo(() => researches.map(r => ({
    r,
    t: norm(r.titulo),
    f: norm(r.nomeArquivo),
    msgs: r.mensagens.map(m => ({ n: norm(m.content), o: m.content })),
  })), [researches]);

  // Resultados
  const results: SearchResult[] = useMemo(() => {
    const q = dq.trim();
    if (!q) {
      return [...researches]
        .sort((a, b) => b.atualizadaEm.localeCompare(a.atualizadaEm))
        .slice(0, MAX_RESULTS)
        .map(r => ({ research: r, matchType: 'title' as const }));
    }
    const nq = norm(q);
    const titles: SearchResult[] = [];
    const msgs:   SearchResult[] = [];
    for (const e of index) {
      if (matchesWordPrefix(e.t, nq) || matchesWordPrefix(e.f, nq)) {
        titles.push({ research: e.r, matchType: 'title' });
        continue;
      }
      for (const m of e.msgs) {
        if (matchesWordPrefix(m.n, nq)) {
          msgs.push({ research: e.r, matchType: 'message', snippet: extractSnippet(m.o, nq) });
          break; // um match por pesquisa é suficiente
        }
      }
    }
    const byDate = (a: SearchResult, b: SearchResult) =>
      b.research.atualizadaEm.localeCompare(a.research.atualizadaEm);
    return [...titles.sort(byDate), ...msgs.sort(byDate)].slice(0, MAX_RESULTS);
  }, [dq, index, researches]);

  // Rola item selecionado para visível
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${sel}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault(); setSel(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setSel(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[sel]) {
      e.preventDefault(); onSelect(results[sel].research); onClose();
    }
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });

  return (
    <div
      className="search-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        className="search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Buscar pesquisas"
        onKeyDown={handleKeyDown}
      >
        {/* Input row */}
        <div className="search-input-row">
          <svg className="search-input-icon" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por título ou conteúdo das conversas..."
            aria-label="Buscar pesquisas"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="search-close-btn"
            onClick={onClose}
            aria-label="Fechar busca"
            title="Fechar (Esc)"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="search-divider" />

        {/* Lista de resultados */}
        <div className="search-results" ref={listRef} role="listbox">
          {!dq.trim() && researches.length > 0 && (
            <p className="search-section-label">Recentes</p>
          )}

          {results.length === 0 && dq.trim() ? (
            <div className="search-empty-state">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Nenhuma conversa encontrada para &ldquo;{dq}&rdquo;</span>
            </div>
          ) : results.map((r, i) => (
            <div
              key={r.research.id}
              className={`search-result-item${i === sel ? ' search-result-item--active' : ''}`}
              role="option"
              aria-selected={i === sel}
              data-idx={i}
              onClick={() => { onSelect(r.research); onClose(); }}
              onMouseEnter={() => setSel(i)}
            >
              <div className="search-result-row">
                <div className="search-result-body">
                  <svg className="search-result-chat-icon" width="13" height="13"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span className="search-result-title">
                    {dq.trim() ? highlight(r.research.titulo, dq) : r.research.titulo}
                  </span>
                </div>
                <div className="search-result-meta">
                  {r.matchType === 'message' && (
                    <span className="search-result-tag">mensagem</span>
                  )}
                  <span className="search-result-date">{fmtDate(r.research.atualizadaEm)}</span>
                </div>
              </div>
              {r.snippet && (
                <p className="search-result-snippet">{highlight(r.snippet, dq)}</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;
