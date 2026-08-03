import React, { useState, useRef, DragEvent } from 'react';
import { uploadFile } from '../services/api';
import { computeFingerprint } from '../utils/fingerprint';
import { FileMetadata } from '../types';
import { THEMED_ASSETS, IconBalaoInterrogacao } from '../brand/assets';
import { useTheme } from '../contexts/ThemeContext';
import HelpModal from './HelpModal';

// ── Brand grafismo path data ─────────────────────────────────────────────────
// Extraídos de localiza-brand-assets (stroke only, sem fill).

const PATH_L_1 = 'M44.0463 1.15458 25.3512 8.82776C24.8608 9.01857 24.4408 9.35521 24.1477 9.79225 23.8547 10.2293 23.7027 10.7457 23.7123 11.2718L23.7123 32.212 38.5045 26.2724C40.812 25.3913 42.7919 23.8204 44.1743 21.7735 45.5567 19.7266 46.2744 17.3032 46.2298 14.8337L46.2298 2.64186C46.2512 2.37438 46.2015 2.106 46.0856 1.86396 45.9698 1.62193 45.7919 1.41486 45.5701 1.2638 45.3484 1.11274 45.0906 1.02307 44.8229 1.00389 44.5553 0.984709 44.2873 1.03669 44.0463 1.15458Z';
const PATH_L_2 = 'M1.00081 43.2196 1.00081 54.4973C1.00081 69.8673 12.1364 80.9981 27.5253 80.9981L44.1932 80.9981C44.4658 81.0081 44.7376 80.9617 44.9915 80.8619 45.2454 80.7622 45.476 80.6111 45.6689 80.4182 45.8618 80.2253 46.0128 79.9947 46.1126 79.7408 46.2124 79.4869 46.2588 79.2151 46.2488 78.9425L46.2488 60.4274C46.2587 60.1546 46.2124 59.8826 46.1126 59.6285 46.0129 59.3743 45.8619 59.1435 45.6691 58.9502 45.4763 58.7569 45.2457 58.6054 44.9918 58.5051 44.7379 58.4047 44.466 58.3578 44.1932 58.367L27.1464 58.367C26.691 58.3836 26.2371 58.3061 25.8129 58.1394 25.3888 57.9727 25.0036 57.7204 24.6814 57.3981 24.3591 57.0759 24.1068 56.6907 23.9401 56.2665 23.7733 55.8424 23.6958 55.3885 23.7124 54.9331L23.7124 32.1978 2.64912 40.7709C2.15421 40.9575 1.72964 41.2935 1.43428 41.7323 1.13893 42.171 0.987442 42.6909 1.00081 43.2196Z';
const PATH_AMP  = 'M420.01 375.852 418.75 376.357 419.607 377.411 545.031 531.644 545.034 531.648C549.576 537.175 545.753 545.089 538.376 545.089L422.28 545.089C418.509 545.089 415.219 543.58 412.889 540.667L412.883 540.659 366.034 483.31 365.328 482.446 364.546 483.241C318.077 530.456 261.517 556 197.622 556 85.6536 556 1 477.744 1 370.244 1 295.648 41.5453 236.529 124.546 189.682L125.582 189.098 124.828 188.178 93.5771 150.068C45.9293 91.8765 83.8689 1 167.057 1L413.637 1C416.028 1 418.006 1.84491 419.384 3.22912 420.762 4.61397 421.595 6.59323 421.595 8.96098L421.595 100.257C421.595 102.649 420.751 104.627 419.367 106.005 417.982 107.385 416.004 108.218 413.637 108.218L202.576 108.218 200.473 108.218 201.8 109.849 410.911 366.869 412.687 369.052 412.687 366.238 412.687 262.344C412.687 256.847 415.813 252.26 420.808 250.252L420.814 250.25 520.31 209.504 520.32 209.5C523.042 208.354 525.58 208.678 527.422 209.921 529.267 211.167 530.525 213.41 530.525 216.327L530.525 287.751C530.525 315.07 515.278 337.631 490.099 347.757L420.01 375.852ZM192.126 270.513 191.585 269.852 190.847 270.283C140.958 299.409 119.155 329.618 119.155 366.923 119.155 391.198 128.273 411.397 143.782 425.526 159.283 439.648 181.102 447.649 206.422 447.675L206.423 447.675C241.814 447.675 271.348 431.796 300.388 404.337L301.064 403.697 300.475 402.977 192.126 270.513Z';
const PATH_LEAF = 'M50.2034 474.372C35.6295 480.214 18.9534 475.898 9.04533 463.724L9.04533 463.719C3.84293 457.324 1 449.327 1 441.082L1 156.852C1 139.994 10.6819 125.939 25.9831 119.695L310.448 3.2281C327.621-3.95682 343.547 6.97579 343.547 25.3949L343.547 229.611C343.547 308.924 299.209 374.498 226.141 403.854L50.2034 474.372Z';
const PATH_HELIX  = 'M1 142.3 1 47.21C1 45.53 2.38 44.18 4.06 44.23 21.67 44.75 38.15 49.78 52.39 58.19 55 59.73 57.92 56.72 56.32 54.14 47.25 39.51 41.82 22.39 41.27 4.05 41.22 2.38 42.58 1 44.25 1L139.4 1C141.05 1 142.38 2.33 142.38 3.98L142.38 99.06C142.38 100.74 141 102.09 139.32 102.04 121.71 101.52 105.23 96.49 90.99 88.08 88.38 86.54 85.46 89.55 87.06 92.13 96.13 106.76 101.57 123.88 102.11 142.22 102.16 143.89 100.8 145.27 99.13 145.27L3.97998 145.27C2.32998 145.27 1 143.94 1 142.29Z';
const PATH_DLEAVES_1 = 'M9.04532 463.724C18.9534 475.898 35.6295 480.214 50.1988 474.373L226.136 403.854C299.205 374.498 343.542 308.924 343.542 229.611L343.542 25.3949C343.542 6.97579 327.616-3.95682 310.443 3.2281L25.9831 119.695C10.6819 125.944 1 139.994 1 156.857L1 441.087C1 449.332 3.84292 457.328 9.04532 463.724Z';
const PATH_DLEAVES_2 = 'M243.656 528.586C229.082 534.427 212.406 530.112 202.498 517.937L202.498 517.933C197.296 511.537 194.453 503.541 194.453 495.296L194.453 211.066C194.453 194.208 204.135 180.153 219.436 173.908L503.901 57.4415C521.073 50.2566 537 61.1892 537 79.6083L537 283.824C537 363.138 492.662 428.711 419.593 458.067L243.656 528.586Z';

// ── Tile SVG 320×320 — grade 3×3 + 3 interstícios ───────────────────────────
function makeTileSvg(color: string): string {
  const p = (sw: number, d: string) =>
    `<path stroke='${color}' stroke-width='${sw}' fill='none' d='${d}'/>`;
  return (
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>` +
    `<g transform='translate(36,3) rotate(15) scale(0.766)' stroke-linejoin='round'>` +
      p(2.35, PATH_L_1) + p(2.35, PATH_L_2) +
    `</g>` +
    `<g transform='translate(143,50) rotate(-30) scale(0.292)' stroke-miterlimit='10'>` +
      p(6.16, PATH_HELIX) +
    `</g>` +
    `<g transform='translate(273,18) rotate(70) scale(0.110)' stroke-miterlimit='10'>` +
      p(16.4, PATH_LEAF) +
    `</g>` +
    `<g transform='translate(32,153) rotate(-55) scale(0.0743)' stroke-miterlimit='10'>` +
      p(24.2, PATH_DLEAVES_1) + p(24.2, PATH_DLEAVES_2) +
    `</g>` +
    `<g transform='translate(185,160) rotate(120) scale(0.0803)' stroke-linejoin='round'>` +
      p(22.4, PATH_AMP) +
    `</g>` +
    `<g transform='translate(248,170) rotate(-80) scale(0.723)' stroke-linejoin='round'>` +
      p(2.49, PATH_L_1) + p(2.49, PATH_L_2) +
    `</g>` +
    `<g transform='translate(106,273) rotate(155) scale(0.220)' stroke-miterlimit='10'>` +
      p(8.18, PATH_HELIX) +
    `</g>` +
    `<g transform='translate(137,251) rotate(-40) scale(0.104)' stroke-miterlimit='10'>` +
      p(17.3, PATH_LEAF) +
    `</g>` +
    `<g transform='translate(279,251) rotate(85) scale(0.0707)' stroke-miterlimit='10'>` +
      p(25.5, PATH_DLEAVES_1) + p(25.5, PATH_DLEAVES_2) +
    `</g>` +
    `<g transform='translate(88,29) rotate(-15) scale(0.085)' stroke-miterlimit='10'>` +
      p(21.2, PATH_LEAF) +
    `</g>` +
    `<g transform='translate(37,193) rotate(60) scale(0.045)' stroke-linejoin='round'>` +
      p(40.0, PATH_AMP) +
    `</g>` +
    `<g transform='translate(222,197) rotate(35) scale(0.180)' stroke-miterlimit='10'>` +
      p(10.0, PATH_HELIX) +
    `</g>` +
    `</svg>`
  );
}

const LIGHT_BG = `url("data:image/svg+xml,${encodeURIComponent(makeTileSvg('rgba(0,52,24,0.11)'))}")`;
const DARK_BG  = `url("data:image/svg+xml,${encodeURIComponent(makeTileSvg('rgba(120,222,31,0.11)'))}")`;

const BgPattern: React.FC<{ dark: boolean }> = ({ dark }) => (
  <div
    className="upload-bg-pattern"
    aria-hidden="true"
    style={{
      backgroundImage: dark ? DARK_BG : LIGHT_BG,
      backgroundRepeat: 'repeat',
      backgroundSize: '320px 320px',
    }}
  />
);

// ── Componente principal ──────────────────────────────────────────────────────
interface Props {
  onUploadSuccess: (metadata: FileMetadata, fingerprint: string, fileSize: number) => void;
}

const UploadScreen: React.FC<Props> = ({ onUploadSuccess }) => {
  const { theme, toggleTheme } = useTheme();
  const logo = THEMED_ASSETS[theme].logoCoHorizontal;
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setError('Por favor, envie apenas arquivos .xlsx gerados pelo Normalizador.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [metadata, fingerprint] = await Promise.all([
        uploadFile(file),
        computeFingerprint(file),
      ]);
      onUploadSuccess(metadata, fingerprint, file.size);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="upload-screen">
      <BgPattern dark={theme === 'dark'} />

      {/* Botões de ação — canto superior direito */}
      <div className="upload-top-actions">
        <button
          className="upload-action-btn"
          onClick={() => setHelpOpen(true)}
          aria-label="Como usar"
          title="Como usar"
          type="button"
        >
          <img src={IconBalaoInterrogacao} alt="" width={22} height={22} aria-hidden="true" />
        </button>
        <button
          className="upload-action-btn"
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
      </div>

      <div className="upload-screen-centering">
        <div className="upload-card">

          <div className="upload-logo">
            <img src={logo} alt="Localiza&amp;CO" height={32} />
          </div>

          <div className="upload-card-heading">
            <h1 className="upload-title">Explorador de Pesquisas</h1>
            <p className="upload-subtitle">
              Utilize Inteligência Artificial para analisar pesquisas
            </p>
          </div>

          <div className="upload-dropzone-area">
            <div
              className={`dropzone${isDragging ? ' dragging' : ''}${isLoading ? ' loading' : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isLoading && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && !isLoading && fileInputRef.current?.click()}
              aria-label="Área de upload de arquivo"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                style={{ display: 'none' }}
              />
              {isLoading ? (
                <div className="dropzone-loading">
                  <div className="spinner" />
                  <p>Processando arquivo…</p>
                </div>
              ) : (
                <>
                  <div className="dropzone-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="dropzone-text">
                    <strong>Clique para selecionar</strong> ou arraste o arquivo aqui
                  </p>
                  <p className="dropzone-hint">Apenas arquivos .xlsx</p>
                </>
              )}
            </div>
            {error && (
              <div className="upload-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}
          </div>

          <div className="upload-info-block">
            <p className="upload-info-label">O ARQUIVO .XLSX DEVE CONTER 2 ABAS</p>
            <div className="upload-info">

              <div className="upload-info-item">
                <div className="upload-info-item-header">
                  <div className="upload-info-icon-box" aria-hidden="true">
                    {/* Ícone tabela/planilha */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M3 9h18M3 15h18M9 3v18"/>
                    </svg>
                  </div>
                  <span className="upload-info-name">Data</span>
                </div>
                <p className="upload-info-desc">Respostas dos respondentes</p>
              </div>

              <div className="upload-info-item">
                <div className="upload-info-item-header">
                  <div className="upload-info-icon-box" aria-hidden="true">
                    {/* Ícone livro/dicionário */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                  <span className="upload-info-name">Codebook</span>
                </div>
                <p className="upload-info-desc">Dicionário de variáveis</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
};

export default UploadScreen;
