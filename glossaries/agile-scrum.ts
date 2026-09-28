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
} satisfies Record<string, GlossaryEntry>;
