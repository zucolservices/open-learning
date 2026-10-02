"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CADENCES, CADENCE_LABEL, fmtLead, fmtMin, metrics, type Checks } from "./model";
import type { DoraState } from "./state";

/* 1 ─ Five numbers -------------------------------------------------------------------------------- */

const FIVE: { name: string; side: "Throughput" | "Instability"; def: string; from: string }[] = [
  {
    name: "Change lead time",
    side: "Throughput",
    def: "The amount of time it takes for a change to go from committed to version control to deployed in production.",
    from: "commit time → production deploy time",
  },
  {
    name: "Deployment frequency",
    side: "Throughput",
    def: "The number of deployments over a given period or the time between deployments.",
    from: "successful production deploy events",
  },
  {
    name: "Failed deployment recovery time",
    side: "Throughput",
    def: "The time it takes to recover from a deployment that fails and requires immediate intervention.",
    from: "incident opened → service restored",
  },
  {
    name: "Change fail rate",
    side: "Instability",
    def: "The ratio of deployments that require immediate intervention following a deployment.",
    from: "deploys linked to rollbacks, hotfixes or incidents",
  },
  {
    name: "Deployment rework rate",
    side: "Instability",
    def: "The ratio of deployments that are unplanned but happen as a result of an incident in production.",
    from: "unplanned deploys ÷ all deploys",
  },
];

export function FiveNumbers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Five numbers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FIVE.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className={cn(
                "rounded-lg border px-3 py-2",
                f.side === "Throughput"
                  ? "border-viz-data/40 bg-viz-data/5"
                  : "border-viz-compute/40 bg-viz-compute/5",
              )}
            >
              <p className="flex items-baseline justify-between gap-2 text-sm font-semibold">
                {f.name}
                <span className="text-muted font-mono text-[10px] font-normal">{f.side}</span>
              </p>
              <p className="text-muted text-xs">&ldquo;{f.def}&rdquo;</p>
              <p className="mt-0.5 font-mono text-[10px]">measured from: {f.from}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        <Term id="dora">DORA</Term>, a research programme now run by Google Cloud, has surveyed tens
        of thousands of people since 2014 about how they deliver software. It boils delivery down to
        five measures in two groups.
      </p>
      <p>
        Throughput: how fast changes get to users (<Term id="lead-time">lead time</Term>,{" "}
        <Term id="deployment-frequency">deployment frequency</Term>), and how fast you recover when
        one breaks. Instability: how often a change breaks something (the{" "}
        <Term id="change-fail-rate">change fail rate</Term>) and forces unplanned work. The
        definitions are DORA&apos;s own, and every one can be computed from data your pipeline and
        incident tracker already hold.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Your team's month ⭐ ------------------------------------------------------------------------ */

export function TeamMonth() {
  const [s, set] = useSceneState<DoraState>();
  const m = metrics(s.every, s.checks);
  const failed = new Set(m.failedIdx);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A team's month in five numbers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-muted self-center text-xs">Deploy</span>
            {CADENCES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set({ every: c })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.every === c ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {CADENCE_LABEL[c]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Automated checks</span>
            <Segmented<Checks>
              size="sm"
              value={s.checks}
              onChange={(checks) => set({ checks })}
              options={[
                ["strong", "Strong"],
                ["weak", "Weak"],
              ]}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted mb-1 font-mono text-[10px]">
              {m.deploys} production deploys in 30 days · red = needed immediate intervention
            </p>
            <div className="flex flex-wrap gap-[3px]">
              {Array.from({ length: m.deploys }, (_, i) => (
                <motion.span
                  key={`${s.every}-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: Math.min(i, 60) * 0.005 }}
                  className={cn(
                    "rounded-sm",
                    m.deploys > 40 ? "size-2.5" : "size-5",
                    failed.has(i) ? "bg-bad" : "bg-good/60",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              ["Lead time", fmtLead(m.leadHours), "T", m.leadHours > 48],
              ["Deploys / month", `${m.deploys}`, "T", m.deploys < 5],
              ["Recovery time", fmtMin(m.recoverMin), "T", m.recoverMin > 120],
              [
                "Change fail rate",
                `${(m.changeFailRate * 100).toFixed(1)}%`,
                "I",
                m.changeFailRate > 0.15,
              ],
              ["Rework rate", `${(m.reworkRate * 100).toFixed(1)}%`, "I", m.reworkRate > 0.15],
            ].map(([l, v, side, bad]) => (
              <div
                key={l as string}
                className={cn(
                  "rounded-lg border px-2 py-1.5",
                  side === "T"
                    ? "border-viz-data/30 bg-viz-data/5"
                    : "border-viz-compute/30 bg-viz-compute/5",
                )}
              >
                <p className="text-muted text-[10px]">{l}</p>
                <p className={cn("font-mono text-sm font-semibold", bad && "text-bad")}>{v}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Illustrative: 300 changes finished over 30 days. Strong checks let fewer faults through
            and roll back faster; bigger releases take longer to diagnose.
          </p>
        </div>
      }
    >
      <p>
        Change how often this team deploys and how good its automated checks are, and watch all five
        numbers move together.
      </p>
      <p>
        Deploying more often doesn&apos;t trade stability for speed; it improves both, because each
        release is smaller. DORA: &ldquo;speed and stability are not tradeoffs. In fact, we see that
        the metrics are correlated for most teams. Top performers do well across all five metrics,
        and low performers do poorly.&rdquo;
      </p>
      <p>
        For scale, DORA&apos;s 2024 survey found its top cluster deploying on demand, with lead
        times under a day, a 5% change fail rate and recovery in under an hour.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Measure without gaming ---------------------------------------------------------------------- */

const PITFALLS: [string, string][] = [
  [
    "Setting metrics as a goal",
    '"Every application must deploy multiple times per day by year\'s end" invites gaming.',
  ],
  [
    "Having one metric to rule them all",
    "Use several, including some that pull against each other.",
  ],
  ["Making disparate comparisons", "A mobile app and a mainframe system aren't comparable."],
  [
    "Having siloed ownership",
    "Giving each team its own metric breeds friction and finger-pointing.",
  ],
  [
    "Competing",
    '"The goal is to improve your team\'s performance over time, not to compete against other teams or organizations."',
  ],
];

export function NoGaming() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Measure without gaming"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-[10px]">
            Pitfalls, in DORA&apos;s guide&apos;s own headings
          </p>
          {PITFALLS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
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
        Goodhart&apos;s law, in Marilyn Strathern&apos;s phrasing: &ldquo;When a measure becomes a
        target, it ceases to be a good measure.&rdquo; Order teams to deploy daily and some will
        split one change into five deploys.
      </p>
      <p>
        Use the numbers to find where a team is stuck, then watch its own trend. DORA&apos;s 2024
        report puts it well: &ldquo;The best teams are those that achieve elite improvement, not
        necessarily elite performance.&rdquo;
      </p>
      <p>
        Measuring is easier than it sounds: DORA&apos;s free Quick Check asks five questions, and
        tools such as GitLab and several commercial platforms compute the metrics from deploy and
        incident data.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The ranking ---------------------------------------------------------------------------------- */

export function Ranking() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The league table"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="dora-league-table"
            prompt="Leadership wants a monthly league table ranking every team by deployment frequency, with a target of 'elite' by year end. What does DORA's guidance suggest instead?"
            options={[
              {
                id: "rank",
                label: "Go ahead: competition will motivate teams",
                feedback: "DORA lists competing as a pitfall; teams game what they're ranked on.",
              },
              {
                id: "trend",
                label:
                  "Each team tracks all five measures over time and uses them to find its own bottlenecks",
                correct: true,
                feedback:
                  "Several measures in tension, compared with the team's own past: improvement, not a race.",
              },
              {
                id: "one",
                label: "Rank by change fail rate instead, since stability matters more",
                feedback: "Still one metric, still a ranking. Teams would just deploy less.",
              },
              {
                id: "drop",
                label: "Stop measuring delivery altogether",
                feedback: "Then nobody can tell whether changes to the process help.",
              },
            ]}
            explanation="Measure to learn, not to judge: all five metrics, per service, as a trend."
          />
        </div>
      }
    >
      <p>The numbers are a mirror, not a scoreboard.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Five measures", "Lead time, deploy frequency, recovery time, change fail rate, rework rate."],
  ["Speed and stability together", "Small batches improve both sides at once."],
  ["Compute from real data", "Deploy events, commit times, incidents; use medians."],
  ["Improve, don't compete", "Track each team's own trend; never rank."],
  ["Context matters", "DORA's 2025 report swapped performance tiers for seven team profiles."],
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
        DORA&apos;s 2025 report, on AI-assisted development, found AI now associated with higher
        throughput but still with more instability: it amplifies whatever delivery habits a team
        already has. Frameworks such as SPACE and DevEx add the developer&apos;s side, such as
        satisfaction and flow.
      </p>
      <p>Next: the platforms that run all of this, and what they cost.</p>
    </StepLayout>
  );
}
