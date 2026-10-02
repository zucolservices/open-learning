import { A, FileIcon, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";

/** Card illustrations for the CI/CD track (modules 1–11), keyed by module slug. */

/** A pipeline stage: a small rounded box with a label. */
export function Stage({
  x,
  y,
  w = 26,
  h = 16,
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

/** A tick or cross badge. */
export function Mark({
  x,
  y,
  ok,
  className = "",
}: {
  x: number;
  y: number;
  ok: boolean;
  className?: string;
}) {
  return ok ? (
    <path
      d={`M${x - 4} ${y}l3 3 6-6`}
      className={`stroke-viz-add ${className}`}
      strokeWidth={1.6}
    />
  ) : (
    <path
      d={`M${x - 3} ${y - 3}l6 6M${x + 3} ${y - 3}l-6 6`}
      className={`stroke-viz-remove ${className}`}
      strokeWidth={1.6}
    />
  );
}

export const ciCdArtA: ArtMap = {
  "why-ci-cd": () => (
    <>
      <rect
        x={14}
        y={22}
        width={46}
        height={44}
        rx={4}
        className="fill-viz-remove/15 stroke-viz-remove"
        strokeWidth={1.2}
      />
      <text x={37} y={47} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        240
      </text>
      <text x={37} y={76} textAnchor="middle" className={T}>
        one big release
      </text>
      <Arrow x1={66} y1={44} x2={84} y2={44} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={90 + (i % 4) * 14}
          y={26 + Math.floor(i / 4) * 14}
          width={10}
          height={10}
          rx={2}
          className={`${i === 6 ? "fill-viz-remove/30 stroke-viz-remove" : "fill-viz-add/25 stroke-viz-add"} ${i === 6 ? "" : `${A} group-hover:-translate-y-0.5`}`}
          strokeWidth={1}
        />
      ))}
      <text x={114} y={76} textAnchor="middle" className={T}>
        small and daily
      </text>
    </>
  ),

  "branching-strategies": () => (
    <>
      <path d="M12 60h136" className="stroke-fg" strokeWidth={1.6} />
      <path
        d="M30 60c8-24 14-24 22-24h60c10 0 14 24 22 24"
        className="stroke-viz-remove"
        strokeWidth={1.3}
        strokeDasharray="3 2"
      />
      <text x={72} y={30} textAnchor="middle" className="fill-viz-remove font-mono text-[6px]">
        2-week branch
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${28 + i * 24} 60c3-8 6-8 9-8h4c3 0 4 8 6 8`}
          className={`stroke-viz-add ${A} group-hover:-translate-y-0.5`}
          strokeWidth={1.3}
        />
      ))}
      <text x={12} y={76} className={T}>
        trunk: merge daily
      </text>
    </>
  ),

  "pipeline-anatomy": () => (
    <>
      <FileIcon x={12} y={34} cls="fill-viz-meta/20 stroke-viz-meta" />
      <text x={10} y={62} className={T}>
        ci.yml
      </text>
      <Arrow x1={28} y1={42} x2={40} y2={42} />
      <Stage x={42} y={22} label="lint" />
      <Stage x={42} y={46} label="test" />
      <Arrow x1={70} y1={30} x2={82} y2={40} />
      <Arrow x1={70} y1={54} x2={82} y2={44} />
      <Stage x={84} y={34} label="build" className={`${A} group-hover:-translate-y-0.5`} />
      <Arrow x1={112} y1={42} x2={124} y2={42} />
      <circle cx={136} cy={42} r={8} className="fill-viz-add/20 stroke-viz-add" strokeWidth={1.2} />
      <Mark x={136} y={42} ok />
    </>
  ),

  "builds-caching": () => (
    <>
      <rect
        x={14}
        y={24}
        width={52}
        height={40}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={20} y={34} className="fill-fg font-mono text-[6px]">
        package-lock
      </text>
      {["colors 1.4.0", "react 19.2", "zod 4.1"].map((l, i) => (
        <text key={l} x={20} y={44 + i * 7} className="fill-muted font-mono text-[5.5px]">
          {l}
        </text>
      ))}
      <Arrow x1={70} y1={44} x2={86} y2={44} />
      <path
        d="M92 30h40l8 14-8 14H92l8-14z"
        className={`fill-viz-add/20 stroke-viz-add ${A} group-hover:translate-x-1`}
        strokeWidth={1.2}
      />
      <text x={116} y={46} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        cache hit
      </text>
      <text x={14} y={80} className={T}>
        same lockfile, same build
      </text>
    </>
  ),

  "test-pyramid": () => (
    <>
      <path
        d="M80 14l18 22H62z"
        className="fill-viz-compute/30 stroke-viz-compute"
        strokeWidth={1.2}
      />
      <path
        d="M62 38h36l14 18H48z"
        className="fill-viz-data/25 stroke-viz-data"
        strokeWidth={1.2}
      />
      <path
        d="M48 58h64l14 20H34z"
        className={`fill-viz-add/25 stroke-viz-add ${A} group-hover:translate-y-0.5`}
        strokeWidth={1.2}
      />
      <text x={80} y={31} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        e2e
      </text>
      <text x={80} y={50} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        integration
      </text>
      <text x={80} y={71} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        unit
      </text>
    </>
  ),

  "pipeline-speed": () => (
    <>
      <rect
        x={20}
        y={22}
        width={120}
        height={10}
        rx={2}
        className="fill-viz-remove/25 stroke-viz-remove"
      />
      <text x={20} y={16} className={T}>
        45 min, one machine
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={20}
          y={44 + i * 9}
          width={26 + (i % 2) * 4}
          height={6}
          rx={2}
          className={`fill-viz-add/30 stroke-viz-add ${A} group-hover:scale-x-110`}
        />
      ))}
      <path d="M58 40v40" className="stroke-viz-add" strokeDasharray="2 2" />
      <text x={64} y={64} className="fill-viz-add font-mono text-[7px]">
        under 10
      </text>
    </>
  ),

  "quality-gates": () => (
    <>
      <path d="M12 46h136" className="stroke-fg" strokeWidth={1.6} />
      <text x={130} y={58} className={T}>
        main
      </text>
      <rect
        x={70}
        y={22}
        width={8}
        height={48}
        rx={2}
        className="fill-accent/40 stroke-accent"
        strokeWidth={1.2}
      />
      {[
        [24, 30, true],
        [32, 46, false],
        [20, 60, true],
      ].map(([x, y, ok], i) => (
        <g key={i} className={ok ? `${A} group-hover:translate-x-2` : ""}>
          <rect
            x={x as number}
            y={(y as number) - 5}
            width={20}
            height={10}
            rx={2}
            className={
              ok ? "fill-viz-add/25 stroke-viz-add" : "fill-viz-remove/25 stroke-viz-remove"
            }
          />
        </g>
      ))}
      <Mark x={98} y={36} ok />
      <text x={86} y={78} className={T}>
        checks · review · queue
      </text>
    </>
  ),

  "artifacts-versioning": () => (
    <>
      <path
        d="M16 36l14-8 14 8v16l-14 8-14-8z"
        className="fill-viz-data/20 stroke-viz-data"
        strokeWidth={1.2}
      />
      <text x={30} y={72} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        2.4.1
      </text>
      {["test", "staging", "prod"].map((l, i) => (
        <g key={l}>
          <Arrow x1={48 + i * 36} y1={44} x2={60 + i * 36} y2={44} />
          <rect
            x={62 + i * 36}
            y={34}
            width={22}
            height={20}
            rx={3}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1.2}
          />
          <path
            d={`M${68 + i * 36} 40l5-3 5 3v6l-5 3-5-3z`}
            className={`fill-viz-data/30 stroke-viz-data ${A} group-hover:-translate-y-0.5`}
          />
          <text
            x={73 + i * 36}
            y={64}
            textAnchor="middle"
            className="fill-muted font-mono text-[5px]"
          >
            {l}
          </text>
        </g>
      ))}
    </>
  ),

  "container-builds": () => (
    <>
      {["FROM node:24", "COPY package*.json", "RUN npm ci", "COPY . .", "RUN npm run build"].map(
        (l, i) => (
          <g key={l}>
            <rect
              x={18 + i * 3}
              y={66 - i * 11}
              width={70}
              height={9}
              rx={2}
              className={
                i < 3 ? "fill-viz-add/20 stroke-viz-add" : "fill-viz-compute/25 stroke-viz-compute"
              }
            />
            <text x={22 + i * 3} y={72 - i * 11} className="fill-fg font-mono text-[5px]">
              {l}
            </text>
          </g>
        ),
      )}
      <Arrow x1={98} y1={44} x2={112} y2={44} />
      <rect
        x={116}
        y={34}
        width={28}
        height={20}
        rx={3}
        className={`fill-viz-data/20 stroke-viz-data ${A} group-hover:scale-90`}
        strokeWidth={1.2}
      />
      <text x={130} y={47} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        280 MB
      </text>
    </>
  ),

  "environments-promotion": () => (
    <>
      {["test", "staging", "prod"].map((l, i) => (
        <g key={l}>
          <rect
            x={14 + i * 48}
            y={26}
            width={36}
            height={36}
            rx={4}
            className={
              i === 2 ? "fill-accent/15 stroke-accent" : "fill-surface-2/60 stroke-line-strong"
            }
            strokeWidth={1.2}
          />
          <text
            x={32 + i * 48}
            y={22}
            textAnchor="middle"
            className="fill-muted font-mono text-[6px]"
          >
            {l}
          </text>
          <path
            d={`M${26 + i * 48} 40l6-4 6 4v8l-6 4-6-4z`}
            className="fill-viz-data/30 stroke-viz-data"
          />
          {i < 2 && <Arrow x1={52 + i * 48} y1={44} x2={60 + i * 48} y2={44} />}
        </g>
      ))}
      <rect
        x={110}
        y={66}
        width={44}
        height={10}
        rx={2}
        className={`fill-viz-compute/20 stroke-viz-compute ${A} group-hover:-translate-y-0.5`}
      />
      <text x={132} y={73} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        approve ✓
      </text>
    </>
  ),

  "iac-pipelines": () => (
    <>
      <rect
        x={14}
        y={18}
        width={96}
        height={56}
        rx={4}
        className="fill-surface-2/70 stroke-line-strong"
        strokeWidth={1.2}
      />
      {[
        ["+ alarm.cpu_high", "fill-viz-add"],
        ["~ sg_rule.app_to_db", "fill-viz-compute"],
        ["-/+ db_instance.main", "fill-viz-remove"],
        ["Plan: 2 add, 1 destroy", "fill-fg"],
      ].map(([l, c], i) => (
        <text key={l} x={20} y={32 + i * 11} className={`${c} font-mono text-[6px]`}>
          {l}
        </text>
      ))}
      <circle
        cx={132}
        cy={46}
        r={12}
        className={`stroke-viz-remove ${A} group-hover:scale-110`}
        strokeWidth={1.6}
      />
      <path d="M128 42l8 8M136 42l-8 8" className="stroke-viz-remove" strokeWidth={1.6} />
    </>
  ),
};
