/**
 * A tiny browser with three pages of a made-up café site, navigated three ways. Timings are
 * illustrative.
 */

export type Mode = "mpa" | "broken" | "spa";

export const MODES: { id: Mode; label: string }[] = [
  { id: "mpa", label: "Full page loads" },
  { id: "broken", label: "SPA, no history" },
  { id: "spa", label: "SPA, done right" },
];

export const PAGES: Record<string, { title: string; body: string }> = {
  "/": { title: "Chai Corner", body: "Welcome. Fresh chai since this morning." },
  "/menu": { title: "Menu · Chai Corner", body: "Masala chai · Ginger chai · Samosa · Lassi" },
  "/menu/chai": { title: "Masala chai · Chai Corner", body: "Spiced, milky, ₹40." },
};

export interface Sim {
  url: string;
  shown: string;
  stack: string[];
  idx: number;
  scroll: Record<string, number>;
  log: string[];
  left: boolean;
}

export const START: Sim = {
  url: "/",
  shown: "/",
  stack: ["/"],
  idx: 0,
  scroll: { "/": 0 },
  log: [],
  left: false,
};

export function navigate(s: Sim, mode: Mode, to: string): Sim {
  if (s.left) return s;
  if (mode === "mpa")
    return {
      ...s,
      url: to,
      shown: to,
      stack: [...s.stack.slice(0, s.idx + 1), to],
      idx: s.idx + 1,
      scroll: { ...s.scroll, [to]: 0 },
      log: [
        ...s.log,
        `GET ${to}: the whole page reloads (blank flash, ~400 ms), scripts start again`,
      ],
    };
  if (mode === "broken")
    return {
      ...s,
      shown: to,
      scroll: { ...s.scroll, [to]: 0 },
      log: [
        ...s.log,
        `Content swapped instantly, but the address bar still says ${s.url} and no history entry was added`,
      ],
    };
  return {
    ...s,
    url: to,
    shown: to,
    stack: [...s.stack.slice(0, s.idx + 1), to],
    idx: s.idx + 1,
    scroll: { ...s.scroll, [to]: 0 },
    log: [
      ...s.log,
      `pushState ${to}: content swapped instantly, title updated, focus moved to the new heading`,
    ],
  };
}

export function scroll(s: Sim): Sim {
  if (s.left) return s;
  return {
    ...s,
    scroll: { ...s.scroll, [s.shown]: 600 },
    log: [...s.log, `Scrolled down the ${s.shown} page`],
  };
}

export function back(s: Sim, mode: Mode): Sim {
  if (s.left) return s;
  if (mode === "broken" || s.idx === 0)
    return {
      ...s,
      left: true,
      log: [...s.log, "Back: the browser had no app history, so it left the site entirely"],
    };
  const to = s.stack[s.idx - 1];
  const restored = mode === "spa" ? (s.scroll[to] ?? 0) : (s.scroll[to] ?? 0);
  return {
    ...s,
    url: to,
    shown: to,
    idx: s.idx - 1,
    log: [
      ...s.log,
      mode === "mpa"
        ? `Back: ${to} reloads (or comes from the back/forward cache), scroll ${restored ? "restored" : "at top"}`
        : `popstate: ${to} shown instantly, scroll restored to where you were`,
    ],
  };
}
