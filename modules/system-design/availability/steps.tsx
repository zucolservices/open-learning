"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ZONE, downtimeMin, humanDowntime, pct, tierAvailability, type Tier } from "./model";
import type { AvailState } from "./state";

/* 1 ─ How many nines? ⭐ ---------------------------------------------------------------------------- */

const LEVELS: { a: number; label: string; feel: string }[] = [
  {
    a: 0.99,
    label: "99%",
    feel: "“Two nines.” Down about 3.7 days a year. Fine for an internal report tool.",
  },
  {
    a: 0.999,
    label: "99.9%",
    feel: "“Three nines.” About 44 minutes a month. A common target for business apps.",
  },
  {
    a: 0.9995,
    label: "99.95%",
    feel: "About 22 minutes a month. Typical of a single managed database or service in one region.",
  },
  {
    a: 0.9999,
    label: "99.99%",
    feel: "“Four nines.” About 4 minutes a month: one slow manual fix uses it all. Needs several zones and automatic recovery.",
  },
  {
    a: 0.99999,
    label: "99.999%",
    feel: "“Five nines.” About 26 seconds a month. Humans are too slow; every change must be automated and gradual.",
  },
];

export function Nines() {
  const [s, set] = useSceneState<AvailState>();
  const L = LEVELS[s.level];
  const perMonth = LEVELS.map((l) => downtimeMin(l.a) / 12);
  const max = perMonth[0];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="How many nines?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={String(s.level)}
            options={LEVELS.map((l, i) => [String(i), l.label] as [string, string])}
            onChange={(v) => set({ level: Number(v) })}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                ["per year", 1],
                ["per month", 12],
                ["per week", 52.18],
                ["per day", 365.25],
              ] as const
            ).map(([k, div]) => (
              <div key={k} className="border-line bg-surface rounded-xl border px-3 py-2">
                <motion.p
                  key={s.level}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-sm"
                >
                  {humanDowntime(downtimeMin(L.a) / div)}
                </motion.p>
                <p className="text-muted text-[10px]">down {k}</p>
              </div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[10px]">Downtime allowed per month</p>
            <div className="space-y-1.5">
              {LEVELS.map((l, i) => (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => set({ level: i })}
                  className="flex w-full items-center gap-2 text-left"
                >
                  <span
                    className={cn(
                      "w-14 shrink-0 font-mono text-[11px]",
                      i === s.level ? "text-fg" : "text-muted",
                    )}
                  >
                    {l.label}
                  </span>
                  <span className="bg-surface-2 relative h-4 flex-1 overflow-hidden rounded">
                    <motion.span
                      className={cn(
                        "absolute inset-y-0 left-0 rounded",
                        i === s.level ? "bg-bad/70" : "bg-bad/25",
                      )}
                      initial={false}
                      animate={{ width: `${Math.max(0.4, (perMonth[i] / max) * 100)}%` }}
                    />
                  </span>
                  <span className="text-muted w-16 shrink-0 text-right font-mono text-[10px]">
                    {humanDowntime(perMonth[i])}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.level}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {L.feel}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        A shop that says it&apos;s &ldquo;open 99% of the time&rdquo; sounds reliable, until you
        work out that it&apos;s shut for three and a half days a year.
      </p>
      <p>
        <Term id="availability">Availability</Term> is the share of time a system works. Engineers
        count it in &ldquo;nines&rdquo;. Each extra nine cuts the allowed downtime tenfold, and
        usually costs a lot more to reach.
      </p>
      <p className="text-muted text-sm">
        The allowed downtime is sometimes called a downtime budget: you can &ldquo;spend&rdquo; it
        on risky changes, or save it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Find the weak link ⭐ -------------------------------------------------------------------------- */

const LB: Tier = { id: "lb", label: "Load balancer", a: 0.9999, max: 1, zonal: false };
const APP: Tier = { id: "app", label: "App servers", a: 0.995, max: 4, zonal: true };
const DB: Tier = { id: "db", label: "Database", a: 0.999, max: 2, zonal: true };
const PAY: Tier = { id: "pay", label: "Payment provider", a: 0.999, max: 2, zonal: false };

function TierBox({
  t,
  n,
  a,
  weakest,
  onChange,
  note,
}: {
  t: Tier;
  n: number;
  a: number;
  weakest: boolean;
  onChange?: (n: number) => void;
  note?: string;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "flex min-w-[8.5rem] flex-1 flex-col gap-1 rounded-xl border px-2.5 py-2 sm:min-w-0",
        weakest ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
      )}
    >
      <p className="truncate text-xs font-semibold">{t.label}</p>
      <div className="flex gap-0.5">
        {Array.from({ length: n }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-viz-compute size-2.5 rounded-sm"
          />
        ))}
      </div>
      <p className="font-mono text-[11px]">{pct(a)}</p>
      <p className="text-muted text-[9px] leading-tight">{note ?? `each ${pct(t.a)}`}</p>
      {onChange && (
        <div className="mt-auto flex items-center gap-1">
          <button
            type="button"
            aria-label={`Fewer ${t.label}`}
            disabled={n <= 1}
            onClick={() => onChange(n - 1)}
            className="border-line grid size-6 place-items-center rounded-full border disabled:opacity-30"
          >
            <Minus className="size-3" />
          </button>
          <button
            type="button"
            aria-label={`More ${t.label}`}
            disabled={n >= t.max}
            onClick={() => onChange(n + 1)}
            className="border-line grid size-6 place-items-center rounded-full border disabled:opacity-30"
          >
            <Plus className="size-3" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function WeakLink() {
  const [s, set] = useSceneState<AvailState>();
  const parts: { t: Tier; n: number; a: number; set?: (n: number) => void; note?: string }[] = [
    { t: LB, n: 1, a: LB.a, note: "managed; already redundant" },
    { t: APP, n: s.app, a: tierAvailability(APP, s.app, s.spread), set: (n) => set({ app: n }) },
    {
      t: DB,
      n: s.db,
      a: tierAvailability(DB, s.db, s.spread),
      set: (n) => set({ db: n }),
      note: s.db > 1 ? "primary + standby" : "one server",
    },
    {
      t: PAY,
      n: s.pay,
      a: tierAvailability(PAY, s.pay, false),
      set: (n) => set({ pay: n }),
      note: s.pay > 1 ? "two providers" : "external",
    },
  ];
  const zoneFactor = s.spread ? 1 : ZONE;
  const total = parts.reduce((acc, p) => acc * p.a, 1) * zoneFactor;
  const weakest = parts.reduce((w, p) => (p.a < w.a ? p : w), parts[0]);
  const zoneWeakest = !s.spread && ZONE < weakest.a;
  return (
    <StepLayout
      eyebrow="Calculator"
      title="Find the weak link"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.spread}
              onChange={(e) => set({ spread: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Spread servers across 3 <Term id="availability-zone">zones</Term>
          </label>
          <div className="flex flex-wrap items-stretch gap-2">
            {!s.spread && (
              <TierBox
                t={{ id: "zone", label: "One zone", a: ZONE, max: 1, zonal: false }}
                n={1}
                a={ZONE}
                weakest={zoneWeakest}
                note="everything shares one data centre"
              />
            )}
            {parts.map((p) => (
              <TierBox
                key={p.t.id}
                t={p.t}
                n={p.n}
                a={p.a}
                weakest={!zoneWeakest && p.t.id === weakest.t.id && p.t.id !== "lb"}
                onChange={p.set}
                note={p.note}
              />
            ))}
          </div>
          <p className="text-muted text-center text-[11px]">
            In a chain, every part must work: multiply them.{" "}
            <span className="font-mono">
              {s.spread ? "" : `${pct(ZONE)} × `}
              {parts.map((p) => pct(p.a)).join(" × ")}
            </span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-xl border px-4 py-3",
                total >= 0.999 ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              <p className="text-muted text-[10px]">Whole system</p>
              <motion.p
                key={total}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                className="font-mono text-lg"
              >
                {pct(total)}
              </motion.p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-muted text-[10px]">Down per year</p>
              <motion.p
                key={total}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                className="font-mono text-lg"
              >
                {humanDowntime(downtimeMin(total))}
              </motion.p>
            </div>
          </div>
          <p className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
            {zoneWeakest
              ? "Everything runs in one zone, so one building's power or network failure takes it all down. Spread across zones."
              : weakest.t.id === "app"
                ? "One app server is a single point of failure. Add copies: the tier fails only if every copy fails at once."
                : weakest.t.id === "db"
                  ? "The database is now the weak link. Add a standby that takes over automatically."
                  : weakest.t.id === "pay"
                    ? "Now an outside dependency limits you. You can't do better than the services you depend on, unless you add a second provider."
                    : "Every tier is redundant. Remaining risk: failures that hit all copies at once."}
          </p>
        </div>
      }
    >
      <p>
        Brewline&apos;s checkout needs a load balancer, app servers, a database and a payment
        provider. If any one is down, checkout is down.
      </p>
      <p>
        Improve the weakest part (outlined in red) until the whole system reaches three nines, then
        get as close to four as you can. Each fix moves the weak link somewhere else.
      </p>
      <p className="text-muted text-sm">
        Copies in parallel: the tier is down only if all copies are, so 1 − (1 − a)ⁿ. The numbers
        here are illustrative, and the maths assumes copies fail independently.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Predict ------------------------------------------------------------------------------------ */

export function PredictChain() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="Ten dependencies"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="ten-deps"
            prompt="A page calls 10 services, one after another, and fails if any of them fails. Each is 99.9% available. What's the page's availability?"
            min={98}
            max={100}
            step={0.1}
            unit="%"
            answer={99}
            tolerance={0.1}
            explanation="0.999¹⁰ ≈ 0.990, so about 99%: ten times the downtime of any one service, roughly 3.6 days a year. That's why teams cut hard dependencies, add fallbacks, and make non-essential calls optional."
          />
        </div>
      }
    >
      <p>Chains of dependencies are how good components add up to a mediocre system.</p>
    </StepLayout>
  );
}

/* 4 ─ When copies fail together ----------------------------------------------------------------------- */

export function Correlated() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="When copies fail together"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="correlated"
            prompt="Three app servers in three zones, each 99.5% available. The formula says the tier should be down about 11 minutes a century. Last month, all three went down together for an hour. Which is the most likely cause?"
            options={[
              {
                id: "deploy",
                label: "A bad release or config change was pushed to all three at once",
                correct: true,
                feedback:
                  "Right. Copies share code, config, certificates and dependencies, so the same mistake hits them all. The 'independent failures' assumption breaks.",
              },
              {
                id: "luck",
                label: "Very bad luck: three independent failures at once",
                feedback:
                  "At 0.5% each, three independent failures in the same hour are vanishingly rare. Something they share failed.",
              },
              {
                id: "maths",
                label: "The formula is simply wrong",
                feedback: "The maths is fine; its assumption (independence) didn't hold.",
              },
              {
                id: "zones",
                label: "Zones are unreliable",
                feedback:
                  "One zone failing takes out one copy. All three at once points to something they have in common.",
              },
            ]}
            explanation="Guard against correlated failures: roll changes out gradually (one zone, then more), keep a fast rollback, and avoid shared single dependencies such as one DNS provider or one config service."
          />
        </div>
      }
    >
      <p>
        Real outages at large cloud providers and the July 2024 CrowdStrike update, which crashed
        millions of Windows machines, share a pattern: one change or dependency hit everything at
        once.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What the cloud promises ------------------------------------------------------------------------- */

const OUTAGES = [0.5, 1, 4, 12, 48];
const BILL = 200000; // ₹ per month for the database
const LOSS_PER_HOUR = 300000; // ₹ of lost orders per hour of downtime (illustrative)
const MONTH_H = 730;

function credit(uptime: number) {
  if (uptime >= 0.9999) return 0;
  if (uptime >= 0.99) return 0.1;
  if (uptime >= 0.95) return 0.25;
  return 1;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const SLAS: [string, string][] = [
  [
    "AWS",
    "EC2 across 2+ zones 99.99% (one instance 99.5%); RDS Multi-AZ 99.95%; DynamoDB 99.99% (global tables 99.999%); S3 Standard 99.9%.",
  ],
  [
    "Azure",
    "One VM 99.9% with Premium SSD (99.5% with Standard SSD); availability set 99.95%; across zones 99.99%; Cosmos DB with multi-region writes 99.999%.",
  ],
  [
    "Google Cloud",
    "One Compute Engine VM 99.9% for most machine types; across zones 99.99%; Spanner regional 99.99%, multi-region 99.999%.",
  ],
];

export function Slas() {
  const [s, set] = useSceneState<AvailState>();
  const hours = OUTAGES[s.outage] ?? 1;
  const uptime = 1 - hours / MONTH_H;
  const c = credit(uptime);
  const got = c * BILL;
  const lost = hours * LOSS_PER_HOUR;
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the cloud promises"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Outage this month</span>
            <Segmented
              size="sm"
              value={String(s.outage)}
              options={OUTAGES.map(
                (h, i) => [String(i), h < 1 ? "30 min" : `${h} h`] as [string, string],
              )}
              onChange={(v) => set({ outage: Number(v) })}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Uptime this month</p>
              <p className="font-mono text-sm">{pct(uptime)}</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">
                Service credit ({Math.round(c * 100)}% of bill)
              </p>
              <p className="font-mono text-sm">{inr(got)}</p>
            </div>
            <div className="border-bad/40 bg-bad/5 rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Orders you lost</p>
              <p className="font-mono text-sm">{inr(lost)}</p>
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="space-y-2">
              {(
                [
                  ["Credit", got, "bg-good/70"],
                  ["Lost", lost, "bg-bad/70"],
                ] as const
              ).map(([k, v, cls]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="text-muted w-12 text-[10px]">{k}</span>
                  <span className="bg-surface-2 relative h-4 flex-1 overflow-hidden rounded">
                    <motion.span
                      className={cn("absolute inset-y-0 left-0 rounded", cls)}
                      initial={false}
                      animate={{ width: `${Math.max(0.5, (v / Math.max(lost, got, 1)) * 100)}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted mt-2 text-[10px]">
              A 99.99% database SLA with typical credit tiers (10% below 99.99%, 25% below 99%, 100%
              below 95%), a {inr(BILL)} monthly bill, and {inr(LOSS_PER_HOUR)} of orders lost per
              hour of downtime. Illustrative numbers.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {SLAS.map(([who, d]) => (
              <div key={who} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="text-sm font-semibold">{who}</p>
                <p className="text-muted mt-0.5 text-[11px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Cloud providers publish an <Term id="sla">SLA</Term> for each service. Read the small print:
        if they miss it, you get a credit on a future bill, which you usually have to claim. Your
        lost business isn&apos;t covered.
      </p>
      <p>Try a few outage lengths and compare the credit with what the outage cost.</p>
      <p className="text-muted text-sm">
        Notice the pattern in the SLAs: one machine gets two or three nines; spreading across zones
        gets four; multi-region databases five. Your design, not the SLA, decides your availability.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Nines are tenfold steps", "99.9% allows ~44 min a month; 99.99% only ~4."],
  ["Chains multiply down", "Every hard dependency lowers the total; the weakest link dominates."],
  ["Copies multiply up", "Redundancy helps only when copies fail independently."],
  ["Correlation is the enemy", "Shared deploys, config and dependencies fail everything at once."],
  ["SLAs are refunds", "A credit on your bill, not a promise your system stays up."],
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
      <p>Redundancy handles a server dying. It doesn&apos;t handle a server getting slow.</p>
      <p>
        Next: timeouts, circuit breakers and rate limits, which stop one slow part dragging the rest
        down.
      </p>
    </StepLayout>
  );
}
