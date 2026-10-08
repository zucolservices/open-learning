"use client";

import { motion } from "motion/react";
import { Pill, Wrench, Check } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LANGUAGES, LINES } from "./model";
import type { NoticeState } from "./state";

/* 1 ─ Story: the label on the strip ---------------------------------------------------------------- */

export function Label() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Read the label first"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
            <div className="border-bad/50 bg-bad/10 rounded-xl border p-3 text-xs">
              <Pill className="text-bad size-5" />
              <p className="mt-1 font-semibold">&ldquo;Take as directed.&rdquo;</p>
              <p className="text-muted mt-1">No ingredients, no dose, no warnings.</p>
            </div>
            <div className="border-good/50 bg-good/10 rounded-xl border p-3 text-xs">
              <Pill className="text-good size-5" />
              <p className="mt-1 font-semibold">Paracetamol 500 mg</p>
              <p className="text-muted mt-1">
                One tablet up to four times a day. Stop and see a doctor if…
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        You wouldn&apos;t take a medicine whose strip just said &ldquo;take as directed&rdquo;. You
        want to know what&apos;s in it, what it&apos;s for and what to do if something goes wrong,
        before you swallow it.
      </p>
      <p>
        A <Term id="dpdp-notice">notice</Term> under the DPDP Act is that label. Before asking for
        consent, an organisation must tell people which personal data it wants, for what purpose,
        how to withdraw consent and use their rights, and how to complain to the Data Protection
        Board. The Rules add that it must stand on its own and be clear. These duties apply from May
        2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the notice ⭐ ---------------------------------------------------------------------------- */

export function FixNotice() {
  const [s, set] = useSceneState<NoticeState>();
  const fixed = new Set(s.fixed);
  const toggle = (id: string) =>
    set({ open: id, fixed: fixed.has(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  const open = LINES.find((l) => l.id === s.open);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix FitPulse's notice"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center justify-between">
            <p className="text-muted text-[10px] uppercase">
              FitPulse, a made-up fitness app · sign-up notice
            </p>
            <p className="text-xs font-medium">
              {fixed.size}/{LINES.length} fixed
            </p>
          </div>
          <div className="border-line bg-surface grid gap-1 rounded-xl border p-2">
            {LINES.map((l) => {
              const ok = fixed.has(l.id);
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={ok}
                  onClick={() => toggle(l.id)}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition",
                    ok ? "border-good/40 bg-good/10" : "border-bad/30 bg-bad/5 hover:bg-bad/10",
                    s.open === l.id && "ring-accent ring-1",
                  )}
                >
                  {ok ? (
                    <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                  ) : (
                    <Wrench className="text-bad mt-0.5 size-3.5 shrink-0" />
                  )}
                  <span>{ok ? l.good : l.bad}</span>
                </button>
              );
            })}
          </div>
          {open && (
            <motion.div
              key={open.id + fixed.has(open.id)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface-2/60 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{open.rule}</span> · {open.why}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        FitPulse&apos;s notice has seven problems. Click a line to fix it, and see which part of the
        Act or Rules it broke.
      </p>
      <p>
        For engineers, the lesson is structure: keep the notice as its own component, list data
        items explicitly, put withdraw, rights and complaint links next to the consent control, and
        store which version of the notice each person saw.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Twenty-two languages ------------------------------------------------------------------------- */

export function Languages() {
  const [s, set] = useSceneState<NoticeState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="English, or any of 22 more"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">Read the notice in</p>
          <div className="flex flex-wrap gap-1">
            {["English", ...LANGUAGES].map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={s.lang === l}
                onClick={() => set({ lang: l })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] transition",
                  s.lang === l
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted hover:text-fg",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <motion.div
            key={s.lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-line bg-surface rounded-xl border p-3 text-sm"
          >
            The person chose <strong>{s.lang}</strong>. Your app serves the notice, and the consent
            request, in that language.{" "}
            {s.lang === "English"
              ? "English is named in the Act separately; it isn't one of the 22."
              : "It's one of the 22 languages in the Constitution's Eighth Schedule."}
          </motion.div>
        </div>
      }
    >
      <p>
        Section 5(3) gives people the option to read the notice in English or any language in the
        Eighth Schedule of the Constitution: 22 languages, from Assamese to Urdu. The consent
        request itself has the same language option (s.6(3)).
      </p>
      <p>
        The duty is to offer the option, not to show all 23 at once. In practice that means a
        language picker, translated and reviewed notice text for each language you support, and a
        record of which language and version each person saw.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Users you already have ------------------------------------------------------------------------ */

const USERS = {
  new: [
    ["Before or with the consent request", "Show the full notice."],
    ["Then", "Ask for consent with a clear action, like ticking an empty box."],
    ["Keep", "Which notice version and language they saw, and when."],
  ],
  existing: [
    [
      "As soon as reasonably practicable",
      "Send the notice by email, in-app message or another effective way.",
    ],
    ["Meanwhile", "You may keep processing on the consent you have, until they withdraw."],
    ["No need to", "Ask everyone to consent again just because the Act started."],
  ],
} as const;

export function ExistingUsers() {
  const [s, set] = useSceneState<NoticeState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="The users you already have"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.user}
            onChange={(v) => set({ user: v })}
            options={[
              ["new", "Someone signing up after May 2027"],
              ["existing", "Someone who consented before"],
            ]}
            size="sm"
          />
          <div className="grid gap-1.5">
            {USERS[s.user].map(([when, what], i) => (
              <motion.div
                key={s.user + when}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface grid grid-cols-[9rem_1fr] gap-3 rounded-lg border px-3 py-2 text-xs"
              >
                <span className="text-accent font-medium">{when}</span>
                <span>{what}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        What about the millions of people who signed up before the Act applied? Section 5(2) says
        they must get a notice too, &ldquo;as soon as it is reasonably practicable&rdquo;, saying
        what data was processed and for what purpose.
      </p>
      <p>
        The Act&apos;s own example is an e-commerce app sending it by email or in-app notification.
        It also lets the organisation carry on processing until the person withdraws, so a
        &ldquo;please consent again&rdquo; campaign isn&apos;t required.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function NoticeCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good notice or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-notice"
            prompt="Does each notice element meet the Act and Rule 3?"
            categories={[
              { id: "ok", label: "Meets it" },
              { id: "bad", label: "Doesn't" },
            ]}
            items={[
              {
                id: "itemised",
                label: "“We'll collect your name, mobile number and delivery address.”",
                category: "ok",
                why: "An itemised list of data.",
              },
              {
                id: "vague",
                label: "“We may use your data for business purposes.”",
                category: "bad",
                why: "No specified purpose.",
              },
              {
                id: "link",
                label: "A link to the full privacy policy, and nothing else",
                category: "bad",
                why: "The notice must stand on its own.",
              },
              {
                id: "board",
                label: "A line explaining how to complain to the Data Protection Board",
                category: "ok",
                why: "Required by s.5(1) and Rule 3(c).",
              },
              {
                id: "after",
                label: "A notice emailed a week after a new user signs up",
                category: "bad",
                why: "For new consent it must come before or with the request.",
              },
              {
                id: "picker",
                label: "A language picker offering Tamil, Hindi and English",
                category: "ok",
                why: "Offers the s.5(3) language option.",
              },
            ]}
            explanation="Itemised data, a specified purpose, standalone and clear, with links to withdraw, use rights and complain, in a language the person can choose, before consent is asked."
          />
        </div>
      }
    >
      <p>Sort each element.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Before or with the request", "Never after the data is collected."],
  ["What and why", "Itemised data; specified purposes."],
  ["How to say no", "Withdraw, use rights, complain to the Board."],
  ["Stands on its own", "Clear and plain, not a link to a policy."],
  ["Existing users", "Notify them soon; no forced re-consent."],
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
      <p>Next: the consent itself, and the design choices that make it count or not.</p>
    </StepLayout>
  );
}
