"use client";

import { useMemo, useState } from "react";
import { BellRing } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  ERRORS,
  FAST,
  MIN,
  RULES,
  SLOW,
  evaluate,
  type Rule,
} from "@/modules/observability/alerting/model";

const ORDER: Rule[] = ["naive", "threshold", "burn"];
const HOURS = MIN / 60;
const hourly = Array.from({ length: HOURS }, (_, h) => {
  let sum = 0;
  for (let i = h * 60; i < h * 60 + 60; i++) sum += ERRORS[i];
  return sum / 60;
});

/** A taste of module 15: three alert rules over the same week, and who gets woken. */
export function ObservabilityTaste() {
  const [rule, setRule] = useState<Rule>("naive");
  const r = useMemo(() => evaluate(rule), [rule]);
  const pageHours = new Set(r.pageMinutes.map((m) => Math.floor(m / 60)));
  const caught = (at: number | null) => (at === null ? "missed" : "caught");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {ORDER.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setRule(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              rule === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {RULES[k].name}
          </button>
        ))}
      </div>
      <div className="flex h-24 items-end gap-px">
        {hourly.map((v, h) => (
          <div key={h} className="relative flex h-full flex-1 flex-col justify-end">
            {pageHours.has(h) && (
              <BellRing className="text-bad absolute -top-0.5 left-1/2 size-2.5 -translate-x-1/2" />
            )}
            <div
              className={cn("w-full", v >= 0.003 ? "bg-bad/70" : "bg-viz-data/40")}
              style={{
                height: `${Math.round(Math.min(100, Math.max(2, Math.log10(v / 0.0001) * 33)))}%`,
              }}
            />
          </div>
        ))}
      </div>
      <p className="text-muted font-mono text-xs">
        {r.pages} pages · {r.falsePages} false alarms · slow burn {caught(r.slowAt)} · outage{" "}
        {caught(r.fastAt)}
      </p>
      <p className="text-subtle text-[10px]">
        Illustrative week, hourly error rate on a log scale; slow burn on day{" "}
        {Math.floor(SLOW.start / 1440) + 1}, outage on day {Math.floor(FAST.start / 1440) + 1}.
      </p>
    </div>
  );
}
