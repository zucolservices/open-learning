"use client";

import { motion } from "motion/react";
import { Package } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUMPS, FRAMES, REGISTRIES, bump, type Mode } from "./model";
import type { ArtifactState } from "./state";

/* 1 ─ Rebuild or promote? ⭐ ---------------------------------------------------------------------- */

/** A stable colour per build hash, from the fixed viz palette. */
const HASH_CLS: Record<string, string> = {
  "7f3e": "border-viz-add bg-viz-add/15 text-viz-add",
  c91d: "border-viz-compute bg-viz-compute/15 text-viz-compute",
  e05a: "border-viz-remove bg-viz-remove/15 text-viz-remove",
};

export function RebuildOrPromote() {
  const [s, set] = useSceneState<ArtifactState>();
  const frames = FRAMES[s.mode];
  const frame = Math.min(s.frame, frames.length - 1);
  const f = frames[frame];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Rebuild or promote?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<Mode>
              size="sm"
              value={s.mode}
              onChange={(mode) => set({ mode, frame: 0 })}
              options={[
                ["rebuild", "Rebuild for each environment"],
                ["promote", "Build once, promote"],
              ]}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted mb-1 text-[10px]">Builds of commit a1b2c3</p>
            <div className="flex flex-wrap gap-1.5">
              {f.builds.map((b) => (
                <motion.span
                  key={b.hash}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px]",
                    HASH_CLS[b.hash],
                  )}
                >
                  <Package className="size-3" /> {b.hash} · {b.note}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {f.envs.map((e) => (
              <div
                key={e.name}
                className="border-line bg-surface flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-2"
              >
                <span className="text-xs font-semibold">{e.name}</span>
                {e.hash ? (
                  <motion.span
                    key={`${s.mode}-${e.hash}`}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn(
                      "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                      HASH_CLS[e.hash],
                    )}
                  >
                    {e.hash}
                  </motion.span>
                ) : (
                  <span className="text-subtle font-mono text-[10px]">nothing yet</span>
                )}
                <span className={cn("text-[10px]", e.tested ? "text-good" : "text-muted")}>
                  {e.hash ? (e.tested ? "tested ✓" : "never tested") : ""}
                </span>
              </div>
            ))}
          </div>
          <Stepper step={frame} count={frames.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption
            frameKey={`${s.mode}-${frame}`}
            title={f.title}
            tone={
              f.bad
                ? "bad"
                : s.mode === "promote" && frame === frames.length - 1
                  ? "good"
                  : undefined
            }
          >
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        An <Term id="artifact">artifact</Term> is the packaged output of a build: a container image,
        a .jar, a zip of a website. Where you build it, and how often, matters more than it looks.
      </p>
      <p>
        Step through both ways. Humble and Farley&apos;s <em>Continuous Delivery</em> puts the rule
        as a heading: &ldquo;Only Build Your Binaries Once&rdquo;. Rebuild for each environment and
        you risk picking up &ldquo;a different version of some third-party library that you
        didn&apos;t intend&rdquo;.
      </p>
      <p>
        Build once, store the artifact in an <Term id="artifact-registry">artifact registry</Term>,
        and <Term id="promotion">promote</Term> that exact artifact. Only configuration changes
        between environments.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Versions that mean something ---------------------------------------------------------------- */

export function Versions() {
  const [s, set] = useSceneState<ArtifactState>();
  const v = s.version;
  const last = BUMPS.find((b) => b.id === s.lastBump);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Versions that mean something"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <motion.p
            key={v.join(".")}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-mono text-5xl font-semibold tracking-tight"
          >
            {v.map((n, i) => (
              <span key={i}>
                {i > 0 && <span className="text-muted">.</span>}
                <span
                  className={cn(
                    last &&
                      ((last.id === "major" && i === 0) ||
                        (last.id === "minor" && i === 1) ||
                        (last.id === "patch" && i === 2))
                      ? "text-accent"
                      : "",
                  )}
                >
                  {n}
                </span>
              </span>
            ))}
          </motion.p>
          <div className="text-muted flex gap-6 font-mono text-[10px]">
            <span>MAJOR</span>
            <span>MINOR</span>
            <span>PATCH</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {BUMPS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => set({ version: bump(v, b.id), lastBump: b.id })}
                className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 text-xs"
              >
                {b.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => set({ version: [2, 4, 1], lastBump: "" })}
              className="text-muted rounded-full px-3 py-1 text-xs"
            >
              Reset
            </button>
          </div>
          {last && (
            <motion.div
              key={`${v.join(".")}-${last.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface w-full max-w-md rounded-xl border px-4 py-3 text-sm"
            >
              <p className="font-mono text-xs">{last.commit}</p>
              <p className="text-muted mt-1">{last.meaning}</p>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        <Term id="semver">Semantic versioning</Term> packs a promise into three numbers. Anyone
        depending on 2.4.1 knows 2.4.2 only fixes bugs, 2.5.0 adds things without breaking them, and
        3.0.0 may break their code.
      </p>
      <p>
        Its third rule is the one pipelines care about: &ldquo;Once a versioned package has been
        released, the contents of that version MUST NOT be modified.&rdquo; Fixes get a new number.
      </p>
      <p>
        Tools such as semantic-release and release-please can pick the next number from commit
        messages written in the Conventional Commits style (fix:, feat:, a ! for breaking). Some
        projects prefer calendar versions instead, like Ubuntu 24.04.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where artifacts live ------------------------------------------------------------------------ */

export function WhereTheyLive() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where artifacts live"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {REGISTRIES.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface grid gap-1 rounded-lg border px-3 py-2 sm:grid-cols-[13rem_1fr]"
            >
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-muted text-[10px]">{r.holds}</p>
              </div>
              <p className="text-muted self-center text-xs">{r.immutable}</p>
            </motion.div>
          ))}
          <div className="border-viz-compute/50 bg-viz-compute/10 mt-1 rounded-lg border px-3 py-2 text-xs">
            A tag like <span className="font-mono">payments-api:2.4.1</span> is a label that can be
            moved to different contents unless the registry forbids it. A digest like{" "}
            <span className="font-mono">sha256:7f3e…</span> is computed from the contents, so it
            can&apos;t. More on that next module.
          </div>
        </div>
      }
    >
      <p>
        Pipeline storage isn&apos;t a registry: GitHub deletes workflow artifacts after 90 days by
        default. Releases belong in a registry built to keep them, with the version as the key.
      </p>
      <p>
        Most registries can refuse to overwrite a version once it exists. Public ones go further:
        npm and PyPI never let a version or file name be reused, even after deletion.
      </p>
      <p>
        Housekeeping matters too: cleanup or lifecycle policies delete old builds, but keep the last
        few releases so you always have something to roll back to.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The overwritten version --------------------------------------------------------------------- */

export function Overwritten() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The overwritten version"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="overwritten-version"
            prompt="Staging tested payments-api:2.4.1 and it was fine. Last night someone rebuilt with a 'tiny fix' and pushed it as 2.4.1 again. Production pulled 2.4.1 this morning and broke. Which rule would have prevented it?"
            options={[
              {
                id: "tests",
                label: "Write more tests",
                feedback:
                  "The tests passed on the 2.4.1 they ran against; they never saw the replacement.",
              },
              {
                id: "immutable",
                label: "Make versions immutable in the registry, so 2.4.1 can't be pushed twice",
                correct: true,
                feedback:
                  "The push would have failed, and the fix would have needed its own version, 2.4.2, which goes through test and staging like any other.",
              },
              {
                id: "latest",
                label: "Deploy the latest tag instead",
                feedback: "latest is just another movable tag, and moves more often than any.",
              },
              {
                id: "staging",
                label: "Make staging bigger",
                feedback: "Staging was fine; it ran something else.",
              },
            ]}
            explanation="A version name must always mean the same bytes. Immutable versions, or deploying by digest, make 'what we tested' and 'what we shipped' provably the same."
          />
        </div>
      }
    >
      <p>
        This happens in real life too. In March 2025 attackers moved the version tags of a popular
        GitHub Action, tj-actions/changed-files, to point at malicious code. More than 23,000
        repositories referenced it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Build once", "One build per commit; promote that artifact everywhere."],
  ["Config, not code, differs", "Environments change settings, never the artifact."],
  ["Versions are promises", "MAJOR.MINOR.PATCH, and a released version never changes."],
  ["Keep them in a registry", "With immutable versions and sensible cleanup."],
  ["Record where it came from", "Commit, build number and digest on every artifact."],
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
        Container images can carry their origin inside them, as standard labels such as
        org.opencontainers.image.revision (the commit) and .source (the repository). When something
        breaks at 2 a.m., that label tells you exactly which code is running.
      </p>
      <p>Next: how a container image is actually built, layer by layer.</p>
    </StepLayout>
  );
}
