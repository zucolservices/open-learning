/** A loan approval run by a central workflow or by services reacting to events (illustrative). */

export type Mode = "orch" | "chor";
export type Probe = "happy" | "fail" | "add" | "where";

export const STEPS = ["Credit check", "Fraud check", "Underwriting", "Offer letter"];

export const PROBES: Record<Probe, string> = {
  happy: "Approve a loan",
  fail: "Fraud check fails",
  add: "Add an income-verification step",
  where: "Where is application A-77?",
};

export const OUTCOMES: Record<
  Mode,
  Record<Probe, { lines: string[]; verdict: string; tone: "good" | "bad" | "neutral" }>
> = {
  orch: {
    happy: {
      lines: [
        "Loan workflow → Credit: check A-77",
        "Loan workflow → Fraud: check A-77",
        "Loan workflow → Underwriting: decide",
        "Loan workflow → Letters: send offer",
      ],
      verdict: "The whole process is written down in one place, in order.",
      tone: "good",
    },
    fail: {
      lines: [
        "Fraud → Loan workflow: flagged",
        "Loan workflow → Credit: release the hold (compensate)",
        "Loan workflow → Letters: send decline",
        "Loan workflow: A-77 = declined",
      ],
      verdict: "The orchestrator knows every step taken, so it undoes the right ones.",
      tone: "good",
    },
    add: {
      lines: [
        "Edit the loan workflow: insert 'Income check' after 'Credit check'",
        "Deploy one service",
      ],
      verdict: "One change, in one place. But every new rule lands on the same team.",
      tone: "neutral",
    },
    where: {
      lines: ["Ask the loan workflow: A-77 is waiting on Underwriting since 10:02"],
      verdict: "Instant answer. The price: a central service everything depends on.",
      tone: "good",
    },
  },
  chor: {
    happy: {
      lines: [
        "Applications publishes ApplicationReceived",
        "Credit hears it → publishes CreditChecked",
        "Fraud hears that → publishes FraudCleared",
        "Underwriting hears that → publishes LoanApproved",
        "Letters hears that → sends the offer",
      ],
      verdict: "No central controller; each service just reacts. Easy to add listeners.",
      tone: "good",
    },
    fail: {
      lines: [
        "Fraud publishes FraudFlagged",
        "Letters hears it → sends a decline ✓",
        "Credit… was never told to listen for FraudFlagged",
        "A credit hold sits on the customer for 30 days",
      ],
      verdict:
        "Every service must know which events to react to. Forget one and the process is left half-done.",
      tone: "bad",
    },
    add: {
      lines: [
        "New Income service: listen for CreditChecked, publish IncomeVerified",
        "Fraud: now listen for IncomeVerified instead",
        "Deploy three services, owned by three teams",
      ],
      verdict: "The flow lives in the subscriptions, spread across teams.",
      tone: "neutral",
    },
    where: {
      lines: [
        "Search the logs of five services for correlation ID A-77",
        "Last event seen: FraudCleared at 10:02",
      ],
      verdict: "Possible, if every event carries the ID. Nobody holds the state.",
      tone: "bad",
    },
  },
};
