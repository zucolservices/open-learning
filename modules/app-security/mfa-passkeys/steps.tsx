"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { METHODS, PASSKEY_STEPS, attack } from "./model";
import type { MfaState } from "./state";

/* 1 ─ A key that fits one door -------------------------------------------------------------------- */

export function RightDoor() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A key that fits one door"
      stage={
        <div className="flex flex-1 items-center justify-center gap-6">
          {[
            ["🏠", "Your front door", "fits", "border-good bg-good/10"],
            ["🏚️", "A perfect fake door", "won't turn", "border-bad bg-bad/10"],
          ].map(([e, t, k, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn("rounded-xl border px-5 py-4 text-center text-xs", c)}
            >
              <p className="text-4xl">{e}</p>
              <p className="mt-1 font-semibold">{t}</p>
              <p className="text-muted">🔑 {k}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A password is like telling the doorman a secret word: anyone who overhears it, or tricks you
        into saying it at a fake door, can use it. A key is better, but a clever crook can still ask
        you to lend it. The best key physically fits only your own door, so a fake door, however
        perfect, gets nothing.
      </p>
      <p>
        <Term id="mfa">Multi-factor authentication</Term> adds a second proof beyond the password,
        and stops most password-only attacks. But kinds of MFA differ a lot, and only some, such as{" "}
        <Term id="passkey">passkeys</Term>, fit just one door.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Phish three kinds of MFA ⭐ ----------------------------------------------------------------- */

export function RelayAttack() {
  const [s, set] = useSceneState<MfaState>();
  const r = attack(s.method);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Phish three kinds of MFA"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={s.method === m.id}
                onClick={() => set({ method: m.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.method === m.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {m.name}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {r.steps.map(([t, k], i) => (
              <motion.div
                key={`${s.method}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 * i }}
                className={cn(
                  "grid grid-cols-[1.5rem_1fr] rounded-lg border px-3 py-2 text-xs",
                  k === "bad"
                    ? "border-bad/60 bg-bad/5"
                    : k === "stop"
                      ? "border-good bg-good/10"
                      : "border-line bg-surface",
                )}
              >
                <span className="text-accent font-mono">{i + 1}</span>
                {t}
              </motion.div>
            ))}
          </div>
          <motion.p
            key={s.method}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 * r.steps.length }}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-semibold",
              r.phished ? "border-bad bg-bad/10 text-bad" : "border-good bg-good/10 text-good",
            )}
          >
            {r.verdict}
          </motion.p>
          <p className="text-subtle text-[10px]">
            A simplified, rules-based story of an adversary-in-the-middle relay. The domains are
            placeholders.
          </p>
        </div>
      }
    >
      <p>
        Since 2022, phishing kits such as Evilginx sit between the victim and the real site, passing
        everything through and keeping the login session at the end. Microsoft saw one such campaign
        target more than 10,000 organisations. Try each method.
      </p>
      <p>
        Codes and push approvals rely on the person noticing the fake domain. A passkey
        doesn&apos;t: the browser itself refuses to use it anywhere but the site it was made for.
        That&apos;s what NIST means by phishing-resistant: protection “without relying on the
        vigilance” of the user.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Know, have, are ----------------------------------------------------------------------------- */

export function Factors() {
  const cols: [string, string, string[]][] = [
    ["🧠", "Something you know", ["Password", "PIN"]],
    ["📱", "Something you have", ["Phone with an app", "Security key", "Device holding a passkey"]],
    ["👆", "Something you are", ["Fingerprint", "Face"]],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Know, have, are"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {cols.map(([e, t, xs], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-3 text-xs"
              >
                <p className="text-2xl">{e}</p>
                <p className="font-semibold">{t}</p>
                <ul className="text-muted mt-1 list-disc pl-4">
                  {xs.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-viz-compute bg-viz-compute/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">SMS codes are “restricted”</p>
              <p className="text-muted">
                NIST&apos;s 2025 guidance still allows them, but only with the risk accepted and a
                better option offered.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Push bombing</p>
              <p className="text-muted">
                In September 2022 attackers with a contractor&apos;s password sent repeated approval
                requests until one was accepted, and got into Uber.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        MFA means proofs of at least two different kinds. Two passwords aren&apos;t two factors. A
        fingerprint usually unlocks a key on your device rather than travelling to the website
        itself.
      </p>
      <p>
        Any MFA is far better than none. But if your users are worth targeting, aim for
        phishing-resistant methods, and if you use push approvals, turn on number matching, which
        Microsoft made mandatory in its Authenticator app in May 2023.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How a passkey works ------------------------------------------------------------------------- */

export function HowPasskeys() {
  const [s, set] = useSceneState<MfaState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="How a passkey works"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {PASSKEY_STEPS.map(([t, d], i) => (
            <motion.button
              key={t}
              type="button"
              onClick={() => set({ pk: i })}
              animate={{ opacity: i <= s.pk ? 1 : 0.35 }}
              className={cn(
                "grid grid-cols-[1.5rem_1fr] rounded-lg border px-3 py-2 text-left text-xs",
                i === s.pk
                  ? i === 3
                    ? "border-good bg-good/10"
                    : "border-accent bg-accent-soft"
                  : "border-line bg-surface",
              )}
            >
              <span className="text-accent font-mono">{i + 1}</span>
              <span>
                <span className="font-semibold">{t}</span>
                <span className="text-muted block">{d}</span>
              </span>
            </motion.button>
          ))}
          <p className="text-muted text-xs">
            FIDO Alliance estimate: about 5 billion passkeys in use by May 2026.
          </p>
        </div>
      }
    >
      <p>
        A passkey uses public-key cryptography: a pair of keys where one signs and the other only
        checks. Click through. The site never holds anything worth stealing, and there&apos;s
        nothing for a person to type into the wrong page.
      </p>
      <p>
        Apple, Google and Microsoft committed to passkeys in May 2022. The standard behind them,
        WebAuthn, reached Level 3 as a W3C Recommendation in August 2026. In India, the RBI&apos;s
        2025 rules for digital payments, in force since April 2026, require two factors with one
        unique to each transaction, and open the door to alternatives to SMS codes.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Phishing-resistant or not? ------------------------------------------------------------------ */

export function PhishingResistant() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Phishing-resistant or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="phishing-resistant"
            prompt="Which of these resist a lookalike-site relay?"
            categories={[
              { id: "yes", label: "Phishing-resistant" },
              { id: "no", label: "Can be phished" },
            ]}
            items={[
              {
                id: "passkey",
                label: "A passkey in a password manager",
                category: "yes",
                why: "Tied to the real site by the browser.",
              },
              {
                id: "key",
                label: "A FIDO2 security key",
                category: "yes",
                why: "Same origin binding.",
              },
              {
                id: "sms",
                label: "A code sent by SMS",
                category: "no",
                why: "Typed into the fake page and relayed.",
              },
              {
                id: "totp",
                label: "A code from an authenticator app",
                category: "no",
                why: "Still typed by a person.",
              },
              {
                id: "push",
                label: "A push approval",
                category: "no",
                why: "Approves the attacker's session.",
              },
              {
                id: "number",
                label: "Push with number matching",
                category: "no",
                why: "Stops fatigue, not relays.",
              },
            ]}
            explanation="Only methods bound to the real site by the browser, such as passkeys and FIDO2 security keys, resist relay phishing."
          />
        </div>
      }
    >
      <p>Sort the methods.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Any MFA beats none", "Two different kinds of proof."],
  ["Codes can be relayed", "Phishing kits sit in the middle."],
  ["Push needs context", "Number matching against fatigue."],
  ["Passkeys fit one door", "The browser checks the site."],
  ["SMS is restricted", "Allowed, but offer something better."],
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
      <p>Next: what keeps you logged in after the login, and how sessions get stolen.</p>
    </StepLayout>
  );
}
