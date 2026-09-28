"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMEWORKS, type Fw } from "./frameworks";
import type { ScaleState } from "./state";

/* 1 ─ More people, more conversations ------------------------------------------------------------ */

const pairs = (n: number) => (n * (n - 1)) / 2;

export function Conversations() {
  const [s, set] = useSceneState<ScaleState>();
  const n = s.people;
  const R = 70;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [100 + R * Math.cos(a), 90 + R * Math.sin(a)];
  });
  const lines: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) lines.push([i, j]);
  return (
    <StepLayout
      eyebrow="Explore"
      title="More people, more conversations"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg
            viewBox="0 0 200 180"
            className="mx-auto max-h-72 w-full"
            role="img"
            aria-label={`${n} people and ${pairs(n)} possible conversations`}
          >
            {lines.map(([i, j]) => (
              <line
                key={`${i}-${j}`}
                x1={pts[i][0]}
                y1={pts[i][1]}
                x2={pts[j][0]}
                y2={pts[j][1]}
                className={cn(n > 10 ? "stroke-bad/30" : "stroke-accent/40")}
                strokeWidth={0.6}
              />
            ))}
            {pts.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={n > 20 ? 2.5 : 4} className="fill-accent" />
            ))}
          </svg>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">People</p>
              <p className="text-lg font-semibold tabular-nums">{n}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Possible one-to-one conversations</p>
              <p className={cn("text-lg font-semibold tabular-nums", n > 10 && "text-bad")}>
                {pairs(n)}
              </p>
            </div>
          </div>
          <label className="flex items-center gap-3 text-xs">
            <span className="text-muted shrink-0">People</span>
            <input
              type="range"
              min={2}
              max={40}
              value={n}
              onChange={(e) => set({ people: Number(e.target.value) })}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Number of people"
            />
          </label>
          <p className="text-muted text-xs">
            {n <= 10
              ? "One Scrum Team: “typically 10 or fewer people”, so everyone can still talk to everyone."
              : "Too many for one team. The Scrum Guide says to split into “multiple cohesive Scrum Teams, each focused on the same product”, sharing one Product Goal, Product Backlog and Product Owner."}
          </p>
        </div>
      }
    >
      <p>
        Think of a big Indian wedding: caterers, decorators, the band, the photographers. Each crew
        works well alone. The trouble is keeping them in step: the band can&apos;t start before the
        stage is built, and dinner can&apos;t be served mid-ceremony.
      </p>
      <p>
        Software is the same. Every extra person adds conversations: with n people there are
        n(n−1)/2 possible pairs. Slide it up. Fred Brooks put it bluntly in 1975: &ldquo;Adding
        manpower to a late software project makes it later.&rdquo;
      </p>
      <p>
        So big products use several small teams, and{" "}
        <Term id="scaling-framework">scaling frameworks</Term> are different answers to one
        question: how do those teams stay in step?
      </p>
    </StepLayout>
  );
}

/* 2 ─ Four frameworks ⭐ (explore) --------------------------------------------------------------- */

export function FourFrameworks() {
  const [s, set] = useSceneState<ScaleState>();
  const fw = FRAMEWORKS.find((f) => f.id === s.fw) ?? FRAMEWORKS[0];
  const all = fw.rows.flatMap(([, ps]) => ps);
  const part = all.find((p) => p.id === s.part);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four frameworks"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.fw}
            options={FRAMEWORKS.map((f) => [f.id, f.name] as [Fw, string])}
            onChange={(v) => set({ fw: v, part: "" })}
          />
          <motion.div
            key={fw.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <div>
              <p className="text-sm font-semibold">{fw.line}</p>
              <p className="text-muted text-[11px]">
                {fw.by} · {fw.size}
              </p>
            </div>
            {fw.rows.map(([label, ps]) => (
              <div key={label} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                <span className="text-muted w-36 shrink-0 pt-1.5 text-[10px] tracking-wide uppercase">
                  {label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ps.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={s.part === p.id}
                      onClick={() => set({ part: p.id })}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-xs",
                        s.part === p.id
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-surface hover:bg-surface-2",
                      )}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <span className="text-muted w-36 shrink-0 text-[10px] tracking-wide uppercase">
                Teams
              </span>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: fw.teams }, (_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.03 * i }}
                    className="bg-viz-data/70 size-5 rounded"
                  />
                ))}
                <span className="text-muted self-center pl-1 text-[10px]">
                  each a Scrum or agile team
                </span>
              </div>
            </div>
          </motion.div>
          <FrameCaption frameKey={part?.id ?? fw.id} title={part?.name ?? "Tap any part"}>
            {part?.note ??
              "Each box is a role, group or event the framework adds. Tap one to see what it does."}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Four well-known frameworks, reduced to the same questions: who orders the work, where
        coordination lives, which events are shared, and what comes out.
      </p>
      <p>
        Notice the range. <Term id="less">LeSS</Term> adds almost nothing to Scrum and relies on
        teams talking directly. <Term id="nexus">Nexus</Term> adds one integration team.{" "}
        <Term id="scrum-at-scale">Scrum@Scale</Term> repeats a team-of-teams pattern.{" "}
        <Term id="safe">SAFe</Term> adds the most roles and events, including a big planning event
        for the whole train.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Whose part is it? ---------------------------------------------------------------------------- */

export function MatchParts() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Whose part is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="scale-match"
            prompt="Which framework does each part belong to?"
            categories={FRAMEWORKS.map((f) => ({ id: f.id, label: f.name }))}
            items={[
              {
                id: "nit",
                label: "An integration team accountable for an integrated Increment",
                category: "nexus",
                why: "The Nexus Integration Team.",
              },
              {
                id: "sp1",
                label: "Sprint Planning One, with all teams and one Product Owner",
                category: "less",
                why: "LeSS: then each team holds Sprint Planning Two.",
              },
              {
                id: "art",
                label: "A 50–125-person release train that plans every 8–12 weeks",
                category: "safe",
                why: "SAFe's Agile Release Train and PI Planning.",
              },
              {
                id: "eat",
                label: "An Executive Action Team and an Executive MetaScrum",
                category: "sas",
                why: "Scrum@Scale's two leadership groups: “how” and “what”.",
              },
              {
                id: "apo",
                label: "Requirement Areas, each with an Area Product Owner",
                category: "less",
                why: "LeSS Huge, for more than about 8 teams.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Match each part to its framework. Go back to the explorer if you need to.</p>
    </StepLayout>
  );
}

/* 4 ─ Remove, don't just manage ----------------------------------------------------------------- */

const FEATURES = ["UPI payments", "Order tracking", "GST invoice PDF"];
const LAYERS = ["Screens", "API", "Database"];
const TEAM_COLOR = ["bg-viz-data/70", "bg-viz-meta/70", "bg-viz-compute/70"];

export function Dependencies() {
  const [s, set] = useSceneState<ScaleState>();
  const comp = s.split === "component";
  return (
    <StepLayout
      eyebrow="Explore"
      title="Remove, don't just manage"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.split}
            options={[
              ["component", "Teams by layer"],
              ["feature", "Teams by feature"],
            ]}
            onChange={(v) => set({ split: v })}
          />
          <div className="grid grid-cols-[auto_repeat(3,1fr)] gap-1.5 text-xs">
            <span />
            {LAYERS.map((l) => (
              <span key={l} className="text-muted text-center text-[10px]">
                {l}
              </span>
            ))}
            {FEATURES.map((f, r) => (
              <div key={f} className="contents">
                <span className="self-center pr-2 text-[11px] font-medium">{f}</span>
                {LAYERS.map((l, c) => {
                  const team = comp ? c : r;
                  return (
                    <motion.div
                      key={l}
                      layout
                      animate={{ opacity: 1 }}
                      className={cn(
                        "grid h-10 place-items-center rounded-lg text-[10px] font-medium",
                        TEAM_COLOR[team],
                      )}
                    >
                      Team {"ABC"[team]}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
          <FrameCaption
            frameKey={s.split}
            title={
              comp ? "Every feature needs all three teams" : "Each team finishes its own feature"
            }
            tone={comp ? "bad" : "good"}
          >
            {comp
              ? "Every feature crosses three teams: six hand-offs for three features. A payment isn't done until the screens, API and database teams all finish, in the right order, so everyone waits on everyone. A framework can coordinate this; it can't make it go away."
              : "No hand-offs between teams for these features. Each team works across all layers and can finish on its own. The shared code still needs care, which is why feature teams lean on continuous integration."}
          </FrameCaption>
        </div>
      }
    >
      <p>
        The cheapest dependency is the one you don&apos;t have. Melvin Conway observed in 1968 that
        organisations design systems that copy their own communication structures. Split teams by
        layer and every feature has to cross all of them.
      </p>
      <p>
        So LeSS expects <Term id="feature-team">feature teams</Term>, and the book{" "}
        <em>Team Topologies</em> (Skelton &amp; Pais, 2019) recommends mostly
        &ldquo;stream-aligned&rdquo; teams, each owning a flow of customer value, supported by
        platform and enabling teams.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">What organisations report</p>
            <p className="text-muted mt-1 text-xs">
              In Digital.ai&apos;s 18th State of Agile survey (2025, about 350 respondents), SAFe
              was the most-reported named framework, but a combined 74% used hybrid or home-grown
              approaches. Small sample; treat as a rough picture.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Critics worth hearing</p>
            <p className="text-muted mt-1 text-xs">
              Scrum co-creator Ken Schwaber (2013): &ldquo;Values and principles scale, but
              practices are context sensitive.&rdquo; And the famous &ldquo;Spotify model&rdquo;? An
              agile coach who was there, quoted by former Spotify engineer Jeremiah Lee (2020):
              &ldquo;It was part ambition, part approximation.&rdquo;
            </p>
          </div>
          <div className="border-good/40 bg-good/10 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">The common ground</p>
            <p className="mt-1 text-xs">
              Every framework&apos;s own guide says it: get good at single-team Scrum, and try fewer
              people before adding more. Scrum@Scale: &ldquo;If an organization cannot Scrum, it
              cannot scale.&rdquo;
            </p>
          </div>
        </div>
      }
    >
      <p>
        Scaling frameworks differ in how much they add: from LeSS&apos;s &ldquo;more with
        less&rdquo; to SAFe&apos;s full set of roles and events. None is best everywhere; the
        context decides.
      </p>
      <p>
        Whichever you use, shape teams to reduce dependencies first, then coordinate the ones that
        remain.
      </p>
    </StepLayout>
  );
}
