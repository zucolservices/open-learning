"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PANELS, SLOTS } from "./model";
import type { DashState } from "./state";

/* 1 ─ Five seconds at 3 a.m. ⭐ -------------------------------------------------------------------- */

function Spark({ shape, hot }: { shape: number[]; hot: boolean }) {
  return (
    <svg viewBox="0 0 80 24" className="h-6 w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        className={hot ? "stroke-bad" : "stroke-viz-data"}
        strokeWidth={1.6}
        vectorEffect="non-scaling-stroke"
        points={shape.map((v, i) => `${(i / (shape.length - 1)) * 80},${22 - v * 2.2}`).join(" ")}
      />
    </svg>
  );
}

export function FiveSeconds() {
  const [s, set] = useSceneState<DashState>();
  const top = s.top ?? [];
  const chosen = top.map((id) => PANELS.find((p) => p.id === id)!).filter(Boolean);
  const covered = new Set(chosen.map((p) => p.signal).filter(Boolean));
  const done = covered.size === 4 && chosen.length === 4;
  const toggle = (id: string) =>
    set({
      top: top.includes(id) ? top.filter((x) => x !== id) : top.length < SLOTS ? [...top, id] : top,
    });
  const last = chosen[chosen.length - 1];
  return (
    <StepLayout
      eyebrow="Build"
      title="Five seconds at 3 a.m."
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px]">
            Top row of the checkout dashboard ({chosen.length}/{SLOTS})
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: SLOTS }, (_, i) => {
              const p = chosen[i];
              return (
                <div
                  key={i}
                  className={cn(
                    "flex min-h-20 flex-col rounded-lg border px-2 py-1.5",
                    p
                      ? p.signal
                        ? "border-good/50 bg-good/5"
                        : "border-bad/50 bg-bad/5"
                      : "border-line border-dashed",
                  )}
                >
                  {p ? (
                    <>
                      <p className="text-[10px] leading-tight font-medium">{p.title}</p>
                      <div className="mt-auto">
                        <Spark
                          shape={p.shape}
                          hot={p.signal === "errors" || p.signal === "latency"}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-subtle m-auto text-[10px]">empty</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PANELS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={top.includes(p.id)}
                onClick={() => toggle(p.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  top.includes(p.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {p.title}
              </button>
            ))}
          </div>
          {last && (
            <p className={cn("text-xs", last.signal ? "text-good" : "text-bad")}>
              {last.title}: {last.note}
            </p>
          )}
          <div className="flex flex-wrap gap-2 text-xs">
            {(["latency", "traffic", "errors", "saturation"] as const).map((sig) => (
              <span
                key={sig}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2 py-0.5",
                  covered.has(sig) ? "border-good/50 text-good" : "border-line text-muted",
                )}
              >
                {covered.has(sig) && <Check className="size-3" />}
                {sig}
              </span>
            ))}
          </div>
          {done && (
            <p className="text-good text-sm">
              Now anyone paged can tell in seconds whether users are hurting, and how. Everything
              else lives one click below.
            </p>
          )}
        </div>
      }
    >
      <p>
        The old dashboard has forty panels. Paged at 3 a.m., nobody can tell from it whether
        customers are affected. Build the top row of a new one: four panels, chosen from the list.
      </p>
      <p>
        Stephen Few defined a <Term id="dashboard">dashboard</Term> as &ldquo;a visual display of
        the most important information needed to achieve one or more objectives; consolidated and
        arranged on a single screen so the information can be monitored at a glance.&rdquo; The SRE
        book adds that dashboards &ldquo;should answer basic questions about your service, and
        normally include some form of the four golden signals&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Top to bottom ------------------------------------------------------------------------------- */

const LAYOUT: [string, string][] = [
  [
    "Row 1 · Are users OK?",
    "The golden signals for the user journey: errors, p99 latency, traffic, saturation, with the SLO line drawn in.",
  ],
  [
    "Row 2 · Where?",
    "The same signals per dependency, in the order requests flow: gateway, checkout, payments, database.",
  ],
  [
    "Row 3 · Why?",
    "Causes: CPU, memory, connection pools, garbage collection, queue depths. Linked from row 2.",
  ],
  [
    "Links out",
    "Each panel links to the traces and logs for the same time range, and every alert links to this dashboard.",
  ],
];

export function TopToBottom() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="General to specific"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {LAYOUT.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
              style={{ marginLeft: i * 10 }}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Grafana&apos;s guidance: &ldquo;A dashboard should tell a story or answer a question&rdquo;,
        and should flow &ldquo;large to small or general to specific&rdquo;. It also reminds you
        that &ldquo;dashboards should reduce cognitive load, not add to it.&rdquo;
      </p>
      <p>
        Chart habits that help: one unit per panel, lines for change over time, bar charts that
        start at zero, percentiles rather than averages, and the target drawn on the chart so
        &ldquo;bad&rdquo; is obvious.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Dashboards as code -------------------------------------------------------------------------- */

export function AsCode() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Dashboards as code"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`# provisioning/dashboards/checkout.yaml  (in Git, reviewed like code)
apiVersion: 1
providers:
  - name: services
    folder: Services
    options:
      path: /var/lib/grafana/dashboards   # JSON generated from code`}</Code>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Dashboard sprawl</p>
            <p className="text-muted mt-1">
              Grafana&apos;s maturity model describes the default state: copies of copies, nobody
              sure which one is right. Generating dashboards from templates (Grafana&apos;s
              Foundation SDK, Grafonnet, or Perses, a CNCF sandbox project) keeps one good layout
              for every service.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Hand-built dashboards drift and multiply. Keeping them as code means every service gets the
        same golden-signals layout, changes are reviewed, and a broken dashboard can be rolled back
        like any other change.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Top row or drill-down? ---------------------------------------------------------------------- */

export function TopOrDrill() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Top row or drill-down?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="top-or-drill"
            prompt="Where does each panel belong on a service dashboard?"
            categories={[
              { id: "top", label: "Top row" },
              { id: "down", label: "Further down" },
            ]}
            items={[
              {
                id: "errors",
                label: "Share of payments failing, with the SLO line",
                category: "top",
                why: "The first question: are users OK?",
              },
              {
                id: "p99",
                label: "p99 checkout latency",
                category: "top",
                why: "What the slowest users experience.",
              },
              {
                id: "burn",
                label: "Error budget remaining this month",
                category: "top",
                why: "Context for every decision the on-call makes.",
              },
              {
                id: "gc",
                label: "Garbage-collection pauses per server",
                category: "down",
                why: "A possible cause, for the drill-down.",
              },
              {
                id: "disk",
                label: "Disk I/O per volume",
                category: "down",
                why: "Resource detail for the 'why?' rows.",
              },
              {
                id: "threads",
                label: "Thread count per pod",
                category: "down",
                why: "Useful for diagnosis, meaningless as a first glance.",
              },
            ]}
            explanation="The top answers 'are users OK?' with symptoms; causes go below, one click away."
          />
        </div>
      }
    >
      <p>Symptoms on top, causes below.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["One question per dashboard", "Are users OK? Where? Why?"],
  ["Golden signals first", "With the SLO drawn in."],
  ["General to specific", "Drill down; link to traces and logs."],
  ["Honest charts", "One unit per panel, percentiles, zero-based bars."],
  ["As code", "Templates stop sprawl and copy-paste drift."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A dashboard is where an investigation starts, not where it ends. Next chapter: working an
        incident from the page to the cause, then running the response and learning from it.
      </p>
    </StepLayout>
  );
}
