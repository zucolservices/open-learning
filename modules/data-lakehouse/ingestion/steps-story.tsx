"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 1 ─ One event's journey ⭐ ----------------------------------------------------------------------- */

const HOPS = [
  { id: "phone", label: "Phone app", note: "Priya taps “Add to cart”", ms: "0 s" },
  { id: "api", label: "Brewline API", note: "turns the tap into an event", ms: "+0.05 s" },
  {
    id: "kafka",
    label: "Kafka topic: app-events",
    note: "partition 3, offset 88,214,501",
    ms: "+0.1 s",
  },
  { id: "job", label: "Streaming job", note: "waits for the next micro-batch", ms: "+0 to 60 s" },
  { id: "files", label: "Parquet files", note: "the batch is written to storage", ms: "+2 s" },
  { id: "commit", label: "Table commit", note: "bronze.app_events version 51,203", ms: "+0.2 s" },
  { id: "query", label: "Analyst's query", note: "sees the event", ms: "done" },
];

function Scene({ upTo }: { upTo: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {HOPS.map((h, i) => {
        const on = i <= upTo;
        return (
          <motion.div
            key={h.id}
            initial={false}
            animate={{ opacity: on ? 1 : 0.25, x: on ? 0 : -6 }}
            transition={{ delay: 0.05 * i }}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-1.5",
              i === upTo
                ? "border-accent bg-accent-soft"
                : on
                  ? "border-line bg-surface"
                  : "border-line border-dashed",
            )}
          >
            <span className="w-32 shrink-0 text-xs font-semibold sm:w-40">{h.label}</span>
            <span className="text-muted min-w-0 flex-1 truncate text-[11px]">{h.note}</span>
            <span className="text-subtle shrink-0 font-mono text-[10px]">{h.ms}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

const STAGE_FOR_SECTION = [1, 2, 3, 5, 6];

const SECTIONS: StorySection[] = [
  {
    id: "tap",
    kicker: "The tap",
    title: "It starts on a phone",
    body: (
      <>
        <p>
          Priya adds a latte to her cart. The app sends a tiny message, an <em>event</em>, to
          Brewline&apos;s servers: who, what, when.
        </p>
        <p>Thousands of these arrive every second. Let&apos;s follow this one.</p>
      </>
    ),
  },
  {
    id: "kafka",
    kicker: "The log",
    title: "Landing in Kafka",
    body: (
      <>
        <p>
          The event is appended to a <Term id="kafka">Kafka</Term> topic: an ordered, durable log
          split into partitions. It gets an <em>offset</em>, its position in the log.
        </p>
        <p>
          Kafka keeps events for a set retention period even after they&apos;re read, so a reader
          that crashes can go back and read them again.
        </p>
      </>
    ),
  },
  {
    id: "job",
    kicker: "The wait",
    title: "Waiting for the next batch",
    body: (
      <>
        <p>
          A streaming job reads the topic in <Term id="micro-batch">micro-batches</Term>: every
          minute, it takes everything new since the last offset it processed.
        </p>
        <p>This wait is usually the biggest part of the delay, and you choose its length.</p>
      </>
    ),
  },
  {
    id: "commit",
    kicker: "The write",
    title: "Files, then a commit",
    body: (
      <>
        <p>
          The job writes the batch as Parquet files, then commits a new table version. Only at the
          commit does the event become visible to anyone.
        </p>
        <p>
          It also records which offsets it has processed, in its checkpoint, so a restart won&apos;t
          skip or repeat events.
        </p>
      </>
    ),
  },
  {
    id: "query",
    kicker: "Queryable",
    title: "About a minute later",
    body: (
      <>
        <p>
          An analyst&apos;s query now includes Priya&apos;s tap. End to end: roughly the batch
          interval plus a couple of seconds.
        </p>
        <p>
          Want it faster? Shorten the interval. But every batch writes new files, as you&apos;re
          about to see.
        </p>
      </>
    ),
  },
];

export function EventJourney() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene upTo={STAGE_FOR_SECTION[i]} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            One event&apos;s journey
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            From a tap on a phone to a row in a lakehouse table. Scroll to follow it.
          </p>
        </div>
      }
    />
  );
}
