"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ALMANAC, BASE, FIXES, T } from "./model";
import type { VitalsState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Restaurant() {
  return (
    <StepLayout
      eyebrow="Story"
      title="How a restaurant feels"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["How long until food arrives?", "Loading: Largest Contentful Paint (LCP)."],
            [
              "Does the waiter respond when you wave?",
              "Responsiveness: Interaction to Next Paint (INP).",
            ],
            [
              "Does the table wobble and spill your drink?",
              "Visual stability: Cumulative Layout Shift (CLS).",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        You judge a restaurant by how long the food takes, whether staff notice you, and whether the
        table wobbles. Nobody asks how efficient the kitchen&apos;s software is.
      </p>
      <p>
        <Term id="core-web-vitals">Core Web Vitals</Term> measure web pages the same way: by what
        real visitors feel. They turn &ldquo;it feels slow&rdquo; into numbers you can improve.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix ⭐ --------------------------------------------------------------------------------------- */

function Gauge({ metric, value }: { metric: keyof typeof T; value: number }) {
  const t = T[metric];
  const rating = value <= t.good ? "good" : value <= t.poor ? "ni" : "poor";
  const shown =
    metric === "cls" ? value.toFixed(2) : metric === "lcp" ? value.toFixed(1) : Math.round(value);
  return (
    <div
      className={cn(
        "rounded-lg border px-2 py-2 text-center",
        rating === "good"
          ? "border-good/50 bg-good/10"
          : rating === "ni"
            ? "border-viz-compute bg-viz-compute/15"
            : "border-bad/50 bg-bad/10",
      )}
    >
      <p className="text-muted text-[10px]">{t.label}</p>
      <motion.p
        key={String(shown)}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        className="font-mono text-lg font-semibold"
      >
        {shown}
        {t.unit}
      </motion.p>
      <p className="text-[10px]">
        {rating === "good" ? "Good" : rating === "ni" ? "Needs improvement" : "Poor"}
      </p>
    </div>
  );
}

export function FixVitals() {
  const [s, set] = useSceneState<VitalsState>();
  const v = { ...BASE };
  for (const f of FIXES) if (s.fixed.includes(f.id)) v[f.metric] += f.delta;
  const toggle = (id: string) =>
    set({ fixed: s.fixed.includes(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  const allGood = v.lcp <= 2.5 && v.inp <= 200 && v.cls <= 0.1;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Get all three vitals to good"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Gauge metric="lcp" value={v.lcp} />
            <Gauge metric="inp" value={v.inp} />
            <Gauge metric="cls" value={v.cls} />
          </div>
          <div className="grid gap-1">
            {FIXES.map((f) => {
              const on = s.fixed.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(f.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    on ? "border-good/50 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <span className="text-muted mr-1.5 font-mono text-[10px] uppercase">
                    {f.metric}
                  </span>
                  {on ? <span>{f.fix}</span> : <span>{f.problem}</span>}
                </button>
              );
            })}
          </div>
          <p className={cn("text-xs", allGood ? "text-good" : "text-muted")}>
            {allGood
              ? "All three in the good range for this simulated page. Real pages are judged on the 75th percentile of real visits."
              : "Click a problem to fix it. Values stand for the 75th percentile of visits (illustrative)."}
          </p>
        </div>
      }
    >
      <p>
        A shop page fails all three vitals. Each problem below is common on real sites. Fix them and
        watch which metric each one moves.
      </p>
      <p>Good means: LCP within 2.5 seconds, INP within 200 milliseconds, CLS at 0.1 or less.</p>
    </StepLayout>
  );
}

/* 3 ─ Thresholds ----------------------------------------------------------------------------------- */

export function Thresholds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How the web is doing"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="text-subtle flex justify-end gap-4 text-[10px]">
            <span>mobile</span>
            <span>desktop</span>
          </div>
          {ALMANAC.map(([l, m, d], i) => (
            <div key={l} className="text-xs">
              <div className="flex justify-between">
                <span>{l}</span>
                <span className="font-mono">
                  {m}% · {d}%
                </span>
              </div>
              <div className="mt-0.5 grid grid-cols-2 gap-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m}%` }}
                  transition={{ delay: 0.05 * i }}
                  className="bg-viz-data/60 h-2 rounded"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d}%` }}
                  transition={{ delay: 0.05 * i }}
                  className="bg-viz-meta/60 h-2 rounded"
                />
              </div>
            </div>
          ))}
          <p className="text-subtle mt-1 text-[10px]">
            Share of sites with good scores. HTTP Archive Web Almanac 2025 (Chrome field data).
          </p>
        </div>
      }
    >
      <p>
        Each metric is judged at the <Term id="p75">75th percentile</Term> of real visits, split by
        mobile and desktop, so three out of four visits get that experience or better. INP replaced
        the older First Input Delay on 12 March 2024.
      </p>
      <p>
        In 2025, fewer than half of mobile sites passed all three. Loading on mobile is the hardest:
        the largest element is usually an image, and about one page in six lazy-loads it by mistake.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Lab and field -------------------------------------------------------------------------------- */

export function LabField() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Lab tests and real users"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Lab data</p>
            <p className="text-muted">
              One controlled load: Lighthouse, the DevTools Performance panel. Great for debugging;
              it can&apos;t measure INP, because nobody clicks.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Field data</p>
            <p className="text-muted">
              Real visitors on real devices. Chrome&apos;s public dataset (CrUX) covers Chrome users
              only; measure everyone with the open-source web-vitals library.
            </p>
          </div>
          <div className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs sm:col-span-2">
            <p className="font-semibold">Browser support (October 2026)</p>
            <p className="text-muted">
              LCP and INP can be measured in Chrome, Firefox and Safari since late 2025. CLS still
              only in Chromium browsers.
            </p>
          </div>
        </div>
      }
    >
      <p>
        PageSpeed Insights shows both side by side. When they disagree, trust the field: it&apos;s
        what people actually experienced, on cheap phones and slow networks you&apos;ll never test
        on.
      </p>
      <p>Use the lab to find out why.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function VitalsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which vital does it hurt?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-vitals"
            prompt="Which Core Web Vital does each problem mainly hurt?"
            categories={[
              { id: "lcp", label: "LCP" },
              { id: "inp", label: "INP" },
              { id: "cls", label: "CLS" },
            ]}
            items={[
              {
                id: "hero",
                label: "A slow-loading hero image",
                category: "lcp",
                why: "It's usually the largest element.",
              },
              {
                id: "click",
                label: "A menu that takes half a second to open after a tap",
                category: "inp",
                why: "Slow response to interaction.",
              },
              {
                id: "ad",
                label: "An advert that pushes the text down as it loads",
                category: "cls",
                why: "Unexpected movement.",
              },
              {
                id: "font",
                label: "A web font swap that makes the text reflow",
                category: "cls",
                why: "Layout moves when the font changes size.",
              },
              {
                id: "server",
                label: "A server that takes 2 seconds to send the HTML",
                category: "lcp",
                why: "Everything starts late.",
              },
            ]}
            explanation="LCP: how soon the main content appears. INP: how quickly the page reacts. CLS: how much things jump."
          />
        </div>
      }
    >
      <p>Sort each problem.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["LCP ≤ 2.5 s", "Main content appears quickly."],
        ["INP ≤ 200 ms", "The page reacts quickly."],
        ["CLS ≤ 0.1", "Nothing jumps."],
        ["75th percentile", "Of real visits, mobile and desktop."],
        ["Field first", "Then the lab to find out why."],
      ]}
    >
      <p>Next: shipping less JavaScript.</p>
    </WrapStep>
  );
}
