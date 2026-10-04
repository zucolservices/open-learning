import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the LLM Evaluation track (modules 1–10), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const TOOL = "fill-viz-compute/20 stroke-viz-compute";
const GOOD = "fill-good/20 stroke-good";

/** A small grid of result cells; `bad` lists indices drawn as failures. */
export function Cells({
  x,
  y,
  cols,
  rows,
  bad = [],
  size = 6,
  gap = 2,
  className = "",
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  bad?: number[];
  size?: number;
  gap?: number;
  className?: string;
}) {
  return (
    <g className={className}>
      {Array.from({ length: cols * rows }, (_, i) => (
        <rect
          key={i}
          x={x + (i % cols) * (size + gap)}
          y={y + Math.floor(i / cols) * (size + gap)}
          width={size}
          height={size}
          rx={1}
          className={bad.includes(i) ? "fill-bad/80" : "fill-good/60"}
        />
      ))}
    </g>
  );
}

export const llmEvaluationArtA: ArtMap = {
  "why-evals": () => (
    <>
      <Cells x={14} y={22} cols={3} rows={2} size={8} />
      <text x={14} y={52} className="fill-muted font-mono text-[6px]">
        5 tries: fine
      </text>
      <Arrow x1={50} y1={36} x2={64} y2={36} />
      <Cells
        x={70}
        y={18}
        cols={10}
        rows={5}
        bad={[3, 17, 22, 38, 41, 44]}
        className={`${A} group-hover:scale-105`}
      />
      <text x={10} y={88} className={T}>
        a spoonful vs the pot
      </text>
    </>
  ),

  "success-criteria": () => (
    <>
      <rect
        x={20}
        y={16}
        width={120}
        height={58}
        rx={5}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      {["accuracy ≥ 95%", "tone: rubric pass", "0 data leaks", "p95 ≤ 1.5 s"].map((t, i) => (
        <g key={t} className={`${A} group-hover:translate-x-0.5`}>
          <path
            d={`M30 ${29 + i * 12} l3 3 l6 -6`}
            className="stroke-good fill-none"
            strokeWidth={1.6}
          />
          <text x={44} y={32 + i * 12} className="fill-fg font-mono text-[6px]">
            {t}
          </text>
        </g>
      ))}
      <text x={10} y={88} className={T}>
        define good first
      </text>
    </>
  ),

  "eval-datasets": () => (
    <>
      {[
        ["logs", DATA],
        ["edge", TOOL],
        ["attacks", HOT],
      ].map(([l, c], i) => (
        <g key={l}>
          <Svc x={12} y={18 + i * 20} w={36} h={13} label={l} cls={c} />
          <Arrow
            x1={50}
            y1={24 + i * 20}
            x2={84}
            y2={44}
            className={`${A} group-hover:translate-x-0.5`}
          />
        </g>
      ))}
      <rect x={88} y={28} width={56} height={32} rx={4} className={GOOD} strokeWidth={1.2} />
      <text x={116} y={47} textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        eval set v1.4
      </text>
      <text x={10} y={88} className={T}>
        mix your sources
      </text>
    </>
  ),

  "code-checks": () => (
    <>
      <rect
        x={14}
        y={20}
        width={84}
        height={50}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      {['"1889"  ✓', '"1889\\n"  ✗', '{ "days": 14 }  ✓'].map((t, i) => (
        <text
          key={t}
          x={20}
          y={34 + i * 13}
          className={`font-mono text-[6px] ${t.includes("✗") ? "fill-bad" : "fill-fg"}`}
        >
          {t}
        </text>
      ))}
      <Svc
        x={106}
        y={36}
        w={40}
        h={16}
        label="assert"
        cls={TOOL}
        className={`${A} group-hover:scale-105`}
      />
      <text x={10} y={88} className={T}>
        when a program can grade it
      </text>
    </>
  ),

  "similarity-metrics": () => (
    <>
      {[0, 1].map((r) => (
        <g key={r}>
          {Array.from({ length: 7 }, (_, i) => (
            <rect
              key={i}
              x={20 + i * 17}
              y={24 + r * 22}
              width={14}
              height={8}
              rx={2}
              className={i === 4 && r === 1 ? "fill-bad/70" : "fill-viz-data/50"}
            />
          ))}
        </g>
      ))}
      <text x={20} y={20} className="fill-muted font-mono text-[5.5px]">
        reference
      </text>
      <text x={20} y={62} className="fill-muted font-mono text-[5.5px]">
        answer: 6 of 7 words match, meaning flipped
      </text>
      <text x={10} y={88} className={T}>
        similar isn&apos;t correct
      </text>
    </>
  ),

  "llm-judge": () => (
    <>
      <Svc x={14} y={22} w={30} h={14} label="A" cls={DATA} />
      <Svc x={14} y={48} w={30} h={14} label="B" cls={DATA} />
      <Arrow x1={46} y1={29} x2={70} y2={40} />
      <Arrow x1={46} y1={55} x2={70} y2={46} />
      <Svc
        x={72}
        y={34}
        w={40}
        h={18}
        label="judge"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Arrow x1={114} y1={43} x2={128} y2={43} />
      <text x={132} y={46} className="fill-fg font-mono text-[7px]">
        A?
      </text>
      <text x={10} y={88} className={T}>
        models grading models
      </text>
    </>
  ),

  "judge-agreement": () => (
    <>
      {[
        [40, 20, "9", "fill-good/30"],
        [76, 20, "1", "fill-bad/30"],
        [40, 46, "2", "fill-viz-compute/30"],
        [76, 46, "38", "fill-good/15"],
      ].map(([x, y, n, c]) => (
        <g key={`${x}-${y}`}>
          <rect
            x={x as number}
            y={y as number}
            width={32}
            height={22}
            rx={3}
            className={`${c} stroke-line-strong`}
            strokeWidth={0.8}
          />
          <text
            x={(x as number) + 16}
            y={(y as number) + 14}
            textAnchor="middle"
            className="fill-fg font-mono text-[8px]"
          >
            {n}
          </text>
        </g>
      ))}
      <text
        x={116}
        y={46}
        className={`${A} fill-accent font-mono text-[8px] group-hover:translate-x-0.5`}
      >
        κ 0.82
      </text>
      <text x={10} y={88} className={T}>
        judge versus expert
      </text>
    </>
  ),

  "human-eval": () => (
    <>
      {[0, 1, 2, 3].map((r) => (
        <Cells
          key={r}
          x={40}
          y={18 + r * 12}
          cols={10}
          rows={1}
          size={7}
          gap={2}
          bad={r === 2 ? [3, 7] : r === 3 ? [3] : [7]}
        />
      ))}
      {[0, 1, 2, 3].map((r) => (
        <circle key={r} cx={28} cy={21 + r * 12} r={3.5} className="fill-muted/60" />
      ))}
      <text x={10} y={88} className={T}>
        people disagree too
      </text>
    </>
  ),

  "eval-statistics": () => (
    <>
      <line x1={14} y1={60} x2={146} y2={60} className="stroke-line-strong" />
      {[52, 64, 70, 76, 80, 84, 90, 96, 108].map((x, i) => (
        <circle key={i} cx={x} cy={50 - (i % 3) * 7} r={2.4} className="fill-viz-data" />
      ))}
      <rect
        x={58}
        y={64}
        width={44}
        height={6}
        rx={2}
        className={`${A} fill-accent/30 stroke-accent group-hover:scale-x-110`}
      />
      <line x1={80} y1={22} x2={80} y2={72} className="stroke-good" strokeDasharray="2 2" />
      <text x={10} y={88} className={T}>
        a score is an estimate
      </text>
    </>
  ),

  "comparing-versions": () => (
    <>
      {[
        [30, 22, "both right", "fill-surface-2"],
        [84, 22, "B fixed", "fill-good/30"],
        [30, 46, "B broke", "fill-bad/30"],
        [84, 46, "both wrong", "fill-surface-2"],
      ].map(([x, y, l, c]) => (
        <g key={l as string}>
          <rect
            x={x as number}
            y={y as number}
            width={48}
            height={20}
            rx={3}
            className={`${c} stroke-line-strong`}
            strokeWidth={0.8}
          />
          <text
            x={(x as number) + 24}
            y={(y as number) + 13}
            textAnchor="middle"
            className="fill-fg font-mono text-[6px]"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={10} y={88} className={T}>
        only the flips count
      </text>
    </>
  ),
};
