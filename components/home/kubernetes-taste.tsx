"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Power, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  deletePod,
  fmt,
  setNode,
  start,
  tick,
  type Sim,
} from "@/modules/kubernetes/desired-state/model";

const REPLICAS = 5;

/** A taste of module 2: delete pods or cut a node's power and watch the controller restore five replicas. */
export function KubernetesTaste() {
  const [sim, setSim] = useState<Sim>(() => start(REPLICAS, true));
  useEffect(() => {
    const id = setInterval(() => setSim((x) => tick(x, REPLICAS, true)), 700);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono">Deployment api · replicas: {REPLICAS}</span>
        <span className="text-muted font-mono">clock {fmt(sim.clock)}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {sim.nodes.map((n, i) => (
          <div
            key={i}
            className={cn(
              "flex min-h-32 flex-col gap-1.5 rounded-xl border p-2",
              n.up ? "border-line bg-surface" : "border-bad/60 bg-bad/10",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold">node-{i + 1}</span>
              <button
                type="button"
                onClick={() => setSim((x) => setNode(x, i, !n.up))}
                aria-label={n.up ? `Cut power to node-${i + 1}` : `Restore node-${i + 1}`}
                className={cn(
                  "rounded-full p-1",
                  n.up ? "text-muted hover:bg-surface-2" : "text-bad",
                )}
              >
                <Power className="size-3.5" />
              </button>
            </div>
            {sim.pods
              .filter((p) => p.node === i)
              .map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "flex items-center justify-between gap-1 rounded-md border px-1.5 py-1 font-mono text-[10px]",
                    p.phase === "Unknown"
                      ? "border-bad/60 text-muted border-dashed"
                      : "border-accent/60 bg-accent-soft",
                  )}
                >
                  <span className="truncate">{p.id}</span>
                  <button
                    type="button"
                    aria-label={`Delete ${p.id}`}
                    onClick={() => setSim((x) => deletePod(x, p.id))}
                    className="text-muted hover:text-bad shrink-0"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </motion.div>
              ))}
          </div>
        ))}
      </div>
      <p className="text-muted min-h-8 font-mono text-[10px]">{sim.log.at(-1)}</p>
    </div>
  );
}
