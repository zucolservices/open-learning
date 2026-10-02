"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* Scene ------------------------------------------------------------------------------------------ */

const SERVERS = 20;
const BROKEN = [7, 15]; // older library on these (story 0)
const DEAD = 12; // dies at 2 a.m. (stories 2–3)

/** Copies of the app per server in each chapter of the story. */
function copiesFor(scene: number, s: number) {
  if (scene <= 1) return 1;
  if (scene === 2) return s === DEAD ? 0 : 1;
  // Kubernetes: 30 copies spread over the 19 healthy servers.
  if (s === DEAD) return 0;
  const healthy = s < DEAD ? s : s - 1;
  return healthy < 11 ? 2 : 1;
}

function Servers({ scene }: { scene: number }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {Array.from({ length: SERVERS }, (_, s) => {
        const dead = scene >= 2 && s === DEAD;
        const broken = scene === 0 && BROKEN.includes(s);
        const n = copiesFor(scene, s);
        return (
          <motion.div
            key={s}
            layout
            className={cn(
              "relative flex h-10 items-center justify-center gap-1 rounded-md border sm:h-12",
              dead
                ? "border-bad bg-bad/15"
                : broken
                  ? "border-bad/60 bg-bad/10"
                  : "border-line bg-surface",
            )}
          >
            <span className="text-subtle absolute top-0.5 left-1 font-mono text-[8px]">
              {s + 1}
            </span>
            {dead ? (
              <span className="text-bad text-xs font-semibold">✕</span>
            ) : scene === 0 ? (
              <span className={cn("font-mono text-[9px]", broken ? "text-bad" : "text-fg")}>
                {broken ? "crash" : "v2"}
              </span>
            ) : (
              Array.from({ length: n }, (_, k) => (
                <motion.span
                  key={k}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.02 * s + 0.1 * k }}
                  className={cn(
                    "size-3 rounded-sm border sm:size-4",
                    scene >= 3
                      ? "border-accent bg-accent/30"
                      : "border-viz-compute bg-viz-compute/30",
                  )}
                />
              ))
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

const CAPTION = [
  "18 of 20 updated by hand · 2 crashing",
  "the same container image on every server",
  "server 13 gone · its copy missing · traffic ×3",
  "desired: 30 copies · running: 30, on 19 servers",
];

const TIMELINE: [string, string][] = [
  ["2000s", "Google runs Borg, then Omega, internally"],
  ["Jun 2014", "Kubernetes announced"],
  ["Jul 2015", "Version 1.0"],
  ["Mar 2016", "Joins the CNCF"],
  ["Mar 2018", "First CNCF project to graduate"],
  ["Aug 2026", "Version 1.37"],
];

function Scene({ index }: { index: number }) {
  if (index === 4) {
    return (
      <div className="flex h-full flex-col justify-center gap-1.5">
        {TIMELINE.map(([y, t], i) => (
          <motion.div
            key={y}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i }}
            className="grid grid-cols-[4.5rem_1fr] items-center gap-2 text-xs"
          >
            <span className="text-accent font-mono">{y}</span>
            <span className="border-line bg-surface rounded border px-2 py-1">{t}</span>
          </motion.div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {index === 3 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-accent bg-accent-soft self-center rounded-lg border px-3 py-1 font-mono text-[10px]"
        >
          payments-api · replicas: 30 · image: v2
        </motion.div>
      )}
      <Servers scene={index} />
      <p className="text-muted text-center font-mono text-[10px]">{CAPTION[index]}</p>
    </div>
  );
}

/* Story ------------------------------------------------------------------------------------------ */

const SECTIONS: StorySection[] = [
  {
    id: "byhand",
    kicker: "6 p.m.",
    title: "Release day, by hand",
    body: (
      <>
        <p>
          Your payments app runs on twenty servers. To ship version 2 you log in to each one, copy
          the new build and restart it. Twenty times.
        </p>
        <p>
          Servers 8 and 16 were set up last year with an older library, and the new version crashes
          there. It works on your laptop. It works on eighteen servers. It&apos;s 9 p.m. and
          you&apos;re fixing two by hand.
        </p>
      </>
    ),
  },
  {
    id: "containers",
    kicker: "2013",
    title: "Containers: pack everything",
    body: (
      <>
        <p>
          A <Term id="container">container</Term> packs the app together with every library it needs
          into one <Term id="container-image">image</Term>. Run the image anywhere and you get
          exactly the same thing, isolated from whatever else is on the machine.
        </p>
        <p>
          Docker made this easy in 2013, building on Linux features (namespaces and cgroups) that
          keep processes apart and limit what they use. &ldquo;Works on my machine&rdquo; stopped
          being an excuse.
        </p>
      </>
    ),
  },
  {
    id: "night",
    kicker: "2:07 a.m.",
    title: "But who's watching?",
    body: (
      <>
        <p>
          Containers fixed packaging, not running. At 2:07 a.m. server 13 dies, and its copy of the
          app with it. Nobody notices until customers complain. Then a festival sale triples the
          traffic.
        </p>
        <p>
          Someone still has to decide which server runs each container, notice when one dies and
          start a replacement, add copies when traffic grows, and connect them all to the load
          balancer.
        </p>
      </>
    ),
  },
  {
    id: "declare",
    kicker: "Desired state",
    title: "Say what you want, not what to do",
    body: (
      <>
        <p>
          With Kubernetes you stop giving instructions. You write down what you want, &ldquo;30
          copies of payments-api, version 2&rdquo;, and the <Term id="cluster">cluster</Term> keeps
          making it true. Server 13 dies; its copies reappear on the other{" "}
          <Term id="node">nodes</Term> without anyone waking up.
        </p>
        <p>
          That job is called <Term id="orchestration">orchestration</Term>, though kubernetes.io
          puts it more precisely: Kubernetes is a set of control processes &ldquo;that continuously
          drive the current state towards the provided <Term id="desired-state">desired state</Term>
          &rdquo;.
        </p>
      </>
    ),
  },
  {
    id: "history",
    kicker: "Since 2014",
    title: "From Google's Borg to everyone",
    body: (
      <>
        <p>
          Google had run its own container systems, Borg and then Omega, for more than a decade.
          Kubernetes, announced in June 2014, rebuilt those lessons as open source. Version 1.0
          shipped in July 2015 and it became the Cloud Native Computing Foundation&apos;s first
          graduated project in 2018.
        </p>
        <p>
          The name is Greek for helmsman or pilot; &ldquo;K8s&rdquo; counts the eight letters
          between K and s. In the CNCF&apos;s 2025 survey, 82% of organisations using containers ran
          Kubernetes in production.
        </p>
      </>
    ),
  },
];

export function TwentyServers() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Twenty servers</h2>
          <p className="text-muted mt-3 text-[15px]">
            One app, deployed by hand, until a night when nobody&apos;s watching.
          </p>
        </div>
      }
    />
  );
}
