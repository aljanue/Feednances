import { ExportData } from "./types";

export interface IExporter<T> {
  export(data: ExportData<T>): Promise<void>;
}
