/** Hunting a leaked API key through git history, then moving secrets to a safer home. Values are fake. */

export interface Commit {
  hash: string;
  when: string;
  msg: string;
  leak?: string;
}

export const HISTORY: Commit[] = [
  {
    hash: "a1b2c3",
    when: "14 months ago",
    msg: "Add payment integration",
    leak: 'PAYMENTS_API_KEY = "sk_live_⟨fake⟩…" committed in config.py',
  },
  { hash: "d4e5f6", when: "14 months ago", msg: "Oops, move key to env var" },
  { hash: "7a8b9c", when: "10 months ago", msg: "Refactor config loading" },
  { hash: "0d1e2f", when: "last week", msg: "Update docs" },
];

export const STAGES = ["Find it", "Revoke it", "Move it", "Scan from now on"] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_TEXT: Record<Stage, { title: string; body: string; wrong?: string }> = {
  "Find it": {
    title: "The key is still in history",
    body: "Commit d4e5f6 “moved it to an env var”, but the earlier commit a1b2c3 still contains it. Anyone who clones or forked the repo has the key.",
    wrong:
      "Deleting the file now does nothing: git keeps every old commit, and clones and forks already have it.",
  },
  "Revoke it": {
    title: "Revoke first",
    body: "Go to the payment provider and revoke the key, then issue a new one. Until you do, the leaked key works no matter what you change in the code.",
  },
  "Move it": {
    title: "Give it a safer home",
    body: "Put the new key in a secrets manager, not the repo. The app reads it at run time; people and systems get access by policy, and every use is logged.",
  },
  "Scan from now on": {
    title: "Catch the next one automatically",
    body: "Turn on secret scanning and push protection so a commit with a key is blocked before it lands, and scan in CI as a backstop.",
  },
};

export type Home = "repo" | "env" | "vault" | "oidc";

export const HOMES: { id: Home; name: string; rank: number; note: string }[] = [
  {
    id: "repo",
    name: "Hard-coded in the repo",
    rank: 0,
    note: "Worst: anyone with the code has the secret, forever, across every clone and fork.",
  },
  {
    id: "env",
    name: "Environment variable from a file",
    rank: 1,
    note: "Better than code, but env vars can leak via logs and crash dumps, and the file still lives somewhere.",
  },
  {
    id: "vault",
    name: "A secrets manager",
    rank: 2,
    note: "Central, access-controlled, logged and rotatable. The standard answer for secrets you must hold.",
  },
  {
    id: "oidc",
    name: "No stored key: short-lived tokens",
    rank: 3,
    note: "Best where possible: CI swaps an identity token for access that expires when the job ends, so there's no long-lived key to leak.",
  },
];
