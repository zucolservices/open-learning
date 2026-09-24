"use client";

import { motion } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { NODES, candidates, judge, nodeById, waves, type Layer } from "./model";
import type { MedallionState } from "./state";

/* 4 ─ Wire the pipeline ⭐ ------------------------------------------------------------------------ */

const COL_X: Record<Layer, number> = { bronze: 10, silver: 245, gold: 480 };
const W = 190;
const H = 40;

function pos(id: string) {
  const n = nodeById.get(id)!;
  const inLayer = NODES.filter((m) => m.layer === n.layer);
  const i = inLayer.indexOf(n);
  return { x: COL_X[n.layer], y: 50 + i * 90 };
}

const STROKE: Record<Layer, string> = {
  bronze: "var(--tier-bronze)",
  silver: "var(--tier-silver)",
  gold: "var(--tier-gold)",
};

function modelName(id: string) {
  return nodeById.get(id)!.label.replace(".", "_");
}

function dbtSql(id: string, inputs: string[]) {
  const n = nodeById.get(id)!;
  const refs = inputs.map((x) => {
    const m = nodeById.get(x)!;
    const [schema, table] = m.label.split(".");
    return m.layer === "bronze"
      ? `{{ source('${schema}', '${table}') }}`
      : `{{ ref('${modelName(x)}') }}`;
  });
  const file = `-- models/${n.layer}/${modelName(id)}.sql`;
  if (!refs.length) return `${file}\n-- no inputs chosen yet`;
  return [
    file,
    "select …",
    `from ${refs[0]}`,
    ...refs.slice(1).map((r) => `join ${r} using (customer_id)`),
  ].join("\n");
}

export function WirePipeline() {
  const [s, set] = useSceneState<MedallionState>();
  const buildable = NODES.filter((n) => n.layer !== "bronze");
  const verdicts = Object.fromEntries(buildable.map((n) => [n.id, judge(n, s.inputs[n.id] ?? [])]));
  const allOk = buildable.every((n) => verdicts[n.id].ok);
  const plan = waves(s.inputs);
  const waveOf = new Map(plan.flatMap((w, i) => w.map((id) => [id, i] as const)));
  const pick = nodeById.get(s.pick)!;
  const chosen = s.inputs[s.pick] ?? [];

  const toggle = (x: string) => {
    const next = chosen.includes(x) ? chosen.filter((c) => c !== x) : [...chosen, x];
    set({ inputs: { ...s.inputs, [s.pick]: next }, ran: false });
  };

  return (
    <StepLayout
      eyebrow="Build it"
      title="Wire the pipeline"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <svg viewBox="0 0 680 230" className="w-full" role="img" aria-label="Pipeline diagram">
            {(["bronze", "silver", "gold"] as Layer[]).map((l) => (
              <text
                key={l}
                x={COL_X[l] + W / 2}
                y={22}
                textAnchor="middle"
                className="fill-muted text-[11px] capitalize"
              >
                {l}
              </text>
            ))}
            {buildable.flatMap((n) =>
              (s.inputs[n.id] ?? []).map((x) => {
                const a = pos(x);
                const b = pos(n.id);
                const x1 = a.x + W;
                const y1 = a.y + H / 2;
                const x2 = b.x;
                const y2 = b.y + H / 2;
                const mx = (x1 + x2) / 2;
                const bad = !n.needs.includes(x);
                return (
                  <motion.path
                    key={n.id + x}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                    fill="none"
                    strokeWidth={2}
                    stroke={bad ? "var(--bad)" : "var(--line-strong)"}
                    strokeDasharray={bad ? "5 4" : undefined}
                  />
                );
              }),
            )}
            {NODES.map((n) => {
              const p = pos(n.id);
              const w = waveOf.get(n.id) ?? 0;
              const v = verdicts[n.id];
              return (
                <g
                  key={n.id}
                  onClick={() => n.layer !== "bronze" && set({ pick: n.id })}
                  className={n.layer !== "bronze" ? "cursor-pointer" : undefined}
                >
                  <motion.rect
                    x={p.x}
                    y={p.y}
                    width={W}
                    height={H}
                    rx={10}
                    strokeWidth={s.pick === n.id ? 2.5 : 1.5}
                    stroke={s.pick === n.id ? "var(--accent)" : STROKE[n.layer]}
                    initial={false}
                    animate={{
                      fill: s.ran
                        ? ["var(--surface)", STROKE[n.layer], "var(--surface)"]
                        : "var(--surface)",
                    }}
                    transition={{ duration: 0.9, delay: s.ran ? w * 0.9 : 0 }}
                  />
                  <text
                    x={p.x + W / 2}
                    y={p.y + 25}
                    textAnchor="middle"
                    className="fill-fg font-mono text-[10.5px]"
                  >
                    {n.label}
                  </text>
                  {v && (
                    <text
                      x={p.x + W - 10}
                      y={p.y + 14}
                      textAnchor="middle"
                      className={cn("text-[10px]", v.ok ? "fill-good" : "fill-subtle")}
                    >
                      {v.ok ? "✓" : "•"}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-sm">
              Inputs for <span className="font-mono font-semibold">{pick.label}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {candidates(pick).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={chosen.includes(c.id)}
                  onClick={() => toggle(c.id)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-mono text-[11px] transition",
                    chosen.includes(c.id)
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line text-muted hover:bg-surface-2",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {verdicts[s.pick].notes.length > 0 && chosen.length > 0 && (
              <ul className="text-muted mt-2 grid gap-0.5 text-xs">
                {verdicts[s.pick].notes.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            )}
            {verdicts[s.pick].ok && <p className="text-good mt-2 text-xs">✓ Wired correctly.</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!allOk}
              onClick={() => set({ ran: !s.ran })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              {s.ran ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
              {s.ran ? "Reset" : "Run the pipeline"}
            </button>
            <span className="text-muted text-xs">
              {allOk
                ? s.ran
                  ? `Ran in ${plan.length} waves: both bronze loads, then both silver tables in parallel, then both gold tables.`
                  : "All wired. Run it to see the order the orchestrator picks."
                : `Click each silver and gold table and choose its inputs (${buildable.filter((n) => verdicts[n.id].ok).length}/${buildable.length} done).`}
            </span>
          </div>

          <Code>{dbtSql(s.pick, chosen)}</Code>
        </div>
      }
    >
      <p>
        A pipeline is a set of tables, each built from others. You only say what each table reads
        from; the tool works out the order and what can run in parallel. That map of dependencies is
        a <Term id="dag">DAG</Term>.
      </p>
      <p>
        Choose the inputs for each silver and gold table, then run it. The code underneath is the
        dbt version: <code>ref()</code> points at another model and <code>source()</code> at a table
        loaded from outside.
      </p>
    </StepLayout>
  );
}
