import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Phone } from "./mobile-a";
import { Cyl } from "./backend-a";
import { Office } from "./building-for-government-a";

/** Card illustrations for the Building for Government track (modules 12–22), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const META = "fill-viz-meta/25 stroke-viz-meta";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const govArtB: ArtMap = {
  "service-design-gov": () => (
    <>
      <path
        d="M20 80 H80 V20 H140"
        className="stroke-line-strong"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 80 Q80 76 140 20"
        className={`stroke-accent ${A} group-hover:opacity-70`}
        strokeWidth={2.5}
        fill="none"
        strokeDasharray="5 4"
      />
      <text x={92} y={70} className={T}>
        where people walk
      </text>
    </>
  ),

  "low-bandwidth": () => (
    <>
      <Phone x={20} y={20} />
      <rect x={25} y={34} width={24} height={20} rx={2} className={DATA} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={74 + i * 9}
          y={62 - i * 8}
          width={6}
          height={8 + i * 8}
          rx={1.5}
          className={i < 1 ? GOOD : "fill-surface-2 stroke-line"}
        />
      ))}
      <Svc
        x={116}
        y={34}
        w={30}
        h={14}
        label="SMS"
        cls={HOT}
        className={`${A} group-hover:scale-110`}
      />
      <Svc x={116} y={54} w={30} h={14} label="voice" />
    </>
  ),

  "forms-payments": () => (
    <>
      {[100, 88, 74, 66, 60].map((h, i) => (
        <rect
          key={i}
          x={18 + i * 26}
          y={80 - h * 0.6}
          width={20}
          height={h * 0.6}
          rx={2}
          className={i === 4 ? `${GOOD} ${A} group-hover:scale-y-110` : DATA}
        />
      ))}
      <text x={18} y={92} className={T}>
        start → submit → paid
      </text>
    </>
  ),

  "grievance-feedback": () => (
    <>
      <rect
        x={20}
        y={20}
        width={70}
        height={60}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1}
      />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={26}
          y={28 + i * 12}
          width={58}
          height={7}
          rx={1.5}
          className={
            i % 2 === 0
              ? `${BAD} ${i === 0 ? `${A} group-hover:translate-x-1` : ""}`
              : "fill-surface-2"
          }
        />
      ))}
      <circle cx={118} cy={48} r={18} className={META} strokeWidth={1.1} />
      <text x={118} y={51} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        21 d
      </text>
    </>
  ),

  "gov-security": () => (
    <>
      <Office x={18} y={30} />
      <Arrow x1={62} y1={46} x2={94} y2={46} />
      <circle
        cx={118}
        cy={46}
        r={18}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={118} y={49} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        6 h
      </text>
      <text x={18} y={88} className={T}>
        report to CERT-In
      </text>
    </>
  ),

  "surge-scale": () => (
    <>
      <line x1={14} y1={50} x2={146} y2={50} className="stroke-viz-compute" strokeDasharray="3 2" />
      {[60, 44, 30, 20, 14, 10, 8, 6].map((h, i) => (
        <rect
          key={i}
          x={16 + i * 16}
          y={80 - h}
          width={12}
          height={h}
          rx={1.5}
          className={h > 30 ? `${BAD} ${A} group-hover:scale-y-75` : GOOD}
        />
      ))}
      <text x={14} y={92} className={T}>
        10:00 results
      </text>
    </>
  ),

  "continuity-records": () => (
    <>
      <Cyl x={24} y={34} />
      <Arrow x1={52} y1={46} x2={96} y2={46} dash="3 3" />
      <Cyl x={102} y={34} cls={`${GOOD} ${A} group-hover:scale-105`} />
      <text x={24} y={76} className={T}>
        primary
      </text>
      <text x={102} y={76} className={T}>
        other region
      </text>
    </>
  ),

  "open-source-gov": () => (
    <>
      <rect
        x={58}
        y={20}
        width={44}
        height={56}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.1}
      />
      <text x={80} y={50} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        {"</>"}
      </text>
      {[
        [16, 30],
        [16, 60],
        [120, 30],
        [120, 60],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={24} height={12} rx={2} className={DATA} />
          <line
            x1={x < 80 ? x + 24 : x}
            y1={y + 6}
            x2={x < 80 ? 58 : 102}
            y2={48}
            className="stroke-line-strong"
            strokeWidth={0.8}
          />
        </g>
      ))}
    </>
  ),

  "vendors-contracts": () => (
    <>
      <rect
        x={44}
        y={14}
        width={72}
        height={70}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      {["code: yours", "SLA: 99.5%", "exit: planned"].map((t, i) => (
        <g key={t}>
          <rect
            x={50}
            y={24 + i * 16}
            width={6}
            height={6}
            rx={1}
            className={`${GOOD} ${i === 2 ? `${A} group-hover:scale-125` : ""}`}
          />
          <text x={60} y={29 + i * 16} className="fill-fg font-mono text-[6px]">
            {t}
          </text>
        </g>
      ))}
    </>
  ),

  "measuring-outcomes": () => (
    <>
      {[
        ["visits ↑", "fill-surface-2/60 stroke-line-strong"],
        ["completed", GOOD],
        ["left out", META],
      ].map(([t, cls], i) => (
        <g key={t}>
          <rect
            x={16 + i * 46}
            y={30}
            width={40}
            height={36}
            rx={4}
            className={`${cls} ${i === 1 ? `${A} group-hover:scale-105` : ""}`}
            strokeWidth={1}
          />
          <text x={36 + i * 46} y={51} textAnchor="middle" className="fill-fg font-mono text-[6px]">
            {t}
          </text>
        </g>
      ))}
    </>
  ),

  "capstone-gov": () => (
    <>
      <Office x={60} y={14} cls={HOT} className={`${A} group-hover:-translate-y-1`} />
      {["tender", "build", "audit", "launch", "measure"].map((t, i) => (
        <g key={t}>
          <circle
            cx={20 + i * 30}
            cy={70}
            r={4}
            className={i === 4 ? "fill-good" : "fill-accent"}
          />
          {i < 4 && (
            <line
              x1={24 + i * 30}
              y1={70}
              x2={46 + i * 30}
              y2={70}
              className="stroke-line-strong"
            />
          )}
          <text
            x={20 + i * 30}
            y={84}
            textAnchor="middle"
            className="fill-muted font-mono text-[5.5px]"
          >
            {t}
          </text>
        </g>
      ))}
    </>
  ),
};
