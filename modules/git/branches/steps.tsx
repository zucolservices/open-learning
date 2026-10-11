"use client";

import { motion } from "motion/react";
import { Bookmark } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CommitGraph } from "../_shared/graph";
import { branch, commit, currentBranch, deleteBranch, switchTo } from "../_shared/repo";
import { initialState, type BranchState } from "./state";

/* 1 ─ Story: bookmarks ----------------------------------------------------------------------------- */

export function Bookmarks() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A bookmark, not a photocopy"
      stage={
        <div className="flex flex-1 items-center justify-center gap-4">
          {["Kavya's place", "Tom's place"].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex w-32 flex-col items-center rounded-xl border p-3 text-center"
            >
              <Bookmark className="text-accent size-6" />
              <p className="mt-1 text-xs font-semibold">{t}</p>
              <p className="text-muted text-[10px]">page {i ? 41 : 87} of the same book</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Two people reading the same book don&apos;t photocopy it. Each slips in a bookmark. A
        bookmark is tiny, costs nothing, and moves forward as you read on.
      </p>
      <p>
        A Git <Term id="branch">branch</Term> is a bookmark in history: a name pointing at one
        commit. When you commit on a branch, the bookmark moves to the new commit. Nothing is
        copied, which is why Git branches are instant and cheap.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branch playground ⭐ ------------------------------------------------------------------------- */

const NAMES = ["specials", "hotfix", "redesign"];

export function Playground() {
  const [s, set] = useSceneState<BranchState>();
  const r = s.repo;
  const cur = currentBranch(r);
  const next = NAMES.find((n) => !r.branches[n]);
  const msgs = ["Add chai", "New logo", "Fix footer", "Update hours", "Add photos", "Tidy CSS"];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Branch playground"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <CommitGraph repo={r} className="border-line bg-surface rounded-xl border p-2" />
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => set({ repo: commit(r, msgs[s.n % msgs.length]), n: s.n + 1 })}
              className="bg-accent text-accent-fg rounded-full px-3 py-1 text-xs font-medium"
            >
              git commit
            </button>
            {next && (
              <button
                type="button"
                onClick={() => set({ repo: switchTo(branch(r, next), next) })}
                className="border-line-strong rounded-full border px-3 py-1 text-xs"
              >
                git switch -c {next}
              </button>
            )}
            {Object.keys(r.branches)
              .filter((b) => b !== cur)
              .map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => set({ repo: switchTo(r, b) })}
                  className="border-line-strong rounded-full border px-3 py-1 text-xs"
                >
                  git switch {b}
                </button>
              ))}
            {Object.keys(r.branches)
              .filter((b) => b !== cur && b !== "main")
              .map((b) => (
                <button
                  key={`d-${b}`}
                  type="button"
                  onClick={() => set({ repo: deleteBranch(r, b) })}
                  className="border-bad/50 text-bad rounded-full border px-3 py-1 text-xs"
                >
                  git branch -D {b}
                </button>
              ))}
            <button
              type="button"
              onClick={() => set({ repo: initialState.repo, n: 0 })}
              className="text-muted px-2 text-xs underline"
            >
              reset
            </button>
          </div>
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p className="text-muted">.git/refs/heads/</p>
            {Object.entries(r.branches).map(([b, id]) => (
              <p key={b}>
                <span className={cn("whitespace-pre", b === cur && "text-accent")}>
                  {b.padEnd(10, " ")}
                </span>{" "}
                → {id}…
              </p>
            ))}
            <p className="text-subtle mt-1 font-sans">
              Each branch is one small file holding a commit ID. Deleting a branch deletes the file,
              not the commits.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Commit, create branches, switch between them and delete them. Watch the commits and the
        pointers separately: commits never move, only the names do.
      </p>
      <p>
        Deleting a branch doesn&apos;t delete its commits. If nothing else points to them they
        become unreachable, faded here, and Git will clean them up eventually. That&apos;s why
        <code> -D</code> (force) exists: Git warns when a branch&apos;s work isn&apos;t merged
        anywhere.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why it's cheap ------------------------------------------------------------------------------- */

export function Cheap() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why branching is cheap"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <p className="font-semibold">Older, copy-based branching</p>
            <p className="text-muted mt-1">
              In systems like Subversion a branch is a copy of a directory on the server. Cheap
              copies made it workable, but branches still felt heavy and merging them was painful,
              so teams avoided them.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border p-3 text-xs">
            <p className="font-semibold">Git</p>
            <p className="mt-1">
              A branch is a name and a commit ID: a few dozen bytes. Creating one is instant and
              works offline. Teams make a branch for every task, sometimes several a day.
            </p>
          </div>
          <div className="border-line bg-surface-2/60 rounded-xl border p-3 text-xs sm:col-span-2">
            <p className="font-semibold">Where the pointers live</p>
            <p className="text-muted mt-1">
              Traditionally each branch is a file under <code>.git/refs/heads/</code>. A newer
              storage backend, reftable, keeps all of them in compact binary tables instead. Either
              way, a branch is just a named pointer to a commit.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Because branches cost nothing, Git encourages a branch for every piece of work, merged back
        when it&apos;s ready. Everything in the next few modules builds on this.
      </p>
      <p>
        Switching branches is also quick: Git only rewrites the files that differ between the two
        snapshots.
      </p>
    </StepLayout>
  );
}

/* 4 ─ main or master -------------------------------------------------------------------------------- */

export function MainOrMaster() {
  const [s, set] = useSceneState<BranchState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="main or master?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.dflt}
            onChange={(v) => set({ dflt: v })}
            options={[
              ["master", "Plain git init (today)"],
              ["main", "With init.defaultBranch=main"],
            ]}
            size="sm"
          />
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p className="text-muted">$ git init</p>
            {s.dflt === "master" ? (
              <>
                <p className="text-subtle">
                  hint: Using &apos;master&apos; as the name for the initial branch…
                </p>
                <p>Initialized empty Git repository · branch: master</p>
              </>
            ) : (
              <p>Initialized empty Git repository · branch: main</p>
            )}
          </div>
          <div className="grid gap-1 text-xs">
            {[
              [
                "2020",
                "Git 2.28 adds init.defaultBranch, so you can choose the first branch's name.",
              ],
              [
                "Oct 2020",
                "GitHub names the default branch main for new repositories; other hosts followed.",
              ],
              ["Today", "Plain git init still says master, with a hint. Most teams use main."],
              [
                "Git 3.0",
                "Planned: main becomes the default for new repositories. No release date yet.",
              ],
            ].map(([d, t]) => (
              <div
                key={d}
                className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-md border px-3 py-1.5"
              >
                <span className="text-accent font-mono">{d}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The first branch&apos;s name is just a convention; Git treats every branch the same.
        You&apos;ll see both names in real projects.
      </p>
      <p>
        To create a branch and switch to it in one go, use <code>git switch -c name</code> (or the
        older
        <code> git checkout -b name</code>).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function BranchCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="True or false?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-branches"
            prompt="Is each statement about branches true?"
            categories={[
              { id: "true", label: "True" },
              { id: "false", label: "False" },
            ]}
            items={[
              {
                id: "pointer",
                label: "A branch is a name pointing to a commit",
                category: "true",
                why: "That's all it is.",
              },
              {
                id: "copy",
                label: "Creating a branch copies the project's files",
                category: "false",
                why: "Only a pointer is written.",
              },
              {
                id: "moves",
                label: "Committing moves the current branch forward",
                category: "true",
                why: "The pointer follows the new commit.",
              },
              {
                id: "delete",
                label: "Deleting a branch deletes its commits immediately",
                category: "false",
                why: "They become unreachable and are cleaned up later.",
              },
              {
                id: "special",
                label: "Git treats main specially compared with other branches",
                category: "false",
                why: "It's only a convention.",
              },
              {
                id: "offline",
                label: "You can create branches while offline",
                category: "true",
                why: "It's a local operation.",
              },
            ]}
            explanation="A branch is a cheap, movable pointer. Commits stay where they are; names move."
          />
        </div>
      }
    >
      <p>Sort each statement.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["A branch is a pointer", "A name and a commit ID."],
        ["It moves when you commit", "The commits themselves never move."],
        ["Cheap and instant", "Make one for every piece of work."],
        ["Deleting a branch", "Removes the name; unmerged commits become unreachable."],
        ["main or master", "Just a convention; main planned as Git 3.0's default."],
      ]}
    >
      <p>Next: bringing branches back together with a merge.</p>
    </WrapStep>
  );
}
