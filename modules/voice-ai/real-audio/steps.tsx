"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BASE, PROBLEMS, type Problem } from "./model";
import type { AudioState } from "./state";

/* 1 ─ A call from a café -------------------------------------------------------------------------- */

export function Cafe() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A call from a café"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Clatter of cups and a coffee grinder", "noise"],
            ["The phone on speaker, so it hears its own voice", "echo"],
            ["A friend chipping in: “ask about Sunday!”", "a second speaker"],
            ["An accent the system rarely heard in training", "accent"],
          ].map(([t, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
            >
              <span>{t}</span>
              <span className="text-muted text-[10px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Demos are recorded in quiet rooms by people who speak clearly. Real callers ring from cafés
        and cars, on speakerphone, with someone else talking in the background, in every accent
        there is.
      </p>
      <p>
        Each of these makes recognition worse, and each has its own fix, from{" "}
        <Term id="echo-cancellation">echo cancellation</Term> to{" "}
        <Term id="diarisation">speaker diarisation</Term>. And some callers are under-served by the
        models themselves.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make the call messy ⭐ ---------------------------------------------------------------------- */

export function MessyCall() {
  const [s, set] = useSceneState<AudioState>();
  const probs = s.problems ?? [];
  const fixes = s.fixes ?? [];
  const toggle = <T extends string>(arr: T[], v: T) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  const parts = PROBLEMS.filter((p) => probs.includes(p.id)).map((p) => ({
    p,
    v: fixes.includes(p.fix) ? p.fixed : p.add,
  }));
  const wer = BASE + parts.reduce((a, x) => a + x.v, 0);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Make the call messy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border p-3 text-xs">
              <p className="text-muted text-[10px]">REAL-WORLD PROBLEMS</p>
              {PROBLEMS.map((p) => (
                <label key={p.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={probs.includes(p.id)}
                    onChange={() => set({ problems: toggle<Problem>(probs, p.id) })}
                    className="accent-accent"
                  />
                  {p.label}
                </label>
              ))}
            </div>
            <div className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border p-3 text-xs">
              <p className="text-muted text-[10px]">FIXES</p>
              {PROBLEMS.map((p) => (
                <label key={p.fix} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={fixes.includes(p.fix)}
                    onChange={() => set({ fixes: toggle(fixes, p.fix) })}
                    className="accent-accent"
                  />
                  {p.fixLabel}
                </label>
              ))}
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="flex h-6 overflow-hidden rounded-md">
              <div
                className="bg-viz-data/50 flex items-center justify-center text-[9px]"
                style={{ width: `${(BASE / 70) * 100}%` }}
              >
                base
              </div>
              {parts.map(({ p, v }) => (
                <motion.div
                  key={p.id}
                  layout
                  className={cn(
                    "flex items-center justify-center overflow-hidden text-[9px] whitespace-nowrap",
                    fixes.includes(p.fix) ? "bg-good/40" : "bg-bad/50",
                  )}
                  style={{ width: `${(v / 70) * 100}%` }}
                >
                  {p.id}
                </motion.div>
              ))}
            </div>
            <p className="mt-2 text-xs">
              Word error rate:{" "}
              <span
                className={cn(
                  "font-mono text-lg font-semibold",
                  wer > 20 ? "text-bad" : "text-good",
                )}
              >
                {wer}%
              </span>
            </p>
            <ul className="text-muted mt-1 flex flex-col gap-0.5 text-[11px]">
              {parts
                .filter(({ p }) => !fixes.includes(p.fix))
                .map(({ p }) => (
                  <li key={p.id}>
                    • {p.label}: {p.symptom}
                  </li>
                ))}
            </ul>
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative error rates: real effects depend on the model, microphone and caller.
          </p>
        </div>
      }
    >
      <p>
        Pile on real-world problems and watch the error rate climb, then apply fixes. Each fix
        targets one problem: noise suppression doesn&apos;t help with echo, and echo cancellation
        doesn&apos;t help with an unfamiliar accent.
      </p>
      <p>
        Echo is worth special attention for voice agents: on speakerphone the microphone picks up
        the agent&apos;s own voice, which it can mistake for the caller interrupting. WebRTC&apos;s
        open-source audio processing includes echo cancellation, noise suppression and gain control.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Not everyone is heard equally --------------------------------------------------------------- */

export function Fairness() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Not everyone is heard equally"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-4">
            <p className="text-muted text-[10px]">
              AVERAGE WORD ERROR RATE ACROSS FIVE COMMERCIAL SYSTEMS (2019–2020 DATA)
            </p>
            {[
              ["White speakers", 0.19],
              ["Black speakers", 0.35],
            ].map(([l, v]) => (
              <div
                key={l as string}
                className="mt-2 grid grid-cols-[7rem_1fr_3rem] items-center gap-2 text-xs"
              >
                <span>{l}</span>
                <div className="bg-surface-2 h-3 overflow-hidden rounded">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(v as number) * 200}%` }}
                    className="bg-viz-data h-full"
                  />
                </div>
                <span className="font-mono">{v}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-semibold">Languages</p>
              <p className="text-muted">
                Whisper&apos;s accuracy tracks how much training audio exists for each language;
                less data, more errors.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-semibold">Atypical speech</p>
              <p className="text-muted">
                The Speech Accessibility Project (University of Illinois, from 2022) collects
                recordings from people with conditions such as Parkinson&apos;s and ALS to improve
                recognition for them.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A 2020 Stanford-led study tested the recognisers from Amazon, Apple, Google, IBM and
        Microsoft and found nearly twice as many errors for Black speakers as for white speakers,
        even when both said the same phrases. The gap came from how the models handled sound, not
        vocabulary.
      </p>
      <p>
        Systems have improved since, but the lesson stands: measure accuracy separately for the
        groups of people you actually serve, and don&apos;t assume a benchmark covers them.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who spoke when? ----------------------------------------------------------------------------- */

export function WhoSpoke() {
  const segs: [string, number, number][] = [
    ["A", 0, 30],
    ["B", 28, 48],
    ["A", 50, 70],
    ["B", 72, 100],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who spoke when?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-4">
            {["A", "B"].map((who) => (
              <div key={who} className="mb-2 flex items-center gap-2 text-xs">
                <span className="w-16">Speaker {who}</span>
                <div className="bg-surface-2 relative h-5 flex-1 rounded">
                  {segs
                    .filter(([w]) => w === who)
                    .map(([, a, b], i) => (
                      <span
                        key={i}
                        className={cn(
                          "absolute top-0 h-full rounded",
                          who === "A" ? "bg-viz-data/60" : "bg-accent/60",
                        )}
                        style={{ left: `${a}%`, width: `${b - a}%` }}
                      />
                    ))}
                </div>
              </div>
            ))}
            <p className="text-muted mt-2 text-[11px]">
              Overlap at 28–30%: both talking at once, the hardest part to get right.
            </p>
          </div>
          <p className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-xs">
            DER = (false alarm + missed speech + speaker confusion) ÷ total speech time
          </p>
        </div>
      }
    >
      <p>
        Speaker diarisation labels a recording by who spoke when. Voice agents need it when several
        people share a phone, and meeting tools and doctors&apos; note-takers depend on it.
      </p>
      <p>
        It&apos;s measured with the diarisation error rate, which counts time, not words.
        pyannote.audio is a popular open-source toolkit; overlapping speech remains the hardest
        part.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which fix? ---------------------------------------------------------------------------------- */

export function MatchFix() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which fix?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="audio-fix"
            prompt="Which fix addresses each problem?"
            categories={[
              { id: "aec", label: "Echo cancellation" },
              { id: "noise", label: "Noise suppression" },
              { id: "diar", label: "Diarisation" },
              { id: "test", label: "Test on representative speakers" },
            ]}
            items={[
              {
                id: "self",
                label: "The agent keeps “hearing” its own reply on speakerphone",
                category: "aec",
                why: "Its own output leaks into the microphone.",
              },
              {
                id: "traffic",
                label: "Calls from busy roadsides are full of errors",
                category: "noise",
                why: "Background noise.",
              },
              {
                id: "two",
                label: "A couple calling together get their requests mixed up",
                category: "diar",
                why: "Who said what.",
              },
              {
                id: "region",
                label: "Callers from one region are misheard far more often",
                category: "test",
                why: "Measure by group; choose or tune the model.",
              },
            ]}
            explanation="Each problem has its own fix. Accuracy gaps between groups of speakers aren't a signal-processing problem: they need measuring and better data or models."
          />
        </div>
      }
    >
      <p>Sort the problems.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Real audio is messy", "Noise, echo, overlap, accents."],
  ["One fix per problem", "Noise suppression, echo cancellation, diarisation."],
  ["Echo matters for agents", "Or they hear themselves."],
  ["Accuracy varies by speaker", "Measure for the people you serve."],
  ["Diarisation", "Who spoke when; overlap is hardest."],
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
      <p>Next: the other direction, turning text into a voice.</p>
    </StepLayout>
  );
}
