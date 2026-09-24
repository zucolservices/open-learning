"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useTicker } from "@/lib/use-ticker";
import { cn } from "@/lib/cn";

/**
 * Hero scene: the lakehouse stack as glass layers. Every few seconds an engine
 * sends a query down through the catalog and table metadata, and only the files
 * that can hold matching rows light up — pruning, the idea the track is built on.
 */

type Tone = "compute" | "accent" | "meta" | "data" | "idle";

const tones: Record<
  Tone,
  { face: string; faceOn: string; side: string; text: string; fill: string; stroke: string }
> = {
  compute: {
    face: "fill-viz-compute/5 stroke-viz-compute/40",
    faceOn: "fill-viz-compute/15 stroke-viz-compute",
    side: "fill-viz-compute/10",
    text: "fill-viz-compute",
    fill: "fill-viz-compute",
    stroke: "stroke-viz-compute",
  },
  accent: {
    face: "fill-accent/5 stroke-accent/40",
    faceOn: "fill-accent/15 stroke-accent",
    side: "fill-accent/10",
    text: "fill-accent",
    fill: "fill-accent",
    stroke: "stroke-accent",
  },
  meta: {
    face: "fill-viz-meta/5 stroke-viz-meta/40",
    faceOn: "fill-viz-meta/15 stroke-viz-meta",
    side: "fill-viz-meta/10",
    text: "fill-viz-meta",
    fill: "fill-viz-meta",
    stroke: "stroke-viz-meta",
  },
  data: {
    face: "fill-viz-data/5 stroke-viz-data/40",
    faceOn: "fill-viz-data/15 stroke-viz-data",
    side: "fill-viz-data/10",
    text: "fill-viz-data",
    fill: "fill-viz-data",
    stroke: "stroke-viz-data",
  },
  idle: {
    face: "fill-viz-idle/5 stroke-viz-idle/50",
    faceOn: "fill-viz-idle/15 stroke-viz-idle",
    side: "fill-viz-idle/10",
    text: "fill-muted",
    fill: "fill-viz-idle",
    stroke: "stroke-viz-idle",
  },
};

const LAYERS: { title: string; sub: string; tone: Tone; chapter: string; chapterTitle: string }[] =
  [
    {
      title: "Query engines",
      sub: "Spark · Trino · DuckDB · Flink",
      tone: "compute",
      chapter: "querying",
      chapterTitle: "Querying & serving",
    },
    {
      title: "Catalog",
      sub: "Unity · Polaris · Glue · Nessie",
      tone: "accent",
      chapter: "catalogs-governance",
      chapterTitle: "Catalogs & governance",
    },
    {
      title: "Open table formats",
      sub: "Delta Lake · Apache Iceberg · Apache Hudi",
      tone: "meta",
      chapter: "table-formats",
      chapterTitle: "Open table formats",
    },
    {
      title: "Open file formats",
      sub: "Parquet · ORC · Avro",
      tone: "data",
      chapter: "foundations",
      chapterTitle: "Foundations",
    },
    {
      title: "Object storage",
      sub: "Amazon S3 · Google Cloud Storage · ADLS",
      tone: "idle",
      chapter: "foundations",
      chapterTitle: "Foundations",
    },
  ];

const ENGINES = ["Spark", "Trino", "DuckDB", "Flink"];

// Isometric geometry (viewBox 720 × 640).
const CX = 210;
const W = 170;
const H = 85;
const T = 12;
const GAP = 98;
const CY0 = 95;
const cy = (i: number) => CY0 + i * GAP;

type Pt = [number, number];
/** Point on layer i's top face; (u, v) ∈ [0,1]², (0,0) is the back corner. */
const P = (i: number, u: number, v: number): Pt => [CX + (u - v) * W, cy(i) - H + (u + v) * H];
const pts = (list: Pt[]) => list.map((p) => p.join(",")).join(" ");
const rhombus = ([x, y]: Pt, a: number, b: number) =>
  pts([
    [x, y - b],
    [x + a, y],
    [x, y + b],
    [x - a, y],
  ]);

const ENGINE_UV: [number, number][] = [
  [0.28, 0.28],
  [0.72, 0.28],
  [0.28, 0.72],
  [0.72, 0.72],
];

const TILE_COUNT = 16;
const tileCenter = (k: number) => P(3, ((k % 4) + 0.5) / 4, (Math.floor(k / 4) + 0.5) / 4);

/** Deterministic "matching files" for query n: 2–4 of 16. */
function targets(n: number): number[] {
  const count = 2 + (n % 3);
  const set = new Set<number>();
  for (let k = 0; set.size < count; k++) set.add((n * 7 + k * 5 + k * k) % TILE_COUNT);
  return [...set];
}

const narrowQuery = "(max-width: 639px)";
function useNarrow() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(narrowQuery);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => matchMedia(narrowQuery).matches,
    () => false,
  );
}

export function LakehouseScene() {
  // Labels are hidden on phones, so crop the drawing to the stack itself.
  const narrow = useNarrow();
  const { ref, tick, live } = useTicker<HTMLDivElement>(1800);
  const [hovered, setHovered] = useState<number>();
  const active = hovered ?? (live ? Math.floor(tick / 2) % LAYERS.length : 2);

  const query = tick;
  const engine = query % ENGINES.length;
  const hits = targets(query);
  const commits = tick % 7;

  // Pointer parallax: the whole stack tilts toward the cursor.
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });

  const enginePt = P(0, ...ENGINE_UV[engine]);
  const engineBase: Pt = [enginePt[0], enginePt[1] + 6];
  const catalogPt: Pt = [CX, cy(1)];
  const tablePt: Pt = [CX, cy(2)];

  return (
    <div
      ref={ref}
      className="relative [perspective:1400px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        setHovered(undefined);
      }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="[transform-style:preserve-3d]">
        <svg
          viewBox={narrow ? "30 40 360 580" : "0 0 720 640"}
          className="h-auto w-full overflow-visible select-none"
          role="img"
          aria-label="The lakehouse stack: object storage, open file formats, open table formats, catalog and query engines. A query passes through the catalog and table metadata and reads only a few files."
        >
          {/* Data arriving from sources below */}
          {live &&
            Array.from({ length: 9 }, (_, i) => (
              <motion.circle
                key={`in-${i}`}
                r={2.2}
                cx={CX - 90 + ((i * 47) % 180)}
                className="fill-viz-data"
                initial={{ cy: 660, opacity: 0 }}
                animate={{ cy: [660, cy(4) + H * 0.6], opacity: [0, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.31, ease: "easeOut" }}
              />
            ))}

          {/* Layers, bottom first so upper glass sits on top */}
          {LAYERS.map((layer, i) => i)
            .reverse()
            .map((i) => {
              const layer = LAYERS[i];
              const tone = tones[layer.tone];
              const on = active === i;
              const left: Pt[] = [P(i, 0, 1), P(i, 1, 1), [CX, cy(i) + H + T], [CX - W, cy(i) + T]];
              const right: Pt[] = [
                P(i, 1, 1),
                P(i, 1, 0),
                [CX + W, cy(i) + T],
                [CX, cy(i) + H + T],
              ];
              return (
                <g
                  key={layer.title}
                  onPointerEnter={() => setHovered(i)}
                  className="cursor-pointer"
                >
                  <polygon points={pts(left)} className={cn(tone.side, "opacity-70")} />
                  <polygon points={pts(right)} className={tone.side} />
                  <polygon
                    points={pts([P(i, 0, 0), P(i, 1, 0), P(i, 1, 1), P(i, 0, 1)])}
                    className={cn(
                      "transition-[fill,stroke] duration-500",
                      on ? tone.faceOn : tone.face,
                    )}
                    strokeWidth={1.2}
                  />
                  {i === 4 &&
                    [0.25, 0.5, 0.75].map((g) => (
                      <g key={g} className="stroke-viz-idle/30" strokeDasharray="3 5">
                        <line
                          x1={P(4, g, 0)[0]}
                          y1={P(4, g, 0)[1]}
                          x2={P(4, g, 1)[0]}
                          y2={P(4, g, 1)[1]}
                        />
                        <line
                          x1={P(4, 0, g)[0]}
                          y1={P(4, 0, g)[1]}
                          x2={P(4, 1, g)[0]}
                          y2={P(4, 1, g)[1]}
                        />
                      </g>
                    ))}
                </g>
              );
            })}

          {/* Parquet files on the file layer: matching files light up, the rest are pruned */}
          {Array.from({ length: TILE_COUNT }, (_, k) => {
            const hit = live && hits.includes(k);
            return (
              <motion.polygon
                key={`tile-${k}`}
                points={rhombus(tileCenter(k), W / 4 - 9, H / 4 - 4.5)}
                className={hit ? "fill-viz-compute" : "fill-viz-data"}
                animate={{ opacity: live ? (hit ? 1 : 0.28) : 0.55 }}
                transition={{ duration: 0.5, delay: hit ? 0.9 : 0 }}
                pointerEvents="none"
              />
            );
          })}

          {/* Commit log on the table-format layer */}
          {Array.from({ length: 6 }, (_, k) => (
            <motion.polygon
              key={`commit-${k}`}
              points={rhombus(P(2, 0.14 + k * 0.145, 0.5), 11, 5.5)}
              className="fill-viz-meta"
              animate={{
                opacity: k < commits ? 0.95 : 0.15,
                scale: k === commits - 1 ? [1.5, 1] : 1,
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              transition={{ duration: 0.4 }}
              pointerEvents="none"
            />
          ))}

          {/* Catalog pointer: the one place that says which snapshot is current */}
          <motion.polygon
            points={rhombus(catalogPt, 16, 8)}
            className="fill-accent"
            animate={live ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
            transition={{ duration: 1.8, repeat: Infinity }}
            pointerEvents="none"
          />

          {/* The query: engine → catalog → table metadata → only the matching files */}
          <AnimatePresence>
            {live &&
              hits.map((k) => (
                <motion.path
                  key={`q-${query}-${k}`}
                  d={`M${engineBase.join(",")} L${catalogPt.join(",")} L${tablePt.join(",")} L${tileCenter(k).join(",")}`}
                  className="stroke-viz-compute"
                  fill="none"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  pointerEvents="none"
                />
              ))}
          </AnimatePresence>

          {/* Engines on the top layer */}
          {ENGINE_UV.map((uv, e) => {
            const [x, y] = P(0, ...uv);
            const firing = live && e === engine;
            const a = 11;
            const b = 5.5;
            const hgt = 14;
            return (
              <g key={ENGINES[e]} pointerEvents="none">
                <polygon
                  points={pts([
                    [x - a, y - hgt],
                    [x, y - hgt + b],
                    [x, y + b],
                    [x - a, y],
                  ])}
                  className={firing ? "fill-viz-compute" : "fill-viz-compute/40"}
                />
                <polygon
                  points={pts([
                    [x, y - hgt + b],
                    [x + a, y - hgt],
                    [x + a, y],
                    [x, y + b],
                  ])}
                  className={firing ? "fill-viz-compute/80" : "fill-viz-compute/25"}
                />
                <polygon
                  points={rhombus([x, y - hgt], a, b)}
                  className={firing ? "fill-viz-compute" : "fill-viz-compute/55"}
                />
                <text
                  x={x}
                  y={y - hgt - 10}
                  textAnchor="middle"
                  className={cn(
                    "text-[10px] font-medium max-sm:hidden",
                    firing ? "fill-fg" : "fill-subtle",
                  )}
                >
                  {ENGINES[e]}
                </text>
              </g>
            );
          })}

          {/* Labels */}
          <g className="max-sm:hidden">
            {LAYERS.map((layer, i) => {
              const on = active === i;
              const tone = tones[layer.tone];
              const y = cy(i);
              return (
                <a
                  key={layer.title}
                  href={`/tracks/data-lakehouse/#${layer.chapter}`}
                  onPointerEnter={() => setHovered(i)}
                >
                  <line
                    x1={CX + W + 8}
                    y1={y}
                    x2={434}
                    y2={y}
                    className={cn(
                      "transition-colors duration-500",
                      on ? tone.stroke : "stroke-line-strong",
                    )}
                    strokeDasharray={on ? undefined : "2 4"}
                  />
                  <circle
                    cx={CX + W + 8}
                    cy={y}
                    r={3}
                    className={on ? tone.fill : "fill-line-strong"}
                  />
                  <text
                    x={444}
                    y={y - 4}
                    className={cn(
                      "text-[16px] font-semibold tracking-tight transition-colors duration-500",
                      on ? tone.text : "fill-fg",
                    )}
                  >
                    {layer.title}
                  </text>
                  <text x={444} y={y + 14} className="fill-muted text-[12px]">
                    {layer.sub}
                  </text>
                  <motion.text
                    x={444}
                    y={y + 32}
                    className={cn("text-[11px] font-medium", tone.text)}
                    animate={{ opacity: on ? 1 : 0 }}
                  >
                    Learn it in “{layer.chapterTitle}” →
                  </motion.text>
                </a>
              );
            })}
          </g>
        </svg>
      </motion.div>

      <p className="mt-1 text-center text-sm sm:hidden">
        <span className="font-semibold">{LAYERS[active].title}</span>
        <span className="text-muted"> · {LAYERS[active].sub}</span>
      </p>
      <p className="border-line bg-surface/80 text-muted mx-auto mt-2 w-fit max-w-full rounded-full border px-4 py-2 text-center text-xs backdrop-blur sm:text-sm">
        <span className="text-viz-compute font-semibold">{ENGINES[engine]}</span> reads only{" "}
        <span className="text-fg font-semibold tabular-nums">{hits.length}</span> of {TILE_COUNT}{" "}
        files. Metadata skipped the rest.
      </p>
    </div>
  );
}
