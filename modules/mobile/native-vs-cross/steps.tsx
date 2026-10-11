"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { APPROACHES, PROJECTS, type Approach } from "./model";
import type { ApprState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Houses() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Building, prefab, or a pop-up?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Two custom-built shops",
              "Perfect fit for each street, built by two crews. The most work.",
            ],
            [
              "One prefab design for both streets",
              "Built once, placed twice. Looks the same everywhere.",
            ],
            ["A pop-up stall", "Up today, anyone walking past can visit, but fewer fittings."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        A café opening on two streets can custom-build each shop, use one prefab design for both, or
        start with a pop-up stall. None is always best.
      </p>
      <p>
        Mobile teams choose the same way: <Term id="native-app">native</Term> apps for each
        platform, one <Term id="cross-platform">cross-platform</Term> codebase, or a{" "}
        <Term id="pwa">progressive web app</Term> that runs in the browser.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Choose ⭐ ------------------------------------------------------------------------------------ */

export function Choose() {
  const [s, set] = useSceneState<ApprState>();
  const done = PROJECTS.every((p) => s.picks[p.id] && p.good.includes(s.picks[p.id]));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Pick an approach for five projects"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PROJECTS.map((p) => {
            const pick = s.picks[p.id];
            const ok = pick && p.good.includes(pick);
            return (
              <div
                key={p.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <p>{p.text}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {APPROACHES.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={pick === a.id}
                      onClick={() => set({ picks: { ...s.picks, [p.id]: a.id as Approach } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        pick === a.id
                          ? p.good.includes(a.id)
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-0.5 text-[10px]", ok ? "text-good" : "text-muted")}>
                    {ok ? p.notes[pick] : p.fallback}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <p className="text-good text-xs">
              Five projects, four different answers: the right approach depends on the team, the
              features and how people find the app.
            </p>
          )}
        </div>
      }
    >
      <p>
        Five made-up projects with different teams and goals. Choose an approach for each. Some have
        more than one good answer.
      </p>
      <p>Think about who builds it, what features it needs, and how people will find it.</p>
    </StepLayout>
  );
}

/* 3 ─ Three approaches ----------------------------------------------------------------------------- */

export function Families() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How each approach draws the screen"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Native",
              "Swift and SwiftUI on iOS; Kotlin and Jetpack Compose on Android. Two codebases, full access to everything.",
            ],
            [
              "Own renderer",
              "Flutter (Dart, version 3.47) paints every pixel itself; Compose Multiplatform does too on iOS (stable since May 2025).",
            ],
            [
              "Real platform views",
              "React Native (0.87; New Architecture mandatory since late 2025) and .NET MAUI create genuine native controls.",
            ],
            [
              "Share logic only",
              "Kotlin Multiplatform can share networking and data code while each platform keeps native UI.",
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
        Cross-platform frameworks differ in how they draw: some paint their own interface, others
        drive the platform&apos;s real controls. That affects how &ldquo;native&rdquo; the app feels
        and how quickly it gets new OS features.
      </p>
      <p>
        Popularity shifts year to year. In Stack Overflow&apos;s 2024 survey (the last to ask),
        Flutter and React Native were each used by about 9% of developers.
      </p>
    </StepLayout>
  );
}

/* 4 ─ PWAs ----------------------------------------------------------------------------------------- */

export function Pwa() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Web apps on phones"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Installable",
              "A web app manifest lets people add the site to the Home Screen; it opens like an app.",
            ],
            [
              "Push on iPhone",
              "Since iOS 16.4 (March 2023), but only for web apps added to the Home Screen.",
            ],
            [
              "The EU wobble",
              "In early 2024 Apple briefly removed Home Screen web apps in the EU, then restored them on 1 March.",
            ],
            ["iOS 26", "Every site added to the Home Screen now opens as a web app by default."],
            [
              "Limits",
              "On iOS every browser uses Apple's WebKit engine outside the EU; some device features stay app-only.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
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
        A progressive web app is a website that can be installed, work offline and send
        notifications. No app store review, instant updates, and anyone can reach it with a link.
      </p>
      <p>
        Many products start as a web app and add native apps once they know people return often.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ApprCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which approach is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-approach"
            prompt="Match each description to its approach."
            categories={[
              { id: "flutter", label: "Flutter" },
              { id: "rn", label: "React Native" },
              { id: "kmp", label: "Kotlin Multiplatform" },
              { id: "native", label: "Native" },
            ]}
            items={[
              {
                id: "paint",
                label: "Paints every pixel with its own engine, written in Dart",
                category: "flutter",
                why: "Flutter draws its own widgets.",
              },
              {
                id: "js",
                label: "Written in JavaScript or TypeScript, rendering real platform views",
                category: "rn",
                why: "React Native.",
              },
              {
                id: "logic",
                label: "Shares business logic in Kotlin while each platform can keep native UI",
                category: "kmp",
                why: "KMP's core idea.",
              },
              {
                id: "swift",
                label: "Swift and SwiftUI on iOS, Kotlin and Compose on Android",
                category: "native",
                why: "Two native codebases.",
              },
              {
                id: "expo",
                label: "Often started with the Expo framework",
                category: "rn",
                why: "Expo is built on React Native.",
              },
            ]}
            explanation="Native: one codebase per platform. Flutter: one Dart codebase, its own renderer. React Native: JavaScript driving native views. KMP: share logic, choose your UI."
          />
        </div>
      }
    >
      <p>Sort each description.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Native", "Every feature, two codebases."],
        ["Cross-platform", "One codebase, different rendering styles."],
        ["Share logic only", "Kotlin Multiplatform."],
        ["Web apps", "No store, instant updates, fewer features."],
        ["Fit the team and the product", "Not the hype."],
      ]}
    >
      <p>Next: the app lifecycle, and surviving being closed.</p>
    </WrapStep>
  );
}
