/** A scholarship application funnel: where applicants drop out, and the fixes. Numbers are illustrative. */

export interface Issue {
  id: string;
  stage: string;
  problem: string;
  fix: string;
  loss: number;
}

export const ISSUES: Issue[] = [
  {
    id: "fields",
    stage: "Details",
    problem: "Forty fields, many the state already holds.",
    fix: "Ask only what's needed; fill the rest from records",
    loss: 0.18,
  },
  {
    id: "resume",
    stage: "Details",
    problem: "The session expires after 15 minutes, losing everything.",
    fix: "Save progress and let people resume",
    loss: 0.12,
  },
  {
    id: "uploads",
    stage: "Documents",
    problem: "Scans must be PDFs under 100 KB.",
    fix: "Fetch documents from the issuer; accept phone photos",
    loss: 0.15,
  },
  {
    id: "pay",
    stage: "Fee",
    problem: "The ₹100 fee can only be paid by net banking from five banks.",
    fix: "Accept UPI and cards through a payment gateway",
    loss: 0.14,
  },
  {
    id: "receipt",
    stage: "Submit",
    problem: "After paying, a blank page: no receipt, no reference number.",
    fix: "Show a receipt and reference; reconcile payments automatically",
    loss: 0.08,
  },
];

export const STAGES = ["Start", "Details", "Documents", "Fee", "Submit"];

export function funnel(fixed: Set<string>) {
  let n = 1000;
  return STAGES.map((st) => {
    for (const i of ISSUES)
      if (i.stage === st && !fixed.has(i.id)) n = Math.round(n * (1 - i.loss));
    return { stage: st, n };
  });
}
