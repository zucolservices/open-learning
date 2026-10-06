/** A churn model that looks too good, and the leaks behind it. Numbers illustrative. */

export interface Feat {
  id: string;
  name: string;
  importance: number;
  leak: number; // AUC it adds in testing that won't exist in production
  when: string;
}

export const FEATS: Feat[] = [
  {
    id: "reason",
    name: "cancellation_reason",
    importance: 0.46,
    leak: 0.14,
    when: "Filled in by the support agent after the customer cancels.",
  },
  {
    id: "invoice",
    name: "final_invoice_amount",
    importance: 0.14,
    leak: 0.05,
    when: "Generated on the day an account closes.",
  },
  {
    id: "inactive",
    name: "days_since_last_login",
    importance: 0.16,
    leak: 0,
    when: "Known on the 1st of the month, when predictions are made.",
  },
  {
    id: "tenure",
    name: "months_since_signup",
    importance: 0.08,
    leak: 0,
    when: "Known at prediction time.",
  },
  {
    id: "logins",
    name: "logins_last_14_days",
    importance: 0.1,
    leak: 0,
    when: "Known at prediction time, counted up to the 1st.",
  },
  {
    id: "city",
    name: "city_churn_rate",
    importance: 0.06,
    leak: 0.02,
    when: "Each city's churn rate, computed from all rows, test rows included.",
  },
];

export const REAL = 0.76;
export const CLEAN = 0.78; // honest test score once all leaks are gone (small, normal optimism)
export const PREP_LEAK = 0.01;

export function measured(removed: string[], prepInside: boolean) {
  const leak = FEATS.filter((f) => !removed.includes(f.id)).reduce((a, f) => a + f.leak, 0);
  return Math.min(0.99, CLEAN + leak + (prepInside ? 0 : PREP_LEAK));
}

export function lostSignal(removed: string[]) {
  return FEATS.filter((f) => removed.includes(f.id) && f.leak === 0).map((f) => f.name);
}
