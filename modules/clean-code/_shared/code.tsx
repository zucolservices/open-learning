"use client";

import { cn } from "@/lib/cn";

/**
 * A small code listing for the Clean Code track: optional title, line numbers, and per-line
 * marks ("hot" for the line in focus, "bad"/"good" for before-and-after, "dim" for context).
 * Lines can be clicked when `onLine` is given.
 */
export type Mark = "hot" | "bad" | "good" | "dim";

export function Code({
  lines,
  title,
  marks = {},
  onLine,
  numbers = true,
  className,
}: {
  lines: string[];
  title?: string;
  marks?: Record<number, Mark>;
  onLine?(i: number): void;
  numbers?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-line bg-surface overflow-x-auto rounded-lg border py-2 font-mono text-[10.5px]",
        className,
      )}
    >
      {title && <p className="text-muted mb-1 px-3 font-sans text-[10px]">{title}</p>}
      {lines.map((l, i) => {
        const m = marks[i];
        const Row = onLine ? "button" : "div";
        return (
          <Row
            key={i}
            type={onLine ? "button" : undefined}
            onClick={onLine ? () => onLine(i) : undefined}
            className={cn(
              "flex w-full items-start gap-2 px-3 text-left",
              onLine && "hover:bg-surface-2",
              m === "hot" && "bg-accent/15",
              m === "bad" && "bg-bad/15",
              m === "good" && "bg-good/15",
              m === "dim" && "opacity-40",
            )}
          >
            {numbers && (
              <span className="text-subtle w-5 shrink-0 text-right select-none">{i + 1}</span>
            )}
            <pre className="whitespace-pre">{l || " "}</pre>
          </Row>
        );
      })}
    </div>
  );
}
