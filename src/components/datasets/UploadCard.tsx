"use client";

import { useRef, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InlineError } from "@/components/common/PageHeader";
import { CSV_LIMITS } from "@/lib/csvParser";
import { errorMessage } from "@/lib/apiClient";

const MAX_MB = CSV_LIMITS.maxBytes / (1024 * 1024);

export function UploadCard({
  onUpload,
}: {
  onUpload: (file: File, name?: string) => Promise<{ warnings: string[] }>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function choose(next: File | undefined) {
    setError(null);
    setNotice(null);
    if (!next) return;
    // Quick client-side checks for fast feedback; the server checks again.
    if (!/\.(csv|txt)$/i.test(next.name)) return setError("Choose a .csv file.");
    if (next.size > CSV_LIMITS.maxBytes) return setError(`That file is larger than ${MAX_MB} MB.`);
    setFile(next);
    setName(next.name.replace(/\.(csv|txt)$/i, ""));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { warnings } = await onUpload(file, name);
      setNotice(warnings.length ? `Uploaded with notes: ${warnings.join(" ")}` : `Uploaded "${name || file.name}".`);
      setFile(null);
      setName("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <label
            htmlFor="csv-file"
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              choose(e.dataTransfer.files[0]);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragging ? "border-data-primary bg-data-primary/5" : "hover:bg-muted/50"
            }`}
          >
            {file ? (
              <FileSpreadsheet className="h-8 w-8 text-data-primary" aria-hidden />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" aria-hidden />
            )}
            <span className="font-medium">{file ? file.name : "Drop a CSV here or click to choose"}</span>
            <span className="text-xs text-muted-foreground">
              Up to {MAX_MB} MB and {CSV_LIMITS.maxRows.toLocaleString("en-US")} rows. The first row must be the column names.
            </span>
            <input
              ref={inputRef}
              id="csv-file"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => choose(e.target.files?.[0])}
            />
          </label>

          {file && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1.5">
                <label htmlFor="dataset-name" className="text-sm font-medium">
                  Dataset name
                </label>
                <Input id="dataset-name" value={name} maxLength={120} onChange={(e) => setName(e.target.value)} />
              </div>
              <Button type="submit" disabled={busy} className="bg-data-primary hover:bg-data-primary/90">
                {busy ? "Uploading…" : "Upload"}
              </Button>
            </div>
          )}

          {error && <InlineError>{error}</InlineError>}
          {notice && (
            <p role="status" className="rounded-md bg-data-success/10 px-3 py-2 text-sm text-foreground">
              {notice}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
