"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { APPROACHES, LABEL, PARTS, STAGES, status, type Approach, type Status } from "./model";
import type { HydState } from "./state";

const TONE: Record<Status, string> = {
  html: "border-bad/40 bg-bad/10",
  download: "border-viz-idle bg-viz-idle/20",
  hydrate: "border-viz-compute bg-viz-compute/20",
  live: "border-good/50 bg-good/15",
  never: "border-line bg-surface",
};

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Photo() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The photo and the bricks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "A photo of the model",
              "Arrives instantly. Looks finished, but you can't play with a photo.",
            ],
            [
              "Then the bricks",
              "Rebuild the whole model exactly on top of the photo before anything moves.",
            ],
            [
              "Or just the moving parts",
              "Only rebuild the wheels and doors; the rest can stay a picture.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        Imagine being sent a photo of a finished toy model, then a box of bricks you must assemble
        over the photo before you can play. That&apos;s server rendering followed by{" "}
        <Term id="hydration">hydration</Term>.
      </p>
      <p>
        The page looks ready the moment the HTML arrives, but buttons don&apos;t work until the
        JavaScript has downloaded and run. Newer approaches rebuild less.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------ */

export function Stages() {
  const [s, set] = useSceneState<HydState>();
  const a = APPROACHES.find((x) => x.id === s.approach)!;
  const choose = (approach: Approach) =>
    set({
      approach,
      stage: 0,
      tried: s.tried.includes(approach) ? s.tried : [...s.tried, approach],
    });
  return (
    <StepLayout
      eyebrow="Step through"
      title="From HTML to interactive, four ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {APPROACHES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.approach === x.id}
                onClick={() => choose(x.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.approach === x.id ? "border-fg bg-surface-2" : "border-line-strong text-muted",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              disabled={s.stage === 0}
              onClick={() => set({ stage: s.stage - 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              disabled={s.stage === STAGES.length - 1}
              onClick={() => set({ stage: s.stage + 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Step
            </button>
            <span className="font-medium">{STAGES[s.stage]}</span>
          </div>
          <div className="grid gap-1">
            {PARTS.map((p) => {
              const st = status(s.approach, p, s.stage);
              return (
                <motion.div
                  layout
                  key={p.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs",
                    TONE[st],
                  )}
                >
                  <span>{p.label}</span>
                  <span className="text-muted text-[10px]">{LABEL[st]}</span>
                </motion.div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">JavaScript sent up front</p>
              <p className="font-mono font-semibold">{a.kb} KB</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Used by</p>
              <p>{a.who}</p>
            </div>
          </div>
          <p className="text-muted text-xs">{a.note}</p>
          {s.tried.length === 4 && (
            <p className="text-good text-xs">
              All four show the same HTML first. They differ in how much code must run before it
              responds.
            </p>
          )}
        </div>
      }
    >
      <p>
        A product page arrives as server-rendered HTML. Step through what happens next under each
        approach. Red means &ldquo;looks ready but can&apos;t respond yet&rdquo;, the uncanny valley
        where clicks are lost. Sizes are illustrative.
      </p>
      <p>
        Only the gallery and the Add to cart button actually need JavaScript. Watch which approaches
        notice that.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Who does what -------------------------------------------------------------------------------- */

export function WhoDoes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Partial hydration across frameworks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Astro",
              "Islands with client:load, client:idle, client:visible; server islands (stable since Astro 5, Dec 2024) for personal parts.",
            ],
            [
              "Angular",
              "Incremental hydration with @defer (hydrate on viewport, interaction…), the default since v22 (June 2026).",
            ],
            [
              "Vue and Nuxt",
              "Lazy hydration strategies since Vue 3.5 (2024) and Nuxt 3.16 (2025).",
            ],
            [
              "Qwik",
              "Resumability: no hydration step at all. Qwik 1 is stable; Qwik 2 is in release candidate.",
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
        The term <Term id="islands">islands</Term> was coined by Etsy&apos;s Katie Sylor-Miller in
        2019 and popularised by Jason Miller&apos;s 2020 article: islands of interactivity in a sea
        of static HTML.
      </p>
      <p>
        One common bug with any hydration: if the server&apos;s HTML and the first browser render
        differ (a date, a random number), frameworks report a hydration mismatch.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Server components ---------------------------------------------------------------------------- */

export function ServerComponents() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Server components, and why patching matters"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Server component</p>
              <p className="text-muted">
                Runs only on the server or at build time. Can read databases directly. Its code
                never reaches the browser.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Client component</p>
              <p className="text-muted">
                Marked “use client”. Rendered on the server too, then hydrated so it can respond to
                clicks.
              </p>
            </div>
          </div>
          <div className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">December 2025: CVE-2025-55182</p>
            <p className="text-muted">
              A critical flaw (severity 10 out of 10) in React Server Components allowed remote code
              execution on servers. Fixed in React&apos;s server packages 19.0.1, 19.1.2 and 19.2.1
              (and Next.js 15.0.5 to 15.5.7, 16.0.7); later fixes for related issues need 19.0.4,
              19.1.5 or 19.2.4 or newer.
            </p>
          </div>
        </div>
      }
    >
      <p>
        React Server Components, stable since React 19 (December 2024), move work to the server so
        less code ships. They aren&apos;t the same as server rendering: they send a description of
        the UI, not just HTML.
      </p>
      <p>
        Running more of the frontend on servers also means more server attack surface. Keep
        framework packages up to date, and treat every update to them as a security update.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function HydCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The button that does nothing"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="frontend-hydration"
            prompt="A server-rendered product page looks complete after 1 second, but tapping Add to cart does nothing until about 3 seconds. What's going on?"
            options={[
              {
                id: "css",
                label: "The CSS is still loading",
                feedback: "The page already looks right, so the styles have arrived.",
              },
              {
                id: "hyd",
                label:
                  "The JavaScript hasn't finished downloading and hydrating, so no click handler is attached yet",
                correct: true,
                feedback:
                  "Right: the uncanny valley between looking ready and being ready. Ship less JS, or hydrate the button first.",
              },
              {
                id: "api",
                label: "The cart API is slow",
                feedback:
                  "A slow API would show a spinner after the tap; here nothing responds at all.",
              },
            ]}
            explanation="Server-rendered HTML looks ready before it is. Islands, incremental hydration, server components and resumability all shorten that gap."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Looks ready ≠ is ready", "Hydration attaches behaviour."],
        ["Hydrate less", "Only what's interactive."],
        ["Islands and lazy hydration", "Astro, Angular, Vue, Nuxt."],
        ["Server components ship no code", "Client parts still hydrate."],
        ["Patch your framework", "Server code is attack surface."],
      ]}
    >
      <p>Next: caching pages close to users at the edge.</p>
    </WrapStep>
  );
}
