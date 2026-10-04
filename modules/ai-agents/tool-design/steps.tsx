"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BASE, PROBLEMS } from "./model";
import type { ToolState } from "./state";

/* 1 ─ Instructions for a new starter -------------------------------------------------------------- */

export function NewHire() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Instructions for a new starter"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">The note left on the desk</p>
            <p className="text-muted mt-1 font-mono">
              &ldquo;Use the system for stuff. Codes are in the drawer.&rdquo;
            </p>
          </div>
          <div className="border-good bg-good/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A proper handover</p>
            <p className="text-muted mt-1">
              &ldquo;To check an order, use Order Lookup with the order number (it starts with A-).
              If it says &lsquo;not found&rsquo;, check for a typo before asking the
              customer.&rdquo;
            </p>
          </div>
        </div>
      }
    >
      <p>
        Give a new colleague a vague note and they&apos;ll guess, ask the wrong system and get stuck
        on the first error. Give them a clear handover and they&apos;ll do the job on day one.
      </p>
      <p>
        A model meets your tools like that new starter: it knows only the name, the description and
        the inputs you give it. The tools, their descriptions and their messages make up the{" "}
        <Term id="aci">agent-computer interface</Term>, and it deserves as much care as a screen
        designed for people.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix three bad tools, and a fourth ⭐ -------------------------------------------------------- */

export function FixTools() {
  const [s, set] = useSceneState<ToolState>();
  const fixed = s.fixed ?? [];
  const p = PROBLEMS.find((x) => x.id === s.open) ?? PROBLEMS[0];
  const on = fixed.includes(p.id);
  const rate = BASE + PROBLEMS.filter((x) => fixed.includes(x.id)).reduce((a, x) => a + x.gain, 0);
  const toggle = (id: string) =>
    set({ fixed: fixed.includes(id) ? fixed.filter((x) => x !== id) : [...fixed, id] });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix three bad tools, and a fourth"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {PROBLEMS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.open === x.id}
                onClick={() => set({ open: x.id })}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs",
                  s.open === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span>{x.label}</span>
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    fixed.includes(x.id) ? "text-good" : "text-bad",
                  )}
                >
                  {fixed.includes(x.id) ? "fixed" : "broken"}
                </span>
              </button>
            ))}
          </div>
          <motion.div
            key={`${p.id}-${on}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <Code>{on ? p.good : p.bad}</Code>
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                on ? "border-good bg-good/10" : "border-bad bg-bad/10",
              )}
            >
              {on ? p.success : p.failure}
            </p>
          </motion.div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggle(p.id)}
              className="border-accent bg-accent-soft rounded-md border px-3 py-1.5 text-xs font-semibold"
            >
              {on ? "Undo the fix" : "Apply the fix"}
            </button>
            <div className="flex-1">
              <div className="bg-surface-2 h-2.5 overflow-hidden rounded-full">
                <motion.div
                  animate={{ width: `${rate}%` }}
                  className={cn("h-full rounded-full", rate > 85 ? "bg-good" : "bg-accent")}
                />
              </div>
              <p className="text-muted mt-1 text-[11px]">
                Tasks completed correctly: {rate}% (illustrative)
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A support agent uses these tools to answer customers. Open each problem, see how the model
        stumbles, and apply the fix. Nothing about the model changes; only the tools do.
      </p>
      <p>
        These fixes come straight from published advice by Anthropic and OpenAI: clear names with
        namespaces, outputs a reader can use, errors that say how to recover, and a few tools
        designed around jobs rather than one per API endpoint.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Anatomy of a tool --------------------------------------------------------------------------- */

export function Anatomy() {
  const parts: [string, string][] = [
    ["name", "Short, unique, namespaced by service: orders_get_status, not get."],
    ["description", "When to use it, what it returns, any limits. Write it for a new starter."],
    [
      "input schema",
      "JSON Schema: types, required fields, enums and examples. Name fields clearly (order_id, not id).",
    ],
    ["output", "Readable fields, small by default; offer pagination or a detail switch."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Anatomy of a tool"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`{
  "name": "refunds_request",
  "description": "Request a refund for one order. Only for orders
    delivered in the last 30 days. Returns a refund id. Ask the
    customer to confirm the amount before calling.",
  "input_schema": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string", "description": "e.g. A-4417" },
      "reason": { "type": "string",
                  "enum": ["damaged", "late", "wrong_item", "other"] }
    },
    "required": ["order_id", "reason"]
  }
}`}</Code>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {parts.map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <span className="text-accent font-mono">{t}: </span>
                <span className="text-muted">{d}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Tool inputs are described with <Term id="json-schema">JSON Schema</Term>, the format OpenAI,
        Anthropic and MCP all use. Strict modes make the model&apos;s arguments always match the
        schema, so a missing field or a wrong type becomes impossible.
      </p>
      <p>
        Every definition is sent to the model on every turn, so tool descriptions cost tokens.
        That&apos;s another reason to prefer a few well-described tools over dozens of
        near-duplicates.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Make mistakes impossible -------------------------------------------------------------------- */

export function MistakeProof() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Make mistakes impossible"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Relative paths allowed</p>
              <p className="text-muted font-mono">edit_file(&quot;src/app.py&quot;)</p>
              <p className="text-muted mt-1">
                After the agent changed folder, it edited the wrong file.
              </p>
            </div>
            <div className="border-good bg-good/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Absolute paths required</p>
              <p className="text-muted font-mono">edit_file(&quot;/repo/src/app.py&quot;)</p>
              <p className="text-muted mt-1">The mistake can no longer happen.</p>
            </div>
          </div>
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">HOW MANY TOOLS?</p>
            <p>
              OpenAI: aim for fewer than about 20 available at once (&ldquo;just a soft
              suggestion&rdquo;).
            </p>
            <p>Google: about 10–20 active tools.</p>
            <p>Bigger toolsets: newer APIs can search for and load tools only when needed.</p>
          </div>
        </div>
      }
    >
      <p>
        Anthropic reported that while building its coding agent, the model made mistakes with
        relative file paths once it moved out of the root folder. Requiring absolute paths fixed it,
        not by better instructions but by making the error impossible.
      </p>
      <p>
        Engineers call this mistake-proofing. Prefer tool designs where the wrong call can&apos;t be
        made: required fields, enums instead of free text, IDs the tool returned rather than ones
        the model must invent.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Good design or bad? ------------------------------------------------------------------------- */

export function GoodOrBad() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good design or bad?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="tool-design"
            prompt="Is each tool-design choice good or bad?"
            categories={[
              { id: "good", label: "Good design" },
              { id: "bad", label: "Bad design" },
            ]}
            items={[
              {
                id: "enum",
                label: "Use an enum for refund reason instead of free text",
                category: "good",
                why: "Invalid values become impossible.",
              },
              {
                id: "wrap",
                label: "One tool per API endpoint, so nothing is missed",
                category: "bad",
                why: "Dozens of similar tools confuse the model; design around jobs.",
              },
              {
                id: "err",
                label: "Return 'Error 500' and let the model work it out",
                category: "bad",
                why: "Errors should say what went wrong and how to fix it.",
              },
              {
                id: "ns",
                label: "Prefix tools by service: jira_search, asana_search",
                category: "good",
                why: "Namespaces tell similar tools apart.",
              },
              {
                id: "page",
                label: "Return 20 readable results with a 'next page' option",
                category: "good",
                why: "Small, meaningful output saves context.",
              },
              {
                id: "user",
                label: "Name the input 'user' and accept a name, email or id",
                category: "bad",
                why: "Ambiguous; call it user_id and accept one thing.",
              },
            ]}
            explanation="Design tools for the model as you would for a new colleague: clear names, unambiguous inputs, readable outputs, helpful errors and as few tools as the jobs need."
          />
        </div>
      }
    >
      <p>Sort the choices.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["The model sees only the definition", "Name, description, inputs."],
  ["Write for a new starter", "When to use it, what comes back."],
  ["Readable, small outputs", "Meaningful fields; paginate."],
  ["Errors that teach", "Say how to fix the call."],
  ["Fewer, job-shaped tools", "And make mistakes impossible."],
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
      <p>Next: a standard plug so any assistant can use any tool, the Model Context Protocol.</p>
    </StepLayout>
  );
}
