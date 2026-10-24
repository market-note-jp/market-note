export type PriceRow = { date: string; code: string; name?: string; adjusted_close: number | string };
export type BreadthRow = {
  date: string; ew: number; return: number | null; median: number | null;
  advanceRatio: number | null; aboveMA25: number | null; advancers: number | null;
  decliners: number | null; unchanged: number | null; count: number; maEligible: number;
};
export type StockRow = { code: string; name: string; close: number; return: number | null; aboveMA25: boolean | null };
export type Analysis = { series: BreadthRow[]; stocks: StockRow[]; count: number; complete: boolean; adjustment: string; universe: string };
export function parseCSV(input: string): Record<string, string>[];
export function analyzePrices(rows: PriceRow[], options?: { expectedCount?: number; adjustment?: string; universe?: string }): Analysis;
export function scaleIndex(series: BreadthRow[], baseValue?: number): { baseDate: string; baseValue: number; series: (BreadthRow & {level: number; pointChange: number | null})[] };
