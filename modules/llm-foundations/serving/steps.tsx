"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import bench from "./bench.json";
import { STEP_BASE_MS, STEP_PER_REQ_MS, makeRequests, simulate } from "./sim";
import type { ServeState } from "./state";

/* 1 ─ Share the walk ⭐ (real batching) ------------------------------------------------------------- */

export function ShareTheWalk() {
  const runs = bench.runs;
  const W = 540;
  const H = 190;
  const maxT = 280;
  const x = (i: number) => 60 + i * ((W - 100) / (runs.length - 1));
  const y = (v: number) => H - 26 - (v / maxT) * (H - 44);
  return (
    <StepLayout
      eyebrow="Real measurements"
      title="Share the walk"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[11px]">
              Tokens per second, by how many requests run together
            </p>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Throughput by batch size"
            >
              {[0, 100, 200].map((v) => (
                <g key={v}>
                  <line
                    x1={50}
                    x2={W - 30}
                    y1={y(v)}
                    y2={y(v)}
                    stroke="var(--line-strong)"
                    strokeOpacity={v ? 0.3 : 1}
                  />
                  <text x={44} y={y(v) + 3} textAnchor="end" className="fill-muted text-[10px]">
                    {v}
                  </text>
                </g>
              ))}
              {runs.map((r, i) => {
                const bw = 26;
                return (
                  <g key={r.batch}>
                    <motion.rect
                      x={x(i) - bw}
                      width={bw - 2}
                      initial={{ height: 0, y: y(0) }}
                      animate={{ height: y(0) - y(r.tokensPerSec), y: y(r.tokensPerSec) }}
                      transition={{ delay: i * 0.1 }}
                      fill="var(--accent)"
                      rx={3}
                    />
                    <motion.rect
                      x={x(i) + 2}
                      width={bw - 2}
                      initial={{ height: 0, y: y(0) }}
                      animate={{ height: y(0) - y(r.perUser), y: y(r.perUser) }}
                      transition={{ delay: i * 0.1 }}
                      fill="var(--viz-data)"
                      rx={3}
                    />
                    <text
                      x={x(i) - bw / 2 - 1}
                      y={y(r.tokensPerSec) - 5}
                      textAnchor="middle"
                      className="fill-fg text-[10px]"
                    >
                      {Math.round(r.tokensPerSec)}
                    </text>
                    <text
                      x={x(i) + bw / 2 + 1}
                      y={y(r.perUser) - 5}
                      textAnchor="middle"
                      className="fill-fg text-[10px]"
                    >
                      {Math.round(r.perUser)}
                    </text>
                    <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted text-[10px]">
                      {r.batch} at once
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="text-muted flex flex-wrap gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="bg-accent inline-block size-2.5 rounded-sm" /> total, all users
              </span>
              <span className="flex items-center gap-1.5">
                <span className="bg-viz-data inline-block size-2.5 rounded-sm" /> each user
              </span>
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            Measured by us: {bench.model.replace("onnx-community/", "")} (4-bit) on an Apple M3 Pro
            with Transformers.js, 32 new tokens per request.
          </p>
        </div>
      }
    >
      <p>
        Remember the chef who walks the whole pantry for every token? Serving one person at a time
        wastes the walk. On the same walk, the chef can pick up ingredients for many dishes.
      </p>
      <p>
        That&apos;s <Term id="batching">batching</Term>: run many requests&apos; next tokens
        together, so one read of the weights serves them all. We measured it on a real model.
      </p>
      <p>
        16 requests at once gave five times the total output, but each person&apos;s answer came
        three times slower. That trade-off, <Term id="throughput">throughput</Term> against latency,
        is the whole game of serving.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Static vs continuous batching ⭐ (simulator) -------------------------------------------------- */

const RATES: [number, string][] = [
  [2, "Quiet (2/s)"],
  [8, "Busy (8/s)"],
  [20, "Rush hour (20/s)"],
];
const SLOTS = [1, 8, 32];
const WINDOW_MS = 12_000;

export function BatchingSim() {
  const [s, set] = useSceneState<ServeState>();
  const reqs = useMemo(() => makeRequests(s.rate), [s.rate]);
  const r = useMemo(() => simulate(reqs, s.slots, s.mode), [reqs, s.slots, s.mode]);
  const other = useMemo(
    () => simulate(reqs, s.slots, s.mode === "static" ? "continuous" : "static"),
    [reqs, s.slots, s.mode],
  );
  const W = 560;
  const rowH = s.slots === 32 ? 4 : s.slots === 8 ? 14 : 30;
  const H = s.slots * rowH + 20;
  const x = (ms: number) => 10 + (Math.min(ms, WINDOW_MS) / WINDOW_MS) * (W - 20);
  const shown = r.reqs.filter((q) => q.start! < WINDOW_MS);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Static or continuous batching"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Segmented
              size="sm"
              value={s.mode}
              options={[
                ["static", "Static batches"],
                ["continuous", "Continuous batching"],
              ]}
              onChange={(v) => set({ mode: v as ServeState["mode"] })}
            />
            <Segmented
              size="sm"
              value={String(s.slots)}
              options={SLOTS.map((n) => [String(n), `Batch ${n}`] as [string, string])}
              onChange={(v) => set({ slots: Number(v) })}
            />
            <Segmented
              size="sm"
              value={String(s.rate)}
              options={RATES.map(([v, l]) => [String(v), l] as [string, string])}
              onChange={(v) => set({ rate: Number(v) })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 text-[11px]">
              GPU batch slots over the first 12 seconds (each bar is one request being answered)
            </p>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Batch slot timeline"
            >
              {Array.from({ length: s.slots }, (_, i) => (
                <rect
                  key={i}
                  x={10}
                  y={i * rowH}
                  width={W - 20}
                  height={rowH - 1}
                  fill="var(--surface-2)"
                />
              ))}
              {shown.map((q) => (
                <rect
                  key={q.id}
                  x={x(q.start!)}
                  y={q.slot! * rowH}
                  width={Math.max(1, x(q.end!) - x(q.start!) - 1)}
                  height={rowH - 1}
                  rx={Math.min(3, rowH / 3)}
                  fill={q.id % 2 ? "var(--accent)" : "var(--viz-data)"}
                  opacity={0.85}
                />
              ))}
              {[0, 4, 8, 12].map((sec) => (
                <text
                  key={sec}
                  x={x(sec * 1000)}
                  y={H - 4}
                  textAnchor="middle"
                  className="fill-muted text-[9px]"
                >
                  {sec}s
                </text>
              ))}
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metric
              label="Throughput"
              value={`${Math.round(r.throughput)} tok/s`}
              vs={other.throughput}
              cur={r.throughput}
              higher
            />
            <Metric
              label="Wait for first token"
              value={`${r.meanWait.toFixed(1)} s`}
              vs={other.meanWait}
              cur={r.meanWait}
            />
            <Metric
              label="Average total time"
              value={`${r.meanLatency.toFixed(1)} s`}
              vs={other.meanLatency}
              cur={r.meanLatency}
            />
            <Metric
              label="Slots busy"
              value={`${Math.round(r.utilisation * 100)}%`}
              vs={other.utilisation}
              cur={r.utilisation}
              higher
            />
          </div>
          <FrameCaption
            frameKey={`${s.mode}${s.slots}`}
            title={s.mode === "static" ? "Static batches" : "Continuous batching"}
          >
            {s.slots === 1
              ? "One request at a time: the queue grows and people wait minutes, however the batching is done."
              : s.mode === "static"
                ? "A batch starts together and ends together. Short answers finish early and their slots sit empty until the longest one is done, while new requests wait in the queue."
                : "Every decode step, finished requests leave and waiting ones join the free slots. Slots stay busy and nobody waits for a stranger's long answer."}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Toy model: 160 requests, mostly 30–200 tokens with some up to 800; each decode step
            takes {STEP_BASE_MS} ms (reading the weights) + {STEP_PER_REQ_MS} ms per active request.
            Prefill is left out.
          </p>
        </div>
      }
    >
      <p>
        Real traffic is messy: requests arrive at random and answers have very different lengths.
        How you fill the batch matters as much as its size.
      </p>
      <p>
        Compare <em>static</em> batches with{" "}
        <Term id="continuous-batching">continuous batching</Term>, at different batch sizes and
        traffic levels.
      </p>
      <p className="text-muted text-sm">
        Continuous batching was introduced by the Orca system (2022) and is now standard in every
        serious serving engine.
      </p>
    </StepLayout>
  );
}

function Metric({
  label,
  value,
  cur,
  vs,
  higher,
}: {
  label: string;
  value: string;
  cur: number;
  vs: number;
  higher?: boolean;
}) {
  const better = higher ? cur > vs * 1.02 : cur < vs * 0.98;
  const worse = higher ? cur < vs * 0.98 : cur > vs * 1.02;
  return (
    <div
      className={cn(
        "rounded-lg px-2.5 py-1.5",
        better ? "bg-good/10" : worse ? "bg-bad/10" : "bg-surface-2",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
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

/* 3 ─ Memory limits the batch -------------------------------------------------------------------- */

const REQS = [
  { id: "A", used: 7, color: "bg-accent" },
  { id: "B", used: 3, color: "bg-viz-data" },
  { id: "C", used: 5, color: "bg-viz-compute" },
];

export function PagedMemory() {
  const [s, set] = useSceneState<ServeState>();
  const MAX = 10;
  const cells: ({ id: string; color: string; used: boolean } | null)[] = [];
  if (!s.paged) {
    for (const r of REQS)
      for (let i = 0; i < MAX; i++) cells.push({ id: r.id, color: r.color, used: i < r.used });
  } else {
    const order = [0, 1, 2, 0, 2, 1, 0, 2, 0, 1, 2, 0, 0, 2, 0];
    const left = REQS.map((r) => r.used);
    for (const k of order)
      if (left[k] > 0) {
        left[k]--;
        cells.push({ id: REQS[k].id, color: REQS[k].color, used: true });
      }
  }
  while (cells.length < 30) cells.push(null);
  const used = REQS.reduce((n, r) => n + r.used, 0);
  const taken = s.paged ? used : REQS.length * MAX;
  return (
    <StepLayout
      eyebrow="Compare"
      title="Memory limits the batch"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.paged ? "paged" : "reserved"}
            options={[
              ["reserved", "Reserve the maximum"],
              ["paged", "Pages on demand (vLLM)"],
            ]}
            onChange={(v) => set({ paged: v === "paged" })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[11px]">GPU memory for the KV cache: 30 blocks</p>
            <div className="grid grid-cols-10 gap-1">
              {cells.map((c, i) => (
                <motion.div
                  key={`${s.paged}${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: c && !c.used ? 0.22 : 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className={cn(
                    "grid h-8 place-items-center rounded text-[10px] font-semibold",
                    !c
                      ? "border-good/50 border border-dashed"
                      : c.used
                        ? cn(c.color, "text-accent-fg")
                        : c.color,
                  )}
                >
                  {c ? c.id : ""}
                </motion.div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-surface-2 rounded-lg px-2.5 py-1.5">
                <p className="text-muted text-[10px]">Holding real tokens</p>
                <p className="font-mono">
                  {Math.round((used / taken) * 100)}% of what&apos;s taken
                </p>
              </div>
              <div className="bg-surface-2 rounded-lg px-2.5 py-1.5">
                <p className="text-muted text-[10px]">Free for more requests</p>
                <p className="font-mono">{30 - taken} blocks</p>
              </div>
            </div>
          </div>
          <FrameCaption
            frameKey={String(s.paged)}
            title={s.paged ? "Paged KV cache" : "Reserved in advance"}
          >
            {s.paged
              ? "The cache is split into small pages handed out as each answer grows, anywhere in memory, like pages in an operating system. Almost nothing is wasted, so more requests fit in the batch. The vLLM paper measured 96% of cache memory holding real tokens."
              : "Each request reserves room for the longest answer it might give. Most answers are shorter, so the faded blocks sit empty, and no new request fits. The vLLM paper found earlier systems used only 20–38% of cache memory for real tokens."}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Every request in the batch needs its own <Term id="kv-cache">KV cache</Term> in GPU memory.
        So memory, not arithmetic, usually caps the batch size.
      </p>
      <p>
        vLLM&apos;s <Term id="paged-attention">PagedAttention</Term> (2023) fixed the waste, and
        improved throughput 2–4× at the same latency. Compare the two ways of handing out memory.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function TuneForJob() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Tune it for the job"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="tune"
            prompt="Which way would you tune the serving for each job?"
            categories={[
              { id: "latency", label: "Small batches, fast replies" },
              { id: "throughput", label: "Big batches, most tokens per rupee" },
            ]}
            items={[
              {
                id: "chat",
                label: "A customer-support chat assistant",
                category: "latency",
                why: "A person is waiting and watching the words appear.",
              },
              {
                id: "autocomplete",
                label: "Code completion in an editor",
                category: "latency",
                why: "Suggestions are useless if they arrive after you've typed the line.",
              },
              {
                id: "overnight",
                label: "Summarising 2 million support tickets overnight",
                category: "throughput",
                why: "Nobody waits for any single summary; total cost and finishing by morning are what count.",
              },
              {
                id: "catalogue",
                label: "Translating the product catalogue into 10 languages",
                category: "throughput",
                why: "A bulk job: maximise tokens per GPU-hour. Provider batch APIs offer this at about half price.",
              },
              {
                id: "voice",
                label: "A voice assistant that speaks its answer",
                category: "latency",
                why: "Long pauses before speaking feel broken; the first words must come quickly.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        The same GPUs can be tuned for fast replies or for maximum output. Match the setting to the
        job.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The toolbox ------------------------------------------------------------------------------------ */

const TOOLS: [string, string][] = [
  ["Continuous batching", "Requests join and leave the batch every step (Orca, 2022)."],
  ["Paged KV cache", "Memory handed out in small pages, so more requests fit (vLLM, 2023)."],
  [
    "Prefix caching",
    "Reuse the KV cache of shared prompt beginnings across requests (SGLang's RadixAttention and others).",
  ],
  [
    "Speculative decoding",
    "A small model drafts several tokens, the big one checks them at once: 2–3× faster with identical output (Leviathan et al., 2023).",
  ],
  [
    "Split prefill and decode",
    "Run the compute-heavy and memory-heavy phases on different GPUs (NVIDIA Dynamo and others).",
  ],
  [
    "Autoscaling",
    "Add GPU servers as traffic rises. Slow to react: each new server must load tens of gigabytes of weights first.",
  ],
];

const ENGINES: [string, string][] = [
  ["vLLM", "Open-source, widely used; PagedAttention"],
  ["SGLang", "Open-source; strong prefix caching"],
  ["TensorRT-LLM", "NVIDIA's optimised engine"],
  ["llama.cpp / Ollama", "Local and CPU/laptop inference, GGUF files"],
];

export function Toolbox() {
  return (
    <StepLayout
      eyebrow="Reference"
      title="The serving toolbox"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {TOOLS.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className="border-line bg-surface rounded-xl border px-3 py-2"
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-line bg-surface overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Serving engine</th>
                  <th className="px-3 py-2 font-medium">Known for</th>
                </tr>
              </thead>
              <tbody>
                {ENGINES.map(([e, d]) => (
                  <tr key={e} className="border-line border-t">
                    <td className="px-3 py-2 font-semibold">{e}</td>
                    <td className="px-3 py-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    >
      <p>
        Serving engines combine these tricks. Managed APIs (from model makers such as OpenAI,
        Anthropic and Google, or the AI platforms of AWS, Google Cloud and Microsoft Azure) run them
        for you; self-hosting means choosing an engine yourself.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Batch to share the weights", "One read of the weights serves every request in the batch."],
  ["Throughput vs latency", "Bigger batches: more total tokens, slower for each person."],
  ["Continuous batching", "Fill freed slots every step; don't wait for the slowest answer."],
  ["Memory caps the batch", "Every request needs KV cache; paging it wastes far less."],
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
      <p>Now you know where the time and the memory go.</p>
      <p>Next: putting prices on it, with cost and latency estimation.</p>
    </StepLayout>
  );
}
