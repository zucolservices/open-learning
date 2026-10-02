import { A, type ArtMap } from "./kit";
import { Arrow, Db, T } from "./streaming-data-a";

/** Card illustrations for the Kubernetes track (modules 1–12), keyed by module slug. */

/** A node: a rounded box with a label and room for pods. */
export function Node({
  x,
  y,
  w = 40,
  h = 34,
  label,
  cls = "fill-surface-2/60 stroke-line-strong",
  className = "",
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  cls?: string;
  className?: string;
}) {
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={h} rx={4} className={cls} strokeWidth={1.2} />
      {label && (
        <text x={x + 4} y={y + 8} className="fill-muted font-mono text-[6px]">
          {label}
        </text>
      )}
    </g>
  );
}

/** A pod: a small rounded square. */
export function Pod({
  x,
  y,
  s = 9,
  cls = "fill-viz-compute/30 stroke-viz-compute",
  className = "",
}: {
  x: number;
  y: number;
  s?: number;
  cls?: string;
  className?: string;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={s}
      height={s}
      rx={2}
      className={`${cls} ${className}`}
      strokeWidth={1.2}
    />
  );
}

export const kubernetesArtA: ArtMap = {
  "why-kubernetes": () => (
    <>
      {Array.from({ length: 10 }, (_, i) => (
        <rect
          key={i}
          x={14 + (i % 5) * 16}
          y={26 + Math.floor(i / 5) * 22}
          width={12}
          height={16}
          rx={2}
          className={
            i === 6
              ? "fill-viz-remove/30 stroke-viz-remove"
              : "fill-surface-2/60 stroke-line-strong"
          }
          strokeWidth={1.1}
        />
      ))}
      <Arrow x1={98} y1={46} x2={112} y2={46} />
      <circle
        cx={132}
        cy={46}
        r={16}
        className={`stroke-viz-compute ${A} group-hover:rotate-45`}
        strokeWidth={1.6}
      />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={132 + Math.cos(a) * 6}
            y1={46 + Math.sin(a) * 6}
            x2={132 + Math.cos(a) * 16}
            y2={46 + Math.sin(a) * 16}
            className="stroke-viz-compute"
            strokeWidth={1.4}
          />
        );
      })}
      <text x={56} y={84} textAnchor="middle" className={T}>
        by hand
      </text>
      <text x={132} y={76} textAnchor="middle" className={T}>
        declared
      </text>
    </>
  ),

  "desired-state": () => (
    <>
      <rect
        x={14}
        y={30}
        width={44}
        height={36}
        rx={5}
        className="fill-viz-meta/15 stroke-viz-meta"
        strokeWidth={1.3}
      />
      <text x={36} y={45} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        want: 3
      </text>
      <rect
        x={102}
        y={30}
        width={44}
        height={36}
        rx={5}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.3}
      />
      <text x={124} y={45} textAnchor="middle" className="fill-fg font-mono text-[7px]">
        have: 2
      </text>
      <Pod x={108} y={50} />
      <Pod x={120} y={50} />
      <Pod
        x={132}
        y={50}
        cls="fill-viz-add/30 stroke-viz-add"
        className={`${A} opacity-30 group-hover:opacity-100`}
      />
      <path
        d="M58 40q22-18 44 0M102 56q-22 18-44 0"
        className="stroke-accent"
        strokeWidth={1.4}
        strokeDasharray="3 2"
      />
      <path d="M98 38l4 2-1 4M62 58l-4-2 1-4" className="stroke-accent" strokeWidth={1.4} />
      <text x={80} y={88} textAnchor="middle" className={T}>
        reconcile
      </text>
    </>
  ),

  "cluster-anatomy": () => (
    <>
      <rect
        x={10}
        y={18}
        width={60}
        height={66}
        rx={5}
        className="stroke-line-strong"
        strokeDasharray="3 2"
      />
      <rect
        x={20}
        y={40}
        width={40}
        height={16}
        rx={3}
        className="fill-accent/20 stroke-accent"
        strokeWidth={1.3}
      />
      <text x={40} y={51} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        API
      </text>
      <Db x={40} y={64} w={20} h={10} />
      <rect
        x={18}
        y={24}
        width={20}
        height={10}
        rx={2}
        className="fill-surface-2 stroke-line-strong"
      />
      <rect
        x={42}
        y={24}
        width={20}
        height={10}
        rx={2}
        className="fill-surface-2 stroke-line-strong"
      />
      {[0, 1, 2].map((n) => (
        <g key={n} className={n === 1 ? `${A} group-hover:translate-x-1` : ""}>
          <Node x={98} y={14 + n * 26} w={50} h={22} />
          <Pod x={104} y={21 + n * 26} />
          <Pod x={116} y={21 + n * 26} />
          <path
            d={`M60 48L98 ${25 + n * 26}`}
            className="stroke-line-strong"
            strokeDasharray="2 2"
          />
        </g>
      ))}
    </>
  ),

  pods: () => (
    <>
      <rect
        x={34}
        y={20}
        width={92}
        height={60}
        rx={10}
        className="fill-accent/10 stroke-accent"
        strokeWidth={1.6}
      />
      <text x={42} y={32} className="fill-muted font-mono text-[6.5px]">
        pod · 10.1.2.7
      </text>
      <rect
        x={44}
        y={38}
        width={32}
        height={24}
        rx={4}
        className="fill-viz-compute/25 stroke-viz-compute"
        strokeWidth={1.2}
      />
      <rect
        x={84}
        y={38}
        width={32}
        height={24}
        rx={4}
        className={`fill-viz-meta/25 stroke-viz-meta ${A} group-hover:-translate-y-1`}
        strokeWidth={1.2}
      />
      <rect
        x={44}
        y={66}
        width={72}
        height={8}
        rx={2}
        className="fill-viz-data/25 stroke-viz-data"
        strokeWidth={1}
      />
      <text x={80} y={72.5} textAnchor="middle" className="fill-fg font-mono text-[5.5px]">
        shared volume
      </text>
    </>
  ),

  deployments: () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <Pod
          key={`o${i}`}
          x={22 + i * 14}
          y={34}
          s={10}
          cls={
            i < 3
              ? "fill-viz-idle/30 stroke-viz-idle"
              : "fill-surface-2 stroke-line-strong opacity-30"
          }
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Pod
          key={`n${i}`}
          x={22 + i * 14}
          y={58}
          s={10}
          cls={
            i < 2 ? "fill-accent/30 stroke-accent" : "fill-surface-2 stroke-line-strong opacity-30"
          }
          className={i === 2 ? `${A} group-hover:opacity-100` : ""}
        />
      ))}
      <text x={98} y={42} className={T}>
        v1
      </text>
      <text x={98} y={66} className="fill-accent font-mono text-[7px]">
        v2
      </text>
      <path d="M118 40v18" className="stroke-line-strong" strokeWidth={1.2} />
      <path d="M114 54l4 4 4-4" className="stroke-line-strong" strokeWidth={1.2} />
      <text x={22} y={88} className={T}>
        rolling update
      </text>
    </>
  ),

  "health-checks": () => (
    <>
      <path
        d="M14 56h22l6-16 8 30 8-22 6 8h20"
        className={`stroke-viz-add ${A} group-hover:translate-x-1`}
        strokeWidth={1.8}
      />
      {[
        ["live", 104, "fill-viz-add/20 stroke-viz-add"],
        ["ready", 104, "fill-viz-compute/20 stroke-viz-compute"],
        ["start", 104, "fill-viz-meta/20 stroke-viz-meta"],
      ].map(([l, x, cls], i) => (
        <g key={l as string}>
          <rect
            x={x as number}
            y={26 + i * 18}
            width={44}
            height={13}
            rx={3}
            className={cls as string}
            strokeWidth={1.1}
          />
          <text
            x={(x as number) + 22}
            y={35 + i * 18}
            textAnchor="middle"
            className="fill-fg font-mono text-[6.5px]"
          >
            {l as string}ness
          </text>
        </g>
      ))}
    </>
  ),

  "workload-controllers": () => (
    <>
      {[
        ["Deploy", 14, 22],
        ["StatefulSet", 84, 22],
        ["DaemonSet", 14, 58],
        ["(Cron)Job", 84, 58],
      ].map(([l, x, y], i) => (
        <g key={l as string} className={i === 1 ? `${A} group-hover:-translate-y-1` : ""}>
          <rect
            x={x as number}
            y={y as number}
            width={62}
            height={26}
            rx={4}
            className="fill-surface-2/60 stroke-line-strong"
            strokeWidth={1.1}
          />
          <text
            x={(x as number) + 5}
            y={(y as number) + 9}
            className="fill-muted font-mono text-[6px]"
          >
            {l as string}
          </text>
          {i === 1
            ? ["db-0", "db-1"].map((n, k) => (
                <text
                  key={n}
                  x={(x as number) + 6 + k * 26}
                  y={(y as number) + 20}
                  className="fill-fg font-mono text-[6px]"
                >
                  {n}
                </text>
              ))
            : [0, 1, 2].map((k) => (
                <Pod
                  key={k}
                  x={(x as number) + 6 + k * 13}
                  y={(y as number) + 13}
                  s={8}
                  cls={i === 3 && k < 2 ? "fill-viz-add/30 stroke-viz-add" : undefined}
                />
              ))}
        </g>
      ))}
    </>
  ),

  "services-dns": () => (
    <>
      <rect
        x={14}
        y={38}
        width={46}
        height={20}
        rx={10}
        className="fill-accent/20 stroke-accent"
        strokeWidth={1.4}
      />
      <text x={37} y={50} textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        payments
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i} className={i === 2 ? `${A} group-hover:translate-x-1` : ""}>
          <Arrow x1={62} y1={48} x2={102} y2={26 + i * 22} cls="stroke-line-strong" />
          <Pod x={106} y={21 + i * 22} s={11} />
          <text x={122} y={29 + i * 22} className={T}>
            app=payments
          </text>
        </g>
      ))}
    </>
  ),

  "ingress-gateway": () => (
    <>
      <path d="M10 48h30" className="stroke-line-strong" strokeWidth={1.4} />
      <rect
        x={40}
        y={30}
        width={30}
        height={36}
        rx={5}
        className={`fill-accent/20 stroke-accent ${A} group-hover:scale-105`}
        strokeWidth={1.4}
      />
      <text x={55} y={51} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        gateway
      </text>
      {[
        ["shop/", 22],
        ["shop/api", 48],
        ["blog/", 74],
      ].map(([l, y]) => (
        <g key={l as string}>
          <Arrow x1={70} y1={48} x2={102} y2={y as number} />
          <rect
            x={104}
            y={(y as number) - 7}
            width={44}
            height={14}
            rx={3}
            className="fill-surface-2/60 stroke-line-strong"
          />
          <text
            x={126}
            y={(y as number) + 2}
            textAnchor="middle"
            className="fill-fg font-mono text-[6px]"
          >
            {l as string}
          </text>
        </g>
      ))}
    </>
  ),

  "network-policies": () => (
    <>
      {[
        ["web", 18, "fill-viz-compute/25 stroke-viz-compute"],
        ["api", 66, "fill-viz-compute/25 stroke-viz-compute"],
        ["db", 114, "fill-viz-data/25 stroke-viz-data"],
      ].map(([l, x, cls]) => (
        <g key={l as string}>
          <rect
            x={x as number}
            y={34}
            width={28}
            height={22}
            rx={4}
            className={cls as string}
            strokeWidth={1.2}
          />
          <text
            x={(x as number) + 14}
            y={48}
            textAnchor="middle"
            className="fill-fg font-mono text-[6.5px]"
          >
            {l as string}
          </text>
        </g>
      ))}
      <Arrow x1={46} y1={45} x2={64} y2={45} cls="stroke-viz-add" />
      <Arrow x1={94} y1={45} x2={112} y2={45} cls="stroke-viz-add" />
      <path
        d="M32 58q48 30 96 0"
        className={`stroke-viz-remove ${A} group-hover:-translate-y-1`}
        strokeDasharray="3 2"
        strokeWidth={1.3}
      />
      <path d="M76 70l6 6M82 70l-6 6" className="stroke-viz-remove" strokeWidth={1.6} />
    </>
  ),

  "config-secrets": () => (
    <>
      <rect
        x={16}
        y={24}
        width={52}
        height={50}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={22} y={35} className="fill-muted font-mono text-[6px]">
        ConfigMap
      </text>
      <text x={22} y={48} className="fill-fg font-mono text-[6px]">
        LOG=info
      </text>
      <rect
        x={90}
        y={24}
        width={56}
        height={50}
        rx={4}
        className="fill-viz-meta/15 stroke-viz-meta"
        strokeWidth={1.2}
      />
      <text x={96} y={35} className="fill-muted font-mono text-[6px]">
        Secret
      </text>
      <text x={96} y={48} className={`fill-fg font-mono text-[6px] ${A} group-hover:opacity-0`}>
        UjRuZ29s…
      </text>
      <text
        x={96}
        y={60}
        className={`fill-viz-remove font-mono text-[6px] ${A} opacity-0 group-hover:opacity-100`}
      >
        R4ngoli#…
      </text>
      <text x={96} y={70} className="fill-muted font-mono text-[5.5px]">
        not encrypted
      </text>
    </>
  ),

  "persistent-storage": () => (
    <>
      <Node x={14} y={22} w={44} h={30} label="node-1" />
      <Node x={66} y={22} w={44} h={30} label="node-2" />
      <Pod x={80} y={34} s={11} className={`${A} group-hover:-translate-x-1`} />
      <Db x={86} y={66} w={26} h={12} />
      <path d="M85 46v16" className="stroke-viz-data" strokeDasharray="2 2" />
      <rect
        x={10}
        y={16}
        width={106}
        height={70}
        rx={6}
        className="stroke-line-strong"
        strokeDasharray="3 2"
      />
      <text x={14} y={94} className={T}>
        zone a
      </text>
      <text x={124} y={50} className={T}>
        PVC
      </text>
    </>
  ),
};
