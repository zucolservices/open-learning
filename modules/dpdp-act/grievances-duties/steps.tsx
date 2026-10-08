"use client";

import { motion } from "motion/react";
import { ArrowRight, Train, Store, Landmark } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DUTIES, PATH } from "./model";
import type { GrievState } from "./state";

/* 1 ─ Story: a refund that never came -------------------------------------------------------------- */

export function Refund() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The refund that never came"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            {[
              { Icon: Train, t: "Booking helpdesk" },
              { Icon: Store, t: "Complaints officer" },
              { Icon: Landmark, t: "Consumer commission" },
            ].map(({ Icon, t }, i) => (
              <div key={t} className="flex items-center gap-2">
                <div className="border-line bg-surface flex w-28 flex-col items-center rounded-xl border p-2 text-center">
                  <Icon className="text-accent size-5" />
                  <span className="mt-1">{t}</span>
                </div>
                {i < 2 && <ArrowRight className="text-subtle size-4" />}
              </div>
            ))}
          </div>
          <p className="text-subtle text-[11px]">First the company. Then the regulator.</p>
        </div>
      }
    >
      <p>
        A cancelled train ticket&apos;s refund never arrives. You don&apos;t start with a court: you
        call the helpdesk, then write to the complaints officer, and only then go to a consumer
        commission. Each step gives the company a chance to fix it.
      </p>
      <p>
        The DPDP Act sets up the same ladder for personal data. Every organisation must run{" "}
        <Term id="grievance-redressal">grievance redressal</Term>, and people must use it before
        complaining to the Data Protection Board. These duties apply from May 2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Follow the complaint ⭐ ---------------------------------------------------------------------- */

export function FollowComplaint() {
  const [s, set] = useSceneState<GrievState>();
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Follow a complaint to the Board"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <ol className="grid gap-1.5">
            {PATH.map((p, i) => {
              const on = i <= s.stage;
              return (
                <motion.li
                  key={p.id}
                  animate={{ opacity: on ? 1 : 0.25 }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    i === s.stage ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold">
                      <span className="text-accent mr-1.5 font-mono text-xs">{i + 1}</span>
                      {p.title}
                    </span>
                    <span className="text-subtle text-[10px]">{p.who}</span>
                  </div>
                  {on && (
                    <>
                      <p className="mt-0.5">{p.body}</p>
                      <p className="text-muted mt-0.5 text-[10px]">⏱ {p.when}</p>
                    </>
                  )}
                </motion.li>
              );
            })}
          </ol>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={s.stage >= PATH.length - 1}
              onClick={() => set({ stage: s.stage + 1 })}
              className="bg-accent text-accent-fg inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              What happens then? <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => set({ stage: 0 })}
              className="border-line text-muted rounded-full border px-4 py-1.5 text-xs"
            >
              Start over
            </button>
          </div>
          <p className="text-subtle text-[10px]">
            As of October 2026 the Board exists in law, but its chair and members haven&apos;t been
            appointed and there is no complaint portal yet.
          </p>
        </div>
      }
    >
      <p>
        Ravi asked a made-up shopping app to erase his data and heard nothing. Follow his complaint
        through every stage, from the app&apos;s grievance desk to the Board and on to appeal.
      </p>
      <p>
        For engineers, stage 1 is the one you build: a published channel, a response period of at
        most 90 days, tracking against it, and a record that the grievance was closed. The Board
        will ask whether the person used it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Nomination ---------------------------------------------------------------------------------- */

const NOMINATION = {
  none: "Ravi names his sister as nominee in the app's privacy settings. Nothing happens yet; the app just records the choice.",
  death:
    "Ravi dies. His sister, as nominee, can now use his rights: access his data, or ask for it to be erased.",
  incapacity:
    "Ravi becomes unable to manage his affairs through illness. His nominee can act for him.",
} as const;

export function Nomination() {
  const [s, set] = useSceneState<GrievState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Someone to act for you"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.event}
            onChange={(v) => set({ event: v })}
            options={[
              ["none", "Ravi nominates"],
              ["death", "Ravi dies"],
              ["incapacity", "Ravi is incapacitated"],
            ]}
            size="sm"
          />
          <motion.div
            key={s.event}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-4 text-sm"
          >
            {NOMINATION[s.event]}
          </motion.div>
          <p className="text-muted text-xs">
            The Rules let a person nominate one or more individuals, following the app&apos;s own
            terms. Engineering need: a nominee record, and a way to verify a nominee when they come
            forward.
          </p>
        </div>
      }
    >
      <p>
        Section 14 lets a person <Term id="nomination">nominate</Term> someone to exercise their
        rights if they die or become incapable, through unsoundness of mind or infirmity of body.
      </p>
      <p>
        This is separate from a parent or guardian acting for a child or a person with a disability,
        who counts as the Data Principal from the start.
      </p>
    </StepLayout>
  );
}

/* 4 ─ People's duties ------------------------------------------------------------------------------ */

export function PeoplesDuties() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Duties run both ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {DUTIES.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{k}</p>
              <p className="text-muted">{v}</p>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            Breaching these can draw a penalty of up to ₹10,000.
          </p>
        </div>
      }
    >
      <p>
        Unusually, the Act gives Data Principals duties too. Section 15 lists five, such as not
        impersonating anyone and not filing false or frivolous complaints.
      </p>
      <p>
        An honest complaint that fails isn&apos;t punished. Only false or frivolous ones can draw a
        warning or costs from the Board, or a penalty after an inquiry.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function OrderCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the path in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="dpdp-grievance"
            prompt="Drag the steps of a complaint into the right order."
            items={[
              { id: "desk", label: "File a grievance with the app" },
              { id: "wait", label: "Get the app's answer, within its period of at most 90 days" },
              { id: "board", label: "Complain to the Data Protection Board" },
              { id: "screen", label: "The Board decides whether to inquire" },
              { id: "inquiry", label: "Inquiry, possibly with a voluntary undertaking" },
              { id: "appeal", label: "Appeal to TDSAT within 60 days" },
            ]}
            explanation="The app's grievance route comes first; only then the Board, which screens, inquires and decides. Appeals go to TDSAT."
          />
        </div>
      }
    >
      <p>Order the steps.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Grievance first", "People must use your route before the Board."],
  ["At most 90 days", "Publish your period and meet it."],
  ["A digital Board", "Online complaints; inquiries within 6 months."],
  ["No compensation", "Penalties go to the government."],
  ["Nominees and duties", "Someone can act for you; false complaints cost."],
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
        That completes the rights chapter. Next: special cases, starting with children&apos;s data.
      </p>
    </StepLayout>
  );
}
