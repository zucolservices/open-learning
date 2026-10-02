import type { ReactNode } from "react";
import { A, type ArtMap } from "./kit";

/** Card illustrations for the Streaming Data Systems track (modules 1–12), keyed by module slug. */

export const T = "fill-muted font-mono text-[7px]";

/** One log record: a small rounded cell, optionally numbered. */
export function Cell({
  x,
  y,
  w = 12,
  h = 12,
  cls = "fill-viz-data/25 stroke-viz-data",
  label,
  className = "",
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  cls?: string;
  label?: string | number;
  className?: string;
}) {
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={h} rx={2} className={cls} strokeWidth={1.2} />
      {label !== undefined && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 2.5}
          textAnchor="middle"
          className="fill-fg font-mono text-[6.5px]"
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** Straight arrow (horizontal or vertical works best). */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  cls = "stroke-line-strong",
  dash,
  className = "",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cls?: string;
  dash?: string;
  className?: string;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (s: number) =>
    `${Math.round((x2 - 4 * Math.cos(a + s)) * 100) / 100} ${Math.round((y2 - 4 * Math.sin(a + s)) * 100) / 100}`;
  return (
    <g className={className}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={cls}
        strokeWidth={1.4}
        strokeDasharray={dash}
      />
      <path d={`M${p(0.55)}L${x2} ${y2}L${p(-0.55)}`} className={cls} strokeWidth={1.4} />
    </g>
  );
}

/** A database cylinder, top centred at (x, y). */
export function Db({
  x,
  y,
  w = 26,
  h = 26,
  cls = "stroke-viz-data",
  fill = "fill-viz-data/15",
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  cls?: string;
  fill?: string;
}) {
  const r = w / 2;
  return (
    <g>
      <path
        d={`M${x - r} ${y}v${h}a${r} 4 0 0 0 ${w} 0v-${h}`}
        className={`${fill} ${cls}`}
        strokeWidth={1.3}
      />
      <ellipse cx={x} cy={y} rx={r} ry={4} className={`${fill} ${cls}`} strokeWidth={1.3} />
    </g>
  );
}

/** A row of `n` cells starting at (x, y), coloured by `cls(i)`. */
export function Row({
  x,
  y,
  n,
  w = 12,
  gap = 2,
  cls,
  labels,
}: {
  x: number;
  y: number;
  n: number;
  w?: number;
  gap?: number;
  cls?: (i: number) => string;
  labels?: boolean;
}): ReactNode {
  return Array.from({ length: n }, (_, i) => (
    <Cell
      key={i}
      x={x + i * (w + gap)}
      y={y}
      w={w}
      h={w}
      cls={cls?.(i)}
      label={labels ? i : undefined}
    />
  ));
}

const KEY = [
  "fill-viz-data/25 stroke-viz-data",
  "fill-viz-compute/25 stroke-viz-compute",
  "fill-viz-meta/25 stroke-viz-meta",
];

export const streamingDataArtA: ArtMap = {
  "batch-vs-streams": () => (
    <>
      {[0, 1, 2].map((r) => (
        <rect
          key={r}
          x={20}
          y={30 + r * 14}
          width={40}
          height={11}
          rx={2}
          className="fill-viz-idle/25 stroke-viz-idle"
          strokeWidth={1.2}
        />
      ))}
      <circle cx={40} cy={82} r={7} className="stroke-line-strong" strokeWidth={1.2} />
      <path d="M40 78v4l3 2" className="stroke-line-strong" strokeWidth={1.2} />
      <text x={40} y={22} textAnchor="middle" className={T}>
        batch
      </text>
      <line x1={78} y1={56} x2={146} y2={56} className="stroke-line-strong" strokeWidth={1.2} />
      <g className={`${A} group-hover:translate-x-3`}>
        {[84, 98, 108, 124, 132].map((x, i) => (
          <circle key={i} cx={x} cy={56} r={3.2} className="fill-viz-data stroke-viz-data" />
        ))}
      </g>
      <text x={112} y={44} textAnchor="middle" className={T}>
        stream
      </text>
    </>
  ),

  "events-logs-topics": () => (
    <>
      <Row
        x={18}
        y={44}
        n={7}
        w={14}
        gap={2}
        labels
        cls={() => "fill-viz-data/20 stroke-viz-data"}
      />
      <Cell
        x={136}
        y={44}
        w={14}
        h={14}
        cls={`fill-viz-add/30 stroke-viz-add`}
        label={7}
        className={`${A} group-hover:-translate-x-1`}
      />
      <path d="M18 66h132" className="stroke-line-strong" strokeDasharray="2 3" />
      <text x={18} y={36} className={T}>
        offset 0
      </text>
      <text x={150} y={36} textAnchor="end" className={T}>
        append →
      </text>
      <text x={84} y={80} textAnchor="middle" className={T}>
        topic: payments
      </text>
    </>
  ),

  "partitions-ordering": () => (
    <>
      <Cell x={14} y={44} w={22} h={14} cls="fill-surface-2 stroke-line-strong" />
      <text x={25} y={53} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        hash
      </text>
      {[0, 1, 2].map((p) => (
        <g key={p}>
          <Arrow x1={38} y1={51} x2={56} y2={26 + p * 25} />
          <text x={60} y={30 + p * 25} className={T}>
            P{p}
          </text>
          <g className={p === 1 ? `${A} group-hover:translate-x-2` : ""}>
            <Row
              x={74}
              y={20 + p * 25}
              n={5}
              w={12}
              gap={2}
              cls={(i) => KEY[(p + i * (p === 1 ? 0 : 1)) % 3]}
            />
          </g>
        </g>
      ))}
    </>
  ),

  "consumer-groups": () => (
    <>
      {[0, 1, 2].map((p) => (
        <g key={p}>
          <Row x={16} y={22 + p * 24} n={4} w={11} gap={2} cls={() => KEY[p]} />
          <path
            d={`M${16 + 2 * 13 + 6} ${18 + p * 24}v19`}
            className="stroke-viz-add"
            strokeWidth={1.6}
          />
          <Arrow x1={72} y1={27 + p * 24} x2={102} y2={27 + p * 24} cls="stroke-line-strong" />
          <circle
            cx={114}
            cy={27 + p * 24}
            r={8}
            className={`fill-viz-compute/20 stroke-viz-compute ${p === 2 ? `${A} group-hover:scale-110` : ""}`}
            strokeWidth={1.3}
          />
        </g>
      ))}
      <rect
        x={100}
        y={12}
        width={28}
        height={80}
        rx={6}
        className="stroke-line-strong"
        strokeDasharray="3 3"
      />
      <text x={142} y={54} className={T}>
        group
      </text>
    </>
  ),

  "replication-durability": () => (
    <>
      {[0, 1, 2].map((b) => (
        <g key={b}>
          <rect
            x={14 + b * 48}
            y={28}
            width={36}
            height={46}
            rx={4}
            className={
              b === 0 ? "fill-viz-data/15 stroke-viz-data" : "fill-surface-2/60 stroke-line-strong"
            }
            strokeWidth={1.3}
          />
          <text x={32 + b * 48} y={22} textAnchor="middle" className={T}>
            {b === 0 ? "leader" : "follower"}
          </text>
          <Row
            x={19 + b * 48}
            y={40}
            n={2}
            w={12}
            gap={2}
            cls={() => "fill-viz-data/25 stroke-viz-data"}
          />
          <Cell
            x={19 + b * 48}
            y={56}
            w={12}
            h={12}
            cls={b === 0 ? "fill-viz-add/30 stroke-viz-add" : "fill-viz-add/30 stroke-viz-add"}
            className={b > 0 ? `${A} opacity-40 group-hover:opacity-100` : ""}
          />
        </g>
      ))}
      <Arrow x1={50} y1={62} x2={60} y2={62} cls="stroke-viz-add" />
      <path d="M44 74q40 16 80 0" className="stroke-viz-add" strokeDasharray="2 3" />
      <text x={80} y={94} textAnchor="middle" className={T}>
        acks=all
      </text>
    </>
  ),

  "retention-compaction": () => (
    <>
      <g className={`${A} group-hover:opacity-20`}>
        <Row
          x={14}
          y={30}
          n={3}
          w={12}
          gap={2}
          cls={() => "fill-viz-remove/15 stroke-viz-remove"}
        />
      </g>
      <Row x={56} y={30} n={6} w={12} gap={2} cls={() => "fill-viz-data/25 stroke-viz-data"} />
      <path d="M52 24v24" className="stroke-viz-remove" strokeDasharray="2 2" />
      <text x={14} y={22} className={T}>
        expired
      </text>
      <text x={14} y={66} className={T}>
        compacted: latest per key
      </text>
      {["A", "B", "A", "C", "B", "A"].map((k, i) => (
        <Cell
          key={i}
          x={14 + i * 16}
          y={72}
          w={13}
          h={13}
          label={k}
          cls={
            i >= 3
              ? "fill-viz-add/25 stroke-viz-add"
              : "fill-surface-2 stroke-line-strong opacity-40"
          }
        />
      ))}
    </>
  ),

  "platforms-compared": () => (
    <>
      <Row x={52} y={44} n={4} w={12} gap={2} cls={() => "fill-viz-data/25 stroke-viz-data"} />
      {[
        ["Kafka", 14, 18],
        ["Kinesis", 102, 18],
        ["Pub/Sub", 14, 74],
        ["Event Hubs", 98, 74],
      ].map(([l, x, y], i) => (
        <g key={l as string} className={i === 1 ? `${A} group-hover:-translate-y-1` : ""}>
          <rect
            x={x as number}
            y={y as number}
            width={48}
            height={14}
            rx={7}
            className="fill-surface-2/70 stroke-line-strong"
            strokeWidth={1.1}
          />
          <text
            x={(x as number) + 24}
            y={(y as number) + 9.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[6.5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <path
        d="M38 32l18 12M126 32l-18 12M38 74l18-16M122 74l-18-16"
        className="stroke-line-strong"
        strokeDasharray="2 2"
      />
    </>
  ),

  "cdc-outbox": () => (
    <>
      <Db x={34} y={30} w={36} h={40} />
      <rect x={22} y={42} width={24} height={7} rx={1} className="fill-viz-idle/30" />
      <rect x={22} y={53} width={24} height={7} rx={1} className="fill-viz-add/40" />
      <text x={34} y={86} textAnchor="middle" className={T}>
        orders + outbox
      </text>
      <Arrow
        x1={58}
        y1={56}
        x2={84}
        y2={56}
        cls="stroke-viz-add"
        className={`${A} group-hover:translate-x-1`}
      />
      <text x={71} y={50} textAnchor="middle" className={T}>
        log
      </text>
      <Row
        x={90}
        y={50}
        n={4}
        w={12}
        gap={2}
        cls={(i) =>
          i === 3 ? "fill-viz-add/30 stroke-viz-add" : "fill-viz-data/25 stroke-viz-data"
        }
      />
    </>
  ),

  "schemas-evolution": () => (
    <>
      {[0, 1].map((v) => (
        <g key={v} className={v === 1 ? `${A} group-hover:-translate-y-1` : ""}>
          <rect
            x={20 + v * 64}
            y={22}
            width={54}
            height={58}
            rx={4}
            className={
              v === 0 ? "fill-surface-2/60 stroke-line-strong" : "fill-viz-meta/10 stroke-viz-meta"
            }
            strokeWidth={1.3}
          />
          <text x={26 + v * 64} y={33} className="fill-fg font-mono text-[7px]">
            v{v + 1}
          </text>
          {["id", "amount", ...(v ? ["note?"] : [])].map((f, i) => (
            <text
              key={f}
              x={26 + v * 64}
              y={46 + i * 10}
              className={f === "note?" ? "fill-viz-add font-mono text-[6.5px]" : T}
            >
              {f}
            </text>
          ))}
        </g>
      ))}
      <Arrow x1={76} y1={51} x2={82} y2={51} />
      <path d="M118 86l4 4 8-8" className="stroke-viz-add" strokeWidth={1.6} />
    </>
  ),

  "delivery-guarantees": () => (
    <>
      {[
        ["at most once", 0],
        ["at least once", 2],
        ["exactly once", 1],
      ].map(([l, n], r) => (
        <g key={l as string}>
          <text x={16} y={30 + r * 24} className={T}>
            {l}
          </text>
          {Array.from({ length: n as number }, (_, i) => (
            <rect
              key={i}
              x={98 + i * 20}
              y={22 + r * 24}
              width={16}
              height={11}
              rx={1.5}
              className={`${n === 2 && i === 1 ? "fill-viz-remove/20 stroke-viz-remove" : "fill-viz-data/20 stroke-viz-data"} ${r === 2 ? `${A} group-hover:scale-110` : ""}`}
              strokeWidth={1.2}
            />
          ))}
          {n === 0 && (
            <text x={104} y={30} className="fill-viz-remove font-mono text-[7px]">
              lost
            </text>
          )}
        </g>
      ))}
    </>
  ),

  "stateless-processing": () => (
    <>
      <Row x={8} y={44} n={3} w={10} gap={2} cls={(i) => KEY[i]} />
      <path
        d="M46 36h22l-7 10v8l-8 4v-12z"
        className="fill-viz-compute/20 stroke-viz-compute"
        strokeWidth={1.3}
      />
      <text x={57} y={72} textAnchor="middle" className={T}>
        filter
      </text>
      <Arrow x1={72} y1={49} x2={88} y2={49} />
      <rect
        x={90}
        y={40}
        width={20}
        height={18}
        rx={3}
        className="fill-viz-compute/20 stroke-viz-compute"
        strokeWidth={1.3}
      />
      <text x={100} y={72} textAnchor="middle" className={T}>
        map
      </text>
      <g className={`${A} group-hover:translate-x-1`}>
        <Arrow x1={112} y1={46} x2={134} y2={32} />
        <Arrow x1={112} y1={52} x2={134} y2={66} />
        <Cell x={136} y={24} w={10} h={10} cls={KEY[0]} />
        <Cell x={136} y={62} w={10} h={10} cls={KEY[1]} />
      </g>
    </>
  ),

  "event-time": () => (
    <>
      <line x1={14} y1={64} x2={148} y2={64} className="stroke-line-strong" strokeWidth={1.2} />
      {[20, 40, 60, 80, 100, 120, 140].map((x) => (
        <line key={x} x1={x} y1={62} x2={x} y2={66} className="stroke-line-strong" />
      ))}
      {[
        [26, 1],
        [48, 2],
        [70, 4],
        [92, 3],
        [114, 5],
      ].map(([x, n]) => (
        <Cell
          key={n}
          x={x - 6}
          y={42}
          w={12}
          h={12}
          label={n}
          cls={
            n === 3 ? "fill-viz-remove/20 stroke-viz-remove" : "fill-viz-data/25 stroke-viz-data"
          }
          className={n === 3 ? `${A} group-hover:-translate-x-6` : ""}
        />
      ))}
      <path d="M104 26v50" className="stroke-viz-meta" strokeDasharray="3 2" strokeWidth={1.4} />
      <text x={106} y={24} className="fill-viz-meta font-mono text-[6.5px]">
        watermark
      </text>
      <text x={14} y={82} className={T}>
        processing time →
      </text>
    </>
  ),
};
