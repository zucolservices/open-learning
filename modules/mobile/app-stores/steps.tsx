"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ISSUES } from "./model";
import type { StoreReviewState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Market() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The market inspector"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["The stall", "The market gives you a pitch, crowds and a card machine."],
            ["The rules", "Food labelled, prices shown, hygiene checked before you open."],
            ["The rent", "A share of every sale paid through the market's machine."],
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
        Selling at a big covered market brings crowds, but an inspector checks your stall before you
        open, and the market takes a cut.
      </p>
      <p>
        Apple&apos;s App Store and Google Play work the same way:{" "}
        <Term id="app-review">app review</Term> checks each release, and the stores take a
        commission on digital sales. Recent laws in some regions now allow other stalls and other
        card machines.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Review() {
  const [s, set] = useSceneState<StoreReviewState>();
  const open = ISSUES.filter((i) => !s.submitted.includes(i.id));
  const approved = s.rounds > 0 && open.length === 0;
  const submit = () => set({ submitted: s.fixed, rounds: s.rounds + 1 });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Submit, get rejected, fix"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={submit}
              className="bg-accent text-accent-fg rounded-full px-3 py-1 font-medium"
            >
              {s.rounds ? "Resubmit for review" : "Submit to both stores"}
            </button>
            <button
              type="button"
              onClick={() => set({ fixed: [], submitted: [], rounds: 0 })}
              className="text-muted"
            >
              Start over
            </button>
            {s.rounds > 0 && <span className="text-subtle">Submission {s.rounds}</span>}
          </div>
          {s.rounds === 0 ? (
            <p className="border-line bg-surface-2 rounded-lg border px-3 py-2">
              The café app is ready, or so the team thinks. Submit it.
            </p>
          ) : approved ? (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-good/50 bg-good/10 flex items-center gap-2 rounded-lg border px-3 py-2"
            >
              <Check className="text-good size-4" /> Approved on both stores. Release when ready.
            </motion.p>
          ) : (
            <div className="grid gap-1.5">
              <p className="text-bad font-medium">
                Rejected: {open.length} issue{open.length > 1 ? "s" : ""} found
              </p>
              {open.map((i) => {
                const done = s.fixed.includes(i.id);
                return (
                  <div
                    key={i.id}
                    className={cn(
                      "rounded-lg border px-3 py-2",
                      done ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
                    )}
                  >
                    <p>
                      <span className="text-muted mr-1.5 text-[10px] font-medium">
                        {i.store === "Both" ? "Apple + Google" : i.store}
                      </span>
                      {i.rejection}
                    </p>
                    <button
                      type="button"
                      aria-pressed={done}
                      onClick={() =>
                        set({
                          fixed: done ? s.fixed.filter((x) => x !== i.id) : [...s.fixed, i.id],
                        })
                      }
                      className={cn(
                        "mt-1 rounded-full border px-2.5 py-0.5 text-[11px]",
                        done ? "border-good text-good" : "border-line-strong",
                      )}
                    >
                      {done ? "Fixed · undo" : i.fix}
                    </button>
                  </div>
                );
              })}
              <p className="text-muted">
                Fix what you can, then resubmit. Only fixed issues count.
              </p>
            </div>
          )}
        </div>
      }
    >
      <p>
        Submit the café app, read the rejections, fix them and resubmit. A review can take anywhere
        from hours to several days; there&apos;s no limit on rounds.
      </p>
      <p>
        Apple&apos;s 2025 transparency report: about 9.1 million submissions reviewed and 2.1
        million rejected, most often for crashes, bugs and missing information, not content.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Fees ----------------------------------------------------------------------------------------- */

export function Fees() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fees and payments"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Physical goods are outside it",
              "Food orders, taxis and event tickets can use any payment provider; the stores take nothing.",
            ],
            [
              "Apple, most regions",
              "30% on digital sales, 15% for developers under US$1M a year and for subscriptions after the first year.",
            ],
            [
              "Google, most regions (including India)",
              "15% on the first US$1M a year, then 30%, until September 2027.",
            ],
            [
              "Google, US, UK and EEA",
              "A new structure since June 2026: lower service fees plus a separate 5% fee for using Google Play's billing.",
            ],
            [
              "Apple, EU",
              "From 1 October 2026: 26% through Apple's payments, 20% with another provider, 15% for purchases via a link out.",
            ],
            [
              "Apple, US",
              "Links to the web for purchases carry no commission while courts settle the dispute; the Supreme Court is due to rule by mid-2027.",
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
        Store fees, paid through <Term id="in-app-purchase">in-app purchase</Term>, apply to digital
        goods and features used inside the app: premium content, subscriptions, game currency.
        Real-world goods and services are exempt.
      </p>
      <p>
        These rules are changing fast, region by region. Check the stores&apos; current terms before
        planning a business model; the figures here are as of October 2026.
      </p>
    </StepLayout>
  );
}

/* 4 ─ New rules ------------------------------------------------------------------------------------ */

export function NewRules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="New rules and other stores"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "EU",
              "Since iOS 17.4 (March 2024), the Digital Markets Act allows alternative iPhone app marketplaces and payments.",
            ],
            ["Japan", "A new competition law brought similar options in December 2025."],
            [
              "United States",
              "Court rulings against Apple and Google opened links to outside payments in 2025.",
            ],
            [
              "Android verification",
              "From 30 September 2026, in four countries first, certified Android phones only install apps from verified developers, even outside Play. The rest of the world follows in 2027.",
            ],
            [
              "Technical minimums",
              "Uploads to Apple need Xcode 26 (since April 2026); Play updates must target Android 16 (since August 2026).",
            ],
            [
              "Still reviewed",
              "Apps on alternative iOS marketplaces are still checked by Apple; Play Protect scans apps installed from elsewhere.",
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
        Both stores also raise their minimum tool and target versions every year, so even an app
        that never changes needs regular updates to stay listed for new users.
      </p>
      <p>Put the yearly deadlines in the team calendar.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function StoreCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Whose checkout?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-billing"
            prompt="In most regions, which purchases must go through the store's in-app purchase?"
            categories={[
              { id: "store", label: "Store's in-app purchase" },
              { id: "own", label: "Any payment provider" },
            ]}
            items={[
              {
                id: "dosa",
                label: "A masala dosa delivered to your door",
                category: "own",
                why: "A physical good.",
              },
              {
                id: "plus",
                label: "Café Plus: a monthly digital membership with app perks",
                category: "store",
                why: "A digital subscription used in the app.",
              },
              {
                id: "class",
                label: "A ticket to an in-person cooking class",
                category: "own",
                why: "A real-world service.",
              },
              {
                id: "adfree",
                label: "Removing ads from the app",
                category: "store",
                why: "A digital feature.",
              },
              {
                id: "tip",
                label: "A tip for the delivery rider",
                category: "own",
                why: "Payment for a real-world service.",
              },
            ]}
            explanation="Digital goods and features used in the app go through store billing by default; physical goods and real-world services don't. The EU, Japan and US now allow alternatives under conditions."
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
        ["Every release is reviewed", "Crashes and missing info cause most rejections."],
        ["Help the reviewer", "Demo accounts and clear notes."],
        ["Declare data honestly", "Including your SDKs."],
        ["Digital goods pay a fee", "Physical goods don't."],
        ["Rules vary by region", "And change every year."],
      ]}
    >
      <p>Next: shipping updates safely.</p>
    </WrapStep>
  );
}
