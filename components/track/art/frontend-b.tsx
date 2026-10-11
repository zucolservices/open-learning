import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Win } from "./frontend-a";

/** Card illustrations for the Frontend track (modules 12–22), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const frontendArtB: ArtMap = {
  "rendering-modes": () => (
    <>
      {["CSR", "SSR", "SSG", "ISR"].map((l, i) => (
        <g key={l}>
          <text x={14} y={24 + i * 16} className="fill-fg font-mono text-[6.5px]">
            {l}
          </text>
          <rect
            x={36}
            y={19 + i * 16}
            width={[100, 50, 22, 26][i]}
            height={7}
            rx={3.5}
            className={i === 2 ? `${GOOD} ${A} group-hover:scale-x-110` : DATA}
            strokeWidth={1}
          />
        </g>
      ))}
      <text x={14} y={92} className={T}>
        when does content appear?
      </text>
    </>
  ),

  hydration: () => (
    <>
      <Win x={24} y={14} w={112} h={70} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={32}
          y={30 + i * 16}
          width={96}
          height={10}
          rx={2}
          className={i === 1 ? `${HOT} ${A} group-hover:scale-105` : "fill-surface-2 stroke-line"}
          strokeWidth={1}
        />
      ))}
      <text x={80} y={51} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        island
      </text>
    </>
  ),

  "edge-caching": () => (
    <>
      <Svc x={10} y={40} w={34} h={16} label="origin" />
      <Svc
        x={64}
        y={40}
        w={30}
        h={16}
        label="CDN"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Svc x={114} y={40} w={36} h={16} label="browser" cls={GOOD} />
      <Arrow x1={46} y1={48} x2={62} y2={48} />
      <Arrow x1={96} y1={48} x2={112} y2={48} />
      <text x={10} y={80} className={T}>
        cache-control: who may keep it
      </text>
    </>
  ),

  "web-vitals": () => (
    <>
      {["LCP", "INP", "CLS"].map((l, i) => (
        <g key={l}>
          <circle
            cx={36 + i * 44}
            cy={44}
            r={15}
            className={i === 1 ? `${GOOD} ${A} group-hover:scale-110` : GOOD}
            strokeWidth={1.4}
          />
          <text x={36 + i * 44} y={47} textAnchor="middle" className="fill-fg font-mono text-[7px]">
            {l}
          </text>
        </g>
      ))}
      <text x={14} y={84} className={T}>
        2.5 s · 200 ms · 0.1
      </text>
    </>
  ),

  "shipping-less-js": () => (
    <>
      <rect
        x={14}
        y={30}
        width={130}
        height={14}
        rx={3}
        className="fill-surface-2 stroke-line"
        strokeWidth={1}
      />
      {[
        [14, 24, DATA],
        [38, 30, DATA],
        [68, 40, BAD],
        [108, 36, BAD],
      ].map(([x, w, c], i) => (
        <rect
          key={i}
          x={x as number}
          y={30}
          width={w as number}
          height={14}
          className={`${c as string} ${i > 1 ? `${A} group-hover:opacity-30` : ""}`}
          strokeWidth={0.8}
        />
      ))}
      <text x={14} y={64} className={T}>
        split · tree-shake · drop
      </text>
    </>
  ),

  "images-fonts": () => (
    <>
      <rect x={20} y={20} width={60} height={44} rx={3} className={DATA} strokeWidth={1.1} />
      <path
        d="M24 58 l14 -16 l10 10 l8 -6 l20 12"
        className="stroke-viz-data fill-none"
        strokeWidth={1.2}
      />
      <rect
        x={92}
        y={30}
        width={34}
        height={24}
        rx={3}
        className={`${GOOD} ${A} group-hover:scale-110`}
        strokeWidth={1.1}
      />
      <text x={109} y={45} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        AVIF
      </text>
      <text x={20} y={84} className={T}>
        right size, right format
      </text>
    </>
  ),

  accessibility: () => (
    <>
      <circle cx={80} cy={28} r={7} className={HOT} strokeWidth={1.2} />
      <path
        d="M64 40 h32 M80 40 v18 M80 58 l-10 16 M80 58 l10 16"
        className={`stroke-accent ${A} group-hover:scale-105`}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <text x={14} y={92} className={T}>
        keyboard · labels · contrast
      </text>
    </>
  ),

  "responsive-design": () => (
    <>
      <rect
        x={14}
        y={20}
        width={70}
        height={46}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <rect
        x={92}
        y={22}
        width={30}
        height={42}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <rect
        x={128}
        y={30}
        width={18}
        height={30}
        rx={3}
        className={`fill-surface stroke-accent ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={20 + i * 21}
          y={28}
          width={17}
          height={14}
          rx={2}
          className={DATA}
          strokeWidth={1}
        />
      ))}
      <text x={14} y={84} className={T}>
        one page, every screen
      </text>
    </>
  ),

  "design-systems": () => (
    <>
      {["primitive", "semantic", "component"].map((l, i) => (
        <g key={l}>
          <rect
            x={22 + i * 12}
            y={18 + i * 20}
            width={80}
            height={14}
            rx={3}
            className={i === 1 ? `${HOT} ${A} group-hover:scale-x-105` : DATA}
            strokeWidth={1}
          />
          <text x={28 + i * 12} y={27 + i * 20} className="fill-fg font-mono text-[6px]">
            {l}
          </text>
        </g>
      ))}
      <text x={14} y={90} className={T}>
        tokens, not one-offs
      </text>
    </>
  ),

  "frontend-security": () => (
    <>
      <path
        d="M80 16 l26 10 v20 c0 18 -12 28 -26 32 c-14 -4 -26 -14 -26 -32 v-20 z"
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.3}
      />
      <text x={80} y={50} textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        CSP
      </text>
      <text x={14} y={92} className={T}>
        escape · CSP · HttpOnly
      </text>
    </>
  ),

  "capstone-frontend": () => (
    <>
      <Win x={20} y={14} w={80} h={70} />
      <rect x={28} y={30} width={64} height={22} rx={2} className={DATA} strokeWidth={1} />
      <rect x={28} y={58} width={30} height={8} rx={4} className={GOOD} strokeWidth={1} />
      {["LCP", "INP", "CLS"].map((l, i) => (
        <g key={l}>
          <circle
            cx={124}
            cy={26 + i * 20}
            r={7}
            className={`${GOOD} ${i === 0 ? `${A} group-hover:scale-125` : ""}`}
            strokeWidth={1.1}
          />
          <text
            x={124}
            y={28 + i * 20}
            textAnchor="middle"
            className="fill-fg font-mono text-[4.5px]"
          >
            {l}
          </text>
        </g>
      ))}
    </>
  ),
};
