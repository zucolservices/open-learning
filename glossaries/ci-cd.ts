import type { GlossaryEntry } from "./types";

/** CI/CD track glossary. `module` slugs refer to this track. */
export const ciCd = {
  branch: {
    term: "Branch",
    definition:
      "A separate line of work in version control: a copy of the code where you can make changes without affecting the main line, then merge them back. Short-lived branches (hours to a day or two) keep merging easy.",
    module: "branching-strategies",
  },
  "continuous-integration": {
    term: "Continuous integration (CI)",
    definition:
      "The practice of every developer merging small changes into the shared main line at least daily, with an automated build and tests checking each one within minutes. It's a habit, not a tool: a CI server running on branches that live for weeks isn't CI.",
    module: "why-ci-cd",
  },
  "continuous-delivery": {
    term: "Continuous delivery",
    definition:
      "Keeping software so that every change that passes the pipeline could be released to users at any time, at the press of a button. People still choose when to release.",
    module: "why-ci-cd",
  },
  "continuous-deployment": {
    term: "Continuous deployment",
    definition:
      "Going one step beyond continuous delivery: every change that passes the pipeline is released to production automatically, with no human approval step.",
    module: "why-ci-cd",
  },
  pipeline: {
    term: "Pipeline (CI/CD)",
    definition:
      "An automated series of steps, defined in a file in the repository, that runs whenever code changes: fetch the code, build it, test it, package it and deploy it, reporting pass or fail.",
    module: "pipeline-anatomy",
  },
  "batch-size": {
    term: "Batch size",
    definition:
      "How much change goes out together in one release. Smaller batches mean fewer suspects when something breaks, faster feedback and less finished work waiting to reach users.",
    module: "why-ci-cd",
  },
} satisfies Record<string, GlossaryEntry>;
