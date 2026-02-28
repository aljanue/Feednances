import { IExporter } from "./exporter.interface";
import { ExportFormat } from "./types";
import { CsvExporter } from "./csv-exporter";
import { PdfExporter } from "./pdf-exporter";
import { JsonExporter } from "./json-exporter";

export class ExportFactory {
  static getExporter<T>(format: ExportFormat): IExporter<T> {
    switch (format) {
      case "csv":
        return new CsvExporter<T>();
      case "pdf":
        return new PdfExporter<T>();
      case "json":
        return new JsonExporter<T>();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
}
