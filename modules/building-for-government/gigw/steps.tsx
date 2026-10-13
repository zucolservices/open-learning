"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FINDINGS } from "./model";
import type { GigwState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Highway() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Signs on the highway"
      stage={
        <div className="flex flex-1 items-center justify-center gap-3">
          {["Same shape", "Same colours", "Same place"].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-accent bg-accent-soft grid size-24 place-items-center rounded-xl border p-2 text-center text-xs font-medium"
            >
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Drive into any state and you can read its road signs: the same shapes, colours and
        positions. You don&apos;t relearn driving at every border.
      </p>
      <p>
        India has tens of thousands of government websites and apps. <Term id="gigw">GIGW</Term>{" "}
        (Guidelines for Indian Government Websites and Apps) is their common rulebook, so every one
        is trustworthy, usable by everyone and secure. Version 3.0 came out in 2023.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Audit() {
  const [s, set] = useSceneState<GigwState>();
  const on = (id: string) => s.fixed.includes(id);
  const toggle = (id: string) =>
    set({ fixed: on(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  const all = s.fixed.length === FINDINGS.length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Audit the department's website"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="border-line-strong bg-surface overflow-hidden rounded-xl border">
            <div className="bg-surface-2 border-line flex items-center gap-2 border-b px-3 py-1.5 font-mono text-[10px]">
              <span className={on("domain") ? "text-good" : "text-bad"}>
                {on("domain") ? "labour.kalpanagar.gov.in" : "kalpanagar-labour-portal.com"}
              </span>
              {on("language") && (
                <span className="border-line-strong ml-auto rounded border px-1.5 font-sans">
                  English | मराठी
                </span>
              )}
            </div>
            <div className="grid gap-1.5 p-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-md border text-[9px]",
                    on("owner") ? "border-accent bg-accent-soft" : "border-line border-dashed",
                  )}
                >
                  {on("owner") ? "Logo" : "?"}
                </span>
                <span className="font-semibold">
                  {on("owner") ? "Labour Department, Kalpanagar (made up)" : "Welcome!"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                <span className="border-line rounded border px-1.5">
                  Notices{on("scans") ? " (HTML + tagged PDF)" : " (scanned)"}
                </span>
                <span className="border-line rounded border px-1.5">
                  {on("construction") ? "Services" : "Services: under construction"}
                </span>
                {on("contact") && (
                  <span className="border-line rounded border px-1.5">Contact us · Feedback</span>
                )}
                <span className="border-line rounded border px-1.5">
                  {on("alt") ? "Photos with descriptions" : "Photos"}
                </span>
              </div>
              <p className="text-subtle text-[10px]">
                {on("updated") ? "Last updated: 13 Oct 2026" : ""}
                {on("updated") && on("audit") ? " · " : ""}
                {on("audit") ? "Security audited before hosting" : ""}
              </p>
            </div>
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {FINDINGS.map((f) => (
              <div
                key={f.id}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5",
                  on(f.id) ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
                )}
              >
                <p>
                  <span className="text-muted mr-1 font-mono text-[10px]">{f.ref}</span>
                  {f.problem}
                </p>
                <button
                  type="button"
                  aria-pressed={on(f.id)}
                  onClick={() => toggle(f.id)}
                  className={cn(
                    "mt-1 rounded-full border px-2 py-0.5 text-left text-[10px]",
                    on(f.id) ? "border-good text-good" : "border-line-strong",
                  )}
                >
                  {on(f.id) ? "Fixed · undo" : f.fix}
                </button>
              </div>
            ))}
          </div>
          <p className={all ? "text-good" : "text-muted"}>
            {all
              ? "Ready to apply for certification."
              : `${s.fixed.length} of ${FINDINGS.length} findings fixed.`}
          </p>
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s labour department wants its new website certified. A pre-audit found nine
        problems, each linked to a GIGW 3.0 checkpoint. Fix them and watch the site change.
      </p>
      <p>
        Several are about trust: a gov.in address, clear ownership and a recent update date help
        citizens tell a real government site from a fake one.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Covers --------------------------------------------------------------------------------------- */

const PARTS: [string, number, string][] = [
  ["Accessibility", 50, "Usable by people with disabilities, following WCAG 2.1 level AA."],
  ["Quality", 25, "Identity, navigation, content, contact and trust signals."],
  ["Lifecycle", 10, "Who owns the site, its policies, languages and upkeep."],
  ["Cybersecurity", 3, "Audits before hosting, and long lists of security controls."],
];

export function Covers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What GIGW 3.0 covers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {PARTS.map(([t, n, b], i) => (
            <div key={t}>
              <p className="flex justify-between">
                <span className="font-semibold">{t}</span>
                <span className="font-mono">{n} checkpoints</span>
              </p>
              <div className="bg-surface-2 mt-1 h-2 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(n / 50) * 100}%` }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-accent h-2 rounded-full"
                />
              </div>
              <p className="text-muted mt-0.5 text-[11px]">{b}</p>
            </div>
          ))}
          <p className="text-subtle text-[10px]">
            88 checkpoints in all. The three security checkpoints each contain many detailed
            controls.
          </p>
        </div>
      }
    >
      <p>
        Every checkpoint says what the department, the developer and the evaluator must each do. The
        department nominates a senior{" "}
        <Term id="web-information-manager">Web Information Manager</Term> who approves policies on
        content, archiving, review and privacy.
      </p>
      <p>
        GIGW began in 2009, added mobile apps in 2019 (version 2.0), and version 3.0 covers websites
        and apps alike. Its text hasn&apos;t changed since 2023.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Certify -------------------------------------------------------------------------------------- */

export function Certify() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Certification and WCAG"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "1 · Security audit",
              "A “safe to host” certificate from an approved auditor before going live.",
            ],
            [
              "2 · Choose an STQC lab",
              "STQC, part of MeitY, runs the Certified Quality Website scheme.",
            ],
            ["3 · Assessment", "Automated tools plus manual testing against the checkpoints."],
            [
              "4 · Certificate",
              "Valid three years, with yearly surveillance and possible surprise audits.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
          <div className="border-viz-meta/50 bg-viz-meta/10 rounded-lg border px-3 py-2 text-xs">
            <span className="font-semibold">Aim above the minimum</span>
            <span className="text-muted">
              {" "}
              · GIGW 3.0 points to WCAG 2.1; WCAG 2.2 (Oct 2023) adds criteria such as larger touch
              targets and accessible sign-in. Building to 2.2 costs little extra.
            </span>
          </div>
        </div>
      }
    >
      <p>
        Certification is how a department shows it conforms. The pre-audit you just fixed is what
        teams do before applying, using GIGW&apos;s conformity matrix as a self-check.
      </p>
      <p>
        The next module looks at the accessibility laws behind the 50 accessibility checkpoints.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function GigwCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Whose job is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-gigw"
            prompt="GIGW splits each checkpoint between three roles. Who does each task?"
            categories={[
              { id: "dept", label: "Department" },
              { id: "dev", label: "Developer" },
              { id: "eval", label: "Evaluator" },
            ]}
            items={[
              {
                id: "wim",
                label: "Nominate a Web Information Manager",
                category: "dept",
                why: "A senior official owns the site.",
              },
              {
                id: "archive",
                label: "Approve the content archival policy",
                category: "dept",
                why: "Policies are the department's call.",
              },
              {
                id: "alt",
                label: "Add text alternatives to images",
                category: "dev",
                why: "Built into the pages.",
              },
              {
                id: "switch",
                label: "Build the language switcher",
                category: "dev",
                why: "A technical feature.",
              },
              {
                id: "test",
                label: "Test conformity and recommend certification",
                category: "eval",
                why: "An independent check.",
              },
            ]}
            explanation="The department owns the site and its policies, the developer builds conforming pages, and an independent evaluator checks them."
          />
        </div>
      }
    >
      <p>Sort each task.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["One rulebook", "GIGW 3.0, for websites and apps."],
        ["88 checkpoints", "Quality, accessibility, security, lifecycle."],
        ["Trust signals", "gov.in, ownership, last updated."],
        ["Named owners", "A Web Information Manager and policies."],
        ["Certified", "Security audit, then STQC's scheme."],
      ]}
    >
      <p>Next: the accessibility laws behind those 50 checkpoints.</p>
    </WrapStep>
  );
}
