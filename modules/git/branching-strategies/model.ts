import { branch, commit, init, merge, switchTo, type Repo } from "../_shared/repo";

export type Strategy = "gitflow" | "github" | "trunk";

function gitflow(): Repo {
  let r = init("1.0 released");
  r = switchTo(branch(r, "develop"), "develop");
  r = commit(r, "Start 1.1");
  r = switchTo(branch(r, "feature/chai"), "feature/chai");
  r = commit(commit(r, "Chai menu"), "Chai photos");
  r = switchTo(r, "develop");
  r = merge(r, "feature/chai", { noFf: true }).repo;
  r = switchTo(branch(r, "release/1.1"), "release/1.1");
  r = commit(r, "Bump version 1.1");
  r = switchTo(r, "main");
  r = merge(r, "release/1.1", { noFf: true }).repo;
  r = switchTo(r, "develop");
  r = merge(r, "release/1.1", { noFf: true }).repo;
  return r;
}

function github(): Repo {
  let r = init("Live site");
  for (const [b, m] of [
    ["chai", "Chai menu"],
    ["hours", "New hours"],
    ["photos", "Photos"],
  ] as const) {
    r = switchTo(branch(r, b), b);
    r = commit(r, m);
    r = switchTo(r, "main");
    r = merge(r, b, { noFf: true }).repo;
  }
  return r;
}

function trunk(): Repo {
  let r = init("Live site");
  for (const m of ["Chai behind a flag", "Hours", "Chai photos", "Fix", "Turn chai flag on"])
    r = commit(r, m);
  return r;
}

export const REPOS: Record<Strategy, () => Repo> = { gitflow, github, trunk };

export const INFO: Record<
  Strategy,
  { name: string; body: string; stats: [string, string][]; fits: string }
> = {
  gitflow: {
    name: "GitFlow",
    body: "Two long-lived branches, main for releases and develop for integration, plus feature, release and hotfix branches. Described by Vincent Driessen in 2010.",
    stats: [
      ["Long-lived branches", "2 plus releases"],
      ["Integration", "When a feature finishes"],
      ["Releases", "Planned, versioned"],
    ],
    fits: "Software shipped as versions that must be supported in parallel, like installed apps or libraries.",
  },
  github: {
    name: "GitHub flow",
    body: "One main branch that's always deployable. Every change is a short branch, a pull request, a review and a merge, then deploy.",
    stats: [
      ["Long-lived branches", "1"],
      ["Integration", "Every pull request"],
      ["Releases", "Continuous"],
    ],
    fits: "Web apps and services deployed often, with one live version.",
  },
  trunk: {
    name: "Trunk-based development",
    body: "Everyone commits small changes to the trunk (main) at least daily, directly or via very short branches. Unfinished work hides behind feature flags.",
    stats: [
      ["Long-lived branches", "1"],
      ["Integration", "At least daily"],
      ["Releases", "Continuous, or cut from trunk"],
    ],
    fits: "Teams with strong automated tests who want the smallest, most frequent merges.",
  },
};
