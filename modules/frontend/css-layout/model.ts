/** Options for the flexbox and grid sandboxes, and the goals the learner tries to reach. */

export type Dir = "row" | "column";
export type Justify = "flex-start" | "center" | "space-between";
export type Align = "stretch" | "flex-start" | "center";

export const GOALS: {
  id: string;
  text: string;
  met(f: { dir: Dir; justify: Justify; align: Align; gap: number }): boolean;
}[] = [
  {
    id: "spread",
    text: "A toolbar: buttons spread across the row, edge to edge",
    met: (f) => f.dir === "row" && f.justify === "space-between",
  },
  {
    id: "centre",
    text: "Centre the buttons both ways inside the box",
    met: (f) => f.justify === "center" && f.align === "center",
  },
  {
    id: "stack",
    text: "Stack them in a column with space between each",
    met: (f) => f.dir === "column" && f.gap > 0,
  },
];

export const COLUMNS: { id: string; css: string; note: string }[] = [
  { id: "one", css: "1fr", note: "One column: everything stacks. A good phone layout." },
  {
    id: "two",
    css: "repeat(2, 1fr)",
    note: "Two equal columns. fr means a fraction of the free space.",
  },
  { id: "three", css: "repeat(3, 1fr)", note: "Three equal columns." },
  { id: "side", css: "120px 1fr", note: "A fixed sidebar and a flexible main area." },
  {
    id: "auto",
    css: "repeat(auto-fill, minmax(90px, 1fr))",
    note: "As many columns as fit, each at least 90px wide. Responsive without media queries.",
  },
];
