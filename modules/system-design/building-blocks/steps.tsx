"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BLOCKS, GROUPS, type Platform } from "./blocks";
import type { BlocksState } from "./state";

const PLATFORMS: [Platform, string][] = [
  ["concept", "Concept"],
  ["aws", "AWS"],
  ["gcp", "Google Cloud"],
  ["azure", "Azure"],
  ["oss", "Open source"],
];

/* 1 ─ One diagram, four languages ⭐ ---------------------------------------------------------------- */

export function Rosetta() {
  const [s, set] = useSceneState<BlocksState>();
  const picked = BLOCKS.find((b) => b.id === s.picked);
  const label = (b: (typeof BLOCKS)[number]) =>
    s.platform === "concept" ? b.concept : b[s.platform];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="One diagram, four languages"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.platform}
            options={PLATFORMS}
            onChange={(v) => set({ platform: v as Platform })}
          />
          <div className="grid gap-2">
            {GROUPS.map((g) => (
              <div key={g} className="border-line bg-surface rounded-xl border p-2">
                <p className="text-muted mb-1.5 text-[10px] tracking-wide uppercase">{g}</p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {BLOCKS.filter((b) => b.group === g).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => set({ picked: b.id })}
                      className={cn(
                        "min-h-12 rounded-lg border px-2 py-1.5 text-left transition",
                        s.picked === b.id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      <p className="text-subtle text-[9px]">{b.concept}</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`${b.id}${s.platform}`}
                          initial={{ opacity: 0, rotateX: 60 }}
                          animate={{ opacity: 1, rotateX: 0 }}
                          exit={{ opacity: 0, rotateX: -60 }}
                          transition={{ duration: 0.25 }}
                          className="text-xs leading-tight font-medium"
                        >
                          {s.platform === "concept" ? b.what : label(b)}
                        </motion.p>
                      </AnimatePresence>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {picked && (
              <motion.div
                key={picked.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border-accent/40 bg-accent-soft rounded-xl border px-4 py-3"
              >
                <p className="text-sm font-semibold">{picked.concept}</p>
                <p className="text-muted text-xs">{picked.what}</p>
                <dl className="mt-2 grid grid-cols-[6rem_1fr] gap-x-2 gap-y-0.5 text-xs">
                  {PLATFORMS.slice(1).map(([k, name]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{name}</dt>
                      <dd>{picked[k as Exclude<Platform, "concept">]}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Travellers learn that &ldquo;bread&rdquo;, &ldquo;pain&rdquo; and &ldquo;roti&rdquo; name
        similar things. Clouds are the same: nearly every building block you&apos;ve met in this
        track exists on each platform under a different name.
      </p>
      <p>
        Switch the platform to relabel the whole architecture, and click any block to compare all
        four at once.
      </p>
      <p className="text-muted text-sm">
        Equivalents are close, not identical: limits, pricing and features differ. The concepts
        transfer; the details you look up.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Checkpoint: translate ----------------------------------------------------------------------- */

export function Translate() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Translate the diagram"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="translate"
            prompt="A colleague's diagram uses services you don't know. Which building block is each?"
            categories={[
              { id: "queue", label: "Queue" },
              { id: "object", label: "Object storage" },
              { id: "cache", label: "Cache" },
              { id: "containers", label: "Containers" },
            ]}
            items={[
              {
                id: "sb",
                label: "Azure Service Bus",
                category: "queue",
                why: "Azure's message queue (with topics too).",
              },
              {
                id: "gcs",
                label: "Google Cloud Storage",
                category: "object",
                why: "Google's object store, like S3.",
              },
              {
                id: "ec",
                label: "Amazon ElastiCache",
                category: "cache",
                why: "AWS's managed Valkey, Redis and Memcached.",
              },
              { id: "gke", label: "GKE", category: "containers", why: "Google Kubernetes Engine." },
              { id: "sqs", label: "Amazon SQS", category: "queue", why: "Simple Queue Service." },
              {
                id: "blob",
                label: "Azure Blob Storage",
                category: "object",
                why: "Azure's object store.",
              },
              {
                id: "ms",
                label: "Memorystore",
                category: "cache",
                why: "Google's managed Valkey and Redis.",
              },
              { id: "aks", label: "AKS", category: "containers", why: "Azure Kubernetes Service." },
            ]}
          />
        </div>
      }
    >
      <p>Reading other people&apos;s architecture diagrams is half the job.</p>
    </StepLayout>
  );
}

/* 3 ─ Who does what? ⭐ ---------------------------------------------------------------------------- */

type Who = "you" | "cloud" | "shared";
const TASKS: [string, Who, Who, Who][] = [
  ["Buy, power and replace hardware", "cloud", "cloud", "cloud"],
  ["Patch the operating system", "you", "cloud", "cloud"],
  ["Install and upgrade the database", "you", "shared", "cloud"],
  ["Take and test backups", "you", "shared", "cloud"],
  ["Fail over when a machine dies", "you", "cloud", "cloud"],
  ["Add capacity as you grow", "you", "shared", "cloud"],
  ["Design tables and queries", "you", "you", "you"],
  ["Control who can see the data", "you", "you", "you"],
  ["Watch the bill", "you", "you", "you"],
];

const MODELS: Record<BlocksState["model"], { label: string; text: string }> = {
  vm: {
    label: "Run it yourself on VMs",
    text: "Full control and no service markup, but your team does the undifferentiated work: patching, backups, failover. Worth it for special needs or very large scale.",
  },
  managed: {
    label: "Managed service",
    text: "The provider handles the machinery; you still choose sizes, maintenance windows and retention. The usual default for teams that want to ship products.",
  },
  serverless: {
    label: "Serverless",
    text: "Capacity follows demand and there's nothing to size. The trade: less control, per-request pricing that can surprise you at scale, and service-specific limits.",
  },
};

export function WhoDoesWhat() {
  const [s, set] = useSceneState<BlocksState>();
  const col = s.model === "vm" ? 1 : s.model === "managed" ? 2 : 3;
  const yours = TASKS.filter((t) => t[col] === "you").length;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who does what?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.model}
            options={(Object.keys(MODELS) as BlocksState["model"][]).map(
              (k) => [k, MODELS[k].label] as [string, string],
            )}
            onChange={(v) => set({ model: v as BlocksState["model"] })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="grid gap-1">
              {TASKS.map((t) => {
                const who = t[col] as Who;
                return (
                  <div key={t[0]} className="flex items-center justify-between gap-3 text-xs">
                    <span>{t[0]}</span>
                    <motion.span
                      key={`${t[0]}${who}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        who === "you"
                          ? "bg-viz-compute/20"
                          : who === "shared"
                            ? "bg-viz-meta/20"
                            : "bg-good/15",
                      )}
                    >
                      {who === "you"
                        ? "your team"
                        : who === "shared"
                          ? "you choose, cloud does"
                          : "the provider"}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
            <span className="font-semibold">
              {yours} of {TASKS.length} tasks are yours.
            </span>{" "}
            {MODELS[s.model].text}
          </p>
        </div>
      }
    >
      <p>
        Take a database. You can run it yourself on virtual machines, use a{" "}
        <Term id="managed-service">managed service</Term>, or go serverless. Compare what&apos;s
        left for your team in each case.
      </p>
      <p className="text-muted text-sm">
        Clouds call this the shared responsibility model. Some things never move: your data, who can
        see it, and your bill.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: lock-in ------------------------------------------------------------------------- */

export function LockIn() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How locked in are you?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="lock-in"
            prompt="Brewline wants the freedom to move clouds one day, without giving up managed services now. Which approach helps most?"
            options={[
              {
                id: "open",
                label:
                  "Prefer managed services that speak open interfaces: PostgreSQL, the Kafka protocol, S3-compatible storage, Kubernetes, OpenTelemetry",
                correct: true,
                feedback:
                  "Right. You get managed convenience, and your code talks to standard interfaces that other platforms also offer.",
              },
              {
                id: "vms",
                label: "Run everything yourself on plain VMs",
                feedback:
                  "Portable, but you pay for it every day in operations work. Most teams can't afford that trade.",
              },
              {
                id: "multi",
                label: "Run every service on two clouds at once",
                feedback:
                  "Very expensive and complex; you'd build to the lowest common denominator. Rarely worth it.",
              },
              {
                id: "ignore",
                label: "Lock-in doesn't matter",
                feedback:
                  "It can matter (pricing, regulation, acquisitions), but it's a trade-off, not an absolute evil: proprietary services can save a lot of work.",
              },
            ]}
            explanation="Lock-in is a cost to weigh, not a sin. Use open interfaces where they're cheap to keep, and accept deeper lock-in where a proprietary service saves you a lot."
          />
        </div>
      }
    >
      <p>
        Every managed service ties you to its provider a little: that&apos;s{" "}
        <Term id="vendor-lock-in">lock-in</Term>. Licences matter too: several popular open-source
        projects (Terraform, Vault, Redis, Elasticsearch) changed licences in recent years,
        prompting community forks such as OpenTofu, OpenBao and Valkey.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Same blocks, different names", "Learn the concept once; map it to any platform."],
  ["Close, not identical", "Check limits, pricing and guarantees for the one you pick."],
  [
    "Managed by default",
    "Hand undifferentiated work to the provider; keep the parts only you can do.",
  ],
  ["Open interfaces keep options open", "PostgreSQL, Kafka, S3 APIs, Kubernetes, OpenTelemetry."],
  ["Watch the licences", "Open-source terms change; forks follow."],
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
      <p>You now have the whole toolbox, in every dialect.</p>
      <p>Next: the first capstone, a results-day portal that must survive a hundredfold surge.</p>
    </StepLayout>
  );
}
