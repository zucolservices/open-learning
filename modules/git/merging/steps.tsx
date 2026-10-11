"use client";

import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CommitGraph } from "../_shared/graph";
import { merge } from "../_shared/repo";
import { LINES, baseOf, decide, shape, type Shape } from "./model";
import type { MergeState } from "./state";

/* 1 ─ Story: two editors --------------------------------------------------------------------------- */

export function TwoEditors() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Two editors, one original"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
            <BookOpen className="text-accent size-4" /> The original chapter
          </div>
          <div className="flex gap-6">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              Editor A&apos;s copy
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              Editor B&apos;s copy
            </div>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            Combined: both sets of edits
          </div>
        </div>
      }
    >
      <p>
        Two editors each take a copy of the same chapter. To combine their work, you compare each
        copy with the <em>original</em>: whatever A changed, keep; whatever B changed, keep. Only
        where both changed the same sentence do you need to decide.
      </p>
      <p>
        That&apos;s a <Term id="three-way-merge">three-way merge</Term>, and it&apos;s how Git
        merges branches. The original is the <Term id="merge-base">merge base</Term>, the last
        commit both branches share. And if one side changed nothing at all, Git simply moves the
        pointer forward: a <Term id="fast-forward">fast-forward</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Merge three shapes ⭐ ------------------------------------------------------------------------ */

const SHAPES: [Shape, string][] = [
  ["ff", "main hasn't moved"],
  ["diverged", "Both moved on"],
  ["uptodate", "Already merged"],
];

export function MergeShapes() {
  const [s, set] = useSceneState<MergeState>();
  const start = shape(s.shape);
  const repo = s.merged ?? start;
  const base = baseOf(start);
  const message =
    s.kind === "fast-forward"
      ? "Fast-forward: main simply moved to specials' commit. No new commit."
      : s.kind === "merge"
        ? "Merge made by the 'ort' strategy: a new commit with two parents."
        : s.kind === "up-to-date"
          ? "Already up to date: everything on specials is already in main."
          : "";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Merge specials into main"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {SHAPES.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={s.shape === id}
                onClick={() => set({ shape: id, merged: null, kind: "" })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.shape === id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <CommitGraph
            repo={repo}
            highlight={base && !s.merged ? [base] : []}
            className="border-line bg-surface rounded-xl border p-2"
          />
          <p className="text-subtle text-[10px]">
            Highlighted before merging: the merge base, the last commit both branches share.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!!s.merged}
              onClick={() => {
                const out = merge(start, "specials", { noFf: s.noFf });
                set({ merged: out.repo, kind: out.kind });
              }}
              className="bg-accent text-accent-fg rounded-full px-4 py-1 text-xs font-medium disabled:opacity-40"
            >
              git merge {s.noFf ? "--no-ff " : ""}specials
            </button>
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.noFf}
                onChange={(e) => set({ noFf: e.target.checked, merged: null, kind: "" })}
                className="accent-accent"
              />
              --no-ff
            </label>
            <button
              type="button"
              onClick={() => set({ merged: null, kind: "" })}
              className="text-muted text-xs underline"
            >
              undo
            </button>
          </div>
          {message && (
            <motion.p
              key={s.kind}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]"
            >
              {message}
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        Try each shape and merge. When main hasn&apos;t moved since specials branched off, Git
        fast-forwards. When both have new commits, it creates a merge commit with two parents.
      </p>
      <p>
        Tick <code>--no-ff</code> to force a merge commit even when a fast-forward is possible. Some
        teams do this so every feature shows up as one clear merge in the history.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Line by line --------------------------------------------------------------------------------- */

export function LineByLine() {
  const [s, set] = useSceneState<MergeState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="How a three-way merge decides"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="text-muted grid grid-cols-4 gap-1 text-[10px] uppercase">
            <span>Base</span>
            <span>Ours (main)</span>
            <span>Theirs (specials)</span>
            <span>Result</span>
          </div>
          {LINES.map((l, i) => {
            const d = decide(l);
            const on = s.line >= i;
            return (
              <button
                key={l.base}
                type="button"
                onClick={() => set({ line: i })}
                className={cn(
                  "grid grid-cols-4 gap-1 rounded-lg border px-2 py-1.5 text-left text-[11px]",
                  on
                    ? d.conflict
                      ? "border-bad/50 bg-bad/10"
                      : "border-good/40 bg-good/10"
                    : "border-line bg-surface",
                )}
              >
                <span className="text-muted">{l.base}</span>
                <span className={cn(l.ours !== l.base && "font-semibold")}>{l.ours}</span>
                <span className={cn(l.theirs !== l.base && "font-semibold")}>{l.theirs}</span>
                <span>{on ? d.result : "?"}</span>
              </button>
            );
          })}
          {s.line >= 0 && <p className="text-xs">{decide(LINES[s.line]).why}</p>}
        </div>
      }
    >
      <p>
        Click each line to see the merge decide. Git compares both sides with the base: a change on
        one side wins automatically, matching changes are fine, and only different changes to the
        same lines become a <Term id="merge-conflict">conflict</Term>.
      </p>
      <p>
        That&apos;s why most merges need no help at all, even when two people edited the same file.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Strategies ----------------------------------------------------------------------------------- */

export function Strategies() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Merge strategies, briefly"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "ort",
              "The default since Git 2.34 (2021). Faster and better at renames than the old 'recursive', which Git 2.50 retired: asking for it now runs ort.",
            ],
            [
              "Fast-forward only",
              "git merge --ff-only refuses unless a fast-forward is possible. Useful for keeping main linear.",
            ],
            ["--no-ff", "Always make a merge commit, so the branch's work stays visibly grouped."],
            [
              "Octopus",
              "Merges several branches at once into one commit with many parents. Rare in practice.",
            ],
            [
              "Squash (on hosting platforms)",
              "Combines a branch's commits into one new commit on main. Not a true merge: the branch isn't recorded as a parent.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You rarely need to choose a strategy: Git&apos;s default handles almost everything. What
        teams do choose is the <em>shape</em> they want in history: a straight line, or visible
        merge commits.
      </p>
      <p>We&apos;ll come back to that choice with pull requests and branching strategies.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function MergeCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What will git merge do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-merging"
            prompt="You're on main and run git merge feature. What happens?"
            categories={[
              { id: "ff", label: "Fast-forward" },
              { id: "merge", label: "Merge commit" },
              { id: "none", label: "Nothing to do" },
            ]}
            items={[
              {
                id: "a",
                label: "main has no new commits since feature branched off",
                category: "ff",
                why: "main can just move forward.",
              },
              {
                id: "b",
                label: "Both main and feature have new commits",
                category: "merge",
                why: "Two lines must be joined.",
              },
              {
                id: "c",
                label: "feature was already merged into main last week",
                category: "none",
                why: "Already up to date.",
              },
              {
                id: "d",
                label: "main has no new commits, but you pass --no-ff",
                category: "merge",
                why: "--no-ff forces a merge commit.",
              },
              {
                id: "e",
                label: "feature is behind main and has no commits of its own",
                category: "none",
                why: "Everything is already in main.",
              },
            ]}
            explanation="If main hasn't moved, Git fast-forwards; if both moved, it makes a merge commit from the merge base; if feature adds nothing new, there's nothing to merge."
          />
        </div>
      }
    >
      <p>Sort each situation.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Fast-forward", "One side didn't move: just move the pointer."],
        ["Three-way merge", "Compare both sides with their merge base."],
        ["Merge commit", "Two parents join the lines."],
        ["Conflicts are rare", "Only when both changed the same lines differently."],
        ["ort is the default", "recursive was retired in Git 2.50."],
      ]}
    >
      <p>Next: what to do when a merge does hit a conflict.</p>
    </WrapStep>
  );
}
