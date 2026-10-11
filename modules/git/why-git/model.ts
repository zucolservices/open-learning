/** The same made-up week of edits, replayed with a shared folder and with Git. */

export interface Day {
  day: string;
  event: string;
  folder: { text: string; ok: boolean };
  git: { text: string; ok: boolean };
}

export const WEEK: Day[] = [
  {
    day: "Mon",
    event: "Kavya rewrites the menu page's header.",
    folder: { text: "Saved over menu.html. The old header is gone.", ok: false },
    git: { text: "Committed: 'Rewrite header'. The old version is still in history.", ok: true },
  },
  {
    day: "Tue",
    event: "Tom updates the prices, working from a copy made last week.",
    folder: { text: "Tom copies his file back and silently wipes out Kavya's header.", ok: false },
    git: { text: "Tom commits on his own branch. Nothing is overwritten.", ok: true },
  },
  {
    day: "Wed",
    event: "Both changed the same line, the page title.",
    folder: { text: "Nobody notices. Whoever saved last wins.", ok: false },
    git: { text: "Git flags a conflict on that one line and asks a person to choose.", ok: true },
  },
  {
    day: "Thu",
    event: "A late change breaks the page on phones.",
    folder: { text: "Which file was the last good one? menu_final_v2_REALLY.html?", ok: false },
    git: { text: "The bad commit is reverted in one step, with a note saying why.", ok: true },
  },
  {
    day: "Fri",
    event: "The owner asks: 'What did the menu look like on Monday?'",
    folder: { text: "Lost. Nobody kept a copy.", ok: false },
    git: { text: "Check out Monday's commit and see the exact files.", ok: true },
  },
];

export const TIMELINE: [string, string][] = [
  ["Apr 2005", "Linus Torvalds starts Git after the Linux kernel loses free use of BitKeeper."],
  ["Jul 2005", "Junio Hamano becomes maintainer, and still is today."],
  ["Dec 2005", "Git 1.0."],
  ["2022", "In Stack Overflow's survey, about 94% of developers use Git (the last year it asked)."],
  [
    "Apr 2025",
    "Firefox, one of the last big Mercurial projects, moves its source of truth to Git.",
  ],
  ["Sep 2026", "Git 2.56. Git 3.0 is planned but has no release date."],
];
