"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const FILES = [
  "menu.html",
  "menu_final.html",
  "menu_final_v2.html",
  "menu_final_v2_REALLY.html",
  "menu_tom_copy.html",
];
/** How many files each section shows, and whether the git panel is visible. */
const SHOW = [3, 5, 5, 5, 5, 5];

function Scene({ index }: { index: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5">
      <div className="border-line bg-surface rounded-lg border p-3">
        <p className="text-muted mb-1 font-mono text-[10px]">shared-folder/ · made-up example</p>
        {FILES.slice(0, SHOW[index]).map((f, i) => (
          <motion.p
            key={f}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: index >= 3 ? 0.35 : 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className={cn("font-mono text-[11px]", i === 4 && index >= 1 && "text-bad")}
          >
            📄 {f}
          </motion.p>
        ))}
      </div>
      <motion.div
        animate={{ opacity: index >= 3 ? 1 : 0.15 }}
        className="border-accent/60 bg-accent-soft rounded-lg border p-3 font-mono text-[11px]"
      >
        <p className="text-muted mb-1 text-[10px]">git log --oneline</p>
        {[
          "a1f3c09 Fix phone layout",
          "7be21d4 Update prices",
          "3c9e0aa Rewrite header",
          "e83c516 First menu",
        ].map((l) => (
          <p key={l}>
            <span className="text-accent">{l.slice(0, 7)}</span>
            {l.slice(7)}
          </p>
        ))}
      </motion.div>
      <motion.p animate={{ opacity: index >= 4 ? 1 : 0 }} className="text-muted text-xs">
        Every copy has the full history.
      </motion.p>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "folder",
    kicker: "Picture this",
    title: "One folder, three people",
    body: (
      <p>
        Kavya, Tom and Imran run the website for a made-up café. They share one folder. To be safe,
        everyone saves a new copy before changing anything: <code>menu_final.html</code>, then{" "}
        <code>menu_final_v2.html</code>.
      </p>
    ),
  },
  {
    id: "overwrite",
    kicker: "Tuesday",
    title: "Whoever saves last wins",
    body: (
      <p>
        Tom edits an old copy and saves it back over the new one. Kavya&apos;s morning of work
        disappears, and nobody notices until a customer does. The folder can&apos;t say who changed
        what, when, or why.
      </p>
    ),
  },
  {
    id: "central",
    kicker: "1990s–2000s",
    title: "One server holds the truth",
    body: (
      <p>
        <Term id="version-control">Version control</Term> fixes this by recording every change.
        Early systems such as CVS and Subversion were centralised: one server held the history, and
        everyone checked files in and out of it.
      </p>
    ),
  },
  {
    id: "linus",
    kicker: "April 2005",
    title: "Linus writes Git",
    body: (
      <p>
        The Linux kernel had used a commercial tool, BitKeeper, for free. In 2005 that free use was
        withdrawn. Linus Torvalds wrote a replacement in a few days and could use it for the kernel
        after about ten. He called it <Term id="git">Git</Term>. Junio Hamano took over as
        maintainer that July.
      </p>
    ),
  },
  {
    id: "distributed",
    kicker: "The big idea",
    title: "Everyone has the whole history",
    body: (
      <p>
        Git is distributed. Every copy, called a <Term id="repository">repository</Term>, holds the
        complete history, so you can commit, branch and look back while offline, and there is no
        single server to lose.
      </p>
    ),
  },
  {
    id: "today",
    kicker: "Today",
    title: "Almost everyone uses it",
    body: (
      <p>
        In 2022, the last year Stack Overflow&apos;s survey asked, about 94% of developers used Git.
        GitHub, GitLab, Bitbucket and others are hosting services built on top of it; they
        aren&apos;t Git itself. In this track you&apos;ll learn how Git works inside, so its
        commands make sense instead of feeling like spells.
      </p>
    ),
  },
];

export function SharedFolder() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            menu_final_v2_REALLY.html
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            How a shared folder falls apart, and how Git came to fix it.
          </p>
        </div>
      }
    />
  );
}
