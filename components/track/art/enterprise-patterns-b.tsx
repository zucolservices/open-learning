import { A, type ArtMap } from "./kit";
import { Arrow, Cell, Row, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Enterprise Patterns track (modules 12–21), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";

export const enterprisePatternsArtB: ArtMap = {
  "esb-to-api-led": () => (
    <>
      <rect
        x={14}
        y={38}
        width={132}
        height={14}
        rx={4}
        className="fill-bad/10 stroke-bad"
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      <text x={80} y={48} textAnchor="middle" className="fill-muted font-mono text-[6px]">
        ESB: all the logic
      </text>
      {[24, 64, 104, 136].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={22} x2={x} y2={38} className="stroke-line-strong" strokeWidth={1} />
          <Svc
            x={x - 12}
            y={10}
            w={24}
            h={12}
            label="svc"
            cls={i === 1 ? HOT : BOX}
            className={i === 1 ? `${A} group-hover:-translate-y-0.5` : ""}
          />
        </g>
      ))}
      <text x={14} y={78} className={T}>
        smart endpoints, dumb pipes
      </text>
    </>
  ),

  hexagonal: () => (
    <>
      <polygon
        points="80,14 112,32 112,64 80,82 48,64 48,32"
        className={`${HOT} ${A} group-hover:rotate-6`}
        strokeWidth={1.3}
      />
      <text x={80} y={51} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        core
      </text>
      {[
        [14, 24, "web"],
        [118, 24, "DB"],
        [14, 64, "test"],
        [118, 64, "SMS"],
      ].map(([x, y, l]) => (
        <Svc
          key={l as string}
          x={x as number}
          y={y as number}
          w={28}
          h={12}
          label={l as string}
          cls="fill-viz-compute/15 stroke-viz-compute"
        />
      ))}
    </>
  ),

  "monolith-microservices": () => (
    <>
      <rect x={8} y={20} width={40} height={40} rx={3} className={BOX} strokeWidth={1.2} />
      <rect x={58} y={20} width={40} height={40} rx={3} className={HOT} strokeWidth={1.2} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={61 + (i % 2) * 18}
          y={23 + Math.floor(i / 2) * 18}
          width={16}
          height={16}
          rx={1.5}
          className={`fill-surface stroke-accent ${A} group-hover:scale-95`}
          strokeDasharray="2 1.5"
          strokeWidth={0.8}
        />
      ))}
      <Row x={108} y={20} n={3} w={11} gap={3} cls={() => "fill-viz-data/25 stroke-viz-data"} />
      <Row x={108} y={34} n={3} w={11} gap={3} cls={() => "fill-viz-data/25 stroke-viz-data"} />
      <Row x={108} y={48} n={3} w={11} gap={3} cls={() => "fill-viz-data/25 stroke-viz-data"} />
      <text x={8} y={80} className={T}>
        one, modular, many
      </text>
    </>
  ),

  "cqrs-event-sourcing": () => (
    <>
      {["+10,000", "−4,000", "−300", "−2,000", "+2,000"].map((l, i) => (
        <Cell
          key={i}
          x={10}
          y={8 + i * 13}
          w={44}
          h={11}
          label={l}
          cls={
            i === 4 ? `fill-viz-compute/25 stroke-viz-compute` : "fill-viz-meta/20 stroke-viz-meta"
          }
        />
      ))}
      <Arrow x1={60} y1={40} x2={88} y2={40} className={`${A} group-hover:translate-x-1`} />
      <Svc x={92} y={26} w={56} h={14} label="₹5,700" cls={HOT} />
      <Svc x={92} y={46} w={56} h={14} label="by category" cls="fill-viz-add/15 stroke-viz-add" />
      <text x={10} y={92} className={T}>
        store events, derive state
      </text>
    </>
  ),

  "data-ownership": () => (
    <>
      {["orders", "billing", "shipping"].map((l, i) => (
        <g key={l}>
          <Svc x={10 + i * 50} y={12} w={40} h={14} label={l} />
          <line
            x1={30 + i * 50}
            y1={26}
            x2={30 + i * 50}
            y2={44}
            className="stroke-line-strong"
            strokeWidth={1}
          />
          <path
            d={`M${18 + i * 50} 46 v12 a12 3 0 0 0 24 0 v-12`}
            className={
              i === 1
                ? `${HOT} ${A} group-hover:-translate-y-0.5`
                : "fill-viz-data/15 stroke-viz-data"
            }
            strokeWidth={1.1}
          />
          <ellipse
            cx={30 + i * 50}
            cy={46}
            rx={12}
            ry={3}
            className={i === 1 ? HOT : "fill-viz-data/15 stroke-viz-data"}
            strokeWidth={1.1}
          />
        </g>
      ))}
      <text x={10} y={88} className={T}>
        each owns its data
      </text>
    </>
  ),

  "strangler-fig": () => (
    <>
      <rect x={70} y={20} width={20} height={70} className="fill-viz-idle/30" />
      <circle cx={80} cy={22} r={18} className="fill-viz-idle/20" />
      <path
        d="M84 6 C98 30 62 44 86 62 C102 74 70 82 80 92"
        className={`stroke-viz-add ${A} group-hover:-translate-x-0.5`}
        strokeWidth={3}
        fill="none"
      />
      <text x={10} y={40} className="fill-muted font-mono text-[6px]">
        legacy
      </text>
      <text x={110} y={60} className="fill-viz-add font-mono text-[6px]">
        new
      </text>
    </>
  ),

  "legacy-integration": () => (
    <>
      <Svc x={8} y={34} w={36} h={16} label="new app" cls="fill-viz-add/15 stroke-viz-add" />
      <Arrow x1={46} y1={42} x2={60} y2={42} />
      <rect
        x={62}
        y={30}
        width={22}
        height={24}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={73} y={45} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        ACL
      </text>
      <Arrow x1={86} y1={42} x2={100} y2={42} />
      <rect
        x={102}
        y={22}
        width={48}
        height={40}
        rx={2}
        className="fill-viz-idle/20 stroke-viz-idle"
        strokeWidth={1.2}
      />
      <Mono x={106} y={36} text="PIC X(2)" cls="fill-muted" />
      <Mono x={106} y={48} text="mainframe" cls="fill-muted" />
      <text x={8} y={84} className={T}>
        translate at the edge
      </text>
    </>
  ),

  decisions: () => (
    <>
      <rect x={10} y={8} width={70} height={66} rx={3} className={BOX} strokeWidth={1.1} />
      <Mono x={16} y={20} text="ADR 7" cls="fill-accent" />
      {["Context", "Decision", "Status", "Consequences"].map((l, i) => (
        <Mono key={l} x={16} y={32 + i * 10} text={l} cls="fill-muted" />
      ))}
      <Arrow x1={84} y1={40} x2={98} y2={40} />
      <rect
        x={100}
        y={28}
        width={50}
        height={24}
        rx={4}
        className={`fill-good/15 stroke-good ${A} group-hover:-translate-y-0.5`}
        strokeWidth={1.1}
      />
      <text x={125} y={43} textAnchor="middle" className="fill-good font-mono text-[6px]">
        CI ✓ rule
      </text>
      <text x={10} y={90} className={T}>
        record why, check it
      </text>
    </>
  ),

  "enterprise-architecture": () => (
    <>
      {[34, 24, 14, 6].map((r, i) => (
        <circle
          key={r}
          cx={52}
          cy={44}
          r={r}
          className={i === 3 ? "fill-accent stroke-accent" : "stroke-line-strong fill-none"}
          strokeWidth={0.8}
        />
      ))}
      {[
        [40, 30],
        [66, 52],
        [30, 58],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={2.5}
          className={`fill-viz-compute ${A} group-hover:scale-125`}
        />
      ))}
      {["Context", "Container", "Component", "Code"].map((l, i) => (
        <rect
          key={l}
          x={100 + i * 3}
          y={14 + i * 14}
          width={48 - i * 6}
          height={11}
          rx={2}
          className={i === 0 ? HOT : BOX}
          strokeWidth={0.9}
        />
      ))}
      <text x={10} y={92} className={T}>
        radars and zoom levels
      </text>
    </>
  ),

  "capstone-enterprise": () => (
    <>
      <rect
        x={8}
        y={14}
        width={48}
        height={50}
        rx={3}
        className="fill-viz-idle/20 stroke-viz-idle"
        strokeWidth={1.1}
      />
      <text x={32} y={42} textAnchor="middle" className="fill-muted font-mono text-[6px]">
        2005
      </text>
      <Arrow x1={60} y1={39} x2={80} y2={39} className={`${A} group-hover:translate-x-1`} />
      {["apply", "eligible", "pay", "appeal"].map((l, i) => (
        <Svc
          key={l}
          x={84 + (i % 2) * 36}
          y={14 + Math.floor(i / 2) * 26}
          w={32}
          h={20}
          label={l}
          cls={i === 2 ? HOT : "fill-viz-add/15 stroke-viz-add"}
        />
      ))}
      <text x={8} y={84} className={T}>
        no payment missed
      </text>
    </>
  ),
};
