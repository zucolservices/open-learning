import { branch, commit, init, merge, rebase, switchTo, type Repo } from "../_shared/repo";

export function diverged(): Repo {
  let r = commit(init("First menu"), "Add prices");
  r = switchTo(branch(r, "specials"), "specials");
  r = commit(commit(r, "Specials page"), "Specials photos");
  r = switchTo(r, "main");
  r = commit(commit(r, "Update hours"), "Fix footer");
  return switchTo(r, "specials");
}

export function afterRebase(): { repo: Repo; copied: [string, string][] } {
  return rebase(diverged(), "main");
}

export function afterFf(): Repo {
  const r = switchTo(afterRebase().repo, "main");
  return merge(r, "specials").repo;
}

export function viaMerge(): Repo {
  return merge(switchTo(diverged(), "main"), "specials").repo;
}

export type Action = "pick" | "reword" | "squash" | "fixup" | "drop";

export const TODO: { id: string; msg: string; suggest: Action }[] = [
  { id: "a1", msg: "Specials page", suggest: "pick" },
  { id: "b2", msg: "wip", suggest: "squash" },
  { id: "c3", msg: "fix typo in specials", suggest: "fixup" },
  { id: "d4", msg: "debug logging, remove later", suggest: "drop" },
  { id: "e5", msg: "specials photos", suggest: "reword" },
];

export function preview(actions: Record<string, Action>): { msg: string; note: string }[] {
  const out: { msg: string; note: string }[] = [];
  for (const t of TODO) {
    const a = actions[t.id] ?? "pick";
    if (a === "drop") continue;
    if ((a === "squash" || a === "fixup") && out.length) {
      const last = out[out.length - 1];
      out[out.length - 1] = {
        msg: last.msg,
        note: `${last.note ? last.note + "; " : ""}${a === "squash" ? `squashed in "${t.msg}" (messages combined)` : `fixed up with "${t.msg}" (message discarded)`}`,
      };
      continue;
    }
    out.push({
      msg: a === "reword" ? "Add photos to the specials page" : t.msg,
      note: a === "reword" ? "message reworded" : "",
    });
  }
  return out;
}
