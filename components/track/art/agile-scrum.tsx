import type { CSSProperties } from "react";
import { A, type ArtMap } from "./kit";

/** Card illustrations for the Agile & Scrum track, keyed by module slug. */

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

/** Point on a circle at angle a degrees (0 = top, clockwise). */
function pt(cx: number, cy: number, r: number, a: number) {
  const t = (a * Math.PI) / 180;
  return [r2(cx + r * Math.sin(t)), r2(cy - r * Math.cos(t))] as const;
}

/** A clockwise loop arrow from a0 to a1 degrees, with a head at the end. */
function Loop({
  cx,
  cy,
  r,
  a0 = 40,
  a1 = 330,
  cls = "stroke-accent",
  w = 1.6,
  className = "",
  style,
}: {
  cx: number;
  cy: number;
  r: number;
  a0?: number;
  a1?: number;
  cls?: string;
  w?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [x0, y0] = pt(cx, cy, r, a0);
  const [x1, y1] = pt(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return (
    <g className={className} style={style}>
      <path d={`M${x0} ${y0}A${r} ${r} 0 ${large} 1 ${x1} ${y1}`} className={cls} strokeWidth={w} />
      <Head x={x1} y={y1} angle={(a1 * Math.PI) / 180} cls={cls} />
    </g>
  );
}

/** A person: head and shoulders centred on x, head at y. */
function Person({
  x,
  y,
  s = 1,
  cls = "fill-viz-idle/60",
  className = "",
  style,
}: {
  x: number;
  y: number;
  s?: number;
  cls?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <g className={`${cls} ${className}`} style={style}>
      <circle cx={x} cy={y} r={3.2 * s} />
      <path d={`M${x - 6 * s} ${y + 11 * s}a${6 * s} ${6 * s} 0 0 1 ${12 * s} 0z`} />
    </g>
  );
}

/** A small work-item card with one text line. */
function Card({
  x,
  y,
  w = 16,
  h = 10,
  cls = "fill-viz-data/25 stroke-viz-data",
  line = "fill-viz-data/70",
  className = "",
  style,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  cls?: string;
  line?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <g className={className} style={style}>
      <rect x={x} y={y} width={w} height={h} rx={2} className={cls} strokeWidth={1.1} />
      <rect x={x + 3} y={y + h / 2 - 1} width={w * 0.5} height={2} rx={1} className={line} />
    </g>
  );
}

/** A tick box: a square with a check mark. */
function Tick({
  x,
  y,
  s = 7,
  cls = "stroke-good",
}: {
  x: number;
  y: number;
  s?: number;
  cls?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx={1.5} className={cls} strokeWidth={1.1} />
      <path
        d={`M${x + s * 0.22} ${y + s * 0.52}l${s * 0.22} ${s * 0.22} ${s * 0.36} -${s * 0.44}`}
        className={cls}
        strokeWidth={1.3}
      />
    </g>
  );
}

/** Polygon between an upper and a lower line sampled at the same x positions. */
function band(xs: number[], top: number[], bottom: number[]) {
  const up = xs.map((x, i) => `${x},${top[i]}`);
  const down = xs.map((x, i) => `${x},${bottom[i]}`).reverse();
  return [...up, ...down].join(" ");
}

export const agileScrumArt: ArtMap = {
  "why-plans-break": () => (
    <>
      <Arrow x1={22} y1={60} x2={138} y2={26} cls="stroke-viz-meta" dash="4 3" />
      <text x="112" y="20" className="fill-muted font-mono text-[7px]">
        plan
      </text>
      <path
        d="M22 60C38 60 42 44 56 48S70 74 86 68S102 46 114 60S128 82 138 78"
        className="stroke-accent"
        strokeWidth={1.8}
      />
      <circle cx="22" cy="60" r="3" className="fill-fg" />
      <circle cx="138" cy="78" r="3.2" className={`fill-accent ${A} group-hover:translate-x-1.5`} />
      <text x="104" y="90" className="fill-accent font-mono text-[7px]">
        reality
      </text>
    </>
  ),

  "agile-manifesto": () => (
    <>
      <rect
        x="42"
        y="20"
        width="76"
        height="62"
        className="fill-surface-2/70 stroke-viz-meta"
        strokeWidth={1.2}
      />
      <rect
        x="38"
        y="15"
        width="84"
        height="7"
        rx="3.5"
        className="fill-viz-meta/30 stroke-viz-meta"
        strokeWidth={1.2}
      />
      <rect
        x="38"
        y="80"
        width="84"
        height="7"
        rx="3.5"
        className="fill-viz-meta/30 stroke-viz-meta"
        strokeWidth={1.2}
      />
      {[31, 44, 57, 70].map((y, i) => (
        <g key={y}>
          <rect
            x="50"
            y={y - 2.5}
            width={[26, 22, 28, 24][i]}
            height="5"
            rx="2"
            className={`fill-viz-meta ${A} group-hover:translate-x-1`}
            style={{ transitionDelay: `${i * 60}ms` }}
          />
          <path d={`M83 ${y - 2}l3 2-3 2`} className="stroke-line-strong" strokeWidth={1.1} />
          <rect
            x="92"
            y={y - 1.5}
            width={[18, 20, 14, 17][i]}
            height="3"
            rx="1.5"
            className="fill-viz-idle/40"
          />
        </g>
      ))}
    </>
  ),

  "inspect-adapt": () => (
    <>
      <Loop cx={58} cy={52} r={26} a0={50} a1={320} />
      <path
        d="M44 52Q58 40 72 52Q58 64 44 52Z"
        className="fill-surface stroke-fg"
        strokeWidth={1.3}
      />
      <circle cx="58" cy="52" r="4" className={`fill-accent ${A} group-hover:translate-x-1`} />
      <Arrow x1={86} y1={52} x2={106} y2={52} cls="stroke-line-strong" dash="3 2" />
      <g className={`${A} group-hover:scale-110`}>
        <circle
          cx="124"
          cy="52"
          r="15"
          className="fill-viz-idle/10 stroke-viz-idle"
          strokeWidth={1.2}
        />
        <circle cx="124" cy="52" r="9" className="stroke-viz-idle" strokeWidth={1.2} />
        <circle cx="124" cy="52" r="3.5" className="fill-accent" />
      </g>
    </>
  ),

  "scrum-on-one-page": () => (
    <>
      {[34, 44, 54, 64].map((y, i) => (
        <rect
          key={y}
          x="14"
          y={y}
          width={28 - i * 3}
          height="7"
          rx="2"
          className={i === 0 ? "fill-accent/30 stroke-accent" : "fill-viz-data/25 stroke-viz-data"}
          strokeWidth={1.1}
        />
      ))}
      <Arrow x1={46} y1={52} x2={58} y2={52} />
      <Loop cx={80} cy={52} r={17} a0={30} a1={320} w={1.8} />
      <Loop
        cx={92}
        cy={33}
        r={6}
        a0={60}
        a1={340}
        cls="stroke-viz-compute"
        w={1.2}
        className={`${A} group-hover:rotate-45`}
      />
      <Arrow x1={102} y1={52} x2={114} y2={52} />
      <g className={`${A} group-hover:-translate-y-1`}>
        <rect
          x="118"
          y="40"
          width="26"
          height="24"
          rx="4"
          className="fill-viz-add/20 stroke-viz-add"
          strokeWidth={1.4}
        />
        <path d="M131 46v12M125 52h12" className="stroke-viz-add" strokeWidth={1.5} />
      </g>
      {[
        [28, "backlog"],
        [80, "sprint"],
        [131, "increment"],
      ].map(([x, t]) => (
        <text key={t} x={x} y={84} textAnchor="middle" className="fill-muted font-mono text-[7px]">
          {t}
        </text>
      ))}
    </>
  ),

  "who-decides": () => (
    <>
      <Person x={36} y={36} s={1.4} cls="fill-accent/70" />
      <Person x={80} y={36} s={1.4} />
      {[112, 124, 136].map((x, i) => (
        <Person key={x} x={x} y={i === 1 ? 34 : 40} s={1} />
      ))}
      {[
        [36, "PO", "fill-accent/20 stroke-accent", "fill-accent"],
        [80, "SM", "fill-surface-2 stroke-line-strong", "fill-fg"],
        [124, "Devs", "fill-surface-2 stroke-line-strong", "fill-fg"],
      ].map(([x, t, box, txt], i) => (
        <g
          key={t}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${i * 70}ms` }}
        >
          <rect
            x={Number(x) - 14}
            y="64"
            width="28"
            height="13"
            rx="6.5"
            className={box as string}
            strokeWidth={1.2}
          />
          <text
            x={x}
            y="73"
            textAnchor="middle"
            className={`${txt} font-mono text-[8px] font-semibold`}
          >
            {t}
          </text>
        </g>
      ))}
    </>
  ),

  "sprint-planning": () => (
    <>
      {[22, 34, 46, 58, 70].map((y, i) => (
        <Card
          key={y}
          x={16}
          y={y}
          w={30}
          h={9}
          cls={i === 0 ? "fill-viz-data/10 stroke-viz-data/50" : undefined}
        />
      ))}
      <path
        d="M50 26C64 22 76 26 84 36"
        className="stroke-line-strong"
        strokeWidth={1.2}
        strokeDasharray="2 2"
      />
      <Card
        x={78}
        y={28}
        w={22}
        h={9}
        cls="fill-accent/25 stroke-accent"
        line="fill-accent"
        className={`${A} group-hover:translate-y-2`}
      />
      <rect
        x="72"
        y="46"
        width="68"
        height="38"
        rx="5"
        className="fill-accent/10 stroke-accent"
        strokeWidth={1.4}
      />
      {[
        [78, 54],
        [100, 54],
        [78, 68],
      ].map(([x, y]) => (
        <Card key={`${x}-${y}`} x={x} y={y} w={18} h={9} />
      ))}
      <path d="M130 70V24" className="stroke-fg" strokeWidth={1.2} />
      <path
        d="M130 24h12l-3 5 3 5h-12z"
        className={`fill-accent ${A} group-hover:-translate-y-1`}
      />
    </>
  ),

  "daily-scrum": () => (
    <>
      <circle
        cx="80"
        cy="40"
        r="22"
        className="fill-surface-2/60 stroke-viz-idle"
        strokeWidth={1.3}
      />
      <path
        d="M80 40L80 18A22 22 0 0 1 102 40Z"
        className={`fill-accent/35 stroke-accent ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      {[0, 90, 180, 270].map((a) => {
        const [x1, y1] = pt(80, 40, 18, a);
        const [x2, y2] = pt(80, 40, 21, a);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-line-strong" />;
      })}
      <path d="M80 40V26M80 40L90 40" className="stroke-fg" strokeWidth={1.6} />
      <circle cx="80" cy="40" r="1.8" className="fill-fg" />
      <text x="100" y="17" className="fill-accent font-mono text-[8px] font-semibold">
        15m
      </text>
      {[46, 80, 114].map((x, i) => (
        <Person
          key={x}
          x={x}
          y={72}
          s={1}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${i * 70}ms` }}
        />
      ))}
    </>
  ),

  "review-retro": () => (
    <>
      <rect
        x="14"
        y="24"
        width="62"
        height="42"
        rx="4"
        className="fill-surface-2/60 stroke-viz-idle"
        strokeWidth={1.3}
      />
      <path d="M40 34L40 56L58 45Z" className={`fill-accent ${A} group-hover:scale-110`} />
      <path d="M45 66v8M34 76h22" className="stroke-viz-idle" strokeWidth={1.3} />
      <g className={`${A} group-hover:-rotate-6`}>
        <rect
          x="90"
          y="20"
          width="42"
          height="28"
          rx="2"
          transform="rotate(-4 111 34)"
          className="fill-good/20 stroke-good"
          strokeWidth={1.2}
        />
        <text x="111" y="37" textAnchor="middle" className="fill-fg font-mono text-[8px]">
          keep
        </text>
      </g>
      <g className={`${A} group-hover:rotate-6`} style={{ transitionDelay: "60ms" }}>
        <rect
          x="100"
          y="54"
          width="42"
          height="28"
          rx="2"
          transform="rotate(5 121 68)"
          className="fill-accent/20 stroke-accent"
          strokeWidth={1.2}
        />
        <text x="121" y="71" textAnchor="middle" className="fill-fg font-mono text-[8px]">
          change
        </text>
      </g>
    </>
  ),

  artifacts: () => (
    <>
      {/* product backlog */}
      {[21, 27, 33].map((y, i) => (
        <rect
          key={y}
          x="26"
          y={y - 1.5}
          width={26 - i * 4}
          height="4"
          rx="1.5"
          className="fill-viz-data/60"
        />
      ))}
      {/* sprint backlog */}
      <rect
        x="26"
        y="44"
        width="22"
        height="16"
        rx="2"
        className="fill-viz-data/20 stroke-viz-data"
        strokeWidth={1.1}
      />
      <rect x="30" y="48.5" width="12" height="2" rx="1" className="fill-viz-data/70" />
      <rect x="30" y="53.5" width="8" height="2" rx="1" className="fill-viz-data/70" />
      {/* increment */}
      <rect
        x="26"
        y="68"
        width="22"
        height="16"
        rx="3"
        className="fill-viz-add/20 stroke-viz-add"
        strokeWidth={1.2}
      />
      <path d="M37 72v8M33 76h8" className="stroke-viz-add" strokeWidth={1.4} />
      {[28, 52, 76].map((y, i) => (
        <line
          key={y}
          x1="60"
          y1={y}
          x2="98"
          y2={y}
          className="stroke-line-strong"
          strokeDasharray="2 2"
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}
      {[28, 52, 76].map((y, i) => (
        <g
          key={y}
          className={`${A} group-hover:-translate-x-1.5`}
          style={{ transitionDelay: `${i * 70}ms` }}
        >
          <circle
            cx="112"
            cy={y}
            r="10"
            className="fill-accent/20 stroke-accent"
            strokeWidth={1.3}
          />
          {i === 0 && (
            <>
              <path d="M109 22v12" className="stroke-accent" strokeWidth={1.3} />
              <path d="M109 22h7l-2 3 2 3h-7z" className="fill-accent" />
            </>
          )}
          {i === 1 && (
            <>
              <circle cx="112" cy="52" r="5" className="stroke-accent" strokeWidth={1.2} />
              <circle cx="112" cy="52" r="1.8" className="fill-accent" />
            </>
          )}
          {i === 2 && (
            <path d="M107 76l3.5 3.5 6.5-7" className="stroke-accent" strokeWidth={1.6} />
          )}
        </g>
      ))}
    </>
  ),

  "user-stories": () => (
    <>
      <g className={`${A} group-hover:-rotate-3`}>
        <rect
          x="34"
          y="16"
          width="92"
          height="70"
          rx="5"
          className="fill-surface-2/70 stroke-viz-data"
          strokeWidth={1.3}
        />
        <rect x="34" y="16" width="5" height="70" rx="2" className="fill-viz-data" />
        {[
          [30, "As a", 22],
          [41, "I want", 30],
          [52, "so that", 24],
        ].map(([y, t, w]) => {
          const tx = String(t);
          return (
            <g key={tx}>
              <text x="46" y={Number(y) + 2.5} className="fill-fg font-mono text-[7px]">
                {tx}
              </text>
              <rect
                x={48 + tx.length * 4.3}
                y={Number(y) - 1}
                width={w}
                height="3"
                rx="1.5"
                className="fill-viz-data/50"
              />
            </g>
          );
        })}
        <line
          x1="44"
          y1="60"
          x2="118"
          y2="60"
          className="stroke-line-strong"
          strokeDasharray="2 2"
        />
        {[65, 75].map((y, i) => (
          <g key={y}>
            <Tick x={46} y={y} />
            <rect
              x="58"
              y={y + 2}
              width={[40, 32][i]}
              height="3"
              rx="1.5"
              className="fill-line-strong"
            />
          </g>
        ))}
      </g>
    </>
  ),

  "splitting-stories": () => {
    const layers = ["fill-viz-meta/40", "fill-viz-compute/40", "fill-viz-data/40"];
    return (
      <>
        {layers.map((c, i) => (
          <rect key={c} x="16" y={28 + i * 15} width="46" height="15" className={c} />
        ))}
        <rect
          x="16"
          y="28"
          width="46"
          height="45"
          rx="3"
          className="stroke-viz-data"
          strokeWidth={1.3}
        />
        {[28.5, 39.5, 50.5].map((x) => (
          <line
            key={x}
            x1={x + 4}
            y1="24"
            x2={x + 4}
            y2="77"
            className="stroke-fg/50"
            strokeDasharray="2 2"
          />
        ))}
        <Arrow x1={68} y1={50.5} x2={84} y2={50.5} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g
            key={i}
            className={`${A} group-hover:translate-x-1`}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {layers.map((c, j) => (
              <rect key={c} x={92 + i * 11} y={28 + j * 15} width="8" height="15" className={c} />
            ))}
            <rect
              x={92 + i * 11}
              y="28"
              width="8"
              height="45"
              rx="2"
              className={i === 0 ? "stroke-accent" : "stroke-viz-data"}
              strokeWidth={i === 0 ? 1.6 : 1.1}
            />
          </g>
        ))}
      </>
    );
  },

  "ordering-backlog": () => (
    <>
      {[20, 33, 46, 59, 72].map((y, i) =>
        i === 3 ? null : <Card key={y} x={24} y={y} w={34} h={9} />,
      )}
      <rect
        x="24"
        y="59"
        width="34"
        height="9"
        rx="2"
        className="stroke-line-strong"
        strokeDasharray="2 2"
      />
      <Card
        x={24}
        y={20}
        w={34}
        h={9}
        cls="fill-accent/30 stroke-accent"
        line="fill-accent"
        className={`${A} group-hover:-translate-y-1`}
      />
      <path d="M21 63C10 58 10 32 19 26" className="stroke-accent" strokeWidth={1.4} />
      <Head x={20} y={25} angle={Math.atan2(-6, 9)} cls="stroke-accent" />
      <path d="M84 22V80H146" className="stroke-line-strong" strokeWidth={1.2} />
      <path
        d="M86 76C108 76 122 66 138 40"
        className={`stroke-accent ${A} group-hover:-translate-y-1`}
        strokeWidth={1.8}
      />
      <text x="88" y="30" className="fill-muted font-mono text-[7px]">
        cost of delay
      </text>
      <text x="146" y="89" textAnchor="end" className="fill-muted font-mono text-[7px]">
        time
      </text>
    </>
  ),

  "kanban-wip": () => (
    <>
      {[20, 62, 104].map((x, c) => (
        <g key={x}>
          <rect
            x={x}
            y="24"
            width="38"
            height="62"
            rx="4"
            className="fill-surface-2/50 stroke-line-strong"
          />
          <rect
            x={x + 4}
            y="28"
            width="16"
            height="3"
            rx="1.5"
            className={c === 1 ? "fill-accent" : "fill-line-strong"}
          />
        </g>
      ))}
      {[36, 48, 60, 72].map((y, i) => (
        <Card
          key={y}
          x={24}
          y={y}
          w={30}
          h={9}
          className={i === 0 ? `${A} group-hover:translate-x-1.5` : ""}
        />
      ))}
      {[36, 48].map((y) => (
        <Card
          key={y}
          x={66}
          y={y}
          w={30}
          h={9}
          cls="fill-viz-compute/25 stroke-viz-compute"
          line="fill-viz-compute/70"
        />
      ))}
      <rect
        x="66"
        y="60"
        width="30"
        height="9"
        rx="2"
        className="stroke-line-strong"
        strokeDasharray="2 2"
      />
      {[36, 48, 60].map((y) => (
        <Card
          key={y}
          x={108}
          y={y}
          w={30}
          h={9}
          cls="fill-good/20 stroke-good"
          line="fill-good/70"
        />
      ))}
      <g className={`${A} group-hover:scale-110`}>
        <rect
          x="68"
          y="12"
          width="26"
          height="11"
          rx="5.5"
          className="fill-accent/20 stroke-accent"
          strokeWidth={1.2}
        />
        <text
          x="81"
          y="20"
          textAnchor="middle"
          className="fill-accent font-mono text-[7px] font-semibold"
        >
          WIP 2
        </text>
      </g>
    </>
  ),

  "reading-charts": () => {
    const xs = [88, 102.5, 117, 131.5, 146];
    const top = [60, 50, 42, 34, 26];
    const mid = [72, 64, 56, 48, 40];
    const done = [80, 76, 68, 62, 54];
    const base = [80, 80, 80, 80, 80];
    return (
      <>
        <path d="M16 22V80H74" className="stroke-line-strong" strokeWidth={1.2} />
        <path
          d="M18 36H42V28H72"
          className="stroke-viz-meta"
          strokeWidth={1.4}
          strokeDasharray="3 2"
        />
        <path d="M18 78L30 70L42 62L54 50L66 40" className="stroke-accent" strokeWidth={1.8} />
        <circle cx="66" cy="40" r="2.8" className={`fill-accent ${A} group-hover:scale-125`} />
        <polygon
          points={band(xs, top, mid)}
          className="fill-viz-data/30 stroke-viz-data"
          strokeWidth={1}
        />
        <polygon
          points={band(xs, mid, done)}
          className="fill-viz-compute/35 stroke-viz-compute"
          strokeWidth={1}
        />
        <polygon
          points={band(xs, done, base)}
          className={`fill-good/30 stroke-good ${A} group-hover:-translate-y-0.5`}
          strokeWidth={1}
        />
        <text x="45" y="90" textAnchor="middle" className="fill-muted font-mono text-[7px]">
          burnup
        </text>
        <text x="117" y="90" textAnchor="middle" className="fill-muted font-mono text-[7px]">
          flow
        </text>
      </>
    );
  },

  "choose-a-way": () => (
    <>
      <circle cx="18" cy="52" r="3" className="fill-fg" />
      <path d="M21 52H46" className="stroke-line-strong" strokeWidth={1.4} />
      <circle cx="48" cy="52" r="4" className="fill-accent" />
      <path d="M52 50C62 44 62 30 74 30" className="stroke-line-strong" strokeWidth={1.4} />
      <path d="M52 54C62 60 62 74 74 74" className="stroke-line-strong" strokeWidth={1.4} />
      <Loop
        cx={88}
        cy={30}
        r={11}
        a0={30}
        a1={320}
        cls="stroke-viz-compute"
        className={`${A} group-hover:rotate-45`}
      />
      {[78, 92, 106].map((x, i) => (
        <g
          key={x}
          className={`${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <rect
            x={x}
            y="69"
            width="10"
            height="10"
            rx="2"
            className="fill-viz-data/25 stroke-viz-data"
            strokeWidth={1.1}
          />
        </g>
      ))}
      <path d="M89 74h2M103 74h2" className="stroke-line-strong" strokeWidth={1.2} />
      <text x="106" y="33" className="fill-fg font-mono text-[8px]">
        Scrum
      </text>
      <text x="122" y="77" className="fill-fg font-mono text-[8px]">
        Kanban
      </text>
    </>
  ),

  "done-means-done": () => (
    <>
      <rect
        x="34"
        y="20"
        width="58"
        height="68"
        rx="5"
        className="fill-surface-2/70 stroke-viz-idle"
        strokeWidth={1.3}
      />
      <rect
        x="51"
        y="15"
        width="24"
        height="9"
        rx="3"
        className="fill-viz-idle/40 stroke-viz-idle"
        strokeWidth={1.1}
      />
      {[33, 45, 57, 69].map((y, i) => (
        <g key={y}>
          <Tick x={42} y={y} />
          <rect
            x="54"
            y={y + 2}
            width={[28, 22, 30, 24][i]}
            height="3"
            rx="1.5"
            className="fill-line-strong"
          />
        </g>
      ))}
      <g transform="rotate(-14 112 60)">
        <g className={`${A} group-hover:scale-110`}>
          <rect
            x="90"
            y="50"
            width="44"
            height="20"
            rx="3"
            className="fill-surface/80 stroke-accent"
            strokeWidth={1.8}
          />
          <text
            x="112"
            y="64"
            textAnchor="middle"
            className="fill-accent font-mono text-[10px] font-bold"
          >
            DONE
          </text>
        </g>
      </g>
    </>
  ),

  "small-batches": () => (
    <>
      {[20, 34, 48, 62, 76, 90, 104].map((x, i) => (
        <rect
          key={x}
          x={x}
          y="28"
          width="10"
          height="10"
          rx="2"
          className={`fill-viz-data/25 stroke-viz-data ${A} group-hover:translate-x-1.5`}
          strokeWidth={1.1}
          style={{ transitionDelay: `${i * 40}ms` }}
        />
      ))}
      <line x1="16" y1="41" x2="122" y2="41" className="stroke-line-strong" strokeWidth={1.4} />
      {[22, 42, 62, 82, 102, 118].map((x) => (
        <circle key={x} cx={x} cy="44.5" r="2.2" className="stroke-line-strong" />
      ))}
      <circle cx="136" cy="36" r="7" className="fill-good/20 stroke-good" strokeWidth={1.2} />
      <path d="M132.5 36l2.5 2.5 4.5-5" className="stroke-good" strokeWidth={1.4} />
      <rect
        x="30"
        y="56"
        width="40"
        height="26"
        rx="3"
        className="fill-viz-data/25 stroke-viz-data"
        strokeWidth={1.3}
      />
      <path d="M30 64h40M50 56v8" className="stroke-viz-data/60" />
      <line x1="16" y1="85" x2="122" y2="85" className="stroke-line-strong" strokeWidth={1.4} />
      {[22, 42, 62, 82, 102, 118].map((x) => (
        <circle key={x} cx={x} cy="88.5" r="2.2" className="stroke-line-strong" />
      ))}
      <circle
        cx="136"
        cy="74"
        r="7"
        className="stroke-viz-idle"
        strokeWidth={1.2}
        strokeDasharray="2 2"
      />
      <text x="136" y="77" textAnchor="middle" className="fill-muted font-mono text-[8px]">
        ?
      </text>
    </>
  ),

  "client-distributed": () => {
    const clock = (cx: number, h: number, m: number) => {
      const [hx, hy] = pt(cx, 38, 7, h * 30 + m / 2);
      const [mx, my] = pt(cx, 38, 10, m * 6);
      return (
        <g>
          <circle
            cx={cx}
            cy="38"
            r="14"
            className="fill-surface-2/60 stroke-viz-idle"
            strokeWidth={1.3}
          />
          <path
            d={`M${cx} 38L${hx} ${hy}M${cx} 38L${mx} ${my}`}
            className="stroke-fg"
            strokeWidth={1.4}
          />
          <circle cx={cx} cy="38" r="1.4" className="fill-fg" />
        </g>
      );
    };
    return (
      <>
        {clock(32, 9, 0)}
        {clock(128, 2, 0)}
        <circle cx="20" cy="22" r="3.5" className="fill-accent/70" />
        <path d="M140 17a5 5 0 1 0 4 8 4 4 0 0 1-4-8z" className="fill-viz-idle/70" />
        <path d="M44 46C52 58 56 62 62 64" className="stroke-line-strong" strokeDasharray="2 2" />
        <path
          d="M116 46C108 58 104 62 98 64"
          className="stroke-line-strong"
          strokeDasharray="2 2"
        />
        <g className={`${A} group-hover:-translate-y-1`}>
          <rect
            x="62"
            y="54"
            width="36"
            height="26"
            rx="3"
            className="fill-surface-2/60 stroke-accent"
            strokeWidth={1.4}
          />
          <line x1="80" y1="56" x2="80" y2="78" className="stroke-line-strong" />
          <Person x={71} y={62} s={0.8} cls="fill-viz-idle/70" />
          <Person x={89} y={62} s={0.8} cls="fill-viz-idle/70" />
          <path d="M72 84h16" className="stroke-accent" strokeWidth={1.4} />
        </g>
      </>
    );
  },

  scaling: () => (
    <>
      {[40, 80, 120].map((x, i) => (
        <g key={x}>
          <path
            d={`M${x} 46C${x} 56 80 56 80 64`}
            className="stroke-line-strong"
            strokeDasharray="2 2"
          />
          <Loop
            cx={x}
            cy={30}
            r={12}
            a0={30}
            a1={320}
            cls="stroke-viz-compute"
            className={`${A} group-hover:-translate-y-1`}
            style={{ transitionDelay: `${i * 70}ms` }}
          />
          <circle cx={x} cy={30} r={3} className="fill-viz-idle/60" />
        </g>
      ))}
      <rect
        x="56"
        y="64"
        width="48"
        height="22"
        rx="4"
        className="fill-accent/15 stroke-accent"
        strokeWidth={1.4}
      />
      {[69, 74.5, 80].map((y, i) => (
        <rect
          key={y}
          x="62"
          y={y - 1.5}
          width={34 - i * 7}
          height="3"
          rx="1.5"
          className="fill-viz-data/70"
        />
      ))}
    </>
  ),

  tools: () => (
    <>
      {[16, 60, 104].map((x, b) => (
        <g
          key={x}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${b * 70}ms` }}
        >
          <rect
            x={x}
            y={b === 1 ? 22 : 28}
            width="40"
            height="52"
            rx="4"
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1.2}
          />
          {b === 0 && <rect x={x} y={28} width="40" height="8" rx="4" className="fill-accent/60" />}
          {b === 1 &&
            [0, 1, 2].map((t) => (
              <rect
                key={t}
                x={x + 4 + t * 11}
                y={26}
                width="9"
                height="4"
                rx="2"
                className={t === 0 ? "fill-viz-meta" : "fill-viz-meta/35"}
              />
            ))}
          {b === 2 && (
            <>
              <circle cx={x + 6} cy={33} r={2} className="fill-good" />
              <rect
                x={x + 11}
                y={31.5}
                width="18"
                height="3"
                rx="1.5"
                className="fill-line-strong"
              />
            </>
          )}
          {[0, 1, 2].map((c) =>
            Array.from({ length: [3, 2, 1][c] }, (_, k) => (
              <rect
                key={`${c}-${k}`}
                x={x + 4 + c * 11.5}
                y={(b === 1 ? 22 : 28) + 16 + k * 8}
                width="9"
                height="6"
                rx="1.5"
                className={
                  c === 1 ? "fill-viz-compute/50" : c === 2 ? "fill-good/50" : "fill-viz-data/50"
                }
              />
            )),
          )}
        </g>
      ))}
    </>
  ),

  "anti-patterns": () => (
    <>
      <Loop cx={42} cy={50} r={20} a0={20} a1={330} cls="stroke-viz-idle" />
      {[80, 200, 290].map((a) => {
        const [x, y] = pt(42, 50, 20, a);
        return <circle key={a} cx={x} cy={y} r={3} className="fill-viz-idle" />;
      })}
      <Person x={42} y={46} s={0.8} cls="fill-viz-idle/40" />
      <path d="M90 66A24 24 0 0 1 138 66" className="stroke-line-strong" strokeWidth={4} />
      <path d="M126 45A24 24 0 0 1 138 66" className="stroke-accent/70" strokeWidth={4} />
      <path d="M114 66L128 50" className="stroke-fg" strokeWidth={1.6} />
      <circle cx="114" cy="66" r="2.4" className="fill-fg" />
      <g className={`${A} group-hover:scale-110`}>
        <path d="M94 34L134 74M134 34L94 74" className="stroke-bad" strokeWidth={2.4} />
      </g>
      <text x="114" y="86" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        velocity
      </text>
    </>
  ),

  "run-a-sprint": () => (
    <>
      {Array.from({ length: 10 }, (_, i) => (
        <rect
          key={i}
          x={16 + i * 13}
          y="38"
          width="11"
          height="16"
          rx="2"
          className={
            i < 5
              ? "fill-good/20 stroke-good"
              : i === 5
                ? "fill-accent/25 stroke-accent"
                : "fill-surface-2/60 stroke-line-strong"
          }
          strokeWidth={i === 5 ? 1.5 : 1.1}
        />
      ))}
      <path
        d="M88 12L81 24H86L83 34L93 20H88L91 12Z"
        className={`fill-accent ${A} group-hover:-translate-y-1`}
      />
      <path
        d="M18 62L32 65L46 68L60 71L74 73L86 74L86 68L100 71L114 76L128 80L144 84"
        className="stroke-viz-compute"
        strokeWidth={1.5}
      />
      <circle cx="86" cy="68" r="2.4" className="fill-viz-add" />
      <text x="21.5" y="91" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        day 1
      </text>
      <text x="138.5" y="91" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        day 10
      </text>
    </>
  ),

  "struggling-team": () => {
    const xs = [18, 43, 68, 93, 118];
    const top = [66, 56, 46, 36, 26];
    const mid = [72, 66, 58, 48, 40];
    const done = [78, 74, 72, 72, 72];
    const base = [82, 82, 82, 82, 82];
    return (
      <>
        <path d="M16 20V84H122" className="stroke-line-strong" strokeWidth={1.2} />
        <polygon
          points={band(xs, top, mid)}
          className="fill-viz-data/30 stroke-viz-data"
          strokeWidth={1}
        />
        <polygon
          points={band(xs, mid, done)}
          className="fill-viz-compute/35 stroke-viz-compute"
          strokeWidth={1}
        />
        <polygon
          points={band(xs, done, base)}
          className="fill-good/30 stroke-good"
          strokeWidth={1}
        />
        <path d="M68 72H118" className="stroke-bad" strokeWidth={1.8} />
        <g className={`${A} group-hover:-translate-x-1.5`}>
          <circle cx="98" cy="62" r="15" className="fill-surface/10 stroke-fg" strokeWidth={1.6} />
          <path d="M108.6 72.6L122 86" className="stroke-fg" strokeWidth={3.5} />
        </g>
      </>
    );
  },
};
