"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AUDIT, FIELD, FINDINGS, FIXES, PROVE, type Metric } from "./model";
import type { CapState } from "./state";

const METRICS: { id: Metric; label: string }[] = [
  { id: "lcp", label: "LCP" },
  { id: "inp", label: "INP" },
  { id: "cls", label: "CLS" },
  { id: "none", label: "None" },
];

function Stat({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border px-2 py-1.5 text-center text-xs",
        good ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <p className="font-mono font-semibold">{value}</p>
    </div>
  );
}

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Complaint() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“The product page is awful on my phone”"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            "“It takes forever to show the photo.”",
            "“I tapped Add to cart and nothing happened, so I tapped again and got two.”",
            "“The page jumped and I hit the wrong button.”",
            "“I use a screen reader and couldn't tell what anything was.”",
          ].map((q, i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              {q}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Support tickets are piling up about a café chain&apos;s online shop (made up). Your task:
        find out why, fix the most important problems first, and prove the page got better.
      </p>
      <p>
        Everything in this track comes together here: the rendering pipeline, the event loop, Core
        Web Vitals, images, accessibility and security.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Evidence ------------------------------------------------------------------------------------- */

export function Evidence() {
  const [s, set] = useSceneState<CapState>();
  const right = (id: string) => s.matches[id] === FINDINGS.find((f) => f.id === id)!.answer;
  const done = FINDINGS.every((f) => right(f.id));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Read the evidence"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-[10px]">
            Field data: real mobile visitors, 75th percentile
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="LCP" value={`${FIELD.lcp} s`} good={false} />
            <Stat label="INP" value={`${FIELD.inp} ms`} good={false} />
            <Stat label="CLS" value={String(FIELD.cls)} good={false} />
          </div>
          <p className="text-muted mt-1 text-[10px]">
            Lab trace findings: which vital does each explain?
          </p>
          {FINDINGS.map((f) => (
            <div
              key={f.id}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 basis-full sm:flex-1 sm:basis-auto">{f.text}</span>
                <div className="flex gap-1">
                  {METRICS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={s.matches[f.id] === m.id}
                      onClick={() => set({ matches: { ...s.matches, [f.id]: m.id } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        s.matches[f.id] === m.id
                          ? right(f.id)
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              {s.matches[f.id] && (
                <p className={cn("mt-0.5 text-[10px]", right(f.id) ? "text-good" : "text-muted")}>
                  {right(f.id)
                    ? f.why
                    : "Think about what users experience: waiting for content, slow reactions, or movement."}
                </p>
              )}
            </div>
          ))}
          {done && (
            <p className="text-good text-xs">
              Every complaint now has a cause. One finding is a red herring.
            </p>
          )}
        </div>
      }
    >
      <p>
        Field data says <em>whether</em> users have a problem; a lab trace from the browser&apos;s
        performance tools says <em>why</em>. All three vitals are failing for real visitors.
      </p>
      <p>Match each finding from the trace to the vital it explains.</p>
    </StepLayout>
  );
}

/* 3 ─ Prioritise ⭐ -------------------------------------------------------------------------------- */

export function Prioritise() {
  const [s, set] = useSceneState<CapState>();
  const v = { ...FIELD };
  for (const f of FIXES)
    if (s.fixes.includes(f.id)) {
      v.lcp += f.lcp ?? 0;
      v.inp += f.inp ?? 0;
      v.cls += f.cls ?? 0;
    }
  const toggle = (id: string) => {
    if (s.fixes.includes(id)) set({ fixes: s.fixes.filter((x) => x !== id) });
    else if (s.fixes.length < 3) set({ fixes: [...s.fixes, id] });
  };
  const allGood = v.lcp <= 2.5 && v.inp <= 200 && v.cls <= 0.1;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Three fixes this sprint"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="LCP" value={`${v.lcp.toFixed(1)} s`} good={v.lcp <= 2.5} />
            <Stat label="INP" value={`${Math.round(v.inp)} ms`} good={v.inp <= 200} />
            <Stat label="CLS" value={v.cls.toFixed(2)} good={v.cls <= 0.1} />
          </div>
          <p className="text-muted text-[11px]">Chosen: {s.fixes.length} of 3</p>
          {FIXES.map((f) => {
            const on = s.fixes.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                disabled={!on && s.fixes.length >= 3}
                onClick={() => toggle(f.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs disabled:opacity-40",
                  on ? "border-fg bg-surface-2" : "border-line bg-surface",
                )}
              >
                <span>{f.label}</span>
                <span className="text-subtle"> · effort: {f.effort}</span>
                {on && <span className="text-muted block text-[10px]">{f.note}</span>}
              </button>
            );
          })}
          {allGood && (
            <p className="text-good text-xs">
              Three small-to-medium fixes, aimed at the causes, got all three vitals to good (in
              this simulation).
            </p>
          )}
        </div>
      }
    >
      <p>
        You have time for three fixes this sprint. Some are cheap and powerful, some feel productive
        but change nothing, and one is a trap.
      </p>
      <p>Pick three and watch the expected field numbers. You can swap choices freely.</p>
    </StepLayout>
  );
}

/* 4 ─ Everyone ------------------------------------------------------------------------------------- */

export function Everyone() {
  const [s, set] = useSceneState<CapState>();
  const right = (id: string) =>
    s.audit[id] !== undefined && s.audit[id] === AUDIT.find((a) => a.id === id)!.now;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fast for everyone, safe for everyone"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {AUDIT.map((a) => (
            <div
              key={a.id}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1">{a.text}</span>
                <div className="flex gap-1">
                  {[
                    [true, "Fix now"],
                    [false, "Ticket for later"],
                  ].map(([val, l]) => (
                    <button
                      key={l as string}
                      type="button"
                      aria-pressed={s.audit[a.id] === val}
                      onClick={() => set({ audit: { ...s.audit, [a.id]: val as boolean } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        s.audit[a.id] === val
                          ? right(a.id)
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {l as string}
                    </button>
                  ))}
                </div>
              </div>
              {s.audit[a.id] !== undefined && (
                <p className={cn("mt-0.5 text-[10px]", right(a.id) ? "text-good" : "text-muted")}>
                  {a.why}
                </p>
              )}
            </div>
          ))}
        </div>
      }
    >
      <p>
        A fast page that some people can&apos;t use, or that leaks sessions, isn&apos;t fixed. A
        quick audit with a keyboard, a screen reader and a security review found four more issues.
      </p>
      <p>Decide which must be fixed now and which can wait for a ticket.</p>
    </StepLayout>
  );
}

/* 5 ─ Prove it ------------------------------------------------------------------------------------- */

export function Prove() {
  const [s, set] = useSceneState<CapState>();
  const p = PROVE.find((x) => x.id === s.prove);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Prove it worked"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">The day after release</p>
            <p className="text-muted">
              The lab trace looks great. Chrome&apos;s public field data for the page still shows
              LCP 4.6 s.
            </p>
          </div>
          {PROVE.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={s.prove === x.id}
              onClick={() => set({ prove: x.id })}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-left text-xs",
                s.prove === x.id
                  ? x.best
                    ? "border-good bg-good/15"
                    : "border-bad bg-bad/10"
                  : "border-line bg-surface",
              )}
            >
              {x.label}
            </button>
          ))}
          {p && <p className={cn("text-xs", p.best ? "text-good" : "text-muted")}>{p.outcome}</p>}
        </div>
      }
    >
      <p>
        The release is out. Lab tools confirm the fixes, but the public field data hasn&apos;t
        budged. What do you do?
      </p>
      <p>
        Lighthouse scores also vary between runs; compare several, and treat the score as a
        diagnostic, not a grade.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The performance workflow"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="frontend-capstone"
            prompt="Put these steps in order, first to last."
            items={[
              { id: "field", label: "Check field data: is there a real problem, and which vital?" },
              { id: "lab", label: "Reproduce it in the lab with realistic throttling" },
              { id: "cause", label: "Find the cause in a performance trace" },
              { id: "fix", label: "Fix the highest-impact cause first" },
              { id: "verify", label: "Verify in the lab, then confirm in field data" },
            ]}
            explanation="Field data tells you whether and where; the lab tells you why. Fix the biggest cause, then confirm with real users."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Start from evidence", "Field data, then a lab trace."],
        ["Fix causes, not symptoms", "No spinners over slow pages."],
        ["Biggest impact first", "Small fixes often win."],
        ["Everyone counts", "Accessibility and security are part of done."],
        ["Prove it with real users", "Field data lags; watch the trend."],
      ]}
    >
      <p>
        That completes Frontend. You can now explain why a page is slow, broken or hard to use, and
        how to fix it, in any framework. See the <Term id="core-web-vitals">Core Web Vitals</Term>{" "}
        module for the thresholds any time.
      </p>
    </WrapStep>
  );
}
