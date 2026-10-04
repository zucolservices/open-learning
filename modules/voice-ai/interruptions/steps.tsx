"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { INTERRUPTS, REPLY, run, type Kind } from "./model";
import type { IntState } from "./state";

/* 1 ─ Getting a word in --------------------------------------------------------------------------- */

export function Dinner() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Getting a word in"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {[
            ["“Mm-hm”", "“Keep going, I'm with you.”", "good"],
            ["“Wait, no…”", "“Stop, I need to say something.”", "bad"],
            ["A plate drops", "Not a turn at all.", "good"],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                k === "bad" ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        At a dinner table, people interrupt all the time, and good listeners tell the kinds apart.
        &ldquo;Mm-hm&rdquo; means keep going; &ldquo;wait, no&rdquo; means stop; a dropped plate
        means nothing at all.
      </p>
      <p>
        A voice agent has to make the same distinction, live. Handling{" "}
        <Term id="barge-in">barge-in</Term> well means stopping instantly for real interruptions,
        ignoring <Term id="backchannel">backchannels</Term> and noise, and remembering only what the
        caller actually heard.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Interrupt the assistant ⭐ ------------------------------------------------------------------ */

export function CutIn() {
  const [s, set] = useSceneState<IntState>();
  const r = run({
    at: s.at,
    kind: s.kind,
    stopAudio: s.stopAudio,
    truncate: s.truncate,
    minWords: s.minWords,
  });
  const toggles: [keyof IntState, string][] = [
    ["stopAudio", "Stop speaking the moment the caller speaks"],
    ["truncate", "Cut the agent's memory to what was actually heard"],
    ["minWords", "Only count it if it's at least two real words"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Interrupt the assistant"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-muted mr-1">caller says</span>
            {INTERRUPTS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.kind === x.id}
                onClick={() => set({ kind: x.id as Kind })}
                className={cn(
                  "rounded-md border px-2 py-1",
                  s.kind === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">after word</span>
            <input
              type="range"
              min={2}
              max={REPLY.length - 2}
              value={s.at}
              onChange={(e) => set({ at: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Interrupt after word"
            />
            <span className="w-6 font-mono">{s.at}</span>
          </label>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {toggles.map(([k, l]) => (
              <label key={k} className="flex items-start gap-2 text-[11px]">
                <input
                  type="checkbox"
                  checked={s[k] as boolean}
                  onChange={(e) => set({ [k]: e.target.checked })}
                  className="accent-accent mt-0.5"
                />
                {l}
              </label>
            ))}
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border p-3 text-xs">
            {[
              ["The agent generated", REPLY, "text-muted"],
              ["The caller heard", r.heard, ""],
              ["The agent thinks it said", r.thinks, ""],
            ].map(([label, words, cls]) => (
              <div key={label as string}>
                <p className="text-muted text-[10px] uppercase">{label as string}</p>
                <p className={cn("mt-0.5 leading-relaxed", cls as string)}>
                  {(words as string[]).map((w, i) => (
                    <span
                      key={i}
                      className={cn(
                        i >= s.at &&
                          label !== "The agent generated" &&
                          r.stopped === false &&
                          s.kind === "real"
                          ? "text-bad"
                          : "",
                        label === "The agent thinks it said" &&
                          r.stopped &&
                          !s.truncate &&
                          i >= s.at
                          ? "bg-bad/20 text-bad"
                          : "",
                      )}
                    >
                      {w}{" "}
                    </span>
                  ))}
                  {label === "The caller heard" && r.stopped && (
                    <span className="text-accent font-semibold">
                      ⏹ {INTERRUPTS.find((x) => x.id === s.kind)?.said}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
          <motion.p
            key={JSON.stringify(s)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              r.outcome.tone === "good"
                ? "border-good bg-good/10"
                : r.outcome.tone === "warn"
                  ? "border-viz-compute bg-viz-compute/10"
                  : "border-bad bg-bad/10",
            )}
          >
            {r.outcome.text}
          </motion.p>
          <p className="text-subtle text-[10px]">Illustrative call.</p>
        </div>
      }
    >
      <p>
        The agent is reading back a booking. Make the caller cut in, and switch on the three
        behaviours good voice agents need. Then try a &ldquo;mm-hm&rdquo; and a door slam.
      </p>
      <p>
        The subtle one is memory. The agent generated the whole reply, but the caller only heard
        part of it. Unless the agent&apos;s record is cut to what was heard, it will later refer to
        things the caller never heard.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Barge-in, then and now ---------------------------------------------------------------------- */

export function BargeIn() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Barge-in, then and now"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`<!-- VoiceXML 2.0 (W3C, 2004): phone-menu prompts -->
<prompt bargein="true">
  Say the name of the city you're travelling to.
</prompt>
<prompt bargein="false">
  Calls may be recorded for quality and training purposes.
</prompt>`}</Code>
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-semibold">Then</p>
              <p className="text-muted">
                Phone menus let callers talk over a prompt, except for notices that had to be heard
                in full.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-semibold">Now</p>
              <p className="text-muted">
                Full-duplex models listen while speaking, so telling a backchannel from an
                interruption becomes a skill of the model itself.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        &ldquo;Barge-in&rdquo; is an old phone-menu term. The VoiceXML standard (2004) let designers
        decide, prompt by prompt, whether callers could interrupt; legal notices could be made
        uninterruptible.
      </p>
      <p>
        The same choice exists today: you may let callers interrupt a chatty explanation but not a
        required disclosure. The linguist Victor Yngve named &ldquo;mm-hm&rdquo; and its cousins the
        &ldquo;back channel&rdquo; in 1970.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How real-time systems handle it ------------------------------------------------------------- */

export function Mechanics() {
  const steps: [string, string][] = [
    [
      "Notice",
      "Voice activity detection fires: OpenAI's Realtime API sends an input_audio_buffer.speech_started event; Gemini Live flags the turn as interrupted.",
    ],
    ["Stop", "Cancel the response being generated and clear any audio still queued for playback."],
    [
      "Correct the record",
      "Trim the agent's message to what was played. Over WebSockets your app sends conversation.item.truncate with the playback position; over WebRTC and phone calls OpenAI does it for you.",
    ],
    [
      "Filter",
      "Frameworks such as LiveKit and Pipecat can require a minimum number of words or duration, so a cough or “yeah” doesn't stop the agent; LiveKit can resume after a false interruption.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How real-time systems handle it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {steps.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[1.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{i + 1}</span>
              <span>
                <span className="font-semibold">{t}: </span>
                <span className="text-muted">{d}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Interruption handling has three jobs, plus a filter: notice speech, stop the audio and the
        generation, correct the agent&apos;s record of what it said, and ignore things that
        aren&apos;t real interruptions.
      </p>
      <p>
        One caveat from OpenAI&apos;s docs: truncating removes the unheard audio from the
        conversation, but doesn&apos;t give you an exact transcript of the heard part.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Stop, or keep talking? ---------------------------------------------------------------------- */

export function StopOrContinue() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Stop, or keep talking?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="stop-or-continue"
            prompt="The agent is mid-sentence. What should it do when it hears each?"
            categories={[
              { id: "stop", label: "Stop and listen" },
              { id: "keep", label: "Keep talking" },
            ]}
            items={[
              {
                id: "mmhm",
                label: "“Mm-hm.”",
                category: "keep",
                why: "A backchannel: the caller is following.",
              },
              {
                id: "wait",
                label: "“Wait, no.”",
                category: "stop",
                why: "Short, but a real interruption.",
              },
              {
                id: "repeat",
                label: "“Sorry, can you say that again?”",
                category: "stop",
                why: "The caller needs something.",
              },
              { id: "door", label: "A door slams", category: "keep", why: "Noise, not a turn." },
              {
                id: "yeah",
                label: "“Yeah, yeah.”",
                category: "keep",
                why: "Encouragement to continue.",
              },
            ]}
            explanation="Backchannels and noise aren't turns, so keep going. Short words like “wait” or “no” can be real interruptions, which is why simple word counts aren't enough on their own."
          />
        </div>
      }
    >
      <p>Sort the sounds.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Stop instantly", "For real interruptions."],
  ["Correct the record", "Remember only what was heard."],
  ["Ignore backchannels", "“Mm-hm” means keep going."],
  ["Filter noise", "Minimum words or duration."],
  ["Some things can't be skipped", "Required disclosures."],
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
      <p>Next: getting audio between the caller and your servers, by browser or by phone.</p>
    </StepLayout>
  );
}
