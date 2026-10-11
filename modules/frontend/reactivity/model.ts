/**
 * One counter on a page of 28 components, updated three ways. Work counts are illustrative of
 * each approach, not benchmarks.
 */

export type Mode = "diff" | "signals" | "compiled";

export const NODES: { id: string; label: string; depth: number }[] = [
  { id: "app", label: "App", depth: 0 },
  { id: "header", label: "Header", depth: 1 },
  { id: "counter", label: "Count", depth: 1 },
  { id: "label", label: "Label", depth: 2 },
  { id: "value", label: "Value", depth: 2 },
  { id: "button", label: "Button", depth: 2 },
  { id: "list", label: "List", depth: 1 },
  ...Array.from({ length: 20 }, (_, i) => ({ id: `item${i}`, label: `Item`, depth: 2 })),
  { id: "footer", label: "Footer", depth: 1 },
];

export function work(mode: Mode, compiler: boolean) {
  if (mode === "diff") {
    const reran = compiler ? ["app", "counter", "value"] : NODES.map((n) => n.id);
    return { reran, compared: reran.length, writes: 1, updated: ["value"] };
  }
  return { reran: [] as string[], compared: 0, writes: 1, updated: ["value"] };
}

export const MODES: { id: Mode; label: string; who: string; how: string }[] = [
  {
    id: "diff",
    label: "Re-render and diff",
    who: "React",
    how: "The state lives in App, so App and everything inside it runs again. React compares the new tree with the old one and changes only the one text node that differs.",
  },
  {
    id: "signals",
    label: "Signals",
    who: "Solid, Preact Signals, Angular, Vue",
    how: "Only the text that read the count subscribed to it. Changing the count updates that one spot; no components run again.",
  },
  {
    id: "compiled",
    label: "Compiled",
    who: "Svelte 5, Vue Vapor (preview)",
    how: "At build time the compiler turned the component into code that updates exactly that text node when the count changes.",
  },
];

export const FAMILIES: { name: string; frameworks: string; note: string }[] = [
  {
    name: "Re-render and diff",
    frameworks: "React 19 (with React Compiler 1.0, Oct 2025)",
    note: "Simple mental model: the UI is a function of state. The compiler skips work whose inputs didn't change, but React still renders and compares.",
  },
  {
    name: "Fine-grained signals",
    frameworks:
      "Solid 1.9 (2.0 in release candidate), Preact Signals, Angular signals (zoneless by default since v21), Vue refs",
    note: "Components often run once; updates go straight to the parts that read a value.",
  },
  {
    name: "Compile-time",
    frameworks: "Svelte 5 runes; Vue 3.6 Vapor mode (release candidate, opt-in)",
    note: "Signals under the hood, with the wiring generated at build time.",
  },
];
