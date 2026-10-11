/** Two ways to handle an interruption: stash, or a second worktree. Behaviour per git-stash, git-worktree. */

export interface Folder {
  path: string;
  branch: string;
  dirty: string[];
}

export interface Frame {
  cmd: string;
  note: string;
  folders: Folder[];
  stash: string[];
}

export const STASH: Frame[] = [
  {
    cmd: "(working on specials)",
    note: "Two files half-edited on the specials branch. Then: the checkout page is broken on main. Fix it now.",
    folders: [{ path: "~/cafe", branch: "specials", dirty: ["menu.html", "specials.css"] }],
    stash: [],
  },
  {
    cmd: 'git stash push -m "half-done specials"',
    note: "Your edits are tucked away in the stash; the working tree is clean.",
    folders: [{ path: "~/cafe", branch: "specials", dirty: [] }],
    stash: ["stash@{0}: On specials: half-done specials"],
  },
  {
    cmd: "git switch main",
    note: "Switching is safe now that nothing is uncommitted.",
    folders: [{ path: "~/cafe", branch: "main", dirty: [] }],
    stash: ["stash@{0}: On specials: half-done specials"],
  },
  {
    cmd: 'git commit -am "Fix checkout total"',
    note: "The urgent fix is committed on main (and pushed).",
    folders: [{ path: "~/cafe", branch: "main", dirty: [] }],
    stash: ["stash@{0}: On specials: half-done specials"],
  },
  {
    cmd: "git switch specials",
    note: "Back to where you were, minus the edits.",
    folders: [{ path: "~/cafe", branch: "specials", dirty: [] }],
    stash: ["stash@{0}: On specials: half-done specials"],
  },
  {
    cmd: "git stash pop",
    note: "The edits come back and the stash entry is removed. You're exactly where you left off.",
    folders: [{ path: "~/cafe", branch: "specials", dirty: ["menu.html", "specials.css"] }],
    stash: [],
  },
];

export const WORKTREE: Frame[] = [
  {
    cmd: "(working on specials)",
    note: "Same interruption. This time, leave your half-done work exactly where it is.",
    folders: [{ path: "~/cafe", branch: "specials", dirty: ["menu.html", "specials.css"] }],
    stash: [],
  },
  {
    cmd: "git worktree add -b hotfix ../cafe-hotfix main",
    note: "A second folder, sharing the same repository, checked out on a new hotfix branch from main. (A branch can't be checked out in two worktrees at once.)",
    folders: [
      { path: "~/cafe", branch: "specials", dirty: ["menu.html", "specials.css"] },
      { path: "~/cafe-hotfix", branch: "hotfix", dirty: [] },
    ],
    stash: [],
  },
  {
    cmd: 'cd ../cafe-hotfix · git commit -am "Fix checkout total"',
    note: "Fix and commit in the second folder. Your specials edits are untouched in the first.",
    folders: [
      { path: "~/cafe", branch: "specials", dirty: ["menu.html", "specials.css"] },
      { path: "~/cafe-hotfix", branch: "hotfix", dirty: [] },
    ],
    stash: [],
  },
  {
    cmd: "git push -u origin hotfix",
    note: "Push the fix for review; the commit is already in the shared repository both folders use.",
    folders: [
      { path: "~/cafe", branch: "specials", dirty: ["menu.html", "specials.css"] },
      { path: "~/cafe-hotfix", branch: "hotfix", dirty: [] },
    ],
    stash: [],
  },
  {
    cmd: "git worktree remove ../cafe-hotfix",
    note: "Remove the extra folder when you're done. The branch and its commits remain.",
    folders: [{ path: "~/cafe", branch: "specials", dirty: ["menu.html", "specials.css"] }],
    stash: [],
  },
];
