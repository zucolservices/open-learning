"use client";

import { motion } from "motion/react";
import { Database, HardDrive } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { outcome } from "./model";
import type { Ev, StoreState, Vol } from "./state";

/* 1 ─ Where do you keep your things? ------------------------------------------------------------ */

const PLACES: [string, string, string][] = [
  [
    "Your desk drawer",
    "Cleared every time you change desks, or even go home.",
    "Container filesystem",
  ],
  ["The room's whiteboard", "Survives a coffee break, wiped when you leave the room.", "emptyDir"],
  [
    "Writing on that room's wall",
    "Stays, but only in that room, and anyone can mess with the building.",
    "hostPath",
  ],
  [
    "A storage unit in one city",
    "Follows you to any room in that city, not to another city.",
    "Zonal cloud disk",
  ],
  ["A unit with a copy in two cities", "Still there if one city floods.", "Regional disk"],
];

export function WhereKeep() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Where do you keep your things?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PLACES.map(([t, d, k], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
              <span className="text-accent font-mono text-[11px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;On-disk files in a container are ephemeral&rdquo;: restart the container and
        they&apos;re gone. Pods move between nodes too. For a database, that&apos;s a problem.
      </p>
      <p>
        Kubernetes offers several places to keep data, each surviving a different amount of
        upheaval. The one that survives most is a{" "}
        <Term id="persistent-volume">persistent volume</Term>, usually a cloud disk.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Move the database ⭐ ------------------------------------------------------------------------- */

const VOLS: [Vol, string][] = [
  ["container", "Container filesystem"],
  ["emptydir", "emptyDir"],
  ["hostpath", "hostPath"],
  ["zonal", "PVC: zonal disk"],
  ["regional", "PVC: regional disk"],
];

const EVS: [Ev, string][] = [
  ["crash", "The container crashes"],
  ["sameZone", "Node-1 is drained (room in zone a)"],
  ["otherZone", "Node-1 is drained (zone a full)"],
  ["zoneDown", "Zone a goes down"],
];

export function MoveDb() {
  const [s, set] = useSceneState<StoreState>();
  const o = outcome(s.vol, s.ev);
  const zoneDown = s.ev === "zoneDown";
  const drained = s.ev === "sameZone" || s.ev === "otherZone";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Move the database"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-muted">Where the database keeps its files</span>
            <div className="flex flex-wrap gap-1.5">
              {VOLS.map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set({ vol: k })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    s.vol === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-muted">Then…</span>
            <div className="flex flex-wrap gap-1.5">
              {EVS.map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set({ ev: k })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    s.ev === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["a", "b"] as const).map((z) => (
              <div
                key={z}
                className={cn(
                  "rounded-xl border border-dashed p-2",
                  z === "a" && zoneDown ? "border-bad bg-bad/10" : "border-line",
                )}
              >
                <p className="text-muted mb-1 font-mono text-[10px]">zone {z}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[0, 1].map((k) => {
                    const n = z === "a" ? k : k + 2;
                    const full = s.ev === "otherZone" && n === 1;
                    const down = (zoneDown && z === "a") || (drained && n === 0);
                    return (
                      <div
                        key={n}
                        className={cn(
                          "flex min-h-20 flex-col gap-1 rounded-lg border p-1.5",
                          down ? "border-bad/50 opacity-60" : "border-line bg-surface",
                        )}
                      >
                        <span className="text-muted font-mono text-[9px]">
                          node-{n + 1}
                          {full ? " · full" : down ? (zoneDown ? " · down" : " · drained") : ""}
                        </span>
                        {o.podNode === n && (
                          <motion.span
                            layoutId="db"
                            className={cn(
                              "flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px]",
                              o.data === "kept" ? "border-good bg-good/15" : "border-bad bg-bad/10",
                            )}
                          >
                            <Database className="size-3" /> db
                          </motion.span>
                        )}
                        {o.diskNode === n && (
                          <span className="border-viz-data bg-viz-data/15 flex items-center gap-1 rounded border px-1 font-mono text-[9px]">
                            <HardDrive className="size-3" /> data
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {(o.diskZone === z || o.diskZone === "ab") && (
                  <motion.div
                    layout
                    className="border-viz-data bg-viz-data/15 mt-1.5 flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px]"
                  >
                    <HardDrive className="size-3" /> cloud disk{" "}
                    {o.diskZone === "ab" ? "(copy)" : ""}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          {o.podNode === null && <p className="text-bad font-mono text-xs">pod db: Pending</p>}
          <motion.p
            key={`${s.vol}-${s.ev}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              o.data === "kept"
                ? "border-good/50 bg-good/10"
                : o.data === "lost"
                  ? "border-bad/50 bg-bad/10"
                  : "border-accent/50 bg-accent-soft",
            )}
          >
            <span className="font-semibold">
              {o.data === "kept"
                ? "12,480 orders, all there. "
                : o.data === "lost"
                  ? "0 orders: data lost. "
                  : "Data safe, but out of reach. "}
            </span>
            {o.text}
          </motion.p>
        </div>
      }
    >
      <p>
        A database pod on node-1 holds 12,480 orders. Choose where it keeps its files, then shake
        things up: a crash, a drained node, a full zone, a whole zone failing.
      </p>
      <p>
        Cloud block disks are zonal: an EBS volume attaches only to instances &ldquo;in the same
        Availability Zone&rdquo;, and GKE and Azure disks are similar. Regional disks (GCP regional
        PD, Azure ZRS) keep synchronous copies in other zones, at a higher price.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Claim, provision, attach -------------------------------------------------------------------- */

const FRAMES = [
  {
    title: "The app claims storage",
    text: 'A PersistentVolumeClaim asks for 20 GiB, ReadWriteOnce, from the StorageClass "fast". It doesn\'t care which disk; it describes what it needs.',
    yaml: "kind: PersistentVolumeClaim\nspec:\n  storageClassName: fast\n  accessModes: [ReadWriteOnce]\n  resources: { requests: { storage: 20Gi } }",
  },
  {
    title: "Wait for the pod",
    text: "The class uses volumeBindingMode: WaitForFirstConsumer, so nothing is created yet. Creating the disk first could put it in a zone where the pod can't run.",
    yaml: "kind: StorageClass\nmetadata: { name: fast }\nprovisioner: ebs.csi.aws.com   # or pd.csi.storage.gke.io, disk.csi.azure.com\nvolumeBindingMode: WaitForFirstConsumer\nreclaimPolicy: Delete\nallowVolumeExpansion: true",
  },
  {
    title: "Provisioned where the pod lands",
    text: "The scheduler puts the pod on a node in zone a. The CSI driver creates a 20 GiB disk in zone a and a PersistentVolume for it, bound one-to-one to the claim.",
  },
  {
    title: "Attach and mount",
    text: "The disk is attached to the node and mounted into the container. From now on the PV remembers its zone, and the scheduler only places the pod where the disk can follow.",
  },
  {
    title: "Pod deleted, data kept",
    text: "Delete the pod, or the whole StatefulSet: the claim and disk stay. Only deleting the claim triggers the reclaim policy: Delete (the default for dynamic volumes) destroys the disk; Retain keeps it.",
  },
];

export function ClaimSteps() {
  const [s, set] = useSceneState<StoreState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Claim, provision, attach"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
            {["PVC", "StorageClass", "PV + disk", "node", "pod"].map((x, i) => (
              <span key={x} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-subtle">→</span>}
                <span
                  className={cn(
                    "rounded border px-2 py-0.5",
                    i < [1, 2, 3, 5, 5][s.frame]
                      ? "border-accent bg-accent-soft"
                      : "border-line text-muted",
                  )}
                >
                  {x}
                </span>
              </span>
            ))}
          </div>
          {f.yaml && (
            <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed">
              {f.yaml}
            </pre>
          )}
          <FrameCaption
            frameKey={s.frame}
            title={f.title}
            tone={s.frame === FRAMES.length - 1 ? "good" : undefined}
          >
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Apps don&apos;t ask for a particular disk. They make a{" "}
        <Term id="pvc">PersistentVolumeClaim</Term>, and a{" "}
        <Term id="storageclass">StorageClass</Term> says how to provision one, through a{" "}
        <Term id="csi">CSI driver</Term> from the storage vendor. (The old built-in cloud disk
        plugins were removed in 1.27 and 1.28.)
      </p>
      <p>
        Access modes describe sharing: ReadWriteOnce (one node at a time; pods on that node can
        share it), ReadOnlyMany, ReadWriteMany (needs shared file storage such as EFS, Filestore or
        Azure Files) and ReadWriteOncePod.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which storage? ----------------------------------------------------------------------------- */

export function WhichStorage() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which storage?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-storage"
            prompt="Where should each workload keep its data?"
            categories={[
              { id: "empty", label: "emptyDir" },
              { id: "rwo", label: "PVC, block disk (RWO)" },
              { id: "rwx", label: "PVC, shared files (RWX)" },
            ]}
            items={[
              {
                id: "scratch",
                label: "Scratch space for an image-resizing job",
                category: "empty",
                why: "Temporary; fine to lose when the pod goes.",
              },
              {
                id: "pg",
                label: "PostgreSQL's data directory",
                category: "rwo",
                why: "One writer, needs a durable disk.",
              },
              {
                id: "uploads",
                label: "Uploaded files that ten web pods must read and write",
                category: "rwx",
                why: "Many pods on many nodes: shared file storage such as EFS, Filestore or Azure Files.",
              },
              {
                id: "cache",
                label: "A cache shared by two containers in one pod",
                category: "empty",
                why: "emptyDir is shared by the pod's containers and can live in memory.",
              },
              {
                id: "kafka",
                label: "Each Kafka broker's log directory",
                category: "rwo",
                why: "One disk per broker, via a StatefulSet's volumeClaimTemplates.",
              },
              {
                id: "dataset",
                label: "A training dataset read by many pods at once",
                category: "rwx",
                why: "Shared file storage (read-many).",
              },
            ]}
            explanation="Temporary: emptyDir. One durable writer: a block-disk claim. Many pods sharing files: a shared file system."
          />
        </div>
      }
    >
      <p>Six workloads. Where should each keep its data?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Containers forget", "Their files vanish on restart; emptyDir vanishes with the pod."],
  ["Claims, not disks", "A PVC asks; a StorageClass and CSI driver provision."],
  ["Disks are zonal", "The pod follows the disk's zone; use regional disks to survive a zone."],
  ["Deleting pods keeps data", "Deleting the claim may not: check the reclaim policy."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next chapter: scheduling and scaling, starting with requests and limits.</p>
    </StepLayout>
  );
}
