"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIELDS, calls, query, type Field } from "./model";
import type { GqlState } from "./state";

/* 1 ─ Pick your own plate ------------------------------------------------------------------------- */

export function Thali() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Pick your own plate"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="font-semibold">Fixed thalis (REST)</p>
            <p className="text-muted mt-1 text-sm">
              Each counter serves a set plate. Want dal from one and rice from another? Visit both,
              and take everything else on each plate too.
            </p>
          </div>
          <div className="border-accent/50 bg-accent-soft rounded-xl border px-4 py-3">
            <p className="font-semibold">Build your own plate (GraphQL)</p>
            <p className="text-muted mt-1 text-sm">
              One counter, one order slip: tick exactly what you want from anywhere on the menu.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Fixed plates are simple and quick to serve, but you often get too much (over-fetching) or
        need several trips (under-fetching). A build-your-own counter gives you exactly what you
        want in one trip, and moves the hard work to the kitchen.
      </p>
      <p>
        <Term id="graphql">GraphQL</Term> is &ldquo;a query language for your API, and a server-side
        runtime for executing queries using a type system you define for your data.&rdquo; The
        client sends one query naming the fields it wants; the server&apos;s{" "}
        <Term id="resolver">resolvers</Term> fetch each piece.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One query, many calls ⭐ -------------------------------------------------------------------- */

export function BuildQuery() {
  const [s, set] = useSceneState<GqlState>();
  const f = s.fields ?? [];
  const toggle = (x: Field) => {
    if (f.includes(x)) {
      const drop = new Set<Field>([x]);
      let grew = true;
      while (grew) {
        grew = false;
        for (const q of FIELDS) {
          if (q.needs && drop.has(q.needs) && !drop.has(q.id)) {
            drop.add(q.id);
            grew = true;
          }
        }
      }
      set({ fields: f.filter((y) => !drop.has(y)) });
    } else set({ fields: [...f, x] });
  };
  const c = calls(f, s.n, s.m, s.loader);
  const heavy = c.db > 50;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One query, many calls"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {FIELDS.map((q) => {
              const on = f.includes(q.id);
              const blocked = q.needs && !f.includes(q.needs);
              return (
                <button
                  key={q.id}
                  type="button"
                  aria-pressed={on}
                  disabled={!!blocked}
                  onClick={() => toggle(q.id)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[11px] disabled:opacity-40",
                    on ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  )}
                >
                  {on && <Check className="size-3" />}
                  {q.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            {(
              [
                ["dishes", "n", [5, 10, 50]],
                ["reviews per dish", "m", [5, 20, 100]],
              ] as [string, "n" | "m", number[]][]
            ).map(([l, k, opts]) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="text-muted">{l}:</span>
                {opts.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set({ [k]: v })}
                    className={cn(
                      "rounded border px-1.5 py-0.5 font-mono",
                      s[k] === v ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_12rem]">
            <Code>{query(f, s.n, s.m)}</Code>
            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "rounded-lg border px-3 py-2",
                  heavy ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[10px]">Database queries</p>
                <motion.p
                  key={c.db}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  className="font-mono text-2xl font-semibold"
                >
                  {c.db.toLocaleString("en-IN")}
                </motion.p>
              </div>
              <div className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-muted text-[10px]">Objects returned</p>
                <p className="font-mono text-lg font-semibold">{c.nodes.toLocaleString("en-IN")}</p>
              </div>
              <button
                type="button"
                aria-pressed={s.loader}
                onClick={() => set({ loader: !s.loader })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  s.loader ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {s.loader ? "✓ Batching with DataLoader" : "Turn on DataLoader batching"}
              </button>
            </div>
          </div>
          <p className="text-muted text-xs">
            {s.loader
              ? `One batched query per level: ${c.batched} instead of ${c.naive.toLocaleString("en-IN")}.`
              : c.naive > c.batched
                ? `Each dish fetches its own reviews, and each review its own author: the N+1 problem.`
                : "So far, one query per level."}
          </p>
          <p className="text-subtle text-[10px]">Illustrative resolver counts.</p>
        </div>
      }
    >
      <p>
        Build a query for a restaurant screen. Add nested fields and raise the limits, and watch the
        database queries behind it.
      </p>
      <p>
        A resolver per field is simple to write, but nested lists multiply: 50 dishes with 100
        reviews each, each with an author, is thousands of lookups. graphql.org calls this the
        &ldquo;N+1 problem&rdquo;. DataLoader fixes it by batching: it collects every author ID
        requested in one pass and fetches them in a single query.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Protecting the kitchen ---------------------------------------------------------------------- */

const GUARDS: [string, string][] = [
  [
    "Depth and amount limits",
    "Refuse queries nested too deeply or asking for too many items at once.",
  ],
  [
    "Cost analysis",
    "Score each query before running it. GitHub allows 5,000 points an hour per user and at most 500,000 nodes per call; Shopify caps a single query at 1,000 points.",
  ],
  ["Required page sizes", "GitHub requires first or last, between 1 and 100, on every list."],
  ["Timeouts and rate limits", "So no single client can tie up the server."],
  [
    "Trusted documents",
    "“An allowlist of operations”: your own apps send the ID of a pre-approved query instead of free text.",
  ],
];

export function Protect() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Protecting the kitchen"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {GUARDS.map(([t, d], i) => (
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
        With REST, the server decides how much work each endpoint does. With GraphQL, the client
        does, so the server must check every query before running it.
      </p>
      <p>
        OWASP&apos;s GraphQL cheat sheet lists these defences and adds: &ldquo;Disable introspection
        queries system-wide in any production or publicly accessible environments.&rdquo;
        graphql.org cautions that hiding the schema alone is &ldquo;security through
        obscurity&rdquo;; the limits above do the real work.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Errors and evolution ------------------------------------------------------------------------ */

export function ErrorsEvolve() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Errors and evolution"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`{
  "data": {
    "restaurant": { "name": "Saravana", "rating": null }
  },
  "errors": [
    { "message": "Ratings service timed out",
      "path": ["restaurant", "rating"] }
  ]
}`}</Code>
          <Code>{`type Dish {
  name: String!
  price: Int @deprecated(reason: "Use price_paise.")
  price_paise: Int
}`}</Code>
        </div>
      }
    >
      <p>
        A GraphQL response can hold partial data <em>and</em> an <code>errors</code> list saying
        which parts failed. Classic servers send HTTP 200 either way, so clients must read the body.
        A newer GraphQL-over-HTTP specification, still a draft, uses real 4xx and 5xx codes when no
        data could be produced.
      </p>
      <p>
        GraphQL APIs often avoid versions. graphql.org: &ldquo;GraphQL takes a strong opinion on
        avoiding versioning by providing the tools for the continuous evolution of a GraphQL
        schema.&rdquo; Add fields freely, mark old ones <code>@deprecated</code>, and remove them
        once nobody asks for them, which the server can see, field by field.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The enormous query -------------------------------------------------------------------------- */

export function BigQuery() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The enormous query"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="big-query"
            prompt="A client sends a query for 100 restaurants × 100 dishes × 100 reviews, each with its author. What should a public GraphQL API do?"
            options={[
              {
                id: "run",
                label: "Run it; the client asked for it",
                feedback:
                  "A million objects and possibly millions of lookups: one client can slow everyone down.",
              },
              {
                id: "timeout",
                label: "Run it and let the timeout stop it",
                feedback: "The server has already done most of the expensive work by then.",
              },
              {
                id: "reject",
                label: "Calculate its cost first and reject it with an error explaining the limit",
                correct: true,
                feedback:
                  "Cheap to check, nothing wasted, and the client learns how to ask for less.",
              },
              {
                id: "rename",
                label: "Hide the schema so nobody can write such a query",
                feedback: "Security through obscurity: anyone can still guess field names.",
              },
            ]}
            explanation="Analyse cost before executing; reject queries over the limit with a clear message."
          />
        </div>
      }
    >
      <p>Flexibility for clients means limits for servers.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Ask for exactly what you need", "One query, one round trip."],
  ["Resolvers multiply", "Batch with DataLoader to avoid N+1."],
  ["Limit and price queries", "Depth, amount, cost, timeouts."],
  ["Partial data plus errors", "Read the body, not just the status."],
  ["Evolve, don't version", "Add fields; deprecate old ones."],
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
      <p>Next: instead of clients asking, the API calls them, with webhooks.</p>
    </StepLayout>
  );
}
