"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS } from "./model";
import type { BuyState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Pocket() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Spending other people's money"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Your own house</p>
            <p className="text-muted">
              Hire the builder your cousin recommends, on a handshake. If it goes wrong, it&apos;s
              your loss.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The housing society&apos;s new roof</p>
            <p className="text-muted">
              Get several quotes, compare them openly, and keep the paperwork. Every resident can
              ask why.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        When you spend your own money, you can buy however you like. When you spend money that
        belongs to others, you must show you chose fairly.
      </p>
      <p>
        Government <Term id="public-procurement">procurement</Term> is that, at national scale. In
        India the General Financial Rules set how central bodies buy, through the{" "}
        <Term id="gem">GeM</Term> marketplace or open tenders, and auditors check years later.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function Purchase() {
  const [s, set] = useSceneState<BuyState>();
  const done = DECISIONS.every((d) => s.picks[d.id]);
  const good = DECISIONS.filter((d) => d.options.find((o) => o.id === s.picks[d.id])?.ok).length;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Buy a case-management system"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {DECISIONS.map((d) => {
            const pick = d.options.find((o) => o.id === s.picks[d.id]);
            return (
              <div key={d.id} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{d.title}</p>
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
          {done && (
            <p
              className={cn(
                "rounded-lg border px-3 py-2",
                good === DECISIONS.length
                  ? "border-good/50 bg-good/10"
                  : "border-viz-meta/50 bg-viz-meta/10",
              )}
            >
              {good === DECISIONS.length
                ? "A fair, open purchase that small firms could win, judged on quality as well as price, and paid for on delivery."
                : "Some choices would invite complaints, shut out good bidders or weaken your hand later. Change them and see."}
            </p>
          )}
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s labour department needs a system to track workers&apos; compensation
        cases. It will cost about ₹8 crore. Make the five big decisions.
      </p>
      <p>
        Many government IT projects succeed or fail here, months before any code is written: in the
        route, the requirements, who may bid, and whether the winner is the lowest bid or chosen by{" "}
        <Term id="qcbs">QCBS</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Rules ---------------------------------------------------------------------------------------- */

export function Rules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The rules in brief"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "GeM is mandatory",
              "For goods and services listed on GeM. Up to ₹50,000: any seller; up to ₹10 lakh: cheapest of at least three makers; above: GeM bidding or reverse auction (since July 2024).",
            ],
            [
              "Everything else is tendered",
              "Published on the Central Public Procurement Portal, with bids received online.",
            ],
            [
              "L1 or QCBS",
              "Usually the cheapest qualified bid wins; quality and cost based selection blends quality and price where quality matters.",
            ],
            [
              "Bid security",
              "Normally 2–5% of the value. Small businesses and recognised startups are exempt.",
            ],
            [
              "Make in India",
              "Preference for suppliers with at least 50% local content, within a 20% price margin.",
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
        These are the central government&apos;s rules; states have their own procurement laws, often
        similar. MeitY publishes model tender documents for IT projects.
      </p>
      <p>
        This is an overview, not procurement advice: thresholds change by Office Memorandum, so
        check the current rules before a real purchase.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Abroad --------------------------------------------------------------------------------------- */

export function Abroad() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How other countries buy"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "UK: G-Cloud",
              "A catalogue of pre-approved cloud services on the Digital Marketplace. G-Cloud 15 (about £14 billion over four years) launched in 2026 under the Procurement Act 2023.",
            ],
            [
              "UK: a new agency",
              "Crown Commercial Service became the Government Commercial Agency on 1 April 2026.",
            ],
            [
              "US: FedRAMP",
              "Not a marketplace but a security certification cloud providers need to sell to federal agencies; renamed “FedRAMP Certified” with classes A to D in 2026.",
            ],
            [
              "The common thread",
              "Open competition, published decisions, and reusable approvals so every agency doesn't start from zero.",
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
        GeM and the UK&apos;s Digital Marketplace share an idea: let buyers choose from vetted
        sellers quickly, instead of running a full tender for every common purchase.
      </p>
      <p>For vendors, these routes are the door into government work, including for small firms.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function BuyCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="GeM or a tender?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-procurement"
            prompt="Which route fits each central government purchase?"
            categories={[
              { id: "gem", label: "GeM" },
              { id: "tender", label: "Open tender (CPPP)" },
            ]}
            items={[
              {
                id: "laptops",
                label: "Fifty standard laptops",
                category: "gem",
                why: "Common goods listed on GeM.",
              },
              {
                id: "portal",
                label: "A custom-built citizen services portal",
                category: "tender",
                why: "Custom work, not a catalogue item.",
              },
              {
                id: "paper",
                label: "A year's supply of printer paper",
                category: "gem",
                why: "A standard item.",
              },
              {
                id: "consult",
                label: "Consultants to redesign a licensing process",
                category: "tender",
                why: "Consultancy, often chosen by QCBS.",
              },
              {
                id: "cloud",
                label: "Cloud hosting from a MeitY-empanelled provider",
                category: "gem",
                why: "Empanelled cloud services are bought through GeM.",
              },
            ]}
            explanation="GeM is the marketplace for goods and services it lists, and buying there is mandatory for them. Custom systems, works and consultancy go to open tenders."
          />
        </div>
      }
    >
      <p>Sort each purchase.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Fair and open", "Public money needs a paper trail."],
        ["Two routes", "GeM for listed items; tenders for the rest."],
        ["Requirements decide", "Outcomes, not brand names."],
        ["Proportionate bidders", "Room for small firms and startups."],
        ["Pay for delivery", "Milestones and performance security."],
      ]}
    >
      <p>That ends the first chapter. Next: GIGW, the rulebook for government websites.</p>
    </WrapStep>
  );
}
