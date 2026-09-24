"use client";

import { motion } from "motion/react";
import { Scale } from "lucide-react";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";

/* 5 ─ Controls and plumbing ------------------------------------------------------------------------ */

const CONTROLS: { title: string; items: [string, string][] }[] = [
  {
    title: "Access control",
    items: [
      [
        "Unity Catalog",
        "GRANTs on catalogs, schemas and tables; row filters and column masks; attribute-based policies (ABAC).",
      ],
      [
        "AWS Lake Formation",
        "Data filters for column, row and cell-level security, enforced by integrated engines such as Athena, Redshift Spectrum and Spark on EMR.",
      ],
      ["Snowflake", "Masking policies and row access policies (Enterprise Edition and above)."],
      ["BigQuery", "Column-level security via policy tags, row access policies and data masking."],
    ],
  },
  {
    title: "Plumbing",
    items: [
      [
        "Encryption",
        "S3 has encrypted every new object by default since January 2023; Google Cloud Storage and Azure Storage always encrypt. Customer-managed keys (KMS) add control over who can decrypt.",
      ],
      [
        "Audit",
        "Who read or changed what, and when: e.g. Unity Catalog's audit system table (in preview) or AWS CloudTrail.",
      ],
      [
        "Lineage",
        "Which tables and columns feed which: Unity Catalog lineage tables; OpenLineage is the open standard, with Marquez as its reference implementation.",
      ],
    ],
  },
];

export function ControlsPlumbing() {
  return (
    <StepLayout
      eyebrow="In practice"
      title="Controls and plumbing"
      stage={
        <div className="grid flex-1 content-start gap-4">
          {CONTROLS.map((g) => (
            <div key={g.title}>
              <p className="text-muted mb-2 text-xs font-medium">{g.title}</p>
              <div className="grid gap-2 md:grid-cols-2">
                {g.items.map(([name, body], i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="border-line bg-surface rounded-xl border p-3"
                  >
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-muted mt-0.5 text-xs">{body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          <Code className="text-[10px] whitespace-pre-wrap">
            {
              "-- Unity Catalog: a row filter and a column mask\nALTER TABLE customers SET ROW FILTER region_filter ON (region);\nALTER TABLE customers ALTER COLUMN phone SET MASK mask_phone;"
            }
          </Code>
        </div>
      }
    >
      <p>
        Every platform offers the same building blocks under different names. What you saw with the
        four roles is available almost everywhere.
      </p>
      <p>
        Encryption, audit and lineage are the plumbing underneath. Lineage matters most in the next
        step: to erase someone&apos;s data, you first have to know where it flowed.
      </p>
      <p className="text-subtle text-xs">
        Availability as of September 2026; check each platform&apos;s current docs.
      </p>
    </StepLayout>
  );
}

/* 6 ─ The law in brief -------------------------------------------------------------------------------- */

const DPDP: string[] = [
  "Roles: the Data Principal (the person), the Data Fiduciary (decides why and how data is processed) and Data Processors acting for it.",
  "Section 12: the right to correction and erasure. On request, erase unless keeping it is needed for the specified purpose or required by law.",
  "Section 8(7): erase when consent is withdrawn or the purpose is no longer served, and make processors erase too, unless a law requires retention.",
  "The DPDP Rules (notified November 2025) bring most duties, including these, into force on 13 May 2027. Some large platforms must also erase after 3 years of inactivity, with 48 hours' notice, and keep processing logs for at least a year.",
  "Penalties are ceilings set by the Data Protection Board: up to ₹250 crore for failing to keep reasonable security safeguards, up to ₹50 crore for most other breaches.",
];

const GDPR: string[] = [
  "Article 17: the right to erasure, “without undue delay”, when a listed ground applies.",
  "Article 12(3): respond within one month, extendable by two further months.",
  "Article 17(3): exceptions include legal obligations and legal claims.",
  "Recital 26: pseudonymised data is still personal data; truly anonymous data is out of scope.",
];

export function LawInBrief() {
  return (
    <StepLayout
      eyebrow="The rules"
      title="Privacy law, in brief"
      stage={
        <div className="grid flex-1 content-start gap-3 md:grid-cols-2">
          <LawCard title="India: Digital Personal Data Protection Act, 2023" points={DPDP} />
          <LawCard title="EU: General Data Protection Regulation" points={GDPR} />
          <p className="border-viz-compute/40 bg-viz-compute/10 rounded-xl border px-4 py-3 text-xs md:col-span-2">
            <Scale className="text-viz-compute mr-1.5 inline size-4" />
            This is an engineer&apos;s orientation, not legal advice. Decisions about what to erase,
            what the law requires you to keep, and for how long belong to your legal and privacy
            team.
          </p>
        </div>
      }
    >
      <p>
        Privacy laws give people rights over data about them. For engineers, the one with the
        biggest technical impact is the right to have data <em>erased</em>.
      </p>
      <p>
        India&apos;s <Term id="dpdp">DPDP Act</Term> and Europe&apos;s GDPR share the core idea:
        erase personal data when asked, or when it&apos;s no longer needed, unless another law
        requires keeping it (a bank&apos;s KYC records, for example).
      </p>
    </StepLayout>
  );
}

function LawCard({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-4">
      <p className="font-semibold">{title}</p>
      <ul className="text-muted mt-2 grid gap-1.5 text-xs leading-relaxed">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="bg-accent mt-1.5 size-1.5 shrink-0 rounded-full" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 7 ─ Fix the problem: find every copy ⭐ --------------------------------------------------------------- */

export function ErasureHunt() {
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Priya's erasure request"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="erasure-hunt"
            prompt="Priya has asked Brewline to erase her personal data. For each place, does it still hold her personal data?"
            categories={[
              { id: "yes", label: "Holds her data" },
              { id: "no", label: "Doesn't" },
            ]}
            items={[
              {
                id: "bronze",
                label: "bronze.customers_raw",
                category: "yes",
                why: "The raw copy has everything, exactly as it arrived.",
              },
              {
                id: "c360",
                label: "gold.customer_360",
                category: "yes",
                why: "One row per customer, hers included.",
              },
              {
                id: "city",
                label: "gold.revenue_by_city (totals of thousands of customers)",
                category: "no",
                why: "Aggregated so no individual can be identified.",
              },
              {
                id: "features",
                label: "ml.churn_features, keyed by a token instead of her ID",
                category: "yes",
                why: "Pseudonymised data is still personal data while Brewline can link the token back to her.",
              },
              {
                id: "history",
                label: "Old versions of silver.customers kept for time travel",
                category: "yes",
                why: "Until clean-up removes them, old files still contain her row.",
              },
              {
                id: "kafka",
                label: "The Kafka topic her sign-up event passed through (7-day retention)",
                category: "yes",
                why: "Until retention expires the event is still in the log.",
              },
              {
                id: "csv",
                label: "A CSV an analyst exported last month",
                category: "yes",
                why: "Copies outside the lakehouse count too. Lineage and export policies help find them.",
              },
              {
                id: "dashboard",
                label: "A dashboard showing total orders per day",
                category: "no",
                why: "Counts only, nothing about any individual.",
              },
            ]}
            explanation="Erasure is a search problem before it's a deletion problem. Lineage tells you where data flowed; retention settings tell you how long copies linger."
          />
        </div>
      }
    >
      <p>
        Here&apos;s the task: Priya closed her account and asked to be erased, and no law requires
        Brewline to keep her details. Where does her personal data still live?
      </p>
      <p>
        Sort every place. Watch out for the ones that only <em>look</em> anonymous.
      </p>
    </StepLayout>
  );
}

/* 8 ─ The erasure plan ------------------------------------------------------------------------------------ */

const PLAN: [string, string, string][] = [
  [
    "Lakehouse tables",
    "DELETE her rows from bronze, silver and gold, then rewrite files that only mark rows deleted (Delta: REORG … APPLY (PURGE); Iceberg: rewrite_data_files).",
    "DELETE FROM silver.customers WHERE customer_id = 'C-1001';",
  ],
  [
    "Old versions",
    "Let retention pass, then remove old files: Delta VACUUM, Iceberg expire_snapshots and remove_orphan_files, Hudi's cleaner. Watch for tags or branches pinning old snapshots.",
    "VACUUM silver.customers;",
  ],
  [
    "Derived data",
    "Rebuild or delete features and models keyed to her, and delete exports; track them through lineage.",
    "",
  ],
  [
    "Streams and backups",
    "Kafka copies expire with retention. Backups are usually put beyond use and overwritten on schedule rather than edited.",
    "",
  ],
  [
    "What must stay",
    "Records another law requires (invoices, tax, KYC) are kept only for that purpose and period, then erased.",
    "",
  ],
];

export function ErasurePlan() {
  return (
    <StepLayout
      eyebrow="The fix"
      title="Erasing on immutable storage"
      stage={
        <div className="grid flex-1 content-start gap-2.5">
          {PLAN.map(([title, body, code], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-meta/15 text-viz-meta grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{title}</p>
                <p className="text-muted text-sm">{body}</p>
                {code && <Code className="mt-2 text-[10px]">{code}</Code>}
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Remember from the updates-and-deletes module: a DELETE on a lakehouse table doesn&apos;t
        make bytes disappear. It changes what the current version shows.
      </p>
      <p>
        Real erasure is a plan, not a statement: delete, rewrite, wait out retention, clean up, and
        chase every copy lineage revealed. Some teams also encrypt each person&apos;s data with
        their own key and destroy the key on request (&ldquo;crypto-shredding&rdquo;); regulators
        still treat encrypted personal data as personal data, so treat it as a safeguard, not a
        substitute.
      </p>
    </StepLayout>
  );
}

/* 9 ─ Checkpoint: anonymous or not? ------------------------------------------------------------------------ */

export function AnonymousSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Personal, or anonymous?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="anonymous"
            prompt="For Brewline, which of these are still personal data?"
            categories={[
              { id: "personal", label: "Personal data" },
              { id: "anon", label: "Anonymous" },
            ]}
            items={[
              {
                id: "hash",
                label: "A hashed email, where Brewline can hash any email to find the match",
                category: "personal",
                why: "Pseudonymised: Brewline can re-identify it, so it's still personal data.",
              },
              {
                id: "token",
                label:
                  "A customer token, with the token→customer table in another Brewline database",
                category: "personal",
                why: "Splitting the key into another database doesn't make it anonymous for the company that holds both.",
              },
              {
                id: "phone",
                label: "A phone number with no name attached",
                category: "personal",
                why: "A phone number identifies a person on its own.",
              },
              {
                id: "totals",
                label: "Revenue per city per month across thousands of customers",
                category: "anon",
                why: "Nobody can be singled out from these totals.",
              },
              {
                id: "count",
                label: "Number of orders per hour",
                category: "anon",
                why: "A count with no link to individuals.",
              },
            ]}
            explanation="Removing names isn't enough. If the organisation can link data back to a person, it is still personal data."
          />
        </div>
      }
    >
      <p>
        Engineers often assume that removing names makes data anonymous. The law looks at whether a
        person can still be identified.
      </p>
    </StepLayout>
  );
}

/* 10 ─ Wrap-up -------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "One table, many views",
    "Grants, row filters and column masks give each role what their job needs.",
  ],
  [
    "Close the side door",
    "Policies apply only through engines that ask the catalog; lock storage down.",
  ],
  [
    "Data spreads",
    "Raw copies, derived tables, exports, old versions and streams all hold personal data.",
  ],
  [
    "Erasure is a plan",
    "Delete, rewrite, wait out retention, clean up, and keep only what law requires.",
  ],
  [
    "Pseudonymised is not anonymous",
    "If you can link it back to a person, it's still personal data.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up · Chapter 5 complete"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-2.5">
          {TAKEAWAYS.map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-meta/15 text-viz-meta grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted text-sm">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That completes <strong>Catalogs &amp; governance</strong>. The catalog knows what exists and
        who may touch it; your pipelines and retention settings decide where personal data ends up.
      </p>
      <p>
        Next chapter, <strong>Building pipelines</strong>: getting data in, keeping it in sync, and
        organising it in layers.
      </p>
    </StepLayout>
  );
}
