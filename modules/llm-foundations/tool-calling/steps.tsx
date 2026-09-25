"use client";

import { Fragment } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Cog, MessageSquare, ShieldCheck, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import { validateRefund } from "./validate";
import { REFUND_ARGS, type ToolState } from "./state";

const MODEL = data.model.replace("onnx-community/", "");

function tryParse(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/* 1 ─ Prose breaks code ------------------------------------------------------------------------------ */

export function ProseBreaksCode() {
  const [s, set] = useSceneState<ToolState>();
  const r = data.replies[s.reply];
  const parsed = tryParse(r.text);
  const urgency =
    parsed.ok && parsed.value && typeof parsed.value === "object"
      ? String((parsed.value as Record<string, unknown>).urgency)
      : null;
  return (
    <StepLayout
      eyebrow="Real outputs"
      title="Prose breaks code"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {data.replies.map((x, i) => (
              <button
                key={x.label}
                type="button"
                onClick={() => set({ reply: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  i === s.reply ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="text-muted mb-1 flex items-center gap-1.5 text-[11px]">
                <MessageSquare className="size-3.5" /> The model&apos;s reply
              </p>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={s.reply}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-surface-2 max-h-56 overflow-y-auto rounded-lg p-2 font-mono text-[11px] [overflow-wrap:anywhere] whitespace-pre-wrap"
                >
                  {r.text}
                </motion.pre>
              </AnimatePresence>
            </div>
            <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border p-3">
              <p className="text-muted flex items-center gap-1.5 text-[11px]">
                <Cog className="size-3.5" /> Your ticket software runs
              </p>
              <Code>{"const ticket = JSON.parse(reply);\nqueue.add(ticket.urgency, ticket);"}</Code>
              <motion.div
                key={s.reply}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  parsed.ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                {parsed.ok ? (
                  <p className="flex items-center gap-1.5">
                    <Check className="text-good size-3.5" /> Ticket filed as{" "}
                    <span className="font-mono">{urgency}</span>
                  </p>
                ) : (
                  <>
                    <p className="flex items-center gap-1.5 font-semibold">
                      <X className="text-bad size-3.5" /> Crash
                    </p>
                    <p className="mt-1 font-mono text-[11px] [overflow-wrap:anywhere]">
                      SyntaxError: {parsed.error}
                    </p>
                  </>
                )}
              </motion.div>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Replies from the prompting module ({MODEL}, &ldquo;charged twice&rdquo; email). The
            parser is your browser&apos;s own JSON.parse, running live.
          </p>
        </div>
      }
    >
      <p>
        A person reads around stray words. A program doesn&apos;t. When code consumes a model&apos;s
        answer, &ldquo;nearly JSON&rdquo; is the same as no answer at all.
      </p>
      <p>
        Try the four real replies from the last module. Even the &ldquo;format only&rdquo; reply,
        which is correct JSON, is wrapped in a Markdown code fence that the parser rejects.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Only valid words allowed ⭐ -------------------------------------------------------------------- */

const SLOT_NAMES = ["Thank the driver", "Charged twice", "No order number"];
const SLOT_NOTES = [
  "Unconstrained, the top pick is “Low” with a capital L: not one of the allowed values, so a strict app would reject it. With the schema enforced, only low, medium and high remain. “low” now gets two-thirds of the probability, but “high” keeps about a third: the schema fixes the shape, not the judgement.",
  "The model is confident (“High”, “U”, probably the start of “Urgent”, “Critical”), but in the wrong spellings. Enforced, it can only be “high”.",
  "The schema allows “none” or an order number starting with KX-. Tokens like “no” and “n” survive because they can still become “none”. “N”, “not”, “Not” and “unknown”, the model’s favourites, are gone. A tiny chance of “K” (starting an invented order number) remains: valid shape, false content.",
];

export function ConstrainedDecoding() {
  const [s, set] = useSceneState<ToolState>();
  const slot = data.slots[s.slot];
  const allowed = new Map(slot.allowed.map(([t, p]) => [t as string, p as number]));
  const zAllowed = slot.allowed.reduce((a, [, p]) => a + (p as number), 0);
  const rows: [string, number, boolean][] = s.enforce
    ? slot.allowed
        .filter(([, p]) => (p as number) / zAllowed > 0.0005)
        .map(([t, p]) => [t as string, (p as number) / zAllowed, true])
    : slot.top.map(([t, p]) => [t as string, p as number, allowed.has(t as string)]);
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <StepLayout
      eyebrow="Real probabilities"
      title="Only valid words allowed"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {SLOT_NAMES.map((n, i) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set({ slot: i })}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs",
                    i === s.slot
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <Segmented
              size="sm"
              value={s.enforce ? "on" : "off"}
              options={[
                ["off", "Free"],
                ["on", "Schema enforced"],
              ]}
              onChange={(v) => set({ enforce: v === "on" })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="font-mono text-xs">
              {slot.prefix}
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="bg-accent inline-block h-3.5 w-1.5 translate-y-0.5"
              />
            </p>
            <p className="text-muted mt-1 text-[11px]">
              Schema:{" "}
              <span className="font-mono">
                {slot.field === "urgency"
                  ? '"urgency": "low" | "medium" | "high"'
                  : '"order_id": "none" or "KX-" + 5 digits'}
              </span>
            </p>
            <div className="mt-3 grid gap-1">
              <AnimatePresence initial={false}>
                {rows.map(([t, p, ok]) => (
                  <motion.div
                    key={t}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span
                      className={cn(
                        "w-20 shrink-0 truncate text-right font-mono",
                        !ok && "text-bad line-through",
                      )}
                    >
                      {JSON.stringify(t)}
                    </span>
                    <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
                      <motion.span
                        className={cn(
                          "absolute inset-y-0 left-0 rounded",
                          ok ? "bg-accent" : "bg-bad/50",
                        )}
                        animate={{ width: `${(p / max) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </span>
                    <span className="text-muted w-12 text-right font-mono">
                      {(p * 100).toFixed(p < 0.01 ? 2 : 1)}%
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <FrameCaption frameKey={`${s.slot}${s.enforce}`} title={SLOT_NAMES[s.slot]}>
            {SLOT_NOTES[s.slot]}
          </FrameCaption>
        </div>
      }
    >
      <p>
        APIs can now guarantee the shape. You give a <Term id="json-schema">JSON schema</Term>, and
        while the model writes, every token that would break it is blocked. This is{" "}
        <Term id="constrained-decoding">constrained decoding</Term>.
      </p>
      <p>
        These are the real next-token probabilities from {MODEL}, at the moment it must fill in a
        field. Switch the schema on and watch invalid tokens disappear.
      </p>
      <p className="text-muted text-sm">
        Free list: the model&apos;s top 12 tokens (crossed out if the schema forbids them).
      </p>
    </StepLayout>
  );
}

/* 3 ─ The tool-calling loop ⭐ ----------------------------------------------------------------------- */

const CHAT_NAMES = ["Where's my order?", "Sunday delivery?", "Refund please", "Just saying thanks"];

type Frame = { who: "app" | "model" | "code"; title: string; text: string; code?: string };

function framesFor(chat: number, forced: boolean): Frame[] {
  const c = data.chats[chat];
  const toolList = data.tools.map((t) => t.function.name).join(", ");
  const start: Frame = {
    who: "app",
    title: "Your app sends the question, plus a tool list",
    text: `Alongside the system and user messages, the request lists the tools the model may ask for (${toolList}), each with a name, a description and a JSON schema for its arguments.`,
    code: JSON.stringify(data.tools[chat === 2 ? 2 : chat === 1 ? 1 : 0].function, null, 2),
  };
  const useForced = chat === 1 && forced;
  const call = useForced ? data.forced.call : c.call;
  const first = useForced ? data.forced.first : c.first;
  const result = useForced ? data.forced.result : c.result;
  const final = useForced ? data.forced.final : c.final;
  if (!call) {
    return [
      start,
      {
        who: "model",
        title: chat === 1 ? "The model answers without the tool" : "No tool needed: a plain answer",
        text:
          chat === 1
            ? "It had a search_help tool that would have answered this, but chose not to call it and replied vaguely. Small models often under-use tools. Try forcing a tool call."
            : "Nothing to look up, so the model just replies. Deciding when not to call a tool is part of the job.",
        code: first,
      },
    ];
  }
  return [
    start,
    {
      who: "model",
      title: "The model asks for a function",
      text: useForced
        ? "With the tool call forced (tool_choice), the model must start with a call. It picks search_help and writes a sensible query."
        : "It doesn't run anything: it writes a structured request, the name of a tool and its arguments. This is its whole reply.",
      code: first,
    },
    {
      who: "code",
      title: "Your code runs it",
      text:
        chat === 2
          ? "Your app decides whether to act. Here the refund system accepts the request but holds it for a staff member: the model asked for money to move without asking the customer anything first."
          : "Your app checks the request, calls the real function and gets a result. The model never touches your systems.",
      code: JSON.stringify(result, null, 2),
    },
    {
      who: "app",
      title: "The result goes back to the model",
      text: "The result is added to the conversation as a tool message, and the whole conversation is sent again.",
    },
    {
      who: "model",
      title: "The model writes the answer",
      text: "Now it answers from real data. It could also ask for another tool: agents are this loop, repeated.",
      code: final ?? "",
    },
  ];
}

const ACTORS = ["app", "model", "code"] as const;

function ActorStrip({ who }: { who: Frame["who"] }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5" aria-hidden>
      {ACTORS.map((a, i) => {
        const { label, Icon } = WHO[a];
        const on = a === who;
        return (
          <Fragment key={a}>
            {i > 0 && <span className="text-subtle text-xs">⇄</span>}
            <motion.div
              animate={{ scale: on ? 1.04 : 1, opacity: on ? 1 : 0.5 }}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs",
                on ? "border-accent bg-accent-soft font-semibold" : "border-line bg-surface",
              )}
            >
              <Icon className={cn("size-4", on && "text-accent")} />
              {label}
            </motion.div>
          </Fragment>
        );
      })}
    </div>
  );
}

const WHO = {
  app: { label: "Your app", Icon: MessageSquare },
  model: { label: "Model", Icon: Cog },
  code: { label: "Your code", Icon: ShieldCheck },
};

export function ToolLoop() {
  const [s, set] = useSceneState<ToolState>();
  const frames = framesFor(s.chat, s.forced);
  const step = Math.min(s.frame, frames.length - 1);
  const f = frames[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="The tool-calling loop"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {CHAT_NAMES.map((n, i) => (
              <button
                key={n}
                type="button"
                onClick={() => set({ chat: i, frame: 0, forced: false })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  i === s.chat ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
            {s.chat === 1 && (
              <button
                type="button"
                aria-pressed={s.forced}
                onClick={() => set({ forced: !s.forced, frame: 1 })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.forced
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-accent/60 border-dashed",
                )}
              >
                {s.forced ? "Tool call forced" : "Force a tool call"}
              </button>
            )}
          </div>
          <p className="bg-surface-2 rounded-lg px-3 py-2 text-xs">
            <span className="text-muted">Customer: </span>
            {data.chats[s.chat].question}
          </p>
          <ActorStrip who={f.who} />
          <AnimatePresence mode="wait">
            <motion.div
              key={`${s.chat}${s.forced}${step}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-32"
            >
              {f.code ? (
                <pre className="bg-surface-2 border-line max-h-60 overflow-y-auto rounded-xl border p-3 font-mono text-xs [overflow-wrap:anywhere] whitespace-pre-wrap">
                  {f.code}
                </pre>
              ) : (
                <div className="border-line bg-surface text-muted rounded-xl border p-3 font-mono text-xs">
                  {'{ role: "tool", content: <the result> }'}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <Stepper step={step} count={frames.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={`${s.chat}${s.forced}${step}`} title={f.title}>
            {f.text}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Real replies from {MODEL} using its own tool-call format; the tool results are made up
            for the exercise.
          </p>
        </div>
      }
    >
      <p>
        A model can&apos;t look anything up or change anything. With{" "}
        <Term id="tool-calling">tool calling</Term>, it can ask: it writes a structured request, and
        your code decides whether to carry it out.
      </p>
      <p>
        Like a waiter who can&apos;t cook: they write the order on a slip in a fixed format, and the
        kitchen does the work. The model decides; your code acts.
      </p>
      <p className="text-muted text-sm">Pick a customer message and step through.</p>
    </StepLayout>
  );
}

/* 4 ─ Break the schema (sandbox) --------------------------------------------------------------------- */

const PRESETS: [string, string][] = [
  ["The model's real call", REFUND_ARGS],
  [
    "Amount as text",
    '{"order_id": "KX-51102", "amount_rupees": "2,340", "reason": "duplicate charges"}',
  ],
  ["Missing reason", '{"order_id": "KX-51102", "amount_rupees": 2340}'],
  ["Trailing comma", '{"order_id": "KX-51102", "amount_rupees": 2340, "reason": "duplicate",}'],
  [
    "Invented order",
    '{"order_id": "KX-99999", "amount_rupees": 2340, "reason": "duplicate charges"}',
  ],
  ["Too much", '{"order_id": "KX-51102", "amount_rupees": 23400, "reason": "duplicate charges"}'],
];

const STAGES = [
  { id: "json", label: "Parses as JSON" },
  { id: "schema", label: "Matches the schema" },
  { id: "business", label: "Passes your business rules" },
] as const;

export function BreakTheSchema() {
  const [s, set] = useSceneState<ToolState>();
  const v = validateRefund(s.args);
  const failedAt = STAGES.findIndex((st) => st.id === v.stage);
  return (
    <StepLayout
      eyebrow="Sandbox"
      title="Break the schema"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(([n, t]) => (
              <button
                key={n}
                type="button"
                onClick={() => set({ args: t })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.args === t ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <label className="text-muted text-[11px]" htmlFor="refund-args">
            issue_refund arguments (edit freely)
          </label>
          <textarea
            id="refund-args"
            value={s.args}
            onChange={(e) => set({ args: e.target.value })}
            spellCheck={false}
            rows={3}
            className="border-line bg-surface focus:border-accent w-full rounded-xl border p-3 font-mono text-xs outline-none"
          />
          <div className="grid gap-1.5">
            {STAGES.map((st, i) => {
              const passed = v.stage === "ok" || i < failedAt;
              const failed = i === failedAt;
              return (
                <div
                  key={st.id}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    passed
                      ? "border-good/40 bg-good/10"
                      : failed
                        ? "border-bad/40 bg-bad/10"
                        : "border-line text-subtle",
                  )}
                >
                  <p className="flex items-center gap-1.5">
                    {passed ? (
                      <Check className="text-good size-3.5" />
                    ) : failed ? (
                      <X className="text-bad size-3.5" />
                    ) : (
                      <span className="size-3.5" />
                    )}
                    {st.label}
                  </p>
                  {failed &&
                    v.errors.map((e) => (
                      <p
                        key={e}
                        className="mt-0.5 ml-5 font-mono text-[11px] [overflow-wrap:anywhere]"
                      >
                        {e}
                      </p>
                    ))}
                </div>
              );
            })}
          </div>
          <motion.div
            key={v.stage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">What your code does</p>
            <p className="text-muted mt-1">
              {v.stage === "ok"
                ? "Queues the refund, and because it moves money, holds it for a person to approve."
                : v.stage === "business"
                  ? "Refuses, and sends the reason back as the tool result so the model can tell the customer or ask for the right details. A schema can't know your records: only your code can."
                  : "Refuses, and sends the error back as the tool result. The model can often fix its call on the next try. With strict structured outputs, errors like these are blocked while the model writes."}
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Every tool call is untrusted input. Before acting, your code checks it in three layers: is
        it JSON, does it match the <Term id="json-schema">schema</Term>, and does it make sense
        against your own records?
      </p>
      <p>
        Pick a broken call, or edit the arguments yourself. Constrained decoding removes the first
        two kinds of error. The third is always your job.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: order the loop -------------------------------------------------------------------- */

export function OrderTheLoop() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the loop in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="loop-order"
            prompt="Drag the steps of one tool call into the order they happen."
            items={[
              { id: "send", label: "App sends the conversation and the tool definitions" },
              { id: "ask", label: "Model replies with a tool name and arguments" },
              { id: "check", label: "Your code validates the arguments" },
              { id: "run", label: "Your code runs the function" },
              { id: "back", label: "The result is added to the conversation as a tool message" },
              { id: "answer", label: "Model writes its answer (or asks for another tool)" },
            ]}
            explanation="The model only ever produces text. Everything that touches the world happens in your code, between its turns, where you can check, refuse or ask a person."
          />
        </div>
      }
    >
      <p>One last look at the loop before we talk about which calls deserve a human check.</p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: who approves? --------------------------------------------------------------------- */

export function WhoApproves() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Run it, or ask first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="approve"
            prompt="The model asks for each of these. Should your app run it straight away, or ask a person to confirm first?"
            categories={[
              { id: "auto", label: "Run it" },
              { id: "confirm", label: "Confirm first" },
            ]}
            items={[
              {
                id: "status",
                label: "get_order_status for the customer's own order",
                category: "auto",
                why: "Read-only and scoped to the customer: worst case, a wasted lookup.",
              },
              {
                id: "search",
                label: "search_help for “delivery areas”",
                category: "auto",
                why: "Reads public help articles; nothing changes.",
              },
              {
                id: "refund",
                label: "issue_refund of Rs 2,340",
                category: "confirm",
                why: "Money moves and can't easily come back. In the loop above, the model asked for this refund without checking anything with the customer.",
              },
              {
                id: "cancel",
                label: "cancel_order for an order out for delivery",
                category: "confirm",
                why: "Changes the real world and is hard to undo. Show the customer what will happen and let them confirm.",
              },
              {
                id: "email",
                label: "send_email to the customer with a summary",
                category: "confirm",
                why: "Anything that leaves your system in your name deserves review, at least until you trust the pattern.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Tools turn words into actions, so mistakes stop being just wrong text. A useful line: reads
        can run; anything that spends, changes, deletes or sends waits for a person.
      </p>
      <p className="text-muted text-sm">
        The MCP specification goes further: apps must get the user&apos;s explicit consent before
        invoking any tool.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Names you'll meet ------------------------------------------------------------------------------ */

const NAMES: [string, string, string][] = [
  [
    "OpenAI",
    "Function calling; tool_choice auto / required / none",
    "Structured Outputs, strict: true (since Aug 2024)",
  ],
  [
    "Anthropic",
    "Tool use; tool_choice auto / any / tool / none",
    "Structured outputs and strict tool use",
  ],
  [
    "Google Gemini",
    "Function calling; modes AUTO / ANY / NONE / VALIDATED",
    "JSON Schema responses",
  ],
  [
    "Open models",
    "Chat templates with tool calls",
    "vLLM structured outputs, llama.cpp grammars, Outlines",
  ],
];

export function Names() {
  return (
    <StepLayout
      eyebrow="Reference"
      title="Names you'll meet"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Provider</th>
                  <th className="px-3 py-2 font-medium">Tools</th>
                  <th className="px-3 py-2 font-medium">Guaranteed shape</th>
                </tr>
              </thead>
              <tbody>
                {NAMES.map(([p, t, g]) => (
                  <tr key={p} className="border-line border-t">
                    <td className="px-3 py-2 font-semibold">{p}</td>
                    <td className="px-3 py-2">{t}</td>
                    <td className="px-3 py-2">{g}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-accent/40 bg-accent-soft rounded-xl border p-3 text-xs">
            <p className="font-semibold">Model Context Protocol (MCP)</p>
            <p className="text-muted mt-1">
              An open standard for plugging tools into AI apps: write a tool server once, and any
              MCP-capable app (chat assistants, coding tools, agents) can use it. Anthropic
              introduced it in November 2024 and in December 2025 handed it to the Agentic AI
              Foundation under the Linux Foundation, co-founded with OpenAI and Block.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Every major provider supports tools and schema-guaranteed output, under slightly different
        names. The loop you stepped through is the same everywhere, and the{" "}
        <Term id="mcp">Model Context Protocol</Term> lets one tool server work with all of them.
      </p>
      <p className="text-muted text-sm">
        Every provider also has a <span className="font-mono">tool_choice</span>-style setting: let
        the model decide, force a tool call (as you did for the Sunday question), or forbid tools.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Code needs data, not prose",
    "Nearly-JSON crashes a parser. Ask for a schema, and enforce it where you can.",
  ],
  [
    "Schemas fix shape, not truth",
    "Constrained decoding blocks invalid tokens; it can't stop a wrong but valid value.",
  ],
  [
    "The model decides, your code acts",
    "A tool call is a request. Validate it, run it, send the result back.",
  ],
  [
    "Confirm what can't be undone",
    "Reads can run automatically; money, deletions and messages wait for a person.",
  ],
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
      <p>Tools let a model fetch what it doesn&apos;t know. But what should go into its context?</p>
      <p>Next: context engineering.</p>
    </StepLayout>
  );
}
