"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LISTS, TOP10 } from "./model";
import type { TopState } from "./state";

/* 1 ─ The fire service's list --------------------------------------------------------------------- */

export function FireList() {
  const causes = [
    "Cooking left unattended",
    "Faulty wiring",
    "Candles",
    "Heaters too close",
    "Smoking indoors",
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="The fire service's list"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <p className="text-muted text-[10px] uppercase">Most common causes of house fires</p>
          {causes.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid w-full max-w-xs grid-cols-[1.5rem_1fr] rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="text-accent font-mono">{i + 1}</span>
              {c}
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">An illustrative list.</p>
        </div>
      }
    >
      <p>
        A fire service doesn&apos;t hand every family the full building code. It publishes the
        handful of causes behind most house fires, so people know where to look first. The full
        building code still exists, for those who build houses.
      </p>
      <p>
        The <Term id="owasp">OWASP</Term> Top 10 is that list for web applications. OWASP, the Open
        Worldwide Application Security Project, is a non-profit community founded in 2001. The 2025
        edition is the eighth since 2003.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tour the Top 10 ⭐ -------------------------------------------------------------------------- */

export function Tour() {
  const [s, set] = useSceneState<TopState>();
  const r = TOP10[s.risk] ?? TOP10[0];
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Tour the Top 10"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-5 gap-1.5">
            {TOP10.map((x, i) => (
              <button
                key={x.code}
                type="button"
                aria-pressed={s.risk === i}
                aria-label={`${x.code} ${x.name}`}
                onClick={() => set({ risk: i })}
                className={cn(
                  "flex flex-col items-start rounded-lg border px-2 py-2 text-left",
                  s.risk === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="text-accent font-mono text-xs">{x.code}</span>
                <span className="hidden text-[10px] leading-tight sm:block">{x.name}</span>
              </button>
            ))}
          </div>
          <motion.div
            key={r.code}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3"
          >
            <p className="text-base font-semibold">
              <span className="text-accent font-mono">{r.code}</span> {r.name}
            </p>
            <p className="text-sm">{r.plain}</p>
            <p className="text-xs">
              <span className="text-muted">Real case: </span>
              {r.incident}
            </p>
            <div className="text-muted flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              <span>In 2021: {r.was}</span>
              <span>In this track: {r.modules}</span>
            </div>
          </motion.div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => set({ risk: (s.risk + 9) % 10 })}
              className="border-line rounded-full border px-3 py-1 text-xs"
              aria-label="Previous risk"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => set({ risk: (s.risk + 1) % 10 })}
              className="border-line rounded-full border px-3 py-1 text-xs"
              aria-label="Following risk"
            >
              →
            </button>
          </div>
        </div>
      }
    >
      <p>
        Step through all ten. Each category is a family of related weaknesses, with a real case and
        the module in this track that teaches the defence.
      </p>
      <p>
        Broken access control stays at number one: OWASP found some form of it in every application
        tested. New in 2025 are software supply chain failures (growing out of “outdated
        components”) and mishandling of exceptional conditions. Server-side request forgery, its own
        category in 2021, now sits inside broken access control.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How the list is made ------------------------------------------------------------------------ */

export function HowMade() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How the list is made"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["2.8 million+", "applications' test results contributed by companies and testers"],
              ["8 + 2", "eight categories from the data, two voted in by practitioners"],
              ["248", "related weaknesses (CWEs) grouped into the ten categories"],
            ].map(([n, t], i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-3 text-xs"
              >
                <p className="text-accent font-mono text-2xl">{n}</p>
                <p className="text-muted mt-1">{t}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Why two from a survey?</p>
            <p className="text-muted">
              Test data lags behind real attacks. Practitioners pushed in supply chain failures
              (half ranked it first) and logging and alerting failures, which testing tools struggle
              to measure.
            </p>
          </div>
        </div>
      }
    >
      <p>
        OWASP calls the list “data-informed, not blindly data-driven”. It combines test results with
        a community survey, so it reflects both what testers find and what practitioners see
        attackers doing.
      </p>
      <p>
        Each category is a bucket of many <Term id="cwe">CWE</Term> weaknesses. CWE (Common Weakness
        Enumeration) is a shared catalogue of software weakness types, run by MITRE; CWE-89, for
        example, is SQL injection.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The list's relatives ------------------------------------------------------------------------ */

export function Family() {
  const [s, set] = useSceneState<TopState>();
  const l = LISTS[s.list] ?? LISTS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The list's relatives"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {LISTS.map((x, i) => (
              <button
                key={x.name}
                type="button"
                aria-pressed={s.list === i}
                onClick={() => set({ list: i })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  s.list === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <motion.div
            key={l.name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-4 py-3 text-xs"
          >
            <p className="text-sm font-semibold">{l.name}</p>
            <p>{l.what}</p>
            <p className="text-muted mt-1">Top of the list: {l.top}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        OWASP itself says the Top 10 is primarily an awareness document, a bare minimum. Ticking off
        ten categories doesn&apos;t make an app secure, and it isn&apos;t a certification.
      </p>
      <p>
        For a checklist you can actually test against, OWASP points to <Term id="asvs">ASVS</Term>,
        the Application Security Verification Standard (version 5.0, May 2025): the building code to
        the Top 10&apos;s fire-safety leaflet. Sister lists cover APIs and AI apps.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which category? ----------------------------------------------------------------------------- */

export function WhichCategory() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which category?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="top10-category"
            prompt="Which OWASP Top 10:2025 category does each case belong to?"
            categories={[
              { id: "a01", label: "A01 Broken Access Control" },
              { id: "a05", label: "A05 Injection" },
              { id: "a07", label: "A07 Authentication Failures" },
            ]}
            items={[
              {
                id: "fa",
                label: "Changing a number in a link shows another customer's documents",
                category: "a01",
                why: "Missing permission check for that object.",
              },
              {
                id: "moveit",
                label: "A search box lets attackers run their own database queries",
                category: "a05",
                why: "SQL injection.",
              },
              {
                id: "nomfa",
                label: "A remote-access portal accepts a stolen password with no second factor",
                category: "a07",
                why: "Weak authentication.",
              },
              {
                id: "ssrf",
                label: "A server can be made to fetch its own cloud credentials",
                category: "a01",
                why: "SSRF now sits inside Broken Access Control.",
              },
              {
                id: "xss",
                label: "A comment field runs script in other visitors' browsers",
                category: "a05",
                why: "Cross-site scripting is injection.",
              },
              {
                id: "stuff",
                label: "Millions of leaked passwords are tried against a login page with no limits",
                category: "a07",
                why: "Credential stuffing.",
              },
            ]}
            explanation="Access control is about what you may do; injection is input becoming code; authentication is proving who you are."
          />
        </div>
      }
    >
      <p>Sort the cases.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["An awareness list", "The ten most important web risks, 2025 edition."],
  ["Access control is first", "Found in every app tested."],
  ["New in 2025", "Supply chain; exceptional conditions."],
  ["Data plus survey", "Eight from data, two from practitioners."],
  ["ASVS to verify", "The Top 10 is a minimum, not a certificate."],
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
      <p>Next: the classic injection attack, SQL injection, and the fix that ends it.</p>
    </StepLayout>
  );
}
