import { branch, commit, init, merge, switchTo, type Repo } from "../_shared/repo";

/** Frames for the history step-through, each a Repo snapshot plus the command that made it. */
export interface Frame {
  cmd: string;
  title: string;
  body: string;
  repo: Repo;
}

function build(): Frame[] {
  const f: Frame[] = [];
  let r = init("First menu");
  f.push({
    cmd: "git commit",
    title: "The root commit",
    body: "The very first commit has no parent. main points to it, and HEAD points to main.",
    repo: r,
  });
  r = commit(r, "Add prices");
  f.push({
    cmd: "git commit",
    title: "A child points to its parent",
    body: "The new commit stores its parent's ID. main moves forward; the old commit is untouched.",
    repo: r,
  });
  r = commit(r, "Fix typo");
  f.push({
    cmd: "git commit",
    title: "A chain of snapshots",
    body: "History is just this chain, read backwards from the newest commit by following parent links.",
    repo: r,
  });
  r = branch(r, "specials");
  r = switchTo(r, "specials");
  r = commit(r, "Monsoon specials");
  f.push({
    cmd: "git switch -c specials · git commit",
    title: "History can fork",
    body: "Two commits can share a parent. Each line of work has its own name; we'll cover branches next module.",
    repo: r,
  });
  r = switchTo(r, "main");
  r = commit(r, "Update opening hours");
  f.push({
    cmd: "git switch main · git commit",
    title: "Both lines move on",
    body: "Now main and specials have each added a commit since they split.",
    repo: r,
  });
  r = merge(r, "specials").repo;
  f.push({
    cmd: "git merge specials",
    title: "A commit with two parents",
    body: "A merge commit joins the lines back together. Its two parents make history a graph, not just a line.",
    repo: r,
  });
  const root = Object.values(r.commits).find((c) => c.parents.length === 0)!.id;
  const second = Object.values(r.commits).find((c) => c.msg === "Add prices")!.id;
  r = switchTo(r, second);
  f.push({
    cmd: "git switch --detach " + second.slice(0, 7),
    title: "Detached HEAD",
    body: "Check out an old commit directly and HEAD points at that commit, not a branch. You can look around safely.",
    repo: r,
  });
  r = commit(r, "Experiment");
  f.push({
    cmd: "git commit",
    title: "Commits with no branch",
    body: "Commit while detached and the new commit has no branch name. Switch away and nothing points to it.",
    repo: r,
  });
  r = switchTo(r, "main");
  f.push({
    cmd: "git switch main",
    title: "Left behind",
    body: "The experiment is now unreachable (faded). Git will keep it for a while, but it's easy to lose. Create a branch first if you want to keep it.",
    repo: r,
  });
  void root;
  return f;
}

export const FRAMES = build();
