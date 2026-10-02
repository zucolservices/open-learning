import type { CSSProperties } from "react";
import { A, FileIcon, Slab, type ArtMap } from "./kit";

/** Card illustrations for the Cloud Architecture track (modules 12 to 22), keyed by module slug. */

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Arrowhead with its tip at (x, y), pointing along `angle` (radians). */
function Head({ x, y, angle, cls }: { x: number; y: number; angle: number; cls: string }) {
  const p = (s: number) => `${r2(x - 4 * Math.cos(angle + s))} ${r2(y - 4 * Math.sin(angle + s))}`;
  return <path d={`M${p(0.55)}L${x} ${y}L${p(-0.55)}`} className={cls} strokeWidth={1.6} />;
}

/** Straight arrow from (x1, y1) to (x2, y2). */
function Arrow({
  x1,
  y1,
  x2,
  y2,
  cls = "stroke-accent",
  w = 1.6,
  dash,
  className = "",
  style,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cls?: string;
  w?: number;
  dash?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <g className={className} style={style}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={cls}
        strokeWidth={w}
        strokeDasharray={dash}
      />
      <Head x={x2} y={y2} angle={Math.atan2(y2 - y1, x2 - x1)} cls={cls} />
    </g>
  );
}

/** A tick (✓) or cross (✗) mark centred at (x, y). */
function Mark({
  x,
  y,
  ok,
  s = 3,
  className = "",
  style,
}: {
  x: number;
  y: number;
  ok: boolean;
  s?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return ok ? (
    <path
      d={`M${r2(x - s)} ${y}l${r2(s * 0.7)} ${r2(s * 0.8)} ${r2(s * 1.4)} -${r2(s * 1.6)}`}
      className={`stroke-viz-add ${className}`}
      strokeWidth={1.5}
      style={style}
    />
  ) : (
    <path
      d={`M${r2(x - s * 0.8)} ${r2(y - s * 0.8)}l${r2(s * 1.6)} ${r2(s * 1.6)}M${r2(x + s * 0.8)} ${r2(y - s * 0.8)}l-${r2(s * 1.6)} ${r2(s * 1.6)}`}
      className={`stroke-viz-remove ${className}`}
      strokeWidth={1.5}
      style={style}
    />
  );
}

/** A magnifying glass: lens centred at (x, y) with radius r. */
function Lens({
  x,
  y,
  r,
  className = "",
}: {
  x: number;
  y: number;
  r: number;
  className?: string;
}) {
  return (
    <g className={className}>
      <circle cx={x} cy={y} r={r} className="fill-accent/10 stroke-accent" strokeWidth={1.8} />
      <path
        d={`M${r2(x + r * 0.7)} ${r2(y + r * 0.7)}l${r2(r * 0.7)} ${r2(r * 0.7)}`}
        className="stroke-accent"
        strokeWidth={3}
      />
    </g>
  );
}

/** A small server: a box with two slots and a status light. */
function Server({
  x,
  y,
  cls = "fill-viz-compute/20 stroke-viz-compute",
  light = "fill-viz-add",
}: {
  x: number;
  y: number;
  cls?: string;
  light?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={14} height={18} rx={2} className={cls} strokeWidth={1.2} />
      <path d={`M${x + 3} ${y + 5}h6M${x + 3} ${y + 9}h6`} className="stroke-line-strong" />
      <circle cx={x + 7} cy={y + 14} r={1.4} className={light} />
    </g>
  );
}

/** Receipt outline with a zig-zag bottom edge. */
const RECEIPT = `M84 12H144V80${Array.from({ length: 12 }, (_, i) => `l-5 ${i % 2 === 0 ? 4 : -4}`).join("")}Z`;

const T = "fill-muted font-mono text-[7px]";

export const cloudArchitectureArtB: ArtMap = {
  guardrails: () => (
    <>
      {/* The organisation: everything behind the rule. */}
      <rect
        x="96"
        y="20"
        width="52"
        height="60"
        rx="4"
        className="fill-surface-2/60 stroke-line-strong"
        strokeDasharray="3 2"
      />
      <Server x={104} y={50} />
      <Server x={124} y={50} />
      <g className={`${A} group-hover:-rotate-12`}>
        <rect
          x="118"
          y="28"
          width="16"
          height="10"
          rx="2"
          className="fill-viz-meta/20 stroke-viz-meta"
        />
        <path d="M134 31l6-3v10l-6-3z" className="fill-viz-meta/20 stroke-viz-meta" />
        <circle cx="126" cy="33" r="2" className="fill-viz-meta" />
      </g>
      {/* A request: make a bucket public. */}
      <g className={`${A} group-hover:translate-x-1`}>
        <rect
          x="14"
          y="40"
          width="34"
          height="20"
          rx="3"
          className="fill-viz-data/15 stroke-viz-data"
        />
        <path d="M24 45h14l-2 10h-10z" className="fill-viz-data/30 stroke-viz-data" />
        <Arrow x1={50} y1={50} x2={68} y2={50} cls="stroke-viz-remove" w={1.4} dash="3 2" />
      </g>
      <Mark x={62} y={36} ok={false} className={`${A} group-hover:scale-125`} />
      {/* The organisation-wide rule: a wall with a lock. */}
      <rect x="76" y="16" width="8" height="68" rx="2" className="fill-accent/15 stroke-accent" />
      <path d="M75.5 47v-4a4.5 4.5 0 0 1 9 0v4" className="stroke-accent" strokeWidth={1.6} />
      <rect
        x="73"
        y="47"
        width="14"
        height="11"
        rx="2"
        className="fill-surface stroke-accent"
        strokeWidth={1.4}
      />
      <circle cx="80" cy="52.5" r="1.6" className="fill-accent" />
      <text x="31" y="72" textAnchor="middle" className={T}>
        request
      </text>
      <text x="80" y="94" textAnchor="middle" className={T}>
        org rule
      </text>
    </>
  ),

  "resource-hierarchy": () => (
    <>
      <path d="M80 22v6M44 36v-8h72v8M80 28v8" className="stroke-line-strong" strokeWidth={1.2} />
      {[44, 80, 116].map((c) => (
        <path
          key={c}
          d={`M${c} 51v6M${c - 7} 64v-7h14v7`}
          className="stroke-line-strong"
          strokeWidth={1.2}
        />
      ))}
      <rect x="62" y="8" width="36" height="14" rx="3" className="fill-accent/15 stroke-accent" />
      <text x="80" y="17.5" textAnchor="middle" className="fill-fg font-mono text-[7px]">
        org
      </text>
      {[44, 80, 116].map((c) => (
        <path
          key={c}
          d={`M${c - 12} 36h8l2 3h14v12h-24z`}
          className="fill-viz-meta/20 stroke-viz-meta"
          strokeWidth={1.2}
        />
      ))}
      {[37, 51, 73, 87, 109, 123].map((c, i) => (
        <g
          key={c}
          className={`${A} group-hover:translate-y-0.5`}
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <rect
            x={c - 6}
            y={64}
            width={12}
            height={14}
            rx={2}
            className="fill-surface-2 stroke-line-strong"
          />
          <circle cx={c} cy={71} r={2} className="fill-viz-compute/60" />
        </g>
      ))}
      <Arrow x1={14} y1={16} x2={14} y2={78} className={`${A} group-hover:translate-y-1`} />
      <Arrow
        x1={146}
        y1={78}
        x2={146}
        y2={16}
        cls="stroke-line-strong"
        className={`${A} group-hover:-translate-y-1`}
      />
      <text x="14" y="92" textAnchor="middle" className="fill-accent font-mono text-[7px]">
        rules
      </text>
      <text x="146" y="92" textAnchor="middle" className={T}>
        bills
      </text>
    </>
  ),

  "landing-zones": () => (
    <>
      <rect
        x="12"
        y="12"
        width="136"
        height="76"
        rx="6"
        className="fill-surface-2/60 stroke-line-strong"
      />
      {/* Roads first. */}
      <rect x="12" y="46" width="136" height="8" className="fill-line-strong/30" />
      <rect x="76" y="12" width="8" height="76" className="fill-line-strong/30" />
      <path
        d="M16 50h56M88 50h56M80 16v26M80 58v26"
        className="stroke-surface"
        strokeDasharray="3 3"
      />
      {/* Log archive. */}
      {[20, 26, 32].map((y) => (
        <rect key={y} x="30" y={y} width="28" height="3" rx="1.5" className="fill-viz-meta/50" />
      ))}
      <text x="44" y="43" textAnchor="middle" className={T}>
        logs
      </text>
      {/* Security tooling. */}
      <path
        d="M116 17l11 4v7q0 9-11 13q-11-4-11-13v-7z"
        className="fill-accent/15 stroke-accent"
        strokeWidth={1.4}
      />
      <Mark x={116} y={29} ok />
      {/* Network hub. */}
      <path d="M44 69L30 62M44 69L58 62M44 69L30 76M44 69L58 76" className="stroke-line-strong" />
      {[
        [30, 62],
        [58, 62],
        [30, 76],
        [58, 76],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2} className="fill-fg" />
      ))}
      <circle
        cx="44"
        cy="69"
        r="5"
        className={`fill-surface stroke-fg ${A} group-hover:scale-125`}
        strokeWidth={1.4}
      />
      <text x="44" y="86" textAnchor="middle" className={T}>
        hub
      </text>
      {/* Account plots: two vended, one arriving. */}
      {[90, 110].map((x) => (
        <rect
          key={x}
          x={x}
          y="60"
          width="14"
          height="14"
          rx="2"
          className="fill-viz-add/20 stroke-viz-add"
        />
      ))}
      <rect
        x="130"
        y="60"
        width="14"
        height="14"
        rx="2"
        className="stroke-viz-idle"
        strokeDasharray="2 2"
      />
      <rect
        x="131"
        y="51"
        width="12"
        height="12"
        rx="2"
        className={`fill-viz-add/30 stroke-viz-add ${A} group-hover:translate-y-2.5`}
      />
      <text x="117" y="85" textAnchor="middle" className={T}>
        accounts
      </text>
    </>
  ),

  "infrastructure-as-code": () => (
    <>
      <rect
        x="12"
        y="14"
        width="60"
        height="72"
        rx="3"
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      {[
        ["+", "fill-viz-add", 30],
        ["~", "fill-viz-meta", 26],
        ["-/+", "fill-viz-compute", 22],
        ["-", "fill-viz-remove", 28],
      ].map(([sym, fg, w], i) => (
        <g key={sym as string}>
          <text x="17" y={30 + i * 15} className={`${fg as string} font-mono text-[7px] font-bold`}>
            {sym as string}
          </text>
          <rect
            x="34"
            y={26 + i * 15}
            width={w as number}
            height="2"
            rx="1"
            className="fill-line-strong"
          />
        </g>
      ))}
      <text x="42" y="96" textAnchor="middle" className={T}>
        plan
      </text>
      <Arrow x1={78} y1={50} x2={94} y2={50} className={`${A} group-hover:translate-x-1`} />
      {/* What the plan does to real resources. */}
      <rect
        x="102"
        y="22"
        width="22"
        height="22"
        rx="3"
        className={`fill-viz-add/20 stroke-viz-add ${A} group-hover:scale-110`}
        strokeWidth={1.4}
      />
      <rect
        x="128"
        y="22"
        width="22"
        height="22"
        rx="3"
        className="fill-viz-meta/15 stroke-viz-meta"
        strokeWidth={1.4}
      />
      <circle
        cx="139"
        cy="33"
        r="4"
        className={`stroke-viz-meta ${A} group-hover:rotate-90`}
        strokeWidth={1.4}
        strokeDasharray="3 2"
      />
      <rect
        x="102"
        y="56"
        width="22"
        height="22"
        rx="3"
        className="fill-viz-compute/15 stroke-viz-compute"
        strokeWidth={1.4}
      />
      <path
        d="M108 67a5 5 0 1 0 5-5l-2-2m2 2l-2 2"
        className={`stroke-viz-compute ${A} group-hover:-rotate-45`}
        strokeWidth={1.3}
      />
      <rect
        x="128"
        y="56"
        width="22"
        height="22"
        rx="3"
        className={`fill-viz-remove/10 stroke-viz-remove ${A} group-hover:opacity-30`}
        strokeDasharray="3 2"
        strokeWidth={1.4}
      />
    </>
  ),

  "storage-databases": () => (
    <>
      {/* Object: a warehouse of loose things. */}
      <path
        d="M16 30L32 18L48 30V48H16Z"
        className="fill-viz-data/10 stroke-viz-data"
        strokeWidth={1.3}
      />
      {[
        [26, 41],
        [33, 43],
        [39, 38],
        [29, 35],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5} className="fill-viz-data/50" />
      ))}
      {/* Block: a chest of drawers. */}
      <rect
        x="66"
        y="18"
        width="28"
        height="30"
        rx="2"
        className="fill-viz-data/10 stroke-viz-data"
        strokeWidth={1.3}
      />
      {[0, 1, 2].map((i) => (
        <g key={i} className={i === 1 ? `${A} group-hover:translate-x-1.5` : ""}>
          <rect
            x="69"
            y={21 + i * 9}
            width="22"
            height="7"
            rx="1"
            className="fill-surface stroke-viz-data"
          />
          <path d={`M78 ${24.5 + i * 9}h4`} className="stroke-viz-data" strokeWidth={1.4} />
        </g>
      ))}
      {/* File: a cupboard with shared folders. */}
      <rect
        x="114"
        y="18"
        width="28"
        height="30"
        rx="2"
        className="fill-viz-data/10 stroke-viz-data"
        strokeWidth={1.3}
      />
      <path d="M128 18v30" className="stroke-viz-data" />
      <circle cx="125" cy="34" r="1.2" className="fill-viz-data" />
      <circle cx="131" cy="34" r="1.2" className="fill-viz-data" />
      {/* Tiers cooling down. */}
      {[
        [16, "fill-viz-data/40 stroke-viz-data"],
        [60, "fill-viz-data/15 stroke-viz-data"],
        [104, "fill-viz-idle/20 stroke-viz-idle"],
      ].map(([x, c]) => (
        <rect
          key={x as number}
          x={x as number}
          y="62"
          width="40"
          height="18"
          rx="3"
          className={c as string}
        />
      ))}
      <FileIcon
        x={30}
        y={64}
        w={11}
        h={14}
        cls="fill-surface stroke-viz-data"
        className={`${A} group-hover:translate-x-11`}
      />
      <text x="36" y="92" textAnchor="middle" className={T}>
        hot
      </text>
      <text x="124" y="92" textAnchor="middle" className={T}>
        cold
      </text>
    </>
  ),

  "ha-dr": () => (
    <>
      {/* Primary region fails. */}
      <rect
        x="14"
        y="12"
        width="54"
        height="38"
        rx="4"
        className="fill-viz-remove/10 stroke-viz-remove"
        strokeDasharray="3 2"
      />
      <Server x={21} y={22} cls="fill-viz-idle/20 stroke-viz-idle" light="fill-viz-remove" />
      <Server x={47} y={22} cls="fill-viz-idle/20 stroke-viz-idle" light="fill-viz-remove" />
      <Mark x={41} y={31} ok={false} s={5} className={`${A} group-hover:rotate-90`} />
      {/* A copy of the data keeps the second region ready. */}
      <Arrow x1={70} y1={31} x2={88} y2={31} cls="stroke-viz-data" w={1.4} dash="3 2" />
      <g className={`${A} group-hover:-translate-y-1`}>
        <rect
          x="92"
          y="12"
          width="54"
          height="38"
          rx="4"
          className="fill-viz-add/10 stroke-viz-add"
        />
        <Server x={99} y={22} />
        <Server x={125} y={22} />
      </g>
      {/* Timeline around the disaster. */}
      <path d="M14 74H146" className="stroke-line-strong" strokeWidth={1.2} />
      <path d="M54 66v-3h26v3" className="stroke-viz-data" strokeWidth={1.2} />
      <path d="M80 82v3h40v-3" className="stroke-accent" strokeWidth={1.2} />
      <circle cx="54" cy="74" r="2.5" className="fill-viz-data" />
      <path d="M82 66l-4 8h4l-3 8" className="stroke-viz-remove" strokeWidth={1.6} />
      <circle cx="120" cy="74" r="2.5" className={`fill-viz-add ${A} group-hover:scale-150`} />
      <text x="67" y="60" textAnchor="middle" className={T}>
        RPO
      </text>
      <text x="100" y="95" textAnchor="middle" className={T}>
        RTO
      </text>
    </>
  ),

  "cost-finops": () => (
    <>
      {/* The taxi meter: pay for every minute. */}
      <rect
        x="18"
        y="10"
        width="10"
        height="14"
        rx="1"
        className={`fill-accent/30 stroke-accent ${A} group-hover:-rotate-12`}
      />
      <rect
        x="14"
        y="24"
        width="48"
        height="38"
        rx="4"
        className="fill-surface-2 stroke-line-strong"
        strokeWidth={1.2}
      />
      <rect x="19" y="29" width="38" height="14" rx="2" className="fill-accent/15 stroke-accent" />
      <text
        x="38"
        y="39"
        textAnchor="middle"
        className="fill-accent font-mono text-[7px] font-bold"
      >
        ₹ 412
      </text>
      {[26, 38, 50].map((x) => (
        <circle key={x} cx={x} cy={53} r={3} className="fill-surface stroke-line-strong" />
      ))}
      {/* The bill, with waste struck out. */}
      <path d={RECEIPT} className="fill-surface-2/60 stroke-line-strong" strokeWidth={1.2} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} opacity={i === 1 || i === 3 ? 0.55 : 1}>
          <rect
            x="90"
            y={21 + i * 8}
            width={[28, 22, 30, 18, 26, 20][i]}
            height="2"
            rx="1"
            className="fill-line-strong"
          />
          <rect x="128" y={21 + i * 8} width="10" height="2" rx="1" className="fill-line-strong" />
        </g>
      ))}
      {[1, 3].map((i) => (
        <path
          key={i}
          d={`M88 ${22 + i * 8}H140`}
          className={`stroke-viz-remove ${A} group-hover:scale-x-110`}
          strokeWidth={1.4}
          style={{ transitionDelay: `${i * 40}ms` }}
        />
      ))}
      <path d="M90 72H138" className="stroke-line-strong" />
      <rect x="120" y="75" width="18" height="2.5" rx="1" className="fill-fg" />
      <text x="114" y="96" textAnchor="middle" className="fill-viz-remove font-mono text-[7px]">
        waste
      </text>
      <text x="38" y="74" textAnchor="middle" className={T}>
        meter
      </text>
    </>
  ),

  "well-architected": () => (
    <>
      <path d="M20 34L72 12L124 34Z" className="fill-accent/15 stroke-accent" strokeWidth={1.4} />
      {[28, 44, 60, 76, 92, 108].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={37}
          width={8}
          height={42}
          rx={1}
          className={`fill-surface-2 stroke-line-strong ${A} group-hover:-translate-y-0.5`}
          strokeWidth={1.2}
          style={{ transitionDelay: `${i * 40}ms` }}
        />
      ))}
      <path d="M113 48l-3 5 3 4-2 5" className="stroke-viz-remove" strokeWidth={1.2} />
      <rect x="20" y="80" width="104" height="5" rx="1" className="fill-line-strong" />
      <Lens x={118} y={55} r={10} className={`${A} group-hover:-translate-x-1`} />
      <text x="72" y="96" textAnchor="middle" className={T}>
        pillars
      </text>
    </>
  ),

  "cloud-india": () => (
    <>
      {["classify", "approved", "in India"].map((label, i) => (
        <g key={label}>
          <rect
            x="14"
            y={20 + i * 24}
            width="12"
            height="12"
            rx="2"
            className="fill-viz-add/15 stroke-viz-add"
          />
          <Mark
            x={20}
            y={26 + i * 24}
            ok
            className={`${A} group-hover:scale-125`}
            style={{ transitionDelay: `${i * 80}ms` }}
          />
          <text x="32" y={28.5 + i * 24} className={T}>
            {label}
          </text>
        </g>
      ))}
      {/* The parcel, and where it must stay. */}
      <Slab x={114} y={68} w={24} h={12} t={12} cls="fill-viz-data/20 stroke-viz-data" />
      <path d="M102 62l24 12" className="stroke-viz-data/60" />
      <g className={`${A} group-hover:-translate-y-1.5`}>
        <path
          d="M114 54c-6-8-10-12-10-18a10 10 0 0 1 20 0c0 6-4 10-10 18z"
          className="fill-accent/20 stroke-accent"
          strokeWidth={1.4}
        />
        <circle cx="114" cy="36" r="3.5" className="fill-accent" />
      </g>
    </>
  ),

  migration: () => (
    <>
      {/* The old server room. */}
      <rect
        x="12"
        y="28"
        width="26"
        height="50"
        rx="2"
        className="fill-viz-compute/15 stroke-viz-compute"
        strokeWidth={1.3}
      />
      {[34, 44, 54, 64].map((y) => (
        <g key={y}>
          <rect
            x="16"
            y={y}
            width="18"
            height="6"
            rx="1"
            className="fill-surface stroke-viz-compute/60"
          />
          <circle cx="31" cy={y + 3} r="1" className="fill-viz-compute" />
        </g>
      ))}
      <text x="25" y="90" textAnchor="middle" className={T}>
        on-prem
      </text>
      {/* Boxes on the move, each with its R. */}
      <Arrow x1={44} y1={70} x2={104} y2={70} cls="stroke-line-strong" w={1.2} dash="3 2" />
      {[48, 66, 84].map((x, i) => (
        <g
          key={x}
          className={`${A} group-hover:translate-x-1.5`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <rect
            x={x}
            y={52}
            width={14}
            height={12}
            rx={1.5}
            className="fill-surface stroke-line-strong"
            strokeWidth={1.2}
          />
          <path d={`M${x} 56h14`} className="stroke-accent/60" />
          <text
            x={x + 7}
            y={62.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[6.5px] font-bold"
          >
            R
          </text>
        </g>
      ))}
      <text x="73" y="44" textAnchor="middle" className={T}>
        7 Rs
      </text>
      {/* The cloud. */}
      <path
        d="M114 64a10 10 0 0 1 2-19a14 14 0 0 1 26-4a12 12 0 0 1 6 23z"
        className={`fill-surface-2/60 stroke-accent ${A} group-hover:scale-105`}
        strokeWidth={1.4}
      />
    </>
  ),

  "capstone-landing-zone": () => (
    <>
      {/* The blueprint. */}
      <rect
        x="12"
        y="12"
        width="94"
        height="76"
        rx="3"
        className="fill-accent/10 stroke-accent"
        strokeWidth={1.3}
      />
      <path
        d={`${[22, 32, 42, 52, 62, 72, 82, 92].map((x) => `M${x} 12V88`).join("")}${[22, 32, 42, 52, 62, 72, 82].map((y) => `M12 ${y}H106`).join("")}`}
        className="stroke-accent/15"
        strokeWidth={0.6}
      />
      <path
        d="M59 28v6M30 40v-6h58v6M59 34v6M30 52v12M59 52v12M88 52v12"
        className="stroke-accent"
      />
      <rect x="47" y="20" width="24" height="8" rx="2" className="fill-surface stroke-accent" />
      {[
        [20, "fill-viz-meta/20 stroke-viz-meta"],
        [49, "fill-viz-compute/20 stroke-viz-compute"],
        [78, "fill-viz-data/20 stroke-viz-data"],
      ].map(([x, c]) => (
        <rect
          key={x as number}
          x={x as number}
          y="40"
          width="20"
          height="12"
          rx="2"
          className={c as string}
        />
      ))}
      <rect
        x="22"
        y="64"
        width="74"
        height="8"
        rx="4"
        className="fill-surface stroke-line-strong"
        strokeDasharray="3 2"
      />
      {/* The review. */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Mark
            x={118}
            y={23 + i * 14}
            ok
            className={`${A} group-hover:scale-125`}
            style={{ transitionDelay: `${i * 70}ms` }}
          />
          <rect
            x="126"
            y={22 + i * 14}
            width={[22, 16, 20, 14][i]}
            height="2"
            rx="1"
            className="fill-line-strong"
          />
        </g>
      ))}
      <text x="131" y="86" textAnchor="middle" className={T}>
        review
      </text>
    </>
  ),
};
