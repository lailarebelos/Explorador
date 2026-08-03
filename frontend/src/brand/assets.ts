/*
 * Módulo central de assets da marca Localiza.
 * Todos os SVGs são originais extraídos do Slide Mestre oficial.
 * Regra de variante por fundo (README do kit):
 *   fundo claro  → *-principal
 *   fundo escuro (#01602A / #018444) → *-branco-e-citrico / *-branco-folha-citrica
 *   fundo cítrico → *-verde-*
 * NÃO aplique CSS fill/stroke para recolorir — as cores estão embutidas nos vetores.
 */

/* ── Logos ────────────────────────────────────────────── */

/** Localiza&CO horizontal — fundo claro */
import localizaCoHorizontalPrincipal from './svgs/logos/localiza-co-horizontal-principal.svg';

/** Localiza&CO horizontal — fundo verde-escuro (#01602A) */
import localizaCoHorizontalBrancoECitrico from './svgs/logos/localiza-co-horizontal-branco-e-citrico.svg';

/** L&CO compacto — fundo verde-escuro (sidebar colapsada) */
import lcoCompactoBrancoECitrico from './svgs/logos/lco-compacto-branco-e-citrico.svg';

/** Símbolo "L" Localiza — fundo claro (avatar agente, favicon) */
import simboloLocalizaPrincipal from './svgs/logos/simbolo-localiza-principal.svg';

/** Símbolo "L" Localiza — fundo verde-escuro (sidebar colapsada) */
import simboloLocalizaBrancoFolhaCitrica from './svgs/logos/simbolo-localiza-branco-folha-citrica.svg';

/** L&CO compacto — fundo claro (header direito, eco do slide mestre) */
import lcoCompactoPrincipal from './svgs/logos/lco-compacto-principal.svg';

/* ── Grafismos decorativos ────────────────────────────── */

/** Ampersand "&" contorno cítrico — empty state, sangrando canto inf-dir */
import grafismoAmpersand from './svgs/grafismos/grafismo-ampersand-contorno-citrico.svg';

/** Recorte coroa — cabeçalho de card de insight */
import grafismoRecorteCoroa from './svgs/grafismos/grafismo-recorte-coroa-contorno.svg';

/** Folha grande contorno — decorativo */
import grafismoFolhaGrande from './svgs/grafismos/grafismo-folha-grande-contorno-escuro.svg';

/* ── Ícones proprietários ─────────────────────────────── */

/** Balão check — toast de sucesso, insight validado */
import iconBalaoCheck from './svgs/icones/balao-check.svg';

/** Balão alerta — toast de erro, banner crítico */
import iconBalaoAlerta from './svgs/icones/balao-alerta.svg';

/** Balão info — dicas, onboarding */
import iconBalaoInfo from './svgs/icones/balao-info.svg';

/** Balão fechar — dismiss */
import iconBalaoFechar from './svgs/icones/balao-fechar.svg';

/** Balão vazio — estado neutro */
import iconBalaoVazio from './svgs/icones/balao-vazio.svg';

/** Balão interrogação cítrico — ajuda, tooltip de onboarding */
import iconBalaoInterrogacao from './svgs/icones/balao-interrogacao-citrico.svg';

/** Chat duplo — navegação "Conversas", empty state lista */
import iconChatDuplo from './svgs/icones/chat-duplo.svg';

/** Megafone — card Insights/Descobertas */
import iconMegafone from './svgs/icones/megafone.svg';

/** Bookmark estrela — salvar/fixar pesquisa ou insight */
import iconBookmarkEstrela from './svgs/icones/bookmark-estrela.svg';

/** Compartilhar cítrico — exportar/compartilhar relatório */
import iconCompartilharCitrico from './svgs/icones/compartilhar-citrico.svg';

/** Compartilhar verde-escuro — variante para fundos claros */
import iconCompartilharVerdeEscuro from './svgs/icones/compartilhar-verde-escuro.svg';

/** Triângulo de alerta cítrico — avisos inline */
import iconAlertaTriangulo from './svgs/icones/alerta-triangulo-citrico.svg';

/* ── Re-exports com nomes semânticos ─────────────────── */

export const LogoLocalizaCo                  = localizaCoHorizontalPrincipal;      // fundo claro
export const LogoLocalizaCoDark              = localizaCoHorizontalBrancoECitrico; // fundo verde-escuro
export const LcoCompactoDark                 = lcoCompactoBrancoECitrico;           // sidebar colapsada
export const SimboloLocaliza                 = simboloLocalizaPrincipal;
export const SimboloLocalizaDark             = simboloLocalizaBrancoFolhaCitrica;
export const LcoCompacto                     = lcoCompactoPrincipal;

/* ── Mapa de assets temáticos ────────────────────────────
   Use useThemedAssets() nos componentes — nunca hardcode
   a variante de SVG dependente de tema.
   ─────────────────────────────────────────────────────── */
export const THEMED_ASSETS = {
  light: {
    logoCoHorizontal: localizaCoHorizontalPrincipal,
    logoCoCompact:    lcoCompactoPrincipal,
    simboloLocaliza:  simboloLocalizaPrincipal,
  },
  dark: {
    logoCoHorizontal: localizaCoHorizontalBrancoECitrico,
    logoCoCompact:    lcoCompactoBrancoECitrico,
    simboloLocaliza:  simboloLocalizaBrancoFolhaCitrica,
  },
} as const;

export const GrafismoAmpersand               = grafismoAmpersand;
export const GrafismoRecorteCoroa            = grafismoRecorteCoroa;
export const GrafismoFolhaGrande             = grafismoFolhaGrande;

export const IconBalaoCheck                  = iconBalaoCheck;
export const IconBalaoAlerta                 = iconBalaoAlerta;
export const IconBalaoInfo                   = iconBalaoInfo;
export const IconBalaoFechar                 = iconBalaoFechar;
export const IconBalaoVazio                  = iconBalaoVazio;
export const IconBalaoInterrogacao           = iconBalaoInterrogacao;
export const IconChatDuplo                   = iconChatDuplo;
export const IconMegafone                    = iconMegafone;
export const IconBookmarkEstrela             = iconBookmarkEstrela;
export const IconCompartilharCitrico         = iconCompartilharCitrico;
export const IconCompartilharVerdeEscuro     = iconCompartilharVerdeEscuro;
export const IconAlertaTriangulo             = iconAlertaTriangulo;
