"use client";

import { motion } from "motion/react";
import { KeyRound, User, Building2, Brush } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTORS, CHAIN, ROLE_LABEL, VENDOR_MODES, type Role } from "./model";
import type { RolesState } from "./state";

/* 1 ─ Story: the caretaker and the keys ------------------------------------------------------------ */

const KEY_CHAIN = [
  { Icon: User, title: "You", sub: "own the flat" },
  { Icon: Building2, title: "The caretaker", sub: "holds your keys, decides who goes in" },
  { Icon: Brush, title: "The cleaner", sub: "hired by the caretaker" },
];

export function Keys() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Who holds the keys?"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {KEY_CHAIN.map(({ Icon, title, sub }, i) => (
              <div key={title} className="flex flex-col items-center gap-2 sm:flex-row">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i }}
                  className={cn(
                    "border-line bg-surface flex w-44 flex-col items-center rounded-xl border p-3 text-center",
                    i === 1 && "border-accent bg-accent-soft",
                  )}
                >
                  <Icon className="text-accent size-5" />
                  <p className="mt-1 text-sm font-semibold">{title}</p>
                  <p className="text-muted text-[11px]">{sub}</p>
                </motion.div>
                {i < 2 && <KeyRound className="text-subtle size-4 rotate-90 sm:rotate-0" />}
              </div>
            ))}
          </div>
          <p className="text-subtle max-w-sm text-center text-[11px]">
            If the cleaner loses your keys, you don&apos;t chase the cleaner. You ask the caretaker,
            who chose to hire them.
          </p>
        </div>
      }
    >
      <p>
        You go away and leave your flat keys with the building&apos;s caretaker. The caretaker
        decides who goes in and why, and hires a cleaner to come in on Tuesdays. You trust the
        caretaker; you&apos;ve never met the cleaner.
      </p>
      <p>
        The DPDP Act sees personal data the same way. The person the data is about is the{" "}
        <Term id="data-principal">Data Principal</Term>. The organisation trusted with it, which
        decides why and how it&apos;s used, is the <Term id="data-fiduciary">Data Fiduciary</Term>:
        &ldquo;fiduciary&rdquo; means someone trusted to act for you. Anyone it hires to handle the
        data is a <Term id="data-processor">Data Processor</Term>. And the caretaker stays
        answerable for the cleaner.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tag the order ⭐ ----------------------------------------------------------------------------- */

const ROLES: Role[] = ["principal", "fiduciary", "processor", "none"];

export function TagTheOrder() {
  const [s, set] = useSceneState<RolesState>();
  const done = ACTORS.filter((a) => s.picks[a.id]).length;
  const right = ACTORS.filter((a) => s.picks[a.id] === a.role).length;
  return (
    <StepLayout
      eyebrow="Build"
      title="Tag everyone in one food order"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-[10px] uppercase">
            One order on DabbaGo, a made-up delivery app · {done}/{ACTORS.length} tagged · {right}{" "}
            right
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ACTORS.map((a) => {
              const pick = s.picks[a.id];
              const ok = pick === a.role;
              return (
                <div
                  key={a.id}
                  className={cn(
                    "rounded-xl border p-3 text-xs transition-colors",
                    !pick && "border-line bg-surface",
                    pick && ok && "border-good/50 bg-good/10",
                    pick && !ok && "border-bad/50 bg-bad/10",
                  )}
                >
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="text-muted">{a.does}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        aria-pressed={pick === r}
                        onClick={() => set({ picks: { ...s.picks, [a.id]: r } })}
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[11px] transition-colors",
                          pick === r
                            ? "border-accent bg-accent text-accent-fg"
                            : "border-line-strong text-muted hover:text-fg",
                        )}
                      >
                        {ROLE_LABEL[r]}
                      </button>
                    ))}
                  </div>
                  {pick && <p className="mt-1.5">{ok ? a.why : "Not quite. Who decides why?"}</p>}
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        Asha orders dinner on DabbaGo. Six parties touch, or watch over, Asha&apos;s data. Tag each
        one with its role.
      </p>
      <p>
        The test is always the same: <strong>who decides the purpose and the means?</strong> That
        party is a fiduciary. Anyone acting only on its instructions is a processor. A role belongs
        to a party for a particular use of the data, so one company can be a processor for one job
        and a fiduciary for another.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Purpose and means ---------------------------------------------------------------------------- */

export function PurposeAndMeans() {
  const [s, set] = useSceneState<RolesState>();
  const mode = VENDOR_MODES.find((v) => v.id === s.vendor) ?? VENDOR_MODES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Same vendor, different role"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">An analytics vendor inside DabbaGo</p>
          <div className="grid gap-1.5">
            {VENDOR_MODES.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={v.id === s.vendor}
                onClick={() => set({ vendor: v.id })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition",
                  v.id === s.vendor
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-4"
          >
            <p className="text-muted text-[10px] uppercase">The vendor is a</p>
            <p className="text-accent text-lg font-semibold">{mode.role}</p>
            <p className="mt-1 text-sm">{mode.detail}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Labels in a contract don&apos;t decide roles; behaviour does. Change what the analytics
        vendor does with the data and watch its role change.
      </p>
      <p>
        This matters to engineers because every SDK, API and integration you add is a vendor
        decision. If a vendor uses your users&apos; data for its own ends, it isn&apos;t just your
        processor any more.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who answers? --------------------------------------------------------------------------------- */

export function WhoAnswers() {
  const [s, set] = useSceneState<RolesState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="When the vendor slips, who answers?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <ol className="grid gap-1.5">
            {CHAIN.map((c, i) => (
              <motion.li
                key={c.id}
                animate={{ opacity: i <= s.chain ? 1 : 0.25 }}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  i === s.chain ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="text-sm font-semibold">
                  <span className="text-accent mr-1.5 font-mono text-xs">{i + 1}</span>
                  {c.title}
                </p>
                {i <= s.chain && <p className="text-muted mt-0.5 text-xs">{c.body}</p>}
              </motion.li>
            ))}
          </ol>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={s.chain >= CHAIN.length - 1}
              onClick={() => set({ chain: s.chain + 1 })}
              className="bg-accent text-accent-fg rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              What happens then?
            </button>
            <button
              type="button"
              onClick={() => set({ chain: 0 })}
              className="border-line text-muted rounded-full border px-4 py-1.5 text-xs"
            >
              Start over
            </button>
          </div>
        </div>
      }
    >
      <p>
        The Act puts almost every duty on the fiduciary. Processors are reached through the
        fiduciary: it must hire them under a valid contract, keep them secure, and make them stop or
        erase when needed.
      </p>
      <p>
        Two more things about who counts as a Data Principal. For a child, which means anyone under
        18, it includes the parent or lawful guardian, and the same goes for the guardian of a
        person with a disability. And the Act calls every individual &ldquo;she&rdquo;; it says this
        covers everyone, whatever their gender.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function RoleCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name the role"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-roles"
            prompt="A made-up clinic app, CareNest, books appointments. What is each party?"
            categories={[
              { id: "principal", label: "Principal" },
              { id: "fiduciary", label: "Fiduciary" },
              { id: "processor", label: "Processor" },
            ]}
            items={[
              {
                id: "patient",
                label: "A patient who books a check-up",
                category: "principal",
                why: "The data is about them.",
              },
              {
                id: "clinic",
                label: "CareNest, which decides what to collect and why",
                category: "fiduciary",
                why: "It decides purpose and means.",
              },
              {
                id: "email",
                label: "An email service that sends CareNest's reminders",
                category: "processor",
                why: "It acts only on CareNest's behalf.",
              },
              {
                id: "parent",
                label: "The parent booking for a 9-year-old",
                category: "principal",
                why: "For a child, the Data Principal includes the parent.",
              },
              {
                id: "lab",
                label: "A lab that also uses results to market its own tests",
                category: "fiduciary",
                why: "Its own marketing is its own purpose.",
              },
              {
                id: "backup",
                label: "A backup provider storing CareNest's encrypted copies",
                category: "processor",
                why: "It stores data on CareNest's behalf.",
              },
            ]}
            explanation="Ask who decides purpose and means. That party is a fiduciary for that use; anyone acting only on its instructions is a processor."
          />
        </div>
      }
    >
      <p>Sort each party by its role.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Data Principal", "The person the data is about (or their parent or guardian)."],
  ["Data Fiduciary", "Decides the purpose and means; carries the duties."],
  ["Data Processor", "Processes on the fiduciary's behalf, under a contract."],
  ["Roles follow behaviour", "Use data for your own ends and you become a fiduciary."],
  ["Responsibility doesn't move", "The fiduciary answers for its processors."],
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
      <p>
        Two more roles come later: <Term id="consent-manager">consent managers</Term>, and{" "}
        <Term id="significant-data-fiduciary">Significant Data Fiduciaries</Term> with extra duties.
        Next: which data, and which organisations, the Act covers at all.
      </p>
    </StepLayout>
  );
}
