"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, KeyRound } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES, TOKENS, encoded, type Actor } from "./model";
import type { AuthState } from "./state";

/* 1 ─ The valet key ------------------------------------------------------------------------------- */

export function ValetKey() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The valet key"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-bad/40 bg-bad/5 flex flex-col gap-2 rounded-xl border px-4 py-3">
            <KeyRound className="text-bad size-5" />
            <p className="font-semibold">Your master key</p>
            <p className="text-muted text-sm">Opens the car, the boot and the glovebox, forever.</p>
          </div>
          <div className="border-good/40 bg-good/5 flex flex-col gap-2 rounded-xl border px-4 py-3">
            <KeyRound className="text-good size-5" />
            <p className="font-semibold">A valet key</p>
            <p className="text-muted text-sm">
              Drives the car a short distance. No boot, no glovebox, and you can cancel it.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Some cars come with a valet key: enough to park the car, nothing more. Eran Hammer, one of
        OAuth&apos;s original authors, used it in 2007 to explain the idea: give an app a limited,
        revocable key, never your master key.
      </p>
      <p>
        <Term id="oauth">OAuth 2.0</Term> (RFC 6749, 2012) is how a budgeting app reads your bank
        transactions without ever learning your bank password. You sign in at the bank; the app gets
        an <Term id="access-token">access token</Term> limited to what you agreed, for a short time.
        First, though, the API needs to know who&apos;s calling at all:{" "}
        <Term id="authentication">authentication</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Sign in with PKCE ⭐ ------------------------------------------------------------------------ */

const ACTORS: { id: Actor; label: string }[] = [
  { id: "user", label: "User" },
  { id: "app", label: "Shop app" },
  { id: "auth", label: "Auth server" },
  { id: "api", label: "Orders API" },
];

export function OAuthFlow() {
  const [s, set] = useSceneState<AuthState>();
  const i = s.frame ?? 0;
  const f = FRAMES[i];
  const idx = (a: Actor) => ACTORS.findIndex((x) => x.id === a);
  const a = idx(f.from);
  const b = idx(f.to);
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Sign in with PKCE"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="relative grid grid-cols-4 gap-2">
            {ACTORS.map((x, k) => (
              <div
                key={x.id}
                className={cn(
                  "rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-colors",
                  k === a || k === b ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {x.label}
              </div>
            ))}
          </div>
          <div className="relative h-6">
            {a !== b && (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="bg-accent absolute top-2.5 h-0.5"
                style={{
                  left: `${Math.min(a, b) * 25 + 12.5}%`,
                  width: `${Math.abs(b - a) * 25}%`,
                  transformOrigin: a < b ? "left" : "right",
                }}
              />
            )}
            {a !== b && (
              <motion.span
                key={`arrow-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-accent absolute top-0 text-sm"
                style={{ left: `calc(${b * 25 + 12.5}% ${a < b ? "- 0.6rem" : "+ 0rem"})` }}
              >
                {a < b ? "▶" : "◀"}
              </motion.span>
            )}
          </div>
          <motion.div
            key={`f-${i}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-sm font-semibold">
              {i + 1}. {f.title}
            </p>
            <p className="text-muted text-xs">{f.detail}</p>
            {f.code && <Code>{f.code}</Code>}
          </motion.div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => set({ frame: i - 1 })}
              className="border-line flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs disabled:opacity-40"
            >
              <ChevronLeft className="size-3" /> Previous step
            </button>
            <span className="text-muted font-mono text-[10px]">
              {i + 1} / {FRAMES.length}
            </span>
            <button
              type="button"
              disabled={i === FRAMES.length - 1}
              onClick={() => set({ frame: i + 1 })}
              className="bg-accent text-accent-fg flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs disabled:opacity-40"
            >
              Next step <ChevronRight className="size-3" />
            </button>
          </div>
        </div>
      }
    >
      <p>
        The standard way for an app to get a token on a user&apos;s behalf is the authorisation code
        flow with <Term id="pkce">PKCE</Term> (RFC 7636). Step through it.
      </p>
      <p>
        PKCE closes a gap on phones: if another app intercepts the one-time code in step 4, it
        can&apos;t swap it for a token without the secret verifier that never left the real app. The
        current security guidance, RFC 9700 (2025), requires PKCE for apps like these, says the old
        password grant &ldquo;MUST NOT be used&rdquo;, and advises against the old implicit flow.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Inspect the token ⭐ ------------------------------------------------------------------------ */

export function InspectToken() {
  const [s, set] = useSceneState<AuthState>();
  const t = TOKENS.find((x) => x.id === s.token) ?? TOKENS[0];
  const checked = s.checked ?? [];
  const shown = checked.includes(t.id);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Inspect the token"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TOKENS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.token === x.id}
                onClick={() => set({ token: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.token === x.id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                  checked.includes(x.id) && (x.ok ? "text-good" : "text-bad"),
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <p className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10px] break-all">
            <span className="text-viz-meta">{encoded(t).split(".")[0]}</span>.
            <span className="text-accent">{encoded(t).split(".")[1]}</span>.
            <span className="text-viz-compute">{encoded(t).split(".")[2]}</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-viz-meta mb-1 font-mono text-[10px]">header (decoded)</p>
              <Code>{JSON.stringify(t.header, null, 2)}</Code>
            </div>
            <div>
              <p className="text-accent mb-1 font-mono text-[10px]">payload (decoded)</p>
              <Code>{JSON.stringify(t.payload, null, 2)}</Code>
            </div>
          </div>
          <p className="text-muted text-[11px]">
            Now: 1791100000 (4 Oct 2026, 07:46 UTC). This API is orders-api and accepts only RS256
            tokens from https://auth.shop.example.
          </p>
          {!shown ? (
            <button
              type="button"
              onClick={() => set({ checked: [...checked, t.id] })}
              className="bg-accent text-accent-fg self-start rounded-lg px-3 py-1.5 text-xs font-medium"
            >
              Validate {t.label}
            </button>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                t.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              {t.verdict}
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        Access tokens are often <Term id="jwt">JWTs</Term> (RFC 7519): three base64url parts
        separated by dots: a header, a payload of claims (who issued it, for whom, until when) and a
        signature. Four tokens have arrived at your API. Work out which to accept before you press
        Validate.
      </p>
      <p>
        Notice you can read every claim without any key: a signed token stops tampering, not
        reading, so never put secrets in one. RFC 8725 lists the checks: allow only the algorithms
        you expect, and validate the issuer and audience.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Keys, tokens and certificates --------------------------------------------------------------- */

const CREDS: [string, string, string][] = [
  [
    "API key",
    "Authorization: Bearer sk_live_… or x-api-key: …",
    "Identifies a project or account, not a person. Simple for server-to-server calls. Restrict it, rotate it, keep it out of URLs and code: GitHub's secret scanning searches whole Git histories for leaked keys.",
  ],
  [
    "OAuth access token",
    "Authorization: Bearer eyJ…",
    "Short-lived, limited by scope, issued after a user agrees. India's DigiLocker partner APIs use OAuth 2.0 with PKCE.",
  ],
  [
    "OpenID Connect ID token",
    "id_token: eyJ…",
    "“A simple identity layer on top of the OAuth 2.0 protocol”: tells the app who signed in.",
  ],
  [
    "Mutual TLS",
    "a client certificate in the TLS handshake",
    "Both sides prove identity with certificates; tokens can be bound to the certificate (RFC 8705). Common between banks.",
  ],
];

export function Credentials() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Keys, tokens and certificates"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CREDS.map(([t, eg, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-accent font-mono text-[10px]">{eg}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Two words get mixed up. Authentication is proving who you are; authorisation is what
        you&apos;re allowed to do. OAuth is about authorisation; OpenID Connect adds authentication
        on top.
      </p>
      <p>
        A newer revision, OAuth 2.1, gathers today&apos;s best practices (PKCE everywhere, no
        implicit or password grants) into one document. It was still an IETF draft in 2026.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which credential? --------------------------------------------------------------------------- */

export function WhichCredential() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which credential?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-credential"
            prompt="Which way of proving identity fits each case best?"
            categories={[
              { id: "key", label: "API key" },
              { id: "oauth", label: "OAuth token" },
              { id: "mtls", label: "Mutual TLS" },
            ]}
            items={[
              {
                id: "weather",
                label: "Your server fetches public weather data from a provider",
                category: "key",
                why: "No user involved; a restricted key identifies your account.",
              },
              {
                id: "maps",
                label: "Your backend calls a maps service for distance estimates",
                category: "key",
                why: "Server to server, billed to your project.",
              },
              {
                id: "budget",
                label: "A budgeting app reads a user's bank transactions",
                category: "oauth",
                why: "Acting for a user, with their consent and a limited scope.",
              },
              {
                id: "signin",
                label: "A mobile app signs users in and calls your API for them",
                category: "oauth",
                why: "Authorisation code with PKCE, plus OpenID Connect for identity.",
              },
              {
                id: "bank",
                label: "Two banks exchange payment instructions",
                category: "mtls",
                why: "High assurance on both sides: certificates, often with bound tokens.",
              },
              {
                id: "partner",
                label: "A regulated partner's servers call your payments API",
                category: "mtls",
                why: "Certificates prove which organisation is connecting.",
              },
            ]}
            explanation="Keys for simple server-to-server access, OAuth when acting for a user, mutual TLS when both organisations must prove who they are."
          />
        </div>
      }
    >
      <p>Who&apos;s calling, and on whose behalf?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Never share passwords with apps", "OAuth gives them a limited, revocable token."],
  ["Authorisation code + PKCE", "The default flow for apps."],
  ["Validate every token", "Algorithm, issuer, audience, expiry, scope."],
  ["Tokens are readable", "Signed isn't secret."],
  ["Keys identify projects", "Restrict, rotate, never commit them."],
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
        Next: knowing who is calling is only half the job. Most API breaches happen after sign-in,
        when the API forgets to check what that caller may touch.
      </p>
    </StepLayout>
  );
}
