"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, Zap } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ECOSYSTEMS, fmtMin, simulate, type Cache, type Deps, type Tool } from "./model";
import type { BuildState } from "./state";

/* 1 ─ Same code, different build ------------------------------------------------------------------ */

const STORIES: { when: string; title: string; text: string }[] = [
  {
    when: "22 Mar 2016",
    title: "left-pad disappears",
    text: "A developer unpublished 273 packages from npm after a dispute. One of them, left-pad, was 11 lines long and sat deep in the dependencies of Babel and thousands of other projects. Builds around the world failed for about two and a half hours, until npm restored it.",
  },
  {
    when: "8 Jan 2022",
    title: "colors 1.4.1 loops forever",
    text: 'The author of colors, a popular library for coloured terminal text, published version 1.4.1 with code that printed garbage in an endless loop. Any project that asked for "^1.4.0" picked it up on its next install, without changing a line of its own code.',
  },
];

export function SameCode() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Same code, different build"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {STORIES.map((st, i) => (
            <motion.div
              key={st.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-accent font-mono text-xs">{st.when}</p>
              <p className="mt-0.5 font-semibold">{st.title}</p>
              <p className="text-muted mt-1 text-sm">{st.text}</p>
            </motion.div>
          ))}
          <Code>{`"dependencies": {
  "colors": "^1.4.0"   // any 1.x from 1.4.0 up: 1.4.1 counts
}`}</Code>
        </div>
      }
    >
      <p>
        A <Term id="build">build</Term> turns source code into something that runs. Most of what it
        pulls in isn&apos;t your code: it&apos;s <Term id="dependency">dependencies</Term>,
        libraries other people publish, and the libraries those depend on.
      </p>
      <p>
        If the build asks for &ldquo;any recent 1.x&rdquo;, two builds of the same commit a week
        apart can contain different code. Both of these really happened, and in both cases the teams
        hit had changed nothing.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pin it, then cache it ⭐ ---------------------------------------------------------------------- */

export function PinAndCache() {
  const [s, set] = useSceneState<BuildState>();
  const results = simulate(s.deps, s.tool, s.cache);
  const total = results.reduce((n, r) => n + r.minutes, 0);
  const same = results.filter((r) => r.sameAsDay1).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Pin it, then cache it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <p className="text-muted mb-1 text-[10px]">Dependencies</p>
              <Segmented<Deps>
                size="sm"
                value={s.deps}
                onChange={(deps) => set({ deps })}
                options={[
                  ["range", "^ ranges"],
                  ["lock", "Lockfile"],
                ]}
              />
            </div>
            <div>
              <p className="text-muted mb-1 text-[10px]">Node.js version</p>
              <Segmented<Tool>
                size="sm"
                value={s.tool}
                onChange={(tool) => set({ tool })}
                options={[
                  ["any", "Whatever's there"],
                  ["pinned", "Pinned"],
                ]}
              />
            </div>
            <div>
              <p className="text-muted mb-1 text-[10px]">Caching</p>
              <Segmented<Cache>
                size="sm"
                value={s.cache}
                onChange={(cache) => set({ cache })}
                options={[
                  ["none", "None"],
                  ["deps", "Deps"],
                  ["deps+build", "Deps + build"],
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {results.map((r) => {
              const hang = r.outcome === "hang";
              return (
                <motion.div
                  key={r.run.day}
                  layout
                  className={cn(
                    "grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-1.5 sm:grid-cols-[13rem_1fr_auto]",
                    hang ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
                  )}
                >
                  <span className="text-xs font-medium">{r.run.label}</span>
                  <span className="text-muted order-3 col-span-2 flex flex-wrap gap-x-3 font-mono text-[10px] sm:order-none sm:col-span-1">
                    <span className={r.colors !== "1.4.0" ? "text-bad" : ""}>
                      colors {r.colors}
                    </span>
                    <span className={r.node !== "24" ? "text-viz-compute" : ""}>node {r.node}</span>
                    <span className={r.installHit ? "text-good" : ""}>
                      deps {r.installHit ? "cached" : "downloaded"}
                    </span>
                    {s.cache === "deps+build" && (
                      <span className={r.buildHit !== "none" ? "text-good" : ""}>
                        build{" "}
                        {r.buildHit === "full"
                          ? "reused"
                          : r.buildHit === "partial"
                            ? "mostly reused"
                            : "from scratch"}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1 justify-self-end font-mono text-xs",
                      hang ? "text-bad" : "text-fg",
                    )}
                  >
                    {hang ? (
                      <AlertTriangle className="size-3" />
                    ) : r.minutes < 5 ? (
                      <Zap className="text-good size-3" />
                    ) : (
                      <Check className="text-good size-3" />
                    )}
                    {fmtMin(r.minutes)}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              <p className="text-muted text-[10px]">Builds identical to day 1</p>
              <p className={cn("font-mono text-sm font-semibold", same < 5 && "text-bad")}>
                {same} of 5
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              <p className="text-muted text-[10px]">Total pipeline time</p>
              <p className="font-mono text-sm font-semibold">{Math.round(total)} min</p>
            </div>
          </div>
          <p className="text-muted text-[10px]">
            Illustrative timings. On day 8 colors 1.4.1 is published and the hosted runner moves to
            a newer Node.js. A hanging build runs until the job&apos;s time limit; we stop the clock
            at 60 minutes.
          </p>
        </div>
      }
    >
      <p>
        Five builds over ten days. First make them identical: lock the dependency versions and pin
        the toolchain. Then make them fast with caches.
      </p>
      <p>
        A <Term id="lockfile">lockfile</Term> records the exact version of every dependency,
        including the ones underneath, and <code className="font-mono text-xs">npm ci</code>{" "}
        installs exactly that, failing rather than quietly updating. The lockfile also makes a
        perfect <Term id="build-cache">cache</Term> key: same lockfile, same downloads, so reuse
        them.
      </p>
      <p>
        Notice the order. A cache on an unpinned build just makes the wrong thing faster, and a
        change of toolchain throws the build cache away.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Every ecosystem has one --------------------------------------------------------------------- */

export function Ecosystems() {
  const [s, set] = useSceneState<BuildState>();
  const e = ECOSYSTEMS.find((x) => x.id === s.eco) ?? ECOSYSTEMS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Every ecosystem has one"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {ECOSYSTEMS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ eco: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.eco === x.id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface grid gap-2 rounded-xl border px-4 py-3 sm:grid-cols-2"
          >
            <div>
              <p className="text-muted text-[10px]">Lock file</p>
              <p className="font-mono text-sm">{e.file}</p>
            </div>
            <div>
              <p className="text-muted text-[10px]">Install in CI</p>
              <p className="font-mono text-sm">{e.install}</p>
            </div>
            <p className="text-muted text-sm sm:col-span-2">{e.note}</p>
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-sm font-semibold">Reproducible</p>
              <p className="text-muted text-xs">
                &ldquo;Given the same source code, build environment and build instructions, any
                party can recreate bit-by-bit identical copies of all specified artifacts.&rdquo;
              </p>
              <p className="text-muted mt-1 text-[10px]">— reproducible-builds.org</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-sm font-semibold">Hermetic</p>
              <p className="text-muted text-xs">
                Built in isolation from whatever happens to be on the machine, so only declared
                inputs can affect the result. Bazel is designed around it.
              </p>
              <p className="text-muted mt-1 text-[10px]">— after the Bazel docs</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Every language has its own lockfile and a strict way to install from it in CI. The rule is
        the same everywhere: commit the lockfile, and make CI refuse to change it.
      </p>
      <p>
        A lockfile is a big step, not the finish line. It fixes dependency versions, but not the
        compiler, the operating system or the clock, so it doesn&apos;t give you a bit-for-bit{" "}
        <Term id="reproducible-build">reproducible build</Term>. And it can&apos;t help if the
        pinned version vanishes: left-pad broke builds that had pinned it exactly.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Repeatable or faster? ------------------------------------------------------------------------ */

export function RepeatableFaster() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Repeatable or faster?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="repeatable-faster"
            prompt="What does each practice mainly buy you?"
            categories={[
              { id: "same", label: "Repeatable" },
              { id: "fast", label: "Faster" },
            ]}
            items={[
              {
                id: "lock",
                label: "Committing the lockfile",
                category: "same",
                why: "Every install gets exactly the same versions.",
              },
              {
                id: "ci",
                label: "Using npm ci instead of npm install",
                category: "same",
                why: "It installs only what the lockfile says and fails on any mismatch.",
              },
              {
                id: "image",
                label: "Building inside a container image pinned by digest",
                category: "same",
                why: "The toolchain and operating system can't drift under you.",
              },
              {
                id: "depcache",
                label: "Caching downloads, keyed on the lockfile's hash",
                category: "fast",
                why: "Same lockfile, same downloads: skip fetching them again.",
              },
              {
                id: "remote",
                label: "A shared remote build cache",
                category: "fast",
                why: "Work someone already built with the same inputs is reused, not rebuilt.",
              },
              {
                id: "affected",
                label: "Restoring a near-match cache when the exact key misses",
                category: "fast",
                why: "A partial hit still saves most downloads; the install fills the gap.",
              },
            ]}
            explanation="Pin first, then cache. Caches are only safe when the build is repeatable: otherwise they reuse something that no longer matches what a fresh build would make."
          />
        </div>
      }
    >
      <p>Sort the practices by what they mainly do.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Pin dependencies", "Commit the lockfile; install from it strictly in CI."],
  ["Pin the toolchain", "Node, Python, JDK and OS versions, ideally in a container image."],
  ["Cache on the right key", "A hash of the lockfile: change it and the cache rebuilds."],
  ["Reuse built work", "Remote build caches skip what's already been built from the same inputs."],
  ["Order matters", "Repeatable first, fast second."],
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
        On GitHub Actions, a dependency cache is a few lines with actions/cache or the cache option
        of setup-node, keyed on the lockfile. Unused caches are evicted after seven days, and each
        repository gets 10 GB free.
      </p>
      <p>Next: the tests that run after the build, and how to tell good ones from noisy ones.</p>
    </StepLayout>
  );
}
