"use client";

import { motion } from "motion/react";
import { Check, Minus, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { GOLDEN, OUTCOMES, SERVICES, SITUATIONS, SOURCES, TABLES, type Mode } from "./model";
import type { DoState } from "./state";

/* 1 ─ One spreadsheet for everyone ---------------------------------------------------------------- */

export function SharedSheet() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One spreadsheet for everyone"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface overflow-hidden rounded-xl border font-mono text-[11px]">
            <div className="bg-surface-2 grid grid-cols-4 gap-2 px-3 py-1.5 font-semibold">
              <span>customer</span>
              <motion.span
                initial={{ color: "inherit" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1 }}
                className="text-bad"
              >
                amt → amount_paise
              </motion.span>
              <span>status</span>
              <span>region</span>
            </div>
            {["C-81", "C-82", "C-83"].map((c) => (
              <div key={c} className="border-line grid grid-cols-4 gap-2 border-t px-3 py-1">
                <span>{c}</span>
                <span>…</span>
                <span>paid</span>
                <span>south</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            {["Sales dashboard", "Finance macro", "Marketing export"].map((t) => (
              <span key={t} className="border-bad/50 bg-bad/10 rounded-md border px-2 py-1.5">
                {t}: broken
              </span>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A company keeps one shared spreadsheet that every department reads and edits. One day
        finance renames a column to make it clearer. Sales&apos; dashboard, a marketing export and
        someone&apos;s macro all break, and nobody knew they depended on it.
      </p>
      <p>
        That&apos;s a shared database, which Martin Fowler calls an{" "}
        <Term id="integration-database">integration database</Term>: &ldquo;the database becomes a
        point of coupling between the applications that access it.&rdquo; His conclusion: most
        architects he respects &ldquo;take the view that integration databases should be
        avoided.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Untangle a shared database ⭐ --------------------------------------------------------------- */

export function Untangle() {
  const [s, set] = useSceneState<DoState>();
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Untangle a shared database"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Mode>
            size="sm"
            value={s.mode}
            onChange={(mode) => set({ mode })}
            options={[
              ["shared", "One shared database"],
              ["owned", "Each service owns its data"],
            ]}
          />
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {TABLES.map((t) => (
              <div
                key={t.t}
                className="border-line bg-surface rounded-lg border px-2.5 py-1.5 text-[11px]"
              >
                <p className="font-mono font-semibold">{t.t}</p>
                {s.mode === "shared" ? (
                  <p className="text-bad">read by {[t.owner, ...t.readers].join(", ")}</p>
                ) : (
                  <>
                    <p className="text-good">owned by {t.owner}</p>
                    <p className="text-muted">others: API or events</p>
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">Services: {SERVICES.join(", ")}</p>
          <div className="flex flex-col gap-1.5">
            {OUTCOMES[s.mode].map(([v, text], i) => (
              <motion.div
                key={s.mode + i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className={cn(
                  "flex gap-2 rounded-lg border px-3 py-2",
                  v === "good"
                    ? "border-good/40 bg-good/5"
                    : v === "bad"
                      ? "border-bad/40 bg-bad/5"
                      : "border-line bg-surface",
                )}
              >
                {v === "good" ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : v === "bad" ? (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <Minus className="text-muted mt-0.5 size-3.5 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-semibold">{SITUATIONS[i]}</p>
                  <p className="text-muted text-[11px]">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Five services share four tables. Flip to{" "}
        <Term id="database-per-service">database per service</Term> and put both designs through the
        same four situations.
      </p>
      <p>
        Chris Richardson&apos;s rule: keep each service&apos;s data &ldquo;private to that service
        and accessible only via its API.&rdquo; That needn&apos;t mean a database server each;
        private tables or a private schema count. The price is real: transactions and joins across
        services get harder, and need the sagas and read models from modules 11 and 15.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The golden customer record ------------------------------------------------------------------ */

export function Golden() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The golden customer record"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5">
            {SOURCES.map((r, i) => (
              <motion.div
                key={r.sys}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface grid grid-cols-[6.5rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-[11px] sm:grid-cols-[7rem_1fr_6rem_7rem]"
              >
                <span className="font-semibold">{r.sys}</span>
                <span>{r.name}</span>
                <span className="text-muted font-mono">{r.phone}</span>
                <span className="text-muted">{r.address}</span>
              </motion.div>
            ))}
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3">
            <p className="text-accent text-[10px] font-semibold uppercase">golden record</p>
            {GOLDEN.map(([f, v, why]) => (
              <p key={f} className="grid grid-cols-[4rem_1fr] gap-2 text-xs">
                <span className="text-muted">{f}</span>
                <span>
                  <span className="font-semibold">{v}</span>{" "}
                  <span className="text-subtle">· {why}</span>
                </span>
              </p>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Illustrative records and rules.</p>
        </div>
      }
    >
      <p>
        Some data really is needed everywhere: customers, products, suppliers. Gartner defines{" "}
        <Term id="master-data-management">master data management</Term> as a discipline in which
        business and IT work together on &ldquo;the enterprise&apos;s official shared master data
        assets&rdquo;.
      </p>
      <p>
        The output is a <Term id="golden-record">golden record</Term>, &ldquo;the best version of
        the truth&rdquo; in Informatica&apos;s words, built from every source by agreed rules, and
        fed back to the systems that need it. It&apos;s Priya from module 1, finally with one
        correct address.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Data mesh, for analytics -------------------------------------------------------------------- */

const PRINCIPLES: [string, string][] = [
  [
    "Domain-oriented decentralized data ownership",
    "The team that runs payments also publishes payments data for analysis.",
  ],
  [
    "Data as a product",
    "Documented, discoverable, trustworthy, with an owner who cares about its users.",
  ],
  [
    "Self-serve data infrastructure as a platform",
    "A platform team makes publishing a data product easy.",
  ],
  [
    "Federated computational governance",
    "Shared rules (privacy, formats) agreed centrally and enforced automatically.",
  ],
];

export function Mesh() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Data mesh, for analytics"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PRINCIPLES.map(([t, d], i) => (
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
          <p className="border-line bg-surface-2 rounded-lg px-3 py-2 text-xs">
            Cautions: Thoughtworks&apos; Technology Radar rated it Trial at most, warning of a
            &ldquo;high cost of integration&rdquo;; Gartner&apos;s 2022 data management Hype Cycle
            rated it &ldquo;obsolete before plateau&rdquo;, a call its supporters disputed.
          </p>
        </div>
      }
    >
      <p>
        For analytical data, the central data team can become the same bottleneck as the ESB team in
        module 12. Zhamak Dehghani&apos;s <Term id="data-mesh">data mesh</Term> (2019; principles
        set out in 2020; book 2022) applies bounded contexts to analytics: each domain publishes{" "}
        <Term id="data-product">data products</Term>.
      </p>
      <p>
        It&apos;s about analytical data, not the operational databases above, and it&apos;s mostly
        an organisational change. Dehghani intended the four principles to be &ldquo;collectively
        necessary and sufficient&rdquo;; adopting only the technology rarely works.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Where should it live? ----------------------------------------------------------------------- */

export function WhoOwns() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where should it live?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="who-owns"
            prompt="How should each kind of data be owned?"
            categories={[
              { id: "service", label: "One service owns it" },
              { id: "mdm", label: "Master data" },
              { id: "product", label: "Analytical data product" },
            ]}
            items={[
              {
                id: "lines",
                label: "The lines of each order",
                category: "service",
                why: "Belongs to Orders; others ask through its API.",
              },
              {
                id: "tracking",
                label: "A parcel's current tracking status",
                category: "service",
                why: "Owned by Shipping.",
              },
              {
                id: "identity",
                label: "Customer identity used by 30 systems",
                category: "mdm",
                why: "Core shared entity: a golden record.",
              },
              {
                id: "catalogue",
                label: "The product list shared by stores, warehouses and the website",
                category: "mdm",
                why: "Master data many systems depend on.",
              },
              {
                id: "sales",
                label: "Monthly sales by region for analysts",
                category: "product",
                why: "Analytical data, published by its domain.",
              },
            ]}
            explanation="Operational data belongs to one service; core shared entities need master data management; analytical data can be published as domain data products."
          />
        </div>
      }
    >
      <p>Decide the right home for each.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Avoid integration databases", "Shared tables couple everyone to everyone."],
  ["Each service owns its data", "Others use its API or its events."],
  ["Pay the price knowingly", "Sagas for transactions, read models for joins."],
  ["Master data for shared entities", "A golden record, fed back to the systems."],
  ["Data mesh for analytics", "Domains publish data products; mostly an organisational change."],
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
        That&apos;s the styles chapter. The last chapter is about changing systems you can&apos;t
        switch off, starting with the strangler fig.
      </p>
    </StepLayout>
  );
}
