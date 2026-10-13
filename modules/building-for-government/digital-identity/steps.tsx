"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LEVELS, SERVICES } from "./model";
import type { IdState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Doorman() {
  return (
    <StepLayout
      eyebrow="Story"
      title="How much should the guard ask?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Public park", "Nobody asks who you are."],
            ["Library", "A membership card is enough."],
            ["Bank locker room", "Photo ID, a signature and a key."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span
                className="bg-accent h-2 shrink-0 rounded-full"
                style={{ width: 12 + i * 24 }}
              />
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A park gate doesn&apos;t check ID, a library wants a card, and a bank&apos;s locker room
        wants much more. Asking too little invites fraud; asking too much shuts people out and
        collects what you don&apos;t need.
      </p>
      <p>
        <Term id="digital-identity">Digital identity</Term> works the same way. India&apos;s{" "}
        <Term id="aadhaar">Aadhaar</Term> is the largest system in the world, and the law and courts
        limit where it can be required.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function Verify() {
  const [s, set] = useSceneState<IdState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="How strongly to verify?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {SERVICES.map((sv) => {
            const pick = s.picks[sv.id];
            const ok = pick === sv.answer;
            return (
              <div key={sv.id} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{sv.title}</p>
                <div className="mt-1 grid gap-1 sm:grid-cols-2">
                  {LEVELS.map(([id, label, n]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={pick === id}
                      onClick={() => set({ picks: { ...s.picks, [sv.id]: id } })}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-2 py-1 text-left text-[11px]",
                        pick === id
                          ? ok
                            ? "border-good bg-good/10"
                            : "border-bad bg-bad/5"
                          : "border-line hover:border-accent",
                      )}
                    >
                      <span className="flex shrink-0 gap-0.5">
                        {[0, 1, 2].map((k) => (
                          <span
                            key={k}
                            className={cn(
                              "size-1.5 rounded-full",
                              k < n ? "bg-accent" : "bg-line-strong",
                            )}
                          />
                        ))}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-1 text-[11px]", ok ? "text-good" : "text-bad")}>
                    {sv.feedback[pick]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        Choose how each made-up service should check who it&apos;s dealing with. The dots show how
        much identity each option demands.
      </p>
      <p>
        The aim is the lightest check that meets the risk, with a way through for anyone the main
        route fails.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How it works --------------------------------------------------------------------------------- */

export function HowItWorks() {
  const hops = [
    "Person gives consent",
    "Certified device encrypts the fingerprint",
    "The service",
    "An authentication agency",
    "UIDAI",
    "Yes or no",
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How Aadhaar authentication works"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {hops.map((h, i) => (
              <motion.span
                key={h}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-1.5"
              >
                <span
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5",
                    i === hops.length - 1
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface",
                  )}
                >
                  {h}
                </span>
                {i < hops.length - 1 && <span className="text-subtle">→</span>}
              </motion.span>
            ))}
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {[
              [
                "Ways to authenticate",
                "Demographic details, an OTP to the registered mobile, fingerprint or iris, or face.",
              ],
              [
                "eKYC",
                "With consent, UIDAI can also return name, address, date of birth and photo.",
              ],
              [
                "Virtual ID",
                "A revocable 16-digit number people can use instead of their Aadhaar number.",
              ],
              ["Scale", "Face authentication passed 500 crore transactions in September 2026."],
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
        Aadhaar proves that this is the same person who enrolled. It is not proof of citizenship,
        and core biometrics are never shared with the service.
      </p>
      <p>
        For government staff and citizens alike, the national single sign-on MeriPehchaan brings
        together Jan Parichay, e-Pramaan and DigiLocker logins.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Law and abroad ------------------------------------------------------------------------------- */

export function LawAbroad() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The law, and other countries"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "2016",
              "Aadhaar Act: Aadhaar may be required for benefits from public funds, with alternatives where it isn't available.",
            ],
            [
              "2017 and 2018",
              "Supreme Court: privacy is a fundamental right; Aadhaar upheld for welfare, but private use by contract and mandatory bank and SIM linking struck down.",
            ],
            [
              "2019 and 2025",
              "Offline verification and voluntary eKYC for banks; since January 2025, approved private services may use Aadhaar authentication for public-interest purposes.",
            ],
            [
              "Elsewhere",
              "UK: GOV.UK One Login (still in beta). US: Login.gov. EU: every member state must offer a digital identity wallet by 24 December 2026. Estonia: a chip ID card since 2002.",
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
        Privacy by design is built into the system: virtual IDs, masked numbers showing only the
        last four digits, and the option to lock your biometrics.
      </p>
      <p>
        Services handling Aadhaar data must also follow the DPDP Act. This is an overview, not legal
        advice.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function IdCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What comes back?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="gov-identity"
            prompt="A pension office authenticates someone with their fingerprint. What does it receive from UIDAI?"
            options={[
              {
                id: "yesno",
                label:
                  "A yes or no answer (plus name, address and photo if it requested eKYC with consent)",
                correct: true,
                feedback: "Right. Core biometrics never leave UIDAI.",
              },
              {
                id: "print",
                label: "A copy of the stored fingerprint, to keep on file",
                feedback: "The law forbids sharing core biometrics with anyone.",
              },
              {
                id: "citizen",
                label: "Confirmation that the person is an Indian citizen",
                feedback: "Aadhaar isn't proof of citizenship.",
              },
              {
                id: "all",
                label: "Everything UIDAI holds about the person",
                feedback: "Only what's needed, and only with consent.",
              },
            ]}
            explanation="Aadhaar authentication answers one question: is this the person who enrolled? eKYC adds a few details with consent. Fingerprints and iris scans are never shared."
          />
        </div>
      }
    >
      <p>Pick the right answer.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Match check to risk", "From none to strong."],
        ["Always a way through", "Alternatives when authentication fails."],
        ["Yes or no", "Biometrics never leave UIDAI."],
        ["The law sets limits", "Act, Supreme Court, 2019 and 2025 rules."],
        ["Privacy by design", "Virtual IDs, masking, consent."],
      ]}
    >
      <p>Next: documents and signatures without photocopies.</p>
    </WrapStep>
  );
}
