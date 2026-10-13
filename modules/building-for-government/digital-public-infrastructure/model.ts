/** A made-up shopkeeper's small loan, step by step, and the shared digital rails each step can run on. */

export interface Rail {
  id: string;
  label: string;
  layer: "identity" | "payments" | "data" | "none";
}

export const RAILS: Rail[] = [
  { id: "ekyc", label: "Aadhaar eKYC", layer: "identity" },
  { id: "aa", label: "Account Aggregator", layer: "data" },
  { id: "locker", label: "DigiLocker", layer: "data" },
  { id: "upi", label: "UPI", layer: "payments" },
  { id: "esign", label: "eSign", layer: "identity" },
  { id: "paper", label: "Photocopies at the branch", layer: "none" },
];

export interface Need {
  id: string;
  step: string;
  answer: string;
  why: string;
  paper: string;
}

export const NEEDS: Need[] = [
  {
    id: "who",
    step: "Confirm who the applicant is",
    answer: "ekyc",
    why: "Identity verified from UIDAI with the applicant's consent, in seconds.",
    paper: "Days: a branch visit and attested ID copies.",
  },
  {
    id: "income",
    step: "See the shop's recent bank statements",
    answer: "aa",
    why: "Shared from the bank with explicit, revocable consent; the Account Aggregator can't read it.",
    paper: "Days: printed, stamped statements.",
  },
  {
    id: "licence",
    step: "Check the shop's registration certificate",
    answer: "locker",
    why: "Fetched from the issuing department, so it's genuine by construction.",
    paper: "Days: a photocopy someone has to verify.",
  },
  {
    id: "sign",
    step: "Sign the loan agreement",
    answer: "esign",
    why: "A legally valid electronic signature, without a visit.",
    paper: "A trip to the branch to sign in ink.",
  },
  {
    id: "pay",
    step: "Send the money, and collect repayments",
    answer: "upi",
    why: "Instant, interoperable payments to and from any bank.",
    paper: "Cheques and days of clearing.",
  },
];
