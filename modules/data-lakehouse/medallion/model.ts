/**
 * Models for the medallion module. Illustrative numbers, stated in the UI.
 */

/* Replay a bad day ------------------------------------------------------------------------------- */

export const DAYS = ["8 Sep", "9 Sep", "10 Sep", "11 Sep", "12 Sep", "13 Sep", "14 Sep"];
/** True revenue per day, ₹ thousand. */
export const TRUE_REV = [382, 395, 371, 410, 402, 455, 431];
export const BAD_DAY = 4;
/** On the bad day the parser dropped every amount written with a thousands separator. */
export const BUGGY_REV = 251;
export const TRUE_ROWS = 1340;
export const BUGGY_ROWS = 1012;

export type WriteMode = "append" | "overwrite" | "merge";

export interface BackfillResult {
  silverRows: number;
  silverRev: number;
  goldRev: number[]; // what the dashboard shows per day
  correctSilver: boolean;
  correctGold: boolean;
}

/**
 * Re-run the fixed silver job for the bad day `runs` times with a write mode,
 * then optionally rebuild gold (gold always overwrites its day).
 */
export function backfill(mode: WriteMode, runs: number, rerunGold: boolean): BackfillResult {
  let rows = BUGGY_ROWS;
  let rev = BUGGY_REV;
  for (let r = 0; r < runs; r++) {
    if (mode === "append") {
      rows += TRUE_ROWS;
      rev += TRUE_REV[BAD_DAY];
    } else {
      // overwrite replaces the day's partition; merge on order_id updates or inserts each order
      rows = TRUE_ROWS;
      rev = TRUE_REV[BAD_DAY];
    }
  }
  const goldRev = TRUE_REV.map((v, i) =>
    i === BAD_DAY ? (runs > 0 && rerunGold ? rev : BUGGY_REV) : v,
  );
  return {
    silverRows: rows,
    silverRev: rev,
    goldRev,
    correctSilver: rows === TRUE_ROWS,
    correctGold: goldRev[BAD_DAY] === TRUE_REV[BAD_DAY],
  };
}

/* Wire the pipeline ------------------------------------------------------------------------------ */

export type Layer = "bronze" | "silver" | "gold";

export interface PipeNode {
  id: string;
  layer: Layer;
  label: string;
  needs: string[]; // correct inputs
}

export const NODES: PipeNode[] = [
  { id: "b_orders", layer: "bronze", label: "bronze.orders_raw", needs: [] },
  { id: "b_customers", layer: "bronze", label: "bronze.customers_raw", needs: [] },
  { id: "s_orders", layer: "silver", label: "silver.orders", needs: ["b_orders"] },
  { id: "s_customers", layer: "silver", label: "silver.customers", needs: ["b_customers"] },
  {
    id: "g_revenue",
    layer: "gold",
    label: "gold.daily_revenue_by_city",
    needs: ["s_orders", "s_customers"],
  },
  { id: "g_c360", layer: "gold", label: "gold.customer_360", needs: ["s_orders", "s_customers"] },
];

export const nodeById = new Map(NODES.map((n) => [n.id, n]));

/** Which inputs may be offered for a node: anything in an earlier layer. */
export function candidates(n: PipeNode): PipeNode[] {
  const rank = { bronze: 0, silver: 1, gold: 2 };
  return NODES.filter((m) => rank[m.layer] < rank[n.layer]);
}

export type Verdict = { ok: boolean; notes: string[] };

export function judge(n: PipeNode, chosen: string[]): Verdict {
  const notes: string[] = [];
  const missing = n.needs.filter((x) => !chosen.includes(x));
  const extra = chosen.filter((x) => !n.needs.includes(x));
  for (const m of missing) notes.push(`Needs ${nodeById.get(m)!.label}.`);
  for (const x of extra) {
    const e = nodeById.get(x)!;
    if (n.layer === "gold" && e.layer === "bronze")
      notes.push(
        `Reads ${e.label} directly, skipping silver's cleaning: it would have to repeat it, or miss it.`,
      );
    else if (n.layer === "silver" && x.endsWith("customers") && n.id === "s_orders")
      notes.push("Silver tables usually stay one per source; joins belong in gold.");
    else notes.push(`${e.label} isn't needed here.`);
  }
  return { ok: missing.length === 0 && extra.length === 0, notes };
}

/** Waves of nodes that can run together, given chosen inputs (Kahn's algorithm). */
export function waves(inputs: Record<string, string[]>): string[][] {
  const done = new Set<string>();
  const out: string[][] = [];
  let left = NODES.map((n) => n.id);
  while (left.length) {
    const ready = left.filter((id) => (inputs[id] ?? []).every((d) => done.has(d)));
    if (!ready.length) break;
    out.push(ready);
    ready.forEach((r) => done.add(r));
    left = left.filter((id) => !ready.includes(id));
  }
  return out;
}
