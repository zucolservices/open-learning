"use client";

import { motion } from "motion/react";
import { Folder } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { PartitioningState } from "./state";

/* 1 ─ A filing cabinet ------------------------------------------------------------------ */

const DATES = ["2026-09-20", "2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24"];

const FILTERS: Record<
  PartitioningState["pruneFilter"],
  { sql: string; read: (d: string) => boolean; verdict: string; ok: boolean }
> = {
  date: {
    sql: "SELECT * FROM orders WHERE order_date = '2026-09-24'",
    read: (d) => d === "2026-09-24",
    verdict:
      "The filter names the partition column, so the engine opens just one drawer. That's partition pruning.",
    ok: true,
  },
  timestamp: {
    sql: "SELECT * FROM orders\nWHERE order_ts >= '2026-09-24 00:00' AND order_ts < '2026-09-25 00:00'",
    read: () => true,
    verdict:
      "Same day, but filtered on order_ts, not the partition column order_date. A Hive-style table can't connect the two, so every drawer is opened. (Iceberg's hidden partitioning and Delta's generated columns fix exactly this, by deriving the partition filter for you.)",
    ok: false,
  },
  customer: {
    sql: "SELECT * FROM orders WHERE customer_id = 4821",
    read: () => true,
    verdict:
      "The drawers are organised by date, so a customer could be in any of them. Every drawer is opened. Partitioning only helps queries that filter on the partition column.",
    ok: false,
  },
};

export function FilingCabinet() {
  const [s, set] = useSceneState<PartitioningState>();
  const f = FILTERS[s.pruneFilter];

  return (
    <StepLayout
      eyebrow="The big idea first"
      title="A filing cabinet with dated drawers"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.pruneFilter}
            options={[
              ["date", "Filter on order_date"],
              ["timestamp", "Filter on order_ts"],
              ["customer", "Filter on customer_id"],
            ]}
            onChange={(v) => set({ pruneFilter: v as PartitioningState["pruneFilter"] })}
          />
          <Code className="text-[10px] whitespace-pre-wrap">{f.sql}</Code>
          <div className="border-line bg-bg/40 rounded-2xl border p-4 font-mono text-xs">
            <p className="flex items-center gap-1.5">
              <Folder className="text-viz-compute size-4" /> orders/
            </p>
            <ul className="border-line mt-2 ml-2 grid gap-1.5 border-l pl-3">
              {DATES.map((d) => {
                const read = f.read(d);
                return (
                  <motion.li
                    key={d}
                    animate={{ opacity: read ? 1 : 0.35, x: read ? 4 : 0 }}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1",
                      read ? "bg-viz-compute/20" : "",
                    )}
                  >
                    <Folder className="size-3.5" /> order_date={d}/
                    <span className="text-muted ml-auto text-[10px]">
                      {read ? "opened" : "skipped"}
                    </span>
                  </motion.li>
                );
              })}
              <li className="text-subtle px-2 text-[10px]">… 1,090 more days</li>
            </ul>
          </div>
          <div
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              f.ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            {f.verdict}
          </div>
        </div>
      }
    >
      <p>
        Picture a filing cabinet with one drawer per day. To find last Thursday&apos;s receipts, you
        open one drawer and ignore the rest.
      </p>
      <p>
        <Term id="partition">Partitioning</Term> does the same for a table: rows are grouped by a
        column&apos;s value, one folder per value. A query that filters on that column skips every
        other folder. That&apos;s <Term id="partition-pruning">partition pruning</Term>.
      </p>
      <p>
        But the drawers only help if you search by what they&apos;re labelled with. Try the three
        filters.
      </p>
    </StepLayout>
  );
}
