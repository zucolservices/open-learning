import { A, type ArtMap } from "./kit";
import { T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Mark } from "./testing-a";

/** Card illustrations for the Testing track (modules 13–23), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const BAD = "fill-bad/20 stroke-bad";
const GOOD = "fill-good/20 stroke-good";

export const testingArtB: ArtMap = {
  coverage: () => (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i}>
          <rect
            x={30}
            y={14 + i * 10}
            width={6}
            height={7}
            className={i === 4 ? "fill-bad/50" : "fill-good/50"}
          />
          <rect
            x={40}
            y={16 + i * 10}
            width={[60, 44, 70, 38, 56, 48, 30][i]}
            height={3}
            rx={1.5}
            className="fill-viz-data/40"
          />
        </g>
      ))}
      <text
        x={118}
        y={40}
        className={`fill-accent font-mono text-[9px] ${A} group-hover:scale-110`}
      >
        86%
      </text>
      <text x={14} y={94} className={T}>
        what ran, not what was checked
      </text>
    </>
  ),

  "mutation-testing": () => (
    <>
      <rect
        x={20}
        y={26}
        width={60}
        height={14}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1}
      />
      <text x={50} y={36} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        kg {"<="} 2
      </text>
      <rect
        x={20}
        y={50}
        width={60}
        height={14}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <text x={50} y={60} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        kg {"<"} 2
      </text>
      <Mark x={108} y={33} ok />
      <Mark x={108} y={57} ok={false} />
      <text x={120} y={36} className={T}>
        killed
      </text>
      <text x={120} y={60} className="fill-bad font-mono text-[6px]">
        survived
      </text>
      <text x={14} y={90} className={T}>
        plant bugs, test the tests
      </text>
    </>
  ),

  "flaky-tests": () => (
    <>
      {[1, 1, 0, 1, 1, 1, 0, 1, 1, 0].map((ok, i) => (
        <rect
          key={i}
          x={16 + i * 13}
          y={38}
          width={10}
          height={14}
          rx={2}
          className={
            ok ? "fill-good/50" : `fill-bad/60 ${i === 6 ? `${A} group-hover:scale-110` : ""}`
          }
        />
      ))}
      <text x={16} y={30} className={T}>
        same code, every run
      </text>
      <text x={16} y={74} className={T}>
        pass, pass, fail…
      </text>
    </>
  ),

  "test-data": () => (
    <>
      <rect x={14} y={22} width={50} height={46} rx={3} className={BAD} strokeWidth={1.1} />
      <text x={39} y={48} textAnchor="middle" className="fill-bad font-mono text-[6px]">
        fixtures[7]
      </text>
      <path d="M68 45h14" className="stroke-accent" strokeWidth={1.4} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={88}
          y={20 + i * 18}
          width={58}
          height={13}
          rx={3}
          className={i === 0 ? `${GOOD} ${A} group-hover:scale-105` : GOOD}
          strokeWidth={1}
        />
      ))}
      <text x={117} y={29} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        aCustomer().student()
      </text>
      <text x={14} y={90} className={T}>
        fresh data per test
      </text>
    </>
  ),

  "property-based": () => (
    <>
      {Array.from({ length: 24 }, (_, i) => (
        <circle
          key={i}
          cx={20 + (i % 8) * 10}
          cy={24 + Math.floor(i / 8) * 12}
          r={2.5}
          className={i === 13 ? BAD : "fill-viz-data/40"}
        />
      ))}
      <path d="M100 36h12" className="stroke-accent" strokeWidth={1.3} />
      <rect
        x={116}
        y={28}
        width={32}
        height={16}
        rx={3}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <text x={132} y={39} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        [2, 100]
      </text>
      <text x={14} y={88} className={T}>
        random inputs, shrunk to the smallest
      </text>
    </>
  ),

  "performance-tests": () => (
    <>
      <line x1={18} y1={70} x2={146} y2={70} className="stroke-line-strong" strokeWidth={1} />
      <line x1={18} y1={14} x2={18} y2={70} className="stroke-line-strong" strokeWidth={1} />
      <path
        d="M18 66 C70 64 100 60 114 46 S126 16 130 14"
        className={`stroke-accent ${A} group-hover:scale-y-105`}
        strokeWidth={1.6}
        fill="none"
      />
      <line
        x1={18}
        y1={44}
        x2={146}
        y2={44}
        className="stroke-bad"
        strokeWidth={0.8}
        strokeDasharray="3 2"
      />
      <circle cx={116} cy={44} r={3} className="fill-bad" />
      <text x={14} y={88} className={T}>
        find the knee before customers do
      </text>
    </>
  ),

  "legacy-code": () => (
    <>
      <rect
        x={18}
        y={18}
        width={58}
        height={56}
        rx={3}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.1}
      />
      {[26, 34, 42, 50, 58, 66].map((y, i) => (
        <rect
          key={y}
          x={24}
          y={y}
          width={[40, 30, 46, 22, 38, 28][i]}
          height={3}
          rx={1.5}
          className="fill-viz-idle/60"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} className={i === 0 ? `${A} group-hover:-translate-x-1` : ""}>
          <rect
            x={92}
            y={22 + i * 18}
            width={50}
            height={12}
            rx={3}
            className={HOT}
            strokeWidth={1}
          />
          <text
            x={117}
            y={30 + i * 18}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            locked in
          </text>
        </g>
      ))}
      <text x={14} y={90} className={T}>
        record it, then change it
      </text>
    </>
  ),

  "tests-in-ci": () => (
    <>
      {[
        [16, 22, 20, "fill-viz-idle/60"],
        [16, 32, 50, "fill-viz-data/60"],
        [16, 42, 16, "fill-viz-compute/60"],
        [34, 52, 30, "fill-viz-meta/60"],
        [34, 62, 34, "fill-accent/60"],
      ].map(([x, y, w, c], i) => (
        <rect
          key={i}
          x={x as number}
          y={y as number}
          width={w as number}
          height={7}
          rx={1.5}
          className={`${c as string} ${i === 4 ? `${A} group-hover:scale-x-110` : ""}`}
        />
      ))}
      <Mark x={128} y={44} ok />
      <text x={14} y={88} className={T}>
        fast feedback on every change
      </text>
    </>
  ),

  exploratory: () => (
    <>
      <circle
        cx={62}
        cy={42}
        r={16}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.4}
      />
      <line
        x1={74}
        y1={54}
        x2={90}
        y2={70}
        className="stroke-accent"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <path
        d="M20 70 Q40 20 70 30 T130 24"
        className="stroke-line-strong"
        strokeWidth={1}
        strokeDasharray="2 3"
        fill="none"
      />
      <circle cx={130} cy={24} r={4} className={BAD} strokeWidth={1} />
      <text x={14} y={92} className={T}>
        a charter, a time-box, clues
      </text>
    </>
  ),

  "testing-in-production": () => (
    <>
      {[1, 5, 25, 100].map((p, i) => (
        <g key={p}>
          <rect
            x={14 + i * 34}
            y={60 - (i + 1) * 9}
            width={26}
            height={(i + 1) * 9}
            rx={2}
            className={i === 0 ? `${HOT} ${A} group-hover:scale-y-110` : DATA}
            strokeWidth={1}
          />
          <text x={27 + i * 34} y={70} textAnchor="middle" className={T}>
            {p}%
          </text>
        </g>
      ))}
      <Svc x={118} y={14} w={30} h={14} label="flag" cls={GOOD} />
      <text x={14} y={90} className={T}>
        start small, switch off fast
      </text>
    </>
  ),

  "capstone-testing": () => (
    <>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={24 + c * 18}
            y={18 + r * 18}
            width={16}
            height={16}
            rx={2}
            className={r + c >= 3 ? "fill-bad/40" : r + c === 2 ? "fill-accent/30" : "fill-good/30"}
          />
        )),
      )}
      <circle cx={70} cy={22} r={4} className={`fill-fg ${A} group-hover:scale-150`} />
      <text x={24} y={84} className={T}>
        test by risk
      </text>
      <Mark x={120} y={34} ok />
      <Mark x={120} y={54} ok={false} />
    </>
  ),
};
