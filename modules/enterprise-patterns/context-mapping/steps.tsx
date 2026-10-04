"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { NODES, PATTERNS, type Pattern } from "./model";
import type { MapState } from "./state";

/* 1 ─ Upstream, downstream ------------------------------------------------------------------------ */

export function River() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Upstream, downstream"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 320 150" className="mx-auto w-full max-w-xl" aria-hidden>
            <path
              d="M0 30 C80 40 120 70 170 80 S260 110 320 130"
              className="stroke-viz-data/60"
              strokeWidth={16}
              fill="none"
            />
            {[0, 1, 2].map((k) => (
              <circle key={k} r={3} className="fill-viz-remove">
                <animateMotion
                  dur="4s"
                  begin={`-${k * 1.3}s`}
                  repeatCount="indefinite"
                  path="M0 30 C80 40 120 70 170 80 S260 110 320 130"
                />
              </circle>
            ))}
            <rect
              x={40}
              y={52}
              width={46}
              height={22}
              rx={3}
              className="fill-surface stroke-line-strong"
            />
            <text x={63} y={66} textAnchor="middle" className="fill-fg text-[8px]">
              upstream
            </text>
            <rect
              x={230}
              y={70}
              width={56}
              height={22}
              rx={3}
              className="fill-surface stroke-line-strong"
            />
            <text x={258} y={84} textAnchor="middle" className="fill-fg text-[8px]">
              downstream
            </text>
          </svg>
          <p className="text-muted text-center text-xs">
            What the upstream city puts in the river, the downstream city drinks.
          </p>
        </div>
      }
    >
      <p>
        Evans explains the most important idea about contexts with a river: &ldquo;If two cities are
        along the same river, the upstream city&apos;s pollution primarily affects the downstream
        city.&rdquo; The downstream city can&apos;t do much about it; the upstream one may not even
        notice.
      </p>
      <p>
        Between bounded contexts it&apos;s the same. When one team&apos;s changes affect another but
        not the reverse, they&apos;re <Term id="upstream-downstream">upstream and downstream</Term>.
        A <Term id="context-map">context map</Term> records every such relationship, so nobody is
        surprised by what floats down.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The insurer's map ⭐ ------------------------------------------------------------------------ */

export function TheMap() {
  const [s, set] = useSceneState<MapState>();
  const p = PATTERNS[s.pattern];
  const edge = p.edge;
  const nodeOn = (id: string) =>
    (edge && edge.includes(id)) ||
    (s.pattern === "mud" && id === "policy") ||
    (s.pattern === "separate-ways" && (id === "marketing" || id === "claims"));
  return (
    <StepLayout
      eyebrow="Infographic"
      title="The insurer's map"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {(Object.keys(PATTERNS) as Pattern[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.pattern === k}
                onClick={() => set({ pattern: k })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.pattern === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {PATTERNS[k].name}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 430 290" className="mx-auto w-full max-w-xl" aria-hidden>
            {(Object.keys(PATTERNS) as Pattern[])
              .map((k) => PATTERNS[k].edge)
              .filter((e): e is [string, string] => e !== null)
              .map(([a, b], i) => {
                const on = edge && edge[0] === a && edge[1] === b;
                return (
                  <line
                    key={i}
                    x1={NODES[a].x}
                    y1={NODES[a].y}
                    x2={NODES[b].x}
                    y2={NODES[b].y}
                    className={on ? "stroke-accent" : "stroke-line-strong"}
                    strokeWidth={on ? 2.5 : 1}
                    strokeDasharray={on ? undefined : "3 3"}
                  />
                );
              })}
            {edge && (
              <>
                <text
                  x={NODES[edge[0]].x}
                  y={NODES[edge[0]].y - 18}
                  textAnchor="middle"
                  className="fill-accent font-mono text-[9px]"
                >
                  {s.pattern === "partnership" || s.pattern === "shared-kernel" ? "" : "U"}
                </text>
                <text
                  x={NODES[edge[1]].x}
                  y={NODES[edge[1]].y - 18}
                  textAnchor="middle"
                  className="fill-accent font-mono text-[9px]"
                >
                  {s.pattern === "partnership" || s.pattern === "shared-kernel" ? "" : "D"}
                </text>
              </>
            )}
            {Object.entries(NODES)
              .filter(([, n]) => n.label)
              .map(([id, n]) => (
                <g key={id}>
                  <rect
                    x={n.x - 52}
                    y={n.y - 13}
                    width={104}
                    height={26}
                    rx={n.external ? 2 : 13}
                    className={cn(
                      nodeOn(id) ? "fill-surface stroke-accent" : "fill-surface stroke-line-strong",
                    )}
                    strokeWidth={nodeOn(id) ? 1.6 : 1}
                    strokeDasharray={n.mud || n.external ? "4 2" : undefined}
                  />
                  <text
                    x={n.x}
                    y={n.y + 3.5}
                    textAnchor="middle"
                    className={cn(
                      "text-[9px]",
                      nodeOn(id) ? "fill-accent font-semibold" : "fill-fg",
                    )}
                  >
                    {n.label}
                  </text>
                </g>
              ))}
          </svg>
          <motion.div
            key={s.pattern}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-accent text-[11px]">{p.adapts}</p>
            </div>
            <p className="mt-1 text-xs">{p.story}</p>
            <p className="text-muted mt-1.5 text-xs italic">&ldquo;{p.evans}&rdquo;</p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            U = upstream, D = downstream. Dashed boxes: external or legacy. A fictional insurer.
          </p>
        </div>
      }
    >
      <p>
        Evans named the common relationships between contexts. Seven come from his 2003 book; his
        2015 reference added Partnership and Big Ball of Mud. Click each one to see where it shows
        up in the insurer&apos;s systems.
      </p>
      <p>
        The one you&apos;ll reach for most is the{" "}
        <Term id="anticorruption-layer">anticorruption layer</Term>: a translating wall that keeps a
        messy upstream model from leaking into yours.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Who adapts to whom? ------------------------------------------------------------------------- */

const CHOICES: { t: string; when: string; cost: string }[] = [
  {
    t: "Ask: customer/supplier",
    when: "The upstream team will listen and plan for you.",
    cost: "Needs negotiation and shared planning.",
  },
  {
    t: "Accept: conformist",
    when: "Upstream won't change, and its model is good enough.",
    cost: "Their model now shapes yours.",
  },
  {
    t: "Translate: anticorruption layer",
    when: "Upstream won't change, and its model would damage yours.",
    cost: "A layer to build and maintain.",
  },
  {
    t: "Walk away: separate ways",
    when: "The benefit of integrating is small.",
    cost: "Some duplication.",
  },
];

export function WhoAdapts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who adapts to whom?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-xs font-semibold">You&apos;re downstream. Your options:</p>
          {CHOICES.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{c.t}</p>
              <p className="text-xs">{c.when}</p>
              <p className="text-muted text-[11px]">{c.cost}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A context map is really about power. If you&apos;re downstream, your choices depend on
        whether upstream will help you, and on how good its model is.
      </p>
      <p>
        If you&apos;re upstream with many consumers, Evans&apos;s advice is an{" "}
        <Term id="open-host-service">open-host service</Term>: one well-documented protocol for
        everyone, often in a <Term id="published-language">published language</Term> such as an
        industry data standard, instead of a custom translator per client.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Drawing your own ---------------------------------------------------------------------------- */

const STEPS: [string, string][] = [
  ["List the contexts", "Including old systems and outside providers, each with a name."],
  ["Draw the links", "Every place where data or requests cross a boundary."],
  ["Mark the direction", "Who is upstream? Whose changes break whom?"],
  ["Name each relationship", "Partnership, conformist, anticorruption layer…"],
  ["Spot the trouble", "Shared models nobody agreed to, translation nobody owns."],
];

export function DrawYours() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Drawing your own"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {STEPS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[1.5rem_1fr] gap-2 rounded-lg border px-3 py-2"
            >
              <span className="text-accent font-mono text-sm">{i + 1}</span>
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Evans&apos;s advice: &ldquo;Map the existing terrain. Take up transformations later.&rdquo;
        Draw what is, not what you wish were true. A whiteboard and an hour with people from each
        team is enough to start.
      </p>
      <p>
        The map earns its keep in planning: a new feature whose path crosses three upstream
        relationships is three negotiations, before any code is written.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which relationship? ------------------------------------------------------------------------- */

export function WhichRelation() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which relationship?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-relationship"
            prompt="Which relationship fits each situation best?"
            categories={[
              { id: "conformist", label: "Conformist" },
              { id: "acl", label: "Anticorruption layer" },
              { id: "ohs", label: "Open-host service" },
              { id: "separate", label: "Separate ways" },
            ]}
            items={[
              {
                id: "tax",
                label:
                  "You must file through a national tax portal's API; it won't change for you, and its model is fine",
                category: "conformist",
                why: "No influence, and nothing to protect: use their model.",
              },
              {
                id: "legacy",
                label:
                  "Your new claims system needs data from a 25-year-old system with a confusing model",
                category: "acl",
                why: "Translate at the edge so the old model doesn't leak in.",
              },
              {
                id: "payments",
                label: "Your payments team serves 30 internal teams that all need the same things",
                category: "ohs",
                why: "One documented protocol beats 30 custom integrations.",
              },
              {
                id: "campaigns",
                label:
                  "Marketing's campaign tool and claims processing have nothing they need from each other",
                category: "separate",
                why: "Integration is expensive; skip it when the benefit is small.",
              },
              {
                id: "kyc",
                label:
                  "An identity-check provider's model matches yours closely; translating would add nothing",
                category: "conformist",
                why: "Conformity “enormously simplifies integration”.",
              },
            ]}
            explanation="Downstream with no influence: conform if their model is fine, translate if it isn't. Upstream with many clients: open a host service. No real need: separate ways."
          />
        </div>
      }
    >
      <p>Pick the relationship for each pair.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Upstream and downstream", "Whose changes affect whom."],
  ["Map what exists", "Every context, every link, every direction."],
  ["Name the relationship", "Nine patterns cover almost every case."],
  ["Protect your model", "An anticorruption layer translates at the edge."],
  ["Serve many with one", "Open-host service plus a published language."],
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
        That&apos;s the big picture between contexts. Next we zoom inside one, to the objects that
        must change together: entities, value objects and aggregates.
      </p>
    </StepLayout>
  );
}
