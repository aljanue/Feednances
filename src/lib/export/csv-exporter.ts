import { IExporter } from "./exporter.interface";
import { ExportData } from "./types";

export class CsvExporter<T> implements IExporter<T> {
  async export(data: ExportData<T>): Promise<void> {
    const headers = data.columns.map((col) => col.header).join(",");
    const rows = data.data.map((item: any) => {
      return data.columns
        .map((col) => {
          let value = item[col.key];
          // Escape quotes and handle commas
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${data.filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
