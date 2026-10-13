"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FINDINGS } from "./model";
import type { SecState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Tills() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The takeaway menu in every pocket"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/5 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Safe code printed on the menu</p>
            <p className="text-muted">Every customer now holds it. Tiny print doesn&apos;t help.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/50 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Safe code stays in the office</p>
            <p className="text-muted">The menu says how to order; the till decides what you pay.</p>
          </motion.div>
        </div>
      }
    >
      <p>
        No café would print the safe&apos;s code on its takeaway menu, however small the type. And
        it wouldn&apos;t charge whatever price a customer wrote on their order slip.
      </p>
      <p>
        An app is that menu: everyone can download it and take it apart. So{" "}
        <Term id="client-untrusted">the client is untrusted</Term>: secrets stay on the server, the
        server makes every decision that matters, and sensitive data on the phone goes in secure
        storage.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function Review() {
  const [s, set] = useSceneState<SecState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Review the café app"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {FINDINGS.map((f) => {
            const pick = f.options.find((o) => o.id === s.picks[f.id]);
            return (
              <div key={f.id} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p>
                  <span className="text-accent mr-1.5 text-[10px] font-medium">{f.area}</span>
                  {f.note}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {f.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={pick?.id === o.id}
                      onClick={() => set({ picks: { ...s.picks, [f.id]: o.id } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-left text-[11px]",
                        pick?.id === o.id
                          ? "border-accent bg-accent-soft"
                          : "border-line-strong text-muted",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p
                    className={cn(
                      "mt-1 rounded-md border px-2 py-1",
                      pick.tone === "good"
                        ? "border-good/50 bg-good/10"
                        : pick.tone === "ok"
                          ? "border-viz-meta/50 bg-viz-meta/10"
                          : "border-bad/40 bg-bad/5",
                    )}
                  >
                    {pick.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        A security review of the café app turned up six findings. For each, choose the response and
        read why it works or doesn&apos;t.
      </p>
      <p>
        This is a checklist exercise in plain words: no real keys, no attack steps. The point is
        where each decision and secret belongs.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Standards ------------------------------------------------------------------------------------ */

const TOP10 = [
  "Improper credential usage",
  "Inadequate supply chain security",
  "Insecure authentication and authorisation",
  "Insufficient input and output validation",
  "Insecure communication",
  "Inadequate privacy controls",
  "Insufficient binary protections",
  "Security misconfiguration",
  "Insecure data storage",
  "Insufficient cryptography",
];

export function Standards() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The OWASP mobile standards"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">OWASP Mobile Top 10 (2024)</p>
            <ol className="text-muted mt-1 list-decimal space-y-0.5 pl-4">
              {TOP10.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-2">
            {[
              [
                "MASVS",
                "What a secure app must achieve, in eight groups: storage, crypto, authentication, network, platform, code, resilience and privacy. Version 2 came in 2023; 2.1 added privacy in 2024.",
              ],
              ["MASWE", "A catalogue of mobile weaknesses that link the goals to tests."],
              ["MASTG", "The testing guide: how to check each control on Android and iOS."],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{b}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The Open Worldwide Application Security Project (<Term id="owasp">OWASP</Term>) maintains
        free standards for mobile apps. Teams use MASVS as a checklist of goals and the MASTG to
        verify them.
      </p>
      <p>
        Notice the first item: credentials shipped in apps. The Application Security track covers
        the server side.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Genuine -------------------------------------------------------------------------------------- */

export function Genuine() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Is this the real app?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "App attestation",
              "Google's Play Integrity API and Apple's App Attest let your server check that a request comes from your genuine app on a genuine device.",
            ],
            [
              "Verify on the server",
              "The app collects the signed verdict; your server checks it and decides. A check inside the app can be skipped.",
            ],
            [
              "SafetyNet is gone",
              "Google's older SafetyNet Attestation was fully turned off in January 2025.",
            ],
            [
              "Root and jailbreak checks",
              "Defence in depth only: the attacker controls the device. Never a replacement for server rules.",
            ],
            [
              "Transport",
              "HTTPS everywhere; Android 17 checks Certificate Transparency by default. Pin certificates only with backups and a plan.",
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
        <Term id="app-attestation">Attestation</Term> is a useful extra signal, for example to slow
        down promo-code abuse. Decide on the server what to do with a failing verdict: block, ask
        for more proof, or just flag it.
      </p>
      <p>Not every device supports attestation, so always plan a fallback.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SecCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="In the app or on the server?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-security"
            prompt="Where does each thing belong?"
            categories={[
              { id: "app", label: "Fine inside the app" },
              { id: "server", label: "Server only" },
            ]}
            items={[
              {
                id: "url",
                label: "The address of the café's ordering API",
                category: "app",
                why: "Public anyway.",
              },
              {
                id: "secret",
                label: "The payment provider's secret key",
                category: "server",
                why: "Anyone could extract it.",
              },
              {
                id: "publishable",
                label: "A payment provider's publishable key, designed for apps",
                category: "app",
                why: "Made to be public.",
              },
              {
                id: "promo",
                label: "Deciding whether a promo code is valid",
                category: "server",
                why: "The app can be modified.",
              },
              {
                id: "db",
                label: "The database admin password",
                category: "server",
                why: "Never ship it.",
              },
            ]}
            explanation="Assume everything in the app is public. Ship only what's designed to be public; keep secrets and every decision that matters on the server."
          />
        </div>
      }
    >
      <p>Sort each item.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["The app is public", "Nothing secret ships inside it."],
        ["The server decides", "Treat requests as claims, not facts."],
        ["Secure storage and transport", "Keychain, Keystore, HTTPS."],
        ["Attestation helps", "Verified on the server, with a fallback."],
        ["Use the standards", "MASVS, MASTG, the Mobile Top 10."],
      ]}
    >
      <p>Next: learning from real use.</p>
    </WrapStep>
  );
}
