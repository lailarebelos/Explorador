import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { THEMED_ASSETS } from '../brand/assets';
import { useTheme } from '../contexts/ThemeContext';
import QuoteBubble from './QuoteBubble';

interface Props {
  message: Message;
  onSaveInsight?: (messageId: string, body: string) => void;
}

const MessageBubble: React.FC<Props> = ({ message, onSaveInsight }) => {
  const isUser = message.role === 'user';
  const timeStr = message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const { theme } = useTheme();
  const simbolo = THEMED_ASSETS[theme].simboloLocaliza;
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!onSaveInsight) return;
    onSaveInsight(message.id, message.content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`message ${isUser ? 'user-msg' : 'assistant-msg'}`} data-message-id={message.id}>
      {!isUser && (
        <div className="avatar assistant-avatar">
          <img src={simbolo} alt="Explorador Localiza" width={22} height={22} />
        </div>
      )}

      <div className={`bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
        {!isUser && onSaveInsight && (
          <button
            className={`bubble-save-btn${saved ? ' bubble-save-btn--saved' : ''}`}
            type="button"
            aria-label={saved ? 'Insight salvo' : 'Salvar como insight'}
            title={saved ? 'Salvo!' : 'Salvar como insight'}
            onClick={handleSave}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}
        {isUser ? (
          <p className="bubble-text">{message.content}</p>
        ) : (
          <div className="md-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                blockquote: ({ children }) => <QuoteBubble>{children}</QuoteBubble>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <span className="bubble-time">{timeStr}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
