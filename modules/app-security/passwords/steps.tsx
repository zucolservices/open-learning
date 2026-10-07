"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CANDIDATES, STORAGES, USERS, crackSeconds, human, perUserSeconds } from "./model";
import type { PwState } from "./state";

/* 1 ─ A one-way grinder --------------------------------------------------------------------------- */

export function Grinder() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A one-way grinder"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-3 text-3xl">
            <span>🌶️</span>
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⚙️
            </motion.span>
            <span>🟤</span>
          </div>
          <p className="text-muted max-w-xs text-center text-xs">
            Easy to grind chillies into powder. Impossible to turn the powder back into chillies.
            But you can grind a guess and compare.
          </p>
        </div>
      }
    >
      <p>
        You can grind whole spices into powder in seconds, but no one can turn powder back into
        whole spices. To check what someone ground, you grind your own guess and compare the
        powders.
      </p>
      <p>
        That&apos;s a <Term id="password-hash">password hash</Term>. The server stores only the
        powder. At login it grinds what you typed and compares. If the database leaks, attackers get
        powder, not passwords, and must grind guesses one by one. How long that takes depends on how
        the grinding was done.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Crack a leaked table ⭐ --------------------------------------------------------------------- */

export function CrackRace() {
  const [s, set] = useSceneState<PwState>();
  const per = perUserSeconds(s.storage);
  const all = crackSeconds(s.storage);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Crack a leaked table"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            {STORAGES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.storage === x.id}
                onClick={() => set({ storage: x.id })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.storage === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="font-semibold">{x.name}</span>{" "}
                <span className="text-muted">· {x.how}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.strong}
              onChange={(e) => set({ strong: e.target.checked })}
              className="accent-accent"
            />
            Asha uses a long, unique passphrase (not on any list)
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <motion.div
              key={`${s.storage}-${s.strong}`}
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                s.strong && s.storage !== "plain"
                  ? "border-good bg-good/10"
                  : per < 3600
                    ? "border-bad bg-bad/10"
                    : "border-good bg-good/10",
              )}
            >
              <p className="text-muted text-[10px] uppercase">Asha&apos;s password falls in</p>
              <p className="text-base font-semibold">
                {s.strong && s.storage !== "plain" ? "never, with a guess list" : human(per)}
              </p>
            </motion.div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                all < 86400 ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              <p className="text-muted text-[10px] uppercase">
                Testing the list against all {USERS.toLocaleString("en-IN")} users
              </p>
              <p className="text-base font-semibold">{human(all)}</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            One RTX 5090 trying the billion most likely passwords: about 220 billion MD5 guesses a
            second, about 9,500 bcrypt (cost 10) guesses a second (estimated from hashcat&apos;s
            cost-5 benchmark). Plain-text tables need no cracking at all.
          </p>
        </div>
      }
    >
      <p>
        A database of a million users has leaked. Pick how it stored passwords. A fast hash with no
        salt is cracked almost as quickly as plain text: one pass over the guess list unlocks
        everyone with a common password.
      </p>
      <p>
        A <Term id="salt">salt</Term>, a random value stored next to each hash, forces a separate
        pass per user. A slow hash makes every guess thousands of times more expensive. Together
        they turn hours into centuries. And Asha&apos;s long, unique passphrase is safe either way,
        because it isn&apos;t on anyone&apos;s list.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Long, not complicated ----------------------------------------------------------------------- */

export function ModernRules() {
  const [s, set] = useSceneState<PwState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Long, not complicated"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {(["old", "nist"] as const).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={s.policy === p}
                onClick={() => set({ policy: p })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.policy === p ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {p === "old"
                  ? "Old rules: symbols, capitals, change every 90 days"
                  : "NIST 2025 rules"}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {CANDIDATES.map((c) => {
              const [ok, why] = s.policy === "old" ? c.old : c.nist;
              return (
                <motion.div
                  key={`${s.policy}-${c.pw}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "grid grid-cols-[1.5rem_1fr] rounded-lg border px-3 py-2 text-xs",
                    ok ? "border-good bg-good/10" : "border-bad bg-bad/10",
                  )}
                >
                  <span>{ok ? "✓" : "✗"}</span>
                  <span>
                    <span className="font-mono">{c.pw}</span>{" "}
                    <span className="text-muted">— {why}</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
          <Code>{`# Python: Argon2id via argon2-cffi (OWASP's first choice)
from argon2 import PasswordHasher
ph = PasswordHasher()            # salted; parameters stored in the hash
stored = ph.hash(password)
ph.verify(stored, attempt)       # raises an error if it doesn't match`}</Code>
        </div>
      }
    >
      <p>
        NIST&apos;s 2025 guidance (SP 800-63B, revision 4) turned the old rules around: at least 15
        characters when a password is the only factor (8 with a second factor), no forced symbols or
        capitals, no forced changes every 90 days, and a check against lists of common and breached
        passwords. Let people paste and use password managers.
      </p>
      <p>
        On the server, OWASP&apos;s first choice for storage is Argon2id, then scrypt; bcrypt is
        fine for existing systems. Never write your own scheme.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Has this password leaked? ------------------------------------------------------------------- */

export function BreachCheck() {
  const [s, set] = useSceneState<PwState>();
  const steps = [
    [
      "Your browser hashes the new password",
      "SHA-1 → 5BAA6 1E4C9B93F3F0682250B6CF8331B7EE68FD8 (an example)",
    ],
    ["Sends only the first 5 characters", "5BAA6 — shared by hundreds of different hashes"],
    [
      "The service returns every hash starting with them",
      "a list of hundreds of endings, with breach counts",
    ],
    [
      "Your code compares locally",
      "Found? Ask for a different password. The service never saw it.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Has this password leaked?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {steps.map(([t, d], i) => (
              <motion.button
                key={t}
                type="button"
                onClick={() => set({ hibp: i })}
                animate={{ opacity: i <= s.hibp ? 1 : 0.35 }}
                className={cn(
                  "grid grid-cols-[1.5rem_1fr] rounded-lg border px-3 py-2 text-left text-xs",
                  i === s.hibp ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="text-accent font-mono">{i + 1}</span>
                <span>
                  <span className="font-semibold">{t}</span>
                  <span className="text-muted block font-mono text-[10px]">{d}</span>
                </span>
              </motion.button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["RockYou, 2009", "32 million passwords stored as plain text."],
              ["LinkedIn, 2012", "Unsalted SHA-1; about 117 million hashes surfaced in 2016."],
              [
                "Credential stuffing",
                "A median 19% of daily login attempts at big sign-in providers (Verizon 2025).",
              ],
            ].map(([t, d]) => (
              <div
                key={t}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-[11px]"
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Billions of leaked passwords circulate, and attackers replay them on other sites:{" "}
        <Term id="credential-stuffing">credential stuffing</Term>. So check new passwords against
        breached lists. Have I Been Pwned&apos;s Pwned Passwords service does it without ever
        learning the password. Click through the four steps.
      </p>
      <p>
        Also limit failed logins per account (NIST caps it at 100) and offer a second factor, the
        next module&apos;s topic.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Good practice or not? ----------------------------------------------------------------------- */

export function PasswordPractice() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good practice or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="password-practice"
            prompt="Is each a good practice for passwords today?"
            categories={[
              { id: "good", label: "Good" },
              { id: "bad", label: "Bad" },
            ]}
            items={[
              {
                id: "argon",
                label: "Store passwords with Argon2id",
                category: "good",
                why: "Salted and deliberately slow.",
              },
              {
                id: "sha",
                label: "Store a SHA-256 hash of each password",
                category: "bad",
                why: "Fast hashes are cheap to crack.",
              },
              {
                id: "rotate",
                label: "Force everyone to change passwords every 90 days",
                category: "bad",
                why: "NIST says not to; change on evidence of a leak.",
              },
              {
                id: "breach",
                label: "Reject passwords found in breach lists",
                category: "good",
                why: "Attackers try those first.",
              },
              {
                id: "paste",
                label: "Block pasting into the password field",
                category: "bad",
                why: "Breaks password managers.",
              },
              {
                id: "long",
                label: "Allow passphrases of 64 characters or more",
                category: "good",
                why: "Length is what makes passwords strong.",
              },
            ]}
            explanation="Long passwords, breach checks, slow salted hashes and password managers; no composition rules or forced rotation."
          />
        </div>
      }
    >
      <p>Sort the practices.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Store hashes, never passwords", "Salted and slow: Argon2id, scrypt, bcrypt."],
  ["Speed is the enemy", "Fast hashes fall in hours; slow ones take centuries."],
  ["Long, not complicated", "15+ characters; no forced rotation."],
  ["Check breach lists", "Privately, with k-anonymity."],
  ["Limit and add factors", "Rate limits, then MFA."],
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
      <p>Next: going beyond the password with MFA and passkeys.</p>
    </StepLayout>
  );
}
