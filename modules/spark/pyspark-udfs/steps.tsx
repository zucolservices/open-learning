"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { IMPLS, ORDER, WORKER_CASES } from "./model";
import type { PyState } from "./state";

/* 1 ─ Through an interpreter ---------------------------------------------------------------------- */

export function Interpreter() {
  const rows: [string, string][] = [
    [
      "Word by word through an interpreter",
      "Say a word, wait, hear it translated, say the next. Exhausting.",
    ],
    ["Hand over a translated document", "One hand-over for a whole page. Much quicker."],
    ["Speak their language yourself", "No interpreter at all."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Through an interpreter"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Talking through an interpreter one word at a time is slow. Handing over a translated
        document is faster. Speaking the other person&apos;s language yourself is fastest of all.
      </p>
      <p>
        PySpark has the same three options. Spark&apos;s engine runs on the JVM; your Python code
        runs in separate Python processes. Python <Term id="udf">UDFs</Term> pass rows between them,
        either one at a time or in batches using <Term id="apache-arrow">Apache Arrow</Term>.
        Built-in functions never leave the JVM at all.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The UDF ladder ⭐ --------------------------------------------------------------------------- */

export function UdfLadder() {
  const [s, set] = useSceneState<PyState>();
  const x = IMPLS[s.impl];
  const flows = s.impl !== "builtin";
  const batched = s.impl === "pandas" || s.impl === "arrow";
  const n = batched ? 3 : 8;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The UDF ladder"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {ORDER.map((k) => {
              const v = IMPLS[k];
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={s.impl === k}
                  onClick={() => set({ impl: k })}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                    s.impl === k
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <span className="w-44 font-semibold">{v.name}</span>
                  <div className="bg-surface-2 h-2 flex-1 overflow-hidden rounded">
                    <motion.div
                      animate={{ width: `${(v.rel / 20) * 100}%` }}
                      className={cn(
                        "h-full",
                        k === "builtin" ? "bg-good" : k === "pickled" ? "bg-bad" : "bg-viz-compute",
                      )}
                    />
                  </div>
                  <span className="text-muted w-10 text-right font-mono">×{v.rel}</span>
                </button>
              );
            })}
          </div>
          <svg
            viewBox="0 0 320 110"
            className="w-full max-w-md self-center"
            role="img"
            aria-label={`Data flow for ${x.name}`}
          >
            <rect
              x={6}
              y={20}
              width={110}
              height={70}
              rx={8}
              className="fill-viz-data/10 stroke-viz-data"
            />
            <text x={61} y={14} textAnchor="middle" className="fill-muted text-[9px]">
              executor JVM
            </text>
            <text x={61} y={58} textAnchor="middle" className="fill-fg text-[10px]">
              {s.impl === "builtin" ? "does all the work" : "Spark rows"}
            </text>
            <rect
              x={204}
              y={20}
              width={110}
              height={70}
              rx={8}
              className={cn(
                flows ? "fill-viz-compute/10 stroke-viz-compute" : "fill-surface-2/40 stroke-line",
              )}
              strokeDasharray={flows ? undefined : "4 3"}
            />
            <text x={259} y={14} textAnchor="middle" className="fill-muted text-[9px]">
              Python worker
            </text>
            <text
              x={259}
              y={58}
              textAnchor="middle"
              className={cn("text-[10px]", flows ? "fill-fg" : "fill-subtle")}
            >
              {flows
                ? s.impl === "pandas"
                  ? "pd.Series at a time"
                  : "one row at a time"
                : "not started"}
            </text>
            {flows && (
              <>
                <path d="M116 45 L204 45" className="stroke-line-strong" strokeWidth={1} />
                <path d="M204 68 L116 68" className="stroke-line-strong" strokeWidth={1} />
                {Array.from({ length: n }, (_, k) => (
                  <g key={`${s.impl}-${k}`}>
                    {batched ? (
                      <rect x={-8} y={-5} width={16} height={10} rx={2} className="fill-viz-meta">
                        <animateMotion
                          dur="1.8s"
                          repeatCount="indefinite"
                          begin={`-${(k * 1.8) / n}s`}
                          path="M120 45 L200 45"
                        />
                      </rect>
                    ) : (
                      <circle r={2.5} className="fill-bad">
                        <animateMotion
                          dur={`${1.8 * (x.rel / 10)}s`}
                          repeatCount="indefinite"
                          begin={`-${(k * 3.6) / n}s`}
                          path="M120 45 L200 45"
                        />
                      </circle>
                    )}
                    {batched ? (
                      <rect x={-8} y={-5} width={16} height={10} rx={2} className="fill-viz-add">
                        <animateMotion
                          dur="1.8s"
                          repeatCount="indefinite"
                          begin={`-${(k * 1.8) / n + 0.9}s`}
                          path="M200 68 L120 68"
                        />
                      </rect>
                    ) : (
                      <circle r={2.5} className="fill-viz-add">
                        <animateMotion
                          dur={`${1.8 * (x.rel / 10)}s`}
                          repeatCount="indefinite"
                          begin={`-${(k * 3.6) / n + 1}s`}
                          path="M200 68 L120 68"
                        />
                      </circle>
                    )}
                  </g>
                ))}
                <text x={160} y={38} textAnchor="middle" className="fill-muted text-[8px]">
                  {x.transfer}
                </text>
              </>
            )}
          </svg>
          <motion.div
            key={s.impl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-1.5"
          >
            <Code>{x.code}</Code>
            <p className="text-muted text-xs">{x.note}</p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            Relative times illustrative; real gaps depend on the function and data.
          </p>
        </div>
      }
    >
      <p>
        Four ways to tidy up a name column, from fastest to slowest. Pick each and watch what
        crosses between the JVM and Python.
      </p>
      <p>
        A <Term id="pandas-udf">pandas UDF</Term> works on whole columns at once; Databricks
        measured 3× to over 100× faster than row-at-a-time UDFs in 2017. Arrow-optimised UDFs (Spark
        3.5) batch the transfer, about 1.6× faster than pickled ones in their tests, but still call
        your function per row. Best of all: a built-in function, if one exists.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two processes, one bridge ------------------------------------------------------------------- */

export function TwoProcesses() {
  const [s, set] = useSceneState<PyState>();
  const c = WORKER_CASES[s.caseIdx] ?? WORKER_CASES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two processes, one bridge"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-center">
              <p className="font-semibold">Your Python program</p>
              <p className="text-muted text-[10px]">driver</p>
            </div>
            <span className="text-accent font-mono text-[10px]">Py4J ⇄</span>
            <div className="border-viz-data bg-viz-data/10 rounded-lg border px-3 py-2 text-center">
              <p className="font-semibold">Spark driver JVM</p>
              <p className="text-muted text-[10px]">plans the query</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {WORKER_CASES.map((w, i) => (
              <button
                key={w.code}
                type="button"
                aria-pressed={s.caseIdx === i}
                onClick={() => set({ caseIdx: i })}
                className={cn(
                  "rounded-md border px-3 py-1 text-left font-mono text-[11px]",
                  s.caseIdx === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {w.code}
              </button>
            ))}
          </div>
          <motion.div
            key={c.code}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              c.worker ? "border-viz-compute bg-viz-compute/10" : "border-good bg-good/10",
            )}
          >
            <p className="font-semibold">
              {c.worker ? "Python workers start on the executors" : "No Python on the executors"}
            </p>
            <p className="text-muted">{c.why}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Your PySpark script is a client. It talks to the JVM driver through{" "}
        <Term id="py4j">Py4J</Term>, and the JVM does the planning. DataFrame and SQL operations
        become JVM plans, so they run as fast as Scala.
      </p>
      <p>
        Python worker processes start on executors only when Python has to touch the data: UDFs and
        RDD functions. Try each line.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Writing faster Python ----------------------------------------------------------------------- */

export function WritingUdfs() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Writing faster Python"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`# 1. Prefer built-ins (pyspark.sql.functions has hundreds)
df.withColumn("domain", F.split("email", "@")[1])

# 2. Need Python? Work on whole columns
@pandas_udf("double")
def zscore(v: pd.Series) -> pd.Series:
    return (v - v.mean()) / v.std()

# 3. Moving data to pandas: Arrow is on by default since 4.2
spark.conf.get("spark.sql.execution.arrow.pyspark.enabled")  # 'true'
small_pdf = df.limit(10_000).toPandas()   # all rows go to the driver!`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Before Spark 4.2</p>
              <p className="text-muted">
                Arrow for toPandas() and plain @udf had to be switched on yourself.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Custom sources in Python</p>
              <p className="text-muted">
                Spark 4.0 added the Python Data Source API for reading and writing your own formats.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        The order of preference: built-in functions, then pandas UDFs (or Arrow-native UDFs), then
        plain Python UDFs. Note the pandas UDF here uses the batch&apos;s own mean, so results
        depend on how rows are batched; use a window or aggregation when you need a true column-wide
        statistic.
      </p>
      <p>
        Since Spark 4.2, Arrow is on by default both for converting to and from pandas and for plain
        Python UDFs. <code>toPandas()</code> still pulls every row to the driver, so limit first.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Does Python run? ---------------------------------------------------------------------------- */

export function WorkerOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Does Python run?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="python-worker"
            prompt="Which lines need Python worker processes on the executors?"
            categories={[
              { id: "yes", label: "Python workers" },
              { id: "no", label: "JVM only" },
            ]}
            items={[
              {
                id: "filter",
                label: 'df.filter(F.col("amount") > 100)',
                category: "no",
                why: "A column expression, planned and run in the JVM.",
              },
              {
                id: "udf",
                label: 'df.withColumn("x", my_udf("name"))',
                category: "yes",
                why: "Python has to see each row.",
              },
              {
                id: "sql",
                label: 'spark.sql("SELECT lower(email) FROM users")',
                category: "no",
                why: "A SQL built-in.",
              },
              {
                id: "pandas",
                label: "A pandas UDF in a select",
                category: "yes",
                why: "Batches go to Python via Arrow.",
              },
              {
                id: "rdd",
                label: "rdd.map(lambda r: r * 2)",
                category: "yes",
                why: "RDD lambdas run in Python.",
              },
              {
                id: "group",
                label: 'df.groupBy("city").count()',
                category: "no",
                why: "Planned by Catalyst, run in the JVM.",
              },
            ]}
            explanation="DataFrame and SQL operations become JVM plans; Python workers appear only for UDFs and RDD functions."
          />
        </div>
      }
    >
      <p>Sort the lines.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["PySpark drives the JVM", "DataFrame code runs as fast as Scala."],
  ["Built-ins first", "No Python process at all."],
  ["Then pandas UDFs", "Arrow batches, vectorised work."],
  ["Plain UDFs last", "Row by row; Arrow transfer by default since 4.2."],
  ["toPandas() collects", "Every row to the driver."],
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
      <p>Next: where Spark actually runs, from managed platforms to Kubernetes.</p>
    </StepLayout>
  );
}
