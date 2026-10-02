/** A tiny model of AWS-style policy evaluation, enough for the exercises in this module. */

export interface Statement {
  effect: "Allow" | "Deny";
  actions: string[];
  resources: string[];
}

export interface Request {
  id: string;
  action: string;
  resource: string;
  label: string;
}

/** Glob match where * means any run of characters (as in IAM action and resource strings). */
export function matches(pattern: string, value: string): boolean {
  const re = new RegExp(
    "^" +
      pattern
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*")
        .replace(/\?/g, ".") +
      "$",
  );
  return re.test(value);
}

function hit(s: Statement, r: Request) {
  return (
    s.actions.some((a) => matches(a, r.action)) && s.resources.some((p) => matches(p, r.resource))
  );
}

export type Reason = "explicit-deny" | "boundary" | "allowed" | "implicit-deny";

/**
 * Explicit deny wins; a permissions boundary (if any) must also allow; otherwise any allow grants;
 * otherwise the default is deny.
 */
export function evaluate(
  policy: Statement[],
  r: Request,
  boundary?: Statement[],
): { allowed: boolean; reason: Reason } {
  if (policy.some((s) => s.effect === "Deny" && hit(s, r)))
    return { allowed: false, reason: "explicit-deny" };
  const allowed = policy.some((s) => s.effect === "Allow" && hit(s, r));
  if (allowed && boundary && !boundary.some((s) => s.effect === "Allow" && hit(s, r)))
    return { allowed: false, reason: "boundary" };
  return allowed
    ? { allowed: true, reason: "allowed" }
    : { allowed: false, reason: "implicit-deny" };
}

/** Render statements as a policy document. */
export function toJson(statements: Statement[]): string {
  const one = (xs: string[]) => (xs.length === 1 ? JSON.stringify(xs[0]) : JSON.stringify(xs));
  const body = statements
    .map(
      (s) =>
        `    {\n      "Effect": "${s.effect}",\n      "Action": ${one(s.actions)},\n      "Resource": ${one(s.resources)}\n    }`,
    )
    .join(",\n");
  return `{\n  "Version": "2012-10-17",\n  "Statement": [\n${body}\n  ]\n}`;
}
