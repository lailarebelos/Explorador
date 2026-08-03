import React from 'react';
import { Message } from '../types';

interface Props {
  title: string;
  onGetMessages: () => Message[];
  onClose: () => void;
}

const fmt = (d: Date) =>
  new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const SharePopover: React.FC<Props> = ({ title, onGetMessages, onClose }) => {
  const handleExportMd = () => {
    const msgs = onGetMessages();
    const lines: string[] = [
      `# ${title}`,
      `**Exportado em:** ${fmt(new Date())}`,
      '',
      '---',
      '',
    ];
    for (const m of msgs) {
      if (m.id === 'welcome') continue;
      lines.push(`### ${m.role === 'user' ? 'Você' : 'Explorador'}`);
      lines.push(m.content);
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleCopyResume = async () => {
    const msgs = onGetMessages();
    const last = [...msgs].reverse().find(m => m.role === 'assistant' && m.id !== 'welcome');
    const text = last?.content ?? 'Nenhum insight disponível ainda.';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    onClose();
  };

  return (
    <div className="share-popover" role="menu">
      <button className="share-popover-item" onClick={handleExportMd} role="menuitem" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Exportar conversa (.md)
      </button>
      <button className="share-popover-item" onClick={handleCopyResume} role="menuitem" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copiar última resposta
      </button>
    </div>
  );
};

export default SharePopover;
