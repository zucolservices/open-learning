"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ATTACKS, DEFENCES, PAIRS, outcome, type Def } from "./model";
import type { CsrfState } from "./state";

/* 1 ─ Someone else's order slip ------------------------------------------------------------------- */

export function LoyaltyCard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Someone else's order slip"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-bad bg-bad/10 w-full max-w-xs rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Order slip</p>
            <p>Deliver 40 TVs to: 9 Back Lane</p>
            <p className="text-muted mt-2">
              📎 stapled: Asha&apos;s loyalty card, “pay on account”
            </p>
          </div>
          <p className="text-muted max-w-xs text-center text-[11px]">
            The counter checks the card, not who wrote the slip.
          </p>
        </div>
      }
    >
      <p>
        A shop lets regulars order “on account”: hand in a slip with your loyalty card and the order
        is charged to you. The clerk checks the card, not who filled in the slip. So a crook who
        staples your card to their own slip can order anything in your name.
      </p>
      <p>
        Browsers do something similar. When any page makes your browser send a request to your bank,
        the browser attaches your bank cookies automatically. If the bank only checks the cookie, a
        page you merely visit can act as you. That&apos;s{" "}
        <Term id="csrf">cross-site request forgery</Term> (CSRF).
      </p>
    </StepLayout>
  );
}

/* 2 ─ Forge a transfer ⭐ ------------------------------------------------------------------------- */

export function ForgedTransfer() {
  const [s, set] = useSceneState<CsrfState>();
  const on = s.on ?? [];
  const toggle = (d: Def) => set({ on: on.includes(d) ? on.filter((x) => x !== d) : [...on, d] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Forge a transfer"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {DEFENCES.map((d) => (
              <label
                key={d.id}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  on.includes(d.id)
                    ? d.mistake
                      ? "border-bad bg-bad/10"
                      : "border-good bg-good/10"
                    : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.includes(d.id)}
                  onChange={() => toggle(d.id)}
                  className="accent-accent mt-0.5"
                  aria-label={d.name}
                />
                <span>
                  <span className="font-semibold">{d.name}</span>
                  <span className="text-muted block">{d.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-muted text-xs">
            Asha is logged in to yourbank.example and visits cheap-flights.example in another tab:
          </p>
          <div className="flex flex-col gap-1.5">
            {ATTACKS.map((a) => {
              const r = outcome(a.id, on);
              return (
                <motion.div
                  key={`${a.id}-${on.join()}`}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs",
                    r.ok ? "border-good bg-good/10" : "border-bad bg-bad/10",
                  )}
                >
                  <p className="font-semibold">
                    {r.ok ? "⛔ " : "⚠ "}
                    {a.name}
                  </p>
                  <p className="text-muted">{a.how}</p>
                  <p className={r.ok ? "text-good" : "text-bad"}>{r.text}</p>
                </motion.div>
              );
            })}
          </div>
          <p className="text-subtle text-[10px]">
            A rules-based simulation; the sites are placeholders.
          </p>
        </div>
      }
    >
      <p>
        Switch defences on one at a time. A secret CSRF token in each form is the classic fix: the
        attacker&apos;s page can make the browser send a request, but it can&apos;t know the token.
        Use your framework&apos;s built-in CSRF protection.
      </p>
      <p>
        Notice that <Term id="samesite">SameSite</Term>=Lax doesn&apos;t help if the bank changes
        data on GET, because cookies are still sent when you follow a link. And watch what the CORS
        mistake does to the third request: it throws away the browser&apos;s strongest protection.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What counts as the same site? --------------------------------------------------------------- */

export function Origins() {
  const [s, set] = useSceneState<CsrfState>();
  const p = PAIRS[s.pair] ?? PAIRS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What counts as the same site?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {PAIRS.map((x, i) => (
            <button
              key={x.b}
              type="button"
              aria-pressed={s.pair === i}
              onClick={() => set({ pair: i })}
              className={cn(
                "rounded-lg border px-3 py-2 text-left font-mono text-[11px]",
                s.pair === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              {x.a} &nbsp;vs&nbsp; {x.b}
            </button>
          ))}
          <motion.div
            key={s.pair}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm",
              p.same ? "border-good bg-good/10" : "border-viz-compute bg-viz-compute/10",
            )}
          >
            <span className="font-semibold">{p.same ? "Same origin." : "Different origins."}</span>{" "}
            <span className="text-xs">{p.why}</span>
          </motion.div>
        </div>
      }
    >
      <p>
        Browsers keep sites apart with the <Term id="same-origin-policy">same-origin policy</Term>,
        which dates from Netscape in the mid-1990s, when JavaScript arrived. An origin is the
        scheme, host and port together. Script from one origin can send requests to another, but it
        can&apos;t read the replies.
      </p>
      <p>
        That gap, “can send but can&apos;t read”, is exactly what CSRF exploits: the attacker
        doesn&apos;t need to read anything if the request itself moves the money.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What CORS does, and doesn't ----------------------------------------------------------------- */

const CORS_STEPS: [string, string][] = [
  [
    "The page asks",
    "app.example's script wants to call api.example with a JSON body and a custom header.",
  ],
  [
    "Preflight",
    "Because a plain form couldn't send that, the browser first sends OPTIONS: “may app.example do this?”",
  ],
  [
    "The server answers",
    "Access-Control-Allow-Origin: https://app.example (an explicit allow-list, never a copy of whatever arrives).",
  ],
  ["The real request", "Only now is the request sent, and only now may the script read the reply."],
];

export function CorsExplained() {
  const [s, set] = useSceneState<CsrfState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="What CORS does, and doesn't"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {CORS_STEPS.map(([t, d], i) => (
            <motion.button
              key={t}
              type="button"
              onClick={() => set({ cors: i })}
              animate={{ opacity: i <= s.cors ? 1 : 0.35 }}
              className={cn(
                "grid grid-cols-[1.5rem_1fr] rounded-lg border px-3 py-2 text-left text-xs",
                i === s.cors ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <span className="text-accent font-mono">{i + 1}</span>
              <span>
                <span className="font-semibold">{t}</span>
                <span className="text-muted block">{d}</span>
              </span>
            </motion.button>
          ))}
          <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            CORS is not a CSRF defence: form-style requests are sent with cookies whatever the CORS
            settings. CORS only controls who may read responses.
          </div>
        </div>
      }
    >
      <p>
        <Term id="cors">CORS</Term> (cross-origin resource sharing) lets a server loosen the
        same-origin policy on purpose, for example so its own front-end on another domain can call
        its API. Click through a preflight.
      </p>
      <p>
        The classic mistake, described by James Kettle in 2016, is reflecting any Origin back while
        allowing credentials, which trusts every website on the internet. CSRF left the OWASP Top 10
        in 2017 because frameworks now build in defences, yet it is still number three in
        MITRE&apos;s 2025 CWE Top 25.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Does it stop CSRF? -------------------------------------------------------------------------- */

export function StopsCsrf() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Does it stop CSRF?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="stops-csrf"
            prompt="Does each measure help against cross-site request forgery?"
            categories={[
              { id: "yes", label: "Helps" },
              { id: "no", label: "Doesn't" },
            ]}
            items={[
              {
                id: "token",
                label: "A CSRF token checked on every state-changing request",
                category: "yes",
                why: "The attacker can't know it.",
              },
              {
                id: "cors",
                label: "A strict CORS allow-list",
                category: "no",
                why: "CORS controls reading, not sending.",
              },
              {
                id: "fetch",
                label: "Rejecting POSTs whose Sec-Fetch-Site is cross-site",
                category: "yes",
                why: "The browser reports where the request came from.",
              },
              {
                id: "https",
                label: "Serving the site over HTTPS",
                category: "no",
                why: "Essential, but unrelated to forged requests.",
              },
              {
                id: "samesite",
                label: "SameSite=Strict session cookies",
                category: "yes",
                why: "A strong extra layer.",
              },
              {
                id: "hidden",
                label: "Hiding the transfer form from the menu",
                category: "no",
                why: "Attackers don't need your menu.",
              },
            ]}
            explanation="Tokens and Fetch Metadata checks stop forged requests; SameSite adds a layer; CORS and HTTPS solve different problems."
          />
        </div>
      }
    >
      <p>Sort the measures.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Browsers send cookies anywhere", "Any page can trigger a request to your site."],
  ["Tokens stop forgeries", "Plus Sec-Fetch-Site checks."],
  ["SameSite is a layer", "Set it yourself; not all browsers default to Lax."],
  ["No changes on GET", "Links shouldn't move money."],
  ["CORS is about reading", "Explicit allow-lists; never reflect any origin."],
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
      <p>Next: security headers, instructions that tell the browser how to protect your pages.</p>
    </StepLayout>
  );
}
