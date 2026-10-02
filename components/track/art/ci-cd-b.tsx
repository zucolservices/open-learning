import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Mark, Stage } from "./ci-cd-a";

/** Card illustrations for the CI/CD track (modules 12–21), keyed by module slug. */

export const ciCdArtB: ArtMap = {
  "delivery-vs-deployment": () => (
    <>
      {["build", "test", "stage"].map((l, i) => (
        <Stage key={l} x={10 + i * 30} y={36} w={24} label={l} cls="fill-accent/15 stroke-accent" />
      ))}
      <circle
        cx={112}
        cy={44}
        r={9}
        className={`fill-viz-compute/20 stroke-viz-compute ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={112} y={47} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        go?
      </text>
      <Arrow x1={122} y1={44} x2={134} y2={44} />
      <Stage x={136} y={36} w={20} label="prod" />
      <text x={10} y={72} className={T}>
        delivery: a person presses go
      </text>
    </>
  ),

  "release-strategies": () => (
    <>
      {Array.from({ length: 20 }, (_, i) => (
        <circle
          key={i}
          cx={20 + (i % 10) * 12}
          cy={34 + Math.floor(i / 10) * 14}
          r={4}
          className={
            i === 0
              ? `fill-viz-compute/50 stroke-viz-compute ${A} group-hover:scale-125`
              : "fill-viz-data/25 stroke-viz-data"
          }
        />
      ))}
      <text x={14} y={72} className={T}>
        canary: 5% first, then widen
      </text>
    </>
  ),

  "feature-flags": () => (
    <>
      <rect
        x={20}
        y={32}
        width={40}
        height={20}
        rx={10}
        className="fill-viz-add/25 stroke-viz-add"
        strokeWidth={1.2}
      />
      <circle
        cx={50}
        cy={42}
        r={7}
        className={`fill-viz-add stroke-viz-add ${A} group-hover:-translate-x-5`}
      />
      <text x={40} y={66} textAnchor="middle" className={T}>
        new-checkout
      </text>
      <Arrow x1={68} y1={42} x2={82} y2={42} />
      {[1, 10, 50].map((p, i) => (
        <g key={p}>
          <rect
            x={88 + i * 22}
            y={30}
            width={18}
            height={24}
            rx={3}
            className="fill-surface-2/60 stroke-line-strong"
          />
          <rect
            x={88 + i * 22}
            y={54 - (p / 50) * 24}
            width={18}
            height={(p / 50) * 24}
            rx={2}
            className="fill-accent/40"
          />
          <text
            x={97 + i * 22}
            y={64}
            textAnchor="middle"
            className="fill-muted font-mono text-[5px]"
          >
            {p}%
          </text>
        </g>
      ))}
    </>
  ),

  "schema-migrations": () => (
    <>
      <rect
        x={14}
        y={20}
        width={60}
        height={50}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={20} y={30} className="fill-muted font-mono text-[6px]">
        orders
      </text>
      <rect
        x={20}
        y={36}
        width={48}
        height={10}
        rx={2}
        className="fill-viz-remove/20 stroke-viz-remove"
        strokeDasharray="2 2"
      />
      <text x={24} y={43} className="fill-fg font-mono text-[5.5px]">
        customer_name
      </text>
      <rect
        x={20}
        y={52}
        width={48}
        height={10}
        rx={2}
        className={`fill-viz-add/25 stroke-viz-add ${A} group-hover:-translate-y-1`}
      />
      <text x={24} y={59} className="fill-fg font-mono text-[5.5px]">
        full_name
      </text>
      {["expand", "migrate", "contract"].map((l, i) => (
        <text key={l} x={86} y={34 + i * 14} className="fill-fg font-mono text-[6.5px]">
          {i + 1}. {l}
        </text>
      ))}
    </>
  ),

  rollbacks: () => (
    <>
      <path d="M20 60h110" className="stroke-line-strong" strokeWidth={1.2} />
      {[30, 60, 90].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={60}
          r={5}
          className={
            i === 2 ? "fill-viz-remove/30 stroke-viz-remove" : "fill-viz-add/25 stroke-viz-add"
          }
          strokeWidth={1.2}
        />
      ))}
      <text x={84} y={76} className="fill-muted font-mono text-[6px]">
        v42 ✕
      </text>
      <path
        d="M86 50c-8-18-20-18-26-6"
        className={`stroke-accent ${A} group-hover:-translate-x-1`}
        strokeWidth={1.6}
      />
      <path d="M58 40l2 6 5-3" className="stroke-accent" strokeWidth={1.6} />
      <text x={50} y={30} className="fill-accent font-mono text-[6px]">
        roll back first
      </text>
    </>
  ),

  "pipeline-secrets": () => (
    <>
      <rect
        x={16}
        y={28}
        width={30}
        height={30}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={31} y={46} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        job
      </text>
      <Arrow x1={50} y1={43} x2={70} y2={43} />
      <text x={60} y={36} textAnchor="middle" className="fill-muted font-mono text-[5px]">
        OIDC
      </text>
      <path d="M72 34h28v18H72z" className="fill-viz-meta/15 stroke-viz-meta" strokeWidth={1.2} />
      <text x={86} y={46} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        cloud
      </text>
      <Arrow x1={104} y1={43} x2={118} y2={43} />
      <g className={`${A} group-hover:rotate-12`}>
        <circle cx={126} cy={43} r={5} className="stroke-viz-add" strokeWidth={1.5} />
        <path d="M131 43h12M139 43v4" className="stroke-viz-add" strokeWidth={1.5} />
      </g>
      <text x={110} y={66} className={T}>
        1-hour key
      </text>
    </>
  ),

  "software-supply-chain": () => (
    <>
      {["src", "deps", "build", "dist"].map((l, i) => (
        <g key={l}>
          <circle
            cx={24 + i * 36}
            cy={44}
            r={11}
            className={
              i === 2
                ? "fill-viz-remove/20 stroke-viz-remove"
                : "fill-surface-2/60 stroke-line-strong"
            }
            strokeWidth={1.4}
          />
          <text
            x={24 + i * 36}
            y={47}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {l}
          </text>
          {i < 3 && (
            <path d={`M${35 + i * 36} 44h14`} className="stroke-line-strong" strokeWidth={2} />
          )}
        </g>
      ))}
      <path
        d="M96 62l6 2v4c0 4-3 6-6 7-3-1-6-3-6-7v-4z"
        className={`fill-viz-add/20 stroke-viz-add ${A} group-hover:-translate-y-1`}
        strokeWidth={1.2}
      />
      <text x={14} y={84} className={T}>
        every link needs a guard
      </text>
    </>
  ),

  "dora-metrics": () => (
    <>
      {[
        ["lead time", 20],
        ["deploys", 34],
        ["recovery", 16],
        ["fail rate", 10],
        ["rework", 8],
      ].map(([l, h], i) => (
        <g key={l as string}>
          <rect
            x={18 + i * 26}
            y={66 - (h as number)}
            width={16}
            height={h as number}
            rx={2}
            className={`${i < 3 ? "fill-viz-data/30 stroke-viz-data" : "fill-viz-compute/30 stroke-viz-compute"} ${i === 1 ? `${A} group-hover:-translate-y-1` : ""}`}
          />
          <text
            x={26 + i * 26}
            y={76}
            textAnchor="middle"
            className="fill-muted font-mono text-[5px]"
          >
            {l as string}
          </text>
        </g>
      ))}
      <text x={18} y={20} className={T}>
        five numbers, one trend
      </text>
    </>
  ),

  "ci-platforms": () => (
    <>
      {[
        ["GitHub", 22],
        ["GitLab", 22],
        ["CircleCI", 34],
        ["CodeBuild", 20],
        ["self-host", 14],
      ].map(([l, w], i) => (
        <g key={l as string}>
          <text x={14} y={24 + i * 12} className="fill-muted font-mono text-[5.5px]">
            {l as string}
          </text>
          <rect
            x={56}
            y={18 + i * 12}
            width={(w as number) * 2.4}
            height={8}
            rx={2}
            className={`${i === 4 ? "fill-viz-compute/40" : "fill-accent/40"} ${i === 0 ? `${A} group-hover:scale-x-110` : ""}`}
          />
        </g>
      ))}
      <text x={14} y={88} className={T}>
        $ per month, same builds
      </text>
    </>
  ),

  "capstone-cicd": () => (
    <>
      <rect
        x={12}
        y={30}
        width={26}
        height={30}
        rx={4}
        className="fill-surface-2 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={25} y={49} textAnchor="middle" className="fill-fg font-mono text-[8px]">
        ₹
      </text>
      <Arrow x1={40} y1={45} x2={52} y2={45} />
      {["ci", "art", "canary"].map((l, i) => (
        <Stage key={l} x={54 + i * 26} y={37} w={22} label={l} cls="fill-accent/15 stroke-accent" />
      ))}
      <Mark x={140} y={45} ok className={`${A} group-hover:scale-125`} />
      <text x={80} y={78} textAnchor="middle" className={T}>
        design it, then survive a bad day
      </text>
    </>
  ),
};
