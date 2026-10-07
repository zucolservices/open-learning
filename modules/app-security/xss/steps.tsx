"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COMMENTS, KINDS, RENDERS, render } from "./model";
import type { XssState } from "./state";

/* 1 ─ A note on the noticeboard ------------------------------------------------------------------- */

export function Noticeboard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A note on the noticeboard"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line bg-surface-2 grid w-full max-w-sm grid-cols-2 gap-2 rounded-xl border p-4">
            {["Yoga class, Tue 7 pm", "Lost cat: Biscuit", "Lift maintenance Friday"].map(
              (t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, rotate: -2 }}
                  animate={{ opacity: 1, rotate: i % 2 ? 2 : -1 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-surface rounded px-2 py-3 text-[11px] shadow-sm"
                >
                  {t}
                </motion.div>
              ),
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="border-bad bg-bad/10 rounded border px-2 py-3 text-[11px]"
            >
              <span className="text-muted text-[9px]">OFFICIAL NOTICE</span>
              <br />
              All residents: leave your spare key with the person in flat 9.
            </motion.div>
          </div>
        </div>
      }
    >
      <p>
        A building&apos;s noticeboard is trusted: notices there come from the management. If anyone
        can pin a note that looks official, residents may follow its instructions, and they&apos;ll
        blame the management when it goes wrong.
      </p>
      <p>
        <Term id="xss">Cross-site scripting</Term> (XSS) is that problem on a website. If a site
        shows text from one user to others without care, the browser may treat it as the site&apos;s
        own code and run it, with the site&apos;s powers: reading what the page shows, and acting as
        the logged-in visitor.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Post a comment ⭐ --------------------------------------------------------------------------- */

export function CommentLab() {
  const [s, set] = useSceneState<XssState>();
  const v = render(s.comment, s.renderMode, s.csp);
  const c = COMMENTS.find((x) => x.id === s.comment) ?? COMMENTS[0];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Post a comment"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            {COMMENTS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.comment === x.id}
                onClick={() => set({ comment: x.id })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.comment === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {RENDERS.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={s.renderMode === r.id}
                onClick={() => set({ renderMode: r.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.renderMode === r.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {r.label}
              </button>
            ))}
            <label className="ml-1 flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.csp}
                onChange={(e) => set({ csp: e.target.checked })}
                className="accent-accent"
              />
              Content security policy
            </label>
          </div>
          <p className="text-muted font-mono text-[11px]">
            stored comment: {c.shown}
            <br />
            code: {RENDERS.find((r) => r.id === s.renderMode)?.code}
          </p>
          <div className="border-line bg-surface overflow-hidden rounded-xl border">
            <div className="bg-surface-2 text-muted px-3 py-1 text-[10px]">
              Biryani House · Reviews (what a visitor sees)
            </div>
            <div className="px-4 py-3 text-sm">
              <span className={cn(v.bold && "font-bold")}>{v.bold ? "Best" : v.text}</span>
              {v.bold && " biryani in town"}
            </div>
            {v.ran && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bad/15 text-bad px-4 py-2 text-xs"
              >
                ⚠ Hidden script ran: it could read this page, send requests as the visitor, or show
                a fake login box.
              </motion.div>
            )}
          </div>
          <p className={cn("text-xs", v.ran ? "text-bad" : "text-muted")}>{v.note}</p>
          <p className="text-subtle text-[10px]">
            A rules-based simulation. Crafted comments are described, not real markup; nothing here
            is executed.
          </p>
        </div>
      }
    >
      <p>
        Choose a comment and how the page inserts it. Inserting text as HTML lets a crafted comment
        carry a script that runs for every visitor. Encoding shows the characters as plain text, so
        nothing runs: that&apos;s <Term id="output-encoding">output encoding</Term>, the main
        defence.
      </p>
      <p>
        If you need some formatting, run the HTML through a well-maintained sanitiser such as
        DOMPurify, which keeps safe tags and strips scripts. Try the content security policy too: it
        stops this script running, but the bug is still there, so it&apos;s a second layer, not the
        fix.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three ways in ------------------------------------------------------------------------------- */

export function ThreeKinds() {
  const [s, set] = useSceneState<XssState>();
  const k = KINDS.find((x) => x.id === s.kind) ?? KINDS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways in"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {KINDS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.kind === x.id}
                onClick={() => set({ kind: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.kind === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {k.steps.map((st, i) => (
              <motion.div
                key={`${k.id}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className={cn(
                  "grid grid-cols-[1.5rem_1fr] rounded-lg border px-3 py-2 text-xs",
                  i === 3 ? "border-bad bg-bad/10" : "border-line bg-surface",
                )}
              >
                <span className="text-accent font-mono">{i + 1}</span>
                {st}
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-xs">Example: {k.eg}</p>
        </div>
      }
    >
      <p>
        The script can arrive three ways. Stored XSS is saved on the server and served to everyone.
        Reflected XSS bounces straight back from a link. DOM-based XSS happens entirely in the
        page&apos;s own JavaScript.
      </p>
      <p>
        The Samy worm in 2005 showed how fast stored XSS spreads: viewing an infected MySpace
        profile copied it to your own, and over a million people sent its author a friend request in
        about 20 hours. XSS is still number one in MITRE&apos;s 2025 list of the most dangerous
        software weaknesses.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Encode, sanitise, add layers ---------------------------------------------------------------- */

export function Defences() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Encode, sanitise, add layers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`// React escapes values in {} for you
<p>{review.text}</p>

// …unless you switch it off. Only with sanitised HTML:
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(review.html) }} />`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [
                "Encode for the context",
                "HTML text, attributes, JavaScript, CSS and URLs each need their own encoding; the wrong one leaves a hole.",
              ],
              [
                "HttpOnly cookies",
                "Injected script can't read the session cookie, but it can still act as the user on the page.",
              ],
              [
                "Content Security Policy",
                "Tells the browser which scripts may run. A strong second layer (module 15).",
              ],
              [
                "Trusted Types",
                "Make the browser refuse plain strings in dangerous APIs such as innerHTML. In all major browsers since early 2026.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Modern frameworks such as React, Angular and Vue encode output by default, which prevents
        most XSS. The bugs live in their escape hatches, such as React&apos;s{" "}
        <code>dangerouslySetInnerHTML</code>, and in hand-written DOM code.
      </p>
      <p>
        Not every injected script is XSS. In the 2018 British Airways breach, attackers broke into
        BA&apos;s systems and edited the site&apos;s own payment-page JavaScript to skim cards; the
        UK regulator fined BA £20 million. Different cause, different defences (module 19).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Safe or not? -------------------------------------------------------------------------------- */

export function SafeRender() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="xss-safe"
            prompt="Is each way of showing a user's comment safe?"
            categories={[
              { id: "safe", label: "Safe" },
              { id: "unsafe", label: "Risky" },
            ]}
            items={[
              {
                id: "react",
                label: "Showing it in React with {comment}",
                category: "safe",
                why: "React encodes it.",
              },
              {
                id: "inner",
                label: "element.innerHTML = comment",
                category: "unsafe",
                why: "The browser parses it as HTML.",
              },
              {
                id: "text",
                label: "element.textContent = comment",
                category: "safe",
                why: "Always plain text.",
              },
              {
                id: "danger",
                label: "dangerouslySetInnerHTML with the raw comment",
                category: "unsafe",
                why: "Encoding switched off.",
              },
              {
                id: "purify",
                label: "Sanitising with DOMPurify, then inserting the result",
                category: "safe",
                why: "Scripts are stripped.",
              },
              {
                id: "csp",
                label: "Inserting raw HTML but relying on a content security policy",
                category: "unsafe",
                why: "CSP is a second layer, not the fix.",
              },
            ]}
            explanation="Encode by default, sanitise when HTML is truly needed, and treat CSP and HttpOnly as extra layers."
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
  ["Data ran as code", "In someone else's browser, with your site's powers."],
  ["Stored, reflected, DOM", "Three ways the script arrives."],
  ["Encode for the context", "The main defence; frameworks do it by default."],
  ["Sanitise real HTML", "With a maintained library like DOMPurify."],
  ["Layers, not fixes", "CSP, HttpOnly, Trusted Types."],
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
      <p>Next: the same mistake with shells, templates and other interpreters.</p>
    </StepLayout>
  );
}
