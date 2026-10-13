"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACCURACY, drain, jitter, verdict, type Accuracy, type Interval } from "./model";
import type { FeatState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Lighthouse() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Asking for directions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["“Which city are you in?”", "Enough to show the weather."],
            ["“Which street?”", "Enough to find the nearest café."],
            ["“Which door?”", "Needed only as the rider arrives."],
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
        If a friend asks where you are, the right answer depends on why. &ldquo;In Pune&rdquo; is
        enough to talk about the weather; &ldquo;at the blue gate&rdquo; is what a delivery rider
        needs, and only at the very end.
      </p>
      <p>
        Location, camera and sensors are a phone&apos;s superpowers, and each costs battery and
        privacy. Ask the system for the least <Term id="location-accuracy">accuracy</Term> and the
        fewest updates that do the job.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

const W = 300;
const H = 120;
const route = (t: number) => ({ x: 20 + t * (W - 40), y: H / 2 + Math.sin(t * Math.PI * 2) * 30 });

export function Tracking() {
  const [s, set] = useSceneState<FeatState>();
  const c = {
    acc: s.acc as Accuracy,
    every: s.every as Interval,
    batch: s.batch,
    adaptive: s.adaptive,
  };
  const t = s.progress / 100;
  const nearEnd = t > 0.85;
  const metres = c.adaptive ? (nearEnd ? 10 : 100) : ACCURACY[c.acc].metres;
  const radius = Math.min(80, metres <= 10 ? 2 : metres <= 100 ? 9 : 80);
  const step = c.every === "1" ? 0.02 : c.every === "10" ? 0.05 : 0.15;
  const dots: { x: number; y: number }[] = [];
  for (let i = 0, p = 0; p <= t + 1e-9; i++, p = i * step) {
    const pos = route(p);
    const r = c.adaptive ? (p > 0.85 ? 2 : 9) : radius;
    const j = jitter(i + 1, r);
    dots.push({ x: pos.x + j.dx, y: pos.y + j.dy });
  }
  const last = dots.at(-1)!;
  const v = verdict(c);
  const d = drain(c);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Track the delivery"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="flex flex-wrap gap-2">
            <Segmented<Accuracy>
              size="sm"
              value={c.acc}
              onChange={(x) => set({ acc: x, adaptive: false })}
              options={(Object.keys(ACCURACY) as Accuracy[]).map((k) => [k, ACCURACY[k].label])}
            />
            <Segmented<Interval>
              size="sm"
              value={c.every}
              onChange={(x) => set({ every: x })}
              options={[
                ["1", "1 s"],
                ["10", "10 s"],
                ["60", "60 s"],
              ]}
            />
          </div>
          <div className="border-line bg-surface overflow-hidden rounded-lg border">
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
              <path
                d={Array.from({ length: 41 }, (_, i) => route(i / 40))
                  .map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`)
                  .join(" ")}
                className="stroke-line-strong"
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
              />
              <circle cx={route(0).x} cy={route(0).y} r={5} className="fill-viz-compute" />
              <circle cx={route(1).x} cy={route(1).y} r={5} className="fill-good" />
              {dots.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={1.8} className="fill-viz-meta" opacity={0.5} />
              ))}
              <circle
                cx={last.x}
                cy={last.y}
                r={radius}
                className="fill-viz-meta/15 stroke-viz-meta"
                strokeWidth={0.8}
              />
              <circle cx={route(t).x} cy={route(t).y} r={3.5} className="fill-fg" />
            </svg>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-muted">
              Rider&apos;s journey: {s.progress}% (black dot: where the rider really is; purple:
              what the app reports)
            </span>
            <input
              type="range"
              min={5}
              max={100}
              value={s.progress}
              onChange={(e) => set({ progress: Number(e.target.value) })}
            />
          </label>
          <div className="grid gap-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={s.batch} onChange={() => set({ batch: !s.batch })} />
              Batch updates (deliver several fixes together)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.adaptive}
                onChange={() => set({ adaptive: !s.adaptive })}
              />
              Balanced on the road, precise in the last 500 m
            </label>
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-2",
              v.useful ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
            )}
          >
            <p>{v.text}</p>
            <p className="text-muted mt-1 flex items-center gap-2">
              Battery drain
              <span className="bg-surface-2 h-1.5 w-24 rounded-full">
                <motion.span
                  animate={{ width: `${(d / 30) * 100}%` }}
                  className={cn(
                    "block h-1.5 rounded-full",
                    d > 12 ? "bg-bad" : d > 5 ? "bg-viz-meta" : "bg-good",
                  )}
                />
              </span>
              <span className="text-subtle text-[10px]">relative, illustrative</span>
            </p>
          </div>
        </div>
      }
    >
      <p>
        The rider&apos;s phone shares its position so the customer can watch the delivery. Choose
        how precise each fix is and how often it&apos;s taken, then drag the journey.
      </p>
      <p>
        Precise fixes mostly use GPS, the hungriest radio; balanced ones use nearby Wi-Fi and mobile
        masts to about 100 m. Look for a setting that&apos;s useful and kind to the battery.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Camera --------------------------------------------------------------------------------------- */

export function Camera() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Camera and photos"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Just need a photo?",
              "Use the system camera screen or photo picker. Little code, and often no permission.",
            ],
            [
              "Building a camera feature?",
              "CameraX on Android or AVFoundation on iOS give a live preview, scanning and full control.",
            ],
            [
              "People can see it",
              "A green dot (camera) or orange dot (mic) shows when they're in use, on iOS 14+ and Android 12+.",
            ],
            [
              "People can block it",
              "Android 12 added quick switches that turn off the camera or mic for every app.",
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
        For a review photo, the system camera screen is enough. A QR scanner at the table needs a
        live camera feed, so it uses CameraX or AVFoundation and asks for camera permission when the
        customer taps Scan.
      </p>
      <p>Handle a blocked camera gracefully: offer to type the table number instead.</p>
    </StepLayout>
  );
}

/* 4 ─ Sensors -------------------------------------------------------------------------------------- */

export function Sensors() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Sensors and the background"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Motion sensors",
              "Accelerometer and gyroscope readings are capped at 200 per second for apps targeting Android 12, unless they declare a need for more.",
            ],
            [
              "Not in the background",
              "Since Android 9, background apps get no continuous sensor readings.",
            ],
            [
              "Background location, Android",
              "A separate “Allow all the time” permission (Android 10), granted in Settings rather than the prompt (Android 11), and reviewed by Google Play.",
            ],
            [
              "Background location, iOS",
              "“Always” can be requested once, after “While using”; iOS later reminds users with a map of where the app tracked them.",
            ],
            [
              "Android 17",
              "A location button gives one-time precise location without a standing permission, and a status-bar icon shows location use.",
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
        For things like &ldquo;tell me when I&apos;m near the café&rdquo;, use{" "}
        <Term id="geofence">geofences</Term> or iOS&apos;s significant-change and visit monitoring:
        the system watches cheaply and wakes the app only when it matters.
      </p>
      <p>
        A rider app that tracks a whole delivery runs a foreground service with a visible
        notification, so the rider always knows.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function FeatCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How precise?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-location"
            prompt="What's the least location accuracy each feature needs?"
            categories={[
              { id: "city", label: "City level" },
              { id: "block", label: "About a street" },
              { id: "precise", label: "Precise" },
            ]}
            items={[
              {
                id: "weather",
                label: "Show today's weather on the home screen",
                category: "city",
                why: "Weather doesn't change by street.",
              },
              {
                id: "nearest",
                label: "List the three nearest cafés",
                category: "block",
                why: "100 m is plenty.",
              },
              {
                id: "gate",
                label: "Guide the rider to the right gate",
                category: "precise",
                why: "Metres matter at the end.",
              },
              {
                id: "currency",
                label: "Show prices in the local currency",
                category: "city",
                why: "Country is enough.",
              },
              {
                id: "pickup",
                label: "Suggest a branch for pickup on the way home",
                category: "block",
                why: "Rough position will do.",
              },
            ]}
            explanation="Match accuracy to the feature: city level costs almost nothing, street level uses Wi-Fi and masts, and precise GPS is for the moments that truly need metres."
          />
        </div>
      }
    >
      <p>Sort each feature.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Least precision that works", "GPS only when metres matter."],
        ["Fewest updates", "Longer intervals, batching."],
        ["Switch modes as needed", "Precise only near the end."],
        ["System screens first", "Camera UI and pickers before custom code."],
        ["The background is limited", "Geofences, foreground services, honesty."],
      ]}
    >
      <p>Next: making all of this usable by everyone.</p>
    </WrapStep>
  );
}
