"use client";

import { useState, useRef } from "react";
import { Download, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createPrompt } from "@/lib/actions/prompt";

interface ExportablePrompt {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content: string;
  settings: unknown;
  tags: string[];
}

interface ExportImportProps {
  prompts: ExportablePrompt[];
}

export function ExportImport({ prompts }: ExportImportProps) {
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const data = prompts.map(({ id, ...rest }) => rest);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-expert-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${data.length} prompt${data.length !== 1 ? "s" : ""}`);
  };

  const handleExportMarkdown = () => {
    const md = prompts
      .map(
        (p) =>
          `# ${p.title}\n\n${p.description ? `> ${p.description}\n\n` : ""}**Category:** ${p.category}  \n**Tags:** ${p.tags.join(", ") || "none"}\n\n---\n\n\`\`\`\n${p.content}\n\`\`\`\n`,
      )
      .join("\n---\n\n");

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-expert-export-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${prompts.length} prompt${prompts.length !== 1 ? "s" : ""}`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error("Invalid format: expected an array");
      }

      let imported = 0;
      for (const item of data) {
        if (!item.title || !item.content) continue;
        await createPrompt({
          title: item.title,
          description: item.description ?? "",
          category: item.category ?? "instruction",
          content: item.content,
          settings: item.settings ?? {
            model: "gpt-4.1-mini",
            category: item.category ?? "instruction",
            tone: "formal",
            outputFormat: "text",
            includeExamples: false,
            temperature: 0.7,
          },
          tags: item.tags ?? [],
          isPublic: false,
        });
        imported++;
      }

      toast.success(`Imported ${imported} prompt${imported !== 1 ? "s" : ""}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to import prompts",
      );
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" disabled={prompts.length === 0} />
          }
        >
          <Download className="mr-1.5 h-4 w-4" />
          Export
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportJSON}>
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportMarkdown}>
            Export as Markdown
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="sm"
        disabled={importing}
        onClick={() => fileRef.current?.click()}
      >
        {importing ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-1.5 h-4 w-4" />
        )}
        {importing ? "Importing..." : "Import"}
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
}
