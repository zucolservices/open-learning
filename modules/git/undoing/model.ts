/** Six everyday mistakes and the right undo for each. Facts per git-restore, git-reset, git-revert. */

export type Cmd = "restore" | "unstage" | "amend" | "soft" | "hard" | "revert";

export const CMDS: { id: Cmd; label: string; rewrites: boolean }[] = [
  { id: "restore", label: "git restore <file>", rewrites: false },
  { id: "unstage", label: "git restore --staged <file>", rewrites: false },
  { id: "amend", label: "git commit --amend", rewrites: true },
  { id: "soft", label: "git reset --soft HEAD~1", rewrites: true },
  { id: "hard", label: "git reset --hard HEAD~2", rewrites: true },
  { id: "revert", label: "git revert <commit>", rewrites: false },
];

export const MISTAKES: { id: string; text: string; answer: Cmd; why: string }[] = [
  {
    id: "m1",
    text: "You edited prices.txt by mistake and haven't staged it. Throw the edits away.",
    answer: "restore",
    why: "Restores the file from the index. Careful: those edits are gone for good.",
  },
  {
    id: "m2",
    text: "You staged secrets.env by accident. Keep the file, just don't commit it.",
    answer: "unstage",
    why: "Copies HEAD's version back into the index; your file is untouched.",
  },
  {
    id: "m3",
    text: "Your last commit's message has a typo. Not pushed yet.",
    answer: "amend",
    why: "Replaces the last commit with a corrected one (a new commit ID).",
  },
  {
    id: "m4",
    text: "You committed too early. Undo the commit but keep its changes staged.",
    answer: "soft",
    why: "Moves the branch back one commit and leaves index and files as they were.",
  },
  {
    id: "m5",
    text: "Your last two local commits are junk, and so are your current edits. Start clean.",
    answer: "hard",
    why: "Moves the branch back and resets the index and working tree. Uncommitted edits are lost.",
  },
  {
    id: "m6",
    text: "A commit pushed yesterday broke checkout. The team has pulled it.",
    answer: "revert",
    why: "Adds a commit that undoes it, without rewriting shared history.",
  },
];

export type Mode = "soft" | "mixed" | "hard";

export const MODES: Record<Mode, { branch: boolean; index: boolean; tree: boolean; note: string }> =
  {
    soft: {
      branch: true,
      index: false,
      tree: false,
      note: "Only the branch moves back. The undone commit's changes are still staged, ready to recommit.",
    },
    mixed: {
      branch: true,
      index: true,
      tree: false,
      note: "The default. Branch and index move back; the changes are still in your files, unstaged.",
    },
    hard: {
      branch: true,
      index: true,
      tree: true,
      note: "Branch, index and files all go back. Uncommitted edits are gone; committed work can still be found in the reflog.",
    },
  };
