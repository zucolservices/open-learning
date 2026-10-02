"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BASES, simulate, type Base, type Change } from "./model";
import type { ImageState } from "./state";

/* 1 ─ A stack of sheets --------------------------------------------------------------------------- */

const SHEETS = [
  {
    t: "Base image",
    d: "An operating system and Node.js, someone else's layers",
    tone: "bg-viz-idle/30",
  },
  { t: "package.json + lockfile", d: "changes when dependencies change", tone: "bg-viz-meta/30" },
  { t: "npm ci", d: "hundreds of MB of dependencies", tone: "bg-viz-compute/30" },
  { t: "Your source code", d: "changes on every commit", tone: "bg-viz-data/30" },
  { t: "npm run build", d: "the app itself", tone: "bg-viz-add/30" },
];

export function Sheets() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A stack of transparent sheets"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-1">
          {SHEETS.slice()
            .reverse()
            .map((sh, i) => (
              <motion.div
                key={sh.t}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 - 0.1 * i }}
                className={cn(
                  "border-line flex w-full max-w-md items-baseline justify-between gap-2 rounded-lg border px-3 py-2",
                  sh.tone,
                )}
                style={{ transform: `skewX(-8deg)` }}
              >
                <span className="text-sm font-semibold">{sh.t}</span>
                <span className="text-muted text-[11px]">{sh.d}</span>
              </motion.div>
            ))}
          <p className="text-muted mt-2 text-center font-mono text-[10px]">
            change a sheet and every sheet above it must be redrawn
          </p>
        </div>
      }
    >
      <p>
        Picture an animation drawn on transparent sheets stacked on top of each other. Swap the top
        sheet and you redraw one sheet. Swap one near the bottom and everything above it has to be
        redrawn too.
      </p>
      <p>
        A <Term id="container-image">container image</Term> is built the same way from a{" "}
        <Term id="dockerfile">Dockerfile</Term>. Every instruction is a step the builder can reuse
        from its cache, and RUN, COPY and ADD each add a <Term id="image-layer">layer</Term> of
        files. Docker&apos;s rule: &ldquo;Once a layer changes, then all downstream layers need to
        be rebuilt as well.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Slim it down ⭐ ------------------------------------------------------------------------------ */

const BASE_ORDER: Base[] = ["full", "slim", "alpine", "distroless"];
const MAX_MB = 1900;

export function SlimItDown() {
  const [s, set] = useSceneState<ImageState>();
  const base = !s.multi && s.base === "distroless" ? "slim" : s.base;
  const r = simulate({
    goodOrder: s.goodOrder,
    multi: s.multi,
    base,
    ignore: s.ignore,
    change: s.change,
  });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Slim it down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
            {(
              [
                ["goodOrder", "Copy package files and install before copying the code"],
                ["multi", "Multi-stage build (build tools stay behind)"],
                ["ignore", ".dockerignore (skip .git, local node_modules, .env)"],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={s[k]}
                  onChange={() => set({ [k]: !s[k] })}
                  className="accent-accent"
                />
                {label}
              </label>
            ))}
            <div className="flex flex-wrap items-center gap-1.5 text-xs sm:col-span-2">
              <span className="text-muted">Runtime base:</span>
              {BASE_ORDER.map((b) => {
                const disabled = b === "distroless" && !s.multi;
                return (
                  <button
                    key={b}
                    type="button"
                    disabled={disabled}
                    onClick={() => set({ base: b })}
                    title={
                      disabled ? "Distroless has no npm: it needs a multi-stage build" : undefined
                    }
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 font-mono text-[10px] disabled:opacity-35",
                      base === b
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {BASES[b].image
                      .replace("gcr.io/distroless/", "distroless/")
                      .replace(":nonroot", "")}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 text-xs sm:flex-row sm:items-center sm:gap-2">
            <span className="text-muted">This commit:</span>
            <Segmented<Change>
              size="sm"
              value={s.change}
              onChange={(change) => set({ change })}
              options={[
                ["code", "Edits a source file"],
                ["deps", "Adds a dependency"],
              ]}
            />
          </div>
          <div className="bg-surface-2 rounded-xl px-2 py-2 font-mono text-[10.5px]">
            {r.lines.map((l, i) => (
              <motion.div
                key={`${l.text}-${i}`}
                layout
                className={cn(
                  "grid grid-cols-[1fr_auto] items-center gap-2 rounded px-1.5 py-[1px]",
                  !l.final && "opacity-60",
                )}
              >
                <span className={cn("truncate", l.text.startsWith("FROM") && i > 0 && "mt-1.5")}>
                  {l.text}
                </span>
                <span
                  className={cn(
                    "text-[9px]",
                    l.cached ? "text-good" : l.seconds > 10 ? "text-bad" : "text-viz-compute",
                  )}
                >
                  {l.seconds === 0 && l.mb === 0
                    ? ""
                    : l.cached
                      ? "cached"
                      : `ran · ${l.seconds} s`}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              <p className="text-muted text-[10px]">Rebuild time for this commit</p>
              <p className={cn("font-mono text-sm font-semibold", r.seconds > 100 && "text-bad")}>
                {Math.round(r.seconds)} s
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5 sm:col-span-2">
              <p className="text-muted text-[10px]">Final image, on disk</p>
              <p className={cn("font-mono text-sm font-semibold", r.finalMb > 1000 && "text-bad")}>
                {r.finalMb >= 1000 ? `${(r.finalMb / 1000).toFixed(2)} GB` : `${r.finalMb} MB`}
              </p>
              <div className="bg-surface-2 mt-1 h-2 rounded-full">
                <motion.div
                  animate={{ width: `${Math.min(100, (r.finalMb / MAX_MB) * 100)}%` }}
                  className={cn(
                    "h-full rounded-full",
                    r.finalMb > 1000 ? "bg-bad/70" : "bg-good/70",
                  )}
                />
              </div>
            </div>
          </div>
          <p className="text-muted text-[10px]">
            Illustrative seconds and sizes (base images approximate, uncompressed, October 2026).
            Faded lines belong to stages left out of the final image. Build context sent:{" "}
            {r.contextMb} MB.
          </p>
        </div>
      }
    >
      <p>
        A Node.js service, built badly: code copied before dependencies, everything in one stage on
        the full base image, and the whole folder sent to the builder. Fix it one switch at a time.
      </p>
      <p>
        Reordering lets an ordinary code change reuse the cached dependency layer. A{" "}
        <Term id="multi-stage-build">multi-stage build</Term> lets you &ldquo;selectively copy
        artifacts from one stage to another, leaving behind everything you don&apos;t want in the
        final image&rdquo;: compilers, dev dependencies, source.
      </p>
      <p>
        Smaller runtime bases carry less to download and fewer packages that could hold a known
        vulnerability. Distroless images don&apos;t even have a shell, which is why they need a
        build stage.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tags move, digests don't -------------------------------------------------------------------- */

const TAG_FRAMES = [
  {
    t: "A tag is a name tag",
    d: "payments-api:2.4.1 points at an image whose digest, a SHA-256 hash of its manifest, is sha256:7f3e…",
    tag: "7f3e",
  },
  {
    t: "Someone pushes the same tag again",
    d: "Unless the registry forbids it, the tag now points at different contents, sha256:c91d…. Anyone pulling 2.4.1 tomorrow gets something else.",
    tag: "c91d",
  },
  {
    t: "Pull by digest",
    d: "payments-api@sha256:7f3e… can only ever mean those exact bytes. Deploy by digest, or turn on immutable tags, and 'what we tested' stays 'what we run'.",
    tag: "7f3e",
  },
];

export function TagsDigests() {
  const [s, set] = useSceneState<ImageState>();
  const f = TAG_FRAMES[s.frame];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Tags move, digests don't"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-center font-mono text-xs">
              {s.frame === 2 ? "payments-api@sha256:7f3e…" : "payments-api:2.4.1"}
            </div>
            <span className="text-muted">→</span>
            <div className="flex flex-col gap-1.5">
              {["7f3e", "c91d"].map((h) => (
                <motion.div
                  key={h}
                  animate={{ opacity: f.tag === h ? 1 : 0.3, scale: f.tag === h ? 1 : 0.96 }}
                  className={cn(
                    "rounded-lg border px-3 py-2 font-mono text-xs",
                    h === "7f3e"
                      ? "border-viz-add bg-viz-add/10"
                      : "border-viz-compute bg-viz-compute/10",
                  )}
                >
                  image sha256:{h}…
                </motion.div>
              ))}
            </div>
          </div>
          <Stepper step={s.frame} count={TAG_FRAMES.length} onChange={(frame) => set({ frame })} />
          <FrameCaption
            frameKey={s.frame}
            title={f.t}
            tone={s.frame === 1 ? "bad" : s.frame === 2 ? "good" : undefined}
          >
            {f.d}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A <Term id="image-digest">digest</Term> is computed from the image&apos;s contents, so it
        can&apos;t point anywhere else. &ldquo;latest&rdquo; is just the default tag name, not a
        promise of the newest build.
      </p>
      <p>
        Good habits: tag each build with its commit SHA, deploy by digest, and pin base images by
        digest too, so a rebuild doesn&apos;t quietly pick up a different node:24-slim. Images built
        for both Intel and Arm machines have one digest for the index that lists both; pin that one.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Order the Dockerfile ------------------------------------------------------------------------ */

export function OrderDockerfile() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Order the Dockerfile"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="order-dockerfile"
            prompt="Drag these build-stage lines into the order that reuses the cache best when only source code changes."
            items={[
              {
                id: "from",
                label: <code className="font-mono text-xs">FROM node:24 AS build</code>,
              },
              { id: "wd", label: <code className="font-mono text-xs">WORKDIR /app</code> },
              {
                id: "pkg",
                label: (
                  <code className="font-mono text-xs">COPY package.json package-lock.json ./</code>
                ),
              },
              { id: "ci", label: <code className="font-mono text-xs">RUN npm ci</code> },
              { id: "src", label: <code className="font-mono text-xs">COPY . .</code> },
              { id: "build", label: <code className="font-mono text-xs">RUN npm run build</code> },
            ]}
            explanation="What changes least goes first. The dependency layers come before the source, so editing code only re-runs the last two steps."
          />
        </div>
      }
    >
      <p>Put the slow, rarely changing steps where the cache can keep them.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Order for the cache", "Least-changing first: base, manifests, install, then code."],
  ["Leave the tools behind", "Multi-stage builds ship only what runs."],
  ["Small, maintained bases", "Slim, distroless or hardened images; non-root users."],
  ["Deploy by digest", "Tags can move; digests can't."],
  ["Scan every image", "Trivy, Grype, Docker Scout or your registry's scanner."],
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
        In CI, BuildKit (Docker&apos;s default builder since Engine 23.0 in 2023) can store its
        cache in a registry or the GitHub Actions cache between runs, and mount secrets during a
        build without leaving them in a layer. Other builders work without Docker: Buildah, ko for
        Go, Jib for Java and Cloud Native Buildpacks. Kaniko, once a favourite, was archived by
        Google in June 2025.
      </p>
      <p>
        Docker Hardened Images became free under the Apache 2.0 licence in December 2025, joining
        distroless and Chainguard as minimal bases.
      </p>
    </StepLayout>
  );
}
