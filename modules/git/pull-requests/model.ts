import { branch, commit, init, merge, rebase, switchTo, type Repo } from "../_shared/repo";

export const JOURNEY: { who: string; title: string; body: string }[] = [
  {
    who: "You",
    title: "Fork or branch",
    body: "On a project you can't push to, fork it: a copy under your account. On your team's project, just push a branch.",
  },
  {
    who: "You",
    title: "Push the branch",
    body: "git push -u origin add-chai sends your commits. Nothing is merged yet.",
  },
  {
    who: "You",
    title: "Open a pull request",
    body: "Ask to merge add-chai into main, with a description of what and why. GitLab calls this a merge request.",
  },
  {
    who: "Platform",
    title: "Checks run",
    body: "CI builds and tests the branch. A CODEOWNERS file can automatically request reviews from the people who own the changed files.",
  },
  {
    who: "Reviewer",
    title: "Review",
    body: "Comments on lines, suggestions, and a verdict: approve or request changes.",
  },
  {
    who: "You",
    title: "Push fixes",
    body: "New commits on the same branch update the pull request. The checks run again.",
  },
  {
    who: "Platform",
    title: "Rules enforced",
    body: "Branch protection or rulesets can require approvals, passing checks or an up-to-date branch before the merge button works.",
  },
  {
    who: "Maintainer",
    title: "Merge",
    body: "The platform merges with the chosen method. A merge queue can test each pull request against the latest main first.",
  },
];

function base(): Repo {
  let r = commit(init("First menu"), "Add prices");
  r = switchTo(branch(r, "add-chai"), "add-chai");
  r = commit(commit(commit(r, "Add chai to menu"), "wip"), "Fix chai price");
  r = switchTo(r, "main");
  r = commit(r, "Update hours");
  return r;
}

export type Method = "merge" | "squash" | "rebase";

export function after(m: Method): Repo {
  const r = base();
  if (m === "merge") return merge(r, "add-chai", { noFf: true }).repo;
  if (m === "squash") {
    const sq = commit(r, "Add chai to menu (#42)");
    return sq;
  }
  const rb = rebase(switchTo(r, "add-chai"), "main").repo;
  return merge(switchTo(rb, "main"), "add-chai").repo;
}

export const METHOD_INFO: Record<Method, string> = {
  merge:
    "A merge commit with two parents. The branch's three commits stay in history, grouped by the merge.",
  squash:
    "One new commit on main containing all the changes. Tidy, but the individual commits (and the 'wip') are gone from main.",
  rebase:
    "The branch's commits are replayed onto main one by one, then main fast-forwards. A straight line, with every commit kept.",
};

export const PLATFORMS: {
  name: string;
  term: string;
  owners: string;
  rules: string;
  queue: string;
}[] = [
  {
    name: "GitHub",
    term: "Pull request",
    owners: "CODEOWNERS",
    rules: "Rulesets, branch protection",
    queue: "Merge queue",
  },
  {
    name: "GitLab",
    term: "Merge request",
    owners: "CODEOWNERS (paid tiers)",
    rules: "Protected branches, approval rules",
    queue: "Merge trains",
  },
  {
    name: "Bitbucket",
    term: "Pull request",
    owners: ".bitbucket/CODEOWNERS",
    rules: "Branch restrictions, merge checks",
    queue: "—",
  },
  {
    name: "Azure Repos",
    term: "Pull request",
    owners: "Path-based reviewer policies",
    rules: "Branch policies",
    queue: "—",
  },
  {
    name: "Gitea / Forgejo",
    term: "Pull request",
    owners: ".gitea/CODEOWNERS",
    rules: "Protected branches",
    queue: "—",
  },
];
