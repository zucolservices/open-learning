"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const STAGES = ["connection", "parser", "rewriter", "planner", "executor", "buffer pool", "disk"];
const ACTIVE: number[][] = [[0], [1, 2], [3], [4], [5, 6], [0, 1, 2, 3, 4, 5, 6]];

function Pipeline({ index }: { index: number }) {
  const on = ACTIVE[index] ?? [];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      <p className="bg-surface-2 rounded-lg px-3 py-2 font-mono text-[11px]">
        SELECT name FROM customers WHERE city = &apos;Pune&apos;;
      </p>
      {STAGES.map((s, i) => (
        <motion.div
          key={s}
          animate={{ opacity: on.includes(i) ? 1 : 0.35, x: on.includes(i) ? 0 : -4 }}
          className={cn(
            "rounded-lg border px-3 py-1.5 font-mono text-xs",
            on.includes(i) ? "border-accent bg-accent-soft" : "border-line bg-surface",
          )}
        >
          {i + 1}. {s}
          {index === 3 && i === 3 && (
            <span className="text-muted ml-2">seq scan 900 · index 95</span>
          )}
          {index === 4 && i === 5 && <span className="text-good ml-2">hit</span>}
          {index === 4 && i === 6 && <span className="text-bad ml-2">miss: read 8 kB</span>}
        </motion.div>
      ))}
      <p className="text-subtle text-[10px]">Timings and costs are illustrative.</p>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "send",
    kicker: "0 ms",
    title: "You press Enter",
    body: (
      <>
        <p>
          You ask for every customer in Pune. The query travels to the database server, where a
          worker of its own is waiting: in PostgreSQL, a separate process for every connection.
        </p>
        <p>
          SQL says <em>what</em> you want, not <em>how</em> to find it. Working out the how is the
          database&apos;s job, and it&apos;s most of what this track is about.
        </p>
      </>
    ),
  },
  {
    id: "parse",
    kicker: "0.1 ms",
    title: "Does it make sense?",
    body: (
      <>
        <p>
          The <Term id="parser">parser</Term> checks the spelling and grammar and turns the text
          into a tree. Then a rewriter expands any views, which PostgreSQL&apos;s docs describe as
          &ldquo;a form of macro expansion&rdquo;.
        </p>
        <p>A typo stops here, before any data is touched.</p>
      </>
    ),
  },
  {
    id: "plan",
    kicker: "0.3 ms",
    title: "Choosing a route",
    body: (
      <>
        <p>
          There are several ways to answer: read the whole table, or use an index on city if one
          exists. The <Term id="query-planner">planner</Term> estimates the cost of each and picks
          the cheapest, like a satnav comparing routes.
        </p>
        <p>
          IBM&apos;s System R project pioneered this cost-based approach in the 1970s; a 1979 paper
          by Patricia Selinger and colleagues set the pattern most databases still follow.
        </p>
      </>
    ),
  },
  {
    id: "exec",
    kicker: "0.4 ms",
    title: "Fetching rows",
    body: (
      <>
        <p>
          The executor runs the plan. PostgreSQL calls it &ldquo;a demand-pull pipeline&rdquo;: each
          step asks the one below for the next row, so rows flow up one at a time.
        </p>
        <p>
          It never reads single rows from disk, though. It reads whole <Term id="page">pages</Term>:
          8 kB in PostgreSQL by default, 16 KB in MySQL&apos;s InnoDB, 4 KB in SQLite.
        </p>
      </>
    ),
  },
  {
    id: "cache",
    kicker: "0.4–90 ms",
    title: "Memory first, disk if needed",
    body: (
      <>
        <p>
          Recently used pages are kept in memory, in the <Term id="buffer-pool">buffer pool</Term>.
          If the page is there, it&apos;s a hit and takes nanoseconds. If not, the database reads it
          from storage, thousands of times slower.
        </p>
        <p>Most of a database&apos;s design is about avoiding that trip.</p>
      </>
    ),
  },
  {
    id: "why",
    kicker: "Why it matters",
    title: "Seeing inside",
    body: (
      <>
        <p>
          The same query can take 6 ms or 900 ms depending on indexes, statistics and what&apos;s in
          memory. Without knowing the machinery, slow queries look like bad luck.
        </p>
        <p>
          Edgar Codd described the relational model in 1970. Half a century later, PostgreSQL,
          MySQL, SQL Server, Oracle and SQLite all still follow this journey, with different choices
          along the way.
        </p>
      </>
    ),
  },
];

export function OneQuery() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Pipeline index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">One query</h2>
          <p className="text-muted mt-3 text-[15px]">
            A single line of SQL, and the half a millisecond of work before the answer appears.
          </p>
        </div>
      }
    />
  );
}
