"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const FRAMES = [
  { signal: 4, battery: 62, screen: "Menu", note: "On the bus, one hand on the rail" },
  { signal: 0, battery: 61, screen: "Placing order…", note: "Into a tunnel" },
  {
    signal: 0,
    battery: 61,
    screen: "Saved: will send when online",
    note: "The app keeps the order safe",
  },
  { signal: 3, battery: 60, screen: "Incoming call", note: "The app moves to the background" },
  {
    signal: 3,
    battery: 40,
    screen: "(app closed by the system)",
    note: "Memory needed for the camera",
  },
  {
    signal: 4,
    battery: 39,
    screen: "Order sent ✓ · ready in 8 min",
    note: "Reopened: everything restored",
  },
];

function Scene({ index }: { index: number }) {
  const f = FRAMES[Math.min(index, FRAMES.length - 1)];
  return (
    <div className="flex h-full items-center justify-center p-5">
      <div className="border-line-strong bg-surface flex h-64 w-36 flex-col rounded-[1.5rem] border-2 p-2">
        <div className="text-muted flex justify-between px-1 text-[9px]">
          <span>{"▂▄▆█".slice(0, f.signal) || "no signal"}</span>
          <span className={cn(f.battery < 45 && "text-bad")}>{f.battery}%</span>
        </div>
        <motion.div
          key={f.screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "mt-3 flex flex-1 items-center justify-center rounded-lg px-2 text-center text-[11px]",
            f.screen.startsWith("(") ? "bg-surface-2 text-subtle" : "bg-accent-soft",
          )}
        >
          {f.screen}
        </motion.div>
        <p className="text-subtle mt-2 text-center text-[9px]">{f.note}</p>
      </div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "bus",
    kicker: "1 · On the move",
    title: "One hand, one thumb",
    body: (
      <p>
        Asha orders a chai on the bus, holding the rail with one hand. The phone is small, their
        thumb is their only pointer, and the screen is in bright daylight.
      </p>
    ),
  },
  {
    id: "tunnel",
    kicker: "2 · No signal",
    title: "The network disappears",
    body: (
      <p>
        They tap Order just as the bus enters a tunnel. Phone networks drop, slow down and come back
        all the time; a good app expects that.
      </p>
    ),
  },
  {
    id: "saved",
    kicker: "3 · Keep calm",
    title: "Save now, send later",
    body: (
      <p>
        Instead of an error, the app saves the order on the phone and says it will send it when the
        signal returns. This idea, <Term id="offline-first">offline first</Term>, gets a module of
        its own.
      </p>
    ),
  },
  {
    id: "call",
    kicker: "4 · Interrupted",
    title: "A call takes over",
    body: (
      <p>
        Their phone rings. The app leaves the screen and goes into the background. Phones juggle
        many apps but show one, and the <Term id="mobile-os">operating system</Term> decides what
        may keep running.
      </p>
    ),
  },
  {
    id: "killed",
    kicker: "5 · Closed without warning",
    title: "The system reclaims memory",
    body: (
      <p>
        While they take a photo, the system quietly closes the café app to free memory. Apps
        don&apos;t get a say, and they aren&apos;t told in advance.
      </p>
    ),
  },
  {
    id: "back",
    kicker: "6 · As if nothing happened",
    title: "Reopened, restored",
    body: (
      <p>
        When they come back, the app restores their screen, sees the signal is back, and sends the
        order. Small screens, flaky networks, low batteries and a boss that can close you anytime:
        that&apos;s mobile.
      </p>
    ),
  },
];

export function OneOrder() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            One order on the move
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            A café order meets a tunnel, a phone call and a busy phone. Asha and the café are made
            up.
          </p>
        </div>
      }
    />
  );
}
