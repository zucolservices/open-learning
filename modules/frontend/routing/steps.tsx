"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MODES, PAGES, START, back, navigate, scroll, type Mode } from "./model";
import type { RouteState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Book() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A book with page numbers"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Numbered pages",
              "You can say “see page 42”, fold a corner, and flip back to where you were.",
            ],
            [
              "Loose sheets",
              "Pretty, but you can't point anyone to a page or find your place again.",
            ],
          ].map(([t, b], i) => (
            <div
              key={t}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i ? "border-bad/40 bg-bad/10" : "border-good/50 bg-good/10",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        A book&apos;s page numbers let you share a place, bookmark it and go back. Take them away
        and the story is still there, but nobody can find their way around it.
      </p>
      <p>
        URLs are the web&apos;s page numbers. <Term id="routing">Routing</Term> maps each URL to a
        screen. Apps that swap screens without reloading, called{" "}
        <Term id="spa">single-page apps</Term>, must keep the URL, the Back button and scroll
        position working as people expect.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Browser ⭐ ----------------------------------------------------------------------------------- */

export function Browser() {
  const [s, set] = useSceneState<RouteState>();
  const sim = s.sim;
  const page = PAGES[sim.shown];
  const act = (next: typeof sim) =>
    set({ sim: next, tried: s.tried.includes(s.mode) ? s.tried : [...s.tried, s.mode] });
  const links =
    sim.shown === "/"
      ? [["/menu", "Menu"]]
      : sim.shown === "/menu"
        ? [["/menu/chai", "Masala chai"]]
        : [["/menu", "Back to menu (link)"]];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Navigate the same site three ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Mode>
            size="sm"
            value={s.mode}
            onChange={(mode) => set({ mode, sim: START })}
            options={MODES.map((m) => [m.id, m.label])}
          />
          <div className="border-line bg-surface overflow-hidden rounded-lg border">
            <div className="border-line bg-surface-2 flex items-center gap-2 border-b px-2 py-1">
              <button
                type="button"
                aria-label="Browser back"
                onClick={() => act(back(sim, s.mode))}
                className="border-line-strong rounded border p-0.5"
              >
                <ArrowLeft className="size-3" />
              </button>
              <span className="bg-surface flex-1 rounded px-2 py-0.5 font-mono text-[11px]">
                chaicorner.example{sim.url}
              </span>
            </div>
            <div className="min-h-28 p-3 text-xs">
              {sim.left ? (
                <p className="text-bad">
                  You&apos;re back on the search results page. The café site is gone.
                </p>
              ) : (
                <motion.div key={sim.shown} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="font-semibold">{page.title.split(" · ")[0]}</p>
                  <p className="text-muted">{page.body}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {links.map(([to, l]) => (
                      <button
                        key={to}
                        type="button"
                        onClick={() => act(navigate(sim, s.mode, to))}
                        className="text-accent underline"
                      >
                        {l}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => act(scroll(sim))}
                      className="text-muted ml-auto text-[10px] underline"
                    >
                      scroll down
                    </button>
                  </div>
                  <p className="text-subtle mt-1 text-[10px]">
                    Scroll position: {sim.scroll[sim.shown] ?? 0}px
                  </p>
                </motion.div>
              )}
            </div>
          </div>
          <div className="border-line bg-surface-2 max-h-32 overflow-auto rounded-lg border p-2 font-mono text-[10px]">
            {sim.log.length === 0 ? (
              <p className="text-subtle">
                Click Menu, scroll down, open Masala chai, then press Back.
              </p>
            ) : (
              sim.log.map((l, i) => (
                <p key={i} className={cn(l.includes("left the site") && "text-bad")}>
                  {l}
                </p>
              ))
            )}
          </div>
          <button
            type="button"
            onClick={() => set({ sim: START })}
            className="text-muted self-start text-[10px] underline"
          >
            Start again
          </button>
          {s.tried.length === 3 && (
            <p className="text-good text-xs">
              A good SPA keeps what full page loads gave for free (URLs, Back, scroll) and adds
              speed.
            </p>
          )}
        </div>
      }
    >
      <p>
        Visit the menu, scroll down, open an item, then press the browser&apos;s Back button. Try it
        in each mode and compare the address bar and the log.
      </p>
      <p>
        A good router uses the browser&apos;s History API (pushState) so each screen gets its own
        URL and history entry.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Routes in frameworks ------------------------------------------------------------------------- */

export function Frameworks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Routes as folders"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {
              "app/\n  layout.tsx          ← shared header, stays mounted\n  page.tsx            → /\n  menu/\n    page.tsx          → /menu\n    [item]/\n      page.tsx        → /menu/chai, /menu/lassi …"
            }
          </pre>
          <div className="grid gap-1 text-xs">
            {[
              [
                "File-based routing",
                "Next.js, SvelteKit, Nuxt, and Vue Router 5 (since January 2026) map folders to URLs.",
              ],
              [
                "Config or code",
                "React Router 8 (June 2026), TanStack Router and Angular's router also support route lists in code.",
              ],
              [
                "Deep links",
                "The host must send the app for any path, or reloading /menu/chai gives a 404.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Most frameworks let folders define routes, with brackets for changing parts of the URL.
        Nested layouts stay on screen while the page inside them changes.
      </p>
      <p>
        After a client-side navigation, the router should also update the page title and move focus,
        so screen-reader users know the page changed.
      </p>
    </StepLayout>
  );
}

/* 4 ─ New APIs ------------------------------------------------------------------------------------- */

export function NewApis() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Newer browser tools for navigation"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Navigation API",
              "One navigate event for every kind of navigation. In all major browsers since January 2026 (Baseline newly available).",
            ],
            [
              "View Transitions (same page)",
              "Animate between states with one call. Baseline since October 2025.",
            ],
            [
              "View Transitions (across pages)",
              "Animate between full page loads with a line of CSS. Chrome, Edge and Safari; not yet Firefox.",
            ],
            ["URLPattern", "Match URLs like /menu/:item. Baseline since September 2025."],
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
        For years, routers were built on pushState and the popstate event, which only fires for Back
        and Forward. The Navigation API was designed for single-page apps from the start.
      </p>
      <p>
        Cross-page view transitions mean even plain multi-page sites can feel app-like, without a
        client-side router at all.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function RouteCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The disappearing Back button"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="frontend-routing"
            prompt="After a rewrite into a single-page app, users say Back takes them off the site, and links to inner pages don't work. What did the new router forget?"
            options={[
              {
                id: "cache",
                label: "To cache pages in the service worker",
                feedback: "Caching affects speed and offline use, not the URL or history.",
              },
              {
                id: "history",
                label:
                  "To give each screen its own URL and add a history entry (pushState) when it changes",
                correct: true,
                feedback: "Right: no URL change means no history entry and nothing to link to.",
              },
              {
                id: "ssr",
                label: "To render on the server",
                feedback:
                  "Server rendering helps first load, but Back and deep links depend on URLs and history.",
              },
            ]}
            explanation="A router's core job: keep the URL in step with the screen, add history entries, and handle Back. Then restore scroll and announce the new page."
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
        ["URLs are page numbers", "Every screen gets one."],
        ["History entries", "So Back and Forward work."],
        ["Restore scroll", "People return where they were."],
        ["Announce changes", "Update title and focus."],
        ["Deep links need a fallback", "Serve the app for any path."],
      ]}
    >
      <p>That ends the data and navigation chapter. Next: where HTML should be made.</p>
    </WrapStep>
  );
}
