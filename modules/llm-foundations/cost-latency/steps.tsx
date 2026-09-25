"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PRICES, monthly, type Workload } from "./prices";
import type { CostState } from "./state";

const usd = (x: number) =>
  x >= 1000
    ? `$${Math.round(x).toLocaleString("en-US")}`
    : x >= 0.1
      ? `$${x.toFixed(2)}`
      : `$${x.toFixed(4)}`;
const fmt = (n: number) => n.toLocaleString("en-US");

const PRESETS: Record<
  string,
  {
    label: string;
    blurb: string;
    w: Omit<Workload, "cachedShare" | "discounted">;
    batchable: boolean;
  }
> = {
  support: {
    label: "Support chatbot",
    blurb:
      "50,000 chats a day, 6 turns each. Each turn sends instructions, retrieved articles and the chat so far.",
    w: { requests: 300_000, input: 3_000, output: 250 },
    batchable: false,
  },
  summarise: {
    label: "Ticket summaries",
    blurb: "200,000 closed tickets summarised overnight for the weekly report.",
    w: { requests: 200_000, input: 800, output: 80 },
    batchable: true,
  },
  code: {
    label: "Code assistant",
    blurb: "2,000 developers, about 200 requests each a day, with a lot of code as context.",
    w: { requests: 400_000, input: 6_000, output: 150 },
    batchable: false,
  },
};

/* 1 ─ Two meters ------------------------------------------------------------------------------------ */

export function TwoMeters() {
  const p = PRICES.find((x) => x.id === "sonnet")!;
  const inCost = (3_000 * p.input) / 1e6;
  const outCost = (250 * p.output) / 1e6;
  return (
    <StepLayout
      eyebrow="Basics"
      title="Two meters running"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Input tokens",
                "What you send: instructions, documents, history, the question",
                "3,000 tokens",
                `$${p.input} per million`,
                inCost,
                "bg-viz-data",
              ],
              [
                "Output tokens",
                "What the model writes",
                "250 tokens",
                `$${p.output} per million`,
                outCost,
                "bg-accent",
              ],
            ].map(([t, d, n, r, c, col], i) => (
              <motion.div
                key={t as string}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="border-line bg-surface rounded-xl border p-3"
              >
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <span className={cn("inline-block size-3 rounded-sm", col as string)} />{" "}
                  {t as string}
                </p>
                <p className="text-muted text-xs">{d as string}</p>
                <p className="mt-2 font-mono text-xs">
                  {n as string} × {r as string}
                </p>
                <p className="font-mono text-lg">{usd(c as number)}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[11px]">One chatbot turn on Claude Sonnet 5</p>
            <div className="mt-1 flex h-6 overflow-hidden rounded">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(inCost / (inCost + outCost)) * 100}%` }}
                className="bg-viz-data"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(outCost / (inCost + outCost)) * 100}%` }}
                className="bg-accent"
              />
            </div>
            <p className="mt-1 font-mono text-sm">
              {usd(inCost + outCost)} per turn · {usd((inCost + outCost) * 300_000 * 30)} a month at
              300,000 turns a day
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            Anthropic list price, Sep 2026. OpenAI&apos;s gpt-6-sol has the same $2 / $10 price.
          </p>
        </div>
      }
    >
      <p>
        APIs bill like a taxi with two meters. One ticks for every <Term id="token">token</Term> you
        send, the other for every token the model writes, and the writing meter runs about five
        times faster.
      </p>
      <p>
        But inputs are usually much longer: instructions, documents and history go with every
        request. So for most chat features, input is the bigger bill.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Predict ---------------------------------------------------------------------------------------- */

export function PredictBill() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="Estimate a monthly bill"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="monthly-bill"
            prompt="A bot handles 10,000 conversations a day, each 5 turns. Each turn sends 2,000 input tokens and gets 200 output tokens back, at $2 / $10 per million. Roughly what's the monthly bill (30 days), in thousands of dollars?"
            min={0}
            max={50}
            step={0.5}
            unit=" thousand $"
            answer={9}
            tolerance={1.5}
            explanation="About $9,000. Per turn: 2,000 × $2/M = $0.004 in, 200 × $10/M = $0.002 out, so $0.006. × 5 turns × 10,000 chats = $300 a day, × 30 = $9,000 a month. Two-thirds of it is input."
          />
        </div>
      }
    >
      <p>Requests × tokens × price. Try it before the calculator does it for you.</p>
    </StepLayout>
  );
}

/* 3 ─ Feature calculator ⭐ ------------------------------------------------------------------------- */

export function Calculator() {
  const [s, set] = useSceneState<CostState>();
  const preset = PRESETS[s.preset];
  const w: Workload = {
    requests: s.requests,
    input: s.input,
    output: s.output,
    cachedShare: s.cachedShare,
    discounted: s.discounted && preset.batchable,
  };
  const rows = PRICES.map((p) => ({ p, c: monthly(p, w) })).sort((a, b) => a.c.month - b.c.month);
  const max = rows[rows.length - 1].c.month;
  const sel = rows.find((r) => r.p.id === s.model)!;
  return (
    <StepLayout
      eyebrow="Calculator"
      title="What will the feature cost?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.preset}
            options={Object.entries(PRESETS).map(([k, v]) => [k, v.label])}
            onChange={(k) => set({ preset: k, ...PRESETS[k].w, discounted: false })}
          />
          <p className="text-muted text-xs">{preset.blurb}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Slider
              label="Requests a day"
              value={s.requests}
              min={10_000}
              max={1_000_000}
              step={10_000}
              fmtV={fmt}
              onChange={(v) => set({ requests: v })}
            />
            <Slider
              label="Input tokens per request"
              value={s.input}
              min={200}
              max={20_000}
              step={100}
              fmtV={fmt}
              onChange={(v) => set({ input: v })}
            />
            <Slider
              label="Output tokens per request"
              value={s.output}
              min={20}
              max={2_000}
              step={10}
              fmtV={fmt}
              onChange={(v) => set({ output: v })}
            />
            <Slider
              label="Input served from cache"
              value={s.cachedShare}
              min={0}
              max={0.9}
              step={0.1}
              fmtV={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => set({ cachedShare: v })}
            />
          </div>
          <label
            className={cn("flex items-center gap-2 text-xs", !preset.batchable && "text-subtle")}
          >
            <input
              type="checkbox"
              checked={s.discounted && preset.batchable}
              disabled={!preset.batchable}
              onChange={(e) => set({ discounted: e.target.checked })}
            />
            Use the 50% batch or off-peak discount{" "}
            {preset.batchable
              ? "(nobody is waiting)"
              : "(not for live chat: results can take hours)"}
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[11px]">Monthly cost by model (click one)</p>
            <div className="grid gap-1">
              {rows.map(({ p, c }) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set({ model: p.id })}
                  className={cn(
                    "flex items-center gap-2 rounded px-1 text-left text-[11px]",
                    p.id === s.model && "bg-accent-soft",
                  )}
                >
                  <span className="w-36 shrink-0 truncate">{p.name}</span>
                  <span className="bg-surface-2 relative h-2.5 flex-1 overflow-hidden rounded">
                    <motion.span
                      className={cn(
                        "absolute inset-y-0 left-0 rounded",
                        p.id === s.model ? "bg-accent" : "bg-viz-data/60",
                      )}
                      animate={{ width: `${Math.max(0.5, (c.month / max) * 100)}%` }}
                    />
                  </span>
                  <span className="w-20 text-right font-mono">{usd(c.month)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label={`${sel.p.name}, a month`} value={usd(sel.c.month)} />
            <Stat label="Per request" value={usd(sel.c.perRequest)} />
            <Stat label="Share from input" value={`${Math.round(sel.c.inputShare * 100)}%`} />
          </div>
          <p className="text-subtle text-[10px]">
            List prices per million tokens, Sep 2026, from each provider&apos;s pricing page.
            Excludes cache-write and long-context surcharges, taxes and volume deals; Gemini 3.1 Pro
            priced at its up-to-200k-token rate; DeepSeek at peak-hour rates.
          </p>
        </div>
      }
    >
      <p>
        Pick a feature, then adjust the traffic and token counts. The chart compares every model
        tier from four providers on the same workload.
      </p>
      <p>
        The spread is huge: the same job can cost a few hundred dollars or several hundred thousand
        a month. Quality differs too, which the next chapter covers.
      </p>
    </StepLayout>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  fmtV,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmtV: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="grid gap-0.5 text-[11px]">
      <span className="text-muted flex justify-between">
        {label} <span className="text-fg font-mono">{fmtV(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-2 rounded-lg px-2.5 py-1.5">
      <p className="text-muted truncate text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 4 ─ Cut the bill (levers) -------------------------------------------------------------------------- */

export function Levers() {
  const base: Workload = {
    requests: 300_000,
    input: 3_000,
    output: 250,
    cachedShare: 0,
    discounted: false,
  };
  const sonnet = PRICES.find((p) => p.id === "sonnet")!;
  const haiku = PRICES.find((p) => p.id === "haiku")!;
  const steps: [string, string, number][] = [
    ["Start", "Support bot on Claude Sonnet 5", monthly(sonnet, base).month],
    [
      "Cache the stable 70%",
      "Instructions and policies cached (see context engineering)",
      monthly(sonnet, { ...base, cachedShare: 0.7 }).month,
    ],
    [
      "Trim the context",
      "Summarise history, fewer retrieved articles: 3,000 → 2,000 input tokens",
      monthly(sonnet, { ...base, input: 2_000, cachedShare: 0.7 }).month,
    ],
    [
      "Route easy turns to a smaller model",
      "Half the turns to Claude Haiku 4.5",
      (monthly(sonnet, { ...base, input: 2_000, cachedShare: 0.7 }).month +
        monthly(haiku, { ...base, input: 2_000, cachedShare: 0.7 }).month) /
        2,
    ],
  ];
  const max = steps[0][2];
  return (
    <StepLayout
      eyebrow="Levers"
      title="Cutting the bill"
      stage={
        <div className="flex flex-1 flex-col gap-2">
          {steps.map(([t, d, v], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="border-line bg-surface rounded-xl border p-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">{t}</p>
                <p className="font-mono text-sm">{usd(v)}/month</p>
              </div>
              <p className="text-muted text-xs">{d}</p>
              <div className="bg-surface-2 mt-2 h-2.5 overflow-hidden rounded">
                <motion.div
                  className={cn("h-full rounded", i === 0 ? "bg-bad/70" : "bg-accent")}
                  initial={{ width: 0 }}
                  animate={{ width: `${(v / max) * 100}%` }}
                  transition={{ delay: i * 0.2 + 0.1 }}
                />
              </div>
            </motion.div>
          ))}
          <p className="text-muted text-xs">
            Together: {Math.round((1 - steps[3][2] / max) * 100)}% less, before touching quality
            checks. Each lever needs testing (an eval) to confirm answers don&apos;t get worse.
          </p>
        </div>
      }
    >
      <p>
        The support bot from the calculator, 300,000 turns a day. Four common levers, applied one
        after another.
      </p>
      <p className="text-muted text-sm">
        <Term id="model-routing">Routing</Term> works because many requests are easy: a small model
        handles greetings and simple lookups, a bigger one the hard cases.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Latency budget -------------------------------------------------------------------------------- */

const LIMITS: [number, string][] = [
  [0.1, "feels instant"],
  [1, "keeps the flow"],
  [10, "keeps attention"],
];

export function LatencyBudget() {
  const [s, set] = useSceneState<CostState>();
  const total = s.ttft + s.answer / s.speed;
  const W = 540;
  const lx = (t: number) => 20 + ((Math.log10(Math.max(t, 0.05)) + 1.4) / 3) * (W - 40);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Will it feel fast?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <Slider
              label="Time to first token"
              value={s.ttft}
              min={0.1}
              max={5}
              step={0.1}
              fmtV={(v) => `${v.toFixed(1)} s`}
              onChange={(v) => set({ ttft: v })}
            />
            <Slider
              label="Tokens per second"
              value={s.speed}
              min={10}
              max={300}
              step={10}
              fmtV={(v) => String(v)}
              onChange={(v) => set({ speed: v })}
            />
            <Slider
              label="Answer length (tokens)"
              value={s.answer}
              min={10}
              max={2_000}
              step={10}
              fmtV={fmt}
              onChange={(v) => set({ answer: v })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox={`0 0 ${W} 110`}
              className="w-full"
              role="img"
              aria-label="Latency against human limits"
            >
              {LIMITS.map(([t, l]) => (
                <g key={t}>
                  <line
                    x1={lx(t)}
                    x2={lx(t)}
                    y1={10}
                    y2={80}
                    stroke="var(--line-strong)"
                    strokeDasharray="3 3"
                  />
                  <text x={lx(t)} y={96} textAnchor="middle" className="fill-muted text-[10px]">
                    {t} s: {l}
                  </text>
                </g>
              ))}
              {[
                ["First words appear (streaming)", s.ttft, "var(--accent)", 22],
                ["Whole answer ready", total, "var(--viz-data)", 52],
              ].map(([l, t, c, y]) => (
                <g key={l as string}>
                  <motion.rect
                    initial={{ width: 4 }}
                    x={20}
                    y={y as number}
                    height={16}
                    rx={4}
                    fill={c as string}
                    animate={{ width: Math.max(4, lx(t as number) - 20) }}
                  />
                  <text x={24} y={(y as number) - 3} className="fill-fg text-[10px]">
                    {l as string}: {(t as number).toFixed(1)} s
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <p className="text-muted text-xs">
            {s.ttft <= 1
              ? "The first words arrive within a second, so the wait feels natural if you stream the answer."
              : "Over a second before anything appears: show progress, or shorten the prompt."}{" "}
            {total > 10
              ? "The full answer takes over 10 seconds: never make people wait for it without streaming."
              : ""}
          </p>
          <p className="text-subtle text-[10px]">
            Time limits from Jakob Nielsen&apos;s classic response-time guidelines (0.1 s, 1 s, 10
            s). Log scale.
          </p>
        </div>
      }
    >
      <p>
        People judge speed by when something starts happening. That&apos;s why chat apps{" "}
        <Term id="streaming">stream</Term> tokens as they&apos;re written: the wait that matters is
        the <Term id="ttft">time to first token</Term>.
      </p>
      <p>
        Code completion needs the whole (short) answer within a fraction of a second; a report
        generator can take a minute if it shows progress. Set a budget per feature.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Rent GPUs or pay per token? ----------------------------------------------------------------- */

export function RentOrPay() {
  const [s, set] = useSceneState<CostState>();
  const perM = (s.gpuPrice / (s.gpuTps * 3600 * s.utilisation)) * 1e6;
  const minFleet = 2 * s.gpuPrice * 24 * 30;
  const api = PRICES.find((p) => p.id === "gflash")!;
  const blended = (api.input * 3 + api.output) / 4;
  const breakEven = minFleet / blended; // million tokens a month where API spend = minimum fleet
  return (
    <StepLayout
      eyebrow="Compare"
      title="Rent GPUs or pay per token?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <Slider
              label="GPU rental, $ per hour"
              value={s.gpuPrice}
              min={1.5}
              max={7}
              step={0.25}
              fmtV={(v) => `$${v.toFixed(2)}`}
              onChange={(v) => set({ gpuPrice: v })}
            />
            <Slider
              label="Tokens/s per GPU when busy"
              value={s.gpuTps}
              min={250}
              max={5_000}
              step={250}
              fmtV={fmt}
              onChange={(v) => set({ gpuTps: v })}
            />
            <Slider
              label="Average utilisation"
              value={s.utilisation}
              min={0.1}
              max={0.9}
              step={0.05}
              fmtV={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => set({ utilisation: v })}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Stat label="Self-hosted cost per million tokens" value={usd(perM)} />
            <Stat label={`${api.name} (3:1 input:output)`} value={usd(blended)} />
            <Stat label="Smallest fleet (2 GPUs, 24/7)" value={`${usd(minFleet)}/month`} />
          </div>
          <BreakEvenChart
            gpuMonth={s.gpuPrice * 24 * 30}
            perGpu={(s.gpuTps * 3600 * 24 * 30 * s.utilisation) / 1e6}
            apiPerM={blended}
          />
          <div
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              perM < blended ? "border-good/40 bg-good/10" : "border-line bg-surface",
            )}
          >
            {perM < blended
              ? `At this utilisation, self-hosting is cheaper per token, but only once you use more than about ${fmt(Math.round(breakEven))} million tokens a month; below that, the idle fleet costs more than the API would.`
              : "At this utilisation, the API is cheaper per token. Idle GPUs still cost money every hour."}
          </div>
          <p className="text-subtle text-[10px]">
            H100 rental in Sep 2026 ranges from about $1.50/hour on marketplaces to about $7/hour
            on-demand at a large cloud (AWS p5: $55.04/hour for 8 GPUs). Tokens per second depends
            heavily on the model, engine and batch size: treat it as an assumption to test. Engineer
            time, monitoring and spare capacity are extra.
          </p>
        </div>
      }
    >
      <p>
        Instead of paying per token, you can rent GPUs and run an open model yourself. You then pay
        by the hour, busy or idle.
      </p>
      <p>
        The answer turns on <em>utilisation</em>: steady, heavy traffic keeps GPUs busy and can beat
        API prices; spiky or light traffic leaves them idle. Move the sliders.
      </p>
      <p className="text-muted text-sm">
        Other reasons to self-host have nothing to do with price: data that can&apos;t leave your
        network, a fine-tuned model, or predictable capacity.
      </p>
    </StepLayout>
  );
}

function BreakEvenChart({
  gpuMonth,
  perGpu,
  apiPerM,
}: {
  gpuMonth: number;
  perGpu: number;
  apiPerM: number;
}) {
  // perGpu: million tokens a month one GPU serves at this utilisation
  const W = 540;
  const H = 170;
  const maxV = Math.max(perGpu * 8, 2000);
  const cost = (v: number) => Math.max(2, Math.ceil(v / perGpu)) * gpuMonth;
  const maxC = Math.max(cost(maxV), apiPerM * maxV);
  const x = (v: number) => 56 + (v / maxV) * (W - 76);
  const y = (c: number) => H - 24 - (c / maxC) * (H - 40);
  const pts = Array.from({ length: 161 }, (_, i) => (i / 160) * maxV);
  return (
    <div className="border-line bg-surface rounded-xl border p-3">
      <p className="text-muted text-[11px]">Monthly cost by monthly volume (million tokens)</p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="API vs self-hosting cost"
      >
        <line x1={56} x2={W - 20} y1={y(0)} y2={y(0)} stroke="var(--line-strong)" />
        <polyline
          fill="none"
          stroke="var(--viz-data)"
          strokeWidth={2.5}
          points={pts.map((v) => `${x(v)},${y(apiPerM * v)}`).join(" ")}
        />
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.5}
          points={pts.map((v) => `${x(v)},${y(cost(v))}`).join(" ")}
        />
        {[0, 0.5, 1].map((f) => (
          <text
            key={f}
            x={x(maxV * f)}
            y={H - 8}
            textAnchor="middle"
            className="fill-muted text-[10px]"
          >
            {Math.round(maxV * f).toLocaleString("en-US")}
          </text>
        ))}
        <text x={50} y={y(maxC) + 4} textAnchor="end" className="fill-muted text-[10px]">
          {usd(maxC)}
        </text>
        <text x={50} y={y(0)} textAnchor="end" className="fill-muted text-[10px]">
          $0
        </text>
      </svg>
      <p className="text-muted flex flex-wrap gap-3 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="bg-viz-data inline-block h-0.5 w-5" /> API, pay per token
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-accent inline-block h-0.5 w-5" /> Rented GPUs (at least 2; add one as
          each fills)
        </span>
      </p>
    </div>
  );
}

/* 7 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function FirstMove() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The first move"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="first-move"
            prompt="Your support bot costs $40,000 a month. 85% is input tokens, and 2,500 of each request's 3,000 input tokens are the same instructions and policies every time. What's the best first move?"
            options={[
              {
                id: "cache",
                label: "Put the fixed 2,500 tokens first and turn on prompt caching",
                correct: true,
                feedback:
                  "Yes. Cached input costs a tenth (or less) of the normal price, with no change to the model or its answers. It's the cheapest, safest win here.",
              },
              {
                id: "smaller",
                label: "Switch everything to the cheapest model",
                feedback:
                  "It might cut the bill, but it risks answer quality and needs a careful eval. Caching saves most of the money with no quality risk.",
              },
              {
                id: "gpus",
                label: "Rent GPUs and self-host an open model",
                feedback:
                  "A big project with its own costs and risks. Try the simple levers first.",
              },
              {
                id: "batch",
                label: "Use the batch API for 50% off",
                feedback:
                  "Batch results can take hours: fine for reports, not for customers waiting in a chat.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Find the biggest part of the bill, then the cheapest safe fix for it.</p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Requests × tokens × price", "Estimate before you build; input is often the bigger half."],
  ["Levers", "Caching, shorter context, routing to smaller models, batch discounts."],
  [
    "Budget latency per feature",
    "Stream answers; watch time to first token for chat, total time for autocomplete.",
  ],
  ["Self-hosting is a utilisation bet", "Cheaper per token only when GPUs stay busy."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>That completes running models.</p>
      <p>Next chapter: the model landscape, starting with open versus closed models.</p>
    </StepLayout>
  );
}
