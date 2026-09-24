"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Shared 3D canvas for modules.
 * - Colours come from the site's CSS tokens, so scenes follow light/dark and the track accent.
 * - Rendering pauses when the canvas is off screen.
 * - Falls back to a message when WebGL isn't available.
 */

export type SceneColors = Record<
  | "fg"
  | "muted"
  | "line"
  | "surface"
  | "accent"
  | "data"
  | "meta"
  | "compute"
  | "add"
  | "remove"
  | "idle",
  string
>;

const TOKENS: Record<keyof SceneColors, string> = {
  fg: "--fg",
  muted: "--muted",
  line: "--line-strong",
  surface: "--surface-2",
  accent: "--accent",
  data: "--viz-data",
  meta: "--viz-meta",
  compute: "--viz-compute",
  add: "--viz-add",
  remove: "--viz-remove",
  idle: "--viz-idle",
};

const FALLBACK: SceneColors = {
  fg: "#e8ecf3",
  muted: "#9aa3b5",
  line: "#2a2f3a",
  surface: "#181c25",
  accent: "#2dd4bf",
  data: "#60a5fa",
  meta: "#a78bfa",
  compute: "#fbbf24",
  add: "#34d399",
  remove: "#fb7185",
  idle: "#475569",
};

/** Resolve a CSS colour (which may be rgb(... / a)) to an opaque hex three.js understands. */
function toHex(value: string, fallback: string): string {
  const v = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  const m = v.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (m)
    return `#${[m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`;
  return fallback;
}

function readColors(el: Element): SceneColors {
  const style = getComputedStyle(el);
  const out = { ...FALLBACK };
  for (const key of Object.keys(TOKENS) as (keyof SceneColors)[]) {
    out[key] = toHex(style.getPropertyValue(TOKENS[key]), FALLBACK[key]);
  }
  return out;
}

const ColorsContext = createContext<SceneColors>(FALLBACK);
export const useSceneColors = () => useContext(ColorsContext);

const MotionContext = createContext(true);
/** False when the learner prefers reduced motion: scenes should jump, not glide. */
export const useSceneMotion = () => useContext(MotionContext);

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function SceneCanvas({
  children,
  camera = { position: [6, 3, 8], fov: 40 },
  className,
  fallback,
  overlay,
}: {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  className?: string;
  fallback?: ReactNode;
  /** DOM drawn over the canvas, e.g. a <LabelOverlay>. */
  overlay?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduced = useReducedMotion();
  const [colors, setColors] = useState<SceneColors>(FALLBACK);
  // Modules render client-side only, so the WebGL check can run during the first render.
  const [webgl] = useState<boolean>(() => (typeof document === "undefined" ? false : hasWebGL()));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setColors(readColors(el));
    const frame = requestAnimationFrame(update);
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const message = fallback ?? (
    <div className="text-muted grid h-full place-items-center p-6 text-center text-sm">
      This 3D view needs WebGL, which isn&apos;t available in this browser. The narration covers the
      same ideas.
    </div>
  );

  return (
    <div ref={ref} className={className ?? "relative h-full w-full"}>
      {!webgl ? (
        message
      ) : (
        <ColorsContext.Provider value={colors}>
          <MotionContext.Provider value={!reduced}>
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: camera.position, fov: camera.fov ?? 40 }}
              frameloop={inView ? "always" : "never"}
              gl={{ antialias: true, alpha: true }}
              fallback={message}
            >
              <ColorsBridge colors={colors} reduced={!!reduced}>
                <ambientLight intensity={0.75} />
                <directionalLight position={[5, 8, 6]} intensity={1.1} />
                <directionalLight position={[-6, -2, -4]} intensity={0.35} />
                {children}
              </ColorsBridge>
            </Canvas>
          </MotionContext.Provider>
        </ColorsContext.Provider>
      )}
      {webgl && overlay}
    </div>
  );
}

/** React context doesn't cross into the R3F reconciler automatically, so re-provide it inside. */
function ColorsBridge({
  colors,
  reduced,
  children,
}: {
  colors: SceneColors;
  reduced: boolean;
  children: ReactNode;
}) {
  return (
    <ColorsContext.Provider value={colors}>
      <MotionContext.Provider value={!reduced}>{children}</MotionContext.Provider>
    </ColorsContext.Provider>
  );
}
