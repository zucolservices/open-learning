"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Newspaper, Play, RotateCcw, Trophy } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LANES, MAX_S, MIN_S, pos, type Kind } from "./lanes";
import type { RtState } from "./state";

/* 1 ─ Scoreboard or newspaper ------------------------------------------------------------------ */

export function Scoreboard() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Scoreboard or newspaper"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            {
              icon: Trophy,
              t: "The stadium scoreboard",
              d: "Updates within seconds of every ball. Fifty thousand people read it at once. It answers simple questions: score, overs, run rate.",
              tag: "Real-time analytics store",
            },
            {
              icon: Newspaper,
              t: "Tomorrow's newspaper",
              d: "Deep analysis, every statistic, the history of both teams. But it arrives the next morning.",
              tag: "Lakehouse or warehouse",
            },
          ].map(({ icon: Icon, t, d, tag }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-4"
            >
              <Icon className="text-accent size-6" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
              <p className="mt-auto text-xs font-semibold">{tag}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Some questions are about right now, asked by many people at once: a restaurant owner
        checking today&apos;s orders, an engineer searching the last ten minutes of logs. A
        lakehouse table that is five minutes old, with queries taking seconds, isn&apos;t good
        enough.
      </p>
      <p>
        <Term id="real-time-olap">Real-time analytics stores</Term> (ClickHouse, Apache Druid,
        Apache Pinot and others) read straight from a stream and answer aggregations in
        milliseconds, for thousands of queries a second.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Race to the dashboard ⭐ -------------------------------------------------------------------- */

const KIND: Record<Kind, { cls: string; label: string }> = {
  olap: { cls: "bg-viz-compute", label: "Real-time OLAP" },
  search: { cls: "bg-viz-meta", label: "Search engine" },
  warehouse: { cls: "bg-viz-data", label: "Warehouse streaming" },
  lakehouse: { cls: "bg-viz-idle", label: "Lakehouse table" },
};

const TICKS: [number, string][] = [
  [1, "1 s"],
  [10, "10 s"],
  [60, "1 min"],
  [600, "10 min"],
];

function fmt(s: number) {
  if (s < 60) return `${s < 10 ? s.toFixed(1) : Math.round(s)} s`;
  return `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`;
}

export function Race() {
  const [p, setP] = useState(0); // 0..1 along the log axis
  const [running, setRunning] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    const start = performance.now() - p * 6000;
    const tick = (now: number) => {
      const next = Math.min(1, (now - start) / 6000);
      setP(next);
      if (next < 1) raf.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const t = Math.exp(Math.log(MIN_S) + p * (Math.log(MAX_S) - Math.log(MIN_S)));
  const sel = LANES.find((l) => l.id === picked);
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Race to the dashboard"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (p >= 1) setP(0);
                setRunning(true);
              }}
              disabled={running}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm disabled:opacity-50"
            >
              {p >= 1 ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
              {p >= 1 ? "Replay" : "Publish an event"}
            </button>
            <span className="font-mono text-sm">t = {p === 0 ? "0 s" : fmt(t)}</span>
          </div>
          <div className="relative flex flex-col gap-1.5">
            {LANES.map((l) => {
              const reached = p > 0 && t >= l.seconds;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setPicked(l.id)}
                  className={cn(
                    "grid grid-cols-[8rem_1fr] items-center gap-2 rounded text-left sm:grid-cols-[13rem_1fr]",
                    picked === l.id && "ring-accent ring-1",
                  )}
                >
                  <span
                    className={cn(
                      "truncate text-[11px]",
                      reached ? "text-fg font-semibold" : "text-muted",
                    )}
                  >
                    <span className="sm:hidden">{l.short}</span>
                    <span className="hidden sm:inline">{l.name}</span>
                  </span>
                  <span className="bg-surface-2 relative h-4 rounded">
                    <motion.span
                      className={cn("absolute top-0 left-0 h-4 rounded", KIND[l.kind].cls)}
                      style={{
                        width: `${Math.min(p, pos(l.seconds)) * 100}%`,
                        opacity: reached ? 1 : 0.45,
                      }}
                    />
                    {reached && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-0 font-mono text-[9px] leading-4 whitespace-nowrap"
                        style={{ left: `calc(${pos(l.seconds) * 100}% + 4px)` }}
                      >
                        {l.label}
                      </motion.span>
                    )}
                  </span>
                </button>
              );
            })}
            <div className="grid grid-cols-[8rem_1fr] gap-2 sm:grid-cols-[13rem_1fr]">
              <span />
              <span className="relative h-3">
                {TICKS.map(([s, l]) => (
                  <span
                    key={l}
                    className="text-subtle absolute font-mono text-[9px] whitespace-nowrap"
                    style={{ left: `${pos(s) * 100}%`, transform: "translateX(-50%)" }}
                  >
                    {l}
                  </span>
                ))}
              </span>
            </div>
          </div>
          <div className="text-muted flex flex-wrap gap-3 text-[10px]">
            {(Object.keys(KIND) as Kind[]).map((k) => (
              <span key={k} className="flex items-center gap-1">
                <span className={cn("size-2.5 rounded-sm", KIND[k].cls)} /> {KIND[k].label}
              </span>
            ))}
          </div>
          <p className="border-line bg-surface min-h-12 rounded-lg border px-3 py-2 text-xs">
            {sel ? (
              <>
                <span className="font-semibold">{sel.name}: </span>
                {sel.note}
              </>
            ) : (
              "Tap a lane for its source."
            )}
          </p>
        </div>
      }
    >
      <p>
        An order is published at t = 0. When can a dashboard first count it? Press publish and watch
        each path catch up; the time axis is logarithmic, so each tick is ten times the last.
      </p>
      <p>
        Times are documented defaults or published figures, not benchmarks. The pattern holds:
        stores that ingest directly answer within seconds; tables that wait for a{" "}
        <Term id="commit-interval">commit</Term> lag by minutes. Zomato saw both: an S3-and-Trino
        attempt lagged 5–10 minutes, ClickHouse under 5 seconds.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why they're fast ⭐ ------------------------------------------------------------------------ */

const FAST = [
  {
    title: "Start: every row, every column",
    text: '"Orders per city in the last 15 minutes" over a billion order events with 40 columns. Read naively, that is all of it.',
    rows: 1_000_000_000,
    cols: 40,
  },
  {
    title: "Time pruning",
    text: "Data is stored in chunks by time (Druid segments, Pinot segments, ClickHouse partitions). The query touches only the chunks covering the last 15 minutes.",
    rows: 3_000_000,
    cols: 40,
  },
  {
    title: "Columnar storage",
    text: "Only the two columns the query needs (time, city) are read from disk, not all 40.",
    rows: 3_000_000,
    cols: 2,
  },
  {
    title: "Indexes",
    text: "A sparse primary index (one entry per 8,192-row granule in ClickHouse) or inverted and star-tree indexes (Pinot) skip blocks that can't match.",
    rows: 1_000_000,
    cols: 2,
  },
  {
    title: "Rollup",
    text: "Druid can pre-aggregate at ingestion: one row per city per minute instead of one per order. Pinot's star-tree and ClickHouse's materialized views do similar work ahead of time.",
    rows: 15 * 400,
    cols: 2,
  },
] as const;

export function WhyFast() {
  const [s, set] = useSceneState<RtState>();
  const f = FAST[s.frame] ?? FAST[0];
  const cells = f.rows * f.cols;
  const frac = Math.max(0.004, Math.log10(cells) / Math.log10(FAST[0].rows * FAST[0].cols));
  return (
    <StepLayout
      eyebrow="Step through"
      title="Why they're fast"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Rows read</p>
              <p className="font-mono text-lg font-semibold">{f.rows.toLocaleString("en-US")}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Columns read</p>
              <p className="font-mono text-lg font-semibold">{f.cols}</p>
            </div>
          </div>
          <div>
            <p className="text-muted mb-1 text-[10px]">Values read (log scale)</p>
            <div className="bg-surface-2 h-4 rounded">
              <motion.div
                animate={{ width: `${frac * 100}%` }}
                className="bg-viz-data h-4 rounded"
              />
            </div>
            <p className="mt-1 font-mono text-xs">{cells.toLocaleString("en-US")}</p>
          </div>
          <FrameCaption
            frameKey={s.frame}
            title={f.title}
            tone={s.frame === FAST.length - 1 ? "good" : undefined}
          >
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={FAST.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        No magic: these stores avoid reading data. Each technique cuts the work by a large factor,
        and they multiply. Step through one query.
      </p>
      <p>
        The trade-off is flexibility. <Term id="rollup">Rollup</Term> throws away individual rows,
        and indexes must be chosen up front. Big joins and ad-hoc exploration still belong in the
        lakehouse. Numbers here are illustrative.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Meet the stores ----------------------------------------------------------------------------- */

const STORES: Record<string, { name: string; text: string; example: string }> = {
  clickhouse: {
    name: "ClickHouse",
    text: "Column store with MergeTree tables. Reads Kafka via the Kafka table engine plus a materialized view (ClickPipes on ClickHouse Cloud). Wants batches of at least 1,000 rows, ideally 10,000–100,000, about one insert a second, or async inserts. Apache 2.0.",
    example:
      "Zomato (2023): 150 million log lines a minute, over 50 TB a day, moved off Elasticsearch; max lag 5 s.",
  },
  druid: {
    name: "Apache Druid",
    text: "Kafka and Kinesis supervisors with exactly-once ingestion. Data is split into time chunks; rollup can pre-aggregate on the way in. Real-time segments are served immediately, then handed off to historical nodes. Version 38 (October 2026).",
    example:
      "Druid's own docs promise queries in \"sub-second to a few seconds\". Imply, founded by Druid's creators in 2015, sells it as a service.",
  },
  pinot: {
    name: "Apache Pinot",
    text: "Built at LinkedIn for user-facing analytics. Real-time tables consume each Kafka, Kinesis or Pulsar partition; consuming segments are queryable. Upserts, inverted and star-tree indexes. Pauseless consumption (1.4) removed the gap while segments are built.",
    example:
      "LinkedIn (2015): thousands of queries a second for 25+ products like Who Viewed My Profile. Uber Eats Restaurant Manager (2017): p99 under 100 ms at 1,000 queries/s on three servers.",
  },
  others: {
    name: "And others",
    text: "StarRocks and Apache Doris (Routine Load from Kafka); Tinybird (ClickHouse as a service); Elasticsearch/OpenSearch for logs; Azure Data Explorer and Fabric Eventhouse (KQL; batches by default up to 5 min, 500 items or 1 GB); Redshift streaming materialized views; BigQuery Storage Write API and continuous queries.",
    example:
      "Choose for the long run: Rockset was bought by OpenAI in June 2024 and its service shut down; Amazon Timestream for LiveAnalytics closed to new customers in June 2025.",
  },
};

export function Stores() {
  const [s, set] = useSceneState<RtState>();
  const st = STORES[s.store] ?? STORES.clickhouse;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Meet the stores"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(STORES).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ store: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.store === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
          <motion.div
            key={s.store}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex flex-col gap-3 rounded-xl border px-4 py-4"
          >
            <p className="text-lg font-semibold">{st.name}</p>
            <p className="text-sm">{st.text}</p>
            <p className="border-accent/40 bg-accent-soft rounded-lg border px-3 py-2 text-xs">
              {st.example}
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Three open-source stores dominate, all <Term id="columnar">columnar</Term> and all able to
        read from Kafka directly. They differ in how they ingest, update and index.
      </p>
      <p>
        Cloud warehouses have closed some of the gap: Snowpipe Streaming and BigQuery&apos;s Storage
        Write API make rows queryable in seconds. The real-time stores still win on many small
        queries a second at steady low latency.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Where should it live? ---------------------------------------------------------------------- */

export function WhereLive() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where should it live?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="where-live"
            prompt="Which fits each need best?"
            categories={[
              { id: "lake", label: "Lakehouse table" },
              { id: "olap", label: "Real-time analytics store" },
              { id: "stream", label: "Stream processor" },
            ]}
            items={[
              {
                id: "month",
                label: "Finance's month-end revenue report",
                category: "lake",
                why: "Minutes-old data is plenty; full history and joins matter more.",
              },
              {
                id: "owners",
                label: "An app showing each restaurant owner today's orders, for 300,000 owners",
                category: "olap",
                why: "Fresh data, many small queries at once: what Pinot was built for.",
              },
              {
                id: "fraud",
                label: "Block a card used in two cities within five minutes",
                category: "stream",
                why: "It's a reaction to each event, not a query someone runs. Flink or Kafka Streams (modules 11–14).",
              },
              {
                id: "train",
                label: "Train a model on two years of payments",
                category: "lake",
                why: "Huge scans of history; freshness doesn't matter.",
              },
              {
                id: "logs",
                label: "Engineers searching the last ten minutes of 150 million log lines a minute",
                category: "olap",
                why: "Zomato's case: ClickHouse with a few seconds' lag.",
              },
            ]}
            explanation="Ask how fresh, how many queries a second, and whether anyone is even asking a question, or whether the system should just react."
          />
        </div>
      }
    >
      <p>Five needs. Where should each one&apos;s data live?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Ingest directly, query in seconds",
    "ClickHouse, Druid and Pinot read Kafka without waiting for a commit.",
  ],
  ["Fast by reading less", "Time pruning, columns, indexes and rollup."],
  ["Built for many small queries", "User-facing dashboards with thousands of queries a second."],
  ["The lakehouse is often enough", "If minutes are fine, keep one copy and skip another system."],
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
      <p>Next: event-driven patterns that build whole systems from streams.</p>
    </StepLayout>
  );
}
