"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import data from "@/modules/rag-systems/rag-end-to-end/data.json";

const CHUNKS = data.chunks;
const QUERIES = data.queries.slice(0, 3);
const xs = [...CHUNKS.map((c) => c.xy[0]), ...QUERIES.map((q) => q.qxy[0])];
const ys = [...CHUNKS.map((c) => c.xy[1]), ...QUERIES.map((q) => q.qxy[1])];
const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
const X = (x: number) => 6 + ((x - x0) / (x1 - x0)) * 88;
const Y = (y: number) => 6 + ((y - y0) / (y1 - y0)) * 48;
const PHASES = ["Ask", "Search", "Answer"];

/** RAG Systems showcase: a question lands among the documents, finds its nearest passages, and answers from them. Real e5 map and real model answers. */
export function RagScene() {
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setPhase((p) => {
        if (p < 2) return p + 1;
        setQi((n) => (n + 1) % QUERIES.length);
        return 0;
      });
    }, 1900);
    return () => clearInterval(id);
  }, [auto]);
  const q = QUERIES[qi];
  const top = q.scores.slice(0, 3).map((s) => s.id);
  const show = (p: number) => phase >= p;
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap gap-1">
        {QUERIES.map((x, i) => (
          <button
            key={x.q}
            type="button"
            onClick={() => {
              setAuto(false);
              setQi(i);
              setPhase(2);
            }}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] transition",
              i === qi ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted hover:text-fg",
            )}
          >
            {x.q.length > 42 ? `${x.q.slice(0, 40)}…` : x.q}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 text-[10px]">
        {PHASES.map((p, i) => (
          <span
            key={p}
            className={cn(
              "rounded px-1.5 py-0.5",
              show(i) ? "bg-accent-soft text-fg" : "text-subtle",
            )}
          >
            {i + 1}. {p}
          </span>
        ))}
      </div>
      <svg
        viewBox="0 0 100 60"
        className="bg-surface-2 w-full rounded-lg"
        role="img"
        aria-label="Passages placed by meaning, with the question and its three nearest passages"
      >
        {show(1) &&
          top.map((id) => {
            const c = CHUNKS.find((x) => x.id === id)!;
            return (
              <motion.line
                key={`${qi}-${id}`}
                x1={X(q.qxy[0])}
                y1={Y(q.qxy[1])}
                x2={X(c.xy[0])}
                y2={Y(c.xy[1])}
                stroke="var(--accent)"
                strokeWidth={0.35}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            );
          })}
        {CHUNKS.map((c) => {
          const hit = show(1) && top.includes(c.id);
          return (
            <circle
              key={c.id}
              cx={X(c.xy[0])}
              cy={Y(c.xy[1])}
              r={hit ? 1.6 : 1.1}
              fill={hit ? "var(--accent)" : "var(--viz-idle)"}
            >
              <title>{c.title}</title>
            </circle>
          );
        })}
        <motion.g key={qi} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
          <rect
            x={X(q.qxy[0]) - 1.8}
            y={Y(q.qxy[1]) - 1.8}
            width={3.6}
            height={3.6}
            transform={`rotate(45 ${X(q.qxy[0])} ${Y(q.qxy[1])})`}
            fill="var(--fg)"
          />
        </motion.g>
      </svg>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${qi}-${phase >= 2}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="min-h-16 text-sm"
        >
          {show(2) ? (
            <p>
              <span className="text-muted text-xs">Answer, from the three passages: </span>
              {q.answer}
            </p>
          ) : (
            <p className="text-muted">
              {show(1)
                ? `Nearest by meaning: ${top.map((id) => CHUNKS.find((x) => x.id === id)!.title).join(" · ")}`
                : `“${q.q}”`}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
      <p className="text-subtle text-[10px]">
        The map flattens 384-dimensional vectors onto a page, so “nearest” is measured in the full
        vectors, not by distance on the map.
      </p>
    </div>
  );
}
