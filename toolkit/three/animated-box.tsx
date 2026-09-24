"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { useSceneMotion } from "./scene-canvas";

export type Vec3 = [number, number, number];

/**
 * A box that eases toward its target position, size, colour and opacity every
 * frame, so a scene can just declare "where things should be" per stage.
 */
export function AnimatedBox({
  position,
  size,
  color,
  opacity = 1,
  edgeColor,
  emissive = 0,
  onClick,
}: {
  position: Vec3;
  size: Vec3;
  color: string;
  opacity?: number;
  edgeColor?: string;
  emissive?: number;
  onClick?: () => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const animate = useSceneMotion();
  const target = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    const m = mesh.current;
    const mat = material.current;
    if (!m || !mat) return;
    const k = animate ? 6 : 1000; // damping speed; effectively instant for reduced motion
    const d = Math.min(delta, 0.1);
    m.position.x = THREE.MathUtils.damp(m.position.x, position[0], k, d);
    m.position.y = THREE.MathUtils.damp(m.position.y, position[1], k, d);
    m.position.z = THREE.MathUtils.damp(m.position.z, position[2], k, d);
    m.scale.x = THREE.MathUtils.damp(m.scale.x, size[0], k, d);
    m.scale.y = THREE.MathUtils.damp(m.scale.y, size[1], k, d);
    m.scale.z = THREE.MathUtils.damp(m.scale.z, size[2], k, d);
    mat.opacity = THREE.MathUtils.damp(mat.opacity, opacity, k, d);
    mat.color.lerp(target, Math.min(1, k * d));
    mat.emissive.copy(mat.color).multiplyScalar(emissive);
    m.visible = mat.opacity > 0.02;
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      scale={size}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={material}
        color={color}
        transparent
        opacity={opacity}
        roughness={0.55}
        metalness={0.05}
      />
      {edgeColor && <Edges color={edgeColor} />}
    </mesh>
  );
}

/** Eases the camera toward a position and look-at target. */
export function CameraRig({ position, target }: { position: Vec3; target: Vec3 }) {
  const animate = useSceneMotion();
  const look = useRef(new THREE.Vector3(...target));
  useFrame(({ camera }, delta) => {
    const k = animate ? 2.6 : 1000;
    const d = Math.min(delta, 0.1);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, position[0], k, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, position[1], k, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, position[2], k, d);
    look.current.x = THREE.MathUtils.damp(look.current.x, target[0], k, d);
    look.current.y = THREE.MathUtils.damp(look.current.y, target[1], k, d);
    look.current.z = THREE.MathUtils.damp(look.current.z, target[2], k, d);
    camera.lookAt(look.current);
  });
  return null;
}
