import type { ReactNode } from "react";

/**
 * Shared pieces for the per-module card illustrations (viewBox 160 × 100). Elements with the `A`
 * class animate a little when the card (a `group`) is hovered: pure CSS, free at rest.
 */

export const A = "art"; // animated element: transform-box fill-box + transition (globals.css)

/** Isometric slab centred at (x, y). */
export function Slab({
  x,
  y,
  w = 34,
  h = 17,
  t = 5,
  cls,
  className = "",
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  t?: number;
  cls: string;
  className?: string;
}) {
  return (
    <g className={className}>
      <polygon
        points={`${x - w},${y} ${x},${y + h} ${x},${y + h + t} ${x - w},${y + t}`}
        className={cls}
        opacity={0.55}
      />
      <polygon
        points={`${x},${y + h} ${x + w},${y} ${x + w},${y + t} ${x},${y + h + t}`}
        className={cls}
        opacity={0.8}
      />
      <polygon
        points={`${x},${y - h} ${x + w},${y} ${x},${y + h} ${x - w},${y}`}
        className={cls}
        strokeWidth={1.2}
      />
    </g>
  );
}

export function FileIcon({
  x,
  y,
  cls = "fill-viz-data/25 stroke-viz-data",
  className = "",
  w = 12,
  h = 16,
}: {
  x: number;
  y: number;
  cls?: string;
  className?: string;
  w?: number;
  h?: number;
}) {
  return (
    <path
      d={`M${x} ${y}h${w - 4}l4 4v${h - 4}h-${w}z`}
      className={`${cls} ${className}`}
      strokeWidth={1.2}
    />
  );
}

export type ArtMap = Record<string, () => ReactNode>;
