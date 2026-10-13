"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ROWS, STEPS, risk, type Step } from "./model";
import type { OpenState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Noticeboard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The panchayat noticeboard"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line-strong bg-surface w-64 rounded-lg border p-3 text-xs">
            <p className="font-semibold">Village works, this year</p>
            {[
              ["Road repair", "₹4,20,000"],
              ["Well deepening", "₹1,80,000"],
              ["School toilets", "₹2,50,000"],
            ].map(([t, v], i) => (
              <motion.p
                key={t}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 * i }}
                className="border-line flex justify-between border-t py-1"
              >
                <span>{t}</span>
                <span className="font-mono">{v}</span>
              </motion.p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A noticeboard listing what the panchayat spent lets every villager check it. Nobody has to
        ask; the information is simply there. But the board wouldn&apos;t list who received medical
        help, with their phone numbers.
      </p>
      <p>
        <Term id="open-data">Open data</Term> is that noticeboard at national scale: publish what
        can be public, in usable formats, and properly <Term id="anonymisation">anonymise</Term>{" "}
        anything about people first.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Prepare() {
  const [s, set] = useSceneState<OpenState>();
  const on = new Set(s.on as Step[]);
  const r = risk(on);
  const cols = [
    !on.has("drop") && "Name",
    !on.has("drop") && "Phone",
    on.has("age") ? "Age band" : "Birth date",
    on.has("area") ? "District" : "Village",
    "Gender",
    "Amount",
  ].filter(Boolean) as string[];
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Prepare a dataset for publication"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="border-line bg-surface overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-surface-2">
                <tr>
                  {cols.map((c) => (
                    <th key={c} className="px-2 py-1 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {on.has("small") ? (
                  <tr className="border-line border-t">
                    <td colSpan={cols.length} className="text-muted px-2 py-1">
                      Kalpanagar North, 18–20: 3 recipients (fewer than five, shown only as a total
                      elsewhere)
                    </td>
                  </tr>
                ) : (
                  ROWS.map((row) => (
                    <tr key={row.phone} className="border-line border-t">
                      {!on.has("drop") && <td className="px-2 py-1">{row.name}</td>}
                      {!on.has("drop") && <td className="px-2 py-1 font-mono">{row.phone}</td>}
                      <td className="px-2 py-1 font-mono">{on.has("age") ? row.age : row.dob}</td>
                      <td className="px-2 py-1">{on.has("area") ? row.district : row.village}</td>
                      <td className="px-2 py-1">{row.gender}</td>
                      <td className="px-2 py-1 font-mono">₹{row.amount.toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-2",
              r.level === 0
                ? "border-good/50 bg-good/10"
                : r.level === 1
                  ? "border-viz-meta/50 bg-viz-meta/10"
                  : "border-bad/40 bg-bad/5",
            )}
          >
            <p className="font-semibold">
              Re-identification risk: {["low", "some", "high", "certain"][r.level]}
            </p>
            <p className="text-muted">{r.text}</p>
            <p className="text-muted mt-1">
              {on.has("format")
                ? "Format: CSV under an open government licence."
                : "Format: a scanned PDF nobody can analyse."}
            </p>
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {STEPS.map(([k, t, b]) => (
              <label
                key={k}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-2.5 py-1.5",
                  on.has(k) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.has(k)}
                  onChange={() =>
                    set({ on: on.has(k) ? s.on.filter((x) => x !== k) : [...s.on, k] })
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="font-semibold">{t}</span>
                  <span className="text-muted block text-[11px]">{b}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Kalpanagar wants to publish who received scholarships, so researchers and journalists can
        check the scheme is fair. Here are three made-up rows. Apply each step and watch the risk.
      </p>
      <p>
        Removing names isn&apos;t enough: researchers have repeatedly re-identified people in
        &ldquo;anonymous&rdquo; data by combining a few ordinary details.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Portals -------------------------------------------------------------------------------------- */

export function Portals() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Open data policy and portals"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "India's policy, 2012",
              "The National Data Sharing and Accessibility Policy: publish shareable, non-sensitive data, with a data controller in each ministry.",
            ],
            [
              "data.gov.in",
              "Run by NIC: roughly 6 lakh data resources in about 13,000 catalogues (2026), many with APIs. Licensed for reuse since 2017.",
            ],
            [
              "New framework, 2026",
              "A national framework for data sharing within and outside government was approved in May 2026, with a National Data Governance Committee.",
            ],
            [
              "AIKosh",
              "IndiaAI's platform for de-identified datasets and models, launched in March 2025.",
            ],
            [
              "United States",
              "data.gov since 2009; the OPEN Government Data Act (2019) made open by default the law.",
            ],
            [
              "United Kingdom",
              "data.gov.uk since 2010, relaunched in 2026 as the front door of a National Data Library.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Open data pays off when it&apos;s machine-readable, openly licensed, kept up to date and
        described well enough for strangers to use it.
      </p>
      <p>
        India&apos;s DPDP Act covers personal data but sets no standard for when data counts as
        anonymised, so be cautious.
      </p>
    </StepLayout>
  );
}

/* 4 ─ RTI ------------------------------------------------------------------------------------------ */

export function Rti() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Transparency by law"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "RTI Act, 2005",
              "Anyone can request information from a public authority; replies are due within 30 days, or 48 hours where life or liberty is at stake.",
            ],
            [
              "Section 4: publish first",
              "Seventeen categories every authority must publish proactively, from its functions and budgets to subsidy programmes and beneficiaries.",
            ],
            [
              "Section 8: exemptions",
              "Ten grounds to refuse, from national security to personal information, with a public-interest override.",
            ],
            [
              "The 2025 change",
              "The DPDP Act shortened the personal-information exemption to “information which relates to personal information”, in force since November 2025. Challenges are pending before a larger Supreme Court bench.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The <Term id="rti">Right to Information</Term> is reactive; open data is proactive. The more
        a department publishes, the fewer requests it has to answer one by one.
      </p>
      <p>
        Critics argue the 2025 amendment weakens RTI; the government disagrees. This is an overview,
        not legal advice.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function OpenCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Publish or hold back?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-open-data"
            prompt="Should each dataset be published openly as it stands?"
            categories={[
              { id: "publish", label: "Publish" },
              { id: "hold", label: "Hold back or fix first" },
            ]}
            items={[
              {
                id: "district",
                label: "Scholarships awarded per district",
                category: "publish",
                why: "Aggregated and useful.",
              },
              {
                id: "phones",
                label: "Recipients' names and phone numbers",
                category: "hold",
                why: "Direct identifiers.",
              },
              {
                id: "budget",
                label: "Money spent on each scheme this year",
                category: "publish",
                why: "Exactly what proactive disclosure is for.",
              },
              {
                id: "tiny",
                label: "Recipients per village, where some villages have two",
                category: "hold",
                why: "Tiny groups identify people.",
              },
              {
                id: "contracts",
                label: "Contracts awarded and their values",
                category: "publish",
                why: "Spending transparency.",
              },
            ]}
            explanation="Publish spending, results and well-aggregated statistics. Hold back anything that names people or lets small groups be singled out, until it's properly anonymised."
          />
        </div>
      }
    >
      <p>Sort each dataset.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Publish before being asked", "RTI section 4 and open data."],
        ["Usable formats", "CSV and APIs, with an open licence."],
        ["Names aren't the only risk", "Combinations identify people."],
        ["Generalise and suppress", "Bands, districts, no tiny groups."],
        ["The law is moving", "The 2025 RTI change is in court."],
      ]}
    >
      <p>That ends the chapter on identity and data. Next: designing services for everyone.</p>
    </WrapStep>
  );
}
