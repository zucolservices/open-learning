import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Bubble, DiffRows } from "./code-review-a";

/** Card illustrations for the Code Review track (modules 12–21), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const codeReviewArtB: ArtMap = {
  "security-review": () => (
    <>
      <rect
        x={18}
        y={18}
        width={62}
        height={60}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <DiffRows x={24} y={26} rows="+++++" hot={1} />
      <path
        d="M118 22 l20 8 v16 c0 14 -10 22 -20 26 c-10 -4 -20 -12 -20 -26 v-16 z"
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={118} y={52} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        input?
      </text>
    </>
  ),

  turnaround: () => (
    <>
      <line x1={14} y1={70} x2={146} y2={70} className="stroke-line-strong" strokeWidth={1} />
      {["M", "T", "W", "T", "F"].map((d, i) => (
        <text key={i} x={22 + i * 28} y={82} className={T}>
          {d}
        </text>
      ))}
      <rect x={20} y={40} width={110} height={8} rx={4} className={BAD} strokeWidth={1} />
      <rect
        x={20}
        y={54}
        width={18}
        height={8}
        rx={4}
        className={`${GOOD} ${A} group-hover:scale-x-125`}
        strokeWidth={1}
      />
      <text x={20} y={34} className={T}>
        waiting is the hidden cost
      </text>
    </>
  ),

  reviewers: () => (
    <>
      <rect
        x={14}
        y={20}
        width={70}
        height={52}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      {["*", "/pay/", "*.sql"].map((l, i) => (
        <text
          key={l}
          x={20}
          y={34 + i * 14}
          className={i === 2 ? "fill-accent font-mono text-[7px]" : "fill-fg font-mono text-[7px]"}
        >
          {l}
        </text>
      ))}
      <Arrow x1={88} y1={60} x2={104} y2={50} />
      <circle
        cx={118}
        cy={44}
        r={9}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <circle
        cx={138}
        cy={44}
        r={9}
        className="fill-viz-data/25 stroke-viz-data"
        strokeWidth={1.2}
      />
      <text x={110} y={70} className={T}>
        last match wins
      </text>
    </>
  ),

  "review-automation": () => (
    <>
      {["fmt", "lint", "tests", "bots"].map((l, i) => (
        <Svc key={l} x={10 + i * 30} y={40} w={24} h={16} label={l} cls={GOOD} />
      ))}
      <Arrow x1={128} y1={48} x2={134} y2={48} />
      <circle
        cx={146}
        cy={48}
        r={8}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={10} y={80} className={T}>
        robots first, then a person
      </text>
    </>
  ),

  "ai-review": () => (
    <>
      <rect
        x={18}
        y={22}
        width={30}
        height={26}
        rx={6}
        className="fill-viz-meta/25 stroke-viz-meta"
        strokeWidth={1.2}
      />
      <circle cx={28} cy={34} r={2.4} className="fill-viz-meta" />
      <circle cx={38} cy={34} r={2.4} className="fill-viz-meta" />
      <Bubble x={56} y={14} w={46} cls={GOOD} />
      <Bubble x={56} y={40} w={46} cls={BAD} />
      <circle
        cx={130}
        cy={58}
        r={11}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={130} y={60} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        you
      </text>
      <text x={18} y={92} className={T}>
        fast first pass · human decides
      </text>
    </>
  ),

  "psychological-safety": () => (
    <>
      {[30, 64, 98].map((x, i) => (
        <g key={x}>
          <circle
            cx={x}
            cy={58}
            r={10}
            className={
              i === 2 ? `${HOT} ${A} group-hover:scale-110` : "fill-viz-data/25 stroke-viz-data"
            }
            strokeWidth={1.2}
          />
        </g>
      ))}
      <Bubble x={100} y={18} w={44} cls={GOOD} className={`${A} group-hover:scale-105`} />
      <text x={14} y={90} className={T}>
        safe to ask, safe to be wrong
      </text>
    </>
  ),

  disagreements: () => (
    <>
      {["rules", "talk", "decide"].map((l, i) => (
        <g key={l}>
          <rect
            x={20 + i * 34}
            y={62 - i * 18}
            width={40}
            height={14}
            rx={3}
            className={
              i === 2 ? `${HOT} ${A} group-hover:scale-105` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1.1}
          />
          <text
            x={40 + i * 34}
            y={71 - i * 18}
            textAnchor="middle"
            className="fill-fg font-mono text-[6px]"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={20} y={92} className={T}>
        settle at the lowest rung
      </text>
    </>
  ),

  alternatives: () => (
    <>
      {["ship", "show", "ask", "pair", "mob"].map((l, i) => (
        <g key={l}>
          <rect
            x={14 + i * 27}
            y={60 - i * 8}
            width={22}
            height={14 + i * 8}
            rx={3}
            className={
              i === 3 ? `${HOT} ${A} group-hover:scale-y-110` : "fill-viz-data/25 stroke-viz-data"
            }
            strokeWidth={1}
          />
          <text x={25 + i * 27} y={86} textAnchor="middle" className={T}>
            {l}
          </text>
        </g>
      ))}
    </>
  ),

  "review-metrics": () => (
    <>
      <path
        d="M16 70 L46 56 L76 60 L106 38 L140 30"
        className="stroke-viz-data"
        strokeWidth={1.4}
        fill="none"
      />
      <circle
        cx={140}
        cy={30}
        r={4}
        className={`${GOOD} ${A} group-hover:scale-125`}
        strokeWidth={1.2}
      />
      <rect x={20} y={14} width={46} height={12} rx={3} className={BAD} strokeWidth={1} />
      <text x={43} y={22} textAnchor="middle" className="fill-bad font-mono text-[5.5px]">
        no leaderboards
      </text>
      <text x={16} y={88} className={T}>
        measure flow, not people
      </text>
    </>
  ),

  "capstone-review": () => (
    <>
      <rect
        x={20}
        y={14}
        width={70}
        height={72}
        rx={5}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <DiffRows x={28} y={22} rows=" +-+++" hot={3} />
      <Bubble x={96} y={22} w={50} cls={HOT} />
      <circle
        cx={120}
        cy={66}
        r={10}
        className={`${GOOD} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <path d="M115 66l3 3l6 -6" className="stroke-good" strokeWidth={1.6} fill="none" />
    </>
  ),
};
