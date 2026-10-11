/**
 * A tiny, pure model of a Git repository for in-browser simulations: commits with parents,
 * branches as pointers, and HEAD. Commit IDs are short deterministic hashes of the content, so the
 * same operations always give the same IDs. It models history only, not file contents.
 */

export interface Commit {
  id: string;
  parents: string[];
  msg: string;
  /** Visual lane, fixed when the commit is created. */
  lane: number;
  /** Order of creation, used for x position. */
  seq: number;
}

export interface Repo {
  commits: Record<string, Commit>;
  branches: Record<string, string>;
  /** Lane for each branch name. */
  lanes: Record<string, number>;
  head: { branch: string } | { detached: string };
  seq: number;
}

function hash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

export function init(msg = "Initial commit", branch = "main"): Repo {
  const id = hash(`root:${msg}`);
  return {
    commits: { [id]: { id, parents: [], msg, lane: 0, seq: 0 } },
    branches: { [branch]: id },
    lanes: { [branch]: 0 },
    head: { branch },
    seq: 1,
  };
}

export const headCommit = (r: Repo): string =>
  "branch" in r.head ? r.branches[r.head.branch] : r.head.detached;

export const currentBranch = (r: Repo): string | null =>
  "branch" in r.head ? r.head.branch : null;

function laneNow(r: Repo): number {
  const b = currentBranch(r);
  if (b) return r.lanes[b] ?? 0;
  // detached HEAD: its own lane below every branch, so it never looks like part of one
  return Math.max(0, ...Object.values(r.lanes)) + 1;
}

function add(r: Repo, parents: string[], msg: string, lane: number): [Repo, string] {
  const id = hash(`${parents.join(",")}:${msg}:${r.seq}`);
  const commits = { ...r.commits, [id]: { id, parents, msg, lane, seq: r.seq } };
  return [{ ...r, commits, seq: r.seq + 1 }, id];
}

function moveHead(r: Repo, id: string): Repo {
  const b = currentBranch(r);
  return b ? { ...r, branches: { ...r.branches, [b]: id } } : { ...r, head: { detached: id } };
}

export function commit(r: Repo, msg: string): Repo {
  const [r2, id] = add(r, [headCommit(r)], msg, laneNow(r));
  return moveHead(r2, id);
}

export function branch(r: Repo, name: string, at = headCommit(r)): Repo {
  if (r.branches[name]) return r;
  const lane = Math.max(-1, ...Object.values(r.lanes)) + 1;
  return { ...r, branches: { ...r.branches, [name]: at }, lanes: { ...r.lanes, [name]: lane } };
}

export function switchTo(r: Repo, target: string): Repo {
  if (r.branches[target]) return { ...r, head: { branch: target } };
  if (r.commits[target]) return { ...r, head: { detached: target } };
  return r;
}

export function deleteBranch(r: Repo, name: string): Repo {
  if (currentBranch(r) === name) return r;
  const branches = { ...r.branches };
  delete branches[name];
  return { ...r, branches };
}

export function ancestors(r: Repo, id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const c = stack.pop()!;
    if (seen.has(c) || !r.commits[c]) continue;
    seen.add(c);
    stack.push(...r.commits[c].parents);
  }
  return seen;
}

export function mergeBase(r: Repo, a: string, b: string): string | null {
  const A = ancestors(r, a);
  const common = [...ancestors(r, b)].filter((x) => A.has(x));
  if (!common.length) return null;
  // the common ancestor that is not an ancestor of another common ancestor; pick the newest
  return common.sort((x, y) => r.commits[y].seq - r.commits[x].seq)[0];
}

export type MergeKind = "up-to-date" | "fast-forward" | "merge";

export function merge(
  r: Repo,
  name: string,
  opts: { noFf?: boolean } = {},
): { repo: Repo; kind: MergeKind } {
  const ours = headCommit(r);
  const theirs = r.branches[name] ?? name;
  if (ancestors(r, ours).has(theirs)) return { repo: r, kind: "up-to-date" };
  if (ancestors(r, theirs).has(ours) && !opts.noFf)
    return { repo: moveHead(r, theirs), kind: "fast-forward" };
  const [r2, id] = add(r, [ours, theirs], `Merge ${name}`, laneNow(r));
  return { repo: moveHead(r2, id), kind: "merge" };
}

/** Commits on the current branch that aren't reachable from `onto`, oldest first. */
export function ownCommits(r: Repo, onto: string): string[] {
  const base = ancestors(r, r.branches[onto] ?? onto);
  return [...ancestors(r, headCommit(r))]
    .filter((c) => !base.has(c))
    .sort((a, b) => r.commits[a].seq - r.commits[b].seq);
}

export function rebase(r: Repo, onto: string): { repo: Repo; copied: [string, string][] } {
  const own = ownCommits(r, onto).filter((c) => r.commits[c].parents.length < 2);
  let repo = r;
  let tip = r.branches[onto] ?? onto;
  const lane = laneNow(r);
  const copied: [string, string][] = [];
  for (const c of own) {
    const [r2, id] = add(repo, [tip], r.commits[c].msg, lane);
    repo = r2;
    copied.push([c, id]);
    tip = id;
  }
  return { repo: moveHead(repo, tip), copied };
}

export function resetTo(r: Repo, id: string): Repo {
  return moveHead(r, id);
}

export function cherryPick(r: Repo, id: string): Repo {
  return commit(r, r.commits[id].msg);
}

export function revert(r: Repo, id: string): Repo {
  return commit(r, `Revert "${r.commits[id].msg}"`);
}

/** Commits reachable from any branch or HEAD. */
export function reachable(r: Repo): Set<string> {
  const out = new Set<string>();
  for (const id of [...Object.values(r.branches), headCommit(r)])
    for (const c of ancestors(r, id)) out.add(c);
  return out;
}
