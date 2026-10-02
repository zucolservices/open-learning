/** The example organisation used in this module. Monthly costs are illustrative. */

export interface Account {
  id: string;
  name: string;
  ou: string;
  cost: number;
  why: string;
}

export interface Ou {
  id: string;
  name: string;
  parent: string | null;
  policies: string[];
}

export const OUS: Ou[] = [
  { id: "root", name: "Organisation (root)", parent: null, policies: ["Only India regions"] },
  { id: "security", name: "Security", parent: "root", policies: ["Nobody may delete logs"] },
  { id: "infra", name: "Infrastructure", parent: "root", policies: [] },
  { id: "workloads", name: "Workloads", parent: "root", policies: ["No public storage"] },
  {
    id: "prod",
    name: "Prod",
    parent: "workloads",
    policies: ["Changes only through the pipeline"],
  },
  { id: "sdlc", name: "SDLC (dev and test)", parent: "workloads", policies: [] },
  { id: "sandbox", name: "Sandbox", parent: "root", policies: ["Budget alert at ₹10,000 a month"] },
];

export const ACCOUNTS: Account[] = [
  {
    id: "portal-prod",
    name: "Citizen portal, production",
    ou: "prod",
    cost: 210000,
    why: "Live systems get their own account under Prod, with the strictest rules.",
  },
  {
    id: "portal-test",
    name: "Citizen portal, testing",
    ou: "sdlc",
    cost: 35000,
    why: "Test environments go under SDLC, so a test mistake can't touch production.",
  },
  {
    id: "payroll-prod",
    name: "Payroll, production",
    ou: "prod",
    cost: 60000,
    why: "Another live system: a separate account from the portal, so each team's mistakes stay contained.",
  },
  {
    id: "logs",
    name: "Central log archive",
    ou: "security",
    cost: 8000,
    why: "Logs from every account land here, where workload admins can't delete them.",
  },
  {
    id: "sec-tools",
    name: "Security tooling",
    ou: "security",
    cost: 12000,
    why: "The security team's scanners and alerts, separate from what they watch.",
  },
  {
    id: "network",
    name: "Shared network",
    ou: "infra",
    cost: 40000,
    why: "The transit hub and connections to the office (module 7) are shared infrastructure.",
  },
  {
    id: "sandbox",
    name: "Data science experiments",
    ou: "sandbox",
    cost: 9000,
    why: "Experiments go in a sandbox: loose rules, a budget cap, no production data.",
  },
];

export const path = (ou: string): Ou[] => {
  const out: Ou[] = [];
  let cur: Ou | undefined = OUS.find((o) => o.id === ou);
  while (cur) {
    out.unshift(cur);
    cur = OUS.find((o) => o.id === cur!.parent);
  }
  return out;
};

export const rupees = (n: number) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(2).replace(/\.?0+$/, "")} lakh`
    : `₹${n.toLocaleString("en-IN")}`;

/** Total monthly cost of every account under an OU (including nested OUs). */
export function rollup(ou: string): number {
  return ACCOUNTS.filter((a) => path(a.ou).some((o) => o.id === ou)).reduce(
    (s, a) => s + a.cost,
    0,
  );
}
