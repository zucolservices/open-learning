"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHUNKS, FIXES, ms } from "./model";
import type { JsState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Suitcase() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Packing for a weekend"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Pack everything",
              "Winter coat, three books, a tent “just in case”. Heavy to carry, slow through security.",
              "border-bad/40 bg-bad/10",
            ],
            [
              "Pack the weekend",
              "What you'll actually use. Buy the rare extra when you need it.",
              "border-good/50 bg-good/10",
            ],
          ].map(([t, b, c]) => (
            <div key={t} className={cn("rounded-xl border p-3 text-xs", c)}>
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Packing for every possibility makes a weekend trip miserable. Most of it never leaves the
        bag, but you carry all of it.
      </p>
      <p>
        Web pages do this with JavaScript. Every byte has to be downloaded, then parsed and run on
        the main thread, which is slow on cheap phones. A <Term id="bundler">bundler</Term> can pack
        smarter, but only if you tell it what you really need.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Shrink ⭐ ------------------------------------------------------------------------------------ */

export function Shrink() {
  const [s, set] = useSceneState<JsState>();
  const size = (id: string) => {
    const c = CHUNKS.find((x) => x.id === id)!;
    const f = FIXES.find((x) => x.affects === id && s.fixed.includes(x.id));
    return c.kb - (f ? f.saves : 0);
  };
  const total = CHUNKS.reduce((t, c) => t + size(c.id), 0);
  const full = CHUNKS.reduce((t, c) => t + c.kb, 0);
  const toggle = (id: string) =>
    set({ fixed: s.fixed.includes(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Shrink the first-load bundle"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex h-14 w-full overflow-hidden rounded-lg">
            {CHUNKS.map((c) => (
              <motion.div
                key={c.id}
                layout
                animate={{ width: `${(size(c.id) / full) * 100}%` }}
                className={cn("flex items-center justify-center overflow-hidden text-[9px]", c.cls)}
                title={c.label}
              >
                {size(c.id) > 40 ? size(c.id) : ""}
              </motion.div>
            ))}
            <div className="bg-surface-2 flex-1" />
          </div>
          <div className="text-muted flex flex-wrap gap-x-3 gap-y-0.5 text-[10px]">
            {CHUNKS.map((c) => (
              <span key={c.id} className="flex items-center gap-1">
                <span className={cn("inline-block size-2 rounded-sm", c.cls)} />
                {c.label}
              </span>
            ))}
          </div>
          <div className="grid gap-1">
            {FIXES.map((f) => {
              const on = s.fixed.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(f.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    on ? "border-good/50 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <span className="font-medium">{f.label}</span>
                  <span className="text-muted"> · −{f.saves} KB</span>
                  {on && <span className="text-muted block text-[10px]">{f.note}</span>}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={s.budget} onChange={() => set({ budget: !s.budget })} />
            Budget phone
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">First-load JavaScript</p>
              <p className="font-mono font-semibold">{total} KB</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Download and run (est.)</p>
              <p
                className={cn(
                  "font-mono font-semibold",
                  ms(total, s.budget) > 2000 ? "text-bad" : "text-good",
                )}
              >
                {(ms(total, s.budget) / 1000).toFixed(1)} s
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        This app sends 820 KB of JavaScript on first load. The bar shows what&apos;s inside. Apply
        each fix and watch the bundle and the estimated cost on a budget phone. Numbers are
        illustrative.
      </p>
      <p>
        Two techniques do most of the work: <Term id="code-splitting">code splitting</Term> and{" "}
        <Term id="tree-shaking">tree shaking</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Bundlers ------------------------------------------------------------------------------------- */

export function Bundlers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Today's bundlers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Vite 8",
              "Since March 2026, a single Rust-based bundler (Rolldown) for development and builds.",
            ],
            [
              "Turbopack",
              "The default for both development and builds in Next.js 16 (October 2025).",
            ],
            ["Rspack 2", "A webpack-compatible bundler written in Rust (April 2026)."],
            ["webpack 5, esbuild, Parcel", "Still widely used; esbuild is fast and minimal."],
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
        Bundlers combine your files and libraries into a few optimised files. Tooling has moved to
        fast native languages like Rust and Go, but they all rely on the same rules: tree shaking
        only works with static import and export, and dynamic import() marks where to split.
      </p>
      <p>
        Most bundlers have an analyser that draws a treemap like the one you just used. Look at it
        before every big release.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Cost ----------------------------------------------------------------------------------------- */

export function Cost() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why JavaScript costs more than images"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Images", 911, "Decoded, often off the main thread."],
            ["JavaScript", 632, "Downloaded, parsed, compiled and run on the main thread."],
            ["Fonts", 122, ""],
            ["CSS", 77, ""],
          ].map(([l, kb, n], i) => (
            <div key={l as string} className="text-xs">
              <div className="flex justify-between">
                <span>{l}</span>
                <span className="font-mono">{kb} KB</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((kb as number) / 911) * 100}%` }}
                transition={{ delay: 0.06 * i }}
                className="bg-viz-data/60 mt-0.5 h-2 rounded"
              />
              {n && <p className="text-subtle text-[10px]">{n}</p>}
            </div>
          ))}
          <p className="text-subtle text-[10px]">
            Median mobile home page, Web Almanac 2025 (Page Weight).
          </p>
        </div>
      }
    >
      <p>
        Byte for byte, JavaScript is the most expensive thing you send: it blocks the main thread
        and hurts responsiveness. Addy Osmani and Mathias Bynens found it runs several times slower
        on typical phones than on high-end ones.
      </p>
      <p>
        The median mobile page shipped 632 KB of it in 2025. Third-party scripts (ads, analytics,
        chat) are often a big share; audit them too.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function JsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Lighter or heavier?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-js-size"
            prompt="Does each change make the first-load JavaScript smaller or larger?"
            categories={[
              { id: "smaller", label: "Smaller" },
              { id: "larger", label: "Larger or no help" },
            ]}
            items={[
              {
                id: "lazy",
                label: "Load the admin pages with dynamic import()",
                category: "smaller",
                why: "Split into their own chunk.",
              },
              {
                id: "whole",
                label: "Import a whole library to use one function",
                category: "larger",
                why: "Unless it tree-shakes, you ship it all.",
              },
              {
                id: "modal",
                label: "Load a rarely used dialog's code when it's opened",
                category: "smaller",
                why: "Deferred until needed.",
              },
              {
                id: "poly",
                label: "Ship polyfills for very old browsers to everyone",
                category: "larger",
                why: "Modern browsers download code they don't need.",
              },
              {
                id: "native",
                label: "Replace a date library with the built-in Intl API",
                category: "smaller",
                why: "The browser already has it.",
              },
            ]}
            explanation="Split what isn't needed at first, import only what you use, and prefer what the browser already provides."
          />
        </div>
      }
    >
      <p>Sort each change.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["JS is the costliest byte", "Main-thread work."],
        ["Split by route", "dynamic import()."],
        ["Tree-shake", "ES modules and named imports."],
        ["Use the platform", "Intl, native elements."],
        ["Measure the bundle", "Treemaps before releases."],
      ]}
    >
      <p>Next: images and fonts, usually the heaviest bytes of all.</p>
    </WrapStep>
  );
}
