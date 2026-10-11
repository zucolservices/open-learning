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
  "commit-message": {
    term: "Commit message",
    definition:
      "The text saved with each commit explaining what changed and why. A short first line summarises it for anyone skimming the history.",
    module: "describing-changes",
  },
  diff: {
    term: "Diff",
    definition:
      "A view of exactly what changed between two versions of code: lines added, removed and left as context. Reviewers read the diff of a pull request.",
    module: "reading-diffs",
  },
  "review-comment": {
    term: "Review comment",
    definition:
      "A note a reviewer leaves on a pull request, usually attached to a line. Good ones are specific, explain why and suggest a way forward.",
    module: "giving-feedback",
  },
  "blocking-comment": {
    term: "Blocking comment",
    definition:
      "A review comment that must be resolved before the change can merge, usually about correctness, security or a serious design problem.",
    module: "severity",
  },
  nit: {
    term: "Nit",
    definition:
      "Short for nitpick: a minor, optional review comment, such as a small naming or wording preference. Often prefixed “Nit:” so the author knows it isn't required.",
    module: "severity",
  },
  "weak-test": {
    term: "Weak test",
    definition:
      "A test that passes whether or not the code is correct, for example because it asserts nothing, checks only a type, or tests a stub instead of the real code.",
    module: "reviewing-tests",
  },
  "review-latency": {
    term: "Review latency",
    definition:
      "How long a change waits for a reviewer to respond. Usually much longer than the review itself, and a major cause of slow delivery.",
    module: "turnaround",
  },
  "bus-factor": {
    term: "Bus factor",
    definition:
      "How many people could leave a team before some part of the code has nobody left who understands it. A bus factor of one is a risk.",
    module: "reviewers",
  },
  "ai-code-review": {
    term: "AI code review",
    definition:
      "Tools that use large language models to read a pull request and leave review comments, and sometimes suggested fixes. Fast, but they can lack context and be confidently wrong.",
    module: "ai-review",
  },
  "ship-show-ask": {
    term: "Ship / Show / Ask",
    definition:
      "A way of choosing review per change: Ship merges with no review, Show merges and asks for review afterwards, Ask waits for review before merging.",
    module: "alternatives",
  },
} satisfies Record<string, GlossaryEntry>;
