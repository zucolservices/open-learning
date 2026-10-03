"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: one request's life, then what keeps the API healthy over time. */
const PARTS: Part[] = [
  {
    id: "client",
    name: "A partner's app",
    text: "calls the API over HTTP: a method, a path, headers and a body (modules 1–3).",
  },
  {
    id: "gateway",
    name: "The gateway",
    text: "checks the key or token, applies rate limits and routes the request (modules 16, 18, 20).",
  },
  {
    id: "resource",
    name: "Resources",
    text: "clear nouns like /parcels/{id}, with an ownership check on every request (modules 4, 17).",
  },
  {
    id: "response",
    name: "The response",
    text: "a true status code, careful JSON, pages with cursors, cache headers (modules 5–7, 19).",
  },
  {
    id: "retry",
    name: "Safe retries",
    text: "an idempotency key turns a retried POST into a replay, not a second pickup (module 8).",
  },
  {
    id: "hooks",
    name: "Webhooks and streams",
    text: "the API calls partners when parcels move, signed and retried (modules 14, 15).",
  },
  {
    id: "contract",
    name: "The contract",
    text: "an OpenAPI file, versioned, with deprecation and sunset dates when things must change (modules 9–11).",
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
        className={cn("font-mono text-[7.5px]", on ? "fill-accent" : "fill-fg")}
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
  const flow = (d: string, ids: string[], key: string) => (
    <motion.path
      key={key}
      d={d}
      className="stroke-accent"
      strokeWidth={1.3}
      strokeDasharray="3 4"
      animate={{ strokeDashoffset: [14, 0], opacity: ids.includes(active) ? 1 : 0.35 }}
      transition={{ strokeDashoffset: { repeat: Infinity, duration: 1.1, ease: "linear" } }}
    />
  );
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <motion.g animate={f(["client", "retry"])} {...hit("client")}>
        <Box x={8} y={70} w={60} h={26} label="partner app" on={active === "client"} />
      </motion.g>
      {flow("M68 83H104", ["client", "gateway", "retry"], "a")}
      <motion.g animate={f(["gateway"])} {...hit("gateway")}>
        <Box x={106} y={64} w={62} h={38} label="gateway" on={active === "gateway"} />
        <text x={110} y={112} className="fill-muted font-mono text-[6.5px]">
          key · limit · route
        </text>
      </motion.g>
      {flow("M168 83H204", ["gateway", "resource"], "b")}
      <motion.g animate={f(["resource"])} {...hit("resource")}>
        <Box x={206} y={70} w={90} h={26} label="/parcels/{id}" on={active === "resource"} />
      </motion.g>
      <motion.g animate={f(["response"])} {...hit("response")}>
        <path d="M250 70V40H38V66" className="stroke-viz-add" strokeWidth={1.3} />
        <rect
          x={110}
          y={30}
          width={70}
          height={18}
          rx={4}
          className={
            active === "response"
              ? "fill-viz-add/20 stroke-viz-add"
              : "fill-surface stroke-line-strong"
          }
        />
        <text x={145} y={42} textAnchor="middle" className="fill-fg font-mono text-[7px]">
          200 · cursor
        </text>
      </motion.g>
      <motion.g animate={f(["retry"])} {...hit("retry")}>
        <text x={8} y={116} className="fill-muted font-mono text-[6.5px]">
          Idempotency-Key: 9f1c…
        </text>
      </motion.g>
      <motion.g animate={f(["hooks"])} {...hit("hooks")}>
        <path
          d="M296 90c30 0 40 50-10 60H40V100"
          className="stroke-viz-meta"
          strokeWidth={1.3}
          strokeDasharray="4 3"
        />
        <text x={190} y={146} className="fill-viz-meta font-mono text-[7px]">
          webhook: parcel.delivered
        </text>
      </motion.g>
      <motion.g animate={f(["contract"])} {...hit("contract")}>
        <path
          d="M316 20h22l8 8v30h-30z"
          className={
            active === "contract"
              ? "fill-accent/20 stroke-accent"
              : "fill-surface stroke-line-strong"
          }
          strokeWidth={1.2}
        />
        <text x={310} y={72} className="fill-muted font-mono text-[6.5px]">
          openapi · v2
        </text>
      </motion.g>
      <text x={8} y={190} className="fill-muted font-mono text-[7px]">
        one request&apos;s life, and the promises around it
      </text>
    </svg>
  );
}

/** API Design showcase: a parcel API request, toured part by part; click any part. */
export function ApiDesignScene() {
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
