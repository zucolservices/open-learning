import { A, type ArtMap } from "./kit";
import { Arrow, Cell, Db, Row, T } from "./streaming-data-a";
import { Line, Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the Database Internals track (modules 12–21), keyed by module slug. */

const PAGE = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";

export const databaseInternalsArtB: ArtMap = {
  "cost-optimiser": () => (
    <>
      {[
        ["Seq Scan", 92, false],
        ["Index Scan", 18, true],
        ["Bitmap Scan", 40, false],
      ].map(([l, w, best], i) => (
        <g key={l as string}>
          <text x={10} y={24 + i * 18} className="fill-fg font-mono text-[5.5px]">
            {l as string}
          </text>
          <rect
            x={52}
            y={18 + i * 18}
            width={w as number}
            height={9}
            rx={2}
            className={
              best
                ? `fill-good/30 stroke-good ${A} group-hover:scale-x-110`
                : "fill-surface-2/60 stroke-line-strong"
            }
            strokeWidth={1}
          />
        </g>
      ))}
      <text x={10} y={88} className={T}>
        cheapest estimate wins
      </text>
    </>
  ),

  "wal-recovery": () => (
    <>
      <text x={10} y={16} className="fill-muted font-mono text-[5.5px]">
        write-ahead log
      </text>
      <Row
        x={10}
        y={22}
        n={9}
        w={12}
        gap={3}
        cls={(i) => (i === 8 ? `${HOT}` : "fill-viz-meta/25 stroke-viz-meta")}
        labels
      />
      <Arrow x1={70} y1={40} x2={70} y2={54} className={`${A} group-hover:translate-y-0.5`} />
      <Db x={70} y={58} w={34} h={16} />
      <text x={10} y={94} className={T}>
        log first, pages later
      </text>
    </>
  ),

  acid: () => (
    <>
      {["A", "C", "I", "D"].map((l, i) => (
        <g key={l}>
          <rect
            x={14 + i * 34}
            y={24}
            width={28}
            height={28}
            rx={5}
            className={i === 0 ? `${HOT} ${A} group-hover:-translate-y-1` : PAGE}
            strokeWidth={1.2}
          />
          <text
            x={28 + i * 34}
            y={43}
            textAnchor="middle"
            className="fill-accent font-mono text-[13px] font-semibold"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={14} y={78} className={T}>
        all or nothing, and kept
      </text>
    </>
  ),

  isolation: () => (
    <>
      <text x={10} y={14} className="fill-accent font-mono text-[6px]">
        T1
      </text>
      <text x={84} y={14} className="fill-viz-compute font-mono text-[6px]">
        T2
      </text>
      {[
        [10, 20, "read 10"],
        [84, 32, "read 10"],
        [10, 44, "write 9"],
        [84, 56, "write 9"],
      ].map(([x, y, t], i) => (
        <Svc
          key={i}
          x={x as number}
          y={y as number}
          w={64}
          h={10}
          label={t as string}
          cls={i === 3 ? "fill-bad/15 stroke-bad" : PAGE}
          className={i === 3 ? `${A} group-hover:translate-x-1` : ""}
        />
      ))}
      <text x={10} y={84} className={T}>
        a lost update
      </text>
    </>
  ),

  locking: () => (
    <>
      <Svc x={14} y={20} w={40} h={16} label="T1" cls={HOT} />
      <Svc x={106} y={20} w={40} h={16} label="T2" cls="fill-viz-compute/20 stroke-viz-compute" />
      <Svc x={14} y={58} w={40} h={14} label="row A" />
      <Svc x={106} y={58} w={40} h={14} label="row B" />
      <Arrow x1={34} y1={56} x2={34} y2={38} />
      <Arrow x1={126} y1={56} x2={126} y2={38} />
      <Arrow
        x1={56}
        y1={30}
        x2={104}
        y2={60}
        cls="stroke-bad"
        dash="3 2"
        className={`${A} group-hover:translate-x-0.5`}
      />
      <Arrow x1={104} y1={30} x2={56} y2={60} cls="stroke-bad" dash="3 2" />
      <text x={14} y={92} className={T}>
        each waits for the other
      </text>
    </>
  ),

  mvcc: () => (
    <>
      <Cell
        x={14}
        y={22}
        w={56}
        h={16}
        cls="fill-surface-2/40 stroke-line"
        label="₹100 · xmax 102"
      />
      <Cell
        x={14}
        y={44}
        w={56}
        h={16}
        cls={HOT}
        label="₹120 · xmin 102"
        className={`${A} group-hover:translate-x-1`}
      />
      <Mono x={86} y={32} text="report → ₹100" cls="fill-muted" />
      <Mono x={86} y={54} text="new txn → ₹120" cls="fill-fg" />
      <text x={14} y={84} className={T}>
        two versions, two right answers
      </text>
    </>
  ),

  "replication-internals": () => (
    <>
      <Db x={30} y={26} w={30} h={20} />
      <Db x={130} y={26} w={30} h={20} cls="stroke-viz-data" fill="fill-viz-data/5" />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={58 + i * 16}
          y={33}
          width={10}
          height={8}
          rx={1.5}
          className={`fill-viz-meta/30 stroke-viz-meta ${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
          strokeWidth={1}
        />
      ))}
      <text x={30} y={62} textAnchor="middle" className="fill-muted font-mono text-[5px]">
        primary
      </text>
      <text x={130} y={62} textAnchor="middle" className="fill-muted font-mono text-[5px]">
        replica
      </text>
      <text x={10} y={88} className={T}>
        ship the log, replay it
      </text>
    </>
  ),

  "distributed-sql": () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => {
        const pos = [
          [80, 16],
          [124, 38],
          [108, 76],
          [52, 76],
          [36, 38],
        ][i];
        return (
          <g key={i}>
            <circle
              cx={pos[0]}
              cy={pos[1]}
              r={9}
              className={
                i === 0
                  ? `${HOT} ${A} group-hover:scale-110`
                  : i === 3
                    ? "fill-bad/10 stroke-bad"
                    : PAGE
              }
              strokeWidth={1.2}
              strokeDasharray={i === 3 ? "2 2" : undefined}
            />
            <text
              x={pos[0]}
              y={pos[1] + 2}
              textAnchor="middle"
              className="fill-fg font-mono text-[6px]"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      <text x={80} y={50} textAnchor="middle" className="fill-muted font-mono text-[6px]">
        4 of 5: commit
      </text>
    </>
  ),

  "engines-compared": () => (
    <>
      {["PostgreSQL", "MySQL", "SQLite", "SQL Server", "Oracle", "RocksDB"].map((n, i) => (
        <Svc
          key={n}
          x={10 + (i % 3) * 48}
          y={20 + Math.floor(i / 3) * 24}
          w={44}
          h={16}
          label={n}
          cls={i === 0 ? HOT : PAGE}
          className={i === 0 ? `${A} group-hover:-translate-y-0.5` : ""}
        />
      ))}
      <text x={10} y={84} className={T}>
        same SQL, different insides
      </text>
    </>
  ),

  "capstone-db": () => (
    <>
      <rect x={10} y={12} width={80} height={44} rx={4} className={PAGE} strokeWidth={1.1} />
      <Line
        x={14}
        y={18}
        w={72}
        h={32}
        v={[0.9, 0.85, 0.95, 0.7, 0.45, 0.3, 0.2, 0.12]}
        cls="stroke-good"
        className={`${A} group-hover:-translate-y-0.5`}
      />
      <text x={14} y={64} className="fill-muted font-mono text-[5px]">
        p99 latency
      </text>
      {["index", "ANALYZE", "lock order", "idle txn", "VACUUM"].map((t, i) => (
        <g key={t}>
          <text x={100} y={20 + i * 10} className="fill-good font-mono text-[5.5px]">
            ✓ {t}
          </text>
        </g>
      ))}
      <text x={10} y={88} className={T}>
        five fixes, one quiet pager
      </text>
    </>
  ),
};
