"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ConsistencyState } from "./state";

/* 1 ─ The line goes dead ⭐ --------------------------------------------------------------------- */

interface Frame {
  title: string;
  text: string;
  link: boolean;
  mumbai: string;
  delhi: string;
  tone?: "good" | "bad";
  choose?: boolean;
}

function frames(choice: ConsistencyState["choice"]): Frame[] {
  const base: Frame[] = [
    {
      title: "Two copies, in step",
      text: "Brewline's wallet balances are copied between data centres in Mumbai and Delhi. Priya has ₹500.",
      link: true,
      mumbai: "Priya: ₹500",
      delhi: "Priya: ₹500",
    },
    {
      title: "The link goes down",
      text: "A cable cut: the two sites can't talk. Each is still running and still taking requests. This is a network partition.",
      link: false,
      mumbai: "Priya: ₹500",
      delhi: "Priya: ₹500",
    },
    {
      title: "Priya pays ₹400 in Mumbai…",
      text: "…and at the same moment, her brother (on the same family wallet) tries to pay ₹300 through Delhi. Delhi can't check with Mumbai. What should it do?",
      link: false,
      mumbai: "Priya: ₹100",
      delhi: "Priya: ₹500 (stale)",
      choose: true,
    },
  ];
  if (choice === "refuse")
    return [
      ...base,
      {
        title: "Delhi refuses",
        text: "Delhi can't be sure of the balance, so it rejects the payment: 'Try again later'. An unhappy customer, but no money created from nothing.",
        link: false,
        mumbai: "Priya: ₹100",
        delhi: "✗ payment refused",
        tone: "good",
      },
      {
        title: "The link returns",
        text: "Both sites agree: ₹100. During the partition, Delhi chose consistency and gave up availability.",
        link: true,
        mumbai: "Priya: ₹100",
        delhi: "Priya: ₹100",
        tone: "good",
      },
    ];
  if (choice === "accept")
    return [
      ...base,
      {
        title: "Delhi accepts",
        text: "Delhi approves ₹300 from its stale ₹500. Both payments succeed. The customer is happy, for now.",
        link: false,
        mumbai: "Priya: ₹100",
        delhi: "Priya: ₹200",
        tone: "bad",
      },
      {
        title: "The link returns",
        text: "₹700 was spent from ₹500. The sites disagree and someone must reconcile: an overdraft to chase. Delhi chose availability over consistency.",
        link: true,
        mumbai: "Priya: −₹200 ?",
        delhi: "Priya: −₹200 ?",
        tone: "bad",
      },
    ];
  return base;
}

export function LineGoesDead() {
  const [s, set] = useSceneState<ConsistencyState>();
  const fs = frames(s.choice);
  const step = Math.min(s.frame, fs.length - 1);
  const f = fs[step];
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The line goes dead"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            {(["Mumbai", "Delhi"] as const).map((city, i) => (
              <motion.div
                key={city}
                layout
                className={cn(
                  "rounded-xl border px-3 py-3 text-center",
                  i === 1 && f.delhi.startsWith("✗")
                    ? "border-line bg-surface-2"
                    : "border-viz-data/50 bg-viz-data/10",
                  (f.mumbai.includes("−") || f.delhi.includes("−")) && "border-bad bg-bad/10",
                )}
                style={{ order: i === 0 ? 0 : 2 }}
              >
                <p className="text-sm font-semibold">{city}</p>
                <motion.p
                  key={i === 0 ? f.mumbai : f.delhi}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-xs"
                >
                  {i === 0 ? f.mumbai : f.delhi}
                </motion.p>
              </motion.div>
            ))}
            <div style={{ order: 1 }} className="flex flex-col items-center">
              <motion.div
                animate={{ opacity: f.link ? 1 : 0.3, scaleX: f.link ? 1 : 0.4 }}
                className={cn("h-0.5 w-12 sm:w-24", f.link ? "bg-accent" : "bg-bad")}
              />
              <span className={cn("text-[10px]", f.link ? "text-muted" : "text-bad")}>
                {f.link ? "in sync" : "partitioned"}
              </span>
            </div>
          </div>
          {f.choose && (
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => set({ choice: "refuse", frame: 3 })}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left text-sm",
                  s.choice === "refuse"
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                <strong>Refuse</strong> until it can check with Mumbai
              </button>
              <button
                type="button"
                onClick={() => set({ choice: "accept", frame: 3 })}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left text-sm",
                  s.choice === "accept"
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                <strong>Accept</strong> it with the balance it has
              </button>
            </div>
          )}
          <Stepper
            step={step}
            count={fs.length + (s.choice ? 0 : 0)}
            onChange={(n) => set({ frame: n })}
          />
          <FrameCaption frameKey={`${s.choice}${step}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Two bank branches share an account ledger by phone. The line goes dead. A customer walks
        into each branch and asks to withdraw. Does a branch refuse, or trust its own copy?
      </p>
      <p>
        That&apos;s the <Term id="cap">CAP theorem</Term> in one story: when a network{" "}
        <Term id="partition-network">partition</Term> happens, a system must choose between
        answering (availability) and being correct everywhere (consistency). Step through and
        decide.
      </p>
      <p className="text-muted text-sm">
        There&apos;s no universally right answer: for a wallet, refusing is safer; for a
        &ldquo;likes&rdquo; counter, accepting and fixing up later is fine.
      </p>
    </StepLayout>
  );
}

/* 2 ─ CAP, stated carefully ------------------------------------------------------------------------ */

export function CapCarefully() {
  const [s, set] = useSceneState<ConsistencyState>();
  const M: Record<ConsistencyState["model"], { title: string; text: string; sees: string[] }> = {
    linearizable: {
      title: "Linearizable (strong)",
      text: "Once a write completes, every later read, from anyone, sees it. As if there were one copy.",
      sees: ["Latte ₹200"],
    },
    causal: {
      title: "Causal",
      text: "Things that depend on each other are seen in order (a reply never before its message), but unrelated changes may arrive in different orders.",
      sees: ["Latte ₹180", "Latte ₹200", "never the reply before the post"],
    },
    eventual: {
      title: "Eventual",
      text: "If writes stop, all copies eventually agree. Until then, a read may return any recent value.",
      sees: ["Latte ₹180", "Latte ₹200"],
    },
  };
  const m = M[s.model];
  return (
    <StepLayout
      eyebrow="Precisely"
      title="What can a reader see?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.model}
            options={[
              ["linearizable", "Linearizable"],
              ["causal", "Causal"],
              ["eventual", "Eventual"],
            ]}
            onChange={(v) => set({ model: v as ConsistencyState["model"] })}
          />
          <div className="border-line bg-surface rounded-xl border p-4 text-sm">
            <p>
              <span className="text-muted">10:00:00 </span>The price of a latte changes from ₹180 to
              ₹200. The write completes.
            </p>
            <p className="mt-1">
              <span className="text-muted">10:00:01 </span>Arjun, on another server, reads the
              price. He could see:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {m.sees.map((x) => (
                  <motion.span
                    key={s.model + x}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "rounded-full border px-3 py-1 font-mono text-xs",
                      x.includes("180")
                        ? "border-bad/50 bg-bad/10"
                        : x.startsWith("never")
                          ? "border-line text-muted"
                          : "border-good/50 bg-good/10",
                    )}
                  >
                    {x}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <FrameCaption frameKey={s.model} title={m.title}>
            {m.text}
          </FrameCaption>
          <div className="border-line bg-surface grid gap-1 rounded-xl border px-4 py-3 text-xs">
            <p>
              <strong>CAP, precisely:</strong> during a network partition, a system can&apos;t be
              both linearizable and answer every request at every working node.
            </p>
            <p className="text-muted">
              &ldquo;P&rdquo; isn&apos;t a choice: networks do fail. The real question is what you
              do during a partition. PACELC adds: <em>else</em>, even when all is well, you trade
              latency against consistency, because waiting for far-away copies takes time.
            </p>
          </div>
        </div>
      }
    >
      <p>
        &ldquo;Consistent&rdquo; means different things. These{" "}
        <Term id="consistency-model">consistency models</Term> run from strongest to weakest.
        Stronger is easier to reason about; weaker is faster and more available.
      </p>
      <p className="text-muted text-sm">
        Brewer himself wrote in 2012 that the popular &ldquo;pick two of three&rdquo; version
        &ldquo;was always misleading&rdquo;.
      </p>
    </StepLayout>
  );
}
