"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { OUTCOMES, PROBES, STEPS, type Mode, type Probe } from "./model";
import type { OcState } from "./state";

/* 1 ─ Conductor or dancers? ----------------------------------------------------------------------- */

export function ConductorDancers() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Conductor or dancers?"
      stage={
        <div className="grid flex-1 content-center gap-4 sm:grid-cols-2">
          {[
            { t: "Orchestra", d: "One conductor; everyone follows the baton.", hub: true },
            { t: "Dance troupe", d: "No conductor; each dancer reacts to the others.", hub: false },
          ].map((c) => (
            <div
              key={c.t}
              className="border-line bg-surface flex flex-col items-center gap-2 rounded-xl border px-4 py-4"
            >
              <svg viewBox="0 0 120 90" className="w-40" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => {
                  const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
                  const x = Math.round(60 + 38 * Math.cos(a));
                  const y = Math.round(45 + 32 * Math.sin(a));
                  const nx = Math.round(60 + 38 * Math.cos(a + (Math.PI * 2) / 5));
                  const ny = Math.round(45 + 32 * Math.sin(a + (Math.PI * 2) / 5));
                  return (
                    <g key={i}>
                      {c.hub ? (
                        <line
                          x1={60}
                          y1={45}
                          x2={x}
                          y2={y}
                          className="stroke-accent"
                          strokeWidth={1.2}
                        />
                      ) : (
                        <line
                          x1={x}
                          y1={y}
                          x2={nx}
                          y2={ny}
                          className="stroke-viz-meta"
                          strokeWidth={1.2}
                          strokeDasharray="3 2"
                        />
                      )}
                      <motion.circle
                        cx={x}
                        cy={y}
                        r={6}
                        className="fill-surface-2 stroke-line-strong"
                        animate={c.hub ? {} : { r: [6, 7.5, 6] }}
                        transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
                      />
                    </g>
                  );
                })}
                {c.hub && <circle cx={60} cy={45} r={9} className="fill-accent/30 stroke-accent" />}
              </svg>
              <p className="text-sm font-semibold">{c.t}</p>
              <p className="text-muted text-center text-xs">{c.d}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        An orchestra has a conductor: one person who knows the whole score and cues each section. A
        dance troupe performing an improvised piece has no one in charge; each dancer watches the
        others and responds. Sam Newman used this picture in the first edition of &ldquo;Building
        Microservices&rdquo; (2015).
      </p>
      <p>
        A business process spread across systems can be run either way.{" "}
        <Term id="orchestration-ep">Orchestration</Term>: a central coordinator tells each system
        what to do. <Term id="choreography">Choreography</Term>: systems publish events and react to
        each other, with no one in charge.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A loan, two ways ⭐ ------------------------------------------------------------------------- */

export function TwoWays() {
  const [s, set] = useSceneState<OcState>();
  const o = OUTCOMES[s.mode][s.probe];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A loan, two ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Mode>
            size="sm"
            value={s.mode}
            onChange={(mode) => set({ mode })}
            options={[
              ["orch", "Orchestration"],
              ["chor", "Choreography"],
            ]}
          />
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {s.mode === "orch" ? (
              <>
                <span className="border-accent bg-accent-soft rounded-lg border px-2.5 py-1.5 text-xs font-semibold">
                  Loan workflow
                </span>
                <span className="text-muted text-xs">→</span>
                {STEPS.map((st) => (
                  <span
                    key={st}
                    className="border-line bg-surface rounded-md border px-2 py-1 text-[11px]"
                  >
                    {st}
                  </span>
                ))}
              </>
            ) : (
              STEPS.map((st, i) => (
                <span key={st} className="flex items-center gap-1.5">
                  <span className="border-line bg-surface rounded-md border px-2 py-1 text-[11px]">
                    {st}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="text-viz-meta text-[10px]">event →</span>
                  )}
                </span>
              ))
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(PROBES) as Probe[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={s.probe === p}
                onClick={() => set({ probe: p })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.probe === p ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {PROBES[p]}
              </button>
            ))}
          </div>
          <div className="bg-surface-2 rounded-xl px-3 py-2 font-mono text-[11px] leading-relaxed">
            {o.lines.map((l, i) => (
              <motion.p
                key={s.mode + s.probe + i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {l}
              </motion.p>
            ))}
          </div>
          <motion.p
            key={s.mode + s.probe}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              o.tone === "good"
                ? "border-good/50 bg-good/10"
                : o.tone === "bad"
                  ? "border-bad/50 bg-bad/10"
                  : "border-line bg-surface",
            )}
          >
            {o.verdict}
          </motion.p>
          <p className="text-subtle text-[10px]">An illustrative bank.</p>
        </div>
      }
    >
      <p>
        A bank&apos;s loan approval spans four services. Run it with a central workflow, then with
        services reacting to events, and put each through the same four tests.
      </p>
      <p>
        When a step fails partway, earlier steps may need undoing with compensating actions: the
        pattern known as a <Term id="saga">saga</Term> (Garcia-Molina and Salem, 1987; the System
        Design track covers it in depth). An orchestrator knows what to undo; with choreography,
        every service must know which failure events to listen for.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Trade-offs ---------------------------------------------------------------------------------- */

const SIDES: { t: string; pros: string[]; cons: string[] }[] = [
  {
    t: "Orchestration",
    pros: [
      "Better suited for complex workflows",
      "Avoids cyclic dependencies",
      "One place to see the process and its state",
    ],
    cons: [
      "A central point of failure",
      "Can become a bottleneck, or a 'god service' that knows too much",
    ],
  },
  {
    t: "Choreography",
    pros: [
      "No extra service needed for coordination",
      "No single point of failure",
      "Easy to add new listeners",
    ],
    cons: [
      "Workflow can be confusing as steps are added",
      "Risk of cyclic dependencies",
      "Integration testing needs every service running",
    ],
  },
];

export function TradeOffs() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Trade-offs"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {SIDES.map((sd) => (
            <div
              key={sd.t}
              className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{sd.t}</p>
              {sd.pros.map((p) => (
                <p key={p} className="text-good text-xs">
                  + {p}
                </p>
              ))}
              {sd.cons.map((c) => (
                <p key={c} className="text-bad text-xs">
                  − {c}
                </p>
              ))}
            </div>
          ))}
        </div>
      }
    >
      <p>
        Most points here come from Microsoft&apos;s saga pattern guidance. Hohpe and Woolf called
        the central coordinator a <Term id="process-manager">process manager</Term>, warned it can
        become a performance bottleneck, and added that using one &ldquo;for every situation may be
        overkill.&rdquo;
      </p>
      <p>
        A practical rule of thumb from Newman&apos;s second edition (2021), paraphrased: if one team
        owns the whole flow, orchestrate it; if several teams share it, choreograph it, and make
        every event carry a correlation ID. Many systems mix both: choreography between bounded
        contexts, orchestration inside one.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Workflow engines ---------------------------------------------------------------------------- */

const ENGINES: [string, string][] = [
  [
    "Temporal",
    "Workflows written as ordinary code that survive crashes and can run for seconds or years. A fork of Uber's Cadence; the company was founded in 2019; MIT-licensed.",
  ],
  [
    "Camunda",
    "Runs processes drawn in BPMN, the flowchart-like standard (BPMN 2.0, formally released by the OMG in January 2011; 2.0.1 is ISO/IEC 19510).",
  ],
  [
    "AWS Step Functions",
    "Launched December 2016. Standard workflows run up to a year, exactly once; Express workflows up to five minutes, at least once.",
  ],
  [
    "Azure",
    "Durable Functions for workflows in code; Logic Apps for low-code flows with 1,400+ connectors.",
  ],
  [
    "Google Cloud Workflows",
    "A managed orchestrator defined in YAML or JSON; a workflow can wait for up to a year.",
  ],
];

export function Engines() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Workflow engines"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ENGINES.map(([t, d], i) => (
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
        Writing an orchestrator by hand means building state storage, retries, timers and recovery.
        A <Term id="workflow-engine">workflow engine</Term> provides those, so a long-running
        process (approve a loan over three days, wait for a signature) survives restarts.
      </p>
      <p>
        The 2003 pattern site itself now names Step Functions and Google Cloud Workflows as examples
        of a process manager.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which approach? ----------------------------------------------------------------------------- */

export function WhichApproach() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which approach?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-approach"
            prompt="Orchestration or choreography?"
            categories={[
              { id: "orch", label: "Orchestration" },
              { id: "chor", label: "Choreography" },
            ]}
            items={[
              {
                id: "kyc",
                label:
                  "A ten-step customer onboarding owned by one team, with strict compliance audit trails",
                category: "orch",
                why: "Complex, one owner, and auditors want one place to see each case.",
              },
              {
                id: "claims",
                label: "An insurance claim waiting days for documents and a human assessor",
                category: "orch",
                why: "Long-running with timers and state: a workflow engine's job.",
              },
              {
                id: "orderplaced",
                label: "When an order is placed, five teams' services each do their own thing",
                category: "chor",
                why: "Independent reactions owned by different teams.",
              },
              {
                id: "analytics",
                label: "Adding a new analytics service that wants to hear about every payment",
                category: "chor",
                why: "Just subscribe; nobody else changes.",
              },
            ]}
            explanation="One owner, complex steps, state to track: orchestrate. Independent reactions across teams: choreograph."
          />
        </div>
      }
    >
      <p>Pick the better fit for each.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Orchestration", "A coordinator runs the process and holds its state."],
  ["Choreography", "Services react to each other's events."],
  ["Failures decide", "Who undoes what when step three fails?"],
  ["Follow ownership", "One team: orchestrate. Many teams: choreograph."],
  ["Use an engine", "Temporal, Camunda, Step Functions, Durable Functions, Workflows."],
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
        Where should all this integration logic live: in one central product, or spread across the
        services? The next module tells the story of how enterprises have answered that.
      </p>
    </StepLayout>
  );
}
