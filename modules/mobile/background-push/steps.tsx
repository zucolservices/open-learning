"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { APPROACHES, READY, REOPEN, simulate, type Approach } from "./model";
import type { BgState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Pager() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The buzzing pager"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Keep asking at the counter</p>
            <p className="text-muted">
              You can&apos;t sit down, you annoy the staff, and you&apos;re worn out.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Take a pager and sit down</p>
            <p className="text-muted">
              It buzzes the moment your food is ready. You relax until then.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Food courts hand you a pager so you don&apos;t have to keep asking &ldquo;is it ready
        yet?&rdquo;. The kitchen tells you when there&apos;s news.
      </p>
      <p>
        Phones work the same way. Apps that aren&apos;t on screen are mostly paused to save battery.
        Instead of checking constantly, they rely on{" "}
        <Term id="push-notification">push notifications</Term> sent by a server, and on{" "}
        <Term id="background-work">background work</Term> the system runs when it suits the battery.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

const pct = (m: number) => `${(m / 45) * 100}%`;

export function Ready() {
  const [s, set] = useSceneState<BgState>();
  const a = s.approach as Approach;
  const o = simulate(a, s.idle, s.allowed);
  const late = o.learned - READY;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Your order is ready"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <Segmented<Approach>
            size="sm"
            value={a}
            onChange={(v) => set({ approach: v })}
            options={APPROACHES}
          />
          <div className="border-line bg-surface rounded-lg border px-3 pt-8 pb-6">
            <div className="bg-surface-2 relative h-2 rounded-full">
              <span
                className="bg-viz-compute absolute -top-1 h-4 w-0.5"
                style={{ left: pct(READY) }}
              />
              <span
                className="text-viz-compute absolute -top-6 -translate-x-1/2 text-[10px] whitespace-nowrap"
                style={{ left: pct(READY) }}
              >
                Food ready 12:{READY}
              </span>
              {o.wakes.map((w) => (
                <motion.span
                  key={`${a}-${w}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-viz-meta absolute top-0 size-2 -translate-x-1/2 rounded-full"
                  style={{ left: pct(w) }}
                />
              ))}
              <motion.span
                layout
                className={cn(
                  "absolute top-3 -translate-x-1/2 rounded-full px-1.5 text-[10px] whitespace-nowrap",
                  late === 0 ? "bg-good text-accent-fg" : "bg-bad/20 text-bad",
                )}
                style={{ left: pct(o.learned) }}
              >
                Customer knows 12:{o.learned}
              </motion.span>
            </div>
            <div className="text-subtle mt-6 flex justify-between text-[10px]">
              <span>12:00 order placed, phone pocketed</span>
              <span>12:{REOPEN} would reopen the app</span>
            </div>
          </div>
          <p className="border-line bg-surface-2 rounded-lg border px-3 py-2">
            {late === 0 ? "On time. " : `${late} minutes late. `}
            {o.story}
          </p>
          <div className="grid gap-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={s.idle} onChange={() => set({ idle: !s.idle })} />
              The phone sits idle on the table
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.allowed}
                onChange={() => set({ allowed: !s.allowed })}
              />
              The customer allowed notifications
            </label>
          </div>
          <p className="text-subtle text-[10px]">
            Dots mark when the app gets to run. Times are illustrative.
          </p>
        </div>
      }
    >
      <p>
        A customer orders at 12:00 and puts the phone away. The food is ready at 12:22. Try each way
        the app could tell them, then leave the phone idle or refuse notifications.
      </p>
      <p>
        Only the server knows when the food is ready, so the fastest path is for the server to say
        so. The phone shouldn&apos;t be guessing.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Rules ---------------------------------------------------------------------------------------- */

export function Rules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the system allows"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Android</p>
            <ul className="text-muted mt-1 list-disc space-y-1 pl-4">
              <li>
                WorkManager runs deferrable work, surviving restarts; repeating work at most every
                15 minutes.
              </li>
              <li>
                Doze holds work while the phone is idle, releasing it in maintenance windows that
                grow further apart.
              </li>
              <li>
                Rarely used apps fall into stricter standby buckets: in the most restricted, jobs
                run once a day.
              </li>
              <li>
                Visible long work uses a foreground service with a declared type (Android 14), some
                capped at 6 hours a day (Android 15).
              </li>
            </ul>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">iOS</p>
            <ul className="text-muted mt-1 list-disc space-y-1 pl-4">
              <li>App refresh tasks get up to 30 seconds, when the system decides.</li>
              <li>
                Processing tasks get minutes, but only while the phone is idle, often overnight on
                charge.
              </li>
              <li>
                iOS 26 added continued processing: a task the user starts keeps running with a
                progress display they can cancel.
              </li>
              <li>Big uploads and downloads go to a background transfer the system completes.</li>
            </ul>
          </div>
        </div>
      }
    >
      <p>
        Both platforms trade freedom for battery life. You request work with conditions (on Wi-Fi,
        while charging), and the system batches it with other apps&apos; work.
      </p>
      <p>
        The result: background work is for things that can wait. Anything urgent comes from the
        server as a push.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Push ----------------------------------------------------------------------------------------- */

export function Push() {
  const hops = [
    "Café's server",
    "APNs (Apple) or FCM (Google)",
    "Phone's shared connection",
    "Notification",
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How a push travels"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {hops.map((h, i) => (
              <motion.span
                key={h}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="flex items-center gap-1.5"
              >
                <span className="border-line bg-surface rounded-lg border px-2.5 py-1.5">{h}</span>
                {i < hops.length - 1 && <span className="text-subtle">→</span>}
              </motion.span>
            ))}
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {[
              [
                "Ask first",
                "iOS always, and Android since 13, need the user's permission to show notifications. Ask when it's clearly useful.",
              ],
              [
                "Silent pushes are rationed",
                "Pushes that only wake the app are low priority; Apple suggests no more than two or three an hour.",
              ],
              [
                "Best effort",
                "Delivery isn't guaranteed. Apple keeps only the latest notification for an offline phone.",
              ],
              [
                "Live progress",
                "Live Activities (iOS 16.1) and Live Updates (Android 16) show a delivery or order in progress.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{b}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Each phone keeps one shared, battery-efficient connection to its platform&apos;s push
        service, so a hundred apps don&apos;t each hold a connection open.
      </p>
      <p>
        Google turned off Firebase&apos;s legacy sending APIs from July 2024; servers now use the
        HTTP v1 API with short-lived tokens. Cross-platform apps use these same two services
        underneath.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function BgCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the tool"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-background"
            prompt="Which tool suits each job?"
            categories={[
              { id: "work", label: "Scheduled background work" },
              { id: "push", label: "Push notification" },
              { id: "live", label: "Live Activity or Live Update" },
            ]}
            items={[
              {
                id: "photos",
                label: "Upload review photos when on Wi-Fi and charging",
                category: "work",
                why: "Can wait for good conditions.",
              },
              {
                id: "ready",
                label: "Tell the customer the order is ready",
                category: "push",
                why: "Urgent, and only the server knows.",
              },
              {
                id: "rider",
                label: "Show the delivery rider's progress on the lock screen",
                category: "live",
                why: "Ongoing, glanceable progress.",
              },
              {
                id: "menu",
                label: "Refresh the cached menu every few hours",
                category: "work",
                why: "Deferrable.",
              },
              {
                id: "chat",
                label: "A friend replies in the group order chat",
                category: "push",
                why: "A timely message from the server.",
              },
            ]}
            explanation="Deferrable work goes to the system's scheduler; timely news comes from the server as a push; ongoing progress belongs in a Live Activity or Live Update."
          />
        </div>
      }
    >
      <p>Sort each job.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Background apps are paused", "Timers don't keep running."],
        ["Schedule what can wait", "WorkManager, BGTaskScheduler."],
        ["Push what can't", "Through APNs and FCM."],
        ["Ask for permission", "And make notifications worth it."],
        ["Show live progress", "Live Activities and Live Updates."],
      ]}
    >
      <p>That ends the chapter on data. Next: permissions and privacy.</p>
    </WrapStep>
  );
}
