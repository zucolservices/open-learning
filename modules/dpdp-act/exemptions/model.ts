/**
 * Section 17 exemptions (from May 2027). s.17(1) switches off Chapter II except s.8(1) and s.8(5),
 * all of Chapter III and s.16, so security and accountability remain. s.17(2) takes processing out
 * of the whole Act (research only if Second Schedule standards are met).
 */

export type Ex = "a" | "b" | "c" | "d" | "e" | "f" | "state" | "research" | "none";

export const EX_LABEL: Record<Ex, string> = {
  a: "17(1)(a) Legal claims",
  b: "17(1)(b) Courts and regulators",
  c: "17(1)(c) Offences",
  d: "17(1)(d) Foreign data under contract",
  e: "17(1)(e) Approved merger",
  f: "17(1)(f) Loan defaulters",
  state: "17(2)(a) Notified State body",
  research: "17(2)(b) Research and statistics",
  none: "No exemption",
};

export type Duty =
  "notice" | "consent" | "rights" | "erasure" | "transfer" | "security" | "accountable" | "breach";

export const DUTY_LABEL: Record<Duty, string> = {
  notice: "Notice",
  consent: "Consent or legitimate use",
  rights: "Access, correction, grievance",
  erasure: "Erasure when purpose ends",
  transfer: "Cross-border limits",
  security: "Security safeguards",
  accountable: "Responsible for processors",
  breach: "Breach notification",
};

export const DUTIES: Duty[] = [
  "notice",
  "consent",
  "rights",
  "erasure",
  "transfer",
  "breach",
  "security",
  "accountable",
];

export function remains(ex: Ex): Set<Duty> {
  if (ex === "none") return new Set(DUTIES);
  if (ex === "state") return new Set();
  if (ex === "research") return new Set(["security"]); // via the Second Schedule standards
  return new Set(["security", "accountable"]);
}

export const ACTIVITIES: { id: string; text: string; ex: Ex; why: string }[] = [
  {
    id: "sue",
    text: "The legal team exports a customer's records to sue for unpaid dues",
    ex: "a",
    why: "Enforcing a legal right or claim.",
  },
  {
    id: "fraud",
    text: "A fraud team links accounts to detect payment fraud and files a police complaint",
    ex: "c",
    why: "Prevention, detection or investigation of an offence.",
  },
  {
    id: "bpo",
    text: "A Pune back office processes US patients' records for a US hospital",
    ex: "d",
    why: "Data of people outside India, under a contract with a foreign company.",
  },
  {
    id: "merger",
    text: "Customer databases move between two companies after a tribunal approves their merger",
    ex: "e",
    why: "A merger approved by a court, tribunal or other authority.",
  },
  {
    id: "default",
    text: "A bank checks a loan defaulter's assets with credit bureaus",
    ex: "f",
    why: "Ascertaining the financial position of a defaulter.",
  },
  {
    id: "research",
    text: "Researchers produce aggregate statistics with no decisions about individuals",
    ex: "research",
    why: "Research and statistics, if the Second Schedule standards are met.",
  },
  {
    id: "churn",
    text: "Archived 'research' data is used to score each user's churn risk",
    ex: "none",
    why: "A decision about individuals, so the research exemption fails.",
  },
  {
    id: "startup",
    text: "A seed-stage startup decides it's too small to need notices",
    ex: "none",
    why: "Startup exemptions exist only by notification, and none has been made.",
  },
];
