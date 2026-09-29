"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Segmented } from "@/toolkit/controls/segmented";
import { Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import bench from "./bench.json";
import { LAYERS, buildLinks, buildPoints, exactNearest, searchHnsw } from "./hnsw";
import type { IndexState } from "./state";

/* 1 ─ The nearest chai stall --------------------------------------------------------------------- */

const ROUTE: [string, string][] = [
  ["Highway exit", "Get to the right part of the city"],
  ["Main road", "Then the right neighbourhood"],
  ["Lane", "Then walk the lanes to the nearest stall"],
];

export function ChaiStall() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The nearest chai stall"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ROUTE.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface flex items-center gap-3 rounded-xl border px-3 py-2"
              style={{ marginLeft: `${i * 8}%` }}
            >
              <span className="bg-accent text-accent-fg grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold">
                {LAYERS - i}
              </span>
              <span>
                <span className="block text-sm font-semibold">{t}</span>
                <span className="text-muted block text-xs">{d}</span>
              </span>
            </motion.div>
          ))}
          <p className="text-muted mt-2 text-center text-xs">
            You check a handful of places, not all 10,000 stalls in the city.
          </p>
        </div>
      }
    >
      <p>
        To find the chai stall nearest you in a big city, you wouldn&apos;t measure the distance to
        every stall. You&apos;d take the highway towards the right area, then a main road, then walk
        the lanes. You might occasionally miss a slightly closer stall, but you get there fast.
      </p>
      <p>
        Comparing a question with every stored vector is exact but slow: the work grows with every
        vector you add. A <Term id="vector-index">vector index</Term> takes shortcuts like the
        highways. It does <Term id="ann">approximate nearest-neighbour</Term> search: almost always
        right, far faster.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Climb the graph ⭐ (a real HNSW, built in your browser) ------------------------------------ */

const PTS = buildPoints(300);
const LINKS = buildLinks(PTS);
const SZ = 170;

function Layer({
  l,
  q,
  path,
  found,
  entry,
}: {
  l: number;
  q: { x: number; y: number };
  path: [number, number][];
  found?: number;
  entry: number;
}) {
  const on = PTS.map((p, i) => [p, i] as const).filter(([p]) => p.level >= l);
  const edges: [number, number][] = [];
  for (const [, i] of on) for (const j of LINKS[l][i]) if (i < j) edges.push([i, j]);
  const X = (v: number) => 6 + v * (SZ - 12);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        viewBox={`0 0 ${SZ} ${SZ}`}
        className="border-line bg-surface w-full rounded-lg border"
        role="img"
        aria-label={`Layer ${l}`}
      >
        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={X(PTS[a].x)}
            y1={X(PTS[a].y)}
            x2={X(PTS[b].x)}
            y2={X(PTS[b].y)}
            className="stroke-line"
            strokeWidth={0.5}
          />
        ))}
        {on.map(([p, i]) => (
          <circle
            key={i}
            cx={X(p.x)}
            cy={X(p.y)}
            r={l === 0 ? 1.4 : 2.4}
            className={i === entry ? "fill-viz-meta" : "fill-muted"}
          />
        ))}
        {path.map(([a, b], k) => (
          <motion.line
            key={k}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            x1={X(PTS[a].x)}
            y1={X(PTS[a].y)}
            x2={X(PTS[b].x)}
            y2={X(PTS[b].y)}
            className="stroke-accent"
            strokeWidth={2}
          />
        ))}
        {found !== undefined && (
          <circle cx={X(PTS[found].x)} cy={X(PTS[found].y)} r={4} className="fill-good" />
        )}
        <rect x={X(q.x) - 3.5} y={X(q.y) - 3.5} width={7} height={7} className="fill-fg" />
      </svg>
      <span className="text-muted text-[10px]">
        Layer {l} · {on.length} points
      </span>
    </div>
  );
}

export function ClimbGraph() {
  const [s, set] = useSceneState<IndexState>();
  const q = { x: s.qx, y: s.qy };
  const res = useMemo(() => searchHnsw(PTS, LINKS, { x: s.qx, y: s.qy }, s.ef), [s.qx, s.qy, s.ef]);
  const truth = useMemo(() => exactNearest(PTS, { x: s.qx, y: s.qy }), [s.qx, s.qy]);
  const steps = res.hops.length;
  const h = Math.min(s.hop, steps);
  const shown = res.hops.slice(0, h);
  const done = h >= steps;
  const QUERIES: [number, number][] = [
    [0.7, 0.3],
    [0.2, 0.8],
    [0.5, 0.5],
    [0.4, 0.4],
  ];
  return (
    <StepLayout
      eyebrow="Step through · built live"
      title="Climb the graph"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted text-[11px]">Search from:</span>
            {QUERIES.map(([x, y], i) => (
              <button
                key={i}
                type="button"
                onClick={() => set({ qx: x, qy: y, hop: 0 })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.qx === x && s.qy === y
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                Question {i + 1}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[2, 1, 0].map((l) => (
              <Layer
                key={l}
                l={l}
                q={q}
                entry={res.entry}
                path={shown
                  .filter((x) => x.layer === l)
                  .map((x) => [x.from, x.to] as [number, number])}
                found={done && l === 0 ? res.found : undefined}
              />
            ))}
          </div>
          <Stepper
            step={h}
            count={steps + 1}
            onChange={(n) => set({ hop: n })}
            label={h === 0 ? "Start at the top layer" : `Hop ${h} of ${steps}`}
          />
          <label className="flex items-center gap-3 text-xs">
            <span className="text-muted shrink-0">Search width on layer 0 (ef)</span>
            <input
              type="range"
              min={1}
              max={16}
              value={s.ef}
              onChange={(e) => set({ ef: Number(e.target.value), hop: 0 })}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Search width ef"
            />
            <span className="w-6 font-mono">{s.ef}</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Points compared</p>
              <p className="text-sm font-semibold">
                {res.visited} <span className="text-muted font-normal">of {PTS.length}</span>
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                !done
                  ? "border-line bg-surface"
                  : res.found === truth
                    ? "border-good/50 bg-good/10"
                    : "border-bad/50 bg-bad/10",
              )}
            >
              <p className="text-muted text-[10px]">Found the true nearest?</p>
              <p className="text-sm font-semibold">
                {!done ? "…" : res.found === truth ? "Yes" : "No: a near miss"}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        This is a real <Term id="hnsw">HNSW</Term> index (Hierarchical Navigable Small World), built
        in your browser from 300 points. Every point is on the bottom layer; a random few also
        appear on the layers above, like highway exits.
      </p>
      <p>
        Step through a search. It starts at the top (purple), hops greedily towards the question
        (the square), drops a layer, and repeats. On the bottom layer it keeps a short list of the
        best candidates, ef long, before settling (green).
      </p>
      <p className="text-muted text-sm">
        It compares about a tenth of the points. Try question 4 with ef at 2 or 4: it settles on a
        close point that isn&apos;t the closest. Raise ef to 6 and it finds the right one, at the
        cost of a few more comparisons.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Speed against recall ⭐ (real benchmark) ------------------------------------------------- */

const CW = 320;
const CH = 170;

export function SpeedVsRecall() {
  const [s, set] = useSceneState<IndexState>();
  const curve =
    s.method === "hnsw"
      ? bench.hnsw.curve.map((c) => ({ knob: c.ef, recall: c.recall, ms: c.ms }))
      : bench.ivf.curve.map((c) => ({ knob: c.nprobe, recall: c.recall, ms: c.ms }));
  const k = Math.min(s.knob, curve.length - 1);
  const cur = curve[k];
  const maxMs = Math.max(bench.flat.ms, ...curve.map((c) => c.ms));
  const x = (ms: number) => 34 + (Math.log10(ms / 0.01) / Math.log10(maxMs / 0.01)) * (CW - 44);
  const y = (r: number) => CH - 26 - ((r - 0.6) / 0.4) * (CH - 40);
  const path = curve.map((c, i) => `${i ? "L" : "M"}${x(c.ms)},${y(c.recall)}`).join("");
  const speedup = bench.flat.ms / cur.ms;
  return (
    <StepLayout
      eyebrow="Real benchmark"
      title="Speed against recall"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.method}
            options={[
              ["hnsw", "HNSW graph"],
              ["ivf", "IVF clusters"],
            ]}
            onChange={(v) => set({ method: v, knob: 3 })}
          />
          <svg
            viewBox={`0 0 ${CW} ${CH}`}
            className="max-h-72 w-full"
            role="img"
            aria-label="Recall against time per query"
          >
            {[0.6, 0.8, 1].map((r) => (
              <g key={r}>
                <line
                  x1={34}
                  x2={CW - 10}
                  y1={y(r)}
                  y2={y(r)}
                  className="stroke-line"
                  strokeDasharray="2 3"
                />
                <text x={30} y={y(r) + 3} textAnchor="end" className="fill-muted text-[8px]">
                  {Math.round(r * 100)}%
                </text>
              </g>
            ))}
            <text
              x={(CW + 24) / 2}
              y={CH - 4}
              textAnchor="middle"
              className="fill-muted text-[8px]"
            >
              milliseconds per query (log scale) →
            </text>
            <path d={path} fill="none" className="stroke-accent" strokeWidth={2} />
            {curve.map((c, i) => (
              <circle
                key={i}
                cx={x(c.ms)}
                cy={y(c.recall)}
                r={i === k ? 5 : 2.5}
                className={i === k ? "fill-accent" : "fill-muted"}
              />
            ))}
            <circle cx={x(bench.flat.ms)} cy={y(1)} r={4} className="fill-viz-idle" />
            <text
              x={x(bench.flat.ms) - 6}
              y={y(1) - 7}
              textAnchor="end"
              className="fill-muted text-[8px]"
            >
              exact search
            </text>
          </svg>
          <label className="flex items-center gap-3 text-xs">
            <span className="text-muted shrink-0">
              {s.method === "hnsw" ? "Search width (ef)" : "Clusters searched (nprobe)"}
            </span>
            <input
              type="range"
              min={0}
              max={curve.length - 1}
              value={k}
              onChange={(e) => set({ knob: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Search setting"
            />
            <span className="w-8 font-mono">{cur.knob}</span>
          </label>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Recall@10", `${(cur.recall * 100).toFixed(1)}%`],
              ["Per query", `${cur.ms.toFixed(2)} ms`],
              ["vs exact search", `${speedup.toFixed(0)}× faster`],
            ].map(([a, b]) => (
              <div key={a} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{a}</p>
                <p className="text-sm font-semibold">{b}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Measured with FAISS on 100,000 synthetic 384-dimensional vectors in clusters, one CPU
            core, 300 queries. Exact search took {bench.flat.ms.toFixed(1)} ms per query.
          </p>
        </div>
      }
    >
      <p>
        Every vector index has a knob that trades speed for <Term id="recall-at-k">recall</Term>:
        the share of the true 10 nearest neighbours it actually returns. These are real
        measurements.
      </p>
      <p>
        HNSW&apos;s knob is the search width. <Term id="ivf">IVF</Term> first groups vectors into
        clusters, then searches only the few clusters nearest the question; its knob is how many.
      </p>
      <p className="text-muted text-sm">
        Exact search grows in step with the collection: about {bench.flat.ms.toFixed(1)} ms here
        means roughly {(bench.flat.ms * 100).toFixed(0)} ms at 10 million vectors, per query. Graph
        search grows far more slowly, which is why every vector database uses an index at scale.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where the memory goes --------------------------------------------------------------------- */

const N_STEPS = [1e4, 1e5, 1e6, 3e6, 1e7, 3e7, 1e8, 1e9];
const N_WORDS = [
  "10 thousand",
  "1 lakh",
  "10 lakh (1 million)",
  "30 lakh",
  "1 crore (10 million)",
  "3 crore",
  "10 crore (100 million)",
  "100 crore (1 billion)",
];
const PREC: Record<IndexState["prec"], [string, number]> = {
  f32: ["float32 · 4 bytes", 4],
  int8: ["int8 · 1 byte", 1],
  bin: ["binary · 1 bit", 1 / 8],
};

function human(bytes: number) {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(1)} TB`;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  return `${(bytes / 1e3).toFixed(0)} KB`;
}

export function MemoryCalc() {
  const [s, set] = useSceneState<IndexState>();
  const n = N_STEPS[Math.min(s.nPow, N_STEPS.length - 1)];
  const bytes = n * s.dims * PREC[s.prec][1];
  const graph = n * 16 * 2 * 4;
  return (
    <StepLayout
      eyebrow="Calculator"
      title="Where the memory goes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="grid gap-1 text-xs">
            <span className="flex justify-between">
              <span>Passages (vectors)</span>
              <span className="font-mono">{N_WORDS[Math.min(s.nPow, N_STEPS.length - 1)]}</span>
            </span>
            <input
              type="range"
              min={0}
              max={N_STEPS.length - 1}
              value={s.nPow}
              onChange={(e) => set({ nPow: Number(e.target.value) })}
              className="accent-[var(--accent)]"
              aria-label="Number of vectors"
            />
          </label>
          <Segmented
            size="sm"
            value={String(s.dims)}
            options={[384, 768, 1024, 1536, 3072].map(
              (d) => [String(d), `${d} dims`] as [string, string],
            )}
            onChange={(v) => set({ dims: Number(v) })}
          />
          <Segmented
            size="sm"
            value={s.prec}
            options={(Object.keys(PREC) as IndexState["prec"][]).map(
              (k) => [k, PREC[k][0]] as [IndexState["prec"], string],
            )}
            onChange={(v) => set({ prec: v })}
          />
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border-accent bg-accent-soft rounded-lg border px-2 py-2">
              <p className="text-muted text-[10px]">The vectors themselves</p>
              <motion.p
                key={bytes}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="text-lg font-semibold"
              >
                {human(bytes)}
              </motion.p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-2">
              <p className="text-muted text-[10px]">
                Plus HNSW links (M = 16, FAISS&apos;s estimate)
              </p>
              <p className="text-lg font-semibold">{human(graph)}</p>
            </div>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-[11px]">
            <p className="font-medium">Measured on our 100,000 × 384 benchmark</p>
            <ul className="text-muted mt-1 grid gap-0.5">
              <li>Exact (float32): {human(bench.flat.bytes)} · recall 100%</li>
              <li>HNSW, float32: {human(bench.hnsw.bytes)} · recall 99.9% at ef 64</li>
              <li>
                HNSW, int8: {human(bench.hnsw_int8.bytes)} · recall{" "}
                {(bench.hnsw_int8.recall * 100).toFixed(1)}%
              </li>
              <li>
                IVF-PQ (48 bytes per vector): {human(bench.ivfpq.bytes)} · recall{" "}
                {(bench.ivfpq.recall * 100).toFixed(0)}% without re-checking
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <p>
        Fast vector search wants the vectors in memory. Memory is roughly passages × dimensions ×
        bytes per number, plus the index&apos;s own links.
      </p>
      <p>
        <Term id="quantization-vectors">Quantization</Term> stores each number in fewer bits: int8
        cuts memory by four with little loss here; binary by 32, usually with a second, exact
        re-check of the top results. Heavy compression without that re-check loses a lot, as the
        IVF-PQ line shows.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Guess the memory ------------------------------------------------------------------------ */

export function MemoryGuess() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Guess the memory"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="vec-memory"
            prompt="A state archive has 10 million passages, embedded with a 1024-dimensional model and stored as float32. Roughly how much memory do the vectors alone need?"
            min={0}
            max={100}
            step={1}
            unit=" GB"
            answer={41}
            tolerance={4}
            explanation="10,000,000 × 1,024 × 4 bytes ≈ 41 GB, before the index's links and the text itself. Int8 would bring it to about 10 GB; binary to about 1.3 GB, with a re-check step."
          />
        </div>
      }
    >
      <p>Use the rule from the calculator: passages × dimensions × bytes per number.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Exact doesn't scale", "Work grows with every vector; fine for thousands, not millions."],
  [
    "Indexes trade recall for speed",
    "HNSW's search width, IVF's clusters searched: tune on your data.",
  ],
  ["Memory is the bill", "Passages × dimensions × bytes; quantization shrinks it."],
  ["Measure recall", "Compare against exact search on a sample of real questions."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You rarely build an index yourself: pgvector, FAISS, OpenSearch, Qdrant, Weaviate, Milvus
        and the managed services all offer HNSW, and most offer IVF and quantization. What you
        choose is the settings, and those deserve a measurement.
      </p>
      <p className="text-muted text-sm">
        pgvector&apos;s HNSW defaults, for example: m = 16 links per point, ef_construction = 64
        while building, ef_search = 40 while searching. For very large collections that don&apos;t
        fit in memory, disk-based indexes such as DiskANN keep most of the graph on SSD.
      </p>
      <p>Next: combining keyword and vector search, so each covers the other&apos;s blind spots.</p>
    </StepLayout>
  );
}
