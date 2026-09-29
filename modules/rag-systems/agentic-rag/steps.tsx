"use client";

import { motion } from "motion/react";
import { ArrowRight, Repeat, Search, MessageSquare, AlertTriangle } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { AgentState } from "./state";

const PASSAGES = data.passages as Record<string, { title: string; text: string }>;

/** Answers were capped in length; mark the ones that were cut off. */
const ended = (t: string) => (/[.!?)\]]$/.test(t.trim()) ? t : `${t}…`);

/* 1 ─ The clerk and the assistant --------------------------------------------------------------- */

export function ClerkAndAssistant() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The clerk and the assistant"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "The clerk (plain RAG)",
              "Pulls the one file that best matches your question, every time, then answers from it.",
              "Fast, cheap, predictable. Stuck if the answer needs two files.",
            ],
            [
              "The assistant (agentic RAG)",
              "Decides what to look up, reads it, notices what's missing, looks again, and stops when done.",
              "Handles harder questions. Slower, costlier, and can go round in circles.",
            ],
          ].map(([t, d, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm">{d}</p>
              <p className="text-muted mt-2 text-xs">{n}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every RAG system so far searched once, before answering. That&apos;s the clerk. An{" "}
        <Term id="agentic-rag">agentic RAG</Term> system hands the model the key to the filing
        cabinet: it decides <em>whether</em> to search, <em>what</em> to search for, and when it has
        enough.
      </p>
      <p>
        This module shows how that works, lets you watch a small model try it for real, and ends
        with MCP, the common plug that connects agents to tools.
      </p>
    </StepLayout>
  );
}

/* 2 ─ How an agent works (illustration, written by us) ------------------------------------------ */

type Frame = { who: "user" | "model" | "app"; title: string; body: string; code?: string };

const SHOP_Q =
  "My shop's trade licence expired while the citizen portal was down and I was fined. How do I renew the licence, and how do I complain about the fine?";

const FRAMES: Frame[] = [
  { who: "user", title: "The question arrives", body: SHOP_Q },
  {
    who: "model",
    title: "The model asks for a tool",
    body: "Two things are needed: how to renew, and how to complain. It starts with the first. It doesn't run the search itself; it writes a request.",
    code: `{ "tool": "search", "arguments": { "query": "renew trade licence" } }`,
  },
  {
    who: "app",
    title: "Your program runs it",
    body: "The app runs the search and adds the results to the conversation.",
    code: `[trade-2] ${PASSAGES["trade-2"]?.text}\n[form-T-3] ${PASSAGES["form-T-3"]?.text}`,
  },
  {
    who: "model",
    title: "It reads, and searches again",
    body: "Renewal is covered. The complaint part isn't, so it asks for a second search.",
    code: `{ "tool": "search", "arguments": { "query": "complain about a fine" } }`,
  },
  {
    who: "app",
    title: "Second results",
    body: "The complaints page comes back.",
    code: `[grievance-1] ${PASSAGES["grievance-1"]?.text}`,
  },
  {
    who: "model",
    title: "It stops and answers",
    body: "Both parts are covered, so there is no reason to search again. It answers with citations.",
    code: "Renew with Form T-3 [form-T-3]; late renewal costs ₹100 a month [trade-2]. To dispute the fine, file a complaint on the citizen portal or at a ward office; you'll get a tracking number [grievance-1].",
  },
];

const WHO: Record<Frame["who"], [string, typeof Search]> = {
  user: ["Resident", MessageSquare],
  model: ["Model", ArrowRight],
  app: ["Your program", Search],
};

export function HowAgentWorks() {
  const [s, set] = useSceneState<AgentState>();
  const f = FRAMES[s.frame];
  return (
    <StepLayout
      eyebrow="Step-through · illustration"
      title="How an agent works"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Stepper
            step={s.frame}
            count={FRAMES.length}
            onChange={(n) => set({ frame: n })}
            label="Illustration, written by us"
          />
          <div className="flex flex-col gap-1.5">
            {FRAMES.slice(0, s.frame + 1).map((x, i) => {
              const [who, Icon] = WHO[x.who];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    x.who === "model"
                      ? "border-accent bg-accent-soft ml-6"
                      : x.who === "app"
                        ? "border-line bg-surface-2 ml-12"
                        : "border-line bg-surface",
                    i < s.frame && "opacity-60",
                  )}
                >
                  <p className="text-muted flex items-center gap-1 text-[10px] tracking-wide uppercase">
                    <Icon className="size-3" /> {who}
                  </p>
                  {x.code ? (
                    <Code className="mt-1 text-[10px] whitespace-pre-wrap">{x.code}</Code>
                  ) : (
                    <p className="mt-0.5">{x.body}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.body}
          </FrameCaption>
        </div>
      }
    >
      <p>
        This is <Term id="tool-calling">tool calling</Term>. The model never runs anything. It
        writes a small structured request (which tool, which arguments), your program runs it, and
        the result goes back into the conversation. The loop repeats until the model answers.
      </p>
      <p>
        The idea goes back to ReAct (2022), where a model alternated thinking and searching. Every
        major provider now supports it: Anthropic, OpenAI, Google and the open models alike.
      </p>
    </StepLayout>
  );
}

/* 3 ─ A small model tries ⭐ (real traces) ------------------------------------------------------- */

function TraceStep({ t, i }: { t: (typeof data.runs)[number]["trace"][number]; i: number }) {
  if (t.kind === "search")
    return (
      <li className="border-line bg-surface flex flex-col gap-0.5 rounded border px-2 py-1 text-[11px]">
        <span className="flex items-center gap-1">
          <Search className="size-3" />
          <span className="text-muted font-mono">{i + 1}</span> search: {t.query}
        </span>
        <span className="text-muted pl-4 text-[10px]">→ {t.hits?.join(", ")}</span>
      </li>
    );
  if (t.kind === "repeat")
    return (
      <li className="border-bad/50 bg-bad/10 flex items-center gap-1 rounded border px-2 py-1 text-[11px]">
        <Repeat className="size-3" />
        <span className="text-muted font-mono">{i + 1}</span> repeated: {t.query}
        <span className="text-muted">(blocked by our guard)</span>
      </li>
    );
  return (
    <li
      className={cn(
        "rounded border px-2 py-1 text-[11px]",
        t.kind === "forced" ? "border-bad/50 bg-bad/5" : "border-accent bg-accent-soft",
      )}
    >
      <span className="text-muted text-[10px] tracking-wide uppercase">
        {t.kind === "forced" ? "Forced to answer" : "Answer"}
      </span>
      <p className="line-clamp-6 whitespace-pre-line">{ended(t.said.replace(/^ANSWER:\s*/, ""))}</p>
    </li>
  );
}

const GUARD: Record<string, string> = {
  none: "No limits beyond a 6-step cap",
  budget: "Budget of 4 searches, shown to the model; repeated queries blocked",
  forced: "Budget, repeat blocking, and a forced answer at the end",
};

export function SmallModelTries() {
  const [s, set] = useSceneState<AgentState>();
  const run = data.runs.find((r) => r.key === s.run)!;
  const answered = run.trace.some((t) => t.kind === "answer" || t.kind === "forced");
  return (
    <StepLayout
      eyebrow="Simulation · real output"
      title="A small model tries"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {data.runs.map((r) => (
              <button
                key={r.key}
                type="button"
                aria-pressed={s.run === r.key}
                onClick={() => set({ run: r.key })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.run === r.key
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
            {run.q}
          </p>
          <p className="text-muted text-[11px]">Guard: {GUARD[run.guard]}</p>
          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <p className="text-muted mb-1 text-[11px]">
                Agent: {run.trace.length} model calls{!answered && ", no answer"}
              </p>
              <ol className="flex flex-col gap-1">
                {run.trace.map((t, i) => (
                  <TraceStep key={i} t={t} i={i} />
                ))}
              </ol>
              <p className="border-line bg-surface-2 mt-1.5 rounded-lg border px-2 py-1 text-[11px]">
                {run.agentVerdict}
              </p>
            </div>
            <div>
              <p className="text-muted mb-1 text-[11px]">Plain RAG: 1 search, 1 model call</p>
              <p className="border-line bg-surface mb-1 rounded border px-2 py-1 text-[10px]">
                → {run.single.hits.join(", ")}
              </p>
              <p className="border-line bg-surface rounded border px-2 py-1 text-[11px] whitespace-pre-line">
                {ended(run.single.answer)}
              </p>
              <p className="border-line bg-surface-2 mt-1.5 rounded-lg border px-2 py-1 text-[11px]">
                {run.singleVerdict}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        We gave Phi-4-mini, a 3.8-billion-parameter model, one tool (search over the 32 Kalpanagar
        passages) and let it run. Every step is real and unedited. The model wrote its requests as
        plain text (&ldquo;SEARCH: …&rdquo;), which small models follow more reliably than JSON.
      </p>
      <p>
        It went badly. On the three-part question it circled, re-wording the same search until the
        step cap stopped it. A budget made it answer, but with parts missing. Blocking repeats and
        forcing an answer produced a worse answer, with passages under the wrong ids. On easy
        questions it matched plain RAG, at twice the calls.
      </p>
      <p>
        The lesson isn&apos;t that agents don&apos;t work. Large models run useful research loops
        every day. It&apos;s that the loop is only as good as the model driving it, and that one
        well-built search is a strong baseline. Measure before you switch.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Budgets and stopping ---------------------------------------------------------------------- */

const LIMITS: [string, string][] = [
  [
    "Loops are an old problem",
    "The original ReAct paper saw models repeat the same thought and search and never escape. That's why every framework has a step limit.",
  ],
  [
    "Set the cap yourself",
    "OpenAI's Agents SDK stops after 10 turns by default; LlamaIndex agents after 20 iterations. LangGraph's default used to be 25 and is now in the thousands, so set your own.",
  ],
  [
    "Too much, and too little",
    "Agents search when they already know (over-search) and stop too soon (under-search). One 2026 study found accuracy stopped improving after about seven searches while cost kept rising, and more searching made models worse at saying “I don't know”.",
  ],
  [
    "The bill",
    "Anthropic reported its agents use about 4× the tokens of a chat, and its multi-agent research system about 15×. Deep-research tools take minutes, not seconds.",
  ],
];

export function Budgets() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Budgets and stopping"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {LIMITS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Give every agent a budget (searches, steps, time or tokens), tell it how much is left, and
        decide what happens when it runs out. Log every step so you can see loops like the ones in
        the last step.
      </p>
      <p>
        Managed options do this for you: Azure AI Search&apos;s agentic retrieval splits a question
        into sub-queries and runs them in parallel; Amazon&apos;s Bedrock managed knowledge base has
        an agentic retriever with a maximum number of iterations; OpenAI&apos;s file search lets the
        model decide when to search your files.
      </p>
    </StepLayout>
  );
}

/* 5 ─ MCP: one plug for many tools -------------------------------------------------------------- */

const SERVERS: { name: string; kind: string; offers: [string, string][] }[] = [
  {
    name: "Document search",
    kind: "Remote, over Streamable HTTP",
    offers: [
      ["Tool", "search(query): the model decides when to call it"],
      ["Resource", "The rule book itself, which the app can attach"],
      ["Prompt", "“Answer a resident's question”, a template the user picks"],
    ],
  },
  {
    name: "Applications database",
    kind: "Remote, over Streamable HTTP",
    offers: [
      ["Tool", "run_query(sql), read-only views only"],
      ["Resource", "The table descriptions from module 14"],
    ],
  },
  {
    name: "Files on this laptop",
    kind: "Local program, over stdio",
    offers: [
      ["Tool", "read_file(path), inside one allowed folder"],
      ["Resource", "The folder listing"],
    ],
  },
];

export function Mcp() {
  const [s, set] = useSceneState<AgentState>();
  const srv = SERVERS[s.mcp];
  return (
    <StepLayout
      eyebrow="Explore"
      title="MCP: one plug for many tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1.3fr]">
            <div className="border-accent bg-accent-soft rounded-xl border px-3 py-2 text-center text-xs">
              <p className="font-semibold">Any MCP-capable app</p>
              <p className="text-muted mt-0.5 text-[11px]">
                Claude, ChatGPT, Gemini, Copilot, VS Code, Cursor, your own agent
              </p>
            </div>
            <ArrowRight className="text-muted mx-auto size-4 rotate-90 sm:rotate-0" />
            <div className="flex flex-col gap-1.5">
              {SERVERS.map((x, i) => (
                <button
                  key={x.name}
                  type="button"
                  aria-pressed={s.mcp === i}
                  onClick={() => set({ mcp: i })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    s.mcp === i
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <span className="font-medium">MCP server: {x.name}</span>
                  <span className="text-muted block text-[10px]">{x.kind}</span>
                </button>
              ))}
            </div>
          </div>
          <motion.div
            key={s.mcp}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-3 py-2"
          >
            <p className="text-muted text-[10px] tracking-wide uppercase">
              What “{srv.name}” offers (an example, written by us)
            </p>
            <ul className="mt-1 flex flex-col gap-0.5 text-xs">
              {srv.offers.map(([k, v]) => (
                <li key={k}>
                  <span className="font-semibold">{k}:</span> {v}
                </li>
              ))}
            </ul>
          </motion.div>
          <div className="border-bad/50 bg-bad/5 flex gap-2 rounded-xl border px-3 py-2 text-xs">
            <AlertTriangle className="text-bad mt-0.5 size-4 shrink-0" />
            <p>
              <span className="font-semibold">The lethal trifecta.</span> If one agent can read
              private data, sees untrusted content (a web page, an email, a tool result) and can
              send data out, an attacker can make it leak the data. Remove one of the three.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Every app used to need its own connector for every tool. The{" "}
        <Term id="mcp">Model Context Protocol</Term> is a common plug shape: build one MCP server
        for your document search, and any MCP-capable app can use it.
      </p>
      <p>
        A server can offer <strong>tools</strong> (the model decides to call them),{" "}
        <strong>resources</strong> (data the app attaches) and <strong>prompts</strong> (templates
        the user picks). Anthropic released MCP in November 2024 and gave it to the Linux
        Foundation&apos;s Agentic AI Foundation in December 2025; the current specification is dated
        28 July 2026.
      </p>
      <p>
        Anything a tool returns is untrusted text, and it can contain instructions. Module 21 covers
        this in depth.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Agent or single search? ------------------------------------------------------------------- */

export function WhenAgent() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Agent or single search?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="agent-or-not"
            prompt="For each case, would you start with one well-built search or an agent loop?"
            categories={[
              { id: "single", label: "Single search" },
              { id: "agent", label: "Agent" },
            ]}
            items={[
              {
                id: "faq",
                label: "A help-desk bot answering “what's the fee for X?” thousands of times a day",
                category: "single",
                why: "One fact per question, high volume, cost and speed matter. Hybrid search and a reranker do this well.",
              },
              {
                id: "report",
                label:
                  "An officer asking for a briefing that combines rules, circulars and last year's figures",
                category: "agent",
                why: "Several sources, several searches, and the need to notice what's missing: what agents are for, with a capable model and a budget.",
              },
              {
                id: "phone",
                label: "A voice assistant that must answer within two seconds",
                category: "single",
                why: "Every extra model call adds seconds. Agents take far longer.",
              },
              {
                id: "tools",
                label:
                  "An assistant that must look up an application's status, then the rule that applies to it",
                category: "agent",
                why: "The second lookup depends on the first result. That chain is a natural fit for an agent loop.",
              },
            ]}
            explanation="Start with the simplest thing that works, and measure. Agents earn their cost when a question needs several lookups that depend on each other, and only with a model capable of driving the loop."
          />
        </div>
      }
    >
      <p>An agent costs more calls and time. When is it worth it?</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Retrieval becomes a tool", "The model decides when and what to search; your program runs it."],
  ["Budgets are mandatory", "Cap steps, show what's left, decide what happens at the end."],
  ["The model matters", "A small model looped; one good search beat it."],
  ["MCP is the plug", "One server, many apps. Tool results are untrusted text."],
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
      <p>
        Next: documents that aren&apos;t just text, with scanned forms, photos and diagrams in
        multimodal RAG.
      </p>
    </StepLayout>
  );
}
