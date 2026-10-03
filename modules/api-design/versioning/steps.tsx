"use client";

import { motion } from "motion/react";
import { Plug, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, outcome, type Where } from "./model";
import type { VerState } from "./state";

/* 1 ─ A new plug socket --------------------------------------------------------------------------- */

export function Sockets() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A new plug socket"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-good/40 bg-good/5 flex flex-col gap-2 rounded-xl border px-4 py-3">
            <Plug className="text-good size-5" />
            <p className="font-semibold">Add a USB port to the wall plate</p>
            <p className="text-muted text-sm">
              Old appliances still plug in. New phones charge without an adapter.
            </p>
          </div>
          <div className="border-bad/40 bg-bad/5 flex flex-col gap-2 rounded-xl border px-4 py-3">
            <Plug className="text-bad size-5" />
            <p className="font-semibold">Change the socket&apos;s shape</p>
            <p className="text-muted text-sm">
              Every fridge, fan and lamp in the house stops working until someone buys adapters.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Electricians can add to a wall plate freely; changing the shape of the socket is a different
        matter. APIs split the same way. Some changes are <em>additive</em>: old clients carry on
        and new ones get more. Others are a <Term id="breaking-change">breaking change</Term>:
        something that worked yesterday fails today.
      </p>
      <p>
        Semantic Versioning puts it in one line: increase the &ldquo;MAJOR version when you make
        incompatible API changes&rdquo;. <Term id="api-versioning">Versioning</Term> lets the old
        contract and the new one live side by side while clients move over.
      </p>
    </StepLayout>
  );
}

/* 2 ─ v1 or v2? ⭐ -------------------------------------------------------------------------------- */

export function ShipIt() {
  const [s, set] = useSceneState<VerState>();
  const where = s.where ?? {};
  const r = outcome(where);
  const done = Object.keys(where).length;
  const pick = (id: string, w: Where) => set({ where: { ...where, [id]: w } });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="v1 or v2?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex items-center justify-between">
            <p className="text-muted font-mono text-[10px]">
              {done}/{CHANGES.length} decided
            </p>
            {done > 0 && (
              <button
                type="button"
                onClick={() => set({ where: {} })}
                className="text-muted flex items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Start again
              </button>
            )}
          </div>
          {CHANGES.map((c) => {
            const w = where[c.id];
            const bad = w === "v1" && c.breaking;
            const wasted = w === "v2" && !c.breaking;
            return (
              <div
                key={c.id}
                className={cn(
                  "rounded-lg border px-3 py-1.5",
                  !w
                    ? "border-line bg-surface"
                    : bad
                      ? "border-bad/50 bg-bad/10"
                      : wasted
                        ? "border-viz-compute/50 bg-viz-compute/10"
                        : "border-good/50 bg-good/5",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs">{c.label}</span>
                  <span className="flex gap-1">
                    {(["v1", "v2"] as Where[]).map((x) => (
                      <button
                        key={x}
                        type="button"
                        onClick={() => pick(c.id, x)}
                        className={cn(
                          "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                          w === x
                            ? "border-accent bg-accent-soft"
                            : "border-line hover:bg-surface-2",
                        )}
                      >
                        {x === "v1" ? "ship in v1" : "save for v2"}
                      </button>
                    ))}
                  </span>
                </div>
                {w && (
                  <p className="text-muted mt-0.5 text-[11px]">
                    {c.breaking ? "Breaking. " : "Additive. "}
                    {c.why}
                    {wasted && " No need to make clients migrate for this."}
                  </p>
                )}
              </div>
            );
          })}
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-lg border px-3 py-1.5",
                r.broken ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Changes that break v1 clients</p>
              <p className="font-mono text-lg font-semibold">{r.broken}</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-1.5",
                r.wasted ? "border-viz-compute/50 bg-viz-compute/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Improvements held back for no reason</p>
              <p className="font-mono text-lg font-semibold">{r.wasted}</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Nine proposed changes to a library&apos;s members API. Ship each one now in v1, which every
        existing client uses, or save it for v2, which clients must choose to move to.
      </p>
      <p>
        Ship breaking changes in v1 and you break people. Hold additive ones back for v2 and nobody
        gets them until they migrate. The trick is telling the two apart, and some are subtle:
        stricter validation and a new default both break clients without changing a single field
        name.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where the version goes ---------------------------------------------------------------------- */

const SCHEMES: [string, string, string][] = [
  ["In the path", "GET /v1/members/9", "Google: major version first in the path (v1, v1beta)."],
  [
    "A dated header",
    "X-GitHub-Api-Version: 2026-03-10",
    "GitHub: old versions supported at least 24 months after a new one.",
  ],
  [
    "Pinned per account",
    "Stripe-Version: 2026-09-30.endive",
    "Stripe: your account stays on its version until you upgrade.",
  ],
  ["A query parameter", "?api-version=2026-04-01", "Azure: required on every request."],
  [
    "Avoid it",
    "Only compatible changes",
    "Zalando: “SHOULD avoid versioning” and “prefer compatible extensions”.",
  ],
];

export function Schemes() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Where the version goes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SCHEMES.map(([t, eg, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-accent font-mono text-[11px] break-all">{eg}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every scheme works; what matters is picking one and saying how long old versions live. Dated
        versions suit APIs that change often in small steps. A path version suits rare, large
        redesigns.
      </p>
      <p>
        Since 2024, Stripe ships a new version monthly with no breaking changes, and saves breaking
        changes for two major releases a year.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Old and new, side by side ------------------------------------------------------------------- */

export function LiveTogether() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Old and new, side by side"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`request with Stripe-Version: 2024-06-20
        │
  current response  ──►  change module for 2026-03  ──►  change module for 2025-09  ──►  response
  (newest shape)          (undo one change)              (undo another)                  (old shape)`}</Code>
          <p className="text-muted text-xs">
            The code only knows the newest shape; small modules rewrite the response backwards for
            older clients.
          </p>
        </div>
      }
    >
      <p>
        Keeping old versions alive sounds expensive. Stripe&apos;s answer, described by Brandur
        Leach in 2017: each breaking change is wrapped &ldquo;in a version change module which
        defines documentation about the change, a transformation, and the set of API resource types
        that are eligible to be modified&rdquo;.
      </p>
      <p>
        Clients help too. Martin Fowler&apos;s <em>tolerant reader</em> advice: &ldquo;be as
        tolerant as possible when reading data from a service... only take the elements you need,
        ignore anything you don&apos;t.&rdquo; A tolerant client survives every additive change.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The rename ---------------------------------------------------------------------------------- */

export function BestRename() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The rename"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="best-rename"
            prompt="The field cust_name is confusing; everyone wants customer_name. Hundreds of partners use the API. What's the best path?"
            options={[
              {
                id: "inplace",
                label: "Rename it this Friday and email the partners",
                feedback: "Many partners won't read the email, and their code breaks on Saturday.",
              },
              {
                id: "v2all",
                label: "Launch a whole v2 just for this rename",
                feedback:
                  "A huge migration for one name; save v2 for when you have many breaking changes.",
              },
              {
                id: "both",
                label:
                  "Add customer_name alongside cust_name, mark cust_name deprecated, remove it in the next major version",
                correct: true,
                feedback: "Additive now; nobody breaks; clients switch at their own pace.",
              },
              {
                id: "never",
                label: "Never touch it; names don't matter",
                feedback: "Confusing names cost every new developer time, forever.",
              },
            ]}
            explanation="Add the new thing, keep the old one, announce the deprecation, and remove only in a new major version."
          />
        </div>
      }
    >
      <p>One awkward field name, hundreds of clients.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Additive is safe", "New endpoints, new optional inputs, new response fields."],
  [
    "Breaking is subtle",
    "Renames, removals, types, required fields, stricter rules, new defaults.",
  ],
  ["Version for breaking changes", "Path, header, account pin or query: pick one."],
  ["Say how long old versions live", "And keep that promise."],
  ["Tolerant readers", "Clients ignore what they don't need."],
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
      <p>Next: how to retire an old version without stranding the people still using it.</p>
    </StepLayout>
  );
}
