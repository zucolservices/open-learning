"use client";

import { motion } from "motion/react";
import { KeyRound, Check, X, ArrowRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, NOTICE_ITEMS, REGIMES } from "./model";
import type { BreachState } from "./state";

/* 1 ─ Story: the copied keycard -------------------------------------------------------------------- */

export function CopiedKey() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A copied master key"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <KeyRound className="text-bad size-10" />
          <div className="grid w-full max-w-sm gap-1.5 text-xs">
            {[
              "Change the locks",
              "Tell the police",
              "Tell every guest, so they can check their rooms",
              "Write up what happened",
            ].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-1.5"
              >
                {i + 1}. {t}
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A hotel discovers that someone copied its master keycard last week. The manager doesn&apos;t
        wait to find out whether anything was taken. They change the locks, call the police, and
        tell every guest, because guests need to check their own rooms and valuables.
      </p>
      <p>
        A <Term id="personal-data-breach">personal data breach</Term> works the same way under the
        DPDP Act. From May 2027 every breach, however small, must be reported to the Data Protection
        Board and to each affected person without delay, with a detailed report to the Board within
        72 hours. Separately, CERT-In already requires many cyber incidents to be reported within
        six hours.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Hour by hour ⭐ ------------------------------------------------------------------------------ */

const MARKS = [
  { h: 6, label: "CERT-In 6 h" },
  { h: 72, label: "Board report 72 h" },
];

export function HourByHour() {
  const [s, set] = useSceneState<BreachState>();
  const idx = Math.min(s.at, DECISIONS.length - 1);
  const d = DECISIONS[idx];
  const picked = s.answers[d.id];
  const choice = d.choices.find((c) => c.id === picked);
  const pct = (h: number) => `${(h / 80) * 100}%`;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Hour by hour"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <div className="bg-surface-2 relative h-2 rounded-full">
              <div
                className="bg-accent absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{ width: pct(d.hour) }}
              />
              {MARKS.map((m) => (
                <div
                  key={m.h}
                  className="bg-bad absolute -top-1 h-4 w-0.5"
                  style={{ left: pct(m.h) }}
                />
              ))}
            </div>
            <div className="text-subtle relative mt-1 h-3 text-[9px]">
              {MARKS.map((m) => (
                <span
                  key={m.h}
                  className="absolute -translate-x-1/2 whitespace-nowrap"
                  style={{ left: pct(m.h) }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>
          <p className="text-muted text-[10px] uppercase">
            MediKart, a made-up pharmacy app · decision {idx + 1} of {DECISIONS.length} · hour{" "}
            {d.hour}
          </p>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-sm font-medium">{d.situation}</p>
            <div className="mt-2 grid gap-1.5">
              {d.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={picked === c.id}
                  onClick={() => set({ answers: { ...s.answers, [d.id]: c.id } })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs transition",
                    picked !== c.id && "border-line hover:bg-surface-2",
                    picked === c.id && c.good && "border-good/60 bg-good/10",
                    picked === c.id && !c.good && "border-bad/60 bg-bad/10",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          {choice && (
            <motion.div
              key={d.id + choice.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 text-xs"
            >
              {choice.good ? (
                <Check className="text-good mt-0.5 size-4 shrink-0" />
              ) : (
                <X className="text-bad mt-0.5 size-4 shrink-0" />
              )}
              <span>{choice.result}</span>
            </motion.div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!choice || idx >= DECISIONS.length - 1}
              onClick={() => set({ at: idx + 1 })}
              className="bg-accent text-accent-fg inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Move the clock on <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => set({ at: 0, answers: {} })}
              className="border-line text-muted rounded-full border px-4 py-1.5 text-xs"
            >
              Start over
            </button>
          </div>
        </div>
      }
    >
      <p>
        You&apos;re on call at MediKart when a breach turns up. Make six decisions as the clock
        runs. You can try a different choice at any point before moving on.
      </p>
      <p>
        Two regimes run at once: CERT-In&apos;s six-hour rule, in force today, and the DPDP
        Act&apos;s notices, from May 2027. Neither refers to the other, so plan for both.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Write the customer notice -------------------------------------------------------------------- */

export function CustomerNotice() {
  const [s, set] = useSceneState<BreachState>();
  const have = new Set(s.items);
  const toggle = (id: string) =>
    set({ items: have.has(id) ? s.items.filter((x) => x !== id) : [...s.items, id] });
  return (
    <StepLayout
      eyebrow="Explore"
      title="Write the message to customers"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="grid gap-1">
            {NOTICE_ITEMS.map((n) => (
              <label
                key={n.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs",
                  have.has(n.id) ? "border-accent/60 bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={have.has(n.id)}
                  onChange={() => toggle(n.id)}
                  className="accent-accent"
                />
                {n.label}
              </label>
            ))}
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                have.size === NOTICE_ITEMS.length ? "text-good" : "text-bad",
              )}
            >
              {have.size === NOTICE_ITEMS.length
                ? "All five items: this meets Rule 7(1)."
                : `${NOTICE_ITEMS.length - have.size} required item(s) missing.`}
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <p className="text-muted text-[10px] uppercase">Message to each customer (made up)</p>
            <p className="mt-2 font-semibold">About your MediKart data</p>
            <div className="mt-1 grid gap-1.5">
              {NOTICE_ITEMS.filter((n) => have.has(n.id)).map((n) => (
                <motion.p key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {n.text}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        The Rules list exactly what each affected person must be told, concisely and in plain
        language: what happened and when, the likely consequences for them, what you&apos;re doing,
        what they can do, and who they can contact.
      </p>
      <p>
        Draft this template before you need it. In a real breach, the hours go to investigating, not
        to wordsmithing.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Two regimes, two clocks ---------------------------------------------------------------------- */

export function TwoClocks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two regimes, two clocks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line overflow-hidden rounded-xl border text-xs">
            <div className="bg-surface-2 text-muted grid grid-cols-[5.5rem_1fr_1fr] gap-2 px-3 py-1.5 font-medium">
              <span />
              <span>DPDP Act</span>
              <span>CERT-In Directions</span>
            </div>
            {REGIMES.map((r) => (
              <div
                key={r.aspect}
                className="border-line grid grid-cols-[5.5rem_1fr_1fr] gap-2 border-t px-3 py-1.5"
              >
                <span className="text-muted">{r.aspect}</span>
                <span>{r.dpdp}</span>
                <span>{r.certin}</span>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Banks, insurers and market intermediaries may also have their regulator&apos;s own
            reporting rules.
          </p>
        </div>
      }
    >
      <p>
        The DPDP Act is about people: every personal data breach, told to the Board and to each
        affected person. CERT-In is about cyber security: a list of incident types, told to CERT-In
        within six hours, whether or not personal data is involved.
      </p>
      <p>
        Unlike Europe&apos;s GDPR, the DPDP Act has no &ldquo;unlikely to result in risk&rdquo;
        exception. One incident can expose two separate failures, each with its own cap: weak
        safeguards (up to ₹250 crore) and failing to notify (up to ₹200 crore).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function BreachCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A personal data breach?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-breach"
            prompt="Under the DPDP Act, is each of these a personal data breach?"
            categories={[
              { id: "yes", label: "Breach" },
              { id: "no", label: "Not one" },
            ]}
            items={[
              {
                id: "ransom",
                label: "Ransomware locks the customer database; nothing is copied out",
                category: "yes",
                why: "Loss of access compromises availability.",
              },
              {
                id: "laptop",
                label: "An encrypted laptop holding customer data is stolen",
                category: "yes",
                why: "No exemption for encryption, though it lowers the harm.",
              },
              {
                id: "wrong",
                label: "An order summary is emailed to the wrong customer",
                category: "yes",
                why: "Accidental disclosure.",
              },
              {
                id: "curious",
                label: "A staff member browses a celebrity's records out of curiosity",
                category: "yes",
                why: "Unauthorised processing.",
              },
              {
                id: "ddos",
                label:
                  "A traffic flood takes the marketing site offline; no personal data is touched",
                category: "no",
                why: "Not a personal data breach, though CERT-In may want to hear about it.",
              },
              {
                id: "blocked",
                label: "A phishing email is caught by the filter before anyone opens it",
                category: "no",
                why: "No personal data was compromised.",
              },
            ]}
            explanation="A personal data breach is any unauthorised processing, or accidental disclosure, loss, alteration or loss of access, that compromises confidentiality, integrity or availability."
          />
        </div>
      }
    >
      <p>Sort each incident.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Every breach counts", "No size, harm or encryption threshold."],
  ["Tell people directly", "Five items, through their account or registered channel."],
  ["Board: now, then 72 hours", "First notice without delay; detailed report in 72 hours."],
  ["CERT-In: six hours", "Already in force, separate from DPDP."],
  ["Prepare before it happens", "Templates, contacts, preserved logs."],
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
        That completes the fiduciary&apos;s duties. Next chapter: the rights of Data Principals,
        starting with access, correction and erasure.
      </p>
    </StepLayout>
  );
}
