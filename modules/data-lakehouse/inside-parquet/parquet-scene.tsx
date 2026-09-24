"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AnimatedBox, CameraRig, type Vec3 } from "@/toolkit/three/animated-box";
import { SceneCanvas, useSceneColors, useSceneMotion } from "@/toolkit/three/scene-canvas";
import {
  LabelAnchors,
  LabelOverlay,
  useLabelRefs,
  type LabelRefs,
  type SceneLabel,
} from "@/toolkit/three/labels";

/**
 * The 3D Parquet file used by the scroll story. `stage` (0–5) is the story
 * section: whole file → row groups → column chunks → pages → values → footer.
 */

export const COLS = ["order_id", "customer", "city", "amount", "status"];
const AMOUNT = 3;
const STATUS = 4;
const RGS = 3;
const W = 0.9; // chunk width
const H = 0.55; // chunk height
const D = 1.4; // chunk depth
const CAP = 0.14;

/** Footer statistics shown in the last stage (amount column, per row group). */
export const FOOTER_STATS = [
  { rg: 1, min: 90, max: 480 },
  { rg: 2, min: 60, max: 380 },
  { rg: 3, min: 75, max: 455 },
];

interface Layout {
  gapX: number; // gap between column chunks in row group 1
  gapY: number; // gap between row groups
  camera: Vec3;
  target: Vec3;
}

function layout(stage: number): Layout {
  switch (stage) {
    case 0:
      return { gapX: 0.02, gapY: 0.02, camera: [6.2, 3.4, 7.2], target: [0, -0.2, 0] };
    case 1:
      return { gapX: 0.02, gapY: 0.5, camera: [7.4, 2.4, 9], target: [0, -0.6, 0] };
    case 2:
      return { gapX: 0.4, gapY: 0.5, camera: [0.8, 3.0, 7.4], target: [0.2, 0.7, 0] };
    case 3:
    case 4:
      return { gapX: 0.4, gapY: 0.5, camera: [1.6, 2.4, 6.6], target: [0.8, 0.8, 0.8] };
    default:
      return { gapX: 0.02, gapY: 0.5, camera: [6.4, 0.6, 9.6], target: [0.4, -1.1, 0] };
  }
}

const rgY = (i: number, gapY: number) => 1.0 - i * (H + gapY);
const colX = (j: number, gapX: number) => (j - (COLS.length - 1) / 2) * (W + gapX);

function Sway({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const animate = useSceneMotion();
  useFrame(({ clock }) => {
    if (group.current && animate)
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.06;
  });
  return <group ref={group}>{children}</group>;
}

function geometry(stage: number) {
  const L = layout(stage);
  const otherGapX = 0.02;
  const lastY = rgY(RGS - 1, L.gapY);
  const width = COLS.length * W + (COLS.length - 1) * otherGapX;
  const footerY = lastY - H / 2 - L.gapY * 0.6 - 0.2;
  const capTopY = rgY(0, L.gapY) + H / 2 + CAP / 2 + L.gapY * 0.3;
  const capBottomY = footerY - 0.2 - CAP / 2 - L.gapY * 0.3;
  return { L, rg0GapX: L.gapX, otherGapX, width, footerY, capTopY, capBottomY };
}

/** Every label the scene can show; `visible` depends on the stage. */
export function parquetLabels(stage: number): SceneLabel[] {
  const { L, rg0GapX, width, footerY, capTopY, capBottomY } = geometry(stage);
  const ax = colX(AMOUNT, rg0GapX);
  const sx = colX(STATUS, rg0GapX);
  const y0 = rgY(0, L.gapY);
  const labels: SceneLabel[] = [
    {
      id: "title",
      position: [0, capTopY + 0.35, 0],
      visible: stage === 0,
      tone: "strong",
      content: "orders.parquet · 3 row groups · 5 columns",
    },
    {
      id: "par1-top",
      position: [0, capTopY + 0.28, 0],
      visible: stage === 1 || stage === 5,
      content: "PAR1",
    },
    {
      id: "par1-bottom",
      position: [0, capBottomY - 0.28, 0],
      visible: stage === 1 || stage === 5,
      content: "length + PAR1",
    },
    {
      id: "footer",
      position: [-width / 2 - 0.9, footerY, 0],
      visible: stage === 1 || stage === 5,
      tone: "strong",
      content: "footer",
    },
    ...Array.from({ length: RGS }, (_, i): SceneLabel => ({
      id: `rg${i}`,
      position: [-width / 2 - 0.9, rgY(i, L.gapY), 0],
      visible: stage === 1 || stage === 5,
      tone: "strong",
      content: `row group ${i + 1}`,
    })),
    ...COLS.map((col, j): SceneLabel => ({
      id: `col-${col}`,
      position: [colX(j, rg0GapX), y0 + H / 2 + 0.28, 0],
      visible: stage === 2,
      tone: j === AMOUNT ? "strong" : "muted",
      content: col,
    })),
    {
      id: "pages",
      position: [ax, y0 + H / 2 + 0.45, 1.3],
      visible: stage === 3,
      tone: "strong",
      content: "amount: 3 data pages",
    },
    {
      id: "dict",
      position: [sx, y0 + 0.55, 1.2],
      visible: stage === 3,
      tone: "strong",
      content: "status: dictionary page",
    },
    {
      id: "amount-values",
      position: [ax - 1.45, y0 + 0.1, 1.3],
      visible: stage === 4,
      tone: "panel",
      content: (
        <>
          <p className="text-viz-compute font-semibold">amount · page 1</p>
          <p className="text-fg mt-1">240 150 90 480 160 250 …</p>
          <p className="text-muted mt-1">plain numbers, then compressed</p>
        </>
      ),
    },
    {
      id: "status-values",
      position: [sx - 0.2, y0 + 1.15, 1.2],
      visible: stage === 4,
      tone: "panel",
      content: (
        <>
          <p className="text-viz-meta font-semibold">status</p>
          <p className="text-muted mt-1">dictionary: 0=paid 1=open 2=refund</p>
          <p className="text-fg mt-1">data: 0×20 1×5 0×10 2×2 …</p>
        </>
      ),
    },
    {
      id: "footer-stats",
      position: [0.9, footerY - 1.15, 0.9],
      visible: stage === 5,
      tone: "panel",
      content: (
        <>
          <p className="text-viz-meta font-semibold">footer: amount stats</p>
          {FOOTER_STATS.map((st) => (
            <p key={st.rg} className="text-fg mt-1">
              row group {st.rg}: min {st.min} · max {st.max}
            </p>
          ))}
          <p className="text-muted mt-1.5">+ schema, offsets, row counts</p>
        </>
      ),
    },
  ];
  return labels;
}

/** The scene plus its label overlay, ready to drop into a scroll story. */
export function ParquetZoom({ stage }: { stage: number }) {
  const refs = useLabelRefs();
  const labels = parquetLabels(stage);
  return (
    <SceneCanvas
      camera={{ position: [6.2, 3.4, 7.2], fov: 40 }}
      overlay={<LabelOverlay labels={labels} refs={refs} />}
    >
      <ParquetScene stage={stage} labels={labels} refs={refs} />
    </SceneCanvas>
  );
}

export function ParquetScene({
  stage,
  labels,
  refs,
}: {
  stage: number;
  labels: SceneLabel[];
  refs: LabelRefs;
}) {
  const c = useSceneColors();
  const L = layout(stage);
  const rg0GapX = L.gapX;
  const otherGapX = 0.02;
  const lastY = rgY(RGS - 1, L.gapY);
  const width = COLS.length * W + (COLS.length - 1) * otherGapX;
  const footerY = lastY - H / 2 - L.gapY * 0.6 - 0.2;
  const capTopY = rgY(0, L.gapY) + H / 2 + CAP / 2 + L.gapY * 0.3;
  const capBottomY = footerY - 0.2 - CAP / 2 - L.gapY * 0.3;

  const focusRg0 = stage >= 2 && stage <= 4;
  const pagesOut = stage >= 3 && stage <= 4;
  const footerFocus = stage === 5;

  const boxes: ReactNode[] = [];

  // PAR1 magic at both ends
  boxes.push(
    <AnimatedBox
      key="capTop"
      position={[0, capTopY, 0]}
      size={[width, CAP, D]}
      color={c.idle}
      opacity={focusRg0 ? 0.15 : 0.9}
    />,
    <AnimatedBox
      key="capBottom"
      position={[0, capBottomY, 0]}
      size={[width, CAP, D]}
      color={c.idle}
      opacity={focusRg0 ? 0.15 : 0.9}
    />,
  );

  // Row groups × column chunks
  for (let i = 0; i < RGS; i++) {
    for (let j = 0; j < COLS.length; j++) {
      const gx = i === 0 ? rg0GapX : otherGapX;
      const hideAmountChunk = i === 0 && j === AMOUNT && pagesOut;
      let opacity = 1;
      if (focusRg0 && i !== 0) opacity = 0.1;
      if (hideAmountChunk) opacity = 0;
      if (footerFocus) opacity = 0.3;
      const highlight = focusRg0 && i === 0 && j === AMOUNT;
      boxes.push(
        <AnimatedBox
          key={`c${i}${j}`}
          position={[colX(j, gx), rgY(i, L.gapY), 0]}
          size={[W, H, D]}
          color={highlight ? c.compute : c.data}
          opacity={opacity}
          emissive={highlight ? 0.25 : 0.05}
          edgeColor={stage >= 1 ? c.line : undefined}
        />,
      );
    }
  }

  // Pages of the amount chunk (row group 1), pulled forward
  const ax = colX(AMOUNT, rg0GapX);
  const pageH = (H - 0.08) / 3;
  for (let k = 0; k < 3; k++) {
    const y = rgY(0, L.gapY) + H / 2 - pageH / 2 - k * (pageH + 0.04);
    boxes.push(
      <AnimatedBox
        key={`p${k}`}
        position={pagesOut ? [ax, y + (k - 1) * 0.12, 1.3] : [ax, rgY(0, L.gapY), 0]}
        size={pagesOut ? [W, pageH, 0.6] : [W * 0.9, pageH, D * 0.9]}
        color={c.compute}
        opacity={pagesOut ? 1 : 0}
        emissive={0.15}
        edgeColor={c.line}
      />,
    );
  }
  // Dictionary page in front of the status chunk
  const sx = colX(STATUS, rg0GapX);
  boxes.push(
    <AnimatedBox
      key="dict"
      position={pagesOut ? [sx, rgY(0, L.gapY) + 0.28, 1.2] : [sx, rgY(0, L.gapY), 0]}
      size={pagesOut ? [W, 0.16, 0.5] : [W * 0.8, 0.1, D * 0.8]}
      color={c.meta}
      opacity={pagesOut ? 1 : 0}
      emissive={0.2}
      edgeColor={c.line}
    />,
  );

  // Footer
  boxes.push(
    <AnimatedBox
      key="footer"
      position={[0, footerY, 0]}
      size={[width, 0.34, D]}
      color={c.meta}
      opacity={focusRg0 ? 0.15 : 1}
      emissive={footerFocus ? 0.45 : 0.1}
      edgeColor={c.line}
    />,
  );

  return (
    <>
      <CameraRig position={L.camera} target={L.target} />
      <Sway>
        {boxes}
        <LabelAnchors labels={labels} refs={refs} />
      </Sway>
    </>
  );
}
