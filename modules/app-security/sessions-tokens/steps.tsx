"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { GUARDS, THREATS, setCookie, type Guard } from "./model";
import type { SessState } from "./state";

/* 1 ─ The cloakroom ticket ------------------------------------------------------------------------ */

export function Cloakroom() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The cloakroom ticket"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-4 text-4xl">
            <span>🧥</span>
            <span className="text-muted text-xl">→</span>
            <motion.span
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            >
              🎟️
            </motion.span>
          </div>
          <p className="text-muted max-w-xs text-center text-xs">
            No one checks your face when you hand back ticket 47. Whoever holds it gets the coat.
          </p>
        </div>
      }
    >
      <p>
        At a cloakroom you show who you are once, hand over your coat and get a numbered ticket.
        Later, the attendant doesn&apos;t check your face: whoever holds ticket 47 gets the coat.
      </p>
      <p>
        Websites work the same way. After you log in, the server gives your browser a{" "}
        <Term id="session">session</Term> ID, usually in a cookie, and sends it back with every
        request. Whoever holds it is you, no password or MFA needed. So the ticket needs as much
        care as the login.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Five ways to lose a session ⭐ -------------------------------------------------------------- */

export function StealSession() {
  const [s, set] = useSceneState<SessState>();
  const on = s.on ?? [];
  const toggle = (g: Guard) => set({ on: on.includes(g) ? on.filter((x) => x !== g) : [...on, g] });
  const left = THREATS.filter((t) => !t.stoppedBy.some((g) => on.includes(g))).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Five ways to lose a session"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {GUARDS.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={on.includes(g.id)}
                onClick={() => toggle(g.id)}
                title={g.detail}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  on.includes(g.id) ? "border-good bg-good/10" : "border-line",
                )}
              >
                {on.includes(g.id) ? "✓ " : ""}
                {g.name}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {THREATS.map((t) => {
              const ok = t.stoppedBy.some((g) => on.includes(g));
              return (
                <div
                  key={t.id}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    ok ? "border-good bg-good/10" : "border-bad bg-bad/10",
                  )}
                >
                  <p className="font-semibold">
                    {ok ? "⛔ " : "⚠ "}
                    {t.name}
                  </p>
                  <p className="text-muted">{ok ? t.note : t.how}</p>
                </div>
              );
            })}
          </div>
          <p className="bg-surface-2 overflow-x-auto rounded px-3 py-2 font-mono text-[11px]">
            {setCookie(on, s.sameSite)}
          </p>
          <p className={cn("text-sm font-semibold", left ? "text-bad" : "text-good")}>
            {left ? `${left} of 5 ways still work.` : "All five are blocked."}
          </p>
        </div>
      }
    >
      <p>
        Switch on protections and watch the cookie header build up. Each setting closes one way of
        stealing the ticket. The <code>__Host-</code> prefix appears once Secure is on: it tells the
        browser to accept the cookie only over HTTPS, for this exact host.
      </p>
      <p>
        Session IDs themselves must come from a secure random generator, with at least 64 bits of
        randomness (OWASP). Malware on the user&apos;s own device is the hardest case: Chrome&apos;s
        Device Bound Session Credentials, on Windows since early 2026, tie a session to a hardware
        key so copied cookies stop working elsewhere.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Inside a JSON Web Token --------------------------------------------------------------------- */

export function Jwt() {
  const [s, set] = useSceneState<SessState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Inside a JSON Web Token"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["Header", '{ "alg": "ES256", "typ": "JWT" }', "text-viz-meta"],
              [
                "Payload (readable by anyone)",
                '{ "sub": "asha", "role": "customer", "exp": 1791367200 }',
                "text-viz-data",
              ],
              ["Signature", "proves the first two parts weren't changed", "text-accent"],
            ].map(([t, d, c]) => (
              <div
                key={t}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-[11px]"
              >
                <p className={cn("font-semibold", c)}>{t}</p>
                <p className="text-muted mt-1 font-mono break-all">{d}</p>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.algFromToken}
              onChange={(e) => set({ algFromToken: e.target.checked })}
              className="accent-accent"
            />
            Server trusts the “alg” written inside the token
          </label>
          <motion.p
            key={String(s.algFromToken)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              s.algFromToken ? "border-bad bg-bad/10" : "border-good bg-good/10",
            )}
          >
            {s.algFromToken
              ? "Dangerous: some libraries once accepted “none” or a switched algorithm from the token itself, so a forged token could pass (Tim McLean, 2015)."
              : "Safe: the server decides which algorithm and key it accepts, and rejects anything else (RFC 8725)."}
          </motion.p>
        </div>
      }
    >
      <p>
        A <Term id="jwt">JWT</Term> (JSON Web Token, RFC 7519) carries claims such as who you are
        and when the token expires, plus a signature. Most JWTs are signed, not encrypted: anyone
        holding one can read it, so never put secrets inside.
      </p>
      <p>
        Two habits matter most. The server, not the token, chooses the algorithm. And because a
        self-contained token can&apos;t easily be taken back before it expires, keep access tokens
        short-lived and make refresh tokens revocable.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where should a token live? ------------------------------------------------------------------ */

const STORES: { id: "local" | "cookie" | "bff"; name: string; text: string; good: boolean }[] = [
  {
    id: "local",
    name: "localStorage",
    text: "Any script on the page can read it, including one injected through an XSS bug. OWASP says don't.",
    good: false,
  },
  {
    id: "cookie",
    name: "HttpOnly, Secure, SameSite cookie",
    text: "Scripts can't read it; the browser sends it only over HTTPS and only in the contexts you allow.",
    good: true,
  },
  {
    id: "bff",
    name: "Backend-for-frontend",
    text: "A small server holds the real tokens; the browser only has an HttpOnly session cookie for it.",
    good: true,
  },
];

export function WhereToKeep() {
  const [s, set] = useSceneState<SessState>();
  const st = STORES.find((x) => x.id === s.store) ?? STORES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where should a token live?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {STORES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.store === x.id}
                onClick={() => set({ store: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.store === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <motion.p
            key={st.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              st.good ? "border-good bg-good/10" : "border-bad bg-bad/10",
            )}
          >
            {st.text}
          </motion.p>
          <div className="flex gap-1.5 text-xs">
            <span className="text-muted self-center">SameSite:</span>
            {(["Strict", "Lax", "None"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={s.sameSite === v}
                onClick={() => set({ sameSite: v })}
                className={cn(
                  "rounded-full border px-3 py-1",
                  s.sameSite === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">
            {s.sameSite === "Strict"
              ? "Strict: never sent on requests from other sites, even links. Safest; can surprise users arriving from a link."
              : s.sameSite === "Lax"
                ? "Lax: sent when following a link to your site, not on other sites' background requests. A good default."
                : "None: sent everywhere (must also be Secure). Only for genuine cross-site needs."}{" "}
            Chrome and Edge treat unset cookies as Lax; Firefox and Safari don&apos;t, so always set
            it.
          </p>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">March 2023: a channel taken in 30 seconds</p>
            <p className="text-muted">
              A fake sponsorship “PDF” ran malware that copied the browser&apos;s session tokens,
              and attackers took over Linus Tech Tips&apos; YouTube channels without passwords or
              2FA.
            </p>
          </div>
        </div>
      }
    >
      <p>
        For browser apps, keep tokens where page scripts can&apos;t reach them. Also give users a
        new session ID at login and whenever their privileges change, and enforce idle and absolute
        timeouts on the server: OWASP suggests 2–5 minutes idle for high-value apps, 15–30 minutes
        for low-risk ones.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Strong or weak setting? --------------------------------------------------------------------- */

export function CookieChoices() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Strong or weak setting?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="session-settings"
            prompt="Is each session choice strong or weak?"
            categories={[
              { id: "strong", label: "Strong" },
              { id: "weak", label: "Weak" },
            ]}
            items={[
              {
                id: "httponly",
                label: "Session cookie marked HttpOnly and Secure",
                category: "strong",
                why: "Hidden from scripts; HTTPS only.",
              },
              {
                id: "local",
                label: "Access token kept in localStorage",
                category: "weak",
                why: "Readable by any script on the page.",
              },
              {
                id: "rotate",
                label: "A new session ID issued at login",
                category: "strong",
                why: "Defeats session fixation.",
              },
              {
                id: "forever",
                label: "Sessions that never expire",
                category: "weak",
                why: "Stolen tickets work forever.",
              },
              {
                id: "alg",
                label: "Accepting whatever algorithm a JWT names",
                category: "weak",
                why: "The server must choose.",
              },
              {
                id: "short",
                label: "Short-lived access tokens with revocable refresh tokens",
                category: "strong",
                why: "Limits the damage of a leak.",
              },
            ]}
            explanation="Treat the session like the password: hide it from scripts, keep it on HTTPS, rotate it, expire it, and let the server choose how tokens are checked."
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
  ["Whoever holds it is you", "Protect the session like the password."],
  ["Secure, HttpOnly, SameSite", "Plus the __Host- prefix."],
  ["Rotate and expire", "New ID at login; idle and absolute timeouts."],
  ["JWTs are readable", "Server picks the algorithm; keep them short-lived."],
  ["Keep tokens from scripts", "Not localStorage; cookies or a BFF."],
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
      <p>Next: being logged in doesn&apos;t mean being allowed. Broken access control.</p>
    </StepLayout>
  );
}
