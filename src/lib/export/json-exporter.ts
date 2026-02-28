import { IExporter } from "./exporter.interface";
import { ExportData } from "./types";

export class JsonExporter<T> implements IExporter<T> {
  async export(data: ExportData<T>): Promise<void> {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${data.filename}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
