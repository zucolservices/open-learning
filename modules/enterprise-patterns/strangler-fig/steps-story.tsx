"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const PATHS = ["/statements", "/address", "/eligibility", "/payments", "/reports"];

function Scene({ index }: { index: number }) {
  // How many routes go to the new system at each section.
  const moved = [0, 0, 0, 1, 3, 5][index] ?? 0;
  const showFacade = index >= 2 && index < 5;
  const legacyGone = index >= 5;
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {index === 0 ? (
        <svg viewBox="0 0 200 150" className="mx-auto w-full max-w-xs" aria-hidden>
          <rect x={90} y={30} width={20} height={110} className="fill-viz-idle/40" />
          <circle cx={100} cy={30} r={28} className="fill-viz-idle/30" />
          <motion.path
            d="M104 8 C120 40 84 60 106 90 C126 115 92 125 100 140"
            className="stroke-viz-add"
            strokeWidth={4}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3 }}
          />
          <text x={100} y={148} textAnchor="middle" className="fill-muted text-[8px]">
            the fig grows down around its host
          </text>
        </svg>
      ) : (
        <>
          <motion.div
            animate={{ opacity: showFacade ? 1 : 0.2 }}
            className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-center text-xs font-semibold"
          >
            Façade (routes every request)
          </motion.div>
          <div className="grid grid-cols-5 gap-1">
            {PATHS.map((p, i) => (
              <motion.span
                key={p}
                animate={{ y: 0 }}
                className={cn(
                  "rounded px-1 py-1 text-center font-mono text-[9px]",
                  i < moved ? "bg-viz-add/20 text-viz-add" : "bg-viz-idle/20 text-muted",
                )}
              >
                {p}
              </motion.span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              animate={{ opacity: legacyGone ? 0.15 : 1 }}
              className="border-viz-idle bg-viz-idle/10 rounded-xl border px-3 py-6 text-center text-xs"
            >
              Legacy system{legacyGone ? " (switched off)" : ""}
              {index === 1 && <p className="text-bad mt-1">Rewrite it all at once?</p>}
            </motion.div>
            <motion.div
              animate={{ opacity: index >= 3 ? 1 : 0.2 }}
              className="border-viz-add bg-viz-add/10 rounded-xl border px-3 py-6 text-center text-xs"
            >
              New system · {moved} of 5 routes
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "tree",
    kicker: "The idea",
    title: "A fig around a tree",
    body: (
      <p>
        On a 2001 trip to the Queensland rainforest, Martin Fowler saw strangler figs. The vine
        germinates high in a host tree, grows down to the soil and up to the light, and eventually
        stands on its own; the host may die, leaving the fig &ldquo;as an echo of its shape&rdquo;.
        In 2004 he used it as a name for replacing software.
      </p>
    ),
  },
  {
    id: "bigbang",
    kicker: "The temptation",
    title: "Rewrite it all at once",
    body: (
      <p>
        The obvious plan is a big-bang rewrite: build the new system, then switch over one weekend.
        Fowler: &ldquo;we&apos;ve seen this simple-sounding plan go down in flames most of the
        time.&rdquo; In 2000 Joel Spolsky called Netscape&apos;s rewrite from scratch &ldquo;the
        single worst strategic mistake that any software company can make.&rdquo;
      </p>
    ),
  },
  {
    id: "facade",
    kicker: "Step 1",
    title: "Put a façade in front",
    body: (
      <p>
        Instead, place a <Term id="facade">façade</Term> (a proxy) in front of the old system. At
        first it sends every request straight through. Users notice nothing, as Microsoft puts it:
        they &ldquo;are unaware that a migration is in progress.&rdquo;
      </p>
    ),
  },
  {
    id: "first",
    kicker: "Step 2",
    title: "Move one piece",
    body: (
      <p>
        Build one small piece in the new system and switch its route at the façade. If something
        goes wrong, switch it back. The business gets value early, instead of waiting years.
      </p>
    ),
  },
  {
    id: "more",
    kicker: "Step 3",
    title: "Repeat",
    body: (
      <p>
        Route by route, the new system grows around the old one. Each move is small and reversible.
        This is the <Term id="strangler-fig">strangler fig</Term> pattern.
      </p>
    ),
  },
  {
    id: "retire",
    kicker: "Finally",
    title: "Switch the old one off",
    body: (
      <p>
        When nothing routes to the legacy system any more, switch it off, and eventually remove the
        façade too. Fowler&apos;s reminder: &ldquo;all we are doing is writing tomorrow&apos;s
        legacy software today.&rdquo;
      </p>
    ),
  },
];

export function FigStory() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Grow around the old tree
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Replacing a system you can&apos;t switch off, one piece at a time.
          </p>
        </div>
      }
    />
  );
}
