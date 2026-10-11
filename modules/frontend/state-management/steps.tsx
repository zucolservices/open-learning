"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HOMES, LADDER, PIECES, type Home } from "./model";
import type { MgmtState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function House() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Where do you keep your keys?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Your pocket", "Your own phone: only you need it."],
            ["The hall table", "House keys everyone in the family uses."],
            ["The noticeboard", "The Wi-Fi password: rarely changes, everyone reads it."],
            ["The town hall", "Records that belong to someone else; you keep a copy."],
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
        You don&apos;t keep everything in one place. Personal things stay in your pocket, shared
        things go where the people who share them can reach.
      </p>
      <p>
        State works the same way. Not everything belongs in a global{" "}
        <Term id="state-store">store</Term>. Keep each piece as close as possible to the components
        that use it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Decide ⭐ ------------------------------------------------------------------------------------ */

export function Decide() {
  const [s, set] = useSceneState<MgmtState>();
  const good = (id: string) => {
    const p = PIECES.find((x) => x.id === id)!;
    return s.picks[id] === p.answer || (p.ok ?? []).includes(s.picks[id]);
  };
  const done = PIECES.every((p) => good(p.id));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Find a home for each piece of state"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {PIECES.map((p) => {
            const pick = s.picks[p.id];
            return (
              <div
                key={p.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <p>{p.text}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {HOMES.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      aria-pressed={pick === h.id}
                      onClick={() => set({ picks: { ...s.picks, [p.id]: h.id as Home } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        pick === h.id
                          ? good(p.id)
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-0.5 text-[10px]", good(p.id) ? "text-good" : "text-muted")}>
                    {good(p.id)
                      ? p.why
                      : "Think about who needs it, how often it changes, and whether it should survive a reload."}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <p className="text-good text-xs">
              Six pieces, five different homes. Global stores hold only what truly needs them.
            </p>
          )}
        </div>
      }
    >
      <p>
        A shop app has six pieces of state. Choose where each should live. Ask three questions: who
        needs it, how often does it change, and should it survive a reload or be shareable?
      </p>
      <p>One piece has two reasonable answers.</p>
    </StepLayout>
  );
}

/* 3 ─ The ladder ----------------------------------------------------------------------------------- */

export function Ladder() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Climb only as high as you need"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {LADDER.map((l, i) => (
            <motion.div
              key={l.step}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              style={{ marginLeft: i < 4 ? i * 12 : 0 }}
            >
              <p className="font-semibold">{l.step}</p>
              <p className="text-muted">{l.tools}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Start local and move up only when something forces you to. Each step adds reach and a bit of
        complexity.
      </p>
      <p>
        Moving server data into a cache library often shrinks client state so much that a big store
        isn&apos;t needed at all, as TanStack&apos;s docs point out.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Context vs store ----------------------------------------------------------------------------- */

export function ContextVsStore() {
  const [s, set] = useSceneState<MgmtState>();
  const readers = [
    "Header",
    "Cart icon",
    "Sidebar",
    "Card",
    "Card",
    "Card",
    "Card",
    "Footer",
    "Banner",
    "Toast",
  ];
  const uses = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Context isn't a store"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.store ? "store" : "ctx"}
            onChange={(v) => set({ store: v === "store" })}
            options={[
              ["ctx", "Cart in context"],
              ["store", "Cart in a store with selectors"],
            ]}
          />
          <button
            type="button"
            onClick={() => set({ changes: s.changes + 1 })}
            className="border-line-strong self-start rounded-full border px-3 py-1 text-xs"
          >
            Add an item to the cart
          </button>
          <div className="grid grid-cols-5 gap-1">
            {readers.map((r, i) => {
              const hit = s.changes > 0 && (!s.store || uses[i]);
              return (
                <motion.div
                  key={`${i}-${s.changes}-${s.store}`}
                  initial={hit ? { scale: 1.12 } : false}
                  animate={{ scale: 1 }}
                  className={cn(
                    "rounded border px-1 py-2 text-center text-[10px]",
                    hit
                      ? "border-viz-compute bg-viz-compute/25"
                      : "border-line bg-surface text-subtle",
                  )}
                >
                  {r}
                </motion.div>
              );
            })}
          </div>
          <p className="text-muted text-xs">
            {s.changes === 0
              ? "Add an item and watch which components re-render."
              : s.store
                ? "Only the two components that select the cart count re-render."
                : "Every component reading the context re-renders, even those that don't use the cart."}
          </p>
        </div>
      }
    >
      <p>
        Context passes a value down the tree. When it changes, every component that reads it
        re-renders. That&apos;s fine for a theme; it can be wasteful for a cart that changes often.
      </p>
      <p>
        Stores let each component subscribe to just the slice it needs. Ten components read here;
        only two use the cart count.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function MgmtCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The shareable filter"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="frontend-state-mgmt"
            prompt="On a hotel search page, the chosen dates and price filter should survive a reload and be shareable as a link. Where should they live?"
            options={[
              {
                id: "store",
                label: "In a global store",
                feedback: "A store is lost on reload and can't be shared as a link.",
              },
              {
                id: "url",
                label: "In the URL's query string",
                correct: true,
                feedback: "Right: reload-proof, bookmarkable, shareable, and Back works.",
              },
              {
                id: "local",
                label: "In the search form's local state",
                feedback: "Gone on reload, and other components can't see it.",
              },
            ]}
            explanation="If state should survive a reload or be shared, put it in the URL. Libraries such as nuqs make URL state feel like ordinary state."
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
        ["Keep state close", "Start local."],
        ["Lift when siblings share", "Nearest common parent."],
        ["Context for rare changes", "Themes, the current user."],
        ["Stores for busy shared state", "Subscribe to slices."],
        ["URL and server cache", "Shareable state and server data."],
      ]}
    >
      <p>Next: routing, and pages that change without reloading.</p>
    </WrapStep>
  );
}
