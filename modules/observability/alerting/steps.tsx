"use client";

import { motion } from "motion/react";
import { BellRing } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ERRORS, FAST, MIN, RULES, SLOW, evaluate, type Rule } from "./model";
import type { AlertState } from "./state";

/* 1 ─ A week of pages ⭐ -------------------------------------------------------------------------- */

const HOURS = MIN / 60;
const hourly = Array.from({ length: HOURS }, (_, h) => {
  let sum = 0;
  for (let i = h * 60; i < h * 60 + 60; i++) sum += ERRORS[i];
  return sum / 60;
});

function fmtDelay(m: number | null, start: number) {
  if (m === null) return "missed";
  const d = m - start;
  return d < 60 ? `after ${d} min` : `after ${(d / 60).toFixed(1)} h`;
}

export function WeekOfPages() {
  const [s, set] = useSceneState<AlertState>();
  const r = evaluate(s.rule);
  const pageHours = new Set(r.pageMinutes.map((m) => Math.floor(m / 60)));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A week of pages"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<Rule>
              size="sm"
              value={s.rule}
              onChange={(rule) => set({ rule })}
              options={[
                ["naive", "Any bad minute"],
                ["threshold", "High for 10 min"],
                ["burn", "Burn rate"],
              ]}
            />
          </div>
          <p className="text-muted text-xs">{RULES[s.rule].text}</p>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 font-mono text-[10px]">
              average error rate each hour, Monday → Sunday
            </p>
            <div className="flex h-24 items-end gap-px">
              {hourly.map((v, h) => (
                <div key={h} className="relative flex h-full flex-1 flex-col justify-end">
                  {pageHours.has(h) && (
                    <BellRing className="text-bad absolute -top-0.5 left-1/2 size-2.5 -translate-x-1/2" />
                  )}
                  <div
                    className={cn("w-full", v >= 0.003 ? "bg-bad/70" : "bg-viz-data/40")}
                    style={{
                      height: `${Math.min(100, Math.max(2, Math.log10(v / 0.0001) * 33))}%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="text-muted mt-1 flex justify-between font-mono text-[9px]">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <p className="text-muted mt-1 font-mono text-[9px]">log scale · bell = a page</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["Pages this week", `${r.pages}`, r.pages > 6],
              ["False alarms", `${r.falsePages}`, r.falsePages > 2],
              ["Wednesday's slow burn", fmtDelay(r.slowAt, SLOW.start), r.slowAt === null],
              ["Saturday's outage", fmtDelay(r.fastAt, FAST.start), r.fastAt === null],
            ].map(([l, v, bad]) => (
              <div
                key={l as string}
                className="border-line bg-surface rounded-lg border px-2 py-1.5"
              >
                <p className="text-muted text-[10px]">{l}</p>
                <p
                  className={cn("font-mono text-sm font-semibold", bad ? "text-bad" : "text-good")}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Illustrative week for a 99.9% SLO: brief harmless blips, an 8-hour slow burn at about
            0.65% errors, and a 25-minute outage at 12%.
          </p>
        </div>
      }
    >
      <p>
        Three alert rules, one week. Which one wakes people for real problems, and only for real
        problems?
      </p>
      <p>
        Paging on any bad minute catches everything, and drowns the team in false alarms. A high
        threshold stays quiet, but sleeps through Wednesday&apos;s slow burn, which quietly eats the
        month&apos;s budget. Alerting on <Term id="burn-rate">burn rate</Term> over two windows
        catches both incidents and ignores the blips.
      </p>
      <p>
        The SRE Workbook judges alerts on four things: <em>precision</em> (&ldquo;the proportion of
        events detected that were significant&rdquo;), <em>recall</em> (&ldquo;the proportion of
        significant events detected&rdquo;), detection time and reset time.
      </p>
    </StepLayout>
  );
}

/* 2 ─ What deserves a page ------------------------------------------------------------------------ */

const RULESET: [string, string][] = [
  [
    "Urgent, important, actionable, real",
    "Rob Ewaschuk's test for a page, from his widely shared essay on alerting at Google.",
  ],
  [
    "Every page should be actionable",
    '"Every time the pager goes off, I should be able to react with a sense of urgency. I can only react with a sense of urgency a few times a day before I become fatigued."',
  ],
  [
    "Page on symptoms",
    "Users failing to pay, not a server's CPU. Causes belong on dashboards for the investigation.",
  ],
  [
    "A sustainable load",
    'Google found an incident takes about six hours to handle, "It follows that the maximum number of incidents per day is 2 per 12-hour on-call shift."',
  ],
];

export function DeservesPage() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What deserves a page"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {RULESET.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
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
        <Term id="alert-fatigue">Alert fatigue</Term> is the real enemy. The SRE book warns that
        low-priority alerts that bother the on-call engineer often &ldquo;can also cause serious
        alerts to be treated with less attention than necessary.&rdquo;
      </p>
      <p>
        Not every alert should page. Slow problems (budget burning at 1× for three days, a disk
        filling next week) become tickets for working hours.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The alert router ---------------------------------------------------------------------------- */

const ROUTER: [string, string][] = [
  ["Grouping", "Forty pods failing for the same reason arrive as one notification, not forty."],
  [
    "Routing",
    "Payments alerts go to the payments on-call, at the right urgency: page, chat or ticket.",
  ],
  [
    "Inhibition",
    "If the whole data centre is down, alerts for every service inside it are held back.",
  ],
  ["Silences", "Planned maintenance mutes the alerts it will cause, for a set time."],
];

export function Router() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Between the rule and the phone"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {ROUTER.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Alert rules decide <em>when</em> something is wrong; a router such as Prometheus
        Alertmanager (or the equivalent in Grafana, PagerDuty and the clouds) decides{" "}
        <em>who hears</em> and how.
      </p>
      <p>
        Rules can also wait: Prometheus&apos;s <span className="font-mono text-sm">for</span> clause
        keeps an alert pending until the condition has held for a while, and{" "}
        <span className="font-mono text-sm">keep_firing_for</span> stops it flapping off and on.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Page, ticket or neither? -------------------------------------------------------------------- */

export function PageOrTicket() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Page, ticket or neither?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="page-or-ticket"
            prompt="How should each condition notify people?"
            categories={[
              { id: "page", label: "Page now" },
              { id: "ticket", label: "Ticket" },
              { id: "none", label: "Dashboard only" },
            ]}
            items={[
              {
                id: "fast",
                label: "Checkout budget burning at 14.4× over the last hour",
                category: "page",
                why: "2% of the month's budget gone in an hour: urgent and user-visible.",
              },
              {
                id: "fail",
                label: "5% of UPI payments failing right now",
                category: "page",
                why: "A symptom users feel this minute.",
              },
              {
                id: "slow",
                label: "Budget burning at 1× over three days",
                category: "ticket",
                why: "On track to use the whole budget: fix it this week, during working hours.",
              },
              {
                id: "cert",
                label: "A TLS certificate expires in 14 days",
                category: "ticket",
                why: "Important, not urgent; better still, automate renewal.",
              },
              {
                id: "pod",
                label: "One pod restarted and came back",
                category: "none",
                why: "Kubernetes handled it and users noticed nothing.",
              },
              {
                id: "cpu",
                label: "CPU at 75% on two servers",
                category: "none",
                why: "A cause to look at while investigating, not a reason to wake anyone.",
              },
            ]}
            explanation="Page for urgent symptoms that need a person now; ticket for real but slow problems; leave everything else on dashboards."
          />
        </div>
      }
    >
      <p>Three levels of noise, matched to three levels of urgency.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Alert on SLO burn", "Burn rate over two windows: fast and slow problems, few false alarms."],
  ["Pages must be actionable", "Urgent, important, actionable, real."],
  ["Symptoms page, causes explain", "Users failing, not CPU high."],
  ["Tickets for slow problems", "Not everything needs a phone call at 3 a.m."],
  ["Route and group", "One notification per problem, to the right people."],
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
        The Workbook&apos;s recommended starting point for a 99.9% SLO: page at 14.4× burn over 1
        hour (checked against the last 5 minutes too), page at 6× over 6 hours (and 30 minutes), and
        open a ticket at 1× over 3 days. Very quiet services need care: with ten requests an hour,
        one failure looks like a 1,000× burn.
      </p>
      <p>Next: dashboards, for when the page arrives and you need to see what&apos;s going on.</p>
    </StepLayout>
  );
}
