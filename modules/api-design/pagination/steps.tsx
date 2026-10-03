"use client";

import { motion } from "motion/react";
import { BookOpen, Bookmark as BookmarkIcon } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, PAGE1, page2, request, skipped, type Change, type Mode } from "./model";
import type { PageState } from "./state";

/* 1 ─ A bookmark, not a page number --------------------------------------------------------------- */

export function Bookmark() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A bookmark, not a page number"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-bad/40 bg-bad/5 flex flex-col gap-2 rounded-xl border px-4 py-3">
            <BookOpen className="text-bad size-5" />
            <p className="font-semibold">&ldquo;I was on page 40&rdquo;</p>
            <p className="text-muted text-sm">
              Overnight someone adds three pages at the front. Page 40 now shows what you read
              yesterday.
            </p>
          </div>
          <div className="border-good/40 bg-good/5 flex flex-col gap-2 rounded-xl border px-4 py-3">
            <BookmarkIcon className="text-good size-5" />
            <p className="font-semibold">A bookmark</p>
            <p className="text-muted text-sm">
              It sits after the last line you read, however many pages are added before it.
            </p>
          </div>
        </div>
      }
    >
      <p>
        No API hands over a million orders in one response. It splits them into pages, and the
        client asks for one page at a time: <Term id="pagination">pagination</Term>.
      </p>
      <p>
        There are two common ways to say where you&apos;re up to. An <em>offset</em> is a page
        number: &ldquo;skip the first 40&rdquo;. A <Term id="cursor">cursor</Term> is a bookmark:
        &ldquo;continue after order 116&rdquo;. They behave the same until the list changes.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Page through a changing list ⭐ ------------------------------------------------------------- */

function Row({ n, tone }: { n: number; tone: "plain" | "dup" | "new" }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-1 font-mono text-[11px]",
        tone === "dup"
          ? "border-bad/60 bg-bad/15"
          : tone === "new"
            ? "border-good/50 bg-good/10"
            : "border-line bg-surface",
      )}
    >
      ord_{n}
    </span>
  );
}

export function PageThrough() {
  const [s, set] = useSceneState<PageState>();
  const p2 = page2(s.mode, s.change);
  const dups = p2.filter((n) => PAGE1.includes(n));
  const skip = skipped(s.mode, s.change);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Page through a changing list"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented<Mode>
              size="sm"
              value={s.mode}
              onChange={(mode) => set({ mode })}
              options={[
                ["offset", "Offset"],
                ["cursor", "Cursor"],
              ]}
            />
          </div>
          <div>
            <p className="text-muted mb-1 font-mono text-[10px]">{request(s.mode, 1)}</p>
            <div className="flex flex-wrap gap-1.5">
              {PAGE1.map((n) => (
                <Row key={n} n={n} tone="plain" />
              ))}
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted mb-1.5 text-[10px]">While you read page 1…</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(CHANGES) as Change[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={s.change === c}
                  onClick={() => set({ change: c, loaded: false })}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px]",
                    s.change === c
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {CHANGES[c].label}
                </button>
              ))}
            </div>
            <p className="text-muted mt-1 text-[11px]">{CHANGES[s.change].note}</p>
          </div>
          {!s.loaded ? (
            <button
              type="button"
              onClick={() => set({ loaded: true })}
              className="bg-accent text-accent-fg self-start rounded-lg px-3 py-1.5 text-xs font-medium"
            >
              Load page 2
            </button>
          ) : (
            <motion.div
              key={s.mode + s.change}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-muted mb-1 font-mono text-[10px]">{request(s.mode, 2)}</p>
              <div className="flex flex-wrap gap-1.5">
                {p2.map((n) => (
                  <Row key={n} n={n} tone={dups.includes(n) ? "dup" : "plain"} />
                ))}
              </div>
              <p
                className={cn(
                  "mt-2 rounded-lg border px-3 py-2 text-xs",
                  dups.length || skip.length
                    ? "border-bad/50 bg-bad/5"
                    : "border-good/50 bg-good/5",
                )}
              >
                {dups.length > 0
                  ? `Shown twice: ${dups.map((n) => `ord_${n}`).join(", ")}. The new orders pushed everything down, so 'skip 5' now skips the wrong five.`
                  : skip.length > 0
                    ? `Never shown: ${skip.map((n) => `ord_${n}`).join(", ")}. Two deletions pulled everything up, and the offset jumped over them.`
                    : s.mode === "cursor" && s.change !== "none"
                      ? "Exactly the next five. The cursor says 'after ord_116', and that's still true however the list changed."
                      : "The next five, as expected. With a list that never changes, both methods agree."}
              </p>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Twenty orders, newest first, five per page. Load page 1, change the list, then load page 2.
        Try every combination in both modes.
      </p>
      <p>
        Slack&apos;s engineers moved their API from offsets to cursors in 2017 for exactly this
        reason: offsets risk &ldquo;potentially skipping or returning duplicate results&rdquo; when
        the data changes between requests.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Page 1,000 is slow -------------------------------------------------------------------------- */

const DEPTHS = [1, 10, 100, 1000];

export function DeepPages() {
  const [s, set] = useSceneState<PageState>();
  const d = s.depth ?? 1;
  const offsetRows = d * 20;
  const max = 1000 * 20;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Page 1,000 is slow"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {DEPTHS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set({ depth: n })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs",
                  d === n ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                page {n.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
          {[
            [
              "Offset",
              `... ORDER BY created DESC LIMIT 20 OFFSET ${((d - 1) * 20).toLocaleString("en-IN")}`,
              offsetRows,
              "bg-bad/60",
            ],
            [
              "Keyset (cursor)",
              "... WHERE created < :last_seen ORDER BY created DESC LIMIT 20",
              20,
              "bg-good/60",
            ],
          ].map(([l, sql, rows, cls]) => (
            <div key={l as string} className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-sm font-semibold">{l}</p>
              <p className="text-muted font-mono text-[10px]">{sql}</p>
              <div className="bg-surface-2 mt-2 h-3 overflow-hidden rounded-full">
                <motion.div
                  animate={{ width: `${Math.max(0.6, ((rows as number) / max) * 100)}%` }}
                  className={cn("h-full rounded-full", cls as string)}
                />
              </div>
              <p className="mt-1 font-mono text-xs">
                about {(rows as number).toLocaleString("en-IN")} rows read
              </p>
            </div>
          ))}
          <p className="text-subtle text-[10px]">
            Illustrative: 20 rows per page, with an index on created.
          </p>
        </div>
      }
    >
      <p>
        Offsets have a second problem. The database can&apos;t jump to row 20,000; it has to find
        and step over every row before it. PostgreSQL&apos;s manual: &ldquo;The rows skipped by an
        OFFSET clause still have to be computed inside the server; therefore a large OFFSET might be
        inefficient.&rdquo;
      </p>
      <p>
        A cursor becomes a <code>WHERE</code> condition the index can answer directly. Markus Winand
        calls this the &ldquo;seek method or keyset pagination&rdquo;. The trade-off: you can go to
        the next page, but not jump straight to page 1,000.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How real APIs do it ------------------------------------------------------------------------- */

const REAL: [string, string, string][] = [
  [
    "Stripe",
    "?limit=10&starting_after=ch_123",
    "Cursor is an object ID; has_more says if there's another page. Limit 1–100.",
  ],
  [
    "GitHub",
    'Link: <…?page=3>; rel="next"',
    "Next and previous pages in a Link header (RFC 8288).",
  ],
  [
    "Google AIP-158",
    "page_size, page_token → next_page_token",
    "Opaque tokens; an empty next_page_token means the end.",
  ],
  [
    "Slack",
    "?limit=200&cursor=dXNlcjpVMEc5V0ZYTlo=",
    "An opaque Base64 cursor; empty next_cursor means done.",
  ],
];

export function RealApis() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How real APIs do it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {REAL.map(([who, eg, d], i) => (
            <motion.div
              key={who}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{who}</p>
              <p className="text-accent font-mono text-[11px] break-all">{eg}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
          <Code>{`GET /orders?filter=status="placed" AND total >= 50000
           &order_by=created desc
           &page_size=20`}</Code>
        </div>
      }
    >
      <p>
        Most cursor APIs make the cursor <em>opaque</em>: a token the client passes back without
        reading it. Google&apos;s guidance explains why: &ldquo;if users are able to deconstruct
        these, they will do so&rdquo;, and then you can never change the format.
      </p>
      <p>
        Filtering and sorting are query parameters on the collection. And paginate from day one:
        Google calls adding pagination later &ldquo;a backwards-incompatible change&rdquo;, because
        old clients would silently get only the first page.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Pick the paging ----------------------------------------------------------------------------- */

export function WhichPaging() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the paging"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="which-paging"
            prompt="A payments app shows a feed of transactions that users scroll endlessly. New ones arrive every few seconds, and some accounts have 2 million. How should the API page it?"
            options={[
              {
                id: "all",
                label: "Return everything; the app can scroll locally",
                feedback: "Two million rows in one response: slow, huge and fragile.",
              },
              {
                id: "offset",
                label: "?page=N with an offset",
                feedback:
                  "New transactions shift every page, so users see repeats; deep pages get slow.",
              },
              {
                id: "cursor",
                label: "A cursor: an opaque token for 'after the last one shown', plus a page size",
                correct: true,
                feedback:
                  "Stable while new items arrive, fast at any depth, and the format can change later.",
              },
              {
                id: "date",
                label: "?date=YYYY-MM-DD, one day per request",
                feedback:
                  "Days vary from zero to thousands of transactions; pages would be wildly uneven.",
              },
            ]}
            explanation="For a long, changing, scroll-forward list, a cursor is the natural fit. Offsets suit small, stable lists where jumping to page N matters."
          />
        </div>
      }
    >
      <p>Which way of paging fits this feed?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Always paginate", "Adding it later breaks clients."],
  ["Offsets drift", "Inserts cause repeats, deletes cause gaps."],
  ["Cursors are bookmarks", "Stable while data changes; fast at any depth."],
  ["Keep cursors opaque", "So you can change them later."],
  ["Filter and sort with parameters", "On the collection, with a stable order."],
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
      <p>
        Next: what happens when a payment request is sent, the network drops, and the app retries.
      </p>
    </StepLayout>
  );
}
