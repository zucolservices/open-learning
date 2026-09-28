/**
 * Nine situations on a client project, each with who decides according to the 2020 Scrum Guide
 * (quoted verbatim; CC BY-SA 4.0, © Ken Schwaber and Jeff Sutherland). Where the guide is silent,
 * `inference` marks our reading.
 */

export type Who = "po" | "sm" | "dev" | "team" | "outside" | "noone";

/** How to start the "what goes wrong" line for each answer. */
export const IF: Record<Who, string> = {
  po: "If the Product Owner decides",
  sm: "If the Scrum Master decides",
  dev: "If the Developers decide",
  team: "If the whole team decides",
  outside: "If someone outside the team decides",
  noone: "If you rule it out entirely",
};

export const WHO: [Who, string][] = [
  ["po", "Product Owner"],
  ["sm", "Scrum Master"],
  ["dev", "Developers"],
  ["team", "Whole Scrum Team"],
  ["outside", "Someone outside the team"],
  ["noone", "No one may"],
];

export interface Situation {
  id: string;
  /** A few words for the summary. */
  short: string;
  who: Who;
  story: string;
  quote: string;
  section: string;
  why: string;
  /** What tends to happen when someone else decides. */
  wrong: string;
  inference?: boolean;
}

export const SITUATIONS: Situation[] = [
  {
    id: "urgent",
    short: "New work from a stakeholder mid-Sprint",
    who: "po",
    story:
      "Mid-Sprint, a senior official at the Revenue Department messages a developer directly: “Add Aadhaar-based sign-in this Sprint. It's urgent.”",
    quote:
      "Those wanting to change the Product Backlog can do so by trying to convince the Product Owner.",
    section: "Product Owner",
    why: "New work goes to the Product Owner, who decides where it sits in the Product Backlog. And during the Sprint, “No changes are made that would endanger the Sprint Goal.”",
    wrong:
      "If the developer just starts on it, the Sprint Goal slips, the Product Owner is blindsided, and the team learns that whoever shouts loudest sets priorities.",
  },
  {
    id: "goal",
    short: "The Sprint Goal (proposed by the Product Owner)",
    who: "team",
    story:
      "Sprint Planning. The Product Owner suggests the Sprint could be about letting citizens track their application status. Who settles the Sprint Goal?",
    quote:
      "The Product Owner proposes how the product could increase its value and utility in the current Sprint. The whole Scrum Team then collaborates to define a Sprint Goal",
    section: "Sprint Planning",
    why: "The Product Owner proposes; the whole team agrees the goal, so everyone owns it.",
    wrong:
      "A goal handed down without the Developers' input is often one they can't meet, and nobody feels committed to it.",
  },
  {
    id: "how",
    short: "How to build it, and who does which part",
    who: "dev",
    story:
      "The status-tracking page needs a new database table and an SMS integration. How it's designed, and who works on which part?",
    quote:
      "How this is done is at the sole discretion of the Developers. No one else tells them how to turn Product Backlog items into Increments of value.",
    section: "Sprint Planning",
    why: "The people doing the work decide how to do it. Scrum Teams are “self-managing, meaning they internally decide who does what, when, and how.”",
    wrong:
      "When a manager or the Product Owner dictates the design and hands out tasks, the team stops owning the result and the best ideas go unheard.",
  },
  {
    id: "size",
    short: "Sizing the work",
    who: "dev",
    story:
      "The Product Owner looks at the document-upload item and says: “That's small, call it two days.”",
    quote:
      "The Developers who will be doing the work are responsible for the sizing. The Product Owner may influence the Developers by helping them understand and select trade-offs.",
    section: "Product Backlog",
    why: "Those who'll build it size it. The Product Owner can explain what matters most and offer a simpler version.",
    wrong:
      "Sizes set by someone who won't do the work are wishes. The team either burns out or misses, and trust in every forecast drops.",
  },
  {
    id: "cancel",
    short: "Cancelling a Sprint whose goal is obsolete",
    who: "po",
    story:
      "Halfway through a Sprint about a new scholarship form, the department announces the scheme is scrapped. Should the Sprint be cancelled?",
    quote:
      "A Sprint could be cancelled if the Sprint Goal becomes obsolete. Only the Product Owner has the authority to cancel the Sprint.",
    section: "The Sprint",
    why: "The goal no longer makes sense, and cancelling is the Product Owner's call alone.",
    wrong:
      "If the team quietly carries on, or a manager cancels it over the Product Owner's head, effort is wasted or accountability blurs.",
  },
  {
    id: "blocked",
    short: "Getting a blocker removed",
    who: "sm",
    story:
      "For three weeks the team has been waiting for access to the state data centre's API. Emails go unanswered.",
    quote: "Causing the removal of impediments to the Scrum Team's progress",
    section: "Scrum Master",
    why: "The Scrum Master makes sure blockers get removed, often by working across the organisation (“Removing barriers between stakeholders and Scrum Teams”). The team can still solve what it can itself.",
    wrong:
      "Left alone, the blocker becomes “normal”, the team works around it badly, and every Sprint quietly shrinks.",
  },
  {
    id: "testing",
    short: "Skipping testing under pressure",
    who: "noone",
    story:
      "A demo for the department's secretary is on Friday. The account manager says: “Skip the testing this once so we can show everything.”",
    quote: "Quality does not decrease",
    section: "The Sprint",
    why: "Nobody can trade away quality. “The Developers are required to conform to the Definition of Done”, and work that doesn't meet it “cannot be released or even presented at the Sprint Review.”",
    wrong:
      "Untested work shown as finished creates a false picture, and the bugs arrive later, when they cost more.",
  },
  {
    id: "dod",
    short: "The organisation's minimum Definition of Done",
    who: "outside",
    story:
      "Your company requires every release to pass a security scan and an accessibility check. Who sets that part of the Definition of Done?",
    quote:
      "If the Definition of Done for an increment is part of the standards of the organization, all Scrum Teams must follow it as a minimum.",
    section: "Commitment: Definition of Done",
    why: "The organisation's standard is the floor; the team can add to it. Without such a standard, “the Scrum Team must create a Definition of Done appropriate for the product.”",
    wrong:
      "If each team picks its own minimum, one team's “done” ships without a security scan, and the whole company carries the risk.",
  },
  {
    id: "daily",
    short: "The format of the Daily Scrum",
    who: "dev",
    story:
      "The vendor's delivery manager wants the Daily Scrum to be a round of status reports to her, with each person answering three set questions.",
    quote:
      "The Developers can select whatever structure and techniques they want, as long as their Daily Scrum focuses on progress toward the Sprint Goal",
    section: "Daily Scrum",
    why: "The Daily Scrum belongs to the Developers. They choose its format; it's for replanning, not reporting upwards.",
    wrong:
      "A daily status report to a manager turns fifteen minutes of team replanning into a performance, and problems get hidden.",
  },
];
