"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  bytesHuman,
  estimate,
  expectedCollisions,
  human,
  loadTest,
  pAnyCollision,
  pNextCollides,
  space,
} from "./model";
import type { UrlState } from "./state";

const VOLUMES = [1e7, 1e8, 1e9];
const RATIOS = [10, 100, 1000];
const YEARS = [1, 5, 10];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted w-36 text-xs">{label}</span>
      {children}
    </div>
  );
}

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 1 ─ Short links, big numbers ⭐ ------------------------------------------------------------------- */

export function Numbers() {
  const [s, set] = useSceneState<UrlState>();
  const e = estimate(VOLUMES[s.perMonth], RATIOS[s.ratio], YEARS[s.years]);
  return (
    <StepLayout
      eyebrow="Requirements"
      title="Short links, big numbers"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Row label="New links per month">
            <Segmented
              size="sm"
              value={String(s.perMonth)}
              options={VOLUMES.map((v, i) => [String(i), human(v)] as [string, string])}
              onChange={(v) => set({ perMonth: Number(v) })}
            />
          </Row>
          <Row label="Clicks per new link">
            <Segmented
              size="sm"
              value={String(s.ratio)}
              options={RATIOS.map((v, i) => [String(i), `${v}`] as [string, string])}
              onChange={(v) => set({ ratio: Number(v) })}
            />
          </Row>
          <Row label="Keep links for">
            <Segmented
              size="sm"
              value={String(s.years)}
              options={YEARS.map((v, i) => [String(i), `${v} yr`] as [string, string])}
              onChange={(v) => set({ years: Number(v) })}
            />
          </Row>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Stat label="New links per second" value={human(e.writes)} />
            <Stat label="Redirects per second (avg)" value={human(e.reads)} />
            <Stat label="Redirects per second (peak ≈ 2×)" value={human(e.peakReads)} />
            <Stat label="Links stored" value={human(e.total)} />
            <Stat label={`Storage (${500} bytes each)`} value={bytesHuman(e.bytes)} />
            <Stat label="Key length (base62)" value={`${e.keyLen} characters`} />
          </div>
          <Code>{`short.ly/${"x7Kp2Qa".slice(0, e.keyLen)}  →  https://brewline.example/products/grinders/burr-200?utm_source=…`}</Code>
          <p className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
            {e.reads > 20000
              ? "Tens of thousands of redirects a second, nearly all reads: this system lives or dies by how fast it can look up a key."
              : "Modest load: one well-indexed database could handle this. Keep the design simple, and know where it would break as you grow."}
          </p>
        </div>
      }
    >
      <p>
        A cloakroom takes your long coat and gives you a small numbered ticket. A URL shortener does
        the same for web addresses: it stores the long link and hands back a short key.
      </p>
      <p>
        Every design starts with requirements and a{" "}
        <Term id="back-of-envelope">back-of-the-envelope</Term> estimate. Choose a scale, and see
        how much traffic and storage it means.
      </p>
      <p className="text-muted text-sm">
        Keys use <Term id="base62">base62</Term>: 0–9, a–z and A–Z. Each extra character multiplies
        the number of possible keys by 62.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pick a key scheme ⭐ -------------------------------------------------------------------------- */

const LINKS = [1e5, 1e7, 1e9];
const LENS = [6, 7, 8];

const SCHEMES: Record<
  UrlState["scheme"],
  { label: string; how: string; plus: string; minus: string }
> = {
  hash: {
    label: "Hash the URL",
    how: "Take a hash (such as MD5) of the long URL and keep the first few base62 characters.",
    plus: "The same URL always gets the same key, so duplicates are free.",
    minus:
      "Truncated hashes collide like random keys; on a collision you must add a salt and hash again.",
  },
  counter: {
    label: "Counter",
    how: "Give each link the next number from a counter, written in base62 (1, 2, … a, b, … 10, 11 …).",
    plus: "No collisions ever, and the shortest possible keys.",
    minus:
      "Keys are guessable (anyone can walk through every link), and one counter is a bottleneck: hand out blocks of numbers to each server instead.",
  },
  random: {
    label: "Random",
    how: "Pick random base62 characters; if the key is already taken, try again.",
    plus: "Unguessable, and no coordination between servers.",
    minus: "Every insert must check for a clash, and clashes get likelier as the table fills.",
  },
};

export function KeyScheme() {
  const [s, set] = useSceneState<UrlState>();
  const len = LENS[s.keyLen];
  const n = LINKS[s.links];
  const N = space(len);
  const x = SCHEMES[s.scheme];
  const collides = s.scheme !== "counter";
  return (
    <StepLayout
      eyebrow="Explore"
      title="Pick a key scheme"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.scheme}
            options={(Object.keys(SCHEMES) as UrlState["scheme"][]).map(
              (k) => [k, SCHEMES[k].label] as [string, string],
            )}
            onChange={(v) => set({ scheme: v as UrlState["scheme"] })}
          />
          <Row label="Key length">
            <Segmented
              size="sm"
              value={String(s.keyLen)}
              options={LENS.map((v, i) => [String(i), `${v} chars`] as [string, string])}
              onChange={(v) => set({ keyLen: Number(v) })}
            />
          </Row>
          <Row label="Links stored so far">
            <Segmented
              size="sm"
              value={String(s.links)}
              options={LINKS.map((v, i) => [String(i), human(v)] as [string, string])}
              onChange={(v) => set({ links: Number(v) })}
            />
          </Row>
          <p className="text-muted text-xs">{x.how}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Possible keys" value={human(N)} />
            <Stat label="Table full" value={`${((n / N) * 100).toPrecision(2)}%`} />
            <Stat
              label="Chance the next key clashes"
              value={collides ? `1 in ${human(1 / pNextCollides(n, N))}` : "never"}
              bad={collides && pNextCollides(n, N) > 1e-4}
            />
            <Stat
              label="Clashes so far (if unchecked)"
              value={collides ? human(expectedCollisions(n, N)) : "0"}
              bad={collides && expectedCollisions(n, N) >= 1}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="border-good/40 bg-good/10 rounded-xl border px-3 py-2 text-xs">
              {x.plus}
            </p>
            <p className="border-bad/40 bg-bad/10 rounded-xl border px-3 py-2 text-xs">{x.minus}</p>
          </div>
          {collides && (
            <p className="text-muted text-xs">
              With {human(n)} links, the chance that <em>some</em> two of them share a key is{" "}
              {chance(pAnyCollision(n, N))}, far higher than intuition suggests. That&apos;s the{" "}
              <Term id="birthday-paradox">birthday paradox</Term>: in a room of 23 people, two
              probably share a birthday.
            </p>
          )}
        </div>
      }
    >
      <p>
        Every link needs a unique short key. There are three classic ways to make one. Compare how
        they behave as the table fills up.
      </p>
      <p className="text-muted text-sm">
        Many real systems combine ideas: random or counter-based IDs, plus a uniqueness check in the
        database as the final safety net.
      </p>
    </StepLayout>
  );
}

function chance(p: number): string {
  if (p >= 0.999) return "over 99.9%";
  if (p < 0.001) return "under 0.1%";
  return `${(p * 100).toFixed(1)}%`;
}

/* 3 ─ Predict: key space ------------------------------------------------------------------------ */

export function PredictSpace() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="How many keys?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="keyspace"
            prompt="How many different 7-character base62 keys are there? (in trillions)"
            min={0}
            max={10}
            step={0.1}
            unit=" trillion"
            answer={3.5}
            tolerance={0.2}
            explanation="62⁷ ≈ 3.52 trillion. Six characters give 56.8 billion; each extra character multiplies by 62. Seven characters comfortably cover hundreds of billions of links."
          />
        </div>
      }
    >
      <p>Estimate before you compute; it builds intuition for how fast key spaces grow.</p>
    </StepLayout>
  );
}

/* 4 ─ Design it, then load-test it ⭐ -------------------------------------------------------------- */

const OPTIONS: { key: "store" | "cache" | "analytics"; label: string; opts: [string, string][] }[] =
  [
    {
      key: "store",
      label: "Where are links stored?",
      opts: [
        ["sql", "One SQL database"],
        ["kv", "Distributed key-value store"],
      ],
    },
    {
      key: "cache",
      label: "Cache in front?",
      opts: [
        ["none", "No cache"],
        ["redis", "In-memory cache"],
        ["cdn", "CDN edge"],
      ],
    },
    {
      key: "analytics",
      label: "Counting clicks",
      opts: [
        ["sync", "Write each click to the database"],
        ["async", "Send clicks to a stream"],
      ],
    },
  ];

export function LoadTest() {
  const [s, set] = useSceneState<UrlState>();
  const e = estimate(VOLUMES[s.perMonth], RATIOS[s.ratio], YEARS[s.years]);
  const r = useMemo(
    () => loadTest(e.peakReads, e.writes * 2, s.store, s.cache, s.analytics),
    [e.peakReads, e.writes, s.store, s.cache, s.analytics],
  );
  const load = Math.min(1.5, (r.dbReads + r.dbWrites * 3) / r.dbLimit);
  return (
    <StepLayout
      eyebrow="Build & test"
      title="Design it, then load-test it"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-muted text-xs">
            Testing at your peak from step 1: {human(e.peakReads)} redirects/s and{" "}
            {human(e.writes * 2)} new links/s.
          </p>
          {OPTIONS.map((o) => (
            <div key={o.key}>
              <p className="text-muted mb-1 text-xs">{o.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {o.opts.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => set({ [o.key]: id })}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs",
                      s[o.key] === id
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 text-[10px]">Database load</p>
            <div className="bg-surface-2 relative h-4 overflow-hidden rounded">
              <motion.div
                className={cn(
                  "absolute inset-y-0 left-0 rounded",
                  r.saturated ? "bg-bad/70" : "bg-viz-compute/60",
                )}
                initial={false}
                animate={{ width: `${Math.min(100, load * 100)}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Lookups reaching the DB /s" value={human(r.dbReads)} />
            <Stat
              label="Writes to the DB /s"
              value={human(r.dbWrites)}
              bad={s.analytics === "sync"}
            />
            <Stat label="Redirect p50" value={`${r.p50} ms`} />
            <Stat
              label="Redirect p99"
              value={r.saturated ? "timeouts" : `${r.p99} ms`}
              bad={r.saturated}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.ul
              key={`${s.store}${s.cache}${s.analytics}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "space-y-1 rounded-xl border px-4 py-3 text-sm",
                r.saturated ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
              )}
            >
              {r.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
              {!r.notes.length && <li>Holds up at this scale.</li>}
            </motion.ul>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Now the architecture. Pick a store, a cache and a way to count clicks, and run the load test
        at the scale you chose in step 1. Try the biggest scale, too.
      </p>
      <p className="text-muted text-sm">
        Capacities here are illustrative: roughly 20,000 lookups a second for one busy SQL primary,
        and far more for a key-value store spread over many machines.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: 301 or 302 ---------------------------------------------------------------------- */

export function Redirect() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="301 or 302?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="redirect"
            prompt="A redirect can be 'permanent' (301) or 'temporary' (302). Browsers may cache a 301 and skip your server next time. Brewline's marketing team wants a click count for every link. Which should the shortener return?"
            options={[
              {
                id: "302",
                label: "302, so every click comes back through the shortener and can be counted",
                correct: true,
                feedback:
                  "Right. A temporary redirect keeps the shortener in the path of each click, at the cost of more traffic to you.",
              },
              {
                id: "301",
                label: "301, because it's faster for repeat visitors",
                feedback:
                  "Faster, but repeat clicks may never reach you, so counts will be low. Fine if you don't need analytics.",
              },
              {
                id: "200",
                label: "A 200 page with a link to click",
                feedback:
                  "That adds a step for every user. Redirects exist so browsers follow them automatically.",
              },
              {
                id: "either",
                label: "It doesn't matter",
                feedback:
                  "It does: caching of permanent redirects decides whether you see repeat clicks.",
              },
            ]}
            explanation="301 and 308 are permanent and cacheable by default; 302 and 307 are temporary. Some shorteners (Bitly among them) send 301s but add headers limiting caching, which also works. Choose based on whether you need every click and whether a link's target may change."
          />
        </div>
      }
    >
      <p>A small HTTP detail with a big effect on your numbers.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Estimate first", "Reads outnumber writes 100 to 1: design for fast lookups."],
  [
    "Keys: pick your trade-off",
    "Hash, counter or random: collisions vs guessability vs coordination.",
  ],
  ["Cache the hot links", "A few links get most clicks; caches absorb them."],
  ["Keep analytics off the hot path", "Stream clicks and count them later."],
  ["Redirect codes matter", "Permanent redirects can hide clicks from you."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The same steps work for any design: requirements, estimates, core data model, then scale.
      </p>
      <p>Next: a news feed, where the hard part is writes that fan out to millions.</p>
    </StepLayout>
  );
}
