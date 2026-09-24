"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import type { MaintenanceState } from "./state";

/* 4 ─ The four jobs, per format ------------------------------------------------------------ */

type Job = MaintenanceState["job"];

const JOBS: Record<Job, { label: string; what: string; cells: [string, string, string][] }> = {
  compact: {
    label: "Compact small files",
    what: "Rewrite many small files into fewer, bigger ones, in one commit. The small files become old versions.",
    cells: [
      [
        "Delta Lake",
        "OPTIMIZE orders;",
        "Bin-packing toward 1 GB; idempotent. Auto compaction (Delta 3.1+) compacts toward 128 MB right after writes.",
      ],
      [
        "Iceberg",
        "CALL system.rewrite_data_files('orders');",
        "Bin-packing by default, toward 512 MB; a group needs at least 5 input files.",
      ],
      [
        "Hudi",
        "hoodie.clustering.inline = true",
        "Clustering merges small files; compaction folds Merge-on-Read logs into base files, async by default.",
      ],
    ],
  },
  versions: {
    label: "Remove old versions",
    what: "Delete files that only old versions still use. This is what actually frees storage, and it ends time travel past that point.",
    cells: [
      [
        "Delta Lake",
        "VACUUM orders;",
        "Keeps 7 days by default (delta.deletedFileRetentionDuration), with a safety check against less. Never runs by itself in open-source Delta.",
      ],
      [
        "Iceberg",
        "CALL system.expire_snapshots(\n  table => 'orders',\n  older_than => TIMESTAMP '…');",
        "Defaults: snapshots older than 5 days, keeping at least 1. Deletes only files no remaining snapshot needs; tagged snapshots are protected.",
      ],
      [
        "Hudi",
        "hoodie.clean.automatic = true",
        "The cleaner runs after each commit and keeps file versions for the last 10 commits by default.",
      ],
    ],
  },
  orphans: {
    label: "Remove orphan files",
    what: "Delete files in the table's folder that no version references at all, mostly left by failed or aborted writes.",
    cells: [
      [
        "Delta Lake",
        "VACUUM orders;       -- FULL (default)\nVACUUM orders LITE;  -- log only",
        "The default VACUUM lists the folder and removes unreferenced files too. VACUUM LITE (Delta 3.3+) is cheaper but skips files from aborted writes.",
      ],
      [
        "Iceberg",
        "CALL system.remove_orphan_files(\n  table => 'orders', dry_run => true);",
        "Only touches files older than 3 days, so in-progress writes are safe. Try dry_run first.",
      ],
      [
        "Hudi",
        "-- automatic",
        "Failed writes are rolled back, and the rollback deletes their partial files.",
      ],
    ],
  },
  metadata: {
    label: "Tidy metadata",
    what: "Keep the log, manifests and timeline small so planning stays fast.",
    cells: [
      [
        "Delta Lake",
        "delta.logRetentionDuration = 'interval 30 days'",
        "A checkpoint every 10 commits; log entries older than 30 days are cleaned up automatically after checkpoints.",
      ],
      [
        "Iceberg",
        "CALL system.rewrite_manifests('orders');",
        "Small manifests are merged on commit by default. Old metadata.json files pile up unless write.metadata.delete-after-commit.enabled is on (keeps 100).",
      ],
      [
        "Hudi",
        "hoodie.keep.min.commits = 20\nhoodie.keep.max.commits = 30",
        "Archival moves old instants out of the active timeline.",
      ],
    ],
  },
};

export function FourJobs() {
  const [s, set] = useSceneState<MaintenanceState>();
  const j = JOBS[s.job];
  return (
    <StepLayout
      eyebrow="In practice"
      title="The four jobs, in each format"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(JOBS) as Job[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ job: k })}
                className={
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors " +
                  (k === s.job
                    ? "bg-accent text-accent-fg"
                    : "bg-surface-2 text-muted hover:text-fg")
                }
              >
                {JOBS[k].label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.job}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <p className="text-muted text-sm">{j.what}</p>
              <div className="grid gap-3 md:grid-cols-3">
                {j.cells.map(([who, code, note]) => (
                  <div
                    key={who}
                    className="border-line bg-surface flex flex-col rounded-2xl border p-3"
                  >
                    <p className="text-sm font-semibold">{who}</p>
                    <Code className="mt-2 text-[10px] whitespace-pre-wrap">{code}</Code>
                    <p className="text-muted mt-2 text-xs leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Every format needs the same four kinds of housekeeping. The names and defaults differ; the
        ideas don&apos;t.
      </p>
      <p>
        Two cautions apply everywhere. Order matters: compaction creates old versions, so clean-up
        should run after it. And the waiting periods (7 days, 5 days, 3 days) are safety margins
        that protect readers and in-flight writes; shorten them with care.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Fix the problem: the storage bill ------------------------------------------------------------ */

const CLUES: [string, string][] = [
  ["DESCRIBE DETAIL orders", "sizeInBytes: 1.2 TB  -- the current version only"],
  ["Storage bucket, orders/ folder", "4.1 TB"],
  ["DESCRIBE HISTORY orders", "A MERGE every night for 8 months; one OPTIMIZE a week"],
  ["Scheduled jobs", "OPTIMIZE weekly. No VACUUM anywhere."],
];

export function StorageBill() {
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The bill that tripled"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-bad/40 bg-bad/10 flex items-start gap-3 rounded-xl border px-4 py-3">
            <AlertTriangle className="text-bad mt-0.5 size-4 shrink-0" />
            <p className="text-sm">
              Finance flags that the storage bill for the <code>orders</code> Delta table has
              tripled this year, while the table itself hardly grew.
            </p>
          </div>
          <dl className="grid gap-2 sm:grid-cols-2">
            {CLUES.map(([k, v]) => (
              <div key={k} className="border-line bg-surface rounded-xl border px-3 py-2">
                <dt className="text-muted font-mono text-[10px]">{k}</dt>
                <dd className="mt-0.5 font-mono text-xs">{v}</dd>
              </div>
            ))}
          </dl>
          <ChoiceCheckpoint
            id="storage-bill"
            prompt="What should you do?"
            options={[
              {
                id: "reload",
                label: "Drop the table and reload it from source",
                feedback:
                  "It would work, at the cost of downtime, all history, and a big reload. The table isn't broken, it's unmaintained.",
              },
              {
                id: "vacuum",
                label:
                  "Schedule VACUUM (after the weekly OPTIMIZE) and keep the default 7-day retention unless you need more history",
                correct: true,
                feedback:
                  "Right. The nightly MERGEs and weekly OPTIMIZEs leave replaced files behind, and nothing ever deletes them.",
              },
              {
                id: "optimize-more",
                label: "Run OPTIMIZE daily instead of weekly",
                feedback:
                  "That creates even more replaced files. Compaction without clean-up makes storage worse.",
              },
              {
                id: "zero",
                label: "Run VACUUM with a retention of 0 hours to reclaim everything now",
                feedback:
                  "Delta's safety check blocks this by default for good reason: it can break running queries and in-flight writes, and ends all time travel.",
              },
            ]}
            explanation="The gap between the table's size (current version) and the bucket's size is old versions plus orphans. On Databricks, ANALYZE TABLE … COMPUTE STORAGE METRICS splits it into active, vacuumable and time-travel bytes."
          />
        </div>
      }
    >
      <p>
        Databricks&apos; own docs note that it&apos;s “not uncommon” for the size of removed files
        to exceed the size of the current table. Here&apos;s what that looks like on a bill.
      </p>
      <p>Read the clues, then choose the fix.</p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: retention and time travel --------------------------------------------------------- */

export function RetentionCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How far back can you go?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="retention"
            prompt="A Delta table runs VACUUM every night with the default 7-day retention. Log retention is the default 30 days. Can you query the table as it was 20 days ago?"
            options={[
              {
                id: "yes-log",
                label: "Yes: the log still has 30 days of history",
                feedback:
                  "The log describes that version, but its data files were vacuumed. Time travel needs both.",
              },
              {
                id: "no",
                label: "No: the data files that version needs were deleted by VACUUM",
                correct: true,
                feedback:
                  "Right. With daily VACUUM at 7 days, time travel effectively reaches back about a week.",
              },
              {
                id: "partial",
                label: "Partly: it returns only the rows whose files survived",
                feedback:
                  "Time travel never returns a partial table: the read fails when files are missing.",
              },
              {
                id: "restore",
                label: "Yes, if you RESTORE to that version first",
                feedback: "RESTORE needs the same missing files, so it fails too.",
              },
            ]}
            explanation="If you need longer history, raise delta.deletedFileRetentionDuration (and pay for the storage), or keep a periodic copy. The same logic applies to Iceberg snapshot expiry and Hudi's cleaner."
          />
        </div>
      }
    >
      <p>Think about what time travel needs: both the log and the data files.</p>
    </StepLayout>
  );
}

/* 7 ─ Let the platform do it --------------------------------------------------------------------- */

const MANAGED: [string, string, string][] = [
  [
    "Databricks predictive optimization",
    "Runs OPTIMIZE, VACUUM and ANALYZE for Unity Catalog managed Delta and Iceberg tables. On by default for accounts created since November 2024.",
    "Keeps at least 7 days for VACUUM; doesn't run ZORDER.",
  ],
  [
    "Amazon S3 Tables",
    "Iceberg tables with maintenance on by default: compaction (toward 512 MB), snapshot expiry (keep 1, max age 120 h) and unreferenced-file removal.",
    "Ignores Iceberg's own retention properties; configured on the table bucket.",
  ],
  [
    "AWS Glue Data Catalog optimizers",
    "Compaction, snapshot retention and orphan file deletion for Iceberg tables.",
    "Opt-in per table or catalog. Orphan deletion waits 3 days by default.",
  ],
  [
    "BigQuery Iceberg tables",
    "Adaptive file sizing, automatic clustering and garbage collection of old files after the time-travel window.",
    "Files other tools add to the table's storage are treated as untracked and deleted.",
  ],
];

export function LetThePlatform() {
  return (
    <StepLayout
      eyebrow="Automation"
      title="Let the platform do it"
      stage={
        <div className="grid flex-1 content-start gap-3 md:grid-cols-2">
          {MANAGED.map(([name, what, watch], i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-2xl border p-4"
            >
              <p className="font-semibold">{name}</p>
              <p className="text-muted mt-1 text-xs leading-relaxed">{what}</p>
              <p className="text-viz-compute mt-2 text-[11px]">Watch out: {watch}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Running these jobs by hand is error-prone, so managed platforms increasingly schedule them
        for you, choosing when to compact and what to clean.
      </p>
      <p>
        Two things still matter. Know which retention you&apos;re getting, because it sets your
        time-travel window. And know that managed clean-up deletes whatever the table doesn&apos;t
        reference, including files another tool wrote into the same folder.
      </p>
      <p className="text-subtle text-xs">
        Platform details get their own modules in chapter 8: AWS, Google Cloud and Azure.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap-up -------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Tables collect clutter",
    "Small files, old versions and orphans: invisible to queries, visible on the bill and in query times.",
  ],
  ["Four routine jobs", "Compact, remove old versions, remove orphans, tidy metadata."],
  ["Order matters", "Compaction creates old versions; clean-up afterwards is what frees storage."],
  [
    "Retention is a trade-off",
    "Shorter retention, smaller bill, shorter time travel. Safety margins protect in-flight work.",
  ],
  ["Automate it", "Schedule it yourself or let the platform do it, and know the defaults you get."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up · Chapter 4 complete"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-2.5">
          {TAKEAWAYS.map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-meta/15 text-viz-meta grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted text-sm">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That completes <strong>Performance &amp; layout</strong>: partitioning, clustering and data
        skipping make tables fast; routine maintenance keeps them that way.
      </p>
      <p>
        Next chapter, <strong>Catalogs &amp; governance</strong>: the catalog as the source of
        truth, and who is allowed to see what.
      </p>
      <p className="text-subtle text-xs">
        Terms from this module: <Term id="vacuum">VACUUM</Term>,{" "}
        <Term id="orphan-files">orphan files</Term>, <Term id="retention">retention</Term>.
      </p>
    </StepLayout>
  );
}
