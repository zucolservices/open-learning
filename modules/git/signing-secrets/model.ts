/** Spot an impostor commit, then clean up a leaked secret in the right order. All values made up. */

export const LOG: {
  id: string;
  author: string;
  msg: string;
  status: "verified" | "unverified" | "none";
}[] = [
  { id: "a17c3e0", author: "Meera (maintainer)", msg: "Release 2.3", status: "verified" },
  {
    id: "5b02d9f",
    author: "Meera (maintainer)",
    msg: "Update payment endpoint URL",
    status: "none",
  },
  { id: "c94e1a2", author: "Tom", msg: "Fix footer spacing", status: "verified" },
  { id: "e3d8f77", author: "Kavya", msg: "Add chai photos", status: "verified" },
];
export const IMPOSTOR = "5b02d9f";

export const STEPS: { id: string; label: string; order: number; why: string }[] = [
  {
    id: "revoke",
    label: "Revoke the key and issue a new one",
    order: 1,
    why: "Assume it's already copied. Bots scan public pushes within minutes.",
  },
  {
    id: "rewrite",
    label: "Remove it from history with git filter-repo",
    order: 2,
    why: "Git's own docs recommend filter-repo over the old filter-branch.",
  },
  {
    id: "push",
    label: "Force-push the cleaned branches and tags",
    order: 3,
    why: "Replaces the server's history (coordinate with the team first).",
  },
  {
    id: "reclone",
    label: "Ask everyone to re-clone or reset to the new history",
    order: 4,
    why: "Old clones, forks and caches still contain the key, which is why step 1 matters most.",
  },
  {
    id: "prevent",
    label: "Turn on secret scanning and a pre-commit hook",
    order: 5,
    why: "Stop the next leak before it's pushed.",
  },
];
