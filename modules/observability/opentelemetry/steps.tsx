"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BACKENDS, FRAMES, type Backend, type Part } from "./model";
import type { OtelState } from "./state";

/* 1 ─ One standard instead of many ---------------------------------------------------------------- */

const HISTORY: [string, string][] = [
  [
    "Before",
    "Each vendor shipped its own agent and libraries. Switching vendors meant re-instrumenting every service.",
  ],
  [
    "2016–2018",
    "Two open standards compete: OpenTracing (a tracing API) and OpenCensus (from Google, traces and metrics).",
  ],
  ["2019", "They merge into OpenTelemetry."],
  ["2021", "Accepted as a CNCF incubating project."],
  ["May 2026", "Graduates in the CNCF, with the second-highest project velocity after Kubernetes."],
];

export function OneStandard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One standard instead of many"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {HISTORY.map(([y, t], i) => (
            <motion.div
              key={y}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="grid grid-cols-[5.5rem_1fr] items-start gap-3"
            >
              <span className="text-accent font-mono text-xs">{y}</span>
              <span className="border-line bg-surface rounded-lg border px-3 py-2 text-sm">
                {t}
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Code doesn&apos;t produce telemetry by magic. Someone has to{" "}
        <Term id="instrumentation">instrument</Term> it: add the calls that record spans, metrics
        and logs.
      </p>
      <p>
        For years every monitoring vendor had its own way, so the choice of vendor was baked into
        your code. <Term id="opentelemetry">OpenTelemetry</Term> fixed that with one open,
        vendor-neutral standard, backed by every major vendor and cloud. It now has more than 12,000
        contributors from over 2,800 companies.
      </p>
    </StepLayout>
  );
}

/* 2 ─ From code to backend ⭐ --------------------------------------------------------------------- */

const BOXES: { id: Part; label: string; x: number; w: number }[] = [
  { id: "code", label: "your code", x: 6, w: 60 },
  { id: "api", label: "API", x: 6, w: 60 },
  { id: "sdk", label: "SDK", x: 6, w: 60 },
  { id: "otlp", label: "OTLP", x: 86, w: 44 },
  { id: "collector", label: "Collector", x: 150, w: 82 },
  { id: "backend", label: "backends", x: 252, w: 62 },
];

function Pipeline({ part }: { part: Part }) {
  const on = (id: Part) => id === part;
  return (
    <svg viewBox="0 0 320 120" className="mx-auto w-full max-w-xl" fill="none">
      <rect
        x={2}
        y={8}
        width={68}
        height={104}
        rx={6}
        className="fill-surface-2/40 stroke-line-strong"
        strokeDasharray="3 3"
      />
      <text x={8} y={20} className="fill-muted font-mono text-[7px]">
        app
      </text>
      {(["code", "api", "sdk"] as Part[]).map((id, i) => (
        <g key={id}>
          <rect
            x={8}
            y={28 + i * 27}
            width={56}
            height={20}
            rx={4}
            className={on(id) ? "fill-accent/20 stroke-accent" : "fill-surface stroke-line-strong"}
            strokeWidth={on(id) ? 1.6 : 1}
          />
          <text
            x={36}
            y={41 + i * 27}
            textAnchor="middle"
            className="fill-fg font-mono text-[7.5px]"
          >
            {BOXES.find((b) => b.id === id)!.label}
          </text>
        </g>
      ))}
      <path d="M70 92H86" className="stroke-line-strong" />
      <rect
        x={86}
        y={82}
        width={44}
        height={20}
        rx={10}
        className={on("otlp") ? "fill-accent/20 stroke-accent" : "fill-surface stroke-line-strong"}
        strokeWidth={on("otlp") ? 1.6 : 1}
      />
      <text x={108} y={95} textAnchor="middle" className="fill-fg font-mono text-[7.5px]">
        OTLP
      </text>
      <path d="M130 92H150" className="stroke-line-strong" />
      <rect
        x={150}
        y={30}
        width={82}
        height={80}
        rx={6}
        className={
          on("collector") ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"
        }
        strokeWidth={on("collector") ? 1.6 : 1}
      />
      <text x={191} y={42} textAnchor="middle" className="fill-fg font-mono text-[7.5px]">
        Collector
      </text>
      {["receivers", "processors", "exporters"].map((l, i) => (
        <g key={l}>
          <rect
            x={158}
            y={50 + i * 19}
            width={66}
            height={14}
            rx={3}
            className="fill-surface-2/60 stroke-line"
          />
          <text
            x={191}
            y={60 + i * 19}
            textAnchor="middle"
            className="fill-muted font-mono text-[6.5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <path d="M232 70H252" className="stroke-line-strong" />
      {["metrics", "traces", "logs"].map((l, i) => (
        <g key={l}>
          <rect
            x={252}
            y={44 + i * 22}
            width={62}
            height={16}
            rx={4}
            className={
              on("backend") ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"
            }
          />
          <text
            x={283}
            y={55 + i * 22}
            textAnchor="middle"
            className="fill-fg font-mono text-[6.5px]"
          >
            {l} store
          </text>
        </g>
      ))}
      {part !== "code" && part !== "api" && part !== "sdk" && (
        <motion.circle
          key={part}
          cx={64}
          cy={92}
          r={3}
          className="fill-accent"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: (part === "otlp" ? 108 : part === "collector" ? 191 : 249) - 64,
            y: part === "backend" ? -40 : 0,
          }}
          transition={{ duration: 0.8 }}
        />
      )}
    </svg>
  );
}

export function CodeToBackend() {
  const [s, set] = useSceneState<OtelState>();
  const f = FRAMES[s.frame];
  const last = s.frame === FRAMES.length - 1;
  return (
    <StepLayout
      eyebrow="Step-through"
      title="From code to backend"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Pipeline part={f.part} />
          {last && (
            <div className="flex flex-col gap-2">
              <div>
                <Segmented<Backend>
                  size="sm"
                  value={s.backend}
                  onChange={(backend) => set({ backend })}
                  options={[
                    ["oss", "Open source"],
                    ["vendor", "Vendor"],
                    ["cloud", "Cloud"],
                  ]}
                />
              </div>
              <Code>{`# collector.yaml (only this changes)\n${BACKENDS[s.backend].config}`}</Code>
              <p className="text-good text-xs">Lines of application code changed: 0</p>
            </div>
          )}
          <Stepper step={s.frame} count={FRAMES.length} onChange={(frame) => set({ frame })} />
          <FrameCaption frameKey={s.frame} title={f.title} tone={last ? "good" : undefined}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Follow one span from the line of code that creates it to the tool where you&apos;ll look at
        it. At the last frame, switch backends and watch what changes.
      </p>
      <p>
        The split between API and SDK is the clever part: libraries depend only on the API, so they
        can ship instrumentation without forcing any choice on you. <Term id="otlp">OTLP</Term>{" "}
        carries every signal the same way, and the <Term id="otel-collector">Collector</Term> is
        where you route, filter and clean telemetry before it costs money.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Automatic and by hand ----------------------------------------------------------------------- */

const AUTO_SPANS: [string, number, number, number][] = [
  ["POST /pay", 0, 100, 0],
  ["SELECT accounts", 6, 10, 1],
  ["POST bank-api/collect", 20, 70, 1],
];
const MANUAL_SPANS: [string, number, number, number][] = [
  ["POST /pay", 0, 100, 0],
  ["fraud.check  rule=velocity", 4, 12, 1],
  ["SELECT accounts", 17, 9, 1],
  ["payment.authorise  bank=Bank C", 28, 64, 1],
  ["POST bank-api/collect", 30, 60, 2],
];

export function AutoAndManual() {
  const [s, set] = useSceneState<OtelState>();
  const spans = s.manual ? MANUAL_SPANS : AUTO_SPANS;
  return (
    <StepLayout
      eyebrow="Compare"
      title="Automatic, and by hand"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.manual}
              onChange={(e) => set({ manual: e.target.checked })}
              className="accent-accent"
            />
            Add two spans and a few attributes by hand
          </label>
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border px-3 py-3">
            {spans.map(([n, start, dur, depth]) => {
              const mine = n.includes("=");
              return (
                <motion.div
                  key={n}
                  layout
                  className="grid grid-cols-[11rem_1fr] items-center gap-2"
                >
                  <span
                    className={cn("truncate font-mono text-[10px]", mine && "text-accent")}
                    style={{ paddingLeft: depth * 8 }}
                  >
                    {n}
                  </span>
                  <div className="relative h-3">
                    <div
                      className={cn(
                        "absolute inset-y-0 rounded-sm",
                        mine ? "bg-accent/60" : "bg-viz-meta/45",
                      )}
                      style={{ left: `${start}%`, width: `${dur}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Code>
            {s.manual
              ? `with tracer.start_as_current_span("payment.authorise") as span:
    span.set_attribute("bank", bank.name)
    result = bank_api.collect(order)`
              : `# nothing in your code: the agent instruments
# the web framework, DB driver and HTTP client
opentelemetry-instrument python app.py`}
          </Code>
        </div>
      }
    >
      <p>
        <Term id="auto-instrumentation">Zero-code instrumentation</Term> (an agent for Java, a
        launcher for Python, packages for .NET, Node and others) records the plumbing automatically:
        incoming requests, database queries, outgoing calls.
      </p>
      <p>
        It can&apos;t know your business. Which fraud rule ran? Which bank handled the payment? A
        few lines of code-based instrumentation add the spans and attributes you&apos;ll actually
        search by at 3 a.m. Most teams start automatic and add the rest by hand.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Automatic or by hand? ----------------------------------------------------------------------- */

export function WhoAddsIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Automatic or by hand?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="auto-or-manual"
            prompt="Will zero-code instrumentation give you each of these, or do you need to add it in code?"
            categories={[
              { id: "auto", label: "Automatic" },
              { id: "code", label: "Add in code" },
            ]}
            items={[
              {
                id: "http",
                label: "A span for every incoming HTTP request",
                category: "auto",
                why: "Web frameworks are covered by the standard instrumentation libraries.",
              },
              {
                id: "db",
                label: "A span for each database query",
                category: "auto",
                why: "Database drivers are instrumented automatically.",
              },
              {
                id: "out",
                label: "A span for the call to the bank's API",
                category: "auto",
                why: "Outgoing HTTP client calls are instrumented, and trace context is passed along.",
              },
              {
                id: "bank",
                label: "Which bank handled this payment",
                category: "code",
                why: "Only your code knows; add it as an attribute.",
              },
              {
                id: "rule",
                label: "Which fraud rule rejected the payment",
                category: "code",
                why: "Business logic needs its own span or attribute.",
              },
              {
                id: "count",
                label: "A counter of refunds approved by policy",
                category: "code",
                why: "A business metric you define and increment yourself.",
              },
            ]}
            explanation="Automatic instrumentation covers the plumbing every app shares; your code adds the business context that makes telemetry searchable."
          />
        </div>
      }
    >
      <p>The plumbing comes free; the meaning you add yourself.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Instrument once", "OpenTelemetry works with any backend."],
  ["API vs SDK", "Libraries call the API; the app chooses sampling and export."],
  ["OTLP and the Collector", "One protocol; a switchboard to route, filter and clean."],
  ["Automatic plus manual", "Free plumbing spans, plus your business context."],
  ["Name your service", "Always set service.name, or it shows up as unknown_service."],
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
        Maturity varies by signal and language: traces and metrics are stable in the major
        languages, logs only in some (Java, .NET, C++, PHP), and profiles reached public alpha in
        March 2026. OBI, an eBPF-based instrumentation donated from Grafana&apos;s Beyla in 2025,
        can trace Linux processes without touching their code at all.
      </p>
      <p>
        On Kubernetes, the OpenTelemetry Operator runs Collectors and can inject zero-code
        instrumentation into pods. Next chapter: metrics, starting with their types.
      </p>
    </StepLayout>
  );
}
