"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 2 ─ Keeping the promises without a server ⭐ ----------------------------------- */

function Letter({ l, word }: { l: string; word: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-accent text-4xl font-semibold">{l}</span>
      <span className="text-muted text-sm">{word}</span>
    </div>
  );
}

function SceneNoServer() {
  const db = ["storage", "compute", "transaction manager", "lock manager"];
  const lake = [
    ["object storage", "bg-viz-data/15 border-viz-data/50"],
    ["engines (Spark, Trino…)", "bg-viz-compute/15 border-viz-compute/50"],
    ["table format metadata", "bg-viz-meta/15 border-viz-meta/50"],
    ["one atomic commit", "bg-accent-soft border-accent/50"],
  ];
  return (
    <div className="grid h-full grid-cols-2 content-center gap-4">
      <div>
        <p className="text-muted mb-2 text-center text-xs">A database</p>
        <div className="border-line-strong bg-surface rounded-2xl border p-2">
          {db.map((d) => (
            <div
              key={d}
              className="border-line m-1 rounded-lg border px-2 py-2 text-center text-[11px]"
            >
              {d}
            </div>
          ))}
          <p className="text-subtle mt-1 text-center text-[10px]">one server does it all</p>
        </div>
      </div>
      <div>
        <p className="text-muted mb-2 text-center text-xs">A lakehouse</p>
        <div className="grid gap-1.5">
          {lake.map(([d, cls], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn("rounded-lg border px-2 py-2 text-center text-[11px]", cls)}
            >
              {d}
            </motion.div>
          ))}
          <p className="text-subtle mt-1 text-center text-[10px]">
            separate pieces, no central server
          </p>
        </div>
      </div>
    </div>
  );
}

function SceneAtomic() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <Letter l="A" word="Atomic" />
      <div className="flex flex-wrap gap-1.5">
        {["part-001.parquet", "part-002.parquet", "part-003.parquet"].map((f, i) => (
          <motion.span
            key={f}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.15 * i }}
            className="border-viz-data/50 bg-viz-data/10 rounded border border-dashed px-2 py-1 font-mono text-[10px]"
          >
            {f}
          </motion.span>
        ))}
        <span className="text-subtle self-center text-[10px]">written, but invisible</span>
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="border-accent bg-accent-soft rounded-xl border px-3 py-2 text-sm"
      >
        One small atomic write makes them all visible at once:
        <ul className="text-muted mt-1 font-mono text-[10px]">
          <li>Delta: create _delta_log/…0011.json only if absent</li>
          <li>Iceberg: swap the catalog pointer only if unchanged</li>
          <li>Hudi: complete the instant on the timeline</li>
        </ul>
      </motion.div>
    </div>
  );
}

function SceneConsistent() {
  const checks = [
    ["Schema", "amount must be an integer", "good"],
    ["NOT NULL", "order_id can't be missing", "good"],
    ["CHECK (Delta)", "amount >= 0", "bad"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <Letter l="C" word="Consistent" />
      {checks.map(([name, rule, res], i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 * i }}
          className={cn(
            "flex items-center justify-between rounded-xl border px-3 py-2 text-sm",
            res === "good" ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
          )}
        >
          <span>
            <span className="font-semibold">{name}</span>{" "}
            <span className="text-muted text-xs">{rule}</span>
          </span>
          <span className="font-mono text-[11px]">
            {res === "good" ? "✓ pass" : "✗ −40: write rejected"}
          </span>
        </motion.div>
      ))}
      <p className="text-subtle text-[11px]">
        Checked by the writer before it commits. A failed check means no commit.
      </p>
    </div>
  );
}

function SceneIsolated() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <Letter l="I" word="Isolated" />
      <div className="border-line bg-bg/40 rounded-xl border p-3 font-mono text-[11px]">
        {[
          ["0s", "Reader starts: reads version v10", "compute"],
          ["4s", "Writer commits v11", "meta"],
          ["9s", "Reader finishes, still on v10", "compute"],
        ].map(([t, what, tone], i) => (
          <motion.p
            key={t}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 * i }}
            className={cn("py-0.5", tone === "compute" ? "text-viz-compute" : "text-viz-meta")}
          >
            {t.padStart(3)} · {what}
          </motion.p>
        ))}
      </div>
      <p className="text-muted text-xs">
        Readers pin one version and see it whole. Writers never block readers, and readers never
        block writers.
      </p>
    </div>
  );
}

function SceneDurable() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <Letter l="D" word="Durable" />
      <div className="flex gap-3">
        {["Zone 1", "Zone 2", "Zone 3"].map((z, i) => (
          <motion.div
            key={z}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
            className="border-viz-data/50 bg-viz-data/10 rounded-xl border px-3 py-3 text-center"
          >
            <p className="text-[11px] font-semibold">{z}</p>
            <p className="text-muted font-mono text-[10px]">…0011.json ✓</p>
          </motion.div>
        ))}
      </div>
      <p className="text-muted max-w-xs text-center text-xs">
        Object storage keeps copies across several data centres before it acknowledges the write.
      </p>
    </div>
  );
}

function SceneReferee() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex gap-3">
        {["Writer A", "Writer B"].map((w, i) => (
          <motion.span
            key={w}
            initial={{ x: i === 0 ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="border-viz-compute/60 bg-viz-compute/15 rounded-lg border px-3 py-1.5 text-sm"
          >
            {w}
          </motion.span>
        ))}
      </div>
      <p className="text-subtle text-xs">both want to create version v11</p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="border-accent bg-accent-soft rounded-xl border px-4 py-2 text-center text-sm"
      >
        The referee lets exactly one win
        <span className="text-muted block text-[11px]">storage, catalog or lock service</span>
      </motion.div>
    </div>
  );
}

const SCENES = [
  SceneNoServer,
  SceneAtomic,
  SceneConsistent,
  SceneIsolated,
  SceneDurable,
  SceneReferee,
];

const SECTIONS: StorySection[] = [
  {
    id: "no-server",
    kicker: "The challenge",
    title: "No server to keep the promises",
    body: (
      <>
        <p>
          In a database, one server owns the data and coordinates every change, so it can keep all
          four promises itself.
        </p>
        <p>
          A lakehouse has no such server. Files sit in object storage, many engines read and write
          them, and nothing sits in the middle. So how can it be ACID?
        </p>
      </>
    ),
  },
  {
    id: "atomic",
    kicker: "Atomic",
    title: "Everything hangs on one tiny write",
    body: (
      <>
        <p>
          A writer can create as many data files as it likes. None of them count until the commit: a
          single small write that storage or a catalog performs <Term id="atomic">atomically</Term>.
        </p>
        <p>
          If the job crashes before that write, the new files are simply orphans that no version
          points to. There&apos;s never a half-committed change to undo.
        </p>
      </>
    ),
  },
  {
    id: "consistent",
    kicker: "Consistent",
    title: "Checks before the commit",
    body: (
      <>
        <p>
          Consistency means the table&apos;s rules hold. The writer enforces them before committing:
          the data must match the schema, required columns must be present, and in Delta, CHECK
          constraints must pass.
        </p>
        <p>One bad row fails the whole write, and nothing is committed.</p>
      </>
    ),
  },
  {
    id: "isolated",
    kicker: "Isolated",
    title: "Readers see a snapshot",
    body: (
      <>
        <p>
          Because files are never changed in place, every version of the table stays readable until
          clean-up. A reader picks one version at the start and sees exactly that, even if new
          versions are committed while it runs.
        </p>
        <p>
          Isolation between two <em>writers</em> is harder. That&apos;s the rest of this module.
        </p>
      </>
    ),
  },
  {
    id: "durable",
    kicker: "Durable",
    title: "Borrowed from object storage",
    body: (
      <>
        <p>
          Durability comes almost for free. Services like Amazon S3 are designed to keep data
          extremely safely by storing it redundantly across several facilities, and they only
          confirm a write once it&apos;s stored.
        </p>
        <p>A commit is durable the moment its commit write is acknowledged.</p>
      </>
    ),
  },
  {
    id: "referee",
    kicker: "The referee",
    title: "Someone must pick one winner",
    body: (
      <>
        <p>
          Everything rests on that one atomic commit. When two writers try to create the same next
          version, something must guarantee that exactly one succeeds: a conditional write in
          storage, a pointer swap in a catalog, or a lock.
        </p>
        <p>What happens to the loser is what you&apos;ll explore next.</p>
      </>
    ),
  },
];

export function WithoutAServer() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => {
        const Scene = SCENES[i];
        return <Scene />;
      }}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Keeping the promises without a server
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            The same four letters, on plain cloud storage. Scroll slowly.
          </p>
        </div>
      }
    />
  );
}
