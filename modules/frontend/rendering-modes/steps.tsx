"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MODES, times, type Mode } from "./model";
import type { RenderState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Furniture() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Four ways to get a table"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Flat-pack",
              "You carry home a box and assemble it yourself. Quick to collect, slow to use.",
            ],
            [
              "Built to order",
              "The shop builds it while you wait. Exactly what you asked for, but you wait at the counter.",
            ],
            [
              "From the warehouse",
              "Already built, ready to carry off. Fast, but it's last season's design.",
            ],
            [
              "Restocked regularly",
              "Warehouse stock, quietly rebuilt every so often with the latest design.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A furniture shop can hand you a flat-pack box, build to order, sell from the warehouse, or
        keep warehouse stock fresh by rebuilding it now and then.
      </p>
      <p>
        Web pages have the same options for making HTML: in the browser (<Term id="csr">CSR</Term>),
        on the server per request (<Term id="ssr">SSR</Term>), once at build time (
        <Term id="ssg">static</Term>), or static with regular rebuilds (<Term id="isr">ISR</Term>).
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Compare() {
  const [s, set] = useSceneState<RenderState>();
  const m = MODES.find((x) => x.id === s.mode)!;
  const t = times(s.mode, s.slow);
  const X = (v: number) => `${(v / 3.2) * 100}%`;
  const frames = [0.2, 0.6, 1.2, 2.0, 3.0];
  const pick = (patch: Partial<RenderState>) => {
    const mode = patch.mode ?? s.mode;
    set({ ...patch, tried: s.tried.includes(mode) ? s.tried : [...s.tried, mode] });
  };
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Load the same page four ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {MODES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.mode === x.id}
                onClick={() => pick({ mode: x.id as Mode })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.mode === x.id ? "border-fg bg-surface-2" : "border-line-strong text-muted",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={s.slow} onChange={() => set({ slow: !s.slow })} />
            Budget phone (slower to run JavaScript)
          </label>
          <p className="text-muted text-[11px]">{m.where}</p>
          <div className="grid grid-cols-5 gap-1">
            {frames.map((f) => {
              const state = f >= t.interactive ? "ready" : f >= t.content ? "content" : "blank";
              return (
                <div key={f} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex h-16 w-full flex-col gap-1 rounded border p-1",
                      state === "blank"
                        ? "border-line bg-surface"
                        : "border-line-strong bg-surface",
                    )}
                  >
                    {state !== "blank" && (
                      <>
                        <div className="bg-viz-data/50 h-2 w-3/4 rounded" />
                        <div className="bg-viz-idle/50 h-1.5 w-full rounded" />
                        <div
                          className={cn(
                            "mt-auto h-2.5 w-1/2 rounded",
                            state === "ready" ? "bg-good/70" : "bg-viz-idle/40",
                          )}
                        />
                      </>
                    )}
                  </div>
                  <span className="text-subtle text-[9px]">{f}s</span>
                </div>
              );
            })}
          </div>
          <div className="border-line bg-surface grid gap-1 rounded-lg border p-2 text-[10px]">
            {(
              [
                ["First byte", t.ttfb, "bg-viz-idle"],
                ["Content visible", t.content, "bg-viz-data"],
                ["Interactive", t.interactive, "bg-good"],
              ] as const
            ).map(([l, v, c]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="text-muted w-24">{l}</span>
                <div className="bg-surface-2 relative h-2.5 flex-1 rounded">
                  <motion.div
                    animate={{ width: X(v) }}
                    className={cn("absolute h-2.5 rounded", c)}
                  />
                </div>
                <span className="w-10 text-right font-mono">{v.toFixed(1)}s</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Freshness</p>
              <p>{m.fresh}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Server cost</p>
              <p>{m.cost}</p>
            </div>
          </div>
          {s.tried.length === 4 && (
            <p className="text-good text-xs">
              No mode wins everywhere: you trade first-paint speed, freshness and server cost.
            </p>
          )}
        </div>
      }
    >
      <p>
        One product page, four ways of making its HTML. Compare when content appears and when the
        page responds to clicks, then try a budget phone. Times are illustrative.
      </p>
      <p>
        Server and static rendering show content early; the page still needs its JavaScript before
        buttons work.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Streaming ------------------------------------------------------------------------------------ */

export function Streaming() {
  const [s, set] = useSceneState<RenderState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Streaming and mixing modes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.streamed ? "s" : "w"}
            onChange={(v) => set({ streamed: v === "s" })}
            options={[
              ["w", "Wait for everything"],
              ["s", "Stream the shell first"],
            ]}
          />
          <div className="border-line bg-surface grid gap-1.5 rounded-lg border p-3 text-xs">
            {[
              ["Header and product photo", "static", 0.3],
              ["Price and stock", "cached for an hour", 0.3],
              ["Your recommendations", "personal, from the server", 1.4],
            ].map(([t, k, at], i) => {
              const showAt = s.streamed ? (at as number) : 1.4;
              return (
                <motion.div
                  key={`${t}-${s.streamed}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: showAt * 0.6 }}
                  className={cn(
                    "rounded border px-2 py-1.5",
                    i === 2 ? "border-viz-meta bg-viz-meta/15" : "border-viz-data bg-viz-data/15",
                  )}
                >
                  <span className="font-medium">{t as string}</span>
                  <span className="text-muted">
                    {" "}
                    · {k as string} · visible at {showAt}s
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        You don&apos;t have to pick one mode per site. Streaming sends the fast parts of a page
        straight away and the slow, personal parts as they&apos;re ready.
      </p>
      <p>
        Next.js 16 calls this mix Partial Prerendering inside its Cache Components model, on by
        default for new apps since 16.4 (October 2026). Nuxt route rules, SvelteKit, Astro server
        islands and Angular&apos;s per-route render modes offer similar choices.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Trade-offs ----------------------------------------------------------------------------------- */

export function Tradeoffs() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Picking per page"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Same for everyone, rarely changes", "Static. Fastest and cheapest."],
            [
              "Same for everyone, changes daily",
              "Static with revalidation (ISR) or a short cache.",
            ],
            ["Personal or always current", "Server rendering, ideally streamed."],
            ["Behind a login, very interactive, no search traffic", "Client-side can be fine."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Next.js introduced ISR in 2020, borrowing the idea of serving a stale copy while a fresh one
        is made in the background. The first visitor after a page expires still gets the old copy.
      </p>
      <p>
        Time to first byte isn&apos;t a Core Web Vital itself, but it delays everything after it, so
        slow server rendering shows up in the loading metric.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function RenderCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Choose a mode for each page"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-rendering"
            prompt="Which rendering mode suits each page best?"
            categories={[
              { id: "ssg", label: "Static" },
              { id: "isr", label: "Static + revalidate" },
              { id: "ssr", label: "Server" },
              { id: "csr", label: "Client" },
            ]}
            items={[
              {
                id: "docs",
                label: "A documentation page updated with each release",
                category: "ssg",
                why: "Same for all, changes on deploy.",
              },
              {
                id: "prices",
                label: "A product page whose prices change a few times a day",
                category: "isr",
                why: "Shared, but needs refreshing.",
              },
              {
                id: "account",
                label: "A logged-in “My orders” page that search engines never see",
                category: "ssr",
                why: "Personal and current; client rendering also works.",
              },
              {
                id: "editor",
                label: "A drawing tool inside an app, behind a login",
                category: "csr",
                why: "Highly interactive, no SEO needs.",
              },
              { id: "blog", label: "A blog post", category: "ssg", why: "Rarely changes." },
            ]}
            explanation="Shared and stable: static. Shared but changing: revalidate. Personal: server. App-like and private: client is fine."
          />
        </div>
      }
    >
      <p>Sort each page.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Four places to make HTML", "Browser, server, build, build-and-refresh."],
        ["Visible isn't interactive", "JavaScript still has to load."],
        ["Static is fastest", "When the page is the same for everyone."],
        ["Stream the slow parts", "Send the shell first."],
        ["Choose per page", "Even per component."],
      ]}
    >
      <p>Next: hydration, and newer ways to send less JavaScript.</p>
    </WrapStep>
  );
}
