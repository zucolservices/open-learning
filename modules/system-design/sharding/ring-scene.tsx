"use client";

import { useMemo } from "react";
import { AnimatedBox, CameraRig, type Vec3 } from "@/toolkit/three/animated-box";
import { SceneCanvas, useSceneColors } from "@/toolkit/three/scene-canvas";
import { LabelAnchors, LabelOverlay, useLabelRefs, type SceneLabel } from "@/toolkit/three/labels";
import { KEYS, SERVER_NAMES, angleOf, assignment, hash, ringPoints, type Scheme } from "./model";

const R = 3;
const at = (angle: number, radius = R, y = 0): Vec3 => [
  Math.cos(angle) * radius,
  y,
  Math.sin(angle) * radius,
];

function Ring({
  servers,
  scheme,
  labels,
  refs,
}: {
  servers: number;
  scheme: Scheme;
  labels: SceneLabel[];
  refs: ReturnType<typeof useLabelRefs>;
}) {
  const c = useSceneColors();
  const palette = [c.data, c.meta, c.compute, c.add, c.accent];
  const now = useMemo(() => assignment(servers, scheme), [servers, scheme]);
  const before = useMemo(
    () => (servers > 3 ? assignment(servers - 1, scheme) : now),
    [servers, scheme, now],
  );
  const points = useMemo(() => ringPoints(servers, scheme), [servers, scheme]);
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 8, 5]} intensity={1.1} />
      <CameraRig position={[0, 7.2, 7.4]} target={[0, -0.3, 0]} />
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[R, 0.015, 8, 160]} />
        <meshBasicMaterial color={c.line} />
      </mesh>
      {KEYS.map((k, i) => {
        const moved = now[i] !== before[i];
        return (
          <AnimatedBox
            key={k}
            position={at(angleOf(hash(k)), R, moved ? 0.25 : 0)}
            size={moved ? [0.2, 0.2, 0.2] : [0.13, 0.13, 0.13]}
            color={palette[now[i]]}
            emissive={moved ? 0.6 : 0.05}
          />
        );
      })}
      {scheme === "mod"
        ? Array.from({ length: servers }, (_, s) => (
            <AnimatedBox
              key={`m${s}`}
              position={at((s / servers) * Math.PI * 2, R + 1.1, 0.2)}
              size={[0.45, 0.6, 0.45]}
              color={palette[s]}
              edgeColor={c.fg}
            />
          ))
        : points.map((p, i) => (
            <AnimatedBox
              key={`p${p.server}-${i}`}
              position={at(angleOf(p.h), R + 0.35, 0.1)}
              size={scheme === "vnodes" ? [0.12, 0.3, 0.12] : [0.35, 0.55, 0.35]}
              color={palette[p.server]}
              edgeColor={scheme === "vnodes" ? undefined : c.fg}
            />
          ))}
      <LabelAnchors labels={labels} refs={refs} />
    </>
  );
}

export function RingScene({ servers, scheme }: { servers: number; scheme: Scheme }) {
  const refs = useLabelRefs();
  const labels: SceneLabel[] = SERVER_NAMES.map((name, s) => {
    let position: Vec3 = [0, -10, 0];
    if (s < servers) {
      if (scheme === "mod") position = at((s / servers) * Math.PI * 2, R + 1.1, 0.8);
      else {
        const first = ringPoints(servers, scheme).find((p) => p.server === s)!;
        position = at(angleOf(first.h), R + 0.9, 0.5);
      }
    }
    return {
      id: name,
      position,
      visible: s < servers && scheme !== "vnodes",
      content: `Server ${name}`,
      tone: "strong",
    };
  });
  return (
    <SceneCanvas
      camera={{ position: [0, 7.2, 7.4], fov: 45 }}
      overlay={<LabelOverlay labels={labels} refs={refs} />}
    >
      <Ring servers={servers} scheme={scheme} labels={labels} refs={refs} />
    </SceneCanvas>
  );
}
