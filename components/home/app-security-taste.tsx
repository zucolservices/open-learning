"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  INPUTS,
  run,
  type InputKind,
  type Mode,
} from "@/modules/app-security/sql-injection/model";

/** A taste of module 5: watch a login query turn user input into code, then fix it with parameters. */
export function AppSecurityTaste() {
  const [input, setInput] = useState<InputKind>("always-true");
  const [mode, setMode] = useState<Mode>("concat");
  const inp = INPUTS.find((i) => i.id === input) ?? INPUTS[0];
  const out = run(input, mode);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {INPUTS.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => setInput(i.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              input === i.id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {i.id === "normal"
              ? "Normal name"
              : i.id === "always-true"
                ? "Crafted input"
                : "Crafted (2nd command)"}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(["concat", "param"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              mode === m ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            {m === "concat" ? "Built by pasting text" : "Parameterised"}
          </button>
        ))}
      </div>
      <div className="border-line bg-surface rounded-lg border p-3 font-mono text-[11px]">
        <span className="text-viz-compute">SELECT * FROM users WHERE name = </span>
        {mode === "param" ? (
          <span className="text-viz-compute">?</span>
        ) : (
          <span
            className={cn(
              "rounded px-1",
              out.parsedAs === "code" ? "bg-bad/25 text-bad" : "bg-viz-data/20",
            )}
          >
            &apos;{inp.shown}&apos;
          </span>
        )}
      </div>
      <p className={cn("text-sm", out.bad ? "text-bad" : "text-muted")}>
        <span className="font-semibold">
          {out.parsedAs === "code" ? "Read as command: " : "Read as data: "}
        </span>
        {out.result}
      </p>
      <p className="text-subtle text-[10px]">
        A rules-based simulation; crafted inputs are described, not real attack strings.
      </p>
    </div>
  );
}
