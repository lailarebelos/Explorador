export interface CodebookEntry {
  column: string;
  label: string;
  question: string;
  type: string;
  values?: Record<string, string>;
  alternatives?: string[];
}

export interface ExcelData {
  data: Record<string, unknown>[];
  codebook: CodebookEntry[];
  columns: string[];
  rowCount: number;
}

export interface SessionData {
  excelData: ExcelData;
  fileName: string;
  uploadedAt: Date;
  rawBuffer?: Buffer;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ColumnStats {
  column: string;
  mean?: number;
  median?: number;
  std?: number;
  min?: number;
  max?: number;
  missingCount: number;
  distribution?: Record<string, number>;
  isNumeric: boolean;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  n: number;
  equation: string;
}
