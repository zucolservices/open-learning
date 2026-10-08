"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: the life of one person's personal data under the DPDP Act. */
const PARTS: Part[] = [
  {
    id: "notice",
    name: "Notice",
    text: "tell people what data you want, why, and how to withdraw and complain, before you ask (modules 1–5).",
  },
  {
    id: "consent",
    name: "Consent or a legitimate use",
    text: "a free, specific, clear yes, as easy to take back as to give, or one of section 7's uses (modules 6–8).",
  },
  {
    id: "use",
    name: "Use for the purpose",
    text: "only for what it was collected for, by you and the processors bound by your contracts (modules 9, 11).",
  },
  {
    id: "protect",
    name: "Protect",
    text: "Rule 6's safeguards: encryption, access control, logs and backups (module 10).",
  },
  {
    id: "rights",
    name: "Rights",
    text: "access, correction, erasure, grievances and nomination (modules 13–14).",
  },
  {
    id: "erase",
    name: "Erase",
    text: "when consent is withdrawn or the purpose is served, everywhere, vendors included (modules 9, 20).",
  },
  {
    id: "breach",
    name: "If it goes wrong",
    text: "tell the Board and every affected person; CERT-In within six hours (module 12).",
  },
  {
    id: "board",
    name: "The Data Protection Board",
    text: "hears complaints and breaches and can impose penalties up to ₹250 crore (module 19).",
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
  ["notice", "notice", 22],
  ["consent", "consent", 82],
  ["use", "use", 142],
  ["protect", "protect", 202],
  ["rights", "rights", 262],
  ["erase", "erase", 322],
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
      <motion.g animate={f("board")} {...hit("board")}>
        <Box x={140} y={22} w={100} label="Data Protection Board" on={active === "board"} />
      </motion.g>
      <line
        x1={190}
        y1={46}
        x2={190}
        y2={86}
        className="stroke-line-strong"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <motion.g animate={f("breach")} {...hit("breach")}>
        <rect
          x={150}
          y={150}
          width={80}
          height={22}
          rx={4}
          className={
            active === "breach" ? "fill-bad/15 stroke-bad" : "fill-surface stroke-line-strong"
          }
          strokeWidth={active === "breach" ? 1.6 : 1}
        />
        <text
          x={190}
          y={164}
          textAnchor="middle"
          className={cn("font-mono text-[7px]", active === "breach" ? "fill-bad" : "fill-fg")}
        >
          breach notice
        </text>
      </motion.g>
      <line
        x1={227}
        y1={114}
        x2={205}
        y2={148}
        className="stroke-line-strong"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={10} y={196} className="fill-muted font-mono text-[7px]">
        one person&apos;s data, from notice to erasure (core duties from May 2027)
      </text>
    </svg>
  );
}

/** DPDP Act showcase: the life of a person's data, toured part by part; click any part. */
export function DpdpActScene() {
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
