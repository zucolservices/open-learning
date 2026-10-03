"use client";

import { motion } from "motion/react";
import { Check, FileCode2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PIECES, client, docs, mock, yaml, type Piece } from "./model";
import type { OasState } from "./state";

/* 1 ─ Drawings before bricks ---------------------------------------------------------------------- */

const OUTPUTS = [
  "Documentation",
  "Mock server",
  "Client libraries",
  "Request validation",
  "Tests",
  "Gateway config",
];

export function Blueprint() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Drawings before bricks"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="border-accent/50 bg-accent-soft flex items-center gap-2 rounded-xl border px-4 py-3">
            <FileCode2 className="text-accent size-5" />
            <span className="font-mono text-sm">openapi.yaml</span>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
            {OUTPUTS.map((o, i) => (
              <motion.div
                key={o}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.2 }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-center text-xs"
              >
                {o}
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Builders, electricians and plumbers all work from the same set of drawings, agreed before
        anyone lays a brick. Change the drawing and everyone sees it.
      </p>
      <p>
        <Term id="openapi">OpenAPI</Term> is that drawing for an HTTP API. The specification
        describes itself as &ldquo;a standard, programming language-agnostic interface description
        for HTTP APIs, which allows both humans and computers to discover and understand the
        capabilities of a service without requiring access to source code&rdquo;. One file, many
        uses.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Write the contract ⭐ ----------------------------------------------------------------------- */

export function BuildSpec() {
  const [s, set] = useSceneState<OasState>();
  const on = s.on ?? [];
  const toggle = (p: Piece) => {
    if (on.includes(p)) {
      set({ on: on.filter((x) => x !== p && PIECES.find((q) => q.id === x)?.needs !== p) });
    } else set({ on: [...on, p] });
  };
  const d = docs(on);
  return (
    <StepLayout
      eyebrow="Build"
      title="Write the contract"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PIECES.map((p) => {
              const active = on.includes(p.id);
              const blocked = p.needs && !on.includes(p.needs);
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  disabled={!!blocked}
                  onClick={() => toggle(p.id)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] disabled:opacity-40",
                    active ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  )}
                >
                  {active && <Check className="size-3" />}
                  {p.label}
                </button>
              );
            })}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="max-h-80 overflow-auto">
              <Code>{yaml(on)}</Code>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <Segmented<OasState["view"]>
                  size="sm"
                  value={s.view}
                  onChange={(view) => set({ view })}
                  options={[
                    ["docs", "Docs"],
                    ["mock", "Mock"],
                    ["client", "Client"],
                  ]}
                />
              </div>
              <motion.div
                key={s.view + on.join()}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
              >
                {s.view === "docs" ? (
                  d.length ? (
                    <div className="flex flex-col gap-1.5">
                      {d.map((op) => (
                        <div
                          key={op.path + op.method}
                          className="border-line bg-surface rounded-lg border px-3 py-2"
                        >
                          <p className="font-mono text-xs">
                            <span className="text-accent font-semibold">{op.method}</span> {op.path}
                          </p>
                          {op.lines.map((l) => (
                            <p key={l} className="text-muted text-[11px]">
                              {l}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-xs">Nothing to document yet.</p>
                  )
                ) : (
                  <Code>{s.view === "mock" ? mock(on) : client(on)}</Code>
                )}
              </motion.div>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative outputs, like those from documentation tools, mock servers and client
            generators.
          </p>
        </div>
      }
    >
      <p>
        Add pieces to a small library API&apos;s OpenAPI file and watch three things appear from it:
        reference docs, a mock server&apos;s answer and a typed client.
      </p>
      <p>
        Notice what the schema adds. Without it, the docs can&apos;t say what comes back, the mock
        returns nothing useful and the client gets <code>unknown</code>. With an example, the mock
        returns realistic data that app developers can build against before the real server exists.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Design first or code first ------------------------------------------------------------------ */

export function DesignFirst() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Design first or code first"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Design first",
              "Write the OpenAPI file, review it with the people who'll call the API, then build. Mocks let the app team start on day one.",
              "border-accent/50 bg-accent-soft",
            ],
            [
              "Code first",
              "Write the code, generate the OpenAPI file from annotations. Fast for one team, but the API's shape follows the code, and reviews come late.",
              "border-line bg-surface",
            ],
          ].map(([t, d, cls]) => (
            <div key={t} className={cn("rounded-xl border px-4 py-3", cls)}>
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </div>
          ))}
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-sm sm:col-span-2">
            <p className="font-semibold">Keeping the contract honest</p>
            <p className="text-muted mt-1">
              A linter such as Spectral checks the file against your style guide. Contract tests
              check that the running server matches it. Pact takes the other direction: it builds
              contracts from the consumer&apos;s own tests, a code-first complement to a spec.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A contract written down before the code is cheap to change: renaming a field is an edit, not
        a migration. Postman&apos;s 2025 survey found 82% of organisations had adopted some level of
        API-first working, and 25% were fully API-first.
      </p>
      <p>
        Whichever you choose, the file must stay true. A description that drifts from the real API
        is worse than none.
      </p>
    </StepLayout>
  );
}

/* 4 ─ From Swagger to 3.2 ------------------------------------------------------------------------- */

const EVENTS: [string, string][] = [
  ["2010", "Swagger is created at Wordnik; open-sourced in 2011"],
  ["2015", "SmartBear donates it to the new OpenAPI Initiative (Linux Foundation)"],
  ["2017", "OpenAPI 3.0"],
  ["2021", "OpenAPI 3.1: schemas become full JSON Schema"],
  ["2025", "OpenAPI 3.2: the QUERY method, streaming responses, nested tags"],
  ["2026", "3.2.1; companion specs Arazzo (workflows) and Overlay (repeatable edits)"],
];

export function Timeline() {
  return (
    <StepLayout
      eyebrow="Story"
      title="From Swagger to 3.2"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {EVENTS.map(([y, t], i) => (
            <motion.div
              key={y + t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="grid grid-cols-[3.5rem_1fr] gap-2 text-xs"
            >
              <span className="text-accent font-mono">{y}</span>
              <span className="border-line bg-surface rounded border px-2 py-1">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Many people still say &ldquo;Swagger&rdquo; for the whole thing. Today Swagger is a family
        of tools; the specification is OpenAPI, run by a vendor-neutral foundation.
      </p>
      <p>
        Around it is a large ecosystem: Swagger UI and Redoc for docs, Prism for mocks, OpenAPI
        Generator with well over a hundred client and server generators, and languages such as
        Microsoft&apos;s TypeSpec that compile to OpenAPI.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Generated or not? --------------------------------------------------------------------------- */

export function GeneratedOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Generated or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="generated-or-not"
            prompt="Which of these can tools produce from a good OpenAPI file, and which still need people?"
            categories={[
              { id: "tool", label: "Generated" },
              { id: "people", label: "Needs people" },
            ]}
            items={[
              {
                id: "docs",
                label: "Reference documentation for every endpoint",
                category: "tool",
                why: "Swagger UI, Redoc and others render it from the file.",
              },
              {
                id: "mock",
                label: "A mock server returning example responses",
                category: "tool",
                why: "Prism and similar tools serve the examples.",
              },
              {
                id: "sdk",
                label: "Typed client libraries in several languages",
                category: "tool",
                why: "OpenAPI Generator and others produce them.",
              },
              {
                id: "names",
                label: "Good, consistent names for resources and fields",
                category: "people",
                why: "Tools can lint for style, but not choose a clear name.",
              },
              {
                id: "scope",
                label: "Deciding what the API should do at all",
                category: "people",
                why: "That's a product decision with its consumers.",
              },
              {
                id: "guides",
                label: "Getting-started guides with real use cases",
                category: "people",
                why: "Reference docs list endpoints; guides explain tasks.",
              },
            ]}
            explanation="The file automates the mechanical parts; design judgment and explanation are still yours."
          />
        </div>
      }
    >
      <p>One file does a lot. Not everything.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["OpenAPI describes HTTP APIs", "Paths, operations, schemas, errors."],
  ["One file, many outputs", "Docs, mocks, clients, validation."],
  ["Design first", "Agree it before building; mocks unblock everyone."],
  ["Keep it true", "Lint it and test the server against it."],
  ["Schemas and examples matter", "They're what make the outputs useful."],
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
      <p>Next: with the contract written down, you can see exactly which changes would break it.</p>
    </StepLayout>
  );
}
