"use client";

import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { CommitGraph } from "../_shared/graph";
import { currentBranch, headCommit, switchTo } from "../_shared/repo";
import { FRAMES } from "./model";
import type { HistState } from "./state";

/* 1 ─ Story: numbered letters ---------------------------------------------------------------------- */

export function Letters() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“Further to my last letter…”"
      stage={
        <div className="flex flex-1 items-center justify-center gap-2">
          {["#1", "#2", "#3"].map((n, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="flex items-center gap-2"
            >
              {i > 0 && <span className="text-subtle">←</span>}
              <div className="border-line bg-surface w-28 rounded-lg border p-2 text-[10px]">
                <Mail className="text-accent size-4" />
                <p className="mt-1 font-semibold">Letter {n}</p>
                <p className="text-muted">{i === 0 ? "the first one" : `follows letter #${i}`}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Imagine letters where each one begins &ldquo;further to my letter #2&hellip;&rdquo;. Hand
        someone the newest letter and they can follow the chain all the way back to the first.
      </p>
      <p>
        Commits work like that. Each commit records its <Term id="parent-commit">parent</Term>, the
        commit it came after. Start from the newest and follow parents back, and you have the whole
        history. A marker called <Term id="head">HEAD</Term> tells Git which commit you&apos;re on
        now.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Grow the graph ⭐ ----------------------------------------------------------------------------- */

export function GrowGraph() {
  const [s, set] = useSceneState<HistState>();
  const f = FRAMES[s.frame];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Grow a history"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <code className="bg-surface-2/60 border-line rounded-md border px-3 py-1.5 font-mono text-xs">
            $ {f.cmd}
          </code>
          <CommitGraph repo={f.repo} className="border-line bg-surface rounded-xl border p-2" />
          <motion.div key={s.frame} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-semibold">{f.title}</p>
            <p className="text-muted text-sm">{f.body}</p>
          </motion.div>
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
            <span className="text-subtle font-mono text-[10px]">
              {s.frame + 1}/{FRAMES.length}
            </span>
          </div>
        </div>
      }
    >
      <p>
        Run each command and watch the graph. Circles are commits, lines point back to parents, and
        the coloured label shows where HEAD is.
      </p>
      <p>
        Hover a commit to see its ID and message. The IDs here are made up by a small simulation,
        but the shapes are exactly what <code>git log --graph</code> would draw.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Inside a commit ------------------------------------------------------------------------------ */

const OBJ = [
  ["tree", "d09d7a39…", "the snapshot: the top-level folder"],
  ["parent", "2a80eea4…", "the commit before (none for the root; two for a merge)"],
  [
    "author",
    "Kavya <kavya@cafe.example> 1760000000 +0530",
    "who wrote the change, and when, with time zone",
  ],
  [
    "committer",
    "Kavya <kavya@cafe.example> 1760000000 +0530",
    "who made the commit; differs after a rebase or cherry-pick",
  ],
  ["", "Add prices", "the message, after a blank line"],
];

export function InsideCommit() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Inside a commit"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted font-mono text-[11px]">$ git cat-file -p HEAD</p>
          <div className="border-line bg-surface grid gap-1 rounded-xl border p-3 font-mono text-[11px]">
            {OBJ.map(([k, v, why], i) => (
              <motion.div
                key={k + v}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className="grid gap-0.5 sm:grid-cols-[1fr_auto] sm:gap-3"
              >
                <span>
                  <span className="text-accent">{k}</span> {v}
                </span>
                <span className="text-subtle font-sans text-[10px]">{why}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A commit is a small text object: a pointer to a tree, pointers to its parents, who and when,
        and a message. Change any part, even the timestamp, and you get a different commit ID.
      </p>
      <p>
        That&apos;s why &ldquo;editing&rdquo; history always makes new commits. The old ones
        aren&apos;t changed; they&apos;re replaced, and the branch name is moved to the new ones.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Move HEAD ------------------------------------------------------------------------------------ */

export function MoveHead() {
  const [s, set] = useSceneState<HistState>();
  const base = FRAMES[5].repo;
  const repo = s.headRepo ?? base;
  const cur = currentBranch(repo);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where is HEAD?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <CommitGraph
            repo={repo}
            onCommit={(id) => set({ headRepo: switchTo(repo, id) })}
            className="border-line bg-surface rounded-xl border p-2"
          />
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(repo.branches).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => set({ headRepo: switchTo(repo, b) })}
                className="border-line-strong text-muted hover:text-fg rounded-full border px-2.5 py-0.5 text-[11px]"
              >
                git switch {b}
              </button>
            ))}
          </div>
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p className="text-muted">$ cat .git/HEAD</p>
            <p>{cur ? `ref: refs/heads/${cur}` : headCommit(repo)}</p>
            <p className="text-subtle mt-1 font-sans">
              {cur
                ? `HEAD points to the branch ${cur}; new commits will move ${cur}.`
                : "Detached: HEAD points straight at a commit. New commits won't belong to any branch."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        Click any commit to check it out directly, or switch to a branch. Watch what HEAD contains:
        usually the name of a branch, sometimes a raw commit ID.
      </p>
      <p>
        A detached HEAD isn&apos;t an error. It&apos;s how you look at an old version. Just remember
        to create a branch before committing there if you want to keep the work.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function HistCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="True or false?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-history"
            prompt="Is each statement about commits and HEAD true?"
            categories={[
              { id: "true", label: "True" },
              { id: "false", label: "False" },
            ]}
            items={[
              {
                id: "parent",
                label: "Each commit records its parent commit",
                category: "true",
                why: "That's how history is linked.",
              },
              {
                id: "child",
                label: "Each commit records its children",
                category: "false",
                why: "Only parents; children don't exist yet when it's made.",
              },
              {
                id: "merge",
                label: "A merge commit has two parents",
                category: "true",
                why: "One from each line of work.",
              },
              {
                id: "root",
                label: "Every commit has at least one parent",
                category: "false",
                why: "The root commit has none.",
              },
              {
                id: "head",
                label: "HEAD usually holds the name of a branch",
                category: "true",
                why: "Detached HEAD holds a commit ID instead.",
              },
              {
                id: "detached",
                label: "Commits made on a detached HEAD are safe forever",
                category: "false",
                why: "Nothing points to them once you switch away.",
              },
            ]}
            explanation="Commits point back to their parents; HEAD points to a branch, or directly to a commit when detached."
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
        ["Commits point to parents", "Follow them back and you have the history."],
        ["History is a graph", "Lines fork and merge commits join them."],
        ["Any change, new ID", "So rewriting history creates new commits."],
        ["HEAD is where you are", "Usually a branch name, sometimes a commit."],
        ["Detached HEAD", "Fine for looking; branch before committing."],
      ]}
    >
      <p>Next: branches, which turn out to be the simplest thing in Git.</p>
    </WrapStep>
  );
}
