"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EDGE_RTT_MS, ORIGIN, ROUND_TRIPS, USERS, cacheModel, project, rttMs } from "./model";
import type { CdnState } from "./state";

/* 1 ─ Far away is slow ⭐ ------------------------------------------------------------------------- */

export function FarAway() {
  const [s, set] = useSceneState<CdnState>();
  const o = project(ORIGIN);
  const u = USERS.find((x) => x.id === s.user) ?? USERS[0];
  const direct = rttMs(u, ORIGIN);
  const rtt = s.cdn ? EDGE_RTT_MS : direct;
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Far away is slow"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.cdn ? "cdn" : "origin"}
            options={[
              ["origin", "Everyone fetches from Mumbai"],
              ["cdn", "Files cached at the edge"],
            ]}
            onChange={(v) => set({ cdn: v === "cdn" })}
          />
          <div className="border-line bg-surface overflow-hidden rounded-xl border">
            <svg
              viewBox="20 20 320 120"
              className="w-full"
              role="img"
              aria-label="Users around the world and where they fetch from"
            >
              {Array.from({ length: 33 }, (_, i) =>
                Array.from({ length: 13 }, (_, j) => (
                  <circle
                    key={`${i}-${j}`}
                    cx={20 + i * 10}
                    cy={20 + j * 10}
                    r={0.5}
                    fill="var(--line-strong)"
                  />
                )),
              )}
              {USERS.map((c) => {
                const p = project(c);
                const active = c.id === s.user;
                return (
                  <g key={c.id} onClick={() => set({ user: c.id })} className="cursor-pointer">
                    {!s.cdn && (
                      <motion.line
                        x1={p.x}
                        y1={p.y}
                        x2={o.x}
                        y2={o.y}
                        stroke={active ? "var(--accent)" : "var(--line-strong)"}
                        strokeWidth={active ? 1.2 : 0.5}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                      />
                    )}
                    {s.cdn && (
                      <motion.circle
                        cx={p.x}
                        cy={p.y}
                        initial={{ r: 0 }}
                        animate={{ r: 5 }}
                        fill="var(--viz-meta)"
                        opacity={0.25}
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={active ? 2.6 : 2}
                      fill={active ? "var(--accent)" : "var(--viz-data)"}
                    />
                    <text
                      x={c.id === "che" ? p.x + 4 : p.x}
                      y={c.id === "che" ? p.y + 1.8 : p.y - 4}
                      textAnchor={c.id === "che" ? "start" : "middle"}
                      className={cn("text-[5px]", active ? "fill-fg" : "fill-muted")}
                    >
                      {c.name}
                    </text>
                  </g>
                );
              })}
              <rect x={o.x - 3} y={o.y - 3} width={6} height={6} fill="var(--viz-compute)" />
              <text
                x={o.x - 5}
                y={o.y + 1.8}
                textAnchor="end"
                className="fill-fg text-[5px] font-semibold"
              >
                Origin · Mumbai
              </text>
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">{u.name}: one round trip</p>
              <motion.p
                key={rtt}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-lg"
              >
                {rtt} ms
              </motion.p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Connect + fetch (≈{ROUND_TRIPS} round trips)</p>
              <motion.p
                key={rtt * ROUND_TRIPS}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-lg"
              >
                {rtt * ROUND_TRIPS} ms
              </motion.p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                s.cdn ? "border-good/40 bg-good/5" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Requests reaching Mumbai</p>
              <p className="font-mono text-sm sm:text-lg">
                {s.cdn ? "only misses" : "all of them"}
              </p>
            </div>
          </div>
          <p className="text-subtle text-xs">
            Click a city. Estimated from distance: light in fibre ≈ 200 km/ms, real routes ≈ 1.5×
            the straight line. An edge in the user&apos;s own city ≈ 5 ms.
          </p>
        </div>
      }
    >
      <p>
        A library keeps popular books in every neighbourhood branch, so nobody has to travel to the
        central library for the latest bestseller.
      </p>
      <p>
        A <Term id="cdn">content delivery network</Term> does the same with files: it keeps copies
        at <Term id="edge-location">edge locations</Term> in hundreds of cities, so a user in London
        gets Brewline&apos;s images from London, not Mumbai. Switch between the two and click around
        the world.
      </p>
      <p className="text-muted text-sm">
        Distance is a floor no amount of servers can beat. Only moving the data closer helps.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The hit ratio ⭐ ---------------------------------------------------------------------------- */

const TTLS = [10, 60, 3600, 86400];
const VARIANTS = [1, 5, 20];
const fmtTtl = (s: number) =>
  s < 60 ? `${s} s` : s < 3600 ? `${s / 60} min` : s < 86400 ? `${s / 3600} h` : `${s / 86400} day`;

export function HitRatio() {
  const [s, set] = useSceneState<CdnState>();
  const { ttl, variants, shield } = s;
  const r = useMemo(
    () =>
      cacheModel({
        objects: 20_000,
        reqPerSecPerEdge: 200,
        edges: 50,
        ttlS: TTLS[ttl],
        variants: VARIANTS[variants],
        shield,
      }),
    [ttl, variants, shield],
  );
  const originPct = (r.originReqs / r.total) * 100;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The hit ratio"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-40 text-xs">Keep copies for (TTL)</span>
            <Segmented
              size="sm"
              value={String(ttl)}
              options={TTLS.map((t, i) => [String(i), fmtTtl(t)] as [string, string])}
              onChange={(v) => set({ ttl: Number(v) })}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-40 text-xs">Versions of each URL</span>
            <Segmented
              size="sm"
              value={String(variants)}
              options={VARIANTS.map(
                (t, i) =>
                  [String(i), t === 1 ? "1 (clean)" : `${t} (tracking tags)`] as [string, string],
              )}
              onChange={(v) => set({ variants: Number(v) })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={shield}
              onChange={(e) => set({ shield: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Add a shield tier between the edges and the origin
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-3">
              <p className="text-muted text-[10px]">Served from the edge (hit ratio)</p>
              <motion.p
                key={r.hitRatio.toFixed(3)}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-2xl"
              >
                {(r.hitRatio * 100).toFixed(1)}%
              </motion.p>
              <div className="bg-surface-2 mt-2 h-2 overflow-hidden rounded-full">
                <motion.div
                  initial={false}
                  animate={{ width: `${r.hitRatio * 100}%` }}
                  className="bg-good h-full"
                />
              </div>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-3",
                originPct > 20 ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Requests reaching the origin</p>
              <motion.p
                key={r.originReqs.toFixed(0)}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-2xl"
              >
                {Math.round(r.originReqs).toLocaleString("en-US")}/s
              </motion.p>
              <p className="text-subtle text-[10px]">
                of {r.total.toLocaleString("en-US")}/s from users
              </p>
            </div>
          </div>
          <Code>
            {`Cache-Control: public, max-age=${TTLS[ttl]}${variants > 0 ? `\n# /menu.jpg?utm_source=… creates ${VARIANTS[variants]} separate cache keys` : ""}`}
          </Code>
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">How this model works</summary>
            <p className="mt-2">
              50 edges, 200 requests/s each, over 20,000 files with realistic popularity (a few are
              very popular; most are rarely asked for). A file stays cached for the TTL after a
              miss. A shield is one extra cache that all edges ask before the origin.
            </p>
          </details>
        </div>
      }
    >
      <p>
        A CDN only helps when the file is already there: a <em>hit</em>. The share of hits is the{" "}
        <Term id="hit-ratio">hit ratio</Term>, and every miss travels back to your origin.
      </p>
      <p>
        Three things move it: how long copies are kept (the TTL), whether the same file hides behind
        many different URLs (the cache key), and whether edges share a middle tier.
      </p>
      <p className="text-muted text-sm">
        Tracking tags like <code>?utm_source=</code> make one image look like many different files.
        Most CDNs let you drop them from the cache key.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Publishing a change ------------------------------------------------------------------------- */

const PUBLISH: Record<
  CdnState["publish"],
  { title: string; code: string; outcome: string; tone: "bad" | "neutral" | "good" }
> = {
  ttl: {
    title: "Just wait",
    code: "menu.css   Cache-Control: max-age=86400",
    outcome: "Users keep seeing yesterday's menu for up to a day, until each edge's copy expires.",
    tone: "bad",
  },
  purge: {
    title: "Invalidate (purge)",
    code: 'POST /invalidation  paths: ["/menu.css"]',
    outcome:
      "Edges drop their copies and refetch. Works, but takes time to spread, and some CDNs charge beyond a free allowance (CloudFront: 1,000 paths a month free).",
    tone: "neutral",
  },
  versioned: {
    title: "Versioned file names",
    code: "menu.3f9a2c.css   Cache-Control: max-age=31536000, immutable",
    outcome:
      "The new version has a new name, so it's fetched fresh everywhere at once. Old copies can stay cached forever: nobody asks for them any more.",
    tone: "good",
  },
};

export function Publishing() {
  const [s, set] = useSceneState<CdnState>();
  const p = PUBLISH[s.publish];
  return (
    <StepLayout
      eyebrow="The hard part"
      title="Publishing a change"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.publish}
            options={(Object.keys(PUBLISH) as CdnState["publish"][]).map(
              (k) => [k, PUBLISH[k].title] as [string, string],
            )}
            onChange={(v) => set({ publish: v as CdnState["publish"] })}
          />
          <Code>{p.code}</Code>
          <div className="grid grid-cols-4 gap-1.5">
            {["Mumbai", "London", "New York", "Sydney"].map((c, i) => {
              const fresh = s.publish === "versioned" || (s.publish === "purge" && i < 3);
              return (
                <motion.div
                  key={c + s.publish}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "rounded-lg border px-2 py-1.5 text-center text-[11px]",
                    fresh ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                  )}
                >
                  {c}
                  <span className="block text-[10px]">{fresh ? "new menu" : "old menu"}</span>
                </motion.div>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.publish}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                p.tone === "good"
                  ? "border-good/40 bg-good/10"
                  : p.tone === "bad"
                    ? "border-bad/40 bg-bad/10"
                    : "border-line bg-surface",
              )}
            >
              {p.outcome}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Brewline changes its menu&apos;s stylesheet. Hundreds of edges hold yesterday&apos;s copy.
        How do users get the new one?
      </p>
      <p className="text-muted text-sm">
        The usual answer for static files: put a fingerprint of the content in the file name, cache
        it for a year, and change the name whenever the content changes. Keep TTLs short (or use{" "}
        <code>stale-while-revalidate</code>) for things that must change in place.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What to cache ------------------------------------------------------------------------------- */

export function WhatToCache() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What should the CDN cache?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="what-to-cache"
            prompt="For each response, how should the CDN treat it?"
            categories={[
              { id: "long", label: "Cache for a long time" },
              { id: "short", label: "Cache briefly" },
              { id: "no", label: "Don't cache at the edge" },
            ]}
            items={[
              {
                id: "logo",
                label: "The Brewline logo, logo.8d2f1e.png",
                category: "long",
                why: "Versioned name: cache for a year.",
              },
              {
                id: "bundle",
                label: "The app's JavaScript bundle, app.3f9a2c.js",
                category: "long",
                why: "Fingerprinted: safe to cache forever.",
              },
              {
                id: "menu",
                label: "Today's public menu as JSON, the same for everyone",
                category: "short",
                why: "Shared by all users but changes: a minute or so.",
              },
              {
                id: "stores",
                label: "The list of open stores, updated every few minutes",
                category: "short",
                why: "Public but changing: a short TTL.",
              },
              {
                id: "cart",
                label: "Priya's shopping cart",
                category: "no",
                why: "Personal: mark it Cache-Control: private.",
              },
              {
                id: "account",
                label: "The account settings page",
                category: "no",
                why: "Personal data must never be served to someone else.",
              },
            ]}
            explanation="Public and unchanging: long TTL with versioned names. Public but changing: short TTL. Personal: private, never shared caches. Getting the last one wrong shows one user's data to another."
          />
        </div>
      }
    >
      <p>Not everything belongs in a shared cache.</p>
    </StepLayout>
  );
}

/* 5 ─ Providers and the edge ---------------------------------------------------------------------- */

const PROVIDERS: [string, string][] = [
  [
    "Amazon CloudFront",
    "750+ points of presence in 100+ cities, plus 1,140+ embedded in ISPs. CloudFront Functions and Lambda@Edge run code at the edge.",
  ],
  [
    "Cloudflare",
    "A network in 330+ cities; proxied sites share anycast addresses. Workers run code in lightweight V8 isolates.",
  ],
  ["Akamai", "4,300+ points of presence in about 700 cities and 130+ countries."],
  ["Fastly", "Fewer, larger points of presence; purges in about 150 ms. Compute runs WebAssembly."],
  [
    "Google Cloud CDN · Media CDN",
    "Cloud CDN sits behind Google's global load balancer; Media CDN is built for streaming and big downloads.",
  ],
  [
    "Azure Front Door",
    "Microsoft's global entry point and CDN. Classic Azure CDN from Microsoft retires on 30 September 2027.",
  ],
];

export function Providers() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="CDNs, and code at the edge"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {PROVIDERS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Modern CDNs do more than cache files. They terminate encryption, block attacks, and run
        small programs at the edge: rewriting requests, checking tokens, personalising pages close
        to the user.
      </p>
      <p className="text-muted text-sm">
        Providers count their networks differently (cities, points of presence, capacity), so treat
        the numbers as orders of magnitude, not a ranking. Figures as of September 2026.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ------------------------------------------------------------------------------ */

export function StaleCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The stubborn old version"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="stale-js"
            prompt="After every release, some users run the old app.js for hours, because it's cached for a day at the edge and in browsers. What's the lasting fix?"
            options={[
              {
                id: "hash",
                label:
                  "Put a content fingerprint in the file name (app.3f9a2c.js) and reference the new name in each release",
                correct: true,
                feedback:
                  "Right. New content, new URL: every cache fetches it immediately, and old names can stay cached forever.",
              },
              {
                id: "zero",
                label: "Set max-age to 0 on app.js",
                feedback:
                  "Every request would go to the origin: you'd lose most of the CDN's benefit for your biggest file.",
              },
              {
                id: "purge",
                label: "Purge the CDN after every release",
                feedback:
                  "It clears the CDN, but browsers keep their own copies for the full max-age.",
              },
              {
                id: "noCdn",
                label: "Stop serving JavaScript through the CDN",
                feedback: "Then everyone downloads it from far away, slowly.",
              },
            ]}
            explanation="Versioned file names make caching and freshness stop fighting: cache aggressively, change names to publish."
          />
        </div>
      }
    >
      <p>A problem every web team hits once.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Distance is latency", "Light takes time; only moving content closer beats it."],
  [
    "Hit ratio is everything",
    "Longer TTLs, clean cache keys and a shield tier keep traffic off the origin.",
  ],
  ["Version, don't purge", "Fingerprinted file names make caching and freshness friends."],
  ["Never cache the personal", "Private responses stay out of shared caches."],
  ["The edge runs code too", "Workers and edge functions handle logic near the user."],
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
      <p>That completes the stateless tier.</p>
      <p>Next chapter: caching inside your own system, and the problems it brings.</p>
    </StepLayout>
  );
}
