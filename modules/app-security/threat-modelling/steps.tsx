"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, ELEMENTS, RESPONSES, STRIDE, TOTAL, type Response } from "./model";
import type { ThreatState } from "./state";

/* 1 ─ Planning a school trip ---------------------------------------------------------------------- */

export function SchoolTrip() {
  const legs = ["School gate", "Bus", "Museum", "Lunch", "Bus home"];
  return (
    <StepLayout
      eyebrow="Story"
      title="Planning a school trip"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
            {legs.map((l, i) => (
              <motion.span
                key={l}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * i }}
                className="flex items-center gap-1.5"
              >
                <span
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    i === 2 ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  )}
                >
                  {l}
                </span>
                {i < legs.length - 1 && <span className="text-bad">⚠</span>}
              </motion.span>
            ))}
          </div>
          <p className="text-muted max-w-sm text-center text-xs">
            ⚠ marks a handover, where children pass from one person&apos;s care to another&apos;s.
            That&apos;s where things go wrong.
          </p>
        </div>
      }
    >
      <p>
        A teacher planning a museum trip doesn&apos;t wait for a child to get lost. They walk
        through the day: the bus, the museum, lunch. At each handover they ask what could go wrong,
        and plan a head count, a meeting point, name badges.
      </p>
      <p>
        <Term id="threat-modelling">Threat modelling</Term> is the same habit for software. Adam
        Shostack sums it up in four questions: What are we working on? What can go wrong? What are
        we going to do about it? Did we do a good job? You can answer them on a whiteboard, before
        any code exists.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Draw it, then ask what can go wrong ⭐ ------------------------------------------------------ */

export function Diagram() {
  const [s, set] = useSceneState<ThreatState>();
  const seen = s.seen ?? [];
  const sel = ELEMENTS.find((e) => e.id === s.selected);
  const found = ELEMENTS.filter((e) => seen.includes(e.id)).reduce(
    (n, e) => n + e.threats.length,
    0,
  );
  const pick = (id: string) =>
    set({ selected: id, seen: seen.includes(id) ? seen : [...seen, id] });
  const hit = (id: string) => ({
    onClick: () => pick(id),
    role: "button",
    "aria-label": ELEMENTS.find((e) => e.id === id)?.name,
    style: { cursor: "pointer" } as const,
  });
  const cls = (id: string) =>
    s.selected === id ? "stroke-accent" : seen.includes(id) ? "stroke-good" : "stroke-line-strong";
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Draw it, then ask what can go wrong"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.boundaries}
              onChange={(e) => set({ boundaries: e.target.checked })}
              className="accent-accent"
            />
            Show trust boundaries
          </label>
          <svg viewBox="0 0 320 190" className="mx-auto w-full max-w-lg" fill="none">
            {s.boundaries && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect
                  x={122}
                  y={22}
                  width={176}
                  height={110}
                  rx={6}
                  className="stroke-bad"
                  strokeDasharray="5 3"
                />
                <text x={128} y={32} className="fill-bad text-[7px]">
                  our cloud account
                </text>
              </motion.g>
            )}
            {/* flows */}
            <g {...hit("order")}>
              <line x1={58} y1={60} x2={138} y2={96} stroke="transparent" strokeWidth={14} />
              <line x1={58} y1={60} x2={138} y2={96} className={cls("order")} strokeWidth={2.5} />
              <text x={64} y={56} className="fill-muted text-[6.5px]">
                order + payment
              </text>
            </g>
            <g {...hit("ready")}>
              <line x1={58} y1={150} x2={138} y2={114} stroke="transparent" strokeWidth={14} />
              <line x1={58} y1={150} x2={138} y2={114} className={cls("ready")} strokeWidth={2.5} />
              <text x={62} y={164} className="fill-muted text-[6.5px]">
                “order ready”
              </text>
            </g>
            <line
              x1={182}
              y1={96}
              x2={230}
              y2={58}
              className="stroke-line-strong"
              strokeWidth={1.5}
            />
            <g {...hit("pay")}>
              <line x1={180} y1={112} x2={232} y2={140} stroke="transparent" strokeWidth={14} />
              <line x1={180} y1={112} x2={232} y2={140} className={cls("pay")} strokeWidth={2.5} />
              <text x={176} y={146} className="fill-muted text-[6.5px]">
                charge card
              </text>
            </g>
            {/* external entities */}
            <rect x={6} y={46} width={52} height={22} className="fill-surface stroke-line-strong" />
            <text x={32} y={60} textAnchor="middle" className="fill-fg text-[7px]">
              Customer
            </text>
            <rect
              x={6}
              y={140}
              width={52}
              height={22}
              className="fill-surface stroke-line-strong"
            />
            <text x={32} y={154} textAnchor="middle" className="fill-fg text-[7px]">
              Restaurant
            </text>
            <rect
              x={240}
              y={140}
              width={74}
              height={22}
              className="fill-surface stroke-line-strong"
            />
            <text x={277} y={154} textAnchor="middle" className="fill-fg text-[7px]">
              Payment provider
            </text>
            {/* process */}
            <g {...hit("web")}>
              <circle
                cx={160}
                cy={104}
                r={22}
                className={cn("fill-surface", cls("web"))}
                strokeWidth={2}
              />
              <text x={160} y={107} textAnchor="middle" className="fill-fg text-[7px]">
                Web app
              </text>
            </g>
            {/* store */}
            <g {...hit("db")}>
              <rect x={226} y={40} width={66} height={22} className="fill-surface stroke-none" />
              <line x1={226} y1={40} x2={292} y2={40} className={cls("db")} strokeWidth={2} />
              <line x1={226} y1={62} x2={292} y2={62} className={cls("db")} strokeWidth={2} />
              <text x={259} y={54} textAnchor="middle" className="fill-fg text-[7px]">
                Orders DB
              </text>
            </g>
          </svg>
          <p className="text-muted text-xs">
            Click the thick lines, the circle and the database. Threats found:{" "}
            <span className="font-mono">{found}</span> of {TOTAL}.
          </p>
          {sel && (
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">
                {sel.name}
                {sel.crosses && (
                  <span className="text-bad font-normal"> · crosses a trust boundary</span>
                )}
              </p>
              <ul className="mt-1 flex flex-col gap-1">
                {sel.threats.map((t) => (
                  <li key={t.text}>
                    <span className="text-accent font-mono">{t.letter}</span> {t.text}{" "}
                    <span className="text-muted">→ {t.fix}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Start with a <Term id="data-flow-diagram">data flow diagram</Term>: the people and outside
        systems (boxes), your code (circles), where data is stored (parallel lines), and the data
        moving between them (lines).
      </p>
      <p>
        Then mark the <Term id="trust-boundary">trust boundaries</Term>, where data passes from
        something you don&apos;t control to something you do. Tick the box: most threats sit on the
        lines that cross it, just like the handovers on a school trip.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Six questions called STRIDE ----------------------------------------------------------------- */

export function Letters() {
  const [s, set] = useSceneState<ThreatState>();
  const l = STRIDE.find((x) => x.id === s.letter) ?? STRIDE[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Six questions called STRIDE"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-6 gap-1.5">
            {STRIDE.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.letter === x.id}
                aria-label={x.name}
                onClick={() => set({ letter: x.id })}
                className={cn(
                  "rounded-lg border py-3 font-mono text-2xl",
                  s.letter === x.id
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line bg-surface",
                )}
              >
                {x.id}
              </button>
            ))}
          </div>
          <motion.div
            key={l.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-4 py-3 text-sm"
          >
            <p className="font-semibold">{l.name}</p>
            <p className="text-muted text-xs">Breaks: {l.breaks}</p>
            <p className="mt-2 text-xs">In the delivery app: {l.eg}</p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            From Loren Kohnfelder and Praerit Garg, Microsoft, 1999.
          </p>
        </div>
      }
    >
      <p>
        “What can go wrong?” is a big question. <Term id="stride">STRIDE</Term> breaks it into six
        smaller ones, each the opposite of a property you want: proving who someone is, keeping data
        unchanged, being able to prove who did what, keeping secrets, staying available, and letting
        people do only what they&apos;re allowed.
      </p>
      <p>
        Walk each element of the diagram through the six letters. It&apos;s a prompt for thinking,
        not a perfect classification: one problem can fit several letters, and that&apos;s fine.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What will we do about it? ------------------------------------------------------------------- */

export function Respond() {
  const [s, set] = useSceneState<ThreatState>();
  const decisions = s.decisions ?? {};
  return (
    <StepLayout
      eyebrow="Explore"
      title="What will we do about it?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DECISIONS.map((d) => {
            const pick = decisions[d.id];
            return (
              <div
                key={d.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">{d.threat}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {RESPONSES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={pick === r}
                      onClick={() => set({ decisions: { ...decisions, [d.id]: r as Response } })}
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px]",
                        pick === r ? "border-accent bg-accent-soft" : "border-line",
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-1", d.best.includes(pick) ? "text-good" : "text-muted")}>
                    {d.why[pick]}
                  </p>
                )}
              </div>
            );
          })}
          <p className="text-subtle text-[10px]">
            Free tools: OWASP Threat Dragon (web or desktop), Microsoft Threat Modeling Tool
            (Windows), and “threat model as code” with pytm or Threagile.
          </p>
        </div>
      }
    >
      <p>
        For each threat, decide and write it down: mitigate it (reduce it), eliminate it (remove the
        feature or data), transfer it (let a specialist carry it) or accept it (it&apos;s small, and
        you say so). Try the three threats.
      </p>
      <p>
        Other methods answer other questions: attack trees (popularised by Bruce Schneier in 1999)
        for one attacker goal, LINDDUN for privacy, PASTA for a business-risk view. Old numeric
        scoring schemes such as DREAD have fallen out of favour because the scores were subjective.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which STRIDE threat? ------------------------------------------------------------------------ */

export function WhichLetter() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which STRIDE threat?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="stride-letter"
            prompt="Which STRIDE letter fits each threat best?"
            categories={STRIDE.map((x) => ({ id: x.id, label: x.name }))}
            items={[
              {
                id: "phish",
                label: "A rider logs in with a courier's stolen password",
                category: "S",
                why: "Pretending to be someone else.",
              },
              {
                id: "price",
                label: "An order request is edited to change the total",
                category: "T",
                why: "Changing data.",
              },
              {
                id: "deny",
                label: "A customer claims they never placed an order, and there's no record",
                category: "R",
                why: "No way to prove who did what.",
              },
              {
                id: "leak",
                label: "An error page shows the database password",
                category: "I",
                why: "Secrets revealed.",
              },
              {
                id: "flood",
                label: "Fake orders flood the kitchen screen",
                category: "D",
                why: "Real users can't get through.",
              },
              {
                id: "admin",
                label: "A customer reaches the menu editor",
                category: "E",
                why: "Doing more than they're allowed.",
              },
            ]}
            explanation="STRIDE: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. Real threats often fit more than one."
          />
        </div>
      }
    >
      <p>Sort the threats.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  [
    "Four questions",
    "What are we building? What can go wrong? What will we do? Did we do a good job?",
  ],
  ["Draw the data flows", "Boxes, circles, stores, lines."],
  ["Watch the boundaries", "Threats cluster where trust changes."],
  ["STRIDE as prompts", "Six questions, not a perfect taxonomy."],
  ["Decide and record", "Mitigate, eliminate, transfer or accept."],
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
      <p>Next: design principles that prevent whole families of threats at once.</p>
    </StepLayout>
  );
}
