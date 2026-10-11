"use client";

import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { START, TABS, back, current, deepLink, nextScreen, open, switchTab } from "./model";
import type { NavState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Building() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Rooms and corridors"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Wings", "The museum has three wings. You can walk between them at any time.", "Tabs"],
            [
              "Rooms",
              "Inside a wing, each room leads deeper. You retrace your steps to get out.",
              "A stack",
            ],
            [
              "A side door",
              "A ticket can let you in straight to one room, deep inside.",
              "A deep link",
            ],
          ].map(([t, b, m], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="flex-1">
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </span>
              <span className="text-accent shrink-0 text-[10px] font-medium">{m}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In a museum, you can hop between wings, and inside each wing you go room by room and retrace
        your steps on the way out. Come in by a side door and you&apos;d still expect the way out to
        lead through the wing, not straight onto the street.
      </p>
      <p>
        Mobile apps work the same way: tabs for the wings, a{" "}
        <Term id="navigation-stack">navigation stack</Term> for the rooms, and{" "}
        <Term id="deep-link">deep links</Term> for the side doors.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build and connect ⭐ ------------------------------------------------------------------------- */

export function Stacks() {
  const [s, set] = useSceneState<NavState>();
  const f = { perTab: s.perTab, synth: s.synth };
  const n = s.nav;
  const c = current(n, f);
  const next = nextScreen(n, f);
  const go = (nav: typeof n) => set({ nav });
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Fix the back button"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            <div className="border-line-strong bg-surface flex min-h-56 flex-col rounded-2xl border p-2 text-xs">
              {n.closed ? (
                <div className="text-muted flex flex-1 flex-col items-center justify-center gap-2 text-center">
                  <p>You&apos;ve left the app.</p>
                  <button
                    type="button"
                    onClick={() => go({ ...START })}
                    className="border-line-strong rounded-full border px-3 py-1"
                  >
                    Open the app
                  </button>
                </div>
              ) : (
                <>
                  <p className="flex items-center gap-1 font-semibold">
                    <ChevronLeft className="text-subtle size-3.5" />
                    {c.screen}
                  </p>
                  <div className="flex flex-1 flex-col justify-center gap-1.5">
                    {next && (
                      <button
                        type="button"
                        onClick={() => go(open(n, f))}
                        className="border-line bg-surface-2 hover:border-accent rounded-lg border px-3 py-2 text-left"
                      >
                        Open {next} ›
                      </button>
                    )}
                  </div>
                  <div className="border-line grid grid-cols-3 gap-1 border-t pt-1.5">
                    {TABS.map(([t, label]) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={c.tab === t}
                        onClick={() => go(switchTab(n, f, t))}
                        className={cn(
                          "rounded-md py-1 text-[11px]",
                          c.tab === t ? "bg-accent text-accent-fg" : "text-muted",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-2 text-xs">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  disabled={n.closed}
                  onClick={() => go(back(n, f))}
                  className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
                >
                  ◀ Back
                </button>
                <button
                  type="button"
                  onClick={() => go(deepLink(f))}
                  className="border-viz-meta bg-viz-meta/10 rounded-full border px-3 py-1"
                >
                  ✉ Tap the email link
                </button>
                <button
                  type="button"
                  onClick={() => go({ ...START })}
                  className="text-muted rounded-full px-2 py-1"
                >
                  Reset
                </button>
              </div>
              <p className="border-line bg-surface-2 rounded-lg border px-3 py-2">{n.log}</p>
              <div className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-muted text-[10px]">
                  {s.perTab ? "Back stacks, one per tab" : "One shared history"}
                </p>
                {s.perTab ? (
                  TABS.map(([t, label]) => (
                    <p key={t} className="font-mono text-[10px]">
                      {label}: {n.stacks[t].join(" › ")}
                    </p>
                  ))
                ) : (
                  <p className="font-mono text-[10px]">
                    {n.history.map((e) => e.screen).join(" › ")}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                {[
                  ["perTab", "Each tab keeps its own stack"],
                  ["synth", "A deep link puts its parent screens underneath"],
                ].map(([k, label]) => (
                  <label key={k} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={s[k] as boolean}
                      onChange={() => set({ [k]: !s[k], nav: { ...START } })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <p>
        The café app has two navigation bugs. Open a dish, switch to Orders, then press Back: where
        do you land? Then tap the email link and press Back.
      </p>
      <p>
        Turn on each fix and try again. The expected behaviour: Back retraces steps within the
        current tab, and a deep-linked screen has its parent underneath it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Back on each platform ------------------------------------------------------------------------ */

export function BackButton() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Back on each platform"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Android</p>
            <ul className="text-muted mt-1 list-disc space-y-1 pl-4">
              <li>Back is a system gesture or button, available on every screen.</li>
              <li>
                <Term id="predictive-back">Predictive back</Term>: as you swipe, a preview shows
                where Back will take you.
              </li>
              <li>
                For apps targeting Android 16, it&apos;s on by default and the old onBackPressed()
                is never called. Apps register a back callback instead.
              </li>
            </ul>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">iOS</p>
            <ul className="text-muted mt-1 list-disc space-y-1 pl-4">
              <li>No system Back button: the navigation bar shows one at the top left.</li>
              <li>
                Swiping from the left edge goes back. Since iOS 26, a swipe anywhere in the content
                works too.
              </li>
              <li>
                Apple&apos;s guidelines: keep the visible Back button even when the swipe works.
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <p>
        Because Android&apos;s Back is shared by every app, people expect it to behave predictably,
        and the new preview animation only works if the app tells the system in advance what Back
        will do.
      </p>
      <p>
        The libraries handle much of this: <code>NavigationStack</code> in SwiftUI (iOS 16), the
        Navigation libraries for Compose (Navigation 3, stable since November 2025, lets you own the
        back stack as a plain list), and go_router or the Navigator in Flutter.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Links ---------------------------------------------------------------------------------------- */

export function Links() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Links into the app"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="font-semibold">Custom scheme</p>
            <p className="text-muted">
              An address like <span className="font-mono">cafe-app://order/482</span>. Easy, but any
              app can claim the same scheme, and nothing opens if the app isn&apos;t installed.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2">
            <p className="font-semibold">Verified web links</p>
            <p className="text-muted">
              An ordinary https address on your own website. The website publishes a small file
              naming your app; the app declares the website. When both agree, the phone opens the
              app. Otherwise, the website opens.
            </p>
            <p className="text-subtle mt-1 text-[10px]">
              iOS Universal Links (apple-app-site-association) · Android App Links (assetlinks.json)
            </p>
          </div>
        </div>
      }
    >
      <p>
        Verified links are why tapping a shop&apos;s link opens its app: iOS added Universal Links
        in iOS 9 and Android added App Links in Android 6. The file lives at a fixed
        &ldquo;.well-known&rdquo; path on the site, served over https.
      </p>
      <p>
        Hosted link services come and go: Firebase Dynamic Links shut down on 25 August 2025, and
        its links now fail. Links on your own domain, verified by the platform, keep working.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function NavCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of link?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-deep-links"
            prompt="Does each statement describe a custom scheme or a verified web link?"
            categories={[
              { id: "scheme", label: "Custom scheme" },
              { id: "verified", label: "Verified web link" },
            ]}
            items={[
              {
                id: "claim",
                label: "Another app could register the same address",
                category: "scheme",
                why: "Nothing checks who owns a scheme.",
              },
              {
                id: "fallback",
                label: "Opens the website when the app isn't installed",
                category: "verified",
                why: "It's an ordinary https address.",
              },
              {
                id: "file",
                label: "Needs a small file published on your website",
                category: "verified",
                why: "That's how the phone checks ownership.",
              },
              {
                id: "looks",
                label: "Looks like cafe-app://order/482",
                category: "scheme",
                why: "Not an https address.",
              },
              {
                id: "only",
                label: "Only your app can open it",
                category: "verified",
                why: "The site and app vouch for each other.",
              },
            ]}
            explanation="Custom schemes are unverified and only work when the app is installed. Verified links (Universal Links, App Links) are https addresses that your website and app both vouch for, with the website as a fallback."
          />
        </div>
      }
    >
      <p>Sort each statement.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Tabs for sections", "Each tab keeps its own stack."],
        ["Back retraces steps", "Within the tab you're in."],
        ["Deep links need parents", "Put the list under the detail."],
        ["Platforms differ", "Android system Back; iOS button and swipe."],
        ["Verify your links", "Universal Links and App Links on your domain."],
      ]}
    >
      <p>Next: designing for thumbs.</p>
    </WrapStep>
  );
}
