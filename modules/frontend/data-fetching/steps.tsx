"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIX_LIST, run } from "./model";
import type { FetchState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Letters() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Letters that arrive out of order"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Monday", "You post: “Meet at the café.”"],
            ["Tuesday", "You post: “Change of plan: meet at the park.”"],
            ["Wednesday", "Tuesday's letter arrives."],
            ["Thursday", "Monday's letter finally arrives. Your friend goes to the café."],
          ].map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 3 ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{d}</span>
              <span className="text-muted"> · {t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Send two letters a day apart and the post may deliver them in the wrong order. Whoever reads
        the last one to arrive acts on old news.
      </p>
      <p>
        Requests to a server behave the same way. Fetching data means handling the time in between:
        waiting, failures, and replies that arrive out of order, a bug called a{" "}
        <Term id="race-condition">race condition</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Search ⭐ ------------------------------------------------------------------------------------ */

export function Search() {
  const [s, set] = useSceneState<FetchState>();
  const r = run(s);
  const X = (t: number) => `${(t / 1100) * 100}%`;
  const ok = r.shown === "chai" || (s.flaky && r.failed && s.errors);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix a glitchy search box"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1">
            {FIX_LIST.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={s[f.id]}
                onClick={() => set({ [f.id]: !s[f.id] } as Partial<FetchState>)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  s[f.id] ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <span className="font-medium">{f.label}</span>
                {s[f.id] && <span className="text-muted block text-[10px]">{f.note}</span>}
              </button>
            ))}
            <label className="text-muted flex items-center gap-2 text-[11px]">
              <input type="checkbox" checked={s.flaky} onChange={() => set({ flaky: !s.flaky })} />
              Make the network fail on the last request
            </label>
          </div>
          <div className="border-line bg-surface rounded-lg border p-2 text-[10px]">
            <p className="text-muted mb-1">
              Typing “chai”: requests over time (0 to 1.1 s, illustrative)
            </p>
            {r.reqs.map((q) => (
              <div key={q.q} className="flex items-center gap-2 py-0.5">
                <span className="w-8 font-mono">{q.q}</span>
                <div className="bg-surface-2 relative h-3 flex-1 rounded">
                  <motion.div
                    layout
                    className={cn(
                      "absolute top-0 h-3 rounded",
                      q.aborted !== undefined
                        ? "bg-viz-idle/50"
                        : q.failed
                          ? "bg-bad/60"
                          : "bg-viz-data/70",
                    )}
                    style={{ left: X(q.sent), width: X((q.aborted ?? q.arrives) - q.sent) }}
                  />
                </div>
                <span className="text-muted w-16 text-right">
                  {q.aborted !== undefined ? "cancelled" : q.failed ? "failed" : `${q.arrives} ms`}
                </span>
              </div>
            ))}
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            <p className="text-muted text-[10px]">Search box: chai</p>
            {s.loading && <p className="text-muted text-[10px]">While waiting: “Loading…”</p>}
            <p>
              {r.failed
                ? s.errors
                  ? "“Couldn't load results. Try again.”"
                  : "(an empty list, with no explanation)"
                : `Showing results for “${r.shown}”`}
            </p>
          </div>
          <p className="text-muted text-[11px]">
            Requests sent: {r.reqs.length}
            {r.shown &&
              r.shown !== "chai" &&
              ` · The slow reply for “${r.shown}” arrived last and overwrote the right one.`}
          </p>
        </div>
      }
    >
      <p>
        This search box sends a request on every keystroke. Replies take different times, and the
        one for &ldquo;ch&rdquo; is slow. Look at what the user ends up seeing.
      </p>
      <p>
        Turn on fixes one by one. Then make the network fail and check the user still understands
        what happened.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Server state --------------------------------------------------------------------------------- */

export function ServerState() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Data libraries do the hard parts"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Cache by key", "The same query reuses the same result; no duplicate requests."],
            [
              "Stale while revalidate",
              "Show the cached copy instantly, refresh in the background. The name comes from an HTTP rule (RFC 5861).",
            ],
            ["Refetch on focus", "Come back to the tab and the data quietly updates."],
            [
              "Retry with backoff",
              "TanStack Query retries a failed request three times, waiting longer each time.",
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
        Data from a server is a copy that can go out of date. That&apos;s different from data that
        lives only in the browser, like whether a menu is open. TanStack Query (React, Vue, Svelte,
        Solid), SWR and RTK Query manage this <Term id="server-state">server state</Term> for you.
      </p>
      <p>
        Hand-written fetching code tends to reinvent these features, usually with bugs like the one
        you just fixed.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Frameworks ----------------------------------------------------------------------------------- */

export function Frameworks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fetching the framework way"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Route loaders",
              "Next.js, React Router, SvelteKit and Nuxt can load data for a page before it renders, often on the server.",
            ],
            [
              "Suspense and use()",
              "React can pause a component until a promise resolves, showing a fallback. The promise must be cached, and Suspense doesn't notice fetches started in an effect.",
            ],
            [
              "Effects as a last resort",
              "React's docs say frameworks provide better built-in data fetching than effects.",
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
        Fetching inside a component after it appears creates waterfalls: the page renders, then asks
        for data, then a child renders and asks for more.
      </p>
      <p>Loading data at the route level, or on the server, starts every request at once.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function FetchCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The wrong results"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="frontend-fetching"
            prompt="When people type quickly, a product filter sometimes shows results for what they typed earlier. What's the most likely cause?"
            options={[
              {
                id: "cache",
                label: "The cache keeps results too long",
                feedback:
                  "A cache keyed by the query would return the right results for each query.",
              },
              {
                id: "race",
                label: "An older, slower reply arrives after the newest one and overwrites it",
                correct: true,
                feedback:
                  "Right: a race condition. Cancel or ignore stale requests, or let a data library handle it.",
              },
              {
                id: "server",
                label: "The server is too slow",
                feedback:
                  "Slowness makes the bug easier to see, but the bug is accepting replies out of order.",
              },
            ]}
            explanation="Replies can arrive in any order. Cancel old requests, ignore stale ones, or use a library that keys requests by query."
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
        ["Replies arrive in any order", "Guard against race conditions."],
        ["Cancel or debounce", "Fewer, fresher requests."],
        ["Loading and error states", "Never silent."],
        ["Server state is a copy", "Let a library cache and refresh it."],
        ["Load early", "At the route, not deep in the tree."],
      ]}
    >
      <p>Next: deciding where each piece of shared state should live.</p>
    </WrapStep>
  );
}
