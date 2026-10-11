"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AFTER_LOG, BEFORE_LOG, FIXES, SCENARIOS } from "./model";
import type { OpsState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Shift() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A good shift handover"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Write it down properly",
              "“Table 12, 13:05, cold soup, replaced” beats “something went wrong earlier”.",
            ],
            [
              "Say when you can't take tables",
              "“I'm on a break” is different from “I've collapsed, call a doctor”.",
            ],
            [
              "Finish your tables before you leave",
              "Don't walk out mid-order when your shift ends.",
            ],
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
        Good café staff leave clear notes, tell the manager whether they can take more tables, and
        finish serving before they go home.
      </p>
      <p>
        A running service should do the same: <Term id="structured-logging">structured logs</Term>{" "}
        that explain what happened, honest <Term id="health-check">health checks</Term>, and a{" "}
        <Term id="graceful-shutdown">graceful shutdown</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix ⭐ --------------------------------------------------------------------------------------- */

export function FixOps() {
  const [s, set] = useSceneState<OpsState>();
  const on = (id: string) => s.fixed.includes(id);
  const toggle = (id: string) =>
    set({ fixed: on(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Make the service easy to run"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1">
            {FIXES.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={on(f.id)}
                onClick={() => toggle(f.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  on(f.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                {on(f.id) ? f.fix : f.problem}
              </button>
            ))}
          </div>
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-2 font-mono text-[10px]">
            {on("logs") ? AFTER_LOG : BEFORE_LOG}
          </pre>
          <div className="grid gap-1">
            {SCENARIOS.map((sc) => {
              const ok = sc.needs.every(on);
              return (
                <motion.div
                  key={sc.id}
                  layout
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
                  )}
                >
                  <p className="flex items-center gap-1 font-medium">
                    {ok ? (
                      <Check className="text-good size-3.5 shrink-0" />
                    ) : (
                      <X className="text-bad size-3.5 shrink-0" />
                    )}
                    {sc.label}
                  </p>
                  <p className="text-muted text-[10.5px]">{ok ? sc.pass : sc.fail}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        The café service works, but it&apos;s hard to run: unhelpful logs, a health check that does
        the wrong job, and a rough shutdown. Fix each problem and check three everyday situations.
      </p>
      <p>The examples assume Kubernetes, but the same ideas apply on any platform.</p>
    </StepLayout>
  );
}

/* 3 ─ Probes and shutdown -------------------------------------------------------------------------- */

export function Probes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Probes and the shutdown sequence"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid gap-1.5 text-xs sm:grid-cols-3">
            {[
              ["Liveness", "Fails → the container is restarted."],
              ["Readiness", "Fails → no traffic, but no restart."],
              ["Startup", "Holds the other probes off while a slow app starts."],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{b}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-1 text-xs">
            {[
              "Pod marked terminating; removed from load balancing (in parallel, so a few requests may still arrive)",
              "Optional preStop hook runs",
              "SIGTERM: stop accepting, drain in-flight requests",
              "After the grace period (30 s by default), SIGKILL",
            ].map((t, i) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <span className="text-muted mr-2 font-mono">{i + 1}</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Frameworks help: Spring Boot has shut down gracefully by default since 3.4, Go has
        Server.Shutdown, and Node.js&apos;s server.close() also closes idle connections since
        version 19.
      </p>
      <p>
        One trap: if a shell script is the container&apos;s first process, SIGTERM may never reach
        your app, and Kubernetes kills it after 30 seconds.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Correlation ---------------------------------------------------------------------------------- */

export function Correlation() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Following one request across services"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {
              "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n             ver  trace id (same for the whole request)   span id         flags"
            }
          </pre>
          <div className="grid gap-1 text-xs">
            {[
              [
                "W3C Trace Context",
                "A standard header (a W3C Recommendation since 2021) that carries the request's trace ID between services.",
              ],
              [
                "OpenTelemetry",
                "Logs, metrics and traces with shared IDs; the logging spec is stable, though language SDKs are at different stages.",
              ],
              [
                "Keep your logger",
                "Use your usual logging library and a bridge that adds the trace ID to each line.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        When one customer request passes through several services, a shared ID lets you pull every
        related log line and trace together. Never log secrets or full personal data while
        you&apos;re at it.
      </p>
      <p>The Observability track goes much deeper into logs, metrics and traces.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function OpsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Liveness or readiness?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backend-logs-health"
            prompt="Which probe should each check belong to?"
            categories={[
              { id: "live", label: "Liveness" },
              { id: "ready", label: "Readiness" },
            ]}
            items={[
              {
                id: "alive",
                label: "The process responds at all",
                category: "live",
                why: "If not, restarting may help.",
              },
              {
                id: "stuck",
                label: "The worker loop isn't deadlocked",
                category: "live",
                why: "A wedged process needs a restart.",
              },
              {
                id: "db",
                label: "The database is reachable",
                category: "ready",
                why: "Restarting won't fix the database; just pause traffic.",
              },
              {
                id: "warm",
                label: "Configuration and caches have finished loading",
                category: "ready",
                why: "Not ready yet, but not broken.",
              },
              {
                id: "drain",
                label: "The pod is shutting down and draining",
                category: "ready",
                why: "Stop sending new requests.",
              },
            ]}
            explanation="Liveness answers “should I be restarted?” and checks only the process itself. Readiness answers “should I get traffic right now?” and can depend on outside things."
          />
        </div>
      }
    >
      <p>Sort each check.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Structured logs", "JSON with a request ID."],
        ["Trace context", "Follow requests across services."],
        ["Liveness ≠ readiness", "Restart vs pause traffic."],
        ["Graceful shutdown", "Drain within the grace period."],
        ["Receive the signal", "Exec-form start commands."],
      ]}
    >
      <p>Next: packaging and deploying a service.</p>
    </WrapStep>
  );
}
