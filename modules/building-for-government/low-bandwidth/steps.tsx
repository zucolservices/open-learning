"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BASE_KB, CHANNELS, NETS, PARTS, seconds } from "./model";
import type { BwState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Bus() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The last bus to the village"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/5 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">An office in the city centre</p>
            <p className="text-muted">
              Open to all, in theory. In practice, a day&apos;s wages and two buses away.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/50 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A counter in the village</p>
            <p className="text-muted">Smaller, simpler, and actually reachable.</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A service is only as open as it is reachable. An office two buses away is open to everyone
        on paper and closed to many in practice.
      </p>
      <p>
        A heavy web page is that distant office. Many people use cheap phones on slow or expensive
        data, and some have no smartphone at all. A{" "}
        <Term id="page-weight-budget">page weight budget</Term> and other channels such as SMS and
        voice keep services within reach.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Slim() {
  const [s, set] = useSceneState<BwState>();
  const fixed = new Set(s.fixed);
  const kbps = NETS.find(([id]) => id === s.net)![2];
  const total = BASE_KB + PARTS.reduce((t, p) => t + (fixed.has(p.id) ? p.fixedKb : p.kb), 0);
  const t = seconds(total, kbps);
  const ch = new Set(s.channels);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Slim the page, add channels"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <Segmented
            size="sm"
            value={s.net}
            onChange={(v) => set({ net: v })}
            options={NETS.map(([id, label]) => [id, label] as [string, string])}
          />
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="flex justify-between">
              <span className="font-semibold">Page weight: {total.toLocaleString("en-IN")} KB</span>
              <span className={cn("font-mono", t > 30 ? "text-bad" : t > 5 ? "" : "text-good")}>
                {t >= 60 ? `${(t / 60).toFixed(1)} min` : `${t.toFixed(1)} s`} at{" "}
                {kbps >= 1000 ? `${kbps / 1000} Mbps` : `${kbps} kbps`}
              </span>
            </p>
            <div className="bg-surface-2 mt-1.5 flex h-3 overflow-hidden rounded-full">
              <span className="bg-viz-idle" style={{ width: `${(BASE_KB / 2770) * 100}%` }} />
              {PARTS.map((p, i) => (
                <motion.span
                  key={p.id}
                  animate={{ width: `${((fixed.has(p.id) ? p.fixedKb : p.kb) / 2770) * 100}%` }}
                  className={cn(i % 2 ? "bg-viz-data" : "bg-viz-meta")}
                />
              ))}
            </div>
            <p className="text-subtle mt-1 text-[10px]">
              The typical mobile home page in 2025 weighed about 2,559 KB (HTTP Archive).
            </p>
          </div>
          <div className="grid gap-1">
            {PARTS.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border px-3 py-1.5 sm:flex-row sm:items-center sm:gap-2",
                  fixed.has(p.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <span className="w-full sm:flex-1">
                  {p.label}{" "}
                  <span className="text-muted font-mono">
                    {(fixed.has(p.id) ? p.fixedKb : p.kb).toLocaleString("en-IN")} KB
                  </span>
                </span>
                <button
                  type="button"
                  aria-pressed={fixed.has(p.id)}
                  onClick={() =>
                    set({
                      fixed: fixed.has(p.id)
                        ? s.fixed.filter((x) => x !== p.id)
                        : [...s.fixed, p.id],
                    })
                  }
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-left text-[10px]",
                    fixed.has(p.id) ? "border-good text-good" : "border-line-strong",
                  )}
                >
                  {fixed.has(p.id) ? "Fixed · undo" : p.fix}
                </button>
              </div>
            ))}
          </div>
          <div className="border-line bg-surface-2 rounded-lg border px-3 py-2">
            <p className="font-semibold">For people without data or a smartphone</p>
            {CHANNELS.map(([id, label, who]) => (
              <label key={id} className="mt-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ch.has(id)}
                  onChange={() =>
                    set({
                      channels: ch.has(id)
                        ? s.channels.filter((x) => x !== id)
                        : [...s.channels, id],
                    })
                  }
                />
                {label}
                <span className="text-muted">· {who}</span>
              </label>
            ))}
            <p className={cn("mt-1", ch.size ? "text-good" : "text-muted")}>
              {ch.size === 2
                ? "Status by SMS and help by voice: no one needs data to follow their application."
                : ch.size
                  ? "Better: one channel that works on any phone."
                  : "Right now, only people with data can follow their application."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s scholarship page is as heavy as a typical website. Pick a connection, then
        cut the weight part by part and watch the load time.
      </p>
      <p>
        Load times are illustrative, from size and speed alone. On 2G every kilobyte shows; even in
        cities, data caps and crowded networks make light pages kinder.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Reality -------------------------------------------------------------------------------------- */

export function Reality() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The connections people have"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Fast on average",
              "With 5G, India's median mobile download speed passed 100 Mbps in 2025 (Ookla).",
            ],
            [
              "Very uneven",
              "TRAI's 2025 drive tests found 165–270 Mbps on private 4G and 5G in some cities, and about 7–8 Mbps on some state-run networks.",
            ],
            [
              "Connections without data",
              "About 1,266 million mobile connections against 1,027 million data connections in March 2026: roughly 240 million without data. SIMs, not people.",
            ],
            [
              "Villages trail cities",
              "Rural tele-density of about 60% against about 151% urban (March 2026).",
            ],
            [
              "Data is cheap, but capped",
              "About ₹8 per GB on average (2025-26), yet prepaid users still hit daily limits.",
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
        Averages hide the people who matter most for public services: those on weak networks, shared
        phones and tight plans.
      </p>
      <p>
        GIGW sets no numeric page-size limit, so use common web targets such as Core Web Vitals,
        tested on a cheap phone over a slow connection.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Channels ------------------------------------------------------------------------------------- */

export function Channels() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Beyond the web"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Voice (IVR)", "Works on any phone, and for people who can't read."],
            [
              "SMS",
              "Any phone. NIC runs messaging for departments; senders follow TRAI's registration rules for headers and templates.",
            ],
            [
              "USSD (*99#)",
              "Session-based menus on any GSM phone, used for UPI payments without data.",
            ],
            [
              "UPI 123PAY",
              "UPI payments from feature phones by voice call, missed call or built-in app; up to ₹10,000 per payment since 2025.",
            ],
            [
              "WhatsApp helpdesks",
              "Popular, including MyGov's, but they need a smartphone and data.",
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
        Feature-phone operating systems have faded: KaiOS, once big on JioPhones, is now a tiny
        share of web traffic. So reach those users through voice, SMS and USSD, not a special web
        version.
      </p>
      <p>
        Every channel should share one reference number and status, so people can switch between
        them.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function BwCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Does it reach a phone without data?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-low-bandwidth"
            prompt="Does each channel work on a basic phone with no data plan?"
            categories={[
              { id: "yes", label: "Works without data" },
              { id: "no", label: "Needs data" },
            ]}
            items={[
              {
                id: "sms",
                label: "An SMS status alert",
                category: "yes",
                why: "SMS needs no data.",
              },
              {
                id: "ivr",
                label: "A voice helpline with menus",
                category: "yes",
                why: "An ordinary call.",
              },
              {
                id: "whatsapp",
                label: "A WhatsApp chatbot",
                category: "no",
                why: "Needs a smartphone and data.",
              },
              {
                id: "ussd",
                label: "A USSD menu such as *99#",
                category: "yes",
                why: "Runs over the voice network.",
              },
              {
                id: "webapp",
                label: "A 2 MB web application",
                category: "no",
                why: "Needs data, and a lot of it.",
              },
            ]}
            explanation="Voice, SMS and USSD reach any phone without data. Web pages and messaging apps need data; keep them light, and offer the other channels too."
          />
        </div>
      }
    >
      <p>Sort each channel.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Set a weight budget", "Every kilobyte costs time and money."],
        ["Cut the extras", "Images, fonts, widgets, carousels."],
        ["Test on cheap phones", "Over slow connections."],
        ["Voice, SMS, USSD", "For phones without data."],
        ["One status everywhere", "A shared reference number."],
      ]}
    >
      <p>Next: forms, fees and payments people actually finish.</p>
    </WrapStep>
  );
}
