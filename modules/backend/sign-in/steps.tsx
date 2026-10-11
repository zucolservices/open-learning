"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { METHODS, type Method } from "./model";
import type { SignState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Doors() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Keys, fingerprints and a trusted friend"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["A password is a key", "Anyone who copies it can use it, anywhere you reused it."],
            [
              "A passkey is a fingerprint lock",
              "It only opens for you, and only at the right door.",
            ],
            [
              "Single sign-on is a trusted friend",
              "“I know her; let her in.” You rely on the friend to check properly.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        There are many ways to prove you&apos;re allowed in. Some can be copied; some can&apos;t;
        some hand the checking to someone else.
      </p>
      <p>
        <Term id="authentication">Authentication</Term> is the server&apos;s version: proving who a
        user is. What the server stores decides how bad a database leak would be.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------ */

export function Methods() {
  const [s, set] = useSceneState<SignState>();
  const m = METHODS.find((x) => x.id === s.method)!;
  const step = Math.min(s.step, m.steps.length - 1);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Sign in five ways, then leak the database"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {METHODS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.method === x.id}
                onClick={() => set({ method: x.id as Method, step: 0 })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.method === x.id ? "border-fg bg-surface-2" : "border-line-strong text-muted",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="grid gap-1">
            {m.steps.map((t, i) => (
              <motion.div
                key={`${m.id}-${i}`}
                animate={{ opacity: i <= step ? 1 : 0.3 }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  i === step ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="text-muted mr-2 font-mono">{i + 1}</span>
                {t}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => set({ step: step - 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Step back
            </button>
            <button
              type="button"
              disabled={step === m.steps.length - 1}
              onClick={() => set({ step: step + 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Next step
            </button>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted text-[10px]">The server stores</p>
            <p className="font-medium">{m.stored}</p>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={s.leaked} onChange={() => set({ leaked: !s.leaked })} />
            Simulate a database leak
          </label>
          {s.leaked && <p className={cn("text-xs", m.good ? "text-good" : "text-bad")}>{m.leak}</p>}
        </div>
      }
    >
      <p>
        Asha (made up) signs in to the café app. Step through each method, then simulate a database
        leak and see what an attacker would get.
      </p>
      <p>
        If you store passwords, store only a slow, salted{" "}
        <Term id="password-hash">password hash</Term>. Better still, offer passkeys or a trusted
        identity provider.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Password rules ------------------------------------------------------------------------------- */

export function Rules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Today's password rules"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "At least 15 characters",
              "When the password is the only factor; at least 8 when it's one part of multi-factor.",
            ],
            ["No forced character mixes", "No “must include a symbol” rules."],
            ["No scheduled changes", "Only force a change if there's evidence of compromise."],
            ["Block known-bad passwords", "Check against breached and common passwords."],
            ["Let people paste", "Password managers should work."],
            [
              "Hash with Argon2id",
              "OWASP lists several equally strong settings, such as 19 MiB of memory with 2 passes; bcrypt is for legacy systems.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
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
        NIST&apos;s digital identity guidelines (SP 800-63B-4, final July 2025) overturned many
        habits. Length beats complexity, and forced changes make passwords worse, not better.
      </p>
      <p>
        The same guidelines require at least one phishing-resistant option for higher-assurance
        sign-in.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Sessions and tokens -------------------------------------------------------------------------- */

export function Sessions() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="After sign-in: sessions, tokens and standards"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Server-side sessions",
              "A random ID in a cookie; the server looks it up. Easy to revoke.",
            ],
            [
              "Self-contained tokens (JWT)",
              "The token carries the claims. Can't be revoked early unless lifetimes are short or you keep a deny list.",
            ],
            [
              "Cookie flags",
              "HttpOnly, Secure, SameSite, and a __Host- name prefix; issue a new session ID after login.",
            ],
            [
              "OAuth 2.0 and OpenID Connect",
              "Standard sign-in with providers. OAuth 2.1 is still a draft; follow RFC 9700 (2025) for security.",
            ],
            [
              "Passkeys",
              "About 5 billion in use (FIDO Alliance, May 2026); WebAuthn Level 3 became a W3C Recommendation in August 2026.",
            ],
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
        Once someone is signed in, the server needs to recognise their next request. There&apos;s no
        single right answer between sessions and tokens; the trade-off is mainly how easily you can
        revoke access.
      </p>
      <p>
        Use a well-tested library or identity provider rather than writing sign-in from scratch.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SignCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Current or outdated?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backend-sign-in"
            prompt="Does each practice match current guidance?"
            categories={[
              { id: "current", label: "Current guidance" },
              { id: "outdated", label: "Outdated or harmful" },
            ]}
            items={[
              {
                id: "rotate",
                label: "Force everyone to change their password every 90 days",
                category: "outdated",
                why: "NIST says don't, without evidence of compromise.",
              },
              {
                id: "length",
                label: "Require 15+ characters when the password is the only factor",
                category: "current",
                why: "NIST SP 800-63B-4.",
              },
              {
                id: "symbol",
                label: "Require a capital letter, a number and a symbol",
                category: "outdated",
                why: "Composition rules are out.",
              },
              {
                id: "breach",
                label: "Reject passwords found in known breaches",
                category: "current",
                why: "Required by NIST.",
              },
              {
                id: "sha",
                label: "Store passwords as SHA-256 hashes",
                category: "outdated",
                why: "Too fast; use Argon2id.",
              },
            ]}
            explanation="Long passwords, no forced changes or symbol rules, breach checks, slow hashes. Better still: passkeys or a trusted provider."
          />
        </div>
      }
    >
      <p>Sort each practice.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Never store passwords", "Only slow, salted hashes."],
        ["Length over complexity", "15+ characters, no forced changes."],
        ["Prefer passkeys", "Nothing reusable to steal, phishing-resistant."],
        ["Or a trusted provider", "OpenID Connect."],
        ["Safe sessions", "Secure cookies, new ID after login."],
      ]}
    >
      <p>Next: once you know who someone is, what are they allowed to do?</p>
    </WrapStep>
  );
}
