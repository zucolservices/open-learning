import { A, FileIcon, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Line, Svc } from "./observability-a";

/** Card illustrations for the Observability track (modules 12–21), keyed by module slug. */

export const observabilityArtB: ArtMap = {
  profiling: () => (
    <>
      {[
        [10, 140, 0],
        [10, 90, 1],
        [100, 50, 1],
        [10, 60, 2],
        [70, 30, 2],
        [10, 44, 3],
      ].map(([x, w, r], i) => (
        <rect
          key={i}
          x={x}
          y={66 - r * 13}
          width={w}
          height={11}
          rx={1.5}
          className={
            i === 5
              ? `fill-viz-remove/50 stroke-viz-remove ${A} group-hover:-translate-y-0.5`
              : "fill-viz-compute/30 stroke-viz-compute"
          }
          strokeWidth={0.8}
        />
      ))}
      <text x={10} y={90} className={T}>
        flame graph: where CPU goes
      </text>
    </>
  ),

  "slis-slos": () => (
    <>
      <rect
        x={14}
        y={20}
        width={132}
        height={14}
        rx={7}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1}
      />
      <rect
        x={14}
        y={20}
        width={128}
        height={14}
        rx={7}
        className={`fill-viz-add/40 ${A} group-hover:translate-x-0.5`}
      />
      <path d="M132 16v22" className="stroke-viz-meta" strokeWidth={1.4} strokeDasharray="2 2" />
      <text x={14} y={50} className="fill-fg font-mono text-[7px]">
        SLI 99.95%
      </text>
      <text x={110} y={50} className="fill-viz-meta font-mono text-[7px]">
        SLO 99.9%
      </text>
      <text x={14} y={72} className={T}>
        good payments ÷ all payments
      </text>
    </>
  ),

  "error-budgets": () => (
    <>
      <rect
        x={14}
        y={18}
        width={132}
        height={10}
        rx={5}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1}
      />
      <rect x={14} y={18} width={52} height={10} rx={5} className="fill-viz-compute/60" />
      <Line
        x={14}
        y={38}
        w={132}
        h={36}
        v={[1, 0.95, 0.9, 0.55, 0.5, 0.42, 0.38]}
        cls="stroke-accent"
        className={`${A} group-hover:translate-y-0.5`}
      />
      <path d="M14 74h132" className="stroke-line" strokeWidth={1} strokeDasharray="3 3" />
      <text x={14} y={88} className={T}>
        budget left this month
      </text>
    </>
  ),

  alerting: () => (
    <>
      {Array.from({ length: 28 }, (_, i) => {
        const v = i >= 18 && i <= 21 ? 0.85 : i === 6 ? 0.45 : 0.12 + (i % 3) * 0.04;
        return (
          <rect
            key={i}
            x={12 + i * 4.8}
            y={70 - v * 46}
            width={3.6}
            height={v * 46}
            className={v > 0.5 ? "fill-viz-remove/60" : "fill-viz-data/35"}
          />
        );
      })}
      <path
        d="M104 14c0-5 4-7 6-7s6 2 6 7v6l2 3h-16l2-3z"
        className={`fill-viz-remove/30 stroke-viz-remove ${A} group-hover:-rotate-12`}
        strokeWidth={1.2}
      />
      <text x={12} y={86} className={T}>
        page on burn rate, not blips
      </text>
    </>
  ),

  dashboards: () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={10 + i * 36}
            y={14}
            width={32}
            height={26}
            rx={3}
            className="fill-viz-add/10 stroke-viz-add"
            strokeWidth={1}
          />
          <Line
            x={13 + i * 36}
            y={20}
            w={26}
            h={16}
            v={
              [
                [0.3, 0.4, 0.3, 0.5],
                [0.5, 0.6, 0.7, 0.6],
                [0.1, 0.1, 0.2, 0.1],
                [0.4, 0.5, 0.5, 0.6],
              ][i]
            }
            className={i === 0 ? `${A} group-hover:-translate-y-0.5` : ""}
          />
        </g>
      ))}
      {[0, 1].map((r) => (
        <rect
          key={r}
          x={10 + r * 8}
          y={48 + r * 16}
          width={140 - r * 16}
          height={12}
          rx={3}
          className="fill-surface-2/60 stroke-line-strong"
          strokeWidth={1}
        />
      ))}
      <text x={10} y={92} className={T}>
        are users OK? then where, then why
      </text>
    </>
  ),

  investigation: () => (
    <>
      <circle
        cx={58}
        cy={44}
        r={24}
        className="stroke-accent"
        strokeWidth={1.3}
        strokeDasharray="4 3"
      />
      {["look", "guess", "test"].map((l, i) => {
        const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
        return (
          <text
            key={l}
            x={58 + Math.cos(a) * 24}
            y={46 + Math.sin(a) * 24}
            textAnchor="middle"
            className="fill-fg font-mono text-[6px]"
          >
            {l}
          </text>
        );
      })}
      <circle
        cx={118}
        cy={40}
        r={12}
        className={`stroke-fg ${A} group-hover:scale-110`}
        strokeWidth={1.6}
      />
      <path d="M127 49l12 12" className="stroke-fg" strokeWidth={2.2} />
      <text x={12} y={88} className={T}>
        hypothesis, evidence, repeat
      </text>
    </>
  ),

  "incident-response": () => (
    <>
      <circle
        cx={80}
        cy={40}
        r={12}
        className={`fill-viz-remove/25 stroke-viz-remove ${A} group-hover:scale-110`}
        strokeWidth={1.3}
      />
      <text x={80} y={42} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        IC
      </text>
      {[
        [30, 22, "ops"],
        [130, 22, "comms"],
        [30, 62, "scribe"],
        [130, 62, "SMEs"],
      ].map(([x, y, l]) => (
        <g key={l as string}>
          <path d={`M80 40L${x} ${y}`} className="stroke-line-strong" strokeWidth={1} />
          <circle
            cx={x as number}
            cy={y as number}
            r={9}
            className="fill-surface-2 stroke-line-strong"
            strokeWidth={1.1}
          />
          <text
            x={x as number}
            y={(y as number) + 2}
            textAnchor="middle"
            className="fill-fg font-mono text-[5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={12} y={90} className={T}>
        one in charge, one job each
      </text>
    </>
  ),

  postmortems: () => (
    <>
      <FileIcon x={14} y={16} cls="fill-surface-2/60 stroke-line-strong" w={50} h={60} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={20}
          y={28 + i * 9}
          width={i === 1 ? 28 : 36}
          height={3}
          rx={1}
          className={i === 1 ? "fill-viz-remove/50" : "fill-muted/40"}
        />
      ))}
      <path d="M18 38h32" className="stroke-viz-remove" strokeWidth={1} />
      <Arrow x1={70} y1={46} x2={84} y2={46} />
      {["check", "alert", "test"].map((l, i) => (
        <g key={l} className={`${A} group-hover:translate-x-0.5`}>
          <rect
            x={90}
            y={22 + i * 18}
            width={58}
            height={13}
            rx={3}
            className="fill-viz-add/15 stroke-viz-add"
            strokeWidth={1}
          />
          <text x={96} y={30.5 + i * 18} className="fill-fg font-mono text-[5.5px]">
            fix: {l}
          </text>
        </g>
      ))}
      <text x={14} y={90} className={T}>
        fix systems, not people
      </text>
    </>
  ),

  "observability-cost": () => (
    <>
      {[
        [0.85, "per host"],
        [0.35, "per GB"],
        [0.95, "per series"],
        [0.3, "per event"],
      ].map(([v, l], i) => (
        <g key={l as string}>
          <rect
            x={16 + i * 34}
            y={66 - (v as number) * 46}
            width={22}
            height={(v as number) * 46}
            rx={2}
            className={`fill-viz-data/35 stroke-viz-data ${i === 2 ? `${A} group-hover:-translate-y-0.5` : ""}`}
            strokeWidth={1}
          />
          <text
            x={27 + i * 34}
            y={78}
            textAnchor="middle"
            className="fill-muted font-mono text-[5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={14} y={92} className={T}>
        same data, different bills
      </text>
    </>
  ),

  "capstone-observability": () => (
    <>
      {[0, 1, 2].map((i) => (
        <Svc
          key={i}
          x={10 + i * 30}
          y={18}
          w={26}
          label={["app", "pay", "bank"][i]}
          cls="fill-viz-data/15 stroke-viz-data"
        />
      ))}
      <Arrow x1={50} y1={34} x2={50} y2={46} />
      <rect
        x={20}
        y={48}
        width={60}
        height={14}
        rx={3}
        className="fill-accent/15 stroke-accent"
        strokeWidth={1.2}
      />
      <text x={50} y={57} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        OTel Collector
      </text>
      <rect
        x={96}
        y={16}
        width={52}
        height={50}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.1}
      />
      <Line
        x={100}
        y={24}
        w={44}
        h={18}
        v={[0.3, 0.3, 0.35, 0.9, 0.4]}
        cls="stroke-viz-remove"
        className={`${A} group-hover:-translate-y-0.5`}
      />
      <text x={100} y={56} className="fill-fg font-mono text-[5.5px]">
        SLO 99.9%
      </text>
      <Arrow x1={82} y1={55} x2={94} y2={48} />
      <text x={10} y={84} className={T}>
        a payments platform, end to end
      </text>
    </>
  ),
};
