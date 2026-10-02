import { A, FileIcon, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";

/** Card illustrations for the Observability track (modules 1–11), keyed by module slug. */

/** A small service box. */
export function Svc({
  x,
  y,
  w = 24,
  h = 14,
  label,
  cls = "fill-surface-2/60 stroke-line-strong",
  className = "",
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  cls?: string;
  className?: string;
}) {
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={h} rx={3} className={cls} strokeWidth={1.2} />
      {label && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 2}
          textAnchor="middle"
          className="fill-fg font-mono text-[5.5px]"
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** A polyline chart from 0–1 values inside a box. */
export function Line({
  x,
  y,
  w,
  h,
  v,
  cls = "stroke-viz-data",
  className = "",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  v: number[];
  cls?: string;
  className?: string;
}) {
  return (
    <polyline
      points={v.map((p, i) => `${x + (i / (v.length - 1)) * w},${y + h - p * h}`).join(" ")}
      className={`${cls} ${className}`}
      strokeWidth={1.4}
    />
  );
}

export const observabilityArtA: ArtMap = {
  "why-observability": () => (
    <>
      <rect
        x={12}
        y={22}
        width={58}
        height={40}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <Line
        x={16}
        y={30}
        w={50}
        h={26}
        v={[0.4, 0.42, 0.38, 0.41, 0.4, 0.43, 0.39]}
        cls="stroke-viz-idle"
      />
      <text x={41} y={74} textAnchor="middle" className={T}>
        CPU fine?
      </text>
      <Arrow x1={76} y1={42} x2={88} y2={42} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={94}
          y={20 + i * 16}
          width={54}
          height={12}
          rx={3}
          className={`${["fill-viz-data/20 stroke-viz-data", "fill-viz-meta/20 stroke-viz-meta", "fill-viz-compute/20 stroke-viz-compute"][i]} ${A} group-hover:translate-x-0.5`}
          strokeWidth={1.1}
        />
      ))}
      {["metrics", "logs", "traces"].map((l, i) => (
        <text key={l} x={100} y={28.5 + i * 16} className="fill-fg font-mono text-[6px]">
          {l}
        </text>
      ))}
      <text x={94} y={80} className={T}>
        why slow, for whom?
      </text>
    </>
  ),

  "signals-overview": () => (
    <>
      <Line x={12} y={24} w={40} h={28} v={[0.2, 0.3, 0.25, 0.6, 0.5, 0.7]} />
      <text x={12} y={66} className={T}>
        metric
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={62}
          y={24 + i * 8}
          width={i % 2 ? 28 : 36}
          height={4}
          rx={1}
          className="fill-viz-meta/40"
        />
      ))}
      <text x={62} y={66} className={T}>
        log
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={110 + i * 8}
          y={24 + i * 10}
          width={36 - i * 12}
          height={7}
          rx={2}
          className={`fill-viz-compute/30 stroke-viz-compute ${A} group-hover:translate-x-0.5`}
          strokeWidth={1}
        />
      ))}
      <text x={110} y={66} className={T}>
        trace
      </text>
    </>
  ),

  opentelemetry: () => (
    <>
      {[0, 1, 2].map((i) => (
        <Svc
          key={i}
          x={10}
          y={18 + i * 22}
          label={["api", "pay", "db"][i]}
          cls="fill-viz-data/15 stroke-viz-data"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={36} y1={25 + i * 22} x2={62} y2={47} />
      ))}
      <rect
        x={64}
        y={36}
        width={34}
        height={22}
        rx={4}
        className={`fill-accent/15 stroke-accent ${A} group-hover:scale-105`}
        strokeWidth={1.3}
      />
      <text x={81} y={49} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        Collector
      </text>
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={100} y1={47} x2={122} y2={25 + i * 22} />
      ))}
      {["A", "B", "C"].map((l, i) => (
        <Svc key={l} x={124} y={18 + i * 22} label={`backend ${l}`} w={30} />
      ))}
      <text x={10} y={90} className={T}>
        instrument once, send anywhere
      </text>
    </>
  ),

  "metric-types": () => (
    <>
      <Line x={10} y={24} w={40} h={34} v={[0, 0.2, 0.35, 0.55, 0.7, 0.9]} cls="stroke-viz-add" />
      <text x={10} y={72} className={T}>
        counter
      </text>
      <Line x={60} y={24} w={40} h={34} v={[0.5, 0.7, 0.3, 0.6, 0.4, 0.55]} cls="stroke-viz-data" />
      <text x={60} y={72} className={T}>
        gauge
      </text>
      {[0.3, 0.7, 1, 0.6, 0.25].map((v, i) => (
        <rect
          key={i}
          x={112 + i * 8}
          y={58 - v * 34}
          width={6}
          height={v * 34}
          className={`fill-viz-compute/40 ${A} group-hover:-translate-y-0.5`}
        />
      ))}
      <text x={110} y={72} className={T}>
        histogram
      </text>
    </>
  ),

  percentiles: () => (
    <>
      {Array.from({ length: 20 }, (_, i) => {
        const v = i < 18 ? 0.15 + (i % 5) * 0.04 : i === 18 ? 0.7 : 0.95;
        return (
          <rect
            key={i}
            x={14 + i * 6.5}
            y={66 - v * 46}
            width={4.5}
            height={v * 46}
            className={
              i >= 18 ? `fill-viz-remove/60 ${A} group-hover:-translate-y-0.5` : "fill-viz-data/40"
            }
          />
        );
      })}
      <path d="M12 52h136" className="stroke-viz-meta" strokeWidth={1} strokeDasharray="3 2" />
      <text x={12} y={80} className={T}>
        average hides the slow few: p99
      </text>
    </>
  ),

  cardinality: () => (
    <>
      <Svc x={10} y={36} w={30} label="metric" cls="fill-viz-data/15 stroke-viz-data" />
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={42} y1={43} x2={60} y2={24 + i * 19} />
      ))}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={66}
          cy={24 + i * 19}
          r={4}
          className="fill-viz-add/30 stroke-viz-add"
          strokeWidth={1}
        />
      ))}
      <text x={56} y={88} className={T}>
        by bank
      </text>
      {Array.from({ length: 48 }, (_, i) => (
        <circle
          key={i}
          cx={98 + (i % 8) * 7}
          cy={16 + Math.floor(i / 8) * 9}
          r={2.4}
          className={`fill-viz-remove/40 ${i % 5 === 0 ? `${A} group-hover:scale-125` : ""}`}
        />
      ))}
      <text x={98} y={88} className={T}>
        by user ID
      </text>
    </>
  ),

  "golden-signals": () => (
    <>
      {["latency", "traffic", "errors", "saturation"].map((l, i) => (
        <g key={l}>
          <rect
            x={10 + (i % 2) * 72}
            y={14 + Math.floor(i / 2) * 38}
            width={66}
            height={32}
            rx={4}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1.1}
          />
          <text
            x={15 + (i % 2) * 72}
            y={23 + Math.floor(i / 2) * 38}
            className="fill-fg font-mono text-[5.5px]"
          >
            {l}
          </text>
          <Line
            x={15 + (i % 2) * 72}
            y={26 + Math.floor(i / 2) * 38}
            w={56}
            h={16}
            v={
              [
                [0.3, 0.35, 0.3, 0.8, 0.9],
                [0.5, 0.6, 0.55, 0.65, 0.6],
                [0.1, 0.1, 0.15, 0.7, 0.8],
                [0.4, 0.5, 0.6, 0.7, 0.85],
              ][i]
            }
            cls={i === 2 ? "stroke-viz-remove" : "stroke-viz-data"}
            className={i === 2 ? `${A} group-hover:-translate-y-0.5` : ""}
          />
        </g>
      ))}
    </>
  ),

  "structured-logging": () => (
    <>
      <rect
        x={10}
        y={22}
        width={60}
        height={44}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.1}
      />
      {["payment failed", "for user 42 at", "bank HDFC 504"].map((l, i) => (
        <text key={l} x={14} y={34 + i * 9} className="fill-muted font-mono text-[5px]">
          {l}
        </text>
      ))}
      <Arrow x1={74} y1={44} x2={86} y2={44} />
      <rect
        x={90}
        y={18}
        width={60}
        height={52}
        rx={4}
        className={`fill-viz-meta/15 stroke-viz-meta ${A} group-hover:translate-x-0.5`}
        strokeWidth={1.1}
      />
      {['"event": "pay_fail"', '"bank": "HDFC"', '"code": 504', '"trace": "4bf9"'].map((l, i) => (
        <text key={l} x={94} y={30 + i * 10} className="fill-fg font-mono text-[5px]">
          {l}
        </text>
      ))}
    </>
  ),

  "log-pipelines": () => (
    <>
      {[0, 1, 2].map((i) => (
        <FileIcon
          key={i}
          x={10}
          y={16 + i * 22}
          cls="fill-viz-meta/20 stroke-viz-meta"
          w={10}
          h={13}
        />
      ))}
      <Arrow x1={24} y1={44} x2={40} y2={44} />
      <path
        d="M42 30h30l-8 14 8 14H42l8-14z"
        className={`fill-accent/15 stroke-accent ${A} group-hover:translate-x-0.5`}
        strokeWidth={1.2}
      />
      <text x={56} y={70} textAnchor="middle" className={T}>
        parse · mask · drop
      </text>
      <Arrow x1={76} y1={44} x2={94} y2={44} />
      <path
        d="M98 32c0-4 44-4 44 0v24c0 4-44 4-44 0z"
        className="fill-viz-data/15 stroke-viz-data"
        strokeWidth={1.2}
      />
      <path d="M98 32c0 4 44 4 44 0" className="stroke-viz-data" strokeWidth={1.2} />
      <text x={120} y={74} textAnchor="middle" className={T}>
        store
      </text>
    </>
  ),

  "distributed-tracing": () => (
    <>
      {[
        [10, 140, "checkout"],
        [22, 60, "auth"],
        [50, 96, "payment"],
        [62, 70, "bank"],
      ].map(([x, w, l], i) => (
        <g key={l as string}>
          <rect
            x={x as number}
            y={18 + i * 16}
            width={w as number}
            height={10}
            rx={2}
            className={
              i === 3
                ? `fill-viz-remove/30 stroke-viz-remove ${A} group-hover:translate-x-0.5`
                : "fill-viz-compute/25 stroke-viz-compute"
            }
            strokeWidth={1}
          />
          <text x={(x as number) + 3} y={25 + i * 16} className="fill-fg font-mono text-[5px]">
            {l}
          </text>
        </g>
      ))}
      <text x={10} y={90} className={T}>
        one request, every hop
      </text>
    </>
  ),

  "trace-sampling": () => (
    <>
      {Array.from({ length: 40 }, (_, i) => {
        const err = i === 7 || i === 23 || i === 31;
        const kept = err || i % 10 === 0;
        return (
          <circle
            key={i}
            cx={16 + (i % 10) * 13}
            cy={20 + Math.floor(i / 10) * 13}
            r={3.6}
            className={
              err
                ? `fill-viz-remove/70 ${A} group-hover:scale-125`
                : kept
                  ? "fill-viz-data/60"
                  : "fill-viz-idle/25"
            }
          />
        );
      })}
      <text x={12} y={84} className={T}>
        keep every error, a few of the rest
      </text>
    </>
  ),
};
