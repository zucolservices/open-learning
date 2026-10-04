import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Cells } from "./llm-evaluation-a";

/** Card illustrations for the LLM Evaluation track (modules 11–20), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const TOOL = "fill-viz-compute/20 stroke-viz-compute";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const llmEvaluationArtB: ArtMap = {
  variance: () => (
    <>
      <line x1={18} y1={70} x2={146} y2={70} className="stroke-line-strong" />
      <path d="M18 40 Q 60 24, 146 20" className="stroke-viz-data fill-none" strokeWidth={1.6} />
      <path
        d="M18 40 Q 60 56, 146 66"
        className={`${A} stroke-bad fill-none group-hover:translate-y-0.5`}
        strokeWidth={1.6}
      />
      <text x={110} y={16} className="fill-viz-data font-mono text-[6px]">
        pass@k
      </text>
      <text x={110} y={62} className="fill-bad font-mono text-[6px]">
        pass^k
      </text>
      <text x={10} y={88} className={T}>
        right every time?
      </text>
    </>
  ),

  "llm-evaluation/benchmarks": () => (
    <>
      {[
        ["MMLU", 92, "fill-muted/50"],
        ["GPQA", 81, "fill-viz-data/60"],
        ["HLE", 34, "fill-viz-meta/60"],
        ["ARC-3", 3, "fill-viz-meta/60"],
      ].map(([l, v, c], i) => (
        <g key={l as string}>
          <text x={14} y={26 + i * 14} className="fill-muted font-mono text-[6px]">
            {l}
          </text>
          <rect
            x={44}
            y={20 + i * 14}
            width={(v as number) * 0.95}
            height={8}
            rx={2}
            className={`${A} ${c} group-hover:scale-x-105`}
          />
        </g>
      ))}
      <text x={10} y={88} className={T}>
        read the table carefully
      </text>
    </>
  ),

  contamination: () => (
    <>
      <rect
        x={14}
        y={20}
        width={60}
        height={46}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={20} y={32} className="fill-muted font-mono text-[5.5px]">
        training data
      </text>
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={20}
          y1={40 + i * 8}
          x2={66}
          y2={40 + i * 8}
          className="stroke-line-strong"
        />
      ))}
      <rect x={30} y={45} width={24} height={6} rx={1} className="fill-bad/60" />
      <Arrow x1={78} y1={44} x2={94} y2={44} className={`${A} group-hover:translate-x-0.5`} />
      <rect x={98} y={30} width={48} height={28} rx={4} className={BAD} strokeWidth={1.2} />
      <text x={122} y={47} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        test leaked
      </text>
      <text x={10} y={88} className={T}>
        when the exam leaks
      </text>
    </>
  ),

  "eval-systems": () => (
    <>
      {[
        [12, "retrieve", DATA],
        [62, "generate", HOT],
        [112, "act", TOOL],
      ].map(([x, l, c], i) => (
        <g key={l as string}>
          <Svc x={x as number} y={34} w={38} h={16} label={l as string} cls={c as string} />
          <path
            d={`M${(x as number) + 14} 58 l3 3 l6 -6`}
            className={`${A} stroke-good fill-none group-hover:scale-110`}
            strokeWidth={1.4}
          />
          {i < 2 && <Arrow x1={(x as number) + 40} y1={42} x2={(x as number) + 48} y2={42} />}
        </g>
      ))}
      <text x={10} y={88} className={T}>
        score every stage
      </text>
    </>
  ),

  "safety-evals": () => (
    <>
      <rect x={14} y={22} width={60} height={42} rx={4} className={BAD} strokeWidth={1.2} />
      <text x={44} y={40} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        harm let
      </text>
      <text x={44} y={50} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        through
      </text>
      <rect x={86} y={22} width={60} height={42} rx={4} className={TOOL} strokeWidth={1.2} />
      <text x={116} y={40} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        safe asks
      </text>
      <text x={116} y={50} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        refused
      </text>
      <line
        x1={80}
        y1={18}
        x2={80}
        y2={70}
        className={`${A} stroke-accent group-hover:translate-x-1`}
        strokeDasharray="3 2"
      />
      <text x={10} y={88} className={T}>
        measure both sides
      </text>
    </>
  ),

  "fairness-evals": () => (
    <>
      {[
        ["Rohan", 64],
        ["Ritu", 55],
      ].map(([n, v], i) => (
        <g key={n as string}>
          <text x={14} y={34 + i * 20} className="fill-muted font-mono text-[6.5px]">
            {n}
          </text>
          <rect
            x={46}
            y={28 + i * 20}
            width={(v as number) * 1.4}
            height={9}
            rx={2}
            className={`${A} fill-viz-data/60 group-hover:scale-x-105`}
          />
          <text
            x={50 + (v as number) * 1.4}
            y={35 + i * 20}
            className="fill-fg font-mono text-[6px]"
          >
            {v}%
          </text>
        </g>
      ))}
      <text x={10} y={88} className={T}>
        swap the name, same answer?
      </text>
    </>
  ),

  "eval-driven-dev": () => (
    <>
      {[
        ["#101", false],
        ["#102", true],
        ["#103", false],
      ].map(([l, ok], i) => (
        <g key={l as string}>
          <rect
            x={20}
            y={18 + i * 18}
            width={90}
            height={13}
            rx={3}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1}
          />
          <text x={26} y={27 + i * 18} className="fill-fg font-mono text-[6px]">
            {l} eval suite
          </text>
          <rect
            x={116}
            y={18 + i * 18}
            width={28}
            height={13}
            rx={6}
            className={`${A} ${ok ? GOOD : BAD} group-hover:scale-105`}
            strokeWidth={1}
          />
          <text
            x={130}
            y={27 + i * 18}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {ok ? "pass" : "block"}
          </text>
        </g>
      ))}
      <text x={10} y={88} className={T}>
        evals as tests in CI
      </text>
    </>
  ),

  "online-evals": () => (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <rect
          key={i}
          x={20 + i * 18}
          y={i === 0 ? 40 : 64}
          width={12}
          height={i === 0 ? 30 : 6}
          rx={2}
          className={i === 0 ? "fill-bad/60" : "fill-good/40"}
        />
      ))}
      <path
        d="M14 30 L36 30"
        className={`${A} stroke-accent group-hover:translate-x-1`}
        strokeWidth={1.4}
        strokeDasharray="3 2"
      />
      <text x={40} y={32} className="fill-muted font-mono text-[6px]">
        caught on day 1 by the canary
      </text>
      <text x={10} y={88} className={T}>
        keep watching after launch
      </text>
    </>
  ),

  "eval-tools": () => (
    <>
      {[
        [14, 18, "benchmarks", DATA],
        [82, 18, "frameworks", HOT],
        [14, 46, "platforms", TOOL],
        [82, 46, "cloud", GOOD],
      ].map(([x, y, l, c]) => (
        <Svc
          key={l as string}
          x={x as number}
          y={y as number}
          w={62}
          h={22}
          label={l as string}
          cls={c as string}
          className={`${A} group-hover:scale-105`}
        />
      ))}
      <text x={10} y={88} className={T}>
        the eval tool map
      </text>
    </>
  ),

  "capstone-evals": () => (
    <>
      <Cells x={18} y={24} cols={6} rows={4} bad={[7, 15]} size={6} gap={2} />
      <Arrow x1={70} y1={40} x2={86} y2={40} />
      <rect x={90} y={26} width={54} height={28} rx={5} className={GOOD} strokeWidth={1.2} />
      <text
        x={117}
        y={43}
        textAnchor="middle"
        className={`${A} fill-fg font-mono text-[7px] group-hover:scale-105`}
      >
        ship? yes
      </text>
      <text x={10} y={88} className={T}>
        let the evidence decide
      </text>
    </>
  ),
};
