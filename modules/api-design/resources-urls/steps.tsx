"use client";

import { motion } from "motion/react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, PARTS } from "./model";
import type { UrlState } from "./state";

const PART_CLS = [
  "text-viz-meta",
  "text-viz-compute",
  "text-accent",
  "text-viz-data",
  "text-muted",
];

/* 1 ─ An address for every thing ------------------------------------------------------------------ */

export function Addresses() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="An address for every thing"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="border-line bg-surface overflow-x-auto rounded-xl border px-3 py-3 font-mono text-[11px] whitespace-nowrap sm:text-sm">
            {PARTS.map(([p], i) => (
              <span key={p} className={PART_CLS[i]}>
                {i === 1 ? "://" : ""}
                {p}
              </span>
            ))}
          </p>
          <div className="flex flex-col gap-1.5">
            {PARTS.map(([, name, d], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className="grid grid-cols-[5.5rem_1fr] gap-2 text-xs"
              >
                <span className={cn("font-mono font-semibold", PART_CLS[i])}>{name}</span>
                <span className="text-muted">{d}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            The five parts come from RFC 3986. The scheme and host ignore case; the path, by
            default, does not.
          </p>
        </div>
      }
    >
      <p>
        In a library every book has a shelf mark, and every shelf belongs to a branch. You can find
        any book by its address without knowing how the library is run.
      </p>
      <p>
        REST does the same with <Term id="resource">resources</Term>. Fielding: &ldquo;The key
        abstraction of information in REST is a resource. Any information that can be named can be a
        resource.&rdquo; Books, members, loans and branches each get a <Term id="url">URL</Term>; a{" "}
        <Term id="collection">collection</Term> such as <code>/books</code> holds many of them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tidy the library ⭐ ------------------------------------------------------------------------- */

export function FixEndpoints() {
  const [s, set] = useSceneState<UrlState>();
  const fixed = s.fixed ?? [];
  const last = FIXES.find((f) => f.id === fixed[fixed.length - 1]);
  const all = fixed.length === FIXES.length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Tidy the library"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex items-center justify-between">
            <p className="text-muted font-mono text-[10px]">
              library API · {fixed.length}/{FIXES.length} tidied
            </p>
            {fixed.length > 0 && (
              <button
                type="button"
                onClick={() => set({ fixed: [] })}
                className="text-muted flex items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            )}
          </div>
          {FIXES.map((f) => {
            const done = fixed.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                disabled={done}
                onClick={() => set({ fixed: [...fixed, f.id] })}
                className={cn(
                  "flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg border px-3 py-1.5 text-left font-mono text-[11px]",
                  done ? "border-good/50 bg-good/5" : "border-bad/40 bg-bad/5 hover:bg-bad/10",
                )}
              >
                <span className={done ? "text-muted line-through" : ""}>{f.bad}</span>
                {done && (
                  <>
                    <ArrowRight className="text-good size-3" />
                    <span className="font-semibold">{f.good}</span>
                  </>
                )}
              </button>
            );
          })}
          {last && (
            <motion.p
              key={last.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs"
            >
              {last.why}
            </motion.p>
          )}
          {all && (
            <p className="text-good text-sm">
              Every URL is now a noun, every action an HTTP method. A newcomer can guess the address
              of something they&apos;ve never seen.
            </p>
          )}
          <p className="text-subtle text-[10px]">Illustrative library API.</p>
        </div>
      }
    >
      <p>
        The city library&apos;s API grew one feature at a time, and every developer named things
        their own way. Tap each endpoint to tidy it.
      </p>
      <p>
        The pattern: URLs name things, methods say what to do. Zalando&apos;s guidelines put it as
        &ldquo;MUST keep URLs verb-free&rdquo;. Tim Berners-Lee&apos;s advice from 1998 still
        applies too: &ldquo;A cool URI is one which does not change&rdquo;, so choose names you can
        live with.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When guides disagree ------------------------------------------------------------------------ */

const ROWS: [string, string, string, string][] = [
  ["Collection names", "camelCase (bookLoans)", "kebab-case (book-loans)", "kebab-case preferred"],
  ["Query parameters", "lowerCamelCase", "snake_case", "camelCase"],
  ["Actions", "POST /loans/77:renew", "No verbs: POST /loans/77/renewals", "POST /users/Bob:grant"],
  ["Plural collections", "Yes", "Yes", "Yes"],
];

export function GuidesDisagree() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="When guides disagree"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface overflow-x-auto rounded-xl border text-xs">
            <div className="text-muted grid min-w-[30rem] grid-cols-[7rem_1fr_1fr_1fr] gap-2 px-3 py-1.5 font-semibold">
              <span />
              <span>Google AIPs</span>
              <span>Zalando</span>
              <span>Microsoft Azure</span>
            </div>
            {ROWS.map((r) => (
              <div
                key={r[0]}
                className="border-line grid min-w-[30rem] grid-cols-[7rem_1fr_1fr_1fr] gap-2 border-t px-3 py-1.5"
              >
                <span className="font-semibold">{r[0]}</span>
                {r.slice(1).map((c, i) => (
                  <span key={i} className="text-muted font-mono text-[10px]">
                    {c}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            All three agree on the big ideas: resources as nouns, plural collections, standard
            methods. They differ on spelling.
          </p>
        </div>
      }
    >
      <p>
        Big organisations publish their API style guides. They agree on the shape and disagree on
        the details, which is fine. What matters is that <em>your</em> API is consistent.
      </p>
      <p>
        Pick one guide, write down where you differ, and check it automatically: a linter can catch
        a stray camelCase path before a client ever sees it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Links, the part most skip ------------------------------------------------------------------- */

export function Hypermedia() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Links, the part most skip"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`GET /loans/77

{
  "id": "loan_77",
  "status": "active",
  "due": "2026-10-18",
  "_links": {
    "self":   { "href": "/loans/77" },
    "book":   { "href": "/books/42" },
    "renew":  { "href": "/loans/77:renew", "method": "POST" }
  }
}`}</Code>
          <p className="text-muted text-[11px]">
            If the loan can&apos;t be renewed, the renew link simply isn&apos;t there: the client
            learns what&apos;s possible from the response.
          </p>
        </div>
      }
    >
      <p>
        Fielding&apos;s REST has one more rule: <Term id="hateoas">hypermedia</Term>. Responses
        carry links to related resources and to the actions allowed next, the way a web page links
        to other pages. He wrote in 2008 that an API not driven by hypertext &ldquo;cannot be a REST
        API. Period.&rdquo;
      </p>
      <p>
        Many APIs that call themselves REST stop short of this, and work fine. Even so, a few links
        (to the next page, to related records) make an API easier to explore.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Good URL or needs fixing? ------------------------------------------------------------------- */

export function GoodOrFix() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good URL or needs fixing?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="good-url"
            prompt="Is each request well designed, or does it need fixing?"
            categories={[
              { id: "good", label: "Good" },
              { id: "fix", label: "Needs fixing" },
            ]}
            items={[
              {
                id: "reviews",
                label: "GET /books/42/reviews",
                category: "good",
                why: "A collection under its parent: clear and short.",
              },
              {
                id: "filter",
                label: "GET /books?author=a_3&sort=-published",
                category: "good",
                why: "Filtering and sorting a collection with query parameters.",
              },
              {
                id: "post",
                label: "POST /members/9/loans",
                category: "good",
                why: "Create a new loan for member 9.",
              },
              {
                id: "getall",
                label: "GET /getAllMembers",
                category: "fix",
                why: "A verb in the URL: just GET /members.",
              },
              {
                id: "delete",
                label: "GET /loans/77/delete",
                category: "fix",
                why: "Deleting with GET is dangerous: crawlers and caches send GETs freely. Use DELETE /loans/77.",
              },
              {
                id: "single",
                label: "GET /member/9",
                category: "fix",
                why: "Use the plural collection name: /members/9.",
              },
            ]}
            explanation="Nouns in the path, plural collections, query parameters for filters, and the HTTP method for the action."
          />
        </div>
      }
    >
      <p>Would a newcomer guess these addresses, and could a crawler do damage with them?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Resources are nouns", "Books, members, loans: each with a URL."],
  ["Collections are plural", "/books holds /books/42."],
  ["Methods are the verbs", "GET, POST, PATCH, DELETE."],
  ["Query parameters filter", "/books?title=gita&sort=-published."],
  ["Be consistent", "Pick a guide, lint it, keep URLs stable."],
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
      <p>Next: choosing the right method and status code, and writing errors people can act on.</p>
    </StepLayout>
  );
}
