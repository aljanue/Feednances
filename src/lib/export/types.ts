export type ExportFormat = "csv" | "pdf" | "json";

export interface ExportColumn<T> {
  header: string;
  key: keyof T | string;
  width?: number;
}

export interface ExportData<T> {
  title: string;
  filename: string;
  columns: ExportColumn<T>[];
  data: T[];
  summary?: Record<string, string | number>;
  images?: { dataUrl: string; label?: string }[];
}
