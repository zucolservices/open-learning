"use client";

import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { ADDONS, compositionParts, inheritanceClasses } from "./model";
import type { CompState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Lego() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A family tree or a box of parts?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A printed menu of every combination</p>
            <p className="text-muted">
              Coffee. Coffee with milk. Coffee with milk and sugar. Iced coffee with milk and sugar…
              A new syrup means reprinting dozens of lines.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“Choose a drink, then add extras”</p>
            <p className="text-muted">A new syrup is one more line under “extras”.</p>
          </motion.div>
        </div>
      }
    >
      <p>
        No café prints every possible combination of drink and extras. It lists drinks and extras
        separately, and you put them together.
      </p>
      <p>
        <Term id="inheritance">Inheritance</Term> builds new kinds of objects by extending a parent
        class, like a family tree. <Term id="composition">Composition</Term> builds objects from
        smaller parts, like the menu. When options multiply, the family tree explodes.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Add options ⭐ -------------------------------------------------------------------------------- */

export function AddOptions() {
  const [s, set] = useSceneState<CompState>();
  const classes = inheritanceClasses(s.addons);
  const parts = compositionParts(s.addons);
  return (
    <StepLayout
      eyebrow="Build"
      title="Add options and count the classes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              aria-label="Remove an add-on"
              disabled={s.addons <= 1}
              onClick={() => set({ addons: s.addons - 1 })}
              className="border-line-strong rounded-full border p-1 disabled:opacity-30"
            >
              <Minus className="size-3" />
            </button>
            <button
              type="button"
              disabled={s.addons >= ADDONS.length}
              onClick={() => set({ addons: s.addons + 1 })}
              className="bg-accent text-accent-fg flex items-center gap-1 rounded-full px-3 py-1 font-medium disabled:opacity-30"
            >
              <Plus className="size-3" /> Add {ADDONS[s.addons] ?? "…"}
            </button>
            <span className="text-muted">Add-ons: {ADDONS.slice(0, s.addons).join(", ")}</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-xs font-semibold">Inheritance: one class per combination</p>
              <p className={cn("font-mono text-2xl", classes.length > 16 && "text-bad")}>
                {classes.length}
              </p>
              <div className="mt-1 max-h-32 overflow-y-auto font-mono text-[10px]">
                {classes.slice(0, 12).map((c) => (
                  <p key={c} className="truncate">
                    class {c}
                  </p>
                ))}
                {classes.length > 12 && (
                  <p className="text-muted">…and {classes.length - 12} more</p>
                )}
              </div>
            </div>
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2">
              <p className="text-xs font-semibold">Composition: a drink made of parts</p>
              <p className="font-mono text-2xl">{parts.length}</p>
              <div className="mt-1 font-mono text-[10px]">
                {parts.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
          <Code
            numbers={false}
            title="Composition in use"
            lines={[
              'const order = new Drink(new CoffeeBase(), [new Milk("oat"), new Iced()]);',
              "order.price(); // base price + each extra's price",
            ]}
          />
        </div>
      }
    >
      <p>
        Start with coffee and tea and one add-on. Each time you add another option, inheritance
        needs a class for every combination; composition needs one new part.
      </p>
      <p>
        With six add-ons that&apos;s 128 classes against 9 parts. The exact numbers matter less than
        the shape: combinations multiply, parts add.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Fragile base class ---------------------------------------------------------------------------- */

export function Fragile() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The fragile base class"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Code
            title="A harmless-looking change to the parent…"
            lines={[
              "class Coffee {",
              "  price() { return this.base() + this.extras(); }",
              "- base() { return 120; }",
              '+ base() { return this.size === "L" ? 150 : 120; }',
              "}",
            ]}
            marks={{ 2: "bad", 3: "good" }}
          />
          <Code
            title="…breaks a subclass that assumed how base() worked"
            lines={[
              "class OfficeCoffee extends Coffee {",
              "  // bulk orders are always large, priced from base()",
              "  base() { return super.base() * 0.8; }   // now discounts 150, not 120",
              "}",
            ]}
            marks={{ 2: "bad" }}
          />
        </div>
      }
    >
      <p>
        A subclass depends on its parent&apos;s <em>internals</em>: which method calls which, and in
        what order. The Gang of Four&apos;s <em>Design Patterns</em> (1994) called inheritance
        &ldquo;white-box&rdquo; reuse for that reason, and advised: &ldquo;Favor object composition
        over class inheritance.&rdquo;
      </p>
      <p>
        Composition is &ldquo;black-box&rdquo;: parts only see each other&apos;s public interface,
        so one can change inside without surprising the other. Joshua Bloch&apos;s{" "}
        <em>Effective Java</em> gives the same advice.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When inheritance fits ------------------------------------------------------------------------- */

export function WhenFits() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When inheritance still fits"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "A true “is a”, designed for extension",
              "A framework's base class with documented hooks you're meant to override.",
            ],
            [
              "A small, stable hierarchy",
              "Shapes, or a sealed set of payment results, unlikely to grow sideways.",
            ],
            [
              "Languages without class inheritance",
              "Go and Rust skip it entirely: Go embeds structs (composition), Rust shares behaviour through traits.",
            ],
            [
              "Interfaces, not implementations",
              "Implementing an interface gives substitutability without inheriting internals.",
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
        &ldquo;Composition over inheritance&rdquo; is a default, not a ban. Inheritance is fine when
        the child really is a kind of the parent, will keep every promise the parent makes (the
        Liskov rule from the previous module), and the parent was designed to be extended.
      </p>
      <p>Newer languages show you can build large systems without class inheritance at all.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CompCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Inherit or compose?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-composition"
            prompt="Which fits each situation better?"
            categories={[
              { id: "compose", label: "Compose" },
              { id: "inherit", label: "Inheritance is fine" },
            ]}
            items={[
              {
                id: "extras",
                label: "Drinks with any mix of extras",
                category: "compose",
                why: "Combinations multiply; parts add.",
              },
              {
                id: "logger",
                label: "An order service that needs logging and retries",
                category: "compose",
                why: "Give it a logger and a retry helper.",
              },
              {
                id: "framework",
                label: "Overriding a framework base class's documented render hook",
                category: "inherit",
                why: "Designed for extension.",
              },
              {
                id: "reuse",
                label: "Inheriting from a class only to reuse one of its methods",
                category: "compose",
                why: "That's not an “is a”; call it instead.",
              },
              {
                id: "sealed",
                label: "A small, fixed set of shapes sharing an area() contract",
                category: "inherit",
                why: "Stable and genuinely “is a” (an interface works too).",
              },
            ]}
            explanation="Compose by default, especially when options combine. Inherit only for genuine, stable “is a” relationships designed for extension."
          />
        </div>
      }
    >
      <p>Sort each situation.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Combinations multiply", "Inheritance trees explode with options."],
        ["Parts add up", "Composition grows one piece at a time."],
        ["White box vs black box", "Subclasses see internals; parts see interfaces."],
        ["Inheritance for true “is a”", "Designed for extension, stable."],
        ["Prefer interfaces", "Substitutability without shared internals."],
      ]}
    >
      <p>Next: keeping business rules separate from databases, frameworks and vendors.</p>
    </WrapStep>
  );
}
