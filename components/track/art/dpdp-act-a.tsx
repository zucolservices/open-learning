import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the DPDP Act track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const BAD = "fill-bad/20 stroke-bad";
const GOOD = "fill-good/20 stroke-good";

export const dpdpActArtA: ArtMap = {
  "why-dpdp": () => (
    <>
      <line x1={14} y1={50} x2={146} y2={50} className="stroke-line-strong" strokeWidth={1.2} />
      {[
        [22, "2017"],
        [58, "2023"],
        [96, "2025"],
        [136, "2027"],
      ].map(([x, y], i) => (
        <g key={y}>
          <circle
            cx={x as number}
            cy={50}
            r={i === 3 ? 6 : 4}
            className={
              i === 3 ? `${HOT} ${A} group-hover:scale-125` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1.2}
          />
          <text x={x as number} y={66} textAnchor="middle" className={T}>
            {y}
          </text>
        </g>
      ))}
      <text x={136} y={36} textAnchor="middle" className="fill-accent font-mono text-[6px]">
        core duties
      </text>
      <text x={14} y={88} className={T}>
        right → Act → Rules → May 2027
      </text>
    </>
  ),

  roles: () => (
    <>
      <circle cx={30} cy={46} r={10} className={DATA} strokeWidth={1.2} />
      <text x={30} y={66} textAnchor="middle" className={T}>
        principal
      </text>
      <Svc
        x={62}
        y={36}
        w={36}
        h={20}
        label="fiduciary"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Svc x={118} y={22} w={30} h={14} label="cloud" />
      <Svc x={118} y={56} w={30} h={14} label="sms" />
      <Arrow x1={42} y1={46} x2={60} y2={46} />
      <Arrow x1={100} y1={42} x2={116} y2={32} />
      <Arrow x1={100} y1={50} x2={116} y2={60} />
      <text x={133} y={84} textAnchor="middle" className={T}>
        processors
      </text>
    </>
  ),

  scope: () => (
    <>
      <circle
        cx={80}
        cy={46}
        r={32}
        className="fill-accent/10 stroke-accent"
        strokeWidth={1.2}
        strokeDasharray="3 2"
      />
      <rect
        x={68}
        y={36}
        width={24}
        height={20}
        rx={3}
        className={`${DATA} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={80} y={49} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        digital
      </text>
      <rect
        x={14}
        y={34}
        width={20}
        height={24}
        rx={1}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={24} y={68} textAnchor="middle" className={T}>
        paper
      </text>
      <text x={132} y={30} className="fill-accent font-mono text-[6px]">
        in scope
      </text>
      <text x={14} y={92} className={T}>
        s.3: digital, or digitised later
      </text>
    </>
  ),

  "data-mapping": () => (
    <>
      {[
        [16, 18, "db"],
        [62, 18, "logs"],
        [108, 18, "sdk"],
        [16, 56, "tickets"],
        [62, 56, "copy"],
        [108, 56, "backup"],
      ].map(([x, y, l], i) => (
        <Svc
          key={l as string}
          x={x as number}
          y={y as number}
          w={36}
          h={18}
          label={l as string}
          cls={i === 0 ? DATA : HOT}
          className={i > 0 ? `${A} group-hover:scale-105` : ""}
        />
      ))}
      <text x={14} y={92} className={T}>
        personal data hides everywhere
      </text>
    </>
  ),

  notice: () => (
    <>
      <rect
        x={40}
        y={12}
        width={80}
        height={72}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      {[24, 34, 44].map((y, i) => (
        <g key={y}>
          <rect x={48} y={y} width={6} height={6} rx={1} className={GOOD} strokeWidth={1} />
          <rect
            x={58}
            y={y + 1}
            width={[46, 38, 52][i]}
            height={4}
            rx={2}
            className="fill-viz-data/40"
          />
        </g>
      ))}
      <rect
        x={48}
        y={58}
        width={64}
        height={14}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={80} y={67} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        withdraw · complain
      </text>
      <text x={126} y={30} className={T}>
        EN + 22
      </text>
    </>
  ),

  consent: () => (
    <>
      {[
        [24, true],
        [44, false],
        [64, false],
      ].map(([y, on]) => (
        <g key={y as number}>
          <rect
            x={30}
            y={y as number}
            width={12}
            height={12}
            rx={2}
            className={on ? `${HOT} ${A} group-hover:scale-110` : "fill-surface stroke-line-strong"}
            strokeWidth={1.2}
          />
          {on && (
            <path
              d={`M33 ${(y as number) + 6}l3 3l5 -6`}
              className="stroke-accent"
              strokeWidth={1.6}
              fill="none"
            />
          )}
          <rect
            x={50}
            y={(y as number) + 4}
            width={60}
            height={4}
            rx={2}
            className="fill-viz-data/40"
          />
        </g>
      ))}
      <text x={120} y={32} className="fill-good font-mono text-[6px]">
        clear yes
      </text>
      <text x={14} y={92} className={T}>
        free · specific · unambiguous
      </text>
    </>
  ),

  withdrawal: () => (
    <>
      <circle
        cx={24}
        cy={46}
        r={10}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={24} y={48} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        stop
      </text>
      {[22, 46, 70].map((y, i) => (
        <g key={y}>
          <Arrow x1={36} y1={46} x2={86} y2={y} cls="stroke-accent" />
          <Svc x={90} y={y - 8} w={44} h={16} label={["app", "scheduler", "vendor"][i]} cls={BAD} />
        </g>
      ))}
      <text x={14} y={92} className={T}>
        one tap reaches every system
      </text>
    </>
  ),

  "legitimate-uses": () => (
    <>
      {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((l, i) => (
        <g key={l}>
          <rect
            x={18 + (i % 3) * 44}
            y={14 + Math.floor(i / 3) * 22}
            width={36}
            height={16}
            rx={3}
            className={
              i === 0 ? `${HOT} ${A} group-hover:scale-110` : "fill-surface-2/60 stroke-line-strong"
            }
            strokeWidth={1.2}
          />
          <text
            x={36 + (i % 3) * 44}
            y={25 + Math.floor(i / 3) * 22}
            textAnchor="middle"
            className="fill-fg font-mono text-[6px]"
          >
            7({l})
          </text>
        </g>
      ))}
      <text x={14} y={92} className={T}>
        no consent needed
      </text>
    </>
  ),

  "purpose-retention": () => (
    <>
      <circle
        cx={46}
        cy={46}
        r={26}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      <path d="M46 46 L46 24" className="stroke-fg" strokeWidth={1.6} />
      <path
        d="M46 46 L62 54"
        className={`stroke-accent ${A} group-hover:rotate-12`}
        strokeWidth={1.6}
      />
      <text x={46} y={84} textAnchor="middle" className={T}>
        3 years
      </text>
      <rect x={92} y={26} width={50} height={14} rx={3} className={DATA} strokeWidth={1.2} />
      <rect x={92} y={50} width={30} height={14} rx={3} className={BAD} strokeWidth={1.2} />
      <text x={128} y={60} className="fill-bad font-mono text-[6px]">
        erase
      </text>
    </>
  ),

  "security-safeguards": () => (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={40 + i * 8}
          y={16 + i * 8}
          width={80 - i * 16}
          height={60 - i * 16}
          rx={6}
          className={i === 2 ? `${DATA} ${A} group-hover:scale-110` : "stroke-accent fill-none"}
          strokeWidth={1.2}
        />
      ))}
      <text x={80} y={50} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        data
      </text>
      <text x={14} y={92} className={T}>
        Rule 6: protect · detect · recover
      </text>
    </>
  ),

  processors: () => (
    <>
      <Svc x={16} y={36} w={38} h={20} label="fiduciary" cls={HOT} />
      <rect
        x={66}
        y={30}
        width={30}
        height={32}
        rx={2}
        className={`fill-surface stroke-line-strong ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      {[38, 44, 50].map((y) => (
        <line
          key={y}
          x1={70}
          y1={y}
          x2={92}
          y2={y}
          className="stroke-line-strong"
          strokeWidth={1}
        />
      ))}
      <text x={81} y={72} textAnchor="middle" className={T}>
        contract
      </text>
      <Svc x={108} y={36} w={38} h={20} label="vendor" />
      <Arrow x1={56} y1={46} x2={64} y2={46} />
      <Arrow x1={98} y1={46} x2={106} y2={46} />
    </>
  ),
};
