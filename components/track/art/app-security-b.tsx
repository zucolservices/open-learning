import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Application Security track (modules 12–22), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const BAD = "fill-bad/20 stroke-bad";

export const appSecurityArtB: ArtMap = {
  "access-control": () => (
    <>
      <rect
        x={18}
        y={24}
        width={56}
        height={16}
        rx={2}
        className="fill-surface-2/70 stroke-line-strong"
      />
      <text x={24} y={35} className="fill-fg font-mono text-[7px]">
        /invoice/1041
      </text>
      <rect
        x={18}
        y={46}
        width={56}
        height={16}
        rx={2}
        className={`${BAD} ${A} group-hover:translate-x-1`}
      />
      <text x={24} y={57} className="fill-bad font-mono text-[7px]">
        /invoice/1042
      </text>
      <Arrow x1={78} y1={54} x2={96} y2={54} />
      <text x={100} y={50} className="fill-muted text-[6px]">
        someone
      </text>
      <text x={100} y={59} className="fill-muted text-[6px]">
        else&apos;s data
      </text>
      <text x={18} y={82} className={T}>
        logged in ≠ allowed
      </text>
    </>
  ),

  "oauth-oidc": () => (
    <>
      {["You", "App", "Server"].map((l, i) => (
        <g key={l}>
          <text x={24 + i * 56} y={20} textAnchor="middle" className="fill-fg text-[6px]">
            {l}
          </text>
          <line
            x1={24 + i * 56}
            y1={24}
            x2={24 + i * 56}
            y2={64}
            className="stroke-line"
            strokeDasharray="2 2"
          />
        </g>
      ))}
      {[
        [0, 1, 30],
        [1, 2, 40],
        [2, 1, 50],
      ].map(([a, b, y], i) => (
        <g key={i} className={i === 2 ? `${A}` : ""}>
          <line
            x1={24 + (a as number) * 56}
            y1={y as number}
            x2={24 + (b as number) * 56}
            y2={y as number}
            className="stroke-accent"
            strokeWidth={1.4}
          />
        </g>
      ))}
      <text x={14} y={80} className={T}>
        a valet key for data
      </text>
    </>
  ),

  "csrf-cors": () => (
    <>
      <rect
        x={14}
        y={24}
        width={40}
        height={20}
        rx={3}
        className="stroke-bad fill-none"
        strokeDasharray="3 2"
      />
      <text x={34} y={37} textAnchor="middle" className="fill-bad text-[6px]">
        evil page
      </text>
      <Arrow x1={56} y1={38} x2={96} y2={38} cls="stroke-bad" className={A} />
      <Svc x={100} y={28} w={44} h={20} label="your bank" cls={HOT} />
      <text x={60} y={30} className="fill-muted text-[6px]">
        +🍪
      </text>
      <text x={14} y={70} className="fill-muted text-[6px]">
        SameSite · token blocks it
      </text>
      <text x={14} y={84} className={T}>
        who may talk to whom
      </text>
    </>
  ),

  "security-headers": () => (
    <>
      <rect
        x={18}
        y={20}
        width={124}
        height={44}
        rx={3}
        className="fill-surface-2/50 stroke-line-strong"
      />
      {["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options"].map(
        (h, i) => (
          <g key={h} className={i === 0 ? `${A} group-hover:translate-x-1` : ""}>
            <rect
              x={24}
              y={26 + i * 11}
              width={8}
              height={8}
              rx={1}
              className={i === 0 ? "fill-good" : "fill-viz-data/50"}
            />
            <text x={36} y={33 + i * 11} className="fill-fg font-mono text-[6px]">
              {h}
            </text>
          </g>
        ),
      )}
      <text x={18} y={82} className={T}>
        labels for the browser
      </text>
    </>
  ),

  ssrf: () => (
    <>
      <Svc x={14} y={30} w={28} h={16} label="you" />
      <Arrow x1={44} y1={38} x2={60} y2={38} />
      <Svc
        x={64}
        y={28}
        w={32}
        h={20}
        label="server"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Arrow x1={98} y1={30} x2={118} y2={22} cls="stroke-bad" />
      <rect x={118} y={14} width={30} height={14} rx={2} className={BAD} />
      <text x={133} y={23} textAnchor="middle" className="fill-bad text-[5.5px]">
        metadata
      </text>
      <text x={14} y={78} className={T}>
        the server fetches for you
      </text>
    </>
  ),

  "crypto-tls": () => (
    <>
      <rect x={16} y={26} width={48} height={30} rx={2} className={`fill-bad/10 stroke-bad`} />
      <text x={40} y={40} textAnchor="middle" className="fill-bad text-[6px]">
        pass=…
      </text>
      <text x={40} y={50} textAnchor="middle" className="fill-bad text-[6px]">
        http
      </text>
      <Arrow x1={68} y1={42} x2={84} y2={42} />
      <rect
        x={88}
        y={26}
        width={56}
        height={30}
        rx={2}
        className={`fill-good/10 stroke-good ${A}`}
      />
      <text x={116} y={40} textAnchor="middle" className="fill-good text-[7px]">
        🔒 ⟨sealed⟩
      </text>
      <text x={116} y={50} textAnchor="middle" className="fill-good text-[6px]">
        https
      </text>
      <text x={16} y={78} className={T}>
        postcard vs sealed letter
      </text>
    </>
  ),

  secrets: () => (
    <>
      <rect
        x={30}
        y={40}
        width={60}
        height={28}
        rx={2}
        className="fill-surface-2/70 stroke-line-strong"
      />
      <text x={60} y={57} textAnchor="middle" className="text-[16px]">
        🚪
      </text>
      <text x={48} y={64} className={`text-[11px] ${A} group-hover:-translate-y-1`}>
        🗝️
      </text>
      <text x={100} y={46} className="fill-bad font-mono text-[6px]">
        API_KEY=
      </text>
      <text x={100} y={56} className="fill-bad font-mono text-[6px]">
        sk_live…
      </text>
      <line x1={98} y1={50} x2={128} y2={50} className="stroke-bad" strokeWidth={1} />
      <text x={16} y={82} className={T}>
        not under the mat
      </text>
    </>
  ),

  "app-security/supply-chain": () => (
    <>
      <text x={80} y={20} textAnchor="middle" className="fill-accent font-mono text-[7px]">
        your app
      </text>
      {[
        [80, 30, 50, 44],
        [80, 30, 110, 44],
        [50, 44, 34, 60],
        [50, 44, 66, 60],
        [110, 44, 96, 60],
        [110, 44, 128, 60],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="stroke-line-strong"
          strokeWidth={1}
        />
      ))}
      {[
        [50, 44],
        [110, 44],
        [34, 60],
        [66, 60],
        [96, 60],
        [128, 60],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={4}
          className={
            i === 4 ? `${BAD} ${A} group-hover:scale-150` : "fill-viz-data/50 stroke-viz-data"
          }
        />
      ))}
      <text x={16} y={84} className={T}>
        a flaw three levels down
      </text>
    </>
  ),

  "security-testing": () => (
    <>
      {["commit", "PR", "build", "deploy"].map((l, i) => (
        <g key={l}>
          <Svc
            x={14 + i * 34}
            y={30}
            w={28}
            h={14}
            label={l}
            cls={i === 1 ? HOT : "fill-surface-2/60 stroke-line-strong"}
            className={i === 1 ? `${A} group-hover:-translate-y-1` : ""}
          />
          {i < 3 && <Arrow x1={42 + i * 34} y1={37} x2={48 + i * 34} y2={37} />}
        </g>
      ))}
      {["SAST", "DAST", "SCA"].map((l, i) => (
        <text key={l} x={20 + i * 40} y={58} className="fill-accent font-mono text-[6px]">
          {l}
        </text>
      ))}
      <text x={14} y={80} className={T}>
        catch bugs first
      </text>
    </>
  ),

  "detect-respond": () => (
    <>
      <polyline
        points="16,56 34,54 52,55 70,30 88,34 106,31 128,33 146,32"
        className="stroke-viz-data fill-none"
        strokeWidth={1.4}
      />
      <circle cx={70} cy={30} r={4} className={`fill-bad ${A} group-hover:scale-150`} />
      <text x={64} y={22} className="fill-bad text-[6px]">
        alert!
      </text>
      <text x={16} y={72} className="fill-muted text-[6px]">
        log → alert → respond
      </text>
      <text x={16} y={86} className={T}>
        notice the smoke
      </text>
    </>
  ),

  "capstone-appsec": () => (
    <>
      <text x={80} y={20} textAnchor="middle" className="fill-accent font-mono text-[7px]">
        PayLite
      </text>
      {["identity", "cards", "page", "pipeline", "watch"].map((l, i) => (
        <g key={l}>
          <Svc
            x={10 + i * 29}
            y={30}
            w={26}
            h={14}
            label={l}
            cls={i === 4 ? HOT : i % 2 ? DATA : "fill-surface-2/60 stroke-line-strong"}
            className={i === 4 ? `${A} group-hover:scale-110` : ""}
          />
        </g>
      ))}
      <text x={10} y={60} className="fill-muted text-[6px]">
        threat-model → defend → respond
      </text>
      <text x={10} y={82} className={T}>
        the whole track, one app
      </text>
    </>
  ),
};
