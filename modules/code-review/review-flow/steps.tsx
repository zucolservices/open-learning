"use client";

import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { STAGES } from "./model";
import type { FlowState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Ticket() {
  return (
    <StepLayout
      eyebrow="Story"
      title="An order ticket's journey"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
            {["ordered", "on the rail", "cooking", "plated", "checked at the pass", "served"].map(
              (s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={cn(
                    "rounded-full border px-3 py-1",
                    i === 1 ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
                  )}
                >
                  {s}
                </motion.span>
              ),
            )}
          </div>
        </div>
      }
    >
      <p>
        A café&apos;s order ticket goes through the same stations every time. Most of the delay
        isn&apos;t cooking; it&apos;s the ticket sitting on the rail waiting for a free cook.
      </p>
      <p>
        A pull request travels through stages too: draft, automated checks, review, revisions,{" "}
        <Term id="approval">approval</Term>, merge. Knowing the stages shows where time really goes.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------ */

export function Journey() {
  const [s, set] = useSceneState<FlowState>();
  const st = STAGES[s.stage];
  const done = STAGES.slice(0, s.stage + 1);
  const total = done.reduce((t, x) => t + x.hours, 0);
  const waiting = done.filter((x) => x.waiting).reduce((t, x) => t + x.hours, 0);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Follow a pull request from draft to merged"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous stage"
              disabled={s.stage === 0}
              onClick={() => set({ stage: s.stage - 1 })}
              className="border-line-strong rounded-full border p-1 disabled:opacity-30"
            >
              <ArrowLeft className="size-3.5" />
            </button>
            <button
              type="button"
              disabled={s.stage === STAGES.length - 1}
              onClick={() => set({ stage: s.stage + 1 })}
              className="bg-accent text-accent-fg flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium disabled:opacity-30"
            >
              Next stage <ArrowRight className="size-3" />
            </button>
            <span className="text-muted text-xs">
              {s.stage + 1} of {STAGES.length}
            </span>
          </div>
          <div className="flex gap-0.5">
            {STAGES.map((x, i) => (
              <motion.div
                key={x.id}
                animate={{ opacity: i <= s.stage ? 1 : 0.25 }}
                title={x.label}
                className={cn("h-3 rounded-sm", x.waiting ? "bg-bad/50" : "bg-good/60")}
                style={{ flex: Math.max(0.6, Math.sqrt(x.hours)) }}
              />
            ))}
          </div>
          <motion.div
            key={st.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              st.waiting ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
            )}
          >
            <p className="font-semibold">
              {st.label}{" "}
              <span className="text-muted font-normal">
                · {st.who} · {st.hours} h
              </span>
            </p>
            <p className="text-muted">{st.note}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Elapsed so far</p>
              <p className="font-mono text-base">{Math.round(total * 10) / 10} h</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Of which, waiting</p>
              <p
                className={cn(
                  "font-mono text-base",
                  waiting / Math.max(total, 1) > 0.5 && "text-bad",
                )}
              >
                {Math.round((waiting / Math.max(total, 0.1)) * 100)}%
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Hours are illustrative. Red bars are waiting; green bars are someone working.
          </p>
        </div>
      }
    >
      <p>
        Step through one pull request&apos;s life. Each stage shows who has the ball and how long it
        takes.
      </p>
      <p>
        By the end, about four-fifths of the elapsed time is waiting: for checks, and above all for
        a reviewer. The actual reviewing took half an hour.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Platforms ----------------------------------------------------------------------------------- */

const PLATFORMS: Record<
  FlowState["platform"],
  { label: string; name: string; approve: string; extras: string }
> = {
  github: {
    label: "GitHub",
    name: "Pull request",
    approve:
      "Reviews are Comment, Approve or Request changes. “Request changes” only blocks merging when branch rules require reviews.",
    extras:
      "Draft PRs, required status checks, code owners, merge queue, and built-in stacked pull requests (2026).",
  },
  gitlab: {
    label: "GitLab",
    name: "Merge request",
    approve:
      "Approval rules; on the Free tier approvals are optional and don't block merging, while paid tiers can require them.",
    extras: "Draft MRs, pipelines, code owners and merge trains (paid tiers).",
  },
  gerrit: {
    label: "Gerrit",
    name: "Change (patch sets)",
    approve:
      "Votes from −2 to +2 on Code-Review: +2 approves, −2 blocks, ±1 are advice. Often a separate Verified vote from CI.",
    extras:
      "Used by Android and many large open-source projects; every revision is a new patch set.",
  },
  azure: {
    label: "Azure DevOps",
    name: "Pull request",
    approve:
      "Votes: approve, approve with suggestions, wait for author, reject. Branch policies set minimum reviewers.",
    extras: "Draft PRs, build validation policies, auto-complete.",
  },
};

export function Platforms() {
  const [s, set] = useSceneState<FlowState>();
  const p = PLATFORMS[s.platform];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Same flow, different words"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.platform}
            onChange={(v) => set({ platform: v })}
            options={(Object.keys(PLATFORMS) as FlowState["platform"][]).map((k) => [
              k,
              PLATFORMS[k].label,
            ])}
          />
          <motion.div
            key={s.platform}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-2 text-xs"
          >
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Called</p>
              <p className="font-semibold">{p.name}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Approving</p>
              <p>{p.approve}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Also</p>
              <p>{p.extras}</p>
            </div>
          </motion.div>
        </div>
      }
    >
      <p>
        Every platform implements the same idea with different names and rules. Bitbucket follows
        GitHub&apos;s model closely. Learn the flow once, then map the vocabulary.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where it stalls ------------------------------------------------------------------------------ */

export function Stalls() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where reviews stall"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Nobody's turn",
              "Reviewers think the author is fixing; the author thinks they're waiting. Re-request review explicitly.",
            ],
            ["No owner", "Nobody was assigned, so everyone assumes someone else will look."],
            [
              "Flaky checks",
              "A red build that isn't the change's fault blocks everything until someone re-runs it.",
            ],
            ["Ping-pong", "Ten rounds of small comments. A five-minute call often settles it."],
            ["Too big", "A 2,000-line change sits untouched because nobody has an afternoon free."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Most of a pull request&apos;s life is spent waiting, and each stall has a fix. Later modules
        cover the biggest ones: small changes, turnaround time and choosing reviewers.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function FlowCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the flow in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="review-flow"
            prompt="Drag the stages of a typical pull request into order."
            items={[
              { id: "open", label: "Open it (perhaps as a draft)" },
              { id: "checks", label: "Automated checks run" },
              { id: "review", label: "A reviewer leaves comments" },
              { id: "revise", label: "The author revises and replies" },
              { id: "approve", label: "Required approvals are given" },
              { id: "merge", label: "Merged, often through a merge queue" },
            ]}
            explanation="Open, check, review, revise, approve, merge. Most of the elapsed time is usually waiting between these steps."
          />
        </div>
      }
    >
      <p>Drag the stages into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Draft, check, review, revise, approve, merge", "The flow everywhere."],
        ["Waiting dominates", "The reviewing itself is short."],
        ["Machines first", "Checks run before a person looks."],
        ["Different words, same idea", "PRs, MRs, changes and votes."],
        ["Know whose turn it is", "Stalls come from ambiguity."],
      ]}
    >
      <p>Next: what a reviewer should actually look for.</p>
    </WrapStep>
  );
}
