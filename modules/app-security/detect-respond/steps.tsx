"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DUTIES, PHASES, STREAM, type Phase } from "./model";
import type { DetectState } from "./state";

/* 1 ─ The smoke alarm nobody wired up ------------------------------------------------------------- */

export function SmokeAlarm() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The smoke alarm nobody wired up"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-4 text-4xl">
            <span>🚨</span>
            <span className="text-muted text-xl">→</span>
            <span className="opacity-30">😴</span>
          </div>
          <p className="text-muted max-w-xs text-center text-xs">
            A sensor that no one hears is just a light blinking in an empty room.
          </p>
        </div>
      }
    >
      <p>
        A smoke detector that beeps in an empty building saves no one. What matters isn&apos;t just
        sensing smoke; it&apos;s that someone is told, knows what to do, and does it quickly.
      </p>
      <p>
        No defence is perfect, so assume something will get through. This module is about noticing:
        logging the right events, <Term id="alerting">alerting</Term> on the dangerous ones, and
        having a plan for the first hours of an incident. OWASP&apos;s 2025 Top 10 renamed this
        category to “Security Logging & Alerting Failures”, to stress the alerting half.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Read the logs during an attack ⭐ ----------------------------------------------------------- */

export function LogTriage() {
  const [s, set] = useSceneState<DetectState>();
  const alerts = s.alerts ?? [];
  const toggle = (id: string) =>
    set({ alerts: alerts.includes(id) ? alerts.filter((x) => x !== id) : [...alerts, id] });
  const shouldAlert = STREAM.filter((l) => l.kind === "suspicious").map((l) => l.id);
  const missed = shouldAlert.filter((id) => !alerts.includes(id)).length;
  const wrongSecret = alerts.filter(
    (id) => STREAM.find((l) => l.id === id)?.kind === "secret",
  ).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Read the logs during an attack"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-[11px]">Tap the lines that should raise an alert:</p>
          <div className="flex flex-col gap-1 font-mono text-[11px]">
            {STREAM.map((l) => {
              const picked = alerts.includes(l.id);
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={picked}
                  onClick={() => toggle(l.id)}
                  className={cn(
                    "rounded border px-2 py-1 text-left",
                    picked
                      ? l.kind === "suspicious"
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10"
                      : l.kind === "secret"
                        ? "border-bad/40 bg-bad/5"
                        : "border-line bg-surface",
                  )}
                >
                  <span className={l.kind === "secret" ? "text-bad" : ""}>{l.text}</span>
                  {picked && (
                    <span className="text-muted mt-0.5 block whitespace-normal">{l.note}</span>
                  )}
                  {!picked && l.kind === "secret" && (
                    <span className="text-bad mt-0.5 block whitespace-normal">{l.note}</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="text-xs">
            {missed === 0 && wrongSecret === 0 ? (
              <p className="text-good font-semibold">
                You alerted on all three suspicious events and flagged the two lines that should
                never have been logged.
              </p>
            ) : (
              <p className="text-muted">
                {missed > 0 &&
                  `${missed} suspicious event${missed > 1 ? "s" : ""} not yet alerted. `}
                {wrongSecret > 0 &&
                  `${wrongSecret} of your picks is a secret that shouldn't be in the log at all.`}
              </p>
            )}
          </div>
          <p className="text-subtle text-[10px]">A made-up log stream.</p>
        </div>
      }
    >
      <p>
        These lines scroll past during a real attack. Three of them, a burst of failed logins, an
        access-control failure, a huge download spike, are the signals worth waking someone for.
        Collecting logs isn&apos;t enough; the alert is the point.
      </p>
      <p>
        Two lines are red for a different reason: a password and a full session token were written
        to the log. Never log those, or card numbers or keys. And attackers can forge log lines by
        sneaking in newlines (log injection), so encode what you log or use structured logs.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Before, during, after ----------------------------------------------------------------------- */

export function ResponseLoop() {
  const [s, set] = useSceneState<DetectState>();
  const phase = PHASES.find((p) => p.id === s.phase) ?? PHASES[0];
  const band = (w: string) =>
    w === "before" ? "text-viz-data" : w === "during" ? "text-accent" : "text-good";
  return (
    <StepLayout
      eyebrow="Explore"
      title="Before, during, after"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-3 gap-1.5">
            {PHASES.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={s.phase === p.id}
                onClick={() => set({ phase: p.id as Phase })}
                className={cn(
                  "rounded-lg border px-2 py-2 text-center text-xs",
                  s.phase === p.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className={cn("block text-[9px] uppercase", band(p.when))}>{p.when}</span>
                {p.name}
              </button>
            ))}
          </div>
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-4 py-3 text-xs"
          >
            <p className="text-sm font-semibold">{phase.name}</p>
            <p className="text-muted">{phase.detail}</p>
          </motion.div>
          <p className="text-muted text-xs">
            In Mandiant&apos;s 2026 report, attackers went unnoticed for a median of 14 days, and
            organisations found just over half of intrusions themselves; the rest were reported by
            outsiders or announced by the attacker.
          </p>
        </div>
      }
    >
      <p>
        An incident plan is a thing you prepare, not invent at 2 a.m. NIST&apos;s 2025 guidance
        frames response around six continuous functions: three you do before (govern, identify,
        protect), and three around the event (detect, respond, recover). Click through them.
      </p>
      <p>
        The response steps matter under pressure: contain the damage, cut off the attacker&apos;s
        access, keep the evidence, and tell the people who must know. Then recover, and turn what
        happened into new alerts and fixes.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who you have to tell ------------------------------------------------------------------------ */

export function Duties() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who you have to tell"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DUTIES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            A summary, not legal advice; rules and dates change.
          </p>
        </div>
      }
    >
      <p>
        After a breach, the clock starts, and the rules are strict. In India, CERT-In wants certain
        incidents reported within six hours, and the DPDP Rules add notice to the regulator and
        affected people. In the EU, GDPR sets 72 hours. Know which apply to you before you need
        them.
      </p>
      <p>
        Make it easy for others to warn you, too. A <Term id="security-txt">security.txt</Term> file
        gives researchers a contact, and a coordinated disclosure process turns an outside finding
        into a quiet fix instead of a public surprise.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Log, alert, or never? ----------------------------------------------------------------------- */

export function WorthAlerting() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Log, alert, or never?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="log-alert"
            prompt="For each event, what should you do?"
            categories={[
              { id: "log", label: "Log it" },
              { id: "alert", label: "Log and alert" },
              { id: "never", label: "Never log" },
            ]}
            items={[
              {
                id: "ok",
                label: "A successful login",
                category: "log",
                why: "Useful record; not alarming.",
              },
              {
                id: "burst",
                label: "50 failed logins in a minute",
                category: "alert",
                why: "Possible attack.",
              },
              {
                id: "pw",
                label: "The password someone typed",
                category: "never",
                why: "Secrets never go in logs.",
              },
              {
                id: "403",
                label: "A normal user hitting an admin-only URL",
                category: "alert",
                why: "Someone's probing access control.",
              },
              {
                id: "token",
                label: "A full session token",
                category: "never",
                why: "Mask or hash it.",
              },
              {
                id: "view",
                label: "A user viewing their own record",
                category: "log",
                why: "Routine access.",
              },
            ]}
            explanation="Log security events with context, alert on the dangerous ones, and keep passwords, tokens, keys and card numbers out of logs entirely."
          />
        </div>
      }
    >
      <p>Sort the events.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Sensing isn't enough", "Alert, and act."],
  ["Log the right events", "Logins, access failures, admin actions, with context."],
  ["Keep secrets out of logs", "No passwords, tokens, keys, card numbers."],
  ["Have a plan, before", "Govern, identify, protect; detect, respond, recover."],
  ["Know the clock", "CERT-In 6 hours, GDPR 72; invite reports."],
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
      <p>Next: the capstone, where you secure a small payments app end to end.</p>
    </StepLayout>
  );
}
