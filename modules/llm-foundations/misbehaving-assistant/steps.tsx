"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, FlaskConical, Inbox, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES, type Case, type CaseId, type Choice } from "./cases";
import data from "./data.json";
import type { MisbehaveState } from "./state";

/* 1 ─ The complaints queue ------------------------------------------------------------------------ */

const TRACE_FIELDS: [string, string][] = [
  ["Input", "The user's message, the system prompt version and any retrieved pages"],
  ["Settings", "Model, temperature, top_p, max_tokens"],
  ["Output", "The reply, token counts and the finish reason"],
  ["Timing", "When it happened and how long each part took"],
];

export function Queue() {
  return (
    <StepLayout
      eyebrow="Capstone"
      title="The complaints queue"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 flex items-center gap-1.5 text-[11px]">
              <Inbox className="size-3.5" /> Krishi Sahayak: open complaints this week
            </p>
            <div className="grid gap-1.5">
              {CASES.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
                >
                  <p className="font-semibold">
                    {c.n}. {c.title} <span className="text-muted font-normal">· {c.from}</span>
                  </p>
                  <p className="text-muted mt-0.5">{c.complaint}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="border-line bg-surface-2 rounded-xl border p-3">
            <p className="mb-1.5 text-xs font-semibold">What a trace records for every answer</p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {TRACE_FIELDS.map(([k, v]) => (
                <div key={k} className="text-xs">
                  <span className="font-medium">{k}: </span>
                  <span className="text-muted">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        A good mechanic doesn&apos;t guess from “it makes a funny noise”. They plug in and read the
        fault codes. For an LLM app, the fault codes are its <Term id="llm-trace">traces</Term>.
      </p>
      <p>
        Krishi Sahayak, a farmers&apos; helpline assistant, passed its tests but is misbehaving in
        production. Four complaints, four different causes. For each: read the evidence, name the
        cause, choose a fix and re-test.
      </p>
      <p className="text-muted text-sm">
        Cases 1–3 use real outputs from a small open model. Case 4 is a simulated, defanged
        injection.
      </p>
    </StepLayout>
  );
}

/* Shared case file ----------------------------------------------------------------------------------- */

function Evidence({ c, found }: { c: Case; found: boolean }) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      <div className="border-line bg-surface rounded-xl border p-3">
        <p className="text-muted mb-1.5 text-[11px]">Transcript</p>
        <div className="grid gap-1.5">
          {c.transcript.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs",
                m.who === "farmer" ? "bg-surface-2 mr-6" : "bg-accent-soft ml-6",
              )}
            >
              <span className="text-muted block text-[9px] uppercase">{m.who}</span>
              {m.text}
            </div>
          ))}
        </div>
      </div>
      <div className="border-line bg-surface rounded-xl border p-3">
        <p className="text-muted mb-1.5 text-[11px]">Trace</p>
        <div className="grid gap-1 font-mono text-[11px]">
          {c.trace.map((r) => (
            <div
              key={r.k}
              className={cn(
                "grid grid-cols-[7.5rem_1fr] gap-2 rounded px-1.5 py-0.5",
                found && r.clue && "bg-bad/10 ring-bad/40 ring-1",
              )}
            >
              <span className="text-muted">{r.k}</span>
              <span className="break-words">{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Choices({
  title,
  options,
  picked,
  onPick,
}: {
  title: string;
  options: Choice[];
  picked?: string;
  onPick(id: string): void;
}) {
  const p = options.find((o) => o.id === picked);
  const good = p && (p.verdict === "right" || p.verdict === "good");
  return (
    <div>
      <p className="mb-1 text-xs font-semibold">{title}</p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={o.id === picked}
            onClick={() => onPick(o.id)}
            className={cn(
              "rounded-xl border px-3 py-2 text-left text-xs",
              o.id === picked
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface hover:bg-surface-2",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {p && (
          <motion.p
            key={p.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-1.5 flex items-start gap-1.5 rounded-xl border px-3 py-2 text-xs",
              good
                ? "border-good/50 bg-good/10"
                : p.verdict === "partial"
                  ? "border-line-strong bg-surface-2"
                  : "border-bad/50 bg-bad/10",
            )}
          >
            {good ? (
              <Check className="text-good mt-0.5 size-3.5 shrink-0" />
            ) : p.verdict === "partial" ? (
              <AlertTriangle className="text-muted mt-0.5 size-3.5 shrink-0" />
            ) : (
              <X className="text-bad mt-0.5 size-3.5 shrink-0" />
            )}
            <span>{p.feedback}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function CaseFile({ id, intro, retest }: { id: CaseId; intro: ReactNode; retest: ReactNode }) {
  const [s, set] = useSceneState<MisbehaveState>();
  const c = CASES.find((x) => x.id === id)!;
  const cause = c.causes.find((o) => o.id === s.dx[id]);
  const found = cause?.verdict === "right";
  const fix = c.fixes.find((o) => o.id === s.fix[id]);
  const fixed = found && fix?.verdict === "good";
  const done = fixed && s.retested.includes(id);
  return (
    <StepLayout
      eyebrow={`Case ${c.n} of 4 · fix the problem`}
      title={c.title}
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
            <span className="text-muted">Complaint from {c.from}: </span>
            {c.complaint}
          </div>
          <Evidence c={c} found={found} />
          <Choices
            title="1. What's the cause?"
            options={c.causes}
            picked={s.dx[id]}
            onPick={(v) => set({ dx: { ...s.dx, [id]: v } })}
          />
          {found && (
            <Choices
              title="2. What's the fix?"
              options={c.fixes}
              picked={s.fix[id]}
              onPick={(v) => set({ fix: { ...s.fix, [id]: v } })}
            />
          )}
          {fixed && !done && (
            <button
              type="button"
              onClick={() => set({ retested: [...s.retested, id] })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 self-start rounded-full px-4 py-1.5 text-xs font-medium"
            >
              <FlaskConical className="size-3.5" /> Re-test with the fix
            </button>
          )}
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-good/40 bg-good/5 rounded-xl border p-3"
            >
              <p className="mb-2 text-xs font-semibold">3. Re-test</p>
              {retest}
            </motion.div>
          )}
        </div>
      }
    >
      {intro}
    </StepLayout>
  );
}

/* 2 ─ Case 1: cut off (real tokenizer) -------------------------------------------------------------- */

const LANG_NAME = { en: "English", hi: "Hindi", kn: "Kannada" } as const;

export function Case1() {
  const L = data.trunc.langs;
  return (
    <CaseFile
      id="cutoff"
      intro={
        <>
          <p>
            Start with the trace, not the transcript. Look for the field that says <em>why</em> the
            model stopped: the <Term id="finish-reason">finish reason</Term>.
          </p>
          <p className="text-muted text-sm">
            The answer and its cut-off are real: the Qwen2.5 tokenizer, a {data.trunc.limit}-token
            limit. Notice the Hindi version in the re-test ended on a broken character: the limit
            fell in the middle of a letter&apos;s bytes.
          </p>
        </>
      }
      retest={
        <div className="grid gap-1.5">
          {(["en", "hi", "kn"] as const).map((l) => (
            <div key={l} className="grid grid-cols-[4.5rem_1fr] gap-2 text-xs">
              <span className="text-muted">{LANG_NAME[l]}</span>
              <div>
                <div className="bg-surface-2 relative h-2.5 overflow-hidden rounded">
                  <motion.div
                    className="bg-good h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(L[l].tokens / 600) * 100}%` }}
                  />
                  <span
                    className="bg-bad absolute inset-y-0 w-px"
                    style={{ left: `${(data.trunc.limit / 600) * 100}%` }}
                  />
                </div>
                <p className="text-muted mt-0.5 text-[10px]">
                  {L[l].tokens} tokens · old limit {data.trunc.limit} would{" "}
                  {L[l].tokens > data.trunc.limit ? "cut it" : "fit"} · new limit 600: complete
                </p>
                {l !== "en" && (
                  <p className="text-[10px]">
                    <span className="text-muted">Old reply ended: </span>…{L[l].cut.slice(-24)}
                  </p>
                )}
              </div>
            </div>
          ))}
          <p className="text-xs">
            With a 600-token limit every language finishes with finish_reason “stop”, and an alert
            fires if “length” ever appears again.
          </p>
        </div>
      }
    />
  );
}

/* 3 ─ Case 2: sampling (real samples) ---------------------------------------------------------------- */

type TempKey = keyof typeof data.sampling.runs;
const TEMPS: [TempKey, string][] = [
  ["0.2", "0.2"],
  ["1", "1.0"],
  ["1.2", "1.2 (production)"],
  ["1.5", "1.5"],
];

export function Case2() {
  const [s, set] = useSceneState<MisbehaveState>();
  const t = (s.temp in data.sampling.runs ? s.temp : "1.2") as TempKey;
  const runs = data.sampling.runs[t];
  const flags = data.sampling.flags[t];
  const bad = flags.filter(Boolean).length;
  return (
    <CaseFile
      id="sampling"
      intro={
        <>
          <p>
            Same question, same page, different answers. When the input is identical and the output
            isn&apos;t, suspect the dice: the <Term id="sampling">sampling</Term> settings.
          </p>
          <p className="text-muted text-sm">
            The re-test shows eight real answers from Qwen2.5-1.5B-Instruct at each{" "}
            <Term id="temperature">temperature</Term> (top_p 1.0 for 1.0–1.5, 0.9 for 0.2).
          </p>
        </>
      }
      retest={
        <div className="flex flex-col gap-2">
          <p className="text-muted text-[11px]">Page: {data.sampling.page}</p>
          <Segmented size="sm" value={t} options={TEMPS} onChange={(v) => set({ temp: v })} />
          <p className={cn("text-xs font-semibold", bad ? "text-bad" : "text-good")}>
            {bad === 0
              ? "8 of 8 answers correct and consistent"
              : `${bad} of 8 answers wrong, invented or garbled`}
          </p>
          <div className="grid max-h-72 gap-1 overflow-y-auto">
            {runs.map((r, i) => (
              <div
                key={t + i}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-[11px]",
                  flags[i] ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
                )}
              >
                <p className="break-words">{r}</p>
                {flags[i] && <p className="text-bad mt-0.5 text-[10px]">{flags[i]}</p>}
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* 4 ─ Case 3: buried instruction (real) -------------------------------------------------------------- */

export function Case3() {
  return (
    <CaseFile
      id="buried"
      intro={
        <>
          <p>
            The model did exactly what its <Term id="system-prompt">system prompt</Term> said. The
            trouble is, the prompt said two opposite things.
          </p>
          <p className="text-muted text-sm">
            System prompts grow by patches from different teams. A rule buried in the middle, then
            contradicted later, is a common and quiet failure.
          </p>
        </>
      }
      retest={
        <div className="grid gap-2 text-xs">
          <div>
            <p className="text-muted text-[10px]">Fixed prompt starts with</p>
            <p className="font-mono text-[11px]">{data.buried.fixedPrompt.split("\n")[0]}</p>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            <div className="border-bad/40 bg-bad/5 rounded-lg border px-2.5 py-1.5">
              <p className="text-muted text-[10px]">Before (Qwen2.5-1.5B, real)</p>
              {data.buried.qwen.broken}
            </div>
            <div className="border-good/40 bg-good/5 rounded-lg border px-2.5 py-1.5">
              <p className="text-muted text-[10px]">After (same model, same question)</p>
              {data.buried.qwen.fixed}
            </div>
          </div>
          <p className="text-muted text-[11px]">
            Phi-4-mini declined to promise approval with both prompts. Some models resolve the
            contradiction the way you meant, but you shouldn&apos;t make them guess.
          </p>
        </div>
      }
    />
  );
}

/* 5 ─ Case 4: injection (simulated) ----------------------------------------------------------------- */

export function Case4() {
  return (
    <CaseFile
      id="injection"
      intro={
        <>
          <p>
            The fee came from somewhere. Follow the trace to the retrieved pages, and ask which ones
            you actually trust. This is <Term id="prompt-injection">indirect prompt injection</Term>
            : instructions hidden in content the model reads.
          </p>
          <p className="text-muted text-sm">
            Simulated and defanged: no live attack was run, and the malicious text is described, not
            shown.
          </p>
        </>
      }
      retest={
        <div className="grid gap-1.5 text-xs">
          {[
            ["Search index", "Official pages only; forum pages removed (412 → 400 pages)"],
            ["Retrieved", "official/subsidy-drip.md, official/faq-registration.md"],
            ["Output check", "Blocks replies asking for payment or containing a UPI ID"],
            [
              "Reply",
              "Visit your Raitha Samparka Kendra with your Aadhaar card, RTC and bank passbook. Registration is free: the department never asks for a fee.",
            ],
            ["Follow-up", "Incident opened; farmers who got the fee message contacted"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-2">
              <span className="text-muted">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      }
    />
  );
}

/* 6 ─ Sort symptoms ----------------------------------------------------------------------------------- */

export function SortSymptoms() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name the cause"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="symptoms"
            prompt="New complaints from other assistants. Which kind of cause would you check first?"
            categories={[
              { id: "tokens", label: "Tokens" },
              { id: "sampling", label: "Sampling" },
              { id: "prompt", label: "Prompt" },
              { id: "injection", label: "Injection" },
            ]}
            items={[
              {
                id: "tamil",
                label: "Tamil replies cost five times what English ones do",
                category: "tokens",
                why: "The tokenizer splits Tamil into many more tokens.",
              },
              {
                id: "garble",
                label: "Hindi replies sometimes end on a broken character",
                category: "tokens",
                why: "A token limit cut through a multi-byte character. Check finish_reason.",
              },
              {
                id: "retry",
                label: "Asking twice gives two different prices",
                category: "sampling",
                why: "Identical input, different output: the temperature is too high for facts.",
              },
              {
                id: "generous",
                label: "Refunds became lax right after a “be generous” paragraph was added",
                category: "prompt",
                why: "A new instruction is overriding an older rule. Read the prompt diff.",
              },
              {
                id: "pdf",
                label: "After reading a supplier's PDF, the agent emailed the price list outside",
                category: "injection",
                why: "Untrusted content steered the tools. Check what the agent read.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Each cause leaves a different fingerprint in the evidence. Learn to spot them and
        you&apos;ll know which part of the trace to read first.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Debugging loop (order) ------------------------------------------------------------------------ */

export function DebugLoop() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The debugging loop"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="debug-loop"
            prompt="Put the steps of fixing an LLM bug in order."
            items={[
              {
                id: "repro",
                label: "Reproduce it with the exact input and settings from the trace",
              },
              {
                id: "read",
                label: "Read the trace: prompt, retrieved pages, settings, finish reason",
              },
              { id: "hypo", label: "Form one hypothesis about the cause" },
              { id: "change", label: "Change one thing" },
              { id: "eval", label: "Re-run your test questions to check nothing else broke" },
              { id: "regress", label: "Add this case to the test set so it can't quietly return" },
            ]}
            explanation="Change one thing at a time, or you won't know what fixed it. And every production bug becomes a test: that's how an eval set grows into a safety net."
          />
        </div>
      }
    >
      <p>
        The four cases followed the same loop. It&apos;s the loop for any system; with LLMs the last
        two steps matter most, because a fix for one answer can quietly break another.
      </p>
      <p className="text-muted text-sm">
        The test set is an <Term id="eval">eval</Term>: questions with known good answers, run after
        every change to prompts, settings or models.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap (track finale) ----------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Log a trace for every answer",
    "Prompt version, retrieved pages, settings, tokens, finish reason.",
  ],
  ["Tokens differ by language", "Budget limits and costs per language, from measurements."],
  [
    "Match sampling to the job",
    "Low temperature for facts; creativity is a setting, not a virtue.",
  ],
  ["Treat prompts like code", "Owners, reviews and tests; no quiet contradicting patches."],
  [
    "Trust only what you control",
    "Retrieved text is data. Keep untrusted sources out, and check outputs.",
  ],
  ["Every bug becomes a test", "Your eval set is the memory of everything that went wrong."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Track finale"
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
      <p>
        That&apos;s the end of LLM Foundations. You started with a model that predicts one token at
        a time; you&apos;ve finished diagnosing a production assistant from its traces.
      </p>
      <p>
        Every case here came back to something from the track: tokens, sampling, prompts, injection.
        The models will change quickly. These ideas won&apos;t.
      </p>
    </StepLayout>
  );
}
