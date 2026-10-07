/** An invoice API, four kinds of request, and the checks that decide what each request returns. */

export type Ctl = "login" | "owner" | "role" | "random";
export type Who = "anon" | "ravi";
export type Req = "own" | "next" | "leaked" | "admin";

export const CONTROLS: { id: Ctl; name: string; detail: string }[] = [
  { id: "login", name: "Require login", detail: "Authentication: is there a valid session?" },
  {
    id: "owner",
    name: "Check the invoice belongs to the caller",
    detail: "Object-level authorisation.",
  },
  {
    id: "role",
    name: "Check the caller's role for admin actions",
    detail: "Function-level authorisation.",
  },
  {
    id: "random",
    name: "Random invoice IDs",
    detail: "Long unguessable IDs instead of 1041, 1042…",
  },
];

export const REQUESTS: { id: Req; label: string; path: (random: boolean) => string }[] = [
  {
    id: "own",
    label: "Ravi's own invoice",
    path: (r) => (r ? "/invoices/7f3c…a91e" : "/invoices/1041"),
  },
  {
    id: "next",
    label: "Guess the next number",
    path: (r) => (r ? "/invoices/??? (nothing to guess)" : "/invoices/1042"),
  },
  {
    id: "leaked",
    label: "A link someone forwarded",
    path: (r) => (r ? "/invoices/c28d…44b0" : "/invoices/1077"),
  },
  { id: "admin", label: "The export-all endpoint", path: () => "/admin/invoices/export" },
];

export interface Result {
  status: number;
  body: string;
  leak: boolean;
  why: string;
}

export function serve(req: Req, who: Who, on: Ctl[]): Result {
  if (on.includes("login") && who === "anon")
    return { status: 401, body: "Please log in.", leak: false, why: "No session." };
  if (req === "own") {
    if (who === "anon")
      return {
        status: 200,
        body: "Ravi's invoice: ₹1,850, delivery address…",
        leak: true,
        why: "No login check: anyone with the link sees it.",
      };
    return {
      status: 200,
      body: "Your invoice: ₹1,850",
      leak: false,
      why: "Ravi sees their own invoice.",
    };
  }
  if (req === "admin") {
    if (on.includes("role"))
      return {
        status: 403,
        body: "Forbidden.",
        leak: false,
        why: "Only the finance role may export.",
      };
    return {
      status: 200,
      body: "invoices.csv — 48,210 customers' invoices",
      leak: true,
      why: "Being logged in was the only check.",
    };
  }
  if (req === "next" && on.includes("random"))
    return {
      status: 404,
      body: "Not found.",
      leak: false,
      why: "Random IDs can't be guessed by counting.",
    };
  if (on.includes("owner"))
    return {
      status: 404,
      body: "Not found.",
      leak: false,
      why: "Not the caller's invoice, so it doesn't exist for them.",
    };
  return {
    status: 200,
    body:
      req === "next"
        ? "Meera's invoice: ₹4,200, address, phone…"
        : "Kabir's invoice: ₹2,990, address, phone…",
    leak: true,
    why:
      req === "leaked" && on.includes("random")
        ? "Random IDs don't help once a link is shared: there's no ownership check."
        : "Logged in isn't allowed: nothing checked who owns it.",
  };
}

export const CASES: [string, string][] = [
  [
    "First American Financial, 2019",
    "Changing a single digit in a document link exposed about 885 million mortgage documents, with no login needed.",
  ],
  [
    "USPS, 2018",
    "An API let any logged-in user look up other users' account details, affecting 60 million accounts.",
  ],
  [
    "Peloton, 2021",
    "After a partial fix, the API required a login, but any account, which anyone could create, could still read other users' data.",
  ],
  [
    "Optus, 2022",
    "Australian regulators allege a 2018 coding error broke access checks on an old customer API, exposing data on about 9.5 million people. The cases are ongoing.",
  ],
];
