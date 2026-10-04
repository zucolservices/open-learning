"use client";

import { motion } from "motion/react";
import { Volume2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, breaths, render, type Fix } from "./model";
import type { WriteState } from "./state";

/* 1 ─ Writing for radio --------------------------------------------------------------------------- */

export function Radio() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Writing for radio"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Newspaper</p>
            <p className="text-muted mt-1 font-serif">
              Rates rise 0.25pp to 6.5% (est.) — see p.4 for full table.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Radio</p>
            <p className="text-muted mt-1">
              &ldquo;Interest rates are going up again, by a quarter of a point. That takes them to
              six and a half per cent.&rdquo;
            </p>
          </div>
        </div>
      }
    >
      <p>
        Radio journalists rewrite every story for the ear: short sentences, no tables, numbers said
        the way people say them. A listener can&apos;t glance back at a line they missed.
      </p>
      <p>
        Voice agents need the same discipline. Text written for a screen often sounds wrong spoken
        aloud: abbreviations, bullet points and codes trip the voice up, and long sentences lose the
        listener. It&apos;s also why the <Term id="prosody">prosody</Term> of speech, its rhythm and
        emphasis, matters.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix a reply for the ear ⭐ ------------------------------------------------------------------ */

export function FixReply() {
  const [s, set] = useSceneState<WriteState>();
  const fixes = s.fixes ?? [];
  const text = render(fixes);
  const b = breaths(text);
  const toggle = (f: Fix) =>
    set({ fixes: fixes.includes(f) ? fixes.filter((x) => x !== f) : [...fixes, f] });
  const say = () => {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    } catch {
      /* speech synthesis unavailable */
    }
  };
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix a reply for the ear"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <motion.div
            key={fixes.join()}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="border-line bg-surface rounded-xl border p-4 text-sm leading-relaxed"
          >
            {text}
          </motion.div>
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={say}
              className="border-line bg-surface flex items-center gap-1.5 rounded-md border px-3 py-1.5"
            >
              <Volume2 className="size-3.5" /> Hear it
            </button>
            <span className="text-muted">words per sentence:</span>
            <span className="flex flex-wrap gap-1">
              {b.map((n, i) => (
                <span
                  key={i}
                  className={cn(
                    "rounded px-1.5 font-mono",
                    n > 20 ? "bg-bad/20 text-bad" : "bg-good/15",
                  )}
                >
                  {n}
                </span>
              ))}
            </span>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {FIXES.map((f) => (
              <label
                key={f.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
                  fixes.includes(f.id) ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={fixes.includes(f.id)}
                  onChange={() => toggle(f.id)}
                  className="accent-accent mt-0.5"
                />
                <span>
                  <span className="font-semibold">{f.label}</span>
                  <span className="text-muted block text-[11px]">{f.why}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            “Hear it” uses your browser&apos;s built-in voice, which may stumble differently from a
            production voice.
          </p>
        </div>
      }
    >
      <p>
        This reply was written for a screen. Read it aloud, or press &ldquo;Hear it&rdquo;, then
        apply the fixes one at a time until it sounds like something a helpful receptionist would
        say.
      </p>
      <p>
        A good test: could you say each sentence in one breath? Amazon&apos;s voice guidelines
        suggest offering one to a few options at a time; Google&apos;s designers suggest groups of
        about three, and saying how many are coming first.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Telling the voice how to speak -------------------------------------------------------------- */

export function Ssml() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Telling the voice how to speak"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`<speak>
  Your reference is
  <say-as interpret-as="characters">AX7</say-as>
  <break time="400ms"/>
  <say-as interpret-as="characters">22Q</say-as>.
  The appointment is with <sub alias="Doctor">Dr.</sub> Rao,
  and it's <emphasis>tomorrow</emphasis>, not today.
  <prosody rate="slow">Please arrive ten minutes early.</prosody>
</speak>`}</Code>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Plain-language instructions</p>
            <p className="text-muted mt-0.5 font-mono">
              instructions: &quot;Speak warmly and a little slowly, like a calm receptionist.&quot;
            </p>
            <p className="text-muted mt-1">
              Newer models, such as OpenAI&apos;s gpt-4o-mini-tts (March 2025), are steered with
              descriptions like this instead of tags.
            </p>
          </div>
        </div>
      }
    >
      <p>
        <Term id="ssml">SSML</Term>, a W3C standard (version 1.1, 2010), marks up text with
        instructions: pauses, emphasis, speed and pitch, how to read a date or a code, and exact
        pronunciations. Most cloud voices accept it.
      </p>
      <p>
        Support varies widely. The most natural new voices often ignore some tags: Amazon&apos;s
        neural voices skip emphasis, and some voices drop SSML entirely when streaming. Check the
        docs for the exact voice you use.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Before a word is spoken --------------------------------------------------------------------- */

export function Normalise() {
  const rows: [string, string][] = [
    ["$200", "two hundred dollars"],
    ["1/2", "a half? January the second? February the first?"],
    ["St. Mark St.", "Saint Mark Street"],
    ["3:30pm", "three thirty p m"],
    ["2026", "twenty twenty-six (a year) or two thousand and twenty-six (a number)"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Before a word is spoken"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {rows.map(([w, s], i) => (
            <motion.div
              key={w}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[7rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-mono font-semibold">{w}</span>
              <span className="text-muted">→ {s}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Before speaking, a text-to-speech system converts written forms into words, a step called{" "}
        <Term id="text-normalisation">text normalisation</Term>. It&apos;s where many embarrassing
        mistakes come from, because the same characters can be read several ways.
      </p>
      <p>
        The safest fix is upstream: have the language model write replies in spoken form in the
        first place. Tell it in the prompt to write numbers, dates and times as they should be said.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Good for the ear? --------------------------------------------------------------------------- */

export function EarOrEye() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good for the ear?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="ear-or-eye"
            prompt="Does each reply work well spoken aloud?"
            categories={[
              { id: "ear", label: "Works spoken" },
              { id: "eye", label: "Screen-only" },
            ]}
            items={[
              {
                id: "three",
                label: "“I can help with billing, orders or returns. Which is it?”",
                category: "ear",
                why: "Three options, a clear question.",
              },
              {
                id: "bullets",
                label: "“Here are your options: • Billing • Orders • Returns • Account • Other”",
                category: "eye",
                why: "Bullets and five options.",
              },
              {
                id: "date",
                label: "“Your delivery is on Friday the fourteenth.”",
                category: "ear",
                why: "Unambiguous and natural.",
              },
              {
                id: "code",
                label: "“Use code XQ7-PL2 at checkout (expires 31/12).”",
                category: "eye",
                why: "A code read as a word and an ambiguous date.",
              },
              {
                id: "short",
                label: "“Done. Your table is booked for seven.”",
                category: "ear",
                why: "Short sentences.",
              },
            ]}
            explanation="Spoken replies need short sentences, few options, no symbols, and numbers, dates and codes written as they should be said."
          />
        </div>
      }
    >
      <p>Sort the replies.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["One breath per sentence", "Listeners can't scroll back."],
  ["A few options", "And say how many first."],
  ["No symbols or bullets", "Write it as it's said."],
  ["SSML or instructions", "Support varies by voice."],
  ["Normalise upstream", "Ask the model for spoken-form text."],
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
      <p>Next: cloning voices, and why consent matters.</p>
    </StepLayout>
  );
}
