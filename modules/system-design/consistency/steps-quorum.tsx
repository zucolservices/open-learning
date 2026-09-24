"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ConsistencyState } from "./state";

/* 3 ─ Quorums ⭐ -------------------------------------------------------------------------------- */

function quorum(n: number, w: number, r: number, down: number) {
  const live = Array.from({ length: n }, (_, i) => i < n - down);
  const liveIdx = live.map((l, i) => (l ? i : -1)).filter((i) => i >= 0);
  const writeOk = liveIdx.length >= w;
  const writeSet = writeOk ? liveIdx.slice(0, w) : [];
  const readOk = liveIdx.length >= r;
  // Worst case: the read asks the live replicas that did NOT get the write first.
  const notWritten = liveIdx.filter((i) => !writeSet.includes(i));
  const readSet = readOk ? [...notWritten, ...writeSet].slice(0, r) : [];
  const sawLatest = readSet.some((i) => writeSet.includes(i));
  return { live, writeOk, writeSet, readOk, readSet, sawLatest, overlap: r + w > n };
}

function Picker({
  label,
  value,
  onChange,
  max,
  min = 1,
}: {
  label: string;
  value: number;
  onChange(v: number): void;
  max: number;
  min?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted w-32 text-xs">{label}</span>
      <Segmented
        size="sm"
        value={String(value)}
        options={Array.from(
          { length: max - min + 1 },
          (_, i) => [String(i + min), String(i + min)] as [string, string],
        )}
        onChange={(v) => onChange(Number(v))}
      />
    </div>
  );
}

export function Quorums() {
  const [s, set] = useSceneState<ConsistencyState>();
  const n = s.n;
  const w = Math.min(s.w, n);
  const r = Math.min(s.r, n);
  const down = Math.min(s.down, n - 1);
  const q = quorum(n, w, r, down);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Quorums: N, W and R"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Picker
            label="Copies (N)"
            value={n}
            min={3}
            max={5}
            onChange={(v) =>
              set({ n: v, w: Math.min(s.w, v), r: Math.min(s.r, v), down: Math.min(s.down, v - 1) })
            }
          />
          <Picker label="Write waits for (W)" value={w} max={n} onChange={(v) => set({ w: v })} />
          <Picker label="Read asks (R)" value={r} max={n} onChange={(v) => set({ r: v })} />
          <Picker
            label="Copies down"
            value={down}
            min={0}
            max={n - 1}
            onChange={(v) => set({ down: v })}
          />
          <div className="border-line bg-surface flex justify-center gap-2 rounded-xl border p-4">
            {q.live.map((alive, i) => {
              const written = q.writeSet.includes(i);
              const read = q.readSet.includes(i);
              return (
                <motion.div
                  key={i}
                  layout
                  className={cn(
                    "w-16 rounded-xl border px-1 py-2 text-center",
                    !alive
                      ? "border-line border-dashed opacity-40"
                      : written
                        ? "border-good/60 bg-good/10"
                        : "border-line bg-surface-2",
                    read && "ring-accent ring-2",
                  )}
                >
                  <p className="text-[10px]">copy {i + 1}</p>
                  <p className="font-mono text-xs">{!alive ? "down" : written ? "₹200" : "₹180"}</p>
                  {read && <p className="text-accent text-[9px]">read</p>}
                </motion.div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <p
              className={cn(
                "rounded-lg border px-2 py-1.5",
                q.writeOk ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              Write {q.writeOk ? "succeeds" : "fails (too few copies up)"}
            </p>
            <p
              className={cn(
                "rounded-lg border px-2 py-1.5",
                q.readOk ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              Read {q.readOk ? "succeeds" : "fails"}
            </p>
            <p
              className={cn(
                "rounded-lg border px-2 py-1.5",
                q.writeOk && q.readOk && q.sawLatest
                  ? "border-good/40 bg-good/10"
                  : "border-bad/40 bg-bad/10",
              )}
            >
              {q.writeOk && q.readOk ? (q.sawLatest ? "Read sees ₹200" : "Read may see ₹180") : "—"}
            </p>
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              q.overlap ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            R + W = {r + w} {q.overlap ? ">" : "≤"} N = {n}:{" "}
            {q.overlap
              ? "every read overlaps every successful write in at least one copy."
              : "a read can miss every copy the write reached (shown: the worst case)."}
          </p>
        </div>
      }
    >
      <p>
        Leaderless databases write to several copies and read from several copies. Three numbers
        decide the trade-off: <strong>N</strong> copies, a write waits for <strong>W</strong>{" "}
        acknowledgements, a read asks <strong>R</strong> copies. This is a{" "}
        <Term id="quorum">quorum</Term>.
      </p>
      <p>
        Make R + W bigger than N and reads overlap writes. Then knock copies down and see what stops
        working.
      </p>
      <p className="text-muted text-sm">
        Overlap isn&apos;t the whole story: partial writes that failed on some copies, stand-in
        copies during failures (&ldquo;sloppy quorums&rdquo;) and clock-based tie-breaking can still
        return old or lost data.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Predict ------------------------------------------------------------------------------------ */

export function PredictQuorum() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="The smallest safe read"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="quorum-r"
            prompt="N = 5 copies. Writes wait for W = 3. What's the smallest R that guarantees every read overlaps the latest successful write?"
            min={1}
            max={5}
            step={1}
            answer={3}
            tolerance={0}
            explanation="You need R + W > N, so R > 2: R = 3. With W = 3 and R = 3, the system also survives two copies being down for both reads and writes. (Cassandra calls this QUORUM: a majority.)"
          />
        </div>
      }
    >
      <p>Use R + W &gt; N.</p>
    </StepLayout>
  );
}

/* 5 ─ When copies disagree ----------------------------------------------------------------------- */

export function Conflicts() {
  const [s, set] = useSceneState<ConsistencyState>();
  const lww = s.merge === "lww";
  return (
    <StepLayout
      eyebrow="Conflicts"
      title="When copies disagree"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.merge}
            options={[
              ["lww", "Last write wins"],
              ["merge", "Merge (a CRDT set)"],
            ]}
            onChange={(v) => set({ merge: v as ConsistencyState["merge"] })}
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-xl border p-3 text-sm">
              <p className="text-muted text-[10px]">Mumbai, 10:00:00.120</p>
              <p>Priya adds a latte to the shared cart</p>
            </div>
            <div className="border-line bg-surface rounded-xl border p-3 text-sm">
              <p className="text-muted text-[10px]">
                Delhi, 10:00:00.118 (its clock runs slightly behind)
              </p>
              <p>Arjun adds a cold brew</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.merge}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                lww ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
              )}
            >
              <p className="font-semibold">
                After syncing, the cart holds: {lww ? "latte" : "latte, cold brew"}
              </p>
              <p className="text-muted mt-1">
                {lww
                  ? "The later timestamp wins, so Arjun's cold brew silently disappears. With skewed clocks, 'later' may not even be true. Jepsen found Cassandra losing 28% of acknowledged writes this way under contention."
                  : "A CRDT (conflict-free replicated data type) is designed so that concurrent changes always merge the same way on every copy: here, a set that keeps both additions."}
              </p>
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-xs">
            Other tools: version vectors (Dynamo) detect concurrent edits and let the application
            merge them.
          </p>
        </div>
      }
    >
      <p>
        With multi-leader or leaderless replication, two copies can change the same thing at once.
        Something has to decide the result.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ------------------------------------------------------------------------------ */

export function CpApCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Is it CP or AP?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="cp-ap"
            prompt="A colleague asks: 'Is DynamoDB CP or AP?' What's the most accurate answer?"
            options={[
              {
                id: "depends",
                label:
                  "It depends on the operation: each read chooses eventually consistent or strongly consistent, and features like global tables and secondary indexes have their own guarantees",
                correct: true,
                feedback:
                  "Right. Most real databases don't fit one label. Ask what guarantee a particular operation gives.",
              },
              {
                id: "ap",
                label: "AP: it's a NoSQL database",
                feedback:
                  "Strongly consistent reads are available (at twice the read cost), so it's not simply AP.",
              },
              {
                id: "cp",
                label: "CP: it has strong reads",
                feedback:
                  "Default reads are eventually consistent, and global secondary indexes always are.",
              },
              {
                id: "ca",
                label: "CA: it runs in one region",
                feedback:
                  "Networks can partition inside a region too. 'CA' isn't a real option for a distributed system.",
              },
            ]}
            explanation="CAP describes one property during partitions, not a whole product. Look at the guarantees each operation and setting gives."
          />
        </div>
      }
    >
      <p>A question you&apos;ll hear often.</p>
    </StepLayout>
  );
}

/* 7 ─ Real systems ------------------------------------------------------------------------------- */

const SYSTEMS: [string, string][] = [
  [
    "Cassandra",
    "Consistency per request: ONE, QUORUM, LOCAL_QUORUM (within one data centre), ALL…",
  ],
  [
    "DynamoDB",
    "Eventually consistent reads by default; strongly consistent reads cost twice the read capacity.",
  ],
  [
    "Google Spanner",
    "External consistency using TrueTime clocks; serializable by default, repeatable read available.",
  ],
  ["CockroachDB", "SERIALIZABLE by default; READ COMMITTED available."],
  ["MongoDB", "Write concern and read concern per operation, from 'fast' to 'majority'."],
];

export function Systems() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Consistency you'll meet"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {SYSTEMS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Most systems let you choose per request. Choose deliberately.</p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Partitions force a choice",
    "Refuse (consistent) or answer (available): decide per kind of data.",
  ],
  [
    "Consistency comes in levels",
    "Linearizable, causal, eventual: stronger is simpler, weaker is faster.",
  ],
  ["R + W > N", "Quorums make reads overlap writes, but aren't a full guarantee on their own."],
  ["Conflicts need rules", "Last-write-wins loses data; merges and CRDTs keep it."],
  ["Labels mislead", "Ask what each operation guarantees, not whether a product is 'CP' or 'AP'."],
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
      <p>Next: with so many kinds of database, how to choose one.</p>
    </StepLayout>
  );
}
