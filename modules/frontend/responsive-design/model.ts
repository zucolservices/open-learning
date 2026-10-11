/** Responsive fixes for a made-up shop listing, previewed at several screen widths. */

export const WIDTHS = [320, 480, 768, 1024, 1280];

export const FIXES: { id: string; label: string; css: string; note: string }[] = [
  {
    id: "meta",
    label: "Viewport meta tag",
    css: '<meta name="viewport" content="width=device-width, initial-scale=1">',
    note: "Without it, phones pretend to be about 980 pixels wide and shrink the whole page.",
  },
  {
    id: "fluid",
    label: "Fluid grid",
    css: "grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))",
    note: "Columns appear and disappear to fit, instead of a fixed 960-pixel layout.",
  },
  {
    id: "mq",
    label: "Media query for the sidebar",
    css: "@media (width < 768px) { .page { grid-template-columns: 1fr } }",
    note: "On narrow screens the filters move below the products instead of squeezing them.",
  },
  {
    id: "cq",
    label: "Container query for cards",
    css: "@container (width > 260px) { .card { flex-direction: row } }",
    note: "Each card adapts to the space it has, wherever it's placed.",
  },
  {
    id: "clamp",
    label: "Fluid heading size",
    css: "font-size: clamp(1.25rem, 4vw, 2rem)",
    note: "The heading grows and shrinks smoothly between a minimum and a maximum.",
  },
];
