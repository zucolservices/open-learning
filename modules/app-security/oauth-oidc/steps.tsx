"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ATTACKS, LANES, MISTAKES, STEPS } from "./model";
import type { OauthState } from "./state";

/* 1 ─ The valet key ------------------------------------------------------------------------------- */

export function ValetKey() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The valet key"
      stage={
        <div className="flex flex-1 items-center justify-center gap-4">
          {[
            ["🔑", "Your full key", "Doors, boot, glovebox, your house"],
            ["🗝️", "Valet key", "Drive and park. Nothing else. Can be taken back."],
          ].map(([e, t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn(
                "max-w-[11rem] rounded-xl border px-4 py-3 text-center text-xs",
                i ? "border-good bg-good/10" : "border-line bg-surface",
              )}
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
        Some cars come with a valet key: it starts the engine but won&apos;t open the boot or the
        glovebox. You hand it to the parking attendant instead of your full key ring, and nothing
        else is at risk.
      </p>
      <p>
        <Term id="oauth">OAuth</Term> is the valet key for the web. A printing app can get access to
        your photos without your password: limited to what you approve, and revocable.{" "}
        <Term id="oidc">OpenID Connect</Term> adds a standard way to log in on top: the familiar
        “Sign in with…” button.
      </p>
    </StepLayout>
  );
}

/* 2 ─ “Sign in with…”, message by message ⭐ ------------------------------------------------------ */

export function Flow() {
  const [s, set] = useSceneState<OauthState>();
  const st = STEPS[s.step] ?? STEPS[0];
  const m = MISTAKES.find((x) => x.id === s.mistake);
  const broken = m && m.atStep === s.step;
  const X = (l: number) => 40 + l * 80;
  return (
    <StepLayout
      eyebrow="Step-through"
      title="“Sign in with…”, message by message"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 320 170" className="mx-auto w-full max-w-lg" fill="none">
            {LANES.map((l, i) => (
              <g key={l}>
                <text
                  x={X(i)}
                  y={12}
                  textAnchor="middle"
                  className="fill-fg text-[7.5px] font-semibold"
                >
                  {l}
                </text>
                <line
                  x1={X(i)}
                  y1={18}
                  x2={X(i)}
                  y2={164}
                  className="stroke-line"
                  strokeDasharray="3 3"
                />
              </g>
            ))}
            {STEPS.map((x, i) => {
              const y = 30 + i * 19;
              const on = i === s.step;
              const done = i < s.step;
              return (
                <g key={i} opacity={on ? 1 : done ? 0.55 : 0.18}>
                  <line
                    x1={X(x.from)}
                    y1={y}
                    x2={X(x.to)}
                    y2={y}
                    className={on ? (broken ? "stroke-bad" : "stroke-accent") : "stroke-muted"}
                    strokeWidth={on ? 2 : 1}
                  />
                  <polygon
                    points={
                      x.to > x.from
                        ? `${X(x.to)},${y} ${X(x.to) - 5},${y - 3} ${X(x.to) - 5},${y + 3}`
                        : `${X(x.to)},${y} ${X(x.to) + 5},${y - 3} ${X(x.to) + 5},${y + 3}`
                    }
                    className={on ? (broken ? "fill-bad" : "fill-accent") : "fill-muted"}
                  />
                  <text
                    x={(X(x.from) + X(x.to)) / 2}
                    y={y - 3}
                    textAnchor="middle"
                    className="fill-muted text-[5.5px]"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
          <motion.div
            key={`${s.step}-${s.mistake}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              broken ? "border-bad bg-bad/10" : "border-line bg-surface",
            )}
          >
            <p className="text-accent font-mono text-[10px]">
              {s.step + 1}. {LANES[st.from]} → {LANES[st.to]}: {st.label}
            </p>
            <p className="mt-1">{st.text}</p>
            {broken && m && (
              <p className="text-bad mt-1">
                ⚠ {m.name}: {m.what} <span className="text-muted">Fix: {m.fix}</span>
              </p>
            )}
          </motion.div>
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={s.step === 0}
              onClick={() => set({ step: s.step - 1 })}
              className="border-line rounded-full border px-3 py-1 text-xs disabled:opacity-40"
              aria-label="Earlier message"
            >
              ← Earlier
            </button>
            <button
              type="button"
              disabled={s.step === STEPS.length - 1}
              onClick={() => set({ step: s.step + 1 })}
              className="border-line rounded-full border px-3 py-1 text-xs disabled:opacity-40"
              aria-label="Later message"
            >
              Later →
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted">Add a mistake:</span>
            {MISTAKES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.mistake === x.id}
                onClick={() => set({ mistake: s.mistake === x.id ? null : x.id, step: x.atStep })}
                className={cn(
                  "rounded-full border px-3 py-1",
                  s.mistake === x.id ? "border-bad bg-bad/10" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Step through the seven messages of the authorization code flow, the safe default for every
        kind of app. Notice that Asha types credentials only on the sign-in server&apos;s page, and
        that the tokens travel server to server.
      </p>
      <p>
        <Term id="pkce">PKCE</Term> (pronounced “pixie”) ties the code to the app that asked for it:
        a stolen code is useless without the secret verifier. Then switch on each mistake. Most real
        OAuth bugs are loose redirect checks, missing state checks, or old flows.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two tokens, two jobs ------------------------------------------------------------------------ */

export function TwoTokens() {
  const [s, set] = useSceneState<OauthState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two tokens, two jobs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {(["id", "access"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.token === t}
                onClick={() => set({ token: t })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.token === t ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {t === "id" ? "ID token" : "Access token"}
              </button>
            ))}
          </div>
          <motion.div
            key={s.token}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-4 py-3 text-xs"
          >
            {s.token === "id" ? (
              <>
                <p className="text-sm font-semibold">ID token (OpenID Connect)</p>
                <p>
                  For the app: who signed in, when, and at which provider. Checked by the app, then
                  used to start its own session.
                </p>
                <p className="text-muted mt-1 font-mono text-[10px]">
                  {'{ iss, sub: "asha-7f3c", aud: "food-app", email, exp }'}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold">Access token (OAuth)</p>
                <p>
                  For an API: permission to do specific things (scopes). The app shouldn&apos;t read
                  it to decide who the user is.
                </p>
                <p className="text-muted mt-1 font-mono text-[10px]">
                  Authorization: Bearer … (scope: photos.read)
                </p>
              </>
            )}
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["2012", "OAuth 2.0 (RFC 6749)"],
              ["2014", "OpenID Connect 1.0; an ISO/IEC standard since 2024"],
              [
                "2025",
                "Security best practice, RFC 9700: no password grant; avoid the implicit grant",
              ],
            ].map(([y, t]) => (
              <div
                key={y}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-[11px]"
              >
                <p className="text-accent font-mono">{y}</p>
                <p className="text-muted">{t}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        OAuth on its own is about authorisation: what an app may do. It isn&apos;t a login protocol,
        which is why OpenID Connect adds the ID token. Mixing them up, for example treating any
        access token as proof of who the user is, has caused real account takeovers.
      </p>
      <p>
        OAuth 2.1, which folds today&apos;s best practices into one document, is still an IETF draft
        in late 2026. You can follow its rules now: code flow, PKCE everywhere, exact redirects.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Stealing tokens, not passwords -------------------------------------------------------------- */

export function TokenAttacks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Stealing tokens, not passwords"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ATTACKS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
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
        As MFA spreads, attackers go after what comes after login: tokens, app connections and
        consent screens. Most of these cases needed no password at all.
      </p>
      <p>
        Defences: keep an inventory of connected apps and review their access, restrict who can
        approve new apps, turn off the device-code flow where you don&apos;t need it, and keep
        tokens short-lived and revocable.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Good practice or not? ----------------------------------------------------------------------- */

export function OauthPractice() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good practice or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="oauth-practice"
            prompt="Is each OAuth choice good practice?"
            categories={[
              { id: "good", label: "Good" },
              { id: "bad", label: "Bad" },
            ]}
            items={[
              {
                id: "pkce",
                label: "Authorization code flow with PKCE, even for web apps",
                category: "good",
                why: "The recommended default.",
              },
              {
                id: "prefix",
                label: "Accepting any redirect URI that starts with our domain",
                category: "bad",
                why: "Exact match only.",
              },
              {
                id: "password",
                label: "Asking users for their Google password inside our app",
                category: "bad",
                why: "The password grant must not be used.",
              },
              {
                id: "state",
                label: "Checking the state value on the way back",
                category: "good",
                why: "Stops login CSRF.",
              },
              {
                id: "implicit",
                label: "Getting the access token straight in the URL fragment",
                category: "bad",
                why: "The implicit grant should not be used.",
              },
              {
                id: "review",
                label: "Reviewing which third-party apps hold tokens",
                category: "good",
                why: "Forgotten integrations get abused.",
              },
            ]}
            explanation="Use the code flow with PKCE, exact redirect URIs and state checks; never collect other services' passwords; keep track of granted access."
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
  ["A valet key", "Limited, revocable access without the password."],
  ["OAuth for access, OIDC for login", "ID token vs access token."],
  ["Code flow with PKCE", "For every kind of app."],
  ["Exact redirects, check state", "Where most bugs live."],
  ["Guard tokens and grants", "Attackers skip the password."],
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
        Next: the browser&apos;s own rules about which sites may talk to which, and the attacks that
        slip through them.
      </p>
    </StepLayout>
  );
}
