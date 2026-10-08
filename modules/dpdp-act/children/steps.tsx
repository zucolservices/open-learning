"use client";

import { motion } from "motion/react";
import { FileSignature, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES, FEATURES, VERIFY, type Feature } from "./model";
import type { ChildState } from "./state";

/* 1 ─ Story: the permission slip ------------------------------------------------------------------- */

export function PermissionSlip() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The permission slip"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface w-full max-w-xs rounded-xl border p-4 text-xs">
            <FileSignature className="text-accent size-5" />
            <p className="mt-2 font-semibold">Class 7 museum trip</p>
            <p className="text-muted mt-1">I allow my child to attend. Signed: ____ (parent)</p>
          </div>
          <p className="text-subtle max-w-xs text-center text-[11px]">
            A signed slip lets the child go on the trip. It doesn&apos;t let the school sell the
            class photos to advertisers.
          </p>
        </div>
      }
    >
      <p>
        Before a school trip, a parent signs a permission slip. The school checks it&apos;s really a
        parent&apos;s signature, not one the child scrawled. And the slip covers the trip, nothing
        else: some things a school shouldn&apos;t do with children whatever a parent signs.
      </p>
      <p>
        The DPDP Act treats anyone under 18 as a <Term id="dpdp-child">child</Term>. Processing a
        child&apos;s data needs{" "}
        <Term id="verifiable-parental-consent">verifiable parental consent</Term>, and tracking,
        behavioural monitoring and targeted advertising aimed at children are barred, with a few
        narrow exemptions. These rules apply from May 2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build the sign-up ⭐ ------------------------------------------------------------------------- */

export function SignUp() {
  const [s, set] = useSceneState<ChildState>();
  const v = VERIFY.find((x) => x.id === s.verify);
  const ready = !s.child || v?.ok;
  const on = new Set(s.on);
  const toggle = (f: Feature) =>
    set({ on: on.has(f) ? s.on.filter((x) => x !== f) : [...s.on, f] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Build PadhaiPal's sign-up"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">PadhaiPal, a made-up learning app</p>
          <Segmented
            value={s.child ? "child" : "adult"}
            onChange={(x) => set({ child: x === "child" })}
            options={[
              ["child", "The new user is 13"],
              ["adult", "The new user is 19"],
            ]}
            size="sm"
          />
          {s.child ? (
            <div>
              <p className="text-muted text-[10px] uppercase">
                1 · Verify a parent before creating the account
              </p>
              <div className="mt-1 grid gap-1">
                {VERIFY.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    aria-pressed={s.verify === x.id}
                    onClick={() => set({ verify: x.id })}
                    className={cn(
                      "rounded-lg border px-3 py-1 text-left text-xs",
                      s.verify !== x.id && "border-line hover:bg-surface-2",
                      s.verify === x.id && x.ok && "border-good/60 bg-good/10",
                      s.verify === x.id && !x.ok && "border-bad/60 bg-bad/10",
                    )}
                  >
                    {x.label}
                    {s.verify === x.id && (
                      <span className="text-muted block text-[10px]">{x.why}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              An adult gives their own consent after a normal notice. No section 9 duties apply.
            </p>
          )}
          <div className={cn(!ready && "pointer-events-none opacity-40")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted text-[10px] uppercase">2 · Switch features on</p>
              {s.child && (
                <label className="flex items-center gap-1.5 text-[11px]">
                  <input
                    type="checkbox"
                    checked={s.school}
                    onChange={(e) => set({ school: e.target.checked })}
                    className="accent-accent"
                  />
                  Run for a school, as its processor
                </label>
              )}
            </div>
            <div className="mt-1 grid gap-1">
              {FEATURES.map((f) => {
                const verdict = s.child
                  ? f.verdict(s.school)
                  : { ok: true, why: "Allowed for an adult with valid consent." };
                const isOn = on.has(f.id);
                return (
                  <label
                    key={f.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-lg border px-2.5 py-1 text-[11px]",
                      !isOn && "border-line bg-surface",
                      isOn && verdict.ok && "border-good/50 bg-good/10",
                      isOn && !verdict.ok && "border-bad/50 bg-bad/10",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggle(f.id)}
                      className="accent-accent mt-0.5"
                    />
                    <span className="flex-1">
                      {f.label}
                      {isOn && (
                        <span className="mt-0.5 flex items-start gap-1">
                          {verdict.ok ? (
                            <Check className="text-good size-3 shrink-0" />
                          ) : (
                            <X className="text-bad size-3 shrink-0" />
                          )}
                          {verdict.why}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Build the sign-up for a 13-year-old, then switch features on and see which the Act allows.
        Compare with a 19-year-old, and with the app running on behalf of a school.
      </p>
      <p>
        The Act doesn&apos;t say how to find out who is a child. It assumes you&apos;ll ask, and
        lets you check age without parental consent. What it insists on is that once a user is a
        child, a parent is verified before their data is processed.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Rule 10's four cases ------------------------------------------------------------------------- */

export function FourCases() {
  const [s, set] = useSceneState<ChildState>();
  const c = CASES.find((x) => x.id === s.caseId) ?? CASES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four ways a parent is verified"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-1.5">
            {CASES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === s.caseId}
                onClick={() => set({ caseId: x.id })}
                className={cn(
                  "rounded-lg border px-2.5 py-2 text-left text-[11px]",
                  x.id === s.caseId
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <span className="text-accent font-mono">Case {x.id}</span>
                <span className="block">{x.starts}</span>
                <span className="text-muted block">{x.parent}</span>
              </button>
            ))}
          </div>
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-sm"
          >
            {c.check}
          </motion.div>
        </div>
      }
    >
      <p>
        Rule 10 comes with four illustrations, depending on who starts sign-up and whether the
        parent is already known to the app. In every case the check happens before the child&apos;s
        account is created.
      </p>
      <p>
        Note what Rule 10 checks: that the parent is an identifiable adult. It doesn&apos;t make the
        app prove the family relationship. DigiLocker is one optional way to share government-issued
        age details; as of October 2026 there was no dedicated age-token service.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The narrow exemptions ------------------------------------------------------------------------ */

const PART_A: [string, string][] = [
  [
    "Hospitals, clinics and health professionals",
    "Only for providing health services, as needed to protect the child.",
  ],
  [
    "Educational institutions",
    "Only tracking and monitoring for their educational activities or the safety of enrolled children.",
  ],
  ["Crèches and child-care centres", "Only tracking and monitoring for the children's safety."],
  ["Transport arranged by a school", "Only tracking location during travel, for safety."],
];

const PART_B = [
  "State benefits under law",
  "An email-only account",
  "Real-time location for safety",
  "Blocking harmful content and ads",
  "Checking whether a user is a child",
];

export function Exemptions() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Narrow exemptions"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <p className="text-muted text-[10px] uppercase">Who (Fourth Schedule, Part A)</p>
            {PART_A.map(([k, v]) => (
              <div
                key={k}
                className="border-line bg-surface rounded-lg border px-2.5 py-1.5 text-[11px]"
              >
                <p className="font-semibold">{k}</p>
                <p className="text-muted">{v}</p>
              </div>
            ))}
          </div>
          <div className="grid content-start gap-1.5">
            <p className="text-muted text-[10px] uppercase">Which purposes (Part B)</p>
            {PART_B.map((p) => (
              <div
                key={p}
                className="border-line bg-surface rounded-lg border px-2.5 py-1.5 text-[11px]"
              >
                {p}
              </div>
            ))}
            <p className="border-bad/40 bg-bad/10 mt-1 rounded-lg border px-2.5 py-1.5 text-[11px]">
              Never exempt: processing likely to harm a child&apos;s well-being.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The Rules&apos; Fourth Schedule lifts parental consent and the tracking ban for a few
        classes of organisation and purposes. Each is narrow: a school&apos;s exemption covers
        tracking for its educational activities or children&apos;s safety, nothing more.
      </p>
      <p>
        Separately, in September 2026 the government told the Supreme Court it planned to amend the
        IT Rules to bar social media accounts for under-18s. That&apos;s a proposal under different
        rules, not part of the DPDP Act.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function ChildCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Allowed for a 14-year-old?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-children"
            prompt="A private learning app, acting on its own, has a 14-year-old user with verified parental consent. Is each allowed?"
            categories={[
              { id: "ok", label: "Allowed" },
              { id: "no", label: "Barred" },
            ]}
            items={[
              {
                id: "ads",
                label: "Ads targeted using the child's activity",
                category: "no",
                why: "Barred, with no exemption.",
              },
              {
                id: "lessons",
                label: "Delivering the lessons the parent signed up for",
                category: "ok",
                why: "Normal processing with verified consent.",
              },
              {
                id: "profile",
                label: "Building a behavioural profile to keep the child scrolling",
                category: "no",
                why: "Behavioural monitoring, and likely harmful.",
              },
              {
                id: "filter",
                label: "Blocking adult content",
                category: "ok",
                why: "An exempt protective purpose.",
              },
              {
                id: "gps",
                label: "Tracking location to show local ads",
                category: "no",
                why: "Tracking for ads isn't a safety purpose.",
              },
              {
                id: "age",
                label: "Asking for date of birth at sign-up",
                category: "ok",
                why: "Checking whether a user is a child is exempt.",
              },
            ]}
            explanation="With verified parental consent the app may provide its service; tracking, behavioural monitoring and targeted ads stay barred, except for narrow protective purposes."
          />
        </div>
      }
    >
      <p>Sort each feature.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Under 18 is a child", "Higher than many other countries' laws."],
  ["Verify a parent first", "Before creating the account."],
  ["No tracking, profiling or targeted ads", "Even with consent."],
  ["Narrow exemptions", "Health, schools, child care, safety."],
  ["Never harm well-being", "No exemption at all. Up to ₹200 crore."],
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
      <p>Next: the platforms the government can name as Significant Data Fiduciaries.</p>
    </StepLayout>
  );
}
