"use client";

import { motion } from "motion/react";
import { Check, KeyRound, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { evaluate, toJson, type Reason, type Request, type Statement } from "./policy";
import type { IamState } from "./state";

/* 1 ─ Hotel key cards ---------------------------------------------------------------------------- */

const CARDS: [string, string, string][] = [
  ["Guest, room 214", "Room 214 · gym · pool", "Opens only what a guest needs."],
  ["Housekeeping", "All guest rooms on floor 2", "Wide, but only one floor."],
  ["Manager", "Every door", "Rare, carefully guarded, and logged."],
];

export function KeyCards() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Hotel key cards"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {CARDS.map(([who, doors, note], i) => (
            <motion.div
              key={who}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-center gap-3 rounded-xl border px-4 py-3"
            >
              <KeyRound className="text-accent size-5 shrink-0" />
              <div>
                <p className="font-semibold">{who}</p>
                <p className="text-sm">{doors}</p>
                <p className="text-muted text-xs">{note}</p>
              </div>
            </motion.div>
          ))}
          <p className="text-muted text-xs">
            Lose a guest card and a thief gets one room. Lose the manager&apos;s card and they get
            the hotel.
          </p>
        </div>
      }
    >
      <p>
        A hotel doesn&apos;t give everyone a master key. Each card is programmed with the doors its
        holder needs, and every door checks the card before it opens.
      </p>
      <p>
        Cloud <Term id="iam">identity and access management</Term> works the same way. Every API
        call, from starting a server to reading a file, is checked against{" "}
        <Term id="iam-policy">policies</Term> that say who may do what to which resource. Giving
        each card only the doors it needs is <Term id="least-privilege">least privilege</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Who, what, where -------------------------------------------------------------------------- */

const VOCAB: Record<IamState["cloud"], [string, string][]> = {
  aws: [
    [
      "Who",
      "IAM users, groups and roles (a role is an identity people or programs take on for a while)",
    ],
    ["What", "Policies: JSON lists of allowed or denied actions such as s3:GetObject"],
    ["Where", "The Resource field names what the actions apply to (an ARN)"],
    [
      "Attach",
      "To an identity (identity-based) or to a resource such as a bucket (resource-based)",
    ],
  ],
  azure: [
    [
      "Who",
      "Security principals: users, groups, service principals, managed identities (in Microsoft Entra ID)",
    ],
    ["What", "Role definitions such as Owner, Contributor and Reader: lists of actions"],
    ["Where", "A scope: management group, subscription, resource group or single resource"],
    [
      "Attach",
      "A role assignment ties who + role + scope; it applies to everything below that scope",
    ],
  ],
  gcp: [
    ["Who", "Principals: Google accounts, groups, service accounts, federated identities"],
    ["What", "Roles: bundles of permissions named service.resource.verb, e.g. storage.objects.get"],
    ["Where", "Organisation, folder, project or resource; policies inherit downwards"],
    ["Attach", "An allow policy binds principals to roles on a resource"],
  ],
};

export function ThreeClouds() {
  const [s, set] = useSceneState<IamState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who, what, where"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
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
          <div className="flex flex-col gap-2">
            {VOCAB[s.cloud].map(([k, v], i) => (
              <motion.div
                key={s.cloud + k}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-sm"
              >
                <span className="text-accent w-14 shrink-0 font-semibold">{k}</span>
                <span>{v}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every cloud answers the same three questions: who (a <Term id="principal">principal</Term>),
        what they may do (a set of permissions), and where (which resources). The words differ.
      </p>
      <p>
        Prefer <Term id="iam-role">roles</Term> over personal keys, and narrow roles over broad
        ones. Google advises against its basic Owner, Editor and Viewer roles in production;
        Azure&apos;s Owner can change anyone&apos;s access. Managing IAM costs nothing extra on any
        of the three.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Allowed or denied? ⭐ ---------------------------------------------------------------------- */

const ANALYST: Statement[] = [
  {
    effect: "Allow",
    actions: ["s3:Get*", "s3:List*"],
    resources: ["arn:aws:s3:::reports", "arn:aws:s3:::reports/*"],
  },
  { effect: "Allow", actions: ["s3:PutObject"], resources: ["arn:aws:s3:::reports/drafts/*"] },
  { effect: "Deny", actions: ["s3:*"], resources: ["arn:aws:s3:::reports/confidential/*"] },
];
const BOUNDARY: Statement[] = [
  { effect: "Allow", actions: ["s3:Get*", "s3:List*"], resources: ["*"] },
];

const REQUESTS: Request[] = [
  {
    id: "read-report",
    label: "Read reports/2026/q2.pdf",
    action: "s3:GetObject",
    resource: "arn:aws:s3:::reports/2026/q2.pdf",
  },
  {
    id: "write-draft",
    label: "Upload reports/drafts/q3.docx",
    action: "s3:PutObject",
    resource: "arn:aws:s3:::reports/drafts/q3.docx",
  },
  {
    id: "read-conf",
    label: "Read reports/confidential/salaries.csv",
    action: "s3:GetObject",
    resource: "arn:aws:s3:::reports/confidential/salaries.csv",
  },
  {
    id: "delete",
    label: "Delete reports/2026/q2.pdf",
    action: "s3:DeleteObject",
    resource: "arn:aws:s3:::reports/2026/q2.pdf",
  },
  {
    id: "other",
    label: "Read payroll/june.csv",
    action: "s3:GetObject",
    resource: "arn:aws:s3:::payroll/june.csv",
  },
];

const REASONS: Record<Reason, string> = {
  "explicit-deny": "A Deny statement matches. An explicit deny beats every allow.",
  boundary:
    "The policy allows it, but the permissions boundary doesn't. Boundaries only take away.",
  allowed: "No deny matches, and an Allow statement does.",
  "implicit-deny": "Nothing allows it, so the default applies: denied.",
};

function Flow({ reason }: { reason: Reason }) {
  const rows: [string, boolean | null][] = [
    ["1. Any explicit Deny that matches?", reason === "explicit-deny"],
    ["2. Any Allow that matches?", reason === "explicit-deny" ? null : reason !== "implicit-deny"],
    [
      "3. Do the limits (boundary) allow it too?",
      reason === "allowed" ? true : reason === "boundary" ? false : null,
    ],
  ];
  return (
    <div className="flex flex-col gap-1">
      {rows.map(([q, a]) => (
        <div
          key={q}
          className={cn(
            "flex items-center justify-between rounded-md px-2 py-1 text-xs",
            a === null ? "text-muted opacity-50" : "bg-surface-2",
          )}
        >
          <span>{q}</span>
          <span className="font-mono">{a === null ? "skipped" : a ? "yes" : "no"}</span>
        </div>
      ))}
    </div>
  );
}

export function Evaluate() {
  const [s, set] = useSceneState<IamState>();
  const req = REQUESTS.find((r) => r.id === s.request) ?? REQUESTS[0];
  const res = evaluate(ANALYST, req, s.boundary ? BOUNDARY : undefined);
  return (
    <StepLayout
      eyebrow="Simulation · AWS policy syntax"
      title="Allowed or denied?"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <pre className="border-line bg-surface max-h-80 overflow-auto rounded-lg border p-3 font-mono whitespace-pre-wrap break-all text-[10px] leading-snug">
            {toJson(ANALYST)}
          </pre>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              {REQUESTS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => set({ request: r.id })}
                  className={cn(
                    "rounded-md border px-2 py-1 text-left text-xs",
                    r.id === req.id
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.boundary}
                onChange={(e) => set({ boundary: e.target.checked })}
                className="accent-accent"
              />
              Add a permissions boundary: read-only (s3:Get*, s3:List*)
            </label>
            <p className="text-muted font-mono text-[10px]">
              {req.action} on {req.resource}
            </p>
            <Flow reason={res.reason} />
            <motion.div
              key={req.id + s.boundary}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
                res.allowed ? "border-good bg-good/10" : "border-bad bg-bad/10",
              )}
            >
              {res.allowed ? (
                <Check className="text-good mt-0.5 size-4 shrink-0" />
              ) : (
                <X className="text-bad mt-0.5 size-4 shrink-0" />
              )}
              <span>
                <span className="font-semibold">{res.allowed ? "Allowed. " : "Denied. "}</span>
                {REASONS[res.reason]}
              </span>
            </motion.div>
          </div>
        </div>
      }
    >
      <p>
        This is a real AWS policy for an analyst. Pick a request and watch how it is judged. The
        rules are short: everything starts denied, an <Term id="explicit-deny">explicit deny</Term>{" "}
        always wins, and otherwise one matching Allow is enough.
      </p>
      <p>
        Limits such as a <Term id="permissions-boundary">permissions boundary</Term> or an
        organisation-wide policy never grant anything; a request must pass all of them. Azure and
        Google differ in detail (next steps), but the habit is the same: read the policy as a list
        of doors.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Cut it down to size ⭐ --------------------------------------------------------------------- */

const READ_ACTIONS: [string, string[]][] = [
  ["s3:*", ["s3:*"]],
  ["s3:Get*", ["s3:Get*"]],
  ["s3:GetObject", ["s3:GetObject"]],
];
const READ_RES: [string, string[]][] = [
  ["*", ["*"]],
  ["reports/*", ["arn:aws:s3:::reports/*"]],
  ["reports/input/*", ["arn:aws:s3:::reports/input/*"]],
];
const WRITE_ACTIONS: [string, string[]][] = [
  ["s3:*", ["s3:*"]],
  ["s3:PutObject", ["s3:PutObject"]],
];
const WRITE_RES: [string, string[]][] = [
  ["*", ["*"]],
  ["reports/*", ["arn:aws:s3:::reports/*"]],
  ["reports/output/*", ["arn:aws:s3:::reports/output/*"]],
];

const JOB: (Request & { need: boolean })[] = [
  {
    id: "a",
    need: true,
    label: "Read reports/input/june.csv",
    action: "s3:GetObject",
    resource: "arn:aws:s3:::reports/input/june.csv",
  },
  {
    id: "b",
    need: true,
    label: "Write reports/output/june.pdf",
    action: "s3:PutObject",
    resource: "arn:aws:s3:::reports/output/june.pdf",
  },
  {
    id: "c",
    need: false,
    label: "Read payroll/salaries.csv",
    action: "s3:GetObject",
    resource: "arn:aws:s3:::payroll/salaries.csv",
  },
  {
    id: "d",
    need: false,
    label: "Overwrite reports/input/june.csv",
    action: "s3:PutObject",
    resource: "arn:aws:s3:::reports/input/june.csv",
  },
  {
    id: "e",
    need: false,
    label: "Delete reports/input/june.csv",
    action: "s3:DeleteObject",
    resource: "arn:aws:s3:::reports/input/june.csv",
  },
  {
    id: "f",
    need: false,
    label: "Change the bucket's access policy",
    action: "s3:PutBucketPolicy",
    resource: "arn:aws:s3:::reports",
  },
];

function Pick({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: [string, string[]][];
  onChange(v: number): void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-muted w-20 shrink-0">{label}</span>
      {options.map(([n], i) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(i)}
          className={cn(
            "rounded-full border px-2 py-0.5 font-mono text-[11px]",
            i === value ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export function CutItDown() {
  const [s, set] = useSceneState<IamState>();
  const policy: Statement[] = [
    {
      effect: "Allow",
      actions: READ_ACTIONS[s.readAction][1],
      resources: READ_RES[s.readResource][1],
    },
    {
      effect: "Allow",
      actions: WRITE_ACTIONS[s.writeAction][1],
      resources: WRITE_RES[s.writeResource][1],
    },
  ];
  const results = JOB.map((r) => ({ ...r, allowed: evaluate(policy, r).allowed }));
  const extra = results.filter((r) => !r.need && r.allowed).length;
  const broken = results.filter((r) => r.need && !r.allowed).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Cut it down to size"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold">Statement 1 · reading</p>
            <Pick
              label="Action"
              value={s.readAction}
              options={READ_ACTIONS}
              onChange={(v) => set({ readAction: v })}
            />
            <Pick
              label="Resource"
              value={s.readResource}
              options={READ_RES}
              onChange={(v) => set({ readResource: v })}
            />
            <p className="mt-1 text-xs font-semibold">Statement 2 · writing</p>
            <Pick
              label="Action"
              value={s.writeAction}
              options={WRITE_ACTIONS}
              onChange={(v) => set({ writeAction: v })}
            />
            <Pick
              label="Resource"
              value={s.writeResource}
              options={WRITE_RES}
              onChange={(v) => set({ writeResource: v })}
            />
            <pre className="border-line bg-surface mt-1 max-h-56 overflow-auto rounded-lg border p-2 font-mono whitespace-pre-wrap break-all text-[10px] leading-snug">
              {toJson(policy)}
            </pre>
          </div>
          <div className="flex flex-col gap-1.5">
            {results.map((r) => {
              const good = r.need === r.allowed;
              return (
                <div
                  key={r.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs",
                    good ? "border-line bg-surface" : "border-bad bg-bad/10",
                  )}
                >
                  {r.allowed ? (
                    <Check className="text-good size-3.5 shrink-0" />
                  ) : (
                    <X className="text-muted size-3.5 shrink-0" />
                  )}
                  <span className="flex-1">{r.label}</span>
                  <span className={cn("text-[10px]", good ? "text-muted" : "text-bad")}>
                    {r.need
                      ? r.allowed
                        ? "needed"
                        : "needed, blocked!"
                      : r.allowed
                        ? "not needed, allowed"
                        : "not needed"}
                  </span>
                </div>
              );
            })}
            <p
              className={cn(
                "mt-1 rounded-lg px-3 py-2 text-sm",
                broken ? "bg-bad/10" : extra ? "bg-surface-2" : "bg-good/10",
              )}
            >
              {broken
                ? "Too tight: the job can't do its work."
                : extra
                  ? `Works, but ${extra} unneeded door${extra === 1 ? " is" : "s are"} open.`
                  : "Least privilege: exactly the two doors the job needs."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        A nightly job reads input files and writes a PDF report. Someone gave it{" "}
        <code className="font-mono text-xs">s3:*</code> on{" "}
        <code className="font-mono text-xs">*</code>: every action on every bucket in the account.
        Narrow both statements until only the two needed requests pass.
      </p>
      <p>
        This is not theory. In the 2019 Capital One breach, an attacker tricked a misconfigured web
        firewall into handing over its role&apos;s temporary credentials, and that role could read
        far more storage than it needed: data on about 100 million people in the US and 6 million in
        Canada. Regulators fined the bank $80 million. In practice, tools such as AWS IAM Access
        Analyzer and Google&apos;s role recommender suggest narrower policies from what a role
        actually used.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Predict the answer -------------------------------------------------------------------------- */

export function AllowedOrDenied() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Predict the answer"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="allowed-or-denied"
            prompt="Will each request be allowed or denied?"
            categories={[
              { id: "allow", label: "Allowed" },
              { id: "deny", label: "Denied" },
            ]}
            items={[
              {
                id: "nothing",
                label: "AWS: no policy mentions the action at all",
                category: "deny",
                why: "Everything is denied by default.",
              },
              {
                id: "both",
                label: "AWS: one statement allows it, another explicitly denies it",
                category: "deny",
                why: "An explicit deny always wins.",
              },
              {
                id: "boundary",
                label: "AWS: the policy allows it, the permissions boundary doesn't",
                category: "deny",
                why: "Boundaries and organisation policies only take away; all must allow.",
              },
              {
                id: "notactions",
                label: "Azure: one role lists the action under NotActions, another role grants it",
                category: "allow",
                why: "NotActions just subtracts from that one role; it isn't a deny. Role assignments add up.",
              },
              {
                id: "inherit",
                label: "Google Cloud: Viewer granted on the folder; reading a project inside it",
                category: "allow",
                why: "Allow policies inherit down the hierarchy.",
              },
              {
                id: "gdeny",
                label:
                  "Google Cloud: allowed on the project, but a deny policy on the organisation blocks it",
                category: "deny",
                why: "Deny policies are checked before allow policies.",
              },
            ]}
            explanation="AWS and Google have explicit denies; in Azure only Azure itself creates deny assignments (for example through deployment stacks), so you narrow access by choosing smaller roles and scopes."
          />
        </div>
      }
    >
      <p>
        The rules across the three clouds are close but not identical. Azure has one twist: you
        can&apos;t write your own deny rules, so access is the sum of every role you&apos;re given.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Who, what, where", "Every request is checked: principal, action, resource."],
  ["Default deny, deny wins", "One allow is enough unless a deny or a limit says no."],
  ["Least privilege", "Grant the doors the job needs; trim with usage data."],
  [
    "Guard the master keys",
    "Multi-factor sign-in for root and admin accounts: required, or becoming required, on all three clouds.",
  ],
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
        AWS has required MFA for root users since 2024, Azure requires it for portal and (since 1
        October 2025) command-line changes, and Google is rolling out 2-step verification for the
        console through 2026. Next: how programs get access without any long-lived keys.
      </p>
    </StepLayout>
  );
}
