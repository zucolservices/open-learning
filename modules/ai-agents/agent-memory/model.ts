/** What an assistant can remember a week later, depending on which memories it has. Illustrative. */

export type Kind = "episodic" | "semantic" | "procedural";

export const MEMORIES: {
  id: string;
  kind: Kind;
  text: string;
  sensitive?: boolean;
  used?: string;
}[] = [
  { id: "team", kind: "semantic", text: "The team is 12 people.", used: "Books for twelve." },
  {
    id: "veg",
    kind: "semantic",
    text: "Asha is vegetarian.",
    used: "Picks a restaurant with a good vegetarian menu.",
  },
  {
    id: "noisy",
    kind: "episodic",
    text: "Last offsite (Sept): the venue was too noisy to talk.",
    used: "Avoids loud venues; asks for a private room.",
  },
  {
    id: "budget",
    kind: "procedural",
    text: "Rule learned: confirm the budget before booking anything.",
    used: "Asks for the budget first.",
  },
  { id: "card", kind: "semantic", text: "Asha's card ends 4242, expiry 08/28.", sensitive: true },
];

export const RANK: {
  id: string;
  text: string;
  daysAgo: number;
  importance: number;
  relevance: number;
}[] = [
  { id: "a", text: "Asha is vegetarian", daysAgo: 30, importance: 7, relevance: 0.9 },
  {
    id: "b",
    text: "Lunch order yesterday: paneer wrap",
    daysAgo: 1,
    importance: 2,
    relevance: 0.6,
  },
  {
    id: "c",
    text: "Last offsite venue was too noisy",
    daysAgo: 14,
    importance: 8,
    relevance: 0.85,
  },
  { id: "d", text: "Prefers dark mode in apps", daysAgo: 3, importance: 2, relevance: 0.05 },
  { id: "e", text: "Team grew to 12 people", daysAgo: 60, importance: 6, relevance: 0.7 },
];

export function score(
  m: (typeof RANK)[number],
  use: { recency: boolean; importance: boolean; relevance: boolean },
) {
  const r = use.recency ? Math.pow(0.97, m.daysAgo) : 0;
  const i = use.importance ? m.importance / 10 : 0;
  const v = use.relevance ? m.relevance : 0;
  return r + i + v;
}
