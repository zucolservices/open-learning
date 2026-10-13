"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: from why government is different to running a service for years. */
const PARTS: Part[] = [
  {
    id: "different",
    name: "Why government is different",
    text: "everyone is a user, digital public infrastructure, and how government buys (modules 1–3).",
  },
  {
    id: "rules",
    name: "Standards and rules",
    text: "GIGW 3.0, accessibility law, every language and script, and approved hosting (modules 4–7).",
  },
  {
    id: "identity",
    name: "Identity and data",
    text: "digital identity, DigiLocker and eSign, consent-based data sharing, and open data (modules 8–11).",
  },
  {
    id: "services",
    name: "Designing public services",
    text: "service design, low-end phones and slow networks, forms and payments, grievances (modules 12–15).",
  },
  {
    id: "secure",
    name: "Security and resilience",
    text: "CERT-In's rules, results-day surges, and records and recovery (modules 16–18).",
  },
  {
    id: "deliver",
    name: "Delivering and sustaining",
    text: "open source, vendor contracts and measuring outcomes; then a capstone scholarship portal (modules 19–22).",
  },
];

function Box({
  x,
  y,
  w,
  label,
  on,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  on: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={22}
        rx={4}
        className={on ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + 14}
        textAnchor="middle"
        className={cn("font-mono text-[7px]", on ? "fill-accent" : "fill-fg")}
      >
        {label}
      </text>
    </g>
  );
}

const FLOW: [string, string, number][] = [
  ["different", "why", 22],
  ["rules", "rules", 82],
  ["identity", "identity", 142],
  ["services", "services", 202],
  ["secure", "secure", 262],
  ["deliver", "deliver", 322],
];

function Diagram({ active, onSelect }: { active: string; onSelect(id: string): void }) {
  const f = (id: string) => ({ opacity: id === active ? 1 : 0.4, transition: { duration: 0.35 } });
  const hit = (id: string) => ({
    onClick: () => onSelect(id),
    style: { cursor: "pointer" } as const,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
  });
  const PATH = "M20 101 H360";
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <path d={PATH} className="stroke-line-strong" strokeWidth={1} />
      {[0, 1, 2].map((k) => (
        <circle key={k} r={2.6} className="fill-viz-data">
          <animateMotion dur="7s" begin={`-${k * 2.3}s`} repeatCount="indefinite" path={PATH} />
        </circle>
      ))}
      {FLOW.map(([id, , x]) => (
        <rect key={`u-${id}`} x={x} y={90} width={50} height={22} rx={4} className="fill-surface" />
      ))}
      {FLOW.map(([id, label, x]) => (
        <motion.g key={id} animate={f(id)} {...hit(id)}>
          <Box x={x} y={90} w={50} label={label} on={active === id} />
        </motion.g>
      ))}
      <polygon
        points="166,30 190,16 214,30"
        className="fill-surface stroke-line-strong"
        strokeWidth={1}
      />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={170 + k * 12} y={33} width={5} height={36} className="fill-viz-idle/50" />
      ))}
      <rect x={164} y={70} width={52} height={6} rx={1} className="fill-accent/40" />
      <line
        x1={190}
        y1={78}
        x2={190}
        y2={88}
        className="stroke-line-strong"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={190} y={150} textAnchor="middle" className="fill-muted font-mono text-[8px]">
        tender → standards → data → services → outcomes
      </text>
      <text x={10} y={196} className="fill-muted font-mono text-[7px]">
        for every citizen, in every language, for decades
      </text>
    </svg>
  );
}

/** Building for Government showcase: the track as a tour; click any part. */
export function GovScene() {
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
