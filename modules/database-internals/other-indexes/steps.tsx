"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { KINDS, REVIEWS, inverted, nearest, type Kind } from "./model";
import type { OiState } from "./state";

/* 1 ─ Five catalogues ----------------------------------------------------------------------------- */

const CATS: [string, string, string][] = [
  ["Shelf order by title", "Find a title, or every title from A to C", "B-tree"],
  ["A list of exact ISBNs", "Is this exact ISBN here?", "Hash"],
  ["The index at the back of every book", "Which books mention 'monsoon'?", "Inverted"],
  ["A map of branches", "Which branches are within 2 km?", "Spatial"],
  ["“Readers also liked”", "Books similar to this one", "Vector"],
];

export function Catalogues() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Five catalogues"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CATS.map(([t, q, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid gap-x-3 rounded-lg border px-3 py-2 sm:grid-cols-[1fr_1fr_5rem]"
            >
              <span className="text-sm font-semibold">{t}</span>
              <span className="text-muted text-xs">{q}</span>
              <span className="text-accent font-mono text-xs sm:text-right">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A big library keeps several catalogues, because people ask different kinds of question.
        Sorting by title helps with titles and ranges, but not with &ldquo;which books mention the
        monsoon?&rdquo; or &ldquo;what&apos;s near me?&rdquo;.
      </p>
      <p>
        Databases are the same. The B-tree is the all-rounder, but some questions need other
        structures: hash tables, <Term id="inverted-index">inverted indexes</Term>, block summaries,
        spatial trees and <Term id="vector-index">vector indexes</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Same reviews, five indexes ⭐ --------------------------------------------------------------- */

function Visual({
  kind,
  word,
  setWord,
}: {
  kind: Kind;
  word: string;
  setWord: (w: string) => void;
}) {
  if (kind === "inverted") {
    const inv = inverted();
    const hit = inv.find(([w]) => w === word)?.[1] ?? [];
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {inv.map(([w, ids]) => (
            <button
              key={w}
              type="button"
              onClick={() => setWord(w)}
              className={cn(
                "rounded border px-1.5 py-0.5 font-mono text-[10px]",
                w === word ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              {w} → {ids.join(",")}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {REVIEWS.map((r) => (
            <p
              key={r.id}
              className={cn(
                "rounded px-2 py-0.5 text-xs",
                hit.includes(r.id) ? "bg-good/15" : "text-muted",
              )}
            >
              #{r.id} {r.text}
            </p>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "hash") {
    const buckets = [0, 1, 2, 3].map((b) => REVIEWS.filter((r) => (r.id * 7) % 4 === b));
    return (
      <div className="grid grid-cols-4 gap-2">
        {buckets.map((bk, i) => (
          <div key={i} className="border-line bg-surface rounded-lg border px-2 py-2">
            <p className="text-muted font-mono text-[9px]">bucket {i}</p>
            {bk.map((r) => (
              <p
                key={r.id}
                className={cn("font-mono text-[11px]", r.id === 3 && "text-accent font-semibold")}
              >
                reviewer_{r.id}
              </p>
            ))}
          </div>
        ))}
        <p className="text-muted col-span-4 text-[10px]">
          hash(reviewer_3) → bucket 1: one jump, but no order, so no ranges.
        </p>
      </div>
    );
  }
  if (kind === "brin") {
    return (
      <div className="flex flex-col gap-1.5">
        {[
          ["blocks 0–127", "1 Sep – 7 Sep"],
          ["blocks 128–255", "7 Sep – 14 Sep"],
          ["blocks 256–383", "14 Sep – 21 Sep"],
          ["blocks 384–511", "21 Sep – 28 Sep"],
        ].map(([b, r], i) => (
          <div
            key={b}
            className={cn(
              "grid grid-cols-2 rounded-lg border px-3 py-1.5 font-mono text-[11px]",
              i === 2 ? "border-accent bg-accent-soft" : "border-line bg-surface",
            )}
          >
            <span>{b}</span>
            <span>{r}</span>
          </div>
        ))}
        <p className="text-muted text-[10px]">
          Reviews for 16 Sept: only blocks 256–383 can hold them. The whole index is four rows.
        </p>
      </div>
    );
  }
  if (kind === "spatial") {
    return (
      <svg viewBox="0 0 100 100" className="mx-auto h-48 w-48">
        <rect x={5} y={5} width={90} height={90} className="fill-surface stroke-line" />
        <rect
          x={10}
          y={55}
          width={35}
          height={35}
          className="fill-accent/10 stroke-accent"
          strokeDasharray="3 2"
        />
        {REVIEWS.map((r) => (
          <g key={r.id}>
            <circle
              cx={r.lat * 10 + 5}
              cy={100 - (r.lng * 10 + 5)}
              r={3.5}
              className={r.lat < 5 && r.lng < 5 ? "fill-good" : "fill-viz-idle"}
            />
            <text
              x={r.lat * 10 + 9}
              y={100 - (r.lng * 10 + 3)}
              className="fill-fg font-mono text-[5px]"
            >
              #{r.id}
            </text>
          </g>
        ))}
        <text x={10} y={98} className="fill-muted font-mono text-[4.5px]">
          search box: restaurants 1 and 3
        </text>
      </svg>
    );
  }
  const near = nearest([0.85, 0.25]);
  return (
    <div className="flex flex-col gap-2">
      <svg viewBox="0 0 100 100" className="mx-auto h-44 w-44">
        <rect x={5} y={5} width={90} height={90} className="fill-surface stroke-line" />
        {REVIEWS.map((r) => (
          <g key={r.id}>
            <circle
              cx={r.vec[0] * 90 + 5}
              cy={100 - (r.vec[1] * 90 + 5)}
              r={3.5}
              className={near.slice(0, 2).includes(r.id) ? "fill-good" : "fill-viz-idle"}
            />
            <text
              x={r.vec[0] * 90 + 9}
              y={100 - (r.vec[1] * 90 + 3)}
              className="fill-fg font-mono text-[5px]"
            >
              #{r.id}
            </text>
          </g>
        ))}
        <circle
          cx={0.85 * 90 + 5}
          cy={100 - (0.25 * 90 + 5)}
          r={4}
          className="stroke-accent fill-none"
          strokeWidth={1.2}
        />
      </svg>
      <p className="text-muted text-center text-[10px]">
        Query: &ldquo;tasty dosa&rdquo; as a point. Nearest: #{near[0]} and #{near[1]}, the two dosa
        reviews, though neither says &ldquo;tasty&rdquo;.
      </p>
    </div>
  );
}

export function FiveIndexes() {
  const [s, set] = useSceneState<OiState>();
  const k = KINDS[s.kind];
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Same reviews, five indexes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(KINDS) as Kind[]).map((kk) => (
              <button
                key={kk}
                type="button"
                aria-pressed={s.kind === kk}
                onClick={() => set({ kind: kk })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.kind === kk ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {KINDS[kk].name}
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold">{k.question}</p>
          <motion.div
            key={s.kind}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3"
          >
            <Visual kind={s.kind} word={s.word} setWord={(word) => set({ word })} />
          </motion.div>
          <Code>{k.pg}</Code>
          <p className="text-subtle text-[10px]">
            Five tiny illustrative reviews; the vector index needs the pgvector extension.
          </p>
        </div>
      }
    >
      <p>
        Five restaurant reviews, five kinds of index. Each one answers a different kind of question
        quickly, and none of them answers all five.
      </p>
      <p>
        PostgreSQL&apos;s docs on hash indexes are blunt: they &ldquo;can only handle simple
        equality comparisons&rdquo;. An inverted index flips documents into a list of words, each
        with the documents that contain it. BRIN stores just a summary per block range, which works
        when rows arrive in order, such as by timestamp.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Close enough, much faster ------------------------------------------------------------------- */

export function Approximate() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Close enough, much faster"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="font-semibold">Exact search</p>
            <p className="text-muted mt-1 text-sm">
              Compare the query with every vector. pgvector&apos;s default, with &ldquo;perfect
              recall&rdquo;, and slow on millions of rows.
            </p>
          </div>
          <div className="border-accent/50 bg-accent-soft rounded-xl border px-4 py-3">
            <p className="font-semibold">Approximate (HNSW, IVFFlat)</p>
            <p className="text-muted mt-1 text-sm">
              Follow a graph or a few clusters to the likely neighbours. pgvector: an approximate
              index &ldquo;trades some recall for speed&rdquo;.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Vectors are lists of numbers that capture meaning, made by AI models: similar reviews end up
        close together. Finding the nearest ones exactly means measuring the distance to every
        vector.
      </p>
      <p>
        Approximate indexes accept missing the odd true neighbour in exchange for huge speed-ups.
        HNSW, from a 2016 paper by Malkov and Yashunin, builds layers of &ldquo;small world&rdquo;
        graphs to hop quickly towards the answer. The RAG Systems track uses these heavily.
      </p>
    </StepLayout>
  );
}

/* 4 ─ In real databases --------------------------------------------------------------------------- */

const REAL: [string, string][] = [
  [
    "PostgreSQL",
    "Six built-in index types (B-tree, hash, GiST, SP-GiST, GIN, BRIN), plus bloom as an extension. GIN powers full-text search and JSONB; GiST powers PostGIS, which uses “an R-Tree index implemented on top of GiST”.",
  ],
  [
    "MySQL InnoDB",
    "Full-text indexes “have an inverted index design”, storing word positions too, for phrase and proximity searches.",
  ],
  [
    "Oracle",
    "Bitmap indexes, designed for data warehousing and ad hoc queries over low-cardinality columns like gender or region.",
  ],
  [
    "Search engines",
    "Elasticsearch and OpenSearch are built around inverted indexes; vector databases around approximate nearest-neighbour indexes.",
  ],
];

export function InPostgres() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="In real databases"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {REAL.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
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
      <p>
        You don&apos;t always need a separate search or vector database. PostgreSQL with GIN,
        PostGIS and pgvector covers text, maps and similarity in one place, which is often simpler.
      </p>
      <p>
        Specialised systems still win at extreme scale or for advanced ranking. The question, as
        always, is which questions your application asks most.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Match the index ----------------------------------------------------------------------------- */

export function MatchIndex() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Match the index"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="match-index"
            prompt="Which index fits each search best?"
            categories={[
              { id: "btree", label: "B-tree" },
              { id: "gin", label: "Inverted" },
              { id: "gist", label: "Spatial" },
              { id: "vector", label: "Vector" },
            ]}
            items={[
              {
                id: "range",
                label: "Orders between ₹500 and ₹1,000, sorted by amount",
                category: "btree",
                why: "Ranges and sorting: the B-tree's speciality.",
              },
              {
                id: "email",
                label: "The account for one email address",
                category: "btree",
                why: "An equality lookup; a B-tree (or hash) handles it.",
              },
              {
                id: "words",
                label: "Reviews mentioning both 'dosa' and 'crispy'",
                category: "gin",
                why: "Words to documents: an inverted index.",
              },
              {
                id: "tags",
                label: "Products tagged 'vegan' (tags stored as an array)",
                category: "gin",
                why: "GIN indexes each element of the array.",
              },
              {
                id: "near",
                label: "Restaurants within 2 km of the user",
                category: "gist",
                why: "A spatial index finds what's inside an area.",
              },
              {
                id: "similar",
                label: "Support tickets similar in meaning to a new one",
                category: "vector",
                why: "Nearest neighbours by meaning: a vector index.",
              },
            ]}
            explanation="Ranges and exact values: B-tree. Words and array elements: inverted. Places: spatial. Meaning: vector."
          />
        </div>
      }
    >
      <p>Which catalogue would the librarian reach for?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Hash", "Exact matches only."],
  ["Inverted (GIN)", "Words, array elements, JSON keys."],
  ["BRIN", "Tiny summaries for naturally ordered data."],
  ["Spatial (GiST)", "Areas and nearest places."],
  ["Vector (HNSW)", "Similar meaning, approximately and fast."],
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
      <p>Next chapter: how the planner turns SQL into a plan, and how to read one.</p>
    </StepLayout>
  );
}
