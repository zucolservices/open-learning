import type { ReactNode } from "react";
import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Mobile track (modules 1–11), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const DATA = "fill-viz-data/25 stroke-viz-data";
const META = "fill-viz-meta/25 stroke-viz-meta";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

/** A phone outline with a home indicator; children draw on its screen. */
export function Phone({
  x,
  y,
  w = 34,
  h = 60,
  className = "",
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <g className={className}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.2}
      />
      <rect
        x={x + w / 2 - 5}
        y={y + 3}
        width={10}
        height={2.5}
        rx={1.2}
        className="fill-line-strong"
      />
      <rect
        x={x + w / 2 - 7}
        y={y + h - 4}
        width={14}
        height={1.4}
        rx={0.7}
        className="fill-line-strong"
      />
      {children}
    </g>
  );
}

export const mobileArtA: ArtMap = {
  "how-mobile-differs": () => (
    <>
      <rect
        x={14}
        y={30}
        width={56}
        height={36}
        rx={3}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <rect x={8} y={66} width={68} height={4} rx={1.5} className="fill-line-strong" />
      <Phone x={100} y={22} className={`${A} group-hover:-rotate-6`}>
        <rect x={105} y={34} width={24} height={6} rx={2} className={HOT} />
        <rect x={105} y={44} width={24} height={6} rx={2} className={DATA} />
        <rect x={105} y={62} width={24} height={9} rx={4} className={GOOD} />
      </Phone>
      <text x={10} y={90} className={T}>
        desk vs pocket
      </text>
    </>
  ),

  "native-vs-cross": () => (
    <>
      <Svc
        x={60}
        y={14}
        w={40}
        h={14}
        label="one codebase"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Arrow x1={72} y1={30} x2={44} y2={44} />
      <Arrow x1={88} y1={30} x2={116} y2={44} />
      <Phone x={26} y={46} w={30} h={44}>
        <text x={41} y={72} textAnchor="middle" className={T}>
          iOS
        </text>
      </Phone>
      <Phone x={104} y={46} w={30} h={44}>
        <text x={119} y={72} textAnchor="middle" className={T}>
          And.
        </text>
      </Phone>
    </>
  ),

  "app-lifecycle": () => (
    <>
      {[
        ["active", GOOD],
        ["inactive", META],
        ["background", DATA],
        ["killed", BAD],
      ].map(([t, cls], i) => (
        <g key={t}>
          <rect
            x={10 + i * 37}
            y={40}
            width={32}
            height={18}
            rx={9}
            className={`${cls} ${i === 3 ? `${A} group-hover:scale-110` : ""}`}
            strokeWidth={1.1}
          />
          <text
            x={26 + i * 37}
            y={51}
            textAnchor="middle"
            className="fill-fg font-mono text-[5.5px]"
          >
            {t}
          </text>
          {i < 3 && <Arrow x1={43 + i * 37} y1={49} x2={46 + i * 37} y2={49} />}
        </g>
      ))}
      <text x={10} y={80} className={T}>
        save state before it&apos;s gone
      </text>
    </>
  ),

  "declarative-ui": () => (
    <>
      <rect
        x={12}
        y={22}
        width={58}
        height={56}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.1}
      />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={18}
          y={30 + i * 11}
          width={[44, 32, 38, 26][i]}
          height={4}
          rx={2}
          className="fill-line-strong"
        />
      ))}
      <Arrow x1={74} y1={50} x2={92} y2={50} />
      <Phone x={100} y={20}>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={105}
            y={32 + i * 12}
            width={24}
            height={8}
            rx={2}
            className={i === 1 ? `${HOT} ${A} group-hover:scale-110` : DATA}
          />
        ))}
      </Phone>
      <text x={12} y={92} className={T}>
        UI = f(state)
      </text>
    </>
  ),

  "navigation-mobile": () => (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={40 + i * 8}
          y={20 + i * 8}
          width={44}
          height={56}
          rx={5}
          className={i === 2 ? HOT : "fill-surface stroke-line-strong"}
          strokeWidth={1.1}
        />
      ))}
      <path
        d="M60 50 l-6 6 l6 6"
        className={`stroke-fg ${A} group-hover:-translate-x-1`}
        strokeWidth={1.6}
        fill="none"
      />
      <text x={104} y={52} className={T}>
        back stack
      </text>
    </>
  ),

  "touch-gestures": () => (
    <>
      <circle
        cx={80}
        cy={48}
        r={20}
        className={`${HOT} ${A} group-hover:scale-110`}
        strokeWidth={1.1}
        strokeDasharray="3 2"
      />
      <circle cx={80} cy={48} r={6} className="fill-accent" />
      <text x={80} y={84} textAnchor="middle" className={T}>
        44 pt · 48 dp
      </text>
    </>
  ),

  "adaptive-layouts": () => (
    <>
      <Phone x={14} y={30} w={24} h={44} />
      <rect
        x={48}
        y={26}
        width={44}
        height={50}
        rx={5}
        className="fill-surface stroke-line-strong"
        strokeWidth={1.1}
      />
      <rect x={52} y={32} width={17} height={38} rx={2} className={DATA} />
      <rect x={71} y={32} width={17} height={38} rx={2} className={DATA} />
      <rect
        x={100}
        y={22}
        width={50}
        height={58}
        rx={5}
        className={`fill-surface stroke-line-strong ${A} group-hover:scale-105`}
        strokeWidth={1.1}
      />
      <rect x={104} y={28} width={8} height={46} rx={2} className={HOT} />
      <rect x={115} y={28} width={15} height={46} rx={2} className={DATA} />
      <rect x={132} y={28} width={14} height={46} rx={2} className={DATA} />
    </>
  ),

  "offline-first": () => (
    <>
      <Phone x={16} y={22} />
      <rect
        x={22}
        y={52}
        width={22}
        height={14}
        rx={2}
        className={`${META} ${A} group-hover:scale-110`}
      />
      <text x={33} y={61} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        queue
      </text>
      <Arrow x1={56} y1={52} x2={104} y2={52} dash="3 3" />
      <path d="M74 44 l12 16 M86 44 l-12 16" className="stroke-bad" strokeWidth={1.4} />
      <Svc x={108} y={44} w={36} h={16} label="server" />
    </>
  ),

  "mobile-networking": () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={18 + i * 9}
          y={60 - i * 9}
          width={6}
          height={10 + i * 9}
          rx={1.5}
          className={i < 2 ? GOOD : "fill-surface-2 stroke-line"}
        />
      ))}
      <Arrow x1={64} y1={50} x2={90} y2={50} />
      <path
        d="M98 40 a10 10 0 1 1 -2 14"
        className={`stroke-accent ${A} group-hover:rotate-45`}
        strokeWidth={1.6}
        fill="none"
      />
      <text x={64} y={80} className={T}>
        timeout · retry · cache
      </text>
    </>
  ),

  "device-storage": () => (
    <>
      {[
        ["settings", DATA],
        ["database", DATA],
        ["files", DATA],
        ["cache", "fill-surface-2/60 stroke-line-strong"],
      ].map(([t, cls], i) => (
        <g key={t}>
          <rect
            x={14}
            y={18 + i * 17}
            width={70}
            height={13}
            rx={3}
            className={cls}
            strokeWidth={1.1}
          />
          <text x={20} y={27 + i * 17} className="fill-fg font-mono text-[6px]">
            {t}
          </text>
        </g>
      ))}
      <rect
        x={100}
        y={34}
        width={40}
        height={32}
        rx={4}
        className={`${HOT} ${A} group-hover:scale-105`}
        strokeWidth={1.2}
      />
      <path
        d="M112 34 v-6 a8 8 0 0 1 16 0 v6"
        className="stroke-accent"
        strokeWidth={1.4}
        fill="none"
      />
      <text x={120} y={80} textAnchor="middle" className={T}>
        secrets
      </text>
    </>
  ),

  "background-push": () => (
    <>
      <Svc x={10} y={42} w={32} h={16} label="server" />
      <Arrow x1={44} y1={50} x2={62} y2={50} />
      <Svc x={64} y={42} w={30} h={16} label="APNs/FCM" />
      <Arrow x1={96} y1={50} x2={106} y2={50} />
      <Phone x={110} y={20}>
        <rect
          x={113}
          y={30}
          width={28}
          height={12}
          rx={3}
          className={`${HOT} ${A} group-hover:translate-y-1`}
        />
      </Phone>
    </>
  ),
};
