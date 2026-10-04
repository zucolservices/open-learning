"use client";

import { motion } from "motion/react";
import { Combine, Languages, Signpost, Split } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ORDER, STAGES, canonical, direct, simulate, type Stage } from "./model";
import type { RtState } from "./state";

/* 1 ─ The sorting office -------------------------------------------------------------------------- */

const JOBS = [
  { icon: Signpost, t: "Route", d: "Look at the PIN code, pick a van." },
  { icon: Split, t: "Split", d: "One sack of mixed mail becomes many letters." },
  { icon: Combine, t: "Combine", d: "Hold a family's parcels until all have arrived." },
  { icon: Languages, t: "Translate", d: "Rewrite a foreign address in the local format." },
];

export function SortingOffice() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The sorting office"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {JOBS.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex gap-3 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Between the post box and your door, a sorting office does four things to mail: routes it,
        splits sacks, holds parcels until a set is complete, and fixes addresses. Nobody writing a
        letter thinks about any of it.
      </p>
      <p>
        Integration flows need the same jobs. Hohpe and Woolf named each one, and frameworks such as
        Apache Camel (since 2007) and Spring Integration implement &ldquo;most of the Enterprise
        Integration Patterns&rdquo;, as Camel&apos;s docs put it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build an order pipeline ⭐ ------------------------------------------------------------------ */

export function Pipeline() {
  const [s, set] = useSceneState<RtState>();
  const on = s.on ?? [];
  const r = simulate(on);
  const toggle = (st: Stage) =>
    set({ on: on.includes(st) ? on.filter((x) => x !== st) : [...on, st] });
  return (
    <StepLayout
      eyebrow="Build"
      title="Build an order pipeline"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1">
            <span className="border-viz-data bg-viz-data/10 rounded-md border px-2 py-1 text-[11px]">
              orders in
            </span>
            {ORDER.map((st) => (
              <span key={st} className="flex items-center gap-1">
                <span className="text-muted">→</span>
                <button
                  type="button"
                  aria-pressed={on.includes(st)}
                  onClick={() => toggle(st)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-[11px]",
                    on.includes(st)
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line text-muted hover:bg-surface-2 border-dashed",
                  )}
                >
                  {STAGES[st].name}
                </button>
              </span>
            ))}
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {ORDER.map((st) => (
              <p
                key={st}
                className={cn("text-[11px]", on.includes(st) ? "text-fg" : "text-subtle")}
              >
                <span className="font-semibold">{STAGES[st].name}:</span> {STAGES[st].does}
              </p>
            ))}
          </div>
          <div className="bg-surface-2 rounded-xl px-3 py-2 font-mono text-[11px] leading-relaxed">
            <p className="text-muted">output</p>
            {r.out.map((o) => (
              <motion.p key={o} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {o}
              </motion.p>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {r.issues.length === 0 ? (
              <p className="border-good/50 bg-good/10 rounded-xl border px-4 py-3 text-sm">
                Every item reaches the right warehouse with its delivery slot, and each customer
                gets one confirmation.
              </p>
            ) : (
              r.issues.map((i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-1.5 text-xs"
                >
                  {i}
                </motion.p>
              ))
            )}
          </div>
          <p className="text-subtle text-[10px]">An illustrative online shop.</p>
        </div>
      }
    >
      <p>
        Orders arrive from the website (JSON) and a partner (CSV), each mixing items stocked in
        different warehouses. Switch on pipeline stages until every item gets where it should, with
        what it needs.
      </p>
      <p>
        You&apos;re using five named patterns: a <Term id="normalizer">normalizer</Term>, a{" "}
        <Term id="splitter">splitter</Term>, a{" "}
        <Term id="content-based-router">content-based router</Term>, a{" "}
        <Term id="content-enricher">content enricher</Term> and an{" "}
        <Term id="aggregator">aggregator</Term>. The aggregator&apos;s hard question is when a set
        is complete: what if one warehouse never answers?
      </p>
    </StepLayout>
  );
}

/* 3 ─ One common format? -------------------------------------------------------------------------- */

export function Canonical() {
  const [s, set] = useSceneState<RtState>();
  const n = s.apps ?? 6;
  const max = direct(12);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One common format?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">applications</span>
            <input
              type="range"
              min={2}
              max={12}
              value={n}
              onChange={(e) => set({ apps: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-6 text-right font-mono">{n}</span>
          </label>
          {[
            ["Translate between every pair", direct(n), "bg-viz-remove"],
            ["Translate to and from one canonical model", canonical(n), "bg-viz-add"],
          ].map(([t, v, cls]) => (
            <div key={t as string}>
              <div className="flex justify-between text-xs">
                <span>{t as string}</span>
                <span className="font-mono font-semibold">{v as number} translators</span>
              </div>
              <div className="bg-surface-2 mt-1 h-3 rounded-full">
                <motion.div
                  className={cn("h-full rounded-full", cls as string)}
                  animate={{ width: `${Math.max(2, ((v as number) / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-muted text-xs">
            {n < 3
              ? "With two applications, the common model costs more."
              : n === 3
                ? "With three, it's a draw."
                : `With ${n}, the common model saves ${direct(n) - canonical(n)} translators.`}
          </p>
        </div>
      }
    >
      <p>
        A <Term id="message-translator">message translator</Term> converts one format into another.
        Give every pair of applications its own translators and the count grows fast: Hohpe and
        Woolf&apos;s example is 6 applications needing 30.
      </p>
      <p>
        A <Term id="canonical-data-model">canonical data model</Term> is a common format independent
        of any one application: each translates only to and from it. Six applications then need 12.
        It only pays off as the number grows, and agreeing one model across a whole company has the
        same trouble as the one Customer model in module 3; many teams keep a canonical format per
        domain instead.
      </p>
    </StepLayout>
  );
}

/* 4 ─ More patterns ------------------------------------------------------------------------------- */

const MORE: [string, string][] = [
  [
    "Message filter",
    "Drops messages a receiver doesn't want. (A content filter, by contrast, removes fields from a message.)",
  ],
  [
    "Recipient list",
    "Sends one message to a list of recipients worked out per message, like an email's To line.",
  ],
  ["Resequencer", "Buffers out-of-order messages and releases them in the right order."],
  [
    "Claim check",
    "Stores a big payload and passes only a reference. The SQS Extended Client does this with S3: SQS messages max out at 1 MiB, the payload can be up to 2 GB.",
  ],
  [
    "Wire tap",
    "Copies every message on a channel to a second channel, for monitoring or auditing.",
  ],
];

export function MorePatterns() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="More patterns"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {MORE.map(([t, d], i) => (
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
          <Code>{`from("jms:orders")
  .split(xpath("/order/item"))
  .choice()
    .when(xpath("/item[@type='book']")).to("jms:books")
    .otherwise().to("jms:general");`}</Code>
        </div>
      }
    >
      <p>
        The catalogue has dozens more. These five turn up constantly. The code shows how directly a
        framework expresses them: an Apache Camel route that splits orders and routes items by type.
      </p>
      <p>
        Most cloud integration services (Azure Logic Apps, AWS Step Functions and EventBridge,
        Google Application Integration) offer the same building blocks: routing rules, loops over
        items and data mappings.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which pattern? ------------------------------------------------------------------------------ */

export function WhichPattern() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which pattern?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-pattern"
            prompt="Which pattern does each job?"
            categories={[
              { id: "router", label: "Content-based router" },
              { id: "splitter", label: "Splitter" },
              { id: "aggregator", label: "Aggregator" },
              { id: "claim", label: "Claim check" },
            ]}
            items={[
              {
                id: "claims",
                label:
                  "Insurance claims over ₹1 lakh go to senior assessors, the rest to the general queue",
                category: "router",
                why: "Destination chosen by the message's content.",
              },
              {
                id: "batch",
                label: "A batch of 500 salary payments becomes 500 separate payment messages",
                category: "splitter",
                why: "One composite message into many.",
              },
              {
                id: "quotes",
                label: "Wait for all three supplier quotes, then send the cheapest onwards",
                category: "aggregator",
                why: "Collect related messages until the set is complete.",
              },
              {
                id: "scan",
                label:
                  "A 40 MB scanned document is stored and only a link travels through the queue",
                category: "claim",
                why: "Keep the payload aside; pass a reference.",
              },
            ]}
            explanation="Route by content, split composites, aggregate related parts, and check big payloads into storage."
          />
        </div>
      }
    >
      <p>Name the pattern.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Route", "Content-based routers, filters, recipient lists."],
  ["Split and combine", "Splitters, aggregators, resequencers."],
  ["Transform", "Translators, normalizers, enrichers, content filters."],
  [
    "Canonical model, with care",
    "Fewer translators as systems multiply; hard to agree company-wide.",
  ],
  ["Frameworks speak EIP", "Camel, Spring Integration, cloud workflow tools."],
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
        Pipelines like this move messages. Next: who&apos;s in charge when a business process spans
        several systems: a conductor, or everyone reacting to everyone else?
      </p>
    </StepLayout>
  );
}
