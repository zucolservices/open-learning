"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, announcements, type Fix } from "./model";
import type { A11yState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Ramp() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The ramp everyone uses"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Built for wheelchairs", "The café adds a ramp beside the steps."],
            [
              "Used by everyone",
              "Parents with prams, couriers with trolleys, someone with a sprained ankle.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
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
        A ramp built for wheelchair users ends up helping almost everyone. Accessible apps are the
        same: larger text helps tired eyes in bright sun, captions help on a noisy bus.
      </p>
      <p>
        Phones have powerful built-in tools: <Term id="screen-reader">screen readers</Term>{" "}
        (VoiceOver on iOS, TalkBack on Android), <Term id="dynamic-type">adjustable text size</Term>
        , voice and switch control. They work only if the app tells them what&apos;s on screen.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Listen() {
  const [s, set] = useSceneState<A11yState>();
  const f = new Set(s.fixes as Fix[]);
  const said = announcements(f);
  const focus = Math.min(s.focus, said.length - 1);
  const big = s.scale > 130;
  const toggle = (k: Fix) =>
    set({ fixes: f.has(k) ? s.fixes.filter((x) => x !== k) : [...s.fixes, k], focus: 0 });
  const fs = (px: number) => ({ fontSize: `${(px * s.scale) / 100}px` });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Listen to the dish screen"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-line-strong bg-surface flex flex-col gap-1.5 rounded-2xl border p-2">
              <div className="bg-viz-data/20 h-10 rounded-md" aria-hidden />
              <div
                className={cn(
                  "flex gap-2",
                  f.has("grow") && big ? "flex-col" : "h-7 items-center overflow-hidden",
                )}
              >
                <span
                  className={cn("min-w-0 flex-1 font-semibold", !f.has("grow") && "truncate")}
                  style={fs(13)}
                >
                  Masala dosa
                </span>
                <span style={fs(12)}>₹120</span>
                <Heart className="size-4 shrink-0" />
              </div>
              <div
                className={cn(
                  "bg-accent text-accent-fg rounded-full px-3 text-center",
                  f.has("grow") ? "py-1.5" : "h-7 overflow-hidden py-1.5",
                )}
                style={fs(12)}
              >
                Add to order
              </div>
              <p className="text-muted" style={fs(11)}>
                Order total ₹120
              </p>
            </div>
            <div className="border-line bg-surface-2 flex flex-col gap-1 rounded-lg border p-2">
              <p className="text-muted text-[10px]">The screen reader says, swipe by swipe:</p>
              {said.map((a, i) => (
                <button
                  key={`${a}-${i}`}
                  type="button"
                  onClick={() => set({ focus: i })}
                  className={cn(
                    "rounded-md border px-2 py-1 text-left font-mono text-[10px]",
                    i === focus ? "border-accent bg-accent-soft" : "border-transparent",
                    /Button$|\.png|^₹120$|^Add to order$/.test(a) && i <= focus ? "text-bad" : "",
                  )}
                >
                  {i + 1}. &ldquo;{a}&rdquo;
                </button>
              ))}
              <button
                type="button"
                onClick={() => set({ focus: (focus + 1) % said.length })}
                className="border-line-strong mt-1 self-start rounded-full border px-3 py-0.5"
              >
                Swipe to next
              </button>
            </div>
          </div>
          <label className="flex flex-col gap-1">
            <span>Text size: {s.scale}%</span>
            <input
              type="range"
              min={100}
              max={200}
              step={10}
              value={s.scale}
              onChange={(e) => set({ scale: Number(e.target.value) })}
            />
          </label>
          <div className="grid gap-1 sm:grid-cols-2">
            {FIXES.map(([k, t, b]) => (
              <label
                key={k}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-2.5 py-1.5",
                  f.has(k) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={f.has(k)}
                  onChange={() => toggle(k)}
                  className="mt-0.5"
                />
                <span>
                  <span className="font-semibold">{t}</span>
                  <span className="text-muted block text-[11px]">{b}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Step through the screen as a VoiceOver or TalkBack user would: each swipe moves to the next
        item and reads it aloud. Then push the text size towards 200%, the largest Android 14
        offers.
      </p>
      <p>
        Apply the fixes. In SwiftUI and Compose each is a line or two: an accessibility label, a
        button role, hiding an element, or a layout that doesn&apos;t fix heights.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Settings ------------------------------------------------------------------------------------- */

export function Settings() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Settings people rely on"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Screen readers",
              "In WebAIM's 2026 survey, 72% of respondents used VoiceOver on mobile and 30% TalkBack (a self-selected sample, not market share).",
            ],
            [
              "Text size",
              "iOS Dynamic Type has 12 sizes, five of them extra-large accessibility sizes. Android scales up to 200%, growing large text less than small.",
            ],
            [
              "Motion and colour",
              "Reduce Motion, Bold Text, higher contrast, dark mode, and not relying on colour alone.",
            ],
            [
              "Other ways to control",
              "Voice Control, Switch Control and external keyboards all follow the same labels and order.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Use the platform&apos;s text styles (iOS) and sp units (Android) so text follows the
        user&apos;s setting, and let layouts switch to stacking when text gets very large.
      </p>
      <p>
        Many people change these settings without thinking of themselves as disabled. Test the app
        with them on.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Rules ---------------------------------------------------------------------------------------- */

export function Rules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Laws, labels and testing"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "European Accessibility Act",
              "Since 28 June 2025, apps that deliver services such as shopping, banking and transport to EU consumers must be accessible. Very small businesses are exempt.",
            ],
            [
              "The usual yardstick",
              "WCAG at level AA, via the European standard EN 301 549. WCAG 2.2 is current, and became an ISO standard in 2025.",
            ],
            [
              "App Store accessibility labels",
              "Since iOS 26, apps can declare which features (VoiceOver, larger text, reduced motion…) work for all common tasks. Voluntary for now.",
            ],
            [
              "Testing tools",
              "Xcode's Accessibility Inspector, Android's Accessibility Scanner, automated UI checks, and real use with a screen reader.",
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
        Many other countries have their own accessibility rules for digital services, often based on
        WCAG too.
      </p>
      <p>
        Automated tools catch missing labels and small targets; only a person using the app with a
        screen reader finds a confusing order or an unclear label.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function A11yCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Hide, label or role?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-a11y"
            prompt="What does each element need for screen reader users?"
            categories={[
              { id: "hide", label: "Hide it" },
              { id: "label", label: "Add a label" },
              { id: "role", label: "Add a button role" },
            ]}
            items={[
              {
                id: "swirl",
                label: "A decorative swirl between sections",
                category: "hide",
                why: "Pure decoration.",
              },
              {
                id: "search",
                label: "A magnifying-glass button with no text",
                category: "label",
                why: "Say what it does: “Search menu”.",
              },
              {
                id: "card",
                label: "A tappable dish card built from plain boxes",
                category: "role",
                why: "Announce that it can be activated.",
              },
              {
                id: "bg",
                label: "A blurred café photo behind the header",
                category: "hide",
                why: "Background decoration.",
              },
              {
                id: "share",
                label: "A share icon button",
                category: "label",
                why: "Icon-only buttons need words.",
              },
            ]}
            explanation="Hide decoration, give icon-only controls a spoken label, and give custom tappable things a button role, so the screen reader says what each thing is and does."
          />
        </div>
      }
    >
      <p>Sort each element.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Everything has a name", "Label icon-only controls."],
        ["Say what it is", "Roles such as button and heading."],
        ["Read in visual order", "And hide decoration."],
        ["Let text grow", "Text styles, sp, no fixed heights."],
        ["Test with it on", "VoiceOver, TalkBack, large text."],
      ]}
    >
      <p>That ends the chapter on the device. Next: performance.</p>
    </WrapStep>
  );
}
