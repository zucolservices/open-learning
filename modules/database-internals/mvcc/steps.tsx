"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES } from "./model";
import type { MvccState } from "./state";

/* 2 ─ Read while someone writes ⭐ ---------------------------------------------------------------- */

export function StepThrough() {
  const [s, set] = useSceneState<MvccState>();
  const f = FRAMES[Math.min(s.frame, FRAMES.length - 1)];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Read while someone writes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <div>
            <p className="text-muted mb-1 text-[10px]">
              products table, row &ldquo;Tea&rdquo;: every version
            </p>
            <div className="grid grid-cols-[1fr_4rem_4rem_5rem] gap-x-2 gap-y-1 font-mono text-xs">
              <span className="text-subtle">price</span>
              <span className="text-subtle">xmin</span>
              <span className="text-subtle">xmax</span>
              <span className="text-subtle">state</span>
              {f.versions.map((v) => (
                <motion.div
                  key={v.xmin}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: v.state === "removed" ? 0.35 : 1, x: 0 }}
                  className={cn(
                    "col-span-4 grid grid-cols-subgrid rounded-md border px-2 py-1.5",
                    v.state === "removed"
                      ? "border-line border-dashed line-through"
                      : v.state === "dead"
                        ? "border-bad/40 bg-bad/5"
                        : v.xmax
                          ? "border-line bg-surface"
                          : "border-accent bg-accent-soft",
                  )}
                >
                  <span>₹{v.price}</span>
                  <span>{v.xmin}</span>
                  <span className={cn(v.xmax && "text-bad")}>{v.xmax}</span>
                  <span className="text-muted">{v.state}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="grid min-h-16 grid-cols-2 gap-2">
            {f.views.map((v) => (
              <motion.div
                key={v.who + v.xid}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-line bg-surface rounded-lg border px-3 py-2"
              >
                <p className="text-muted text-[10px]">
                  {v.who} (txn {v.xid})
                </p>
                <p className="font-mono text-sm font-semibold">SELECT → ₹{v.sees}</p>
                {v.note && <p className="text-subtle text-[10px]">{v.note}</p>}
              </motion.div>
            ))}
          </div>
          <FrameCaption frameKey={s.frame} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            PostgreSQL&apos;s design; transaction IDs illustrative.
          </p>
        </div>
      }
    >
      <p>
        Step through an update that happens while a long report is reading. Watch the hidden columns
        every PostgreSQL row carries: <Term id="xmin">xmin</Term>, the transaction that created this
        version, and xmax, the one that replaced or deleted it.
      </p>
      <p>
        A version is visible to you if its creator had committed when your snapshot was taken and
        its replacer hadn&apos;t. A non-zero xmax doesn&apos;t always mean dead: the deleting
        transaction may not have committed, or may have rolled back.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Cleaning up --------------------------------------------------------------------------------- */

export function Cleanup() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Cleaning up"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-sm font-semibold">Bloat</p>
              <p className="text-muted">
                When dead versions pile up faster than VACUUM removes them, tables and indexes grow
                and queries read more pages. A spike of updates can need VACUUM FULL, which rewrites
                the table and locks it while it does.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-sm font-semibold">Long transactions</p>
              <p className="text-muted">
                &ldquo;An open transaction prevents vacuuming away recently-dead tuples that may be
                visible only to this transaction.&rdquo; One forgotten session can bloat every busy
                table.
              </p>
            </div>
          </div>
          <div className="border-line bg-surface flex items-center gap-4 rounded-lg border px-3 py-3">
            <svg viewBox="0 0 100 100" className="size-24 shrink-0" aria-hidden>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="12"
                className="stroke-viz-meta/60"
                strokeDasharray="125.7 251.3"
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="12"
                className="stroke-viz-compute/60"
                strokeDasharray="125.7 251.3"
                strokeDashoffset="-125.7"
                transform="rotate(-90 50 50)"
              />
              <circle cx="50" cy="10" r="4" className="fill-accent" />
              <text x="50" y="47" textAnchor="middle" className="fill-fg text-[9px]">
                now
              </text>
              <text x="50" y="58" textAnchor="middle" className="fill-muted text-[7px]">
                32-bit IDs
              </text>
            </svg>
            <div className="text-xs">
              <p className="text-sm font-semibold">Transaction ID wraparound</p>
              <p className="mb-1 text-[10px]">
                <span className="text-viz-compute">left half: the past</span> ·{" "}
                <span className="text-viz-meta">right half: the future</span>
              </p>
              <p className="text-muted">
                IDs are 32 bits, about 4 billion values, compared on a circle: the 2 billion behind
                you are the past, the 2 billion ahead the future. A row left unfrozen for more than
                2 billion transactions would suddenly look like it&apos;s from the future, and
                vanish. VACUUM freezes old rows to prevent it; as a last resort PostgreSQL stops
                handing out new IDs.
              </p>
            </div>
          </div>
          <Code>{`SET idle_in_transaction_session_timeout = '5min';
SELECT pid, xact_start, state FROM pg_stat_activity
  WHERE state LIKE 'idle in transaction%';`}</Code>
        </div>
      }
    >
      <p>
        <Term id="autovacuum">Autovacuum</Term> runs VACUUM in the background; the docs call it
        &ldquo;optional but highly recommended&rdquo;. VACUUM removes dead versions and marks the
        space reusable, but &ldquo;will not return the space to the operating system&rdquo; except
        in a special case.
      </p>
      <p>
        <Term id="xid-wraparound">Wraparound</Term> sounds exotic but has taken real services down
        for hours (you&apos;ll meet one in the capstone). Monitor the oldest transaction age and
        keep autovacuum healthy.
      </p>
    </StepLayout>
  );
}

/* 4 ─ HOT updates --------------------------------------------------------------------------------- */

export function Hot() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="HOT updates"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            {
              t: "Ordinary update",
              d: "New version may land on another page. Every index on the table gets a new entry pointing at it.",
              idx: 3,
              same: false,
            },
            {
              t: "HOT update",
              d: "No indexed column changed and the page had room: the new version stays on the same page, chained from the old one. No new index entries.",
              idx: 0,
              same: true,
            },
          ].map((c) => (
            <div key={c.t} className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-sm font-semibold">{c.t}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="border-line bg-surface-2 rounded px-2 py-1 font-mono text-[10px]">
                    page 7: v1 {c.same && "→ v2"}
                  </span>
                  {!c.same && (
                    <span className="border-accent bg-accent-soft rounded border px-2 py-1 font-mono text-[10px]">
                      page 12: v2
                    </span>
                  )}
                </div>
                <span className={cn("text-xs", c.idx ? "text-bad" : "text-good")}>
                  {c.idx ? `+${c.idx} index writes` : "+0 index writes"}
                </span>
              </div>
              <p className="text-muted mt-1 text-xs">{c.d}</p>
            </div>
          ))}
          <p className="text-subtle text-[10px]">A table with three indexes; illustrative.</p>
        </div>
      }
    >
      <p>
        Writing a new version for every update could mean updating every index too.
        PostgreSQL&apos;s <Term id="hot-update">heap-only tuple (HOT)</Term> updates avoid that when
        two conditions hold: the update changes no indexed column (BRIN summary indexes aside), and
        there&apos;s free space on the same page.
      </p>
      <p>
        Old versions in a HOT chain can be pruned during normal work, even during a SELECT, without
        waiting for VACUUM. For tables with many updates, lowering the fillfactor leaves room on
        each page and makes HOT updates more likely.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Old versions elsewhere ---------------------------------------------------------------------- */

const DESIGNS: [string, string, string][] = [
  [
    "PostgreSQL",
    "Old versions in the table",
    "Rollback is instant (the old version is still there). The cost: dead rows in the table until VACUUM runs.",
  ],
  [
    "MySQL InnoDB",
    "Old values in undo logs",
    "Undo logs in rollback segments rebuild earlier versions for consistent reads. Background purge threads remove deleted rows and old undo once no snapshot needs them.",
  ],
  [
    "Oracle",
    "Old values in undo segments",
    "Readers copy a block and apply undo to rebuild it as of their snapshot. If the undo a long report needs has been reused, it fails with “snapshot too old”.",
  ],
];

export function Undo() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Old versions elsewhere"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DESIGNS.map(([db, how, d], i) => (
            <motion.div
              key={db}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">
                {db} <span className="text-accent font-mono text-xs font-normal">· {how}</span>
              </p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Same goal, different trade-offs. Every MVCC database pays for old versions somewhere: in
        table space and vacuuming, or in undo space and the work of rebuilding the past.
      </p>
      <p>
        Long-running transactions hurt all three: they hold back VACUUM in PostgreSQL, purge in
        InnoDB, and push Oracle&apos;s undo towards &ldquo;snapshot too old&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 6 ─ The growing table --------------------------------------------------------------------------- */

export function GrowingTable() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The growing table"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="growing-table"
            prompt="A PostgreSQL table of 2 million rows is updated constantly. The row count is steady, autovacuum is running, yet the table has grown from 1 GB to 9 GB in a week and queries are slowing. What do you check first?"
            options={[
              {
                id: "idle",
                label: "pg_stat_activity, for a session that's been idle in transaction for days",
                correct: true,
                feedback:
                  "An open transaction stops VACUUM removing anything it might still see, so every update leaves garbage behind.",
              },
              {
                id: "disk",
                label: "Whether the disk is slow",
                feedback: "Slow disks don't make tables bigger.",
              },
              {
                id: "index",
                label: "Whether the table needs another index",
                feedback: "Another index would make each update write more, not less.",
              },
              {
                id: "inserts",
                label: "Whether someone is inserting duplicate rows",
                feedback: "The row count is steady; the growth is dead versions.",
              },
            ]}
            explanation="Dead row versions can only be removed once no running transaction could see them. Find the old transaction, end it, and set idle_in_transaction_session_timeout so it can't happen again."
          />
        </div>
      }
    >
      <p>A classic production puzzle.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Versions, not overwrites", "An update writes a new version; readers keep their snapshot."],
  ["Readers don't wait", "Writers still queue behind writers on the same row."],
  ["Someone must clean up", "VACUUM in PostgreSQL, purge in InnoDB."],
  ["Long transactions hurt", "They hold back cleanup and cause bloat."],
  ["Watch wraparound", "Old rows must be frozen within 2 billion transactions."],
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
        That completes how one database keeps transactions apart. Next: copying it to other
        machines, with replication.
      </p>
    </StepLayout>
  );
}
