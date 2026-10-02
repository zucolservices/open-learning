"use client";

import { motion } from "motion/react";
import { Pizza } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CANDIDATES, NINES, allowed, fmtDuration } from "./model";
import type { SloState } from "./state";

/* 1 ─ A promise you can measure ------------------------------------------------------------------- */

const TRIO: [string, string, string, string][] = [
  [
    "SLI",
    "indicator",
    "Share of pizzas delivered within 30 minutes",
    '"a carefully defined quantitative measure of some aspect of the level of service that is provided."',
  ],
  [
    "SLO",
    "objective",
    "Target: 95% of pizzas within 30 minutes, every 4 weeks",
    '"a target value or range of values for a service level that is measured by an SLI."',
  ],
  [
    "SLA",
    "agreement",
    "Late pizza? It's free.",
    '"an explicit or implicit contract with your users that includes consequences of meeting (or missing) the SLOs they contain."',
  ],
];

export function MeasurablePromise() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A promise you can measure"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Pizza className="text-accent size-5" /> A pizza shop&apos;s promise, taken apart
          </div>
          {TRIO.map(([k, n, ex, q], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid gap-1 rounded-xl border px-4 py-3 sm:grid-cols-[6rem_1fr]"
            >
              <div>
                <p className="font-mono text-lg font-semibold">{k}</p>
                <p className="text-muted text-[10px]">service level {n}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{ex}</p>
                <p className="text-muted mt-0.5 text-xs">{q}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;Fast delivery&rdquo; means nothing until you say how you&apos;ll measure it and what
        counts as good enough. Reliability works the same way.
      </p>
      <p>
        Google&apos;s SRE book gives three terms (definitions on the cards): an{" "}
        <Term id="sli">SLI</Term> is what you measure, an <Term id="slo">SLO</Term> is the target
        for it, and an <Term id="sla">SLA</Term> is a promise to customers with consequences
        attached. Engineers mostly work with the first two; SLAs are usually looser, so there&apos;s
        room to fix things before money changes hands.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pick the indicator ⭐ ----------------------------------------------------------------------- */

export function PickIndicator() {
  const [s, set] = useSceneState<SloState>();
  const c = CANDIDATES.find((x) => x.id === s.pick);
  return (
    <StepLayout
      eyebrow="Build"
      title="Pick the indicator"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-sm font-semibold">
            Customers pay through checkout. What should you measure?
          </p>
          <div className="flex flex-col gap-1.5">
            {CANDIDATES.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ pick: x.id })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  s.pick === x.id
                    ? x.ok
                      ? "border-good bg-good/10"
                      : "border-bad/60 bg-bad/10"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          {c && (
            <motion.p
              key={c.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("text-sm", c.ok ? "text-good" : "text-bad")}
            >
              {c.why}
            </motion.p>
          )}
          {c?.ok && (
            <div className="border-line bg-surface rounded-xl border px-4 py-3 font-mono text-xs">
              SLI = good checkouts ÷ all checkouts
              <br />
              good = status not 5xx AND latency ≤ 2 s
            </div>
          )}
        </div>
      }
    >
      <p>
        A good SLI measures what users experience, as a ratio: the Workbook defines it as &ldquo;the
        number of good events divided by the total number of events&rdquo;, so it runs from 0 to
        100%.
      </p>
      <p>
        Start from a user journey (paying, searching, logging in) and decide what &ldquo;good&rdquo;
        means for it: usually fast enough and correct. Measure as close to the user as you can, at
        the load balancer or even in the browser, not deep inside the servers.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What the nines allow ------------------------------------------------------------------------ */

export function Nines() {
  const [s, set] = useSceneState<SloState>();
  const a = allowed(s.target);
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the nines allow"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {NINES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set({ target: n })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs",
                  s.target === n
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {n}%
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-muted text-[10px]">Fully down, per 30 days</p>
              <p className="font-mono text-lg font-semibold">{fmtDuration(a.per30Min)}</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-muted text-[10px]">Fully down, per year</p>
              <p className="font-mono text-lg font-semibold">{fmtDuration(a.perYearMin)}</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-muted text-[10px]">Bad checkouts per million</p>
              <p className="font-mono text-lg font-semibold">
                {a.perMillion.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className="bg-surface-2 h-3 overflow-hidden rounded-full">
            <motion.div
              animate={{ width: `${Math.max(0.5, ((100 - s.target) / 1) * 100)}%` }}
              className="bg-bad/60 h-full"
            />
          </div>
          <p className="text-muted text-[10px]">
            Bar: allowed failure compared with a 99% target (full width). Times assume total outages; in practice the
            budget is spent on partial failures too.
          </p>
        </div>
      }
    >
      <p>
        Each extra nine cuts the allowed failure by ten, and usually multiplies the cost. At 99.9%
        you can be fully down for 43 minutes every 30 days; at 99.999%, for 26 seconds.
      </p>
      <p>
        Don&apos;t aim for 100%. The SRE book: &ldquo;100% is the wrong reliability target for
        basically everything (pacemakers and anti-lock brakes being notable exceptions)&rdquo;,
        partly because &ldquo;no user can tell the difference between a system being 100% available
        and 99.999% available&rdquo;: their laptop, WiFi and internet connection fail more often
        than that.
      </p>
      <p>
        The Workbook suggests measuring over a four-week rolling window. For comparison, AWS
        promises 99.99% for EC2 in a region, with service credits below it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ SLI, SLO or SLA? ---------------------------------------------------------------------------- */

export function WhichTerm() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="SLI, SLO or SLA?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="sli-slo-sla"
            prompt="Which is each statement?"
            categories={[
              { id: "sli", label: "SLI" },
              { id: "slo", label: "SLO" },
              { id: "sla", label: "SLA" },
            ]}
            items={[
              {
                id: "ratio",
                label: "Share of logins completed within 1 second",
                category: "sli",
                why: "A measurement: good events over total.",
              },
              {
                id: "fresh",
                label: "Share of dashboard data less than 5 minutes old",
                category: "sli",
                why: "A freshness indicator, also a ratio.",
              },
              {
                id: "target",
                label: "99.9% of payments succeed within 2 s, over 4 weeks",
                category: "slo",
                why: "A target for an indicator over a window.",
              },
              {
                id: "internal",
                label: "Internal goal: search p99 under 400 ms on 99% of days",
                category: "slo",
                why: "A target the team holds itself to; no customer penalty attached.",
              },
              {
                id: "credit",
                label: "Below 99.5% monthly availability, the customer gets 10% credit",
                category: "sla",
                why: "A contract with a consequence.",
              },
            ]}
            explanation="Indicators measure, objectives set targets, agreements attach consequences. Set SLOs stricter than any SLA, so you notice problems before they cost money."
          />
        </div>
      }
    >
      <p>Measure, target, promise.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Measure what users feel", "Good events ÷ total events, from the user's side."],
  ["Define 'good'", "Fast enough and correct, per journey."],
  ["Never 100%", "Each nine costs about ten times more."],
  ["SLO tighter than SLA", "Room to fix things before penalties."],
  ["Few and simple", "A handful of SLOs per service, reviewed regularly."],
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
        Tools help keep SLOs as code: OpenSLO is an open specification for writing them down; Sloth
        and Pyrra generate Prometheus rules; Google Cloud, Datadog, Grafana and Nobl9 track them for
        you. System Design&apos;s observability module introduced the idea; next, the budget an SLO
        gives you to spend.
      </p>
    </StepLayout>
  );
}
