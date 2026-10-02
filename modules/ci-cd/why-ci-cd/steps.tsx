"use client";

import { motion } from "motion/react";
import { Bot, Hand } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BATCHES, BUGS, CHANGES, fmtDays, simulate, strip, type Batch } from "./model";
import type { Mode, WhyState } from "./state";

/* 2 ─ Same work, different batches ⭐ -------------------------------------------------------------- */

const CADENCE: Record<Batch, string> = {
  240: "Once a quarter",
  60: "Every 3 weeks",
  20: "Weekly",
  8: "Every 2 days",
  4: "Daily",
  1: "Every change",
};

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
      <p className="text-muted text-[10px]">{label}</p>
      <p className={cn("font-mono text-sm font-semibold", bad && "text-bad")}>{value}</p>
    </div>
  );
}

export function BatchSize() {
  const [s, set] = useSceneState<WhyState>();
  const r = simulate(s.batch);
  const cells = strip(s.batch);
  const failPct = Math.round((r.failed / r.releases) * 100);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Same work, different batches"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {BATCHES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => set({ batch: b })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.batch === b ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {CADENCE[b]}
              </button>
            ))}
          </div>
          <div>
            <p className="text-muted mb-1 font-mono text-[10px]">
              {CHANGES} changes in a quarter · grouped into {r.releases} release
              {r.releases === 1 ? "" : "s"} · red = release broke
            </p>
            <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-[2px] sm:grid-cols-[repeat(40,minmax(0,1fr))]">
              {cells.map((c, i) => (
                <motion.div
                  key={`${s.batch}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (i % 40) * 0.004 }}
                  title={`change ${i + 1}, release ${c.release + 1}`}
                  className={cn(
                    "relative aspect-square rounded-[2px]",
                    c.failed ? "bg-bad/25" : "bg-good/25",
                    c.release % 2 === 1 && "opacity-70",
                  )}
                >
                  {c.bug && <span className="bg-bad absolute inset-[25%] rounded-full" />}
                </motion.div>
              ))}
            </div>
            <p className="text-muted mt-1 font-mono text-[10px]">
              ● = one of the {BUGS.length} changes with a bug (the same ones every time)
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat
              label="Releases that broke"
              value={`${r.failed} of ${r.releases} (${failPct}%)`}
              bad={failPct > 50}
            />
            <Stat
              label="Suspects per failure"
              value={`${r.suspects} change${r.suspects === 1 ? "" : "s"}`}
              bad={r.suspects > 20}
            />
            <Stat
              label="Test runs to find culprit"
              value={r.bisectSteps === 0 ? "none" : `~${r.bisectSteps}`}
            />
            <Stat label="Finished work waits" value={fmtDays(r.waitDays)} bad={r.waitDays > 7} />
          </div>
          <p className="text-muted text-[10px]">
            Illustrative: 240 changes over 60 working days, 7 of them buggy. &ldquo;Test runs to
            find culprit&rdquo; assumes you halve the suspects each time (git bisect).
          </p>
        </div>
      }
    >
      <p>
        The quarter&apos;s work is the same every time: 240 finished changes, seven of them hiding a
        bug. Only one thing changes: how many you release together, the{" "}
        <Term id="batch-size">batch size</Term>.
      </p>
      <p>
        Release once a quarter and that release breaks, with 240 suspects. Release every change and
        the same seven bugs break seven tiny releases, each with exactly one suspect, while good
        work reaches users within hours instead of waiting a month.
      </p>
      <p>
        DORA&apos;s research puts it plainly: small batches &ldquo;reduce the time it takes to get
        feedback on changes, making it easier to triage and remediate problems&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three phrases, one idea --------------------------------------------------------------------- */

const STAGES = ["Build", "Test", "Package", "Staging", "Production"];

/** Which stages run automatically for each meaning; the rest need a person. */
const AUTO: Record<Mode, number> = { ci: 2, delivery: 4, deployment: 5 };

const MODES: Record<Mode, { name: string; quote: string; who: string }> = {
  ci: {
    name: "Continuous integration",
    quote:
      "Each member of a team merges their changes into a codebase together with their colleagues changes at least daily. Each of these integrations is verified by an automated build (including test).",
    who: "Martin Fowler",
  },
  delivery: {
    name: "Continuous delivery",
    quote:
      "The ability to get changes of all types … into production, or into the hands of users, safely and quickly in a sustainable way.",
    who: "Jez Humble",
  },
  deployment: {
    name: "Continuous deployment",
    quote: "Every change goes through the pipeline and automatically gets put into production.",
    who: "Martin Fowler",
  },
};

export function ThreePhrases() {
  const [s, set] = useSceneState<WhyState>();
  const m = MODES[s.mode];
  const auto = AUTO[s.mode];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three phrases, one idea"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <Segmented<Mode>
            value={s.mode}
            onChange={(mode) => set({ mode })}
            size="sm"
            options={[
              ["ci", "Integration"],
              ["delivery", "Delivery"],
              ["deployment", "Deployment"],
            ]}
          />
          <div className="grid grid-cols-5 gap-1.5">
            {STAGES.map((st, i) => {
              const isAuto = i < auto;
              const gate = s.mode === "delivery" && i === 4;
              return (
                <motion.div
                  key={st}
                  layout
                  className={cn(
                    "flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-2 text-center",
                    isAuto
                      ? "border-accent/60 bg-accent-soft"
                      : gate
                        ? "border-viz-compute bg-viz-compute/10"
                        : "border-line bg-surface border-dashed",
                  )}
                >
                  {isAuto ? (
                    <Bot className="text-accent size-4" />
                  ) : (
                    <Hand className={cn("size-4", gate ? "text-viz-compute" : "text-muted")} />
                  )}
                  <span className="text-[10px] leading-tight font-medium sm:text-xs">{st}</span>
                  <span className="text-muted text-[9px]">
                    {isAuto ? "automatic" : gate ? "one click, when you choose" : "by hand"}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <motion.blockquote
            key={s.mode}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-accent bg-surface rounded-r-lg border-l-2 px-4 py-2"
          >
            <p className="text-sm font-semibold">{m.name}</p>
            <p className="text-muted mt-1 text-sm">&ldquo;{m.quote}&rdquo;</p>
            <p className="text-muted mt-1 text-xs">— {m.who}</p>
          </motion.blockquote>
        </div>
      }
    >
      <p>
        &ldquo;CI/CD&rdquo; packs three ideas, and the D is ambiguous, so always say which one you
        mean.
      </p>
      <p>
        <Term id="continuous-integration">Integration</Term> keeps everyone&apos;s work joined and
        checked. <Term id="continuous-delivery">Delivery</Term> keeps every passing change ready to
        release, and people choose when. <Term id="continuous-deployment">Deployment</Term> releases
        every passing change automatically. As Fowler notes, to do continuous deployment you must
        already be doing continuous delivery.
      </p>
      <p>
        A bank with an approval step and a startup shipping fifty times a day can both do continuous
        delivery. The practice is in the habit, not the tool: running a CI server on branches that
        live for weeks isn&apos;t continuous integration.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Safer or riskier? --------------------------------------------------------------------------- */

export function SaferRiskier() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safer or riskier?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="safer-riskier"
            prompt="Does each habit make releases safer or riskier?"
            categories={[
              { id: "safer", label: "Safer" },
              { id: "riskier", label: "Riskier" },
            ]}
            items={[
              {
                id: "daily",
                label: "Merging small changes into main at least daily",
                category: "safer",
                why: "Conflicts stay small and every problem has one obvious suspect.",
              },
              {
                id: "auto",
                label: "Building and testing every change automatically",
                category: "safer",
                why: "Mistakes surface within minutes, while the author still remembers the change.",
              },
              {
                id: "same",
                label: "Deploying the same way, by script, to every server",
                category: "safer",
                why: "No server is forgotten or set up differently, the gap behind Knight Capital's loss.",
              },
              {
                id: "quarter",
                label: "Saving changes up for one big quarterly release",
                category: "riskier",
                why: "One release with hundreds of suspects, and finished work waits months.",
              },
              {
                id: "freeze",
                label: "A long code freeze before each release",
                category: "riskier",
                why: "Work piles up behind the freeze, so the next batch is even bigger.",
              },
              {
                id: "laptop",
                label: "Building the release on one person's laptop",
                category: "riskier",
                why: "Nobody can repeat or check that build; it depends on whatever is on that laptop.",
              },
            ]}
            explanation="Every safer habit makes changes smaller, checks them sooner or makes releases repeatable. Every riskier one makes batches bigger or releases depend on people remembering steps."
          />
        </div>
      }
    >
      <p>Sort the habits. Some feel careful but make releases riskier.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Integrate often", "The longer work stays apart, the more it costs to join it back up."],
  ["Small batches", "The same bugs, but each failure has one suspect and is fixed in minutes."],
  ["Automate the checks", "Every change built and tested the same way, within minutes."],
  ["Say which D", "Delivery: always releasable. Deployment: released automatically."],
  ["Speed and stability", "DORA keeps finding they go together, not against each other."],
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
        DORA, Google Cloud&apos;s long-running research programme on software delivery, sums up a
        decade of surveys: &ldquo;speed and stability are not tradeoffs&rdquo;. Teams that release
        often also tend to break things less, because each release is small.
      </p>
      <p>
        Next: the raw material of all this, version control and how teams split and join their work.
      </p>
    </StepLayout>
  );
}
