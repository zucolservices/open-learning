import { A, type ArtMap } from "./kit";
import { Arrow, Row, T } from "./streaming-data-a";
import { Line, Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Data Quality track (modules 12–21), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const dataQualityArtB: ArtMap = {
  "data-observability": () => (
    <>
      {["fresh", "volume", "schema", "values"].map((l, i) => (
        <g key={l}>
          <rect
            x={10 + i * 37}
            y={18}
            width={32}
            height={30}
            rx={3}
            className={i === 1 ? BAD : BOX}
            strokeWidth={1}
          />
          <Line
            x={14 + i * 37}
            y={24}
            w={24}
            h={14}
            v={i === 1 ? [0.8, 0.8, 0.82, 0.3] : [0.5, 0.55, 0.5, 0.52]}
            cls={i === 1 ? "stroke-bad" : "stroke-viz-data"}
            className={i === 1 ? `${A} group-hover:translate-y-0.5` : ""}
          />
          <text
            x={26 + i * 37}
            y={45}
            textAnchor="middle"
            className="fill-muted font-mono text-[5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={10} y={70} className="fill-good font-mono text-[6px]">
        job: ✓ succeeded
      </text>
      <text x={10} y={86} className={T}>
        watch the data, not just jobs
      </text>
    </>
  ),

  "anomaly-detection": () => (
    <>
      <path d="M12 44 L148 30 L148 50 L12 64 Z" className="fill-viz-meta/15" />
      <Line
        x={12}
        y={20}
        w={136}
        h={50}
        v={[0.35, 0.3, 0.38, 0.33, 0.4, 0.36, 0.85, 0.42, 0.45, 0.43]}
        cls="stroke-viz-data"
      />
      <circle
        cx={12 + (6 / 9) * 136}
        cy={20 + 50 - 0.85 * 50}
        r={4}
        className={`stroke-bad fill-none ${A} group-hover:scale-125`}
        strokeWidth={1.4}
      />
      <text x={10} y={88} className={T}>
        outside the expected band
      </text>
    </>
  ),

  lineage: () => (
    <>
      {[
        [8, 16, "src"],
        [8, 50, "fx"],
        [58, 32, "model"],
        [112, 16, "report"],
        [112, 50, "export"],
      ].map(([x, y, l], i) => (
        <Svc
          key={l as string}
          x={x as number}
          y={y as number}
          w={38}
          h={14}
          label={l as string}
          cls={i === 1 ? BAD : i > 1 ? "fill-bad/10 stroke-bad" : BOX}
        />
      ))}
      <Arrow x1={46} y1={23} x2={58} y2={36} />
      <Arrow x1={46} y1={57} x2={58} y2={42} cls="stroke-bad" />
      <Arrow
        x1={96}
        y1={36}
        x2={112}
        y2={24}
        cls="stroke-bad"
        className={`${A} group-hover:translate-x-0.5`}
      />
      <Arrow
        x1={96}
        y1={42}
        x2={112}
        y2={55}
        cls="stroke-bad"
        className={`${A} group-hover:translate-x-0.5`}
      />
      <text x={10} y={86} className={T}>
        upstream cause, downstream impact
      </text>
    </>
  ),

  "data-incidents": () => (
    <>
      {["confirm", "contain", "tell", "repair", "learn"].map((l, i) => (
        <g key={l}>
          <circle
            cx={18 + i * 31}
            cy={36}
            r={8}
            className={i === 1 ? HOT : BOX}
            strokeWidth={1.2}
          />
          <text
            x={18 + i * 31}
            y={38.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[6px]"
          >
            {i + 1}
          </text>
          <text
            x={18 + i * 31}
            y={56}
            textAnchor="middle"
            className="fill-muted font-mono text-[5.5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <rect
        x={10}
        y={66}
        width={44}
        height={8}
        rx={2}
        className={`${BAD} ${A} group-hover:translate-x-1`}
        strokeWidth={0.8}
      />
      <text x={14} y={72} className="fill-fg font-mono text-[5px]">
        SEV-2
      </text>
      <text x={10} y={90} className={T}>
        calm, in order
      </text>
    </>
  ),

  deduplication: () => (
    <>
      <Svc x={10} y={18} w={50} h={14} label="Asha Rao" cls={DATA} />
      <Svc x={10} y={46} w={50} h={14} label="A. Rao" cls={DATA} />
      <Arrow x1={62} y1={25} x2={92} y2={36} />
      <Arrow x1={62} y1={53} x2={92} y2={42} />
      <Svc
        x={96}
        y={32}
        w={54}
        h={14}
        label="1 customer"
        cls={`${HOT} ${A} group-hover:scale-105`}
      />
      <text x={10} y={84} className={T}>
        same person? weigh the clues
      </text>
    </>
  ),

  reconciliation: () => (
    <>
      <Mono x={14} y={22} text="source" cls="fill-muted" />
      <Mono x={96} y={22} text="copy" cls="fill-muted" />
      {[
        ["rows", "12", "12"],
        ["sum", "3,842", "3,402"],
      ].map(([k, a, b], i) => (
        <g key={k}>
          <Mono x={14} y={36 + i * 13} text={`${k} ${a}`} />
          <Mono
            x={96}
            y={36 + i * 13}
            text={`${k} ${b}`}
            cls={a === b ? "fill-good" : "fill-bad"}
          />
        </g>
      ))}
      <text
        x={70}
        y={49}
        textAnchor="middle"
        className={`fill-bad font-mono text-[8px] ${A} group-hover:scale-110`}
      >
        ≠
      </text>
      <text x={10} y={86} className={T}>
        totals first, then rows
      </text>
    </>
  ),

  "late-data": () => (
    <>
      <Row
        x={12}
        y={28}
        n={7}
        w={14}
        gap={4}
        cls={(i) => (i === 2 ? "fill-viz-compute/25 stroke-viz-compute" : DATA)}
      />
      <rect
        x={48}
        y={14}
        width={86}
        height={34}
        rx={3}
        className="stroke-accent fill-none"
        strokeDasharray="3 2"
      />
      <text x={52} y={22} className="fill-accent font-mono text-[5.5px]">
        rebuild last 4 days
      </text>
      <Arrow
        x1={120}
        y1={66}
        x2={56}
        y2={46}
        cls="stroke-viz-compute"
        className={`${A} group-hover:-translate-x-1`}
      />
      <text x={10} y={88} className={T}>
        late arrivals, safe re-runs
      </text>
    </>
  ),

  "ml-data-quality": () => (
    <>
      {[
        [20, 20, 1],
        [30, 30, 1],
        [44, 18, 1],
        [26, 52, 0],
        [48, 60, 0],
        [60, 44, 0],
        [36, 40, 0],
      ].map(([x, y, c], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={3}
          className={c ? "fill-accent" : "fill-viz-data"}
          stroke={i === 6 ? "currentColor" : undefined}
        />
      ))}
      <line x1={10} y1={30} x2={74} y2={56} className="stroke-fg" strokeDasharray="3 2" />
      <Arrow x1={84} y1={40} x2={104} y2={40} className={`${A} group-hover:translate-x-1`} />
      <Svc x={108} y={32} w={42} h={16} label="drift?" cls={BAD} />
      <text x={10} y={86} className={T}>
        bad data, confident answers
      </text>
    </>
  ),

  "dq-platforms": () => (
    <>
      {["open", "platform", "commercial"].map((l, i) => (
        <g key={l}>
          <rect
            x={8 + i * 51}
            y={14}
            width={46}
            height={52}
            rx={3}
            className={BOX}
            strokeWidth={1}
          />
          <text
            x={31 + i * 51}
            y={24}
            textAnchor="middle"
            className="fill-muted font-mono text-[5.5px]"
          >
            {l}
          </text>
          {[0, 1, 2].map((j) => (
            <rect
              key={j}
              x={14 + i * 51}
              y={30 + j * 11}
              width={34 - ((i + j) % 2) * 8}
              height={7}
              rx={2}
              className={
                i === 0 && j === 0 ? `${HOT} ${A} group-hover:translate-x-0.5` : "fill-surface-2"
              }
            />
          ))}
        </g>
      ))}
      <text x={10} y={84} className={T}>
        the job first, then the tool
      </text>
    </>
  ),

  "capstone-quality": () => (
    <>
      <rect x={12} y={14} width={64} height={40} rx={4} className={BOX} strokeWidth={1.2} />
      <text x={18} y={26} className="fill-muted font-mono text-[5.5px]">
        Sept revenue
      </text>
      <text x={18} y={44} className="fill-bad font-mono text-[11px] font-semibold">
        +18%
      </text>
      <Arrow x1={80} y1={34} x2={96} y2={34} />
      {["contract", "test", "reconcile"].map((l, i) => (
        <Svc
          key={l}
          x={100}
          y={14 + i * 16}
          w={50}
          h={12}
          label={l}
          cls={`${GOOD} ${A} group-hover:translate-x-0.5`}
        />
      ))}
      <text x={10} y={86} className={T}>
        find it, fix it, defend
      </text>
    </>
  ),
};
