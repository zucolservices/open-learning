import { A, type ArtMap } from "./kit";
import { Arrow, Cell, Db, Row, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Database Internals track (modules 1–11), keyed by module slug. */

const PAGE = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";

export const databaseInternalsArtA: ArtMap = {
  "query-journey": () => (
    <>
      {["parse", "plan", "execute", "storage"].map((l, i) => (
        <g key={l}>
          <Svc
            x={8 + i * 38}
            y={36}
            w={30}
            h={16}
            label={l}
            cls={i === 1 ? HOT : PAGE}
            className={i === 1 ? `${A} group-hover:-translate-y-1` : ""}
          />
          {i < 3 && <Arrow x1={39 + i * 38} y1={44} x2={45 + i * 38} y2={44} />}
        </g>
      ))}
      <Mono x={8} y={24} text="SELECT * FROM orders WHERE id = 42;" cls="fill-muted" />
      <text x={8} y={78} className={T}>
        one query, four stops
      </text>
    </>
  ),

  "storage-hierarchy": () => (
    <>
      {[
        ["CPU cache", 40, "~1 ns"],
        ["memory", 64, "~100 ns"],
        ["SSD", 92, "~100 µs"],
        ["disk", 120, "~10 ms"],
      ].map(([l, w, t], i) => (
        <g key={l as string}>
          <rect
            x={80 - (w as number) / 2}
            y={14 + i * 18}
            width={w as number}
            height={14}
            rx={2}
            className={i === 0 ? `${HOT} ${A} group-hover:scale-105` : PAGE}
            strokeWidth={1.1}
          />
          <text x={80} y={23.5 + i * 18} textAnchor="middle" className="fill-fg text-[6px]">
            {l as string}
          </text>
          <text
            x={146}
            y={23.5 + i * 18}
            textAnchor="end"
            className="fill-muted font-mono text-[5px]"
          >
            {i === 3 ? "" : (t as string)}
          </text>
        </g>
      ))}
      <text x={8} y={94} className={T}>
        faster is smaller (illustrative)
      </text>
    </>
  ),

  "pages-rows": () => (
    <>
      <rect x={30} y={10} width={100} height={72} rx={3} className={PAGE} strokeWidth={1.2} />
      <rect
        x={30}
        y={10}
        width={100}
        height={10}
        rx={3}
        className="fill-viz-meta/20 stroke-viz-meta"
        strokeWidth={1}
      />
      <text x={34} y={17} className="fill-fg font-mono text-[5px]">
        header · slots →
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={34}
          y={58 - i * 12}
          width={92}
          height={10}
          rx={1.5}
          className={
            i === 0
              ? `fill-viz-data/25 stroke-viz-data ${A} group-hover:-translate-y-0.5`
              : "fill-viz-data/25 stroke-viz-data"
          }
          strokeWidth={1}
        />
      ))}
      <text x={80} y={30} textAnchor="middle" className="fill-subtle font-mono text-[5px]">
        free space
      </text>
      <text x={30} y={94} className={T}>
        one 8 KB page
      </text>
    </>
  ),

  "row-vs-column": () => (
    <>
      {[0, 1, 2, 3].map((r) => (
        <Row
          key={r}
          x={12}
          y={16 + r * 14}
          n={4}
          w={10}
          gap={2}
          cls={() =>
            r === 1 ? "fill-viz-data/40 stroke-viz-data" : "fill-surface-2/60 stroke-line-strong"
          }
        />
      ))}
      {[0, 1, 2, 3].map((c) => (
        <Row
          key={c}
          x={100}
          y={16 + c * 14}
          n={4}
          w={10}
          gap={2}
          cls={() =>
            c === 2
              ? "fill-viz-compute/40 stroke-viz-compute"
              : "fill-surface-2/60 stroke-line-strong"
          }
        />
      ))}
      <text x={12} y={86} className={T}>
        rows
      </text>
      <text x={100} y={86} className={T}>
        columns
      </text>
      <text x={80} y={46} textAnchor="middle" className="fill-muted text-[8px]">
        vs
      </text>
    </>
  ),

  "buffer-pool": () => (
    <>
      <rect
        x={10}
        y={12}
        width={140}
        height={34}
        rx={4}
        className="fill-accent/10 stroke-accent"
        strokeWidth={1.2}
      />
      <text x={14} y={21} className="fill-accent font-mono text-[5.5px]">
        buffer pool (memory)
      </text>
      <Row
        x={16}
        y={26}
        n={9}
        w={12}
        gap={3}
        cls={(i) => (i < 6 ? "fill-viz-data/30 stroke-viz-data" : "fill-surface-2/60 stroke-line")}
      />
      <Db x={80} y={62} w={34} h={16} />
      <Arrow x1={80} y1={58} x2={80} y2={48} className={`${A} group-hover:-translate-y-0.5`} />
      <text x={10} y={94} className={T}>
        hit: no disk read
      </text>
    </>
  ),

  btrees: () => (
    <>
      <Cell
        x={68}
        y={10}
        w={24}
        h={12}
        label="50"
        cls={HOT}
        className={`${A} group-hover:-translate-y-0.5`}
      />
      {[
        [24, "20"],
        [68, "60"],
        [112, "80"],
      ].map(([x, l]) => (
        <g key={l as string}>
          <line
            x1={80}
            y1={22}
            x2={(x as number) + 12}
            y2={40}
            className="stroke-line-strong"
            strokeWidth={1}
          />
          <Cell x={x as number} y={40} w={24} h={12} label={l as string} cls={PAGE} />
          {[0, 1, 2].map((k) => (
            <rect
              key={k}
              x={(x as number) - 4 + k * 11}
              y={68}
              width={9}
              height={9}
              rx={1.5}
              className="fill-viz-data/25 stroke-viz-data"
              strokeWidth={1}
            />
          ))}
        </g>
      ))}
      <text x={8} y={94} className={T}>
        three hops to any row
      </text>
    </>
  ),

  "using-indexes": () => (
    <>
      <Mono x={15} y={20} text="Index Scan using orders_id_idx" cls="fill-good" />
      <Mono x={15} y={32} text="  (rows=1) (actual time=0.02 ms)" cls="fill-muted" />
      <Mono x={15} y={52} text="Seq Scan on orders" cls="fill-bad" />
      <Mono x={15} y={64} text="  Rows Removed by Filter: 4,999,999" cls="fill-muted" />
      <rect
        x={6}
        y={13}
        width={4}
        height={22}
        rx={1}
        className={`fill-good ${A} group-hover:scale-y-110`}
      />
      <rect x={6} y={45} width={4} height={22} rx={1} className="fill-bad" />
      <text x={10} y={88} className={T}>
        read the plan
      </text>
    </>
  ),

  "lsm-trees": () => (
    <>
      <rect
        x={10}
        y={10}
        width={44}
        height={14}
        rx={3}
        className={`${HOT} ${A} group-hover:-translate-y-0.5`}
        strokeWidth={1.2}
      />
      <text x={32} y={19.5} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        memtable
      </text>
      <Arrow x1={32} y1={26} x2={32} y2={36} />
      {[
        [10, 38, 3],
        [10, 56, 2],
        [10, 74, 1],
      ].map(([x, y, n], i) => (
        <g key={i}>
          <text x={x as number} y={(y as number) + 7} className="fill-muted font-mono text-[5px]">
            L{i}
          </text>
          <Row
            x={22}
            y={y as number}
            n={(n as number) * 2}
            w={(4 - (n as number)) * 6 + 6}
            gap={2}
            cls={() => "fill-viz-data/25 stroke-viz-data"}
          />
        </g>
      ))}
      <text x={110} y={60} className="fill-muted font-mono text-[5.5px]">
        compaction
      </text>
      <Arrow x1={120} y1={64} x2={120} y2={80} />
    </>
  ),

  "other-indexes": () => (
    <>
      {[
        ["hash", "k → bucket 3"],
        ["inverted", "word → docs 4, 9"],
        ["vector", "nearest 5 by distance"],
      ].map(([t, d], i) => (
        <g key={t}>
          <Svc
            x={10}
            y={14 + i * 24}
            w={40}
            h={16}
            label={t}
            cls={i === 2 ? HOT : PAGE}
            className={i === 2 ? `${A} group-hover:translate-x-1` : ""}
          />
          <Mono x={58} y={24 + i * 24} text={d} cls="fill-muted" />
        </g>
      ))}
      <text x={10} y={94} className={T}>
        different questions, different shapes
      </text>
    </>
  ),

  "query-planning": () => (
    <>
      <Svc
        x={60}
        y={10}
        w={40}
        h={14}
        label="Hash Join"
        cls={HOT}
        className={`${A} group-hover:-translate-y-0.5`}
      />
      <line x1={70} y1={24} x2={40} y2={40} className="stroke-line-strong" strokeWidth={1} />
      <line x1={90} y1={24} x2={120} y2={40} className="stroke-line-strong" strokeWidth={1} />
      <Svc x={14} y={40} w={52} h={14} label="Seq Scan orders" />
      <Svc x={94} y={40} w={52} h={14} label="Index Scan users" />
      <text x={10} y={80} className={T}>
        SQL says what; the plan says how
      </text>
    </>
  ),

  joins: () => (
    <>
      {["nested loop", "hash join", "merge join"].map((t, i) => (
        <g key={t}>
          <Svc
            x={10 + i * 48}
            y={20}
            w={44}
            h={16}
            label={t}
            cls={i === 1 ? HOT : PAGE}
            className={i === 1 ? `${A} group-hover:-translate-y-1` : ""}
          />
          <Row
            x={14 + i * 48}
            y={46}
            n={3}
            w={8}
            gap={3}
            cls={() => "fill-viz-data/25 stroke-viz-data"}
          />
          <Row
            x={14 + i * 48}
            y={58}
            n={3}
            w={8}
            gap={3}
            cls={() => "fill-viz-compute/25 stroke-viz-compute"}
          />
        </g>
      ))}
      <text x={10} y={88} className={T}>
        three ways to match rows
      </text>
    </>
  ),
};
