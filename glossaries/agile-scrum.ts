import type { GlossaryEntry } from "./types";

/** Agile & Scrum track glossary. `module` slugs refer to this track. */
export const agileScrum = {
  "plan-driven": {
    term: "Plan-driven (waterfall) delivery",
    definition:
      "Doing a project in one pass of phases: gather all requirements, design, build, test, then release. Each phase finishes before the next starts, and users see the result only at the end. Also called predictive or \u201cwaterfall\u201d.",
    module: "why-plans-break",
  },
  "iterative-development": {
    term: "Iterative development",
    definition:
      "Building a product in repeated short cycles, each producing something working that people can try, so that what is learned in one cycle shapes the next.",
    analogy: "Cooking by tasting as you go, instead of following a recipe blind until the end.",
    module: "why-plans-break",
  },
  "feedback-loop": {
    term: "Feedback loop",
    definition:
      "The cycle of doing something, seeing the result and adjusting. The shorter the loop, the sooner mistakes are found and the cheaper they are to fix.",
    module: "why-plans-break",
  },
  "big-bang-release": {
    term: "Big-bang release",
    definition:
      "Launching a whole new system to everyone at once, often on a fixed date, instead of piloting it or rolling it out in stages. Any surprise hits every user at the same time.",
    module: "why-plans-break",
  },
  "agile-manifesto": {
    term: "Agile Manifesto",
    definition:
      "The Manifesto for Agile Software Development (2001): four values and twelve principles written by seventeen software practitioners. It prefers individuals and interactions, working software, customer collaboration and responding to change, while still valuing processes, documentation, contracts and plans.",
    module: "agile-manifesto",
  },
  "sustainable-pace": {
    term: "Sustainable pace",
    definition:
      "Working at a pace the team, sponsors and users could keep up indefinitely, without relying on overtime. Principle 8 of the Agile Manifesto.",
    module: "agile-manifesto",
  },
  empiricism: {
    term: "Empiricism",
    definition:
      "Deciding from what is actually observed rather than from what was assumed or planned. The Scrum Guide: \u201cknowledge comes from experience and making decisions based on what is observed.\u201d",
    module: "inspect-adapt",
  },
  "three-pillars": {
    term: "Transparency, inspection, adaptation",
    definition:
      "Scrum's three pillars of empiricism. Make the real state of the work visible; look at it frequently to spot problems; change course as soon as a problem is found. Each enables the next.",
    module: "inspect-adapt",
  },
  "empirical-process-control": {
    term: "Defined vs empirical process control",
    definition:
      "Two ways of controlling a process. A defined process is well understood and gives the same result every time, so it can simply be followed. An empirical process is too complex or unpredictable for that, so it is controlled by frequent inspection and adjustment.",
    module: "inspect-adapt",
  },
  scrum: {
    term: "Scrum",
    definition:
      "\u201cA lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems\u201d (Scrum Guide 2020). A small team works in fixed-length Sprints, with three accountabilities, five events and three artifacts.",
    module: "scrum-on-one-page",
  },
  accountability: {
    term: "Accountability (Scrum)",
    definition:
      "What the Scrum Guide calls its three responsibilities: Product Owner, Scrum Master and Developers. They are accountabilities within one team, not job titles or a hierarchy.",
    module: "scrum-on-one-page",
  },
  "scrum-artifact": {
    term: "Artifact (Scrum)",
    definition:
      "Something that makes work or value visible: the Product Backlog, the Sprint Backlog and the Increment. Each has a commitment: the Product Goal, the Sprint Goal and the Definition of Done.",
    module: "scrum-on-one-page",
  },
  sprint: {
    term: "Sprint",
    definition:
      "A fixed-length period of one month or less in which a Scrum Team turns ideas into a usable Increment. It contains all the other Scrum events, and a new Sprint starts as soon as the previous one ends.",
    module: "scrum-on-one-page",
  },
  timebox: {
    term: "Timebox",
    definition:
      "A fixed maximum length for an event or piece of work. In Scrum every event is timeboxed; ending early is fine once the purpose is met.",
    module: "scrum-on-one-page",
  },
  "product-owner": {
    term: "Product Owner",
    definition:
      "The one person accountable for maximising the value of the product: sets the Product Goal and orders the Product Backlog. Others who want changes persuade the Product Owner.",
    module: "who-decides",
  },
  "scrum-master": {
    term: "Scrum Master",
    definition:
      "Accountable for establishing Scrum and for the team's effectiveness: coaches, makes sure impediments get removed and keeps events useful. Serves the team and organisation; does not direct the work.",
    module: "who-decides",
  },
  developers: {
    term: "Developers (Scrum)",
    definition:
      "Everyone in the Scrum Team who creates the Increment, whatever their skill: programmers, testers, designers, analysts. They plan the Sprint, size the work and decide how to do it.",
    module: "who-decides",
  },
  "self-managing": {
    term: "Self-managing team",
    definition:
      "A team that decides internally who does what, when and how, rather than being assigned tasks by a manager.",
    module: "who-decides",
  },
  "sprint-planning": {
    term: "Sprint Planning",
    definition:
      "The event that starts a Sprint. The Scrum Team agrees why the Sprint is valuable (the Sprint Goal), the Developers select what can be Done, and they plan how. At most eight hours for a one-month Sprint; usually shorter for shorter Sprints.",
    module: "sprint-planning",
  },
  "story-points": {
    term: "Story points",
    definition:
      "A relative size for a backlog item (bigger number, more work or uncertainty), used by many teams for forecasting. An optional practice: the Scrum Guide doesn't mention it.",
    module: "sprint-planning",
  },
  velocity: {
    term: "Velocity",
    definition:
      "How much work (often in story points) a team actually finished in recent Sprints, used by that team to forecast. Optional, not in the Scrum Guide, and not a measure of productivity or a way to compare teams.",
    module: "sprint-planning",
  },
  "daily-scrum": {
    term: "Daily Scrum",
    definition:
      "A 15-minute event for the Developers, at the same time and place every working day, to inspect progress towards the Sprint Goal and adjust the plan. The Developers choose its format. Often called the stand-up, a name from Extreme Programming.",
    module: "daily-scrum",
  },
  "walk-the-board": {
    term: "Walking the board",
    definition:
      "Running a stand-up by going through the work items on the team's board from nearest-done to newest (usually right to left), asking what each needs to move on, instead of asking each person for a report.",
    module: "daily-scrum",
  },
} satisfies Record<string, GlossaryEntry>;
