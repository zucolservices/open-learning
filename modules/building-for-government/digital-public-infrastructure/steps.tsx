"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { NEEDS, RAILS } from "./model";
import type { DpiState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Roads() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Roads, not cars"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {["Bus", "Truck", "Ambulance", "Bicycle", "Taxi"].map((v, i) => (
              <motion.span
                key={v}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface rounded-full border px-3 py-1"
              >
                {v}
              </motion.span>
            ))}
          </div>
          <div className="bg-accent-soft border-accent rounded-lg border py-3 text-center text-xs font-semibold">
            One shared road
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            {["Identity", "Payments", "Data with consent"].map((l) => (
              <span key={l} className="border-line bg-surface-2 rounded-md border py-1.5">
                {l}
              </span>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A government doesn&apos;t build every bus, truck and taxi. It builds roads, and anyone can
        drive on them. Good roads make every vehicle more useful.
      </p>
      <p>
        <Term id="digital-public-infrastructure">Digital public infrastructure</Term> (DPI) is the
        same idea for the digital economy: shared rails for identity, payments and data sharing that
        public and private services build on. India&apos;s version is often called the{" "}
        <Term id="india-stack">India Stack</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build and connect ⭐ ------------------------------------------------------------------------- */

export function Loan() {
  const [s, set] = useSceneState<DpiState>();
  const right = NEEDS.filter((n) => s.picks[n.id] === n.answer).length;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Assemble a loan from shared rails"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {NEEDS.map((n) => {
            const pick = s.picks[n.id];
            const ok = pick === n.answer;
            return (
              <div
                key={n.id}
                className={cn(
                  "rounded-lg border px-3 py-1.5",
                  !pick
                    ? "border-line bg-surface"
                    : ok
                      ? "border-good/50 bg-good/10"
                      : "border-bad/40 bg-bad/5",
                )}
              >
                <p className="font-semibold">{n.step}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {RAILS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={pick === r.id}
                      onClick={() => set({ picks: { ...s.picks, [n.id]: r.id } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[11px]",
                        pick === r.id
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-line-strong text-muted",
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className="text-muted mt-1">
                    {ok
                      ? n.why
                      : pick === "paper"
                        ? n.paper
                        : "That rail doesn't do this job. Try another."}
                  </p>
                )}
              </div>
            );
          })}
          <p className="text-muted">
            {right === NEEDS.length
              ? "Every step runs on a shared rail: the loan can be decided in minutes, from a phone."
              : `${right} of ${NEEDS.length} steps on the right rail.`}
          </p>
        </div>
      }
    >
      <p>
        A shopkeeper in Kalpanagar wants a small working-capital loan. The lender is a small company
        that has never met them. Pick the rail for each step.
      </p>
      <p>
        The lender built none of these rails; it just plugs in. That&apos;s what makes DPI powerful:
        one investment, reused by thousands of services.
      </p>
    </StepLayout>
  );
}

/* 3 ─ World ---------------------------------------------------------------------------------------- */

export function World() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="DPI around the world"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Estonia: X-Road (2001)",
              "No central database: agencies exchange signed, logged messages, so the state asks for each fact only once.",
            ],
            [
              "MOSIP",
              "Open-source identity software from IIIT Bangalore: 14 national rollouts, including the Philippines, Ethiopia and Morocco (end of 2025).",
            ],
            [
              "G20, 2023",
              "Under India's presidency, the G20 defined DPI as shared digital systems, built on open standards, used by public and private sectors.",
            ],
            [
              "50-in-5 campaign",
              "Helping 50 countries launch at least one DPI component by 2028; 41 had joined by October 2026.",
            ],
            [
              "Global DPI Repository",
              "A catalogue started by India, listing 54 DPIs from 17 countries and regions.",
            ],
            [
              "Brazil's Pix",
              "An instant payment system run by the central bank, often compared with UPI.",
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
        DPI takes different shapes. India built large national platforms; Estonia built a
        decentralised exchange where each agency keeps its own data.
      </p>
      <p>
        Many DPIs are open source, so other countries can adapt them instead of starting from
        scratch: the idea behind digital public goods (module 19).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Scale ---------------------------------------------------------------------------------------- */

export function Scale() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Scale, and the cautions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["UPI, September 2026", "24.07 billion payments in the month: over 800 million a day."],
            ["DigiLocker, August 2026", "More than 72 crore registered users."],
            ["Account Aggregator, September 2026", "Over 50 crore consents fulfilled."],
            [
              "ONDC, July 2026",
              "Over 50 crore transactions since launch, still small next to big marketplaces.",
            ],
            [
              "The cautions",
              "Biometric failures can exclude people; data held at this scale demands strong privacy protection. In 2018 the Supreme Court limited where Aadhaar can be required.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 4 ? "border-viz-meta/50 bg-viz-meta/10" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Each rail has its own owner: UIDAI for Aadhaar, NPCI (under the RBI) for UPI, MeitY for
        DigiLocker, RBI-licensed companies for Account Aggregators. &ldquo;India Stack&rdquo; is a
        label, not one system.
      </p>
      <p>The G20 text itself asks that DPI respect human rights, personal data and privacy.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DpiCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Rail or vehicle?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-dpi"
            prompt="Is each one shared infrastructure, or a service built on top of it?"
            categories={[
              { id: "rail", label: "Shared rail (DPI)" },
              { id: "vehicle", label: "A service built on it" },
            ]}
            items={[
              { id: "upi", label: "UPI", category: "rail", why: "Any bank or app can plug in." },
              {
                id: "bank",
                label: "A bank's own payments app",
                category: "vehicle",
                why: "It runs on UPI.",
              },
              {
                id: "aadhaar",
                label: "Aadhaar authentication",
                category: "rail",
                why: "Used by many services.",
              },
              {
                id: "ondc",
                label: "The ONDC network",
                category: "rail",
                why: "An open protocol any app can join.",
              },
              {
                id: "lender",
                label: "A lender's loan app",
                category: "vehicle",
                why: "It uses eKYC, AA and UPI.",
              },
            ]}
            explanation="DPI is the shared, interoperable layer: identity, payments and consent-based data. Apps and services, public or private, are built on top of it."
          />
        </div>
      }
    >
      <p>Sort each one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Build roads, not cars", "Shared rails everyone can use."],
        ["Three layers", "Identity, payments, consent-based data."],
        ["Interoperable", "Any app can work with any other."],
        ["Many models", "National platforms or decentralised exchange."],
        ["Rights matter", "Inclusion and privacy are part of the design."],
      ]}
    >
      <p>Next: how government buys the technology to build all this.</p>
    </WrapStep>
  );
}
