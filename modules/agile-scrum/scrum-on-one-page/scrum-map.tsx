"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Scrum on one page: the Scrum Team above; the Product Backlog feeding Sprint Planning, the
 * Sprint Backlog and the Sprint (with its Daily Scrum), producing an Increment, then the Review and
 * Retrospective feeding back. Every part is a button. Shared with the track's showcase.
 */

function Hit({
  id,
  active,
  onSelect,
  label,
  children,
}: {
  id: string;
  active: string | null;
  onSelect?: (id: string) => void;
  label: string;
  children: ReactNode;
}) {
  const on = active === id;
  return (
    <g
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={label}
      aria-pressed={onSelect ? on : undefined}
      onClick={() => onSelect?.(id)}
      onKeyDown={(e) => {
        if (onSelect && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(id);
        }
      }}
      className={cn(onSelect && "cursor-pointer outline-none", "group/hit")}
    >
      <motion.g animate={{ opacity: active && !on ? 0.45 : 1 }}>{children}</motion.g>
    </g>
  );
}

function Person({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <g className={on ? "fill-accent" : "fill-fg/55"}>
      <circle cx={x} cy={y - 5} r={3.4} />
      <path d={`M${x - 5.5} ${y + 6}a5.5 5.5 0 0 1 11 0z`} />
    </g>
  );
}

function Stack({ x, y, on, n = 4 }: { x: number; y: number; on: boolean; n?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * 9}
          width={40}
          height={7}
          rx={2}
          className={on ? "fill-accent/30 stroke-accent" : "fill-viz-data/20 stroke-viz-data"}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

function Node({
  x,
  y,
  r = 13,
  on,
  label,
  sub,
}: {
  x: number;
  y: number;
  r?: number;
  on: boolean;
  label: string;
  sub?: string;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        className={on ? "fill-accent/25 stroke-accent" : "fill-viz-meta/15 stroke-viz-meta"}
        strokeWidth={1.4}
      />
      <text x={x} y={y + r + 10} textAnchor="middle" className="fill-fg text-[7.5px] font-medium">
        {label}
      </text>
      {sub && (
        <text x={x} y={y + r + 19} textAnchor="middle" className="fill-muted text-[6.5px]">
          {sub}
        </text>
      )}
    </g>
  );
}

export function ScrumMap({
  active,
  onSelect,
}: {
  active: string | null;
  onSelect?: (id: string) => void;
}) {
  const a = (id: string) => active === id;
  return (
    <svg viewBox="0 0 360 250" className="w-full" role="group" aria-label="The Scrum framework">
      {/* flow arrows */}
      <g className="stroke-line-strong" fill="none" strokeWidth={1.2}>
        <path d="M62 132 H86" markerEnd="url(#sm-arrow)" />
        <path d="M114 132 H128" markerEnd="url(#sm-arrow)" />
        <path d="M172 132 H190" markerEnd="url(#sm-arrow)" />
        <path d="M290 132 H302" markerEnd="url(#sm-arrow)" />
        <path d="M322 152 V180" markerEnd="url(#sm-arrow)" />
        <path d="M306 202 H272" markerEnd="url(#sm-arrow)" />
        <path
          d="M232 214 C 150 244, 60 236, 42 172"
          markerEnd="url(#sm-arrow)"
          strokeDasharray="3 3"
        />
      </g>
      <defs>
        <marker
          id="sm-arrow"
          viewBox="0 0 6 6"
          refX="5"
          refY="3"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6z" className="fill-line-strong" />
        </marker>
      </defs>

      {/* Scrum Team */}
      <rect
        x={70}
        y={6}
        width={220}
        height={52}
        rx={10}
        className="fill-surface-2/60 stroke-line"
      />
      <text x={180} y={17} textAnchor="middle" className="fill-muted text-[7px]">
        Scrum Team · typically 10 or fewer
      </text>
      <Hit id="po" active={active} onSelect={onSelect} label="Product Owner">
        <rect x={80} y={22} width={56} height={30} rx={6} className="fill-transparent" />
        <Person x={108} y={33} on={a("po")} />
        <text x={108} y={50} textAnchor="middle" className="fill-fg text-[7px]">
          Product Owner
        </text>
      </Hit>
      <Hit id="sm" active={active} onSelect={onSelect} label="Scrum Master">
        <rect x={152} y={22} width={56} height={30} rx={6} className="fill-transparent" />
        <Person x={180} y={33} on={a("sm")} />
        <text x={180} y={50} textAnchor="middle" className="fill-fg text-[7px]">
          Scrum Master
        </text>
      </Hit>
      <Hit id="dev" active={active} onSelect={onSelect} label="Developers">
        <rect x={222} y={22} width={60} height={30} rx={6} className="fill-transparent" />
        <Person x={242} y={33} on={a("dev")} />
        <Person x={254} y={33} on={a("dev")} />
        <Person x={266} y={33} on={a("dev")} />
        <text x={254} y={50} textAnchor="middle" className="fill-fg text-[7px]">
          Developers
        </text>
      </Hit>

      {/* Product Backlog */}
      <Hit id="pb" active={active} onSelect={onSelect} label="Product Backlog">
        <Stack x={20} y={108} on={a("pb")} n={5} />
        <text x={40} y={100} textAnchor="middle" className="fill-fg text-[7.5px] font-medium">
          Product Backlog
        </text>
        <text x={40} y={165} textAnchor="middle" className="fill-muted text-[6.5px]">
          → Product Goal
        </text>
      </Hit>

      <Hit id="planning" active={active} onSelect={onSelect} label="Sprint Planning">
        <Node x={100} y={132} on={a("planning")} label="Planning" />
      </Hit>

      {/* Sprint Backlog */}
      <Hit id="sb" active={active} onSelect={onSelect} label="Sprint Backlog">
        <Stack x={130} y={117} on={a("sb")} n={3} />
        <text x={150} y={108} textAnchor="middle" className="fill-fg text-[7.5px] font-medium">
          Sprint Backlog
        </text>
        <text x={150} y={155} textAnchor="middle" className="fill-muted text-[6.5px]">
          → Sprint Goal
        </text>
      </Hit>

      {/* Sprint loop with Daily Scrum */}
      <Hit id="sprint" active={active} onSelect={onSelect} label="Sprint">
        <circle
          cx={240}
          cy={132}
          r={44}
          fill="none"
          className={a("sprint") ? "stroke-accent" : "stroke-viz-meta"}
          strokeWidth={a("sprint") ? 3 : 2}
        />
        <path
          d="M284 132 l-4 -6 m4 6 l5 -5"
          fill="none"
          className={a("sprint") ? "stroke-accent" : "stroke-viz-meta"}
          strokeWidth={2}
        />
        <text x={240} y={143} textAnchor="middle" className="fill-fg text-[8px] font-semibold">
          Sprint
        </text>
        <text x={240} y={153} textAnchor="middle" className="fill-muted text-[6.5px]">
          one month or less
        </text>
      </Hit>
      <Hit id="daily" active={active} onSelect={onSelect} label="Daily Scrum">
        <circle
          cx={240}
          cy={104}
          r={11}
          className={a("daily") ? "fill-accent/25 stroke-accent" : "fill-surface stroke-viz-meta"}
          strokeWidth={1.4}
        />
        <text x={240} y={107} textAnchor="middle" className="fill-fg text-[6.5px]">
          15 min
        </text>
        <text x={240} y={125} textAnchor="middle" className="fill-muted text-[6.5px]">
          Daily Scrum
        </text>
      </Hit>

      {/* Increment */}
      <Hit id="inc" active={active} onSelect={onSelect} label="Increment">
        <rect
          x={304}
          y={116}
          width={36}
          height={32}
          rx={6}
          className={a("inc") ? "fill-accent/25 stroke-accent" : "fill-good/15 stroke-good"}
          strokeWidth={1.4}
        />
        <path
          d="M314 132l5 5 11-12"
          fill="none"
          className={a("inc") ? "stroke-accent" : "stroke-good"}
          strokeWidth={2}
        />
        <text x={322} y={108} textAnchor="middle" className="fill-fg text-[7.5px] font-medium">
          Increment
        </text>
        <text x={322} y={158} textAnchor="middle" className="fill-muted text-[6.5px]">
          → Done
        </text>
      </Hit>

      <Hit id="review" active={active} onSelect={onSelect} label="Sprint Review">
        <Node x={322} y={202} r={12} on={a("review")} label="Review" />
      </Hit>
      <Hit id="retro" active={active} onSelect={onSelect} label="Sprint Retrospective">
        <Node x={258} y={202} r={12} on={a("retro")} label="Retrospective" />
      </Hit>
      <text x={120} y={236} textAnchor="middle" className="fill-muted text-[6.5px]">
        next Sprint starts straight away
      </text>
    </svg>
  );
}
