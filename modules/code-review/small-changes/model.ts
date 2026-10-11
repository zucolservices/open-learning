/**
 * A made-up 1,200-line feature split into parts. Keeping parts together or splitting them into a
 * stack changes PR sizes. Waiting time and review depth are illustrative rules of thumb.
 */

export const PARTS: { id: string; label: string; lines: number }[] = [
  { id: "refactor", label: "Rename and tidy the order module (no behaviour change)", lines: 300 },
  { id: "migration", label: "Database migration: add a loyalty table", lines: 150 },
  { id: "api", label: "Loyalty API endpoints", lines: 250 },
  { id: "ui", label: "Points shown on the receipt screen", lines: 350 },
  { id: "tests", label: "Tests for the above", lines: 150 },
];

export interface Pr {
  parts: string[];
  lines: number;
  waitHours: number;
  careful: boolean;
}

/** Each split part becomes its own PR (in order); the rest stay in one PR. */
export function prs(split: string[]): Pr[] {
  const groups: string[][] = [];
  const rest: string[] = [];
  for (const p of PARTS) split.includes(p.id) ? groups.push([p.id]) : rest.push(p.id);
  if (rest.length) groups.push(rest);
  return groups.map((g) => {
    const lines = g.reduce((t, id) => t + PARTS.find((p) => p.id === id)!.lines, 0);
    return {
      parts: g,
      lines,
      waitHours: Math.round(2 + (lines / 100) ** 1.6),
      careful: lines <= 400,
    };
  });
}
