import { A, type ArtMap } from "./kit";
import { Arrow, Cell, Row, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Apache Spark track (modules 1–11), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const CPU = "fill-viz-compute/20 stroke-viz-compute";

export const sparkArtA: ArtMap = {
  "why-spark": () => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Svc x={10 + i * 26} y={14} w={20} h={12} label="map" cls={BOX} />
          <path
            d={`M${14 + i * 26} 30 v6 a6 2 0 0 0 12 0 v-6`}
            className="fill-viz-idle/30 stroke-viz-idle"
            strokeWidth={0.9}
          />
        </g>
      ))}
      <text x={10} y={52} className="fill-muted font-mono text-[6px]">
        disk between every step
      </text>
      <rect
        x={96}
        y={16}
        width={54}
        height={30}
        rx={6}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={123} y={34} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        in memory
      </text>
      <text x={10} y={88} className={T}>
        keep data close, reuse it
      </text>
    </>
  ),

  "spark/cluster-anatomy": () => (
    <>
      <Svc
        x={62}
        y={8}
        w={36}
        h={16}
        label="driver"
        cls={HOT}
        className={`${A} group-hover:-translate-y-0.5`}
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line
            x1={80}
            y1={24}
            x2={30 + i * 50}
            y2={44}
            className="stroke-line-strong"
            strokeWidth={1}
          />
          <rect
            x={10 + i * 50}
            y={44}
            width={40}
            height={30}
            rx={4}
            className={BOX}
            strokeWidth={1.1}
          />
          <Row x={14 + i * 50} y={56} n={3} w={9} gap={3} cls={() => CPU} />
          <text
            x={30 + i * 50}
            y={52}
            textAnchor="middle"
            className="fill-muted font-mono text-[5px]"
          >
            executor
          </text>
        </g>
      ))}
      <text x={10} y={92} className={T}>
        one driver, many executors
      </text>
    </>
  ),

  "rdds-dataframes": () => (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={10}
          y={14 + i * 16}
          width={40}
          height={12}
          rx={6}
          className={BOX}
          strokeWidth={1}
        />
      ))}
      <text x={30} y={70} textAnchor="middle" className="fill-muted font-mono text-[6px]">
        objects
      </text>
      <Arrow x1={56} y1={38} x2={78} y2={38} className={`${A} group-hover:translate-x-1`} />
      <rect x={84} y={14} width={66} height={44} rx={3} className={HOT} strokeWidth={1.1} />
      {["id", "city", "amt"].map((c, i) => (
        <text key={c} x={92 + i * 20} y={24} className="fill-accent font-mono text-[6px]">
          {c}
        </text>
      ))}
      {[0, 1, 2].map((r) => (
        <line
          key={r}
          x1={86}
          y1={32 + r * 9}
          x2={148}
          y2={32 + r * 9}
          className="stroke-line"
          strokeWidth={0.6}
        />
      ))}
      <text x={10} y={88} className={T}>
        add a schema, get an optimiser
      </text>
    </>
  ),

  "lazy-evaluation": () => (
    <>
      {["read", "filter", "select"].map((l, i) => (
        <Svc
          key={l}
          x={10 + i * 34}
          y={22}
          w={28}
          h={14}
          label={l}
          cls="fill-surface-2/40 stroke-line-strong"
          className="opacity-60"
        />
      ))}
      <Svc
        x={112}
        y={22}
        w={38}
        h={14}
        label="count()"
        cls={HOT}
        className={`${A} group-hover:scale-110`}
      />
      <Arrow x1={10} y1={50} x2={148} y2={50} cls="stroke-accent" dash="3 2" />
      <text x={10} y={64} className="fill-muted font-mono text-[6px]">
        nothing runs until an action
      </text>
      <text x={10} y={88} className={T}>
        plans now, work later
      </text>
    </>
  ),

  partitions: () => (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={10 + i * 18}
          y={20}
          width={14}
          height={40}
          rx={2}
          className={i === 3 ? `${HOT} ${A} group-hover:-translate-y-1` : DATA}
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={17 + i * 18} cy={70} r={3} className="fill-viz-compute" />
      ))}
      <text x={10} y={90} className={T}>
        one task per partition
      </text>
    </>
  ),

  "spark-sql": () => (
    <>
      <rect x={10} y={12} width={62} height={30} rx={3} className={BOX} strokeWidth={1} />
      <Mono x={14} y={24} text="SELECT city," cls="fill-accent" />
      <Mono x={14} y={34} text="  sum(amt) …" cls="fill-muted" />
      <rect x={88} y={12} width={62} height={30} rx={3} className={BOX} strokeWidth={1} />
      <Mono x={92} y={24} text=".groupBy(city)" cls="fill-accent" />
      <Mono x={92} y={34} text=".sum(amt)" cls="fill-muted" />
      <Arrow x1={41} y1={46} x2={74} y2={62} />
      <Arrow x1={119} y1={46} x2={86} y2={62} />
      <Svc
        x={58}
        y={62}
        w={44}
        h={14}
        label="same plan"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <text x={10} y={94} className={T}>
        two front doors, one engine
      </text>
    </>
  ),

  catalyst: () => (
    <>
      {["parse", "analyse", "optimise", "plan"].map((l, i) => (
        <g key={l}>
          <Svc x={8 + i * 38} y={30} w={32} h={14} label={l} cls={i === 2 ? HOT : BOX} />
          {i < 3 && <Arrow x1={41 + i * 38} y1={37} x2={45 + i * 38} y2={37} />}
        </g>
      ))}
      <path
        d="M90 26 q12 -14 24 0"
        className={`stroke-accent ${A} group-hover:-translate-y-0.5`}
        strokeWidth={1}
        fill="none"
        strokeDasharray="2 1.5"
      />
      <text x={10} y={70} className="fill-muted font-mono text-[6px]">
        push filters down, prune columns
      </text>
      <text x={10} y={90} className={T}>
        rules rewrite the plan
      </text>
    </>
  ),

  "jobs-stages-tasks": () => (
    <>
      <rect
        x={8}
        y={10}
        width={144}
        height={60}
        rx={6}
        className="stroke-line-strong fill-none"
        strokeDasharray="3 2"
      />
      <text x={14} y={20} className="fill-muted font-mono text-[6px]">
        job
      </text>
      {[0, 1].map((s) => (
        <g key={s}>
          <rect
            x={16 + s * 72}
            y={26}
            width={60}
            height={36}
            rx={4}
            className={s === 1 ? HOT : BOX}
            strokeWidth={1}
          />
          <Row x={22 + s * 72} y={40} n={4} w={10} gap={3} cls={() => CPU} />
        </g>
      ))}
      <Arrow x1={77} y1={44} x2={87} y2={44} className={`${A} group-hover:translate-x-0.5`} />
      <text x={10} y={88} className={T}>
        job → stages → tasks
      </text>
    </>
  ),

  shuffle: () => (
    <>
      {[0, 1, 2].map((i) =>
        [0, 1, 2].map((j) => (
          <line
            key={`${i}${j}`}
            x1={38}
            y1={18 + i * 22}
            x2={122}
            y2={18 + j * 22}
            className={i === 1 ? "stroke-accent" : "stroke-line-strong"}
            strokeWidth={0.9}
          />
        )),
      )}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Cell x={14} y={12 + i * 22} w={24} h={12} label={`map ${i + 1}`} cls={DATA} />
          <Cell
            x={122}
            y={12 + i * 22}
            w={24}
            h={12}
            label={`red ${i + 1}`}
            cls={CPU}
            className={i === 1 ? `${A} group-hover:translate-x-0.5` : ""}
          />
        </g>
      ))}
      <text x={10} y={92} className={T}>
        everyone sends to everyone
      </text>
    </>
  ),

  "spark-joins": () => (
    <>
      <Svc x={10} y={12} w={34} h={14} label="small" cls={HOT} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Arrow x1={44} y1={19} x2={66 + i * 30} y2={38} cls="stroke-accent" />
          <rect
            x={56 + i * 30}
            y={40}
            width={24}
            height={30}
            rx={3}
            className={DATA}
            strokeWidth={1}
          />
          <rect
            x={60 + i * 30}
            y={44}
            width={16}
            height={6}
            rx={1}
            className={`fill-accent/40 ${A} group-hover:-translate-y-0.5`}
          />
        </g>
      ))}
      <text x={10} y={90} className={T}>
        broadcast small, shuffle big
      </text>
    </>
  ),

  aqe: () => (
    <>
      <path
        d="M10 60 L50 60 L70 30 L150 30"
        className="stroke-line-strong"
        strokeWidth={1}
        fill="none"
        strokeDasharray="3 2"
      />
      <path
        d="M10 60 L50 60 L70 60 L150 60"
        className={`stroke-accent ${A} group-hover:-translate-y-0.5`}
        strokeWidth={1.6}
        fill="none"
      />
      <circle cx={50} cy={60} r={4} className="fill-accent" />
      <text x={56} y={74} className="fill-muted font-mono text-[6px]">
        real sizes seen: re-plan
      </text>
      <text x={96} y={24} className="fill-muted font-mono text-[6px]">
        first plan
      </text>
      <text x={10} y={92} className={T}>
        change course mid-query
      </text>
    </>
  ),
};
