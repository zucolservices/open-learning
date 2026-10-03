"use client";

import { motion } from "motion/react";
import { Crown, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EPS, MAJORITY, N, TT_FRAMES, replay, type Action } from "./model";
import type { DistState } from "./state";

/* 2 ─ Agree by majority ⭐ ------------------------------------------------------------------------ */

export function RaftSandbox() {
  const [s, set] = useSceneState<DistState>();
  const actions = s.actions ?? [];
  const c = replay(actions);
  const add = (a: Action) => set({ actions: [...actions, a] });
  const leaderLog = c.leader !== null ? c.logs[c.leader] : [];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Agree by majority"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono">
              term {c.term} · leader {c.leader !== null ? `node ${c.leader + 1}` : "none"}
            </span>
            <span className="text-muted">
              majority = {MAJORITY} of {N}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: N }, (_, i) => {
              const up = c.up[i];
              const lead = c.leader === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border px-1 py-2",
                    !up
                      ? "border-bad/50 bg-bad/5 border-dashed"
                      : lead
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface",
                  )}
                >
                  <div className="flex h-4 items-center gap-1">
                    {lead && <Crown className="text-accent size-3.5" />}
                    <span className="font-mono text-xs font-semibold">{i + 1}</span>
                  </div>
                  <span className={cn("text-[10px]", up ? "text-muted" : "text-bad")}>
                    {!up ? "down" : lead ? "leader" : "follower"}
                  </span>
                  <div className="flex min-h-3 flex-wrap justify-center gap-0.5">
                    {c.logs[i].map((e, k) => (
                      <span
                        key={k}
                        title={e}
                        className={cn(
                          "size-2.5 rounded-sm border",
                          k < c.committed && leaderLog[k] === e
                            ? "bg-viz-data border-viz-data"
                            : "border-viz-data",
                        )}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => add(up ? `crash:${i}` : `restart:${i}`)}
                    className="border-line hover:bg-surface-2 mt-1 rounded-md border px-1.5 py-0.5 text-[10px]"
                  >
                    {up ? "Crash" : "Restart"}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => add("write")}
              className="bg-accent text-accent-fg rounded-md px-3 py-1.5 text-xs font-medium"
            >
              Write a value
            </button>
            <span className="text-muted text-[10px]">
              Filled square: committed entry. Outline: written but not committed.
            </span>
            {actions.length > 0 && (
              <button
                type="button"
                onClick={() => set({ actions: [] })}
                className="text-muted ml-auto flex items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Start again
              </button>
            )}
          </div>
          <div className="bg-surface-2 flex max-h-40 min-h-24 flex-col-reverse overflow-y-auto rounded-xl px-3 py-2 font-mono text-[10px] leading-relaxed">
            <div>
              {c.events.map((e, i) => (
                <p
                  key={i}
                  className={cn(e.tone === "good" && "text-good", e.tone === "bad" && "text-bad")}
                >
                  {e.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Five copies of one range. Write a value, then crash the leader and watch the others elect a
        new one. Crash nodes until only two are left and try writing again.
      </p>
      <p>
        In Raft, time is divided into numbered terms, each starting with an election. Followers that
        stop hearing from the leader wait a random timeout (the paper suggests 150 to 300 ms) before
        standing, so they rarely split the vote. An entry is committed once the leader that created
        it has copied it to a majority: with five nodes, any two can fail.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Clocks and commit wait ---------------------------------------------------------------------- */

export function CommitWait() {
  const [s, set] = useSceneState<DistState>();
  const f = TT_FRAMES[Math.min(s.frame ?? 0, TT_FRAMES.length - 1)];
  const span = 24;
  const pct = (t: number) => `${(t / span) * 100}%`;
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Clocks and commit wait"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <Stepper
            step={s.frame ?? 0}
            count={TT_FRAMES.length}
            onChange={(n) => set({ frame: n })}
          />
          <div className="relative h-24">
            <div className="bg-line absolute top-12 right-0 left-0 h-px" />
            {[0, 4, 8, 12, 16, 20, 24].map((t) => (
              <span
                key={t}
                className="text-subtle absolute top-14 -translate-x-1/2 font-mono text-[9px] whitespace-nowrap"
                style={{ left: pct(t) }}
              >
                {t} ms
              </span>
            ))}
            <motion.div
              className="border-viz-meta bg-viz-meta/15 absolute top-9 h-6 rounded-md border"
              animate={{ left: pct(f.now - EPS), width: pct(2 * EPS) }}
            >
              <span className="text-viz-meta absolute -top-4 left-0 font-mono text-[9px] whitespace-nowrap">
                TT.now()
              </span>
            </motion.div>
            {f.s !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn("absolute top-4 h-16 w-0.5", f.visible ? "bg-good" : "bg-accent")}
                style={{ left: pct(f.s) }}
              >
                <span
                  className={cn(
                    "absolute -top-4 -translate-x-1/2 font-mono text-[9px] whitespace-nowrap",
                    f.visible ? "text-good" : "text-accent",
                  )}
                >
                  s = {f.s}
                </span>
              </motion.div>
            )}
          </div>
          <p className={cn("text-center text-xs", f.visible ? "text-good" : "text-muted")}>
            {f.s === null
              ? ""
              : f.visible
                ? "T1 visible to everyone"
                : "T1 committed, not yet visible"}
          </p>
          <FrameCaption
            frameKey={s.frame ?? 0}
            title={f.title}
            tone={f.visible ? "good" : undefined}
          >
            {f.text}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Uncertainty of ±{EPS} ms, illustrative; Spanner&apos;s paper reports about 1 to 7 ms.
          </p>
        </div>
      }
    >
      <p>
        Spread across machines, a database needs to agree on the order of transactions, and clocks
        disagree. Google&apos;s Spanner (2012) made the uncertainty explicit with{" "}
        <Term id="truetime">TrueTime</Term>, then simply waits it out.
      </p>
      <p>
        Without atomic clocks, CockroachDB and others use a{" "}
        <Term id="hlc">hybrid logical clock</Term>: wall-clock time plus a counter that breaks ties,
        combined with a configured limit on how far clocks may drift.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who's who ----------------------------------------------------------------------------------- */

const SYSTEMS: [string, string][] = [
  [
    "Google Spanner",
    "Key ranges (tablets in the paper, splits in today's docs), each set replicated by its own Paxos group. TrueTime orders transactions globally.",
  ],
  [
    "CockroachDB",
    "Ranges of up to 512 MiB, 3 replicas each by default, one Raft group per range, hybrid logical clocks. Speaks PostgreSQL's wire protocol.",
  ],
  [
    "TiDB",
    "A SQL layer over TiKV, which stores Regions in many Raft groups. The Placement Driver (PD) hands out timestamps for Percolator-inspired two-phase commit. MySQL-compatible.",
  ],
  [
    "YugabyteDB",
    "Tablets, one Raft group each. Its PostgreSQL-compatible SQL layer (YSQL) is built from PostgreSQL's own code.",
  ],
  [
    "Amazon Aurora DSQL",
    "Serverless and PostgreSQL-compatible, with active-active high availability. Generally available since 27 May 2025.",
  ],
  [
    "Citus",
    "A PostgreSQL extension that shards tables across ordinary PostgreSQL servers, using two-phase commit rather than consensus. On Azure: Elastic Clusters in Azure Database for PostgreSQL.",
  ],
];

export function WhosWho() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who's who"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {SYSTEMS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Different names, same pattern: ranges of keys, a consensus group per range, and a
        transaction protocol on top that spans ranges (a form of{" "}
        <Term id="two-phase-commit">two-phase commit</Term>).
      </p>
      <p>
        Paxos came first: Leslie Lamport&apos;s &ldquo;The Part-Time Parliament&rdquo; was submitted
        in 1990 and published in 1998; &ldquo;Paxos Made Simple&rdquo; followed in 2001. Raft
        (Ongaro and Ousterhout, 2014) was designed to be easier to understand; a shorter version won
        a best paper award at USENIX ATC 2014.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Still writing? ------------------------------------------------------------------------------ */

export function Survives() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Still writing?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="majority-or-not"
            prompt="Can each Raft group still accept writes?"
            categories={[
              { id: "yes", label: "Keeps writing" },
              { id: "no", label: "Stops" },
            ]}
            items={[
              {
                id: "3-1",
                label: "3 replicas, 1 down",
                category: "yes",
                why: "2 of 3 is a majority.",
              },
              {
                id: "3-2",
                label: "3 replicas, 2 down",
                category: "no",
                why: "1 of 3 isn't a majority.",
              },
              {
                id: "5-2",
                label: "5 replicas, 2 down",
                category: "yes",
                why: "3 of 5 is a majority.",
              },
              {
                id: "5-3",
                label: "5 replicas, 3 down",
                category: "no",
                why: "2 of 5 isn't.",
              },
              {
                id: "4-2",
                label: "4 replicas, 2 down",
                category: "no",
                why: "2 of 4 is exactly half, not a majority.",
              },
              {
                id: "4-1",
                label: "4 replicas, 1 down",
                category: "yes",
                why: "3 of 4 is a majority, but 4 tolerates no more failures than 3 does.",
              },
            ]}
            explanation="A group of n survives as long as more than half are up: 3 tolerate 1 failure, 5 tolerate 2. Even numbers add cost without adding tolerance."
          />
        </div>
      }
    >
      <p>Count the survivors and compare with a majority.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Ranges", "Data is cut into key ranges that split as they grow."],
  ["A consensus group per range", "Raft or Paxos keeps each range's copies in step."],
  ["Majority commits", "3 copies survive 1 failure, 5 survive 2."],
  ["Clocks matter", "TrueTime waits out uncertainty; HLCs bound it."],
  ["Same pattern, many names", "Spanner, CockroachDB, TiDB, YugabyteDB, Aurora DSQL."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The price is latency: every write needs a network round trip to a majority. Next: how the
        popular engines compare, so you can pick one with your eyes open.
      </p>
    </StepLayout>
  );
}
