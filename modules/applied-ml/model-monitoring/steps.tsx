"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LAG, START, WEEKS, histogram, psi, shifted, timeline, type Drift } from "./model";
import type { MonitorState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;
const light = (p: number) => (p < 0.1 ? "good" : p < 0.25 ? "warn" : "bad");

/* 1 ─ A sat-nav with an old map ------------------------------------------------------------------- */

export function OldMap() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A sat-nav with an old map"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <svg viewBox="0 0 240 140" className="w-full max-w-sm">
            <path
              d="M20 120 L120 120 L120 30 L220 30"
              className="stroke-line fill-none"
              strokeWidth={10}
              strokeLinecap="round"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
              d="M20 120 L120 120 L120 30 L220 30"
              className="stroke-accent fill-none"
              strokeWidth={3}
              strokeDasharray="6 4"
            />
            <rect x={108} y={62} width={24} height={14} rx={2} className="fill-bad" />
            <text x={120} y={72} textAnchor="middle" className="fill-white text-[8px] font-bold">
              CLOSED
            </text>
            <path
              d="M120 120 Q190 120 220 30"
              className="stroke-good fill-none"
              strokeWidth={2}
              strokeDasharray="2 3"
            />
            <text x={200} y={100} className="fill-good text-[8px]">
              new road
            </text>
          </svg>
          <p className="text-subtle text-[10px]">
            The route is still “right” according to the map.
          </p>
        </div>
      }
    >
      <p>
        A sat-nav with a map from five years ago works perfectly, until a road closes and a new one
        opens. It never says “my map is old”; it confidently sends you the wrong way.
      </p>
      <p>
        Models are the same. They learn from a snapshot of the past, and when the world changes
        their answers quietly get worse. <Term id="model-monitoring">Monitoring</Term> is how you
        notice before your customers or your accounts do.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Six months in production ⭐ ----------------------------------------------------------------- */

const DRIFTS: { id: Drift; name: string; text: string }[] = [
  { id: "none", name: "Nothing changes", text: "Same kind of applicants, same behaviour." },
  {
    id: "data",
    name: "Inputs shift",
    text: "A marketing campaign brings in more lower-income applicants.",
  },
  {
    id: "concept",
    name: "Behaviour shifts",
    text: "A downturn: the same applicant is now more likely to default.",
  },
];

function Chart({
  vals,
  lo,
  hi,
  label,
  color,
  bands,
}: {
  vals: (number | null)[];
  lo: number;
  hi: number;
  label: string;
  color: string;
  bands?: boolean;
}) {
  const X = (w: number) => r1(30 + (w / (WEEKS - 1)) * 260);
  const Y = (v: number) => r1(52 - ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * 44);
  const d = vals
    .map((v, w) => (v === null ? "" : `${w === 0 ? "M" : "L"}${X(w)},${Y(v)}`))
    .join(" ");
  return (
    <div>
      <p className="text-muted text-[10px] uppercase">{label}</p>
      <svg viewBox="0 0 300 60" className="max-h-24 w-full">
        {bands && (
          <>
            <rect
              x={30}
              y={Y(0.25)}
              width={260}
              height={r1(Y(0.1) - Y(0.25))}
              className="fill-viz-compute/10"
            />
            <rect x={30} y={8} width={260} height={r1(Y(0.25) - 8)} className="fill-bad/10" />
          </>
        )}
        <line
          x1={X(START)}
          x2={X(START)}
          y1={6}
          y2={54}
          className="stroke-line"
          strokeDasharray="2 2"
        />
        <path d={d} className={cn("fill-none", color)} strokeWidth={1.6} />
        {vals.map(
          (v, w) =>
            v !== null && (
              <circle
                key={w}
                cx={X(w)}
                cy={Y(v)}
                r={1.4}
                className={color.replace("stroke-", "fill-")}
              />
            ),
        )}
      </svg>
    </div>
  );
}

export function Dashboard() {
  const [s, set] = useSceneState<MonitorState>();
  const t = timeline(s.drift, s.speed);
  const last = t[WEEKS - 1];
  const lastKnown = t[WEEKS - LAG - 1];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Six months in production"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {DRIFTS.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={s.drift === d.id}
                onClick={() => set({ drift: d.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.drift === d.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {d.name}
              </button>
            ))}
            {(["sudden", "gradual"] as const).map((sp) => (
              <button
                key={sp}
                type="button"
                aria-pressed={s.speed === sp}
                onClick={() => set({ speed: sp })}
                disabled={s.drift === "none"}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs disabled:opacity-40",
                  s.speed === sp ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {sp}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{DRIFTS.find((d) => d.id === s.drift)?.text}</p>
          <Chart
            vals={t.map((x) => x.psi)}
            lo={0}
            hi={0.6}
            label="Input drift (PSI, income)"
            color="stroke-viz-data"
            bands
          />
          <Chart
            vals={t.map((x) => x.refused)}
            lo={0}
            hi={100}
            label="Share refused %"
            color="stroke-viz-meta"
          />
          <Chart
            vals={t.map((x) => x.badRate)}
            lo={0}
            hi={60}
            label="Defaults among approved % (known 4 weeks late)"
            color="stroke-accent"
          />
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div
              className={cn(
                "rounded-lg border px-2 py-1",
                {
                  good: "border-good bg-good/10",
                  warn: "border-viz-compute bg-viz-compute/10",
                  bad: "border-bad bg-bad/10",
                }[light(last.psi)],
              )}
            >
              PSI now <span className="font-mono">{last.psi.toFixed(2)}</span>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1">
              refused <span className="font-mono">{last.refused}%</span>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1">
              defaults (wk {WEEKS - LAG}) <span className="font-mono">{lastKnown.badRate}%</span>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Made-up weekly applicants scored by the module 17 model; the change starts at the dashed
            line (week {START}). Outcomes arrive {LAG} weeks late, so that line stops early.
            Computed live.
          </p>
        </div>
      }
    >
      <p>
        You can see inputs and predictions every day, but whether a borrower repays arrives much
        later. Try each scenario. When inputs shift (<Term id="data-drift">data drift</Term>), the
        PSI light turns red at once, yet the model may still be fine.
      </p>
      <p>
        When behaviour shifts (<Term id="concept-drift">concept drift</Term>), the inputs look the
        same, so input checks stay green while defaults among approved borrowers climb, and you only
        find out weeks later. Watch several signals: inputs, predictions, data quality, business
        numbers, and accuracy once outcomes arrive.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Measuring how far inputs moved -------------------------------------------------------------- */

export function Psi() {
  const [s, set] = useSceneState<MonitorState>();
  const ref = shifted(0);
  const cur = shifted(s.shift);
  const p = psi(ref, cur);
  const h0 = histogram(ref);
  const h1 = histogram(cur);
  const max = Math.max(...h0, ...h1);
  const tone = light(p);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Measuring how far inputs moved"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">income shift</span>
            <input
              type="range"
              min={0}
              max={3}
              step={0.25}
              value={s.shift}
              onChange={(e) => set({ shift: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Income shift"
            />
            <span className="w-20 font-mono">−₹{s.shift} lakh</span>
          </label>
          <svg viewBox="0 0 300 120" className="mx-auto w-full max-w-lg">
            {h0.map((v, i) => (
              <g key={i}>
                <rect
                  x={20 + i * 27}
                  y={r1(105 - (v / max) * 90)}
                  width={12}
                  height={r1((v / max) * 90)}
                  className="fill-viz-data/70"
                />
                <rect
                  y={r1(105 - (h1[i] / max) * 90)}
                  height={r1((h1[i] / max) * 90)}
                  x={33 + i * 27}
                  width={12}
                  className="fill-accent"
                />
                <text x={32 + i * 27} y={115} textAnchor="middle" className="fill-muted text-[6px]">
                  {4 + i * 2}–{6 + i * 2}
                </text>
              </g>
            ))}
          </svg>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="bg-viz-data/70 h-2 w-3 rounded-sm" /> training
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-accent h-2 w-3 rounded-sm" /> this week
            </span>
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-sm",
              {
                good: "border-good bg-good/10",
                warn: "border-viz-compute bg-viz-compute/10",
                bad: "border-bad bg-bad/10",
              }[tone],
            )}
          >
            PSI <span className="font-mono font-semibold">{p.toFixed(3)}</span>:{" "}
            {tone === "good"
              ? "little change"
              : tone === "warn"
                ? "moderate change, investigate"
                : "significant change, act"}
          </div>
          <p className="text-subtle text-[10px]">
            PSI = Σ (this week − training) × ln(this week ÷ training), over the income bins. Made-up
            incomes, computed live.
          </p>
        </div>
      }
    >
      <p>
        The <Term id="psi">Population Stability Index</Term> compares how a feature&apos;s values
        fall into bins now versus in training. It comes from credit scoring, where the usual rule of
        thumb is: under 0.1 little change, 0.1 to 0.25 moderate, above 0.25 significant. It&apos;s a
        traffic light, not a statistical law.
      </p>
      <p>
        Statistical tests such as Kolmogorov–Smirnov (KS) ask whether two samples come from the same
        distribution. With large samples they flag even tiny, harmless differences, so pair them
        with a sense of size.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When the world changed ---------------------------------------------------------------------- */

export function Stories() {
  const items: [string, string, string][] = [
    [
      "Spring 2020",
      "Shopping changes in days",
      "Within a week at the end of February, Amazon's top searches filled with toilet paper and face masks. Models tuned to normal behaviour for inventory, fraud and marketing needed people to step in (MIT Technology Review, May 2020).",
    ],
    [
      "November 2021",
      "Zillow Offers closes",
      "Zillow shut its home-buying business, wrote down about $304 million on homes bought that quarter, and cut about a quarter of its staff. Its CEO said the unpredictability of forecasting home prices far exceeded what it had anticipated; it also cited labour and supply problems.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When the world changed"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([d, t, x], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-accent font-mono text-[10px]">{d}</p>
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1">{x}</p>
            </motion.div>
          ))}
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-sm font-semibold">When drift is found</p>
            <p className="text-muted mt-1">
              Retrain on a schedule, when an alert fires, or continuously, and test the new model
              against the current one before switching. Sometimes the right answer is a human, or
              turning the model off.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Drift can be sudden (a pandemic, a new sensor), gradual, or recurring (seasons). Researchers
        describe it as a change in the inputs versus a change in the link between inputs and the
        right answer (Gama and colleagues, 2014).
      </p>
      <p>
        Open-source tools help: Evidently (Apache-2.0) builds drift reports, and NannyML (bought by
        Soda in 2025) estimates accuracy before outcomes arrive, assuming behaviour hasn&apos;t
        changed. Cloud ML platforms include monitoring too.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which kind of drift? ------------------------------------------------------------------------ */

export function WhichDrift() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of drift?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-drift"
            prompt="Did the inputs shift, or did the link between inputs and the right answer change?"
            categories={[
              { id: "data", label: "Inputs shifted" },
              { id: "concept", label: "Link changed" },
            ]}
            items={[
              {
                id: "campaign",
                label: "A student offer brings in much younger customers",
                category: "data",
                why: "Different people, same behaviour.",
              },
              {
                id: "downturn",
                label: "In a recession, borrowers with the same profile default more often",
                category: "concept",
                why: "Same inputs, different outcome.",
              },
              {
                id: "spam",
                label: "Spammers reword their messages, so old spam words stop signalling spam",
                category: "concept",
                why: "The meaning of the inputs changed.",
              },
              {
                id: "field",
                label: "A new app version leaves the 'employer' field blank for everyone",
                category: "data",
                why: "The inputs changed (a data-quality problem too).",
              },
              {
                id: "fraud",
                label:
                  "Fraudsters copy normal shoppers' habits, so patterns that meant fraud no longer do",
                category: "concept",
                why: "The link between pattern and fraud moved.",
              },
            ]}
            explanation="Input checks catch shifted inputs. A changed link only shows up in outcomes, which often arrive late."
          />
        </div>
      }
    >
      <p>Sort the changes.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Models age silently", "The world moves; the snapshot doesn't."],
  ["Data drift vs concept drift", "Inputs move vs the link moves."],
  ["Outcomes arrive late", "Watch inputs, predictions and business numbers."],
  ["PSI is a traffic light", "0.1 / 0.25 rules of thumb."],
  ["Plan the response", "Retrain, test, or hand back to people."],
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
      <p>Next: a map of the tools used to build all of this.</p>
    </StepLayout>
  );
}
