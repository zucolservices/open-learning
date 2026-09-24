"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ShowdownState } from "./state";

/* 9 ─ Choose a format for a project (branching scenario) --------------------------- */

const QUESTIONS: { id: string; q: string; options: [string, string][] }[] = [
  {
    id: "platform",
    q: "Where does most of your data work happen?",
    options: [
      ["databricks", "Databricks or Microsoft Fabric"],
      ["aws", "AWS services (Athena, EMR, Glue, S3)"],
      ["warehouse", "Snowflake or Google BigQuery"],
      ["open", "Self-managed open source (Spark, Trino, Flink…)"],
    ],
  },
  {
    id: "change",
    q: "How does your data change?",
    options: [
      ["append", "Mostly new rows, with occasional fixes"],
      ["upserts", "Constant updates, e.g. changes copied from app databases"],
      ["streaming", "Real-time streams that must land within seconds or minutes"],
    ],
  },
  {
    id: "writers",
    q: "How many different engines need to write the tables?",
    options: [
      ["one", "One main engine writes; others only read"],
      ["many", "Several engines or teams write"],
    ],
  },
];

interface Advice {
  primary: string;
  why: string[];
  alsoConsider: string;
  changeIf: string;
}

function advise(a: Record<string, string>): Advice {
  const { platform, change, writers } = a;
  if (platform === "databricks") {
    return {
      primary: "Delta Lake",
      why: [
        "It's the native format: every platform feature (liquid clustering, deletion vectors, change data feed) works first on Delta.",
        change === "upserts"
          ? "Frequent updates are well served by MERGE with deletion vectors."
          : change === "streaming"
            ? "Spark Structured Streaming reads and writes Delta directly."
            : "Batch loads and occasional fixes are the simplest case.",
      ],
      alsoConsider:
        writers === "many"
          ? "Other engines need to write: Databricks can also manage Iceberg tables in Unity Catalog, served over the Iceberg REST API."
          : "Turn on UniForm if other teams need to read the tables as Iceberg.",
      changeIf:
        "Most of your engines moved outside the platform, or your organisation standardised on an Iceberg catalog.",
    };
  }
  if (platform === "aws" || platform === "warehouse") {
    const where =
      platform === "aws"
        ? "AWS supports Iceberg across Athena, EMR, Glue and S3 Tables, including writes."
        : "Snowflake and BigQuery both offer Iceberg tables they can write, and other engines can read.";
    return {
      primary: "Apache Iceberg",
      why: [
        where,
        "Iceberg has the widest multi-engine and multi-vendor support, which keeps future options open.",
      ],
      alsoConsider:
        change === "upserts" && platform === "aws"
          ? "For heavy upsert pipelines on EMR or Glue with Spark, Hudi was built for exactly this and is supported there."
          : "Check which features your platform supports for writes, such as merge-on-read deletes or format v3.",
      changeIf:
        platform === "aws"
          ? "Your team already runs Databricks on AWS, where Delta is native."
          : "Most transformation happens in Databricks or Fabric, where Delta is native.",
    };
  }
  // Self-managed open source
  if (change === "upserts" && writers === "one") {
    return {
      primary: "Apache Hudi (or Iceberg)",
      why: [
        "Hudi was built for constant upserts: Merge-on-Read tables, indexes that find keys fast, and incremental queries for downstream jobs.",
        "With one main writer, its table services can run alongside without extra coordination.",
      ],
      alsoConsider:
        "Iceberg with merge-on-read also handles upserts well and has broader engine support.",
      changeIf: "Several engines must write, or readers you need don't support Hudi well.",
    };
  }
  return {
    primary: "Apache Iceberg",
    why: [
      writers === "many"
        ? "Several engines writing to one table is exactly what Iceberg's catalog-based commits and REST catalog API are designed for."
        : "Iceberg is supported by nearly every open-source engine, so you're free to change engines later.",
      change === "streaming"
        ? "Flink writes Iceberg in near real time."
        : "Hidden partitioning and field IDs keep the table easy to evolve.",
    ],
    alsoConsider:
      change === "streaming"
        ? "For streaming upserts by primary key, look at Apache Paimon (built with Flink) or Hudi."
        : "Pick a REST catalog early (for example Apache Polaris or Lakekeeper); it matters as much as the format.",
    changeIf: "You adopt Databricks or Fabric as your main platform, where Delta is native.",
  };
}

export function ChooseFormat() {
  const [s, set] = useSceneState<ShowdownState>();
  const answers = s.answers ?? {};
  const current = QUESTIONS.find((q) => !answers[q.id]);
  const done = !current;
  const advice = done ? advise(answers) : null;

  return (
    <StepLayout
      eyebrow="Scenario"
      title="Choose a format for your project"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <ol className="flex flex-col gap-2">
            {QUESTIONS.filter((q) => answers[q.id]).map((q) => (
              <li
                key={q.id}
                className="border-line bg-surface flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
              >
                <Check className="text-good size-4 shrink-0" />
                <span className="text-muted">{q.q}</span>
                <span className="ml-auto text-right font-medium">
                  {q.options.find(([id]) => id === answers[q.id])?.[1]}
                </span>
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border-accent/40 bg-bg/40 rounded-2xl border p-4"
              >
                <p className="font-semibold">{current.q}</p>
                <div className="mt-3 grid gap-2">
                  {current.options.map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set({ answers: { ...answers, [current.id]: id } })}
                      className="border-line bg-surface hover:border-accent rounded-xl border px-4 py-2.5 text-left text-sm transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              advice && (
                <motion.div
                  key="advice"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-3"
                >
                  <div className="border-accent/50 bg-accent-soft rounded-2xl border p-4">
                    <p className="text-muted text-xs">A sensible starting point</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">{advice.primary}</p>
                    <ul className="mt-2 grid gap-1.5">
                      {advice.why.map((w) => (
                        <li key={w} className="text-muted text-sm">
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="border-line bg-surface rounded-xl border p-3 text-sm">
                      <p className="font-semibold">Also consider</p>
                      <p className="text-muted mt-1">{advice.alsoConsider}</p>
                    </div>
                    <div className="border-line bg-surface rounded-xl border p-3 text-sm">
                      <p className="font-semibold">What would change the answer</p>
                      <p className="text-muted mt-1">{advice.changeIf}</p>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {Object.keys(answers).length > 0 && (
            <button
              type="button"
              onClick={() => set({ answers: {} })}
              className={cn(
                "text-muted hover:text-fg flex items-center gap-1.5 self-start text-xs",
                done && "mt-1",
              )}
            >
              <RotateCcw className="size-3" /> Start over with a different project
            </button>
          )}
        </div>
      }
    >
      <p>
        Picture a real project and answer three questions. You&apos;ll get a reasoned starting
        point, not a verdict: with interop tools, the choice is less permanent than it used to be.
      </p>
      <p>
        Try a few different projects. Notice how often the <em>platform</em> question decides it.
      </p>
      <p className="text-subtle text-xs">
        This reflects common practice as of 2026, not a rule. Your organisation&apos;s existing
        tools, skills and <Term id="catalog">catalog</Term> matter too.
      </p>
    </StepLayout>
  );
}

/* 10 ─ Newer entrants ----------------------------------------------------------- */

const ENTRANTS = [
  {
    name: "DuckLake",
    from: "DuckDB team · v1.0 in April 2026",
    idea: "Keeps all table metadata in an ordinary SQL database (PostgreSQL, MySQL, SQLite or DuckDB) instead of metadata files, with data still in Parquet.",
    why: "Simpler, faster commits and lookups; the database handles transactions.",
  },
  {
    name: "Apache Paimon",
    from: "Formerly Flink Table Store · 2.0 in August 2026",
    idea: "A lake format built on an LSM structure, like the storage engines inside many databases, for real-time streaming updates.",
    why: "High-rate upserts by primary key with Flink and Spark.",
  },
  {
    name: "Lance",
    from: "Open-source · “lakehouse format for multimodal AI”",
    idea: "A file format, table format and catalog spec designed for AI data: embeddings, images and fast random access.",
    why: "Machine-learning and vector-search workloads that Parquet serves poorly.",
  },
];

export function NewEntrants() {
  return (
    <StepLayout
      eyebrow="What's next"
      title="Newer entrants"
      stage={
        <div className="grid flex-1 content-start gap-3">
          {ENTRANTS.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-2xl border p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-lg font-semibold tracking-tight">{e.name}</p>
                <span className="text-muted text-xs">{e.from}</span>
              </div>
              <p className="text-muted mt-1.5 text-sm">{e.idea}</p>
              <p className="mt-2 text-xs">
                <span className="text-viz-compute font-medium">Aimed at: </span>
                <span className="text-muted">{e.why}</span>
              </p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The big three aren&apos;t the end of the story. New formats keep appearing, each aimed at a
        workload the others handle less well.
      </p>
      <p>
        You don&apos;t need to learn them now. Knowing they exist, and what problem each targets,
        helps you read the landscape.
      </p>
    </StepLayout>
  );
}

/* 11 ─ Wrap-up ------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Same skeleton",
    "Parquet data files, metadata listing each version's files, and an atomic commit. Only the metadata's shape differs.",
  ],
  [
    "Different first problems",
    "Hudi: upserts and incrementals. Iceberg: correctness at scale, for any engine. Delta: reliable Spark pipelines.",
  ],
  [
    "Converging fast",
    "Deletion vectors, VARIANT and row lineage now appear across formats; Iceberg's deletion vectors were designed to be compatible with Delta's.",
  ],
  [
    "Metadata can be translated",
    "UniForm and XTable let one copy of the data be read as several formats.",
  ],
  [
    "Choose by ecosystem",
    "Your platform, engines and catalog usually decide, more than any single feature.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up · Chapter 2 complete"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-2.5">
          {TAKEAWAYS.map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-meta/15 text-viz-meta grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted text-sm">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That completes <strong>Open table formats</strong>. You can now look at any bucket and tell
        which format wrote it, explain how each finds its current version, and reason about which to
        use.
      </p>
      <p>
        Next chapter, <strong>How tables behave</strong>, goes deeper into what all three share:
        ACID transactions on object storage, updates and deletes, and schema evolution.
      </p>
    </StepLayout>
  );
}
