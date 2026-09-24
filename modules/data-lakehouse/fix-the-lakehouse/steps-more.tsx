"use client";

import { motion } from "motion/react";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";

/* 3 ─ Checkpoint: why more workers disappointed --------------------------------------------------- */

export function WorkersCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why didn't more workers help?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="more-workers"
            prompt="Before you arrived, the team doubled the SQL cluster. Dashboards went from 92 to about 74 seconds, and the bill rose by a third. Why so little gain?"
            options={[
              {
                id: "waste",
                label:
                  "The time went on reading and planning millions of files the query didn't need; more workers just did that waste in parallel",
                correct: true,
                feedback:
                  "Right. Skipping work beats doing it faster: the filter rewrite and clustering removed most of the work instead.",
              },
              {
                id: "network",
                label: "The network was too slow for more workers",
                feedback:
                  "Nothing in the evidence points at the network. The evidence points at files and filters.",
              },
              {
                id: "format",
                label: "The table format limits how many workers can read it",
                feedback: "Open table formats scale to thousands of readers.",
              },
              {
                id: "cache",
                label: "Doubling workers clears the cache",
                feedback: "Not the main effect here.",
              },
            ]}
            explanation="Scale out only after you've removed wasted work. Look at files read, bytes scanned and pushed filters first."
          />
        </div>
      }
    >
      <p>The most common first instinct in data platforms.</p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: guardrails ----------------------------------------------------------------------- */

export function Guardrails() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="So it never happens again"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="guardrails"
            prompt="Each guardrail prevents one kind of problem. Which?"
            categories={[
              { id: "files", label: "Files & layout" },
              { id: "upkeep", label: "Upkeep" },
              { id: "queries", label: "Queries" },
              { id: "pipelines", label: "Pipelines" },
            ]}
            items={[
              {
                id: "alert",
                label: "An alert when a table's average file size drops below 32 MB",
                category: "files",
                why: "Catches small-file build-up weeks before users feel it.",
              },
              {
                id: "cluster",
                label: "Clustering on each big table's most-filtered column",
                category: "files",
                why: "Keeps min/max statistics useful as data grows.",
              },
              {
                id: "expiry",
                label:
                  "Scheduled snapshot expiry and orphan clean-up, with tags for anything to keep",
                category: "upkeep",
                why: "Stops storage growing with history nobody needs.",
              },
              {
                id: "explain",
                label: "Checking EXPLAIN for pushed filters before a dashboard goes live",
                category: "queries",
                why: "Functions on filter columns are caught in review, not in production.",
              },
              {
                id: "idempotent",
                label: "Every job writes with MERGE or partition overwrite, never plain append",
                category: "pipelines",
                why: "Retries and backfills become safe.",
              },
              {
                id: "test",
                label: "A data test that fails when silver has duplicate order_ids",
                category: "pipelines",
                why: "Catches the next duplicate bug the day it appears.",
              },
            ]}
            explanation="Lakehouses rarely break in one dramatic moment. They drift. Guardrails that measure the drift catch it while it's cheap to fix."
          />
        </div>
      }
    >
      <p>Fixing it once is good. Preventing it is better.</p>
    </StepLayout>
  );
}

/* 5 ─ The end of the track ----------------------------------------------------------------------- */

const JOURNEY = [
  ["Foundations", "Files, formats and why tables on object storage need more than Parquet."],
  ["Open table formats", "Delta, Iceberg and Hudi: logs, snapshots and timelines."],
  ["How tables behave", "ACID, updates and deletes, schema evolution."],
  ["Performance & layout", "Partitioning, clustering, data skipping, maintenance."],
  ["Catalogs & governance", "Catalogs, security and privacy."],
  ["Building pipelines", "Ingestion, CDC and the medallion architecture."],
  ["Querying & serving", "Query engines, hands-on SQL, BI, ML and AI."],
  ["Platforms & ecosystem", "AWS, Google Cloud, Azure, vendors and open source."],
  ["Capstone", "Designing a lakehouse, and fixing one."],
];

export function TrackEnd() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="The whole lakehouse"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-3">
          {JOURNEY.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2.5"
            >
              <p className="text-accent font-mono text-[10px]">Chapter {i + 1}</p>
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That&apos;s the last module of the Modern Data Lakehouse track. You started with files in a
        bucket and finished by designing a bank&apos;s lakehouse and rescuing a broken one.
      </p>
      <p>
        Everything here stays available: revisit any module, replay any simulation, or look up a
        term in the glossary whenever you need it.
      </p>
    </StepLayout>
  );
}
