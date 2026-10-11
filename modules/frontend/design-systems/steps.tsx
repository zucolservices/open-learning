"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { APPROACHES, TOKENS, VALUES, type Token } from "./model";
import type { DsState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Paint() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Fifty shades of brand purple"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Mixed by eye",
              "Every painter mixes the brand colour themselves. Each wall is slightly different, and repainting means finding every wall.",
            ],
            [
              "One named tin",
              "Everyone uses “Brand Purple”. Change the recipe once and every wall updates on the next coat.",
            ],
          ].map(([t, b], i) => (
            <div
              key={t}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i ? "border-good/50 bg-good/10" : "border-line bg-surface",
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
        If every painter mixes the brand colour by eye, the building ends up in fifty slightly
        different purples. A named tin keeps everyone the same.
      </p>
      <p>
        A <Term id="design-system">design system</Term> is that idea for a whole product: named{" "}
        <Term id="design-token">design tokens</Term> for colours, spacing and type, shared
        components, and guidelines for using them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tokenise ⭐ ---------------------------------------------------------------------------------- */

export function Tokenise() {
  const [s, set] = useSceneState<DsState>();
  const right = (id: string) => s.map[id] === VALUES.find((v) => v.id === id)!.answer;
  const done = VALUES.every((v) => right(v.id));
  const usedTokens = new Set(VALUES.filter((v) => right(v.id)).map((v) => v.answer)).size;
  const leftover = VALUES.filter((v) => !right(v.id)).length;
  const accentWired = VALUES.filter((v) => v.answer === "accent" && right(v.id)).length;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Turn one-off values into tokens"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid gap-1">
            {VALUES.map((v) => (
              <div
                key={v.id}
                className="border-line bg-surface flex flex-wrap items-center gap-2 rounded-lg border px-3 py-1 text-xs"
              >
                <span className="w-28 shrink-0 font-mono text-[11px]">{v.raw}</span>
                <span className="text-muted min-w-0 flex-1 text-[11px]">{v.where}</span>
                <div className="flex flex-wrap gap-1">
                  {TOKENS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={s.map[v.id] === t.id}
                      onClick={() => set({ map: { ...s.map, [v.id]: t.id as Token } })}
                      className={cn(
                        "rounded-full border px-1.5 py-0.5 font-mono text-[9.5px]",
                        s.map[v.id] === t.id
                          ? right(v.id)
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {t.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Values to maintain</p>
              <p className="font-mono font-semibold">
                {leftover + usedTokens}{" "}
                <span className="text-muted font-sans text-[10px]">(was {VALUES.length})</span>
              </p>
            </div>
            <label className="border-line bg-surface flex items-center gap-2 rounded-lg border px-2 py-1.5">
              <input
                type="checkbox"
                checked={s.rebrand}
                onChange={() => set({ rebrand: !s.rebrand })}
              />
              <span className="text-[11px]">Rebrand: change color-accent</span>
            </label>
          </div>
          {s.rebrand && (
            <p className={cn("text-xs", accentWired === 3 ? "text-good" : "text-muted")}>
              {accentWired === 3
                ? "One change updates the button, the link and the badge."
                : `Only ${accentWired} of 3 brand-purple places follow the token; the rest must be found and edited by hand.`}
            </p>
          )}
          {done && (
            <p className="text-good text-xs">Ten scattered values became five named tokens.</p>
          )}
        </div>
      }
    >
      <p>
        An audit of a café app found these values scattered through the code. Several are the same
        intention typed slightly differently. Map each to a token.
      </p>
      <p>Then try a rebrand and see how many places follow along.</p>
    </StepLayout>
  );
}

/* 3 ─ Tiers ---------------------------------------------------------------------------------------- */

export function Tiers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three tiers of tokens"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Primitive", "violet-700 = the actual colour value", "What colours exist"],
            [
              "Semantic",
              "color-accent → violet-700",
              "What a colour is for; swap these for dark mode or a new brand",
            ],
            ["Component", "button-background → color-accent", "Optional: what one component uses"],
          ].map(([t, eg, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              style={{ marginLeft: i * 14 }}
            >
              <p className="font-semibold">{t}</p>
              <p className="font-mono text-[10.5px]">{eg}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Since October 2025 there&apos;s a stable, shared file format for tokens from a W3C Community
        Group (version 2025.10), supported by tools like Figma, Penpot and Style Dictionary.
        Designers and developers can share one source of truth.
      </p>
      <p>
        On the web, tokens usually become CSS custom properties. Brad Frost&apos;s Atomic Design
        (2013) offers a way to think about the components built on them: atoms, molecules,
        organisms.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Approaches ----------------------------------------------------------------------------------- */

export function Approaches() {
  const [s, set] = useSceneState<DsState>();
  const a = APPROACHES.find((x) => x.id === s.approach)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="The same button, five ways to style it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {APPROACHES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.approach === x.id}
                onClick={() => set({ approach: x.id })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.approach === x.id ? "border-fg bg-surface-2" : "border-line-strong text-muted",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {a.code.join("\n")}
          </pre>
          <p className="text-muted text-xs">{a.note}</p>
        </div>
      }
    >
      <p>
        Tokens work with any styling approach. The industry has moved away from runtime CSS-in-JS,
        which conflicts with server components, towards plain CSS, utility classes or tools that
        compile styles ahead of time.
      </p>
      <p>
        Component libraries such as shadcn/ui (Base UI by default since July 2026), Radix, Base UI,
        MUI v9, Fluent 2, Carbon and Material 3 give you accessible building blocks to theme.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tier?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-design-systems"
            prompt="Which tier does each token belong to?"
            categories={[
              { id: "primitive", label: "Primitive" },
              { id: "semantic", label: "Semantic" },
              { id: "component", label: "Component" },
            ]}
            items={[
              {
                id: "violet",
                label: "violet-700",
                category: "primitive",
                why: "A raw colour in the palette.",
              },
              {
                id: "accent",
                label: "color-accent",
                category: "semantic",
                why: "Says what it's for.",
              },
              {
                id: "btn",
                label: "button-background",
                category: "component",
                why: "Belongs to one component.",
              },
              {
                id: "space",
                label: "space-4 = 16px",
                category: "primitive",
                why: "A raw step on the spacing scale.",
              },
              {
                id: "danger",
                label: "color-danger",
                category: "semantic",
                why: "A purpose, not a value.",
              },
            ]}
            explanation="Primitives list what exists; semantic tokens say what things are for, which is what themes swap; component tokens are optional fine-tuning."
          />
        </div>
      }
    >
      <p>Sort each token.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Name your decisions", "Tokens, not one-off values."],
        ["Semantic tokens for themes", "Swap them for dark mode or a rebrand."],
        ["Shared components", "Accessible by default."],
        ["Any CSS approach", "Prefer build-time over runtime styling."],
        ["A system, not a library", "Tokens, components, guidelines, ownership."],
      ]}
    >
      <p>Next: keeping the browser side of your app secure.</p>
    </WrapStep>
  );
}
