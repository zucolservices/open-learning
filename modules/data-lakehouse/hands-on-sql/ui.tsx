"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Loader2, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { getDuck, run, type Duck, type QueryResult } from "./duck";

type Status =
  { kind: "loading" } | { kind: "ready"; duck: Duck } | { kind: "error"; message: string };

/** Boots DuckDB (once per page) and reports progress. */
export function useDuck() {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const start = useCallback(() => {
    setStatus({ kind: "loading" });
    getDuck()
      .then((duck) => setStatus({ kind: "ready", duck }))
      .catch((e: unknown) =>
        setStatus({ kind: "error", message: e instanceof Error ? e.message : String(e) }),
      );
  }, []);
  useEffect(() => {
    let live = true;
    getDuck()
      .then((duck) => live && setStatus({ kind: "ready", duck }))
      .catch(
        (e: unknown) =>
          live && setStatus({ kind: "error", message: e instanceof Error ? e.message : String(e) }),
      );
    return () => {
      live = false;
    };
  }, []);
  return { status, retry: start };
}

export function EngineBadge() {
  const { status, retry } = useDuck();
  if (status.kind === "ready")
    return (
      <p className="text-muted flex items-center gap-2 text-xs">
        <span className="bg-good size-2 rounded-full" /> DuckDB {status.duck.version} running in
        this page
      </p>
    );
  if (status.kind === "error")
    return (
      <div className="border-bad/40 bg-bad/10 flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-xs">
        <AlertTriangle className="text-bad size-4" />
        Couldn&apos;t start DuckDB (it downloads ~8 MB from cdn.jsdelivr.net). {status.message}
        <button
          type="button"
          onClick={retry}
          className="text-accent flex items-center gap-1 font-medium"
        >
          <RotateCcw className="size-3.5" /> Retry
        </button>
      </div>
    );
  return (
    <p className="text-muted flex items-center gap-2 text-xs">
      <Loader2 className="size-3.5 animate-spin" /> Starting DuckDB and writing two Parquet files (a
      few seconds)…
    </p>
  );
}

export function SqlBox({
  value,
  onChange,
  onResult,
  rows = 6,
}: {
  value: string;
  onChange(v: string): void;
  onResult?(r: QueryResult): void;
  rows?: number;
}) {
  const { status } = useDuck();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ready = status.kind === "ready";

  const exec = async () => {
    if (!ready || busy) return;
    setBusy(true);
    setError(null);
    try {
      const r = await run(value);
      setResult(r);
      onResult?.(r);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const explain = result && result.columns.includes("explain_value");

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            void exec();
          }
        }}
        rows={rows}
        spellCheck={false}
        aria-label="SQL editor"
        className="border-line bg-surface-2 focus:border-accent w-full resize-y rounded-xl border px-3 py-2 font-mono text-[12px] leading-relaxed outline-none"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void exec()}
          disabled={!ready || busy}
          className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium disabled:opacity-40"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
          Run
        </button>
        <span className="text-subtle text-xs">⌘/Ctrl + Enter</span>
        {result && (
          <span className="text-muted ml-auto font-mono text-xs">
            {result.total.toLocaleString("en-IN")} row{result.total === 1 ? "" : "s"} ·{" "}
            {result.ms.toFixed(1)} ms
          </span>
        )}
      </div>
      {!ready && <EngineBadge />}
      {error && (
        <pre className="border-bad/40 bg-bad/10 overflow-x-auto rounded-xl border px-3 py-2 font-mono text-[11px] whitespace-pre-wrap">
          {error}
        </pre>
      )}
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={result.ms}>
          {explain ? (
            <pre className="border-line max-h-96 overflow-auto rounded-xl border p-3 font-mono text-[10px] leading-tight">
              {result.rows.map((r) => r[result.columns.indexOf("explain_value")]).join("\n")}
            </pre>
          ) : (
            <div className="border-line max-h-72 overflow-auto rounded-xl border">
              <table className="w-full font-mono text-[11px]">
                <thead className="bg-surface-2 text-muted sticky top-0 text-left">
                  <tr>
                    {result.columns.map((c) => (
                      <th key={c} className="px-2.5 py-1.5 font-normal whitespace-nowrap">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r, i) => (
                    <tr key={i} className="border-line border-t">
                      {r.map((c, j) => (
                        <td
                          key={j}
                          className={cn(
                            "px-2.5 py-1 whitespace-nowrap",
                            c === "NULL" && "text-subtle",
                          )}
                        >
                          {c.length > 60 ? c.slice(0, 60) + "…" : c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {result.total > result.rows.length && (
            <p className="text-subtle mt-1 text-[10px]">
              Showing the first {result.rows.length} rows.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
