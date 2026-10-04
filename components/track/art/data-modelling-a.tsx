import { A, type ArtMap } from "./kit";
import { Arrow, Cell, Row, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Data Modelling track (modules 1–11), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";

export const dataModellingArtA: ArtMap = {
  "why-model": () => (
    <>
      {["asha rao ", "Asha Rao", "A. Rao"].map((l, i) => (
        <Mono key={l} x={12} y={20 + i * 11} text={l} cls="fill-bad" />
      ))}
      <Arrow x1={64} y1={32} x2={90} y2={32} className={`${A} group-hover:translate-x-1`} />
      <Svc x={96} y={22} w={54} h={20} label="customer 1" cls={HOT} />
      <text x={10} y={84} className={T}>
        decide what things are
      </text>
    </>
  ),

  "model-levels": () => (
    <>
      {["sketch", "plan", "blueprint"].map((l, i) => (
        <rect
          key={l}
          x={14 + i * 46}
          y={18 + i * 6}
          width={40}
          height={36 - i * 6}
          rx={3}
          className={i === 2 ? `${HOT} ${A} group-hover:-translate-y-0.5` : BOX}
          strokeWidth={1}
        />
      ))}
      {["concept", "logical", "physical"].map((l, i) => (
        <text
          key={l}
          x={34 + i * 46}
          y={66}
          textAnchor="middle"
          className="fill-muted font-mono text-[6px]"
        >
          {l}
        </text>
      ))}
      <text x={10} y={88} className={T}>
        more detail at each level
      </text>
    </>
  ),

  "keys-relationships": () => (
    <>
      <Svc x={10} y={26} w={44} h={16} label="customers" cls={DATA} />
      <Svc x={106} y={26} w={44} h={16} label="orders" cls={DATA} />
      <path d="M54 34 H106" className="stroke-accent" strokeWidth={1.2} />
      <path
        d="M96 34 L106 28 M96 34 L106 40"
        className={`stroke-accent ${A} group-hover:translate-x-0.5`}
        strokeWidth={1.2}
      />
      <Mono x={12} y={58} text="PK id" cls="fill-accent" />
      <Mono x={106} y={58} text="FK customer_id" cls="fill-accent" />
      <text x={10} y={86} className={T}>
        lockers and claim tickets
      </text>
    </>
  ),

  normalisation: () => (
    <>
      <rect
        x={10}
        y={16}
        width={56}
        height={40}
        rx={2}
        className="fill-bad/10 stroke-bad"
        strokeWidth={1}
      />
      {[0, 1, 2].map((r) => (
        <Mono key={r} x={14} y={28 + r * 10} text="Asha 98450 …" cls="fill-bad" />
      ))}
      <Arrow x1={70} y1={36} x2={86} y2={36} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={92 + (i % 2) * 30}
          y={14 + Math.floor(i / 2) * 24}
          width={26}
          height={18}
          rx={2}
          className={i === 0 ? `${HOT} ${A} group-hover:scale-105` : DATA}
          strokeWidth={1}
        />
      ))}
      <text x={10} y={84} className={T}>
        each fact in one place
      </text>
    </>
  ),

  "oltp-olap": () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={12 + i * 8}
          y={30}
          width={5}
          height={12}
          rx={1}
          className="fill-viz-data"
        />
      ))}
      <text x={30} y={56} textAnchor="middle" className="fill-muted font-mono text-[6px]">
        many small writes
      </text>
      <rect
        x={96}
        y={18}
        width={52}
        height={30}
        rx={3}
        className={`fill-viz-meta/25 stroke-viz-meta ${A} group-hover:scale-105`}
        strokeWidth={1}
      />
      <text x={122} y={36} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        SUM over years
      </text>
      <text x={10} y={84} className={T}>
        the till and the accounts
      </text>
    </>
  ),

  "star-schema": () => (
    <>
      {[
        [30, 18],
        [130, 18],
        [30, 62],
        [130, 62],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1={80} y1={40} x2={x} y2={y} className="stroke-line-strong" strokeWidth={1} />
          <rect x={x - 16} y={y - 7} width={32} height={14} rx={3} className="fill-surface" />
          <rect
            x={x - 16}
            y={y - 7}
            width={32}
            height={14}
            rx={3}
            className={DATA}
            strokeWidth={1}
          />
        </g>
      ))}
      <rect x={60} y={30} width={40} height={20} rx={4} className="fill-surface" />
      <rect
        x={60}
        y={30}
        width={40}
        height={20}
        rx={4}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={80} y={43} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        facts
      </text>
      <text x={10} y={92} className={T}>
        facts in the middle
      </text>
    </>
  ),

  grain: () => (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={12 + i * 48}
          y={20}
          width={40}
          height={34}
          rx={3}
          className={i === 0 ? HOT : BOX}
          strokeWidth={1}
        />
      ))}
      <Row x={16} y={30} n={3} w={9} gap={3} cls={() => "fill-viz-data/40 stroke-viz-data"} />
      <Mono x={64} y={40} text="per receipt" cls="fill-muted" />
      <Mono x={112} y={40} text="per day" cls="fill-muted" />
      <text x={10} y={84} className={T}>
        what one row means
      </text>
    </>
  ),

  "fact-tables": () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <Cell key={i} x={10} y={12 + i * 13} w={36} h={10} cls={DATA} />
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={62 + i * 14}
          y={52 - (i + 1) * 10}
          width={10}
          height={(i + 1) * 10}
          rx={1}
          className="fill-viz-meta/40"
        />
      ))}
      <rect
        x={112}
        y={22}
        width={40}
        height={14}
        rx={2}
        className={`${HOT} ${A} group-hover:-translate-y-0.5`}
        strokeWidth={1}
      />
      <Mono x={115} y={32} text="✓ ✓ ✓ –" cls="fill-accent" />
      <text x={10} y={84} className={T}>
        events, snapshots, pipelines
      </text>
    </>
  ),

  "conformed-dimensions": () => (
    <>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}${c}`}
            x={46 + c * 26}
            y={14 + r * 16}
            width={22}
            height={12}
            rx={2}
            className={
              (r + c) % 3 !== 2
                ? c === 0
                  ? `${HOT} ${A} group-hover:scale-105`
                  : "fill-accent/30"
                : BOX
            }
            strokeWidth={0.8}
          />
        )),
      )}
      {["sales", "stock", "orders"].map((l, i) => (
        <text key={l} x={10} y={23 + i * 16} className="fill-muted font-mono text-[6px]">
          {l}
        </text>
      ))}
      <text x={10} y={84} className={T}>
        one calendar for everyone
      </text>
    </>
  ),

  "dimension-patterns": () => (
    <>
      {[
        [10, 10, "date"],
        [110, 10, "date"],
        [10, 54, "flags"],
        [110, 54, "#1042"],
      ].map(([x, y, l], i) => (
        <g key={i}>
          <line
            x1={80}
            y1={38}
            x2={(x as number) + 20}
            y2={(y as number) + 7}
            className="stroke-line-strong"
            strokeWidth={0.8}
          />
          <rect
            x={x as number}
            y={y as number}
            width={40}
            height={14}
            rx={3}
            className="fill-surface"
          />
          <Svc
            x={x as number}
            y={y as number}
            w={40}
            h={14}
            label={l as string}
            cls={i === 3 ? "fill-none stroke-line-strong" : DATA}
            className={i === 2 ? `${A} group-hover:scale-105` : ""}
          />
        </g>
      ))}
      <rect x={60} y={30} width={40} height={16} rx={3} className="fill-surface" />
      <Svc x={60} y={30} w={40} h={16} label="fact" cls={HOT} />
      <text x={10} y={90} className={T}>
        roles, junk, degenerate
      </text>
    </>
  ),

  scd: () => (
    <>
      <Mono x={12} y={22} text="101 Asha Pune   → 1 Jul" cls="fill-muted" />
      <Mono x={12} y={34} text="102 Asha Mumbai  1 Jul →" cls="fill-accent" />
      <rect
        x={10}
        y={27}
        width={112}
        height={10}
        rx={2}
        className={`fill-accent/10 ${A} group-hover:scale-x-105`}
      />
      <text x={10} y={84} className={T}>
        add a row, keep history
      </text>
    </>
  ),
};
