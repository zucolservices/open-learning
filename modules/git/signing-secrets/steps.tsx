"use client";

import { motion } from "motion/react";
import { Stamp, BadgeCheck, ShieldAlert, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { IMPOSTOR, LOG, STEPS } from "./model";
import type { SignState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function SealedLetter() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Anyone can sign a name"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A typed name at the bottom</p>
            <p className="text-muted">
              &ldquo;Yours, the manager.&rdquo; Anyone could have typed it.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <Stamp className="text-accent size-5" />
            <p className="mt-1 font-semibold">A wax seal only the manager owns</p>
            <p className="text-muted">
              Hard to fake, and anyone can check it against a known seal.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A letter that ends with a typed name proves nothing; a seal only one person owns does.
        Git&apos;s author name and email are like the typed name: whatever someone set in their
        config.
      </p>
      <p>
        A <Term id="signed-commit">signed commit</Term> carries a cryptographic signature made with
        a key only its owner has (GPG, SSH or X.509). Hosting platforms check it and show a
        &ldquo;Verified&rdquo; badge.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Spot the impostor, clean the leak ⭐ ---------------------------------------------------------- */

export function Investigate() {
  const [s, set] = useSceneState<SignState>();
  const next = STEPS.filter((x) => !s.done.includes(x.id)).sort((a, b) => a.order - b.order)[0];
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Spot the impostor, then clean up the leak"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">
            1 · Which commit didn&apos;t really come from the maintainer?
          </p>
          <div className="border-line bg-surface rounded-xl border font-mono text-[11px]">
            {LOG.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set({ suspect: c.id })}
                className={cn(
                  "grid w-full grid-cols-[4.5rem_1fr_6rem] items-center gap-2 px-3 py-1.5 text-left",
                  s.suspect === c.id && (c.id === IMPOSTOR ? "bg-good/15" : "bg-bad/15"),
                )}
              >
                <span className="text-accent">{c.id}</span>
                <span>
                  {c.msg} <span className="text-subtle font-sans">· {c.author}</span>
                </span>
                <span className="flex items-center justify-end gap-1 font-sans text-[10px]">
                  {c.status === "verified" ? (
                    <>
                      <BadgeCheck className="text-good size-3.5" /> Verified
                    </>
                  ) : (
                    <span className="text-subtle">no signature</span>
                  )}
                </span>
              </button>
            ))}
          </div>
          {s.suspect && (
            <p className="flex items-start gap-1.5 text-xs">
              {s.suspect === IMPOSTOR ? (
                <Check className="text-good mt-0.5 size-3.5 shrink-0" />
              ) : (
                <X className="text-bad mt-0.5 size-3.5 shrink-0" />
              )}
              {s.suspect === IMPOSTOR
                ? "Right. Meera signs every commit; this one has her name but no signature, and it changes where payments go. Anyone can set user.name to 'Meera'."
                : "That one is signed and verified. Look for the commit with the maintainer's name but no signature."}
            </p>
          )}
          <p className="text-muted mt-1 text-[10px] uppercase">
            2 · A payment key was committed in config.env. Do the steps in order.
          </p>
          <div className="grid gap-1">
            {STEPS.map((x) => {
              const done = s.done.includes(x.id);
              return (
                <button
                  key={x.id}
                  type="button"
                  disabled={done}
                  onClick={() => {
                    if (next && x.id === next.id) set({ done: [...s.done, x.id], miss: "" });
                    else set({ miss: x.label });
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    done ? "border-good/50 bg-good/10" : "border-line hover:bg-surface-2",
                  )}
                >
                  {done && <span className="text-good mr-1 font-mono">{x.order}.</span>}
                  {x.label}
                  {done && <span className="text-muted block text-[10px]">{x.why}</span>}
                </button>
              );
            })}
          </div>
          <p className="text-subtle text-[10px]">
            {!next
              ? "Done, in the right order."
              : s.miss
                ? `Not yet: "${s.miss}" comes later. What has to happen first?`
                : "Click the step that should come next."}
          </p>
        </div>
      }
    >
      <p>
        First, a payment endpoint was changed by a commit that claims to be from the maintainer.
        Find the one that can&apos;t be trusted.
      </p>
      <p>
        Then, a real-world classic: a secret key was committed. Order matters. Rewriting history
        doesn&apos;t un-leak a key that clones, forks and scanners already have, so the first step
        is always to revoke it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Anyone can be anyone -------------------------------------------------------------------------- */

export function Spoof() {
  const [s, set] = useSceneState<SignState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Anyone can claim to be anyone"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p>$ git config user.name &quot;Meera&quot;</p>
            <p>$ git config user.email &quot;meera@cafe.example&quot;</p>
            <p>$ git commit -m &quot;Totally legit change&quot;</p>
            <p className="text-muted">Author: Meera &lt;meera@cafe.example&gt;</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.spoof}
              onChange={(e) => set({ spoof: e.target.checked })}
              className="accent-accent"
            />
            Sign commits with your own key
          </label>
          <div
            className={cn(
              "rounded-xl border p-3 text-xs",
              s.spoof ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            {s.spoof ? (
              <>
                <p className="flex items-center gap-1 font-semibold">
                  <BadgeCheck className="text-good size-4" /> Verified
                </p>
                <p className="mt-1 font-mono text-[10px]">
                  git config commit.gpgsign true · git config gpg.format ssh
                </p>
                <p className="mt-1">
                  The platform checks the signature against the key registered to that account.
                </p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-1 font-semibold">
                  <ShieldAlert className="text-bad size-4" /> Looks like Meera, proves nothing
                </p>
                <p className="mt-1">
                  Without a signature, the name is just text. GitHub&apos;s optional vigilant mode
                  marks your unsigned commits as Unverified so impostors stand out.
                </p>
              </>
            )}
          </div>
        </div>
      }
    >
      <p>
        Git has signed commits since long ago with GPG, and since Git 2.34 (2021) with ordinary SSH
        keys, which most developers already have. Platforms like GitHub and GitLab verify them.
      </p>
      <p>
        Newer &ldquo;keyless&rdquo; tools such as Sigstore&apos;s gitsign sign with short-lived
        certificates tied to your login, though hosting platforms don&apos;t yet show those as
        Verified.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Preventing leaks ------------------------------------------------------------------------------ */

export function Prevent() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Stopping the next leak"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [".gitignore", "List .env and credential files so they're never staged by accident."],
            [
              "A pre-commit hook",
              "Scan staged changes for anything that looks like a key, and refuse the commit (next module).",
            ],
            [
              "Platform push protection",
              "GitHub blocks pushes containing known secret formats; it's on by default for public repositories since 2024.",
            ],
            [
              "A secrets manager",
              "Keep keys out of the code entirely: environment variables or a vault, injected at runtime.",
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
        Deleting a secret in a new commit doesn&apos;t help: it&apos;s still in every earlier
        commit. And rewriting history is disruptive and never complete. Prevention is far cheaper
        than cleanup.
      </p>
      <p>The Application Security track goes deeper into secrets management.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SignCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="True or false?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-signing-secrets"
            prompt="Is each statement true?"
            categories={[
              { id: "true", label: "True" },
              { id: "false", label: "False" },
            ]}
            items={[
              {
                id: "name",
                label: "The author name on a commit proves who wrote it",
                category: "false",
                why: "It's just config text.",
              },
              {
                id: "ssh",
                label: "You can sign commits with an SSH key",
                category: "true",
                why: "Since Git 2.34.",
              },
              {
                id: "delete",
                label: "Deleting a leaked key in a new commit makes it safe",
                category: "false",
                why: "It's still in history; revoke it.",
              },
              {
                id: "first",
                label: "The first step after a leak is to revoke the key",
                category: "true",
                why: "Assume it's already copied.",
              },
              {
                id: "repo",
                label: "git filter-repo is recommended over filter-branch",
                category: "true",
                why: "Per Git's own docs.",
              },
              {
                id: "forks",
                label: "Rewriting history removes the key from every fork and clone",
                category: "false",
                why: "Copies elsewhere keep it.",
              },
            ]}
            explanation="Names prove nothing without signatures, and a leaked secret is leaked: revoke first, clean history second, prevent next."
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
        ["Author names are unverified", "Anyone can set any name."],
        ["Sign commits", "GPG, SSH (Git 2.34+) or X.509; platforms verify."],
        ["Leaked secret: revoke first", "Then rewrite with git filter-repo."],
        ["Rewrites don't reach copies", "Forks and clones keep the old history."],
        ["Prevent", ".gitignore, hooks, push protection, a vault."],
      ]}
    >
      <p>Next: hooks that check every commit and push automatically.</p>
    </WrapStep>
  );
}
