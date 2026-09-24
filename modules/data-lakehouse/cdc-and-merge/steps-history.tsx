"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CdcState } from "./state";

/* 6 ─ Keeping history: SCD Type 1 vs Type 2 ---------------------------------------------------- */

const MOVES = [
  { date: "2026-01-05", city: "Pune", text: "Priya signs up in Pune." },
  { date: "2026-03-10", city: "Mumbai", text: "Priya moves to Mumbai." },
  { date: "2026-06-05", city: "Bengaluru", text: "Priya moves to Bengaluru." },
];

type ScdRow = { city: string; from: string; to: string | null; current: boolean };

function type2Rows(upto: number): ScdRow[] {
  return MOVES.slice(0, upto + 1).map((m, i, arr) => ({
    city: m.city,
    from: m.date,
    to: i < arr.length - 1 ? arr[i + 1].date : null,
    current: i === arr.length - 1,
  }));
}

export function ScdTypes() {
  const [s, set] = useSceneState<CdcState>();
  const step = s.scdStep;
  const t2 = s.scd === "2";
  const rows: ScdRow[] = t2
    ? type2Rows(step)
    : [{ city: MOVES[step].city, from: "", to: null, current: true }];
  const last = step === MOVES.length - 1;
  return (
    <StepLayout
      eyebrow="Keeping history"
      title="Overwrite, or keep history?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.scd}
            options={[
              ["1", "Type 1: overwrite"],
              ["2", "Type 2: keep history"],
            ]}
            onChange={(v) => set({ scd: v as CdcState["scd"] })}
          />
          <div className="border-line bg-surface overflow-x-auto rounded-xl border p-3">
            <p className="text-muted mb-2 font-mono text-[10px]">silver.dim_customer</p>
            <table className="w-full font-mono text-[11px]">
              <thead className="text-muted text-left">
                <tr>
                  <th className="py-1 pr-3 font-normal">id</th>
                  <th className="py-1 pr-3 font-normal">name</th>
                  <th className="py-1 pr-3 font-normal">city</th>
                  {t2 && (
                    <>
                      <th className="py-1 pr-3 font-normal">valid_from</th>
                      <th className="py-1 pr-3 font-normal">valid_to</th>
                      <th className="py-1 font-normal">is_current</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map((r) => (
                    <motion.tr
                      key={t2 ? r.from : "only"}
                      layout
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: r.current || !t2 ? 1 : 0.6, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-line border-t"
                    >
                      <td className="py-1 pr-3">1</td>
                      <td className="py-1 pr-3">Priya</td>
                      <td className="py-1 pr-3">
                        <motion.span
                          key={r.city}
                          initial={{ color: "var(--color-accent)" }}
                          animate={{ color: "var(--color-fg)" }}
                          transition={{ duration: 1.2 }}
                        >
                          {r.city}
                        </motion.span>
                      </td>
                      {t2 && (
                        <>
                          <td className="py-1 pr-3">{r.from}</td>
                          <td className="py-1 pr-3">{r.to ?? "null"}</td>
                          <td className={cn("py-1", r.current ? "text-good" : "text-muted")}>
                            {String(r.current)}
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <Stepper
            step={step}
            count={MOVES.length}
            onChange={(n) => set({ scdStep: n })}
            label={MOVES[step].date}
          />
          <FrameCaption frameKey={s.scd + step} title={MOVES[step].text}>
            {t2
              ? step === 0
                ? "One row, open-ended: valid_to is null and it's the current version."
                : "The old row is closed (valid_to set, is_current false) and a new current row is added. Nothing is lost."
              : step === 0
                ? "One row per customer."
                : "The city is simply overwritten. The table is small and always current, but where Priya used to live is gone."}
          </FrameCaption>
          <AnimatePresence>
            {last && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  t2 ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                <p className="font-semibold">
                  Priya ordered on 20 April. Which city should that sale count towards?
                </p>
                <p className="text-muted mt-1">
                  {t2
                    ? "Mumbai: join the order date to the row that was valid on that date."
                    : "The table says Bengaluru, which is wrong: she lived in Mumbai then. Type 1 can't answer questions about the past."}
                </p>
                {t2 && (
                  <Code className="mt-2">
                    {
                      "JOIN dim_customer c ON o.customer_id = c.id\n AND o.order_date >= c.valid_from\n AND (o.order_date < c.valid_to OR c.valid_to IS NULL)"
                    }
                  </Code>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <p>
        So far each change simply replaced the old value. That&apos;s fine for a phone number. But
        when did Priya live where? For some questions, the past matters.
      </p>
      <p>
        Data teams call these <Term id="scd">slowly changing dimensions</Term>. Type 1 overwrites.
        Type 2 closes the old row and adds a new one, so every version is kept with the dates it was
        true.
      </p>
      <p className="text-muted text-sm">
        Type 2 with a plain MERGE takes a trick: the source is a union of each changed row twice,
        once to close the old version and once (with a key that can&apos;t match) to insert the new
        one. It handles one change per customer per run. Declarative tools do it for you, e.g.
        Databricks <code>AUTO CDC … STORED AS SCD TYPE 2</code>.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Checkpoint: Type 1 or Type 2? ------------------------------------------------------------- */

export function ScdSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Type 1 or Type 2?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="scd-sort"
            prompt="For each need, which way of handling changes fits?"
            categories={[
              { id: "t1", label: "Type 1" },
              { id: "t2", label: "Type 2" },
            ]}
            items={[
              {
                id: "typo",
                label: "Fixing a typo in a customer's name",
                category: "t1",
                why: "A typo's history is noise. Overwrite it.",
              },
              {
                id: "city-sales",
                label: "Revenue by the city customers lived in when they ordered",
                category: "t2",
                why: "Needs the city that was true on each order date.",
              },
              {
                id: "sms",
                label: "The current phone number, for delivery SMS",
                category: "t1",
                why: "Only the latest value is ever used.",
              },
              {
                id: "price",
                label: "Re-printing old invoices at the price charged at the time",
                category: "t2",
                why: "Old invoices must use old prices: keep every version.",
              },
              {
                id: "tier-now",
                label: "A dashboard of how many customers are in each loyalty tier today",
                category: "t1",
                why: "Today's tier is all it needs.",
              },
            ]}
            explanation="Ask whether anyone will need the value as it was on a past date. If yes, keep history (Type 2). If not, overwrite (Type 1): it's simpler and smaller."
          />
        </div>
      }
    >
      <p>Type 2 isn&apos;t automatically better. It costs more rows and more complex queries.</p>
    </StepLayout>
  );
}

/* 8 ─ Change feeds: CDC out of the lakehouse ---------------------------------------------------- */

const FEEDS: Record<
  CdcState["feed"],
  { setup: string; query: string; cols: string[]; rows: string[][]; note: string }
> = {
  delta: {
    setup: "ALTER TABLE silver.customers\n  SET TBLPROPERTIES (delta.enableChangeDataFeed = true)",
    query: "SELECT * FROM table_changes('silver.customers', 12)",
    cols: ["id", "name", "city", "_change_type", "_commit_version"],
    rows: [
      ["1", "Priya", "Pune", "update_preimage", "12"],
      ["1", "Priya", "Mumbai", "update_postimage", "12"],
      ["3", "Meera", "Chennai", "delete", "12"],
      ["4", "Kabir", "Goa", "insert", "12"],
    ],
    note: "Delta Change Data Feed. Only records changes made after it's switched on; each row also has _commit_timestamp.",
  },
  iceberg: {
    setup:
      "CALL catalog.system.create_changelog_view(\n  table => 'silver.customers',\n  options => map('start-snapshot-id', '…'),\n  identifier_columns => array('id'))",
    query: "SELECT * FROM customers_changes",
    cols: ["id", "name", "city", "_change_type", "_change_ordinal"],
    rows: [
      ["1", "Priya", "Pune", "UPDATE_BEFORE", "0"],
      ["1", "Priya", "Mumbai", "UPDATE_AFTER", "0"],
      ["3", "Meera", "Chennai", "DELETE", "0"],
      ["4", "Kabir", "Goa", "INSERT", "0"],
    ],
    note: "Iceberg works the changes out by comparing snapshots, so there's nothing to switch on. With identifier columns, a delete + insert of the same id becomes an update pair. At the time of writing, this Spark changelog doesn't yet support merge-on-read tables with delete files.",
  },
  hudi: {
    setup: "-- when creating the table\nhoodie.table.cdc.enabled = true",
    query: "SELECT * FROM hudi_table_changes('silver.customers', 'cdc', 'earliest')",
    cols: ["op", "before", "after"],
    rows: [
      ["u", "{1, Priya, Pune}", "{1, Priya, Mumbai}"],
      ["d", "{3, Meera, Chennai}", "null"],
      ["i", "null", "{4, Kabir, Goa}"],
    ],
    note: "Hudi CDC queries return each change with before and after images, a lot like Debezium. Separately, Hudi's incremental query ('latest_state') returns just the latest values of rows changed since a commit.",
  },
};

export function ChangeFeeds() {
  const [s, set] = useSceneState<CdcState>();
  const f = FEEDS[s.feed];
  return (
    <StepLayout
      eyebrow="Full circle"
      title="Change feeds: CDC out of the lakehouse"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.feed}
            options={[
              ["delta", "Delta"],
              ["iceberg", "Iceberg"],
              ["hudi", "Hudi"],
            ]}
            onChange={(v) => set({ feed: v as CdcState["feed"] })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.feed}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <Code>{f.setup}</Code>
              <Code>{f.query}</Code>
              <div className="border-line overflow-x-auto rounded-xl border">
                <table className="w-full font-mono text-[11px]">
                  <thead className="bg-surface-2 text-muted text-left">
                    <tr>
                      {f.cols.map((c) => (
                        <th key={c} className="px-3 py-1.5 font-normal">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {f.rows.map((r, i) => (
                      <tr key={i} className="border-line border-t">
                        {r.map((c, j) => (
                          <td key={j} className="px-3 py-1.5 whitespace-nowrap">
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted text-xs">{f.note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Now the lakehouse table has its own statement. A <Term id="change-feed">change feed</Term>{" "}
        lists what each commit inserted, updated and deleted, so the next pipeline down the line
        (silver to gold) can process only what changed instead of re-reading the whole table.
      </p>
      <p>
        Here&apos;s the MERGE from earlier (Priya moves, Meera leaves, Kabir joins) as each format
        reports it.
      </p>
    </StepLayout>
  );
}

/* 9 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "CDC is a database's statement",
    "Tools like Debezium, DMS and Datastream turn every insert, update and delete into an event, read from the database's own log.",
  ],
  [
    "Order by log position",
    "Not by arrival time or the time the event was processed. Break timestamp ties with the position.",
  ],
  [
    "One source row per key",
    "De-duplicate each batch to the latest event per key, or MERGE fails, or inserts duplicates.",
  ],
  [
    "Guard against the past",
    "Apply an event only if it's newer than the row, and keep deletes as tombstones so late events can't bring rows back.",
  ],
  [
    "Type 1 or Type 2",
    "Overwrite when only the present matters; keep dated versions when someone will ask about the past.",
  ],
  [
    "Change feeds pass it on",
    "Delta CDF, Iceberg changelogs and Hudi CDC queries let downstream jobs process only what changed.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You can now keep a lakehouse table in step with a live database, even when the events
        misbehave.
      </p>
      <p>
        Next: the <em>medallion architecture</em>, which organises all these tables into bronze,
        silver and gold layers.
      </p>
    </StepLayout>
  );
}
