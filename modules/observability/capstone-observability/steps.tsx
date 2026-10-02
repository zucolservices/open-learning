"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, CreditCard, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, INCIDENTS, outcome, type Level, type Verdict } from "./model";
import type { CapState } from "./state";

/* 1 ─ The brief ---------------------------------------------------------------------------------- */

const NEEDS: [string, string][] = [
  ["Know first", "Hear about problems from your telemetry, not from customers on social media."],
  ["Know where", "Which bank, which app, which service, within minutes."],
  ["Sleep at night", "Page people only for real, urgent problems."],
  ["Report on time", "Unusual incidents go to RBI within 6 hours of detection."],
  ["Stay affordable", "Telemetry that costs less than the outages it prevents."],
];

export function Brief() {
  return (
    <StepLayout
      eyebrow="The brief"
      title="Observing a payments platform"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-accent/40 bg-accent-soft flex items-center gap-3 rounded-xl border px-4 py-3">
            <CreditCard className="text-accent size-6 shrink-0" />
            <p className="text-sm">
              An illustrative Indian payments company runs a UPI platform: forty services between
              customers&apos; apps, NPCI and dozens of banks. NPCI publishes the 50 largest
              banks&apos; monthly approval and decline rates, so everyone can see who&apos;s
              failing.
            </p>
          </div>
          {NEEDS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[7.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You own observability for the platform. Each decision in the next step draws on a module in
        this track, from <Term id="opentelemetry">OpenTelemetry</Term> and labels to SLOs and
        incident roles.
      </p>
      <p>
        One useful fact first. NPCI splits declines into{" "}
        <Term id="business-decline">business declines</Term> (the customer&apos;s doing, like a
        wrong PIN) and <Term id="technical-decline">technical declines</Term> (systems or networks
        failing at a bank or NPCI). In August 2025, State Bank of India&apos;s payments as the
        sender were 93.66% approved, 5.92% business declines and 0.42% technical declines.
      </p>
      <p>
        Then nine things that really happen. There are no marks, and you can change your mind as
        often as you like.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make the choices ⭐ ------------------------------------------------------------------------- */

const VERDICT_CLS: Record<Verdict, string> = {
  good: "text-good",
  warn: "text-accent",
  bad: "text-bad",
};

export function Choose() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const made = DECISIONS.filter((d) => choices[d.id]).length;
  return (
    <StepLayout
      eyebrow="Design"
      title="Make the choices"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DECISIONS.map((d) => {
            const o = d.options.find((x) => x.id === choices[d.id]);
            return (
              <div key={d.id} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="text-xs font-semibold">
                  {d.area} <span className="text-muted font-normal">· module {d.module}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set({ choices: { ...choices, [d.id]: opt.id } })}
                      className={cn(
                        "rounded-lg border px-2 py-1 text-left text-[11px]",
                        choices[d.id] === opt.id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {o && <p className={cn("mt-1 text-[10px]", VERDICT_CLS[o.verdict])}>{o.note}</p>}
              </div>
            );
          })}
          <p className="text-muted text-xs">
            {made < DECISIONS.length
              ? `${DECISIONS.length - made} decisions still open.`
              : "Every decision made. Continue to the bad month."}
          </p>
        </div>
      }
    >
      <p>
        Nine decisions, from how services are instrumented to who&apos;s in charge when it breaks.
        Choose what you would actually build. Some options are traps teams really fall into.
      </p>
      <p>A note under each choice says what it buys you. The real test comes next.</p>
    </StepLayout>
  );
}

/* 3 ─ The bad month ⭐ ------------------------------------------------------------------------------- */

const LEVEL: Record<Level, { cls: string; icon: typeof Check; label: string }> = {
  holds: { cls: "border-good/50 bg-good/10", icon: Check, label: "Holds" },
  degrades: { cls: "border-accent/50 bg-accent-soft", icon: AlertTriangle, label: "Degrades" },
  breaks: { cls: "border-bad/60 bg-bad/10", icon: X, label: "Breaks" },
};

export function BadNight() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const inc = INCIDENTS.find((x) => x.id === s.incident) ?? INCIDENTS[0];
  const o = outcome(inc.id, choices);
  const all = INCIDENTS.map((x) => ({ x, o: outcome(x.id, choices) }));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The bad month"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {all.map(({ x, o: r }) => {
              const Icon = r ? LEVEL[r.level].icon : null;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ incident: x.id })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                    s.incident === x.id
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {Icon && r && (
                    <Icon
                      className={cn(
                        "size-3",
                        r.level === "holds"
                          ? "text-good"
                          : r.level === "breaks"
                            ? "text-bad"
                            : "text-accent",
                      )}
                    />
                  )}
                  {x.name}
                </button>
              );
            })}
          </div>
          <p className="text-sm">{inc.text}</p>
          <motion.div
            key={`${inc.id}-${JSON.stringify(choices)}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              o ? LEVEL[o.level].cls : "border-line bg-surface",
            )}
          >
            {o ? (
              <>
                <p className="font-semibold">
                  {LEVEL[o.level].label}{" "}
                  <span className="text-muted text-xs font-normal">· see module {o.module}</span>
                </p>
                <p className="text-sm">{o.text}</p>
              </>
            ) : (
              <p className="text-muted text-sm">
                The decision this depends on isn&apos;t made yet. Go back a step to choose.
              </p>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Nine things that happen to payment platforms. Pick one to see what your design would catch;
        the icons show every result at a glance.
      </p>
      <p>
        Go back, change a choice, and come here again. Several depend on two decisions together.
        Some echo real outages: Roblox, Slack and Facebook all lost the tools they needed to
        investigate in the middle of an incident.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What to fix first -------------------------------------------------------------------------- */

export function FixFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What to fix first"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="obs-fix-first"
            prompt="A colleague's payments platform has these observability findings. Which must be fixed before launch?"
            categories={[
              { id: "now", label: "Before launch" },
              { id: "later", label: "Improve later" },
            ]}
            items={[
              {
                id: "pii",
                label: "Full request bodies, with customers' UPI IDs, are logged",
                category: "now",
                why: "Personal data spreading through every log tool. Mask it at the source.",
              },
              {
                id: "cpu",
                label: "The only pages are for high CPU",
                category: "now",
                why: "Nobody is told when payments fail. Page on SLO burn.",
              },
              {
                id: "same",
                label: "Alerting runs on the cluster it monitors, with no outside probe",
                category: "now",
                why: "When the platform goes down, so does the alarm.",
              },
              {
                id: "dash",
                label: "Dashboards are hand-made and slightly different per service",
                category: "later",
                why: "Untidy; move them to code when you can.",
              },
              {
                id: "profiling",
                label: "No continuous profiling yet",
                category: "later",
                why: "Useful for efficiency work, not a launch blocker.",
              },
              {
                id: "bill",
                label: "Nobody reviews the telemetry bill monthly",
                category: "later",
                why: "Start soon, before it surprises finance.",
              },
            ]}
            explanation="Anything that leaves you blind to customer pain, or leaks customers' data, blocks launch; tidiness, efficiency and cost reviews go on the improvement list."
          />
        </div>
      }
    >
      <p>Reviewing someone else&apos;s design is half the job.</p>
    </StepLayout>
  );
}

/* 5 ─ The whole track ---------------------------------------------------------------------------- */

const CHAPTERS: [string, string][] = [
  ["The big picture", "Why observability, the signals, OpenTelemetry."],
  ["Metrics", "Metric types, percentiles, cardinality, the golden signals."],
  ["Logs and traces", "Structured logs, pipelines, tracing, sampling, profiling."],
  ["Reliability targets", "SLIs and SLOs, error budgets, alerting, dashboards."],
  ["Operating", "Investigation, incident response, postmortems, cost, and this capstone."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="The whole track"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CHAPTERS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
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
        That&apos;s observability: twenty-one modules from a 3 a.m. page with only a CPU graph to a
        payments platform that tells you what&apos;s wrong, where, and for whom.
      </p>
      <p>
        The habits carry over to any stack: instrument once with open standards, measure what users
        feel, keep labels bounded and logs structured, page only on real pain, keep a way to see
        when everything else is down, and learn from every incident without blame.
      </p>
    </StepLayout>
  );
}
