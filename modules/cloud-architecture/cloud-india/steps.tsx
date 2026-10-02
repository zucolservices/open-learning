"use client";

import { motion } from "motion/react";
import { Check, MapPin, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { IndiaState, Who } from "./state";

/* 1 ─ An approved courier ------------------------------------------------------------------------- */

export function Courier() {
  const rules: [string, string][] = [
    [
      "What's in the parcel?",
      "Some documents can't go by courier at all; some only by the government's own dispatch.",
    ],
    [
      "Is the courier approved?",
      "Only couriers on the approved list, checked by an auditor, and only for the services they were approved for.",
    ],
    [
      "Does it stay in India?",
      "The parcel, and every copy of it, must not leave the country, even in transit.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="An approved courier"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {rules.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">
                {i + 1}. {t}
              </p>
              <p className="text-muted mt-0.5 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A government office sending sensitive papers asks three questions before choosing a courier.
        Public-sector cloud projects in India ask the same three: how sensitive is the data, is the
        cloud service approved, and does the data stay in India?
      </p>
      <p>
        The approval is <Term id="meity-empanelment">MeitY empanelment</Term>. The &ldquo;stays
        here&rdquo; part is <Term id="data-residency">data residency</Term>. Neither is satisfied
        just by picking a region in India, as this module shows.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Clouds in India ---------------------------------------------------------------------------- */

const CITIES: Record<string, [string, string][]> = {
  Mumbai: [
    ["AWS", "ap-south-1 · 2016"],
    ["Azure", "West India · 2015"],
    ["Google Cloud", "asia-south1 · 2017"],
    ["Oracle", "Mumbai · 2019"],
  ],
  Pune: [["Azure", "Central India · 2015"]],
  Chennai: [["Azure", "South India · 2015"]],
  Hyderabad: [
    ["AWS", "ap-south-2 · 2022"],
    ["Oracle", "Hyderabad · 2020"],
    ["Azure", "India South Central · August 2026, three zones"],
  ],
  "Delhi NCR": [["Google Cloud", "asia-south2 · 2021"]],
};

export function Regions() {
  const [s, set] = useSceneState<IndiaState>();
  const city = CITIES[s.city] ? s.city : "Mumbai";
  return (
    <StepLayout
      eyebrow="Explore"
      title="Clouds in India"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(CITIES).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set({ city: c })}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                  c === city ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                <MapPin className="size-3" /> {c}{" "}
                <span className="text-muted">({CITIES[c].length})</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {CITIES[city].map(([p, r], i) => (
              <motion.div
                key={city + p}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="border-line bg-surface flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span className="font-semibold">{p}</span>
                <span className="text-muted text-xs">{r}</span>
              </motion.div>
            ))}
          </div>
          <div className="border-line rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Also</p>
            <p className="text-muted mt-0.5">
              Indian providers such as Yotta, CtrlS, ESDS, Sify, NxtGen and RailTel; MeghRaj, the
              government&apos;s cloud initiative, with NIC&apos;s National Cloud (2014), used by
              2,170 ministries and departments; IndiaAI&apos;s subsidised GPUs at about ₹65 an hour.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Every big cloud now has two or more regions in India, and the large investments announced in
        2025–26 expand them. Mumbai has the most choice; Hyderabad is the newest hub.
      </p>
      <p>
        Two regions in different cities let a design keep recovery copies inside India (module 17).
        Some organisations, such as UIDAI for Aadhaar and NPCI for UPI, run their own data centres.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Check the design ⭐ ------------------------------------------------------------------------- */

const ITEMS: {
  id: string;
  part: string;
  problem: string | null;
  fix: string;
  good: string;
  catA?: boolean;
}[] = [
  {
    id: "provider",
    part: "Cloud provider: a MeitY-empanelled public cloud",
    problem: null,
    catA: true,
    fix: "Move to a government cloud (NIC, a State Data Centre or a PSU provider)",
    good: "Category B data may use empanelled private providers.",
  },
  {
    id: "compute",
    part: "Servers and database in Mumbai and Hyderabad",
    problem: null,
    fix: "",
    good: "Both regions in India, empanelled offerings.",
  },
  {
    id: "backup",
    part: "Backups copied to Singapore for disaster recovery",
    problem: "Copies leave India.",
    fix: "Copy backups to the second Indian region instead",
    good: "Recovery copies stay in India (Mumbai ↔ Hyderabad).",
  },
  {
    id: "ai",
    part: "AI summaries of case notes via a “Global” model endpoint",
    problem: "A global endpoint may process requests in any region worldwide.",
    fix: "Use an India-only option (for example Bedrock's “in.” profiles, or an Azure regional deployment)",
    good: "Prompts and responses are processed only in Indian regions.",
  },
  {
    id: "logs",
    part: "Audit logs kept 90 days",
    problem: "CERT-In requires logs to be kept for 180 days, within India.",
    fix: "Keep logs 180 days in an Indian region",
    good: "Meets CERT-In's 180-day rule.",
  },
  {
    id: "soc",
    part: "Provider's security monitoring team in Singapore",
    problem: "MeitY's procurement guidelines say the NOC and SOC must be within India.",
    fix: "Use the provider's India-based operations centre",
    good: "Monitoring and operations run from India.",
  },
  {
    id: "cdn",
    part: "CDN serving public forms and images",
    problem: null,
    fix: "",
    good: "Fine for public, non-personal files. Never cache personal data at worldwide edges.",
  },
];

export function CheckDesign() {
  const [s, set] = useSceneState<IndiaState>();
  const fixes = s.fixes ?? [];
  const toggle = (id: string) =>
    set({ fixes: fixes.includes(id) ? fixes.filter((x) => x !== id) : [...fixes, id] });
  const rows = ITEMS.map((it) => {
    const problem = it.catA
      ? s.category === "A"
        ? "Category A data can't use private providers, even empanelled ones."
        : null
      : it.problem;
    const fixed = fixes.includes(it.id);
    return { ...it, problem, ok: !problem || fixed };
  });
  const open = rows.filter((r) => !r.ok).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Check the design"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-xs font-semibold">Step zero: classify the data</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {(["B", "A"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set({ category: c })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px]",
                    s.category === c ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {c === "B"
                    ? "Category B: state health records portal"
                    : "Category A: high impact (e.g. tax systems)"}
                </button>
              ))}
            </div>
            <p className="text-muted mt-1 text-[10px]">
              Top Secret and Secret data can&apos;t go on any cloud.
            </p>
          </div>
          {rows.map((r) => (
            <div
              key={r.id}
              className={cn(
                "rounded-lg border px-3 py-1.5",
                r.ok ? "border-line bg-surface" : "border-bad/50 bg-bad/10",
              )}
            >
              <div className="flex items-start gap-2 text-xs">
                {r.ok ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{r.part}</p>
                  <p className={cn("text-[11px]", r.ok ? "text-muted" : "text-bad")}>
                    {r.ok ? (fixes.includes(r.id) ? r.fix + "." : r.good) : r.problem}
                  </p>
                </div>
                {r.fix && (r.problem || fixes.includes(r.id)) && (
                  <button
                    type="button"
                    onClick={() => toggle(r.id)}
                    className="border-line hover:bg-surface-2 shrink-0 rounded-full border px-2 py-0.5 text-[10px]"
                  >
                    {fixes.includes(r.id) ? "Undo" : "Fix"}
                  </button>
                )}
              </div>
            </div>
          ))}
          <p className={cn("rounded-lg px-3 py-2 text-sm", open ? "bg-surface-2" : "bg-good/10")}>
            {open
              ? `${open} ${open === 1 ? "part needs" : "parts need"} changing before this can go live.`
              : "Every part passes the three questions."}
          </p>
        </div>
      }
    >
      <p>
        A state health department&apos;s portal is ready to launch. Classify its data, then check
        each part of the design against the three questions and fix what fails.
      </p>
      <p>
        Under a MeitY memorandum (November 2024, extended March 2026), government data is classified
        first. High-impact Category A systems may only use government clouds; Category B may also
        use empanelled private providers. Empanelment covers specific offerings, deployment models
        and audited regions, so every service needs checking, including AI endpoints and support
        teams.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which rules apply? -------------------------------------------------------------------------- */

const RULES: Record<Who, [string, string][]> = {
  govt: [
    [
      "MeitY data classification",
      "Top Secret and Secret: no cloud. Category A: government clouds only. Category B: empanelled providers too.",
    ],
    [
      "MeitY procurement guidelines (2026)",
      "Services only from STQC-audited data centres; data processing, NOC and SOC within India.",
    ],
    ["CERT-In (2022)", "Report listed incidents within 6 hours; keep logs 180 days within India."],
  ],
  bank: [
    ["RBI (2018)", "All payment-system data stored only in India."],
    [
      "RBI IT outsourcing direction (2023)",
      "Rules for using cloud services, including audit and exit.",
    ],
    ["CERT-In (2022)", "Logs 180 days within India."],
  ],
  market: [
    [
      "SEBI cloud framework (2023)",
      "MeitY-empanelled providers; data within the legal boundaries of India; the regulated entity keeps ownership of data, keys and logs.",
    ],
    ["CERT-In (2022)", "Logs 180 days within India."],
  ],
  insurer: [
    ["IRDAI", "Policy and claim records held in data centres in India."],
    ["CERT-In (2022)", "Logs 180 days within India."],
  ],
  company: [
    [
      "DPDP Act 2023",
      "No blanket localisation: transfers abroad are allowed unless the government restricts a country (none had been notified at the time of writing).",
    ],
    [
      "DPDP Rules (Nov 2025)",
      "Most duties apply from May 2027: security safeguards (encryption, masking…), breach report to the Board within 72 hours. Large “significant” data fiduciaries can be told to keep specified data in India.",
    ],
    ["CERT-In (2022)", "Logs 180 days within India."],
  ],
};

const WHO: [Who, string][] = [
  ["govt", "Government"],
  ["bank", "Bank or payments"],
  ["market", "Stock market"],
  ["insurer", "Insurer"],
  ["company", "Any company"],
];

export function Rules() {
  const [s, set] = useSceneState<IndiaState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Which rules apply?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {WHO.map(([k, n]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ who: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.who === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          {RULES[s.who].map(([t, d], i) => (
            <motion.div
              key={s.who + t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        There is no single Indian rule that says &ldquo;keep all data here&rdquo;. The{" "}
        <Term id="dpdp">DPDP Act</Term> applies to everyone handling personal data, but sector
        regulators add their own, stricter rules. Pick who you are.
      </p>
      <p>
        These rules become guardrails (module 12) and logging settings in the landing zone (module
        14): &ldquo;only India regions&rdquo;, log retention of at least 180 days, and keys and logs
        held by the organisation.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Allowed or not? ---------------------------------------------------------------------------- */

export function Allowed() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Allowed or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="india-allowed"
            prompt="Is each plan allowed under the rules in this module?"
            categories={[
              { id: "yes", label: "Allowed" },
              { id: "no", label: "Not allowed" },
            ]}
            items={[
              {
                id: "catb",
                label: "A Category B department app on an empanelled public cloud in Mumbai",
                category: "yes",
                why: "Category B may use empanelled private providers in India.",
              },
              {
                id: "cata",
                label: "A Category A tax system on the same empanelled public cloud",
                category: "no",
                why: "Category A is limited to government clouds (NIC, State Data Centres, PSUs).",
              },
              {
                id: "secret",
                label: "Secret files stored on any cloud",
                category: "no",
                why: "Top Secret and Secret data can't go on cloud at all.",
              },
              {
                id: "upi",
                label: "A payment company storing transaction data in Singapore",
                category: "no",
                why: "RBI: payment-system data stored only in India.",
              },
              {
                id: "startup",
                label: "A start-up storing customers' personal data in Frankfurt",
                category: "yes",
                why: "DPDP has no blanket localisation and no country is restricted yet; other rules may still apply to specific sectors.",
              },
              {
                id: "logs",
                label: "A company keeping its server logs for only 30 days",
                category: "no",
                why: "CERT-In: logs must be kept 180 days within India.",
              },
            ]}
            explanation="Classification first, then sector rules, then DPDP: the strictest rule that applies wins."
          />
        </div>
      }
    >
      <p>Six plans, checked against the rules.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Classify first", "Secret: no cloud. Category A: government cloud. Category B: empanelled too."],
  [
    "Every service, not just the region",
    "Backups, AI endpoints, logs and support teams can leave India.",
  ],
  ["Sector rules are stricter", "RBI, SEBI, IRDAI and CERT-In on top of DPDP."],
  ["Encode it", "Guardrails and landing-zone settings enforce the rules."],
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
      <p>Next: moving existing systems to the cloud, and the strategies for each.</p>
    </StepLayout>
  );
}
