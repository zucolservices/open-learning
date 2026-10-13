import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Phone } from "./mobile-a";

/** Card illustrations for the Mobile track (modules 12–22), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const META = "fill-viz-meta/25 stroke-viz-meta";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const mobileArtB: ArtMap = {
  "permissions-privacy": () => (
    <>
      <Phone x={63} y={18} w={34} h={64}>
        <rect
          x={66}
          y={36}
          width={28}
          height={24}
          rx={3}
          className={`fill-surface-2 stroke-line-strong ${A} group-hover:scale-105`}
          strokeWidth={1}
        />
        <rect x={69} y={50} width={10} height={6} rx={2} className={BAD} />
        <rect x={81} y={50} width={10} height={6} rx={2} className={GOOD} />
      </Phone>
      <text x={14} y={50} className={T}>
        ask
      </text>
      <text x={14} y={60} className={T}>
        in context
      </text>
    </>
  ),

  "device-features": () => (
    <>
      <path
        d="M16 70 C 50 30, 90 80, 140 34"
        className="stroke-line-strong"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx={140}
        cy={34}
        r={10}
        className={`${META} ${A} group-hover:scale-125`}
        strokeWidth={0.8}
      />
      <circle cx={140} cy={34} r={3} className="fill-fg" />
      <circle cx={16} cy={70} r={4} className="fill-viz-compute" />
      <text x={16} y={92} className={T}>
        precise only when needed
      </text>
    </>
  ),

  "mobile-accessibility": () => (
    <>
      <Phone x={20} y={20}>
        <rect
          x={25}
          y={34}
          width={24}
          height={8}
          rx={2}
          className={`${HOT} ${A} group-hover:scale-110`}
        />
        <rect x={25} y={46} width={24} height={4} rx={2} className="fill-line-strong" />
      </Phone>
      <path
        d="M66 42 q6 8 0 16 M72 38 q10 12 0 24"
        className="stroke-accent"
        strokeWidth={1.4}
        fill="none"
      />
      <text x={84} y={46} className={T}>
        “Add to order,
      </text>
      <text x={84} y={56} className={T}>
        button”
      </text>
    </>
  ),

  "mobile-performance": () => (
    <>
      <line x1={14} y1={44} x2={146} y2={44} className="stroke-fg/60" strokeDasharray="3 2" />
      {Array.from({ length: 16 }, (_, i) => {
        const h = i % 4 === 2 ? 40 : 14 + (i % 3) * 3;
        return (
          <rect
            key={i}
            x={14 + i * 8.3}
            y={76 - h}
            width={6}
            height={h}
            rx={1}
            className={h > 32 ? `${BAD} ${A} group-hover:scale-y-75` : GOOD}
          />
        );
      })}
      <text x={14} y={90} className={T}>
        8.3 ms per frame
      </text>
    </>
  ),

  "battery-memory": () => (
    <>
      <rect
        x={20}
        y={36}
        width={56}
        height={28}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      <rect x={76} y={44} width={4} height={12} rx={1} className="fill-line-strong" />
      <rect
        x={24}
        y={40}
        width={20}
        height={20}
        rx={2}
        className={`${BAD} ${A} group-hover:scale-x-50`}
      />
      <rect x={96} y={30} width={50} height={8} rx={2} className="fill-viz-idle/50" />
      <rect x={96} y={42} width={34} height={8} rx={2} className="fill-viz-compute/60" />
      <rect x={96} y={54} width={18} height={8} rx={2} className={DATA} />
      <text x={96} y={76} className={T}>
        low memory
      </text>
    </>
  ),

  "mobile-testing": () => (
    <>
      <polygon
        points="80,16 132,80 28,80"
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.1}
      />
      <line x1={45} y1={60} x2={115} y2={60} className="stroke-line-strong" />
      <line x1={62} y1={38} x2={98} y2={38} className="stroke-line-strong" />
      <text x={80} y={32} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        device
      </text>
      <text x={80} y={52} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        UI
      </text>
      <text
        x={80}
        y={73}
        textAnchor="middle"
        className={`fill-fg font-mono text-[5.5px] ${A} group-hover:scale-110`}
      >
        unit
      </text>
    </>
  ),

  "app-stores": () => (
    <>
      <Phone x={16} y={22} w={30} h={54} />
      <Arrow x1={50} y1={48} x2={70} y2={48} />
      <Svc
        x={72}
        y={38}
        w={38}
        h={20}
        label="review"
        cls={META}
        className={`${A} group-hover:scale-105`}
      />
      <Arrow x1={112} y1={48} x2={124} y2={48} />
      <circle cx={136} cy={48} r={9} className={GOOD} strokeWidth={1.2} />
      <path d="M131 48 l4 4 l6 -8" className="stroke-good" strokeWidth={1.5} fill="none" />
    </>
  ),

  "releases-updates": () => (
    <>
      {[1, 2, 5, 10, 20, 50, 100].map((p, i) => (
        <rect
          key={p}
          x={16 + i * 19}
          y={76 - (p / 100) * 52 - 4}
          width={14}
          height={(p / 100) * 52 + 4}
          rx={2}
          className={i === 6 ? `${HOT} ${A} group-hover:scale-y-90` : DATA}
        />
      ))}
      <text x={16} y={90} className={T}>
        1% → 100% over 7 days
      </text>
    </>
  ),

  "mobile-security": () => (
    <>
      <Phone x={20} y={20} />
      <Arrow x1={58} y1={50} x2={96} y2={50} />
      <path
        d="M120 26 l18 7 v14 c0 12 -8 19 -18 23 c-10 -4 -18 -11 -18 -23 v-14 z"
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={120} y={52} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        server
      </text>
      <text x={120} y={60} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        decides
      </text>
    </>
  ),

  "crash-analytics": () => (
    <>
      {[
        ["no symbols", META],
        ["crash on Pay", BAD],
        ["ANR on one model", BAD],
        ["rare, old", "fill-surface-2/60 stroke-line-strong"],
      ].map(([t, cls], i) => (
        <g key={t}>
          <rect
            x={20}
            y={18 + i * 17}
            width={120}
            height={13}
            rx={3}
            className={`${cls} ${i === 1 ? `${A} group-hover:translate-x-1` : ""}`}
            strokeWidth={1.1}
          />
          <text x={26} y={27 + i * 17} className="fill-fg font-mono text-[6px]">
            {i + 1}. {t}
          </text>
        </g>
      ))}
    </>
  ),

  "capstone-mobile": () => (
    <>
      <Phone x={63} y={16} w={34} h={66} className={`${A} group-hover:-translate-y-1`}>
        <rect x={67} y={28} width={26} height={7} rx={2} className={DATA} />
        <rect x={67} y={38} width={26} height={7} rx={2} className={DATA} />
        <rect x={67} y={48} width={26} height={7} rx={2} className={DATA} />
        <rect x={67} y={66} width={26} height={8} rx={4} className={HOT} />
      </Phone>
      <text x={14} y={46} className={T}>
        design
      </text>
      <text x={14} y={56} className={T}>
        beta
      </text>
      <text x={112} y={46} className={T}>
        review
      </text>
      <text x={112} y={56} className={T}>
        rollout
      </text>
    </>
  ),
};
