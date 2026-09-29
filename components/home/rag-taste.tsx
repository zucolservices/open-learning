"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import data from "@/modules/rag-systems/rag-end-to-end/data.json";

const QUERIES = data.queries;

/** A taste of module 2: the same small model, with and without the documents. Real, unedited answers. */
export function RagTaste() {
  const [qi, setQi] = useState(3);
  const [withDocs, setWithDocs] = useState(false);
  const q = QUERIES[qi];
  const text = withDocs ? q.answer : q.closed;
  return (
    <div className="flex flex-col gap-3">
      <select
        aria-label="Question"
        value={qi}
        onChange={(e) => setQi(Number(e.target.value))}
        className="border-line bg-surface w-full min-w-0 rounded-lg border px-2 py-1.5 text-xs"
      >
        {QUERIES.map((x, i) => (
          <option key={x.q} value={i}>
            {x.q}
          </option>
        ))}
      </select>
      <div className="bg-surface-2 flex rounded-full p-0.5 text-[11px]">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={withDocs === v}
            onClick={() => setWithDocs(v)}
            className={cn(
              "flex-1 rounded-full px-2 py-1 transition",
              withDocs === v ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            {v ? "With the corporation's documents" : "From memory alone"}
          </button>
        ))}
      </div>
      <motion.p
        key={`${qi}-${withDocs}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-lg border px-3 py-2 text-xs whitespace-pre-line",
          withDocs ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
        )}
      >
        <span className="line-clamp-6">{text}</span>
      </motion.p>
      <p className="text-muted text-xs">
        {withDocs
          ? "Short, specific and checkable, or an honest “I don't know”."
          : "Fluent and confident, but generic or simply made up. Kalpanagar is a made-up town."}
      </p>
    </div>
  );
}
