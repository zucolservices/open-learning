"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PLACES, SETTINGS, type Place } from "./model";
import type { CfgState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Keys() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Keys taped to the front door"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Keys taped to the door",
              "Convenient for everyone, including burglars. Changing the lock means re-taping keys on every door.",
            ],
            [
              "A key safe",
              "Only staff can open it, every opening is recorded, and you can change the code without touching the doors.",
            ],
          ].map(([t, b], i) => (
            <div
              key={t}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Nobody would tape the café&apos;s keys to the front door. Yet passwords and API keys written
        into code end up exactly there: visible to anyone who can read the repository, forever.
      </p>
      <p>
        The same code runs in development, testing and production with different settings.{" "}
        <Term id="config">Configuration</Term> belongs outside the code, and{" "}
        <Term id="secret">secrets</Term> belong in a proper safe.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Move it ⭐ ----------------------------------------------------------------------------------- */

export function MoveIt() {
  const [s, set] = useSceneState<CfgState>();
  const at = (id: string) => s.places[id] ?? "code";
  const right = (id: string) => at(id) === SETTINGS.find((x) => x.id === id)!.answer;
  const leaks = SETTINGS.filter((x) => x.secret && at(x.id) !== "secret").length;
  const redeploys = SETTINGS.filter((x) => x.varies && at(x.id) === "code").length;
  const done = SETTINGS.every((x) => right(x.id));
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Move settings out of the code"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SETTINGS.map((x) => (
            <div
              key={x.id}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px]">{x.name}</span>
                <span className="text-subtle font-mono text-[10px]">{x.value}</span>
                <div className="ml-auto flex flex-wrap gap-1">
                  {PLACES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={at(x.id) === p.id}
                      onClick={() => set({ places: { ...s.places, [x.id]: p.id as Place } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        at(x.id) === p.id
                          ? right(x.id)
                            ? "border-good bg-good/20"
                            : "border-line-strong bg-surface-2"
                          : "border-line text-muted",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              {s.places[x.id] && right(x.id) && (
                <p className="text-good mt-0.5 text-[10px]">{x.why}</p>
              )}
            </div>
          ))}
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.validate}
              onChange={() => set({ validate: !s.validate })}
            />
            Validate all config when the service starts
          </label>
          <div className="grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-3">
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                leaks ? "border-bad/40 bg-bad/10" : "border-good/50 bg-good/10",
              )}
            >
              <p className="text-muted text-[10px]">If the repository goes public</p>
              <p>
                {leaks ? `${leaks} secret${leaks > 1 ? "s" : ""} leak` : "Nothing secret leaks"}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                redeploys ? "border-bad/40 bg-bad/10" : "border-good/50 bg-good/10",
              )}
            >
              <p className="text-muted text-[10px]">Deploying to staging</p>
              <p>
                {redeploys
                  ? `${redeploys} code change${redeploys > 1 ? "s" : ""} needed`
                  : "Same build, different settings"}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                s.validate ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              <p className="text-muted text-[10px]">A setting is missing</p>
              <p>
                {s.validate
                  ? "Refuses to start, with a clear message"
                  : "Starts fine, fails at 3 a.m."}
              </p>
            </div>
          </div>
          {done && s.validate && (
            <p className="text-good text-xs">
              One build runs anywhere; secrets are safe and rotatable; mistakes show up at start-up.
            </p>
          )}
        </div>
      }
    >
      <p>
        Everything in this café service is hard-coded. Decide where each setting should live, then
        check the three tests below: a leak, a new environment, and a missing value.
      </p>
      <p>The values shown are placeholders, never real secrets.</p>
    </StepLayout>
  );
}

/* 3 ─ Twelve-factor -------------------------------------------------------------------------------- */

export function TwelveFactor() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Config in the environment, with care"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "The litmus test",
              "Could you open-source the code right now without leaking a credential? (The Twelve-Factor App, 2011)",
            ],
            [
              "Environment variables aren't a vault",
              "Child processes inherit them, and they leak into crash dumps and logs.",
            ],
            [
              "Kubernetes Secrets aren't encrypted by default",
              "They're base64-encoded and stored in plain form unless encryption at rest is set up.",
            ],
            [
              ".env files",
              "Fine locally, always in .gitignore; commit a .env.example with no values.",
            ],
            [
              "Typed config, checked at start-up",
              "Pydantic Settings, Spring @ConfigurationProperties, .NET Options with ValidateOnStart, a Zod schema.",
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
        The Twelve-Factor App, written at Heroku in 2011, made &ldquo;store config in the
        environment&rdquo; the norm. Heroku open-sourced it in November 2024 so the community can
        update it; the rewrite is still in progress.
      </p>
      <p>Non-secret config can go in the environment; secrets deserve more protection.</p>
    </StepLayout>
  );
}

/* 4 ─ Secret managers ------------------------------------------------------------------------------ */

export function Managers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Secret managers, and why leaks last"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-3">
            {[
              "AWS Secrets Manager",
              "Azure Key Vault",
              "Google Secret Manager",
              "HashiCorp Vault (BSL licence)",
              "OpenBao (open-source fork)",
              "Doppler, Infisical",
            ].map((t) => (
              <div
                key={t}
                className="border-line bg-surface rounded-lg border px-2 py-1.5 text-center"
              >
                {t}
              </div>
            ))}
          </div>
          <div className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">
              About 29 million secrets leaked on public GitHub in 2025
            </p>
            <p className="text-muted">
              Up 34% on the year before, and more than 64% of secrets found valid in 2022 were still
              valid in 2026 (GitGuardian, State of Secrets Sprawl 2026).
            </p>
          </div>
        </div>
      }
    >
      <p>
        Secret managers store credentials encrypted, control who can read them, record every access
        and can rotate them on a schedule. Better still are short-lived credentials issued per
        workload, so there&apos;s nothing long-lived to steal.
      </p>
      <p>
        GitHub blocks pushes containing known secret formats to public repositories by default for
        individual users, but people can bypass it. Scanning helps; not writing secrets into code is
        the real fix.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CfgCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The leaked password"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="backend-config"
            prompt="A database password was pushed to a public repository an hour ago. You've already deleted the commit. What must you do next?"
            options={[
              {
                id: "nothing",
                label: "Nothing: the commit is gone",
                feedback:
                  "Copies, forks, caches and scanners may already have it. Deleting history doesn't un-leak it.",
              },
              {
                id: "rotate",
                label: "Revoke and rotate the password, then check access logs",
                correct: true,
                feedback:
                  "Right: assume it's compromised. Change it, update the secret manager, and look for misuse.",
              },
              {
                id: "private",
                label: "Make the repository private",
                feedback: "Too late for anyone who already copied it.",
              },
            ]}
            explanation="A leaked secret is compromised. Revoke and rotate it, then investigate. Secret managers make rotation a routine, not a crisis."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["One build, many environments", "Config outside the code."],
        ["Secrets in a safe", "A secret manager, not the repository."],
        ["Fail fast", "Validate config at start-up."],
        ["Prefer short-lived credentials", "Less to steal."],
        ["Leaked means rotate", "Deleting the commit isn't enough."],
      ]}
    >
      <p>That ends the chapter on building a service. Next: talking to a database.</p>
    </WrapStep>
  );
}
