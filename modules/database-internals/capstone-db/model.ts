/**
 * Capstone: a payments database on PostgreSQL is struggling. Five problems, each with evidence to
 * read, a cause to identify and a fix. All numbers are illustrative.
 */

export interface Metrics {
  p99: number;
  disk: number;
  deadlocks: number;
  xidLeft: number;
}

export const START: Metrics = { p99: 2400, disk: 86, deadlocks: 14, xidLeft: 38 };
export const TARGET = { p99: 200 };

export interface Case {
  id: string;
  title: string;
  module: string;
  symptom: string;
  evidence: string;
  options: { id: string; label: string; correct?: boolean; feedback: string }[];
  fix: string;
  after: Partial<Metrics>;
}

export const CASES: Case[] = [
  {
    id: "scan",
    title: "The merchant dashboard",
    module: "Modules 6, 7 and 10",
    symptom: "pg_stat_statements says one query uses 41% of all database time.",
    evidence: `SELECT * FROM payments
 WHERE merchant_id = 'm_8812' AND created_at > now() - interval '1 day';

Seq Scan on payments  (rows=212) (actual time=0.03..1840.2)
  Filter: merchant_id = 'm_8812' AND created_at > ...
  Rows Removed by Filter: 48,113,904`,
    options: [
      {
        id: "index",
        label: "No index fits the query: it reads all 48 million rows",
        correct: true,
        feedback: "A sequential scan removing 48 million rows to keep 212 is the giveaway.",
      },
      {
        id: "cache",
        label: "The buffer pool is too small",
        feedback:
          "More memory would make the scan a bit faster, but it would still read every row.",
      },
      {
        id: "lock",
        label: "The query is waiting for a lock",
        feedback: "The time is spent scanning (actual time 1,840 ms of work), not waiting.",
      },
    ],
    fix: "CREATE INDEX CONCURRENTLY payments_merchant_created\n  ON payments (merchant_id, created_at);",
    after: { p99: -1600 },
  },
  {
    id: "stats",
    title: "Refund reconciliation",
    module: "Modules 11 and 12",
    symptom:
      "Since last night's bulk import of refunds, the reconciliation job takes 40 minutes instead of 2.",
    evidence: `Nested Loop  (rows=12) (actual rows=381,442)
  -> Seq Scan on refunds  (rows=12) (actual rows=381,442)
  -> Index Scan on payments ...  (loops=381,442)

last_analyze on refunds: 9 days ago`,
    options: [
      {
        id: "join",
        label: "Nested loops are always slow; disable them",
        feedback:
          "A nested loop is right for 12 rows. The planner chose it because it believed there were 12.",
      },
      {
        id: "stats",
        label: "Stale statistics: the planner expected 12 rows and got 381,442",
        correct: true,
        feedback: "Estimate versus actual is off by a factor of 30,000. Refresh the statistics.",
      },
      {
        id: "disk",
        label: "The disk is slow",
        feedback: "The plan itself is wrong for this many rows; a faster disk wouldn't fix that.",
      },
    ],
    fix: "ANALYZE refunds;\n-- the planner now picks a hash join",
    after: { p99: -400 },
  },
  {
    id: "deadlock",
    title: "Errors at settlement time",
    module: "Module 16",
    symptom: "Every evening the settlement job and the refunds service log errors.",
    evidence: `ERROR:  deadlock detected
DETAIL: Process 4127 waits for ShareLock on transaction 99812;
        blocked by process 4190.
        Process 4190 waits for ShareLock on transaction 99807;
        blocked by process 4127.
-- settlement: UPDATE accounts ... merchant, then platform
-- refunds:    UPDATE accounts ... platform, then merchant`,
    options: [
      {
        id: "timeout",
        label: "Raise deadlock_timeout so the detector waits longer",
        feedback: "That only delays detection; the cycle still forms.",
      },
      {
        id: "order",
        label: "The two services lock the same accounts in opposite orders",
        correct: true,
        feedback:
          "Merchant then platform versus platform then merchant: a cycle waiting to happen.",
      },
      {
        id: "serial",
        label: "The isolation level is too low",
        feedback: "Deadlocks come from lock order, not from the isolation level.",
      },
    ],
    fix: "-- both services: update accounts in ascending account_id order\n-- and retry a transaction that still hits a deadlock",
    after: { deadlocks: -14, p99: -80 },
  },
  {
    id: "bloat",
    title: "The growing events table",
    module: "Module 17",
    symptom:
      "payment_events has grown from 6 GB to 41 GB in a month; its row count hasn't changed much.",
    evidence: `SELECT pid, state, xact_start, query FROM pg_stat_activity
 WHERE state LIKE 'idle in transaction%';

 pid  | state               | xact_start          | query
 3301 | idle in transaction | 3 days ago          | SELECT ... -- finance export`,
    options: [
      {
        id: "idle",
        label: "A transaction left open for 3 days stops VACUUM removing dead rows",
        correct: true,
        feedback: "While it's open, every row version it might see must be kept, everywhere.",
      },
      {
        id: "inserts",
        label: "Someone is inserting duplicate events",
        feedback: "The row count is steady; the growth is dead row versions.",
      },
      {
        id: "fillfactor",
        label: "The fillfactor is too high",
        feedback: "Fillfactor affects HOT updates; it can't explain a sevenfold growth.",
      },
    ],
    fix: "SELECT pg_terminate_backend(3301);\nALTER DATABASE payments SET idle_in_transaction_session_timeout = '15min';",
    after: { disk: -24, p99: -140 },
  },
  {
    id: "wrap",
    title: "The warning nobody read",
    module: "Module 17",
    symptom: "Buried in yesterday's logs, among thousands of lines:",
    evidence: `WARNING:  database "payments" must be vacuumed within 38000000 transactions

SELECT relname, age(relfrozenxid) FROM pg_class
 ORDER BY 2 DESC LIMIT 1;
 payment_events | 2,106,000,000`,
    options: [
      {
        id: "ignore",
        label: "Just a warning; autovacuum will get to it",
        feedback:
          "Autovacuum couldn't clean that table for 3 days. Close to the limit, PostgreSQL stops assigning new transaction IDs: no writes at all.",
      },
      {
        id: "freeze",
        label: "Transaction ID wraparound is close: vacuum the oldest tables now",
        correct: true,
        feedback:
          "The open transaction held back freezing too. With it gone, a manual VACUUM catches up.",
      },
      {
        id: "restart",
        label: "Restart the server to reset the counter",
        feedback: "Restarting doesn't reset anything; only VACUUM's freezing does.",
      },
    ],
    fix: "VACUUM (VERBOSE) payment_events;\n-- and alert on age(datfrozenxid), not just on log lines",
    after: { xidLeft: 1960 },
  },
];

export function metrics(solved: string[]): Metrics {
  const m = { ...START };
  for (const c of CASES)
    if (solved.includes(c.id))
      for (const [k, v] of Object.entries(c.after)) m[k as keyof Metrics] += v as number;
  return m;
}
