"use client";

import { motion } from "motion/react";
import { Crown } from "lucide-react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const RANGES = [
  { id: "A", keys: "a–h", leader: 0 },
  { id: "B", keys: "i–p", leader: 1 },
  { id: "C", keys: "q–z", leader: 2 },
];

function Scene({ index }: { index: number }) {
  if (index <= 1) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-muted text-xs">customers table</p>
        <div className="flex gap-1.5">
          {RANGES.map((r) => (
            <motion.div
              key={r.id}
              animate={{ x: index === 1 ? (r.id === "A" ? -12 : r.id === "C" ? 12 : 0) : 0 }}
              className={cn(
                "w-24 rounded-lg border px-3 py-4 text-center",
                index === 1 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="font-mono text-sm font-semibold">
                {index === 1 ? `Range ${r.id}` : ""}
              </p>
              <p className="text-muted font-mono text-[10px]">keys {r.keys}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-subtle text-[10px]">
          {index === 0 ? "One server holds it all" : "Cut into key ranges"}
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {[0, 1, 2].map((node) => (
        <div
          key={node}
          className="border-line bg-surface flex items-center gap-2 rounded-xl border px-3 py-2"
        >
          <span className="text-muted w-14 shrink-0 font-mono text-xs">node {node + 1}</span>
          <div className="flex flex-1 gap-1.5">
            {RANGES.map((r) => {
              const isLeader = index >= 3 && r.leader === node;
              const writing = index === 4 && r.id === "B";
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * node }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 font-mono text-xs",
                    writing
                      ? node === 2
                        ? "border-line border-dashed"
                        : "border-good bg-good/10"
                      : isLeader
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface-2",
                  )}
                >
                  {isLeader && <Crown className="text-accent size-3" />}
                  {r.id}
                  {writing && <span className="text-[9px]">{node === 2 ? "…" : "✓"}</span>}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-subtle text-[10px]">
        {index === 4
          ? "A write to range B: the leader and one follower have it. 2 of 3 is a majority: committed."
          : index >= 3
            ? "Each range has its own leader, spread across nodes."
            : "Each range copied to three nodes."}
      </p>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "idea",
    kicker: "The idea",
    title: "Five friends, one booking",
    body: (
      <>
        <p>
          Five friends are choosing a restaurant on a group chat, and some phones are always flat.
          They agree a rule: one person proposes, and once three of the five say yes, it&apos;s
          booked. If the organiser goes quiet, someone else steps up.
        </p>
        <p>
          That&apos;s the heart of a <Term id="distributed-sql">distributed SQL</Term> database:
          many machines that agree on every change, so losing a few doesn&apos;t lose data.
        </p>
      </>
    ),
  },
  {
    id: "split",
    kicker: "Step 1",
    title: "Cut the data into ranges",
    body: (
      <p>
        One server eventually runs out of room or speed. So the table is cut into contiguous key
        ranges, each a <Term id="shard">shard</Term> of the data. When a range grows too big,
        it&apos;s split in two; CockroachDB splits at 512 MiB by default.
      </p>
    ),
  },
  {
    id: "copy",
    kicker: "Step 2",
    title: "Copy each range",
    body: (
      <p>
        Each range is stored on several nodes, three by default in CockroachDB and TiDB. Unlike the
        previous module&apos;s replicas, which copied a whole server, every range has its own small
        group of copies.
      </p>
    ),
  },
  {
    id: "leader",
    kicker: "Step 3",
    title: "One leader per range",
    body: (
      <p>
        In each group one copy is the leader: writes go through it, and it sends them to the others.
        Leaders of different ranges live on different nodes, so the work spreads out.
      </p>
    ),
  },
  {
    id: "majority",
    kicker: "Step 4",
    title: "Agree by majority",
    body: (
      <p>
        A write commits once a majority of the range&apos;s copies have it. The protocol that makes
        this safe, even when leaders crash and messages are lost, is called{" "}
        <Term id="consensus">consensus</Term>. Most of these databases use{" "}
        <Term id="raft">Raft</Term>; Google&apos;s Spanner uses <Term id="paxos">Paxos</Term>.
      </p>
    ),
  },
];

export function SplitAndCopy() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Split and copy</h2>
          <p className="text-muted mt-3 text-[15px]">
            How one SQL database spreads across many machines and still agrees on every change.
          </p>
        </div>
      }
    />
  );
}
