"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { REPLY, run } from "@/modules/voice-ai/interruptions/model";

/** A taste of module 12: cut the assistant off and see what the caller heard and what it thinks it said. */
export function VoiceAiTaste() {
  const [at, setAt] = useState(9);
  const [stopAudio, setStop] = useState(true);
  const [truncate, setTruncate] = useState(false);
  const r = run({ at, kind: "real", stopAudio, truncate, minWords: false });
  const toggles: [string, boolean, (v: boolean) => void][] = [
    ["Stop speaking at once", stopAudio, setStop],
    ["Trim memory to what was heard", truncate, setTruncate],
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {toggles.map(([l, v, setV]) => (
          <button
            key={l}
            type="button"
            onClick={() => setV(!v)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              v ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2 line-through",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <label className="text-muted flex items-center gap-2 text-xs">
        caller cuts in after word
        <input
          type="range"
          min={2}
          max={REPLY.length - 2}
          value={at}
          onChange={(e) => setAt(Number(e.target.value))}
          className="accent-accent flex-1"
          aria-label="Interrupt after word"
        />
      </label>
      <div className="flex flex-col gap-1 text-xs">
        <p>
          <span className="text-subtle">Caller heard: </span>
          {r.heard.join(" ")}
        </p>
        <p>
          <span className="text-subtle">Agent thinks it said: </span>
          {r.thinks.map((w, i) => (
            <span key={i} className={i >= at && r.stopped ? "text-bad" : undefined}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
      <p className="text-muted text-[11px]">{r.outcome.text}</p>
    </div>
  );
}
