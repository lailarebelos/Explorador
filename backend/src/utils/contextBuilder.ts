import { ExcelData, CodebookEntry } from '../types';
import { calculateColumnStats } from '../services/statsService';

const SAMPLE_ROWS = 8;
const MAX_CODEBOOK_ENTRIES = 60;

/**
 * Gera um contexto compacto e estruturado para o LLM interpretar os dados.
 * Envia estatísticas calculadas, amostra e codebook — nunca o dataset bruto completo.
 */
export function buildCompactContext(excelData: ExcelData, fileName: string): string {
  const { data, codebook, columns, rowCount } = excelData;
  const stats = calculateColumnStats(data, columns);

  // Mapa de lookup do codebook por nome de coluna
  const cbMap = new Map<string, CodebookEntry>();
  for (const entry of codebook) {
    if (entry.column) cbMap.set(entry.column, entry);
  }

  let ctx = `# Arquivo: ${fileName}\n`;
  ctx += `# Total de respondentes: ${rowCount}\n`;
  ctx += `# Total de colunas (aba data): ${columns.length}\n\n`;

  // Dicionário de variáveis (codebook)
  ctx += `## Dicionário de Variáveis (Codebook)\n`;
  const codebookSlice = codebook.slice(0, MAX_CODEBOOK_ENTRIES);
  for (const entry of codebookSlice) {
    if (!entry.column) continue;
    ctx += `- **${entry.column}**`;
    if (entry.label) ctx += `: ${entry.label}`;
    if (entry.question && entry.question !== entry.label) ctx += ` — Pergunta: "${entry.question}"`;
    if (entry.type) ctx += ` [tipo: ${entry.type}]`;
    if (entry.values) {
      const vStr = Object.entries(entry.values)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      ctx += ` | Escala: ${vStr}`;
    }
    if (entry.alternatives?.length) {
      ctx += ` | Alternativas: ${entry.alternatives.join('; ')}`;
    }
    ctx += '\n';
  }
  if (codebook.length > MAX_CODEBOOK_ENTRIES) {
    ctx += `... (${codebook.length - MAX_CODEBOOK_ENTRIES} entradas omitidas)\n`;
  }

  // Estatísticas por coluna
  ctx += `\n## Estatísticas por Coluna\n`;
  for (const stat of stats) {
    const cbEntry = cbMap.get(stat.column);
    const label = cbEntry?.label || stat.column;

    if (!stat.isNumeric) {
      ctx += `- **${stat.column}** (${label}) [texto/categórico] | ausentes=${stat.missingCount}\n`;
      continue;
    }

    // Variável com escala definida no codebook: distribuição com rótulos textuais
    if (cbEntry?.values) {
      const validTotal = data.filter(row => {
        const v = row[stat.column];
        return v !== null && v !== undefined && v !== '';
      }).length;

      const distParts: Array<{ code: string; lbl: string; count: number; pct: string }> = [];
      for (const [code, lbl] of Object.entries(cbEntry.values)) {
        const count = data.filter(row => String(row[stat.column]) === String(code)).length;
        if (count > 0) {
          distParts.push({ code, lbl, count, pct: ((count / validTotal) * 100).toFixed(1) });
        }
      }
      distParts.sort((a, b) => b.count - a.count);

      const distStr = distParts
        .map(d => `${d.code} (${d.lbl}): ${d.count} (${d.pct}%)`)
        .join(', ');

      ctx += `- **${stat.column}** (${label}) | ausentes=${stat.missingCount}`;
      if (distStr) ctx += ` | distribuição=[${distStr}]`;
      ctx += '\n';
      continue;
    }

    // Variável numérica contínua (sem escala definida no codebook)
    ctx += `- **${stat.column}** (${label}): média=${stat.mean}, mediana=${stat.median}, dp=${stat.std}, min=${stat.min}, max=${stat.max}, ausentes=${stat.missingCount}`;
    if (stat.distribution) {
      const total = Object.values(stat.distribution).reduce((a, b) => a + b, 0);
      const distStr = Object.entries(stat.distribution)
        .map(([k, v]) => `${k}: ${v} (${((v / total) * 100).toFixed(1)}%)`)
        .join(', ');
      ctx += ` | distribuição=[${distStr}]`;
    }
    ctx += '\n';
  }

  // Amostra de dados
  ctx += `\n## Amostra de Dados (${Math.min(SAMPLE_ROWS, data.length)} de ${rowCount} linhas)\n`;
  ctx += `Colunas: ${columns.join(', ')}\n`;
  const sample = data.slice(0, SAMPLE_ROWS);
  for (const row of sample) {
    ctx += JSON.stringify(row) + '\n';
  }

  return ctx;
}

export function detectAnalysisType(question: string): 'correlation' | 'regression' | 'general' {
  const q = question.toLowerCase();
  if (/correla[cç]|pearson|spearman/.test(q)) return 'correlation';
  if (/regress[aã]o|regress|prediz|prever|predict/.test(q)) return 'regression';
  return 'general';
}

export function extractColumnMentions(question: string, columns: string[]): string[] {
  const q = question.toLowerCase();
  return columns.filter(col => q.includes(col.toLowerCase()));
}
