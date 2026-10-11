import type { GlossaryEntry } from "./types";

/** Code Review track glossary. `module` slugs refer to this track. */
export const codeReviewTrack = {
  "code-review": {
    term: "Code review",
    definition:
      "A colleague reading a proposed change before it's merged, to find problems, share knowledge and keep the code consistent.",
    module: "why-review",
  },
  "pull-request": {
    term: "Pull request",
    definition:
      "A proposed change to a codebase plus a description, opened for review before merging. GitLab calls it a merge request; Gerrit calls it a change.",
    module: "anatomy-pr",
  },
  "review-thread": {
    term: "Review thread",
    definition:
      "A comment on a pull request and the replies to it, usually attached to specific lines. Threads are resolved when the concern is dealt with.",
    module: "responding",
  },
  approval: {
    term: "Approval",
    definition:
      "A reviewer's formal sign-off that a change can be merged. Teams often require one or more approvals, sometimes from specific code owners.",
    module: "review-flow",
  },
  "merge-queue": {
    term: "Merge queue",
    definition:
      "A queue that tests each approved change on top of the others waiting to merge, so two changes that pass alone can't break the main branch together.",
    module: "review-flow",
  },
  "code-health": {
    term: "Code health",
    definition:
      "How easy a codebase is to understand, change and trust. Google's guide says to approve a change once it definitely improves code health, even if it isn't perfect.",
    module: "what-to-look-for",
  },
  "stacked-changes": {
    term: "Stacked changes",
    definition:
      "A chain of small pull requests where each builds on the one before, so a big piece of work can be reviewed one small step at a time.",
    module: "small-changes",
  },
} satisfies Record<string, GlossaryEntry>;
