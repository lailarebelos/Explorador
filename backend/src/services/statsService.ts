import { ColumnStats, RegressionResult } from '../types';

export function calculateColumnStats(
  data: Record<string, unknown>[],
  columns: string[]
): ColumnStats[] {
  return columns.map(col => {
    const rawValues = data.map(row => row[col]);
    const numericValues = rawValues
      .filter(v => v !== null && v !== undefined && v !== '' && !isNaN(Number(v)))
      .map(Number);
    const missingCount = rawValues.filter(v => v === null || v === undefined || v === '').length;

    if (numericValues.length === 0) {
      return { column: col, missingCount, isNumeric: false };
    }

    const n = numericValues.length;
    const mean = numericValues.reduce((a, b) => a + b, 0) / n;
    const sorted = [...numericValues].sort((a, b) => a - b);
    const median =
      n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];
    const variance = numericValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
    const std = Math.sqrt(variance);
    const min = sorted[0];
    const max = sorted[n - 1];

    // Distribuição para escalas Likert (1-5)
    const isLikert = min >= 1 && max <= 5 && numericValues.every(v => Number.isInteger(v));
    let distribution: Record<string, number> | undefined;
    if (isLikert) {
      distribution = {};
      for (let i = 1; i <= 5; i++) {
        distribution[String(i)] = numericValues.filter(v => v === i).length;
      }
    }

    return {
      column: col,
      mean: Number(mean.toFixed(3)),
      median,
      std: Number(std.toFixed(3)),
      min,
      max,
      missingCount,
      distribution,
      isNumeric: true,
    };
  });
}

export function calculateCorrelation(
  data: Record<string, unknown>[],
  col1: string,
  col2: string
): number | null {
  const pairs = data
    .map(row => [row[col1], row[col2]])
    .filter(([a, b]) => a !== null && b !== null && !isNaN(Number(a)) && !isNaN(Number(b)))
    .map(([a, b]) => [Number(a), Number(b)]);

  if (pairs.length < 3) return null;

  const n = pairs.length;
  const meanX = pairs.reduce((s, [x]) => s + x, 0) / n;
  const meanY = pairs.reduce((s, [, y]) => s + y, 0) / n;

  const numerator = pairs.reduce((s, [x, y]) => s + (x - meanX) * (y - meanY), 0);
  const denomX = Math.sqrt(pairs.reduce((s, [x]) => s + Math.pow(x - meanX, 2), 0));
  const denomY = Math.sqrt(pairs.reduce((s, [, y]) => s + Math.pow(y - meanY, 2), 0));

  if (denomX === 0 || denomY === 0) return null;
  return Number((numerator / (denomX * denomY)).toFixed(4));
}

export function calculateRegression(
  data: Record<string, unknown>[],
  xCol: string,
  yCol: string
): RegressionResult | null {
  const pairs = data
    .map(row => [row[xCol], row[yCol]])
    .filter(([a, b]) => a !== null && b !== null && !isNaN(Number(a)) && !isNaN(Number(b)))
    .map(([a, b]) => [Number(a), Number(b)]);

  if (pairs.length < 3) return null;

  const n = pairs.length;
  const meanX = pairs.reduce((s, [x]) => s + x, 0) / n;
  const meanY = pairs.reduce((s, [, y]) => s + y, 0) / n;

  const numerator = pairs.reduce((s, [x, y]) => s + (x - meanX) * (y - meanY), 0);
  const denominator = pairs.reduce((s, [x]) => s + Math.pow(x - meanX, 2), 0);

  if (denominator === 0) return null;

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  const yPred = pairs.map(([x]) => slope * x + intercept);
  const ssTot = pairs.reduce((s, [, y]) => s + Math.pow(y - meanY, 2), 0);
  const ssRes = pairs.reduce((s, [, y], i) => s + Math.pow(y - yPred[i], 2), 0);
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return {
    slope: Number(slope.toFixed(4)),
    intercept: Number(intercept.toFixed(4)),
    rSquared: Number(rSquared.toFixed(4)),
    n,
    equation: `y = ${slope.toFixed(4)}x + (${intercept.toFixed(4)})`,
  };
}
