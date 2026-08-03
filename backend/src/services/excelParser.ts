import * as XLSX from 'xlsx';
import { ExcelData, CodebookEntry } from '../types';

export function parseExcel(buffer: Buffer): ExcelData {
  const workbook = XLSX.read(buffer, { type: 'buffer' });

  const dataSheetName = workbook.SheetNames.find(n => n.toLowerCase().trim() === 'data');
  const codebookSheetName = workbook.SheetNames.find(n => n.toLowerCase().trim() === 'codebook');

  if (!dataSheetName) {
    throw new Error(`Arquivo inválido: aba 'data' não encontrada. Abas encontradas: [${workbook.SheetNames.join(', ')}].`);
  }
  if (!codebookSheetName) {
    throw new Error(`Arquivo inválido: aba 'codebook' não encontrada. Abas encontradas: [${workbook.SheetNames.join(', ')}].`);
  }

  const dataSheet = workbook.Sheets[dataSheetName];
  const codebookSheet = workbook.Sheets[codebookSheetName];

  const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(dataSheet, { defval: null });
  const codebookRaw = XLSX.utils.sheet_to_json<Record<string, unknown>>(codebookSheet, { defval: null });

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const codebook = detectAndParseCodebook(codebookRaw);

  const withValues = codebook.filter(e => e.values).length;
  console.log(`[parser] Formato: ${isLongFormat(codebookRaw) ? 'LONGO' : 'LARGO'} | ` +
    `Variáveis: ${codebook.length} | Com rótulos: ${withValues}`);

  return { data, codebook, columns, rowCount: data.length };
}

export function getRawCodebookSample(buffer: Buffer): {
  sheetNames: string[];
  codebookColumns: string[];
  firstRows: Record<string, unknown>[];
  detectedFormat: string;
} {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const codebookSheetName = workbook.SheetNames.find(n => n.toLowerCase().trim() === 'codebook');
  if (!codebookSheetName) {
    return { sheetNames: workbook.SheetNames, codebookColumns: [], firstRows: [], detectedFormat: 'sem aba codebook' };
  }
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    workbook.Sheets[codebookSheetName],
    { defval: null }
  );
  const firstRows = rows.slice(0, 6);
  const codebookColumns = firstRows.length > 0 ? Object.keys(firstRows[0]) : [];
  const detectedFormat = isLongFormat(rows) ? 'longo' : 'largo';
  return { sheetNames: workbook.SheetNames, codebookColumns, firstRows, detectedFormat };
}

// ---------------------------------------------------------------------------
// Detecção de formato
// ---------------------------------------------------------------------------

// Nomes canônicos da coluna que identifica a variável. Matching EXATO para evitar
// falsos positivos como "variable_type" batendo em "variable".
const COLUMN_KEY_ALIASES = [
  'column', 'coluna', 'question_code', 'cod_variavel', 'cod_variable',
  'variavel', 'variável', 'variable', 'var', 'campo', 'field', 'codigo', 'código',
];

function findColumnKey(row: Record<string, unknown>): string | undefined {
  const keys = Object.keys(row).map(k => k.toLowerCase().trim());
  const match = COLUMN_KEY_ALIASES.find(alias => keys.includes(alias));
  if (match) {
    return Object.keys(row).find(k => k.toLowerCase().trim() === match);
  }
  return undefined;
}

function isLongFormat(rows: Record<string, unknown>[]): boolean {
  if (rows.length < 3) return false;
  const columnKey = findColumnKey(rows[0]);
  if (!columnKey) return false;
  const uniqueValues = new Set(rows.map(r => String(r[columnKey] ?? '')));
  // Formato longo: o mesmo identificador de coluna se repete — menos de 70% únicos
  return uniqueValues.size < rows.length * 0.7;
}

function detectAndParseCodebook(rows: Record<string, unknown>[]): CodebookEntry[] {
  if (rows.length === 0) return [];
  if (isLongFormat(rows)) {
    return parseLongFormat(rows);
  }
  return parseWideFormat(rows);
}

// ---------------------------------------------------------------------------
// Formato largo: uma linha por variável
// ---------------------------------------------------------------------------

function parseWideFormat(rows: Record<string, unknown>[]): CodebookEntry[] {
  return rows.map(row => {
    // Tenta extrair o mapa código→rótulo de várias fontes possíveis.
    // "alternatives" aqui já pode estar no formato "1=Masculino; 2=Feminino" — usa parseValues.
    const values =
      parseValues(row['values'] ?? row['valores'] ?? row['Values']) ??
      parseValues(row['escala'] ?? row['Escala'] ?? row['scale']) ??
      parseValues(row['categorias'] ?? row['Categorias'] ?? row['codes']) ??
      parseValues(row['alternatives'] ?? row['alternativas'] ?? row['Alternatives']);

    // Se parseValues falhou nas alternativas, tenta como lista simples e constrói mapa sequencial
    const alternatives = parseAlternatives(
      row['alternatives'] ?? row['alternativas'] ?? row['Alternatives'] ??
      row['opcoes'] ?? row['opções']
    );

    const entry: CodebookEntry = {
      column: String(
        row['question_code'] ?? row['column'] ?? row['coluna'] ?? row['Column'] ??
        row['variavel'] ?? row['variável'] ?? row['variable'] ?? row['var'] ?? ''
      ),
      label: String(
        row['label'] ?? row['rótulo'] ?? row['rotulo'] ?? row['Label'] ??
        row['titulo'] ?? row['título'] ?? row['nome'] ?? row['name'] ?? ''
      ),
      question: String(row['question'] ?? row['pergunta'] ?? row['Question'] ?? ''),
      type: String(
        row['variable_type'] ?? row['type'] ?? row['tipo'] ?? row['Type'] ??
        row['question_type'] ?? ''
      ),
      values,
      alternatives,
    };

    // Fallback final: se ainda sem values mas tem lista de alternativas, constrói mapa sequencial
    if (!entry.values && entry.alternatives && entry.alternatives.length > 0) {
      entry.values = Object.fromEntries(
        entry.alternatives.map((alt, i) => [String(i + 1), alt])
      );
    }

    return entry;
  }).filter(e => e.column);
}

// ---------------------------------------------------------------------------
// Formato longo: uma linha por alternativa de resposta
// ---------------------------------------------------------------------------

function parseLongFormat(rows: Record<string, unknown>[]): CodebookEntry[] {
  const firstRow = rows[0];
  const allKeys = Object.keys(firstRow);
  const columnKey = findColumnKey(firstRow) ?? allKeys[0];

  const groups = new Map<string, Record<string, unknown>[]>();
  for (const row of rows) {
    const col = String(row[columnKey] ?? '').trim();
    if (!col) continue;
    if (!groups.has(col)) groups.set(col, []);
    groups.get(col)!.push(row);
  }

  const entries: CodebookEntry[] = [];

  for (const [column, groupRows] of groups) {
    const firstGroupRow = groupRows[0];
    const keys = allKeys.filter(k => k !== columnKey);

    const stableKeys: string[] = [];
    const varyingKeys: string[] = [];
    for (const key of keys) {
      const vals = groupRows.map(r => String(r[key] ?? '').trim());
      if (vals.every(v => v === vals[0])) stableKeys.push(key);
      else varyingKeys.push(key);
    }

    const labelKey = findKeyExact(stableKeys, ['label', 'rótulo', 'rotulo', 'titulo', 'título', 'nome', 'name']);
    const questionKey = findKeyExact(stableKeys, ['question', 'pergunta', 'enunciado']);
    const typeKey = findKeyExact(stableKeys, ['type', 'tipo', 'variable_type', 'question_type']);

    const codeKey = findKeyExact(varyingKeys, ['code', 'codigo', 'código', 'valor', 'value', 'key', 'ordem', 'order', 'n']) ??
      varyingKeys.find(k => groupRows.every(r => !isNaN(Number(r[k]))));

    const answerKey = findKeyExact(varyingKeys.filter(k => k !== codeKey), ['resposta', 'answer', 'text', 'texto', 'label', 'alternativa', 'option', 'opcao', 'opção']) ??
      varyingKeys.find(k => k !== codeKey && groupRows.some(r => isNaN(Number(r[k])) && String(r[k] ?? '').length > 1));

    let values: Record<string, string> | undefined;
    if (codeKey && answerKey) {
      values = {};
      for (const row of groupRows) {
        const code = String(row[codeKey] ?? '').trim();
        const lbl = String(row[answerKey] ?? '').trim();
        if (code && lbl) values[code] = lbl;
      }
      if (Object.keys(values).length === 0) values = undefined;
    }

    entries.push({
      column,
      label: labelKey ? String(firstGroupRow[labelKey] ?? '') : '',
      question: questionKey ? String(firstGroupRow[questionKey] ?? '') : '',
      type: typeKey ? String(firstGroupRow[typeKey] ?? '') : '',
      values,
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findKeyExact(keys: string[], aliases: string[]): string | undefined {
  return keys.find(k => aliases.includes(k.toLowerCase().trim()));
}

function parseValues(raw: unknown): Record<string, string> | undefined {
  if (!raw) return undefined;
  try {
    if (typeof raw === 'object' && !Array.isArray(raw)) {
      return raw as Record<string, string>;
    }
    const str = String(raw).trim();
    if (!str || str === 'null') return undefined;
    const result: Record<string, string> = {};
    const pairs = str.split(/[;|\n]/);
    for (const pair of pairs) {
      const match = pair.trim().match(/^(\d+)\s*[=:]\s*(.+)$/);
      if (match) result[match[1]] = match[2].trim();
    }
    return Object.keys(result).length > 0 ? result : undefined;
  } catch {
    return undefined;
  }
}

function parseAlternatives(raw: unknown): string[] | undefined {
  if (!raw) return undefined;
  try {
    if (Array.isArray(raw)) return raw.map(String);
    const str = String(raw).trim();
    if (!str || str === 'null') return undefined;
    return str.split(/[;|\n]/).map(s => s.trim()).filter(Boolean);
  } catch {
    return undefined;
  }
}
