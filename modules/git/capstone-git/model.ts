/**
 * The capstone scenario: a café team's main branch after a stale clone was force-pushed over it.
 * Built with the shared repo model so IDs and the graph are consistent. The team is made up.
 */

import {
  branch,
  commit,
  deleteBranch,
  headCommit,
  init,
  merge,
  switchTo,
  type Repo,
} from "../_shared/repo";

export interface Monday {
  repo: Repo;
  oldTip: string;
  lost: string[];
  samTip: string;
}

export function monday(): Monday {
  let r = init("Set up shop page");
  r = commit(r, "Add menu page");
  const base = headCommit(r);
  const lost: string[] = [];
  for (const m of ["Add order form", "Fix price rounding", "Add opening hours"]) {
    r = commit(r, m);
    lost.push(headCommit(r));
  }
  const oldTip = headCommit(r);
  // Sam's clone was last updated at "Add menu page"; Sam commits and force-pushes it over main
  r = branch(r, "sam", base);
  r = switchTo(r, "sam");
  r = commit(r, "Add dark mode");
  const samTip = headCommit(r);
  r = { ...r, branches: { ...r.branches, main: samTip } };
  r = switchTo(r, "main");
  r = deleteBranch(r, "sam");
  return { repo: r, oldTip, lost, samTip };
}

export type Find = "reflog" | "activity" | "log" | "redo";

export const FINDS: { id: Find; label: string; good: boolean; why: string }[] = [
  {
    id: "reflog",
    label:
      "Ask Ari, who pulled this morning: their clone still has the old tip (origin/main, or the reflog)",
    good: true,
    why: "Any clone that fetched before the force-push still knows the old commit ID. Reflog entries last 90 days by default.",
  },
  {
    id: "activity",
    label: "Check the hosting service's activity log for the force-push",
    good: true,
    why: "Services like GitHub and GitLab record pushes, including the commit a force-push replaced. The old commits usually stay fetchable by ID for a while.",
  },
  {
    id: "log",
    label: "Run git log on main",
    good: false,
    why: "main no longer leads to those commits: that's the problem. log walks backwards from the current tip.",
  },
  {
    id: "redo",
    label: "Rewrite the three features from memory",
    good: false,
    why: "A last resort. The commits almost certainly still exist somewhere; find them first.",
  },
];

export type Fix = "merge" | "cherry" | "force";

export const FIXES: { id: Fix; label: string; verdict: "good" | "ok" | "bad"; why: string }[] = [
  {
    id: "merge",
    label:
      "Branch rescue at the old tip, merge today's main into it, then move main forward with a normal push",
    verdict: "good",
    why: "Everyone's work is kept, the original commit IDs survive, and main only moves forward. No second force-push.",
  },
  {
    id: "cherry",
    label: "Cherry-pick the three lost commits onto today's main",
    verdict: "ok",
    why: "Works, but the copies get new IDs. Teammates whose clones still hold the originals may end up with duplicates.",
  },
  {
    id: "force",
    label: "Force-push the old tip back to main",
    verdict: "bad",
    why: "Sam's dark mode commit is now the one that's lost. Two wrongs: another force-push over shared history.",
  },
];

export function applyFix(m: Monday, fix: Fix | null): Repo {
  let r = m.repo;
  if (fix === "merge") {
    r = branch(r, "rescue", m.oldTip);
    r = switchTo(r, "rescue");
    r = merge(r, "main").repo;
    r = switchTo(r, "main");
    r = merge(r, "rescue").repo;
  } else if (fix === "cherry") {
    for (const id of m.lost) r = commit(r, r.commits[id].msg);
  } else if (fix === "force") {
    r = { ...r, branches: { ...r.branches, main: m.oldTip } };
  }
  return r;
}

export type Kind = "undo" | "rewrite";

export const SITUATIONS: { id: string; label: string; answer: Kind; why: string }[] = [
  {
    id: "bug",
    label: "A bug in a commit merged to main last week",
    answer: "undo",
    why: "Shared history: revert adds a new commit that undoes it.",
  },
  {
    id: "wip",
    label: "Five “wip” commits on your branch, not pushed yet",
    answer: "rewrite",
    why: "Only you have them: squash with an interactive rebase.",
  },
  {
    id: "typo",
    label: "A typo in the message of the commit you just made",
    answer: "rewrite",
    why: "Not pushed: git commit --amend.",
  },
  {
    id: "flag",
    label: "A feature on main that must be switched off before the release",
    answer: "undo",
    why: "Others have built on main: revert (or turn off a feature flag).",
  },
  {
    id: "solo",
    label: "Your own pushed feature branch, before review, that nobody else uses",
    answer: "rewrite",
    why: "Tidy it, then push with --force-with-lease.",
  },
];

export type Guard = "block-force" | "pr" | "checks" | "lease" | "push-protection" | "hooks";

export const GUARDS: { id: Guard; label: string }[] = [
  { id: "block-force", label: "Protect main: block force pushes" },
  { id: "pr", label: "Require a pull request with review" },
  { id: "checks", label: "Require CI checks to pass" },
  { id: "lease", label: "Team habit: --force-with-lease, never --force" },
  { id: "push-protection", label: "Secret scanning push protection" },
  { id: "hooks", label: "Shared pre-commit hooks" },
];

export const INCIDENTS: { id: string; label: string; stoppedBy: Guard[]; partly?: Guard[] }[] = [
  { id: "monday", label: "A stale clone force-pushed over main", stoppedBy: ["block-force"] },
  {
    id: "overwrite",
    label: "A rebased feature branch overwrote a teammate's push to it",
    stoppedBy: ["lease"],
  },
  {
    id: "build",
    label: "A change pushed straight to main broke the build",
    stoppedBy: ["pr", "checks"],
  },
  {
    id: "key",
    label: "An access key reached the server",
    stoppedBy: ["push-protection"],
    partly: ["hooks"],
  },
];

export function incidentStatus(
  i: (typeof INCIDENTS)[number],
  on: Guard[],
): "stopped" | "partly" | "open" {
  if (i.stoppedBy.some((g) => on.includes(g))) return "stopped";
  if (i.partly?.some((g) => on.includes(g))) return "partly";
  return "open";
}

export const CHECKLIST: [string, string[]][] = [
  ["Foundations", ["Commits are snapshots with parents", "Stage deliberately, commit small"]],
  ["Branching", ["Branches are cheap pointers", "Merge or rebase, and resolve conflicts calmly"]],
  [
    "Collaboration",
    ["Fetch before you push", "Review through pull requests", "Write messages that explain why"],
  ],
  ["Undo and recovery", ["Revert shared history, rewrite only your own", "The reflog remembers"]],
  [
    "Scale and security",
    [
      "Partial clone and LFS for big repositories",
      "Never commit secrets; revoke first",
      "Hooks for feedback, CI for enforcement",
    ],
  ],
];
