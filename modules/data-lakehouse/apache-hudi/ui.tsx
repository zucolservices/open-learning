"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

export type InstantState = "requested" | "inflight" | "completed" | "rolledback";

export interface RailInstant {
  time: string;
  action: string;
  state: InstantState;
  note?: string;
}

const stateCls: Record<InstantState, string> = {
  requested: "border-viz-meta/60 border-dashed bg-transparent",
  inflight: "border-viz-compute bg-viz-compute/15 animate-pulse",
  completed: "border-viz-meta/70 bg-viz-meta/20",
  rolledback: "border-viz-remove/60 border-dashed bg-viz-remove/10 text-viz-remove line-through",
};

export const stateLabel: Record<InstantState, string> = {
  requested: "requested",
  inflight: "inflight",
  completed: "completed",
  rolledback: "rolled back",
};

/** The Hudi timeline: instants left to right, oldest first, styled by state. */
export function Rail({
  instants,
  dimIncomplete,
}: {
  instants: RailInstant[];
  dimIncomplete?: boolean;
}) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
  }, [instants.length]);

  return (
    <div className="border-line bg-bg/40 rounded-xl border px-3 pt-2 pb-3">
      <p className="text-subtle mb-1.5 font-mono text-[10px]">.hoodie/ timeline →</p>
      <ol ref={ref} className="flex gap-1.5 overflow-x-auto pb-1">
        {instants.map((i) => (
          <motion.li
            key={`${i.time}-${i.action}`}
            layout
            initial={{ opacity: 0, x: 12 }}
            animate={{
              opacity: dimIncomplete && i.state !== "completed" ? 0.55 : 1,
              x: 0,
            }}
            className={cn(
              "min-w-[4.75rem] shrink-0 rounded-lg border px-2 py-1 font-mono text-[10px] leading-tight",
              stateCls[i.state],
            )}
          >
            <span className="block font-semibold">{i.time}</span>
            <span className="block">{i.action}</span>
            <span className="text-muted block text-[9px]">{i.note ?? stateLabel[i.state]}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
