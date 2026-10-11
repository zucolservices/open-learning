"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PARTS, WEBAIM } from "./model";
import type { SemState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Signs() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A building with no signs"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <p className="font-semibold">Unsigned</p>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-line-strong h-8 rounded border" />
              ))}
            </div>
            <p className="text-muted mt-2">Six identical doors. You open each to find the exit.</p>
          </div>
          <div className="border-good/50 bg-good/10 rounded-xl border p-3 text-xs">
            <p className="font-semibold">Signed</p>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {["Entry", "Lifts", "Café", "Toilets", "Help", "Exit"].map((t) => (
                <div
                  key={t}
                  className="border-line-strong flex h-8 items-center justify-center rounded border text-[10px]"
                >
                  {t}
                </div>
              ))}
            </div>
            <p className="text-muted mt-2">
              Anyone can find their way, even without seeing the layout.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Imagine a building where every door looks the same and has no sign. Sighted visitors cope by
        peeking; a blind visitor has to try every door.
      </p>
      <p>
        HTML elements are the signs. A page built only from div boxes can look fine, but browsers,
        search engines and screen readers can&apos;t tell a heading from a button. Using the right
        elements is called <Term id="semantic-html">semantic HTML</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the page ⭐ ------------------------------------------------------------------------------ */

export function FixPage() {
  const [s, set] = useSceneState<SemState>();
  const el = (id: string) => s.picks[id] ?? PARTS.find((p) => p.id === id)!.options[0];
  const right = PARTS.filter((p) => el(p.id) === p.answer).length;
  const landmarks = PARTS.map((p) => p.tree[el(p.id)].role).filter((r) =>
    ["banner", "navigation", "main", "contentinfo"].includes(r),
  );
  const tabbable = PARTS.filter((p) => p.tree[el(p.id)].focus).length + 3;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Give every box the right element"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[3fr_2fr]">
          <div className="grid gap-1.5">
            {PARTS.map((p) => {
              const cur = el(p.id);
              const ok = cur === p.answer;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    ok ? "border-good/50 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <p className="text-muted text-[10px]">{p.shows}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.options.map((o) => (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={cur === o}
                        onClick={() => set({ picks: { ...s.picks, [p.id]: o } })}
                        className={cn(
                          "rounded-full border px-2 py-0.5 font-mono text-[10px]",
                          cur === o
                            ? o === p.answer
                              ? "border-good bg-good/20"
                              : "border-fg bg-surface-2"
                            : "border-line text-muted",
                        )}
                      >
                        {`<${o}>`}
                      </button>
                    ))}
                  </div>
                  {ok && s.picks[p.id] && <p className="text-good mt-0.5 text-[10px]">{p.why}</p>}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            <div className="border-line bg-surface rounded-lg border p-2 font-mono text-[10.5px]">
              <p className="text-muted mb-1 font-sans text-[10px] font-medium">
                Accessibility tree
              </p>
              {PARTS.map((p) => {
                const n = p.tree[el(p.id)];
                return (
                  <p key={p.id} className={n.role.startsWith("generic") ? "text-subtle" : ""}>
                    {n.role}
                    {n.name ? ` "${n.name}"` : ""}
                  </p>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">Landmarks to jump to</p>
                <p className="font-mono font-semibold">{landmarks.length} of 4</p>
              </div>
              <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">Reachable with Tab</p>
                <p className="font-mono font-semibold">{tabbable}</p>
              </div>
            </div>
            <p className={cn("text-xs", right === PARTS.length ? "text-good" : "text-muted")}>
              {right === PARTS.length
                ? "Same look, but now the page explains itself to every visitor and tool."
                : `${right} of ${PARTS.length} parts use the right element.`}
            </p>
          </div>
        </div>
      }
    >
      <p>
        This café page is built entirely from div boxes. It looks fine, but its{" "}
        <Term id="accessibility-tree">accessibility tree</Term>, what a screen reader receives, is
        mostly &ldquo;generic&rdquo;.
      </p>
      <p>
        Choose an element for each part and watch the tree, landmarks and keyboard access change.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Headings and landmarks ----------------------------------------------------------------------- */

export function Headings() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Headings and landmarks: the rules"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Don't skip levels",
              "After an h2 comes another h2 or an h3, not an h4. The HTML spec makes skipping non-conforming.",
            ],
            [
              "One h1 is good practice",
              "The spec doesn't forbid several, but a single h1 naming the page helps people orient.",
            ],
            [
              "Landmarks need context",
              "header and footer are page landmarks only directly inside body; section and form only when they have a name.",
            ],
            [
              "Use div for styling",
              "section is for real sections with a heading, not just wrappers.",
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
        Screen-reader users often skim a page by its headings and{" "}
        <Term id="landmark">landmarks</Term>, just as sighted people skim by glancing. In 2022 the
        HTML spec dropped an old &ldquo;outline&rdquo; idea no browser ever implemented; heading
        levels are what count.
      </p>
      <p>
        A 2025 change to watch: browsers stopped automatically shrinking an h1 placed inside a
        section, so set heading sizes yourself.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How common ----------------------------------------------------------------------------------- */

export function Common() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How common are these mistakes?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {WEBAIM.map(([t, v], i) => (
            <div key={t} className="text-xs">
              <div className="flex justify-between">
                <span>{t}</span>
                <span className="font-mono">{v}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${v}%` }}
                transition={{ delay: 0.06 * i }}
                className="bg-viz-data/60 mt-0.5 h-2 rounded"
              />
            </div>
          ))}
          <p className="text-subtle mt-1 text-[10px]">
            Share of the top million home pages with each detected failure. WebAIM Million, 2026.
          </p>
        </div>
      }
    >
      <p>
        Each year WebAIM scans a million popular home pages. In 2026, 95.9% had detectable
        accessibility failures, up from 94.8% the year before, with 56 errors per page on average.
      </p>
      <p>
        Most are easy fixes: alt text, labels, real buttons, a page language. Pages that leaned
        heavily on ARIA attributes had more errors, not fewer, which is why the first rule of ARIA
        is to use native HTML first.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SemCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The clickable box"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="frontend-semantic"
            prompt="A page has a div with a click handler labelled “Add to cart”. Keyboard users can't use it. What's the best fix?"
            options={[
              {
                id: "role",
                label: 'Add role="button", tabindex="0" and key handlers to the div',
                feedback:
                  "That can work, but you're rebuilding what the browser gives you for free, and it's easy to miss a detail.",
              },
              {
                id: "button",
                label: "Replace it with a <button>",
                correct: true,
                feedback: "Right: focus, Enter and Space, and the button role all come built in.",
              },
              {
                id: "aria",
                label: 'Add aria-label="Add to cart"',
                feedback:
                  "That names it, but it still can't be reached or pressed with a keyboard.",
              },
            ]}
            explanation="Use the native element first. A real button is focusable, keyboard-operable and announced correctly with no extra code."
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
        ["Elements are signs", "They tell tools what each part is."],
        ["Native first", "Buttons, links and inputs come with keyboard support."],
        ["Headings in order", "No skipped levels."],
        ["Landmarks for jumping", "header, nav, main, footer."],
        ["Describe images", "Meaningful alt, or empty for decoration."],
      ]}
    >
      <p>Next: arranging those elements on screen with CSS layout.</p>
    </WrapStep>
  );
}
