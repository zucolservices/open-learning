/** Android window size classes by width (dp), and the layout each one suits. */

export type SizeClass = "compact" | "medium" | "expanded" | "large";

export function sizeClass(dp: number): SizeClass {
  if (dp < 600) return "compact";
  if (dp < 840) return "medium";
  if (dp < 1200) return "expanded";
  return "large";
}

export const LAYOUT: Record<SizeClass, { nav: string; panes: string; range: string }> = {
  compact: {
    nav: "Bottom bar",
    panes: "One pane: list, then detail on its own screen",
    range: "under 600 dp",
  },
  medium: {
    nav: "Navigation rail",
    panes: "One wide pane, or list and detail side by side",
    range: "600–839 dp",
  },
  expanded: { nav: "Navigation rail", panes: "List and detail side by side", range: "840–1199 dp" },
  large: {
    nav: "Navigation drawer",
    panes: "List, detail and a supporting pane",
    range: "1200 dp and up",
  },
};

export const PRESETS: [string, number][] = [
  ["Small phone", 360],
  ["Large phone", 430],
  ["Tablet, split screen", 500],
  ["Foldable, open", 700],
  ["Tablet", 1000],
  ["Desktop window", 1280],
];
