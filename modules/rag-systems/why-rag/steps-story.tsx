"use client";

import { motion } from "motion/react";
import { ArrowRight, BookOpen, Brain, Check, FileText, Scale, Search, X } from "lucide-react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 1 ─ Closed book, open book ⭐ -------------------------------------------------------------------- */

const SECTIONS: StorySection[] = [
  {
    id: "memory",
    kicker: "Memory",
    title: "A student who studied everything",
    body: (
      <>
        <p>
          Imagine a student who read a huge library before the exam: textbooks, news, websites. Ask
          a general question and they answer from memory, quickly and well.
        </p>
        <p>
          A <Term id="llm">large language model</Term> is that student. Everything it knows is
          stored in its weights, learned during training. The original RAG paper calls this{" "}
          <Term id="parametric-memory">parametric memory</Term>.
        </p>
      </>
    ),
  },
  {
    id: "gap",
    kicker: "The gap",
    title: "Questions the library never covered",
    body: (
      <>
        <p>
          Now ask about your company&apos;s leave policy, last week&apos;s circular, or anything
          after the model&apos;s <Term id="knowledge-cutoff">knowledge cutoff</Term>. It never saw
          these. It can&apos;t know them.
        </p>
        <p>
          Worse, it may not say so. A model predicts a likely-sounding answer, and a confident guess
          looks exactly like a fact: a <Term id="hallucination">hallucination</Term>.
        </p>
      </>
    ),
  },
  {
    id: "open",
    kicker: "Open book",
    title: "Let the student bring the book",
    body: (
      <>
        <p>
          Change the exam: the student may bring the right book. Before answering, they find the
          page, read it, answer from it, and can point to where the answer came from.
        </p>
        <p>
          That&apos;s the whole idea of <Term id="rag">retrieval-augmented generation</Term>: search
          your documents first, then give the model the question <em>and</em> the passages it needs.
        </p>
      </>
    ),
  },
  {
    id: "picture",
    kicker: "RAG",
    title: "Two kinds of memory",
    body: (
      <>
        <p>
          The name comes from a 2020 paper by Patrick Lewis and colleagues at Facebook AI Research,
          UCL and NYU. They paired a model&apos;s parametric memory with a searchable index of
          Wikipedia, a <Term id="non-parametric-memory">non-parametric memory</Term>.
        </p>
        <p>
          The model supplies language and reasoning. The documents supply the facts. Neither alone
          is enough.
        </p>
      </>
    ),
  },
  {
    id: "update",
    kicker: "Update",
    title: "Change the documents, not the model",
    body: (
      <>
        <p>
          When the policy changes, you update the document collection. No retraining. The paper
          showed it by swapping indexes: with an up-to-date Wikipedia index the model named 68–70%
          of changed world leaders correctly; with a mismatched one, only 4–12%.
        </p>
        <p>
          It also makes answers inspectable: you can see which passages the model was given, and
          show them to the reader as sources.
        </p>
      </>
    ),
  },
  {
    id: "accountable",
    kicker: "Stakes",
    title: "Wrong answers have owners",
    body: (
      <>
        <p>
          In 2024 a Canadian tribunal ordered Air Canada to compensate a passenger (C$812.02 in
          total) after its website chatbot described a bereavement-fare rule that contradicted the
          airline&apos;s own policy page. The airline argued the chatbot was responsible for its own
          words. The tribunal disagreed.
        </p>
        <p>
          We don&apos;t know how that chatbot worked. But the lesson is general: an assistant has to
          answer from the organisation&apos;s real, current documents.
        </p>
      </>
    ),
  },
];

function Bubble({
  who,
  children,
  tone,
}: {
  who: string;
  children: React.ReactNode;
  tone?: "good" | "bad";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border px-3 py-2 text-sm",
        tone === "good"
          ? "border-good/50 bg-good/10"
          : tone === "bad"
            ? "border-bad/50 bg-bad/10"
            : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px] tracking-wide uppercase">{who}</p>
      <div className="mt-0.5">{children}</div>
    </motion.div>
  );
}

const PASSAGE =
  "HR Leave Policy 2026, §4.2: Employees receive 8 days of casual leave in each calendar year.";

function Scene({ stage }: { stage: number }) {
  if (stage === 0)
    return (
      <div className="flex flex-col gap-3">
        <Bubble who="Question">What is the capital of Karnataka?</Bubble>
        <div className="text-muted flex items-center justify-center gap-2 text-xs">
          <Brain className="text-accent size-8" /> answers from what it learned in training
        </div>
        <Bubble who="Model" tone="good">
          <span className="flex items-center gap-1.5">
            <Check className="size-4" /> Bengaluru.
          </span>
        </Bubble>
      </div>
    );
  if (stage === 1)
    return (
      <div className="flex flex-col gap-3">
        <Bubble who="Question">How many days of casual leave do I get this year?</Bubble>
        <div className="text-muted flex items-center justify-center gap-2 text-xs">
          <Brain className="text-muted size-8" /> has never seen your HR policy
        </div>
        <Bubble who="Model" tone="bad">
          <span className="flex items-center gap-1.5">
            <X className="size-4 shrink-0" /> You get 12 days of casual leave per year.
          </span>
          <span className="text-muted mt-1 block text-[11px]">
            Fluent, confident, and invented.
          </span>
        </Bubble>
      </div>
    );
  if (stage === 2)
    return (
      <div className="flex flex-col gap-3">
        <Bubble who="Question">How many days of casual leave do I get this year?</Bubble>
        <div className="border-line bg-surface rounded-xl border p-3">
          <p className="text-muted flex items-center gap-1.5 text-[11px]">
            <BookOpen className="size-4" /> found in your documents
          </p>
          <p className="bg-accent-soft mt-1.5 rounded-md px-2 py-1 text-xs">{PASSAGE}</p>
        </div>
        <Bubble who="Model" tone="good">
          <span className="flex items-center gap-1.5">
            <Check className="size-4 shrink-0" /> 8 days per calendar year.
          </span>
          <span className="text-accent mt-1 block text-[11px]">
            Source: HR Leave Policy 2026, §4.2
          </span>
        </Bubble>
      </div>
    );
  if (stage === 3)
    return (
      <div className="flex flex-col items-stretch gap-2">
        {[
          [Search, "Question", "“How many days of casual leave…?”"],
          [FileText, "Search the documents", "Non-parametric memory: your files, searchable"],
          [BookOpen, "Best passages", "A few relevant paragraphs"],
          [Brain, "Model", "Parametric memory: language and reasoning"],
          [Check, "Answer + sources", "Grounded in the passages"],
        ].map(([Icon, t, d], i) => {
          const I = Icon as typeof Search;
          return (
            <motion.div
              key={t as string}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex items-center gap-3 rounded-lg border px-3 py-1.5"
            >
              <I className="text-accent size-4 shrink-0" />
              <div>
                <p className="text-xs font-medium">{t as string}</p>
                <p className="text-muted text-[11px]">{d as string}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  if (stage === 4)
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="border-line bg-surface flex-1 rounded-lg border p-2 text-[11px] line-through opacity-60">
            Policy 2026 §4.2: 8 days of casual leave.
          </div>
          <ArrowRight className="text-muted size-4 shrink-0" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="border-accent bg-accent-soft flex-1 rounded-lg border p-2 text-[11px]"
          >
            Policy 2027 §4.2: 10 days of casual leave.
          </motion.div>
        </div>
        <Bubble who="Model, same weights" tone="good">
          10 days per calendar year.
          <span className="text-accent mt-1 block text-[11px]">
            Source: HR Leave Policy 2027, §4.2
          </span>
        </Bubble>
        <p className="text-muted text-center text-[11px]">
          Re-index the document; the model is untouched.
        </p>
      </div>
    );
  return (
    <div className="flex flex-col gap-3">
      <Scale className="text-accent mx-auto size-10" />
      <blockquote className="border-accent bg-surface rounded-r-xl border-l-4 px-3 py-2 text-sm">
        &ldquo;It makes no difference whether the information comes from a static page or a
        chatbot.&rdquo;
        <span className="text-muted mt-1 block text-[11px]">
          Moffatt v. Air Canada, 2024 BCCRT 149 (14 February 2024)
        </span>
      </blockquote>
    </div>
  );
}

export function OpenBook() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Closed book, open book
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Why a model that knows so much still can&apos;t answer questions about your documents,
            and the simple idea that fixes it.
          </p>
        </div>
      }
    />
  );
}
