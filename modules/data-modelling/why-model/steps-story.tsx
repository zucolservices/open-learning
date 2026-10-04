"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const LINES = [
  "2 Mar · Asha · chai · 120",
  "5 Mar · asha · chai 120",
  "5 Mar · Ben · samosa 60",
  "9/3 Ben T. chai",
];

function Scene({ index }: { index: number }) {
  // 0 notebook, 1 spreadsheet, 2 questions, 3 entities, 4 tables + links
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      {index <= 1 && (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "w-60 rounded-lg border px-3 py-2 font-mono text-[11px]",
            index === 0
              ? "border-tier-gold/60 bg-tier-gold/10 -rotate-1"
              : "border-line bg-surface",
          )}
        >
          {index === 1 && (
            <p className="text-muted mb-1 grid grid-cols-4 text-[9px] font-semibold">
              DATE CUSTOMER ITEM AMOUNT
            </p>
          )}
          {LINES.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </motion.div>
      )}
      {index === 2 && (
        <div className="flex flex-col gap-2">
          {[
            "What did we take in March?",
            "Who are our regulars?",
            "What sells best on rainy days?",
          ].map((q, i) => (
            <motion.p
              key={q}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * i }}
              className="border-accent bg-accent-soft rounded-full border px-3 py-1 text-xs"
            >
              {q}
            </motion.p>
          ))}
        </div>
      )}
      {index >= 3 && (
        <div className="flex items-center gap-4">
          {["Customer", "Order", "Product"].map((e, i) => (
            <div key={e} className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 * i }}
                className="border-viz-data bg-viz-data/10 rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">{e}</p>
                {index === 4 && (
                  <p className="text-muted font-mono text-[9px]">
                    {["id, name", "id, date, customer_id, product_id", "id, name, price"][i]}
                  </p>
                )}
              </motion.div>
              {i < 2 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-accent text-xs"
                >
                  {index === 4 ? (i === 0 ? "—<" : ">—") : "—"}
                </motion.span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "notebook",
    kicker: "The notebook",
    title: "Meera's café",
    body: (
      <p>
        Meera runs a small café. For a year she wrote every sale in a notebook: the date, who bought
        it, what, and for how much. It worked, because she was the only one reading it.
      </p>
    ),
  },
  {
    id: "sheet",
    kicker: "The spreadsheet",
    title: "Typing it up",
    body: (
      <p>
        Her nephew typed it into a spreadsheet, one row per sale, exactly as written. Now the same
        customer appears under three spellings, dates come in four formats, and one amount has a
        rupee sign that makes it text.
      </p>
    ),
  },
  {
    id: "questions",
    kicker: "Questions",
    title: "The questions arrive",
    body: (
      <p>
        Then the questions start. How much did we take in March? Who are our regulars? Each one
        becomes an afternoon of cleaning, and two people get two different answers.
      </p>
    ),
  },
  {
    id: "things",
    kicker: "The model",
    title: "Decide what the things are",
    body: (
      <p>
        A <Term id="data-model">data model</Term> is an agreement about what the things are (
        <Term id="entity">entities</Term> such as customers, products and orders), what we record
        about each (their <Term id="attribute">attributes</Term>) and how they connect. IBM calls it
        a picture of &ldquo;the types of data used and stored within the system and the
        relationships among these data types&rdquo;.
      </p>
    ),
  },
  {
    id: "tables",
    kicker: "Tables",
    title: "Each fact in one place",
    body: (
      <p>
        Each customer is written down once, with an id. Each order points to a customer and a
        product. Asha is Asha everywhere, a date is a real date, a price is a number. The questions
        become one-line queries, and everyone gets the same answer.
      </p>
    ),
  },
];

export function CafeStory() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The café&apos;s notebook
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            How a pile of records becomes something that answers questions.
          </p>
        </div>
      }
    />
  );
}
