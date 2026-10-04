"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ERAS, TRACE, type Era } from "./model";
import type { EsbState } from "./state";

const SYS = [
  { x: 40, y: 30, l: "CRM" },
  { x: 160, y: 30, l: "Orders" },
  { x: 280, y: 30, l: "Billing" },
  { x: 40, y: 150, l: "Stock" },
  { x: 160, y: 150, l: "Loyalty" },
  { x: 280, y: 150, l: "SaaS" },
];

function EraDiagram({ era }: { era: Era }) {
  const pairs: [number, number][] = [];
  if (era === "p2p")
    for (let i = 0; i < 6; i++)
      for (let j = i + 1; j < 6; j++) if ((i + j) % 2 || i === 0) pairs.push([i, j]);
  return (
    <svg viewBox="0 0 320 180" className="mx-auto w-full max-w-md" aria-hidden>
      {era === "p2p" &&
        pairs.map(([a, b]) => (
          <line
            key={`${a}${b}`}
            x1={SYS[a].x}
            y1={SYS[a].y}
            x2={SYS[b].x}
            y2={SYS[b].y}
            className="stroke-line-strong"
            strokeWidth={1}
          />
        ))}
      {era === "esb" && (
        <>
          <rect
            x={20}
            y={78}
            width={280}
            height={24}
            rx={6}
            className="fill-accent/25 stroke-accent"
            strokeWidth={1.5}
          />
          <text x={160} y={94} textAnchor="middle" className="fill-fg text-[9px] font-semibold">
            ESB: routing · transforms · orchestration · business rules
          </text>
          {SYS.map((s) => (
            <line
              key={s.l}
              x1={s.x}
              y1={s.y}
              x2={s.x}
              y2={s.y < 90 ? 78 : 102}
              className="stroke-line-strong"
              strokeWidth={1.2}
            />
          ))}
        </>
      )}
      {era === "micro" && (
        <>
          <line
            x1={20}
            y1={90}
            x2={300}
            y2={90}
            className="stroke-line-strong"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <text x={300} y={84} textAnchor="end" className="fill-muted text-[8px]">
            dumb pipe (HTTP, lightweight broker)
          </text>
          {SYS.map((s) => (
            <line
              key={s.l}
              x1={s.x}
              y1={s.y}
              x2={s.x}
              y2={90}
              className="stroke-line-strong"
              strokeWidth={1}
            />
          ))}
        </>
      )}
      {era === "today" && (
        <>
          {[
            [20, "API gateway", "fill-viz-data/20 stroke-viz-data"],
            [117, "event broker", "fill-viz-meta/20 stroke-viz-meta"],
            [214, "iPaaS / workflows", "fill-viz-compute/20 stroke-viz-compute"],
          ].map(([x, l, cls]) => (
            <g key={l as string}>
              <rect
                x={x as number}
                y={78}
                width={86}
                height={24}
                rx={5}
                className={cls as string}
              />
              <text
                x={(x as number) + 43}
                y={93}
                textAnchor="middle"
                className="fill-fg text-[8px]"
              >
                {l as string}
              </text>
            </g>
          ))}
          {SYS.map((s) => (
            <line
              key={s.l}
              x1={s.x}
              y1={s.y}
              x2={s.x}
              y2={s.y < 90 ? 78 : 102}
              className="stroke-line-strong"
              strokeWidth={1}
            />
          ))}
        </>
      )}
      {SYS.map((s) => (
        <g key={s.l}>
          <rect
            x={s.x - 28}
            y={s.y - 12}
            width={56}
            height={24}
            rx={5}
            className={cn(
              "fill-surface",
              era === "micro" || era === "today" ? "stroke-accent" : "stroke-line-strong",
            )}
            strokeWidth={era === "micro" || era === "today" ? 1.6 : 1}
          />
          <text x={s.x} y={s.y + 3.5} textAnchor="middle" className="fill-fg text-[9px]">
            {s.l}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* 1 ─ Four eras of integration ⭐ ----------------------------------------------------------------- */

export function FourEras() {
  const [s, set] = useSceneState<EsbState>();
  const f = ERAS[Math.min(s.frame ?? 0, ERAS.length - 1)];
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Four eras of integration"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper
            step={s.frame ?? 0}
            count={ERAS.length}
            onChange={(n) => set({ frame: n })}
            label={f.when}
          />
          <motion.div key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EraDiagram era={f.id} />
          </motion.div>
          <FrameCaption frameKey={f.id} title={f.title}>
            <p>{f.text}</p>
            <p className="text-accent mt-1 text-xs">{f.logic}</p>
          </FrameCaption>
        </div>
      }
    >
      <p>
        Large organisations have tried several answers to the sprawl from module 1. The question
        each era answers differently: where does the integration logic live?
      </p>
      <p>
        The <Term id="esb">enterprise service bus</Term> put it in one central product. In 2014
        James Lewis and Martin Fowler described the microservice reaction: &ldquo;smart endpoints
        and dumb pipes&rdquo;, against ESBs with &ldquo;sophisticated facilities for message
        routing, choreography, transformation, and applying business rules.&rdquo; (They also passed
        on Jim Webber&apos;s joke that ESB stands for &ldquo;Erroneous Spaghetti Box&rdquo;.)
      </p>
    </StepLayout>
  );
}

/* 2 ─ Trace one change ---------------------------------------------------------------------------- */

export function TraceChange() {
  const [s, set] = useSceneState<EsbState>();
  const t = TRACE[s.era];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Trace one change"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {ERAS.map((e) => (
              <button
                key={e.id}
                type="button"
                aria-pressed={s.era === e.id}
                onClick={() => set({ era: e.id })}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs",
                  s.era === e.id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {e.title}
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold">
            &ldquo;When an order is placed, also award loyalty points.&rdquo;
          </p>
          <div className="flex flex-col gap-1.5">
            {t.who.map((w, i) => (
              <motion.div
                key={s.era + i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="border-line bg-surface grid grid-cols-[1.5rem_1fr] rounded-lg border px-3 py-2 text-xs"
              >
                <span className="text-accent font-mono">{i + 1}</span>
                <span>{w}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-xs">Who has to act: {t.wait}</p>
          <motion.p
            key={s.era}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              t.tone === "good"
                ? "border-good/50 bg-good/10"
                : t.tone === "bad"
                  ? "border-bad/50 bg-bad/10"
                  : "border-line bg-surface",
            )}
          >
            {t.note}
          </motion.p>
          <p className="text-subtle text-[10px]">Illustrative.</p>
        </div>
      }
    >
      <p>
        Take one small business change and see who has to do the work in each era. The difference
        isn&apos;t mostly technology; it&apos;s Conway&apos;s law again. A central bus means a
        central team, and a central queue.
      </p>
      <p>
        Lewis and Fowler blamed many failed service-oriented projects on &ldquo;the tendency to hide
        complexity away in ESB&apos;s&rdquo;. Note that &ldquo;dumb pipes&rdquo; doesn&apos;t mean
        no broker: they named RabbitMQ as a fine choice, as long as the smarts stay in the services.
      </p>
    </StepLayout>
  );
}

/* 3 ─ API-led layers ------------------------------------------------------------------------------ */

const LAYERS: [string, string, string][] = [
  [
    "Experience APIs",
    "Shaped for one channel: the mobile app, the partner portal.",
    "GET /app/home",
  ],
  [
    "Process APIs",
    "Combine data across systems. MuleSoft calls them the verbs of the business.",
    "POST /orders/place",
  ],
  [
    "System APIs",
    "Unlock one system of record and hide its complexity. The nouns.",
    "GET /sap/customers/81",
  ],
];

export function ApiLayers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="API-led layers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {LAYERS.map(([t, d, ex], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                i === 0
                  ? "border-viz-add bg-viz-add/10"
                  : i === 1
                    ? "border-viz-meta bg-viz-meta/10"
                    : "border-viz-data bg-viz-data/10",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted font-mono text-[11px]">{ex}</p>
              </div>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">Example paths are illustrative.</p>
        </div>
      }
    >
      <p>
        One popular way to organise the API layer is MuleSoft&apos;s{" "}
        <Term id="api-led">API-led connectivity</Term>: system APIs unlock systems of record,
        process APIs compose them, experience APIs serve each channel. A new app reuses the lower
        layers instead of wiring into core systems again. (Salesforce bought MuleSoft in 2018 at an
        enterprise value of about $6.5 billion.)
      </p>
      <p>
        It&apos;s one vendor&apos;s method, not a standard, and three layers can become three times
        the services to run. The lasting idea is simpler: don&apos;t let every new app talk straight
        to your systems of record.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The platforms today ------------------------------------------------------------------------- */

const PLATFORMS: [string, string][] = [
  ["MuleSoft Anypoint", "Integrations, APIs and automation in one platform (Salesforce)."],
  [
    "Boomi",
    "One platform for integrating applications, APIs, data and AI agents. Independent of Dell since 2021.",
  ],
  ["Azure Integration Services", "Logic Apps, API Management, Service Bus and Event Grid."],
  [
    "Google Cloud",
    "Application Integration (its iPaaS, which absorbed Apigee Integration in 2024) and Apigee for API management.",
  ],
  [
    "AWS building blocks",
    "EventBridge to connect components with events, Step Functions for workflows, AppFlow for SaaS data.",
  ],
  ["Open source", "Apache Camel, Spring Integration, and brokers such as Kafka and RabbitMQ."],
];

export function Platforms() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="The platforms today"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {PLATFORMS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
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
        An <Term id="ipaas">integration platform as a service</Term> runs integration flows as a
        cloud service: connectors to SaaS products, mapping, workflows, monitoring. Some are sold as
        complete platforms; AWS offers building blocks instead.
      </p>
      <p>
        Between data centres, clouds and the edge, some organisations connect their event brokers
        into an <Term id="event-mesh">event mesh</Term>: &ldquo;a network of interconnected event
        brokers&rdquo;, in Solace&apos;s definition. Whichever you choose, the ESB lesson applies:
        keep business rules with the teams that own them.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Where should the logic live? ---------------------------------------------------------------- */

export function WhereLogic() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where should the logic live?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="where-logic"
            prompt="A bank's central integration team has a six-week queue. Pricing rules, eligibility checks and approval flows all live in its ESB, and every product change waits for it. What's the best long-term move?"
            options={[
              {
                id: "hire",
                label: "Hire more ESB developers to clear the queue",
                feedback: "Helps for a while, but every change still funnels through one team.",
              },
              {
                id: "move",
                label:
                  "Move business rules into the services that own them, gradually, and keep the bus for transport and routing",
                correct: true,
                feedback: "Smart endpoints, simpler pipes: the owners change their own rules.",
              },
              {
                id: "replace",
                label:
                  "Replace the ESB with a newer integration platform and move everything across as is",
                feedback:
                  "A new central product with the same logic in it recreates the same queue.",
              },
              {
                id: "rewrite",
                label: "Rewrite every system as microservices this year",
                feedback: "A big-bang rewrite risks everything; module 17 shows a safer path.",
              },
            ]}
            explanation="The bottleneck is where the logic lives and who owns it, not the product. Move rules to their owners step by step."
          />
        </div>
      }
    >
      <p>A common situation in large enterprises.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["The ESB era", "One central bus, and one central team."],
  ["Smart endpoints, dumb pipes", "Logic lives in services; pipes just carry messages."],
  ["API layers", "Don't let every app talk straight to systems of record."],
  ["Platforms, not bottlenecks", "Self-service connectivity run by platform teams."],
  ["Follow ownership", "Rules belong with the team that owns the domain."],
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
        That&apos;s integration between systems. The next chapter looks inside them: how to
        structure code and services so they can change.
      </p>
    </StepLayout>
  );
}
