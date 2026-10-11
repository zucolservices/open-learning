"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DESIGN, INCIDENTS, SALE, TOOLS, type Choice } from "./model";
import type { CapState } from "./state";

function Choices({
  items,
  value,
  onPick,
}: {
  items: Choice[];
  value: Record<string, string>;
  onPick(id: string, opt: string): void;
}) {
  return (
    <div className="grid gap-2">
      {items.map((d) => {
        const pick = d.options.find((o) => o.id === value[d.id]);
        return (
          <div key={d.id} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">{d.title}</p>
            <div className="mt-1 grid gap-1">
              {d.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={pick?.id === o.id}
                  onClick={() => onPick(d.id, o.id)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-left text-[11px]",
                    pick?.id === o.id
                      ? o.ok
                        ? "border-good bg-good/15"
                        : "border-bad bg-bad/10"
                      : "border-line hover:border-line-strong",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {pick && (
              <p className={cn("mt-1 text-[11px]", pick.ok ? "text-good" : "text-muted")}>
                {pick.outcome}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Launch() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Opening day for online orders"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            "Week 1: design the order service",
            "Launch day: real customers, real problems",
            "Diwali sale: ten times the traffic",
          ].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A chain of cafés and sweet shops (made up) is launching online ordering. You&apos;re
        building the order service: from design, through a bumpy launch day, to the biggest sale of
        the year.
      </p>
      <p>
        Every problem ahead is one you&apos;ve met in this track. This time they arrive together, in
        a real <Term id="backend">backend</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Design --------------------------------------------------------------------------------------- */

export function Design() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Week one: design decisions"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <Choices
            items={DESIGN}
            value={s.design}
            onPick={(id, o) => set({ design: { ...s.design, [id]: o } })}
          />
        </div>
      }
    >
      <p>Three early choices shape how easy the service will be to change, secure and run.</p>
      <p>You can change your mind; each choice shows its consequence.</p>
    </StepLayout>
  );
}

/* 3 ─ Incidents ⭐ --------------------------------------------------------------------------------- */

export function Incidents() {
  const [s, set] = useSceneState<CapState>();
  const right = (id: string) => s.fixes[id] === INCIDENTS.find((x) => x.id === id)!.answer;
  const done = INCIDENTS.every((x) => right(x.id));
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Launch day: six incidents"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {INCIDENTS.map((x) => (
            <div
              key={x.id}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs",
                right(x.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <p className="font-medium">{x.text}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {TOOLS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={s.fixes[x.id] === t.id}
                    onClick={() => set({ fixes: { ...s.fixes, [x.id]: t.id } })}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px]",
                      s.fixes[x.id] === t.id
                        ? right(x.id)
                          ? "border-good bg-good/20"
                          : "border-bad bg-bad/15"
                        : "border-line text-muted",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {s.fixes[x.id] && (
                <p className={cn("mt-0.5 text-[10px]", right(x.id) ? "text-good" : "text-muted")}>
                  {right(x.id) ? x.why : "That tool helps elsewhere. What actually caused this?"}
                </p>
              )}
            </div>
          ))}
          {done && (
            <p className="text-good text-xs">
              Six incidents, six different tools. Most launches meet several of these on day one.
            </p>
          )}
        </div>
      }
    >
      <p>
        Online orders go live, and the support inbox fills up. Match each incident to the fix that
        addresses its cause. One tool is a red herring.
      </p>
      <p>Each maps to a module in this track; revisit any of them if you&apos;re unsure.</p>
    </StepLayout>
  );
}

/* 4 ─ Sale ----------------------------------------------------------------------------------------- */

export function Sale() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The Diwali sale"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <Choices
            items={SALE}
            value={s.sale}
            onPick={(id, o) => set({ sale: { ...s.sale, [id]: o } })}
          />
        </div>
      }
    >
      <p>
        Traffic jumps tenfold for the year&apos;s biggest sale. Three pressures appear at once.
        Decide how to handle each.
      </p>
      <p>Numbers in the outcomes are illustrative.</p>
    </StepLayout>
  );
}

/* 5 ─ The whole picture ---------------------------------------------------------------------------- */

export function Picture() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="One order, end to end"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1">
          {[
            ["Rate limiter", "fair shares for every client"],
            ["Middleware", "request ID, authentication, errors"],
            ["Handler", "validate the input at the boundary"],
            ["Service", "authorization, business rules"],
            ["Payment client", "timeout, retries with an idempotency key, circuit breaker"],
            ["Repository", "one transaction: stock, order, outbox row"],
            ["Response", "201 with the order, logged with its request ID"],
            ["Afterwards", "outbox relay → queue: email and webhooks, with retries"],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface flex gap-2 rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="w-36 shrink-0 font-semibold">{t}</span>
              <span className="text-muted">{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Here is everything a single order touches, in the order it happens. Each line is a module
        from this track.
      </p>
      <p>
        None of it is exotic. Reliable backends are mostly the careful, consistent application of a
        dozen well-known ideas.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Inside one order request"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="backend-capstone"
            prompt="Put what happens to an order request in order, first to last."
            items={[
              { id: "limit", label: "Rate limit and authenticate the request" },
              { id: "validate", label: "Validate the input" },
              { id: "authz", label: "Check the customer may do this" },
              { id: "tx", label: "Save stock change, order and outbox row in one transaction" },
              { id: "reply", label: "Reply 201; workers send the email afterwards" },
            ]}
            explanation="Cheap checks first, then validation and permission, then one atomic write, then reply and let background work follow."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Structure for change", "Layers inside features."],
        ["Correct under concurrency", "Transactions, locks, idempotency."],
        ["Secure by default", "Validate, authenticate, authorise every request."],
        ["Resilient to others' failures", "Timeouts, retries, breakers, queues."],
        ["Easy to run", "Logs, health checks, gradual rollouts."],
      ]}
    >
      <p>
        That completes Backend. You can now design, build and run a service that stays correct, fast
        and safe under real traffic, in whichever language your team uses.
      </p>
    </WrapStep>
  );
}
