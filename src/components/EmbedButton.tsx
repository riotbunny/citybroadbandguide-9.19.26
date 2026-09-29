"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function EmbedButton({ reportName, reportUrl }: { reportName: string, reportUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const embedCode = `Data provided by <a href="${reportUrl}">${reportName}</a>.`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-full font-medium text-sm transition-colors"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Copied Citation!" : "Cite This Study"}
    </button>
  );
}
