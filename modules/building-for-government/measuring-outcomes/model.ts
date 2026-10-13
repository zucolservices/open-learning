/** Metrics for a made-up pension service: which are outputs and which tell you whether life got easier. */

export type Kind = "output" | "outcome" | "equity";

export interface Metric {
  id: string;
  label: string;
  kind: Kind;
  value: string;
}

export const METRICS: Metric[] = [
  { id: "visits", label: "Portal visits", kind: "output", value: "18.2 lakh this quarter, up 40%" },
  { id: "users", label: "Registered users", kind: "output", value: "6.1 lakh" },
  { id: "transactions", label: "Transactions recorded", kind: "output", value: "41 lakh" },
  {
    id: "completion",
    label: "Applications completed, of those started",
    kind: "outcome",
    value: "62%",
  },
  {
    id: "time",
    label: "Days from application to first pension payment",
    kind: "outcome",
    value: "Median 47 days",
  },
  {
    id: "cost",
    label: "Cost to the applicant: trips, fees, days of work lost",
    kind: "outcome",
    value: "2.3 office trips on average",
  },
  {
    id: "satisfaction",
    label: "Applicants satisfied with the service",
    kind: "outcome",
    value: "58%",
  },
  {
    id: "groups",
    label: "Completion by group: rural, women, over 70",
    kind: "equity",
    value: "Rural women over 70: 31%",
  },
  {
    id: "assisted",
    label: "Share applying through service centres or by phone",
    kind: "equity",
    value: "44%",
  },
];

export const MAX = 5;

export function verdict(ids: string[]) {
  const picked = METRICS.filter((m) => ids.includes(m.id));
  const outcomes = picked.filter((m) => m.kind !== "output").length;
  const equity = picked.some((m) => m.kind === "equity");
  if (!picked.length) return "Pick up to five measures for the minister's dashboard.";
  if (outcomes === 0)
    return "Every number is going up, and nobody can tell whether a single pensioner got paid sooner.";
  if (!equity) return "You can see whether the service works on average, but not who it's failing.";
  if (outcomes === picked.length)
    return "A dashboard that shows whether people got their pension, how long it took, what it cost them, and who's being left behind.";
  return "Good: outcomes and equity are there. The output numbers add context, but take up space.";
}
