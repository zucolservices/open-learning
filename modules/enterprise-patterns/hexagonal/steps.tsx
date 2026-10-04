"use client";

import { motion } from "motion/react";
import { Plug } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ADAPTERS, CORE_HEX, CORE_LAYERED, consequences, type Arch, type Port } from "./model";
import type { HexState } from "./state";

/* 1 ─ The travel adapter -------------------------------------------------------------------------- */

export function TravelAdapter() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The travel adapter"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="border-accent bg-accent-soft rounded-xl border px-6 py-4 text-center">
            <p className="text-sm font-semibold">Your laptop</p>
            <p className="text-muted text-xs">one charging port, never changes</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["India socket", "UK socket", "US socket", "Car charger"].map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="border-line bg-surface flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs"
              >
                <Plug className="text-viz-compute size-4" /> {s}
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-xs">Swap the adapter, not the laptop.</p>
        </div>
      }
    >
      <p>
        Travelling abroad, nobody buys a new laptop for each country. The laptop has one port; a
        cheap adapter connects it to whatever socket is on the wall.
      </p>
      <p>
        In 2005 Alistair Cockburn proposed the same for software, calling it{" "}
        <Term id="hexagonal-architecture">Ports and Adapters</Term>, also known as hexagonal
        architecture. Its intent: &ldquo;Allow an application to equally be driven by users,
        programs, automated test or batch scripts, and to be developed and tested in isolation from
        its eventual run-time devices and databases.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Swap the edges, keep the core ⭐ ------------------------------------------------------------ */

export function SwapEdges() {
  const [s, set] = useSceneState<HexState>();
  const picks = s.picks ?? { input: 0, store: 0, notify: 0 };
  const changed = (Object.keys(picks) as Port[]).filter((p) => picks[p] !== 0);
  const c = consequences(s.arch, changed);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Swap the edges, keep the core"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Arch>
            size="sm"
            value={s.arch}
            onChange={(arch) => set({ arch })}
            options={[
              ["layered", "Business logic calls the database"],
              ["hex", "Ports and adapters"],
            ]}
          />
          <div className="flex flex-col gap-1.5">
            {(Object.keys(ADAPTERS) as Port[]).map((p) => (
              <div key={p} className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted w-full text-[11px] sm:w-40">{ADAPTERS[p].name}</span>
                {ADAPTERS[p].options.map((o, i) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={picks[p] === i}
                    onClick={() => set({ picks: { ...picks, [p]: i } })}
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[11px]",
                      picks[p] === i
                        ? "border-viz-compute bg-viz-compute/20"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Code>{s.arch === "hex" ? CORE_HEX : CORE_LAYERED}</Code>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                c.coreEdits ? "border-bad/50 bg-bad/10" : "border-good/50 bg-good/10",
              )}
            >
              <p className="text-muted text-[10px]">business rule changes needed</p>
              <p className="font-mono text-lg font-semibold">{c.coreEdits}</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                c.testable ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              <p className="text-muted text-[10px]">test the rule without a database?</p>
              <p className="text-sm font-semibold">{c.testable ? "Yes, with fakes" : "No"}</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">Illustrative code, simplified.</p>
        </div>
      }
    >
      <p>
        An insurer&apos;s rule: approve a claim automatically if the policy is active and the amount
        is under ₹50,000. Swap the database, the notification channel and the way claims arrive, and
        count how often the business rule itself has to change.
      </p>
      <p>
        With ports and adapters, the core declares what it needs as interfaces, the{" "}
        <Term id="port">ports</Term> (a PolicyStore, a Notifier). Each{" "}
        <Term id="adapter">adapter</Term> implements one for a particular technology. As Cockburn
        put it, a &ldquo;technology-specific adapter converts it into a usable procedure call or
        message and passes it to the application.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three names, one rule ----------------------------------------------------------------------- */

const STYLES: [string, string, string][] = [
  [
    "Layered",
    "described by Fowler, 2002",
    "Presentation, domain logic, data access. Common and simple, but the domain often ends up depending on the data layer.",
  ],
  [
    "Ports and Adapters",
    "2005, Cockburn",
    "The application in the middle; ports on its edge; adapters outside. The hexagon is just room to draw ports.",
  ],
  [
    "Onion",
    "2008, Palermo",
    "“All coupling is toward the center.” The domain model at the core, infrastructure at the edges.",
  ],
  [
    "Clean Architecture",
    "2012, Martin",
    "“Source code dependencies can only point inwards.” Outer circles are mechanisms, inner circles are policies.",
  ],
];

export function OneRule() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three names, one rule"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 250 125" className="mx-auto w-full max-w-sm" aria-hidden>
            {[
              [56, "fill-viz-compute/10 stroke-viz-compute", "adapters: web, DB, SMS"],
              [38, "fill-viz-data/10 stroke-viz-data", "use cases"],
              [20, "fill-accent/25 stroke-accent", "domain"],
            ].map(([r, cls, l], i) => (
              <g key={i}>
                <circle
                  cx={110}
                  cy={60}
                  r={r as number}
                  className={cls as string}
                  strokeWidth={1.2}
                />
                <text
                  x={110}
                  y={60 - (r as number) + 10}
                  textAnchor="middle"
                  className="fill-fg text-[7px]"
                >
                  {l as string}
                </text>
              </g>
            ))}
            <path
              d="M178 60 L150 60"
              className="stroke-fg"
              strokeWidth={1.2}
              markerEnd="url(#arr)"
            />
            <defs>
              <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 z" className="fill-fg" />
              </marker>
            </defs>
            <text x={180} y={56} className="fill-muted text-[7px]">
              dependencies
            </text>
            <text x={180} y={66} className="fill-muted text-[7px]">
              point inwards
            </text>
          </svg>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {STYLES.map(([t, who, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-sm font-semibold">
                  {t} <span className="text-accent text-[11px] font-normal">{who}</span>
                </p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Martin Fowler describes the most common structure as &ldquo;three broad layers: presentation
        (UI), domain logic (aka business logic), and data access&rdquo;. Hexagonal, onion and clean
        architecture refine it with one change: the domain stops depending on the database.
      </p>
      <p>
        Robert C. Martin&apos;s <Term id="dependency-rule">Dependency Rule</Term> sums all three up.
        How many circles you draw doesn&apos;t matter; he calls them schematic. The direction does.
      </p>
    </StepLayout>
  );
}

/* 4 ─ In practice --------------------------------------------------------------------------------- */

export function InPractice() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="In practice"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`claims/
  domain/            # Claim, Policy, rules. Imports nothing below.
  application/       # ApproveClaim use case; defines PolicyStore, Notifier
  adapters/
    web/             # HTTP controller → ApproveClaim
    postgres/        # PostgresPolicyStore implements PolicyStore
    mainframe/       # MainframePolicyStore implements PolicyStore
    sms/             # SmsNotifier implements Notifier
  tests/             # In-memory PolicyStore, spy Notifier`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-good/40 bg-good/5 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Worth it when</p>
              <p className="text-muted">
                The rules are valuable and long-lived, and the technology around them will change:
                the core domain from module 4.
              </p>
            </div>
            <div className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Overkill when</p>
              <p className="text-muted">
                It&apos;s a small form-over-database app with no real rules. Interfaces nobody swaps
                are just extra files.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A typical layout: the domain in the middle, the use case defining the interfaces it needs,
        and one folder of adapters per technology. Tests plug in in-memory adapters and run the
        rules in milliseconds.
      </p>
      <p>
        An adapter that talks to a legacy system is also the natural home for translation: the
        anticorruption layer from module 5 is an adapter with a translating job.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Core or adapter? ---------------------------------------------------------------------------- */

export function CoreOrAdapter() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Core or adapter?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="core-or-adapter"
            prompt="Does each piece belong in the core or in an adapter?"
            categories={[
              { id: "core", label: "Core" },
              { id: "adapter", label: "Adapter" },
            ]}
            items={[
              {
                id: "rule",
                label: "Rule: claims over ₹50,000 need an assessor",
                category: "core",
                why: "A business rule.",
              },
              {
                id: "entity",
                label: "Claim, with an approve() method",
                category: "core",
                why: "Domain model.",
              },
              {
                id: "port",
                label: "The PolicyStore interface",
                category: "core",
                why: "Ports belong to the core: it says what it needs.",
              },
              {
                id: "pg",
                label: "PostgresPolicyStore, with SQL queries",
                category: "adapter",
                why: "Technology-specific.",
              },
              {
                id: "rest",
                label: "The REST controller for POST /claims",
                category: "adapter",
                why: "A driving adapter.",
              },
              {
                id: "sms",
                label: "The SMS gateway client",
                category: "adapter",
                why: "A driven adapter.",
              },
            ]}
            explanation="Rules, entities and the interfaces they need are the core; anything that names a technology is an adapter."
          />
        </div>
      }
    >
      <p>Sort the pieces of the claims service.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Core in the middle", "Business rules depend on nothing technical."],
  ["Ports and adapters", "The core defines interfaces; adapters implement them."],
  ["Dependencies point inwards", "Hexagonal, onion and clean all say this."],
  ["Swap and test", "Change technologies, run rules with fakes."],
  ["Use where it pays", "Core domains yes, simple CRUD no."],
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
        That&apos;s the inside of one application. Next: how big should each deployable piece be?
        One monolith, a modular monolith, or many microservices?
      </p>
    </StepLayout>
  );
}
