import { A, type ArtMap } from "./kit";
import { T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Dot, Edge, Tag } from "./git-a";

/** Card illustrations for the Git track (modules 12–22), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const META = "fill-viz-meta/25 stroke-viz-meta";
const BAD = "fill-bad/20 stroke-bad";
const GOOD = "fill-good/20 stroke-good";

export const gitArtB: ArtMap = {
  "git/branching-strategies": () => (
    <>
      <line x1={14} y1={50} x2={146} y2={50} className="stroke-line-strong" strokeWidth={1.4} />
      {[
        [30, 30],
        [70, 70],
        [104, 30],
      ].map(([x, y], i) => (
        <g key={i}>
          <Edge x1={x - 10} y1={50} x2={x + 6} y2={y} />
          <Edge x1={x + 6} y1={y} x2={x + 20} y2={50} />
          <Dot x={x + 6} y={y} cls={META} r={4} className={`${A} group-hover:scale-125`} />
        </g>
      ))}
      <Tag x={120} y={56} label="main" hot />
      <text x={14} y={92} className={T}>
        short branches, merged often
      </text>
    </>
  ),

  "commit-hygiene": () => (
    <>
      {[
        ["fix: round prices to 2 dp", true],
        ["wip", false],
        ["asdf", false],
      ].map(([l, ok], i) => (
        <g key={l as string}>
          <rect
            x={20}
            y={18 + i * 22}
            width={120}
            height={16}
            rx={3}
            className={
              ok ? `${GOOD} ${A} group-hover:scale-105` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1.1}
          />
          <text
            x={28}
            y={29 + i * 22}
            className={`font-mono text-[6.5px] ${ok ? "fill-fg" : "fill-subtle"}`}
          >
            {l}
          </text>
        </g>
      ))}
      <text x={20} y={92} className={T}>
        history is documentation
      </text>
    </>
  ),

  undoing: () => (
    <>
      {["restore", "reset", "revert", "amend"].map((l, i) => (
        <Svc
          key={l}
          x={14 + (i % 2) * 70}
          y={20 + Math.floor(i / 2) * 30}
          w={60}
          h={20}
          label={l}
          cls={i === 2 ? HOT : undefined}
          className={i === 2 ? `${A} group-hover:scale-105` : ""}
        />
      ))}
      <text x={14} y={92} className={T}>
        pick the right undo
      </text>
    </>
  ),

  reflog: () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <text x={18} y={22 + i * 14} className="fill-subtle font-mono text-[6px]">
            {`HEAD@{${i}}`}
          </text>
          <rect
            x={56}
            y={16 + i * 14}
            width={70}
            height={8}
            rx={2}
            className={i === 2 ? `${HOT} ${A} group-hover:scale-x-105` : "fill-viz-data/30"}
            strokeWidth={1}
          />
        </g>
      ))}
      <text x={18} y={86} className={T}>
        where HEAD has been, 90 days
      </text>
    </>
  ),

  "stash-worktrees": () => (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={24 + i * 4}
          y={50 - i * 8}
          width={46}
          height={12}
          rx={3}
          className={i === 2 ? `${HOT} ${A} group-hover:-translate-y-1` : DATA}
          strokeWidth={1.1}
        />
      ))}
      <text x={24} y={80} className={T}>
        stash
      </text>
      <rect
        x={96}
        y={20}
        width={44}
        height={22}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <rect
        x={96}
        y={48}
        width={44}
        height={22}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <text x={118} y={34} textAnchor="middle" className={T}>
        main
      </text>
      <text x={118} y={62} textAnchor="middle" className={T}>
        hotfix
      </text>
      <text x={96} y={80} className={T}>
        worktrees
      </text>
    </>
  ),

  "bisect-blame": () => (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i}>
          {i > 0 && <Edge x1={16 + (i - 1) * 18} y1={46} x2={16 + i * 18} y2={46} />}
          <Dot
            x={16 + i * 18}
            y={46}
            r={4}
            cls={i < 5 ? GOOD : BAD}
            className={i === 5 ? `${A} group-hover:scale-150` : ""}
          />
        </g>
      ))}
      <path d="M106 30 L106 38" className="stroke-accent" strokeWidth={1.4} />
      <text x={106} y={26} textAnchor="middle" className="fill-accent font-mono text-[6px]">
        first bad
      </text>
      <text x={14} y={80} className={T}>
        halve the range each step
      </text>
    </>
  ),

  "big-repos": () => (
    <>
      <rect
        x={18}
        y={16}
        width={70}
        height={64}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
        strokeDasharray="3 2"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={24 + (i % 3) * 21}
          y={22 + Math.floor(i / 3) * 28}
          width={16}
          height={22}
          rx={2}
          className={i === 1 ? `${HOT} ${A} group-hover:scale-110` : "fill-surface stroke-line"}
          strokeWidth={1}
        />
      ))}
      <path d="M92 48h14" className="stroke-accent" strokeWidth={1.4} />
      <rect x={110} y={34} width={30} height={28} rx={3} className={HOT} strokeWidth={1.2} />
      <text x={18} y={92} className={T}>
        fetch only what you need
      </text>
    </>
  ),

  "monorepos-submodules": () => (
    <>
      <rect
        x={12}
        y={18}
        width={62}
        height={56}
        rx={5}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={18}
          y={26 + i * 15}
          width={50}
          height={10}
          rx={2}
          className={DATA}
          strokeWidth={1}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={92 + (i % 2) * 30}
          y={18 + i * 20}
          width={26}
          height={16}
          rx={3}
          className="fill-surface stroke-line-strong"
          strokeWidth={1.1}
        />
      ))}
      <text x={43} y={86} textAnchor="middle" className={T}>
        one repo
      </text>
      <text x={118} y={86} textAnchor="middle" className={T}>
        many
      </text>
    </>
  ),

  "signing-secrets": () => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {i > 0 && <Edge x1={24 + (i - 1) * 34} y1={40} x2={24 + i * 34} y2={40} />}
          <Dot x={24 + i * 34} y={40} cls={i === 1 ? BAD : DATA} />
        </g>
      ))}
      <rect x={42} y={56} width={30} height={12} rx={3} className={BAD} strokeWidth={1} />
      <text x={57} y={64} textAnchor="middle" className="fill-bad font-mono text-[5.5px]">
        key
      </text>
      <circle
        cx={124}
        cy={40}
        r={12}
        className={`${GOOD} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <path d="M118 40l4 4l8 -8" className="stroke-good" strokeWidth={1.5} />
      <text x={14} y={90} className={T}>
        revoke first · verified commits
      </text>
    </>
  ),

  hooks: () => (
    <>
      <Svc x={12} y={38} w={34} h={18} label="commit" />
      <rect
        x={58}
        y={30}
        width={16}
        height={34}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-y-110`}
        strokeWidth={1.2}
      />
      <Svc x={86} y={38} w={30} h={18} label="push" />
      <rect x={126} y={30} width={16} height={34} rx={3} className={META} strokeWidth={1.2} />
      <text x={66} y={76} textAnchor="middle" className={T}>
        hook
      </text>
      <text x={134} y={76} textAnchor="middle" className={T}>
        CI
      </text>
    </>
  ),

  "capstone-git": () => (
    <>
      <Edge x1={16} y1={56} x2={42} y2={56} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Edge x1={42 + i * 22} y1={56} x2={64 + i * 22} y2={56} dashed={i === 0} />
          <Dot x={64 + i * 22} y={56} cls={HOT} r={4} />
        </g>
      ))}
      <Edge x1={42} y1={56} x2={70} y2={28} />
      <Dot x={16} y={56} />
      <Dot x={42} y={56} />
      <Dot x={70} y={28} cls={META} r={4} />
      <Edge x1={70} y1={28} x2={134} y2={42} />
      <Edge x1={108} y1={56} x2={134} y2={42} />
      <Dot x={134} y={42} cls={GOOD} r={6} className={`${A} group-hover:scale-125`} />
      <text x={14} y={88} className={T}>
        rescued, then protected
      </text>
    </>
  ),
};
