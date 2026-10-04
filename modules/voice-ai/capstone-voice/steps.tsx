"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DESIGN, INCIDENTS } from "./model";
import type { CapState } from "./state";

/* 1 ─ The phones never stop ----------------------------------------------------------------------- */

export function Brief() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The phones never stop"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-5 py-4 text-xs">
            <p className="text-muted text-[10px]">FROM: PRACTICE MANAGER, LAKESIDE CLINIC</p>
            <p className="mt-2">
              &ldquo;Mornings are chaos. Patients wait on hold to book, cancel or ask our opening
              hours, and our two receptionists can&apos;t also look after the people in the waiting
              room. Can a voice agent take the routine calls, and pass everything else to us?&rdquo;
            </p>
          </div>
        </div>
      }
    >
      <p>
        You&apos;re building the phone line for a made-up clinic. The agent will answer calls, book,
        move and cancel appointments, answer simple questions, and hand anything medical or
        complicated to staff.
      </p>
      <p>
        First, five design choices covering the whole track. Then the first week&apos;s complaints,
        modelled on things that have gone wrong for real voice systems, and the fixes that get to
        the root.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Design the line ---------------------------------------------------------------------------- */

export function Design() {
  const [s, set] = useSceneState<CapState>();
  const design = s.design ?? {};
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Design the line"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DESIGN.map((d) => (
            <div key={d.id} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">{d.prompt}</p>
              <div className="mt-1 flex flex-col gap-1">
                {d.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={design[d.id] === c.id}
                    onClick={() => set({ design: { ...design, [d.id]: c.id } })}
                    className={cn(
                      "rounded border px-2 py-1 text-left text-[11px]",
                      design[d.id] === c.id ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-muted text-[11px]">
            {Object.keys(design).length} of 5 decided. Your choices decide which complaints week one
            brings.
          </p>
        </div>
      }
    >
      <p>
        Make the five calls. Each maps to a part of this track: the pipeline and its latency budget,
        turn-taking and interruptions, conversation design, tools, and testing.
      </p>
      <p>There are no scores here. Week one will show you what each choice leads to.</p>
    </StepLayout>
  );
}

/* 3 ─ Week one: five complaints ⭐ ------------------------------------------------------------------ */

export function WeekOne() {
  const [s, set] = useSceneState<CapState>();
  const design = s.design ?? {};
  const fixes = s.fixes ?? {};
  const prevented = (id: string) => {
    const d = DESIGN.find((x) => x.prevents === id);
    return !!d && d.choices.find((c) => c.id === design[d.id])?.good;
  };
  const open = INCIDENTS.filter((i) => !prevented(i.id));
  const fixedOk = open.filter((i) => i.fixes.find((f) => f.id === fixes[i.id])?.good).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Week one: five complaints"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {INCIDENTS.map((inc) => {
            const pre = prevented(inc.id);
            const f = inc.fixes.find((x) => x.id === fixes[inc.id]);
            return (
              <div
                key={inc.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  pre
                    ? "border-good/50 bg-good/5"
                    : !f
                      ? "border-bad bg-bad/10"
                      : f.good
                        ? "border-good bg-good/10"
                        : "border-viz-compute bg-viz-compute/10",
                )}
              >
                <p className="font-semibold">
                  {inc.title}{" "}
                  {pre && (
                    <span className="text-good text-[10px] font-normal">
                      · prevented by your design
                    </span>
                  )}
                </p>
                {!pre && (
                  <>
                    <p className="text-muted mt-0.5">{inc.detail}</p>
                    <div className="mt-1 flex flex-col gap-1">
                      {inc.fixes.map((x) => (
                        <button
                          key={x.id}
                          type="button"
                          aria-pressed={fixes[inc.id] === x.id}
                          onClick={() => set({ fixes: { ...fixes, [inc.id]: x.id } })}
                          className={cn(
                            "rounded border px-2 py-1 text-left text-[11px]",
                            fixes[inc.id] === x.id ? "border-accent bg-accent-soft" : "border-line",
                          )}
                        >
                          {x.label}
                        </button>
                      ))}
                    </div>
                    {f && (
                      <p className="text-muted mt-1 text-[11px]">
                        {f.good
                          ? "Fixed at the root. "
                          : "A patch: it will happen again in another form. "}
                        {inc.real}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
          <p className="text-muted text-[11px]">
            {5 - open.length} prevented by design · {fixedOk} of {open.length} remaining fixed at
            the root.
          </p>
        </div>
      }
    >
      <p>
        Week one brings five complaints from callers. Some never happen, because your design
        prevented them. For the rest, pick the fix that removes the cause rather than hiding the
        symptom.
      </p>
      <p>
        Notice the pattern in the weak fixes: they cover the problem up, slow everyone down, or push
        the work onto the caller. Root fixes change how the agent listens, speaks and acts, or how
        it is tested.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Voice AI in healthcare today ---------------------------------------------------------------- */

export function InPractice() {
  const items: [string, string][] = [
    [
      "Ambient scribes",
      "The most established use. AI listens to the consultation (with the patient's consent) and drafts the clinical note for the clinician to review. Kaiser Permanente rolled out Abridge across its 40 hospitals in 2024; Microsoft combined its Nuance tools into Dragon Copilot in 2025.",
    ],
    [
      "Front-desk phone agents",
      "A growing category: scheduling, cancellations and common questions, handing anything sensitive or complex to staff. Assort Health is one example.",
    ],
    [
      "Why answering faster matters",
      "A study of US Veterans Health Administration call centres found that slower answering made patients feel care was harder to reach.",
    ],
    [
      "Lessons from drive-throughs",
      "Not healthcare, but the same problems: McDonald's ended its IBM voice ordering test in 2024 (reported trouble with accents), and Taco Bell rethought its voice AI in 2025 after people trolled it to reach a human.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Voice AI in healthcare today"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Healthcare is already using voice AI in two main ways.{" "}
        <Term id="ambient-scribe">Ambient scribes</Term> help clinicians with paperwork; phone
        agents help the front desk.
      </p>
      <p>
        The common thread in the successful ones: patient consent, a person who checks the output or
        takes over, and careful testing with real-world voices.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Before you go live -------------------------------------------------------------------------- */

export function Checklist() {
  const items: [string, string][] = [
    ["Pipeline", "Streaming everywhere; a latency budget tracked at p95."],
    ["Turns", "Semantic turn detection; instant barge-in; memory trimmed to what was heard."],
    [
      "Conversation",
      "Say it's an AI; repeat back; one-step corrections; a person after two misses.",
    ],
    ["Tools", "Read back before changes; “done” only on success; no card data through the AI."],
    ["Voice", "Writing for the ear; a licensed voice, no cloning without consent."],
    ["Testing", "Simulated callers with accents, noise and interruptions, before every change."],
    [
      "Privacy",
      "In the US, a signed business associate agreement with every vendor that hears patient details; recording consent; limited retention.",
    ],
    ["People", "Warm handovers; staff can see every call and correct the agent."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Before you go live"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The whole track as a launch checklist. One healthcare-specific item: in the US a clinic must
        follow <Term id="hipaa">HIPAA</Term>, so every vendor in the call path that hears or stores
        patient details, from telephony to speech-to-text to the model, needs a signed{" "}
        <Term id="baa">business associate agreement</Term>. Encrypting the data doesn&apos;t remove
        that need, and no product is &ldquo;HIPAA certified&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Which part of the track? -------------------------------------------------------------------- */

export function WhereFrom() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which part of the track?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="capstone-voice-fixes"
            prompt="Which area does each fix come from?"
            categories={[
              { id: "speed", label: "Speed and turns" },
              { id: "talk", label: "Conversation and tools" },
              { id: "run", label: "Testing and running" },
            ]}
            items={[
              {
                id: "stream",
                label: "Start speaking from the first sentence",
                category: "speed",
                why: "The latency budget.",
              },
              {
                id: "bargein",
                label: "Stop speaking the moment the caller cuts in",
                category: "speed",
                why: "Barge-in and interruptions.",
              },
              {
                id: "readback",
                label: "Read the booking back before making it",
                category: "talk",
                why: "Taking action mid-call.",
              },
              {
                id: "person",
                label: "Offer a person after two misunderstandings",
                category: "talk",
                why: "Designing voice conversations.",
              },
              {
                id: "sim",
                label: "Test with callers on busy streets",
                category: "run",
                why: "Simulated callers.",
              },
              {
                id: "p95",
                label: "Track p95 voice-to-voice latency",
                category: "run",
                why: "Testing and running voice agents.",
              },
            ]}
            explanation="Each fix traces back to a module: speed and turn-taking, conversation and tools, or testing and running."
          />
        </div>
      }
    >
      <p>Sort the fixes.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Fast, or they hang up", "Stream everything; budget latency."],
  ["Listen like a person", "Smart turn-taking; stop when interrupted."],
  ["Design the talk", "Honest, brief, forgiving; a way to a person."],
  ["Act carefully", "Read back; report only real success."],
  ["Test with real-world voices", "Accents, noise, interruptions."],
  ["Respect privacy", "Consent, contracts, retention."],
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
        That&apos;s the Voice AI track. You can follow a call from sound waves to speech
        recognition, a model, a voice and back, and you know what it takes to build a phone line
        people don&apos;t hang up on.
      </p>
    </StepLayout>
  );
}
