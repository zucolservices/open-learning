"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MAX_CONNECTIONS, ORMS, queries } from "./model";
import type { DaState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Shopping() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One trip or twenty?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Twenty trips",
              "Drive to the shop for milk. Come home. Drive back for bread. Twenty items, twenty journeys.",
              "border-bad/40 bg-bad/10",
            ],
            [
              "One trip with a list",
              "Write everything down, go once, carry it all back.",
              "border-good/50 bg-good/10",
            ],
          ].map(([t, b, c]) => (
            <div key={t} className={cn("rounded-xl border p-3 text-xs", c)}>
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>Nobody shops one item per trip. The drive, not the shopping, is what takes time.</p>
      <p>
        Each database query is a trip: a round trip over the network, plus the database&apos;s own
        work. The most common slowdown in backends is the{" "}
        <Term id="n-plus-one">N+1 query problem</Term>: one query for a list, then one more per
        item.
      </p>
    </StepLayout>
  );
}

/* 2 ─ N+1 ⭐ --------------------------------------------------------------------------------------- */

export function NPlusOne() {
  const [s, set] = useSceneState<DaState>();
  const q = queries(s.orders, s.eager);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Load an order-history page"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Orders on the page</span>
            <Segmented<string>
              size="sm"
              value={String(s.orders)}
              onChange={(v) => set({ orders: Number(v) })}
              options={[
                ["20", "20"],
                ["100", "100"],
                ["500", "500"],
              ]}
            />
          </div>
          <Segmented<string>
            size="sm"
            value={s.eager ? "eager" : "lazy"}
            onChange={(v) => set({ eager: v === "eager" })}
            options={[
              ["lazy", "Load items for each order as needed"],
              ["eager", "Load all items in one query"],
            ]}
          />
          <div className="border-line bg-surface max-h-40 overflow-auto rounded-lg border p-2 font-mono text-[10px]">
            {q.log.slice(0, 12).map((l, i) => (
              <motion.p
                key={`${s.eager}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={cn(i > 0 && !s.eager && "text-bad")}
              >
                {l}
              </motion.p>
            ))}
            {q.log.length > 12 && <p className="text-bad">… and {q.log.length - 12} more</p>}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Queries</p>
              <p className="font-mono font-semibold">{q.log.length}</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                q.ms > 200 ? "border-bad/40 bg-bad/10" : "border-good/50 bg-good/10",
              )}
            >
              <p className="text-muted text-[10px]">Time in the database (≈3 ms per query)</p>
              <p className="font-mono font-semibold">{q.ms} ms</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        An ORM makes loading related data look free: you ask for an order&apos;s items and they
        appear. Behind the scenes, each access can be a separate query.
      </p>
      <p>
        Grow the page and compare loading items one order at a time with loading them all at once.
        Timing is illustrative.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Pool ----------------------------------------------------------------------------------------- */

export function Pool() {
  const [s, set] = useSceneState<DaState>();
  const total = s.instances * s.pool;
  const over = total > MAX_CONNECTIONS - 3;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Connection pools and the database's limit"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted w-32">App instances</span>
            <Segmented<string>
              size="sm"
              value={String(s.instances)}
              onChange={(v) => set({ instances: Number(v) })}
              options={[
                ["2", "2"],
                ["4", "4"],
                ["8", "8"],
                ["12", "12"],
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted w-32">Pool size each</span>
            <Segmented<string>
              size="sm"
              value={String(s.pool)}
              onChange={(v) => set({ pool: Number(v) })}
              options={[
                ["5", "5"],
                ["10", "10"],
                ["20", "20"],
              ]}
            />
          </div>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: Math.min(total, 240) }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-sm",
                  i >= MAX_CONNECTIONS - 3 ? "bg-bad/70" : "bg-viz-data/60",
                )}
              />
            ))}
          </div>
          <p className={cn("text-xs", over ? "text-bad" : "text-good")}>
            {total} connections wanted; PostgreSQL&apos;s default allows {MAX_CONNECTIONS} (3
            reserved for administrators).{" "}
            {over ? "New instances fail with “too many clients”." : "Within the limit."}
          </p>
        </div>
      }
    >
      <p>
        Opening a database connection is slow: a network handshake, encryption, authentication, and
        in PostgreSQL a new server process. A <Term id="connection-pool">connection pool</Term>{" "}
        keeps a few open and lends them out.
      </p>
      <p>
        More isn&apos;t better. HikariCP, Spring Boot&apos;s default pool, starts at 10. Multiply by
        every instance, and autoscaling can exceed the database&apos;s limit; external poolers such
        as PgBouncer or RDS Proxy help.
      </p>
    </StepLayout>
  );
}

/* 4 ─ ORMs and SQL --------------------------------------------------------------------------------- */

export function Orms() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="SQL, query builders and ORMs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {ORMS.map(([l, t], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="font-semibold">{l}</span>
              <span className="text-muted"> · {t}</span>
            </motion.div>
          ))}
          <div className="border-good/50 bg-good/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Always use parameters</p>
            <p className="text-muted">
              Pass values separately from the SQL text. Gluing user input into a query string is how
              SQL injection happens.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Raw SQL gives full control; query builders add safety and composition; ORMs map rows to
        objects and handle relationships. All three are fine. What matters is knowing what SQL
        actually runs.
      </p>
      <p>
        Turn on SQL logging in development. Most N+1 problems are obvious once you can see the
        queries scroll past.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DaCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Too many clients"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="backend-data-access"
            prompt="During a sale, the service autoscales from 4 to 12 instances. Soon new instances can't start: the database says “too many clients”. Why?"
            options={[
              {
                id: "slow",
                label: "The database is too slow",
                feedback: "Slowness gives timeouts, not this error.",
              },
              {
                id: "pool",
                label:
                  "Each instance opens its own pool; 12 × pool size exceeds the database's connection limit",
                correct: true,
                feedback:
                  "Right: cap per-instance pools, or put an external pooler between the app and the database.",
              },
              {
                id: "n1",
                label: "An N+1 query problem",
                feedback: "N+1 makes requests slow, but doesn't add connections.",
              },
            ]}
            explanation="Connections are a shared, limited resource. Size pools for the whole fleet, not one instance."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Each query is a trip", "Fetch related data together."],
        ["Watch for N+1", "Log your SQL in development."],
        ["Pool connections", "Small pools, sized for the fleet."],
        ["Always parameterise", "Never glue input into SQL."],
        ["Know what runs", "ORMs translate; they don't hide cost."],
      ]}
    >
      <p>Next: changing the database schema without downtime.</p>
    </WrapStep>
  );
}
