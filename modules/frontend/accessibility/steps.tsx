"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ELEMENTS, FIXES, LAW } from "./model";
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
            ["Built for wheelchairs", "A ramp at the café door."],
            [
              "Used by everyone",
              "Parents with prams, delivery riders, someone with a suitcase, a person with a sprained ankle.",
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
        A ramp built for wheelchair users ends up helping almost everyone. Captions help people in
        noisy trains; keyboard shortcuts help power users; clear contrast helps anyone in bright
        sunlight.
      </p>
      <p>
        <Term id="web-accessibility">Accessibility</Term> means people can use your site however
        they browse: with a keyboard, a <Term id="screen-reader">screen reader</Term>, zoom, voice
        control or a switch. Most of it comes from good HTML.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Keyboard and screen reader ⭐ ---------------------------------------------------------------- */

export function Simulate() {
  const [s, set] = useSceneState<A11yState>();
  const order = ELEMENTS.filter((e) => e.focusable(s.fixed));
  const cur = s.focus >= 0 ? order[s.focus % order.length] : null;
  const tab = (d: 1 | -1) => {
    const n = (s.focus + d + order.length) % order.length;
    const el = order[n];
    set({ focus: n, heard: [el.says(s.fixed), ...s.heard].slice(0, 5) });
  };
  const activate = () => {
    if (!cur) return;
    const msg =
      cur.id === "add"
        ? s.fixed.includes("live")
          ? "Added to cart. 1 item."
          : "(silence: the cart changed, but nothing was announced)"
        : cur.id === "menu"
          ? "Menu, button, expanded"
          : `Activated ${cur.says(s.fixed).split(",")[0]}`;
    set({ heard: [msg, ...s.heard].slice(0, 5) });
  };
  const readAll = () =>
    set({
      heard: ELEMENTS.filter((e) => e.id !== "skip" || s.fixed.includes("skip"))
        .map((e) => e.says(s.fixed))
        .reverse()
        .slice(0, 7),
    });
  const toggle = (id: string) =>
    set({
      fixed: s.fixed.includes(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id],
      focus: -1,
    });
  const ring = (id: string) => cur?.id === id && (id !== "add" || s.fixed.includes("focus"));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Use the page with only a keyboard"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="border-line bg-surface relative flex flex-col gap-2 rounded-lg border p-3 text-xs">
              {s.fixed.includes("skip") && (
                <span
                  className={cn("self-start rounded px-1", ring("skip") && "ring-accent ring-2")}
                >
                  Skip to content
                </span>
              )}
              <div className="flex items-center gap-2">
                <span
                  className={cn("rounded px-1 font-semibold", ring("logo") && "ring-accent ring-2")}
                >
                  Chai Corner
                </span>
                <span
                  className={cn(
                    "border-line-strong flex-1 rounded border px-1.5 py-0.5 text-[10px]",
                    ring("search") && "ring-accent ring-2",
                  )}
                >
                  {s.fixed.includes("label") ? "Search the menu" : ""}
                </span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5",
                    s.fixed.includes("menu") ? "border-line-strong border" : "",
                    ring("menu") && "ring-accent ring-2",
                  )}
                >
                  Menu
                </span>
              </div>
              <div className="bg-viz-meta/30 flex h-16 items-center justify-center rounded text-[10px]">
                photo
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={s.fixed.includes("contrast") ? "text-fg" : "text-subtle opacity-60"}
                >
                  ₹40
                </span>
                <span
                  className={cn(
                    "border-line-strong rounded-full border px-2 py-0.5",
                    ring("add") && "ring-accent ring-2",
                  )}
                >
                  Add to cart
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => tab(-1)}
                className="border-line-strong rounded-full border px-3 py-1 font-mono text-[11px]"
              >
                Shift+Tab
              </button>
              <button
                type="button"
                onClick={() => tab(1)}
                className="border-line-strong rounded-full border px-3 py-1 font-mono text-[11px]"
              >
                Tab
              </button>
              <button
                type="button"
                onClick={activate}
                className="border-line-strong rounded-full border px-3 py-1 font-mono text-[11px]"
              >
                Enter
              </button>
              <button
                type="button"
                onClick={readAll}
                className="border-line-strong rounded-full border px-3 py-1 text-[11px]"
              >
                Read whole page
              </button>
            </div>
            <div className="border-line bg-surface-2 min-h-24 rounded-lg border p-2 font-mono text-[10.5px]">
              <p className="text-muted mb-1 font-sans text-[10px]">
                Screen reader says (newest first)
              </p>
              {s.heard.map((h, i) => (
                <p key={`${h}-${i}`} className={cn(i > 0 && "text-subtle")}>
                  {h}
                </p>
              ))}
            </div>
            {cur?.id === "add" && !s.fixed.includes("focus") && (
              <p className="text-bad text-[11px]">
                Focus is on Add to cart, but you can&apos;t see it: the outline was removed.
              </p>
            )}
          </div>
          <div className="grid content-start gap-1">
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
                  {f.label}
                  <span className="text-subtle block text-[10px]">WCAG {f.wcag}</span>
                </button>
              );
            })}
            {s.fixed.length === FIXES.length && (
              <p className="text-good text-xs">
                Everything reachable, named, visible and announced.
              </p>
            )}
          </div>
        </div>
      }
    >
      <p>
        Put the mouse away. Press Tab to move through the page, Enter to activate, and listen to
        what a screen reader would say. Notice what you can&apos;t reach, can&apos;t see and
        can&apos;t hear.
      </p>
      <p>
        Then switch on fixes one at a time and try again. Each maps to a WCAG success criterion.
      </p>
    </StepLayout>
  );
}

/* 3 ─ WCAG ----------------------------------------------------------------------------------------- */

export function Wcag() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="WCAG 2.2 in a nutshell"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-4">
            {[
              ["Perceivable", "Alt text, captions, contrast"],
              ["Operable", "Keyboard, enough time, no traps"],
              ["Understandable", "Clear labels, predictable"],
              ["Robust", "Works with assistive tech"],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-[10px]">{b}</p>
              </div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">New in WCAG 2.2 (2023)</p>
            <p className="text-muted">
              Targets at least 24 by 24 pixels; focus not hidden behind sticky bars; alternatives to
              dragging; sign-in without puzzles or memory tests; help in a consistent place;
              don&apos;t ask for the same information twice.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The Web Content Accessibility Guidelines are the shared standard. Level AA, the usual
        target, means meeting 55 success criteria in WCAG 2.2. It&apos;s also an ISO standard
        (ISO/IEC 40500:2025).
      </p>
      <p>
        WCAG 3 is still a working draft and expected to take a few more years; it won&apos;t make
        WCAG 2 obsolete. Automated checkers find only part of the problems; test with a keyboard and
        a real screen reader too.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Law and people ------------------------------------------------------------------------------- */

export function Law() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The law, and who uses what"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {LAW.map((l, i) => (
            <motion.div
              key={l.where}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{l.where}</span>
              <span className="text-muted"> · {l.what}</span>
            </motion.div>
          ))}
          <div className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Screen readers (WebAIM survey, September 2026)</p>
            <p className="text-muted">
              Desktop: JAWS 55%, NVDA 33%, VoiceOver 6.5%. Mobile: VoiceOver 72%, TalkBack 30%. Two
              thirds navigate long pages by headings first.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Accessibility is increasingly a legal duty, not just good practice. This is general
        information, not legal advice; check what applies to your organisation.
      </p>
      <p>
        Test with at least one desktop and one mobile screen reader. NVDA (Windows), VoiceOver
        (Apple) and TalkBack (Android) are free.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function A11yCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Tool or human?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-a11y"
            prompt="Can an automated checker reliably find each problem, or does it need a person?"
            categories={[
              { id: "auto", label: "Automated checker" },
              { id: "manual", label: "Needs a person" },
            ]}
            items={[
              {
                id: "alt",
                label: "An image with no alt attribute",
                category: "auto",
                why: "Missing attributes are easy to detect.",
              },
              {
                id: "contrast",
                label: "Text below 4.5:1 contrast",
                category: "auto",
                why: "Colours can be measured.",
              },
              {
                id: "trap",
                label: "Keyboard focus gets stuck inside a dialog",
                category: "manual",
                why: "Found by actually tabbing through.",
              },
              {
                id: "goodalt",
                label: "Alt text that's present but useless, like “image123”",
                category: "manual",
                why: "Only a person can judge meaning.",
              },
              {
                id: "order",
                label: "Focus jumps around in a confusing order",
                category: "manual",
                why: "Needs human judgement.",
              },
            ]}
            explanation="Automated tools catch missing attributes and measurable things. Meaning, order and keyboard behaviour need a person with a keyboard and a screen reader."
          />
        </div>
      }
    >
      <p>Sort each problem.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Native HTML first", "Buttons, labels, headings."],
        ["Everything by keyboard", "With visible focus."],
        ["Name everything", "Labels and alt text."],
        ["Announce changes", "Status messages."],
        ["Test with people and tools", "WCAG 2.2 AA as the target."],
      ]}
    >
      <p>Next: layouts that adapt to every screen.</p>
    </WrapStep>
  );
}
