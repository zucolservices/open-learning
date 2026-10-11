"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A small pull-request diff for the Code Review track: added, removed and unchanged lines with
 * line numbers, optional inline comment threads, and clickable lines when `onLine` is given.
 */
export interface DiffLine {
  kind: "add" | "del" | "ctx";
  text: string;
}

export function Diff({
  path,
  lines,
  comments = {},
  onLine,
  selected,
  className,
}: {
  path: string;
  lines: DiffLine[];
  comments?: Record<number, ReactNode>;
  onLine?(i: number): void;
  selected?: number[];
  className?: string;
}) {
  let oldN = 0;
  let newN = 0;
  return (
    <div
      className={cn(
        "border-line bg-surface overflow-hidden rounded-lg border font-mono text-[10.5px]",
        className,
      )}
    >
      <p className="border-line bg-surface-2 border-b px-3 py-1 font-sans text-[10px] font-medium">
        {path}
      </p>
      <div className="overflow-x-auto py-1">
        {lines.map((l, i) => {
          if (l.kind !== "add") oldN++;
          if (l.kind !== "del") newN++;
          const Row = onLine ? "button" : "div";
          return (
            <div key={i}>
              <Row
                type={onLine ? "button" : undefined}
                onClick={onLine ? () => onLine(i) : undefined}
                className={cn(
                  "flex w-full items-start gap-2 px-2 text-left",
                  l.kind === "add" && "bg-good/10",
                  l.kind === "del" && "bg-bad/10",
                  onLine && "hover:bg-surface-2",
                  selected?.includes(i) && "ring-accent ring-1 ring-inset",
                )}
              >
                <span className="text-subtle w-5 shrink-0 text-right select-none">
                  {l.kind === "add" ? "" : oldN}
                </span>
                <span className="text-subtle w-5 shrink-0 text-right select-none">
                  {l.kind === "del" ? "" : newN}
                </span>
                <span
                  className={cn(
                    "w-3 shrink-0 select-none",
                    l.kind === "add" ? "text-good" : l.kind === "del" ? "text-bad" : "text-subtle",
                  )}
                >
                  {l.kind === "add" ? "+" : l.kind === "del" ? "−" : " "}
                </span>
                <pre className="whitespace-pre">{l.text || " "}</pre>
              </Row>
              {comments[i] && (
                <div className="border-line bg-surface-2 mx-2 my-1 rounded-md border px-3 py-1.5 font-sans text-[11px]">
                  {comments[i]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Build diff lines from a compact string: lines starting with "+", "-" or " ". */
export function parseDiff(src: string[]): DiffLine[] {
  return src.map((s) => ({
    kind: s[0] === "+" ? "add" : s[0] === "-" ? "del" : "ctx",
    text: s.slice(1),
  }));
}
