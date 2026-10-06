/** Candidate features for a churn model and their (illustrative) effect on validation AUC. */

export interface Cand {
  id: string;
  name: string;
  from: string;
  gain: number;
  kind: "good" | "useless" | "bad";
  note: string;
}

export const BASE = 0.6;

export const CANDS: Cand[] = [
  {
    id: "inactive",
    name: "days since last login",
    from: "last_login",
    gain: 0.09,
    kind: "good",
    note: "Recent inactivity is the strongest warning sign.",
  },
  {
    id: "logins14",
    name: "logins in the last 14 days",
    from: "login log",
    gain: 0.05,
    kind: "good",
    note: "An aggregate over history: how engaged lately?",
  },
  {
    id: "plan",
    name: "plan, one-hot (Basic / Plus / Pro)",
    from: "plan",
    gain: 0.03,
    kind: "good",
    note: "Three yes/no columns, one per plan.",
  },
  {
    id: "tenure",
    name: "months since signup",
    from: "signup_date",
    gain: 0.03,
    kind: "good",
    note: "New customers leave more often.",
  },
  {
    id: "spend",
    name: "log(1 + monthly spend)",
    from: "invoices",
    gain: 0.02,
    kind: "good",
    note: "A log tames a long tail of big spenders.",
  },
  {
    id: "city",
    name: "city, target-encoded out-of-fold",
    from: "city (900 values)",
    gain: 0.015,
    kind: "good",
    note: "Each city becomes its average churn rate, computed without the row's own answer.",
  },
  {
    id: "hour",
    name: "hour of last login",
    from: "last_login",
    gain: 0,
    kind: "useless",
    note: "No signal here: it adds noise and maintenance.",
  },
  {
    id: "cityord",
    name: "city as a number (Agra = 1, Bengaluru = 2…)",
    from: "city",
    gain: -0.01,
    kind: "bad",
    note: "Alphabetical numbers imply an order that doesn't exist.",
  },
  {
    id: "custid",
    name: "customer ID as a number",
    from: "customer_id",
    gain: -0.005,
    kind: "bad",
    note: "An identifier, not information. At best noise; at worst it memorises customers.",
  },
];

export function auc(chosen: string[]) {
  const g = CANDS.filter((c) => chosen.includes(c.id)).sort((a, b) => b.gain - a.gain);
  // Diminishing returns: each extra good feature adds a little less.
  let v = BASE;
  g.forEach((c, i) => (v += c.gain * (c.gain > 0 ? Math.pow(0.85, i) : 1)));
  return Math.min(0.9, Math.max(0.5, v));
}

export const ROW = {
  raw: [
    ["customer_id", "48213"],
    ["signup_date", "2025-03-14"],
    ["plan", "Plus"],
    ["city", "Pune"],
    ["last_login", "2026-09-02 23:41"],
    ["monthly spend", "₹1,240"],
  ],
};

export const CITIES = [
  { city: "Pune", churn: 0.11 },
  { city: "Kochi", churn: 0.08 },
  { city: "Agra", churn: 0.14 },
  { city: "Pune", churn: 0.11 },
];
