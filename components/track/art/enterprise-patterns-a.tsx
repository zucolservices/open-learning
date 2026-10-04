import { A, type ArtMap } from "./kit";
import { Arrow, Cell, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Enterprise Patterns track (modules 1–11), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";

export const enterprisePatternsArtA: ArtMap = {
  "why-enterprise": () => (
    <>
      <Svc
        x={60}
        y={8}
        w={40}
        h={14}
        label="core"
        cls={HOT}
        className={`${A} group-hover:-translate-y-0.5`}
      />
      {[
        [12, 40, "CRM"],
        [62, 46, "cards"],
        [112, 40, "loans"],
        [24, 70, "mktg"],
        [100, 70, "DW"],
      ].map(([x, y, l], i) => (
        <g key={l as string}>
          <line
            x1={80}
            y1={22}
            x2={(x as number) + 18}
            y2={y as number}
            className={i > 2 ? "stroke-bad" : "stroke-line-strong"}
            strokeWidth={1}
            strokeDasharray={i > 2 ? "2 2" : undefined}
          />
          <Svc x={x as number} y={y as number} w={36} h={12} label={l as string} />
        </g>
      ))}
      <text x={8} y={96} className={T}>
        one address, many copies
      </text>
    </>
  ),

  "conways-law": () => (
    <>
      {["team A", "team B", "team C"].map((t, i) => (
        <g key={t}>
          <Svc
            x={10}
            y={12 + i * 24}
            w={44}
            h={16}
            label={t}
            cls="fill-viz-compute/15 stroke-viz-compute"
          />
          <Arrow
            x1={58}
            y1={20 + i * 24}
            x2={92}
            y2={20 + i * 24}
            className={i === 1 ? `${A} group-hover:translate-x-1` : ""}
          />
          <Svc
            x={96}
            y={12 + i * 24}
            w={52}
            h={16}
            label={`part ${"ABC"[i]}`}
            cls="fill-viz-data/15 stroke-viz-data"
          />
        </g>
      ))}
      <text x={10} y={94} className={T}>
        systems mirror teams
      </text>
    </>
  ),

  "domain-language": () => (
    <>
      <text x={80} y={22} textAnchor="middle" className="fill-fg font-mono text-[10px]">
        &ldquo;customer&rdquo;
      </text>
      {[
        [20, "prospect"],
        [60, "payer"],
        [100, "caller"],
        [140, "claimant"],
      ].map(([x, l], i) => (
        <g key={l as string}>
          <line
            x1={80}
            y1={28}
            x2={x as number}
            y2={52}
            className="stroke-line-strong"
            strokeWidth={1}
          />
          <Cell
            x={(x as number) - 18}
            y={52}
            w={36}
            h={14}
            label={l as string}
            cls={i === 1 ? HOT : BOX}
            className={i === 1 ? `${A} group-hover:-translate-y-0.5` : ""}
          />
        </g>
      ))}
      <text x={8} y={92} className={T}>
        one word, four meanings
      </text>
    </>
  ),

  "bounded-contexts": () => (
    <>
      {[
        [8, "Sales", "Prospect"],
        [60, "Billing", "Payer"],
        [112, "Claims", "Claimant"],
      ].map(([x, ctx, m], i) => (
        <g key={ctx as string} className={i === 1 ? `${A} group-hover:-translate-y-1` : ""}>
          <rect
            x={x as number}
            y={14}
            width={44}
            height={56}
            rx={8}
            className="fill-accent/5 stroke-accent"
            strokeDasharray="4 3"
            strokeWidth={1.2}
          />
          <text
            x={(x as number) + 22}
            y={26}
            textAnchor="middle"
            className="fill-accent text-[6px] font-semibold"
          >
            {ctx as string}
          </text>
          <Cell x={(x as number) + 5} y={36} w={34} h={14} label={m as string} cls={BOX} />
        </g>
      ))}
      <text x={8} y={88} className={T}>
        a model per boundary
      </text>
    </>
  ),

  "context-mapping": () => (
    <>
      <path
        d="M0 30 C50 36 90 60 160 74"
        className="stroke-viz-data/50"
        strokeWidth={8}
        fill="none"
      />
      <Svc x={14} y={8} w={46} h={14} label="upstream" cls={BOX} />
      <Svc
        x={100}
        y={48}
        w={52}
        h={14}
        label="downstream"
        cls={HOT}
        className={`${A} group-hover:translate-x-0.5`}
      />
      <rect x={92} y={44} width={6} height={22} rx={2} className="fill-viz-compute/50" />
      <text x={66} y={88} className="fill-muted font-mono text-[6px]">
        ACL protects the downstream
      </text>
    </>
  ),

  aggregates: () => (
    <>
      <rect
        x={20}
        y={10}
        width={120}
        height={60}
        rx={8}
        className="fill-accent/5 stroke-accent"
        strokeWidth={1.2}
      />
      <Svc
        x={60}
        y={16}
        w={40}
        h={14}
        label="Order"
        cls={HOT}
        className={`${A} group-hover:-translate-y-0.5`}
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line
            x1={80}
            y1={30}
            x2={42 + i * 38}
            y2={44}
            className="stroke-line-strong"
            strokeWidth={1}
          />
          <Svc x={28 + i * 38} y={44} w={28} h={12} label="line" />
        </g>
      ))}
      <Mono x={20} y={84} text="v7 → save only if still v7" cls="fill-muted" />
    </>
  ),

  "event-storming": () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={10 + i * 29}
          y={26 + (i % 2) * 4}
          width={24}
          height={20}
          rx={1}
          className={`fill-viz-compute/40 stroke-viz-compute ${i === 2 ? `${A} group-hover:-rotate-3` : ""}`}
          strokeWidth={0.8}
          transform={`rotate(${i % 2 ? 3 : -3} ${22 + i * 29} ${36 + (i % 2) * 4})`}
        />
      ))}
      <rect
        x={68}
        y={58}
        width={22}
        height={14}
        rx={1}
        className="fill-viz-data/40 stroke-viz-data"
        strokeWidth={0.8}
      />
      <rect
        x={96}
        y={58}
        width={22}
        height={14}
        rx={1}
        className="fill-bad/30 stroke-bad"
        strokeWidth={0.8}
        strokeDasharray="2 1"
      />
      <Arrow x1={10} y1={14} x2={150} y2={14} cls="stroke-line" />
      <text x={10} y={92} className={T}>
        past tense, in order
      </text>
    </>
  ),

  "integration-styles": () => (
    <>
      {["file", "shared DB", "call", "message"].map((l, i) => (
        <g key={l}>
          <Svc x={10} y={8 + i * 20} w={26} h={12} label="A" />
          <Arrow
            x1={40}
            y1={14 + i * 20}
            x2={116}
            y2={14 + i * 20}
            dash={i === 3 ? "4 2" : undefined}
            className={i === 3 ? `${A} group-hover:translate-x-1` : ""}
          />
          <text
            x={78}
            y={11 + i * 20}
            textAnchor="middle"
            className="fill-muted font-mono text-[5.5px]"
          >
            {l}
          </text>
          <Svc x={120} y={8 + i * 20} w={26} h={12} label="B" cls={i === 3 ? HOT : BOX} />
        </g>
      ))}
      <text x={10} y={96} className={T}>
        four ways to integrate
      </text>
    </>
  ),

  "messaging-patterns": () => (
    <>
      <Svc x={8} y={36} w={30} h={14} label="send" />
      <rect x={46} y={36} width={48} height={14} rx={7} className={HOT} strokeWidth={1.2} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={52 + i * 13}
          y={39}
          width={9}
          height={8}
          rx={1.5}
          className={`fill-viz-data/40 stroke-viz-data ${A} group-hover:translate-x-1`}
          strokeWidth={0.8}
        />
      ))}
      <Arrow x1={38} y1={43} x2={45} y2={43} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Arrow x1={96} y1={43} x2={118} y2={20 + i * 23} />
          <Svc x={120} y={14 + i * 23} w={30} h={12} label={`sub ${i + 1}`} />
        </g>
      ))}
      <text x={8} y={92} className={T}>
        channels carry messages
      </text>
    </>
  ),

  "routing-transformation": () => (
    <>
      <Svc x={8} y={36} w={26} h={14} label="order" />
      <Arrow x1={36} y1={43} x2={50} y2={43} />
      <polygon
        points="52,43 66,30 80,43 66,56"
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={66} y={45} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        route
      </text>
      {["books", "phones", "grocery"].map((l, i) => (
        <g key={l}>
          <Arrow x1={82} y1={43} x2={112} y2={18 + i * 25} />
          <Svc x={114} y={12 + i * 25} w={38} h={12} label={l} />
        </g>
      ))}
      <text x={8} y={92} className={T}>
        split, route, combine
      </text>
    </>
  ),

  "orchestration-choreography": () => (
    <>
      <circle
        cx={40}
        cy={42}
        r={8}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      {[0, 1, 2, 3].map((i) => {
        const pts = [
          [16, 18],
          [64, 18],
          [16, 66],
          [64, 66],
        ][i];
        return (
          <g key={i}>
            <line
              x1={40}
              y1={42}
              x2={pts[0]}
              y2={pts[1]}
              className="stroke-accent"
              strokeWidth={1}
            />
            <circle cx={pts[0]} cy={pts[1]} r={5} className={BOX} strokeWidth={1} />
          </g>
        );
      })}
      {[0, 1, 2, 3].map((i) => {
        const pts = [
          [104, 20],
          [146, 30],
          [138, 66],
          [100, 60],
        ];
        const [x, y] = pts[i];
        const [nx, ny] = pts[(i + 1) % 4];
        return (
          <g key={`c${i}`}>
            <line
              x1={x}
              y1={y}
              x2={nx}
              y2={ny}
              className="stroke-viz-meta"
              strokeWidth={1}
              strokeDasharray="3 2"
            />
            <circle cx={x} cy={y} r={5} className={BOX} strokeWidth={1} />
          </g>
        );
      })}
      <text x={10} y={92} className={T}>
        conductor or dancers
      </text>
    </>
  ),
};
