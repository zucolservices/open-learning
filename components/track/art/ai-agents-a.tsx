import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mono } from "./api-design-a";

/** Card illustrations for the AI Agents track (modules 1–11), keyed by module slug. */

const BOX = "fill-surface-2/60 stroke-line-strong";
const HOT = "fill-accent/20 stroke-accent";
const TOOL = "fill-viz-compute/20 stroke-viz-compute";
const DATA = "fill-viz-data/25 stroke-viz-data";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const aiAgentsArtA: ArtMap = {
  "what-is-an-agent": () => (
    <>
      <circle
        cx={58}
        cy={40}
        r={20}
        className="stroke-accent fill-none"
        strokeDasharray="4 3"
        strokeWidth={1.4}
      />
      <Svc x={40} y={33} w={36} h={14} label="model" cls={HOT} />
      {[
        [108, 18, "search"],
        [108, 36, "calendar"],
        [108, 54, "email"],
      ].map(([x, y, l]) => (
        <g key={l as string}>
          <Arrow
            x1={80}
            y1={40}
            x2={(x as number) - 2}
            y2={(y as number) + 6}
            className={`${A} group-hover:translate-x-0.5`}
          />
          <Svc x={x as number} y={y as number} w={42} h={12} label={l as string} cls={TOOL} />
        </g>
      ))}
      <text x={10} y={88} className={T}>
        a model, tools and a loop
      </text>
    </>
  ),

  "agent-loop": () => (
    <>
      {[
        [80, 16, "think"],
        [124, 50, "act"],
        [80, 78, "observe"],
        [36, 50, "repeat"],
      ].map(([x, y, l], i) => (
        <g key={l as string}>
          <circle
            cx={x as number}
            cy={(y as number) - 4}
            r={11}
            className={i === 1 ? TOOL : HOT}
            strokeWidth={1.2}
          />
          <text
            x={x as number}
            y={(y as number) - 1.5}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <path
        d="M92 16 Q 118 22 122 36 M118 56 Q 108 74 92 76 M68 76 Q 44 70 38 56 M40 36 Q 48 18 68 14"
        className={`stroke-line-strong fill-none ${A} group-hover:rotate-3`}
        strokeWidth={1.2}
      />
    </>
  ),

  "workflows-vs-agents": () => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Svc x={10 + i * 30} y={20} w={24} h={12} label={`step ${i + 1}`} cls={BOX} />
          {i < 2 && <Arrow x1={34 + i * 30} y1={26} x2={39 + i * 30} y2={26} />}
        </g>
      ))}
      <text x={10} y={44} className="fill-muted font-mono text-[6px]">
        workflow: code decides
      </text>
      <Svc x={112} y={14} w={38} h={14} label="agent" cls={HOT} />
      <path
        d="M131 30 C 150 46, 112 46, 131 62"
        className={`stroke-accent fill-none ${A} group-hover:translate-y-0.5`}
        strokeDasharray="3 2"
      />
      <text x={98} y={76} className="fill-muted font-mono text-[6px]">
        agent: model decides
      </text>
    </>
  ),

  "tool-design": () => (
    <>
      <Mono x={12} y={24} text={"get(id)"} cls="fill-bad line-through" />
      <Arrow x1={50} y1={22} x2={66} y2={22} className={`${A} group-hover:translate-x-1`} />
      <Mono x={70} y={24} text={"orders_get_status("} cls="fill-good" />
      <Mono x={78} y={34} text={'order_id="A-4417")'} cls="fill-good" />
      <rect x={12} y={46} width={136} height={18} rx={3} className={BOX} strokeWidth={1} />
      <Mono x={16} y={57} text="Error: date must be YYYY-MM-DD" cls="fill-muted" />
      <text x={10} y={86} className={T}>
        tools designed for the model
      </text>
    </>
  ),

  mcp: () => (
    <>
      <rect x={10} y={16} width={56} height={56} rx={6} className={HOT} strokeWidth={1.2} />
      <text x={38} y={28} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        host
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Svc x={22} y={33 + i * 12} w={32} h={9} label="client" cls={TOOL} />
          <line x1={54} y1={37 + i * 12} x2={96} y2={26 + i * 18} className="stroke-line-strong" />
          <Svc
            x={96}
            y={20 + i * 18}
            w={52}
            h={12}
            label={["calendar", "docs", "code"][i]}
            cls={`${DATA} ${A} group-hover:translate-x-0.5`}
          />
        </g>
      ))}
      <text x={10} y={88} className={T}>
        one plug for many tools
      </text>
    </>
  ),

  "computer-use": () => (
    <>
      <rect x={20} y={14} width={90} height={56} rx={4} className={BOX} strokeWidth={1.2} />
      <rect x={20} y={14} width={90} height={9} rx={2} className="fill-surface-2" />
      <rect x={30} y={32} width={26} height={10} rx={2} className={DATA} strokeWidth={0.8} />
      <circle
        cx={46}
        cy={37}
        r={5}
        className={`stroke-accent fill-none ${A} group-hover:scale-125`}
        strokeWidth={1.4}
      />
      <Svc x={118} y={22} w={34} h={12} label="sandbox" cls={GOOD} />
      <Svc x={118} y={42} w={34} h={12} label="code" cls={TOOL} />
      <text x={10} y={88} className={T}>
        screenshots, clicks and code
      </text>
    </>
  ),

  "ai-agents/planning": () => (
    <>
      <rect x={14} y={12} width={70} height={60} rx={4} className={BOX} strokeWidth={1.2} />
      {["[x] shortlist", "[x] check", "[ ] book", "[ ] invite"].map((l, i) => (
        <Mono key={l} x={20} y={26 + i * 12} text={l} cls={i < 2 ? "fill-muted" : "fill-fg"} />
      ))}
      <Arrow x1={88} y1={42} x2={106} y2={42} className={`${A} group-hover:translate-x-1`} />
      <Svc x={110} y={35} w={42} h={14} label="re-plan" cls={HOT} />
      <text x={10} y={88} className={T}>
        a living to-do list
      </text>
    </>
  ),

  reflection: () => (
    <>
      <polyline
        points="16,64 46,50 76,40 106,28 136,22"
        className="stroke-accent fill-none"
        strokeWidth={1.6}
      />
      {[
        [16, 64],
        [46, 50],
        [76, 40],
        [106, 28],
        [136, 22],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} className={i === 4 ? "fill-good" : "fill-accent"} />
      ))}
      <line x1={12} y1={20} x2={148} y2={20} className="stroke-good" strokeDasharray="3 2" />
      <text x={110} y={16} className="fill-good font-mono text-[5.5px]">
        tests pass
      </text>
      <text x={10} y={88} className={T}>
        check against evidence, then revise
      </text>
    </>
  ),

  "errors-recovery": () => (
    <>
      <Svc x={10} y={20} w={46} h={14} label="Error 429" cls={BAD} />
      {[1, 2, 4].map((w, i) => (
        <rect
          key={w}
          x={64 + [0, 10, 30][i]}
          y={24}
          width={w * 4}
          height={6}
          rx={2}
          className={`fill-viz-compute/40 ${A} group-hover:translate-x-0.5`}
        />
      ))}
      <text x={64} y={42} className="fill-muted font-mono text-[5.5px]">
        wait 1s · 2s · 4s
      </text>
      <Svc x={118} y={20} w={32} h={14} label="✓ ok" cls={GOOD} />
      <Svc x={10} y={52} w={64} h={14} label="dead end → person" cls={HOT} />
      <text x={10} y={86} className={T}>
        retry, fix or escalate
      </text>
    </>
  ),

  "agent-memory": () => (
    <>
      <Svc x={12} y={32} w={40} h={16} label="context" cls={HOT} />
      {["facts", "events", "rules"].map((l, i) => (
        <g key={l}>
          <Arrow
            x1={98}
            y1={22 + i * 18}
            x2={56}
            y2={40}
            className={`${A} group-hover:-translate-x-0.5`}
          />
          <Svc x={100} y={15 + i * 18} w={48} h={13} label={l} cls={DATA} />
        </g>
      ))}
      <text x={10} y={88} className={T}>
        a notebook outside the model
      </text>
    </>
  ),

  "context-management": () => (
    <>
      <polyline
        points="12,66 40,30 42,64 70,28 72,62 100,26 102,60 130,30"
        className="stroke-viz-data fill-none"
        strokeWidth={1.4}
      />
      <line x1={12} y1={22} x2={148} y2={22} className="stroke-bad" strokeDasharray="3 2" />
      <text x={118} y={18} className="fill-bad font-mono text-[5.5px]">
        full
      </text>
      <Svc
        x={110}
        y={52}
        w={40}
        h={12}
        label="notes.md"
        cls={`${GOOD} ${A} group-hover:-translate-y-0.5`}
      />
      <text x={10} y={86} className={T}>
        compact, note, delegate
      </text>
    </>
  ),
};
