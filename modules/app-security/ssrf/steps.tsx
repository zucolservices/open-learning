"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DEFENCES, FIXES, TARGETS, fetchAs, type Fix } from "./model";
import type { SsrfState } from "./state";

/* 1 ─ An errand boy who trusts anyone ------------------------------------------------------------- */

export function Errand() {
  return (
    <StepLayout
      eyebrow="Story"
      title="An errand boy who trusts anyone"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="border-line bg-surface rounded-lg border px-3 py-2">🧑 Visitor</span>
            <span className="text-muted">“fetch me…”</span>
            <span className="border-accent bg-accent-soft rounded-lg border px-3 py-2">
              🏃 Office junior
            </span>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="border-good/60 bg-good/10 rounded-lg border px-3 py-2">
              📰 Public library
            </span>
            <span className="border-bad bg-bad/10 rounded-lg border px-3 py-2">
              🗄️ The boss&apos;s locked filing cabinet
            </span>
          </div>
          <p className="text-muted max-w-xs text-center text-[11px]">
            The junior has keys the visitor doesn&apos;t. Ask nicely, and they&apos;ll fetch from
            either.
          </p>
        </div>
      }
    >
      <p>
        Imagine an office junior who&apos;ll fetch any document you name. From the public library,
        fine. But the junior also has keys to the boss&apos;s filing cabinet, which you don&apos;t.
        Ask for a file from there, and they&apos;ll happily bring it out.
      </p>
      <p>
        <Term id="ssrf">Server-side request forgery</Term> (SSRF) is that junior. When a server
        fetches a URL you give it, it fetches with its own access, from inside the network, so you
        can reach things you never could directly.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A helpful image preview ⭐ ------------------------------------------------------------------ */

export function PreviewLab() {
  const [s, set] = useSceneState<SsrfState>();
  const fixes = s.fixes ?? [];
  const r = fetchAs(s.target, fixes);
  const toggle = (f: Fix) =>
    set({ fixes: fixes.includes(f) ? fixes.filter((x) => x !== f) : [...fixes, f] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A helpful image preview"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            A profile page offers: “paste an image URL and we&apos;ll show a preview.” The server
            fetches whatever you paste.
          </p>
          <div className="flex flex-col gap-1">
            {TARGETS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={s.target === t.id}
                onClick={() => set({ target: t.id })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.target === t.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="font-semibold">{t.label}</span>{" "}
                <span className="text-muted">· {t.what}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FIXES.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={fixes.includes(f.id)}
                onClick={() => toggle(f.id)}
                title={f.detail}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  fixes.includes(f.id) ? "border-good bg-good/10" : "border-line",
                )}
              >
                {fixes.includes(f.id) ? "✓ " : ""}
                {f.name}
              </button>
            ))}
          </div>
          <motion.div
            key={`${s.target}-${fixes.join()}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              r.blocked
                ? "border-good bg-good/10"
                : r.severe
                  ? "border-bad bg-bad/10"
                  : "border-line bg-surface",
            )}
          >
            <p className="font-semibold">
              {r.blocked ? "⛔ Blocked" : r.severe ? "⚠ Leak" : "✓ Preview"}
            </p>
            <p className={r.severe && !r.blocked ? "text-bad" : "text-muted"}>{r.text}</p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            A rules-based simulation; destinations are described in words, with no real addresses or
            payloads.
          </p>
        </div>
      }
    >
      <p>
        Point the preview at each destination. The public image is the intended use. But the same
        feature will fetch an internal dashboard, or the cloud{" "}
        <Term id="metadata-service">metadata service</Term>, because to the server those are just
        more URLs.
      </p>
      <p>
        Now switch on defences. An allow-list of image hosts stops the server going anywhere else.
        Hardening the metadata service (AWS&apos;s IMDSv2, and the equivalents on Google Cloud and
        Azure) makes it refuse a plain fetch.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why the server is a juicy target ------------------------------------------------------------ */

export function WhyMetadata() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why the server is a juicy target"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Capital One, 2019</p>
            <p className="text-muted mt-1">
              Officials said an intruder got in through a misconfigured web application firewall.
              Researchers describe it as SSRF that made a server hand over its own temporary cloud
              credentials. Data on about 106 million people in the US and Canada was taken; the bank
              was fined US$80 million.
            </p>
          </div>
          <div className="grid gap-2 text-xs sm:grid-cols-3">
            {[
              [
                "Inside the network",
                "The server sits where firewalls assume everything is trusted.",
              ],
              [
                "Metadata service",
                "A local address returns details about the server, including short-lived credentials.",
              ],
              [
                "Other services",
                "Internal APIs and admin panels with no login, because “only we can reach them”.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        SSRF is dangerous because of where the server stands. Many internal systems trust any
        request from inside the network, and cloud servers can ask a local metadata service for
        temporary credentials. Turn the server into your errand boy and all of that is in reach.
      </p>
      <p>
        SSRF was its own entry in the OWASP Top 10 in 2021; in the 2025 edition it sits inside
        broken access control, the number one risk. The deeper fix is to stop trusting requests just
        because they come from inside (module 3).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Locking it down ----------------------------------------------------------------------------- */

export function Defences() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Locking it down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DEFENCES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
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
        Allow-lists beat deny-lists here especially, because there are countless ways to write an
        internal address, and tricks like DNS rebinding, where a name passes your check and then
        points inside when the server actually connects.
      </p>
      <p>
        No single control is enough. Combine an allow-list, a hardened metadata service and tight
        network rules, so that even a missed check doesn&apos;t hand over the keys.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Help or not? -------------------------------------------------------------------------------- */

export function SsrfCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Help or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="ssrf-defence"
            prompt="Does each measure help against SSRF?"
            categories={[
              { id: "yes", label: "Helps" },
              { id: "no", label: "Doesn't" },
            ]}
            items={[
              {
                id: "allow",
                label: "Only fetch from an allow-list of approved hosts",
                category: "yes",
                why: "The server can't wander off it.",
              },
              {
                id: "imds",
                label: "Require a token and header on the metadata service",
                category: "yes",
                why: "A plain fetch can't provide them.",
              },
              {
                id: "deny",
                label: "Block a list of known internal addresses",
                category: "no",
                why: "Too many ways to write them; DNS rebinding slips past.",
              },
              {
                id: "redirect",
                label: "Don't follow redirects when fetching",
                category: "yes",
                why: "A safe URL can't bounce inside.",
              },
              {
                id: "valid",
                label: "Check the URL is a valid URL",
                category: "no",
                why: "An internal address is still a valid URL.",
              },
              {
                id: "segment",
                label: "Put the fetcher in its own network segment",
                category: "yes",
                why: "Limits what it can reach.",
              },
            ]}
            explanation="Allow-lists, a hardened metadata service, no redirects and network limits help; blocking by address or just validating the URL format does not."
          />
        </div>
      }
    >
      <p>Sort the measures.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["The server fetches for you", "With its own inside access."],
  ["Metadata is the prize", "Temporary cloud credentials."],
  ["Allow-list destinations", "Deny-lists get slipped past."],
  ["Harden the metadata service", "IMDSv2 and equivalents."],
  ["No redirects, tight network", "Layers, not one check."],
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
      <p>Next: encryption and TLS, protecting data on the way and at rest.</p>
    </StepLayout>
  );
}
