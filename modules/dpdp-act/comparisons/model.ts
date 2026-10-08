/** DPDP Act vs EU GDPR, and India's sector rules that sit alongside DPDP. As of October 2026. */

export const TOPICS: { id: string; topic: string; gdpr: string; dpdp: string; note: string }[] = [
  {
    id: "bases",
    topic: "Grounds for processing",
    gdpr: "Six: consent, contract, legal obligation, vital interests, public task, legitimate interests.",
    dpdp: "Two: consent, or one of a closed list of legitimate uses.",
    note: "DPDP has no contract or legitimate-interests ground.",
  },
  {
    id: "sensitive",
    topic: "Sensitive data",
    gdpr: "Special categories such as health, religion and biometrics, mostly prohibited unless a condition applies.",
    dpdp: "No separate category. Sensitivity matters only for penalties and for naming Significant Data Fiduciaries.",
    note: "All personal data is treated alike.",
  },
  {
    id: "rights",
    topic: "People's rights",
    gdpr: "Access, rectification, erasure, restriction, portability, objection, and rules on automated decisions.",
    dpdp: "Access, correction and erasure, grievance redressal, nomination.",
    note: "DPDP adds nomination; GDPR has more rights overall.",
  },
  {
    id: "breach",
    topic: "Breach notices",
    gdpr: "Regulator within 72 hours unless unlikely to cause risk; individuals only if high risk.",
    dpdp: "Every breach: the Board without delay plus a 72-hour report, and every affected person.",
    note: "DPDP is stricter: no risk threshold.",
  },
  {
    id: "children",
    topic: "Children",
    gdpr: "Parental consent below 16 for online services (countries can lower it to 13).",
    dpdp: "Under 18, for all processing, plus a ban on tracking and targeted ads.",
    note: "DPDP is stricter.",
  },
  {
    id: "dpo",
    topic: "Data Protection Officer",
    gdpr: "Required for public bodies and large-scale monitoring or sensitive processing.",
    dpdp: "Required only for Significant Data Fiduciaries; others publish a contact person.",
    note: "Similar idea, different triggers.",
  },
  {
    id: "fines",
    topic: "Penalties",
    gdpr: "Up to €20 million or 4% of worldwide annual turnover, whichever is higher.",
    dpdp: "Fixed caps, up to ₹250 crore per breach.",
    note: "GDPR scales with company size; DPDP doesn't.",
  },
  {
    id: "reach",
    topic: "Reach abroad",
    gdpr: "Offering goods or services to people in the EU, or monitoring their behaviour there.",
    dpdp: "Only offering goods or services to people in India.",
    note: "DPDP has no 'monitoring' limb.",
  },
];

export type Flag = "payments" | "lending" | "social" | "markets" | "health";

export const FLAGS: { id: Flag; label: string }[] = [
  { id: "payments", label: "Handles payments" },
  { id: "lending", label: "Lends money" },
  { id: "social", label: "Lets users post content" },
  { id: "markets", label: "Is a SEBI-regulated broker" },
  { id: "health", label: "Joins the national digital health network" },
];

export const RULEBOOKS: { id: string; name: string; when: Flag | "always"; says: string }[] = [
  {
    id: "dpdp",
    name: "DPDP Act and Rules",
    when: "always",
    says: "Consent, notice, safeguards, breach notices, rights (from May 2027).",
  },
  {
    id: "certin",
    name: "CERT-In Directions 2022",
    when: "always",
    says: "Report listed cyber incidents within 6 hours; keep 180 days of logs.",
  },
  {
    id: "rbi-pay",
    name: "RBI payment-data rule",
    when: "payments",
    says: "Store payment data only in India.",
  },
  {
    id: "rbi-lend",
    name: "RBI digital lending directions",
    when: "lending",
    says: "Need-based data with explicit consent; no access to contacts or call logs.",
  },
  {
    id: "itrules",
    name: "IT Rules 2021",
    when: "social",
    says: "Grievance officer, takedowns, keep registration data 180 days after an account closes.",
  },
  {
    id: "sebi",
    name: "SEBI cyber framework",
    when: "markets",
    says: "Graded cyber controls, audits and 6-hour incident reporting.",
  },
  {
    id: "abdm",
    name: "ABDM health data policy",
    when: "health",
    says: "Consent artefacts and purpose limits for health records in the network.",
  },
];
