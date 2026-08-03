import { SessionData } from '../types';

// Armazenamento em memória por sessão.
// Em produção, substituir por Redis ou banco de dados.
class SessionStore {
  private store: Map<string, SessionData> = new Map();
  private readonly MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 horas

  set(id: string, data: SessionData): void {
    this.store.set(id, data);
    this.cleanup();
  }

  get(id: string): SessionData | undefined {
    return this.store.get(id);
  }

  delete(id: string): void {
    this.store.delete(id);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [id, session] of this.store.entries()) {
      if (now - session.uploadedAt.getTime() > this.MAX_AGE_MS) {
        this.store.delete(id);
      }
    }
  }
}

export const sessionStore = new SessionStore();
