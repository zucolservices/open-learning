"use client";

import { motion } from "motion/react";
import { Map, Route, ScrollText, Signpost } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BLIPS, C4, RINGS, type Ring } from "./model";
import type { EaState } from "./state";

/* 1 ─ The city planner ---------------------------------------------------------------------------- */

const PLANNER = [
  { icon: Map, t: "Maps", d: "Know what exists and where, at several zoom levels." },
  {
    icon: ScrollText,
    t: "Building codes",
    d: "A few rules everyone must follow: safety, not style.",
  },
  { icon: Signpost, t: "Guidance", d: "Advice on what's working well, and what to avoid." },
  {
    icon: Route,
    t: "Good roads",
    d: "Make the right route the easiest one, and most people take it.",
  },
];

export function CityPlanner() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The city planner"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {PLANNER.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex gap-3 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A city planner doesn&apos;t design every house. They keep maps, set a few building codes,
        give guidance, and build good roads so people choose sensible routes without being ordered
        to.
      </p>
      <p>
        <Term id="enterprise-architecture">Enterprise architecture</Term> is the same job for an
        organisation&apos;s hundreds of systems: seeing the whole estate, spotting duplication, and
        steering investment. Done badly, it becomes a review board that blocks every team. This
        module is about the tools that help instead.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Zoom in with C4 ⭐ -------------------------------------------------------------------------- */

export function ZoomC4() {
  const [s, set] = useSceneState<EaState>();
  const lv = C4[Math.min(s.level ?? 0, C4.length - 1)];
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Zoom in with C4"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper
            step={s.level ?? 0}
            count={C4.length}
            onChange={(n) => set({ level: n })}
            label={`Level ${(s.level ?? 0) + 1}: ${lv.level}`}
          />
          <motion.div
            key={lv.level}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-accent/50 relative grid min-h-40 grid-cols-2 gap-2 rounded-xl border border-dashed p-3 sm:grid-cols-4"
          >
            {lv.boxes.map((b, i) => (
              <motion.div
                key={b.l}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className={cn(
                  "grid place-items-center rounded-lg border px-2 py-5 text-center text-xs",
                  b.kind === "person"
                    ? "border-viz-meta bg-viz-meta/10 rounded-full"
                    : b.kind === "external"
                      ? "border-viz-idle bg-viz-idle/15"
                      : "border-viz-data bg-viz-data/15 font-semibold",
                  lv.level === "Code" && "font-mono",
                )}
              >
                {b.l}
              </motion.div>
            ))}
          </motion.div>
          <FrameCaption frameKey={lv.level} title={lv.level}>
            <p>{lv.text}</p>
            <p className="text-accent mt-1 text-xs">For: {lv.who}</p>
          </FrameCaption>
        </div>
      }
    >
      <p>
        Simon Brown&apos;s <Term id="c4-model">C4 model</Term> draws architecture like a map you can
        zoom: system context, then containers, then components, then code. Each level has a clear
        audience, and a clear meaning for each box.
      </p>
      <p>
        C4&apos;s own advice: &ldquo;you don&apos;t need to use all 4 levels of diagram&rdquo;;
        system context and container diagrams are enough for most teams. And its biggest warning, in
        a heading: a container is &ldquo;Not Docker!&rdquo;, but anything that must be running for
        the system to work.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Your technology radar ----------------------------------------------------------------------- */

const ORDER: Ring[] = ["adopt", "trial", "assess", "caution"];

export function Radar() {
  const [s, set] = useSceneState<EaState>();
  const rings = s.rings ?? {};
  const cycle = (id: string) => {
    const cur = rings[id] ?? "assess";
    set({ rings: { ...rings, [id]: ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length] } });
  };
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Your technology radar"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="-145 -115 290 230" className="mx-auto w-full max-w-sm" aria-hidden>
            {ORDER.slice()
              .reverse()
              .map((r) => (
                <g key={r}>
                  <circle
                    r={RINGS[r].r}
                    className={cn(
                      r === "caution"
                        ? "fill-bad/5 stroke-bad/40"
                        : "fill-surface stroke-line-strong",
                    )}
                    strokeWidth={0.8}
                  />
                  <text y={-RINGS[r].r + 9} textAnchor="middle" className="fill-muted text-[7px]">
                    {RINGS[r].name}
                  </text>
                </g>
              ))}
            {BLIPS.map((b) => {
              const ring = RINGS[rings[b.id] ?? "assess"];
              const rr = ring.r - 12;
              const a = (b.a * Math.PI) / 180;
              const x = Math.round(rr * Math.cos(a) * 10) / 10;
              const y = Math.round(rr * Math.sin(a) * 10) / 10;
              return (
                <motion.g
                  key={b.id}
                  animate={{ x, y }}
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                >
                  <circle r={4} className="fill-accent" />
                  <text y={-6} textAnchor="middle" className="fill-fg text-[6px]">
                    {b.l}
                  </text>
                </motion.g>
              );
            })}
          </svg>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {BLIPS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => cycle(b.id)}
                className="border-line bg-surface hover:bg-surface-2 rounded-lg border px-2.5 py-1.5 text-left text-[11px]"
              >
                <span className="font-semibold">{b.l}</span>
                <span className="text-accent block">{RINGS[rings[b.id] ?? "assess"].name} →</span>
              </button>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Click a technology to move it out a ring. Placements are yours.
          </p>
        </div>
      }
    >
      <p>
        Thoughtworks has published its <Term id="technology-radar">Technology Radar</Term> since
        January 2010: technologies placed in four rings, Adopt, Trial, Assess and, since April 2026,
        Caution (previously Hold). Its free Build Your Own Radar tool turns a spreadsheet into a
        radar for your own organisation.
      </p>
      <p>
        A company radar is governance by guidance: it tells teams what&apos;s proven, what&apos;s
        being tried, and what to avoid for new work, without approving every choice.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Frameworks and paved roads ------------------------------------------------------------------ */

const FRAMEWORKS: [string, string][] = [
  [
    "TOGAF Standard, 10th Edition (2022)",
    "The Open Group's enterprise architecture framework. Its Architecture Development Method runs in a cycle: vision; business, information systems and technology architectures; opportunities; migration planning; governance; change management, around continuous requirements management.",
  ],
  [
    "Zachman Framework (1987)",
    "A 6 × 6 grid for classifying descriptions of an enterprise: what, how, where, who, when, why, from several perspectives. A structure, not a process.",
  ],
  [
    "ArchiMate 4 (2026)",
    "The Open Group's modelling language for enterprise architecture diagrams, simplified in its fourth version.",
  ],
  [
    "Business capability maps",
    "What the business does to generate value (sales, claims, payments), independent of how or which system. Stable while systems change.",
  ],
];

export function Frameworks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Frameworks and paved roads"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FRAMEWORKS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2">
            <p className="text-sm font-semibold">Paved roads and golden paths</p>
            <p className="text-muted text-xs">
              Netflix supports a &ldquo;paved road&rdquo; of tools but doesn&apos;t mandate it,
              making it &ldquo;a far better experience than not using them.&rdquo; Spotify&apos;s
              golden path (2020) is &ldquo;the &lsquo;opinionated and supported&rsquo; path to
              &lsquo;build something&rsquo;&rdquo;; its Backstage developer portal, open-sourced in
              March 2020, is now a CNCF incubating project.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Large organisations often adopt a framework. TOGAF gives a method and vocabulary; Zachman a
        way to classify; ArchiMate a notation. A <Term id="capability-map">capability map</Term> is
        often the most useful single picture: it shows where systems duplicate each other.
      </p>
      <p>
        The most effective governance tends to be the city planner&apos;s good road: a{" "}
        <Term id="paved-road">paved road</Term> that makes the recommended way the easiest one,
        built by platform teams (module 2).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which C4 level? ----------------------------------------------------------------------------- */

export function WhichLevel() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which C4 level?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-c4"
            prompt="Which C4 diagram shows each?"
            categories={[
              { id: "context", label: "System context" },
              { id: "container", label: "Container" },
              { id: "component", label: "Component" },
              { id: "code", label: "Code" },
            ]}
            items={[
              {
                id: "users",
                label: "The claims system, its policyholders and the payment gateway",
                category: "context",
                why: "The system as one box, with users and neighbours.",
              },
              {
                id: "apps",
                label: "The web app, the claims API and the claims database",
                category: "container",
                why: "Things that must be running.",
              },
              {
                id: "inside",
                label: "ApproveClaim and the PolicyStore port inside the claims API",
                category: "component",
                why: "Groupings inside one container.",
              },
              {
                id: "classes",
                label: "The ApproveClaim class and its methods",
                category: "code",
                why: "Code elements.",
              },
            ]}
            explanation="Context: the system and its world. Containers: running applications and data stores. Components: parts inside one container. Code: classes and functions."
          />
        </div>
      }
    >
      <p>Match each to its zoom level.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["See the estate", "Maps at several zoom levels: C4, capability maps."],
  ["Guide, don't block", "Radars and paved roads beat approval boards."],
  ["Frameworks are vocabulary", "TOGAF, Zachman, ArchiMate: use what helps."],
  ["Context and containers", "Usually enough diagrams for a team."],
  ["Make the right way easy", "Platforms and golden paths."],
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
        That&apos;s every pattern in the track. The capstone puts them together: modernising a state
        benefits system without stopping a single payment.
      </p>
    </StepLayout>
  );
}
