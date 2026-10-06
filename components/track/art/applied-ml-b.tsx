import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Applied ML track (modules 12–22), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const TOOL = "fill-viz-compute/20 stroke-viz-compute";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const appliedMlArtB: ArtMap = {
  "classification-metrics": () => (
    <>
      <Svc
        x={40}
        y={14}
        w={36}
        h={26}
        label="TP 42"
        cls={GOOD}
        className={`${A} group-hover:scale-105`}
      />
      <Svc x={80} y={14} w={36} h={26} label="FP 8" cls={BAD} />
      <Svc x={40} y={44} w={36} h={26} label="FN 18" cls={BAD} />
      <Svc x={80} y={44} w={36} h={26} label="TN 132" cls={GOOD} />
      <text x={10} y={90} className={T}>
        precision 84% · recall 70%
      </text>
    </>
  ),

  "regression-metrics": () => (
    <>
      <line x1={14} y1={70} x2={146} y2={22} className="stroke-accent" strokeWidth={1.6} />
      {[
        [30, 54, 64],
        [52, 64, 56],
        [74, 34, 49],
        [96, 50, 41],
        [118, 22, 33],
        [136, 38, 26],
      ].map(([x, y, fy], i) => (
        <g key={i}>
          <line
            x1={x}
            y1={y}
            x2={x}
            y2={fy}
            className={`stroke-bad ${A}`}
            strokeDasharray="2 1.5"
          />
          <circle cx={x} cy={y} r={2.6} className="fill-viz-data" />
        </g>
      ))}
      <text x={10} y={90} className={T}>
        how far off, on average
      </text>
    </>
  ),

  "imbalanced-data": () => (
    <>
      {Array.from({ length: 60 }, (_, i) => (
        <rect
          key={i}
          x={14 + (i % 15) * 9}
          y={18 + Math.floor(i / 15) * 9}
          width={6}
          height={6}
          rx={1}
          className={
            i === 23 || i === 47 ? `fill-bad ${A} group-hover:scale-150` : "fill-viz-data/40"
          }
        />
      ))}
      <text x={10} y={86} className={T}>
        2 frauds in 60
      </text>
    </>
  ),

  calibration: () => (
    <>
      <rect x={20} y={14} width={64} height={64} className="stroke-line-strong fill-none" />
      <line x1={20} y1={78} x2={84} y2={14} className="stroke-line-strong" strokeDasharray="3 2" />
      <polyline
        points="20,78 36,72 52,58 68,40 84,30"
        className={`stroke-bad fill-none ${A}`}
        strokeWidth={1.4}
      />
      <polyline
        points="20,78 36,62 52,46 68,30 84,15"
        className="stroke-good fill-none"
        strokeWidth={1.6}
      />
      <text x={92} y={40} className="fill-fg font-mono text-[7px]">
        “70%”
      </text>
      <text x={92} y={52} className="fill-muted font-mono text-[6px]">
        = 7 in 10?
      </text>
      <text x={10} y={94} className={T}>
        probabilities you can trust
      </text>
    </>
  ),

  "hyperparameter-tuning": () => (
    <>
      {Array.from({ length: 48 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const v = Math.exp(-((x - 4.5) ** 2) / 3);
        return (
          <rect
            key={i}
            x={20 + x * 12}
            y={12 + y * 12}
            width={11}
            height={11}
            className="fill-viz-data"
            opacity={Math.round((0.1 + v * 0.7) * 100) / 100}
          />
        );
      })}
      {[
        [26, 20],
        [50, 56],
        [74, 32],
        [88, 68],
        [110, 26],
        [98, 44],
        [62, 74],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.4} className="fill-fg" />
      ))}
      <circle
        cx={80}
        cy={40}
        r={5}
        className={`stroke-accent fill-none ${A} group-hover:scale-125`}
        strokeWidth={1.6}
      />
      <text x={20} y={96} className={T}>
        search the knobs
      </text>
    </>
  ),

  interpretability: () => (
    <>
      <line x1={50} y1={14} x2={50} y2={78} className="stroke-line-strong" strokeDasharray="2 2" />
      <rect x={50} y={18} width={30} height={10} className={BAD} />
      <rect x={80} y={32} width={22} height={10} className={BAD} />
      <rect x={88} y={46} width={14} height={10} className={GOOD} />
      <rect x={88} y={60} width={8} height={10} className={`${BAD} ${A} group-hover:scale-x-125`} />
      <line x1={96} y1={14} x2={96} y2={78} className="stroke-accent" strokeWidth={1.6} />
      <text x={10} y={26} className="fill-muted font-mono text-[6px]">
        debt
      </text>
      <text x={10} y={40} className="fill-muted font-mono text-[6px]">
        late
      </text>
      <text x={10} y={54} className="fill-muted font-mono text-[6px]">
        income
      </text>
      <text x={10} y={68} className="fill-muted font-mono text-[6px]">
        tenure
      </text>
      <text x={10} y={92} className={T}>
        why this prediction?
      </text>
    </>
  ),

  forecasting: () => (
    <>
      <polyline
        points="12,60 22,56 32,50 42,58 52,38 62,54 72,50 82,44 92,52 102,30"
        className="stroke-viz-data fill-none"
        strokeWidth={1.6}
      />
      <polyline
        points="102,30 112,46 122,42 132,36 142,44 150,24"
        className={`stroke-accent fill-none ${A}`}
        strokeWidth={1.6}
        strokeDasharray="4 2"
      />
      <line
        x1={102}
        y1={14}
        x2={102}
        y2={74}
        className="stroke-line-strong"
        strokeDasharray="2 2"
      />
      <text x={106} y={18} className="fill-muted font-mono text-[6px]">
        future
      </text>
      <text x={10} y={90} className={T}>
        trend + season + noise
      </text>
    </>
  ),

  "model-serving": () => (
    <>
      <Svc x={10} y={30} w={30} h={16} label="app" />
      <Arrow x1={42} y1={34} x2={60} y2={34} />
      <Svc
        x={62}
        y={26}
        w={36}
        h={24}
        label="model"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Arrow x1={60} y1={44} x2={42} y2={44} />
      <Svc x={106} y={18} w={44} h={12} label="batch" cls={DATA} />
      <Svc x={106} y={34} w={44} h={12} label="online" cls={TOOL} />
      <Svc x={106} y={50} w={44} h={12} label="on device" cls={GOOD} />
      <text x={10} y={86} className={T}>
        same features, both sides
      </text>
    </>
  ),

  "model-monitoring": () => (
    <>
      <rect x={14} y={20} width={132} height={16} className="fill-bad/10" />
      <polyline
        points="14,60 30,58 46,62 62,59 78,30 94,28 110,32 126,26 146,30"
        className="stroke-viz-data fill-none"
        strokeWidth={1.6}
      />
      <line x1={78} y1={14} x2={78} y2={70} className="stroke-line-strong" strokeDasharray="2 2" />
      <circle cx={140} cy={18} r={4} className={`fill-bad ${A} group-hover:scale-125`} />
      <text x={14} y={86} className={T}>
        the world moved
      </text>
    </>
  ),

  "ml-tools": () => (
    <>
      {[
        ["train", 12, 18],
        ["track", 58, 18],
        ["version", 104, 18],
        ["pipeline", 12, 44],
        ["serve", 58, 44],
        ["monitor", 104, 44],
      ].map(([l, x, y], i) => (
        <Svc
          key={l as string}
          x={x as number}
          y={y as number}
          w={42}
          h={18}
          label={l as string}
          cls={i === 1 ? HOT : "fill-surface-2/60 stroke-line-strong"}
          className={i === 1 ? `${A} group-hover:-translate-y-1` : ""}
        />
      ))}
      <text x={12} y={86} className={T}>
        jobs, not brands
      </text>
    </>
  ),

  "capstone-ml": () => (
    <>
      {["frame", "data", "model", "metric", "serve", "watch"].map((l, i) => (
        <g key={l}>
          <Svc
            x={8 + i * 25}
            y={30}
            w={22}
            h={14}
            label={l}
            cls={i === 5 ? HOT : i % 2 ? DATA : TOOL}
            className={i === 5 ? `${A} group-hover:scale-110` : ""}
          />
        </g>
      ))}
      <text x={8} y={62} className="fill-muted font-mono text-[6px]">
        churn: who to call, and does calling help?
      </text>
      <text x={8} y={86} className={T}>
        the whole track, one project
      </text>
    </>
  ),
};
