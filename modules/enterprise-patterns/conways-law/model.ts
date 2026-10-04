/**
 * A food-delivery company with 24 engineers, organised three ways. Each feature change touches
 * some layers and some business streams; we count the teams that must coordinate. Illustrative.
 */

export type Org = "layers" | "streams" | "one";

export const ORGS: Record<Org, { name: string; teams: string[]; parts: string[]; note: string }> = {
  layers: {
    name: "By technology",
    teams: ["Web & app team", "Backend team", "Database team"],
    parts: ["Front end", "One big backend", "Shared database"],
    note: "Three teams make three layers. Every feature cuts through all of them.",
  },
  streams: {
    name: "By business stream",
    teams: ["Ordering team", "Payments team", "Delivery team"],
    parts: ["Ordering service", "Payments service", "Delivery service"],
    note: "Each team owns a slice end to end, front to database. The system splits the same way.",
  },
  one: {
    name: "One big team",
    teams: ["All 24 engineers"],
    parts: ["One system, no clear parts"],
    note: "No hand-offs, but 24 people have 276 possible pairs to keep in sync. Boundaries blur.",
  },
};

export type Change = "tip" | "upi" | "tracking";

export const CHANGES: Record<Change, { name: string; layers: number; streams: string[] }> = {
  tip: { name: "Let customers add a tip", layers: 3, streams: ["Ordering team", "Payments team"] },
  upi: { name: "Add a new payment method", layers: 3, streams: ["Payments team"] },
  tracking: { name: "Show the rider live on a map", layers: 3, streams: ["Delivery team"] },
};

export function teamsInvolved(org: Org, ch: Change): string[] {
  if (org === "one") return ORGS.one.teams;
  if (org === "layers") return ORGS.layers.teams.slice(0, CHANGES[ch].layers);
  return CHANGES[ch].streams;
}

/** Possible person-to-person communication paths in a group of n. */
export const pairs = (n: number) => (n * (n - 1)) / 2;
