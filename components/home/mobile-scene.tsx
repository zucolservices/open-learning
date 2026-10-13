"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: from the first screen to the stores. */
const PARTS: Part[] = [
  {
    id: "found",
    name: "Foundations",
    text: "how phones differ, native or cross-platform, and the app lifecycle (modules 1–3).",
  },
  {
    id: "screens",
    name: "Building screens",
    text: "declarative UI, navigation and deep links, touch and gestures, phones to foldables (modules 4–7).",
  },
  {
    id: "data",
    name: "Data and networking",
    text: "offline first, flaky networks, on-device storage, background work and push (modules 8–11).",
  },
  {
    id: "device",
    name: "The device",
    text: "permissions and privacy, camera, location and sensors, accessibility (modules 12–14).",
  },
  {
    id: "quality",
    name: "Performance and quality",
    text: "fast start-up and smooth scrolling, battery and memory, testing on many devices (modules 15–17).",
  },
  {
    id: "ship",
    name: "Shipping",
    text: "store review, staged releases, security and crash reports; then a capstone café app (modules 18–22).",
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
  ["found", "basics", 22],
  ["screens", "screens", 82],
  ["data", "data", 142],
  ["device", "device", 202],
  ["quality", "quality", 262],
  ["ship", "ship", 322],
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
      <rect
        x={172}
        y={14}
        width={36}
        height={64}
        rx={7}
        className="fill-surface stroke-line-strong"
        strokeWidth={1}
      />
      <rect x={185} y={18} width={10} height={2.5} rx={1.25} className="fill-line-strong" />
      {[0, 1, 2].map((k) => (
        <rect
          key={k}
          x={178}
          y={28 + k * 10}
          width={24}
          height={6}
          rx={2}
          className="fill-viz-idle/50"
        />
      ))}
      <rect x={178} y={62} width={24} height={8} rx={4} className="fill-accent/40" />
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
        pocket → screens → data → device → stores
      </text>
      <text x={10} y={196} className="fill-muted font-mono text-[7px]">
        works offline, one-handed, on every phone
      </text>
    </svg>
  );
}

/** Mobile showcase: the track as a tour from the first screen to the stores; click any part. */
export function MobileScene() {
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
