/** A messy branch to clean up, and a Conventional Commits builder. */

export interface Messy {
  id: string;
  msg: string;
  options: { text: string; ok: boolean; why: string }[];
}

export const MESSY: Messy[] = [
  {
    id: "wip",
    msg: "wip",
    options: [
      {
        text: "Add specials page with seasonal menu",
        ok: true,
        why: "Says what the commit does, in the imperative.",
      },
      { text: "Work in progress on stuff", ok: false, why: "Still says nothing about the change." },
      {
        text: "Added the specials page.",
        ok: false,
        why: "Close, but Git's own convention is the imperative ('Add') and no full stop.",
      },
    ],
  },
  {
    id: "fix",
    msg: "fix",
    options: [
      { text: "Fix", ok: false, why: "Fix what? Six months from now, nobody will know." },
      {
        text: "Fix GST rounding on bills over ₹1,000",
        ok: true,
        why: "Specific enough to find with git log --grep.",
      },
      {
        text: "Fixes a bug that Tom found yesterday in the code",
        ok: false,
        why: "Wordy, and 'yesterday' means nothing later.",
      },
    ],
  },
  {
    id: "mixed",
    msg: "specials page, footer fix, update deps",
    options: [
      {
        text: "Split into three commits",
        ok: true,
        why: "Each can be reviewed, reverted or cherry-picked on its own (use git add -p, or an interactive rebase with edit).",
      },
      {
        text: "Keep as one commit with a longer message",
        ok: false,
        why: "Reverting the dependency update would also revert the footer fix.",
      },
      {
        text: "Squash it into the previous commit",
        ok: false,
        why: "Hides three unrelated changes inside another.",
      },
    ],
  },
  {
    id: "typo",
    msg: "typo",
    options: [
      {
        text: "Leave it as a separate commit",
        ok: false,
        why: "A typo fix for your own unpushed commit is noise in history.",
      },
      {
        text: "Fold it into the commit it fixes (fixup)",
        ok: true,
        why: "git commit --fixup, then rebase --autosquash, merges it into the right commit.",
      },
      {
        text: "Rename it to 'Fix typo'",
        ok: false,
        why: "Better message, but still noise if the typo was in your own unmerged work.",
      },
    ],
  },
];

export const TYPES = ["feat", "fix", "docs", "refactor", "test", "chore"] as const;
export type CcType = (typeof TYPES)[number];
