import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the DPDP Act track (modules 12–22), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const BAD = "fill-bad/20 stroke-bad";
const GOOD = "fill-good/20 stroke-good";

export const dpdpActArtB: ArtMap = {
  breaches: () => (
    <>
      <line x1={14} y1={44} x2={146} y2={44} className="stroke-line-strong" strokeWidth={1.2} />
      <circle
        cx={18}
        cy={44}
        r={5}
        className={`${BAD} ${A} group-hover:scale-125`}
        strokeWidth={1.2}
      />
      {[
        [40, "6 h"],
        [138, "72 h"],
      ].map(([x, l]) => (
        <g key={l}>
          <line
            x1={x as number}
            y1={34}
            x2={x as number}
            y2={54}
            className="stroke-bad"
            strokeWidth={1.4}
          />
          <text
            x={x as number}
            y={66}
            textAnchor="middle"
            className="fill-bad font-mono text-[6px]"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={40} y={28} textAnchor="middle" className={T}>
        CERT-In
      </text>
      <text x={138} y={28} textAnchor="middle" className={T}>
        Board
      </text>
      <text x={14} y={88} className={T}>
        tell every affected person
      </text>
    </>
  ),

  rights: () => (
    <>
      <circle cx={24} cy={46} r={10} className={DATA} strokeWidth={1.2} />
      <text x={24} y={66} textAnchor="middle" className={T}>
        asha
      </text>
      {["access", "correct", "erase"].map((l, i) => (
        <g key={l}>
          <Arrow x1={36} y1={46} x2={76} y2={24 + i * 22} />
          <Svc
            x={80}
            y={16 + i * 22}
            w={40}
            h={16}
            label={l}
            cls={i === 2 ? `${HOT}` : undefined}
            className={i === 2 ? `${A} group-hover:scale-105` : ""}
          />
        </g>
      ))}
      <text x={128} y={50} className={T}>
        all copies
      </text>
    </>
  ),

  "grievances-duties": () => (
    <>
      {[
        [16, 60, "app"],
        [62, 42, "Board"],
        [108, 24, "TDSAT"],
      ].map(([x, y, l], i) => (
        <Svc
          key={l as string}
          x={x as number}
          y={y as number}
          w={36}
          h={18}
          label={l as string}
          cls={i === 0 ? HOT : undefined}
          className={i === 0 ? `${A} group-hover:scale-105` : ""}
        />
      ))}
      <Arrow x1={52} y1={62} x2={64} y2={56} />
      <Arrow x1={98} y1={44} x2={110} y2={38} />
      <text x={16} y={92} className={T}>
        grievance first · ≤ 90 days
      </text>
    </>
  ),

  children: () => (
    <>
      <circle cx={46} cy={36} r={12} className={DATA} strokeWidth={1.2} />
      <circle
        cx={46}
        cy={64}
        r={8}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={64} y={40} className={T}>
        parent ✓
      </text>
      <text x={60} y={68} className="fill-accent font-mono text-[6px]">
        under 18
      </text>
      <rect x={110} y={28} width={34} height={14} rx={3} className={BAD} strokeWidth={1.2} />
      <text x={127} y={37} textAnchor="middle" className="fill-bad font-mono text-[5.5px]">
        no ads
      </text>
      <rect x={110} y={50} width={34} height={14} rx={3} className={BAD} strokeWidth={1.2} />
      <text x={127} y={59} textAnchor="middle" className="fill-bad font-mono text-[5.5px]">
        no tracking
      </text>
    </>
  ),

  "significant-fiduciaries": () => (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={20 + i * 14}
          y={70 - (i + 1) * 8}
          width={10}
          height={(i + 1) * 8}
          rx={1.5}
          className={i > 3 ? `${HOT} ${A} group-hover:scale-y-110` : "fill-viz-data/40"}
        />
      ))}
      <Svc x={112} y={30} w={34} h={16} label="DPO" cls={HOT} />
      <Svc x={112} y={52} w={34} h={16} label="DPIA" cls={HOT} />
      <text x={20} y={88} className={T}>
        six factors · extra duties
      </text>
    </>
  ),

  "cross-border": () => (
    <>
      <circle
        cx={80}
        cy={46}
        r={30}
        className="fill-surface-2/40 stroke-line-strong"
        strokeWidth={1.2}
      />
      <ellipse
        cx={80}
        cy={46}
        rx={12}
        ry={30}
        className="stroke-line-strong fill-none"
        strokeWidth={1}
      />
      <line x1={50} y1={46} x2={110} y2={46} className="stroke-line-strong" strokeWidth={1} />
      <circle
        cx={70}
        cy={54}
        r={4}
        className={`${HOT} ${A} group-hover:scale-125`}
        strokeWidth={1.2}
      />
      <Arrow x1={74} y1={52} x2={126} y2={24} cls="stroke-good" />
      <circle cx={130} cy={22} r={4} className={GOOD} strokeWidth={1.2} />
      <text x={14} y={92} className={T}>
        allowed unless restricted
      </text>
    </>
  ),

  exemptions: () => (
    <>
      <rect
        x={20}
        y={20}
        width={120}
        height={50}
        rx={6}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      {["notice", "consent", "rights"].map((l, i) => (
        <g key={l}>
          <text x={32 + i * 38} y={40} className="fill-subtle font-mono text-[6px]">
            {l}
          </text>
          <line
            x1={30 + i * 38}
            y1={38}
            x2={58 + i * 38}
            y2={38}
            className="stroke-subtle"
            strokeWidth={1}
          />
        </g>
      ))}
      <rect
        x={46}
        y={48}
        width={68}
        height={14}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={80} y={57} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        security stays
      </text>
      <text x={20} y={88} className={T}>
        section 17
      </text>
    </>
  ),

  "board-penalties": () => (
    <>
      <rect
        x={18}
        y={40}
        width={124}
        height={10}
        rx={5}
        className="fill-surface-2 stroke-line-strong"
        strokeWidth={1}
      />
      <rect
        x={52}
        y={40}
        width={36}
        height={10}
        rx={5}
        className={`fill-viz-meta ${A} group-hover:scale-x-110`}
      />
      <text x={18} y={34} className={T}>
        ₹0
      </text>
      <text x={142} y={34} textAnchor="end" className="fill-accent font-mono text-[7px]">
        ₹250 cr
      </text>
      <text x={18} y={70} className={T}>
        caps, not prices
      </text>
    </>
  ),

  "privacy-by-design": () => (
    <>
      {["ledger", "tags", "ttl", "fan-out"].map((l, i) => (
        <Svc
          key={l}
          x={14 + i * 36}
          y={30}
          w={30}
          h={18}
          label={l}
          cls={HOT}
          className={`${A} group-hover:scale-105`}
        />
      ))}
      <rect x={14} y={58} width={132} height={14} rx={3} className={DATA} strokeWidth={1.2} />
      <text x={80} y={67} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        app + data
      </text>
      <text x={14} y={92} className={T}>
        duties become code
      </text>
    </>
  ),

  comparisons: () => (
    <>
      <rect
        x={18}
        y={22}
        width={56}
        height={50}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      <rect
        x={86}
        y={22}
        width={56}
        height={50}
        rx={4}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={46} y={50} textAnchor="middle" className="fill-fg font-mono text-[8px]">
        GDPR
      </text>
      <text x={114} y={50} textAnchor="middle" className="fill-fg font-mono text-[8px]">
        DPDP
      </text>
      <text x={80} y={50} textAnchor="middle" className={T}>
        ↔
      </text>
      <text x={18} y={88} className={T}>
        + RBI · CERT-In · SEBI
      </text>
    </>
  ),

  "capstone-dpdp": () => (
    <>
      <rect
        x={52}
        y={12}
        width={56}
        height={72}
        rx={8}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      {[24, 36, 48, 60].map((y, i) => (
        <g key={y}>
          <rect
            x={60}
            y={y}
            width={8}
            height={8}
            rx={2}
            className={i < 3 ? GOOD : BAD}
            strokeWidth={1}
          />
          <rect x={72} y={y + 2} width={28} height={4} rx={2} className="fill-viz-data/40" />
        </g>
      ))}
      <circle
        cx={124}
        cy={30}
        r={8}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={124} y={32} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        2027
      </text>
      <text x={14} y={92} className={T}>
        ready by May 2027
      </text>
    </>
  ),
};
