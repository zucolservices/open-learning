"use client";

import { motion } from "motion/react";
import { Gavel } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FACTOR_DEFS, ITEMS, TOOLKIT, band, type Lvl } from "./model";
import type { PenState } from "./state";

/* 1 ─ Story: the maximum and the judge ------------------------------------------------------------- */

export function MaxAndJudge() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The maximum, and the judgement"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Gavel className="text-accent size-10" />
          <div className="w-full max-w-sm">
            <div className="bg-surface-2 relative h-3 rounded-full">
              <div className="bg-viz-meta absolute inset-y-0 left-[20%] w-[25%] rounded-full" />
            </div>
            <div className="text-subtle mt-1 flex justify-between text-[10px]">
              <span>Nothing</span>
              <span>Maximum in the law</span>
            </div>
          </div>
          <p className="text-subtle max-w-xs text-center text-[11px]">
            The law sets the ceiling. The judge decides where in the range a case falls.
          </p>
        </div>
      }
    >
      <p>
        A law might say a fine &ldquo;may extend to&rdquo; a certain amount. That&apos;s a ceiling,
        not a price. The judge looks at how serious it was, whether it&apos;s happened before, and
        whether the person put things right, and decides where in the range it falls.
      </p>
      <p>
        The DPDP Act works the same way. The{" "}
        <Term id="data-protection-board">Data Protection Board</Term> can impose penalties up to
        caps set in the Act&apos;s Schedule, from ₹50 crore to ₹250 crore, weighing a list of
        factors. From May 2027, that is; the Board&apos;s members haven&apos;t yet been appointed.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Penalty explorer ⭐ -------------------------------------------------------------------------- */

const LVLS: Lvl[] = [0, 1, 2];

export function PenaltyExplorer() {
  const [s, set] = useSceneState<PenState>();
  const item = ITEMS.find((i) => i.id === s.item) ?? ITEMS[0];
  const b = band(s.f);
  const blocked = !s.significant || s.undertaking;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Where in the range?"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="grid gap-1.5">
            <p className="text-muted text-[10px] uppercase">The breach (Schedule item)</p>
            <div className="grid gap-1">
              {ITEMS.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  aria-pressed={s.item === i.id}
                  onClick={() => set({ item: i.id })}
                  className={cn(
                    "flex justify-between rounded-lg border px-2.5 py-1 text-left text-[11px]",
                    s.item === i.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  )}
                >
                  <span>{i.label}</span>
                  <span className="font-semibold">{i.cap}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            <p className="text-muted text-[10px] uppercase">The factors (s.33(2))</p>
            {FACTOR_DEFS.map((d) => (
              <div
                key={String(d.id)}
                className="border-line bg-surface rounded-lg border px-2.5 py-1"
              >
                <div className="flex justify-between text-[11px]">
                  <span>{d.label}</span>
                  <span className="text-subtle font-mono">{d.clause}</span>
                </div>
                <div className="mt-1 flex gap-1">
                  {d.kind === "lvl"
                    ? LVLS.map((l) => (
                        <button
                          key={l}
                          type="button"
                          aria-pressed={s.f[d.id] === l}
                          onClick={() => set({ f: { ...s.f, [d.id]: l } })}
                          className={cn(
                            "flex-1 rounded-md border py-0.5 text-[10px]",
                            s.f[d.id] === l
                              ? "border-accent bg-accent text-accent-fg"
                              : "border-line text-muted",
                          )}
                        >
                          {d.opts?.[l]}
                        </button>
                      ))
                    : [false, true].map((v) => (
                        <button
                          key={String(v)}
                          type="button"
                          aria-pressed={s.f[d.id] === v}
                          onClick={() => set({ f: { ...s.f, [d.id]: v } })}
                          className={cn(
                            "flex-1 rounded-md border py-0.5 text-[10px]",
                            s.f[d.id] === v
                              ? "border-accent bg-accent text-accent-fg"
                              : "border-line text-muted",
                          )}
                        >
                          {v ? "Yes" : "No"}
                        </button>
                      ))}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-3 text-[11px]">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={s.significant}
                  onChange={(e) => set({ significant: e.target.checked })}
                  className="accent-accent"
                />
                Board finds the breach significant
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={s.undertaking}
                  onChange={(e) => set({ undertaking: e.target.checked })}
                  className="accent-accent"
                />
                Voluntary undertaking accepted
              </label>
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3 lg:col-span-2">
            <div className="flex justify-between text-xs">
              <span>₹0</span>
              <span className="font-semibold">Cap: {item.cap}</span>
            </div>
            <div className="bg-surface-2 relative mt-1 h-4 rounded-full">
              {!blocked && (
                <div
                  className="bg-viz-meta absolute inset-y-0 rounded-full transition-all duration-500"
                  style={{ left: `${Math.max(0, (b - 0.12) * 100)}%`, width: "24%" }}
                />
              )}
            </div>
            <p className="mt-2 text-xs">
              {!s.significant
                ? "No penalty: the Act allows one only for a significant breach, after an inquiry."
                : s.undertaking
                  ? "Proceedings on these matters stop. If the company breaks its undertaking, it can be penalised up to the cap for the original breach."
                  : b > 0.6
                    ? "Factors point towards the upper part of the range."
                    : b > 0.35
                      ? "Factors point towards the middle of the range."
                      : "Factors point towards the lower part of the range."}
            </p>
            <p className="text-subtle mt-1 text-[10px]">
              Illustrative only: the Act gives no formula, and the Board must also weigh whether a
              penalty is proportionate, deters, and its likely impact on the company.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Pick a breach to see its cap, then set the factors the Board must consider. Watch where the
        outcome is likely to sit within the range.
      </p>
      <p>
        Two switches matter more than any factor. A penalty needs a significant breach found after
        an inquiry. And a voluntary undertaking the Board accepts stops proceedings on those
        matters. Fast, effective mitigation is the factor engineers control most.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The Board's toolkit -------------------------------------------------------------------------- */

export function Toolkit() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The Board's toolkit"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {TOOLKIT.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{k}</p>
              <p className="text-muted">{v}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The Board is designed as a digital-first regulator: a chairperson and four members, based in
        the National Capital Region, working online. Appeals go to TDSAT within 60 days.
      </p>
      <p>
        As of October 2026 it exists in law but its chair and members are still being selected, and
        it can&apos;t issue penalty orders until the core provisions start in May 2027.
      </p>
    </StepLayout>
  );
}

/* 4 ─ No compensation, no jail --------------------------------------------------------------------- */

export function NoCompensation() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who gets the money?"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {[
            [
              "Penalties go to the government",
              "They're credited to the Consolidated Fund of India, not to the people affected.",
            ],
            [
              "No compensation route",
              "The Act gives individuals no right to compensation. Until May 2027, the old IT Act section 43A still allows compensation claims.",
            ],
            [
              "No criminal offences",
              "The DPDP Act's penalties are civil. Other laws, such as IT Act section 72A, still create offences.",
            ],
            [
              "Fixed caps, not turnover",
              "Europe's GDPR fines up to 4% of global turnover; DPDP caps are fixed rupee amounts.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-xl border p-3 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        People are often surprised by where DPDP penalties go. They go to the government&apos;s
        Consolidated Fund. The person whose data was mishandled gets no payment under this Act.
      </p>
      <p>
        The Act also doesn&apos;t say whether one incident can draw several Schedule items at once,
        such as weak safeguards and a missed breach notice. There&apos;s no ruling yet.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function PenCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Match the cap"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-penalties"
            prompt="What is the maximum penalty for each breach?"
            categories={[
              { id: "250", label: "₹250 cr" },
              { id: "200", label: "₹200 cr" },
              { id: "150", label: "₹150 cr" },
              { id: "50", label: "₹50 cr" },
            ]}
            items={[
              {
                id: "safe",
                label: "No reasonable security safeguards",
                category: "250",
                why: "Schedule item 1.",
              },
              {
                id: "notify",
                label: "Not telling the Board and people about a breach",
                category: "200",
                why: "Item 2.",
              },
              {
                id: "kids",
                label: "Targeted ads aimed at children",
                category: "200",
                why: "Item 3.",
              },
              {
                id: "sdf",
                label: "A significant fiduciary skipping its yearly audit",
                category: "150",
                why: "Item 4.",
              },
              {
                id: "notice",
                label: "A notice that doesn't itemise the data",
                category: "50",
                why: "Item 7: any other provision.",
              },
              { id: "rights", label: "Ignoring access requests", category: "50", why: "Item 7." },
            ]}
            explanation="Security failures carry the highest cap, then breach notices and children's data, then Significant Data Fiduciary duties; everything else is up to ₹50 crore."
          />
        </div>
      }
    >
      <p>Sort each breach by its cap.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Caps, not prices", "From ₹50 crore to ₹250 crore; ₹10,000 for individuals."],
  ["Only significant breaches", "Found after an inquiry, weighing set factors."],
  ["Mitigation counts", "Fast, effective fixes weigh in your favour."],
  ["Undertakings and appeals", "Promise to fix; appeal to TDSAT."],
  ["No compensation", "Penalties go to the Consolidated Fund."],
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
      <p>Next: turning all these duties into code. Privacy by design for engineers.</p>
    </StepLayout>
  );
}
