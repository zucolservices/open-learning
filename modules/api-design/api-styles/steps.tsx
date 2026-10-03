"use client";

import { motion } from "motion/react";
import { BellRing, BookOpen, ListChecks, PhoneCall } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SAMPLES, STYLES, TASKS, type Style, type Task } from "./model";
import type { StylesState } from "./state";

/* 1 ─ Four ways to order dinner ------------------------------------------------------------------- */

const WAYS = [
  {
    icon: BookOpen,
    t: "REST",
    d: "A menu of dishes, each with a number. You point at one and say what to do: show me, add, remove.",
  },
  {
    icon: PhoneCall,
    t: "RPC",
    d: "You phone the kitchen and say “make one masala dosa, medium spicy”: a named request with arguments.",
  },
  {
    icon: ListChecks,
    t: "GraphQL",
    d: "An order form where you tick exactly what you want on one plate, from anywhere on the menu.",
  },
  {
    icon: BellRing,
    t: "Events",
    d: "They hand you a buzzer. You don't keep asking; it goes off when your food is ready.",
  },
];

export function FourWays() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Four ways to order dinner"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {WAYS.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A restaurant can take orders in different ways, and each suits some customers better than
        others. APIs are the same: there are four common styles, and big systems use several at
        once.
      </p>
      <p>
        <Term id="rest">REST</Term> organises an API around things. <Term id="rpc">RPC</Term>{" "}
        (remote procedure call) around actions. <Term id="graphql">GraphQL</Term> lets the caller
        describe the data it wants. <Term id="webhook">Webhooks</Term> and other event APIs push
        news instead of waiting to be asked.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Same task, four styles ⭐ ------------------------------------------------------------------- */

export function SameTask() {
  const [s, set] = useSceneState<StylesState>();
  const sample = SAMPLES[s.task][s.style];
  return (
    <StepLayout
      eyebrow="Compare"
      title="Same task, four styles"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<Task>
              size="sm"
              value={s.task}
              onChange={(task) => set({ task })}
              options={[
                ["show", "Show an order"],
                ["notify", "Know when delivered"],
              ]}
            />
          </div>
          <p className="text-muted text-xs">{TASKS[s.task]}</p>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(STYLES) as Style[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.style === k}
                onClick={() => set({ style: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.style === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {STYLES[k].name}
              </button>
            ))}
          </div>
          <p className="text-xs">{STYLES[s.style].idea}</p>
          <Code>{sample.code}</Code>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Round trips", sample.trips],
              ["Who starts", sample.who],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <motion.p
            key={s.task + s.style}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            {sample.note}
          </motion.p>
          <p className="text-subtle text-[10px]">Illustrative requests for a food-delivery API.</p>
        </div>
      }
    >
      <p>
        Two jobs for a delivery app: draw the order screen, and know the moment the food arrives.
        Switch between styles and see how each handles them.
      </p>
      <p>
        No style wins both. Query styles (REST, RPC, GraphQL) answer questions; event styles tell
        you when something happens. That&apos;s why so many products offer a REST API <em>and</em>{" "}
        webhooks.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Who uses what ------------------------------------------------------------------------------- */

const USAGE: [string, number][] = [
  ["REST", 93],
  ["Webhooks", 50],
  ["WebSockets", 35],
  ["GraphQL", 33],
  ["SOAP", 25],
  ["gRPC", 14],
];

const HISTORY: [string, string][] = [
  ["2000", "Roy Fielding describes REST in his PhD dissertation"],
  ["2003", "SOAP 1.2 becomes a W3C Recommendation"],
  ["2007", "Jeff Lindsay popularises webhooks: “user defined callbacks made with HTTP POST”"],
  ["2015", "Facebook open-sources GraphQL; Google open-sources gRPC"],
  ["2024–25", "AI tools: the Model Context Protocol builds on JSON-RPC 2.0"],
];

export function WhoUses() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who uses what"
      stage={
        <div className="grid flex-1 content-center gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <p className="text-muted text-[10px]">
              Share of developers using each style (Postman, 2025)
            </p>
            {USAGE.map(([l, v], i) => (
              <div
                key={l}
                className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-2 text-xs"
              >
                <span>{l}</span>
                <div className="bg-surface-2 h-3 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v}%` }}
                    transition={{ delay: 0.06 * i }}
                    className="bg-accent/70 h-full rounded-full"
                  />
                </div>
                <span className="font-mono">{v}%</span>
              </div>
            ))}
            <p className="text-subtle text-[10px]">
              Over 5,700 respondents could pick several, so the bars add up to more than 100%.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            {HISTORY.map(([y, t]) => (
              <div key={y} className="grid grid-cols-[3.5rem_1fr] gap-2 text-xs">
                <span className="text-accent font-mono">{y}</span>
                <span className="border-line bg-surface rounded border px-2 py-1">{t}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        REST is the default for public APIs. Webhooks ride alongside it. GraphQL is common behind
        apps with many different screens; gRPC between a company&apos;s own services, where speed
        and strict types matter.
      </p>
      <p>
        Fielding meant something stricter by REST than many &ldquo;REST APIs&rdquo; deliver, as
        module 4 shows. In everyday use, &ldquo;REST&rdquo; means resources, URLs and HTTP methods.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Match the integration ----------------------------------------------------------------------- */

export function MatchIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Match the integration"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="match-style"
            prompt="Which style fits each integration best?"
            categories={[
              { id: "rest", label: "REST" },
              { id: "rpc", label: "gRPC" },
              { id: "graphql", label: "GraphQL" },
              { id: "events", label: "Webhooks" },
            ]}
            items={[
              {
                id: "partner",
                label: "A public API restaurants use to update their menus",
                category: "rest",
                why: "Public, simple, cacheable, every language has an HTTP client.",
              },
              {
                id: "docs",
                label: "Read-only open data for anyone to download",
                category: "rest",
                why: "Plain URLs work in a browser, a spreadsheet or a script.",
              },
              {
                id: "internal",
                label:
                  "Pricing and payments services calling each other thousands of times a second",
                category: "rpc",
                why: "Your own services: compact binary messages and strict types.",
              },
              {
                id: "app",
                label: "A mobile home screen pulling from orders, offers and ratings",
                category: "graphql",
                why: "One query, exactly the fields the screen needs.",
              },
              {
                id: "merchant",
                label: "Tell a merchant's server the instant a payment succeeds",
                category: "events",
                why: "Push, don't make them poll.",
              },
              {
                id: "refund",
                label: "Tell an accounting system each time a refund is issued",
                category: "events",
                why: "Something happened: send an event.",
              },
            ]}
            explanation="Public and simple: REST. Your own services at speed: gRPC. Many screens with different needs: GraphQL. Something happened: an event."
          />
        </div>
      }
    >
      <p>Real systems mix styles. Pick the best fit for each job.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["REST", "Resources and methods; the public default."],
  ["RPC", "Named calls; fast and typed between your own services."],
  ["GraphQL", "Client asks for exact fields; server guards the cost."],
  ["Events", "Push news when something happens."],
  ["Mix them", "Query styles answer questions; events announce change."],
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
        Chapter 2 designs a REST API properly, starting with its resources. Chapter 4 returns to
        gRPC, GraphQL and webhooks in depth.
      </p>
    </StepLayout>
  );
}
