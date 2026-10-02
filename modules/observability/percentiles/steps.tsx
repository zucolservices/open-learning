"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { fanOut, mean, percentile, samples, twoServers } from "./model";
import type { PctState } from "./state";

/* 1 ─ Where the average hides ⭐ ------------------------------------------------------------------ */

const BINS = [25, 50, 75, 100, 150, 200, 400, 800, 1600];

export function AverageHides() {
  const [s, set] = useSceneState<PctState>();
  const xs = samples(s.tail);
  const stats = [
    { k: "average", v: mean(xs), cls: "text-fg" },
    { k: "p50 (median)", v: percentile(xs, 50), cls: "text-fg" },
    { k: "p95", v: percentile(xs, 95), cls: "text-viz-compute" },
    { k: "p99", v: percentile(xs, 99), cls: "text-bad" },
  ];
  const counts = BINS.map((b, i) => xs.filter((x) => x > (i ? BINS[i - 1] : 0) && x <= b).length);
  const max = Math.max(...counts, 1);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Where the average hides"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.tail}
              onChange={(e) => set({ tail: e.target.checked })}
              className="accent-accent"
            />
            One request in twenty waits on a slow database call (about 20× slower)
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 font-mono text-[10px]">
              1,000 requests, by response time (ms)
            </p>
            <div className="flex h-32 items-end gap-1">
              {counts.map((c, i) => (
                <div
                  key={BINS[i]}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-0.5"
                >
                  <span className="text-muted font-mono text-[8px]">{c || ""}</span>
                  <motion.div
                    animate={{ height: `${Math.max(c ? 3 : 0, (c / max) * 100)}%` }}
                    className={cn(
                      "w-full rounded-t-sm",
                      BINS[i] > 400 ? "bg-bad/70" : "bg-viz-data/50",
                    )}
                  />
                  <span className="text-muted font-mono text-[8px]">≤{BINS[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stats.map((st) => (
              <div key={st.k} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{st.k}</p>
                <p className={cn("font-mono text-sm font-semibold", st.cls)}>
                  {Math.round(st.v)} ms
                </p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">Illustrative latencies.</p>
        </div>
      }
    >
      <p>
        Most requests take about 50 ms. Tick the box and one in twenty becomes twenty times slower.
        The average creeps up to about 100 ms, which still sounds fast. The 99th{" "}
        <Term id="percentile">percentile</Term> jumps past a second.
      </p>
      <p>
        p99 means 99% of requests were at least this fast and 1% were slower. For a busy app, 1% of
        requests is a lot of real people, often the busiest customers, who make the most requests.
      </p>
      <p>
        Google&apos;s SRE book uses the same example: &ldquo;although a typical request is served in
        about 50 ms, 5% of requests are 20 times slower!&rdquo; Percentiles &ldquo;allow you to
        consider the shape of the distribution&rdquo;, which an average flattens away.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The tail at scale --------------------------------------------------------------------------- */

export function TailAtScale() {
  const [s, set] = useSceneState<PctState>();
  const p = fanOut(s.servers);
  return (
    <StepLayout
      eyebrow="Explore"
      title="The tail at scale"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <label className="grid grid-cols-[9rem_1fr_3rem] items-center gap-2 text-xs">
            <span>Servers one request waits on</span>
            <input
              type="range"
              min={1}
              max={200}
              value={s.servers}
              onChange={(e) => set({ servers: Number(e.target.value) })}
              className="accent-accent"
              aria-label="Servers"
            />
            <span className="text-right font-mono">{s.servers}</span>
          </label>
          <div className="grid grid-cols-20 gap-0.5" aria-hidden>
            {Array.from({ length: 100 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-[2px]",
                  i < Math.round(p * 100) ? "bg-bad/70" : "bg-viz-data/30",
                )}
              />
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">User requests that take over a second</p>
            <p className={cn("font-mono text-2xl font-semibold", p > 0.3 && "text-bad")}>
              {(p * 100).toFixed(0)}%
            </p>
          </div>
          <p className="text-muted text-[10px]">
            Each server answers in about 10 ms, but 1 time in 100 takes a second. The user waits for
            the slowest one.
          </p>
        </div>
      }
    >
      <p>
        When one page needs answers from many servers at once, it&apos;s only as fast as the slowest
        of them, so <Term id="tail-latency">tail latency</Term> matters more the bigger the system.
        Rare slowness on each server becomes common slowness for users.
      </p>
      <p>
        Google&apos;s Jeff Dean and Luiz Barroso worked the numbers in &ldquo;The Tail at
        Scale&rdquo; (2013): if each server is slow one time in a hundred and a request waits on 100
        of them, 63% of user requests are slow. Drag the slider to 100 and see.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Never average percentiles ------------------------------------------------------------------- */

export function NeverAverage() {
  const [s, set] = useSceneState<PctState>();
  const r = twoServers(s.shareA / 100);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Never average percentiles"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <label className="grid grid-cols-[9rem_1fr_3rem] items-center gap-2 text-xs">
            <span>Traffic on the fast server</span>
            <input
              type="range"
              min={50}
              max={99}
              value={s.shareA}
              onChange={(e) => set({ shareA: Number(e.target.value) })}
              className="accent-accent"
              aria-label="Traffic on the fast server"
            />
            <span className="text-right font-mono">{s.shareA}%</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Fast server p99</p>
              <p className="font-mono text-sm font-semibold">{Math.round(r.p99a)} ms</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Slow server p99</p>
              <p className="font-mono text-sm font-semibold">{Math.round(r.p99b)} ms</p>
            </div>
            <div className="border-bad/50 bg-bad/10 rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Average of the two p99s</p>
              <p className="text-bad font-mono text-sm font-semibold">
                {Math.round(r.averaged)} ms
              </p>
            </div>
            <div className="border-good/50 bg-good/10 rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">True p99 of all requests</p>
              <p className="text-good font-mono text-sm font-semibold">
                {Math.round(r.trueP99)} ms
              </p>
            </div>
          </div>
          <p className="text-muted text-[10px]">
            Illustrative: 2,000 requests split between the servers.
          </p>
        </div>
      }
    >
      <p>
        Two servers: one fast, one slow. Move the traffic split. The average of their p99s ignores
        how many requests each one served, so it can be wildly wrong in either direction.
      </p>
      <p>
        The Prometheus docs are blunt: &ldquo;averaging the quantiles yields statistically
        nonsensical values.&rdquo; The fix is to combine the raw counts first, which is exactly what
        histograms allow: add up each bucket across servers, then work out the percentile. Finer
        buckets, or native histograms, make the answer more exact.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The calm average ---------------------------------------------------------------------------- */

export function CalmAverage() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The calm average"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="calm-average"
            prompt="The dashboard's average latency has sat at 180 ms all week. Support says some customers wait several seconds to pay. What do you look at next?"
            options={[
              {
                id: "fine",
                label: "Nothing: 180 ms is fast, so the complaints must be the customers' networks",
                feedback: "An average can stay calm while a slow minority suffers badly.",
              },
              {
                id: "tail",
                label: "The p99 and p99.9 latency, and the histogram of response times",
                correct: true,
                feedback:
                  "The tail shows what the slowest customers actually experience, and the histogram shows its shape.",
              },
              {
                id: "avgp99",
                label: "Average the p99 from each server to get one overall p99",
                feedback:
                  "Averaging percentiles gives a meaningless number; combine histogram buckets instead.",
              },
              {
                id: "cpu",
                label: "Average CPU across servers",
                feedback: "Another average; it says nothing about which requests were slow.",
              },
            ]}
            explanation="Report percentiles, not averages, for anything users wait on, and compute them from combined histograms."
          />
        </div>
      }
    >
      <p>When the numbers and the customers disagree, trust the customers and look at the tail.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Averages flatten", "A slow minority disappears into a calm mean."],
  ["Use percentiles", "p50 for typical, p99 and above for the worst real experiences."],
  ["Tails multiply", "Fan-out turns rare slowness into common slowness."],
  ["Combine counts, not percentiles", "Add histogram buckets, then compute."],
  ["Mind the buckets", "Their boundaries limit how precise a percentile can be."],
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
        Speed matters to users. In a 2009 experiment Google found that slowing results by 100 to 400
        ms cut searches by 0.2% to 0.6%, and the effect lingered after the delay was removed. A
        widely quoted figure that 100 ms cost Amazon 1% of sales comes from a 2006 talk by former
        Amazon engineer Greg Linden, not from Amazon itself.
      </p>
      <p>Next: the labels on metrics, and how one careless label can multiply the bill.</p>
    </StepLayout>
  );
}
