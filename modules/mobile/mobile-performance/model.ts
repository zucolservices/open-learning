/** A slow-starting, janky café app: launch work and scroll frames, before and after fixes (illustrative). */

export type Fix = "defer" | "cache" | "images" | "profile" | "rows";

export const FIXES: [Fix, string, string][] = [
  [
    "defer",
    "Start SDKs after the first frame",
    "Analytics and ads can wait until the menu is on screen.",
  ],
  [
    "cache",
    "Show the cached menu first",
    "Draw from the local database; refresh from the network in the background.",
  ],
  [
    "images",
    "Downsample images, decode off the main thread",
    "Decode thumbnail-sized pictures, and only for rows on screen.",
  ],
  [
    "profile",
    "Ship a Baseline Profile",
    "Precompile start-up code paths so they don't run slowly at first.",
  ],
  [
    "rows",
    "Lighter rows in a lazy list",
    "Fewer nested layouts, stable ids, only visible rows built.",
  ],
];

export interface Task {
  label: string;
  ms: number;
  code: boolean;
}

export function launch(f: Set<Fix>): { tasks: (Task & { deferred: boolean })[]; total: number } {
  const tasks = [
    { label: "Initialise analytics SDK", ms: 700, code: true, deferred: f.has("defer") },
    { label: "Initialise ads SDK", ms: 600, code: true, deferred: f.has("defer") },
    {
      label: f.has("cache") ? "Read menu from local database" : "Fetch menu from the network",
      ms: f.has("cache") ? 60 : 2200,
      code: false,
      deferred: false,
    },
    { label: "Decode dish images", ms: f.has("images") ? 120 : 900, code: true, deferred: false },
    { label: "Open database", ms: 400, code: true, deferred: false },
    { label: "Lay out and draw first screen", ms: 300, code: true, deferred: false },
  ].map((t) => ({ ...t, ms: t.code && f.has("profile") ? Math.round(t.ms * 0.7) : t.ms }));
  return { tasks, total: tasks.filter((t) => !t.deferred).reduce((a, t) => a + t.ms, 0) };
}

export const BUDGET = 8.3;

/** Frame times (ms) for 40 frames of scrolling on a 120 Hz screen. */
export function frames(f: Set<Fix>) {
  return Array.from({ length: 40 }, (_, i) => {
    const base = f.has("rows") ? 4.5 + (i % 3) * 0.6 : 11 + (i % 3) * 1.5;
    const spike = !f.has("images") && i % 4 === 2 ? 34 : 0;
    return Math.round((base + spike) * 10) / 10;
  });
}
