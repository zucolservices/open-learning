/**
 * Six weaknesses in an illustrative GitHub Actions setup, and the attacker moves each one enables.
 * Described at the level of ideas only: no working attack code.
 */

export type Door = "oidc" | "forks" | "token" | "logs" | "runner" | "pin";

export const DOORS: { id: Door; risky: string; fixed: string; fixName: string }[] = [
  {
    id: "oidc",
    risky: "A long-lived cloud access key saved as a repository secret",
    fixed: "OIDC: the job asks the cloud for a key that expires within the hour",
    fixName: "Switch to OIDC",
  },
  {
    id: "forks",
    risky: "pull_request_target checks out and runs the pull request's code, with secrets",
    fixed: "Outside pull requests run with pull_request: no secrets, read-only token",
    fixName: "Don't run untrusted code with secrets",
  },
  {
    id: "token",
    risky: "The workflow token can write to everything (permissions: write-all)",
    fixed: "permissions: contents: read, and only what each job needs",
    fixName: "Least-privilege token",
  },
  {
    id: "logs",
    risky: "A debug step prints the config, including a JSON blob of secrets",
    fixed: "Secrets are single values, never printed; derived values are masked",
    fixName: "Keep secrets out of logs",
  },
  {
    id: "runner",
    risky: "A long-lived self-hosted runner serves this public repository",
    fixed: "GitHub-hosted runners, or fresh single-use (ephemeral) self-hosted ones",
    fixName: "Fresh runner per job",
  },
  {
    id: "pin",
    risky: "A third-party action is referenced by a version tag (some-action@v4)",
    fixed: "Pinned to a full-length commit SHA (some-action@3f1c…e9a2)",
    fixName: "Pin actions to a SHA",
  },
];

export const MOVES: { id: string; text: string; blockedBy: Door[] }[] = [
  {
    id: "env",
    text: "Open a pull request that changes a build step to send the environment's secrets somewhere",
    blockedBy: ["forks"],
  },
  {
    id: "later",
    text: "Use a cloud key, copied once, from a laptop next month",
    blockedBy: ["oidc"],
  },
  {
    id: "push",
    text: "Use the workflow's token to push a commit straight to main",
    blockedBy: ["token"],
  },
  {
    id: "read",
    text: "Read a secret out of the public build log",
    blockedBy: ["logs"],
  },
  {
    id: "persist",
    text: "Leave something behind on the build machine for the next job to run",
    blockedBy: ["runner"],
  },
  {
    id: "tag",
    text: "Take over the action's v4 tag and point it at malicious code, as happened to tj-actions/changed-files in March 2025",
    blockedBy: ["pin"],
  },
];

/** OIDC exchange, frame by frame. */
export const OIDC_FRAMES: { t: string; d: string; active: number }[] = [
  {
    t: "The job asks GitHub who it is",
    d: "With permissions: id-token: write (which grants no access to the repository itself), the job requests a signed identity token from GitHub.",
    active: 0,
  },
  {
    t: "A signed token with claims",
    d: "The token says: repository acme/payments, branch main, environment production, this workflow, this run. It's signed by GitHub and lasts minutes.",
    active: 1,
  },
  {
    t: "The cloud checks its trust policy",
    d: "AWS (or Google, or Azure) checks the signature and the claims against a rule you set: audience sts.amazonaws.com, subject repo acme/payments on main. Anything else is refused.",
    active: 2,
  },
  {
    t: "A short-lived key for this job",
    d: "The cloud returns credentials for one role, valid for about an hour. The job deploys. Nothing is stored in GitHub; there's no key to steal, rotate or forget.",
    active: 3,
  },
];
