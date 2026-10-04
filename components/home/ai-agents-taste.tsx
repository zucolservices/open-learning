"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { run } from "@/modules/ai-agents/agent-security/model";

const LEGS = [
  ["privateData", "Private data"],
  ["untrusted", "Untrusted web pages"],
  ["exfil", "A way to send data out"],
] as const;

/** A taste of module 17: switch the three legs of the lethal trifecta and see whether a poisoned page steals data. */
export function AiAgentsTaste() {
  const [legs, setLegs] = useState({ privateData: true, untrusted: true, exfil: true });
  const r = run({ ...legs, approval: false, filter: false, disguised: false });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {LEGS.map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setLegs({ ...legs, [k]: !legs[k] })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              legs[k] ? "border-bad bg-bad/10" : "border-line hover:bg-surface-2 line-through",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <p className="text-muted text-xs">
        A research agent reads a web page with hidden instructions. Switch the three legs on and
        off.
      </p>
      <p
        className={cn(
          "rounded-lg border px-3 py-2 text-xs font-semibold",
          r.leaked ? "border-bad bg-bad/10" : "border-good bg-good/10",
        )}
      >
        {r.verdict}
      </p>
    </div>
  );
}
