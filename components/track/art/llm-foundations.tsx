import { A, FileIcon, Slab, type ArtMap } from "./kit";

/** Simple right-pointing arrow (shaft + head) ending at (x2, y). */
function Arrow({
  x1,
  x2,
  y,
  cls = "stroke-accent",
  className = "",
}: {
  x1: number;
  x2: number;
  y: number;
  cls?: string;
  className?: string;
}) {
  return (
    <g className={className}>
      <path d={`M${x1} ${y}H${x2}`} className={cls} strokeWidth={2} />
      <path d={`M${x2} ${y}l-4-3.5M${x2} ${y}l-4 3.5`} className={cls} strokeWidth={2} />
    </g>
  );
}

/** Thumb icon (up) in a 16 × 16 box at (x, y); `down` flips it. */
function Thumb({ x, y, down = false, cls }: { x: number; y: number; down?: boolean; cls: string }) {
  return (
    <g transform={`translate(${x} ${y})${down ? " rotate(180 8 8)" : ""}`}>
      <path
        d="M1.5 7h3v8h-3zM4.5 7l3-6c1.4 0 2.3 1 2.1 2.4L9.2 6H13c1 0 1.7.9 1.5 1.9l-1.1 5.8c-.2.8-.8 1.3-1.6 1.3H4.5"
        className={cls}
        strokeWidth={1.3}
      />
    </g>
  );
}

/** Card illustrations for the LLM Foundations track, keyed by module slug. */
export const llmFoundationsArt: ArtMap = {
  "what-an-llm-does": () => (
    <>
      {["the", "cat", "sat", "on"].map((w, i) => (
        <g key={w}>
          <rect
            x={14 + i * 26}
            y={20}
            width={23}
            height={13}
            rx={3}
            className="fill-viz-data/20 stroke-viz-data"
          />
          <text
            x={25.5 + i * 26}
            y={29}
            textAnchor="middle"
            className="fill-fg font-mono text-[7px]"
          >
            {w}
          </text>
        </g>
      ))}
      <rect
        x={118}
        y={20}
        width={28}
        height={13}
        rx={3}
        className="fill-accent/15 stroke-accent [stroke-dasharray:3_2]"
      />
      <text x={132} y={30} textAnchor="middle" className="fill-accent text-[9px] font-bold">
        ?
      </text>
      {[
        ["mat", 64, "fill-accent"],
        ["rug", 34, "fill-viz-data/50"],
        ["sky", 12, "fill-viz-idle/50"],
      ].map(([w, len, c], i) => (
        <g key={w as string}>
          <text x={62} y={54 + i * 13} textAnchor="end" className="fill-muted font-mono text-[7px]">
            {w}
          </text>
          <rect
            x={68}
            y={48 + i * 13}
            width={len as number}
            height={8}
            rx={2}
            className={`${c} ${A} origin-left group-hover:scale-x-110`}
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        </g>
      ))}
    </>
  ),

  tokens: () => (
    <>
      <text x={80} y={30} textAnchor="middle" className="fill-fg font-mono text-[11px]">
        unbelievable
      </text>
      <path d="M80 38v7" className="stroke-line-strong" strokeWidth={1.5} />
      <path d="M80 46l-3-3M80 46l3-3" className="stroke-line-strong" strokeWidth={1.5} />
      {[
        ["un", 25, 24, "403", "fill-viz-data/25 stroke-viz-data", "group-hover:-translate-x-1.5"],
        ["believ", 55, 42, "12177", "fill-accent/20 stroke-accent", "group-hover:-translate-y-1"],
        ["able", 103, 32, "481", "fill-viz-data/25 stroke-viz-data", "group-hover:translate-x-1.5"],
      ].map(([t, x, w, id, c, h]) => (
        <g key={t as string} className={`${A} ${h}`}>
          <rect
            x={x as number}
            y={52}
            width={w as number}
            height={15}
            rx={3}
            className={c as string}
          />
          <text
            x={(x as number) + (w as number) / 2}
            y={62.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[8px]"
          >
            {t}
          </text>
          <text
            x={(x as number) + (w as number) / 2}
            y={80}
            textAnchor="middle"
            className="fill-muted font-mono text-[6.5px]"
          >
            {id}
          </text>
        </g>
      ))}
    </>
  ),

  embeddings: () => (
    <>
      <path d="M28 16v68h118" className="stroke-line-strong" strokeWidth={1.2} />
      {[
        [56, 30],
        [70, 24],
        [88, 34],
        [66, 40],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5} className="fill-viz-data/40" />
      ))}
      {[
        [124, 66],
        [134, 58],
        [132, 74],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5} className="fill-viz-idle/60" />
      ))}
      <path d="M28 84L62 34" className="stroke-accent" strokeWidth={1.5} />
      <path d="M28 84L84 42" className="stroke-viz-data" strokeWidth={1.5} />
      <path d="M41.5 64.2A24 24 0 0 1 47.2 69.6" className="stroke-accent" strokeWidth={1.5} />
      <circle cx={62} cy={34} r={4} className={`fill-accent ${A} group-hover:scale-125`} />
      <circle
        cx={84}
        cy={42}
        r={4}
        className={`fill-viz-data ${A} group-hover:scale-125`}
        style={{ transitionDelay: "60ms" }}
      />
      <text x={60} y={22} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        cat
      </text>
      <text x={98} y={46} className="fill-muted font-mono text-[7px]">
        kitten
      </text>
      <text x={132} y={52} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        car
      </text>
    </>
  ),

  attention: () => (
    <>
      <path d="M30 64Q46 46 62 64" className="stroke-viz-idle" strokeWidth={1.2} />
      <path d="M62 64Q79 48 96 64" className="stroke-viz-idle" strokeWidth={1.5} />
      <path
        d="M62 64Q96 12 130 64"
        className={`stroke-accent ${A} group-hover:-translate-y-1`}
        strokeWidth={3}
      />
      <rect x={46} y={68} width={32} height={14} rx={3} className="fill-accent/15 stroke-accent" />
      {[
        ["the", 30],
        ["bank", 62],
        ["of", 96],
        ["river", 130],
      ].map(([w, x]) => (
        <text
          key={w as string}
          x={x as number}
          y={78}
          textAnchor="middle"
          className="fill-fg font-mono text-[8px]"
        >
          {w}
        </text>
      ))}
    </>
  ),

  "transformer-block": () => (
    <>
      <path d="M80 90V12" className="stroke-viz-data/60" strokeWidth={1.5} />
      <path d="M80 12l-3.5 4M80 12l3.5 4" className="stroke-viz-data/60" strokeWidth={1.5} />
      <path
        d="M80 84H120V54H85"
        className="stroke-viz-data [stroke-dasharray:3_2]"
        strokeWidth={1.4}
      />
      <path
        d="M80 50H40V24H75"
        className="stroke-viz-data [stroke-dasharray:3_2]"
        strokeWidth={1.4}
      />
      <rect x={58} y={62} width={44} height={14} rx={3} className="fill-accent/20 stroke-accent" />
      <text x={80} y={71.5} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        attention
      </text>
      <rect
        x={58}
        y={32}
        width={44}
        height={14}
        rx={3}
        className="fill-viz-compute/25 stroke-viz-compute"
      />
      <text x={80} y={41.5} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        MLP
      </text>
      {[54, 24].map((y, i) => (
        <g
          key={y}
          className={`${A} group-hover:scale-125`}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <circle
            cx={80}
            cy={y}
            r={4.5}
            className="fill-surface stroke-viz-data"
            strokeWidth={1.4}
          />
          <path d={`M77.5 ${y}h5M80 ${y - 2.5}v5`} className="stroke-viz-data" strokeWidth={1.3} />
        </g>
      ))}
      <text x={108} y={42} className="fill-muted font-mono text-[8px]">
        ×N
      </text>
    </>
  ),

  "context-window": () => (
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <rect
          key={i}
          x={12 + i * 8.5}
          y={44}
          width={6.5}
          height={14}
          rx={1.5}
          className={
            i >= 5 && i <= 12
              ? "fill-viz-data/40 stroke-viz-data"
              : i < 5
                ? "fill-viz-idle/25"
                : "fill-viz-idle/15 stroke-viz-idle/50 [stroke-dasharray:2_1.5]"
          }
        />
      ))}
      <g className={`${A} group-hover:translate-x-2`}>
        <rect
          x={52}
          y={38}
          width={72.5}
          height={26}
          rx={4}
          className="fill-accent/5 stroke-accent"
          strokeWidth={2}
        />
        <text x={88} y={32} textAnchor="middle" className="fill-muted font-mono text-[7px]">
          context window
        </text>
      </g>
      <path d="M30 76H130" className="stroke-line-strong" strokeWidth={1.2} />
      <path d="M130 76l-4-3M130 76l-4 3" className="stroke-line-strong" strokeWidth={1.2} />
      <text x={30} y={88} className="fill-muted font-mono text-[6.5px]">
        forgotten
      </text>
    </>
  ),

  sampling: () => (
    <>
      <path d="M16 80H94" className="stroke-line-strong" strokeWidth={1.2} />
      {[48, 30, 18, 10, 6].map((h, i) => (
        <rect
          key={i}
          x={20 + i * 14}
          y={80 - h}
          width={10}
          height={h}
          rx={2}
          className={
            i === 1
              ? `fill-accent ${A} group-hover:-translate-y-1`
              : "fill-viz-data/40 stroke-viz-data"
          }
        />
      ))}
      <path d="M102 66A22 22 0 0 1 146 66" className="stroke-line-strong" strokeWidth={4} />
      <path d="M102 66A22 22 0 0 1 117 45.5" className="stroke-viz-data/60" strokeWidth={4} />
      <line
        x1={124}
        y1={66}
        x2={134}
        y2={50}
        className={`stroke-accent ${A} group-hover:rotate-[25deg]`}
        style={{ transformOrigin: "0% 100%" }}
        strokeWidth={2.2}
      />
      <circle cx={124} cy={66} r={3} className="fill-accent" />
      <text x={124} y={82} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        temperature
      </text>
    </>
  ),

  pretraining: () => (
    <>
      <path d="M26 20V82H146" className="stroke-line-strong" strokeWidth={1.2} />
      <path d="M30 26C44 62 64 72 140 76" className="stroke-accent" strokeWidth={2} />
      <circle cx={140} cy={76} r={3} className="fill-accent" />
      <text x={32} y={20} className="fill-muted font-mono text-[7px]">
        loss
      </text>
      {[92, 108, 124].map((x, i) => (
        <g
          key={x}
          className={`${A} group-hover:translate-y-1.5`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <FileIcon x={x} y={22} />
        </g>
      ))}
      <text x={120} y={52} textAnchor="middle" className="fill-muted font-mono text-[6.5px]">
        tokens seen
      </text>
    </>
  ),

  "base-to-assistant": () => (
    <>
      <Slab x={40} y={58} w={26} h={13} cls="fill-viz-compute/25 stroke-viz-compute" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${22 + i * 4} ${26 + i * 8}q5-4 10 0t10 0 10 0`}
          className="stroke-viz-data/50"
          strokeWidth={1.3}
        />
      ))}
      <Arrow x1={72} x2={92} y={52} className={`${A} group-hover:translate-x-1.5`} />
      <g className={`${A} group-hover:-translate-y-1`}>
        <path
          d="M104 30h36a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6h-26l-8 8v-8h-2a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6z"
          className="fill-accent/15 stroke-accent"
          strokeWidth={1.5}
        />
        <rect x={106} y={39} width={32} height={3} rx={1.5} className="fill-viz-data/60" />
        <rect x={106} y={47} width={22} height={3} rx={1.5} className="fill-viz-data/60" />
      </g>
      <text x={40} y={90} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        base
      </text>
      <text x={122} y={84} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        assistant
      </text>
    </>
  ),

  alignment: () => (
    <>
      {[
        [30, "stroke-good", "fill-good/10", false, "group-hover:-translate-y-1"],
        [90, "stroke-bad/70", "fill-bad/5", true, ""],
      ].map(([x, s, f, down, h]) => (
        <g key={x as number} className={`${A} ${h}`}>
          <rect
            x={x as number}
            y={20}
            width={40}
            height={34}
            rx={4}
            className={`${f} ${s}`}
            strokeWidth={1.4}
          />
          {[28, 35, 42].map((y, j) => (
            <rect
              key={y}
              x={(x as number) + 6}
              y={y}
              width={j === 2 ? 18 : 28}
              height={3}
              rx={1.5}
              className="fill-viz-data/50"
            />
          ))}
          <Thumb
            x={(x as number) + 12}
            y={62}
            down={down as boolean}
            cls={down ? "fill-bad/15 stroke-bad" : "fill-good/20 stroke-good"}
          />
        </g>
      ))}
      <text x={80} y={41} textAnchor="middle" className="fill-muted text-[8px]">
        vs
      </text>
    </>
  ),

  "reasoning-models": () => (
    <>
      <path
        d="M24 64L46 44L70 60L94 40L122 51"
        className="stroke-viz-meta/60 [stroke-dasharray:2_2]"
        strokeWidth={1.3}
      />
      {[
        [24, 64],
        [46, 44],
        [70, 60],
        [94, 40],
      ].map(([x, y], i) => (
        <g
          key={x}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <circle cx={x} cy={y} r={7} className="fill-viz-meta/25 stroke-viz-meta" />
          <circle cx={x - 2.5} cy={y} r={0.9} className="fill-viz-meta" />
          <circle cx={x} cy={y} r={0.9} className="fill-viz-meta" />
          <circle cx={x + 2.5} cy={y} r={0.9} className="fill-viz-meta" />
        </g>
      ))}
      <rect
        x={114}
        y={40}
        width={32}
        height={22}
        rx={4}
        className={`fill-accent/20 stroke-accent ${A} group-hover:scale-110`}
        style={{ transitionDelay: "260ms" }}
        strokeWidth={1.5}
      />
      <path d="M122 51l4 4 8-8" className="stroke-accent" strokeWidth={1.8} />
      <text x={58} y={84} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        thinking…
      </text>
      <text x={130} y={76} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        answer
      </text>
    </>
  ),

  prompting: () => (
    <>
      <rect
        x={36}
        y={16}
        width={66}
        height={70}
        rx={4}
        className="fill-surface stroke-viz-meta"
        strokeWidth={1.4}
      />
      <rect x={44} y={26} width={44} height={4} rx={2} className="fill-viz-meta/50" />
      <rect x={44} y={38} width={40} height={4} rx={2} className="fill-viz-remove/40" />
      <path d="M42 40H88" className="stroke-viz-remove" strokeWidth={1.3} />
      <rect
        x={44}
        y={50}
        width={48}
        height={4}
        rx={2}
        className={`fill-viz-add ${A} origin-left group-hover:scale-x-105`}
      />
      <rect x={44} y={62} width={36} height={4} rx={2} className="fill-viz-meta/50" />
      <rect x={44} y={74} width={24} height={4} rx={2} className="fill-viz-meta/50" />
      <g className={`${A} group-hover:-translate-x-1 group-hover:translate-y-1`}>
        <g transform="translate(106 74) rotate(-55)">
          <rect
            x={0}
            y={-4}
            width={32}
            height={8}
            rx={1}
            className="fill-accent/25 stroke-accent"
            strokeWidth={1.3}
          />
          <path d="M0 -4L-8 0L0 4" className="fill-accent stroke-accent" strokeWidth={1.3} />
          <path d="M26 -4v8" className="stroke-accent" strokeWidth={1.3} />
        </g>
      </g>
    </>
  ),

  "tool-calling": () => (
    <>
      <rect
        x={12}
        y={36}
        width={34}
        height={28}
        rx={6}
        className="fill-viz-compute/25 stroke-viz-compute"
        strokeWidth={1.4}
      />
      <text x={29} y={53} textAnchor="middle" className="fill-fg font-mono text-[8px]">
        LLM
      </text>
      <Arrow x1={50} x2={60} y={42} cls="stroke-line-strong" />
      <g className={`${A} group-hover:-translate-y-1`}>
        <rect
          x={64}
          y={26}
          width={44}
          height={34}
          rx={3}
          className="fill-viz-meta/20 stroke-viz-meta"
        />
        <text x={69} y={37} className="fill-fg font-mono text-[6.5px]">
          {"{"}
        </text>
        <text x={74} y={46} className="fill-fg font-mono text-[6.5px]">
          tool: …
        </text>
        <text x={69} y={55} className="fill-fg font-mono text-[6.5px]">
          {"}"}
        </text>
      </g>
      <Arrow x1={112} x2={122} y={42} cls="stroke-line-strong" />
      <g className={`${A} group-hover:rotate-12`}>
        <g transform="translate(124 30) scale(1.1)">
          <path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"
            className="fill-accent/20 stroke-accent"
            strokeWidth={1.4}
          />
        </g>
      </g>
      <path
        d="M134 64V76H29V68"
        className="stroke-viz-data [stroke-dasharray:3_2]"
        strokeWidth={1.3}
      />
      <path d="M29 68l-3 4M29 68l3 4" className="stroke-viz-data" strokeWidth={1.3} />
      <text x={82} y={88} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        result
      </text>
    </>
  ),

  "context-engineering": () => (
    <>
      {[
        [16, 26, ""],
        [30, 40, ""],
        [14, 56, "[stroke-dasharray:3_2]"],
      ].map(([x, y, d], i) => (
        <FileIcon
          key={i}
          x={x as number}
          y={y as number}
          cls={d ? "fill-viz-remove/10 stroke-viz-remove" : "fill-viz-data/25 stroke-viz-data"}
          className={d as string}
        />
      ))}
      <Arrow x1={50} x2={64} y={52} className={`${A} group-hover:translate-x-1.5`} />
      <rect
        x={72}
        y={16}
        width={74}
        height={70}
        rx={5}
        className="fill-accent/5 stroke-accent"
        strokeWidth={1.8}
      />
      {[
        [60, "fill-viz-meta/40 stroke-viz-meta"],
        [48, "fill-viz-data/30 stroke-viz-data"],
        [56, "fill-viz-data/30 stroke-viz-data"],
        [40, "fill-viz-idle/30 stroke-viz-idle"],
        [30, "fill-accent/40 stroke-accent"],
      ].map(([w, c], i) => (
        <rect
          key={i}
          x={79}
          y={23 + i * 12}
          width={w as number}
          height={8}
          rx={2}
          className={`${c} ${A} group-hover:-translate-y-0.5`}
          style={{ transitionDelay: `${i * 50}ms` }}
        />
      ))}
    </>
  ),

  hallucinations: () => (
    <>
      <path
        d="M30 18h70a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H50l-10 10v-10H30a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z"
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.4}
      />
      <rect x={32} y={28} width={62} height={4} rx={2} className="fill-viz-data/50" />
      <rect x={32} y={38} width={52} height={4} rx={2} className="fill-bad/50" />
      <path
        d="M32 47q3-3 6 0t6 0 6 0 6 0 6 0 6 0 6 0 6 0"
        className="stroke-bad"
        strokeWidth={1.3}
      />
      <rect x={32} y={52} width={40} height={4} rx={2} className="fill-viz-data/50" />
      <g className={`${A} group-hover:scale-110`}>
        <circle cx={130} cy={40} r={12} className="fill-bad/15 stroke-bad" strokeWidth={1.6} />
        <path d="M125 35l10 10M135 35l-10 10" className="stroke-bad" strokeWidth={2} />
      </g>
      <text x={130} y={66} textAnchor="middle" className="fill-muted text-[7px]">
        not true
      </text>
      <text x={66} y={86} textAnchor="middle" className="fill-muted text-[7px]">
        sounds sure
      </text>
    </>
  ),

  inference: () => (
    <>
      <rect
        x={16}
        y={30}
        width={42}
        height={36}
        rx={4}
        className="fill-viz-compute/20 stroke-viz-compute"
        strokeWidth={1.4}
      />
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={21 + (i % 3) * 12}
          y={35 + Math.floor(i / 3) * 10}
          width={8}
          height={6}
          rx={1.5}
          className="fill-viz-data/60"
        />
      ))}
      {[74, 90, 106, 122, 138].map((x, i) => (
        <g key={x}>
          <rect
            x={x - 5}
            y={42}
            width={10}
            height={12}
            rx={2}
            className={`${i === 4 ? "fill-accent" : "fill-viz-data/40 stroke-viz-data"} ${A} group-hover:-translate-y-1`}
            style={{ transitionDelay: `${i * 70}ms` }}
          />
          <path d={`M${x} 70v5`} className="stroke-line-strong" strokeWidth={1.2} />
        </g>
      ))}
      <path d="M14 72H146" className="stroke-line-strong" strokeWidth={1.2} />
      <text x={37} y={86} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        prefill
      </text>
      <text x={106} y={86} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        decode
      </text>
    </>
  ),

  "memory-quantization": () => (
    <>
      {[
        ["16", 100],
        ["8", 50],
        ["4", 25],
      ].map(([b, w], i) => (
        <g key={b as string}>
          <text x={30} y={30 + i * 22} textAnchor="end" className="fill-muted font-mono text-[8px]">
            {b}
          </text>
          <rect
            x={36}
            y={22 + i * 22}
            width={80}
            height={11}
            rx={2}
            className="fill-surface-2/60 stroke-line-strong"
          />
          <rect
            x={36}
            y={22 + i * 22}
            width={Math.min(w as number, 80)}
            height={11}
            rx={2}
            className={
              i === 2
                ? `fill-accent ${A} origin-left group-hover:scale-x-90`
                : "fill-viz-compute/50"
            }
          />
          {(w as number) > 80 && (
            <rect
              x={116}
              y={22}
              width={20}
              height={11}
              rx={2}
              className={`fill-bad/30 stroke-bad ${A} group-hover:translate-x-1`}
            />
          )}
        </g>
      ))}
      <path
        d="M116 16V82"
        className="stroke-line-strong [stroke-dasharray:3_2]"
        strokeWidth={1.2}
      />
      <text x={116} y={90} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        GPU memory
      </text>
      <text x={24} y={90} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        bits
      </text>
    </>
  ),

  serving: () => (
    <>
      {[20, 34, 48, 62, 76].map((y, i) => (
        <g key={y}>
          <path
            d={`M40 ${y + 4}C66 ${y + 4} 70 50 96 50`}
            className="stroke-line-strong"
            strokeWidth={1.1}
          />
          <rect
            x={16}
            y={y}
            width={22}
            height={8}
            rx={2}
            className={`fill-viz-data/30 stroke-viz-data ${A} group-hover:translate-x-1.5`}
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        </g>
      ))}
      <rect
        x={98}
        y={32}
        width={44}
        height={36}
        rx={4}
        className="fill-viz-compute/25 stroke-viz-compute"
        strokeWidth={1.5}
      />
      {[106, 114, 122, 130].map((x) => (
        <path
          key={x}
          d={`M${x} 32v-5M${x} 68v5`}
          className="stroke-viz-compute"
          strokeWidth={1.3}
        />
      ))}
      <text x={120} y={53} textAnchor="middle" className="fill-fg font-mono text-[8px]">
        GPU
      </text>
      <rect
        x={86}
        y={40}
        width={8}
        height={20}
        rx={2}
        className={`fill-accent ${A} group-hover:scale-y-110`}
      />
    </>
  ),

  "cost-latency": () => (
    <>
      <circle
        cx={46}
        cy={50}
        r={24}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.5}
      />
      {[0, 90, 180, 270].map((a) => (
        <path
          key={a}
          d="M46 29v4"
          transform={`rotate(${a} 46 50)`}
          className="stroke-muted"
          strokeWidth={1.3}
        />
      ))}
      <path d="M46 50V37" className="stroke-fg" strokeWidth={1.8} />
      <line
        x1={46}
        y1={50}
        x2={62}
        y2={50}
        className={`stroke-accent ${A} group-hover:rotate-45`}
        style={{ transformOrigin: "0% 50%" }}
        strokeWidth={2}
      />
      <circle cx={46} cy={50} r={2.2} className="fill-accent" />
      <path d="M78 50H90" className="stroke-line-strong" strokeWidth={1.3} />
      <path
        d="M78 50l3-3M78 50l3 3M90 50l-3-3M90 50l-3 3"
        className="stroke-line-strong"
        strokeWidth={1.3}
      />
      {[
        [108, 3, "$"],
        [132, 4, "₹"],
      ].map(([x, n, sym], s) => (
        <g
          key={sym as string}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${s * 80}ms` }}
        >
          {Array.from({ length: n as number }, (_, i) => (
            <ellipse
              key={i}
              cx={x as number}
              cy={74 - i * 7}
              rx={11}
              ry={4}
              className="fill-surface-2 stroke-viz-meta"
              strokeWidth={1.3}
            />
          ))}
          <text
            x={x as number}
            y={74 - ((n as number) - 1) * 7 - 8}
            textAnchor="middle"
            className="fill-fg text-[9px] font-semibold"
          >
            {sym}
          </text>
        </g>
      ))}
    </>
  ),

  "open-vs-closed": () => (
    <>
      <rect
        x={22}
        y={48}
        width={44}
        height={32}
        rx={2}
        className="fill-viz-compute/15 stroke-viz-compute"
        strokeWidth={1.5}
      />
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={30 + (i % 3) * 10}
          y={i < 3 ? 38 : 54}
          width={7}
          height={7}
          rx={1.5}
          className={
            i < 3 ? `fill-viz-compute/60 ${A} group-hover:-translate-y-1` : "fill-viz-compute/40"
          }
          style={{ transitionDelay: `${(i % 3) * 50}ms` }}
        />
      ))}
      <g className={`${A} group-hover:-rotate-6`} style={{ transformOrigin: "0% 100%" }}>
        <path
          d="M22 48L56 24l3 4-34 24z"
          className="fill-viz-compute/30 stroke-viz-compute"
          strokeWidth={1.4}
        />
      </g>
      <rect
        x={94}
        y={48}
        width={44}
        height={32}
        rx={2}
        className="fill-viz-idle/15 stroke-viz-idle"
        strokeWidth={1.5}
      />
      <path d="M92 48H140" className="stroke-viz-idle" strokeWidth={2.5} />
      <path d="M110 60v-5a6 6 0 0 1 12 0v5" className="stroke-muted" strokeWidth={1.8} />
      <rect x={107} y={60} width={18} height={13} rx={2} className="fill-muted" />
      <text x={44} y={92} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        open weights
      </text>
      <text x={116} y={92} textAnchor="middle" className="fill-muted font-mono text-[7px]">
        API only
      </text>
    </>
  ),

  multimodal: () => (
    <>
      <g className={`${A} group-hover:translate-x-1.5`}>
        <rect
          x={16}
          y={16}
          width={28}
          height={20}
          rx={2}
          className="fill-viz-data/15 stroke-viz-data"
        />
        <path d="M18 34l8-9 6 6 4-4 6 7" className="stroke-viz-data" strokeWidth={1.2} />
        <circle cx={37} cy={22} r={2} className="fill-viz-data" />
      </g>
      <g className={`${A} group-hover:translate-x-1.5`} style={{ transitionDelay: "60ms" }}>
        <path
          d="M16 51h3l2-6 3 12 3-16 3 18 3-12 3 8 2-4h6"
          className="stroke-viz-data"
          strokeWidth={1.4}
        />
      </g>
      <g className={`${A} group-hover:translate-x-1.5`} style={{ transitionDelay: "120ms" }}>
        {[68, 74, 80].map((y, i) => (
          <rect
            key={y}
            x={16}
            y={y}
            width={i === 2 ? 18 : 28}
            height={3}
            rx={1.5}
            className="fill-viz-data/60"
          />
        ))}
      </g>
      {[26, 51, 75].map((y) => (
        <path
          key={y}
          d={`M52 ${y}C76 ${y} 76 50 96 50`}
          className="stroke-line-strong"
          strokeWidth={1.2}
        />
      ))}
      <rect
        x={98}
        y={34}
        width={44}
        height={32}
        rx={6}
        className="fill-viz-compute/25 stroke-viz-compute"
        strokeWidth={1.5}
      />
      <circle cx={120} cy={50} r={5} className="fill-accent" />
    </>
  ),

  "small-models": () => (
    <>
      <circle
        cx={48}
        cy={48}
        r={28}
        className="fill-viz-compute/15 stroke-viz-compute/70"
        strokeWidth={1.4}
      />
      <text x={48} y={51} textAnchor="middle" className="fill-muted font-mono text-[9px]">
        70B
      </text>
      <g className={`${A} group-hover:scale-110`}>
        <circle
          cx={114}
          cy={58}
          r={14}
          className="fill-accent/25 stroke-accent"
          strokeWidth={1.6}
        />
        <text x={114} y={61} textAnchor="middle" className="fill-fg font-mono text-[8px]">
          3B
        </text>
      </g>
      <circle cx={128} cy={42} r={7} className="fill-good" />
      <path d="M124.5 42l2.5 2.5 4.5-4.5" className="stroke-surface" strokeWidth={1.6} />
      <rect
        x={96}
        y={80}
        width={36}
        height={10}
        rx={3}
        className="fill-viz-meta/20 stroke-viz-meta"
      />
      <text x={114} y={87.5} textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        one task
      </text>
    </>
  ),

  "prompt-injection": () => (
    <>
      <g className={`${A} group-hover:-translate-y-1.5`}>
        <rect
          x={26}
          y={14}
          width={46}
          height={26}
          rx={2}
          className="fill-surface stroke-bad"
          strokeWidth={1.2}
        />
        <text x={49} y={25} textAnchor="middle" className="fill-bad font-mono text-[6.5px]">
          ignore
        </text>
        <text x={49} y={32} textAnchor="middle" className="fill-bad font-mono text-[6.5px]">
          all rules
        </text>
      </g>
      <rect
        x={18}
        y={34}
        width={62}
        height={40}
        rx={3}
        className="fill-surface-2 stroke-viz-data"
        strokeWidth={1.4}
      />
      <path d="M18 34l31 20 31-20" className="stroke-viz-data" strokeWidth={1.4} />
      <path d="M86 54h12" className="stroke-bad [stroke-dasharray:2_2]" strokeWidth={1.5} />
      <g className={`${A} group-hover:scale-110`}>
        <path
          d="M122 26l20 7v15c0 13-9 21-20 25-11-4-20-12-20-25V33z"
          className="fill-accent/20 stroke-accent"
          strokeWidth={1.6}
        />
        <path d="M114 50l6 6 10-11" className="stroke-accent" strokeWidth={2} />
      </g>
    </>
  ),

  "responsible-use": () => (
    <>
      <path d="M80 24V80M66 82h28" className="stroke-line-strong" strokeWidth={1.8} />
      <circle cx={80} cy={22} r={3} className="fill-accent" />
      <g className={`${A} group-hover:-rotate-3`}>
        <path d="M38 30H122" className="stroke-fg" strokeWidth={1.8} />
        <path
          d="M38 30L26 58M38 30L50 58M122 30L110 58M122 30L134 58"
          className="stroke-line-strong"
          strokeWidth={1}
        />
        <path
          d="M24 58q14 9 28 0zM108 58q14 9 28 0z"
          className="fill-surface-2 stroke-line-strong"
          strokeWidth={1.3}
        />
        <circle cx={38} cy={46} r={4} className="fill-accent/30 stroke-accent" strokeWidth={1.4} />
        <path d="M31 57q7-9 14 0" className="fill-accent/30 stroke-accent" strokeWidth={1.4} />
        <FileIcon x={116} y={40} w={12} h={15} />
      </g>
      <text x={38} y={76} textAnchor="middle" className="fill-muted text-[7px]">
        people
      </text>
      <text x={122} y={76} textAnchor="middle" className="fill-muted text-[7px]">
        data
      </text>
    </>
  ),

  "choose-a-model": () => (
    <>
      {[
        ["EN", 20],
        ["हि", 42],
        ["ಕ", 64],
      ].map(([t, y], i) => (
        <g
          key={t as string}
          className={`${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <rect
            x={14}
            y={y as number}
            width={26}
            height={16}
            rx={3}
            className="fill-viz-data/20 stroke-viz-data"
          />
          <text
            x={27}
            y={(y as number) + 11.5}
            textAnchor="middle"
            className="fill-fg text-[9px] font-semibold"
          >
            {t}
          </text>
        </g>
      ))}
      {[28, 50, 72].map((y) => (
        <path
          key={y}
          d={`M44 ${y}C58 ${y} 58 50 72 50`}
          className="stroke-line-strong"
          strokeWidth={1.2}
        />
      ))}
      <path
        d="M72 50L104 26M72 50L104 74"
        className="stroke-viz-idle/60 [stroke-dasharray:2_2]"
        strokeWidth={1.2}
      />
      <path d="M72 50H104" className="stroke-accent" strokeWidth={2} />
      {[
        [26, 16, "S"],
        [50, 26, "M"],
        [74, 36, "L"],
      ].map(([y, w, l], i) => (
        <g key={l as string} className={i === 1 ? `${A} group-hover:scale-110` : ""}>
          <rect
            x={106}
            y={(y as number) - 7}
            width={w as number}
            height={14}
            rx={3}
            className={
              i === 1 ? "fill-accent/25 stroke-accent" : "fill-viz-idle/10 stroke-viz-idle/70"
            }
            strokeWidth={i === 1 ? 1.6 : 1.2}
          />
          <text
            x={106 + (w as number) / 2}
            y={(y as number) + 3}
            textAnchor="middle"
            className={`font-mono text-[7px] ${i === 1 ? "fill-fg" : "fill-muted"}`}
          >
            {l}
          </text>
        </g>
      ))}
    </>
  ),

  "misbehaving-assistant": () => (
    <>
      <g transform="translate(12 0)">
        <path
          d="M26 14h52a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H40l-8 7v-7h-6a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z"
          className="fill-surface-2/60 stroke-line-strong"
          strokeWidth={1.4}
        />
        <path d="M34 34l6-11 6 11z" className="fill-bad/20 stroke-bad" strokeWidth={1.3} />
        <path d="M40 27v3" className="stroke-bad" strokeWidth={1.3} />
        <rect x={52} y={23} width={24} height={3} rx={1.5} className="fill-viz-data/50" />
        <rect x={52} y={29} width={16} height={3} rx={1.5} className="fill-viz-data/50" />
      </g>
      {[
        [44, 56, 96, "fill-viz-meta/30 stroke-viz-meta"],
        [54, 64, 36, "fill-viz-meta/30 stroke-viz-meta"],
        [94, 72, 40, "fill-bad/30 stroke-bad"],
        [104, 80, 34, "fill-viz-meta/30 stroke-viz-meta"],
      ].map(([x, y, w, c], i) => (
        <rect
          key={i}
          x={x as number}
          y={y as number}
          width={w as number}
          height={6}
          rx={1.5}
          className={c as string}
        />
      ))}
      <g className={`${A} group-hover:-translate-x-2`}>
        <circle cx={114} cy={72} r={12} className="fill-accent/10 stroke-accent" strokeWidth={2} />
        <path d="M123 80l8 8" className="stroke-accent" strokeWidth={3} />
      </g>
      <text x={38} y={61.5} textAnchor="end" className="fill-muted font-mono text-[7px]">
        trace
      </text>
    </>
  ),
};
