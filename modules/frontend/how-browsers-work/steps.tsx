"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, SCRIPT_MODES, STAGES, type ScriptMode } from "./model";
import type { PipeState } from "./state";

/* 2 ─ Which stages run? ---------------------------------------------------------------------------- */

export function Stages() {
  const [s, set] = useSceneState<PipeState>();
  const c = CHANGES.find((x) => x.id === s.change);
  const pick = (id: string) =>
    set({ change: id, tried: s.tried.includes(id) ? s.tried : [...s.tried, id] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Change one property: which steps rerun?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1">
            {CHANGES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.change === x.id}
                onClick={() => pick(x.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left font-mono text-xs",
                  s.change === x.id
                    ? "border-fg bg-surface-2"
                    : "border-line bg-surface hover:border-line-strong",
                )}
              >
                {x.css}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {STAGES.map((st) => {
              const on = c?.stages.includes(st.id);
              return (
                <motion.div
                  key={st.id}
                  animate={{ opacity: c ? (on ? 1 : 0.3) : 0.6, scale: on ? 1.03 : 1 }}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center text-xs",
                    on
                      ? st.id === "layout"
                        ? "border-bad/60 bg-bad/10"
                        : "border-viz-compute bg-viz-compute/15"
                      : "border-line bg-surface",
                  )}
                >
                  <p className="font-semibold">{st.label}</p>
                  <p className="text-muted hidden text-[10px] sm:block">{st.desc}</p>
                </motion.div>
              );
            })}
          </div>
          <p className="text-muted min-h-10 text-xs">
            {c ? c.note : "Pick a change to see which steps the browser has to redo."}
          </p>
          {s.tried.length === CHANGES.length && (
            <p className="text-good text-xs">
              Layout is the expensive step. Changes that avoid it are cheaper; transform and opacity
              can skip paint too.
            </p>
          )}
        </div>
      }
    >
      <p>
        Pages don&apos;t stay still: hover effects, animations and new content all change styles.
        Each change makes the browser redo some of the pipeline, but not always all of it.
      </p>
      <p>Try each change and watch which steps run again. Fewer steps means smoother pages.</p>
    </StepLayout>
  );
}

/* 3 ─ Scripts and parsing -------------------------------------------------------------------------- */

export function Scripts() {
  const [s, set] = useSceneState<PipeState>();
  const m = SCRIPT_MODES.find((x) => x.id === s.script)!;
  const X = (t: number) => `${t}%`;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where you put a script matters"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<ScriptMode>
            size="sm"
            value={s.script}
            onChange={(script) => set({ script })}
            options={SCRIPT_MODES.map((x) => [x.id, x.label])}
          />
          <div className="border-line bg-surface grid gap-2 rounded-lg border p-3 text-[10px]">
            {(
              [
                ["Parse HTML", m.parse, "bg-viz-data"],
                ["Download script", [m.fetch], "bg-viz-idle"],
                ["Run script", [m.run], "bg-viz-compute"],
              ] as const
            ).map(([label, spans, cls]) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-muted w-24 shrink-0">{label}</span>
                <div className="bg-surface-2 relative h-3 flex-1 rounded">
                  {spans.map(([a, b], i) => (
                    <motion.div
                      key={`${s.script}-${i}`}
                      initial={{ width: 0 }}
                      animate={{ width: X(b - a) }}
                      style={{ left: X(a) }}
                      className={cn("absolute top-0 h-3 rounded", cls)}
                    />
                  ))}
                </div>
              </div>
            ))}
            <p className="text-subtle">Time runs left to right. Illustrative.</p>
          </div>
          <p className="text-muted text-xs">{m.note}</p>
        </div>
      }
    >
      <p>
        A plain script tag stops the HTML parser until the script has downloaded and run, because
        the script might change the page. The attributes defer and async let the download happen in
        parallel.
      </p>
      <p>
        Browsers also run a lookahead &ldquo;preload scanner&rdquo; that starts downloading images
        and styles while the parser waits, so blocking slows things down without stopping all work.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Engines -------------------------------------------------------------------------------------- */

export function Engines() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three engines, one web"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Blink", "Chrome, Edge, Opera, Samsung Internet, Brave"],
            ["WebKit", "Safari, and every iOS browser outside the EU"],
            ["Gecko", "Firefox"],
          ].map(([e, b], i) => (
            <motion.div
              key={e}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{e}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
          <div className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Baseline</p>
            <p className="text-muted">
              &ldquo;Newly available&rdquo;: works in every major browser. &ldquo;Widely
              available&rdquo;: 30 months after that, safe to use without a fallback for most sites.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Every browser follows the same broad pipeline, though the internals differ: Chromium calls
        its design RenderingNG, and all three engines composite away from the main thread.
      </p>
      <p>
        Because engines add features at different times, check support before relying on something
        new. <Term id="baseline-web">Baseline</Term> labels on MDN and web.dev tell you at a glance.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function PipeCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the pipeline in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="frontend-pipeline"
            prompt="Order the steps a browser takes to show a page, first to last."
            items={[
              { id: "dom", label: "Parse HTML into the DOM" },
              { id: "cssom", label: "Parse CSS into the CSSOM" },
              { id: "render", label: "Combine them into the render tree" },
              { id: "layout", label: "Layout: sizes and positions" },
              { id: "paint", label: "Paint pixels" },
              { id: "composite", label: "Composite layers" },
            ]}
            explanation="Structure and style first, then what's visible, then where it goes, then pixels, then layers. DOM and CSSOM are built in parallel in practice; both must exist before layout."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Text becomes trees", "HTML to DOM, CSS to CSSOM."],
        ["CSS blocks rendering", "Keep critical CSS small."],
        ["Layout is costly", "Avoid needless size changes."],
        ["Animate transform and opacity", "They can skip layout and paint."],
        ["Defer scripts", "Don't block the parser."],
      ]}
    >
      <p>Next: HTML that tells browsers, people and machines what each part means.</p>
    </WrapStep>
  );
}
