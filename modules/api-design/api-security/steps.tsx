"use client";

import { motion } from "motion/react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HOLES, TOP10 } from "./model";
import type { SecState } from "./state";

/* 1 ─ The hotel key card -------------------------------------------------------------------------- */

export function KeyCard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The hotel key card"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <CreditCard className="text-accent size-5" />
            <p className="font-semibold">At the front desk</p>
            <p className="text-muted text-sm">
              They check your ID and give you a card. That&apos;s authentication.
            </p>
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <ShieldCheck className="text-accent size-5" />
            <p className="font-semibold">At every door</p>
            <p className="text-muted text-sm">
              The lock checks your card opens <em>this</em> room. That&apos;s authorisation, and it
              has to happen at every door.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Imagine a hotel where the front desk checks IDs carefully, but every room&apos;s lock opens
        for any guest card. Nobody breaks in through the front door; they just walk down the
        corridor trying handles.
      </p>
      <p>
        That&apos;s the most common way APIs are breached. Signing in works, but the API forgets to
        check, on each request, whether <em>this</em> caller may touch <em>this</em> record. It tops
        the OWASP list as <Term id="bola">broken object level authorisation</Term>. A close cousin,{" "}
        <Term id="mass-assignment">mass assignment</Term>, lets callers set fields they
        shouldn&apos;t.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Attack, then fix ⭐ ------------------------------------------------------------------------- */

export function AttackFix() {
  const [s, set] = useSceneState<SecState>();
  const fixed = s.fixed ?? [];
  const h = HOLES.find((x) => x.id === s.hole) ?? HOLES[0];
  const isFixed = fixed.includes(h.id);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Attack, then fix"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {HOLES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.hole === x.id}
                onClick={() => set({ hole: x.id })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.hole === x.id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                  fixed.includes(x.id) && "text-good",
                )}
              >
                {fixed.includes(x.id) ? "✓ " : ""}
                {x.title}
              </button>
            ))}
          </div>
          <p className="text-muted font-mono text-[10px]">{h.owasp}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-muted mb-1 font-mono text-[10px]">you, signed in as Asha, send</p>
              <Code>{h.request}</Code>
            </div>
            <div>
              <p className="text-muted mb-1 font-mono text-[10px]">the API answers</p>
              <motion.div
                key={h.id + isFixed}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className={cn("rounded-lg border-2", isFixed ? "border-good/60" : "border-bad/60")}
              >
                <Code>{isFixed ? h.fixed : h.vulnerable}</Code>
              </motion.div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs">
              <span className="font-semibold">Fix:</span>{" "}
              <span className="text-muted">{h.fix}</span>
            </p>
            <button
              type="button"
              onClick={() =>
                set({ fixed: isFixed ? fixed.filter((x) => x !== h.id) : [...fixed, h.id] })
              }
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium",
                isFixed ? "border-line border" : "bg-accent text-accent-fg",
              )}
            >
              {isFixed ? "Undo the fix" : "Apply the fix"}
            </button>
          </div>
          <p className={cn("text-sm", fixed.length === HOLES.length ? "text-good" : "text-muted")}>
            {fixed.length === HOLES.length
              ? "All six holes closed. None needed clever cryptography, only checks on every request."
              : `${fixed.length} of ${HOLES.length} holes fixed.`}
          </p>
          <p className="text-subtle text-[10px]">
            Illustrative parcel API; names and data are made up.
          </p>
        </div>
      }
    >
      <p>
        A parcel company&apos;s API has six holes, each a category from the OWASP API Security Top
        10. You&apos;re signed in as an ordinary customer. Try each attack, then apply the fix and
        try again.
      </p>
      <p>
        OWASP&apos;s advice for the first: check authorisation &ldquo;in every function that uses an
        input from the client to access a record in the database&rdquo;. Random, hard-to-guess IDs
        help, but they are not a lock; the check is.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The OWASP API Top 10 ------------------------------------------------------------------------ */

export function TopTen() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The OWASP API Top 10"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1">
          {TOP10.map(([k, t], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              className={cn(
                "grid grid-cols-[3.5rem_1fr] gap-2 rounded-md border px-3 py-1.5 text-xs",
                [0, 2, 3, 4, 8].includes(i)
                  ? "border-accent/40 bg-accent-soft"
                  : "border-line bg-surface",
              )}
            >
              <span className="font-mono font-semibold">{k}</span>
              <span>{t}</span>
            </motion.div>
          ))}
          <p className="text-muted mt-1 text-[10px]">
            2023 edition, the latest. Highlighted: the ones you just fixed.
          </p>
        </div>
      }
    >
      <p>
        OWASP, a non-profit security community, publishes a list of the most critical API risks.
        Three of the top five are about authorisation: on objects, on their fields, and on
        functions.
      </p>
      <p>
        Others are about scale and housekeeping: no limits on how much a caller can ask for,
        forgotten old versions, and trusting other companies&apos; APIs more than your own
        users&apos; input.
      </p>
    </StepLayout>
  );
}

/* 4 ─ It really happens --------------------------------------------------------------------------- */

const CASES: [string, string][] = [
  [
    "Optus, Australia, 2022",
    "Regulators allege an attacker bypassed access controls on an old API domain that was no longer needed; about 9.5 million people's data was taken. The regulator called the attack “not highly sophisticated”. Court cases are ongoing.",
  ],
  [
    "T-Mobile, USA, 2023",
    "A filing with the US SEC said “a bad actor was obtaining data through a single Application Programming Interface” without authorisation, affecting about 37 million customer accounts.",
  ],
  [
    "Peloton, 2021",
    "Security researchers found its API returned users' personal data “despite profile being set as 'private'”.",
  ],
  [
    "GitHub, 2012",
    "A user exploited a mass-assignment bug in the public-key form to add his key to the rails organisation.",
  ],
];

export function RealBreaches() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="It really happens"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CASES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
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
        None of these needed a clever exploit. A forgotten endpoint, a missing check, a form that
        accepted one field too many.
      </p>
      <p>
        That&apos;s good news: the defences are ordinary engineering. Check ownership and roles on
        every request, accept only the fields you expect, return only the fields you mean to, cap
        everything, and know every API you run.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Real fix or not enough? --------------------------------------------------------------------- */

export function RealFix() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Real fix or not enough?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="real-fix"
            prompt="Customers can read each other's parcels by changing the ID. Is each change a real fix, or not enough on its own?"
            categories={[
              { id: "real", label: "Real fix" },
              { id: "weak", label: "Not enough" },
            ]}
            items={[
              {
                id: "owner",
                label: "In the handler, load the parcel and check it belongs to the caller",
                category: "real",
                why: "The check that actually decides access.",
              },
              {
                id: "policy",
                label: "A shared authorisation library every endpoint must call",
                category: "real",
                why: "The same check everywhere, harder to forget.",
              },
              {
                id: "tests",
                label: "Automated tests that try other users' IDs on every endpoint",
                category: "real",
                why: "Catches the next endpoint someone forgets.",
              },
              {
                id: "uuid",
                label: "Switch to random UUIDs so IDs can't be guessed",
                category: "weak",
                why: "Harder to guess, but IDs leak in links, logs and screenshots.",
              },
              {
                id: "hide",
                label: "Remove the endpoint from the public docs",
                category: "weak",
                why: "Attackers read app traffic, not your docs.",
              },
              {
                id: "app",
                label: "Make the mobile app show only the user's own parcels",
                category: "weak",
                why: "Attackers call the API directly, not through your app.",
              },
            ]}
            explanation="Only a server-side check on every request controls access. Obscurity and client-side hiding don't."
          />
        </div>
      }
    >
      <p>The difference between hiding a door and locking it.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Authenticate, then authorise", "Every request, every object."],
  ["Allow-list fields in and out", "No mass assignment, no extra data."],
  ["Check roles on every function", "Not just in the admin screen."],
  ["Cap everything", "Page sizes, payloads, rates."],
  ["Know every API you run", "Retire old versions for real."],
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
      <p>Next: capping how often each caller can call, and telling them nicely when they hit it.</p>
    </StepLayout>
  );
}
