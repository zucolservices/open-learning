"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { ContextState } from "./state";

const PRICE = 2; // $ per million input tokens (Claude Sonnet 5 and gpt-6-sol list price, Sep 2026)
const fmt = (n: number) => n.toLocaleString("en-US");
const usd = (x: number) =>
  x < 0.01 ? `$${x.toFixed(4)}` : x < 100 ? `$${x.toFixed(2)}` : `$${fmt(Math.round(x))}`;

/* 2 ─ Fill the window ⭐ ---------------------------------------------------------------------------- */

const WINDOW = 128_000;

const BLOCKS: {
  id: string;
  label: string;
  tokens: number;
  gives?: "knowledge" | "history";
  note: string;
}[] = [
  { id: "system", label: "Instructions & rules", tokens: 1_200, note: "Always needed." },
  { id: "question", label: "Customer's new message", tokens: 60, note: "Always needed." },
  {
    id: "centre",
    label: "Entire help centre (400 articles)",
    tokens: 180_000,
    gives: "knowledge",
    note: "Has the answer somewhere, but doesn't fit.",
  },
  {
    id: "top5",
    label: "Top 5 articles from a search",
    tokens: 1_500,
    gives: "knowledge",
    note: "Retrieval: just the likely-relevant pages.",
  },
  {
    id: "history",
    label: "Full chat history (60 turns)",
    tokens: 24_000,
    gives: "history",
    note: "Complete, but long and mostly irrelevant.",
  },
  {
    id: "summary",
    label: "Chat summary + last 6 turns",
    tokens: 2_600,
    gives: "history",
    note: "Keeps the facts that matter.",
  },
  {
    id: "orders",
    label: "This customer's open orders",
    tokens: 800,
    note: "Fetched by a tool call for this customer only.",
  },
  {
    id: "tools",
    label: "Definitions for 12 tools",
    tokens: 4_000,
    note: "Lets the model fetch anything else it needs.",
  },
];

export function FillTheWindow() {
  const [s, set] = useSceneState<ContextState>();
  const on = new Set(s.blocks);
  const used = BLOCKS.filter((b) => on.has(b.id)).reduce((n, b) => n + b.tokens, 0);
  const fits = used <= WINDOW;
  const has = (g: "knowledge" | "history") => BLOCKS.some((b) => on.has(b.id) && b.gives === g);
  const perReq = (used / 1e6) * PRICE;
  const problems = [
    !fits && "Over the window: the request is rejected.",
    fits && !has("knowledge") && "No help articles: the model will guess the policy.",
    fits && !has("history") && "No history: it forgets what the customer said earlier.",
  ].filter(Boolean) as string[];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Fill the window"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="bg-surface-2 rounded-lg px-3 py-2 text-xs">
            <span className="text-muted">Turn 61 of a chat: </span>
            &ldquo;OK, and can I return the paneer from the order I mentioned?&rdquo;
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {BLOCKS.map((b) => {
              const active = on.has(b.id);
              const fixed = b.id === "question";
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={active}
                  disabled={fixed}
                  onClick={() =>
                    set({
                      blocks: active ? s.blocks.filter((x) => x !== b.id) : [...s.blocks, b.id],
                    })
                  }
                  className={cn(
                    "flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors",
                    active
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                    fixed && "cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-4 shrink-0 place-items-center rounded border",
                      active ? "border-accent bg-accent text-accent-fg" : "border-line-strong",
                    )}
                  >
                    {active && <Check className="size-3" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex justify-between gap-2">
                      <span className="font-semibold">{b.label}</span>
                      <span className="text-muted shrink-0 font-mono">{fmt(b.tokens)}</span>
                    </span>
                    <span className="text-muted">{b.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-muted">Context window: 128k tokens</span>
              <span className={cn("font-mono", !fits && "text-bad")}>
                {fmt(used)} / {fmt(WINDOW)}
              </span>
            </div>
            <div className="bg-surface-2 relative h-4 overflow-hidden rounded">
              <motion.div
                className={cn("absolute inset-y-0 left-0", fits ? "bg-accent" : "bg-bad")}
                animate={{ width: `${Math.min(100, (used / WINDOW) * 100)}%` }}
              />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <p>
                <span className="text-muted">Per request: </span>
                <span className="font-mono">{fits ? usd(perReq) : "n/a"}</span>
              </p>
              <p>
                <span className="text-muted">10,000 requests a day: </span>
                <span className="font-mono">{fits ? usd(perReq * 10_000) : "n/a"}</span>
              </p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={problems.join("|")}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs",
                problems.length ? "border-bad/40 bg-bad/5" : "border-good/40 bg-good/10",
              )}
            >
              {problems.length ? (
                problems.map((p) => (
                  <p key={p} className="flex items-center gap-1.5">
                    <X className="text-bad size-3.5 shrink-0" /> {p}
                  </p>
                ))
              ) : (
                <p className="flex items-center gap-1.5">
                  <Check className="text-good size-3.5" /> The model has what it needs.
                  {used > 20_000 && " But it's paying to read a lot it doesn't need."}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-[10px]">
            Token counts are typical sizes for a support assistant. Price: $2 per million input
            tokens, the Sep 2026 list price of mid-tier models such as Claude Sonnet 5 and
            gpt-6-sol.
          </p>
        </div>
      }
    >
      <p>
        A customer is deep into a chat. Choose what to put in the context for their next message.
      </p>
      <p>
        Find a set that answers correctly, fits, and doesn&apos;t cost more than it needs to. Then
        try the &ldquo;everything&rdquo; options.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Lost in the middle ⭐ ------------------------------------------------------------------------ */

const LIU_POS = [1, 5, 10, 15, 20];

export function LostInTheMiddle() {
  const liu = data.liu;
  const W = 520;
  const H = 180;
  const x = (p: number) => 50 + ((p - 1) / 19) * (W - 80);
  const y = (v: number) => H - 20 - ((v - 50) / 30) * (H - 40);
  const series = liu.models;
  return (
    <StepLayout
      eyebrow="Research"
      title="Lost in the middle"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 text-[11px]">
              Accuracy answering a question from 20 documents, by where the one useful document sat
            </p>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Accuracy by position"
            >
              {[50, 60, 70, 80].map((v) => (
                <g key={v}>
                  <line
                    x1={40}
                    x2={W - 20}
                    y1={y(v)}
                    y2={y(v)}
                    stroke="var(--line-strong)"
                    strokeOpacity={0.35}
                  />
                  <text x={34} y={y(v) + 3} textAnchor="end" className="fill-muted text-[9px]">
                    {v}%
                  </text>
                </g>
              ))}
              {LIU_POS.map((p) => (
                <text
                  key={p}
                  x={x(p)}
                  y={H - 4}
                  textAnchor="middle"
                  className="fill-muted text-[9px]"
                >
                  {p === 1 ? "1st" : p === 20 ? "20th" : `${p}th`}
                </text>
              ))}
              <line
                x1={40}
                x2={W - 20}
                y1={y(liu.closedBook)}
                y2={y(liu.closedBook)}
                stroke="var(--bad)"
                strokeDasharray="4 3"
              />
              <text
                x={W - 22}
                y={y(liu.closedBook) - 4}
                textAnchor="end"
                className="fill-bad text-[9px]"
              >
                no documents: {liu.closedBook}%
              </text>
              {series.map((m) => {
                return (
                  <g key={m.id} opacity={m.id === "gpt35" ? 1 : 0.45}>
                    <motion.polyline
                      fill="none"
                      stroke={m.id === "gpt35" ? "var(--accent)" : "var(--viz-data)"}
                      strokeWidth={m.id === "gpt35" ? 2.5 : 1.5}
                      points={m.acc.map((a, i) => `${x(LIU_POS[i])},${y(a)}`).join(" ")}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                    {m.acc.map((a, i) => (
                      <circle
                        key={i}
                        cx={x(LIU_POS[i])}
                        cy={y(a)}
                        r={3}
                        fill={m.id === "gpt35" ? "var(--accent)" : "var(--viz-data)"}
                      >
                        <title>
                          {m.name}, position {LIU_POS[i]}: {a}%
                        </title>
                      </circle>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [`${series[0].acc[0]}%`, "document first"],
              [`${series[0].acc[2]}%`, "document in the middle"],
              [`${liu.oracle}%`, "only the right document, nothing else"],
            ].map(([v, l]) => (
              <div key={l} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="font-mono text-lg">{v}</p>
                <p className="text-muted text-[11px]">GPT-3.5-Turbo, {l}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Liu et al., &ldquo;Lost in the Middle&rdquo; (TACL 2024), Tables 1 and 6. Newer models
            are better at this, but the Chroma &ldquo;Context Rot&rdquo; study (2025, 18 models)
            still found performance &ldquo;consistently degrades with increasing input
            length&rdquo;.
          </p>
          <p className="text-muted flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="bg-accent inline-block h-0.5 w-5" /> GPT-3.5-Turbo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-viz-data/60 inline-block h-0.5 w-5" /> Claude 1.3, LongChat-13B,
              MPT-30B
            </span>
            <span className="flex items-center gap-1.5">
              <span className="border-bad inline-block w-5 border-t border-dashed" /> GPT-3.5 with
              no documents
            </span>
          </p>
        </div>
      }
    >
      <p>
        In 2023, researchers gave models 20 documents and a question whose answer was in just one of
        them, and moved that document around.
      </p>
      <p>
        Accuracy was highest when the answer was first or last, and sagged in the middle. In the
        worst positions GPT-3.5 did slightly <em>worse</em> than with no documents at all.
      </p>
      <p className="text-muted text-sm">
        Practical rule: put the most important material at the start or the end, and keep the
        question last.
      </p>
    </StepLayout>
  );
}

/* 4 ─ More text, more mistakes ⭐ (real runs) ------------------------------------------------------- */

export function MoreTextMoreMistakes() {
  const conds = data.agg.conds;
  const max = Math.max(...conds.map((c) => c.wrong), 1);
  return (
    <StepLayout
      eyebrow="Real model"
      title="More text, more mistakes"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="bg-surface-2 rounded-lg px-3 py-2 text-xs">
            <span className="text-muted">Question: </span>
            {data.agg.question}
          </p>
          <div className="border-line bg-surface overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Context</th>
                  <th className="px-3 py-2 font-medium">Tokens</th>
                  <th className="px-3 py-2 font-medium">Sunday areas found</th>
                  <th className="px-3 py-2 font-medium">Wrong areas listed</th>
                </tr>
              </thead>
              <tbody>
                {conds.map((c) => (
                  <tr
                    key={c.id}
                    className={cn("border-line border-t", c.id === "search5" && "bg-accent-soft")}
                  >
                    <td className="px-3 py-2 font-semibold">{c.label}</td>
                    <td className="px-3 py-2 font-mono">{fmt(c.tokens)}</td>
                    <td className="px-3 py-2">
                      <Bar value={c.recall} max={1} text={`${Math.round(c.recall * 100)}%`} good />
                    </td>
                    <td className="px-3 py-2">
                      <Bar value={c.wrong} max={max} text={c.wrong.toFixed(1)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <p className="text-muted mb-1 text-[11px]">
              A real answer with {data.agg.example.n} articles
            </p>
            <p className="font-mono">{data.agg.example.ans}</p>
            <p className="text-muted mt-1">Correct: {data.agg.example.truth.join(", ")}</p>
          </div>
          <p className="text-subtle text-[10px]">
            {MODEL_NOTE} {data.agg.runs} runs per row, each with 3 Sunday areas at random positions.
            The search row picks the 5 articles that best match the question&apos;s words from the
            30-article set.
          </p>
        </div>
      }
    >
      <p>
        Now a harder job, run for real on a small open model: find <em>every</em> area with no
        Sunday delivery, from a pile of help articles.
      </p>
      <p>
        As the pile grows, it misses more and invents more. Given only the 5 articles a search
        picked out, it found all three Sunday areas every time, reading a fifth of the tokens. (It
        still added a wrong area or two: a small model, and the next module&apos;s topic.)
      </p>
      <p className="text-muted text-sm">
        This is <Term id="rag">retrieval</Term> in a nutshell: search first, then show the model
        just the relevant pieces. The next module on hallucinations comes back to it.
      </p>
    </StepLayout>
  );
}

const MODEL_NOTE = `${data.agg.model.replace("onnx-community/", "")}, 4-bit, greedy decoding.`;

function Bar({
  value,
  max,
  text,
  good,
}: {
  value: number;
  max: number;
  text: string;
  good?: boolean;
}) {
  return (
    <span className="flex items-center gap-2">
      <span className="bg-surface-2 relative h-2.5 w-24 overflow-hidden rounded">
        <motion.span
          className={cn("absolute inset-y-0 left-0 rounded", good ? "bg-good" : "bg-bad")}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
        />
      </span>
      <span className="font-mono">{text}</span>
    </span>
  );
}

/* 5 ─ Remembering a long conversation ---------------------------------------------------------------- */

const TURN_TOKENS = 400;
const MEMORY: Record<
  string,
  { label: string; tokens: (t: number) => number; remembers: boolean; note: string }
> = {
  all: {
    label: "Keep everything",
    tokens: (t) => t * TURN_TOKENS,
    remembers: true,
    note: "Nothing is lost, but every request re-sends the whole chat. Turn 60 costs 60× turn 1, and long chats eventually hit the window.",
  },
  window: {
    label: "Last 6 turns",
    tokens: (t) => Math.min(t, 6) * TURN_TOKENS,
    remembers: false,
    note: "Cheap and flat, but the address the customer gave in turn 3 has scrolled out. The model has no idea what “the address I gave you” means.",
  },
  summary: {
    label: "Summary + last 6",
    tokens: (t) => Math.min(t, 6) * TURN_TOKENS + (t > 6 ? Math.min(1_000, 300 + t * 12) : 0),
    remembers: true,
    note: "Older turns are squeezed into a short running summary (written by a model) that keeps key facts like the address. Small, and good enough for most chats, but details can be lost in summarising.",
  },
  memory: {
    label: "Memory store",
    tokens: (t) => Math.min(t, 6) * TURN_TOKENS + 200,
    remembers: true,
    note: "Key facts are saved to a database as they come up, and fetched back (retrieval or a tool) when relevant. How many assistants “remember” you across chats.",
  },
};

export function LongConversations() {
  const [s, set] = useSceneState<ContextState>();
  const m = MEMORY[s.memory];
  const W = 600;
  const H = 140;
  const maxT = MEMORY.all.tokens(60);
  const pts = (fn: (t: number) => number) =>
    Array.from(
      { length: 60 },
      (_, i) => `${20 + (i / 59) * (W - 30)},${H - 10 - (fn(i + 1) / maxT) * (H - 20)}`,
    ).join(" ");
  return (
    <StepLayout
      eyebrow="Compare"
      title="Remembering a long conversation"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.memory}
            options={Object.entries(MEMORY).map(([k, v]) => [k, v.label])}
            onChange={(v) => set({ memory: v })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 text-[11px]">
              Tokens of history sent with each request, turns 1 to 60
            </p>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="History tokens per turn"
            >
              <line x1={20} x2={W - 10} y1={H - 10} y2={H - 10} stroke="var(--line-strong)" />
              {Object.entries(MEMORY).map(([k, v]) => (
                <polyline
                  key={k}
                  points={pts(v.tokens)}
                  fill="none"
                  stroke={k === s.memory ? "var(--accent)" : "var(--line-strong)"}
                  strokeWidth={k === s.memory ? 2.5 : 1}
                />
              ))}
              <text x={W - 10} y={12} textAnchor="end" className="fill-muted text-[9px]">
                {fmt(maxT)}
              </text>
            </svg>
            <p className="mt-1 text-xs">
              At turn 60: <span className="font-mono">{fmt(m.tokens(60))}</span> tokens of history
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="bg-surface-2 rounded-lg px-3 py-2 text-xs">
              <span className="text-muted">Turn 60: </span>&ldquo;Send the replacement to the
              address I gave you earlier.&rdquo;
            </p>
            <motion.p
              key={s.memory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs",
                m.remembers ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {m.remembers ? (
                <Check className="text-good size-3.5" />
              ) : (
                <X className="text-bad size-3.5" />
              )}
              {m.remembers ? "Knows the address from turn 3" : "Address is gone"}
            </motion.p>
          </div>
          <FrameCaption frameKey={s.memory} title={m.label}>
            {m.note}
          </FrameCaption>
          <p className="text-subtle text-[10px]">Illustrative: 400 tokens per turn.</p>
        </div>
      }
    >
      <p>
        A model remembers nothing between requests. A chat &ldquo;remembers&rdquo; only because your
        app re-sends the conversation each time.
      </p>
      <p>Compare four ways to handle a 60-turn chat.</p>
    </StepLayout>
  );
}

/* 6 ─ Stable parts first (prompt caching) ------------------------------------------------------------ */

const CACHE_BLOCKS: Record<string, { label: string; tokens: number; stable: boolean }> = {
  system: { label: "Instructions", tokens: 1_500, stable: true },
  tools: { label: "Tool definitions", tokens: 4_000, stable: true },
  catalogue: { label: "Product catalogue", tokens: 20_000, stable: true },
  articles: { label: "Retrieved articles", tokens: 1_500, stable: false },
  question: { label: "Customer's message", tokens: 60, stable: false },
};

export function StableFirst() {
  const [s, set] = useSceneState<ContextState>();
  const order = s.order;
  const firstChange = order.findIndex((id) => !CACHE_BLOCKS[id].stable);
  const rows = order.map((id, i) => ({
    id,
    ...CACHE_BLOCKS[id],
    cached: firstChange === -1 || i < firstChange,
  }));
  const prefix = rows.filter((r) => r.cached).reduce((n, r) => n + r.tokens, 0);
  const total = rows.reduce((n, r) => n + r.tokens, 0);
  const cost = ((total - prefix) * PRICE + prefix * PRICE * 0.1) / 1e6;
  const full = (total * PRICE) / 1e6;
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    set({ order: next });
  };
  return (
    <StepLayout
      eyebrow="Rearrange"
      title="Stable parts first"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-1.5">
            <AnimatePresence initial={false}>
              {rows.map((r, i) => (
                <motion.div
                  key={r.id}
                  layout
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs",
                    r.cached ? "border-good/40 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <span className="flex flex-col">
                    <button
                      type="button"
                      aria-label={`Move ${r.label} up`}
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="text-muted hover:text-fg disabled:opacity-30"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${r.label} down`}
                      onClick={() => move(i, 1)}
                      disabled={i === rows.length - 1}
                      className="text-muted hover:text-fg disabled:opacity-30"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                  </span>
                  <span className="flex-1">
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-muted">
                      {" "}
                      · {r.stable ? "same on every request" : "changes every request"}
                    </span>
                  </span>
                  <span className="text-muted font-mono">{fmt(r.tokens)}</span>
                  <span className="w-16 text-right text-[11px]">
                    {r.cached ? "cached" : "full price"}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[11px]">Cached prefix</p>
              <p className="font-mono">
                {fmt(prefix)} / {fmt(total)}
              </p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[11px]">Per request</p>
              <p className="font-mono">{usd(cost)}</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[11px]">10,000 a day</p>
              <p className="font-mono">
                {usd(cost * 10_000)}{" "}
                <span className="text-muted text-[10px]">vs {usd(full * 10_000)}</span>
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Cached input billed at 10% of $2 per million, as for Claude Sonnet 5 and OpenAI&apos;s
            GPT-5.6-and-later models (Sep 2026). Writing to the cache costs extra (1.25×) and the
            default cache lasts 5 minutes; with steady traffic it stays warm. Gemini caches similar
            prefixes automatically.
          </p>
        </div>
      }
    >
      <p>
        Providers can reuse work for the start of a prompt that they&apos;ve seen recently. This{" "}
        <Term id="prompt-caching">prompt caching</Term> makes those tokens much cheaper and faster.
      </p>
      <p>
        But the cache only covers an <em>identical beginning</em>: the first thing that changes ends
        it. Reorder the blocks to cache as much as possible.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function WhereItLives() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where should it live?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="where"
            prompt="You're building the support assistant. Where does each piece of information belong?"
            categories={[
              { id: "always", label: "Every request" },
              { id: "fetch", label: "Fetch when needed" },
              { id: "out", label: "Leave out" },
            ]}
            items={[
              {
                id: "tone",
                label: "Tone and safety rules",
                category: "always",
                why: "Short, needed every time, and stable: ideal for the cached start of the prompt.",
              },
              {
                id: "date",
                label: "Today's date",
                category: "always",
                why: "A few tokens, and the model can't know it otherwise. Put it after the cached part, since it changes daily.",
              },
              {
                id: "policy",
                label: "The 400-article help centre",
                category: "fetch",
                why: "Too big to send each time. Search it and include the few relevant articles.",
              },
              {
                id: "orders",
                label: "This customer's order history",
                category: "fetch",
                why: "Fetch it with a tool when the conversation needs it, for this customer only.",
              },
              {
                id: "card",
                label: "The customer's full card number",
                category: "out",
                why: "The model never needs it to help, and anything in the context can leak into an answer or a log.",
              },
              {
                id: "logs",
                label: "Last year's chats with all customers",
                category: "out",
                why: "Irrelevant to this customer's question, and private to other people.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Every piece of context has a cost: tokens, attention and risk. Place each one.</p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "The context is the model's whole world",
    "If it's not in the training or on the desk, the model can only guess.",
  ],
  [
    "Less, but relevant",
    "Long, cluttered contexts cost more and get worse answers. Search first, then include the best few pieces.",
  ],
  ["Position matters", "Important material at the start or end, the question last."],
  ["Stable first, changing last", "Order the context so prompt caching can reuse the beginning."],
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
      <p>Even with perfect context, models sometimes state things that aren&apos;t true.</p>
      <p>Next: hallucinations, why they happen and what reduces them.</p>
    </StepLayout>
  );
}
