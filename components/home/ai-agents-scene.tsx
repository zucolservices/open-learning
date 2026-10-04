"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: from a request, round the loop, out to the world and back. */
const PARTS: Part[] = [
  {
    id: "user",
    name: "A goal",
    text: "someone asks for an outcome, not an answer; the agent decides the steps (modules 1–3).",
  },
  {
    id: "loop",
    name: "The loop",
    text: "the model thinks, calls a tool, reads the result and decides again, within turn and budget limits (modules 2, 7–9).",
  },
  {
    id: "tools",
    name: "Tools and MCP",
    text: "narrow, well-described tools, many reached through the Model Context Protocol; code and browsers when nothing else fits (modules 4–6).",
  },
  {
    id: "memory",
    name: "Memory and state",
    text: "notes, facts and checkpoints outside the context window so long tasks survive (modules 10–12).",
  },
  {
    id: "agents",
    name: "Other agents",
    text: "workers it delegates to, and agents at other companies reached over A2A (modules 13–15).",
  },
  {
    id: "guard",
    name: "Guardrails",
    text: "least privilege, checks on inputs and outputs, and a broken lethal trifecta (modules 16–17).",
  },
  {
    id: "human",
    name: "A person",
    text: "approves what matters and takes over when the agent is stuck (module 18).",
  },
  {
    id: "evals",
    name: "Evals and traces",
    text: "outcome, path and cost measured over many runs; every run traced (modules 19–20).",
  },
];

function Box({
  x,
  y,
  w,
  h,
  label,
  on,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  on: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className={on ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        className={cn("font-mono text-[7px]", on ? "fill-accent" : "fill-fg")}
      >
        {label}
      </text>
    </g>
  );
}

function Diagram({ active, onSelect }: { active: string; onSelect(id: string): void }) {
  const f = (ids: string[]) => ({
    opacity: ids.includes(active) ? 1 : 0.35,
    transition: { duration: 0.35 },
  });
  const hit = (id: string) => ({
    onClick: () => onSelect(id),
    style: { cursor: "pointer" } as const,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
  });
  const on = (id: string) => active === id;
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <motion.g animate={f(["user"])} {...hit("user")}>
        <Box x={8} y={80} w={56} h={22} label="goal" on={on("user")} />
      </motion.g>
      <motion.g animate={f(["loop"])} {...hit("loop")}>
        <path d="M64 91 H96" className="stroke-line-strong" strokeWidth={1} />
        <circle
          cx={150}
          cy={91}
          r={44}
          className={on("loop") ? "stroke-accent" : "stroke-line-strong"}
          strokeDasharray="4 3"
          strokeWidth={1.2}
        />
        <Box x={122} y={80} w={56} h={22} label="model" on={on("loop")} />
        {[0, 1, 2].map((k) => (
          <circle key={k} r={2.4} className="fill-accent">
            <animateMotion
              dur="3s"
              begin={`-${k}s`}
              repeatCount="indefinite"
              path="M150 47 A44 44 0 1 1 149.9 47"
            />
          </circle>
        ))}
      </motion.g>
      <motion.g animate={f(["tools"])} {...hit("tools")}>
        <path
          d="M194 80 L232 40 M194 91 H232 M194 102 L232 142"
          className="stroke-line-strong"
          strokeWidth={1}
        />
        {["search", "orders", "code"].map((t, i) => (
          <Box key={t} x={232} y={30 + i * 51} w={56} h={20} label={t} on={on("tools")} />
        ))}
      </motion.g>
      <motion.g animate={f(["memory"])} {...hit("memory")}>
        <Box x={110} y={156} w={80} h={20} label="memory · state" on={on("memory")} />
      </motion.g>
      <motion.g animate={f(["agents"])} {...hit("agents")}>
        <path d="M288 91 H310" className="stroke-line-strong" strokeWidth={1} />
        <Box x={310} y={80} w={64} h={22} label="other agents" on={on("agents")} />
      </motion.g>
      <motion.g animate={f(["guard"])} {...hit("guard")}>
        <rect
          x={100}
          y={10}
          width={200}
          height={178}
          rx={10}
          className={on("guard") ? "stroke-accent" : "stroke-line"}
          strokeDasharray="2 4"
        />
        <text
          x={200}
          y={22}
          textAnchor="middle"
          className={
            on("guard") ? "fill-accent font-mono text-[7px]" : "fill-muted font-mono text-[7px]"
          }
        >
          guardrails
        </text>
      </motion.g>
      <motion.g animate={f(["human"])} {...hit("human")}>
        <Box x={8} y={30} w={56} h={22} label="person" on={on("human")} />
        <path d="M36 52 V80" className="stroke-line-strong" strokeDasharray="2 2" strokeWidth={1} />
      </motion.g>
      <motion.g animate={f(["evals"])} {...hit("evals")}>
        <Box x={310} y={150} w={64} h={22} label="evals · traces" on={on("evals")} />
      </motion.g>
      <text x={10} y={196} className="fill-muted font-mono text-[7px]">
        a model in a loop, with tools, memory and limits
      </text>
    </svg>
  );
}

/** AI Agents showcase: an agent system, toured part by part; click any part. */
export function AiAgentsScene() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setI((n) => (n + 1) % PARTS.length), 2600);
    return () => clearInterval(id);
  }, [auto]);
  const part = PARTS[i];
  return (
    <div className="flex flex-col gap-3">
      <Diagram
        active={part.id}
        onSelect={(id) => {
          setAuto(false);
          setI(PARTS.findIndex((p) => p.id === id));
        }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={part.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-muted min-h-10 text-sm"
        >
          <span className="text-fg font-semibold">{part.name}:</span> {part.text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
