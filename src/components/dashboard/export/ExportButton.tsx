"use client";

import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportData, ExportFormat } from "@/lib/export/types";
import { ExportFactory } from "@/lib/export/export-factory";
import { toast } from "sonner";
import { useState } from "react";

interface ExportButtonProps<T> {
  data: ExportData<T>;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ExportButton<T>({ data, variant = "outline", size = "default" }: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    const toastId = toast.loading(`Preparing ${format.toUpperCase()} export...`);
    
    try {
      const exporter = ExportFactory.getExporter<T>(format);
      await exporter.export(data);
      toast.success("Export successful!", { id: toastId });
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting} className="gap-2">
          <Download className="size-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-muted-foreground/20">
        <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2 cursor-pointer">
          <FileText className="size-4 text-rose-500" />
          <span>Professional PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="size-4 text-emerald-500" />
          <span>Excel (CSV)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")} className="gap-2 cursor-pointer">
          <FileJson className="size-4 text-blue-500" />
          <span>JSON Data</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
