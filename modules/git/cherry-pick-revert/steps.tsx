"use client";

import { motion } from "motion/react";
import { Cherry, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CommitGraph } from "../_shared/graph";
import { FRAMES } from "./model";
import type { PickState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Recipe() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Copy one recipe, cross out another"
      stage={
        <div className="flex flex-1 items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface w-40 rounded-xl border p-3 text-xs"
          >
            <Cherry className="text-accent size-5" />
            <p className="mt-1 font-semibold">Cherry-pick</p>
            <p className="text-muted">
              Copy one recipe from the test kitchen&apos;s book into the restaurant&apos;s book.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-line bg-surface w-40 rounded-xl border p-3 text-xs"
          >
            <X className="text-bad size-5" />
            <p className="mt-1 font-semibold">Revert</p>
            <p className="text-muted">
              Add a dated note: &ldquo;page 12 withdrawn&rdquo;, without tearing the page out.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A café&apos;s test kitchen keeps a book of experiments. When one recipe is ready, the chef
        copies just that one into the restaurant&apos;s book. When a recipe in the restaurant&apos;s
        book turns out badly, they don&apos;t rip the page out; everyone has photocopies. They add a
        note withdrawing it.
      </p>
      <p>
        <Term id="cherry-pick">Cherry-pick</Term> copies one commit&apos;s change to another branch.{" "}
        <Term id="revert">Revert</Term> undoes a commit by adding a new commit that does the
        opposite.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Hotfix and undo ⭐ --------------------------------------------------------------------------- */

export function HotfixAndUndo() {
  const [s, set] = useSceneState<PickState>();
  const f = FRAMES[s.frame];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="A hotfix and an undo"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <code className="bg-surface-2/60 border-line rounded-md border px-3 py-1.5 font-mono text-xs">
            $ {f.cmd}
          </code>
          <CommitGraph
            repo={f.repo}
            highlight={f.hot}
            className="border-line bg-surface rounded-xl border p-2"
          />
          <motion.div key={s.frame} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-semibold">{f.title}</p>
            <p className="text-muted text-sm">{f.body}</p>
          </motion.div>
          {s.frame === 2 && (
            <p className="bg-surface-2/60 border-line rounded-md border px-3 py-1.5 font-mono text-[11px]">
              Fix wrong GST on bills
              <br />
              <span className="text-subtle">(cherry picked from commit {FRAMES[0].hot[0]}…)</span>
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={s.frame === 0}
              onClick={() => set({ frame: s.frame - 1 })}
              className="border-line text-muted rounded-full border px-3 py-1 text-xs disabled:opacity-40"
            >
              Step back
            </button>
            <button
              type="button"
              disabled={s.frame >= FRAMES.length - 1}
              onClick={() => set({ frame: s.frame + 1 })}
              className="bg-accent text-accent-fg rounded-full px-4 py-1 text-xs font-medium disabled:opacity-40"
            >
              Run the next command
            </button>
          </div>
        </div>
      }
    >
      <p>
        Step through a typical week: an urgent fix goes from main to the release branch with
        cherry-pick, then a shared feature is backed out with revert. Highlighted commits are the
        ones each command touches.
      </p>
      <p>
        Notice that the cherry-picked commit is a different commit from the original, with a
        different ID: same change, new parent.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Revert or reset? ----------------------------------------------------------------------------- */

const OPTS = [
  {
    id: "revert",
    label: "git revert the commit",
    ok: true,
    why: "Adds an undo commit. Safe for shared history: everyone just pulls it.",
  },
  {
    id: "reset",
    label: "git reset --hard to before it, then force-push",
    ok: false,
    why: "Rewrites shared history. Teammates who pulled the bad commit will now have diverged copies.",
  },
  {
    id: "delete",
    label: "Delete the lines by hand and commit 'fix'",
    ok: false,
    why: "Works, but loses the link to what was undone and is easy to get wrong. Revert does it exactly.",
  },
];

export function RevertOrReset() {
  const [s, set] = useSceneState<PickState>();
  const o = OPTS.find((x) => x.id === s.choice);
  return (
    <StepLayout
      eyebrow="Explore"
      title="The bad commit is already pushed. Now what?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {OPTS.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={s.choice === x.id}
              onClick={() => set({ choice: x.id })}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm",
                s.choice !== x.id && "border-line hover:bg-surface-2",
                s.choice === x.id &&
                  (x.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10"),
              )}
            >
              {x.label}
            </button>
          ))}
          {o && (
            <p className="flex items-start gap-1.5 text-xs">
              {o.ok ? (
                <Check className="text-good mt-0.5 size-3.5 shrink-0" />
              ) : (
                <X className="text-bad mt-0.5 size-3.5 shrink-0" />
              )}
              {o.why}
            </p>
          )}
          <div className="border-line bg-surface-2/60 mt-2 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Two details</p>
            <p className="text-muted mt-1">
              Reverting a merge commit needs <code>-m 1</code> (or another parent number) to say
              which side to keep. And reverting a revert brings the change back; since Git 2.43 such
              commits are titled <code>Reapply &quot;…&quot;</code>.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Once a commit is shared, the safe way to undo it is to add to history, not rewrite it. Pick
        an option and see why.
      </p>
      <p>
        We&apos;ll look at all the ways to undo, including the local-only ones, in the recovery
        chapter.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When to cherry-pick -------------------------------------------------------------------------- */

export function WhenToPick() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Good and bad reasons to cherry-pick"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs">
            <p className="font-semibold">Good uses</p>
            <ul className="mt-1 grid gap-1">
              <li>• Backport a fix to a release or older version branch</li>
              <li>• Rescue one useful commit from an abandoned branch</li>
              <li>• Apply a commit made on the wrong branch, then remove it there</li>
            </ul>
          </div>
          <div className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs">
            <p className="font-semibold">Warning signs</p>
            <ul className="mt-1 grid gap-1">
              <li>
                • Cherry-picking dozens of commits to keep branches &ldquo;in sync&rdquo;: merge
                instead
              </li>
              <li>• Picking a commit that depends on others you didn&apos;t pick</li>
              <li>• Losing track of which fix is where: use -x</li>
            </ul>
          </div>
        </div>
      }
    >
      <p>
        Cherry-pick duplicates a change. Done occasionally, for a specific reason, it&apos;s exactly
        the right tool. Done routinely, it creates two copies of history that drift apart.
      </p>
      <p>
        The <code>-x</code> option leaves a breadcrumb in the message so you can always find the
        original.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function PickCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Cherry-pick or revert?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-cherry-revert"
            prompt="Which command fits each job?"
            categories={[
              { id: "pick", label: "Cherry-pick" },
              { id: "revert", label: "Revert" },
            ]}
            items={[
              {
                id: "backport",
                label: "Put last week's security fix on the 2.x support branch",
                category: "pick",
                why: "Copy one change to another branch.",
              },
              {
                id: "undo",
                label: "Undo a pushed commit that broke checkout",
                category: "revert",
                why: "Safe undo on shared history.",
              },
              {
                id: "rescue",
                label: "Take one good commit from an abandoned experiment",
                category: "pick",
                why: "Copy just that commit.",
              },
              {
                id: "merge",
                label: "Back out a feature that was merged yesterday",
                category: "revert",
                why: "Revert the merge with -m 1.",
              },
              {
                id: "wrong",
                label: "Move a commit you made on the wrong branch",
                category: "pick",
                why: "Pick it onto the right branch, then remove it from the wrong one.",
              },
            ]}
            explanation="Cherry-pick copies a commit's change to the current branch; revert adds a commit that undoes one."
          />
        </div>
      }
    >
      <p>Sort each job.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Cherry-pick copies a change", "As a new commit, on your current branch."],
        ["Use -x", "It records where the change came from."],
        ["Revert undoes safely", "A new opposite commit; history stays intact."],
        ["Merges need -m", "Say which parent to keep."],
        ["Don't sync by cherry-picking", "Merge branches instead."],
      ]}
    >
      <p>
        That completes branching. Next chapter: collaboration, starting with remotes and how copies
        stay in sync.
      </p>
    </WrapStep>
  );
}
