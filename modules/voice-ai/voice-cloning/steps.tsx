"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { REQUESTS, type Decision } from "./model";
import type { CloneState } from "./state";

/* 1 ─ The perfect impression ---------------------------------------------------------------------- */

export function Impressionist() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The perfect impression"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-good bg-good/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">On stage</p>
            <p className="text-muted mt-1">
              A comedian does a famous voice. Everyone knows it&apos;s an act.
            </p>
          </div>
          <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">On the phone</p>
            <p className="text-muted mt-1">
              &ldquo;It&apos;s your daughter. I&apos;m in trouble, please send money now.&rdquo;
              Nobody knows it&apos;s an act.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A perfect impression is entertainment on stage and fraud on the phone. The difference is
        consent and disclosure: whose voice it is, whether they agreed, and whether the listener
        knows.
      </p>
      <p>
        <Term id="voice-cloning">Voice cloning</Term> now needs only seconds of audio: three seconds
        in Microsoft&apos;s VALL-E research, fifteen for OpenAI&apos;s Voice Engine preview. It
        enables real good, like giving people who are losing their voice a way to keep it, and real
        harm.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Six cloning requests ⭐ --------------------------------------------------------------------- */

const LABEL: Record<Decision, string> = {
  accept: "Accept",
  safeguards: "Accept with safeguards",
  decline: "Decline",
};

export function Requests() {
  const [s, set] = useSceneState<CloneState>();
  const picks = s.picks ?? {};
  const decided = REQUESTS.filter((r) => picks[r.id]);
  const agreed = decided.filter((r) => picks[r.id] === r.best).length;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Six cloning requests"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {REQUESTS.map((r) => {
            const p = picks[r.id];
            return (
              <div
                key={r.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  !p
                    ? "border-line bg-surface"
                    : p === r.best
                      ? "border-good bg-good/10"
                      : "border-viz-compute bg-viz-compute/10",
                )}
              >
                <p>
                  <span className="font-semibold">{r.who}: </span>
                  <span className="italic">&ldquo;{r.ask}&rdquo;</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(Object.keys(LABEL) as Decision[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      aria-label={`${r.who}: ${LABEL[d]}`}
                      aria-pressed={p === d}
                      onClick={() => set({ picks: { ...picks, [r.id]: d } })}
                      className={cn(
                        "rounded border px-2 py-0.5 text-[10px]",
                        p === d ? "border-accent bg-accent-soft" : "border-line",
                      )}
                    >
                      {LABEL[d]}
                    </button>
                  ))}
                </div>
                {p && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1">
                    <p className="text-muted text-[11px]">
                      {p === r.best
                        ? "Agreed. "
                        : `Our policy says: ${LABEL[r.best].toLowerCase()}. `}
                      {r.why}
                    </p>
                    {r.safeguards.length > 0 && (
                      <p className="mt-1 flex flex-wrap gap-1">
                        {r.safeguards.map((g) => (
                          <span key={g} className="bg-surface-2 rounded px-1.5 py-0.5 text-[10px]">
                            {g}
                          </span>
                        ))}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
          <p className="text-muted text-[11px]">
            {decided.length} of 6 decided · {agreed} match the platform&apos;s policy.
          </p>
        </div>
      }
    >
      <p>
        You run trust and safety for a made-up voice platform. Six requests arrive. Decide which to
        accept outright, which to accept only with safeguards, and which to decline.
      </p>
      <p>
        The pattern behind the policy: whose voice is it, have they genuinely{" "}
        <Term id="voice-consent">consented</Term>, and could the result be used to deceive?
        Reasonable people may draw some lines differently; the questions are what matter.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When cloning goes wrong --------------------------------------------------------------------- */

export function Harms() {
  const items: [string, string][] = [
    [
      "2019",
      "A UK energy firm reportedly wired €220,000 after a call that sounded like its parent company's chief executive; its insurer believed AI was used.",
    ],
    [
      "Jan 2024",
      "A fake “President Biden” robocall told New Hampshire voters to skip the primary. The organiser was fined $6 million by the FCC (and later acquitted of criminal charges); the phone carrier paid $1 million.",
    ],
    [
      "Feb 2024",
      "The US FCC ruled that AI-generated voices in robocalls count as “artificial”, so they need prior consent.",
    ],
    [
      "Early 2024",
      "An Arup employee in Hong Kong paid out about US$25 million after a video call in which every “colleague” was a deepfake, faces and voices.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When cloning goes wrong"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([d, t], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Fraud and political disinformation are the headline harms. Scams that imitate a relative or
        a boss work because we trust familiar voices.
      </p>
      <p>
        A simple personal defence: agree a family or team safe word, or always call back on a known
        number before acting on an urgent request for money.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Safeguards and the law ---------------------------------------------------------------------- */

export function Safeguards() {
  const groups: [string, string[]][] = [
    [
      "Before cloning",
      [
        "Verify the speaker is the voice's owner, e.g. by reading a live prompt",
        "Documented consent, with the right to withdraw",
        "Block public figures and other high-risk voices",
      ],
    ],
    [
      "After cloning",
      [
        "Watermark generated audio (e.g. Google's SynthID, Resemble's PerTh)",
        "Attach provenance metadata (C2PA)",
        "Keep records of who created which voice",
      ],
    ],
    [
      "The law (Oct 2026)",
      [
        "EU: tell people when they talk to an AI and label deepfakes, from 2 Aug 2026",
        "Tennessee's ELVIS Act (2024) protects a person's voice",
        "US federal NO FAKES bill: advanced in committee, not law",
      ],
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Safeguards and the law"
      stage={
        <div className="grid flex-1 content-center gap-2 lg:grid-cols-3">
          {groups.map(([g, items], i) => (
            <motion.div
              key={g}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3 text-xs"
            >
              <p className="text-muted text-[10px] uppercase">{g}</p>
              {items.map((t) => (
                <p key={t}>• {t}</p>
              ))}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Responsible providers check consent before cloning and mark audio after. Watermarks only
        mark audio from tools that add them, and provenance metadata can be stripped, so neither
        proves that unmarked audio is genuine.
      </p>
      <p>
        Laws are catching up unevenly. Disclosure duties already apply in places like the EU;
        protections for a person&apos;s voice vary by country and state.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Prevent or trace? --------------------------------------------------------------------------- */

export function PreventOrTrace() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Prevent or trace?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="prevent-trace"
            prompt="Does each safeguard prevent misuse at creation, or help trace it afterwards?"
            categories={[
              { id: "prevent", label: "Prevents misuse" },
              { id: "trace", label: "Helps trace afterwards" },
            ]}
            items={[
              {
                id: "readback",
                label: "The speaker reads a random sentence live before cloning",
                category: "prevent",
                why: "Proves the voice is theirs.",
              },
              {
                id: "block",
                label: "Block cloning of politicians and celebrities",
                category: "prevent",
                why: "Stops high-risk clones at the door.",
              },
              {
                id: "watermark",
                label: "An inaudible watermark in generated audio",
                category: "trace",
                why: "Identifies the audio as synthetic later.",
              },
              {
                id: "c2pa",
                label: "Provenance metadata attached to the file",
                category: "trace",
                why: "Records where it came from, if not stripped.",
              },
              {
                id: "consent",
                label: "Written consent with the right to withdraw",
                category: "prevent",
                why: "No consent, no clone.",
              },
            ]}
            explanation="Verification, blocklists and consent stop misuse before it starts; watermarks and provenance help identify synthetic audio afterwards, imperfectly. Use both."
          />
        </div>
      }
    >
      <p>Sort the safeguards.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Seconds of audio", "Are enough to clone a voice."],
  ["Consent and disclosure", "Whose voice, did they agree, does the listener know?"],
  ["Real harms", "Fraud, scams, disinformation."],
  ["Prevent and trace", "Verify and block; watermark and record."],
  ["Laws vary", "Disclosure in the EU; voice rights in some places."],
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
      <p>Next: the latency budget, where every millisecond of a voice turn goes.</p>
    </StepLayout>
  );
}
