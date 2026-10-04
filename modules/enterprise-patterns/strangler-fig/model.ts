/** Migrating a legacy pension system route by route behind a façade (illustrative). */

export interface Route {
  id: string;
  path: string;
  traffic: number;
  quirk?: string;
  found?: string;
}

export const ROUTES: Route[] = [
  { id: "statements", path: "/statements", traffic: 30 },
  { id: "address", path: "/address-change", traffic: 10 },
  {
    id: "eligibility",
    path: "/eligibility",
    traffic: 20,
    quirk:
      "Age is worked out on the financial year, not the birthday: 1,140 people wrongly told they're not yet eligible.",
    found:
      "Parallel run found 1,140 mismatches: legacy counts age on the financial year. Rule copied before cut-over.",
  },
  {
    id: "payments",
    path: "/payments",
    traffic: 35,
    quirk:
      "Legacy rounds every payment up to the next rupee: 312 pensioners paid ₹1 less this month. Complaints arrive.",
    found:
      "Parallel run found 312 mismatches: legacy rounds up to the next rupee. Fixed before cut-over.",
  },
  { id: "reports", path: "/reports", traffic: 5 },
];
