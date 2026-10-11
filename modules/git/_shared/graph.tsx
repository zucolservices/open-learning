"use client";

import { cn } from "@/lib/cn";
import { currentBranch, headCommit, reachable, type Repo } from "./repo";

/**
 * Draws a Repo as a commit graph: commits left to right in creation order, one lane per branch,
 * branch labels at their tips and a HEAD marker. Unreachable commits are faded (or hidden).
 */
export function CommitGraph({
  repo,
  highlight = [],
  showUnreachable = true,
  onCommit,
  className,
  height,
}: {
  repo: Repo;
  highlight?: string[];
  showUnreachable?: boolean;
  onCommit?(id: string): void;
  className?: string;
  height?: number;
}) {
  const live = reachable(repo);
  const all = Object.values(repo.commits)
    .filter((c) => showUnreachable || live.has(c.id))
    .sort((a, b) => a.seq - b.seq);
  const lanes = Math.max(0, ...all.map((c) => c.lane)) + 1;
  const X0 = 24;
  const DX = 46;
  const Y0 = 44;
  const DY = 44;
  const xs: Record<string, number> = {};
  all.forEach((c, i) => (xs[c.id] = X0 + i * DX));
  const pos = (id: string) => ({ x: xs[id], y: Y0 + repo.commits[id].lane * DY });
  const W = X0 * 2 + Math.max(1, all.length - 1) * DX + 130;
  const H = height ?? Y0 + lanes * DY + 6;
  const head = headCommit(repo);
  const cur = currentBranch(repo);
  const labels: Record<string, string[]> = {};
  for (const [b, id] of Object.entries(repo.branches)) (labels[id] ??= []).push(b);
  return (
    <div className={cn("overflow-x-auto", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={Math.round(W * 1.7)}
        className="mx-auto h-auto max-w-none sm:max-w-full"
        fill="none"
      >
        {all.flatMap((c) =>
          c.parents
            .filter((p) => xs[p] !== undefined)
            .map((p) => {
              const a = pos(p);
              const b = pos(c.id);
              const mid = (a.x + b.x) / 2;
              return (
                <path
                  key={`${p}-${c.id}`}
                  d={`M${a.x} ${a.y} C${mid} ${a.y} ${mid} ${b.y} ${b.x} ${b.y}`}
                  className={live.has(c.id) ? "stroke-line-strong" : "stroke-line"}
                  strokeWidth={1.6}
                  strokeDasharray={live.has(c.id) ? undefined : "3 3"}
                />
              );
            }),
        )}
        {all.map((c) => {
          const { x, y } = pos(c.id);
          const hot = highlight.includes(c.id);
          const isHead = c.id === head;
          const gone = !live.has(c.id);
          return (
            <g
              key={c.id}
              onClick={onCommit ? () => onCommit(c.id) : undefined}
              style={onCommit ? { cursor: "pointer" } : undefined}
              opacity={gone ? 0.35 : 1}
            >
              <title>{`${c.id} ${c.msg}`}</title>
              <circle cx={x} cy={y} r={9} className="fill-surface" />
              <circle
                cx={x}
                cy={y}
                r={9}
                className={cn(
                  hot
                    ? "fill-accent stroke-accent"
                    : c.parents.length > 1
                      ? "fill-viz-meta/30 stroke-viz-meta"
                      : "fill-viz-data/30 stroke-viz-data",
                  isHead && "stroke-fg",
                )}
                strokeWidth={isHead ? 2.4 : 1.4}
              />
              <text
                x={x}
                y={y + 22}
                textAnchor="middle"
                className="fill-subtle font-mono text-[8px]"
              >
                {c.id.slice(0, 5)}
              </text>
              {(labels[c.id] ?? []).map((b, i) => (
                <g key={b} transform={`translate(${x + 6}, ${y - 30 - i * 13})`}>
                  <rect
                    width={b.length * 5.2 + (b === cur ? 34 : 9)}
                    height={11}
                    rx={3}
                    className={b === cur ? "fill-accent" : "fill-surface-2 stroke-line-strong"}
                    strokeWidth={0.8}
                  />
                  <text
                    x={4}
                    y={8.3}
                    className={cn("font-mono text-[8px]", b === cur ? "fill-accent-fg" : "fill-fg")}
                  >
                    {b === cur ? `HEAD→${b}` : b}
                  </text>
                </g>
              ))}
              {isHead && !cur && (
                <g transform={`translate(${x + 6}, ${y - 30})`}>
                  <rect width={34} height={11} rx={3} className="fill-bad" />
                  <text x={4} y={8.3} className="fill-accent-fg font-mono text-[8px]">
                    HEAD
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
