import type { ReactNode } from "react";
import { A, FileIcon, Slab, type ArtMap } from "./art/kit";
import { systemDesignArt } from "./art/system-design";
import { llmFoundationsArt } from "./art/llm-foundations";
import { agileScrumArt } from "./art/agile-scrum";
import { ragSystemsArt } from "./art/rag-systems";
import { cloudArchitectureArtA } from "./art/cloud-architecture-a";
import { cloudArchitectureArtB } from "./art/cloud-architecture-b";
import { streamingDataArtA } from "./art/streaming-data-a";
import { streamingDataArtB } from "./art/streaming-data-b";
import { kubernetesArtA } from "./art/kubernetes-a";
import { kubernetesArtB } from "./art/kubernetes-b";
import { ciCdArtA } from "./art/ci-cd-a";
import { ciCdArtB } from "./art/ci-cd-b";
import { observabilityArtA } from "./art/observability-a";
import { observabilityArtB } from "./art/observability-b";
import { apiDesignArtA } from "./art/api-design-a";
import { apiDesignArtB } from "./art/api-design-b";

/**
 * One small illustration per module (viewBox 160 × 100), drawn with the
 * semantic viz colours. Elements tagged `art` move a little when the card
 * (a `group`) is hovered, which is pure CSS, so it costs nothing at rest.
 */

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 160 100"
      className="h-full w-full"
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function Cloud({ label, cls }: { label: string; cls: string }) {
  return (
    <>
      <path
        d="M40 58a14 14 0 0 1 4-27 20 20 0 0 1 38-6 16 16 0 0 1 30 10 12 12 0 0 1 2 23z"
        className={`${cls} fill-surface-2/60`}
        strokeWidth={1.4}
      />
      <text x="78" y="50" textAnchor="middle" className="fill-fg text-[11px] font-semibold">
        {label}
      </text>
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <rect
            x={44 + i * 26}
            y={70}
            width={20}
            height={16}
            rx={4}
            className="fill-surface stroke-line-strong"
          />
          <rect
            x={48 + i * 26}
            y={75}
            width={12}
            height={2.5}
            rx={1}
            className={i === 0 ? "fill-viz-data" : i === 1 ? "fill-viz-meta" : "fill-viz-compute"}
          />
          <rect x={48 + i * 26} y={80} width={8} height={2} rx={1} className="fill-line-strong" />
          <line
            x1={54 + i * 26}
            y1={70}
            x2={54 + i * 26}
            y2={62}
            className="stroke-line-strong"
            strokeDasharray="2 2"
          />
        </g>
      ))}
    </>
  );
}

const art: ArtMap = {
  "swamp-to-lakehouse": () => (
    <>
      <path d="M8 70q8-6 16 0t16 0 16 0" className="stroke-viz-idle" strokeWidth={1.5} />
      <path d="M8 78q8-6 16 0t16 0 16 0" className="stroke-viz-idle/60" strokeWidth={1.5} />
      {[
        [14, 50, -12],
        [30, 42, 10],
        [44, 54, -6],
      ].map(([x, y, r], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={10}
          height={13}
          rx={2}
          transform={`rotate(${r} ${x + 5} ${y + 6})`}
          className="fill-viz-data/15 stroke-viz-data/60"
        />
      ))}
      <path
        d="M66 55h20"
        className={`stroke-accent ${A} group-hover:translate-x-1.5`}
        strokeWidth={2}
      />
      <path
        d="M86 55l-5-4M86 55l-5 4"
        className={`stroke-accent ${A} group-hover:translate-x-1.5`}
        strokeWidth={2}
      />
      <path
        d="M100 44l26-18 26 18"
        className={`stroke-accent ${A} group-hover:-translate-y-1`}
        strokeWidth={2}
      />
      {[
        ["fill-viz-compute/30 stroke-viz-compute", 46],
        ["fill-accent/25 stroke-accent", 56],
        ["fill-viz-meta/25 stroke-viz-meta", 66],
        ["fill-viz-data/25 stroke-viz-data", 76],
      ].map(([c, y]) => (
        <rect
          key={y}
          x={104}
          y={y as number}
          width={44}
          height={8}
          rx={2}
          className={c as string}
        />
      ))}
    </>
  ),

  "object-storage": () => (
    <>
      <path
        d="M44 34h72l-8 54H52z"
        className="fill-viz-idle/15 stroke-viz-idle"
        strokeWidth={1.5}
      />
      <ellipse
        cx="80"
        cy="34"
        rx="36"
        ry="7"
        className="fill-surface-2 stroke-viz-idle"
        strokeWidth={1.5}
      />
      {[
        [58, 52, "a/1"],
        [80, 60, "a/2"],
        [66, 72, "b/7"],
        [90, 44, "c/3"],
      ].map(([x, y, k], i) => (
        <g
          key={k as string}
          className={`${A} group-hover:translate-y-1`}
          style={{ transitionDelay: `${i * 50}ms` }}
        >
          <rect
            x={x as number}
            y={y as number}
            width={18}
            height={11}
            rx={2}
            className="fill-viz-data/25 stroke-viz-data"
          />
          <text
            x={(x as number) + 9}
            y={(y as number) + 8}
            textAnchor="middle"
            className="fill-fg font-mono text-[6px]"
          >
            {k}
          </text>
        </g>
      ))}
      <text x="80" y="18" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        s3://bucket/key
      </text>
    </>
  ),

  "file-formats": () => (
    <>
      {[0, 1].map((side) =>
        Array.from({ length: 16 }, (_, i) => {
          const r = Math.floor(i / 4);
          const c = i % 4;
          const hot = side === 0 ? r === 1 : c === 2;
          return (
            <rect
              key={`${side}-${i}`}
              x={18 + side * 72 + c * 13}
              y={24 + r * 13}
              width={11}
              height={11}
              rx={2}
              className={hot ? `fill-accent ${A} group-hover:scale-110` : "fill-viz-data/20"}
            />
          );
        }),
      )}
      <text x="43" y="88" textAnchor="middle" className="fill-muted text-[8px]">
        row
      </text>
      <text x="115" y="88" textAnchor="middle" className="fill-muted text-[8px]">
        column
      </text>
    </>
  ),

  "inside-parquet": () => (
    <>
      <Slab
        x={80}
        y={70}
        cls="fill-viz-data/20 stroke-viz-data"
        className={`${A} group-hover:translate-y-2`}
      />
      <Slab x={80} y={54} cls="fill-viz-data/20 stroke-viz-data" />
      <Slab
        x={80}
        y={38}
        cls="fill-viz-meta/25 stroke-viz-meta"
        className={`${A} group-hover:-translate-y-2`}
      />
      <text x="122" y="40" className="fill-viz-meta font-mono text-[7px]">
        footer
      </text>
      <text x="122" y="72" className="fill-viz-data font-mono text-[7px]">
        row groups
      </text>
    </>
  ),

  "what-makes-a-table": () => (
    <>
      <path
        d="M36 30h26l6 6h56v48H36z"
        className="fill-viz-idle/10 stroke-viz-idle"
        strokeWidth={1.5}
      />
      <FileIcon x={48} y={48} />
      <FileIcon x={66} y={48} />
      <FileIcon
        x={84}
        y={48}
        cls="fill-viz-remove/15 stroke-viz-remove"
        className="[stroke-dasharray:3_2]"
      />
      <text
        x="112"
        y="64"
        className={`fill-viz-compute text-[22px] font-bold ${A} group-hover:rotate-12`}
      >
        ?
      </text>
    </>
  ),

  "delta-lake": () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g
          key={i}
          className={`${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${i * 50}ms` }}
        >
          <rect
            x={22}
            y={18 + i * 15}
            width={62}
            height={11}
            rx={3}
            className={
              i === 3 ? "fill-viz-meta/35 stroke-viz-meta" : "fill-viz-meta/15 stroke-viz-meta/50"
            }
          />
          <text x={28} y={26 + i * 15} className="fill-fg font-mono text-[6.5px]">
            {`000${i}.json`}
          </text>
        </g>
      ))}
      <line x1="96" y1="80" x2="144" y2="80" className="stroke-line-strong" strokeWidth={2} />
      <line x1="96" y1="80" x2="130" y2="80" className="stroke-viz-meta" strokeWidth={2} />
      <circle cx="130" cy="80" r="5" className={`fill-viz-meta ${A} group-hover:-translate-x-4`} />
      {[100, 116].map((x, i) => (
        <FileIcon
          key={x}
          x={x}
          y={36}
          cls={i === 0 ? "fill-viz-data/25 stroke-viz-data" : "fill-viz-add/25 stroke-viz-add"}
        />
      ))}
      <FileIcon
        x={132}
        y={36}
        cls="fill-transparent stroke-line-strong"
        className="[stroke-dasharray:3_2]"
      />
    </>
  ),

  "apache-iceberg": () => (
    <>
      <circle cx="80" cy="16" r="6" className="fill-accent" />
      <rect
        x="66"
        y="30"
        width="28"
        height="10"
        rx="3"
        className="fill-viz-meta/30 stroke-viz-meta"
      />
      <line x1="80" y1="22" x2="80" y2="30" className="stroke-line-strong" />
      {[42, 118].map((x) => (
        <g key={x}>
          <line x1="80" y1="40" x2={x} y2="54" className="stroke-line-strong" />
          <rect
            x={x - 14}
            y="54"
            width="28"
            height="9"
            rx="3"
            className="fill-viz-meta/20 stroke-viz-meta/70"
          />
        </g>
      ))}
      {[22, 42, 62, 100, 120, 140].map((x, i) => (
        <g key={x}>
          <line x1={i < 3 ? 42 : 118} y1="63" x2={x} y2="76" className="stroke-line-strong" />
          <FileIcon
            x={x - 5}
            y={76}
            w={10}
            h={13}
            cls={
              i === 1 || i === 4
                ? "fill-viz-compute/40 stroke-viz-compute"
                : "fill-viz-data/20 stroke-viz-data/60"
            }
            className={i === 1 || i === 4 ? `${A} group-hover:-translate-y-1` : ""}
          />
        </g>
      ))}
    </>
  ),

  "apache-hudi": () => (
    <>
      <line x1="14" y1="34" x2="146" y2="34" className="stroke-line-strong" strokeWidth={1.5} />
      {[24, 50, 76, 102, 128].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={34}
          r={5}
          className={i === 4 ? `fill-viz-meta ${A} group-hover:scale-125` : "fill-viz-meta/40"}
        />
      ))}
      <text x="14" y="22" className="fill-muted font-mono text-[7px]">
        .hoodie timeline
      </text>
      <rect
        x="30"
        y="54"
        width="40"
        height="28"
        rx="3"
        className="fill-viz-data/20 stroke-viz-data"
      />
      <text x="50" y="71" textAnchor="middle" className="fill-fg font-mono text-[7px]">
        base
      </text>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={78 + i * 16}
          y={62}
          width={12}
          height={12}
          rx={2}
          className={`fill-viz-add/25 stroke-viz-add ${A} group-hover:translate-x-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}
      <text x="102" y="88" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        log files
      </text>
    </>
  ),

  "format-showdown": () => (
    <>
      {[
        ["Delta", "fill-viz-meta/25 stroke-viz-meta", 20],
        ["Iceberg", "fill-accent/20 stroke-accent", 62],
        ["Hudi", "fill-viz-compute/25 stroke-viz-compute", 104],
      ].map(([name, c, x], i) => (
        <g
          key={name as string}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <rect x={x as number} y={24} width={36} height={44} rx={5} className={c as string} />
          <text
            x={(x as number) + 18}
            y={50}
            textAnchor="middle"
            className="fill-fg text-[8px] font-semibold"
          >
            {name}
          </text>
        </g>
      ))}
      <path d="M38 80q42 14 84 0" className="stroke-muted" strokeDasharray="3 3" />
      <FileIcon x={74} y={78} />
    </>
  ),

  "acid-and-concurrency": () => (
    <>
      <rect
        x="64"
        y="40"
        width="32"
        height="20"
        rx="4"
        className="fill-viz-meta/25 stroke-viz-meta"
      />
      <text x="80" y="53" textAnchor="middle" className="fill-fg font-mono text-[7px]">
        v7
      </text>
      <path
        d="M22 24l38 20"
        className={`stroke-viz-add ${A} group-hover:translate-x-1`}
        strokeWidth={2}
      />
      <path d="M22 76l38-20" className="stroke-viz-remove" strokeWidth={2} strokeDasharray="4 3" />
      <circle cx="18" cy="22" r="7" className="fill-viz-compute/30 stroke-viz-compute" />
      <circle cx="18" cy="78" r="7" className="fill-viz-compute/30 stroke-viz-compute" />
      <text x="116" y="47" className="fill-viz-add text-[16px] font-bold">
        ✓
      </text>
      <text x="116" y="70" className="fill-viz-remove text-[12px] font-bold">
        retry
      </text>
    </>
  ),

  "updates-and-deletes": () => (
    <>
      <line
        x1="30"
        y1="60"
        x2="130"
        y2="60"
        className={`stroke-muted ${A} origin-center group-hover:rotate-6`}
        strokeWidth={2}
      />
      <path d="M80 60l-8 22h16z" className="fill-surface-2 stroke-line-strong" />
      <rect
        x="26"
        y="34"
        width="24"
        height="24"
        rx="3"
        className="fill-viz-data/25 stroke-viz-data"
      />
      <text x="38" y="30" textAnchor="middle" className="fill-muted text-[7px]">
        CoW
      </text>
      <rect
        x="106"
        y="42"
        width="18"
        height="16"
        rx="3"
        className="fill-viz-data/25 stroke-viz-data"
      />
      <rect
        x="126"
        y="48"
        width="8"
        height="10"
        rx="2"
        className="fill-viz-remove/30 stroke-viz-remove"
      />
      <text x="118" y="36" textAnchor="middle" className="fill-muted text-[7px]">
        MoR
      </text>
    </>
  ),

  "schema-evolution": () => (
    <>
      {["id", "name", "amt"].map((c, i) => (
        <g key={c}>
          <rect
            x={24 + i * 38}
            y={30}
            width={34}
            height={14}
            rx={3}
            className={
              i === 2 ? "fill-accent/25 stroke-accent" : "fill-surface-2 stroke-line-strong"
            }
          />
          <text x={41 + i * 38} y={40} textAnchor="middle" className="fill-fg font-mono text-[7px]">
            {c}
          </text>
          <text
            x={41 + i * 38}
            y={56}
            textAnchor="middle"
            className="fill-subtle font-mono text-[6px]"
          >
            id:{i + 1}
          </text>
          {[0, 1].map((r) => (
            <rect
              key={r}
              x={24 + i * 38}
              y={62 + r * 10}
              width={34}
              height={7}
              rx={1.5}
              className="fill-viz-data/15"
            />
          ))}
        </g>
      ))}
      <text
        x="117"
        y="24"
        textAnchor="middle"
        className={`fill-accent font-mono text-[7px] ${A} group-hover:-translate-y-1`}
      >
        amt → amount
      </text>
    </>
  ),

  partitioning: () => (
    <>
      {["d=01", "d=02", "d=03"].map((d, i) => (
        <g key={d}>
          <path
            d={`M${16 + i * 46} 26h14l4 4h20v34h-38z`}
            className="fill-viz-idle/10 stroke-viz-idle"
          />
          <text
            x={35 + i * 46}
            y={22}
            textAnchor="middle"
            className="fill-muted font-mono text-[7px]"
          >
            {d}
          </text>
          {Array.from({ length: i === 2 ? 9 : 2 }, (_, k) => (
            <rect
              key={k}
              x={i === 2 ? 21 + i * 46 + (k % 3) * 9 : 22 + i * 46 + k * 14}
              y={i === 2 ? 36 + Math.floor(k / 3) * 8 : 38}
              width={i === 2 ? 6 : 11}
              height={i === 2 ? 5 : 16}
              rx={1}
              className={`${i === 2 ? "fill-viz-remove/40" : "fill-viz-data/40"} ${A} group-hover:-translate-y-0.5`}
            />
          ))}
        </g>
      ))}
      <text x="127" y="82" textAnchor="middle" className="fill-viz-remove text-[7px]">
        tiny files!
      </text>
    </>
  ),

  "data-skipping": () => (
    <>
      {Array.from({ length: 16 }, (_, i) => {
        const x = i % 4;
        const y = Math.floor(i / 4);
        const hit = x < 2 && y < 2;
        return (
          <rect
            key={i}
            x={46 + x * 18}
            y={14 + y * 18}
            width={15}
            height={15}
            rx={2}
            className={hit ? "fill-viz-compute/50" : `fill-viz-data/10 ${A} group-hover:opacity-40`}
          />
        );
      })}
      <path
        d="M53 21h18v18h-18v18h18M89 21h18v18h-18v18h18"
        className="stroke-accent"
        strokeWidth={1.3}
      />
      <path d="M71 57h18" className="stroke-accent" strokeWidth={1.3} />
    </>
  ),

  "table-maintenance": () => (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={20 + (i % 3) * 13}
          y={30 + Math.floor(i / 3) * 13}
          width={10}
          height={10}
          rx={2}
          className={`fill-viz-data/30 ${A} group-hover:translate-x-3`}
          style={{ transitionDelay: `${i * 25}ms` }}
        />
      ))}
      <path d="M72 50h16M88 50l-5-4M88 50l-5 4" className="stroke-accent" strokeWidth={2} />
      <rect
        x="100"
        y="30"
        width="36"
        height="36"
        rx="4"
        className="fill-viz-data/30 stroke-viz-data"
      />
      <text x="118" y="82" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        OPTIMIZE
      </text>
    </>
  ),

  catalogs: () => (
    <>
      {[
        [28, 24, "Spark"],
        [132, 24, "Trino"],
        [80, 86, "DuckDB"],
      ].map(([x, y, n]) => (
        <g key={n as string}>
          <line
            x1={80}
            y1={50}
            x2={x as number}
            y2={y as number}
            className="stroke-viz-compute/60"
            strokeDasharray="3 3"
          />
          <rect
            x={(x as number) - 18}
            y={(y as number) - 8}
            width={36}
            height={16}
            rx={8}
            className="fill-viz-compute/20 stroke-viz-compute"
          />
          <text
            x={x as number}
            y={(y as number) + 3}
            textAnchor="middle"
            className="fill-fg text-[7px]"
          >
            {n}
          </text>
        </g>
      ))}
      <circle
        cx="80"
        cy="50"
        r="14"
        className={`fill-accent/25 stroke-accent ${A} group-hover:scale-110`}
        strokeWidth={1.5}
      />
      <text x="80" y="53" textAnchor="middle" className="fill-accent text-[7px] font-semibold">
        catalog
      </text>
    </>
  ),

  "governance-security": () => (
    <>
      <path
        d="M50 18l24 8v18c0 16-10 26-24 32-14-6-24-16-24-32V26z"
        className="fill-accent/15 stroke-accent"
        strokeWidth={1.5}
      />
      <rect
        x="42"
        y="42"
        width="16"
        height="12"
        rx="2"
        className={`fill-accent ${A} group-hover:-translate-y-0.5`}
      />
      <path d="M45 42v-4a5 5 0 0 1 10 0v4" className="stroke-accent" strokeWidth={1.5} />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x={90} y={26 + r * 13} width={22} height={9} rx={2} className="fill-surface-2" />
          <rect
            x={115}
            y={26 + r * 13}
            width={24}
            height={9}
            rx={2}
            className={r === 1 ? "fill-viz-remove/40" : "fill-viz-data/20"}
          />
        </g>
      ))}
      <text x="127" y="85" textAnchor="middle" className="fill-muted font-mono text-[6.5px]">
        ●●●● masked
      </text>
    </>
  ),

  ingestion: () => (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <circle
          key={i}
          cx={16 + i * 11}
          cy={50 + Math.sin(i) * 6}
          r={3}
          className={`fill-viz-data ${A} group-hover:translate-x-2`}
          style={{ transitionDelay: `${i * 30}ms`, opacity: 0.3 + i * 0.1 }}
        />
      ))}
      <rect
        x="96"
        y="28"
        width="46"
        height="44"
        rx="5"
        className="fill-viz-data/15 stroke-viz-data"
      />
      {[0, 1, 2].map((r) => (
        <line
          key={r}
          x1="102"
          y1={40 + r * 10}
          x2="136"
          y2={40 + r * 10}
          className="stroke-viz-data/40"
        />
      ))}
      <text x="119" y="86" textAnchor="middle" className="fill-muted text-[7px]">
        stream → table
      </text>
    </>
  ),

  "cdc-and-merge": () => (
    <>
      <ellipse cx="26" cy="30" rx="14" ry="5" className="fill-viz-idle/30 stroke-viz-idle" />
      <path d="M12 30v34c0 3 6 5 14 5s14-2 14-5V30" className="fill-viz-idle/15 stroke-viz-idle" />
      {[
        ["+", "fill-viz-add/30", "fill-viz-add"],
        ["~", "fill-viz-compute/30", "fill-viz-compute"],
        ["−", "fill-viz-remove/30", "fill-viz-remove"],
      ].map(([sym, bg, fg], i) => (
        <g
          key={sym}
          className={`${A} group-hover:translate-x-2`}
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <circle cx={62 + i * 18} cy={50} r={7} className={bg} />
          <text x={62 + i * 18} y={53} textAnchor="middle" className={`${fg} text-[9px] font-bold`}>
            {sym}
          </text>
        </g>
      ))}
      <rect
        x="116"
        y="30"
        width="32"
        height="40"
        rx="4"
        className="fill-viz-data/15 stroke-viz-data"
      />
      <text x="132" y="82" textAnchor="middle" className="fill-muted font-mono text-[7px]">
        MERGE
      </text>
    </>
  ),

  medallion: () => (
    <>
      {[
        ["bronze", "fill-tier-bronze/25 stroke-tier-bronze", 16],
        ["silver", "fill-tier-silver/25 stroke-tier-silver", 62],
        ["gold", "fill-tier-gold/25 stroke-tier-gold", 108],
      ].map(([n, c, x], i) => (
        <g
          key={n as string}
          className={`${A} group-hover:-translate-y-1`}
          style={{ transitionDelay: `${i * 70}ms` }}
        >
          <circle
            cx={(x as number) + 18}
            cy={46}
            r={16}
            className={c as string}
            strokeWidth={1.5}
          />
          <text x={(x as number) + 18} y={78} textAnchor="middle" className="fill-muted text-[8px]">
            {n}
          </text>
        </g>
      ))}
      <path d="M52 46h10M98 46h10" className="stroke-accent" strokeWidth={2} />
    </>
  ),

  "query-engines": () => (
    <>
      {[
        [80, 18, "SUM"],
        [80, 44, "FILTER"],
        [44, 72, "SCAN a"],
        [116, 72, "SCAN b"],
      ].map(([x, y, n], i) => (
        <g key={n as string}>
          <rect
            x={(x as number) - 22}
            y={y as number}
            width={44}
            height={14}
            rx={4}
            className={
              i === 0
                ? "fill-viz-compute/30 stroke-viz-compute"
                : "fill-surface-2 stroke-line-strong"
            }
          />
          <text
            x={x as number}
            y={(y as number) + 10}
            textAnchor="middle"
            className="fill-fg font-mono text-[7px]"
          >
            {n}
          </text>
        </g>
      ))}
      <path d="M80 32v12M70 58l-18 14M90 58l18 14" className="stroke-line-strong" />
      <line
        x1="100"
        y1="72"
        x2="132"
        y2="86"
        className={`stroke-viz-remove ${A} group-hover:opacity-100`}
        strokeWidth={2}
        opacity={0.6}
      />
    </>
  ),

  "hands-on-sql": () => (
    <>
      <rect x="20" y="18" width="120" height="66" rx="6" className="fill-bg stroke-line-strong" />
      <circle cx="30" cy="27" r="2.5" className="fill-viz-remove" />
      <circle cx="38" cy="27" r="2.5" className="fill-viz-compute" />
      <circle cx="46" cy="27" r="2.5" className="fill-viz-add" />
      <text x="28" y="46" className="fill-viz-meta font-mono text-[8px]">
        SELECT <tspan className="fill-fg">*</tspan>
      </text>
      <text x="28" y="58" className="fill-viz-meta font-mono text-[8px]">
        FROM <tspan className="fill-accent">&apos;orders.parquet&apos;</tspan>
      </text>
      <rect
        x="28"
        y="64"
        width="5"
        height="9"
        className={`fill-accent ${A} group-hover:translate-x-12`}
      />
    </>
  ),

  "bi-ml-ai": () => (
    <>
      <rect
        x="66"
        y="36"
        width="28"
        height="28"
        rx="4"
        className="fill-tier-gold/25 stroke-tier-gold"
      />
      {[
        [26, 26],
        [134, 26],
        [80, 88],
      ].map(([x, y], i) => (
        <line
          key={i}
          x1={80}
          y1={50}
          x2={x}
          y2={y}
          className="stroke-line-strong"
          strokeDasharray="3 3"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={16 + i * 8}
          y={30 - i * 5}
          width={6}
          height={8 + i * 5}
          className={`fill-viz-data ${A} group-hover:-translate-y-1`}
        />
      ))}
      {[
        [128, 18],
        [140, 26],
        [128, 34],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} className="fill-viz-meta/60" />
      ))}
      <rect x="66" y="80" width="28" height="14" rx="7" className="fill-accent/25 stroke-accent" />
      <text x="80" y="90" textAnchor="middle" className="fill-accent text-[7px]">
        chat
      </text>
    </>
  ),

  "on-aws": () => <Cloud label="AWS" cls="stroke-viz-compute" />,
  "on-gcp": () => <Cloud label="Google Cloud" cls="stroke-viz-data" />,
  "on-azure": () => <Cloud label="Azure" cls="stroke-accent" />,

  landscape: () => (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const x = 22 + (i % 4) * 32;
        const y = 20 + Math.floor(i / 4) * 24;
        const c = ["fill-viz-data/30", "fill-viz-meta/30", "fill-viz-compute/30", "fill-accent/30"][
          i % 4
        ];
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={24}
            height={16}
            rx={4}
            className={`${c} ${A} group-hover:scale-110`}
            style={{ transitionDelay: `${i * 20}ms` }}
          />
        );
      })}
      <path d="M34 36v8M66 60v8M98 36v8M130 60v8M46 28h8M110 52h8" className="stroke-line-strong" />
    </>
  ),

  "design-a-lakehouse": () => (
    <>
      <rect
        x="14"
        y="14"
        width="132"
        height="72"
        rx="4"
        className="fill-viz-data/5 stroke-viz-data/40"
      />
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1={14 + i * 22}
          y1={14}
          x2={14 + i * 22}
          y2={86}
          className="stroke-viz-data/10"
        />
      ))}
      <rect
        x="28"
        y="32"
        width="30"
        height="18"
        rx="3"
        className="stroke-accent"
        strokeDasharray="3 2"
      />
      <rect x="70" y="32" width="30" height="18" rx="3" className="stroke-accent" />
      <rect x="70" y="60" width="30" height="14" rx="3" className="stroke-viz-meta" />
      <path d="M58 41h12M85 50v10" className="stroke-accent" />
      <path
        d="M118 70l18-30 5 3-18 30-6 3z"
        className={`fill-viz-compute/40 stroke-viz-compute ${A} group-hover:-rotate-12`}
      />
    </>
  ),

  "fix-the-lakehouse": () => (
    <>
      <rect
        x="16"
        y="18"
        width="92"
        height="64"
        rx="5"
        className="fill-surface-2/60 stroke-line-strong"
      />
      <path
        d="M24 70l14-8 12 4 12-6 10 4 10-30 10 26"
        className="stroke-viz-remove"
        strokeWidth={1.8}
      />
      <circle cx="82" cy="34" r="3.5" className="fill-viz-remove" />
      <path
        d="M126 36a10 10 0 1 0 8 14l10 10-4 4-10-10a10 10 0 0 1-4-18"
        className={`fill-viz-compute/30 stroke-viz-compute ${A} group-hover:rotate-45`}
        strokeWidth={1.4}
      />
    </>
  ),

  "rows-vs-columns": () => art["file-formats"](),
};

const all: ArtMap = {
  ...art,
  ...systemDesignArt,
  ...llmFoundationsArt,
  ...agileScrumArt,
  ...ragSystemsArt,
  ...cloudArchitectureArtA,
  ...cloudArchitectureArtB,
  ...streamingDataArtA,
  ...streamingDataArtB,
  ...kubernetesArtA,
  ...kubernetesArtB,
  ...ciCdArtA,
  ...ciCdArtB,
  ...observabilityArtA,
  ...observabilityArtB,
  ...apiDesignArtA,
  ...apiDesignArtB,
};

/** Art is keyed by slug; a "track/slug" key wins, for slugs used in more than one track. */
export function ModuleArt({ slug, track }: { slug: string; track?: string }) {
  const draw = (track && all[`${track}/${slug}`]) || all[slug];
  return (
    <Frame>
      {draw ? (
        draw()
      ) : (
        <rect
          x="50"
          y="30"
          width="60"
          height="40"
          rx="6"
          className="fill-surface-2 stroke-line-strong"
        />
      )}
    </Frame>
  );
}
