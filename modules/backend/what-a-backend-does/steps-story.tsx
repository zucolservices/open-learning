"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const NODES = ["Phone", "DNS", "Load balancer", "App server", "Database"];
const ACTIVE = [0, 1, 0, 2, 3, 4, 0];

function Scene({ index }: { index: number }) {
  const at = ACTIVE[Math.min(index, ACTIVE.length - 1)];
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5">
      <div className="flex items-center justify-between gap-1">
        {NODES.map((n, i) => (
          <motion.div
            key={n}
            animate={{ scale: at === i ? 1.08 : 1 }}
            className={cn(
              "flex-1 rounded-lg border px-1 py-2 text-center text-[10px]",
              at === i ? "border-accent bg-accent-soft font-semibold" : "border-line bg-surface",
            )}
          >
            {n}
          </motion.div>
        ))}
      </div>
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-line bg-surface-2 rounded-lg border p-3 font-mono text-[11px]"
      >
        {[
          'POST /orders  { item: "masala-chai", qty: 2 }',
          "api.chaicorner.example → 203.0.113.10",
          "TLS 1.3: keys agreed in one round trip",
          "→ forwarded to server 2 of 4 (least busy)",
          "check stock · work out price · validate address",
          "INSERT INTO orders … ; UPDATE stock …",
          "201 Created  { orderId: 4182, total: 80 }",
        ][index] ?? ""}
      </motion.div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "tap",
    kicker: "1 · The tap",
    title: "Someone orders two chais",
    body: (
      <p>
        A customer taps Order in a café app. The phone sends a request to the café&apos;s{" "}
        <Term id="backend">backend</Term>: the code running on servers that does the real work.
      </p>
    ),
  },
  {
    id: "dns",
    kicker: "2 · Find the address",
    title: "DNS turns a name into an address",
    body: (
      <p>
        The phone knows a name, not a location. DNS looks up the IP address, usually from a nearby
        cache in milliseconds.
      </p>
    ),
  },
  {
    id: "tls",
    kicker: "3 · Shake hands",
    title: "A secure connection",
    body: (
      <p>
        The phone and server set up an encrypted connection. With TLS 1.3 that takes one round trip;
        resuming an earlier connection can be quicker still.
      </p>
    ),
  },
  {
    id: "lb",
    kicker: "4 · Pick a server",
    title: "The load balancer shares the work",
    body: (
      <p>
        Popular services run several copies. A <Term id="load-balancer">load balancer</Term> sends
        each request to a healthy, not-too-busy one.
      </p>
    ),
  },
  {
    id: "app",
    kicker: "5 · Apply the rules",
    title: "Your code decides",
    body: (
      <p>
        The application checks the request, confirms the items are in stock, works out the price and
        applies business rules. This is the part you write.
      </p>
    ),
  },
  {
    id: "db",
    kicker: "6 · Remember it",
    title: "The database keeps the record",
    body: (
      <p>
        The order is saved and stock is reduced, together, so the café never sells a chai it
        doesn&apos;t have. Data outlives every request.
      </p>
    ),
  },
  {
    id: "back",
    kicker: "7 · Reply",
    title: "A response travels back",
    body: (
      <p>
        The server replies &ldquo;201 Created&rdquo; with the order number. The app shows a tick.
        Total time: a fraction of a second, if every hop behaves.
      </p>
    ),
  },
];

export function OneRequest() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The life of one request
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            From a tap on a phone to a database and back. The café is made up.
          </p>
        </div>
      }
    />
  );
}
