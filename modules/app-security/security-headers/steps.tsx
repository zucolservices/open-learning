"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ATTACKS, HEADERS, type Header } from "./model";
import type { HdrState } from "./state";

/* 1 ─ Labels on a parcel -------------------------------------------------------------------------- */

export function ParcelLabels() {
  const labels = [
    "🔼 This way up",
    "🍷 Fragile",
    "🚫 Do not open in transit",
    "📍 Deliver only to this address",
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Labels on a parcel"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line bg-surface-2 grid w-full max-w-xs grid-cols-2 gap-2 rounded-xl border-2 border-dashed p-4">
            {labels.map((l, i) => (
              <motion.span
                key={l}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 * i }}
                className="bg-surface rounded px-2 py-2 text-center text-[11px]"
              >
                {l}
              </motion.span>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A parcel can carry instructions for whoever handles it: this way up, fragile, don&apos;t
        open. The courier follows them without knowing what&apos;s inside. They don&apos;t make a
        badly packed parcel safe, but they prevent a lot of damage.
      </p>
      <p>
        <Term id="security-headers">Security headers</Term> are those labels for web pages. The
        server attaches them to each response, and the browser switches on extra protections: which
        scripts may run, HTTPS only, no framing. They are a second layer behind fixing the bug
        itself.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Switch on the headers ⭐ -------------------------------------------------------------------- */

export function HeaderLab() {
  const [s, set] = useSceneState<HdrState>();
  const on = s.on ?? [];
  const toggle = (h: Header) =>
    set({ on: on.includes(h) ? on.filter((x) => x !== h) : [...on, h] });
  const blocked = (h: Header) => on.includes(h) && !(h === "csp" && s.reportOnly);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Switch on the headers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="bg-surface-2 flex flex-col gap-1 rounded-lg p-2 font-mono text-[10px]">
            <span className="text-muted">HTTP/1.1 200 OK</span>
            {HEADERS.map((h) => (
              <label
                key={h.id}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded px-1 py-0.5",
                  on.includes(h.id) ? "text-fg" : "text-subtle line-through",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.includes(h.id)}
                  onChange={() => toggle(h.id)}
                  className="accent-accent mt-0.5"
                  aria-label={h.line.split(":")[0] + (h.id === "frame" ? " frame-ancestors" : "")}
                />
                <span className="break-all">
                  {h.id === "csp" && s.reportOnly
                    ? h.line.replace(
                        "Content-Security-Policy:",
                        "Content-Security-Policy-Report-Only:",
                      )
                    : h.line}
                </span>
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.reportOnly}
              onChange={(e) => set({ reportOnly: e.target.checked })}
              className="accent-accent"
            />
            Run the script policy in report-only mode
          </label>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {ATTACKS.map((a) => {
              const ok = blocked(a.stoppedBy);
              const reported = a.stoppedBy === "csp" && on.includes("csp") && s.reportOnly;
              return (
                <div
                  key={a.id}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[11px]",
                    ok
                      ? "border-good bg-good/10"
                      : reported
                        ? "border-viz-compute bg-viz-compute/10"
                        : "border-bad bg-bad/10",
                  )}
                >
                  <p className="font-semibold">
                    {ok ? "⛔ " : reported ? "📝 " : "⚠ "}
                    {a.name}
                  </p>
                  <p className="text-muted">
                    {ok
                      ? a.detail
                      : reported
                        ? "Reported to you, but not blocked."
                        : "Nothing stops it."}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        Tick headers and watch the browser-side attacks fail one by one. Each header blunts a
        different trick; none of them fixes the underlying bug.
      </p>
      <p>
        Try report-only mode for the script policy: the browser reports what it would have blocked
        without breaking anything. That&apos;s how teams roll out a{" "}
        <Term id="csp">content security policy</Term> safely, before switching to enforcing.
      </p>
    </StepLayout>
  );
}

/* 3 ─ A policy that actually works ---------------------------------------------------------------- */

export function StrictCsp() {
  const [s, set] = useSceneState<HdrState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="A policy that actually works"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {(["allow", "strict"] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={s.cspStyle === c}
                onClick={() => set({ cspStyle: c })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.cspStyle === c ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {c === "allow" ? "Allow-list of domains" : "Strict: nonces"}
              </button>
            ))}
          </div>
          <motion.div
            key={s.cspStyle}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="bg-surface-2 rounded px-3 py-2 font-mono text-[10px] break-all">
              {s.cspStyle === "allow"
                ? "script-src 'self' cdn.example analytics.example widgets.example"
                : "script-src 'nonce-{random per response}' 'strict-dynamic'; object-src 'none'; base-uri 'none'"}
            </p>
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                s.cspStyle === "allow" ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              {s.cspStyle === "allow"
                ? "Looks tidy, but big shared domains host scripts attackers can reuse. A 2016 Google study of 26,011 unique policies found about 95% could be bypassed."
                : "Each page response gets a fresh random nonce; only script tags carrying it run, and scripts they load are trusted in turn. Injected markup has no nonce."}
            </div>
          </motion.div>
          <p className="bg-surface-2 rounded px-3 py-2 font-mono text-[10px]">
            &lt;script nonce=&quot;r4nd0m&quot; src=&quot;/app.js&quot;&gt;&lt;/script&gt;
          </p>
        </div>
      }
    >
      <p>
        Early CSPs listed trusted domains. Google&apos;s research showed that rarely works, so its
        guidance (on web.dev) is a strict policy: a random nonce or a hash per script, plus{" "}
        <code>&apos;strict-dynamic&apos;</code>.
      </p>
      <p>
        CSP Level 2 has been a W3C Recommendation since 2016; Level 3 is still a working draft in
        2026, though browsers support its key features. Most frameworks can add nonces for you.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Old headers, new headers, grades ------------------------------------------------------------ */

export function OtherHeaders() {
  const items: [string, string, string][] = [
    [
      "X-XSS-Protection",
      "Don't send it, or send 0",
      "The old browser XSS filters are gone and could themselves cause bugs.",
    ],
    [
      "X-Frame-Options",
      "Keep DENY as a fallback",
      "frame-ancestors in CSP replaces it and wins when both are present.",
    ],
    [
      "HSTS preload list",
      "Optional",
      "Browsers can hard-code HTTPS for your domain, but its maintainers no longer generally recommend preloading.",
    ],
    [
      "COOP, COEP, CORP",
      "Isolation",
      "Keep other sites' windows and resources away from your page, against Spectre-style leaks.",
    ],
    [
      "Header scanners",
      "A hint, not a verdict",
      "MDN HTTP Observatory and securityheaders.com give letter grades; an A+ doesn't mean a site is secure.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Old headers, new headers, grades"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([h, v, d], i) => (
            <motion.div
              key={h}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[8.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-mono text-[11px]">{h}</span>
              <span>
                <span className="font-semibold">{v}.</span> <span className="text-muted">{d}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Header advice changes as browsers change. Some once-recommended headers are now pointless or
        harmful, so check a current source such as the OWASP Secure Headers Project rather than
        copying an old snippet.
      </p>
      <p>
        <Term id="hsts">HSTS</Term> has a catch: it only works after the browser has seen it once,
        which is the gap preloading was designed to close.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which header does that? --------------------------------------------------------------------- */

export function WhichHeader() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which header does that?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-header"
            prompt="What does each header setting protect against?"
            categories={[
              { id: "scripts", label: "Unwanted scripts" },
              { id: "https", label: "Downgrade to HTTP" },
              { id: "frame", label: "Framing (clickjacking)" },
            ]}
            items={[
              {
                id: "nonce",
                label: "script-src 'nonce-…'",
                category: "scripts",
                why: "Only scripts with the nonce run.",
              },
              {
                id: "maxage",
                label: "Strict-Transport-Security: max-age=31536000",
                category: "https",
                why: "HTTPS only for a year.",
              },
              {
                id: "fa",
                label: "frame-ancestors 'none'",
                category: "frame",
                why: "No site may frame the page.",
              },
              {
                id: "xfo",
                label: "X-Frame-Options: DENY",
                category: "frame",
                why: "The older fallback.",
              },
              {
                id: "sub",
                label: "includeSubDomains",
                category: "https",
                why: "HSTS for every subdomain too.",
              },
              {
                id: "dyn",
                label: "'strict-dynamic'",
                category: "scripts",
                why: "Trust spreads only from nonce-carrying scripts.",
              },
            ]}
            explanation="CSP's script-src controls scripts, HSTS keeps connections on HTTPS, and frame-ancestors (or X-Frame-Options) stops framing."
          />
        </div>
      }
    >
      <p>Sort the settings.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Labels for the browser", "A second layer, not the fix."],
  ["Strict CSP", "Nonces or hashes, 'strict-dynamic'."],
  ["Roll out in report-only", "Then enforce."],
  ["HSTS and frame-ancestors", "HTTPS only; no framing."],
  ["Check current advice", "Drop X-XSS-Protection; grades aren't verdicts."],
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
      <p>Next: tricking the server into making requests for you, server-side request forgery.</p>
    </StepLayout>
  );
}
