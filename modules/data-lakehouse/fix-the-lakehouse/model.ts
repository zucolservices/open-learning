/**
 * The broken lakehouse, as a model. Illustrative numbers, stated in the UI: five real
 * problems compound; four tempting fixes don't address the causes.
 */

export type FixId =
  | "compact"
  | "expire"
  | "filter"
  | "cluster"
  | "merge"
  | "workers"
  | "format"
  | "partition-store"
  | "no-retries";

export const FIXES: { id: FixId; label: string; detail: string; real: boolean }[] = [
  {
    id: "compact",
    label: "Commit every minute, compact daily",
    detail: "Slow the streaming trigger from 10 s to 1 min; schedule compaction to ~256 MB files.",
    real: true,
  },
  {
    id: "expire",
    label: "Expire old snapshots, remove orphans",
    detail: "Keep 7 days of snapshots (plus tags), delete unreferenced files.",
    real: true,
  },
  {
    id: "filter",
    label: "Rewrite the dashboard filter",
    detail: "WHERE order_ts >= … instead of date_format(order_ts, …) = …",
    real: true,
  },
  {
    id: "cluster",
    label: "Cluster by store_id",
    detail: "Sort/cluster data files so each covers few stores.",
    real: true,
  },
  {
    id: "merge",
    label: "MERGE on order_id in the silver job",
    detail: "Replace the append, so retries can't duplicate rows.",
    real: true,
  },
  {
    id: "workers",
    label: "Double the cluster size",
    detail: "Twice the workers for the dashboards' SQL engine.",
    real: false,
  },
  {
    id: "format",
    label: "Migrate to another table format",
    detail: "Move every table to a different open format.",
    real: false,
  },
  {
    id: "partition-store",
    label: "Also partition by store_id",
    detail: "Add store_id as a second partition column.",
    real: false,
  },
  {
    id: "no-retries",
    label: "Turn off scheduler retries",
    detail: "Stop Airflow retrying the silver job.",
    real: false,
  },
];

export interface Health {
  queryS: number;
  cost: number;
  storageTB: number;
  files: number;
  dupPct: number;
  missing: boolean;
  lines: { label: string; usd: number }[];
}

export function health(on: Set<FixId>): Health {
  const has = (f: FixId) => on.has(f);
  let files = has("compact") ? 16_400 : 2_104_332;
  if (has("partition-store")) files *= 3;
  const queryS =
    92 *
    (has("compact") ? 0.45 : 1) *
    (has("filter") ? 0.12 : 1) *
    (has("cluster") ? 0.4 : 1) *
    (has("workers") ? 0.8 : 1) *
    (has("partition-store") ? 1.5 : 1);
  const scan =
    15_000 * (has("filter") ? 0.1 : 1) * (has("cluster") ? 0.3 : 1) * (has("compact") ? 0.85 : 1);
  const requests = 2_400 * (files / 2_104_332);
  const extraWorkers = has("workers") ? 6_000 : 0;
  const dupPct = has("merge") || has("no-retries") ? 0 : 3.1;
  const storageTB = (has("expire") ? 2.1 : 6.4) * (dupPct > 0 ? 1 : 0.97);
  const storage = storageTB * 1000 * 0.023;
  const lines = [
    { label: "Query scanning", usd: scan },
    { label: "Storage requests (per file)", usd: requests },
    { label: "Extra workers", usd: extraWorkers },
    { label: "Storage", usd: storage },
  ];
  return {
    queryS,
    cost: lines.reduce((a, l) => a + l.usd, 0),
    storageTB,
    files,
    dupPct,
    missing: has("no-retries") && !has("merge"),
    lines,
  };
}

export const TARGETS = { queryS: 5, storageTB: 2.5, files: 50_000 };
