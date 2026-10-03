import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the API Design track (modules 12–21), keyed by module slug. */

export const apiDesignArtB: ArtMap = {
  grpc: () => (
    <>
      {["0a", "06", "6f", "72", "10", "a8", "b4", "1a"].map((h, i) => (
        <g key={i}>
          <rect
            x={12 + i * 17}
            y={28}
            width={14}
            height={14}
            rx={2}
            className={
              i % 4 === 0
                ? `fill-accent/25 stroke-accent ${A} group-hover:-translate-y-0.5`
                : "fill-surface-2/60 stroke-line-strong"
            }
            strokeWidth={1}
          />
          <text
            x={19 + i * 17}
            y={37.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[5px]"
          >
            {h}
          </text>
        </g>
      ))}
      <Mono x={12} y={60} text="string id = 1;  int64 total = 2;" cls="fill-muted" />
      <text x={12} y={82} className={T}>
        numbers travel, names don&apos;t
      </text>
    </>
  ),

  graphql: () => (
    <>
      <circle cx={30} cy={44} r={7} className="fill-accent/30 stroke-accent" strokeWidth={1.2} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M37 44L70 ${22 + i * 22}`} className="stroke-line-strong" strokeWidth={1} />
          <circle
            cx={74}
            cy={22 + i * 22}
            r={5}
            className="fill-viz-data/30 stroke-viz-data"
            strokeWidth={1}
          />
          {[0, 1, 2].map((j) => (
            <g key={j}>
              <path
                d={`M79 ${22 + i * 22}L108 ${16 + i * 22 + j * 6}`}
                className="stroke-line"
                strokeWidth={0.8}
              />
              <circle
                cx={111}
                cy={16 + i * 22 + j * 6}
                r={2.2}
                className={`fill-viz-remove/50 ${i === 1 && j === 1 ? `${A} group-hover:scale-150` : ""}`}
              />
            </g>
          ))}
        </g>
      ))}
      <text x={12} y={88} className={T}>
        one query, many lookups
      </text>
    </>
  ),

  webhooks: () => (
    <>
      <Svc x={10} y={34} w={34} label="provider" />
      <Arrow x1={46} y1={41} x2={100} y2={41} />
      <rect
        x={58}
        y={28}
        width={34}
        height={10}
        rx={2}
        className={`fill-viz-meta/25 stroke-viz-meta ${A} group-hover:translate-x-1`}
        strokeWidth={0.9}
      />
      <Mono x={61} y={35} text="evt_7 · sig" />
      <Svc x={104} y={34} w={46} label="your server" cls="fill-viz-add/15 stroke-viz-add" />
      <text x={10} y={76} className={T}>
        they call you, signed
      </text>
    </>
  ),

  realtime: () => (
    <>
      <Svc x={10} y={20} w={30} label="server" />
      <Svc x={120} y={20} w={30} label="app" />
      <path d="M42 27h76" className="stroke-viz-data" strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={52 + i * 18}
          cy={27}
          r={2.5}
          className={`fill-viz-compute ${i === 1 ? `${A} group-hover:translate-x-2` : ""}`}
        />
      ))}
      <Svc x={10} y={52} w={30} label="server" />
      <Svc x={120} y={52} w={30} label="app" />
      <path d="M42 56h76M118 62H42" className="stroke-viz-meta" strokeWidth={1.4} />
      <text x={10} y={88} className={T}>
        streams one way, sockets both
      </text>
    </>
  ),

  authentication: () => (
    <>
      <path
        d="M30 30a10 10 0 1 1 0 20a10 10 0 1 1 0-20z"
        className="stroke-viz-compute"
        strokeWidth={1.6}
      />
      <path
        d="M40 40h40v6M66 40v5"
        className={`stroke-viz-compute ${A} group-hover:translate-x-1`}
        strokeWidth={1.6}
      />
      <rect
        x={90}
        y={24}
        width={60}
        height={32}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1}
      />
      <Mono x={94} y={34} text="eyJhbGci…" cls="fill-viz-meta" />
      <Mono x={94} y={43} text=".eyJzdWIi…" cls="fill-accent" />
      <Mono x={94} y={52} text=".kTq3…" cls="fill-viz-compute" />
      <text x={12} y={78} className={T}>
        a valet key, not the master
      </text>
    </>
  ),

  "api-security": () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={14 + i * 34}
            y={22}
            width={26}
            height={38}
            rx={2}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1.1}
          />
          <circle cx={34 + i * 34} cy={42} r={1.6} className="fill-fg" />
          <rect
            x={30 + i * 34}
            y={44}
            width={8}
            height={7}
            rx={1}
            className={
              i === 2
                ? `fill-viz-remove/40 stroke-viz-remove ${A} group-hover:-translate-y-0.5`
                : "fill-viz-add/30 stroke-viz-add"
            }
            strokeWidth={0.8}
          />
        </g>
      ))}
      <text x={14} y={80} className={T}>
        a lock on every door
      </text>
    </>
  ),

  "rate-limits": () => (
    <>
      <path d="M56 22v40c0 6 48 6 48 0V22" className="stroke-line-strong" strokeWidth={1.4} />
      <rect
        x={57}
        y={40}
        width={46}
        height={26}
        rx={2}
        className={`fill-viz-data/35 ${A} group-hover:translate-y-1`}
      />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={80} cy={8 + i * 6} r={1.6} className="fill-viz-data" />
      ))}
      <Arrow x1={106} y1={56} x2={132} y2={56} />
      <text x={136} y={58} className="fill-viz-remove font-mono text-[6px]">
        429
      </text>
      <text x={12} y={88} className={T}>
        fair shares, then come back later
      </text>
    </>
  ),

  "api-performance": () => (
    <>
      {["200 · 48 KB", "cache · 0", "304 · 0.3", "200 · 9.6", "cache · 0"].map((l, i) => (
        <g key={i}>
          <rect
            x={14}
            y={14 + i * 13}
            width={Math.max(14, [96, 8, 12, 40, 8][i])}
            height={9}
            rx={2}
            className={
              i === 2
                ? `fill-viz-add/40 ${A} group-hover:translate-x-1`
                : i % 2
                  ? "fill-viz-idle/30"
                  : "fill-viz-data/40"
            }
          />
          <Mono x={116} y={21 + i * 13} text={l} cls="fill-muted" />
        </g>
      ))}
      <text x={14} y={90} className={T}>
        the fastest request is never sent
      </text>
    </>
  ),

  "gateways-dx": () => (
    <>
      <Svc x={10} y={36} w={26} label="apps" />
      <Arrow x1={38} y1={43} x2={52} y2={43} />
      <rect
        x={54}
        y={24}
        width={40}
        height={38}
        rx={4}
        className={`fill-accent/15 stroke-accent ${A} group-hover:scale-105`}
        strokeWidth={1.3}
      />
      <text x={74} y={46} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        gateway
      </text>
      {["track", "book", "price"].map((l, i) => (
        <g key={l}>
          <Arrow x1={96} y1={43} x2={116} y2={22 + i * 21} />
          <Svc x={118} y={15 + i * 21} w={32} label={l} />
        </g>
      ))}
      <text x={10} y={88} className={T}>
        one front door, then good signs
      </text>
    </>
  ),

  "capstone-api": () => (
    <>
      <rect
        x={14}
        y={30}
        width={30}
        height={24}
        rx={2}
        className="fill-viz-compute/25 stroke-viz-compute"
        strokeWidth={1.2}
      />
      <path d="M14 38h30M29 30v8" className="stroke-viz-compute" strokeWidth={1} />
      <Arrow x1={48} y1={42} x2={62} y2={42} />
      <rect
        x={64}
        y={18}
        width={86}
        height={50}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.1}
      />
      {["GET /parcels/{id}", "POST /shipments", "webhook: delivered"].map((l, i) => (
        <Mono key={l} x={69} y={31 + i * 12} text={l} cls={i === 2 ? "fill-accent" : "fill-fg"} />
      ))}
      <text x={14} y={86} className={T}>
        a parcel API, a year in the wild
      </text>
    </>
  ),
};
