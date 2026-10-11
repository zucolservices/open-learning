"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS } from "./model";
import type { DepState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Moving() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Food trucks, restaurants and caterers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Your own restaurant", "Full control, but you fix the plumbing. (A virtual machine.)"],
            [
              "A food court stall",
              "Standard kitchens; you bring the recipes in a box. (Containers.)",
            ],
            ["A caterer per event", "Pay only when there's a party. (Serverless functions.)"],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        A café company can run its own restaurant, rent a stall in a food court, or book caterers
        for events. Each suits different work.
      </p>
      <p>
        Backends are the same. Code is packaged, usually as a{" "}
        <Term id="container-image">container image</Term>, and run on virtual machines, a container
        platform, or <Term id="serverless">serverless</Term> functions. How you roll out new
        versions matters as much as where.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Decide ⭐ ------------------------------------------------------------------------------------ */

export function Decide() {
  const [s, set] = useSceneState<DepState>();
  const done = DECISIONS.every((d) => d.options.find((o) => o.id === s.picks[d.id])?.ok);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Five deployment decisions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DECISIONS.map((d) => {
            const pick = d.options.find((o) => o.id === s.picks[d.id]);
            return (
              <div
                key={d.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <p className="font-semibold">{d.title}</p>
                <p className="text-muted text-[11px]">{d.context}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={pick?.id === o.id}
                      onClick={() => set({ picks: { ...s.picks, [d.id]: o.id } })}
                      className={cn(
                        "rounded-md border px-2 py-0.5 text-left text-[10.5px]",
                        pick?.id === o.id
                          ? o.ok
                            ? "border-good bg-good/15"
                            : "border-bad bg-bad/10"
                          : "border-line hover:border-line-strong",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-0.5 text-[10.5px]", pick.ok ? "text-good" : "text-muted")}>
                    {pick.outcome}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <p className="text-good text-xs">
              Each workload where it fits, risky changes rolled out gradually, and a small, hardened
              image.
            </p>
          )}
        </div>
      }
    >
      <p>
        The café company has three workloads to run, a risky change to roll out, and a bloated
        image. Make each decision and read what happens.
      </p>
      <p>There&apos;s rarely one perfect answer; these options show the usual trade-offs.</p>
    </StepLayout>
  );
}

/* 3 ─ Images --------------------------------------------------------------------------------------- */

export function Images() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Building good images"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {
              'FROM node:24 AS build\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\n\nFROM gcr.io/distroless/nodejs24-debian13:nonroot\nCOPY --from=build /app/dist /app\nCMD ["/app/server.js"]      # exec form: receives SIGTERM'
            }
          </pre>
          <div className="grid gap-1 text-xs">
            {[
              [
                "Minimal base images",
                "Distroless (now on Debian 13), Ubuntu chiseled, or Docker Hardened Images (free and open source since December 2025).",
              ],
              ["Pin and sign", "Refer to images by digest; sign and scan them in the pipeline."],
              [
                "Mind registry limits",
                "Docker Hub allows 100 anonymous pulls per 6 hours per IP address; sign in or use a mirror in CI.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A multi-stage build compiles in a full image and copies only the result into a tiny runtime
        image. Smaller images pull faster and give attackers less to work with.
      </p>
      <p>Container images follow the open OCI standard, so they run on any compatible platform.</p>
    </StepLayout>
  );
}

/* 4 ─ Platforms ------------------------------------------------------------------------------------ */

export function Platforms() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Limits and rollouts by platform"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "AWS Lambda",
              "Up to 15 minutes and 10 GB of memory; async payloads up to 1 MB since October 2025.",
            ],
            ["Google Cloud Run", "Requests up to 60 minutes; traffic splitting between revisions."],
            [
              "Azure Functions",
              "Flex Consumption (generally available November 2024) is now the recommended serverless plan.",
            ],
            [
              "Kubernetes",
              "Rolling updates replace pods 25% at a time by default; only safe with a readiness probe.",
            ],
            [
              "Canaries",
              "Argo Rollouts, Flagger, a service mesh, or weighted aliases on serverless platforms.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
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
        A <Term id="canary-release">canary release</Term> sends a small share of traffic to the new
        version first and watches error rates and latency before going further. Automate the
        rollback so a bad canary reverses itself.
      </p>
      <p>The Kubernetes and CI/CD tracks cover these platforms and pipelines in depth.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DepCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A canary rollout, in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="backend-deploying"
            prompt="Put the steps of a canary rollout in order."
            items={[
              { id: "build", label: "Build, scan and sign the image" },
              { id: "five", label: "Send 5% of traffic to the new version" },
              { id: "watch", label: "Compare its errors and latency with the old version" },
              { id: "widen", label: "Widen to 50%, then 100%, if healthy" },
              {
                id: "done",
                label: "Remove the old version (or roll back automatically if unhealthy)",
              },
            ]}
            explanation="Build once, expose a little, measure, then widen, with an automatic way back at every stage."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Match the platform to the work", "Steady, spiky or long-running."],
        ["Know the limits", "Lambda stops at 15 minutes."],
        ["Small, hardened images", "Multi-stage, minimal, non-root."],
        ["Roll out gradually", "Canaries for risky changes."],
        ["Automatic rollback", "Measure and reverse."],
      ]}
    >
      <p>That ends the production chapter. Next: the capstone, an order service end to end.</p>
    </WrapStep>
  );
}
