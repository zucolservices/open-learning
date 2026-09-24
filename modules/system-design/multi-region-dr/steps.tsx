"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FAIL_AT, drill, fmtMin } from "./drill";
import type { DrState } from "./state";

/* 1 ─ Four ways to be ready ⭐ ----------------------------------------------------------------------- */

type Box = { label: string; on: "full" | "small" | "off" | "data" };
const STRATS: Record<
  DrState["view"],
  { label: string; home: string; b: Box[]; rpo: string; rto: string; cost: number; text: string }
> = {
  backup: {
    label: "Backup & restore",
    home: "Photocopies of your documents, kept at a relative's house in another city.",
    b: [
      { label: "Servers", on: "off" },
      { label: "Database", on: "off" },
      { label: "Backups", on: "data" },
    ],
    rpo: "hours",
    rto: "hours",
    cost: 1,
    text: "Region B only stores backup copies. After a disaster you rebuild everything there and restore the data. Cheapest, slowest, and you lose everything since the last backup.",
  },
  pilot: {
    label: "Pilot light",
    home: "A second home with the gas pilot light on: the essentials are there, but the heating is off.",
    b: [
      { label: "Servers", on: "off" },
      { label: "Database", on: "full" },
      { label: "Images", on: "data" },
    ],
    rpo: "seconds–minutes",
    rto: "tens of minutes",
    cost: 2,
    text: "Data is replicated continuously to region B, and server images are ready, but no servers run. In a disaster you switch them on and scale up.",
  },
  warm: {
    label: "Warm standby",
    home: "A furnished second home with someone living in it, ready for the family to move in.",
    b: [
      { label: "Servers", on: "small" },
      { label: "Database", on: "full" },
      { label: "Images", on: "data" },
    ],
    rpo: "seconds",
    rto: "minutes",
    cost: 3,
    text: "A scaled-down but working copy runs in region B all the time. It can take traffic at once and scales up to full size.",
  },
  active: {
    label: "Active-active",
    home: "Living in two homes at once, splitting your week between them.",
    b: [
      { label: "Servers", on: "full" },
      { label: "Database", on: "full" },
      { label: "Images", on: "data" },
    ],
    rpo: "near zero",
    rto: "near zero",
    cost: 4,
    text: "Both regions serve users all the time. Losing one just shifts its users to the other. The most expensive and the hardest to build: your data must work across regions.",
  },
};

function RegionBox({ name, boxes, dead }: { name: string; boxes: Box[]; dead?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        dead ? "border-line bg-surface" : "border-line bg-surface",
      )}
    >
      <p className="text-muted mb-2 text-[10px] tracking-wide uppercase">{name}</p>
      <div className="grid gap-1.5">
        {boxes.map((b) => (
          <motion.div
            key={b.label}
            layout
            className={cn(
              "flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs",
              b.on === "full"
                ? "border-viz-compute/60 bg-viz-compute/15"
                : b.on === "small"
                  ? "border-viz-compute/40 bg-viz-compute/5"
                  : b.on === "data"
                    ? "border-viz-data/50 bg-viz-data/10"
                    : "border-line text-subtle border-dashed",
            )}
          >
            <span>{b.label}</span>
            <span className="text-muted text-[10px]">
              {b.on === "full"
                ? "running"
                : b.on === "small"
                  ? "small, running"
                  : b.on === "data"
                    ? "stored"
                    : "off"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FourWays() {
  const [s, set] = useSceneState<DrState>();
  const x = STRATS[s.view];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Four ways to be ready"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.view}
            options={(Object.keys(STRATS) as DrState["view"][]).map(
              (k) => [k, STRATS[k].label] as [string, string],
            )}
            onChange={(v) => set({ view: v as DrState["view"] })}
          />
          <p className="text-muted text-sm italic">{x.home}</p>
          <div className="grid grid-cols-2 gap-2">
            <RegionBox
              name="Region A (main)"
              boxes={[
                { label: "Servers", on: "full" },
                { label: "Database", on: "full" },
                { label: "Images", on: "data" },
              ]}
            />
            <RegionBox name="Region B (recovery)" boxes={x.b} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Data you could lose (RPO)" value={x.rpo} />
            <Stat label="Time to recover (RTO)" value={x.rto} />
            <Stat label="Running cost" value={"₹".repeat(x.cost)} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.view}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {x.text}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Cloud regions are far apart on purpose, so a flood, fire or power failure hits only one. But
        whole regions do go down. <Term id="disaster-recovery">Disaster recovery</Term> is the plan
        for that day.
      </p>
      <p>
        Two numbers describe a plan: the <Term id="rpo">RPO</Term>, how much recent data you could
        lose, and the <Term id="rto">RTO</Term>, how long you&apos;re down. Compare the four classic
        strategies.
      </p>
      <p className="text-muted text-sm">
        The rough RPO and RTO for each come from AWS&apos;s disaster recovery guidance; the same
        four strategies apply on any cloud.
      </p>
    </StepLayout>
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

/* 2 ─ Checkpoint: RPO or RTO? ----------------------------------------------------------------------- */

export function RpoOrRto() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="RPO or RTO?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="rpo-rto"
            prompt="Each requirement is about one of the two numbers. Which?"
            categories={[
              { id: "rpo", label: "RPO (data lost)" },
              { id: "rto", label: "RTO (time down)" },
            ]}
            items={[
              {
                id: "orders",
                label: "“We can't lose more than 5 minutes of orders.”",
                category: "rpo",
                why: "It limits how far back in time the recovered data may be.",
              },
              {
                id: "back",
                label: "“The shop must be back within an hour.”",
                category: "rto",
                why: "It limits how long the outage lasts.",
              },
              {
                id: "nightly",
                label: "Backups run once a night",
                category: "rpo",
                why: "Anything since the last backup is lost: an RPO of up to 24 hours.",
              },
              {
                id: "restore",
                label: "Restoring the database takes 3 hours",
                category: "rto",
                why: "Restore time is part of the downtime.",
              },
              {
                id: "sync",
                label: "Every write is confirmed in two regions before it succeeds",
                category: "rpo",
                why: "Nothing acknowledged can be lost: an RPO of zero (at the cost of slower writes).",
              },
              {
                id: "dns",
                label: "DNS answers are cached for 24 hours",
                category: "rto",
                why: "Users keep going to the dead region until caches expire.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        RPO looks backwards from the disaster (lost data); RTO looks forwards (time until
        you&apos;re back).
      </p>
    </StepLayout>
  );
}

/* 3 ─ The failover drill ⭐ ------------------------------------------------------------------------ */

const CHOICES: {
  key: "strategy" | "data" | "routing";
  label: string;
  opts: [string, string][];
}[] = [
  {
    key: "strategy",
    label: "What runs in region B?",
    opts: [
      ["backup", "Nothing (backup & restore)"],
      ["pilot", "Pilot light"],
      ["warm", "Warm standby"],
      ["active", "Active-active"],
    ],
  },
  {
    key: "data",
    label: "How does data get there?",
    opts: [
      ["backups", "Nightly backup copies"],
      ["replica", "Continuous replication"],
    ],
  },
  {
    key: "routing",
    label: "How do users find region B?",
    opts: [
      ["manual", "Someone edits DNS (24 h TTL)"],
      ["dns", "DNS failover with health checks"],
      ["global", "Global load balancer (one IP)"],
    ],
  },
];

export function Drill() {
  const [s, set] = useSceneState<DrState>();
  const data = s.strategy === "active" ? "replica" : s.data;
  const r = useMemo(() => drill(s.strategy, data, s.routing), [s.strategy, data, s.routing]);
  const shown = s.ran ? Math.min(s.shown, r.events.length) : 0;
  useEffect(() => {
    if (!s.ran || s.shown >= r.events.length) return;
    const id = setTimeout(() => set({ shown: s.shown + 1 }), 550);
    return () => clearTimeout(id);
  }, [s.ran, s.shown, r.events.length, set]);
  const done = s.ran && shown >= r.events.length;
  const choose = (k: string, v: string) => set({ [k]: v, ran: false, shown: 0 });
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The failover drill"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          {CHOICES.map((c) => (
            <div key={c.key}>
              <p className="text-muted mb-1 text-xs">{c.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {c.opts.map(([id, label]) => {
                  const disabled = c.key === "data" && s.strategy === "active" && id === "backups";
                  const on = (c.key === "data" ? data : s[c.key]) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={disabled}
                      onClick={() => choose(c.key, id)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs disabled:opacity-30",
                        on ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set({ ran: true, shown: 0 })}
            className="bg-bad text-bg self-start rounded-full px-4 py-1.5 text-xs font-medium"
          >
            {s.ran ? "Run the drill again" : `Region A goes dark at ${FAIL_AT}`}
          </button>
          <div className="border-line bg-surface min-h-40 rounded-xl border p-3">
            {!s.ran && (
              <p className="text-subtle text-xs">Make your choices, then pull the plug.</p>
            )}
            <ol className="space-y-1.5">
              <AnimatePresence initial={false}>
                {r.events.slice(0, shown).map((e, i) => (
                  <motion.li
                    key={`${i}${e.text}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 text-xs"
                  >
                    <span className="text-muted w-14 shrink-0 text-right font-mono">
                      +{fmtMin(e.at)}
                    </span>
                    <span
                      className={cn(
                        e.tone === "bad" && "text-bad",
                        e.tone === "good" && "text-good",
                      )}
                    >
                      {e.text}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </div>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              <Stat
                label="Back for most users (RTO)"
                value={fmtMin(r.rtoMin)}
                bad={r.rtoMin > 60}
              />
              <Stat
                label="Last users back"
                value={fmtMin(r.stragglersMin)}
                bad={r.stragglersMin > 120}
              />
              <Stat
                label="Data lost (RPO)"
                value={data === "replica" ? "~1 s" : "14 h"}
                bad={data !== "replica"}
              />
              <Stat
                label="Monthly cost vs one region"
                value={`${r.cost.toFixed(2)}×`}
                bad={r.cost > 2}
              />
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Your earlier decisions are made now, long before the disaster. Choose what runs in the
        recovery region, how data gets there and how users find it. Then pull the plug on the main
        region at {FAIL_AT} and watch the timeline.
      </p>
      <p>
        Try to get most users back within 10 minutes and lose no more than a few seconds of orders,
        then see what it costs.
      </p>
      <p className="text-muted text-sm">
        Timings are illustrative. Real drills find surprises: expired credentials in the recovery
        region, missing capacity, or scripts nobody has run in a year. That&apos;s why teams run
        them regularly.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Data residency ------------------------------------------------------------------------------- */

export function Residency() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where may the copy live?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="residency"
            prompt="An Indian payments company runs in Mumbai and wants a disaster recovery region. Its engineers suggest Singapore, the nearest large region outside India. What's the problem?"
            options={[
              {
                id: "rbi",
                label:
                  "RBI rules require payment system data to be stored only in India, so recovery must use another Indian region",
                correct: true,
                feedback:
                  "Right. Since 2018 the RBI has required payment data to be stored only in India. AWS, Azure and Google Cloud each have more than one region in India (for example Mumbai and Hyderabad, Pune and Chennai, Mumbai and Delhi).",
              },
              {
                id: "latency",
                label: "Singapore is too far away for replication",
                feedback:
                  "Latency to Singapore is manageable. The blocker here is legal, not technical.",
              },
              {
                id: "none",
                label: "No problem: DR copies don't count as storing data",
                feedback: "A replica or backup is stored data. Residency rules apply to it.",
              },
              {
                id: "cost",
                label: "Cross-border data transfer is too expensive",
                feedback:
                  "Transfer costs money, but the requirement to keep data in India rules it out first.",
              },
            ]}
            explanation="Data residency rules (such as the RBI's for payments, the EU's GDPR for transfers of personal data, and India's DPDP Act) constrain where replicas and backups may go. Check them before choosing a recovery region."
          />
        </div>
      }
    >
      <p>
        <Term id="data-residency">Data residency</Term> rules decide where data may be stored. They
        apply to backups and replicas too.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Landscape ----------------------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  [
    "Finding the healthy region",
    "AWS Route 53 failover (health checks every 30 s by default, 3 failures to trip) and Global Accelerator (two fixed anycast IPs); Azure Traffic Manager (DNS) and Front Door; Google Cloud's global load balancer (one anycast IP).",
  ],
  [
    "Databases across regions",
    "Aurora Global Database (replication typically under a second; planned switchover loses nothing, emergency failover can); DynamoDB global tables (multi-Region strong consistency since 2025, RPO zero); Spanner multi-region; Cosmos DB multi-region writes; Azure SQL failover groups.",
  ],
  [
    "Backups",
    "Copy backups to another region (and another account) automatically, and test restoring them: an untested backup is a hope, not a plan.",
  ],
  [
    "Practice",
    "Game days and chaos experiments (AWS Fault Injection Service, Azure Chaos Studio) rehearse failover before a real disaster does.",
  ],
];

export function Landscape() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Building blocks"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TOOLS.map(([t, d], i) => (
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
      <p>Every major cloud offers the same kinds of building blocks.</p>
      <p className="text-muted text-sm">
        AWS has 39 regions, Google Cloud 43 and Azure more than 70, each with several zones.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Regions do fail", "Plan for losing one entirely, not just a server or a zone."],
  ["RPO and RTO", "Data you can lose, time you can be down: agree both with the business."],
  ["Four strategies", "Backup, pilot light, warm standby, active-active: cheaper means slower."],
  ["Routing matters", "Long DNS caches can strand users on a dead region for hours."],
  ["Practise", "An untested recovery plan usually fails when you need it."],
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
      <p>You can only recover from what you notice.</p>
      <p>Next: observability and SLOs, how you see what your system is doing.</p>
    </StepLayout>
  );
}
