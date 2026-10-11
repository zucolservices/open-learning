/**
 * A tiny CODEOWNERS matcher (GitHub semantics for the patterns used here: the last matching line
 * wins) and four changed files with the owners the team intends. Teams are made up.
 */

export interface Rule {
  id: string;
  pattern: string;
  owner: string;
}

export const RULES: Rule[] = [
  { id: "sql", pattern: "*.sql", owner: "@db-team" },
  { id: "pay", pattern: "/payments/", owner: "@payments-team" },
  { id: "docs", pattern: "/docs/", owner: "@docs-writers" },
  { id: "all", pattern: "*", owner: "@web-team" },
];

export const FILES: { path: string; want: string }[] = [
  { path: "payments/refund.ts", want: "@payments-team" },
  { path: "payments/schema.sql", want: "@db-team" },
  { path: "docs/setup.md", want: "@docs-writers" },
  { path: "app/home.tsx", want: "@web-team" },
];

export function matches(pattern: string, path: string): boolean {
  if (pattern === "*") return true;
  if (pattern.startsWith("*.")) return path.endsWith(pattern.slice(1));
  if (pattern.startsWith("/") && pattern.endsWith("/")) return path.startsWith(pattern.slice(1));
  return path === pattern;
}

/** The owning rule for a path: the last rule in file order that matches. */
export function owner(order: string[], path: string): Rule | undefined {
  let hit: Rule | undefined;
  for (const id of order) {
    const r = RULES.find((x) => x.id === id)!;
    if (matches(r.pattern, path)) hit = r;
  }
  return hit;
}

export type Count = "one" | "two" | "five";

export const COUNTS: { id: Count; label: string; outcome: string }[] = [
  {
    id: "one",
    label: "One reviewer",
    outcome:
      "Fast and clear: one named person is responsible. Google's median is one reviewer. The risk: only one person learns the change.",
  },
  {
    id: "two",
    label: "Two reviewers",
    outcome:
      "A common norm across many projects (Rigby & Bird, 2013). Often one expert plus one person learning the area.",
  },
  {
    id: "five",
    label: "The whole team",
    outcome:
      "Everyone is notified, so everyone assumes someone else will look, a bit like the bystander effect. Comments barely increase, and the change waits.",
  },
];
