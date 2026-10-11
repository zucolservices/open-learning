import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Code Review track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

/** A small diff: rows marked "+" (added), "-" (removed) or " " (unchanged). */
export function DiffRows({
  x,
  y,
  rows,
  hot = -1,
}: {
  x: number;
  y: number;
  rows: string;
  hot?: number;
}) {
  return (
    <>
      {rows.split("").map((k, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * 8}
          width={[48, 38, 54, 30, 44, 36][i % 6]}
          height={5}
          rx={1.5}
          className={
            i === hot
              ? `fill-accent ${A} group-hover:scale-x-110`
              : k === "+"
                ? "fill-good/50"
                : k === "-"
                  ? "fill-bad/45"
                  : "fill-viz-idle/45"
          }
        />
      ))}
    </>
  );
}

/** A speech-bubble review comment. */
export function Bubble({
  x,
  y,
  w = 40,
  cls = "fill-surface stroke-line-strong",
  className = "",
}: {
  x: number;
  y: number;
  w?: number;
  cls?: string;
  className?: string;
}) {
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={14} rx={4} className={cls} strokeWidth={1.1} />
      <path d={`M${x + 6} ${y + 14} l0 5 l5 -5`} className={cls} strokeWidth={1.1} />
      <rect x={x + 5} y={y + 5} width={w - 12} height={3} rx={1.5} className="fill-viz-idle/60" />
    </g>
  );
}

export const codeReviewArtA: ArtMap = {
  "why-review": () => (
    <>
      <rect
        x={20}
        y={18}
        width={62}
        height={60}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <DiffRows x={26} y={26} rows=" ++-+ " hot={2} />
      <circle
        cx={108}
        cy={36}
        r={9}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <circle cx={130} cy={36} r={9} className={HOT} strokeWidth={1.2} />
      <circle cx={108} cy={36} r={3} className="fill-accent" />
      <circle cx={130} cy={36} r={3} className="fill-accent" />
      <text x={119} y={62} textAnchor="middle" className={T}>
        two pairs of eyes
      </text>
    </>
  ),

  "anatomy-pr": () => (
    <>
      <rect
        x={30}
        y={12}
        width={100}
        height={76}
        rx={5}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <rect
        x={38}
        y={20}
        width={60}
        height={6}
        rx={2}
        className={`fill-accent ${A} group-hover:scale-x-110`}
      />
      <rect x={38} y={32} width={84} height={3} rx={1.5} className="fill-viz-idle/50" />
      <rect x={38} y={38} width={70} height={3} rx={1.5} className="fill-viz-idle/50" />
      <DiffRows x={38} y={48} rows="+-+" />
      <circle cx={116} cy={74} r={6} className={GOOD} strokeWidth={1.1} />
      <path d="M113 74l2 2l4 -4" className="stroke-good" strokeWidth={1.4} />
    </>
  ),

  "review-flow": () => (
    <>
      {["open", "review", "fix", "merge"].map((l, i) => (
        <Svc
          key={l}
          x={10 + i * 38}
          y={40}
          w={30}
          h={16}
          label={l}
          cls={i === 3 ? GOOD : i === 1 ? HOT : undefined}
          className={i === 1 ? `${A} group-hover:scale-105` : ""}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={41 + i * 38} y1={48} x2={47 + i * 38} y2={48} />
      ))}
      <path
        d="M95 58 C95 74 63 74 63 58"
        className="stroke-accent"
        strokeWidth={1.1}
        fill="none"
        strokeDasharray="2 2"
      />
      <text x={14} y={88} className={T}>
        rounds until approved
      </text>
    </>
  ),

  "what-to-look-for": () => (
    <>
      {["design", "behaviour", "tests", "naming", "style"].map((l, i) => (
        <g key={l}>
          <rect
            x={22}
            y={14 + i * 15}
            width={(5 - i) * 20}
            height={10}
            rx={3}
            className={
              i === 0 ? `${HOT} ${A} group-hover:scale-x-105` : "fill-viz-data/25 stroke-viz-data"
            }
            strokeWidth={1}
          />
          <text x={26 + (5 - i) * 20} y={22 + i * 15} className={T}>
            {l}
          </text>
        </g>
      ))}
    </>
  ),

  "small-changes": () => (
    <>
      <rect x={14} y={22} width={50} height={56} rx={4} className={BAD} strokeWidth={1.1} />
      <text x={39} y={54} textAnchor="middle" className="fill-bad font-mono text-[7px]">
        1,200 lines
      </text>
      <Arrow x1={68} y1={50} x2={84} y2={50} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={90 + i * 20}
          y={36}
          width={14}
          height={28}
          rx={3}
          className={`${GOOD} ${A} group-hover:scale-105`}
          strokeWidth={1.1}
        />
      ))}
      <text x={90} y={78} className={T}>
        three small PRs
      </text>
    </>
  ),

  "describing-changes": () => (
    <>
      <rect
        x={36}
        y={12}
        width={88}
        height={74}
        rx={5}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      {["what", "why", "how to test", "risks"].map((l, i) => (
        <g key={l}>
          <text x={44} y={28 + i * 15} className="fill-accent font-mono text-[6px]">
            {l}
          </text>
          <rect
            x={82}
            y={24 + i * 15}
            width={34}
            height={4}
            rx={2}
            className={i === 1 ? `fill-accent/60 ${A} group-hover:scale-x-110` : "fill-viz-idle/50"}
          />
        </g>
      ))}
    </>
  ),

  responding: () => (
    <>
      <Bubble x={16} y={20} w={66} />
      <Bubble x={74} y={50} w={70} cls={GOOD} className={`${A} group-hover:scale-105`} />
      <text x={16} y={90} className={T}>
        thanks · explain · or fix
      </text>
    </>
  ),

  "reading-diffs": () => (
    <>
      {["README", "core.ts", "core.test", "util.ts"].map((l, i) => (
        <g key={l}>
          <rect
            x={30}
            y={14 + i * 18}
            width={70}
            height={13}
            rx={3}
            className={
              i === 1 ? `${HOT} ${A} group-hover:scale-x-105` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1}
          />
          <text x={36} y={23 + i * 18} className="fill-fg font-mono text-[6px]">
            {l}
          </text>
          <text x={112} y={23 + i * 18} className={T}>
            {[2, 1, 3, 4][i]}
          </text>
        </g>
      ))}
    </>
  ),

  "giving-feedback": () => (
    <>
      <Bubble x={14} y={22} w={56} cls={BAD} />
      <line x1={16} y1={29} x2={66} y2={29} className="stroke-bad" strokeWidth={1.2} />
      <Arrow x1={74} y1={32} x2={86} y2={32} />
      <Bubble x={90} y={22} w={58} cls={GOOD} className={`${A} group-hover:scale-105`} />
      <text x={14} y={74} className={T}>
        specific · kind · explains why
      </text>
    </>
  ),

  "code-review/severity": () => (
    <>
      {[
        ["blocking", BAD],
        ["suggestion", "fill-viz-data/25 stroke-viz-data"],
        ["question", "fill-viz-meta/25 stroke-viz-meta"],
        ["nit", "fill-surface stroke-line-strong"],
      ].map(([l, c], i) => (
        <g key={l}>
          <rect
            x={30}
            y={14 + i * 18}
            width={100 - i * 18}
            height={12}
            rx={6}
            className={`${c} ${i === 0 ? `${A} group-hover:scale-x-105` : ""}`}
            strokeWidth={1.1}
          />
          <text x={36} y={22 + i * 18} className="fill-fg font-mono text-[6px]">
            {l}
          </text>
        </g>
      ))}
    </>
  ),

  "reviewing-tests": () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={30} cy={22 + i * 16} r={5} className={GOOD} strokeWidth={1.1} />
          <rect x={42} y={20 + i * 16} width={50} height={4} rx={2} className="fill-viz-idle/50" />
        </g>
      ))}
      <rect
        x={104}
        y={30}
        width={40}
        height={30}
        rx={4}
        className={`${BAD} ${A} group-hover:scale-105`}
        strokeWidth={1.1}
      />
      <text x={124} y={48} textAnchor="middle" className="fill-bad font-mono text-[6px]">
        mutant
      </text>
      <text x={14} y={92} className={T}>
        would it fail if the code broke?
      </text>
    </>
  ),
};
