"use client";

import { motion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CIRCULARS, QUESTIONS } from "./circulars";
import data from "./data.json";
import type { FreshState } from "./state";

/* 1 ─ The notice board --------------------------------------------------------------------------- */

const NOTICES = [
  { title: "Lift maintenance: Sunday 10 am", stale: true, rot: -3 },
  { title: "Water tank cleaning: 5 May", stale: true, rot: 2 },
  { title: "Maintenance charges now ₹2,500", stale: false, rot: -1 },
  { title: "Maintenance charges ₹2,000", stale: true, rot: 3 },
  { title: "Diwali function: volunteers wanted", stale: true, rot: -2 },
  { title: "Parking stickers: collect by 30 Sept", stale: false, rot: 1 },
];

export function NoticeBoard() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The notice board"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="bg-viz-compute/20 border-viz-compute/40 grid grid-cols-2 gap-3 rounded-xl border p-4 sm:grid-cols-3">
            {NOTICES.map((n, i) => (
              <motion.div
                key={n.title}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0, rotate: n.rot }}
                transition={{ delay: 0.08 * i }}
                className={cn(
                  "bg-surface relative rounded-md p-2.5 text-xs shadow-sm",
                  n.stale && "text-muted",
                )}
              >
                <span className="bg-bad absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full" />
                {n.title}
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-center text-xs">
            Which maintenance charge is right? The board doesn&apos;t say.
          </p>
        </div>
      }
    >
      <p>
        A housing society&apos;s notice board where nobody takes old notices down. Two notices give
        different maintenance charges, neither dated clearly. A new resident reads the first one
        they see.
      </p>
      <p>
        A RAG index is the same board. Documents change, get replaced or withdrawn. If the index
        isn&apos;t kept in step, retrieval finds old rules as happily as new ones, and the model
        repeats them confidently. Keeping it current is called{" "}
        <Term id="index-freshness">freshness</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Keep the index honest ⭐ (build & connect, real answers) ------------------------------------ */

type Stage = keyof typeof data;

function stageOf(s: FreshState): Stage {
  if (!s.sync) return "none";
  if (s.filter) return "syncFilter";
  if (s.del) return "syncDelete";
  return "sync";
}

const STATUS_STYLE: Record<string, string> = {
  current: "bg-good/15 text-good",
  superseded: "bg-viz-compute/20 text-fg",
  withdrawn: "bg-bad/15 text-bad",
};

function Block({
  on,
  label,
  sub,
  disabled,
  onToggle,
}: {
  on: boolean;
  label: string;
  sub: string;
  disabled?: boolean;
  onToggle(): void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "flex min-w-[9rem] flex-1 flex-col rounded-lg border px-2.5 py-2 text-left transition-colors",
        on ? "border-accent bg-accent-soft" : "border-line bg-surface border-dashed",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <span className="flex items-center justify-between gap-2 text-xs font-medium">
        {label}
        <span
          className={cn(
            "relative h-4 w-7 shrink-0 rounded-full transition-colors",
            on ? "bg-accent" : "bg-line-strong",
          )}
        >
          <span
            className={cn(
              "bg-surface absolute top-0.5 size-3 rounded-full transition-all",
              on ? "left-3.5" : "left-0.5",
            )}
          />
        </span>
      </span>
      <span className="text-muted mt-0.5 text-[10px] leading-snug">{sub}</span>
    </button>
  );
}

export function BuildPipeline() {
  const [s, set] = useSceneState<FreshState>();
  const stage = stageOf(s);
  const q = Math.min(s.q, QUESTIONS.length - 1);
  const r = data[stage][q];
  const topIds = r.top.map((t) => t.id);
  const shown = CIRCULARS.map((c) => {
    const indexed = s.sync ? !(s.del && !c.inSource) : c.indexedBefore;
    const status = s.sync ? c.statusNow : "current";
    const filtered = indexed && s.sync && s.filter && status !== "current";
    return { c, indexed, status, filtered };
  });
  return (
    <StepLayout
      eyebrow="Build · real answers"
      title="Keep the index honest"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface-2 rounded-xl border p-2 text-[11px]">
            <p className="font-medium">What changed on 1 September 2026</p>
            <p className="text-muted">
              Circular 22/2026 raises the mixed-waste fine to ₹500 and moves bulk-pickup booking to
              the portal. It supersedes 14/2026. Circular 9/2025 (phone bookings) is withdrawn and
              removed from the source folder.
            </p>
          </div>
          <div className="flex flex-wrap items-stretch gap-1.5">
            <Block
              on={s.sync}
              label="1 · Sync changes"
              sub="Add new files, update the metadata of changed ones"
              onToggle={() => set({ sync: !s.sync })}
            />
            <ArrowRight className="text-muted hidden size-4 self-center sm:block" />
            <Block
              on={s.del && s.sync}
              disabled={!s.sync}
              label="2 · Apply deletions"
              sub="Remove chunks of files gone from the source"
              onToggle={() => set({ del: !s.del })}
            />
            <ArrowRight className="text-muted hidden size-4 self-center sm:block" />
            <Block
              on={s.filter && s.sync}
              disabled={!s.sync}
              label="3 · Filter at query time"
              sub="Search only chunks with status = current"
              onToggle={() => set({ filter: !s.filter })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-muted text-[11px]">
              The index (circulars only; five other help pages sit alongside)
            </p>
            {shown.map(({ c, indexed, status, filtered }) => (
              <motion.div
                key={c.id}
                layout
                className={cn(
                  "border-line bg-surface flex flex-col gap-1 rounded-lg border px-2.5 py-1.5 text-[11px]",
                  !indexed && "border-dashed opacity-40",
                  filtered && "opacity-50",
                  topIds.includes(c.id) && indexed && !filtered && "border-accent",
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={cn("font-medium", !indexed && "line-through")}>{c.title}</span>
                  {indexed && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] font-medium",
                        STATUS_STYLE[status],
                      )}
                    >
                      status: {status}
                    </span>
                  )}
                  <span className="text-muted text-[9px]">effective {c.effectiveFrom}</span>
                  {!indexed && (
                    <span className="text-muted text-[9px]">
                      {c.indexedBefore ? "deleted" : "not indexed yet"}
                    </span>
                  )}
                  {filtered && <span className="text-muted text-[9px]">hidden by the filter</span>}
                  {topIds.includes(c.id) && indexed && !filtered && (
                    <span className="bg-accent text-accent-fg rounded px-1.5 py-0.5 text-[9px]">
                      retrieved #{topIds.indexOf(c.id) + 1}
                    </span>
                  )}
                </div>
                <span className="text-muted">{c.text}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {QUESTIONS.map((x, i) => (
              <button
                key={x.q}
                type="button"
                aria-pressed={q === i}
                onClick={() => set({ q: i })}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs",
                  q === i
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {data[stage][i].ok ? (
                  <Check className="text-good size-3.5 shrink-0" />
                ) : (
                  <X className="text-bad size-3.5 shrink-0" />
                )}
                {x.q}
              </button>
            ))}
          </div>
          <motion.div
            key={stage + q}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm",
              r.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            <p className="text-muted text-[10px] tracking-wide uppercase">
              Assistant&apos;s answer
            </p>
            <p>{r.answer}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        The index was built in August. Then the rules changed. Switch on each part of a sync
        pipeline and ask both questions after each change.
      </p>
      <p>
        Syncing alone isn&apos;t enough. The new circular is retrieved, but so is the old one it
        replaced, and the model picks the old fine. Removing withdrawn files, or{" "}
        <Term id="metadata-filter">filtering on metadata</Term> such as <code>status</code>, is what
        makes the answers right.
      </p>
      <p className="text-muted text-sm">
        Retrieval (multilingual-e5-small) and answers (Phi-4-mini) are real for each state. The
        filter keeps superseded circulars in the index for history but out of search.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What to store with each chunk ----------------------------------------------------------- */

const FIELDS: [string, string, string][] = [
  [
    "doc_id",
    '"circ-22-2026"',
    "A stable ID for the source document, so a changed file replaces its old chunks instead of adding duplicates.",
  ],
  [
    "title",
    '"Circular 22/2026: Revised fines…"',
    "Shown as the citation, and often added to the chunk text itself (module 4).",
  ],
  [
    "issued / effective_from",
    '"2026-08-20" / "2026-09-01"',
    "Lets you filter or rank by date, and answer “what applied in July?”",
  ],
  [
    "status",
    '"current"',
    "current, superseded or withdrawn: the field the filter in the previous step used.",
  ],
  ["department", '"Solid waste"', "Scopes search to one area when the question makes that clear."],
  ["language", '"en"', "Pick passages in the reader's language, or balance several (module 7)."],
  [
    "content_hash",
    '"9f2c…"',
    "A fingerprint of the text: if it hasn't changed, skip re-embedding it.",
  ],
  ["access", '["public"]', "Who may see it: checked at retrieval time (module 20)."],
];

export function MetadataCard() {
  const [s, set] = useSceneState<FreshState>();
  const f = FIELDS.find((x) => x[0] === s.field) ?? FIELDS[3];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What to store with each chunk"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code className="text-xs">
            {"{\n"}
            {FIELDS.map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ field: k })}
                className={cn(
                  "block w-full rounded px-1 text-left",
                  s.field === k ? "bg-accent-soft text-accent" : "hover:bg-surface",
                )}
              >
                {`  "${k}": ${v},`}
              </button>
            ))}
            {'  "text": "From 1 September 2026, the fine…"\n}'}
          </Code>
          <FrameCaption frameKey={f[0]} title={f[0]}>
            {f[2]}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Every chunk is stored with its vector, its text and a small record of{" "}
        <Term id="chunk-metadata">metadata</Term>. Tap a field to see what it&apos;s for.
      </p>
      <p>
        Every vector database and managed RAG service supports metadata of this kind, under
        different names. Decide the fields before you index: adding them later means re-indexing
        everything.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which mechanism? ------------------------------------------------------------------------------ */

export function WhichMechanism() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which mechanism?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="fresh-which"
            prompt="Which mechanism handles each situation?"
            categories={[
              { id: "sync", label: "Sync" },
              { id: "delete", label: "Delete" },
              { id: "filter", label: "Filter" },
            ]}
            items={[
              {
                id: "new",
                label: "A new circular is published",
                category: "sync",
                why: "Detect the new file, parse, chunk, embed and add it.",
              },
              {
                id: "withdrawn",
                label: "A circular is withdrawn and must never be quoted again",
                category: "delete",
                why: "Remove its chunks from the index, not just the file from the folder.",
              },
              {
                id: "history",
                label:
                  "A revised circular replaces an old one, but staff still need the old one for past cases",
                category: "filter",
                why: "Keep it, marked superseded, and filter it out of normal citizen search.",
              },
              {
                id: "erasure",
                label: "A resident asks for their complaint records to be erased",
                category: "delete",
                why: "Erasure must reach every copy, including chunks and their vectors in the index.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Four situations from a real deployment. Which part of the pipeline handles each?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Stale is silent", "Old rules retrieve as easily as new ones; nothing warns you."],
  ["Sync, delete, filter", "Add and update changes, remove what's gone, filter what's superseded."],
  ["Stable IDs and hashes", "Replace a document's chunks cleanly, and skip unchanged text."],
  [
    "Deletion means everywhere",
    "The file, its chunks, its vectors and any caches. Removing a file from a folder doesn't tell the index.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Freshness is mostly plumbing: a scheduled sync that notices new, changed and deleted files,
        plus a few metadata fields you can filter on. It&apos;s unglamorous, and it&apos;s where
        many real assistants go wrong.
      </p>
      <p className="text-muted text-sm">
        Filter <em>during</em> search where you can. If the index first finds its 40 nearest chunks
        and then applies a filter that only 10% of chunks match, about 4 survive (the pgvector
        docs&apos; own example). Most vector databases now support filtering during the search
        itself.
      </p>
      <p className="text-muted text-sm">
        India&apos;s DPDP Act gives people a right to erasure (section 12) and requires erasing
        personal data once its purpose is served (section 8(7)); under the 2025 Rules these duties
        apply from May 2027. For RAG that means chunks and vectors too: researchers have rebuilt 92%
        of short texts exactly from their embeddings (Morris et al., 2023).
      </p>
      <p>Next chapter: how search itself works, starting with keywords.</p>
    </StepLayout>
  );
}
