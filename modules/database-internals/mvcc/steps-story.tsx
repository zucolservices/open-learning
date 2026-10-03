"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/** A noticeboard of timetable sheets: which are pinned, faded or gone, per section. */
const SHEETS = [
  { label: "Timetable", date: "June", text: "Bus 7 · 08:10" },
  { label: "Timetable", date: "July", text: "Bus 7 · 08:25" },
];

function Scene({ index }: { index: number }) {
  // 0: one sheet. 1: new sheet pinned beside. 2: readers. 3: old one taken down.
  const showNew = index >= 1;
  const oldGone = index >= 3;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="border-line bg-surface-2 flex min-h-44 w-full max-w-md items-center justify-center gap-4 rounded-xl border p-4">
        {SHEETS.map((s, i) => {
          const visible = i === 0 ? !oldGone : showNew;
          return (
            <motion.div
              key={s.date}
              animate={{
                opacity: visible ? (i === 0 && showNew ? 0.55 : 1) : 0,
                y: visible ? 0 : -10,
              }}
              className={cn(
                "bg-surface w-36 rounded-lg border px-3 py-3 shadow-sm",
                i === 1 ? "border-accent" : "border-line",
              )}
            >
              <p className="text-muted text-[10px]">
                {s.label} · from {s.date}
              </p>
              <p className="mt-1 font-mono text-sm">{s.text}</p>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        animate={{ opacity: index === 2 ? 1 : 0 }}
        className="text-muted flex gap-6 text-xs"
      >
        <span>Arrived in June → reads the June sheet</span>
        <span className="text-accent">Arrived in July → reads July</span>
      </motion.div>
      <motion.div
        animate={{ opacity: index >= 4 ? 1 : 0 }}
        className="grid w-full max-w-md grid-cols-2 gap-2 text-xs"
      >
        <div
          className={cn(
            "rounded-lg border px-3 py-2",
            index === 4 ? "border-accent bg-accent-soft" : "border-line bg-surface",
          )}
        >
          <p className="font-semibold">PostgreSQL</p>
          <p className="text-muted">Old versions stay in the table; VACUUM removes them.</p>
        </div>
        <div
          className={cn(
            "rounded-lg border px-3 py-2",
            index === 5 ? "border-accent bg-accent-soft" : "border-line bg-surface",
          )}
        >
          <p className="font-semibold">InnoDB, Oracle</p>
          <p className="text-muted">Old values go to an undo log, used to rebuild past versions.</p>
        </div>
      </motion.div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "idea",
    kicker: "The idea",
    title: "Don't rub it out",
    body: (
      <p>
        A bus station noticeboard has the timetable pinned up. When it changes, the clerk could take
        the old sheet down while you&apos;re halfway through reading it. Or they could pin the new
        sheet beside it, dated, and let you finish.
      </p>
    ),
  },
  {
    id: "versions",
    kicker: "Versions",
    title: "Write a new copy",
    body: (
      <p>
        <Term id="mvcc">Multi-version concurrency control</Term> (MVCC) does the second. An update
        doesn&apos;t overwrite a row; it writes a new version and keeps the old one for a while.
        Every version records which transaction created it and which replaced it.
      </p>
    ),
  },
  {
    id: "snapshots",
    kicker: "Snapshots",
    title: "Everyone reads their own moment",
    body: (
      <p>
        Each statement or transaction gets a <Term id="snapshot">snapshot</Term>: in the PostgreSQL
        docs&apos; words, it &ldquo;sees a snapshot of data (a database version) as it was some time
        ago, regardless of the current state of the underlying data.&rdquo; The result:
        &ldquo;reading never blocks writing and writing never blocks reading.&rdquo;
      </p>
    ),
  },
  {
    id: "cleanup",
    kicker: "Cleanup",
    title: "Take down old sheets",
    body: (
      <p>
        Old versions pile up, so someone has to remove them once no one can still be reading them.
        Two writers changing the same row still queue up, though: MVCC frees readers, not
        conflicting writers.
      </p>
    ),
  },
  {
    id: "pg",
    kicker: "Two designs",
    title: "Keep them in the table",
    body: (
      <p>
        PostgreSQL keeps every version in the table itself and cleans up with{" "}
        <Term id="vacuum-pg">VACUUM</Term>. Simple and fast to roll back, but tables can swell if
        cleanup falls behind.
      </p>
    ),
  },
  {
    id: "undo",
    kicker: "Two designs",
    title: "Keep them in an undo log",
    body: (
      <p>
        MySQL&apos;s InnoDB and Oracle update the row in place and copy the old values into an{" "}
        <Term id="undo-log">undo log</Term>. A reader that needs the past rebuilds it from there.
        The idea goes back to David Reed&apos;s work at MIT in 1978; Bernstein and Goodman laid out
        its theory in 1983.
      </p>
    ),
  },
];

export function ManyVersions() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Many versions</h2>
          <p className="text-muted mt-3 text-[15px]">
            How databases let readers and writers pass each other.
          </p>
        </div>
      }
    />
  );
}
