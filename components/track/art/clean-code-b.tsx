import { A, type ArtMap } from "./kit";
import { T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mark } from "./testing-a";

/** Card illustrations for the Clean Code track (modules 12–22), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const BAD = "fill-bad/20 stroke-bad";
const GOOD = "fill-good/20 stroke-good";

export const cleanCodeArtB: ArtMap = {
  boundaries: () => (
    <>
      <polygon
        points="80,16 106,30 106,58 80,72 54,58 54,30"
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.3}
      />
      <text x={80} y={47} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        rules
      </text>
      <Svc x={10} y={22} w={34} h={13} label="web" />
      <Svc x={10} y={54} w={34} h={13} label="tests" />
      <Svc x={116} y={22} w={34} h={13} label="pay" />
      <Svc x={116} y={54} w={34} h={13} label="db" />
      <text x={14} y={92} className={T}>
        details at the edge
      </text>
    </>
  ),

  "error-handling": () => (
    <>
      <rect x={18} y={22} width={60} height={40} rx={4} className={BAD} strokeWidth={1.1} />
      <text x={26} y={38} className="fill-bad font-mono text-[6.5px]">
        catch (e) {"{ }"}
      </text>
      <text x={26} y={52} className="fill-subtle font-mono text-[6px]">
        {"// TODO"}
      </text>
      <path d="M84 42h12" className="stroke-accent" strokeWidth={1.4} />
      <circle
        cx={120}
        cy={42}
        r={14}
        className={`${GOOD} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={120} y={45} textAnchor="middle" className="fill-good font-mono text-[8px] font-bold">
        !
      </text>
      <text x={14} y={88} className={T}>
        never swallow errors
      </text>
    </>
  ),

  "null-safety": () => (
    <>
      <rect
        x={24}
        y={28}
        width={34}
        height={30}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
        strokeDasharray="3 2"
      />
      <text x={41} y={47} textAnchor="middle" className="fill-subtle font-mono text-[8px]">
        ?
      </text>
      <rect
        x={96}
        y={28}
        width={40}
        height={30}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={116} y={46} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        string?
      </text>
      <path d="M62 43h30" className="stroke-accent" strokeWidth={1.3} />
      <text x={14} y={86} className={T}>
        label the maybe-empty box
      </text>
    </>
  ),

  "types-as-docs": () => (
    <>
      {["placed", "paid", "delivered", "cancelled", "refunded"].map((s, i) => (
        <g key={s}>
          <rect
            x={14 + (i % 3) * 46}
            y={18 + Math.floor(i / 3) * 24}
            width={40}
            height={16}
            rx={8}
            className={i === 2 ? `${HOT} ${A} group-hover:scale-105` : GOOD}
            strokeWidth={1}
          />
          <text
            x={34 + (i % 3) * 46}
            y={29 + Math.floor(i / 3) * 24}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {s}
          </text>
        </g>
      ))}
      <text x={14} y={84} className={T}>
        impossible states can’t be written
      </text>
    </>
  ),

  "code-smells": () => (
    <>
      <rect
        x={20}
        y={18}
        width={70}
        height={58}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={26}
          y={26 + i * 8}
          width={[50, 36, 56, 30, 44, 40][i]}
          height={4}
          rx={2}
          className={i === 2 ? "fill-bad/60" : "fill-viz-idle/50"}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${106 + i * 10} 54 q4 -8 0 -16 q-4 -8 0 -16`}
          className={`stroke-accent ${A} group-hover:-translate-y-1`}
          strokeWidth={1.2}
          fill="none"
        />
      ))}
      <text x={20} y={90} className={T}>
        a hint, not a verdict
      </text>
    </>
  ),

  refactoring: () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={14 + i * 36}
            y={30}
            width={28}
            height={22}
            rx={4}
            className={
              i === 3 ? `${HOT} ${A} group-hover:scale-110` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1.1}
          />
          <Mark x={28 + i * 36} y={66} ok />
          {i < 3 && <path d={`M${44 + i * 36} 41h4`} className="stroke-accent" strokeWidth={1.3} />}
        </g>
      ))}
      <text x={14} y={92} className={T}>
        small steps, always green
      </text>
    </>
  ),

  "technical-debt": () => (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect
            x={18 + i * 22}
            y={70 - (8 - i) * 6}
            width={8}
            height={(8 - i) * 6}
            rx={1}
            className="fill-good/50"
          />
          <rect
            x={27 + i * 22}
            y={70 - (2 + i) * 6}
            width={8}
            height={(2 + i) * 6}
            rx={1}
            className={i === 5 ? `fill-bad/60 ${A} group-hover:scale-y-110` : "fill-bad/40"}
          />
        </g>
      ))}
      <text x={14} y={88} className={T}>
        shortcuts compound
      </text>
    </>
  ),

  "static-analysis": () => (
    <>
      <rect
        x={18}
        y={18}
        width={64}
        height={60}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={24}
          y={26 + i * 8}
          width={[46, 34, 50, 30, 42, 38][i]}
          height={4}
          rx={2}
          className="fill-viz-idle/50"
        />
      ))}
      <circle
        cx={108}
        cy={42}
        r={16}
        className={`${DATA} ${A} group-hover:scale-110`}
        strokeWidth={1.3}
      />
      <line
        x1={120}
        y1={54}
        x2={134}
        y2={68}
        className="stroke-viz-data"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <circle cx={72} cy={42} r={3} className="fill-bad" />
      <text x={86} y={88} className={T}>
        read without running
      </text>
    </>
  ),

  "ai-code": () => (
    <>
      <rect x={16} y={20} width={58} height={50} rx={6} className={DATA} strokeWidth={1.2} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={22}
          y={28 + i * 9}
          width={[40, 46, 30, 42][i]}
          height={4}
          rx={2}
          className="fill-viz-data/50"
        />
      ))}
      <path d="M80 45h12" className="stroke-accent" strokeWidth={1.3} />
      <circle
        cx={116}
        cy={45}
        r={16}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={116} y={48} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        review
      </text>
      <text x={14} y={88} className={T}>
        generated fast, read slowly
      </text>
    </>
  ),

  conventions: () => (
    <>
      <rect
        x={24}
        y={14}
        width={56}
        height={68}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <text x={30} y={26} className="fill-fg font-mono text-[6px] font-bold">
        ADR 0007
      </text>
      {["context", "decision", "status", "consequences"].map((s, i) => (
        <text key={s} x={30} y={38 + i * 11} className="fill-subtle font-mono text-[5.5px]">
          {s}
        </text>
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={94}
          y={22 + i * 18}
          width={50}
          height={12}
          rx={3}
          className={i === 0 ? `${HOT} ${A} group-hover:scale-105` : GOOD}
          strokeWidth={1}
        />
      ))}
      <text x={94} y={88} className={T}>
        agree once
      </text>
    </>
  ),

  "capstone-clean": () => (
    <>
      <rect x={14} y={18} width={44} height={56} rx={3} className={BAD} strokeWidth={1} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={18 + (i % 2) * 6}
          y={24 + i * 9}
          width={30 - (i % 2) * 6}
          height={4}
          rx={2}
          className="fill-bad/50"
        />
      ))}
      <path d="M62 46h14" className="stroke-accent" strokeWidth={1.4} />
      <rect
        x={82}
        y={30}
        width={62}
        height={30}
        rx={4}
        className={`${GOOD} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={88}
          y={36 + i * 7}
          width={[46, 36, 42][i]}
          height={3.5}
          rx={1.75}
          className="fill-good/60"
        />
      ))}
      <text x={14} y={90} className={T}>
        read, protect, clean
      </text>
    </>
  ),
};
