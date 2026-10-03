/** A ₹500 transfer with and without a transaction, under three kinds of failure (illustrative). */

export type Failure = "none" | "closed" | "crash";

export const FAILURES: Record<Failure, string> = {
  none: "Nothing goes wrong",
  closed: "Ravi's account turns out to be closed",
  crash: "The app crashes between the two updates",
};

export function run(
  txn: boolean,
  f: Failure,
): { asha: number; ravi: number; steps: string[]; ok: boolean; note: string } {
  const steps = [
    txn ? "BEGIN;" : "-- autocommit: each statement is its own transaction",
    "UPDATE accounts SET balance = balance - 500 WHERE name = 'Asha';",
  ];
  if (f === "none") {
    steps.push("UPDATE accounts SET balance = balance + 500 WHERE name = 'Ravi';");
    if (txn) steps.push("COMMIT;");
    return {
      asha: 1500,
      ravi: 1500,
      steps,
      ok: true,
      note: "Both updates happen. With or without a transaction, all is well when nothing fails.",
    };
  }
  if (f === "closed") {
    steps.push("UPDATE … 'Ravi' → ERROR: account closed");
    if (txn) {
      steps.push("ROLLBACK;");
      return {
        asha: 2000,
        ravi: 1000,
        steps,
        ok: true,
        note: "The error aborts the transaction and ROLLBACK undoes Asha's debit. As if nothing happened.",
      };
    }
    return {
      asha: 1500,
      ravi: 1000,
      steps,
      ok: false,
      note: "Asha's debit was already committed on its own. ₹500 has left her account and arrived nowhere.",
    };
  }
  steps.push("✖ app crashes; connection dropped");
  if (txn)
    return {
      asha: 2000,
      ravi: 1000,
      steps,
      ok: true,
      note: "An open transaction that never committed is rolled back when the connection drops. Nothing changed.",
    };
  return {
    asha: 1500,
    ravi: 1000,
    steps,
    ok: false,
    note: "The first update committed instantly; the second never ran. Money lost.",
  };
}
