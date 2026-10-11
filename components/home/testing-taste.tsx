"use client";

import { useState } from "react";
import { Bug, Skull } from "lucide-react";
import { cn } from "@/lib/cn";
import { MUTANTS, TESTS, killedBy } from "@/modules/testing/mutation-testing/model";

/** A taste of module 14: tick tests and watch planted bugs (mutants) die. */
export function TestingTaste() {
  const [tests, setTests] = useState<string[]>(["t1"]);
  const killable = MUTANTS.filter((m) => !m.equivalent);
  const results = killable.map((m) => ({ m, dead: killedBy(m, tests).length > 0 }));
  const killed = results.filter((r) => r.dead).length;
  const toggle = (id: string) =>
    setTests((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {TESTS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tests.includes(t.id)}
            onClick={() => toggle(t.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              tests.includes(t.id)
                ? "border-accent bg-accent-soft"
                : "border-line-strong text-muted",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="grid gap-1">
        {results.map(({ m, dead }) => (
          <div
            key={m.id}
            className={cn(
              "flex items-center gap-2 rounded-md border px-2 py-1 font-mono text-[11px]",
              dead ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            {dead ? (
              <Skull className="text-good size-3.5" />
            ) : (
              <Bug className="text-bad size-3.5" />
            )}
            {m.from} → {m.to}
          </div>
        ))}
      </div>
      <p className="text-subtle text-[11px]">
        {killed === killable.length
          ? "Every planted bug is caught: these tests would notice."
          : `${killable.length - killed} planted bug${killable.length - killed > 1 ? "s" : ""} would slip past these tests.`}
      </p>
    </div>
  );
}
