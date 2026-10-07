"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: the layers an attacker must get through, outside in. */
const PARTS: Part[] = [
  {
    id: "design",
    name: "Threat-model & design",
    text: "find what can go wrong before building, and design in least privilege and defence in depth (modules 1–4).",
  },
  {
    id: "input",
    name: "Input",
    text: "keep data from becoming code: parameterised queries, output encoding, safe parsing (modules 5–8).",
  },
  {
    id: "identity",
    name: "Identity & access",
    text: "passwords, MFA and passkeys, careful sessions, and an authorisation check on every request (modules 9–13).",
  },
  {
    id: "web",
    name: "The browser",
    text: "the same-origin rules, CSRF defences and security headers that protect the page (modules 14–15).",
  },
  {
    id: "server",
    name: "Server & data",
    text: "stop SSRF, encrypt in transit and at rest, and keep secrets in a vault (modules 16–18).",
  },
  {
    id: "pipeline",
    name: "Supply chain & testing",
    text: "know your dependencies, and put security tests in the pipeline (modules 19–20).",
  },
  {
    id: "respond",
    name: "Detect & respond",
    text: "assume something gets through: log, alert, and have a plan (modules 21–22).",
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
  const PATH =
    "M60 51 H320 Q350 51 350 85 V109 Q350 141 320 141 H60 Q30 141 30 109 V85 Q30 51 60 51";
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <path d={PATH} className="stroke-line-strong" strokeWidth={1} />
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} r={2.4} className="fill-accent">
          <animateMotion dur="6s" begin={`-${k * 1.5}s`} repeatCount="indefinite" path={PATH} />
        </circle>
      ))}
      <motion.g animate={f(["design"])} {...hit("design")}>
        <Box x={36} y={40} w={70} h={22} label="design" on={on("design")} />
      </motion.g>
      <motion.g animate={f(["input"])} {...hit("input")}>
        <Box x={122} y={40} w={70} h={22} label="input" on={on("input")} />
      </motion.g>
      <motion.g animate={f(["identity"])} {...hit("identity")}>
        <Box x={208} y={40} w={70} h={22} label="identity" on={on("identity")} />
      </motion.g>
      <motion.g animate={f(["web"])} {...hit("web")}>
        <Box x={294} y={40} w={70} h={22} label="browser" on={on("web")} />
      </motion.g>
      <motion.g animate={f(["server"])} {...hit("server")}>
        <Box x={294} y={130} w={70} h={22} label="server · data" on={on("server")} />
      </motion.g>
      <motion.g animate={f(["pipeline"])} {...hit("pipeline")}>
        <Box x={165} y={130} w={76} h={22} label="supply chain" on={on("pipeline")} />
      </motion.g>
      <motion.g animate={f(["respond"])} {...hit("respond")}>
        <Box x={36} y={130} w={70} h={22} label="detect" on={on("respond")} />
      </motion.g>
      <text x={190} y={100} textAnchor="middle" className="fill-muted font-mono text-[8px]">
        an attacker must beat every layer
      </text>
      <text x={10} y={196} className="fill-muted font-mono text-[7px]">
        the defender&apos;s layers, from threat model to detection and response
      </text>
    </svg>
  );
}

/** Application Security showcase: the defence layers, toured part by part; click any part. */
export function AppSecurityScene() {
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
