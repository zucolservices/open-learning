"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { cn } from "@/lib/cn";
import { DESIGN, INCIDENTS } from "./model";
import type { CapState } from "./state";

/* 1 ─ "Launch in a quarter" ----------------------------------------------------------------------- */

export function Memo() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“Launch in a quarter”"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-5 py-4 text-xs">
            <p className="text-muted text-[10px]">FROM: FOUNDER</p>
            <p className="mt-2">
              &ldquo;We&apos;re building <span className="font-semibold">PayLite</span>: customers
              save a card and pay local shops in a tap. We go live in a quarter. Make sure we
              don&apos;t end up in the news for the wrong reasons.&rdquo;
            </p>
          </div>
        </div>
      }
    >
      <p>
        You&apos;re the engineer responsible for security on a new payments app. It stores
        customers, their saved payment methods, and a running balance, and it has an admin panel for
        support staff. Money and card data make it a target from day one.
      </p>
      <p>
        First, five design decisions that span the whole track. Then five incidents from its first
        quarter, each modelled on how real payment breaches happened: some your design prevents
        outright, and for the rest you pick the fix that addresses the cause. No scores, just
        consequences.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Design the defences ------------------------------------------------------------------------- */

export function Design() {
  const [s, set] = useSceneState<CapState>();
  const design = s.design ?? {};
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Design the defences"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DESIGN.map((d) => (
            <div key={d.id} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">{d.prompt}</p>
              <div className="mt-1 flex flex-col gap-1">
                {d.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={design[d.id] === c.id}
                    onClick={() => set({ design: { ...design, [d.id]: c.id } })}
                    className={cn(
                      "rounded border px-2 py-1 text-left text-[11px]",
                      design[d.id] === c.id ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-muted text-[11px]">
            {Object.keys(design).length} of 5 decided. Your choices decide which incidents hit home.
          </p>
        </div>
      }
    >
      <p>
        Make the five calls. Each maps to a part of this track: identity and access, protecting card
        data, the browser and payment page, the delivery pipeline, and detection.
      </p>
      <p>There are no right-answer ticks here. The next step shows what each choice leads to.</p>
    </StepLayout>
  );
}

/* 3 ─ The first quarter ⭐ ------------------------------------------------------------------------ */

export function Incidents() {
  const [s, set] = useSceneState<CapState>();
  const design = s.design ?? {};
  const fixes = s.fixes ?? {};
  const prevented = (id: string) => {
    const d = DESIGN.find((x) => x.prevents === id);
    return !!d && d.choices.find((c) => c.id === design[d.id])?.good;
  };
  const open = INCIDENTS.filter((i) => !prevented(i.id));
  const fixedOk = open.filter((i) => i.fixes.find((f) => f.id === fixes[i.id])?.good).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The first quarter"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {INCIDENTS.map((inc) => {
            const pre = prevented(inc.id);
            const f = inc.fixes.find((x) => x.id === fixes[inc.id]);
            return (
              <div
                key={inc.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  pre
                    ? "border-good/50 bg-good/5"
                    : !f
                      ? "border-bad bg-bad/10"
                      : f.good
                        ? "border-good bg-good/10"
                        : "border-viz-compute bg-viz-compute/10",
                )}
              >
                <p className="font-semibold">
                  {inc.title}{" "}
                  {pre && (
                    <span className="text-good text-[10px] font-normal">
                      · prevented by your design
                    </span>
                  )}
                </p>
                {!pre && (
                  <>
                    <p className="text-muted mt-0.5">{inc.detail}</p>
                    <div className="mt-1 flex flex-col gap-1">
                      {inc.fixes.map((x) => (
                        <button
                          key={x.id}
                          type="button"
                          aria-pressed={fixes[inc.id] === x.id}
                          onClick={() => set({ fixes: { ...fixes, [inc.id]: x.id } })}
                          className={cn(
                            "rounded border px-2 py-1 text-left text-[11px]",
                            fixes[inc.id] === x.id ? "border-accent bg-accent-soft" : "border-line",
                          )}
                        >
                          {x.label}
                        </button>
                      ))}
                    </div>
                    {f && (
                      <p className="text-muted mt-1 text-[11px]">
                        {f.good ? "Fixed at the root. " : "A patch: the cause is still there. "}
                        {inc.real}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
          <p className="text-muted text-[11px]">
            {5 - open.length} prevented by design · {fixedOk} of {open.length} remaining fixed at
            the root.
          </p>
        </div>
      }
    >
      <p>
        Five incidents, each modelled on a real payment breach. The ones your design already
        prevents don&apos;t happen. For the rest, pick the fix that removes the cause rather than
        hiding the symptom.
      </p>
      <p>
        Notice the pattern in the weak fixes: patch the one thing you saw, encrypt a bit harder,
        read the logs afterwards. Root fixes change what you store, how you log in, what runs on the
        page, and how you watch.
      </p>
    </StepLayout>
  );
}

/* 4 ─ It happened to them ------------------------------------------------------------------------- */

export function Happened() {
  const items: [string, string][] = [
    [
      "British Airways, 2018",
      "Attackers altered one JavaScript file on the payment path and skimmed the card details of around 429,612 people over 15 days. The UK regulator fined BA £20 million.",
    ],
    [
      "Ticketmaster UK, 2018",
      "A third-party chat-bot on the payment page was compromised and used to steal card data. The regulator fined Ticketmaster £1.25 million.",
    ],
    [
      "Snowflake customers, 2024",
      "Attackers used passwords stolen by malware to log into about 165 companies' data accounts that had no multi-factor authentication. The platform wasn't breached; the customers' logins were.",
    ],
    [
      "Coinbase, 2025",
      "Overseas support contractors were bribed to hand over customer data, which was then used in scams. The company estimated the cost in the hundreds of millions.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="It happened to them"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        None of these were exotic. A tampered script, a weak third-party widget, logins with no
        second factor, a bribed insider: the exact cases your design choices were about.
      </p>
      <p>
        The lesson across them: protect the whole path, including code and people you don&apos;t
        control, and assume any single control can fail.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The whole track as a checklist -------------------------------------------------------------- */

export function Checklist() {
  const items: [string, string][] = [
    [
      "Threat model",
      "Draw the data flows and trust boundaries; find what can go wrong before building.",
    ],
    ["Secure design", "Least privilege, defence in depth, fail safely."],
    ["Input and output", "Parameterise queries, encode output, validate and parse safely."],
    [
      "Identity",
      "Strong passwords or passkeys, MFA, careful sessions, object-level authorisation.",
    ],
    [
      "The browser",
      "CSRF tokens, security headers and a strict CSP, especially on the payment page.",
    ],
    [
      "Server and data",
      "Guard against SSRF, TLS everywhere, encrypt at rest, hold as little card data as possible.",
    ],
    ["Pipeline", "Secrets in a vault, an SBOM and dependency scanning, SAST and DAST."],
    [
      "Detect and respond",
      "Log and alert, with an incident plan and the disclosure clock in mind.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The whole track as a checklist"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The whole track as a pre-launch checklist. With it, &ldquo;are we secure enough to go
        live?&rdquo; becomes a set of decisions you can point to, rather than a hope.
      </p>
      <p>
        Security isn&apos;t a feature you finish; it&apos;s a habit of asking, at every layer, what
        could go wrong and what you&apos;ll do about it.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Which part of the track? -------------------------------------------------------------------- */

export function WhereFrom() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which part of the track?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="capstone-appsec-fixes"
            prompt="Which area does each fix come from?"
            categories={[
              { id: "identity", label: "Identity and access" },
              { id: "web", label: "Browser and data" },
              { id: "ops", label: "Pipeline and response" },
            ]}
            items={[
              {
                id: "mfa",
                label: "Add phishing-resistant MFA to logins",
                category: "identity",
                why: "Authentication.",
              },
              {
                id: "idor",
                label: "Check every record belongs to the caller",
                category: "identity",
                why: "Access control.",
              },
              {
                id: "csp",
                label: "A strict CSP and script inventory on checkout",
                category: "web",
                why: "Security headers / XSS.",
              },
              {
                id: "token",
                label: "Tokenise cards instead of storing them",
                category: "web",
                why: "Protecting data.",
              },
              {
                id: "sbom",
                label: "Keep an SBOM and scan dependencies",
                category: "ops",
                why: "Supply chain.",
              },
              {
                id: "alert",
                label: "Alert on suspicious activity and rehearse a plan",
                category: "ops",
                why: "Detection and response.",
              },
            ]}
            explanation="Every fix traces to a part of the track: identity and access, the browser and data, or the pipeline and response."
          />
        </div>
      }
    >
      <p>Sort the fixes.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Design security in", "Threat model before you build."],
  ["Hold less, check more", "Don't store cards; check every request."],
  ["Protect the whole path", "Including scripts and people you don't control."],
  ["Secure the pipeline", "Secrets, dependencies, scanning."],
  ["Assume, then watch", "Something gets through; alert and respond."],
  ["A habit, not a feature", "Keep asking what could go wrong."],
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
        That&apos;s the Application Security track. You can look at a feature and see not just what
        it does, but how it could be abused, and build it so the common attacks simply don&apos;t
        work.
      </p>
    </StepLayout>
  );
}
