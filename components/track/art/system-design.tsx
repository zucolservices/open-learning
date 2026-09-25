import type { CSSProperties } from "react";
import { A, FileIcon, type ArtMap } from "./kit";

/** Card illustrations for the System Design at Scale track, keyed by module slug. */

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Arrowhead with its tip at (x, y), pointing along `angle` (radians). */
function Head({ x, y, angle, cls }: { x: number; y: number; angle: number; cls: string }) {
  const p = (s: number) =>
    `${r2(x - 4.5 * Math.cos(angle + s))} ${r2(y - 4.5 * Math.sin(angle + s))}`;
  return <path d={`M${p(0.5)}L${x} ${y}L${p(-0.5)}`} className={cls} strokeWidth={1.4} />;
}

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
  h = 20,
  cls = "fill-viz-compute/20 stroke-viz-compute",
  light = "fill-good",
  className = "",
  style,
  dash,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  cls?: string;
  light?: string;
  className?: string;
  style?: CSSProperties;
  dash?: string;
}) {
  return (
    <g className={className} style={style}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        className={cls}
        strokeWidth={1.3}
        strokeDasharray={dash}
      />
      <rect x={x + 3} y={y + 4} width={w - 6} height={2} rx={1} className="fill-line-strong" />
      <rect x={x + 3} y={y + 8.5} width={w - 6} height={2} rx={1} className="fill-line-strong" />
      <circle cx={x + w - 4.5} cy={y + h - 4.5} r={1.6} className={light} />
    </g>
  );
}

/** A database cylinder, top ellipse centred at (cx, y). */
function Db({
  cx,
  y,
  w = 24,
  h = 22,
  cls = "fill-viz-data/20 stroke-viz-data",
  className = "",
}: {
  cx: number;
  y: number;
  w?: number;
  h?: number;
  cls?: string;
  className?: string;
}) {
  const rx = w / 2;
  return (
    <g className={className}>
      <path
        d={`M${cx - rx} ${y}v${h}a${rx} 4 0 0 0 ${w} 0v${-h}`}
        className={cls}
        strokeWidth={1.3}
      />
      <path
        d={`M${cx - rx} ${y + h / 2}a${rx} 4 0 0 0 ${w} 0`}
        className={cls}
        strokeWidth={1}
        opacity={0.6}
      />
      <ellipse cx={cx} cy={y} rx={rx} ry={4} className={cls} strokeWidth={1.3} />
    </g>
  );
}

/** A person: head and shoulders centred on x, head at y. */
function Person({
  x,
  y,
  s = 1,
  cls = "fill-viz-idle/40",
}: {
  x: number;
  y: number;
  s?: number;
  cls?: string;
}) {
  return (
    <g className={cls}>
      <circle cx={x} cy={y} r={3.2 * s} />
      <path d={`M${x - 6 * s} ${y + 11 * s}a${6 * s} ${6 * s} 0 0 1 ${12 * s} 0z`} />
    </g>
  );
}

/** Ring arc from a0 to a1 degrees (0 = top, clockwise). */
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const pt = (a: number) => {
    const t = (a * Math.PI) / 180;
    return `${r2(cx + r * Math.sin(t))} ${r2(cy - r * Math.cos(t))}`;
  };
  return `M${pt(a0)}A${r} ${r} 0 0 1 ${pt(a1)}`;
}

export const systemDesignArt: ArtMap = {
  "what-scale-means": () => (
    <>
      <Person x={34} y={48} s={1.3} cls="fill-viz-idle/60" />
      <path d="M50 58l5 4-5 4" className="stroke-line-strong" strokeWidth={1.4} />
      {Array.from({ length: 9 }, (_, i) => (
        <Person
          key={i}
          x={70 + (i % 3) * 8}
          y={44 + Math.floor(i / 3) * 9}
          s={0.5}
          cls="fill-viz-idle/60"
        />
      ))}
      <path d="M96 58l5 4-5 4" className="stroke-line-strong" strokeWidth={1.4} />
      <g className={`${A} group-hover:scale-110`}>
        {Array.from({ length: 36 }, (_, i) => (
          <circle
            key={i}
            cx={112 + (i % 6) * 6}
            cy={44 + Math.floor(i / 6) * 5}
            r={1.8}
            className={i % 7 === 3 ? "fill-accent/50" : "fill-accent"}
          />
        ))}
      </g>
      {[
        [34, "1"],
        [78, "1k"],
        [127, "1M"],
      ].map(([x, t]) => (
        <text key={t} x={x} y={86} textAnchor="middle" className="fill-muted font-mono text-[8px]">
          {t}
        </text>
      ))}
    </>
  ),

  "latency-throughput": () => {
    const hs = [8, 24, 38, 46, 40, 30, 20, 13, 9, 6, 5, 4, 4];
    return (
      <>
        <line x1="20" y1="80" x2="142" y2="80" className="stroke-line-strong" strokeWidth={1.2} />
        {hs.map((h, i) => (
          <rect
            key={i}
            x={24 + i * 9}
            y={80 - h}
            width={7}
            height={h}
            rx={1.5}
            className={
              i >= 11 ? `fill-accent ${A} group-hover:-translate-y-1` : "fill-viz-compute/35"
            }
            style={i >= 11 ? { transitionDelay: `${(i - 11) * 60}ms` } : undefined}
          />
        ))}
        <line
          x1="54.5"
          y1="28"
          x2="54.5"
          y2="82"
          className="stroke-line-strong"
          strokeDasharray="2 2"
        />
        <text x="54.5" y="23" textAnchor="middle" className="fill-muted font-mono text-[7px]">
          p50
        </text>
        <line
          x1="121.5"
          y1="28"
          x2="121.5"
          y2="82"
          className="stroke-accent"
          strokeDasharray="2 2"
        />
        <text x="121.5" y="23" textAnchor="middle" className="fill-accent font-mono text-[7px]">
          p99
        </text>
      </>
    );
  },

  estimation: () => (
    <>
      <g transform="rotate(-4 80 54)">
        <path
          d="M38 26h76l10 10v48H38z"
          className="fill-surface-2/70 stroke-viz-idle"
          strokeWidth={1.3}
        />
        <path d="M114 26v10h10" className="stroke-viz-idle" strokeWidth={1.1} />
        <text x="48" y="44" className="fill-muted font-mono text-[8px]">
          10M / day
        </text>
        <text x="48" y="58" className="fill-muted font-mono text-[8px]">
          ÷ 86,400 s
        </text>
        <line x1="47" y1="63" x2="110" y2="63" className="stroke-line-strong" strokeWidth={1.2} />
        <text
          x="48"
          y="76"
          className={`fill-accent font-mono text-[9px] font-semibold ${A} group-hover:scale-110`}
        >
          ≈ 120 req/s
        </text>
      </g>
    </>
  ),

  "load-balancing": () => (
    <>
      <Arrow x1={12} y1={54} x2={28} y2={54} cls="stroke-muted" />
      <rect
        x="30"
        y="42"
        width="26"
        height="24"
        rx="5"
        className="fill-accent/25 stroke-accent"
        strokeWidth={1.5}
      />
      <path d="M37 54h5M42 54l6-5M42 54l6 5M42 54h6" className="stroke-accent" strokeWidth={1.3} />
      {[26, 54, 82].map((cy, i) => (
        <g key={cy}>
          <path
            d={`M56 54C74 54 76 ${cy} 94 ${cy}H108`}
            className="stroke-line-strong"
            strokeWidth={1.3}
          />
          <circle
            cx={96}
            cy={cy}
            r={2.4}
            className={`fill-accent ${A} group-hover:translate-x-2`}
            style={{ transitionDelay: `${i * 70}ms` }}
          />
          <Server x={110} y={cy - 10} />
        </g>
      ))}
    </>
  ),

  autoscaling: () => (
    <>
      <line x1="24" y1="30" x2="138" y2="30" className="stroke-bad/60" strokeDasharray="3 2" />
      <path
        d="M24 46L40 44L56 45L72 40L88 36L104 30L120 24L136 20"
        className="stroke-accent"
        strokeWidth={1.8}
      />
      <text x="24" y="25" className="fill-muted font-mono text-[7px]">
        CPU 70%
      </text>
      {[24, 48, 72, 96].map((x) => (
        <Server key={x} x={x} y={58} w={18} h={24} />
      ))}
      <g className={`${A} group-hover:-translate-y-1.5`}>
        <Server
          x={120}
          y={58}
          w={18}
          h={24}
          cls="fill-viz-add/20 stroke-viz-add"
          light="fill-viz-add"
          dash="3 2"
        />
        <path d="M129 49v6M126 52h6" className="stroke-viz-add" strokeWidth={1.5} />
      </g>
    </>
  ),

  "cdn-edge": () => {
    const edges = [-50, 60, 135, -130].map((a) => {
      const t = (a * Math.PI) / 180;
      return [
        r2(80 + 30 * Math.sin(t)),
        r2(54 - 30 * Math.cos(t)),
        r2(80 + 42 * Math.sin(t)),
        r2(54 - 42 * Math.cos(t)),
      ];
    });
    return (
      <>
        <circle
          cx="80"
          cy="54"
          r="30"
          className="fill-viz-idle/10 stroke-viz-idle"
          strokeWidth={1.3}
        />
        <ellipse cx="80" cy="54" rx="13" ry="30" className="stroke-viz-idle/40" />
        <path d="M50 54h60" className="stroke-viz-idle/40" />
        {edges.map(([x, y, ux, uy], i) => (
          <g key={i}>
            <line
              x1={80}
              y1={54}
              x2={x}
              y2={y}
              className="stroke-line-strong"
              strokeDasharray="2 2"
            />
            <line x1={x} y1={y} x2={ux} y2={uy} className="stroke-accent/60" />
            <circle cx={ux} cy={uy} r={2.4} className="fill-viz-idle" />
            <circle
              cx={x}
              cy={y}
              r={4.5}
              className={`fill-accent ${A} group-hover:scale-125`}
              style={{ transitionDelay: `${i * 60}ms` }}
            />
          </g>
        ))}
        <Server x={73} y={46} w={14} h={16} />
      </>
    );
  },

  "caching-patterns": () => (
    <>
      <Server x={16} y={44} w={22} h={26} />
      <text x="27" y="82" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        app
      </text>
      <g className={`${A} group-hover:scale-110`}>
        <rect
          x="68"
          y="20"
          width="28"
          height="22"
          rx="4"
          className="fill-accent/25 stroke-accent"
          strokeWidth={1.5}
        />
        <path d="M84 24l-6 8h5l-2 7 7-9h-5z" className="fill-accent" />
      </g>
      <Db cx={124} y={58} w={28} h={22} />
      <Arrow x1={40} y1={50} x2={64} y2={35} cls="stroke-accent" />
      <text x="44" y="38" className="fill-accent font-mono text-[7px]">
        hit
      </text>
      <Arrow x1={40} y1={64} x2={106} y2={70} dash="3 2" />
      <text x="62" y="78" className="fill-muted font-mono text-[7px]">
        miss
      </text>
      <Arrow x1={116} y1={52} x2={98} y2={40} cls="stroke-viz-data" dash="3 2" />
    </>
  ),

  "cache-eviction": () => (
    <>
      <rect
        x="36"
        y="38"
        width="88"
        height="28"
        rx="5"
        className="stroke-line-strong"
        strokeDasharray="3 2"
      />
      <rect
        x="14"
        y="44"
        width="16"
        height="16"
        rx="3"
        className={`fill-viz-add/25 stroke-viz-add ${A} group-hover:translate-x-1.5`}
        strokeWidth={1.3}
      />
      {[42, 62, 82, 102].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={44}
          width={16}
          height={16}
          rx={3}
          className={`fill-viz-data/25 stroke-viz-data ${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${i * 40}ms`, opacity: 1 - i * 0.15 }}
          strokeWidth={1.3}
        />
      ))}
      <rect
        x="130"
        y="44"
        width="16"
        height="16"
        rx="3"
        className={`fill-viz-remove/15 stroke-viz-remove opacity-70 ${A} group-hover:translate-x-1.5 group-hover:opacity-20`}
        strokeDasharray="3 2"
        strokeWidth={1.3}
      />
      <text x="22" y="76" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        new
      </text>
      <text x="80" y="30" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        LRU
      </text>
      <text x="138" y="76" textAnchor="middle" className="fill-viz-remove font-mono text-[7px]">
        evict
      </text>
    </>
  ),

  replication: () => (
    <>
      <Db cx={44} y={36} w={32} h={30} cls="fill-accent/20 stroke-accent" />
      <text x="44" y="86" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        leader
      </text>
      <Db cx={118} y={20} w={24} h={18} />
      <Db cx={118} y={62} w={24} h={18} className={`${A} group-hover:translate-x-1.5`} />
      <Arrow x1={64} y1={44} x2={102} y2={30} cls="stroke-accent" />
      <Arrow x1={64} y1={60} x2={102} y2={70} cls="stroke-line-strong" dash="3 2" />
      <circle cx="80" cy="80" r="5" className="fill-surface stroke-viz-meta" strokeWidth={1.2} />
      <path d="M80 77v3l2 1.5" className="stroke-viz-meta" strokeWidth={1.1} />
      <text x="88" y="83" className="fill-viz-meta font-mono text-[7px]">
        lag
      </text>
    </>
  ),

  sharding: () => (
    <>
      {[
        [4, 86, "stroke-viz-data"],
        [94, 176, "stroke-viz-data/55"],
        [184, 266, "stroke-accent"],
        [274, 356, "stroke-viz-data/30"],
      ].map(([a0, a1, c]) => (
        <path
          key={c as string}
          d={arc(80, 54, 28, a0 as number, a1 as number)}
          className={`${c} ${c === "stroke-accent" ? `${A} group-hover:scale-110` : ""}`}
          strokeWidth={9}
          strokeLinecap="butt"
        />
      ))}
      {[30, 125, 215, 250, 320].map((a) => {
        const t = (a * Math.PI) / 180;
        return (
          <circle
            key={a}
            cx={r2(80 + 39 * Math.sin(t))}
            cy={r2(54 - 39 * Math.cos(t))}
            r={1.8}
            className="fill-fg/70"
          />
        );
      })}
      <text x="80" y="57" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        hash(k)
      </text>
    </>
  ),

  consistency: () => (
    <>
      <line x1="44" y1="34" x2="44" y2="72" className="stroke-line-strong" strokeWidth={1.3} />
      <line
        x1="44"
        y1="34"
        x2="116"
        y2="53"
        className="stroke-line-strong/60"
        strokeDasharray="2 3"
      />
      <line
        x1="44"
        y1="72"
        x2="116"
        y2="53"
        className="stroke-line-strong/60"
        strokeDasharray="2 3"
      />
      <circle
        cx="44"
        cy="34"
        r="9"
        className="fill-viz-data/25 stroke-viz-data"
        strokeWidth={1.4}
      />
      <circle
        cx="44"
        cy="72"
        r="9"
        className="fill-viz-data/25 stroke-viz-data"
        strokeWidth={1.4}
      />
      <g className={`${A} group-hover:translate-x-1.5`}>
        <circle
          cx="116"
          cy="53"
          r="9"
          className="fill-viz-idle/20 stroke-viz-idle"
          strokeWidth={1.4}
        />
        <text x="116" y="56.5" textAnchor="middle" className="fill-muted text-[9px] font-semibold">
          ?
        </text>
      </g>
      <path d="M84 18l-5 10 9 7-9 8 9 7-9 8 9 7-4 9" className="stroke-bad" strokeWidth={1.6} />
      <text x="80" y="92" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        R + W &gt; N
      </text>
    </>
  ),

  "choosing-a-database": () => (
    <>
      <FileIcon
        x={60}
        y={14}
        w={10}
        h={12}
        cls="fill-viz-data/30 stroke-viz-data"
        className={`${A} group-hover:translate-y-1`}
      />
      <Arrow x1={65} y1={29} x2={65} y2={37} cls="stroke-accent" />
      {[16, 50, 84, 118].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={42}
          width={26}
          height={30}
          rx={4}
          className={
            i === 1 ? "fill-accent/15 stroke-accent" : "fill-surface-2/60 stroke-line-strong"
          }
          strokeWidth={i === 1 ? 1.5 : 1.2}
        />
      ))}
      {/* relational: a grid */}
      <rect
        x="20"
        y="47"
        width="18"
        height="20"
        rx="1.5"
        className="fill-viz-data/15 stroke-viz-data/80"
      />
      <path d="M20 52h18M20 57h18M20 62h18M27 47v20" className="stroke-viz-data/60" />
      {/* key-value */}
      {[50, 58, 66].map((y) => (
        <g key={y}>
          <rect x={54} y={y - 2.5} width={6} height={5} rx={1} className="fill-accent" />
          <rect x={62} y={y - 2} width={10} height={4} rx={1} className="fill-viz-data/50" />
        </g>
      ))}
      {/* graph */}
      <path d="M92 52L104 50L98 64L110 62M104 50L110 62" className="stroke-viz-data/70" />
      {[
        [92, 52],
        [104, 50],
        [98, 64],
        [110, 62],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} className="fill-viz-data" />
      ))}
      {/* time series */}
      <path d="M122 64l5-4 4 2 4-8 4 3 3-7" className="stroke-viz-data" strokeWidth={1.3} />
      <line x1="122" y1="67" x2="140" y2="67" className="stroke-line-strong" />
    </>
  ),

  "distributed-transactions": () => (
    <>
      {[
        [14, "pay"],
        [65, "stock"],
        [116, "ship"],
      ].map(([x, t], i) => (
        <g key={t as string} className={i === 2 ? `${A} group-hover:scale-110` : ""}>
          <rect
            x={x as number}
            y={30}
            width={30}
            height={22}
            rx={4}
            className={
              i === 2 ? "fill-bad/15 stroke-bad" : "fill-viz-compute/20 stroke-viz-compute"
            }
            strokeWidth={1.3}
          />
          <text
            x={(x as number) + 15}
            y={43.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[7px]"
          >
            {t}
          </text>
        </g>
      ))}
      <Arrow x1={46} y1={41} x2={62} y2={41} />
      <Arrow x1={97} y1={41} x2={113} y2={41} />
      <path d="M127 22l6 6M133 22l-6 6" className="stroke-bad" strokeWidth={1.6} />
      <path
        d="M131 56Q80 92 29 56"
        className="stroke-viz-remove"
        strokeWidth={1.5}
        strokeDasharray="3 2"
      />
      <Head x={29} y={56} angle={Math.atan2(56 - 92, 29 - 80)} cls="stroke-viz-remove" />
      <text x="80" y="84" textAnchor="middle" className="fill-viz-remove font-mono text-[7px]">
        undo
      </text>
    </>
  ),

  "queues-streams": () => (
    <>
      <Server x={12} y={42} w={18} h={22} />
      <Arrow x1={32} y1={53} x2={40} y2={53} />
      <rect
        x="42"
        y="44"
        width="72"
        height="18"
        rx="9"
        className="fill-viz-idle/10 stroke-viz-idle"
        strokeWidth={1.3}
      />
      {[50, 62, 74, 86, 98].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={48}
          width={8}
          height={10}
          rx={1.5}
          className={`fill-viz-data/40 stroke-viz-data ${A} group-hover:translate-x-1.5`}
          style={{ transitionDelay: `${(4 - i) * 50}ms` }}
        />
      ))}
      <path
        d="M114 53C122 53 120 36 126 36M114 53C122 53 120 72 126 72"
        className="stroke-line-strong"
        strokeWidth={1.3}
      />
      <Server x={128} y={26} w={18} h={20} />
      <Server x={128} y={62} w={18} h={20} />
      <text x="78" y="76" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        backlog
      </text>
    </>
  ),

  "retries-idempotency": () => (
    <>
      <Person x={20} y={44} s={1.2} cls="fill-viz-idle/60" />
      {[0, 1, 2].map((i) => (
        <Arrow
          key={i}
          x1={34}
          y1={34 + i * 13}
          x2={88}
          y2={45 + i * 6}
          cls={i === 0 ? "stroke-accent" : "stroke-muted"}
          dash={i === 0 ? undefined : "3 2"}
        />
      ))}
      <rect
        x="92"
        y="34"
        width="38"
        height="36"
        rx="4"
        className="fill-viz-compute/15 stroke-viz-compute"
        strokeWidth={1.3}
      />
      <rect
        x="101"
        y="46"
        width="20"
        height="13"
        rx="2"
        className="fill-surface stroke-line-strong"
      />
      <line x1="101" y1="50" x2="121" y2="50" className="stroke-line-strong" strokeWidth={2} />
      <g className={`${A} group-hover:rotate-12`}>
        <circle
          cx="130"
          cy="30"
          r="4.5"
          className="fill-accent/25 stroke-accent"
          strokeWidth={1.5}
        />
        <path
          d="M133.5 33l7 7M137.5 37l2-2M139.5 39l2-2"
          className="stroke-accent"
          strokeWidth={1.5}
        />
      </g>
      <text x="111" y="82" textAnchor="middle" className="fill-good font-mono text-[7px]">
        charged once
      </text>
    </>
  ),

  "event-driven": () => (
    <>
      <Server x={24} y={16} w={18} h={20} />
      <Arrow x1={33} y1={38} x2={33} y2={45} />
      <rect
        x="18"
        y="47"
        width="124"
        height="10"
        rx="5"
        className="fill-viz-idle/15 stroke-viz-idle"
        strokeWidth={1.2}
      />
      {[52, 76, 100].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={52}
          r={2.6}
          className={`fill-viz-data ${A} group-hover:translate-x-2`}
          style={{ transitionDelay: `${i * 50}ms` }}
        />
      ))}
      {[46, 80].map((x) => (
        <g key={x}>
          <line
            x1={x + 9}
            y1={57}
            x2={x + 9}
            y2={66}
            className="stroke-line-strong"
            strokeWidth={1.2}
          />
          <Server x={x} y={66} w={18} h={20} />
        </g>
      ))}
      <g className={`${A} group-hover:-translate-y-1`}>
        <line
          x1={123}
          y1={57}
          x2={123}
          y2={66}
          className="stroke-viz-add"
          strokeDasharray="2 2"
          strokeWidth={1.2}
        />
        <Server
          x={114}
          y={66}
          w={18}
          h={20}
          cls="fill-viz-add/20 stroke-viz-add"
          light="fill-viz-add"
          dash="3 2"
        />
      </g>
    </>
  ),

  availability: () => (
    <>
      <text
        x="80"
        y="32"
        textAnchor="middle"
        className="fill-fg font-mono text-[14px] font-semibold"
      >
        99.9<tspan className="fill-accent">9</tspan>%
      </text>
      <path
        d="M22 66h12M50 66h8M58 66v-11h10M58 66v11h10M84 55h8v11M84 77h8v-11M92 66h14M122 66h12"
        className="stroke-line-strong"
        strokeWidth={1.3}
      />
      <rect
        x="34"
        y="59"
        width="16"
        height="14"
        rx="3"
        className="fill-good/20 stroke-good"
        strokeWidth={1.3}
      />
      <rect
        x="68"
        y="48"
        width="16"
        height="14"
        rx="3"
        className="fill-good/20 stroke-good"
        strokeWidth={1.3}
      />
      <g className={`${A} group-hover:rotate-6`}>
        <rect
          x="68"
          y="70"
          width="16"
          height="14"
          rx="3"
          className="fill-bad/15 stroke-bad"
          strokeWidth={1.3}
        />
        <path d="M73 74l6 6M79 74l-6 6" className="stroke-bad" strokeWidth={1.3} />
      </g>
      <rect
        x="106"
        y="59"
        width="16"
        height="14"
        rx="3"
        className="fill-good/20 stroke-good"
        strokeWidth={1.3}
      />
    </>
  ),

  "resilience-patterns": () => (
    <>
      <Server x={14} y={42} w={20} h={24} />
      <line x1="34" y1="54" x2="62" y2="54" className="stroke-line-strong" strokeWidth={1.5} />
      <circle cx="64" cy="54" r="2.5" className="fill-accent" />
      <circle cx="96" cy="54" r="2.5" className="fill-accent" />
      <line
        x1="64"
        y1="54"
        x2="92"
        y2="38"
        className={`stroke-accent ${A} group-hover:-rotate-6`}
        strokeWidth={2.4}
      />
      <line
        x1="98"
        y1="54"
        x2="118"
        y2="54"
        className="stroke-line-strong/60"
        strokeWidth={1.5}
        strokeDasharray="3 2"
      />
      <Server x={120} y={42} w={20} h={24} cls="fill-bad/15 stroke-bad" light="fill-bad" />
      <path d="M126 28h8l-8 8h8z" className="stroke-bad" strokeWidth={1.2} />
      <text x="80" y="72" textAnchor="middle" className="fill-accent font-mono text-[7px]">
        open
      </text>
    </>
  ),

  "multi-region-dr": () => (
    <>
      <circle
        cx="80"
        cy="52"
        r="34"
        className="fill-viz-idle/10 stroke-viz-idle"
        strokeWidth={1.3}
      />
      <ellipse cx="80" cy="52" rx="15" ry="34" className="stroke-viz-idle/40" />
      <path d="M46 52h68M51 36h58M51 68h58" className="stroke-viz-idle/40" />
      <circle cx="60" cy="38" r="7" className="fill-bad/25 stroke-bad" strokeWidth={1.4} />
      <path d="M57 35l6 6M63 35l-6 6" className="stroke-bad" strokeWidth={1.4} />
      <circle
        cx="104"
        cy="66"
        r="7"
        className={`fill-good/25 stroke-good ${A} group-hover:scale-125`}
        strokeWidth={1.4}
      />
      <path d="M68 36Q102 30 103 55" className="stroke-accent" strokeWidth={2} />
      <Head x={103} y={55} angle={Math.atan2(55 - 30, 103 - 102)} cls="stroke-accent" />
    </>
  ),

  observability: () => (
    <>
      {[16, 62, 108].map((x, i) => (
        <g
          key={x}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <rect
            x={x}
            y={26}
            width={36}
            height={40}
            rx={4}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1.2}
          />
          {i === 0 && (
            <path d="M21 56l6-6 5 3 6-10 5 4 5-9" className="stroke-accent" strokeWidth={1.6} />
          )}
          {i === 1 &&
            [34, 41, 48, 55].map((y, j) => (
              <g key={y}>
                <rect x={67} y={y - 1.5} width={4} height={3} rx={1} className="fill-viz-meta" />
                <rect
                  x={73}
                  y={y - 1.5}
                  width={[18, 13, 20, 10][j]}
                  height={3}
                  rx={1}
                  className="fill-viz-meta/40"
                />
              </g>
            ))}
          {i === 2 &&
            [
              [112, 26],
              [116, 12],
              [120, 16],
              [129, 10],
            ].map(([bx, bw], j) => (
              <rect
                key={j}
                x={bx}
                y={33 + j * 7}
                width={bw}
                height={4}
                rx={1}
                className={j === 3 ? "fill-bad/70" : "fill-viz-compute/60"}
              />
            ))}
        </g>
      ))}
      {[
        [34, "metrics"],
        [80, "logs"],
        [126, "traces"],
      ].map(([x, t]) => (
        <text key={t} x={x} y={80} textAnchor="middle" className="fill-muted font-mono text-[7px]">
          {t}
        </text>
      ))}
    </>
  ),

  "url-shortener": () => (
    <>
      <rect
        x="14"
        y="20"
        width="132"
        height="14"
        rx="3"
        className="fill-viz-data/15 stroke-viz-data/60"
      />
      <text x="20" y="29.5" className="fill-muted font-mono text-[6px]">
        site.com/very/long/path?id=8f3a91…
      </text>
      <path d="M50 40h60L90 58H70z" className="fill-accent/15 stroke-accent" strokeWidth={1.3} />
      <g className={`${A} group-hover:scale-110`}>
        <rect
          x="48"
          y="66"
          width="64"
          height="16"
          rx="8"
          className="fill-accent/25 stroke-accent"
          strokeWidth={1.5}
        />
        <text x="80" y="76.5" textAnchor="middle" className="fill-fg font-mono text-[7.5px]">
          sho.rt/x7Kp
        </text>
      </g>
    </>
  ),

  "news-feed": () => (
    <>
      <path
        d="M40 36l3.5 7.5 8 1-6 5.5 1.6 8L40 54l-7.1 4 1.6-8-6-5.5 8-1z"
        className={`fill-accent stroke-accent ${A} group-hover:rotate-12`}
        strokeWidth={1}
      />
      <text x="40" y="74" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        10M
      </text>
      {[20, 38, 56, 74].map((y, i) => (
        <g key={y}>
          <path
            d={`M53 48C74 48 76 ${y + 6.5} 96 ${y + 6.5}`}
            className="stroke-line-strong"
            strokeWidth={1.1}
          />
          <g
            className={`${A} group-hover:translate-x-1`}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <rect
              x={98}
              y={y}
              width={44}
              height={13}
              rx={3}
              className="fill-surface-2/60 stroke-line-strong"
            />
            <rect x={102} y={y + 3.5} width={6} height={6} rx={1.5} className="fill-accent" />
            <rect x={111} y={y + 4} width={26} height={2} rx={1} className="fill-line-strong" />
            <rect x={111} y={y + 7.5} width={16} height={2} rx={1} className="fill-line-strong" />
          </g>
        </g>
      ))}
    </>
  ),

  "realtime-chat": () => (
    <>
      {[18, 112].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y={22}
            width={30}
            height={58}
            rx={5}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1.3}
          />
          <line x1={x + 11} y1={26} x2={x + 19} y2={26} className="stroke-line-strong" />
        </g>
      ))}
      <rect x="30" y="34" width="14" height="8" rx="3" className="fill-accent" />
      <rect x="22" y="46" width="16" height="8" rx="3" className="fill-viz-idle/40" />
      <rect x="116" y="34" width="16" height="8" rx="3" className="fill-viz-idle/40" />
      <rect x="116" y="46" width="14" height="8" rx="3" className="fill-accent/70" />
      <path d="M117 59l2 2 3-4M121 59l2 2 3-4" className="stroke-good" strokeWidth={1.1} />
      <line x1="48" y1="66" x2="112" y2="66" className="stroke-viz-compute" strokeWidth={1.5} />
      <rect
        x="74"
        y="60"
        width="12"
        height="12"
        rx="3"
        className="fill-viz-compute/25 stroke-viz-compute"
        strokeWidth={1.2}
      />
      <circle cx="58" cy="66" r="2.6" className={`fill-accent ${A} group-hover:translate-x-4`} />
    </>
  ),

  "flash-sale": () => (
    <>
      <circle cx="26" cy="30" r="7" className="stroke-viz-idle" strokeWidth={1.3} />
      <path d="M26 26v4h3" className="stroke-viz-idle" strokeWidth={1.2} />
      <text x="37" y="33" className="fill-muted font-mono text-[8px]">
        10:00
      </text>
      <rect
        x="100"
        y="24"
        width="42"
        height="40"
        rx="5"
        className="fill-accent/15 stroke-accent"
        strokeWidth={1.5}
      />
      <text
        x="121"
        y="50"
        textAnchor="middle"
        className={`fill-accent font-mono text-[20px] font-bold ${A} group-hover:scale-110`}
      >
        3
      </text>
      <text x="121" y="60" textAnchor="middle" className="fill-muted font-mono text-[6px]">
        left
      </text>
      <line x1="94" y1="58" x2="94" y2="84" className="stroke-line-strong" strokeWidth={2} />
      {Array.from({ length: 7 }, (_, i) => (
        <g
          key={i}
          className={`${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${(6 - i) * 40}ms` }}
        >
          <Person
            x={20 + i * 10}
            y={66}
            s={0.75}
            cls={i === 6 ? "fill-accent" : "fill-viz-idle/60"}
          />
        </g>
      ))}
      <line
        x1="14"
        y1="84"
        x2="90"
        y2="84"
        className="stroke-line-strong/60"
        strokeDasharray="2 2"
      />
    </>
  ),

  "building-blocks": () => (
    <>
      {[
        [58, 71, "fill-viz-data/25 stroke-viz-data", ""],
        [52, 56, "fill-viz-compute/25 stroke-viz-compute", ""],
        [62, 41, "fill-viz-meta/25 stroke-viz-meta", ""],
        [56, 26, "fill-accent/30 stroke-accent", `${A} group-hover:-translate-y-1.5`],
      ].map(([x, y, c, hover]) => (
        <g key={y as number} className={hover as string}>
          {[0, 1, 2].map((s) => (
            <rect
              key={s}
              x={(x as number) + 7 + s * 14}
              y={(y as number) - 3}
              width={8}
              height={3}
              rx={1}
              className={c as string}
              strokeWidth={1}
            />
          ))}
          <rect
            x={x as number}
            y={y as number}
            width={44}
            height={12}
            rx={2}
            className={c as string}
            strokeWidth={1.3}
          />
        </g>
      ))}
      <text x="80" y="92" textAnchor="middle" className="fill-muted font-mono text-[6.5px]">
        AWS · GCP · Azure · OSS
      </text>
    </>
  ),

  "results-day": () => (
    <>
      <line x1="16" y1="80" x2="144" y2="80" className="stroke-line-strong" strokeWidth={1.2} />
      <path
        d="M16 76H68L76 70L84 24L92 32L100 52L118 66L144 70V80H16z"
        className="fill-accent/15"
      />
      <path
        d="M16 76H68L76 70L84 24L92 32L100 52L118 66L144 70"
        className="stroke-accent"
        strokeWidth={1.6}
      />
      <line x1="84" y1="24" x2="84" y2="80" className="stroke-line-strong" strokeDasharray="2 2" />
      <text x="84" y="90" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        10:00
      </text>
      <g className={`${A} group-hover:scale-110`}>
        <path
          d="M128 20l13 4.5v10c0 9-6 14-13 17-7-3-13-8-13-17v-10z"
          className="fill-good/20 stroke-good"
          strokeWidth={1.5}
        />
        <text
          x="128"
          y="38"
          textAnchor="middle"
          className="fill-fg font-mono text-[6.5px] font-semibold"
        >
          CDN
        </text>
      </g>
    </>
  ),

  "the-outage": () => (
    <>
      <g className={`${A} group-hover:rotate-6`}>
        <rect
          x="16"
          y="26"
          width="28"
          height="20"
          rx="4"
          className="fill-surface-2 stroke-line-strong"
          strokeWidth={1.3}
        />
        <rect x="20" y="30" width="20" height="8" rx="1.5" className="fill-bad/50" />
        <circle cx="30" cy="42" r="1.4" className="fill-muted" />
        <path d="M12 30q-3 6 0 12M48 30q3 6 0 12" className="stroke-bad" strokeWidth={1.3} />
      </g>
      <line x1="58" y1="80" x2="144" y2="80" className="stroke-line-strong" strokeWidth={1.2} />
      <line x1="58" y1="62" x2="144" y2="62" className="stroke-line-strong" strokeDasharray="3 2" />
      <path
        d="M58 76L68 74L76 75L86 66L94 72L102 46L110 54L118 30L126 38L134 22L142 28V80H58z"
        className="fill-bad/15"
      />
      <path
        d="M58 76L68 74L76 75L86 66L94 72L102 46L110 54L118 30L126 38L134 22L142 28"
        className="stroke-bad"
        strokeWidth={1.6}
      />
      <text x="58" y="92" className="fill-muted font-mono text-[7px]">
        5xx errors
      </text>
    </>
  ),
};
