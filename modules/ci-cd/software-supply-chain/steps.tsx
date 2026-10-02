"use client";

import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ATTACKS, SLSA, STAGES } from "./model";
import type { ChainState } from "./state";

/* 1 ─ Four attacks, four links ⭐ ----------------------------------------------------------------- */

export function FourLinks() {
  const [s, set] = useSceneState<ChainState>();
  const a = ATTACKS.find((x) => x.id === s.attack) ?? ATTACKS[0];
  const picked = s.picks?.[a.id];
  const opt = a.options.find((o) => o.id === picked);
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Four attacks, four links"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1">
            {STAGES.map((st, i) => (
              <span key={st.id} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="text-muted size-3" />}
                <span
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-[11px]",
                    st.id === a.stage
                      ? "border-bad bg-bad/15 text-bad font-semibold"
                      : "border-line bg-surface",
                  )}
                >
                  {st.name}
                </span>
              </span>
            ))}
            <ChevronRight className="text-muted size-3" />
            <span className="border-line bg-surface rounded-lg border px-2.5 py-1 text-[11px]">
              You
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ATTACKS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ attack: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  a.id === x.id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  s.picks?.[x.id] &&
                    x.options.find((o) => o.id === s.picks[x.id])?.ok &&
                    "text-good",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <p className="text-accent font-mono text-xs">{a.when}</p>
            <p className="text-muted mt-1 text-sm">{a.story}</p>
          </motion.div>
          <p className="text-muted text-[10px]">Which defence would have stopped it?</p>
          <div className="flex flex-col gap-1.5">
            {a.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => set({ picks: { ...(s.picks ?? {}), [a.id]: o.id } })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  picked === o.id
                    ? o.ok
                      ? "border-good bg-good/10"
                      : "border-bad/60 bg-bad/10"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          {opt && <p className={cn("text-xs", opt.ok ? "text-good" : "text-bad")}>{opt.why}</p>}
        </div>
      }
    >
      <p>
        Most of what you ship was written by someone else, and passes through tools you didn&apos;t
        build. Your <Term id="supply-chain">software supply chain</Term> is every link between a
        developer&apos;s keyboard and your users: source, dependencies, the build system and the way
        artifacts are distributed.
      </p>
      <p>
        Each of these real attacks struck a different link. Pick one, read what happened, and choose
        the defence that would have stopped it. No single defence stops all four.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Know what's inside -------------------------------------------------------------------------- */

export function WhatsInside() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Know what's inside"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`{
  "bomFormat": "CycloneDX",
  "components": [
    { "name": "express",  "version": "5.1.0",  "purl": "pkg:npm/express@5.1.0" },
    { "name": "xz-utils", "version": "5.4.6",  "purl": "pkg:deb/debian/xz-utils@5.4.6" },
    { "name": "openssl",  "version": "3.5.1",  "purl": "pkg:deb/debian/openssl@3.5.1" },
    …412 more
  ]
}`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-sm font-semibold">Formats</p>
              <p className="text-muted text-xs">
                SPDX (an ISO standard, ISO/IEC 5962:2021) and CycloneDX (an Ecma standard,
                ECMA-424). Syft, Trivy and cdxgen generate them in a pipeline step.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-sm font-semibold">Then scan it</p>
              <p className="text-muted text-xs">
                Match components against vulnerability data such as OSV and CISA&apos;s list of
                known exploited vulnerabilities; Dependabot and Renovate open upgrade pull requests.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A packet of food lists its ingredients so you can check for the one you&apos;re allergic to.
        A <Term id="sbom">software bill of materials</Term> does the same for an artifact: every
        component and its exact version. When the next xz turns up, you can answer &ldquo;do we use
        it, and where?&rdquo; in minutes rather than weeks.
      </p>
      <p>
        Governments now ask for them. A US executive order in May 2021 started it; the EU&apos;s
        Cyber Resilience Act has required vulnerability reporting since September 2026, with full
        obligations from December 2027; India&apos;s CERT-In published SBOM guidelines in October
        2024.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Prove where it came from -------------------------------------------------------------------- */

export function ProveIt() {
  const [s, set] = useSceneState<ChainState>();
  const lvl = SLSA[s.slsa] ?? SLSA[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Prove where it came from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px]">SLSA build levels (version 1.2)</p>
          <div className="grid grid-cols-4 gap-1.5">
            {SLSA.map((l, i) => (
              <button
                key={l.level}
                type="button"
                onClick={() => set({ slsa: i })}
                className={cn(
                  "rounded-lg border px-2 py-2 text-center",
                  i === s.slsa
                    ? "border-accent bg-accent-soft"
                    : i < s.slsa
                      ? "border-good/50 bg-good/10"
                      : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <p className="font-mono text-sm font-semibold">{l.level}</p>
                <p className="text-muted text-[9px] leading-tight">{l.name}</p>
              </button>
            ))}
          </div>
          <motion.div
            key={s.slsa}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <p className="font-semibold">
              Build {lvl.level}: {lvl.name}
            </p>
            <p className="text-muted mt-1 text-sm">{lvl.what}</p>
            <p className="mt-1 text-sm">
              <span className="text-muted">Protects against: </span>
              {lvl.stops}
            </p>
          </motion.div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Signing went mainstream</p>
            <p className="text-muted mt-1">
              Sigstore (keyless signing with an identity, not a stored key) reached general
              availability in October 2022; npm package provenance in 2023; GitHub artifact
              attestations in June 2024; npm trusted publishing, with no long-lived tokens, in July
              2025.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A signature proves who published something. <Term id="provenance">Provenance</Term> goes
        further: a signed record of which source, which build platform and which steps produced it,
        so you can refuse anything that didn&apos;t come from your pipeline.
      </p>
      <p>
        <Term id="slsa">SLSA</Term> (Supply-chain Levels for Software Artifacts, said
        &ldquo;salsa&rdquo;) grades build integrity. Remember SolarWinds: its update was genuinely
        signed. Only a hardened build (level 3), or rebuilding independently and comparing, would
        have exposed it. Version 1.2 (November 2025) added a source track, up to required code
        review, aimed at cases like xz.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which link does it guard? ------------------------------------------------------------------- */

export function WhichLink() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which link does it guard?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-link"
            prompt="Which link of the chain does each defence mainly protect?"
            categories={[
              { id: "source", label: "Source" },
              { id: "deps", label: "Dependencies" },
              { id: "build", label: "Build" },
              { id: "dist", label: "Distribution" },
            ]}
            items={[
              {
                id: "review",
                label: "Two-person review on every change to main",
                category: "source",
                why: "No single account can slip code into the source unseen.",
              },
              {
                id: "scope",
                label:
                  "Internal packages under a private scope, fetched only from your own registry",
                category: "deps",
                why: "Stops dependency confusion, where a public package impersonates an internal one.",
              },
              {
                id: "ephemeral",
                label: "Single-use, isolated build machines that sign provenance",
                category: "build",
                why: "Nothing persists between builds for an attacker to hide in: SLSA Build L3.",
              },
              {
                id: "verify",
                label: "Deploy only images whose signature and provenance check out",
                category: "dist",
                why: "Anything altered after the build, or built elsewhere, is refused.",
              },
            ]}
            explanation="Layers, not a single lock: review guards the source, registries and lockfiles guard dependencies, hardened builders guard the build, and verification guards what reaches production."
          />
        </div>
      }
    >
      <p>Each defence guards one link; you need all four.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Every link is a target", "Source, dependencies, build and distribution."],
  ["Pin and wait", "Lockfiles, a cooldown for new versions, no install scripts."],
  ["Harden the build", "Isolated, single-use builders that sign provenance."],
  ["List what's inside", "An SBOM per artifact, scanned continuously."],
  ["Verify before you run", "Signatures and provenance checked at deploy time."],
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
        One more classic: in February 2021 researcher Alex Birsan showed that package managers could
        be tricked into fetching a public package with the same name as a company&apos;s internal
        one. He got code running inside more than 35 organisations, including Apple and Microsoft.
        Scoped names and a single private registry close that door.
      </p>
      <p>Last chapter: measuring how well all this works, choosing a platform, and the capstone.</p>
    </StepLayout>
  );
}
