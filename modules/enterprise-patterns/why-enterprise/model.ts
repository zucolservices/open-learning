/** How many connections n systems need, wired point to point or through a hub (illustrative). */

export type Wiring = "p2p" | "hub";

export const SYSTEM_NAMES = [
  "Core banking",
  "CRM",
  "Cards",
  "Loans",
  "Mobile app",
  "Website",
  "Call centre",
  "Insurance partner",
  "Marketing",
  "Data warehouse",
  "Fraud checks",
  "Statements",
  "Tax reporting",
  "Collections",
  "KYC",
  "Payments switch",
  "Branch system",
  "Chatbot",
  "Rewards",
  "Complaints",
];

export function connections(n: number, w: Wiring) {
  return w === "p2p" ? (n * (n - 1)) / 2 : n;
}

/** Positions on a circle in a 200 × 200 box, rounded to avoid hydration mismatches. */
export function ring(n: number, r = 80) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.round((100 + r * Math.cos(a)) * 10) / 10,
      y: Math.round((100 + r * Math.sin(a)) * 10) / 10,
    };
  });
}

/** One address change: which systems hold a copy, and whether each gets updated. */
export const COPIES: { system: string; how: string; updated: "now" | "overnight" | "never" }[] = [
  { system: "Core banking", how: "the system of record: changed here first", updated: "now" },
  { system: "CRM", how: "real-time call from core banking", updated: "now" },
  { system: "Cards", how: "nightly file from core banking", updated: "overnight" },
  { system: "Loans", how: "nightly file", updated: "overnight" },
  { system: "Insurance partner", how: "weekly spreadsheet by email", updated: "never" },
  { system: "Marketing", how: "copied once at sign-up", updated: "never" },
  { system: "Data warehouse", how: "nightly batch load", updated: "overnight" },
];
