import fs from 'fs';
import path from 'path';

const METRICS_DIR = path.join(__dirname, '..', '..', 'metrics');
const METRICS_FILE = path.join(METRICS_DIR, 'usage.jsonl');

export interface UsageEntry {
  timestamp: string;
  sessionId: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  origem: 'api' | 'estimado_local';
  duracao_ms: number;
}

/**
 * Grava uma linha JSONL por chamada ao LLM. Nunca lança — uma falha aqui
 * não pode derrubar a resposta de chat que já foi obtida com sucesso.
 */
export async function recordUsage(entry: UsageEntry): Promise<void> {
  try {
    await fs.promises.mkdir(METRICS_DIR, { recursive: true });
    await fs.promises.appendFile(METRICS_FILE, `${JSON.stringify(entry)}\n`, 'utf-8');
  } catch (err) {
    console.error('[usageMetrics] Falha ao gravar metrics/usage.jsonl:', err);
  }
}
