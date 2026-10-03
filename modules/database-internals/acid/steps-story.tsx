"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const LETTERS = [
  ["A", "Atomic", "all or nothing"],
  ["C", "Consistent", "rules always hold"],
  ["I", "Isolated", "others don't see half-done work"],
  ["D", "Durable", "committed means kept"],
];

function Scene({ index }: { index: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {LETTERS.map(([l, t, d], i) => (
        <motion.div
          key={l}
          animate={{
            opacity: index === 0 || index === 5 || index - 1 === i ? 1 : 0.3,
            x: index - 1 === i ? 6 : 0,
          }}
          className={cn(
            "grid grid-cols-[2.5rem_1fr] items-center gap-3 rounded-xl border px-3 py-3",
            index - 1 === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
          )}
        >
          <span className="text-accent font-mono text-2xl font-semibold">{l}</span>
          <span>
            <span className="block text-sm font-semibold">{t}</span>
            <span className="text-muted text-xs">{d}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "contract",
    kicker: "The idea",
    title: "A contract",
    body: (
      <>
        <p>
          When you buy a house, you don&apos;t want the money to leave your account unless the deeds
          arrive, and vice versa. Jim Gray, writing about transactions in 1981, compared them to a
          contract: &ldquo;either all are bound by the contract or none are&rdquo;.
        </p>
        <p>
          A <Term id="transaction">transaction</Term> groups several changes into one unit with that
          promise. In 1983 Theo Härder and Andreas Reuter gave its guarantees a name:{" "}
          <Term id="acid">ACID</Term>.
        </p>
      </>
    ),
  },
  {
    id: "a",
    kicker: "A",
    title: "Atomic",
    body: (
      <p>
        All the changes happen, or none do. If a transfer debits Asha and then fails before
        crediting Ravi, the debit is undone. There is no in-between state for anyone to find later.
      </p>
    ),
  },
  {
    id: "c",
    kicker: "C",
    title: "Consistent",
    body: (
      <p>
        Every transaction takes the database from one valid state to another: balances never go
        negative, every order points at a real customer. The database enforces the rules you declare
        as constraints; the rest is up to your transaction logic, so consistency is a shared job.
      </p>
    ),
  },
  {
    id: "i",
    kicker: "I",
    title: "Isolated",
    body: (
      <p>
        Transactions running at the same time shouldn&apos;t trip over each other&apos;s
        half-finished work. How strictly that&apos;s enforced is a setting, and the subject of
        module 15.
      </p>
    ),
  },
  {
    id: "d",
    kicker: "D",
    title: "Durable",
    body: (
      <p>
        Once the database says &ldquo;committed&rdquo;, the change survives crashes and power cuts.
        That&apos;s the write-ahead log from the previous module at work.
      </p>
    ),
  },
  {
    id: "why",
    kicker: "Why it matters",
    title: "Simple code, hard guarantees",
    body: (
      <p>
        Without transactions, every application would have to handle every possible failure between
        every pair of writes. With them, you write BEGIN, your changes, COMMIT, and the database
        deals with crashes, errors and other users.
      </p>
    ),
  },
];

export function FourPromises() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Four promises</h2>
          <p className="text-muted mt-3 text-[15px]">
            What a database guarantees when it says &ldquo;committed&rdquo;.
          </p>
        </div>
      }
    />
  );
}
