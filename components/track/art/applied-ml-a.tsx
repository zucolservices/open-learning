import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Applied ML track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const TOOL = "fill-viz-compute/20 stroke-viz-compute";

/** Scatter dots; `c` picks the class per point. */
export function Dots({ pts, c }: { pts: [number, number][]; c: (i: number) => string }) {
  return (
    <>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} className={c(i)} />
      ))}
    </>
  );
}

const SCATTER: [number, number][] = [
  [30, 30],
  [42, 24],
  [38, 42],
  [52, 34],
  [48, 50],
  [64, 28],
  [60, 46],
  [72, 56],
  [86, 40],
  [96, 62],
  [104, 50],
  [112, 70],
  [120, 58],
  [128, 74],
  [92, 76],
  [80, 68],
];

export const appliedMlArtA: ArtMap = {
  "what-is-ml": () => (
    <>
      <Svc x={10} y={22} w={36} h={14} label="rules" />
      <Svc x={10} y={44} w={36} h={14} label="data" cls={DATA} />
      <Arrow x1={50} y1={40} x2={66} y2={40} />
      <Svc
        x={70}
        y={30}
        w={34}
        h={20}
        label="model"
        cls={HOT}
        className={`${A} group-hover:scale-110`}
      />
      <Arrow x1={108} y1={40} x2={124} y2={40} />
      <text x={128} y={43} className="fill-fg font-mono text-[7px]">
        spam?
      </text>
      <text x={10} y={86} className={T}>
        learn rules from examples
      </text>
    </>
  ),

  "ml-lifecycle": () => (
    <>
      {["frame", "data", "train", "evaluate", "deploy", "monitor"].map((s, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        return (
          <Svc
            key={s}
            x={Math.round(80 + Math.cos(a) * 46 - 16)}
            y={Math.round(44 + Math.sin(a) * 28 - 6)}
            w={32}
            h={12}
            label={s}
            cls={i === 2 ? HOT : "fill-surface-2/60 stroke-line-strong"}
          />
        );
      })}
      <circle
        cx={80}
        cy={44}
        r={10}
        className={`stroke-line-strong fill-none ${A} group-hover:rotate-90`}
        strokeDasharray="3 3"
      />
      <text x={10} y={94} className={T}>
        a loop, not a line
      </text>
    </>
  ),

  "problem-framing": () => (
    <>
      <text x={12} y={28} className="fill-muted font-mono text-[6px]">
        “reduce churn”
      </text>
      <Arrow x1={40} y1={34} x2={40} y2={48} />
      <Svc x={12} y={52} w={60} h={14} label="label: left in 90 days?" cls={HOT} />
      <Svc x={84} y={22} w={64} h={14} label="baseline: contract rule" cls={TOOL} />
      <Svc
        x={84}
        y={52}
        w={64}
        h={14}
        label="action: who to call"
        cls={DATA}
        className={`${A} group-hover:translate-x-1`}
      />
      <text x={12} y={88} className={T}>
        question → label → action
      </text>
    </>
  ),

  "data-splits": () => (
    <>
      <rect x={14} y={34} width={84} height={16} rx={2} className={DATA} />
      <rect x={100} y={34} width={22} height={16} rx={2} className={TOOL} />
      <rect
        x={124}
        y={34}
        width={22}
        height={16}
        rx={2}
        className={`${HOT} ${A} group-hover:-translate-y-1`}
      />
      <text x={40} y={45} className="fill-fg font-mono text-[6px]">
        train
      </text>
      <text x={103} y={45} className="fill-fg font-mono text-[6px]">
        valid
      </text>
      <text x={128} y={45} className="fill-fg font-mono text-[6px]">
        test
      </text>
      <text x={14} y={86} className={T}>
        keep an exam it never saw
      </text>
    </>
  ),

  "feature-engineering": () => (
    <>
      <Svc x={10} y={22} w={44} h={12} label="signup 2024-03" />
      <Svc x={10} y={42} w={44} h={12} label="city: Pune" />
      <Arrow x1={58} y1={38} x2={74} y2={38} />
      <Svc x={78} y={18} w={70} h={12} label="tenure_months = 19" cls={HOT} />
      <g className={`${A} group-hover:translate-x-1`}>
        <Svc x={78} y={36} w={22} h={12} label="0" cls={DATA} />
        <Svc x={102} y={36} w={22} h={12} label="1" cls={DATA} />
        <Svc x={126} y={36} w={22} h={12} label="0" cls={DATA} />
      </g>
      <text x={10} y={86} className={T}>
        raw columns → useful numbers
      </text>
    </>
  ),

  "data-leakage": () => (
    <>
      <rect x={14} y={24} width={80} height={36} rx={3} className={DATA} />
      <text x={20} y={36} className="fill-fg font-mono text-[6px]">
        features
      </text>
      <rect
        x={60}
        y={42}
        width={30}
        height={12}
        rx={2}
        className={`fill-bad/30 stroke-bad ${A} group-hover:scale-110`}
      />
      <text x={63} y={50} className="fill-fg font-mono text-[5px]">
        refund_date
      </text>
      <Arrow x1={98} y1={42} x2={116} y2={42} />
      <text x={120} y={45} className="fill-good font-mono text-[8px]">
        99%!
      </text>
      <text x={14} y={86} className={T}>
        the answer slipped in
      </text>
    </>
  ),

  "linear-models": () => (
    <>
      <Dots pts={SCATTER} c={() => "fill-viz-data/70"} />
      <line
        x1={20}
        y1={22}
        x2={140}
        y2={80}
        className={`stroke-accent ${A} group-hover:rotate-3`}
        strokeWidth={2}
      />
      <text x={10} y={96} className={T}>
        one weight per feature
      </text>
    </>
  ),

  "decision-trees": () => (
    <>
      <Svc x={60} y={10} w={40} h={12} label="debt > 40%?" cls={HOT} />
      <line x1={80} y1={22} x2={44} y2={40} className="stroke-line-strong" />
      <line x1={80} y1={22} x2={116} y2={40} className="stroke-line-strong" />
      <Svc x={22} y={40} w={44} h={12} label="income < 8?" />
      <Svc x={96} y={40} w={40} h={12} label="repay" cls="fill-good/20 stroke-good" />
      <line x1={44} y1={52} x2={30} y2={66} className="stroke-line-strong" />
      <line x1={44} y1={52} x2={60} y2={66} className="stroke-line-strong" />
      <Svc
        x={12}
        y={66}
        w={34}
        h={12}
        label="default"
        cls="fill-bad/20 stroke-bad"
        className={`${A} group-hover:translate-y-0.5`}
      />
      <Svc x={50} y={66} w={34} h={12} label="repay" cls="fill-good/20 stroke-good" />
      <text x={96} y={90} className={T}>
        20 questions
      </text>
    </>
  ),

  ensembles: () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <g
          key={i}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <polygon
            points={`${18 + i * 22},50 ${28 + i * 22},26 ${38 + i * 22},50`}
            className="fill-good/25 stroke-good"
          />
          <rect x={26 + i * 22} y={50} width={4} height={8} className="fill-viz-compute/60" />
        </g>
      ))}
      <Arrow x1={128} y1={42} x2={140} y2={42} />
      <text x={142} y={45} className="fill-fg font-mono text-[7px]">
        vote
      </text>
      <text x={10} y={86} className={T}>
        many trees, one answer
      </text>
    </>
  ),

  overfitting: () => (
    <>
      <Dots pts={SCATTER.filter((_, i) => i % 2 === 0)} c={() => "fill-viz-data/70"} />
      <path
        d="M20 34 Q40 10 52 46 T76 30 T104 70 T130 60"
        className={`stroke-bad fill-none ${A}`}
        strokeWidth={1.6}
      />
      <line
        x1={20}
        y1={26}
        x2={140}
        y2={78}
        className="stroke-good"
        strokeWidth={1.6}
        strokeDasharray="4 3"
      />
      <text x={10} y={96} className={T}>
        memorised vs learned
      </text>
    </>
  ),

  unsupervised: () => (
    <>
      <Dots
        pts={[
          [30, 30],
          [38, 24],
          [26, 40],
          [40, 38],
          [96, 30],
          [104, 22],
          [110, 34],
          [100, 40],
          [60, 66],
          [70, 60],
          [66, 74],
          [76, 70],
        ]}
        c={(i) => (i < 4 ? "fill-viz-data" : i < 8 ? "fill-accent" : "fill-viz-compute")}
      />
      <circle
        cx={34}
        cy={33}
        r={15}
        className={`stroke-viz-data fill-none ${A} group-hover:scale-110`}
        strokeDasharray="3 2"
      />
      <circle
        cx={102}
        cy={31}
        r={15}
        className={`stroke-accent fill-none ${A} group-hover:scale-110`}
        strokeDasharray="3 2"
      />
      <circle
        cx={68}
        cy={67}
        r={14}
        className={`stroke-viz-compute fill-none ${A} group-hover:scale-110`}
        strokeDasharray="3 2"
      />
      <text x={110} y={86} className={T}>
        no labels
      </text>
    </>
  ),
};
