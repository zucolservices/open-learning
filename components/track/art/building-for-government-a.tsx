import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Building for Government track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const META = "fill-viz-meta/25 stroke-viz-meta";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

/** A simple building with columns: a government office. */
export function Office({
  x,
  y,
  cls = "fill-surface stroke-line-strong",
  className = "",
}: {
  x: number;
  y: number;
  cls?: string;
  className?: string;
}) {
  return (
    <g className={className}>
      <polygon
        points={`${x},${y + 8} ${x + 20},${y} ${x + 40},${y + 8}`}
        className={cls}
        strokeWidth={1.1}
      />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={x + 4 + i * 9}
          y={y + 10}
          width={4}
          height={16}
          className={cls}
          strokeWidth={0.9}
        />
      ))}
      <rect x={x} y={y + 26} width={40} height={4} className={cls} strokeWidth={1.1} />
    </g>
  );
}

export const govArtA: ArtMap = {
  "gov-is-different": () => (
    <>
      <Office x={60} y={14} cls={HOT} className={`${A} group-hover:scale-105`} />
      {[
        [14, 70, "web"],
        [52, 74, "phone"],
        [92, 74, "centre"],
        [128, 70, "office"],
      ].map(([x, y, t]) => (
        <g key={t as string}>
          <rect
            x={x as number}
            y={y as number}
            width={26}
            height={14}
            rx={3}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1}
          />
          <text
            x={(x as number) + 13}
            y={(y as number) + 9.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {t}
          </text>
          <line
            x1={(x as number) + 13}
            y1={y as number}
            x2={80}
            y2={46}
            className="stroke-line-strong"
            strokeWidth={0.8}
          />
        </g>
      ))}
    </>
  ),

  "digital-public-infrastructure": () => (
    <>
      <rect
        x={14}
        y={62}
        width={132}
        height={10}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-x-105`}
      />
      <text x={80} y={69.5} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        identity · payments · data
      </text>
      {[24, 62, 100].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={36}
          width={34}
          height={16}
          rx={3}
          className={[DATA, META, GOOD][i]}
          strokeWidth={1}
        />
      ))}
      <text x={14} y={88} className={T}>
        shared rails, many services
      </text>
    </>
  ),

  "how-gov-buys": () => (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={20 + i * 10}
          y={26 + i * 6}
          width={44}
          height={54}
          rx={3}
          className="fill-surface stroke-line-strong"
          strokeWidth={1}
        />
      ))}
      <text x={54} y={56} className="fill-fg font-mono text-[6px]">
        bids
      </text>
      <Arrow x1={88} y1={52} x2={104} y2={52} />
      <circle
        cx={124}
        cy={52}
        r={14}
        className={`${GOOD} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={124} y={55} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        award
      </text>
    </>
  ),

  gigw: () => (
    <>
      <rect
        x={24}
        y={18}
        width={112}
        height={64}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <rect x={24} y={18} width={112} height={10} rx={4} className="fill-surface-2" />
      <text x={30} y={25.5} className="fill-fg font-mono text-[5.5px]">
        dept.state.gov.in
      </text>
      {["quality 25", "accessibility 50", "lifecycle 10", "security 3"].map((t, i) => (
        <g key={t}>
          <rect
            x={32}
            y={34 + i * 11}
            width={6}
            height={6}
            rx={1}
            className={`${GOOD} ${i === 1 ? `${A} group-hover:scale-125` : ""}`}
          />
          <text x={42} y={39 + i * 11} className="fill-fg font-mono text-[6px]">
            {t}
          </text>
        </g>
      ))}
    </>
  ),

  "accessibility-law": () => (
    <>
      {[1, 2, 3].map((h) => (
        <rect
          key={h}
          x={20 + h * 10}
          y={70 - h * 12}
          width={10}
          height={h * 12}
          className="fill-line-strong"
        />
      ))}
      <polygon
        points="70,70 130,70 130,34"
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={20} y={88} className={T}>
        the ramp is the law
      </text>
    </>
  ),

  multilingual: () => (
    <>
      {["English", "हिन्दी", "தமிழ்", "اردو"].map((t, i) => (
        <g key={t}>
          <rect
            x={18 + (i % 2) * 64}
            y={22 + Math.floor(i / 2) * 30}
            width={58}
            height={22}
            rx={4}
            className={
              i === 1 ? `${HOT} ${A} group-hover:scale-105` : "fill-surface-2/60 stroke-line-strong"
            }
            strokeWidth={1}
          />
          <text
            x={47 + (i % 2) * 64}
            y={37 + Math.floor(i / 2) * 30}
            textAnchor="middle"
            className="fill-fg text-[9px]"
          >
            {t}
          </text>
        </g>
      ))}
      <text x={18} y={90} className={T}>
        22 scheduled languages
      </text>
    </>
  ),

  "gov-cloud-hosting": () => (
    <>
      {[
        ["off cloud", BAD],
        ["gov cloud", META],
        ["empanelled", GOOD],
      ].map(([t, cls], i) => (
        <g key={t}>
          <rect
            x={16 + i * 46}
            y={30}
            width={38}
            height={40}
            rx={4}
            className={`${cls} ${i === 1 ? `${A} group-hover:scale-105` : ""}`}
            strokeWidth={1.1}
          />
          <text
            x={35 + i * 46}
            y={53}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {t}
          </text>
        </g>
      ))}
      <text x={16} y={86} className={T}>
        classify, then place
      </text>
    </>
  ),

  "digital-identity": () => (
    <>
      <rect
        x={18}
        y={28}
        width={56}
        height={36}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <circle cx={34} cy={44} r={7} className={DATA} />
      <rect x={46} y={38} width={22} height={3} rx={1.5} className="fill-line-strong" />
      <rect x={46} y={46} width={16} height={3} rx={1.5} className="fill-line-strong" />
      <Arrow x1={78} y1={46} x2={100} y2={46} />
      <Svc
        x={104}
        y={36}
        w={38}
        h={20}
        label="yes / no"
        cls={GOOD}
        className={`${A} group-hover:scale-105`}
      />
    </>
  ),

  "digilocker-esign": () => (
    <>
      <Office x={14} y={26} />
      <Arrow x1={58} y1={44} x2={84} y2={44} />
      <rect
        x={88}
        y={24}
        width={40}
        height={48}
        rx={3}
        className={`${HOT} ${A} group-hover:-rotate-3`}
        strokeWidth={1.1}
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={94}
          y={32 + i * 8}
          width={28}
          height={3}
          rx={1.5}
          className="fill-line-strong"
        />
      ))}
      <path d="M96 62 q6 -6 12 0 t12 0" className="stroke-accent" strokeWidth={1.3} fill="none" />
      <text x={14} y={88} className={T}>
        from the issuer, e-signed
      </text>
    </>
  ),

  "data-sharing-consent": () => (
    <>
      {[
        [18, 24],
        [18, 60],
        [118, 42],
      ].map(([x, y], i) => (
        <Office key={i} x={x} y={y} cls={i === 2 ? HOT : "fill-surface stroke-line-strong"} />
      ))}
      <Arrow x1={60} y1={38} x2={114} y2={54} />
      <Arrow x1={60} y1={74} x2={114} y2={62} />
      <text x={74} y={46} className="fill-good font-mono text-[6px]">
        yes
      </text>
      <text x={74} y={78} className="fill-good font-mono text-[6px]">
        62%
      </text>
    </>
  ),

  "open-data": () => (
    <>
      <rect
        x={18}
        y={20}
        width={124}
        height={60}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1}
      />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          {[0, 1, 2, 3].map((c) => (
            <rect
              key={c}
              x={24 + c * 29}
              y={26 + r * 13}
              width={25}
              height={9}
              rx={1.5}
              className={
                c === 0 ? `fill-surface-2 ${r ? `${A} group-hover:opacity-30` : ""}` : DATA
              }
            />
          ))}
        </g>
      ))}
      <text x={18} y={92} className={T}>
        names removed, bands kept
      </text>
    </>
  ),
};
