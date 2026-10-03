"use client";

import { motion } from "motion/react";
import { Check, Milk } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TOOLS, simulate, type Tool } from "./model";
import type { PerfState } from "./state";

/* 1 ─ Best before --------------------------------------------------------------------------------- */

export function BestBefore() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Best before"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Within the date", "Use the milk in the fridge. No trip to the shop.", "max-age"],
            [
              "Date passed",
              "Phone the shop: “still the same batch?” “Yes.” Keep it.",
              "304 Not Modified",
            ],
            ["New batch", "Only now do you go and buy a fresh carton.", "200 with a new body"],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid gap-x-3 rounded-lg border px-3 py-2 sm:grid-cols-[1fr_9rem]"
            >
              <span className="text-sm">
                <Milk className="text-viz-data mr-1 inline size-4" />
                <span className="font-semibold">{t}:</span> <span className="text-muted">{d}</span>
              </span>
              <span className="text-accent font-mono text-xs sm:text-right">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You don&apos;t buy milk every time you want tea. You check the date on the carton, and if
        it&apos;s past, you check whether it&apos;s actually changed before buying more.
      </p>
      <p>
        HTTP has the same habits built in. A response can say how long it stays fresh, and carry a
        version tag, an <Term id="etag">ETag</Term>, so the client can later ask &ldquo;has it
        changed since this version?&rdquo; The fastest request is the one you never send; the next
        fastest is the one with nothing to send back.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Five fetches ⭐ ----------------------------------------------------------------------------- */

const KIND: Record<string, string> = {
  full: "border-viz-data/50 bg-viz-data/10",
  "304": "border-good/50 bg-good/10",
  local: "border-line bg-surface",
};

export function FiveFetches() {
  const [s, set] = useSceneState<PerfState>();
  const on = s.on ?? [];
  const r = simulate(on);
  const base = simulate([]);
  const toggle = (t: Tool) => set({ on: on.includes(t) ? on.filter((x) => x !== t) : [...on, t] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Five fetches"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {TOOLS.map((t) => {
              const active = on.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(t.id)}
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
                    <span className="font-medium">{t.label}</span>
                    <span className="text-muted block font-mono text-[10px]">{t.header}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-1.5">
            {r.out.map((f, i) => (
              <motion.div
                key={`${on.join()}-${i}`}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "grid grid-cols-[3rem_1fr_4rem] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  KIND[f.kind],
                )}
              >
                <span className="font-mono">{f.at}</span>
                <span className="text-muted">{f.note}</span>
                <span className="text-right font-mono">
                  {f.kb === 0 ? "0" : f.kb < 1 ? f.kb.toFixed(1) : f.kb.toFixed(f.kb < 10 ? 1 : 0)}{" "}
                  KB
                </span>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Round trips", `${r.trips}`, `${base.trips}`],
              ["Data sent", `${r.kb.toFixed(1)} KB`, `${base.kb} KB`],
            ].map(([l, v, b]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">
                  {v} <span className="text-subtle text-[10px] font-normal">(was {b})</span>
                </p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative sizes: a 48 KB product response; the price changes at 15:00.
          </p>
        </div>
      }
    >
      <p>
        A shopping app shows the same product five times in about twenty minutes, and the price
        changes once in the middle. Switch on HTTP&apos;s performance tools one at a time.
      </p>
      <p>
        Each saves something different: caching saves the trip, ETags save the body when nothing
        changed, compression and field selection shrink the body when something did. GitHub even
        rewards them: an authenticated conditional request that comes back 304 doesn&apos;t count
        against your primary rate limit.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Saying how to cache ------------------------------------------------------------------------- */

const DIRECTIVES: [string, string][] = [
  ["max-age=60", "Fresh for 60 seconds; reuse it without asking."],
  [
    "no-cache",
    "You may store it, but check with the server before every reuse. Not “don't cache”!",
  ],
  ["no-store", "Don't keep it at all."],
  ["private", "The user's browser may cache it; shared caches like CDNs may not."],
  ["s-maxage=300", "A separate freshness time for shared caches (CDNs)."],
  [
    "stale-while-revalidate=30",
    "From RFC 5861: serve the slightly stale copy while fetching a fresh one in the background.",
  ],
];

export function Directives() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Saying how to cache"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {DIRECTIVES.map(([d, m], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface grid gap-x-3 rounded-lg border px-3 py-1.5 sm:grid-cols-[12rem_1fr]"
            >
              <span className="text-accent font-mono text-xs">{d}</span>
              <span className="text-muted text-xs">{m}</span>
            </motion.div>
          ))}
          <Code>{"Vary: Accept-Encoding    # cache the gzip and br versions separately"}</Code>
        </div>
      }
    >
      <p>
        The <Term id="cache-control">Cache-Control</Term> header (RFC 9111) tells browsers, apps and
        CDNs what they may do with a response. Choosing it is a design decision: how stale can this
        data safely be, and is it the same for everyone?
      </p>
      <p>
        <code>Vary</code> &ldquo;expands the cache key&rdquo;, so a cache keeps separate copies per
        encoding or language. Caching at a CDN&apos;s edge also, in Amazon CloudFront&apos;s words,
        &ldquo;reduces the load on your origin server and reduces latency.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 4 ─ The lost update ----------------------------------------------------------------------------- */

export function LostUpdate() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The lost update"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`Meera:  GET /products/p_7          → ETag: "v7", stock: 10
Arjun:  GET /products/p_7          → ETag: "v7", stock: 10
Arjun:  PATCH /products/p_7  If-Match: "v7"  { stock: 8 }   → 200, ETag "v8"
Meera:  PATCH /products/p_7  If-Match: "v7"  { stock: 12 }  → 412 Precondition Failed
Meera:  GET again, sees stock 8, decides what to do`}</Code>
          <p className="text-muted text-[11px]">
            Without If-Match, Meera&apos;s write would silently erase Arjun&apos;s.
          </p>
        </div>
      }
    >
      <p>
        ETags help writes too. Two people edit the same product at once; the second save would
        quietly overwrite the first. RFC 9110 calls this &ldquo;the lost update problem&rdquo;.
      </p>
      <p>
        Send the ETag you read in an <code>If-Match</code> header, and the server refuses the write
        if the resource has changed since, usually with 412 Precondition Failed. The client then
        re-reads and decides.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which Cache-Control? ------------------------------------------------------------------------ */

export function PickHeader() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which Cache-Control?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-header"
            prompt="Which caching instruction suits each response?"
            categories={[
              { id: "maxage", label: "max-age (hours)" },
              { id: "nocache", label: "no-cache + ETag" },
              { id: "nostore", label: "no-store" },
            ]}
            items={[
              {
                id: "countries",
                label: "The list of countries and currency codes",
                category: "maxage",
                why: "Changes almost never; cache it for a long time.",
              },
              {
                id: "logo",
                label: "A restaurant's logo image",
                category: "maxage",
                why: "Static; give each version its own URL and cache it hard.",
              },
              {
                id: "price",
                label: "A product's price, which must always be current",
                category: "nocache",
                why: "Keep a copy, but revalidate every time; a 304 is cheap.",
              },
              {
                id: "menu",
                label: "Today's menu, edited a few times a day",
                category: "nocache",
                why: "Revalidating catches edits without re-downloading the unchanged menu.",
              },
              {
                id: "otp",
                label: "A response containing a one-time password",
                category: "nostore",
                why: "Never keep it anywhere.",
              },
              {
                id: "card",
                label: "A page showing a saved card's full details",
                category: "nostore",
                why: "Sensitive and personal: don't store it. (no-store alone isn't a security guarantee, though.)",
              },
            ]}
            explanation="Long max-age for things that rarely change, no-cache with ETags for things that must be current, no-store for things that must not be kept."
          />
        </div>
      }
    >
      <p>How stale can each one safely be?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Cache-Control", "Say how long it's fresh, and who may keep it."],
  ["ETags", "304 when nothing changed; If-Match to prevent lost updates."],
  ["Smaller bodies", "Compression and field selection."],
  ["Fewer trips", "Batch requests when clients need many things at once."],
  ["Cache at the edge", "CDNs take load off your servers."],
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
        For batching, Microsoft Graph is an example: up to 20 requests in one HTTP call, reducing
        round trips. Next: gateways, and making your API pleasant to use.
      </p>
    </StepLayout>
  );
}
