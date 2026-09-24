"use client";

import { motion } from "motion/react";
import { BarChart3, Bot, BrainCircuit, Database, Zap } from "lucide-react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 1 ─ One kitchen, many restaurants ⭐ ------------------------------------------------------------ */

const CONSUMERS = [
  {
    id: "bi",
    label: "Dashboards",
    icon: BarChart3,
    x: 18,
    y: 20,
    need: "Same numbers everywhere, answers in seconds",
  },
  {
    id: "train",
    label: "Model training",
    icon: BrainCircuit,
    x: 82,
    y: 20,
    need: "Years of history, exactly as it was at each moment",
  },
  {
    id: "serve",
    label: "Live predictions",
    icon: Zap,
    x: 18,
    y: 78,
    need: "One customer's features in milliseconds",
  },
  {
    id: "ai",
    label: "AI assistant",
    icon: Bot,
    x: 82,
    y: 78,
    need: "The right paragraphs from thousands of documents, respecting who's asking",
  },
] as const;

const ACTIVE: string[][] = [
  [],
  ["bi"],
  ["train"],
  ["serve"],
  ["ai"],
  ["bi", "train", "serve", "ai"],
];

function Scene({ stage }: { stage: number }) {
  const on = ACTIVE[stage] ?? [];
  return (
    <div className="flex h-full flex-col justify-center gap-3 pt-8 sm:pt-0">
      <div className="relative mx-auto aspect-square w-full max-w-md">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
          {CONSUMERS.map((c) => {
            const active = on.includes(c.id);
            return (
              <g key={c.id}>
                <line
                  x1={50}
                  y1={50}
                  x2={c.x}
                  y2={c.y}
                  stroke={active ? "var(--accent)" : "var(--line)"}
                  strokeWidth={active ? 0.8 : 0.4}
                />
                {active &&
                  [0, 1, 2].map((k) => (
                    <motion.circle
                      key={k}
                      r={1.2}
                      fill="var(--accent)"
                      initial={{ cx: 50, cy: 50, opacity: 0 }}
                      animate={{ cx: [50, c.x], cy: [50, c.y], opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1.6,
                        delay: k * 0.53,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}
              </g>
            );
          })}
        </svg>
        <div className="border-tier-gold/60 bg-surface shadow-card absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border px-4 py-3 text-center">
          <Database className="text-tier-gold size-6" />
          <p className="mt-1 text-sm font-semibold">Gold tables</p>
          <p className="text-muted text-[10px]">one governed copy</p>
        </div>
        {CONSUMERS.map((c) => {
          const active = on.includes(c.id);
          const Icon = c.icon;
          return (
            <motion.div
              key={c.id}
              animate={{ opacity: stage === 0 || active ? 1 : 0.35, scale: active ? 1.04 : 1 }}
              className={cn(
                "bg-surface absolute w-28 -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2 py-2 text-center sm:w-36",
                active ? "border-accent ring-accent/30 ring-2" : "border-line",
              )}
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <Icon className={cn("mx-auto size-4", active ? "text-accent" : "text-muted")} />
              <p className="mt-0.5 text-xs font-semibold">{c.label}</p>
              {active && stage < 5 && (
                <p className="text-muted mt-0.5 hidden text-[10px] leading-tight sm:block">
                  {c.need}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "kitchen",
    kicker: "The big idea",
    title: "One kitchen, many restaurants",
    body: (
      <>
        <p>
          A central kitchen can supply a café, a catering business and a delivery service. The
          ingredients are the same; what each one needs (speed, portions, packaging) is not.
        </p>
        <p>
          The lakehouse&apos;s gold tables are the kitchen. Four very different customers depend on
          them.
        </p>
      </>
    ),
  },
  {
    id: "bi",
    kicker: "Customer 1",
    title: "Dashboards need consistent numbers",
    body: (
      <p>
        Finance, marketing and operations all ask &ldquo;what was revenue yesterday?&rdquo;. They
        must get the same answer, within seconds, from whatever <Term id="bi">BI</Term> tool they
        use.
      </p>
    ),
  },
  {
    id: "train",
    kicker: "Customer 2",
    title: "Training needs history as it was",
    body: (
      <p>
        A churn model learns from years of past customers. Each example must use the data as it
        looked <em>at that moment</em>, not as it looks today. Big scans, not fast lookups.
      </p>
    ),
  },
  {
    id: "serve",
    kicker: "Customer 3",
    title: "Live predictions need milliseconds",
    body: (
      <p>
        At checkout, the app asks the model whether to offer a discount. It needs one
        customer&apos;s features in a few milliseconds. Scanning Parquet files is far too slow for
        that, so features are copied to a fast key-value store.
      </p>
    ),
  },
  {
    id: "ai",
    kicker: "Customer 4",
    title: "AI assistants need the right paragraphs",
    body: (
      <p>
        A support assistant answers questions from policies and past tickets. It has to find the few
        relevant passages among thousands, keep up when documents change, and never show someone a
        document they aren&apos;t allowed to read.
      </p>
    ),
  },
  {
    id: "one-copy",
    kicker: "The point",
    title: "One source, several serving layers",
    body: (
      <>
        <p>
          All four read from the same governed tables. Some are served directly; others through a
          layer built for them: a semantic layer, an online store, a vector index.
        </p>
        <p>Those layers are copies you rebuild from gold, not new sources of truth.</p>
      </>
    ),
  },
];

export function OneKitchen() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            One copy of data, four kinds of customers
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            What dashboards, models and AI assistants each need from the lakehouse.
          </p>
        </div>
      }
    />
  );
}
