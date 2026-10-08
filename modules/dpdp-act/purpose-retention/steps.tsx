"use client";

import { motion } from "motion/react";
import { Shirt, Ticket } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CLASSES, END, HOLDS, LANES, LAST_SEEN, START, clock, label } from "./model";
import type { RetainState } from "./state";

/* 1 ─ Story: the cloakroom ------------------------------------------------------------------------- */

export function Cloakroom() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The cloakroom"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-4">
            <div className="border-line bg-surface flex flex-col items-center rounded-xl border p-3">
              <Shirt className="text-accent size-6" />
              <p className="mt-1 text-xs">Your coat</p>
            </div>
            <div className="border-accent bg-accent-soft flex flex-col items-center rounded-xl border p-3">
              <Ticket className="text-accent size-6" />
              <p className="mt-1 text-xs">Token 42</p>
            </div>
          </div>
          <p className="text-subtle max-w-xs text-center text-[11px]">
            Kept while you&apos;re at the event. Returned when you leave. Not kept for a year in
            case you come back.
          </p>
        </div>
      }
    >
      <p>
        At a wedding hall&apos;s cloakroom you hand over your coat and get a token. The cloakroom
        keeps the coat for one purpose: while you&apos;re at the event. When you leave, there&apos;s
        no reason for them to keep it.
      </p>
      <p>
        The DPDP Act treats personal data the same way. It may be kept only while it serves the
        purpose it was collected for. Once consent is withdrawn or the purpose is no longer served,
        it must be erased, at your processors too, unless another law requires keeping it. This is{" "}
        <Term id="purpose-limitation">purpose limitation</Term>, and it applies from May 2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The retention clock ⭐ ----------------------------------------------------------------------- */

const pct = (m: number) => `${(Math.min(Math.max(m, START), END) / END) * 100}%`;

export function RetentionClock() {
  const [s, set] = useSceneState<RetainState>();
  const seen = LAST_SEEN.find((x) => x.id === s.lastSeen) ?? LAST_SEEN[1];
  const c = clock(seen.at, s.returns);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Run the retention clock"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">
            BazaarKart, a made-up shop with over 2 crore users
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs">Last seen:</span>
            {LAST_SEEN.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === s.lastSeen}
                onClick={() => set({ lastSeen: x.id })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  x.id === s.lastSeen
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.returns}
              onChange={(e) => set({ returns: e.target.checked })}
              className="accent-accent"
            />
            The user logs in after getting the 48-hour warning
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="mb-1 grid grid-cols-[8.5rem_1fr] gap-2">
              <span />
              <div className="text-subtle relative h-3 font-mono text-[9px]">
                {[2027, 2029, 2031, 2033, 2035].map((y) => (
                  <span
                    key={y}
                    className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
                    style={{ left: pct((y - 2027) * 12) }}
                  >
                    {y}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-1">
              {LANES.map((l) => {
                const end = l.after === "kept" ? END : c.expiry + l.after;
                return (
                  <div
                    key={l.id}
                    className="grid grid-cols-[8.5rem_1fr] items-center gap-2 text-[10px]"
                  >
                    <span className="truncate" title={l.label}>
                      {l.label}
                    </span>
                    <div className="bg-surface-2 relative h-3 rounded-full">
                      <div
                        className={cn(
                          "absolute inset-y-0 rounded-full transition-all duration-500",
                          l.after === 0
                            ? "bg-viz-data"
                            : l.after === "kept"
                              ? "bg-viz-meta"
                              : "bg-viz-idle",
                        )}
                        style={{ left: pct(seen.at), width: `calc(${pct(end)} - ${pct(seen.at)})` }}
                      />
                      <div
                        className="bg-bad absolute inset-y-[-3px] w-0.5"
                        style={{ left: pct(c.expiry) }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-1 text-xs sm:grid-cols-3">
            <div className="border-line rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Clock starts</p>
              <p className="font-semibold">{label(c.start)}</p>
            </div>
            <div className="border-line rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Warning sent</p>
              <p className="font-semibold">{c.warnBy}</p>
            </div>
            <div className="border-bad/50 bg-bad/10 rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Erase purpose data</p>
              <p className="font-semibold">{label(c.expiry)}</p>
            </div>
          </div>
          {c.restartedAt !== undefined && (
            <p className="text-xs">
              Logging in resets the clock: three more years from {label(c.restartedAt)}.
            </p>
          )}
        </div>
      }
    >
      <p>
        For the biggest platforms the Rules set a concrete clock. If a user hasn&apos;t come back or
        used their rights for three years, the platform must erase their data, after warning them at
        least 48 hours before.
      </p>
      <p>
        The clock starts at the latest of the user&apos;s last visit, their last use of a right, and
        the Rules&apos; commencement. The Rules don&apos;t say which commencement date counts, so
        this simulation uses the cautious one, May 2027. Messages the platform sends don&apos;t
        reset it; only the user coming back does. The bars show which slices survive, and why.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Who has a fixed clock? ----------------------------------------------------------------------- */

export function WhoHasAClock() {
  const [s, set] = useSceneState<RetainState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="A fixed clock, or your own judgement?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.big ? "big" : "small"}
            onChange={(v) => set({ big: v === "big" })}
            options={[
              ["big", "A platform in the Third Schedule"],
              ["small", "Everyone else"],
            ]}
            size="sm"
          />
          {s.big ? (
            <div className="grid gap-1.5">
              {CLASSES.map((c) => (
                <div
                  key={c.cls}
                  className="border-line bg-surface grid grid-cols-[1fr_auto] gap-2 rounded-lg border px-3 py-2 text-xs"
                >
                  <span>
                    <span className="font-semibold">{c.cls}</span>
                    <span className="text-muted block">{c.users}</span>
                  </span>
                  <span className="text-accent self-center font-semibold">{c.period}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-line bg-surface rounded-xl border p-4 text-sm">
              <p className="font-semibold">No fixed period. Erase when:</p>
              <ul className="mt-2 grid gap-1 text-xs">
                <li>• the person withdraws consent, or</li>
                <li>• it&apos;s reasonable to assume the purpose is no longer served,</li>
                <li>• whichever comes first, unless a law requires keeping it.</li>
              </ul>
              <p className="text-muted mt-3 text-xs">
                So you set your own retention periods per purpose, write them down, and automate
                them.
              </p>
            </div>
          )}
        </div>
      }
    >
      <p>
        The three-year clock is only for three kinds of large platform listed in the Rules&apos;
        Third Schedule. A clinic app, a learning app or a small online shop has no fixed number.
      </p>
      <p>
        For everyone else, section 8(7) applies: decide how long each purpose genuinely needs, then
        erase. &ldquo;We might need it someday&rdquo; is not a purpose.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Laws that keep data alive -------------------------------------------------------------------- */

export function LegalHolds() {
  const max = Math.max(...HOLDS.map((h) => h.years));
  return (
    <StepLayout
      eyebrow="Explore"
      title="Laws that keep data alive"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {HOLDS.map((h, i) => (
            <div key={h.law} className="grid gap-1 text-xs">
              <div className="flex justify-between gap-2">
                <span>
                  <span className="font-semibold">{h.law}</span> · {h.what}
                </span>
                <span className="text-muted shrink-0">{h.note}</span>
              </div>
              <div className="bg-surface-2 h-2.5 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(h.years / max) * 100}%` }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="bg-viz-meta h-full rounded-full"
                />
              </div>
            </div>
          ))}
          <p className="text-subtle mt-1 text-[10px]">
            Simplified. Each law has its own conditions; check the one that applies to you.
          </p>
        </div>
      }
    >
      <p>
        Erasure has one big exception: data you must keep to comply with another law. Tax,
        anti-money laundering and cyber-security rules all set their own periods.
      </p>
      <p>
        A legal hold keeps only the slice that law needs, for as long as it needs it. Keeping
        invoices for GST doesn&apos;t justify keeping a customer&apos;s browsing history.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function RetainCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Erase or keep?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-retain"
            prompt="BazaarKart's three-year clock has run out for an inactive user. What happens to each?"
            categories={[
              { id: "erase", label: "Erase" },
              { id: "keep", label: "Keep for now" },
            ]}
            items={[
              {
                id: "history",
                label: "Their order history",
                category: "erase",
                why: "The purpose is no longer served.",
              },
              {
                id: "login",
                label: "Their login, so they can still get back into their account",
                category: "keep",
                why: "Account access is carved out.",
              },
              {
                id: "wallet",
                label: "A ₹300 wallet balance they haven't spent",
                category: "keep",
                why: "Stored value is carved out.",
              },
              {
                id: "invoice",
                label: "An invoice still inside the GST record period",
                category: "keep",
                why: "Required by another law.",
              },
              {
                id: "recs",
                label: "Their product-recommendation profile",
                category: "erase",
                why: "Only served the purpose that has ended.",
              },
              {
                id: "vendor",
                label: "The copy their email vendor holds for campaigns",
                category: "erase",
                why: "Processors must erase too.",
              },
            ]}
            explanation="Erase what only served the purpose, everywhere; keep only the slices that the account carve-outs or another law require."
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
  ["Keep it only for the purpose", "Then erase, at processors too."],
  ["Withdrawal or purpose served", "Whichever comes first."],
  ["Big platforms: three years", "With a 48-hour warning first."],
  ["Other laws can hold slices", "Only the slice, only for the period."],
  ["Automate it", "Retention you have to remember won't happen."],
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
      <p>Next: keeping it safe while you have it. The security safeguards in Rule 6.</p>
    </StepLayout>
  );
}
