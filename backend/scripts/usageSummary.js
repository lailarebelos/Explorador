const fs = require('fs');
const path = require('path');

const METRICS_FILE = path.join(__dirname, '..', 'metrics', 'usage.jsonl');

function loadEntries() {
  if (!fs.existsSync(METRICS_FILE)) return [];
  return fs
    .readFileSync(METRICS_FILE, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function main() {
  const entries = loadEntries();

  if (entries.length === 0) {
    console.log(`Nenhum registro encontrado em ${path.relative(process.cwd(), METRICS_FILE)}`);
    return;
  }

  const numChamadas = entries.length;
  const totalTokens = entries.reduce((sum, e) => sum + (e.total_tokens ?? 0), 0);
  const mediaTokensPorPergunta = totalTokens / numChamadas;

  const totaisPorDia = new Map();
  for (const e of entries) {
    const dia = String(e.timestamp).slice(0, 10);
    totaisPorDia.set(dia, (totaisPorDia.get(dia) ?? 0) + (e.total_tokens ?? 0));
  }

  console.log('=== Resumo de consumo de IA ===');
  console.log(`Número de chamadas:            ${numChamadas}`);
  console.log(`Tokens médios por pergunta:     ${mediaTokensPorPergunta.toFixed(1)}`);
  console.log(`Tokens totais:                  ${totalTokens}`);
  console.log('Totais por dia:');
  for (const [dia, tokens] of [...totaisPorDia.entries()].sort()) {
    console.log(`  ${dia}: ${tokens}`);
  }
}

main();
