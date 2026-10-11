"use client";

import { useState } from "react";
import { CommitGraph } from "@/modules/git/_shared/graph";
import {
  branch,
  commit,
  currentBranch,
  init,
  merge,
  rebase,
  switchTo,
  type Repo,
} from "@/modules/git/_shared/repo";

function start(): Repo {
  let r = init("Initial commit");
  r = commit(r, "Add menu");
  r = branch(r, "feature");
  r = switchTo(r, "feature");
  r = commit(r, "Add order form");
  r = switchTo(r, "main");
  return commit(r, "Fix typo");
}

/** A taste of modules 6 and 8: merge or rebase a feature branch and watch the graph change. */
export function GitTaste() {
  const [r, setR] = useState<Repo>(start);
  const [note, setNote] = useState("Two branches have moved apart. Merge or rebase them.");
  const on = currentBranch(r);
  const act = (f: (x: Repo) => [Repo, string]) => {
    const [next, msg] = f(r);
    setR(next);
    setNote(msg);
  };
  const buttons: [string, () => void][] = [
    [
      `Commit on ${on}`,
      () =>
        act((x) => [
          commit(x, on === "main" ? "Tweak styles" : "Validate form"),
          `New commit on ${on}.`,
        ]),
    ],
    [
      on === "main" ? "Switch to feature" : "Switch to main",
      () => act((x) => [switchTo(x, on === "main" ? "feature" : "main"), "HEAD moved."]),
    ],
    [
      "Merge feature into main",
      () =>
        act((x) => {
          const res = merge(switchTo(x, "main"), "feature");
          return [
            res.repo,
            res.kind === "merge" ? "A merge commit with two parents." : `Merge: ${res.kind}.`,
          ];
        }),
    ],
    [
      "Rebase feature onto main",
      () =>
        act((x) => {
          const res = rebase(switchTo(x, "feature"), "main");
          return [
            res.repo,
            `Replayed ${res.copied.length} commit(s): new IDs, straight line. The originals fade.`,
          ];
        }),
    ],
    ["Reset", () => (setR(start()), setNote("Back to the start."))],
  ];
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <CommitGraph repo={r} className="[&_svg]:max-w-full" />
      <div className="flex flex-wrap gap-1.5">
        {buttons.map(([l, f]) => (
          <button
            key={l}
            type="button"
            onClick={f}
            className="border-line-strong hover:border-accent rounded-full border px-3 py-1 text-xs"
          >
            {l}
          </button>
        ))}
      </div>
      <p className="text-subtle text-[11px]">{note}</p>
    </div>
  );
}
