"use client";

import { motion } from "motion/react";
import { Library } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MAX_GB, WAYS } from "./model";
import type { BigState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function WholeLibrary() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Do you need the whole library?"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex w-72 flex-col items-center rounded-xl border p-4 text-center text-xs"
          >
            <Library className="text-accent size-8" />
            <p className="mt-2">
              Join a library and they hand you every book they own? Or a card, and the books you ask
              for?
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Imagine joining a library and being handed every book it has ever owned, to carry home. For
        a small library that&apos;s fine. For a national library it&apos;s absurd: you&apos;d want a
        card and the shelves you actually read.
      </p>
      <p>
        Git normally copies the entire history to every clone. For huge repositories, with decades
        of history, millions of files or large binaries, there are ways to fetch less:{" "}
        <Term id="shallow-clone">shallow</Term> and <Term id="partial-clone">partial</Term> clones,{" "}
        <Term id="sparse-checkout">sparse checkout</Term> and <Term id="git-lfs">Git LFS</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Clone four ways ⭐ --------------------------------------------------------------------------- */

export function CloneFourWays() {
  const [s, set] = useSceneState<BigState>();
  const w = WAYS.find((x) => x.id === s.way) ?? WAYS[0];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Clone a huge repository four ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">
            A made-up repo: 20 years, 2 million files · numbers are illustrative
          </p>
          <div className="grid gap-1.5">
            {WAYS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.way === x.id}
                onClick={() => set({ way: x.id })}
                className={cn(
                  "grid grid-cols-[9rem_1fr_3.5rem] items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.way === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="font-medium">{x.label}</span>
                <span className="bg-surface-2 h-2.5 rounded-full">
                  <span
                    className="bg-viz-data block h-full rounded-full transition-all"
                    style={{ width: `${Math.max(1, (x.gb / MAX_GB) * 100)}%` }}
                  />
                </span>
                <span className="text-right font-mono text-[11px]">{x.gb} GB</span>
              </button>
            ))}
          </div>
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <pre className="text-accent font-mono text-[11px] whitespace-pre-wrap">$ {w.cmd}</pre>
            <div className="mt-2 grid gap-1 sm:grid-cols-3">
              <p>
                <span className="text-muted">Time: </span>~{w.minutes} min
              </p>
              <p>
                <span className="text-muted">History: </span>
                {w.history}
              </p>
              <p>
                <span className="text-muted">Files: </span>
                {w.files}
              </p>
            </div>
            <p className="text-muted mt-2">{w.note}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Pick a clone strategy and compare what you download, how long it takes, and what still
        works.
      </p>
      <p>
        Each trades completeness for speed in a different way. Shallow drops history; partial drops
        old file contents until needed; sparse checkout limits which folders appear at all.
        Git&apos;s <code>scalar</code> command (built in since 2.38) sets up the fast combination
        for you.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Large files ----------------------------------------------------------------------------------- */

export function LargeFiles() {
  const [s, set] = useSceneState<BigState>();
  const warn = s.fileMb > 50;
  const block = s.fileMb > 100;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Large files and Git LFS"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="grid gap-1 text-sm">
            <span>
              A design file of <strong>{s.fileMb} MiB</strong>, changed 20 times
            </span>
            <input
              type="range"
              min={10}
              max={200}
              step={10}
              value={s.fileMb}
              onChange={(e) => set({ fileMb: Number(e.target.value) })}
              className="accent-accent"
              aria-label="File size"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.lfs}
              onChange={(e) => set({ lfs: e.target.checked })}
              className="accent-accent"
            />
            Track *.psd with Git LFS
          </label>
          {s.lfs ? (
            <div className="border-good/50 bg-good/10 rounded-xl border p-3 text-xs">
              <p className="font-semibold">
                In Git: a pointer file of about 130 bytes per version.
              </p>
              <pre className="mt-1 font-mono text-[10px] whitespace-pre-wrap">
                version https://git-lfs.github.com/spec/v1{"\n"}oid sha256:4d7a…{"\n"}size{" "}
                {s.fileMb * 1048576}
              </pre>
              <p className="mt-1">
                The real files live on an LFS server and download only for the versions you check
                out.
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "rounded-xl border p-3 text-xs",
                block
                  ? "border-bad/50 bg-bad/10"
                  : warn
                    ? "border-line-strong bg-surface-2"
                    : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">
                In Git: up to {s.fileMb * 20} MiB of history that every clone downloads.
              </p>
              <p className="mt-1">
                {block
                  ? "GitHub blocks files larger than 100 MiB: this push would be rejected."
                  : warn
                    ? "GitHub warns about files larger than 50 MiB."
                    : "Allowed, but every version stays in every clone forever."}
              </p>
            </div>
          )}
        </div>
      }
    >
      <p>
        Git stores every version of every file. For code that&apos;s cheap; for big binaries like
        videos, design files or datasets, it bloats every clone forever.
      </p>
      <p>
        Git LFS (Large File Storage, 2015) replaces such files in history with tiny pointer files
        and stores the real content separately. Hosting platforms also cap file sizes; GitHub warns
        above 50 MiB and blocks above 100 MiB.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Keeping it fast ------------------------------------------------------------------------------ */

export function KeepFast() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keeping a big repository fast"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "git maintenance start",
              "Schedules background tasks (repacking, prefetching, commit-graph updates) so everyday commands stay quick.",
            ],
            [
              "scalar clone <url>",
              "Clones with partial clone, sparse checkout and maintenance already configured.",
            ],
            [
              "git fetch --unshallow",
              "Turns a shallow clone into a full one when you need history after all.",
            ],
            ["git sparse-checkout add docs", "Brings another folder into a sparse checkout."],
          ].map(([c, b], i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <code className="text-accent font-mono text-[11px]">{c}</code>
              <p className="text-muted mt-0.5">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Most teams never need these. But if <code>git status</code> takes seconds or a clone takes
        an hour, they make a real difference, and they&apos;re all part of standard Git.
      </p>
      <p>
        The best fix is prevention: keep generated files, build outputs and large binaries out of
        the repository.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function BigCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which technique?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-big-repos"
            prompt="Which technique fits each need?"
            categories={[
              { id: "shallow", label: "Shallow" },
              { id: "partial", label: "Partial / sparse" },
              { id: "lfs", label: "Git LFS" },
            ]}
            items={[
              {
                id: "ci",
                label: "A CI job that only builds the latest commit",
                category: "shallow",
                why: "No history needed.",
              },
              {
                id: "video",
                label: "200 MB training videos that change monthly",
                category: "lfs",
                why: "Large binaries as pointers.",
              },
              {
                id: "mono",
                label: "You work on one app inside a 2-million-file repository",
                category: "partial",
                why: "Fetch and check out only what you need.",
              },
              {
                id: "psd",
                label: "Design files in the same repository as the website code",
                category: "lfs",
                why: "Keep binaries out of every clone.",
              },
              {
                id: "log",
                label: "Fast clone but still want full git log",
                category: "partial",
                why: "Blobless clones keep all commits.",
              },
            ]}
            explanation="Shallow drops history, partial and sparse fetch or show less, and LFS moves large binaries out of the main history."
          />
        </div>
      }
    >
      <p>Sort each need.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Clones copy everything", "Fine until history or files get huge."],
        ["Shallow", "Latest commits only: ideal for CI."],
        ["Partial and sparse", "Fetch contents on demand; see only your folders."],
        ["Git LFS for big binaries", "Pointers in Git, files elsewhere."],
        ["scalar and maintenance", "Built-in helpers for very large repositories."],
      ]}
    >
      <p>Next: one big repository, or many small ones? Monorepos and submodules.</p>
    </WrapStep>
  );
}
