"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HOPS, RUNTIMES } from "./model";
import type { BeState } from "./state";

/* 2 ─ Where the time goes -------------------------------------------------------------------------- */

export function Budget() {
  const [s, set] = useSceneState<BeState>();
  const t = (h: (typeof HOPS)[number]) => (s.slow.includes(h.id) ? h.slow : h.normal);
  const total = HOPS.reduce((a, h) => a + t(h), 0);
  const max = HOPS.reduce((a, h) => a + h.slow, 0);
  const toggle = (id: string) =>
    set({ slow: s.slow.includes(id) ? s.slow.filter((x) => x !== id) : [...s.slow, id] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Where does the time go?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {HOPS.map((h) => {
            const can = h.slow !== h.normal;
            const on = s.slow.includes(h.id);
            return (
              <div key={h.id} className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-44 shrink-0">{h.label}</span>
                  <div className="bg-surface-2 relative h-3 flex-1 rounded">
                    <motion.div
                      animate={{ width: `${(t(h) / 2400) * 100}%` }}
                      className={cn("absolute h-3 rounded", on ? "bg-bad/70" : "bg-viz-data/70")}
                    />
                  </div>
                  <span className="w-14 text-right font-mono">{t(h)} ms</span>
                </div>
                {can && (
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(h.id)}
                    className={cn(
                      "mt-0.5 ml-0 rounded-full border px-2 py-0.5 text-[10px] sm:ml-[11.5rem]",
                      on ? "border-bad bg-bad/10" : "border-line text-muted",
                    )}
                  >
                    {on ? `Slow: ${h.slowWhat}` : `Make it slow`}
                  </button>
                )}
              </div>
            );
          })}
          <div className="border-line bg-surface-2 mt-1 flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs">
            <span>Total time for the order</span>
            <span
              className={cn("font-mono font-semibold", total > 1000 ? "text-bad" : "text-good")}
            >
              {(total / 1000).toFixed(2)} s
            </span>
          </div>
          <p className="text-muted text-[11px]">
            {total > 1000
              ? "The slow parts are usually your queries and the services you call, not the network plumbing."
              : `Everything healthy. Worst case if all go wrong: ${(max / 1000).toFixed(1)} s.`}
          </p>
        </div>
      }
    >
      <p>
        Every hop costs time. Make different parts slow and see which ones hurt the most. Times are
        illustrative.
      </p>
      <p>
        Most of a backend&apos;s performance work happens in the parts it controls: database access,
        calls to other services, and the code in between.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Responsibilities ----------------------------------------------------------------------------- */

export function Jobs() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What a backend is responsible for"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {[
            ["Rules", "Prices, stock, who can do what. The app can't be trusted to enforce them."],
            ["Data", "Storing it safely, keeping it consistent, backing it up."],
            ["Security", "Checking identity and permissions on every request."],
            ["Connections", "Payments, email, partners and other internal services."],
            ["Reliability", "Staying up when traffic spikes or a dependency fails."],
            ["Speed", "Answering fast enough that nobody notices."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The frontend shows things; the <Term id="backend">backend</Term> is where decisions are made
        and remembered. Anything a phone or browser does can be faked by someone determined, so
        every rule that matters is enforced on the server.
      </p>
      <p>This track covers each of these jobs in turn, from structure to production.</p>
    </StepLayout>
  );
}

/* 4 ─ Where code runs ------------------------------------------------------------------------------ */

export function Runtimes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where backend code runs, and in what"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-4">
            {["Virtual machines", "Containers", "Serverless functions", "Edge locations"].map(
              (t) => (
                <div
                  key={t}
                  className="border-line bg-surface-2 rounded-lg border px-2 py-1.5 text-center"
                >
                  {t}
                </div>
              ),
            )}
          </div>
          {RUNTIMES.map(([l, v], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="font-semibold">{l}</span>
              <span className="text-muted"> · {v}</span>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">Current versions, October 2026.</p>
        </div>
      }
    >
      <p>
        Backends are written in many languages, and the ideas in this track apply to all of them.
        Examples will show several side by side.
      </p>
      <p>
        Where the code runs matters for cost and behaviour: an always-on server, a container
        platform, or functions that start on demand. The last module of the production chapter
        compares them.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function LifeCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Trace the request"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="backend-lifecycle"
            prompt="Put the steps of a request in order, first to last."
            items={[
              { id: "dns", label: "Look up the server's address (DNS)" },
              { id: "tls", label: "Open a secure connection (TLS)" },
              { id: "lb", label: "The load balancer picks a server" },
              { id: "app", label: "Application code checks and applies the rules" },
              { id: "db", label: "The database stores the change" },
              { id: "resp", label: "A response goes back to the client" },
            ]}
            explanation="Find the server, connect securely, route to a healthy copy, run your code, persist, reply. Each hop is a place things can slow down or fail."
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
        ["Servers make the decisions", "Rules, data, security."],
        ["Many hops", "DNS, TLS, load balancer, code, database."],
        ["Time hides in your parts", "Queries and outside calls."],
        ["Never trust the client", "Enforce rules on the server."],
        ["Same ideas, any language", "Node, Python, Java, Go, .NET, Ruby, PHP."],
      ]}
    >
      <p>Next: HTTP from the server&apos;s side.</p>
    </WrapStep>
  );
}
