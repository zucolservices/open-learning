/** The primary data centre floods at 2 p.m. in application season. Outcomes depend on preparation. Illustrative. */

export const BACKUPS: [string, string][] = [
  ["same", "A nightly backup, stored in the same building"],
  ["nightly", "A nightly backup, copied to a second data centre"],
  ["replica", "Continuous copying to a second data centre in another region"],
];

export const RECOVERY: [string, string][] = [
  ["rebuild", "Rebuild from scratch when needed"],
  ["plan", "A written failover plan, never tested"],
  ["drill", "A failover plan, rehearsed every quarter"],
];

export const LOGS: [string, string][] = [
  ["local", "Kept on the servers themselves"],
  ["shipped", "Copied to a separate store and kept 180 days"],
];

const PER_HOUR = 600;

export function outcome(backup: string, recovery: string, logs: string) {
  const lost =
    backup === "same"
      ? "Every application ever received"
      : backup === "nightly"
        ? `About ${(6 * PER_HOUR).toLocaleString("en-IN")} applications since midnight`
        : "Only the last few minutes' applications";
  const down =
    recovery === "rebuild"
      ? "About five days"
      : recovery === "plan"
        ? "About two days: the plan had gaps nobody knew about"
        : "About four hours";
  const audit =
    logs === "local"
      ? "Gone: nobody can show who changed which records before the flood"
      : "Intact: every change can still be traced";
  const good = backup === "replica" && recovery === "drill" && logs === "shipped";
  return { lost, down, audit, good };
}
