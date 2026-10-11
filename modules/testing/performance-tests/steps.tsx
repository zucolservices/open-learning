"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { NEW_MS, OLD_MS, PEAK, at } from "./model";
import type { PerfState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Counter() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The café counter at 1 pm"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["10 am", 2, "Order taken almost instantly."],
            ["12 pm", 6, "A short wait."],
            [
              "1 pm",
              14,
              "The queue goes out of the door. Each new customer waits for everyone ahead.",
            ],
          ].map(([t, n, b], i) => (
            <motion.div
              key={t as string}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex items-center gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="w-12 font-mono">{t as string}</span>
              <span className="flex gap-0.5">
                {Array.from({ length: n as number }, (_, k) => (
                  <span
                    key={k}
                    className={cn(
                      "size-2.5 rounded-full",
                      i === 2 ? "bg-bad/70" : "bg-viz-data/60",
                    )}
                  />
                ))}
              </span>
              <span className="text-muted">{b as string}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        One barista can make a coffee a minute. At 30 customers an hour nobody waits; at 55
        there&apos;s a short queue; at 60 the queue never clears. Waiting time doesn&apos;t grow
        steadily: it explodes as the counter nears its limit.
      </p>
      <p>
        Servers behave the same way. <Term id="load-test">Load tests</Term> send realistic traffic
        to find out how fast a system responds and where that explosion starts, before real
        customers do.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Find the knee ⭐ ------------------------------------------------------------------------------ */

const W = 300;
const H = 150;
const MAXR = 120;
const MAXL = 1000;
const x = (r: number) => 30 + (r / MAXR) * (W - 40);
const y = (ms: number) => H - 20 - (Math.min(ms, MAXL) / MAXL) * (H - 30);

export function Knee() {
  const [s, set] = useSceneState<PerfState>();
  const svc = s.newBuild ? NEW_MS : OLD_MS;
  const pts = Array.from({ length: 61 }, (_, i) => at(i * 2, svc));
  const line = (k: "p50" | "p95" | "mean") =>
    pts.map((p, i) => `${i ? "L" : "M"}${x(p.rps).toFixed(1)} ${y(p[k]).toFixed(1)}`).join(" ");
  const now = at(s.rps, svc);
  const peak = at(PEAK, svc);
  const pass = peak.p95 <= s.budget && peak.errors === 0;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Ramp up the traffic and find the knee"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto w-full max-w-lg"
            role="img"
            aria-label="Latency against requests per second"
          >
            <line x1={30} y1={H - 20} x2={W - 10} y2={H - 20} className="stroke-line-strong" />
            <line x1={30} y1={10} x2={30} y2={H - 20} className="stroke-line-strong" />
            <line
              x1={30}
              y1={y(s.budget)}
              x2={W - 10}
              y2={y(s.budget)}
              className="stroke-bad"
              strokeDasharray="3 3"
              strokeWidth={0.8}
            />
            <text x={W - 12} y={y(s.budget) - 3} textAnchor="end" className="fill-bad text-[7px]">
              budget {s.budget} ms
            </text>
            <line
              x1={x(PEAK)}
              y1={10}
              x2={x(PEAK)}
              y2={H - 20}
              className="stroke-line"
              strokeDasharray="2 3"
            />
            <text x={x(PEAK) - 2} y={24} textAnchor="end" className="fill-muted text-[7px]">
              expected peak
            </text>
            <path
              d={line("mean")}
              className="stroke-viz-idle"
              fill="none"
              strokeWidth={1.2}
              strokeDasharray="4 2"
            />
            <path d={line("p50")} className="stroke-viz-data" fill="none" strokeWidth={1.4} />
            <path d={line("p95")} className="stroke-accent" fill="none" strokeWidth={1.8} />
            <circle cx={x(s.rps)} cy={y(now.p95)} r={3.5} className="fill-accent" />
            {[0, 40, 80, 120].map((r) => (
              <text
                key={r}
                x={x(r)}
                y={H - 8}
                textAnchor="middle"
                className="fill-muted text-[7px]"
              >
                {r}
              </text>
            ))}
            {[0, 500, 1000].map((ms) => (
              <text
                key={ms}
                x={26}
                y={y(ms) + 2}
                textAnchor="end"
                className="fill-muted text-[7px]"
              >
                {ms}
              </text>
            ))}
            <text x={W / 2} y={H - 1} textAnchor="middle" className="fill-muted text-[7px]">
              requests per second
            </text>
          </svg>
          <div className="flex flex-wrap gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="bg-accent h-0.5 w-4" /> p95
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-viz-data h-0.5 w-4" /> p50 (median)
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-viz-idle h-0.5 w-4" /> average
            </span>
          </div>
          <label className="text-xs">
            Traffic: <span className="font-mono">{s.rps} requests/s</span>
            <input
              type="range"
              min={10}
              max={MAXR}
              step={2}
              value={s.rps}
              onChange={(e) => set({ rps: Number(e.target.value) })}
              className="accent-accent w-full"
              aria-label="Requests per second"
            />
          </label>
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
            {[
              ["average", now.mean],
              ["p50", now.p50],
              ["p95", now.p95],
            ].map(([l, v]) => (
              <div key={l as string} className="border-line bg-surface rounded border px-1 py-1">
                <p className="text-muted">{l as string}</p>
                <p className="font-mono text-xs">
                  {(v as number) >= 5000 ? "timeout" : `${Math.round(v as number)} ms`}
                </p>
              </div>
            ))}
            <div
              className={cn(
                "rounded border px-1 py-1",
                now.errors ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted">errors</p>
              <p className="font-mono text-xs">{Math.round(now.errors * 100)}%</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs">
              p95 budget: <span className="font-mono">{s.budget} ms</span>
              <input
                type="range"
                min={100}
                max={600}
                step={50}
                value={s.budget}
                onChange={(e) => set({ budget: Number(e.target.value) })}
                className="accent-accent w-full"
                aria-label="p95 budget in milliseconds"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.newBuild}
                onChange={(e) => set({ newBuild: e.target.checked })}
                className="accent-accent"
              />
              New build: a slower query adds 2.5 ms per request
            </label>
          </div>
          <p className={cn("text-xs font-medium", pass ? "text-good" : "text-bad")}>
            CI check at the expected peak ({PEAK}/s): p95{" "}
            {peak.p95 >= 5000 ? "timeout" : `${Math.round(peak.p95)} ms`} → {pass ? "pass" : "fail"}
          </p>
          <p className="text-subtle text-[10px]">
            A simple queueing model; numbers are illustrative.
          </p>
        </div>
      }
    >
      <p>
        Drag the traffic up. Response times barely move at first, then bend sharply upwards near the
        server&apos;s limit: the <strong>knee</strong>. Past it, requests time out.
      </p>
      <p>
        Watch the gap between the average and the 95th <Term id="percentile">percentile</Term> (p95,
        the time 95% of requests beat). Then switch on the new build: only 2.5 ms slower per
        request, yet the check at the expected peak fails. That&apos;s a performance regression
        caught before release.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Kinds of test ------------------------------------------------------------------------------- */

const KINDS: Record<PerfState["kind"], { label: string; path: string; q: string }> = {
  load: {
    label: "Load",
    path: "M0 40 L20 15 L100 15 L120 40",
    q: "Does it meet its targets at the traffic we expect?",
  },
  stress: {
    label: "Stress",
    path: "M0 40 L120 2",
    q: "Where does it break, and does it fail gracefully?",
  },
  spike: {
    label: "Spike",
    path: "M0 35 L45 35 L50 3 L70 3 L75 35 L120 35",
    q: "Can it survive a sudden rush, like a sale starting?",
  },
  soak: {
    label: "Soak",
    path: "M0 40 L8 20 L112 20 L120 40",
    q: "Does it stay healthy for hours, or slowly leak memory?",
  },
};

export function Kinds() {
  const [s, set] = useSceneState<PerfState>();
  const k = KINDS[s.kind];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Load, stress, spike, soak"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.kind}
            onChange={(v) => set({ kind: v })}
            options={(Object.keys(KINDS) as PerfState["kind"][]).map((id) => [id, KINDS[id].label])}
          />
          <svg
            viewBox="0 0 120 44"
            className="border-line bg-surface mx-auto w-full max-w-md rounded-lg border p-2"
          >
            <motion.path
              key={s.kind}
              d={k.path}
              className="stroke-accent"
              fill="none"
              strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <p className="text-muted text-[10px]">Traffic over time</p>
          <p className="text-sm">{k.q}</p>
        </div>
      }
    >
      <p>
        Performance tests differ mainly in the shape of the traffic over time. Each answers a
        different question, and most teams start with a load test at the expected peak.
      </p>
      <p>
        Run them against an environment like production, warm it up first, and make sure the machine
        generating the load isn&apos;t itself the bottleneck.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Measuring honestly ---------------------------------------------------------------------------- */

export function Honest() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Measuring honestly"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Percentiles, not averages",
              "An average of 80 ms can hide 1 request in 100 taking 4 seconds. A page that makes 20 requests hits that often.",
            ],
            [
              "Coordinated omission",
              "If the load tool waits for each slow response before sending the next request, it sends less traffic exactly when the system struggles, and under-reports the pain. Gil Tene named this; tools now offer “open” models that keep sending at a fixed rate.",
            ],
            [
              "Budgets in CI",
              "Turn targets into pass/fail checks, e.g. in k6: thresholds: { http_req_duration: ['p(95)<200'] }.",
            ],
            [
              "Tools",
              "k6 (Grafana; version 2 in May 2026), Apache JMeter, Gatling, Locust, Artillery.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        For web pages, Google&apos;s Core Web Vitals measure what real users experience. Since March
        2024 responsiveness is measured by Interaction to Next Paint (INP); &ldquo;good&rdquo; is
        200 ms or less for at least 75% of visits.
      </p>
      <p>
        Speed matters to people: study after study finds that slower pages lose visitors, even if
        the exact figures quoted in marketing are shaky.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function PerfCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Reading the numbers"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="testing-perf"
            prompt="An API's average response time is 80 ms, but its p99 is 4 seconds. What does that tell you?"
            options={[
              {
                id: "fine",
                label: "It's fast: the average is what users feel",
                feedback: "The average hides the slow tail.",
              },
              {
                id: "tail",
                label:
                  "1 in 100 requests takes about 4 s or more, and users who make many requests will hit it often",
                correct: true,
                feedback: "Percentiles describe the experience; tails add up across requests.",
              },
              {
                id: "broken",
                label: "The measurement must be wrong",
                feedback:
                  "Long tails are common, often from queues, garbage collection or slow queries.",
              },
              {
                id: "half",
                label: "Half the requests take 4 s",
                feedback: "That would be the p50 (median).",
              },
            ]}
            explanation="Look at percentiles (p50, p95, p99), not averages. The slow tail is what people remember."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Latency explodes near capacity", "Find the knee before customers do."],
        ["Percentiles, not averages", "p95 and p99 describe the slow tail."],
        ["Different shapes, different questions", "Load, stress, spike, soak."],
        ["Budgets as tests", "Fail the build on a regression."],
        ["Measure honestly", "Open models, warm-up, realistic environments."],
      ]}
    >
      <p>Next: how to add tests to code that has none.</p>
    </WrapStep>
  );
}
