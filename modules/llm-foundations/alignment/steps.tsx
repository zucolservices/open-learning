"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  CANDIDATES,
  CROWD,
  FEATURES,
  NEW_PROMPT,
  PAIRS,
  crowdPairs,
  fitReward,
  score,
  type Vec,
} from "./reward";
import type { AlignState } from "./state";

/* 1 ─ You are the rater ⭐ ---------------------------------------------------------------------------- */

export function Rater() {
  const [s, set] = useSceneState<AlignState>();
  const done = s.choices.filter(Boolean).length;
  const choose = (i: number, c: "a" | "b") =>
    set({ choices: s.choices.map((x, k) => (k === i ? c : x)) });
  return (
    <StepLayout
      eyebrow="Your turn"
      title="You are the rater"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          {PAIRS.map((p, i) => (
            <div key={p.prompt} className="border-line bg-surface rounded-xl border p-3">
              <p className="mb-2 text-xs font-semibold">{p.prompt}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["a", "b"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => choose(i, k)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-xs transition",
                      s.choices[i] === k
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    <span className="text-muted mr-1 font-mono">{k.toUpperCase()}</span> {p[k].text}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-muted text-xs">
            {done} of 4 rated. Your ratings join the crowd&apos;s in the next step.
          </p>
        </div>
      }
    >
      <p>
        How do you teach a model what a <em>good</em> answer is? Writing ideal answers is slow.
        It&apos;s much quicker to show people two answers and ask which is better, like judging a
        tasting contest.
      </p>
      <p>
        Pick the better answer in each pair. Thousands of judgements like these are the raw material
        of <Term id="rlhf">RLHF</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Learn a reward, chase it ⭐ ---------------------------------------------------------------------- */

export function Reward() {
  const [s, set] = useSceneState<AlignState>();
  const w = useMemo(() => {
    const data = crowdPairs(CROWD[s.crowd]);
    s.choices.forEach((c, i) => {
      if (!c) return;
      const p = PAIRS[i];
      const win = c === "a" ? p.a.f : p.b.f;
      const lose = c === "a" ? p.b.f : p.a.f;
      for (let k = 0; k < 5; k++) data.push({ win, lose }); // each of your ratings counts as 5 raters
    });
    return fitReward(data);
  }, [s.crowd, s.choices]);
  const ranked = CANDIDATES.map((c, i) => ({ i, c, r: score(w as Vec, c) })).sort(
    (a, b) => b.r - a.r,
  );
  const pick = ranked[0];
  const max = Math.max(...w.map(Math.abs), 1);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Learn a reward, then chase it"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">The crowd of raters</span>
            <Segmented
              size="sm"
              value={s.crowd}
              options={[
                ["typical", "Quick judgements"],
                ["guided", "With guidelines: check facts, ignore flattery"],
              ]}
              onChange={(v) => set({ crowd: v as AlignState["crowd"] })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[10px]">
              What the reward model learned to reward (+) or punish (−)
            </p>
            <div className="grid gap-1.5">
              {FEATURES.map((f, i) => (
                <div key={f} className="flex items-center gap-2 text-xs">
                  <span className="w-36 shrink-0">{f}</span>
                  <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
                    <span className="bg-line-strong absolute inset-y-0 left-1/2 w-px" />
                    <motion.span
                      className={cn(
                        "absolute inset-y-0 rounded",
                        w[i] >= 0 ? "bg-good/70" : "bg-bad/70",
                      )}
                      initial={false}
                      animate={{
                        left: w[i] >= 0 ? "50%" : `${50 - (Math.abs(w[i]) / max) * 50}%`,
                        width: `${(Math.abs(w[i]) / max) * 50}%`,
                      }}
                    />
                  </span>
                  <span className="text-muted w-10 text-right font-mono">
                    {w[i] >= 0 ? "+" : ""}
                    {w[i].toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[10px]">
              A new request. The assistant, optimised to maximise the reward, picks:
            </p>
            <p className="mt-1 text-xs font-semibold">“{NEW_PROMPT}”</p>
            <div className="mt-2 grid gap-1.5">
              {ranked.map(({ i, c, r }) => (
                <motion.div
                  key={`${s.crowd}${i}`}
                  layout
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-lg border px-2.5 py-1.5 text-xs",
                    i === pick.i ? "border-accent bg-accent-soft" : "border-line opacity-60",
                  )}
                >
                  <span>{c.text}</span>
                  <span className="text-muted shrink-0 font-mono">{r.toFixed(1)}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.crowd}${pick.i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                pick.c.f[0] ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {pick.c.f[0]
                ? "Guided raters rewarded correctness and penalised flattery, so the assistant gives the honest, useful answer."
                : "Sycophancy: raters making quick judgements were a little swayed by long, agreeable answers. The reward model learned that bias, and optimisation amplified it: the assistant now flatters instead of helping."}
            </motion.p>
          </AnimatePresence>
          <p className="text-subtle text-[10px]">
            A real reward model (Bradley–Terry, fitted by gradient descent) on 400 simulated
            comparisons plus yours (each counted 5 times); the crowds&apos; tastes are illustrative.
            Even careful raters are a small part of a large crowd.
          </p>
        </div>
      }
    >
      <p>
        A <Term id="reward-model">reward model</Term> learns to predict which answer people prefer.
        Then the assistant is trained to produce answers that score highly. It will exploit whatever
        the reward model learned, including its mistakes.
      </p>
      <p>Switch between the two crowds and watch what the assistant learns to say.</p>
      <p className="text-muted text-sm">
        This failure is called <Term id="sycophancy">sycophancy</Term>, and it really happened: in
        April 2025 OpenAI rolled back a GPT-4o update within days because leaning on thumbs-up
        feedback made it excessively flattering. Research from 2023 found both people and reward
        models sometimes prefer convincing, agreeable answers over correct ones.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The pipeline --------------------------------------------------------------------------------- */

const F = [
  {
    title: "Start from the fine-tuned assistant",
    text: "Supervised fine-tuning (previous module) gives a model that answers helpfully, most of the time.",
  },
  {
    title: "Collect preferences",
    text: "For many prompts, sample two answers and ask people which is better: the step you just did.",
  },
  {
    title: "Train a reward model",
    text: "A model learns to predict those preferences: given an answer, output a score.",
  },
  {
    title: "Optimise the assistant (RLHF)",
    text: "Reinforcement learning (classically PPO) nudges the assistant toward higher-scoring answers, with a leash that stops it drifting too far from the original, which limits reward hacking.",
  },
  {
    title: "Or skip the reward model (DPO)",
    text: "Direct preference optimisation (2023) adjusts the model straight from the preferred/rejected pairs, with one simple loss. Simpler and now widely used.",
  },
  {
    title: "Or let an AI judge (RLAIF)",
    text: "Constitutional AI (Anthropic, 2022) has a model critique and compare answers against written principles, reducing the need for human labels on every pair.",
  },
];

export function Pipeline() {
  const [s, set] = useSceneState<AlignState>();
  const step = Math.min(s.frame, F.length - 1);
  const f = F[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="How preference training works"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {["SFT model", "Preferences", "Reward model", "RL (PPO)", "DPO", "AI feedback"].map(
              (l, i) => (
                <motion.div
                  key={l}
                  animate={{ scale: i === step ? 1.05 : 1 }}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center text-[11px]",
                    i === step
                      ? "border-accent bg-accent-soft font-semibold"
                      : i < step
                        ? "border-good/40 bg-good/10"
                        : "border-line bg-surface text-muted",
                  )}
                >
                  {l}
                </motion.div>
              ),
            )}
          </div>
          <Stepper step={step} count={F.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={step} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        All of these are forms of <Term id="alignment">alignment</Term>: shaping a model to be
        helpful, honest and harmless, in the way its makers intend.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: over-refusal ------------------------------------------------------------------------ */

export function OverRefusal() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="“I can't help with killing”"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="over-refusal"
            prompt="An assistant refuses “How do I kill a frozen Python process?”. What most likely went wrong in training?"
            options={[
              {
                id: "over",
                label:
                  "Safety training taught it to avoid words like 'kill' too broadly, so it refuses harmless requests (over-refusal)",
                correct: true,
                feedback:
                  "Right. Alignment trades off helpfulness and harmlessness; pushing too hard on one side produces refusals of perfectly safe requests. Good preference data includes 'helpful' examples near the boundary.",
              },
              {
                id: "ignorant",
                label: "It doesn't know what a Python process is",
                feedback:
                  "It almost certainly does; the refusal comes from the safety tuning, not a lack of knowledge.",
              },
              {
                id: "right",
                label: "Nothing: refusing is always the safe choice",
                feedback:
                  "Refusing harmless requests has real costs: it's unhelpful and teaches users to distrust the assistant.",
              },
              {
                id: "sampling",
                label: "Bad luck in sampling",
                feedback: "A consistent refusal pattern comes from training, not chance.",
              },
            ]}
            explanation="Over-refusal and sycophancy are opposite failures of the same process: the model learns what the preference data rewards, including its blind spots."
          />
        </div>
      }
    >
      <p>You saw this one in the rating step. How did you rate it?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Preferences, not just examples",
    "Comparing two answers is easier than writing the perfect one.",
  ],
  ["Reward model", "Learns to score answers the way raters do, biases included."],
  ["Optimisation amplifies", "The assistant exploits whatever the reward rewards."],
  ["RLHF, DPO, RLAIF", "Different routes to the same goal: shaping behaviour with preferences."],
  ["Two failure modes", "Sycophancy (too agreeable) and over-refusal (too cautious)."],
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
      <p>Preference training can reward more than good answers: it can reward good thinking.</p>
      <p>Next: reasoning models.</p>
    </StepLayout>
  );
}
