import { A, type ArtMap } from "./kit";
import { T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Git track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const META = "fill-viz-meta/25 stroke-viz-meta";
const BAD = "fill-bad/20 stroke-bad";

/** A commit dot. */
export function Dot({
  x,
  y,
  cls = DATA,
  className = "",
  r = 5,
}: {
  x: number;
  y: number;
  cls?: string;
  className?: string;
  r?: number;
}) {
  return <circle cx={x} cy={y} r={r} className={`${cls} ${className}`} strokeWidth={1.3} />;
}

/** A parent link between two commits (curved when lanes differ). */
export function Edge({
  x1,
  y1,
  x2,
  y2,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
}) {
  const m = (x1 + x2) / 2;
  return (
    <path
      d={`M${x1} ${y1} C${m} ${y1} ${m} ${y2} ${x2} ${y2}`}
      className="stroke-line-strong"
      strokeWidth={1.2}
      strokeDasharray={dashed ? "2 2" : undefined}
    />
  );
}

/** A branch label. */
export function Tag({
  x,
  y,
  label,
  hot = false,
}: {
  x: number;
  y: number;
  label: string;
  hot?: boolean;
}) {
  const w = label.length * 4 + 8;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={10}
        rx={2.5}
        className={hot ? "fill-accent" : "fill-surface-2 stroke-line-strong"}
        strokeWidth={0.8}
      />
      <text
        x={x + 4}
        y={y + 7.2}
        className={`font-mono text-[6px] ${hot ? "fill-accent-fg" : "fill-fg"}`}
      >
        {label}
      </text>
    </g>
  );
}

export const gitArtA: ArtMap = {
  "why-git": () => (
    <>
      {["final.doc", "final_v2", "v2_REALLY"].map((l, i) => (
        <g key={l}>
          <rect
            x={14 + i * 8}
            y={18 + i * 8}
            width={40}
            height={46}
            rx={3}
            className="fill-surface stroke-line-strong"
            strokeWidth={1.2}
          />
          <text x={18 + i * 8} y={60 + i * 8} className="fill-subtle font-mono text-[5px]">
            {l}
          </text>
        </g>
      ))}
      <path d="M78 48h10" className="stroke-line-strong" strokeWidth={1.2} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          {i > 0 && <Edge x1={96 + (i - 1) * 16} y1={48} x2={96 + i * 16} y2={48} />}
          <Dot
            x={96 + i * 16}
            y={48}
            cls={i === 3 ? HOT : DATA}
            className={i === 3 ? `${A} group-hover:scale-125` : ""}
          />
        </g>
      ))}
      <text x={96} y={70} className={T}>
        one history
      </text>
    </>
  ),

  snapshots: () => (
    <>
      <Svc
        x={14}
        y={40}
        w={34}
        h={16}
        label="commit"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Svc x={64} y={40} w={30} h={16} label="tree" cls={META} />
      {[24, 48, 72].map((y, i) => (
        <g key={y}>
          <path d={`M94 48 L112 ${y}`} className="stroke-line-strong" strokeWidth={1} />
          <Svc
            x={112}
            y={y - 7}
            w={32}
            h={14}
            label={["blob", "blob", "tree"][i]}
            cls={i === 2 ? META : DATA}
          />
        </g>
      ))}
      <path d="M48 48h16" className="stroke-line-strong" strokeWidth={1} />
      <text x={14} y={92} className={T}>
        named by a hash of the content
      </text>
    </>
  ),

  "three-areas": () => (
    <>
      {["working", "staging", "repo"].map((l, i) => (
        <g key={l}>
          <rect
            x={12 + i * 50}
            y={28}
            width={40}
            height={36}
            rx={4}
            className={
              i === 1 ? `${HOT} ${A} group-hover:scale-105` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1.2}
          />
          <text x={32 + i * 50} y={76} textAnchor="middle" className={T}>
            {l}
          </text>
          {i < 2 && <path d={`M${54 + i * 50} 46h6`} className="stroke-accent" strokeWidth={1.4} />}
        </g>
      ))}
      <text x={12} y={92} className={T}>
        add → commit
      </text>
    </>
  ),

  "commits-history": () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          {i > 0 && <Edge x1={22 + (i - 1) * 28} y1={50} x2={22 + i * 28} y2={50} />}
          <Dot
            x={22 + i * 28}
            y={50}
            cls={i === 4 ? HOT : DATA}
            className={i === 4 ? `${A} group-hover:scale-125` : ""}
          />
        </g>
      ))}
      <path
        d="M134 40 Q80 20 26 40"
        className="stroke-accent"
        strokeWidth={1}
        strokeDasharray="2 2"
      />
      <text x={14} y={80} className={T}>
        each commit points to its parent
      </text>
    </>
  ),

  branches: () => (
    <>
      <Edge x1={20} y1={56} x2={50} y2={56} />
      <Edge x1={50} y1={56} x2={80} y2={56} />
      <Edge x1={50} y1={56} x2={84} y2={30} />
      <Edge x1={84} y1={30} x2={112} y2={30} />
      <Dot x={20} y={56} />
      <Dot x={50} y={56} />
      <Dot x={80} y={56} />
      <Dot x={84} y={30} cls={META} />
      <Dot x={112} y={30} cls={META} className={`${A} group-hover:scale-125`} />
      <Tag x={70} y={66} label="main" />
      <Tag x={104} y={14} label="feature" hot />
      <text x={14} y={92} className={T}>
        a branch is just a pointer
      </text>
    </>
  ),

  merging: () => (
    <>
      <Edge x1={20} y1={58} x2={50} y2={58} />
      <Edge x1={50} y1={58} x2={80} y2={58} />
      <Edge x1={50} y1={58} x2={80} y2={32} />
      <Edge x1={80} y1={32} x2={118} y2={58} />
      <Edge x1={80} y1={58} x2={118} y2={58} />
      <Dot x={20} y={58} />
      <Dot x={50} y={58} />
      <Dot x={80} y={58} />
      <Dot x={80} y={32} />
      <Dot x={118} y={58} cls={HOT} r={6} className={`${A} group-hover:scale-125`} />
      <text x={14} y={88} className={T}>
        a commit with two parents
      </text>
    </>
  ),

  conflicts: () => (
    <>
      <rect
        x={30}
        y={14}
        width={100}
        height={66}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      {[
        [24, "<<<<<<< ours", "fill-bad"],
        [36, "price = 4.50", "fill-viz-data"],
        [48, "=======", "fill-bad"],
        [60, "price = 5.00", "fill-viz-meta"],
        [72, ">>>>>>> theirs", "fill-bad"],
      ].map(([y, l, c]) => (
        <text key={l as string} x={38} y={y as number} className={`${c} font-mono text-[6.5px]`}>
          {l}
        </text>
      ))}
      <rect
        x={34}
        y={30}
        width={92}
        height={9}
        rx={2}
        className={`fill-accent/15 ${A} group-hover:scale-x-105`}
      />
    </>
  ),

  rebase: () => (
    <>
      <Edge x1={16} y1={60} x2={46} y2={60} />
      <Edge x1={46} y1={60} x2={76} y2={60} />
      <Edge x1={46} y1={60} x2={70} y2={34} dashed />
      <Dot x={16} y={60} />
      <Dot x={46} y={60} />
      <Dot x={76} y={60} />
      <Dot x={70} y={34} cls="fill-surface stroke-line" />
      <Edge x1={76} y1={60} x2={106} y2={34} />
      <Edge x1={106} y1={34} x2={136} y2={34} />
      <Dot x={106} y={34} cls={HOT} className={`${A} group-hover:-translate-y-1`} />
      <Dot x={136} y={34} cls={HOT} className={`${A} group-hover:-translate-y-1`} />
      <text x={14} y={88} className={T}>
        replayed onto a new base
      </text>
    </>
  ),

  "cherry-pick-revert": () => (
    <>
      <Edge x1={16} y1={30} x2={46} y2={30} />
      <Edge x1={46} y1={30} x2={76} y2={30} />
      <Dot x={16} y={30} />
      <Dot x={46} y={30} cls={HOT} />
      <Dot x={76} y={30} />
      <path
        d="M46 38 Q70 54 104 62"
        className="stroke-accent"
        strokeWidth={1.2}
        strokeDasharray="2 2"
      />
      <Edge x1={84} y1={62} x2={110} y2={62} />
      <Dot x={84} y={62} cls={META} />
      <Dot x={110} y={62} cls={HOT} className={`${A} group-hover:scale-125`} />
      <Dot x={136} y={30} cls={BAD} />
      <Edge x1={76} y1={30} x2={131} y2={30} />
      <text x={118} y={20} className="fill-bad font-mono text-[6px]">
        undo
      </text>
      <text x={14} y={88} className={T}>
        copy one commit, or reverse it
      </text>
    </>
  ),

  remotes: () => (
    <>
      <Svc
        x={60}
        y={12}
        w={40}
        h={18}
        label="server"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Svc x={14} y={62} w={40} h={18} label="laptop" />
      <Svc x={106} y={62} w={40} h={18} label="laptop" />
      <path d="M40 60 L66 32" className="stroke-viz-data" strokeWidth={1.2} />
      <path d="M120 60 L94 32" className="stroke-viz-meta" strokeWidth={1.2} />
      <text x={30} y={46} className={T}>
        push
      </text>
      <text x={110} y={46} className={T}>
        fetch
      </text>
    </>
  ),

  "pull-requests": () => (
    <>
      <rect
        x={24}
        y={14}
        width={112}
        height={66}
        rx={5}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      <Tag x={32} y={22} label="feature → main" hot />
      {[40, 50, 60].map((y, i) => (
        <rect
          key={y}
          x={32}
          y={y}
          width={[80, 64, 72][i]}
          height={4}
          rx={2}
          className="fill-viz-data/40"
        />
      ))}
      <circle
        cx={122}
        cy={66}
        r={7}
        className={`fill-good/20 stroke-good ${A} group-hover:scale-125`}
        strokeWidth={1.2}
      />
      <path d="M118 66l3 3l5 -6" className="stroke-good" strokeWidth={1.4} />
    </>
  ),
};
