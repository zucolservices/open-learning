"use client";

import { motion } from "motion/react";
import { Boxes, Box } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PARTS, STEPS, TASK, TOOLS } from "./model";
import type { MonoState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function OneKitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One big kitchen, or five small ones?"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <Boxes className="text-accent size-5" />
            <p className="mt-1 font-semibold">Five small kitchens</p>
            <p className="text-muted">
              Each team runs its own. Changing the shared spice mix means visiting all five.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <Box className="text-accent size-5" />
            <p className="mt-1 font-semibold">One big kitchen</p>
            <p className="text-muted">
              Change the spice mix once and everyone uses it, but the kitchen needs good
              organisation.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A restaurant group can give each restaurant its own kitchen, or cook everything in one
        central kitchen. Separate kitchens are simple and independent. A central kitchen makes
        shared changes easy, but only if it&apos;s well run.
      </p>
      <p>
        Code faces the same choice: many repositories (a polyrepo setup) or one{" "}
        <Term id="monorepo">monorepo</Term> holding everything. And{" "}
        <Term id="submodule">submodules</Term> let one repository include another.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One change, two shapes ⭐ --------------------------------------------------------------------- */

export function OneChange() {
  const [s, set] = useSceneState<MonoState>();
  const steps = STEPS[s.shape];
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="One change, two shapes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.shape}
            onChange={(v) => set({ shape: v, step: 0 })}
            options={[
              ["poly", "Many repositories"],
              ["mono", "One monorepo"],
            ]}
            size="sm"
          />
          <div
            className={cn(
              "flex flex-wrap gap-1.5 rounded-xl border p-2",
              s.shape === "mono" ? "border-accent bg-accent-soft" : "border-transparent",
            )}
          >
            {PARTS.map((p) => (
              <span
                key={p}
                className={cn(
                  "rounded-lg border px-2 py-1 text-[11px]",
                  s.shape === "poly" ? "border-line-strong bg-surface" : "border-line bg-surface",
                  p === "shared UI kit" && "border-accent font-semibold",
                )}
              >
                {s.shape === "poly" ? "📦 " : "📁 "}
                {p}
              </span>
            ))}
          </div>
          <p className="text-muted text-xs">Task: {TASK}</p>
          <ol className="grid gap-1.5">
            {steps.map((st, i) => (
              <motion.li
                key={s.shape + st.step}
                animate={{ opacity: i <= s.step ? 1 : 0.25 }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  i === s.step ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="font-semibold">{st.step}</p>
                {i <= s.step && <p className="text-muted">{st.note}</p>}
              </motion.li>
            ))}
          </ol>
          <button
            type="button"
            disabled={s.step >= steps.length - 1}
            onClick={() => set({ step: s.step + 1 })}
            className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
          >
            Next step
          </button>
        </div>
      }
    >
      <p>
        Make the same change, renaming a function in a shared UI kit, in both setups and compare
        what it takes.
      </p>
      <p>
        Neither shape is free. Many repositories keep teams independent but let versions drift. A
        monorepo makes cross-cutting changes atomic but needs tooling to stay fast.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Submodules ----------------------------------------------------------------------------------- */

export function Submodules() {
  const [s, set] = useSceneState<MonoState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Submodules: a repository inside a repository"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p className="text-muted">$ git ls-tree HEAD</p>
            <p>100644 blob 9b3317… README.md</p>
            <p>
              <span className="text-accent">160000 commit 4f1c2e…</span> ui-kit
            </p>
            <p className="text-muted mt-1">$ cat .gitmodules</p>
            <p>
              [submodule &quot;ui-kit&quot;] path = ui-kit · url =
              https://git.example/cafe/ui-kit.git
            </p>
          </div>
          <Segmented
            value={s.sub}
            onChange={(v) => set({ sub: v })}
            options={[
              ["bump", "Update the submodule properly"],
              ["forgot", "Forget --recurse-submodules"],
            ]}
            size="sm"
          />
          <p className="text-sm">
            {s.sub === "bump"
              ? "cd ui-kit, check out the new version, cd back, then commit the new pinned commit in the outer repository. Everyone who pulls gets exactly that version."
              : "A plain clone leaves ui-kit as an empty folder. Run git submodule update --init --recursive, or clone with --recurse-submodules."}
          </p>
        </div>
      }
    >
      <p>
        A submodule pins another repository at one exact commit: the outer repository stores a
        special tree entry (mode 160000) and a <code>.gitmodules</code> file with the URL.
      </p>
      <p>
        That precision is the point, and the pain: updating means a deliberate extra commit, and
        forgetting the submodule steps is a classic source of confusion. <code>git subtree</code>,
        shipped in Git&apos;s contrib folder, copies the other project&apos;s files in instead.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tooling() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What makes monorepos work"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {TOOLS.map(([t, b], i) => (
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
          <p className="text-subtle text-[10px]">
            All open source and actively released as of October 2026.
          </p>
        </div>
      }
    >
      <p>
        The biggest monorepos aren&apos;t even Git: Google&apos;s runs on its in-house system,
        Piper. Microsoft moved Windows to Git in 2017 with a virtual file system, and now recommends
        Scalar for new large repositories.
      </p>
      <p>
        For everyone else, build tools that understand dependencies (what to rebuild and test after
        a change) matter more than the version control system itself.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function MonoCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Monorepo, polyrepo or submodule?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-monorepos"
            prompt="What fits each situation best?"
            categories={[
              { id: "mono", label: "Monorepo" },
              { id: "poly", label: "Separate repos" },
              { id: "sub", label: "Submodule" },
            ]}
            items={[
              {
                id: "atomic",
                label: "Teams often change shared code and all callers together",
                category: "mono",
                why: "Atomic cross-project changes.",
              },
              {
                id: "vendor",
                label: "Pin an external open-source library at an exact commit inside your project",
                category: "sub",
                why: "That's what submodules do.",
              },
              {
                id: "indep",
                label: "Independent products with separate teams, release cycles and access rules",
                category: "poly",
                why: "Independence matters more.",
              },
              {
                id: "theme",
                label: "A shared theme used by several sites, pinned per site",
                category: "sub",
                why: "Each site pins its own version.",
              },
              {
                id: "tools",
                label:
                  "One organisation with a strong build-tooling team and lots of shared libraries",
                category: "mono",
                why: "Tooling makes it scale.",
              },
            ]}
            explanation="Monorepos make shared changes atomic; separate repositories keep teams independent; submodules pin another repository at an exact commit."
          />
        </div>
      }
    >
      <p>Sort each situation.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Monorepo", "Everything in one repository; atomic shared changes."],
        ["Polyrepo", "Independent repositories; versions can drift."],
        ["Submodules pin commits", "Precise, but need extra steps."],
        ["Tooling decides", "Dependency-aware builds make monorepos scale."],
        ["No universal answer", "Fit the shape to your teams."],
      ]}
    >
      <p>Next: proving who made a commit, and cleaning up a leaked secret.</p>
    </WrapStep>
  );
}
