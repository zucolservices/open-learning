/**
 * The parts of Scrum, with purposes quoted verbatim from the 2020 Scrum Guide (CC BY-SA 4.0,
 * © Ken Schwaber and Jeff Sutherland). "when" and "note" are our summaries of the guide.
 */

export type Kind = "accountability" | "event" | "artifact";

export interface Part {
  id: string;
  kind: Kind;
  name: string;
  purpose: string;
  when: string;
  note: string;
}

export const PARTS: Part[] = [
  {
    id: "po",
    kind: "accountability",
    name: "Product Owner",
    purpose:
      "accountable for maximizing the value of the product resulting from the work of the Scrum Team",
    when: "Throughout; orders the Product Backlog and makes it clear.",
    note: "“The Product Owner is one person, not a committee.”",
  },
  {
    id: "sm",
    kind: "accountability",
    name: "Scrum Master",
    purpose:
      "accountable for establishing Scrum as defined in the Scrum Guide … accountable for the Scrum Team's effectiveness",
    when: "Throughout; helps the team, the Product Owner and the organisation use Scrum well.",
    note: "“true leaders who serve the Scrum Team and the larger organization”",
  },
  {
    id: "dev",
    kind: "accountability",
    name: "Developers",
    purpose: "committed to creating any aspect of a usable Increment each Sprint",
    when: "Throughout; they own the Sprint Backlog and how the work gets done.",
    note: "Not only programmers: testers, designers, analysts, anyone doing the work.",
  },
  {
    id: "sprint",
    kind: "event",
    name: "Sprint",
    purpose: "the heartbeat of Scrum, where ideas are turned into value",
    when: "Fixed length, one month or less. The next one starts immediately after.",
    note: "A container for all the other events.",
  },
  {
    id: "planning",
    kind: "event",
    name: "Sprint Planning",
    purpose: "initiates the Sprint by laying out the work to be performed for the Sprint",
    when: "Start of the Sprint. At most 8 hours for a one-month Sprint; usually shorter for shorter Sprints.",
    note: "Answers why this Sprint is valuable, what can be done, and how.",
  },
  {
    id: "daily",
    kind: "event",
    name: "Daily Scrum",
    purpose: "to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary",
    when: "15 minutes, same time and place every working day.",
    note: "For the Developers; they choose the format.",
  },
  {
    id: "review",
    kind: "event",
    name: "Sprint Review",
    purpose: "to inspect the outcome of the Sprint and determine future adaptations",
    when: "Near the end of the Sprint. At most 4 hours for a one-month Sprint.",
    note: "A working session with stakeholders, not a one-way demo.",
  },
  {
    id: "retro",
    kind: "event",
    name: "Sprint Retrospective",
    purpose: "to plan ways to increase quality and effectiveness",
    when: "Concludes the Sprint. At most 3 hours for a one-month Sprint.",
    note: "The team inspects how it worked, not just what it built.",
  },
  {
    id: "pb",
    kind: "artifact",
    name: "Product Backlog",
    purpose: "an emergent, ordered list of what is needed to improve the product",
    when: "Always there; refined as an ongoing activity.",
    note: "Commitment: the Product Goal, “the long-term objective for the Scrum Team”.",
  },
  {
    id: "sb",
    kind: "artifact",
    name: "Sprint Backlog",
    purpose:
      "the Sprint Goal (why), the set of Product Backlog items selected for the Sprint (what), as well as an actionable plan for delivering the Increment (how)",
    when: "Created at Sprint Planning; updated throughout the Sprint.",
    note: "Commitment: the Sprint Goal, “the single objective for the Sprint”.",
  },
  {
    id: "inc",
    kind: "artifact",
    name: "Increment",
    purpose: "a concrete stepping stone toward the Product Goal",
    when: "Whenever work meets the Definition of Done, even before the Sprint ends.",
    note: "Commitment: the Definition of Done, the quality bar every Increment must meet.",
  },
];

export const byId = Object.fromEntries(PARTS.map((p) => [p.id, p]));

/** The order an auto-play walks through, following one Sprint. */
export const TOUR = [
  "pb",
  "po",
  "planning",
  "sb",
  "sprint",
  "daily",
  "dev",
  "inc",
  "review",
  "retro",
  "sm",
];
