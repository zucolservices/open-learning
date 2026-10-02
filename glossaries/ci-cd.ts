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
  "version-control": {
    term: "Version control",
    definition:
      "A system that records every change to a set of files (who, what, when and why), so a team can work on the same code, see its history and go back to any earlier state. Git is by far the most used.",
    module: "branching-strategies",
  },
  git: {
    term: "Git",
    definition:
      "The most widely used version control system, created by Linus Torvalds in 2005 for the Linux kernel. Every copy of a repository holds its full history. GitHub, GitLab, Bitbucket and Azure Repos all host Git repositories.",
    module: "branching-strategies",
  },
  commit: {
    term: "Commit",
    definition:
      "One recorded change in version control: a snapshot of the files plus who made it, when, and a message saying why. Commits form the history you can inspect or return to.",
    module: "branching-strategies",
  },
  "merge-conflict": {
    term: "Merge conflict",
    definition:
      "What happens when two branches changed the same part of the same file in different ways: Git can't choose, so a person must read both versions and decide. The longer branches live apart, the more conflicts pile up.",
    module: "branching-strategies",
  },
  "pull-request": {
    term: "Pull request (merge request)",
    definition:
      "A proposal to merge a branch into main, where teammates review the change and automated checks run before it is merged. GitLab calls it a merge request.",
    module: "branching-strategies",
  },
  "trunk-based-development": {
    term: "Trunk-based development",
    definition:
      "A branching strategy where everyone merges small changes into one main branch (the trunk) at least daily, using branches that live hours rather than weeks, and hides unfinished work behind feature flags.",
    module: "branching-strategies",
  },
  "feature-flag": {
    term: "Feature flag",
    definition:
      "A switch in the code that turns a feature on or off, for everyone or for chosen users, without deploying new code. It lets unfinished work be merged and deployed switched off, then released gradually.",
    module: "feature-flags",
  },
  workflow: {
    term: "Workflow (GitHub Actions)",
    definition:
      "GitHub's name for a pipeline: a YAML file in .github/workflows that says which events start it and which jobs to run.",
    module: "pipeline-anatomy",
  },
  trigger: {
    term: "Trigger",
    definition:
      "The event that starts a pipeline: a push, a pull request, a schedule, a manual button or another pipeline finishing.",
    module: "pipeline-anatomy",
  },
  "ci-job": {
    term: "Job",
    definition:
      "A unit of work in a pipeline that runs on one machine (runner), as a list of steps. Jobs run in parallel unless one is told to wait for another; each starts on a fresh machine.",
    module: "pipeline-anatomy",
  },
  runner: {
    term: "Runner (agent)",
    definition:
      "The machine that executes a pipeline job. Hosted runners are fresh virtual machines provided by the CI service; self-hosted runners are machines you run yourself. Jenkins and Azure call them agents.",
    module: "pipeline-anatomy",
  },
  artifact: {
    term: "Artifact",
    definition:
      "A file produced by a build and kept for later, such as a container image, a package or a zip of the built app. Build it once, version it, and deploy that same artifact everywhere.",
    module: "artifacts-versioning",
  },
  "status-check": {
    term: "Status check",
    definition:
      "A pass, fail or pending result that a pipeline reports back on a commit or pull request. Branch rules can require certain checks to pass before merging.",
    module: "pipeline-anatomy",
  },
} satisfies Record<string, GlossaryEntry>;
