"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HANDS } from "./model";
import type { HandsState } from "./state";

/* 1 ─ Doing the errand yourself ------------------------------------------------------------------- */

export function Errand() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Doing the errand yourself"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {[
            ["Phone the shop", "Fast and simple, if they have a phone line for exactly this."],
            ["Write a note", "Hand a precise list to someone who can do it all at once."],
            ["Go in person", "Works anywhere, but slow, and you might pick up the wrong thing."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Some errands have a dedicated service: a phone line, an online form. When they don&apos;t,
        you go in person. That works everywhere, but it&apos;s slower and easier to get wrong.
      </p>
      <p>
        Agents face the same choice. When there&apos;s no tool for a job, they can fall back on
        general-purpose hands: writing and running code (
        <Term id="code-execution">code execution</Term>), driving a browser, or operating a whole
        desktop through <Term id="computer-use">computer use</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One task, four ways ⭐ ---------------------------------------------------------------------- */

export function FourHands() {
  const [s, set] = useSceneState<HandsState>();
  const h = HANDS.find((x) => x.id === s.hand) ?? HANDS[0];
  const risky = h.id !== "tool" && !s.sandbox;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One task, four ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            Task: find September&apos;s three largest invoices in the accounts system and total
            them.
          </p>
          <div className="flex flex-wrap gap-1">
            {HANDS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.hand === x.id}
                onClick={() => set({ hand: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.hand === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex flex-wrap gap-1 rounded-xl border p-3"
          >
            {h.steps.map((st, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-md px-2 py-1 font-mono text-[10px]",
                  st === "screenshot" ? "bg-viz-meta/15 text-muted" : "bg-surface-2",
                )}
              >
                {i + 1}. {st}
              </span>
            ))}
          </motion.div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">{h.steps.length}</p>
              <p className="text-muted">steps</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">~{h.time}s</p>
              <p className="text-muted">time</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                h.reliable > 90
                  ? "border-good bg-good/10"
                  : h.reliable > 75
                    ? "border-viz-compute bg-viz-compute/10"
                    : "border-bad bg-bad/10",
              )}
            >
              <p className="font-mono text-lg font-semibold">{h.reliable}%</p>
              <p className="text-muted">runs right</p>
            </div>
          </div>
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <p className="border-line bg-surface rounded-lg border px-3 py-2">
              <span className="font-semibold">Reach: </span>
              {h.reach}
            </p>
            <p
              className={cn(
                "rounded-lg border px-3 py-2",
                risky ? "border-bad bg-bad/10" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">Risk: </span>
              {risky
                ? "Unsandboxed: it runs with access to your real files, accounts and network."
                : h.risk}
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.sandbox}
              onChange={(e) => set({ sandbox: e.target.checked })}
              className="accent-accent"
            />
            Run in an isolated sandbox
          </label>
          <p className="text-subtle text-[10px]">
            Steps, times and success rates are illustrative.
          </p>
        </div>
      }
    >
      <p>
        The same task, four ways. A purpose-built tool is quick and reliable but only exists where
        someone built it. Each step down the list reaches further, takes longer, fails more often
        and carries more risk.
      </p>
      <p>
        So prefer the narrowest hand that can do the job, and run the general ones in a{" "}
        <Term id="sandbox">sandbox</Term>, an isolated environment where mistakes and attacks
        can&apos;t touch anything that matters.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How computer use sees ----------------------------------------------------------------------- */

const SHOTS = [
  {
    title: "Take a screenshot",
    text: "The model gets a picture of the screen, not a list of buttons.",
    screen: ["Desktop", "[Accounts]  [Mail]  [Files]"],
    cursor: null as null | [number, number],
  },
  {
    title: "Choose an action",
    text: "It works out the pixel coordinates of the Accounts icon and asks for a click at (88, 52).",
    screen: ["Desktop", "[Accounts]  [Mail]  [Files]"],
    cursor: [5, 16] as [number, number],
  },
  {
    title: "Your code clicks",
    text: "The application performs the click. Nothing happens until the next screenshot shows the result.",
    screen: ["Accounts — loading…", ""],
    cursor: [5, 16] as [number, number],
  },
  {
    title: "Screenshot again",
    text: "Like a flipbook: it sees snapshots, not motion. A pop-up that appears and vanishes between frames is invisible to it.",
    screen: ["Accounts", "Invoices  |  Customers  |  Reports"],
    cursor: null,
  },
];

export function Flipbook() {
  const [s, set] = useSceneState<HandsState>();
  const f = SHOTS[s.frame] ?? SHOTS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How computer use sees"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line-strong bg-surface-2 relative mx-auto aspect-[16/10] w-full max-w-sm overflow-hidden rounded-lg border">
            <div className="bg-surface border-line border-b px-2 py-1 font-mono text-[10px]">
              {f.screen[0]}
            </div>
            <p className="px-3 py-4 font-mono text-xs">{f.screen[1]}</p>
            {f.cursor && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="border-accent absolute size-5 rounded-full border-2"
                style={{ left: `${f.cursor[0]}%`, top: `${f.cursor[1]}%` }}
              />
            )}
          </div>
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={SHOTS.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Anthropic released computer use in October 2024: the model looks at screenshots and asks for
        mouse moves, clicks and keystrokes. OpenAI and Google followed in 2025 with their own
        browser and computer agents.
      </p>
      <p>
        Progress has been fast. On the OSWorld benchmark of desktop tasks, humans scored about 72%
        in 2024 while the best agents managed about 12%; by mid-2026 top agents passed 80% on a
        cleaned-up version. It is still slower and less predictable than calling a tool.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Sandboxes and code -------------------------------------------------------------------------- */

export function Sandboxes() {
  const ladder: [string, string][] = [
    ["OS sandbox or container", "Restricts files and network, but shares the host's kernel."],
    ["gVisor", "A user-space kernel between the code and the real one."],
    [
      "MicroVM (e.g. Firecracker)",
      "A tiny virtual machine per task; the strongest common isolation.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Sandboxes and code"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {ladder.map(([t, d], i) => (
              <div
                key={t}
                className="border-line bg-surface grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border px-3 py-2 text-xs"
              >
                <span>
                  <span className="font-semibold">{t}: </span>
                  <span className="text-muted">{d}</span>
                </span>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((k) => (
                    <span
                      key={k}
                      className={cn("h-3 w-2 rounded-sm", k <= i ? "bg-good" : "bg-surface-2")}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
          <Code>{`# "Code mode": one script instead of many tool calls
rows = crm.search(segment="enterprise")      # 4,000 rows stay here
late = [r for r in rows if r.days_overdue > 30]
print(len(late), sum(r.balance for r in late))  # only this reaches the model`}</Code>
        </div>
      }
    >
      <p>
        Agent code and agent-controlled computers should always run in a sandbox, with locked-down
        files and network. Stronger isolation costs a little speed; it&apos;s worth it for code
        nobody has reviewed.
      </p>
      <p>
        Code is also a smarter way to use tools. Rather than calling tools one at a time and reading
        every result, the agent writes a short script that calls them, so large intermediate data
        never fills its context. Cloudflare (September 2025) and Anthropic (November 2025) both
        described this approach.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which way to act? --------------------------------------------------------------------------- */

export function WhichHand() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which way to act?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-hand"
            prompt="What's the narrowest way to do each?"
            categories={[
              { id: "tool", label: "Dedicated tool" },
              { id: "code", label: "Code sandbox" },
              { id: "browser", label: "Browser" },
              { id: "desktop", label: "Desktop" },
            ]}
            items={[
              {
                id: "order",
                label: "Check an order's status; the shop has an order API",
                category: "tool",
                why: "A tool exists: use it.",
              },
              {
                id: "csv",
                label: "Compute averages over a 2 GB CSV file",
                category: "code",
                why: "Code handles big data without filling the context.",
              },
              {
                id: "form",
                label: "Submit a form on a supplier's website that has no API",
                category: "browser",
                why: "Only the website offers it.",
              },
              {
                id: "legacy",
                label: "Export a report from old desktop software with no web version",
                category: "desktop",
                why: "Nothing else can reach it.",
              },
            ]}
            explanation="Prefer the narrowest hand that works: tools first, then code, then a browser, and a full desktop only when nothing else can reach the job, always sandboxed."
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
  ["Three general hands", "Code, a browser, a whole desktop."],
  ["Reach versus reliability", "The more general, the slower and riskier."],
  ["Narrowest first", "Tools, then code, then screens."],
  ["Always sandbox", "Lock down files and network."],
  ["Code mode", "Scripts keep big data out of the context."],
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
      <p>Next: how agents break big goals into plans.</p>
    </StepLayout>
  );
}
