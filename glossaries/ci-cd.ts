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
  build: {
    term: "Build",
    definition:
      "Turning source code into something that can run or be shipped: installing dependencies, compiling or bundling, and packaging the result.",
    module: "builds-caching",
  },
  dependency: {
    term: "Dependency",
    definition:
      "A library your code uses that someone else publishes, pulled in at build time. Dependencies have their own dependencies (transitive ones), so a small app can pull in hundreds.",
    module: "builds-caching",
  },
  lockfile: {
    term: "Lockfile",
    definition:
      "A file, committed with the code, that records the exact version (and usually a checksum) of every dependency, including indirect ones, so every install gets the same set. Examples: package-lock.json, pnpm-lock.yaml, uv.lock, Cargo.lock.",
    module: "builds-caching",
  },
  "build-cache": {
    term: "Build cache",
    definition:
      "Saved results of earlier pipeline work, such as downloaded dependencies or compiled outputs, reused when the inputs haven't changed. A good cache key, like a hash of the lockfile, says exactly when reuse is safe.",
    module: "builds-caching",
  },
  "reproducible-build": {
    term: "Reproducible build",
    definition:
      "A build that anyone can repeat from the same source, environment and instructions and get bit-for-bit identical output. It lets others check that a published artifact really came from the claimed source.",
    module: "builds-caching",
  },
  "unit-test": {
    term: "Unit test",
    definition:
      "A small automated test that checks one function or class on its own, in memory, in milliseconds. Fast and precise, but blind to problems between parts.",
    module: "test-pyramid",
  },
  "integration-test": {
    term: "Integration test",
    definition:
      "An automated test that checks parts working together, such as your code with a real database or another service. Slower than a unit test, and catches wiring mistakes unit tests can't.",
    module: "test-pyramid",
  },
  "e2e-test": {
    term: "End-to-end test",
    definition:
      "An automated test that drives the whole system the way a user would, for example a browser signing in, filling a cart and paying. The only test of a full journey, but slow and the most prone to random failures.",
    module: "test-pyramid",
  },
  "test-pyramid": {
    term: "Test pyramid",
    definition:
      "Mike Cohn's picture of a healthy test suite: many fast unit tests at the bottom, fewer integration tests, and a handful of slow end-to-end tests at the top. Its upside-down opposite is the 'ice-cream cone'.",
    module: "test-pyramid",
  },
  "flaky-test": {
    term: "Flaky test",
    definition:
      "A test that sometimes passes and sometimes fails on exactly the same code, because of timing, shared state or the network. Flaky tests teach people to ignore red builds.",
    module: "test-pyramid",
  },
  "test-quarantine": {
    term: "Test quarantine",
    definition:
      "Moving a known-flaky test aside so it still runs but can't fail the build, with an owner and a deadline to fix it, so the rest of the suite stays trustworthy.",
    module: "test-pyramid",
  },
  "code-coverage": {
    term: "Code coverage",
    definition:
      "The share of code lines or branches that ran during the tests. Useful for spotting untested areas, but a line can run without its result being checked, so high coverage isn't proof of good tests.",
    module: "test-pyramid",
  },
  "test-sharding": {
    term: "Test sharding",
    definition:
      "Splitting a test suite into parts that run at the same time on separate machines. Splitting by how long tests took last time keeps the parts even, so the slowest part doesn't hold everything up.",
    module: "pipeline-speed",
  },
  "change-detection": {
    term: "Change detection (affected-only)",
    definition:
      "Working out which parts of a codebase a change can affect and running only their builds and tests, using path filters or the dependency graph (Nx affected, Turborepo --affected, Bazel).",
    module: "pipeline-speed",
  },
  "critical-path": {
    term: "Critical path",
    definition:
      "The longest chain of pipeline jobs that must wait for one another. It decides how long the whole run takes; speeding up anything off it changes nothing.",
    module: "pipeline-speed",
  },
  "quality-gate": {
    term: "Quality gate",
    definition:
      "A check a change must pass before it can move on, for example tests passing, a review approved or no known vulnerabilities, before merging into main or before a release.",
    module: "quality-gates",
  },
  "branch-protection": {
    term: "Branch protection",
    definition:
      "Rules on an important branch such as main: required status checks, required reviews, no direct pushes or force-pushes. GitHub also offers the newer rulesets; GitLab calls them protected branches.",
    module: "quality-gates",
  },
  "merge-queue": {
    term: "Merge queue",
    definition:
      "A service that merges approved pull requests one at a time (or in batches), re-running the required checks on top of the latest main first, so two changes that pass alone can't break main together. GitLab calls them merge trains.",
    module: "quality-gates",
  },
  sast: {
    term: "Static analysis (SAST)",
    definition:
      "Tools that read source code without running it to find bugs and security flaws such as injection, for example CodeQL, Semgrep or SonarQube. SAST stands for static application security testing.",
    module: "quality-gates",
  },
  "secret-scanning": {
    term: "Secret scanning",
    definition:
      "Automatically looking for passwords, tokens and keys in code. With push protection, a push that contains one is blocked before it reaches the repository.",
    module: "quality-gates",
  },
  codeowners: {
    term: "CODEOWNERS",
    definition:
      "A file that maps parts of a repository to the people or teams responsible for them, so changes there automatically ask those owners for review, and can require their approval.",
    module: "quality-gates",
  },
  "artifact-registry": {
    term: "Artifact registry",
    definition:
      "A service that stores versioned build outputs such as container images and packages, for example Amazon ECR, Google Artifact Registry, Azure Container Registry, GitHub Packages, JFrog Artifactory or Nexus.",
    module: "artifacts-versioning",
  },
  semver: {
    term: "Semantic versioning (SemVer)",
    definition:
      "Version numbers in the form MAJOR.MINOR.PATCH: bump PATCH for backward-compatible fixes, MINOR for backward-compatible features, MAJOR for breaking changes. A released version must never change.",
    module: "artifacts-versioning",
  },
  promotion: {
    term: "Promotion",
    definition:
      "Moving the same, already-built artifact from one environment to the next (test, staging, production) instead of rebuilding it, so what you tested is exactly what you ship.",
    module: "artifacts-versioning",
  },
  "container-image": {
    term: "Container image",
    definition:
      "A packaged, read-only bundle of an app and everything it needs to run, built in layers from a Dockerfile and stored in a registry. Every container started from it behaves the same way.",
    module: "container-builds",
  },
  dockerfile: {
    term: "Dockerfile",
    definition:
      "A text file of instructions (FROM, COPY, RUN, CMD…) that a builder such as BuildKit follows, step by step, to produce a container image.",
    module: "container-builds",
  },
  "image-layer": {
    term: "Image layer",
    definition:
      "A set of file changes added by one Dockerfile instruction (RUN, COPY or ADD). Layers are cached and shared; when one changes, every layer after it must be rebuilt.",
    module: "container-builds",
  },
  "multi-stage-build": {
    term: "Multi-stage build",
    definition:
      "A Dockerfile with several FROM stages: build the app in one stage with all the tools, then copy only the result into a small final stage, leaving compilers and dev dependencies behind.",
    module: "container-builds",
  },
  "image-digest": {
    term: "Image digest",
    definition:
      "A SHA-256 hash that identifies an image by its contents (sha256:…). Unlike a tag, which can be moved to another image, a digest always means exactly the same bytes.",
    module: "container-builds",
  },
  environment: {
    term: "Environment",
    definition:
      "A complete, separate copy of a system (servers, database, settings) where software runs: for example test, staging and production. The same artifact moves between them; only configuration differs.",
    module: "environments-promotion",
  },
  staging: {
    term: "Staging",
    definition:
      "An environment set up as much like production as possible, used for a final check of a release before real users get it.",
    module: "environments-promotion",
  },
  "preview-environment": {
    term: "Preview environment",
    definition:
      "A temporary copy of the app created automatically for one pull request, at its own address, so reviewers can try the change before merging. It is deleted when the pull request closes.",
    module: "environments-promotion",
  },
} satisfies Record<string, GlossaryEntry>;
