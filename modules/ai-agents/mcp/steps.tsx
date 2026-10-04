"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { BOXES, FRAMES } from "./model";
import type { McpState } from "./state";

/* 1 ─ A drawer of chargers ------------------------------------------------------------------------ */

export function Plugs() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A drawer of chargers"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Before</p>
            <p className="text-muted mt-1">
              A different cable for every phone, camera and speaker, and a drawer full of the wrong
              ones.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">One port</p>
            <p className="text-muted mt-1">
              USB-C: any charger fits any device. Makers build to the standard once.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Remember a drawer full of chargers, one for every device? A shared port fixed that: build to
        the standard once and everything fits.
      </p>
      <p>
        AI apps had the same problem with tools: every app wired up its own integration for every
        service. The <Term id="mcp">Model Context Protocol</Term>, launched by Anthropic in November
        2024, is the shared port: a tool provider writes one MCP server, and any compatible
        assistant can use it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Trace one request ⭐ ------------------------------------------------------------------------ */

const KIND: Record<string, string> = {
  app: "fill-accent/10 stroke-accent",
  client: "fill-viz-compute/10 stroke-viz-compute",
  server: "fill-viz-data/10 stroke-viz-data",
  person: "fill-surface-2 stroke-line-strong",
};

export function Trace() {
  const [s, set] = useSceneState<McpState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  const lit = new Set(f.lit);
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Trace one request"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-2">
            <svg
              viewBox="0 0 410 175"
              className="w-full"
              role="img"
              aria-label="An MCP host with three clients and three servers"
            >
              <rect
                x={80}
                y={20}
                width={150}
                height={148}
                rx={8}
                className="stroke-line-strong fill-none"
                strokeDasharray="3 3"
              />
              {[60, 100, 140].map((y) => (
                <line
                  key={y}
                  x1={225}
                  y1={y + 9}
                  x2={270}
                  y2={y + 9}
                  className="stroke-line-strong"
                />
              ))}
              {BOXES.map((b) => (
                <motion.g key={b.id} animate={{ opacity: lit.has(b.id) ? 1 : 0.3 }}>
                  <rect x={b.x} y={b.y} width={b.w} height={18} rx={4} className="fill-surface" />
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={18}
                    rx={4}
                    className={KIND[b.kind]}
                    strokeWidth={lit.has(b.id) ? 1.6 : 1}
                  />
                  <text
                    x={b.x + b.w / 2}
                    y={b.y + 12.5}
                    textAnchor="middle"
                    className="fill-fg font-mono text-[8px]"
                  >
                    {b.label}
                  </text>
                </motion.g>
              ))}
            </svg>
          </div>
          {f.msg ? (
            <Code>{f.msg}</Code>
          ) : (
            <div className="text-subtle text-[10px]">JSON-RPC messages appear here.</div>
          )}
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.caption}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Step through one request. The <Term id="mcp-host">host</Term> is the app you talk to. Inside
        it, one <Term id="mcp-client">client</Term> per connection talks to one{" "}
        <Term id="mcp-server">server</Term>, which wraps a service such as a calendar.
      </p>
      <p>
        Messages are JSON-RPC 2.0: small JSON requests and responses. Local servers run as a process
        on your machine and talk over stdio; remote ones use Streamable HTTP. Since the July 2026
        version of the spec, each request carries everything it needs, with no session to set up
        first.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why a standard helps ------------------------------------------------------------------------ */

export function MPlusN() {
  const [s, set] = useSceneState<McpState>();
  const custom = s.apps * s.tools;
  const std = s.apps + s.tools;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why a standard helps"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            ["apps", "AI apps", s.apps],
            ["tools", "tools and services", s.tools],
          ].map(([k, l, v]) => (
            <label key={k as string} className="flex items-center gap-2 text-xs">
              <span className="text-muted w-32">{l}</span>
              <input
                type="range"
                min={1}
                max={20}
                value={v as number}
                onChange={(e) => set({ [k as string]: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label={l as string}
              />
              <span className="w-6 font-mono">{v}</span>
            </label>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3">
              <p className="font-mono text-2xl font-semibold">{custom}</p>
              <p className="text-muted text-xs">custom integrations, one per app–tool pair</p>
            </div>
            <div className="border-good bg-good/10 rounded-xl border px-4 py-3">
              <p className="font-mono text-2xl font-semibold">{std}</p>
              <p className="text-muted text-xs">
                pieces with a standard: one client per app, one server per tool
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Without a standard, every app needs its own integration for every tool: apps times tools.
        With one, each app implements the protocol once and each tool provider writes one server:
        apps plus tools.
      </p>
      <p>
        That&apos;s why adoption spread quickly. OpenAI (March 2025), Google (April) and Microsoft
        (May) all added MCP support, and in December 2025 the protocol moved to the Linux
        Foundation&apos;s new Agentic AI Foundation, so no single company controls it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What servers offer -------------------------------------------------------------------------- */

export function Primitives() {
  const items: [string, string, string][] = [
    ["Tools", "Actions the model can call", "create_issue, send_message"],
    ["Resources", "Data the app can read in", "a file, a database schema"],
    ["Prompts", "Reusable templates a user can pick", "“Summarise this ticket”"],
    ["Elicitation", "The server asks the user a question mid-task", "“Which calendar?”"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What servers offer"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map(([t, d, e], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
                <p className="text-accent mt-0.5 font-mono text-[11px]">{e}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Treat unknown servers with care</p>
            <p className="text-muted">
              A server&apos;s tool descriptions go straight into the model&apos;s context. The spec
              says to treat them as untrusted and to keep a person able to approve or deny tool
              calls.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Servers offer three main things. Tools are chosen by the model; resources are usually chosen
        by the app; prompts are chosen by the user. Servers can also ask the user for input through
        elicitation.
      </p>
      <p>
        Remote servers can protect themselves with OAuth-based authorisation. An official registry
        for finding servers has been in preview since September 2025.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Tool, resource or prompt? ------------------------------------------------------------------- */

export function WhichPrimitive() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Tool, resource or prompt?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mcp-primitive"
            prompt="Which MCP primitive fits each?"
            categories={[
              { id: "tool", label: "Tool" },
              { id: "resource", label: "Resource" },
              { id: "prompt", label: "Prompt" },
            ]}
            items={[
              {
                id: "send",
                label: "Send a Slack message",
                category: "tool",
                why: "An action the model calls.",
              },
              {
                id: "file",
                label: "The contents of README.md",
                category: "resource",
                why: "Data to read in.",
              },
              {
                id: "review",
                label: "A 'review this pull request' template",
                category: "prompt",
                why: "A reusable template the user picks.",
              },
              {
                id: "event",
                label: "Create a calendar event",
                category: "tool",
                why: "An action with side effects.",
              },
              {
                id: "schema",
                label: "The database schema",
                category: "resource",
                why: "Context the app can include.",
              },
            ]}
            explanation="Tools are actions the model calls, resources are data the app reads, prompts are templates a user chooses."
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
  ["One plug for tools", "Write a server once; any MCP app can use it."],
  ["Host, client, server", "One client per server, inside the host."],
  ["JSON-RPC over stdio or HTTP", "Local or remote."],
  ["Tools, resources, prompts", "Plus elicitation."],
  ["Open and shared", "Under the Linux Foundation since Dec 2025."],
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
        Next: the most general tools of all, running code, using a browser and operating a computer.
      </p>
    </StepLayout>
  );
}
