"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ATTRS, REQUESTS, errorRate, groupBy, type Attr } from "./model";
import type { WhyObsState } from "./state";

/* 2 ─ Ask a new question ⭐ ------------------------------------------------------------------------ */

export function AskNew() {
  const [s, set] = useSceneState<WhyObsState>();
  const rich = s.captured === "rich";
  const rows = s.drill ? REQUESTS.filter((r) => r.bank === s.drill) : REQUESTS;
  const groups = groupBy(rows, s.attr);
  const overall = errorRate(REQUESTS);
  const max = Math.max(...groups.map((g) => g.rate), 0.05);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Ask a new question"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col items-start gap-1 text-xs sm:flex-row sm:items-center sm:gap-2">
            <span className="text-muted">Telemetry collected:</span>
            <Segmented<"totals" | "rich">
              size="sm"
              value={s.captured}
              onChange={(captured) => set({ captured, drill: "" })}
              options={[
                ["totals", "Totals only"],
                ["rich", "Each request, with details"],
              ]}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">
              Checkout error rate, last hour (2,000 requests)
            </p>
            <p className="font-mono text-2xl font-semibold">{(overall * 100).toFixed(1)}%</p>
          </div>
          {rich ? (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted text-xs">Break down by</span>
                {(Object.keys(ATTRS) as Attr[]).map((a) => (
                  <button
                    key={a}
                    type="button"
                    disabled={s.drill !== "" && a === "bank"}
                    onClick={() => set({ attr: a })}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs disabled:opacity-35",
                      s.attr === a
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {ATTRS[a].name}
                  </button>
                ))}
              </div>
              {s.drill && (
                <p className="text-xs">
                  Only <span className="font-semibold">{s.drill}</span>{" "}
                  <button
                    type="button"
                    onClick={() => set({ drill: "", attr: "bank" })}
                    className="text-accent underline"
                  >
                    clear
                  </button>
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                {groups.map((g) => {
                  const hot = g.rate > 0.1;
                  return (
                    <button
                      key={g.value}
                      type="button"
                      disabled={s.attr !== "bank" || !!s.drill}
                      onClick={() => set({ drill: g.value, attr: "app" })}
                      className="grid grid-cols-[5.5rem_1fr_4rem] items-center gap-2 text-left text-xs disabled:cursor-default"
                    >
                      <span>{g.value}</span>
                      <span className="bg-surface-2 h-4 overflow-hidden rounded">
                        <motion.span
                          animate={{ width: `${(g.rate / max) * 100}%` }}
                          className={cn(
                            "block h-full rounded",
                            hot ? "bg-bad/70" : "bg-viz-data/40",
                          )}
                        />
                      </span>
                      <span className={cn("text-right font-mono", hot && "text-bad")}>
                        {(g.rate * 100).toFixed(1)}%
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-muted text-[10px]">
                {s.attr === "bank" && !s.drill
                  ? "Click a bank's row to look inside it."
                  : "Each bar is the error rate for that group."}
              </p>
            </>
          ) : (
            <div className="border-line bg-surface-2/50 rounded-xl border border-dashed px-4 py-6 text-center">
              <p className="text-sm">Something is failing for some customers.</p>
              <p className="text-muted mt-1 text-xs">
                With only totals, that&apos;s all the data can say. Which customers, banks or
                versions? Nobody recorded it.
              </p>
            </div>
          )}
          <p className="text-muted text-[10px]">Illustrative data: one night of 2,000 checkouts.</p>
        </div>
      }
    >
      <p>
        An alert says 7% of checkouts are failing. With totals only, you know <em>that</em>, not{" "}
        <em>why</em>.
      </p>
      <p>
        Switch to collecting each request with its details: bank, app version, region, device. Then
        break the errors down, one attribute at a time, and follow the hot spot. You&apos;re asking
        questions nobody wrote a dashboard for.
      </p>
      <p>
        That&apos;s the heart of <Term id="observability">observability</Term>. OpenTelemetry&apos;s
        primer puts it this way: it &ldquo;lets you understand a system from the outside by letting
        you ask questions about that system without knowing its inner workings.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Monitoring and observability ---------------------------------------------------------------- */

export function TwoIdeas() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Monitoring and observability"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-4">
            <p className="font-semibold">Monitoring</p>
            <p className="text-muted text-sm">
              &ldquo;Collecting, processing, aggregating, and displaying real-time quantitative data
              about a system, such as query counts and types, error counts and types, processing
              times, and server lifetimes.&rdquo;
            </p>
            <p className="text-muted text-xs">— Google, Site Reliability Engineering</p>
            <p className="mt-auto font-mono text-xs">answers: is the thing I expected happening?</p>
          </div>
          <div className="border-accent/50 bg-accent-soft flex flex-col gap-2 rounded-xl border px-4 py-4">
            <p className="font-semibold">Observability</p>
            <p className="text-muted text-sm">
              &ldquo;It allows you to easily troubleshoot and handle novel problems, that is,
              &lsquo;unknown unknowns&rsquo;. It also helps you answer the question &lsquo;Why is
              this happening?&rsquo;&rdquo;
            </p>
            <p className="text-muted text-xs">— OpenTelemetry, Observability primer</p>
            <p className="mt-auto font-mono text-xs">
              answers: what&apos;s going on that I didn&apos;t expect?
            </p>
          </div>
        </div>
      }
    >
      <p>
        They aren&apos;t rivals. Monitoring is still how you get woken up: a check on something you
        know matters. Observability is what you need once you&apos;re awake and the cause is
        something new.
      </p>
      <p>
        Both depend on the same raw material: telemetry, the data a running system sends out about
        itself. The next module looks at its three main kinds.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Predicted or new? ---------------------------------------------------------------------------- */

export function PredictedOrNew() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Predicted or new?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="predicted-or-new"
            prompt="Is each a question you'd set up monitoring for in advance, or one you'd only think of during an investigation?"
            categories={[
              { id: "mon", label: "Predicted (monitoring)" },
              { id: "obs", label: "New (observability)" },
            ]}
            items={[
              {
                id: "cpu",
                label: "Is any server's CPU above 90%?",
                category: "mon",
                why: "A classic known condition: a fixed check and an alert.",
              },
              {
                id: "err",
                label: "Is the checkout error rate above 1%?",
                category: "mon",
                why: "Known in advance to matter, so it gets an alert.",
              },
              {
                id: "disk",
                label: "Is the database disk nearly full?",
                category: "mon",
                why: "A predictable failure with a simple threshold.",
              },
              {
                id: "bank",
                label: "Why are only one bank's customers failing since 2 a.m.?",
                category: "obs",
                why: "Nobody built a dashboard for that bank; you need to slice requests by it on the spot.",
              },
              {
                id: "version",
                label: "Did slowness on Android start with app version 5.2?",
                category: "obs",
                why: "A new combination of attributes, asked in the moment.",
              },
              {
                id: "tail",
                label: "What do the slowest 1% of requests have in common?",
                category: "obs",
                why: "An open question you answer by exploring detailed data.",
              },
            ]}
            explanation="Predicted questions become alerts and dashboards. New questions need detailed telemetry you can slice any way you like."
          />
        </div>
      }
    >
      <p>Both kinds matter; they need different data.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Monitoring catches the predicted", "Checks and alerts on known conditions."],
  ["Observability explains the new", "Ask questions you didn't plan for."],
  ["Details make it possible", "Requests recorded with their attributes can be sliced."],
  ["CPU graphs can mislead", "Systems can be failing while servers look idle."],
  ["Telemetry is a design choice", "What you don't collect, you can't ask about."],
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
      <p>
        Roblox learned the hard way in October 2021: during its 73-hour outage, &ldquo;critical
        monitoring systems … relied on affected systems, such as Consul. This combination severely
        hampered the triage process.&rdquo; Telemetry has to keep working when everything else
        doesn&apos;t.
      </p>
      <p>Next: metrics, logs and traces, and what each one is good for.</p>
    </StepLayout>
  );
}
