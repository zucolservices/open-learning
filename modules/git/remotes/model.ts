import { ancestors, branch, commit, init, merge, rebase, type Repo } from "../_shared/repo";

/**
 * Three copies of one repository: a server and two laptops. Each laptop keeps a remote-tracking
 * branch, origin/main, recording where the server's main was when it last fetched. Since Git 2.33.1,
 * `git pull` refuses to reconcile diverged branches unless you choose merge or rebase.
 */

export type Who = "kavya" | "tom";
export type PullMode = "unset" | "merge" | "rebase";

export interface World {
  server: Repo;
  kavya: Repo;
  tom: Repo;
  n: number;
}

function withOrigin(r: Repo): Repo {
  const b = branch(r, "origin/main", r.branches.main);
  return { ...b, head: { branch: "main" } };
}

export function start(): World {
  const server = commit(init("First menu"), "Add prices");
  return { server, kavya: withOrigin(server), tom: withOrigin(server), n: 0 };
}

function importFrom(local: Repo, from: Repo, tip: string): Repo {
  const lane = local.lanes["origin/main"] ?? 0;
  const keep = ancestors(from, tip);
  const commits = { ...local.commits };
  let seq = local.seq;
  for (const c of Object.values(from.commits).sort((a, b) => a.seq - b.seq)) {
    if (keep.has(c.id) && !commits[c.id]) commits[c.id] = { ...c, lane, seq: seq++ };
  }
  return { ...local, commits, seq };
}

export function localCommit(w: World, who: Who, msg: string): World {
  return { ...w, [who]: commit(w[who], msg), n: w.n + 1 };
}

export function push(w: World, who: Who): { world: World; msg: string; ok: boolean } {
  const local = w[who];
  const serverTip = w.server.branches.main;
  if (!ancestors(local, local.branches.main).has(serverTip)) {
    return {
      world: w,
      ok: false,
      msg: "! [rejected] main -> main (fetch first). The server has commits you don't. Pull first.",
    };
  }
  if (local.branches.main === serverTip)
    return { world: w, ok: true, msg: "Everything up-to-date." };
  let server = importFrom(w.server, local, local.branches.main);
  server = { ...server, branches: { ...server.branches, main: local.branches.main } };
  const updated = { ...local, branches: { ...local.branches, "origin/main": local.branches.main } };
  return {
    world: { ...w, server, [who]: updated },
    ok: true,
    msg: "main -> main: the server's main now matches yours.",
  };
}

export function fetch(w: World, who: Who): { world: World; msg: string } {
  let local = importFrom(w[who], w.server, w.server.branches.main);
  local = { ...local, branches: { ...local.branches, "origin/main": w.server.branches.main } };
  return {
    world: { ...w, [who]: local },
    msg: "Fetched: origin/main updated. Your main and working files are untouched.",
  };
}

export function pull(
  w: World,
  who: Who,
  mode: PullMode,
): { world: World; msg: string; ok: boolean } {
  const f = fetch(w, who).world;
  let local = f[who];
  const ours = local.branches.main;
  const theirs = local.branches["origin/main"];
  if (ancestors(local, ours).has(theirs)) return { world: f, ok: true, msg: "Already up to date." };
  if (ancestors(local, theirs).has(ours)) {
    local = { ...local, branches: { ...local.branches, main: theirs } };
    return {
      world: { ...f, [who]: local },
      ok: true,
      msg: "Fast-forward: main moved to origin/main.",
    };
  }
  if (mode === "unset")
    return {
      world: f,
      ok: false,
      msg: "fatal: Need to specify how to reconcile divergent branches. (Choose merge or rebase: git config pull.rebase false|true)",
    };
  local = mode === "merge" ? merge(local, "origin/main").repo : rebase(local, "origin/main").repo;
  return {
    world: { ...f, [who]: local },
    ok: true,
    msg:
      mode === "merge" ? "Merged origin/main into main." : "Rebased your commits onto origin/main.",
  };
}

export function aheadBehind(r: Repo): { ahead: number; behind: number } {
  const a = ancestors(r, r.branches.main);
  const b = ancestors(r, r.branches["origin/main"]);
  return {
    ahead: [...a].filter((x) => !b.has(x)).length,
    behind: [...b].filter((x) => !a.has(x)).length,
  };
}
