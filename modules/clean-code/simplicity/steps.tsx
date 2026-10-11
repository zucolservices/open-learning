"use client";

import { motion } from "motion/react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { CHANGES, DESIGNS, type Design } from "./model";
import type { SimpleState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The kitchen built for a banquet"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Built for “someday”</p>
            <p className="text-muted">
              Twelve burners, a tandoor and a pizza oven for a café that sells sandwiches.
              Everything must be cleaned, serviced and learned.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Built for today</p>
            <p className="text-muted">
              A grill, a toaster, a coffee machine. When the menu grows, they add what it needs.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A café owner who equips the kitchen for every dish they might one day serve pays for it
        every day: in space, cleaning, training. Most of those dishes never make the menu.
      </p>
      <p>
        Code is the same. Building for imagined future needs adds code everyone must read and
        maintain. The XP slogan <Term id="yagni">YAGNI</Term>, &ldquo;you aren&apos;t gonna need
        it&rdquo;, is a reminder to build for today&apos;s needs, while keeping the code easy to
        change.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three designs ⭐ ------------------------------------------------------------------------------ */

export function ThreeDesigns() {
  const [s, set] = useSceneState<SimpleState>();
  const d = DESIGNS.find((x) => x.id === s.design);
  const spent = d ? d.build + CHANGES.slice(0, s.step).reduce((t, c) => t + c.cost[d.id], 0) : 0;
  const choose = (id: Design) =>
    set({ design: id, step: 0, tried: s.tried.includes(id) ? s.tried : [...s.tried, id] });
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Build happy hour three ways, then change it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-xs">
            <span className="text-muted">The request:</span> 20% off drinks between 4 and 6 pm.
          </p>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {DESIGNS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.design === x.id}
                onClick={() => choose(x.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  s.design === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="font-semibold">{x.label}</p>
                <p className="text-muted text-[10px]">{x.blurb}</p>
                <p className="mt-0.5 font-mono text-[10px]">
                  ~{x.lines} lines · {x.build} h to build
                </p>
              </button>
            ))}
          </div>
          {d && (
            <motion.div
              key={d.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-2"
            >
              <Code lines={d.code} numbers={false} />
              <div className="grid gap-1">
                {CHANGES.map((c, i) => (
                  <div
                    key={c.label}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs",
                      i < s.step
                        ? c.cost[d.id] >= 3
                          ? "border-bad/40 bg-bad/10"
                          : "border-line bg-surface"
                        : "border-line bg-surface opacity-40",
                    )}
                  >
                    <p className="font-medium">
                      Month {i + 2}: {c.label}
                    </p>
                    {i < s.step && (
                      <p className="text-muted text-[10px]">
                        {c.note[d.id]} <span className="font-mono">({c.cost[d.id]} h)</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {s.step < CHANGES.length ? (
                  <button
                    type="button"
                    onClick={() => set({ step: s.step + 1 })}
                    className="bg-accent text-accent-fg flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                  >
                    Next change <ArrowRight className="size-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => set({ step: 0 })}
                    className="border-line-strong flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
                  >
                    <RotateCcw className="size-3" /> Replay
                  </button>
                )}
                <span className="text-xs">
                  Total so far: <span className="font-mono">{Math.round(spent * 10) / 10} h</span>
                </span>
              </div>
            </motion.div>
          )}
          <p className="text-subtle text-[10px]">Hours and line counts are illustrative.</p>
        </div>
      }
    >
      <p>Pick a design, then live through the next few months of changes. Try all three.</p>
      <p>
        The flexible designs bet on which changes will come. When the bet is right they win a
        little; when it&apos;s wrong, you pay for the flexibility <em>and</em> for working around
        it. The simple version is never the cleverest, but it&apos;s cheap to change in any
        direction.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Simple is not easy --------------------------------------------------------------------------- */

export function SimpleEasy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Simple is not the same as easy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Simple</p>
              <p className="text-muted">
                Not tangled together. Each part does one thing. A property of the code itself.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Easy</p>
              <p className="text-muted">
                Familiar, close at hand. A property of you. Adding one more library is easy; it may
                not be simple.
              </p>
            </div>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Four costs of building a feature early</p>
            <p className="text-muted">
              Building it, delaying what you needed now, carrying the extra code, and repairing it
              when the real need turns out different. (Martin Fowler, 2015)
            </p>
          </div>
        </div>
      }
    >
      <p>
        Rich Hickey&apos;s talk &ldquo;Simple Made Easy&rdquo; (2011) made the distinction famous:
        simple means not <em>complected</em>, Hickey's word for braided together. Unfamiliar code
        can be simple; familiar code can be tangled.
      </p>
      <p>
        YAGNI came out of Extreme Programming (Kent Beck, then Ron Jeffries wrote it up in 1998).
        Fowler stresses its limit: it&apos;s about not building speculative features, never about
        skipping tests or refactoring that keep code easy to change.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Gall's law ----------------------------------------------------------------------------------- */

export function Gall() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Start simple, grow from there"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-end gap-2">
            {[8, 16, 28, 44].map((h, i) => (
              <motion.div
                key={h}
                initial={{ height: 0 }}
                animate={{ height: h * 2 }}
                transition={{ delay: 0.15 * i }}
                className="bg-accent/50 w-10 rounded-t"
              />
            ))}
          </div>
        </div>
      }
    >
      <p>
        John Gall wrote in 1975: &ldquo;A complex system that works is invariably found to have
        evolved from a simple system that worked.&rdquo; Designing the complex version up front
        rarely works, because you don&apos;t yet know which parts matter.
      </p>
      <p>
        Keep it simple (KISS) is usually credited to the aircraft engineer Kelly Johnson, and was in
        US Navy use by about 1960. In code it means: the simplest thing that meets today&apos;s
        need, written so tomorrow&apos;s change is easy.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SimpleCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Needed now, or YAGNI?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-simple"
            prompt="The café needs online table booking for its one branch. Build now, or wait?"
            categories={[
              { id: "now", label: "Build now" },
              { id: "yagni", label: "YAGNI" },
            ]}
            items={[
              {
                id: "book",
                label: "Book a table for a date and time",
                category: "now",
                why: "The actual request.",
              },
              {
                id: "multi",
                label: "Support 50 branches in 12 countries",
                category: "yagni",
                why: "One branch today. Add it when there's a second.",
              },
              {
                id: "tests",
                label: "Tests for the booking rules",
                category: "now",
                why: "Making code easy to change is never YAGNI.",
              },
              {
                id: "plugin",
                label: "A plugin system for future payment providers",
                category: "yagni",
                why: "No payments in the request.",
              },
              {
                id: "confirm",
                label: "A confirmation email to the customer",
                category: "now",
                why: "Part of a usable booking.",
              },
            ]}
            explanation="Build what today's need requires, plus the tests and structure that keep it easy to change. Leave imagined features for when they're real."
          />
        </div>
      }
    >
      <p>Sort each item.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Build for today", "You aren't gonna need it."],
        ["Flexibility is a bet", "Wrong bets cost twice."],
        ["Simple is not easy", "Untangled, not merely familiar."],
        ["Keep it easy to change", "Tests and refactoring are never YAGNI."],
        ["Grow from simple", "Working complex systems start as working simple ones."],
      ]}
    >
      <p>Next: duplication, and why merging look-alike code can go wrong.</p>
    </WrapStep>
  );
}
