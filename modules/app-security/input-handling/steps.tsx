"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHECKS, DATES, UPLOADS, blocked, type Check } from "./model";
import type { InputState } from "./state";

/* 1 ─ The parcel counter -------------------------------------------------------------------------- */

export function ParcelCounter() {
  const rules = [
    "⚖️ Weigh it",
    "📏 Measure it",
    "🔍 X-ray it, whatever the label says",
    "🚫 Only accepted item types",
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="The parcel counter"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          {rules.map((r, i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
            >
              {r}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A courier&apos;s counter doesn&apos;t take a parcel just because the label says “books”. It
        weighs it, measures it, x-rays it, and only accepts item types on its list. Anything else is
        refused at the counter, before it enters the system.
      </p>
      <p>
        Software needs the same counter at every <Term id="trust-boundary">trust boundary</Term>:
        form fields, headers, uploaded files, messages from other services.{" "}
        <Term id="input-validation">Input validation</Term> decides what you accept and rejects the
        rest, on the server, where users can&apos;t skip it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Guard an upload service ⭐ ------------------------------------------------------------------ */

export function Uploads() {
  const [s, set] = useSceneState<InputState>();
  const on = s.on ?? [];
  const toggle = (c: Check) => set({ on: on.includes(c) ? on.filter((x) => x !== c) : [...on, c] });
  const through = UPLOADS.filter((u) => u.harmful && !blocked(u, on)).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Guard an upload service"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {CHECKS.map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  on.includes(c.id) ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.includes(c.id)}
                  onChange={() => toggle(c.id)}
                  className="accent-accent mt-0.5"
                  aria-label={c.name}
                />
                <span>
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-muted block">{c.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {UPLOADS.map((u) => {
              const b = blocked(u, on);
              return (
                <div
                  key={u.id}
                  className={cn(
                    "grid grid-cols-[1.5rem_1fr] gap-1 rounded-md border px-2 py-1 text-[11px]",
                    !u.harmful
                      ? "border-line bg-surface"
                      : b
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10",
                  )}
                >
                  <span className="font-mono">{!u.harmful ? "✓" : b ? "⛔" : "⚠"}</span>
                  <span>
                    <span className="font-semibold">{u.name}</span>{" "}
                    <span className="text-muted">({u.truth})</span>
                    {u.harmful && !b && <span className="text-bad block">{u.harm}</span>}
                  </span>
                </div>
              );
            })}
          </div>
          <p className={cn("text-sm font-semibold", through ? "text-bad" : "text-good")}>
            {through
              ? `${through} harmful upload${through > 1 ? "s get" : " gets"} through.`
              : "Every harmful upload is stopped; the real photo and PDF still work."}
          </p>
          <p className="text-subtle text-[10px]">
            A rules-based simulation; files are described, not real.
          </p>
        </div>
      }
    >
      <p>
        Seven files arrive. Two are genuine. Switch on checks until only those two get through.
        Notice that no single check catches everything: each one closes a different hole, which is
        why OWASP&apos;s file upload guidance lists them all.
      </p>
      <p>
        Two habits stand out. Never trust the type the browser claims: it&apos;s just a label the
        sender wrote. And never use the uploaded name as a path: generate your own, so a crafted
        name can&apos;t climb into other folders.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Shape, then meaning ------------------------------------------------------------------------- */

export function ShapeAndMeaning() {
  const [s, set] = useSceneState<InputState>();
  const d = DATES.find((x) => x.id === s.date) ?? DATES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Shape, then meaning"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">A hotel booking request</p>
          {DATES.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={s.date === x.id}
              onClick={() => set({ date: x.id })}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-xs",
                s.date === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              {x.label}
            </button>
          ))}
          <motion.p
            key={d.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              d.id === "good" ? "border-good bg-good/10" : "border-bad bg-bad/10",
            )}
          >
            {d.caught}
          </motion.p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-good bg-good/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Allow-list</p>
              <p className="text-muted">
                Describe what good looks like: digits only, 6 characters, a known country code.
              </p>
            </div>
            <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Deny-list</p>
              <p className="text-muted">Try to list every bad thing. You will always miss one.</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Check two things. Shape (syntax): is it a real date, a number in range, the right length?
        Meaning (semantics): does it make sense here, such as a check-out after the check-in?
        Describe what good looks like, an <Term id="allow-list">allow-list</Term>, rather than
        trying to list everything bad.
      </p>
      <p>
        Validation narrows what reaches your code, but it doesn&apos;t replace the real defences:
        you still need parameterised queries, output encoding and permission checks. A perfectly
        valid account number doesn&apos;t mean the caller may see that account.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Parsers that bite --------------------------------------------------------------------------- */

export function DangerousParsers() {
  const items: [string, string, string][] = [
    [
      "Deserialisation",
      "Turning bytes back into live program objects can run code chosen by whoever wrote the bytes. Python's docs: “The pickle module is not secure. Only unpickle data you trust.”",
      "Use plain data formats such as JSON for anything untrusted.",
    ],
    [
      "XML entities",
      "Some XML parsers follow references inside a document: to read local files (XXE) or to expand a tiny file into gigabytes (“billion laughs”).",
      "Turn off DTD processing in the parser.",
    ],
    [
      "Slow regular expressions",
      "A badly written pattern can take exponential time on some inputs. One rule took Cloudflare down worldwide for 27 minutes in July 2019; a post with about 20,000 spaces took Stack Overflow down for 34 minutes in 2016.",
      "Cap input length; use a non-backtracking regex engine or a timeout.",
    ],
    [
      "Huge or deeply nested input",
      "A parser can run out of memory before your checks ever see the data.",
      "Limit size and nesting depth before parsing.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Parsers that bite"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([t, d, f], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
              <p className="text-good mt-0.5">Fix: {f}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Sometimes the danger is in the parsing itself, before validation runs. In 2015 researchers
        showed that crafted serialised data could run code through a popular Java library, and
        Foxglove Security then showed it worked against widely used servers such as WebLogic, JBoss
        and Jenkins.
      </p>
      <p>
        OWASP&apos;s 2025 Top 10 files unsafe deserialisation under A08, Software or Data Integrity
        Failures, and risky XML parser settings under A02, Security Misconfiguration.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Strong or weak? ----------------------------------------------------------------------------- */

export function GoodValidation() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Strong or weak?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="validation-strength"
            prompt="Is each a strong or a weak way to handle input?"
            categories={[
              { id: "strong", label: "Strong" },
              { id: "weak", label: "Weak" },
            ]}
            items={[
              {
                id: "allow",
                label: "Accept PIN codes only if they are exactly 6 digits",
                category: "strong",
                why: "An allow-list of the exact shape.",
              },
              {
                id: "js",
                label: "Validate the form in the browser only",
                category: "weak",
                why: "Anyone can skip browser checks.",
              },
              {
                id: "mime",
                label: "Trust the Content-Type header to decide a file is an image",
                category: "weak",
                why: "The sender writes that label.",
              },
              {
                id: "name",
                label: "Store uploads under a random name the server generates",
                category: "strong",
                why: "No path tricks possible.",
              },
              {
                id: "deny",
                label: "Reject inputs that contain a list of known-bad words",
                category: "weak",
                why: "Deny-lists always miss something.",
              },
              {
                id: "json",
                label: "Accept untrusted data as JSON instead of serialised objects",
                category: "strong",
                why: "Plain data can't run code when parsed.",
              },
            ]}
            explanation="Allow-list on the server, distrust labels the sender controls, generate names and paths yourself, and prefer plain data formats."
          />
        </div>
      }
    >
      <p>Sort the approaches.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Validate at every boundary", "On the server, not just in the browser."],
  ["Allow-lists win", "Describe good; reject the rest."],
  ["Shape and meaning", "Syntax, then semantics."],
  ["Uploads need several checks", "Type, size, name, location."],
  ["Some parsers are dangerous", "Deserialisation, XML entities, slow regexes."],
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
        Next: identity, starting with passwords and how to store them so a leak isn&apos;t a
        disaster.
      </p>
    </StepLayout>
  );
}
