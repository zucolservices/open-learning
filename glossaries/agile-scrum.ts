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
} satisfies Record<string, GlossaryEntry>;
