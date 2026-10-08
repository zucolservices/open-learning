"use client";

import { motion } from "motion/react";
import { Package, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HISTORY, KINDS, REGION_LABEL, SECTORS, verdict, type Region } from "./model";
import type { BorderState } from "./state";

/* 1 ─ Story: posting a parcel abroad --------------------------------------------------------------- */

export function Parcel() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Posting a parcel abroad"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Package className="text-accent size-10" />
          <div className="grid w-full max-w-sm gap-1.5 text-xs">
            <div className="border-good/50 bg-good/10 rounded-lg border px-3 py-1.5">
              Most countries: fine to send
            </div>
            <div className="border-bad/50 bg-bad/10 rounded-lg border px-3 py-1.5">
              A few restricted destinations: not allowed
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              Some items have their own rules, wherever they go
            </div>
          </div>
        </div>
      }
    >
      <p>
        At the post office you can send a parcel almost anywhere. A short list of destinations is
        restricted, and some items, like medicines, have their own rules whatever the destination.
      </p>
      <p>
        The DPDP Act treats <Term id="cross-border-transfer">cross-border transfers</Term> the same
        way. From May 2027, personal data may go to any country unless the government restricts that
        country, and as of October 2026 none is restricted. Sector rules that are stricter, like the
        RBI&apos;s rule on payment data, still apply.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Route the data ⭐ ---------------------------------------------------------------------------- */

const REGIONS: Region[] = ["india", "singapore", "eu", "us", "x"];

export function RouteData() {
  const [s, set] = useSceneState<BorderState>();
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Route a fintech's data"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-[10px] uppercase">
            PaisaPal, a made-up payments app · pick where each kind of data lives
          </p>
          {KINDS.map((k) => {
            const r = s.routes[k.id];
            const v = verdict(k.id, r);
            return (
              <div
                key={k.id}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5",
                  v.ok ? "border-line bg-surface" : "border-bad/50 bg-bad/10",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-xs font-medium">{k.label}</span>
                  <span className="flex flex-wrap gap-1">
                    {REGIONS.map((rg) => (
                      <button
                        key={rg}
                        type="button"
                        aria-pressed={r === rg}
                        aria-label={`${k.label} in ${REGION_LABEL[rg]}`}
                        onClick={() => set({ routes: { ...s.routes, [k.id]: rg } })}
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px]",
                          r === rg
                            ? "border-accent bg-accent text-accent-fg"
                            : "border-line-strong text-muted",
                        )}
                      >
                        {REGION_LABEL[rg]}
                      </button>
                    ))}
                  </span>
                </div>
                <p className="mt-0.5 flex items-start gap-1 text-[11px]">
                  {v.ok ? (
                    <Check className="text-good mt-0.5 size-3 shrink-0" />
                  ) : (
                    <X className="text-bad mt-0.5 size-3 shrink-0" />
                  )}
                  <span>
                    <span className="text-subtle font-mono">{v.rule}</span> {v.why}
                  </span>
                </p>
              </div>
            );
          })}
          <p className="text-subtle text-[10px]">
            *Country X is hypothetical: no country has been restricted.
          </p>
        </div>
      }
    >
      <p>
        PaisaPal runs on cloud servers and could put each kind of data in any region. Move them
        around and see which placements the rules allow.
      </p>
      <p>
        You&apos;ll notice the DPDP Act rarely says no on its own. The restrictions a fintech hits
        come from its sector regulator. A Significant Data Fiduciary could also be told to keep
        specified data in India, but no data has been specified yet.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How the approach changed --------------------------------------------------------------------- */

export function History() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="From 'mirror everything' to a negative list"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {HISTORY.map((h, i) => (
            <motion.div
              key={h.year}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className={cn(
                "grid grid-cols-[3rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-xs",
                h.year === "2023" ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <span className="text-accent font-mono">{h.year}</span>
              <span>
                <span className="font-semibold">{h.title}.</span> {h.body}
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Data localisation was one of the most argued-over parts of the law. Early drafts wanted
        copies of everything kept in India; the final Act went the other way.
      </p>
      <p>
        Rule 15 adds one more lever: the government can set requirements before data is made
        available to a foreign government or its agencies. No such order has been issued.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Sector rules --------------------------------------------------------------------------------- */

export function SectorRules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where sector rules step in"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {SECTORS.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[8rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{k}</span>
              <span>{v}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Section 16(2) says the DPDP Act doesn&apos;t weaken any other law that gives a higher degree
        of protection or restriction on transfers. So check your sector before choosing a region.
      </p>
      <p>
        Practical habit: put disaster-recovery copies in a second Indian region (cloud providers
        have several), and keep a register of which data lives where.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function BorderCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Can it go abroad?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-border"
            prompt="From May 2027, is each placement allowed?"
            categories={[
              { id: "ok", label: "Allowed" },
              { id: "no", label: "Not allowed" },
            ]}
            items={[
              {
                id: "profiles",
                label: "A shopping app's user profiles in a Frankfurt cloud region",
                category: "ok",
                why: "No country is restricted.",
              },
              {
                id: "pay",
                label: "A payments app's transaction database replicated to Singapore",
                category: "no",
                why: "RBI: payment data stored only in India.",
              },
              {
                id: "logs",
                label: "Web server logs in the US, producible to CERT-In on request",
                category: "ok",
                why: "Allowed under CERT-In's FAQ.",
              },
              {
                id: "claims",
                label: "An insurer's claim records in a US data centre",
                category: "no",
                why: "IRDAI: records in India.",
              },
              {
                id: "stats",
                label: "Anonymous aggregate statistics analysed abroad",
                category: "ok",
                why: "Not personal data.",
              },
              {
                id: "notified",
                label: "Any data sent to a country the government has restricted",
                category: "no",
                why: "s.16(1), if a country is ever notified.",
              },
            ]}
            explanation="DPDP allows transfers unless a country is restricted. Sector rules (RBI, IRDAI, SEBI, government cloud) can still require data to stay in India."
          />
        </div>
      }
    >
      <p>Sort each placement.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["A negative list", "Allowed anywhere unless restricted; none restricted yet."],
  ["Sector rules still bite", "RBI, IRDAI, SEBI, government cloud."],
  ["Responsibility travels", "Safeguards and contracts apply abroad too."],
  ["Possible SDF localisation", "Only for data the government specifies."],
  ["DR in India for regulated data", "Use a second Indian region."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: the exemptions in section 17, where the Act steps back.</p>
    </StepLayout>
  );
}
