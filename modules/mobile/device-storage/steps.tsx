"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DATA, STORES, feedback, type Store } from "./model";
import type { StoreState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A place for everything"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            ["Notice board", "Today's opening hours"],
            ["Filing cabinet", "Every recipe, sorted and indexed"],
            ["Store room", "Big things that belong to the café"],
            ["Bin by the door", "Anything you can easily get again"],
            ["Locked safe", "The till keys"],
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
        A café doesn&apos;t keep its till keys on the notice board, or its recipes in the bin. Each
        thing goes where it fits: easy to find, safe enough, and not in the way.
      </p>
      <p>
        A phone offers apps the same choice: small settings, a local database, files, a cache that
        may be cleared, and a <Term id="secure-storage">secure store</Term> for secrets.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function Choose() {
  const [s, set] = useSceneState<StoreState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Where does it go?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {DATA.map((d) => {
            const pick = s.picks[d.id] as Store | undefined;
            return (
              <div
                key={d.id}
                className={cn(
                  "rounded-lg border px-3 py-1.5",
                  !pick
                    ? "border-line bg-surface"
                    : pick === d.answer
                      ? "border-good/50 bg-good/10"
                      : "border-viz-meta/50 bg-viz-meta/10",
                )}
              >
                <p className="font-semibold">{d.label}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {STORES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      aria-pressed={pick === st.id}
                      onClick={() => set({ picks: { ...s.picks, [d.id]: st.id } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[11px]",
                        pick === st.id
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-line-strong text-muted",
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
                {pick && <p className="text-muted mt-1">{feedback(d, pick)}</p>}
              </div>
            );
          })}
          <div className="border-line bg-surface-2 grid gap-x-3 gap-y-0.5 rounded-lg border px-3 py-2 text-[10px] sm:grid-cols-2">
            {STORES.map((st) => (
              <p key={st.id}>
                <span className="font-semibold">{st.label}:</span>
                <span className="text-muted">
                  {" "}
                  {st.ios} · {st.android}
                </span>
              </p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The café app has five kinds of data. Choose where each should live. You can change your mind
        and try other places to see why they fit worse.
      </p>
      <p>
        The names differ by platform (listed below the choices), but the five kinds of place are the
        same everywhere, including in Flutter and React Native packages.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Protect -------------------------------------------------------------------------------------- */

export function Protect() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keeping secrets secret"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "iOS Keychain",
              "An encrypted database for small secrets. By default an item can be read only while the phone is unlocked.",
            ],
            [
              "iOS file protection",
              "Files are encrypted too. By default they're readable once the user has unlocked the phone after starting it.",
            ],
            [
              "Android Keystore",
              "Keys that can't be copied out of the device, often held in secure hardware, optionally needing a fingerprint to use.",
            ],
            [
              "A 2025 change",
              "Jetpack's EncryptedSharedPreferences was deprecated in 2025 with no further releases. Use Keystore keys directly, or DataStore with Tink encryption.",
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
        Apple says it plainly: UserDefaults is stored unencrypted, so personal or sensitive
        information belongs in the Keychain. The same holds for Android&apos;s settings storage.
      </p>
      <p>
        On Android the pattern is: keep an encryption key in the Keystore and use it to encrypt the
        secret, which can then live in an ordinary file.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Backups -------------------------------------------------------------------------------------- */

export function Backups() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Backups and new phones"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">iCloud Backup</p>
            <p className="text-muted">
              Backs up app data except temporary files and the Caches folder. Mark other
              re-downloadable files as excluded.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Android Auto Backup</p>
            <p className="text-muted">
              Up to 25 MB per app to the user&apos;s Google Drive, encrypted end to end on Android
              9+ with a screen lock. Skips cache and no-backup folders.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs sm:col-span-2">
            <p className="font-semibold">Should a secret move to a new phone?</p>
            <p className="text-muted">
              Often not. Keychain items can be marked &ldquo;this device only&rdquo;, and Android
              Keystore keys never leave the device. After a restore, the user simply signs in again.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Storage choices decide what survives a lost phone. Things the user made should come back;
        caches shouldn&apos;t waste their backup space.
      </p>
      <p>
        Android 12 and later let apps set separate rules for cloud backups and for direct
        phone-to-phone transfers.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function StoreCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The token in the settings file"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="mobile-storage"
            prompt="A developer keeps the sign-in token in the app's settings storage, saying other apps can't read it anyway. What's the problem?"
            options={[
              {
                id: "plain",
                label:
                  "It's stored unencrypted and can end up in backups or be read from a compromised device",
                correct: true,
                feedback: "Right. Being private to the app isn't the same as being encrypted.",
              },
              {
                id: "size",
                label: "Settings storage can't hold strings that long",
                feedback: "It can; size isn't the issue.",
              },
              {
                id: "speed",
                label: "Reading it is too slow at start-up",
                feedback: "It's fast. The issue is protection.",
              },
              {
                id: "nothing",
                label: "Nothing: app sandboxes make it safe",
                feedback: "The sandbox stops other apps, not backups or a compromised phone.",
              },
            ]}
            explanation="Settings storage is unencrypted. Put secrets in the Keychain, or encrypt them with an Android Keystore key, and consider keeping them off backups."
          />
        </div>
      }
    >
      <p>Pick the real problem.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Settings for small values", "UserDefaults, DataStore."],
        ["A database for records", "SwiftData, Core Data, Room."],
        ["Files for user creations", "Backed up; caches aren't."],
        ["Secrets in the secure store", "Keychain, Keystore keys."],
        ["Plan for backups", "What should come back, and what shouldn't."],
      ]}
    >
      <p>Next: doing work when the app isn&apos;t on screen.</p>
    </WrapStep>
  );
}
