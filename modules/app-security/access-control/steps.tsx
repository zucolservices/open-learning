"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES, CONTROLS, REQUESTS, serve, type Ctl } from "./model";
import type { AcState } from "./state";

/* 1 ─ A guest isn't every guest ------------------------------------------------------------------- */

export function KeyCard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A guest isn't every guest"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="grid grid-cols-4 gap-2">
            {[410, 411, 412, 413, 414, 415, 416, 417].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "rounded-lg border px-3 py-3 text-center font-mono text-xs",
                  n === 412 ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                🚪 {n}
                <p className="text-[10px]">{n === 412 ? "your card ✓" : "✗"}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        At check-in a hotel confirms who you are and hands you a key card. That card should open
        room 412, not every room on the floor. Proving you&apos;re a guest is one question; which
        doors you may open is another.
      </p>
      <p>
        Software makes the same split. <Term id="authentication">Authentication</Term> asks “who are
        you?”. <Term id="authorisation">Authorisation</Term> asks “may you do this, to this thing?”.
        Broken access control, the number one risk in the OWASP Top 10, is when the second question
        is skipped. In 2025 OWASP found some form of it in every application tested.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Change one number ⭐ ------------------------------------------------------------------------ */

export function InvoiceViewer() {
  const [s, set] = useSceneState<AcState>();
  const on = s.on ?? [];
  const toggle = (c: Ctl) => set({ on: on.includes(c) ? on.filter((x) => x !== c) : [...on, c] });
  const r = serve(s.req, s.who, on);
  const req = REQUESTS.find((x) => x.id === s.req) ?? REQUESTS[0];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Change one number"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {CONTROLS.map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  on.includes(c.id) ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.includes(c.id)}
                  onChange={() => toggle(c.id)}
                  className="accent-accent mt-0.5"
                  aria-label={c.name}
                />
                <span>
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-muted block">{c.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted">Caller:</span>
            {(["ravi", "anon"] as const).map((w) => (
              <button
                key={w}
                type="button"
                aria-pressed={s.who === w}
                onClick={() => set({ who: w })}
                className={cn(
                  "rounded-full border px-3 py-1",
                  s.who === w ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {w === "ravi" ? "Ravi, logged in" : "Not logged in"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {REQUESTS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.req === x.id}
                onClick={() => set({ req: x.id })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  s.req === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface overflow-hidden rounded-xl border font-mono text-[11px]">
            <div className="bg-surface-2 px-3 py-1.5">GET {req.path(on.includes("random"))}</div>
            <motion.div
              key={`${s.req}-${s.who}-${on.join()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("px-3 py-2", r.leak ? "bg-bad/10 text-bad" : "text-fg")}
            >
              {r.status} · {r.body}
            </motion.div>
          </div>
          <p className={cn("text-xs", r.leak ? "text-bad" : "text-muted")}>{r.why}</p>
          <p className="text-subtle text-[10px]">A made-up shop and customers.</p>
        </div>
      }
    >
      <p>
        Ravi is logged in and looks at invoice 1041. What happens at 1042? Try each request with
        only “Require login” switched on, then add checks one at a time.
      </p>
      <p>
        This is an <Term id="idor">IDOR</Term>, an insecure direct object reference; for APIs OWASP
        calls it broken object level authorisation, the number one API risk. Random IDs stop
        guessing, but not a forwarded link. Only an ownership check, on the server, for every
        request, closes it. Missing authorisation is number four in MITRE&apos;s 2025 CWE Top 25.
      </p>
    </StepLayout>
  );
}

/* 3 ─ It happened at scale ------------------------------------------------------------------------ */

export function RealCases() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="It happened at scale"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CASES.map(([t, d], i) => (
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
        None of these needed clever hacking. Someone changed a number, or simply used an account
        they were allowed to create. Peloton&apos;s case shows why “add a login” isn&apos;t a fix:
        the ownership check was still missing.
      </p>
      <p>
        These bugs are easy to miss in testing, because each developer tests with their own data,
        where everything looks right.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Writing the rules down ---------------------------------------------------------------------- */

const MODELS: [string, string, string][] = [
  [
    "RBAC",
    "Role-based: permissions belong to roles; people get roles.",
    "“Finance staff may export invoices.” (NIST, 1992)",
  ],
  [
    "ABAC",
    "Attribute-based: decide from attributes of the user, the object and the situation.",
    "“Managers may approve refunds up to ₹10,000 for their own branch.” (NIST SP 800-162)",
  ],
  [
    "ReBAC",
    "Relationship-based: decide from links between people and things.",
    "“Anyone the owner shared this folder with may view it.” (Google Zanzibar, 2019; OpenFGA, SpiceDB)",
  ],
];

export function Models() {
  const [s, set] = useSceneState<AcState>();
  const [name, what, eg] = MODELS[s.model] ?? MODELS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Writing the rules down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {MODELS.map(([n], i) => (
              <button
                key={n}
                type="button"
                aria-pressed={s.model === i}
                onClick={() => set({ model: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.model === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-4 py-3 text-xs"
          >
            <p className="text-sm font-semibold">{name}</p>
            <p>{what}</p>
            <p className="text-muted mt-1">{eg}</p>
          </motion.div>
          <Code>{`// Deny by default: load the invoice only if it belongs to the caller
const invoice = await db.invoice.findFirst({
  where: { id: params.id, customerId: session.userId },
});
if (!invoice) return notFound();   // same answer whether it's missing or someone else's`}</Code>
        </div>
      }
    >
      <p>
        Whatever the model, the same rules apply: deny by default, check on the server for every
        request, and check the exact object. Put the check in one shared place rather than in each
        page, so new endpoints can&apos;t forget it.
      </p>
      <p>
        Policy engines such as Open Policy Agent (a graduated CNCF project) and AWS&apos;s
        open-source Cedar keep these rules out of application code, so they can be reviewed and
        tested on their own.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Who are you, or what may you do? ------------------------------------------------------------ */

export function AuthnOrAuthz() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Who are you, or what may you do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="authn-authz"
            prompt="Is each check authentication or authorisation?"
            categories={[
              { id: "authn", label: "Authentication" },
              { id: "authz", label: "Authorisation" },
            ]}
            items={[
              {
                id: "pw",
                label: "Checking the password is correct",
                category: "authn",
                why: "Who are you?",
              },
              {
                id: "owner",
                label: "Checking invoice 1042 belongs to the caller",
                category: "authz",
                why: "May you see this thing?",
              },
              {
                id: "passkey",
                label: "Verifying a passkey signature",
                category: "authn",
                why: "Proving identity.",
              },
              {
                id: "export",
                label: "Only the finance role may export all invoices",
                category: "authz",
                why: "May you do this action?",
              },
              {
                id: "session",
                label: "Checking the session cookie is valid",
                category: "authn",
                why: "Still the same person?",
              },
              {
                id: "refund",
                label: "Managers may approve refunds up to ₹10,000",
                category: "authz",
                why: "A permission rule.",
              },
            ]}
            explanation="Authentication establishes who someone is; authorisation decides what that person may do, to which object, on every request."
          />
        </div>
      }
    >
      <p>Sort the checks.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Logged in isn't allowed", "Authentication ≠ authorisation."],
  ["Check the exact object", "Every request, on the server."],
  ["Deny by default", "No rule says yes? The answer is no."],
  ["Random IDs aren't a check", "Links get shared."],
  ["One place for rules", "RBAC, ABAC, ReBAC; policy engines."],
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
      <p>Next: letting people sign in with another service, with OAuth and OpenID Connect.</p>
    </StepLayout>
  );
}
