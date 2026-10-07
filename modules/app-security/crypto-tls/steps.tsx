"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CRYPTO, HANDSHAKE, TRAFFIC } from "./model";
import type { TlsState } from "./state";

/* 1 ─ Postcard or sealed letter ------------------------------------------------------------------- */

export function Postcard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Postcard or sealed letter"
      stage={
        <div className="flex flex-1 items-center justify-center gap-5">
          {[
            [
              "📮",
              "Postcard",
              "Everyone who handles it can read it, and could change a word.",
              "border-bad bg-bad/10",
            ],
            [
              "✉️",
              "Sealed, signed letter",
              "Only the recipient reads it; a broken seal shows tampering; the signature proves who sent it.",
              "border-good bg-good/10",
            ],
          ].map(([e, t, d, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn("max-w-[11rem] rounded-xl border px-4 py-3 text-center text-xs", c)}
            >
              <p className="text-4xl">{e}</p>
              <p className="mt-1 font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Plain HTTP is a postcard: every router and Wi-Fi point between you and the site can read it
        and even rewrite it. HTTPS is a sealed, signed letter: encrypted so only the site can read
        it, tamper-evident, and signed so you know you&apos;re really talking to the site you meant.
      </p>
      <p>
        The seal is <Term id="tls">TLS</Term>, the protocol behind the padlock. This module is about
        what it does, how it sets up, and the handful of crypto choices that keep data safe on the
        way and at rest.
      </p>
    </StepLayout>
  );
}

/* 2 ─ On the café Wi-Fi ⭐ ------------------------------------------------------------------------ */

export function CafeWifi() {
  const [s, set] = useSceneState<TlsState>();
  return (
    <StepLayout
      eyebrow="Simulation"
      title="On the café Wi-Fi"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">The connection is:</span>
            <button
              type="button"
              aria-pressed={!s.https}
              onClick={() => set({ https: false })}
              className={cn(
                "rounded-full border px-3 py-1 font-mono",
                !s.https ? "border-bad bg-bad/10" : "border-line",
              )}
            >
              http://
            </button>
            <button
              type="button"
              aria-pressed={s.https}
              onClick={() => set({ https: true })}
              className={cn(
                "rounded-full border px-3 py-1 font-mono",
                s.https ? "border-good bg-good/10" : "border-line",
              )}
            >
              https://
            </button>
          </div>
          <p className="text-muted text-[11px]">
            What the person running the café Wi-Fi sees of your bank session:
          </p>
          <div className="border-line bg-surface overflow-hidden rounded-xl border">
            {TRAFFIC.map((l, i) => (
              <div
                key={l.label}
                className={cn(
                  "grid grid-cols-[9rem_1fr] gap-2 px-3 py-1.5 text-[11px]",
                  i > 0 && "border-line border-t",
                )}
              >
                <span className="text-muted">{l.label}</span>
                <motion.span
                  key={s.https ? "on" : "off"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "font-mono",
                    !s.https && i > 0 ? "text-bad" : s.https && i > 0 ? "text-good" : "text-fg",
                  )}
                >
                  {s.https ? l.https : l.http}
                </motion.span>
              </div>
            ))}
          </div>
          <p className={cn("text-xs", s.https ? "text-good" : "text-bad")}>
            {s.https
              ? "Over HTTPS the eavesdropper sees only which site you visited (and roughly how much data), never the contents."
              : "Over plain HTTP they read your password, your cookie and your balance, and could change the page on the way to you."}
          </p>
          <p className="text-subtle text-[10px]">An illustrative session.</p>
        </div>
      }
    >
      <p>
        You open your bank on café Wi-Fi. Flip the connection. On plain HTTP, whoever runs the
        network reads everything and can alter it. On HTTPS, TLS encrypts the contents; only the
        destination site is still visible, because the network needs it to route the traffic.
      </p>
      <p>
        This is why sites use HTTPS everywhere, not just on the login page, and send{" "}
        <Term id="hsts">HSTS</Term> so the browser refuses to drop back to HTTP. Over 95% of pages
        Chrome loads are now HTTPS.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How TLS sets up ----------------------------------------------------------------------------- */

export function Handshake() {
  const [s, set] = useSceneState<TlsState>();
  const step = Math.min(s.step, HANDSHAKE.length - 1);
  return (
    <StepLayout
      eyebrow="Step-through"
      title="How TLS sets up"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex justify-between text-[10px] font-semibold">
            <span>You (browser)</span>
            <span>The website</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {HANDSHAKE.map(([t, d], i) => (
              <motion.button
                key={t}
                type="button"
                onClick={() => set({ step: i })}
                animate={{ opacity: i <= step ? 1 : 0.3 }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  i === step ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  i === 4 && i <= step && "border-good bg-good/10",
                )}
              >
                <span className={cn("font-semibold", i % 2 ? "block text-right" : "")}>
                  {i + 1}. {t} {i % 2 ? "←" : i < 4 ? "→" : ""}
                </span>
                {i === step && <span className="text-muted mt-0.5 block">{d}</span>}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => set({ step: step - 1 })}
              className="border-line rounded-full border px-3 py-1 text-xs disabled:opacity-40"
              aria-label="Earlier step"
            >
              ← Earlier
            </button>
            <button
              type="button"
              disabled={step === HANDSHAKE.length - 1}
              onClick={() => set({ step: step + 1 })}
              className="border-line rounded-full border px-3 py-1 text-xs disabled:opacity-40"
              aria-label="Next step"
            >
              Next →
            </button>
          </div>
        </div>
      }
    >
      <p>
        Before any data flows, the browser and server do a short handshake. Click through it. The
        key idea: they agree on a shared secret key without ever sending it, so an eavesdropper who
        records everything still can&apos;t read the traffic.
      </p>
      <p>
        The <Term id="certificate">certificate</Term> is what proves identity. A certificate
        authority the browser trusts has signed a statement that this public key belongs to this
        site. A wrong name, an expired certificate or an untrusted signer is exactly when you see a
        browser warning, which is worth heeding.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Good and broken choices --------------------------------------------------------------------- */

export function CryptoChoices() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Good and broken choices"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-6 gap-px">
              {Array.from({ length: 36 }, (_, i) => {
                const penguin = [8, 9, 14, 15, 19, 20, 21, 22, 26, 27].includes(i);
                return (
                  <span key={i} className={cn("h-3 w-3", penguin ? "bg-fg" : "bg-surface-2")} />
                );
              })}
            </div>
            <p className="text-muted text-[11px]">
              ECB mode keeps identical blocks identical, so the shape leaks through the
              “encryption”. Authenticated modes don&apos;t.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["In transit", "TLS 1.3 protects data on the move."],
              ["At rest", "Encrypt stored data too, with keys kept apart from it."],
              [
                "Key management",
                "AWS KMS, Google Cloud KMS, Azure Key Vault, HashiCorp Vault. Envelope encryption: a master key in the vault wraps the data keys.",
              ],
              [
                "Post-quantum",
                "“Harvest now, decrypt later” is why Chrome already uses post-quantum key exchange for most traffic (NIST standards, Aug 2024).",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        TLS handles data in transit; data <Term id="encryption-at-rest">at rest</Term>, in databases
        and backups, needs encrypting too, with the keys stored somewhere safer than the data. A key
        management service does that and controls who can use each key.
      </p>
      <p>
        Two rules cover most mistakes: use modern authenticated ciphers (AES-GCM,
        ChaCha20-Poly1305), and never write your own crypto. The classic cautionary tale is
        Adobe&apos;s 2013 leak, where about 153 million passwords were encrypted with a weak mode
        instead of hashed, so identical passwords looked identical.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Strong or broken? --------------------------------------------------------------------------- */

export function StrongCrypto() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Strong or broken?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="crypto-choice"
            prompt="Is each a strong or a broken crypto choice?"
            categories={[
              { id: "strong", label: "Strong" },
              { id: "broken", label: "Broken" },
            ]}
            items={CRYPTO.map((c) => ({
              id: c.id,
              label: c.label,
              category: c.good ? "strong" : "broken",
              why: c.why,
            }))}
            explanation="Use TLS 1.3 and authenticated ciphers through trusted libraries, automate certificates, and never invent your own crypto or use ECB."
          />
        </div>
      }
    >
      <p>Sort the choices.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["HTTPS seals the postcard", "Encrypted, tamper-evident, identity-checked."],
  ["TLS 1.3, agree a secret key", "Without ever sending it."],
  ["Certificates prove identity", "Heed the warnings."],
  ["Don't roll your own crypto", "AES-GCM, ChaCha20-Poly1305; not ECB."],
  ["Encrypt at rest too", "Keys in a KMS; automate certificates."],
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
      <p>Next: keeping the keys themselves safe, with secrets management.</p>
    </StepLayout>
  );
}
