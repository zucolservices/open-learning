"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  BIG_MB,
  EXECUTORS,
  SIZES,
  STRATEGIES,
  choose,
  fmtMb,
} from "@/modules/spark/spark-joins/model";

/** A taste of module 10: change one table's size and the join condition, and see Spark's strategy and the data it moves. */
export function SparkTaste() {
  const [size, setSize] = useState(0);
  const [equi, setEqui] = useState(true);
  const [mb, label] = SIZES[size];
  const r = choose(mb, equi, "none");
  const broadcast = r.s === "bhj" || r.s === "bnlj";
  const moved = broadcast ? mb * EXECUTORS : BIG_MB + mb;
  const chip = (on: boolean) =>
    cn(
      "rounded-full border px-3 py-1 font-mono text-xs",
      on ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
    );
  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted font-mono text-xs">orders (500 GB) JOIN other ({label})</p>
      <div className="flex flex-wrap gap-1.5">
        {SIZES.map(([, l], i) => (
          <button key={l} type="button" onClick={() => setSize(i)} className={chip(size === i)}>
            {l}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setEqui(true)} className={chip(equi)}>
          ON a.id = b.id
        </button>
        <button type="button" onClick={() => setEqui(false)} className={chip(!equi)}>
          ON … BETWEEN …
        </button>
      </div>
      <div className="border-line bg-surface rounded-lg border px-3 py-2">
        <p className="text-accent text-sm font-semibold">{STRATEGIES[r.s].name}</p>
        <p className="text-muted text-xs">{STRATEGIES[r.s].how}</p>
        <p className="mt-1 text-xs">
          Data moved: <span className="font-mono font-semibold">{fmtMb(moved)}</span>
          {broadcast && <span className="text-good"> · the 500 GB side stays put</span>}
        </p>
      </div>
    </div>
  );
}
