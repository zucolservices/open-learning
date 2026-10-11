import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Cyl } from "./backend-a";

/** Card illustrations for the Backend track (modules 12–22), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

export const backendArtB: ArtMap = {
  "sign-in": () => (
    <>
      <rect
        x={60}
        y={20}
        width={40}
        height={50}
        rx={8}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <circle
        cx={80}
        cy={42}
        r={10}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${74 + i * 4} 38 q2 6 0 10`}
          className="stroke-accent fill-none"
          strokeWidth={0.9}
        />
      ))}
      <text x={14} y={90} className={T}>
        passkeys, hashes, sessions
      </text>
    </>
  ),

  authorization: () => (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={24 + i * 40}
          y={28}
          width={30}
          height={40}
          rx={3}
          className={i === 1 ? `${GOOD} ${A} group-hover:scale-105` : BAD}
          strokeWidth={1.1}
        />
      ))}
      <text x={79} y={52} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        yours
      </text>
      <text x={14} y={88} className={T}>
        check every record
      </text>
    </>
  ),

  "background-jobs": () => (
    <>
      <Svc x={12} y={38} w={28} h={16} label="API" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={52 + i * 12}
          y={40}
          width={9}
          height={12}
          rx={1.5}
          className={i === 0 ? `${HOT} ${A} group-hover:scale-110` : DATA}
          strokeWidth={1}
        />
      ))}
      <Svc x={112} y={38} w={36} h={16} label="worker" cls={GOOD} />
      <Arrow x1={42} y1={46} x2={50} y2={46} />
      <Arrow x1={101} y1={46} x2={110} y2={46} />
      <text x={12} y={80} className={T}>
        answer fast, work later
      </text>
    </>
  ),

  "webhooks-events": () => (
    <>
      <Svc x={14} y={38} w={36} h={16} label="café" />
      <rect
        x={66}
        y={36}
        width={28}
        height={20}
        rx={2}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.2}
      />
      <path d="M66 36 l14 10 l14 -10" className="stroke-accent fill-none" strokeWidth={1} />
      <Svc x={110} y={38} w={38} h={16} label="partner" />
      <Arrow x1={52} y1={46} x2={64} y2={46} />
      <Arrow x1={96} y1={46} x2={108} y2={46} />
      <text x={14} y={80} className={T}>
        signed, retried, deduped
      </text>
    </>
  ),

  "live-updates": () => (
    <>
      <Svc
        x={14}
        y={38}
        w={34}
        h={16}
        label="server"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      {[24, 46, 68].map((y) => (
        <g key={y}>
          <Arrow x1={50} y1={46} x2={104} y2={y} cls="stroke-accent" />
          <rect x={108} y={y - 7} width={14} height={14} rx={3} className={DATA} strokeWidth={1} />
        </g>
      ))}
      <text x={14} y={92} className={T}>
        push, don&apos;t poll
      </text>
    </>
  ),

  "file-uploads": () => (
    <>
      <rect
        x={18}
        y={30}
        width={26}
        height={32}
        rx={2}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <Arrow x1={46} y1={46} x2={90} y2={46} cls="stroke-accent" />
      <rect
        x={96}
        y={30}
        width={44}
        height={32}
        rx={4}
        className={`${GOOD} ${A} group-hover:scale-105`}
        strokeWidth={1.1}
      />
      <text x={118} y={49} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        bucket
      </text>
      <text x={18} y={82} className={T}>
        pre-signed, checked, scanned
      </text>
    </>
  ),

  "rate-limiting": () => (
    <>
      <path
        d="M50 24 h60 l-10 44 h-40 z"
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={62 + i * 12}
          cy={58}
          r={4}
          className={i < 2 ? `${HOT} ${A} group-hover:scale-125` : "fill-surface stroke-line"}
          strokeWidth={1}
        />
      ))}
      <text x={14} y={88} className={T}>
        token bucket per client
      </text>
    </>
  ),

  resilience: () => (
    <>
      <Svc x={14} y={38} w={30} h={16} label="app" cls={GOOD} />
      <path
        d="M50 46 h18 l8 -8"
        className={`stroke-accent ${A} group-hover:rotate-6`}
        strokeWidth={1.8}
        fill="none"
      />
      <line x1={84} y1={46} x2={100} y2={46} className="stroke-accent" strokeWidth={1.8} />
      <Svc x={104} y={38} w={44} h={16} label="payments" cls={BAD} />
      <text x={14} y={80} className={T}>
        timeouts, retries, breakers
      </text>
    </>
  ),

  "logs-health": () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={20}
          y={20 + i * 11}
          width={[100, 80, 110, 70][i]}
          height={6}
          rx={3}
          className={i === 2 ? `fill-accent/60 ${A} group-hover:scale-x-105` : "fill-viz-idle/50"}
        />
      ))}
      <circle cx={136} cy={30} r={7} className={GOOD} strokeWidth={1.2} />
      <text x={20} y={84} className={T}>
        logs · liveness · readiness
      </text>
    </>
  ),

  "deploying-backend": () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={24 + i * 30}
          y={36}
          width={24}
          height={20}
          rx={3}
          className={i === 0 ? `${HOT} ${A} group-hover:scale-110` : DATA}
          strokeWidth={1.1}
        />
      ))}
      <text x={36} y={68} textAnchor="middle" className="fill-accent font-mono text-[6px]">
        5%
      </text>
      <text x={24} y={86} className={T}>
        canary, then everyone
      </text>
    </>
  ),

  "capstone-backend": () => (
    <>
      <Svc x={12} y={40} w={26} h={14} label="LB" />
      <Svc
        x={48}
        y={40}
        w={34}
        h={14}
        label="orders"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Cyl x={96} y={34} />
      <Svc x={128} y={22} w={24} h={12} label="queue" />
      <Svc x={128} y={58} w={24} h={12} label="pay" />
      <Arrow x1={40} y1={47} x2={46} y2={47} />
      <Arrow x1={84} y1={47} x2={94} y2={47} />
      <text x={12} y={90} className={T}>
        an order service, end to end
      </text>
    </>
  ),
};
