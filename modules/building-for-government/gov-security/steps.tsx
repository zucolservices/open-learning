"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS } from "./model";
import type { SecGovState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Drill() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The fire drill"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Before", "Alarms tested, exits marked, a warden named for every floor."],
            ["During", "Call the fire service at once, even before you know how bad it is."],
            ["After", "An inspection before anyone moves back in."],
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
        Offices don&apos;t wait for a fire to decide who calls the fire service. They drill, name
        wardens and keep exits clear, so the first minutes go to plan.
      </p>
      <p>
        Government systems are prime targets. In India, <Term id="cert-in">CERT-In</Term>&apos;s
        directions say what every organisation must do before and during a{" "}
        <Term id="cyber-incident">cyber incident</Term>: keep logs, sync clocks, and report within
        six hours.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function Incident() {
  const [s, set] = useSceneState<SecGovState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="An incident, hour by hour"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {DECISIONS.map((d) => {
            const pick = d.options.find((o) => o.id === s.picks[d.id]);
            return (
              <div key={d.id} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p>
                  <span className="text-accent mr-1.5 text-[10px] font-medium">{d.when}</span>
                  <span className="font-semibold">{d.title}</span>
                </p>
                <div className="mt-1 grid gap-1">
                  {d.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={pick?.id === o.id}
                      onClick={() => set({ picks: { ...s.picks, [d.id]: o.id } })}
                      className={cn(
                        "rounded-md border px-2 py-1 text-left text-[11px]",
                        pick?.id === o.id
                          ? o.ok
                            ? "border-good bg-good/10"
                            : "border-bad bg-bad/5"
                          : "border-line hover:border-accent",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-1 text-[11px]", pick.ok ? "text-good" : "text-bad")}>
                    {pick.outcome}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s transport department runs a licence portal. Follow it from preparation
        through an incident to relaunch, and make each call.
      </p>
      <p>
        This is a rules-based exercise: what happened is described in words, and the focus is on the
        department&apos;s duties, not on how attacks work.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Rules ---------------------------------------------------------------------------------------- */

export function Rules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="CERT-In's rules"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Directions, April 2022",
              "Apply to government organisations, service providers, data centres and companies, under section 70B of the IT Act.",
            ],
            [
              "Six hours",
              "Report any of 20 listed incident types, from defacement and data leaks to ransomware and attacks on payment systems.",
            ],
            [
              "Logs and clocks",
              "Keep logs of all systems for a rolling 180 days and sync clocks to NIC or NPL time servers.",
            ],
            [
              "Guidelines for government, June 2023",
              "A named CISO, a security team separate from IT operations, a security policy, and controls such as multi-factor sign-in.",
            ],
            [
              "Audits",
              "By CERT-In-empanelled auditors (231 in 2025), under audit policy guidelines issued in July 2025.",
            ],
            [
              "Coming in May 2027",
              "DPDP breach notices too: tell the Data Protection Board and affected people without delay, with a detailed report within 72 hours.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
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
        Wilful non-compliance with the directions can mean up to a year in prison or a fine of up to
        ₹1 lakh. In practice, the bigger cost is an incident nobody can investigate.
      </p>
      <p>
        This is an overview, not legal advice; check CERT-In&apos;s current directions and FAQs.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Institutions --------------------------------------------------------------------------------- */

export function Institutions() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who does what, and lessons learned"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "CERT-In",
              "The national incident response team, under MeitY. It handled over 29 lakh incidents in 2025 (incidents tracked, not all breaches).",
            ],
            [
              "NCIIPC",
              "Protects critical information infrastructure. Unauthorised access to a notified “protected system” can mean up to 10 years in prison.",
            ],
            [
              "National Cyber Security Coordinator",
              "Coordinates strategy. The 2013 national policy is still the formal baseline; a newer strategy hasn't been adopted.",
            ],
            ["I4C and 1930", "Under the Home Ministry, for cybercrime against citizens."],
            [
              "AIIMS Delhi, November 2022",
              "Ransomware took hospital systems offline for about two weeks; data came back from an unaffected backup. Officials pointed to poor network segmentation.",
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
        The AIIMS lesson for builders: separate networks and separate backups decide whether an
        incident is a disaster or a recovery.
      </p>
      <p>
        The Application Security track covers how to build systems that resist attacks in the first
        place.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SecCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Report within six hours?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-security"
            prompt="Must each event be reported to CERT-In within six hours?"
            categories={[
              { id: "yes", label: "Report within 6 hours" },
              { id: "no", label: "Not a reportable incident" },
            ]}
            items={[
              {
                id: "deface",
                label: "The portal's home page replaced by an attacker",
                category: "yes",
                why: "Defacement is on the list.",
              },
              {
                id: "ransom",
                label: "Files on a server locked by ransomware",
                category: "yes",
                why: "Ransomware is listed.",
              },
              {
                id: "leak",
                label: "Applicants' records found posted online",
                category: "yes",
                why: "A data leak.",
              },
              {
                id: "password",
                label: "A clerk forgets their password and resets it",
                category: "no",
                why: "Routine, not an incident.",
              },
              {
                id: "update",
                label: "A planned software update",
                category: "no",
                why: "Routine maintenance.",
              },
            ]}
            explanation="CERT-In lists 20 incident types, including defacement, data breaches and leaks, ransomware and attacks on e-governance systems. Report within six hours of noticing; details can follow."
          />
        </div>
      }
    >
      <p>Sort each event.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Prepare before", "Logs for 180 days, synced clocks, a named CISO."],
        ["Report in six hours", "Even before you know everything."],
        ["Recover from backups", "Separate and offline."],
        ["Audit before relaunch", "By empanelled auditors."],
        ["Two clocks from 2027", "CERT-In now, DPDP too from May 2027."],
      ]}
    >
      <p>Next: when millions arrive at once.</p>
    </WrapStep>
  );
}
