"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS } from "./model";
import type { DesignState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Desk() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Build the path people walk"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <svg viewBox="0 0 200 120" className="w-80" fill="none">
            <path
              d="M20 100 H100 V20 H180"
              className="stroke-line-strong"
              strokeWidth={6}
              strokeLinecap="round"
            />
            <motion.path
              d="M20 100 Q90 90 180 20"
              className="stroke-accent"
              strokeWidth={3}
              strokeDasharray="6 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />
            <text x="40" y="115" className="fill-muted text-[9px]">
              the paved path
            </text>
            <text x="112" y="90" className="fill-accent text-[9px]">
              where people walk
            </text>
          </svg>
        </div>
      }
    >
      <p>
        Planners lay paths at right angles; people cut across the grass where they actually need to
        go. Wise planners watch the worn tracks, then pave those.
      </p>
      <p>
        <Term id="service-design">Service design</Term> does the same for public services: start
        from what people need and how they really behave, not from the department&apos;s forms and
        org chart. That includes <Term id="assisted-digital">assisted digital</Term> help for people
        who can&apos;t go online alone.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function Redesign() {
  const [s, set] = useSceneState<DesignState>();
  const done = DECISIONS.every((d) => s.picks[d.id]);
  const good = DECISIONS.filter((d) => d.options.find((o) => o.id === s.picks[d.id])?.ok).length;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Redesign the pension application"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {DECISIONS.map((d) => {
            const pick = d.options.find((o) => o.id === s.picks[d.id]);
            return (
              <div key={d.id} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{d.title}</p>
                <div className="mt-1 grid gap-1">
                  {d.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={pick?.id === o.id}
                      onClick={() => set({ picks: { ...s.picks, [d.id]: o.id } })}
                      className={cn(
                        "rounded-md border px-2 py-1 text-left text-[11px]",
                        pick?.id === o.id
                          ? o.ok
                            ? "border-good bg-good/10"
                            : "border-bad bg-bad/5"
                          : "border-line hover:border-accent",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-1 text-[11px]", pick.ok ? "text-good" : "text-bad")}>
                    {pick.outcome}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <p
              className={cn(
                "rounded-lg border px-3 py-2",
                good === DECISIONS.length
                  ? "border-good/50 bg-good/10"
                  : "border-viz-meta/50 bg-viz-meta/10",
              )}
            >
              {good === DECISIONS.length
                ? "A service built around how pensioners actually live, that keeps getting better after launch."
                : "Some choices serve the department more than the people applying. Try the others."}
            </p>
          )}
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s old-age pension has a six-page form, and many eligible people never get
        through it. You lead the redesign. Make five decisions and read what happens.
      </p>
      <p>
        The outcomes are illustrative, but each reflects a lesson service teams around the world
        have learned.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Standards ------------------------------------------------------------------------------------ */

export function Standards() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Service standards around the world"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "UK: Service Standard",
              "14 points since 2019, from “understand users and their needs” to “make new source code open”; services are assessed against them.",
            ],
            [
              "US: Digital Services Playbook",
              "13 plays from 2014, starting with “understand what people need”. The digital units behind it changed in 2025: 18F was closed and USDS was renamed.",
            ],
            [
              "Australia",
              "A Digital Service Standard with 10 criteria since July 2024, including “leave no one behind”.",
            ],
            [
              "Singapore",
              "GovTech, a government agency since 2016, builds shared services such as Singpass.",
            ],
            [
              "The common core",
              "Start with user needs, cover the whole journey, use multidisciplinary teams, make it accessible, work in the open, measure.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
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
        Different countries, strikingly similar lists. They distil a decade of lessons from projects
        that failed because nobody asked the people who&apos;d use them.
      </p>
      <p>
        Digital teams are also political: units can be created, renamed or closed when governments
        change.
      </p>
    </StepLayout>
  );
}

/* 4 ─ India ---------------------------------------------------------------------------------------- */

export function India() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="India's approach, and assisted access"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Digital India (2015)",
              "Three aims: digital infrastructure for every citizen, services on demand, and digital empowerment.",
            ],
            [
              "e-Kranti",
              "The second phase of the national e-governance plan (2015), with principles such as “transformation, not translation”, integrated services and mobile first.",
            ],
            [
              "Assisted access at scale",
              "About 5.3 lakh Common Services Centres, each run by a local entrepreneur, help people use online services.",
            ],
            [
              "Plain language",
              "GOV.UK aims for text a nine-year-old could read; the US has a Plain Writing Act (2010). India relies on GIGW and good practice.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;Transformation, not translation&rdquo; is the heart of it: rethinking the process,
        not just putting the old form online.
      </p>
      <p>
        Service-centre operators are paid intermediaries, which helps reach people but brings its
        own risks around fees and data. Design for them as users too.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DesignCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Users first, or the office first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-service-design"
            prompt="Does each practice start from users' needs, or from the organisation?"
            categories={[
              { id: "users", label: "Starts from users" },
              { id: "org", label: "Starts from the organisation" },
            ]}
            items={[
              {
                id: "interview",
                label: "Interview applicants before designing anything",
                category: "users",
                why: "Learn needs first.",
              },
              {
                id: "orgchart",
                label: "Arrange the website by department and section",
                category: "org",
                why: "People don't know the org chart.",
              },
              {
                id: "journey",
                label: "One journey that works online and by phone",
                category: "users",
                why: "Joined-up channels.",
              },
              {
                id: "copy",
                label: "Copy every field from the paper form",
                category: "org",
                why: "Translation, not transformation.",
              },
              {
                id: "test",
                label: "Test the wording with people who'll use it",
                category: "users",
                why: "Plain language, checked.",
              },
            ]}
            explanation="Services designed around users start with research, follow the person's whole journey across channels and test with real users. Starting from forms and org charts reproduces the old problems online."
          />
        </div>
      }
    >
      <p>Sort each practice.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Research first", "With the people who use it, and their helpers."],
        ["Transform, don't translate", "Fix the process, not just the form."],
        ["Plain language", "In the user's own language."],
        ["Every channel joined up", "Online, phone, service centres."],
        ["Teams that keep improving", "Not one fixed spec."],
      ]}
    >
      <p>Next: building for low-end phones and slow networks.</p>
    </WrapStep>
  );
}
