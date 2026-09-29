"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Loader2, Play, RotateCcw, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import { run, type Result } from "./duck";
import type { TablesState } from "./state";

type Res = Result | { error: string } | null;

const QS = data.questions;
const SHORT = [
  "Approved in August",
  "Most pending",
  "Average days",
  "Documents needed",
  "Approved last month",
  "Ward 9 on time?",
];

function Pills({
  value,
  onChange,
  only,
}: {
  value: number;
  onChange(i: number): void;
  only?: number[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SHORT.map((t, i) =>
        only && !only.includes(i) ? null : (
          <button
            key={t}
            type="button"
            aria-pressed={value === i}
            onClick={() => onChange(i)}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px]",
              value === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {t}
          </button>
        ),
      )}
    </div>
  );
}

function ResTable({ res }: { res: Res }) {
  if (!res) return null;
  if ("error" in res)
    return (
      <p className="border-bad/50 bg-bad/10 rounded border px-2 py-1 font-mono text-[10.5px]">
        {res.error}
      </p>
    );
  return (
    <div className="overflow-x-auto">
      <table className="border-line w-full border text-[10.5px]">
        <thead>
          <tr className="bg-surface-2">
            {res.cols.map((c) => (
              <th key={c} className="px-1.5 py-0.5 text-left font-mono font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {res.rows.map((r, i) => (
            <tr key={i} className="border-line border-t">
              {r.map((v, j) => (
                <td key={j} className="px-1.5 py-0.5 font-mono">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {res.total > res.rows.length && (
        <p className="text-muted mt-0.5 text-[10px]">
          First {res.rows.length} of {res.total} rows
        </p>
      )}
    </div>
  );
}

/** Edit a query and run it on the table, in the browser. */
function SqlRunner({ initial }: { initial: string }) {
  const [sql, setSql] = useState(initial);
  const [res, setRes] = useState<Res>(null);
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    try {
      setRes(await run(sql));
    } catch (e) {
      setRes({ error: String((e as Error).message ?? e).split("\n")[0] });
    }
    setBusy(false);
  }
  return (
    <div className="border-line bg-surface flex flex-col gap-1.5 rounded-lg border p-2">
      <textarea
        aria-label="SQL query"
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        spellCheck={false}
        rows={Math.min(9, sql.split("\n").length + 1)}
        className="bg-surface-2 w-full resize-y rounded px-2 py-1 font-mono text-[10.5px] leading-relaxed"
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={go}
          disabled={busy}
          className="bg-accent text-accent-fg flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium"
        >
          {busy ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
          Run in your browser
        </button>
        <button
          type="button"
          onClick={() => {
            setSql(initial);
            setRes(null);
          }}
          className="text-muted flex items-center gap-1 text-[11px]"
        >
          <RotateCcw className="size-3" /> Reset
        </button>
        <span className="text-muted text-[10px]">
          First run downloads DuckDB (tens of MB); nothing leaves your machine.
        </span>
      </div>
      <ResTable res={res} />
    </div>
  );
}

/* 1 ─ The ledger, not the filing cabinet -------------------------------------------------------- */

export function Ledger() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The ledger, not the filing cabinet"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "“What papers do I need for a water connection?”",
              "The clerk pulls the right leaflet from the filing cabinet.",
              "Search",
            ],
            [
              "“How many connections did we approve in August?”",
              "The clerk doesn't read leaflets. They open the ledger and count every line.",
              "A database query",
            ],
          ].map(([q, d, m], i) => (
            <motion.div
              key={m}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-medium">{q}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
              <span className="bg-accent-soft mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px]">
                {m}
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A good clerk knows two kinds of question. Some are answered by finding the right page.
        Others need every record looked at: how many, how much, which is biggest.
      </p>
      <p>
        Everything so far in this track finds pages. This module is about the second kind, where the
        answer lives in a table and the right tool is a database query in <Term id="sql">SQL</Term>.
        The data here is a made-up register of 360 applications to Kalpanagar&apos;s municipal
        corporation.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Search can't count ⭐ (real retrieval, real answers) --------------------------------------- */

export function SearchCantCount() {
  const [s, set] = useSceneState<TablesState>();
  const q = QS[s.sq];
  return (
    <StepLayout
      eyebrow="Simulation · real output"
      title="Search can't count"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Pills value={s.sq} onChange={(i) => set({ sq: i })} only={[0, 1, 2, 3, 4]} />
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
            {q.q}
          </p>
          <div>
            <p className="text-muted mb-1 text-[11px]">
              Top 5 of 360 register rows and 7 help-page passages
            </p>
            <ol className="flex flex-col gap-0.5">
              {q.top.map((t, i) => (
                <li
                  key={i}
                  className="border-line bg-surface flex gap-1.5 rounded border px-2 py-0.5 text-[10.5px]"
                >
                  <span className="font-mono">{i + 1}</span>
                  <span className="line-clamp-1">
                    {t.title === "Application register" ? "" : `${t.title}: `}
                    {t.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <motion.div
            key={s.sq}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs"
          >
            <p className="text-muted text-[10px] tracking-wide uppercase">Phi-4-mini answered</p>
            <p className="line-clamp-6 whitespace-pre-line">{q.rag}</p>
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs">
              <span className="text-muted block text-[10px]">Verdict</span>
              {q.ragVerdict}
            </p>
            <p className="border-good/50 bg-good/10 rounded-lg border px-3 py-1.5 text-xs">
              <span className="text-muted block text-[10px]">The true answer</span>
              {q.truth}
            </p>
          </div>
        </div>
      }
    >
      <p>
        Here each application is a sentence in the search index, alongside the help pages. The
        system retrieves the top 5 and a small model (Phi-4-mini) answers, with the rules from the
        last module switched on.
      </p>
      <p>
        Five rows can&apos;t show a total. The model either says it doesn&apos;t know (the good
        outcome), or answers from the rows it happened to see, confidently and wrongly. Only the
        documents question works, because its answer is on one page.
      </p>
      <p>
        Researchers found the same at scale: in a 2024 test built on hard database questions, plain
        RAG answered none of the scored questions exactly right.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Let the model write SQL ⭐ (real SQL, real results) ---------------------------------------- */

const SCHEMA_BARE =
  "Table: applications(id, service, ward, applied_on, status, decided_on, days_taken)";
const SCHEMA_DESC = `Today is 2026-09-29.
CREATE TABLE applications (
  service TEXT,  -- one of 'water_connection', 'trade_licence', …
  ward INTEGER,  -- 1 to 12
  status TEXT,   -- one of 'approved', 'rejected', 'pending'
  decided_on DATE, -- NULL while pending
  days_taken INTEGER -- calendar days; NULL while pending
  …
);
"Approved in a month" means decided_on falls in that month.`;

const VERDICTS: Record<string, [string, string]> = {
  right: ["Right", "border-good/50 bg-good/10"],
  wrong: ["Runs, but wrong", "border-bad bg-bad/10"],
  error: ["Error", "border-bad/50 bg-bad/5"],
  none: ["No SQL at all", "border-bad/50 bg-bad/5"],
};

export function WriteSql() {
  const [s, set] = useSceneState<TablesState>();
  const q = QS[s.q];
  const g = q[s.schema];
  const [label, tone] = VERDICTS[g.verdict];
  return (
    <StepLayout
      eyebrow="Simulation · real output"
      title="Let the model write SQL"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Pills value={s.q} onChange={(i) => set({ q: i })} />
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
            {q.q}
          </p>
          <Segmented
            size="sm"
            value={s.schema}
            options={[
              ["bare", "Column names only"],
              ["desc", "Columns described"],
            ]}
            onChange={(v) => set({ schema: v })}
          />
          <Code className="text-[10px]">{s.schema === "bare" ? SCHEMA_BARE : SCHEMA_DESC}</Code>
          <div>
            <p className="text-muted mb-1 text-[11px]">Phi-4-mini wrote</p>
            <Code className="max-h-40 whitespace-pre-wrap">{g.sql ?? g.raw}</Code>
          </div>
          <div className={cn("rounded-lg border px-3 py-2 text-xs", tone)}>
            <p className="flex items-center gap-1 font-medium">
              {g.verdict === "right" ? (
                <Check className="text-good size-3.5" />
              ) : (
                <X className="text-bad size-3.5" />
              )}
              {label}
            </p>
            <p className="mt-0.5">{g.why}</p>
            {g.res && (
              <div className="mt-1.5">
                <ResTable res={g.res as Res} />
              </div>
            )}
            <p className="text-muted mt-1 text-[10px]">True answer: {q.truth}</p>
          </div>
          {g.sql && (
            <details className="text-xs">
              <summary className="text-muted cursor-pointer">Edit it and run it yourself</summary>
              <div className="mt-1.5">
                <SqlRunner key={`${s.q}-${s.schema}`} initial={g.sql} />
              </div>
            </details>
          )}
        </div>
      }
    >
      <p>
        <Term id="text-to-sql">Text-to-SQL</Term>: the model reads a description of the table and
        writes a query; the database runs it over every row, exactly. Try each question with just
        the column names, then with the columns described.
      </p>
      <p>
        With names only, the model guessed: text in the number column, invented values. With
        descriptions it got three of the five database questions right. The same pattern shows up in
        research: on the BIRD benchmark, short notes about what columns mean took GPT-4 from 35% to
        55%.
      </p>
      <p>
        Errors are the lucky case: you see them. The dangerous ones run and return a
        sensible-looking number. Look at &ldquo;Ward 9&rdquo; with descriptions, and the documents
        question, which isn&apos;t a database question at all.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Route the question ------------------------------------------------------------------------ */

export function Route() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Route the question"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="route-question"
            prompt="Where should each question go: text search, the database, or both?"
            categories={[
              { id: "search", label: "Search" },
              { id: "sql", label: "SQL" },
              { id: "both", label: "Both" },
            ]}
            items={[
              {
                id: "docs",
                label: "“What documents do I need for a new water connection?”",
                category: "search",
                why: "The answer is written on a help page. Phi-4-mini routed this one to SEARCH.",
              },
              {
                id: "pending",
                label: "“Which ward has the most pending applications?”",
                category: "sql",
                why: "Counting every pending row. Phi-4-mini routed it to SQL.",
              },
              {
                id: "aug",
                label: "“How many water connections were approved in August 2026?”",
                category: "sql",
                why: "A count over the register. Phi-4-mini said BOTH: safe, but an extra search for nothing.",
              },
              {
                id: "avg",
                label: "“On average, how long does a birth certificate take?”",
                category: "sql",
                why: "An average over rows. Phi-4-mini said BOTH here too.",
              },
              {
                id: "ward9",
                label: "“Are water connections in Ward 9 done within the promised time?”",
                category: "both",
                why: "The promise is in the rules (text); the actual times are in the register (table). Phi-4-mini said BOTH.",
              },
            ]}
            explanation="A router can be a few rules, a small classifier, or the model choosing between two tools. Phi-4-mini sent four of our six questions to BOTH. That's safe but slower and costlier. Log which way each question went, so you can see mistakes."
          />
        </div>
      }
    >
      <p>
        A system that has both documents and tables needs a <Term id="query-router">router</Term>: a
        first step that decides where each question goes. We asked Phi-4-mini to route all six
        questions; its choices are in the feedback.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Right query, wrong answer ⭐ ---------------------------------------------------------------- */

const WORKING = `SELECT COUNT(*) AS approved,
  SUM(CASE WHEN days_taken <= 15 THEN 1 ELSE 0 END) AS within_15_calendar_days,
  SUM(CASE WHEN working_days <= 15 THEN 1 ELSE 0 END) AS within_15_working_days
FROM (
  SELECT days_taken,
    (SELECT COUNT(*)
     FROM range(applied_on::TIMESTAMP, decided_on::TIMESTAMP, INTERVAL 1 DAY) t(d)
     WHERE isodow(d) <= 5) AS working_days
  FROM applications
  WHERE service = 'water_connection' AND ward = 9 AND status = 'approved'
)`;

export function RightQueryWrongAnswer() {
  const w = data.ward9;
  const [reveal, setReveal] = useState(false);
  return (
    <StepLayout
      eyebrow="Fix the problem · real output"
      title="Right query, wrong answer"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
            {w.q}
          </p>
          <div className="grid gap-2 lg:grid-cols-2">
            <div>
              <p className="text-muted mb-1 text-[11px]">From search: the rule</p>
              <Code className="whitespace-pre-wrap">{w.passage}</Code>
            </div>
            <div>
              <p className="text-muted mb-1 text-[11px]">From SQL (query written by us)</p>
              <Code className="whitespace-pre-wrap">{w.res}</Code>
            </div>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted text-[10px] tracking-wide uppercase">
              Phi-4-mini answered, given both
            </p>
            <p>{w.a1}</p>
          </div>
          {!reveal ? (
            <button
              type="button"
              onClick={() => setReveal(true)}
              className="border-line bg-surface hover:bg-surface-2 self-start rounded-lg border px-3 py-1.5 text-xs"
            >
              What went wrong?
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <p className="border-bad/50 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
                The answer contradicts itself (&ldquo;Yes&rdquo;, then &ldquo;only 4 of 12&rdquo;),
                and both halves are wrong. The rule promises 15 <strong>working</strong> days; the
                table counts <strong>calendar</strong> days. Counted in working days, 9 of the 12
                were on time. Labelling the result &ldquo;calendar days&rdquo; didn&apos;t help: the
                model gave almost the same answer.
              </p>
              <SqlRunner initial={WORKING} />
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        The hardest question needs both tools: the promise is in the rules, the reality in the
        register. We wrote a correct-looking query, gave the model both results, and asked.
      </p>
      <p>
        Nothing crashed, and the SQL did exactly what it said. The mistake was in the meaning:
        &ldquo;15 days&rdquo; in one place and &ldquo;15 working days&rdquo; in the other. A prompt
        can&apos;t reliably fix that. The data should: a <code>working_days</code> column, or a view
        with a named, agreed measure, known as a <Term id="semantic-layer">semantic layer</Term>.
      </p>
      <p>The working-days count here ignores public holidays, to keep it simple.</p>
    </StepLayout>
  );
}

/* 6 ─ Keep the SQL on a leash ------------------------------------------------------------------- */

const LEASH: [string, string][] = [
  [
    "A database user that can only read",
    "Only the views it needs. A line in the prompt saying “never DELETE” is a request, not a lock.",
  ],
  ["Limits", "Cap rows returned and running time, so one bad query can't stall the database."],
  [
    "Named, described views",
    "Clear column names, allowed values and agreed measures, like “working days”.",
  ],
  [
    "Show the SQL",
    "Let people see the query behind a number, and ask back when “last month” is ambiguous.",
  ],
];

const PLATFORMS =
  "Amazon Bedrock Knowledge Bases (Redshift) · Google Conversational Analytics API, BigQuery data canvas · Microsoft Fabric data agents · Snowflake Cortex Analyst and Agents · Databricks Genie Agents · open source: Vanna, LangChain, LlamaIndex";

export function Leash() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keep the SQL on a leash"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {LEASH.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                className="border-line bg-surface rounded-xl border px-3 py-2"
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted mt-0.5 text-xs">{d}</p>
              </motion.div>
            ))}
          </div>
          <p className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-[11px]">
            <span className="font-medium">Managed options: </span>
            {PLATFORMS}
          </p>
        </div>
      }
    >
      <p>
        Treat model-written SQL like code from a stranger. The OWASP Top 10 for LLM applications
        warns against trusting model output and against giving the model more power than it needs.
        The database, not the prompt, has to enforce the rules. Even read-only access can leak rows
        a user shouldn&apos;t see.
      </p>
      <p>
        How good is text-to-SQL? On tidy benchmark databases with hints, the best systems are right
        about 80% of the time. On real company warehouses, one 2026 study found about 11%. Vendors
        report higher numbers after careful set-up, on their own tests.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Search finds; SQL counts", "How many, how much, which is biggest: ask the database."],
  ["Describe the data", "Column meanings and allowed values turn guesses into queries."],
  ["Wrong SQL often runs", "Show the query; check the meaning, not just that it worked."],
  ["The database enforces safety", "Read-only views, limits and least privilege, not prompts."],
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
        Next: questions about the whole collection at once, like &ldquo;what are the main complaints
        across all wards?&rdquo;, and how knowledge graphs help.
      </p>
    </StepLayout>
  );
}
