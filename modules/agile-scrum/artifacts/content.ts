/**
 * The artifacts and their commitments, quoted from the 2020 Scrum Guide (CC BY-SA 4.0,
 * © Ken Schwaber and Jeff Sutherland), plus illustrative items to test against them.
 */

export const PAIRS = [
  {
    artifact: "Product Backlog",
    artifactQuote:
      "an emergent, ordered list of what is needed to improve the product. It is the single source of work undertaken by the Scrum Team.",
    commitment: "Product Goal",
    commitmentQuote:
      "The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against.",
  },
  {
    artifact: "Sprint Backlog",
    artifactQuote:
      "composed of the Sprint Goal (why), the set of Product Backlog items selected for the Sprint (what), as well as an actionable plan for delivering the Increment (how).",
    commitment: "Sprint Goal",
    commitmentQuote: "The Sprint Goal is the single objective for the Sprint.",
  },
  {
    artifact: "Increment",
    artifactQuote:
      "a concrete stepping stone toward the Product Goal. Each Increment is additive to all prior Increments and thoroughly verified, ensuring that all Increments work together.",
    commitment: "Definition of Done",
    commitmentQuote:
      "a formal description of the state of the Increment when it meets the quality measures required for the product.",
  },
];

/** An example Definition of Done: items like Scrum.org's and Atlassian's examples; the last is our own. */
export const DOD = [
  "Code reviewed",
  "All tests pass",
  "No known defects",
  "Deployed to the staging environment and tested there",
  "Release notes updated",
  "Works on a basic Android phone (our own example)",
];

export interface Candidate {
  id: string;
  label: string;
  /** Which DoD items (by index) it meets. */
  meets: number[];
}

export const CANDIDATES: Candidate[] = [
  { id: "status", label: "Status page for each application", meets: [0, 1, 2, 3, 4, 5] },
  { id: "sms", label: "SMS when the status changes", meets: [0, 1, 2, 4, 5] },
  { id: "draft", label: "Save a half-filled form as a draft", meets: [0, 1, 3, 4, 5] },
];
