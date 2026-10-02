/** Capstone: design a payments app's delivery pipeline, then see how it copes (illustrative). */

export type Verdict = "good" | "warn" | "bad";
export type Level = "holds" | "degrades" | "breaks";

export const DECISIONS: {
  id: string;
  area: string;
  module: number;
  options: { id: string; label: string; verdict: Verdict; note: string }[];
}[] = [
  {
    id: "branching",
    area: "Branching",
    module: 2,
    options: [
      {
        id: "long",
        label: "Feature branches merged when done",
        verdict: "bad",
        note: "Weeks apart: big, conflict-ridden merges.",
      },
      {
        id: "trunk",
        label: "Trunk-based: small pull requests merged daily",
        verdict: "good",
        note: "Small changes, one obvious suspect when something breaks.",
      },
    ],
  },
  {
    id: "tests",
    area: "Automated tests",
    module: 5,
    options: [
      {
        id: "cone",
        label: "Mostly end-to-end tests",
        verdict: "warn",
        note: "Catches journeys, but slow and often red for no reason.",
      },
      {
        id: "unit",
        label: "Unit tests only",
        verdict: "warn",
        note: "Fast, blind to wiring and journeys.",
      },
      {
        id: "pyramid",
        label: "A pyramid, flaky tests quarantined with owners",
        verdict: "good",
        note: "Fast feedback you can trust.",
      },
    ],
  },
  {
    id: "gates",
    area: "Merge rules",
    module: 7,
    options: [
      {
        id: "none",
        label: "Anyone can push to main",
        verdict: "bad",
        note: "Nothing stops a broken or unreviewed change.",
      },
      {
        id: "tests",
        label: "Tests must pass",
        verdict: "warn",
        note: "Catches regressions, not intent or risky logic.",
      },
      {
        id: "full",
        label: "Tests, review, code owners for payments, merge queue",
        verdict: "good",
        note: "Recorded approvals and a main branch that stays green.",
      },
    ],
  },
  {
    id: "artifacts",
    area: "Artifacts",
    module: 8,
    options: [
      {
        id: "rebuild",
        label: "Rebuild for each environment",
        verdict: "bad",
        note: "Production may run bytes nobody tested.",
      },
      {
        id: "once",
        label: "Build once; immutable versions; deploy by digest",
        verdict: "good",
        note: "What passed staging is exactly what runs.",
      },
    ],
  },
  {
    id: "release",
    area: "Releasing",
    module: 13,
    options: [
      {
        id: "all",
        label: "All servers at once, code and config",
        verdict: "bad",
        note: "Every bug reaches every user.",
      },
      {
        id: "codeOnly",
        label: "Canary for code; config changes pushed instantly",
        verdict: "warn",
        note: "Code is careful; configuration isn't.",
      },
      {
        id: "canary",
        label: "Canary with automatic rollback, for code and config alike",
        verdict: "good",
        note: "A bad change meets a few users, then is pulled.",
      },
    ],
  },
  {
    id: "flags",
    area: "Feature flags",
    module: 14,
    options: [
      { id: "none", label: "No flags", verdict: "warn", note: "Every fix needs a deploy." },
      {
        id: "flags",
        label: "New features behind flags, with kill switches and expiry dates",
        verdict: "good",
        note: "Release separately from deploy; switch off in seconds.",
      },
    ],
  },
  {
    id: "migrations",
    area: "Database changes",
    module: 15,
    options: [
      {
        id: "oneshot",
        label: "Schema and code change in one release",
        verdict: "bad",
        note: "Old pods break mid-rollout; rollback can't help.",
      },
      {
        id: "expand",
        label: "Expand and contract, migrations as a pipeline step",
        verdict: "good",
        note: "Old and new code both work at every step.",
      },
    ],
  },
  {
    id: "secrets",
    area: "Pipeline credentials",
    module: 17,
    options: [
      {
        id: "keys",
        label: "Long-lived cloud keys as repository secrets",
        verdict: "bad",
        note: "One leak is valid for months.",
      },
      {
        id: "oidc",
        label: "OIDC, least-privilege tokens, no secrets for outside pull requests",
        verdict: "good",
        note: "Nothing long-lived to steal.",
      },
    ],
  },
  {
    id: "supply",
    area: "Dependencies and actions",
    module: 18,
    options: [
      {
        id: "floating",
        label: "Newest versions; actions by tag",
        verdict: "bad",
        note: "Whatever was published last night runs in your build.",
      },
      {
        id: "pinned",
        label: "Lockfile and cooldown; actions pinned by SHA; provenance",
        verdict: "good",
        note: "Nothing changes without a reviewed pull request.",
      },
    ],
  },
];

export const INCIDENTS: { id: string; name: string; text: string }[] = [
  {
    id: "commit",
    name: "A broken commit",
    text: "Someone renames a function and misses one caller. The build fails.",
  },
  {
    id: "flaky",
    name: "Red builds",
    text: "A busy week: 60 pipeline runs a day, and some tests are timing-sensitive.",
  },
  {
    id: "dep",
    name: "A poisoned package",
    text: "A popular npm package your app uses publishes a malicious version overnight.",
  },
  {
    id: "fork",
    name: "A stranger's pull request",
    text: "A first-time contributor opens a pull request that tries to print environment variables.",
  },
  {
    id: "migration",
    name: "A column rename",
    text: "Release 3.2 renames payer_name to full_name in the payments table.",
  },
  {
    id: "bug",
    name: "A bug the tests missed",
    text: "Release 3.3 fails 10% of UPI refunds. No test covered it.",
  },
  {
    id: "config",
    name: "A global config change",
    text: "Someone pushes a new fraud-rules file with an empty field the code can't handle.",
  },
  {
    id: "audit",
    name: "The auditor's visit",
    text: "Auditors ask: show who approved last month's production changes, and prove what ran.",
  },
];

export interface Outcome {
  level: Level;
  text: string;
  module: number;
}

type C = Record<string, string | undefined>;

export function outcome(id: string, c: C): Outcome | null {
  switch (id) {
    case "commit":
      if (!c.gates || !c.branching) return null;
      if (c.gates === "none")
        return {
          level: "breaks",
          text: "The commit goes straight to main. Every developer pulls a broken build, and the next deploy carries it.",
          module: 7,
        };
      if (c.branching === "long")
        return {
          level: "degrades",
          text: "Checks catch it, but only at the end of a three-week branch, buried among 80 other changes.",
          module: 2,
        };
      return {
        level: "holds",
        text: "The pull request goes red within minutes. Its author, who changed it an hour ago, fixes it before lunch.",
        module: 2,
      };
    case "flaky":
      if (!c.tests) return null;
      if (c.tests === "cone")
        return {
          level: "degrades",
          text: "Slow end-to-end tests go red at random several times a day. People start re-running until green, and stop reading failures.",
          module: 5,
        };
      if (c.tests === "unit")
        return {
          level: "holds",
          text: "Few flakes and fast runs, though wiring bugs will slip through to staging.",
          module: 5,
        };
      return {
        level: "holds",
        text: "Two flaky tests are quarantined with owners; the suite stays fast and trusted.",
        module: 5,
      };
    case "dep":
      if (!c.supply) return null;
      if (c.supply === "floating")
        return {
          level: "breaks",
          text: "The morning build installs the malicious version and it runs inside your pipeline, as Shai-Hulud did to hundreds of packages in September 2025.",
          module: 18,
        };
      return {
        level: "holds",
        text: "The lockfile keeps the old version, and the cooldown means nobody adopts a release that's hours old. The bad version is pulled before you ever see it.",
        module: 18,
      };
    case "fork":
      if (!c.secrets) return null;
      if (c.secrets === "keys")
        return {
          level: "degrades",
          text: "Standard pull_request runs get no secrets, so this one fails. But long-lived keys sit in the repository waiting for the first workflow mistake, and would work for months if leaked.",
          module: 17,
        };
      return {
        level: "holds",
        text: "Outside pull requests get no secrets and a read-only token; even a leaked deploy credential would expire within the hour.",
        module: 17,
      };
    case "migration":
      if (!c.migrations) return null;
      if (c.migrations === "oneshot")
        return {
          level: "breaks",
          text: "The rename runs first; every old pod fails on payer_name mid-rollout, and rolling back the app can't bring the column back.",
          module: 15,
        };
      return {
        level: "holds",
        text: "Five small releases: add full_name, write both and backfill, read new, stop old, drop later. No errors, and rollback stays safe until the last step.",
        module: 15,
      };
    case "bug":
      if (!c.release || !c.flags) return null;
      if (c.flags === "flags")
        return {
          level: "holds",
          text: "Refunds v2 is behind a flag. On-call switches it off in seconds; no deploy, no rollback.",
          module: 14,
        };
      if (c.release === "all")
        return {
          level: "breaks",
          text: "Every user hits it until someone redeploys the previous version: tens of minutes of failed refunds.",
          module: 16,
        };
      return {
        level: "degrades",
        text: "The canary's refund errors trip the automatic rollback within minutes; only the canary's share of users saw failures.",
        module: 13,
      };
    case "config":
      if (!c.release) return null;
      if (c.release === "canary")
        return {
          level: "holds",
          text: "The rules file is rolled out like code: the canary region errors, the rollout stops, the file is reverted.",
          module: 13,
        };
      return {
        level: "breaks",
        text: "The file reaches every server within seconds and the fraud check crashes everywhere, close to what happened in Google Cloud's June 2025 outage.",
        module: 13,
      };
    case "audit":
      if (!c.gates || !c.artifacts) return null;
      if (c.gates === "full" && c.artifacts === "once")
        return {
          level: "holds",
          text: "Every change has a recorded reviewer who isn't its author, test results, and a digest tying production to the build that passed staging. Evidence in an afternoon.",
          module: 7,
        };
      if (c.gates === "none")
        return {
          level: "breaks",
          text: 'No record of who approved anything. RBI\'s directions for payment operators expect changes "managed using robust change management processes".',
          module: 12,
        };
      return {
        level: "degrades",
        text: "Some evidence exists, but either approvals or the link between what was tested and what ran is missing. Weeks of digging.",
        module: 8,
      };
  }
  return null;
}
