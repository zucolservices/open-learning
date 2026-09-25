"use client";

import { Line } from "@react-three/drei";
import { AnimatedBox, CameraRig, type Vec3 } from "@/toolkit/three/animated-box";
import { SceneCanvas, useSceneColors } from "@/toolkit/three/scene-canvas";
import { LabelAnchors, LabelOverlay, useLabelRefs, type SceneLabel } from "@/toolkit/three/labels";

export const TOKENS = ["The", "Eiffel", "Tower", "is", "in"];
const X = (i: number) => (i - 2) * 1.1;
const LAYER_Y = [1.2, 2.9, 4.6];
const SCORES: [string, number][] = [
  ["Paris", 1],
  ["London", 0.8],
  ["Rome", 0.45],
  ["the", 0.3],
];

function tokenY(frame: number) {
  if (frame <= 1) return 0;
  if (frame <= 4) return frame === 4 ? LAYER_Y[0] + 0.7 : LAYER_Y[0];
  return LAYER_Y[2] + 0.7;
}

function Block({
  frame,
  labels,
  refs,
}: {
  frame: number;
  labels: SceneLabel[];
  refs: ReturnType<typeof useLabelRefs>;
}) {
  const c = useSceneColors();
  const y = tokenY(frame);
  const layers = frame >= 5 ? 3 : frame >= 2 ? 1 : 0;
  const cam: Vec3 = frame >= 6 ? [4.6, 6.2, 10.5] : frame >= 5 ? [5, 4.6, 10] : [3.2, 1.9, 6.2];
  const target: Vec3 = frame >= 6 ? [0, 4.6, 0] : frame >= 5 ? [0, 3.2, 0] : [0, 0.7, 0];
  return (
    <>
      <CameraRig position={cam} target={target} />
      {Array.from({ length: layers }, (_, l) => (
        <group key={l}>
          <AnimatedBox
            position={[0, LAYER_Y[l], 0]}
            size={[5.8, 0.12, 1.1]}
            color={c.accent}
            opacity={frame === 2 || l > 0 ? 0.55 : 0.3}
          />
          {(frame >= 4 || l > 0) && (
            <AnimatedBox
              position={[0, LAYER_Y[l] + 0.7, 0]}
              size={[5.8, 0.12, 1.1]}
              color={c.compute}
              opacity={0.45}
            />
          )}
        </group>
      ))}
      {TOKENS.map((t, i) => (
        <AnimatedBox
          key={t}
          position={[X(i), y, 0]}
          size={[0.42, 0.42, 0.42]}
          color={
            frame === 0
              ? c.idle
              : frame === 4
                ? c.compute
                : i === TOKENS.length - 1 && frame >= 6
                  ? c.accent
                  : c.data
          }
          emissive={frame === 3 || (frame >= 6 && i === TOKENS.length - 1) ? 0.6 : 0.1}
          edgeColor={c.fg}
        />
      ))}
      {frame === 2 &&
        TOKENS.slice(0, -1).map((t, i) => (
          <Line
            key={t}
            points={[
              [X(TOKENS.length - 1), y + 0.25, 0],
              [(X(i) + X(TOKENS.length - 1)) / 2, y + 1 + (TOKENS.length - 1 - i) * 0.15, 0],
              [X(i), y + 0.25, 0],
            ]}
            color={c.accent}
            lineWidth={2}
          />
        ))}
      {frame >= 6 &&
        SCORES.map(([w, s], i) => (
          <AnimatedBox
            key={w}
            position={[X(4) + (i - 1.5) * 0.55, y + 1.1 + s * 0.6, 0]}
            size={[0.35, s * 1.2, 0.35]}
            color={i === 0 ? c.accent : c.meta}
          />
        ))}
      <LabelAnchors labels={labels} refs={refs} />
    </>
  );
}

export function BlockScene({ frame }: { frame: number }) {
  const refs = useLabelRefs();
  const y = tokenY(frame);
  const labels: SceneLabel[] = [
    ...TOKENS.map((t, i) => ({
      id: `t-${t}`,
      position: [X(i), y - 0.45, 0.3] as Vec3,
      visible: frame < 5,
      content: t,
      tone: "muted" as const,
    })),
    {
      id: "attn",
      position: [-3.6, LAYER_Y[0], 0],
      visible: frame >= 2 && frame < 5,
      content: "attention",
      tone: "strong",
    },
    {
      id: "mlp",
      position: [-3.6, LAYER_Y[0] + 0.7, 0],
      visible: frame === 4,
      content: "feed-forward",
      tone: "strong",
    },
    {
      id: "stack",
      position: [-3.9, LAYER_Y[1] + 0.35, 0],
      visible: frame === 5,
      content: "× 12 layers (GPT-2) · × 80 (Llama 3.1 70B)",
      tone: "panel",
    },
    {
      id: "out",
      position: [X(4), y + 2.3, 0],
      visible: frame >= 6,
      content: "Paris · London · Rome · the",
      tone: "strong",
    },
  ];
  return (
    <SceneCanvas
      camera={{ position: [3.2, 1.9, 6.2], fov: 45 }}
      overlay={<LabelOverlay labels={labels} refs={refs} />}
    >
      <Block frame={frame} labels={labels} refs={refs} />
    </SceneCanvas>
  );
}
