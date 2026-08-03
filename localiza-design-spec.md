# Identidade Visual Localiza&CO — Especificação para o "Agente Conversacional de Pesquisas"

> Documento gerado a partir de engenharia reversa **vetorial** dos arquivos oficiais:
> `Guia_Localiza_Co_2024.pdf` (guia de marca) e `_Template__Slide_Mestre__1__4.pptx` (slide mestre).
> O PPTX foi descompactado (formato OOXML) e **110 SVGs vetoriais originais** foram extraídos,
> catalogados por viewBox e cor, e renomeados semanticamente no kit `localiza-brand-assets.zip`.
> Nada aqui é descrição "a olho": logos, grafismos e ícones são os **arquivos vetoriais reais** da marca.

---

## 0. Confiabilidade desta especificação

| Item | Confiança | Por quê |
|---|---|---|
| Logos, símbolos, grafismos e ícones (SVG) | **100%** | Extraídos byte a byte do PPTX oficial; não foram redesenhados |
| Cores canônicas (#018444, #78DE1F, #01602A…) | **100%** | Lidas dos `fill`/`stroke` dos vetores e do `theme1.xml` do PPTX |
| Tipografia (Roobert Regular/Medium/SemiBold/Bold) | **100%** | Declarada no guia 2024 e confirmada no `theme1.xml` e fontes embutidas do PPTX |
| Proporção de cor 30/30/30/10 | **100%** | Regra explícita no guia 2024 (seção 2.2) |
| Padrões de composição (raios, molduras, balões) | **Alta (~90%)** | Inferidos por medição dos slides; valores exatos em px são interpretação minha para web |
| Tokens LDS (`--lds-*`) | **Alta** | O LDS (`@lds/react`, `@lds/themes`) é o design system de produto oficial da Localiza; os valores hex finais são resolvidos pelo tema em runtime |

**Divergência encontrada (importante):** o PDF "Guia 2024" lista Verde Bandeira `#008C3C`, Cítrico `#7DDE21`, Escuro `#05662B`. Já os **vetores do Slide Mestre** (artefato mais recente) usam `#018444`, `#78DE1F`, `#01602A`. Esta spec adota os valores do Slide Mestre como canônicos para a UI, e recomenda que cor **nunca** seja hardcoded no app: use os tokens CSS do LDS, que encapsulam a decisão oficial.

**Tipografia — atenção legal:** a Roobert é fonte licenciada (Display/CoType Foundry). Ela está embutida no PPTX em formato ofuscado e **não deve ser extraída dali**. O app deve carregar a Roobert dos assets de fonte que a companhia já licencia (pergunte ao time de marca/LDS pelos `.woff2`), com fallback seguro.

---

## 1. Fundamentos extraídos

### 1.1 Paleta canônica (vetores do Slide Mestre)

| Token semântico | Hex | Pantone (guia) | Papel |
|---|---|---|---|
| Verde Bandeira (primária) | `#018444` | 348 C | Cor da marca, wordmark, botões primários, links |
| Verde Cítrico (acento) | `#78DE1F` | 2287 C | Folha do símbolo, destaques, CTAs secundários, grafismos |
| Verde Escuro | `#01602A` | 357 C | Fundos profundos (sidebar/hero), ícones sólidos, hover do primário |
| Branco | `#FFFFFF` | — | Superfícies, respiro |
| Verde claro "folha B2B" | `#B5CE95` | — | Exclusivo Empresas / Gestão de Frotas |
| Laranja Seminovos | `#FC8422` | — | Exclusivo Seminovos |
| Amarelo eqip | `#FBE437` | — | Exclusivo eqip |
| Verde-água Zarp | `#5AD893` | — | Exclusivo Zarp |
| Vermelho (tema PPTX) | `#FC2C48` | — | Estados críticos/erro |
| Verde-claro fundo (tema PPTX) | `#CEFDAF` | — | Tints de fundo cítrico (chips, callouts suaves) |

**Regra de proporção (guia 2024, obrigatória):** ~30% Verde Bandeira, ~30% Verde Cítrico, ~30% Verde Escuro, ~10% Branco em peças de marca. **Tradução para produto digital (UI densa em texto):** inverta o respiro — ~60–70% superfícies brancas/neutras, e os três verdes dividem os ~30% restantes (escuro na sidebar, bandeira em ações, cítrico só em acentos). Uma UI 90% verde seria ilegível; o que preserva a marca é a **presença simultânea dos 3 verdes** com o cítrico sempre em minoria pontual.

### 1.2 Tipografia

- **Família única: Roobert** — pesos usados: Regular (400), Medium (500), SemiBold (600), Bold (700).
- Traço geométrico-humanista; o "L" minúsculo com terminal angular e o "&" de junção diagonal são a base dos grafismos da marca.
- Fallback stack: `'Roobert', 'Inter', 'Segoe UI', system-ui, sans-serif` (Inter é o substituto métrico mais próximo).
- Hierarquia observada nos slides: títulos em SemiBold/Bold com cor Verde Bandeira sobre claro (ou branco sobre escuro); destaques dentro de frases alternando peso (Regular → Bold) e cor (branco → cítrico) — padrão "Simplificar e encantar **pra você chegar lá**".

### 1.3 Geometria da marca (o que faz "parecer Localiza")

1. **Cantos asimetricamente arredondados** — quase todo contêiner da marca tem raio grande (16–32px) em três cantos e **um canto reto ou muito menor** (eco do recorte do "L"). Ex.: balões de fala dos ícones, cards dos slides, a "lágrima" branca da capa do guia.
2. **Balão de fala com cauda chanfrada** — o ícone-sistema (X, ✓, i, !, fala) é um quadrado arredondado com uma cauda triangular no canto inferior; é o componente perfeito para um produto de chat.
3. **Grafismos outline 2–4px** — recortes do "L" e do "&" usados como decoração de fundo, sempre em linha fina (cítrico sobre claro/escuro; verde-escuro sobre claro), nunca preenchidos em massa, posicionados sangrando a borda do layout.
4. **Moldura de palco** — slides de capa usam uma moldura retangular de cantos 24–40px, stroke branco ou cítrico 4–8px, afastada ~24–48px da borda, com conteúdo "vazando" sobre ela.
5. **Faixas de chip empilhadas** — frases quebradas em pílulas (radius ~12px) empilhadas com pequeno offset, fundo cítrico + texto verde-escuro, ou fundo verde + texto branco (slide "Seja pra onde for…").
6. **Folha cítrica como pixel de marca** — a folha do símbolo "L" funciona sozinha como favicon/bullet/indicador de loading.

---

## 2. Inventário completo de elementos (kit `localiza-brand-assets.zip`)

### 2.1 Logos (todas as variantes são SVG originais)

| Logo | Dimensão | Variantes no kit | Uso por fundo |
|---|---|---|---|
| **Localiza** wordmark | 242×48 | principal (verde+cítrico), branco+folha cítrica, verde+folha branca, branco, preto, 3 alternativas "ecossistema" | claro / escuro / cítrico / foto / mono |
| **Símbolo "L"** | 48×48 | principal bicolor, verde sólido, preto, branco+folha cítrica, branco | avatar, favicon, loading |
| **Localiza&CO** | 294×48 | principal, branco+cítrico, verde+branco, branco, preto + versão grande | marca institucional (header corporativo) |
| **L&CO monograma** | 48×48 | principal, verde+branco, preto, branco+cítrico | canto superior direito (como nos slides) |
| **Localiza Labs** | 104×48 | principal, verde+branco, branco, preto, cítrico p/ fundo escuro | produtos de tecnologia/inovação — **o mais adequado para o seu app** |
| Sub-marcas | várias | Meoo, Seminovos (+símbolos), Empresas, Gestão de Frotas (+símbolos), eqip, Zarp | só se o app atender essas BUs |

### 2.2 Grafismos (decorativos, outline)

`grafismo-ampersand-contorno-citrico/escuro` (o "&" gigante 548×557), `grafismo-folhas-duplas-*` (recortes do símbolo), `grafismo-L-*` (o "L" em sólido/contorno), `grafismo-recorte-*` (5 recortes geométricos do "&": leque-duplo, coroa, quartos, hélice, ampulheta), `grafismo-V-contracapa-*` (o grande "V" da contracapa), `grafismo-leque-solido-citrico`, `grafismo-moldura-capa-citrica`, `letterform-labs-1..4` (letras geométricas L-A-B-S).

### 2.3 Ícones proprietários

Família "balão de fala" verde-escuro `#01602A` (97×100): `balao-fechar`, `balao-check`, `balao-info`, `balao-alerta`, `balao-vazio`; balão cítrico `balao-interrogacao-citrico`; pictogramas bicolor escuro+cítrico: `casa`, `chat-duplo`, `megafone`, `bookmark-estrela`; utilitários: `compartilhar-(citrico|verde-escuro)`, `alerta-triangulo-citrico`.

> Para o restante da iconografia funcional (busca, anexo, enviar, configurações…), use **`@lds/react-icons`** (~950 ícones oficiais, 3 variantes cada) — não misture com lucide/heroicons.

### 2.4 Componentes corporativos observados no Slide Mestre (slides "Artefatos")

- **Citação/entrevista**: balão branco borda verde, radius grande com cauda chanfrada cítrica e sombra dura deslocada (offset ~6px, sem blur) na cor cítrico.
- **Quote block**: painel `#CEFDAF`/verde-10% com aspas grandes verde-escuras no canto.
- **Aviso**: card branco borda cinza-escura + sombra dura cítrica + triângulo de alerta cítrico.
- **Link externo**: pílula fundo verde-5%, borda verde-20%, texto Verde Bandeira + ícone compartilhar.
- **Palavras-chave**: chips pill outline Verde Bandeira, fundo branco.
- **Avaliação de hipótese**: barra vertical cítrica 6px + label SemiBold verde + descrição neutra.
- **Ponto de atenção / Oportunidade**: número em quadrado (escuro=atenção, cítrico=oportunidade) + título + régua na cor correspondente.
- **Selo de status diagonal**: fitas "Revisar/Feito/Atualizar" (amarelo/cítrico/vermelho) — vira Badge de status no app.

---

## 3. O que usar no "Agente Conversacional de Pesquisas" — e onde

| Elemento | Onde aparece | Como |
|---|---|---|
| `labs-principal.svg` (Localiza Labs) | Topo da sidebar (expandida) | Altura 28–32px; em sidebar verde-escura use `labs-citrico-para-fundo-escuro.svg` |
| `simbolo-localiza-principal.svg` | Sidebar colapsada, favicon, avatar do agente nas mensagens | 32–40px; avatar do agente = símbolo dentro de círculo branco com borda verde-10% |
| `lco-compacto-principal.svg` | Canto superior direito do header (eco do slide mestre) | 32px, opcional |
| `grafismo-ampersand-contorno-citrico.svg` | Fundo do estado vazio do chat e da tela de login | Sangrando o canto inferior-direito, opacidade 0.5–0.7, nunca atrás de texto denso |
| `grafismo-recorte-*.svg` | Cabeçalhos de cards de insight, ilustração de empty state | Outline cítrico 2px, tamanho 80–160px |
| `balao-check/alerta/info/fechar.svg` | Toasts, banners de feedback, marcador de "insight validado" | 20–24px |
| `balao-interrogacao-citrico.svg` | Botão de ajuda, tooltip de onboarding | 24px |
| `chat-duplo.svg` | Item "Conversas" da navegação, empty state da lista de pesquisas | 24px nav / 96px empty |
| `megafone.svg` | Card "Insights/Descobertas" | 24px |
| `bookmark-estrela.svg` | Salvar/fixar pesquisa ou insight | 20px |
| `compartilhar-citrico.svg` | Exportar/compartilhar relatório | 20px |
| Chips empilhados (padrão "Seja pra onde for") | Sugestões de perguntas no empty state do chat | pílulas cítricas/verde-10% clicáveis |
| Cauda de balão chanfrada | Bolhas de mensagem do chat | ver §4.4 |
| Sombra dura cítrica (offset 6px sem blur) | Cards de insight em destaque, callouts | uso pontual (1–2 por tela) |

**Não usar:** logos de sub-marcas (Meoo, Seminovos, eqip, Zarp, Empresas, GF) a menos que a pesquisa seja da BU; cores exclusivas delas (laranja/amarelo) fora desse contexto; grafismos preenchidos em massa atrás de texto.

---

## 4. Estrutura completa da tela (desktop-first, breakpoint mobile 768px)

```
┌────────────────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌───────────────────────────────────────────────────────┐ │
│ │ SIDEBAR  │ │ HEADER (64px)                                         │ │
│ │ 280px    │ ├───────────────────────────────┬───────────────────────┤ │
│ │ (#01602A)│ │ ÁREA DE CHAT (flex-1)         │ PAINEL DE INSIGHTS    │ │
│ │          │ │  • lista de mensagens         │ 360px (colapsável)    │ │
│ │          │ │  • composer fixo no rodapé    │  • cards de insight   │ │
│ │          │ │                               │  • fontes/uploads     │ │
│ └──────────┘ └───────────────────────────────┴───────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Sidebar (navegação) — 280px expandida / 72px colapsada
- Fundo **Verde Escuro `#01602A`** (`--lds-color-neutral-surface-low` no tema escuro ou cor de marca direta), sem borda; canto **superior-direito com raio 24px** vazando sobre o conteúdo (assinatura do "L").
- Topo: `labs-citrico-para-fundo-escuro.svg` (32px) + botão colapsar.
- Botão primário "**Nova pesquisa**": largura total, fundo `#78DE1F`, texto `#01602A` SemiBold, radius 12px, altura 44px; hover: fundo branco.
- Seções: "Pesquisas recentes" (lista de conversas com título 14px branco/85%, timestamp 12px branco/55%; item ativo = fundo branco/10% + barra esquerda cítrica 3px radius pill); "Fixadas" com `bookmark-estrela`.
- Rodapé: avatar do usuário + nome + menu; divisor branco/12%.

### 4.2 Header — 64px
- Fundo branco, borda inferior `--lds-color-neutral-border-low` (1px).
- Esquerda: título da pesquisa atual (Roobert SemiBold 18px `#1A1A1A`) + Badge de status (pill 24px: "Em andamento" fundo `#CEFDAF` texto `#01602A`; "Concluída" fundo verde-10% texto `#018444`; "Revisar" amarelo `#FBE437` texto `#1A1A1A` — eco das fitas do slide mestre).
- Direita: busca (LdsTextField sm com LdsIconSearch), `compartilhar-citrico` para exportar, `balao-interrogacao-citrico` para ajuda, `lco-compacto-principal.svg` 32px como selo institucional.

### 4.3 Área de chat
- Fundo `#FAFAF8`/`--lds-color-neutral-background-default`; coluna de mensagens max-width 840px centralizada; padding 32px.
- **Mensagem do agente**: avatar = `simbolo-localiza-principal.svg` em círculo branco 36px, borda verde-10%; bolha branca, borda `border-low`, **radius 16px com canto superior-esquerdo 4px** (cauda chanfrada Localiza), padding 16×20px, texto 15px/1.6; blocos ricos dentro da bolha (tabelas, citações §2.4, chips de palavras-chave).
- **Mensagem do usuário**: sem avatar, alinhada à direita; fundo **Verde Bandeira `#018444`**, texto branco, radius 16px com **canto inferior-direito 4px**, max-width 70%.
- **Citação de entrevistado dentro de resposta**: componente QuoteBubble (§2.4) — borda verde, cauda cítrica, sombra dura cítrica 4px.
- **Indicador "digitando"**: três folhas cítricas pulsando (a folha do símbolo como dot).
- **Composer** (fixo, fundo branco, borda superior): container radius 16px borda `border-default`, foco = borda `#018444` 2px; textarea auto-grow 1–8 linhas; esquerda: botão anexar (LdsIconAttach); direita: botão enviar circular 40px fundo `#018444` (hover `#01602A`), ícone seta branca; abaixo, hint 12px "O agente pode cometer erros…" cinza.

### 4.4 Upload de arquivos
- **Dropzone** (estado sem arquivos / modal): área radius 16px, borda **tracejada 2px `#018444`**, fundo verde-3%; centro: `compartilhar-citrico` invertido ou LdsIconUpload 40px + "Arraste transcrições, áudios ou planilhas" (15px SemiBold) + "PDF, DOCX, XLSX, MP3 até 50MB" (13px cinza); drag-over: fundo `#CEFDAF`/40%, borda sólida.
- **Chip de arquivo no composer**: pílula fundo verde-5%, borda verde-20%, ícone do tipo + nome truncado 13px + X; progresso = barra 3px cítrica.
- **Card de fonte no painel**: linha com ícone-documento em quadrado verde-10% radius 8px, nome SemiBold 14px, meta 12px, ações (visualizar, remover).

### 4.5 Painel de Insights — 360px, colapsável
- Fundo branco, borda esquerda `border-low`; tabs LdsTabs: "Insights" / "Fontes".
- **Card de insight**: radius 16px **com canto superior-direito 4px**, borda `border-low`, padding 16px; cabeçalho = barra vertical 6px (cítrica = oportunidade, verde-escura = ponto de atenção — padrão do slide mestre) + categoria 12px SemiBold maiúscula `#018444` + `bookmark-estrela` para fixar; corpo 14px; rodapé: chips de palavras-chave (pill outline verde, 12px) + contagem de evidências ("3 entrevistas") com `chat-duplo` 16px.
- **Insight em destaque**: sombra dura cítrica (4px 4px 0 `#78DE1F`) — máximo 1 por lista.

### 4.6 Estados vazios
- **Chat novo**: centro vertical; `grafismo-ampersand-contorno-citrico.svg` sangrando o canto inferior-direito (op. 0.6); saudação "Olá, {nome}. **O que vamos descobrir hoje?**" (Roobert, 28px, "descobrir hoje" em `#018444` Bold); 3–4 chips-sugestão empilhados estilo "Seja pra onde for" (pílula `#CEFDAF`→hover `#78DE1F`, texto `#01602A` Medium, radius 12px): "Resumir as entrevistas da semana", "Quais dores aparecem em +3 fontes?", "Gerar guia de entrevista sobre…".
- **Sem insights**: `megafone.svg` 96px + "Nenhum insight ainda" SemiBold 16px + "Converse com o agente ou envie transcrições para começar" 14px cinza + botão outline verde "Enviar arquivos".
- **Sem fontes**: dropzone §4.4 inline.
- **Erro**: `balao-alerta.svg` + banner LdsAlert variant critical.

### 4.7 Acessibilidade e contraste (obrigatório)
- `#78DE1F` **reprova** contraste com branco para texto — cítrico nunca como cor de texto sobre claro nem fundo de texto branco; sobre cítrico, texto sempre `#01602A`.
- `#018444` sobre branco ≈ 4.8:1 — ok para texto ≥14px e UI.
- Foco visível: outline 2px `#018444` offset 2px em tudo que é interativo.

---

## 5. Plano de implementação visual

> **Cole o bloco abaixo no Claude Code como prompt.** Coloque antes a pasta `localiza-brand-assets/`
> (do zip que acompanha este documento) na raiz do repositório — assim o Claude Code terá os vetores
> reais que ele não conseguia ler do PDF/PPTX.

```text
Você vai implementar a interface do "Agente Conversacional de Pesquisas", uma aplicação web
corporativa da Localiza (Localiza Labs). Siga esta especificação à risca. Não invente assets:
todos os SVGs oficiais da marca estão em ./localiza-brand-assets/ (leia o README.md da pasta).

## Stack e fundações
1. React + TypeScript (Vite ou Next.js — detecte o que o repo já usa; se vazio, use Vite + React 18).
2. Use o Localiza Design System (LDS) como base de componentes e tokens:
   - npm install @lds/themes @lds/react @lds/react-icons
   - Configure o .npmrc para o registry privado da Localiza
     (@lds:registry=https://pkgs.dev.azure.com/localizadigital/_packaging/npm-localiza/npm/registry/, always-auth=true).
   - Aplique o defaultTheme de @lds/themes na raiz (LdsThemeStyle / LdsServerThemeStyle no Next).
   - PROIBIDO hardcode de cor em componentes: use os tokens CSS
     var(--lds-color-accent-primary-default), var(--lds-color-neutral-surface-default),
     var(--lds-spacing-N), var(--lds-border-radius-main|soft|pill), var(--lds-shadow-default).
   - Exceções permitidas (defina como CSS custom properties da marca em src/styles/brand.css):
     --brand-verde-bandeira:#018444; --brand-verde-citrico:#78DE1F; --brand-verde-escuro:#01602A;
     --brand-verde-tint:#CEFDAF; usadas apenas em elementos de marca (grafismos, chips de sugestão,
     sombra dura cítrica), nunca em texto corrido.
   - Se os pacotes @lds não estiverem acessíveis no ambiente, crie src/styles/tokens.css definindo
     as variáveis --lds-* listadas acima com os hex desta spec, mantendo os MESMOS nomes de token,
     para troca transparente depois.
3. Tipografia: família 'Roobert' com @font-face apontando para /public/fonts/roobert/*.woff2
   (pesos 400/500/600/700; o time de marca fornece os arquivos — NÃO extraia do PPTX).
   Fallback: font-family:'Roobert','Inter','Segoe UI',system-ui,sans-serif. Escala: 28/22/18/16/15/14/13/12px,
   line-height 1.5–1.6 para corpo, 1.2 para títulos; títulos em 600 (SemiBold), nunca all-caps exceto
   labels de categoria 12px com letter-spacing 0.04em.

## Assets de marca (./localiza-brand-assets/)
- Importe SVGs como componentes React (vite-plugin-svgr ou @svgr/webpack) num módulo central
  src/brand/assets.ts que reexporta com nomes semânticos (LogoLabs, SimboloLocaliza, LcoCompacto,
  GrafismoAmpersand, IconBalaoCheck, etc.).
- Regra de variante por fundo (do README do kit): fundo claro → *-principal; fundo verde-escuro →
  *-branco-folha-citrica / labs-citrico-para-fundo-escuro; fundo cítrico → *-verde-*; nunca recolorir
  os SVGs via CSS fill (eles têm cores oficiais embutidas).
- Ícones funcionais (busca, enviar, anexar, fechar, configurações): SOMENTE @lds/react-icons
  (LdsIconSearch, LdsIconSend, LdsIconAttachFile, ... size="24"). Os ícones proprietários do kit
  (balao-*, megafone, chat-duplo, bookmark-estrela, compartilhar-*) são para os pontos de marca
  definidos abaixo.

## Layout (desktop-first; colapse painel direito <1280px, sidebar vira drawer <768px)
AppShell em CSS Grid: colunas [280px | 1fr | 360px], header 64px sobre as duas últimas colunas.

### Sidebar (SidebarNav)
- Fundo var(--brand-verde-escuro); largura 280px (colapsada 72px, persistir em localStorage);
  canto superior-direito com border-radius 24px sobrepondo o conteúdo (assinatura do "L" da marca).
- Topo: logo labs-citrico-para-fundo-escuro.svg altura 32px (colapsada: simbolo-localiza-branco-folha-citrica.svg 32px).
- Botão "Nova pesquisa": largura total, 44px, fundo var(--brand-verde-citrico), texto var(--brand-verde-escuro)
  600, radius 12px; hover fundo #fff; ícone LdsIconAdd.
- Lista "Pesquisas recentes": itens 40px, radius 8px, título 14px rgba(255,255,255,.85),
  hover rgba(255,255,255,.08); ativo: rgba(255,255,255,.12) + barra esquerda 3px pill var(--brand-verde-citrico).
- Seção "Fixadas" com icones/bookmark-estrela.svg 16px.
- Rodapé: avatar (iniciais em círculo verde-bandeira), nome 14px, divisor rgba(255,255,255,.12).

### Header (TopBar)
- 64px, fundo #fff, border-bottom 1px var(--lds-color-neutral-border-low).
- Esquerda: título da pesquisa (18px 600) + StatusBadge (pill 24px):
  em-andamento{bg:#CEFDAF;color:#01602A} | concluida{bg:rgba(1,132,68,.12);color:#018444} |
  revisar{bg:#FBE437;color:#1A1A1A}.
- Direita: LdsTextField size sm com LdsIconSearch (busca em pesquisas), IconButton com
  icones/compartilhar-citrico.svg (exportar), icones/balao-interrogacao-citrico.svg (ajuda),
  logos/localiza-co/lco-compacto-principal.svg 32px como selo.

### Chat (ChatArea + MessageList + Composer)
- Fundo var(--lds-color-neutral-background-default); coluna max-width 840px centrada; gap 24px.
- AgentMessage: avatar simbolo-localiza-principal.svg em círculo branco 36px com borda
  rgba(1,132,68,.15); bolha bg #fff, borda border-low, border-radius 16px 16px 16px 16px com
  EXCEÇÃO canto sup-esquerdo 4px; padding 16px 20px; corpo 15px/1.6; suporta markdown (tabelas,
  listas) e os blocos ricos abaixo.
- UserMessage: alinhada à direita, max-width 70%, bg var(--brand-verde-bandeira), texto #fff,
  radius 16px com canto inf-direito 4px.
- QuoteBubble (citação de entrevistado dentro de resposta): card #fff, borda 1.5px
  var(--brand-verde-bandeira), radius 16px com cauda chanfrada (pseudo-elemento losango) e
  box-shadow 4px 4px 0 var(--brand-verde-citrico); texto itálico 14px + autor 12px 600 verde.
- KeywordChips: pills outline 1px var(--brand-verde-bandeira), texto 12px verde, bg #fff.
- TypingIndicator: 3 cópias da folha cítrica (recorte do símbolo) 10px pulsando em sequência.
- Composer fixo: container radius 16px, borda border-default, foco borda 2px var(--brand-verde-bandeira);
  textarea auto-grow 1–8 linhas 15px; botão anexar LdsIconAttachFile à esquerda; enviar = botão
  circular 40px bg verde-bandeira (hover verde-escuro) com LdsIconSend branco; hint 12px abaixo.

### Upload (FileDropzone + FileChip + SourceCard)
- Dropzone: radius 16px, borda 2px dashed var(--brand-verde-bandeira), bg rgba(1,132,68,.03);
  ícone LdsIconUpload 40px verde + "Arraste transcrições, áudios ou planilhas" 15px 600 +
  "PDF, DOCX, XLSX, MP3 — até 50MB" 13px text-low; drag-over: bg rgba(206,253,175,.4) e borda sólida.
- FileChip (no composer): pill bg rgba(1,132,68,.05), borda rgba(1,132,68,.2), ícone por tipo,
  nome truncado 13px, X para remover, progresso barra 3px cítrica na base.
- SourceCard (painel Fontes): ícone-documento em quadrado 36px bg rgba(1,132,68,.1) radius 8px,
  nome 14px 600, meta 12px, ações ver/remover.

### Painel de Insights (InsightsPanel)
- 360px, bg #fff, border-left border-low, colapsável; LdsTabs "Insights" | "Fontes".
- InsightCard: radius 16px com canto sup-direito 4px, borda border-low, padding 16px;
  barra vertical 6px à esquerda do título (var(--brand-verde-citrico)=oportunidade,
  var(--brand-verde-escuro)=ponto de atenção); categoria 12px 600 uppercase verde-bandeira;
  ação fixar com bookmark-estrela.svg; corpo 14px; rodapé: KeywordChips + "N entrevistas" com
  chat-duplo.svg 16px. Card destacado (máx. 1): box-shadow 4px 4px 0 var(--brand-verde-citrico).

### Estados vazios (EmptyState genérico + variantes)
- Chat novo: grafismos/grafismo-ampersand-contorno-citrico.svg absoluto sangrando canto inf-direito
  (opacity .6, pointer-events none, z-index 0); saudação 28px "Olá, {nome}." + "O que vamos
  descobrir hoje?" com "descobrir hoje" em var(--brand-verde-bandeira) 700; 4 SuggestionChips
  empilhados com offset (estilo campanha "Seja pra onde for"): pill bg #CEFDAF texto #01602A 500
  radius 12px, hover bg var(--brand-verde-citrico).
- Insights vazio: icones/megafone.svg 96px + "Nenhum insight ainda" 16px 600 + texto 14px +
  LdsButton outlined "Enviar arquivos".
- Fontes vazio: Dropzone inline. Erros: icones/balao-alerta.svg + LdsAlert color critical.

## Regras de marca (não negociáveis)
- Cítrico #78DE1F NUNCA como cor de texto sobre fundo claro e NUNCA sob texto branco; sobre cítrico,
  texto sempre #01602A. Verde-bandeira é a única cor de link/ação textual.
- Grafismos sempre decorativos: outline fino, atrás do conteúdo, sangrando bordas; nunca atrás de
  parágrafos longos. Sombra dura cítrica: máximo 1–2 elementos por tela.
- Cantos: a marca usa raio grande com UM canto reduzido (4px) — aplique em bolhas e InsightCard
  exatamente como especificado; demais superfícies radius 12–16px.
- Foco visível: outline 2px #018444 offset 2px em todo interativo. Texto mínimo 13px.
- Componentes de formulário/feedback: SEMPRE os do @lds/react (LdsButton, LdsTextField, LdsTabs,
  LdsAlert, LdsSnackbar, LdsDrawer, LdsChip) — verifique props nos .d.ts em node_modules/@lds antes de usar.

## Entregáveis e ordem
1) tokens/tema + fontes + módulo de assets; 2) AppShell (grid + sidebar + header);
3) Chat (mensagens, composer, typing, QuoteBubble); 4) Upload; 5) InsightsPanel;
6) Empty states; 7) Responsivo (drawer/colapsos); 8) Revisão de contraste e focos.
Crie dados mockados realistas de uma pesquisa UX (entrevistas sobre app de aluguel de carros)
para popular tudo. Não use emojis na UI. Idioma da UI: pt-BR.
```

---

## 6. Checklist de validação visual ("parece Localiza?")

1. Os três verdes aparecem juntos na tela? (escuro na sidebar, bandeira nas ações, cítrico em acentos pontuais)
2. O cítrico está em minoria e nunca como texto?
3. Bolhas e cards têm o canto único reduzido (eco do "L")?
4. Há exatamente um grafismo outline sangrando uma borda na tela vazia?
5. Tipografia 100% Roobert, títulos SemiBold, destaques por peso+cor dentro da frase?
6. Logos vindas do kit oficial, na variante correta para o fundo?
7. Ícones funcionais 100% LDS; ícones-balão proprietários apenas nos pontos de marca?
