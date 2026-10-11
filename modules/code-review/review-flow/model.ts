/**
 * One made-up pull request's journey from draft to merged. Hours are illustrative; the point is
 * how much of the elapsed time is waiting rather than working.
 */

export const STAGES: {
  id: string;
  label: string;
  who: string;
  hours: number;
  waiting: boolean;
  note: string;
}[] = [
  {
    id: "draft",
    label: "Draft",
    who: "Author",
    hours: 3,
    waiting: false,
    note: "Opened as a draft to show early work. Visible, but not asking for approval yet.",
  },
  {
    id: "ready",
    label: "Ready for review",
    who: "Author",
    hours: 0.2,
    waiting: false,
    note: "Marked ready; reviewers are requested, often automatically from code owners.",
  },
  {
    id: "checks",
    label: "Automated checks",
    who: "CI",
    hours: 0.4,
    waiting: true,
    note: "Tests, linters and builds run. Many teams require them to pass before merging.",
  },
  {
    id: "queue",
    label: "Waiting for a reviewer",
    who: "Reviewer",
    hours: 18,
    waiting: true,
    note: "The longest wait: the reviewer is busy. The author has moved on to something else.",
  },
  {
    id: "review",
    label: "Review",
    who: "Reviewer",
    hours: 0.5,
    waiting: false,
    note: "Comments left; the reviewer chooses “Request changes”.",
  },
  {
    id: "revise",
    label: "Revise",
    who: "Author",
    hours: 1,
    waiting: false,
    note: "The author switches back, re-reads their own code, fixes and replies.",
  },
  {
    id: "rereview",
    label: "Waiting for a second look",
    who: "Reviewer",
    hours: 6,
    waiting: true,
    note: "Another wait.",
  },
  {
    id: "approve",
    label: "Approved",
    who: "Reviewer",
    hours: 0.2,
    waiting: false,
    note: "Required approvals reached.",
  },
  {
    id: "merge",
    label: "Merge queue, merged",
    who: "CI",
    hours: 0.5,
    waiting: true,
    note: "A merge queue tests the change on top of others before merging.",
  },
];
