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
} satisfies Record<string, GlossaryEntry>;
