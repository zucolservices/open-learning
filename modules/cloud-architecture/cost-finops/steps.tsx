"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, Plane, Ticket, Car } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HOURS, RATE, inr, usd } from "./prices";
import type { Buy, CostState } from "./state";

/* 1 ─ Meter, pass or standby --------------------------------------------------------------------- */

const WAYS: [typeof Car, string, string, string][] = [
  [
    Car,
    "The taxi meter",
    "Pay for every kilometre, go anywhere, any time. The most per trip.",
    "On-demand",
  ],
  [
    Ticket,
    "A monthly train pass",
    "Much cheaper per trip, but you pay for the month whether you travel or not.",
    "Commitment",
  ],
  [Plane, "A standby seat", "Very cheap, but you might be bumped at the gate.", "Spot"],
];

export function Travel() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Meter, pass or standby"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {WAYS.map(([Icon, t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-start gap-3 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">
                  {t} <span className="text-muted text-xs font-normal">· {k}</span>
                </p>
                <p className="text-muted mt-0.5 text-sm">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A commuter in Mumbai can take a taxi, buy a monthly pass, or gamble on a cheap standby seat.
        Cloud servers are sold the same three ways: <Term id="on-demand">on-demand</Term>, with a{" "}
        <Term id="commitment-discount">commitment</Term>, or as <Term id="spot-capacity">spot</Term>{" "}
        capacity the cloud can take back.
      </p>
      <p>
        The cloud&apos;s promise was paying only for what you use (module 1). The catch: it&apos;s
        just as easy to pay for what you don&apos;t use. Flexera&apos;s 2026 survey estimates 29% of
        cloud spend is wasted.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Price the workload ⭐ ------------------------------------------------------------------------ */

const BUYS: [Buy, string][] = [
  ["od", "On-demand"],
  ["sp1", "1-yr plan"],
  ["sp3", "3-yr plan"],
  ["spot", "Spot"],
];

const PARTS: {
  id: string;
  name: string;
  servers: number;
  hours: number;
  desc: string;
  spotOk: boolean;
}[] = [
  {
    id: "web",
    name: "Always-on web servers",
    servers: 6,
    hours: HOURS,
    desc: "6 servers, 24 × 7",
    spotOk: false,
  },
  {
    id: "peak",
    name: "Office-hours extra capacity",
    servers: 4,
    hours: 220,
    desc: "4 more servers, 10 h a day on 22 working days",
    spotOk: false,
  },
  {
    id: "batch",
    name: "Nightly report jobs",
    servers: 8,
    hours: 120,
    desc: "8 servers, 4 h a night; a job can restart if interrupted",
    spotOk: true,
  },
];

function partCost(servers: number, hours: number, b: Buy) {
  // Commitments are billed for every hour of the month, used or not.
  const billed = b === "sp1" || b === "sp3" ? HOURS : hours;
  return servers * billed * RATE[b];
}

function partNote(
  p: (typeof PARTS)[number],
  b: Buy,
): [tone: "good" | "warn" | "bad", text: string] {
  const committed = b === "sp1" || b === "sp3";
  if (b === "spot" && !p.spotOk)
    return [
      "bad",
      "Spot can be taken back with 2 minutes' warning (this type: 15–20% interruption band). Not for users who need a reply.",
    ];
  if (b === "spot") return ["good", "Ideal: interruptible jobs on spare capacity."];
  if (committed && p.hours < HOURS)
    return [
      "bad",
      `You pay for all ${HOURS} hours but use ${p.hours}: the pass costs more than the taxi.`,
    ];
  if (committed) return ["good", "Steady 24 × 7 use is exactly what commitments are for."];
  if (p.hours === HOURS)
    return ["warn", "Fine, but you're paying the meter for a commute you make every day."];
  return ["good", "On-demand suits a few hours a day."];
}

export function PriceIt() {
  const [s, set] = useSceneState<CostState>();
  const total = PARTS.reduce((t, p) => t + partCost(p.servers, p.hours, s.buys[p.id] ?? "od"), 0);
  const base = PARTS.reduce((t, p) => t + partCost(p.servers, p.hours, "od"), 0);
  return (
    <StepLayout
      eyebrow="Simulation · m7g.large, AWS Mumbai, 2 Oct 2026"
      title="Price the workload"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PARTS.map((p) => {
            const b = s.buys[p.id] ?? "od";
            const [tone, note] = partNote(p, b);
            return (
              <div key={p.id} className="border-line bg-surface rounded-xl border px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="font-mono text-xs">{usd(partCost(p.servers, p.hours, b))}/mo</p>
                </div>
                <p className="text-muted text-[11px]">{p.desc}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {BUYS.map(([k, n]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => set({ buys: { ...s.buys, [p.id]: k } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        b === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    tone === "good" ? "text-good" : tone === "bad" ? "text-bad" : "text-muted",
                  )}
                >
                  {note}
                </p>
              </div>
            );
          })}
          <div className="bg-surface-2 flex items-baseline justify-between rounded-lg px-3 py-2 text-sm">
            <span>Monthly compute</span>
            <span className="font-mono font-semibold">
              {usd(total)} <span className="text-muted font-normal">≈ {inr(total)}</span>
              {total < base - 1 && (
                <span className="text-good font-normal">
                  {" "}
                  (−{Math.round((1 - total / base) * 100)}%)
                </span>
              )}
              {total > base + 1 && (
                <span className="text-bad font-normal">
                  {" "}
                  (+{Math.round((total / base - 1) * 100)}%)
                </span>
              )}
            </span>
          </div>
          <p className="text-muted text-[10px]">
            Per hour: on-demand ${RATE.od}, 1-yr Compute Savings Plan ${RATE.sp1}, 3-yr ${RATE.sp3},
            spot ${RATE.spot} (that day). Prices before 18% GST.
          </p>
        </div>
      }
    >
      <p>
        A department runs three kinds of work on the same server type. Everything starts on-demand.
        Choose how to buy each part and watch the bill. Try a plan for the office-hours servers.
      </p>
      <p>
        AWS advertises up to 72% off with Savings Plans and up to 90% with spot; Azure Reservations
        and Google committed-use discounts are similar, and Google gives some automatic discounts
        for sustained use. The rule: commit to your steady floor, use on-demand above it, spot for
        work that can be interrupted.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Find the waste ⭐ ---------------------------------------------------------------------------- */

const LINES: {
  id: string;
  item: string;
  cost: number;
  fix: string;
  saving: number;
  waste: boolean;
}[] = [
  {
    id: "prod",
    item: "EC2 · 6 production servers, on-demand",
    cost: 255.4,
    fix: "Cover the steady floor with a 3-year Savings Plan",
    saving: 127,
    waste: true,
  },
  {
    id: "dev",
    item: "EC2 · 10 dev and test servers running 24 × 7",
    cost: 425.6,
    fix: "Stop them nights and weekends (≈ 50 h a week)",
    saving: 299,
    waste: true,
  },
  {
    id: "disks",
    item: "EBS · 2 TB of gp2 disks attached to nothing",
    cost: 228,
    fix: "Snapshot if needed, then delete",
    saving: 228,
    waste: true,
  },
  {
    id: "snaps",
    item: "EBS · 5 TB of snapshots over a year old",
    cost: 250,
    fix: "Move to the archive tier ($0.0125/GB)",
    saving: 187.5,
    waste: true,
  },
  {
    id: "alb",
    item: "Load balancer with no targets",
    cost: 17.45,
    fix: "Delete it",
    saving: 17.45,
    waste: true,
  },
  {
    id: "ips",
    item: "12 public IPv4 addresses nobody uses",
    cost: 43.8,
    fix: "Release them ($0.005 an hour each)",
    saving: 43.8,
    waste: true,
  },
  {
    id: "nat",
    item: "NAT gateway · 3 TB processed, all to S3",
    cost: 208.9,
    fix: "Add a free S3 gateway endpoint (module 6)",
    saving: 168,
    waste: true,
  },
  {
    id: "egress",
    item: "Data transfer · 8 TB to citizens downloading forms",
    cost: 863.5,
    fix: "Not waste: real users. A CDN can trim it (module 8)",
    saving: 0,
    waste: false,
  },
];

export function FindWaste() {
  const [s, set] = useSceneState<CostState>();
  const fixed = s.fixed ?? [];
  const total = LINES.reduce((t, l) => t + l.cost, 0);
  const saved = LINES.filter((l) => fixed.includes(l.id)).reduce((t, l) => t + l.saving, 0);
  const toggle = (id: string) =>
    set({ fixed: fixed.includes(id) ? fixed.filter((x) => x !== id) : [...fixed, id] });
  return (
    <StepLayout
      eyebrow="Simulation · a real-shaped bill, Mumbai prices"
      title="Find the waste"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {LINES.map((l) => {
            const on = fixed.includes(l.id);
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => toggle(l.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left",
                  on
                    ? l.waste
                      ? "border-good/50 bg-good/10"
                      : "border-line bg-surface-2"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className={cn(on && l.waste && "line-through opacity-60")}>{l.item}</span>
                  <span className="shrink-0 font-mono">{usd(on ? l.cost - l.saving : l.cost)}</span>
                </div>
                {on && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "mt-0.5 flex items-center gap-1 text-[11px]",
                      l.waste ? "text-good" : "text-muted",
                    )}
                  >
                    {l.waste ? <Check className="size-3" /> : <AlertTriangle className="size-3" />}
                    {l.fix}
                    {l.saving > 0 && ` · saves ${usd(l.saving)}`}
                  </motion.p>
                )}
              </button>
            );
          })}
          <div className="bg-surface-2 flex items-baseline justify-between rounded-lg px-3 py-2 text-sm">
            <span>Monthly bill</span>
            <span className="font-mono font-semibold">
              {usd(total - saved)} <span className="text-muted font-normal">of {usd(total)}</span>
              {saved > 0 && (
                <span className="text-good font-normal">
                  {" "}
                  (−{Math.round((saved / total) * 100)}%)
                </span>
              )}
            </span>
          </div>
        </div>
      }
    >
      <p>
        This is the shape of a typical bill. Click each line you suspect, to see the fix and what it
        saves. One line is real usage, not waste.
      </p>
      <p>
        The usual suspects: things left running, things left behind (disks, snapshots, addresses),
        and data moving the expensive way. AWS Compute Optimizer, Azure Advisor and Google&apos;s
        Recommender find many of them automatically. Bills can also explode: one start-up ran up
        about $72,000 on Google Cloud during a test, with a runaway scraper, against a $7 budget;
        Google waived it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who spent it? -------------------------------------------------------------------------------- */

const TEAMS: { name: string; tagged: number; share: number }[] = [
  { name: "Tax portal", tagged: 1100, share: 300 },
  { name: "Land records", tagged: 700, share: 200 },
  { name: "Data team", tagged: 400, share: 300 },
];
const UNTAGGED = 800;

export function ShowIt() {
  const [s, set] = useSceneState<CostState>();
  const rows = [
    ...TEAMS.map((t) => ({ name: t.name, v: t.tagged + (s.tagged ? t.share : 0) })),
    ...(s.tagged ? [] : [{ name: "Untagged", v: UNTAGGED }]),
  ];
  const max = Math.max(...rows.map((r) => r.v));
  return (
    <StepLayout
      eyebrow="Simulation · illustrative"
      title="Who spent it?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.tagged}
              onChange={(e) => set({ tagged: e.target.checked })}
              className="accent-accent"
            />
            Require a cost-centre tag on everything (module 12) and backfill it
          </label>
          <div className="flex flex-col gap-1.5">
            {rows.map((r) => (
              <div key={r.name} className="flex items-center gap-2 text-xs">
                <span className="w-24 shrink-0">{r.name}</span>
                <div className="bg-surface-2 h-5 flex-1 overflow-hidden rounded">
                  <motion.div
                    animate={{ width: `${(r.v / max) * 100}%` }}
                    className={cn(
                      "h-full rounded",
                      r.name === "Untagged" ? "bg-bad/50" : "bg-accent",
                    )}
                  />
                </div>
                <span className="w-14 text-right font-mono">{usd(r.v)}</span>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            {s.tagged
              ? "Every dollar has an owner. The data team learns it spends nearly twice what it thought."
              : "A quarter of the bill belongs to nobody, so nobody acts on it."}
          </p>
          <div className="grid gap-1.5 text-[11px] sm:grid-cols-2">
            <p className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
              <span className="font-semibold">Showback:</span> show each team its costs.
            </p>
            <p className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
              <span className="font-semibold">Chargeback:</span> bill each team&apos;s budget for
              them.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Costs only fall when the people who cause them can see them. That needs tags (or labels) on
        every resource, and on AWS the tags must be activated for billing, which can take a day;
        since 2024 they can be backfilled for up to 12 months.
      </p>
      <p>
        This is the heart of <Term id="finops">FinOps</Term>: engineering, finance and business
        sharing responsibility for spend, in three phases (Inform, Optimize, Operate). Budgets and
        anomaly alerts warn you; most don&apos;t stop spending on their own. Billing data now comes
        in a common format, FOCUS, from all three clouds.
      </p>
    </StepLayout>
  );
}

/* 5 ─ How would you buy it? ---------------------------------------------------------------------- */

export function HowToBuy() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How would you buy it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="how-to-buy"
            prompt="Pick the cheapest sensible way to buy capacity for each."
            categories={[
              { id: "od", label: "On-demand" },
              { id: "commit", label: "Commitment" },
              { id: "spot", label: "Spot" },
            ]}
            items={[
              {
                id: "db",
                label: "A production database that has run 24 × 7 for two years",
                category: "commit",
                why: "Steady and long-lived: commit.",
              },
              {
                id: "render",
                label: "Thousands of video-encoding jobs that can restart",
                category: "spot",
                why: "Interruptible, flexible work on spare capacity.",
              },
              {
                id: "launch",
                label: "A new service whose traffic nobody can predict yet",
                category: "od",
                why: "Don't commit until you know the floor.",
              },
              {
                id: "ci",
                label: "Test runners for the CI pipeline, retried on failure",
                category: "spot",
                why: "Short, retryable jobs suit spot.",
              },
              {
                id: "event",
                label: "Extra servers for a three-day exam-results surge",
                category: "od",
                why: "Short spikes: pay the meter.",
              },
              {
                id: "core",
                label: "The always-on minimum of a web fleet that autoscales above it",
                category: "commit",
                why: "Commit to the floor; scale above it on-demand.",
              },
            ]}
            explanation="Commit to the floor, pay the meter for the peaks, and put interruptible work on spot."
          />
        </div>
      }
    >
      <p>Six workloads to buy for.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Three ways to buy", "On-demand, commitments for the floor, spot for interruptible work."],
  ["Commitments bill every hour", "Used or not: size them to the steady minimum."],
  ["Waste hides in leftovers", "Idle servers, orphaned disks, NAT and egress paths."],
  ["Make it visible", "Tags, showback, budgets and anomaly alerts."],
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
        In India, AWS India invoices in rupees and adds 18% GST. Next: the frameworks that pull
        cost, reliability, security and the rest into one review.
      </p>
    </StepLayout>
  );
}
