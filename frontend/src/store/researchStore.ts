import { Research, Message, FileMetadata, SavedInsight } from '../types';

const KEY = 'acp:researches';

type RawMsg = Omit<Message, 'timestamp'> & { timestamp: string };
type RawResearch = Omit<Research, 'mensagens' | 'insights'> & {
  mensagens: RawMsg[];
  insights?: SavedInsight[]; // opcional para compatibilidade com dados antigos
};

function hydrate(raw: RawResearch): Research {
  return {
    ...raw,
    insights: raw.insights ?? [],
    mensagens: raw.mensagens.map(m => ({ ...m, timestamp: new Date(m.timestamp) })),
  };
}

function readAll(): Research[] {
  try {
    const v = localStorage.getItem(KEY);
    if (!v) return [];
    return (JSON.parse(v) as RawResearch[]).map(hydrate);
  } catch {
    return [];
  }
}

function writeAll(list: Research[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const researchStore = {
  getAll: readAll,

  create(fileMetadata: FileMetadata): Research {
    const r: Research = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      titulo: fileMetadata.fileName.replace(/\.xlsx$/i, ''),
      criadaEm: new Date().toISOString(),
      atualizadaEm: new Date().toISOString(),
      fixada: false,
      nomeArquivo: fileMetadata.fileName,
      fileMetadata,
      mensagens: [],
      insights: [],
    };
    writeAll([r, ...readAll()]);
    return r;
  },

  // ITEM 1: persiste um Research já construído (draft commit — não gera novo ID nem nova data)
  commitDraft(research: Research): void {
    writeAll([research, ...readAll()]);
  },

  // ITEM 3: opts.silent = true → salva sem atualizar atualizadaEm (não reordena)
  update(id: string, partial: Partial<Omit<Research, 'id'>>, opts?: { silent?: boolean }): void {
    const all = readAll();
    const idx = all.findIndex(r => r.id === id);
    if (idx < 0) return;
    if (opts?.silent) {
      all[idx] = { ...all[idx], ...partial };
    } else {
      all[idx] = { ...all[idx], ...partial, atualizadaEm: new Date().toISOString() };
    }
    writeAll(all);
  },

  remove(id: string): void {
    writeAll(readAll().filter(r => r.id !== id));
  },
};
