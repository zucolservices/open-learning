"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ENDPOINTS, FIXES, type Fix } from "./model";
import type { AuthzState } from "./state";

const MODELS: { id: string; label: string; rule: string; note: string }[] = [
  {
    id: "rbac",
    label: "Roles (RBAC)",
    rule: "staff can delete menu items",
    note: "Simple and common. Roles alone can't express “only your own orders”.",
  },
  {
    id: "abac",
    label: "Attributes (ABAC)",
    rule: "allow if user.id == order.customerId and order.status == 'open'",
    note: "Rules over properties of the user, the resource and the context, like time or location.",
  },
  {
    id: "rebac",
    label: "Relationships (ReBAC)",
    rule: "manager of a branch can refund orders of that branch",
    note: "Permissions follow relationships in a graph, as in Google's Zanzibar paper (2019).",
  },
];

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Hotel() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The hotel key card"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Check-in proves who you are",
              "The receptionist sees your passport. That's authentication.",
            ],
            [
              "The key card decides where you can go",
              "Your room and the gym, not other guests' rooms or the kitchen. That's authorization.",
            ],
            ["Every door checks", "Not just the front entrance."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        A hotel doesn&apos;t let you into every room just because you checked in. Each door checks
        your card for that specific room.
      </p>
      <p>
        <Term id="authorization">Authorization</Term> is that check in a backend: what a signed-in
        user may do, to which specific record. Broken access control is number one in OWASP&apos;s
        2025 Top 10.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix ⭐ --------------------------------------------------------------------------------------- */

export function FixChecks() {
  const [s, set] = useSceneState<AuthzState>();
  const right = (id: string) => s.picks[id] === ENDPOINTS.find((e) => e.id === id)!.answer;
  const done = ENDPOINTS.every((e) => right(e.id));
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Find and fix the missing checks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {ENDPOINTS.map((e) => (
            <div
              key={e.id}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs",
                right(e.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <p>
                <span className="font-mono text-[11px] font-semibold">{e.route}</span>
                <span className="text-muted"> · {e.now}</span>
              </p>
              <p className={cn("text-[10px]", e.answer === "none" ? "text-muted" : "text-bad")}>
                {e.answer === "none" ? "What happens" : "Attack (described)"}: {e.attack}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {FIXES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={s.picks[e.id] === f.id}
                    onClick={() => set({ picks: { ...s.picks, [e.id]: f.id as Fix } })}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px]",
                      s.picks[e.id] === f.id
                        ? right(e.id)
                          ? "border-good bg-good/20"
                          : "border-bad bg-bad/15"
                        : "border-line text-muted",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {s.picks[e.id] && (
                <p className={cn("mt-0.5 text-[10px]", right(e.id) ? "text-good" : "text-muted")}>
                  {right(e.id) ? e.why : "Would that stop the attack described above?"}
                </p>
              )}
            </div>
          ))}
          {done && (
            <p className="text-good text-xs">
              Every request is checked on the server, against the specific record, and anything not
              allowed is denied.
            </p>
          )}
        </div>
      }
    >
      <p>
        A café&apos;s API has six endpoints. For each, the attack is described in words. Choose the
        check that stops it, or mark it as fine.
      </p>
      <p>
        The pattern behind most of these: the app hid something, but the server didn&apos;t check.
        Anyone can call the API directly.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Models --------------------------------------------------------------------------------------- */

export function Models() {
  const [s, set] = useSceneState<AuthzState>();
  const m = MODELS.find((x) => x.id === s.model)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Roles, attributes and relationships"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.model}
            onChange={(model) => set({ model })}
            options={MODELS.map((x) => [x.id, x.label])}
          />
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[11px]">
            {m.rule}
          </pre>
          <p className="text-muted text-xs">{m.note}</p>
        </div>
      }
    >
      <p>
        Most real systems combine models: roles for broad permissions, ownership or attribute rules
        for individual records, and sometimes relationships for teams and sharing.
      </p>
      <p>Whatever the model, keep the rules in one place rather than scattered through handlers.</p>
    </StepLayout>
  );
}

/* 4 ─ Engines -------------------------------------------------------------------------------------- */

export function Engines() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Policy engines"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Open Policy Agent (OPA)", "Policies in the Rego language; a graduated CNCF project."],
            ["Cedar", "Created at AWS (2023); a CNCF sandbox project since October 2025."],
            ["OpenFGA", "Zanzibar-style relationships; CNCF incubating since October 2025."],
            ["SpiceDB, Cerbos, Casbin", "Other open-source options."],
            ["Oso", "The open-source library is deprecated in favour of Oso Cloud."],
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
        A policy engine separates the question &ldquo;may this user do this action on this
        resource?&rdquo; from your code. Your handler asks; the engine decides; you enforce.
      </p>
      <p>
        OWASP&apos;s API Security Top 10 (2023 is still the latest) puts broken object-level
        authorization first. Log denied attempts: a burst of them often means someone is probing.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function AuthzCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Real protection?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backend-authorization"
            prompt="Does each measure actually stop someone doing what they shouldn't?"
            categories={[
              { id: "yes", label: "Real protection" },
              { id: "no", label: "Not protection" },
            ]}
            items={[
              {
                id: "hide",
                label: "Hiding the Delete button for non-staff in the app",
                category: "no",
                why: "The API can still be called directly.",
              },
              {
                id: "owner",
                label: "Checking on the server that the order belongs to the user",
                category: "yes",
                why: "Object-level authorization.",
              },
              {
                id: "url",
                label: "Using a long, hard-to-guess admin URL",
                category: "no",
                why: "URLs leak; obscurity isn't access control.",
              },
              {
                id: "role",
                label: "Requiring the staff role on DELETE /menu",
                category: "yes",
                why: "Function-level authorization.",
              },
              {
                id: "front",
                label: "Filtering the order list in the browser",
                category: "no",
                why: "The full list was already sent.",
              },
            ]}
            explanation="Only server-side checks count, on every request and every record. Anything in the app can be bypassed."
          />
        </div>
      }
    >
      <p>Sort each measure.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Who, then what", "Authentication, then authorization."],
        ["Check every object", "Ownership on every request."],
        ["Deny by default", "Allow only what's explicit."],
        ["Server-side only", "The app can be bypassed."],
        ["Rules in one place", "Or a policy engine."],
      ]}
    >
      <p>That ends the identity chapter. Next: background jobs and queues.</p>
    </WrapStep>
  );
}
