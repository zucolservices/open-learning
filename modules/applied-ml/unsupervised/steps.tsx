"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CORR, CUSTOMERS, MOONS, kmeans, silhouette, varianceAlong, type P } from "./model";
import type { UnsupState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;
const COLS = [
  "fill-viz-data",
  "fill-viz-meta",
  "fill-accent",
  "fill-good",
  "fill-viz-compute",
  "fill-muted",
];

/* 1 ─ Sorting a box of buttons -------------------------------------------------------------------- */

export function Library() {
  const groups = [
    ["🔴", "🔴", "🟥"],
    ["🔵", "🔷", "🔵"],
    ["🟡", "⭐", "🟡"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Sorting a box of buttons"
      stage={
        <div className="flex flex-1 flex-wrap content-center justify-center gap-4">
          {groups.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-2xl"
            >
              {g.join(" ")}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Tip out a box of buttons and you&apos;ll sort them without being told how: by colour, size
        or shape. Nobody gave you labels; you found groups that hang together.
      </p>
      <p>
        <Term id="unsupervised-learning">Unsupervised learning</Term> does that with data.{" "}
        <Term id="clustering">Clustering</Term> groups similar rows, such as customer segments;
        dimensionality reduction squashes many columns into a few that keep most of the information.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Segment customers with k-means ⭐ ----------------------------------------------------------- */

export function KMeans() {
  const [s, set] = useSceneState<UnsupState>();
  const r = kmeans(CUSTOMERS, s.k, s.seed, s.iters);
  const sil = silhouette(CUSTOMERS, r.labels, s.k);
  const elbow = Array.from({ length: 7 }, (_, i) => kmeans(CUSTOMERS, i + 1, 1, 20).inertia);
  const X = (v: number) => r1(30 + (v / 14) * 260);
  const Y = (v: number) => r1(170 - (v / 18) * 155);
  const EX = (k: number) => r1(20 + ((k - 1) / 6) * 110);
  const EY = (v: number) => r1(85 - (v / elbow[0]) * 70);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Segment customers with k-means"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="flex flex-1 items-center gap-2">
              <span className="text-muted">clusters, k</span>
              <input
                type="range"
                min={1}
                max={6}
                value={s.k}
                onChange={(e) => set({ k: Number(e.target.value), iters: 0 })}
                className="accent-accent flex-1"
                aria-label="Clusters"
              />
              <span className="w-4 font-mono">{s.k}</span>
            </label>
            <button
              type="button"
              onClick={() => set({ iters: s.iters + 1 })}
              className="border-accent rounded-full border px-3 py-1"
            >
              One step
            </button>
            <button
              type="button"
              onClick={() => set({ iters: 20 })}
              className="border-line rounded-full border px-3 py-1"
            >
              Run to the end
            </button>
            <button
              type="button"
              onClick={() => set({ seed: s.seed + 1, iters: 0 })}
              className="border-line rounded-full border px-3 py-1"
            >
              New starting points
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_9rem]">
            <svg viewBox="0 0 300 185" className="w-full">
              {CUSTOMERS.map((p, i) => (
                <circle
                  key={i}
                  cx={X(p[0])}
                  cy={Y(p[1])}
                  r={2.6}
                  className={COLS[r.labels[i]]}
                  opacity={0.75}
                />
              ))}
              {r.cs.map((c, i) => (
                <g key={`c${i}`}>
                  <circle
                    cx={X(c[0])}
                    cy={Y(c[1])}
                    r={6}
                    className={cn(COLS[i], "stroke-fg")}
                    strokeWidth={1.5}
                  />
                </g>
              ))}
              <text x={290} y={182} textAnchor="end" className="fill-muted font-mono text-[7px]">
                visits per month
              </text>
              <text x={32} y={12} className="fill-muted font-mono text-[7px]">
                average basket (₹ hundreds)
              </text>
            </svg>
            <div className="flex flex-col gap-2 text-xs">
              <svg viewBox="0 0 140 100" className="w-full">
                <polyline
                  fill="none"
                  className="stroke-viz-data"
                  strokeWidth={1.5}
                  points={elbow.map((v, i) => `${EX(i + 1)},${EY(v)}`).join(" ")}
                />
                {elbow.map((v, i) => (
                  <circle
                    key={i}
                    cx={EX(i + 1)}
                    cy={EY(v)}
                    r={i + 1 === s.k ? 3.5 : 2}
                    className={i + 1 === s.k ? "fill-accent" : "fill-viz-data"}
                  />
                ))}
                <text x={20} y={97} className="fill-muted font-mono text-[7px]">
                  k = 1 … 7: the elbow
                </text>
              </svg>
              <p>
                <span className="text-muted">steps run </span>
                <span className="font-mono">{s.iters}</span>
              </p>
              <p>
                <span className="text-muted">silhouette </span>
                <span className="font-mono">{sil.toFixed(2)}</span>
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Made-up customers. k-means runs live; larger circles are cluster centres.
          </p>
        </div>
      }
    >
      <p>
        <Term id="k-means">k-means</Term> repeats two steps: give every customer to the nearest
        centre, then move each centre to the middle of its customers. Press &ldquo;One step&rdquo; a
        few times and watch it settle. If two groups end up sharing a centre, try new starting
        points: k-means only finds a locally good answer.
      </p>
      <p>
        You have to choose k. The elbow chart shows how much spread is left as k grows; the bend
        suggests a sensible k. The silhouette score (higher is better, up to 1) is another guide.
        Neither is a proof: whether four segments are useful is a business question.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When clusters aren't round ------------------------------------------------------------------ */

export function Shapes() {
  const pts: P[] = MOONS.map((m) => m.p);
  const km = kmeans(pts, 2, 2, 20);
  const X = (v: number) => r1(75 + v * 40);
  const Y = (v: number) => r1(48 + v * 40);
  const panels: [string, (i: number) => number][] = [
    ["k-means, k = 2", (i) => km.labels[i]],
    ["Density-based (DBSCAN)", (i) => MOONS[i].moon],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When clusters aren't round"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-2">
            {panels.map(([t, lab]) => (
              <div key={t} className="border-line bg-surface rounded-lg border p-2">
                <p className="text-muted text-[10px]">{t}</p>
                <svg viewBox="0 0 150 95" className="w-full">
                  {pts.map((p, i) => (
                    <circle key={i} cx={X(p[0])} cy={Y(p[1])} r={2.2} className={COLS[lab(i)]} />
                  ))}
                </svg>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            k-means cuts the rings in half with a straight line; a density method follows their
            shape.
          </p>
          <p className="text-subtle text-[10px]">
            k-means computed live; the right panel shows the grouping a well-tuned DBSCAN finds.
          </p>
        </div>
      }
    >
      <p>
        k-means assumes round, similar-sized blobs. Real groups can be long, curved or uneven.
        DBSCAN (1996) instead finds dense regions, so clusters can take any shape, and it labels
        sparse points as noise rather than forcing them into a group.
      </p>
      <p>
        It isn&apos;t free of choices: you set a radius and a minimum number of neighbours.
        Hierarchical clustering is a third option: it builds a tree of merges you can cut at any
        level.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Squashing many columns into few ------------------------------------------------------------- */

export function Pca() {
  const [s, set] = useSceneState<UnsupState>();
  const a = (s.angle / 180) * Math.PI;
  const v = varianceAlong(a);
  let best = 0;
  let bestShare = 0;
  for (let d = 0; d < 180; d++) {
    const sh = varianceAlong((d / 180) * Math.PI).share;
    if (sh > bestShare) {
      bestShare = sh;
      best = d;
    }
  }
  const X = (x: number) => r1(150 + x * 28);
  const Y = (y: number) => r1(90 - y * 28);
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Squashing many columns into few"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 300 180" className="mx-auto w-full max-w-lg">
            <line
              x1={X(v.mx - ux * 5)}
              y1={Y(v.my - uy * 5)}
              x2={X(v.mx + ux * 5)}
              y2={Y(v.my + uy * 5)}
              className="stroke-accent"
              strokeWidth={1.5}
            />
            {CORR.map(([x, y], i) => {
              const t = (x - v.mx) * ux + (y - v.my) * uy;
              return (
                <g key={i}>
                  <line
                    x1={X(x)}
                    y1={Y(y)}
                    x2={X(v.mx + t * ux)}
                    y2={Y(v.my + t * uy)}
                    className="stroke-line"
                  />
                  <circle cx={X(x)} cy={Y(y)} r={2.4} className="fill-viz-data" />
                </g>
              );
            })}
          </svg>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">axis angle</span>
            <input
              type="range"
              min={0}
              max={179}
              value={s.angle}
              onChange={(e) => set({ angle: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Axis angle"
            />
            <span className="w-10 font-mono">{s.angle}°</span>
          </label>
          <p className="text-xs">
            This one axis keeps <span className="font-mono">{Math.round(v.share * 100)}%</span> of
            the spread. The best axis (the first principal component, at {best}°) keeps{" "}
            {Math.round(bestShare * 100)}%.
          </p>
        </div>
      }
    >
      <p>
        Datasets often have dozens of related columns. <Term id="pca">PCA</Term> (principal
        component analysis, 1901) finds the directions in which the data spreads most, so you can
        keep a few and drop the rest. Rotate the axis to find the one that keeps the most spread:
        that&apos;s what PCA computes directly.
      </p>
      <p>
        Scale features first, or the column with the biggest units dominates. For pictures of
        high-dimensional data, t-SNE and UMAP are popular, but cluster sizes and gaps in their plots
        can mislead.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which technique? ---------------------------------------------------------------------------- */

export function WhichTechnique() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which technique?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-technique"
            prompt="Which technique fits each task?"
            categories={[
              { id: "km", label: "k-means" },
              { id: "db", label: "DBSCAN" },
              { id: "pca", label: "PCA" },
            ]}
            items={[
              {
                id: "seg",
                label: "Split customers into five marketing segments",
                category: "km",
                why: "A chosen number of compact groups.",
              },
              {
                id: "gps",
                label: "Find hotspots of any shape in delivery locations, ignoring stray points",
                category: "db",
                why: "Density, odd shapes, noise.",
              },
              {
                id: "chart",
                label: "Reduce 40 correlated sensor readings to 3 numbers",
                category: "pca",
                why: "Dimensionality reduction.",
              },
              {
                id: "noise",
                label: "Flag isolated transactions that fit no group",
                category: "db",
                why: "DBSCAN labels sparse points as noise.",
              },
              {
                id: "compress",
                label: "Compress survey answers before plotting them",
                category: "pca",
                why: "Keep the main directions of spread.",
              },
            ]}
            explanation="A set number of round groups: k-means. Groups of any shape plus noise: DBSCAN. Fewer columns: PCA."
          />
        </div>
      }
    >
      <p>Sort the tasks.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["No labels needed", "Find structure in the data itself."],
  ["k-means", "Assign, move, repeat; you choose k."],
  ["Elbow and silhouette", "Guides, not proofs."],
  ["DBSCAN for odd shapes", "And to spot noise."],
  ["PCA compresses", "Keep the directions of greatest spread."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: measuring how good a classifier really is.</p>
    </StepLayout>
  );
}
