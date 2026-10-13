"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PLACES, SERVICES } from "./model";
import type { HostState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Lockers() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Lockers, vaults and safes"
      stage={
        <div className="flex flex-1 items-end justify-center gap-4 pb-6 text-center text-xs">
          {[
            ["Station locker", "Your bags", "h-14"],
            ["Bank vault", "Your jewellery", "h-20"],
            ["Your own safe", "The family will", "h-28"],
          ].map(([t, b, h], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="flex flex-col items-center gap-1"
            >
              <div className={cn("border-accent bg-accent-soft w-20 rounded-md border", h)} />
              <span className="font-semibold">{t}</span>
              <span className="text-muted">{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You might leave a bag in a station locker, keep jewellery in a bank vault and lock the
        family will in your own safe. The more it matters, the more control you want.
      </p>
      <p>
        Government data works the same way. India approves cloud services through{" "}
        <Term id="cloud-empanelment">cloud empanelment</Term>, runs its own clouds through NIC, and
        since 2026 has a framework that says which kind of data may go where.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function Place() {
  const [s, set] = useSceneState<HostState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Where should each service live?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {SERVICES.map((sv) => {
            const pick = s.picks[sv.id];
            const ok = pick === sv.answer;
            return (
              <div key={sv.id} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{sv.title}</p>
                <p className="text-muted">{sv.data}</p>
                <div className="mt-1 grid gap-1 sm:grid-cols-2">
                  {PLACES.map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={pick === id}
                      onClick={() => set({ picks: { ...s.picks, [sv.id]: id } })}
                      className={cn(
                        "rounded-md border px-2 py-1 text-left text-[11px]",
                        pick === id
                          ? ok
                            ? "border-good bg-good/10"
                            : "border-bad bg-bad/5"
                          : "border-line hover:border-accent",
                      )}
                    >
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
        Kalpanagar is moving three services to new hosting. Each department must first classify its
        data, then choose a place that the rules allow and that suits the job.
      </p>
      <p>
        MeitY&apos;s March 2026 framework sorts workloads: classified material stays off cloud,
        sensitive &ldquo;Category A&rdquo; data goes to government clouds, and lower-risk
        &ldquo;Category B&rdquo; work may also use empanelled commercial clouds.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Ladder --------------------------------------------------------------------------------------- */

export function Ladder() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Government hosting options"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "State Data Centres",
              "Set up under the National e-Governance Plan from 2008; most states run one.",
            ],
            [
              "NIC's MeghRaj cloud",
              "Government cloud since 2014, run from NIC's national data centres; over 2,000 ministries and departments host on it (Dec 2025).",
            ],
            [
              "Empanelled commercial clouds",
              "26 providers as of December 2025, Indian and global, audited by STQC against ISO security standards and hosted in India.",
            ],
            [
              "Three deployment models",
              "Public cloud, virtual private cloud, or a government community cloud kept physically separate.",
            ],
            [
              "Buying it",
              "Empanelled offerings are bought through GeM; government providers can be engaged directly.",
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
        Empanelment approves specific cloud offerings, not whole companies, and must be renewed.
        Check MeitY&apos;s current list before planning a project.
      </p>
      <p>
        Keep the disaster recovery site in India too, ideally in a different seismic zone from the
        main one.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Data rules ----------------------------------------------------------------------------------- */

export function DataRules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rules about where data lives"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "No single localisation law",
              "Government data stays in India through empanelment terms, the 2026 framework and contracts.",
            ],
            ["Payments", "Since 2018, the RBI requires payment data to be stored only in India."],
            [
              "Logs",
              "CERT-In's 2022 directions: keep system logs for 180 days and report incidents within six hours.",
            ],
            [
              "Personal data",
              "The DPDP Act allows transfers abroad unless the government restricts a country; sector rules can be stricter.",
            ],
            [
              "UK",
              "Cloud First, bought through G-Cloud (G-Cloud 15 since August 2026), with official classifications and NCSC's cloud security principles.",
            ],
            [
              "US",
              "FedRAMP certifies cloud services for federal use; separate government regions serve the most sensitive work.",
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
        <Term id="data-localisation">Data localisation</Term> in India is a patchwork of rules
        rather than one law, so each project checks the ones that apply to its data.
      </p>
      <p>
        Contracts matter as much as rules: they set exit terms and how long a provider keeps data
        after the contract ends.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function HostCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which category?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-hosting"
            prompt="Under the 2026 framework, where may each workload go?"
            categories={[
              { id: "off", label: "Off cloud" },
              { id: "a", label: "Government cloud (A)" },
              { id: "b", label: "Empanelled cloud allowed (B)" },
            ]}
            items={[
              {
                id: "defence",
                label: "Defence plans classified Top Secret",
                category: "off",
                why: "Classified material stays off cloud.",
              },
              {
                id: "health",
                label: "Citizens' health records",
                category: "a",
                why: "Sensitive and high impact.",
              },
              {
                id: "tourism",
                label: "A public tourism website",
                category: "b",
                why: "Lower risk.",
              },
              {
                id: "land",
                label: "Land records with owners' personal details",
                category: "a",
                why: "Sensitive personal data.",
              },
              {
                id: "calendar",
                label: "A department's public events calendar",
                category: "b",
                why: "Official but low risk.",
              },
            ]}
            explanation="Classify first: Secret and Top Secret stay off cloud; sensitive Category A data goes to government clouds; lower-risk Category B may also use MeitY-empanelled commercial clouds."
          />
        </div>
      }
    >
      <p>Sort each workload.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Classify first", "Secret, Category A, Category B."],
        ["Match the place", "Off cloud, government cloud, empanelled cloud."],
        ["Empanelled and audited", "26 providers, hosted in India."],
        ["A patchwork of rules", "RBI, CERT-In, DPDP, contracts."],
        ["Plan for recovery", "A second site, also in India."],
      ]}
    >
      <p>That ends the chapter on rules. Next: digital identity.</p>
    </WrapStep>
  );
}
