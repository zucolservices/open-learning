import { A, type ArtMap } from "./kit";
import { Arrow, Cell, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Apache Spark track (modules 12–21), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";

export const sparkArtB: ArtMap = {
  "tungsten-vectorised": () => (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={16 + i * 9} cy={22} r={2.5} className="fill-viz-idle" />
      ))}
      <text x={10} y={36} className="fill-muted font-mono text-[6px]">
        row, row, row…
      </text>
      <rect
        x={86}
        y={14}
        width={64}
        height={22}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.1}
      />
      {[0, 1, 2, 3].map((c) => (
        <line
          key={c}
          x1={96 + c * 14}
          y1={18}
          x2={96 + c * 14}
          y2={32}
          className="stroke-accent"
          strokeWidth={2}
        />
      ))}
      <Mono x={10} y={60} text="*(1) Filter → Project → Agg" cls="fill-accent" />
      <text x={10} y={88} className={T}>
        fused loops, column batches
      </text>
    </>
  ),

  skew: () => (
    <>
      {[10, 12, 9, 64, 11, 10, 12].map((h, i) => (
        <rect
          key={i}
          x={14 + i * 19}
          y={74 - h}
          width={14}
          height={h}
          rx={2}
          className={i === 3 ? `fill-bad/40 stroke-bad ${A} group-hover:scale-y-90` : DATA}
          strokeWidth={1}
        />
      ))}
      <text x={10} y={90} className={T}>
        one key, one slow task
      </text>
    </>
  ),

  "memory-spill": () => (
    <>
      <rect x={10} y={14} width={140} height={18} rx={3} className={BOX} strokeWidth={1} />
      <rect x={10} y={14} width={34} height={18} rx={3} className="fill-viz-meta/40" />
      <rect x={44} y={14} width={106} height={18} className="fill-viz-compute/40" />
      <text x={14} y={26} className="fill-fg font-mono text-[6px]">
        storage
      </text>
      <text x={84} y={26} className="fill-fg font-mono text-[6px]">
        execution (full)
      </text>
      <Arrow
        x1={110}
        y1={34}
        x2={110}
        y2={52}
        cls="stroke-bad"
        className={`${A} group-hover:translate-y-0.5`}
      />
      <path
        d="M96 54 v10 a14 3 0 0 0 28 0 v-10"
        className="fill-bad/15 stroke-bad"
        strokeWidth={1}
      />
      <ellipse cx={110} cy={54} rx={14} ry={3} className="fill-bad/15 stroke-bad" strokeWidth={1} />
      <text x={10} y={60} className="fill-muted font-mono text-[6px]">
        spill to disk
      </text>
      <text x={10} y={90} className={T}>
        slow, but it finishes
      </text>
    </>
  ),

  "spark/caching": () => (
    <>
      <Svc x={10} y={34} w={34} h={16} label="2 h join" cls={BOX} />
      <Arrow x1={46} y1={42} x2={62} y2={42} />
      <rect
        x={64}
        y={30}
        width={30}
        height={24}
        rx={4}
        className={`fill-viz-meta/25 stroke-viz-meta ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={79} y={45} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        cache
      </text>
      {["report", "model", "export"].map((l, i) => (
        <g key={l}>
          <Arrow x1={96} y1={42} x2={114} y2={20 + i * 22} />
          <Svc x={116} y={14 + i * 22} w={34} h={12} label={l} />
        </g>
      ))}
      <text x={10} y={92} className={T}>
        compute once, reuse
      </text>
    </>
  ),

  "files-io": () => (
    <>
      {["2024", "2025", "2026"].map((y, i) => (
        <g key={y} className={i === 2 ? `${A} group-hover:-translate-y-0.5` : "opacity-50"}>
          <path
            d={`M${12 + i * 48} 18 h14 l4 4 h22 v28 h-40 z`}
            className={i === 2 ? HOT : BOX}
            strokeWidth={1}
          />
          <text x={32 + i * 48} y={40} textAnchor="middle" className="fill-fg font-mono text-[6px]">
            {y}/
          </text>
        </g>
      ))}
      <Mono x={12} y={66} text="PartitionFilters: [date = …]" cls="fill-accent" />
      <text x={10} y={90} className={T}>
        read only what you need
      </text>
    </>
  ),

  "structured-streaming": () => (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <Cell
          key={i}
          x={10}
          y={8 + i * 10}
          w={40}
          h={8}
          cls={i >= 5 ? `${HOT} ${A} group-hover:translate-x-0.5` : DATA}
        />
      ))}
      <Arrow x1={56} y1={42} x2={84} y2={42} />
      <rect x={88} y={26} width={62} height={32} rx={4} className={BOX} strokeWidth={1} />
      <text x={119} y={40} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        running counts
      </text>
      <text x={119} y={50} textAnchor="middle" className="fill-muted font-mono text-[5.5px]">
        + only new rows
      </text>
      <text x={10} y={94} className={T}>
        a table that keeps growing
      </text>
    </>
  ),

  "pyspark-udfs": () => (
    <>
      <rect x={10} y={20} width={48} height={40} rx={6} className={DATA} strokeWidth={1.1} />
      <text x={34} y={43} textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        JVM
      </text>
      <rect
        x={102}
        y={20}
        width={48}
        height={40}
        rx={6}
        className="fill-viz-compute/15 stroke-viz-compute"
        strokeWidth={1.1}
      />
      <text x={126} y={43} textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        Python
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={64 + i * 12}
          y={30}
          width={9}
          height={7}
          rx={1}
          className={`fill-accent ${A} group-hover:translate-x-1`}
        />
      ))}
      <text x={80} y={52} textAnchor="middle" className="fill-muted font-mono text-[5.5px]">
        Arrow
      </text>
      <text x={10} y={88} className={T}>
        batches, not rows
      </text>
    </>
  ),

  "spark-platforms": () => (
    <>
      {["you", "you", "provider", "provider"].map((w, i) => (
        <rect
          key={i}
          x={10}
          y={14 + i * 14}
          width={60}
          height={11}
          rx={2}
          className={w === "you" ? HOT : BOX}
          strokeWidth={1}
        />
      ))}
      {["self", "managed", "serverless"].map((l, i) => (
        <Svc
          key={l}
          x={86}
          y={14 + i * 20}
          w={64}
          h={14}
          label={l}
          cls={i === 1 ? HOT : BOX}
          className={i === 1 ? `${A} group-hover:translate-x-0.5` : ""}
        />
      ))}
      <text x={10} y={90} className={T}>
        own, lease or taxi
      </text>
    </>
  ),

  "cost-scaling": () => (
    <>
      <rect
        x={10}
        y={14}
        width={140}
        height={50}
        rx={3}
        className="stroke-line-strong fill-none"
        strokeDasharray="3 2"
      />
      {[48, 10, 30].map((h, i) => (
        <rect
          key={i}
          x={14 + [0, 30, 110][i]}
          y={62 - h}
          width={[28, 78, 32][i]}
          height={h}
          rx={2}
          className={
            i === 1 ? `fill-viz-compute/40 ${A} group-hover:scale-y-110` : "fill-viz-compute/40"
          }
        />
      ))}
      <text x={10} y={80} className="fill-muted font-mono text-[6px]">
        pay for the work, not the peak
      </text>
      <text x={10} y={94} className={T}>
        scale with the stages
      </text>
    </>
  ),

  "capstone-spark": () => (
    <>
      <rect x={10} y={20} width={140} height={10} rx={3} className="fill-bad/30" />
      <rect
        x={10}
        y={40}
        width={36}
        height={10}
        rx={3}
        className={`fill-good/50 ${A} group-hover:scale-x-105`}
      />
      <line x1={94} y1={14} x2={94} y2={56} className="stroke-fg" strokeWidth={1} />
      <text x={96} y={62} className="fill-muted font-mono text-[6px]">
        06:00
      </text>
      <text x={10} y={16} className="fill-muted font-mono text-[6px]">
        10 h
      </text>
      <text x={50} y={48} className="fill-good font-mono text-[6px]">
        2 h
      </text>
      <text x={10} y={88} className={T}>
        five fixes, back on time
      </text>
    </>
  ),
};
