"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { DrState, Strategy, Target } from "./state";

/** Minutes → readable duration. */
function dur(min: number): string {
  if (min === 0) return "≈ 0";
  if (min < 1) return `${Math.round(min * 60)} s`;
  if (min < 90) return `${Math.round(min)} min`;
  if (min < 48 * 60) return `${+(min / 60).toFixed(1)} h`;
  return `${+(min / 1440).toFixed(1)} days`;
}

/* 1 ─ No spare, spare tyre, run-flats ------------------------------------------------------------- */

const TYRES: [string, string, string][] = [
  [
    "No spare",
    "Call for help and wait. Hours by the roadside, but you paid for nothing extra.",
    "Cold",
  ],
  [
    "A spare in the boot",
    "Twenty minutes with a jack and you're moving again. Costs a fifth wheel.",
    "Warm",
  ],
  ["Run-flat tyres", "A puncture and you keep driving. Expensive tyres, almost no delay.", "Hot"],
];

export function Tyres() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="No spare, spare tyre, run-flats"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {TYRES.map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">
                {t} <span className="text-muted text-xs font-normal">· {k}</span>
              </p>
              <p className="text-muted mt-0.5 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Google&apos;s disaster-recovery guide uses this picture. Every car gets punctures; the
        question is how long you can afford to sit by the road, and what you&apos;ll pay to avoid
        it.
      </p>
      <p>
        Cloud systems are the same. Zones and regions do fail (module 2), and so do deployments,
        scripts and people. <Term id="disaster-recovery">Disaster recovery</Term> is deciding ahead
        of time how you&apos;ll get going again, and paying for exactly as much spare as you need.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Two numbers ⭐ ------------------------------------------------------------------------------- */

function Slider({
  label,
  value,
  min,
  max,
  step,
  show,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  show: string;
  onChange(v: number): void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="text-muted w-28 shrink-0 sm:w-36">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent flex-1"
      />
      <span className="w-16 shrink-0 text-right font-mono whitespace-nowrap">{show}</span>
    </label>
  );
}

const LOG_STEPS = [1, 5, 15, 30, 60, 120, 240, 480, 720, 1440];

export function TwoNumbers() {
  const [s, set] = useSceneState<DrState>();
  const half = Math.max(s.lastCopy, s.recovery) * 1.25;
  const span = half * 2;
  const pos = (m: number) => `${(m / span) * 100}%`;
  const disaster = half;
  const okRpo = s.lastCopy <= 15;
  const okRto = s.recovery <= 45;
  const idx = (v: number) => Math.max(0, LOG_STEPS.indexOf(v));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Two numbers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <Slider
            label="Time since last good copy"
            value={idx(s.lastCopy)}
            min={0}
            max={LOG_STEPS.length - 1}
            step={1}
            show={dur(s.lastCopy)}
            onChange={(i) => set({ lastCopy: LOG_STEPS[i] })}
          />
          <Slider
            label="Time to get running again"
            value={idx(s.recovery)}
            min={0}
            max={LOG_STEPS.length - 1}
            step={1}
            show={dur(s.recovery)}
            onChange={(i) => set({ recovery: LOG_STEPS[i] })}
          />
          <div className="relative h-16">
            <div className="bg-line absolute top-7 right-0 left-0 h-0.5" />
            <motion.div
              className="bg-bad/30 absolute top-5 h-5 rounded-l"
              animate={{ left: pos(disaster - s.lastCopy), width: pos(s.lastCopy) }}
            />
            <motion.div
              className="bg-accent/40 absolute top-5 h-5 rounded-r"
              animate={{ left: pos(disaster), width: pos(s.recovery) }}
            />
            <div className="bg-bad absolute top-2 h-11 w-0.5" style={{ left: pos(disaster) }} />
            <p
              className="text-bad absolute top-12 -translate-x-1/2 text-[10px] font-semibold"
              style={{ left: pos(disaster) }}
            >
              disaster
            </p>
            <motion.p
              className="absolute top-0 -translate-x-full pr-1 text-[10px]"
              animate={{ left: pos(disaster) }}
            >
              data lost: {dur(s.lastCopy)}
            </motion.p>
            <motion.p className="absolute top-0 pl-1 text-[10px]" animate={{ left: pos(disaster) }}>
              down: {dur(s.recovery)}
            </motion.p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">
              Would a stock exchange pass? (SEBI, 2021: recover within 45 min, lose at most 15 min)
            </p>
            <p className={cn("mt-1 flex items-center gap-1", okRpo ? "text-good" : "text-bad")}>
              {okRpo ? <Check className="size-3.5" /> : <X className="size-3.5" />} RPO{" "}
              {dur(s.lastCopy)} {okRpo ? "≤" : ">"} 15 min
            </p>
            <p className={cn("flex items-center gap-1", okRto ? "text-good" : "text-bad")}>
              {okRto ? <Check className="size-3.5" /> : <X className="size-3.5" />} RTO{" "}
              {dur(s.recovery)} {okRto ? "≤" : ">"} 45 min
            </p>
          </div>
        </div>
      }
    >
      <p>
        Two numbers decide everything. The <Term id="rpo">recovery point objective</Term> (RPO) is
        how much recent data you can afford to lose: the gap back to your last good copy. The{" "}
        <Term id="rto">recovery time objective</Term> (RTO) is how long you can afford to be down.
      </p>
      <p>
        They are business decisions, not technical ones. After the National Stock Exchange halted
        trading for almost four hours in February 2021 without switching to its backup site, SEBI
        set exchanges an RTO of 45 minutes and an RPO of 15. Slide the two numbers until an exchange
        would pass.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Fail a region ⭐ ----------------------------------------------------------------------------- */

const STRATS: Record<
  Strategy,
  { name: string; rpo: number; rto: number; extra: number; how: string; wording: string }
> = {
  backup: {
    name: "Backup & restore",
    rpo: 1440,
    rto: 720,
    extra: 0.05,
    how: "Nightly backups copied to Hyderabad. On failure, build everything there from scratch and restore.",
    wording: "RPO in hours, RTO in 24 hours or less",
  },
  pilot: {
    name: "Pilot light",
    rpo: 10,
    rto: 30,
    extra: 0.15,
    how: "Data replicated continuously; servers defined but switched off in Hyderabad. On failure, start and scale them.",
    wording: "RPO in minutes, RTO in tens of minutes",
  },
  warm: {
    name: "Warm standby",
    rpo: 1 / 6,
    rto: 5,
    extra: 0.4,
    how: "A small, working copy always running in Hyderabad. On failure, scale it up and switch traffic.",
    wording: "RPO in seconds, RTO in minutes",
  },
  active: {
    name: "Active-active",
    rpo: 0,
    rto: 0,
    extra: 1.0,
    how: "Both regions serve users all the time, each able to carry the full load. On failure, the other just keeps going.",
    wording: "RPO near zero, RTO potentially zero",
  },
};

const TARGETS: Record<Target, { name: string; rpo: number; rto: number }> = {
  wiki: { name: "Internal wiki", rpo: 1440, rto: 1440 },
  portal: { name: "Citizen portal", rpo: 60, rto: 240 },
  exchange: { name: "Stock exchange", rpo: 15, rto: 45 },
  payments: { name: "Payments", rpo: 0, rto: 5 },
};

const PROD = 10000;

export function FailRegion() {
  const [s, set] = useSceneState<DrState>();
  const st = STRATS[s.strategy];
  const tg = TARGETS[s.target];
  const meets = (k: Strategy) => STRATS[k].rpo <= tg.rpo && STRATS[k].rto <= tg.rto;
  const cheapest = (Object.keys(STRATS) as Strategy[]).find(meets);
  return (
    <StepLayout
      eyebrow="Simulation · AWS's wording, illustrative costs"
      title="Fail a region"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <p className="text-muted mb-1 text-xs">The system and its target</p>
            <Segmented
              size="sm"
              value={s.target}
              options={(Object.keys(TARGETS) as Target[]).map(
                (k) => [k, TARGETS[k].name] as [Target, string],
              )}
              onChange={(v) => set({ target: v, failed: false })}
            />
            <p className="text-muted mt-1 text-[11px]">
              Target: lose at most {tg.rpo === 0 ? "nothing" : dur(tg.rpo)}, back within{" "}
              {dur(tg.rto)}
            </p>
          </div>
          <div>
            <p className="text-muted mb-1 text-xs">
              Recovery strategy (Mumbai primary, Hyderabad recovery)
            </p>
            <Segmented
              size="sm"
              value={s.strategy}
              options={(Object.keys(STRATS) as Strategy[]).map(
                (k) => [k, STRATS[k].name] as [Strategy, string],
              )}
              onChange={(v) => set({ strategy: v, failed: false })}
            />
            <p className="text-muted mt-1 text-[11px]">
              {st.how} <span className="italic">AWS: &ldquo;{st.wording}&rdquo;.</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => set({ failed: !s.failed })}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium",
                s.failed ? "border-line border" : "bg-bad text-white",
              )}
            >
              {s.failed ? "Reset" : "Fail the Mumbai region"}
            </button>
            <span className="text-muted text-xs">
              Monthly cost:{" "}
              <span className="text-fg font-mono">
                ${(PROD * (1 + st.extra)).toLocaleString("en-US")}
              </span>{" "}
              (production ${PROD.toLocaleString("en-US")} + {Math.round(st.extra * 100)}%)
            </span>
          </div>
          {s.failed && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-2"
            >
              <Result
                label="Data lost"
                value={st.rpo === 0 ? "≈ nothing" : `up to ${dur(st.rpo)}`}
                ok={st.rpo <= tg.rpo}
              />
              <Result
                label="Downtime"
                value={st.rto === 0 ? "≈ none" : `about ${dur(st.rto)}`}
                ok={st.rto <= tg.rto}
              />
            </motion.div>
          )}
          {s.failed && (
            <p className="text-xs">
              {meets(s.strategy)
                ? s.strategy === cheapest
                  ? "Meets the target, and it's the cheapest strategy that does."
                  : `Meets the target, but ${STRATS[cheapest!].name} would too, for less.`
                : `Misses the target. The cheapest strategy that meets it: ${cheapest ? STRATS[cheapest].name : "none"}.`}
            </p>
          )}
        </div>
      }
    >
      <p>
        Four standard strategies, from cheap and slow to expensive and instant. Pick a system, pick
        a strategy, then fail the Mumbai region and see whether you met the target.
      </p>
      <p>
        The times follow AWS&apos;s published ranges; the costs are illustrative, since nobody
        publishes a percentage. Active-active costs at least double because each region must carry
        the full load alone. For near-zero data loss, a few services now replicate synchronously
        across regions, for example DynamoDB global tables (across three regions) and Spanner&apos;s
        Mumbai–Delhi configuration.
      </p>
    </StepLayout>
  );
}

function Result({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2",
        ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <p className="flex items-center gap-1 text-sm font-semibold">
        {ok ? <Check className="text-good size-4" /> : <X className="text-bad size-4" />}
        {value}
      </p>
    </div>
  );
}

/* 4 ─ Counting nines ------------------------------------------------------------------------------ */

const AVAILS = [99, 99.5, 99.9, 99.95, 99.99];

export function Nines() {
  const [s, set] = useSceneState<DrState>();
  const a = s.availability / 100;
  const one = Math.pow(1 - Math.pow(1 - a, s.copies), 1);
  const total = Math.pow(one, s.chain);
  const minutesDown = (1 - total) * 365 * 24 * 60;
  return (
    <StepLayout
      eyebrow="Calculator"
      title="Counting nines"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted w-36">Each component</span>
            {AVAILS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set({ availability: v })}
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[11px]",
                  s.availability === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {v}%
              </button>
            ))}
          </div>
          <Slider
            label="Components in a chain"
            value={s.chain}
            min={1}
            max={6}
            step={1}
            show={String(s.chain)}
            onChange={(v) => set({ chain: v })}
          />
          <Slider
            label="Copies of each (in parallel)"
            value={s.copies}
            min={1}
            max={3}
            step={1}
            show={String(s.copies)}
            onChange={(v) => set({ copies: v })}
          />
          <div className="flex items-center gap-1">
            {Array.from({ length: s.chain }, (_, i) => (
              <div key={i} className="flex flex-1 flex-col gap-0.5">
                {Array.from({ length: s.copies }, (_, j) => (
                  <motion.div key={j} layout className="bg-accent/30 h-3 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
          <div className="bg-surface-2 rounded-lg px-3 py-2">
            <p className="text-sm">
              Whole system:{" "}
              <span className="font-mono font-semibold">
                {(total * 100).toFixed(total > 0.9999 ? 4 : 2)}%
              </span>
            </p>
            <p className="text-muted text-xs">About {dur(minutesDown)} down a year</p>
          </div>
          <p className="text-muted text-[10px]">
            99.9% = 8.76 h a year · 99.99% = 52.6 min · 99.999% = 5.3 min. Parallel copies assume
            independent failures, which is why they go in different zones.
          </p>
        </div>
      }
    >
      <p>
        Availability is usually quoted in nines. A chain of components is weaker than any one of
        them: three parts at 99.9% each give 99.7%. Copies in parallel do the opposite: two at 99%
        give 99.99%, if they don&apos;t fail together.
      </p>
      <p>
        Play with the numbers. This is <Term id="high-availability">high availability</Term>, the
        everyday kind (surviving a server or zone), as opposed to disaster recovery from a whole
        region or a deleted database.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Prove it works ----------------------------------------------------------------------------- */

const STORIES: [string, string][] = [
  [
    "OVHcloud fire, Strasbourg, March 2021",
    "A datacentre burned down (SBG2, over 14,000 servers). Customers whose backups sat in the same site lost data; a French court later ordered compensation for two of them.",
  ],
  [
    "NSE, February 2021",
    "Trading stopped for almost four hours and the exchange didn't switch to its disaster site. SEBI now requires live trading from the disaster site, unannounced, at least once every six months.",
  ],
  [
    "UniSuper, May 2024",
    "A Google Cloud mistake deleted the pension fund's private cloud across two zones. Backups in Cloud Storage and in third-party software brought it back.",
  ],
  [
    "AWS us-east-1, October 2025",
    "A DNS fault in DynamoDB started a cascade lasting about 14.5 hours. Systems that could run from another region kept going.",
  ],
];

export function ProveIt() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Prove it works"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {STORIES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
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
        A recovery plan nobody has run is a guess. RBI tells banks to &ldquo;periodically restore
        such backed-up data to check its usability&rdquo; and to run critical systems from their
        disaster site for a full working day at least every six months.
      </p>
      <p>
        Teams rehearse with game days and <Term id="chaos-engineering">chaos engineering</Term>:
        breaking things on purpose to see what happens. Netflix described its Chaos Monkey in 2010;
        today AWS Fault Injection Service and Azure Chaos Studio do the same as managed services.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Pick the strategy -------------------------------------------------------------------------- */

export function Pick() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the strategy"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dr-strategy"
            prompt="Choose the cheapest strategy that meets each target."
            categories={[
              { id: "backup", label: "Backup & restore" },
              { id: "pilot", label: "Pilot light" },
              { id: "warm", label: "Warm standby" },
              { id: "active", label: "Active-active" },
            ]}
            items={[
              {
                id: "hr",
                label: "An HR training site; a day's outage and a day's lost edits are fine",
                category: "backup",
                why: "Hours of RPO and RTO are acceptable, so pay for nothing running.",
              },
              {
                id: "exch",
                label: "A clearing system: back within 45 minutes, lose at most 15",
                category: "pilot",
                why: "Continuous replication and tens of minutes to start: just enough.",
              },
              {
                id: "shop",
                label: "A busy online shop: a few minutes down at most, seconds of lost orders",
                category: "warm",
                why: "A small copy always running, scaled up on failover.",
              },
              {
                id: "upi",
                label: "A payment switch that must never stop or lose a transaction",
                category: "active",
                why: "Both regions live, with synchronous or near-zero-loss replication.",
              },
            ]}
            explanation="Tighter targets need more running spare capacity, so match the strategy to what the business actually needs."
          />
        </div>
      }
    >
      <p>Four systems, four targets.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["RPO and RTO", "Data you can lose, time you can be down: business decisions."],
  ["Four strategies", "Backup, pilot light, warm standby, active-active: cheap to costly."],
  ["Nines multiply", "Chains weaken, independent copies strengthen."],
  ["Rehearse", "Restore backups and fail over for real, regularly."],
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
        Resilience costs money. Next: where the cloud bill comes from and how to keep it in check.
      </p>
    </StepLayout>
  );
}
