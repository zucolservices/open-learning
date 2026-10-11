import { A, type ArtMap } from "./kit";
import { T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Clean Code track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const BAD = "fill-bad/20 stroke-bad";

/** A few lines of pretend code, with one highlighted. */
function Lines({
  x,
  y,
  widths,
  hot = -1,
}: {
  x: number;
  y: number;
  widths: number[];
  hot?: number;
}) {
  return (
    <>
      {widths.map((w, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * 8}
          width={w}
          height={4}
          rx={2}
          className={i === hot ? `fill-accent ${A} group-hover:scale-x-110` : "fill-viz-idle/50"}
        />
      ))}
    </>
  );
}

export const cleanCodeArtA: ArtMap = {
  "why-readable": () => (
    <>
      <rect
        x={18}
        y={20}
        width={58}
        height={56}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <Lines x={24} y={28} widths={[40, 30, 46, 22, 36]} hot={3} />
      <circle
        cx={112}
        cy={44}
        r={14}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.3}
      />
      <circle cx={112} cy={44} r={4} className="fill-accent" />
      <text x={86} y={80} className={T}>
        read 10× more
      </text>
    </>
  ),

  naming: () => (
    <>
      {["d", "t", "f"].map((n, i) => (
        <text key={n} x={22} y={30 + i * 18} className="fill-subtle font-mono text-[9px]">
          {n}
        </text>
      ))}
      <path d="M36 46h20" className="stroke-accent" strokeWidth={1.4} />
      {["bookings", "matches", "includeSmall"].map((n, i) => (
        <text
          key={n}
          x={64}
          y={30 + i * 18}
          className={`fill-fg font-mono text-[8px] ${i === 0 ? `${A} group-hover:translate-x-1` : ""}`}
        >
          {n}
        </text>
      ))}
      <text x={14} y={92} className={T}>
        names are labels
      </text>
    </>
  ),

  functions: () => (
    <>
      <rect x={14} y={16} width={44} height={64} rx={3} className={BAD} strokeWidth={1} />
      <Lines x={18} y={22} widths={[34, 30, 36, 28, 34, 26, 32]} />
      <path d="M62 48h12" className="stroke-accent" strokeWidth={1.4} />
      {[0, 1, 2, 3].map((i) => (
        <Svc
          key={i}
          x={80}
          y={14 + i * 18}
          w={66}
          h={13}
          label={["validateOrder", "getTotal", "saveOrder", "sendReceipt"][i]}
          cls={i === 0 ? HOT : undefined}
          className={i === 0 ? `${A} group-hover:scale-105` : ""}
        />
      ))}
    </>
  ),

  comments: () => (
    <>
      <rect
        x={20}
        y={18}
        width={120}
        height={56}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <text x={28} y={32} className="fill-subtle font-mono text-[6.5px] line-through">
        {"// loop over items"}
      </text>
      <text x={28} y={46} className="fill-bad font-mono text-[6.5px]">
        {"// discount: 15% ← lies"}
      </text>
      <text
        x={28}
        y={60}
        className={`fill-accent font-mono text-[6.5px] ${A} group-hover:translate-x-1`}
      >
        {"// ask finance before changing"}
      </text>
      <text x={20} y={90} className={T}>
        explain why, not what
      </text>
    </>
  ),

  formatting: () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={`m${i}`}
          x={16 + [0, 8, 3, 12, 5][i]}
          y={20 + i * 10}
          width={[30, 22, 36, 18, 28][i]}
          height={4}
          rx={2}
          className="fill-viz-idle/50"
        />
      ))}
      <path d="M68 40h14" className="stroke-accent" strokeWidth={1.4} />
      <Lines x={92} y={20} widths={[34, 26, 34, 22, 30]} hot={1} />
      <text x={14} y={88} className={T}>
        let the tool decide
      </text>
    </>
  ),

  simplicity: () => (
    <>
      <rect
        x={18}
        y={26}
        width={30}
        height={30}
        rx={4}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.3}
      />
      <text x={33} y={66} textAnchor="middle" className={T}>
        today
      </text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={74 + (i % 3) * 24}
          y={20 + Math.floor(i / 3) * 24}
          width={20}
          height={20}
          rx={3}
          className="fill-surface-2/60 stroke-line"
          strokeWidth={1}
          strokeDasharray="2 2"
        />
      ))}
      <text x={98} y={78} textAnchor="middle" className={T}>
        someday?
      </text>
    </>
  ),

  duplication: () => (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={16}
          y={20 + i * 18}
          width={40}
          height={12}
          rx={3}
          className={DATA}
          strokeWidth={1}
        />
      ))}
      <path d="M60 44h10" className="stroke-accent" strokeWidth={1.3} />
      <rect x={76} y={30} width={50} height={28} rx={3} className={BAD} strokeWidth={1.1} />
      {[0, 1, 2].map((i) => (
        <text key={i} x={82} y={40 + i * 7} className="fill-bad font-mono text-[5px]">
          if (flag{i + 1})
        </text>
      ))}
      <text x={14} y={88} className={T}>
        the wrong abstraction
      </text>
    </>
  ),

  complexity: () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={`n${i}`}
          x={16 + i * 8}
          y={20 + i * 10}
          width={56 - i * 8}
          height={6}
          rx={2}
          className="fill-bad/40"
        />
      ))}
      <path d="M84 44h10" className="stroke-accent" strokeWidth={1.3} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={`f${i}`}
          x={100}
          y={20 + i * 10}
          width={44}
          height={6}
          rx={2}
          className={i === 3 ? `fill-accent ${A} group-hover:scale-x-110` : "fill-good/40"}
        />
      ))}
      <text x={14} y={86} className={T}>
        guard clauses flatten
      </text>
    </>
  ),

  "cohesion-coupling": () => (
    <>
      {[0, 1].map((g) => (
        <g key={g}>
          <rect
            x={18 + g * 70}
            y={20}
            width={54}
            height={50}
            rx={6}
            className={
              g === 0 ? `${HOT} ${A} group-hover:scale-105` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1.2}
          />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={34 + g * 70 + i * 11}
              cy={45}
              r={4}
              className={g === 0 ? "fill-accent/60" : "fill-viz-data/50"}
            />
          ))}
        </g>
      ))}
      <path d="M72 45h16" className="stroke-line-strong" strokeWidth={1} strokeDasharray="2 2" />
      <text x={18} y={88} className={T}>
        together inside, loose between
      </text>
    </>
  ),

  solid: () => (
    <>
      {["S", "O", "L", "I", "D"].map((l, i) => (
        <g key={l}>
          <rect
            x={16 + i * 27}
            y={30}
            width={22}
            height={26}
            rx={4}
            className={
              i === 2 ? `${HOT} ${A} group-hover:-translate-y-1` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1.2}
          />
          <text
            x={27 + i * 27}
            y={47}
            textAnchor="middle"
            className="fill-fg font-mono text-[10px] font-bold"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={16} y={80} className={T}>
        principles, with judgement
      </text>
    </>
  ),

  composition: () => (
    <>
      <rect x={52} y={36} width={56} height={20} rx={4} className={HOT} strokeWidth={1.2} />
      <text x={80} y={49} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        Drink
      </text>
      {[
        [20, 18, "base"],
        [124, 18, "milk"],
        [20, 66, "iced"],
        [124, 66, "sugar"],
      ].map(([x, y, l]) => (
        <g key={l as string} className={`${A} group-hover:scale-110`}>
          <rect
            x={(x as number) - 4}
            y={(y as number) - 6}
            width={28}
            height={12}
            rx={6}
            className={DATA}
            strokeWidth={1}
          />
          <text
            x={(x as number) + 10}
            y={(y as number) + 2}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {l as string}
          </text>
        </g>
      ))}
      <text x={14} y={92} className={T}>
        build from parts
      </text>
    </>
  ),
};
