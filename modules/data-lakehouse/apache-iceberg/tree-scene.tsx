"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AnimatedBox, CameraRig, type Vec3 } from "@/toolkit/three/animated-box";
import {
  SceneCanvas,
  useSceneColors,
  useSceneMotion,
  type SceneColors,
} from "@/toolkit/three/scene-canvas";
import {
  LabelAnchors,
  LabelOverlay,
  useLabelRefs,
  type LabelRefs,
  type SceneLabel,
} from "@/toolkit/three/labels";
import { MANIFESTS, QUERIES, type QueryId } from "./data";

/**
 * Iceberg's metadata tree in 3D: catalog → metadata file → manifest list →
 * manifests → data files. Used by the scroll story (`stage` 0–5) and by the
 * query walk-through (`query` + `queryStep` 0–4).
 */

type Tone = "accent" | "meta" | "data" | "compute" | "idle";

interface Node {
  id: string;
  level: number; // 0 catalog … 4 data files
  position: Vec3;
  size: Vec3;
  tone: Tone;
  parent?: string;
}

const LEVEL_Y = [4.4, 3.0, 1.6, 0.1, -1.5];
const MX = [-2.8, 0, 2.8];

const NODES: Node[] = [
  { id: "catalog", level: 0, position: [0, LEVEL_Y[0], 0], size: [1.6, 0.34, 0.9], tone: "accent" },
  {
    id: "meta",
    level: 1,
    position: [0, LEVEL_Y[1], 0],
    size: [1.4, 0.5, 1],
    tone: "meta",
    parent: "catalog",
  },
  {
    id: "old2",
    level: 1,
    position: [-1.9, LEVEL_Y[1], -0.4],
    size: [1.2, 0.44, 0.9],
    tone: "meta",
  },
  {
    id: "old1",
    level: 1,
    position: [-3.3, LEVEL_Y[1], -0.8],
    size: [1.2, 0.44, 0.9],
    tone: "meta",
  },
  {
    id: "mlist",
    level: 2,
    position: [0, LEVEL_Y[2], 0],
    size: [1.8, 0.44, 1],
    tone: "meta",
    parent: "meta",
  },
  ...MANIFESTS.map((m, i): Node => ({
    id: m.id,
    level: 3,
    position: [MX[i], LEVEL_Y[3], 0],
    size: [1.5, 0.4, 0.9],
    tone: "meta",
    parent: "mlist",
  })),
  ...MANIFESTS.flatMap((m, i) =>
    m.files.map((f, j): Node => ({
      id: f.id,
      level: 4,
      position: [MX[i] + (j - 1) * 0.8, LEVEL_Y[4], 0],
      size: [0.56, 0.9, 0.56],
      tone: "data",
      parent: m.id,
    })),
  ),
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

interface Look {
  opacity: number;
  tone: Tone;
  glow: number;
}

type EdgeState = "on" | "dim" | "flow";

interface View {
  camera: Vec3;
  target: Vec3;
  look(n: Node): Look;
  edge(child: Node): EdgeState;
  labels: SceneLabel[];
}

/* Story view ---------------------------------------------------------------- */

const STORY_CAMERAS: [Vec3, Vec3][] = [
  [
    [2.4, 5.9, 7.6],
    [0.9, 3.8, 0],
  ],
  [
    [0.4, 4.1, 9.2],
    [-0.5, 2.8, 0],
  ],
  [
    [2.2, 2.9, 8],
    [0.8, 1.4, 0],
  ],
  [
    [0.6, 1.8, 10.4],
    [0, 0.3, 0],
  ],
  [
    [0.8, 0.6, 11],
    [-0.4, -0.8, 0],
  ],
  [
    [6, 3.6, 11.5],
    [0, 1.3, 0],
  ],
];

const LEVEL_NAMES = ["catalog", "metadata file", "manifest list", "manifests", "data files"];

function levelLabels(show: (level: number) => boolean): SceneLabel[] {
  return LEVEL_NAMES.map((name, level) => ({
    id: `level-${level}`,
    position: [-4.6, LEVEL_Y[level], 0] as Vec3,
    visible: show(level),
    tone: "strong" as const,
    content: name,
  }));
}

function storyView(stage: number): View {
  const [camera, target] = STORY_CAMERAS[Math.min(stage, 5)];
  const panel = (id: string, position: Vec3, visible: boolean, content: ReactNode): SceneLabel => ({
    id,
    position,
    visible,
    tone: "panel",
    content,
  });
  const labels: SceneLabel[] = [
    ...levelLabels((level) => stage === 5 || (level === stage && stage !== 1 && stage !== 0)),
    panel(
      "p-catalog",
      [2.2, LEVEL_Y[0] - 0.1, 0],
      stage === 0,
      <>
        <p className="text-accent font-semibold">catalog · orders</p>
        <p className="text-muted mt-1">current metadata:</p>
        <p className="text-fg break-all">…/metadata/00003-7f3a.metadata.json</p>
        <p className="text-muted mt-1.5">That&apos;s all it stores.</p>
      </>,
    ),
    panel(
      "p-meta",
      [2.1, LEVEL_Y[1], 0],
      stage === 1,
      <>
        <p className="text-viz-meta font-semibold">00003-….metadata.json</p>
        <p className="text-fg mt-1">schema: 5 columns (ids 1–5)</p>
        <p className="text-fg">partition spec: day(order_ts)</p>
        <p className="text-fg">snapshots: S1 · S2 · S3</p>
        <p className="text-fg">current-snapshot-id: S3</p>
        <p className="text-muted mt-1">each snapshot → its manifest list</p>
      </>,
    ),
    {
      id: "old",
      position: [-2.6, LEVEL_Y[1] - 0.62, -0.6],
      visible: stage === 1,
      tone: "muted",
      content: "00001, 00002: older versions",
    },
    panel(
      "p-mlist",
      [2.4, LEVEL_Y[2], 0],
      stage === 2,
      <>
        <p className="text-viz-meta font-semibold">manifest list of S3</p>
        {MANIFESTS.map((m) => (
          <p key={m.id} className="text-fg mt-1">
            {m.id}: day {m.day.slice(5)} · {m.files.length} files
          </p>
        ))}
        <p className="text-muted mt-1">+ counts of added and deleted files</p>
      </>,
    ),
    panel(
      "p-manifest",
      [2.8, LEVEL_Y[3] + 1.25, 0],
      stage === 3,
      <>
        <p className="text-viz-meta font-semibold">manifest m3 · day 09-24</p>
        {MANIFESTS[2].files.map((f) => (
          <p key={f.id} className="text-fg mt-1">
            {f.id}.parquet · amount {f.min}–{f.max}
          </p>
        ))}
        <p className="text-muted mt-1">+ row counts, sizes, null counts</p>
      </>,
    ),
    ...MANIFESTS.flatMap((m) =>
      m.files.map((f): SceneLabel => ({
        id: `file-${f.id}`,
        position: [byId[f.id].position[0], LEVEL_Y[4] - 0.75, 0],
        visible: stage === 4,
        tone: "muted",
        content: f.id,
      })),
    ),
  ];

  return {
    camera,
    target,
    labels,
    look(n) {
      if (n.id.startsWith("old")) return { opacity: stage === 1 ? 0.35 : 0, tone: "idle", glow: 0 };
      if (stage === 5) return { opacity: 1, tone: n.tone, glow: 0.08 };
      if (n.level === stage) return { opacity: 1, tone: n.tone, glow: 0.35 };
      if (n.level < stage) return { opacity: 0.55, tone: n.tone, glow: 0.05 };
      return { opacity: 0.16, tone: n.tone, glow: 0 };
    },
    edge(child) {
      if (stage === 5) return "on";
      return child.level <= stage ? "on" : "dim";
    },
  };
}

/* Query view ---------------------------------------------------------------- */

const QUERY_CAMERAS: [Vec3, Vec3][] = [
  [
    [3.0, 4.1, 11.3],
    [-0.4, 1.85, 0.0],
  ],
  [
    [2.6, 4.4, 10.7],
    [-0.4, 1.95, 0.0],
  ],
  [
    [2.6, 3.8, 10.7],
    [-0.4, 1.75, 0.0],
  ],
  [
    [2.6, 3.2, 10.7],
    [-0.4, 1.55, 0.0],
  ],
  [
    [2.6, 2.8, 10.7],
    [-0.4, 1.45, 0.0],
  ],
];

/** Which nodes the query has reached (read) and which it skipped, at a step. */
export function queryReach(queryId: QueryId, step: number) {
  const q = QUERIES[queryId];
  const keptManifests = new Set(MANIFESTS.filter(q.keepManifest).map((m) => m.id));
  const keptFiles = new Set(
    MANIFESTS.filter(q.keepManifest)
      .flatMap((m) => m.files)
      .filter(q.keepFile)
      .map((f) => f.id),
  );
  const status = (n: Node): "read" | "skipped" | "pending" => {
    if (n.level > step) return "pending";
    if (n.level === 3) return keptManifests.has(n.id) ? "read" : "skipped";
    if (n.level === 4) {
      const parentKept = keptManifests.has(n.parent!);
      if (!parentKept) return "skipped";
      return keptFiles.has(n.id) ? "read" : "skipped";
    }
    return "read";
  };
  return { keptManifests, keptFiles, status };
}

function queryView(queryId: QueryId, step: number): View {
  const [camera, target] = QUERY_CAMERAS[Math.min(step, 4)];
  const { status } = queryReach(queryId, step);
  const labels: SceneLabel[] = [
    ...levelLabels((level) => level <= step || step === 0),
    ...NODES.filter((n) => n.level >= 3).map((n): SceneLabel => ({
      id: `q-${n.id}`,
      position:
        n.level === 3
          ? [n.position[0], n.position[1] + 0.45, 0]
          : [n.position[0], n.position[1] - 0.75, 0],
      visible: true,
      tone: status(n) === "read" ? "strong" : "muted",
      content: n.id,
    })),
  ];
  return {
    camera,
    target,
    labels,
    look(n) {
      if (n.id.startsWith("old")) return { opacity: 0, tone: "idle", glow: 0 };
      const s = status(n);
      if (s === "pending") return { opacity: 0.55, tone: n.tone, glow: 0.04 };
      if (s === "skipped") return { opacity: 0.22, tone: "idle", glow: 0 };
      if (n.level === 4) return { opacity: 1, tone: "compute", glow: 0.5 };
      return { opacity: 1, tone: n.tone, glow: 0.3 };
    },
    edge(child) {
      if (step === 0) return "on";
      const s = status(child);
      if (s === "read") return "flow";
      if (s === "skipped") return "dim";
      return "on";
    },
  };
}

/* Rendering ----------------------------------------------------------------- */

function toneColor(c: SceneColors, tone: Tone) {
  return tone === "accent"
    ? c.accent
    : tone === "meta"
      ? c.meta
      : tone === "data"
        ? c.data
        : tone === "compute"
          ? c.compute
          : c.idle;
}

function Edges({ view, c }: { view: View; c: SceneColors }) {
  const edges = NODES.filter((n) => n.parent);
  const groups = useMemo(() => {
    const out: Record<EdgeState, number[]> = { on: [], dim: [], flow: [] };
    for (const child of edges) {
      const p = byId[child.parent!];
      out[view.edge(child)].push(
        p.position[0],
        p.position[1] - p.size[1] / 2,
        p.position[2],
        child.position[0],
        child.position[1] + child.size[1] / 2,
        child.position[2],
      );
    }
    return out;
  }, [view, edges]);

  return (
    <>
      <Segments points={groups.on} color={c.line} opacity={0.9} />
      <Segments points={groups.dim} color={c.line} opacity={0.18} />
      <Segments points={groups.flow} color={c.compute} opacity={1} />
      <FlowDots points={groups.flow} color={c.compute} />
    </>
  );
}

function Segments({
  points,
  color,
  opacity,
}: {
  points: number[];
  color: string;
  opacity: number;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return g;
  }, [points]);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

/** Small dots travelling down each edge the query follows. */
function FlowDots({ points, color }: { points: number[]; color: string }) {
  const group = useRef<THREE.Group>(null);
  const animate = useSceneMotion();
  const count = points.length / 6;
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((dot, i) => {
      const t = animate ? (clock.elapsedTime * 0.7 + (i % 3) * 0.2) % 1 : 0.5;
      const o = i * 6;
      dot.position.set(
        points[o] + (points[o + 3] - points[o]) * t,
        points[o + 1] + (points[o + 4] - points[o + 1]) * t,
        points[o + 2] + (points[o + 5] - points[o + 2]) * t,
      );
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function TreeScene({ view, refs }: { view: View; refs: LabelRefs }) {
  const c = useSceneColors();
  return (
    <>
      <CameraRig position={view.camera} target={view.target} />
      <group>
        {NODES.map((n) => {
          const look = view.look(n);
          return (
            <AnimatedBox
              key={n.id}
              position={n.position}
              size={n.size}
              color={toneColor(c, look.tone)}
              opacity={look.opacity}
              emissive={look.glow}
              edgeColor={look.opacity > 0.3 ? c.line : undefined}
            />
          );
        })}
        <Edges view={view} c={c} />
        <LabelAnchors labels={view.labels} refs={refs} />
      </group>
    </>
  );
}

export function IcebergTree({ stage }: { stage: number }) {
  const refs = useLabelRefs();
  const view = useMemo(() => storyView(stage), [stage]);
  return (
    <SceneCanvas
      camera={{ position: STORY_CAMERAS[0][0], fov: 40 }}
      overlay={<LabelOverlay labels={view.labels} refs={refs} />}
    >
      <TreeScene view={view} refs={refs} />
    </SceneCanvas>
  );
}

export function IcebergQueryTree({ query, step }: { query: QueryId; step: number }) {
  const refs = useLabelRefs();
  const view = useMemo(() => queryView(query, step), [query, step]);
  return (
    <SceneCanvas
      camera={{ position: QUERY_CAMERAS[0][0], fov: 40 }}
      overlay={<LabelOverlay labels={view.labels} refs={refs} />}
    >
      <TreeScene view={view} refs={refs} />
    </SceneCanvas>
  );
}
