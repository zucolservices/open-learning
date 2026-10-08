"use client";

import { motion } from "motion/react";
import { Lock, BookOpenCheck, Camera, KeyRound, Check, X, Info } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CONTROLS, INCIDENTS, run, type Control, type Incident } from "./model";
import type { SafeState } from "./state";

/* 1 ─ Story: the locker room ----------------------------------------------------------------------- */

const LOCKER = [
  { Icon: Lock, t: "Two keys to open a locker" },
  { Icon: BookOpenCheck, t: "A register of every visit" },
  { Icon: Camera, t: "Cameras, reviewed daily" },
  { Icon: KeyRound, t: "A master key kept at head office" },
];

export function LockerRoom() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The bank's locker room"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {LOCKER.map(({ Icon, t }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex items-center gap-3 rounded-xl border p-3 text-sm"
            >
              <Icon className="text-accent size-5 shrink-0" />
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A bank&apos;s locker room doesn&apos;t rely on one strong door. Opening a locker takes two
        keys, every visit is written in a register, cameras are reviewed, and if something goes
        wrong there&apos;s a way to recover.
      </p>
      <p>
        The DPDP Act asks every organisation to take{" "}
        <Term id="reasonable-security-safeguards">reasonable security safeguards</Term> to prevent
        breaches, and Rule 6 lists the minimum: encryption or masking, access control, logs and
        monitoring, backups, a year of logs, security terms with processors, and the measures to
        keep it all working. From May 2027, failing at this carries the Act&apos;s biggest penalty:
        up to ₹250 crore.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Harden the clinic ⭐ ------------------------------------------------------------------------- */

export function Harden() {
  const [s, set] = useSceneState<SafeState>();
  const on = new Set(s.on);
  const toggle = (c: Control) =>
    set({ on: on.has(c) ? s.on.filter((x) => x !== c) : [...s.on, c] });
  const out = run(s.incident, on);
  const inc = INCIDENTS.find((i) => i.id === s.incident) ?? INCIDENTS[0];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Harden the clinic, then test it"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="grid gap-1">
            <p className="text-muted text-[10px] uppercase">
              CareNest, a made-up clinic · Rule 6(1) controls
            </p>
            {CONTROLS.map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition",
                  on.has(c.id) ? "border-accent/60 bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.has(c.id)}
                  onChange={() => toggle(c.id)}
                  className="accent-accent mt-0.5"
                />
                <span className="flex-1">{c.label}</span>
                <span className="text-subtle font-mono text-[10px]">{c.clause}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {INCIDENTS.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  aria-pressed={i.id === s.incident}
                  onClick={() => set({ incident: i.id as Incident })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px]",
                    i.id === s.incident
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line-strong text-muted",
                  )}
                >
                  {i.label}
                </button>
              ))}
            </div>
            <div className="border-line bg-surface rounded-xl border p-3 text-xs">
              <p className="text-muted">{inc.setup}</p>
              <ul className="mt-2 grid gap-1">
                {out.lines.map((l) => (
                  <motion.li
                    key={l.text}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-1.5"
                  >
                    {l.good === null ? (
                      <Info className="text-muted mt-0.5 size-3.5 shrink-0" />
                    ) : l.good ? (
                      <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                    ) : (
                      <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                    )}
                    {l.text}
                  </motion.li>
                ))}
              </ul>
              <p
                className={cn(
                  "mt-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                  out.severity === "contained" && "bg-good/15 text-good",
                  out.severity === "limited" && "bg-surface-2",
                  out.severity === "serious" && "bg-bad/15 text-bad",
                )}
              >
                {out.severity === "contained"
                  ? "Contained"
                  : out.severity === "limited"
                    ? "Damage limited"
                    : "Serious breach"}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        CareNest starts with no safeguards. Switch controls on, then run each incident and watch the
        outcome change. The incidents are rules-based simulations.
      </p>
      <p>
        No single control stops everything. MFA beats the stolen password, encryption beats the lost
        laptop, backups beat ransomware, and logs tell you who was affected in every case. That
        layering is what &ldquo;reasonable&rdquo; looks like in practice.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Rule 6, line by line ------------------------------------------------------------------------- */

export function RuleSix() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rule 6, in plain words"
      stage={
        <div className="grid flex-1 content-center gap-1.5">
          {CONTROLS.filter((c, i, a) => a.findIndex((x) => x.clause === c.clause) === i).map(
            (c, i) => (
              <motion.div
                key={c.clause}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className="border-line bg-surface grid grid-cols-[4rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-xs"
              >
                <span className="text-accent font-mono">{c.clause}</span>
                <span>{c.plain}</span>
              </motion.div>
            ),
          )}
        </div>
      }
    >
      <p>
        Rule 6 calls its list the minimum, and its examples (&ldquo;such as&rdquo; encryption,
        masking, tokens) are examples, not a closed menu. It names no standard, no algorithm and no
        certification.
      </p>
      <p>
        The old SPDI Rules pointed to ISO/IEC 27001; the DPDP Rules don&apos;t. A certification is
        good evidence that you took reasonable steps, but it isn&apos;t a safe harbour. Security
        duties also cover processing done by your processors on your behalf.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Accuracy, when it matters --------------------------------------------------------------------- */

export function Accuracy() {
  const [s, set] = useSceneState<SafeState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Accuracy, when it matters"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.decision ? "yes" : "no"}
            onChange={(v) => set({ decision: v === "yes" })}
            options={[
              ["yes", "Used to make a decision"],
              ["no", "Just stored"],
            ]}
            size="sm"
          />
          <motion.div
            key={String(s.decision)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-4 text-sm"
          >
            {s.decision ? (
              <>
                <p className="font-semibold">
                  CareNest sends a patient&apos;s blood group to a lab for a transfusion.
                </p>
                <p className="text-muted mt-1">
                  The data is likely to be used for a decision that affects the person, and
                  disclosed to another fiduciary. Section 8(3) requires it to be complete, accurate
                  and consistent. Check it before it goes.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">An old newsletter sign-up sits in a mailing list.</p>
                <p className="text-muted mt-1">
                  Not used for any decision about the person. The accuracy duty in s.8(3) is aimed
                  at data that drives decisions or is shared; this list mostly raises a retention
                  question instead.
                </p>
              </>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Safeguards protect data from outsiders; the Act also cares whether it&apos;s right. Where
        personal data is likely to be used for a decision about someone, or shared with another
        fiduciary, it must be complete, accurate and consistent.
      </p>
      <p>
        For engineers that means validation at entry, a way for people to correct their details, and
        care with stale copies in caches and warehouses.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function SafeCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Protect, detect or recover?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-safeguards"
            prompt="What does each Rule 6 safeguard mainly do?"
            categories={[
              { id: "protect", label: "Protect" },
              { id: "detect", label: "Detect" },
              { id: "recover", label: "Recover" },
            ]}
            items={[
              {
                id: "encrypt",
                label: "Encrypting laptops and backups",
                category: "protect",
                why: "Keeps data unreadable.",
              },
              {
                id: "mfa",
                label: "MFA for staff accounts",
                category: "protect",
                why: "Stops stolen passwords working.",
              },
              {
                id: "alert",
                label: "Alerts on bulk exports at odd hours",
                category: "detect",
                why: "Spots misuse fast.",
              },
              {
                id: "logs",
                label: "Keeping access logs for a year",
                category: "detect",
                why: "Lets you investigate later.",
              },
              {
                id: "backup",
                label: "Offline, tested backups",
                category: "recover",
                why: "Keeps the service running.",
              },
              {
                id: "mask",
                label: "Masking ID numbers on screens",
                category: "protect",
                why: "Limits exposure.",
              },
            ]}
            explanation="Rule 6 asks for all three: protect the data, see when it's misused, and keep the service going if something breaks."
          />
        </div>
      }
    >
      <p>Sort each safeguard.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Reasonable safeguards", "Rule 6 lists the minimum."],
  ["Layers, not one wall", "Protect, detect and recover."],
  ["No named standard", "Certifications help but aren't a safe harbour."],
  ["Logs for a year", "You can't report what you can't trace."],
  ["Up to ₹250 crore", "The Act's largest penalty, from May 2027."],
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
      <p>Next: the vendors who process data for you, and the contracts that bind them.</p>
    </StepLayout>
  );
}
