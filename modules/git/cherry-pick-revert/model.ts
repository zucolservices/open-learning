import { branch, cherryPick, commit, init, revert, switchTo, type Repo } from "../_shared/repo";

export interface Frame {
  cmd: string;
  title: string;
  body: string;
  repo: Repo;
  hot: string[];
}

function build(): Frame[] {
  const f: Frame[] = [];
  let r = commit(init("First menu"), "Add prices");
  r = branch(r, "release-1.0");
  r = commit(commit(r, "New ordering page"), "Loyalty points");
  r = commit(r, "Fix wrong GST on bills");
  const fix = Object.values(r.commits).find((c) => c.msg.startsWith("Fix wrong GST"))!.id;
  f.push({
    cmd: "git log --oneline main",
    title: "A fix lands on main",
    body: "main has new features and, on top, an urgent bug fix. The live site runs the release-1.0 branch, which has none of them.",
    repo: r,
    hot: [fix],
  });
  r = switchTo(r, "release-1.0");
  f.push({
    cmd: "git switch release-1.0",
    title: "Go to the release branch",
    body: "We want only the fix on the release, not the unfinished features.",
    repo: r,
    hot: [fix],
  });
  r = cherryPick(r, fix);
  const copy = Object.values(r.commits).find(
    (c) => c.msg.startsWith("Fix wrong GST") && c.id !== fix,
  )!.id;
  f.push({
    cmd: `git cherry-pick -x ${fix.slice(0, 7)}`,
    title: "Copy just that commit",
    body: "Cherry-pick applies the fix's change as a new commit on release-1.0. With -x, the message notes which commit it came from.",
    repo: r,
    hot: [fix, copy],
  });
  r = switchTo(r, "main");
  r = commit(r, "Holiday banner");
  const bad = Object.values(r.commits).find((c) => c.msg === "Loyalty points")!.id;
  f.push({
    cmd: "git switch main · git commit",
    title: "A problem is found",
    body: "The loyalty points feature, already pushed and shared, turns out to double-count. It must be undone.",
    repo: r,
    hot: [bad],
  });
  r = revert(r, bad);
  const rev = Object.values(r.commits).find((c) => c.msg.startsWith("Revert"))!.id;
  f.push({
    cmd: `git revert ${bad.slice(0, 7)}`,
    title: "Undo it with a new commit",
    body: "Revert adds a commit that does the exact opposite. History isn't rewritten, so everyone's copies stay valid.",
    repo: r,
    hot: [bad, rev],
  });
  return f;
}

export const FRAMES = build();
