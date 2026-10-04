import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Line, Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the AI Agents track (modules 12–21), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";
const TOOL = "fill-viz-compute/20 stroke-viz-compute";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const aiAgentsArtB: ArtMap = {
  "durable-agents": () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle cx={20 + i * 30} cy={36} r={7} className={i < 3 ? GOOD : BOX} strokeWidth={1.2} />
          {i < 4 && (
            <line
              x1={27 + i * 30}
              y1={36}
              x2={43 + i * 30}
              y2={36}
              className="stroke-line-strong"
            />
          )}
          {i < 3 && (
            <rect x={16 + i * 30} y={48} width={8} height={6} rx={1} className="fill-accent/60" />
          )}
        </g>
      ))}
      <text x={92} y={22} className={`fill-bad font-mono text-[8px] ${A} group-hover:scale-110`}>
        ✗ crash
      </text>
      <text x={10} y={70} className="fill-muted font-mono text-[6px]">
        checkpoints ▪ resume from step 3
      </text>
      <text x={10} y={88} className={T}>
        save the game after every step
      </text>
    </>
  ),

  "ai-agents/multi-agent": () => (
    <>
      <Svc x={60} y={10} w={40} h={14} label="lead" cls={HOT} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Arrow
            x1={80}
            y1={24}
            x2={28 + i * 52}
            y2={44}
            className={`${A} group-hover:translate-y-0.5`}
          />
          <Svc x={10 + i * 52} y={46} w={36} h={13} label="worker" cls={TOOL} />
        </g>
      ))}
      <text x={10} y={86} className={T}>
        split only what splits
      </text>
    </>
  ),

  "agent-protocols": () => (
    <>
      <Svc x={10} y={26} w={46} h={18} label="travel agent" cls={HOT} />
      <Svc x={104} y={26} w={46} h={18} label="hotel agent" cls={TOOL} />
      <Arrow x1={58} y1={31} x2={102} y2={31} className={`${A} group-hover:translate-x-0.5`} />
      <Arrow x1={102} y1={40} x2={58} y2={40} />
      <text x={80} y={24} textAnchor="middle" className="fill-accent font-mono text-[6px]">
        A2A task
      </text>
      <rect x={104} y={52} width={46} height={14} rx={2} className={BOX} strokeWidth={0.8} />
      <text x={127} y={61} textAnchor="middle" className="fill-muted font-mono text-[5px]">
        agent-card.json
      </text>
      <text x={10} y={86} className={T}>
        agents across companies
      </text>
    </>
  ),

  "agent-frameworks": () => (
    <>
      {["API", "SDK", "framework", "platform"].map((l, i) => (
        <g key={l}>
          <rect
            x={10 + i * 36}
            y={58 - i * 10}
            width={32}
            height={14 + i * 10}
            rx={3}
            className={i === 3 ? HOT : BOX}
            strokeWidth={1}
          />
          <text
            x={26 + i * 36}
            y={68}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <Arrow x1={14} y1={24} x2={140} y2={24} className={`${A} group-hover:translate-x-0.5`} />
      <text x={14} y={18} className="fill-muted font-mono text-[5.5px]">
        more handled for you →
      </text>
    </>
  ),

  "ai-agents/guardrails": () => (
    <>
      <Svc x={12} y={30} w={34} h={16} label="agent" cls={HOT} />
      {[
        ["read", GOOD],
        ["draft", GOOD],
        ["delete", BAD],
      ].map(([l, c], i) => (
        <g key={l}>
          <Arrow x1={48} y1={38} x2={96} y2={20 + i * 18} />
          <Svc
            x={98}
            y={14 + i * 18}
            w={48}
            h={13}
            label={l}
            cls={`${c} ${i === 2 ? `${A} group-hover:translate-x-0.5` : ""}`}
          />
        </g>
      ))}
      <text x={10} y={86} className={T}>
        only the access the job needs
      </text>
    </>
  ),

  "agent-security": () => (
    <>
      {[
        [30, 22, "private data"],
        [130, 22, "untrusted text"],
        [80, 64, "a way out"],
      ].map(([x, y, l]) => (
        <g key={l as string}>
          <circle cx={x as number} cy={y as number} r={13} className={BAD} strokeWidth={1.2} />
          <text
            x={x as number}
            y={(y as number) + 2}
            textAnchor="middle"
            className="fill-fg font-mono text-[5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <path
        d="M43 26 L117 26 M37 34 L72 54 M123 34 L88 54"
        className={`stroke-bad ${A} group-hover:opacity-40`}
        strokeWidth={1.2}
        strokeDasharray="3 2"
      />
    </>
  ),

  "human-in-the-loop": () => (
    <>
      <Svc x={10} y={30} w={38} h={14} label="agent" cls={HOT} />
      <Arrow x1={50} y1={37} x2={70} y2={37} />
      <rect x={72} y={22} width={78} height={30} rx={4} className={BOX} strokeWidth={1} />
      <Mono x={77} y={33} text="Pay ₹48,000?" />
      <rect x={78} y={39} width={26} height={9} rx={2} className={GOOD} />
      <rect
        x={110}
        y={39}
        width={26}
        height={9}
        rx={2}
        className={`${BAD} ${A} group-hover:scale-105`}
      />
      <text x={91} y={46} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        yes
      </text>
      <text x={123} y={46} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        no
      </text>
      <text x={10} y={86} className={T}>
        ask at the moments that matter
      </text>
    </>
  ),

  "agent-evals": () => (
    <>
      {["outcome", "path", "cost"].map((l, i) => (
        <g key={l}>
          <Svc x={12} y={14 + i * 18} w={40} h={13} label={l} cls={BOX} />
          <text
            x={58}
            y={23 + i * 18}
            className={i === 1 ? "fill-bad font-mono text-[7px]" : "fill-good font-mono text-[7px]"}
          >
            {i === 1 ? "✗" : "✓"}
          </text>
        </g>
      ))}
      <text x={86} y={32} className="fill-fg font-mono text-[9px] font-semibold">
        pass^3
      </text>
      <text x={86} y={46} className={`fill-accent font-mono text-[9px] ${A} group-hover:scale-110`}>
        42%
      </text>
      <text x={10} y={86} className={T}>
        right result, right way, every time
      </text>
    </>
  ),

  "agent-ops": () => (
    <>
      {[
        [10, 30, HOT],
        [42, 14, TOOL],
        [58, 50, HOT],
        [110, 14, TOOL],
        [126, 26, HOT],
      ].map(([x, w, c], i) => (
        <rect
          key={i}
          x={x as number}
          y={18 + i * 9}
          width={w as number}
          height={6}
          rx={2}
          className={`${c} ${i === 2 ? `${A} group-hover:scale-x-75` : ""}`}
          strokeWidth={0.8}
        />
      ))}
      <Line x={10} y={64} w={140} h={8} v={[0.9, 0.7, 0.5, 0.35, 0.3]} cls="stroke-good" />
      <text x={10} y={88} className={T}>
        trace it, then trim it
      </text>
    </>
  ),

  "capstone-agent": () => (
    <>
      <rect x={12} y={12} width={60} height={58} rx={4} className={BOX} strokeWidth={1.2} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle cx={22} cy={22 + i * 11} r={3} className={i === 1 ? "fill-bad" : "fill-good"} />
          <rect
            x={30}
            y={20 + i * 11}
            width={34 - (i % 2) * 8}
            height={4}
            rx={1}
            className="fill-surface-2"
          />
        </g>
      ))}
      <Arrow x1={76} y1={40} x2={96} y2={40} className={`${A} group-hover:translate-x-1`} />
      <Svc x={100} y={32} w={50} h={16} label="ready to launch" cls={GOOD} />
      <text x={10} y={88} className={T}>
        design, break, fix
      </text>
    </>
  ),
};
