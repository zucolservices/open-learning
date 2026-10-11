"use client";

import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, CHUNKS, LAYERS, type Layer } from "./model";
import type { StructState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The one-person café"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "One person does everything",
              "Takes orders, cooks, washes up, orders stock. Fine on a quiet day; chaos when anything changes.",
            ],
            [
              "Clear stations",
              "Counter, kitchen, store room. Change the menu and only the kitchen needs to know.",
            ],
          ].map(([t, b], i) => (
            <div
              key={t}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        A café run by one person works until it grows. Then every change, a new supplier or a new
        till, disturbs everything else.
      </p>
      <p>
        Services are the same. Splitting code into <Term id="layered-architecture">layers</Term>,
        each with one responsibility, means a change to the database or the pricing rules stays in
        one place.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Untangle ⭐ ---------------------------------------------------------------------------------- */

export function Untangle() {
  const [s, set] = useSceneState<StructState>();
  const right = (id: string) => s.placed[id] === CHUNKS.find((c) => c.id === id)!.answer;
  const done = CHUNKS.every((c) => right(c.id));
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Untangle a 400-line handler"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CHUNKS.map((c) => (
            <div
              key={c.id}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <code className="block overflow-x-auto font-mono text-[10.5px] whitespace-nowrap">
                {c.code}
              </code>
              <div className="mt-1 flex flex-wrap gap-1">
                {LAYERS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    title={l.desc}
                    aria-pressed={s.placed[c.id] === l.id}
                    onClick={() => set({ placed: { ...s.placed, [c.id]: l.id as Layer } })}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px]",
                      s.placed[c.id] === l.id
                        ? right(c.id)
                          ? "border-good bg-good/20"
                          : "border-bad bg-bad/15"
                        : "border-line text-muted",
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              {s.placed[c.id] && (
                <p className={cn("mt-0.5 text-[10px]", right(c.id) ? "text-good" : "text-muted")}>
                  {right(c.id)
                    ? c.why
                    : "Ask: is this about HTTP, a business rule, the database, or another outside system?"}
                </p>
              )}
            </div>
          ))}
          {done && (
            <div className="border-line bg-surface-2 mt-1 grid gap-1 rounded-lg border p-2 text-xs">
              <p className="font-medium">Now try some changes. Each touches one layer:</p>
              {CHANGES.map((ch) => (
                <p key={ch.text} className="flex justify-between gap-2">
                  <span>{ch.text}</span>
                  <span className="text-good shrink-0 font-mono text-[10px]">
                    {ch.touches.map((t) => LAYERS.find((l) => l.id === t)!.label).join(", ")}
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>
      }
    >
      <p>
        A café&apos;s &ldquo;place order&rdquo; handler does everything in one function. Move each
        chunk to the layer it belongs in. Hover a layer to see what it&apos;s for.
      </p>
      <p>When everything is placed, see how much easier common changes become.</p>
    </StepLayout>
  );
}

/* 3 ─ Architectures -------------------------------------------------------------------------------- */

export function Rings() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rules in the middle, technology at the edge"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <svg viewBox="0 0 220 180" className="h-auto w-full max-w-xs">
            {[
              [80, "fill-viz-idle/15 stroke-line-strong", "HTTP · database · email"],
              [55, "fill-viz-data/20 stroke-viz-data", "services (use cases)"],
              [30, "fill-accent/20 stroke-accent", "domain"],
            ].map(([r, c, l], i) => (
              <g key={i}>
                <circle
                  cx={110}
                  cy={90}
                  r={r as number}
                  className={c as string}
                  strokeWidth={1.2}
                />
                <text
                  x={110}
                  y={90 - (r as number) + 12}
                  textAnchor="middle"
                  className="fill-fg text-[8px]"
                >
                  {l as string}
                </text>
              </g>
            ))}
            <path
              d="M190 90 L148 90"
              className="stroke-fg"
              strokeWidth={1.2}
              markerEnd="url(#arr)"
            />
            <defs>
              <marker
                id="arr"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0 0 L10 5 L0 10 z" className="fill-fg" />
              </marker>
            </defs>
            <text x={152} y={84} className="fill-muted text-[7px]">
              depends on
            </text>
          </svg>
        </div>
      }
    >
      <p>
        Several well-known styles share one idea: Alistair Cockburn&apos;s hexagonal architecture
        (ports and adapters, 2005), Jeffrey Palermo&apos;s onion architecture (2008) and Robert
        Martin&apos;s clean architecture (2012). Business rules sit in the middle; HTTP, databases
        and email sit at the edges.
      </p>
      <p>
        The <Term id="dependency-rule">dependency rule</Term>: code points inwards. The pricing
        rules never import the web framework or the database driver.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Folders -------------------------------------------------------------------------------------- */

export function Folders() {
  const [s, set] = useSceneState<StructState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Folders by layer, or by feature?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.folders}
            onChange={(folders) => set({ folders })}
            options={[
              ["layers", "By layer"],
              ["features", "By feature"],
            ]}
          />
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {s.folders === "layers"
              ? "handlers/   orders.ts  menu.ts  payments.ts\nservices/   orders.ts  menu.ts  payments.ts\nrepos/      orders.ts  menu.ts  payments.ts"
              : "orders/     handler.ts  service.ts  repo.ts\nmenu/       handler.ts  service.ts  repo.ts\npayments/   handler.ts  service.ts  adapter.ts"}
          </pre>
          <p className="text-muted text-xs">
            {s.folders === "layers"
              ? "Changing how orders work means touching three folders."
              : "Everything about orders lives together; layers still exist inside each feature."}
          </p>
        </div>
      }
    >
      <p>
        Jimmy Bogard&apos;s &ldquo;vertical slice&rdquo; idea (2018) groups code by feature instead
        of by technical layer. Martin Fowler likewise suggests splitting large systems by domain
        first, with layers inside each part.
      </p>
      <p>
        Keep it proportionate: a small service with simple data in and out doesn&apos;t need every
        interface. Add structure where change actually happens.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function StructCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A dependency pointing the wrong way"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="backend-structure"
            prompt="The discount calculation takes the web framework's request object as an argument and reads the user from it. Why is that a problem?"
            options={[
              {
                id: "speed",
                label: "It makes the code slower",
                feedback: "Performance isn't the issue here.",
              },
              {
                id: "dir",
                label:
                  "A business rule now depends on HTTP, so it can't be reused from a job or tested without a fake request",
                correct: true,
                feedback:
                  "Right: pass in plain values (the user, the items) instead. Dependencies should point inwards.",
              },
              {
                id: "fine",
                label: "It's fine: the request has everything it needs",
                feedback:
                  "Convenient today, but every new caller, test or framework change now involves HTTP.",
              },
            ]}
            explanation="Keep business rules free of HTTP and database details. Handlers translate requests into plain values and call the rules."
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
        ["One job per layer", "Handler, service, repository, adapter."],
        ["Rules in the middle", "Technology at the edges."],
        ["Dependencies point inwards", "Rules never import HTTP."],
        ["Group by feature", "Layers inside each."],
        ["Proportionate structure", "Add it where change happens."],
      ]}
    >
      <p>Next: middleware, the pipeline every request passes through.</p>
    </WrapStep>
  );
}
