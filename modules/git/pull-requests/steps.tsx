"use client";

import { motion } from "motion/react";
import { MessagesSquare, ArrowRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CommitGraph } from "../_shared/graph";
import { JOURNEY, METHOD_INFO, PLATFORMS, after } from "./model";
import type { PrState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Proposal() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“Can we add this to the menu?”"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface w-64 rounded-xl border p-3 text-xs"
          >
            <MessagesSquare className="text-accent size-5" />
            <p className="mt-1 font-semibold">Proposal: add masala chai</p>
            <p className="text-muted">New item, price, photo. Tasted by two staff.</p>
            <p className="mt-2">💬 Chef: price looks low. 👍 Owner: approved.</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A new cook doesn&apos;t just write a dish into the café&apos;s menu. They propose it:
        here&apos;s the recipe, here&apos;s why. The chef tastes it and comments, the cook adjusts,
        and once someone with authority approves, it goes on the menu.
      </p>
      <p>
        A <Term id="pull-request">pull request</Term> is that proposal for code. It asks to merge
        one branch into another, with a place to discuss, review and run checks first. It&apos;s a
        feature of hosting platforms, built on top of Git, rather than part of Git itself.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The journey ⭐ ------------------------------------------------------------------------------- */

export function Journey() {
  const [s, set] = useSceneState<PrState>();
  return (
    <StepLayout
      eyebrow="Step-through"
      title="From branch to merged"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <ol className="grid gap-1.5">
            {JOURNEY.map((j, i) => {
              const on = i <= s.stage;
              return (
                <motion.li
                  key={j.title}
                  animate={{ opacity: on ? 1 : 0.3 }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    i === s.stage ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold">
                      <span className="text-accent mr-1.5 font-mono">{i + 1}</span>
                      {j.title}
                    </span>
                    <span className="text-subtle text-[10px]">{j.who}</span>
                  </div>
                  {on && <p className="mt-0.5">{j.body}</p>}
                </motion.li>
              );
            })}
          </ol>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={s.stage >= JOURNEY.length - 1}
              onClick={() => set({ stage: s.stage + 1 })}
              className="bg-accent text-accent-fg inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              What happens then? <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => set({ stage: 0 })}
              className="border-line text-muted rounded-full border px-4 py-1.5 text-xs"
            >
              Start over
            </button>
          </div>
        </div>
      }
    >
      <p>
        Follow one change, adding masala chai to the menu, from a branch to a merge. Each step is
        someone doing something: you, the platform, a reviewer or a maintainer.
      </p>
      <p>
        Underneath, it&apos;s all ordinary Git: branches, pushes and a merge. The platform adds the
        conversation, the checks and the rules about who can merge.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The three merge buttons ---------------------------------------------------------------------- */

export function MergeButtons() {
  const [s, set] = useSceneState<PrState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways to press 'merge'"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.method}
            onChange={(v) => set({ method: v })}
            options={[
              ["merge", "Create a merge commit"],
              ["squash", "Squash and merge"],
              ["rebase", "Rebase and merge"],
            ]}
            size="sm"
          />
          <CommitGraph
            repo={after(s.method)}
            className="border-line bg-surface rounded-xl border p-2"
          />
          <motion.p
            key={s.method}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
          >
            {METHOD_INFO[s.method]}
          </motion.p>
        </div>
      }
    >
      <p>
        Most platforms let a repository allow or forbid each of these. They&apos;re the same choices
        you met with merge and rebase, applied by the server.
      </p>
      <p>
        Squash suits teams who want one commit per pull request on main. Merge commits keep the full
        story. Rebase gives a straight line but keeps every commit, so the branch&apos;s commits
        should already be tidy.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Platforms ------------------------------------------------------------------------------------- */

export function Platforms() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Same idea, different names"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[32rem] text-left text-[11px]">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  {["Platform", "Called", "Automatic reviewers", "Protection", "Queue"].map((h) => (
                    <th key={h} className="px-2 py-1 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLATFORMS.map((p) => (
                  <tr key={p.name} className="border-line border-t">
                    <td className="px-2 py-1 font-medium">{p.name}</td>
                    <td className="px-2 py-1">{p.term}</td>
                    <td className="px-2 py-1">{p.owners}</td>
                    <td className="px-2 py-1">{p.rules}</td>
                    <td className="px-2 py-1">{p.queue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-subtle text-[10px]">
            As checked in October 2026. GitHub also made stacked pull requests generally available
            in October 2026.
          </p>
        </div>
      }
    >
      <p>
        Every major platform has the same core: propose, review, check, merge. The vocabulary
        differs, and some features need a paid tier.
      </p>
      <p>
        Git itself has a humble ancestor of all this: <code>git request-pull</code> writes a summary
        of a branch to email to a maintainer, which is how the Linux kernel still works.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function PrCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Git, or the platform?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-pull-requests"
            prompt="Is each feature part of Git itself, or added by a hosting platform?"
            categories={[
              { id: "git", label: "Git" },
              { id: "platform", label: "Platform" },
            ]}
            items={[
              { id: "branch", label: "Branches and merges", category: "git", why: "Core Git." },
              {
                id: "pr",
                label: "Pull requests with comments",
                category: "platform",
                why: "Added by GitHub, GitLab and others.",
              },
              {
                id: "approve",
                label: "Required approvals before merging",
                category: "platform",
                why: "Branch protection or rulesets.",
              },
              {
                id: "owners",
                label: "CODEOWNERS automatically requesting reviewers",
                category: "platform",
                why: "A platform feature.",
              },
              {
                id: "request",
                label: "git request-pull",
                category: "git",
                why: "A Git command that writes a summary for email.",
              },
              {
                id: "queue",
                label: "Merge queues",
                category: "platform",
                why: "GitHub merge queue, GitLab merge trains.",
              },
            ]}
            explanation="Git provides history, branches and merges; platforms add the conversation, the checks and the rules on top."
          />
        </div>
      }
    >
      <p>Sort each feature.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["A pull request is a proposal", "Merge this branch, after discussion."],
        ["Built on Git, not part of it", "Platforms add review, checks and rules."],
        ["Fork when you can't push", "Branch when you can."],
        ["Three merge methods", "Merge commit, squash or rebase."],
        ["Protect main", "Required reviews and checks; queues for busy repos."],
      ]}
    >
      <p>Next: how whole teams organise their branches, from GitFlow to trunk-based development.</p>
    </WrapStep>
  );
}
