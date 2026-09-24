"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { cn } from "@/lib/cn";
import { DECISIONS, REQUIREMENTS, requirementStatus } from "./data";
import { Checklist } from "./steps-design";
import type { DesignState } from "./state";

/* 5 ─ Your architecture -------------------------------------------------------------------------- */

const SHORT: Record<string, Record<string, string>> = {
  platform: {
    cloud: "Managed cloud services (India region)",
    vendor: "Vendor platform on a cloud (India region)",
    selfhost: "Self-hosted open source",
  },
  format: { iceberg: "Apache Iceberg", delta: "Delta Lake", hudi: "Apache Hudi" },
  ingest: {
    nightly: "Nightly full export",
    cdc: "Log-based CDC → minute MERGEs",
    dual: "App dual-writes to Kafka",
  },
  layout: {
    account: "Partitioned by account",
    "day-cluster": "By day, clustered by account",
    hour: "Partitioned by hour",
  },
  filings: {
    rerun: "Re-run queries",
    tag: "Tagged snapshots per filing",
    csv: "CSV archives per filing",
  },
  privacy: {
    open: "Open silver access",
    masks: "Masks, row filters, tokens in gold",
    "anon-copy": "Nightly anonymised copy",
  },
  upkeep: {
    none: "No maintenance",
    managed: "Automatic compaction & expiry",
    weekly: "Weekly compaction",
  },
};

function Box({ label, value, tone }: { label: string; value?: string; tone?: string }) {
  return (
    <div
      className={cn("rounded-xl border px-3 py-2 text-center", tone ?? "border-line bg-surface")}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <p className="text-xs font-semibold">{value ?? "not decided"}</p>
    </div>
  );
}

export function YourArchitecture() {
  const [s] = useSceneState<DesignState>();
  const c = s.choices;
  const pick = (d: string) => (c[d] ? SHORT[d][c[d]] : undefined);
  const verdict = (d: string) =>
    DECISIONS.find((x) => x.id === d)?.options.find((o) => o.id === c[d])?.verdict;
  const tone = (d: string) =>
    verdict(d) === "risky"
      ? "border-bad/50 bg-bad/5"
      : verdict(d) === "workable"
        ? "border-viz-compute/50 bg-viz-compute/5"
        : verdict(d)
          ? "border-good/40 bg-good/5"
          : "border-line border-dashed";
  const status = requirementStatus(c);
  const gaps = REQUIREMENTS.filter((r) => status[r.id] === "risk" || status[r.id] === "open");
  const partial = REQUIREMENTS.filter((r) => status[r.id] === "partial");
  const undecided = DECISIONS.filter((d) => !c[d.id]);

  return (
    <StepLayout
      eyebrow="Your design"
      title="Your architecture"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="flex flex-col items-stretch gap-1.5">
              <Box label="Platform" value={pick("platform")} tone={tone("platform")} />
              <Box label="Source" value="Core banking database" />
              <ArrowDown className="text-subtle mx-auto size-4" />
              <Box label="Ingestion" value={pick("ingest")} tone={tone("ingest")} />
              <ArrowDown className="text-subtle mx-auto size-4" />
              <div className="grid grid-cols-3 gap-1.5">
                {["Bronze", "Silver", "Gold"].map((l, i) => (
                  <motion.div
                    key={l}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-center text-xs font-semibold",
                      i === 0
                        ? "border-tier-bronze/50"
                        : i === 1
                          ? "border-tier-silver/50"
                          : "border-tier-gold/50",
                    )}
                  >
                    {l}
                    <span className="text-muted block text-[10px] font-normal">
                      {pick("format") ?? "format?"}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                <Box label="Transactions layout" value={pick("layout")} tone={tone("layout")} />
                <Box label="Upkeep" value={pick("upkeep")} tone={tone("upkeep")} />
              </div>
              <ArrowDown className="text-subtle mx-auto size-4" />
              <div className="grid gap-1.5 sm:grid-cols-2">
                <Box label="Compliance filings" value={pick("filings")} tone={tone("filings")} />
                <Box label="Analysts & privacy" value={pick("privacy")} tone={tone("privacy")} />
              </div>
            </div>
            <Checklist choices={c} />
          </div>

          <div
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              undecided.length
                ? "border-line bg-surface"
                : gaps.length
                  ? "border-bad/40 bg-bad/10"
                  : partial.length
                    ? "border-viz-compute/40 bg-viz-compute/10"
                    : "border-good/40 bg-good/10",
            )}
          >
            {undecided.length ? (
              <p>
                Still to decide: {undecided.map((d) => d.title.toLowerCase()).join(", ")}. Go back a
                step to finish the design.
              </p>
            ) : gaps.length ? (
              <>
                <p className="font-semibold">Before this goes to the board</p>
                <ul className="text-muted mt-1 list-disc pl-5">
                  {gaps.map((g) => (
                    <li key={g.id}>
                      &ldquo;{g.label}&rdquo; is at risk. Revisit the decision that affects it.
                    </li>
                  ))}
                </ul>
              </>
            ) : partial.length ? (
              <>
                <p className="font-semibold">Nearly there</p>
                <p className="text-muted mt-1">
                  Every requirement is covered, but a reviewer would push on:{" "}
                  {partial.map((g) => `“${g.label}”`).join(", ")}. The amber boxes show which
                  decisions to strengthen.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">Ready for the board</p>
                <p className="text-muted mt-1">
                  Fraud sees transactions within minutes through CDC, filings are pinned to tagged
                  snapshots, members&apos; data is masked by the catalog, and tables stay fast with
                  a sensible layout and automatic upkeep, all in India, run by six people.
                </p>
              </>
            )}
          </div>
        </div>
      }
    >
      <p>
        Here&apos;s the lakehouse you designed. Amber and red boxes are the ones a reviewer would
        question.
      </p>
      <p className="text-muted text-sm">
        Real designs are never finished: the next module starts with a lakehouse that looked fine on
        paper and went wrong in production.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Start from requirements",
    "Freshness, reproducibility, privacy, team size and budget decide the design, not fashion.",
  ],
  [
    "Every chapter showed up",
    "Formats, CDC, layout, time travel, governance and maintenance all shaped one system.",
  ],
  [
    "Most choices are trade-offs",
    "Several answers are workable; what matters is knowing what each costs.",
  ],
  [
    "Write the reasons down",
    "A design with its reasons can be defended to a board and changed safely later.",
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
      <p>You&apos;ve designed a lakehouse end to end.</p>
      <p>Last module: a lakehouse in trouble, and you&apos;re called in to fix it.</p>
    </StepLayout>
  );
}
