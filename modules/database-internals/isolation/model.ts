/**
 * Two transactions interleaved under each isolation level, with PostgreSQL's behaviour for read
 * committed, repeatable read and serializable. Read uncommitted shows what the SQL standard allows
 * (PostgreSQL treats it as read committed). Values are illustrative.
 */

export type Level = "ru" | "rc" | "rr" | "ser";
export type Scenario = "dirty" | "nonrepeat" | "lost" | "skew";

export const LEVELS: Record<Level, string> = {
  ru: "Read uncommitted",
  rc: "Read committed",
  rr: "Repeatable read",
  ser: "Serializable",
};

export const SCENARIOS: Record<Scenario, { name: string; setup: string }> = {
  dirty: {
    name: "Dirty read",
    setup: "Asha has ₹2,000. T1 starts a debit and then rolls back; T2 checks her balance.",
  },
  nonrepeat: {
    name: "Non-repeatable read",
    setup: "A report (T1) reads Asha's balance twice while a payment (T2) commits in between.",
  },
  lost: {
    name: "Lost update",
    setup:
      "10 concert tickets left. Two buyers each read the count, subtract one and write it back.",
  },
  skew: {
    name: "Write skew",
    setup:
      "Alice and Bob are the only doctors on call. Each checks at least two are on call, then goes off call.",
  },
};

export interface Line {
  t: 1 | 2;
  sql: string;
  /** What the statement returned or did, if worth showing. */
  out?: string;
  bad?: boolean;
}

export interface Run {
  lines: Line[];
  ok: boolean;
  note: string;
}

const RETRY = "ERROR: could not serialize access due to concurrent update";

export function run(sc: Scenario, lv: Level): Run {
  if (sc === "dirty") {
    const dirty = lv === "ru";
    return {
      lines: [
        { t: 1, sql: "BEGIN;" },
        { t: 1, sql: "UPDATE accounts SET balance = balance - 500 WHERE name = 'Asha';" },
        {
          t: 2,
          sql: "SELECT balance FROM accounts WHERE name = 'Asha';",
          out: dirty ? "1500" : "2000",
          bad: dirty,
        },
        { t: 1, sql: "ROLLBACK;" },
      ],
      ok: !dirty,
      note: dirty
        ? "T2 saw ₹1,500, a balance that never officially existed: T1 rolled back. That's a dirty read. (PostgreSQL never allows it; asking for read uncommitted gives you read committed.)"
        : "T2 sees only committed data, so it reads ₹2,000. Every level from read committed up prevents dirty reads.",
    };
  }
  if (sc === "nonrepeat") {
    const changes = lv === "ru" || lv === "rc";
    return {
      lines: [
        { t: 1, sql: "BEGIN;" },
        { t: 1, sql: "SELECT balance FROM accounts WHERE name = 'Asha';", out: "2000" },
        { t: 2, sql: "UPDATE accounts SET balance = 1500 WHERE name = 'Asha'; -- autocommit" },
        {
          t: 1,
          sql: "SELECT balance FROM accounts WHERE name = 'Asha';",
          out: changes ? "1500" : "2000",
          bad: changes,
        },
        { t: 1, sql: "COMMIT;" },
      ],
      ok: !changes,
      note: changes
        ? "The same query gave two answers inside one transaction. Read committed takes a fresh snapshot for every statement, so a report can add up numbers from different moments."
        : "Repeatable read takes one snapshot when the transaction's first query runs and uses it throughout, so the report sees a single moment in time.",
    };
  }
  if (sc === "lost") {
    const lost = lv === "ru" || lv === "rc";
    return {
      lines: [
        { t: 1, sql: "SELECT remaining FROM tickets;", out: "10" },
        { t: 2, sql: "SELECT remaining FROM tickets;", out: "10" },
        { t: 1, sql: "UPDATE tickets SET remaining = 9;" },
        { t: 1, sql: "COMMIT;" },
        lost
          ? { t: 2, sql: "UPDATE tickets SET remaining = 9;", out: "overwrites T1", bad: true }
          : { t: 2, sql: "UPDATE tickets SET remaining = 9;", out: RETRY },
        lost
          ? { t: 2, sql: "COMMIT;" }
          : { t: 2, sql: "-- retry: SELECT → 9, UPDATE tickets SET remaining = 8; COMMIT;" },
      ],
      ok: !lost,
      note: lost
        ? "Two tickets sold, but the count only went down by one. T2's write, based on a stale read, silently replaced T1's. That's a lost update."
        : "T2 tries to change a row that changed after its snapshot, so PostgreSQL refuses. The application retries the whole transaction, reads 9 and writes 8.",
    };
  }
  const caught = lv === "ser";
  return {
    lines: [
      { t: 1, sql: "SELECT count(*) FROM doctors WHERE on_call;", out: "2" },
      { t: 2, sql: "SELECT count(*) FROM doctors WHERE on_call;", out: "2" },
      { t: 1, sql: "UPDATE doctors SET on_call = false WHERE name = 'Alice';" },
      { t: 2, sql: "UPDATE doctors SET on_call = false WHERE name = 'Bob';" },
      { t: 1, sql: "COMMIT;" },
      caught
        ? {
            t: 2,
            sql: "COMMIT;",
            out: "ERROR: could not serialize access due to read/write dependencies among transactions",
          }
        : { t: 2, sql: "COMMIT;", out: "nobody on call", bad: true },
    ],
    ok: caught,
    note: caught
      ? "Serializable notices that each transaction read what the other wrote, a pattern no one-at-a-time order could produce, and aborts one. On retry Bob sees only one doctor on call and stays."
      : "Each read a snapshot showing two doctors, each changed a different row, so no write conflict was detected. Run one after the other, the second would have stayed; together, nobody is on call. That's write skew.",
  };
}
