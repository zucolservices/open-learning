/** A made-up app's first-load JavaScript and four ways to shrink it. Sizes and times are illustrative. */

export const CHUNKS: { id: string; label: string; kb: number; cls: string }[] = [
  { id: "framework", label: "Framework", kb: 80, cls: "bg-viz-idle/60" },
  { id: "app", label: "Your app code", kb: 120, cls: "bg-viz-data/60" },
  { id: "dates", label: "Date library + every locale", kb: 230, cls: "bg-viz-meta/60" },
  { id: "charts", label: "Charting library", kb: 180, cls: "bg-viz-compute/60" },
  { id: "icons", label: "Whole icon set", kb: 140, cls: "bg-bad/40" },
  { id: "utils", label: "Utility library (CommonJS)", kb: 70, cls: "bg-good/40" },
];

export const FIXES: { id: string; label: string; affects: string; saves: number; note: string }[] =
  [
    {
      id: "split",
      label: "Load charts only on the Reports page",
      affects: "charts",
      saves: 180,
      note: "Code splitting: a dynamic import() puts the charts in a separate file fetched when someone opens Reports.",
    },
    {
      id: "intl",
      label: "Use the browser's Intl for dates",
      affects: "dates",
      saves: 210,
      note: "The built-in Intl API formats dates and numbers in any language; a small helper replaces the big library.",
    },
    {
      id: "icons",
      label: "Import only the 6 icons you use",
      affects: "icons",
      saves: 130,
      note: "Named imports from an ES-module icon package let tree shaking drop the rest.",
    },
    {
      id: "esm",
      label: "Switch to the utility library's ES-module build",
      affects: "utils",
      saves: 60,
      note: "Tree shaking needs import/export; the CommonJS build was included whole.",
    },
  ];

export function ms(kb: number, budget: boolean) {
  return Math.round(kb * (budget ? 4.2 : 1.1));
}
