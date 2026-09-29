import type { CSSProperties } from "react";
import { A, FileIcon, type ArtMap } from "./kit";

/** Card illustrations for the RAG Systems track, keyed by module slug. */

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
  w = 1.8,
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

/** A page: bordered rectangle with `n` text lines. */
function Page({
  x,
  y,
  w,
  h,
  n = 5,
  cls = "fill-surface-2/60 stroke-line-strong",
  line = "fill-line-strong",
  className = "",
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  n?: number;
  cls?: string;
  line?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const gap = (h - 10) / Math.max(n, 1);
  return (
    <g className={className} style={style}>
      <rect x={x} y={y} width={w} height={h} rx={3} className={cls} strokeWidth={1.2} />
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          x={x + 5}
          y={y + 6 + i * gap}
          width={(w - 10) * (i === n - 1 ? 0.6 : 1)}
          height={2}
          rx={1}
          className={line}
        />
      ))}
    </g>
  );
}

/** A tick (✓) or cross (✗) mark centred at (x, y). */
function Mark({ x, y, ok, s = 3 }: { x: number; y: number; ok: boolean; s?: number }) {
  return ok ? (
    <path
      d={`M${x - s} ${y}l${s * 0.7} ${s * 0.8} ${s * 1.4} -${s * 1.6}`}
      className="stroke-viz-add"
      strokeWidth={1.5}
    />
  ) : (
    <path
      d={`M${x - s * 0.8} ${y - s * 0.8}l${s * 1.6} ${s * 1.6}M${x + s * 0.8} ${y - s * 0.8}l-${s * 1.6} ${s * 1.6}`}
      className="stroke-viz-remove"
      strokeWidth={1.5}
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
        d={`M${r2(x + r * 0.7)} ${r2(y + r * 0.7)}l${r * 0.7} ${r * 0.7}`}
        className="stroke-accent"
        strokeWidth={3}
      />
    </g>
  );
}

const T = "fill-muted font-mono text-[7px]";

export const ragSystemsArt: ArtMap = {
  "why-rag": () => (
    <>
      <rect
        x="22"
        y="32"
        width="34"
        height="44"
        rx="3"
        className="fill-viz-idle/20 stroke-viz-idle"
        strokeWidth={1.4}
      />
      <path d="M28 32v44" className="stroke-viz-idle" strokeWidth={1.4} />
      <text
        x="41"
        y="24"
        textAnchor="middle"
        className={`fill-viz-idle text-[14px] font-bold ${A} group-hover:rotate-12`}
      >
        ?
      </text>
      <Arrow x1={66} y1={54} x2={84} y2={54} className={`${A} group-hover:translate-x-1`} />
      <g className={`${A} group-hover:-translate-y-1`}>
        <path
          d="M94 34q14-5 28 1v44q-14-6-28-1zM122 35q14-6 28-1v44q-14-5-28 1z"
          className="fill-surface-2/60 stroke-viz-data"
          strokeWidth={1.4}
        />
        {[44, 52, 60, 68].map((y) => (
          <g key={y}>
            <path d={`M99 ${y}q8-2 18 0`} className="stroke-viz-data/40" />
            <path d={`M127 ${y}q8-2 18 0`} className="stroke-viz-data/40" />
          </g>
        ))}
        <rect
          x="125"
          y="48"
          width="22"
          height="8"
          rx="2"
          className={`fill-accent/40 ${A} group-hover:scale-110`}
        />
      </g>
      <text x="39" y="90" textAnchor="middle" className={T}>
        memory
      </text>
      <text x="122" y="94" textAnchor="middle" className={T}>
        your documents
      </text>
    </>
  ),

  "rag-end-to-end": () => (
    <>
      <FileIcon x={12} y={20} w={14} h={18} />
      <Arrow x1={30} y1={29} x2={40} y2={29} cls="stroke-line-strong" w={1.4} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={44 + i * 7}
          y={22 + i * 2}
          width={5}
          height={10}
          rx={1}
          className={`fill-viz-data/30 stroke-viz-data ${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${i * 50}ms` }}
        />
      ))}
      <Arrow x1={68} y1={29} x2={78} y2={40} cls="stroke-line-strong" w={1.4} />
      <rect x="12" y="62" width="38" height="14" rx="7" className="fill-accent/15 stroke-accent" />
      <text x="31" y="72" textAnchor="middle" className="fill-accent font-mono text-[7px]">
        question
      </text>
      <Arrow x1={52} y1={69} x2={78} y2={60} cls="stroke-accent" w={1.4} />
      <rect
        x="80"
        y="34"
        width="28"
        height="32"
        rx="4"
        className="fill-viz-compute/15 stroke-viz-compute"
      />
      {[
        [87, 42],
        [98, 44],
        [91, 51],
        [101, 56],
        [86, 59],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={2}
          className={i === 2 ? `fill-accent ${A} group-hover:scale-150` : "fill-viz-data/60"}
        />
      ))}
      <text x="94" y="78" textAnchor="middle" className={T}>
        index
      </text>
      <Arrow x1={110} y1={50} x2={118} y2={50} cls="stroke-accent" w={1.4} />
      <path
        d="M122 36h26a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3h-18l-6 5v-5h-2a3 3 0 0 1-3-3v-20a3 3 0 0 1 3-3z"
        className="fill-surface-2/60 stroke-line-strong"
      />
      <rect x="126" y="42" width="20" height="2" rx="1" className="fill-line-strong" />
      <rect x="126" y="48" width="14" height="2" rx="1" className="fill-line-strong" />
      <text
        x="143"
        y="58"
        textAnchor="middle"
        className={`fill-accent font-mono text-[6.5px] font-bold ${A} group-hover:-translate-y-0.5`}
      >
        [1]
      </text>
    </>
  ),

  parsing: () => (
    <>
      {[14, 92].map((x, side) => (
        <g key={x}>
          <rect
            x={x}
            y={16}
            width={54}
            height={64}
            rx={3}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1.2}
          />
          {[0, 1].map((c) =>
            [0, 1, 2, 3, 4, 5].map((r) => (
              <rect
                key={`${c}-${r}`}
                x={x + 6 + c * 24}
                y={23 + r * 9}
                width={r === 5 ? 12 : 18}
                height={2}
                rx={1}
                className={c === 0 ? "fill-viz-data/40" : "fill-viz-meta/40"}
              />
            )),
          )}
          <text x={x + 27} y={92} textAnchor="middle" className={T}>
            {side === 0 ? "naive" : "layout-aware"}
          </text>
        </g>
      ))}
      <path
        d="M18 28H62L18 37H62L18 46H62L18 55H62"
        className={`stroke-viz-remove ${A} group-hover:translate-x-0.5`}
        strokeWidth={1.4}
        strokeDasharray="3 2"
      />
      <g className={`${A} group-hover:-translate-y-0.5`}>
        <path d="M104 26V72L128 26V72" className="stroke-viz-add" strokeWidth={1.6} />
        <Head x={128} y={72} angle={Math.PI / 2} cls="stroke-viz-add" />
      </g>
    </>
  ),

  chunking: () => (
    <>
      <Page x={16} y={14} w={42} h={72} n={9} />
      {[38, 62].map((y) => (
        <path
          key={y}
          d={`M10 ${y}h54`}
          className="stroke-accent"
          strokeWidth={1.2}
          strokeDasharray="3 2"
        />
      ))}
      <Arrow x1={70} y1={50} x2={84} y2={50} />
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          className={`${A} ${["group-hover:-translate-y-1", "", "group-hover:translate-y-1"][i]}`}
        >
          <Page
            x={94}
            y={12 + i * 26}
            w={52}
            h={22}
            n={3}
            cls="fill-viz-data/15 stroke-viz-data"
            line="fill-viz-data/40"
          />
          {i > 0 && (
            <rect x={94} y={12 + i * 26} width={52} height={6} rx={2} className="fill-accent/30" />
          )}
        </g>
      ))}
      <text x="90" y="43" textAnchor="end" className="fill-accent font-mono text-[5.5px]">
        overlap
      </text>
    </>
  ),

  "metadata-freshness": () => (
    <>
      {[
        ["2023", "withdrawn", "fill-viz-remove/20 stroke-viz-remove", "fill-viz-remove", 0.5],
        ["2024", "old", "fill-viz-idle/25 stroke-viz-idle", "fill-muted", 0.75],
        ["2025", "current", "fill-viz-add/20 stroke-viz-add", "fill-viz-add", 1],
      ].map(([year, tag, pill, fg, op], i) => (
        <g
          key={year as string}
          className={i === 2 ? `${A} group-hover:translate-x-1.5` : ""}
          opacity={op as number}
        >
          <rect
            x={14}
            y={16 + i * 24}
            width={80}
            height={18}
            rx={3}
            className="fill-surface-2/60 stroke-line-strong"
          />
          <FileIcon x={19} y={17 + i * 24} w={11} h={14} />
          <rect x={36} y={21 + i * 24} width={34} height={2} rx={1} className="fill-line-strong" />
          <rect x={36} y={27 + i * 24} width={22} height={4} rx={2} className="fill-viz-meta/35" />
          <text x={75} y={29.5 + i * 24} className="fill-viz-meta font-mono text-[5.5px]">
            {year}
          </text>
          <rect x={102} y={18 + i * 24} width={44} height={14} rx={7} className={pill as string} />
          <text
            x={124}
            y={27.5 + i * 24}
            textAnchor="middle"
            className={`${fg as string} font-mono text-[6.5px]`}
          >
            {tag}
          </text>
          {i === 0 && <path d="M16 25h76" className="stroke-viz-remove" strokeWidth={1.2} />}
        </g>
      ))}
    </>
  ),

  bm25: () => (
    <>
      <text x="14" y="16" className={T}>
        q: pension scheme
      </text>
      {[
        ["pension", ["d3", "d7"], "fill-accent/30 stroke-accent"],
        ["scheme", ["d1", "d3", "d5", "d7"], "fill-viz-data/20 stroke-viz-data"],
        ["the", ["d1", "d2", "d3", "d4", "d5"], "fill-viz-idle/20 stroke-viz-idle"],
      ].map(([term, docs, c], r) => (
        <g key={term as string}>
          <rect
            x={14}
            y={24 + r * 22}
            width={44}
            height={16}
            rx={3}
            className="fill-surface-2 stroke-line-strong"
          />
          <text
            x={36}
            y={34.5 + r * 22}
            textAnchor="middle"
            className="fill-fg font-mono text-[7px]"
          >
            {term as string}
          </text>
          <path d={`M58 ${32 + r * 22}h6`} className="stroke-line-strong" strokeWidth={1.2} />
          {(docs as string[]).map((d, k) => (
            <g
              key={d}
              className={r === 0 ? `${A} group-hover:-translate-y-1` : ""}
              style={r === 0 ? { transitionDelay: `${k * 60}ms` } : undefined}
            >
              <rect
                x={66 + k * 16}
                y={25 + r * 22}
                width={13}
                height={14}
                rx={2}
                className={c as string}
              />
              <text
                x={72.5 + k * 16}
                y={34.5 + r * 22}
                textAnchor="middle"
                className="fill-fg font-mono text-[5.5px]"
              >
                {d}
              </text>
            </g>
          ))}
        </g>
      ))}
      <text x="146" y="94" textAnchor="end" className={T}>
        rare words count more
      </text>
    </>
  ),

  "embeddings-retrieval": () => (
    <>
      <path d="M20 12v74h126" className="stroke-line-strong" strokeWidth={1.2} />
      {[
        [98, 32],
        [74, 58],
        [98, 60],
        [40, 48],
        [126, 64],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5} className="fill-viz-data/60" />
      ))}
      {[
        [34, 70],
        [128, 76],
        [134, 22],
        [40, 24],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5} className="fill-viz-idle/60" />
      ))}
      <circle
        cx="86"
        cy="46"
        r="22"
        className={`fill-accent/5 stroke-accent ${A} group-hover:scale-110`}
        strokeDasharray="3 2"
      />
      {[
        [80, 40, "EN", 62, 30, "end"],
        [92, 44, "हिंदी", 112, 42, "start"],
        [84, 52, "hindi", 64, 74, "end"],
      ].map(([x, y, label, lx, ly, anchor], i) => (
        <g key={label as string}>
          <circle
            cx={x as number}
            cy={y as number}
            r={3}
            className={`fill-accent ${A} group-hover:scale-125`}
            style={{ transitionDelay: `${i * 50}ms` }}
          />
          <text
            x={lx as number}
            y={ly as number}
            textAnchor={anchor as "start" | "end"}
            className="fill-accent font-mono text-[6.5px]"
          >
            {label as string}
          </text>
        </g>
      ))}
    </>
  ),

  "vector-indexes": () => {
    const layers = [
      { y: 20, xs: [52, 112] },
      { y: 50, xs: [40, 70, 98, 124] },
      { y: 80, xs: [30, 46, 62, 80, 96, 112, 130] },
    ];
    return (
      <>
        {layers.map(({ y, xs }) => (
          <g key={y}>
            <polygon
              points={`${24},${y - 8} ${146},${y - 8} ${138},${y + 8} ${16},${y + 8}`}
              className="fill-viz-idle/10 stroke-viz-idle/50"
            />
            <path
              d={`M${xs.map((x) => `${x} ${y}`).join("L")}`}
              className="stroke-viz-data/40"
              strokeWidth={1.1}
            />
            {xs.map((x) => (
              <circle key={x} cx={x} cy={y} r={2.6} className="fill-viz-data/70" />
            ))}
          </g>
        ))}
        <path
          d="M112 20L98 50L70 50L62 80"
          className="stroke-accent"
          strokeWidth={1.8}
          strokeDasharray="3 2"
        />
        {[
          [112, 20],
          [98, 50],
          [70, 50],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={3} className="fill-accent/70" />
        ))}
        <circle cx="62" cy="80" r="4.5" className={`fill-accent ${A} group-hover:scale-150`} />
      </>
    );
  },

  "hybrid-search": () => (
    <>
      {[
        ["keyword", 14, ["A", "B", "C", "E"]],
        ["vector", 50, ["C", "D", "A", "F"]],
      ].map(([label, x, items]) => (
        <g key={label as string}>
          <text x={(x as number) + 14} y={16} textAnchor="middle" className={T}>
            {label as string}
          </text>
          {(items as string[]).map((it, r) => (
            <g key={it}>
              <rect
                x={x as number}
                y={22 + r * 16}
                width={28}
                height={12}
                rx={3}
                className={
                  it === "A" || it === "C"
                    ? "fill-viz-data/25 stroke-viz-data"
                    : "fill-viz-idle/15 stroke-viz-idle"
                }
              />
              <text
                x={(x as number) + 14}
                y={30.5 + r * 16}
                textAnchor="middle"
                className="fill-fg font-mono text-[7px]"
              >
                {it}
              </text>
            </g>
          ))}
        </g>
      ))}
      <path
        d="M42 28C70 28 80 28 96 44M78 28C88 28 90 36 96 44M78 60C88 60 90 52 96 50M42 60C70 60 80 58 96 50"
        className="stroke-line-strong"
        strokeWidth={1.1}
      />
      <Arrow x1={96} y1={47} x2={106} y2={47} w={1.6} />
      <text x="128" y="16" textAnchor="middle" className="fill-accent font-mono text-[7px]">
        fused
      </text>
      {["A", "C", "B", "D"].map((it, r) => (
        <g
          key={it}
          className={`${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${r * 50}ms` }}
        >
          <rect
            x={114}
            y={22 + r * 16}
            width={28}
            height={12}
            rx={3}
            className={r < 2 ? "fill-accent/25 stroke-accent" : "fill-accent/10 stroke-accent/50"}
          />
          <text
            x={128}
            y={30.5 + r * 16}
            textAnchor="middle"
            className="fill-fg font-mono text-[7px]"
          >
            {it}
          </text>
        </g>
      ))}
    </>
  ),

  reranking: () => {
    // left rank → right rank (null = filtered out)
    const moves = [2, 0, 3, 1, null];
    const rowY = (r: number) => 20 + r * 14;
    return (
      <>
        <text x="32" y="12" textAnchor="middle" className={T}>
          first pass
        </text>
        <text x="126" y="12" textAnchor="middle" className="fill-accent font-mono text-[7px]">
          reranked
        </text>
        {moves.map((to, from) => (
          <g key={from}>
            <rect
              x={16}
              y={rowY(from)}
              width={34}
              height={10}
              rx={2}
              className={
                to === null
                  ? "fill-viz-remove/15 stroke-viz-remove"
                  : "fill-viz-data/20 stroke-viz-data"
              }
            />
            <text
              x={11}
              y={rowY(from) + 7.5}
              textAnchor="middle"
              className="fill-subtle font-mono text-[6px]"
            >
              {from + 1}
            </text>
            {to === null ? (
              <path
                d={`M50 ${rowY(from) + 5}C70 ${rowY(from) + 5} 80 ${rowY(from) + 10} 92 ${rowY(from) + 10}`}
                className="stroke-viz-remove/60"
                strokeDasharray="2 2"
              />
            ) : (
              <path
                d={`M50 ${rowY(from) + 5}C78 ${rowY(from) + 5} 80 ${rowY(to) + 5} 108 ${rowY(to) + 5}`}
                className={to === 0 ? "stroke-accent" : "stroke-line-strong"}
                strokeWidth={to === 0 ? 1.6 : 1}
              />
            )}
          </g>
        ))}
        {[0, 1, 2, 3].map((r) => (
          <rect
            key={r}
            x={108}
            y={rowY(r)}
            width={36}
            height={10}
            rx={2}
            className={`${r === 0 ? "fill-accent/35 stroke-accent" : "fill-viz-data/20 stroke-viz-data"} ${A} group-hover:translate-x-1`}
            style={{ transitionDelay: `${r * 50}ms` }}
          />
        ))}
        <path d="M100 81h48" className="stroke-viz-remove" strokeDasharray="3 2" />
        <Mark x={96} y={rowY(4) + 10} ok={false} s={2.5} />
        <text x="148" y="92" textAnchor="end" className="fill-viz-remove font-mono text-[6px]">
          threshold
        </text>
      </>
    );
  },

  "query-understanding": () => (
    <>
      <path
        d="M14 30h46a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H30l-8 7v-7h-8a4 4 0 0 1-4-4V34a4 4 0 0 1 4-4z"
        className="fill-viz-idle/15 stroke-viz-idle"
        strokeWidth={1.3}
      />
      <text x="37" y="41" textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        and for
      </text>
      <text x="37" y="50" textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        pensioners?
      </text>
      <Arrow x1={70} y1={48} x2={84} y2={48} className={`${A} group-hover:translate-x-1`} />
      {["scheme rules", "pensioner limit", "age 60+ benefit"].map((q, i) => (
        <g
          key={q}
          className={`${A} group-hover:translate-x-1.5`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <rect
            x={88}
            y={24 + i * 18}
            width={62}
            height={13}
            rx={6.5}
            className="fill-accent/15 stroke-accent"
          />
          <text
            x={119}
            y={32.5 + i * 18}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {q}
          </text>
        </g>
      ))}
    </>
  ),

  "contextual-retrieval": () => (
    <>
      <g>
        <rect
          x="12"
          y="44"
          width="54"
          height="20"
          rx="3"
          className="fill-viz-data/15 stroke-viz-data"
        />
        <text x="39" y="57" textAnchor="middle" className="fill-fg font-mono text-[6px]">
          limit: ₹5 lakh
        </text>
        <g className={`${A} group-hover:translate-y-1`}>
          <rect
            x="12"
            y="28"
            width="54"
            height="12"
            rx="3"
            className="fill-viz-meta/25 stroke-viz-meta"
          />
          <text x="39" y="36.5" textAnchor="middle" className="fill-viz-meta font-mono text-[6px]">
            scheme A · §3
          </text>
        </g>
        <text x="39" y="80" textAnchor="middle" className={T}>
          + context
        </text>
      </g>
      <rect
        x="86"
        y="14"
        width="60"
        height="64"
        rx="4"
        className={`fill-viz-data/5 stroke-accent ${A} group-hover:scale-105`}
        strokeDasharray="3 2"
      />
      {[0, 1, 2, 3, 4, 5, 6].map((r) => (
        <rect
          key={r}
          x={92}
          y={22 + r * 8}
          width={r === 6 ? 30 : 48}
          height={2}
          rx={1}
          className="fill-viz-data/40"
        />
      ))}
      <rect x="90" y="36" width="52" height="12" rx="2" className="fill-accent/30 stroke-accent" />
      <text x="116" y="90" textAnchor="middle" className={T}>
        small → big
      </text>
    </>
  ),

  "prompt-assembly": () => (
    <>
      <rect
        x="14"
        y="12"
        width="80"
        height="76"
        rx="4"
        className="fill-surface-2/60 stroke-line-strong"
      />
      <rect
        x="20"
        y="18"
        width="68"
        height="11"
        rx="2"
        className="fill-viz-meta/25 stroke-viz-meta"
      />
      <text x="54" y="25.5" textAnchor="middle" className="fill-viz-meta font-mono text-[6px]">
        use only these
      </text>
      {[1, 2, 3].map((n, i) => (
        <g
          key={n}
          className={`${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <rect
            x={20}
            y={34 + i * 12}
            width={68}
            height={9}
            rx={2}
            className="fill-viz-data/20 stroke-viz-data"
          />
          <text x={24} y={40.5 + i * 12} className="fill-viz-data font-mono text-[6px] font-bold">
            [{n}]
          </text>
          <rect
            x={36}
            y={37.5 + i * 12}
            width={44}
            height={2}
            rx={1}
            className="fill-viz-data/40"
          />
        </g>
      ))}
      <rect x="20" y="72" width="68" height="11" rx="2" className="fill-accent/20 stroke-accent" />
      <text x="54" y="79.5" textAnchor="middle" className="fill-accent font-mono text-[6px]">
        question
      </text>
      <Arrow x1={98} y1={50} x2={108} y2={50} w={1.6} />
      <path
        d="M114 36h30a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3h-20l-6 5v-5h-4a3 3 0 0 1-3-3v-20a3 3 0 0 1 3-3z"
        className="fill-surface-2/60 stroke-line-strong"
      />
      <rect x="117" y="42" width="24" height="2" rx="1" className="fill-line-strong" />
      <rect x="117" y="48" width="16" height="2" rx="1" className="fill-line-strong" />
      <text
        x="140"
        y="58"
        textAnchor="middle"
        className={`fill-viz-data font-mono text-[6.5px] font-bold ${A} group-hover:-translate-y-0.5`}
      >
        [2]
      </text>
    </>
  ),

  "tables-sql": () => (
    <>
      <rect
        x="10"
        y="42"
        width="40"
        height="15"
        rx="7.5"
        className="fill-accent/15 stroke-accent"
      />
      <text x="30" y="52" textAnchor="middle" className="fill-accent font-mono text-[6.5px]">
        how many?
      </text>
      <Arrow x1={52} y1={46} x2={88} y2={28} cls="stroke-line-strong" w={1.2} dash="3 2" />
      <Arrow x1={52} y1={54} x2={88} y2={68} w={1.8} className={`${A} group-hover:translate-x-1`} />
      <FileIcon x={96} y={16} w={14} h={18} cls="fill-viz-idle/20 stroke-viz-idle" />
      <FileIcon x={114} y={16} w={14} h={18} cls="fill-viz-idle/20 stroke-viz-idle" />
      <text x="134" y="28" className={T}>
        text
      </text>
      {Array.from({ length: 12 }, (_, i) => {
        const c = i % 3;
        const r = Math.floor(i / 3);
        return (
          <rect
            key={i}
            x={96 + c * 17}
            y={56 + r * 8}
            width={15}
            height={6}
            rx={1}
            className={
              r === 0
                ? "fill-viz-data/50"
                : c === 2
                  ? `fill-accent/40 ${A} group-hover:scale-110`
                  : "fill-viz-data/20"
            }
          />
        );
      })}
      <text x="70" y="80" textAnchor="middle" className="fill-accent font-mono text-[7px]">
        SQL
      </text>
      <text x="120" y="96" textAnchor="middle" className={T}>
        COUNT(*)
      </text>
    </>
  ),

  graphrag: () => {
    const nodes: [number, number][] = [
      [34, 32],
      [50, 22],
      [52, 42],
      [98, 22],
      [118, 30],
      [106, 44],
      [70, 72],
      [86, 80],
      [96, 66],
    ];
    const edges = [
      [0, 1],
      [1, 2],
      [0, 2],
      [3, 4],
      [4, 5],
      [3, 5],
      [6, 7],
      [7, 8],
      [6, 8],
      [2, 6],
      [5, 8],
      [2, 3],
    ];
    return (
      <>
        {[
          [44, 32, 20],
          [107, 32, 20],
          [84, 73, 20],
        ].map(([cx, cy, r], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            className={`fill-viz-meta/10 stroke-viz-meta/70 ${A} group-hover:scale-110`}
            strokeDasharray="3 2"
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        ))}
        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            className="stroke-line-strong"
          />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.5} className="fill-viz-data stroke-surface" />
        ))}
        <rect
          x="120"
          y="66"
          width="30"
          height="20"
          rx="3"
          className="fill-viz-meta/20 stroke-viz-meta"
        />
        <rect x="124" y="71" width="22" height="2" rx="1" className="fill-viz-meta/60" />
        <rect x="124" y="76" width="16" height="2" rx="1" className="fill-viz-meta/60" />
        <text x="135" y="94" textAnchor="middle" className="fill-viz-meta font-mono text-[6px]">
          themes
        </text>
      </>
    );
  },

  "agentic-rag": () => (
    <>
      {[
        ["plan", 6, 26, "fill-viz-compute/20 stroke-viz-compute"],
        ["search", 40, 32, "fill-viz-compute/20 stroke-viz-compute"],
        ["read", 80, 26, "fill-viz-data/20 stroke-viz-data"],
        ["answer", 114, 36, "fill-accent/25 stroke-accent"],
      ].map(([label, x, w, c], i) => (
        <g key={label as string} className={i === 3 ? `${A} group-hover:scale-110` : ""}>
          <rect
            x={x as number}
            y={34}
            width={w as number}
            height={14}
            rx={7}
            className={c as string}
          />
          <text
            x={(x as number) + (w as number) / 2}
            y={43.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[6.5px]"
          >
            {label as string}
          </text>
        </g>
      ))}
      <Arrow x1={33} y1={41} x2={38} y2={41} w={1.3} cls="stroke-line-strong" />
      <Arrow x1={73} y1={41} x2={78} y2={41} w={1.3} cls="stroke-line-strong" />
      <Arrow x1={107} y1={41} x2={112} y2={41} w={1.3} />
      <g className={`${A} group-hover:translate-y-1`}>
        <path d="M93 50Q75 80 57 51" className="stroke-viz-compute" strokeWidth={1.5} />
        <Head x={57} y={51} angle={-2.05} cls="stroke-viz-compute" />
        <text x="75" y="78" textAnchor="middle" className="fill-viz-compute font-mono text-[6.5px]">
          again
        </text>
      </g>
      <text x="132" y="26" textAnchor="middle" className="fill-muted font-mono text-[6px]">
        stop
      </text>
    </>
  ),

  "multimodal-rag": () => (
    <>
      <rect
        x="24"
        y="12"
        width="62"
        height="76"
        rx="3"
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <rect x="30" y="18" width="34" height="3" rx="1.5" className="fill-line-strong" />
      <rect x="30" y="25" width="50" height="2" rx="1" className="fill-line-strong/60" />
      <path d="M32 72h46M32 72V36" className="stroke-line-strong" />
      {[14, 22, 18, 34, 26].map((h, i) => (
        <rect
          key={i}
          x={36 + i * 8}
          y={72 - h}
          width={6}
          height={h}
          className={i === 3 ? "fill-accent" : "fill-viz-data/50"}
        />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <path key={`v${i}`} d={`M${24 + (i + 1) * 10.33} 12v76`} className="stroke-viz-meta/15" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <path key={`h${i}`} d={`M24 ${12 + (i + 1) * 10.86}h62`} className="stroke-viz-meta/15" />
      ))}
      <rect x="30" y="78" width="40" height="2" rx="1" className="fill-line-strong/60" />
      <Lens x={67} y={42} r={12} className={`${A} group-hover:scale-110`} />
      <text x="124" y="44" textAnchor="middle" className={T}>
        answer is
      </text>
      <text x="124" y="54" textAnchor="middle" className={T}>
        in the chart
      </text>
    </>
  ),

  "eval-retrieval": () => {
    const hits = [0, 2, null, 1]; // rank where the right passage appeared
    return (
      <>
        {[1, 2, 3, 4, 5].map((k) => (
          <text
            key={k}
            x={37 + (k - 1) * 17}
            y={18}
            textAnchor="middle"
            className="fill-subtle font-mono text-[6px]"
          >
            {k}
          </text>
        ))}
        {hits.map((hit, r) => (
          <g key={r}>
            <text
              x={24}
              y={32 + r * 16}
              textAnchor="end"
              className="fill-muted font-mono text-[6.5px]"
            >
              q{r + 1}
            </text>
            {[0, 1, 2, 3, 4].map((c) => (
              <rect
                key={c}
                x={30 + c * 17}
                y={23 + r * 16}
                width={14}
                height={12}
                rx={2}
                className={
                  c === hit
                    ? "fill-viz-add/20 stroke-viz-add"
                    : "fill-viz-idle/10 stroke-viz-idle/40"
                }
              />
            ))}
            {hit === null ? (
              <g className={`${A} group-hover:scale-125`}>
                <Mark x={124} y={29 + r * 16} ok={false} s={2.8} />
              </g>
            ) : (
              <g
                className={`${A} group-hover:scale-125`}
                style={{ transitionDelay: `${r * 50}ms` }}
              >
                <Mark x={37 + hit * 17} y={29.5 + r * 16} ok s={3} />
              </g>
            )}
          </g>
        ))}
        <text x="72" y="96" textAnchor="middle" className={T}>
          recall@5 = 3/4
        </text>
      </>
    );
  },

  "eval-answers": () => (
    <>
      <rect
        x="12"
        y="18"
        width="60"
        height="64"
        rx="4"
        className="fill-surface-2/60 stroke-line-strong"
      />
      <text x="42" y="14" textAnchor="middle" className={T}>
        answer
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={18}
          y={30 + i * 18}
          width={44}
          height={5}
          rx={2}
          className={i === 2 ? "fill-viz-remove/40" : "fill-viz-add/40"}
        />
      ))}
      {[
        [32.5, 34],
        [50.5, 62],
      ].map(([y1, y2], i) => (
        <path
          key={i}
          d={`M62 ${y1}C82 ${y1} 88 ${y2} 106 ${y2}`}
          className={`stroke-viz-add ${A} group-hover:opacity-100`}
          strokeWidth={1.4}
          opacity={0.7}
        />
      ))}
      <Mark x={67} y={68.5} ok={false} s={2.5} />
      <text x="18" y="78" className="fill-viz-remove font-mono text-[6px]">
        no source
      </text>
      {[24, 52].map((y, i) => (
        <g
          key={y}
          className={`${A} group-hover:-translate-x-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <Page
            x={106}
            y={y}
            w={40}
            h={20}
            n={3}
            cls="fill-viz-data/15 stroke-viz-data"
            line="fill-viz-data/40"
          />
        </g>
      ))}
      <text x="126" y="18" textAnchor="middle" className={T}>
        sources
      </text>
    </>
  ),

  "rag-security": () => (
    <>
      <path
        d="M34 16l20 7v15c0 14-8 22-20 27-12-5-20-13-20-27V23z"
        className="fill-accent/15 stroke-accent"
        strokeWidth={1.5}
      />
      <g className={`${A} group-hover:-translate-y-0.5`}>
        <rect x="27" y="35" width="14" height="11" rx="2" className="fill-accent" />
        <path d="M30 35v-4a4 4 0 0 1 8 0v4" className="stroke-accent" strokeWidth={1.5} />
      </g>
      {[0, 1, 2].map((i) => (
        <FileIcon
          key={i}
          x={76 + i * 24}
          y={14}
          w={16}
          h={20}
          cls={
            i === 1 ? "fill-viz-remove/15 stroke-viz-remove" : "fill-viz-data/20 stroke-viz-data"
          }
        />
      ))}
      <text x="108" y="28" textAnchor="middle" className="fill-viz-remove text-[8px] font-bold">
        ₹
      </text>
      <text x="108" y="44" textAnchor="middle" className="fill-viz-remove font-mono text-[6px]">
        salaries
      </text>
      <rect
        x="62"
        y="54"
        width="86"
        height="32"
        rx="3"
        className="fill-surface-2/60 stroke-line-strong"
      />
      <rect x="68" y="60" width="72" height="2" rx="1" className="fill-line-strong" />
      <rect x="66" y="66" width="78" height="9" rx="2" className="fill-viz-remove/15" />
      <text x="70" y="72.5" className="fill-viz-remove font-mono text-[5.5px]">
        ignore your rules…
      </text>
      <path
        d="M68 70.5h72"
        className={`stroke-viz-remove ${A} opacity-0 group-hover:opacity-100`}
        strokeWidth={1.2}
      />
      <rect x="68" y="79" width="48" height="2" rx="1" className="fill-line-strong" />
      <text x="34" y="82" textAnchor="middle" className={T}>
        data, not
      </text>
      <text x="34" y="91" textAnchor="middle" className={T}>
        commands
      </text>
    </>
  ),

  "platforms-cost": () => (
    <>
      <path d="M18 10v76h86" className="stroke-line-strong" strokeWidth={1.2} />
      <text x="61" y="96" textAnchor="middle" className="fill-subtle font-mono text-[6px]">
        convenience →
      </text>
      <text
        x="11"
        y="48"
        textAnchor="middle"
        transform="rotate(-90 11 48)"
        className="fill-subtle font-mono text-[6px]"
      >
        control →
      </text>
      {[
        [28, 20, "pgvector", "fill-viz-data"],
        [48, 36, "Qdrant", "fill-viz-data"],
        [36, 54, "OpenSearch", "fill-viz-data"],
        [94, 74, "managed", "fill-viz-compute"],
      ].map(([x, y, label, c], i) => (
        <g key={label as string}>
          <circle
            cx={x as number}
            cy={y as number}
            r={4}
            className={`${c as string} ${A} group-hover:scale-125`}
            style={{ transitionDelay: `${i * 50}ms` }}
          />
          <text
            x={(x as number) + (i === 3 ? -7 : 7)}
            y={(y as number) + 2}
            textAnchor={i === 3 ? "end" : "start"}
            className="fill-muted font-mono text-[6px]"
          >
            {label as string}
          </text>
        </g>
      ))}
      <text x="118" y="12" textAnchor="middle" className={T}>
        cost
      </text>
      {[
        ["embed", 10, "fill-viz-compute/30"],
        ["store", 12, "fill-viz-data/40"],
        ["query", 16, "fill-viz-compute/55"],
        ["generate", 30, "fill-accent/60"],
      ].map(([label, h, c], i, all) => {
        const below = all.slice(i + 1).reduce((s, a) => s + (a[1] as number), 0);
        const y = 86 - below - (h as number);
        return (
          <g key={label as string}>
            <rect
              x={110}
              y={y}
              width={16}
              height={h as number}
              className={`${c as string} ${A} origin-bottom group-hover:scale-y-110`}
            />
            <text
              x={129}
              y={y + (h as number) / 2 + 2}
              className="fill-subtle font-mono text-[5px]"
            >
              {label as string}
            </text>
          </g>
        );
      })}
    </>
  ),

  "scheme-assistant": () => (
    <>
      <rect
        x="16"
        y="10"
        width="128"
        height="80"
        rx="6"
        className="fill-surface-2/40 stroke-line-strong"
      />
      <rect x="74" y="18" width="62" height="14" rx="7" className="fill-accent/20 stroke-accent" />
      <text x="105" y="27.5" textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        am I eligible?
      </text>
      <rect x="84" y="36" width="52" height="14" rx="7" className="fill-accent/20 stroke-accent" />
      <text x="110" y="45.5" textAnchor="middle" className="fill-fg text-[6.5px]">
        क्या मैं पात्र हूँ?
      </text>
      <g className={`${A} group-hover:-translate-y-1`}>
        <rect
          x="24"
          y="56"
          width="78"
          height="26"
          rx="6"
          className="fill-viz-data/15 stroke-viz-data"
        />
        <rect x="30" y="62" width="56" height="2" rx="1" className="fill-viz-data/50" />
        <rect x="30" y="68" width="44" height="2" rx="1" className="fill-viz-data/50" />
        <text x="84" y="77" className="fill-viz-data font-mono text-[6.5px] font-bold">
          [1]
        </text>
      </g>
      <FileIcon x={114} y={62} w={14} h={18} />
      <path d="M102 71h10" className="stroke-viz-data/60" strokeDasharray="2 2" />
    </>
  ),

  "wrong-answers": () => (
    <>
      {["parse", "chunk", "search", "rerank", "prompt"].map((s, i) => (
        <g key={s}>
          <rect
            x={8 + i * 30}
            y={22}
            width={24}
            height={16}
            rx={3}
            className={
              i === 2 ? "fill-viz-remove/20 stroke-viz-remove" : "fill-viz-add/10 stroke-viz-add/60"
            }
          />
          <text
            x={20 + i * 30}
            y={32.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {s}
          </text>
          {i < 4 && <path d={`M${32 + i * 30} 30h6`} className="stroke-line-strong" />}
          <rect
            x={10 + i * 30}
            y={44}
            width={i === 2 ? 20 : 8 + ((i * 5) % 12)}
            height={3}
            rx={1.5}
            className={i === 2 ? "fill-viz-remove/60" : "fill-viz-idle/50"}
          />
        </g>
      ))}
      <Lens x={80} y={30} r={15} className={`${A} group-hover:scale-110`} />
      <path d="M80 56v8" className="stroke-viz-remove" strokeWidth={1.2} strokeDasharray="2 2" />
      <path
        d="M52 66h56a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H62l-6 5v-5h-4a3 3 0 0 1-3-3v-12a3 3 0 0 1 3-3z"
        className="fill-viz-remove/10 stroke-viz-remove"
      />
      <rect x="56" y="72" width="36" height="2" rx="1" className="fill-viz-remove/50" />
      <rect x="56" y="77" width="24" height="2" rx="1" className="fill-viz-remove/50" />
      <Mark x={101} y={75} ok={false} s={3} />
    </>
  ),
};
