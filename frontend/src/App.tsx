import React, { useState, useCallback, useRef, useEffect } from 'react';
import UploadScreen from './components/UploadScreen';
import UploadModal from './components/UploadModal';
import ChatInterface from './components/ChatInterface';
import SidebarNav from './components/SidebarNav';
import TopBar from './components/TopBar';
import InsightsPanel from './components/InsightsPanel';
import SearchModal from './components/SearchModal';
import { FileMetadata, Message, Research, SavedInsight } from './types';
import { researchStore } from './store/researchStore';
import { uploadFile } from './services/api';
import { computeFingerprint } from './utils/fingerprint';
import './App.css';

const SIDEBAR_KEY  = 'sidebar_collapsed';
const INSIGHTS_KEY = 'insights_panel_open';

/**
 * Deriva o título da pesquisa a partir do primeiro prompt do usuário.
 *
 * TODO (geração de título por IA): Quando o backend estiver conectado, substitua
 * o corpo desta função por uma chamada assíncrona ao endpoint de geração de título,
 * por exemplo:
 *   const { title } = await fetch('/api/generate-title', { body: JSON.stringify({ firstPrompt }) })
 *                             .then(r => r.json());
 *   return title;
 * O truncamento abaixo serve de fallback legível — mesmo padrão do ChatGPT/Claude.
 */
function generateTitleFromConversation(firstPrompt: string): string {
  const MAX_LEN = 50;
  const cleaned = firstPrompt.replace(/\n+/g, ' ').trim();
  return cleaned.length > MAX_LEN ? cleaned.slice(0, MAX_LEN - 1) + '…' : cleaned;
}

interface ReactivationPending {
  researchId: string;
  metadata: FileMetadata;
  fingerprint: string;
  fileSize: number;
  type: 'mismatch' | 'unverifiable';
}

const App: React.FC = () => {
  const [researches, setResearches]     = useState<Research[]>(() => researchStore.getAll());
  const [currentResearchId, setCurrentResearchId] = useState<string | null>(null);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [pendingSuggestion, setPendingSuggestion] = useState('');
  const [chatKey, setChatKey]           = useState(0);

  // ITEM 1 (novo): ID da pesquisa com sessão ativa (arquivo em memória nesta aba)
  const [activeSessionResearchId, setActiveSessionResearchId] = useState<string | null>(null);
  // Objeto do rascunho em memória — para exibição na sidebar "PESQUISA ATUAL" antes do 1º commit
  const [draftResearch, setDraftResearch] = useState<Research | null>(null);

  // ITEM 2: estado de reativação
  const [isReactivating, setIsReactivating]         = useState(false);
  const [reactivationError, setReactivationError]   = useState<string | null>(null);
  const [reactivationPending, setReactivationPending] = useState<ReactivationPending | null>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_KEY) === 'true'
  );
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(
    () => localStorage.getItem(INSIGHTS_KEY) !== 'false'
  );
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const messagesRef  = useRef<Message[]>([]);
  const lastFocusRef = useRef<Element | null>(null);
  // ITEM 1: rascunho em memória — só vai para o store na 1ª mensagem do usuário
  const draftResearchRef = useRef<Research | null>(null);
  // Rascunhos do composer por research ID — em memória, zerados ao recarregar a página
  const composerDraftsRef = useRef<Map<string, string>>(new Map());

  // ITEM 4 (derivado): true somente quando o arquivo desta sessão ainda está em memória
  const isSessionActive = Boolean(activeSessionResearchId && currentResearchId === activeSessionResearchId);

  const refreshResearches = () => setResearches(researchStore.getAll());

  // ITEM 1: cria rascunho em memória (NÃO persiste no store)
  const handleUploadSuccess = useCallback((metadata: FileMetadata, fingerprint: string, fileSize: number) => {
    const draft: Research = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      titulo: '',
      criadaEm: new Date().toISOString(),
      atualizadaEm: new Date().toISOString(),
      fixada: false,
      nomeArquivo: metadata.fileName,
      fileMetadata: metadata,
      mensagens: [],
      insights: [],
      fileFingerprint: fingerprint || undefined,
      fileSize,
    };
    draftResearchRef.current = draft;
    setCurrentResearchId(draft.id);
    setActiveSessionResearchId(draft.id); // ITEM 1: marca sessão ativa
    setDraftResearch(draft);              // para exibição em "PESQUISA ATUAL" antes do 1º commit
    setFileMetadata(metadata);
    setInitialMessages([]);
    setChatKey(k => k + 1);
    // Não chama researchStore.create() nem refreshResearches()
  }, []);

  const handleMessagesChange = useCallback((msgs: Message[]) => {
    messagesRef.current = msgs;
    const draft = draftResearchRef.current;

    if (draft && currentResearchId === draft.id) {
      const firstUserMsg = msgs.find(m => m.role === 'user');
      if (firstUserMsg) {
        // ITEM 1+2: 1ª mensagem → commit do rascunho com título = texto do prompt
        const titulo = generateTitleFromConversation(firstUserMsg.content);
        const committed: Research = { ...draft, titulo, mensagens: msgs };
        researchStore.commitDraft(committed);
        draftResearchRef.current = null;
        setDraftResearch(null); // committed: research now in store
        refreshResearches();
      }
      // Sem mensagem do usuário ainda → não persiste
    } else if (currentResearchId && !draftResearchRef.current) {
      // ITEM 3: salva mensagens sem atualizar atualizadaEm (evita reordenação)
      researchStore.update(currentResearchId, { mensagens: msgs }, { silent: true });
      refreshResearches();
    }
  }, [currentResearchId]);

  // ITEM 3: chamado pelo ChatInterface só quando a IA responde com sucesso
  const handleAiSuccess = useCallback(() => {
    if (currentResearchId) {
      researchStore.update(currentResearchId, {});
      refreshResearches();
    }
  }, [currentResearchId]);

  const handleGetMessages = useCallback(() => messagesRef.current, []);

  // Persiste o rascunho do composer em memória — por research ID, sem localStorage
  const handleDraftChange = useCallback((draft: string) => {
    if (currentResearchId) composerDraftsRef.current.set(currentResearchId, draft);
  }, [currentResearchId]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  }, []);

  const handleToggleInsights = useCallback(() => {
    setInsightsPanelOpen(prev => {
      const next = !prev;
      localStorage.setItem(INSIGHTS_KEY, String(next));
      return next;
    });
  }, []);

  // Navegar para qualquer conversa (incluindo históricos) NÃO descarta nem encerra a
  // sessão viva. O descarte de rascunho só ocorre em handleUploadSuccess (novo upload).
  const handleSelectResearch = useCallback((r: Research) => {
    // Fecha modal de reativação se estiver aberto para outra pesquisa
    setReactivationPending(null);
    setReactivationError(null);
    // ITEM 3: NÃO salva mensagens aqui — handleMessagesChange já faz isso silenciosamente
    setCurrentResearchId(r.id);
    setFileMetadata(r.fileMetadata);
    setInitialMessages(r.mensagens);
    setPendingSuggestion('');
    setChatKey(k => k + 1);
    // isSessionActive é derivado: será true se r.id === activeSessionResearchId
  }, []);

  const handleFixar = useCallback((id: string, fixada: boolean) => {
    researchStore.update(id, { fixada });
    refreshResearches();
  }, []);

  const handleRenomear = useCallback((id: string, novoTitulo: string) => {
    researchStore.update(id, { titulo: novoTitulo });
    refreshResearches();
  }, []);

  const handleToggleFixed = useCallback(() => {
    if (!currentResearchId) return;
    const current = researches.find(r => r.id === currentResearchId);
    if (!current) return;
    researchStore.update(currentResearchId, { fixada: !current.fixada });
    refreshResearches();
  }, [currentResearchId, researches]);

  const handleExcluir = useCallback((id: string) => {
    researchStore.remove(id);
    refreshResearches();
    // Se a pesquisa excluída era a sessão ativa, encerrar a sessão
    if (id === activeSessionResearchId) {
      setActiveSessionResearchId(null);
      draftResearchRef.current = null;
      setDraftResearch(null);
    }
    if (id === currentResearchId) {
      const remaining = researchStore.getAll();
      if (remaining.length > 0) {
        const next = remaining[0];
        setCurrentResearchId(next.id);
        setFileMetadata(next.fileMetadata);
        setInitialMessages(next.mensagens);
        setChatKey(k => k + 1);
      } else {
        setCurrentResearchId(null);
        setFileMetadata(null);
        setInitialMessages([]);
      }
    }
  }, [currentResearchId, activeSessionResearchId]);

  const handleSaveInsight = useCallback((messageId: string, body: string) => {
    if (!currentResearchId) return;
    const current = researchStore.getAll().find(r => r.id === currentResearchId);
    if (!current) return;
    const newInsight: SavedInsight = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      messageId,
      body,
      savedAt: new Date().toISOString(),
    };
    researchStore.update(currentResearchId, { insights: [...current.insights, newInsight] });
    refreshResearches();
  }, [currentResearchId]);

  const handleRemoveInsight = useCallback((id: string) => {
    if (!currentResearchId) return;
    const current = researchStore.getAll().find(r => r.id === currentResearchId);
    if (!current) return;
    researchStore.update(currentResearchId, { insights: current.insights.filter(i => i.id !== id) });
    refreshResearches();
  }, [currentResearchId]);

  const handleViewInChat = useCallback((messageId: string) => {
    const el = document.querySelector<HTMLElement>(`[data-message-id="${messageId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleOpenSearch = useCallback(() => {
    lastFocusRef.current = document.activeElement;
    setSearchOpen(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setSearchOpen(false);
    (lastFocusRef.current as HTMLElement | null)?.focus();
  }, []);

  // ITEM 2: aplica reativação — atualiza store e marca sessão como ativa
  const performReactivation = useCallback((
    researchId: string,
    metadata: FileMetadata,
    fingerprint: string,
    fileSize: number,
  ) => {
    researchStore.update(researchId, {
      fileMetadata: metadata,
      fileFingerprint: fingerprint || undefined,
      fileSize,
    }, { silent: true });
    setResearches(researchStore.getAll());
    setFileMetadata(metadata);
    // Se havia rascunho pendente, descartá-lo — a sessão reativada toma o lugar
    draftResearchRef.current = null;
    setDraftResearch(null);
    setActiveSessionResearchId(researchId);
    setReactivationPending(null);
    setReactivationError(null);
    //
    // TODO (backend): quando o serviço de IA estiver conectado, a reativação poderá
    // ocorrer SEM re-upload: bastaria criar uma nova sessão de IA com o contexto
    // já indexado no servidor (ex.: POST /api/reactivate-session com sessionId original
    // ou fingerprint). Substituir o uploadFile() acima por essa chamada ao ativar
    // o backend, e mover performReactivation para depois da resposta do servidor.
  }, []);

  // ITEM 2c: lida com o arquivo enviado pelo botão "Reativar análise"
  const handleReactivate = useCallback(async (file: File) => {
    if (!currentResearchId) return;
    setIsReactivating(true);
    setReactivationError(null);
    try {
      const [metadata, newFingerprint] = await Promise.all([
        uploadFile(file),
        computeFingerprint(file),
      ]);
      const research = researchStore.getAll().find(r => r.id === currentResearchId);
      const storedFingerprint = research?.fileFingerprint;

      if (storedFingerprint && newFingerprint && newFingerprint === storedFingerprint) {
        // Mesma assinatura → reativar imediatamente
        performReactivation(currentResearchId, metadata, newFingerprint, file.size);
      } else if (!storedFingerprint || !newFingerprint) {
        // Sem fingerprint armazenado ou erro ao calcular → aviso leve
        setReactivationPending({
          researchId: currentResearchId,
          metadata,
          fingerprint: newFingerprint,
          fileSize: file.size,
          type: 'unverifiable',
        });
      } else {
        // Divergência de assinatura → modal de confirmação
        setReactivationPending({
          researchId: currentResearchId,
          metadata,
          fingerprint: newFingerprint,
          fileSize: file.size,
          type: 'mismatch',
        });
      }
    } catch (err: unknown) {
      setReactivationError(err instanceof Error ? err.message : 'Erro ao processar arquivo.');
    } finally {
      setIsReactivating(false);
    }
  }, [currentResearchId, performReactivation]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => {
          if (prev) {
            (lastFocusRef.current as HTMLElement | null)?.focus();
            return false;
          }
          lastFocusRef.current = document.activeElement;
          return true;
        });
      }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  const currentResearch  = researches.find(r => r.id === currentResearchId);
  const currentInsights: SavedInsight[] = currentResearch?.insights ?? [];

  // Pesquisa ativa para "PESQUISA ATUAL" na sidebar: rascunho (não commitado) OU commitada
  const activeSessionResearch: Research | null = activeSessionResearchId
    ? (researches.find(r => r.id === activeSessionResearchId) ??
       (draftResearch?.id === activeSessionResearchId ? draftResearch : null))
    : null;

  if (!fileMetadata) {
    return <UploadScreen onUploadSuccess={handleUploadSuccess} />;
  }

  return (
    <div className={`app-shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      {!sidebarCollapsed && (
        <div className="sidebar-backdrop" onClick={handleToggleSidebar} aria-hidden="true" />
      )}
      <SidebarNav
        researches={researches}
        currentResearchId={currentResearchId}
        activeSessionResearch={activeSessionResearch}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        onNewResearch={() => {
          if (researches.length > 0) setUploadModalOpen(true);
          else setFileMetadata(null);
        }}
        onOpenSearch={handleOpenSearch}
        onSelectResearch={handleSelectResearch}
        onFixar={handleFixar}
        onRenomear={handleRenomear}
        onExcluir={handleExcluir}
        onClearAll={() => {
          researches.forEach(r => researchStore.remove(r.id));
          draftResearchRef.current = null;
          setDraftResearch(null);
          refreshResearches();
          setActiveSessionResearchId(null);
          setCurrentResearchId(null);
          setFileMetadata(null);
          setInitialMessages([]);
        }}
      />
      <div className="app-content">
        <div className="app-main-area">
          <TopBar
            fileMetadata={fileMetadata}
            researchTitle={currentResearch?.titulo || undefined}
            isSessionActive={isSessionActive}
            insightsPanelOpen={insightsPanelOpen}
            isFixed={currentResearch?.fixada ?? false}
            onToggleInsights={handleToggleInsights}
            onToggleSidebar={handleToggleSidebar}
            onGetMessages={handleGetMessages}
            onToggleFixed={handleToggleFixed}
          />
          <ChatInterface
            key={chatKey}
            fileMetadata={fileMetadata}
            pendingSuggestion={pendingSuggestion}
            onSuggestionConsumed={() => setPendingSuggestion('')}
            onMessagesChange={handleMessagesChange}
            initialMessages={initialMessages}
            onSaveInsight={handleSaveInsight}
            isSessionActive={isSessionActive}
            onAiSuccess={handleAiSuccess}
            onReactivate={handleReactivate}
            isReactivating={isReactivating}
            reactivationError={reactivationError}
            initialDraft={currentResearchId ? (composerDraftsRef.current.get(currentResearchId) ?? '') : ''}
            onDraftChange={handleDraftChange}
          />
        </div>
        <InsightsPanel
          fileMetadata={fileMetadata}
          open={insightsPanelOpen}
          onClose={() => {
            setInsightsPanelOpen(false);
            localStorage.setItem(INSIGHTS_KEY, 'false');
          }}
          insights={currentInsights}
          onRemoveInsight={handleRemoveInsight}
          onViewInChat={handleViewInChat}
        />
      </div>
      {uploadModalOpen && (
        <UploadModal
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setUploadModalOpen(false)}
        />
      )}
      {searchOpen && (
        <SearchModal
          researches={researches}
          onSelect={r => { handleSelectResearch(r); handleCloseSearch(); }}
          onClose={handleCloseSearch}
        />
      )}

      {/* ITEM 2c: modal de confirmação para divergência/ausência de fingerprint */}
      {reactivationPending && (
        <div
          className="modal-overlay"
          onClick={() => setReactivationPending(null)}
          role="dialog"
          aria-modal="true"
          aria-label={reactivationPending.type === 'mismatch' ? 'Arquivo diferente' : 'Verificação não disponível'}
        >
          <div className="fingerprint-modal" onClick={e => e.stopPropagation()}>
            {reactivationPending.type === 'mismatch' ? (
              <>
                <div className="fingerprint-modal-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <h2 className="fingerprint-modal-title">Arquivo diferente</h2>
                <p className="fingerprint-modal-body">
                  O arquivo enviado tem uma assinatura digital diferente do arquivo original desta análise.
                  Continuar pode produzir resultados inconsistentes com a conversa anterior.
                </p>
                <div className="fingerprint-modal-actions">
                  <button
                    className="btn-modal-secondary"
                    type="button"
                    onClick={() => setReactivationPending(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-modal-danger"
                    type="button"
                    onClick={() => performReactivation(
                      reactivationPending.researchId,
                      reactivationPending.metadata,
                      reactivationPending.fingerprint,
                      reactivationPending.fileSize,
                    )}
                  >
                    Continuar mesmo assim
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="fingerprint-modal-title">Verificação não disponível</h2>
                <p className="fingerprint-modal-body">
                  Esta análise não possui assinatura digital registrada, portanto não é possível
                  confirmar que o arquivo é o mesmo. Deseja prosseguir assim mesmo?
                </p>
                <div className="fingerprint-modal-actions">
                  <button
                    className="btn-modal-secondary"
                    type="button"
                    onClick={() => setReactivationPending(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-modal-primary"
                    type="button"
                    onClick={() => performReactivation(
                      reactivationPending.researchId,
                      reactivationPending.metadata,
                      reactivationPending.fingerprint,
                      reactivationPending.fileSize,
                    )}
                  >
                    Prosseguir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
