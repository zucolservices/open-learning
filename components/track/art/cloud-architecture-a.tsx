import type { CSSProperties } from "react";
import { A, FileIcon, type ArtMap } from "./kit";

/** Card illustrations for the Cloud Architecture track (modules 1–11), keyed by module slug. */

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Arrowhead with its tip at (x, y), pointing along `angle` (radians). */
function Head({ x, y, angle, cls }: { x: number; y: number; angle: number; cls: string }) {
  const p = (s: number) => `${r2(x - 4 * Math.cos(angle + s))} ${r2(y - 4 * Math.sin(angle + s))}`;
  return <path d={`M${p(0.55)}L${x} ${y}L${p(-0.55)}`} className={cls} strokeWidth={1.5} />;
}

/** Straight arrow from (x1, y1) to (x2, y2). */
function Arrow({
  x1,
  y1,
  x2,
  y2,
  cls = "stroke-line-strong",
  w = 1.4,
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

/** A small server: a box with two slots and a status light. */
function Server({
  x,
  y,
  w = 16,
  h = 18,
  cls = "fill-viz-compute/20 stroke-viz-compute",
  light = "fill-viz-add",
  dash,
  className = "",
  style,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  cls?: string;
  light?: string;
  dash?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <g className={className} style={style}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={2.5}
        className={cls}
        strokeWidth={1.3}
        strokeDasharray={dash}
      />
      <rect x={x + 3} y={y + 3.5} width={w - 6} height={2} rx={1} className="fill-line-strong" />
      <rect x={x + 3} y={y + 7.5} width={w - 6} height={2} rx={1} className="fill-line-strong" />
      <circle cx={x + w - 4} cy={y + h - 4} r={1.5} className={light} />
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
}: {
  x: number;
  y: number;
  ok: boolean;
  s?: number;
  className?: string;
}) {
  return ok ? (
    <path
      d={`M${x - s} ${y}l${r2(s * 0.7)} ${r2(s * 0.8)} ${r2(s * 1.4)} -${r2(s * 1.6)}`}
      className={`stroke-viz-add ${className}`}
      strokeWidth={1.6}
    />
  ) : (
    <path
      d={`M${r2(x - s * 0.8)} ${r2(y - s * 0.8)}l${r2(s * 1.6)} ${r2(s * 1.6)}M${r2(x + s * 0.8)} ${r2(y - s * 0.8)}l-${r2(s * 1.6)} ${r2(s * 1.6)}`}
      className={`stroke-viz-remove ${className}`}
      strokeWidth={1.6}
    />
  );
}

/** A person: head and shoulders centred on x, head at y. */
function Person({ x, y, cls = "fill-viz-idle/60" }: { x: number; y: number; cls?: string }) {
  return (
    <g className={cls}>
      <circle cx={x} cy={y} r={3.2} />
      <path d={`M${x - 6} ${y + 11}a6 6 0 0 1 12 0z`} />
    </g>
  );
}

/** A key lying flat: ring centred at (x, y), shaft pointing right. */
function Key({
  x,
  y,
  s = 1,
  cls,
  className = "",
  style,
}: {
  x: number;
  y: number;
  s?: number;
  cls: string;
  className?: string;
  style?: CSSProperties;
}) {
  const r = 4.5 * s;
  return (
    <g className={className} style={style}>
      <circle cx={x} cy={y} r={r} className={cls} strokeWidth={1.5} />
      <path
        d={`M${r2(x + r)} ${y}h${r2(14 * s)}m${r2(-4 * s)} 0v${r2(4 * s)}m${r2(-4 * s)} ${r2(-4 * s)}v${r2(3 * s)}`}
        className={cls}
        strokeWidth={1.5}
      />
    </g>
  );
}

/** A small padlock, body top-left at (x, y). */
function Lock({
  x,
  y,
  cls,
  className = "",
}: {
  x: number;
  y: number;
  cls: string;
  className?: string;
}) {
  return (
    <g className={className}>
      <path d={`M${x + 2.5} ${y}v-3a3.5 3.5 0 0 1 7 0v3`} className={cls} strokeWidth={1.4} />
      <rect x={x} y={y} width={12} height={9} rx={1.5} className={cls} strokeWidth={1.4} />
    </g>
  );
}

const T = "fill-muted font-mono text-[7px]";

export const cloudArchitectureArtA: ArtMap = {
  "what-is-cloud": () => (
    <>
      <rect
        x="16"
        y="22"
        width="36"
        height="58"
        rx="3"
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.3}
      />
      <Server x={21} y={27} w={26} h={14} />
      <Server x={21} y={44} w={26} h={14} />
      <Server
        x={21}
        y={61}
        w={26}
        h={14}
        cls="fill-viz-idle/20 stroke-viz-idle"
        light="fill-viz-idle"
      />
      <Arrow
        x1={58}
        y1={51}
        x2={78}
        y2={51}
        cls="stroke-accent"
        className={`${A} group-hover:translate-x-1`}
      />
      <path
        d="M88 66a12 12 0 0 1 2-23 16 16 0 0 1 30-8 13 13 0 0 1 24 8 11 11 0 0 1 0 23z"
        className="fill-surface-2/60 stroke-accent"
        strokeWidth={1.4}
      />
      {[96, 107, 118].map((x) => (
        <Server key={x} x={x} y={48} w={9} h={13} />
      ))}
      <Server
        x={129}
        y={48}
        w={9}
        h={13}
        cls="fill-viz-add/20 stroke-viz-add"
        dash="2 1.5"
        className={`${A} translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100`}
      />
      <text x="34" y="92" textAnchor="middle" className={T}>
        own
      </text>
      <text x="116" y="80" textAnchor="middle" className={T}>
        rent
      </text>
    </>
  ),

  "regions-responsibility": () => (
    <>
      <rect
        x="14"
        y="12"
        width="132"
        height="58"
        rx="5"
        className="fill-accent/5 stroke-accent"
        strokeWidth={1.4}
      />
      <text x="20" y="21" className="fill-accent font-mono text-[7px]">
        region
      </text>
      {[22, 64, 106].map((x, i) => (
        <g
          key={x}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${i * 70}ms` }}
        >
          <rect
            x={x}
            y={26}
            width={32}
            height={38}
            rx={3}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1.2}
            strokeDasharray="3 2"
          />
          <Server x={x + 4} y={36} w={11} h={18} />
          <Server x={x + 17} y={36} w={11} h={18} />
        </g>
      ))}
      <rect x="14" y="78" width="66" height="12" rx="2" className="fill-accent/25" />
      <rect x="80" y="78" width="66" height="12" rx="2" className="fill-viz-idle/25" />
      <line x1="80" y1="75" x2="80" y2="93" className="stroke-fg" strokeWidth={1.4} />
      <text x="47" y="86.5" textAnchor="middle" className="fill-fg font-mono text-[7px]">
        you
      </text>
      <text x="113" y="86.5" textAnchor="middle" className={T}>
        provider
      </text>
    </>
  ),

  "vms-containers-functions": () => (
    <>
      <g className={`${A} group-hover:-translate-y-1`}>
        <rect
          x="14"
          y="28"
          width="38"
          height="44"
          rx="3"
          className="fill-viz-compute/10 stroke-viz-compute"
          strokeWidth={1.4}
        />
        <rect x="19" y="33" width="28" height="8" rx="1.5" className="fill-viz-meta/30" />
        <rect x="19" y="45" width="28" height="22" rx="1.5" className="fill-viz-compute/30" />
      </g>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={64}
          y={56 - i * 13}
          width={30}
          height={11}
          rx={2}
          className={`fill-viz-compute/20 stroke-viz-compute ${A} group-hover:-translate-y-1`}
          strokeWidth={1.3}
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}
      <path
        d="M134 26L118 52H129L123 74L142 44H131L137 26Z"
        className={`fill-accent/30 stroke-accent ${A} group-hover:scale-110 group-hover:-rotate-6`}
        strokeWidth={1.4}
      />
      <text x="33" y="86" textAnchor="middle" className={T}>
        VM
      </text>
      <text x="79" y="86" textAnchor="middle" className={T}>
        container
      </text>
      <text x="130" y="86" textAnchor="middle" className={T}>
        function
      </text>
    </>
  ),

  "autoscaling-load-balancing": () => (
    <>
      {[40, 51, 62].map((y, i) => (
        <circle
          key={y}
          cx={14}
          cy={y}
          r={2.4}
          className={`fill-accent ${A} group-hover:translate-x-2`}
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}
      <rect
        x="28"
        y="40"
        width="24"
        height="22"
        rx="4"
        className="fill-accent/20 stroke-accent"
        strokeWidth={1.5}
      />
      <text x="40" y="53.5" textAnchor="middle" className="fill-accent font-mono text-[7px]">
        LB
      </text>
      {[20, 42, 64, 86].map((cy, i) => (
        <path
          key={cy}
          d={`M52 51C76 51 80 ${cy} 104 ${cy}`}
          className={i === 3 ? "stroke-viz-add" : "stroke-line-strong"}
          strokeWidth={1.3}
          strokeDasharray={i === 3 ? "3 2" : undefined}
        />
      ))}
      {[20, 42, 64].map((cy) => (
        <Server key={cy} x={106} y={cy - 8} />
      ))}
      <g
        className={`${A} -translate-x-1.5 opacity-60 group-hover:translate-x-0 group-hover:opacity-100`}
      >
        <Server x={106} y={78} cls="fill-viz-add/20 stroke-viz-add" dash="3 2" />
        <path d="M134 82v6M131 85h6" className="stroke-viz-add" strokeWidth={1.5} />
      </g>
    </>
  ),

  "private-networks": () => (
    <>
      <rect
        x="12"
        y="16"
        width="136"
        height="72"
        rx="5"
        className="fill-accent/5 stroke-accent"
        strokeWidth={1.4}
      />
      <text x="142" y="26" textAnchor="end" className="fill-accent font-mono text-[7px]">
        10.20.0.0/16
      </text>
      <Arrow
        x1={48}
        y1={2}
        x2={48}
        y2={42}
        cls="stroke-muted"
        className={`${A} group-hover:translate-y-1`}
      />
      <rect
        x="20"
        y="32"
        width="56"
        height="48"
        rx="3"
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <Server x={30} y={46} />
      <Server x={52} y={46} />
      <text x="48" y="76" textAnchor="middle" className={T}>
        public
      </text>
      <rect
        x="84"
        y="32"
        width="56"
        height="48"
        rx="3"
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
        strokeDasharray="3 2"
      />
      <Server x={94} y={46} />
      <Lock x={118} y={52} cls="stroke-muted" className={`${A} group-hover:scale-125`} />
      <text x="112" y="76" textAnchor="middle" className={T}>
        private
      </text>
    </>
  ),

  "in-and-out": () => (
    <>
      <rect
        x="8"
        y="14"
        width="92"
        height="72"
        rx="5"
        className="fill-accent/5 stroke-line-strong"
        strokeWidth={1.3}
        strokeDasharray="4 3"
      />
      <Server x={16} y={28} />
      <line x1="34" y1="37" x2="66" y2="37" className="stroke-accent" strokeWidth={1.5} />
      <rect
        x="66"
        y="29"
        width="24"
        height="16"
        rx="3"
        className="fill-accent/20 stroke-accent"
        strokeWidth={1.4}
      />
      <text x="78" y="39.5" textAnchor="middle" className="fill-accent font-mono text-[7px]">
        NAT
      </text>
      <Arrow x1={90} y1={37} x2={114} y2={37} cls="stroke-accent" w={1.5} />
      <circle cx={44} cy={37} r={2.4} className={`fill-accent ${A} group-hover:translate-x-4`} />
      <g className="stroke-muted" strokeWidth={1.2}>
        <circle cx="132" cy="44" r="14" className="fill-surface-2/60" />
        <ellipse cx="132" cy="44" rx="6" ry="14" />
        <path d="M118 44h28" />
      </g>
      <Arrow x1={120} y1={62} x2={104} y2={62} cls="stroke-viz-remove" dash="3 2" />
      <Mark x={96} y={62} ok={false} className={`${A} group-hover:scale-125`} />
      <path d="M24 46v28h96" className="stroke-viz-add" strokeWidth={1.4} strokeDasharray="3 2" />
      <circle cx="100" cy="74" r="3" className="fill-viz-add" />
      <path
        d="M122 68h20l-2 14h-16z"
        className={`fill-viz-data/25 stroke-viz-data ${A} group-hover:-translate-y-1`}
        strokeWidth={1.3}
      />
    </>
  ),

  "connecting-networks": () => {
    const spokes: [number, number][] = [
      [30, 26],
      [114, 26],
      [30, 74],
      [114, 74],
    ];
    return (
      <>
        {spokes.map(([x, y]) => (
          <line
            key={`${x}-${y}`}
            x1={72}
            y1={50}
            x2={x}
            y2={y}
            className="stroke-line-strong"
            strokeWidth={1.3}
          />
        ))}
        <line
          x1="83"
          y1="50"
          x2="134"
          y2="50"
          className="stroke-accent"
          strokeWidth={1.4}
          strokeDasharray="3 2"
        />
        {spokes.map(([x, y], i) => (
          <rect
            key={`${x}-${y}`}
            x={x - 10}
            y={y - 7}
            width={20}
            height={14}
            rx={2.5}
            className={`fill-surface-2/80 stroke-line-strong ${A} group-hover:scale-110`}
            strokeWidth={1.3}
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        ))}
        <circle
          cx="72"
          cy="50"
          r="11"
          className={`fill-accent/20 stroke-accent ${A} group-hover:scale-110`}
          strokeWidth={1.6}
        />
        <text x="72" y="52.5" textAnchor="middle" className="fill-accent font-mono text-[7px]">
          hub
        </text>
        <g className={`${A} group-hover:-translate-y-1`}>
          <path
            d="M136 60V44l9-6 9 6v16z"
            className="fill-viz-idle/25 stroke-viz-idle"
            strokeWidth={1.3}
          />
          <rect x="143" y="52" width="4" height="8" className="fill-viz-idle" />
        </g>
        <text x="145" y="70" textAnchor="middle" className={T}>
          office
        </text>
      </>
    );
  },

  "dns-routing": () => (
    <>
      {[24, 46, 68].map((y) => (
        <g key={y}>
          <Person x={16} y={y} />
          <line
            x1={26}
            y1={y + 6}
            x2={50}
            y2={51}
            className="stroke-line-strong"
            strokeWidth={1.1}
          />
        </g>
      ))}
      <rect
        x="50"
        y="41"
        width="26"
        height="20"
        rx="4"
        className="fill-viz-meta/20 stroke-viz-meta"
        strokeWidth={1.4}
      />
      <text x="63" y="53.5" textAnchor="middle" className="fill-viz-meta font-mono text-[7px]">
        DNS
      </text>
      <Arrow
        x1={78}
        y1={47}
        x2={116}
        y2={22}
        cls="stroke-accent"
        w={1.5}
        className={`${A} group-hover:translate-x-1`}
      />
      <Arrow x1={78} y1={51} x2={116} y2={51} cls="stroke-viz-remove" dash="3 2" />
      <Arrow
        x1={78}
        y1={55}
        x2={116}
        y2={80}
        cls="stroke-accent"
        w={1.5}
        className={`${A} group-hover:translate-x-1`}
        style={{ transitionDelay: "80ms" }}
      />
      <Server x={120} y={13} w={20} />
      <Server
        x={120}
        y={42}
        w={20}
        cls="fill-viz-remove/15 stroke-viz-remove"
        light="fill-viz-remove"
      />
      <Mark x={148} y={51} ok={false} className={`${A} group-hover:scale-125`} />
      <Server x={120} y={71} w={20} />
    </>
  ),

  iam: () => (
    <>
      <rect
        x="16"
        y="16"
        width="66"
        height="70"
        rx="3"
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.3}
      />
      <text x="24" y="31" className="fill-viz-add font-mono text-[7px] font-semibold">
        Allow
      </text>
      <rect x="24" y="36" width="48" height="2" rx="1" className="fill-line-strong" />
      <rect x="24" y="42" width="34" height="2" rx="1" className="fill-line-strong" />
      <text x="24" y="60" className="fill-viz-remove font-mono text-[7px] font-semibold">
        Deny
      </text>
      <rect x="24" y="65" width="44" height="2" rx="1" className="fill-line-strong" />
      <rect x="24" y="71" width="28" height="2" rx="1" className="fill-line-strong" />
      <Mark x={72} y={29} ok className={`${A} group-hover:scale-125`} />
      <Arrow x1={102} y1={50} x2={88} y2={50} cls="stroke-muted" />
      <g className={`${A} group-hover:-translate-x-1.5`}>
        <rect
          x="106"
          y="36"
          width="40"
          height="26"
          rx="3"
          className="fill-accent/15 stroke-accent"
          strokeWidth={1.4}
        />
        <rect x="106" y="42" width="40" height="5" className="fill-accent/40" />
        <rect x="111" y="52" width="16" height="2" rx="1" className="fill-line-strong" />
      </g>
    </>
  ),

  "workload-identity": () => (
    <>
      <Key x={30} y={50} s={1.6} cls="stroke-viz-idle" />
      <g className={`${A} group-hover:scale-110`}>
        <path d="M20 36l42 28M62 36l-42 28" className="stroke-viz-remove" strokeWidth={2} />
      </g>
      <g className={`${A} group-hover:-translate-y-1`}>
        <rect
          x="94"
          y="24"
          width="38"
          height="52"
          rx="4"
          className="fill-surface-2/60 stroke-accent"
          strokeWidth={1.4}
        />
        <rect x="106" y="28" width="14" height="3" rx="1.5" className="fill-accent/50" />
        <Person x={113} y={42} cls="fill-accent/40" />
        <rect x="102" y="60" width="18" height="2" rx="1" className="fill-line-strong" />
        <rect x="102" y="65" width="12" height="2" rx="1" className="fill-line-strong" />
      </g>
      <circle cx="132" cy="72" r="10" className="fill-surface stroke-viz-add" strokeWidth={1.5} />
      <g className={`${A} group-hover:rotate-90`}>
        <circle cx="132" cy="72" r="7" />
        <path d="M132 72v-6M132 72h4" className="stroke-viz-add" strokeWidth={1.4} />
      </g>
      <text x="132" y="92" textAnchor="middle" className={T}>
        1 h
      </text>
    </>
  ),

  "encryption-secrets": () => (
    <>
      <FileIcon x={14} y={30} w={22} h={28} />
      <Lock x={19} y={46} cls="fill-surface stroke-viz-data" />
      <Arrow x1={42} y1={44} x2={60} y2={44} cls="stroke-muted" />
      <rect
        x="64"
        y="32"
        width="44"
        height="30"
        rx="2.5"
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.3}
      />
      <Key
        x={76}
        y={27}
        s={0.9}
        cls="stroke-viz-meta"
        className={`${A} group-hover:translate-y-3`}
      />
      <path
        d="M64 32l22 16 22-16"
        className="fill-surface-2 stroke-line-strong"
        strokeWidth={1.3}
      />
      <Key
        x={126}
        y={47}
        s={1.3}
        cls="stroke-accent"
        className={`${A} group-hover:-translate-x-2`}
      />
      <text x="86" y="76" textAnchor="middle" className={T}>
        data key
      </text>
      <text x="136" y="76" textAnchor="middle" className={T}>
        master key
      </text>
    </>
  ),
};
