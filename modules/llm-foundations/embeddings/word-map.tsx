"use client";

import { useMemo } from "react";
import { OrbitControls, Line } from "@react-three/drei";
import { SceneCanvas, useSceneColors } from "@/toolkit/three/scene-canvas";
import { LabelAnchors, LabelOverlay, useLabelRefs, type SceneLabel } from "@/toolkit/three/labels";
import type { Vec3 } from "@/toolkit/three/animated-box";
import { GROUPS, WORDS, nearest } from "./vectors";

const S = 3.9;
const pos = (p: [number, number, number]): Vec3 => [p[0] * S, p[1] * S, p[2] * S];

function Points({
  picked,
  onPick,
  labels,
  refs,
}: {
  picked: string | null;
  onPick: (t: string) => void;
  labels: SceneLabel[];
  refs: ReturnType<typeof useLabelRefs>;
}) {
  const c = useSceneColors();
  const palette: Record<string, string> = {
    royalty: c.accent,
    drinks: c.compute,
    animals: c.add,
    transport: c.data,
    feelings: c.remove,
    places: c.meta,
  };
  const near = useMemo(() => {
    if (!picked) return [];
    const w = WORDS.find((x) => x.text === picked)!;
    return nearest(w.v, WORDS, [picked], 3).map((n) => WORDS.find((x) => x.text === n.text)!);
  }, [picked]);
  const pw = picked ? WORDS.find((x) => x.text === picked) : undefined;
  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={!picked}
        autoRotateSpeed={0.6}
      />
      {WORDS.map((w) => {
        const on = w.text === picked;
        const isNear = near.some((n) => n.text === w.text);
        return (
          <mesh
            key={w.text}
            position={pos(w.p)}
            onClick={(e) => {
              e.stopPropagation();
              onPick(w.text);
            }}
            scale={on ? 1.8 : isNear ? 1.35 : 1}
          >
            <sphereGeometry args={[0.09, 20, 20]} />
            <meshStandardMaterial
              color={palette[w.group]}
              emissive={palette[w.group]}
              emissiveIntensity={on ? 0.8 : 0.2}
            />
          </mesh>
        );
      })}
      {pw &&
        near.map((n) => (
          <Line
            key={n.text}
            points={[pos(pw.p), pos(n.p)]}
            color={c.fg}
            lineWidth={1.2}
            dashed
            dashSize={0.1}
            gapSize={0.07}
          />
        ))}
      <LabelAnchors labels={labels} refs={refs} />
    </>
  );
}

export function WordMap({
  picked,
  onPick,
}: {
  picked: string | null;
  onPick: (t: string) => void;
}) {
  const refs = useLabelRefs();
  const focus = picked
    ? [
        picked,
        ...nearest(WORDS.find((x) => x.text === picked)!.v, WORDS, [picked], 3).map((n) => n.text),
      ]
    : null;
  const labels: SceneLabel[] = WORDS.map((w) => ({
    id: w.text,
    position: [pos(w.p)[0], pos(w.p)[1] + 0.22, pos(w.p)[2]],
    visible: !focus || focus.includes(w.text),
    content: w.text,
    tone: w.text === picked ? "strong" : "muted",
  }));
  return (
    <SceneCanvas
      camera={{ position: [0, 0.8, 8.6], fov: 50 }}
      overlay={<LabelOverlay labels={labels} refs={refs} />}
    >
      <Points picked={picked} onPick={onPick} labels={labels} refs={refs} />
    </SceneCanvas>
  );
}

export const GROUP_LABELS: Record<(typeof GROUPS)[number], string> = {
  royalty: "people & royalty",
  drinks: "drinks",
  animals: "animals",
  transport: "transport",
  feelings: "feelings",
  places: "places",
};
