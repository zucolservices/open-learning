"use client";

import { motion } from "motion/react";
import { Activity, AlertOctagon, Gauge, Timer } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES, DIAGNOSES, type SignalKey } from "./model";
import type { GoldenState } from "./state";

/* 1 ─ Four numbers -------------------------------------------------------------------------------- */

const FOUR: { k: string; icon: typeof Timer; d: string }[] = [
  {
    k: "Latency",
    icon: Timer,
    d: '"The time it takes to service a request." Track failed requests\' latency separately: "a slow error is even worse than a fast error!"',
  },
  {
    k: "Traffic",
    icon: Activity,
    d: '"A measure of how much demand is being placed on your system": requests per second for a web service.',
  },
  {
    k: "Errors",
    icon: AlertOctagon,
    d: 'Requests that fail "explicitly (e.g., HTTP 500s), implicitly (… an HTTP 200 success response, but coupled with the wrong content), or by policy".',
  },
  {
    k: "Saturation",
    icon: Gauge,
    d: 'How "full" your service is, "emphasizing the resources that are most constrained": memory, CPU, connections, disk.',
  },
];

export function FourNumbers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four numbers"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {FOUR.map(({ k, icon: Icon, d }, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent size-5" />
              <p className="font-semibold">{k}</p>
              <p className="text-muted text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A doctor starts with pulse, temperature, blood pressure and breathing before ordering any
        test. Services have vital signs too.
      </p>
      <p>
        Google&apos;s SRE book calls them the <Term id="golden-signals">four golden signals</Term>:
        &ldquo;If you can only measure four metrics of your user-facing system, focus on these
        four.&rdquo; (Quotes on the cards are from the same chapter.)
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three sick services ⭐ ---------------------------------------------------------------------- */

const SIG: SignalKey[] = ["latency", "traffic", "errors", "saturation"];

function Mini({ values, unit, label }: { values: number[]; unit: string; label: string }) {
  const max = Math.max(...values) * 1.1;
  const last = values[values.length - 1];
  return (
    <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
      <p className="text-muted text-[10px]">{label}</p>
      <svg viewBox="0 0 100 30" className="w-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          className="stroke-viz-data"
          strokeWidth={1.8}
          points={values.map((v, i) => `${(i / 19) * 100},${28 - (v / max) * 26}`).join(" ")}
        />
      </svg>
      <p className="font-mono text-xs">
        {last < 10 ? last.toFixed(1) : Math.round(last)}{" "}
        <span className="text-muted text-[10px]">{unit}</span>
      </p>
    </div>
  );
}

export function ThreeSick() {
  const [s, set] = useSceneState<GoldenState>();
  const c = CASES.find((x) => x.id === s.case) ?? CASES[0];
  const pick = s.picks?.[c.id];
  const ok = pick === c.answer;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Three sick services"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CASES.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ case: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs",
                  c.id === x.id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  s.picks?.[x.id] === x.answer && "text-good",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SIG.map((k) => (
              <Mini
                key={k}
                values={c.series[k]}
                unit={c.units[k]}
                label={k === "saturation" ? `saturation (${c.saturationOf})` : k}
              />
            ))}
          </div>
          <p className="text-muted text-[10px]">last 20 minutes · what&apos;s going on?</p>
          <div className="flex flex-col gap-1.5">
            {DIAGNOSES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => set({ picks: { ...(s.picks ?? {}), [c.id]: d.id } })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  pick === d.id
                    ? d.id === c.answer
                      ? "border-good bg-good/10"
                      : "border-bad/60 bg-bad/10"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
          {pick && (
            <motion.p
              key={`${c.id}-${pick}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("text-sm", ok ? "text-good" : "text-bad")}
            >
              {ok ? c.explain : "Look again at how traffic, errors and saturation move together."}
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        Three services paged in one night. Read each one&apos;s four signals together and diagnose
        it. No logs, no traces yet: just the vital signs.
      </p>
      <p>
        The patterns matter more than any single number. More traffic plus full CPU means overload.
        Errors with <em>falling</em> latency mean something is failing fast. Flat traffic with a
        filling resource and creeping p99 means exhaustion is coming: the SRE book notes that
        latency increases &ldquo;are often a leading indicator of saturation&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ RED and USE --------------------------------------------------------------------------------- */

export function RedUse() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="RED for services, USE for resources"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="font-semibold">RED · every service</p>
            <ul className="text-muted mt-2 flex flex-col gap-1 text-sm">
              <li>
                <span className="text-fg font-mono">R</span>ate: requests per second
              </li>
              <li>
                <span className="text-fg font-mono">E</span>rrors: failed requests per second
              </li>
              <li>
                <span className="text-fg font-mono">D</span>uration: how long requests take (as a
                distribution)
              </li>
            </ul>
            <p className="text-muted mt-2 text-xs">Tom Wilkie, written up in 2017</p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="font-semibold">USE · every resource</p>
            <ul className="text-muted mt-2 flex flex-col gap-1 text-sm">
              <li>
                <span className="text-fg font-mono">U</span>tilisation: how busy it is
              </li>
              <li>
                <span className="text-fg font-mono">S</span>aturation: extra work queued that it
                can&apos;t serve
              </li>
              <li>
                <span className="text-fg font-mono">E</span>rrors: error events
              </li>
            </ul>
            <p className="text-muted mt-2 text-xs">Brendan Gregg, 2012</p>
          </div>
        </div>
      }
    >
      <p>
        Two shorthand checklists grew out of the same idea. Tom Wilkie&apos;s{" "}
        <Term id="red-method">RED method</Term> is, in his words, &ldquo;100% based on&rdquo; the
        golden signals, minus saturation, for request-driven services. Brendan Gregg&apos;s{" "}
        <Term id="use-method">USE method</Term> says: &ldquo;For every resource, check utilization,
        saturation, and errors.&rdquo;
      </p>
      <p>
        Use RED for the API, USE for the CPU, disks, network links and connection pools underneath.
        Gregg also warns that averages hide saturation: a tool &ldquo;reporting five minute
        averages&rdquo; showed CPU below 80% while it hit 100% for seconds at a time.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Symptom or cause? --------------------------------------------------------------------------- */

export function SymptomOrCause() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Symptom or cause?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="symptom-or-cause"
            prompt="Is each a symptom users feel, or a possible cause behind one?"
            categories={[
              { id: "symptom", label: "Symptom (what's broken)" },
              { id: "cause", label: "Cause (why)" },
            ]}
            items={[
              {
                id: "slow",
                label: "Checkout p99 above 2 seconds for 10 minutes",
                category: "symptom",
                why: "Users feel it directly. Worth a page.",
              },
              {
                id: "errors",
                label: "3% of payments failing",
                category: "symptom",
                why: "A user-visible failure. Worth a page.",
              },
              {
                id: "login",
                label: "Customers can't log in",
                category: "symptom",
                why: "What's broken, from the user's side.",
              },
              {
                id: "cpu",
                label: "One server's CPU at 90%",
                category: "cause",
                why: "Might explain slowness, or might be harmless. A dashboard item, not a page.",
              },
              {
                id: "pool",
                label: "Database connection pool full",
                category: "cause",
                why: "A likely reason for slow requests; look at it while investigating.",
              },
              {
                id: "restart",
                label: "A pod restarted",
                category: "cause",
                why: "Possibly relevant, often not. Users may never notice.",
              },
            ]}
            explanation="The SRE book frames monitoring as answering 'what's broken, and why?'. Page people on symptoms; use causes to explain them."
          />
        </div>
      }
    >
      <p>
        Your monitoring, says the SRE book, &ldquo;should address two questions: what&apos;s broken,
        and why?&rdquo; The what is a symptom; the why is a cause.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Four vital signs", "Latency, traffic, errors, saturation."],
  ["Read them together", "Patterns tell overload, fast failure and exhaustion apart."],
  ["Errors have latency too", "A slow error is worse than a fast one."],
  ["RED and USE", "RED for services, USE for the resources beneath."],
  ["Page on symptoms", "Causes explain; symptoms wake people."],
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
        Put the four signals at the top of every service&apos;s dashboard, and you&apos;ll have a
        first answer to &ldquo;is it us?&rdquo; within seconds of being paged.
      </p>
      <p>Next chapter: logs, starting with how to write ones a machine can search.</p>
    </StepLayout>
  );
}
