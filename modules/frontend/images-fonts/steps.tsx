"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BASE, FIXES } from "./model";
import type { ImgState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Poster() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Posting a billboard to a phone box"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "A billboard-sized print",
              "Mailed to someone who'll view it on a postcard-sized screen. Slow, expensive, folded.",
            ],
            [
              "The right size",
              "A postcard for a postcard, a poster for a wall. Same picture, a fraction of the weight.",
            ],
          ].map(([t, b], i) => (
            <div
              key={t}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
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
        Nobody posts a billboard print to someone who&apos;ll look at it on a phone. Yet pages often
        send phones the same huge photo a big desktop screen gets.
      </p>
      <p>
        Images are usually the heaviest part of a page (a median 911 KB on mobile in 2025), and an
        image is the largest element on about three quarters of mobile pages. Fonts are smaller but
        can hide text or make it jump.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix ⭐ --------------------------------------------------------------------------------------- */

export function FixPage() {
  const [s, set] = useSceneState<ImgState>();
  const v = { ...BASE };
  for (const f of FIXES)
    if (s.fixed.includes(f.id))
      for (const k of ["kb", "lcp", "cls", "invisible"] as const) v[k] += f[k] ?? 0;
  const toggle = (id: string) =>
    set({ fixed: s.fixed.includes(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  const groups = ["Hero image", "Thumbnails", "Web font"] as const;
  const stats: [string, string, boolean][] = [
    ["First-load bytes", `${(v.kb / 1000).toFixed(1)} MB`, v.kb < 1500],
    ["LCP", `${v.lcp.toFixed(1)} s`, v.lcp <= 2.5],
    ["CLS", v.cls.toFixed(2), v.cls <= 0.1],
    ["Invisible text", `${v.invisible.toFixed(1)} s`, v.invisible === 0],
  ];
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Lighten a product page"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stats.map(([l, val, ok]) => (
              <div
                key={l}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-xs",
                  ok ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[10px]">{l}</p>
                <motion.p
                  key={val}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-mono font-semibold"
                >
                  {val}
                </motion.p>
              </div>
            ))}
          </div>
          {groups.map((g) => (
            <div key={g} className="grid gap-1">
              <p className="text-muted text-[10px] font-medium">{g}</p>
              {FIXES.filter((f) => f.group === g).map((f) => {
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
                    {on ? f.fix : f.problem}
                  </button>
                );
              })}
            </div>
          ))}
          {s.fixed.length === FIXES.length && (
            <p className="text-good text-xs">
              About a quarter of the bytes, a fast hero, nothing jumping, text visible from the start.
            </p>
          )}
        </div>
      }
    >
      <p>
        A product page, viewed on a phone, has seven common image and font problems. Click each to
        fix it and watch bytes, loading speed, layout shift and invisible text. Numbers are
        illustrative.
      </p>
      <p>
        Two rules carry the most weight: <Term id="responsive-images">responsive images</Term> in a
        modern format, and never <Term id="lazy-loading">lazy-load</Term> the main image.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Formats -------------------------------------------------------------------------------------- */

export function Formats() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Formats and sizes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {
              '<img src="hero-800.avif"\n     srcset="hero-800.avif 800w, hero-1600.avif 1600w"\n     sizes="(min-width: 60rem) 50vw, 100vw"\n     width="1600" height="900"\n     fetchpriority="high"\n     alt="Masala chai in a clay cup">'
            }
          </pre>
          <div className="grid gap-1 text-xs">
            {[
              ["AVIF", "Safe to use widely since July 2026; often much smaller than JPEG."],
              ["WebP", "Supported everywhere since 2020; a good fallback."],
              [
                "srcset + sizes",
                "The browser picks the smallest file that looks sharp on this screen.",
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
        Even though AVIF works in every major browser, it was only about 1% of image requests in
        2024; most sites still serve JPEG and PNG. Image CDNs and framework image components can
        convert and resize for you.
      </p>
      <p>
        fetchpriority=&ldquo;high&rdquo; works in all major browsers since October 2024; only about
        one page in six uses it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Fonts ---------------------------------------------------------------------------------------- */

export function Fonts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fonts without the flash"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "font-display: swap",
              "Show fallback text at once, swap when the font arrives. Used on about half of mobile pages.",
            ],
            [
              "font-display: optional",
              "Use the font only if it arrives almost instantly; otherwise keep the fallback. Rare (about 0.5%), but no late swap.",
            ],
            [
              "size-adjust",
              "Scale the fallback to match the web font so the swap doesn't shift text. Chrome, Firefox and Safari; Safari lacks the related metric overrides.",
            ],
            [
              "Preload, with crossorigin",
              "Start downloading the key font early; font preloads need the crossorigin attribute.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-mono font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Most pages (88% on mobile) use web fonts. Without care they cause a flash of invisible text,
        or a jump when the real font replaces the fallback.
      </p>
      <p>
        Fewer font files help too: a single variable font can replace several weights. About 41% of
        mobile sites used one in 2025.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ImgCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which image shouldn't be lazy?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="frontend-images"
            prompt="A page has a large hero photo at the top, a row of product thumbnails further down and a footer logo. Which image should not use loading=“lazy”?"
            options={[
              {
                id: "hero",
                label: "The hero photo at the top",
                correct: true,
                feedback:
                  "Right: it's visible immediately and probably the LCP element. Load it eagerly, with high priority.",
              },
              {
                id: "thumbs",
                label: "The product thumbnails further down",
                feedback: "Those are below the fold: perfect candidates for lazy loading.",
              },
              {
                id: "logo",
                label: "The footer logo",
                feedback: "Far down the page; lazy loading is fine.",
              },
            ]}
            explanation="Lazy-load what's off screen. The image people see first should load as early as possible."
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
        ["Right size, right format", "srcset, AVIF or WebP."],
        ["Hero first", "Eager, high priority."],
        ["Lazy below the fold", "Thumbnails and footers."],
        ["Reserve space", "width and height on every image."],
        ["Fonts that don't hide text", "swap or optional, size-matched fallback."],
      ]}
    >
      <p>
        That ends the performance chapter. Next: building for everyone, starting with accessibility.
      </p>
    </WrapStep>
  );
}
