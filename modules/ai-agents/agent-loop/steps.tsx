"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES, PHASES } from "./model";
import type { LoopState } from "./state";

/* 1 ─ How a detective works ----------------------------------------------------------------------- */

export function Detective() {
  const steps = [
    ["Think", "“The butler had a key. Was he home on Tuesday?”"],
    ["Act", "Ask the neighbour."],
    ["Observe", "“He left on Monday.”"],
    ["Repeat", "Rule him out; think about the gardener next."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="How a detective works"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            {steps.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 * i }}
                className={cn(
                  "rounded-xl border px-4 py-3",
                  i === 3 ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="text-accent font-mono text-xs">
                  {i + 1}. {t}
                </p>
                <p className="text-muted mt-1 text-xs">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A detective doesn&apos;t solve a case in one leap. They think about what they need to know,
        go and find out, look at what they learned, and decide the next question, until the case is
        solved.
      </p>
      <p>
        Every agent runs the same <Term id="agent-loop">loop</Term>: the model decides an action,
        your code carries it out, and the result, an <Term id="observation">observation</Term>, goes
        back to the model for the next decision.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One run, turn by turn ⭐ -------------------------------------------------------------------- */

const ROLE: Record<string, string> = { user: "You", model: "Model", tool: "Tool result" };

export function OneRun() {
  const [s, set] = useSceneState<LoopState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  const msgs = FRAMES.slice(0, s.frame + 1).map((x) => x.add);
  return (
    <StepLayout
      eyebrow="Step-through"
      title="One run, turn by turn"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            {PHASES.map((p) => (
              <span
                key={p.id}
                className={cn(
                  "rounded-full border px-3 py-1",
                  f.phase === p.id || (f.phase === "act" && p.id === "think")
                    ? "border-accent bg-accent-soft font-semibold"
                    : "border-line text-muted",
                )}
              >
                {p.label}
              </span>
            ))}
            <span className="text-muted ml-auto font-mono">turn {f.turn} / max 10</span>
          </div>
          <div className="border-line bg-surface flex min-h-60 flex-col gap-2 rounded-xl border p-3">
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "max-w-[90%] rounded-lg px-3 py-2 text-xs",
                  m.role === "user"
                    ? "bg-surface-2 self-end"
                    : m.role === "tool"
                      ? "border-viz-compute bg-viz-compute/10 border font-mono"
                      : "border-accent/50 bg-accent-soft border",
                )}
              >
                <p className="text-muted mb-0.5 text-[10px]">{ROLE[m.role]}</p>
                <p>{m.text}</p>
                {m.call && <p className="text-accent mt-1 font-mono">→ {m.call}</p>}
              </motion.div>
            ))}
          </div>
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.caption}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Step through a real-shaped run. A customer asks about a late order; the model has two tools.
        Watch who does what: the model only ever writes text or structured{" "}
        <Term id="tool-calling">tool calls</Term>. Your code runs the tools.
      </p>
      <p>
        Each pass round the loop is a turn. The model sees the whole conversation so far every time,
        so the results of earlier tools shape every later decision.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where the loop came from -------------------------------------------------------------------- */

export function ReAct() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where the loop came from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`Thought: I need to find which country the band was formed in.
Action: Search[Arcade Fire]
Observation: Arcade Fire is a Canadian indie rock band formed in Montreal...
Thought: Formed in Canada. Now I need the capital.
Action: Search[capital of Canada]
Observation: Ottawa is the capital city of Canada...
Thought: I have the answer.
Action: Finish[Ottawa]`}</Code>
          <div className="grid gap-2 text-xs sm:grid-cols-3">
            {[
              ["2022", "MRKL (AI21 Labs): a model routes work to specialist modules."],
              ["Oct 2022", "ReAct (Princeton and Google): interleave reasoning and actions."],
              ["Feb 2023", "Toolformer (Meta): a model trained to insert API calls."],
            ].map(([d, t]) => (
              <div key={d} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-accent font-mono">{d}</p>
                <p className="text-muted">{t}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            A trace in ReAct&apos;s style; simplified example, not from the paper.
          </p>
        </div>
      }
    >
      <p>
        The <Term id="react-pattern">ReAct</Term> paper (Yao et al., 2022) made the loop famous: the
        model writes a thought, takes an action, reads the observation, and repeats. Thoughts change
        nothing in the world; actions do.
      </p>
      <p>
        Its biggest gains were on interactive tasks, such as +34 points on a household-task game,
        though it didn&apos;t beat plain step-by-step reasoning everywhere. Today the same loop is
        built into model APIs as tool calling, so nobody parses &ldquo;Action:&rdquo; lines from
        text any more.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Knowing when to stop ------------------------------------------------------------------------ */

export function Stopping() {
  const [s, set] = useSceneState<LoopState>();
  const needed = s.stuck ? Infinity : 4;
  const used = Math.min(needed, s.maxTurns);
  const ok = needed <= s.maxTurns;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Knowing when to stop"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.stuck}
                onChange={(e) => set({ stuck: e.target.checked })}
                className="accent-accent"
              />
              The search tool keeps timing out
            </label>
            <label className="flex flex-1 items-center gap-2">
              <span className="text-muted">max turns</span>
              <input
                type="range"
                min={2}
                max={30}
                value={s.maxTurns}
                onChange={(e) => set({ maxTurns: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Maximum turns"
              />
              <span className="w-6 font-mono">{s.maxTurns}</span>
            </label>
          </div>
          <div className="border-line bg-surface flex flex-wrap gap-1 rounded-xl border p-3">
            {Array.from({ length: 30 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "size-4 rounded-sm",
                  i < used
                    ? ok || i < used - 1
                      ? s.stuck
                        ? "bg-bad/60"
                        : "bg-accent"
                      : "bg-bad"
                    : i < s.maxTurns
                      ? "bg-surface-2"
                      : "bg-surface-2 opacity-30",
                )}
              />
            ))}
          </div>
          <motion.div
            key={`${s.stuck}-${s.maxTurns}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              ok
                ? "border-good bg-good/10"
                : s.maxTurns <= 12
                  ? "border-viz-compute bg-viz-compute/10"
                  : "border-bad bg-bad/10",
            )}
          >
            {ok
              ? `Finished in ${needed} turns: the model replied without a tool call.`
              : s.stuck
                ? `Stopped by the cap after ${s.maxTurns} turns of retrying. ${s.maxTurns > 12 ? "That's a lot of wasted calls before giving up." : "Your code can now apologise or hand over to a person."}`
                : `The cap of ${s.maxTurns} cut off a task that needed 4 turns.`}
          </motion.div>
        </div>
      }
    >
      <p>
        Normally the loop ends when the model replies without asking for a tool. But a confused
        model, or a tool that keeps failing, can loop forever, spending money on every turn.
      </p>
      <p>
        So every agent needs a <Term id="stopping-condition">stopping condition</Term> of your own:
        a maximum number of turns, a time limit or a spending limit. OpenAI&apos;s Agents SDK, for
        example, stops after 10 turns by default.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Put the loop in order ----------------------------------------------------------------------- */

export function LoopOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the loop in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="loop-order"
            prompt="Drag one turn of the agent loop into order."
            items={[
              {
                id: "send",
                label: "Your code sends the conversation and tool descriptions to the model",
              },
              { id: "call", label: "The model replies with a tool call" },
              { id: "run", label: "Your code runs the tool" },
              { id: "result", label: "Your code adds the result to the conversation" },
              {
                id: "again",
                label: "The model sees the result and decides: another tool, or a final answer",
              },
            ]}
            explanation="The model proposes, your code executes, the result becomes an observation, and the model decides again. The loop ends on a reply with no tool call, or when your limit is hit."
          />
        </div>
      }
    >
      <p>Order the steps.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Think, act, observe", "Every agent repeats this loop."],
  ["The model proposes", "Your code runs the tools."],
  ["Results feed back", "Observations shape the next step."],
  ["Natural stop", "A reply with no tool call."],
  ["Your own limits", "Cap turns, time and spend."],
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
      <p>Next: when you need a full agent, and when fixed workflows do the job better.</p>
    </StepLayout>
  );
}
