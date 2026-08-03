import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage } from '../services/api';
import { FileMetadata, Message } from '../types';
import MessageBubble from './MessageBubble';
import FileChip from './FileChip';
import { THEMED_ASSETS, GrafismoAmpersand } from '../brand/assets';
import { useTheme } from '../contexts/ThemeContext';

const SUGGESTIONS = [
  'Quais são os principais temas desta pesquisa?',
  'Mostre a distribuição dos respondentes',
  'Quais variáveis têm maior impacto no NPS?',
  'Resuma os achados mais importantes',
];

interface Props {
  fileMetadata: FileMetadata;
  pendingSuggestion: string;
  onSuggestionConsumed: () => void;
  onMessagesChange?: (msgs: Message[]) => void;
  initialMessages?: Message[];
  onSaveInsight?: (messageId: string, body: string) => void;
  isSessionActive?: boolean;       // ITEM 4: false = sessão histórica (somente leitura)
  onAiSuccess?: () => void;        // ITEM 3: chamado quando IA retorna com sucesso (atualiza data)
  onReactivate?: (file: File) => void; // ITEM 2b: re-upload para reativar sessão encerrada
  isReactivating?: boolean;
  reactivationError?: string | null;
  initialDraft?: string;           // rascunho do composer salvo ao navegar para outro chat
  onDraftChange?: (draft: string) => void; // notifica App a cada keystroke para persistir em memória
}

/* Folha cítrica — recorte do símbolo Localiza, para o TypingIndicator */
const LeafDot = () => (
  <svg className="leaf-dot" width="8" height="11" viewBox="22 0 14 19" fill="none" aria-hidden="true">
    <path
      d="M35.0129 0.576744 23.8672 5.13852C23.2597 5.38958 22.8926 5.93446 22.8926 6.59279L22.8926 19.0489 31.7089 15.5174C34.5768 14.3662 36.3154 11.8017 36.3154 8.71095L36.3154 1.45265C36.3154 0.725516 35.6837 0.301513 35.0129 0.576744Z"
      fill="currentColor"
    />
  </svg>
);

const makeWelcome = (meta: FileMetadata): Message => ({
  id: 'welcome',
  role: 'assistant',
  content: `Olá! O arquivo **${meta.fileName}** foi carregado com sucesso.\n\n**Resumo:**\n- **${meta.rowCount.toLocaleString('pt-BR')}** respondentes\n- **${meta.columnCount}** colunas na aba *data*\n- **${meta.codebookCount}** entradas no *codebook*\n\nFaça qualquer pergunta sobre os dados em linguagem natural.`,
  timestamp: new Date(),
});

const ChatInterface: React.FC<Props> = ({ fileMetadata, pendingSuggestion, onSuggestionConsumed, onMessagesChange, initialMessages, onSaveInsight, isSessionActive = true, onAiSuccess, onReactivate, isReactivating = false, reactivationError = null, initialDraft = '', onDraftChange }) => {
  const [messages, setMessages] = useState<Message[]>(
    () => initialMessages && initialMessages.length > 0 ? initialMessages : [makeWelcome(fileMetadata)]
  );

  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);
  const [input, setInput] = useState(initialDraft);

  // Notifica App sempre que o rascunho muda — App persiste em memória por conversa
  useEffect(() => {
    onDraftChange?.(input);
  }, [input, onDraftChange]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [composerMultiline, setComposerMultiline] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachInputRef = useRef<HTMLInputElement>(null);
  const reactivateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '24px';
    const newH = Math.min(el.scrollHeight, 192);
    el.style.height = newH + 'px';
    el.style.overflowY = el.scrollHeight > 192 ? 'auto' : 'hidden';
    setComposerMultiline(newH > 24);
  }, [input]);

  useEffect(() => {
    if (pendingSuggestion) {
      setInput(pendingSuggestion);
      onSuggestionConsumed();
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [pendingSuggestion, onSuggestionConsumed]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(fileMetadata.sessionId, text, [...messages, userMsg]);
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() },
      ]);
      // ITEM 3: notifica App para atualizar atualizadaEm somente em resposta bem-sucedida
      onAiSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao obter resposta.';
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: `**Erro:** ${msg}`, timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [input, isLoading, messages, fileMetadata.sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const { theme } = useTheme();
  const simbolo = THEMED_ASSETS[theme].simboloLocaliza;
  const hasUserMessages = messages.some(m => m.role === 'user');

  const handleChipClick = (text: string) => {
    setInput(text);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div className="chat-main">
      <img
        src={GrafismoAmpersand}
        className={`chat-grafismo${hasUserMessages ? ' chat-grafismo--active' : ''}`}
        alt=""
        aria-hidden="true"
      />

      {hasUserMessages ? (
        <div className="messages-list">
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} onSaveInsight={onSaveInsight} />)}
          {isLoading && (
            <div className="message assistant-msg">
              <div className="avatar assistant-avatar">
                <img src={simbolo} alt="" width={22} height={22} />
              </div>
              <div className="typing-dots">
                <LeafDot /><LeafDot /><LeafDot />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      ) : (
        <div className="chat-empty-state">
          <div className="empty-content">
            <h2 className="empty-greeting">
              Olá! O que vamos{' '}
              <span className="empty-greeting-accent">descobrir hoje?</span>
            </h2>
            <div className="empty-chips">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-chip-btn"
                  onClick={() => handleChipClick(s)}
                  type="button"
                >
                  <LeafDot />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="input-bar">
        {/* Chip do arquivo anexado (só relevante na sessão ativa) */}
        {attachedFile && isSessionActive && (
          <div className="input-chips-row">
            <FileChip
              file={attachedFile}
              progress={100}
              onRemove={() => setAttachedFile(null)}
            />
          </div>
        )}

        {/* Input oculto para seleção de arquivo (chat) */}
        <input
          ref={attachInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={e => {
            const f = e.target.files?.[0] ?? null;
            setAttachedFile(f);
            if (attachInputRef.current) attachInputRef.current.value = '';
          }}
        />

        {/* Input oculto para re-upload de reativação */}
        <input
          ref={reactivateInputRef}
          type="file"
          accept=".xlsx"
          style={{ display: 'none' }}
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onReactivate?.(f);
            if (reactivateInputRef.current) reactivateInputRef.current.value = '';
          }}
        />

        {isSessionActive ? (
          <div className={`composer${composerMultiline ? ' composer--multiline' : ''}`}>
            <button
              className="attach-btn"
              type="button"
              aria-label="Anexar arquivo"
              title="Envie transcrições, planilhas ou documentos"
              onClick={() => attachInputRef.current?.click()}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Faça uma pergunta sobre os dados..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className={`send-btn${!input.trim() || isLoading ? ' disabled' : ''}`}
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Enviar mensagem"
              title="Enviar mensagem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        ) : (
          /* Linha de status compacta: sessão encerrada */
          <div className="session-status-row">
            <div className="session-status-card">
              {/* Círculo com ícone reload — decorativo */}
              <div className="session-status-icon-wrap" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
              </div>

              {/* Texto: título + descrição com nome do arquivo */}
              <div className="session-status-body">
                <p className="session-status-title">Esta sessão foi encerrada</p>
                <p className="session-status-desc">
                  Reenvie o arquivo original{' '}
                  <strong>{fileMetadata.fileName}</strong>
                  {' '}para continuar a conversa
                </p>
              </div>

              {/* Ação: erro (se houver) + botão */}
              <div className="session-status-action">
                {reactivationError && (
                  <p className="session-status-error">{reactivationError}</p>
                )}
                <button
                  className="btn-reativar-card"
                  type="button"
                  disabled={isReactivating}
                  onClick={() => reactivateInputRef.current?.click()}
                >
                  {isReactivating ? (
                    <>
                      <div className="spinner spinner--sm" aria-hidden="true" />
                      <span>Verificando…</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>Reativar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="input-caption">O Explorador pode cometer erros. Verifique informações importantes antes de tomar decisões.</p>
      </div>
    </div>
  );
};

export default ChatInterface;
