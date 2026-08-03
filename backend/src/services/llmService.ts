import { v4 as uuidv4 } from 'uuid';
import { countTokens } from 'gpt-tokenizer/cjs/encoding/o200k_base';
import { ChatMessage } from '../types';
import { recordUsage } from './usageMetrics';

const LLM_ENDPOINT = 'https://llm-gate-np.localiza.dev/llm-gate/v2/chat/completions';
const MODEL = 'gpt-5.2';
const PROVIDER = 'openai';

/**
 * Camada de serviço de IA. Toda comunicação com o modelo passa por aqui.
 * Nunca chame a API de IA diretamente de outra parte do código.
 */
export async function callLLM(messages: ChatMessage[], sessionId: string): Promise<string> {
  const apiKey = process.env.LOCALIZA_LLM_API_KEY;
  if (!apiKey) {
    throw new Error('LOCALIZA_LLM_API_KEY não está configurada. Verifique o arquivo .env.');
  }

  const correlationId = uuidv4();
  const startedAt = Date.now();

  let response: Response;
  try {
    response = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        API_KEY: apiKey,
        'X-Correlation-Id': correlationId,
      },
      body: JSON.stringify({
        provider: PROVIDER,
        model: MODEL,
        messages,
      }),
    });
  } catch {
    throw new Error(
      'Não foi possível conectar ao serviço de IA. Verifique se a VPN da Localiza está ativa e recarregue a página.'
    );
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'sem detalhes');
    throw new Error(`Erro na API de IA (HTTP ${response.status}): ${errorText}`);
  }

  const responseData = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };

  const content = responseData?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('A API de IA retornou uma resposta em formato inesperado.');
  }

  const duracao_ms = Date.now() - startedAt;
  const apiUsage = responseData.usage;

  let input_tokens: number;
  let output_tokens: number;
  let total_tokens: number;
  let origem: 'api' | 'estimado_local';

  if (apiUsage && typeof apiUsage.total_tokens === 'number') {
    input_tokens = apiUsage.prompt_tokens ?? 0;
    output_tokens = apiUsage.completion_tokens ?? 0;
    total_tokens = apiUsage.total_tokens;
    origem = 'api';
  } else {
    input_tokens = countTokens(JSON.stringify(messages));
    output_tokens = countTokens(content);
    total_tokens = input_tokens + output_tokens;
    origem = 'estimado_local';
  }

  await recordUsage({
    timestamp: new Date().toISOString(),
    sessionId,
    model: MODEL,
    input_tokens,
    output_tokens,
    total_tokens,
    origem,
    duracao_ms,
  });

  return content;
}
