"use client";

import { Download } from "lucide-react";

interface CsvDownloadButtonProps {
  data: Record<string, any>[];
  filename: string;
}

export default function CsvDownloadButton({ data, filename }: CsvDownloadButtonProps) {
  const handleDownload = () => {
    if (!data || data.length === 0) return;

    // Generate CSV headers
    const headers = Object.keys(data[0]).join(",");
    
    // Generate CSV rows
    const rows = data.map(row => {
      return Object.values(row).map(value => {
        // Escape quotes and wrap in quotes for CSV safety
        const safeValue = String(value).replace(/"/g, '""');
        return `"${safeValue}"`;
      }).join(",");
    }).join("\n");

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={handleDownload}
      className="flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-full font-medium text-sm transition-colors"
    >
      <Download size={16} />
      Download Raw Data (CSV)
    </button>
  );
}
