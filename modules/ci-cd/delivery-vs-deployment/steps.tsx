"use client";

import { motion } from "motion/react";
import { Bot, Hand, Users } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { APPROVALS, fmtHours, month, type Approval, type Checks } from "./model";
import type { DeliveryState } from "./state";

/* 1 ─ Where does the human go? ⭐ ----------------------------------------------------------------- */

const STAGES = ["Commit", "Build & test", "Review", "Staging", "Production"];

/** Which stage carries the human decision, per approval style. */
function stageKind(a: Approval, i: number): "auto" | "person" | "board" | "none" {
  if (i === 2) return a === "board" ? "none" : "person";
  if (i === 4) return a === "board" ? "board" : a === "delivery" ? "person" : "auto";
  return "auto";
}

export function WhereHuman() {
  const [s, set] = useSceneState<DeliveryState>();
  const a = APPROVALS[s.approval];
  const m = month(s.approval, s.checks);
  const broken = m.failed * m.recoverHours;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Where does the human go?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Segmented<Approval>
              size="sm"
              value={s.approval}
              onChange={(approval) => set({ approval })}
              options={[
                ["board", "Change board"],
                ["delivery", "Delivery"],
                ["deployment", "Deployment"],
              ]}
            />
            <Segmented<Checks>
              size="sm"
              value={s.checks}
              onChange={(checks) => set({ checks })}
              options={[
                ["basic", "Basic checks"],
                ["thorough", "Canary + auto-rollback"],
              ]}
            />
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {STAGES.map((st, i) => {
              const k = stageKind(s.approval, i);
              const Icon = k === "auto" || k === "none" ? Bot : k === "person" ? Hand : Users;
              return (
                <motion.div
                  key={st}
                  layout
                  className={cn(
                    "flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-center",
                    k === "none"
                      ? "border-line bg-surface border-dashed opacity-60"
                      : k === "auto"
                        ? "border-accent/50 bg-accent-soft"
                        : k === "person"
                          ? "border-viz-compute bg-viz-compute/10"
                          : "border-bad/60 bg-bad/10",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      k === "auto"
                        ? "text-accent"
                        : k === "person"
                          ? "text-viz-compute"
                          : "text-bad",
                    )}
                  />
                  <span className="text-[10px] leading-tight font-medium sm:text-xs">{st}</span>
                  <span className="text-muted text-[9px]">
                    {k === "none"
                      ? "no peer review"
                      : k === "auto"
                        ? "automatic"
                        : k === "person"
                          ? "a teammate"
                          : "weekly meeting"}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <p className="text-muted text-xs">{a.who}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["Lead time", a.lead, a.leadHours > 24],
              ["Releases this month", `${m.deploys}`, false],
              ["Releases that fail", `${(m.failRate * 100).toFixed(1)}%`, m.failRate > 0.1],
              ["Hours broken this month", fmtHours(broken), broken > 10],
            ].map(([l, v, bad]) => (
              <div
                key={l as string}
                className="border-line bg-surface rounded-lg border px-2 py-1.5"
              >
                <p className="text-muted text-[10px]">{l}</p>
                <p className={cn("font-mono text-sm font-semibold", bad && "text-bad")}>{v}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Illustrative: 100 changes a month; each has a small chance of a fault the tests miss,
            lower with peer review and lower again with canary releases and automatic rollback. A
            weekly release bundles 25 changes.
          </p>
        </div>
      }
    >
      <p>
        Humble and Farley call the <Term id="deployment-pipeline">deployment pipeline</Term>{" "}
        &ldquo;an automated manifestation of your process for getting software from version control
        into the hands of your users.&rdquo; The question is where a person still decides.
      </p>
      <p>
        Try each style. A weekly <Term id="change-board">change board</Term> feels safest, but it
        bundles a week of work into one release, and DORA found &ldquo;no evidence&rdquo; that such
        external review lowers change failure rates. Peer review of each small change does help, and
        so do automatic checks while a release goes out.
      </p>
      <p>
        <Term id="lead-time">Lead time</Term>, as DORA defines it, is &ldquo;the amount of time it
        takes for a change to go from committed to version control to deployed in production&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Regulated, and still continuous ------------------------------------------------------------- */

const EVIDENCE: { who: string; when: string; text: string }[] = [
  {
    who: "UK Financial Conduct Authority",
    when: "Feb 2021",
    text: 'Reviewing over a million production changes from 2019, it found "firms that deployed smaller, more frequent releases had higher change success rates", and that change boards "approved over 90% of the major changes they reviewed".',
  },
  {
    who: "Monzo, a UK-regulated bank",
    when: "May 2022",
    text: 'Wrote that it deploys to production "over 100 times a day".',
  },
  {
    who: "Reserve Bank of India",
    when: "Nov 2023",
    text: 'Its IT governance direction asks that changes are "applied/ implemented and reviewed in a secure and timely manner with necessary approvals". It doesn\'t prescribe a weekly meeting.',
  },
  {
    who: "ITIL 4",
    when: "2019–2020",
    text: 'Defines standard changes as "low-risk, pre-authorized changes" that need no extra approval, and lets organisations choose their change authority, which can be peer review or an automated pipeline.',
  },
];

export function Regulated() {
  return (
    <StepLayout
      eyebrow="Evidence"
      title="Regulated, and still continuous"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {EVIDENCE.map((e, i) => (
            <motion.div
              key={e.who}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-2.5"
            >
              <p className="flex items-baseline justify-between gap-2 text-sm font-semibold">
                {e.who}
                <span className="text-muted font-mono text-[10px] font-normal">{e.when}</span>
              </p>
              <p className="text-muted mt-0.5 text-xs">{e.text}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;We&apos;re regulated, so we can&apos;t&rdquo; is common and mostly untrue. Regulators
        ask for controlled, approved, recorded and recoverable changes. A pipeline with required
        reviews and an audit trail provides exactly that, on every change.
      </p>
      <p>
        Some things really can&apos;t be deployed continuously. Mobile apps go through store review
        (Apple says 90% of submissions are reviewed in under 24 hours), so teams practise continuous
        delivery up to the store and use staged rollouts and feature flags after it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The auditor's question ---------------------------------------------------------------------- */

export function AuditorQuestion() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The auditor's question"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="auditor-question"
            prompt="A payments team wants continuous delivery. Its auditors want proof that every production change was approved by someone other than its author. What fits best?"
            options={[
              {
                id: "board",
                label: "A weekly change board that signs off a list of changes",
                feedback:
                  "It produces signatures, but bundles changes into risky batches, and the FCA found boards rarely reject anything.",
              },
              {
                id: "pipeline",
                label:
                  "Required peer review on every pull request, protected branches, and pipeline logs of who approved and deployed what",
                correct: true,
                feedback:
                  "Every change has a recorded approver who isn't the author, plus test results and deployment history: stronger evidence, gathered automatically.",
              },
              {
                id: "email",
                label: "The author emails a manager before each deploy",
                feedback: "Approval by email is slow, easy to skip and hard to audit later.",
              },
              {
                id: "none",
                label: "No approvals: the tests are good enough",
                feedback:
                  "It fails the auditors' requirement outright, and tests can't judge intent.",
              },
            ]}
            explanation="DORA recommends exactly this: lightweight peer review plus automation, which also satisfies separation of duties."
          />
        </div>
      }
    >
      <p>Approvals don&apos;t have to be slow to be real.</p>
    </StepLayout>
  );
}

/* 4 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["One road to production", "Every change goes through the same deployment pipeline."],
  ["Delivery: always releasable", "People decide when; any passing build could go."],
  ["Deployment: no button", "Every passing change goes out by itself."],
  ["Review small changes", "Peer review beats a distant board, and leaves an audit trail."],
  ["Regulated is possible", "FCA, RBI and ITIL ask for control, not for meetings."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        At scale this looks unremarkable. Meta moved its website from three pushes a day to what it
        calls quasi-continuous release, &ldquo;tens to hundreds of diffs every few hours&rdquo;,
        completed in April 2017.
      </p>
      <p>
        Releasing often only works if each release can be made safe. Next: the ways to swap one
        version for another without hurting many users.
      </p>
    </StepLayout>
  );
}
