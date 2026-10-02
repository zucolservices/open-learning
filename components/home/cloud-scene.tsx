"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: follow a request in, then the protections around it. */
const PARTS: Part[] = [
  { id: "dns", name: "DNS", text: "sends each user to the nearest healthy region (module 8)." },
  {
    id: "lb",
    name: "Load balancer",
    text: "spreads requests across servers and adds more when traffic rises (module 4).",
  },
  {
    id: "zones",
    name: "Two availability zones",
    text: "lose a whole data-centre zone and the app keeps serving (module 2).",
  },
  {
    id: "vpc",
    name: "Private network",
    text: "the load balancer faces the internet; servers and data stay in private subnets (module 5).",
  },
  {
    id: "db",
    name: "Managed database",
    text: "with a standby in the other zone; the cloud patches and backs it up (module 16).",
  },
  {
    id: "role",
    name: "Roles, not keys",
    text: "servers get short-lived credentials, so there is no key to leak (modules 9–10).",
  },
  {
    id: "kms",
    name: "Key management",
    text: "data is encrypted with keys that never leave the key service (module 11).",
  },
  {
    id: "storage",
    name: "Backups",
    text: "in object storage, reached privately through an endpoint, never the internet (modules 6, 16).",
  },
  {
    id: "logs",
    name: "Log archive",
    text: "every action recorded where workload admins can't delete it (module 14).",
  },
  {
    id: "dr",
    name: "Recovery region",
    text: "a pilot light in Hyderabad for the day the whole Mumbai region fails (module 17).",
  },
  {
    id: "org",
    name: "Guardrails",
    text: "set once on the organisation: India regions only, no public storage, tags required (module 12).",
  },
];

const T = "fill-muted font-mono text-[8px]";

/** Faded unless this part (or the whole picture, when nothing is chosen) is in focus. */
function focusFor(active: string) {
  return (ids: string[]) => ({
    opacity: ids.includes(active) ? 1 : 0.35,
    transition: { duration: 0.35 },
  });
}

function Box({
  x,
  y,
  w,
  h,
  label,
  on,
  cls = "fill-surface stroke-line-strong",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  on: boolean;
  cls?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className={on ? "fill-accent/15 stroke-accent" : cls}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        className={cn("font-mono text-[8px]", on ? "fill-accent" : "fill-fg")}
      >
        {label}
      </text>
    </g>
  );
}

function Diagram({ active, onSelect }: { active: string; onSelect(id: string): void }) {
  const f = focusFor(active);
  const hit = (id: string) => ({
    onClick: () => onSelect(id),
    style: { cursor: "pointer" } as const,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
  });
  return (
    <svg
      viewBox="0 0 380 224"
      className="w-full"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Organisation and guardrails */}
      <motion.g animate={f(["org"])} {...hit("org")}>
        <rect
          x={3}
          y={3}
          width={374}
          height={218}
          rx={10}
          className={active === "org" ? "stroke-accent" : "stroke-line-strong"}
          strokeDasharray="5 4"
          strokeWidth={active === "org" ? 1.8 : 1}
        />
        <text
          x={12}
          y={15}
          className={cn("font-mono text-[8px]", active === "org" ? "fill-accent" : "fill-muted")}
        >
          organisation · guardrails
        </text>
      </motion.g>

      {/* User and DNS */}
      <motion.g animate={f(["dns"])} {...hit("dns")}>
        <circle cx={28} cy={128} r={7} className="fill-surface-2 stroke-line-strong" />
        <path d="M17 148a11 9 0 0 1 22 0" className="stroke-line-strong" strokeWidth={1.2} />
        <Box x={10} y={66} w={36} h={18} label="DNS" on={active === "dns"} />
        <path d="M28 118V86" className="stroke-line-strong" strokeDasharray="2 2" />
      </motion.g>

      {/* Region */}
      <rect
        x={60}
        y={24}
        width={206}
        height={188}
        rx={8}
        className="fill-surface-2/40 stroke-line-strong"
      />
      <text x={68} y={36} className={T}>
        Mumbai region
      </text>

      {/* VPC and subnets */}
      <motion.g animate={f(["vpc", "lb", "zones", "db"])} {...hit("vpc")}>
        <rect
          x={70}
          y={42}
          width={186}
          height={162}
          rx={6}
          className={active === "vpc" ? "stroke-accent" : "stroke-viz-meta/60"}
          strokeWidth={active === "vpc" ? 1.6 : 1}
        />
        <text x={250} y={53} textAnchor="end" className={T}>
          VPC 10.20.0.0/16
        </text>
        <line
          x1={74}
          y1={138}
          x2={252}
          y2={138}
          className="stroke-line-strong"
          strokeDasharray="3 3"
        />
        <text x={250} y={134} textAnchor="end" className={T}>
          private
        </text>
      </motion.g>

      {/* Request path */}
      <motion.path
        d="M46 75H90M90 75V66H124"
        className="stroke-accent"
        strokeWidth={1.4}
        strokeDasharray="3 3"
        animate={{ strokeDashoffset: [12, 0] }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      <motion.g animate={f(["lb"])} {...hit("lb")}>
        <Box x={124} y={57} w={80} h={18} label="load balancer" on={active === "lb"} />
        <path d="M150 75l-34 21M178 75l34 21" className="stroke-line-strong" />
      </motion.g>

      {/* Zones with servers and database */}
      {[0, 1].map((z) => {
        const x = 80 + z * 88;
        return (
          <g key={z}>
            <motion.g animate={f(["zones"])} {...hit("zones")}>
              <rect
                x={x}
                y={84}
                width={78}
                height={114}
                rx={5}
                className={active === "zones" ? "stroke-accent" : "stroke-line-strong"}
                strokeDasharray="4 3"
                strokeWidth={active === "zones" ? 1.6 : 1}
              />
              <text x={x + 4} y={94} className={T}>
                zone {z === 0 ? "A" : "B"}
              </text>
              {[0, 1].map((i) => (
                <rect
                  key={i}
                  x={x + 10 + i * 30}
                  y={100}
                  width={26}
                  height={22}
                  rx={3}
                  className="fill-viz-compute/15 stroke-viz-compute"
                />
              ))}
            </motion.g>
            <motion.g animate={f(["db"])} {...hit("db")}>
              <ellipse
                cx={x + 39}
                cy={152}
                rx={18}
                ry={5}
                className={
                  active === "db"
                    ? "fill-accent/15 stroke-accent"
                    : "fill-viz-data/15 stroke-viz-data"
                }
              />
              <path
                d={`M${x + 21} 152v22a18 5 0 0 0 36 0v-22`}
                className={active === "db" ? "stroke-accent" : "stroke-viz-data"}
              />
              <text x={x + 39} y={192} textAnchor="middle" className={T}>
                {z === 0 ? "primary" : "standby"}
              </text>
            </motion.g>
          </g>
        );
      })}
      <motion.path
        d="M137 166h50"
        className="stroke-viz-data"
        strokeDasharray="2 3"
        animate={f(["db"])}
      />

      {/* Right column: identity, keys, storage, logs */}
      <motion.g animate={f(["role"])} {...hit("role")}>
        <Box x={278} y={30} w={90} h={20} label="role · 1-h token" on={active === "role"} />
        <path d="M262 96h8V40h8" className="stroke-line-strong" strokeDasharray="2 2" />
      </motion.g>
      <motion.g animate={f(["kms"])} {...hit("kms")}>
        <Box x={278} y={62} w={90} h={20} label="key service (KMS)" on={active === "kms"} />
      </motion.g>
      <motion.g animate={f(["storage"])} {...hit("storage")}>
        <Box
          x={278}
          y={94}
          w={90}
          h={20}
          label="backups · storage"
          on={active === "storage"}
          cls="fill-viz-data/10 stroke-viz-data"
        />
        <circle cx={256} cy={104} r={3} className="fill-viz-add" />
        <path d="M259 104h19" className="stroke-viz-add" />
      </motion.g>
      <motion.g animate={f(["logs"])} {...hit("logs")}>
        <Box
          x={278}
          y={126}
          w={90}
          h={20}
          label="log archive"
          on={active === "logs"}
          cls="fill-viz-meta/10 stroke-viz-meta"
        />
      </motion.g>
      <motion.g animate={f(["dr"])} {...hit("dr")}>
        <rect
          x={278}
          y={160}
          width={90}
          height={50}
          rx={6}
          className={
            active === "dr"
              ? "fill-accent/10 stroke-accent"
              : "fill-surface-2/40 stroke-line-strong"
          }
          strokeDasharray="4 3"
        />
        <text x={323} y={174} textAnchor="middle" className={T}>
          Hyderabad
        </text>
        <rect
          x={296}
          y={182}
          width={18}
          height={14}
          rx={2}
          className="fill-viz-idle/30 stroke-viz-idle"
        />
        <ellipse cx={340} cy={184} rx={10} ry={3} className="fill-viz-data/15 stroke-viz-data" />
        <path d="M330 184v8a10 3 0 0 0 20 0v-8" className="stroke-viz-data" />
        <motion.path
          d="M248 176q14 0 30 4"
          className="stroke-viz-data"
          strokeDasharray="3 3"
          animate={{ strokeDashoffset: [12, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        />
      </motion.g>
    </svg>
  );
}

/** Cloud Architecture showcase: one well-built cloud foundation, toured part by part; click any part. */
export function CloudScene() {
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
