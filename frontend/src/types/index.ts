export interface FileMetadata {
  sessionId: string;
  fileName: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  codebookCount: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SavedInsight {
  id: string;
  messageId: string;
  body: string;
  savedAt: string;
}

export interface Research {
  id: string;
  titulo: string;
  criadaEm: string;
  atualizadaEm: string;
  fixada: boolean;
  nomeArquivo: string;
  fileMetadata: FileMetadata;
  mensagens: Message[];
  insights: SavedInsight[];
  fileFingerprint?: string; // SHA-256 hex (~64 chars) — leve, cabe no localStorage
  fileSize?: number;         // bytes
}
