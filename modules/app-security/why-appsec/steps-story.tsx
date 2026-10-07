"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const EVENTS: [string, string][] = [
  ["7 Mar", "Flaw made public; fix released"],
  ["8 Mar", "Government alert to Equifax"],
  ["13 May", "Attackers get in"],
  ["29 Jul", "Attack noticed"],
  ["7 Sep", "Breach announced"],
];

/** Which timeline events each story section lights up. */
const LIT = [[], [0, 1], [0, 1, 2], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4]];

function Scene({ index }: { index: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-5 p-6">
      <motion.div
        animate={{ opacity: index === 0 ? 1 : 0.25 }}
        className="flex items-end justify-center gap-2"
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-10 w-8 rounded-sm border-2",
              i === 4 ? "border-bad bg-bad/20" : "border-line-strong bg-surface-2",
            )}
          />
        ))}
      </motion.div>
      <div className="relative flex flex-col gap-1.5">
        {EVENTS.map(([d, t], i) => {
          const on = LIT[index]?.includes(i);
          return (
            <motion.div
              key={d}
              animate={{ opacity: on ? 1 : 0.2, x: on ? 0 : -6 }}
              className="grid grid-cols-[4rem_1fr] items-center gap-2 text-xs"
            >
              <span className="text-accent font-mono">{d} 2017</span>
              <span
                className={cn(
                  "rounded-md border px-2 py-1",
                  i === 2 ? "border-bad bg-bad/10" : "border-line bg-surface",
                )}
              >
                {t}
              </span>
            </motion.div>
          );
        })}
      </div>
      <motion.p animate={{ opacity: index >= 3 ? 1 : 0 }} className="text-muted text-xs">
        76 days inside · about 9,000 database queries · a monitoring device blind for 19 months
      </motion.p>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "window",
    kicker: "Picture this",
    title: "One forgotten window",
    body: (
      <p>
        A big office has locks on every door, guards and cameras. One back window, in a room nobody
        uses any more, has a broken latch. A burglar doesn&apos;t need to beat the guards; they just
        need to try every window. Software works the same way: attackers look for the one{" "}
        <Term id="vulnerability">weakness</Term> you forgot.
      </p>
    ),
  },
  {
    id: "flaw",
    kicker: "March 2017",
    title: "A flaw, and a fix, on the same day",
    body: (
      <p>
        On 7 March 2017 a critical flaw in Apache Struts, a popular open-source framework for
        building websites, was made public, and a fixed version was released the same day. The next
        day the US government warned Equifax, one of the biggest credit agencies in the United
        States. Equifax told its staff to apply the <Term id="patch">patch</Term> within 48 hours.
      </p>
    ),
  },
  {
    id: "missed",
    kicker: "13 May 2017",
    title: "The website nobody patched",
    body: (
      <p>
        One old website, where consumers disputed errors in their credit reports, was missed. Two
        months later, attackers used the public flaw to <Term id="exploit">exploit</Term> it. This
        wasn&apos;t a secret “zero-day”: the fix had been available for weeks.
      </p>
    ),
  },
  {
    id: "inside",
    kicker: "Inside",
    title: "Passwords in a file",
    body: (
      <p>
        Inside, they found a file of usernames and passwords stored without encryption. Those let
        them reach databases far beyond the dispute site. Over 76 days they ran about 9,000 queries
        and copied personal data out.
      </p>
    ),
  },
  {
    id: "blind",
    kicker: "29 July 2017",
    title: "A blind spot for 19 months",
    body: (
      <p>
        A device that inspected the site&apos;s network traffic had been effectively switched off
        for 19 months, because its security certificate had expired. When staff renewed it on 29
        July, they saw the suspicious traffic straight away (US House Oversight Committee report,
        December 2018).
      </p>
    ),
  },
  {
    id: "cost",
    kicker: "September 2017",
    title: "About 147 million people",
    body: (
      <p>
        Equifax announced the breach on 7 September. About 147 million Americans&apos; names, birth
        dates and other details were exposed. A 2019 settlement with US regulators cost at least
        $575 million, potentially up to $700 million. No single clever trick did this: a missed
        patch, stored passwords and broken monitoring did.
      </p>
    ),
  },
];

export function OneWindow() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            One forgotten window
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            How one unpatched website became one of the biggest data breaches in history.
          </p>
        </div>
      }
    />
  );
}
