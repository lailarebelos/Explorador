import React, { useEffect } from 'react';
import { THEMED_ASSETS, IconChatDuplo, IconMegafone } from '../brand/assets';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  onClose: () => void;
}

const steps = [
  {
    icon: 'upload' as const,
    title: 'Envie sua planilha de pesquisa',
    desc: 'Arraste ou selecione um arquivo .xlsx com abas "data" e "codebook" gerado pelo Normalizador.',
  },
  {
    icon: 'chat' as const,
    title: 'Pergunte em linguagem natural',
    desc: 'Faça perguntas sobre os dados como se estivesse conversando com um analista de pesquisa.',
  },
  {
    icon: 'megafone' as const,
    title: 'Salve e exporte os insights',
    desc: 'Use o painel lateral para fixar insights e exporte a conversa em Markdown.',
  },
];

const HelpModal: React.FC<Props> = ({ onClose }) => {
  const { theme } = useTheme();
  const logo = THEMED_ASSETS[theme].logoCoHorizontal;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Como usar">
      <div className="help-modal-card" onClick={e => e.stopPropagation()}>
        <div className="help-modal-header">
          <img src={logo} alt="Localiza&CO" height={28} />
          <button className="help-modal-close" onClick={onClose} aria-label="Fechar" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <h2 className="help-modal-title">Como usar o Explorador</h2>

        <div className="help-steps">
          {steps.map((s, i) => (
            <div key={i} className="help-step">
              <div className="help-step-num">{i + 1}</div>
              <div className="help-step-icon">
                {s.icon === 'upload' && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                )}
                {s.icon === 'chat' && (
                  <img src={IconChatDuplo} alt="" width={28} height={28} aria-hidden="true" />
                )}
                {s.icon === 'megafone' && (
                  <img src={IconMegafone} alt="" width={28} height={28} aria-hidden="true" />
                )}
              </div>
              <div className="help-step-content">
                <strong className="help-step-title">{s.title}</strong>
                <p className="help-step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="help-modal-btn" onClick={onClose} type="button">
          Entendi
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
