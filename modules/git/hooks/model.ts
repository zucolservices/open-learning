/**
 * Hook points and checks. Client hooks run on your machine and can be skipped (--no-verify skips
 * pre-commit and commit-msg, not prepare-commit-msg); server hooks and CI can't be skipped by a pusher.
 */

export type Point = "pre-commit" | "commit-msg" | "pre-push" | "server";

export const POINTS: { id: Point; label: string }[] = [
  { id: "pre-commit", label: "pre-commit" },
  { id: "commit-msg", label: "commit-msg" },
  { id: "pre-push", label: "pre-push" },
  { id: "server", label: "server / CI" },
];

export type Check = "secrets" | "format" | "message" | "tests";

export const CHECKS: { id: Check; label: string; best: Point[] }[] = [
  { id: "secrets", label: "Scan for secrets", best: ["pre-commit", "server"] },
  { id: "format", label: "Auto-format code", best: ["pre-commit"] },
  { id: "message", label: "Check commit message format", best: ["commit-msg", "server"] },
  { id: "tests", label: "Run the full test suite (8 minutes)", best: ["pre-push", "server"] },
];

/** Feedback on where a check is attached. */
export function placement(check: Check, at: Point[]): { good: boolean; text: string } | null {
  if (at.length === 0) return null;
  if (check === "secrets") {
    const client = at.includes("pre-commit") || at.includes("pre-push");
    if (at.includes("pre-commit") && at.includes("server"))
      return {
        good: true,
        text: "Fast feedback before the commit exists, plus a server check nobody can skip.",
      };
    if (!at.includes("server"))
      return {
        good: false,
        text: "Fast, but client hooks can be skipped or not installed. Add the server too.",
      };
    if (!client)
      return {
        good: false,
        text: "Enforced, but you only find out after pushing. Add pre-commit for instant feedback.",
      };
    return {
      good: false,
      text: "Earlier is better: pre-commit stops it before it's even committed.",
    };
  }
  const best = CHECKS.find((c) => c.id === check)!.best;
  if (at.every((p) => best.includes(p)))
    return {
      good: true,
      text: {
        format: "Fast and local: fix formatting before the commit is made.",
        message:
          "The commit-msg hook receives the message to inspect; the server can enforce it too.",
        tests: "Too slow for every commit; run before pushing, and always in CI.",
        secrets: "",
      }[check],
    };
  if (check === "tests" && at.includes("pre-commit"))
    return { good: false, text: "Eight minutes on every commit? People will skip it." };
  if (check === "message" && !at.includes("commit-msg"))
    return { good: false, text: "Only the commit-msg hook (or the server) sees the message." };
  return { good: false, text: "Works, but there's a better place." };
}

/** What happens when someone commits and pushes a file with a secret in it. */
export function outcome(
  secrets: Point[],
  noVerify: boolean,
): { stopped: boolean; lines: string[] } {
  const lines: string[] = [];
  if (secrets.includes("pre-commit")) {
    if (!noVerify)
      return {
        stopped: true,
        lines: ["pre-commit: secret detected in config.env. Commit refused."],
      };
    lines.push("--no-verify: pre-commit hook skipped. The commit is made, secret and all.");
  } else lines.push("Commit made: nothing checked it.");
  if (secrets.includes("pre-push")) {
    if (!noVerify)
      return { stopped: true, lines: [...lines, "pre-push: secret detected. Push refused."] };
    lines.push("--no-verify on push: pre-push hook skipped too.");
  }
  if (secrets.includes("server"))
    return {
      stopped: true,
      lines: [
        ...lines,
        "Server / CI: secret detected. Push rejected. Client flags can't skip this.",
      ],
    };
  return {
    stopped: false,
    lines: [...lines, "Pushed: the secret is now on the server. Revoke it!"],
  };
}
