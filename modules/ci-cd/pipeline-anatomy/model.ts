/** The example workflow file, line by line, with the part of the recipe each line belongs to. */

export type Part = "name" | "trigger" | "job" | "runner" | "steps" | "needs" | "artifact";

export const YAML: { text: string; part?: Part }[] = [
  { text: "# .github/workflows/ci.yml", part: "name" },
  { text: "name: ci", part: "name" },
  { text: "on:", part: "trigger" },
  { text: "  pull_request:", part: "trigger" },
  { text: "  push:", part: "trigger" },
  { text: "    branches: [main]", part: "trigger" },
  { text: "jobs:" },
  { text: "  lint:", part: "job" },
  { text: "    runs-on: ubuntu-latest", part: "runner" },
  { text: "    steps:", part: "steps" },
  { text: "      - uses: actions/checkout@v7", part: "steps" },
  { text: "      - run: npm ci", part: "steps" },
  { text: "      - run: npm run lint", part: "steps" },
  { text: "  test:", part: "job" },
  { text: "    runs-on: ubuntu-latest", part: "runner" },
  { text: "    steps:", part: "steps" },
  { text: "      - uses: actions/checkout@v7", part: "steps" },
  { text: "      - run: npm ci", part: "steps" },
  { text: "      - run: npm test", part: "steps" },
  { text: "  build:", part: "job" },
  { text: "    needs: [lint, test]", part: "needs" },
  { text: "    runs-on: ubuntu-latest", part: "runner" },
  { text: "    steps:", part: "steps" },
  { text: "      - uses: actions/checkout@v7", part: "steps" },
  { text: "      - run: npm ci && npm run build", part: "steps" },
  { text: "      - uses: actions/upload-artifact@v7", part: "artifact" },
  { text: "        with: { name: app, path: dist/ }", part: "artifact" },
];

export const PARTS: Record<Part, { name: string; text: string }> = {
  name: {
    name: "A file in the repository",
    text: 'The pipeline lives next to the code, in .github/workflows/. Change the pipeline and the change is reviewed, versioned and rolled back like any other code. Jenkins calls this "pipeline as code".',
  },
  trigger: {
    name: "Trigger",
    text: "When to run: here, on every pull request and on every push to main. Other triggers include a schedule, a manual button or another pipeline finishing.",
  },
  job: {
    name: "Jobs",
    text: "Independent units of work. Each job gets its own fresh machine, so jobs share nothing unless you pass files along. Without needs, jobs run at the same time.",
  },
  runner: {
    name: "Runner",
    text: "The machine that runs the job. ubuntu-latest asks for a fresh virtual machine hosted by GitHub; teams can also run their own (self-hosted) runners.",
  },
  steps: {
    name: "Steps",
    text: "Commands run one after another on the job's machine, sharing its files. A step fails when its command exits with a non-zero code, and the job stops there.",
  },
  needs: {
    name: "Order",
    text: "needs makes build wait for lint and test to pass. If either fails, build never runs.",
  },
  artifact: {
    name: "Artifact",
    text: "Files kept after the job ends, such as the built app, so later jobs or people can use them. On GitHub they're kept 90 days by default.",
  },
};

/** The step-through: who is active in each frame of one push. */
export type Actor = "dev" | "host" | "ci" | "queue" | "lint" | "test" | "build" | "store" | "pr";

export interface Frame {
  title: string;
  text: string;
  active: Actor[];
  /** Job states shown on the runners. */
  jobs: { lint: JobState; test: JobState; build: JobState };
}

export type JobState = "idle" | "queued" | "running" | "pass" | "fail" | "skipped";

export function frames(fail: boolean): Frame[] {
  return [
    {
      title: "You push a commit",
      text: "Priya pushes a fix to her branch and opens a pull request. Nothing else is needed from her.",
      active: ["dev", "host"],
      jobs: { lint: "idle", test: "idle", build: "idle" },
    },
    {
      title: "An event fires",
      text: "The Git host records a pull_request event. GitHub Actions picks it up inside GitHub; an outside CI service (Jenkins, Buildkite…) would get an HTTP request called a webhook.",
      active: ["host", "ci"],
      jobs: { lint: "idle", test: "idle", build: "idle" },
    },
    {
      title: "The recipe is read from that commit",
      text: "The CI service reads ci.yml from the commit itself, so a branch can change its own pipeline. It works out three jobs: lint and test can start; build must wait.",
      active: ["ci"],
      jobs: { lint: "queued", test: "queued", build: "queued" },
    },
    {
      title: "Jobs wait for runners",
      text: "Jobs go into a queue until a runner is free. On a busy day this wait can be longer than the job itself.",
      active: ["ci", "queue"],
      jobs: { lint: "queued", test: "queued", build: "queued" },
    },
    {
      title: "Two fresh machines, side by side",
      text: "Lint and test each get a brand-new machine. Each checks out the code, installs dependencies and runs its command.",
      active: ["queue", "lint", "test"],
      jobs: { lint: "running", test: "running", build: "queued" },
    },
    fail
      ? {
          title: "A test fails",
          text: "One test exits with a non-zero code, so the test job fails. Lint passed, but build needs both, so it is skipped: nothing broken gets packaged.",
          active: ["lint", "test"],
          jobs: { lint: "pass", test: "fail", build: "skipped" },
        }
      : {
          title: "Both pass, build starts",
          text: "Lint and test exit with code 0. Now build gets its own fresh machine, checks out the same commit and builds the app.",
          active: ["lint", "test", "build"],
          jobs: { lint: "pass", test: "pass", build: "running" },
        },
    fail
      ? {
          title: "The log says why",
          text: "Priya opens the failed job and reads the log: which test, which line, what was expected. She still remembers what she changed ten minutes ago.",
          active: ["test", "dev"],
          jobs: { lint: "pass", test: "fail", build: "skipped" },
        }
      : {
          title: "The result is kept",
          text: "The built app is uploaded as an artifact, so a later deploy job can use exactly these files rather than building again.",
          active: ["build", "store"],
          jobs: { lint: "pass", test: "pass", build: "pass" },
        },
    {
      title: fail ? "A red cross on the pull request" : "A green tick on the pull request",
      text: fail
        ? "The result goes back to the commit as a check. If the branch rules require it, the pull request can't be merged until it's green."
        : "Each job reports back to the commit as a check. All green: reviewers know the change builds and passes, and it can be merged.",
      active: ["ci", "pr"],
      jobs: fail
        ? { lint: "pass", test: "fail", build: "skipped" }
        : { lint: "pass", test: "pass", build: "pass" },
    },
  ];
}

/** The same ideas in each platform's words. */
export const PLATFORMS = [
  "GitHub Actions",
  "GitLab CI/CD",
  "Jenkins",
  "Azure Pipelines",
  "CircleCI",
  "Tekton",
] as const;
export type Platform = (typeof PLATFORMS)[number];

export const ROWS: [string, Record<Platform, string>][] = [
  [
    "The file",
    {
      "GitHub Actions": ".github/workflows/*.yml",
      "GitLab CI/CD": ".gitlab-ci.yml",
      Jenkins: "Jenkinsfile",
      "Azure Pipelines": "azure-pipelines.yml",
      CircleCI: ".circleci/config.yml",
      Tekton: "Kubernetes YAML (Pipeline, Task)",
    },
  ],
  [
    "One run",
    {
      "GitHub Actions": "workflow run",
      "GitLab CI/CD": "pipeline",
      Jenkins: "build (of a Pipeline)",
      "Azure Pipelines": "run",
      CircleCI: "workflow",
      Tekton: "PipelineRun",
    },
  ],
  [
    "Groups in order",
    {
      "GitHub Actions": "jobs + needs",
      "GitLab CI/CD": "stages (or needs)",
      Jenkins: "stages",
      "Azure Pipelines": "stages",
      CircleCI: "jobs + requires",
      Tekton: "tasks + runAfter",
    },
  ],
  [
    "Unit on one machine",
    {
      "GitHub Actions": "job",
      "GitLab CI/CD": "job",
      Jenkins: "stage on an agent",
      "Azure Pipelines": "job",
      CircleCI: "job",
      Tekton: "TaskRun (a pod)",
    },
  ],
  [
    "Single command",
    {
      "GitHub Actions": "step (run or action)",
      "GitLab CI/CD": "script line",
      Jenkins: "step",
      "Azure Pipelines": "step / task",
      CircleCI: "step",
      Tekton: "step (a container)",
    },
  ],
  [
    "The machine",
    {
      "GitHub Actions": "runner",
      "GitLab CI/CD": "runner",
      Jenkins: "agent",
      "Azure Pipelines": "agent (in a pool)",
      CircleCI: "executor",
      Tekton: "Kubernetes pod",
    },
  ],
];
