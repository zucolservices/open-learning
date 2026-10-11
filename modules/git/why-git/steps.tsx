"use client";

import { motion } from "motion/react";
import { Check, X, Server, Laptop } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TIMELINE, WEEK } from "./model";
import type { WhyGitState } from "./state";

/* 2 ─ Replay the week ⭐ --------------------------------------------------------------------------- */

export function ReplayWeek() {
  const [s, set] = useSceneState<WhyGitState>();
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Replay the week"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.mode}
            onChange={(v) => set({ mode: v })}
            options={[
              ["folder", "Shared folder"],
              ["git", "With Git"],
            ]}
            size="sm"
          />
          <div className="grid gap-1.5">
            {WEEK.map((d, i) => {
              const r = s.mode === "folder" ? d.folder : d.git;
              const on = i <= s.day;
              return (
                <motion.button
                  key={d.day}
                  type="button"
                  onClick={() => set({ day: i })}
                  animate={{ opacity: on ? 1 : 0.35 }}
                  className={cn(
                    "grid grid-cols-[2.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-left text-xs",
                    on
                      ? r.ok
                        ? "border-good/50 bg-good/10"
                        : "border-bad/50 bg-bad/10"
                      : "border-line bg-surface",
                  )}
                >
                  <span className="text-accent font-mono font-semibold">{d.day}</span>
                  <span>
                    <span className="text-muted">{d.event}</span>
                    {on && (
                      <span className="mt-0.5 flex items-start gap-1">
                        {r.ok ? (
                          <Check className="text-good mt-0.5 size-3 shrink-0" />
                        ) : (
                          <X className="text-bad mt-0.5 size-3 shrink-0" />
                        )}
                        {r.text}
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={s.day >= WEEK.length - 1}
            onClick={() => set({ day: s.day + 1 })}
            className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
          >
            Next day
          </button>
        </div>
      }
    >
      <p>
        The café team has the same week twice. Step through it with the shared folder, then switch
        to Git and replay it.
      </p>
      <p>
        Git doesn&apos;t stop people changing the same thing. It makes the overlap visible, keeps
        every version, and records who did what and why. Each saved snapshot is a{" "}
        <Term id="commit">commit</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Centralised or distributed ------------------------------------------------------------------- */

export function CentralOrDistributed() {
  const [s, set] = useSceneState<WhyGitState>();
  const central = s.model === "central";
  const rows: [string, boolean][] = central
    ? [
        ["See history", !s.offline],
        ["Commit a change", !s.offline],
        ["Create a branch", !s.offline],
        ["Survive the server dying", false],
      ]
    : [
        ["See history", true],
        ["Commit a change", true],
        ["Create a branch", true],
        ["Survive the server dying", true],
      ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="One server, or everyone's copy?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              value={s.model}
              onChange={(v) => set({ model: v })}
              options={[
                ["central", "Centralised (e.g. Subversion)"],
                ["distributed", "Distributed (Git)"],
              ]}
              size="sm"
            />
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.offline}
                onChange={(e) => set({ offline: e.target.checked })}
                className="accent-accent"
              />
              On a plane, offline
            </label>
          </div>
          <div className="flex items-center justify-center gap-4 py-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-[10px]">
                <Laptop className="text-muted size-6" />
                <span
                  className={cn(
                    "rounded px-1.5 font-mono",
                    central ? "bg-surface-2" : "bg-accent-soft text-accent",
                  )}
                >
                  {central ? "files only" : "full history"}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1 text-[10px]">
              <Server className="text-accent size-7" />
              <span className="bg-accent-soft text-accent rounded px-1.5 font-mono">
                {central ? "the history" : "a shared copy"}
              </span>
            </div>
          </div>
          <div className="grid gap-1">
            {rows.map(([t, ok]) => (
              <div
                key={t}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs",
                  ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                {ok ? (
                  <Check className="text-good size-3.5" />
                ) : (
                  <X className="text-bad size-3.5" />
                )}
                {t}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        In a centralised system your laptop has the files but the history lives on the server. Lose
        the connection and you can&apos;t commit or look back; lose the server and the history goes
        with it.
      </p>
      <p>
        In Git every clone has everything. A shared server like GitHub is just one more copy that
        everyone agrees to push to.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Twenty years --------------------------------------------------------------------------------- */

export function TwentyYears() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Twenty years of Git"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {TIMELINE.map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span>{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Git turned 20 in April 2025 and has had the same maintainer for almost all of that time.
        Planned changes for Git 3.0 include new defaults: a <code>main</code> branch and stronger
        SHA-256 hashes for new repositories.
      </p>
      <p>
        Through this track, &ldquo;Git&rdquo; means the open-source tool itself. Hosting services
        add features like pull requests on top; we&apos;ll meet those in the collaboration chapter.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DoesGit() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What does Git do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-what"
            prompt="Does Git, on its own, do each of these?"
            categories={[
              { id: "yes", label: "Git does" },
              { id: "no", label: "Git doesn't" },
            ]}
            items={[
              {
                id: "who",
                label: "Record who changed what, when and why",
                category: "yes",
                why: "Every commit has an author and message.",
              },
              {
                id: "stop",
                label: "Stop two people editing the same line",
                category: "no",
                why: "It lets them, then flags a conflict.",
              },
              {
                id: "full",
                label: "Keep the full history in every clone",
                category: "yes",
                why: "It's distributed.",
              },
              {
                id: "backup",
                label: "Back up your work automatically",
                category: "no",
                why: "Only when you push to another copy.",
              },
              {
                id: "github",
                label: "Host pull requests and reviews",
                category: "no",
                why: "That's GitHub, GitLab and other services.",
              },
              {
                id: "offline",
                label: "Let you commit while offline",
                category: "yes",
                why: "History is local.",
              },
            ]}
            explanation="Git records history locally in every copy and surfaces conflicts. Backups need a push, and pull requests come from hosting services."
          />
        </div>
      }
    >
      <p>Sort each statement.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Version control records every change", "Who, what, when and why."],
        ["Git is distributed", "Every clone has the whole history."],
        ["Conflicts are surfaced, not prevented", "A person decides."],
        ["Hosting isn't Git", "GitHub and others build on top of it."],
        ["Born in 2005", "For the Linux kernel, by Linus Torvalds."],
      ]}
    >
      <p>Next: what Git actually stores when you commit. Hint: it isn&apos;t a list of changes.</p>
    </WrapStep>
  );
}
