/**
 * Real data-skipping arithmetic on a small 2-D table.
 *
 * The table has one row per cell of an N×N grid: x = customer bucket,
 * y = order date. A layout is an order in which rows are written; files are
 * consecutive runs of `rowsPerFile` rows in that order. Each file's min/max
 * (its bounding box) decides whether a query can skip it, exactly as table
 * formats do with per-file column statistics.
 */

export const N = 32; // grid is N × N = 1,024 rows

export type LayoutId = "arrival" | "sort-x" | "sort-y" | "zorder" | "hilbert";

export const LAYOUTS: { id: LayoutId; label: string; note: string }[] = [
  { id: "arrival", label: "Arrival order", note: "Rows land in whatever order they arrive." },
  { id: "sort-x", label: "Sort by customer", note: "One long sort: customer first." },
  { id: "sort-y", label: "Sort by date", note: "One long sort: date first." },
  { id: "zorder", label: "Z-order", note: "Interleave the bits of both columns." },
  { id: "hilbert", label: "Hilbert", note: "A curve that never jumps far." },
];

export interface Cell {
  x: number;
  y: number;
}

/** Morton (Z-order) index: interleave the bits of x and y. */
export function morton(x: number, y: number) {
  let z = 0;
  for (let i = 0; i < 16; i++) {
    z |= ((x >> i) & 1) << (2 * i);
    z |= ((y >> i) & 1) << (2 * i + 1);
  }
  return z;
}

/** Hilbert index of (x, y) on an n×n grid (n a power of two). */
export function hilbert(n: number, x: number, y: number) {
  let d = 0;
  for (let s = n / 2; s > 0; s = Math.floor(s / 2)) {
    const rx = (x & s) > 0 ? 1 : 0;
    const ry = (y & s) > 0 ? 1 : 0;
    d += s * s * ((3 * rx) ^ ry);
    // rotate
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      const t = x;
      x = y;
      y = t;
    }
  }
  return d;
}

/** Deterministic pseudo-random permutation for the "arrival" layout. */
function seededShuffle<T>(items: T[], seed = 7): T[] {
  const a = items.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ALL: Cell[] = Array.from({ length: N * N }, (_, i) => ({ x: i % N, y: Math.floor(i / N) }));

export function order(layout: LayoutId): Cell[] {
  switch (layout) {
    case "arrival":
      return seededShuffle(ALL);
    case "sort-x":
      return ALL.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    case "sort-y":
      return ALL.slice().sort((a, b) => a.y - b.y || a.x - b.x);
    case "zorder":
      return ALL.slice().sort((a, b) => morton(a.x, a.y) - morton(b.x, b.y));
    case "hilbert":
      return ALL.slice().sort((a, b) => hilbert(N, a.x, a.y) - hilbert(N, b.x, b.y));
  }
}

export interface FileBox {
  index: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  cells: Cell[];
}

export function files(layout: LayoutId, rowsPerFile: number): FileBox[] {
  const cells = order(layout);
  const out: FileBox[] = [];
  for (let i = 0; i < cells.length; i += rowsPerFile) {
    const chunk = cells.slice(i, i + rowsPerFile);
    out.push({
      index: out.length,
      minX: Math.min(...chunk.map((c) => c.x)),
      maxX: Math.max(...chunk.map((c) => c.x)),
      minY: Math.min(...chunk.map((c) => c.y)),
      maxY: Math.max(...chunk.map((c) => c.y)),
      cells: chunk,
    });
  }
  return out;
}

export interface Query {
  id: string;
  label: string;
  sql: string;
  x: [number, number] | null;
  y: [number, number] | null;
}

export const QUERIES: Query[] = [
  {
    id: "customer",
    label: "A few customers",
    sql: "WHERE customer BETWEEN 12 AND 14",
    x: [12, 14],
    y: null,
  },
  {
    id: "week",
    label: "One week",
    sql: "WHERE order_date BETWEEN day 20 AND day 26",
    x: null,
    y: [20, 26],
  },
  {
    id: "both",
    label: "Both at once",
    sql: "WHERE customer BETWEEN 4 AND 9\n  AND order_date BETWEEN day 3 AND day 8",
    x: [4, 9],
    y: [3, 8],
  },
];

/** Can this file contain matching rows, judging only by its min/max? */
export function mightMatch(f: FileBox, q: Query) {
  const okX = !q.x || (f.maxX >= q.x[0] && f.minX <= q.x[1]);
  const okY = !q.y || (f.maxY >= q.y[0] && f.minY <= q.y[1]);
  return okX && okY;
}

export function matches(c: Cell, q: Query) {
  return (!q.x || (c.x >= q.x[0] && c.x <= q.x[1])) && (!q.y || (c.y >= q.y[0] && c.y <= q.y[1]));
}

export function scan(layout: LayoutId, rowsPerFile: number, q: Query) {
  const fs = files(layout, rowsPerFile);
  const read = fs.filter((f) => mightMatch(f, q));
  const rowsRead = read.reduce((n, f) => n + f.cells.length, 0);
  const rowsMatching = fs.reduce((n, f) => n + f.cells.filter((c) => matches(c, q)).length, 0);
  // Files that were read but held no matching row: wasted by coarse min/max boxes.
  const wasted = read.filter((f) => !f.cells.some((c) => matches(c, q))).length;
  return {
    files: fs,
    read,
    filesRead: read.length,
    total: fs.length,
    rowsRead,
    rowsMatching,
    wasted,
  };
}
