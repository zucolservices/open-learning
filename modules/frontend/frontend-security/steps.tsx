"use client";

import { motion } from "motion/react";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, INCIDENTS } from "./model";
import type { SecState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Noticeboard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The café noticeboard"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["A noticeboard anyone can pin to", "Most notes are lost cats and yoga classes."],
            [
              "One note says “Staff: leave the till keys here”",
              "It looks official. Nobody checks who pinned it.",
            ],
            ["The fix", "Notes go behind glass; the manager pins them, and only after reading."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 1 ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A public noticeboard is useful until someone pins a note that looks like it came from the
        management. People trust it because of where it&apos;s posted.
      </p>
      <p>
        Web pages face the same problem. If a page shows what visitors type without care, an
        attacker&apos;s text can turn into code that runs with the site&apos;s authority.
        That&apos;s <Term id="xss">cross-site scripting</Term>. This module is a rules-based
        simulation; attacks are described, never shown.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Defend ⭐ ------------------------------------------------------------------------------------ */

export function Defend() {
  const [s, set] = useSceneState<SecState>();
  const done = DECISIONS.every((d) => d.options.find((o) => o.id === s.picks[d.id])?.blocks);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Defend a comment widget and sign-in"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DECISIONS.map((d, i) => {
            const pick = d.options.find((o) => o.id === s.picks[d.id]);
            return (
              <div
                key={d.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">
                  {i + 1}. {d.title}
                </p>
                <p className="text-muted text-[11px]">Attack (described): {d.attack}</p>
                <div className="mt-1 grid gap-1">
                  {d.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={pick?.id === o.id}
                      onClick={() => set({ picks: { ...s.picks, [d.id]: o.id } })}
                      className={cn(
                        "rounded-md border px-2 py-1 text-left text-[11px]",
                        pick?.id === o.id
                          ? o.blocks
                            ? "border-good bg-good/15"
                            : "border-bad bg-bad/10"
                          : "border-line hover:border-line-strong",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p
                    className={cn(
                      "mt-1 flex items-start gap-1 text-[11px]",
                      pick.blocks ? "text-good" : "text-bad",
                    )}
                  >
                    {pick.blocks ? (
                      <ShieldCheck className="mt-px size-3.5 shrink-0" />
                    ) : (
                      <ShieldAlert className="mt-px size-3.5 shrink-0" />
                    )}
                    {pick.outcome}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <p className="text-good text-xs">
              Four layers: escaping, a strict CSP, an unreadable session cookie and careful
              dependencies. Any one can fail; together they hold.
            </p>
          )}
        </div>
      }
    >
      <p>
        Four decisions for a café site&apos;s comment widget and sign-in. For each, an attack is
        described. Choose a defence and see what happens.
      </p>
      <p>
        Good security is layered: assume one defence will eventually fail, and make sure the next
        one catches it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Browser defences ----------------------------------------------------------------------------- */

export function Defences() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The browser's own defences"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Framework escaping",
              "On by default. The risk is the escape hatches: dangerouslySetInnerHTML, v-html, {@html}, bypassSecurityTrust…",
            ],
            [
              "Content Security Policy",
              "A strict, nonce-based policy refuses scripts the server didn't put there.",
            ],
            [
              "Trusted Types",
              "Forces risky DOM writes through vetted code. In every major browser since February 2026.",
            ],
            [
              "Sanitizer API (setHTML)",
              "Safely inserts HTML; in Chrome and Firefox, not yet Safari.",
            ],
            ["Cookie flags", "HttpOnly, Secure, and an explicit SameSite."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A <Term id="csp">Content Security Policy</Term> is a header telling the browser which
        scripts may run. CORS is often confused with security too: it only controls which other
        sites may read your responses, and it doesn&apos;t stop requests being sent.
      </p>
      <p>In the OWASP Top 10 for 2025, cross-site scripting sits under Injection (A05).</p>
    </StepLayout>
  );
}

/* 4 ─ Supply chain --------------------------------------------------------------------------------- */

export function SupplyChain() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When the attack comes through your dependencies"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {INCIDENTS.map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-muted w-24 shrink-0 font-mono text-[10.5px]">{d}</span>
              <span>{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Frontend code ships hundreds of packages to every visitor. In 2025 OWASP added Software
        Supply Chain Failures to its Top 10 (A03), after a string of npm incidents.
      </p>
      <p>
        Habits that help: commit lockfiles, install with npm ci, review new dependencies, restrict
        install scripts in CI, use Subresource Integrity for third-party scripts, and wait a few
        days before adopting brand-new versions.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SecCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Real protection or false comfort?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-security"
            prompt="Does each measure really protect users?"
            categories={[
              { id: "real", label: "Real protection" },
              { id: "false", label: "False comfort" },
            ]}
            items={[
              {
                id: "httponly",
                label: "Session cookie marked HttpOnly",
                category: "real",
                why: "Scripts can't read it.",
              },
              {
                id: "minify",
                label: "Hiding an API secret in minified JavaScript",
                category: "false",
                why: "Anything sent to the browser can be read.",
              },
              {
                id: "csp",
                label: "A strict, nonce-based Content Security Policy",
                category: "real",
                why: "Blocks injected scripts.",
              },
              {
                id: "cors",
                label: "A CORS header, to stop attackers calling the API",
                category: "false",
                why: "CORS limits who can read responses in browsers; requests still arrive.",
              },
              {
                id: "clientval",
                label: "Validating input only in the browser",
                category: "false",
                why: "Attackers skip the browser entirely.",
              },
            ]}
            explanation="Anything in the browser can be read or bypassed. Real protections are escaping, strict CSP, HttpOnly cookies and server-side checks."
          />
        </div>
      }
    >
      <p>Sort each measure.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Treat input as text", "Escape by default; sanitise if you must allow HTML."],
        ["Add a strict CSP", "Nonces and Trusted Types."],
        ["Protect the session", "HttpOnly, Secure, explicit SameSite."],
        ["Nothing secret in the browser", "And validate on the server."],
        ["Guard your dependencies", "Lockfiles, reviews, patience."],
      ]}
    >
      <p>That ends the chapter. Next: the capstone, rescuing a slow, broken page.</p>
    </WrapStep>
  );
}
