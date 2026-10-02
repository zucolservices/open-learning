"use client";

import { motion } from "motion/react";
import { DoorClosed, Siren } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { OUTCOMES, SITUATIONS, type Action, type Situation } from "./model";
import type { RollbackState } from "./state";

/* 1 ─ 6 p.m. ⭐ ------------------------------------------------------------------------------------ */

const ACTIONS: { id: Action; label: string }[] = [
  { id: "flag", label: "Flip the flag off" },
  { id: "rollback", label: "Roll back to v41" },
  { id: "forward", label: "Roll forward with a fix" },
];

export function SixPm() {
  const [s, set] = useSceneState<RollbackState>();
  const sit = SITUATIONS[s.situation];
  const out = s.action ? OUTCOMES[s.situation][s.action as Action] : undefined;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="6 p.m., and checkout is failing"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(SITUATIONS) as Situation[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ situation: k, action: "" })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.situation === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {SITUATIONS[k].name}
              </button>
            ))}
          </div>
          <div className="border-bad/40 bg-bad/5 flex gap-3 rounded-xl border px-4 py-3">
            <Siren className="text-bad mt-0.5 size-5 shrink-0" />
            <p className="text-sm">{sit.text}</p>
          </div>
          <p className="text-muted text-[10px]">What do you do?</p>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => set({ action: a.id })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs font-medium",
                  s.action === a.id
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
          {out && (
            <motion.div
              key={`${s.situation}-${s.action}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3",
                out.verdict === "good"
                  ? "border-good/50 bg-good/10"
                  : out.verdict === "ok"
                    ? "border-viz-compute/60 bg-viz-compute/10"
                    : "border-bad/60 bg-bad/10",
              )}
            >
              <p className="font-mono text-sm font-semibold">
                {out.minutes === null
                  ? "Still failing"
                  : `Customers fail for ${out.minutes} minutes`}
              </p>
              <ul className="text-muted mt-1.5 flex flex-col gap-0.5 font-mono text-[11px]">
                {out.steps.map((st) => (
                  <li key={st}>{st}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm">{out.lesson}</p>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Every release can go wrong; what matters is how quickly users stop suffering. There are
        three ways out: switch the feature off, put the previous version back (a{" "}
        <Term id="rollback">rollback</Term>), or ship a fix through the pipeline (rolling forward).
      </p>
      <p>
        Try each action in each situation. Google&apos;s reliability engineers describe their habit
        plainly: &ldquo;the releasing team rolls back first and investigates the problem
        second&rdquo;, and &ldquo;a request for a rollback is not interpreted as an attack on the
        releasing team&rdquo;.
      </p>
      <p>The third situation is the trap. Some changes can&apos;t be rolled back at all.</p>
    </StepLayout>
  );
}

/* 2 ─ One-way doors -------------------------------------------------------------------------------- */

const DOORS: [string, string][] = [
  [
    "Data written in a new format",
    "Old code can't read it. Ship in two phases: first read both, then write the new one.",
  ],
  [
    "A dropped column or table",
    "The data is gone. Contract only after expand and migrate (module 15).",
  ],
  ["Emails, SMS and push messages", "Sent is sent. Follow up with a correction."],
  ["Money moved", "A payment can't be unsent, only refunded: a compensating action."],
  ["Calls to partners", "Webhooks and API calls to other companies have already happened."],
];

export function OneWayDoors() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="One-way doors"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DOORS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2"
            >
              <DoorClosed className="text-viz-compute mt-0.5 size-4 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A rollback puts old code back. It doesn&apos;t put the world back. AWS&apos;s guidance on
        rollback safety names the commonest trap: a change of protocol, such as code that starts
        compressing data. &ldquo;After the new version writes some compressed data, rolling back
        isn&apos;t an option.&rdquo;
      </p>
      <p>
        AWS&apos;s answer is a two-phase deployment: Prepare (every server learns to read the new
        format but keeps writing the old) and Activate (switch writing over). Either phase can be
        rolled back on its own. For things that can&apos;t be undone, plan the{" "}
        <Term id="compensating-action">compensating action</Term> before you release.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When undoing went wrong, and right ---------------------------------------------------------- */

const CASES: { when: string; who: string; text: string; tone: "bad" | "good" }[] = [
  {
    when: "Aug 2012",
    who: "Knight Capital",
    text: 'Trying to fix the problem, staff uninstalled the new code from the seven servers where it had been deployed correctly. The SEC: "This action worsened the problem." The old servers still had the repurposed flag switched on.',
    tone: "bad",
  },
  {
    when: "Jul 2024",
    who: "CrowdStrike",
    text: "The faulty content update was reverted 78 minutes after it went out, but machines that had already crashed couldn't receive the fix and needed hands-on repair.",
    tone: "bad",
  },
  {
    when: "Jul 2019",
    who: "Cloudflare",
    text: "A new firewall rule pinned CPUs worldwide. Engineers used a global kill switch for that rule system rather than a slower rollback; the outage lasted 27 minutes.",
    tone: "good",
  },
];

export function Cases() {
  return (
    <StepLayout
      eyebrow="Real incidents"
      title="When undoing went wrong, and right"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {CASES.map((c, i) => (
            <motion.div
              key={c.who}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                c.tone === "bad" ? "border-bad/40 bg-bad/5" : "border-good/40 bg-good/5",
              )}
            >
              <p className="text-accent font-mono text-xs">{c.when}</p>
              <p className="mt-0.5 font-semibold">{c.who}</p>
              <p className="text-muted mt-1 text-sm">{c.text}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A rollback is just another deployment, of an older version, and it can fail like any other.
        The teams that recover fastest have practised it.
      </p>
      <p>
        Google&apos;s 2017 advice: &ldquo;If you haven&apos;t rolled back in a few weeks, you should
        do a rollback &lsquo;just because&rsquo;&rdquo;. Better still, let the pipeline do it: Argo
        Rollouts and Flagger abort a canary when its metrics go bad, AWS CodeDeploy and ECS roll
        back on alarms, and Google Cloud Deploy can repair a failed rollout.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which way out? ------------------------------------------------------------------------------ */

export function WhichWayOut() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which way out?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="which-way-out"
            prompt="v42 started writing customer addresses as structured fields that v41 can't parse. Twenty minutes after release, address lookups start failing for some users. What's the right move?"
            options={[
              {
                id: "rollback",
                label: "Roll back to v41 straight away",
                feedback:
                  "v41 can't parse the addresses v42 has already written, so a rollback would break those customers too.",
              },
              {
                id: "forward",
                label: "Roll forward a fix that reads both formats, then investigate",
                correct: true,
                feedback:
                  "With new-format data already written, going forward is the safe direction. Next time: release the reader first, then the writer.",
              },
              {
                id: "restart",
                label: "Restart all the servers",
                feedback: "The servers aren't the problem; the code and the data are.",
              },
              {
                id: "wait",
                label: "Wait for traffic to drop after dinner",
                feedback: "Customers keep failing in the meantime.",
              },
            ]}
            explanation="Roll back first is the right default, unless the release has already written data the old version can't handle. Know which kind of release you're shipping before it goes out."
          />
        </div>
      }
    >
      <p>Check for one-way doors before choosing a direction.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Roll back first", "Restore service, then investigate. No blame for asking."],
  ["Flags are fastest", "If the change is behind one, switch it off."],
  ["Know your one-way doors", "Data formats, dropped columns, sent messages, moved money."],
  ["Practise and automate", "Roll back regularly; let metrics trigger it."],
  ["Measure recovery", "DORA's failed deployment recovery time and rework rate."],
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
        DORA measures this as <Term id="recovery-time">failed deployment recovery time</Term>:
        &ldquo;the time it takes to recover from a deployment that fails and requires immediate
        intervention&rdquo;. Its newest measure, deployment rework rate, counts the unplanned
        deployments that incidents force on you.
      </p>
      <p>
        Next chapter: the pipeline itself is a target. Protecting its secrets and what it builds.
      </p>
    </StepLayout>
  );
}
