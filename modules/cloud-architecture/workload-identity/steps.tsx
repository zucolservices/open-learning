"use client";

import { motion } from "motion/react";
import { ArrowRight, BadgeCheck, Check, KeyRound, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { WorkloadIdState } from "./state";

/* 1 ─ House keys and visitor badges -------------------------------------------------------------- */

export function Badges() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="House keys and visitor badges"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border px-4 py-3"
          >
            <KeyRound className="text-bad size-6" />
            <p className="mt-2 font-semibold">A spare house key</p>
            <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4 text-sm">
              <li>Copied, lent, left under the mat</li>
              <li>Works for years</li>
              <li>Whoever holds it gets in; no questions asked</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border px-4 py-3"
          >
            <BadgeCheck className="text-good size-6" />
            <p className="mt-2 font-semibold">A visitor badge</p>
            <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4 text-sm">
              <li>Issued at reception after checking who you are</li>
              <li>Expires tonight</li>
              <li>Lost badge? Useless by tomorrow</li>
            </ul>
          </motion.div>
        </div>
      }
    >
      <p>
        Programs need credentials too: a web app reading a database, a pipeline deploying code. The
        old way is a <Term id="access-key">long-lived access key</Term>, pasted into a config file.
        It is a spare house key: it gets copied into code, laptops and chat messages, and it works
        until someone remembers to cancel it.
      </p>
      <p>
        The modern way is a visitor badge: the cloud checks who the program already is and hands it{" "}
        <Term id="short-lived-credentials">short-lived credentials</Term>, usually valid for an
        hour. There is nothing permanent to steal.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Follow a leaked key ⭐ ----------------------------------------------------------------------- */

const LEAK: { t: string; title: string; text: string; tone?: "good" | "bad" }[] = [
  {
    t: "0 s",
    title: "A key is pushed to a public repository",
    text: "A developer commits a config file containing an AWS access key (they start with AKIA). GitHub counted more than 39 million secrets leaked across GitHub in 2024.",
  },
  {
    t: "≈10 s",
    title: "AWS notices and quarantines it",
    text: "AWS scans public code. In a 2026 test by Palo Alto Networks' Unit 42, AWS attached its AWSCompromisedKeyQuarantineV3 policy about 10 seconds after a key went public. It blocks a list of risky actions, but doesn't delete the key or undo anything.",
    tone: "good",
  },
  {
    t: "≤5 min",
    title: "Attackers find it too",
    text: "Bots watch public pushes. In Unit 42's EleKtra-Leak research (2023), attackers used leaked AWS keys within 5 minutes, launching servers to mine cryptocurrency in other regions.",
    tone: "bad",
  },
  {
    t: "Months",
    title: "Most leaked secrets keep working",
    text: "Long-lived keys don't expire by themselves. GitGuardian found that over 64% of secrets valid in 2022 were still valid in January 2026. Deleting the commit doesn't help: the history and the copies remain.",
    tone: "bad",
  },
  {
    t: "After",
    title: "Clean-up is on you",
    text: "Deactivate and replace the key, check the audit log for what it was used for, and remove anything an attacker created. Better: don't have a key to leak at all.",
  },
];

const INCIDENTS: [string, string][] = [
  [
    "Uber, 2016",
    "An AWS key in a private GitHub repo, reached with a reused password and no MFA: data on 57 million people.",
  ],
  [
    "Toyota, 2022",
    "An access key to a data server sat in public code for nearly five years: 296,019 email addresses exposed.",
  ],
  [
    "Codecov, 2021",
    "A storage key pulled from a Docker image let attackers alter a script that sent customers' CI secrets out.",
  ],
  [
    "CircleCI, 2023",
    "After a breach, every customer was told to rotate “any and all” secrets stored there.",
  ],
];

export function LeakedKey() {
  const [s, set] = useSceneState<WorkloadIdState>();
  const f = LEAK[s.frame] ?? LEAK[0];
  return (
    <StepLayout
      eyebrow="Step through · real timings"
      title="Follow a leaked key"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {LEAK.map((x, i) => (
              <div
                key={x.t}
                className={cn(
                  "flex-1 rounded-md px-1 py-1 text-center font-mono text-[10px]",
                  i === s.frame
                    ? "bg-accent text-accent-fg"
                    : i < s.frame
                      ? "bg-surface-2"
                      : "border-line border",
                )}
              >
                {x.t}
              </div>
            ))}
          </div>
          <FrameCaption frameKey={s.frame} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={LEAK.length} onChange={(n) => set({ frame: n })} />
          <div className="grid gap-1.5 sm:grid-cols-2">
            {INCIDENTS.map(([n, d]) => (
              <div key={n} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <p className="text-xs font-semibold">{n}</p>
                <p className="text-muted text-[11px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Step through what happens when a key leaks. The timings are real, from published research.
      </p>
      <p>
        Leaks are not rare accidents by careless people: GitGuardian counted about 29 million new
        secrets on public GitHub in 2025 alone. In India, the security firm CloudSEK found AWS keys
        built into more than 40 popular mobile apps in 2021. The fix isn&apos;t more care; it&apos;s
        removing the key.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Credentials without keys ⭐ ---------------------------------------------------------------- */

type Place = WorkloadIdState["place"];
type Cloud = WorkloadIdState["cloud"];

const PLACES: [Place, string][] = [
  ["vm", "VM"],
  ["k8s", "Pod"],
  ["fn", "Function"],
  ["ci", "CI"],
  ["other", "Outside"],
];

const HOW: Record<Place, Record<Cloud, string>> = {
  vm: {
    aws: "Instance profile (a role attached to the VM); credentials from the instance metadata service (use IMDSv2)",
    azure: "Managed identity (system- or user-assigned); token from the metadata endpoint",
    gcp: "Attached service account; token from the metadata server",
  },
  k8s: {
    aws: "EKS Pod Identity (2023) or the older IAM roles for service accounts (IRSA)",
    azure: "Microsoft Entra Workload ID on AKS (federated identity credential)",
    gcp: "GKE Workload Identity Federation",
  },
  fn: {
    aws: "Lambda execution role",
    azure: "Managed identity on Azure Functions",
    gcp: "Service account attached to Cloud Run functions",
  },
  ci: {
    aws: "IAM OIDC identity provider + a role the pipeline assumes",
    azure: "Federated identity credential on an app or user-assigned identity",
    gcp: "Workload Identity Federation pool and provider",
  },
  other: {
    aws: "IAM Roles Anywhere (X.509 certificates) or OIDC federation",
    azure: "Workload identity federation from another identity provider",
    gcp: "Workload Identity Federation (AWS, Azure, OIDC or SAML sources)",
  },
};

const FLOW: Record<Place, [string, string, string]> = {
  vm: ["App on the VM", "Metadata endpoint (169.254.169.254)", "Token, ≈1 hour"],
  k8s: ["Pod's service account token", "Cloud identity service", "Token, ≈1 hour"],
  fn: ["Function starts", "Platform injects credentials", "Token for this run"],
  ci: ["Pipeline's signed OIDC token", "Cloud token exchange", "Token, ≈1 hour"],
  other: [
    "Workload's own identity (certificate or OIDC token)",
    "Cloud token exchange",
    "Token, ≈1 hour",
  ],
};

export function NoKeys() {
  const [s, set] = useSceneState<WorkloadIdState>();
  const flow = FLOW[s.place];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Credentials without keys"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.place}
            options={PLACES}
            onChange={(v) => set({ place: v })}
          />
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {flow.map((step, i) => (
              <motion.div
                key={s.place + i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                className="flex items-center gap-1.5"
              >
                {i > 0 && <ArrowRight className="text-muted size-3.5" />}
                <span
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5",
                    i === 2 ? "border-good bg-good/10" : "border-line bg-surface",
                  )}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
          <Segmented
            size="sm"
            value={s.cloud}
            options={[
              ["aws", "AWS"],
              ["azure", "Azure"],
              ["gcp", "Google Cloud"],
            ]}
            onChange={(v) => set({ cloud: v })}
          />
          <motion.p
            key={s.place + s.cloud}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-sm"
          >
            {HOW[s.place][s.cloud]}
          </motion.p>
          <p className="text-muted text-[11px]">
            Stolen? A token stops working within the hour. An AWS role session lasts 1 hour by
            default (up to 12); Google access tokens 1 hour; Azure tokens about an hour.
          </p>
        </div>
      }
    >
      <p>
        Wherever a program runs, the platform already knows what it is: this VM, this pod, this
        pipeline run. A <Term id="workload-identity">workload identity</Term> turns that into
        credentials on request, so the code never contains a secret.
      </p>
      <p>
        Pick where your code runs. Google now blocks creating service account keys by default in
        organisations created since May 2024, and AWS lets you require the hardened metadata service
        (IMDSv2) for every new VM. The open-source standard for the same idea across platforms is
        SPIFFE, a graduated CNCF project.
      </p>
    </StepLayout>
  );
}

/* 4 ─ A pipeline without secrets ⭐ --------------------------------------------------------------- */

type Sub = WorkloadIdState["sub"];

const SUB: Record<Sub, { label: string; cond: string | null }> = {
  none: { label: "No check", cond: null },
  org: { label: "Whole org", cond: "repo:acme/*" },
  main: { label: "app, main", cond: "repo:acme/app:ref:refs/heads/main" },
};

const CALLERS: { id: string; label: string; sub: string; ok: boolean }[] = [
  {
    id: "main",
    label: "acme/app, main branch (the real deploy)",
    sub: "repo:acme/app:ref:refs/heads/main",
    ok: true,
  },
  {
    id: "pr",
    label: "acme/app, a feature branch",
    sub: "repo:acme/app:ref:refs/heads/try-stuff",
    ok: false,
  },
  {
    id: "other",
    label: "acme/website, another team's repo",
    sub: "repo:acme/website:ref:refs/heads/main",
    ok: false,
  },
  {
    id: "stranger",
    label: "evil/repo, anyone's repo on GitHub",
    sub: "repo:evil/repo:ref:refs/heads/main",
    ok: false,
  },
];

function globMatch(p: string, v: string) {
  return new RegExp("^" + p.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$").test(
    v,
  );
}

export function CiTrust() {
  const [s, set] = useSceneState<WorkloadIdState>();
  const cond = SUB[s.sub].cond;
  const policy = `{
  "Effect": "Allow",
  "Principal": { "Federated": "…:oidc-provider/token.actions.githubusercontent.com" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" }${
      cond
        ? `,
    "StringLike": { "token.actions.githubusercontent.com:sub": "${cond}" }`
        : ""
    }
  }
}`;
  return (
    <StepLayout
      eyebrow="Simulation · AWS trust policy"
      title="A pipeline without secrets"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Segmented
              size="sm"
              value={s.sub}
              options={(Object.keys(SUB) as Sub[]).map((k) => [k, SUB[k].label] as [Sub, string])}
              onChange={(v) => set({ sub: v })}
            />
            <Code className="text-[10px] break-all whitespace-pre-wrap">{policy}</Code>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-muted text-xs">Who can deploy to production with this role?</p>
            {CALLERS.map((c) => {
              const allowed = cond === null || globMatch(cond, c.sub);
              const good = allowed === c.ok;
              return (
                <div
                  key={c.id}
                  className={cn(
                    "rounded-md border px-2.5 py-1.5 text-xs",
                    good ? "border-line bg-surface" : "border-bad bg-bad/10",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {allowed ? (
                      <Check className={cn("size-3.5 shrink-0", c.ok ? "text-good" : "text-bad")} />
                    ) : (
                      <X className="text-muted size-3.5 shrink-0" />
                    )}
                    <span className="flex-1">{c.label}</span>
                    <span className={cn("text-[10px]", good ? "text-muted" : "text-bad")}>
                      {allowed ? "can deploy" : "refused"}
                    </span>
                  </div>
                  <p className="text-muted mt-0.5 font-mono text-[10px] break-all">sub: {c.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        A GitHub Actions job can ask GitHub for a signed <Term id="oidc">OIDC</Term> token that says
        which repository and branch it is running from (the{" "}
        <code className="font-mono text-xs">sub</code> claim). AWS, Azure and Google trade that
        token for short-lived cloud credentials. GitLab and other CI systems work the same way.
      </p>
      <p>
        The trust policy decides which tokens are accepted. Without a{" "}
        <code className="font-mono text-xs">sub</code> check, any repository on GitHub can deploy:
        in 2023 Datadog found over 500 roles open like this. Since June 2025 AWS refuses to create
        such roles, but older ones may remain. For repos created after 15 July 2026, GitHub adds
        fixed owner and repo IDs to <code className="font-mono text-xs">sub</code>, so a
        re-registered name can&apos;t match old policies.
      </p>
    </StepLayout>
  );
}

/* 5 ─ One login for people ---------------------------------------------------------------------- */

const PEOPLE: [string, string][] = [
  [
    "Single sign-on",
    "Staff sign in once with the company identity provider (Microsoft Entra ID, Okta, Google Workspace…) and reach every cloud account from there. Leavers lose access everywhere when one account is disabled.",
  ],
  [
    "SAML 2.0 (2005)",
    "The older XML-based standard for passing a signed “this person is signed in” statement from the identity provider to an app or cloud console.",
  ],
  [
    "OpenID Connect (2014)",
    "A newer, JSON-based identity layer on top of OAuth 2.0; the same standard CI pipelines use for workloads.",
  ],
  [
    "SCIM",
    "Keeps user and group lists in sync, so creating or removing someone in the directory updates cloud access too.",
  ],
  [
    "In each cloud",
    "AWS IAM Identity Center (called AWS SSO until 2022), Microsoft Entra ID (Azure AD until 2023), Google Cloud Identity or Workforce Identity Federation. All free to use.",
  ],
];

export function People() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="One login for people"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PEOPLE.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        People get the same treatment through <Term id="federation">federation</Term>: rather than a
        separate cloud password (or worse, a personal access key) for every engineer, the cloud
        trusts the company&apos;s identity provider and issues short-lived sessions.
      </p>
      <p>
        One place to add multi-factor sign-in, one place to remove leavers, and an audit trail of
        who assumed which role.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Swap the key -------------------------------------------------------------------------------- */

export function SwapTheKey() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Swap the key"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="swap-the-key"
            prompt="Each of these uses a long-lived key today. What should replace it?"
            categories={[
              { id: "attached", label: "Attached identity" },
              { id: "oidc", label: "Workload federation" },
              { id: "sso", label: "Single sign-on" },
            ]}
            items={[
              {
                id: "vm",
                label: "A web app on a cloud VM that reads from a storage bucket",
                category: "attached",
                why: "Attach a role, managed identity or service account to the VM.",
              },
              {
                id: "fn",
                label: "A serverless function that writes to a queue",
                category: "attached",
                why: "The function's execution role or managed identity.",
              },
              {
                id: "gha",
                label: "A GitHub Actions workflow that deploys to production",
                category: "oidc",
                why: "Trade GitHub's OIDC token for short-lived credentials, with a sub check.",
              },
              {
                id: "cross",
                label: "A job running in AWS that needs to read from Google Cloud",
                category: "oidc",
                why: "Google Workload Identity Federation accepts AWS identities directly.",
              },
              {
                id: "eng",
                label: "An engineer who uses an access key on their laptop for the console and CLI",
                category: "sso",
                why: "Sign in through the company identity provider and get a short session.",
              },
              {
                id: "contractor",
                label: "A contractor who needs a week of read-only access",
                category: "sso",
                why: "Add them in the directory with a time-limited group; remove in one place.",
              },
            ]}
            explanation="Whatever runs inside the cloud gets an attached identity; whatever runs outside it federates; people sign in once."
          />
        </div>
      }
    >
      <p>Six keys to retire.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Keys leak", "Tens of millions a year; attackers use them within minutes."],
  ["Badges, not keys", "Short-lived credentials from who the workload already is."],
  ["Check the sub", "A federated trust policy must name exactly which pipeline is trusted."],
  ["One login for people", "SSO through the company identity provider, with MFA."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Some secrets remain: database passwords, third-party API keys. Next: encryption and where to
        keep the secrets you can&apos;t avoid.
      </p>
    </StepLayout>
  );
}
