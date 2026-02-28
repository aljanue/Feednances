import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { IExporter } from "./exporter.interface";
import { ExportData } from "./types";
import { format } from "date-fns";

export class PdfExporter<T> implements IExporter<T> {
  async export(data: ExportData<T>): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    // Brand Color (Feednances Primary Green)
    doc.setFillColor(43, 238, 108); // #2bee6c
    doc.rect(0, 0, pageWidth, 40, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(10, 12, 10); // Darker tone for contrast on green
    doc.text("Feednances", 14, 22);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(data.title.toUpperCase(), 14, 32);

    // Meta-info
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const dateStr = format(new Date(), "PPP");
    doc.text(`Report Date: ${dateStr}`, pageWidth - 14, 32, { align: "right" });

    // --- Summary Section ---
    let finalY = 45;
    if (data.summary) {
        // Subtle background for summary
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, 48, pageWidth - 28, (Object.keys(data.summary).length * 8) + 10, 2, 2, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(10, 12, 10);
        doc.text("EXECUTIVE SUMMARY", 20, 58);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        let summaryY = 68;
        Object.entries(data.summary).forEach(([key, value]) => {
            doc.setTextColor(100, 116, 139);
            doc.text(`${key}:`, 20, summaryY);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(10, 12, 10);
            doc.text(String(value), 70, summaryY);
            doc.setFont("helvetica", "normal");
            summaryY += 8;
        });
        finalY = summaryY + 10;
    }

    // --- Table ---
    const headers = data.columns.map((col) => col.header.toUpperCase());
    const body = data.data.map((item: any) =>
      data.columns.map((col) => String(item[col.key] || ""))
    );

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: finalY,
      styles: {
        fontSize: 9,
        cellPadding: 4,
        font: "helvetica",
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: [10, 12, 10], // Matches platform dark background
        textColor: [43, 238, 108], // Matches platform primary green
        fontStyle: "bold",
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        // Right-align numeric columns if they contain currency-like string
        ...data.columns.reduce((acc: any, col, idx) => {
            if (col.header.toLowerCase().includes("amount") || col.header.toLowerCase().includes("value")) {
                acc[idx] = { halign: 'right' };
            }
            return acc;
        }, {})
      },
      margin: { left: 14, right: 14 },
    });

    // --- Footer ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    doc.save(`${data.filename}.pdf`);
  }
}
