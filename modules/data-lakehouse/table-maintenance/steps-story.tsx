"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { fmtGB, fmtN, fmtS, NO_MAINTENANCE, simulate, type MonthState } from "./life";

/* 2 ─ Six months in a table's life ⭐ -------------------------------------------------------- */

const NONE = simulate(NO_MAINTENANCE);
const HEALTHY = simulate({ compact: true, retentionDays: 7, orphans: true });
const MAX_GB = NONE[6].storageGB;

function Snapshot({
  s,
  highlight,
}: {
  s: MonthState;
  highlight?: "files" | "old" | "orphans" | "all";
}) {
  const parts: [string, number, string, string][] = [
    ["Live table", s.liveGB, "bg-viz-data", "live"],
    ["Old versions", s.oldVersionsGB, "bg-viz-remove/70", "old"],
    ["Orphaned files", s.orphanGB, "bg-bad", "orphans"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-1">
      <div>
        <p className="text-muted mb-1.5 text-xs">
          Storage used: <strong className="text-fg font-mono">{fmtGB(s.storageGB)}</strong>
        </p>
        <div className="bg-surface-2 flex h-6 overflow-hidden rounded-lg">
          {parts.map(([label, gb, cls, key]) => (
            <motion.div
              key={label}
              className={cn(
                cls,
                highlight &&
                  highlight !== "all" &&
                  highlight !== key &&
                  key !== "live" &&
                  "opacity-40",
              )}
              initial={false}
              animate={{ width: `${(gb / MAX_GB) * 100}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            />
          ))}
        </div>
        <ul className="text-muted mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px]">
          {parts.map(([label, gb, cls]) => (
            <li key={label} className="flex items-center gap-1">
              <span className={cn("size-2 rounded-sm", cls)} />
              {label} {fmtGB(gb)}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Tile label="Data files" value={fmtN(s.files)} hot={highlight === "files"} />
        <Tile label="A 30-day query" value={fmtS(s.querySeconds)} hot={highlight === "files"} />
        <Tile
          label="Time travel back"
          value={s.timeTravelDays === null ? "–" : `${s.timeTravelDays} days`}
        />
      </div>
    </div>
  );
}

function Tile({ label, value, hot }: { label: string; value: string; hot?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-2.5 py-2",
        hot ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px] leading-tight">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-base font-semibold tabular-nums"
      >
        {value}
      </motion.p>
    </div>
  );
}

const SCENES: { s: MonthState; highlight?: "files" | "old" | "orphans" | "all" }[] = [
  { s: NONE[0] },
  { s: NONE[1], highlight: "files" },
  { s: NONE[2], highlight: "old" },
  { s: NONE[3], highlight: "orphans" },
  { s: NONE[6], highlight: "all" },
  { s: HEALTHY[6] },
];

const SECTIONS: StorySection[] = [
  {
    id: "m0",
    kicker: "Month 0",
    title: "A healthy table",
    body: (
      <>
        <p>
          Meet Brewline&apos;s <code>orders</code> table: one terabyte in well-sized files. A query
          over the last 30 days takes about 16 seconds.
        </p>
        <p>Now let it run for six months, with nobody doing any maintenance.</p>
      </>
    ),
  },
  {
    id: "m1",
    kicker: "Month 1",
    title: "Streaming arrives",
    body: (
      <>
        <p>
          New orders now stream in every minute. Each micro-batch writes a small file of a couple of
          megabytes: 43,000 of them a month.
        </p>
        <p>
          The same 30-day query now opens tens of thousands of files instead of a few hundred.
          That&apos;s the <Term id="small-files">small-files problem</Term>, and it doubles the
          query time.
        </p>
      </>
    ),
  },
  {
    id: "m2",
    kicker: "Month 2",
    title: "Every MERGE leaves a copy behind",
    body: (
      <>
        <p>
          A nightly MERGE applies corrections, rewriting about 20 GB of files. The replaced files
          aren&apos;t deleted: they stay for <Term id="time-travel">time travel</Term>.
        </p>
        <p>Storage is already double the size of the live table.</p>
      </>
    ),
  },
  {
    id: "m3",
    kicker: "Month 3",
    title: "Failed jobs leave debris",
    body: (
      <>
        <p>
          A couple of jobs a month crash halfway. The files they wrote were never committed, so no
          version of the table points to them. They&apos;re{" "}
          <Term id="orphan-files">orphan files</Term>: invisible to queries, but still billed.
        </p>
      </>
    ),
  },
  {
    id: "m6",
    kicker: "Month 6",
    title: "The bill arrives",
    body: (
      <>
        <p>
          After six months: 1.6 TB of real data, but over 5 TB of storage. A quarter of a million
          files. Queries twice as slow as on day one.
        </p>
        <p>
          Nothing is broken. Every one of these files exists for a reason, or did once. That&apos;s
          why maintenance is routine work, not a repair.
        </p>
      </>
    ),
  },
  {
    id: "fixed",
    kicker: "Maintenance",
    title: "The same six months, maintained",
    body: (
      <>
        <p>
          Now replay it with three routine jobs: weekly <Term id="compaction">compaction</Term>,
          removal of old versions after 7 days, and orphan clean-up.
        </p>
        <p>
          Storage stays close to the live table, queries stay fast. The price: time travel only
          reaches back a week. Next, you&apos;ll set the policy yourself.
        </p>
      </>
    ),
  },
];

export function SixMonths() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Snapshot {...SCENES[i]} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Six months in a table&apos;s life
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Watch clutter pile up month by month. The numbers come from the simple model you&apos;ll
            control in the next step.
          </p>
        </div>
      }
    />
  );
}
