import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Backend track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

/** A database cylinder. */
export function Cyl({
  x,
  y,
  cls = DATA,
  className = "",
}: {
  x: number;
  y: number;
  cls?: string;
  className?: string;
}) {
  return (
    <g className={className}>
      <path d={`M${x} ${y + 4} v16 a12 4 0 0 0 24 0 v-16`} className={cls} strokeWidth={1.1} />
      <ellipse cx={x + 12} cy={y + 4} rx={12} ry={4} className={cls} strokeWidth={1.1} />
    </g>
  );
}

export const backendArtA: ArtMap = {
  "what-a-backend-does": () => (
    <>
      <rect
        x={10}
        y={34}
        width={18}
        height={28}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <Svc x={40} y={40} w={22} h={14} label="LB" />
      <Svc
        x={74}
        y={40}
        w={30}
        h={14}
        label="app"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Cyl x={118} y={36} />
      <Arrow x1={30} y1={48} x2={38} y2={48} />
      <Arrow x1={64} y1={48} x2={72} y2={48} />
      <Arrow x1={106} y1={48} x2={116} y2={48} />
      <text x={10} y={84} className={T}>
        tap → server → database → reply
      </text>
    </>
  ),

  "http-servers": () => (
    <>
      {[
        ["200", GOOD],
        ["201", GOOD],
        ["404", DATA],
        ["429", DATA],
        ["500", BAD],
      ].map(([c, cls], i) => (
        <g key={c}>
          <rect
            x={16 + i * 27}
            y={36}
            width={22}
            height={18}
            rx={3}
            className={`${cls} ${i === 1 ? `${A} group-hover:scale-110` : ""}`}
            strokeWidth={1.1}
          />
          <text x={27 + i * 27} y={48} textAnchor="middle" className="fill-fg font-mono text-[7px]">
            {c}
          </text>
        </g>
      ))}
      <text x={16} y={80} className={T}>
        one request, one response
      </text>
    </>
  ),

  concurrency: () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={20}
          y={18 + i * 12}
          width={[90, 40, 70, 30, 60][i]}
          height={7}
          rx={3.5}
          className={i === 1 ? `${HOT} ${A} group-hover:scale-x-110` : DATA}
          strokeWidth={1}
        />
      ))}
      <text x={20} y={88} className={T}>
        many requests, mostly waiting
      </text>
    </>
  ),

  "project-structure": () => (
    <>
      {["handler", "service", "repository"].map((l, i) => (
        <g key={l}>
          <rect
            x={36}
            y={16 + i * 22}
            width={88}
            height={16}
            rx={3}
            className={i === 1 ? `${HOT} ${A} group-hover:scale-x-105` : DATA}
            strokeWidth={1.1}
          />
          <text
            x={80}
            y={27 + i * 22}
            textAnchor="middle"
            className="fill-fg font-mono text-[6.5px]"
          >
            {l}
          </text>
        </g>
      ))}
    </>
  ),

  middleware: () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={20 + i * 10}
          y={18 + i * 8}
          width={120 - i * 20}
          height={60 - i * 16}
          rx={6}
          className={i === 3 ? `${HOT} ${A} group-hover:scale-110` : "stroke-line-strong fill-none"}
          strokeWidth={1.1}
        />
      ))}
      <text x={80} y={51} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        handler
      </text>
    </>
  ),

  "validation-errors": () => (
    <>
      <rect
        x={20}
        y={20}
        width={120}
        height={56}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <text x={28} y={34} className="fill-bad font-mono text-[6.5px]">
        422 problem+json
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={28}
          y={42 + i * 9}
          width={[90, 70, 80][i]}
          height={4}
          rx={2}
          className={i === 0 ? `fill-accent/60 ${A} group-hover:scale-x-110` : "fill-viz-idle/50"}
        />
      ))}
    </>
  ),

  "service-config": () => (
    <>
      <rect
        x={58}
        y={24}
        width={44}
        height={40}
        rx={5}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <circle cx={80} cy={42} r={6} className="stroke-accent fill-none" strokeWidth={1.4} />
      <line x1={80} y1={48} x2={80} y2={56} className="stroke-accent" strokeWidth={1.4} />
      <text x={14} y={88} className={T}>
        secrets in a safe, not in code
      </text>
    </>
  ),

  "data-access": () => (
    <>
      <Cyl x={118} y={34} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={20}
          y1={24 + i * 8}
          x2={112}
          y2={46}
          className="stroke-bad/60"
          strokeWidth={0.8}
        />
      ))}
      <line x1={20} y1={78} x2={112} y2={52} className={`stroke-good ${A}`} strokeWidth={2} />
      <text x={14} y={92} className={T}>
        one query, not N+1
      </text>
    </>
  ),

  migrations: () => (
    <>
      {["phone", "mobile"].map((l, i) => (
        <g key={l}>
          <rect
            x={30 + i * 56}
            y={34}
            width={44}
            height={18}
            rx={3}
            className={i === 1 ? `${GOOD} ${A} group-hover:scale-105` : DATA}
            strokeWidth={1.1}
          />
          <text
            x={52 + i * 56}
            y={46}
            textAnchor="middle"
            className="fill-fg font-mono text-[6.5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={30} y={76} className={T}>
        expand → migrate → contract
      </text>
    </>
  ),

  "transactions-app": () => (
    <>
      <rect
        x={24}
        y={24}
        width={112}
        height={40}
        rx={5}
        className="stroke-accent fill-none"
        strokeWidth={1.2}
        strokeDasharray="4 2"
      />
      {["stock", "order", "outbox"].map((l, i) => (
        <Svc
          key={l}
          x={32 + i * 34}
          y={36}
          w={28}
          h={16}
          label={l}
          cls={i === 0 ? HOT : DATA}
          className={i === 0 ? `${A} group-hover:scale-105` : ""}
        />
      ))}
      <text x={24} y={82} className={T}>
        all or nothing
      </text>
    </>
  ),

  "caching-backend": () => (
    <>
      <Svc x={20} y={38} w={30} h={16} label="app" />
      <rect
        x={66}
        y={38}
        width={30}
        height={16}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={81} y={49} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        cache
      </text>
      <Cyl x={114} y={34} />
      <Arrow x1={52} y1={46} x2={64} y2={46} />
      <Arrow x1={98} y1={46} x2={112} y2={46} cls="stroke-line" />
      <text x={20} y={80} className={T}>
        fast copy, kept fresh
      </text>
    </>
  ),
};
