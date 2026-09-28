"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, X, type LucideIcon } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, type Fit } from "./decisions";
import type { ClientState } from "./state";

/* 1 ─ A suit made far away ----------------------------------------------------------------------- */

const TAILOR: { title: string; text: string; tone?: "good" | "bad" }[] = [
  {
    title: "Measurements once, suit in six weeks",
    text: "A tailor in Bengaluru takes one set of measurements over the phone and posts the finished suit to London six weeks later. The sleeves are wrong, the colour isn't what the customer pictured, and there's no time left to fix it.",
    tone: "bad",
  },
  {
    title: "Fittings through a cousin",
    text: "The customer's cousin, who lives near the shop, comes to the fittings instead. He passes on messages but can't say whether the customer would like a slimmer cut. Every question waits for a phone call.",
  },
  {
    title: "A video fitting every week",
    text: "Each week the customer joins a short video call, sees the suit on a mannequin and says “shorter here, darker there”. The suit that arrives fits, and there were no surprises.",
    tone: "good",
  },
];

export function Tailor() {
  const [s, set] = useSceneState<ClientState>();
  const f = Math.min(s.tailor, TAILOR.length - 1);
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A suit made far away"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center justify-center gap-2 py-2 text-xs">
            <span className="border-line bg-surface rounded-full border px-3 py-1 font-medium">
              Tailor, Bengaluru
            </span>
            <motion.div
              key={f}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-32 items-center justify-center gap-1.5 sm:w-48"
            >
              {f === 0 && (
                <span className="text-bad border-bad/50 flex-1 border-t border-dashed pt-1 text-center text-[10px]">
                  one call · 6 weeks
                </span>
              )}
              {f === 1 && (
                <>
                  <span className="bg-line-strong h-px flex-1" />
                  <span className="border-line-strong bg-surface-2 rounded-full border px-2 py-0.5 text-[10px]">
                    cousin
                  </span>
                  <span className="bg-line-strong h-px flex-1" />
                </>
              )}
              {f === 2 &&
                Array.from({ length: 6 }, (_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.08 * i }}
                    className="bg-good size-2 rounded-full"
                  />
                ))}
            </motion.div>
            <span className="border-line bg-surface rounded-full border px-3 py-1 font-medium">
              Customer, London
            </span>
          </div>
          <Stepper step={f} count={TAILOR.length} onChange={(n) => set({ tailor: n })} />
          <FrameCaption frameKey={f} title={TAILOR[f].title} tone={TAILOR[f].tone}>
            {TAILOR[f].text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Much of India&apos;s software work is built for clients in other countries: NASSCOM
        estimates the tech industry at about US$315 billion for FY2026, mostly exports. So the
        person who decides what matters is often thousands of kilometres and several time zones
        away.
      </p>
      <p>
        A tailor making a suit for a distant customer has the same problem. Step through three ways
        to do it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Guess the overlap ------------------------------------------------------------------------ */

export function OverlapGuess() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Guess the overlap"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="overlap-guess"
            prompt="A Bengaluru team works 9 am to 6 pm. Their client in New York also works 9 am to 6 pm. In winter, how many hours of the working day do they share?"
            min={0}
            max={6}
            step={0.5}
            unit=" hours"
            answer={0}
            tolerance={0}
            explanation="None. In winter New York is 10½ hours behind India, so the client's 9 am is 7:30 pm in Bengaluru, 1½ hours after the team has gone home. Even in summer (9½ hours) there's a 30-minute gap. Someone has to stretch their day."
          />
        </div>
      }
    >
      <p>
        India keeps one time zone, IST (UTC+5:30), and doesn&apos;t change its clocks. The UK and
        the US do, on different dates, so the gap moves twice a year.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two clocks ⭐ ----------------------------------------------------------------------------- */

/** Client offsets from IST, in hours (IST minus local). */
const OFFSET = {
  london: { summer: 4.5, winter: 5.5 },
  newyork: { summer: 9.5, winter: 10.5 },
};
const CITY = { london: "London", newyork: "New York" };
const AX0 = 6; // axis starts at 06:00 IST
const AX1 = 30; // and ends at 06:00 IST next day

const fmt = (h: number) => {
  const t = ((h % 24) + 24) % 24;
  const hh = Math.floor(t);
  const mm = Math.round((t - hh) * 60);
  const ap = hh < 12 ? "am" : "pm";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}${mm ? `:${String(mm).padStart(2, "0")}` : ""} ${ap}`;
};
const pct = (h: number) => ((h - AX0) / (AX1 - AX0)) * 100;

function Bar({ from, to, className }: { from: number; to: number; className: string }) {
  return (
    <motion.div
      initial={false}
      animate={{ left: `${pct(from)}%`, width: `${pct(to) - pct(from)}%` }}
      className={cn("absolute inset-y-0 rounded", className)}
    />
  );
}

export function Clocks() {
  const [s, set] = useSceneState<ClientState>();
  const off = OFFSET[s.city][s.season];
  const blr: [number, number] = [s.start, s.start + 9];
  const cli: [number, number] = [9 + off, 18 + off];
  const ov = Math.max(0, Math.min(blr[1], cli[1]) - Math.max(blr[0], cli[0]));
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two clocks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2">
            <Segmented
              size="sm"
              value={s.city}
              options={[
                ["london", "Client in London"],
                ["newyork", "Client in New York"],
              ]}
              onChange={(v) => set({ city: v })}
            />
            <Segmented
              size="sm"
              value={s.season}
              options={[
                ["summer", "Summer"],
                ["winter", "Winter"],
              ]}
              onChange={(v) => set({ season: v })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-muted relative h-4 text-[9px]">
              {[6, 12, 18, 24, 30].map((h) => (
                <span
                  key={h}
                  className={cn(
                    "absolute whitespace-nowrap",
                    h === 6 ? "" : h === 30 ? "-translate-x-full" : "-translate-x-1/2",
                  )}
                  style={{ left: `${pct(h)}%` }}
                >
                  {fmt(h)}
                </span>
              ))}
            </div>
            {[
              ["Bengaluru", blr, "bg-accent"],
              [CITY[s.city], cli, "bg-viz-data"],
            ].map(([name, [a, b], c]) => (
              <div key={name as string}>
                <p className="mb-0.5 text-xs">
                  <span className="font-medium">{name as string}</span>{" "}
                  <span className="text-muted">
                    works {fmt(a as number)}–{fmt(b as number)} IST
                    {name !== "Bengaluru" && " (9 am–6 pm local)"}
                  </span>
                </p>
                <div className="bg-surface-2 relative h-5 rounded">
                  <Bar from={a as number} to={b as number} className={c as string} />
                </div>
              </div>
            ))}
            <div className="bg-surface-2 relative mt-1 h-3 rounded">
              {ov > 0 && (
                <Bar
                  from={Math.max(blr[0], cli[0])}
                  to={Math.min(blr[1], cli[1])}
                  className="bg-good"
                />
              )}
            </div>
          </div>
          <div
            className={cn(
              "rounded-xl border px-4 py-2.5 text-sm",
              ov >= 3
                ? "border-good/40 bg-good/10"
                : ov > 0
                  ? "border-line bg-surface"
                  : "border-bad/40 bg-bad/10",
            )}
          >
            <span className="font-semibold">
              {ov > 0 ? `${ov} hours of overlap` : "No overlap"}
            </span>
            <span className="text-muted">
              {ov > 0
                ? " for questions, Reviews and quick decisions."
                : ": every question waits a whole day for an answer."}
            </span>
          </div>
          <label className="flex items-center gap-3 text-xs">
            <span className="text-muted shrink-0">Bengaluru starts at</span>
            <input
              type="range"
              min={7}
              max={13}
              step={0.5}
              value={s.start}
              onChange={(e) => set({ start: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Bengaluru start time"
            />
            <span className="w-14 text-right font-mono">{fmt(s.start)}</span>
          </label>
          {s.start >= 11 && (
            <p className="text-muted text-xs">
              Now the team finishes at {fmt(s.start + 9)}, every day. Some teams shift a few people
              instead, or rotate who takes the late slot, so the cost is shared.
            </p>
          )}
        </div>
      }
    >
      <p>
        Pick a client city and a season, then slide the Bengaluru team&apos;s start time to buy
        overlap. The green strip is the time both sides are at work.
      </p>
      <p>
        London is easy: an afternoon overlap all year. New York needs someone to stretch. Martin
        Fowler, on ThoughtWorks&apos; Bangalore teams, urged &ldquo;give and take in picking the
        time for calls&rdquo;: putting all the burden on one side &ldquo;isn&apos;t helpful&rdquo;.
      </p>
      <p className="text-muted text-sm">
        In 2026 the UK and US change clocks on different dates, so for a few weeks in March and late
        October the gaps shift by an hour.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Five moments ⭐ (branching scenario) ------------------------------------------------------ */

const FIT: Record<Fit, [string, string, LucideIcon]> = {
  good: ["Works well", "border-good/50 bg-good/10", Check],
  care: ["Can work, with care", "border-line-strong bg-surface-2", AlertTriangle],
  poor: ["Likely to hurt", "border-bad/50 bg-bad/10", X],
};

export function FiveMoments() {
  const [s, set] = useSceneState<ClientState>();
  const at = Math.min(s.at, DECISIONS.length - 1);
  const d = DECISIONS[at];
  const pick = s.choices[d.id];
  const opt = d.options.find((o) => o.id === pick);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Five moments"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {DECISIONS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ at: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  i === at ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  s.choices[x.id] && i !== at && "text-muted",
                )}
              >
                {i + 1}. {x.title}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-2"
            >
              <p className="text-sm">{d.situation}</p>
              <div className="flex flex-col gap-1.5">
                {d.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={pick === o.id}
                    onClick={() => set({ choices: { ...s.choices, [d.id]: o.id } })}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-xs",
                      pick === o.id
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {opt && (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("rounded-xl border px-3 py-2 text-xs", FIT[opt.fit][1])}
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    {(() => {
                      const Icon = FIT[opt.fit][2];
                      return <Icon className="size-3.5" />;
                    })()}
                    {FIT[opt.fit][0]}
                  </p>
                  <p className="mt-1">{opt.result}</p>
                </motion.div>
              )}
              {opt && at < DECISIONS.length - 1 && (
                <button
                  type="button"
                  onClick={() => set({ at: at + 1 })}
                  className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
                >
                  Next moment
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        A Bengaluru team builds a booking app for a London client. Walk through five moments and
        choose what the team does. You can go back and try other choices.
      </p>
      <p className="text-muted text-sm">
        A <Term id="proxy-product-owner">proxy Product Owner</Term> isn&apos;t a Scrum Guide role.
        Scrum.org writers warn it &ldquo;typically becomes a bottleneck&rdquo;; Roman Pichler calls
        it &ldquo;an attempt to superficially treat a systemic issue&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Keep the decider close",
    "The real Product Owner sets goals and attends Reviews. A stand-in needs real authority, or it's just a relay.",
  ],
  [
    "Guard the overlap",
    "Use shared hours for questions, decisions and Reviews; rotate the awkward slot.",
  ],
  [
    "Route requests to the PO",
    "Side requests go through the Product Owner, not straight into a developer's day.",
  ],
  [
    "Make “not yet” normal",
    "An honest forecast with options beats a polite yes that turns into a missed deadline.",
  ],
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
        Distance has a cost. In a 2003 study at Lucent, work split across sites took about 2.5 times
        as long, mainly because more people got involved (Herbsleb &amp; Mockus). But it
        needn&apos;t hurt quality: Microsoft found a &ldquo;negligible difference in failures&rdquo;
        for Windows Vista parts built across sites (Bird et al., 2009).
      </p>
      <p>
        Fowler&apos;s advice from Bangalore still holds: send ambassadors between sites (&ldquo;the
        plane fares soon repay themselves&rdquo;), and watch for silence, because &ldquo;polite
        acceptance is often a sign of an important issue not getting discussed&rdquo;.
      </p>
    </StepLayout>
  );
}
