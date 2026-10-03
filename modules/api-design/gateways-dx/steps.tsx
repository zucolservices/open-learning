"use client";

import { motion } from "motion/react";
import { Building2, Check } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FEATURES, POLICIES, SERVICES, fmt, ttfc, type Feature, type Policy } from "./model";
import type { GwState } from "./state";

function Toggle({
  active,
  label,
  note,
  onClick,
}: {
  active: boolean;
  label: string;
  note?: string;
  onClick(): void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
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
        <span className="font-medium">{label}</span>
        {note && <span className="text-muted block text-[11px]">{note}</span>}
      </span>
    </button>
  );
}

/* 1 ─ The reception desk -------------------------------------------------------------------------- */

export function Reception() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The reception desk"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Building2 className="text-accent size-8" />
          <div className="grid w-full grid-cols-3 gap-2 text-center text-xs">
            {["Check badges", "Sign visitors in", "Point to the right floor"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="border-line bg-surface rounded-lg border px-2 py-2"
              >
                {t}
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-center text-xs">
            One desk at the entrance, so every office upstairs doesn&apos;t need its own guard.
          </p>
        </div>
      }
    >
      <p>
        An office building has one reception desk. It checks badges, signs visitors in, keeps a log
        and tells people which floor to go to. The offices upstairs get on with their work.
      </p>
      <p>
        An <Term id="api-gateway">API gateway</Term> is that desk for your APIs. Kong&apos;s
        definition: &ldquo;An API gateway is a reverse proxy that lets you manage, configure, and
        route requests to your APIs.&rdquo; But a building also needs good signs, or visitors never
        find the right door: that&apos;s <Term id="developer-experience">developer experience</Term>
        .
      </p>
    </StepLayout>
  );
}

/* 2 ─ Put up a gateway ⭐ ------------------------------------------------------------------------- */

export function BuildGateway() {
  const [s, set] = useSceneState<GwState>();
  const on = s.policies ?? [];
  const toggle = (p: Policy) =>
    set({ policies: on.includes(p) ? on.filter((x) => x !== p) : [...on, p] });
  const duplicated = (POLICIES.length - on.length) * SERVICES.length;
  return (
    <StepLayout
      eyebrow="Build"
      title="Put up a gateway"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {POLICIES.map((p) => (
              <Toggle
                key={p.id}
                active={on.includes(p.id)}
                label={p.label}
                onClick={() => toggle(p.id)}
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-1 text-xs">
              Clients
            </div>
            <span className="text-muted text-xs">↓</span>
            <motion.div
              layout
              className={cn(
                "w-full rounded-xl border-2 px-3 py-2",
                on.length ? "border-accent bg-accent-soft" : "border-line border-dashed",
              )}
            >
              <p className="text-xs font-semibold">Gateway</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {on.length === 0 && <span className="text-muted text-[11px]">nothing yet</span>}
                {POLICIES.filter((p) => on.includes(p.id)).map((p) => (
                  <span key={p.id} className="bg-surface rounded px-1.5 py-0.5 text-[10px]">
                    {p.label}
                  </span>
                ))}
              </div>
            </motion.div>
            <span className="text-muted text-xs">↓</span>
            <div className="grid w-full grid-cols-3 gap-2">
              {SERVICES.map((svc) => (
                <div key={svc} className="border-line bg-surface rounded-lg border px-2 py-2">
                  <p className="text-xs font-semibold">{svc}</p>
                  {POLICIES.filter((p) => !on.includes(p.id)).map((p) => (
                    <p key={p.id} className="text-bad text-[10px]">
                      + {p.label}
                    </p>
                  ))}
                  <p className="text-good text-[10px]">its own business logic</p>
                </div>
              ))}
            </div>
          </div>
          <p className={cn("text-sm", duplicated ? "text-muted" : "text-good")}>
            {duplicated
              ? `${duplicated} copies of the same plumbing across three teams, each slightly different.`
              : "Each team now writes only its own business logic; the shared rules live in one place."}
          </p>
        </div>
      }
    >
      <p>
        A parcel company runs three services. Without a gateway, every team builds the same
        plumbing: HTTPS, key checks, rate limits, logs. Move each concern into the gateway and watch
        the duplication disappear.
      </p>
      <p>
        One thing never moves: checking whether this caller may see <em>this</em> parcel. That
        depends on business data only the service has, as module 17 showed.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Time to first call ⭐ ----------------------------------------------------------------------- */

export function FirstCall() {
  const [s, set] = useSceneState<GwState>();
  const on = s.features ?? [];
  const toggle = (f: Feature) =>
    set({ features: on.includes(f) ? on.filter((x) => x !== f) : [...on, f] });
  const m = ttfc(on);
  const base = ttfc([]);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Time to first call"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <Toggle
                key={f.id}
                active={on.includes(f.id)}
                label={f.label}
                note={f.note}
                onClick={() => toggle(f.id)}
              />
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">
              A newcomer&apos;s time from landing on the docs to a first successful call
            </p>
            <motion.p
              key={m}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={cn(
                "font-mono text-3xl font-semibold",
                m < 30 ? "text-good" : m > 1440 ? "text-bad" : "",
              )}
            >
              {fmt(m)}
            </motion.p>
            <div className="bg-surface-2 mt-2 h-2 overflow-hidden rounded-full">
              <motion.div
                animate={{ width: `${Math.max(1, (Math.log10(m) / Math.log10(base)) * 100)}%` }}
                className="bg-accent/70 h-full rounded-full"
              />
            </div>
          </div>
          <p className="text-subtle text-[10px]">Illustrative timings (log scale bar).</p>
        </div>
      }
    >
      <p>
        Postman calls time to first call &ldquo;the most important API metric&rdquo;: how long a new
        developer takes to make one successful request. Every hour of confusion is a developer who
        might give up and pick a competitor.
      </p>
      <p>
        Postman found developers using a ready-made collection made their first call between 1.7 and
        56 times faster. Switch on portal features and see what moves the number most: usually the
        boring things, like getting a key without waiting.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Gateways, portals and agents ---------------------------------------------------------------- */

const LANDSCAPE: [string, string][] = [
  [
    "Managed gateways",
    "Amazon API Gateway, Azure API Management, Google Cloud's Apigee (full API management) and its lighter API Gateway.",
  ],
  [
    "Open source",
    "Kong Gateway, Tyk and Envoy Gateway, which implements Kubernetes' Gateway API (v1.0 in 2023; v1.6 in 2026).",
  ],
  [
    "Gateway or mesh?",
    "A gateway handles north-south traffic, from outside clients in; a service mesh handles east-west traffic between your own services.",
  ],
  [
    "Public platforms",
    "India's API Setu, run by MeitY, is “a unified digital platform” for discovering and integrating thousands of government and enterprise APIs.",
  ],
  [
    "AI agents as consumers",
    "Only 24% of developers in Postman's 2025 survey design APIs with AI agents in mind. The Model Context Protocol, now at the Linux Foundation's Agentic AI Foundation, is one way agents use APIs.",
  ],
];

export function Landscape() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Gateways, portals and agents"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {LANDSCAPE.map(([t, d], i) => (
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
        Every major cloud and several open-source projects offer gateways; the features overlap
        heavily. Choose on where your services run and what your team can operate.
      </p>
      <p>
        Developer experience is broader than any tool: a portal with reference docs generated from
        OpenAPI, guides written by people, a sandbox, and errors that explain themselves.
        Stripe&apos;s sandboxes, for instance, accept test keys and never process real payments.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Gateway or service? ------------------------------------------------------------------------- */

export function WhereItGoes() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Gateway or service?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="where-it-goes"
            prompt="Where does each job belong?"
            categories={[
              { id: "gw", label: "Gateway" },
              { id: "svc", label: "The service" },
            ]}
            items={[
              {
                id: "tls",
                label: "Terminate HTTPS",
                category: "gw",
                why: "Same for every service.",
              },
              {
                id: "key",
                label: "Reject requests with no valid API key",
                category: "gw",
                why: "A shared, early check.",
              },
              {
                id: "limit",
                label: "Limit each client to 100 requests a minute",
                category: "gw",
                why: "Counts across all services in one place.",
              },
              {
                id: "owner",
                label: "Check this parcel belongs to the caller",
                category: "svc",
                why: "Needs the parcel's data; only the service has it.",
              },
              {
                id: "price",
                label: "Calculate the delivery price",
                category: "svc",
                why: "Business logic.",
              },
              {
                id: "refund",
                label: "Decide whether a late parcel earns a refund",
                category: "svc",
                why: "Business rules belong with the business code.",
              },
            ]}
            explanation="Shared, mechanical concerns go in the gateway; anything that needs business data or rules stays in the service."
          />
        </div>
      }
    >
      <p>The desk checks badges. It doesn&apos;t decide your salary.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["A gateway centralises plumbing", "TLS, keys, limits, routing, logs."],
  ["Business rules stay in services", "Including object-level authorisation."],
  ["Measure time to first call", "Then shorten it."],
  ["Self-serve keys and sandboxes", "The biggest wins are often the simplest."],
  ["Design for every consumer", "People, partners, and now AI agents."],
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
      <p>Next, the capstone: design a parcel-tracking API, then live with it for a year.</p>
    </StepLayout>
  );
}
