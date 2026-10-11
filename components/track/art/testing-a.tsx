import { A, type ArtMap } from "./kit";
import { T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Testing track (modules 1–12), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const BAD = "fill-bad/20 stroke-bad";
const GOOD = "fill-good/20 stroke-good";

/** A pass or fail mark in a small circle. */
export function Mark({
  x,
  y,
  ok,
  className = "",
}: {
  x: number;
  y: number;
  ok: boolean;
  className?: string;
}) {
  return (
    <g className={className}>
      <circle cx={x} cy={y} r={6} className={ok ? GOOD : BAD} strokeWidth={1.1} />
      {ok ? (
        <path
          d={`M${x - 2.6} ${y}l1.8 1.9l3.6 -3.8`}
          className="stroke-good"
          strokeWidth={1.4}
          fill="none"
        />
      ) : (
        <path
          d={`M${x - 2.2} ${y - 2.2}l4.4 4.4M${x + 2.2} ${y - 2.2}l-4.4 4.4`}
          className="stroke-bad"
          strokeWidth={1.4}
        />
      )}
    </g>
  );
}

export const testingArtA: ArtMap = {
  "why-test": () => (
    <>
      <path
        d="M14 70 Q50 70 80 50 T146 20"
        className="stroke-line-strong"
        strokeWidth={1.2}
        fill="none"
      />
      {[
        [22, 70, true],
        [62, 60, true],
        [104, 38, false],
        [140, 22, false],
      ].map(([x, y, ok], i) => (
        <Mark
          key={i}
          x={x as number}
          y={y as number}
          ok={ok as boolean}
          className={i === 0 ? `${A} group-hover:scale-125` : ""}
        />
      ))}
      <text x={14} y={92} className={T}>
        found early is cheap
      </text>
    </>
  ),

  anatomy: () => (
    <>
      {["arrange", "act", "assert"].map((l, i) => (
        <g key={l}>
          <rect
            x={16 + i * 46}
            y={32}
            width={38}
            height={24}
            rx={4}
            className={
              i === 2 ? `${HOT} ${A} group-hover:scale-105` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1.2}
          />
          <text
            x={35 + i * 46}
            y={47}
            textAnchor="middle"
            className="fill-fg font-mono text-[6.5px]"
          >
            {l}
          </text>
          {i < 2 && <path d={`M${56 + i * 46} 44h6`} className="stroke-accent" strokeWidth={1.3} />}
        </g>
      ))}
      <text x={16} y={80} className={T}>
        the assertion can fail
      </text>
    </>
  ),

  "choosing-cases": () => (
    <>
      <line x1={14} y1={46} x2={146} y2={46} className="stroke-line-strong" strokeWidth={1.2} />
      <line x1={80} y1={32} x2={80} y2={60} className="stroke-accent" strokeWidth={1.5} />
      {[74, 86].map((x) => (
        <circle
          key={x}
          cx={x}
          cy={46}
          r={4}
          className={`${HOT} ${A} group-hover:scale-125`}
          strokeWidth={1.2}
        />
      ))}
      <circle cx={36} cy={46} r={3} className={DATA} strokeWidth={1} />
      <circle cx={124} cy={46} r={3} className={DATA} strokeWidth={1} />
      <text x={80} y={74} textAnchor="middle" className="fill-accent font-mono text-[6px]">
        ₹490 | ₹500
      </text>
      <text x={14} y={92} className={T}>
        one per partition, both sides of edges
      </text>
    </>
  ),

  "test-shapes": () => (
    <>
      {[
        [62, 22, 36, "fill-viz-meta/50"],
        [46, 40, 68, "fill-viz-compute/50"],
        [28, 58, 104, "fill-viz-data/50"],
      ].map(([x, y, w, c], i) => (
        <rect
          key={i}
          x={x as number}
          y={y as number}
          width={w as number}
          height={14}
          rx={2}
          className={`${c as string} ${i === 2 ? `${A} group-hover:scale-x-105` : ""}`}
        />
      ))}
      <text x={136} y={30} className={T}>
        e2e
      </text>
      <text x={14} y={88} className={T}>
        many small, few big
      </text>
    </>
  ),

  "unit-tests": () => (
    <>
      <circle
        cx={52}
        cy={44}
        r={16}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.3}
      />
      <path d="M46 52 Q52 30 58 52" className="stroke-accent" strokeWidth={1.2} fill="none" />
      <rect
        x={44}
        y={60}
        width={16}
        height={8}
        rx={1}
        className="fill-surface stroke-line-strong"
        strokeWidth={1}
      />
      <rect
        x={92}
        y={34}
        width={46}
        height={24}
        rx={4}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={115} y={49} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        bench
      </text>
      <path d="M70 46h20" className="stroke-line-strong" strokeWidth={1} strokeDasharray="2 2" />
      <text x={14} y={90} className={T}>
        one piece, in milliseconds
      </text>
    </>
  ),

  "test-doubles": () => (
    <>
      <Svc x={14} y={36} w={40} h={18} label="checkout" />
      <Svc x={106} y={18} w={40} h={16} label="payments" cls="fill-surface-2/60 stroke-line" />
      <Svc
        x={106}
        y={52}
        w={40}
        h={16}
        label="stub"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <path d="M56 44 L104 26" className="stroke-line" strokeWidth={1} strokeDasharray="2 2" />
      <path d="M56 46 L104 60" className="stroke-accent" strokeWidth={1.3} />
      <text x={14} y={90} className={T}>
        a stand-in for the slow part
      </text>
    </>
  ),

  "readable-tests": () => (
    <>
      <rect x={20} y={20} width={120} height={50} rx={4} className={BAD} strokeWidth={1.1} />
      <text x={28} y={34} className="fill-bad font-mono text-[6.5px]">
        ✕ discount is capped at ₹100
      </text>
      <text x={28} y={48} className="fill-fg font-mono text-[6.5px]">
        Expected: 100
      </text>
      <text
        x={28}
        y={60}
        className={`fill-fg font-mono text-[6.5px] ${A} group-hover:translate-x-1`}
      >
        Received: 120
      </text>
      <text x={20} y={88} className={T}>
        the failure explains itself
      </text>
    </>
  ),

  tdd: () => (
    <>
      {[
        [44, "fill-bad/30 stroke-bad", "red"],
        [80, "fill-good/30 stroke-good", "green"],
        [116, HOT, "refactor"],
      ].map(([x, c, l], i) => (
        <g key={l as string}>
          <circle
            cx={x as number}
            cy={44}
            r={14}
            className={`${c as string} ${i === 0 ? `${A} group-hover:scale-110` : ""}`}
            strokeWidth={1.2}
          />
          <text x={x as number} y={47} textAnchor="middle" className="fill-fg font-mono text-[6px]">
            {l as string}
          </text>
        </g>
      ))}
      <path
        d="M116 60 Q80 82 44 60"
        className="stroke-line-strong"
        strokeWidth={1}
        fill="none"
        strokeDasharray="2 2"
      />
      <text x={14} y={92} className={T}>
        test first, small loops
      </text>
    </>
  ),

  "integration-tests": () => (
    <>
      <Svc x={14} y={36} w={40} h={18} label="code" />
      <ellipse cx={120} cy={34} rx={18} ry={5} className={DATA} strokeWidth={1.1} />
      <path
        d="M102 34v20a18 5 0 0 0 36 0v-20"
        className="fill-viz-data/15 stroke-viz-data"
        strokeWidth={1.1}
      />
      <path
        d="M56 45h44"
        className={`stroke-accent ${A} group-hover:scale-x-110`}
        strokeWidth={1.5}
      />
      <circle cx={78} cy={45} r={4} className={HOT} strokeWidth={1.2} />
      <text x={14} y={90} className={T}>
        the bug lives in the join
      </text>
    </>
  ),

  "contract-tests": () => (
    <>
      <Svc x={12} y={36} w={38} h={18} label="consumer" />
      <Svc x={110} y={36} w={38} h={18} label="provider" />
      <rect
        x={60}
        y={26}
        width={40}
        height={38}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      {[36, 44, 52].map((y) => (
        <line key={y} x1={66} y1={y} x2={94} y2={y} className="stroke-accent" strokeWidth={1} />
      ))}
      <text x={80} y={76} textAnchor="middle" className={T}>
        contract
      </text>
    </>
  ),

  "ui-tests": () => (
    <>
      <rect
        x={30}
        y={14}
        width={100}
        height={66}
        rx={5}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={40} y={30} className="fill-fg text-[6px]">
        Email
      </text>
      <rect
        x={40}
        y={33}
        width={80}
        height={10}
        rx={2}
        className="fill-surface stroke-line"
        strokeWidth={1}
      />
      <rect
        x={40}
        y={54}
        width={60}
        height={14}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={70} y={63} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        Create account
      </text>
      <text x={30} y={92} className={T}>
        getByRole · getByLabel
      </text>
    </>
  ),

  "end-to-end": () => (
    <>
      {["menu", "basket", "pay", "done"].map((l, i) => (
        <g key={l}>
          <rect
            x={10 + i * 38}
            y={32}
            width={30}
            height={22}
            rx={3}
            className={
              i === 3 ? `${GOOD} ${A} group-hover:scale-105` : "fill-surface stroke-line-strong"
            }
            strokeWidth={1.1}
          />
          <text x={25 + i * 38} y={46} textAnchor="middle" className="fill-fg font-mono text-[6px]">
            {l}
          </text>
          {i < 3 && <path d={`M${41 + i * 38} 43h6`} className="stroke-accent" strokeWidth={1.2} />}
        </g>
      ))}
      <text x={10} y={80} className={T}>
        a real user journey
      </text>
    </>
  ),
};
