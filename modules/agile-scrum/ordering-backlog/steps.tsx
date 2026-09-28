"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HORIZON, ITEMS, evaluate, order, type OrderingId } from "./model";
import type { OrderState } from "./state";

/* 1 ─ Everything can't come first ----------------------------------------------------------------- */

export function Errands() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Everything can't come first"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border p-4">
            <p className="text-muted text-[11px] uppercase">Prioritised</p>
            <div className="mt-2 grid gap-1.5">
              {[
                "Medicine for Appa",
                "Wedding shopping",
                "Pay electricity bill",
                "Collect tailoring",
              ].map((t) => (
                <div
                  key={t}
                  className="border-line flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs"
                >
                  {t}
                  <span className="bg-bad/15 text-bad rounded px-1.5 text-[10px] font-semibold">
                    HIGH
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted mt-2 text-xs">Everything is “high”. So what happens first?</p>
          </div>
          <div className="border-accent/40 bg-accent-soft rounded-xl border p-4">
            <p className="text-muted text-[11px] uppercase">Ordered</p>
            <div className="mt-2 grid gap-1.5">
              {[
                ["Medicine for Appa", "10 min, urgent"],
                ["Pay electricity bill", "5 min, due today"],
                ["Collect tailoring", "15 min, on the way"],
                ["Wedding shopping", "3 hours"],
              ].map(([t, why], i) => (
                <div
                  key={t}
                  className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs"
                >
                  <span className="text-accent font-mono font-semibold">{i + 1}</span>
                  <span className="flex-1">{t}</span>
                  <span className="text-muted text-[10px]">{why}</span>
                </div>
              ))}
            </div>
            <p className="text-muted mt-2 text-xs">One sequence. Short, urgent things first.</p>
          </div>
        </div>
      }
    >
      <p>
        A Saturday of errands: if you label every one &ldquo;high priority&rdquo;, you still have to
        decide which to do first. A quick, urgent errand before a three-hour trip makes sense.
      </p>
      <p>
        The Scrum Guide calls the Product Backlog &ldquo;an emergent, ordered list&rdquo;. It said
        &ldquo;prioritized&rdquo; until 2011; earlier guides noted it was &ldquo;often ordered by
        value, risk, priority, and necessity&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Order the backlog ⭐ (simulation) -------------------------------------------------------------- */

const ORDERINGS: [OrderingId, string][] = [
  ["arrival", "As requests arrived"],
  ["moscow", "MoSCoW"],
  ["value", "Highest value first"],
  ["cd3", "Cost of delay ÷ duration"],
  ["yours", "Your order"],
];

export function OrderIt() {
  const [s, set] = useSceneState<OrderState>();
  const mine = s.mine.length === ITEMS.length ? s.mine : order("arrival");
  const ids = s.ordering === "yours" ? mine : order(s.ordering);
  const plan = evaluate(ids);
  const all = (["arrival", "moscow", "value", "cd3"] as const).map(
    (o) => [o, evaluate(order(o))] as const,
  );
  const best = Math.min(...all.map(([, p]) => p.delayCost));
  const maxV = Math.max(...all.map(([, p]) => p.curve[HORIZON]), plan.curve[HORIZON]);
  const x = (w: number) => 26 + (w / HORIZON) * 300;
  const y = (v: number) => 130 - (v / maxV) * 118;
  const path = (c: number[]) => c.map((v, w) => `${w ? "L" : "M"}${x(w)},${y(v)}`).join(" ");
  const move = (i: number, d: number) => {
    const next = [...mine];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ mine: next, ordering: "yours" });
  };
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Order the backlog"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.ordering}
            options={ORDERINGS}
            onChange={(v) => set({ ordering: v })}
          />
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
            <div className="grid content-start gap-1">
              {ids.map((id, i) => {
                const it = ITEMS.find((t) => t.id === id)!;
                return (
                  <motion.div
                    key={id}
                    layout
                    className="border-line bg-surface flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[11px]"
                  >
                    <span className="text-muted w-4 font-mono">{i + 1}</span>
                    <span className="flex-1">
                      {it.label}
                      {it.note && <span className="text-subtle block text-[9px]">{it.note}</span>}
                    </span>
                    <span
                      className="text-muted font-mono text-[10px]"
                      title="value per week / weeks"
                    >
                      {it.cod}/wk · {it.weeks}w
                    </span>
                    <span className="bg-surface-2 rounded px-1 text-[9px]">{it.moscow}</span>
                    {s.ordering === "yours" && (
                      <span className="flex flex-col">
                        <button
                          type="button"
                          aria-label="Move up"
                          onClick={() => move(i, -1)}
                          className="hover:text-accent"
                        >
                          <ArrowUp className="size-3" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          onClick={() => move(i, 1)}
                          className="hover:text-accent"
                        >
                          <ArrowDown className="size-3" />
                        </button>
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              <div className="border-line bg-surface rounded-xl border p-2">
                <svg
                  viewBox="0 0 340 150"
                  className="w-full"
                  role="img"
                  aria-label="Value delivered over 26 weeks"
                >
                  {all.map(([o, p]) => (
                    <path
                      key={o}
                      d={path(p.curve)}
                      fill="none"
                      className="stroke-viz-idle/50"
                      strokeWidth={1}
                    />
                  ))}
                  <motion.path
                    initial={false}
                    animate={{ d: path(plan.curve) }}
                    fill="none"
                    className="stroke-accent"
                    strokeWidth={2.5}
                  />
                  <line
                    x1={x(0)}
                    y1={130}
                    x2={x(HORIZON)}
                    y2={130}
                    className="stroke-line-strong"
                  />
                  {[0, 13, 26].map((w) => (
                    <text
                      key={w}
                      x={x(w)}
                      y={144}
                      textAnchor={w === 0 ? "start" : w === 26 ? "end" : "middle"}
                      className="fill-muted text-[8px]"
                    >
                      week {w}
                    </text>
                  ))}
                  <text x={x(0)} y={10} className="fill-muted text-[8px]">
                    value delivered so far
                  </text>
                </svg>
              </div>
              <div
                className={cn(
                  "rounded-xl border px-3 py-2",
                  plan.delayCost <= best ? "border-good/40 bg-good/10" : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[10px]">Value lost to delay (lower is better)</p>
                <p className="font-mono text-lg">{plan.delayCost.toFixed(0)}</p>
                <p className="text-muted text-[10px]">
                  {all
                    .map(
                      ([o, p]) =>
                        `${ORDERINGS.find((x) => x[0] === o)![1]}: ${p.delayCost.toFixed(0)}`,
                    )
                    .join(" · ")}
                </p>
              </div>
              <p className="border-line bg-surface-2 rounded-xl border px-3 py-2 text-xs">
                {s.ordering === "arrival"
                  ? "First come, first served: the analytics dashboard (low value, 4 weeks) holds up the UPI payments everyone wants."
                  : s.ordering === "moscow"
                    ? "Better, but MoSCoW only sorts into buckets. Inside “Must”, the six-week item still goes first, and the one-week SMS item waits because it's a “Should”."
                    : s.ordering === "value"
                      ? "The most valuable item first sounds right, but it takes six weeks, and everything else waits behind it."
                      : s.ordering === "cd3"
                        ? "Short, valuable items first: the SMS alert (1 week) and UPI (2 weeks) start paying back almost at once. Least value lost to delay."
                        : "Your own order. Move items up and down: can you beat cost of delay ÷ duration?"}
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative, made-up numbers. One team does one item at a time; an item&apos;s value
            per week starts when it goes live. Value lost to delay = value per week × the week it
            goes live, summed (the method in Black Swan Farming&apos;s CD3 example).
          </p>
        </div>
      }
    >
      <p>
        Same eight items, different orders. Each item is worth something every week once live (its{" "}
        <Term id="cost-of-delay">cost of delay</Term>) and takes some weeks to build.
      </p>
      <p>
        Donald Reinertsen: &ldquo;If you only quantify one thing, quantify the cost of delay.&rdquo;
        Dividing it by duration gives <Term id="wsjf">CD3, or WSJF</Term>: &ldquo;When job durations
        and delay costs are not homogeneous, use WSJF.&rdquo;
      </p>
      <p className="text-muted text-sm">
        Try each ordering, then make your own. Watch the bold line (value delivered) and the value
        lost to delay.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When risk goes first ------------------------------------------------------------------------ */

export function RiskFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="When risk goes first"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="risk-first"
            prompt="Prefilling details from DigiLocker depends on another system the team has never used. Cost of delay ÷ duration puts it fifth. Why might the Product Owner move it earlier?"
            options={[
              {
                id: "learn",
                label:
                  "It's risky and must be done: starting early reveals problems while there's still time to act on them",
                correct: true,
                feedback:
                  "Yes. Mike Cohn: “If something is risky and you need to do it, do it early.” Learning is a reason too: do it “early so you have time to act on whatever you've learned”.",
              },
              {
                id: "value",
                label: "Because it's the most valuable item",
                feedback:
                  "It isn't. Its value is middling; the reason to move it is risk and learning.",
              },
              {
                id: "moscow",
                label: "Because it's a “Should”",
                feedback: "MoSCoW buckets don't set the order within or across buckets.",
              },
              {
                id: "never",
                label: "It shouldn't move: the formula decides",
                feedback:
                  "Formulas inform; people decide. Ordering weighs value, cost, learning, risk and dependencies.",
              },
            ]}
            explanation="If the risky item turns out not to be needed at all, the opposite applies: delay it. Cohn lists value, cost, learning, risk and dependencies as the factors."
          />
        </div>
      }
    >
      <p>The numbers are a guide. Risk, learning and dependencies can change the order.</p>
    </StepLayout>
  );
}

/* 4 ─ Guide or myth? ------------------------------------------------------------------------------- */

export function OrderMyths() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Guide or myth?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="order-myths"
            prompt="Sort each statement about ordering a backlog."
            categories={[
              { id: "true", label: "True" },
              { id: "myth", label: "Myth" },
            ]}
            items={[
              {
                id: "moscow",
                label: "MoSCoW tells you what order to build things in",
                category: "myth",
                why: "It groups items into four buckets; it doesn't sequence them.",
              },
              {
                id: "sixty",
                label: "DSDM recommends Must Haves take no more than about 60% of the effort",
                category: "true",
                why: "The Agile Business Consortium: “not to exceed 60% Must Have effort”, leaving room for surprises.",
              },
              {
                id: "precise",
                label: "WSJF gives a precise, correct order",
                category: "myth",
                why: "It's only as good as rough estimates of value and size; it guides a conversation.",
              },
              {
                id: "safe",
                label: "Weighted Shortest Job First was invented by SAFe",
                category: "myth",
                why: "It comes from Don Reinertsen's work on product development flow; SAFe popularised a version of it.",
              },
              {
                id: "ordered",
                label: "The Scrum Guide calls the Product Backlog “ordered”",
                category: "true",
                why: "“an emergent, ordered list of what is needed to improve the product”.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        MoSCoW stands for Must Have, Should Have, Could Have and Won&apos;t Have this time. It dates
        from Dai Clegg&apos;s work in 1994 and is part of the DSDM method.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ------------------------------------------------------------------------------------------ */

const TAKEAWAYS: [string, string][] = [
  [
    "Order, don't just prioritise",
    "One sequence, top to bottom. “High” for everything decides nothing.",
  ],
  [
    "Think in cost of delay",
    "What does waiting a week cost? Short, valuable items first pay back soonest.",
  ],
  ["Buckets aren't a sequence", "MoSCoW helps agree scope; it doesn't say what comes next."],
  ["Risk and learning count", "Do risky must-haves early; the numbers guide, people decide."],
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
        One warning sign: the order is set by whoever is most senior in the room. Teams call it the
        HiPPO, the highest-paid person&apos;s opinion. Numbers like cost of delay help turn opinions
        into a shared conversation.
      </p>
      <p>That completes the backlog chapter. Next: flow, Kanban and limiting work in progress.</p>
    </StepLayout>
  );
}
