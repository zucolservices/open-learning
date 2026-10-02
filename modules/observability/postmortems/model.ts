/** A blaming draft of the Friday UPI incident report, line by line, with blameless rewrites (illustrative). */

export interface Line {
  id: string;
  blame: string;
  fixed: string;
  why: string;
}

export const LINES: Line[] = [
  {
    id: "deploy",
    blame: "Ravi carelessly pushed a broken config change on a Friday evening.",
    fixed:
      "19:10 A config change lowered the gateway timeout to 2 s. It passed review and the pipeline; nothing compared it with the banks' response times.",
    why: "Name the mechanism, not the person: what let a risky change through?",
  },
  {
    id: "slow",
    blame: "The on-call engineer was slow to notice the problem.",
    fixed:
      "19:30 The first page fired 16 minutes after failures began, because the only alert watched CPU, not failed payments.",
    why: "Hindsight makes signals look obvious. Ask what the alerting actually showed at the time.",
  },
  {
    id: "support",
    blame: "Support should have escalated instead of sitting on complaints.",
    fixed:
      "19:20 Support saw a rise in complaints but had no documented way to page engineering, so they posted in a busy chat channel.",
    why: "People did what the process allowed. Fix the process.",
  },
  {
    id: "human",
    blame: "Root cause: human error.",
    fixed:
      "Contributing factors: no timeout check in the pipeline, an alert on a cause instead of a symptom, no escalation path from support, a manual rollback that took 15 minutes.",
    why: '"Human error" ends the inquiry; contributing factors start it.',
  },
  {
    id: "careful",
    blame: "Action: Ravi has been told to be more careful.",
    fixed:
      "Action: pipeline check that gateway timeouts exceed bank p99 latency. Owner: payments platform. P1. Tracked as PAY-412.",
    why: '"Be careful" can\'t be verified. A good action item has an owner, a priority and a clear end state.',
  },
];

/** GitLab.com, 31 January 2017: what the published postmortem says combined. */
export const FACTORS: [string, string][] = [
  [
    "A spike in load",
    "Database load rose sharply, which the team suspected was spam. Replication to the secondary fell behind and broke.",
  ],
  [
    "A silent tool, an undocumented runbook",
    "While rebuilding the secondary, pg_basebackup sat waiting with no output. This was normal, but not documented in the runbooks.",
  ],
  [
    "Two servers, one digit apart",
    'The primary was db1, the secondary db2. Around 23:30 UTC, while trying to restore replication, an engineer removed the data directory "errantly thinking they were doing so on the secondary".',
  ],
  [
    "Backups failing silently",
    "Nightly pg_dump backups failed on a version mismatch. The failure emails were rejected by the mail server, so nobody knew.",
  ],
  [
    "Snapshots never enabled",
    'Disk snapshots for the database servers were off: "We assumed our other backup procedures were sufficient."',
  ],
  [
    "A slow restore",
    "The best copy came from a staging snapshot taken 6 hours earlier, on slower machines in another region.",
  ],
];
