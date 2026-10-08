/**
 * Retention clock under Rule 8 and the Third Schedule, for a made-up large e-commerce platform.
 * Clock start: the latest of last approach, last exercise of rights, and commencement. The Rules
 * don't say which commencement counts; we use 13 May 2027 (the conservative reading). Dates are
 * in months from January 2027.
 */

export const START = 0; // Jan 2027
export const COMMENCE = 4; // May 2027
export const END = 96; // Jan 2035

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const label = (m: number) => `${MONTHS[((m % 12) + 12) % 12]} ${2027 + Math.floor(m / 12)}`;

export const LAST_SEEN: { id: string; at: number; label: string }[] = [
  { id: "early", at: 2, label: "Mar 2027 (before the Rules apply)" },
  { id: "mid", at: 19, label: "Aug 2028" },
  { id: "late", at: 36, label: "Jan 2030" },
];

export interface Clock {
  start: number;
  expiry: number;
  warnBy: string;
  restartedAt?: number;
}

export function clock(lastSeen: number, returns: boolean): Clock {
  const start = Math.max(lastSeen, COMMENCE);
  let expiry = start + 36;
  let restartedAt: number | undefined;
  if (returns) {
    restartedAt = expiry; // logs in during the 48-hour warning, just before expiry
    expiry = restartedAt + 36;
  }
  return { start, expiry, warnBy: `48 hours before ${label(expiry)}`, restartedAt };
}

export interface Lane {
  id: string;
  label: string;
  /** Months the slice survives after the expiry date (0 = erased at expiry). */
  after: number | "kept";
  why: string;
}

export const LANES: Lane[] = [
  {
    id: "orders",
    label: "Order history and preferences",
    after: 0,
    why: "Purpose served: erased at expiry.",
  },
  {
    id: "behaviour",
    label: "Browsing and recommendations data",
    after: 0,
    why: "Purpose served: erased at expiry.",
  },
  {
    id: "account",
    label: "Login and account access",
    after: "kept",
    why: "Carved out: keeping the account accessible.",
  },
  {
    id: "wallet",
    label: "Wallet balance token",
    after: "kept",
    why: "Carved out: stored value the user can still spend.",
  },
  {
    id: "logs",
    label: "Processing logs",
    after: 12,
    why: "Rule 8(3): at least one year from each processing.",
  },
  {
    id: "gst",
    label: "Tax invoices",
    after: 30,
    why: "GST law keeps records for about six years from the annual return; illustrative here.",
  },
];

export const CLASSES: { cls: string; users: string; period: string }[] = [
  {
    cls: "E-commerce entities",
    users: "2 crore or more registered users in India",
    period: "3 years",
  },
  {
    cls: "Online gaming intermediaries",
    users: "50 lakh or more registered users in India",
    period: "3 years",
  },
  {
    cls: "Social media intermediaries",
    users: "2 crore or more registered users in India",
    period: "3 years",
  },
];

export const HOLDS: { law: string; what: string; years: number; note: string }[] = [
  {
    law: "DPDP Rules, Rule 8(3)",
    what: "Processing logs and traffic data",
    years: 1,
    note: "From each processing",
  },
  { law: "CERT-In Directions 2022", what: "ICT system logs", years: 0.5, note: "Rolling 180 days" },
  {
    law: "PMLA Rules",
    what: "KYC and transaction records (reporting entities)",
    years: 5,
    note: "After the relationship ends",
  },
  {
    law: "CGST Act, s.36",
    what: "GST accounts and invoices",
    years: 6,
    note: "About 72 months from the annual return",
  },
];
