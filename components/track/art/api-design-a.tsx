import { A, FileIcon, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the API Design track (modules 1–11), keyed by module slug. */

/** A short line of monospaced code. */
export function Mono({
  x,
  y,
  text,
  cls = "fill-fg",
}: {
  x: number;
  y: number;
  text: string;
  cls?: string;
}) {
  return (
    <text x={x} y={y} className={`${cls} font-mono text-[5.5px]`}>
      {text}
    </text>
  );
}

export const apiDesignArtA: ArtMap = {
  "what-is-an-api": () => (
    <>
      <rect
        x={10}
        y={30}
        width={30}
        height={40}
        rx={5}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={25} y={53} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        app
      </text>
      <Arrow x1={44} y1={50} x2={62} y2={50} />
      <rect
        x={64}
        y={24}
        width={36}
        height={52}
        rx={4}
        className={`fill-accent/15 stroke-accent ${A} group-hover:scale-105`}
        strokeWidth={1.3}
      />
      {["menu", "· dosa", "· idli", "· chai"].map((l, i) => (
        <text key={l} x={69} y={36 + i * 10} className="fill-fg font-mono text-[5.5px]">
          {l}
        </text>
      ))}
      <Arrow x1={104} y1={50} x2={120} y2={50} dash="3 2" />
      <rect
        x={122}
        y={30}
        width={28}
        height={40}
        rx={4}
        className="fill-surface-2/40 stroke-line"
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      <text x={136} y={53} textAnchor="middle" className="fill-muted font-mono text-[5px]">
        kitchen
      </text>
      <text x={10} y={90} className={T}>
        a contract, not a kitchen
      </text>
    </>
  ),

  "http-basics": () => (
    <>
      <rect
        x={10}
        y={16}
        width={66}
        height={56}
        rx={4}
        className="fill-viz-data/10 stroke-viz-data"
        strokeWidth={1.1}
      />
      <Mono x={14} y={27} text="GET /orders/9" />
      <Mono x={14} y={37} text="Host: api…" cls="fill-muted" />
      <Mono x={14} y={46} text="Accept: json" cls="fill-muted" />
      <Arrow x1={78} y1={44} x2={86} y2={44} />
      <rect
        x={88}
        y={16}
        width={62}
        height={56}
        rx={4}
        className={`fill-viz-add/10 stroke-viz-add ${A} group-hover:translate-x-0.5`}
        strokeWidth={1.1}
      />
      <Mono x={92} y={27} text="HTTP/1.1 200 OK" />
      <Mono x={92} y={37} text="Content-Type…" cls="fill-muted" />
      <Mono x={92} y={50} text='{ "status": … }' cls="fill-muted" />
      <text x={10} y={88} className={T}>
        request in, response out
      </text>
    </>
  ),

  "api-styles": () => (
    <>
      {[
        ["REST", "fill-viz-data/20 stroke-viz-data"],
        ["RPC", "fill-viz-meta/20 stroke-viz-meta"],
        ["GraphQL", "fill-viz-compute/20 stroke-viz-compute"],
        ["Events", "fill-viz-add/20 stroke-viz-add"],
      ].map(([l, cls], i) => (
        <g key={l} className={i === 2 ? `${A} group-hover:-translate-y-0.5` : ""}>
          <rect
            x={10 + (i % 2) * 72}
            y={16 + Math.floor(i / 2) * 34}
            width={66}
            height={28}
            rx={5}
            className={cls}
            strokeWidth={1.1}
          />
          <text
            x={43 + (i % 2) * 72}
            y={33 + Math.floor(i / 2) * 34}
            textAnchor="middle"
            className="fill-fg font-mono text-[7px]"
          >
            {l}
          </text>
        </g>
      ))}
      <text x={10} y={94} className={T}>
        four shapes for an API
      </text>
    </>
  ),

  "resources-urls": () => (
    <>
      <Mono x={10} y={30} text="/branches/central" />
      <Mono x={20} y={44} text="/books/42" cls="fill-accent" />
      <Mono x={30} y={58} text="/reviews" />
      <path d="M14 33v8h4M24 47v8h4" className="stroke-line-strong" strokeWidth={1} />
      <rect
        x={104}
        y={22}
        width={46}
        height={42}
        rx={3}
        className={`fill-viz-data/15 stroke-viz-data ${A} group-hover:-rotate-3`}
        strokeWidth={1.1}
      />
      <text x={127} y={46} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        book 42
      </text>
      <text x={10} y={84} className={T}>
        nouns with addresses
      </text>
    </>
  ),

  "methods-errors": () => (
    <>
      {[
        ["201", "fill-viz-add/25 stroke-viz-add"],
        ["404", "fill-viz-compute/25 stroke-viz-compute"],
        ["409", "fill-viz-compute/25 stroke-viz-compute"],
        ["503", "fill-viz-remove/25 stroke-viz-remove"],
      ].map(([c, cls], i) => (
        <g key={c}>
          <rect
            x={10 + i * 36}
            y={18}
            width={30}
            height={20}
            rx={4}
            className={`${cls} ${i === 3 ? `${A} group-hover:-translate-y-0.5` : ""}`}
            strokeWidth={1.1}
          />
          <text x={25 + i * 36} y={31} textAnchor="middle" className="fill-fg font-mono text-[7px]">
            {c}
          </text>
        </g>
      ))}
      <rect
        x={10}
        y={46}
        width={140}
        height={28}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1}
      />
      <Mono x={14} y={57} text='{ "type": "…/insufficient-funds",' />
      <Mono x={14} y={67} text='  "detail": "Balance is ₹300…" }' cls="fill-muted" />
      <text x={10} y={88} className={T}>
        say what happened, and what next
      </text>
    </>
  ),

  "payload-design": () => (
    <>
      <rect
        x={10}
        y={16}
        width={62}
        height={52}
        rx={4}
        className="fill-viz-remove/10 stroke-viz-remove"
        strokeWidth={1}
      />
      {['"amount": 0.1', '"date": "3/10"', '"id": 9007…3'].map((l, i) => (
        <Mono key={l} x={14} y={30 + i * 12} text={l} cls="fill-muted" />
      ))}
      <Arrow x1={76} y1={42} x2={86} y2={42} />
      <rect
        x={88}
        y={16}
        width={62}
        height={52}
        rx={4}
        className={`fill-viz-add/10 stroke-viz-add ${A} group-hover:translate-x-0.5`}
        strokeWidth={1}
      />
      {['"amount": 10', '"2026-10-03T…"', '"id": "pay_9…"'].map((l, i) => (
        <Mono key={l} x={92} y={30 + i * 12} text={l} />
      ))}
      <text x={10} y={84} className={T}>
        no field left to guess
      </text>
    </>
  ),

  pagination: () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={14 + i * 32}
          y={22}
          width={26}
          height={36}
          rx={3}
          className={
            i === 1 ? "fill-accent/20 stroke-accent" : "fill-surface-2/60 stroke-line-strong"
          }
          strokeWidth={1.1}
        />
      ))}
      <path
        d="M68 18v-6h6v10l-3-3-3 3z"
        className={`fill-viz-compute stroke-viz-compute ${A} group-hover:-translate-y-0.5`}
        strokeWidth={0.8}
      />
      {[0, 1, 2, 3].map((i) => (
        <text
          key={i}
          x={27 + i * 32}
          y={44}
          textAnchor="middle"
          className="fill-fg font-mono text-[6px]"
        >
          p{i + 1}
        </text>
      ))}
      <text x={14} y={78} className={T}>
        a bookmark, not a page number
      </text>
    </>
  ),

  idempotency: () => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={10}
            y={16 + i * 18}
            width={52}
            height={12}
            rx={3}
            className="fill-viz-data/15 stroke-viz-data"
            strokeWidth={1}
          />
          <Mono x={14} y={24 + i * 18} text="POST · key 9f1c" />
        </g>
      ))}
      <Arrow x1={66} y1={40} x2={84} y2={40} />
      <circle
        cx={112}
        cy={40}
        r={18}
        className={`fill-viz-add/15 stroke-viz-add ${A} group-hover:scale-105`}
        strokeWidth={1.3}
      />
      <text x={112} y={38} textAnchor="middle" className="fill-fg font-mono text-[6px]">
        ₹500
      </text>
      <text x={112} y={47} textAnchor="middle" className="fill-muted font-mono text-[5px]">
        once
      </text>
      <text x={10} y={84} className={T}>
        retry three times, pay once
      </text>
    </>
  ),

  openapi: () => (
    <>
      <FileIcon x={14} y={26} cls="fill-accent/15 stroke-accent" w={24} h={30} />
      <text x={26} y={66} textAnchor="middle" className="fill-fg font-mono text-[5px]">
        openapi.yaml
      </text>
      {["docs", "mock", "client"].map((l, i) => (
        <g key={l}>
          <Arrow x1={44} y1={41} x2={84} y2={20 + i * 22} />
          <Svc
            x={88}
            y={13 + i * 22}
            w={46}
            label={l}
            className={i === 1 ? `${A} group-hover:translate-x-0.5` : ""}
          />
        </g>
      ))}
      <text x={10} y={90} className={T}>
        one file, many outputs
      </text>
    </>
  ),

  versioning: () => (
    <>
      <path d="M12 36h136" className="stroke-viz-data" strokeWidth={2} />
      <path
        d="M60 36c10 0 12 22 24 22h64"
        className={`stroke-viz-meta ${A} group-hover:translate-y-0.5`}
        strokeWidth={2}
      />
      <circle cx={30} cy={36} r={4} className="fill-viz-data" />
      <circle cx={120} cy={58} r={4} className="fill-viz-meta" />
      <text x={12} y={28} className="fill-fg font-mono text-[6px]">
        v1
      </text>
      <text x={128} y={72} className="fill-fg font-mono text-[6px]">
        v2
      </text>
      <text x={12} y={88} className={T}>
        old and new, side by side
      </text>
    </>
  ),

  deprecation: () => (
    <>
      {[8, 7, 6, 4, 3, 2, 1, 0].map((h, i) => (
        <rect
          key={i}
          x={14 + i * 16}
          y={66 - h * 5}
          width={11}
          height={h * 5 + 0.5}
          rx={2}
          className={i === 7 ? "fill-viz-remove/40" : "fill-viz-data/40"}
        />
      ))}
      <circle
        cx={140}
        cy={22}
        r={8}
        className={`fill-viz-compute/40 stroke-viz-compute ${A} group-hover:translate-y-1`}
        strokeWidth={1}
      />
      <path d="M126 30h28" className="stroke-viz-compute" strokeWidth={1} />
      <text x={14} y={84} className={T}>
        sunset: callers move, then off
      </text>
    </>
  ),
};
