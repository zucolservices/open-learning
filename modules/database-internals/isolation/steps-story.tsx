"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const COLS = ["Dirty read", "Non-repeatable read", "Phantom read", "Serialization anomaly"];
const ROWS: [string, string[]][] = [
  ["Read uncommitted", ["Allowed, not in PG", "Possible", "Possible", "Possible"]],
  ["Read committed", ["Not possible", "Possible", "Possible", "Possible"]],
  ["Repeatable read", ["Not possible", "Not possible", "Allowed, not in PG", "Possible"]],
  ["Serializable", ["Not possible", "Not possible", "Not possible", "Not possible"]],
];

function Scene({ index }: { index: number }) {
  // Sections 1–4 highlight one column; 0 and 5 show the whole table.
  const col = index >= 1 && index <= 4 ? index - 1 : -1;
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <div className="grid grid-cols-[6.5rem_repeat(4,1fr)] gap-1 text-[10px] sm:text-xs">
        <span />
        {COLS.map((c, j) => (
          <motion.span
            key={c}
            animate={{ opacity: col === -1 || col === j ? 1 : 0.35 }}
            className={cn("px-1 font-semibold", col === j && "text-accent")}
          >
            {c}
          </motion.span>
        ))}
        {ROWS.map(([lv, cells]) => (
          <div key={lv} className="contents">
            <span className="flex items-center font-mono">{lv}</span>
            {cells.map((v, j) => (
              <motion.span
                key={j}
                animate={{ opacity: col === -1 || col === j ? 1 : 0.25 }}
                className={cn(
                  "rounded-md border px-1.5 py-2",
                  v === "Not possible"
                    ? "border-good/40 bg-good/10"
                    : v === "Possible"
                      ? "border-bad/40 bg-bad/10"
                      : "border-line bg-surface",
                )}
              >
                {v}
              </motion.span>
            ))}
          </div>
        ))}
      </div>
      <p className="text-subtle text-[10px]">
        The four standard levels as summarised in the PostgreSQL docs (Table 13.1). &ldquo;Allowed,
        not in PG&rdquo;: the standard permits it, PostgreSQL doesn&apos;t.
      </p>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "idea",
    kicker: "The idea",
    title: "One counter, or many",
    body: (
      <>
        <p>
          A bank with one cashier and one ledger never gets confused: each customer is served start
          to finish before the next. But the queue is long. Open five counters sharing the same
          ledger and the queue moves, until two cashiers update the same page at once.
        </p>
        <p>
          Databases face the same choice. Running transactions strictly one at a time is always
          correct and painfully slow. An <Term id="isolation-level">isolation level</Term> says how
          much overlap is allowed, and so which glitches can slip through.
        </p>
      </>
    ),
  },
  {
    id: "dirty",
    kicker: "Glitch 1",
    title: "Dirty read",
    body: (
      <p>
        A <Term id="dirty-read">dirty read</Term>: &ldquo;A transaction reads data written by a
        concurrent uncommitted transaction.&rdquo; If that transaction then rolls back, you acted on
        a value that never really existed.
      </p>
    ),
  },
  {
    id: "nonrepeat",
    kicker: "Glitch 2",
    title: "Non-repeatable read",
    body: (
      <p>
        A <Term id="non-repeatable-read">non-repeatable read</Term>: you read a row, someone else
        changes it and commits, and reading it again inside the same transaction gives a different
        answer. A report that adds up figures can end up mixing two moments.
      </p>
    ),
  },
  {
    id: "phantom",
    kicker: "Glitch 3",
    title: "Phantom read",
    body: (
      <p>
        A <Term id="phantom-read">phantom read</Term>: you run the same search twice (say, all
        orders over ₹10,000) and new rows have appeared or vanished, because another transaction
        inserted or deleted some and committed.
      </p>
    ),
  },
  {
    id: "anomaly",
    kicker: "Glitch 4",
    title: "Serialization anomaly",
    body: (
      <p>
        The subtle one: &ldquo;The result of successfully committing a group of transactions is
        inconsistent with all possible orderings of running those transactions one at a time.&rdquo;
        Each transaction looks fine alone; together they break a rule. Only{" "}
        <Term id="serializable">serializable</Term> rules this out.
      </p>
    ),
  },
  {
    id: "ladder",
    kicker: "The ladder",
    title: "Four levels",
    body: (
      <>
        <p>
          The SQL standard defines four levels by which glitches each must prevent. A database may
          prevent more: PostgreSQL&apos;s read uncommitted behaves like read committed, and its
          repeatable read also stops phantoms.
        </p>
        <p>
          Read committed is PostgreSQL&apos;s default. In 1995 a famous paper, &ldquo;A Critique of
          ANSI SQL Isolation Levels&rdquo;, showed these four glitches miss some real problems, and
          named two you&apos;re about to meet: lost update and write skew.
        </p>
      </>
    ),
  },
];

export function FourGlitches() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Four glitches</h2>
          <p className="text-muted mt-3 text-[15px]">
            What can go wrong when transactions overlap, and how much each isolation level allows.
          </p>
        </div>
      }
    />
  );
}
