"use client";

import { motion } from "motion/react";
import { Cloud, GitBranch, KeyRound, ShieldCheck, Skull } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DOORS, MOVES, OIDC_FRAMES, type Door } from "./model";
import type { SecretsState } from "./state";

/* 1 ─ A stranger's pull request ⭐ ---------------------------------------------------------------- */

export function StrangersPR() {
  const [s, set] = useSceneState<SecretsState>();
  const fixed = s.fixed ?? [];
  const toggle = (d: Door) =>
    set({ fixed: fixed.includes(d) ? fixed.filter((x) => x !== d) : [...fixed, d] });
  const open = MOVES.filter((m) => !m.blockedBy.some((d) => fixed.includes(d)));
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="A stranger's pull request"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-1.5 lg:w-1/2">
            <p className="text-muted text-[10px]">
              Your pipeline today: click a weakness to fix it
            </p>
            {DOORS.map((d) => {
              const ok = fixed.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={ok}
                  onClick={() => toggle(d.id)}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left",
                    ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5 hover:bg-bad/10",
                  )}
                >
                  {ok ? (
                    <ShieldCheck className="text-good mt-0.5 size-3.5 shrink-0" />
                  ) : (
                    <KeyRound className="text-bad mt-0.5 size-3.5 shrink-0" />
                  )}
                  <span>
                    <span className="block text-[11px] font-medium">
                      {ok ? d.fixName : d.risky}
                    </span>
                    {ok && <span className="text-muted block text-[10px]">{d.fixed}</span>}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-muted text-[10px]">What an attacker could try</p>
            {MOVES.map((m) => {
              const works = open.includes(m);
              return (
                <motion.div
                  key={m.id}
                  layout
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-2.5 py-1.5",
                    works ? "border-bad/60 bg-bad/10" : "border-line bg-surface opacity-70",
                  )}
                >
                  <Skull
                    className={cn("mt-0.5 size-3.5 shrink-0", works ? "text-bad" : "text-subtle")}
                  />
                  <span className="text-[11px]">
                    {m.text}
                    <span
                      className={cn("ml-1 font-mono text-[10px]", works ? "text-bad" : "text-good")}
                    >
                      {works ? "· works" : "· blocked"}
                    </span>
                  </span>
                </motion.div>
              );
            })}
            <p
              className={cn(
                "mt-1 font-mono text-sm font-semibold",
                open.length ? "text-bad" : "text-good",
              )}
            >
              {open.length
                ? `${open.length} of ${MOVES.length} ways in still open`
                : "Every way in is closed"}
            </p>
          </div>
        </div>
      }
    >
      <p>
        A pipeline that deploys to production holds the keys to production: its{" "}
        <Term id="pipeline-secret">secrets</Term>. That makes it one of the most attractive things
        in a company to attack, and outside contributors can trigger it just by opening a pull
        request.
      </p>
      <p>
        This payments repository is public and accepts contributions. The cure is mostly{" "}
        <Term id="least-privilege">least privilege</Term>. Fix its six weaknesses one by one and
        watch which attacker moves stop working. Each fix closes a different door; none closes them
        all.
      </p>
      <p>
        GitHub&apos;s own guidance on two of them: self-hosted runners &ldquo;should almost never be
        used for public repositories&rdquo;, and &ldquo;pinning an action to a full-length commit
        SHA is currently the only way to use an action as an immutable release.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ No key to steal ----------------------------------------------------------------------------- */

const PARTS = [
  { icon: GitBranch, t: "Job" },
  { icon: ShieldCheck, t: "GitHub signs a token" },
  { icon: Cloud, t: "Cloud checks the rule" },
  { icon: KeyRound, t: "One-hour key" },
];

export function NoKey() {
  const [s, set] = useSceneState<SecretsState>();
  const f = OIDC_FRAMES[s.frame];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="No key to steal"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-4 gap-2">
            {PARTS.map(({ icon: Icon, t }, i) => (
              <motion.div
                key={t}
                animate={{ opacity: i <= f.active ? 1 : 0.35, scale: i === f.active ? 1.04 : 1 }}
                className={cn(
                  "flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-center",
                  i === f.active ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <Icon className="text-accent size-4" />
                <span className="text-[10px] leading-tight font-medium sm:text-xs">{t}</span>
              </motion.div>
            ))}
          </div>
          {s.frame >= 2 && (
            <pre className="bg-surface-2 overflow-x-auto rounded-lg px-3 py-2 font-mono text-[10px] leading-relaxed">
              {`"Condition": {
  "StringEquals": {
    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
    "token.actions.githubusercontent.com:sub": "repo:acme/payments:ref:refs/heads/main"
  }
}`}
            </pre>
          )}
          <Stepper step={s.frame} count={OIDC_FRAMES.length} onChange={(frame) => set({ frame })} />
          <FrameCaption frameKey={s.frame} title={f.t} tone={s.frame === 3 ? "good" : undefined}>
            {f.d}
          </FrameCaption>
        </div>
      }
    >
      <p>
        <Term id="oidc-federation">OIDC federation</Term> replaces stored keys with identity. In
        GitHub&apos;s words: &ldquo;No cloud secrets: You won&apos;t need to duplicate your cloud
        credentials as long-lived GitHub secrets,&rdquo; and the cloud issues &ldquo;a short-lived
        access token that is only valid for a single job&rdquo;.
      </p>
      <p>
        The trust rule matters as much as the mechanism: pin the subject to the exact repository and
        branch (or environment). For repositories created after 15 July 2026, GitHub&apos;s subject
        also includes numeric owner and repository IDs, so a deleted and recreated repository with
        the same name can&apos;t match an old rule.
      </p>
      <p>
        The same pattern exists everywhere: GitLab&apos;s id_tokens, Azure DevOps workload identity
        federation, Google workload identity federation and HashiCorp Vault&apos;s JWT login.
      </p>
    </StepLayout>
  );
}

/* 3 ─ It keeps happening -------------------------------------------------------------------------- */

const STORIES = [
  {
    when: "Jan–Apr 2021",
    who: "Codecov",
    text: "An attacker altered Codecov's Bash uploader script, which thousands of pipelines downloaded and ran, so that it sent the pipelines' environment variables, secrets included, to the attacker.",
  },
  {
    when: "Jan 2023",
    who: "CircleCI",
    text: "Malware on an engineer's laptop stole a logged-in session. CircleCI told every customer to rotate every secret stored on its platform.",
  },
  {
    when: "Mar 2025",
    who: "tj-actions/changed-files",
    text: "The action's version tags were re-pointed to code that printed runners' secrets into build logs, base64-encoded to slip past log masking. More than 23,000 repositories used the action.",
  },
];

export function KeepsHappening() {
  return (
    <StepLayout
      eyebrow="Real incidents"
      title="It keeps happening"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {STORIES.map((x, i) => (
            <motion.div
              key={x.who}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-bad/40 bg-bad/5 rounded-xl border px-4 py-3"
            >
              <p className="text-accent font-mono text-xs">{x.when}</p>
              <p className="mt-0.5 font-semibold">{x.who}</p>
              <p className="text-muted mt-1 text-sm">{x.text}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every one of these turned stored, long-lived secrets into a disaster. A key that expires
        within the hour, scoped to one job, is worth far less to a thief.
      </p>
      <p>
        Leaks are routine, too: GitGuardian counted 28.6 million new secrets in public GitHub
        commits in 2025 alone. Turn on <Term id="secret-scanning">secret scanning</Term>, and when
        something does leak, delete the log and rotate the secret.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Safe or risky? ------------------------------------------------------------------------------ */

export function SafeOrRisky() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe or risky?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pipeline-safe-or-risky"
            prompt="Is each pipeline setting safe or risky?"
            categories={[
              { id: "safe", label: "Safe" },
              { id: "risky", label: "Risky" },
            ]}
            items={[
              {
                id: "oidc",
                label: "Deploying with OIDC, trust rule pinned to repo and branch",
                category: "safe",
                why: "Short-lived credentials only this workflow on main can obtain.",
              },
              {
                id: "perm",
                label: "permissions: contents: read at the top of the workflow",
                category: "safe",
                why: "The token can't change the repository even if a step is compromised.",
              },
              {
                id: "sha",
                label: "uses: some-org/some-action@ (full 40-character commit SHA)",
                category: "safe",
                why: "Nobody can move a commit SHA to different code.",
              },
              {
                id: "json",
                label: "One secret holding a JSON blob of all the credentials",
                category: "risky",
                why: "Log redaction looks for exact matches, so parts of structured secrets can slip through.",
              },
              {
                id: "prt",
                label: "pull_request_target that checks out and builds the contributor's code",
                category: "risky",
                why: "Untrusted code runs with your secrets and a writeable token.",
              },
              {
                id: "selfhosted",
                label: "A persistent self-hosted runner for a public repository",
                category: "risky",
                why: "Anyone's pull request can run code on it and leave something behind.",
              },
            ]}
            explanation="Safe settings shrink what a compromised step can reach and for how long. Risky ones give untrusted code your secrets, your token or your machine."
          />
        </div>
      }
    >
      <p>Treat every workflow as code that strangers can influence.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  [
    "Identity, not stored keys",
    "OIDC gives each job a short-lived key; nothing to steal or rotate.",
  ],
  ["Untrusted code gets nothing", "No secrets and a read-only token for outside pull requests."],
  ["Least privilege", "Restrict the workflow token and each cloud role to what they need."],
  ["Keep logs clean", "Single-value secrets, masking for derived values; rotate on any leak."],
  ["Pin and isolate", "Actions by SHA; fresh runners per job."],
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
        GitHub has been tightening the defaults: workflow tokens are read-only by default for new
        organisations and repositories (since 2023), pull_request_target always runs the default
        branch&apos;s workflow (since December 2025), and organisations can require every action to
        be pinned to a SHA (since August 2025).
      </p>
      <p>
        Next: the code itself, and the dependencies and build tools it passes through, as a target.
      </p>
    </StepLayout>
  );
}
