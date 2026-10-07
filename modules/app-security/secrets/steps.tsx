"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HISTORY, HOMES, STAGES, STAGE_TEXT, type Home, type Stage } from "./model";
import type { SecretsState } from "./state";

/* 1 ─ A key under the mat ------------------------------------------------------------------------- */

export function SpareKey() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A key under the mat"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="relative">
            <div className="text-6xl">🚪</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-2 left-10 text-2xl"
            >
              🗝️
            </motion.div>
            <p className="text-muted mt-6 max-w-[14rem] text-center text-xs">
              A strong lock doesn&apos;t help if the key is under the mat where anyone looks.
            </p>
          </div>
        </div>
      }
    >
      <p>
        You can fit the best lock on your door, but if the spare key lives under the mat, the lock
        hardly matters. Burglars check the obvious places first.
      </p>
      <p>
        In software the keys are <Term id="secret">secrets</Term>: passwords, API keys, tokens,
        private keys. The obvious places are the code, the logs and the chat history. This module is
        about keeping keys out of them, and what to do when one slips out.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Find the leaked key ⭐ ---------------------------------------------------------------------- */

export function KeyHunt() {
  const [s, set] = useSceneState<SecretsState>();
  const stageIdx = STAGES.indexOf(s.stage);
  const info = STAGE_TEXT[s.stage];
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Find the leaked key"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface overflow-hidden rounded-lg border font-mono text-[11px]">
            {HISTORY.map((c) => (
              <div
                key={c.hash}
                className={cn(
                  "border-line grid grid-cols-[4.5rem_1fr] gap-2 border-b px-3 py-1.5 last:border-0",
                  c.leak && stageIdx >= 0 ? "bg-bad/10" : "",
                )}
              >
                <span className="text-accent">{c.hash}</span>
                <span>
                  {c.msg} <span className="text-subtle">· {c.when}</span>
                  {c.leak && <span className="text-bad block">⚠ {c.leak}</span>}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((st, i) => (
              <button
                key={st}
                type="button"
                aria-pressed={s.stage === st}
                onClick={() => set({ stage: st as Stage })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.stage === st
                    ? "border-accent bg-accent-soft"
                    : i < stageIdx
                      ? "border-good/50 text-muted"
                      : "border-line",
                )}
              >
                {i + 1}. {st}
              </button>
            ))}
          </div>
          <motion.div
            key={s.stage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
          >
            <p className="font-semibold">{info.title}</p>
            <p className="text-muted">{info.body}</p>
            {info.wrong && <p className="text-bad mt-1">{info.wrong}</p>}
          </motion.div>
          <p className="text-subtle text-[10px]">A made-up repository; the key is fake.</p>
        </div>
      }
    >
      <p>
        A teammate committed a payment API key months ago, then “fixed” it by moving it to an
        environment variable. Walk the four steps. The trap is step one: because git keeps all
        history, and others have cloned the repo, the key is still out there.
      </p>
      <p>
        So the order matters: revoke the key first, so the leaked one stops working, then move the
        new one somewhere safe, then make sure the next leak is caught automatically. Deleting the
        commit is not a fix.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where should secrets live? ------------------------------------------------------------------ */

export function SafeHomes() {
  const [s, set] = useSceneState<SecretsState>();
  const home = HOMES.find((h) => h.id === s.home) ?? HOMES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where should secrets live?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {HOMES.map((h) => (
              <button
                key={h.id}
                type="button"
                aria-pressed={s.home === h.id}
                onClick={() => set({ home: h.id as Home })}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs",
                  s.home === h.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="flex gap-0.5">
                  {[0, 1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={cn(
                        "h-3 w-1.5 rounded-sm",
                        n <= h.rank ? "bg-good" : "bg-surface-2",
                      )}
                    />
                  ))}
                </span>
                {h.name}
              </button>
            ))}
          </div>
          <motion.p
            key={home.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              home.rank >= 2
                ? "border-good bg-good/10"
                : home.rank === 1
                  ? "border-viz-compute bg-viz-compute/10"
                  : "border-bad bg-bad/10",
            )}
          >
            {home.note}
          </motion.p>
        </div>
      }
    >
      <p>
        Rank the homes from worst to best. A <Term id="secrets-manager">secrets manager</Term>{" "}
        (HashiCorp Vault, OpenBao, and the cloud providers&apos; services) keeps secrets in one
        place, controls who may read each one, logs every access, and can rotate them on a schedule.
      </p>
      <p>
        Best of all is having no long-lived key to leak. CI systems like GitHub Actions can swap a
        short-lived identity token for cloud access that expires when the job ends, so there&apos;s
        nothing lasting to steal.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Keys that cost millions --------------------------------------------------------------------- */

export function BreachStories() {
  const items: [string, string][] = [
    [
      "Uber, 2016",
      "Attackers logged into Uber's private GitHub with reused passwords and found an AWS key in the code, then copied data on 57 million riders and drivers. Uber paid them $100,000 and hid it for a year; it later paid US$148 million to US states, and its former security chief was convicted in 2022.",
    ],
    [
      "Toyota, 2022",
      "A contractor accidentally published code containing an access key to public GitHub. It sat there for almost five years, exposing up to 296,019 customer email addresses.",
    ],
    [
      "Secrets sprawl, 2025",
      "One security firm found about 29 million new secrets in public GitHub commits in a single year, and that 64% of secrets leaked back in 2022 were still valid years later.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keys that cost millions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Private repositories aren&apos;t safe either: the Uber key was in a private repo. And a
        leaked key doesn&apos;t expire on its own: unless someone revokes it, it keeps working for
        years.
      </p>
      <p>
        That&apos;s why scanning matters. GitHub scans public repositories and can block a push that
        contains a known secret; open-source tools like gitleaks and TruffleHog do the same in your
        own pipeline.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What do you do first? ----------------------------------------------------------------------- */

export function HandleLeak() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What do you do first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="handle-leak"
            prompt="A live API key has been committed to a public repo. Which actions help, and which don't?"
            categories={[
              { id: "help", label: "Helps" },
              { id: "no", label: "Doesn't" },
            ]}
            items={[
              {
                id: "revoke",
                label: "Revoke the key and issue a new one",
                category: "help",
                why: "The leaked key stops working.",
              },
              {
                id: "delete",
                label: "Delete the file in a new commit",
                category: "no",
                why: "History, clones and forks keep it.",
              },
              {
                id: "vault",
                label: "Put the new key in a secrets manager",
                category: "help",
                why: "Out of the code, access-controlled.",
              },
              {
                id: "private",
                label: "Make the repository private",
                category: "no",
                why: "It's already been seen; the key still works.",
              },
              {
                id: "scan",
                label: "Turn on secret scanning and push protection",
                category: "help",
                why: "Catches the next one before it lands.",
              },
              {
                id: "oidc",
                label: "Switch CI to short-lived OIDC tokens",
                category: "help",
                why: "No long-lived key to leak.",
              },
            ]}
            explanation="Revoke first, then move the secret somewhere safe and prevent the next leak. Hiding or deleting the file doesn't un-leak it."
          />
        </div>
      }
    >
      <p>Sort the actions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Keys aren't for code", "Nor logs, nor chat."],
  ["Revoke before you tidy", "A leaked key works until revoked."],
  ["History never forgets", "Deleting the commit isn't enough."],
  ["Use a secrets manager", "Central, logged, rotatable."],
  ["Prefer short-lived tokens", "Nothing lasting to steal."],
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
      <p>Next: the code you didn&apos;t write, and how the software supply chain goes wrong.</p>
    </StepLayout>
  );
}
