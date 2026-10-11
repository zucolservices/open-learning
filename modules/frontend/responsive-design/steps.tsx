"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, WIDTHS } from "./model";
import type { RespState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Water() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Be like water"
      stage={
        <div className="flex flex-1 items-end justify-center gap-3">
          {[
            [40, 70],
            [80, 40],
            [120, 26],
          ].map(([w, h], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line-strong flex items-end rounded-b-lg border-x-2 border-b-2"
              style={{ width: w, height: 80 }}
            >
              <div className="bg-viz-data/50 w-full rounded-b" style={{ height: h }} />
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Pour the same water into a tall glass, a bowl or a tray, and it takes the shape of each.
        Nothing spills, nothing is cut off.
      </p>
      <p>
        <Term id="responsive-design">Responsive design</Term>, named by Ethan Marcotte in 2010, asks
        pages to do the same across phones, tablets and wide monitors. About 59% of web traffic
        worldwide, and about 77% in India, came from phones in September 2026.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Sandbox ⭐ ----------------------------------------------------------------------------------- */

export function Sandbox() {
  const [s, set] = useSceneState<RespState>();
  const on = (id: string) => s.fixed.includes(id);
  const toggle = (id: string) =>
    set({ fixed: on(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  const layoutW = !on("meta") && s.width <= 480 ? 980 : s.width;
  const contentW = on("fluid") ? layoutW : Math.max(960, layoutW);
  const overflow = contentW > layoutW + 1;
  const stacked = on("mq") && layoutW < 768;
  const mainW = stacked ? contentW - 24 : contentW - 24 - Math.min(220, contentW * 0.3);
  const cols = on("fluid") ? Math.max(1, Math.floor(mainW / 150)) : 3;
  const cardW = mainW / cols;
  const rowCard = on("cq") && cardW > 260;
  const headPx = on("clamp") ? Math.min(32, Math.max(20, layoutW * 0.04)) : 34;
  const scale = Math.min(1, 300 / layoutW);
  const tiny = !on("meta") && s.width <= 480;
  return (
    <StepLayout
      eyebrow="Sandbox"
      title="Make a shop page fit every screen"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={String(s.width)}
            onChange={(v) => set({ width: Number(v) })}
            options={WIDTHS.map((w) => [String(w), `${w}px`])}
          />
          <div className="flex flex-wrap gap-1">
            {FIXES.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={on(f.id)}
                onClick={() => toggle(f.id)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  on(f.id) ? "border-good bg-good/20" : "border-line-strong text-muted",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div
            className="border-line-strong bg-surface mx-auto overflow-hidden rounded-lg border"
            style={{ width: Math.min(300, s.width * scale * (layoutW / s.width)) + 2, height: 220 }}
          >
            <div
              style={{ width: layoutW, transform: `scale(${scale})`, transformOrigin: "top left" }}
            >
              <div style={{ width: contentW, padding: 12 }}>
                <p
                  style={{ fontSize: headPx, lineHeight: 1.1, whiteSpace: "nowrap" }}
                  className="font-semibold"
                >
                  Today&apos;s specials
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: stacked ? "1fr" : "1fr 30%",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${cols}, 1fr)`,
                      gap: 10,
                    }}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-line bg-surface-2 rounded border"
                        style={{
                          display: "flex",
                          flexDirection: rowCard ? "row" : "column",
                          gap: 6,
                          padding: 8,
                        }}
                      >
                        <div
                          className="bg-viz-meta/40 rounded"
                          style={{ width: rowCard ? 70 : "100%", height: 60 }}
                        />
                        <div style={{ fontSize: 14 }}>Chai {i + 1}</div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="border-line bg-viz-data/15 rounded border"
                    style={{ padding: 8, fontSize: 14 }}
                  >
                    Filters
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-0.5 text-[11px]">
            {tiny && (
              <p className="text-bad">
                The phone renders at 980 px and shrinks it: text is tiny, people pinch to zoom.
              </p>
            )}
            {overflow && (
              <p className="text-bad">
                Content is {Math.round(contentW)} px wide on a {layoutW} px screen: sideways
                scrolling.
              </p>
            )}
            {!on("clamp") && layoutW <= 480 && (
              <p className="text-bad">The heading is too big for a phone.</p>
            )}
            {!tiny && !overflow && (on("clamp") || layoutW > 480) && (
              <p className="text-good">Fits at {s.width} px. Try the other widths.</p>
            )}
          </div>
        </div>
      }
    >
      <p>
        This shop listing was built for a desktop. Pick a screen width, then switch fixes on and see
        how the page reflows. Start at 320 pixels, the width WCAG&apos;s reflow rule tests at.
      </p>
      <p>
        Media queries respond to the screen; <Term id="container-query">container queries</Term>{" "}
        respond to the space a component is given.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The responsive toolkit"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {FIXES.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{f.label}</p>
              <p className="text-muted font-mono text-[10px] break-all">{f.css}</p>
              <p className="text-muted">{f.note}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Container size queries have been safe to use widely since August 2025; container style
        queries reached every major browser in May 2026. Viewport units like svh and dvh handle
        mobile toolbars that appear and disappear.
      </p>
      <p>Design mobile first: start with the narrow layout, then add rules as space grows.</p>
    </StepLayout>
  );
}

/* 4 ─ Beyond width --------------------------------------------------------------------------------- */

export function Beyond() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Responsive is more than width"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Touch targets",
              "At least 24 by 24 pixels (WCAG 2.2 AA); 44 or more is kinder to thumbs.",
            ],
            [
              "Zoom and reflow",
              "Text resizable to 200%; usable at 320 px wide without sideways scrolling.",
            ],
            ["Orientation", "Don't lock the page to portrait or landscape."],
            [
              "User preferences",
              "prefers-reduced-motion and prefers-color-scheme let people opt out of animation or pick dark mode.",
            ],
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
        Responsive design and accessibility overlap: someone zoomed to 400% on a laptop sees roughly
        the same layout as a phone user.
      </p>
      <p>Test on a real low-cost phone at least once; emulators hide slow CPUs and fat fingers.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function RespCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Media query or container query?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-responsive"
            prompt="Which kind of query fits each job best?"
            categories={[
              { id: "media", label: "Media query" },
              { id: "container", label: "Container query" },
            ]}
            items={[
              {
                id: "page",
                label: "Switch the page from one column to two on tablets",
                category: "media",
                why: "A page-level decision based on the screen.",
              },
              {
                id: "card",
                label: "A card that's compact in the sidebar and wide in the main area",
                category: "container",
                why: "Depends on the space the card gets.",
              },
              {
                id: "nav",
                label: "Hide the side navigation on phones",
                category: "media",
                why: "Depends on the screen.",
              },
              {
                id: "widget",
                label: "A reusable widget dropped into different layouts",
                category: "container",
                why: "Adapts to its container wherever it's placed.",
              },
              {
                id: "print",
                label: "A simpler layout when printing",
                category: "media",
                why: "Print is a media type.",
              },
            ]}
            explanation="Media queries ask about the screen or device. Container queries ask about the box a component lives in, which makes components truly reusable."
          />
        </div>
      }
    >
      <p>Sort each job.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Viewport meta first", "Or phones shrink the page."],
        ["Fluid by default", "Grids that fit, clamp() for type."],
        ["Media queries for pages", "Container queries for components."],
        ["Test at 320 px", "No sideways scrolling."],
        ["Mobile first", "Most traffic is on phones."],
      ]}
    >
      <p>Next: design systems, and keeping a whole product consistent.</p>
    </WrapStep>
  );
}
