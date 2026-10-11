import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Frontend track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

/** A small browser window frame. */
export function Win({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <line
        x1={x}
        y1={y + 9}
        x2={x + w}
        y2={y + 9}
        className="stroke-line-strong"
        strokeWidth={1}
      />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 5 + i * 5} cy={y + 4.5} r={1.4} className="fill-viz-idle" />
      ))}
    </>
  );
}

export const frontendArtA: ArtMap = {
  "how-browsers-work": () => (
    <>
      {["DOM", "CSSOM", "layout", "paint"].map((l, i) => (
        <Svc
          key={l}
          x={8 + i * 37}
          y={40}
          w={32}
          h={16}
          label={l}
          cls={i === 3 ? HOT : DATA}
          className={i === 3 ? `${A} group-hover:scale-105` : ""}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={41 + i * 37} y1={48} x2={44 + i * 37} y2={48} />
      ))}
      <text x={10} y={80} className={T}>
        text → trees → boxes → pixels
      </text>
    </>
  ),

  "semantic-html": () => (
    <>
      {["header", "nav", "main", "footer"].map((l, i) => (
        <g key={l}>
          <rect
            x={30}
            y={14 + i * 18}
            width={100}
            height={13}
            rx={3}
            className={i === 2 ? `${HOT} ${A} group-hover:scale-x-105` : DATA}
            strokeWidth={1}
          />
          <text x={36} y={23 + i * 18} className="fill-fg font-mono text-[6.5px]">
            {`<${l}>`}
          </text>
        </g>
      ))}
    </>
  ),

  "css-layout": () => (
    <>
      <rect
        x={14}
        y={20}
        width={60}
        height={56}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1}
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={19 + i * 18}
          y={40}
          width={14}
          height={16}
          rx={2}
          className={DATA}
          strokeWidth={1}
        />
      ))}
      <text x={44} y={86} textAnchor="middle" className={T}>
        flex
      </text>
      <rect
        x={86}
        y={20}
        width={60}
        height={56}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={91 + (i % 3) * 18}
          y={26 + Math.floor(i / 3) * 24}
          width={14}
          height={20}
          rx={2}
          className={
            i === 0 ? `${HOT} ${A} group-hover:scale-110` : "fill-viz-meta/25 stroke-viz-meta"
          }
          strokeWidth={1}
        />
      ))}
      <text x={116} y={86} textAnchor="middle" className={T}>
        grid
      </text>
    </>
  ),

  "event-loop": () => (
    <>
      <circle
        cx={80}
        cy={46}
        r={28}
        className="stroke-line-strong fill-none"
        strokeWidth={1.4}
        strokeDasharray="4 3"
      />
      <circle
        cx={80}
        cy={18}
        r={5}
        className={`${HOT} ${A} group-hover:scale-125`}
        strokeWidth={1.2}
      />
      <text x={80} y={49} textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        task → μ → paint
      </text>
      <text x={14} y={92} className={T}>
        one main thread
      </text>
    </>
  ),

  components: () => (
    <>
      <Svc x={64} y={12} w={32} h={14} label="App" cls={HOT} />
      {[24, 64, 104].map((x, i) => (
        <g key={x}>
          <line
            x1={80}
            y1={26}
            x2={x + 16}
            y2={48}
            className="stroke-line-strong"
            strokeWidth={1}
          />
          <Svc
            x={x}
            y={48}
            w={32}
            h={14}
            label={["Header", "Card", "Footer"][i]}
            cls={DATA}
            className={i === 1 ? `${A} group-hover:scale-105` : ""}
          />
        </g>
      ))}
      <text x={14} y={88} className={T}>
        props down · events up
      </text>
    </>
  ),

  state: () => (
    <>
      <rect x={20} y={24} width={50} height={40} rx={4} className={HOT} strokeWidth={1.2} />
      <text x={45} y={47} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        state
      </text>
      <Arrow x1={72} y1={44} x2={96} y2={44} />
      <Win x={98} y={22} w={46} h={44} />
      <rect
        x={104}
        y={38}
        width={30}
        height={4}
        rx={2}
        className={`fill-viz-data/60 ${A} group-hover:scale-x-110`}
      />
      <text x={14} y={88} className={T}>
        UI = f(state)
      </text>
    </>
  ),

  reactivity: () => (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x={20 + (i % 6) * 20}
          y={24 + Math.floor(i / 6) * 22}
          width={16}
          height={16}
          rx={2}
          className={
            i === 7 ? `${GOOD} ${A} group-hover:scale-125` : "fill-surface stroke-line-strong"
          }
          strokeWidth={1}
        />
      ))}
      <text x={20} y={84} className={T}>
        update only what changed
      </text>
    </>
  ),

  forms: () => (
    <>
      <Win x={36} y={12} w={88} h={74} />
      {[28, 50].map((y, i) => (
        <g key={y}>
          <rect x={44} y={y} width={30} height={3} rx={1.5} className="fill-viz-idle/60" />
          <rect
            x={44}
            y={y + 6}
            width={72}
            height={9}
            rx={2}
            className={i === 1 ? BAD : "fill-surface stroke-line-strong"}
            strokeWidth={1}
          />
        </g>
      ))}
      <text x={44} y={76} className="fill-bad font-mono text-[5.5px]">
        enter an email like name@…
      </text>
    </>
  ),

  "data-fetching": () => (
    <>
      {["c", "ch", "cha", "chai"].map((q, i) => (
        <g key={q}>
          <text x={16} y={24 + i * 14} className="fill-fg font-mono text-[6.5px]">
            {q}
          </text>
          <rect
            x={40 + i * 12}
            y={19 + i * 14}
            width={[30, 80, 24, 30][i]}
            height={6}
            rx={3}
            className={i === 1 ? BAD : i === 3 ? `${GOOD} ${A} group-hover:scale-x-110` : DATA}
            strokeWidth={1}
          />
        </g>
      ))}
      <text x={16} y={90} className={T}>
        replies arrive out of order
      </text>
    </>
  ),

  "state-management": () => (
    <>
      {["local", "lift", "context", "store", "URL"].map((l, i) => (
        <g key={l}>
          <rect
            x={20 + i * 8}
            y={70 - i * 13}
            width={60}
            height={11}
            rx={3}
            className={i === 4 ? `${HOT} ${A} group-hover:scale-x-105` : DATA}
            strokeWidth={1}
          />
          <text x={26 + i * 8} y={77.5 - i * 13} className="fill-fg font-mono text-[6px]">
            {l}
          </text>
        </g>
      ))}
    </>
  ),

  routing: () => (
    <>
      <Win x={20} y={16} w={120} h={66} />
      <rect
        x={26}
        y={30}
        width={108}
        height={9}
        rx={2}
        className="fill-surface-2 stroke-line"
        strokeWidth={0.8}
      />
      <text x={30} y={36.5} className="fill-fg font-mono text-[6px]">
        /menu/chai
      </text>
      <path
        d="M36 58 l-6 6 l6 6"
        className={`stroke-accent ${A} group-hover:-translate-x-1`}
        strokeWidth={1.6}
        fill="none"
      />
      <text x={46} y={67} className={T}>
        Back still works
      </text>
    </>
  ),
};
