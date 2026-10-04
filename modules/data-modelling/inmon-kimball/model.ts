/** Two ways to build one retailer's warehouse over a year. Timings are illustrative. */

export const MONTHS = 12;

export interface Piece {
  name: string;
  start: number;
  end: number;
  kind: "edw" | "mart" | "star" | "dims";
}

export const INMON: Piece[] = [
  { name: "Model the enterprise in 3NF", start: 0, end: 3, kind: "edw" },
  { name: "Load all sources into the EDW", start: 2, end: 7, kind: "edw" },
  { name: "Sales mart", start: 7, end: 8, kind: "mart" },
  { name: "Finance mart", start: 8, end: 10, kind: "mart" },
  { name: "Supply-chain mart", start: 10, end: 12, kind: "mart" },
];

export const KIMBALL: Piece[] = [
  { name: "Conformed dims: date, product, store", start: 0, end: 2, kind: "dims" },
  { name: "Sales star", start: 1, end: 3, kind: "star" },
  { name: "Inventory star", start: 3, end: 5, kind: "star" },
  { name: "Purchasing star", start: 5, end: 8, kind: "star" },
  { name: "Returns star", start: 8, end: 10, kind: "star" },
];

export const firstReport = (ps: Piece[]) =>
  Math.min(...ps.filter((p) => p.kind === "mart" || p.kind === "star").map((p) => p.end));

export const PROPS: [string, string, string][] = [
  [
    "Subject-oriented",
    "Organised around subjects like customers and products, not around applications.",
    "One customer table, not one per app.",
  ],
  [
    "Integrated",
    "Data from many systems made consistent: same codes, same units, same keys.",
    "Gender as M/F everywhere, not 1/0 here and male/female there.",
  ],
  [
    "Time-variant",
    "Keeps history, so you can ask how things looked at any point.",
    "Last March's prices are still there.",
  ],
  [
    "Non-volatile",
    "Loaded and read, not updated in place by day-to-day transactions.",
    "Corrections arrive as new loads.",
  ],
];

export const TIMELINE: [string, string][] = [
  [
    "1988",
    "Barry Devlin and Paul Murphy (IBM Systems Journal) describe a “business data warehouse”.",
  ],
  ["1992", "Bill Inmon, Building the Data Warehouse."],
  ["1996", "Ralph Kimball, The Data Warehouse Toolkit."],
  ["1998", "Inmon, Imhoff and Sousa, Corporate Information Factory."],
  [
    "2004",
    "Kimball Group, “Differences of Opinion”: the core difference is whether a normalised layer must come first.",
  ],
];
