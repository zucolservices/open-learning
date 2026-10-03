"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTIONS, plan, type Action } from "./model";
import type { DepState } from "./state";

/* 1 ─ Closing a road ------------------------------------------------------------------------------ */

const SIGNS: [string, string][] = [
  ["3 months before", "Signs go up: 'Road closes 1 March. Use the bypass.'"],
  ["1 month before", "Diversion signs and maps appear; buses are rerouted."],
  ["A few weekends", "Short trial closures, so stragglers notice."],
  ["1 March", "The barrier goes down, with a sign pointing to the bypass."],
];

export function RoadClosure() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Closing a road"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SIGNS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[7.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="text-accent font-mono text-xs">{t}</span>
              <span>{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A city that closes a road overnight, with no warning, causes chaos. One that puts up signs
        for months, offers a diversion and runs a few trial closures barely makes the news.
      </p>
      <p>
        Retiring an API version works the same way. <Term id="deprecation">Deprecation</Term> means
        &ldquo;still working, but going away: please move&rdquo;. The{" "}
        <Term id="sunset">sunset</Term> is the date it actually stops. The time between is for
        helping every client across.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A twelve-month sunset ⭐ -------------------------------------------------------------------- */

export function Sunset() {
  const [s, set] = useSceneState<DepState>();
  const on = s.on ?? [];
  const r = plan(on);
  const toggle = (a: Action) =>
    set({ on: on.includes(a) ? on.filter((x) => x !== a) : [...on, a] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A twelve-month sunset"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {ACTIONS.map((a) => {
              const active = on.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(a.id)}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                    active ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded border",
                      active ? "border-accent bg-accent text-accent-fg" : "border-line",
                    )}
                  >
                    {active && <Check className="size-2.5" />}
                  </span>
                  <span>
                    <span className="font-medium">{a.label}</span>{" "}
                    <span className="text-muted">· month {a.month}</span>
                    <span className="text-muted block text-[11px]">{a.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted mb-1 text-[10px]">Clients still on v1, month by month</p>
            <div className="flex h-16 items-end gap-1">
              {r.left.map((n, m) => (
                <div key={m} className="flex h-full flex-1 flex-col justify-end">
                  <motion.div
                    animate={{ height: `${(n / 8) * 100}%` }}
                    className={cn(
                      "w-full rounded-t-sm",
                      m === 12 && n > 1 ? "bg-bad/70" : "bg-viz-data/50",
                    )}
                    style={{ minHeight: 2 }}
                  />
                </div>
              ))}
            </div>
            <div className="text-muted mt-0.5 flex justify-between font-mono text-[9px]">
              <span>m0</span>
              <span>m6</span>
              <span>m12 · switch-off</span>
            </div>
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {r.rows.map((c) => (
              <p key={c.id} className="flex items-center gap-1.5 text-[11px]">
                {c.at !== null ? (
                  <Check className="text-good size-3 shrink-0" />
                ) : c.id === "dead" ? (
                  <span className="text-muted size-3 shrink-0 text-center">–</span>
                ) : (
                  <X className="text-bad size-3 shrink-0" />
                )}
                <span className={c.at === null && c.id !== "dead" ? "text-bad" : ""}>{c.name}</span>
                <span className="text-muted ml-auto font-mono">
                  {c.at !== null ? `m${c.at}` : c.id === "dead" ? "unused" : "stranded"}
                </span>
              </p>
            ))}
          </div>
          <p
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              r.stranded.length ? "border-bad/50 bg-bad/5" : "border-good/50 bg-good/5",
            )}
          >
            {r.stranded.length
              ? `${r.stranded.length} active client${r.stranded.length > 1 ? "s" : ""} will break at switch-off.`
              : "Every active client moved before switch-off. The one left is unused, and nobody notices it go."}
          </p>
          <p className="text-subtle text-[10px]">Illustrative clients and timings.</p>
        </div>
      }
    >
      <p>
        You&apos;re retiring v1 of your API in twelve months. Eight clients still call it. Choose
        what you&apos;ll do to get them across, and see who&apos;s left when it switches off.
      </p>
      <p>
        No single channel reaches everyone. Some people read email; some only notice warnings in
        their logs; some code has no owner at all until it fails. Zalando&apos;s guidelines make one
        step mandatory: &ldquo;MUST monitor usage of deprecated API scheduled for sunset&rdquo;, so
        you can see who&apos;s left.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Say it in every response -------------------------------------------------------------------- */

export function Headers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Say it in every response"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`HTTP/1.1 200 OK
Deprecation: @1767225599
Sunset: Thu, 31 Dec 2026 23:59:59 GMT
Link: <https://api.example.in/docs/migrate-v2>; rel="deprecation"
Content-Type: application/json

{ … the usual response … }`}</Code>
          <Code>{`after the sunset:
HTTP/1.1 410 Gone
Content-Type: application/problem+json
{ "title": "API v1 was retired on 31 Dec 2026", "type": "…/migrate-v2" }`}</Code>
        </div>
      }
    >
      <p>
        Two standard headers put the warning where software can see it. <code>Deprecation</code>{" "}
        (RFC 9745, 2025) says when the resource was deprecated; <code>Sunset</code> (RFC 8594, 2019)
        says when it will stop responding. A <code>Link</code> points to the migration guide.
        Clients, SDKs and gateways can log or alert on them.
      </p>
      <p>
        RFC 9745 is careful to add: &ldquo;The act of deprecation does not change any behavior of
        the resource.&rdquo; Deprecated APIs keep working until the sunset. After it, 410 Gone and a
        pointer to what replaced it beat a mysterious 404.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How the big platforms do it ----------------------------------------------------------------- */

const PLATFORMS: [string, string][] = [
  [
    "Google Cloud",
    "Its terms promise at least 12 months' notice before discontinuing a service or making a backwards-incompatible change to a customer-facing API (with some exceptions).",
  ],
  [
    "Meta Graph API",
    "“Each version is guaranteed to operate for at least two years”, counted from the release of the next version.",
  ],
  [
    "Salesforce",
    "API versions 21.0–30.0 were deprecated in Summer '22 and retired in Summer '25; REST calls to them now get 410 Gone.",
  ],
  [
    "GitHub",
    "Before removing old SSH algorithms and the git:// protocol in 2022, it ran short, announced “brownouts” to help clients discover lingering use.",
  ],
];

export function HowOthers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How the big platforms do it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PLATFORMS.map(([t, d], i) => (
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
        The common thread is a published promise: how much notice, how long versions live, what
        happens at the end. Clients plan around the promise, so keep it.
      </p>
      <p>
        Brownouts deserve a special mention. A planned one-hour outage, announced in advance, finds
        the forgotten scripts and unmaintained apps that no email ever will, while there&apos;s
        still time to fix them.
      </p>
    </StepLayout>
  );
}

/* 5 ─ In what order? ------------------------------------------------------------------------------ */

export function RetireOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="In what order?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="retire-order"
            prompt="Put the steps for retiring an API version in a sensible order."
            items={[
              { id: "v2", label: "Ship the replacement and a migration guide" },
              {
                id: "announce",
                label: "Announce the sunset date; add Deprecation and Sunset headers",
              },
              { id: "track", label: "Track usage by client and contact those still calling" },
              { id: "brownout", label: "Run short, announced brownouts" },
              { id: "off", label: "Switch off on the date; answer 410 Gone with a link to v2" },
            ]}
            explanation="Replacement first, then a clear date and signals, then active help, then rehearsals, and only then the switch-off."
          />
        </div>
      }
    >
      <p>Drag the steps into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Deprecated still works", "Sunset is when it stops."],
  ["Signal everywhere", "Email, docs, Deprecation and Sunset headers."],
  ["Watch who's left", "Usage by client; contact them directly."],
  ["Brownouts find stragglers", "Short, announced, before the end."],
  ["End cleanly", "410 Gone with a pointer to the replacement."],
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
        That&apos;s the contract&apos;s whole life: designed, described, evolved and retired. Next
        chapter: styles beyond REST, starting with gRPC.
      </p>
    </StepLayout>
  );
}
