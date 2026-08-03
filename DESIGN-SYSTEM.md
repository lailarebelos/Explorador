# Design System — Agente Conversacional de Pesquisas (Localiza&CO)

> **Propósito:** Extração fiel e citada da linguagem visual real e final deste projeto.
> Serve de base para padronizar futuros aplicativos com o mesmo design.
> Toda informação abaixo foi retirada dos arquivos reais — nada foi aproximado.
> Onde algo não existe no código, a anotação **NÃO ENCONTRADO** é usada.

---

## 1. Tipografia

### Fonte principal

**Arquivo:** `frontend/src/styles/tokens.css` — linha 41

```css
--lds-font-family-base: 'Roobert', 'Inter', 'Segoe UI', system-ui, sans-serif;
```

**Arquivo:** `frontend/src/index.css` — linhas 1–21

```css
/* Google Fonts fallback (carregado via CDN) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Roobert — fonte principal da marca */
@font-face {
  font-family: 'Roobert';
  src: url('/fonts/roobert/Roobert-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Roobert';
  src: url('/fonts/roobert/Roobert-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Roobert';
  src: url('/fonts/roobert/Roobert-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Roobert';
  src: url('/fonts/roobert/Roobert-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

> **ATENÇÃO:** Os arquivos `.woff2` do Roobert estão **ausentes** de `frontend/public/fonts/roobert/` — o diretório não existe. O app renderiza Inter (Google Fonts) como fallback. Para ativar Roobert, adicionar os 4 arquivos `.woff2` no caminho acima.

**Tamanho de corpo padrão** — `frontend/src/index.css` linha aproximada 40:

```css
body {
  font-family: var(--lds-font-family-base);
  font-size: var(--lds-font-size-base); /* 15px */
}
```

---

### Escala de tamanhos

**Arquivo:** `frontend/src/styles/tokens.css` — linhas 46–53

| Token | Rem | Pixels | Uso anotado |
|---|---|---|---|
| `--lds-font-size-xs` | `0.75rem` | 12px | labels, captions |
| `--lds-font-size-sm` | `0.8125rem` | 13px | mínimo para texto |
| `--lds-font-size-md` | `0.875rem` | 14px | corpo secundário |
| `--lds-font-size-base` | `0.9375rem` | 15px | corpo principal |
| `--lds-font-size-lg` | `1rem` | 16px | — |
| `--lds-font-size-xl` | `1.125rem` | 18px | título da pesquisa |
| `--lds-font-size-2xl` | `1.375rem` | 22px | — |
| `--lds-font-size-3xl` | `1.75rem` | 28px | saudação empty state |

Duas fontes adicionais fora dos tokens (hardcoded):
- `0.6875rem` (11px) — `bubble-time`, `input-caption` — `App.css` linhas 1204, 1667
- `0.6875rem` (11px) — `insights-tab-count`, `sidebar-list-label` — `App.css` linhas 1864, 152

---

### Pesos

**Arquivo:** `frontend/src/styles/tokens.css` — linhas 42–45

| Token | Valor |
|---|---|
| `--lds-font-weight-regular` | `400` |
| `--lds-font-weight-medium` | `500` |
| `--lds-font-weight-semibold` | `600` |
| `--lds-font-weight-bold` | `700` |

---

### Line-heights

**Arquivo:** `frontend/src/styles/tokens.css` — linhas 54–57

| Token | Valor |
|---|---|
| `--lds-line-height-tight` | `1.2` |
| `--lds-line-height-snug` | `1.4` |
| `--lds-line-height-base` | `1.5` |
| `--lds-line-height-relaxed` | `1.6` |

---

### Fonte mono (código)

**Arquivo:** `frontend/src/App.css` — linha 1240

```css
.md-content code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
```

Não há token CSS para a fonte mono — está hardcoded.

---

## 2. Tokens — Modo Claro (`:root`)

**Arquivo:** `frontend/src/styles/tokens.css` — linhas 8–99

### Cores de acento

```css
--lds-color-accent-primary-default:  #018444;   /* Verde Bandeira */
--lds-color-accent-primary-hover:    #003418;   /* Verde Escuro LDS */
--lds-color-accent-primary-active:   #003418;
--lds-color-accent-primary-subtle:   rgba(1, 132, 68, 0.08);
--lds-color-accent-primary-tint:     #CEFDAF;   /* Verde Tint */
```

### Superfícies e fundos neutros

```css
--lds-color-neutral-background-default: #F2F2F2; /* área de chat — LDS background */
--lds-color-neutral-background-subtle:  #F2F2F2; /* app shell */
--lds-color-neutral-surface-default:    #FFFFFF; /* card / bolha */
--lds-color-neutral-surface-low:        #F2F2F2; /* muted */
--lds-color-neutral-surface-mid:        #E8E8E8;
```

### Bordas

```css
--lds-color-neutral-border-low:     #E6E6E6;
--lds-color-neutral-border-default: #CCCCCC;
--lds-color-neutral-border-strong:  #AAAAAA;
```

### Texto

```css
--lds-color-neutral-foreground-default: #4A4A4A;
--lds-color-neutral-foreground-muted:   #4A4A4A;
--lds-color-neutral-foreground-low:     #6E6E6E;
--lds-color-neutral-foreground-minimal: #9E9E9E;
```

> Nota: `default` e `muted` têm o mesmo valor (`#4A4A4A`) no modo claro. São semânticas distintas — `default` para texto principal, `muted` para texto de apoio — permitindo override independente no modo escuro.

### Feedback — superfícies e texto

```css
--lds-color-feedback-error-default:   #D92020;
--lds-color-feedback-success-default: #018444;
--lds-color-feedback-warning-default: #FBE437;
--lds-color-feedback-info-default:    #018444;
--lds-color-feedback-error-subtle:    rgba(217, 32, 32, 0.08);
--lds-color-feedback-error-bg:        #FFE4E4;
--lds-color-feedback-error-border:    #FFD1D1;
--lds-color-feedback-error-text:      #720D0D;
--lds-color-feedback-warning-bg:      #FBE437;
--lds-color-feedback-warning-fg:      #003418;
```

### Sombras

```css
--lds-shadow-sm:      0 1px 2px 0 rgb(0 0 0 / 0.05);
--lds-shadow-default: 0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10);
--lds-shadow-md:      0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10);
--lds-shadow-lg:      0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10);
```

### Cores de marca (brand.css)

**Arquivo:** `frontend/src/styles/brand.css` — linhas 1–12

```css
--brand-verde-bandeira: #018444;
--brand-verde-citrico:  #78DE1F;
--brand-verde-escuro:   #003418;
--brand-verde-tint:     #CEFDAF;
--brand-sidebar-bg:     #003418;
--brand-danger-fg:       #D92020;
--brand-danger-hover-fg: #B01A1A;
--brand-danger-hover-bg: #FFE4E4;
--brand-danger-btn-bg:   #D92020;
--brand-danger-btn-bg-hover: #B01A1A;
```

> `--brand-verde-bandeira` e `--lds-color-accent-primary-default` têm o mesmo valor (`#018444`). São tokens diferentes com origens diferentes: `--brand-*` vêm do Brand Guidelines; `--lds-*` vêm do Design System. Use `--lds-*` em componentes para facilitar a troca futura pelo pacote `@lds/themes`.

---

## 3. Tokens — Modo Escuro (`[data-theme="dark"]`)

**Arquivo:** `frontend/src/styles/tokens.css` — linhas 107–149

### Cores de acento

```css
--lds-color-accent-primary-default:  #4FC27D; /* 7.33:1 sobre #14271C ✓ AA+ */
--lds-color-accent-primary-hover:    #62D891;
--lds-color-accent-primary-active:   #62D891;
--lds-color-accent-primary-subtle:   rgba(79, 194, 125, 0.15);
--lds-color-accent-primary-tint:     rgba(120, 222, 31, 0.14); /* chip bg */
```

### Superfícies e fundos (verde-quase-preto — identidade da marca)

```css
--lds-color-neutral-background-default: #0E1F16; /* área de chat */
--lds-color-neutral-background-subtle:  #0A1A11; /* app shell */
--lds-color-neutral-surface-default:    #14271C; /* cards, bolhas */
--lds-color-neutral-surface-low:        #1B3325; /* popovers, menus elevados */
--lds-color-neutral-surface-mid:        #22402F;
```

### Bordas

```css
--lds-color-neutral-border-low:     rgba(255, 255, 255, 0.10);
--lds-color-neutral-border-default: rgba(255, 255, 255, 0.16);
--lds-color-neutral-border-strong:  rgba(255, 255, 255, 0.24);
```

### Texto

```css
--lds-color-neutral-foreground-default: #F2F7F3; /* alto contraste */
--lds-color-neutral-foreground-muted:   #D6E2DA;
--lds-color-neutral-foreground-low:     #9FB3A8;
--lds-color-neutral-foreground-minimal: #6B8577;
```

### Feedback

```css
--lds-color-feedback-error-default:  #FF6B7A;
--lds-color-feedback-error-text:     #FF6B7A;
--lds-color-feedback-success-default: #4FC27D;
--lds-color-feedback-info-default:   #4FC27D;
--lds-color-feedback-error-subtle:   rgba(255, 107, 122, 0.14);
--lds-color-feedback-error-bg:       rgba(255, 107, 122, 0.10);
--lds-color-feedback-error-border:   rgba(255, 107, 122, 0.30);
--lds-color-feedback-warning-bg:     rgba(251, 228, 55, 0.18);
--lds-color-feedback-warning-fg:     #F2F7F3;
```

### Sombras (mais densas que no modo claro)

```css
--lds-shadow-sm:      0 1px 2px 0 rgb(0 0 0 / 0.30);
--lds-shadow-default: 0 1px 3px 0 rgb(0 0 0 / 0.40), 0 1px 2px -1px rgb(0 0 0 / 0.30);
--lds-shadow-md:      0 4px 6px -1px rgb(0 0 0 / 0.40), 0 2px 4px -2px rgb(0 0 0 / 0.30);
--lds-shadow-lg:      0 10px 15px -3px rgb(0 0 0 / 0.50), 0 4px 6px -4px rgb(0 0 0 / 0.30);
```

### Cores de marca (overrides dark) — brand.css linhas 15–23

```css
--brand-verde-tint:          rgba(120,222,31,0.14);
--brand-sidebar-bg:          #0A1A11;
--brand-danger-fg:           #FF6B7A;
--brand-danger-hover-fg:     #FF6B7A;
--brand-danger-hover-bg:     rgba(255,107,122,0.14);
--brand-danger-btn-bg:       #C0392B;
--brand-danger-btn-bg-hover: #A93226;
```

> `--brand-verde-bandeira`, `--brand-verde-citrico` e `--brand-verde-escuro` **não têm override** no modo escuro — permanecem com os valores do modo claro (`#018444`, `#78DE1F`, `#003418`).
> A sidebar permanece `#003418` (via `--brand-verde-escuro`) no modo claro e muda para `#0A1A11` (via `--brand-sidebar-bg`) no escuro — são tokens diferentes para este motivo.

---

## 4. Organização dos Assets de Marca

**Arquivo:** `frontend/src/brand/assets.ts`

### Regra de variante por fundo (linhas 1–9)

```
fundo claro           → *-principal
fundo verde-escuro    → *-branco-e-citrico / *-branco-folha-citrica
fundo cítrico         → *-verde-*
```

**NUNCA** aplicar CSS `fill`/`stroke` para recolorir os SVGs — as cores estão embutidas nos vetores.

### Forma de importação

Todos os SVGs são importados como **URLs de string** via Vite:

```ts
import localizaCoHorizontalPrincipal from './svgs/logos/localiza-co-horizontal-principal.svg';
```

São usados em `<img src={...} />`, **não** como componentes React (sem SVGR).

### Mapa temático — `THEMED_ASSETS` (linhas 93–104)

```ts
export const THEMED_ASSETS = {
  light: {
    logoCoHorizontal: localizaCoHorizontalPrincipal,       // fundo claro
    logoCoCompact:    lcoCompactoPrincipal,                 // header direito, eco slide mestre
    simboloLocaliza:  simboloLocalizaPrincipal,             // avatar agente
  },
  dark: {
    logoCoHorizontal: localizaCoHorizontalBrancoECitrico,   // fundo verde-escuro
    logoCoCompact:    lcoCompactoBrancoECitrico,             // sidebar colapsada
    simboloLocaliza:  simboloLocalizaBrancoFolhaCitrica,    // fundo verde-escuro
  },
} as const;
```

**Uso nos componentes:**
```tsx
const { theme } = useTheme();
const assets = THEMED_ASSETS[theme];
<img src={assets.logoCoHorizontal} />
```

### Exports nomeados (linhas 82–121)

| Export | Arquivo SVG | Uso |
|---|---|---|
| `LogoLocalizaCo` | `localiza-co-horizontal-principal.svg` | fundo claro |
| `LogoLocalizaCoDark` | `localiza-co-horizontal-branco-e-citrico.svg` | sidebar expandida (fundo escuro) |
| `LcoCompactoDark` | `lco-compacto-branco-e-citrico.svg` | sidebar colapsada |
| `SimboloLocaliza` | `simbolo-localiza-principal.svg` | fundo claro |
| `SimboloLocalizaDark` | `simbolo-localiza-branco-folha-citrica.svg` | fundo verde-escuro |
| `LcoCompacto` | `lco-compacto-principal.svg` | topbar direito (seal) |
| `GrafismoAmpersand` | `grafismo-ampersand-contorno-citrico.svg` | marca d'água chat empty state |
| `GrafismoRecorteCoroa` | `grafismo-recorte-coroa-contorno.svg` | cabeçalho insight card |
| `GrafismoFolhaGrande` | `grafismo-folha-grande-contorno-escuro.svg` | decorativo |
| `IconBalaoCheck` | `balao-check.svg` | toast sucesso, insight validado |
| `IconBalaoAlerta` | `balao-alerta.svg` | toast erro, banner crítico |
| `IconBalaoInfo` | `balao-info.svg` | dicas, onboarding |
| `IconBalaoFechar` | `balao-fechar.svg` | dismiss |
| `IconBalaoVazio` | `balao-vazio.svg` | estado neutro |
| `IconBalaoInterrogacao` | `balao-interrogacao-citrico.svg` | botão de ajuda |
| `IconChatDuplo` | `chat-duplo.svg` | navegação, empty state lista |
| `IconMegafone` | `megafone.svg` | card Insights/Descobertas |
| `IconBookmarkEstrela` | `bookmark-estrela.svg` | fixar pesquisa/insight |
| `IconCompartilharCitrico` | `compartilhar-citrico.svg` | exportar (topbar) |
| `IconCompartilharVerdeEscuro` | `compartilhar-verde-escuro.svg` | variante fundo claro |
| `IconAlertaTriangulo` | `alerta-triangulo-citrico.svg` | avisos inline |

---

## 5. Valores dos Componentes da Shell

### Tokens de layout

**Arquivo:** `frontend/src/styles/tokens.css` — linhas 93–98

```css
--lds-sidebar-width-expanded:  280px;
--lds-sidebar-width-collapsed: 72px;
--lds-header-height:           64px;
--lds-insights-panel-width:    360px;
--lds-chat-max-width:          840px;
```

---

### App shell (CSS Grid)

**Arquivo:** `frontend/src/App.css` — linhas 4–21

```css
.app-shell {
  display: grid;
  grid-template-columns: var(--lds-sidebar-width-expanded) 1fr; /* 280px + conteúdo */
  height: 100vh;
  overflow: hidden;
  transition: grid-template-columns 200ms ease;
  background: linear-gradient(
    to bottom,
    #ffffff var(--lds-header-height),      /* 64px brancos para acomodar canto arredondado da sidebar */
    var(--lds-color-neutral-background-default) var(--lds-header-height)
  );
}
.app-shell.sidebar-collapsed {
  grid-template-columns: var(--lds-sidebar-width-collapsed) 1fr; /* 72px + conteúdo */
}
```

**Dark mode override** — `App.css` linhas 2545–2551:
```css
[data-theme="dark"] .app-shell {
  background: linear-gradient(
    to bottom,
    var(--lds-color-neutral-surface-default) var(--lds-header-height),
    var(--lds-color-neutral-background-default) var(--lds-header-height)
  );
}
```

---

### Sidebar

**Arquivo:** `frontend/src/App.css` — linhas 43–48

```css
.sidebar-nav {
  background: var(--brand-verde-escuro);       /* #003418 — sempre verde-escuro */
  border-radius: 0 var(--lds-border-radius-xl) 0 0; /* 24px no canto superior-direito */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

**Dark mode** — `App.css` linha 2554–2556:
```css
[data-theme="dark"] .sidebar-nav {
  background: var(--brand-sidebar-bg); /* #0A1A11 */
}
```

**Cabeçalho da sidebar** — linhas 51–57:
```css
.sidebar-header {
  padding: 20px 16px 16px;
}
```

**Botão CTA — "Nova pesquisa"** — linhas 112–129:
```css
.btn-nova-pesquisa {
  flex: 1;
  height: 44px;
  background: var(--brand-verde-citrico); /* #78DE1F */
  color: var(--brand-verde-escuro);       /* #003418 */
  font-size: var(--lds-font-size-md);     /* 14px */
  font-weight: 500;
  border-radius: 10px;
}
.btn-nova-pesquisa:hover { background: #FFFFFF; }
```

**Botão-lupa de busca** — linhas 3035–3052:
```css
.sidebar-search-icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.70);
}
.sidebar-search-icon-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.92);
}
```

**Scrollbar da lista** — linhas 168–178:
```css
.sidebar-lists {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.18) transparent;
}
.sidebar-lists::-webkit-scrollbar { width: 6px; }
.sidebar-lists::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.18);
  border-radius: 999px;
}
```

**Item ativo — marcador lateral** — linhas 214–224:
```css
.sidebar-research-item--active::before {
  position: absolute;
  left: 0;
  width: 3px;
  height: 22px;
  background: var(--brand-verde-citrico);
  border-radius: 0 var(--lds-border-radius-pill) var(--lds-border-radius-pill) 0;
}
```

**Labels de seção** — linhas 148–160:
```css
.sidebar-list-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.60);
}
```

---

### TopBar

**Arquivo:** `frontend/src/App.css` — linhas 684–781

```css
.app-topbar {
  height: var(--lds-header-height);   /* 64px */
  padding: 0 var(--lds-spacing-8);    /* 0 32px */
  background: var(--lds-color-neutral-surface-default);
  border-bottom: 1px solid var(--lds-color-neutral-border-low);
}
```

**Título** — linhas 704–712:
```css
.topbar-title {
  font-size: var(--lds-font-size-xl);         /* 18px */
  font-weight: var(--lds-font-weight-semibold); /* 600 */
  color: var(--lds-color-neutral-foreground-default);
  line-height: var(--lds-line-height-tight);  /* 1.2 */
}
```

Truncado a 48 chars + `…` — `TopBar.tsx` linha 68:
```tsx
{title.length > 48 ? title.slice(0, 46) + '…' : title}
```

**Badges de status** — linhas 714–738:

```css
/* Base */
.topbar-badge {
  padding: 3px 10px;
  border-radius: var(--lds-border-radius-pill);  /* 9999px */
  font-size: var(--lds-font-size-xs);            /* 12px */
  font-weight: var(--lds-font-weight-semibold);  /* 600 */
}

/* Em andamento */
.topbar-badge--andamento {
  background: var(--brand-verde-tint); /* #CEFDAF */
  color: var(--brand-verde-escuro);    /* #003418 */
}

/* Concluída */
.topbar-badge--concluida {
  background: #D1F5DC;
  color: #003827;  /* 16.9:1 ✓ */
}

/* Revisar */
.topbar-badge--revisar {
  background: #FBE437;
  color: var(--lds-color-feedback-warning-fg); /* #003418 */
}
```

Dark mode andamento — `App.css` linhas 2727–2730:
```css
[data-theme="dark"] .topbar-badge--andamento {
  background: rgba(120, 222, 31, 0.18);
  color: #BBF49A; /* 8.16:1 ✓ */
}
```

**Botões de ícone no topbar** — linhas 747–773:
```css
.topbar-icon-btn {
  width: 36px;
  height: 36px;
  background: transparent;
  border-radius: var(--lds-border-radius-sm); /* 8px */
  color: var(--lds-color-neutral-foreground-muted);
}
.topbar-icon-btn:hover { background: var(--lds-color-neutral-surface-low); }
.topbar-icon-btn--active {
  color: var(--brand-verde-bandeira);
  background: var(--lds-color-accent-primary-subtle);
}
```

**Ordem dos botões à direita** — `TopBar.tsx` linhas 73–159:
1. Tema (lua/sol) — linha 74
2. Fixar/Desafixar pesquisa — linha 97
3. Insights panel — linha 118
4. Exportar (SharePopover) — linha 128
5. Ajuda (`IconBalaoInterrogacao`) — linha 147
6. Seal L&CO compacto (`assets.logoCoCompact`) — linha 157

---

### Chat

**Arquivo:** `frontend/src/App.css` — linhas 1109–1131

```css
.messages-list {
  padding: var(--lds-spacing-8);              /* 32px */
  gap: var(--lds-spacing-6);                  /* 24px entre mensagens */
  max-width: var(--lds-chat-max-width);       /* 840px */
  margin: 0 auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,52,24,.25) transparent;
}
```

**Animação de entrada de mensagem** — linhas 1141–1144:
```css
@keyframes msgIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Bubbles** — linhas 1172–1194:
```css
/* Base */
.bubble {
  padding: var(--lds-spacing-4) var(--lds-spacing-5); /* 16px 20px */
  border-radius: var(--lds-border-radius-soft);        /* 16px */
}

/* Agente — canto superior-esquerdo 4px (eco do "L") */
.assistant-bubble {
  background: var(--lds-color-neutral-surface-default);
  border: 1px solid var(--lds-color-neutral-border-low);
  border-radius: 4px 16px 16px 16px;
  box-shadow: var(--lds-shadow-sm);
  max-width: 680px;
}

/* Usuário — canto inferior-direito 4px */
.user-bubble {
  background: var(--brand-verde-bandeira); /* #018444 */
  color: #FFFFFF;
  border-radius: 16px 16px 4px 16px;
  max-width: 70%;
}
```

**Avatar do agente** — linhas 1165–1169:
```css
.assistant-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--lds-color-neutral-surface-default);
  border: 1.5px solid rgba(1,132,68,0.15);
}
```

Imagem no avatar: `THEMED_ASSETS[theme].simboloLocaliza` — `MessageBubble.tsx` linha 18.

---

### Composer (input)

**Arquivo:** `frontend/src/App.css` — linhas 1588–1607

```css
.composer {
  gap: 12px;
  padding: 10px 14px;
  min-height: 52px;
  border: 1px solid var(--lds-color-neutral-border-default);
  border-radius: 16px;
  background: #fff;                                       /* hardcoded — light */
  max-width: calc(var(--lds-chat-max-width) - 2 * var(--lds-spacing-8)); /* 840 - 64 = 776px */
}
.composer:focus-within {
  border-color: var(--brand-verde-bandeira);
  border-width: 2px;
  padding: 9px 13px;    /* compensa 1px extra da borda */
}
```

Dark mode — linha 2636–2642:
```css
[data-theme="dark"] .composer {
  background: var(--lds-color-neutral-surface-default); /* #14271C */
}
[data-theme="dark"] .composer:focus-within {
  border-color: var(--lds-color-accent-primary-default); /* #4FC27D */
}
```

**Botão enviar** — linhas 1642–1664:
```css
.send-btn {
  width: 40px;
  height: 40px;
  background: var(--brand-verde-bandeira);
  border-radius: 50%;
  color: #FFFFFF;
}
.send-btn:hover:not(.disabled) { background: var(--brand-verde-escuro); }
.send-btn.disabled {
  background: var(--lds-color-neutral-surface-mid);
  color: var(--lds-color-neutral-foreground-minimal);
}
```

**Textarea** — linhas 1622–1638:
- `font-size: 15px` (hardcoded, coincide com `--lds-font-size-base`)
- `line-height: 24px` (hardcoded)
- `height` inicial: `24px`, máximo: `192px` (auto-grow via JS — `ChatInterface.tsx` linhas 63–70)

---

### Insights Panel

**Arquivo:** `frontend/src/App.css` — linhas 1792–1901

```css
.insights-panel {
  width: var(--lds-insights-panel-width);  /* 360px */
  background: var(--lds-color-neutral-surface-default);
  border-left: 1px solid var(--lds-color-neutral-border-low);
  transition: width 0.22s ease;
}
.insights-panel--closed { width: 0; border-left: none; }
```

Header: `height: var(--lds-header-height)` — alinhado com TopBar.

Em telas `≤1280px`: overlay fixo com `transform: translateX(100%)` → `translateX(0)` — linhas 2075–2092.  
Em mobile `≤768px`: oculto (`display: none`) — linha 2137.

---

### Tela de upload

**Arquivo:** `frontend/src/App.css` — linhas 820–1079

**Card:**
```css
.upload-card {
  background: var(--lds-color-neutral-surface-default);
  border-radius: var(--lds-border-radius-soft);  /* 16px */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--lds-color-neutral-border-low);
  padding: var(--lds-spacing-6) var(--lds-spacing-8);  /* 24px 32px */
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: var(--lds-spacing-5);  /* 20px — espaçamento uniforme entre blocos */
}
```

**Fundo tile** — gerado em `UploadScreen.tsx` linhas 20–66:
- SVG 320×320px inline (data URI), `background-size: 320px 320px`, `background-repeat: repeat`
- Modo claro: `stroke: rgba(0,52,24,0.11)` (verde-escuro 11%)
- Modo escuro: `stroke: rgba(120,222,31,0.11)` (verde-cítrico 11%)
- 12 instâncias dos grafismos da marca: "L" (×2), Helix, Folha, Dupla-folha, "&" — cada um com `transform` (translate + rotate + scale) diferente

---

### SearchModal

**Arquivo:** `frontend/src/App.css` — linhas 2839–3081

```css
/* Overlay */
.search-overlay {
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  padding-top: clamp(48px, 10vh, 120px);
}

/* Modal */
.search-modal {
  background: var(--lds-color-neutral-surface-default); /* #fff */
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 16px;
  border-top-right-radius: 4px;          /* assinatura de marca */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.16), 0 4px 16px rgba(0, 0, 0, 0.07);
  width: min(640px, calc(100vw - 32px));
  max-height: min(540px, calc(100vh - 96px));
}
```

Dark mode — linhas 3055–3063:
```css
[data-theme="dark"] .search-modal {
  background: var(--lds-color-neutral-surface-low); /* #1B3325 */
  border-color: rgba(255, 255, 255, 0.10);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55), 0 4px 16px rgba(0, 0, 0, 0.30);
}
```

Animação de entrada — linhas 2872–2875:
```css
@keyframes search-modal-in {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
```

Item de resultado — linhas 2944–2953:
```css
.search-result-item {
  padding: 10px 12px;
  min-height: 52px;
  border-radius: 10px;
}
```

Título de resultado — linhas 2974–2977:
```css
.search-result-title {
  font-size: 14px;
  font-weight: 500;
}
```

Highlight de busca — linha 3016:
```css
.search-highlight { background: rgba(120, 222, 31, 0.25); border-radius: 2px; }
```

---

## 6. Troca de Tema

### Mecanismo técnico

**Arquivo:** `frontend/src/contexts/ThemeContext.tsx` — linhas 1–37

```tsx
const THEME_KEY = 'acp:theme';  // linha 5

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
```

Ao trocar o tema, o efeito aplica o atributo no `<html>` e persiste no localStorage:

```tsx
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}, [theme]);
```

- **Atributo CSS:** `[data-theme="dark"]` no elemento `<html>` — linha 24
- **Chave de storage:** `'acp:theme'` — linha 5
- **Detecção inicial:** `prefers-color-scheme` como fallback quando não há valor salvo — linha 10
- **Função de toggle:** `toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')` — linha 28

### Uso nos componentes

```tsx
import { useTheme } from '../contexts/ThemeContext';
const { theme, toggleTheme } = useTheme();
const assets = THEMED_ASSETS[theme]; // seleciona variante correta de SVG
```

### Transições suaves

**Arquivo:** `frontend/src/App.css` — linhas 2519–2538

```css
.app-topbar, .app-main-area, .chat-main, .input-bar, .composer,
.assistant-bubble, .insights-panel, .insights-panel-header,
.insights-panel-body, .saved-insight-card, .upload-screen, .upload-card,
.upload-modal-card, .topbar-badge, .dropzone, .upload-error,
.sidebar-context-menu, .sidebar-user-menu {
  transition: background-color 200ms ease, border-color 200ms ease, color 200ms ease;
}
```

A sidebar (`--brand-verde-escuro` / `--brand-sidebar-bg`) não está nesta lista — não transita, muda instantaneamente.

### Chaves de localStorage do app

**Arquivo:** `frontend/src/App.tsx` — linhas 13–14

```ts
const SIDEBAR_KEY  = 'sidebar_collapsed';   // 'true' / 'false'
const INSIGHTS_KEY = 'insights_panel_open'; // 'true' / 'false'
```

---

## 7. Decisões Visuais Não Documentadas em Comentários

### Eco do "L" — o canto único de 4px

Decisão recorrente em todo o sistema: o canto `4px` (vs. o padrão `16px`) aparece sempre no mesmo ângulo — **superior-esquerdo** nas bolhas do agente, **superior-direito** nos cards de insight e search modal — como referência visual ao "L" do logotipo Localiza.

| Elemento | Propriedade | Fonte |
|---|---|---|
| Bolha do agente | `border-radius: 4px 16px 16px 16px` | `App.css` linha 1183 |
| Bolha do usuário | `border-radius: 16px 16px 4px 16px` | `App.css` linha 1192 |
| Insight card | `border-radius: 16px 4px 16px 16px` | `App.css` linha 1955 |
| Saved insight card | `border-radius: 16px 4px 16px 16px` | `App.css` linha 2372 |
| Search modal | `border-radius: 16px; border-top-right-radius: 4px` | `App.css` linhas 2862–2863 |
| Sidebar | `border-radius: 0 24px 0 0` | `App.css` linha 44 |

### Verde Cítrico — regra de uso

**Arquivo:** `frontend/src/App.css` — linhas 1684–1688 (comentário explícito)

```css
/*
 * REGRA DE COR: Verde Cítrico (#78DE1F / --brand-verde-citrico)
 * NUNCA usar como valor de `color:` em texto sobre fundos claros.
 * Uso permitido: background, box-shadow, border, SVG fill.
 * Razão: contraste 1.6:1 sobre branco — reprovado em WCAG AA.
 */
```

O cítrico aparece como: fundo do botão CTA, marcador de item ativo na sidebar, barra da saved insight card, star no bookmark fixado, highlight de busca, spinner top-color, caret do input de busca, chip de sugestão collapsed.

No modo escuro, o cítrico é substituído por `#4FC27D` (accent-primary-default) **sempre que usado como cor de texto** — ex: `insight-card-category`, `saved-insight-view`, `keyword-chip`, `empty-greeting-accent`.

### Anel de foco por contexto

**Arquivo:** `frontend/src/App.css`

- **Fundo claro (padrão):** `outline: 2px solid var(--brand-verde-bandeira)` — linha 1675
- **Sidebar escura:** `outline: 2px solid rgba(255,255,255,0.85)` — linha 1703 (`btn-nova-pesquisa`, `sidebar-search-icon-btn`, `suggestion-pill`)
- **Sidebar escura — toggle e itens:** `outline: 2px solid #78DE1F` — linha 92 (hardcoded no `.sidebar-toggle-btn:focus-visible`)
- **Dark mode global override:** `outline-color: var(--brand-verde-citrico) !important` — linha 2601

### Typing indicator — folhas cítricas

**Arquivo:** `frontend/src/App.css` — linhas 1381–1393

Usa `LeafDot` — SVG recortado do símbolo Localiza (`ChatInterface.tsx` linhas 27–33) animado com `bounce` 1.2s, delays de 0.2s entre cada folha. Cor: `var(--brand-verde-citrico)`.

### Marca d'água GrafismoAmpersand

**Arquivo:** `frontend/src/App.css` — linhas 1094–1107

```css
.chat-grafismo {
  position: absolute;
  top: 50%;
  right: -24px;
  height: 78%;
  opacity: 0.58;
  transition: opacity 200ms ease;
}
.chat-grafismo--active { opacity: 0.25; }   /* quando há mensagens */
```

Dark mode — linhas 2693–2694:
```css
[data-theme="dark"] .chat-grafismo        { opacity: 0.12; }
[data-theme="dark"] .chat-grafismo--active { opacity: 0.07; }
```

### Quote Bubble — sombra cítrica offset

**Arquivo:** `frontend/src/App.css` — linhas 1305–1343

```css
.quote-bubble {
  border: 1.5px solid var(--brand-verde-bandeira);
  border-radius: var(--lds-border-radius-soft);
  box-shadow: 4px 4px 0 var(--brand-verde-citrico); /* sombra sólida offset — design de carimbo */
}
.quote-bubble::before {  /* cauda cítrica no canto inferior-esquerdo */
  bottom: -10px; left: 20px;
  border-top: 10px solid var(--brand-verde-citrico);
}
```

### Scrollbar padronizada

Chat messages (modo claro): `rgba(0,52,24,.25)` — linha 1125.  
Chat messages (modo escuro): `rgba(79,194,125,.30)` — linha 2646.  
Sidebar: `rgba(255,255,255,.18)` — linha 170.  
Todas: `width: 6px`, `border-radius: 999px`.

### Código pre — sempre escuro independente do tema

Modo claro — `App.css` linha 1249: `background: #1C2333; color: #E2E8F0`  
Modo escuro — `App.css` linha 2613: `background: #0D1117; color: #E6EDF3`  
Não usa tokens para este componente — hardcoded por design (VS Code / GitHub aesthetics).

### popover-in — animação compartilhada

**Arquivo:** `frontend/src/App.css` — linhas 2180–2183

```css
@keyframes popover-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Usada em: `.sidebar-context-menu`, `.sidebar-user-menu`, `.share-popover`.

### Gradiente no app-shell — motivo

**Arquivo:** `frontend/src/App.css` — linhas 10–16 (comentário inline)

```css
/* Fundo branco na faixa do header (64px) para o canto arredondado da
   sidebar descansar sobre branco, não cinza; abaixo o conteúdo cobre tudo. */
```

A `#FFFFFF` cobre exatamente os 64px do header para que o `border-radius: 0 24px 0 0` da sidebar não flutue sobre o cinza do chat.

### Tokens sem definição no LDS (usados no código)

Algumas referências a tokens aparecem no CSS mas **não têm valor definido** em `tokens.css`:

| Referência | Usada em | Status |
|---|---|---|
| `--lds-color-neutral-foreground-disabled` | `.search-input::placeholder` | **NÃO ENCONTRADO** — nenhum token com esse nome existe. O placeholder do search herda o comportamento padrão do browser. |
| `--lds-spacing-7` | `.empty-content` (`gap: var(--lds-spacing-7, 1.75rem)`) | **NÃO ENCONTRADO** — existe um fallback `1.75rem` embutido. |
| `--lds-spacing-12` | `.insights-empty-state` | Existe (`3rem`) — linha 68 de tokens.css. |
