"use client";

import { motion } from "motion/react";
import { Laptop, Server, BookCopy } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CommitGraph } from "../_shared/graph";
import { aheadBehind, fetch, localCommit, pull, push, start, type Who } from "./model";
import type { RemoteState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Photocopies() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Everyone's copy of the recipe book"
      stage={
        <div className="flex flex-1 items-center justify-center gap-3">
          {["Kavya's copy", "The café's master copy", "Tom's copy"].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "w-28 rounded-xl border p-3 text-center text-xs",
                i === 1 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <BookCopy className="text-accent mx-auto size-5" />
              <p className="mt-1">{t}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Each cook keeps a full copy of the café&apos;s recipe book at home and adds recipes there.
        Once a day they go to the café: they look at what&apos;s new in the master copy, copy it
        into their book, and add their own new recipes to the master.
      </p>
      <p>
        In Git, the master copy is a <Term id="remote">remote</Term>, usually called{" "}
        <code>origin</code>. <Term id="fetch">Fetch</Term> brings its new commits into your copy,{" "}
        <Term id="pull">pull</Term> fetches and then combines them with your work, and{" "}
        <Term id="push">push</Term> sends your commits up.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Sync three copies ⭐ ------------------------------------------------------------------------- */

const MSGS: Record<Who, string[]> = {
  kavya: ["Kavya: new header", "Kavya: fix footer", "Kavya: add photos"],
  tom: ["Tom: update prices", "Tom: add chai", "Tom: tidy CSS"],
};

function Copy({
  who,
  s,
  set,
}: {
  who: Who;
  s: RemoteState;
  set: (p: Partial<RemoteState>) => void;
}) {
  const r = s.world[who];
  const ab = aheadBehind(r);
  const name = who === "kavya" ? "Kavya's laptop" : "Tom's laptop";
  const log = (m: string) => [...s.log, `${name}: ${m}`].slice(-3);
  return (
    <div className="border-line bg-surface rounded-xl border p-2">
      <p className="flex items-center gap-1.5 text-xs font-semibold">
        <Laptop className="text-muted size-3.5" /> {name}
        <span className="text-subtle ml-auto font-mono text-[10px] font-normal">
          ahead {ab.ahead} · behind {ab.behind}
        </span>
      </p>
      <CommitGraph repo={r} />
      <div className="flex flex-wrap gap-1">
        {[
          [
            "commit",
            () => ({
              world: localCommit(s.world, who, MSGS[who][s.world.n % 3]),
              log: log("git commit"),
            }),
          ],
          [
            "push",
            () => {
              const o = push(s.world, who);
              return { world: o.world, log: log(`git push · ${o.msg}`) };
            },
          ],
          [
            "fetch",
            () => {
              const o = fetch(s.world, who);
              return { world: o.world, log: log(`git fetch · ${o.msg}`) };
            },
          ],
          [
            "pull",
            () => {
              const o = pull(s.world, who, s.mode);
              return { world: o.world, log: log(`git pull · ${o.msg}`) };
            },
          ],
        ].map(([label, fn]) => (
          <button
            key={label as string}
            type="button"
            aria-label={`${label} on ${name}`}
            onClick={() => set((fn as () => Partial<RemoteState>)())}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px]",
              label === "commit"
                ? "bg-accent text-accent-fg border-transparent"
                : "border-line-strong",
            )}
          >
            git {label as string}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SyncCopies() {
  const [s, set] = useSceneState<RemoteState>();
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Keep three copies in sync"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-accent/50 bg-accent-soft rounded-xl border p-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <Server className="text-accent size-3.5" /> origin (the shared server)
            </p>
            <CommitGraph repo={s.world.server} />
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            <Copy who="kavya" s={s} set={set} />
            <Copy who="tom" s={s} set={set} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-[10px] uppercase">
              When pull finds diverged history:
            </span>
            <Segmented
              value={s.mode}
              onChange={(v) => set({ mode: v })}
              options={[
                ["unset", "not set"],
                ["merge", "merge"],
                ["rebase", "rebase"],
              ]}
              size="sm"
            />
            <button
              type="button"
              onClick={() => set({ world: start(), log: [] })}
              className="text-muted text-xs underline"
            >
              reset
            </button>
          </div>
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[10px]">
            {s.log.length ? (
              s.log.map((l, i) => (
                <p
                  key={i}
                  className={cn(l.includes("rejected") || l.includes("fatal") ? "text-bad" : "")}
                >
                  {l}
                </p>
              ))
            ) : (
              <p className="text-subtle">
                Try: Kavya commits and pushes, then Tom commits and pushes.
              </p>
            )}
          </div>
        </div>
      }
    >
      <p>
        Commit on both laptops, then push. The second push is rejected: the server has a commit that
        laptop doesn&apos;t. Fetch, see <code>origin/main</code> move, then pull to combine and push
        again.
      </p>
      <p>
        With nothing configured, modern Git&apos;s pull refuses to guess when histories have
        diverged. Pick merge or rebase and try again.
      </p>
    </StepLayout>
  );
}

/* 3 ─ origin/main ----------------------------------------------------------------------------------- */

export function TrackingBranch() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="origin/main is a note, not a live view"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["main", "Your branch. Moves when you commit, merge or pull."],
            [
              "origin/main",
              "A remote-tracking branch: where the server's main was the last time you fetched. You never commit to it.",
            ],
            [
              "git status",
              "Compares the two: \"Your branch is ahead of 'origin/main' by 2 commits\" means you have 2 commits to push.",
            ],
            [
              "Stale until you fetch",
              "If you haven't fetched, origin/main can be hours out of date. Git doesn't check the server in the background.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[7rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <code className="text-accent font-mono">{t}</code>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Your copy remembers the server&apos;s branches as{" "}
        <Term id="remote-tracking-branch">remote-tracking branches</Term> like{" "}
        <code>origin/main</code>. They update only when you talk to the server.
      </p>
      <p>
        That&apos;s why fetch is always safe: it only updates these notes and downloads commits.
        Your own branches and files don&apos;t change until you merge, rebase or pull.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Pull settings --------------------------------------------------------------------------------- */

export function PullSettings() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Telling pull what to do"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "git config --global pull.rebase false",
              "Pull merges: diverged history gets a merge commit.",
            ],
            [
              "git config --global pull.rebase true",
              "Pull rebases your local commits on top: a straight line.",
            ],
            [
              "git config --global pull.ff only",
              "Pull only fast-forwards and refuses otherwise, so you decide each time.",
            ],
            [
              "git push -u origin feature",
              "Pushes a new branch and remembers origin/feature as its upstream, so plain git push and git pull work.",
            ],
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
        Git 2.27 started warning when pull had no setting, and since Git 2.33.1 it refuses to
        combine diverged branches until you choose. Pick one setting for yourself, or follow your
        team&apos;s convention.
      </p>
      <p>
        A clone can have several remotes. Contributors to open-source projects often have{" "}
        <code>origin</code> (their fork) and <code>upstream</code> (the original).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function RemoteCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fetch, pull or push?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-remotes"
            prompt="Which command does each job?"
            categories={[
              { id: "fetch", label: "fetch" },
              { id: "pull", label: "pull" },
              { id: "push", label: "push" },
            ]}
            items={[
              {
                id: "see",
                label: "See what teammates pushed without touching your branch",
                category: "fetch",
                why: "Only downloads and updates origin/main.",
              },
              {
                id: "update",
                label: "Bring teammates' commits into your main and keep working",
                category: "pull",
                why: "Fetch, then merge or rebase.",
              },
              {
                id: "share",
                label: "Share your three new commits with the team",
                category: "push",
                why: "Sends commits to the server.",
              },
              {
                id: "rejected",
                label: "Your push was rejected; get the server's new commits first",
                category: "pull",
                why: "Combine, then push again.",
              },
              {
                id: "review",
                label: "Check origin/main before deciding whether to merge",
                category: "fetch",
                why: "Safe look before acting.",
              },
            ]}
            explanation="Fetch downloads and updates remote-tracking branches, pull fetches and combines, push uploads your commits."
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
        ["Every clone is complete", "The server is just an agreed meeting point."],
        ["Fetch is safe", "It updates origin/main, not your work."],
        ["Pull = fetch + merge or rebase", "Choose which with pull.rebase."],
        ["Push can be rejected", "Pull first when the server has new commits."],
        ["Ahead and behind", "git status compares main with origin/main."],
      ]}
    >
      <p>Next: pull requests, where hosting platforms add review on top of Git.</p>
    </WrapStep>
  );
}
