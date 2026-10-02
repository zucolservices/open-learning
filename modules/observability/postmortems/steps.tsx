"use client";

import { motion } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FACTORS, LINES } from "./model";
import type { PmState } from "./state";

/* 1 ─ The broken vase ----------------------------------------------------------------------------- */

const NIGHT: [string, string][] = [
  ["± 19:00 UTC", "Database load spikes, probably spam."],
  ["± 23:00 UTC", "Replication to the secondary falls behind and breaks."],
  ["± 23:30 UTC", "Rebuilding it, an engineer wipes the data directory on the primary."],
  ["a second or two", "They stop the command. Around 300 GB is already gone."],
  ["then", "The backups turn out to be empty. The best copy is 6 hours old."],
  ["± 18 hours", "GitLab.com is down while it's restored."],
];

export function BrokenVase() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The broken vase"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          <p className="text-muted font-mono text-[10px]">GitLab.com, 31 January 2017</p>
          {NIGHT.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "grid grid-cols-[6.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs",
                i === 2 || i === 3 ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <span className="text-muted font-mono">{t}</span>
              <span>{d}</span>
            </motion.div>
          ))}
          <p className="text-muted text-[10px]">
            From GitLab&apos;s public postmortem. Changes from about six hours were lost: roughly
            5,000 projects, 5,000 comments and 700 new accounts. Git repositories were not affected.
          </p>
        </div>
      }
    >
      <p>
        A child breaks a vase. If the response is punishment, next time the pieces end up hidden
        under the sofa. If the response is &ldquo;what happened?&rdquo;, you learn the vase sat on
        the edge of a table in a room where football is allowed.
      </p>
      <p>
        Teams are the same. After an <Term id="incident">incident</Term>, a{" "}
        <Term id="postmortem">postmortem</Term> asks what happened and why, so it happens less. It
        only works if people tell the whole truth, which they only do when it&apos;s safe.
        GitLab&apos;s worst night is a famous example: one wrong command, and a postmortem the whole
        world could read.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rewrite the report ⭐ ----------------------------------------------------------------------- */

export function RewriteIt() {
  const [s, set] = useSceneState<PmState>();
  const done = s.rewritten ?? [];
  const all = done.length === LINES.length;
  const last = LINES.find((l) => l.id === done[done.length - 1]);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Rewrite the report"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center justify-between">
            <p className="text-muted font-mono text-[10px]">
              incident report: UPI failures, Friday · draft ({done.length}/{LINES.length} rewritten)
            </p>
            {done.length > 0 && (
              <button
                type="button"
                onClick={() => set({ rewritten: [] })}
                className="text-muted flex items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {LINES.map((l) => {
              const fixed = done.includes(l.id);
              return (
                <button
                  key={l.id}
                  type="button"
                  disabled={fixed}
                  onClick={() => set({ rewritten: [...done, l.id] })}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-xs transition-colors",
                    fixed
                      ? "border-good/50 bg-good/5"
                      : "border-bad/40 bg-bad/5 hover:bg-bad/10 cursor-pointer",
                  )}
                >
                  {fixed ? (
                    <span className="flex gap-1.5">
                      <Check className="text-good mt-0.5 size-3 shrink-0" />
                      {l.fixed}
                    </span>
                  ) : (
                    <span className="line-through decoration-1 opacity-90">{l.blame}</span>
                  )}
                </button>
              );
            })}
          </div>
          {last && !all && (
            <motion.p
              key={last.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-muted text-xs"
            >
              {last.why}
            </motion.p>
          )}
          {all && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-good/50 bg-good/10 rounded-xl border px-4 py-3 text-sm"
            >
              Same incident, a different report: nobody is on trial, and there are four things to
              fix instead of one person to blame. The SRE book: &ldquo;You can&apos;t
              &lsquo;fix&rsquo; people, but you can fix systems and processes to better support
              people making the right choices.&rdquo;
            </motion.div>
          )}
          <p className="text-subtle text-[10px]">Illustrative report for the Friday incident.</p>
        </div>
      }
    >
      <p>
        Monday morning, and the first draft of the report on Friday&apos;s payments outage is full
        of blame. Tap each struck-through line to rewrite it.
      </p>
      <p>
        Google&apos;s SRE book sets the bar: &ldquo;For a postmortem to be truly blameless, it must
        focus on identifying the contributing causes of the incident without indicting any
        individual or team for bad or inappropriate behavior.&rdquo;
      </p>
      <p>
        John Allspaw, then at Etsy, put the reason plainly in 2012: blameless means the engineers
        involved can give a detailed account of what they did, saw, expected and assumed,
        &ldquo;without fear of punishment or retribution.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ One root cause? ----------------------------------------------------------------------------- */

export function NoRootCause() {
  const [s, set] = useSceneState<PmState>();
  return (
    <StepLayout
      eyebrow="Compare"
      title="One root cause?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<PmState["view"]>
              size="sm"
              value={s.view}
              onChange={(view) => set({ view })}
              options={[
                ["root", "One root cause"],
                ["factors", "Contributing factors"],
              ]}
            />
          </div>
          {s.view === "root" ? (
            <motion.div
              key="root"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-2"
            >
              <div className="border-bad/50 bg-bad/10 rounded-xl border px-4 py-3">
                <p className="text-sm font-semibold">Root cause: engineer error</p>
                <p className="text-muted mt-1 text-xs">
                  Someone ran a command on the wrong server. Fix: retrain them, or let them go.
                </p>
              </div>
              <p className="text-muted text-xs">
                Tidy, and nothing changes: the next tired engineer meets the same two hostnames, the
                same empty backups and the same silent alerts.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {FACTORS.map(([t, d], i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className="border-line bg-surface rounded-lg border px-3 py-2"
                >
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="text-muted text-xs">{d}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      }
    >
      <p>
        Richard Cook&apos;s short paper &ldquo;How Complex Systems Fail&rdquo; (1998) says it
        bluntly: &ldquo;Post-accident attribution to a &lsquo;root cause&rsquo; is fundamentally
        wrong.&rdquo; Serious failures need several things to go wrong at once, so there are{" "}
        <Term id="contributing-factor">contributing factors</Term>, not a single cause.
      </p>
      <p>
        He adds that <Term id="hindsight-bias">hindsight</Term> &ldquo;biases post-accident
        assessments of human performance&rdquo;. Sidney Dekker calls the urge to remove the person
        &ldquo;the Bad Apple Theory&rdquo;: believing your system is basically safe if it were not
        for a few unreliable people in it.
      </p>
      <p>
        GitLab&apos;s own report used the &ldquo;5 Whys&rdquo;, but asked them of several problems
        and fixed the system: hourly snapshots and automated tests of restoring backups.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When to write one --------------------------------------------------------------------------- */

const TRIGGERS = [
  "User-visible downtime or degradation beyond a certain threshold",
  "Data loss of any kind",
  "On-call engineer intervention (release rollback, rerouting of traffic, etc.)",
  "A resolution time above some threshold",
  "A monitoring failure (which usually implies manual incident discovery)",
];

const SECTIONS: [string, string][] = [
  ["Summary and impact", "What happened, to whom, for how long."],
  ["Timeline", "From the scribe's notes: what was seen, decided and changed."],
  ["Contributing factors", "Everything that combined to make it possible."],
  ["What went well, what didn't, where we got lucky", "Luck is a risk worth naming."],
  ["Action items", "Each with an owner, priority and tracking ticket."],
];

export function WhenToWrite() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When to write one"
      stage={
        <div className="grid flex-1 content-center gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <p className="text-accent text-xs font-semibold">Common triggers (SRE book)</p>
            {TRIGGERS.map((t, i) => (
              <motion.p
                key={t}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                {t}
              </motion.p>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-accent text-xs font-semibold">A typical postmortem</p>
            {SECTIONS.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-1.5"
              >
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted text-[11px]">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The SRE book advises agreeing the triggers calmly, in advance: &ldquo;It is important to
        define postmortem criteria before an incident occurs.&rdquo; And &ldquo;any stakeholder may
        request a postmortem for an event.&rdquo;
      </p>
      <p>
        Note the monitoring failure: if a customer told you before an alert did, that alone is worth
        a postmortem. Many teams share reviews widely, read them together, and publish the big ones,
        as GitLab did.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Strong or weak action item? ----------------------------------------------------------------- */

export function StrongOrWeak() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Strong or weak action item?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="strong-or-weak"
            prompt="Which action items will actually make the next incident less likely or less bad?"
            categories={[
              { id: "strong", label: "Strong" },
              { id: "weak", label: "Weak" },
            ]}
            items={[
              {
                id: "restore",
                label:
                  "Restore the latest backup into a test database every day and alert if it fails. Owner: data platform, P0",
                category: "strong",
                why: "Prevents the GitLab trap: a backup isn't real until a restore has been tested.",
              },
              {
                id: "alert",
                label: "Page on failed payments per bank, not CPU. Owner: payments on-call, P1",
                category: "strong",
                why: "Detection: specific, owned and easy to verify as done.",
              },
              {
                id: "prompt",
                label: "Show the server's role in the shell prompt, red for the primary",
                category: "strong",
                why: "Makes the wrong server harder to mistake, for everyone.",
              },
              {
                id: "careful",
                label: "Everyone to be more careful with production",
                category: "weak",
                why: "No owner, no end state, and it relies on people never having a bad day.",
              },
              {
                id: "retrain",
                label: "Retrain the engineer who ran the command",
                category: "weak",
                why: "Fixes one person; the next one meets the same trap.",
              },
              {
                id: "look",
                label: "Look into database reliability",
                category: "weak",
                why: "No owner, no priority and no way to tell when it's finished.",
              },
            ]}
            explanation="Strong action items change the system, have one owner, a priority and a verifiable end state. Weak ones ask people to try harder."
          />
        </div>
      }
    >
      <p>
        The SRE Workbook: &ldquo;A postmortem with no action items is ineffective.&rdquo; Good ones
        have an owner, a tracking number, a priority and &ldquo;a verifiable end state&rdquo;, and
        aim to prevent, mitigate or detect a repeat.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Blameless, not careless", "Accountability through learning, not punishment."],
  ["Truth needs safety", "People only describe what they did if it's safe to."],
  ["Contributing factors", "Not one root cause, and never just “human error”."],
  ["Agree the triggers first", "Including any monitoring failure."],
  ["Close the action items", "Owned, prioritised, tracked, verifiable."],
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
        Ben Treynor Sloss, Google&apos;s VP for 24/7 Operations: &ldquo;To our users, a postmortem
        without subsequent action is indistinguishable from no postmortem.&rdquo; The Workbook warns
        that rewarding the writing but not the closing of action items leads to &ldquo;an unvirtuous
        cycle of unclosed postmortems.&rdquo;
      </p>
      <p>Next: what all this telemetry costs, and how to keep the bill sensible.</p>
    </StepLayout>
  );
}
