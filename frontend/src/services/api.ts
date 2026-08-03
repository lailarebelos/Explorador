import { FileMetadata, Message } from '../types';

const API_BASE = '/api';

export async function uploadFile(file: File): Promise<FileMetadata> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Erro desconhecido.' }));
    throw new Error((err as { error: string }).error || 'Erro ao fazer upload.');
  }

  return response.json() as Promise<FileMetadata>;
}

export async function sendMessage(
  sessionId: string,
  message: string,
  history: Message[]
): Promise<string> {
  const formattedHistory = history.slice(-10).map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message, history: formattedHistory }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Erro desconhecido.' }));
    throw new Error((err as { error: string }).error || 'Erro ao enviar mensagem.');
  }

  const data = (await response.json()) as { response: string };
  return data.response;
}
