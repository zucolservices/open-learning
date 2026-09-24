"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/cn";
import type { Vec3 } from "./animated-box";
import { useSceneMotion } from "./scene-canvas";

/**
 * Labels for 3D scenes, drawn as ordinary DOM elements over the canvas.
 *
 * Inside the canvas, <LabelAnchors> projects each label's 3D position to the
 * screen every frame and moves the matching DOM element. Labels are always
 * mounted and fade in or out, so nothing mounts or unmounts mid-render, and
 * text stays crisp and themed.
 */

export interface SceneLabel {
  id: string;
  position: Vec3;
  visible: boolean;
  content: ReactNode;
  tone?: "muted" | "strong" | "panel";
}

export type LabelRefs = RefObject<Map<string, HTMLDivElement>>;

export function useLabelRefs(): LabelRefs {
  return useRef(new Map<string, HTMLDivElement>());
}

/** Inside the canvas (and inside any moving group the labels should follow). */
export function LabelAnchors({ labels, refs }: { labels: SceneLabel[]; refs: LabelRefs }) {
  const group = useRef<THREE.Group>(null);
  const current = useRef(new Map<string, THREE.Vector3>());
  const scratch = useRef(new THREE.Vector3());
  const animate = useSceneMotion();

  useFrame(({ camera, size }, delta) => {
    const g = group.current;
    if (!g) return;
    const k = animate ? 6 : 1000;
    const d = Math.min(delta, 0.1);
    for (const label of labels) {
      const el = refs.current?.get(label.id);
      if (!el) continue;
      let pos = current.current.get(label.id);
      if (!pos) {
        pos = new THREE.Vector3(...label.position);
        current.current.set(label.id, pos);
      }
      pos.x = THREE.MathUtils.damp(pos.x, label.position[0], k, d);
      pos.y = THREE.MathUtils.damp(pos.y, label.position[1], k, d);
      pos.z = THREE.MathUtils.damp(pos.z, label.position[2], k, d);
      const v = scratch.current.copy(pos).applyMatrix4(g.matrixWorld).project(camera);
      const x = ((v.x + 1) / 2) * size.width;
      const y = ((1 - v.y) / 2) * size.height;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      el.style.opacity = label.visible && v.z < 1 ? "1" : "0";
    }
  });

  return <group ref={group} />;
}

/** Outside the canvas, over it. Pass to <SceneCanvas overlay={…}>. */
export function LabelOverlay({ labels, refs }: { labels: SceneLabel[]; refs: LabelRefs }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {labels.map((label) => (
        <div
          key={label.id}
          ref={(el) => {
            if (el) refs.current?.set(label.id, el);
            else refs.current?.delete(label.id);
          }}
          className={cn(
            "absolute top-0 left-0 opacity-0 transition-opacity duration-300 will-change-transform",
            label.tone === "panel"
              ? "bg-surface/95 ring-line-strong shadow-card w-48 rounded-lg p-2.5 font-mono text-[10px] ring-1 max-sm:w-32 max-sm:p-1.5 max-sm:text-[8px]"
              : "rounded-md px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap backdrop-blur",
            label.tone === "strong" && "bg-surface/90 text-fg ring-line-strong ring-1",
            (label.tone === "muted" || !label.tone) && "bg-surface/70 text-muted",
          )}
        >
          {label.content}
        </div>
      ))}
    </div>
  );
}
