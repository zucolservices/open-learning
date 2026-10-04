import { A, type ArtMap } from "./kit";
import { Arrow, Cell, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Data Modelling track (modules 12–21), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";

export const dataModellingArtB: ArtMap = {
  "inmon-kimball": () => (
    <>
      <rect
        x={10}
        y={14}
        width={64}
        height={14}
        rx={2}
        className="fill-viz-meta/30 stroke-viz-meta"
        strokeWidth={1}
      />
      <text x={42} y={24} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        3NF warehouse
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={12 + i * 22}
          y={36}
          width={18}
          height={12}
          rx={2}
          className={DATA}
          strokeWidth={1}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={104 + i * 20}
          cy={31}
          r={8}
          className={i === 0 ? `${HOT} ${A} group-hover:scale-110` : DATA}
          strokeWidth={1}
        />
      ))}
      <line x1={96} y1={46} x2={152} y2={46} className="stroke-viz-compute" strokeWidth={2} />
      <text x={10} y={84} className={T}>
        roads first, or street by street
      </text>
    </>
  ),

  "data-vault": () => (
    <>
      <Svc x={14} y={26} w={34} h={16} label="hub" cls={DATA} />
      <Svc x={112} y={26} w={34} h={16} label="hub" cls={DATA} />
      <Svc x={63} y={26} w={34} h={16} label="link" cls="fill-viz-compute/20 stroke-viz-compute" />
      <path d="M48 34 H63 M97 34 H112" className="stroke-line-strong" strokeWidth={1} />
      {[0, 1, 2].map((i) => (
        <Cell
          key={i}
          x={14 + i * 4}
          y={50 + i * 6}
          w={34}
          h={8}
          cls={`fill-viz-meta/25 stroke-viz-meta ${i === 2 ? `${A} group-hover:translate-y-0.5` : ""}`}
        />
      ))}
      <text x={10} y={90} className={T}>
        hubs, links, satellites
      </text>
    </>
  ),

  "wide-tables": () => (
    <>
      <rect x={10} y={18} width={140} height={36} rx={2} className={BOX} strokeWidth={1} />
      {Array.from({ length: 14 }, (_, i) => (
        <line
          key={i}
          x1={20 + i * 10}
          y1={18}
          x2={20 + i * 10}
          y2={54}
          className={i === 3 || i === 9 ? "stroke-accent" : "stroke-line"}
          strokeWidth={i === 3 || i === 9 ? 2 : 0.5}
        />
      ))}
      <rect
        x={10}
        y={18}
        width={140}
        height={36}
        rx={2}
        className={`stroke-accent/0 fill-none ${A} group-hover:stroke-accent/60`}
        strokeWidth={1}
      />
      <text x={10} y={84} className={T}>
        one wide table, read two columns
      </text>
    </>
  ),

  "semantic-layer": () => (
    <>
      <rect
        x={52}
        y={10}
        width={56}
        height={18}
        rx={4}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={80} y={22} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        active_customers
      </text>
      {["BI", "sheet", "notebook"].map((l, i) => (
        <g key={l}>
          <Arrow x1={80} y1={30} x2={30 + i * 50} y2={46} />
          <Svc x={12 + i * 50} y={48} w={36} h={14} label={`${l}: 5`} cls={DATA} />
        </g>
      ))}
      <text x={10} y={88} className={T}>
        define once, same everywhere
      </text>
    </>
  ),

  "dbt-layers": () => (
    <>
      {["src", "stg_", "int_", "fct_"].map((l, i) => (
        <g key={l}>
          <Svc
            x={8 + i * 38}
            y={30}
            w={30}
            h={14}
            label={l}
            cls={i === 3 ? HOT : DATA}
            className={i === 3 ? `${A} group-hover:-translate-y-0.5` : ""}
          />
          {i < 3 && <Arrow x1={39 + i * 38} y1={37} x2={45 + i * 38} y2={37} />}
        </g>
      ))}
      <text x={10} y={84} className={T}>
        layers, refs and tests
      </text>
    </>
  ),

  "nosql-modelling": () => (
    <>
      <rect x={10} y={14} width={64} height={46} rx={4} className={DATA} strokeWidth={1} />
      <Mono x={14} y={26} text="{ order: O-1," cls="fill-fg" />
      <Mono x={14} y={36} text="  items: [ … ] }" cls="fill-accent" />
      {["CUST#C-17", "ORDER#O-1", "REST#R-5"].map((l, i) => (
        <Cell
          key={l}
          x={86}
          y={14 + i * 15}
          w={64}
          h={12}
          label={l}
          cls={i === 0 ? `${HOT} ${A} group-hover:translate-x-0.5` : BOX}
        />
      ))}
      <text x={10} y={84} className={T}>
        questions first
      </text>
    </>
  ),

  "graph-modelling": () => (
    <>
      {[
        [30, 24],
        [80, 16],
        [130, 30],
        [60, 58],
        [110, 62],
      ].map(([x, y], i, arr) => (
        <g key={i}>
          {i > 0 && (
            <line
              x1={arr[i - 1][0]}
              y1={arr[i - 1][1]}
              x2={x}
              y2={y}
              className={i < 3 ? "stroke-bad" : "stroke-line-strong"}
              strokeWidth={1.2}
            />
          )}
        </g>
      ))}
      {[
        [30, 24],
        [80, 16],
        [130, 30],
        [60, 58],
        [110, 62],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={7}
          className={
            i === 0
              ? `fill-bad/30 stroke-bad ${A} group-hover:scale-110`
              : "fill-surface stroke-viz-data"
          }
          strokeWidth={1.2}
        />
      ))}
      <text x={10} y={88} className={T}>
        follow the connections
      </text>
    </>
  ),

  "modelling-time": () => (
    <>
      <rect
        x={20}
        y={14}
        width={50}
        height={46}
        className="fill-viz-data/25 stroke-viz-data"
        strokeWidth={0.8}
      />
      <rect
        x={70}
        y={14}
        width={70}
        height={22}
        className={`fill-viz-compute/30 stroke-viz-compute ${A} group-hover:scale-105`}
        strokeWidth={0.8}
      />
      <rect
        x={70}
        y={36}
        width={70}
        height={24}
        className="fill-viz-data/25 stroke-viz-data"
        strokeWidth={0.8}
      />
      <text x={80} y={70} className="fill-muted font-mono text-[6px]">
        valid →
      </text>
      <text x={8} y={12} className="fill-muted font-mono text-[6px]">
        ↑ recorded
      </text>
      <text x={10} y={88} className={T}>
        two clocks
      </text>
    </>
  ),

  "evolving-models": () => (
    <>
      <Svc
        x={12}
        y={20}
        w={56}
        h={14}
        label="dim_customers_v1"
        cls="fill-viz-idle/20 stroke-viz-idle"
      />
      <Svc
        x={12}
        y={40}
        w={56}
        h={14}
        label="dim_customers_v2"
        cls={HOT}
        className={`${A} group-hover:translate-x-0.5`}
      />
      <Mono x={76} y={30} text="deprecated 31 Jan" cls="fill-muted" />
      <Mono x={76} y={50} text="contract ✓" cls="fill-good" />
      <text x={10} y={84} className={T}>
        rename like a street
      </text>
    </>
  ),

  "capstone-model": () => (
    <>
      {[0, 1].map((i) => (
        <rect
          key={i}
          x={50 + i * 34}
          y={30}
          width={30}
          height={16}
          rx={3}
          className={i === 0 ? `${HOT} ${A} group-hover:scale-105` : HOT}
          strokeWidth={1.1}
        />
      ))}
      <text x={65} y={41} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        orders
      </text>
      <text x={99} y={41} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        deliveries
      </text>
      {[
        [14, 12],
        [130, 12],
        [14, 58],
        [130, 58],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={22}
          height={12}
          rx={2}
          className={DATA}
          strokeWidth={0.8}
        />
      ))}
      <text x={10} y={88} className={T}>
        ten questions, all answered
      </text>
    </>
  ),
};
