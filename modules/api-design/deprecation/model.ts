/** A twelve-month sunset for API v1: which clients move, and which get stranded (illustrative). */

export type Action = "email" | "headers" | "outreach" | "guide" | "brownout";

export const ACTIONS: { id: Action; label: string; month: number; note: string }[] = [
  {
    id: "email",
    label: "Announce by email and blog",
    month: 0,
    note: "Reaches people who read announcements.",
  },
  {
    id: "headers",
    label: "Deprecation and Sunset headers",
    month: 0,
    note: "Every v1 response says it's going, and when.",
  },
  {
    id: "guide",
    label: "Publish a migration guide",
    month: 1,
    note: "Shows exactly what changes in v2, with examples.",
  },
  {
    id: "outreach",
    label: "Track usage, contact remaining callers",
    month: 4,
    note: "Usage by API key shows who's left; you write to each.",
  },
  {
    id: "brownout",
    label: "Brownouts at months 9 and 11",
    month: 9,
    note: "v1 is switched off for an hour at a time, announced in advance.",
  },
];

/** Each client migrates in the month given if the channel reaches it, or stays stranded. */
export const CLIENTS: {
  id: string;
  name: string;
  migrate: (on: Action[]) => number | null;
}[] = [
  {
    id: "partner",
    name: "Large payments partner",
    migrate: (a) => (a.includes("email") ? 3 : a.includes("outreach") ? 6 : null),
  },
  {
    id: "internal",
    name: "Your own reporting dashboard",
    migrate: (a) => (a.includes("email") ? 2 : a.includes("outreach") ? 5 : null),
  },
  {
    id: "sdk",
    name: "Partner using your SDK (it logs warnings)",
    migrate: (a) => (a.includes("headers") ? 4 : a.includes("outreach") ? 6 : null),
  },
  {
    id: "complex",
    name: "Partner with a complex integration",
    migrate: (a) =>
      !(a.includes("email") || a.includes("outreach")) ? null : a.includes("guide") ? 8 : null,
  },
  {
    id: "agency",
    name: "Shop app built by an agency that has moved on",
    migrate: (a) => (a.includes("outreach") ? 7 : null),
  },
  {
    id: "hobby",
    name: "A hobbyist's script",
    migrate: (a) => (a.includes("brownout") ? 10 : null),
  },
  {
    id: "batch",
    name: "A bank's nightly batch job",
    migrate: (a) => (a.includes("outreach") ? 8 : a.includes("brownout") ? 10 : null),
  },
  { id: "dead", name: "An integration nobody uses any more", migrate: () => null },
];

export function plan(on: Action[]) {
  const rows = CLIENTS.map((c) => ({ ...c, at: c.migrate(on) }));
  const left = Array.from(
    { length: 13 },
    (_, m) => rows.filter((r) => r.at === null || r.at > m).length,
  );
  const stranded = rows.filter((r) => r.at === null && r.id !== "dead");
  return { rows, left, stranded };
}
