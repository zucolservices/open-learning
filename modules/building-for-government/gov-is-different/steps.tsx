"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FEATURES, PEOPLE, canFinish, type Feature } from "./model";
import type { DiffState } from "./state";

/* 2 ─ Build ⭐ ------------------------------------------------------------------------------------- */

export function WhoFinishes() {
  const [s, set] = useSceneState<DiffState>();
  const on = new Set(s.on as Feature[]);
  const done = PEOPLE.filter((p) => canFinish(p, on)).length;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Who can finish?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="grid gap-1.5">
            {PEOPLE.map((p) => {
              const ok = canFinish(p, on);
              return (
                <motion.div
                  key={p.id}
                  layout
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-1.5",
                    ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
                  )}
                >
                  {ok ? (
                    <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                  ) : (
                    <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                  )}
                  <span>
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-muted"> · {p.situation}</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
          <p className="text-muted">
            {done} of {PEOPLE.length} people can complete the service.
          </p>
          <div className="grid gap-1 sm:grid-cols-2">
            {FEATURES.map(([k, t, b]) => (
              <label
                key={k}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-2.5 py-1.5",
                  on.has(k) ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.has(k)}
                  onChange={() =>
                    set({ on: on.has(k) ? s.on.filter((x) => x !== k) : [...s.on, k] })
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
        </div>
      }
    >
      <p>
        A state is launching an online application for a welfare scheme. Five made-up people are
        eligible. As first designed, only the city graduate can finish.
      </p>
      <p>
        Add design choices until everyone can. A business may choose its customers; a public service
        has to close the <Term id="digital-divide">digital divide</Term> instead.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Numbers -------------------------------------------------------------------------------------- */

const NUMBERS: [string, string][] = [
  ["Internet subscriptions, March 2026 (TRAI)", "1,093 million: connections, not people"],
  ["Per 100 people, March 2026 (TRAI)", "127 in cities, 48 in villages"],
  ["Households with a smartphone, 2025 (MoSPI survey)", "85.5%"],
  ["Aadhaar numbers generated, Sept 2026 (UIDAI)", "145 crore, including people who have died"],
  ["Common Services Centres, mid-2026", "About 5.3 lakh"],
  ["Services in the UMANG app, Aug 2026", "About 2,575, central and state"],
];

export function Numbers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The scale, in numbers"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {NUMBERS.map(([t, v], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-muted text-[10px]">{t}</p>
              <p className="font-medium">{v}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Read numbers carefully. TRAI counts SIM connections, so one person with two SIMs counts
        twice, which is how cities reach more than 100 per 100 people. Household surveys ask people
        directly.
      </p>
      <p>
        Whatever the source, the gap between cities and villages is large, and it shapes every
        design decision in this track.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Rules ---------------------------------------------------------------------------------------- */

export function Accountable() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rules, accountability and audit"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Laws decide who is eligible",
              "Not the product team. Every rule in the service traces back to an Act, a rule or an order.",
            ],
            [
              "Spending is audited",
              "Purchases follow procurement rules, and auditors such as the CAG check them years later.",
            ],
            [
              "Citizens can ask",
              "The Right to Information Act lets anyone request how a decision was made.",
            ],
            [
              "Answerable to elected people",
              "Questions in Parliament and assemblies, and to the courts.",
            ],
            [
              "Systems live for decades",
              "Records must survive vendors, technologies and governments.",
            ],
            [
              "Nobody can switch",
              "There's no rival ration card office. A bad service just fails people.",
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
        These constraints aren&apos;t red tape for its own sake: they protect public money and
        people&apos;s rights. Good government technology works with them rather than around them.
      </p>
      <p>The rest of this track takes each one in turn, from procurement to records.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DiffCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fine for a shop, but for a government?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-different"
            prompt="Is each decision fine for a public service, or only for a business?"
            categories={[
              { id: "both", label: "Fine for both" },
              { id: "shop", label: "Only for a business" },
            ]}
            items={[
              {
                id: "app",
                label: "Offer a mobile app as one of several channels",
                category: "both",
                why: "Extra channels help.",
              },
              {
                id: "cities",
                label: "Serve only cities where it's profitable",
                category: "shop",
                why: "Every eligible person must be served.",
              },
              {
                id: "english",
                label: "Launch in English only",
                category: "shop",
                why: "Most citizens read other languages best.",
              },
              {
                id: "test",
                label: "Test two versions of a page to see which works better",
                category: "both",
                why: "Learning from use helps everyone.",
              },
              {
                id: "apponly",
                label: "Make the smartphone app the only way to apply",
                category: "shop",
                why: "It excludes people without smartphones.",
              },
            ]}
            explanation="A business can choose its customers and channels. A public service must work for every eligible person, so it offers several languages and channels and doesn't drop people who are hard to reach."
          />
        </div>
      }
    >
      <p>Sort each decision.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Everyone is a user", "And nobody can go elsewhere."],
        ["Many channels", "Online, phone, service centres, offices."],
        ["Languages and devices", "Design for the village as well as the city."],
        ["Fallbacks for identity", "When the OTP can't arrive."],
        ["Answerable", "To laws, auditors, courts and citizens."],
      ]}
    >
      <p>Next: the shared digital rails that services are built on.</p>
    </WrapStep>
  );
}
