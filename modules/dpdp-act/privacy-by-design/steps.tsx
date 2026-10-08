"use client";

import { motion } from "motion/react";
import { Home, Hammer, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BACKUP_WAYS, COMPONENTS, DUTIES, GOTCHAS, TOOLS, type Comp } from "./model";
import type { PbdState } from "./state";

/* 1 ─ Story: pipes before plaster ------------------------------------------------------------------ */

export function PipesFirst() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Pipes before plaster"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-good/50 bg-good/10 rounded-xl border p-4 text-xs">
            <Home className="text-good size-6" />
            <p className="mt-2 font-semibold">Planned in</p>
            <p className="text-muted mt-1">
              Pipes laid before the walls go up. Cheap, tidy, invisible.
            </p>
          </div>
          <div className="border-bad/50 bg-bad/10 rounded-xl border p-4 text-xs">
            <Hammer className="text-bad size-6" />
            <p className="mt-2 font-semibold">Bolted on</p>
            <p className="text-muted mt-1">
              Walls broken open to add pipes later. Expensive, messy, never quite right.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Builders lay the plumbing before the plaster. Adding pipes to a finished house means
        breaking walls, and the result is never as good.
      </p>
      <p>
        <Term id="privacy-by-design">Privacy by design</Term> is the same idea for software. The Act
        never uses the phrase, but it requires &ldquo;appropriate technical and organisational
        measures&rdquo;, and almost every duty in this track turns into engineering: minimise,
        record consent, tag purposes, expire data, erase everywhere, log access. Build those in now,
        before May 2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Wire the architecture ⭐ --------------------------------------------------------------------- */

export function Wire() {
  const [s, set] = useSceneState<PbdState>();
  const on = new Set(s.on);
  const toggle = (c: Comp) => set({ on: on.has(c) ? s.on.filter((x) => x !== c) : [...s.on, c] });
  const met = DUTIES.filter((d) => d.needs.every((n) => on.has(n))).length;
  return (
    <StepLayout
      eyebrow="Build"
      title="Wire privacy into the app"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="grid gap-1">
            <p className="text-muted text-[10px] uppercase">
              GharKaam, a made-up app · add components
            </p>
            {COMPONENTS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={on.has(c.id)}
                onClick={() => toggle(c.id)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-left text-[11px] transition",
                  on.has(c.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <span className="font-semibold">{c.label}</span>
                <span className="text-muted block">{c.does}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted text-[10px] uppercase">
              DPDP duties covered · {met}/{DUTIES.length}
            </p>
            {DUTIES.map((d) => {
              const ok = d.needs.every((n) => on.has(n));
              return (
                <motion.div
                  key={d.id}
                  animate={{ scale: ok ? 1 : 0.99 }}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                    ok ? "border-good/50 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {ok ? (
                      <Check className="text-good size-3.5" />
                    ) : (
                      <X className="text-subtle size-3.5" />
                    )}
                    {d.label}
                  </span>
                  <span className="text-subtle font-mono text-[10px]">{d.law}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        GharKaam has a database and an app, and nothing else. Add components and watch which DPDP
        duties they cover. Some duties need two components working together.
      </p>
      <p>
        Notice which ones carry the most weight: purpose tags and a deletion fan-out sit underneath
        retention, erasure and rights requests. Without them, every request is a manual hunt.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The tools ------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The same patterns, on every platform"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[34rem] text-left text-[11px]">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  {["Pattern", "AWS", "Google Cloud", "Azure", "Open source"].map((h) => (
                    <th key={h} className="px-2 py-1 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((t) => (
                  <tr key={t.pattern} className="border-line border-t">
                    <td className="px-2 py-1 font-medium">{t.pattern}</td>
                    <td className="px-2 py-1">{t.aws}</td>
                    <td className="px-2 py-1">{t.gcp}</td>
                    <td className="px-2 py-1">{t.azure}</td>
                    <td className="px-2 py-1">{t.oss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="grid gap-1 text-[11px]">
            {GOTCHAS.map((g) => (
              <li key={g} className="border-line bg-surface rounded-md border px-2.5 py-1">
                ⚠ {g}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <p>
        Every major cloud has a tool for each pattern, and open source covers most of them too. The
        names differ; the jobs are the same.
      </p>
      <p>
        The defaults are where teams get caught. Logging that&apos;s off, deletion that waits, and
        storage that can&apos;t be deleted at all can each quietly break a DPDP duty.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Backups ---------------------------------------------------------------------------------------- */

export function Backups() {
  const [s, set] = useSceneState<PbdState>();
  const w = BACKUP_WAYS.find((x) => x.id === s.backup) ?? BACKUP_WAYS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Erasure and the backups"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5">
            {BACKUP_WAYS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === s.backup}
                onClick={() => set({ backup: x.id })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition",
                  x.id === s.backup
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-start gap-2 rounded-xl border p-3 text-sm",
              w.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            {w.ok ? (
              <Check className="text-good mt-0.5 size-4 shrink-0" />
            ) : (
              <X className="text-bad mt-0.5 size-4 shrink-0" />
            )}
            {w.result}
          </motion.div>
        </div>
      }
    >
      <p>
        The Act requires erasure but says nothing about backups, and the Rules actually require
        backups as a safeguard. Teams need an approach they can explain.
      </p>
      <p>
        Two common ones: keep a list of erased people that every restore honours, while old
        snapshots age out on a short schedule; or give each person their own encryption key and
        delete it, which <Term id="crypto-shredding">crypto-shredding</Term> makes every copy
        unreadable.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function PbdCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which job does it do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-pbd"
            prompt="Which part of the Act does each engineering pattern mainly serve?"
            categories={[
              { id: "consent", label: "Consent" },
              { id: "minimise", label: "Minimise and secure" },
              { id: "erase", label: "Retain and erase" },
            ]}
            items={[
              {
                id: "ledger",
                label: "A consent ledger with timestamps",
                category: "consent",
                why: "Proves consent (s.6(10)).",
              },
              {
                id: "version",
                label: "Storing which notice version each person saw",
                category: "consent",
                why: "Proves the notice.",
              },
              {
                id: "dob",
                label: "Dropping an optional date-of-birth field",
                category: "minimise",
                why: "Collect only what's needed.",
              },
              {
                id: "token",
                label: "Tokenising phone numbers in analytics",
                category: "minimise",
                why: "Rule 6(1)(a).",
              },
              {
                id: "ttl",
                label: "Nightly jobs that expire inactive data",
                category: "erase",
                why: "s.8(7).",
              },
              {
                id: "fan",
                label: "Erase events sent to every vendor",
                category: "erase",
                why: "s.8(7)(b).",
              },
            ]}
            explanation="Consent needs proof; minimisation and tokenisation shrink what's at risk; retention jobs and fan-out make erasure real."
          />
        </div>
      }
    >
      <p>Sort each pattern.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Build it in", "Retrofitting costs far more."],
  ["Tag every field with a purpose", "It powers retention, erasure and rights."],
  ["One erase, everywhere", "Caches, warehouses, vendors, backups."],
  ["Prove consent", "A ledger, not a screenshot."],
  ["Check the defaults", "Logging off, slow key deletion, undeletable storage."],
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
        Next: how the DPDP Act compares with Europe&apos;s GDPR and fits with India&apos;s other
        rules.
      </p>
    </StepLayout>
  );
}
