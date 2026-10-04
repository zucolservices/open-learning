"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MEMORIES, RANK, score, type Kind } from "./model";
import type { MemState } from "./state";

/* 1 ─ The assistant with a notebook --------------------------------------------------------------- */

export function Notebook() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The assistant with a notebook"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">No notebook</p>
            <p className="text-muted mt-1">
              Brilliant in the moment. Tomorrow, you explain everything again: your team, your diet,
              last month&apos;s disaster.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A good notebook</p>
            <p className="text-muted mt-1">
              Facts about you, what happened last time, and the rules you&apos;ve agreed. Looked up
              when needed, not read cover to cover.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Imagine a brilliant assistant who forgets everything overnight. Every morning you start from
        scratch. Give them a notebook, and they get better at helping you each week.
      </p>
      <p>
        Language models are that forgetful assistant: they remember nothing between calls.
        Everything they know about your task must be in the{" "}
        <Term id="context-window">context window</Term>. <Term id="agent-memory">Agent memory</Term>{" "}
        is the notebook: notes saved outside the model and loaded back in when useful.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A week later ⭐ ----------------------------------------------------------------------------- */

const KINDS: { id: Kind; label: string; plain: string }[] = [
  { id: "semantic", label: "Semantic", plain: "facts" },
  { id: "episodic", label: "Episodic", plain: "what happened" },
  { id: "procedural", label: "Procedural", plain: "how to act" },
];

export function WeekLater() {
  const [s, set] = useSceneState<MemState>();
  const kinds = s.kinds ?? [];
  const toggle = (k: Kind) =>
    set({ kinds: kinds.includes(k) ? kinds.filter((x) => x !== k) : [...kinds, k] });
  const kept = MEMORIES.filter((m) => kinds.includes(m.kind) && !(m.sensitive && s.filter));
  const leaked = kept.some((m) => m.sensitive);
  const used = kept.filter((m) => m.used);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A week later"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <p className="text-muted text-[10px]">MONDAY&apos;S CONVERSATION MENTIONED</p>
            <p className="mt-1">
              Twelve people on the team · Asha is vegetarian · last offsite&apos;s venue was too
              noisy · &ldquo;always check the budget with me first&rdquo; · Asha&apos;s card number,
              for a booking
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted mr-1 text-[10px]">LONG-TERM MEMORY</span>
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                aria-pressed={kinds.includes(k.id)}
                onClick={() => toggle(k.id)}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  kinds.includes(k.id) ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {kinds.includes(k.id) ? "✓ " : "+ "}
                {k.label} <span className="text-muted">({k.plain})</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.filter}
              onChange={(e) => set({ filter: e.target.checked })}
              className="accent-accent"
            />
            Never store payment details or other sensitive data
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[10px]">
              NEXT MONDAY: &ldquo;Book dinner for the team on Friday.&rdquo;
            </p>
            {used.length === 0 ? (
              <p className="mt-1 text-xs">
                &ldquo;Happy to help! How many people, any dietary needs, and what&apos;s your
                budget?&rdquo; It remembers nothing.
              </p>
            ) : (
              <ul className="mt-1 flex flex-col gap-1 text-xs">
                {used.map((m) => (
                  <motion.li
                    key={m.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span className="text-good">✓</span> {m.used}{" "}
                    <span className="text-muted">({m.text})</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
          {leaked && (
            <p className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
              It also saved &ldquo;card ends 4242, expiry 08/28&rdquo;. That&apos;s now in every
              future context, and in any leak.
            </p>
          )}
        </div>
      }
    >
      <p>
        A useful way to divide memory, from the CoALA framework (2023):{" "}
        <Term id="working-memory">working memory</Term> is what&apos;s in the context right now.
        Long-term memory comes in three kinds: semantic (facts), episodic (what happened) and
        procedural (how to act).
      </p>
      <p>
        Switch them on and see what the assistant can do a week later. Then notice what it
        shouldn&apos;t remember: good memory design decides what to forget as carefully as what to
        keep.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Choosing what to recall --------------------------------------------------------------------- */

export function Recall() {
  const [s, set] = useSceneState<MemState>();
  const use = { recency: s.recency, importance: s.importance, relevance: s.relevance };
  const ranked = [...RANK].map((m) => ({ m, sc: score(m, use) })).sort((a, b) => b.sc - a.sc);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing what to recall"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            Query: &ldquo;Book dinner for the team on Friday.&rdquo; Only the top three memories fit
            in the context.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {(["recency", "importance", "relevance"] as const).map((k) => (
              <label key={k} className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={s[k]}
                  onChange={(e) => set({ [k]: e.target.checked })}
                  className="accent-accent"
                />
                {k}
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {ranked.map(({ m, sc }, i) => (
              <motion.div
                key={m.id}
                layout
                className={cn(
                  "grid grid-cols-[1fr_4rem] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  i < 3 ? "border-accent bg-accent-soft" : "border-line bg-surface opacity-60",
                )}
              >
                <span>
                  {m.text} <span className="text-muted">· {m.daysAgo}d ago</span>
                </span>
                <span className="text-right font-mono">{sc.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A long-lived assistant collects far more memories than fit in its context, so it must
        choose. Stanford&apos;s Generative Agents (2023) scored each memory on recency, importance
        (rated by the model) and relevance to the current situation, and added them up.
      </p>
      <p>
        Try recency alone: yesterday&apos;s lunch order beats the vegetarian fact. Add relevance and
        importance and the right memories rise.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Memory in real products --------------------------------------------------------------------- */

export function Products() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Memory in real products"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 text-xs sm:grid-cols-3">
            {[
              [
                "ChatGPT",
                "Memory tested from Feb 2024; referencing past chats from Apr 2025. Temporary Chat for none.",
              ],
              [
                "Claude",
                "Memory for teams from Sept 2025, free users from Mar 2026; editable. Incognito chats for none.",
              ],
              ["Gemini", "Past-chat memory from Aug 2025. Temporary Chats for none."],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">For builders</p>
            <p className="text-muted">
              Anthropic&apos;s memory tool stores memory as files in your own application; LangGraph
              stores, LangMem, Mem0 and Letta (formerly MemGPT, which treats the context like RAM
              and storage like disk) offer memory layers.
            </p>
          </div>
          <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Memory can be poisoned</p>
            <p className="text-muted">
              In 2024 a researcher showed that a malicious web page could plant instructions in
              ChatGPT&apos;s long-term memory through prompt injection, so they followed the user
              into later chats.
            </p>
          </div>
        </div>
      }
    >
      <p>
        All the major assistants now remember across conversations, and all offer a mode that
        remembers nothing. Users should be able to see, edit and delete what&apos;s remembered. Note
        that deleting a ChatGPT chat doesn&apos;t delete memories saved from it.
      </p>
      <p>
        Memory is also an attack surface: anything written into it from untrusted content can come
        back later as an instruction. Module 17 returns to this.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which kind of memory? ----------------------------------------------------------------------- */

export function WhichMemory() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of memory?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="memory-kind"
            prompt="Which kind of memory is each?"
            categories={[
              { id: "working", label: "Working" },
              { id: "semantic", label: "Semantic" },
              { id: "episodic", label: "Episodic" },
              { id: "procedural", label: "Procedural" },
            ]}
            items={[
              {
                id: "now",
                label: "The tool result the agent just received",
                category: "working",
                why: "In the context right now.",
              },
              {
                id: "fact",
                label: "The customer's preferred language is Tamil",
                category: "semantic",
                why: "A fact.",
              },
              {
                id: "event",
                label: "Last week's refund attempt failed because the order was archived",
                category: "episodic",
                why: "Something that happened.",
              },
              {
                id: "rule",
                label: "Always confirm amounts over ₹10,000 with a person",
                category: "procedural",
                why: "How to act.",
              },
              {
                id: "address",
                label: "The office is on the 4th floor of Tower B",
                category: "semantic",
                why: "A fact.",
              },
            ]}
            explanation="Working memory is the current context. Long-term memory holds facts (semantic), past events (episodic) and ways of acting (procedural)."
          />
        </div>
      }
    >
      <p>Sort them.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Models forget", "Everything must be in the context."],
  ["Memory is a notebook", "Saved outside, loaded when useful."],
  ["Four kinds", "Working, semantic, episodic, procedural."],
  ["Recall wisely", "Relevance, importance and recency."],
  ["Forget on purpose", "Visible, editable, no sensitive data."],
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
      <p>Next: long tasks that overflow the context window, and how agents keep going.</p>
    </StepLayout>
  );
}
