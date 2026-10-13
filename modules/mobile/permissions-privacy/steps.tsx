"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FEATURES } from "./model";
import type { PermState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Keys() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The house keys"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/5 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">At the front door</p>
            <p className="text-muted">
              A stranger asks for a full set of your house keys before saying why. You shut the
              door.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/50 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">On the day</p>
            <p className="text-muted">
              The plumber you called asks to be let into the kitchen to fix the leak. Of course.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Whether we agree depends on what is asked, by whom, and when. A narrow request that clearly
        serves what we&apos;re doing right now is easy to accept.
      </p>
      <p>
        Phones guard the camera, location, photos, contacts and notifications behind{" "}
        <Term id="runtime-permission">runtime permissions</Term>. Apps that ask for little, at the
        moment it&apos;s needed, get a yes. Better still, a system{" "}
        <Term id="system-picker">picker</Term> often needs no permission at all.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function Moments() {
  const [s, set] = useSceneState<PermState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Ask at the right moment"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {FEATURES.map((f) => {
            const pick = f.options.find((o) => o.id === s.picks[f.id]);
            return (
              <div key={f.id} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{f.title}</p>
                <p className="text-muted">{f.need}</p>
                <div className="mt-1.5 grid gap-1">
                  {f.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={pick?.id === o.id}
                      onClick={() => set({ picks: { ...s.picks, [f.id]: o.id } })}
                      className={cn(
                        "rounded-md border px-2 py-1 text-left text-[11px]",
                        pick?.id === o.id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:border-accent",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <motion.div
                    key={pick.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 grid gap-1.5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]"
                  >
                    <div className="border-line-strong bg-surface-2 rounded-lg border px-2 py-1.5 text-center text-[10px]">
                      {pick.dialog ?? <span className="text-subtle">No system prompt</span>}
                    </div>
                    <p
                      className={cn(
                        "rounded-lg border px-2 py-1.5",
                        pick.tone === "good"
                          ? "border-good/50 bg-good/10"
                          : pick.tone === "ok"
                            ? "border-viz-meta/50 bg-viz-meta/10"
                            : "border-bad/40 bg-bad/5",
                      )}
                    >
                      {pick.outcome}
                    </p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        The café app needs three sensitive things. For each one, choose how and when to ask, and see
        the prompt the customer gets and how they&apos;re likely to react.
      </p>
      <p>
        A refusal is sticky: after a &ldquo;no&rdquo;, apps usually can&apos;t show the system
        prompt again, and people must go to Settings. Every app also needs a short, honest reason
        string shown in the prompt.
      </p>
    </StepLayout>
  );
}

/* 3 ─ History -------------------------------------------------------------------------------------- */

export function History() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Permissions keep getting finer"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Android 6 (2015)",
              "Permissions asked while the app runs, instead of a list accepted at install. iOS has always asked at runtime.",
            ],
            [
              "iOS 14 (2020)",
              "Share only selected photos; share approximate instead of precise location.",
            ],
            [
              "Android 11 and 12",
              "“Only this time” for camera, mic and location; approximate location; unused apps lose permissions.",
            ],
            [
              "Android 13 and 14",
              "Notification permission; the photo picker; then sharing only selected photos.",
            ],
            ["Android 17 (2026)", "A contact picker; local network access becomes a permission."],
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
        The trend is steady: users can share less, for less time, and apps are pushed towards
        pickers that need no permission.
      </p>
      <p>
        Design for partial answers. An app should work with selected photos, approximate location,
        or no notifications, and offer a way to change the choice later.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Disclose ------------------------------------------------------------------------------------- */

export function Disclose() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Telling people what you collect"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "App Store privacy labels",
              "Required since December 2020: what data the app collects and whether it's linked to you.",
            ],
            [
              "Apple privacy manifests",
              "Since May 2024, apps and common SDKs declare why they use certain sensitive APIs.",
            ],
            [
              "Google Play Data safety",
              "Required since July 2022, with a privacy policy link even if you collect nothing.",
            ],
            [
              "Tracking needs consent",
              "App Tracking Transparency (iOS 14.5, April 2021): ask before tracking people across other companies' apps.",
            ],
            [
              "Play photo and contact policies",
              "Apps that only occasionally need photos must use the picker (enforced May 2025); a similar contacts rule follows from January 2027.",
            ],
            [
              "Rules vary by country",
              "Regulators have fined Apple over ATT's design, and Germany is requiring a redesigned prompt from 2026.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
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
        Both stores make you declare your data use, including what your third-party SDKs collect.
        Analytics and advertising libraries count; check what each one gathers.
      </p>
      <p>
        These store rules sit alongside privacy laws such as the GDPR and India&apos;s DPDP Act,
        which has its own track here.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function PermCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Does it need permission?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-permissions"
            prompt="Does each action need a runtime permission on a current phone?"
            categories={[
              { id: "none", label: "No permission needed" },
              { id: "needs", label: "Needs permission" },
            ]}
            items={[
              {
                id: "picker",
                label: "Choosing one photo with the system photo picker",
                category: "none",
                why: "The picker hands over only that photo.",
              },
              {
                id: "qr",
                label: "Scanning a table's QR code with the live camera",
                category: "needs",
                why: "The camera is protected.",
              },
              {
                id: "track",
                label: "Following the rider's position on a map using the customer's location",
                category: "needs",
                why: "Location is protected.",
              },
              {
                id: "notif",
                label: "Showing an order-ready notification",
                category: "needs",
                why: "iOS, and Android 13 and later.",
              },
              {
                id: "contact",
                label: "Choosing one friend with the system contact picker",
                category: "none",
                why: "Pickers share only the choice.",
              },
            ]}
            explanation="Pickers return only what the person chose, so they need no permission. Live camera, location and notifications do."
          />
        </div>
      }
    >
      <p>Sort each action.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Prefer pickers", "No permission, only what was chosen."],
        ["Ask in context", "When the feature is used, not at launch."],
        ["Ask for the minimum", "Approximate, while using, selected photos."],
        ["Handle no", "The app must still work."],
        ["Declare honestly", "Privacy labels, manifests, Data safety."],
      ]}
    >
      <p>Next: the camera, location and sensors themselves.</p>
    </WrapStep>
  );
}
