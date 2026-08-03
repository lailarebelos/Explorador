import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parseExcel, getRawCodebookSample } from '../services/excelParser';
import { sessionStore } from '../store/sessionStore';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const valid =
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.originalname.endsWith('.xlsx');
    cb(null, valid);
  },
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    if (!req.file.originalname.toLowerCase().endsWith('.xlsx')) {
      return res.status(400).json({ error: 'Apenas arquivos .xlsx são aceitos.' });
    }

    const excelData = parseExcel(req.file.buffer);

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Guarda o buffer junto com o sessionId para permitir diagnóstico posterior
    sessionStore.set(sessionId, {
      excelData,
      fileName: req.file.originalname,
      uploadedAt: new Date(),
      rawBuffer: req.file.buffer,
    });

    return res.json({
      sessionId,
      fileName: req.file.originalname,
      rowCount: excelData.rowCount,
      columnCount: excelData.columns.length,
      columns: excelData.columns,
      codebookCount: excelData.codebook.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao processar arquivo.';
    return res.status(400).json({ error: msg });
  }
});

// Endpoint de diagnóstico: revela a estrutura bruta do codebook para depuração de parsing
router.get('/debug/:sessionId', async (req: Request, res: Response) => {
  const session = sessionStore.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Sessão não encontrada.' });
  }

  if (!session.rawBuffer) {
    return res.status(400).json({ error: 'Buffer não disponível para esta sessão.' });
  }

  const raw = getRawCodebookSample(session.rawBuffer);

  // Mostra também o que o parser extraiu das primeiras entradas
  const parsedSample = session.excelData.codebook.slice(0, 5).map(e => ({
    column: e.column,
    label: e.label,
    type: e.type,
    hasValues: !!e.values,
    valuesCount: e.values ? Object.keys(e.values).length : 0,
    valuesSample: e.values ? Object.entries(e.values).slice(0, 4) : null,
    hasAlternatives: !!e.alternatives,
    alternativesSample: e.alternatives?.slice(0, 4) ?? null,
  }));

  return res.json({
    sheetNames: raw.sheetNames,
    codebookColumns: raw.codebookColumns,
    firstRawRows: raw.firstRows,
    parsedSample,
  });
});

export default router;
