"use client";

import { motion } from "motion/react";
import { Footprints } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CommitGraph } from "../_shared/graph";
import { hardReset, restore, startRepo, withRefs, deletedBranchRepo } from "./model";
import type { ReflogState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Footsteps() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Footprints in the snow"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex w-64 flex-col items-center rounded-xl border p-4 text-center text-xs"
          >
            <Footprints className="text-accent size-8" />
            <p className="mt-2">
              Lost your way? Your own footprints lead back to every place you stood.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Walking through fresh snow, you leave a trail. Take a wrong turn and you can always follow
        your own footprints back to where you were, as long as the snow hasn&apos;t melted.
      </p>
      <p>
        The <Term id="reflog">reflog</Term> is that trail. Every time HEAD or a branch moves (a
        commit, a reset, a checkout, a rebase), Git writes down where it was. After a bad reset or a
        deleted branch, the old commits are usually still there, and the reflog tells you where.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Lose it, find it ⭐ --------------------------------------------------------------------------- */

export function LoseAndFind() {
  const [s, set] = useSceneState<ReflogState>();
  const log = withRefs(s.log);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Lose two commits, then get them back"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <CommitGraph repo={s.repo} className="border-line bg-surface rounded-xl border p-2" />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={s.stage !== "before"}
              onClick={() => {
                const o = hardReset(s.repo, s.log);
                set({ repo: o.repo, log: o.log, stage: "lost" });
              }}
              className="border-bad text-bad rounded-full border px-3 py-1 text-xs font-medium disabled:opacity-40"
            >
              git reset --hard HEAD~2 (oops)
            </button>
            <button
              type="button"
              onClick={() => {
                const o = startRepo();
                set({ repo: o.repo, log: o.log, stage: "before", savedFrom: "" });
              }}
              className="text-muted text-xs underline"
            >
              start over
            </button>
          </div>
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p className="text-muted">$ git reflog</p>
            {log.map((e) => (
              <button
                key={e.ref}
                type="button"
                disabled={s.stage !== "lost" || e.action.startsWith("reset")}
                onClick={() => {
                  const o = restore(s.repo, s.log, e.id);
                  set({ repo: o.repo, stage: "saved", savedFrom: e.ref });
                }}
                className={cn(
                  "enabled:hover:bg-accent-soft block w-full rounded px-1 text-left",
                  s.savedFrom === e.ref && "bg-good/15",
                )}
              >
                <span className="text-accent">{e.id.slice(0, 7)}</span> {e.ref}: {e.action}
              </button>
            ))}
          </div>
          <p className="text-xs">
            {s.stage === "before" && "Five commits on main. Press the button to make the mistake."}
            {s.stage === "lost" &&
              "Two commits look gone (faded): nothing points to them. Click the reflog line from just before the reset to rescue them."}
            {s.stage === "saved" &&
              `Ran: git branch rescue ${s.savedFrom}. The 'lost' commits are reachable again on the rescue branch.`}
          </p>
        </div>
      }
    >
      <p>
        Make the classic mistake: a hard reset that throws away your last two commits. They vanish
        from the log, but not from the repository.
      </p>
      <p>
        Read the reflog from the top: the newest entry is the reset. The line below it is where you
        were before. Point a new branch there (or reset back to it) and the work is back.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Deleted branch -------------------------------------------------------------------------------- */

export function DeletedBranch() {
  const repo = deletedBranchRepo();
  const tip = Object.values(repo.commits)
    .sort((a, b) => b.seq - a.seq)[0]
    .id.slice(0, 7);
  return (
    <StepLayout
      eyebrow="Explore"
      title="The branch you deleted too soon"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <CommitGraph
            repo={deletedBranchRepo()}
            className="border-line bg-surface rounded-xl border p-2"
          />
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p>$ git branch -D experiment</p>
            <p className="text-muted">Deleted branch experiment (was {tip}).</p>
            <p className="mt-1">$ git branch experiment {tip}</p>
            <p className="text-good font-sans">
              Back. Git even printed the ID you needed when it deleted the branch.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Deleting a branch removes only the name. The commits stay, unreachable, until Git cleans up.
        Git prints the old tip&apos;s ID when you delete a branch, and the reflog of HEAD shows it
        too.
      </p>
      <p>Recreate the branch at that ID and it&apos;s as if nothing happened.</p>
    </StepLayout>
  );
}

/* 4 ─ Limits ---------------------------------------------------------------------------------------- */

export function Limits() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the reflog can't save"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "It's local",
              "Your reflog lives in your repository only. It isn't pushed, and a fresh clone starts with an empty one.",
            ],
            [
              "It expires",
              "By default, entries last 90 days, or 30 days for commits no branch can reach. Cleanup (git gc) then removes unreachable objects older than about two weeks.",
            ],
            [
              "Uncommitted edits aren't in it",
              "Edits you never staged or committed, wiped by reset --hard or restore, are gone.",
            ],
            [
              "Staged but never committed",
              "Staging wrote the content as a blob, so git fsck --lost-found can usually dig it up, without file names.",
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
        The lesson: <em>commit early</em>. Once something is committed, it&apos;s very hard to lose
        for weeks, even after a mistake. Only work that never reached a commit is truly fragile.
      </p>
      <p>
        You can also refer to old positions directly:{" "}
        <code>
          main@{"{"}yesterday{"}"}
        </code>{" "}
        or{" "}
        <code>
          HEAD@{"{"}2{"}"}
        </code>{" "}
        work anywhere a commit is expected.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ReflogCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Can you get it back?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-reflog"
            prompt="Can each piece of work be recovered from your own repository?"
            categories={[
              { id: "yes", label: "Recoverable" },
              { id: "no", label: "Gone" },
            ]}
            items={[
              {
                id: "reset",
                label: "Two commits removed by reset --hard an hour ago",
                category: "yes",
                why: "The reflog has the old position.",
              },
              {
                id: "deleted",
                label: "A branch you deleted this morning",
                category: "yes",
                why: "Recreate it at its old tip.",
              },
              {
                id: "unstaged",
                label: "Edits you never staged, wiped by reset --hard",
                category: "no",
                why: "Never stored by Git.",
              },
              {
                id: "staged",
                label: "A file you staged but never committed, before a reset --hard",
                category: "yes",
                why: "The blob exists; git fsck --lost-found finds it.",
              },
              {
                id: "old",
                label: "Unreachable commits from five months ago, after cleanup",
                category: "no",
                why: "Expired and pruned.",
              },
              {
                id: "teammate",
                label: "A commit on a teammate's laptop that was never pushed",
                category: "no",
                why: "Your reflog only knows your repository.",
              },
            ]}
            explanation="Anything committed (or staged) in your repository is usually recoverable for weeks; uncommitted edits and other people's local work aren't."
          />
        </div>
      }
    >
      <p>Sort each case.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["The reflog is your trail", "Every move of HEAD and branches, locally."],
        ["Committed work is hard to lose", "Find it with git reflog."],
        ["Rescue with a branch", "git branch rescue HEAD@{1}."],
        ["It expires", "90 days, 30 for unreachable, then cleanup."],
        ["Commit early", "Uncommitted edits have no safety net."],
      ]}
    >
      <p>Next: switching tasks without losing your place, with stash and worktrees.</p>
    </WrapStep>
  );
}
