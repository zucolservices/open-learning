"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MW, START, TESTS, evaluate } from "./model";
import type { MwState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Airport() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Airport checkpoints"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {["Check-in desk", "Passport control", "Security scan", "Boarding gate", "The plane"].map(
            (t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  i === 4 ? "border-accent bg-accent-soft font-semibold" : "border-line bg-surface",
                )}
                style={{ marginLeft: i * 10 }}
              >
                {t}
              </motion.div>
            ),
          )}
        </div>
      }
    >
      <p>
        Every passenger passes the same checkpoints in the same order before reaching the plane.
        Swap them round, checking boarding passes before anyone has shown a passport, and the system
        stops making sense.
      </p>
      <p>
        <Term id="middleware">Middleware</Term> is a server&apos;s line of checkpoints. Every
        request passes through it on the way to the handler, and the response passes back out. Order
        matters.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pipeline ⭐ ---------------------------------------------------------------------------------- */

export function Pipeline() {
  const [s, set] = useSceneState<MwState>();
  const res = evaluate(s.order);
  const move = (i: number, d: -1 | 1) => {
    const o = [...s.order];
    [o[i], o[i + d]] = [o[i + d], o[i]];
    set({ order: o });
  };
  const all = TESTS.every((t) => res[t.id].ok);
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Put the pipeline in order"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="grid gap-1">
            <p className="text-muted text-[10px]">Request enters here ↓</p>
            {s.order.map((id, i) => (
              <motion.div
                layout
                key={id}
                className="border-line bg-surface flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs"
              >
                <span className="text-subtle w-4 text-right font-mono">{i + 1}</span>
                <span className="flex-1">{MW.find((m) => m.id === id)!.label}</span>
                <button
                  type="button"
                  aria-label={`Move ${id} up`}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="border-line-strong rounded border p-0.5 disabled:opacity-30"
                >
                  <ArrowUp className="size-3" />
                </button>
                <button
                  type="button"
                  aria-label={`Move ${id} down`}
                  disabled={i === s.order.length - 1}
                  onClick={() => move(i, 1)}
                  className="border-line-strong rounded border p-0.5 disabled:opacity-30"
                >
                  <ArrowDown className="size-3" />
                </button>
              </motion.div>
            ))}
            <div className="border-accent bg-accent-soft rounded-lg border px-2 py-1.5 text-center text-xs font-semibold">
              Handler
            </div>
            <button
              type="button"
              onClick={() => set({ order: START })}
              className="text-muted self-start text-[10px] underline"
            >
              Shuffle back
            </button>
          </div>
          <div className="grid content-start gap-1">
            {TESTS.map((t) => {
              const r = res[t.id];
              return (
                <div
                  key={t.id}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    r.ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
                  )}
                >
                  <p className="flex items-center gap-1 font-medium">
                    {r.ok ? (
                      <Check className="text-good size-3.5" />
                    ) : (
                      <X className="text-bad size-3.5" />
                    )}
                    {t.label}
                  </p>
                  <p className="text-muted text-[10px]">{r.text}</p>
                </div>
              );
            })}
            {all && (
              <p className="text-good text-xs">
                Errors caught outermost, everything logged, cheap refusals early, identity before
                permission.
              </p>
            )}
          </div>
        </div>
      }
    >
      <p>
        Six middleware wrap a café API in a scrambled order. Move them until all five test requests
        behave. The top of the list sees the request first and the response last.
      </p>
      <p>There&apos;s one order that passes everything; a couple of others come close.</p>
    </StepLayout>
  );
}

/* 3 ─ The onion ------------------------------------------------------------------------------------ */

export function Onion() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="In through the layers, out in reverse"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Express",
              "Functions (req, res, next) in registration order. Error handlers take four arguments and are registered last.",
            ],
            [
              "Koa, Django, ASP.NET Core",
              "An “onion”: code before the next call runs on the way in, code after it on the way out.",
            ],
            ["Go", "Middleware is a function that wraps one http.Handler in another."],
            [
              "Spring",
              "Servlet filters run first; MVC interceptors run around handlers but aren't meant as a security layer.",
            ],
            [
              "Fastify",
              "Named lifecycle hooks (onRequest, preHandler, onSend…) instead of a single chain.",
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
        Whatever the framework, middleware can do three things: change the request, return early
        without reaching the handler (a short-circuit), or change the response on its way out.
      </p>
      <p>
        ASP.NET Core&apos;s documentation spells out a recommended order: exception handling first,
        then HTTPS and static files, routing, CORS and rate limiting, authentication, then
        authorization.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Common middleware ---------------------------------------------------------------------------- */

export function Common() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What belongs in middleware"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Request IDs and logging",
              "Tag every request so its log lines can be found together.",
            ],
            ["Security headers", "HSTS, content security policy, no-sniff."],
            ["Compression", "Shrink responses on the way out."],
            ["CSRF protection", "Go 1.25 added CrossOriginProtection to its standard library."],
            ["Timeouts and body limits", "Stop slow or huge requests early."],
            ["Not business rules", "Those belong in services, not in a global pipeline."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 5 ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Middleware is for cross-cutting concerns: things every request needs, regardless of what it
        does. Writing them once keeps handlers small.
      </p>
      <p>
        A gotcha in Express: the default error handler includes the stack trace unless the
        environment is set to production. Ordering and configuration both matter.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function MwCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Order the essentials"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="backend-middleware"
            prompt="Order these from outermost (sees the request first) to innermost."
            items={[
              { id: "error", label: "Exception handling" },
              { id: "cors", label: "CORS" },
              { id: "authn", label: "Authentication" },
              { id: "authz", label: "Authorization" },
              { id: "handler", label: "The route handler" },
            ]}
            explanation="Catch errors from everything inside; answer CORS before demanding credentials; find out who someone is before deciding what they may do; then run the handler."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Every request passes through", "In, then back out in reverse."],
        ["Errors outermost", "Catch everything inside."],
        ["Cheap checks early", "CORS and rate limits before auth."],
        ["Who, then what", "Authentication before authorization."],
        ["Cross-cutting only", "No business rules in middleware."],
      ]}
    >
      <p>Next: validating input and returning clear, safe errors.</p>
    </WrapStep>
  );
}
