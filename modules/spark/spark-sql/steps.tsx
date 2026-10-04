"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { QUESTIONS, type Lang, type Q } from "./model";
import type { SqlState } from "./state";

/* 1 ─ Two front doors ----------------------------------------------------------------------------- */

export function TwoDoors() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Two front doors"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <div className="border-viz-data bg-viz-data/10 rounded-xl border px-3 py-3 text-center text-xs">
              <p className="font-semibold">Order at the counter</p>
              <p className="text-muted">&ldquo;Two masala dosas, one filter coffee&rdquo;</p>
            </div>
            <div className="border-viz-meta bg-viz-meta/10 rounded-xl border px-3 py-3 text-center text-xs">
              <p className="font-semibold">Order on the app</p>
              <p className="text-muted">tap, tap, tap</p>
            </div>
          </div>
          <span className="text-muted text-xs">↓ both become ↓</span>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-center text-xs">
            <p className="font-semibold">One kitchen ticket, one kitchen</p>
          </div>
        </div>
      }
    >
      <p>
        At a busy restaurant you can order at the counter or on the app. The kitchen doesn&apos;t
        care which: both become the same ticket, cooked the same way.
      </p>
      <p>
        <Term id="spark-sql">Spark SQL</Term> is the same. You can write SQL, or DataFrame code in
        Python, Scala, Java or R. The guide is explicit: &ldquo;When computing a result, the same
        execution engine is used, independent of which API/language you are using to express the
        computation.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Different words, same plan ⭐ --------------------------------------------------------------- */

export function SamePlan() {
  const [s, set] = useSceneState<SqlState>();
  const q = QUESTIONS[s.q];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Different words, same plan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(QUESTIONS) as Q[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.q === k}
                onClick={() => set({ q: k })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.q === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {QUESTIONS[k].name}
              </button>
            ))}
          </div>
          <Segmented<Lang>
            size="sm"
            value={s.lang}
            onChange={(lang) => set({ lang })}
            options={[
              ["sql", "SQL"],
              ["py", "PySpark DataFrame"],
            ]}
          />
          <Code>{s.lang === "sql" ? q.sql : q.py}</Code>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">physical plan (simplified), identical for both</p>
            {q.plan.map(([depth, line], i) => (
              <motion.p
                key={s.q + i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="font-mono text-[11px]"
                style={{ paddingLeft: `${depth * 12}px` }}
              >
                {depth > 0 ? "└ " : ""}
                {line}
              </motion.p>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Plans simplified from what explain() prints; table sizes illustrative.
          </p>
        </div>
      }
    >
      <p>
        Pick a question and flip between SQL and Python. The words change; the plan Spark builds
        doesn&apos;t. Read plans from the bottom up: scan the files, then filter, then aggregate.
      </p>
      <p>
        So choose whichever is clearer for the job: SQL for analysts and set-based questions,
        DataFrame code when you need loops, functions and tests around it. You can mix them freely
        in one program.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tables, views and catalogs ------------------------------------------------------------------ */

export function ViewsCatalogs() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tables, views and catalogs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`orders = spark.read.parquet("s3://shop/orders/")
orders.createOrReplaceTempView("orders")          # a name for this session
spark.sql("SELECT city, COUNT(*) FROM orders GROUP BY city").show()

orders.createGlobalTempView("orders_all")          # shared by sessions in this app
spark.sql("SELECT * FROM global_temp.orders_all")

spark.sql("SELECT * FROM spark_catalog.sales.orders")  # catalog.schema.table`}</Code>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "Temp view",
                "A name for a DataFrame, gone when the session ends. Nothing is stored.",
              ],
              [
                "Global temp view",
                "Shared by all sessions until the application stops, under global_temp.",
              ],
              ["Table", "Registered in a catalog, so other jobs and people can find it later."],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        To query a DataFrame with SQL, give it a name. A <Term id="temp-view">temporary view</Term>{" "}
        is &ldquo;session-scoped and will disappear if the session that creates it
        terminates.&rdquo;
      </p>
      <p>
        Lasting tables live in a <Term id="catalog">catalog</Term>. Spark&apos;s built-in one is
        called spark_catalog; on a lakehouse it&apos;s usually Unity Catalog, AWS Glue, Polaris or
        similar, as the Lakehouse track explains. Names then have three parts: catalog, schema,
        table.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Stricter by default ------------------------------------------------------------------------- */

const CASES: { sql: string; on: string; off: string }[] = [
  { sql: "SELECT CAST('abc' AS INT)", on: "Error: 'abc' cannot be cast to INT", off: "NULL" },
  { sql: "SELECT 2147483647 + 1", on: "Error: integer overflow", off: "-2147483648" },
  { sql: "SELECT 10 / 0", on: "Error: division by zero", off: "NULL" },
];

export function AnsiMode() {
  const [s, set] = useSceneState<SqlState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Stricter by default"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<"on" | "off">
            size="sm"
            value={s.ansi ? "on" : "off"}
            onChange={(v) => set({ ansi: v === "on" })}
            options={[
              ["on", "ANSI mode on (Spark 4 default)"],
              ["off", "ANSI mode off (Spark 3 default)"],
            ]}
          />
          {CASES.map((c, i) => (
            <motion.div
              key={c.sql + s.ansi}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="font-mono text-xs">{c.sql}</p>
              <p className={cn("mt-1 font-mono text-xs", s.ansi ? "text-bad" : "text-viz-compute")}>
                → {s.ansi ? c.on : c.off}
              </p>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">Error messages shortened.</p>
        </div>
      }
    >
      <p>
        Spark 4.0 switched on <Term id="ansi-mode">ANSI mode</Term> by default. Bad input now stops
        the query with an error instead of quietly becoming NULL or a wrapped-around number: Spark
        &ldquo;will throw an exception at runtime instead of returning null results if the inputs to
        a SQL operator/function are invalid.&rdquo;
      </p>
      <p>
        That&apos;s safer: a silent NULL can corrupt a report for months. But jobs upgraded from
        Spark 3 may start failing on dirty data they used to swallow. The migration guide&apos;s
        escape hatch is setting spark.sql.ansi.enabled to false; better is fixing the data or using
        try_cast.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Where can you see it? ----------------------------------------------------------------------- */

export function WhereVisible() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where can you see it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="where-visible"
            prompt="Which kind of name fits each need?"
            categories={[
              { id: "temp", label: "Temp view" },
              { id: "global", label: "Global temp view" },
              { id: "table", label: "Catalog table" },
            ]}
            items={[
              {
                id: "scratch",
                label: "A quick name to run SQL on a DataFrame in your notebook",
                category: "temp",
                why: "Session-scoped; nothing stored.",
              },
              {
                id: "gone",
                label: "Should disappear when your session ends",
                category: "temp",
                why: "That's exactly what a temp view does.",
              },
              {
                id: "share",
                label: "Shared by two sessions inside the same running application",
                category: "global",
                why: "Lives in global_temp until the app stops.",
              },
              {
                id: "nextweek",
                label: "A daily report table that analysts will query next week",
                category: "table",
                why: "Needs to survive restarts and be findable.",
              },
            ]}
            explanation="Temp views last for a session, global temp views for an application, catalog tables until you drop them."
          />
        </div>
      }
    >
      <p>Pick the right lifetime.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["One engine", "SQL and DataFrame code produce the same plans."],
  ["Choose for clarity", "Mix SQL and code in one program."],
  ["Name things", "Temp views for a session; tables in a catalog."],
  ["Three-part names", "catalog.schema.table."],
  ["ANSI by default", "Spark 4 errors on bad input instead of returning NULL."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That&apos;s how you describe work to Spark. Next chapter: what Spark does with your
        description, starting with the optimiser that rewrites it.
      </p>
    </StepLayout>
  );
}
