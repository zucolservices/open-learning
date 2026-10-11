"use client";

import { motion } from "motion/react";
import { Check, CircleAlert, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BACKENDS, TESTS, totalMs, type Backend } from "./model";
import type { IntegrationState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Plug() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Every part passed, the kettle didn't"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Heating element", "passed its bench test", true],
            ["Switch", "passed its bench test", true],
            ["Plug", "passed its bench test", true],
            ["Assembled kettle", "plug is the wrong shape for this country's sockets", false],
          ].map(([t, b, ok], i) => (
            <motion.div
              key={t as string}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                ok ? "border-line bg-surface" : "border-bad/50 bg-bad/10",
              )}
            >
              {ok ? <Check className="text-good size-3.5" /> : <X className="text-bad size-3.5" />}
              <span className="font-semibold">{t as string}</span>
              <span className="text-muted">· {b as string}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A factory tests every kettle part on its own, and every part passes. Then someone plugs in
        the finished kettle and the plug doesn&apos;t fit the socket. No single part was broken; the
        problem lived in the join.
      </p>
      <p>
        <Term id="integration-test">Integration tests</Term> check those joins: your code against a
        real database, queue or file system. They catch what unit tests with stand-ins can&apos;t,
        because a stand-in only knows what its author assumed.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three backends ⭐ ----------------------------------------------------------------------------- */

const ICON = {
  pass: <Check className="text-good size-3.5 shrink-0" />,
  bug: <X className="text-bad size-3.5 shrink-0" />,
  "false-alarm": <CircleAlert className="text-accent size-3.5 shrink-0" />,
};
const LABEL = { pass: "pass", bug: "fails: real bug", "false-alarm": "fails: false alarm" };

export function ThreeBackends() {
  const [s, set] = useSceneState<IntegrationState>();
  const pick = (b: Backend) =>
    set({ backend: b, tried: s.tried.includes(b) ? s.tried : [...s.tried, b] });
  const b = s.backend;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Run the same tests against three databases"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-3">
            {BACKENDS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={b === x.id}
                onClick={() => pick(x.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  b === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="font-semibold">{x.label}</p>
                <p className="text-muted text-[10px]">{x.detail}</p>
              </button>
            ))}
          </div>
          {b ? (
            <motion.div
              key={b}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-1.5"
            >
              {TESTS.map((t) => {
                const r = t.results[b];
                return (
                  <div
                    key={t.id}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs",
                      r === "bug"
                        ? "border-bad/40 bg-bad/10"
                        : r === "false-alarm"
                          ? "border-line-strong bg-surface-2"
                          : "border-line bg-surface",
                    )}
                  >
                    <p className="flex items-center gap-1.5">
                      {ICON[r]}
                      <span className="flex-1">{t.name}</span>
                      <span className="text-muted text-[10px]">{LABEL[r]}</span>
                    </p>
                    {t.why[b] && <p className="text-muted pl-5 text-[10px]">{t.why[b]}</p>}
                  </div>
                );
              })}
              <p className="text-muted text-[11px]">
                Suite time: about{" "}
                {totalMs(b) < 1000 ? `${totalMs(b)} ms` : `${(totalMs(b) / 1000).toFixed(1)} s`}{" "}
                (illustrative)
              </p>
            </motion.div>
          ) : (
            <p className="text-muted text-xs">Pick a database to run the suite.</p>
          )}
          {s.tried.length === 3 && (
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-[11px]">
              <p className="font-semibold">What production actually does</p>
              {TESTS.map((t) => (
                <p key={t.id} className="text-muted">
                  · {t.name}: {t.truth}
                </p>
              ))}
            </div>
          )}
        </div>
      }
    >
      <p>
        A made-up café&apos;s order code runs on PostgreSQL in production. Its four tests can run
        against a hand-written fake, an in-memory imitation of PostgreSQL, or the real thing in a
        throwaway <Term id="container">container</Term>.
      </p>
      <p>
        Try all three. The fake is fastest and finds nothing. The imitation finds some bugs but also
        fails a correct query. Only the real database tells the whole truth, for a few seconds of
        start-up.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Fast and isolated ---------------------------------------------------------------------------- */

export function FastIsolated() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keeping integration tests fast and independent"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Start once, reuse",
              "Start the database container once for the whole suite, not per test.",
            ],
            ["Run the real migrations", "Build the schema the same way production does."],
            [
              "Clean up after each test",
              "Wrap each test in a transaction and roll it back, or empty the tables.",
            ],
            [
              "Use unique data",
              "Each test creates its own customer and order, so tests can run in parallel.",
            ],
            [
              "Keep them few and focused",
              "Test the queries and the edges with real infrastructure; leave pure logic to unit tests.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
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
        Integration tests have a reputation for being slow and flaky. Mostly that comes from shared,
        long-lived test databases that every test and every developer writes to.
      </p>
      <p>
        A fresh, throwaway database per run, cleaned between tests, removes most of that. It takes
        seconds, not minutes.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools for throwaway infrastructure"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Testcontainers",
              "Starts real databases, queues and services in containers from your test code. Java, Go, .NET, Node.js, Python, Rust and more. Owned by Docker since December 2023.",
            ],
            [
              "Docker Compose",
              "Describe the services once; start them before the suite and stop them after.",
            ],
            [
              "In-memory imitations",
              "H2, or SQLite standing in for another database: fast, but not the same engine. Missing features and different behaviour cause false passes and false alarms.",
            ],
            [
              "Cloud service emulators",
              "Local stand-ins for cloud APIs. LocalStack's free Community edition ended in March 2026; it now needs an account. moto is an open-source option for AWS APIs.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
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
        The idea is the same everywhere: the test starts real infrastructure, uses it, and throws it
        away. Containers made that cheap enough to do on every run, on a laptop or in CI.
      </p>
      <p>
        Where you can, test against the same engine and version as production. &ldquo;Nearly the
        same&rdquo; databases are where the surprises live.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function IntegrationCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which test would catch it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-integration"
            prompt="Which kind of test is the cheapest one that would catch each bug?"
            categories={[
              { id: "unit", label: "Unit test" },
              { id: "integration", label: "Integration test" },
            ]}
            items={[
              {
                id: "gst",
                label: "GST rounded the wrong way",
                category: "unit",
                why: "Pure logic.",
              },
              {
                id: "column",
                label: "A query uses a column a migration renamed",
                category: "integration",
                why: "Only the real schema knows.",
              },
              {
                id: "unique",
                label: "A duplicate email crashes sign-up",
                category: "integration",
                why: "The real constraint has to fire.",
              },
              {
                id: "sort",
                label: "A list is sorted oldest-first instead of newest-first in code",
                category: "unit",
                why: "In-memory sorting logic.",
              },
              {
                id: "queue",
                label: "Messages sent to the queue are in the wrong format for it",
                category: "integration",
                why: "Needs the real queue to reject them.",
              },
            ]}
            explanation="If the bug lives in your logic, a unit test catches it. If it lives in the meeting point with real infrastructure, you need an integration test."
          />
        </div>
      }
    >
      <p>Sort each bug.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Bugs live in the joins", "Schemas, constraints, query syntax, formats."],
        ["Stand-ins only know assumptions", "A fake can't catch what its author didn't imagine."],
        ["Use the real engine", "Same database and version as production."],
        ["Throwaway, not shared", "Fresh containers, cleaned between tests."],
        ["Few and focused", "Logic in unit tests, joins in integration tests."],
      ]}
    >
      <p>Next: when the other side of the join belongs to another team, contract tests help.</p>
    </WrapStep>
  );
}
