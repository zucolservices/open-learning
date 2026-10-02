"use client";

import { motion } from "motion/react";
import { BookOpen, Shirt, Sparkles } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CONFIG_KEYS, config, frames, type EnvName, type Parity } from "./model";
import type { EnvState } from "./state";

/* 1 ─ Rehearsals ---------------------------------------------------------------------------------- */

const STAGES = [
  {
    icon: BookOpen,
    t: "Read-through",
    env: "Development and test",
    d: "Actors read the script around a table. Quick, cheap, catches most mistakes, but nobody is on a stage.",
  },
  {
    icon: Shirt,
    t: "Dress rehearsal",
    env: "Staging",
    d: "The real stage, costumes, lights and props. Problems that only show up for real show up here, with no audience watching.",
  },
  {
    icon: Sparkles,
    t: "Opening night",
    env: "Production",
    d: "Real audience, real money. The same play as the rehearsal, word for word.",
  },
];

export function Rehearsals() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Rehearsals before opening night"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {STAGES.map(({ icon: Icon, t, env, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-4"
            >
              <Icon className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
              <p className="mt-auto font-mono text-xs">{env}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        An <Term id="environment">environment</Term> is a complete, separate copy of the system: its
        own servers, database and settings. A change visits several before real users see it.
      </p>
      <p>
        The script never changes between rehearsals; the stage does. The Twelve-Factor App asks for
        &ldquo;strict separation of config from code&rdquo;, with a test: could the code be made
        open source at any moment &ldquo;without compromising any credentials&rdquo;? Everything
        that differs between environments lives outside the artifact.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One release, three environments ⭐ ---------------------------------------------------------- */

const ENVS: EnvName[] = ["Test", "Staging", "Production"];

const STATUS_CLS = {
  idle: "border-line bg-surface",
  running: "border-accent bg-accent-soft",
  pass: "border-good/50 bg-good/10",
  fail: "border-bad/60 bg-bad/10",
  waiting: "border-viz-compute bg-viz-compute/10",
};

const STATUS_LABEL = {
  idle: "—",
  running: "deploying…",
  pass: "passed",
  fail: "broken",
  waiting: "awaiting approval",
};

export function ThreeEnvironments() {
  const [s, set] = useSceneState<EnvState>();
  const fs = frames(s.parity);
  const frame = Math.min(s.frame, fs.length - 1);
  const f = fs[frame];
  const cfg = config(f.env, s.parity);
  return (
    <StepLayout
      eyebrow="Step-through"
      title="One release, three environments"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col items-start gap-1 text-xs sm:flex-row sm:items-center sm:gap-2">
            <span className="text-muted">Staging is set up like:</span>
            <Segmented<Parity>
              size="sm"
              value={s.parity}
              onChange={(parity) => set({ parity, frame: 0 })}
              options={[
                ["test-like", "Test (fakes)"],
                ["prod-like", "Production"],
              ]}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ENVS.map((e) => (
              <motion.div
                key={e}
                layout
                className={cn(
                  "rounded-xl border px-2 py-2 text-center",
                  STATUS_CLS[f.status[e]],
                  f.env === e && "ring-accent/40 ring-2",
                )}
              >
                <p className="text-xs font-semibold">{e}</p>
                <p className="text-muted mt-0.5 font-mono text-[10px]">
                  {STATUS_LABEL[f.status[e]]}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted mb-1 text-[10px]">
              {f.env} settings (the artifact is the same everywhere)
            </p>
            {CONFIG_KEYS.map((k) => (
              <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-2 py-0.5 text-[11px]">
                <span className="font-mono">{k}</span>
                <span className="text-muted">{cfg[k]}</span>
              </div>
            ))}
          </div>
          <Stepper step={frame} count={fs.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={`${s.parity}-${frame}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Follow release 2.4.1 of a payments API. Step through once with a staging environment built
        on the same fakes as test, then switch staging to be like production and step through again.
      </p>
      <p>
        <Term id="promotion">Promotion</Term> moves the same artifact on; each environment supplies
        its own settings. A protected production environment adds a gate: on GitHub, up to six named
        reviewers (one approval is enough) and a wait timer of up to 30 days.
      </p>
      <p>
        A <Term id="staging">staging</Term> environment is only as useful as it is like production.
        Twelve-Factor&apos;s rule is to &ldquo;keep development, staging, and production as similar
        as possible.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Previews and parity ------------------------------------------------------------------------- */

const GAPS: [string, string][] = [
  [
    "The time gap",
    "A developer may work on code that takes days, weeks, or even months to go into production.",
  ],
  ["The personnel gap", "Developers write code, ops engineers deploy it."],
  [
    "The tools gap",
    "Developers may be using a stack like Nginx, SQLite, and OS X, while the production deploy uses Apache, MySQL, and Linux.",
  ],
];

export function Previews() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Previews and parity"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px]">The three gaps, in Twelve-Factor&apos;s words</p>
          {GAPS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">&ldquo;{d}&rdquo;</p>
            </motion.div>
          ))}
          <div className="border-accent/50 bg-accent-soft rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">
              A <Term id="preview-environment">preview</Term> for every pull request
            </p>
            <p className="text-muted mt-1 text-xs">
              Open a pull request and the pipeline builds a temporary copy of the app at its own
              address; reviewers click around before merging; close the request and it&apos;s torn
              down. Vercel and Netlify call them previews, GitLab review apps, Render preview
              environments, Heroku review apps.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Continuous delivery closes the time gap, and shared ownership of the pipeline closes the
        personnel gap. The tools gap closes when every environment is built from the same container
        image and the same infrastructure code, with different variables.
      </p>
      <p>
        Two cautions. Copying production data into test environments copies its risks: use masked or
        made-up data, as privacy laws such as the GDPR and India&apos;s DPDP Act expect. And
        environments cost money while idle: GitLab&apos;s auto_stop_in setting and scale-to-zero
        platforms shut previews down when nobody is looking.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Same everywhere, or per environment? -------------------------------------------------------- */

export function SameOrDiffers() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Same everywhere, or per environment?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="same-or-differs"
            prompt="Which things should be identical in test, staging and production, and which should differ?"
            categories={[
              { id: "same", label: "Identical" },
              { id: "differs", label: "Per environment" },
            ]}
            items={[
              {
                id: "image",
                label: "The container image (by digest)",
                category: "same",
                why: "Build once, promote: what you tested is what you run.",
              },
              {
                id: "deps",
                label: "Dependency versions",
                category: "same",
                why: "They're inside the artifact, fixed at build time.",
              },
              {
                id: "migrations",
                label: "The database migration scripts",
                category: "same",
                why: "The same scripts run everywhere, so production's schema matches what staging tested.",
              },
              {
                id: "db",
                label: "The database address",
                category: "differs",
                why: "Each environment has its own database, passed in as configuration.",
              },
              {
                id: "secret",
                label: "API keys and passwords",
                category: "differs",
                why: "Separate secrets per environment, fetched from a secrets manager, never baked in.",
              },
              {
                id: "scale",
                label: "How many copies of the app run",
                category: "differs",
                why: "Production needs more capacity; the code doesn't change.",
              },
            ]}
            explanation="Code, dependencies and scripts travel unchanged inside the artifact; addresses, secrets and sizes are configuration supplied by each environment."
          />
        </div>
      }
    >
      <p>The artifact is the play; the environment is the theatre.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Same artifact everywhere", "Only configuration changes between environments."],
  ["Config outside the code", "Environment variables, config stores and a secrets manager."],
  ["Staging like production", "Real integrations and realistic (masked) data catch real bugs."],
  ["Gate production", "Protected environments with reviewers and timers."],
  ["Previews per pull request", "Short-lived copies that tear themselves down."],
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
        Even a perfect staging copy can&apos;t fully reproduce production. Charity Majors describes
        every deploy as &ldquo;a unique and never-to-be-replicated combination of artifact,
        environment, infra, and time of day&rdquo;, which is why later modules release carefully and
        watch closely.
      </p>
      <p>Next: the environments themselves, created and changed through the pipeline as code.</p>
    </StepLayout>
  );
}
