import { A, type ArtMap } from "./kit";
import { Arrow, Db, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Data Quality track (modules 1–11), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const dataQualityArtA: ArtMap = {
  "why-quality": () => (
    <>
      <Db x={30} y={26} />
      <Arrow x1={48} y1={38} x2={74} y2={38} className={`${A} group-hover:translate-x-1`} />
      <rect x={80} y={22} width={64} height={34} rx={4} className={BOX} strokeWidth={1.2} />
      <Mono x={86} y={36} text="revenue" cls="fill-muted" />
      <text x={86} y={50} className="fill-bad font-mono text-[10px] font-semibold">
        €4.7M?
      </text>
      <text x={10} y={86} className={T}>
        fit for the decision?
      </text>
    </>
  ),

  "quality-dimensions": () => (
    <>
      {["complete", "unique", "timely", "valid", "accurate", "consistent"].map((l, i) => (
        <g key={l}>
          <rect
            x={14}
            y={12 + i * 11}
            width={44}
            height={8}
            rx={2}
            className={BOX}
            strokeWidth={0.8}
          />
          <rect
            x={62}
            y={12 + i * 11}
            width={[70, 82, 50, 76, 60, 66][i]}
            height={8}
            rx={2}
            className={`${i === 2 ? BAD : GOOD} ${A} group-hover:translate-x-0.5`}
            strokeWidth={0.8}
          />
          <text x={17} y={18 + i * 11} className="fill-fg font-mono text-[5px]">
            {l}
          </text>
        </g>
      ))}
    </>
  ),

  "data-tests": () => (
    <>
      {["unique", "not_null", "accepted_values", "relationships"].map((l, i) => (
        <g key={l}>
          <Mono x={16} y={22 + i * 13} text={l} />
          <text
            x={120}
            y={22 + i * 13}
            className={i === 2 ? "fill-bad font-mono text-[7px]" : "fill-good font-mono text-[7px]"}
          >
            {i === 2 ? "✗ fail" : "✓ pass"}
          </text>
        </g>
      ))}
      <text x={10} y={88} className={T}>
        data tests, like unit tests
      </text>
    </>
  ),

  "data-quality/profiling": () => (
    <>
      {[0.3, 0.55, 0.9, 0.7, 0.45, 0.2, 0.1, 0.05].map((h, i) => (
        <rect
          key={i}
          x={18 + i * 15}
          y={66 - h * 46}
          width={11}
          height={h * 46}
          rx={1.5}
          className={`${DATA} ${A} group-hover:-translate-y-0.5`}
          strokeWidth={1}
        />
      ))}
      <line x1={14} y1={67} x2={140} y2={67} className="stroke-line-strong" />
      <text x={10} y={84} className={T}>
        nulls 0.4% · min 1 · max 9,999
      </text>
    </>
  ),

  expectations: () => (
    <>
      <Mono x={14} y={24} text="expect_column_values" cls="fill-accent" />
      <Mono x={14} y={34} text="  _to_be_between(" />
      <Mono x={14} y={44} text="    'amount', 0, 10000)" />
      <rect x={14} y={54} width={76} height={14} rx={3} className={GOOD} strokeWidth={1} />
      <text x={20} y={63.5} className="fill-fg font-mono text-[6px]">
        success: 99.8%
      </text>
      <text x={10} y={88} className={T}>
        a suite of expectations
      </text>
    </>
  ),

  "where-to-test": () => (
    <>
      {["source", "stage", "audit", "publish"].map((l, i) => (
        <Svc key={l} x={6 + i * 39} y={30} w={32} h={16} label={l} cls={i === 2 ? HOT : BOX} />
      ))}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={38 + i * 39} y1={38} x2={45 + i * 39} y2={38} />
      ))}
      <text
        x={86}
        y={60}
        className={`fill-accent font-mono text-[7px] ${A} group-hover:-translate-y-0.5`}
      >
        ▲ check here
      </text>
      <text x={10} y={86} className={T}>
        write · audit · publish
      </text>
    </>
  ),

  severity: () => (
    <>
      <Svc x={12} y={32} w={30} h={16} label="rows" cls={DATA} />
      <Arrow x1={44} y1={40} x2={70} y2={24} />
      <Arrow x1={44} y1={40} x2={70} y2={56} />
      <Svc x={74} y={14} w={46} h={16} label="publish ✓" cls={GOOD} />
      <Svc
        x={74}
        y={48}
        w={46}
        h={16}
        label="quarantine"
        cls={`${BAD} ${A} group-hover:translate-x-1`}
      />
      <text x={10} y={88} className={T}>
        warn, quarantine or stop
      </text>
    </>
  ),

  "data-contracts": () => (
    <>
      <Svc x={8} y={30} w={36} h={18} label="producer" cls={BOX} />
      <rect x={58} y={16} width={44} height={46} rx={3} className={HOT} strokeWidth={1.2} />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={64}
          y1={26 + i * 8}
          x2={94 - (i % 2) * 10}
          y2={26 + i * 8}
          className="stroke-accent"
        />
      ))}
      <Svc x={116} y={30} w={36} h={18} label="consumers" cls={BOX} />
      <Arrow x1={44} y1={39} x2={56} y2={39} />
      <Arrow x1={102} y1={39} x2={114} y2={39} className={`${A} group-hover:translate-x-0.5`} />
      <text x={10} y={86} className={T}>
        a written, checked promise
      </text>
    </>
  ),

  "data-quality/schema-evolution": () => (
    <>
      {["v1", "v2", "v3"].map((v, i) => (
        <Svc key={v} x={12 + i * 48} y={24} w={34} h={18} label={v} cls={i === 2 ? BAD : GOOD} />
      ))}
      <Arrow x1={46} y1={33} x2={58} y2={33} />
      <Arrow x1={94} y1={33} x2={106} y2={33} />
      <text x={22} y={56} className="fill-good font-mono text-[6px]">
        + field, default
      </text>
      <text
        x={104}
        y={56}
        className={`fill-bad font-mono text-[6px] ${A} group-hover:translate-x-0.5`}
      >
        ✗ rejected
      </text>
      <text x={10} y={86} className={T}>
        BACKWARD · FORWARD · FULL
      </text>
    </>
  ),

  ownership: () => (
    <>
      {["orders", "payments", "customers"].map((l, i) => (
        <g key={l}>
          <Svc x={14} y={16 + i * 20} w={46} h={14} label={l} cls={DATA} />
          <Arrow x1={62} y1={23 + i * 20} x2={84} y2={23 + i * 20} />
          <circle
            cx={94}
            cy={23 + i * 20}
            r={5}
            className={`${HOT} ${A} group-hover:scale-110`}
            strokeWidth={1}
          />
          <text x={104} y={25.5 + i * 20} className="fill-fg font-mono text-[5.5px]">
            {["checkout", "payments", "CRM team"][i]}
          </text>
        </g>
      ))}
      <text x={10} y={88} className={T}>
        a name next to every dataset
      </text>
    </>
  ),

  "data-slas": () => (
    <>
      <rect x={14} y={14} width={132} height={50} rx={3} className={BOX} strokeWidth={1} />
      <line x1={14} y1={34} x2={146} y2={34} className="stroke-accent" strokeDasharray="3 2" />
      {[0.2, 0.25, 0.18, 0.8, 0.22, 0.3, 0.2, 0.24].map((h, i) => (
        <rect
          key={i}
          x={22 + i * 15}
          y={60 - h * 40}
          width={8}
          height={3}
          rx={1}
          className={h > 0.5 ? "fill-bad" : "fill-good"}
        />
      ))}
      <text x={118} y={31} className="fill-accent font-mono text-[5.5px]">
        08:00
      </text>
      <text x={10} y={84} className={T}>
        on time 95% of days
      </text>
    </>
  ),
};
