/**
 * The browser's rendering pipeline, the work each kind of CSS change triggers, and how script
 * loading attributes affect parsing. Timings are illustrative.
 */

export type Stage = "style" | "layout" | "paint" | "composite";

export const STAGES: { id: Stage; label: string; desc: string }[] = [
  { id: "style", label: "Style", desc: "Work out which CSS rules apply to each element." },
  { id: "layout", label: "Layout", desc: "Calculate every box's size and position." },
  { id: "paint", label: "Paint", desc: "Fill in pixels: text, colours, borders, images." },
  { id: "composite", label: "Composite", desc: "Stack the painted layers into the final picture." },
];

export const CHANGES: { id: string; css: string; stages: Stage[]; note: string }[] = [
  {
    id: "width",
    css: "width: 320px → 360px",
    stages: ["style", "layout", "paint", "composite"],
    note: "Size changes move other boxes too, so the browser redoes layout, then paints and composites.",
  },
  {
    id: "font",
    css: "font-size: 16px → 18px",
    stages: ["style", "layout", "paint", "composite"],
    note: "Bigger text takes more room, so layout runs again for this box and its neighbours.",
  },
  {
    id: "color",
    css: "color: grey → violet",
    stages: ["style", "paint", "composite"],
    note: "Nothing moves, so layout is skipped. Only paint and composite run.",
  },
  {
    id: "transform",
    css: "transform: translateX(40px)",
    stages: ["style", "composite"],
    note: "On its own layer, a transform can be handled at the composite step alone, often off the main thread. That's why animations use transform and opacity.",
  },
  {
    id: "opacity",
    css: "opacity: 1 → 0.5",
    stages: ["style", "composite"],
    note: "Like transform, opacity on its own layer only needs compositing.",
  },
];

export type ScriptMode = "blocking" | "defer" | "async";

export const SCRIPT_MODES: {
  id: ScriptMode;
  label: string;
  parse: [number, number][];
  fetch: [number, number];
  run: [number, number];
  note: string;
}[] = [
  {
    id: "blocking",
    label: "<script>",
    parse: [
      [0, 30],
      [70, 100],
    ],
    fetch: [30, 55],
    run: [55, 70],
    note: "Parsing stops while the script downloads and runs. The page appears later.",
  },
  {
    id: "defer",
    label: "<script defer>",
    parse: [[0, 70]],
    fetch: [20, 45],
    run: [70, 85],
    note: "Downloads in parallel and runs after parsing, in order. Usually the best default; module scripts behave like this already.",
  },
  {
    id: "async",
    label: "<script async>",
    parse: [
      [0, 45],
      [60, 85],
    ],
    fetch: [20, 45],
    run: [45, 60],
    note: "Downloads in parallel and runs as soon as it arrives, pausing parsing briefly. Order isn't guaranteed: good for independent scripts like analytics.",
  },
];
