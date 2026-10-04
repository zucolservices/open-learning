"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { simulate } from "./model";
import type { ToolsState } from "./state";

/* 1 ─ "Bear with me a moment" --------------------------------------------------------------------- */

export function OnHold() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“Bear with me a moment”"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-sm">
          {[
            ["Receptionist", "Let me just pull that up…", "agent"],
            ["", "(typing)", "silence"],
            ["Receptionist", "Right, so I'll move you to Friday at 4. Is that OK?", "agent"],
            ["You", "Perfect.", "caller"],
            ["Receptionist", "…and that's done. You'll get a text.", "agent"],
          ].map(([w, t, k], i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 * i }}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-1.5",
                k === "caller"
                  ? "bg-accent-soft self-end"
                  : k === "silence"
                    ? "text-subtle self-center text-xs"
                    : "bg-surface border-line self-start border",
              )}
            >
              {w && <span className="text-muted mr-1 text-[11px]">{w}:</span>}
              {t}
            </motion.p>
          ))}
        </div>
      }
    >
      <p>
        A good receptionist changing your booking does three things without thinking: they tell you
        when they&apos;re looking something up, they read the change back before making it, and they
        only say &ldquo;done&rdquo; once it is.
      </p>
      <p>
        A voice agent uses <Term id="tool-calling">tool calling</Term> to do the actual work, just
        like a text agent. The difference is that the caller is waiting on the line, hearing every
        second of silence.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Change a booking mid-call ⭐ ---------------------------------------------------------------- */

const WHO_STYLE: Record<string, string> = {
  caller: "bg-accent-soft self-end",
  agent: "bg-surface-2 self-start",
  tool: "self-center font-mono text-[10px] text-viz-compute",
  silence: "self-center text-[10px] text-subtle italic",
};

export function ChangeBooking() {
  const [s, set] = useSceneState<ToolsState>();
  const r = simulate(s);
  const toggles: [keyof ToolsState, string][] = [
    ["preamble", "Say a short line while the lookup runs"],
    ["confirm", "Read the change back and get a yes first"],
    ["waitResult", "Say “done” only after the tool succeeds"],
    ["fails", "What if the slot is taken by then?"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Change a booking mid-call"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">lookup takes</span>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.5}
              value={s.lookup}
              onChange={(e) => set({ lookup: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Lookup time"
            />
            <span className="w-10 font-mono">{s.lookup.toFixed(1)} s</span>
          </label>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {toggles.map(([k, l]) => (
              <label
                key={k}
                className={cn("flex items-start gap-2 text-[11px]", k === "fails" && "text-muted")}
              >
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
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3">
            {r.ev.map((e, i) => (
              <motion.div
                key={`${i}-${e.text}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i }}
                className={cn(
                  "flex max-w-[90%] items-baseline gap-2 rounded-lg px-2.5 py-1 text-xs",
                  WHO_STYLE[e.who],
                  e.tone === "bad" && "text-bad",
                  e.tone === "good" && "text-good",
                  e.who === "silence" && e.tone === "bad" && "bg-bad/10 not-italic",
                )}
              >
                <span className="text-subtle font-mono text-[9px]">{e.t.toFixed(1)}s</span>
                <span>{e.text}</span>
              </motion.div>
            ))}
          </div>
          <motion.p
            key={JSON.stringify(s)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              r.outcome.tone === "good" ? "border-good bg-good/10" : "border-bad bg-bad/10",
            )}
          >
            {r.outcome.text}
            {r.longest > 2 &&
              " And the caller sat through a long silence wondering if the line had dropped."}
          </motion.p>
          <p className="text-subtle text-[10px]">Illustrative timings.</p>
        </div>
      }
    >
      <p>
        The caller wants to move a booking. The agent must look it up (a read) and then change it
        (an action). Make the lookup slow, then switch on the three habits one at a time. Finally,
        make the change fail.
      </p>
      <p>
        The model never runs the tool itself: it asks your app to call a function, your code does
        the work, and the result goes back to the model. Until that result arrives, the model
        doesn&apos;t know whether it worked.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three ways to avoid dead air ---------------------------------------------------------------- */

export function NoDeadAir() {
  const ways: [string, string, string][] = [
    [
      "Say a short line first",
      "“Let me check that.” spoken at the same moment as the tool call. OpenAI's prompting guides call these preambles and suggest keeping them short.",
      "Simple; works everywhere.",
    ],
    [
      "Don't block the conversation",
      "With a non-blocking call the conversation carries on while the tool runs, and the result is slotted in when it lands. Gemini Live lets you choose whether it interrupts, waits for a pause, or arrives silently (on models that support it).",
      "Watch out: the model may guess a result before it arrives.",
    ],
    [
      "Front voice, back office",
      "A fast voice model keeps chatting while a slower backend agent does the reasoning and tool work, as in OpenAI's GPT-Live (2026).",
      "Most capable; most moving parts.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways to avoid dead air"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ways.map(([t, d, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">
                <span className="text-accent mr-1 font-mono">{i + 1}</span>
                {t}
              </p>
              <p className="text-muted mt-0.5">{d}</p>
              <p className="text-subtle mt-0.5 text-[11px]">{n}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A <Term id="spoken-preamble">spoken preamble</Term> is the simplest fix. The others let the
        conversation keep moving: a <Term id="non-blocking-call">non-blocking call</Term> runs in
        the background.
      </p>
      <p>
        Whichever you use, tell the model plainly: never say something succeeded before the tool
        says so.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Numbers, letters and cards ------------------------------------------------------------------ */

export function ReadBack() {
  const rows: [string, string, string][] = [
    ["Phone number", "“4155550123”", "“4-1-5… 5-5-5… 0-1-2-3.”"],
    ["Booking code", "“BD7”", "“B as in Bravo, D as in Delta, 7.”"],
    [
      "Date and amount",
      "“14/10, $120.50”",
      "“Tuesday the 14th of October, for 120 dollars and 50 cents.”",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Numbers, letters and cards"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {rows.map(([k, bad, good]) => (
              <div
                key={k}
                className="border-line bg-surface grid grid-cols-[6.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs sm:grid-cols-[7rem_7rem_1fr]"
              >
                <span className="text-muted">{k}</span>
                <span className="text-bad line-through decoration-1">{bad}</span>
                <span className="col-span-2 sm:col-span-1">{good}</span>
              </div>
            ))}
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Card payments: keep the AI out of it</p>
            <p className="text-muted mt-1">
              Card rules forbid keeping the security code after a payment is authorised, even
              encrypted. An agent that transcribes and logs everything shouldn&apos;t hear card
              details at all. Hand the caller to a secure payment step, for example keying digits on
              the keypad with masking, and confirm only the last four digits.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Before changing anything, the agent reads back exactly what will change. Exact values need
        care on the ear: digits in small groups with pauses, spelling alphabets for letters, and
        dates and amounts in full.
      </p>
      <p>
        Payments are special. Under <Term id="pci-dss">PCI DSS</Term>, contact centres pause
        recordings, mask <Term id="dtmf">keypad tones</Term> or hand off to a secure payment line. A
        voice agent should do the same.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Just do it, or ask first? ------------------------------------------------------------------- */

export function AskFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Just do it, or ask first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="ask-first"
            prompt="The caller asks for each of these. What should the agent do?"
            categories={[
              { id: "do", label: "Just look it up" },
              { id: "ask", label: "Read back, get a yes" },
              { id: "secure", label: "Hand to secure payment" },
            ]}
            items={[
              {
                id: "hours",
                label: "“What time do you close on Saturday?”",
                category: "do",
                why: "A read: nothing changes.",
              },
              {
                id: "status",
                label: "“Has my prescription been sent?”",
                category: "do",
                why: "A lookup.",
              },
              {
                id: "cancel",
                label: "“Cancel my Thursday appointment.”",
                category: "ask",
                why: "An action: say what will change, then do it.",
              },
              {
                id: "card",
                label: "“I'll pay the bill now, my card number is…”",
                category: "secure",
                why: "Card details shouldn't reach the AI or its logs.",
              },
              {
                id: "address",
                label: "“Update my address to 12 Park Road.”",
                category: "ask",
                why: "Changes a record; read it back first.",
              },
            ]}
            explanation="Reads: just do them. Changes: read back, get a clear yes, report only after success. Card details: route around the AI."
          />
        </div>
      }
    >
      <p>Sort the requests.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["No dead air", "Preamble, non-blocking, or a front voice."],
  ["Read back before changing", "Then get a clear yes."],
  ["“Done” only when done", "Wait for the tool result."],
  ["Say exact values clearly", "Digits in groups, letters spelled."],
  ["Keep card data away", "Use a secure payment step."],
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
      <p>Next: the platforms and services you can build all of this on.</p>
    </StepLayout>
  );
}
