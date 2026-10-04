"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, call, type FixId } from "./model";
import type { DesignState } from "./state";

/* 1 ─ No screen to fall back on ------------------------------------------------------------------- */

export function NoScreen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="No screen to fall back on"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-accent text-5xl font-semibold"
          >
            88%
          </motion.p>
          <p className="text-muted max-w-sm text-center text-xs">
            of 501 US callers in a 2019 Clutch survey said they&apos;d rather talk to a person than
            navigate a phone menu. The top complaint: options that didn&apos;t fit what they needed.
          </p>
        </div>
      }
    >
      <p>
        Think of a good receptionist. They ask what you need, repeat the key details back while they
        work, fix mistakes without fuss, and put you through to the right person with your details
        already passed on.
      </p>
      <p>
        The phone menu, or <Term id="ivr">IVR</Term>, earned its bad reputation by doing the
        opposite. Voice agents can do better, but only if the conversation is designed: on a call,
        there&apos;s no screen to scroll back through, so every turn has to be clear.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rescue a phone menu ⭐ ---------------------------------------------------------------------- */

export function RescueMenu() {
  const [s, set] = useSceneState<DesignState>();
  const c = call(s.fixes);
  const toggle = (id: FixId) => set({ fixes: { ...s.fixes, [id]: !s.fixes[id] } });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Rescue a phone menu"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[14rem_1fr]">
          <div className="flex flex-col gap-1.5">
            {FIXES.map((f) => (
              <label
                key={f.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                  s.fixes[f.id] ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s.fixes[f.id]}
                  onChange={() => toggle(f.id)}
                  className="accent-accent mt-0.5"
                />
                {f.label}
              </label>
            ))}
            <div className="text-muted mt-1 flex gap-4 text-xs">
              <span>
                <span className="text-fg font-mono text-base">{c.turns}</span> turns
              </span>
              <span>
                <span className="text-fg font-mono text-base">{c.repeats}</span> times the caller
                repeats themselves
              </span>
            </div>
          </div>
          <div className="border-line bg-surface flex max-h-[26rem] flex-col gap-1 overflow-y-auto rounded-xl border p-3">
            {c.lines.map((l, i) => (
              <motion.div
                key={`${l.fix}-${l.good}-${i}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs",
                  l.who === "agent" ? "bg-surface-2 self-start" : "bg-accent-soft self-end",
                  !l.good && l.who === "agent" && "border-bad/50 border",
                )}
              >
                {l.text}
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A clinic&apos;s booking call goes badly. Switch on each fix and watch the call get shorter
        and kinder. The red outlines mark agent turns that cause trouble.
      </p>
      <p>
        Most of the fixes are about <Term id="common-ground">common ground</Term>: both sides
        agreeing on what was said. <Term id="implicit-confirmation">Implicit confirmation</Term>{" "}
        repeats details back while moving on;{" "}
        <Term id="explicit-confirmation">explicit confirmation</Term> stops and asks, and is best
        kept for the moment before something hard to undo. A{" "}
        <Term id="warm-transfer">warm transfer</Term> passes the details on so nobody repeats
        themselves.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When the agent doesn't understand ------------------------------------------------------------ */

const LADDER: { level: string; noMatch: string; noInput: string }[] = [
  {
    level: "First try",
    noMatch: "Sorry, which day works for you?",
    noInput: "Which day works for you?",
  },
  {
    level: "Second try",
    noMatch: "You can say a day, like 'Monday' or 'next Friday'.",
    noInput: "For example, you could say 'Monday' or 'next Friday'.",
  },
  {
    level: "Still stuck",
    noMatch: "Let me get someone to help. One moment while I pass on what we have so far.",
    noInput: "I'll put you through to a person, who can help from here.",
  },
];

export function Ladder() {
  const [s, set] = useSceneState<DesignState>();
  const n = s.attempt;
  return (
    <StepLayout
      eyebrow="Explore"
      title="When the agent doesn't understand"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="text-muted grid grid-cols-[6rem_1fr_1fr] gap-2 text-[10px] uppercase">
            <span />
            <span>Heard, didn&apos;t understand</span>
            <span>Heard nothing</span>
          </div>
          {LADDER.map((r, i) => (
            <motion.div
              key={r.level}
              animate={{ opacity: i <= n ? 1 : 0.25 }}
              className="grid grid-cols-[6rem_1fr_1fr] gap-2 text-xs"
            >
              <span className="text-muted">{r.level}</span>
              <span
                className={cn(
                  "rounded-lg border px-2 py-1.5",
                  i <= n ? "border-line bg-surface" : "border-line border-dashed",
                )}
              >
                {r.noMatch}
              </span>
              <span
                className={cn(
                  "rounded-lg border px-2 py-1.5",
                  i <= n ? "border-line bg-surface" : "border-line border-dashed",
                )}
              >
                {r.noInput}
              </span>
            </motion.div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={n >= 2}
              onClick={() => set({ attempt: n + 1 })}
              className="border-line rounded-full border px-3 py-1 text-xs disabled:opacity-40"
            >
              The caller is still unclear →
            </button>
            <button
              type="button"
              onClick={() => set({ attempt: 0 })}
              className="text-muted text-xs underline"
            >
              Reset
            </button>
          </div>
        </div>
      }
    >
      <p>
        There are two everyday failures: the agent heard something but couldn&apos;t make sense of
        it, or it heard nothing at all. Both need a short ladder, not a loop.
      </p>
      <p>
        Try again more briefly first, then add examples or options, and after two or three misses
        hand over to a person. After silence, don&apos;t say &ldquo;I didn&apos;t hear you&rdquo;:
        the caller probably didn&apos;t speak, so just ask again in a different way. This advice
        comes from Google&apos;s conversation design guidelines, written for Google Assistant.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Say you're an AI ---------------------------------------------------------------------------- */

export function SayAi() {
  const rules: [string, string, string][] = [
    [
      "EU",
      "In force from 2 Aug 2026",
      "The AI Act requires AI systems that talk with people to make clear they're AI, unless it's obvious, by the first interaction at the latest.",
    ],
    [
      "California",
      "2019 and 2025",
      "It's illegal to use an online bot that hides being a bot to sell something or sway a vote. Since 2025, robocalls using an AI voice must say so.",
    ],
    [
      "US (federal)",
      "2024",
      "The FCC treats AI-generated voices as “artificial” under robocall consent rules. A rule requiring disclosure on every call has been proposed but not adopted.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Say you're an AI"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rules.map(([w, d, t], i) => (
            <motion.div
              key={w}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p>
                <span className="font-semibold">{w}</span>{" "}
                <span className="text-subtle">· {d}</span>
              </p>
              <p className="text-muted mt-0.5">{t}</p>
            </motion.div>
          ))}
          <p className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            &ldquo;Hi, I&apos;m Lakeside Clinic&apos;s AI assistant.&rdquo; One short phrase in the
            greeting covers it.
          </p>
          <p className="text-subtle text-[10px]">A summary, not legal advice; rules change.</p>
        </div>
      }
    >
      <p>
        Callers deserve to know whether they&apos;re talking to a person. A growing set of laws
        agrees, though the details differ from place to place.
      </p>
      <p>
        The simple, safe habit everywhere: say it in the greeting. It also sets expectations, so
        callers speak in a way the agent will understand.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Ask, or just repeat back? ------------------------------------------------------------------- */

export function ConfirmHow() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Ask, or just repeat back?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="confirm-how"
            prompt="How should the agent confirm each detail?"
            categories={[
              { id: "explicit", label: "Stop and ask" },
              { id: "implicit", label: "Repeat back, keep going" },
            ]}
            items={[
              {
                id: "party",
                label: "Table for two",
                category: "implicit",
                why: "Cheap to fix: “OK, two people. What time?”",
              },
              {
                id: "pay",
                label: "Paying a ₹12,000 bill",
                category: "explicit",
                why: "A payment is hard to undo.",
              },
              {
                id: "weather",
                label: "Which city's weather",
                category: "implicit",
                why: "If wrong, the caller just corrects it.",
              },
              {
                id: "send",
                label: "Sending a message to the caller's boss",
                category: "explicit",
                why: "It can't be unsent.",
              },
              {
                id: "cancel",
                label: "Cancelling an operation booking",
                category: "explicit",
                why: "Costly if wrong.",
              },
            ]}
            explanation="Repeat back by default; stop and ask only before things that are costly or hard to undo."
          />
        </div>
      }
    >
      <p>Sort the details.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Open, and honest", "Say you're an AI; ask what they need."],
  ["Repeat back by default", "Ask outright only before costly actions."],
  ["One-step corrections", "“No, Thursday” just works."],
  ["A ladder, not a loop", "Shorter, then examples, then a person."],
  ["Warm handovers", "Nobody repeats themselves."],
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
      <p>Next: letting the agent act during a call, without awkward silences.</p>
    </StepLayout>
  );
}
