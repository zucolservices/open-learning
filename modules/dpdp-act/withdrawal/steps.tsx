"use client";

import { motion } from "motion/react";
import { DoorOpen, Check, X, ArrowRight, Users, ShieldCheck, Building } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CM_FACTS, EXITS, HOPS } from "./model";
import type { WithdrawState } from "./state";

/* 1 ─ Story: leaving the gym ----------------------------------------------------------------------- */

export function LeavingTheGym() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Joining is one tap. Leaving?"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
            <div className="border-good/50 bg-good/10 rounded-xl border p-3 text-xs">
              <p className="font-semibold">Join</p>
              <p className="text-muted mt-1">Tap “Start membership” in the app.</p>
            </div>
            <div className="border-bad/50 bg-bad/10 rounded-xl border p-3 text-xs">
              <DoorOpen className="text-bad size-4" />
              <p className="mt-1 font-semibold">Leave</p>
              <p className="text-muted mt-1">
                Visit the branch in person, with a signed letter, in the first week of a month.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Most of us know the gym that takes one tap to join and a signed letter, in person, to leave.
        The imbalance is the point: they hope you won&apos;t bother.
      </p>
      <p>
        The DPDP Act forbids that for consent. A person can{" "}
        <Term id="withdrawal">withdraw consent</Term> at any time, and doing so must be about as
        easy as giving it was. The organisation must then stop, and make its vendors stop, within a
        reasonable time. These duties apply from May 2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Follow the stop signal ⭐ -------------------------------------------------------------------- */

export function StopSignal() {
  const [s, set] = useSceneState<WithdrawState>();
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Follow the stop signal"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">
            Asha withdraws consent for marketing SMS on GharKaam (made up)
          </p>
          <ol className="grid gap-1.5">
            {HOPS.map((h, i) => {
              const on = i <= s.hop;
              return (
                <motion.li
                  key={h.id}
                  animate={{ opacity: on ? 1 : 0.25 }}
                  className={cn(
                    "grid grid-cols-[1.25rem_8.5rem_1fr] items-start gap-2 rounded-lg border px-2.5 py-1.5 text-xs",
                    !on && "border-line",
                    on && h.outcome === "stop" && "border-accent/50 bg-accent-soft",
                    on && h.outcome === "keep" && "border-line-strong bg-surface-2",
                    i === s.hop && "ring-accent ring-1",
                  )}
                >
                  <span className="text-accent font-mono">{i + 1}</span>
                  <span className="font-medium">{h.system}</span>
                  <span>
                    {h.action}
                    {on && (
                      <span className="text-muted mt-0.5 block text-[11px]">
                        <strong className={h.outcome === "stop" ? "text-accent" : "text-fg"}>
                          {h.outcome === "stop" ? "Stops." : "Continues."}
                        </strong>{" "}
                        {h.why}
                      </span>
                    )}
                  </span>
                </motion.li>
              );
            })}
          </ol>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={s.hop >= HOPS.length - 1}
              onClick={() => set({ hop: s.hop + 1 })}
              className="bg-accent text-accent-fg inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Send it on <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => set({ hop: 0 })}
              className="border-line text-muted rounded-full border px-4 py-1.5 text-xs"
            >
              Start over
            </button>
          </div>
        </div>
      }
    >
      <p>
        Withdrawal is easy to promise and hard to build. The signal has to reach every system and
        vendor that relied on the consent, while leaving alone the processing that doesn&apos;t
        depend on it.
      </p>
      <p>
        The Act sets no number of days, only &ldquo;a reasonable time&rdquo;. Withdrawal also
        doesn&apos;t make earlier processing unlawful, and the person bears the consequences: an app
        can stop offering features that genuinely need the consent.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Consent managers ----------------------------------------------------------------------------- */

export function ConsentManagers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="One place to manage every yes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center justify-center gap-2 text-xs">
            <div className="border-line bg-surface flex flex-col items-center rounded-lg border px-3 py-2">
              <Users className="text-accent size-4" />
              <span>Person</span>
            </div>
            <ArrowRight className="text-subtle size-4" />
            <div className="border-accent bg-accent-soft flex flex-col items-center rounded-lg border px-3 py-2">
              <ShieldCheck className="text-accent size-4" />
              <span>Consent manager</span>
            </div>
            <ArrowRight className="text-subtle size-4" />
            <div className="flex flex-col gap-1">
              {["Bank", "Clinic", "Shop"].map((x) => (
                <div
                  key={x}
                  className="border-line bg-surface flex items-center gap-1 rounded-md border px-2 py-0.5"
                >
                  <Building className="text-subtle size-3" />
                  {x}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {CM_FACTS.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="text-accent font-medium">{k}</p>
                <p>{v}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            As of October 2026 no consent manager is registered. Registration starts 13 November
            2026; the right to use one starts with the core duties in May 2027.
          </p>
        </div>
      }
    >
      <p>
        A <Term id="consent-manager">consent manager</Term> is a registered platform that lets a
        person give, review and withdraw consent across many organisations in one place. It is
        accountable to the person, not to the companies.
      </p>
      <p>
        If that sounds familiar, it echoes India&apos;s Account Aggregators, which pass financial
        data between banks with the customer&apos;s consent without reading it. They are a separate
        system regulated by the RBI, but the &ldquo;data-blind&rdquo; idea is the same.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Comparable ease ------------------------------------------------------------------------------ */

export function ComparableEase() {
  const [s, set] = useSceneState<WithdrawState>();
  const e = EXITS.find((x) => x.id === s.exit) ?? EXITS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Is the way out as easy as the way in?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">
            Consent was given with one tap. The way out is…
          </p>
          <div className="grid gap-1.5">
            {EXITS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === s.exit}
                onClick={() => set({ exit: x.id })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition",
                  x.id === s.exit
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
              e.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            {e.ok ? <Check className="text-good size-4" /> : <X className="text-bad size-4" />}
            <span>
              <strong>{e.ok ? "Comparable." : "Not comparable."}</strong> {e.why}
            </span>
          </motion.div>
        </div>
      }
    >
      <p>
        &ldquo;Comparable ease&rdquo; is judged against how consent was given. If a single tap gave
        it, a single tap should take it back. Extra steps, waiting periods and office hours fail the
        test.
      </p>
      <p>
        Build the withdraw control next to where consent was given, and make it trigger the same
        pipeline you just followed.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function WithdrawCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Stop or carry on?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-withdraw"
            prompt="After a customer withdraws consent for marketing, what happens to each?"
            categories={[
              { id: "stop", label: "Must stop" },
              { id: "keep", label: "May continue" },
            ]}
            items={[
              {
                id: "sms",
                label: "Promotional SMS campaigns to that customer",
                category: "stop",
                why: "They relied on the withdrawn consent.",
              },
              {
                id: "vendor",
                label: "The SMS vendor's marketing list containing the number",
                category: "stop",
                why: "Processors must be made to stop too.",
              },
              {
                id: "paid",
                label: "Delivering an order the customer already paid for",
                category: "keep",
                why: "The Act's own illustration allows it.",
              },
              {
                id: "invoice",
                label: "Keeping the tax invoice for that order",
                category: "keep",
                why: "Required or authorised by law.",
              },
              {
                id: "profile",
                label: "A marketing-interest profile built from consented data",
                category: "stop",
                why: "Kept only for the withdrawn purpose, so erase it.",
              },
              {
                id: "past",
                label: "Last month's campaigns, sent while consent was valid",
                category: "keep",
                why: "Withdrawal doesn't make past processing unlawful.",
              },
            ]}
            explanation="Stop everything that relied on the withdrawn consent, at your vendors too; keep what other grounds or laws require, and what was already agreed."
          />
        </div>
      }
    >
      <p>Sort each item.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Any time, as easily as given", "One tap in means one tap out."],
  ["Stop everywhere", "Within a reasonable time, at your processors too."],
  ["Not retroactive", "Past processing stays lawful; paid orders can be fulfilled."],
  ["Law still applies", "Processing required or authorised by law can continue."],
  ["Consent managers", "Registered, data-blind platforms working for the person."],
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
      <p>
        Next: the processing that doesn&apos;t need consent at all, the Act&apos;s legitimate uses.
      </p>
    </StepLayout>
  );
}
