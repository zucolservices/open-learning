"use client";

import { motion } from "motion/react";
import { Folder, Archive, Bookmark } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { STASH, WORKTREE } from "./model";
import type { StashState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Interrupted() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Interrupted mid-recipe"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <Archive className="text-accent size-5" />
            <p className="mt-1 font-semibold">Clear the counter into a box</p>
            <p className="text-muted">
              Put the half-made dish aside, cook the urgent order, then unpack the box.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <Bookmark className="text-accent size-5" />
            <p className="mt-1 font-semibold">Use a second counter</p>
            <p className="text-muted">
              Leave everything where it is and cook the urgent order at the next counter.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        You&apos;re halfway through a recipe when an urgent order arrives. You can sweep your work
        into a box and clear the counter, or step over to a second counter and leave everything as
        it is.
      </p>
      <p>
        Git offers both. <Term id="stash">Stash</Term> shelves uncommitted changes so you can switch
        branches cleanly. A <Term id="worktree">worktree</Term> gives you a second folder, on
        another branch, sharing the same repository.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Two ways ⭐ ---------------------------------------------------------------------------------- */

export function TwoWays() {
  const [s, set] = useSceneState<StashState>();
  const frames = s.way === "stash" ? STASH : WORKTREE;
  const f = frames[Math.min(s.frame, frames.length - 1)];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Handle the interruption"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.way}
            onChange={(v) => set({ way: v, frame: 0 })}
            options={[
              ["stash", "With stash"],
              ["worktree", "With a worktree"],
            ]}
            size="sm"
          />
          <code className="bg-surface-2/60 border-line rounded-md border px-3 py-1.5 font-mono text-xs">
            $ {f.cmd}
          </code>
          <div className="grid gap-2 sm:grid-cols-2">
            {f.folders.map((fo) => (
              <motion.div
                key={fo.path}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-line bg-surface rounded-xl border p-3 text-xs"
              >
                <p className="flex items-center gap-1.5 font-mono">
                  <Folder className="text-accent size-4" /> {fo.path}
                </p>
                <p className="text-muted mt-1">
                  on branch <span className="text-fg font-mono">{fo.branch}</span>
                </p>
                <p className="mt-1">
                  {fo.dirty.length ? `uncommitted: ${fo.dirty.join(", ")}` : "clean"}
                </p>
              </motion.div>
            ))}
            {s.way === "stash" && (
              <div
                className={cn(
                  "rounded-xl border p-3 text-xs",
                  f.stash.length ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="flex items-center gap-1.5 font-semibold">
                  <Archive className="size-4" /> git stash list
                </p>
                <p className="mt-1 font-mono text-[11px]">
                  {f.stash.length ? f.stash[0] : "(empty)"}
                </p>
              </div>
            )}
          </div>
          <p className="text-sm">{f.note}</p>
          <div className="flex gap-2">
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
              disabled={s.frame >= frames.length - 1}
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
        Step through the same interruption twice: once shelving your work with stash, once opening a
        second worktree for the fix.
      </p>
      <p>
        Stash is quickest for a short detour. A worktree is better when the detour is long, or when
        you want both versions open at once, say to run a long build on one while editing the other.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Stash details --------------------------------------------------------------------------------- */

export function StashDetails() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Stash, in a little more detail"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ['git stash push -m "…"', "Name it, so the list makes sense later."],
            ["git stash -u", "Also stash untracked files; by default new files are left behind."],
            [
              "git stash pop vs apply",
              "pop applies and removes the entry; apply keeps it, handy if you want it on two branches.",
            ],
            ["git stash list / drop", "Stashes pile up quietly. Review and drop old ones."],
            [
              "git stash branch name",
              "Turn a stash into a new branch, starting from the commit it was made on. Avoids conflicts.",
            ],
            [
              "Conflicts on pop",
              "If the branch changed underneath, popping can conflict. The stash entry is kept until you resolve it.",
            ],
          ].map(([c, b], i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface grid grid-cols-[10rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-xs"
            >
              <code className="text-accent font-mono text-[11px]">{c}</code>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A stash is stored as commits under the hood, so it&apos;s safe while it exists. But
        it&apos;s easy to forget what&apos;s in there. For anything you&apos;ll come back to
        tomorrow, a commit on a branch (a &ldquo;wip&rdquo; you&apos;ll tidy later) is clearer.
      </p>
      <p>Since Git 2.51 you can even export stashes and import them on another machine.</p>
    </StepLayout>
  );
}

/* 4 ─ Which to use ---------------------------------------------------------------------------------- */

export function WhichToUse() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Stash, worktree, or just commit?"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-3">
          {[
            ["Stash", "A five-minute detour: pull, switch, fix something small, come back."],
            [
              "Worktree",
              "Long or parallel work: review a pull request while your branch builds; keep a release branch checked out.",
            ],
            [
              "Commit",
              "End of day, or anything you might forget: a wip commit on your branch, tidied before review.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-xl border p-3 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Worktrees have been in Git since 2.5 (2015) but many developers have never heard of them.
        They save a lot of stashing, and of cloning the same repository twice.
      </p>
      <p>
        All worktrees share one set of objects, so they cost little disk space beyond the
        checked-out files.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function StashCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Stash or worktree?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-stash-worktree"
            prompt="Which tool suits each situation best?"
            categories={[
              { id: "stash", label: "Stash" },
              { id: "worktree", label: "Worktree" },
            ]}
            items={[
              {
                id: "pull",
                label: "Quickly pull main while you have a couple of uncommitted edits",
                category: "stash",
                why: "A short detour.",
              },
              {
                id: "review",
                label: "Review a teammate's branch while your own 20-minute build runs",
                category: "worktree",
                why: "Both checked out at once.",
              },
              {
                id: "typo",
                label: "Fix a typo on main, then carry on with your feature",
                category: "stash",
                why: "Five minutes.",
              },
              {
                id: "release",
                label: "Keep the release-2.x branch checked out permanently for hotfixes",
                category: "worktree",
                why: "A long-lived second folder.",
              },
              {
                id: "compare",
                label: "Run the old and new versions side by side to compare",
                category: "worktree",
                why: "Two working trees.",
              },
            ]}
            explanation="Stash shelves changes for a short detour; worktrees give you parallel, long-lived checkouts of other branches."
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
        ["Stash shelves changes", "push -m to save, pop to bring back."],
        ["Mind untracked files", "stash -u includes them."],
        ["Worktrees are extra folders", "Another branch, the same repository."],
        ["One branch, one worktree", "Create a new branch for the second folder."],
        ["When in doubt, commit", "A wip commit beats a forgotten stash."],
      ]}
    >
      <p>Next: finding the commit that broke something, with bisect and blame.</p>
    </WrapStep>
  );
}
