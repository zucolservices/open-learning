import { A, type ArtMap } from "./kit";
import { Arrow, Cell, Db, Row, T } from "./streaming-data-a";

/** Card illustrations for the Streaming Data Systems track (modules 13–23), keyed by module slug. */

export const streamingDataArtB: ArtMap = {
  windows: () => (
    <>
      <line x1={12} y1={70} x2={150} y2={70} className="stroke-line-strong" strokeWidth={1.2} />
      {[0, 1, 2].map((w) => (
        <rect
          key={w}
          x={14 + w * 45}
          y={30}
          width={42}
          height={34}
          rx={4}
          className={
            w === 1
              ? `fill-viz-meta/15 stroke-viz-meta ${A} group-hover:scale-105`
              : "fill-surface-2/50 stroke-line-strong"
          }
          strokeWidth={1.3}
        />
      ))}
      {[22, 32, 46, 66, 74, 84, 92, 116, 130].map((x, i) => (
        <circle key={i} cx={x} cy={50 + ((i * 7) % 10) - 5} r={3} className="fill-viz-data" />
      ))}
      {["3", "4", "2"].map((n, w) => (
        <text
          key={w}
          x={35 + w * 45}
          y={84}
          textAnchor="middle"
          className="fill-fg font-mono text-[7px]"
        >
          {n}
        </text>
      ))}
      <text x={14} y={24} className={T}>
        tumbling, 5 min
      </text>
    </>
  ),

  "state-joins": () => (
    <>
      <Row x={8} y={24} n={3} w={11} gap={2} cls={() => "fill-viz-data/25 stroke-viz-data"} />
      <Row x={8} y={66} n={3} w={11} gap={2} cls={() => "fill-viz-compute/25 stroke-viz-compute"} />
      <Arrow x1={48} y1={30} x2={66} y2={44} />
      <Arrow x1={48} y1={72} x2={66} y2={58} />
      <rect
        x={68}
        y={34}
        width={40}
        height={34}
        rx={4}
        className="fill-surface-2/70 stroke-line-strong"
        strokeWidth={1.3}
      />
      <text x={88} y={46} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        join
      </text>
      <Db x={88} y={52} w={18} h={8} cls="stroke-viz-meta" fill="fill-viz-meta/20" />
      <g className={`${A} group-hover:translate-x-2`}>
        <Arrow x1={110} y1={51} x2={128} y2={51} />
        <Cell x={130} y={45} w={14} h={12} cls="fill-viz-add/25 stroke-viz-add" />
      </g>
      <text x={88} y={84} textAnchor="middle" className={T}>
        state store
      </text>
    </>
  ),

  checkpoints: () => (
    <>
      <Row x={10} y={46} n={9} w={11} gap={3} cls={() => "fill-viz-data/25 stroke-viz-data"} />
      {[52, 108].map((x) => (
        <path key={x} d={`M${x} 36v32`} className="stroke-viz-meta" strokeWidth={2} />
      ))}
      <rect
        x={42}
        y={74}
        width={22}
        height={16}
        rx={3}
        className="fill-viz-meta/15 stroke-viz-meta"
        strokeWidth={1.2}
      />
      <circle cx={53} cy={82} r={4} className="stroke-viz-meta" strokeWidth={1.2} />
      <g className={`${A} group-hover:translate-y-1`}>
        <rect
          x={98}
          y={74}
          width={22}
          height={16}
          rx={3}
          className="fill-viz-meta/15 stroke-viz-meta"
          strokeWidth={1.2}
        />
        <circle cx={109} cy={82} r={4} className="stroke-viz-meta" strokeWidth={1.2} />
      </g>
      <text x={10} y={28} className={T}>
        barriers → snapshots
      </text>
    </>
  ),

  "streaming-sql": () => (
    <>
      <rect
        x={10}
        y={20}
        width={76}
        height={50}
        rx={4}
        className="fill-surface-2/70 stroke-line-strong"
        strokeWidth={1.2}
      />
      {["SELECT city,", "  COUNT(*)", "FROM pay", "GROUP BY city"].map((l, i) => (
        <text
          key={i}
          x={15}
          y={32 + i * 10}
          className={
            i === 0 || i === 3
              ? "fill-viz-compute font-mono text-[6.5px]"
              : "fill-fg font-mono text-[6.5px]"
          }
        >
          {l}
        </text>
      ))}
      <Arrow x1={90} y1={45} x2={102} y2={45} />
      {[
        ["Pune", 41],
        ["Delhi", 58],
        ["Kochi", 23],
      ].map(([c, n], i) => (
        <g key={c as string}>
          <text x={106} y={32 + i * 13} className={T}>
            {c}
          </text>
          <text
            x={150}
            y={32 + i * 13}
            textAnchor="end"
            className={`fill-fg font-mono text-[7px] ${i === 1 ? `${A} group-hover:-translate-y-0.5` : ""}`}
          >
            {n}
          </text>
        </g>
      ))}
      <text x={106} y={80} className={T}>
        always updating
      </text>
    </>
  ),

  "backpressure-lag": () => (
    <>
      <Arrow x1={10} y1={30} x2={44} y2={30} cls="stroke-viz-data" />
      <text x={10} y={24} className={T}>
        in 7×
      </text>
      <rect
        x={48}
        y={22}
        width={48}
        height={60}
        rx={4}
        className="stroke-line-strong"
        strokeWidth={1.3}
      />
      <rect
        x={50}
        y={44}
        width={44}
        height={36}
        rx={2}
        className={`fill-viz-data/30 ${A} group-hover:-translate-y-2`}
      />
      <text x={72} y={92} textAnchor="middle" className={T}>
        lag
      </text>
      <Arrow x1={100} y1={74} x2={128} y2={74} cls="stroke-viz-compute" />
      <text x={110} y={68} className={T}>
        out
      </text>
      <path d="M128 38l8-8 8 8" className="stroke-viz-remove" strokeWidth={1.4} />
      <path d="M136 30v20" className="stroke-viz-remove" strokeWidth={1.4} />
    </>
  ),

  "errors-dlq": () => (
    <>
      <Row x={10} y={36} n={3} w={12} gap={2} cls={() => "fill-viz-add/25 stroke-viz-add"} />
      <Cell
        x={52}
        y={36}
        w={12}
        h={12}
        cls={`fill-viz-remove/30 stroke-viz-remove ${A} group-hover:translate-y-8`}
      />
      <Row x={66} y={36} n={5} w={12} gap={2} cls={() => "fill-surface-2 stroke-line-strong"} />
      <path d="M58 52v18h36" className="stroke-viz-meta" strokeDasharray="3 2" strokeWidth={1.3} />
      <rect
        x={94}
        y={62}
        width={58}
        height={18}
        rx={3}
        className="fill-viz-meta/15 stroke-viz-meta"
        strokeWidth={1.3}
      />
      <text x={123} y={74} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        dead letters
      </text>
      <text x={10} y={26} className={T}>
        retry, then park
      </text>
    </>
  ),

  "sizing-cost": () => (
    <>
      {[
        [30, 22],
        [52, 48],
        [74, 34],
        [96, 62],
        [118, 40],
      ].map(([x, h], i) => (
        <rect
          key={i}
          x={x}
          y={80 - h}
          width={16}
          height={h}
          rx={2}
          className={
            i === 3
              ? `fill-viz-remove/30 stroke-viz-remove ${A} group-hover:-translate-y-1`
              : "fill-viz-compute/20 stroke-viz-compute"
          }
          strokeWidth={1.2}
        />
      ))}
      <line x1={22} y1={80} x2={142} y2={80} className="stroke-line-strong" strokeWidth={1.2} />
      <text x={22} y={92} className={T}>
        $ / month per platform
      </text>
      <text x={104} y={14} textAnchor="middle" className="fill-viz-remove font-mono text-[6.5px]">
        cross-zone
      </text>
    </>
  ),

  "streams-to-lakehouse": () => (
    <>
      <Row x={8} y={20} n={4} w={9} gap={2} cls={() => "fill-viz-data/25 stroke-viz-data"} />
      <Arrow x1={52} y1={25} x2={66} y2={36} />
      <rect
        x={60}
        y={38}
        width={86}
        height={48}
        rx={4}
        className="fill-surface-2/50 stroke-line-strong"
        strokeWidth={1.3}
      />
      <g className={`${A} group-hover:opacity-0`}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            x={66 + (i % 6) * 13}
            y={46 + Math.floor(i / 6) * 12}
            width={9}
            height={8}
            rx={1}
            className="fill-viz-data/30 stroke-viz-data"
          />
        ))}
      </g>
      <g className={`${A} opacity-0 group-hover:opacity-100`}>
        <rect
          x={66}
          y={46}
          width={36}
          height={20}
          rx={2}
          className="fill-viz-data/30 stroke-viz-data"
        />
        <rect
          x={106}
          y={46}
          width={34}
          height={20}
          rx={2}
          className="fill-viz-data/30 stroke-viz-data"
        />
      </g>
      <text x={103} y={80} textAnchor="middle" className={T}>
        table · compaction
      </text>
    </>
  ),

  "realtime-analytics": () => (
    <>
      <rect
        x={14}
        y={18}
        width={96}
        height={66}
        rx={5}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.3}
      />
      {[18, 30, 24, 40, 34, 46].map((h, i) => (
        <rect
          key={i}
          x={24 + i * 14}
          y={74 - h}
          width={9}
          height={h}
          rx={1.5}
          className={
            i === 5
              ? `fill-viz-compute/40 stroke-viz-compute ${A} group-hover:-translate-y-1`
              : "fill-viz-compute/20 stroke-viz-compute"
          }
        />
      ))}
      <circle cx={134} cy={50} r={14} className="stroke-viz-add" strokeWidth={1.4} />
      <path d="M134 42v8l5 4" className="stroke-viz-add" strokeWidth={1.4} />
      <text x={134} y={76} textAnchor="middle" className="fill-viz-add font-mono text-[7px]">
        ~1 s
      </text>
    </>
  ),

  "event-patterns": () => (
    <>
      <rect
        x={10}
        y={18}
        width={62}
        height={66}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      {["+5,000", "−1,200", "+300", "−800", "+800"].map((l, i) => (
        <text
          key={i}
          x={16}
          y={30 + i * 10}
          className={
            l.startsWith("+")
              ? "fill-viz-add font-mono text-[6.5px]"
              : "fill-viz-remove font-mono text-[6.5px]"
          }
        >
          {l}
        </text>
      ))}
      <path d="M14 80h54" className="stroke-line-strong" />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={86 + i * 24}
          y={30}
          width={18}
          height={14}
          rx={3}
          className="fill-viz-add/20 stroke-viz-add"
          strokeWidth={1.2}
        />
      ))}
      <path d="M106 37h4M130 37h4" className="stroke-line-strong" />
      <path
        d="M138 52q-26 18-48 0"
        className={`stroke-viz-remove ${A} group-hover:-translate-y-1`}
        strokeDasharray="3 2"
        strokeWidth={1.3}
      />
      <path d="M94 48l-4 4 5 2" className="stroke-viz-remove" strokeWidth={1.3} />
      <text x={114} y={76} textAnchor="middle" className={T}>
        saga · undo
      </text>
    </>
  ),

  "capstone-payments": () => (
    <>
      <rect
        x={10}
        y={30}
        width={22}
        height={38}
        rx={4}
        className="fill-surface-2 stroke-line-strong"
        strokeWidth={1.3}
      />
      <text x={21} y={52} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        ₹
      </text>
      <Arrow x1={36} y1={49} x2={50} y2={49} />
      <Row x={52} y={43} n={3} w={11} gap={2} cls={() => "fill-viz-data/25 stroke-viz-data"} />
      <Arrow x1={92} y1={49} x2={106} y2={49} />
      <path
        d="M118 32l14 5v12c0 9-6 14-14 18-8-4-14-9-14-18V37z"
        className={`fill-viz-add/15 stroke-viz-add ${A} group-hover:scale-110`}
        strokeWidth={1.4}
      />
      <path d="M112 49l4 4 8-8" className="stroke-viz-add" strokeWidth={1.6} />
      <text x={80} y={86} textAnchor="middle" className={T}>
        design it, then break it
      </text>
    </>
  ),
};
