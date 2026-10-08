"use client";

import { motion } from "motion/react";
import { Check, X, Handshake } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { QUALITIES, SWITCHES, assess } from "./model";
import type { ConsentState } from "./state";

/* 1 ─ Story: a yes that counts --------------------------------------------------------------------- */

const YESES: [string, boolean][] = [
  ["“Yes, you can borrow my bike on Sunday.”", true],
  ["Silence, because they didn't hear the question", false],
  ["“Fine, if I must, or you won't lend me the notes.”", false],
  ["“Yes to the bike” taken as yes to the car too", false],
];

export function AYes() {
  return (
    <StepLayout
      eyebrow="Story"
      title="What counts as a yes?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {YESES.map(([t, ok], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                ok ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              {ok ? (
                <Check className="text-good size-4 shrink-0" />
              ) : (
                <X className="text-bad size-4 shrink-0" />
              )}
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A friend asks to borrow your bike on Sunday and you say yes. That&apos;s a real yes: you
        knew what was asked, you chose freely, and it was about the bike, on Sunday. Silence, a yes
        under pressure, or stretching &ldquo;the bike&rdquo; to mean &ldquo;the car&rdquo; are not.
      </p>
      <p>
        The DPDP Act asks the same of <Term id="consent">consent</Term>. It must be free, specific,
        informed, unconditional and unambiguous, given by a clear action, and limited to the data
        needed for the stated purpose. These rules apply from May 2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Design the screen ⭐ ------------------------------------------------------------------------- */

export function Designer() {
  const [s, set] = useSceneState<ConsentState>();
  const d = s.design;
  const findings = assess(d);
  const broken = new Set(findings.map((f) => f.quality));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Design the sign-up screen"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-1.5">
            {SWITCHES.map((sw) => (
              <div key={sw.id} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <p className="text-muted text-[10px] uppercase">{sw.label}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {[false, true].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      aria-pressed={d[sw.id] === v}
                      onClick={() => set({ design: { ...d, [sw.id]: v } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[11px] transition",
                        d[sw.id] === v
                          ? v
                            ? "border-bad bg-bad/15"
                            : "border-accent bg-accent text-accent-fg"
                          : "border-line-strong text-muted hover:text-fg",
                      )}
                    >
                      {v ? sw.on : sw.off}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="border-line bg-surface rounded-xl border p-3 text-xs">
              <p className="text-sm font-semibold">Join GharKaam</p>
              <p className="text-muted text-[10px]">A made-up home-services app</p>
              <div className="mt-2 grid gap-1">
                {(d.bundled
                  ? ["Bookings, offers and partner marketing"]
                  : ["Bookings (needed)", "Offers by SMS", "Partner marketing"]
                ).map((p, i) => (
                  <label key={p} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "grid size-3.5 place-items-center rounded-sm border",
                        d.preTicked || (d.conditional && i > 0 && !d.bundled)
                          ? "border-accent bg-accent"
                          : "border-line-strong",
                      )}
                    >
                      {(d.preTicked || (d.conditional && i > 0 && !d.bundled)) && (
                        <Check className="text-accent-fg size-2.5" />
                      )}
                    </span>
                    {p}
                    {d.conditional && i > 0 && !d.bundled && (
                      <span className="text-bad text-[10px]">required</span>
                    )}
                  </label>
                ))}
                {d.contacts && <p className="text-bad">Allow access to your contacts</p>}
                {d.waiver && (
                  <p className="text-subtle text-[9px]">
                    By joining I waive my right to complain to the Data Protection Board.
                  </p>
                )}
              </div>
              <div className="mt-2 flex gap-1.5">
                <span className="bg-accent text-accent-fg rounded-md px-3 py-1 font-medium">
                  Agree
                </span>
                <span
                  className={cn(
                    "rounded-md border px-3 py-1",
                    d.lopsided ? "text-subtle border-transparent text-[9px]" : "border-line-strong",
                  )}
                >
                  {d.lopsided ? "No, I like paying more" : "Decline"}
                </span>
              </div>
            </div>
            <div className="grid gap-1">
              {QUALITIES.map((q) => {
                const ok = !broken.has(q.id);
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-2 py-1 text-[11px]",
                      ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {ok ? (
                        <Check className="text-good size-3" />
                      ) : (
                        <X className="text-bad size-3" />
                      )}
                      {q.label}
                    </span>
                    <span className="text-subtle font-mono">{q.clause}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {findings.length > 0 && (
            <ul className="text-muted grid gap-0.5 text-[11px] lg:col-span-2">
              {findings.map((f) => (
                <li key={f.quality}>• {f.why}</li>
              ))}
            </ul>
          )}
        </div>
      }
    >
      <p>
        This sign-up screen starts with every bad habit switched on. Flip each switch and watch the
        qualities of valid consent turn green.
      </p>
      <p>
        The Act doesn&apos;t mention pre-ticked boxes or dark patterns by name. They fail because of
        its wording: a pre-ticked box isn&apos;t a clear action, and one box for everything
        isn&apos;t specific. India&apos;s consumer-protection rules ban pre-ticked consent outright.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The Act's two examples ---------------------------------------------------------------------- */

const EXAMPLES = {
  telemedicine: {
    asked: ["Use my data to provide telemedicine", "Read my phone's contact list"],
    kept: [true, false],
    rule: "s.6(1) illustration",
    body: "The person agrees to both, but the consent is limited to what the telemedicine service needs. The contact-list part never takes effect.",
  },
  insurance: {
    asked: [
      "Use my data to issue my policy",
      "Waive my right to complain to the Data Protection Board",
    ],
    kept: [true, false],
    rule: "s.6(2) illustration",
    body: "Consent to give up a legal right is invalid to that extent. The policy consent survives; the waiver doesn't.",
  },
} as const;

export function ActExamples() {
  const [s, set] = useSceneState<ConsentState>();
  const e = EXAMPLES[s.example];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Part of a yes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.example}
            onChange={(v) => set({ example: v })}
            options={[
              ["telemedicine", "A telemedicine app"],
              ["insurance", "An insurer"],
            ]}
            size="sm"
          />
          <div className="grid gap-1.5">
            {e.asked.map((a, i) => (
              <motion.div
                key={s.example + a}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                  e.kept[i]
                    ? "border-good/50 bg-good/10"
                    : "border-bad/50 bg-bad/10 decoration-bad/60 line-through",
                )}
              >
                {e.kept[i] ? (
                  <Check className="text-good size-4" />
                ) : (
                  <X className="text-bad size-4" />
                )}
                {a}
              </motion.div>
            ))}
          </div>
          <p className="text-sm">
            <span className="text-accent font-mono text-xs">{e.rule}</span> · {e.body}
          </p>
        </div>
      }
    >
      <p>
        Section 6 comes with two illustrations. Both show the same idea: a consent can be partly
        valid. The part that goes beyond what&apos;s needed, or that breaks the law, simply
        doesn&apos;t count.
      </p>
      <p>
        For engineers, the takeaway is to ask for each purpose separately, so every yes you store is
        one you can rely on.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Prove it -------------------------------------------------------------------------------------- */

const RECEIPT: [string, string][] = [
  ["person", "user_8f21 (an internal ID, not the phone number)"],
  ["notice_version", "signup-notice v4 · Tamil"],
  ["purposes", "bookings ✓ · offers by SMS ✓ · partner marketing ✗"],
  ["action", "ticked empty boxes, tapped Agree"],
  ["when", "2027-06-02 10:14:07 IST"],
  ["withdrawn", "not yet"],
];

export function ProveIt() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="If asked, can you prove it?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-3 font-mono text-[11px]">
            <p className="text-muted mb-1 flex items-center gap-1.5 font-sans text-[10px] uppercase">
              <Handshake className="size-3.5" /> Consent record (illustrative)
            </p>
            {RECEIPT.map(([k, v]) => (
              <p key={k}>
                <span className="text-accent">{k}</span>: {v}
              </p>
            ))}
          </div>
          <div className="border-line bg-surface-2/60 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Consumer law already bites</p>
            <p className="text-muted mt-0.5">
              In 2026 India&apos;s Central Consumer Protection Authority issued its first
              dark-pattern penalties, including ₹5 lakh against PhysicsWallah for a pre-selected
              donation and &ldquo;free&rdquo; courses gated behind phone and email, and ₹1 lakh
              against McAfee for a lopsided renewal screen. Those were consumer-law cases, not DPDP
              ones.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Section 6(10) puts the burden on the organisation: if consent is ever questioned, it must
        prove that a proper notice was given and valid consent obtained.
      </p>
      <p>
        That turns consent into a data-engineering job. Store a record for each yes and each
        withdrawal: who, which notice version and language, which purposes, what action they took,
        and when. A screenshot of the sign-up page is not proof.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function ConsentCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Valid consent or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-consent"
            prompt="Would each design give valid consent under the Act?"
            categories={[
              { id: "ok", label: "Valid" },
              { id: "bad", label: "Not valid" },
            ]}
            items={[
              {
                id: "empty",
                label: "An empty box per purpose that the person ticks",
                category: "ok",
                why: "Specific, with a clear action.",
              },
              {
                id: "preticked",
                label: "A marketing box ticked in advance",
                category: "bad",
                why: "Not a clear affirmative action.",
              },
              {
                id: "scroll",
                label: "“By scrolling this page you agree”",
                category: "bad",
                why: "Scrolling isn't an unambiguous action about data.",
              },
              {
                id: "gate",
                label: "No account unless you accept partner marketing",
                category: "bad",
                why: "Conditional on something the service doesn't need.",
              },
              {
                id: "equal",
                label: "Agree and Decline buttons of equal size and plain wording",
                category: "ok",
                why: "A free choice.",
              },
              {
                id: "waive",
                label: "A clause waiving the right to complain to the Board",
                category: "bad",
                why: "Invalid to that extent under s.6(2).",
              },
            ]}
            explanation="Valid consent is a free, specific, informed, unconditional and unambiguous yes, given by a clear action, for only the data the purpose needs, and with no unlawful terms."
          />
        </div>
      }
    >
      <p>Sort each design.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Five qualities and a clear action", "Free, specific, informed, unconditional, unambiguous."],
  ["Only what's needed", "Extra data falls outside the consent."],
  ["Unlawful parts fall away", "The rest of the consent can stand."],
  ["Prove it", "Keep a record of notice version, purposes and action."],
  ["No dark patterns", "Consumer law already penalises them."],
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
      <p>Next: taking it back. Withdrawal, and the consent managers that help people do it.</p>
    </StepLayout>
  );
}
