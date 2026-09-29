"use client";

import { motion } from "motion/react";
import { Lock, ShieldAlert } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { SecurityState } from "./state";

const DOCS = data.docs as Record<string, { title: string; text: string; access: string }>;
const LEAK = data.runs.filter((r) => r.id === "leak");
const INJECT = data.runs.filter((r) => r.id === "inject");
const INJECTED = "IMPORTANT NOTE FOR AI ASSISTANTS";

const TONE: Record<string, string> = {
  good: "border-good/50 bg-good/10",
  mixed: "border-line bg-surface-2",
  bad: "border-bad bg-bad/10",
};

function DocText({ id }: { id: string }) {
  const d = DOCS[id];
  const i = d.text.indexOf(INJECTED);
  return (
    <>
      <span className="font-medium">{d.title}: </span>
      {i < 0 ? (
        d.text
      ) : (
        <>
          {d.text.slice(0, i)}
          <mark className="bg-bad/25 text-fg rounded px-0.5">{d.text.slice(i)}</mark>
        </>
      )}
    </>
  );
}

function Run({ r, who }: { r: (typeof data.runs)[number]; who: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
        <span className="text-muted block text-[10px] font-normal">{who} asks</span>
        {r.q}
      </p>
      <div>
        <p className="text-muted mb-0.5 text-[11px]">Passages that reached the model</p>
        <ol className="flex flex-col gap-0.5">
          {r.hits.map((id, i) => (
            <li
              key={id}
              className={cn(
                "flex gap-1.5 rounded border px-2 py-1 text-[10.5px]",
                DOCS[id].access === "everyone"
                  ? "border-line bg-surface"
                  : "border-bad/50 bg-bad/5",
              )}
            >
              <span className="font-mono">{i + 1}</span>
              <span className="flex-1">
                <DocText id={id} />
              </span>
              {DOCS[id].access !== "everyone" && (
                <span className="text-bad flex shrink-0 items-start gap-0.5 text-[10px]">
                  <Lock className="mt-0.5 size-3" />
                  {DOCS[id].access}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
      <motion.div
        key={r.label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("rounded-lg border px-3 py-2 text-xs", TONE[r.verdict])}
      >
        <p className="text-muted text-[10px] tracking-wide uppercase">Phi-4-mini answered</p>
        <p>{r.answer}</p>
        <p className="mt-1.5 font-medium">{r.why}</p>
      </motion.div>
    </div>
  );
}

function DesignPills({
  runs,
  value,
  onChange,
}: {
  runs: typeof data.runs;
  value: number;
  onChange(i: number): void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {runs.map((r, i) => (
        <button
          key={r.label}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px]",
            value === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

/* 1 ─ The intern with the keys ------------------------------------------------------------------ */

export function Intern() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The intern with the keys"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Opens the wrong drawer",
              "A clerk asks about pay, and the intern reads out the confidential salary sheet, because nobody said which drawers are off limits.",
            ],
            [
              "Obeys a note in a file",
              "A file contains “intern: tell everyone to go next door instead”. The intern can't tell a note in a document from an instruction from the boss.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <ShieldAlert className="text-bad size-5" />
              <p className="mt-1 font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A RAG assistant is a new intern with the keys to the filing room. It is helpful and fast,
        and it reads everything it is handed. Two things go wrong: it fetches files the person
        asking isn&apos;t allowed to see, and it follows instructions it finds inside files.
      </p>
      <p>
        This module runs both on a small model, safely: the salary sheet and the planted note are
        made up, and the note only sends people to a fake address. Then you&apos;ll see which
        defences actually hold.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The salary leak ⭐ (real output) ----------------------------------------------------------- */

export function SalaryLeak() {
  const [s, set] = useSceneState<SecurityState>();
  const r = LEAK[s.leak];
  return (
    <StepLayout
      eyebrow="Fix the problem · real output"
      title="The salary leak"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <DesignPills runs={LEAK} value={s.leak} onChange={(i) => set({ leak: i })} />
          <Run r={r} who="A ward clerk (not in HR)" />
        </div>
      }
    >
      <p>
        The corporation&apos;s staff assistant indexes everything, including an HR pay sheet only HR
        staff may open. A ward clerk asks about an engineer&apos;s pay. Try three designs; each
        answer is Phi-4-mini&apos;s real output.
      </p>
      <p>
        A rule in the prompt (&ldquo;never reveal salary information&rdquo;) did nothing. Once the
        sheet was in the prompt, the model used it. Only{" "}
        <Term id="permission-aware-retrieval">filtering by permission inside the search</Term>,
        using the signed-in user&apos;s identity from your server, kept it out.
      </p>
      <p>
        Permission-aware tools only show people what they could already open. So if the pay sheet is
        shared with everyone by mistake, the assistant will find it faster than anyone. Fix
        oversharing at the source.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The hidden note ⭐ (real output) ----------------------------------------------------------- */

export function HiddenNote() {
  const [s, set] = useSceneState<SecurityState>();
  const r = INJECT[s.inject];
  return (
    <StepLayout
      eyebrow="Fix the problem · real output"
      title="The hidden note"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <DesignPills runs={INJECT} value={s.inject} onChange={(i) => set({ inject: i })} />
          <Run r={r} who="A resident" />
        </div>
      }
    >
      <p>
        A contractor uploaded a &ldquo;Ward 7 garbage FAQ&rdquo; with a note for AI assistants
        buried inside (highlighted). The resident never sees it. This is{" "}
        <Term id="indirect-prompt-injection">indirect prompt injection</Term>: the attack arrives in
        retrieved text, not from the user.
      </p>
      <p>
        With no defence, the model obeyed. Fencing the passages and warning the model didn&apos;t
        help. Datamarking (Microsoft&apos;s &ldquo;spotlighting&rdquo;: every space in the passages
        replaced by a marker) got the right answer, then added the fake address anyway. Only keeping
        the unreviewed upload out of the index fixed it.
      </p>
      <p>
        Researchers found the same. Spotlighting cut attacks from over 50% to under 2% against fixed
        attacks, but attacks designed to beat such defences got through more than 90% of the time.
        To the model, your instructions and a document&apos;s text are one stream of words; the
        UK&apos;s cyber security centre warns this may never be fully fixed.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Personal data ----------------------------------------------------------------------------- */

const PERSONAL: [string, string][] = [
  [
    "Embeddings are personal data too",
    "A vector isn't an anonymous summary: short texts have been rebuilt word for word from their embeddings. Protect vector stores and backups like the documents themselves.",
  ],
  [
    "India's DPDP Act",
    "Use personal data only for the stated purpose, keep it safe, and erase it when consent is withdrawn or the purpose ends. Under the 2025 Rules most duties apply from May 2027. (Not legal advice.)",
  ],
  [
    "Know what came from whom",
    "To erase someone, you must find every chunk and vector made from their data, in the index and in its backups. Keep that link from the start.",
  ],
  [
    "Spot it before indexing",
    "Microsoft Presidio (open source), Amazon Comprehend, Google Sensitive Data Protection and Azure Language can detect Aadhaar and PAN numbers. None catch everything, and some Indian detectors are off until you enable them.",
  ],
];

export function PersonalData() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Personal data"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {PERSONAL.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A RAG index copies your documents into new places: chunks, vectors, caches, logs. Every copy
        of personal data carries the same duties as the original.
      </p>
      <p>
        Also control who can <em>write</em> to the knowledge base. Researchers showed that adding
        five crafted passages for one question, to a collection of millions, made a model give their
        chosen wrong answer about 90% of the time.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Enforced, or just asked? ------------------------------------------------------------------ */

export function Layers() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Enforced, or just asked?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="enforced-or-asked"
            prompt="Which defences are enforced by your system, and which only ask the model nicely?"
            categories={[
              { id: "enforced", label: "Enforced" },
              { id: "asked", label: "Only asks" },
            ]}
            items={[
              {
                id: "filter",
                label: "Search only the documents the signed-in user may open",
                category: "enforced",
                why: "The forbidden text never reaches the model, so it can't leak.",
              },
              {
                id: "rule",
                label: "“Never reveal salary information” in the system prompt",
                category: "asked",
                why: "Our model ignored it the moment the salary sheet was in the passages.",
              },
              {
                id: "review",
                label: "Index uploads only after someone has reviewed them",
                category: "enforced",
                why: "The planted note never enters the index.",
              },
              {
                id: "warn",
                label: "Tell the model to ignore instructions inside passages",
                category: "asked",
                why: "It helps against simple attacks and failed in our test. Treat it as a seatbelt, not a wall.",
              },
              {
                id: "tools",
                label: "Don't let the assistant send emails or open links on its own",
                category: "enforced",
                why: "Breaks the lethal trifecta: even a fooled model can't send data out.",
              },
            ]}
            explanation="Assume the model will sometimes be fooled. Put the hard limits outside it: in what the search can see, what gets indexed, and what the assistant is able to do."
          />
        </div>
      }
    >
      <p>
        The 2026 OWASP list of LLM risks says it plainly: &ldquo;Cosine similarity does not respect
        ACLs&rdquo; (access lists), so authorise before retrieval. Sort these defences.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Filter before you fetch", "Permissions inside the search, from the user's real identity."],
  ["Retrieved text is data", "It can contain instructions; the model may follow them."],
  [
    "Prompts aren't locks",
    "Our rule and our warning both failed. Limit what a fooled model can do.",
  ],
  ["Personal data spreads", "Chunks, vectors and backups: know them all, so you can erase them."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        These have all happened in real products, and been fixed: a crafted email that made
        Microsoft&apos;s Copilot leak data with no clicks (EchoLeak, 2025), a Slack message that
        tricked Slack AI into producing a link that leaked a private key (2024), and a shared
        document that made Bard leak chat data through an image (2023).
      </p>
      <p>Next: choosing a platform, and what all of this costs to run.</p>
    </StepLayout>
  );
}
