/**
 * CLI para contar tokens (encoding o200k_base) de arquivos de texto, planilhas
 * e exports de conversas do ChatGPT. Não depende de nada além dos pacotes já
 * instalados no backend (gpt-tokenizer, xlsx) — sem download em runtime.
 *
 * Uso: npm run contar -- "C:\caminho\arquivo-ou-pasta"
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { countTokens } = require('gpt-tokenizer/cjs/encoding/o200k_base');

const TEXT_EXTENSIONS = new Set(['.txt', '.md']);
const SHEET_EXTENSIONS = new Set(['.xlsx', '.csv']);

const CSV_OUTPUT = path.join(__dirname, '..', 'metrics', 'contagem_tokens.csv');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function extractTextFromContent(content) {
  if (!content) return '';
  if (Array.isArray(content.parts)) {
    return content.parts.filter(p => typeof p === 'string').join('\n');
  }
  if (typeof content.text === 'string') return content.text;
  return '';
}

function processConversation(conv) {
  const mapping = conv.mapping || {};
  let userText = '';
  let assistantText = '';
  for (const node of Object.values(mapping)) {
    const msg = node && node.message;
    if (!msg || !msg.author) continue;
    const text = extractTextFromContent(msg.content);
    if (!text) continue;
    if (msg.author.role === 'user') userText += text + '\n';
    else if (msg.author.role === 'assistant') assistantText += text + '\n';
  }
  return { title: conv.title || '(sem título)', userText, assistantText };
}

function extractSheetText(filePath) {
  const wb = XLSX.readFile(filePath);
  let allText = '';
  for (const sheetName of wb.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' });
    for (const row of rows) {
      allText += row.map(cell => String(cell)).join(' ') + '\n';
    }
  }
  return allText;
}

function csvEscape(value) {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function formatRow({ arquivo, tipo, tokens_usuario, tokens_assistente, tokens_total }) {
  const partes = [`[${tipo}]`, arquivo];
  if (tokens_usuario !== '' || tokens_assistente !== '') {
    partes.push(`usuario=${tokens_usuario || 0}`, `assistente=${tokens_assistente || 0}`);
  }
  partes.push(`total=${tokens_total}`);
  return partes.join('  ');
}

function main() {
  const inputArg = process.argv[2];
  if (!inputArg) {
    console.error('Uso: npm run contar -- "<arquivo-ou-pasta>"');
    process.exit(1);
  }

  const resolved = path.resolve(inputArg);
  if (!fs.existsSync(resolved)) {
    console.error(`Caminho não encontrado: ${resolved}`);
    process.exit(1);
  }

  const isDir = fs.statSync(resolved).isDirectory();
  const files = isDir ? walk(resolved) : [resolved];
  const baseDir = isDir ? resolved : path.dirname(resolved);

  const rows = [];
  const ignorados = [];

  for (const file of files) {
    const base = path.basename(file);
    const ext = path.extname(file).toLowerCase();
    const rel = path.relative(baseDir, file) || base;

    try {
      if (base.toLowerCase() === 'conversations.json') {
        const parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const conversas = Array.isArray(parsed) ? parsed : [parsed];
        conversas.forEach((conv, idx) => {
          const { title, userText, assistantText } = processConversation(conv);
          const tu = countTokens(userText);
          const ta = countTokens(assistantText);
          rows.push({
            arquivo: `${rel} :: [${idx}] ${title}`,
            tipo: 'chatgpt_conversa',
            tokens_usuario: tu,
            tokens_assistente: ta,
            tokens_total: tu + ta,
          });
        });
      } else if (TEXT_EXTENSIONS.has(ext)) {
        const text = fs.readFileSync(file, 'utf-8');
        const total = countTokens(text);
        rows.push({ arquivo: rel, tipo: 'texto', tokens_usuario: '', tokens_assistente: '', tokens_total: total });
      } else if (SHEET_EXTENSIONS.has(ext)) {
        const total = countTokens(extractSheetText(file));
        rows.push({ arquivo: rel, tipo: 'planilha', tokens_usuario: '', tokens_assistente: '', tokens_total: total });
      } else {
        ignorados.push(rel);
      }
    } catch (err) {
      console.error(`[erro] ${rel}: ${err.message}`);
    }
  }

  for (const row of rows) console.log(formatRow(row));

  const totalGeral = rows.reduce((s, r) => s + r.tokens_total, 0);
  console.log('-'.repeat(60));
  console.log(`TOTAL GERAL: ${totalGeral} tokens (${rows.length} arquivo(s)/conversa(s) processados)`);
  if (ignorados.length > 0) {
    console.log(`Ignorados (extensão não suportada): ${ignorados.length}`);
  }

  fs.mkdirSync(path.dirname(CSV_OUTPUT), { recursive: true });
  const header = 'arquivo,tipo,tokens_usuario,tokens_assistente,tokens_total';
  const lines = rows.map(r =>
    [r.arquivo, r.tipo, r.tokens_usuario, r.tokens_assistente, r.tokens_total].map(csvEscape).join(',')
  );
  fs.writeFileSync(CSV_OUTPUT, [header, ...lines].join('\n') + '\n', 'utf-8');
  console.log(`\nCSV gravado em: ${path.relative(process.cwd(), CSV_OUTPUT)}`);
}

main();
