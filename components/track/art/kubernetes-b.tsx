import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Node, Pod } from "./kubernetes-a";

/** Card illustrations for the Kubernetes track (modules 13–23). "kubernetes/autoscaling" avoids System Design's slug. */

export const kubernetesArtB: ArtMap = {
  "requests-limits": () => (
    <>
      {[0, 1].map((n) => (
        <g key={n}>
          <Node x={16 + n * 66} y={22} w={58} h={56} label={`node-${n + 1}`} />
          <rect
            x={22 + n * 66}
            y={34}
            width={46}
            height={n === 0 ? 34 : 20}
            rx={2}
            className="fill-viz-compute/20 stroke-viz-compute"
            strokeDasharray="2 2"
          />
          <rect
            x={22 + n * 66}
            y={56}
            width={46}
            height={12}
            rx={2}
            className={`fill-viz-compute/50 ${n === 1 ? `${A} group-hover:-translate-y-1` : ""}`}
          />
        </g>
      ))}
      <text x={16} y={92} className={T}>
        requested (dashed) vs used
      </text>
    </>
  ),

  scheduler: () => (
    <>
      <Pod
        x={14}
        y={42}
        s={14}
        cls="fill-accent/30 stroke-accent"
        className={`${A} group-hover:translate-x-2`}
      />
      {[0, 1, 2].map((n) => (
        <g key={n}>
          <Arrow
            x1={32}
            y1={49}
            x2={74}
            y2={24 + n * 25}
            cls={n === 1 ? "stroke-viz-add" : "stroke-line-strong"}
            dash={n === 1 ? undefined : "2 2"}
          />
          <Node x={76} y={14 + n * 25} w={52} h={20} />
          <text x={82} y={27 + n * 25} className="fill-fg font-mono text-[6px]">
            {["✕ full", "score 82", "score 40"][n]}
          </text>
        </g>
      ))}
      <path d="M134 44l4 4 8-8" className="stroke-viz-add" strokeWidth={1.6} />
    </>
  ),

  "kubernetes/autoscaling": () => (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Pod
          key={i}
          x={14 + i * 12}
          y={60 - (i > 2 ? 0 : 0)}
          s={9}
          cls={i > 2 ? "fill-accent/30 stroke-accent" : undefined}
          className={i > 2 ? `${A} opacity-30 group-hover:opacity-100` : ""}
        />
      ))}
      <path d="M14 50l20-6 14 2 16-16 14-4" className="stroke-viz-remove" strokeWidth={1.6} />
      <text x={14} y={84} className={T}>
        more pods…
      </text>
      <Node x={100} y={24} w={22} h={40} />
      <Node
        x={126}
        y={24}
        w={22}
        h={40}
        cls={`fill-accent/15 stroke-accent ${A} opacity-40 group-hover:opacity-100`}
      />
      <text x={100} y={84} className={T}>
        …more nodes
      </text>
    </>
  ),

  "disruptions-upgrades": () => (
    <>
      {[0, 1, 2].map((n) => (
        <g key={n}>
          <Node
            x={14 + n * 46}
            y={28}
            w={40}
            h={36}
            cls={n === 0 ? "fill-accent/15 stroke-accent" : "fill-surface-2/60 stroke-line-strong"}
          />
          {n === 0 ? (
            <path
              d="M24 40l20 14M44 40l-20 14"
              className="stroke-accent"
              strokeWidth={1.2}
              strokeDasharray="2 2"
            />
          ) : (
            <>
              <Pod x={20 + n * 46} y={40} />
              <Pod
                x={32 + n * 46}
                y={40}
                className={n === 2 ? `${A} group-hover:-translate-x-1` : ""}
              />
            </>
          )}
        </g>
      ))}
      <text x={14} y={80} className={T}>
        drain · PDB minAvailable 2
      </text>
      <text x={14} y={22} className="fill-accent font-mono text-[6.5px]">
        1.36 → 1.37
      </text>
    </>
  ),

  rbac: () => (
    <>
      <rect
        x={14}
        y={30}
        width={36}
        height={24}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={32} y={45} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        SA
      </text>
      <Arrow x1={52} y1={42} x2={72} y2={42} />
      <rect
        x={74}
        y={24}
        width={40}
        height={36}
        rx={4}
        className="fill-viz-meta/15 stroke-viz-meta"
        strokeWidth={1.2}
      />
      <text x={94} y={36} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        Role
      </text>
      <text x={94} y={48} textAnchor="middle" className="fill-muted font-mono text-[5.5px]">
        get 1 cm
      </text>
      <path d="M124 34l4 4 8-8" className="stroke-viz-add" strokeWidth={1.6} />
      <path
        d="M124 50l8 8M132 50l-8 8"
        className={`stroke-viz-remove ${A} group-hover:rotate-45`}
        strokeWidth={1.6}
      />
      <text x={14} y={78} className={T}>
        least privilege
      </text>
    </>
  ),

  "pod-security": () => (
    <>
      {[
        ["privileged", "fill-viz-remove/15 stroke-viz-remove"],
        ["baseline", "fill-accent/15 stroke-accent"],
        ["restricted", "fill-viz-add/15 stroke-viz-add"],
      ].map(([l, cls], i) => (
        <g key={l} className={i === 2 ? `${A} group-hover:-translate-y-1` : ""}>
          <rect
            x={18 + i * 44}
            y={60 - i * 14}
            width={38}
            height={20 + i * 14}
            rx={3}
            className={cls}
            strokeWidth={1.2}
          />
          <text
            x={37 + i * 44}
            y={74}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {l}
          </text>
        </g>
      ))}
      <path
        d="M128 26l12 4v8c0 7-5 11-12 14-7-3-12-7-12-14v-8z"
        className="fill-viz-add/15 stroke-viz-add"
        strokeWidth={1.3}
      />
    </>
  ),

  "helm-gitops": () => (
    <>
      <rect
        x={14}
        y={30}
        width={36}
        height={34}
        rx={4}
        className="fill-viz-meta/15 stroke-viz-meta"
        strokeWidth={1.2}
      />
      <text x={32} y={44} textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
        Git
      </text>
      <path d="M24 54h16M28 50v8" className="stroke-viz-meta" strokeWidth={1.1} />
      <path
        d="M52 40q28-16 56 0"
        className="stroke-accent"
        strokeWidth={1.4}
        strokeDasharray="3 2"
      />
      <path d="M104 37l4 3-4 3" className="stroke-accent" strokeWidth={1.4} />
      <path
        d="M108 56q-28 16-56 0"
        className={`stroke-line-strong ${A} group-hover:-translate-y-1`}
        strokeWidth={1.2}
        strokeDasharray="2 2"
      />
      <Node x={110} y={30} w={38} h={34} label="cluster" />
      <Pod x={116} y={44} />
      <Pod x={128} y={44} />
      <text x={80} y={30} textAnchor="middle" className={T}>
        sync
      </text>
      <text x={80} y={82} textAnchor="middle" className={T}>
        drift → reverted
      </text>
    </>
  ),

  debugging: () => (
    <>
      <rect
        x={14}
        y={20}
        width={96}
        height={60}
        rx={4}
        className="fill-surface-2/70 stroke-line-strong"
        strokeWidth={1.2}
      />
      {[
        "$ kubectl describe pod",
        "Last State: Terminated",
        "Reason: OOMKilled",
        "Exit Code: 137",
      ].map((l, i) => (
        <text
          key={l}
          x={20}
          y={32 + i * 11}
          className={
            i === 2 ? "fill-viz-remove font-mono text-[6px]" : "fill-fg font-mono text-[6px]"
          }
        >
          {l}
        </text>
      ))}
      <circle
        cx={130}
        cy={44}
        r={12}
        className={`stroke-accent ${A} group-hover:scale-110`}
        strokeWidth={1.6}
      />
      <path d="M139 53l9 9" className="stroke-accent" strokeWidth={2} />
    </>
  ),

  operators: () => (
    <>
      <rect
        x={14}
        y={30}
        width={46}
        height={30}
        rx={4}
        className="fill-accent/15 stroke-accent"
        strokeWidth={1.3}
      />
      <text x={37} y={44} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        Postgres
      </text>
      <text x={37} y={53} textAnchor="middle" className="fill-muted font-mono text-[5.5px]">
        Cluster
      </text>
      <circle
        cx={80}
        cy={45}
        r={9}
        className={`stroke-viz-compute ${A} group-hover:rotate-90`}
        strokeWidth={1.5}
        strokeDasharray="4 2"
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Arrow x1={90} y1={45} x2={110} y2={24 + i * 21} />
          <rect
            x={112}
            y={18 + i * 21}
            width={36}
            height={12}
            rx={2}
            className="fill-surface-2/60 stroke-line-strong"
          />
          <text
            x={130}
            y={26 + i * 21}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {["StatefulSet", "Services", "backups"][i]}
          </text>
        </g>
      ))}
    </>
  ),

  "managed-kubernetes": () => (
    <>
      {[
        [26, "EKS"],
        [46, "GKE"],
        [34, "AKS"],
        [62, "OpenShift"],
      ].map(([h, l], i) => (
        <g key={l as string}>
          <rect
            x={22 + i * 30}
            y={80 - (h as number)}
            width={20}
            height={h as number}
            rx={2}
            className={
              i === 1
                ? `fill-viz-compute/40 stroke-viz-compute ${A} group-hover:-translate-y-1`
                : "fill-viz-compute/20 stroke-viz-compute"
            }
            strokeWidth={1.1}
          />
          <text
            x={32 + i * 30}
            y={90}
            textAnchor="middle"
            className="fill-muted font-mono text-[5.5px]"
          >
            {l as string}
          </text>
        </g>
      ))}
      <text x={22} y={14} className={T}>
        $ / month, same cluster
      </text>
    </>
  ),

  "capstone-k8s": () => (
    <>
      <rect
        x={12}
        y={30}
        width={26}
        height={36}
        rx={4}
        className="fill-surface-2 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={25} y={52} textAnchor="middle" className="fill-fg font-mono text-[8px]">
        ₹
      </text>
      <Arrow x1={40} y1={48} x2={56} y2={48} />
      {[0, 1, 2].map((z) => (
        <g key={z}>
          <rect
            x={58 + z * 24}
            y={30}
            width={20}
            height={36}
            rx={3}
            className="stroke-line-strong"
            strokeDasharray="2 2"
          />
          <Pod x={63 + z * 24} y={43} s={10} />
        </g>
      ))}
      <path
        d="M142 32l10 4v8c0 7-4 11-10 14-6-3-10-7-10-14v-8z"
        className={`fill-viz-add/15 stroke-viz-add ${A} group-hover:scale-110`}
        strokeWidth={1.3}
      />
      <text x={80} y={84} textAnchor="middle" className={T}>
        design it, then survive a bad day
      </text>
    </>
  ),
};
