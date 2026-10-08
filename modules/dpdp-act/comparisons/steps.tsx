"use client";

import { motion } from "motion/react";
import { Car } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FLAGS, RULEBOOKS, TOPICS, type Flag } from "./model";
import type { CompareState } from "./state";

/* 1 ─ Story: driving abroad ------------------------------------------------------------------------ */

export function DrivingAbroad() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Driving in two countries"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border p-4 text-xs">
            <Car className="text-accent size-6" />
            <p className="mt-2 font-semibold">India</p>
            <p className="text-muted mt-1">Drive on the left. Speed limits in km/h.</p>
          </div>
          <div className="border-line bg-surface rounded-xl border p-4 text-xs">
            <Car className="text-accent size-6 -scale-x-100" />
            <p className="mt-2 font-semibold">Germany</p>
            <p className="text-muted mt-1">
              Drive on the right. Some motorways with no general limit.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A good driver&apos;s instincts work anywhere, but the rules change at the border: which side
        of the road, what the signs mean, how fast you may go. Assume they&apos;re the same and
        you&apos;ll get into trouble.
      </p>
      <p>
        Data protection is similar. Many Indian teams first met these ideas through Europe&apos;s{" "}
        <Term id="gdpr">GDPR</Term>. The DPDP Act shares its instincts, but the rules differ in
        important places, and in India it sits alongside sector rules from CERT-In, the RBI and
        others.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Side by side ⭐ ------------------------------------------------------------------------------ */

export function SideBySide() {
  const [s, set] = useSceneState<CompareState>();
  const t = TOPICS.find((x) => x.id === s.topic) ?? TOPICS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="DPDP and GDPR, side by side"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {TOPICS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === s.topic}
                onClick={() => set({ topic: x.id })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  x.id === s.topic
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted hover:text-fg",
                )}
              >
                {x.topic}
              </button>
            ))}
          </div>
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-2 sm:grid-cols-2"
          >
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="text-muted text-[10px] uppercase">EU GDPR</p>
              <p className="mt-1 text-sm">{t.gdpr}</p>
            </div>
            <div className="border-accent bg-accent-soft rounded-xl border p-3">
              <p className="text-muted text-[10px] uppercase">India DPDP</p>
              <p className="mt-1 text-sm">{t.dpdp}</p>
            </div>
            <p className="text-sm font-medium sm:col-span-2">{t.note}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Pick a topic to compare. Some differences make DPDP simpler, like fewer grounds and fewer
        rights. Others make it stricter, like notifying every breach to every affected person and
        treating everyone under 18 as a child.
      </p>
      <p>
        The practical lesson: a GDPR programme is a strong start, not a finished DPDP programme.
        Check breach notices, children&apos;s flows and any reliance on &ldquo;legitimate
        interests&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Many rulebooks -------------------------------------------------------------------------------- */

export function Rulebooks() {
  const [s, set] = useSceneState<CompareState>();
  const flags = new Set(s.flags);
  const toggle = (f: Flag) =>
    set({ flags: flags.has(f) ? s.flags.filter((x) => x !== f) : [...s.flags, f] });
  const apply = RULEBOOKS.filter((r) => r.when === "always" || flags.has(r.when));
  return (
    <StepLayout
      eyebrow="Explore"
      title="One app, several rulebooks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">What does the made-up app do?</p>
          <div className="flex flex-wrap gap-1.5">
            {FLAGS.map((f) => (
              <label
                key={f.id}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px]",
                  flags.has(f.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line-strong text-muted",
                )}
              >
                <input
                  type="checkbox"
                  checked={flags.has(f.id)}
                  onChange={() => toggle(f.id)}
                  className="accent-accent"
                />
                {f.label}
              </label>
            ))}
          </div>
          <div className="grid gap-1.5">
            {apply.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="border-line bg-surface grid grid-cols-[9rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-xs"
              >
                <span className="font-semibold">{r.name}</span>
                <span>{r.says}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The DPDP Act is the general law for personal data. Sector rules add to it: the RBI for
        payments and lending, SEBI for market intermediaries, the IT Rules for platforms that host
        user content, and CERT-In for cyber incidents everywhere.
      </p>
      <p>
        Tick what a made-up app does and see the rulebooks stack up. Simplified, so check each rule
        in full before relying on it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which rule wins? ------------------------------------------------------------------------------ */

export function WhichWins() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When rules overlap, which wins?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "In addition, not instead",
              "Section 38: the DPDP Act adds to other laws; it doesn't replace them.",
            ],
            [
              "In a conflict, DPDP prevails",
              "Where a provision of another law genuinely conflicts with the DPDP Act, the DPDP Act wins, to the extent of the conflict.",
            ],
            [
              "Except stricter transfer rules",
              "Section 16(2) keeps any law that restricts transfers abroad more tightly, such as the RBI's payment-data rule.",
            ],
            [
              "RTI already changed",
              "The DPDP Act amended the RTI Act's personal-information exception; that change is in force but being challenged in the Supreme Court.",
            ],
            [
              "GDPR may change too",
              "The EU's 'Digital Omnibus' proposals to amend GDPR were still being negotiated in October 2026; GDPR itself is unchanged.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Most of the time sector rules and the DPDP Act point the same way, and you simply follow
        both. When a sector rule asks for more, such as keeping payment data in India, you do the
        stricter thing.
      </p>
      <p>
        True conflicts are rare and are a question for lawyers. Your job as an engineer is to know
        which rulebooks apply and to build systems that can satisfy all of them.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function CompareCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="GDPR, DPDP or both?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-compare"
            prompt="Which law has each feature?"
            categories={[
              { id: "gdpr", label: "GDPR only" },
              { id: "dpdp", label: "DPDP only" },
              { id: "both", label: "Both" },
            ]}
            items={[
              {
                id: "li",
                label: "Processing based on 'legitimate interests'",
                category: "gdpr",
                why: "No equivalent in DPDP.",
              },
              {
                id: "port",
                label: "A right to data portability",
                category: "gdpr",
                why: "Not in DPDP.",
              },
              {
                id: "every",
                label: "Tell every affected person about every breach",
                category: "dpdp",
                why: "No risk threshold in DPDP.",
              },
              {
                id: "u18",
                label: "Parental consent for everyone under 18",
                category: "dpdp",
                why: "GDPR's age is 16 or lower.",
              },
              {
                id: "withdraw",
                label: "Consent can be withdrawn at any time",
                category: "both",
                why: "Both laws.",
              },
              {
                id: "nominate",
                label: "Nominating someone to act for you after death",
                category: "dpdp",
                why: "A DPDP right.",
              },
            ]}
            explanation="DPDP is simpler in places (fewer grounds and rights) and stricter in others (every breach, under-18s, nomination)."
          />
        </div>
      }
    >
      <p>Sort each feature.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Fewer grounds, fewer rights", "No legitimate interests, no portability."],
  ["Stricter on breaches and children", "Every breach, everyone under 18."],
  ["Fixed caps, not turnover", "Up to ₹250 crore."],
  ["Sector rules stack on top", "RBI, SEBI, IT Rules, CERT-In."],
  ["In addition to other laws", "DPDP prevails in a true conflict."],
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
      <p>Next, the capstone: take one learning app from data map to breach drill.</p>
    </StepLayout>
  );
}
