"use client";

import { motion } from "motion/react";
import { Search, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ID_LABEL, SYSTEMS, TOOLS, type IdKind } from "./model";
import type { MapState } from "./state";

/* 1 ─ Story: moving house -------------------------------------------------------------------------- */

const ROOMS = [
  ["Living room", "what you think you own"],
  ["The loft", "boxes you forgot"],
  ["A friend's garage", "things you lent out"],
  ["The old flat", "copies you never cleared"],
];

export function MovingHouse() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Packing to move"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="grid w-full max-w-md grid-cols-2 gap-2">
            {ROOMS.map(([room, sub], i) => (
              <motion.div
                key={room}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 * i }}
                className={cn(
                  "rounded-xl border p-3",
                  i === 0
                    ? "border-line bg-surface"
                    : "border-accent/60 bg-accent-soft border-dashed",
                )}
              >
                <p className="text-sm font-semibold">{room}</p>
                <p className="text-muted text-[11px]">{sub}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-subtle text-[11px]">Only one of these is on your list.</p>
        </div>
      }
    >
      <p>
        When you move house you list what you own, and then the surprises start: boxes in the loft,
        a drill a friend borrowed, things left at the old flat. You can&apos;t pack, or throw away,
        what you don&apos;t know you have.
      </p>
      <p>
        Personal data is the same. Teams believe it lives in &ldquo;the database&rdquo;. In practice
        it also sits in logs, third-party tools, copies and backups. A{" "}
        <Term id="data-map">data map</Term> lists each kind of personal data, every place it lives,
        why it&apos;s there and how long it stays. The Act doesn&apos;t name the document, but you
        can&apos;t answer a rights request, erase on time or report a breach without it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Hunt ⭐ -------------------------------------------------------------------------------------- */

export function Hunt() {
  const [s, set] = useSceneState<MapState>();
  const sel = SYSTEMS.find((x) => x.id === s.selected) ?? SYSTEMS[0];
  const seen = new Set(s.inspected);
  const inspect = (id: string) =>
    set({ selected: id, inspected: seen.has(id) ? s.inspected : [...s.inspected, id] });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Where does it hide?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">
            SabziBox, a made-up grocery app · inspected {seen.size}/{SYSTEMS.length}
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {SYSTEMS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === sel.id}
                onClick={() => inspect(x.id)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-left text-xs transition",
                  x.id === sel.id && "ring-accent ring-2",
                  seen.has(x.id)
                    ? "border-accent/60 bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <span className="flex items-center gap-1 font-medium">
                  {seen.has(x.id) ? (
                    <Check className="text-accent size-3" />
                  ) : (
                    <Search className="text-subtle size-3" />
                  )}
                  {x.name}
                </span>
                <span className="text-subtle block text-[10px]">
                  {x.kind === "core"
                    ? "core system"
                    : x.kind === "tool"
                      ? "third-party tool"
                      : "copy"}
                </span>
              </button>
            ))}
          </div>
          {seen.has(sel.id) && (
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface rounded-xl border p-3 text-xs"
            >
              <p>
                <span className="text-muted">The team thought: </span>
                {sel.believed}
              </p>
              <p className="mt-1">
                <span className="text-accent font-medium">Inspection found: </span>
                {sel.found}
              </p>
            </motion.div>
          )}
          <div className="border-line overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[30rem] text-left text-[11px]">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-2 py-1 font-medium">Where</th>
                  <th className="px-2 py-1 font-medium">What</th>
                  <th className="px-2 py-1 font-medium">Why</th>
                  <th className="px-2 py-1 font-medium">How long</th>
                </tr>
              </thead>
              <tbody>
                {SYSTEMS.filter((x) => seen.has(x.id)).map((x) => (
                  <tr key={x.id} className="border-line border-t">
                    <td className="px-2 py-1 font-medium">
                      {x.name}
                      {x.vendor && (
                        <span className="text-subtle block text-[10px]">
                          {x.vendor} (processor)
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1">{x.data}</td>
                    <td className="px-2 py-1">{x.purpose}</td>
                    <td className="px-2 py-1">{x.keep}</td>
                  </tr>
                ))}
                {seen.size === 0 && (
                  <tr>
                    <td colSpan={4} className="text-subtle px-2 py-3 text-center">
                      Inspect a system to start the data map.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      }
    >
      <p>
        SabziBox&apos;s team says personal data lives in the orders database. Inspect each system
        and see what&apos;s really there. Every finding adds a row to the data map.
      </p>
      <p>
        Notice the patterns: debug logging, SDKs that collect more than you asked for, copies made
        &ldquo;just for now&rdquo;, and backups that still hold people who asked to leave. Vendors
        that hold data for you are your <Term id="data-processor">processors</Term>, and they belong
        on the map too.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Scanners and their limits ------------------------------------------------------------------- */

const KINDS: IdKind[] = ["aadhaar", "pan", "passport", "voter", "gstin", "upi"];

export function Scanners() {
  const [s, set] = useSceneState<MapState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Can a scanner find it for you?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">Pick an Indian identifier</p>
          <div className="flex flex-wrap gap-1">
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.idKind === k}
                onClick={() => set({ idKind: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  s.idKind === k
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted hover:text-fg",
                )}
              >
                {ID_LABEL[k]}
              </button>
            ))}
          </div>
          <div className="grid gap-1.5">
            {TOOLS.map((t) => {
              const yes = t.covers.includes(s.idKind);
              return (
                <div
                  key={t.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-3 py-2 text-xs",
                    yes ? "border-good/40 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  {yes ? (
                    <Check className="text-good mt-0.5 size-4 shrink-0" />
                  ) : (
                    <X className="text-subtle mt-0.5 size-4 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {t.name} <span className="text-subtle font-normal">· {t.who}</span>
                    </p>
                    <p className="text-muted">{t.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-subtle text-[10px]">
            Built-in detectors only, from each vendor&apos;s documentation in October 2026. All of
            them can add custom patterns.
          </p>
        </div>
      }
    >
      <p>
        Scanning tools help: AWS, Google Cloud and Microsoft each have one, and Presidio is an
        open-source option. They match patterns such as the 12-digit Aadhaar number, with checks to
        cut false alarms.
      </p>
      <p>
        But coverage of Indian identifiers is uneven, none of them knows a UPI ID out of the box,
        and they only see the places you point them at. Scanners speed up a data map; they
        don&apos;t replace walking through each data flow with the people who built it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Aadhaar, a special case --------------------------------------------------------------------- */

const AADHAAR = {
  full: {
    shown: "1234 5678 9012",
    verdict: "Avoid",
    body: "Aadhaar rules say a number must never be displayed publicly, and anyone holding numbers must keep them secure. Most apps have no reason to keep the full number at all.",
    tone: "bad",
  },
  masked: {
    shown: "XXXX XXXX 9012",
    verdict: "Usually the right answer",
    body: "Keep only the last four digits, the way UIDAI's own masked Aadhaar does. That's enough to match a document without holding the whole number. Example digits are made up.",
    tone: "good",
  },
  hashed: {
    shown: "3f9a…c21e",
    verdict: "Looks safe, isn't",
    body: "There are only about a trillion possible 12-digit numbers, so a fast computer can hash them all and reverse yours. A hash of Aadhaar is still personal data. UIDAI even bans hashes as reference keys in its vault rules.",
    tone: "bad",
  },
} as const;

export function AadhaarCase() {
  const [s, set] = useSceneState<MapState>();
  const a = AADHAAR[s.aadhaar];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Aadhaar in a support ticket"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.aadhaar}
            onChange={(v) => set({ aadhaar: v })}
            options={[
              ["full", "Store it as sent"],
              ["masked", "Mask it"],
              ["hashed", "Hash it"],
            ]}
            size="sm"
          />
          <motion.div
            key={s.aadhaar}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border p-4",
              a.tone === "good" ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            <p className="font-mono text-lg tracking-wider">{a.shown}</p>
            <p className="mt-2 text-sm font-semibold">{a.verdict}</p>
            <p className="mt-1 text-sm">{a.body}</p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            UIDAI&apos;s separate &ldquo;Aadhaar Data Vault&rdquo; rule applies only to
            organisations that use UIDAI authentication or e-KYC.
          </p>
        </div>
      }
    >
      <p>
        SabziBox&apos;s support desk is full of Aadhaar card photos. What should it keep? Try each
        option.
      </p>
      <p>
        The same thinking applies to logs. From May 2027 the Rules require keeping processing logs
        for a year, so the fix for phone numbers in logs isn&apos;t deleting the logs early;
        it&apos;s masking or tokenising identifiers before they&apos;re written.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function MapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Does it belong on the map?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-map"
            prompt="Which of these hold personal data that belongs on SabziBox's data map?"
            categories={[
              { id: "yes", label: "On the map" },
              { id: "no", label: "Not personal data" },
            ]}
            items={[
              {
                id: "logs",
                label: "Request logs with phone numbers in the URLs",
                category: "yes",
                why: "Phone numbers identify people.",
              },
              {
                id: "counts",
                label: "A chart of total orders per day across all customers",
                category: "no",
                why: "Aggregated with no way to single anyone out.",
              },
              {
                id: "hashes",
                label: "A table of hashed Aadhaar numbers",
                category: "yes",
                why: "Hashes of short identifiers can be reversed; still personal data.",
              },
              {
                id: "catalogue",
                label: "The product catalogue and prices",
                category: "no",
                why: "No people in it.",
              },
              {
                id: "crash",
                label: "Crash reports that include the logged-in user's email",
                category: "yes",
                why: "Email addresses identify people.",
              },
              {
                id: "backup",
                label: "Backups holding customers who deleted their accounts",
                category: "yes",
                why: "Copies count, including old ones.",
              },
            ]}
            explanation="If a person can be identified from it, directly or by linking, it's personal data and belongs on the map, wherever it lives."
          />
        </div>
      }
    >
      <p>Sort each item.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Map before you build", "What, where, why, how long, and which vendors."],
  ["Look past the database", "Logs, SDKs, support tools, warehouses, copies, backups."],
  ["Scanners help, people decide", "Coverage of Indian identifiers is patchy."],
  ["Mask, don't just hash", "Short identifiers like Aadhaar can be reversed."],
  ["Keep it current", "Every new feature or vendor changes the map."],
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
        That ends the big picture. Next chapter: lawful processing, starting with the notice you
        must give before asking anyone for their data.
      </p>
    </StepLayout>
  );
}
