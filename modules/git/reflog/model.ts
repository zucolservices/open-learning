import { branch, commit, deleteBranch, init, resetTo, switchTo, type Repo } from "../_shared/repo";

export interface Entry {
  ref: string;
  id: string;
  action: string;
}

export function startRepo(): { repo: Repo; log: Entry[] } {
  let r = init("First menu");
  const log: Entry[] = [];
  const push = (action: string) => log.unshift({ ref: "", id: r.branches.main ?? "", action });
  push("commit (initial): First menu");
  for (const m of ["Add prices", "New logo", "Monsoon specials", "Specials photos"]) {
    r = commit(r, m);
    push(`commit: ${m}`);
  }
  return { repo: r, log };
}

export function hardReset(repo: Repo, log: Entry[]): { repo: Repo; log: Entry[] } {
  const ids = Object.values(repo.commits)
    .sort((a, b) => a.seq - b.seq)
    .map((c) => c.id);
  const target = ids[ids.length - 3];
  const r = resetTo(repo, target);
  return { repo: r, log: [{ ref: "", id: target, action: `reset: moving to HEAD~2` }, ...log] };
}

export function restore(repo: Repo, log: Entry[], id: string): { repo: Repo; log: Entry[] } {
  const r = branch(repo, "rescue", id);
  return { repo: r, log };
}

export function withRefs(log: Entry[]): Entry[] {
  return log.map((e, i) => ({ ...e, ref: `HEAD@{${i}}` }));
}

export function deletedBranchRepo(): Repo {
  let r = commit(init("First menu"), "Add prices");
  r = switchTo(branch(r, "experiment"), "experiment");
  r = commit(commit(r, "Try dark theme"), "Dark theme photos");
  r = switchTo(r, "main");
  return deleteBranch(r, "experiment");
}
