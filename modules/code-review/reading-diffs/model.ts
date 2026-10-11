/**
 * Reading a made-up pull request's files in different orders. Attention drains with each file
 * read (an illustrative model of fatigue); the bug in the core file is spotted only if it's read
 * while attention is still high. Inspired by Fregnan et al. (2022) on file position.
 */

export const FILES: { id: string; path: string; lines: number; core?: boolean; note: string }[] = [
  { id: "readme", path: "README.md", lines: 12, note: "A line about the new loyalty endpoint." },
  { id: "config", path: "config.ts", lines: 4, note: "A new setting: POINTS_PER_RUPEES = 10." },
  {
    id: "migration",
    path: "migrations/003_loyalty.sql",
    lines: 30,
    note: "Adds the loyalty table.",
  },
  {
    id: "api",
    path: "src/loyalty.ts",
    lines: 140,
    core: true,
    note: "The heart of the change. Points are added before the payment is confirmed.",
  },
  {
    id: "tests",
    path: "tests/loyalty.test.ts",
    lines: 90,
    note: "Tests describe the intended behaviour: points only for paid orders.",
  },
  { id: "ui", path: "ui/Receipt.tsx", lines: 60, note: "Shows the points on the receipt." },
];

export const DESCRIPTION = "Award loyalty points on paid orders (1 point per ₹10). Closes #510.";

export function attentionAt(position: number, readDescription: boolean): number {
  return Math.max(10, 100 - position * 16 + (readDescription ? 10 : 0));
}

export function spotted(
  order: string[],
  readDescription: boolean,
  readTestsFirst: boolean,
): boolean {
  const pos = order.indexOf("api");
  if (pos < 0) return false;
  const att = attentionAt(pos, readDescription) + (readTestsFirst ? 15 : 0);
  return att >= 60;
}

export const ALPHABETICAL = FILES.map((f) => f.id);
export const SMART = ["tests", "api", "migration", "config", "ui", "readme"];
