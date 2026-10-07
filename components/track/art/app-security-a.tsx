import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Application Security track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const BAD = "fill-bad/20 stroke-bad";
const GOOD = "fill-good/20 stroke-good";

export const appSecurityArtA: ArtMap = {
  "why-appsec": () => (
    <>
      <rect
        x={18}
        y={20}
        width={120}
        height={52}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      {[28, 44, 60, 92, 108].map((x) => (
        <rect key={x} x={x} y={30} width={12} height={32} rx={1.5} className="fill-viz-data/40" />
      ))}
      <rect
        x={74}
        y={30}
        width={12}
        height={32}
        rx={1.5}
        className={`${BAD} ${A} group-hover:scale-110`}
      />
      <text x={80} y={50} textAnchor="middle" className="fill-bad text-[6px]">
        1
      </text>
      <text x={18} y={88} className={T}>
        one unpatched window
      </text>
    </>
  ),

  "threat-modelling": () => (
    <>
      <rect
        x={14}
        y={30}
        width={26}
        height={16}
        rx={2}
        className="fill-surface stroke-line-strong"
      />
      <circle cx={80} cy={44} r={14} className={`fill-surface ${HOT} ${A} group-hover:scale-105`} />
      <text x={80} y={46} textAnchor="middle" className="fill-fg text-[6px]">
        app
      </text>
      <Arrow x1={42} y1={40} x2={64} y2={42} />
      <line x1={108} y1={40} x2={128} y2={30} className="stroke-line-strong" strokeWidth={1.2} />
      <rect x={122} y={54} width={26} height={14} className="fill-surface stroke-line-strong" />
      <rect
        x={58}
        y={20}
        width={76}
        height={50}
        rx={4}
        className="stroke-bad fill-none"
        strokeDasharray="4 3"
      />
      <text x={118} y={24} className="fill-bad text-[6px]">
        trust boundary
      </text>
      {["S", "T", "R"].map((l, i) => (
        <text key={l} x={18 + i * 9} y={66} className="fill-accent font-mono text-[7px]">
          {l}
        </text>
      ))}
      <text x={14} y={88} className={T}>
        what could go wrong?
      </text>
    </>
  ),

  "secure-design": () => (
    <>
      {[30, 22, 14].map((r, i) => (
        <circle
          key={r}
          cx={80}
          cy={44}
          r={r}
          className={i === 0 ? `stroke-bad fill-none ${A}` : "stroke-line-strong fill-none"}
          strokeDasharray={i === 0 ? "4 3" : undefined}
          strokeWidth={i === 2 ? 2 : 1.2}
        />
      ))}
      <circle cx={80} cy={44} r={6} className={GOOD} />
      <circle cx={80} cy={14} r={2.5} className="fill-accent" />
      <text x={14} y={88} className={T}>
        layers in the way
      </text>
    </>
  ),

  "owasp-top-ten": () => (
    <>
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} className={i === 0 ? `${A} group-hover:translate-x-1` : ""}>
          <rect
            x={18}
            y={16 + i * 6.2}
            width={i === 0 ? 118 : 70 - i * 5}
            height={4.4}
            rx={1}
            className={i === 0 ? "fill-accent" : "fill-viz-data/50"}
          />
        </g>
      ))}
      <text x={140} y={20} textAnchor="end" className="fill-accent font-mono text-[6px]">
        A01
      </text>
      <text x={18} y={88} className={T}>
        the top ten risks
      </text>
    </>
  ),

  "sql-injection": () => (
    <>
      <rect
        x={18}
        y={26}
        width={124}
        height={16}
        rx={2}
        className="fill-surface-2/70 stroke-line-strong"
      />
      <text x={24} y={37} className="fill-viz-compute font-mono text-[6px]">
        SELECT * WHERE name =
      </text>
      <rect
        x={100}
        y={28}
        width={40}
        height={12}
        rx={1.5}
        className={`${BAD} ${A} group-hover:scale-105`}
      />
      <text x={104} y={37} className="fill-bad font-mono text-[6px]">
        &apos; OR 1=1
      </text>
      <rect
        x={18}
        y={48}
        width={124}
        height={16}
        rx={2}
        className="fill-surface-2/70 stroke-line-strong"
      />
      <text x={24} y={59} className="fill-viz-compute font-mono text-[6px]">
        ... name =
      </text>
      <rect x={66} y={50} width={14} height={12} rx={1.5} className={GOOD} />
      <text x={70} y={59} className="fill-good font-mono text-[6px]">
        ?
      </text>
      <text x={18} y={84} className={T}>
        data, not command
      </text>
    </>
  ),

  xss: () => (
    <>
      <Svc x={20} y={24} w={52} h={16} label="comment" cls={DATA} />
      <Arrow x1={74} y1={32} x2={92} y2={32} />
      <rect
        x={96}
        y={20}
        width={48}
        height={40}
        rx={3}
        className="fill-surface stroke-line-strong"
      />
      <text x={120} y={30} textAnchor="middle" className="fill-muted text-[6px]">
        page
      </text>
      <rect
        x={104}
        y={36}
        width={32}
        height={10}
        rx={1.5}
        className={`${BAD} ${A} group-hover:scale-110`}
      />
      <text x={120} y={43} textAnchor="middle" className="fill-bad font-mono text-[6px]">
        script
      </text>
      <text x={20} y={80} className={T}>
        runs in your browser
      </text>
    </>
  ),

  "other-injection": () => (
    <>
      <Svc x={60} y={14} w={40} h={14} label="input" cls={DATA} />
      {[
        ["shell", 14],
        ["template", 58],
        ["NoSQL", 108],
      ].map(([l, x], i) => (
        <g key={l as string}>
          <line x1={80} y1={28} x2={(x as number) + 18} y2={44} className="stroke-line-strong" />
          <Svc
            x={x as number}
            y={44}
            w={36}
            h={13}
            label={l as string}
            cls={i === 1 ? `${BAD}` : "fill-surface-2/60 stroke-line-strong"}
            className={i === 1 ? `${A} group-hover:scale-110` : ""}
          />
        </g>
      ))}
      <text x={14} y={80} className={T}>
        one bug, many interpreters
      </text>
    </>
  ),

  "input-handling": () => (
    <>
      <Arrow x1={14} y1={44} x2={40} y2={44} />
      <rect
        x={44}
        y={28}
        width={16}
        height={32}
        className="stroke-accent fill-none"
        strokeWidth={2}
      />
      <text x={52} y={24} textAnchor="middle" className="fill-accent text-[6px]">
        ✓
      </text>
      {[
        ["jpg", true],
        ["php", false],
        ["png", true],
      ].map(([t, ok], i) => (
        <g key={t as string} className={!ok ? `${A} group-hover:translate-x-2` : ""}>
          <rect
            x={70}
            y={26 + i * 13}
            width={30}
            height={10}
            rx={1.5}
            className={ok ? GOOD : BAD}
          />
          <text x={85} y={34 + i * 13} textAnchor="middle" className="fill-fg font-mono text-[6px]">
            {t as string}
          </text>
        </g>
      ))}
      <text x={14} y={80} className={T}>
        allow-list at the gate
      </text>
    </>
  ),

  passwords: () => (
    <>
      <text x={20} y={30} className="fill-muted font-mono text-[7px]">
        hunter2
      </text>
      <Arrow x1={58} y1={27} x2={74} y2={27} />
      <circle
        cx={88}
        cy={27}
        r={6}
        className={`fill-viz-compute/40 stroke-viz-compute ${A} group-hover:rotate-90`}
      />
      <text x={100} y={30} className="fill-muted font-mono text-[6px]">
        a3f…salt
      </text>
      <rect x={20} y={44} width={120} height={8} rx={2} className="fill-surface-2" />
      <rect x={20} y={44} width={30} height={8} rx={2} className="fill-good" />
      <text x={20} y={66} className="fill-muted text-[6px]">
        slow hash: years to crack
      </text>
      <text x={20} y={82} className={T}>
        store the scramble
      </text>
    </>
  ),

  "mfa-passkeys": () => (
    <>
      <Svc x={14} y={30} w={30} h={16} label="pass" cls={DATA} />
      <text x={56} y={42} className="fill-muted text-[8px]">
        +
      </text>
      <rect
        x={66}
        y={28}
        width={22}
        height={22}
        rx={3}
        className={`${GOOD} ${A} group-hover:scale-110`}
      />
      <text x={77} y={43} textAnchor="middle" className="fill-good text-[9px]">
        🔑
      </text>
      <rect
        x={100}
        y={26}
        width={44}
        height={26}
        rx={3}
        className="stroke-bad fill-none"
        strokeDasharray="3 2"
      />
      <text x={122} y={41} textAnchor="middle" className="fill-bad text-[6px]">
        fake site
      </text>
      <line x1={88} y1={39} x2={100} y2={39} className="stroke-bad" strokeWidth={1.5} />
      <line x1={94} y1={34} x2={100} y2={44} className="stroke-bad" strokeWidth={1.5} />
      <text x={14} y={80} className={T}>
        a key that fits one door
      </text>
    </>
  ),

  "sessions-tokens": () => (
    <>
      <rect
        x={30}
        y={26}
        width={60}
        height={30}
        rx={3}
        className={`fill-accent/10 stroke-accent ${A} group-hover:rotate-3`}
      />
      <text x={60} y={40} textAnchor="middle" className="fill-accent font-mono text-[8px]">
        47
      </text>
      <text x={60} y={50} textAnchor="middle" className="fill-muted text-[6px]">
        cloakroom
      </text>
      <text x={100} y={36} className="fill-muted text-[6px]">
        Secure
      </text>
      <text x={100} y={46} className="fill-muted text-[6px]">
        HttpOnly
      </text>
      <text x={100} y={56} className="fill-muted text-[6px]">
        SameSite
      </text>
      <text x={14} y={80} className={T}>
        whoever holds it is you
      </text>
    </>
  ),
};
