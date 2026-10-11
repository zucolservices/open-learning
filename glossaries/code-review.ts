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
} satisfies Record<string, GlossaryEntry>;
