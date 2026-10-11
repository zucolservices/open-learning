"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HEADERS, RESOURCES, outcome, type Header } from "./model";
import type { CacheState } from "./state";

const TONE = { good: "text-good", ok: "text-muted", bad: "text-bad" } as const;

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Bakery() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The bakery, the corner shop and your cupboard"
      stage={
        <div className="flex flex-1 items-center justify-center gap-2 text-center text-xs">
          {[
            ["Central bakery", "the origin server", "far away"],
            ["Corner shop", "a CDN edge server", "down the road"],
            ["Your cupboard", "the browser cache", "right here"],
          ].map(([t, b, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex-1 rounded-xl border p-3",
                i === 2 ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
              <p className="text-subtle text-[10px]">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Bread from the central bakery is the freshest, but it&apos;s a long trip. The corner shop
        keeps some nearby; your cupboard is quickest of all. The trick is knowing how long each copy
        stays good, and which bread is personal and mustn&apos;t go on the shop shelf.
      </p>
      <p>
        Websites work the same way. Browsers and <Term id="cdn">CDNs</Term> keep copies, and the{" "}
        <Term id="cache-control">Cache-Control</Term> header tells them for how long and for whom.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Headers ⭐ ----------------------------------------------------------------------------------- */

export function Headers() {
  const [s, set] = useSceneState<CacheState>();
  const all = RESOURCES.every((r) => r.best.includes(s.headers[r.id]));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Set the cache header for each response"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {RESOURCES.map((r) => {
            const h = s.headers[r.id];
            const ok = r.best.includes(h);
            return (
              <div
                key={r.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  ok ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <p className="font-mono text-[11px] font-semibold">{r.path}</p>
                <p className="text-muted text-[10px]">{r.desc}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {HEADERS.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      aria-pressed={h === x.id}
                      onClick={() => set({ headers: { ...s.headers, [r.id]: x.id as Header } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-mono text-[10px]",
                        h === x.id ? "border-fg bg-surface-2" : "border-line text-muted",
                      )}
                    >
                      {x.value}
                    </button>
                  ))}
                </div>
                <div className="mt-1.5 grid gap-0.5 text-[10px]">
                  {(
                    [
                      ["Repeat visit", "repeat"],
                      ["After a deploy", "deploy"],
                      ["Another customer", "other"],
                    ] as const
                  ).map(([l, sc]) => {
                    const o = outcome(r.id, h, sc);
                    return (
                      <p key={sc} className="grid grid-cols-[6.5rem_1fr] gap-1">
                        <span className="text-subtle">{l}</span>
                        <span className={TONE[o.tone]}>{o.text}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {all && (
            <p className="text-good text-xs">
              Fast for repeat visits, fresh after deploys, and nobody sees anyone else&apos;s data.
            </p>
          )}
        </div>
      }
    >
      <p>
        Three responses from a café&apos;s site start with poor headers: the script downloads every
        time, the HTML goes stale after a deploy, and personal orders could be served to the wrong
        customer.
      </p>
      <p>Pick a header for each and read the three outcomes. Aim for all green.</p>
    </StepLayout>
  );
}

/* 3 ─ The header words ----------------------------------------------------------------------------- */

export function Words() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the words mean"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            ["max-age=N", "Fresh for N seconds; no need to ask the server."],
            ["s-maxage=N", "Like max-age, but only for shared caches such as CDNs."],
            [
              "no-cache",
              "May be stored, but must be checked with the server before each use. It does not mean “don't cache”.",
            ],
            ["no-store", "Never store a copy anywhere."],
            ["private", "Only the user's own browser may keep it; never a CDN."],
            [
              "stale-while-revalidate",
              "Serve the old copy while fetching a fresh one in the background (RFC 5861, 2010).",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-mono font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        When a cached copy needs checking, the browser sends the version tag (ETag) it has; if
        nothing changed, the server replies 304 Not Modified with no body, which is cheap.
      </p>
      <p>
        immutable is supported by Firefox and Safari but not Chrome; with hashed file names, a long
        max-age does the job anyway.
      </p>
    </StepLayout>
  );
}

/* 4 ─ CDNs differ ---------------------------------------------------------------------------------- */

export function Cdns() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="CDNs don't all behave alike"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Cloudflare", "Doesn't cache HTML or JSON by default; only common static file types."],
            ["CloudFront", "With a minimum TTL above zero, it caches even no-store responses."],
            ["Azure Front Door", "Won't cache private, no-cache or no-store responses at all."],
            ["Google Cloud CDN", "Supports stale-while-revalidate but not stale-if-error."],
            ["Fastly, Akamai", "Fine-grained control with surrogate headers and edge code."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The standard (RFC 9111) is shared, but each CDN adds defaults and quirks. Read your
        provider&apos;s caching page before you rely on a header, and test what&apos;s actually
        cached.
      </p>
      <p>
        Edge functions let code run in CDN locations too, though some frameworks now steer back to
        regular Node.js servers for reliability; Next.js 16 replaced edge middleware with a Node.js
        proxy file.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CacheCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe to share?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-caching"
            prompt="Could a CDN safely store each response and serve it to everyone?"
            categories={[
              { id: "share", label: "Safe to share" },
              { id: "private", label: "Never share" },
            ]}
            items={[
              {
                id: "logo",
                label: "The site's logo image",
                category: "share",
                why: "Same for everyone.",
              },
              {
                id: "basket",
                label: "A signed-in user's basket",
                category: "private",
                why: "Personal.",
              },
              {
                id: "css",
                label: "A hashed stylesheet",
                category: "share",
                why: "Public and versioned.",
              },
              {
                id: "profile",
                label: "The account settings page",
                category: "private",
                why: "Personal data.",
              },
              {
                id: "menu",
                label: "Today's public café menu",
                category: "share",
                why: "Same for everyone; keep the TTL short.",
              },
            ]}
            explanation="Anything personal must be private or no-store. Public, versioned files can be cached for a long time; public pages that change need short lifetimes or revalidation."
          />
        </div>
      }
    >
      <p>Sort each response.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Hashed files: cache forever", "New name each deploy."],
        ["HTML: revalidate", "no-cache with an ETag."],
        ["Personal data: private", "Never on a CDN."],
        ["no-cache isn't no-store", "Check, don't skip."],
        ["Know your CDN", "Defaults and quirks differ."],
      ]}
    >
      <p>That ends the rendering chapter. Next: measuring what users actually feel.</p>
    </WrapStep>
  );
}
