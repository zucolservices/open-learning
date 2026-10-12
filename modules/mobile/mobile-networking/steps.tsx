"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, NETS, load, type Fixes, type Net } from "./model";
import type { NetState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Courier() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The courier on a scooter"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Knows when to give up",
              "If a shop doesn't answer the door in a few minutes, try later.",
            ],
            ["Tries again, sensibly", "Comes back after a short wait, then a longer one."],
            ["Keeps a spare", "Leaves yesterday's paper until today's arrives."],
            ["Travels light", "One small parcel rather than twelve big ones."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
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
        A good courier on a scooter, in traffic and rain, still gets things delivered. They
        don&apos;t wait forever at a closed door, they come back later, and they don&apos;t carry
        more than they must.
      </p>
      <p>
        Phone networks are that traffic: slow, lossy and sometimes expensive. Apps that set{" "}
        <Term id="timeout">timeouts</Term>, retry with <Term id="exponential-backoff">backoff</Term>
        , cache what they fetched and send less feel fast anyway.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

const fmt = (t: number | null) => (t === null ? "never" : `${t.toFixed(1)} s`);

export function Menu() {
  const [s, set] = useSceneState<NetState>();
  const net = s.net as Net;
  const f = Object.fromEntries(FIXES.map(([k]) => [k, s.fixes.includes(k)])) as unknown as Fixes;
  const r = load(net, f);
  const scale = (t: number | null) =>
    `${t === null ? 100 : Math.max(1, Math.min(100, (t / 62) * 100))}%`;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Load the menu on a bad connection"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <Segmented<Net>
            size="sm"
            value={net}
            onChange={(v) => set({ net: v })}
            options={(Object.keys(NETS) as Net[]).map((k) => [k, NETS[k].label])}
          />
          <div className="grid gap-1.5 sm:grid-cols-2">
            {FIXES.map(([k, t, b]) => (
              <label
                key={k}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-3 py-2",
                  f[k] ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={f[k]}
                  onChange={() =>
                    set({ fixes: f[k] ? s.fixes.filter((x) => x !== k) : [...s.fixes, k] })
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="font-semibold">{t}</span>
                  <span className="text-muted block text-[11px]">{b}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="border-line bg-surface grid gap-2 rounded-lg border px-3 py-2">
            {[
              ["Something useful on screen", r.firstScreen],
              ["Fresh menu loaded", r.fresh],
            ].map(([t, v]) => (
              <div key={t as string}>
                <p className="flex justify-between">
                  <span>{t}</span>
                  <span
                    className={cn(
                      "font-mono",
                      v === null ? "text-bad" : (v as number) <= 3 ? "text-good" : "",
                    )}
                  >
                    {fmt(v as number | null)}
                  </span>
                </p>
                <div className="bg-surface-2 mt-1 h-2 rounded-full">
                  <motion.div
                    animate={{ width: scale(v as number | null) }}
                    className={cn(
                      "h-2 rounded-full",
                      v === null ? "bg-bad/50" : (v as number) <= 3 ? "bg-good" : "bg-viz-meta",
                    )}
                  />
                </div>
              </div>
            ))}
            <p className="text-muted">
              {r.story} Data used: about {r.kb.toLocaleString("en-IN")} KB.
            </p>
          </div>
          <p className="text-subtle text-[10px]">Illustrative timings, not measurements.</p>
        </div>
      }
    >
      <p>
        Customers open the café app on the bus, where the signal comes and goes. Pick a network,
        then apply fixes one at a time and watch when something useful appears.
      </p>
      <p>
        Defaults are generous: iOS waits 60 seconds of silence before giving up on a request; OkHttp
        on Android waits 10 seconds per connect, read and write, with no overall limit. Choose
        limits that suit your screen.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Data ----------------------------------------------------------------------------------------- */

export function Data() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Respecting the user's data"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">iOS: Low Data Mode</p>
            <p className="text-muted">
              Since iOS 13 people can ask apps to use less data. Requests can be marked as not
              allowed on constrained or expensive (most cellular) networks, and wait for Wi-Fi.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Android: Data Saver</p>
            <p className="text-muted">
              Since Android 7, on a metered network the system blocks background data and asks apps
              to use less in the foreground. Apps can check the setting and adapt.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs sm:col-span-2">
            <p className="font-semibold">Wait for a connection</p>
            <p className="text-muted">
              Rather than failing at once when offline, a request can wait for connectivity, or be
              handed to a background transfer the system completes later.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Mobile data costs money, and for many people it&apos;s limited. Prefetch big things like
        videos on Wi-Fi, use thumbnails on cellular, and compress responses.
      </p>
      <p>
        Cache with ordinary HTTP rules (Cache-Control and ETags): iOS caches by default through
        URLCache; on Android, OkHttp caches only once you give it a cache directory.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Secure --------------------------------------------------------------------------------------- */

export function Secure() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Secure by default"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "iOS 9",
              "App Transport Security: connections must use HTTPS (TLS 1.2 or newer) unless the app declares an exception.",
            ],
            ["Android 9", "Plain, unencrypted HTTP is blocked by default for apps targeting it."],
            [
              "iOS 15",
              "HTTP/3 over QUIC is on by default in URLSession when the server supports it.",
            ],
            [
              "Android 14",
              "HttpEngine (Cronet in the system) offers HTTP/3; OkHttp supports HTTP/1.1 and HTTP/2.",
            ],
            ["Android 17", "Apps targeting it check Certificate Transparency by default."],
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
        Phones join coffee-shop Wi-Fi all day, so both platforms insist on encrypted connections.
        Chapter 6 covers more of mobile security.
      </p>
      <p>
        HTTP/3 runs over QUIC, which copes better with lost packets and with a phone switching from
        Wi-Fi to cellular mid-request.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function NetCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A safe retry"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="mobile-retry"
            prompt="Placing an order times out. The server may or may not have received it. What makes it safe for the app to retry?"
            options={[
              {
                id: "key",
                label:
                  "Send a unique request id with the order, so the server ignores a repeat it has already processed",
                correct: true,
                feedback: "Right. An idempotency key turns a duplicate into a no-op.",
              },
              {
                id: "fast",
                label: "Retry immediately, as many times as needed",
                feedback: "That risks duplicate orders and floods a struggling server.",
              },
              {
                id: "never",
                label: "Never retry anything",
                feedback: "Reads are safe to retry, and writes can be made safe.",
              },
              {
                id: "longer",
                label: "Use a longer timeout so it never times out",
                feedback: "Connections still drop; you need a safe way to try again.",
              },
            ]}
            explanation="Reads can be retried freely. Writes need an idempotency key so a repeated request has no extra effect. Retry with growing, slightly random gaps."
          />
        </div>
      }
    >
      <p>Pick the safest approach.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Set timeouts", "Give up on silence, not on slowness."],
        ["Retry with backoff", "Growing gaps; idempotent writes."],
        ["Cache and show", "Old data now beats new data never."],
        ["Send less", "Fewer requests, smaller payloads."],
        ["Respect data limits", "Low Data Mode and Data Saver."],
      ]}
    >
      <p>Next: where to keep data on the phone.</p>
    </WrapStep>
  );
}
